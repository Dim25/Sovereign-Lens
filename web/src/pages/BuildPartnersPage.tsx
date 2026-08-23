import { ProductNav } from '../components/ProductNav'

type Navigate = (path: string) => void

type Partner = {
  slug: string
  name: string
  role: string
  status: string
  thesis: string
  useNow: string[]
  architecture: { label: string; value: string }[]
  boundary: string
  next: string[]
  url: string
  questions?: { theme: string; question: string; why: string }[]
  evaluation?: { label: string; target: string }[]
}

const PARTNERS: Partner[] = [
  {
    slug: 'temporal',
    name: 'Temporal',
    role: 'Durable execution · scheduled reassessment',
    status: 'Micro adapter implemented · optional runtime',
    thesis: 'Make the observation loop survive days, months and infrastructure failures without making the workflow engine the analytical source of truth.',
    useNow: [
      'Schedule evidence refreshes at activation dates and forecast horizons.',
      'Retry fragile source retrieval and model calls without duplicating committed evidence.',
      'Pause for human review, then resume the same reassessment workflow.',
      'Run periodic calibration when predictions reach their verification date.',
    ],
    architecture: [
      { label: 'Workflow', value: 'Observe → extract → compare → await horizon → verify → calibrate' },
      { label: 'Activities', value: 'Fetch sources, hash evidence, call perspective models, write append-only records' },
      { label: 'Durable timers', value: 'Wake on policy activation, review clause, sunset or prediction horizon' },
      { label: 'Source of truth', value: 'Sovereign Lens bitemporal ledger—not Temporal event history' },
    ],
    boundary: 'Temporal coordinates when work happens and guarantees that it resumes. It does not determine what was true, overwrite superseded claims or become mandatory infrastructure for a sovereignty observatory.',
    next: ['Implement a TemporalRunner behind the existing runner seam.', 'Add idempotency keys derived from case, source and observation date.', 'Test month-scale timers with Temporal time-skipping.', 'Keep the local runner as the default hackathon path.'],
    url: 'https://docs.temporal.io/',
  },
  {
    slug: 'stash',
    name: 'Stash',
    role: 'Shared agent memory · cross-rollout learning',
    status: 'Portable memory export implemented · ledger remains canonical',
    thesis: 'Let research agents retrieve prior investigations, analyst corrections and unresolved questions instead of re-deriving them in every rollout.',
    useNow: [
      'Capture research sessions, prompts, tool calls and resulting memos.',
      'Retrieve earlier source-quality judgments and entity-resolution decisions.',
      'Share corrections and case context across different agents and teammates.',
      'Publish reusable source-verification and assessment-review skills.',
    ],
    architecture: [
      { label: 'Write', value: 'Session transcript, research memo, analyst correction, unresolved question' },
      { label: 'Retrieve', value: 'Semantic search + grep over prior work before a new assessment begins' },
      { label: 'Promote', value: 'Human-reviewed lessons become versioned methodology records' },
      { label: 'Source of truth', value: 'Evidence graph and prediction ledger—not retrieved agent memory' },
    ],
    boundary: 'Memory can be stale, incomplete or poisoned. A retrieved recollection is context, never evidence by itself. Durable claims still require a source ID, observation time and content hash.',
    next: ['Connect the development workspace and capture research sessions.', 'Define a minimal memory record with provenance and retention policy.', 'Compare retrieval against a local append-only adapter.', 'Add a human promotion step before memory changes methodology.'],
    url: 'https://www.joinstash.ai/docs',
    questions: [
      { theme: 'Retrieval', question: 'Can search filter by case, valid time, recorded time, source jurisdiction, author and review status before semantic ranking?', why: 'A semantically similar but temporally stale memory can produce a confidently wrong sovereignty assessment.' },
      { theme: 'Provenance', question: 'Does every result return an immutable memory ID, original author, creation time, source session and exact excerpt?', why: 'An agent must be able to explain why a memory entered context and reproduce the retrieval later.' },
      { theme: 'Supersession', question: 'Can a correction supersede earlier memory without deleting it, while retrieval prefers the current record and exposes the old one?', why: 'Sovereign Lens preserves changed beliefs instead of rewriting analytical history.' },
      { theme: 'Isolation', question: 'Can permissions be enforced by source, case, field and agent—and before embeddings or results leave the tenant boundary?', why: 'Research may combine public evidence, private notes and restricted material.' },
      { theme: 'Deletion', question: 'What happens to raw text, embeddings, caches, summaries and backups after deletion or a retention deadline?', why: 'A credible right to forget must cover derived memory, not only the visible page.' },
      { theme: 'Poisoning', question: 'What prevents one compromised session or retrieved document from becoming durable shared instruction?', why: 'Cross-agent memory increases the blast radius of prompt injection and analyst error.' },
      { theme: 'Human review', question: 'Can unreviewed memory remain separate from approved lessons, with a signed promotion event and rollback?', why: 'Only reviewed lessons may change the versioned Sovereign Lens methodology.' },
      { theme: 'Evaluation', question: 'Can we log retrieval candidates, ranks, filters and the final context bundle?', why: 'We need to score recall, stale-hit rate and downstream effects against the local adapter.' },
      { theme: 'Portability', question: 'Can we export sessions, pages, links and metadata—and reproduce the retrieval policy self-hosted?', why: 'Institutional memory cannot become hostage to one service.' },
      { theme: 'Operations', question: 'What are the API/MCP limits, indexing latency, regional hosting choices and failure behavior?', why: 'The observation loop needs predictable degradation when Stash is unavailable.' },
    ],
    evaluation: [
      { label: 'Recall@5', target: '≥ 0.80 on 25 known prior decisions' },
      { label: 'Stale-hit rate', target: '≤ 0.05 after superseding corrections' },
      { label: 'Provenance', target: '100% carry immutable origin metadata' },
      { label: 'Isolation', target: '0 unauthorized results across adversarial probes' },
      { label: 'Recovery', target: 'Local ledger completes when Stash is unavailable' },
      { label: 'Behavioral lift', target: 'Reviewed lesson beats the no-memory control' },
    ],
  },
  {
    slug: 'coframe',
    name: 'Coframe',
    role: 'Adaptive explanation · audience-specific interface',
    status: 'Safe event contract implemented · analytical fields locked',
    thesis: 'Test how the same auditable analysis can become legible to an executive, researcher or policymaker without changing the underlying conclusion.',
    useNow: [
      'Create variants of the case entry point and explanatory copy.',
      'Test whether visitors reach evidence, disagreement and prediction history.',
      'Adapt information density by audience while preserving citations.',
      'Measure comprehension-oriented actions rather than engagement alone.',
    ],
    architecture: [
      { label: 'Invariant', value: 'Facts, confidence, provenance and disagreement cannot vary' },
      { label: 'Variable', value: 'Order, wording, density and call-to-action may vary' },
      { label: 'Success event', value: 'Evidence opened, competing view inspected, horizon understood' },
      { label: 'Governance', value: 'Archive every public variant and its evaluation metric' },
    ],
    boundary: 'Optimization must not become narrative manipulation. Coframe may improve comprehension of the record; it must never silently optimize a geopolitical conclusion, confidence value or source selection.',
    next: ['Instrument evidence-open and perspective-compare events.', 'Create executive and research-reader variants.', 'Lock analytical fields outside variant scope.', 'Record winning presentation variants as part of the interface history.'],
    url: 'https://docs.coframe.com/',
  },
]

