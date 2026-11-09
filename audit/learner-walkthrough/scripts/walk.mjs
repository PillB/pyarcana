// Learner walkthrough of PyArcana in Chromium, one section at a time, as the persona in REPORT.md.
// For each section it does what a learner does and records what a learner would see:
//   Theory  → reads, runs the "Pruébalo tú mismo" playground in Pyodide, follows its hint once,
//             marks the theory read;
//   I Do    → steps every demo to "Ejecutar y ver la salida", checks whether Pyodide ran;
//   We Do   → opens every exercise, reveals the solution;
//   You Do  → reads the project, records what it asks for and where it is submitted;
//   Quiz    → if an exam shows, records it; else answers the self-check once with one wrong answer
//             (to read the feedback), then all correct, then clicks the result card's button;
//   then records progress state from localStorage and follows "section-next".
// Console errors, page errors and failed requests are recorded per section. Nothing is faked: the
// site is the local build of HEAD, the account is a seeded paid learner, and Pyodide is the official
// 0.26.2 release served from local disk under its jsDelivr URL (jsDelivr is blocked in this sandbox;
// see REPORT.md "What was not covered" — MUST item).
//
//   node audit/learner-walkthrough/scripts/walk.mjs S01 S13      # inclusive range
// Env: BASE (default http://localhost:8787), PYODIDE_DIR (local copy of pyodide-0.26.2/pyodide),
//      PROFILE (persistent Chromium profile, so QA issues and progress persist across runs),
//      WHO (seeded account, default paid), OUT (data dir).
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const REPO = path.resolve(HERE, '../../..')
const E2E = path.join(REPO, 'workers/billing/e2e')
const require = createRequire(path.join(E2E, 'package.json'))
const { chromium } = require('playwright')
const { sandboxTrustArgs } = await import(path.join(E2E, 'sandbox-trust.mjs'))

const BASE = process.env.BASE || 'http://localhost:8787'
const PYODIDE_DIR = process.env.PYODIDE_DIR || '/tmp/claude-0/pyodide/pyodide'
const PROFILE = process.env.PROFILE || '/tmp/claude-0/walk-profile'
const WHO = process.env.WHO || 'paid'
const OUT = process.env.OUT || path.join(REPO, 'audit/learner-walkthrough/data/walk')
const SHOTS = path.join(REPO, 'audit/learner-walkthrough/shots')
mkdirSync(OUT, { recursive: true })
mkdirSync(SHOTS, { recursive: true })

// The live section list, as extracted from src/lib/course/index.ts by extract_sections.ts.
// (course-state/interaction_catalog.json is stale: its ids predate the section renames.)
const SECTIONS_DIR = process.env.SECTIONS_DIR || '/tmp/claude-0/sections'
const { readdirSync } = await import('node:fs')
const all = readdirSync(SECTIONS_DIR).filter((n) => /^S\d\d-.*(?<!\.exam)\.json$/.test(n)).sort()
  .map((n) => JSON.parse(readFileSync(path.join(SECTIONS_DIR, n), 'utf8')))
const [from, to] = [process.argv[2] || 'S01', process.argv[3] || process.argv[2] || 'S52'].map((s) => Number(s.replace(/\D/g, '')))
const sections = all.filter((s) => s.index >= from && s.index <= to)
const sectionData = (id) => all.find((s) => s.id === id)

// The SRI the site pins for pyodide.js; the local file must match it or the browser refuses it.
const SRI = /script\.integrity = '(sha384-[^']+)'/.exec(readFileSync(path.join(REPO, 'src/components/course/CodePlayground.tsx'), 'utf8'))[1]
const localSri = 'sha384-' + createHash('sha384').update(readFileSync(path.join(PYODIDE_DIR, 'pyodide.js'))).digest('base64')
if (localSri !== SRI) throw new Error(`local pyodide.js ${localSri} does not match the site's SRI ${SRI}`)

const MIME = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.wasm': 'application/wasm', '.json': 'application/json', '.whl': 'application/zip', '.zip': 'application/zip', '.tar': 'application/x-tar', '.data': 'application/octet-stream' }

