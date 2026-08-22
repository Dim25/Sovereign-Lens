import type {
  AssessmentRecord, CalibrationSummary, CaseFixture, CaseMeta, DataSource,
  DisagreementAxis, FactRecord, GraphEdge, GraphNode, IsoDate,
  MethodologyLesson, PredictionRecord, Snapshot, SourceId, SourceRecord, TimelineStop,
} from '../types'
import { canonicalJson, sha256Hex } from '../lib/sha256'

/**
 * Read-time bitemporal projection, ported from `graph_snapshot` in demo.py.
 *
 * Two clocks, not one:
 *   - `recorded_at` — when the system learned it. Rows recorded after `as_of`
 *     are invisible, so the view reproduces what was knowable at the time.
 *   - `valid_from` / `valid_to` — when the statement holds in the world.
 *
 * A fact closed by later evidence is not deleted; it moves to `superseded` and
 * stays inspectable. And because the closure has its own recording time, a
 * snapshot taken before that date still shows the fact as open — the projection
 * does not leak knowledge backwards.
 */

/** The column set demo.py hashes. Kept exact so digests match across languages. */
function digestRow(fact: FactRecord, caseId: string, validTo: IsoDate | null, supersededAt: IsoDate | null) {
  return {
    id: fact.id,
    case_id: caseId,
    subject: fact.subject,
    predicate: fact.predicate,
    object: fact.object,
    status: fact.status,
    valid_from: fact.valid_from,
    valid_to: validTo,
    recorded_at: fact.recorded_at,
    superseded_at: supersededAt,
    source_id: fact.source_id,
  }
}

export function projectFacts(facts: FactRecord[], asOf: IsoDate, caseId: string) {
  const known = facts
    .filter((f) => f.recorded_at <= asOf)
    .sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0))

  // Closure is only visible once it has been recorded.
  const materialised = known.map((f) => {
    const closureKnown = f.superseded_at !== null && (f.superseded_recorded_at ?? f.superseded_at) <= asOf
    return {
      fact: f,
      valid_to: closureKnown ? f.valid_to : null,
      superseded_at: closureKnown ? f.superseded_at : null,
    }
  })

  const exposed = materialised.filter(
    (m) => m.fact.valid_from <= asOf && (m.valid_to === null || asOf < m.valid_to),
  )
  const superseded = materialised.filter((m) => !exposed.includes(m))
  const canonical = [...exposed, ...superseded].map((m) =>
    digestRow(m.fact, caseId, m.valid_to, m.superseded_at),
  )
  const digest = sha256Hex(canonicalJson(canonical)).slice(0, 12)

  const withClosure = (m: (typeof materialised)[number]): FactRecord => ({
    ...m.fact,
    valid_to: m.valid_to,
    superseded_at: m.superseded_at,
  })

  return {
    exposed: exposed.map(withClosure),
    superseded: superseded.map(withClosure),
    digest,
  }
}

function visibleNodes(nodes: GraphNode[], asOf: IsoDate): GraphNode[] {
  return nodes.filter((n) => n.recorded_at <= asOf && n.valid_from <= asOf)
}

function visibleEdges(edges: GraphEdge[], asOf: IsoDate, nodeIds: Set<string>): GraphEdge[] {
  return edges.filter(
    (e) =>
      e.recorded_at <= asOf &&
      e.valid_from <= asOf &&
      (e.valid_to === null || asOf < e.valid_to) &&
      nodeIds.has(e.source_node_id) &&
      nodeIds.has(e.target_node_id),
  )
}

/** The most recent record set at or before `asOf`, by that set's own `as_of`. */
function latestCohort<T extends { as_of: IsoDate }>(rows: T[], asOf: IsoDate): T[] {
  const eligible = rows.filter((r) => r.as_of <= asOf)
  if (eligible.length === 0) return []
  const newest = eligible.reduce((max, r) => (r.as_of > max ? r.as_of : max), eligible[0].as_of)
  return eligible.filter((r) => r.as_of === newest)
}

