#!/bin/bash
set -e; cd "$(dirname "$0")"
node build-planet.mjs
../lib/build.sh 03-lowpoly-planet/main.js
node ../lib/capture.mjs --html=index.html --out=03-lowpoly-planet.mp4 --w=1080 --h=1080 --fps=30 --dur=10 --crf=20
