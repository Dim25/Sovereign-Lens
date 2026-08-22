/**
 * Types for the Sovereign Lens presentation layer.
 *
 * These mirror the record shapes in `demo.py` (tables `sources`, `facts`,
 * `assessments`, `predictions`, `methodology_lessons`) so that a later
 * `python3 demo.py --json` export or HTTP API can populate the same views
 * without changing any component. Fields the UI adds on top of the SQLite
 * schema — graph geometry, node identity, disagreement axes — are marked.
 */

export type IsoDate = string

export type SourceId = string
export type NodeId = string

/** Who the source speaks for. Drives the provenance labelling in the drawer. */
export type SourcePerspective =
  | 'participant'
  | 'government_participant'
  | 'oversight'
  | 'regulator'
  | 'analytical_overview'

export interface SourceRecord {
  id: SourceId
  title: string
  publisher: string
  url: string
  published_at: IsoDate
  source_type: string
  perspective: SourcePerspective
  language: string
}

export type NodeKind = 'actor' | 'asset'

/** `x`/`y`/`w`/`h` are presentation-only: deterministic layout, no force sim. */
export interface GraphNode {
  id: NodeId
  kind: NodeKind
  name: string
  node_type: string
  country_code: string | null
  valid_from: IsoDate
  recorded_at: IsoDate
  source_ids: SourceId[]
  x: number
  y: number
  w: number
  h: number
}

export interface GraphEdge {
  id: string
  source_node_id: NodeId
  target_node_id: NodeId
  type: string
  status: string
  valid_from: IsoDate
  valid_to: IsoDate | null
  recorded_at: IsoDate
  confidence: number
  source_ids: SourceId[]
  /** Where along the line to sit the label, 0–1. Defaults to the midpoint;
   *  set explicitly only where midpoints collide. Presentation-only. */
  label_t?: number
}

/** One row of `facts` in demo.py, plus a link into the graph. */
export interface FactRecord {
  id: string
  subject: string
  subject_node_id: NodeId
  predicate: string
  object: string
  status: string
  valid_from: IsoDate
  valid_to: IsoDate | null
  recorded_at: IsoDate
  superseded_at: IsoDate | null
  /** When the supersession itself entered the record. Before this date the
   *  projection must not know the fact was ever closed. */
  superseded_recorded_at?: IsoDate | null
  source_id: SourceId
}

export type Perspective = 'capability' | 'dependency' | 'evidence_auditor'

export interface AssessmentRecord {
  id: string
  perspective: Perspective
  as_of: IsoDate
  assessment: string
  confidence: number
  methodology_version: string
  drivers: string[]
  counterarguments: string[]
  missing_evidence: string[]
  source_ids: SourceId[]
}

export interface DisagreementPosition {
  perspective: Perspective
  stance: string
  note: string
}

export interface DisagreementAxis {
  id: string
  as_of: IsoDate
  question: string
  divergence: 'material' | 'aligned'
  positions: DisagreementPosition[]
}

export interface PredictionRecord {
  id: string
  claim: string
  probability: number
  horizon_date: IsoDate
  registered_at: IsoDate
  snapshot_hash: string
  verification_plan: string
  status: 'open' | 'resolved'
  resolved_at: IsoDate | null
  observed_outcome: string | null
  outcome_value: 0 | 1 | null
  brier: number | null
  source_ids: SourceId[]
}

export interface MethodologyLesson {
  id: string
  prediction_id: string
  failure_surface: string
  proposed_change: string
  human_disposition: string
  rationale: string
  version_before: string
  version_after: string
  effective_from: IsoDate
  reviewer: string
}

export interface TimelineStop {
  as_of: IsoDate
  label: string
  note: string
}

export interface CaseMeta {
  case_id: string
  title: string
  question: string
  t0: IsoDate
  t1: IsoDate
  disclosure: string[]
}

/** Result of the read-time bitemporal projection — mirrors `graph_snapshot`. */
export interface Snapshot {
  as_of: IsoDate
  digest: string
  exposed: FactRecord[]
  superseded: FactRecord[]
  nodes: GraphNode[]
  edges: GraphEdge[]
  /** Facts and edges whose `valid_from` equals this `as_of`: the changed state. */
  changed_fact_ids: string[]
  changed_edge_ids: string[]
}

export interface CalibrationSummary {
  resolved_count: number
  open_count: number
  mean_brier: number | null
  uninformative_baseline: number
  note: string
}

export interface CaseFixture {
  meta: CaseMeta
  timeline: TimelineStop[]
  sources: SourceRecord[]
  nodes: GraphNode[]
  edges: GraphEdge[]
  facts: FactRecord[]
  assessments: AssessmentRecord[]
  disagreements: DisagreementAxis[]
  predictions: PredictionRecord[]
  methodology_lessons: MethodologyLesson[]
}

/**
 * The seam. `createFixtureSource` implements it over frozen local JSON today;
 * `createHttpSource` implements it over an exported snapshot or API tomorrow.
 * Components depend on this interface only.
 */
export interface DataSource {
  meta(): CaseMeta
  timeline(): TimelineStop[]
  sources(): Record<SourceId, SourceRecord>
  snapshot(asOf: IsoDate): Snapshot
  assessments(asOf: IsoDate): AssessmentRecord[]
  disagreements(asOf: IsoDate): DisagreementAxis[]
  predictions(asOf: IsoDate): PredictionRecord[]
  calibration(asOf: IsoDate): CalibrationSummary
  methodology(asOf: IsoDate): MethodologyLesson[]
  methodologyVersion(asOf: IsoDate): string
}
