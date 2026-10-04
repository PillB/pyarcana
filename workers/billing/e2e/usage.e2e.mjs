// Chromium check of the D1 free-tier meter and budget guard (usage.mjs) on the real local stack:
// `wrangler dev --local` (workerd + local D1, the same engine and row counters as production D1)
// with USAGE_FLUSH_SECONDS=0, so every D1 request first writes the previous requests' tally.
//
// 1. Measures rows read and written per action, from the meter's own per-route rows.
// 2. A reload with nothing new uploads nothing.
// 3. Red-day drill: a seeded usage row puts today at 90 % of the write limit; the admin sees the
//    banner and the Uso tab, a learner's change stays in the browser with the "paused" line, and
//    once the row is gone "Sincronizar ahora" sends it.
// E2E_WORKER_DIR (set by run.sh) is the worker folder whose local D1 is used.
import { chromium } from 'playwright'
import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'

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

async function contextFor(who) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
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
  await page.getByRole('button', { name: 'Sincronizar ahora' }).click()
  await page.waitForTimeout(2500)
  const after = await page.getByTestId('account-sync-status').textContent()
  const remote = await api(page, 'GET', '/v1/me/progress')
  record('budget back to green: "Sincronizar ahora" sends the kept change', !/en pausa/.test(after ?? '') && /setup/.test(JSON.stringify(remote.body?.doc ?? {})), after)
  await ctx.close()
})

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\nusage: ${results.length - failed.length}/${results.length} passed`)
if (measured.length) console.table(measured)
process.exit(failed.length ? 1 : 0)
