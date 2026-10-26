# 02 — Flow-field poster

10 s seamless loop of a p5.js noise flow field (1080x1350), plus a high-res poster still from the same sketch.

**Tools:** p5.js, Playwright (deterministic frame stepping), FFmpeg

**Output:**

- [`02-flow-field-poster.mp4`](../media/02-flow-field-poster.mp4)
- [`02-flow-field-poster-1440x1800.png`](../media/02-flow-field-poster-1440x1800.png)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./02-flow-field-poster/render.sh
```

`render.sh` writes the full 2880x3600 PNG locally; the gallery ships a 1440x1800 web copy.

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **3m07s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
