# 08 — Audio-reactive visualizer

12 s square visualizer: a Tone.js track is rendered offline, analysed into a per-frame FFT, and an OGL fragment shader reacts to it frame by frame.

**Tools:** Tone.js, FFT analysis (Node), OGL, Playwright, FFmpeg

**Output:**

- [`08-audio-reactive.mp4`](../media/08-audio-reactive.mp4)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./08-audio-reactive/render.sh
```

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **3m45s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
