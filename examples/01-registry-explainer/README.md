# 01 — Registry explainer

12 s square kinetic-typography explainer, "What a capability registry does", with a synthetic voiceover, word-timed captions and a music bed.

**Tools:** Remotion, Chatterbox TTS, faster-whisper, Tone.js, FFmpeg

**Output:**

- [`01-registry-explainer.mp4`](../media/01-registry-explainer.mp4)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./01-registry-explainer/render.sh
```

Needs the two Python envs (see the gallery README) and sets `CHATTERBOX_PY` / `WHISPER_PY` to their interpreters. Delete `audio/voice.wav` to regenerate the voice.

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **~5.6 min (TTS 2m32s, faster-whisper ~2 min incl. first model download, Remotion 35 s)**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
