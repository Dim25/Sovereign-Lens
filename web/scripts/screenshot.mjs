/**
 * Capture the presentation states at 1440x900 — the projector target.
 * Usage: npm run build && npm run shot
 */
import { chromium } from 'playwright'
import { createServer } from 'vite'
import { mkdir } from 'node:fs/promises'

const OUT = new URL('../docs/', import.meta.url).pathname

const SHOTS = [
  { file: 'home.png', route: '/' },
  { file: 'executive-brief.png', route: '/brief' },
  { file: 't0-commitment.png', route: '/cases/uae-us-ai-infrastructure', stop: 'Set as_of to 2025-05-28' },
  { file: 't1-resolution.png', route: '/cases/uae-us-ai-infrastructure', advance: true },
  { file: 'evidence-drawer.png', route: '/cases/uae-us-ai-infrastructure', advance: true, cite: 'campus_capacity_reported_operational' },
]

const server = await createServer({ server: { port: 5199, strictPort: true }, logLevel: 'error' })
await server.listen()
const base = `http://localhost:5199`

await mkdir(OUT, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 })

for (const shot of SHOTS) {
  await page.goto(base + shot.route, { waitUntil: 'networkidle' })
  if (shot.stop) await page.getByRole('button', { name: shot.stop }).click()
  if (shot.advance) await page.getByRole('button', { name: /advance 13 months/i }).click()
  if (shot.cite) await page.getByTestId(`fact-${shot.cite}`).getByRole('button', { name: /evidence/i }).click()
  await page.waitForTimeout(200)
  await page.screenshot({ path: OUT + shot.file })
  console.log('wrote', shot.file)
}

await browser.close()
await server.close()
