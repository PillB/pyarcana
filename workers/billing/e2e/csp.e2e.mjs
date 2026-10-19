// Chromium check of the per-page CSP (round of 19 Oct 2026, item 4; S1 to S3), on the real local
// stack: wrangler dev serves out/_headers through Cloudflare's own asset worker (workers-shared),
// the code that applies the rules on pyarcana.dev. For every built page:
//   1. exactly one Content-Security-Policy header (the "! Content-Security-Policy" detach worked;
//      two policies would arrive comma-joined), with sha256 hashes and no 'unsafe-inline' in
//      script-src, base-uri 'none', and no fonts.googleapis.com;
//   2. the page loads in Chromium with no CSP violation (securitypolicyviolation events and console),
//      signed out, and /admin and /qa signed in as the seeded admin (they render user text);
//   3. a missing path gets the 404 page under the /* policy, also without violations.
import { chromium } from 'playwright'
import { launchOptions } from './sandbox-trust.mjs'
import { readFileSync, readdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:8787'
const OUT = process.env.E2E_OUT || new URL('../../../out/', import.meta.url).pathname
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

const pages = readdirSync(OUT).filter((f) => f.endsWith('.html') && f !== '404.html' && f !== '_not-found.html')
  .map((f) => (f === 'index.html' ? '/' : `/${f.replace(/\.html$/, '')}`))

// 1. The headers, as the asset worker sends them.
const policies = {}
for (const path of [...pages, ...pages.filter((p) => p !== '/').map((p) => `${p}/`)]) {
  const r = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  const csp = r.headers.get('content-security-policy') ?? ''
  const script = csp.split('; ').find((d) => d.startsWith('script-src ')) ?? ''
  const one = csp !== '' && !csp.includes(', ')
  const ok = one && /'sha256-/.test(script) && !/'unsafe-inline'/.test(script) && /base-uri 'none'/.test(csp) && !/fonts\.googleapis/.test(csp)
  if (!path.endsWith('/') || path === '/') policies[path] = csp
  if (!ok) record(`${path}: one hashed policy, no 'unsafe-inline' in script-src, base-uri 'none'`, false, `status=${r.status} one=${one} ${script.slice(0, 160)}`)
}
const headerFailures = results.filter((r) => !r.ok).length
record(`every page path answers one hashed policy (${pages.length} pages, with and without the trailing slash)`, headerFailures === 0)
const missing = await fetch(`${BASE}/no-such-page-${Date.now()}`)
const nfCsp = missing.headers.get('content-security-policy') ?? ''
record('a missing path: 404 with the /* policy (404.html\'s hashes), one header', missing.status === 404 && /'sha256-/.test(nfCsp) && !nfCsp.includes(', '), `status=${missing.status}`)

// 2. Chromium: no violation anywhere.
const browser = await chromium.launch(launchOptions())
async function violations(ctx, path) {
  const page = await ctx.newPage()
  const seen = []
  page.on('console', (m) => { if (/Content Security Policy|Content-Security-Policy/i.test(m.text())) seen.push(m.text()) })
  await page.addInitScript(() => {
    window.__csp = []
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.violatedDirective} ${e.blockedURI}`))
  })
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const events = await page.evaluate(() => window.__csp ?? [])
  await page.close()
  return [...seen, ...events]
}
try {
  const anon = await browser.newContext({ locale: 'es-PE' })
  await anon.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  const bad = []
  for (const path of [...pages, `/no-such-page-${Date.now()}`]) {
    const v = await violations(anon, path)
    if (v.length) bad.push(`${path}: ${v[0]}`)
  }
  record(`signed out: no CSP violation on any page or on the 404 (${pages.length + 1} loads)`, bad.length === 0, bad.join(' | '))
  await anon.close()
  const admin = await browser.newContext({ locale: 'es-PE' })
  await admin.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  await admin.addCookies([{ name: '__Host-pa_session', value: tokens.admin.token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
  for (const path of ['/admin', '/qa', '/cuenta']) {
    const v = await violations(admin, path)
    record(`signed in as admin: ${path} loads with no CSP violation`, v.length === 0, v.join(' | '))
  }
  await admin.close()
} catch (e) {
  record('csp suite', false, `threw: ${e.message.split('\n')[0]}`)
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\ncsp: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
