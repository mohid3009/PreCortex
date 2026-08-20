"""GPU local server -- fast (audio-only) TRIBE v2 inference.

Endpoints:
  POST /simulate  -- the PreCortex contract (GPU_LOCAL_SERVER.md): returns the
                     full tensor + sampling rate. Runs in fast mode: video is
                     stripped to audio, transcription is skipped.
  POST /analyze   -- the creator-platform output: one JSON record and one
                     brain-heatmap image (base64 PNG) per 5 seconds.
  GET  /health    -- liveness + which device the model is on.

Original spec-only implementation preserved at main.py.orig.
"""

import base64
import json
import math
import shutil
import sys
import tempfile
import threading
import traceback
from datetime import datetime
from pathlib import Path
from uuid import uuid4

import numpy as np

from fastapi import FastAPI, File, Query, Request, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

# tribe_backend.py lives one level up from this file
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
import tribe_backend

OUTPUT_ROOT = Path(__file__).resolve().parent.parent / "outputs"

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

OUTPUT_ROOT.mkdir(parents=True, exist_ok=True)
# every job's heatmaps, frames, per-window JSONs, and viewer.html are
# directly fetchable: /outputs/<job_id>/<filename>
app.mount("/outputs", StaticFiles(directory=str(OUTPUT_ROOT)), name="outputs")

model = None

# One inference at a time: the PreCortex backend retries on timeout, and two
# concurrent GPU jobs on an 8 GB card page VRAM into RAM and freeze the machine.
INFER_LOCK = threading.Lock()

# Suffixes handled by extracting their text and synthesizing speech from it.
TEXTLIKE_EXTS = {".txt", ".pdf", ".pptx"}


def _extract_text(path: Path) -> str:
    """Plain text from a .txt/.pdf/.pptx upload."""
    ext = path.suffix.lower()
    if ext == ".txt":
        return path.read_text(encoding="utf-8", errors="replace")
    if ext == ".pdf":
        from pypdf import PdfReader

        return "\n".join(page.extract_text() or "" for page in PdfReader(str(path)).pages)
    if ext == ".pptx":
        from pptx import Presentation

        chunks = []
        for slide in Presentation(str(path)).slides:
            for shape in slide.shapes:
                if getattr(shape, "has_text_frame", False):
                    chunks.append(shape.text_frame.text)
        return "\n".join(chunks)
    raise ValueError(f"no text extractor for '{ext}'")


def _text_to_speech(text: str, out_dir: Path) -> Path:
    """Synthesize text to an mp3 so it runs through the same audio pipeline."""
    from gtts import gTTS

    try:
        from langdetect import detect

        lang = detect(text)
    except Exception:
        lang = "en"
    out_dir.mkdir(parents=True, exist_ok=True)
    mp3 = out_dir / "tts.mp3"
    gTTS(text, lang=lang).save(str(mp3))
    return mp3


def _prepare_source(upload: Path, work_dir: Path) -> Path:
    """Any supported upload -> a single audio file ready for chunked inference."""
    ext = upload.suffix.lower()
    if ext in TEXTLIKE_EXTS:
        text = " ".join(_extract_text(upload).split())
        if not text:
            raise ValueError(f"{upload.name} contains no extractable text")
        return _text_to_speech(text, work_dir)
    source, modality = tribe_backend.resolve_upload(upload, work_dir)
    if modality != "audio":
        raise ValueError(f"unsupported upload type '{ext}'")
    return source


def _predict_chunked(source: Path) -> "tuple[np.ndarray, np.ndarray, float]":
    """Chunked audio-only inference: (predictions, segment bounds, duration).

    Long audio is split into 25s chunks so a 2-minute-plus upload never runs
    one giant attention pass (which exhausts the 8 GB card and freezes the
    machine) and stays well inside the backend's 300s request timeout.
    """
    with tempfile.TemporaryDirectory(prefix="tribe_chunks_") as tmp:
        chunks, duration = tribe_backend.split_audio(source, Path(tmp))
        all_preds, all_bounds = [], []
        for chunk_path, offset in chunks:
            events = tribe_backend._audio_only_events(chunk_path)
            preds, segments = model.predict(events)
            preds = np.asarray(preds, dtype=np.float32)
            if preds.ndim == 1:
                preds = preds[None, :]
            bounds = tribe_backend._segment_bounds(segments, preds.shape[0], model.data.TR)
            all_preds.append(preds)
            all_bounds.append(bounds + offset)
            del events, segments
            tribe_backend._release_gpu()
    return np.concatenate(all_preds), np.concatenate(all_bounds), duration


