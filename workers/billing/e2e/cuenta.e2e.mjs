// Chromium check of /cuenta's Google button (handback 5 Oct 2026, item 1) on the real local stack.
// /cuenta is both the account page and the Microsoft redirect target. Google's script must load on
// a plain visit, and never during a page view that loaded as a Microsoft callback, even after the
// page has stripped the fragment. The script itself is served by a stub (the sandbox cannot reach
// Google), so the test counts exactly when the page asks for it.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'

const BASE = 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const GIS = 'https://accounts.google.com/gsi/client'
const STUB = `window.google = { accounts: { id: {
  initialize() {},
  renderButton(el) { el.innerHTML = '<div data-gis-stub="1">Continuar con Google</div>' }
} } }`
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', headless: true })
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

async function visit(hash) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  const gisRequests = []
  await ctx.route(GIS, (route) => {
    gisRequests.push(Date.now())
    return route.fulfill({ status: 200, contentType: 'text/javascript', body: STUB })
  })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/cuenta${hash}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const open = page.getByTestId('cuenta-signin')
  if (await open.isVisible().catch(() => false)) await open.click()
  await page.waitForTimeout(2500)
  return { ctx, page, gisRequests }
}

try {
  const plain = await visit('')
  const button = await plain.page.locator('[data-gis-stub]').isVisible().catch(() => false)
  record('plain /cuenta: Google\'s script loads and its button renders', plain.gisRequests.length === 1 && button, `requests=${plain.gisRequests.length} button=${button}`)
  await plain.page.screenshot({ path: `${OUT}cuenta-google-button.png` })
  await plain.ctx.close()

  const cb = await visit('#code=fake-code&state=fake-state')
  const hashAfter = await cb.page.evaluate(() => window.location.hash)
  record('callback load: the fragment is stripped from the address', hashAfter === '', `hash=${hashAfter}`)
  record('callback load: Google\'s script is never requested in that page view, even after the strip', cb.gisRequests.length === 0, `requests=${cb.gisRequests.length}`)
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
console.log(`\ncuenta: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
