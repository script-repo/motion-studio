#!/bin/bash
set -e; cd "$(dirname "$0")"; mkdir -p stills
npx esbuild stills.js --bundle --format=iife --outfile=stills-bundle.js --log-level=warning
for i in 0 1 2 3; do node ../lib/still.mjs --html=stills.html --query="?scene=$i" --w=1920 --h=1080 --out=stills/still-$((i+1)).png; done
node -e "const fs=require('fs');const cp=require('child_process');const a=[1,2,3,4].map(i=>{cp.execSync('ffmpeg -v error -y -i stills/still-'+i+'.png -q:v 2 stills/still-'+i+'.jpg');return 'data:image/jpeg;base64,'+fs.readFileSync('stills/still-'+i+'.jpg').toString('base64')});fs.writeFileSync('stills-data.js','window.STILLS='+JSON.stringify(a)+';')"
../lib/build.sh 07-gl-transitions/main.js
node ../lib/pcapture.mjs --workers=6 --html=index.html --out=07-gl-transitions.mp4 --w=1920 --h=1080 --fps=30 --dur=12 --crf=20
