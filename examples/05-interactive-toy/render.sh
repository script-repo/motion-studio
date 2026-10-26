#!/bin/bash
# 05 — build the single-file HTML toy, then capture it with a scripted cursor (Playwright fake clock => deterministic frames)
set -e; cd "$(dirname "$0")"
../lib/build.sh 05-interactive-toy/main.js --minify
node inline.mjs
node ../lib/capture.mjs --html=05-interactive-toy.html --query='?capture=1' --clock --mouse --out=05-interactive-toy.mp4 --w=1920 --h=1080 --fps=30 --dur=10 --crf=21
