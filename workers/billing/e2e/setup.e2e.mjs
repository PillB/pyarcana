// Chromium check of Sesión 0 (/empezar) on the built static site, at desktop and phone sizes.
//
//   BASE=http://localhost:8787 node setup.e2e.mjs            # inside run.sh (no base path)
//   BASE=http://localhost:8099/pyarcana EXPECT_SHOT=1 node setup.e2e.mjs
//
// What it proves, on the real page with real layout and real storage:
//   1. no horizontal scroll at 1280 or 390 wide, and every diagram renders an <svg>;
//   2. the track follows the browser (a Mac user agent gets the macOS track and is told so);
//   3. the switch works from the keyboard alone, and the choice survives a reload;
//   4. a tick updates the counter, survives a reload, and is stored under its own key while the
//      course's progress key (`python-ds-progress`) stays untouched;
//   5. a browser that refuses storage gets told its ticks won't stay, and the page still works;
//   6. a phone gets the "you need a computer" note;
//   7. axe finds no WCAG 2.2 A/AA violation, in light and dark, with every recovery box open
//      (a green run means no machine-detectable violation, never "accessible": scripts/a11y.spec.ts);
//   8. with EXPECT_SHOT=1 (a build carrying a capture), the screenshot loads from the hashed
//      _next/static path under the base path, with its box and its dated caption.
import { chromium } from 'playwright'
import AxeBuilder from '@axe-core/playwright'
import { launchOptions } from './sandbox-trust.mjs'
import { mkdirSync } from 'node:fs'

const BASE = (process.env.BASE || 'http://localhost:8787').replace(/\/$/, '')
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
const browser = await chromium.launch(launchOptions())
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

const UA = {
  mac: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Safari/605.1.15',
  win: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36',
  android: 'Mozilla/5.0 (Linux; Android 14; SM-A145M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Mobile Safari/537.36',
}

async function open(ctx) {
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e)))
  await page.goto(`${BASE}/empezar`, { waitUntil: 'networkidle' })
  await page.locator('[data-testid="setup-intro"][data-ready="1"]').waitFor({ timeout: 15_000 })
  return { page, errors }
}

const stepIds = (page) => page.$$eval('[data-testid="setup-step"]', (els) => els.map((e) => e.getAttribute('data-step-id')))

for (const vp of [{ width: 1280, height: 800, ua: UA.mac, name: 'desktop' }, { width: 390, height: 844, ua: UA.win, name: 'phone-size' }]) {
  const label = `${vp.name} ${vp.width}×${vp.height}`
  const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, userAgent: vp.ua, locale: 'es-PE' })
  try {
    const { page, errors } = await open(ctx)
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
    record(`${label}: no horizontal scroll`, overflow <= 0, `overflow ${overflow}px`)
    const figs = await page.$$eval('[data-testid="course-figure"]', (els) => els.map((e) => [e.getAttribute('data-figure-id'), !!e.querySelector('svg')]))
    record(`${label}: every diagram draws an svg`, figs.length >= 3 && figs.every(([, svg]) => svg), JSON.stringify(figs))
    const os = await page.getAttribute('[data-testid="setup-intro"]', 'data-os')
    const want = vp.ua === UA.mac ? 'macos' : 'windows'
    record(`${label}: the track follows the browser (${want})`, os === want, `data-os=${os}`)
    const origin = await page.textContent('[data-testid="setup-os-origin"]')
    record(`${label}: the page says it detected the system`, /detectamos/i.test(origin ?? ''), origin)
    const ids = await stepIds(page)
    const foreign = want === 'macos' ? 'python.win.path' : 'python.mac.certificados'
    record(`${label}: no step from another system`, ids.length > 20 && !ids.includes(foreign), `${ids.length} steps`)
    await page.screenshot({ path: `${OUT}setup-${vp.name}-top.png` })
    await page.screenshot({ path: `${OUT}setup-${vp.name}-full.png`, fullPage: true })
    record(`${label}: no script errors`, errors.length === 0, errors.join(' | '))
    // Followed, not pattern-matched: the href is "/pyarcana#setup" under a base path, "/#setup" without.
    await page.click('[data-testid="setup-to-s01"]')
    const s01 = await page.locator('[data-testid="section-root"]').getAttribute('data-section-id', { timeout: 20_000 }).catch(() => null)
    record(`${label}: the way on opens Section 1`, s01 === 'setup', `${page.url()} → ${s01}`)
  } catch (e) {
    record(`${label}: page runs`, false, e.message)
  }
  await ctx.close()
}

