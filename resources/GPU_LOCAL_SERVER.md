# GPU Local Server — Endpoint Specification

This document is for whoever runs the TRIBE v2 inference machine. The PreCortex backend treats the GPU server as a black box with **one HTTP endpoint**. Implement exactly this contract and the rest of the pipeline works unchanged.

The current placeholder implementation lives in [`local-server/main.py`](../local-server/main.py) — it returns a random tensor and exists only to prove connectivity. Replace its body with real TRIBE v2 inference; keep the request/response shapes identical.

---

## 1. Deployment

```bash
# on the GPU machine
pip install -r requirements.txt        # fastapi, uvicorn[standard], python-multipart, numpy
uvicorn main:app --host 0.0.0.0 --port 8001
```

Then point the backend at it in `backend/.env`:

```
LOCAL_TRIBE_SERVER_URL=http://<GPU_MACHINE_IP>:8001
```

The backend must be able to reach port **8001** on this machine — open the firewall / port-forward / VPN as needed before anything else (see §5).

## 2. Endpoint: `POST /simulate`

### Request

`multipart/form-data` with a single field:

| field | type | description |
|---|---|---|
| `file` | binary | the uploaded lecture file, sent verbatim (mp4 / mp3 / wav / pdf / pptx / txt) |

The backend streams the **original uploaded file** — not a transcript. TRIBE v2 decides what to do with each modality.

### Response `200` — success

`application/json`:

```json
{
  "tensor": [[0.12, -0.4, 0.31], [0.15, -0.38, 0.29]],
  "n_timesteps": 240,
  "n_vertices": 3,
  "sampling_rate_hz": 0.5
}
```

| key | type | meaning |
|---|---|---|
| `tensor` | `float[][]` | predicted brain activation, **`n_timesteps` rows × `n_vertices` columns** (row = one timestep) |
| `n_timesteps` | int | number of rows in `tensor` |
| `n_vertices` | int | number of columns in `tensor` (real TRIBE v2 output ≈ 20,000 vertices) |
| `sampling_rate_hz` | float | timesteps per second of lecture time — the backend uses this to map lecture-segment times onto tensor rows (`row = time_seconds × sampling_rate_hz`) |

Constraints:

- `tensor` must be plain nested JSON arrays of finite floats (no NaN/Infinity — JSON can't carry them and the backend will reject the parse).
- `len(tensor) == n_timesteps` and every row has `n_vertices` entries.
- `sampling_rate_hz` must reflect real lecture time: the backend computes segment windows as `tensor[int(start*sr) : int(end*sr)]`. If the tensor covers less time than the lecture, trailing segments score against an empty window (score 0) — cover the full duration.

### Response `500` — failure

```json
{ "error": "human-readable description of what went wrong" }
```

Any non-200 status fails the backend job with `simulating: …` and the message surfaces to the user, so make `error` meaningful (e.g. `"CUDA out of memory"`, `"unsupported codec"`).

## 3. How the backend calls you

From [`backend/pipeline/tribe_client.py`](../backend/pipeline/tribe_client.py):

- **Timeout: 300 seconds** for the full request. If real inference can exceed 5 minutes, tell the backend team so the timeout is raised.
- **One retry** on connection errors and timeouts — your endpoint may be called twice with the same file, so inference must be safe to repeat (idempotent, no partial-state corruption on abort).
- No auth headers are sent. The link is assumed to be a trusted private network/VPN — do not expose port 8001 to the public internet.

## 4. Performance notes

- The tensor is transferred as JSON. At real scale (~20,000 vertices × hundreds of timesteps) this can be tens–hundreds of MB; it works, but if it proves too slow the agreed fallback is binary `.npy` transfer — **coordinate with the backend team before changing the format**, both sides must switch together.
- Consider downsampling vertices server-side if full resolution isn't needed for engagement scoring — the backend currently averages across all vertices anyway.

## 5. Connectivity checklist (do this first)

1. Start the (fake or real) server: `uvicorn main:app --host 0.0.0.0 --port 8001`
2. From the **backend machine**, run:
   ```bash
   curl -F "file=@test.mp4" http://<GPU_MACHINE_IP>:8001/simulate
   ```
3. You should get the JSON payload above. If not, fix firewall / port-forwarding / VPN before touching inference code — nothing downstream can be tested until this round trip works.

## 6. Swapping in real TRIBE v2

In `local-server/main.py`, replace only the marked block:

```python
@app.post("/simulate")
async def simulate(file: UploadFile):
    contents = await file.read()
    # --- FAKE, for testing connectivity only ---   ← replace from here
    ...
    # --- replace body above with real TRIBE v2 inference when ready ---
```

Keep the function signature, route path, and response keys exactly as they are. Suggested shape for the real version: write `contents` to a temp file, run TRIBE v2 inference on it, convert the output array with `.tolist()`, and return the four keys with the model's true `sampling_rate_hz`.
