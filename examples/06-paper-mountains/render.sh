#!/bin/bash
set -e; cd "$(dirname "$0")"
../lib/build.sh 06-paper-mountains/main.js
node ../lib/pcapture.mjs --workers=6 --html=index.html --out=06-paper-mountains.mp4 --w=1080 --h=1080 --fps=30 --dur=11 --crf=20 --stills=10.9:06-paper-mountains-final.png
node export-svg.mjs
