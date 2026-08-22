import type { DisagreementAxis, Perspective } from '../types'

const SHORT: Record<Perspective, string> = {
  capability: 'Capability',
  dependency: 'Dependency',
  evidence_auditor: 'Auditor',
}

export function DisagreementPanel({ axes }: { axes: DisagreementAxis[] }) {
  const material = axes.filter((a) => a.divergence === 'material').length

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Disagreement</h2>
        <span className="panel__note">
          {axes.length === 0
            ? 'no axes at this snapshot'
            : `${material} material · ${axes.length - material} aligned · preserved, not averaged`}
        </span>
      </div>
      {axes.length === 0 ? (
        <p className="empty">Perspectives have not yet been run against a snapshot at this date.</p>
      ) : (
        <div className="panel__body panel__body--flush">
          {axes.map((axis) => (
            <div
              key={axis.id}
              className={`axis axis--${axis.divergence}`}
              data-testid={`axis-${axis.divergence}`}
            >
              <div className="axis__head">
                <span className="axis__question">{axis.question}</span>
                <span className="axis__flag">{axis.divergence}</span>
              </div>
              <div className="axis__positions">
                {axis.positions.map((p) => (
                  <div className="position" key={p.perspective}>
                    <span className="position__who">{SHORT[p.perspective]}</span>
                    <span className="position__stance">{p.stance}</span>
                    <span className="position__note">{p.note}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
