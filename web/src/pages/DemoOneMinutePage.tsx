import { useEffect, useState } from 'react'

const scenes = [
  ['/demo/01-home.jpg', 'Sovereign Lens', 'The Horizon already exists.', 'Independent multi-agent intelligence for tracking how AI reshapes state and geopolitical power.'],
  ['/demo/02-cases.jpg', '01 · Strategy Atlas', 'See the writes.', 'Observe how compute, capital, talent, infrastructure, standards and institutions alter sovereign option space.'],
  ['/demo/03-horizon.jpg', '02 · Horizon Studio', 'Shape the Horizon.', 'Compile capacities, priors, permissions, commitments, timers and verification into a versioned future object.'],
  ['/demo/04-brief.jpg', '03 · Executive Brief', 'Read the situation.', 'See capability, dependency, control, optionality, uncertainty and what evidence matters next.'],
  ['/demo/05-dossier.jpg', '04 · Temporal Dossier', 'Preserve what was knowable.', 'Project the evidence graph at any as-of date without deleting superseded beliefs.'],
  ['/demo/06-provenance.jpg', '05 · Evidence', 'Open every conclusion.', 'Resolve visible claims to sources, publishers, retrieval dates and reliability notes.'],
  ['/demo/07-models.jpg', '06 · Model Parallax', 'One record. Many perspectives.', 'Agreement is useful. Disagreement is preserved as analytical depth.'],
  ['/demo/08-calibration.jpg', '07 · Long Horizon', 'Return. Resolve. Learn.', 'Compare prior assessments with later outcomes. SovereignLens.ai makes the programmable future observable.'],
] as const

const SCENE_MS = 7_500

export function DemoOneMinutePage({ navigate }: { navigate: (path: string) => void }) {
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!playing) return
    const timer = window.setTimeout(() => setIndex((value) => (value + 1) % scenes.length), SCENE_MS)
    return () => window.clearTimeout(timer)
  }, [index, playing])

  const scene = scenes[index]
  const move = (delta: number) => setIndex((index + delta + scenes.length) % scenes.length)

  return (
    <main className="demo-minute" aria-label="Sovereign Lens one-minute demo">
      <header className="demo-minute__top">
        <button onClick={() => navigate('/')}>SOVEREIGN LENS</button>
        <div><a href="/media/sovereign-lens-demo-loop-60s.mp4" download>MP4 ↓</a><span>60 SECOND LOOP</span></div>
      </header>
      <section className="demo-minute__copy" key={`copy-${index}`}>
        <span>{scene[1]}</span>
        <h1>{scene[2]}</h1>
        <p>{scene[3]}</p>
        <small>sovereignlens.ai · github.com/Dim25/Sovereign-Lens</small>
      </section>
      <figure className="demo-minute__visual" key={`visual-${index}`}>
        <img src={scene[0]} alt={`Sovereign Lens interface: ${scene[1]}`} />
      </figure>
      <footer className="demo-minute__controls">
        <button aria-label="Previous one-minute demo scene" onClick={() => move(-1)}>←</button>
        <button aria-label={playing ? 'Pause one-minute demo' : 'Play one-minute demo'} onClick={() => setPlaying((value) => !value)}>{playing ? 'PAUSE' : 'PLAY'}</button>
        <div>{scenes.map((_, step) => <button key={step} aria-label={`Go to one-minute scene ${step + 1}`} className={step === index ? 'is-active' : ''} onClick={() => setIndex(step)} />)}</div>
        <span>{String(index + 1).padStart(2, '0')} / 08</span>
        <button aria-label="Next one-minute demo scene" onClick={() => move(1)}>→</button>
      </footer>
      {playing ? <i className="demo-minute__progress" key={index} /> : null}
    </main>
  )
}
