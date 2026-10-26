# 09 — UI springs

8 s 1920x1080 UI micro-interaction study, "Springs, not timers": a toggle, an add-to-cart button, a like heart and a segmented chart, each driven by Anime.js springs with a scripted cursor, composed and rendered with HyperFrames.

**Tools:** Anime.js, HyperFrames, FFmpeg

**Output:**

- [`09-ui-springs.mp4`](../media/09-ui-springs.mp4)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./09-ui-springs/render.sh
```

Run `npx hyperframes browser ensure` once so HyperFrames has a headless browser.

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **1m48s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
