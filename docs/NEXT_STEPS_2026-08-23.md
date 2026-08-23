# Recommended next steps

Audit date: 2026-08-23  
Audited: local `main`, GitHub `main`, the production build, and live routes on
[`sovereignlens.ai`](https://sovereignlens.ai)

## Executive recommendation

Sovereign Lens has enough interface and narrative surface for the hackathon. The
next increment should not be another landing page, film, map, or demo route. It
should turn the strongest demonstrated idea—the dated evidence → assessment →
prediction → outcome → calibration loop—into a repeatable pipeline that can run
on a second independent case.

The product should have three public doors:

1. `/` — the thesis and product overview;
2. `/v2` — the shortest proof that the learning loop actually runs;
3. `/demo2min` — the guided tour of the live application.

Keep the other routes temporarily for existing links, but treat `/demo`,
`/demo1min`, `/v2c`, and `/v2/today` as aliases or supporting artifacts rather
than additional product identities.

## What is strong now

- The bitemporal projection reproduces what was knowable at an `as_of` date and
  preserves superseded facts.
- A prediction is tied to its evidence-snapshot digest, later resolved, scored,
  and followed by a human-dispositioned methodology lesson.
- The evidence drawer resolves visible claims to their source metadata.
- The option-space panel preserves disclosed Qwen, GLM, DeepSeek, Claude-session,
  and local Codex perspectives without pretending they are equivalent routes.
- `/v2` states the core machine in about 21 seconds using the case record rather
  than hand-written display numbers.
- `/demo2min` drives the live application in a same-origin frame and performs
  real interactions.
- The automated mobile audit derives routes from the router and checks overflow
  and 44-pixel tap targets across five phone sizes.
- No credential-shaped secrets were found in tracked workspace files during this
  audit.

## Current verification baseline

| Check | Result |
|---|---|
| Git state | local `main` matched `origin/main`; clean before this memo |
| Python tests | 12 passing |
| Web tests | 61 passing |
| Production build | passing |
| Live route checks | `/`, `/v2`, `/v2/today`, `/demo2min`, `/cases`, `/horizon`, and the option-space case returned 200 and rendered their intended views |
| 390px live viewport | no horizontal overflow on the checked routes |
| Automated mobile audit | no overflow or undersized tap-target failures in the observed output; some dense views still report sub-12px long-form text |
| Public media footprint | approximately 26 MB |
| Promo workspace footprint | approximately 101 MB; mostly development and generation artifacts |

## P0 — harden the public story

### 1. Establish one canonical path per job

Use `/` for explanation, `/v2` for proof, and `/demo2min` for presentation.
Redirect or visibly label legacy demo aliases. Do not add another public demo
route until one of these three cannot support a demonstrated user need.

Acceptance:

- every prominent call to action has one of the three destinations;
- shared legacy URLs still resolve, but do not appear as parallel products;
- route-specific canonical URLs and social metadata are emitted for the three
  canonical pages.

### 2. Remove credibility drift in copy and counts

The homepage still says “Qwen, GLM + DeepSeek authenticated runs pending,” while
the repository now contains completed, disclosed runs. The README verification
command says 43 web tests, while the current suite has 61. Replace hand-maintained
counts with generated or deliberately count-free language where possible.

Acceptance:

- homepage provider wording matches the committed run artifacts;
- README verification output matches the current suite;
- CI fails when generated feature/status documentation is stale.

### 3. Make real versus synthetic impossible to miss

`/v2/today` is correctly labelled as synthetic and says its placeholder sources
must never be cited. Preserve this distinction in the masthead, exported data,
screenshots, social previews, and any future API response—not only in explanatory
paragraphs.

Acceptance:

- every synthetic record has `evidence_status: synthetic` in data and UI;
- no synthetic entity or source can be exported without that flag;
- tests assert both directions: real records never show the synthetic label and
  synthetic records never show the real-source claim.

### 4. Finish accessibility and performance cleanup

The mobile audit finds no blocking layout or target failures, but `/v2`, the
option-space page, and the dossier contain several long text blocks below 12px.
Increase those sizes or shorten the copy. Lazy-load non-critical videos and avoid
shipping every historical promo asset in the first product path.

Acceptance:

- zero long-form text below 12px in the automated audit;
- homepage LCP is measured on a throttled mobile profile;
- only the media required by the current page is requested before interaction.

## P1 — build the second loop

This is the highest-value next milestone and the best proof of the Long Horizon
theme.

1. Persist the first case's assessment, prediction, outcome, human review, and
   accepted methodology lesson.
2. Start a fresh process or model session with no conversational context.
3. Retrieve only the relevant, authorized lesson with provenance.
4. Evaluate a second event under methodology v1 and v2.
5. Demonstrate the behavioral difference: v2 must ask for the independent
   operational signal that v1 missed.
6. Produce a succession report: retained, drifted, lost, and newly inferred.

Acceptance:

- the second run is reproducible from committed inputs;
- v1 remains runnable and its history is not rewritten;
- the retrieved lesson is linked to its originating outcome and human approval;
- the result is behavioral, not merely a statement that “memory was used.”

## P1 — automate evidence into structured records

The largest product gap is before the graph. Sources and relationships are still
hand-authored. Implement one narrow ingestion path before expanding the case list:

```text
URL or archived document
→ fetched artifact + content hash
→ candidate claims/events
→ entity resolution with uncertainty
→ human review
→ accepted append-only graph writes
```

Start with official HTML/PDF sources for one case. Do not begin with global
crawling or news-volume optimization.

Acceptance:

- a clean checkout can ingest one URL into schema-valid candidate records;
- excerpts and source locators survive the transformation;
- no extracted claim becomes accepted evidence without review;
- rerunning the same artifact is idempotent.

## P1 — generalize model parallax

Move the one completed option-space experiment behind a provider-neutral runner.
Each model should receive the same question, evidence package, graph snapshot,
horizon, and JSON schema. Preserve provider, exact model ID, route, region,
response ID, timestamp, prompt hash, failure, and truncation metadata.

Then add a tested evaluator that identifies semantic agreement, material
divergence, assumptions, missing evidence, and falsifiers. It must not average
confidence into a sovereignty score.

Acceptance:

- one command runs a disclosed panel for any registered case;
- failed and truncated runs remain visible;
- evaluator output resolves every cited claim to an assessment and source;
- human edits to synthesis are recorded, not silently substituted.

## P2 — improve the evidence base before adding breadth

- Archive source artifacts where licensing permits and verify hashes on read.
- Add at least one corroborating or challenging source for each material claim.
- Separate announcements, authorizations, construction, operation, and verified
  outcomes as different event types.
- Add contract fields that matter for option space: termination, hosting,
  portability, interoperability, audit, localization, and replacement rights.
- Expand China–Fiji and World Bank/Lawyers Hub only when project-level primary
  evidence supports a falsifiable trajectory question.

## P2 — production data and operations

Remain on SQLite until concurrent writers or deployment constraints justify a
server database. Before migration, normalize actors, assets, events,
relationships, reviews, and model runs; add migrations and foreign keys; expose a
read-only case/snapshot API; and add structured logs for ingestion, evaluation,
review, and projection.

Add CI for Python tests, web tests, production build, schema validation, route
rendering, secret scanning, and the mobile audit. Keep provider credentials out of
browser code and rotate any key ever pasted into a conversation or terminal log.

## P3 — evaluation and research credibility

- Grow calibration beyond `n = 1` before publishing comparative reliability
  claims.
- Pre-register outcome definitions and verification plans.
- Measure prompt sensitivity and cross-model dependence.
- Add analyst identity, rationale, and timestamp to every human disposition.
- Publish a methodology version history and a concise known-limitations page.
- Invite regional reviewers for Africa and Pacific cases before interpreting
  “pro-Africa,” “pro-China,” “pro-UN,” or “pro-Canada” trajectories.

## Recommended two-week sequence

### Days 1–2

- Canonicalize the three public routes.
- Correct stale provider/test copy.
- Add route-specific metadata and finish small-text cleanup.
- Freeze additional promotional UI work.

### Days 3–6

- Implement one official-document ingestion path with review and idempotency.
- Store extraction provenance and archived hashes.

### Days 7–10

- Generalize provider adapters and structured assessment outputs.
- Implement the first automatic disagreement evaluator with fixtures and tests.

### Days 11–14

- Run the independent second loop under v1 and v2.
- Publish the succession report and update `/v2` to show the learned behavioral
  difference.

## Explicitly defer

- a 3D globe;
- a composite sovereignty score;
- autonomous global crawling;
- Neo4j before SQL traversal is demonstrably inadequate;
- more presentation routes;
- claims of model or source reliability from one resolved prediction;
- allegations about institutional influence without attributable evidence and
  expert review.

## The next demo sentence

> Sovereign Lens did not merely remember its previous assessment. A later outcome
> changed the reviewed method, and a fresh agent used that lesson to demand better
> evidence on an independent case—without rewriting what the first agent believed.

