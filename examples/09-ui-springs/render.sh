#!/bin/bash
# 09 — HyperFrames render of the Anime.js spring composition (usage reporting opted out via env), then faststart remux.
set -e; cd "$(dirname "$0")/hf"
mkdir -p lib assets/fonts ../out && cp ../../node_modules/animejs/dist/bundles/anime.umd.min.js lib/ && cp ../../node_modules/@fontsource/space-grotesk/files/space-grotesk-latin-{500,700}-normal.woff2 ../../node_modules/@fontsource/inter/files/inter-latin-{500,600,700}-normal.woff2 ../../node_modules/@fontsource/jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff2 assets/fonts/; export HYPERFRAMES_NO_TELEMETRY=1 DO_NOT_TRACK=1
npx hyperframes lint .
npx hyperframes render -o ../out/raw.mp4 --fps 30 --workers 4 --quality delivery
ffmpeg -v error -y -i ../out/raw.mp4 -c:v libx264 -preset slow -crf 20 -pix_fmt yuv420p -movflags +faststart -an ../09-ui-springs.mp4
