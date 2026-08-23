import { useEffect, useMemo, useState } from 'react'
import type { DataSource } from '../types'
import './machine.css'

/**
 * /v2 — the machine, stated literally.
 *
 * The root page leads with the thesis: what a Horizon is, why capital and
 * infrastructure are writes, why plural models produce parallax. That is the
 * argument, and it is the right argument — but it is six concepts deep before
 * anything observable happens, which is too far for a reader deciding in
 * twenty seconds whether this is worth their attention.
 *
 * This page inverts the order. It runs the loop first, in about twenty
 * seconds, with every number read from the same projected case the dossier
 * uses — nothing here is written by hand for the demo. The philosophy is still
 * one click away, and reads better once the machine has been seen working.
 *
 * A belief is registered. Time passes. Reality answers. The belief is scored.
 * The next run inherits the lesson.
 */

interface Step {
  key: string
  verb: string
  detail: string
  value: string
  ms: number
}

export function MachinePage({ source, navigate }: { source: DataSource; navigate: (p: string) => void }) {
  const meta = useMemo(() => source.meta(), [source])

  const steps = useMemo<Step[]>(() => {
    const t0 = source.snapshot(meta.t0)
    const t1 = source.snapshot(meta.t1)
    const assessed = source.assessments(meta.t0)
    const axes = source.disagreements(meta.t0)
    const material = axes.filter((a) => a.divergence === 'material').length
    const registered = source.predictions(meta.t0)[0]
    const resolved = source.predictions(meta.t1).find((p) => p.status === 'resolved')
    const lesson = source.methodology(meta.t1)[0]
    const months = Math.round(
      (Date.parse(meta.t1) - Date.parse(meta.t0)) / (1000 * 60 * 60 * 24 * 30.44),
    )
    const pct = (n: number) => `${Math.round(n * 100)}%`

    return [
      {
        key: 'snapshot',
        verb: 'Evidence state saved',
        detail: `${t0.exposed.length} facts current at ${meta.t0}, pinned to a content hash`,
        value: t0.digest,
        ms: 2600,
      },
      {
        key: 'assess',
        verb: 'Three models assess the same snapshot',
        detail: assessed.map((a) => `${a.perspective} ${pct(a.confidence)}`).join('  ·  '),
        value: `${material} material disagreement preserved, not averaged`,
        ms: 3000,
      },
      {
        key: 'commit',
        verb: 'Prediction registered',
        detail: registered ? registered.claim : 'no prediction at t0',
        value: registered
          ? `p = ${pct(registered.probability)}   horizon ${registered.horizon_date}`
          : '—',
        ms: 3200,
      },
      {
        key: 'time',
        verb: `${months} months pass`,
        detail: `The clock advances to ${meta.t1}. Nothing is edited in place.`,
        value: `as_of ${meta.t0}  →  ${meta.t1}`,
        ms: 3000,
      },
      {
        key: 'supersede',
        verb: 'Reality answers',
        detail: `${t1.superseded.length} fact(s) superseded, ${t1.exposed.length} current. The overtaken record is kept and marked.`,
        value: `digest ${t0.digest}  →  ${t1.digest}`,
        ms: 3000,
      },
      {
        key: 'score',
        verb: 'Prediction scored',
        detail: resolved?.observed_outcome ?? 'unresolved at this snapshot',
        value: resolved ? `Brier ${resolved.brier?.toFixed(4)}   outcome ${resolved.outcome_value}` : '—',
        ms: 3200,
      },
      {
        key: 'govern',
        verb: 'The next run inherits the lesson',
        detail: lesson ? lesson.proposed_change : 'no lesson proposed',
        value: lesson
          ? `methodology v1 → v2   ·   human disposition: ${lesson.human_disposition}`
          : '—',
        ms: 3400,
      },
    ]
  }, [source, meta])

  const total = steps.reduce((s, x) => s + x.ms, 0)
  const [active, setActive] = useState(0)
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (done) return
    if (active >= steps.length) { setDone(true); return }
    const t = window.setTimeout(() => setActive((i) => i + 1), steps[active].ms)
    return () => window.clearTimeout(t)
  }, [active, done, steps])

  const replay = () => { setDone(false); setActive(0) }

  return (
    <main className="machine" aria-label="Sovereign Lens — the loop, running">
      <header className="machine__head">
        <button className="machine__brand" onClick={() => navigate('/')}>Sovereign Lens</button>
        <span className="machine__runtime">{(total / 1000).toFixed(0)}-second loop · live data</span>
      </header>

      <section className="machine__lede">
        <h1>An agent should remember what it predicted.</h1>
        <p>
          Sovereign Lens versions model judgments, revisits them when reality changes, and measures
          which interpretations held up.
        </p>
        <p className="machine__chain">
          same evidence <i>→</i> three perspectives <i>→</i> dated prediction <i>→</i>{' '}
          thirteen months later <i>→</i> scored outcome
        </p>
      </section>

      <ol className="machine__steps">
        {steps.map((step, i) => {
          const state = i < active ? 'done' : i === active ? 'live' : 'queued'
          return (
            <li key={step.key} className={`step step--${state}`}>
              <span className="step__n">{String(i + 1).padStart(2, '0')}</span>
              <div className="step__body">
                <b className="step__verb">{step.verb}</b>
                <span className="step__detail">{step.detail}</span>
                <span className="step__value">{step.value}</span>
              </div>
              <span className="step__mark" aria-hidden="true">
                {state === 'done' ? '✓' : state === 'live' ? '▸' : ''}
              </span>
              {state === 'live' && !done
                ? <i className="step__fill" style={{ animationDuration: `${step.ms}ms` }} />
                : null}
            </li>
          )
        })}
      </ol>

      <footer className="machine__foot">
        <div className="machine__status" role="status">
          {done
            ? 'Loop complete. The judgment is on the record, scored, and the method that produced it has changed.'
            : `Running · step ${Math.min(active + 1, steps.length)} of ${steps.length}`}
        </div>
        <div className="machine__actions">
          <button className="machine__btn" onClick={replay}>Replay</button>
          <button className="machine__btn" onClick={() => navigate(`/cases/${meta.case_id.replaceAll('_', '-')}`)}>
            Open the real dossier →
          </button>
          <button className="machine__btn machine__btn--quiet" onClick={() => navigate('/')}>
            Why it matters
          </button>
        </div>
        <p className="machine__honest">
          Every value above is projected from the committed case record, not written for this page.
          Perspective text in this case is a deterministic fixture; the attributed multi-provider
          panel lives in the dossier.
        </p>
      </footer>
    </main>
  )
}
