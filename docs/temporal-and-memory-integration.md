# Long-horizon memory: architecture, and where (if anywhere) Temporal fits

**Written:** 2026-08-22, Long Horizon Agents Build Day, AGI House
**Deadlines:** draft saved by 19:00, submitted by 20:00, 3-minute demo.
**Status:** plan, not software. Nothing here is claimed as working.

---

## 0. Verdict

**Do not put Temporal in the critical path. Build the core substrate-free behind one
small seam, and keep Temporal as an optional adapter behind that seam.**

An earlier draft of this document argued that Temporal's event history is what makes the
memory-Policy surface auditable. That was wrong, and it was the load-bearing claim.
Provenance in this project must be **analytical** — which evidence, which graph snapshot,
which facts were exposed versus suppressed as superseded, which model, which methodology
version. That record has to exist in domain terms no matter what drives the pipeline. A
workflow event history is execution bookkeeping; it is a debugging aid, not the artifact an
analyst inspects.

Once that is corrected, the case for Temporal shrinks to scheduling and retries — real, but
replaceable, and not the core benefit.

---

## 1. What the core actually is

Strip the substrate away and Sovereign Lens's value is three pieces of domain logic:

1. **Read-time bitemporal projection** — retrieval that serves the state live at `as_of`,
   and flags superseded facts rather than silently dropping them.
2. **The prediction ledger** — an append-only record of falsifiable predictions with
   horizons, so later outcomes can be scored against earlier beliefs.
3. **Disagreement preservation** — several models over an identical evidence package, with
   divergence kept rather than averaged.

None of the three requires a workflow engine. All three run identically under a `while`
loop, a cron job, or Temporal. **The semantics are the asset; the driver is not.**

This is also what the repo already says about itself:

> *Independence is architectural. Models, providers, prompts, and data sources should be
> replaceable.*

Schedulers belong on that list. A sovereignty observatory that cannot be run without a
specific vendor's execution engine is arguing against its own thesis.

---

## 2. The two objects that carry the value

### 2.1 The projection, and the record it emits

The graph schema already has `valid_from` / `valid_to` on relationships and status
lifecycles on assets (`announced → under_construction → operational → retired`). What is
missing is the read-time policy:

```
graph_snapshot(case_id, as_of: date) -> Snapshot
    exposed:    facts live at `as_of`
    superseded: facts that were live earlier and are not now, kept visible and flagged
    hash:       content hash over (exposed ∪ superseded)
```

Every assessment then carries the provenance record that makes Policy observable:

```
AssessmentRecord
    graph_snapshot_hash, as_of
    exposed_fact_ids, superseded_fact_ids
    model, prompt_hash, methodology_version
    evidence_source_ids
```

This is the auditable artifact. It is ~50 lines of pure function plus a dataclass, it has
no runtime dependency, and it is what "why does the system believe this?" resolves to.

### 2.2 The prediction ledger

```
Prediction
    id, case_id, assessment_id, claim
    horizon_date, evidence_snapshot_hash, model, methodology_version
    status: open | resolved | abandoned
    resolved_at, observed_outcome, brier
```

Append-only, one SQLite table. A prediction is *due* when `horizon_date <= now` and
`status == open`. Resolving one is: run a verification pass, score it, append a calibration
record, emit a methodology lesson.

That is the entire long-horizon mechanism. Note what it does **not** need: a process that
stays alive for six months. It needs a durable *record* plus anything at all that sweeps it.

---

## 3. The seam

One protocol, three implementations, chosen by config:

```
Runner
    schedule(task_key, due_at, payload) -> None
    sweep(now) -> Iterable[DueTask]        # what is owed
    record(task_key, result) -> None
```

| Adapter | Implementation | Use |
|---|---|---|
| `InProcessRunner` | loop + injected `Clock` | tests, and the live demo |
| `CronRunner` | SQLite sweep, invoked by cron/systemd/GitHub Actions | **the default; ~40 lines** |
| `TemporalRunner` | durable timers, activities, retries | optional; for operators who already run Temporal |