export function BuildPartnersPage({ navigate, slug }: { navigate: Navigate; slug?: string }) {
  const partner = PARTNERS.find((item) => item.slug === slug)
  if (partner) return <PartnerDetail partner={partner} navigate={navigate} />

  return (
    <div className="build-page">
      <ProductNav active="/build" navigate={navigate} />
      <header className="build-head">
        <div className="eyebrow">Long-horizon build architecture</div>
        <h1>Memory is not<br />the horizon.</h1>
        <p>The horizon becomes programmable when evidence, durable execution, shared learning and human review form one accountable loop. Each partner strengthens a different layer; none becomes the source of truth.</p>
      </header>
      <main className="partner-grid">
        {PARTNERS.map((item, index) => (
          <button className="partner-card" key={item.slug} onClick={() => navigate(`/build/${item.slug}`)}>
            <div className="partner-card__index">0{index + 1}</div>
            <div className="partner-card__role">{item.role}</div>
            <h2>{item.name}</h2>
            <p>{item.thesis}</p>
            <span>{item.status}</span>
            <strong>Open integration note →</strong>
          </button>
        ))}
      </main>
      <section className="build-loop" aria-label="Long-horizon integration loop">
        {['Observe', 'Remember', 'Reassess', 'Verify', 'Learn'].map((step, index) => <div key={step}><span>0{index + 1}</span><strong>{step}</strong></div>)}
      </section>
    </div>
  )
}

