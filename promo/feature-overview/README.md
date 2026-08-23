# Feature and UAE case films

Three silent, captioned films explain the instrument without inventing interface
screens. The UAE walkthroughs use screenshots captured from the running
`/cases/uae-us-ai-infrastructure` route.

## Selected cuts

- **Primary — Evidence loop (35s):** evidence → provenance → temporal graph →
  model comparison → disagreement → later outcome → calibration.
- **Alternate — Executive cut (30s):** situation → dependency → model range →
  provenance → resolution → long-horizon learning.
- **Build overview (25s):** a compact tour of Strategy Atlas, the temporal
  dossier, model parallax, and the shipped modules.

The 35-second evidence loop is the default case walkthrough because it shows the
complete analytical method. The 30-second cut remains available beside it for an
executive-first presentation.

## Reproduce

`assemble.sh` uses ImageMagick and FFmpeg. It animates the real captured UI with
a restrained zoom and adds one short navigation label per scene. Raw provider
clips, intermediate renders, review sheets, and local masters are intentionally
ignored. Web-optimized outputs live in `web/public/media`.

```bash
./promo/feature-overview/assemble.sh
```

## HappyHorse generation provenance

HappyHorse supplied cinematic and interface-motion studies used in the general
feature overview. The UAE case cuts deliberately prioritize real screenshots.
The exact model, task IDs, prompts, and source mode are recorded in `shots.json`.

