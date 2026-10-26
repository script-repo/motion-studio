# 07 — GL transitions

12 s reel of four OGL-rendered stills joined by three GL Transitions shaders (CrossWarp, DirectionalWarp, Swirl).

**Tools:** OGL, gl-transitions, Playwright, FFmpeg

**Output:**

- [`07-gl-transitions.mp4`](../media/07-gl-transitions.mp4)

## Render

From `examples/` (after the one-time setup in [../README.md](../README.md#setup)):

```bash
./07-gl-transitions/render.sh
```

Render time on a CPU-only box (16 cores, no GPU, WebGL via SwiftShader): **2m46s**.

Outputs are written into this folder and are gitignored; the committed copies live in [`../media/`](../media/).
