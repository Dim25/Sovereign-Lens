import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { createFixtureSource } from '../data/adapter'
import fixtureJson from '../data/uae-us-ai-infrastructure.fixture.json'
import chinaFijiJson from '../data/china-fiji-capability.fixture.json'
import africaJson from '../data/africa-ai-governance-capacity.fixture.json'
import type { CaseFixture } from '../types'

const fixture = fixtureJson as unknown as CaseFixture
const renderApp = () => {
  window.history.replaceState({}, '', '/cases/uae-us-ai-infrastructure')
  const user = userEvent.setup()
  render(<App source={createFixtureSource(fixture)} />)
  return user
}

describe('product navigation', () => {
  it('opens with a narrative homepage and links into the executive brief', async () => {
    window.history.replaceState({}, '', '/')
    const user = userEvent.setup()
    render(<App source={createFixtureSource(fixture)} />)
    expect(screen.getByRole('heading', { name: /the horizon already exists/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /open executive brief/i }))
    expect(screen.getByRole('heading', { name: /ai power shifts/i })).toBeInTheDocument()
    expect(screen.getByText(/sovereignty deltas/i)).toBeInTheDocument()
  })
})

describe('case routes', () => {
  const sources = {
    'uae-us-ai-infrastructure': createFixtureSource(fixture),
    'china-fiji-capability': createFixtureSource(chinaFijiJson as unknown as CaseFixture),
    'africa-ai-governance-capacity': createFixtureSource(africaJson as unknown as CaseFixture),
  }

  it('lists all cases and opens the China–Fiji dossier', async () => {
    window.history.replaceState({}, '', '/cases')
    const user = userEvent.setup()
    render(<App source={sources['uae-us-ai-infrastructure']} caseSources={sources} />)
    expect(screen.getByRole('heading', { name: /sovereignty is being written/i })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /sovereign strategy trajectories/i })).toBeInTheDocument()
    expect(screen.getByText('African AI-governance capacity')).toBeInTheDocument()
    await user.click(screen.getAllByRole('button', { name: /china–fiji capability formation/i })[0])
    expect(screen.getByText(/does cooperation build locally retained capability/i)).toBeInTheDocument()
  })

  it('loads the African governance dossier directly', () => {
    window.history.replaceState({}, '', '/cases/africa-ai-governance-capacity')
    render(<App source={sources['uae-us-ai-infrastructure']} caseSources={sources} />)
    expect(screen.getByText(/are african institutions converting external support/i)).toBeInTheDocument()
    expect(screen.getByText(/external funding is recorded as provenance/i)).toBeInTheDocument()
  })
})

describe('build-partner routes', () => {
  it('opens the integration index and the Temporal architecture note', async () => {
    window.history.replaceState({}, '', '/build')
    const user = userEvent.setup()
    render(<App source={createFixtureSource(fixture)} />)
    expect(screen.getByRole('heading', { name: /memory is not the horizon/i })).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /temporal/i }))
    expect(screen.getByRole('heading', { name: /temporal × sovereign lens/i })).toBeInTheDocument()
    expect(screen.getByText(/bitemporal ledger—not temporal event history/i)).toBeInTheDocument()
  })

  it('loads Stash and Coframe notes directly', () => {
    window.history.replaceState({}, '', '/build/stash')
    const { unmount } = render(<App source={createFixtureSource(fixture)} />)
    expect(screen.getByRole('heading', { name: /stash × sovereign lens/i })).toBeInTheDocument()
    expect(screen.getByText(/retrieved recollection is context, never evidence/i)).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /questions that determine adoption/i })).toBeInTheDocument()
    expect(screen.getAllByText(/stale-hit rate/i).length).toBeGreaterThan(0)
    unmount()
    window.history.replaceState({}, '', '/build/coframe')
    render(<App source={createFixtureSource(fixture)} />)
    expect(screen.getByRole('heading', { name: /coframe × sovereign lens/i })).toBeInTheDocument()
  })
})

