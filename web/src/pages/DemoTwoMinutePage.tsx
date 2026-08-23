import { useCallback, useEffect, useRef, useState } from 'react'
import './demo-two-minute.css'

/**
 * A two-minute automatic product overview.
 *
 * `/demo` and `/demo1min` are screenshot slideshows: they narrate the product
 * but do not run it, and they go stale the moment the interface moves. This
 * page drives the real application inside a same-origin iframe, so every frame
 * is the live build — and the chapters that matter (advancing the snapshot,
 * opening provenance) are performed as actual interactions rather than
 * described over a still.
 *
 * Degradation is deliberate: if a step's selector is missing the step is
 * skipped and the chapter still renders its route. A renamed class costs one
 * beat of choreography, never a blank screen.
 */

type Step =
  | { do: 'click'; selector: string; nth?: number }
  | { do: 'scroll'; selector: string }
  | { do: 'pause'; ms: number }

interface Chapter {
  eyebrow: string
  title: string
  body: string
  watch: string
  route: string
  ms: number
  steps?: Step[]
}

const CHAPTERS: Chapter[] = [
  {
    eyebrow: '00 · The thesis',
    title: 'Sovereignty is not access.',
    body: 'A state can gain AI capability while losing the ability to operate, audit or replace it. Sovereign Lens treats that gap as the analytical object.',
    watch: 'Capability, access, ownership, dependency and optionality are tracked as distinct things.',
    route: '/',
    ms: 10_000,
  },
  {
    eyebrow: '01 · Observe',
    title: 'Strategy atlas.',
    body: 'Relationships under observation, not political blocs. Compute, capital, talent and institutions are the writes that move a state’s option space.',
    watch: 'Every case is a relationship being written, not a country being scored.',
    route: '/cases',
    ms: 10_000,
    steps: [{ do: 'scroll', selector: '.strategy-map' }],
  },
  {
    eyebrow: '02 · Project',
    title: 'The graph at an as_of date.',
    body: 'The UAE–US case, projected to May 2025. Nine actors and assets, eleven relationships valid at that moment — not the ones valid today.',
    watch: 'The snapshot digest pins exactly which facts produced this view.',
    route: '/cases/uae-us-ai-infrastructure',
    ms: 12_000,
    steps: [{ do: 'scroll', selector: '.graph-viewport' }],
  },
  {
    eyebrow: '03 · Advance',
    title: 'Thirteen months pass.',
    body: 'Time moves and the projection recomputes. This is a real interaction on the live build, not a cut between two screenshots.',
    watch: 'as_of and the digest both change. Nothing is edited in place.',
    route: '/cases/uae-us-ai-infrastructure',
    ms: 13_000,
    steps: [
      { do: 'scroll', selector: '.scrubber' },
      { do: 'pause', ms: 2200 },
      { do: 'click', selector: '.scrubber__advance' },
    ],
  },
  {
    eyebrow: '04 · Supersede',
    title: 'What changed stays visible.',
    body: 'The announcement did not vanish when it was overtaken. It is marked superseded and kept, because a memory that silently serves the stale fact produces a confident, well-cited, wrong answer.',
    watch: 'Superseded rows remain in the ledger, struck through rather than deleted.',
    route: '/cases/uae-us-ai-infrastructure',
    ms: 12_000,
    steps: [{ do: 'scroll', selector: '.facts' }],
  },
  {
    eyebrow: '05 · Trace',
    title: 'Every claim opens.',
    body: 'Any statement in the ledger resolves to its sources: publisher, retrieval date, perspective and reliability notes.',
    watch: 'Provenance is a property of the record, not a footnote bolted on afterwards.',
    route: '/cases/uae-us-ai-infrastructure',
    ms: 13_000,
    steps: [
      { do: 'scroll', selector: '.facts' },
      { do: 'pause', ms: 1600 },
      { do: 'click', selector: '.facts .cite' },
    ],
  },
  {
    eyebrow: '06 · Disagree',
    title: 'Three perspectives, one record.',
    body: 'Capability, dependency and evidence-auditor views assess the same snapshot. Where they diverge, the divergence is preserved rather than averaged into a single number.',
    watch: 'Material disagreement is marked, not resolved.',
    route: '/cases/uae-us-ai-infrastructure',
    ms: 12_000,
    steps: [
      { do: 'click', selector: '.drawer__close' },
      { do: 'scroll', selector: '.perspectives' },
    ],
  },
  {
    eyebrow: '07 · Commit',
    title: 'A falsifiable prediction.',
    body: 'The assessment registers a claim with a probability, a horizon date and the snapshot hash it was made against. Append-only.',
    watch: 'The prediction is pinned to the evidence state that produced it.',
    route: '/cases/uae-us-ai-infrastructure',
    ms: 11_000,
    steps: [{ do: 'scroll', selector: '.ledger' }],
  },
  {
    eyebrow: '08 · Read',
    title: 'Executive brief.',
    body: 'The same record, composed for a decision: what changed, what it depends on, what is uncertain, and which evidence would move it.',
    watch: 'A fast view that never detaches from the evidence chain underneath.',
    route: '/brief',
    ms: 11_000,
  },
  {
    eyebrow: '09 · Program',
    title: 'Horizon Studio.',
    body: 'Capacities, priors, permissions, commitments, timers and verification, compiled into a versioned future object that humans and agents both write to.',
    watch: 'Automation may propose. Only a named human reviewer makes it effective.',
    route: '/horizon',
    ms: 12_000,
    steps: [{ do: 'scroll', selector: '.horizon-grid' }],
  },
  {
    eyebrow: '10 · Open',
    title: 'Built to be replaceable.',
    body: 'Models, providers, prompts, data sources and schedulers are all swappable. A sovereignty observatory that cannot run without one vendor argues against its own thesis.',
    watch: 'Apache 2.0, open schemas, open evidence manifests.',
    route: '/build',
    ms: 10_000,
  },
]

