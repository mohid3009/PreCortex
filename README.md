# PreCortex

**Predicting cortical response to lecture and creator content with a pretrained brain-encoding model.**

PreCortex takes a piece of media (a lecture video, audio recording, slide deck, PDF or text file) and returns a *predicted* time series of cortical activity across the brain surface, one frame per second of content. The predictions come from [TRIBE v2](https://huggingface.co/facebook/tribev2) (`facebook/tribev2`), a pretrained encoding model that maps stimulus features to fMRI-like responses on the `fsaverage5` cortical mesh. This repository contains the inference service, the chunking and re-gridding logic that makes it practical on a consumer GPU, and an interactive 3D viewer for the output.

> **Status: research prototype.** The repository implements the inference and visualisation pipeline. It does not yet include a quantitative validation of the predictions against measured responses, and none is claimed here. See [Limitations](#8-limitations).

---

## Contents

1. [Abstract](#1-abstract)
2. [Motivation](#2-motivation)
3. [Method](#3-method)
4. [System architecture](#4-system-architecture)
5. [Installation](#5-installation)
6. [Usage](#6-usage)
7. [Output format](#7-output-format)
8. [Limitations](#8-limitations)
9. [Roadmap and open questions](#9-roadmap-and-open-questions)
10. [Repository layout](#10-repository-layout)
11. [Citation and acknowledgements](#11-citation-and-acknowledgements)

---

## 1. Abstract

Educators and content creators receive no direct signal about how a viewer's brain might respond to what they produce. Measuring this with fMRI is impractical at scale. PreCortex explores an in-silico alternative: run the stimulus through a pretrained brain-encoding model and read out a predicted per-second cortical activation map. The system accepts video, audio, text, PDF and PPTX uploads, reduces each to an audio (or text) stream, runs windowed inference with overlapping context to avoid boundary artefacts, and exposes the result as (a) a dense `n_timesteps × n_vertices` tensor for downstream scoring and (b) per-second heatmaps and a self-contained WebGL playback viewer.

## 2. Motivation

- **Cost of ground truth.** Neuroimaging is slow and expensive, so it cannot be used to iterate on everyday teaching or creative content.
- **Availability of encoding models.** Pretrained models that predict brain responses from naturalistic stimuli make a cheap proxy available, provided their outputs are treated as predictions rather than measurements.
- **Engineering gap.** Research checkpoints are not directly usable on long, mixed-format uploads. They assume specific input types, can exhaust memory on long inputs, and emit raw arrays that are hard to inspect. This project closes that gap.

The downstream use case is a platform that scores lecture segments by predicted engagement. It consumes the tensor through a fixed HTTP contract ([`resources/GPU_LOCAL_SERVER.md`](resources/GPU_LOCAL_SERVER.md)).

## 3. Method

### 3.1 Model

Inference uses the `facebook/tribev2` checkpoint through the `tribev2` package. The model is tri-modal (text, audio, video). Here it is run with a **reduced modality set**:

| Mode | `features_to_use` | Transcription | Notes |
|---|---|---|---|
| Full | `["text", "audio"]` | WhisperX | Llama text features loaded in fp16 via `accelerate` to avoid a ~13 GB fp32 load. Slower. |
| Fast (default for the server) | `["audio"]` | skipped | Audio-only events; no WhisperX, no Llama. Much faster, expected to be less accurate. |

The video encoder is never loaded. Missing modalities are zero-filled by the model's forward pass, so the tri-modal checkpoint runs unchanged. The video track is discarded and only audio is analysed. This is a deliberate trade-off between cost and fidelity, and it means visual content (slides, demonstrations, faces) does not influence the prediction.

### 3.2 Input normalisation

All uploads are reduced to one audio file (or a text file) before inference:

- **Video / unsupported audio containers** (`.mp4 .avi .mkv .mov .webm .m4a .aac .wma .opus`): transcoded with `ffmpeg` to mono, 16 kHz, 16-bit PCM WAV, with video streams dropped. Files without an audio stream are rejected.
- **Native audio** (`.wav .mp3 .flac .ogg`): used as is.
- **Text-like documents** (`.txt .pdf .pptx`): text is extracted (`pypdf`, `python-pptx`), language-detected (`langdetect`), and synthesised to speech with `gTTS`, so documents flow through the same audio pathway. Predictions for these inputs therefore reflect *synthetic speech* of the text, not reading.

### 3.3 Overlapped chunking

Running one attention pass over a long recording exhausts an 8 GB GPU. Audio longer than 25 s is split into core chunks of 25 s, each extracted with **5 s of surrounding context on each side**. Only predictions whose start time falls inside the core interval are kept; the context predictions are discarded. Without this, each chunk boundary shows a spike or dip where the model runs out of context. This was the subject of the most recent change (`46f9485`).

Chunk size and overlap are the constants `CHUNK_SECONDS` and `CHUNK_OVERLAP_SECONDS` in [`tribe_backend.py`](tribe_backend.py). VRAM is released between chunks.

### 3.4 Temporal re-gridding

`model.predict` drops empty segments, so returned timesteps are not guaranteed to be contiguous. Two representations are produced:

- **Windows** (`/analyze`): predictions are bucketed into fixed windows (default 1 s) and averaged per window. Window times are read from the segment objects rather than assumed from a uniform grid.
- **Uniform tensor** (`/simulate`): predictions are placed on a gapless grid of `ceil(duration / TR)` rows, with repeated hits averaged and gaps filled from the nearest predicted timestep. The downstream consumer indexes rows as `tensor[int(start·sr) : int(end·sr)]`, so the grid must cover the full duration.

### 3.5 Visualisation

Per-window values are rendered on `fsaverage5` with PyVista (left-hemisphere view). A self-contained `viewer.html` (WebGL2, no external assets) embeds the mesh and all frames, quantised to 8 bits against the 98th percentile of absolute activation, with per-second video thumbnails where available. The page can be iframed directly.

## 4. System architecture

```
 upload (mp4 / mp3 / wav / pdf / pptx / txt)
        │
        ▼
 normalise ──► audio WAV (16 kHz mono)   or   text → TTS → audio
        │
        ▼
 split into 25 s chunks (+5 s context each side)
        │
        ▼
 TRIBE v2 predict  ──►  trim context  ──►  concatenate on original timeline
        │
        ├──► /simulate : uniform tensor  (n_timesteps × n_vertices) + sampling rate
        └──► /analyze  : per-window JSON + heatmap PNG + frame + viewer.html
```

A single `threading.Lock` serialises inference. The consuming backend retries on timeout, and two concurrent jobs on an 8 GB card page VRAM into system RAM and can freeze the machine.

## 5. Installation

**Requirements**

- Python 3.10+ (inferred from the code; no version pin is recorded in the repo)
- An NVIDIA GPU is strongly recommended (the code falls back to CPU). The memory handling is tuned for an 8 GB laptop card.
- [`ffmpeg`](https://ffmpeg.org/) and `ffprobe` on `PATH`
- The `tribev2` package and access to the `facebook/tribev2` weights on Hugging Face
- `accelerate`, if you run the full (text + audio) mode

```bash
git clone https://github.com/mohid3009/Precortex-main.git
cd Precortex-main
python -m venv venv && source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r local-server/requirements.txt
# plus tribev2 and its dependencies (torch, pyvista, whisperx, ...), installed per the tribev2 instructions
```

`local-server/requirements.txt` lists only the server-side dependencies (FastAPI, uvicorn, python-multipart, numpy, pypdf, python-pptx, gtts, langdetect). The model stack is **not** pinned in this repository.

## 6. Usage

### 6.1 Command line

```bash
# analyse a file; writes window_XXXX.json/.png, manifest.json and viewer.html to outputs/
python tribe_backend.py lecture.mp4 --out-dir outputs

# audio-only fast mode, custom chunking
python tribe_backend.py lecture.mp3 --fast --chunk-seconds 25

# end-to-end self-test: synthesises speech (Windows TTS), runs the pipeline, checks outputs
python tribe_backend.py --self-test
```

The self-test uses the Windows speech synthesiser and so runs on Windows only.

### 6.2 HTTP server

```bash
cd local-server
uvicorn main:app --host 0.0.0.0 --port 8001
```

| Endpoint | Purpose |
|---|---|
| `POST /simulate` | The PreCortex contract. Multipart `file` in, `tensor`, `n_timesteps`, `n_vertices`, `sampling_rate_hz` out, plus an extra `viewer_url`. |
| `POST /analyze` | Per-second JSON, heatmap and frame for each window, with URLs (and base64 unless `?embed=false`). |
| `GET /viewer/{job_id}` | Interactive 3D playback page for a job. |
| `GET /health` | Liveness, whether the model loaded, device. |
| `GET /outputs/...` | Static access to generated artefacts. |

```bash
curl -F "file=@lecture.mp4" http://localhost:8001/simulate
```

The full request/response contract, timeouts and retry semantics are in [`resources/GPU_LOCAL_SERVER.md`](resources/GPU_LOCAL_SERVER.md).

> **Security note.** The server sends no auth headers and enables permissive CORS (`allow_origins=["*"]`). It is meant for a trusted private network or VPN. Do not expose port 8001 to the public internet.

## 7. Output format

`manifest.json` summarises a run:

| Field | Meaning |
|---|---|
| `modality`, `features_used`, `fast_mode` | How the input was routed and which feature extractors were used |
| `tr_seconds` | Model repetition time; the native timestep of predictions |
| `window_seconds`, `n_windows`, `n_timesteps`, `duration_seconds` | Temporal structure of the result |
| `chunks` | Per-chunk offset and timesteps kept |
| `windows[]` | Per-window time range, summary `stats` (mean, min, max, peak vertex), and file references |

Each `window_XXXX.json` also carries the full vertex vector (`n_vertices` floats on `fsaverage5`). Activations are the model's predicted response units; they should be compared **within** a run, not read as absolute physiological quantities.

## 8. Limitations

1. **No empirical validation in this repository.** Predictions have not been compared against measured fMRI or behavioural outcomes here. Any link between predicted activation and "engagement" or learning is a hypothesis.
2. **Audio-only by default.** Fast mode discards visual information and, in the server, transcription. Reduced accuracy relative to the full model is expected but has not been quantified here.
3. **Documents are analysed as synthetic speech.** PDF, PPTX and TXT inputs pass through TTS, which changes prosody and timing relative to a human lecturer.
4. **Population-level model.** The checkpoint predicts a generic response, not any individual's brain.
5. **Resolution.** `fsaverage5` has about 20,000 vertices, so fine-grained cortical structure is not resolved. The model's TR bounds temporal resolution, and the per-second windows are an aggregation of it.
6. **Normalisation is per run.** The viewer scales to the 98th percentile of that run's activations, so colour intensity is not comparable between runs.
7. **Operational constraints.** A single global inference lock, a 300 s upstream timeout, and a JSON tensor transport that grows large at full vertex resolution. A binary `.npy` transfer is the agreed fallback.

## 9. Roadmap and open questions

- Quantify the accuracy cost of fast (audio-only) versus full (text + audio) mode against a reference.
- Validate predicted activation against a behavioural proxy for engagement or comprehension.
- Define and document the segment-level engagement score derived from the tensor (the downstream backend currently averages across vertices).
- Pin the model-stack dependencies and add a reproducible environment file.
- Add automated tests. `test_tribe.py` and `test_tribe_vid.py` are manual smoke scripts, and the only automated check is the `--self-test` flag.
- Region-of-interest read-outs (e.g. auditory and language cortex) in place of a whole-surface mean.

## 10. Repository layout

```
tribe_backend.py          core pipeline: normalise → chunk → predict → window → render → viewer
viewer_template.html      WebGL2 3D playback page (filled in per run)
local-server/
  main.py                 FastAPI service (/simulate, /analyze, /viewer, /health)
  main.py.orig            original connectivity-only placeholder
  requirements.txt        server dependencies
resources/
  GPU_LOCAL_SERVER.md     endpoint specification for the inference machine
test_tribe.py             manual smoke test (text input)
test_tribe_vid.py         manual smoke test (video input)
```

## 11. Citation and acknowledgements

PreCortex builds on **TRIBE v2** (`facebook/tribev2`) and the `tribev2` package. Please cite the original TRIBE v2 authors and consult the model card for the correct reference and licence terms. Also credit WhisperX, `ffmpeg`, PyVista and the `fsaverage` template where relevant.

No licence file is currently included in this repository. Add one before redistributing.
