import { useEffect, useState } from 'react'
import { Masthead } from './components/Masthead'
import { GraphPanel } from './components/GraphPanel'
import { FactsPanel } from './components/FactsPanel'
import { PerspectivePanel } from './components/PerspectivePanel'
import { DisagreementPanel } from './components/DisagreementPanel'
import { LedgerPanel } from './components/LedgerPanel'
import { CalibrationPanel } from './components/CalibrationPanel'
import { MethodologyPanel } from './components/MethodologyPanel'
import { DisclosurePanel } from './components/DisclosurePanel'
import { TimeScrubber } from './components/TimeScrubber'
import { EvidenceDrawer, type EvidenceSelection } from './components/EvidenceDrawer'
import { useCase } from './state/useCase'
import type { DataSource, SourceId } from './types'
import { HomePage } from './pages/HomePage'
import { ExecutiveBrief } from './pages/ExecutiveBrief'
import { ProductNav } from './components/ProductNav'
import { CasesPage } from './pages/CasesPage'
import { BuildPartnersPage } from './pages/BuildPartnersPage'
import { HorizonStudio } from './pages/HorizonStudio'
import { OptionSpaceCase } from './pages/OptionSpaceCase'
import { BuildDayPage } from './pages/BuildDayPage'
import { DemoPage } from './pages/DemoPage'
import { DemoOneMinutePage } from './pages/DemoOneMinutePage'
import { DemoTwoMinutePage } from './pages/DemoTwoMinutePage'
import { MachinePage } from './pages/MachinePage'
import { emitIntegrationEvent } from './integrations/events'

/**
 * Every route below matches an exact string, so a shared link carrying a
 * trailing slash — `/v2/` rather than `/v2` — missed all of them and fell
 * through to the dossier. The host serves 200 for any path (SPA fallback),
 * so the failure was invisible to a status check and only showed up in what
 * rendered. Normalise once, here, rather than per route.
 */
const normalise = (raw: string) => (raw.length > 1 ? raw.replace(/\/+$/, '') : raw)

