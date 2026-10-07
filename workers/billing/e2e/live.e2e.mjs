// Chromium checks against the LIVE site (default https://pyarcana.dev). Read-only unless --write.
// The easy way: workers/billing/e2e/live.sh runs the setup and every step below, guided.
//
//   node live.e2e.mjs                 anonymous checks: health, sign-in methods, JWKS, pages, ads,
//                                     robots.txt, ads.txt, the pyarcana.com and www redirects
//   node live.e2e.mjs --login         opens YOUR installed Chrome (a throwaway profile, not driven by
//                                     automation, so Google accepts the sign-in) on the home page:
//                                     sign in yourself (Google is needed for admin), then press Enter
//                                     here; saves ./state.json, closes Chrome, deletes the profile.
//                                     CHROME=/path/to/chrome if it is not in the usual place.
//   node live.e2e.mjs --keys          the hotkeys on YOUR real keyboard in your own Chrome: it asks you
//                                     to press ⌘+Option+Q, Ctrl+Option+Q and (signed in) ⌘+Option+S,
//                                     and checks the page reacted. Nothing is simulated.
//   node live.e2e.mjs --cookie        fallback when Google still refuses: sign in in your everyday
//                                     Chrome, copy the __Host-pa_session cookie (DevTools →
//                                     Application → Cookies → https://pyarcana.dev), paste it at the
//                                     hidden prompt; saves ./state.json
//   node live.e2e.mjs --state         anonymous checks plus signed-in ones with ./state.json
//                                     (add --signed-in-only to skip the anonymous ones):
//                                     /v1/me, admin tabs, the Anuncios list, /qa, /cuenta
//   node live.e2e.mjs --state --write also sends one QA report titled "[prueba en vivo] …" from the
//                                     QA menu and checks it reaches /qa and /admin
//
// state.json holds a live session cookie: it is git-ignored, never share it, and delete it after.
// BASE overrides the origin; CHROMIUM the browser (default: Playwright's own Chromium).
import { chromium, request as pwRequest } from 'playwright'
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'
import { loginWithSystemChrome, withSystemChrome } from './system-chrome-login.mjs'
import { sandboxTrustArgs } from './sandbox-trust.mjs'

const BASE = process.env.BASE || 'https://pyarcana.dev'
const STATE = new URL('./state.json', import.meta.url).pathname
const OUT = new URL('./shots/', import.meta.url).pathname
const args = new Set(process.argv.slice(2))
mkdirSync(OUT, { recursive: true })
const launch = (headless) => chromium.launch({ headless, args: sandboxTrustArgs(), ...(process.env.CHROMIUM ? { executablePath: process.env.CHROMIUM } : {}) })
const results = []
const errors = []
// Page loads that requested Cloudflare's analytics beacon: one cause, reported by one check (below),
// not as a failure of every page it lands on.
const beacon = new Set()
const BEACON = /static\.cloudflareinsights\.com|cloudflareinsights/i
const BROWSER_UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0.0.0 Safari/537.36'
const IGNORED = /ERR_ABORTED|status of 401|favicon|_rsc=/i

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 240)})` : ''}`)
}

async function flow(name, fn) {
  try { await fn() } catch (e) { record(name, false, `threw: ${e.message.split('\n')[0]}`) }
}

if (args.has('--login')) {
  const ready = async () => {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    await rl.question('Sign in in that Chrome window (use Google for admin checks), then press Enter here… ')
    rl.close()
  }
  const saved = await loginWithSystemChrome({ chromium, url: `${BASE}/`, statePath: STATE, ready, headless: process.env.LOGIN_HEADLESS === '1' })
  console.log(`navigator.webdriver in that window: ${saved.webdriver} (false is what Google needs)`)
  console.log(`saved ${STATE} with ${saved.cookies} cookies — it holds a live session: delete it when you are done`)
  process.exit(0)
}

