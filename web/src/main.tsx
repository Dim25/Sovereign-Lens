import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import { createFixtureSource } from './data/adapter'
import uaeFixture from './data/uae-us-ai-infrastructure.fixture.json'
import chinaFijiFixture from './data/china-fiji-capability.fixture.json'
import africaFixture from './data/africa-ai-governance-capacity.fixture.json'
import type { CaseFixture } from './types'
import './styles.css'

// Frozen local fixture today. Swap for `await createHttpSource('/api/case')`
// once the core exposes `python3 demo.py --json`; nothing else changes.
const caseSources = {
  'uae-us-ai-infrastructure': createFixtureSource(uaeFixture as unknown as CaseFixture),
  'china-fiji-capability': createFixtureSource(chinaFijiFixture as unknown as CaseFixture),
  'africa-ai-governance-capacity': createFixtureSource(africaFixture as unknown as CaseFixture),
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App source={caseSources['uae-us-ai-infrastructure']} caseSources={caseSources} />
  </StrictMode>,
)
