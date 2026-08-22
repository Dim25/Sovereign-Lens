# Development plan

## Hackathon outcome

Build one complete long-horizon loop, optimized for a three-minute demo:

```text
dated evidence -> bitemporal snapshot -> three perspectives -> prediction
-> later evidence -> verification -> calibration -> human-reviewed lesson
```

The committed offline demo is the baseline. It uses deterministic assessment text
so it cannot fail because of network access or model credentials. Provider-backed
assessments can be added behind the same record schema after the baseline works.

## Database plan

### Day-one database: SQLite

SQLite is the correct hackathon database because it is portable, inspectable,
transactional, and requires no service. The demo uses these tables:

| Table | Purpose | Append/update rule |
|---|---|---|
| `sources` | URL, publisher, date and provenance | append; correct via explicit replacement record later |
| `facts` | bitemporal graph statements | supersede with validity boundaries; do not delete history |
| `assessments` | model/perspective output tied to snapshot | append-only in production |
| `predictions` | falsifiable claims and horizons | append, then resolve status and outcome |
| `methodology_lessons` | diagnosed failures and human decisions | append-only |

Before public deployment, add `events`, normalized `actors`, `assets`,
`relationships`, `human_reviews`, and a migration mechanism. Use foreign keys,
content hashes, methodology versions, and source locators throughout.

### Read model

`graph_snapshot(case_id, as_of)` returns:

- facts valid at `as_of`
- superseded facts, visibly marked
- a deterministic snapshot hash

Every assessment and prediction stores that hash. This is analytical provenance;
workflow logs are not a substitute.

### Later databases

- **PostgreSQL:** multi-user API, row-level access, robust migrations and analytics.
- **pgvector:** optional semantic discovery; never the authoritative fact store.
- **Neo4j:** only if graph traversal becomes painful in SQL; not required for MVP.
- **Object storage:** archived source artifacts where licensing and policy permit.
- **Stash:** optional learning/retrieval across rollouts; not the sole ledger.

## Build sequence

### Next executable milestone — close the second loop

The current demo proves one evidence-to-calibration loop. The next milestone must
prove that its accepted lesson affects a later, independent evaluation run:

1. Persist the t0 assessment, prediction, outcome and human-approved lesson.
2. Start a fresh process or model session with no conversational context.
3. Retrieve only relevant, authorized memory with provenance.
4. Evaluate a second event using methodology v2.
5. Run the same probe under v1 and v2 and show the behavioral difference.
6. Produce a succession report: retained, drifted, lost, and newly inferred.

Acceptance criterion: the second run demands the independent operational signal
learned in the first run, cites the lesson that caused the change, and can reproduce
the v1 result without rewriting history.

### P0 — submission baseline

- Run `python3 demo.py --paced` from a clean checkout.
- Preserve planned and superseded facts through time.
- Store three perspectives against one snapshot.
- Register and resolve one prediction.
- Record calibration and an accepted human methodology lesson.
- Keep all source claims attributed.

### P1 — credible agent behavior

- Add Pydantic or JSON Schema validation.
- Add provider adapters for independent model assessments.
- Require structured drivers, counterarguments and missing evidence.
- Add a disagreement evaluator that compares claims rather than averaging scores.
- Add an explicit verification plan to every prediction.

### P2 — memory across rollouts

- Add human-review records with author, rationale and timestamp.
- Retrieve similar prior errors when proposing lessons.
- Test a Stash adapter against a local ledger adapter.
- Add retrieval, temporal-policy and reasoning failure labels.
- Report stale-hit rate and update correctness.

### P3 — UI and broader cases

- Graph/timeline view with evidence drill-down.
- Prediction ledger and calibration history.
- Rwanda policy-to-capability case.
- World Bank/Lawyers Hub institutional-influence case.
- Fiji optionality case only after project-level deployment evidence is available.

## Verification

```bash
python3 demo.py
python3 -m unittest discover -s tests -v
```

## What not to build today

- global autonomous crawling
- a composite sovereignty score
- Neo4j or a workflow service
- unreviewed allegations of institutional capture
- a frontend that displaces the temporal learning loop
