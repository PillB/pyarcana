/**
 * Every modal, at every size a real display actually is.
 *
 * This exists because the same two defects kept coming back in different
 * dialogs and no gate was watching for either:
 *
 *   1. Width. The base DialogContent ended in `sm:max-w-lg`. A responsive
 *      prefix outranks any unprefixed `max-w-*` a caller passes, so the QA
 *      workspace asked for 1180px and rendered at 512, and the glossary asked
 *      for `max-w-3xl` and rendered at 512 too. Nothing warns you.
 *   2. Height. A dialog whose content grows -- an answer that reveals feedback
 *      and a rule -- pushes its own footer past the bottom edge, and the modal
 *      scroll lock means there is no way to scroll to it. The controls are on
 *      the page and unreachable.
 *
 * So this measures the two things a screenshot review keeps missing: is every
 * interactive control inside the visible box, and is the dialog using the width
 * it was given. Run it against a static build.
 *
 *   node scripts/modal_responsive_probe.mjs --base-url http://127.0.0.1:4321/pyarcana
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, arr) => (a.startsWith('--') ? [[a.slice(2), arr[i + 1]]] : [])),
)
const BASE = args['base-url'] ?? 'http://127.0.0.1:4321/pyarcana'
const OUT = args.out ?? 'course-state/modal_responsive_report.json'

// Real displays, not round numbers: the narrowest phone still in use, a common
// phone, a small laptop in a split window, a MacBook, and a short window --
// which is the case that actually breaks footers and that nobody tests.
const VIEWPORTS = [
  { name: 'phone-320', width: 320, height: 640 },
  { name: 'phone-390', width: 390, height: 844 },
  { name: 'split-768', width: 768, height: 800 },
  { name: 'macbook-1440', width: 1440, height: 900 },
  { name: 'short-1280x600', width: 1280, height: 600 },
  { name: 'very-short-1024x480', width: 1024, height: 480 },
]

/**
 * Each modal names how to open it and, optionally, how to drive it into its
 * tallest state. The tall state is the point: an empty dialog always fits.
 */
const MODALS = [
  {
    id: 'qa-harness',
    open: async (page) => page.getByTestId('qa-harness-open').click(),
    dialog: '[data-testid="qa-harness-dialog"]',
  },
  {
    id: 'qa-tour-step2-answered',
    open: async (page) => {
      await page.evaluate(() => localStorage.removeItem('pyarcana:qaTourCompleted'))
      await page.getByTestId('qa-harness-open').click()
      await page.getByTestId('qa-tour').waitFor({ timeout: 20000 })
      // Step 2, answered correctly: the reported case. A right answer reveals
      // both the feedback and the rule, which is the tallest this step gets.
      await page.getByTestId('qa-tour-next').click()
      await page.getByTestId('qa-tour-option-unanswerable-question').click()
      await page.getByTestId('qa-tour-feedback').waitFor()
    },
    dialog: '[data-testid="qa-tour"]',
  },
  {
    id: 'feedback-modal',
    // The FAB is rendered behind `!IS_STATIC_SITE`, so it does not exist on the
    // Pages build at all. Probing it there produced six identical click
    // timeouts that looked like defects and were not; say so instead.
    requires: 'dynamic',
    open: async (page) => page.getByTestId('feedback-open').click(),
    dialog: '[data-testid="feedback-modal"]',
  },
  {
    id: 'glossary',
    // Two triggers, one per header: `glossary-open` in the desktop bar and
    // `nav-glossary` in the compact one, each hidden at the other's sizes.
    // Probing only the first read as "the glossary cannot be opened on a
    // phone", which is not true -- take whichever is actually on screen.
    open: async (page) => {
      const desktop = page.getByTestId('glossary-open')
      const compact = page.getByTestId('nav-glossary')
      const target = (await desktop.isVisible().catch(() => false)) ? desktop : compact
      await target.first().click()
    },
    dialog: '[data-slot="dialog-content"]',
  },
]

/** A static export hides anything gated on a server session. */
const IS_STATIC = !/localhost:3000|127\.0\.0\.1:3000/.test(BASE)