export function App({ source, caseSources }: { source: DataSource; caseSources?: Record<string, DataSource> }) {
  const [path, setPath] = useState(() => normalise(window.location.pathname))

  useEffect(() => {
    const onPop = () => setPath(normalise(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  const navigate = (next: string) => {
    window.history.pushState({}, '', next)
    setPath(normalise(next))
  }

  if (path === '/') return <HomePage source={source} navigate={navigate} />
  if (path === '/brief') return <ExecutiveBrief source={source} navigate={navigate} />
  const sources = caseSources ?? { 'uae-us-ai-infrastructure': source }
  if (path === '/cases') return <CasesPage sources={sources} navigate={navigate} />
  if (path === '/build') return <BuildPartnersPage navigate={navigate} />
  if (path === '/build-day') return <BuildDayPage navigate={navigate} />
  if (path === '/demo') return <DemoPage navigate={navigate} />
  if (path === '/demo1min') return <DemoOneMinutePage navigate={navigate} />
  if (path === '/demo2min') return <DemoTwoMinutePage navigate={navigate} />
  if (path === '/v2' || path === '/v2c') {
    // Two front doors onto the same machine. /v2 runs the real record — its
    // evidence is real, which matters more on first view than its dates being
    // recent. /v2c runs the illustrative one, whose horizon resolves today.
    // ?case=<slug> still selects any registered case.
    const all = caseSources ?? { 'uae-us-ai-infrastructure': source }
    const pick = path === '/v2c'
      ? 'synthetic-procurement-optionality'
      : new URLSearchParams(window.location.search).get('case')
    return <MachinePage source={(pick && all[pick]) || source} navigate={navigate} />
  }
  if (path === '/horizon') return <HorizonStudio navigate={navigate} />
  if (path === '/cases/multi-alignment-option-space') return <OptionSpaceCase navigate={navigate} />
  if (path.startsWith('/build/')) return <BuildPartnersPage navigate={navigate} slug={path.slice('/build/'.length).replace(/\/$/, '')} />
  const slug = path.startsWith('/cases/') ? path.slice('/cases/'.length).replace(/\/$/, '') : ''
  return <Dossier source={sources[slug] ?? source} navigate={navigate} activePath={path} />
}

function Dossier({ source, navigate, activePath }: { source: DataSource; navigate: (path: string) => void; activePath: string }) {
  const view = useCase(source)
  const [evidence, setEvidence] = useState<EvidenceSelection | null>(null)

  const cite = (claim: string, label: string, sourceIds: SourceId[]) => {
    emitIntegrationEvent('sl_evidence_opened', { case_id: view.meta.case_id, source_count: String(sourceIds.length) })
    setEvidence({ claim, label, sourceIds })
  }

  const atT1 = view.asOf >= view.meta.t1
  const beforeT0 = view.asOf < view.meta.t0
  const start = new Date(`${view.meta.t0}T00:00:00Z`)
  const end = new Date(`${view.meta.t1}T00:00:00Z`)
  const horizonMonths = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  const advanceLabel = beforeT0
    ? `Set T0 · ${view.meta.t0}`
    : atT1
      ? 'Rewind to T0'
      : `Advance ${horizonMonths} months ▸`

  return (
    <div className="shell">
      <ProductNav active={activePath} navigate={navigate} />
      <Masthead
        meta={view.meta}
        snapshot={view.snapshot}
        methodologyVersion={view.methodologyVersion}
      />

      <div className="main">
        <div className="column-left">
          <GraphPanel
            snapshot={view.snapshot}
            onSelectNode={(node) =>
              cite(node.name, `${node.kind} · ${node.node_type.replace(/_/g, ' ')}`, node.source_ids)
            }
          />
          <FactsPanel
            snapshot={view.snapshot}
            onCite={(fact) =>
              cite(`${fact.subject}: ${fact.object}`, `Fact · ${fact.id}`, [fact.source_id])
            }
          />
          <DisclosurePanel items={view.meta.disclosure} />
        </div>

        <div className="column-right">
          <PerspectivePanel assessments={view.assessments} onCite={cite} />
          <DisagreementPanel axes={view.disagreements} />
          <LedgerPanel predictions={view.predictions} onCite={cite} />
          <div className="row-split">
            <CalibrationPanel calibration={view.calibration} />
            <MethodologyPanel lessons={view.lessons} />
          </div>
        </div>
      </div>

      <TimeScrubber
        stops={view.stops}
        asOf={view.asOf}
        onScrub={view.setAsOf}
        onAdvance={() => view.setAsOf(beforeT0 || atT1 ? view.meta.t0 : view.meta.t1)}
        advanceLabel={advanceLabel}
        canAdvance
      />

      {view.meta.case_id.replaceAll('_', '-') === 'uae-us-ai-infrastructure' ? (
        <details className="case-films">
          <summary>Watch case workflow · 2 cuts</summary>
          <div className="case-films__body">
            <article>
              <div><span>Primary · 35s</span><strong>Evidence → calibration</strong></div>
              <video controls playsInline preload="metadata" poster="/media/uae-evidence-loop-poster.jpg" aria-label="UAE case evidence-to-calibration walkthrough">
                <source src="/media/uae-evidence-loop-35s.mp4" type="video/mp4" />
              </video>
            </article>
            <article>
              <div><span>Alternate · 30s</span><strong>Executive-first cut</strong></div>
              <video controls playsInline preload="metadata" aria-label="UAE case executive-first walkthrough">
                <source src="/media/uae-executive-cut-30s.mp4" type="video/mp4" />
              </video>
            </article>
          </div>
        </details>
      ) : null}

      {evidence ? (
        <EvidenceDrawer
          selection={evidence}
          sources={view.sources}
          facts={[...view.snapshot.exposed, ...view.snapshot.superseded]}
          onClose={() => setEvidence(null)}
        />
      ) : null}
    </div>
  )
}
