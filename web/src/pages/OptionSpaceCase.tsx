import { ProductNav } from '../components/ProductNav'
import { optionSpaceRuns } from '../data/option-space-model-runs'

export function OptionSpaceCase({ navigate }: { navigate: (path: string) => void }) {
  const completed = optionSpaceRuns.filter((run) => run.status === 'complete')
  const pending = optionSpaceRuns.length - completed.length
  return (
    <div className="option-case">
      <ProductNav active="/cases" navigate={navigate} />
      <header className="option-case__hero">
        <div className="eyebrow">Case 04 · Multi-alignment · source-linked analytical hypothesis</div>
        <h1>Who is programming<br />whose capacity to choose<span>?</span></h1>
        <div className="option-case__dek">
          <p>Do not ask only which supplier gained influence. Observe how infrastructure, finance, standards, talent, and institutions change the receiving state's future option space.</p>
          <dl><div><dt>Models</dt><dd>{completed.length} completed · {pending} pending</dd></div><div><dt>Evidence status</dt><dd>One secondary source · outcomes unverified</dd></div></dl>
        </div>
      </header>

      <main className="option-case__main">
        <section className="option-space-map">
          <div className="option-space-map__supplier"><span>External + domestic stacks</span><strong>China · US · EU · UN · domestic · open source</strong></div>
          <div className="option-space-map__writes">
            {['Compute', 'Finance', 'Standards', 'Talent', 'Infrastructure', 'Institutions'].map((item) => <span key={item}>{item}</span>)}
          </div>
          <div className="option-space-map__state"><span>Receiving-state Horizon</span><strong>Capability ↑</strong><strong>Dependency ?</strong><strong>Optionality ?</strong></div>
          <p>Observable test: can a critical workload be evaluated, governed, and moved without prohibitive loss?</p>
        </section>

        <section className="option-case__source">
          <div className="section-index">01 · Source → hypothesis</div>
          <blockquote>“Don't measure who is winning influence. Measure who is programming whose Horizon of possible action.”</blockquote>
          <p><a href="https://carnegieendowment.org/research/2026/05/chinas-pivot-on-global-ai">Carnegie's May 2026 analysis ↗</a> documents a claimed pivot in China's AI diplomacy from infrastructure and technical standards toward global rules, norms, capacity-building institutions, UN processes, and the proposed WAICO. It also argues that Global South countries have not given wholesale normative buy-in and continue engaging multiple powers. Sovereign Lens converts that analysis into testable receiving-state questions; it does not treat Carnegie's interpretation as proof of lock-in or intent.</p>
          <div className="option-case__trajectory" aria-label="Carnegie trajectory interpreted through Programmable Horizons">
            {['Infrastructure', 'Capability', 'Standards', 'Trained personnel', 'Institutions', 'Governance vocabulary', 'Future option space'].map((step, index) => <span key={step}><b>{String(index + 1).padStart(2, '0')}</b>{step}</span>)}
          </div>
        </section>

        <section className="option-case__models">
          <div className="section-index">02 · Same prompt · different models</div>
          <div className="option-case__model-grid">
            {optionSpaceRuns.map((run, index) => (
              <article className={run.status === 'pending' ? 'option-model option-model--pending' : 'option-model'} key={run.model}>
                <div className="option-model__meta"><span>{String(index + 1).padStart(2, '0')}</span><span>{run.provider}</span></div>
                <h2>{run.model}</h2>
                <p className="option-model__thesis">{run.thesis}</p>
                {run.status === 'complete' ? <>
                  <dl><div><dt>Capability</dt><dd>{run.capability}</dd></div><div><dt>Dependency</dt><dd>{run.dependency}</dd></div><div><dt>Optionality</dt><dd>{run.optionality}</dd></div></dl>
                  <div className="option-model__falsifier"><span>Falsifier</span><p>{run.falsifier}</p></div>
                </> : <p className="option-model__pending-note">Provider credential and exact model availability must be verified before attribution.</p>}
              </article>
            ))}
          </div>
        </section>

        <section className="option-case__synthesis">
          <div className="section-index">03 · Parallax synthesis</div>
          <div><h2>Consensus</h2><p>Access can expand capability while layered technical and institutional dependencies reduce practical reversibility.</p></div>
          <div><h2>Divergence</h2><p>Qwen stresses illusory optionality; GLM stresses breadth versus depth; DeepSeek stresses redundancy; Codex stresses evaluation control; Fable questions whether AI stacks are truly as path-dependent as physical infrastructure.</p></div>
          <div><h2>What resolves it</h2><p>Contracts, workload-level concentration, interoperability tests, local operating rights, and an observed migration between stacks.</p></div>
        </section>
      </main>
      <footer className="public-footer"><span>Model outputs are interpretations, not evidence</span><span>Prompt held constant · provenance preserved</span></footer>
    </div>
  )
}