// Keyboard switch, ticks, reload, storage keys.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: UA.win, locale: 'es-PE' })
  try {
    const { page } = await open(ctx)
    await page.focus('[data-testid="setup-os-windows"]')
    await page.keyboard.press('ArrowRight') // macOS
    await page.keyboard.press('ArrowRight') // Linux
    await page.waitForFunction(() => document.querySelector('[data-testid="setup-intro"]')?.getAttribute('data-os') === 'linux')
    const ids = await stepIds(page)
    record('keyboard: arrows move the switch to Linux and the steps follow', ids.includes('python.linux.venv') && !ids.includes('python.win.path'))
    const before = await page.textContent('[data-testid="setup-progress"]')
    await page.locator('[data-step-id="terminal.linux.abrir"] [data-testid="setup-step-done"]').check()
    const after = await page.textContent('[data-testid="setup-progress"]')
    record('tick: the counter moves from 0 to 1', /\b0 de\b/.test(before ?? '') && /\b1 de\b/.test(after ?? ''), `${before} → ${after}`)
    const details = page.locator('[data-step-id="python.linux.verificar"] [data-testid="setup-fixes"]')
    await details.locator('summary').focus()
    await page.keyboard.press('Enter')
    record('keyboard: Enter opens «Si no funciona»', await details.evaluate((d) => d.open))
    await page.reload({ waitUntil: 'networkidle' })
    await page.locator('[data-testid="setup-intro"][data-ready="1"]').waitFor()
    const os = await page.getAttribute('[data-testid="setup-intro"]', 'data-os')
    const done = await page.getAttribute('[data-step-id="terminal.linux.abrir"]', 'data-done')
    const origin = await page.textContent('[data-testid="setup-os-origin"]')
    record('reload: the chosen track and the tick survive', os === 'linux' && done === '1' && /Elegiste/.test(origin ?? ''), `os=${os} done=${done}`)
    const keys = await page.evaluate(() => ({ mine: localStorage.getItem('pyarcana:sesion0:v1'), course: localStorage.getItem('python-ds-progress') }))
    const mine = JSON.parse(keys.mine ?? '{}')
    record('storage: own key only; the course progress key is untouched', mine.os === 'linux' && mine.done?.includes('terminal.linux.abrir') && keys.course === null, JSON.stringify(keys))
  } catch (e) {
    record('switch and ticks', false, e.message)
  }
  await ctx.close()
}

// A browser that refuses storage.
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: UA.win, locale: 'es-PE' })
  await ctx.addInitScript(() => {
    Storage.prototype.setItem = function () {
      throw new DOMException('blocked', 'SecurityError')
    }
  })
  try {
    const { page, errors } = await open(ctx)
    await page.locator('[data-testid="setup-step-done"]').first().check()
    const warned = await page.isVisible('[data-testid="setup-save-failed"]')
    const after = await page.textContent('[data-testid="setup-progress"]')
    record('blocked storage: the tick still shows, and the page says it will not stay', warned && /\b1 de\b/.test(after ?? '') && errors.length === 0, `${after} ${errors.join(' | ')}`)
    // The warning only exists in this state, so the axe runs above never saw its colours.
    const { violations } = await new AxeBuilder({ page }).include('[data-testid="setup-save-failed"]').withTags(['wcag2aa']).analyze()
    record('blocked storage: the warning passes axe colour contrast', violations.length === 0, violations.map((v) => v.id).join(', '))
  } catch (e) {
    record('blocked storage', false, e.message)
  }
  await ctx.close()
}

// A phone.
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA.android, locale: 'es-PE', isMobile: true, hasTouch: true })
  try {
    const { page } = await open(ctx)
    record('phone: the "you need a computer" note shows', await page.isVisible('[data-testid="setup-mobile-note"]'))
    const origin = await page.textContent('[data-testid="setup-os-origin"]')
    record('phone: the page says it could not detect a computer', /No pudimos/.test(origin ?? ''), origin)
  } catch (e) {
    record('phone', false, e.message)
  }
  await ctx.close()
}

// axe, as scripts/a11y.spec.ts runs it on the course, with the same WCAG tags.
for (const scheme of ['light', 'dark']) {
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: UA.win, locale: 'es-PE', colorScheme: scheme })
  await ctx.addInitScript((s) => { try { localStorage.setItem('theme', s) } catch {} }, scheme)
  try {
    const { page } = await open(ctx)
    // Open every "Si no funciona": closed <details> content is skipped by axe's contrast rule.
    await page.$$eval('details', (ds) => ds.forEach((d) => { d.open = true }))
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']).analyze()
    const summary = violations.map((v) => `${v.id} (${v.impact}, ${v.nodes.length}x) at ${v.nodes.slice(0, 3).map((n) => n.target[0]).join(', ')}`).join(' | ')
    record(`axe (${scheme}): no WCAG 2.2 A/AA violation on /empezar`, violations.length === 0, summary)
  } catch (e) {
    record(`axe (${scheme})`, false, e.message)
  }
  await ctx.close()
}