const TOTAL_MS = CHAPTERS.reduce((sum, c) => sum + c.ms, 0)

export function DemoTwoMinutePage({ navigate }: { navigate: (path: string) => void }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [loadedRoute, setLoadedRoute] = useState<string | null>(null)
  const frame = useRef<HTMLIFrameElement>(null)
  const run = useRef(0)

  const chapter = CHAPTERS[index]

  const doc = () => {
    try {
      return frame.current?.contentDocument ?? null
    } catch {
      return null // Same-origin in practice; never let a security error kill the run.
    }
  }

  const waitFor = useCallback(async (selector: string, token: number, timeout = 4000) => {
    const deadline = Date.now() + timeout
    while (Date.now() < deadline) {
      if (run.current !== token) return null
      const found = doc()?.querySelector<HTMLElement>(selector)
      if (found) return found
      await new Promise((r) => setTimeout(r, 100))
    }
    return null
  }, [])

  // Load the chapter's route (only when it actually differs), then choreograph.
  useEffect(() => {
    const token = ++run.current
    let cancelled = false

    const play = async () => {
      if (chapter.route !== loadedRoute) {
        const el = frame.current
        if (el) {
          const loaded = new Promise<void>((resolve) => {
            const onLoad = () => { el.removeEventListener('load', onLoad); resolve() }
            el.addEventListener('load', onLoad)
          })
          el.src = chapter.route
          await loaded
          if (run.current !== token) return
          setLoadedRoute(chapter.route)
          await new Promise((r) => setTimeout(r, 600))
        }
      }

      for (const step of chapter.steps ?? []) {
        if (run.current !== token) return
        if (step.do === 'pause') { await new Promise((r) => setTimeout(r, step.ms)); continue }
        const target = await waitFor(step.selector, token)
        if (!target) continue // Selector moved; skip the beat, keep the chapter.
        if (step.do === 'scroll') target.scrollIntoView({ behavior: 'smooth', block: 'center' })
        else target.click()
      }
    }

    void play()
    return () => { cancelled = true; void cancelled }
  }, [index, chapter, loadedRoute, waitFor])

  // Chapter clock. Restarts whenever the chapter or play state changes.
  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(
      () => setIndex((value) => (value + 1) % CHAPTERS.length),
      chapter.ms,
    )
    return () => window.clearTimeout(timer)
  }, [index, playing, chapter.ms])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === ' ') { event.preventDefault(); setPlaying((v) => !v) }
      if (event.key === 'ArrowRight') setIndex((v) => (v + 1) % CHAPTERS.length)
      if (event.key === 'ArrowLeft') setIndex((v) => (v - 1 + CHAPTERS.length) % CHAPTERS.length)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const move = (delta: number) => setIndex((index + delta + CHAPTERS.length) % CHAPTERS.length)
  const elapsed = CHAPTERS.slice(0, index).reduce((sum, c) => sum + c.ms, 0)
  const mmss = (ms: number) => `${Math.floor(ms / 60_000)}:${String(Math.floor((ms % 60_000) / 1000)).padStart(2, '0')}`

  return (
    <main className="tour" aria-label="Sovereign Lens two-minute product tour">
      <header className="tour__top">
        <button className="tour__brand" onClick={() => navigate('/')}>Sovereign Lens</button>
        <span className="tour__badge">Two-minute tour · live build, not a recording</span>
        <span className="tour__clock">{mmss(elapsed)} / {mmss(TOTAL_MS)}</span>
      </header>

      <div className="tour__body">
        <section className="tour__script" key={index}>
          <span className="tour__eyebrow">{chapter.eyebrow}</span>
          <h1>{chapter.title}</h1>
          <p>{chapter.body}</p>
          <p className="tour__watch"><b>Watch for</b>{chapter.watch}</p>
          <ol className="tour__index" aria-label="Tour chapters">
            {CHAPTERS.map((c, step) => (
              <li key={c.eyebrow}>
                <button
                  className={step === index ? 'is-active' : undefined}
                  aria-current={step === index}
                  onClick={() => setIndex(step)}
                >
                  <i>{String(step).padStart(2, '0')}</i>{c.title}
                </button>
              </li>
            ))}
          </ol>
        </section>

        <section className="tour__stage">
          <div className="tour__stage-bar">
            <span>{chapter.route}</span>
            <span>live application</span>
          </div>
          <iframe
            ref={frame}
            className="tour__frame"
            title="Sovereign Lens application"
            src="/"
            onLoad={() => { if (!loadedRoute) setLoadedRoute('/') }}
          />
        </section>
      </div>

      <footer className="tour__controls">
        <button onClick={() => move(-1)} aria-label="Previous chapter">←</button>
        <button className="tour__play" onClick={() => setPlaying((v) => !v)}>
          {playing ? 'Pause' : 'Play'}
        </button>
        <button onClick={() => move(1)} aria-label="Next chapter">→</button>
        <div className="tour__rail" role="presentation">
          {CHAPTERS.map((c, step) => (
            <span
              key={c.eyebrow}
              className={step < index ? 'is-done' : step === index ? 'is-live' : undefined}
              style={{ flexGrow: c.ms }}
            >
              {step === index && playing
                ? <i className="tour__fill" style={{ animationDuration: `${c.ms}ms` }} />
                : null}
            </span>
          ))}
        </div>
        <span className="tour__count">{String(index + 1).padStart(2, '0')} / {String(CHAPTERS.length).padStart(2, '0')}</span>
        <button onClick={() => navigate(chapter.route)} className="tour__exit">Open this page →</button>
      </footer>
    </main>
  )
}
