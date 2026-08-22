import { describe, expect, it } from 'vitest'
import { createFixtureSource, projectFacts } from '../data/adapter'
import fixtureJson from '../data/uae-us-ai-infrastructure.fixture.json'
import type { CaseFixture, FactRecord } from '../types'

const fixture = fixtureJson as unknown as CaseFixture
const source = createFixtureSource(fixture)
const T0 = '2025-05-28'
const T1 = '2026-07-01'

/** The exact two rows demo.py writes, so the digest can be compared across languages. */
const PY_PLANNED: FactRecord = {
  id: 'campus_capacity_planned',
  subject: 'UAE-US AI Campus',
  subject_node_id: 'asset_campus',
  predicate: 'capacity',
  object: '200 MW planned in 2026 within a proposed 5 GW campus',
  status: 'announced',
  valid_from: T0,
  valid_to: T1,
  recorded_at: T0,
  superseded_at: T1,
  superseded_recorded_at: T1,
  source_id: 'uae_acceleration_2025',
}

const PY_OPERATIONAL: FactRecord = {
  id: 'campus_capacity_reported_operational',
  subject: 'UAE-US AI Campus',
  subject_node_id: 'asset_campus',
  predicate: 'capacity',
  object: '500 MW reported online in 2026',
  status: 'reported_operational',
  valid_from: T1,
  valid_to: null,
  recorded_at: T1,
  superseded_at: null,
  source_id: 'uae_progress_2026',
}

describe('snapshot digest conformance with demo.py', () => {
  const rows = [PY_PLANNED, PY_OPERATIONAL]

  it('reproduces the T0 digest printed by demo.py', () => {
    expect(projectFacts(rows, T0, 'uae_us_ai_infrastructure').digest).toBe('c7871e3381f8')
  })

  it('reproduces the T1 digest printed by demo.py', () => {
    expect(projectFacts(rows, T1, 'uae_us_ai_infrastructure').digest).toBe('e4ea995af4cf')
  })
})

describe('bitemporal projection', () => {
  it('exposes the planned capacity at T0 and supersedes it at T1', () => {
    const before = source.snapshot(T0)
    expect(before.exposed.map((f) => f.id)).toContain('campus_capacity_planned')
    expect(before.superseded).toHaveLength(0)

    const after = source.snapshot(T1)
    expect(after.exposed.map((f) => f.id)).toContain('campus_capacity_reported_operational')
    expect(after.superseded.map((f) => f.id)).toEqual(['campus_capacity_planned'])
  })

  it('does not leak the supersession backwards in time', () => {
    // The closure was recorded at T1; a T0 snapshot must still show the fact open.
    const planned = source.snapshot(T0).exposed.find((f) => f.id === 'campus_capacity_planned')
    expect(planned?.valid_to).toBeNull()
    expect(planned?.superseded_at).toBeNull()
  })

  it('hides facts recorded after as_of even when they were valid earlier', () => {
    // The congressional letter is dated 2024-07-10 but entered the record 2025-06-11.
    const ids = (asOf: string) => source.snapshot(asOf).exposed.map((f) => f.id)
    expect(ids('2024-09-23')).not.toContain('oversight_technology_transfer')
    expect(ids(T1)).toContain('oversight_technology_transfer')
  })

  it('grows the graph as relationships are recorded', () => {
    expect(source.snapshot('2024-09-23').nodes.length).toBeLessThan(source.snapshot(T1).nodes.length)
    expect(source.snapshot(T1).edges.map((e) => e.id)).toContain('edge_commerce_authorizes_chips')
  })

  it('flags state that changed at this snapshot', () => {
    expect(source.snapshot(T1).changed_fact_ids).toEqual(
      expect.arrayContaining(['campus_capacity_planned', 'campus_capacity_reported_operational']),
    )
  })

  it('produces a different digest for a different as_of', () => {
    expect(source.snapshot(T0).digest).not.toBe(source.snapshot(T1).digest)
  })
})

describe('ledger, calibration and methodology', () => {
  it('holds the prediction open before its resolution date', () => {
    const [prediction] = source.predictions(T0)
    expect(prediction.status).toBe('open')
    expect(prediction.brier).toBeNull()
    expect(prediction.snapshot_hash).toBe(source.snapshot(T0).digest)
  })

  it('resolves and scores the prediction at T1', () => {
    const [prediction] = source.predictions(T1)
    expect(prediction.status).toBe('resolved')
    expect(prediction.brier).toBeCloseTo(0.1225, 6)
    expect(source.calibration(T1).mean_brier).toBeCloseTo(0.1225, 6)
  })

  it('reports no calibration before any horizon is reached', () => {
    expect(source.calibration(T0).mean_brier).toBeNull()
    expect(source.calibration(T0).resolved_count).toBe(0)
  })

  it('moves the governing methodology version only once a lesson is accepted', () => {
    expect(source.methodologyVersion(T0)).toBe('v1')
    expect(source.methodology(T0)).toHaveLength(0)
    expect(source.methodologyVersion(T1)).toBe('v2')
    expect(source.methodology(T1)[0].human_disposition).toBe('accepted')
  })
})

describe('perspectives and disagreement', () => {
  it('serves the assessment cohort registered at or before as_of', () => {
    expect(source.assessments('2024-09-23')).toHaveLength(0)
    expect(source.assessments(T0).map((a) => a.methodology_version)).toEqual(['v1', 'v1', 'v1'])
    expect(source.assessments(T1).map((a) => a.methodology_version)).toEqual(['v2', 'v2', 'v2'])
  })

  it('keeps a material divergence at each assessed snapshot', () => {
    for (const asOf of [T0, T1]) {
      expect(source.disagreements(asOf).some((a) => a.divergence === 'material')).toBe(true)
    }
  })

  it('gives every assessment at least one source', () => {
    for (const a of [...source.assessments(T0), ...source.assessments(T1)]) {
      expect(a.source_ids.length).toBeGreaterThan(0)
    }
  })
})

describe('provenance', () => {
  it('resolves every fact, node, edge and assessment reference to a source record', () => {
    const known = source.sources()
    const referenced = [
      ...fixture.facts.map((f) => f.source_id),
      ...fixture.nodes.flatMap((n) => n.source_ids),
      ...fixture.edges.flatMap((e) => e.source_ids),
      ...fixture.assessments.flatMap((a) => a.source_ids),
      ...fixture.predictions.flatMap((p) => p.source_ids),
    ]
    for (const id of referenced) expect(known[id], `unresolved source ${id}`).toBeTruthy()
  })
})
