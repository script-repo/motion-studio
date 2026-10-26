# 10 — Data race

12 s square bar-chart race in Remotion + SVG with a Tone.js music bed. All data is fictional: it comes from a seeded random walk, and the label "illustrative example data, fictional studios" stays on screen for the whole piece.

**Tools:** Remotion, SVG, Tone.js, FFmpeg

**Output:**

- [`10-data-race.mp4`](../media/10-data-race.mp4)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./10-data-race/render.sh
```

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **37 s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
