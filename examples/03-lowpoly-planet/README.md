# 03 — Low-poly planet

10 s glowing low-poly planet with a Keplerian particle ring. The planet GLB is generated and optimized with glTF Transform, then rendered in Three.js with bloom.

**Tools:** Three.js, glTF Transform, Playwright, FFmpeg

**Output:**

- [`03-lowpoly-planet.mp4`](../media/03-lowpoly-planet.mp4)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./03-lowpoly-planet/render.sh
```

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **2m58s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
