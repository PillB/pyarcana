// Chromium end-to-end check of the ads rules against the real local stack:
// `wrangler dev --local` (workerd + local D1) serving the static build at http://localhost:8787
// with launchStage 'beta'. People are seeded by seed.mjs (known session tokens).
import { chromium } from 'playwright'
import { sandboxTrustArgs } from './sandbox-trust.mjs'
import { readFileSync, mkdirSync } from 'node:fs'
import assert from 'node:assert/strict'

const BASE = 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const tokens = JSON.parse(readFileSync(new URL('./tokens.json', import.meta.url)))
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || '/opt/pw-browsers/chromium', headless: true, args: sandboxTrustArgs() })
const results = []
const consoleErrors = []

async function contextFor(who) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  // Skip the first-visit tour so it does not cover the page.
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  if (who) {
    await ctx.addCookies([{ name: '__Host-pa_session', value: tokens[who].token, domain: 'localhost', path: '/', secure: true, httpOnly: true, sameSite: 'Lax' }])
  }
  return ctx
}

async function slotOn(who, hash = '#setup') {
  const ctx = await contextFor(who)
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(`${who ?? 'anon'}: ${m.text()}`) })
  page.on('pageerror', (e) => consoleErrors.push(`${who ?? 'anon'}: pageerror ${e.message}`))
  const meDone = who ? page.waitForResponse((r) => r.url().includes('/api/v1/me'), { timeout: 20000 }).catch(() => null) : null
  await page.goto(`${BASE}/${hash}`, { waitUntil: 'networkidle' })
  if (meDone) await meDone
  await page.waitForTimeout(1500)
  const slot = page.locator('[data-testid="ad-slot"][data-placement="section_end"]')
  const count = await slot.count()
  const adapter = count ? await slot.first().getAttribute('data-adapter') : null
  const creative = count ? await page.locator('[data-testid="house-ad"]').first().getAttribute('data-creative').catch(() => null) : null
  const thirdParty = []
  if (count) await slot.first().scrollIntoViewIfNeeded()
  await page.screenshot({ path: `${OUT}ads-${who ?? 'anon'}.png`, fullPage: false })
  await ctx.close()
  return { count, adapter, creative, thirdParty }
}

