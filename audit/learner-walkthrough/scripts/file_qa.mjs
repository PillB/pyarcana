// Files walkthrough findings through the course's own QA workspace (QAHarness), one report per
// finding, from the page where it happens, so the captured context (section, tab, scroll, window,
// SHA) is the real one. Then, with --export, downloads the session JSON from the Sesión tab.
//
//   node audit/learner-walkthrough/scripts/file_qa.mjs findings.json [--tour] [--export out.json]
// findings.json: [{ id, sectionId|null, tab|null, path?, scrollTo?, category, cause, severity,
//                   title, description, expected, actual, repro, improvement }]
// Values for category/cause/severity are the ones in src/lib/qa-session.ts. Same persistent profile
// as walk.mjs, so issues accumulate in that browser's IndexedDB across runs; ids already filed (kept
// in <profile>/filed.json) are skipped, so a rerun after a crash files only what is missing.
import { createRequire } from 'node:module'
import { existsSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs'
import path from 'node:path'

const HERE = path.dirname(new URL(import.meta.url).pathname)
const REPO = path.resolve(HERE, '../../..')
const E2E = path.join(REPO, 'workers/billing/e2e')
const require = createRequire(path.join(E2E, 'package.json'))
const { chromium } = require('playwright')
const { sandboxTrustArgs } = await import(path.join(E2E, 'sandbox-trust.mjs'))

const BASE = process.env.BASE || 'http://localhost:8787'
const PROFILE = process.env.PROFILE || '/tmp/claude-0/walk-profile'
const args = process.argv.slice(2)
const findingsPath = args[0]
const exportTo = args.includes('--export') ? args[args.indexOf('--export') + 1] : null
const doTour = args.includes('--tour')
const findings = findingsPath && findingsPath !== '-' ? JSON.parse(readFileSync(findingsPath, 'utf8')) : []
const ledgerPath = path.join(PROFILE, 'filed.json')
const filed = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, 'utf8')) : {}

