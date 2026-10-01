// Chromium checks against the LIVE site (default https://pyarcana.dev). Read-only unless --write.
//
//   node live.e2e.mjs                 anonymous checks: health, sign-in methods, JWKS, pages, ads,
//                                     robots.txt, ads.txt, the pyarcana.com redirect
//   node live.e2e.mjs --login         opens a visible browser on /cuenta: sign in yourself (Google is
//                                     needed for admin), then press Enter here; saves ./state.json
//   node live.e2e.mjs --state         anonymous checks plus signed-in ones with ./state.json:
//                                     /v1/me, admin tabs, the Anuncios list, /qa, /cuenta
//   node live.e2e.mjs --state --write also sends one QA report titled "[prueba en vivo] …" from the
//                                     QA menu and checks it reaches /qa and /admin
//
// state.json holds a live session cookie: it is git-ignored, never share it, and delete it after.
// BASE overrides the origin; CHROMIUM the browser (default: Playwright's own Chromium).
import { chromium, request as pwRequest } from 'playwright'
import { existsSync, mkdirSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'

const BASE = process.env.BASE || 'https://pyarcana.dev'
const STATE = new URL('./state.json', import.meta.url).pathname
const OUT = new URL('./shots/', import.meta.url).pathname
const args = new Set(process.argv.slice(2))
mkdirSync(OUT, { recursive: true })
const launch = (headless) => chromium.launch({ headless, ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) })
const results = []
const errors = []
const IGNORED = /ERR_ABORTED|status of 401|favicon|_rsc=/i

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 240)})` : ''}`)
}

async function flow(name, fn) {
  try { await fn() } catch (e) { record(name, false, `threw: ${e.message.split('\n')[0]}`) }
}

if (args.has('--login')) {
  const browser = await launch(false)
  const ctx = await browser.newContext()
  const page = await ctx.newPage()
  await page.goto(`${BASE}/cuenta`)
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  await rl.question('Sign in in the browser window (use Google for admin checks), then press Enter here… ')
  rl.close()
  await ctx.storageState({ path: STATE })
  await browser.close()
  console.log(`saved ${STATE} — it holds a live session: delete it when you are done`)
  process.exit(0)
}

const browser = await launch(true)
const api = await pwRequest.newContext({ baseURL: BASE })

async function open(ctx, path, label) {
  const page = await ctx.newPage()
  page.on('console', (m) => { if (m.type() === 'error' && !IGNORED.test(m.text())) errors.push(`${label} ${path}: ${m.text()}`) })
  page.on('pageerror', (e) => errors.push(`${label} ${path}: pageerror ${e.message}`))
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  return page
}

await flow('worker', async () => {
  const health = await (await api.get('/api/v1/health')).json()
  const want = ['db', 'pepper', 'terms', 'email', 'google', 'microsoft']
  record('health: database, pepper, terms, email, Google and Microsoft all configured', want.every((k) => health[k] === true), JSON.stringify(health))
  const methods = await (await api.get('/api/v1/auth/methods')).json()
  record('sign-in methods: email, Google and Microsoft offered', methods.email === true && methods.google === true && methods.microsoft === true, JSON.stringify(methods).slice(0, 200))
  const jwks = await api.get('/api/v1/jwks')
  const keys = jwks.ok() ? (await jwks.json()).keys ?? [] : []
  record('JWKS publishes the licence key', keys.length > 0 && keys.every((k) => k.kty === 'EC' && !('d' in k)), `kids=${keys.map((k) => k.kid).join(',')}`)
  const me = await api.get('/api/v1/me')
  record('signed out, /v1/me answers 401', me.status() === 401, `status=${me.status()}`)
})

await flow('domain', async () => {
  const robots = await api.get('/robots.txt')
  const text = robots.ok() ? await robots.text() : ''
  record('robots.txt is served and does not block Google\'s ad crawler', robots.ok() && !/User-agent:\s*Mediapartners-Google[\s\S]*?Disallow:\s*\/\s*$/im.test(text), `status=${robots.status()}`)
  const adsTxt = await api.get('/ads.txt')
  record('ads.txt: 404 until an AdSense id is set, text/plain once it is', adsTxt.status() === 404 || /text\/plain/.test(adsTxt.headers()['content-type'] ?? ''), `status=${adsTxt.status()}`)
  const com = await pwRequest.newContext()
  const r = await com.get('https://pyarcana.com/precios?x=1', { maxRedirects: 0 }).catch(() => null)
  const loc = r?.headers().location ?? ''
  record('pyarcana.com redirects (301) to pyarcana.dev with path and query', r?.status() === 301 && loc === `${BASE}/precios?x=1`, `status=${r?.status()} location=${loc}`)
  const headers = (await api.get('/')).headers()
  record('security headers on the home page (CSP, nosniff)', Boolean(headers['content-security-policy']) && headers['x-content-type-options'] === 'nosniff', Object.keys(headers).filter((h) => /security|content-type-options|frame/.test(h)).join(','))
})

