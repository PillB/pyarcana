/**
 * Two tabs and every view agree on the web track (audit/tracks/web/STATE_MACHINES.md, SM1-SM3).
 *
 * Runs against a served static export:
 *   NEXT_PUBLIC_BASE_PATH=/pyarcana npm run build:static
 *   mkdir -p /tmp/site && cp -R out /tmp/site/pyarcana && python3 scripts/serve_pages_static.py /tmp/site 4181 &
 *   WEB_TRACK_BASE=http://127.0.0.1:4181/pyarcana/ node scripts/web_track_sync_check.cjs
 * Exit 0 all passed, 1 a check failed (named, expected against actual), 2 REFUSED (no site, no browser).
 */
const { chromium } = require('playwright')
const BASE = process.env.WEB_TRACK_BASE || 'http://127.0.0.1:4181/pyarcana/'
const KEY = 'pyarcana:track:ruta-web:v1'
const results = []
const check = (name, ok, detail) => { results.push(ok); console.log(`${ok ? 'ok  ' : 'FAIL'} ${name}${ok ? '' : `\n     ${detail}`}`) }
const box = (p, id) => p.locator(`[data-step-id="${id}"] [data-testid=track-step-done]`)
const counter = (p) => p.locator('[data-testid=track-progress]').innerText()
const standing = (p) => p.locator('[data-testid=web-track]').getAttribute('data-standing')
const stored = (p) => p.evaluate((k) => JSON.parse(localStorage.getItem(k) || '{"done":[]}').done, KEY)
;(async () => {
  try {
    const r = await fetch(BASE)
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
  } catch (e) {
    console.error(`REFUSED: no site at ${BASE} (${e.message}). Build and serve the static export first (see the header of this file).`)
    process.exit(2)
  }
  let b
  try {
    b = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {})
  } catch (e) {
    console.error(`REFUSED: Chromium did not start (${e.message.split('\n')[0]}). Set CHROMIUM_PATH to a Chromium binary.`)
    process.exit(2)
  }
  const ctx = await b.newContext({ viewport: { width: 1280, height: 900 } })
  await ctx.addInitScript(() => { try { if (window === window.top) localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  const errs = []
  const open = async (hash) => { const p = await ctx.newPage(); p.on('pageerror', (e) => errs.push(e.message)); await p.goto(BASE + hash, { waitUntil: 'networkidle' }); await p.waitForTimeout(600); return p }
  const A = await open('#ruta-web'); const B = await open('#ruta-web')
  check('fresh learner: both tabs say upcoming', (await standing(A)) === 'upcoming' && (await standing(B)) === 'upcoming', `${await standing(A)} / ${await standing(B)}`)
  await box(A, 'html.reparto').check(); await B.waitForTimeout(300)
  check('a tick in tab A appears in tab B without reload', await box(B, 'html.reparto').isChecked(), 'B checkbox unticked')
  await box(B, 'http.navegador').check(); await A.waitForTimeout(300)
  const both = ['html.reparto', 'http.navegador']
  check('tab B tick keeps tab A tick in storage', JSON.stringify(await stored(A)) === JSON.stringify(both), JSON.stringify(await stored(A)))
  check('both tabs show the same counter', (await counter(A)) === (await counter(B)), `${await counter(A)} | ${await counter(B)}`)
  await box(B, 'html.reparto').uncheck(); await A.waitForTimeout(300)
  check('untick in B clears A without resurrecting', !(await box(A, 'html.reparto').isChecked()) && JSON.stringify(await stored(A)) === '["http.navegador"]', JSON.stringify(await stored(A)))
  // Standing across views in one tab
  await A.evaluate(() => { location.hash = '#async-concurrency' }); await A.waitForTimeout(800)
  check('S27 shows the required banner', (await A.locator('[data-testid=web-track-link]').getAttribute('data-kind')) === 'required', 'no required banner')
  await A.evaluate(() => { location.hash = '#ruta-web' }); await A.waitForTimeout(800)
  check('the track page in the same tab now says required too', (await standing(A)) === 'required', await standing(A))
  check('tab B, open the whole time, says required too (furthest-section mark syncs between tabs)', (await standing(B)) === 'required', await standing(B))
  await B.reload({ waitUntil: 'networkidle' }); await B.waitForTimeout(600)
  check('tab B after a reload says required', (await standing(B)) === 'required', await standing(B))
  await A.evaluate(() => { location.hash = '#apis-sql-geo' }); await A.waitForTimeout(800)
  check('S12 still shows the detour banner', (await A.locator('[data-testid=web-track-link]').getAttribute('data-kind')) === 'detour', 'no detour')
  const s12Title = await A.locator('[data-testid=web-track-link] p').first().innerText()
  check('back on S12 after S27, the banner says the track is still to do, not optional', /Pendiente/.test(s12Title), s12Title)
  await A.evaluate(() => { location.hash = '#basics' }); await A.waitForTimeout(800)
  await A.evaluate(() => { location.hash = '#ruta-web' }); await A.waitForTimeout(800)
  check('after going back to S02, the track page still says required', (await standing(A)) === 'required', await standing(A))
  // The menu entry shows what the track page shows (same hook), and opens the track in place.
  const menuA = (await A.locator('aside [data-testid=sidebar-webtrack-status]').first().innerText()).trim()
  const counterA = await A.evaluate(() => { location.hash = '#ruta-web' }).then(() => A.waitForTimeout(700)).then(() => counter(A))
  const nums = (s) => (s.match(/\d+/g) || []).slice(0, 2).join('/')
  check('the menu and the track page show the same count', nums(menuA) === nums(counterA), `menu "${menuA}" vs page "${counterA}"`)
  check('the menu shows the required standing', (await A.locator('aside [data-testid=sidebar-webtrack]').first().getAttribute('data-standing')) === 'required', 'menu standing differs')
  await A.evaluate(() => { location.hash = '#basics' }); await A.waitForTimeout(700)
  await A.locator('aside [data-testid=sidebar-webtrack]').first().click(); await A.waitForTimeout(700)
  const menuBefore = await A.locator('aside [data-testid=sidebar-webtrack-status]').first().innerText()
  await box(A, 'html.escapar').check(); await A.waitForTimeout(300)
  const menuAfter = await A.locator('aside [data-testid=sidebar-webtrack-status]').first().innerText()
  check('a tick on the track page updates the menu in the same tab at once', nums(menuAfter) !== nums(menuBefore) && nums(menuAfter) === nums(await counter(A)), `menu "${menuBefore}" -> "${menuAfter}", page "${await counter(A)}"`)
  check('the menu entry opens the track inside the shell', (await A.locator('[data-testid=web-track]').count()) === 1 && A.url().endsWith('#ruta-web'), A.url())
  // Course progress written by another tab (src/lib/progress-cross-tab.ts). Tab A writes the record
  // the way the store does; tab B, open on the track page, must show it without a reload.
  const sidebarB = () => B.locator('[data-testid=sidebar-progress]').innerText()
  const beforeB = await sidebarB()
  await A.evaluate(() => { window.__events = 0; window.addEventListener('storage', () => { window.__events += 1 }) })
  await A.evaluate(() => {
    const raw = JSON.parse(localStorage.getItem('python-ds-progress') || '{"state":{"completedSections":[],"completedSubSteps":{},"quizScores":{},"lastVisited":null,"bookmarks":[],"startDate":null},"version":0}')
    raw.state.completedSections = [...new Set([...(raw.state.completedSections || []), 'setup', 'basics'])]
    localStorage.setItem('python-ds-progress', JSON.stringify(raw))
  })
  await B.waitForTimeout(800)
  const afterB = await sidebarB()
  check('a section completed in tab A shows in tab B without reload', afterB !== beforeB, `sidebar still "${beforeB.replace(/\s+/g, ' ')}"`)
  await A.waitForTimeout(1500)
  const echoes = await A.evaluate(() => window.__events)
  check('the two tabs settle: at most one echo comes back, no ping-pong', echoes <= 1, `${echoes} storage events in tab A`)
  const ctx2 = await b.newContext()
  await ctx2.addInitScript((k) => { const orig = Storage.prototype.setItem; Storage.prototype.setItem = function (key, v) { if (key === k) throw new DOMException('quota', 'QuotaExceededError'); return orig.call(this, key, v) }; try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} }, KEY)
  const C = await ctx2.newPage(); C.on('pageerror', (e) => errs.push(e.message)); await C.goto(BASE + '#ruta-web', { waitUntil: 'networkidle' }); await C.waitForTimeout(600)
  await box(C, 'html.reparto').check(); await C.waitForTimeout(200)
  check('refused storage: tick stays visible and the warning shows', (await box(C, 'html.reparto').isChecked()) && (await C.locator('[data-testid=track-save-failed]').count()) === 1, 'missing tick or warning')
  await box(C, 'http.navegador').check(); await C.waitForTimeout(200)
  check('refused storage: a second tick keeps the first (Codex review, PR #196)', (await box(C, 'html.reparto').isChecked()) && (await box(C, 'http.navegador').isChecked()), 'the first tick was dropped')
  // Phone: the entry sits in the drawer and closes it.
  const phone = await b.newContext({ viewport: { width: 375, height: 800 } })
  await phone.addInitScript(() => { try { if (window === window.top) localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  const P = await phone.newPage(); P.on('pageerror', (e) => errs.push(e.message))
  await P.goto(BASE + '#basics', { waitUntil: 'networkidle' }); await P.waitForTimeout(700)
  await P.getByRole('button', { name: /men[uú]/i }).first().click(); await P.waitForTimeout(600)
  await P.locator('[data-testid=sidebar-webtrack]:visible').first().click(); await P.waitForTimeout(900)
  check('phone: the menu entry opens the track and closes the drawer', (await P.locator('[data-testid=web-track]').count()) === 1 && (await P.locator('[data-testid=sidebar-webtrack]:visible').count()) === 0, `drawer entries visible: ${await P.locator('[data-testid=sidebar-webtrack]:visible').count()}`)
  check('phone: no horizontal overflow', (await P.evaluate(() => document.documentElement.scrollWidth - innerWidth)) <= 0, 'page wider than the screen')
  check('no page errors', errs.length === 0, errs.join(' | '))
  await b.close()
  const failed = results.filter((r) => !r).length
  console.log(`${results.length - failed}/${results.length} passed`); process.exit(failed ? 1 : 0)
})()
