"""Backend entrypoint: run TRIBE v2 over a creator's upload and emit, for every
5 seconds of the upload, one JSON record and one brain-heatmap PNG.

Video is never sent to the model. An uploaded .mp4 has its audio track
extracted to WAV with ffmpeg, and only the audio pathway runs -- the model's
video stream is left out of `features_to_use` so the video encoder is never
loaded. TRIBE's forward pass zero-fills any modality missing from the batch
(model.py:188-192), so the tri-modal checkpoint still loads and runs unchanged.
"""

from __future__ import annotations

import argparse
import base64
import datetime
import inspect
import json
import os
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

# tribev2 shells out to `whisperx` for transcription; make sure the running
# interpreter's Scripts dir is searchable even when the venv isn't activated.
os.environ["PATH"] = str(Path(sys.executable).parent) + os.pathsep + os.environ.get("PATH", "")

import numpy as np
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

import pandas as pd

from tribev2 import TribeModel
from tribev2.demo_utils import get_audio_and_text_events
from tribev2.plotting import PlotBrainPyvista


WINDOW_SECONDS = 1.0   # one JSON + heatmap per second of content
CHUNK_SECONDS = 25.0   # long audio is split into chunks this size and run per-chunk

# Modalities the model is allowed to load extractors for. "video" is omitted
# on purpose; "text" stays because the audio pipeline transcribes speech.
FEATURES_TO_USE = ["text", "audio"]

AUDIO_SAMPLE_RATE = 16000
AUDIO_CHANNELS = 1

# Suffixes tribev2 accepts directly (demo_utils.py VALID_SUFFIXES).
TEXT_EXTS = {".txt"}
NATIVE_AUDIO_EXTS = {".wav", ".mp3", ".flac", ".ogg"}
# Anything below is transcoded to WAV first: video, plus audio containers the
# library rejects.
VIDEO_EXTS = {".mp4", ".avi", ".mkv", ".mov", ".webm"}
OTHER_AUDIO_EXTS = {".m4a", ".aac", ".wma", ".opus"}


def _release_gpu() -> None:
    """Return cached CUDA memory to the driver.

    Inference reserves ~4 GB of VRAM and torch keeps it cached. The pyvista
    renderer then needs GPU memory of its own, and on an 8 GB laptop card the
    WDDM driver starts paging GPU memory into system RAM -- ballooning RSS and
    freezing the machine. Emptying the cache between stages prevents that.
    """
    import gc

    gc.collect()
    try:
        import torch

        if torch.cuda.is_available():
            torch.cuda.empty_cache()
    except Exception:
        pass


def _pick_device() -> str:
    try:
        import torch

        return "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        return "cpu"


_MODELS: dict[tuple[str, ...], TribeModel] = {}


def load_model(device: str | None = None, features: list[str] | None = None) -> TribeModel:
    """Load a TRIBE model once per feature set and reuse it.

    A server should call this at startup and hand the result to `run(model=...)`
    so the checkpoint is not reloaded per request. Fast mode uses an
    audio-only feature set, so it gets its own cached instance.
    """
    features = features or FEATURES_TO_USE
    key = tuple(features)
    if key not in _MODELS:
        config_update = {"data.features_to_use": features}
        if "text" in features:
            # Load Llama in fp16 with auto GPU/CPU placement (needs the
            # `accelerate` package). The default path loads it in fp32,
            # which costs ~13 GB of RAM and can freeze the machine.
            try:
                import accelerate  # noqa: F401

                config_update["data.text_feature.device"] = "accelerate"
            except ImportError:
                print("WARNING: `accelerate` not installed; text features will "
                      "load in fp32 and may exhaust memory.")
        _MODELS[key] = TribeModel.from_pretrained(
            "facebook/tribev2",
            device=device or _pick_device(),
            config_update=config_update,
        )
    return _MODELS[key]


def has_audio_stream(source: Path) -> bool:
    """True if the container carries at least one audio stream."""
    if shutil.which("ffprobe") is None:
        return True  # let ffmpeg be the judge
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-select_streams", "a",
         "-show_entries", "stream=index", "-of", "csv=p=0", str(source)],
        capture_output=True, text=True,
    )
    return bool(result.stdout.strip())


