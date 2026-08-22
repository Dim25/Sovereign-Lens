import type { FactRecord, SourceId, SourceRecord } from '../types'

export interface EvidenceSelection {
  claim: string
  label: string
  sourceIds: SourceId[]
}

const PERSPECTIVE_LABEL: Record<string, string> = {
  participant: 'Participant',
  government_participant: 'Participant government',
  oversight: 'Oversight',
  regulator: 'Regulator',
  analytical_overview: 'Analytical overview',
}

/**
 * Every visible claim ends here. The drawer names not just the document but
 * whose account it is — a participant government reporting its own campus is
 * different evidence from a regulator reporting an authorisation, and the
 * evidence auditor's dissent only makes sense if that distinction is on screen.
 */
export function EvidenceDrawer({
  selection, sources, facts, onClose,
}: {
  selection: EvidenceSelection
  sources: Record<SourceId, SourceRecord>
  /** Every fact visible at the current as_of, current or superseded. */
  facts: FactRecord[]
  onClose: () => void
}) {
  const records = selection.sourceIds.map((id) => sources[id]).filter(Boolean)
  const selected = new Set(selection.sourceIds)

  // How much of the current picture rests on these documents. A source carrying
  // several claims is a concentration worth seeing before trusting any one of them.
  const alsoResting = facts.filter(
    (fact) => selected.has(fact.source_id) && !selection.claim.includes(fact.object),
  )

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <aside className="drawer" role="dialog" aria-label="Evidence" data-testid="evidence-drawer">
        <div className="drawer__head">
          <h2 className="panel__title">Evidence</h2>
          <button className="drawer__close" onClick={onClose}>close</button>
        </div>
        <div className="drawer__body">
          <p className="drawer__claim">{selection.claim}</p>
          <p className="drawer__claim-meta">{selection.label} · {records.length} source{records.length === 1 ? '' : 's'}</p>

          {records.map((source) => (
            <article className="source" key={source.id}>
              <span className="source__perspective">
                {PERSPECTIVE_LABEL[source.perspective] ?? source.perspective}
              </span>
              <div className="source__title">{source.title}</div>
              <div className="source__publisher">{source.publisher}</div>
              <div className="source__row">
                <span>{source.published_at}</span>
                <span>{source.source_type.replace(/_/g, ' ')}</span>
                <span>{source.language}</span>
              </div>
              <a className="source__url" href={source.url} target="_blank" rel="noreferrer">
                {source.url}
              </a>
            </article>
          ))}

          {records.length === 0 ? (
            <p className="empty" style={{ padding: 0 }}>
              This claim carries no source reference — it should not be displayed as evidence-backed.
            </p>
          ) : null}

          {alsoResting.length > 0 ? (
            <div className="drawer__also">
              <div className="kv__k">
                Also resting on {records.length === 1 ? 'this source' : 'these sources'}
              </div>
              <ul className="perspective__list" style={{ marginTop: 6 }}>
                {alsoResting.map((fact) => (
                  <li key={fact.id}>
                    {fact.subject} — {fact.object}
                    {fact.superseded_at ? ' (superseded)' : ''}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="drawer__also">
            <p className="lesson__rationale" style={{ marginTop: 0 }}>
              Source records are discovery-level provenance: publisher, date, type and the account
              they speak for. Content hashes and archived copies are specified in the README but are
              not yet implemented.
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
