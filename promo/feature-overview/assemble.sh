#!/usr/bin/env bash
set -euo pipefail

BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
CLIP_DIR="$BASE_DIR/clips"
OUT_DIR="$BASE_DIR/final"
WORK_DIR="$BASE_DIR/work"

mkdir -p "$OUT_DIR" "$WORK_DIR"

segment() {
  local source_file="$1"
  local label="$2"
  local output_file="$3"
  local output_stem="${output_file%.mp4}"
  local title_card="$WORK_DIR/${output_stem}-title.png"

  magick -size 1280x150 "xc:rgba(0,0,0,0.82)" \
    -font /System/Library/Fonts/Helvetica.ttc -fill white -pointsize 34 -gravity West \
    -annotate +48+0 "$label" "$title_card"

  ffmpeg -y -loglevel error -i "$source_file" -loop 1 -i "$title_card" \
    -filter_complex "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,trim=duration=5,setpts=PTS-STARTPTS[base];[1:v]format=rgba[title];[base][title]overlay=0:570:shortest=1[outv]" \
    -map "[outv]" -t 5 -r 24 -an -c:v libx264 -crf 19 -preset medium \
    -pix_fmt yuv420p "$WORK_DIR/$output_file"
}

interface_segment() {
  local source_file="$1"
  local label="$2"
  local output_file="$3"
  local output_stem="${output_file%.mp4}"
  local title_card="$WORK_DIR/${output_stem}-title.png"

  # The interface carries the information. The overlay is deliberately limited
  # to one short wayfinding label so generated text never competes with real UI.
  magick -size 1280x74 "xc:rgba(0,0,0,0.88)" \
    -font /System/Library/Fonts/Helvetica.ttc -fill white -pointsize 25 -gravity West \
    -annotate +34+0 "$label" "$title_card"

  ffmpeg -y -loglevel error -loop 1 -i "$source_file" -loop 1 -i "$title_card" \
    -filter_complex "[0:v]scale=1280:720:force_original_aspect_ratio=decrease,pad=1280:720:(ow-iw)/2:(oh-ih)/2:color=0xf4f1e8,zoompan=z='min(zoom+0.00025,1.035)':d=120:s=1280x720:fps=24,trim=duration=5,setpts=PTS-STARTPTS[base];[1:v]format=rgba[title];[base][title]overlay=0:646:shortest=1[outv]" \
    -map "[outv]" -t 5 -r 24 -an -c:v libx264 -crf 19 -preset medium \
    -pix_fmt yuv420p "$WORK_DIR/$output_file"
}

join_segments() {
  local output_file="$1"
  shift
  local inputs=()
  local graph=""
  local index=0
  for segment_file in "$@"; do
    inputs+=( -i "$WORK_DIR/$segment_file" )
    graph+="[$index:v]"
    index=$((index + 1))
  done
  graph+="concat=n=$index:v=1:a=0[outv]"
  ffmpeg -y -loglevel error "${inputs[@]}" -filter_complex "$graph" -map "[outv]" \
    -r 24 -an -c:v libx264 -crf 19 -preset medium -pix_fmt yuv420p \
    -movflags +faststart "$OUT_DIR/$output_file"
}

segment "$CLIP_DIR/01-horizon.mp4" "THE HORIZON IS ALREADY BEING PROGRAMMED" overview-01.mp4
segment "$CLIP_DIR/02-atlas.mp4" "OBSERVE  —  STRATEGY ATLAS" overview-02.mp4
segment "$CLIP_DIR/03-dossier.mp4" "AUDIT  —  TEMPORAL EVIDENCE DOSSIER" overview-03.mp4
segment "$CLIP_DIR/04-models.mp4" "COMPARE  —  FIVE MODEL PERSPECTIVES" overview-04.mp4
segment "$CLIP_DIR/05-build.mp4" "SHIP  —  EIGHT OPEN MODULES IN ONE DAY" overview-05.mp4
join_segments sovereign-lens-feature-overview-25s.mp4 \
  overview-01.mp4 overview-02.mp4 overview-03.mp4 overview-04.mp4 overview-05.mp4

interface_segment "$BASE_DIR/ui/uae-01-overview.png" "01  PUBLIC EVIDENCE ENTERS THE DOSSIER" uae-a-01.mp4
interface_segment "$BASE_DIR/ui/uae-evidence-drawer.png" "02  EVERY CLAIM OPENS TO ITS SOURCE" uae-a-02.mp4
interface_segment "$BASE_DIR/ui/uae-graph.png" "03  PROJECT THE TEMPORAL GRAPH AT AS-OF" uae-a-03.mp4
interface_segment "$BASE_DIR/ui/uae-models.png" "04  HOLD EVIDENCE CONSTANT; COMPARE MODELS" uae-a-04.mp4
interface_segment "$BASE_DIR/ui/uae-01-overview.png" "05  PRESERVE AGREEMENT AND DISAGREEMENT" uae-a-05.mp4
interface_segment "$BASE_DIR/ui/uae-02-later-state.png" "06  ADVANCE TIME; OBSERVE THE OUTCOME" uae-a-06.mp4
interface_segment "$BASE_DIR/ui/uae-02-later-state.png" "07  CALIBRATE THE NEXT ASSESSMENT" uae-a-07.mp4
join_segments uae-case-walkthrough-a-evidence-loop-35s.mp4 \
  uae-a-01.mp4 uae-a-02.mp4 uae-a-03.mp4 uae-a-04.mp4 uae-a-05.mp4 uae-a-06.mp4 uae-a-07.mp4

interface_segment "$BASE_DIR/ui/uae-01-overview.png" "UAE–US AI INFRASTRUCTURE · EXECUTIVE DOSSIER" uae-b-01.mp4
interface_segment "$BASE_DIR/ui/uae-graph.png" "CAPABILITY RISES; CONTROL REMAINS CONDITIONAL" uae-b-02.mp4
interface_segment "$BASE_DIR/ui/uae-models.png" "ONE RECORD; MULTIPLE INTERPRETATIONS" uae-b-03.mp4
interface_segment "$BASE_DIR/ui/uae-evidence-drawer.png" "OPEN EVERY CONCLUSION TO THE EVIDENCE" uae-b-04.mp4
interface_segment "$BASE_DIR/ui/uae-02-later-state.png" "RETURN LATER; RESOLVE THE PRIOR COMMITMENT" uae-b-05.mp4
interface_segment "$BASE_DIR/ui/uae-02-later-state.png" "DISAGREEMENT IS THE PRODUCT; TIME EVALUATES IT" uae-b-06.mp4
join_segments uae-case-walkthrough-b-executive-30s.mp4 \
  uae-b-01.mp4 uae-b-02.mp4 uae-b-03.mp4 uae-b-04.mp4 uae-b-05.mp4 uae-b-06.mp4

for output in "$OUT_DIR"/*.mp4; do
  ffprobe -v error -show_entries format=filename,duration,size -of compact=p=0:nk=1 "$output"
done
