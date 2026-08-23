# Sovereign Lens — presentation interface

A brutal-white Swiss product and dossier for the long-horizon demo in
`../demo.py`. The product combines three levels of resolution:

- `/` — public concept and live-case introduction
- `/brief` — executive situation brief
- `/cases` — comparative case index
- `/cases/uae-us-ai-infrastructure` — full analyst dossier
- `/cases/china-fiji-capability` — infrastructure, talent and local optionality
- `/cases/africa-ai-governance-capacity` — continental strategy and evaluation capacity
- `/build` — integration architecture index
- `/build/temporal` — durable scheduling and reassessment workflow
- `/build/stash` — cross-rollout research memory
- `/build/coframe` — adaptive explanation with analytical invariants

The dossier remains one screen at 1440×900, built to be narrated in three minutes
from a laptop projector.

It is a presentation layer over the core, not a second implementation of it. The
core's semantics — read-time bitemporal projection, snapshot digests, the
prediction ledger, calibration, human-governed methodology versions — are
reproduced here so the screen can move through time without a backend, and the
digest computation is checked against the values `demo.py` prints.

## Run it

```bash
cd web
npm install
npm run dev          # http://localhost:5173
```

Present at 1440×900. The layout is fixed to that ratio: panels scroll inside
themselves, the page never scrolls.

```bash
npm test             # 35 unit and component tests
npm run build        # typecheck + production bundle
npm run shot         # re-capture docs/*.png at 1440×900
```

## The three-minute path

| Beat | Action | What appears |
|---|---|---|
| Evidence | opens at `as_of 2025-05-28` | 9 nodes, 7 facts, snapshot `08e5442e45ae` |
| Disagreement | read the three cards | capability 72 · dependency 78 · auditor 91, one material axis |
| Commitment | read the ledger | 65% by 2026-12-31, pinned to that snapshot hash, `OPEN` |
| Long horizon | **Advance 13 months** | 500 MW current, 200 MW **superseded and still on screen**, digest changes |
| Calibration | read the Brier panel | resolved, 0.1225 against a 0.25 coin-flip baseline, `n = 1` stated |
| Governance | read the review panel | `v1 → v2`, accepted by a human analyst |
| Provenance | click any **evidence** link | the source, and whose account it is |

`←` / `→` scrub between stops. **Rewind to T0** resets for a second run.

## Design rules

Black, white, warm neutral. Inter / Helvetica / system sans, loaded from the
system — no webfont request, so the demo survives a dead conference network.
Hairline rules, no gradients, no shadow, no radius, no decorative map.

One accent, and it carries exactly two meanings:

- **material disagreement** between perspectives
- **state that changed at this `as_of`** — a new relationship, a fact that
  opened or closed

Nothing else is allowed to be red. A globe was considered and rejected: the
analytical objects here are relationships over time, and geography is the one
attribute that carries no weight in the argument.

## Data seam

Components depend on the `DataSource` interface in `src/types.ts` — never on the
fixture. Today `createFixtureSource` serves frozen local JSON. When the core
grows `python3 demo.py --json` or an HTTP endpoint:

```ts
const source = await createHttpSource('/api/case/uae_us_ai_infrastructure')
```

The payload only has to match `CaseFixture`. No component changes.

`src/data/adapter.ts` holds the projection. `projectFacts` hashes the same
column set `demo.py` hashes, in the same canonical form, so `adapter.test.ts`
asserts the TypeScript projection reproduces `c7871e3381f8` and `e4ea995af4cf`
— the digests the Python demo prints — from the same two rows. If the two
implementations ever drift, that test fails.

## Fixture and provenance

The interface ships three source-linked fixtures. The original
`src/data/uae-us-ai-infrastructure.fixture.json` contains 11 sources, 12 nodes, 15
relationships, 11 facts, 6 assessments, 5 disagreement axes, 1 prediction,
1 methodology lesson.

The China–Fiji and African AI-governance dossiers deliberately distinguish
announced cooperation from implementation. They also encode two guardrails:
external funding is provenance rather than proof of control, and a broad
continental category is not treated as a single geopolitical actor.

Every source is a real, public, first-party or oversight document with a live
URL, drawn from the case manifest in the private research workspace: UAE Embassy
statements, Microsoft and G42 announcements, the Congressional Record, a
Commerce export statement, and a CRS overview. Every fact, node, relationship,
assessment and prediction carries `source_ids`, and a test asserts every one of
those references resolves.

Two facts are lifted verbatim from `demo.py` so the screen and the terminal
agree: `campus_capacity_planned` and `campus_capacity_reported_operational`.

### What this screen does not claim

Stated on screen, in the Disclosure strip, not only here:

- **Perspective text is a deterministic fixture, not a live model call.** The
  README's provider adapters are not implemented. Do not describe these as three
  models having been asked.
- **The 2026 capacity is *reported* by a participant government**, not
  independently verified. That is the auditor's dissent, and it is the reason
  methodology v2 exists.
- **The digest shown is not `demo.py`'s digest** for the same date. Same
  construction, more facts in the projection — so a different hash. The
  conformance test pins the construction; the fixture is broader than the demo.
- **`n = 1`.** One resolved prediction is a data point. The panel says so rather
  than drawing a calibration curve through a single observation.

### Bitemporal detail worth pointing at

The congressional letter is dated **2024-07-10** but entered the record on
**2025-06-11**. Scrub to 2024-09-23 and it is absent; scrub forward and it
appears with its original validity date. The projection filters on
`recorded_at <= as_of` before it filters on validity, so the screen shows what
was knowable then, not what is known now. Supersession is recorded the same way:
at T0 the 200 MW fact has no `valid_to`, because its closure had not yet
happened.

## Layout

```
┌─────────────────────────────┬──────────────────────────────┐
│ relationship graph          │ three perspectives           │
│                             ├──────────────────────────────┤
│                             │ disagreement                 │
├─────────────────────────────┼──────────────────────────────┤
│ facts at as_of              │ prediction ledger            │
│  current / superseded       ├───────────────┬──────────────┤
├─────────────────────────────┤ calibration   │ methodology  │
│ disclosure                  │               │  v1 → v2     │
├─────────────────────────────┴───────────────┴──────────────┤
│ time scrubber                          [advance 13 months] │
└────────────────────────────────────────────────────────────┘
```

Perspective cards show the first two drivers, counterarguments and missing
evidence, and state how many they are not showing. Aligned disagreement axes
collapse to one line; material ones stay open. Nothing is truncated silently.

## Screenshots

`docs/t0-commitment.png`, `docs/t1-resolution.png`, `docs/evidence-drawer.png` —
1440×900 at 2× — regenerate with `npm run shot`.

## Scope

Everything here lives under `web/`. `demo.py`, `tests/`, `docs/` at the repo
root and the private research workspace are untouched.
