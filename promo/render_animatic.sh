#!/usr/bin/env bash
set -euo pipefail

repo_dir=$(cd "$(dirname "$0")/.." && pwd)
out_dir="$repo_dir/promo/output"
frame_dir="$out_dir/frames"
mkdir -p "$frame_dir"

font="/System/Library/Fonts/Helvetica.ttc"
if [[ ! -f "$font" ]]; then
  font="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
fi
home="$repo_dir/web/docs/home.png"
brief="$repo_dir/web/docs/executive-brief.png"
case_image="$repo_dir/web/docs/t1-resolution.png"
output="$out_dir/sovereign-lens-animatic.mp4"

make_frame() {
  local source_image=$1
  local output_image=$2
  local headline=$3
  local subhead=$4
  magick "$source_image" -resize '1920x1080^' -gravity center -extent 1920x1080 \
    \( -size 1920x1080 xc:'rgba(0,0,0,0.70)' \) -compose over -composite \
    -font "$font" -fill white -gravity center \
    -pointsize 92 -annotate +0-55 "$headline" \
    -pointsize 38 -annotate +0+100 "$subhead" "$output_image"
}

make_frame "$home" "$frame_dir/01.png" 'THE HORIZON ALREADY EXISTS.' 'SOVEREIGN LENS · LONG-HORIZON INTELLIGENCE'
make_frame "$home" "$frame_dir/02.png" 'IT IS ALREADY BEING PROGRAMMED.' 'CAPITAL · TALENT · COMPUTE · INFRASTRUCTURE · LAW · CULTURE'
make_frame "$brief" "$frame_dir/03.png" 'BY STATES. INSTITUTIONS. HUMAN NETWORKS.' 'AI AGENTS ARE ONE HORIZON BLOCK AMONG MANY.'
make_frame "$case_image" "$frame_dir/04.png" 'CAPABILITY RISES.' 'CONTROL REMAINS CONDITIONAL.'
make_frame "$case_image" "$frame_dir/05.png" 'ONE EVENT.' 'COMPETING SOVEREIGN TRAJECTORIES.'
make_frame "$brief" "$frame_dir/06.png" 'OBSERVE WHO PROGRAMS WHAT COMES NEXT.' 'SOVEREIGNLENS.AI'

ffmpeg -y \
  -loop 1 -t 6 -i "$frame_dir/01.png" \
  -loop 1 -t 6 -i "$frame_dir/02.png" \
  -loop 1 -t 6 -i "$frame_dir/03.png" \
  -loop 1 -t 6 -i "$frame_dir/04.png" \
  -loop 1 -t 6 -i "$frame_dir/05.png" \
  -loop 1 -t 6 -i "$frame_dir/06.png" \
  -filter_complex '[0:v][1:v][2:v][3:v][4:v][5:v]concat=n=6:v=1:a=0[outv]' \
  -map '[outv]' -r 30 -c:v libx264 -preset medium -crf 18 -pix_fmt yuv420p \
  -movflags +faststart "$output"

printf '%s\n' "$output"
