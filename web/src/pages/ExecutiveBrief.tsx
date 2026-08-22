import { useState } from 'react'
import { ProductNav } from '../components/ProductNav'
import { GraphPanel } from '../components/GraphPanel'
import { EvidenceDrawer, type EvidenceSelection } from '../components/EvidenceDrawer'
import { useCase } from '../state/useCase'
import type { DataSource } from '../types'

export function ExecutiveBrief({ source, navigate }: { source: DataSource; navigate: (path: string) => void }) {
  const view = useCase(source, source.meta().t1)
  const [evidence, setEvidence] = useState<EvidenceSelection | null>(null)
  const material = view.disagreements.filter((axis) => axis.divergence === 'material')
  const prediction = view.predictions[0]

  return (
    <div className="executive-page">
      <ProductNav active="/brief" navigate={navigate} />
      <header className="executive-head">
        <div><div className="eyebrow">Executive situation brief</div><h1>AI power shifts</h1></div>
        <div className="executive-head__meta"><span>As of</span><strong>{view.asOf}</strong><span>Method</span><strong>{view.methodologyVersion}</strong></div>
      </header>
      <div className="executive-kpis">
        <div><strong>01</strong><span>material change</span></div>
        <div><strong>{material.length.toString().padStart(2, '0')}</strong><span>material disagreement</span></div>
        <div><strong>{view.calibration.resolved_count.toString().padStart(2, '0')}</strong><span>resolved prediction</span></div>
        <div><strong>01</strong><span>verification gap</span></div>
      </div>
      <main className="executive-grid">
        <section className="executive-graph">
          <div className="executive-section-head"><span>Power & dependency graph</span><span>{view.snapshot.nodes.length} actors/assets</span></div>
          <GraphPanel snapshot={view.snapshot} onSelectNode={(node) => setEvidence({ claim: node.name, label: node.node_type, sourceIds: node.source_ids })} />
        </section>
        <section className="material-change">
          <div className="executive-section-head"><span>Latest material change</span><span>UAE · compute</span></div>
          <h2>Local capability <em>↑</em><br />External leverage <em>→</em></h2>
          <p>Reported operating capacity exceeds the registered milestone. Export authorization, accelerator supply, and cloud operation remain externally conditioned.</p>
          <div className="confidence-line"><span>Assessment confidence</span><strong>Moderate</strong></div>
          <button className="text-link" onClick={() => navigate('/cases/uae-us-ai-infrastructure')}>Open full analytical record →</button>
        </section>
        <section className="delta-profile">
          <div className="executive-section-head"><span>Sovereignty deltas</span><span>direction, not score</span></div>
          {[
            ['Compute access', '↑', 'positive'], ['Local operation', '↔', 'neutral'],
            ['Vendor optionality', '↓', 'negative'], ['Evaluation confidence', '?', 'unknown'],
          ].map(([label, delta, tone]) => <div className={`delta-row delta-row--${tone}`} key={label}><span>{label}</span><strong>{delta}</strong></div>)}
        </section>
        <section className="watch-next">
          <div className="executive-section-head"><span>Watch next</span><span>evidence that changes the view</span></div>
          <ol>
            <li><span>01</span>Independent confirmation of operating capacity</li>
            <li><span>02</span>Continuity and revocability of export authorization</li>
            <li><span>03</span>Local hosting, termination, and migration rights</li>
          </ol>
        </section>
        <section className="executive-range">
          <div className="executive-section-head"><span>Perspective range</span><span>preserved, not averaged</span></div>
          <div className="range-items">
            {view.assessments.map((a) => <div key={a.id}><span>{a.perspective.replace('_', ' ')}</span><strong>{Math.round(a.confidence * 100)}</strong></div>)}
          </div>
          <p>{material[0]?.question ?? 'No material disagreement at this snapshot.'}</p>
        </section>
        <section className="executive-ledger">
          <div className="executive-section-head"><span>Long-horizon commitment</span><span>{prediction?.status}</span></div>
          <strong>{prediction?.probability ? `${Math.round(prediction.probability * 100)}%` : '—'}</strong>
          <p>{prediction?.observed_outcome ?? prediction?.claim}</p>
          <span className="brier-mini">Brier {prediction?.brier?.toFixed(4) ?? 'pending'}</span>
        </section>
      </main>
      {evidence ? <EvidenceDrawer selection={evidence} sources={view.sources} facts={[...view.snapshot.exposed, ...view.snapshot.superseded]} onClose={() => setEvidence(null)} /> : null}
    </div>
  )
}
