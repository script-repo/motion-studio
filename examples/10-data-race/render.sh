#!/bin/bash
# 10 — Tone.js bed -> Remotion render (SVG bar-chart race) -> faststart
set -e; cd "$(dirname "$0")"
mkdir -p audio out public/fonts && cp ../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-{500,700}-normal.woff2 ../node_modules/@fontsource/inter/files/inter-latin-{400,600,800}-normal.woff2 ../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2 public/fonts/
npx esbuild music.js --bundle --format=iife --outfile=music-bundle.js --log-level=warning
node ../lib/tone-render.mjs --song=music-bundle.js --out=audio/music-raw.wav
ffmpeg -v error -y -i audio/music-raw.wav -af "volume=0.55,afade=t=out:st=11.2:d=0.8,atrim=0:12" public/music.wav
npx remotion render src/index.ts Race out/raw.mp4 --public-dir=$PWD/public ${CHROME_HEADLESS_SHELL:+--browser-executable=$CHROME_HEADLESS_SHELL} --codec=h264 --crf=20 --pixel-format=yuv420p --audio-codec=aac --concurrency=6 --log=warn
ffmpeg -v error -y -i out/raw.mp4 -vf scale=out_range=tv,format=yuv420p -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -color_range tv -c:a copy -movflags +faststart 10-data-race.mp4