def to_wav(source: Path, out_dir: Path) -> Path:
    """Transcode any container to mono 16 kHz WAV, discarding video streams."""
    if shutil.which("ffmpeg") is None:
        raise RuntimeError(
            "ffmpeg is required to read this upload but was not found on PATH"
        )
    if not has_audio_stream(source):
        raise ValueError(
            f"{source.name} has no audio track. This backend runs audio-only "
            "analysis, so a silent video cannot be processed."
        )

    out_dir.mkdir(parents=True, exist_ok=True)
    wav = out_dir / f"{source.stem}.wav"
    command = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-i", str(source),
        "-vn",                              # drop the video stream entirely
        "-ac", str(AUDIO_CHANNELS),
        "-ar", str(AUDIO_SAMPLE_RATE),
        "-c:a", "pcm_s16le",
        str(wav),
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0 or not wav.exists():
        raise RuntimeError(
            f"ffmpeg could not extract audio from {source.name}:\n{result.stderr.strip()}"
        )

    print(f"Extracted audio: {source.name} -> {wav.name}")
    return wav


def audio_duration(path: Path) -> float:
    """Duration of an audio file in seconds, via ffprobe."""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "csv=p=0", str(path)],
        capture_output=True, text=True,
    )
    try:
        return float(result.stdout.strip())
    except ValueError:
        raise RuntimeError(f"Could not read duration of {path.name}:\n{result.stderr.strip()}")


def split_audio(source: Path, out_dir: Path, chunk_seconds: float = CHUNK_SECONDS):
    """Split audio into fixed-size WAV chunks; returns [(chunk_path, offset_s)].

    Audio at or under `chunk_seconds` is returned as-is with offset 0.
    """
    duration = audio_duration(source)
    if duration <= chunk_seconds:
        return [(source, 0.0)], duration

    out_dir.mkdir(parents=True, exist_ok=True)
    chunks = []
    offset = 0.0
    index = 0
    while offset < duration - 0.05:  # skip a trailing sliver of <50ms
        chunk = out_dir / f"{source.stem}_chunk{index:03d}.wav"
        command = [
            "ffmpeg", "-y", "-loglevel", "error",
            "-ss", f"{offset:.3f}", "-t", f"{chunk_seconds:.3f}",
            "-i", str(source),
            "-vn", "-ac", str(AUDIO_CHANNELS), "-ar", str(AUDIO_SAMPLE_RATE),
            "-c:a", "pcm_s16le",
            str(chunk),
        ]
        result = subprocess.run(command, capture_output=True, text=True)
        if result.returncode != 0 or not chunk.exists():
            raise RuntimeError(
                f"ffmpeg failed to cut chunk {index} of {source.name}:\n{result.stderr.strip()}"
            )
        chunks.append((chunk, offset))
        offset += chunk_seconds
        index += 1
    print(f"Split {source.name} ({duration:.1f}s) into {len(chunks)} chunks of <= {chunk_seconds:.0f}s")
    return chunks, duration


def resolve_upload(upload: Path, work_dir: Path) -> tuple[Path, str]:
    """Map an upload to the file and modality actually handed to the model."""
    ext = upload.suffix.lower()
    if ext in TEXT_EXTS:
        return upload, "text"
    if ext in NATIVE_AUDIO_EXTS:
        return upload, "audio"
    if ext in VIDEO_EXTS or ext in OTHER_AUDIO_EXTS:
        return to_wav(upload, work_dir), "audio"
    raise ValueError(
        f"Unsupported upload type '{ext}'. Supported: "
        f"{sorted(TEXT_EXTS | NATIVE_AUDIO_EXTS | VIDEO_EXTS | OTHER_AUDIO_EXTS)}"
    )


def _segment_bounds(segments, n_timesteps: int, tr: float) -> np.ndarray:
    """(start, stop) seconds for each predicted timestep.

    `predict` returns neuralset Segment objects carrying absolute `.start` and
    `.duration`. Empty segments are dropped upstream, so timesteps are not
    necessarily contiguous -- read the real times rather than assuming a grid.
    """
    starts = []
    for segment in segments[:n_timesteps]:
        start = getattr(segment, "start", None)
        if start is None:
            break
        duration = getattr(segment, "duration", tr)
        starts.append((float(start), float(start) + float(duration)))

    if len(starts) == n_timesteps:
        return np.asarray(starts, dtype=float)

    print("Segment times unavailable; falling back to a uniform TR grid.")
    grid = np.arange(n_timesteps, dtype=float) * tr
    return np.stack([grid, grid + tr], axis=1)


