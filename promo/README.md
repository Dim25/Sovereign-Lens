# Sovereign Lens promo

Open-source production package for the 16:9 Sovereign Lens launch films.

`happyhorse-shots.json` contains the original six-shot story. `executive-v2-shots.json`
contains the approved register/capacity/prior/state-write treatment used for the
homepage film. `generate_happyhorse.py` implements Alibaba Model Studio's official
asynchronous Happy Horse workflow without storing or printing the API key.

```bash
python3 promo/generate_happyhorse.py \
  --spec promo/executive-v2-shots.json \
  --output-dir promo/generated-v2
```

The edit follows one argument:

> The Horizon already exists. States program it through eight writable registers
> acting on classical sovereign capabilities. Sovereign Lens makes those writes
> and their competing trajectories observable.

## Security

Never pass an API key on the command line or commit it. Use a rotated credential in
an ignored environment file only after confirming the provider endpoint and model
identifier. Keys pasted into chat, issues, logs, or screenshots are compromised.
