import { useState } from 'react'
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

export function App({ source }: { source: DataSource }) {
  const view = useCase(source)
  const [evidence, setEvidence] = useState<EvidenceSelection | null>(null)

  const cite = (claim: string, label: string, sourceIds: SourceId[]) =>
    setEvidence({ claim, label, sourceIds })

  const atT1 = view.asOf >= view.meta.t1
  const beforeT0 = view.asOf < view.meta.t0
  const advanceLabel = beforeT0
    ? `Set T0 · ${view.meta.t0}`
    : atT1
      ? 'Rewind to T0'
      : 'Advance 13 months ▸'

  return (
    <div className="shell">
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

      {evidence ? (
        <EvidenceDrawer
          selection={evidence}
          sources={view.sources}
          onClose={() => setEvidence(null)}
        />
      ) : null}
    </div>
  )
}
