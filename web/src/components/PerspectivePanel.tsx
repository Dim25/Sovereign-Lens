import type { AssessmentRecord, Perspective } from '../types'

const LABEL: Record<Perspective, string> = {
  capability: 'Capability',
  dependency: 'Dependency',
  evidence_auditor: 'Evidence auditor',
}

const ORDER: Perspective[] = ['capability', 'dependency', 'evidence_auditor']

/** The card is a summary, not the record. It shows the first two items and says
 *  how many it is not showing — a silent truncation would read as completeness. */
const SHOWN = 2

function Items({ label, items }: { label: string; items: string[] }) {
  const hidden = items.length - SHOWN
  return (
    <>
      <div className="perspective__sublabel">{label}</div>
      <ul className="perspective__list">
        {items.slice(0, SHOWN).map((item) => <li key={item}>{item}</li>)}
        {hidden > 0 ? <li className="perspective__more">+{hidden} not shown</li> : null}
      </ul>
    </>
  )
}

export function PerspectivePanel({
  assessments, onCite,
}: {
  assessments: AssessmentRecord[]
  onCite: (claim: string, label: string, sourceIds: string[]) => void
}) {
  const byPerspective = new Map(assessments.map((a) => [a.perspective, a]))
  const version = assessments[0]?.methodology_version

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Three perspectives · one evidence snapshot</h2>
        <span className="panel__note">
          {assessments.length ? `methodology ${version} · deterministic fixture text` : 'not yet assessed'}
        </span>
      </div>
      {assessments.length === 0 ? (
        <p className="empty">No assessment was registered against a snapshot at or before this date.</p>
      ) : (
        <div className="panel__body panel__body--flush">
          <div className="perspectives">
            {ORDER.map((perspective) => {
              const a = byPerspective.get(perspective)
              if (!a) return null
              return (
                <article className="perspective" key={perspective} data-testid={`perspective-${perspective}`}>
                  <div className="perspective__head">
                    <span className="perspective__name">{LABEL[perspective]}</span>
                    <span className="perspective__confidence">{Math.round(a.confidence * 100)}%</span>
                  </div>
                  <p className="perspective__text">{a.assessment}</p>
                  <button
                    className="cite"
                    style={{ alignSelf: 'flex-start' }}
                    onClick={() => onCite(a.assessment, `${LABEL[perspective]} · ${a.as_of}`, a.source_ids)}
                  >
                    evidence · {a.source_ids.length}
                  </button>

                  <Items label="Drivers" items={a.drivers} />
                  <Items label="Counterarguments" items={a.counterarguments} />
                  <Items label="Missing evidence" items={a.missing_evidence} />
                </article>
              )
            })}
          </div>
        </div>
      )}
    </section>
  )
}
