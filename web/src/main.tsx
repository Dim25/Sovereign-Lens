import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { createFixtureSource } from './data/adapter'
import fixture from './data/uae-us-ai-infrastructure.fixture.json'
import type { CaseFixture } from './types'
import './styles.css'

// Frozen local fixture today. Swap for `await createHttpSource('/api/case')`
// once the core exposes `python3 demo.py --json`; nothing else changes.
const source = createFixtureSource(fixture as unknown as CaseFixture)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App source={source} />
  </StrictMode>,
)
