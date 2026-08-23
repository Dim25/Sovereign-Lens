#!/usr/bin/env bash
set -euo pipefail
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
mkdir -p "$BASE_DIR/work" "$BASE_DIR/final"
for image in "$BASE_DIR/scenes"/*.jpg; do
  stem="$(basename "${image%.jpg}")"
  ffmpeg -y -loglevel error -loop 1 -i "$image" -t 7.5 -r 24 -an \
    -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p "$BASE_DIR/work/$stem.mp4"
done
: > "$BASE_DIR/work/concat.txt"
for video in "$BASE_DIR/work"/*.mp4; do printf "file '%s'\n" "$video" >> "$BASE_DIR/work/concat.txt"; done
ffmpeg -y -loglevel error -f concat -safe 0 -i "$BASE_DIR/work/concat.txt" -an \
  -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -movflags +faststart \
  "$BASE_DIR/final/sovereign-lens-demo-loop-60s.mp4"
ffprobe -v error -show_entries format=filename,duration,size -of compact=p=0:nk=1 "$BASE_DIR/final/sovereign-lens-demo-loop-60s.mp4"
