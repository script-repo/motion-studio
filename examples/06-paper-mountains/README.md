# 06 — Paper mountains

11 s self-drawing line-art landscape. Paper.js builds the vector scene, a seeked Anime.js timeline drives every stroke's draw-on, and the final frame is exported as a standalone SVG (fonts embedded) and PNG.

**Tools:** Paper.js, Anime.js, Playwright, FFmpeg

**Output:**

- [`06-paper-mountains.mp4`](../media/06-paper-mountains.mp4)
- [`06-paper-mountains-final.svg`](../media/06-paper-mountains-final.svg)
- [`06-paper-mountains-final.png`](../media/06-paper-mountains-final.png)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./06-paper-mountains/render.sh
```

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **19 s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
