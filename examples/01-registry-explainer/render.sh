#!/bin/bash
# 01 — full pipeline: Chatterbox TTS -> faster-whisper captions -> Tone.js bed -> FFmpeg mix -> Remotion render -> faststart
set -e; cd "$(dirname "$0")"
mkdir -p audio out public/fonts && cp ../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-{500,700}-normal.woff2 ../node_modules/@fontsource/inter/files/inter-latin-{400,600,800}-normal.woff2 ../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2 public/fonts/
[ -f audio/voice.wav ] || ${CHATTERBOX_PY:-python3} tts.py
${WHISPER_PY:-python3} transcribe.py
npx esbuild music.js --bundle --format=iife --outfile=music-bundle.js --log-level=warning
node ../lib/tone-render.mjs --song=music-bundle.js --out=audio/music.wav
./mix.sh
npx remotion render src/index.ts Explainer out/raw.mp4 --public-dir=$PWD/public ${CHROME_HEADLESS_SHELL:+--browser-executable=$CHROME_HEADLESS_SHELL} --codec=h264 --crf=20 --pixel-format=yuv420p --audio-codec=aac --concurrency=6 --log=warn
ffmpeg -v error -y -i out/raw.mp4 -vf scale=out_range=tv,format=yuv420p -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -color_range tv -c:a copy -movflags +faststart 01-registry-explainer.mp4