/** Measure a live dialog: clipped controls, overflow, and width efficiency. */
async function measure(page, dialogSelector) {
  return page.evaluate((sel) => {
    const dialog = document.querySelector(sel)
    if (!dialog) return { present: false }
    const box = dialog.getBoundingClientRect()
    const vw = window.innerWidth
    const vh = window.innerHeight

    const CONTROL = 'button, a[href], input, select, textarea, [role="button"], [tabindex]:not([tabindex="-1"])'
    const clipped = []
    for (const el of dialog.querySelectorAll(CONTROL)) {
      const cs = getComputedStyle(el)
      if (cs.display === 'none' || cs.visibility === 'hidden') continue
      const r = el.getBoundingClientRect()
      if (r.width === 0 && r.height === 0) continue
      // Reachable means: inside the viewport, or inside an ancestor that can be
      // scrolled to bring it into view. Anything else is on the page and lost.
      let scrollable = false
      for (let n = el.parentElement; n && n !== document.body; n = n.parentElement) {
        const s = getComputedStyle(n)
        if (/(auto|scroll)/.test(s.overflowY) && n.scrollHeight > n.clientHeight + 1) { scrollable = true; break }
      }
      const outside = r.bottom > vh + 1 || r.top < -1 || r.right > vw + 1 || r.left < -1
      if (outside && !scrollable) {
        clipped.push({
          label: (el.getAttribute('data-testid') || el.getAttribute('aria-label') || el.textContent || '').trim().slice(0, 40),
          top: Math.round(r.top), bottom: Math.round(r.bottom), left: Math.round(r.left), right: Math.round(r.right),
        })
      }
    }

    return {
      present: true,
      viewport: { width: vw, height: vh },
      dialog: { width: Math.round(box.width), height: Math.round(box.height), top: Math.round(box.top), bottom: Math.round(box.bottom) },
      // A dialog taller than the viewport is fine only if it scrolls somewhere.
      overflowsViewportY: Math.round(Math.max(0, box.bottom - vh) + Math.max(0, -box.top)),
      pageScrollWidth: document.documentElement.scrollWidth,
      // How much of the usable width the dialog takes. A dialog stuck far below
      // what it asked for is the sm:max-w-lg bug.
      widthRatio: Number((box.width / Math.min(vw - 32, 1180)).toFixed(2)),
      clipped,
    }
  }, dialogSelector)
}

const report = { base: BASE, modals: {}, findings: [] }
const browser = await chromium.launch()

for (const modal of MODALS) {
  report.modals[modal.id] = {}
  if (modal.requires === 'dynamic' && IS_STATIC) {
    report.modals[modal.id].skipped = 'not rendered on the static export; probe it against the dev server'
    continue
  }
  for (const vp of VIEWPORTS) {
    const ctx = await browser.newContext({ viewport: { width: vp.width, height: vp.height } })
    const page = await ctx.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      localStorage.setItem('pyarcana:qaTourCompleted', '1')
    })
    try {
      await page.goto(`${BASE}/#setup`, { waitUntil: 'domcontentloaded' })
      await page.waitForSelector('[data-testid="section-root"]', { timeout: 60000 })
      // Baseline first. At 1024x480 this page already scrolls horizontally with
      // no dialog open -- the header control cluster and a wide code block push
      // it to 1067px -- and blaming that on whichever modal happened to be open
      // sent me looking for a dialog bug that was not there. Only the delta a
      // dialog adds is the dialog's fault.
      const baselineScrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
      await modal.open(page)
      await page.waitForTimeout(400)
      const result = await measure(page, modal.dialog)
      result.baselineScrollWidth = baselineScrollWidth
      if (baselineScrollWidth > vp.width + 1) {
        report.pageOverflow ??= []
        if (!report.pageOverflow.includes(vp.name)) report.pageOverflow.push(vp.name)
      }
      report.modals[modal.id][vp.name] = result
      const where = `${modal.id} @ ${vp.name}`
      if (!result.present) {
        report.findings.push(`${where}: dialog did not open`)
      } else {
        if (result.clipped.length) {
          report.findings.push(
            `${where}: ${result.clipped.length} control(s) outside the viewport with nothing to scroll: `
            + result.clipped.map((c) => `"${c.label}" (bottom ${c.bottom} vs ${result.viewport.height})`).join(', '),
          )
        }
        if (result.pageScrollWidth > Math.max(result.baselineScrollWidth, vp.width) + 1) {
          report.findings.push(
            `${where}: opening the dialog widened the page from ${result.baselineScrollWidth}px to ${result.pageScrollWidth}px (viewport ${vp.width}px)`,
          )
        }
        // Only meaningful where there is room to be wider than the phone gutter.
        if (vp.width >= 768 && result.widthRatio < 0.5) {
          report.findings.push(`${where}: dialog uses ${Math.round(result.widthRatio * 100)}% of the width available to it (${result.dialog.width}px)`)
        }
      }
    } catch (error) {
      report.findings.push(`${modal.id} @ ${vp.name}: ${String(error).split('\n')[0]}`)
    } finally {
      await ctx.close()
    }
  }
}

await browser.close()
report.ok = report.findings.length === 0
if (report.pageOverflow?.length) {
  report.pageOverflowNote =
    `The page itself scrolls horizontally at ${report.pageOverflow.join(', ')} with no dialog open. `
    + 'That is a layout defect in its own right, tracked separately: it is not caused by any modal here.'
}
mkdirSync(OUT.split('/').slice(0, -1).join('/') || '.', { recursive: true })
writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ ok: report.ok, findings: report.findings, page_overflow: report.pageOverflowNote ?? 'none' }, null, 2))
process.exit(report.ok ? 0 : 1)
