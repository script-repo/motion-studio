#!/bin/bash
set -e; cd "$(dirname "$0")"; mkdir -p audio
npx esbuild song.js --bundle --format=iife --outfile=song-bundle.js --log-level=warning
node ../lib/tone-render.mjs --song=song-bundle.js --out=audio/signal-bloom.wav
node analyze.mjs
../lib/build.sh 08-audio-reactive/main.js
node ../lib/pcapture.mjs --workers=6 --html=index.html --out=08-audio-reactive.mp4 --w=1080 --h=1080 --fps=30 --dur=12 --audio=audio/signal-bloom.wav --crf=20