if (args.has('--cookie')) {
  const value = await hiddenQuestion('Paste the __Host-pa_session cookie value and press Enter (typing stays hidden): ')
  if (!/^[A-Za-z0-9_-]{20,200}$/.test(value)) {
    console.log('That does not look like a session cookie value (letters, digits, - and _ only). Nothing saved.')
    process.exit(1)
  }
  const host = new URL(BASE).hostname
  writeFileSync(STATE, JSON.stringify({ cookies: [{ name: '__Host-pa_session', value, domain: host, path: '/', expires: -1, httpOnly: true, secure: true, sameSite: 'Lax' }], origins: [] }))
  console.log(`saved ${STATE} — it holds a live session: delete it when you are done`)
  process.exit(0)
}

if (args.has('--keys')) {
  // The hotkeys on a REAL keyboard, in your own Chrome (no simulated key events, no faked platform).
  // You press each combination; the script only watches the page over CDP and says PASS or FAIL.
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const ask = (q) => rl.question(q)
  const keyResults = []
  const mark = (name, ok, detail = '') => { keyResults.push(ok); console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${detail})` : ''}`) }
  // Watch the page while the person presses the keys: what appeared is recorded even if it is gone
  // (the QA window closed, the toast faded) by the time they press Enter here.
  const watch = (page, pattern) => page.evaluate((src) => {
    window.__seen = ''
    const re = new RegExp(src)
    const look = () => {
      if (document.querySelector('[data-testid="qa-harness-dialog"]')) window.__seen ||= 'qa-window'
      const m = (document.body || document.documentElement).innerText.match(re)
      if (m) window.__seen ||= m[0]
    }
    // documentElement always exists; document.body is null while the page is still loading, which
    // crashed the first live run ("parameter 1 is not of type 'Node'").
    new MutationObserver(look).observe(document.documentElement, { childList: true, subtree: true, characterData: true })
    look()
  }, pattern)
  // undefined: the page reloaded or navigated away after the watch started (the record was lost).
  const seen = (page) => page.evaluate(() => (window.__seen === undefined ? 'page reloaded: press the keys again' : window.__seen))
  const SAVE = 'Ya está guardado|Guardado en tu cuenta|Espera \\d+|Has marcado y desmarcado|El servidor pidió esperar|Already saved|Saved to your account'
  await withSystemChrome({ chromium, url: `${BASE}/#setup` }, async (first, ctx) => {
    // The pyarcana tab, loaded: Chrome may open with a different tab first, and attaching happens
    // while the page is still loading.
    const page = await siteTab(ctx, first)
    for (const combo of ['⌘ + Option + Q', 'Ctrl + Option + Q']) {
      await watch(page, '$^')
      await ask(`Click once inside the page (not the address bar), press ${combo}, then press Enter here… `)
      mark(`${combo} opens the QA window`, (await seen(page)) === 'qa-window')
      await page.keyboard.press('Escape').catch(() => {}) // closing it is not what is being tested
      await page.waitForTimeout(500)
    }
    await ask('Now sign in in that window with your account (any method), come back to a course page, then press Enter here… ')
    const signedIn = await page.evaluate(async () => (await fetch('/api/v1/me', { credentials: 'include' })).status === 200)
    if (!signedIn) {
      mark('⌘ + Option + S (force save)', false, 'not signed in in that window, so the shortcut is not active')
    } else {
      await watch(page, SAVE)
      await ask('Click once inside the page, press ⌘ + Option + S, then press Enter here… ')
      const text = await seen(page)
      mark('⌘ + Option + S answers with a save message', Boolean(text) && text !== 'qa-window', text)
    }
  })
  rl.close()
  console.log(`\nkeys: ${keyResults.filter(Boolean).length}/${keyResults.length} passed`)
  console.log('Safari and Firefox cannot be watched this way: check them by hand (see the hand-back checklist).')
  process.exit(keyResults.every(Boolean) ? 0 : 1)
}

