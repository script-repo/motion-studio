---
name: build-host-setup
description: Use when preparing or checking the build host. Idempotent outline for cloning and installing the stack under one workspace folder with pinned versions and user-level installs only.
---

# Build-host setup

The build host is a Linux machine you connect to Grok Bot. Treat it as possibly production:

- Install only inside the workspace folder or user-level environments (`~/.local`, nvm, a venv).
- Anything needing sudo (system FFmpeg, system Chromium, GPU drivers) goes to the owner. Ask the owner.
- Re-running the script must be safe: check before cloning, reuse clones, pin versions.

## Layout

```
$MOTION_HOME/                 # e.g. ~/motion-studio
  versions.env                # pinned tags, one per line
  repos/<owner>__<repo>/      # reference clones (shallow, at pinned tag)
  .venv/                      # Python: faster-whisper, chatterbox
  projects/<show>/            # one folder per piece (see templates/file-naming.md)
  cache/                      # model and browser downloads
```

## versions.env (example; pin what you actually test)

```bash
NODE_MAJOR=24                 # an LTS line
REMOTION_VERSION=<pin>
HYPERFRAMES_VERSION=<pin>
THREE_VERSION=<pin>
FASTER_WHISPER_VERSION=<pin>
CHATTERBOX_VERSION=<pin>
```

## Script outline (`setup.sh`)

```bash
#!/usr/bin/env bash
set -euo pipefail
MOTION_HOME="${MOTION_HOME:-$HOME/motion-studio}"
mkdir -p "$MOTION_HOME"/{repos,projects,cache}
source "$MOTION_HOME/versions.env"

# 1. Check system tools; report, never sudo.
for bin in git ffmpeg python3; do
  command -v "$bin" >/dev/null || echo "MISSING: $bin (ask the owner to install)"
done

# 2. Node LTS at user level.
if ! command -v node >/dev/null; then
  echo "Install Node $NODE_MAJOR via nvm (user level)"; # nvm install "$NODE_MAJOR"
fi
node --version

# 3. Reference clones, shallow, at pinned tags. Skip if present.
clone() { # clone <owner/repo> <tag>
  local dir="$MOTION_HOME/repos/${1/\//__}"
  [ -d "$dir/.git" ] && { echo "have $1"; return; }
  git clone --depth 1 --branch "$2" "https://github.com/$1.git" "$dir"
}
# clone remotion-dev/remotion "v$REMOTION_VERSION"   # only clone what a brief needs
# clone heygen-com/hyperframes "v$HYPERFRAMES_VERSION"

# 4. Python venv for captions and voice.
[ -d "$MOTION_HOME/.venv" ] || python3 -m venv "$MOTION_HOME/.venv"
"$MOTION_HOME/.venv/bin/pip" install -q --upgrade pip
"$MOTION_HOME/.venv/bin/pip" install -q "faster-whisper==$FASTER_WHISPER_VERSION"
# "$MOTION_HOME/.venv/bin/pip" install -q "chatterbox-tts==$CHATTERBOX_VERSION"  # large; CPU torch if no GPU

# 5. Headless Chromium for Remotion / HyperFrames (user-level download, no sudo).
# cd "$MOTION_HOME/projects/<show>" && npx remotion browser ensure

# 6. Report.
ffmpeg -version | head -1
"$MOTION_HOME/.venv/bin/python" -c "import faster_whisper; print('faster-whisper', faster_whisper.__version__)"
```

## Per-project installs

Libraries (Three.js, PixiJS, p5.js, Anime.js, Matter.js, Rapier, Tone.js, tsParticles, Paper.js, OGL, glTF Transform, React Spring) go in each project's `package.json` with exact versions and a lockfile. Clone an upstream repo only when you need its examples or source, not to use the library.

## CPU-only hosts

- faster-whisper: `device="cpu", compute_type="int8"`, model `small` or `base`.
- Chatterbox: CPU PyTorch wheels; expect slow synthesis, so render VO once and cache it.
- Remotion: `--concurrency` at about half the cores; render previews at half resolution.
- Three.js: software GL in headless Chromium is slow; keep scenes light or render stills first.
