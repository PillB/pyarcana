// Chromium check of the learner walkthrough's progress findings (5 Oct 2026), signed in, on the real
// local stack:
//   W01  passing the self-check, then pressing the result card's button, or retaking it, leaves the
//        section complete, in the browser and on the account;
//   W07  a done step is a status with a separate «Desmarcar», not a green toggle;
//   W10  a change made right before the tab closes still reaches the account (pagehide flush).
// Real page, real clicks, real worker and D1. The right answers come from the course data itself.
import { chromium } from 'playwright'
import { sandboxTrustArgs } from './sandbox-trust.mjs'
import { readFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const BASE = process.env.BASE || 'http://localhost:8787'
const REPO = new URL('../../../', import.meta.url).pathname
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
const answers = execFileSync('node', ['--import', 'tsx', '-e',
  'import("./src/lib/course/index.ts").then((m) => { const c = m.COURSE_SECTIONS || m.default.COURSE_SECTIONS; console.log(JSON.stringify(c[0].selfCheck.questions.map((q) => q.correctIndex))) })'],
  { cwd: REPO }).toString().trim()
const RIGHT = JSON.parse(answers)
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', headless: true, args: sandboxTrustArgs() })
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

const LABELS = { theory: 'Marcar teoría como leída', ido: 'Entendido, marcado como visto', wedo: 'Práctica completada', youdo: 'Proyecto enviado a mi GitHub' }

const local = (page) => page.evaluate(() => {
  const s = JSON.parse(localStorage.getItem('python-ds-progress') || '{}').state || {}
  return { complete: (s.completedSections || []).includes('setup'), steps: (s.completedSubSteps || {}).setup || [] }
})
const server = (page) => page.evaluate(async () => {
  const r = await fetch('/api/v1/me/progress', { credentials: 'include', headers: { 'x-pyarcana': '1' } })
  return r.json()
})
// GET /api/v1/me/progress answers {ok, rev, doc: {state: {completedSections, completedSubSteps, …}}}.
const remoteSetup = (body) => ({ complete: (body?.doc?.state?.completedSections || []).includes('setup'), steps: body?.doc?.state?.completedSubSteps?.setup || [] })

async function takeQuiz(page) {
  await page.getByTestId('tab-quiz').click()
  for (let i = 0; i < RIGHT.length; i++) await page.getByTestId(`sc-q-${i}-opt-${RIGHT[i]}`).click()
  await page.getByTestId('sc-submit').click()
  await page.getByTestId('sc-result').waitFor()
}

try {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1'); localStorage.setItem('pyarcana:qaTourCompleted', '1') } catch {} })
  await ctx.addCookies([{ name: '__Host-pa_session', value: tokens.paid.token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
  const page = await ctx.newPage()
  await page.goto(`${BASE}/#setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1000)

  for (const [tab, label] of Object.entries(LABELS)) {
    await page.getByTestId(`tab-${tab}`).click()
    await page.getByRole('button', { name: label }).click()
  }
  // W07: done is a status; the green «Completado» is not a button any more, and undo is explicit.
  await page.getByTestId('tab-youdo').click()
  const greenButton = await page.getByRole('button', { name: 'Completado', exact: true }).count()
  await page.getByTestId('step-undo').click()
  const afterUndo = (await local(page)).steps.includes('youdo')
  await page.getByRole('button', { name: LABELS.youdo }).click()
  const afterRedo = (await local(page)).steps.includes('youdo')
  record('W07: a done step is a status with a separate «Desmarcar»', greenButton === 0 && !afterUndo && afterRedo, `green toggle buttons=${greenButton}, undo removed=${!afterUndo}, redo added=${afterRedo}`)

  // W01: pass, press the result card's button if it is offered, retake twice.
  await takeQuiz(page)
  const afterPass = await local(page)
  const cardButton = page.getByRole('button', { name: 'Marcar como completada' })
  const offered = await cardButton.count()
  if (offered) await cardButton.click()
  const afterCard = await local(page)
  for (let i = 0; i < 2; i++) { await page.getByRole('button', { name: 'Reintentar' }).click(); await takeQuiz(page) }
  const afterRetakes = await local(page)
  const ok = [afterPass, afterCard, afterRetakes].every((s) => s.complete && s.steps.includes('quiz'))
  record('W01: passing, the result card and retakes all leave the section complete', ok, JSON.stringify({ afterPass, offered, afterCard, afterRetakes }))

  // On the account: reload (pulls from the server after a flush) and ask the API.
  await page.waitForTimeout(6500) // past the push debounce (PUSH_DEBOUNCE_MS = 5000)
  const remote = remoteSetup(await server(page))
  record('W01: the account has the section complete with its quiz step', remote.complete && remote.steps.includes('quiz'), JSON.stringify(remote))

  // W10: undo a step and close the tab at once; the pagehide flush must still send it.
  await page.getByTestId('tab-theory').click()
  await page.getByTestId('step-undo').click()
  await page.close({ runBeforeUnload: true })
  const check = await ctx.newPage()
  await check.goto(`${BASE}/cuenta`, { waitUntil: 'domcontentloaded' })
  await check.waitForTimeout(1500)
  const after = remoteSetup(await server(check))
  record('W10: a change made right before closing the tab reaches the account', !after.steps.includes('theory') && after.steps.includes('quiz'), JSON.stringify(after))
  await ctx.close()
} catch (e) {
  record('progress flow', false, `threw: ${e.message.split('\n')[0]}`)
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\nprogress: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
