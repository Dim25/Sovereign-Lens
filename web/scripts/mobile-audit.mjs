/**
 * Audit every route at real phone viewports.
 * Reports horizontal overflow, the elements causing it, and undersized tap targets.
 * Usage: node scripts/mobile-audit.mjs [--shots]
 */
import { chromium, devices } from 'playwright'
import { createServer } from 'vite'
import { mkdir } from 'node:fs/promises'

const ROUTES = ['/', '/brief', '/cases', '/cases/uae-us-ai-infrastructure', '/build', '/build-day',
  '/horizon', '/cases/multi-alignment-option-space', '/demo1min', '/demo', '/demo2min']
const VIEWPORTS = [
  { name: 'iphone-se', width: 320, height: 568 },
  { name: 'android-sm', width: 360, height: 800 },
  { name: 'iphone-13', width: 390, height: 844 },
  { name: 'pixel-7', width: 412, height: 915 },
  { name: 'iphone-pm', width: 430, height: 932 },
]
const SHOTS = process.argv.includes('--shots')
const OUT = new URL('../docs/mobile/', import.meta.url).pathname

const server = await createServer({ server: { port: 5177, strictPort: true }, logLevel: 'error' })
await server.listen()
const base = 'http://localhost:5177'
if (SHOTS) await mkdir(OUT, { recursive: true })

const browser = await chromium.launch()
let failures = 0

for (const vp of VIEWPORTS) {
  const ctx = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2, isMobile: true, hasTouch: true,
    userAgent: devices['iPhone 13'].userAgent,
  })
  for (const route of ROUTES) {
    const page = await ctx.newPage()
    await page.goto(base + route, { waitUntil: 'networkidle' })
    await page.waitForTimeout(250)

    const report = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth
      const doc = document.scrollingElement

      // `body { overflow-x: hidden }` is a guard against sideways scrolling, but it
      // also clamps scrollWidth — so measuring through it reports zero overflow on a
      // layout that is genuinely clipping content. Lift the guard, measure the real
      // extent, then put it back. `guarded` is what the user can scroll; `overflow`
      // is what actually sticks out. Fail on the second.
      const guarded = Math.round(doc.scrollWidth - vw)
      const unguard = document.createElement('style')
      unguard.textContent = 'html,body{overflow-x:visible !important}'
      document.head.appendChild(unguard)
      const overflow = Math.round(doc.scrollWidth - vw)
      unguard.remove()

      // An element only counts as an offender if no ancestor scrolls horizontally
      // on purpose. Deliberate scroll strips (wide tables) are fine.
      const inScroller = (el) => {
        for (let p = el.parentElement; p; p = p.parentElement) {
          const ov = getComputedStyle(p).overflowX
          if (ov === 'auto' || ov === 'scroll') return true
        }
        return false
      }
      const offenders = []
      for (const el of document.body.querySelectorAll('*')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (r.right > vw + 1 && !inScroller(el)) {
          offenders.push({
            el,
            sel: el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
              ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : ''),
            right: Math.round(r.right), w: Math.round(r.width),
          })
        }
      }
      // Keep only the outermost offenders — children inherit their parent's overflow.
      const offending = new Set(offenders.map((o) => o.el))
      const trimmed = offenders
        .filter((o) => {
          for (let p = o.el.parentElement; p; p = p.parentElement) if (offending.has(p)) return false
          return true
        })
        .slice(0, 6)
        .map(({ sel, right, w }) => ({ sel, right, w }))

      // 44px is the stated goal. The threshold used to be 40, which silently
      // blessed a 38px rule as passing — so it is set to the goal, and anything
      // legitimately exempt is named here rather than accommodated by lowering it.
      const TAP_MIN = 44
      // Diagram elements are content, not chrome; forcing them to 44px would change
      // geometry that is carrying meaning. Exempt by selector so every exemption is
      // visible and reviewable rather than absorbed by a lower threshold.
      const EXEMPT = [
        '.graph-viewport g', '.graph-viewport [role="button"]',
        '.strategy-map g', '.strategy-map__route',
      ]

      // WCAG 2.5.8 exempts a link inside a sentence: it is sized by the line box,
      // and forcing it to 44px would break the paragraph it lives in. Applies only
      // to genuinely inline links flowed among text, not block links styled as one.
      const isInlineInProse = (el) => {
        if (el.tagName !== 'A' || !getComputedStyle(el).display.startsWith('inline')) return false
        const prose = el.closest('p, li, blockquote, small, dd')
        if (!prose) return false
        return [...prose.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 0)
      }

      const small = []
      for (const el of document.querySelectorAll('a, button, [role="button"], input, select, summary')) {
        const r = el.getBoundingClientRect()
        if (r.width === 0 || r.height === 0) continue
        if (r.height >= TAP_MIN) continue
        if (EXEMPT.some((sel) => el.matches(sel))) continue
        if (isInlineInProse(el)) continue
        // A control wrapped in (or bound to) a label is tapped via that label, so
        // the label's box is the real target. Measure what the finger can hit.
        const label = el.closest('label') ||
          (el.id ? document.querySelector(`label[for="${CSS.escape(el.id)}"]`) : null)
        if (label && label.getBoundingClientRect().height >= TAP_MIN) continue
        small.push({
          sel: el.tagName.toLowerCase() + (typeof el.className === 'string' && el.className
            ? '.' + el.className.trim().split(/\s+/)[0] : ''),
          h: Math.round(r.height), text: (el.textContent || '').trim().slice(0, 22),
        })
      }
      const tinyText = [...document.querySelectorAll('p, li, td, dd')]
        .filter((el) => parseFloat(getComputedStyle(el).fontSize) < 12 && el.textContent.trim().length > 40)
        .length
      return { overflow, guarded, layoutWidth: vw, offenders: trimmed, small: small.slice(0, 8), smallCount: small.length, tinyText }
    })

    const pinned = report.layoutWidth > vp.width + 1
    const bad = report.overflow > 1 || pinned || report.smallCount > 0
    if (bad) failures++
    const tag = pinned ? 'PINNED  ' : report.overflow > 1 ? 'OVERFLOW' : bad ? 'TAPS    ' : 'ok      '
    const masked = report.overflow > 1 && report.guarded <= 1 ? ' (hidden by the overflow-x guard)' : ''
    console.log(`${tag} ${vp.name.padEnd(10)} ${route.padEnd(38)} +${report.overflow}px${masked}  taps<44px:${report.smallCount}  tiny-text:${report.tinyText}`)
    if (bad) for (const o of report.offenders) console.log(`           └─ ${o.sel} (w=${o.w}, right=${o.right})`)
    for (const s of report.small.slice(0, 4)) console.log(`           · tap ${s.sel} h=${s.h} "${s.text}"`)

    if (SHOTS && vp.name === 'iphone-13') {
      await page.screenshot({ path: `${OUT}${route.replace(/\W+/g, '_') || 'home'}.png`, fullPage: true })
    }
    await page.close()
  }
  await ctx.close()
}

await browser.close()
await server.close()
console.log(failures
  ? `\n${failures} route/viewport combinations fail (horizontal overflow or sub-44px tap targets).`
  : `\nNo horizontal overflow across ${ROUTES.length} routes x ${VIEWPORTS.length} viewports.`)
// Exit non-zero on failure. Previously this always exited 0, so the audit could
// report a broken layout and still pass anything that checked its status.
process.exit(failures ? 1 : 0)
