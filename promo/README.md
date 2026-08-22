# Sovereign Lens promo

Open-source production package for a 36-second, 16:9 launch film.

The checked-in animatic uses product screenshots and FFmpeg, so the story can be
reviewed without spending generation credits. `happyhorse-shots.json` contains six
replaceable five-second generation prompts. Generated clips belong in
`promo/generated/` and must not contain credentials or private source material.

```bash
./promo/render_animatic.sh
open promo/output/sovereign-lens-animatic.mp4
```

The edit follows one argument:

> The Long Horizon already exists. States and institutions program it through
> capital, talent, compute, infrastructure, law, culture, human networks, and AI
> agents. Sovereign Lens makes those trajectories observable.

## Security

Never pass an API key on the command line or commit it. Use a rotated credential in
an ignored environment file only after confirming the provider endpoint and model
identifier. Keys pasted into chat, issues, logs, or screenshots are compromised.