const ctx = await chromium.launchPersistentContext(PROFILE, {
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium',
  headless: true,
  args: sandboxTrustArgs(),
  viewport: { width: 1366, height: 768 },
  locale: 'es-PE',
  timezoneId: 'America/Lima',
  acceptDownloads: true,
})
const tokens = JSON.parse(readFileSync(path.join(E2E, 'tokens.json'), 'utf8'))
if (WHO !== 'anon') {
  await ctx.addCookies([{ name: '__Host-pa_session', value: tokens[WHO].token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
}
const pyodideHits = []
await ctx.route('https://cdn.jsdelivr.net/pyodide/v0.26.2/full/**', async (route) => {
  const name = decodeURIComponent(new URL(route.request().url()).pathname.split('/full/')[1] || '')
  const file = path.join(PYODIDE_DIR, name)
  if (!name || !file.startsWith(PYODIDE_DIR) || !existsSync(file)) {
    pyodideHits.push({ name, status: 404 })
    return route.fulfill({ status: 404, body: 'not in the 0.26.2 release' })
  }
  pyodideHits.push({ name, status: 200 })
  return route.fulfill({ status: 200, path: file, headers: { 'content-type': MIME[path.extname(file)] || 'application/octet-stream', 'access-control-allow-origin': '*' } })
})

const page = ctx.pages()[0] || (await ctx.newPage())
let current = null
const sink = () => current?.events
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) sink()?.push({ kind: `console.${m.type()}`, text: m.text().slice(0, 400), tab: current?.tab }) })
page.on('pageerror', (e) => sink()?.push({ kind: 'pageerror', text: String(e.stack || e.message).slice(0, 600), tab: current?.tab }))
page.on('requestfailed', (r) => sink()?.push({ kind: 'requestfailed', text: `${r.method()} ${r.url().slice(0, 200)} ${r.failure()?.errorText}`, tab: current?.tab }))
page.on('response', (r) => { if (r.status() >= 400 && !r.url().includes('/__')) sink()?.push({ kind: `http.${r.status()}`, text: `${r.request().method()} ${r.url().slice(0, 200)}`, tab: current?.tab }) })

const text = (loc) => loc.innerText({ timeout: 5000 }).catch(() => '')
const visible = (loc) => loc.isVisible().catch(() => false)
const panel = () => page.locator('[role="tabpanel"][data-state="active"]')

async function gotoSection(id) {
  await page.goto(`${BASE}/?walk=${Date.now()}#${id}`, { waitUntil: 'domcontentloaded' })
  await page.waitForFunction((sid) => document.querySelector('[data-testid="section-root"]')?.getAttribute('data-section-id') === sid, id, { timeout: 30000 })
  await page.waitForTimeout(800)
}

// The first-visit onboarding tour, taken as a learner takes it: read each step, press Siguiente.
async function onboardingTour() {
  const steps = []
  const box = page.getByText(/^PASO \d+ DE \d+$/i)
  if (!(await box.first().isVisible().catch(() => false))) return null
  for (let i = 0; i < 40; i++) {
    if (!(await box.first().isVisible().catch(() => false))) break
    const dialog = box.first().locator('xpath=ancestor::*[.//button][1]/..')
    steps.push((await dialog.innerText().catch(() => '')).replace(/\s+/g, ' ').trim().slice(0, 600))
    if (i === 0) await page.screenshot({ path: path.join(SHOTS, 'onboarding-tour-step1.png') })
    await page.keyboard.press('Enter')
    await page.waitForTimeout(500)
  }
  writeFileSync(path.join(OUT, 'onboarding-tour.json'), JSON.stringify(steps, null, 1))
  return steps.length
}

async function openTab(tab) {
  current.tab = tab
  await page.getByTestId(`tab-${tab}`).click()
  await page.waitForTimeout(400)
}