Paired with an injectable clock:

```
Clock.now()
    SystemClock   — production
    ScaledClock   — 1 second = 30 days, for the demo
    FrozenClock   — tests
```

The clock is not a demo hack. Any system that scores predictions against horizons needs a
controllable clock to be testable at all. Building it first is correct regardless.

---

## 4. Honest cost/benefit on Temporal

| What it offers | What it's worth here |
|---|---|
| Durable timers surviving process death | Real, but horizons are **months**. You need "sweep what's due, daily" — not millisecond wakeups. A cron over the ledger is sufficient and is ~40 lines. |
| Event history as provenance | **Does not substitute for §2.1.** Execution-level, not analytical. You write the domain record either way. |
| Versioning while executions are in flight | Genuinely good, and genuinely irrelevant until you have long-running executions and a team. Today the methodology version is a string in the record. |
| Activity retries on flaky providers | `tenacity`, three lines. |
| Signals / queries for async evidence | You have a database. |
| Fan-out to N perspective models | `asyncio.gather`. |

Against that:

- **Determinism discipline is a real tax** on code being written in four hours: no clock
  reads, no `random`, no model calls, no dict-ordering dependence inside workflow code.
  Violations fail at replay, not at write time, which is the worst place to learn.
- **Contributor friction.** This repo wants contributors across countries and disciplines.
  `git clone && python run.py` versus "install a server, start a worker, learn workflow
  determinism" is a real change in who can participate. Inspectability and reproducibility
  are stated project values.
- **A runtime dependency in the sovereignty story.** Defensible (Temporal is open source and
  self-hostable) but it is one more thing a counterpart must operate.

**Conclusion:** Temporal is a good answer to a problem this project does not yet have —
many concurrent long-running executions, operated by a team, needing in-flight versioning.
It is worth adopting when that day arrives, which is exactly why the seam in §3 exists.

---

## 5. The demo, without Temporal

Same hero moment, fewer moving parts:

```
assess()               → prediction registered, horizon 2027-02-22, ledger row written
ScaledClock advances   → 1 s = 30 days; six months passes in six seconds on stage
sweep()                → prediction is due
verify()               → outcome observed, Brier scored, calibration record appended
                       → methodology lesson: "overweighted announcement, underweighted
                          implementation capacity"
```

Then kill the process mid-run and restart it: the ledger row is still open, still due, and
the sweep picks it up. Durability demonstrated in twenty seconds, with no server to explain.

This runs the **real code path**. Temporal's time-skipping lives in its test environment, so
demoing a six-month sleep that way means presenting the test harness and explaining the
distinction — on a three-minute clock, that costs more than it buys.

Close on the provenance record from §2.1 and the stale-hit number from §6.

---

## 6. RPR-Memory — unchanged, and now the centre of gravity

With Temporal out of the critical path, the differentiator is entirely this, which is fine,
because this is the part that is actually yours.

**AMB / RPR-Memory** (`../my/10_void/amb`) decomposes persistent memory into three failure
surfaces — **Retrieval** (did the right evidence surface), **Policy** (was *current* state
exposed at read time, or a stale superseded one), **Reasoning** (was the answer composed
correctly). The keystone result is that Policy is a **separately repairable failure that
aggregate scores hide** (`docs/GRAPHITI_BITEMPORAL_EXPERIMENT_2026-06-01.md`):

| Arm | update correctness (canonical) | stale hit |
|---|---:|---:|
| Naive, no read-time projection | 0.000 | 1.000 |
| Validity windows + `W_mem` read-time projection | **0.680** | **0.080** |

Sovereign Lens is a production instance of exactly that failure. The 2023 Microsoft–G42 MoU
is superseded by the 2024 investment; an export authorization is superseded by a later
condition; a campus moves from announced to operational. **Serving the stale edge produces a
confidently wrong sovereignty judgment carrying correct-looking citations** — the worst
failure this project can have, and one that averaging model outputs will never reveal.

Three concrete integrations, none of which need a workflow engine:

