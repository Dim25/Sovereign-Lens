# Programmable horizon and trajectory sovereignty

## Decision memo

Sovereign Lens currently asks what an AI-related event changed and preserves how
different models interpreted it. The programmable-horizon thesis extends that
design across time: retain those interpretations, commit them to observable
expectations, revisit them when evidence changes, and govern what the system learns.

Trajectory sovereignty extends it one step further. It asks not only what a state
possesses today, but whether that state can remain an author of its technological
direction as providers, models, governments, and conditions change.

> The horizon makes learning possible. Trajectory sovereignty determines who can
> direct what comes next.

## Working definitions

**Programmable horizon** is the inspectable feedback loop by which evidence and
commitments from the past alter future evaluation:

```text
observe -> interpret -> commit -> revisit -> calibrate -> govern -> inherit
```

**Sovereign capability** is the durable ability to direct, evaluate, reproduce,
constrain, replace, and learn from a capability—not merely to access or own it.

**Trajectory sovereignty** is an institution's ability to preserve learning and
deliberately revise its direction through changes of model, vendor, leadership,
infrastructure, and geopolitical conditions.

## Horizon Blocks: the programmable substrate

The core blocks of a programmable horizon are not AI agents. They are the durable
and recombinable capabilities through which societies and states have always shaped
future possibility: **capital, talent, compute, infrastructure, energy, data,
culture, institutions, law and policy, standards, and human networks**. AI agents
are one newer block within this larger system. They may accelerate observation,
coordination, allocation, persuasion, and decision-making, but they remain dependent
on—and capable of changing—the classical blocks around them.

States, firms, institutions, communities, and human swarms program trajectories by
allocating these blocks, coupling them together, restricting access, transmitting
them across generations, and deciding who may operate or replace them. Sovereign
Lens observes this programming in real time at the state and sovereignty level.

For every trajectory, the system therefore records:

```text
Horizon Block -> programming action -> responsible actors
              -> capability / dependency / control / optionality effect
              -> observable consequence through time
```

## Why this changes the analytical unit

A snapshot describes present assets and relationships. A trajectory describes how
the state's option space changes. The same foreign-financed data center may support
several competing trajectories:

1. **Sovereign accumulation** — local operation, evaluation, and replacement power grow.
2. **Managed interdependence** — dependency remains but becomes governable and reversible.
3. **Capability without control** — services grow while material authority remains external.
4. **Institutional hollowing** — imported capability displaces local expertise and authority.
5. **Regional capability formation** — infrastructure becomes shared regional capacity.
6. **Plural-provider optionality** — interoperability reduces unilateral leverage.

Sovereign Lens should preserve these as hypotheses. It should not decide whether an
initiative is “pro-US,” “pro-China,” or “pro-Africa.” It should record what changed,
what each interpretation predicts, and which trajectory later evidence supports.

## Three layers of sovereignty

| Layer | Question |
|---|---|
| Asset sovereignty | What can the state own or access? |
| Operational sovereignty | What can it independently operate, evaluate, constrain, and replace? |
| Trajectory sovereignty | Can it preserve learning and redirect its technological future? |

A state can lack a frontier model yet retain trajectory sovereignty through strong
evaluation institutions, provider alternatives, bargaining capacity, portable
knowledge, and accountable governance. It can also own infrastructure while lacking
trajectory sovereignty if it cannot audit, adapt, or replace the surrounding stack.

## Changes introduced to Sovereign Lens

### 1. A trajectory becomes a first-class analytical object

Add a `trajectory_hypothesis` record with:

- case and jurisdiction
- explicit description and direction
- capability, dependency, control, and optionality deltas
- supporting and challenging evidence
- observable indicators and review horizon
- model or human author, method version, and snapshot hash
- status: proposed, strengthening, weakening, superseded, or unresolved

This is not a forecast score or geopolitical label. It is a falsifiable explanation
of how a sequence of events may be changing future options.

### 2. Events gain an option-space delta

In addition to `provides`, `funds`, `hosts`, or `depends_on`, assessments ask:

- Which future choices opened or closed?
- Which dependencies became more or less reversible?
- Who gained authority over later decisions?
- What would survive withdrawal of the current provider?
- Which local knowledge or institution persists after the project ends?

### 3. Model outputs become longitudinal commitments

Each model receives the same evidence package and analytical lenses. Its output must
include competing trajectory hypotheses, distinguishing indicators, a revisit date,
and evidence that would reverse its view. Provider identity and analytical lens stay
separate; a model is never treated as a country delegate.

### 4. The evaluator compares trajectories, not only conclusions

The disagreement layer identifies where models disagree about causal direction,
reversibility, institutional learning, and control. Later observations resolve or
reweight those disagreements instead of silently replacing them.

### 5. Memory is tested through succession

A new agent instance must inherit authorized evidence, commitments, corrections,
and methodology while exposing what was retained, drifted, lost, or newly inferred.
This adds a SENGU-style succession report to the existing prediction and calibration
loop. Storage demonstrates persistence; the report demonstrates continuity.

### 6. The interface gains a trajectory view

The executive view should show a small number of competing paths rather than a
single sovereignty score. Each path exposes its current evidence, option-space
effects, next distinguishing signal, review date, and change since the last snapshot.

## Minimal implementation order

1. Close the existing second loop: prove methodology v2 changes a fresh evaluation.
2. Add a JSON Schema for `trajectory_hypothesis` and fixture records for the UAE case.
3. Extend assessment output with option-space deltas and distinguishing indicators.
4. Add trajectory comparison to the disagreement evaluator.
5. Add one trajectory panel to the executive brief.
6. Run the same contract on China–Fiji and an African or multilateral initiative.
7. Add cross-case calibration only after multiple hypotheses have reached review dates.

## Guardrails

- Do not collapse trajectories into one unexplained sovereignty score.
- Do not infer control or capture from funding alone.
- Do not treat provider origin as a national political perspective.
- Do not rewrite old hypotheses after later outcomes are known.
- Do not let an inherited lesson govern future analysis without provenance and human authority.
- Preserve “insufficient evidence” as a valid trajectory state.

## Product formulation

> Sovereign Lens makes geopolitical AI trajectories inspectable and programmable.
> It records how capability, dependency, control, and optionality change; preserves
> competing interpretations; and returns later to learn which trajectories
> materialized.

The disagreement is the product. The programmable horizon turns evaluation into
intelligence. Trajectory sovereignty asks who retains the power to direct what
comes next.
