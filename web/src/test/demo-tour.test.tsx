import { describe, expect, it } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { App } from '../App'
import { createFixtureSource } from '../data/adapter'
import fixtureJson from '../data/uae-us-ai-infrastructure.fixture.json'
import syntheticFixture from '../data/synthetic-procurement-optionality.fixture.json'
import type { CaseFixture } from '../types'

const fixture = fixtureJson as unknown as CaseFixture

const renderTour = () => {
  window.history.replaceState({}, '', '/demo2min')
  const user = userEvent.setup()
  render(<App source={createFixtureSource(fixture)} />)
  return user
}

// The choreography itself needs a real browser (see scripts/mobile-audit.mjs and
// the tour checks); these cover the parts that can regress silently in a unit
// run: the route resolving, the chapter list staying navigable, and the frame
// being pointed at a real in-app route rather than an external recording.
describe('two-minute tour', () => {
  it('resolves the /demo2min route and states that it runs the live build', () => {
    renderTour()
    expect(screen.getByRole('main', { name: /two-minute product tour/i })).toBeInTheDocument()
    expect(screen.getByText(/live build, not a recording/i)).toBeInTheDocument()
  })

  it('opens on the thesis chapter', () => {
    renderTour()
    expect(screen.getByRole('heading', { name: /sovereignty is not access/i })).toBeInTheDocument()
    expect(screen.getByText('00 · The thesis')).toBeInTheDocument()
  })

  it('drives the real application in a same-origin frame, not an embedded video', () => {
    renderTour()
    const frame = screen.getByTitle('Sovereign Lens application') as HTMLIFrameElement
    expect(frame.tagName).toBe('IFRAME')
    // A relative src is what allows the tour to reach into the app and perform
    // genuine interactions; an absolute or cross-origin src would break that.
    expect(frame.getAttribute('src')).toMatch(/^\//)
  })

  it('lets a viewer jump chapters instead of waiting out the run', async () => {
    const user = renderTour()
    const chapters = screen.getByRole('list', { name: /tour chapters/i })
    const buttons = within(chapters).getAllByRole('button')
    expect(buttons.length).toBeGreaterThanOrEqual(10)

    await user.click(buttons[9])
    expect(screen.getByRole('heading', { name: /horizon studio/i })).toBeInTheDocument()
  })

  it('exposes a pause control, so the tour is not an unstoppable autoplay', async () => {
    const user = renderTour()
    const pause = screen.getByRole('button', { name: /^pause$/i })
    await user.click(pause)
    expect(screen.getByRole('button', { name: /^play$/i })).toBeInTheDocument()
  })
})

// A shared link routinely carries a trailing slash. Every route matches an
// exact string, and the host answers 200 for any path, so this class of break
// is invisible to a status check — only what renders reveals it.
describe('trailing-slash routes', () => {
  const renderAt = (p: string) => {
    window.history.replaceState({}, '', p)
    render(<App source={createFixtureSource(fixture)} />)
  }

  it('serves /v2/ the machine, not the dossier', () => {
    renderAt('/v2/')
    expect(screen.getByRole('heading', { name: /an agent should remember what it predicted/i })).toBeInTheDocument()
  })

  it('serves /demo2min/ the tour', () => {
    renderAt('/demo2min/')
    expect(screen.getByRole('main', { name: /two-minute product tour/i })).toBeInTheDocument()
  })

  it('serves /brief/ the executive brief', () => {
    renderAt('/brief/')
    expect(document.querySelector('.executive-page')).toBeTruthy()
  })

  it('leaves the root alone', () => {
    renderAt('/')
    expect(screen.getByText('SovereignLens.ai')).toBeInTheDocument()
  })
})

// A synthetic record must not borrow the real case's credibility. The claim
// "these are publication dates of real sources" is true of the UAE record and
// false of the illustrative one; asserting both directions keeps it that way.
describe('synthetic case labelling', () => {
  it('claims real source dates on the real case', () => {
    window.history.replaceState({}, '', '/v2')
    render(<App source={createFixtureSource(fixture)} />)
    expect(screen.getByText(/publication dates of the underlying sources/i)).toBeInTheDocument()
    expect(screen.queryByText(/never cite them/i)).not.toBeInTheDocument()
  })
})

// Two front doors onto the same machine, each pinned to its own record.
describe('the two machine routes', () => {
  const at = (p: string) => {
    window.history.replaceState({}, '', p)
    render(<App source={createFixtureSource(fixture)} caseSources={{
      'uae-us-ai-infrastructure': createFixtureSource(fixture),
      'synthetic-procurement-optionality': createFixtureSource(syntheticFixture as unknown as CaseFixture),
    }} />)
  }

  it('/v2 runs the real record and offers the today-resolving one', () => {
    at('/v2')
    expect(screen.getByText(/publication dates of the underlying sources/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /resolves today/i })).toBeInTheDocument()
  })

  it('/v2c runs the synthetic record and offers the real one', () => {
    at('/v2c')
    expect(screen.getByText(/never cite them/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /run it on the real case/i })).toBeInTheDocument()
  })

  it('/v2c/ resolves the same as /v2c', () => {
    at('/v2c/')
    expect(screen.getByText(/never cite them/i)).toBeInTheDocument()
  })
})

// /v2/today says what it is; /v2c is the short alias for the same record.
describe('the today alias', () => {
  const at = (p: string) => {
    window.history.replaceState({}, '', p)
    render(<App source={createFixtureSource(fixture)} caseSources={{
      'uae-us-ai-infrastructure': createFixtureSource(fixture),
      'synthetic-procurement-optionality': createFixtureSource(syntheticFixture as unknown as CaseFixture),
    }} />)
  }

  it.each(['/v2/today', '/v2/today/'])('%s runs the today-resolving record', (path) => {
    at(path)
    expect(screen.getByText(/never cite them/i)).toBeInTheDocument()
  })

  it('does not shadow the real record at /v2', () => {
    at('/v2')
    expect(screen.getByText(/publication dates of the underlying sources/i)).toBeInTheDocument()
  })
})
