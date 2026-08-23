/**
 * Regenerate the 1200x630 social preview from the source artwork.
 * Usage: node scripts/make-og-image.mjs   (writes web/public/og-image.png)
 *
 * The artwork is 1491x1055 (1.41:1); the OG slot is 1.91:1. Cropping to fill
 * would slice either the eyebrow line or the domain bar — the clean band
 * between them is 15px shorter than the crop window. So the artwork is fitted
 * flush-left at full height and the remaining width becomes a deliberate panel
 * that blends into the artwork's own dark half, carrying the positioning line.
 */
import { chromium } from 'playwright'
import { readFileSync } from 'node:fs'

const SRC = new URL('../../docs/assets/og-source.png', import.meta.url).pathname
const OUT = new URL('../public/og-image.png', import.meta.url).pathname
const uri = `data:image/png;base64,${readFileSync(SRC).toString('base64')}`

const html = `<style>
  html,body{margin:0;padding:0;background:#0d0d0d;width:1200px;height:630px;overflow:hidden}
  .wrap{position:relative;width:1200px;height:630px;background:#0d0d0d}
  img{position:absolute;left:0;top:0;height:630px;width:auto;display:block}
  .cap{position:absolute;right:0;top:0;bottom:0;width:320px;padding:48px 32px;
    box-sizing:border-box;display:flex;flex-direction:column;justify-content:space-between;
    font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#f4f1ec;background:#0d0d0d}
  .cap b{display:block;font-size:13px;font-weight:800;letter-spacing:.15em;text-transform:uppercase;color:#ffc800}
  .cap p{margin:18px 0 0;font-size:23px;line-height:1.24;letter-spacing:-.015em;font-weight:500}
  .cap small{display:block;font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#9b9488}
</style>
<div class="wrap"><img src="${uri}">
<div class="cap"><div><b>Long-horizon evaluator</b>
<p>Records what changed. Preserves competing interpretations. Returns later to test which survived.</p></div>
<small>Evidence · Disagreement · Calibration</small></div></div>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html)
await page.waitForTimeout(400)
await page.screenshot({ path: OUT })
await browser.close()
console.log('wrote', OUT)
process.exit(0)