1. **§2.1 is the repair.** `as_of` projection with superseded facts flagged, and the
   exposed/suppressed sets recorded per assessment.
2. **Implement memory against the AMB `MemoryUnit` protocol** — the six primitives in
   `../my/10_void/amb/protocol.py` (`write`, `read`, `update`, `delete`, `consolidate`,
   `snapshot`/`restore`). Payoff: the memory is benchmarkable against a published benchmark
   with 37 reference architectures and bootstrap CIs, instead of demoed on vibes.
3. **Supersession probes from the real corpus.** The UAE/US case has natural pairs
   (MoU→investment, announced→operational, authorization→condition). Build ~10 current-state
   probes; report **stale-hit rate** and **update correctness** in the demo. Report it
   honestly even if it is bad — a measured bad number is a stronger artifact than an
   unmeasured good one, and it matches the README's stated posture.

Portfolio alignment: RPR-Memory's open reviewer objection is *"why predict instead of run?"*
A live system instrumented on a real geopolitical corpus is constructive corroboration on a
non-synthetic domain. And evaluation sovereignty gets a concrete proxy: stale-hit rate is a
measurable answer to "can this institution tell whether its imported system is telling it
something current."

**Boundary to hold:** keep this artifact separate from the Niue/Barbados counterpart thread.
The strategy memo freezes outreach pending D1/D2; a public hackathon demo is not a vehicle
for reopening it. Build the capability, do not attach a counterpart's name to it.

---

## 7. Today's scope (~4.5 h to draft)

**Build, in this order — each step is demoable if the next one doesn't land:**

1. `Clock` + `graph_snapshot(as_of)` with superseded-flagging. *(~45 min)*
2. `AssessmentRecord` with exposed/suppressed fact IDs and snapshot hash. *(~30 min)*
3. Three perspectives — `capability`, `dependency`, `evidence_auditor`; the schema enum
   already exists — over the seeded UAE/US case, plus a divergence diff. *(~75 min)*
4. Prediction ledger + `sweep` + `ScaledClock` demo. *(~60 min)*
5. ~10 supersession probes; print stale-hit and update correctness. *(~45 min)*

**Do not build today:** Temporal, Neo4j, autonomous crawling, a frontend, numerical
sovereignty scores (the README explicitly forbids publishing these), the AMB `MemoryUnit`
adapter — design step 1's interface to fit those six primitives, implement after the event.

**Cut order:** probes → divergence nuance → third perspective. Never cut steps 1, 2, 4;
they are the thesis.

**If everything lands early** — and it will not — a `TemporalRunner` behind the §3 seam is
~60 lines and becomes a *demonstration* of the replaceability principle rather than a claim
about it. That is the only framing in which it strengthens the project, and it is strictly
better than having built on it from the start.

---

## 8. README sync

Once code exists:

1. **Terminology note** — the README uses *temporal graph* for bitemporal validity.
   Standardize on **bitemporal**, and state the pair: **valid time** (`valid_from`/`valid_to`,
   when a fact was true in the world) versus **transaction time** (when the system learned
   it). Both belong in the domain record.
2. **Prototype target stack** — it currently says "LangGraph or a lightweight asynchronous
   runner." Replace with: *pluggable runner (in-process by default; cron for scheduled
   sweeps; durable-execution adapters such as Temporal optional)*.
3. **New section: "Long-horizon memory"** — §1, §2 and §6 condensed. Lead with the
   read-time projection and the prediction ledger, not with infrastructure.
4. **Analytical lineage** — add RPR-Memory alongside the Evaluation State thesis; cite the
   R/P/R decomposition where "long-horizon memory" currently appears as a contribution area.
5. **What actually works today** — tick only what ran end to end. Add
   `[ ] Read-time supersession projection` and `[ ] Prediction ledger and calibration sweep`.
6. **Limitations** — add: *stale-state exposure (a memory-Policy failure) is measured, not
   assumed absent; the current stale-hit rate is reported in §X.*

Keep the AI-slop banner until a human edit pass happens. It is doing real work.
