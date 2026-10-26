#!/bin/bash
# peek.sh video.mp4 out.png [t1 t2 t3 t4] -> 2x2 tile of frames at given times, half-res
v=$1; o=$2; shift 2; ts=("${@:-1 4 7 9}"); i=0; f=()
for t in "${ts[@]}"; do ffmpeg -v error -y -ss $t -i "$v" -frames:v 1 -vf scale=iw/2:-1 /tmp/peek_$i.png; f+=(-i /tmp/peek_$i.png); i=$((i+1)); done
ffmpeg -v error -y "${f[@]}" -filter_complex "[0][1]hstack[a];[2][3]hstack[b];[a][b]vstack" "$o"
