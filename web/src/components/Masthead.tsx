import type { CaseMeta, Snapshot } from '../types'

export function Masthead({
  meta, snapshot, methodologyVersion,
}: { meta: CaseMeta; snapshot: Snapshot; methodologyVersion: string }) {
  return (
    <header className="masthead">
      <div>
        <div className="masthead__mark">Sovereign Lens</div>
        <div className="masthead__case">case · {meta.case_id}</div>
      </div>
      <div className="masthead__question">{meta.question}</div>
      <div className="masthead__meta">
        <div>
          <span className="stamp__label">as_of</span>
          <span className="stamp__value stamp__value--accent" data-testid="as-of">{snapshot.as_of}</span>
        </div>
        <div>
          <span className="stamp__label">snapshot</span>
          <span className="stamp__value" data-testid="digest">{snapshot.digest}</span>
        </div>
        <div>
          <span className="stamp__label">methodology</span>
          <span className="stamp__value" data-testid="methodology-version">{methodologyVersion}</span>
        </div>
      </div>
    </header>
  )
}
