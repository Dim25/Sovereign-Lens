import type { FactRecord, Snapshot } from '../types'

interface Props {
  snapshot: Snapshot
  onCite: (fact: FactRecord) => void
}

export function FactsPanel({ snapshot, onCite }: Props) {
  const changed = new Set(snapshot.changed_fact_ids)

  // Current and superseded are separate projections, but they read as one ledger:
  // the fact that closed belongs directly under the fact that replaced it, not in
  // a block further down where the presenter has to scroll to reach it.
  const rows = [
    ...snapshot.exposed.map((fact) => ({ fact, superseded: false })),
    ...snapshot.superseded.map((fact) => ({ fact, superseded: true })),
  ].sort((a, b) => {
    const rank = (r: { fact: FactRecord }) => (changed.has(r.fact.id) ? 0 : 1)
    if (rank(a) !== rank(b)) return rank(a) - rank(b)
    return a.fact.valid_from < b.fact.valid_from ? 1 : a.fact.valid_from > b.fact.valid_from ? -1 : 0
  })

  const row = (fact: FactRecord, superseded: boolean) => {
    const isChanged = changed.has(fact.id)
    const state = superseded ? 'Superseded' : 'Current'
    return (
      <tr key={fact.id} data-testid={`fact-${fact.id}`} className={superseded ? 'row--superseded' : undefined}>
        <td
          className={[
            'facts__state',
            superseded ? 'facts__state--superseded' : '',
            isChanged ? 'facts__state--changed' : '',
          ].filter(Boolean).join(' ')}
        >
          {state}
          {isChanged ? ' ▲' : ''}
        </td>
        <td className="facts__subject">{fact.subject}</td>
        <td className="facts__object">
          {fact.object}
          <div className="panel__note" style={{ marginTop: 3 }}>
            {fact.predicate} · {fact.status}
          </div>
        </td>
        <td className="facts__dates">
          valid {fact.valid_from} → {fact.valid_to ?? 'open'}
          <br />
          recorded {fact.recorded_at}
        </td>
        <td className="facts__cite">
          <button className="cite" onClick={() => onCite(fact)}>
            evidence
          </button>
        </td>
      </tr>
    )
  }

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Facts at as_of</h2>
        <span className="panel__note">
          {snapshot.exposed.length} current · {snapshot.superseded.length} superseded · nothing deleted
        </span>
      </div>
      <div className="panel__body panel__body--flush">
        <table className="facts">
          <thead>
            <tr>
              <th>State</th>
              <th>Subject</th>
              <th>Statement</th>
              <th>Validity</th>
              <th style={{ textAlign: 'right' }}>Source</th>
            </tr>
          </thead>
          <tbody>{rows.map((r) => row(r.fact, r.superseded))}</tbody>
        </table>
      </div>
    </section>
  )
}
