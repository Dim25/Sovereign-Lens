import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { createFixtureSource } from '../data/adapter'
import fixtureJson from '../data/uae-us-ai-infrastructure.fixture.json'
import type { CaseFixture } from '../types'

const fixture = fixtureJson as unknown as CaseFixture
const renderApp = () => {
  const user = userEvent.setup()
  render(<App source={createFixtureSource(fixture)} />)
  return user
}

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