/** The tab showing BASE (waits up to 30 s for it), once its document has loaded. */
async function siteTab(ctx, first) {
  for (let i = 0; i < 60; i++) {
    const tab = [first, ...ctx.pages()].find((p) => p && p.url().startsWith(BASE))
    if (tab) {
      await tab.waitForLoadState('domcontentloaded')
      return tab
    }
    await new Promise((resolve) => setTimeout(resolve, 500))
  }
  throw new Error(`no tab with ${BASE} opened in Chrome within 30 s`)
}

/** Read one line without echoing it (the session cookie is a credential). */
function hiddenQuestion(prompt) {
  return new Promise((resolve) => {
    process.stdout.write(prompt)
    const stdin = process.stdin
    if (stdin.isTTY) stdin.setRawMode(true)
    let text = ''
    const onData = (buf) => {
      for (const ch of buf.toString('utf8')) {
        if (ch === '\r' || ch === '\n') {
          stdin.off('data', onData)
          if (stdin.isTTY) stdin.setRawMode(false)
          stdin.pause()
          process.stdout.write('\n')
          return resolve(text.trim())
        }
        if (ch === '\u0003') process.exit(130)
        text = ch === '\u007f' ? text.slice(0, -1) : text + ch
      }
    }
    stdin.on('data', onData)
    stdin.resume()
  })
}

// --signed-in-only (live.sh's second step): only the signed-in checks, not the anonymous ones again.
const ANON = !args.has('--signed-in-only')
const browser = await launch(true)
const api = await pwRequest.newContext({ baseURL: BASE })

async function open(ctx, path, label) {
  const page = await ctx.newPage()
  page.on('request', (r) => { if (BEACON.test(r.url())) beacon.add(`${label} ${path}`) })
  page.on('console', (m) => {
    if (m.type() !== 'error' || IGNORED.test(m.text())) return
    if (BEACON.test(m.text())) return beacon.add(`${label} ${path}`) // counted once, in its own check
    errors.push(`${label} ${path}: ${m.text()}`)
  })
  page.on('pageerror', (e) => errors.push(`${label} ${path}: pageerror ${e.message}`))
  await page.goto(`${BASE}${path}`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)
  return page
}

if (ANON) await flow('worker', async () => {
  const health = await (await api.get('/api/v1/health')).json()
  // D4 audit P6: health tells only that the worker and D1 answer; the configuration is admin-only.
  record('health: {ok, db} and nothing about configuration', JSON.stringify(health) === '{"ok":true,"db":true}', JSON.stringify(health))
  const methods = await (await api.get('/api/v1/auth/methods')).json()
  record('sign-in methods: Google and Microsoft offered (so pepper, terms and D1 are ready)', methods.google === true && methods.microsoft === true, JSON.stringify(methods).slice(0, 200))
  const jwks = await api.get('/api/v1/jwks')
  const keys = jwks.ok() ? (await jwks.json()).keys ?? [] : []
  record('JWKS publishes the licence key', keys.length > 0 && keys.every((k) => k.kty === 'EC' && !('d' in k)), `kids=${keys.map((k) => k.kid).join(',')}`)
  const me = await api.get('/api/v1/me')
  record('signed out, /v1/me answers 401', me.status() === 401, `status=${me.status()}`)
})

/** One host must answer 301 to the same path and query on BASE. Kept out of the flow for its complexity. */
async function checkRedirect(ctx, host, url, pathAndQuery) {
  const r = await ctx.get(url, { maxRedirects: 0 }).catch((e) => ({ error: e.message }))
  const loc = r.error ? '' : r.headers().location ?? ''
  const detail = r.error ? `error=${r.error.split('\n')[0]}` : `status=${r.status()} location=${loc}`
  record(`${host} redirects (301) to pyarcana.dev with path and query`, !r.error && r.status() === 301 && loc === `${BASE}${pathAndQuery}`, detail)
}

