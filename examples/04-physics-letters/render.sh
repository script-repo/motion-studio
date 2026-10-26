#!/bin/bash
set -e; cd "$(dirname "$0")"
node sim.mjs
../lib/build.sh 04-physics-letters/main.js
npx esbuild sfx.js --bundle --format=iife --outfile=sfx-bundle.js --log-level=warning
node ../lib/tone-render.mjs --song=sfx-bundle.js --out=impacts.wav
node ../lib/pcapture.mjs --workers=6 --html=index.html --out=04-physics-letters.mp4 --w=1920 --h=1080 --fps=30 --dur=10 --audio=impacts.wav --crf=20
