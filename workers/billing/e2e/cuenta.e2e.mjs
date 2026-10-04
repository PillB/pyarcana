// Chromium check of /cuenta's Google button (handback 5 Oct 2026, item 1; decision D18) on the real
// local stack, with Google's REAL sign-in script: no stand-in.
// /cuenta is both the account page and the Microsoft redirect target. Google's script must load on
// a plain visit, and never during a page view that loaded as a Microsoft callback, even after the
// page has stripped the fragment. In the cloud sandbox Chromium reaches Google by trusting exactly
// the sandbox proxy's CA (sandbox-trust.mjs). When Google cannot be reached, the real-script checks
// report SKIP with the reason, never PASS.
import { chromium } from 'playwright'
import { sandboxTrustArgs } from './sandbox-trust.mjs'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const GIS = 'https://accounts.google.com/gsi/client'
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', headless: true, args: sandboxTrustArgs() })
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

function skip(name, reason) {
  results.push({ name, ok: true, skipped: true })
  console.log(`SKIP  ${name}  (${reason})`)
}

async function visit(hash) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  await ctx.addInitScript(() => {
    try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {}
    window.__cspViolations = []
    document.addEventListener('securitypolicyviolation', (e) => window.__cspViolations.push(`${e.violatedDirective} ${e.blockedURI}`))
  })
  const google = { script: 0, style: 0, frame: 0, failed: [] }
  const page = await ctx.newPage()
  page.on('request', (r) => {
    const u = r.url()
    if (u.startsWith(GIS)) google.script += 1
    if (u.startsWith('https://accounts.google.com/gsi/style')) google.style += 1
    if (u.startsWith('https://accounts.google.com/gsi/button')) google.frame += 1
  })
  page.on('requestfailed', (r) => { if (r.url().includes('accounts.google.com')) google.failed.push(`${r.url().slice(0, 80)} ${r.failure()?.errorText}`) })
  await page.goto(`${BASE}/cuenta${hash}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const open = page.getByTestId('cuenta-signin')
  if (await open.isVisible().catch(() => false)) await open.click()
  await page.waitForTimeout(5000)
  const csp = await page.evaluate(() => window.__cspViolations)
  return { ctx, page, google, csp }
}

try {
  const plain = await visit('')
  record('plain /cuenta: Google\'s sign-in script is requested (once)', plain.google.script === 1, `requests=${plain.google.script}`)
  if (plain.google.failed.length) {
    skip('plain /cuenta: the real Google button renders under the site\'s CSP', `Google unreachable: ${plain.google.failed[0]}`)
  } else {
    const iframe = await plain.page.locator('iframe[src^="https://accounts.google.com/gsi/button"]').count()
    record('plain /cuenta: the real Google button renders (script, style and button frame load)', plain.google.style >= 1 && plain.google.frame >= 1 && iframe === 1, `style=${plain.google.style} frame=${plain.google.frame} iframe=${iframe}`)
    record('plain /cuenta: no Content-Security-Policy violation', plain.csp.length === 0, plain.csp.join(' | '))
  }
  await plain.page.screenshot({ path: `${OUT}cuenta-google-button.png` })
  await plain.ctx.close()

  const cb = await visit('#code=fake-code&state=fake-state')
  const hashAfter = await cb.page.evaluate(() => window.location.hash)
  record('callback load: the fragment is stripped from the address', hashAfter === '', `hash=${hashAfter}`)
  record('callback load: Google\'s script is never requested in that page view, even after the strip', cb.google.script === 0, `requests=${cb.google.script}`)
  // Proof the button was mounted and declined, so "no request" is not just "no button".
  const declined = await cb.page.getByText('El botón de Google no se carga mientras se completa el acceso con Microsoft').isVisible().catch(() => false)
  record('callback load: the sign-in panel is open and the Google button says why it is not there', declined)
  const scripts = await cb.page.evaluate((src) => [...document.scripts].filter((s) => s.src.startsWith(src)).length, GIS)
  record('callback load: no Google script element on the page', scripts === 0, `scripts=${scripts}`)
  await cb.page.screenshot({ path: `${OUT}cuenta-callback-no-google.png` })
  await cb.ctx.close()
} catch (e) {
  record('cuenta suite', false, `threw: ${e.message.split('\n')[0]}`)
}

await browser.close()
const failed = results.filter((r) => !r.ok)
const skipped = results.filter((r) => r.skipped).length
console.log(`\ncuenta: ${results.length - failed.length - skipped}/${results.length} passed, ${skipped} skipped`)
process.exit(failed.length ? 1 : 0)
