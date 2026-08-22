# Three-minute pitch

## Title

**Sovereign Lens: an agent that remembers what it believed**

## Script and screen cues

### 0:00–0:25 — Problem

“AI geopolitics is full of announcements: chips approved, campuses unveiled,
partnerships signed. Normal agents summarize the announcement and move on. They do
not return months later to ask whether it happened—or learn why they were wrong.”

**Screen:** terminal before running the demo.

### 0:25–0:55 — Evidence and disagreement

Run:

```bash
python3 demo.py --paced
```

“Here is one dated evidence snapshot about the UAE–US AI campus. Three analytical
perspectives see exactly the same evidence: capability gain, external dependency,
and evidence quality. We preserve disagreement instead of averaging it away.”

“Sovereign Lens does not decide whether an initiative is pro-US, pro-China, or
pro-Africa. It preserves the evidence and asks what capability, dependency, and
optionality actually changed.”

**Screen:** initial graph fact and three perspectives.

### 0:55–1:25 — Commitment

“The agent commits to a falsifiable prediction: at least 200 MW will be reported
operational by the end of 2026. The prediction stores its probability, horizon,
method version and exact evidence-snapshot hash.”

**Screen:** prediction-ledger line.

### 1:25–1:55 — Long horizon

“Now thirteen months pass in seconds. A later source reports 500 MW online. The
old announcement is not deleted; it becomes visibly superseded. We can reproduce
what the agent knew before and after.”

**Screen:** current and superseded facts.

### 1:55–2:30 — Learning under human governance

“The prediction is resolved and calibrated. But the only operational report here
is still from a participant government. The agent proposes a lesson: require an
independent operational signal before calling capacity verified. A human accepts
that policy change. Version one stays in history; version two governs the future.”

**Screen:** Brier score, accepted lesson and `v1 -> v2`.

### 2:30–2:50 — Expansion use cases

“The same memory loop can monitor whether Rwanda's AI policy becomes locally owned
compute and talent, or whether World Bank and Lawyers Hub programs build durable
African decision power versus recurring external dependency.”

**Screen:** README or development-plan use cases.

### 2:50–3:00 — Close

“The disagreement is the product. The horizon turns evaluation into intelligence.
Sovereign Lens remembers analytical commitments, tests them against time, and
learns what evidence to demand next. The horizon already exists; we can make it
programmable now.”

## Demo use cases

### Primary: UAE compute capability and dependency

- Best visual progression from announced to reported operational.
- Demonstrates capability and dependency simultaneously.
- Contains a falsifiable capacity milestone and source-level provenance.

### Expansion: Rwanda policy implementation

- Monitor policy goals against talent, compute, datasets and operational services.
- Centers the agency of a prospective African AI hub rather than a major power.

### Expansion: institutional influence in Africa

- Trace World Bank finance and Lawyers Hub governance programs.
- Separate beneficial capacity, agenda influence, ownership and replacement power.
- Test competing hypotheses without alleging capture from funding alone.

## Failure-safe presentation

- The demo is offline and uses only Python's standard library.
- Keep terminal font large and window clear.
- If pacing is too slow, omit `--paced`.
- Do not claim the deterministic perspective text came from live model calls.
- Call the later campus status “reported operational,” not independently verified.