const ctx = await chromium.launchPersistentContext(PROFILE, {
  executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', headless: true, args: sandboxTrustArgs(),
  viewport: { width: 1366, height: 768 }, locale: 'es-PE', timezoneId: 'America/Lima', acceptDownloads: true,
})
const tokens = JSON.parse(readFileSync(path.join(E2E, 'tokens.json'), 'utf8'))
await ctx.addCookies([{ name: '__Host-pa_session', value: tokens[process.env.WHO || 'paid'].token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
const page = ctx.pages()[0] || (await ctx.newPage())

async function openHarness() {
  if (await page.getByTestId('qa-harness-dialog').isVisible().catch(() => false)) return
  // Ctrl + Alt + Q, the documented shortcut, as the browser receives it.
  await page.keyboard.press('Control+Alt+KeyQ')
  await page.waitForTimeout(500)
  if (!(await page.getByTestId('qa-harness-dialog').isVisible().catch(() => false))) {
    const link = page.getByTestId('qa-harness-open')
    await link.scrollIntoViewIfNeeded()
    await link.click()
  }
  await page.getByTestId('qa-harness-dialog').waitFor({ timeout: 10000 })
}

async function goTo(f) {
  const url = f.path ? `${BASE}${f.path}` : `${BASE}/?qa=${Date.now()}${f.sectionId ? `#${f.sectionId}` : ''}`
  await page.goto(url, { waitUntil: 'domcontentloaded' })
  if (f.sectionId) {
    await page.waitForFunction((sid) => document.querySelector('[data-testid="section-root"]')?.getAttribute('data-section-id') === sid, f.sectionId, { timeout: 30000 })
    if (f.tab) { await page.getByTestId(`tab-${f.tab}`).click(); await page.waitForTimeout(400) }
    if (f.scrollTo) {
      const el = page.locator(f.scrollTo).first()
      if (await el.count()) await el.scrollIntoViewIfNeeded().catch(() => {})
    }
  } else {
    await page.waitForTimeout(1500)
  }
}

const tour = []
if (doTour) {
  await page.goto(`${BASE}/#setup`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)
  await openHarness()
  // The tutorial opens by itself the first time; otherwise open it from its button.
  await page.waitForTimeout(800)
  if (!(await page.getByTestId('qa-tour').isVisible().catch(() => false))) await page.getByTestId('qa-tour-open').click()
  await page.getByTestId('qa-tour').waitFor()
  for (let i = 0; i < 30; i++) {
    const t = (await page.getByTestId('qa-tour').innerText()).replace(/\s+/g, ' ').trim()
    tour.push(t)
    const next = page.getByTestId('qa-tour').getByRole('button', { name: /^(Siguiente|Terminar)$/ })
    if (!(await next.count())) break
    const label = (await next.last().innerText()).trim()
    await next.last().click()
    await page.waitForTimeout(500)
    if (label === 'Terminar') break
  }
  writeFileSync(path.join(REPO, 'audit/learner-walkthrough/data/qa-tour.json'), JSON.stringify(tour, null, 1))
  console.log(`tour: ${tour.length} steps`)
  await page.keyboard.press('Escape').catch(() => {})
}

// --replace W01,W02: delete those already-filed reports in Revisión (the workspace's own «Eliminar»)
// so the loop below files the corrected version, instead of leaving a stale duplicate.
const replace = args.includes('--replace') ? args[args.indexOf('--replace') + 1].split(',') : []
if (replace.length) {
  page.on('dialog', (d) => d.accept())
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)
  await openHarness()
  await page.getByTestId('qa-tab-review').click()
  for (const id of replace) {
    const rows = page.getByTestId('qa-issue-row').filter({ hasText: `[${id}]` })
    const n = await rows.count()
    for (let i = 0; i < n; i++) {
      await page.getByTestId('qa-issue-row').filter({ hasText: `[${id}]` }).first().click()
      await page.getByTestId('qa-issue-detail').getByRole('button', { name: 'Eliminar' }).click()
      await page.waitForTimeout(500)
    }
    delete filed[id]
    console.log(`deleted ${n} × ${id}`)
  }
  writeFileSync(ledgerPath, JSON.stringify(filed, null, 1))
  await page.keyboard.press('Escape').catch(() => {})
}

let ok = 0
for (const f of findings) {
  if (filed[f.id]) continue
  try {
    await goTo(f)
    await openHarness()
    await page.getByTestId('qa-tab-report').click()
    await page.getByTestId('qa-category').selectOption(f.category)
    await page.getByTestId('qa-cause').selectOption(f.cause)
    await page.getByTestId('qa-severity').selectOption(f.severity)
    await page.getByTestId('qa-title').fill(`[${f.id}] ${f.title}`.slice(0, 200))
    await page.getByTestId('qa-description').fill(f.description)
    const form = page.getByTestId('qa-report-form')
    if (f.expected) await form.getByText('Resultado esperado').locator('..').locator('textarea').fill(f.expected)
    if (f.actual) await form.getByText('Resultado observado').locator('..').locator('textarea').fill(f.actual)
    if (f.repro) await page.getByTestId('qa-repro').fill(f.repro)
    if (f.improvement) await form.getByText('Mejora sugerida').locator('..').locator('textarea').fill(f.improvement)
    await page.getByTestId('qa-save-issue').click()
    await page.getByTestId('qa-message').waitFor({ timeout: 5000 })
    const msg = await page.getByTestId('qa-message').innerText()
    if (!/guardad|Guardad|saved/i.test(msg)) throw new Error(`unexpected QA message: ${msg}`)
    filed[f.id] = new Date().toISOString()
    writeFileSync(ledgerPath, JSON.stringify(filed, null, 1))
    ok += 1
    await page.keyboard.press('Escape').catch(() => {})
  } catch (e) {
    console.log(`FAIL ${f.id}: ${String(e.message).split('\n')[0]}`)
  }
}
console.log(`filed ${ok} new, ${Object.keys(filed).length} total`)

if (exportTo) {
  await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(1500)
  await openHarness()
  await page.getByTestId('qa-tab-session').click()
  await page.getByTestId('qa-tester').fill('walkthrough-agent (persona: Lucía)')
  const [download] = await Promise.all([page.waitForEvent('download'), page.getByTestId('qa-export').click()])
  const tmp = await download.path()
  copyFileSync(tmp, exportTo)
  const pkg = JSON.parse(readFileSync(exportTo, 'utf8'))
  console.log(`exported ${(pkg.issues || []).length} issues to ${exportTo}`)
}
await ctx.close()
