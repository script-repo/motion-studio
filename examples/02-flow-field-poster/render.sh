#!/bin/bash
# Renders 02: 10 s seamless loop MP4 (1080x1350) + 2880x3600 PNG poster
set -e; cd "$(dirname "$0")"
../lib/build.sh 02-flow-field-poster/main.js
node ../lib/pcapture.mjs --workers=8 --html=index.html --out=02-flow-field-poster.mp4 --w=1080 --h=1350 --fps=30 --dur=10 --crf=26
node ../lib/still.mjs --html=index.html --query='?scale=2.6666667' --w=1080 --h=1350 --t=3.2 --canvas --out=02-flow-field-poster-2880x3600.png