def _windows(bounds: np.ndarray, window_seconds: float):
    """Yield (index, start_s, end_s, member_indices) per fixed-length window."""
    if bounds.size == 0:
        return
    starts = bounds[:, 0]
    origin = float(starts.min())
    n_windows = max(1, int(np.ceil((float(starts.max()) - origin) / window_seconds)) + 1)
    for i in range(n_windows):
        start = origin + i * window_seconds
        end = start + window_seconds
        members = np.flatnonzero((starts >= start) & (starts < end))
        if members.size:
            yield i, start, end, members


def _render_heatmap(brain: PlotBrainPyvista, values: np.ndarray, out_path: Path) -> bool:
    """Render one window's vertex values as a brain heatmap. True if written."""
    frame = np.asarray(values, dtype=float)[None, :]
    params = inspect.signature(brain.plot_timesteps).parameters

    kwargs = {}
    if "views" in params:
        kwargs["views"] = "left"
    for name in ("filename", "save_path", "output_path", "outfile", "path", "save"):
        if name in params:
            kwargs[name] = str(out_path)
            break

    try:
        result = brain.plot_timesteps(frame, **kwargs)
    except Exception as exc:  # keep the JSON stream alive if rendering fails
        print(f"  heatmap failed for {out_path.name}: {exc}")
        return False

    if out_path.exists():
        return True

    for hook in ("screenshot", "save", "savefig"):
        fn = getattr(brain, hook, None)
        if callable(fn):
            try:
                fn(str(out_path))
            except Exception:
                continue
            if out_path.exists():
                return True

    if isinstance(result, (str, Path)) and Path(result).exists():
        shutil.copyfile(result, out_path)
        return True

    if plt.get_fignums():
        plt.savefig(out_path, dpi=150, bbox_inches="tight")
        plt.close("all")
        return out_path.exists()

    print(f"  heatmap not saved for {out_path.name}: no output produced")
    return False


def _close_leaked_plotters() -> None:
    """Close any pyvista plotters left open by a render.

    tribev2's plot_surf calls pl.clear() instead of pl.close(), leaking one
    VTK render window per heatmap (~0.3 GB each) -- enough renders freeze the
    machine. The installed copy is patched, but this guard keeps the pipeline
    safe even if tribev2 is ever reinstalled.
    """
    try:
        import pyvista as pv

        pv.close_all()
    except Exception:
        pass
    plt.close("all")


def extract_frame(video: Path, time_s: float, out_path: Path, width: int = 256) -> bool:
    """Grab one frame from the video at time_s as a small JPEG."""
    command = [
        "ffmpeg", "-y", "-loglevel", "error",
        "-ss", f"{time_s:.3f}", "-i", str(video),
        "-frames:v", "1", "-vf", f"scale={width}:-2", "-q:v", "5",
        str(out_path),
    ]
    result = subprocess.run(command, capture_output=True, text=True)
    return result.returncode == 0 and out_path.exists()


def _audio_only_events(source: Path) -> pd.DataFrame:
    """Events for an audio file WITHOUT transcription.

    Mirrors get_events_dataframe's audio branch (demo_utils.py:319-327) but
    passes audio_only=True, skipping WhisperX and every text-side transform --
    by far the slowest part of the pipeline.
    """
    event = {
        "type": "Audio",
        "filepath": str(source),
        "start": 0,
        "timeline": "default",
        "subject": "default",
    }
    return get_audio_and_text_events(pd.DataFrame([event]), audio_only=True)