describe('programmable Horizon Studio', () => {
  it('edits and compiles a sovereign Horizon object', async () => {
    window.history.replaceState({}, '', '/horizon')
    const user = userEvent.setup()
    render(<App source={createFixtureSource(fixture)} />)
    expect(screen.getByRole('heading', { name: /program what becomes possible/i })).toBeInTheDocument()
    expect(screen.getByText(/"object_type": "programmable_horizon"/i)).toBeInTheDocument()
    expect(screen.getByText(/"register": "capacity"/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /\+ permission/i }))
    expect(screen.getByDisplayValue(/new permission write/i)).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /simulate horizon/i }))
    expect(screen.getByText(/simulation running/i)).toBeInTheDocument()
  })
})

const advance = () => screen.getByRole('button', { name: /advance 13 months/i })

describe('presentation shell', () => {
  it('opens at T0 with the snapshot stamped in the masthead', () => {
    renderApp()
    expect(screen.getByTestId('as-of')).toHaveTextContent('2025-05-28')
    expect(screen.getByTestId('digest').textContent).toMatch(/^[0-9a-f]{12}$/)
    expect(screen.getByTestId('methodology-version')).toHaveTextContent('v1')
  })

  it('shows three perspectives against one snapshot', () => {
    renderApp()
    const capability = screen.getByTestId('perspective-capability')
    expect(within(capability).getByText('Capability')).toBeInTheDocument()
    expect(within(capability).getByText('72%')).toBeInTheDocument()
    expect(within(screen.getByTestId('perspective-dependency')).getByText('78%')).toBeInTheDocument()
    expect(within(screen.getByTestId('perspective-evidence_auditor')).getByText('91%')).toBeInTheDocument()
  })

  it('marks at least one axis as material disagreement', () => {
    renderApp()
    expect(screen.getAllByTestId('axis-material').length).toBeGreaterThan(0)
  })

  it('holds the prediction open and reports no calibration at T0', () => {
    renderApp()
    expect(within(screen.getByTestId('prediction')).getByText('open')).toBeInTheDocument()
    expect(screen.queryByTestId('brier')).not.toBeInTheDocument()
    expect(screen.queryByTestId('lesson')).not.toBeInTheDocument()
  })
})

describe('advance thirteen months', () => {
  it('moves to T1, supersedes the old fact and keeps it visible', async () => {
    const user = renderApp()
    await user.click(advance())

    expect(screen.getByTestId('as-of')).toHaveTextContent('2026-07-01')

    const current = screen.getByTestId('fact-campus_capacity_reported_operational')
    expect(current).toHaveTextContent('500 MW reported online in 2026')
    expect(current).toHaveTextContent('Current')

    // The earlier belief is not deleted — it is still on screen, marked superseded.
    const closed = screen.getByTestId('fact-campus_capacity_planned')
    expect(closed).toHaveTextContent('200 MW planned in 2026')
    expect(closed).toHaveTextContent('Superseded')
    expect(closed).toHaveTextContent('valid 2025-05-28 → 2026-07-01')
  })

  it('resolves the prediction, scores it, and advances the methodology version', async () => {
    const user = renderApp()
    await user.click(advance())

    expect(within(screen.getByTestId('prediction')).getByText('resolved')).toBeInTheDocument()
    expect(screen.getByTestId('resolution')).toHaveTextContent(/500 MW online/)
    expect(screen.getByTestId('brier')).toHaveTextContent('0.1225')
    expect(screen.getByTestId('methodology-version')).toHaveTextContent('v2')

    const lesson = screen.getByTestId('lesson')
    expect(within(lesson).getByText('v1')).toBeInTheDocument()
    expect(within(lesson).getByText('v2')).toBeInTheDocument()
    expect(lesson).toHaveTextContent(/independent operational signal/)
  })

  it('changes the snapshot digest when time moves', async () => {
    const user = renderApp()
    const before = screen.getByTestId('digest').textContent
    await user.click(advance())
    expect(screen.getByTestId('digest').textContent).not.toBe(before)
  })

  it('offers a rewind so the demo can be re-run', async () => {
    const user = renderApp()
    await user.click(advance())
    await user.click(screen.getByRole('button', { name: /rewind to t0/i }))
    expect(screen.getByTestId('as-of')).toHaveTextContent('2025-05-28')
    expect(screen.queryByTestId('brier')).not.toBeInTheDocument()
  })
})

