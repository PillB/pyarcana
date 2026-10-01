// Chromium end-to-end run of the account, admin, QA and page flows against the real local stack
// (`wrangler dev --local`: workerd + local D1 + the static build at stage beta, origin
// http://localhost:8787). Seeded people come from seed.mjs. Each flow records PASS/FAIL and the
// run continues, so one failure does not hide the rest. Screenshots go to ./shots/flows-*.png.
import { chromium } from 'playwright'
import { readFileSync, mkdirSync } from 'node:fs'

const BASE = 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
const LOG = new URL('./wrangler.log', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', headless: true })
const results = []
const errors = []
const IGNORED = /cdn\.jsdelivr\.net|ERR_TUNNEL_CONNECTION_FAILED|ERR_ABORTED|status of 401|favicon/i

function record(name, ok, detail = '') {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

async function flow(name, fn) {
  try {
    await fn()
  } catch (e) {
    record(name, false, `threw: ${e.message.split('\n')[0]}`)
  }
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

async function open(ctx, path, label) {
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error' && !IGNORED.test(m.text())) errors.push(`${label} ${path}: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`${label} ${path}: pageerror ${e.message}`))
  page.on('requestfailed', (r) => { if (!IGNORED.test(r.url()) && !IGNORED.test(r.failure()?.errorText ?? '') && !r.url().includes('_rsc=')) errors.push(`${label} ${path}: requestfailed ${r.url()} ${r.failure()?.errorText}`) })
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1200)
  return page
}

const shot = (page, name) => page.screenshot({ path: `${OUT}flows-${name}.png`, fullPage: true })
const api = (page, method, path, body) => page.evaluate(async ([m, p, b]) => {
  const r = await fetch(`/api${p}`, { method: m, credentials: 'include', headers: { 'content-type': 'application/json', 'x-pyarcana': '1' }, body: b ? JSON.stringify(b) : undefined })
  let j = null
  try { j = await r.json() } catch {}
  return { status: r.status, body: j }
}, [method, path, body])

function lastCode(email) {
  const lines = readFileSync(LOG, 'utf8').split('\n').filter((l) => l.includes(`[dev-log] to=${email}`))
  const m = /subject=(\d{6})/.exec(lines.at(-1) ?? '')
  return m ? m[1] : null
}

// 1. Email-code sign-in through the real UI, then sign-out.
await flow('email sign-in and sign-out', async () => {
  const email = `nueva${Date.now() % 100000}@e2e.test`
  const ctx = await contextFor(null)
  const page = await open(ctx, '/cuenta', 'signin')
  await page.getByTestId('cuenta-signin').click({ timeout: 15000 })
  await page.getByTestId('signin-panel').waitFor({ timeout: 15000 })
  await page.locator('#account-age').click()
  await page.locator('#account-email').fill(email)
  await page.getByRole('button', { name: 'Enviar código' }).click()
  let code = null
  for (let i = 0; i < 20 && !code; i += 1) { await page.waitForTimeout(500); code = lastCode(email) }
  record('sign-in code is sent (dev-log)', code !== null, code ? 'code read from the worker log' : 'no code in log')
  await page.locator('#account-code').click()
  await page.keyboard.type(code ?? '000000')
  await page.getByRole('button', { name: 'Entrar' }).click()
  await page.getByTestId('account-panel').first().waitFor({ timeout: 15000 })
  const me = await api(page, 'GET', '/v1/me')
  record('signed in through the UI: /v1/me knows the new account', me.status === 200 && me.body.account.email === email, `status=${me.status}`)
  await shot(page, 'cuenta-signed-in')
  await page.getByTestId('account-signout').first().click()
  await page.waitForTimeout(1500)
  const after = await api(page, 'GET', '/v1/me')
  record('sign-out ends the session (me answers 401)', after.status === 401, `status=${after.status}`)
  await page.waitForTimeout(800)
  const panelBack = await page.getByTestId('cuenta-signin').isVisible().catch(() => false) || await page.getByTestId('signin-panel').isVisible().catch(() => false)
  record('after sign-out /cuenta offers sign-in again', panelBack)
  await ctx.close()
})

// 2. Progress: mark section 1 theory read on device A, see it on device B.
await flow('progress syncs across devices', async () => {
  const a = await contextFor('free')
  const pageA = await open(a, '/#setup', 'progressA')
  const choice = pageA.getByTestId('sync-owner-choice')
  if (await choice.isVisible().catch(() => false)) await choice.getByRole('button').first().click()
  await pageA.getByRole('button', { name: 'Marcar teoría como leída' }).click()
  await pageA.waitForTimeout(800)
  await pageA.goto(`${BASE}/cuenta`, { waitUntil: 'networkidle' })
  await pageA.getByRole('button', { name: 'Sincronizar ahora' }).click().catch(() => {})
  await pageA.waitForTimeout(2500)
  const remote = await api(pageA, 'GET', '/v1/me/progress')
  const docText = JSON.stringify(remote.body ?? {})
  record('progress reaches the server after "Sincronizar ahora"', remote.status === 200 && /setup/.test(docText), `status=${remote.status} rev=${remote.body?.rev}`)
  await a.close()
  const b = await contextFor('free')
  const pageB = await open(b, '/#setup', 'progressB')
  await pageB.waitForTimeout(2500)
  const choiceB = pageB.getByTestId('sync-owner-choice')
  if (await choiceB.isVisible().catch(() => false)) await choiceB.getByRole('button').first().click()
  await pageB.waitForTimeout(1500)
  const local = await pageB.evaluate(() => localStorage.getItem('python-ds-progress') || '')
  const synced = /"setup":\["theory"\]/.test(local)
  record('a second browser receives the synced progress (section 1 theory read)', synced, local.slice(0, 120))
  await shot(pageB, 'progress-device-b')
  await b.close()
})

// 3. Gate: section 6 is Pro. Free sees the gate; gift opens it.
await flow('section gate', async () => {
  const freeCtx = await contextFor('free')
  const f = await open(freeCtx, '/#collections', 'gateFree')
  const gated = await f.getByTestId('gate-upgrade').isVisible().catch(() => false) || await f.getByTestId('gate-trial').isVisible().catch(() => false)
  record('a free account meets the Pro gate on section 6', gated)
  await shot(f, 'gate-free')
  await freeCtx.close()
  const giftCtx = await contextFor('gift')
  const g = await open(giftCtx, '/#collections', 'gateGift')
  const open6 = !(await g.getByTestId('gate-upgrade').isVisible().catch(() => false)) && !(await g.getByTestId('gate-trial').isVisible().catch(() => false))
  record('a gift Pro account opens section 6', open6)
  await giftCtx.close()
})

// 4. Trial: a free account starts the 7-day trial from /cuenta; a second start is refused.
await flow('trial', async () => {
  const ctx = await contextFor('free')
  const page = await open(ctx, '/cuenta', 'trial')
  await page.getByTestId('account-trial').click()
  await page.waitForTimeout(2000)
  const me = await api(page, 'GET', '/v1/me')
  record('starting the trial gives Pro (source trial) and turns ads off', me.body?.access?.isPro === true && me.body?.access?.source === 'trial' && me.body?.ads?.show === false, JSON.stringify({ src: me.body?.access?.source, ads: me.body?.ads }))
  const again = await api(page, 'POST', '/v1/me/trial', {})
  record('a second trial is refused', again.status >= 400, `status=${again.status} reason=${again.body?.reason}`)
  await shot(page, 'cuenta-trial')
  await ctx.close()
})

// 5. Admin window: every tab renders; gifts (fixed + indefinite), revoke; testers; account lookup.
await flow('admin', async () => {
  const ctx = await contextFor('admin')
  const page = await open(ctx, '/admin', 'admin')
  for (const tab of ['Reportes', 'Pro regalado', 'Testers', 'Cuentas', 'Anuncios', 'Experimentos', 'Satisfacción']) {
    await page.getByRole('tab', { name: tab }).click()
    await page.waitForTimeout(700)
    const alert = await page.locator('[role="alert"]').first().textContent().catch(() => null)
    record(`admin tab "${tab}" renders without an error`, !alert, alert ?? '')
    await shot(page, `admin-${tab.replace(/\s+/g, '-').toLowerCase()}`)
  }
  await page.getByRole('tab', { name: 'Pro regalado' }).click()
  await page.locator('#grant-target').fill('nueva-regalo@e2e.test')
  await page.locator('#grant-days').fill('14')
  await page.getByRole('button', { name: 'Regalar' }).click()
  await page.waitForTimeout(1200)
  const fixedMsg = await page.locator('[role="status"], [role="alert"]').allTextContents()
  record('admin gifts 14 days to an address with no account yet', fixedMsg.join(' ').includes('Regalo creado'), fixedMsg.join(' | '))
  await page.locator('#grant-target').fill(tokens.free.email)
  await page.locator('#grant-indef').click()
  await page.getByRole('button', { name: 'Regalar' }).click()
  await page.waitForTimeout(1200)
  const list = await api(page, 'GET', '/v1/admin/grants?kind=gift&state=all&limit=100')
  const indef = (list.body?.grants ?? []).find((g) => g.email === tokens.free.email && g.days === null)
  record('admin gives an indefinite gift and it is listed', Boolean(indef), `grants=${list.body?.grants?.length}`)
  await page.locator('select:has(option[value="pending_activation"])').selectOption('all')
  await page.waitForTimeout(1000)
  const upcoming = await page.getByTestId('admin-grants').locator('li', { hasText: tokens.free.email }).filter({ hasText: 'Regalo' }).innerText()
  record('the indefinite gift given during a running trial waits for the trial to end', /upcoming/.test(upcoming), upcoming.replace(/\n/g, ' '))
  const rows = page.getByTestId('admin-grants').locator('li', { hasText: tokens.free.email }).filter({ hasText: 'Regalo' })
  await rows.first().getByRole('button', { name: 'Retirar' }).click()
  await page.getByRole('alertdialog').getByRole('textbox').fill('fin e2e')
  await page.getByRole('alertdialog').getByRole('button', { name: 'Retirar' }).click()
  await page.waitForTimeout(1200)
  const after = await api(page, 'GET', '/v1/admin/grants?kind=gift&state=all&limit=100')
  const revoked = (after.body?.grants ?? []).find((g) => g.id === indef?.id)
  record('admin revokes the indefinite gift', revoked?.state === 'revoked', `state=${revoked?.state}`)
  await page.getByRole('tab', { name: 'Testers' }).click()
  await page.locator('#role-target').fill(tokens.gift.email)
  await page.locator('#role-indef').click()
  await page.getByRole('button', { name: 'Dar el rol' }).click()
  await page.waitForTimeout(1200)
  const roles = await api(page, 'GET', '/v1/admin/roles?role=tester&state=active')
  record('admin gives the tester role and it is listed', (roles.body?.roles ?? []).some((r) => r.email === tokens.gift.email), `roles=${roles.body?.roles?.length}`)
  await page.getByRole('tab', { name: 'Cuentas' }).click()
  await page.locator('#acct-target').fill(tokens.paid.email)
  await page.getByRole('button', { name: 'Buscar' }).click()
  await page.getByTestId('admin-account').waitFor({ timeout: 10000 })
  const card = await page.getByTestId('admin-account').textContent()
  record('admin looks up an account and sees its subscription', card.includes(tokens.paid.email), card.slice(0, 120))
  await shot(page, 'admin-account-lookup')
  await ctx.close()
  const learner = await contextFor('free')
  const lp = await open(learner, '/admin', 'admin-learner')
  const body = await lp.locator('main').textContent().catch(() => '')
  const leaked = /Pro regalado|Anuncios|Testers/.test(body)
  record('a learner on /admin sees no admin tabs', !leaked, body.slice(0, 120))
  await learner.close()
})

// 6. QA: write an issue in the QA menu, send it to the team, see it in /qa and /admin.
await flow('qa', async () => {
  const ctx = await contextFor('tester', { qa: { testMode: true, adPreview: false } })
  const page = await open(ctx, '/#setup', 'qa')
  await page.getByTestId('qa-harness-open').click()
  await page.getByTestId('qa-harness-dialog').waitFor()
  await page.getByTestId('qa-tab-report').click()
  await page.getByTestId('qa-title').fill('E2E: botón Siguiente no responde')
  await page.getByTestId('qa-description').fill('Al pulsar Siguiente en la sección 1 no pasa nada.')
  await page.getByTestId('qa-repro').fill('1. Abrir la sección 1\n2. Pulsar Siguiente')
  await page.getByTestId('qa-save-issue').click()
  await page.waitForTimeout(1000)
  await page.getByTestId('qa-tab-review').click()
  await page.getByTestId('qa-issue-row').first().click()
  await page.getByTestId('qa-send-issue').click()
  await page.getByTestId('qa-sent-mark').waitFor({ timeout: 15000 })
  record('"Enviar al equipo" sends the saved issue and marks it sent', true)
  await shot(page, 'qa-harness-sent')
  const badge = await page.getByTestId('qa-mode-badge').isVisible().catch(() => false)
  record('the MODO PRUEBA badge shows in QA test mode', badge)
  await ctx.close()
  const testerCtx = await contextFor('tester')
  const qa = await open(testerCtx, '/qa', 'qa-site')
  await qa.waitForTimeout(1500)
  const qaText = await qa.locator('main').textContent()
  record('a tester sees the sent report on /qa', qaText.includes('E2E: botón Siguiente no responde'), qaText.slice(0, 160))
  const notComplaints = await qa.getByTestId('qa-not-complaints').isVisible().catch(() => false)
  record('/qa says it is not the Libro de Reclamaciones', notComplaints)
  await shot(qa, 'qa-site-tester')
  await testerCtx.close()
  const freeCtx = await contextFor('free')
  const fq = await open(freeCtx, '/qa', 'qa-free')
  const fText = await fq.locator('main').textContent()
  record('a learner on /qa does not see other people\'s reports', !fText.includes('E2E: botón Siguiente no responde'), fText.slice(0, 160))
  await freeCtx.close()
  const adminCtx = await contextFor('admin')
  const ad = await open(adminCtx, '/admin', 'admin-reports')
  await ad.waitForTimeout(1200)
  const adText = await ad.locator('main').textContent()
  record('the admin Reportes tab lists the sent report', adText.includes('E2E: botón Siguiente no responde'))
  await adminCtx.close()
})

// 7. Pages: every cloud and legal page renders, with no console error, for anonymous and signed-in.
await flow('pages', async () => {
  const pages = ['/', '/precios', '/suscripcion', '/cuenta', '/qa', '/privacy', '/cookies', '/terms', '/data-rights', '/disclaimer', '/acceptable-use', '/credential-policy', '/security', '/external-resources', '/verify']
  for (const who of [null, 'gift']) {
    const ctx = await contextFor(who)
    for (const p of pages) {
      const before = errors.length
      const page = await open(ctx, p, who ?? 'anon')
      const status = await page.evaluate(() => document.title)
      const ok = errors.length === before && status !== ''
      record(`${who ?? 'anonymous'} ${p} renders cleanly`, ok, errors.slice(before).join(' | '))
      if (!who) await shot(page, `page${p.replace(/\//g, '-') || '-home'}`)
      await page.close()
    }
    await ctx.close()
  }
})

// 8. Button sweep: click every enabled button on the account, pricing and subscription pages;
//    a click must never throw a page error. Dialogs that open are closed with Escape.
await flow('button sweep', async () => {
  for (const [who, path] of [['free', '/cuenta'], [null, '/precios'], ['gift', '/suscripcion'], [null, '/cuenta']]) {
    const ctx = await contextFor(who)
    const page = await open(ctx, path, `sweep-${who ?? 'anon'}`)
    const before = errors.length
    const skip = /Cerrar sesión|Eliminar|Borrar|Desactivar|Enviar código|Empezar la prueba|Pagar|Suscribirme|Google|Microsoft/i
    const buttons = await page.locator('main button:visible').all()
    let clicked = 0
    for (const b of buttons) {
      const label = ((await b.textContent().catch(() => '')) || (await b.getAttribute('aria-label').catch(() => '')) || '').trim()
      if (skip.test(label) || !(await b.isEnabled().catch(() => false))) continue
      await b.click({ timeout: 3000 }).catch(() => {})
      clicked += 1
      await page.waitForTimeout(300)
      await page.keyboard.press('Escape').catch(() => {})
      if (!page.url().includes(path)) await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
    }
    record(`button sweep ${who ?? 'anonymous'} ${path}: ${clicked} buttons clicked, no page error`, errors.length === before, errors.slice(before).join(' | '))
    await ctx.close()
  }
})

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (errors.length) console.log(`console/page errors (${errors.length}):\n` + [...new Set(errors)].slice(0, 30).join('\n'))
process.exit(failed.length ? 1 : 0)
