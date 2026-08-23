# Stash evaluation for Sovereign Lens

## The question

Can shared agent memory improve a fresh research rollout without increasing stale,
unauthorized, untraceable, or poisoned context?

Stash is not being evaluated as the evidence database. Sovereign Lens keeps sources,
bitemporal facts, assessments, predictions and methodology versions in its canonical
ledger. Stash is a candidate context and learning layer above it.

## Five questions to ask first

1. Can retrieval enforce case, time, review-status and access filters before semantic
   ranking?
2. Can corrections supersede prior memory without deleting history?
3. Does every result include an immutable origin, exact excerpt and retrieval trace?
4. Can unreviewed agent memory be technically separated from human-approved lessons?
5. Can the full memory and metadata be exported and reproduced in a self-hosted setup?

If any answer is unclear, ask the Stash team to demonstrate it using one corrected case.

## One-hour bake-off

Prepare 25 entity/source decisions from two dossiers. Mark five as superseded and five as
restricted to a reviewer role. Start a fresh agent with identical prompts under three arms:

1. no memory;
2. local append-only retrieval;
3. Stash retrieval.

Score Recall@5, stale-hit rate, provenance completeness, unauthorized retrievals and whether
the agent applies a reviewed methodology lesson. Then disable Stash and verify the local
ledger path still completes.

## Adoption gate

Adopt the integration when it improves relevant recall and downstream behavior without
increasing stale or unauthorized context, and when accumulated memory remains exportable,
inspectable and reproducible. Treat latency and convenience as secondary metrics.

## Memory record required by Sovereign Lens

Every promoted memory needs: immutable ID, author type and ID, recorded time, optional valid
time, superseded-memory IDs, case and snapshot hash, source IDs, review status, access class,
retention/review date, and an explicit `memory_is_evidence: false` marker. The micro exporter
in `integrations/micro.py` now emits this envelope.