async function markDone(label) {
  const btn = panel().getByRole('button', { name: label })
  if (!(await btn.count())) return 'absent'
  await btn.last().scrollIntoViewIfNeeded().catch(() => {})
  // A done step's button reads "Completado" and clicking it again un-marks the step (a toggle):
  // a learner revisiting would not mean to, so the walk never clicks it.
  if ((await text(btn.last())).trim() === 'Completado') return 'already'
  await btn.last().click()
  await page.waitForTimeout(300)
  return (await text(btn.last())) || 'clicked'
}

async function progress(id) {
  return page.evaluate((sid) => {
    try {
      const raw = JSON.parse(localStorage.getItem('python-ds-progress') || '{}')
      const st = raw.state || raw
      return { subSteps: (st.completedSubSteps || {})[sid] || [], complete: (st.completedSections || []).includes(sid), quizScore: (st.quizScores || {})[sid] ?? null }
    } catch (e) { return { error: String(e) } }
  }, id)
}

async function overflowAt(width) {
  const prev = page.viewportSize()
  await page.setViewportSize({ width, height: 844 })
  await page.waitForTimeout(400)
  const r = await page.evaluate(() => {
    const w = document.documentElement.clientWidth
    const off = [...document.querySelectorAll('[role="tabpanel"][data-state="active"] *')].filter((el) => {
      const b = el.getBoundingClientRect()
      if (b.width === 0 || el.closest('[data-testid="code-block"], pre, .overflow-x-auto')) return false
      return b.right > w + 1 || b.left < -1
    }).slice(0, 5).map((el) => `${el.tagName.toLowerCase()}:${(el.textContent || '').trim().slice(0, 60)}`)
    return { scrollWidth: document.documentElement.scrollWidth, clientWidth: w, offenders: off }
  })
  await page.setViewportSize(prev)
  return r
}

async function theory(s, rec) {
  await openTab('theory')
  const p = panel()
  rec.theory = {
    headings: await p.locator('h2,h3').count(),
    codeBlocks: await p.locator('[data-testid="code-block"]').count(),
    termHints: await p.locator('[data-testid^="term-hint"], abbr, [data-glossary-term]').count(),
    optional: await p.getByText('Profundización opcional').count(),
    words: ((await text(p)).match(/\S+/g) || []).length,
  }
  const pg = page.getByTestId(`demo-playground-${s.id}`)
  rec.playground = { present: await visible(pg) }
  if (rec.playground.present) {
    const run = page.getByTestId(`demo-run-${s.id}-run`)
    const root = page.getByTestId(`demo-run-${s.id}`)
    rec.playground.title = (await text(root.locator('div').first())).split('\n')[0]
    await run.scrollIntoViewIfNeeded()
    const t0 = Date.now()
    try {
      await page.waitForFunction((sel) => !document.querySelector(sel)?.disabled, `[data-testid="demo-run-${s.id}-run"]`, { timeout: 180000 })
      rec.playground.readyMs = Date.now() - t0
      await run.click()
      await page.waitForFunction((sel) => {
        const root = document.querySelector(sel)
        return root && !root.textContent.includes('Ejecutando...') && /coincide con lo esperado|Output diferente|Error|Traceback/.test(root.textContent) || (root && !root.textContent.includes('Presiona Run') && !root.textContent.includes('Ejecutando...'))
      }, `[data-testid="demo-run-${s.id}"]`, { timeout: 120000 })
      await page.waitForTimeout(500)
      const body = await text(root)
      rec.playground.verdict = /coincide con lo esperado/.test(body) ? 'match' : /Output diferente/.test(body) ? 'mismatch' : 'no-verdict'
      rec.playground.output = body.split('OUTPUT').pop().split(/¡Correcto!|Output diferente|Ver pista/)[0].trim().slice(0, 1500)
      // Follow the hint as a learner would: read it, then make the smallest edit it asks for.
      const hintBtn = root.getByText('Ver pista')
      if (await hintBtn.count()) { await hintBtn.click(); rec.playground.hint = (await text(root)).split('Ocultar pista').pop().trim().slice(0, 400) }
      // The smallest edit a learner makes to "experiment": change the first string literal, run again.
      const ta = root.locator('textarea')
      const code = await ta.inputValue()
      const m = /"([^"\n]{3,})"/.exec(code)
      if (m) {
        await ta.fill(code.replace(m[0], `"${m[1]} 2"`))
        await run.click()
        await page.waitForFunction((sel) => /coincide con lo esperado|Output diferente/.test(document.querySelector(sel)?.textContent || ''), `[data-testid="demo-run-${s.id}"]`, { timeout: 60000 }).catch(() => {})
        const after = await text(root)
        rec.playground.afterEdit = { edited: m[0], verdict: /coincide con lo esperado/.test(after) ? 'match' : /Output diferente/.test(after) ? 'mismatch' : 'no-verdict', message: (/(¡Correcto![^\n]*|Output diferente[^\n]*)/.exec(after) || [])[1] || null }
        await root.getByTestId(`demo-run-${s.id}-reset`).click().catch(() => {})
      }
    } catch (e) {
      rec.playground.error = String(e.message).split('\n')[0]
      rec.playground.loadError = (await text(root)).includes('No se pudo cargar el editor Python')
    }
  }
  rec.theoryDone = await markDone(/Marcar teoría como leída|Completado/)
}

