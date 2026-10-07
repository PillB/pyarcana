// Chromium check of the QA round of 5 Oct 2026 on the real local stack (wrangler dev --local):
// 1. Ctrl + Alt + Q opens the QA window in this browser (Chromium on Linux, no platform faked);
//    Ctrl + Q alone does not. Key events go through the browser's input pipeline (DevTools
//    protocol): synthetic input on the real platform. macOS keys are checked on a real Mac
//    keyboard (`node live.e2e.mjs --keys`); other layouts are in the unit matrix (hotkeys.test.ts).
// 2. A tester's session accrues active time and sections, and is sent to the team.
// 3. Ctrl/⌘ + Alt + S: one forced upload; a check/uncheck flip-flop gets the cooldown message and
//    no upload; autosave still saves the change.
// 4. Admin → QA: the counts, then the CSV and JSON downloads; the JSON opens in the QA workspace.
import { chromium } from 'playwright'
import { launchOptions } from './sandbox-trust.mjs'
import { mkdirSync, readFileSync } from 'node:fs'

const BASE = 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
const browser = await chromium.launch(launchOptions())
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

async function flow(name, fn) {
  try { await fn() } catch (e) { record(name, false, `threw: ${e.message.split('\n')[0]}`) }
}

// The browser is what it is: Chromium on Linux. No user agent or platform is faked (5 Oct 2026);
// macOS keys are checked on a real Mac keyboard with `node live.e2e.mjs --keys`.
async function contextFor(who, { qa = null } = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE', acceptDownloads: true })
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

const api = (page, method, path, body) => page.evaluate(async ([m, p, b]) => {
  const r = await fetch(`/api${p}`, { method: m, credentials: 'include', headers: { 'content-type': 'application/json', 'x-pyarcana': '1' }, body: b ? JSON.stringify(b) : undefined })
  let j = null
  try { j = await r.json() } catch {}
  return { status: r.status, body: j }
}, [method, path, body])

const ALT = 1
const CTRL = 2

/** One key press exactly as the browser receives it from the operating system. */
async function press(page, { key, code, modifiers, text }) {
  const cdp = await page.context().newCDPSession(page)
  const vk = code.startsWith('Key') ? code.charCodeAt(3) : 0
  await cdp.send('Input.dispatchKeyEvent', { type: text ? 'keyDown' : 'rawKeyDown', key, code, modifiers, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk, ...(text ? { text, unmodifiedText: text } : {}) })
  await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key, code, modifiers, windowsVirtualKeyCode: vk, nativeVirtualKeyCode: vk })
  await cdp.detach()
  await page.waitForTimeout(600)
}

const dialogOpen = (page) => page.getByTestId('qa-harness-dialog').isVisible().catch(() => false)

async function closeDialog(page) {
  if (await dialogOpen(page)) {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(400)
  }
}

// 1. The QA hotkey, per platform.
await flow('QA hotkey', async () => {
  const cases = [
    { name: 'Linux (this browser) Ctrl + Alt + Q opens the QA window', ev: { key: 'q', code: 'KeyQ', modifiers: CTRL | ALT }, want: true },
    { name: 'Ctrl + Q alone does not open it', ev: { key: 'q', code: 'KeyQ', modifiers: CTRL }, want: false },
  ]
  for (const c of cases) {
    const ctx = await contextFor('tester')
    const page = await open(ctx, '/#setup')
    await closeDialog(page)
    await page.locator('body').click({ position: { x: 5, y: 5 } })
    await press(page, c.ev)
    const opened = await dialogOpen(page)
    record(c.name, opened === c.want, `opened=${opened}`)
    await ctx.close()
  }
})

