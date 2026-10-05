// Chromium check of the QA tutorial's highlight (owner report, 5 Oct 2026: "sometimes the
// highlighted option is behind the tour box"). On every step that points at a control, at several
// window sizes, the control must be:
//   1. not covered by the tutorial panel (their rectangles do not overlap);
//   2. inside the visible part of the QA window (not scrolled or clipped away);
//   3. spotlighted: a ring drawn over it, so it is not dimmed with the rest of the window.
// Real page, real layout, real scrolling; nothing is faked.
import { chromium } from 'playwright'
import { sandboxTrustArgs } from './sandbox-trust.mjs'
import { existsSync, mkdirSync } from 'node:fs'

const BASE = process.env.BASE || 'http://localhost:8787'
const OUT = new URL('./shots/', import.meta.url).pathname
mkdirSync(OUT, { recursive: true })
// CHROMIUM, else this sandbox's Chromium, else Playwright's own (on the owner's computer, via live.sh).
const SANDBOX_CHROMIUM = '/opt/pw-browsers/chromium'
const executablePath = process.env.CHROMIUM || (existsSync(SANDBOX_CHROMIUM) ? SANDBOX_CHROMIUM : undefined)
const browser = await chromium.launch({ headless: true, args: sandboxTrustArgs(), ...(executablePath ? { executablePath } : {}) })
const results = []

function record(name, ok, detail = '') {
  results.push({ name, ok })
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? `  (${String(detail).slice(0, 300)})` : ''}`)
}

// 1440×698 is the window of the owner's report (the "Contexto capturado" box in it).
const VIEWPORTS = [
  { width: 1440, height: 698 },
  { width: 1280, height: 900 },
  { width: 1024, height: 640 },
  { width: 390, height: 844 },
]

/** Rectangles of the step's target, the tutorial panel, the QA window and the spotlight. */
function measure(page, target) {
  return page.evaluate((sel) => {
    const box = (el) => {
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { top: r.top, bottom: r.bottom, left: r.left, right: r.right }
    }
    return {
      target: box(document.querySelector(sel)),
      panel: box(document.querySelector('[data-testid="qa-tour"] [tabindex="-1"]')),
      dialog: box(document.querySelector('[data-testid="qa-harness-dialog"]')),
      spot: box(document.querySelector('[data-testid="qa-tour-spotlight"]')),
    }
  }, target)
}

const overlap = (a, b) => Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left)) * Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top))
const near = (a, b, px = 4) => ['top', 'bottom', 'left', 'right'].every((k) => Math.abs(a[k] - b[k]) <= px)

for (const vp of VIEWPORTS) {
  const label = `${vp.width}×${vp.height}`
  try {
    const ctx = await browser.newContext({ viewport: vp, locale: 'es-PE' })
    await ctx.addInitScript(() => { try { localStorage.setItem('pyarcana:tourCompleted', '1'); localStorage.setItem('pyarcana:qaTourCompleted', '1') } catch {} })
    const page = await ctx.newPage()
    await page.goto(`${BASE}/#setup`, { waitUntil: 'networkidle' })
    await page.getByTestId('qa-harness-open').click()
    await page.getByTestId('qa-harness-dialog').waitFor()
    await page.getByTestId('qa-tour-open').click()
    await page.getByTestId('qa-tour').waitFor()
    const steps = await page.evaluate(() => Number(/de (\d+)/.exec(document.querySelector('[data-testid="qa-tour"]').textContent)[1]))
    const problems = []
    let checked = 0
    for (let i = 0; i < steps; i++) {
      // The step's target, as the tour announces it (data-target on the tour), or, in a build
      // before that attribute, the element carrying the old inline highlight.
      await page.waitForTimeout(700) // scrolling settles
      const target = await page.evaluate(() => document.querySelector('[data-testid="qa-tour"]')?.getAttribute('data-target') || null)
      const fallback = await page.evaluate(() => {
        // The current build marks nothing: find the element whose inline box-shadow is the highlight.
        const el = [...document.querySelectorAll('[data-testid]')].find((e) => e.style.boxShadow.includes('var(--primary)'))
        return el ? `[data-testid="${el.getAttribute('data-testid')}"]` : null
      })
      const sel = target || fallback
      if (sel) {
        checked += 1
        const m = await measure(page, sel)
        if (!m.target || !m.panel || !m.dialog) {
          problems.push(`step ${i + 1} ${sel}: not found`)
        } else {
          const covered = overlap(m.target, m.panel)
          const inside = m.target.top >= m.dialog.top - 1 && m.target.bottom <= m.dialog.bottom + 1
          const lit = m.spot && near(m.spot, m.target, 6)
          if (covered > 0) problems.push(`step ${i + 1} ${sel}: covered by the panel (${Math.round(covered)} px²)`)
          if (!inside) problems.push(`step ${i + 1} ${sel}: outside the visible window`)
          if (!lit) problems.push(`step ${i + 1} ${sel}: no spotlight on it`)
          await page.screenshot({ path: `${OUT}tour-${vp.width}x${vp.height}-step${i + 1}.png` })
        }
      }
      if (i < steps - 1) await page.getByTestId('qa-tour-next').click()
    }
    record(`${label}: every highlighted control is visible, uncovered and spotlighted (${checked} steps)`, problems.length === 0 && checked > 0, problems.join(' | ') || `${checked} checked`)
    await ctx.close()
  } catch (e) {
    record(`${label}: tour`, false, `threw: ${e.message.split('\n')[0]}`)
  }
}

await browser.close()
const failed = results.filter((r) => !r.ok)
console.log(`\ntour: ${results.length - failed.length}/${results.length} passed`)
process.exit(failed.length ? 1 : 0)