async function ido(s, rec) {
  await openTab('ido')
  const cards = panel().locator('[data-testid^="demo-"]').filter({ has: page.getByTestId('stepped-code') })
  const n = await cards.count()
  rec.ido = { demos: n, steppedRuns: 0, realExecution: false }
  const pyodideBefore = pyodideHits.length
  for (let i = 0; i < n; i++) {
    const c = cards.nth(i)
    for (let k = 0; k < 40; k++) {
      const adv = c.getByTestId('ido-advance')
      if (!(await visible(adv))) break
      await adv.click()
      await page.waitForTimeout(80)
    }
    const run = c.getByTestId('ido-run')
    if (await visible(run)) { await run.click(); rec.ido.steppedRuns += 1; await page.waitForTimeout(150) }
  }
  // "Ejecutar y ver la salida": does it execute (Pyodide traffic / a new output) or unblur text?
  rec.ido.realExecution = pyodideHits.length > pyodideBefore
  rec.idoDone = await markDone(/Entendido, marcado como visto|Completado/)
}

async function wedo(s, rec) {
  await openTab('wedo')
  const ex = panel().locator('[data-testid^="exercise-"]:not([data-testid^="exercise-check"]):not([data-testid^="exercise-feedback"])')
  const n = await ex.count()
  rec.wedo = { exercises: n, revealed: 0, editable: 0, kinds: {} }
  for (let i = 0; i < n; i++) {
    const card = ex.nth(i)
    rec.wedo.editable += await card.locator('textarea, [contenteditable="true"], .cm-editor').count()
    const kind = /Tipo:\s*(\S+)/.exec(await text(card))
    if (kind) rec.wedo.kinds[kind[1]] = (rec.wedo.kinds[kind[1]] || 0) + 1
    const btn = card.locator('[data-testid^="exercise-check-"]')
    if (await btn.count()) {
      await btn.scrollIntoViewIfNeeded().catch(() => {})
      await btn.click()
      if (await visible(card.locator('[data-testid^="exercise-feedback-"]'))) rec.wedo.revealed += 1
    }
  }
  rec.wedoDone = await markDone(/Práctica completada|Completado/)
}

async function youdo(s, rec) {
  await openTab('youdo')
  const body = await text(panel())
  rec.youdo = {
    words: (body.match(/\S+/g) || []).length,
    mentionsGithub: /github/i.test(body),
    links: await panel().locator('a[href]').count(),
    uploadOrSubmit: await panel().locator('input[type="file"], textarea, input[type="url"]').count(),
    rubricRows: (body.match(/\b\d{1,2}\s?%/g) || []).length,
  }
  rec.youdoDone = await markDone(/Proyecto enviado a mi GitHub|Completado/)
}