// 2. A tester's session: active time and sections, sent to the team.
let sessionSent = false
await flow('QA session', async () => {
  const ctx = await contextFor('tester', { qa: { testMode: true, adPreview: false } })
  const page = await open(ctx, '/#setup')
  // Two 15 s ticks of real, attended use: input every few seconds.
  for (let i = 0; i < 17; i++) {
    await page.mouse.wheel(0, i % 2 ? 200 : -200)
    await page.waitForTimeout(2000)
  }
  await page.getByTestId('qa-harness-open').click()
  await page.getByTestId('qa-harness-dialog').waitFor()
  await page.getByTestId('qa-tab-session').click()
  const active = (await page.getByTestId('qa-session-active').textContent())?.trim()
  const sections = Number((await page.getByTestId('qa-session-sections').textContent())?.trim())
  record('the session counts active time and the section on screen', /^\d+ s$/.test(active ?? '') && Number.parseInt(active, 10) >= 15 && sections >= 1, `active=${active} sections=${sections}`)
  const stored = await page.evaluate(() => sessionStorage.getItem('pyarcana:qa-session-stats:v1'))
  record('the session lives in this tab (sessionStorage)', /"sections":\{"setup":\d+/.test(stored ?? ''), (stored ?? '').slice(0, 160))
  await page.getByTestId('qa-session-send').click()
  await page.waitForTimeout(1500)
  const note = await page.getByTestId('qa-cloud-session').getByRole('status').allTextContents()
  // Sent by the click, or already sent by the automatic send a moment earlier: either way it says so.
  sessionSent = note.includes('Resumen enviado.') || note.some((n) => n.startsWith('Ya enviado'))
  record('a signed-in tester sends the session summary, and the button says what happened', sessionSent, note.join(' | '))
  // Write and send one report, so admin has something to count and download.
  await page.getByTestId('qa-tab-report').click()
  await page.getByTestId('qa-title').fill('E2E QA: el índice no se actualiza')
  await page.getByTestId('qa-description').fill('Tras marcar la teoría, el índice sigue igual.')
  await page.getByTestId('qa-repro').fill('1. Abrir setup\n2. Marcar teoría')
  await page.getByTestId('qa-save-issue').click()
  await page.getByTestId('qa-tab-review').click()
  await page.getByTestId('qa-issue-row').first().click()
  await page.getByTestId('qa-send-issue').click()
  await page.getByTestId('qa-sent-mark').waitFor({ timeout: 15000 })
  await page.screenshot({ path: `${OUT}qa-session-sent.png` })
  await ctx.close()
})

// 3. The force-sync hotkey and its guard.
await flow('force-sync hotkey', async () => {
  const ctx = await contextFor('gift')
  const page = await open(ctx, '/#setup')
  const choice = page.getByTestId('sync-owner-choice')
  if (await choice.isVisible().catch(() => false)) await choice.getByRole('button').first().click()
  await page.waitForTimeout(6500) // the first pull and any autosave settle
  const puts = []
  page.on('request', (r) => { if (r.method() === 'PUT' && r.url().includes('/v1/me/progress')) puts.push(Date.now()) })
  const bookmark = page.getByRole('button', { name: 'Marcar como favorito' }).first()
  const s = { key: 's', code: 'KeyS', modifiers: CTRL | ALT }
  const toast = async (re) => (await page.locator('body').textContent())?.match(re)?.[0] ?? null

  await press(page, s)
  record('Ctrl + Alt + S with nothing new: "Ya está guardado", no upload', (await toast(/Ya está guardado/)) !== null && puts.length === 0, `PUTs=${puts.length}`)

  await page.waitForTimeout(10_500)
  await bookmark.click({ force: true })
  await press(page, s)
  await page.waitForTimeout(1500)
  record('a real change: Ctrl + Alt + S sends one upload and says it is saved', puts.length === 1 && (await toast(/Guardado en tu cuenta/)) !== null, `PUTs=${puts.length}`)

  await page.waitForTimeout(10_500)
  await bookmark.click({ force: true }) // back to the state before: a flip-flop
  const before = puts.length
  await press(page, s)
  const flip = await toast(/Has marcado y desmarcado lo mismo varias veces\. Espera \d+ s/)
  record('check, force, uncheck, force: refused with the cooldown, no forced upload', flip !== null && puts.length === before, `${flip} PUTs=${puts.length - before}`)
  await page.screenshot({ path: `${OUT}qa-force-flipflop.png` })

  for (let i = 0; i < 30 && puts.length === before; i++) await page.waitForTimeout(1000)
  const remote = await api(page, 'GET', '/v1/me/progress')
  record('autosave still saves the change the force refused', puts.length === before + 1 && !JSON.stringify(remote.body?.doc?.state?.bookmarks ?? []).includes('setup'), `PUTs=${puts.length - before}`)
  await ctx.close()
})

// 4. Admin → QA: counts, CSV and JSON; the JSON opens in the QA workspace.
await flow('admin QA tab', async () => {
  const ctx = await contextFor('admin')
  const page = await open(ctx, '/admin')
  await page.getByRole('tab', { name: 'QA' }).click()
  await page.getByTestId('qa-stats').waitFor({ timeout: 15000 })
  const card = async (key) => (await page.locator(`[data-testid="qa-summary"] [data-key="${key}"] dd`).textContent())?.trim()
  const reports = Number(await card('reports'))
  const sessions = Number(await card('sessions'))
  record('admin QA tab: reports and sessions counted', reports >= 1 && sessions >= 1, `reports=${reports} sessions=${sessions} coverage=${await card('coverage')}`)
  record('admin QA tab: time per section and per tester', (await page.getByTestId('qa-section-time').count()) === 1 && (await page.getByTestId('qa-testers').count()) === 1 && (await page.getByTestId('qa-by-severity').count()) === 1)
  await page.screenshot({ path: `${OUT}qa-admin-tab.png`, fullPage: true })

  const [csv] = await Promise.all([page.waitForEvent('download'), page.getByTestId('qa-download-csv').click()])
  const csvText = readFileSync(await csv.path(), 'utf8')
  record('Descargar CSV: a dated file with BOM, header and the report', /^pyarcana-qa-\d{4}-\d\d-\d\d\.csv$/.test(csv.suggestedFilename()) && csvText.startsWith('﻿"id"') && csvText.includes('E2E QA: el índice no se actualiza'), csv.suggestedFilename())

  const [json] = await Promise.all([page.waitForEvent('download'), page.getByTestId('qa-download-json').click()])
  const jsonPath = await json.path()
  const pkg = JSON.parse(readFileSync(jsonPath, 'utf8'))
  record('Descargar JSON: the pyarcana.qa.v1 package with the sessions', pkg.schemaVersion === 'pyarcana.qa.v1' && pkg.issueCount >= 1 && Array.isArray(pkg.sessions), `issues=${pkg.issueCount} sessions=${pkg.sessions?.length}`)

  // The admin's own QA workspace opens it with "Importar".
  const course = await open(ctx, '/#setup')
  await course.getByTestId('qa-harness-open').click()
  await course.getByTestId('qa-harness-dialog').waitFor()
  await course.getByTestId('qa-tab-session').click()
  await course.locator('input[type="file"][accept*="json"]').setInputFiles(jsonPath)
  await course.waitForTimeout(1500)
  const msg = await course.getByTestId('qa-message').textContent().catch(() => '')
  record('the JSON download opens in the QA workspace (Importar)', new RegExp(`Importadas ${pkg.issueCount} incidencias`).test(msg ?? ''), msg)
  const alias = await course.evaluate(() => localStorage.getItem('pyarcana:qa-tester:v1'))
  record('importing does not rename the importer', alias === null || alias === '', `alias=${alias}`)
  await ctx.close()
})

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
