#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
SCENE_DIR="$BASE_DIR/scenes"
WORK_DIR="$BASE_DIR/work"
FINAL_DIR="$BASE_DIR/final"
mkdir -p "$WORK_DIR" "$FINAL_DIR"

for scene in "$SCENE_DIR"/*.jpg; do
  stem="$(basename "${scene%.jpg}")"
  ffmpeg -y -loglevel error -loop 1 -i "$scene" \
    -vf "scale=1440:900,zoompan=z='min(zoom+0.00012,1.026)':d=216:s=1440x900:fps=24,fade=t=in:st=0:d=0.35,fade=t=out:st=8.65:d=0.35" \
    -t 9 -an -c:v libx264 -crf 22 -preset medium -pix_fmt yuv420p \
    "$WORK_DIR/$stem.mp4"
done

list_file="$WORK_DIR/concat.txt"
: > "$list_file"
for scene in "$WORK_DIR"/*.mp4; do
  printf "file '%s'\n" "$scene" >> "$list_file"
done

ffmpeg -y -loglevel error -f concat -safe 0 -i "$list_file" \
  -c:v libx264 -crf 24 -preset medium -pix_fmt yuv420p -an -movflags +faststart \
  "$FINAL_DIR/sovereign-lens-demo-loop-90s.mp4"

ffprobe -v error -show_entries format=filename,duration,size -of compact=p=0:nk=1 \
  "$FINAL_DIR/sovereign-lens-demo-loop-90s.mp4"
