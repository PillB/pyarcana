// Chromium check of the QA team round (owner requests 19 and 25 Nov 2026) on the real local stack
// (wrangler dev --local, a throwaway D1 that run.sh deletes before and after):
// 1. The account window names each person's role and links to /admin: admin, QA supervisor,
//    tester; a learner gets neither; a listed admin with a stale Google sign-in is told to sign
//    in with Google again, here and on /admin.
// 2. A tester files two reports through the QA window and sends them to the team.
// 3. The tester follows the account window's link to /admin: the team's reports, without the
//    reporter's address; a retest records "fixed" and shows in the list.
// 4. The QA supervisor's review queue lists only the report a retest called fixed; the supervisor
//    closes it; a tester cannot.
// 5. The admin's Reportes tab lists both reports with the reporter, the new status and the retest
//    count; the QA tab counts them. Each UI claim is cross-checked against the worker's API.
// Every check prints PASS or FAIL with what it saw; the run exits 1 on any FAIL.
import { chromium } from 'playwright'
import { launchOptions } from './sandbox-trust.mjs'
import { mkdirSync, readFileSync } from 'node:fs'

const BASE = 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
for (const who of ['admin', 'adminStale', 'supervisor', 'tester', 'free']) {
  if (!tokens[who]) {
    console.error(`REFUSED: tokens.json has no "${who}". Run seed.mjs from this checkout (run.sh does) before team.e2e.mjs.`)
    process.exit(2)
  }
}
const browser = await chromium.launch(launchOptions())
const results = []
const RUN = Date.now().toString(36)
const TITLE_FIXED = `E2E equipo ${RUN}: el botón Siguiente no avanza`
const TITLE_OPEN = `E2E equipo ${RUN}: el índice no se actualiza`

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

async function flow(name, fn) {
  try { await fn() } catch (e) { record(name, false, `threw: ${e.message.split('\n')[0]}`) }
}

