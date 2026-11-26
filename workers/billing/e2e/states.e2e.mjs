// Chromium check of the state-machine audit of 25 Nov 2026 (docs/architecture/STATE_MACHINES.md),
// on the real local stack (wrangler dev + local D1 + the static build at stage beta). After every
// step it reads the same fact from every place that shows it (section header, menu, dashboard,
// localStorage, the account's server copy) and fails when they disagree.
//
//   C1  any step can be the last one: check first, «Tú haces» last completes the section everywhere;
//   C2  a learner the old rule left with every step done and the section not complete is repaired
//       on opening the section;
//   C3  signing out of one account and into another on the same page, then «Unir», uploads to the
//       new account (the sync used to say "synced" and send nothing);
//   C4  a session ended elsewhere (cookie gone) is noticed by the page on the next sync: the header
//       button says «Entrar» instead of «Mi cuenta» beside a refused sync.
import { chromium } from 'playwright'
import { launchOptions } from './sandbox-trust.mjs'
import { readFileSync, mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const BASE = process.env.BASE || 'http://localhost:8787'
const REPO = new URL('../../../', import.meta.url).pathname
const LOG = new URL('./wrangler.log', import.meta.url).pathname
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
const RIGHT = JSON.parse(execFileSync('node', ['--import', 'tsx', '-e',
  'import("./src/lib/course/index.ts").then((m) => { const c = m.COURSE_SECTIONS || m.default.COURSE_SECTIONS; console.log(JSON.stringify(c[0].selfCheck.questions.map((q) => q.correctIndex))) })'],
{ cwd: REPO }).toString().trim())
const LABELS = { theory: 'Marcar teoría como leída', ido: 'Entendido, marcado como visto', wedo: 'Práctica completada', youdo: 'Proyecto enviado a mi GitHub' }
const browser = await chromium.launch(launchOptions())
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 400)})` : ''}`)
}

async function flow(name, fn) {
  try {
    await fn()
  } catch (e) {
    record(name, false, `threw: ${e.message.split('\n')[0]}`)
  }
}