describe('evidence drawer', () => {
  const citeFact = (factId: string) =>
    within(screen.getByTestId(`fact-${factId}`)).getByRole('button', { name: /evidence/i })

  it('links a visible fact to its source record and URL', async () => {
    const user = renderApp()
    await user.click(citeFact('campus_capacity_planned'))

    const drawer = screen.getByTestId('evidence-drawer')
    expect(drawer).toHaveTextContent('200 MW planned in 2026')
    expect(within(drawer).getByText(/Al Otaiba/)).toBeInTheDocument()
    expect(within(drawer).getByRole('link')).toHaveAttribute(
      'href',
      'https://www.uae-embassy.org/news/statement-ambassador-yousef-al-otaiba-us-uae-ai-acceleration-partnership',
    )

    await user.click(within(drawer).getByRole('button', { name: /close/i }))
    expect(screen.queryByTestId('evidence-drawer')).not.toBeInTheDocument()
  })

  it('names whose account each source speaks for, not just the document', async () => {
    const user = renderApp()
    await user.click(advance())

    await user.click(citeFact('campus_capacity_reported_operational'))
    expect(within(screen.getByTestId('evidence-drawer')).getByText('Participant government'))
      .toBeInTheDocument()
    await user.click(within(screen.getByTestId('evidence-drawer')).getByRole('button', { name: /close/i }))

    await user.click(citeFact('chip_export_authorized'))
    expect(within(screen.getByTestId('evidence-drawer')).getByText('Regulator')).toBeInTheDocument()
    await user.click(within(screen.getByTestId('evidence-drawer')).getByRole('button', { name: /close/i }))

    await user.click(citeFact('oversight_technology_transfer'))
    expect(within(screen.getByTestId('evidence-drawer')).getByText('Oversight')).toBeInTheDocument()
  })

  it('opens from a graph node', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: 'United Arab Emirates' }))
    expect(screen.getByTestId('evidence-drawer')).toHaveTextContent('United Arab Emirates')
  })

  it('shows every visible claim resting on the same sources, superseded included', async () => {
    const user = renderApp()
    await user.click(advance())
    await user.click(screen.getByRole('button', { name: 'UAE–US AI Campus' }))

    const drawer = screen.getByTestId('evidence-drawer')
    expect(drawer).toHaveTextContent('Also resting on these sources')
    expect(drawer).toHaveTextContent('200 MW planned in 2026 within a proposed 5 GW campus (superseded)')
    expect(drawer).toHaveTextContent('Phase 1 of a planned 5 GW campus')
  })

  it('links an assessment to the evidence it was drawn from', async () => {
    const user = renderApp()
    await user.click(
      within(screen.getByTestId('perspective-dependency')).getByRole('button', { name: /evidence/i }),
    )
    const drawer = screen.getByTestId('evidence-drawer')
    expect(drawer).toHaveTextContent('Dependency · 2025-05-28')
    expect(within(drawer).getAllByRole('link').length).toBe(3)
  })
})

describe('scrubbing', () => {
  it('reaches a pre-assessment date where no perspective exists yet', async () => {
    const user = renderApp()
    await user.click(screen.getByRole('button', { name: /Set as_of to 2024-09-23/i }))
    expect(screen.getByTestId('as-of')).toHaveTextContent('2024-09-23')
    expect(screen.getByText(/No assessment was registered/)).toBeInTheDocument()
    expect(screen.queryByTestId('prediction')).not.toBeInTheDocument()
  })

  it('reveals the export authorisation only from its own date onward', async () => {
    const user = renderApp()
    expect(screen.queryByTestId('fact-chip_export_authorized')).not.toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: /Set as_of to 2025-11-19/i }))
    expect(screen.getByTestId('fact-chip_export_authorized')).toHaveTextContent(
      '35,000 GB300-equivalents',
    )
  })
})
