import { ProductNav } from '../components/ProductNav'
import { optionSpaceRuns } from '../data/option-space-model-runs'

export function OptionSpaceCase({ navigate }: { navigate: (path: string) => void }) {
  const completed = optionSpaceRuns.filter((run) => run.status === 'complete')
  return (
    <div className="option-case">
      <ProductNav active="/cases" navigate={navigate} />
      <header className="option-case__hero">
        <div className="eyebrow">Case 04 · Multi-alignment · analyst commentary</div>
        <h1>Who is programming<br />whose capacity to choose<span>?</span></h1>
        <div className="option-case__dek">
          <p>Do not ask only which supplier gained influence. Observe how infrastructure, finance, standards, talent, and institutions change the receiving state's future option space.</p>
          <dl><div><dt>Models</dt><dd>{completed.length} completed · 1 pending</dd></div><div><dt>Evidence status</dt><dd>Commentary to test—not verified case evidence</dd></div></dl>
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
          <div className="section-index">01 · Supplied interpretation</div>
          <blockquote>“Don't measure who is winning influence. Measure who is programming whose Horizon of possible action.”</blockquote>
          <p>The supplied story argues that China increasingly presents multilateral development and capacity-building while U.S. strategy emphasizes an American technology stack. Receiving states may use Chinese systems while engaging the U.S., EU, UN, domestic, and open-source alternatives. Sovereign Lens treats these as hypotheses requiring source-linked verification.</p>
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
          <div><h2>Divergence</h2><p>Qwen stresses illusory optionality; GLM stresses breadth versus depth; DeepSeek stresses redundancy and cross-pollination; Codex stresses tested substitution and evaluation control.</p></div>
          <div><h2>What resolves it</h2><p>Contracts, workload-level concentration, interoperability tests, local operating rights, and an observed migration between stacks.</p></div>
        </section>
      </main>
      <footer className="public-footer"><span>Model outputs are interpretations, not evidence</span><span>Prompt held constant · provenance preserved</span></footer>
    </div>
  )
}
