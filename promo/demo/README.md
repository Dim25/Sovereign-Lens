# Automated demo loop

`/demo` is a self-running 90-second presentation of the complete Sovereign Lens
instrument. It advances every nine seconds, loops continuously, and supports
keyboard or on-screen control.

- `Space`: pause / play
- `←` and `→`: previous / next
- `Esc`: return home
- numbered timeline: jump directly to a scene

The offline MP4 is assembled from captures of the actual `/demo` route—not a
separately designed mockup. Run:

```bash
./promo/demo/assemble.sh
open promo/demo/final/sovereign-lens-demo-loop-90s.mp4
```

The web-optimized copy is published at
`/media/sovereign-lens-demo-loop-90s.mp4`.
