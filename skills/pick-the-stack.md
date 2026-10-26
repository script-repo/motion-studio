---
name: pick-the-stack
description: Use after the brief is understood. Pick the smallest set of tools that fits the brief type and state why in one line.
---

# Pick the stack

Choose the fewest tools that do the job. Say which and why in one line, for example: "Remotion + FFmpeg: data-driven 16:9 explainer with captions; nothing here needs 3D."

## Decision table

| Brief type | First choice | Add when needed | Avoid |
| --- | --- | --- | --- |
| Title sting / kinetic type | HyperFrames (HTML + CSS) or Remotion | Anime.js for timelines, GL Transitions for cuts | 3D engines |
| Data-driven or templated video (many variants) | Remotion | React Spring for physical easing | Hand-editing in a GUI editor |
| Animated explainer with VO and captions | Remotion or HyperFrames | Chatterbox (VO), faster-whisper (captions), Tone.js (bed), FFmpeg (mux) | Cloning any real voice |
| Generative 2D art / loops | p5.js or PixiJS | Paper.js for vector paths, tsParticles for particle fields | Video editors |
| Interactive HTML piece | PixiJS, p5.js or Three.js, self-contained | Anime.js, Tone.js for sound on user gesture | External CDNs at runtime (inline or vendor them) |
| 3D scene / product-style turntable | Three.js | glTF Transform to optimise models, OGL when bundle size matters | Heavy post in a GUI |
| Physics toy | Matter.js (2D) or Rapier (3D, WASM) | Three.js or PixiJS for rendering | Hand-rolled physics |
| Edit together existing clips | FFmpeg | OpenCut for a GUI rough cut, GL Transitions | Re-rendering source in a framework |
| Screen or live capture | OBS Studio | FFmpeg to trim and encode | |
| Captions only | faster-whisper + FFmpeg | | |

## Render path for browser-based work

Anything built in HTML/JS (p5.js, PixiJS, Three.js, Anime.js) becomes video by rendering it inside Remotion or HyperFrames, which drive headless Chromium frame by frame. Make animation time-based on the frame number, never on wall-clock time, so renders are deterministic.

## Licence check

Before committing to a tool for commercial work, read its licence in the README stack table. Remotion needs a company licence above a size threshold; FFmpeg builds with libx264 are GPL; OBS Studio is GPL.
