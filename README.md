# Motion Studio

Grok Bot agent that works as a motion designer and creative coder. Give it a brief and it delivers a finished piece: motion graphics, generative art, 3D scenes, physics toys, animated explainers, and videos with voiceover, music and captions.

## Live bot

- **Name:** Motion Studio
- **Agent id:** `301f021f-8338-4963-91e8-ded33e42a643`
- **Owner GitHub:** [script-repo](https://github.com/script-repo)

## What it does

1. Reads the brief for the story: audience, the one feeling or idea, length, format, and delivery target
2. Sketches a storyboard or style frame first for anything longer than about 15 seconds
3. Picks the smallest set of tools that fits and says why
4. Builds and renders headless on your build host (a Linux machine you connect to Grok Bot)
5. Delivers real files: H.264 MP4 with captions (burned in or sidecar), self-contained interactive HTML, PNG stills and contact sheets
6. Shows a still or short preview before calling it done, then offers one idea for the next iteration

## Repo layout

| Path | Purpose |
| --- | --- |
| `AGENT.md` | Full operating instructions for the live bot (paste as the persona) |
| `bots/motion-studio.md` | Publishable botdirectory-style prompt |
| `skills/brief-to-storyboard.md` | Turn a brief into beats, a storyboard and a style frame |
| `skills/pick-the-stack.md` | Decision table: brief type to tools |
| `skills/render-and-deliver.md` | FFmpeg encode settings, faster-whisper captions, contact sheets |
| `skills/build-host-setup.md` | Idempotent clone/install outline under one workspace folder, pinned versions |
| `templates/brief.md` | Brief template to fill in or hand to the bot |
| `templates/file-naming.md` | File and folder naming convention for shots, renders and deliverables |
| `LICENSE` | MIT (this repo only; each upstream tool keeps its own license) |

## The stack

Chosen per brief, never all at once. Licenses as stated by each upstream repo on 2026-10-26; check them again before commercial work.

| Area | Tool | Upstream repo | License |
| --- | --- | --- | --- |
| Video / composition | Remotion | [remotion-dev/remotion](https://github.com/remotion-dev/remotion) | [Remotion License](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) (free for individuals and small companies; company license above a size threshold) |
| Video / composition | HyperFrames | [heygen-com/hyperframes](https://github.com/heygen-com/hyperframes) | Apache-2.0 |
| Video / composition | FFmpeg | [FFmpeg/FFmpeg](https://github.com/FFmpeg/FFmpeg) | LGPL-2.1+ (GPL when built with GPL parts such as libx264) |
| Video / composition | OpenCut | [OpenCut-app/OpenCut](https://github.com/OpenCut-app/OpenCut) | MIT |
| Video / composition | OBS Studio | [obsproject/obs-studio](https://github.com/obsproject/obs-studio) | GPL-2.0 |
| Video / composition | GL Transitions | [gl-transitions/gl-transitions](https://github.com/gl-transitions/gl-transitions) | MIT (individual transitions may carry their own license) |
| Animation | Anime.js | [juliangarnier/anime](https://github.com/juliangarnier/anime) | MIT |
| Animation | React Spring | [pmndrs/react-spring](https://github.com/pmndrs/react-spring) | MIT |
| 2D / generative | PixiJS | [pixijs/pixijs](https://github.com/pixijs/pixijs) | MIT |
| 2D / generative | p5.js | [processing/p5.js](https://github.com/processing/p5.js) | LGPL-2.1 |
| 2D / generative | Paper.js | [paperjs/paper.js](https://github.com/paperjs/paper.js) | MIT |
| 2D / generative | tsParticles | [tsparticles/tsparticles](https://github.com/tsparticles/tsparticles) | MIT |
| 3D / physics | Three.js | [mrdoob/three.js](https://github.com/mrdoob/three.js) | MIT |
| 3D / physics | OGL | [oframe/ogl](https://github.com/oframe/ogl) | Unlicense |
| 3D / physics | glTF Transform | [donmccurdy/glTF-Transform](https://github.com/donmccurdy/glTF-Transform) | MIT |
| 3D / physics | Matter.js | [liabru/matter-js](https://github.com/liabru/matter-js) | MIT |
| 3D / physics | Rapier | [dimforge/rapier](https://github.com/dimforge/rapier) | Apache-2.0 |
| Audio / speech | Tone.js | [Tonejs/Tone.js](https://github.com/Tonejs/Tone.js) | MIT |
| Audio / speech | Chatterbox | [resemble-ai/chatterbox](https://github.com/resemble-ai/chatterbox) | MIT |
| Audio / speech | faster-whisper | [SYSTRAN/faster-whisper](https://github.com/SYSTRAN/faster-whisper) | MIT |
| Conventions | VFX file naming | [Holli-Tech/agent-skills](https://github.com/Holli-Tech/agent-skills) (`skills/creative/vfx-file-naming`) | MIT |

## Import or recreate the bot in Grok Bot

1. Create a new Grok Bot agent named **Motion Studio**.
2. Paste the contents of [`AGENT.md`](AGENT.md) as its persona (or use the shorter prompt in [`bots/motion-studio.md`](bots/motion-studio.md)).
3. Connect a Linux build host to Grok Bot and tell the bot which machine it is. No connectors are required.
4. Optional: copy the `skills/` files into the bot as skills, and keep `templates/brief.md` handy for new requests.

## Build-host setup

Everything installs at user level inside one workspace folder; nothing here needs sudo except the system packages, which the owner installs. Full outline: [`skills/build-host-setup.md`](skills/build-host-setup.md).

| Need | Why | Suggested install |
| --- | --- | --- |
| Node.js LTS | Remotion, HyperFrames, and every JS library in the stack | nvm or a user-level Node in `~/.local` |
| FFmpeg | Encoding, muxing, burning captions, contact sheets | distro package (owner) or a static build in the workspace |
| Python 3 venv | faster-whisper (captions) and Chatterbox (voice) | `python3 -m venv <workspace>/.venv` |
| Chromium (headless) | Headless rendering for Remotion and HyperFrames | Remotion/Playwright-managed browser download, or the distro package (owner) |

No GPU? That's fine. Use CPU settings: faster-whisper with `compute_type=int8`, Remotion with modest `--concurrency`, and shorter preview renders.

## Getting started

1. Set up the build host with the outline above and confirm `node --version`, `ffmpeg -version`, and a headless Chromium.
2. Fill in [`templates/brief.md`](templates/brief.md), or just describe the piece in chat.
3. Try one of these briefs:

> **1. Launch sting (motion graphics, 6 s).** "A 6-second 1080×1080 logo-free title sting for a newsletter called *Quiet Signals*. Calm, a little curious. Deep navy and warm off-white. MP4 for social, plus a PNG still."

> **2. Generative loop (interactive HTML).** "A self-contained HTML page with a slow flow-field of particles that bends toward the cursor. Must respect `prefers-reduced-motion` with a still fallback. Also export a 10-second 4K MP4 loop and a contact sheet."

> **3. Animated explainer with voiceover (45 s).** "Explain how a sourdough starter works for curious beginners, 45 seconds, 16:9. Friendly synthetic narrator (no real-person voice), soft music bed, burned-in captions plus an `.srt`. Storyboard first."

The bot replies with the piece first, then one line on its choices and one idea for the next pass.

## Credits

- The stack list comes from a LinkedIn post by **Arminas Valunas** describing "a full motion studio" of open-source tools.
- Persona inspiration from [msitarzewski/agency-agents](https://github.com/msitarzewski/agency-agents) (MIT): `design/design-visual-storyteller.md`, `design/design-whimsy-injector.md`, and `marketing/marketing-short-video-editing-coach.md`. The persona here is written fresh, not copied.
- File-naming spirit from [Holli-Tech/agent-skills](https://github.com/Holli-Tech/agent-skills) `skills/creative/vfx-file-naming`.
- Every tool in the stack table belongs to its upstream authors under its own license.

## Defaults used for this create

- Public GitHub repo, MIT license for the files here
- No connectors required; a connected Linux build host does the heavy lifting
- No secrets, hostnames, or private details in this repo