def run(
    upload: Path,
    out_dir: Path,
    window_seconds: float = WINDOW_SECONDS,
    model: TribeModel | None = None,
    embed_images: bool = False,
    fast: bool = False,
    chunk_seconds: float = CHUNK_SECONDS,
) -> dict:
    """Analyze one upload and write per-window JSON + heatmaps into `out_dir`.

    Audio longer than `chunk_seconds` is split into chunks of that size, each
    run through the model separately; results are compiled into one manifest
    on the original timeline.

    Pass `model` to reuse an already-loaded TribeModel (a server should).
    Set `embed_images` to also return each heatmap as a base64 data URI, so an
    API response can carry the images without serving files.
    Set `fast` to skip transcription and text features (audio-only inference):
    much faster, somewhat less accurate predictions.
    """
    upload = Path(upload)
    out_dir = Path(out_dir)
    out_dir.mkdir(parents=True, exist_ok=True)

    source, modality = resolve_upload(upload, out_dir / "audio")
    # keep the original video around for per-window frame grabs
    video_source = upload if upload.suffix.lower() in VIDEO_EXTS else None
    fast = fast and modality == "audio"  # text uploads have nothing to skip
    mode = "fast audio-only" if fast else modality
    print(f"Running {mode} analysis on {source.name}")

    if fast and model is not None:
        # Fast events carry no text, so the model must not expect text features.
        used = list(getattr(model.data, "features_to_use", []))
        if used != ["audio"]:
            model = None
    if model is None:
        model = load_model(features=["audio"] if fast else None)

    chunk_infos = []
    if modality == "audio":
        chunks, _ = split_audio(source, out_dir / "audio", chunk_seconds)
    else:
        chunks = [(source, 0.0)]

    all_preds, all_bounds = [], []
    for chunk_index, (chunk_path, offset) in enumerate(chunks):
        if fast:
            events = _audio_only_events(chunk_path)
        else:
            kwarg = "audio_path" if modality == "audio" else "text_path"
            events = model.get_events_dataframe(**{kwarg: str(chunk_path)})
        preds, segments = model.predict(events)

        preds = np.asarray(preds, dtype=np.float32)
        if preds.ndim == 1:
            preds = preds[None, :]
        chunk_bounds = _segment_bounds(segments, preds.shape[0], model.data.TR) + offset

        all_preds.append(preds)
        all_bounds.append(chunk_bounds)
        del events, segments
        _release_gpu()  # keep VRAM flat across chunks
        chunk_infos.append(
            {
                "chunk_index": chunk_index,
                "offset_seconds": round(offset, 3),
                "n_timesteps": int(preds.shape[0]),
            }
        )
        if len(chunks) > 1:
            print(f"  chunk {chunk_index + 1}/{len(chunks)} done ({preds.shape[0]} timesteps)")

    predictions = np.concatenate(all_preds)
    bounds = np.concatenate(all_bounds)
    del all_preds, all_bounds
    _release_gpu()  # hand VRAM back before the renderer needs it
    print("Predictions shape:", predictions.shape)
    brain = PlotBrainPyvista(mesh="fsaverage5")

    windows = []
    for index, start, end, members in _windows(bounds, window_seconds):
        values = predictions[members].mean(axis=0)
        stem = f"window_{index:04d}"
        json_path = out_dir / f"{stem}.json"
        image_path = out_dir / f"{stem}.png"

        has_image = _render_heatmap(brain, values, image_path)
        _close_leaked_plotters()

        frame_path = None
        if video_source is not None:
            candidate = out_dir / f"{stem}_frame.jpg"
            if extract_frame(video_source, (start + end) / 2, candidate):
                frame_path = candidate

        record = {
            "window_index": index,
            "start_seconds": round(start, 3),
            "end_seconds": round(end, 3),
            "n_timesteps": int(members.size),
            "n_vertices": int(values.size),
            "stats": {
                "mean": float(values.mean()),
                "min": float(values.min()),
                "max": float(values.max()),
                "peak_vertex": int(np.argmax(values)),
            },
            "heatmap": image_path.name if has_image else None,
            "frame": frame_path.name if frame_path else None,
            "values": [float(v) for v in values],
        }
        json_path.write_text(json.dumps(record, indent=2), encoding="utf-8")

        entry = {
            "window_index": index,
            "start_seconds": record["start_seconds"],
            "end_seconds": record["end_seconds"],
            "json": json_path.name,
            "heatmap": record["heatmap"],
            "frame": record["frame"],
            "stats": record["stats"],
        }
        if embed_images and has_image:
            encoded = base64.b64encode(image_path.read_bytes()).decode("ascii")
            entry["heatmap_base64"] = f"data:image/png;base64,{encoded}"
        if embed_images and frame_path:
            encoded = base64.b64encode(frame_path.read_bytes()).decode("ascii")
            entry["frame_base64"] = f"data:image/jpeg;base64,{encoded}"
        windows.append(entry)
        print(f"  {stem}: {start:.1f}s-{end:.1f}s ({members.size} timesteps)")

    manifest = {
        "upload": upload.name,
        "analyzed_file": source.name,
        "modality": modality,
        "features_used": list(getattr(model.data, "features_to_use", FEATURES_TO_USE)),
        "fast_mode": fast,
        "window_seconds": window_seconds,
        "chunk_seconds": chunk_seconds,
        "n_chunks": len(chunk_infos),
        "chunks": chunk_infos,
        "tr_seconds": float(model.data.TR),
        "n_windows": len(windows),
        "n_timesteps": int(predictions.shape[0]),
        "duration_seconds": round(float(bounds[:, 1].max()) if bounds.size else 0.0, 3),
        "windows": windows,
    }
    viewer = build_viewer(out_dir, manifest)
    manifest["viewer"] = viewer.name if viewer else None
    (out_dir / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
    return manifest


_MESH_CACHE: dict | None = None

VIEWER_TEMPLATE = Path(__file__).resolve().parent / "viewer_template.html"


def _mesh_payload() -> dict:
    """fsaverage5 geometry as base64, cached per process."""
    global _MESH_CACHE
    if _MESH_CACHE is None:
        brain = PlotBrainPyvista(mesh="fsaverage5")
        m = brain.get_mesh()["both"]
        coords = np.asarray(m["coords"], dtype=np.float32)
        faces = np.asarray(m["faces"], dtype=np.uint32)
        bg = np.asarray(m["bg_map"], dtype=np.float32)
        bgn = ((bg - bg.min()) / (np.ptp(bg) + 1e-9) * 255).astype(np.uint8)
        _MESH_CACHE = {
            "n_vertices": int(coords.shape[0]),
            "n_faces": int(faces.shape[0]),
            "coords": base64.b64encode(coords.tobytes()).decode(),
            "faces": base64.b64encode(faces.tobytes()).decode(),
            "bg": base64.b64encode(bgn.tobytes()).decode(),
        }
    return _MESH_CACHE


def build_viewer(out_dir: Path, manifest: dict) -> Path | None:
    """Write a self-contained 3D playback page (viewer.html) for one run.

    The page embeds the mesh, every window's vertex values, and (for video
    uploads) the per-second frame thumbnails -- a frontend can iframe it
    directly, no other assets needed.
    """
    if not VIEWER_TEMPLATE.exists():
        print("viewer_template.html not found; skipping viewer build")
        return None
    out_dir = Path(out_dir)

    vals, thumbs = [], []
    for entry in manifest["windows"]:
        record = json.loads((out_dir / entry["json"]).read_text(encoding="utf-8"))
        vals.append(np.asarray(record["values"], dtype=np.float32))
        frame_name = entry.get("frame")
        if frame_name and (out_dir / frame_name).exists():
            jpg = (out_dir / frame_name).read_bytes()
            thumbs.append("data:image/jpeg;base64," + base64.b64encode(jpg).decode())
        else:
            thumbs.append(None)
    if not vals:
        return None

    V = np.stack(vals)
    lim = float(np.percentile(np.abs(V), 98)) or 1.0
    Vq = (np.clip((V / lim + 1) / 2, 0, 1) * 255).astype(np.uint8)

    payload = dict(_mesh_payload())
    payload.update(
        {
            "n_frames": int(V.shape[0]),
            "limit": lim,
            "frames": base64.b64encode(Vq.tobytes()).decode(),
            "thumbs": thumbs if any(thumbs) else [],
            "meta": {
                "upload": manifest.get("upload"),
                "tr": manifest.get("tr_seconds", 1.0),
                "n_chunks": manifest.get("n_chunks", 1),
                "chunk_seconds": manifest.get("chunk_seconds", CHUNK_SECONDS),
                "generated_at": datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
            },
        }
    )

    html = VIEWER_TEMPLATE.read_text(encoding="utf-8").replace(
        "__BRAINDATA__", json.dumps(payload)
    )
    viewer_path = out_dir / "viewer.html"
    viewer_path.write_text(html, encoding="utf-8")
    print(f"Viewer written: {viewer_path}")
    return viewer_path


def run_bytes(
    data: bytes,
    filename: str,
    out_dir: Path,
    window_seconds: float = WINDOW_SECONDS,
    model: TribeModel | None = None,
    embed_images: bool = True,
    fast: bool = False,
    chunk_seconds: float = CHUNK_SECONDS,
) -> dict:
    """Analyze raw upload bytes -- the shape a FastAPI handler already has.

    `filename` only supplies the suffix used to route the upload, so a WAV body
    posted as `clip.wav` goes straight down the audio path.
    """
    name = Path(filename).name
    suffix = Path(name).suffix.lower() or ".wav"
    # Keep the creator's own filename (basename only -- never trust a client path).
    stem = "".join(c for c in Path(name).stem if c.isalnum() or c in "-_ ").strip() or "upload"

    tmp_dir = Path(tempfile.mkdtemp(prefix="tribe_upload_"))
    tmp_path = tmp_dir / f"{stem}{suffix}"
    try:
        tmp_path.write_bytes(data)
        return run(
            tmp_path,
            out_dir,
            window_seconds=window_seconds,
            model=model,
            embed_images=embed_images,
            fast=fast,
            chunk_seconds=chunk_seconds,
        )
    finally:
        shutil.rmtree(tmp_dir, ignore_errors=True)


TEST_SPEECH = (
    "Photosynthesis is the process by which green plants convert sunlight "
    "into chemical energy. Inside the chloroplasts, light reactions split "
    "water molecules and release oxygen. The Calvin cycle then uses that "
    "energy to turn carbon dioxide into glucose. This is why plants are "
    "called the primary producers of almost every ecosystem on Earth. "
    "Without photosynthesis there would be no oxygen in the atmosphere, "
    "no food chains as we know them, and no fossil fuels, because coal "
    "and oil are simply ancient sunlight stored by plants long ago."
)


def make_test_wav(path: Path) -> Path:
    """Synthesize a short spoken-word WAV offline via Windows' built-in TTS.

    Gives the pipeline real speech to transcribe without needing an upload.
    """
    path = Path(path).resolve()
    path.parent.mkdir(parents=True, exist_ok=True)
    script = (
        "Add-Type -AssemblyName System.Speech; "
        "$s = New-Object System.Speech.Synthesis.SpeechSynthesizer; "
        f"$s.SetOutputToWaveFile('{path}'); "
        f"$s.Speak('{TEST_SPEECH}'); "
        "$s.Dispose()"
    )
    result = subprocess.run(
        ["powershell", "-NoProfile", "-Command", script],
        capture_output=True, text=True,
    )
    if result.returncode != 0 or not path.exists():
        raise RuntimeError(f"Windows TTS failed:\n{result.stderr.strip()}")
    print(f"Synthesized test speech: {path.name}")
    return path


def self_test(out_dir: Path, window_seconds: float = WINDOW_SECONDS, fast: bool = False) -> None:
    """Generate spoken audio, run the full pipeline, and verify the outputs."""
    wav = make_test_wav(out_dir / "self_test_input.wav")
    manifest = run(wav, out_dir, window_seconds=window_seconds, fast=fast)

    problems = []
    if manifest["n_windows"] == 0:
        problems.append("no windows were produced")
    for entry in manifest["windows"]:
        json_path = out_dir / entry["json"]
        if not json_path.exists():
            problems.append(f"missing {entry['json']}")
        if entry["heatmap"] is None:
            problems.append(f"window {entry['window_index']} has no heatmap image")
        elif not (out_dir / entry["heatmap"]).exists():
            problems.append(f"missing {entry['heatmap']}")

    print()
    print(f"Duration analyzed : {manifest['duration_seconds']}s")
    print(f"Timesteps         : {manifest['n_timesteps']} (TR={manifest['tr_seconds']}s)")
    print(f"Windows written   : {manifest['n_windows']} x {window_seconds}s -> {out_dir}")
    if problems:
        print("SELF-TEST FAILED:")
        for p in problems:
            print(f"  - {p}")
        raise SystemExit(1)
    print("SELF-TEST PASSED: JSON + heatmap present for every window.")


def main():
    parser = argparse.ArgumentParser(
        description="Run TRIBE v2 audio analysis on an upload and emit per-5s JSON + heatmaps."
    )
    parser.add_argument("upload", type=Path, nargs="?",
                        help="uploaded video, audio, or text file")
    parser.add_argument("--out-dir", type=Path, default=Path("outputs"))
    parser.add_argument("--window-seconds", type=float, default=WINDOW_SECONDS)
    parser.add_argument("--chunk-seconds", type=float, default=CHUNK_SECONDS,
                        help="split audio longer than this into chunks run separately")
    parser.add_argument("--self-test", action="store_true",
                        help="synthesize spoken audio and run the whole pipeline on it")
    parser.add_argument("--fast", action="store_true",
                        help="skip transcription/text features: audio-only inference")
    args = parser.parse_args()

    if args.self_test:
        self_test(args.out_dir, args.window_seconds, fast=args.fast)
        return

    if args.upload is None:
        parser.error("provide an upload file, or use --self-test")
    if not args.upload.exists():
        parser.error(f"upload not found: {args.upload}")

    manifest = run(args.upload, args.out_dir, args.window_seconds, fast=args.fast,
                   chunk_seconds=args.chunk_seconds)
    print(f"Wrote {manifest['n_windows']} windows to {args.out_dir}")


if __name__ == "__main__":
    main()
