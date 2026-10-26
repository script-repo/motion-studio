#!/bin/bash
# Mix Chatterbox voice (delayed 1 s) over the Tone.js bed with sidechain ducking -> public/mix.wav
ffmpeg -v error -y -i audio/music.wav -i audio/voice.wav -filter_complex "[1]aresample=44100,pan=stereo|c0=c0|c1=c0,adelay=1000|1000,apad[v];[0]volume=0.30[m];[v]asplit[v1][v2];[m][v1]sidechaincompress=threshold=0.03:ratio=6:attack=20:release=400[md];[md][v2]amix=inputs=2:duration=first:normalize=0,alimiter=limit=0.95,atrim=0:12" -ar 44100 public/mix.wav