async function contextFor(who, { qa = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  await ctx.addInitScript((qaMode) => {
    try {
      localStorage.setItem('pyarcana:tourCompleted', '1'); localStorage.setItem('pyarcana:qaTourCompleted', '1')
      if (qaMode) localStorage.setItem('pyarcana:qa-mode:v1', JSON.stringify({ v: 1, ...qaMode }))
    } catch {}
  }, qa)
  if (who) await ctx.addCookies([{ name: '__Host-pa_session', value: tokens[who].token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
  return ctx
}

async function open(ctx, path) {
  const page = await ctx.newPage()
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  return page
}

const shot = (page, name) => page.screenshot({ path: `${OUT}team-${name}.png`, fullPage: true })
const api = (page, method, path, body) => page.evaluate(async ([m, p, b]) => {
  const r = await fetch(`/api${p}`, { method: m, credentials: 'include', headers: { 'content-type': 'application/json', 'x-pyarcana': '1' }, body: b ? JSON.stringify(b) : undefined })
  let j = null
  try { j = await r.json() } catch {}
  return { status: r.status, body: j }
}, [method, path, body])

/** The account window's staff line as this person sees it: role text and link, or nulls. */
async function staffLine(who) {
  const ctx = await contextFor(who)
  const page = await open(ctx, '/')
  await page.getByTestId('account-button').click()
  await page.getByTestId('account-panel').waitFor({ timeout: 15000 })
  const role = page.getByTestId('account-staff-role')
  const seen = {
    role: (await role.count()) ? (await role.textContent())?.trim() : null,
    href: (await page.getByTestId('account-staff-link').count()) ? await page.getByTestId('account-staff-link').getAttribute('href') : null,
    reauth: (await page.getByTestId('account-staff-reauth').count()) > 0,
  }
  return { ctx, page, seen }
}

// 1. The account window: role and /admin link per person.
await flow('account window', async () => {
  const expected = {
    admin: { role: 'Administración', href: '/admin', reauth: false },
    supervisor: { role: 'Supervisión de QA', href: '/admin', reauth: false },
    tester: { role: 'Tester', href: '/admin', reauth: false },
    free: { role: null, href: null, reauth: false },
    adminStale: { role: 'Administración', href: '/admin', reauth: true },
  }
  for (const [who, want] of Object.entries(expected)) {
    const { ctx, page, seen } = await staffLine(who)
    record(`account window for ${who}: role, link and sign-in note`, JSON.stringify(seen) === JSON.stringify(want), `expected ${JSON.stringify(want)}, saw ${JSON.stringify(seen)}`)
    if (who === 'tester') await shot(page, 'account-window-tester')
    await ctx.close()
  }
  const stale = await contextFor('adminStale')
  const page = await open(stale, '/admin')
  const reauth = await page.getByTestId('admin-reauth').isVisible().catch(() => false)
  const tabs = await page.getByRole('tab', { name: 'Testers' }).count()
  record('/admin for a stale admin: "sign in with Google again", no admin tabs', reauth && tabs === 0, `reauth=${reauth} testersTab=${tabs}`)
  await stale.close()
})

// 2. The tester files two reports in the QA window and sends both.
await flow('tester files reports', async () => {
  const ctx = await contextFor('tester', { qa: { testMode: true, adPreview: false } })
  const page = await open(ctx, '/#setup')
  for (const [title, what] of [[TITLE_FIXED, 'Al pulsar Siguiente no pasa nada.'], [TITLE_OPEN, 'Tras marcar la teoría, el índice sigue igual.']]) {
    await page.getByTestId('qa-harness-open').click()
    await page.getByTestId('qa-harness-dialog').waitFor()
    await page.getByTestId('qa-tab-report').click()
    await page.getByTestId('qa-title').fill(title)
    await page.getByTestId('qa-description').fill(what)
    await page.getByTestId('qa-repro').fill('1. Abrir la sección\n2. Probar')
    await page.getByTestId('qa-save-issue').click()
    await page.waitForTimeout(800)
    await page.getByTestId('qa-tab-review').click()
    await page.getByTestId('qa-issue-row').filter({ hasText: title }).first().click()
    await page.getByTestId('qa-send-issue').click()
    await page.getByTestId('qa-sent-mark').waitFor({ timeout: 15000 })
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
  }
  const mine = await api(page, 'GET', '/v1/qa/reports?limit=50')
  const titles = (mine.body?.reports ?? []).map((r) => r.title)
  record('both reports reached the worker', mine.status === 200 && titles.includes(TITLE_FIXED) && titles.includes(TITLE_OPEN), `status=${mine.status} titles=${JSON.stringify(titles)}`)
  await ctx.close()
})

const idOf = async (page, title) => ((await api(page, 'GET', '/v1/qa/reports?limit=50')).body?.reports ?? []).find((r) => r.title === title)?.id ?? null

// 3. The tester opens /admin from the account window and retests one report.
await flow('tester retests from /admin', async () => {
  const { ctx, page } = await staffLine('tester')
  await Promise.all([page.waitForURL(/\/admin\/?$/, { timeout: 15000 }), page.getByTestId('account-staff-link').click()])
  await page.getByTestId('qa-workspace').waitFor({ timeout: 15000 })
  await page.waitForTimeout(1200)
  const main = await page.locator('main').textContent()
  record('the link lands on the tester workspace with both reports', main.includes(TITLE_FIXED) && main.includes(TITLE_OPEN), main.slice(0, 200))
  record('the team list never shows the reporter\'s address', !main.includes(tokens.tester.email), 'looked for the tester\'s own email in the team list')
  record('a tester has no admin tab and no review form', (await page.getByRole('tab', { name: 'Testers' }).count()) === 0 && (await page.getByTestId('qa-review-form').count()) === 0)
  await page.getByRole('button', { name: new RegExp(TITLE_FIXED) }).first().click()
  await page.getByTestId('report-retest').waitFor({ timeout: 15000 })
  await page.getByTestId('report-retest').getByLabel('Ya está arreglado').check()
  await page.getByTestId('retest-save').click()
  await page.getByTestId('report-checks').waitFor({ timeout: 15000 })
  await page.waitForTimeout(1200)
  const id = await idOf(page, TITLE_FIXED)
  const detail = await api(page, 'GET', `/v1/qa/reports/${id}`)
  const checks = detail.body?.verifications ?? []
  record('the retest is stored as "fixed" and is mine', checks.length === 1 && checks[0].result === 'fixed' && checks[0].mine === true, JSON.stringify(checks))
  const row = await page.getByTestId('report-row-checks').first().textContent().catch(() => '')
  record('the list shows the retest count', /Arreglado según retest: 1/.test(row ?? ''), row)
  const patch = await api(page, 'PATCH', `/v1/qa/reports/${id}`, { status: 'fixed' })
  record('a tester cannot close a report (the worker refuses)', patch.status === 403, `status=${patch.status}`)
  await shot(page, 'tester-workspace')
  await ctx.close()
})

// 4. The supervisor's review queue, then closing the report.
await flow('supervisor closes', async () => {
  const ctx = await contextFor('supervisor')
  const page = await open(ctx, '/admin')
  await page.getByTestId('qa-workspace').waitFor({ timeout: 15000 })
  await page.waitForTimeout(1200)
  const queue = await page.locator('[role="tabpanel"]').first().textContent()
  record('the review queue lists the report a retest called fixed, and not the other', queue.includes(TITLE_FIXED) && !queue.includes(TITLE_OPEN), queue.slice(0, 200))
  await page.getByRole('button', { name: new RegExp(TITLE_FIXED) }).first().click()
  const form = page.getByTestId('qa-review-form')
  await form.waitFor({ timeout: 15000 })
  await form.locator('select').selectOption('fixed')
  await form.getByRole('button', { name: 'Guardar' }).click()
  await page.waitForTimeout(1500)
  const id = await idOf(page, TITLE_FIXED)
  const after = await api(page, 'GET', `/v1/qa/reports/${id}`)
  record('the supervisor\'s change is stored', after.body?.report?.status === 'fixed', JSON.stringify(after.body?.report?.status))
  const queueAfter = await api(page, 'GET', '/v1/qa/reports?awaiting=review&limit=50')
  record('a closed report leaves the review queue', !(queueAfter.body?.reports ?? []).some((r) => r.id === id), JSON.stringify((queueAfter.body?.reports ?? []).map((r) => r.title)))
  await shot(page, 'supervisor-queue')
  await ctx.close()
})

// 5. The admin: Reportes tab with the reporter, the status and the retest count; QA tab counts.
await flow('admin tabs', async () => {
  const ctx = await contextFor('admin')
  const page = await open(ctx, '/admin')
  await page.getByRole('tab', { name: 'Reportes' }).waitFor({ timeout: 15000 })
  await page.waitForTimeout(1200)
  const reports = await page.locator('[role="tabpanel"]').first().textContent()
  const fixedRow = await page.getByRole('button', { name: new RegExp(TITLE_FIXED) }).first().textContent()
  record('Reportes lists both reports', reports.includes(TITLE_FIXED) && reports.includes(TITLE_OPEN), reports.slice(0, 200))
  record('the admin sees who reported, the closed status and the retest', fixedRow.includes(tokens.tester.email) && fixedRow.includes('Corregido') && fixedRow.includes('Arreglado según retest: 1'), fixedRow)
  const audit = await api(page, 'GET', `/v1/admin/reports?limit=50`)
  const stored = (audit.body?.reports ?? []).find((r) => r.title === TITLE_FIXED)
  record('the admin API agrees with the page', stored?.status === 'fixed' && stored?.verified?.fixed === 1, JSON.stringify({ status: stored?.status, verified: stored?.verified }))
  await shot(page, 'admin-reports')
  await page.getByRole('tab', { name: 'QA' }).click()
  await page.getByTestId('qa-stats').waitFor({ timeout: 15000 })
  const count = Number((await page.locator('[data-testid="qa-summary"] [data-key="reports"] dd').textContent())?.trim())
  record('the QA tab counts the team\'s reports', count >= 2, `reports=${count}`)
  await shot(page, 'admin-qa')
  await ctx.close()
})

// A learner on /admin sees neither report.
await flow('learner', async () => {
  const ctx = await contextFor('free')
  const page = await open(ctx, '/admin')
  const main = await page.locator('main').textContent()
  record('a learner on /admin sees no team report', !main.includes(TITLE_FIXED) && !main.includes(TITLE_OPEN), main.slice(0, 160))
  await ctx.close()
})

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed${failed.length ? `; FAILED: ${failed.map((f) => f.name).join(' | ')}` : ''}`)
process.exit(failed.length ? 1 : 0)