def _announce_viewer(url: str) -> None:
    """Print the 3D viewer link prominently in the server console."""
    print(f"\n=== 3D brain viewer ready: {url} ===\n")


def _build_sim_viewer(tensor: np.ndarray, tr: float, upload_name: str,
                      job_dir: Path, viewer_url: str) -> None:
    """Build the self-contained 3D playback viewer for a /simulate result.
    Same page tribe_backend.build_viewer writes for /analyze jobs, built
    directly from the tensor (no per-window files needed).

    Runs on a daemon thread after the response has been sent; the link is
    announced in the console once the page is written.
    """
    try:
        if not tribe_backend.VIEWER_TEMPLATE.exists():
            print("viewer_template.html not found; skipping viewer build")
            return
        job_dir.mkdir(parents=True, exist_ok=True)

        limit = float(np.percentile(np.abs(tensor), 98)) or 1.0
        quantized = (np.clip((tensor / limit + 1) / 2, 0, 1) * 255).astype(np.uint8)

        with INFER_LOCK:  # mesh loading may touch the GPU renderer
            payload = dict(tribe_backend._mesh_payload())
        payload.update(
            {
                "n_frames": int(tensor.shape[0]),
                "limit": limit,
                "frames": base64.b64encode(quantized.tobytes()).decode(),
                "thumbs": [],
                "meta": {
                    "upload": upload_name,
                    "tr": tr,
                    "n_chunks": 1,
                    "chunk_seconds": tribe_backend.CHUNK_SECONDS,
                    "generated_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                },
            }
        )
        page = tribe_backend.VIEWER_TEMPLATE.read_text(encoding="utf-8").replace(
            "__BRAINDATA__", json.dumps(payload)
        )
        viewer = job_dir / "viewer.html"
        viewer.write_text(page, encoding="utf-8")
        _announce_viewer(viewer_url)
    except Exception as e:
        print(f"Viewer build failed: {e}\n{traceback.format_exc()}")


def _uniform_tensor(preds: np.ndarray, bounds: np.ndarray, duration: float, tr: float) -> np.ndarray:
    """Re-grid predictions onto a contiguous [0, duration) timeline.

    The backend indexes rows as `tensor[int(start*sr):int(end*sr)]`
    (GPU_LOCAL_SERVER.md section 2), so rows must be a gapless time grid
    covering the whole lecture. model.predict drops empty segments, leaving
    holes; those rows are filled from the nearest predicted timestep.
    """
    n_rows = max(1, math.ceil(duration / tr))
    n_vertices = preds.shape[1]
    tensor = np.zeros((n_rows, n_vertices), dtype=np.float32)
    filled = np.zeros(n_rows, dtype=bool)
    counts = np.zeros(n_rows, dtype=np.int32)
    for row_values, (start, _stop) in zip(preds, bounds):
        idx = min(n_rows - 1, max(0, int(round(start / tr))))
        tensor[idx] = (tensor[idx] * counts[idx] + row_values) / (counts[idx] + 1)
        counts[idx] += 1
        filled[idx] = True
    if filled.any() and not filled.all():
        known = np.flatnonzero(filled)
        for gap in np.flatnonzero(~filled):
            tensor[gap] = tensor[known[np.abs(known - gap).argmin()]]
    return np.nan_to_num(tensor, nan=0.0, posinf=0.0, neginf=0.0)


@app.on_event("startup")
def load_model():
    global model
    try:
        # Audio-only feature set: no WhisperX, no Llama -- the fast path.
        model = tribe_backend.load_model(features=["audio"])
        print("TRIBE v2 model loaded (fast mode: audio-only features).")
    except Exception as e:
        print(f"Critical error: Could not load TRIBE v2 model: {e}")
        model = None


@app.get("/health")
def health():
    device = None
    if model is not None:
        inner_model = getattr(model, "_model", None)
        if inner_model is not None and hasattr(inner_model, "device"):
            device = str(inner_model.device)
        else:
            device = "loaded"
    return {
        "status": "ok",
        "model_loaded": model is not None,
        "mode": "fast-audio-only",
        "device": device,
    }


@app.post("/simulate")
def simulate(request: Request, file: UploadFile = File(...)):
    """Spec-compliant endpoint (GPU_LOCAL_SERVER.md): full tensor + sampling rate.

    Sync `def` on purpose: FastAPI runs it in the threadpool, so /health stays
    responsive during a long inference instead of blocking the event loop.
    """
    if model is None:
        return JSONResponse(
            status_code=500,
            content={"error": "TRIBE v2 model is not loaded/initialized."},
        )

    tmp_dir = Path(tempfile.mkdtemp(prefix="tribe_sim_"))
    try:
        filename = file.filename or "input.wav"
        suffix = Path(filename).suffix.lower() or ".wav"
        tmp_path = tmp_dir / f"upload{suffix}"
        tmp_path.write_bytes(file.file.read())

        source = _prepare_source(tmp_path, tmp_dir / "audio")
        with INFER_LOCK:
            preds, bounds, duration = _predict_chunked(source)
        tr = float(model.data.TR)
        tensor = _uniform_tensor(preds, bounds, duration, tr)

        job_id = f"sim_{uuid4().hex[:12]}"
        origin = str(request.base_url).rstrip("/")
        viewer_url = f"{origin}/outputs/{job_id}/viewer.html"
        threading.Thread(
            target=_build_sim_viewer,
            args=(tensor.copy(), tr, filename, OUTPUT_ROOT / job_id, viewer_url),
            daemon=True,
        ).start()

        return {
            "tensor": tensor.tolist(),
            "n_timesteps": int(tensor.shape[0]),
            "n_vertices": int(tensor.shape[1]),
            "sampling_rate_hz": round(1.0 / tr, 4),
            # extra key on top of the GPU_LOCAL_SERVER.md contract: link to the
            # interactive 3D playback of this result (ready a few seconds after
            # the response). Callers that only read the four spec keys are
            # unaffected.
            "viewer_url": viewer_url,
        }
    except Exception as e:
        print(f"Error during simulation: {e}\n{traceback.format_exc()}")
        return JSONResponse(status_code=500, content={"error": f"{type(e).__name__}: {e}"})
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


@app.post("/analyze")
def analyze(request: Request, file: UploadFile = File(...), embed: bool = Query(True)):
    """Creator-platform endpoint: per-second JSON + heatmap + video frame.

    Every window carries fetchable URLs (heatmap_url, frame_url, json_url)
    served from /outputs, plus base64 copies unless ?embed=false.

    All URLs are absolute (built from the incoming request's origin), so a
    frontend on another origin can drop heatmap/3D-viewer URLs straight into
    <img>/<iframe> tags and they resolve to this server, not the frontend.
    """
    if model is None:
        return JSONResponse(
            status_code=500,
            content={"error": "TRIBE v2 model is not loaded/initialized."},
        )
    try:
        job_id = uuid4().hex[:12]
        with INFER_LOCK:
            manifest = tribe_backend.run_bytes(
                file.file.read(),
                file.filename or "upload.wav",
                OUTPUT_ROOT / job_id,
                model=model,
                embed_images=embed,
                fast=True,
            )
        manifest["job_id"] = job_id
        origin = str(request.base_url).rstrip("/")
        base = f"{origin}/outputs/{job_id}"
        for w in manifest["windows"]:
            w["json_url"] = f"{base}/{w['json']}"
            w["heatmap_url"] = f"{base}/{w['heatmap']}" if w.get("heatmap") else None
            w["frame_url"] = f"{base}/{w['frame']}" if w.get("frame") else None
        if manifest.get("viewer"):
            manifest["viewer_url"] = f"{origin}/viewer/{job_id}"
        # flat list of every heatmap image, ready for an <img> gallery
        manifest["heatmap_urls"] = [
            w["heatmap_url"] for w in manifest["windows"] if w["heatmap_url"]
        ]
        if manifest.get("viewer_url"):
            _announce_viewer(manifest["viewer_url"])
        return manifest
    except Exception as e:
        error_details = f"Error during analysis: {e}\n{traceback.format_exc()}"
        print(error_details)
        return JSONResponse(status_code=500, content={"error": error_details})


@app.get("/viewer/{job_id}")
def viewer(job_id: str):
    """Serve a job's self-contained 3D playback page (iframe this)."""
    if not job_id.isalnum():
        return JSONResponse(status_code=400, content={"error": "invalid job id"})
    path = OUTPUT_ROOT / job_id / "viewer.html"
    if not path.exists():
        return JSONResponse(status_code=404, content={"error": f"no viewer for job {job_id}"})
    return FileResponse(path, media_type="text/html")