export function createFixtureSource(fixture: CaseFixture): DataSource {
  const sourceIndex: Record<SourceId, SourceRecord> = Object.fromEntries(
    fixture.sources.map((s) => [s.id, s]),
  )

  const snapshot = (asOf: IsoDate): Snapshot => {
    const { exposed, superseded, digest } = projectFacts(fixture.facts, asOf, fixture.meta.case_id)
    // The digest is computed over id order (demo.py's order). Display order is a
    // separate concern: what changed at this snapshot first, then newest evidence,
    // so the row the presenter is talking about is never below the fold.
    const forDisplay = (rows: typeof exposed) =>
      [...rows].sort((a, b) => {
        const changedA = a.valid_from === asOf || a.superseded_at === asOf ? 0 : 1
        const changedB = b.valid_from === asOf || b.superseded_at === asOf ? 0 : 1
        if (changedA !== changedB) return changedA - changedB
        return a.valid_from < b.valid_from ? 1 : a.valid_from > b.valid_from ? -1 : 0
      })
    const nodes = visibleNodes(fixture.nodes, asOf)
    const nodeIds = new Set(nodes.map((n) => n.id))
    const edges = visibleEdges(fixture.edges, asOf, nodeIds)
    return {
      as_of: asOf,
      digest,
      exposed: forDisplay(exposed),
      superseded: forDisplay(superseded),
      nodes,
      edges,
      changed_fact_ids: [...exposed, ...superseded]
        .filter((f) => f.valid_from === asOf || f.superseded_at === asOf)
        .map((f) => f.id),
      changed_edge_ids: edges.filter((e) => e.valid_from === asOf).map((e) => e.id),
    }
  }

  const methodology = (asOf: IsoDate): MethodologyLesson[] =>
    fixture.methodology_lessons.filter((l) => l.effective_from <= asOf)

  const predictions = (asOf: IsoDate): PredictionRecord[] =>
    fixture.predictions
      .filter((p) => p.registered_at <= asOf)
      .map((p) => {
        const resolved = p.resolved_at !== null && p.resolved_at <= asOf
        return {
          ...p,
          snapshot_hash: p.snapshot_hash || snapshot(p.registered_at).digest,
          status: resolved ? ('resolved' as const) : ('open' as const),
          resolved_at: resolved ? p.resolved_at : null,
          observed_outcome: resolved ? p.observed_outcome : null,
          outcome_value: resolved ? p.outcome_value : null,
          brier: resolved ? p.brier : null,
        }
      })

  return {
    meta: (): CaseMeta => fixture.meta,
    timeline: (): TimelineStop[] => fixture.timeline,
    sources: () => sourceIndex,
    snapshot,
    assessments: (asOf): AssessmentRecord[] => latestCohort(fixture.assessments, asOf),
    disagreements: (asOf): DisagreementAxis[] =>
      // Material divergence is the point of the panel; it leads.
      [...latestCohort(fixture.disagreements, asOf)].sort(
        (a, b) => Number(a.divergence !== 'material') - Number(b.divergence !== 'material'),
      ),
    predictions,
    calibration: (asOf): CalibrationSummary => {
      const rows = predictions(asOf)
      const resolved = rows.filter((p) => p.status === 'resolved' && p.brier !== null)
      const mean =
        resolved.length === 0
          ? null
          : resolved.reduce((sum, p) => sum + (p.brier as number), 0) / resolved.length
      return {
        resolved_count: resolved.length,
        open_count: rows.length - resolved.length,
        mean_brier: mean,
        uninformative_baseline: 0.25,
        note:
          resolved.length === 0
            ? 'No prediction has reached its horizon at this snapshot.'
            : `n = ${resolved.length}. A single resolution is a data point, not a calibration curve.`,
      }
    },
    methodology,
    methodologyVersion: (asOf): string => {
      const applied = methodology(asOf)
      return applied.length === 0 ? 'v1' : applied[applied.length - 1].version_after
    },
  }
}

/**
 * The other end of the seam.
 *
 * When the core grows `python3 demo.py --json` or an HTTP endpoint, point this
 * at it: the payload only has to match `CaseFixture`, and every component keeps
 * working unchanged because they depend on `DataSource`, not on the fixture.
 */
export async function createHttpSource(url: string): Promise<DataSource> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Sovereign Lens: case load failed (${response.status})`)
  return createFixtureSource((await response.json()) as CaseFixture)
}
