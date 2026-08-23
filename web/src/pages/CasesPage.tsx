import { ProductNav } from '../components/ProductNav'
import type { DataSource } from '../types'

const CASE_COPY: Record<string, { register: string; summary: string; geography: string }> = {
  'uae-us-ai-infrastructure': {
    register: 'Capacity · permissions · dependency',
    geography: 'UAE ↔ United States',
    summary: 'Compute capacity rises while chips, cloud operation and authorization remain externally conditioned.',
  },
  'china-fiji-capability': {
    register: 'Capacity · talent · priors',
    geography: 'China ↔ Fiji',
    summary: 'Infrastructure, training and institutional exchange expand—but durable local operation and exit rights remain unverified.',
  },
  'africa-ai-governance-capacity': {
    register: 'Institutions · evaluation · funding',
    geography: 'Pan-African institutions',
    summary: 'A continental strategy and a local policy network may turn external support into African-governed evaluation capacity.',
  },
}

export function CasesPage({ sources, navigate }: { sources: Record<string, DataSource>; navigate: (path: string) => void }) {
  return (
    <div className="cases-page">
      <ProductNav active="/cases" navigate={navigate} />
      <header className="cases-head">
        <div className="eyebrow">Live trajectory observatory · evidence before alignment</div>
        <h1>Who is programming<br />sovereign horizons?</h1>
        <p>Three bounded cases. The same evidence is read through capability, dependency and evidence-auditor perspectives. Disagreement is preserved; later outcomes return to the ledger.</p>
      </header>
      <main className="case-cards">
        {Object.entries(sources).map(([slug, source], index) => {
          const meta = source.meta()
          const copy = CASE_COPY[slug]
          return (
            <button className="case-card" key={slug} onClick={() => navigate(`/cases/${slug}`)}>
              <div className="case-card__top"><span>0{index + 1}</span><span>{copy?.geography}</span></div>
              <div className="case-card__register">{copy?.register}</div>
              <h2>{meta.title}</h2>
              <p>{copy?.summary}</p>
              <div className="case-card__question">{meta.question}</div>
              <div className="case-card__foot"><span>{meta.t0} → {meta.t1}</span><strong>Open dossier →</strong></div>
            </button>
          )
        })}
      </main>
      <footer className="cases-principle">Sovereign Lens does not label an initiative “pro-US,” “pro-China,” or “pro-Africa.” It records what changed, who can revise it, and which interpretation survives reality.</footer>
    </div>
  )
}
