# 05 — Interactive toy ("Constellation")

Single-file interactive HTML toy: a reactive tsParticles field with Anime.js intro, magnetic title letters, spring cursor ring and click ripples. The MP4 is a capture driven by a scripted cursor on a fake clock.

**Tools:** tsParticles, Anime.js, esbuild, Playwright, FFmpeg

**Output:**

- [`05-interactive-toy.mp4`](../media/05-interactive-toy.mp4)
- [`05-interactive-toy.html`](../media/05-interactive-toy.html)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./05-interactive-toy/render.sh
```

Open the HTML in a browser and move or click the mouse.

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **3m56s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
