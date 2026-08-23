#!/usr/bin/env bash
set -euo pipefail

promo_dir=$(cd "$(dirname "$0")" && pwd)
generated="$promo_dir/generated"
output="$promo_dir/output/sovereign-lens-happyhorse.mp4"
list_file=$(mktemp)
trap 'rm -f "$list_file"' EXIT

for id in 01_existing_horizon 02_horizon_blocks 03_programmers 04_live_case 05_competing_trajectories 06_observatory; do
  printf "file '%s/%s.mp4'\n" "$generated" "$id" >> "$list_file"
done

ffmpeg -y -f concat -safe 0 -i "$list_file" -c:v libx264 -crf 18 -preset medium \
  -pix_fmt yuv420p -c:a aac -b:a 192k -movflags +faststart "$output"
printf '%s\n' "$output"
