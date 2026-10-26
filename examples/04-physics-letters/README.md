# 04 — Physics letters

10 s 1920x1080 piece: letters drop, collide and settle. The Rapier 2D simulation runs in Node first, PixiJS draws each frame from it, and Tone.js synthesizes impact sounds at the contact times.

**Tools:** Rapier, PixiJS, Tone.js, Playwright, FFmpeg

**Output:**

- [`04-physics-letters.mp4`](../media/04-physics-letters.mp4)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./04-physics-letters/render.sh
```

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **47 s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