function record(name, ok, detail) {
  results.push({ name, ok, detail })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`)
}

const expectations = [
  [null, true, 'trial'],
  ['free', true, 'trial'],
  ['gift', true, 'noads'],
  ['tester', true, 'noads'],
  ['admin', true, 'trial'],
  ['paid', false, null],
  ['trial', false, null],
]
for (const [who, shows, promo] of expectations) {
  const s = await slotOn(who)
  const ok = shows ? s.count === 1 && s.adapter === 'house' && s.creative === promo : s.count === 0
  record(`${who ?? 'anonymous'} ${shows ? 'sees' : 'does not see'} the end-of-section ad`, ok, `slots=${s.count} adapter=${s.adapter} creative=${s.creative}`)
}

// Admin: the "Anuncios" tab lists everyone with the right status; switch gift + tester off in one batch.
{
  const ctx = await contextFor('admin')
  const page = await ctx.newPage()
  page.on('pageerror', (e) => consoleErrors.push(`admin: pageerror ${e.message}`))
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await page.getByRole('tab', { name: 'Anuncios' }).click()
  await page.waitForSelector('[data-testid="ads-row"]', { timeout: 15000 })
  const rows = await page.$$eval('[data-testid="ads-row"]', (els) => els.map((e) => [e.querySelector('label span')?.textContent, e.getAttribute('data-shows')]))
  const shows = Object.fromEntries(rows)
  record('admin list shows who sees ads', shows['gift@e2e.test'] === 'yes' && shows['paid@e2e.test'] === 'no' && shows['trial@e2e.test'] === 'no' && shows['tester@e2e.test'] === 'yes', JSON.stringify(shows))
  await page.screenshot({ path: `${OUT}admin-ads-before.png`, fullPage: true })
  for (const who of ['gift', 'tester']) {
    await page.locator(`[data-testid="ads-row"][data-account="${tokens[who].id}"] input[type="checkbox"]`).check()
  }
  await page.getByTestId('ads-off').click()
  await page.getByRole('alertdialog').getByRole('textbox').fill('beta cerrada e2e')
  await page.getByRole('alertdialog').getByRole('button', { name: 'Quitar anuncios' }).click()
  await page.waitForSelector('text=Listo: cambiaron 2 cuentas.', { timeout: 15000 })
  await page.waitForTimeout(800)
  const after = Object.fromEntries(await page.$$eval('[data-testid="ads-row"]', (els) => els.map((e) => [e.querySelector('label span')?.textContent, e.getAttribute('data-shows')])))
  record('batch switch-off of gift + tester is reflected in the list', after['gift@e2e.test'] === 'no' && after['tester@e2e.test'] === 'no' && after['free@e2e.test'] === 'yes', JSON.stringify(after))
  await page.getByTestId('ads-filter').selectOption('disabled')
  await page.waitForTimeout(800)
  const disabled = await page.$$eval('[data-testid="ads-row"] label span:first-child', (els) => els.map((e) => e.textContent).sort())
  record('filter "disabled" lists exactly the switched accounts', JSON.stringify(disabled) === JSON.stringify(['gift@e2e.test', 'tester@e2e.test']), JSON.stringify(disabled))
  await page.screenshot({ path: `${OUT}admin-ads-after.png`, fullPage: true })
  await ctx.close()
}

for (const who of ['gift', 'tester']) {
  const s = await slotOn(who)
  record(`${who} no longer sees the ad after the admin switch`, s.count === 0, `slots=${s.count}`)
}

// Back to the default for gift only.
{
  const ctx = await contextFor('admin')
  const page = await ctx.newPage()
  await page.goto(`${BASE}/admin`, { waitUntil: 'networkidle' })
  await page.getByRole('tab', { name: 'Anuncios' }).click()
  await page.waitForSelector('[data-testid="ads-row"]')
  await page.locator(`[data-testid="ads-row"][data-account="${tokens.gift.id}"] input[type="checkbox"]`).check()
  await page.getByTestId('ads-default').click()
  await page.getByRole('alertdialog').getByRole('textbox').fill('fin de beta e2e')
  await page.getByRole('alertdialog').getByRole('button', { name: 'Volver a mostrar anuncios' }).click()
  await page.waitForSelector('text=Listo: cambiaron 1 cuentas.', { timeout: 15000 })
  await ctx.close()
}
{
  const s = await slotOn('gift')
  record('gift sees ads again after "Volver a mostrar anuncios"', s.count === 1 && s.adapter === 'house', `slots=${s.count}`)
  const t = await slotOn('tester')
  record('tester stays without ads', t.count === 0, `slots=${t.count}`)
}

// A learner cannot open the admin tab's data.
{
  const ctx = await contextFor('free')
  const page = await ctx.newPage()
  const r = await page.request.get(`${BASE}/api/v1/admin/ads`)
  record('a free learner gets 403 from the admin ads list', r.status() === 403, `status=${r.status()}`)
  await ctx.close()
}

// QA "Previsualizar anuncios" / test mode shows the labelled placeholder even to paid.
{
  const ctx = await contextFor('paid')
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:qa-mode:v1', JSON.stringify({ v: 1, testMode: true, adPreview: true })) } catch {} })
  const page = await ctx.newPage()
  await page.goto(`${BASE}/#setup`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  const adapter = await page.locator('[data-testid="ad-slot"][data-placement="section_end"]').first().getAttribute('data-adapter').catch(() => null)
  record('QA ad preview shows the test placeholder to a paid account', adapter === 'test', `adapter=${adapter}`)
  await page.screenshot({ path: `${OUT}ads-qa-preview-paid.png` })
  await ctx.close()
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
const relevantErrors = consoleErrors.filter((e) => !/401|no_session|favicon|ERR_TUNNEL_CONNECTION_FAILED|cdn\.jsdelivr\.net/i.test(e))
if (relevantErrors.length) console.log('console errors:\n' + relevantErrors.slice(0, 20).join('\n'))
process.exit(failed.length || relevantErrors.length ? 1 : 0)
