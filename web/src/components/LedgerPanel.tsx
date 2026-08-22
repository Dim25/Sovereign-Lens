import type { PredictionRecord } from '../types'

export function LedgerPanel({
  predictions, onCite,
}: {
  predictions: PredictionRecord[]
  onCite: (claim: string, label: string, sourceIds: string[]) => void
}) {
  return (
    <section className="panel">
      <div className="panel__head">
        <h2 className="panel__title">Prediction ledger</h2>
        <span className="panel__note">append-only · pinned to a snapshot hash</span>
      </div>
      {predictions.length === 0 ? (
        <p className="empty">No falsifiable prediction has been registered at this snapshot.</p>
      ) : (
        <div className="panel__body">
          {predictions.map((p) => (
            <div key={p.id} data-testid="prediction">
              <p className="ledger__claim">{p.claim}</p>
              <div className="kv">
                <div>
                  <div className="kv__k">Probability</div>
                  <div className="kv__v">{Math.round(p.probability * 100)}%</div>
                </div>
                <div>
                  <div className="kv__k">Horizon</div>
                  <div className="kv__v">{p.horizon_date}</div>
                </div>
                <div>
                  <div className="kv__k">Snapshot</div>
                  <div className="kv__v">{p.snapshot_hash}</div>
                </div>
                <div>
                  <div className="kv__k">Status</div>
                  <div className="kv__v">
                    <span className={`status-tag status-tag--${p.status}`}>{p.status}</span>
                  </div>
                </div>
              </div>

              {/* While open, what would settle it. Once resolved, what was observed. */}
              {p.status === 'resolved' ? (
                <div className="outcome" data-testid="resolution">
                  <div className="kv__k">Observed outcome · {p.resolved_at}</div>
                  <div style={{ marginTop: 3 }}>{p.observed_outcome}</div>
                </div>
              ) : (
                <div className="outcome">
                  <div className="kv__k">Verification plan</div>
                  <div style={{ marginTop: 3 }}>{p.verification_plan}</div>
                </div>
              )}

              <button
                className="cite"
                style={{ marginTop: 10 }}
                onClick={() => onCite(p.claim, `Prediction · registered ${p.registered_at}`, p.source_ids)}
              >
                evidence · {p.source_ids.length}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
