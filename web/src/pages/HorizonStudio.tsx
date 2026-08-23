import { useEffect, useMemo, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { ProductNav } from '../components/ProductNav'

type BlockKind = 'signal' | 'capacity' | 'prior' | 'permission' | 'commitment' | 'timer' | 'verification' | 'adaptation'

type HorizonBlock = {
  id: string
  kind: BlockKind
  title: string
  detail: string
  owner: string
  offset: number
  binding: 'advisory' | 'budgeted' | 'contractual' | 'regulatory'
  reversible: boolean
  enabled: boolean
  x: number
  y: number
}

type HorizonEdge = { from: string; to: string; condition: string }

const INITIAL_BLOCKS: HorizonBlock[] = [
  { id: 'observe', kind: 'signal', title: 'Observe a state write', detail: 'Accept a source-linked change to a sovereign trajectory.', owner: 'Evidence institution', offset: 0, binding: 'advisory', reversible: true, enabled: true, x: 28, y: 62 },
  { id: 'compute', kind: 'capacity', title: 'Allocate sovereign compute', detail: 'Commit capital, power, land and hardware to locally operable capacity.', owner: 'State investment fund', offset: 30, binding: 'budgeted', reversible: false, enabled: true, x: 286, y: 62 },
  { id: 'talent', kind: 'prior', title: 'Form talent & research culture', detail: 'Fund curricula, laboratories and institutions that shape future priors.', owner: 'Universities + ministry', offset: 60, binding: 'budgeted', reversible: true, enabled: true, x: 544, y: 62 },
  { id: 'access', kind: 'permission', title: 'Set access conditions', detail: 'Define hosting, export, audit, modification and replacement rights.', owner: 'Regulator + provider', offset: 90, binding: 'contractual', reversible: true, enabled: true, x: 802, y: 62 },
  { id: 'institution', kind: 'commitment', title: 'Charter evaluation institution', detail: 'Give a local body authority, budget and continuity beyond one administration.', owner: 'Legislature', offset: 120, binding: 'regulatory', reversible: false, enabled: true, x: 802, y: 294 },
  { id: 'wake', kind: 'timer', title: 'Review at horizon', detail: 'Re-open the commitment when operational evidence should exist.', owner: 'Temporal / local runner', offset: 365, binding: 'contractual', reversible: true, enabled: true, x: 544, y: 294 },
  { id: 'verify', kind: 'verification', title: 'Measure retained optionality', detail: 'Test local operation, replacement power and independent evaluation.', owner: 'Independent evaluators', offset: 366, binding: 'advisory', reversible: true, enabled: true, x: 286, y: 294 },
  { id: 'adapt', kind: 'adaptation', title: 'Govern the next write', detail: 'Preserve the record and change policy only after named human review.', owner: 'Human review council', offset: 367, binding: 'regulatory', reversible: true, enabled: true, x: 28, y: 294 },
]

const EDGES: HorizonEdge[] = [
  { from: 'observe', to: 'compute', condition: 'if authorized' },
  { from: 'compute', to: 'talent', condition: 'fund together' },
  { from: 'talent', to: 'access', condition: 'set rights' },
  { from: 'access', to: 'institution', condition: 'charter' },
  { from: 'institution', to: 'wake', condition: 'schedule' },
  { from: 'wake', to: 'verify', condition: 'at horizon' },
  { from: 'verify', to: 'adapt', condition: 'after scoring' },
]

const KIND_LABEL: Record<BlockKind, string> = {
  signal: 'Write event', capacity: 'Capacity', prior: 'Prior', permission: 'Permission', commitment: 'Commitment', timer: 'Timer', verification: 'Verification', adaptation: 'Adaptation',
}

export function HorizonStudio({ navigate }: { navigate: (path: string) => void }) {
  const [blocks, setBlocks] = useState(INITIAL_BLOCKS)
  const [edges, setEdges] = useState(EDGES)
  const [selectedId, setSelectedId] = useState('institution')
  const [running, setRunning] = useState(false)
  const [simulationStep, setSimulationStep] = useState(-1)
  const [horizonName, setHorizonName] = useState('AI infrastructure sovereignty')
  const [jurisdiction, setJurisdiction] = useState('Country 1')
  const selected = blocks.find((block) => block.id === selectedId) ?? blocks[0]
  const enabled = blocks.filter((block) => block.enabled)

  const compiled = useMemo(() => ({
    object_type: 'programmable_horizon',
    horizon_id: horizonName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    jurisdiction,
    version: 1,
    state: running ? 'simulating' : 'draft',
    start: 'on:evidence.accepted',
    writes: enabled.map(({ id, kind, owner, offset, binding, reversible }) => ({ id, register: kind, writer: owner, activates_after_days: offset, binding, reversible })),
    transitions: edges.filter((edge) => enabled.some((b) => b.id === edge.from) && enabled.some((b) => b.id === edge.to)),
    governance: { source_of_truth: 'bitemporal evidence ledger', terminal_authority: 'named human reviewer' },
  }), [edges, enabled, horizonName, jurisdiction, running])

  useEffect(() => {
    if (!running) { setSimulationStep(-1); return }
    setSimulationStep(0)
    const timer = window.setInterval(() => {
      setSimulationStep((step) => {
        if (step >= enabled.length - 1) { window.clearInterval(timer); setRunning(false); return step }
        return step + 1
      })
    }, 650)
    return () => window.clearInterval(timer)
  }, [running, enabled.length])

  const update = (id: string, change: Partial<HorizonBlock>) => {
    setBlocks((current) => current.map((block) => block.id === id ? { ...block, ...change } : block))
  }

  const beginDrag = (event: ReactPointerEvent<HTMLButtonElement>, block: HorizonBlock) => {
    if ((event.target as HTMLElement).closest('.horizon-node__toggle')) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const startX = event.clientX
    const startY = event.clientY
    const originX = block.x
    const originY = block.y
    const move = (moveEvent: PointerEvent) => update(block.id, {
      x: Math.max(12, Math.min(850, originX + moveEvent.clientX - startX)),
      y: Math.max(20, Math.min(390, originY + moveEvent.clientY - startY)),
    })
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
  }

  const point = (id: string, side: 'in' | 'out') => {
    const block = blocks.find((candidate) => candidate.id === id)!
    return { x: block.x + (side === 'out' ? 218 : 0), y: block.y + 65 }
  }

  const addWrite = (kind: BlockKind) => {
    const id = `${kind}-${Date.now()}`
    const block: HorizonBlock = { id, kind, title: `New ${KIND_LABEL[kind]} write`, detail: 'Define the observable change this write should produce.', owner: 'Unassigned writer', offset: 0, binding: 'advisory', reversible: true, enabled: true, x: 420, y: 190 }
    setBlocks((current) => [...current, block])
    setEdges((current) => [...current, { from: selected.id, to: id, condition: 'then' }])
    setSelectedId(id)
  }

  const removeSelected = () => {
    if (blocks.length <= 1) return
    setBlocks((current) => current.filter((block) => block.id !== selected.id))
    setEdges((current) => current.filter((edge) => edge.from !== selected.id && edge.to !== selected.id))
    setSelectedId(blocks.find((block) => block.id !== selected.id)?.id ?? '')
  }

  return (
    <div className="horizon-page">
      <ProductNav active="/horizon" navigate={navigate} />
      <header className="horizon-head">
        <div className="eyebrow">Horizon Studio · Programmable future object</div>
        <h1>Program what<br />becomes possible<span>.</span></h1>
        <p>A Horizon is a versioned object composed of capital, compute, talent, culture, institutions, permissions and time. Human and AI agents can execute writes; neither is the Horizon alone.</p>
        <div className="horizon-head__status"><i className={running ? 'is-running' : ''} /><span>{running ? 'Simulation running' : 'Draft · locally editable'}</span></div>
      </header>

      <main className="horizon-workbench">
        <section className="horizon-canvas" aria-label="Programmable horizon workflow">
          <div className="horizon-canvas__bar">
            <span>{horizonName} · v1</span>
            <span>{enabled.length} active writes · {edges.length} transitions</span>
          </div>
          <div className="horizon-palette" aria-label="Add Horizon register">
            <span>Add write</span>
            {(['capacity', 'prior', 'permission', 'commitment', 'timer', 'verification'] as BlockKind[]).map((kind) => <button key={kind} onClick={() => addWrite(kind)}>+ {KIND_LABEL[kind]}</button>)}
          </div>
          <div className="horizon-grid">
            <svg className="horizon-edges" aria-hidden="true">
              <defs><marker id="horizon-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 z" /></marker></defs>
              {edges.filter((edge) => blocks.some((block) => block.id === edge.from) && blocks.some((block) => block.id === edge.to)).map((edge) => {
                const from = point(edge.from, 'out')
                const to = point(edge.to, 'in')
                const mid = (from.x + to.x) / 2
                return <path key={`${edge.from}-${edge.to}`} d={`M ${from.x} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${to.x} ${to.y}`} markerEnd="url(#horizon-arrow)" />
              })}
            </svg>
            {blocks.map((block, index) => (
              <button
                key={block.id}
                className={`horizon-node horizon-node--${block.kind}${selectedId === block.id ? ' is-selected' : ''}${block.enabled ? '' : ' is-disabled'}${running && enabled.findIndex((item) => item.id === block.id) === simulationStep ? ' is-executing' : ''}${!running && simulationStep >= 0 && enabled.findIndex((item) => item.id === block.id) <= simulationStep ? ' is-complete' : ''}`}
                style={{ left: block.x, top: block.y }}
                onClick={() => setSelectedId(block.id)}
                onPointerDown={(event) => beginDrag(event, block)}
              >
                <span className="horizon-node__top"><b>{String(index + 1).padStart(2, '0')} · {KIND_LABEL[block.kind]}</b><em>+{block.offset}d</em></span>
                <strong>{block.title}</strong>
                <span className="horizon-node__owner">{block.owner}</span>
                <span className="horizon-node__port horizon-node__port--in" /><span className="horizon-node__port horizon-node__port--out" />
              </button>
            ))}
            <div className="horizon-canvas__hint">Drag blocks · select to program</div>
          </div>
        </section>

        <aside className="horizon-inspector">
          <div className="horizon-inspector__title"><span>Object inspector</span><b>{selected.id}</b></div>
          <div className="horizon-object-fields">
            <label>Horizon name<input value={horizonName} onChange={(event) => setHorizonName(event.target.value)} /></label>
            <label>Target jurisdiction<input value={jurisdiction} onChange={(event) => setJurisdiction(event.target.value)} /></label>
          </div>
          <label>Block name<input value={selected.title} onChange={(event) => update(selected.id, { title: event.target.value })} /></label>
          <label>Named writer<input value={selected.owner} onChange={(event) => update(selected.id, { owner: event.target.value })} /></label>
          <label>Execute after (days)<input type="number" min="0" value={selected.offset} onChange={(event) => update(selected.id, { offset: Number(event.target.value) })} /></label>
          <label>Binding strength<select value={selected.binding} onChange={(event) => update(selected.id, { binding: event.target.value as HorizonBlock['binding'] })}><option>advisory</option><option>budgeted</option><option>contractual</option><option>regulatory</option></select></label>
          <label>Instruction<textarea rows={4} value={selected.detail} onChange={(event) => update(selected.id, { detail: event.target.value })} /></label>
          <label className="horizon-switch"><span>Reversible by successor?</span><input type="checkbox" checked={selected.reversible} onChange={(event) => update(selected.id, { reversible: event.target.checked })} /></label>
          <label className="horizon-switch"><span>Include in compiled horizon</span><input type="checkbox" checked={selected.enabled} onChange={(event) => update(selected.id, { enabled: event.target.checked })} /></label>
          <div className="horizon-guardrail"><b>Governance boundary</b><p>Automation may propose a new method. Only a named human reviewer can make it effective.</p></div>
          <button className="horizon-delete" onClick={removeSelected}>Remove selected write</button>
        </aside>

        <section className="horizon-compile">
          <div><span>Compiled horizon object</span><b>{running ? 'LIVE PREVIEW' : 'JSON PREVIEW'}</b></div>
          <pre>{JSON.stringify(compiled, null, 2)}</pre>
        </section>
      </main>

      <footer className="horizon-runbar">
        <div><span>Trigger</span><strong>evidence.accepted</strong></div>
        <div><span>Terminal condition</span><strong>human_review.recorded</strong></div>
        <button onClick={() => setRunning((value) => !value)}>{running ? 'Stop simulation' : 'Simulate horizon →'}</button>
      </footer>
    </div>
  )
}
