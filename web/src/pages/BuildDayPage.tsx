import { ProductNav } from '../components/ProductNav'

const stages = [
  ['01', 'Concept + specification', 'Human direction · Codex · Claude', 'Defined Programmable Horizons, the eight registers, evidence boundaries, schemas, cases, and the three-minute narrative.'],
  ['02', 'Evidence + temporal core', 'Python · JSON Schema · SQLite · NetworkX', 'Built source manifests, typed graph records, bitemporal as-of projection, supersession, prediction ledger, and calibration.'],
  ['03', 'Model parallax', 'Codex · Qwen 3.8 Max · GLM 5.2 · DeepSeek V4 Pro · Claude Fable 5', 'Held evidence and prompt constant, preserved disagreement, and stored provider, model, region, time, assumptions, missing evidence, and falsifiers.'],
  ['04', 'Long-horizon adapters', 'Temporal · Stash · Coframe', 'Specified durable reassessment, shared research memory with evidence boundaries, and adaptive explanations whose facts remain locked.'],
  ['05', 'Product instrument', 'React · TypeScript · Vite · SVG', 'Built the executive brief, temporal dossier, strategy atlas, evidence drawer, model comparison, and programmable Horizon Studio.'],
  ['06', 'Visual narrative', 'Alibaba Model Studio · HappyHorse · FFmpeg', 'Generated the executive film and assembled a concise story about data centres, learning culture, capacity, and the writable future.'],
  ['07', 'Verification', 'Vitest · Testing Library · Playwright', 'Tested projection, digests, provenance, routes, mobile layout, direct brief diagrams, and production rendering.'],
  ['08', 'Open deployment', 'GitHub · Apache 2.0 · Cloudflare Workers', 'Published source, methodology, development memos, static assets, and the live sovereignlens.ai demo.'],
]

const modules = ['Evidence ledger', 'Temporal graph', 'Strategy atlas', 'Model parallax', 'Prediction ledger', 'Horizon Studio', 'Provenance drawer', 'Executive brief']

export function BuildDayPage({ navigate }: { navigate: (path: string) => void }) {
  return <div className="build-day">
    <ProductNav active="/build" navigate={navigate} />
    <header className="build-day__hero">
      <div className="eyebrow">Long Horizon Agents Build Day · AGI House · August 22, 2026</div>
      <h1>One day.<br />One observable Horizon<span>.</span></h1>
      <div><strong>Software baseline at arrival</strong><p>No working application. The concept and specification existed; every executable prototype module and public demo surface listed here was built and integrated on location today.</p></div>
    </header>
    <main className="build-day__main">
      <section className="build-day__film">
        <div className="section-index">00 · Feature overview · 25 seconds</div>
        <video controls playsInline preload="metadata" poster="/media/sovereign-lens-feature-overview-poster.jpg" aria-label="Sovereign Lens feature and toolchain overview">
          <source src="/media/sovereign-lens-feature-overview-25s.mp4" type="video/mp4" />
        </video>
        <p>HappyHorse-generated cinematic and interface-motion shots, assembled with FFmpeg. Strategy Atlas → temporal dossier → five-model parallax → eight shipped modules.</p>
      </section>
      <section className="build-day__modules"><div className="section-index">00 · Core modules shipped</div><div>{modules.map((module) => <span key={module}>{module}</span>)}</div></section>
      <section className="build-day__timeline">
        <div className="section-index">01 · Toolchain in build order</div>
        {stages.map(([index, title, tools, text]) => <article key={index}><b>{index}</b><div><span>{title}</span><h2>{tools}</h2></div><p>{text}</p></article>)}
      </section>
      <section className="build-day__video">
        <div className="section-index">03 · Film narrative map</div>
        <div><strong>00–05</strong><p>An empty ledger becomes a live evidence graph.</p></div><i>→</i>
        <div><strong>05–12</strong><p>Capital, talent, compute, standards, and institutions write to a state's Horizon.</p></div><i>→</i>
        <div><strong>12–20</strong><p>Qwen, GLM, DeepSeek, and Codex read the same write differently.</p></div><i>→</i>
        <div><strong>20–27</strong><p>Later evidence resolves a prediction; the method learns.</p></div><i>→</i>
        <div><strong>27–30</strong><p>The Horizon already exists. Make its programming observable.</p></div>
      </section>
      <section className="build-day__boundary"><strong>Built today does not mean believed without evidence.</strong><p>Model outputs remain interpretations. Sources remain evidence. The repository documents what is functional, partial, or still specification.</p></section>
    </main>
    <footer className="public-footer"><span>Open-source build record</span><span>sovereignlens.ai · GitHub</span></footer>
  </div>
}
