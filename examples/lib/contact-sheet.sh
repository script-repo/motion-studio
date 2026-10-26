#!/bin/bash
# contact-sheet.sh out.png — one frame per example, 5x2 grid with labels
out=$(realpath -m "$1"); cd "$(dirname "$0")/.."  # run from examples/
tmp=$(mktemp -d); FONT=$(fc-match -f '%{file}' "Lato:bold"); MONO=$(fc-match -f '%{file}' "DejaVu Sans Mono")
items=(
"media/01-registry-explainer.mp4|7.2|01  Registry explainer|Remotion · Chatterbox · faster-whisper · Tone.js"
"media/02-flow-field-poster.mp4|4|02  Flow-field poster|p5.js · Playwright · FFmpeg"
"media/03-lowpoly-planet.mp4|6|03  Low-poly planet|Three.js · glTF Transform · FFmpeg"
"media/04-physics-letters.mp4|9|04  Physics letters|Rapier · PixiJS · Tone.js"
"media/05-interactive-toy.mp4|5.6|05  Interactive toy|tsParticles · Anime.js"
"media/06-paper-mountains.mp4|10.5|06  Self-drawing line art|Paper.js · Anime.js"
"media/07-gl-transitions.mp4|6.0|07  GL Transitions|OGL · gl-transitions · FFmpeg"
"media/08-audio-reactive.mp4|8|08  Audio-reactive|Tone.js · FFT · OGL"
"media/09-ui-springs.mp4|3.4|09  UI springs|Anime.js · HyperFrames"
"media/10-data-race.mp4|7|10  Bar-chart race|Remotion · SVG · Tone.js")
i=0; for it in "${items[@]}"; do IFS='|' read -r v t a b <<< "$it"
  ffmpeg -v error -y -ss $t -i "$v" -frames:v 1 -vf "scale=400:400:force_original_aspect_ratio=decrease,pad=400:400:(ow-iw)/2:(oh-ih)/2:color=0x0B1020,pad=400:470:0:0:color=0x0B1020,drawtext=fontfile=$FONT:text='$a':x=16:y=410:fontsize=21:fontcolor=0xF4EFE6,drawtext=fontfile=$MONO:text='$b':x=16:y=440:fontsize=13:fontcolor=0x9AA3C7" $tmp/t$i.png; i=$((i+1)); done
ffmpeg -v error -y -i $tmp/t%d.png -vf "tile=5x2:padding=12:margin=24:color=0x0B1020" -frames:v 1 "$out"
rm -rf $tmp; echo "wrote $out"
