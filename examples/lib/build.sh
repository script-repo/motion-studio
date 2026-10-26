#!/bin/bash
# bundle an example entry (run from anywhere): lib/build.sh NN-slug/main.js -> NN-slug/bundle.js
cd "$(dirname "$0")/.." && npx esbuild "$1" --bundle --format=iife --outfile="$(dirname "$1")/bundle.js" --log-level=warning ${@:2}