async function quiz(s, rec, data) {
  await openTab('quiz')
  const p = panel()
  const body = await text(p)
  rec.quiz = { examShown: /Examen|examen/.test(body) && (await p.getByTestId('sc-submit').count()) === 0, intro: body.slice(0, 300) }
  const qs = data?.selfCheck?.questions || []
  if (!(await p.getByTestId('sc-submit').count()) || !qs.length) { rec.quiz.selfCheck = 'absent'; return }
  rec.quiz.questions = qs.length
  // Attempt 1: everything right except question 0, to read what the learner is told on a miss.
  for (let q = 0; q < qs.length; q++) {
    const pick = q === 0 ? (qs[q].correctIndex + 1) % qs[q].options.length : qs[q].correctIndex
    await p.getByTestId(`sc-q-${q}-opt-${pick}`).click()
  }
  await p.getByTestId('sc-submit').click()
  await page.waitForTimeout(2500) // the score ring animates up to its value
  rec.quiz.attempt1 = { result: (await text(p.getByTestId('sc-result'))).slice(0, 300), missFeedback: (await text(p.getByTestId('sc-q-0'))).slice(-500) }
  rec.quiz.afterAttempt1 = await progress(s.id)
  // The result card's own button, as a learner would click it after passing.
  const cta = p.getByRole('button', { name: /Marcar como completada/ })
  if (await cta.count()) {
    await cta.click()
    await page.waitForTimeout(400)
    rec.quiz.afterCta = await progress(s.id)
  }
}

async function nextSection(s, rec) {
  const next = page.getByTestId('section-next')
  rec.next = { present: await visible(next) }
  if (rec.next.present) {
    rec.next.label = (await text(next)).replace(/\s+/g, ' ').slice(0, 120)
  }
}

for (const s of sections) {
  const id = s.id
  const sid = `S${String(s.index).padStart(2, '0')}`
  const data = sectionData(id)
  const rec = { section: sid, id, title: s.title, at: new Date().toISOString(), events: [] }
  current = { tab: 'load', events: rec.events }
  const t0 = Date.now()
  try {
    await gotoSection(id)
    const tourSteps = await onboardingTour()
    if (tourSteps !== null) { rec.onboardingTourSteps = tourSteps; await gotoSection(id) } // the tour ends on the Dashboard
    rec.signedIn = await page.evaluate(async () => { try { const r = await fetch('/api/v1/me', { credentials: 'include' }); const j = await r.json().catch(() => null); return { status: r.status, email: j?.account?.email ? 'present' : null, access: j?.access ?? j?.entitlement ?? null } } catch (e) { return { error: String(e) } } })
    rec.header = (await text(page.getByTestId('section-root').locator('h1, h2').first())).slice(0, 200)
    await theory(s, rec)
    rec.mobileTheory = await overflowAt(390)
    await ido(s, rec)
    await wedo(s, rec)
    await youdo(s, rec)
    rec.beforeQuiz = await progress(id)
    await quiz(s, rec, data)
    rec.final = await progress(id)
    await nextSection(s, rec)
  } catch (e) {
    rec.fatal = String(e.message).split('\n')[0]
    await page.screenshot({ path: path.join(SHOTS, `${sid}-fatal.png`) }).catch(() => {})
  }
  rec.ms = Date.now() - t0
  writeFileSync(path.join(OUT, `${sid}.json`), JSON.stringify(rec, null, 1))
  const pg = rec.playground || {}
  console.log(`${sid} ${id} pg=${pg.present ? pg.verdict || pg.error : 'none'} ido=${rec.ido?.demos}/${rec.ido?.realExecution ? 'exec' : 'canned'} wedo=${rec.wedo?.revealed}/${rec.wedo?.exercises} edit=${rec.wedo?.editable} exam=${rec.quiz?.examShown} q1=${JSON.stringify(rec.quiz?.afterAttempt1)} cta=${JSON.stringify(rec.quiz?.afterCta)} ev=${rec.events.length}${rec.fatal ? ' FATAL ' + rec.fatal : ''}`)
}
writeFileSync(path.join(OUT, `pyodide-requests-${from}-${to}.json`), JSON.stringify(pyodideHits.reduce((a, h) => { a[`${h.status} ${h.name}`] = (a[`${h.status} ${h.name}`] || 0) + 1; return a }, {}), null, 1))
await ctx.close()
