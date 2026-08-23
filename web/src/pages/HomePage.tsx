import { ProductNav } from '../components/ProductNav'
import type { DataSource } from '../types'

export function HomePage({ source, navigate }: { source: DataSource; navigate: (path: string) => void }) {
  const meta = source.meta()
  const snapshot = source.snapshot(meta.t1)
  const material = source.disagreements(meta.t1).filter((axis) => axis.divergence === 'material')

  return (
    <div className="public-page">
      <ProductNav active="/" navigate={navigate} />
      <main className="home">
        <section className="home-hero">
          <div className="eyebrow">Long-horizon intelligence · Open source</div>
          <figure className="home-film">
            <video autoPlay muted loop playsInline controls preload="metadata" poster="/media/sovereign-lens-executive-v2-poster.jpg">
              <source src="/media/sovereign-lens-executive-v2-20s.mp4" type="video/mp4" />
            </video>
            <figcaption><span>00 · Executive film · 21s</span><strong>The future is a writable object</strong></figcaption>
          </figure>
          <h1>The horizon<br />already exists<span>.</span></h1>
          <div className="home-hero__bottom">
            <p>We can make it programmable now.</p>
            <p className="home-hero__description">
              Sovereign Lens observes how states and institutions program long-term trajectories
              through capital, talent, compute, infrastructure, culture, human networks, and AI agents.
            </p>
          </div>
          <div className="home-actions">
            <button className="button-primary" onClick={() => navigate('/brief')}>Open executive brief →</button>
            <button className="button-secondary" onClick={() => navigate('/cases/uae-us-ai-infrastructure')}>Explore the evidence</button>
          </div>
        </section>

        <section className="live-case">
          <div className="section-index">01 · Live case</div>
          <div className="live-case__header">
            <div>
              <div className="eyebrow">UAE–US AI infrastructure</div>
              <h2>Capability rises.<br />Control remains conditional.</h2>
            </div>
            <div className="live-case__stamp">
              <span>As of</span><strong>{meta.t1}</strong>
              <span>Snapshot</span><strong>{snapshot.digest}</strong>
            </div>
          </div>
          <div className="signal-grid">
            <article><span>What changed</span><strong>500 MW</strong><p>reported online in 2026</p></article>
            <article><span>What it means</span><strong>Capability ↑</strong><p>with continuing U.S. operational leverage</p></article>
            <article><span>What is unresolved</span><strong>{material.length} material</strong><p>verification disagreement preserved</p></article>
          </div>
        </section>

        <section className="interface-proof">
          <div className="section-index">02 · See the instrument</div>
          <div className="interface-proof__intro">
            <h2>From public evidence<br />to sovereign trajectory.</h2>
            <p>The interface preserves the graph, competing interpretations, prediction ledger,
              later outcome, and source-level provenance in one auditable temporal record.</p>
          </div>
          <div className="interface-montage">
            <button className="interface-shot interface-shot--primary" onClick={() => navigate('/cases/uae-us-ai-infrastructure')}>
              <img src="/media/interface/temporal-dossier.png" alt="Sovereign Lens temporal dossier showing evidence graph, model perspectives, prediction resolution, and calibration" loading="lazy" />
              <span><b>01</b> Temporal dossier · later evidence resolves the prior commitment</span>
            </button>
            <div className="interface-montage__stack">
              <button className="interface-shot" onClick={() => navigate('/brief')}>
                <img src="/media/interface/executive-brief.png" alt="Sovereign Lens executive situation brief" loading="lazy" />
                <span><b>02</b> Executive state · changes, dependencies, what to watch next</span>
              </button>
              <button className="interface-shot" onClick={() => navigate('/cases/uae-us-ai-infrastructure')}>
                <img src="/media/interface/evidence-provenance.png" alt="Sovereign Lens evidence drawer with source-level provenance" loading="lazy" />
                <span><b>03</b> Evidence receipt · every conclusion drills back to sources</span>
              </button>
            </div>
          </div>
        </section>

        <section className="idea-section">
          <div className="section-index">03 · Programmable Horizon Blocks</div>
          <h2>The disagreement is the product.<br />The horizon turns evaluation into intelligence.</h2>
          <p className="horizon-thesis">
            Sovereign Lens does not decide whether an initiative is “pro-US,” “pro-China,” or
            “pro-Africa.” It preserves the evidence, asks what capability and dependency changed,
            records competing interpretations, and returns later to learn which interpretation held up.
          </p>
          <div className="horizon-blocks" aria-label="Programmable Horizon Blocks">
            {['Capital', 'Talent', 'Compute', 'Infrastructure', 'Energy', 'Data', 'Culture', 'Institutions', 'Law + policy', 'Human networks', 'Standards', 'AI agents'].map((block) => (
              <span key={block}>{block}</span>
            ))}
          </div>
          <div className="loop-line" aria-label="Evidence to learning loop">
            {['Evidence', 'Belief', 'Prediction', 'Outcome', 'Calibration', 'Method v2'].map((step, i) => (
              <div className={i === 5 ? 'loop-step loop-step--accent' : 'loop-step'} key={step}>
                <span>{String(i + 1).padStart(2, '0')}</span>{step}
              </div>
            ))}
          </div>
        </section>

        <section className="principles-section">
          <div className="section-index">04 · Why it matters</div>
          <div className="principles-grid">
            <article><span>Capability ≠ control</span><p>Access can grow while ownership, optionality, and replacement power remain elsewhere.</p></article>
            <article><span>Disagreement is evidence</span><p>Competing interpretations stay visible instead of disappearing into an average.</p></article>
            <article><span>History is append-only</span><p>The system may answer differently now. It must never pretend it always knew.</p></article>
          </div>
          <blockquote className="programmable-horizon">
            <strong>The horizon already exists. We can make it programmable now.</strong>
            <span>Retain the belief. Audit the handoff. Test it against reality. Govern what the next agent inherits.</span>
          </blockquote>
        </section>
      </main>
      <footer className="public-footer"><span>Independent intelligence for AI geopolitics</span><span>Apache 2.0 · sovereignlens.ai</span></footer>
    </div>
  )
}