if (ANON) await flow('domain', async () => {
  const robots = await api.get('/robots.txt')
  const text = robots.ok() ? await robots.text() : ''
  record('robots.txt is served and does not block Google\'s ad crawler', robots.ok() && !/User-agent:\s*Mediapartners-Google[\s\S]*?Disallow:\s*\/\s*$/im.test(text), `status=${robots.status()}`)
  const adsTxt = await api.get('/ads.txt')
  record('ads.txt: 404 until an AdSense id is set, text/plain once it is', adsTxt.status() === 404 || /text\/plain/.test(adsTxt.headers()['content-type'] ?? ''), `status=${adsTxt.status()}`)
  const com = await pwRequest.newContext()
  await checkRedirect(com, 'pyarcana.com', 'https://pyarcana.com/precios?x=1', '/precios?x=1')
  // 85dc9ee (6 Oct 2026): www.pyarcana.dev is no longer bound to the worker, which served the
  // course there with accounts silently off. It must be a zone Redirect Rule (README, setup step 5);
  // without one www does not resolve, and this fails.
  await checkRedirect(com, 'www.pyarcana.dev', 'https://www.pyarcana.dev/empezar?x=1', '/empezar?x=1')
  // Handback 5 Oct 2026, item 3: Cloudflare's automatic RUM injects its beacon at the edge, and only
  // into what looks like a browser page load: the request must say it accepts HTML. Asked without
  // that header (the first version of this check, and `curl`), the page comes back clean even when
  // every real visitor gets the beacon. The browser check below ("page loads") is the stronger one.
  const home = await api.get('/', { headers: { Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8', 'User-Agent': BROWSER_UA } })
  const homeHtml = await home.text()
  record('the home page HTML, requested as a browser does, carries no Cloudflare beacon (cloudflareinsights)', !/cloudflareinsights/i.test(homeHtml), `occurrences=${(homeHtml.match(/cloudflareinsights/gi) || []).length}`)
  const headers = home.headers()
  record('security headers on the home page (CSP, nosniff)', Boolean(headers['content-security-policy']) && headers['x-content-type-options'] === 'nosniff', Object.keys(headers).filter((h) => /security|content-type-options|frame/.test(h)).join(','))
})

// Pyodide from the REAL jsDelivr under the LIVE CSP, exactly as the course runs it (script tag with
// the site's SRI hash, then loadPyodide). The local e2e cannot reach jsDelivr from the cloud
// sandbox, so this is where it is proven (5 Oct 2026: no local copy any more). The version and the
// SRI hash are read from this checkout: run it at the deployed commit.
const REPO = new URL('../../../', import.meta.url).pathname
const PYO_VER = /PYODIDE_VERSION = '([^']+)'/.exec(readFileSync(`${REPO}src/lib/pyodide.ts`, 'utf8'))[1]
const PYO_SRI = /script\.integrity = '(sha384-[^']+)'/.exec(readFileSync(`${REPO}src/components/course/CodePlayground.tsx`, 'utf8'))[1]
if (ANON) await flow('pyodide', async () => {
  const cdn = `https://cdn.jsdelivr.net/pyodide/v${PYO_VER}/full/`
  const ctx = await browser.newContext({ locale: 'es-PE' })
  await ctx.addInitScript(() => {
    window.__csp = []
    document.addEventListener('securitypolicyviolation', (e) => window.__csp.push(`${e.effectiveDirective} ${e.blockedURI}`))
  })
  const page = await open(ctx, '/', 'pyodide')
  // From a page task: inside Playwright's evaluate call eval is allowed regardless of the CSP.
  await page.evaluate(([base, integrity]) => { setTimeout(async () => { window.__py = await (async () => {
    await new Promise((ok, ko) => { const s = document.createElement('script'); s.src = `${base}pyodide.js`; s.integrity = integrity; s.crossOrigin = 'anonymous'; s.onload = ok; s.onerror = () => ko(new Error('pyodide.js did not load (network, SRI or CSP)')); document.head.appendChild(s) })
    const py = await window.loadPyodide({ indexURL: base })
    const out = []
    py.setStdout({ batched: (line) => out.push(line) })
    await py.runPythonAsync('import json, math\nprint(json.dumps({"fact": math.factorial(5), "sum": sum(range(10))}))')
    return out.join('\n')
  })().catch((e) => `threw: ${e.message}`) }, 0) }, [cdn, PYO_SRI])
  await page.waitForFunction(() => window.__py !== undefined, null, { timeout: 120000 })
  const run = await page.evaluate(() => window.__py)
  // The beacon's violation is reported by its own check; this one judges Pyodide, jsDelivr and eval.
  const violations = (await page.evaluate(() => window.__csp)).filter((v) => !BEACON.test(v))
  record(`Pyodide ${PYO_VER} from jsDelivr runs Python under the live CSP and the site's SRI hash`, run === '{"fact": 120, "sum": 45}' && violations.length === 0, `${run} | ${violations.join(', ')}`)
  await ctx.close()
})

