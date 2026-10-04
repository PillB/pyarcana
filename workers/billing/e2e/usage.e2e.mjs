// Chromium check of the D1 free-tier meter and budget guard (usage.mjs) on the real local stack:
// `wrangler dev --local` (workerd + local D1, the same engine and row counters as production D1)
// with USAGE_FLUSH_SECONDS=0, so every D1 request first writes the previous requests' tally.
//
// 1. Measures rows read and written per action, from the meter's own per-route rows.
// 2. A reload with nothing new uploads nothing.
// 3. Red-day drill: a seeded usage row puts today at 90 % of the write limit; the admin sees the
//    banner and the Uso tab, a learner's change stays in the browser with the "paused" line, and
//    once the row is gone "Sincronizar ahora" sends it.
// 4. Signed out: the sign-in nudge and the one-time storage persistence request.
// 5. security.txt is served from the dot-folder, and /privacy is the new notice.
// 6. D4 P4–P6 under the real CSP: Pyodide runs, eval and other CDN files are refused, two new
//    headers, a slim /v1/health and the admin's configuration list.
// E2E_WORKER_DIR (set by run.sh) is the worker folder whose local D1 is used.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { extname, join } from 'node:path'

const BASE = 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
const WORKER_DIR = process.env.E2E_WORKER_DIR
const WRANGLER = new URL('./node_modules/.bin/wrangler', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', headless: true })
const results = []
const today = new Date().toISOString().slice(0, 10)

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

async function flow(name, fn) {
  try { await fn() } catch (e) { record(name, false, `threw: ${e.message.split('\n')[0]}`) }
}

function d1(sql) {
  execFileSync(WRANGLER, ['d1', 'execute', 'pyarcana-accounts', '--local', '--command', sql], { cwd: WORKER_DIR, stdio: 'pipe' })
}

// A desktop Chrome user agent: the worker refuses events from "HeadlessChrome" as a bot.
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36'

async function contextFor(who) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE', userAgent: UA })
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1'); localStorage.setItem('pyarcana:qaTourCompleted', '1') } catch {} })
  if (who) await ctx.addCookies([{ name: '__Host-pa_session', value: tokens[who].token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
  return ctx
}

async function open(ctx, path) {
  const page = await ctx.newPage()
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  return page
}

const api = (page, method, path, body) => page.evaluate(async ([m, p, b]) => {
  const r = await fetch(`/api${p}`, { method: m, credentials: 'include', headers: { 'content-type': 'application/json', 'x-pyarcana': '1' }, body: b ? JSON.stringify(b) : undefined })
  let j = null
  try { j = await r.json() } catch {}
  return { status: r.status, body: j }
}, [method, path, body])

const admin = await contextFor('admin')
const adminPage = await open(admin, '/cuenta')
const sources = async () => {
  const r = await api(adminPage, 'GET', '/v1/admin/usage')
  return Object.fromEntries((r.body?.sources ?? []).map((s) => [s.source, s]))
}

// 1. Rows per action, as the meter records them (gift account: its documents are synthetic).
const measured = []
await flow('rows per action', async () => {
  const ctx = await contextFor('gift')
  const page = await open(ctx, '/cuenta')
  const doc = { v: 1, state: { completedSections: ['setup', 'python-basics'], completedSubSteps: { setup: ['theory', 'practice'] }, quizScores: { setup: 90 } }, changes: {} }
  const cid = 'ab'.repeat(16)
  const actions = [
    ['first upload (PUT, new row)', 'PUT /v1/me/progress', () => api(page, 'PUT', '/v1/me/progress', { doc, baseRev: 0 })],
    ['upload (PUT, update)', 'PUT /v1/me/progress', () => api(page, 'PUT', '/v1/me/progress', { doc: { ...doc, v: 1, state: { ...doc.state, quizScores: { setup: 95 } } }, baseRev: 1 })],
    ['download (GET progress)', 'GET /v1/me/progress', () => api(page, 'GET', '/v1/me/progress')],
    ['account (GET /v1/me)', 'GET /v1/me', () => api(page, 'GET', '/v1/me')],
    ['one event (POST /v1/events)', 'POST /v1/events', () => api(page, 'POST', '/v1/events', { cid, events: [{ name: 'session_start' }] })],
  ]
  for (const [label, source, act] of actions) {
    const before = (await sources())[source] ?? { rowsRead: 0, rowsWritten: 0 }
    const r = await act()
    const after = (await sources())[source] ?? { rowsRead: 0, rowsWritten: 0 }
    const delta = { rowsRead: after.rowsRead - before.rowsRead, rowsWritten: after.rowsWritten - before.rowsWritten }
    measured.push({ label, status: r.status, ...delta })
    record(`metered: ${label}`, r.status < 300 && delta.rowsRead + delta.rowsWritten > 0, `status=${r.status} read=${delta.rowsRead} written=${delta.rowsWritten}`)
  }
  writeFileSync(new URL('./usage-measured.json', import.meta.url), JSON.stringify(measured, null, 2))
  await ctx.close()
})

// 2. Nothing new, nothing sent: a synced learner reloads and no PUT leaves the browser.
await flow('no upload without a change', async () => {
  const ctx = await contextFor('free')
  const page = await open(ctx, '/#setup')
  const choice = page.getByTestId('sync-owner-choice')
  if (await choice.isVisible().catch(() => false)) await choice.getByRole('button').first().click()
  await page.waitForTimeout(6500)
  const puts = []
  page.on('request', (r) => { if (r.method() === 'PUT' && r.url().includes('/v1/me/progress')) puts.push(r.url()) })
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(8000)
  record('a reload with no new progress uploads nothing', puts.length === 0, `PUTs=${puts.length}`)
  await ctx.close()
})

// 3. Red day.
await flow('red-day drill', async () => {
  d1(`INSERT INTO usage_daily (day, source, rows_read, rows_written, updated_at) VALUES ('${today}', 'drill', 0, 90000, 0)`)
  const panel = await open(admin, '/admin')
  const banner = panel.getByTestId('usage-banner')
  await banner.waitFor({ timeout: 15000 })
  record('admin banner shows red', (await banner.getAttribute('data-level')) === 'red')
  await panel.getByRole('tab', { name: 'Uso' }).click()
  const view = panel.getByTestId('usage-view')
  await view.waitFor({ timeout: 15000 })
  record('Uso tab: level red, routes listed', (await view.getAttribute('data-level')) === 'red' && (await panel.getByTestId('usage-sources').count()) === 1)
  await panel.screenshot({ path: `${OUT}usage-admin-red.png`, fullPage: true })

  const ctx = await contextFor('free')
  const page = await open(ctx, '/#setup')
  const choice = page.getByTestId('sync-owner-choice')
  if (await choice.isVisible().catch(() => false)) await choice.getByRole('button').first().click()
  await page.getByRole('button', { name: /Marcar (teoría|práctica) como leída/ }).first().click()
  await page.waitForTimeout(800)
  await page.goto(`${BASE}/cuenta`, { waitUntil: 'networkidle' })
  await page.getByRole('button', { name: 'Sincronizar ahora' }).click()
  await page.waitForTimeout(2500)
  const line = await page.getByTestId('account-sync-status').textContent()
  record('learner: the change is kept and the line says cloud saving is paused, not offline', /en pausa/.test(line ?? ''), line)
  const local = await page.evaluate(() => localStorage.getItem('python-ds-progress') || '')
  record('learner: the progress is in this browser', /"setup":\[/.test(local), local.slice(0, 100))
  await page.screenshot({ path: `${OUT}usage-learner-deferred.png`, fullPage: true })

  d1(`DELETE FROM usage_daily WHERE source = 'drill'`)
  // At most one forced sync per 10 s (force-sync.ts); the click then asks the server once whether
  // the budget saver's wait still holds, and sends because it no longer does.
  await page.waitForTimeout(10_500)
  await page.getByRole('button', { name: 'Sincronizar ahora' }).click()
  await page.waitForTimeout(2500)
  const after = await page.getByTestId('account-sync-status').textContent()
  const remote = await api(page, 'GET', '/v1/me/progress')
  record('budget back to green: "Sincronizar ahora" sends the kept change', !/en pausa/.test(after ?? '') && /setup/.test(JSON.stringify(remote.body?.doc ?? {})), after)
  await ctx.close()
})

// 4. Signed out with real progress: the notice offers the account copy, "Ahora no" snoozes it, and
//    the browser was asked once to keep the data.
await flow('signed-out nudge', async () => {
  const ctx = await contextFor(null)
  await ctx.addInitScript(() => {
    try {
      if (!localStorage.getItem('python-ds-progress')) {
        localStorage.setItem('python-ds-progress', JSON.stringify({ state: { completedSections: [], completedSubSteps: { setup: ['theory', 'practice', 'quiz'] }, quizScores: {}, lastVisited: null, bookmarks: [], startDate: null }, version: 1 }))
      }
    } catch {}
  })
  const page = await open(ctx, '/')
  const nudge = page.getByTestId('signin-nudge')
  record('nudge shows with 3 completed steps', await nudge.isVisible().catch(() => false), await nudge.textContent().catch(() => ''))
  const persist = await page.evaluate(() => localStorage.getItem('pyarcana:storagePersist:v1'))
  record('the browser was asked once to keep the data, and the answer is remembered', ['granted', 'denied', 'unsupported'].includes(persist ?? ''), persist)
  await page.screenshot({ path: `${OUT}usage-nudge.png`, fullPage: false })
  await page.getByTestId('signin-nudge-dismiss').click()
  await page.reload({ waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  record('"Ahora no" hides it on the next visit', !(await page.getByTestId('signin-nudge').isVisible().catch(() => false)))
  record('the sign-in button stays', await page.getByTestId('storage-signin').isVisible().catch(() => false))
  await ctx.close()
})

// 5. D4 audit: security.txt from Workers Static Assets (a dot-folder), and the prerendered notice.
await flow('security.txt and privacy notice', async () => {
  const r = await fetch(`${BASE}/.well-known/security.txt`)
  const body = await r.text()
  record('/.well-known/security.txt: 200, text/plain, Contact and Expires', r.status === 200 && /^text\/plain/.test(r.headers.get('content-type') ?? '') && /^Contact: mailto:security@/m.test(body) && /^Expires: \d{4}-/m.test(body), `status=${r.status} type=${r.headers.get('content-type')}`)
  const html = await (await fetch(`${BASE}/privacy`)).text()
  // React separates text nodes with <!-- --> markers; drop them before reading the words.
  const text = html.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<!--[\s\S]*?-->/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ')
  record('/privacy without JavaScript: the real stack, RNPD and 48 h, nothing from Firebase', /Cloudflare/.test(text) && /RNPD/.test(text) && /48 horas/.test(text) && !/Firebase|PostgreSQL/.test(text))
  const ctx = await contextFor(null)
  const page = await open(ctx, '/privacy')
  record('/privacy renders in Chromium with the cloud section', await page.locator('#cloud-legal').count() === 1 && await page.getByText('Resumen rápido').isVisible())
  await page.screenshot({ path: `${OUT}privacy.png`, fullPage: true })
  await ctx.close()
})

// 6. D4 audit P4/P5/P6 under the real policy (the _headers CSP and the meta CSP, both enforced).
// jsDelivr is unreachable from CI sandboxes, so its Pyodide URLs are answered from the npm package of
// the same version (E2E_PYODIDE_DIR, prepared by run.sh): same URLs, so the CSP decision is real;
// same bytes, so the SRI check in the loader passes; real WebAssembly compilation.
const PYO_DIR = process.env.E2E_PYODIDE_DIR
const PYO_CDN = process.env.E2E_PYODIDE_CDN
const TYPES = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json', '.zip': 'application/zip' }
await flow('CSP: Pyodide runs with wasm-unsafe-eval; eval, other jsDelivr files and Firebase are refused', async () => {
  if (!PYO_DIR || !existsSync(join(PYO_DIR, 'pyodide.js'))) return record('Pyodide under the real CSP', false, 'E2E_PYODIDE_DIR missing')
  const ctx = await contextFor(null)
  await ctx.route(`${PYO_CDN}**`, (route) => {
    const file = join(PYO_DIR, new URL(route.request().url()).pathname.split('/').pop())
    if (!existsSync(file)) return route.fulfill({ status: 404, body: 'not in the npm package' })
    return route.fulfill({ status: 200, body: readFileSync(file), headers: { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream', 'access-control-allow-origin': '*' } })
  })
  await ctx.addInitScript(() => {
    window.__csp = []
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.effectiveDirective} ${e.blockedURI}`))
  })
  const page = await open(ctx, '/')
  const headers = (await page.evaluate(async () => Object.fromEntries((await fetch('/', { cache: 'no-store' })).headers)))
  record('P5: CORP same-origin and X-Permitted-Cross-Domain-Policies none; no COEP', headers['cross-origin-resource-policy'] === 'same-origin' && headers['x-permitted-cross-domain-policies'] === 'none' && !headers['cross-origin-embedder-policy'], JSON.stringify({ corp: headers['cross-origin-resource-policy'], xpcdp: headers['x-permitted-cross-domain-policies'] }))
  record('P4: the served CSP has no Firebase host, no bare jsDelivr and no unsafe-eval', !/firestore|identitytoolkit|securetoken|'unsafe-eval'|cdn\.jsdelivr\.net[ ;]/.test(headers['content-security-policy'] ?? 'x') && (headers['content-security-policy'] ?? '').includes(PYO_CDN), (headers['content-security-policy'] ?? '').slice(0, 160))
  // The loader exactly as CodePlayground runs it (script tag with SRI, then loadPyodide). It starts
  // from a page task: code inside Playwright's evaluate call may eval regardless of the CSP (CDP
  // Runtime.evaluate allows it), which would make this check prove nothing.
  await page.evaluate(([cdn, integrity]) => { setTimeout(async () => { window.__py = await (async () => {
    await new Promise((ok, ko) => { const s = document.createElement('script'); s.src = `${cdn}pyodide.js`; s.integrity = integrity; s.crossOrigin = 'anonymous'; s.onload = ok; s.onerror = () => ko(new Error('script')); document.head.appendChild(s) })
    const py = await window.loadPyodide({ indexURL: cdn })
    const out = []
    py.setStdout({ batched: (line) => out.push(line) })
    await py.runPythonAsync('import json, math\nprint(json.dumps({"fact": math.factorial(5), "sum": sum(range(10))}))')
    return out.join('\n')
  })().catch((e) => `threw: ${e.message}`) }, 0) }, [PYO_CDN, process.env.E2E_PYODIDE_SRI])
  await page.waitForFunction(() => window.__py !== undefined, null, { timeout: 120000 })
  const run = await page.evaluate(() => window.__py)
  const violations = await page.evaluate(() => window.__csp)
  record('P4c: Pyodide loads and runs Python under wasm-unsafe-eval, no CSP violation', run === '{"fact": 120, "sum": 45}' && violations.length === 0, `${run} | ${violations.join(', ')}`)
  const refused = await page.evaluate(async () => {
    const before = window.__csp.length
    // From a page task, as above: inside the evaluate call itself the eval would be allowed.
    setTimeout(() => {
      const inline = document.createElement('script')
      inline.textContent = "try { eval('1 + 1') } catch (e) {}"
      document.head.appendChild(inline)
    }, 0)
    await new Promise((ok) => { const s = document.createElement('script'); s.src = 'https://cdn.jsdelivr.net/npm/left-pad@1.3.0/index.js'; s.onerror = ok; s.onload = ok; document.head.appendChild(s) })
    try { await fetch('https://firestore.googleapis.com/') } catch {}
    await new Promise((ok) => setTimeout(ok, 300))
    return window.__csp.slice(before)
  })
  record('P4: eval, a jsDelivr file outside Pyodide and a Firebase host are each refused by the CSP', refused.some((v) => v.startsWith('script-src') && /eval/.test(v)) && refused.some((v) => v.includes('left-pad')) && refused.some((v) => v.includes('firestore')), refused.join(' | '))
  const health = await page.evaluate(async () => (await fetch('/api/v1/health')).json())
  record('P6: /api/v1/health is {ok, db} only', JSON.stringify(health) === '{"ok":true,"db":true}', JSON.stringify(health))
  await ctx.close()
  const adminCtx = await contextFor('admin')
  const adminPage = await open(adminCtx, '/admin')
  await adminPage.getByRole('tab', { name: 'Uso' }).click()
  const cfg = adminPage.getByTestId('usage-config')
  await cfg.waitFor({ timeout: 15000 })
  record('P6: the admin Uso tab lists the configuration (terms on, controller named in the harness)', (await cfg.locator('[data-key="terms"]').getAttribute('data-on')) === 'yes' && (await cfg.locator('[data-key="controller"]').getAttribute('data-on')) === 'yes')
  await adminPage.screenshot({ path: `${OUT}usage-config.png`, fullPage: true })
  await adminCtx.close()
})

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\nusage: ${results.length - failed.length}/${results.length} passed`)
if (measured.length) console.table(measured)
process.exit(failed.length ? 1 : 0)