async function contextFor(who, seed = null) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  await ctx.addInitScript((progress) => {
    try {
      localStorage.setItem('pyarcana:tourCompleted', '1'); localStorage.setItem('pyarcana:qaTourCompleted', '1')
      if (progress && !sessionStorage.getItem('seeded')) { localStorage.setItem('python-ds-progress', progress); sessionStorage.setItem('seeded', '1') }
    } catch {}
  }, seed)
  if (who) await ctx.addCookies([{ name: '__Host-pa_session', value: tokens[who].token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
  return ctx
}

const api = (page, method, path) => page.evaluate(async ([m, p]) => {
  const r = await fetch(`/api${p}`, { method: m, credentials: 'include', headers: { 'x-pyarcana': '1' } })
  let j = null
  try { j = await r.json() } catch {}
  return { status: r.status, body: j }
}, [method, path])

/** The same fact, read from every place that shows it. */
async function views(page) {
  const stored = await page.evaluate(() => {
    const s = JSON.parse(localStorage.getItem('python-ds-progress') || '{}').state || {}
    return { complete: (s.completedSections || []).includes('setup'), steps: (s.completedSubSteps || {}).setup || [] }
  })
  const header = await page.getByTestId('section-complete-badge').count() > 0
  const menuText = await page.getByTestId('sidebar-progress').innerText()
  const menu = /\b1 de \d+ secciones completadas/.test(menuText)
  return { stored, header, menu }
}

async function dashboardCount(page) {
  await page.goto(`${BASE}/#home`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  // StatCard renders the value above its label: "1/53" then "Secciones completadas".
  const m = /(\d+)\/\d+\s*Secciones completadas/.exec(await page.locator('body').innerText())
  return m ? Number(m[1]) : -1
}

async function takeQuiz(page) {
  await page.getByTestId('tab-quiz').click()
  for (let i = 0; i < RIGHT.length; i++) await page.getByTestId(`sc-q-${i}-opt-${RIGHT[i]}`).click()
  await page.getByTestId('sc-submit').click()
  await page.getByTestId('sc-result').waitFor()
}

/** The header renders the button twice (phone and desktop bars); the visible one is the one a person uses. */
const accountButton = (page) => page.getByTestId('account-button').filter({ visible: true }).first()

function lastCode(email) {
  const lines = readFileSync(LOG, 'utf8').split('\n').filter((l) => l.includes(`[dev-log] to=${email}`))
  const m = /subject=(\d{6})/.exec(lines.at(-1) ?? '')
  return m ? m[1] : null
}

// C1. No account: check first, then the other four steps; «Tú haces» last.
await flow('C1 any step can be the last one', async () => {
  const ctx = await contextFor(null)
  const page = await ctx.newPage()
  await page.goto(`${BASE}/#setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  await takeQuiz(page)
  const trail = [{ step: 'quiz', ...(await views(page)) }]
  for (const step of ['theory', 'ido', 'wedo', 'youdo']) {
    await page.getByTestId(`tab-${step}`).click()
    await page.getByRole('button', { name: LABELS[step] }).click()
    await page.waitForTimeout(300)
    trail.push({ step, ...(await views(page)) })
  }
  const mid = trail.slice(0, -1)
  const end = trail.at(-1)
  record('C1 before the last step no view says complete', mid.every((v) => !v.stored.complete && !v.header && !v.menu), JSON.stringify(mid.map((v) => [v.step, v.stored.complete, v.header, v.menu])))
  record('C1 after «Tú haces» last: storage, header and menu all say complete', end.stored.complete && end.header && end.menu, JSON.stringify(end))
  await page.screenshot({ path: `${OUT}states-c1-complete.png` })
  const dash = await dashboardCount(page)
  record('C1 the dashboard counts it', dash === 1, `dashboard says ${dash}`)
  await page.goto(`${BASE}/#setup/youdo`, { waitUntil: 'networkidle' })
  await page.getByTestId('step-undo').click()
  await page.waitForTimeout(300)
  const undone = await views(page)
  record('C1 «Desmarcar» keeps the section complete in every view', !undone.stored.steps.includes('youdo') && undone.stored.complete && undone.header && undone.menu, JSON.stringify(undone))
  await ctx.close()
})

// C2. Stored by the old rule: every step done, section not complete.
await flow('C2 the old state is repaired on opening', async () => {
  const legacy = JSON.stringify({ state: { completedSections: [], completedSubSteps: { setup: ['quiz', 'theory', 'ido', 'wedo', 'youdo'] }, quizScores: { setup: 100 }, lastVisited: 'setup', bookmarks: [], startDate: '2026-11-01T00:00:00.000Z', isHydratedFromServer: false }, version: 2 })
  const ctx = await contextFor(null, legacy)
  const page = await ctx.newPage()
  await page.goto(`${BASE}/#home`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const before = await dashboardCount(page)
  await page.goto(`${BASE}/#setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(800)
  const v = await views(page)
  const after = await dashboardCount(page)
  record('C2 opening the section records it complete everywhere', before === 0 && v.stored.complete && v.header && v.menu && after === 1, JSON.stringify({ before, v, after }))
  await ctx.close()
})

// C3. Account A, sign out, account B (new, empty) on the same page, «Unir».
async function answerChoiceIfAsked(page) {
  const choice = page.getByTestId('sync-owner-choice')
  if (await choice.isVisible().catch(() => false)) await choice.getByRole('button', { name: 'Unir' }).click()
}

async function signOutHere(page) {
  await accountButton(page).click()
  const out = page.getByTestId('account-signout').first()
  await out.scrollIntoViewIfNeeded()
  const logout = page.waitForResponse((r) => r.url().includes('/v1/auth/logout'), { timeout: 10000 }).catch(() => null)
  await out.click()
  await logout
  await page.waitForTimeout(800)
}

async function emailSignInHere(page, email) {
  if (!(await page.getByTestId('signin-panel').isVisible().catch(() => false))) {
    await page.keyboard.press('Escape')
    await accountButton(page).click()
  }
  await page.getByTestId('signin-panel').waitFor({ timeout: 15000 })
  await page.locator('#account-age').click()
  await page.locator('#account-email').fill(email)
  await page.getByRole('button', { name: 'Enviar código' }).click()
  let code = null
  for (let i = 0; i < 20 && !code; i += 1) { await page.waitForTimeout(500); code = lastCode(email) }
  await page.locator('#account-code').click()
  await page.keyboard.type(code ?? '000000')
  await page.getByRole('button', { name: 'Entrar' }).click()
}

const serverSteps = async (page) => {
  const r = await api(page, 'GET', '/v1/me/progress')
  return { status: r.status, rev: r.body?.rev, steps: r.body?.doc?.state?.completedSubSteps?.setup || [] }
}

await flow('C3 switching accounts on one page uploads to the new one', async () => {
  const ctx = await contextFor('free')
  const page = await ctx.newPage()
  await page.goto(`${BASE}/#setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await answerChoiceIfAsked(page)
  await page.getByTestId('tab-theory').click()
  const mark = page.getByRole('button', { name: LABELS.theory })
  if (await mark.count()) await mark.click()
  await page.waitForTimeout(6500)
  const onA = await serverSteps(page)
  record('C3 precondition: account A holds the tick', onA.steps.includes('theory'), JSON.stringify(onA))
  await signOutHere(page)
  await emailSignInHere(page, `cambio${Date.now() % 100000}@e2e.test`)
  await page.getByTestId('sync-owner-choice').waitFor({ timeout: 15000 })
  record('C3 the new account is asked first (another account\'s progress is here)', true)
  await page.getByTestId('sync-owner-choice').getByRole('button', { name: 'Unir' }).click()
  await page.waitForTimeout(6500)
  const onB = await serverSteps(page)
  record('C3 «Unir» put the progress on the new account', onB.status === 200 && onB.steps.includes('theory'), JSON.stringify(onB))
  await ctx.close()
})

// C4. The session ends behind the page's back.
await flow('C4 a session ended elsewhere is noticed', async () => {
  const ctx = await contextFor('gift')
  const page = await ctx.newPage()
  await page.goto(`${BASE}/#setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  await answerChoiceIfAsked(page)
  const before = (await accountButton(page).getAttribute('aria-label')) ?? ''
  await ctx.clearCookies()
  await page.getByTestId('tab-ido').click()
  await page.getByRole('button', { name: LABELS.ido }).click()
  await page.waitForTimeout(7000)
  const after = (await accountButton(page).getAttribute('aria-label')) ?? ''
  record('C4 the header follows the refused sync: «Mi cuenta» becomes «Entrar»', before === 'Mi cuenta' && after === 'Entrar', `before=${before} after=${after}`)
  await ctx.close()
})

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\nstates: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