// The ways in: the dashboard and the top of Section 1 (and only Section 1).
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, locale: 'es-PE' })
  await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1') } catch {} })
  try {
    const page = await ctx.newPage()
    await page.goto(`${BASE}/`, { waitUntil: 'networkidle' })
    const home = page.locator('[data-testid="setup-intro-link"]')
    record('dashboard: the Sesión 0 link is there', await home.isVisible())
    // Each section is a full page load (via about:blank), never a hash-only change: a hash change
    // that lands before hydration can be missed, the likely cause of one timeout here right after a
    // heavy build (5 Oct; not reproduced in three reruns).
    const openSection = async (id) => {
      await page.goto('about:blank')
      await page.goto(`${BASE}/#${id}`, { waitUntil: 'networkidle' })
      await page.locator(`[data-testid="section-root"][data-section-id="${id}"]`).waitFor({ timeout: 20_000 })
    }
    await openSection('setup')
    const inS01 = page.locator('[data-testid="section-root"] [data-testid="setup-intro-link"]')
    record('Section 1: the Sesión 0 link is at the top', await inS01.isVisible())
    await openSection('basics')
    record('Section 2: no Sesión 0 link', (await page.locator('[data-testid="section-root"] [data-testid="setup-intro-link"]').count()) === 0)
    await openSection('setup')
    await inS01.locator('a').click()
    await page.locator('[data-testid="setup-intro"]').waitFor({ timeout: 20_000 })
    record('Section 1 → Sesión 0: the link opens /empezar', /\/empezar$/.test(new URL(page.url()).pathname), page.url())
  } catch (e) {
    record('ways in', false, e.message)
  }
  await ctx.close()
}

// The screenshots, on a build that carries captures: every one on the Windows and macOS tracks.
if (process.env.EXPECT_SHOT) {
  for (const ua of [UA.win, UA.mac]) {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 800 }, userAgent: ua, locale: 'es-PE' })
    try {
      const { page } = await open(ctx)
      const shots = page.locator('[data-testid="setup-shot"]')
      const n = await shots.count()
      const base = new URL(BASE).pathname.replace(/\/$/, '')
      const bad = []
      let boxes = 0
      for (let i = 0; i < n; i++) {
        const shot = shots.nth(i)
        await shot.scrollIntoViewIfNeeded()
        const info = await shot.evaluate(async (fig) => {
          const img = fig.querySelector('img')
          if (!img.complete) await new Promise((r) => img.addEventListener('load', r, { once: true }))
          const credit = fig.querySelector('[data-testid="setup-shot-credit"]')
          const kind = fig.getAttribute('data-kind')
          const badge = fig.querySelector('[data-testid="setup-shot-illustration"]')?.textContent ?? ''
          return {
            id: fig.getAttribute('data-shot-id'), src: img.getAttribute('src'), natural: img.naturalWidth, alt: img.alt,
            box: !!fig.querySelector('svg rect'), caption: fig.querySelector('figcaption').textContent,
            licence: credit ? [...credit.querySelectorAll('a')].map((a) => a.getAttribute('href')) : null,
            kind, badge,
          }
        })
        boxes += info.box ? 1 : 0
        const served = info.src.startsWith(`${base}/_next/static/media/`) && info.natural > 0
        const dated = /(Comprobado|Consultada|Ilustración revisada) el \d+ \w+ \d{4}/.test(info.caption)
        // A reused picture links its source and licence (CC BY 4.0 §3(a)); an illustration says so above
        // the picture and in its alt; our own capture says when it was checked.
        const attributed =
          info.kind === 'illustration' ? /no es una captura real/.test(info.badge) && /^Ilustración/.test(info.alt)
          : info.licence ? info.licence.length === 2 && info.licence.every((h) => h?.startsWith('https://'))
          : /Comprobado/.test(info.caption)
        if (!(served && info.alt.length > 40 && dated && attributed)) bad.push(`${info.id}: ${JSON.stringify(info).slice(0, 200)}`)
        await shot.screenshot({ path: `${OUT}setup-shot-${info.id}.png` })
      }
      const track = ua === UA.mac ? 'macOS' : 'Windows'
      record(`screenshots (${track}): ${n} served from _next/static under the base path, with alt, date and attribution`, n > 0 && bad.length === 0, bad.join(' | '))
      record(`screenshots (${track}): at least one carries a box drawn over it`, boxes > 0, `${boxes} of ${n}`)
      // Every picture is followed by the product's own current guide, opening in a new tab.
      const guides = await page.$$eval('[data-testid="setup-step"]', (steps) => steps.filter((s) => s.querySelector('[data-testid="setup-shot"]')).map((s) => {
        const a = s.querySelector('[data-testid="setup-guide-link"]')
        return a ? { ok: a.getAttribute('target') === '_blank' && /noopener/.test(a.getAttribute('rel') ?? '') && a.href.startsWith('https://'), id: s.getAttribute('data-step-id') } : { ok: false, id: s.getAttribute('data-step-id') }
      }))
      record(`screenshots (${track}): each picture is followed by its official guide`, guides.length === n && guides.every((g) => g.ok), guides.filter((g) => !g.ok).map((g) => g.id).join(', '))
    } catch (e) {
      record('screenshots', false, e.message)
    }
    await ctx.close()
  }
}

await browser.close()
const failed = results.filter((r) => !r.ok).length
console.log(`\n${results.length - failed} passed, ${failed} failed`)
process.exit(failed ? 1 : 0)
