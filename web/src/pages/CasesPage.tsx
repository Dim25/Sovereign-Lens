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
  const open = (slug: string) => navigate(`/cases/${slug}`)
  return (
    <div className="cases-page">
      <ProductNav active="/cases" navigate={navigate} />
      <header className="strategy-atlas">
        <div className="strategy-atlas__title">
          <div className="eyebrow">Strategy map · trajectories, not blocs</div>
          <h1>Sovereignty<br />is being written<span>.</span></h1>
          <p>Three strategies move different Horizon registers. The map shows relationships under observation—not political alignment or territorial influence.</p>
        </div>
        <div className="strategy-map" aria-label="Map of Sovereign Lens case strategies">
          <svg viewBox="0 0 1000 470" role="img" aria-labelledby="strategy-map-title strategy-map-desc">
            <title id="strategy-map-title">Sovereign strategy trajectories</title>
            <desc id="strategy-map-desc">Routes connect the United States and UAE, China and Fiji, and African Union and policy institutions in East Africa.</desc>
            <defs>
              <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth=".45" opacity=".16" /></pattern>
              <marker id="map-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,1 L7,4 L0,7" fill="none" stroke="currentColor" /></marker>
            </defs>
            <rect width="1000" height="470" className="strategy-map__grid" fill="url(#map-grid)" />
            <g className="strategy-map__land">
              <path d="M74 103 L120 65 196 57 250 81 286 124 267 166 221 180 196 225 150 209 127 171 87 155Z" />
              <path d="M210 244 L254 264 275 321 252 395 219 425 202 367 180 310Z" />
              <path d="M438 105 L472 73 544 77 582 100 632 82 713 92 786 120 832 159 809 193 753 196 716 229 654 209 617 237 570 220 532 183 483 174 454 142Z" />
              <path d="M498 228 L557 224 603 261 594 326 555 397 515 363 489 292Z" />
              <path d="M817 319 L858 296 912 315 927 355 899 387 842 379 810 348Z" />
              <path d="M379 86 L403 69 422 83 412 111 387 111Z" />
            </g>
            <g className="strategy-map__route strategy-map__route--compute" role="button" tabIndex={0} aria-label="Open UAE–US conditional compute strategy" onClick={() => open('uae-us-ai-infrastructure')} onKeyDown={(event) => event.key === 'Enter' && open('uae-us-ai-infrastructure')}>
              <path d="M218 158 Q414 56 626 229" markerEnd="url(#map-arrow)" />
              <circle cx="218" cy="158" r="6" /><circle cx="626" cy="229" r="7" />
              <text x="366" y="91">01 · CONDITIONAL COMPUTE ACCESS</text>
            </g>
            <g className="strategy-map__route strategy-map__route--formation" role="button" tabIndex={0} aria-label="Open China–Fiji capability formation strategy" onClick={() => open('china-fiji-capability')} onKeyDown={(event) => event.key === 'Enter' && open('china-fiji-capability')}>
              <path d="M737 167 Q855 186 905 321" markerEnd="url(#map-arrow)" />
              <circle cx="737" cy="167" r="6" /><circle cx="905" cy="321" r="7" />
              <text x="782" y="204">02 · CAPABILITY FORMATION</text>
            </g>
            <g className="strategy-map__route strategy-map__route--evaluation" role="button" tabIndex={0} aria-label="Open African evaluation sovereignty strategy" onClick={() => open('africa-ai-governance-capacity')} onKeyDown={(event) => event.key === 'Enter' && open('africa-ai-governance-capacity')}>
              <path d="M556 275 Q596 291 570 329" markerEnd="url(#map-arrow)" />
              <circle cx="556" cy="275" r="6" /><circle cx="570" cy="329" r="7" />
              <text x="608" y="288">03 · EVALUATION SOVEREIGNTY</text>
            </g>
            <g className="strategy-map__labels">
              <text x="194" y="181">US</text><text x="635" y="246">UAE</text><text x="710" y="151">CHINA</text><text x="911" y="341">FIJI</text><text x="501" y="270">ADDIS</text><text x="577" y="347">NAIROBI</text>
            </g>
          </svg>
          <div className="strategy-map__note">Map position is context. The analytical object is the evolving relationship.</div>
        </div>
        <div className="strategy-ledger">
          {[
            { slug: 'uae-us-ai-infrastructure', id: '01', title: 'Conditional compute access', delta: 'Capacity ↑ · external permission persists', registers: 'CAPACITY · PERMISSIONS' },
            { slug: 'china-fiji-capability', id: '02', title: 'Capability formation', delta: 'Infrastructure + talent · retention unknown', registers: 'CAPACITY · TALENT · PRIORS' },
            { slug: 'africa-ai-governance-capacity', id: '03', title: 'Evaluation sovereignty', delta: 'Local institution ↑ · uptake unverified', registers: 'INSTITUTIONS · EVALUATION' },
          ].map((strategy) => (
            <button key={strategy.slug} onClick={() => open(strategy.slug)}>
              <span>{strategy.id}</span><div><small>{strategy.registers}</small><strong>{strategy.title}</strong><p>{strategy.delta}</p></div><b>↗</b>
            </button>
          ))}
        </div>
      </header>
      <div className="cases-intro"><span>Case records</span><p>The same evidence is read through capability, dependency and evidence-auditor perspectives. Disagreement is preserved; later outcomes return to the ledger.</p></div>
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