if (ANON) await flow('anonymous pages', async () => {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, locale: 'es-PE' })
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  for (const path of ['/', '/#setup', '/precios', '/suscripcion', '/cuenta', '/qa', '/privacy', '/cookies', '/terms', '/data-rights', '/empezar']) {
    const before = errors.length
    const page = await open(ctx, path, 'anon')
    record(`anonymous ${path} renders cleanly`, errors.length === before, errors.slice(before).join(' | '))
    if (path === '/#setup') {
      const adapter = await page.locator('[data-testid="ad-slot"][data-placement="section_end"]').first().getAttribute('data-adapter').catch(() => null)
      // In sync there is no Pro to promote, so no house box; in beta or paid the trial promo shows.
      record('the end-of-section ad slot shows a house promo or nothing, never a network ad', adapter === null || adapter === 'house', `adapter=${adapter}`)
    }
    if (path === '/cuenta') {
      const entrar = page.getByTestId('cuenta-signin')
      record('/cuenta offers "Entrar" when signed out', await entrar.isVisible().catch(() => false))
      // Handback item 1: a plain /cuenta visit offers Google too (only a Microsoft callback load does not).
      await entrar.click().catch(() => {})
      const google = await page.getByTestId('google-signin').waitFor({ timeout: 8000 }).then(() => true, () => false)
      record('/cuenta offers the Google button', google)
    }
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
        for (const tab of ['Reportes', 'QA', 'Pro regalado', 'Testers', 'Cuentas', 'Anuncios', 'Experimentos', 'Satisfacción', 'Uso']) {
          await admin.getByRole('tab', { name: tab }).click()
          await admin.waitForTimeout(900)
          const alert = await admin.locator('[role="alert"]').first().textContent().catch(() => null)
          record(`admin tab "${tab}" renders without an error`, !alert, alert ?? '')
        }
        await admin.getByRole('tab', { name: 'Anuncios' }).click()
        await admin.waitForTimeout(1200)
        record('the Anuncios tab lists accounts', (await admin.getByTestId('ads-row').count()) > 0)
        const usage = await admin.evaluate(async () => (await (await fetch('/api/v1/admin/usage', { credentials: 'include' })).json()).config)
        record('admin config: pepper, terms, Google and Microsoft configured', ['pepper', 'terms', 'google', 'microsoft'].every((k) => usage?.[k] === true), JSON.stringify(usage))
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

// Every page load above, anonymous and signed in, was watched for Cloudflare's beacon.
record('no page load got Cloudflare\'s analytics beacon (Web Analytics automatic setup must be off)', beacon.size === 0, beacon.size ? `requested on: ${[...beacon].join(', ')}` : '')

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\n${results.length - failed.length}/${results.length} passed`)
if (errors.length) console.log(`console/page errors:\n${[...new Set(errors)].slice(0, 20).join('\n')}`)
process.exit(failed.length ? 1 : 0)
