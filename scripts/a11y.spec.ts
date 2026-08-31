/**
 * Automated accessibility checks on the surfaces this campaign touched.
 *
 * A caveat that belongs at the top rather than in a footnote: axe finds a
 * minority of WCAG problems. Published estimates put automated coverage around
 * a third of issues, and the ones it cannot see are the ones that matter most
 * here -- whether a keyboard path is usable, whether an announcement makes
 * sense, whether a focus order matches the reading order. A green run means
 * "no machine-detectable violations", never "accessible".
 *
 * It is still worth having. Before this file the repository had no automated
 * accessibility check of any kind, so claims about the QA workspace being
 * keyboard-reachable rested on assertions written by the same person who wrote
 * the feature.
 */
import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const BASE = process.env.PAGES_BASE ? '/pyarcana' : ''

/** WCAG 2.0/2.1/2.2 A and AA — the level this course claims to meet. */
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']

type Violation = {
  id: string
  impact?: string | null
  nodes: { target: unknown[]; failureSummary?: string }[]
  help: string
}

/**
 * Name the nodes, not just the rule. "nested-interactive 52x" tells you a
 * number; the first three selectors tell you where to look, which is the
 * difference between a finding and a chore.
 */
function summarise(violations: Violation[]) {
  return violations
    .map((v) => {
      const where = v.nodes
        .slice(0, 3)
        .map((n) => String(n.target?.[0] ?? '?'))
        .join(', ')
      const more = v.nodes.length > 3 ? ` (+${v.nodes.length - 3} more)` : ''
      return `${v.id} (${v.impact ?? 'n/a'}, ${v.nodes.length}x): ${v.help}\n    at ${where}${more}`
    })
    .join('\n')
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem('pyarcana:tourCompleted', '1')
    localStorage.setItem('pyarcana:qaTourCompleted', '1')
  })
})

test.describe('Accessibility (axe, WCAG 2.2 AA rules)', () => {
  test('a course section has no machine-detectable violations', async ({ page }) => {
    await page.goto(`${BASE}/#setup`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="section-root"]', { timeout: 60000 })
    const { violations } = await new AxeBuilder({ page }).withTags(TAGS).analyze()
    expect(summarise(violations as Violation[])).toBe('')
  })

  test('the QA workspace has no machine-detectable violations', async ({ page }) => {
    await page.goto(`${BASE}/#setup`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="section-root"]', { timeout: 60000 })
    await page.getByTestId('qa-harness-open').click()
    await page.getByTestId('qa-harness-dialog').waitFor({ timeout: 20000 })
    // Scope to the dialog: the page behind it is inert and covered by the
    // section test above, and including it would report the same nodes twice.
    const { violations } = await new AxeBuilder({ page })
      .include('[data-testid="qa-harness-dialog"]')
      .withTags(TAGS)
      .analyze()
    expect(summarise(violations as Violation[])).toBe('')
  })

  test('the QA tutorial has no machine-detectable violations', async ({ page }) => {
    await page.goto(`${BASE}/#setup`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="section-root"]', { timeout: 60000 })
    await page.evaluate(() => localStorage.removeItem('pyarcana:qaTourCompleted'))
    await page.getByTestId('qa-harness-open').click()
    await page.getByTestId('qa-tour').waitFor({ timeout: 20000 })
    // Walk to an exercise: the option buttons and the feedback live region are
    // the parts with something to get wrong.
    for (let step = 0; step < 12; step += 1) {
      if (await page.locator('[data-testid="qa-tour-option-unanswerable-question"]').count()) break
      await page.getByTestId('qa-tour-next').click()
      await page.waitForTimeout(120)
    }
    await page.getByTestId('qa-tour-option-unanswerable-question').click()
    await page.getByTestId('qa-tour-feedback').waitFor()
    const { violations } = await new AxeBuilder({ page })
      .include('[data-testid="qa-tour"]')
      .withTags(TAGS)
      .analyze()
    expect(summarise(violations as Violation[])).toBe('')
  })

  test('every control in the QA workspace has an accessible name', async ({ page }) => {
    // Not an axe rule for non-icon buttons, and the thing most likely to break
    // as controls get wrapped: an icon-only button whose label lived in a
    // `title` that was removed, or a wrapper that swallowed aria-label.
    await page.goto(`${BASE}/#setup`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="section-root"]', { timeout: 60000 })
    await page.getByTestId('qa-harness-open').click()
    await page.getByTestId('qa-harness-dialog').waitFor({ timeout: 20000 })

    const unnamed = await page.evaluate(() => {
      const dialog = document.querySelector('[data-testid="qa-harness-dialog"]')
      if (!dialog) return ['no dialog']
      const out: string[] = []
      for (const el of dialog.querySelectorAll('button, [role="tab"], a[href]')) {
        const cs = getComputedStyle(el)
        if (cs.display === 'none' || cs.visibility === 'hidden') continue
        const name = (
          el.getAttribute('aria-label')
          || (el.getAttribute('aria-labelledby')
            ? document.getElementById(el.getAttribute('aria-labelledby')!)?.textContent
            : '')
          || (el as HTMLElement).innerText
          || el.getAttribute('title')
          || ''
        ).trim()
        if (!name) out.push(el.outerHTML.slice(0, 90))
      }
      return out
    })
    expect(unnamed, 'controls with no accessible name').toEqual([])
  })
})