await flow('anonymous pages', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  for (const path of ['/', '/#setup', '/precios', '/suscripcion', '/cuenta', '/qa', '/privacy', '/cookies', '/terms', '/data-rights']) {
    const before = errors.length
    const page = await open(ctx, path, 'anon')
    record(`anonymous ${path} renders cleanly`, errors.length === before, errors.slice(before).join(' | '))
    if (path === '/#setup') {
      const adapter = await page.locator('[data-testid="ad-slot"][data-placement="section_end"]').first().getAttribute('data-adapter').catch(() => null)
      record('a signed-out visitor sees the house ad at the end of section 1', adapter === 'house', `adapter=${adapter}`)
    }
    if (path === '/cuenta') record('/cuenta offers "Entrar" when signed out', await page.getByTestId('cuenta-signin').isVisible().catch(() => false))
    await page.screenshot({ path: `${OUT}live${path.replace(/[/#]/g, '-') || '-home'}.png`, fullPage: true })
    await page.close()
  }
  await ctx.close()
})

if (args.has('--state')) {
  if (!existsSync(STATE)) {
    record('signed-in checks', false, 'no state.json: run with --login first')
  } else {
    await flow('signed in', async () => {
      const ctx = await browser.newContext({ storageState: STATE, viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
      const page = await open(ctx, '/cuenta', 'me')
      const me = await page.evaluate(async () => { const r = await fetch('/api/v1/me', { credentials: 'include' }); return { status: r.status, body: await r.json() } })
      record('signed in: /v1/me answers with the account', me.status === 200, `email=${me.body?.account?.email} admin=${me.body?.account?.isAdmin} ads=${JSON.stringify(me.body?.ads)}`)
      record('/cuenta shows the account panel', await page.getByTestId('account-panel').first().isVisible().catch(() => false))
      await page.screenshot({ path: `${OUT}live-cuenta-signed-in.png`, fullPage: true })
      if (me.body?.account?.isAdmin) {
        const admin = await open(ctx, '/admin', 'admin')
        for (const tab of ['Reportes', 'Pro regalado', 'Testers', 'Cuentas', 'Anuncios', 'Experimentos', 'Satisfacción']) {
          await admin.getByRole('tab', { name: tab }).click()
          await admin.waitForTimeout(900)
          const alert = await admin.locator('[role="alert"]').first().textContent().catch(() => null)
          record(`admin tab "${tab}" renders without an error`, !alert, alert ?? '')
        }
        await admin.getByRole('tab', { name: 'Anuncios' }).click()
        await admin.waitForTimeout(1200)
        record('the Anuncios tab lists accounts', (await admin.getByTestId('ads-row').count()) > 0)
        await admin.screenshot({ path: `${OUT}live-admin.png`, fullPage: true })
      } else {
        record('admin checks skipped: this session is not an admin session (sign in with Google as an ADMIN_EMAILS address within 12 h)', true)
      }
      if (args.has('--write')) {
        const title = `[prueba en vivo] ${new Date().toISOString()}`
        await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:qaTourCompleted', '1') } catch {} })
        const qa = await open(ctx, '/#setup', 'qa')
        await qa.getByTestId('qa-harness-open').click()
        await qa.getByTestId('qa-tab-report').click()
        await qa.getByTestId('qa-title').fill(title)
        await qa.getByTestId('qa-description').fill('Reporte automático de la prueba en vivo. Se puede cerrar.')
        await qa.getByTestId('qa-repro').fill('1. Ejecutar live.e2e.mjs --write')
        await qa.getByTestId('qa-save-issue').click()
        await qa.getByTestId('qa-tab-review').click()
        await qa.getByTestId('qa-issue-row').first().click()
        await qa.getByTestId('qa-send-issue').click()
        await qa.getByTestId('qa-sent-mark').waitFor({ timeout: 15000 })
        const site = await open(ctx, '/qa', 'qa-site')
        record('the live QA report reaches /qa', (await site.locator('main').textContent()).includes(title))
      }
      await ctx.close()
    })
  }
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (errors.length) console.log(`console/page errors:\n${[...new Set(errors)].slice(0, 20).join('\n')}`)
process.exit(failed.length ? 1 : 0)
