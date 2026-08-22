import type { CalibrationSummary } from '../types'

/** Brier is a loss: 0 is perfect, 0.25 is what a 50% guess scores. */
const WORST = 0.5

export function CalibrationPanel({ calibration }: { calibration: CalibrationSummary }) {
  const brier = calibration.mean_brier
  const position = brier === null ? 0 : Math.min(brier / WORST, 1) * 100
  const baseline = (calibration.uninformative_baseline / WORST) * 100

  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Calibration</h2>
        <span className="panel__note">
          {calibration.resolved_count} resolved · {calibration.open_count} open
        </span>
      </div>
      {brier === null ? (
        <p className="empty">{calibration.note}</p>
      ) : (
        <div className="panel__body">
          <div className="brier">
            <div>
              <div className="kv__k">Mean Brier</div>
              <div className="brier__value" data-testid="brier">{brier.toFixed(4)}</div>
            </div>
            <div className="brier__scale">
              <div className="scale">
                <div className="scale__tick" style={{ left: `${baseline}%` }} />
                <div className="scale__mark" style={{ left: `${position}%` }} />
              </div>
              <div className="scale__caption">
                <span>0 · perfect</span>
                <span>0.25 · coin flip</span>
                <span>0.50</span>
              </div>
            </div>
          </div>
          <p className="lesson__rationale" style={{ marginTop: 0 }}>{calibration.note}</p>
        </div>
      )}
    </section>
  )
}
