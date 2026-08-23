import { useEffect, useState } from 'react'

const SLIDE_MS = 9_000

const slides = [
  {
    image: '/demo/01-home.jpg',
    eyebrow: 'Sovereign Lens · Programmable Horizons',
    title: 'The Horizon already exists.',
    body: 'Sovereign Lens makes its programming observable.',
    note: 'Independent multi-agent intelligence for tracking how AI reshapes state and geopolitical power.',
  },
  {
    image: '/demo/02-cases.jpg',
    eyebrow: '01 · Observe the writes',
    title: 'Strategy Atlas',
    body: 'Capital, talent, compute, infrastructure, culture, standards, institutions, human networks and AI agents alter a state’s future option space.',
    note: 'Relationships under observation—not political blocs.',
  },
  {
    image: '/demo/03-horizon.jpg',
    eyebrow: '02 · Program the object',
    title: 'Horizon Studio',
    body: 'Represent timers, commitments, parameters, defaults, permissions, priors, capacities and categories as versioned writes.',
    note: 'Inspect, simulate, revise and govern what becomes possible.',
  },
  {
    image: '/demo/04-brief.jpg',
    eyebrow: '03 · Read the situation',
    title: 'Executive Brief',
    body: 'See material changes, dependencies, sovereignty deltas, uncertainty and what evidence to watch next.',
    note: 'A fast state view without hiding the evidence chain.',
  },
  {
    image: '/demo/05-dossier.jpg',
    eyebrow: '04 · Preserve time',
    title: 'Temporal Dossier',
    body: 'Project the evidence graph at any as-of date. Keep claims, events, actors, assets and superseded beliefs in one auditable record.',
    note: 'What was knowable then remains distinguishable from what we know now.',
  },
  {
    image: '/demo/06-provenance.jpg',
    eyebrow: '05 · Open the evidence',
    title: 'Provenance everywhere',
    body: 'Every visible conclusion resolves to source IDs, publishers, retrieval dates and reliability notes.',
    note: 'Retrieved memory is context. It is never evidence by itself.',
  },
  {
    image: '/demo/07-models.jpg',
    eyebrow: '06 · Compare perspectives',
    title: 'Analytical parallax',
    body: 'Hold the evidence and question constant. Ask independent models what capability, dependency, control and optionality changed.',
    note: 'Agreement is useful. Disagreement is preserved as information.',
  },
  {
    image: '/demo/08-calibration.jpg',
    eyebrow: '07 · Return later',
    title: 'Time evaluates the models',
    body: 'Record a prediction, observe the later outcome, score the prior commitment and revise the methodology.',
    note: 'The horizon turns evaluation into intelligence.',
  },
  {
    image: '/demo/09-build.jpg',
    eyebrow: '08 · One-day open build',
    title: 'Eight working modules',
    body: 'Evidence ledger, temporal graph, Strategy Atlas, model parallax, prediction ledger, Horizon Studio, provenance and executive views.',
    note: 'Built and integrated on location at Long Horizon Agents Build Day.',
  },
  {
    image: '/demo/01-home.jpg',
    eyebrow: 'SovereignLens.ai',
    title: 'Make the programmable future observable.',
    body: 'Demo: sovereignlens.ai · Code: github.com/Dim25/Sovereign-Lens',
    note: 'Dima · linkedin.com/in/dim25',
  },
] as const

export function DemoPage({ navigate }: { navigate: (path: string) => void }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => {
      setIndex((current) => (current + 1) % slides.length)
      setCycle((current) => current + 1)
    }, SLIDE_MS)
    return () => window.clearTimeout(timer)
  }, [index, playing, cycle])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') { setIndex((index + 1) % slides.length); setCycle((value) => value + 1) }
      if (event.key === 'ArrowLeft') { setIndex((index - 1 + slides.length) % slides.length); setCycle((value) => value + 1) }
      if (event.key === ' ') { event.preventDefault(); setPlaying((value) => !value) }
      if (event.key === 'Escape') navigate('/')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [index, navigate])

  const slide = slides[index]
  const move = (direction: number) => {
    setIndex((index + direction + slides.length) % slides.length)
    setCycle((value) => value + 1)
  }

  return (
    <main className="demo" aria-label="Sovereign Lens automated product demo">
      <img key={`${index}-${cycle}`} className="demo__image" src={slide.image} alt="" />
      <div className="demo__shade" />
      <header className="demo__top">
        <button onClick={() => navigate('/')}>SOVEREIGN LENS</button>
        <div><a href="/media/sovereign-lens-demo-loop-90s.mp4" download>MP4 ↓</a><span>90-SECOND PRODUCT LOOP · {playing ? 'PLAYING' : 'PAUSED'}</span></div>
      </header>
      <section key={`copy-${index}-${cycle}`} className="demo__copy" aria-live="polite">
        <div className="demo__eyebrow">{slide.eyebrow}</div>
        <h1>{slide.title}</h1>
        <p>{slide.body}</p>
        <small>{slide.note}</small>
      </section>
      <footer className="demo__controls">
        <button aria-label="Previous demo scene" onClick={() => move(-1)}>←</button>
        <button aria-label={playing ? 'Pause demo' : 'Play demo'} onClick={() => setPlaying((value) => !value)}>{playing ? 'PAUSE' : 'PLAY'}</button>
        <div className="demo__steps" aria-label={`Scene ${index + 1} of ${slides.length}`}>
          {slides.map((_, step) => <button key={step} className={step === index ? 'is-active' : ''} aria-label={`Go to scene ${step + 1}`} onClick={() => { setIndex(step); setCycle((value) => value + 1) }} />)}
        </div>
        <span>{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
        <button aria-label="Next demo scene" onClick={() => move(1)}>→</button>
      </footer>
      {playing ? <div key={`progress-${index}-${cycle}`} className="demo__progress" /> : null}
    </main>
  )
}