function PartnerDetail({ partner, navigate }: { partner: Partner; navigate: Navigate }) {
  return (
    <div className="partner-detail">
      <ProductNav active="/build" navigate={navigate} />
      <header className="partner-detail__head">
        <button onClick={() => navigate('/build')} className="text-link">← All build partners</button>
        <div className="partner-detail__status">{partner.status}</div>
        <div className="eyebrow">{partner.role}</div>
        <h1>{partner.name}<br />× Sovereign Lens</h1>
        <p>{partner.thesis}</p>
      </header>
      <main className="partner-detail__grid">
        <section>
          <div className="partner-section-label">01 · Practical use</div>
          <h2>What this layer contributes</h2>
          <ol>{partner.useNow.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
        </section>
        <section>
          <div className="partner-section-label">02 · Architecture</div>
          <h2>Where it fits</h2>
          <dl>{partner.architecture.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.value}</dd></div>)}</dl>
        </section>
        <section className="partner-boundary">
          <div className="partner-section-label">03 · Independence boundary</div>
          <h2>What it must not become</h2>
          <p>{partner.boundary}</p>
        </section>
        <section>
          <div className="partner-section-label">04 · Build next</div>
          <h2>Smallest credible integration</h2>
          <ol>{partner.next.map((item, index) => <li key={item}><span>0{index + 1}</span>{item}</li>)}</ol>
          <a className="partner-docs" href={partner.url} target="_blank" rel="noreferrer">Official documentation ↗</a>
          <a className="partner-docs" href="https://github.com/Dim25/Sovereign-Lens/tree/main/integrations" target="_blank" rel="noreferrer">Micro implementation ↗</a>
        </section>
        {partner.questions ? (
          <section className="partner-deep-dive">
            <div className="partner-section-label">05 · Ask the Stash team</div>
            <div className="partner-deep-dive__head">
              <h2>Questions that determine adoption</h2>
              <p>Ask for a live demonstration against one corrected Sovereign Lens case—not only a verbal answer.</p>
            </div>
            <div className="partner-questions">
              {partner.questions.map((item, index) => (
                <article key={item.question}>
                  <div><span>{String(index + 1).padStart(2, '0')}</span><strong>{item.theme}</strong></div>
                  <h3>{item.question}</h3>
                  <p>{item.why}</p>
                </article>
              ))}
            </div>
          </section>
        ) : null}
        {partner.evaluation ? (
          <section className="partner-eval">
            <div className="partner-section-label">06 · 60-minute bake-off</div>
            <h2>Adopt only if memory improves the next rollout.</h2>
            <p className="partner-eval__method">Seed 25 prior decisions, supersede five, restrict five, then start a fresh agent. Run identical questions with no memory, the local adapter and Stash. Freeze prompts and score the result.</p>
            <div className="partner-eval__gates">
              {partner.evaluation.map((item) => <div key={item.label}><strong>{item.label}</strong><span>{item.target}</span></div>)}
            </div>
            <blockquote>Integrate Stash when it improves relevant recall without increasing stale or unauthorized context—and when accumulated institutional memory remains exportable and reproducible.</blockquote>
          </section>
        ) : null}
      </main>
    </div>
  )
}
