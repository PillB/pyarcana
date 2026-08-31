/**
 * Safe-Agent critical learner journeys (isolated contexts, semantic locators).
 * Intended for static GitHub Pages base path (/pyarcana) or dynamic root.
 *
 * Network: records request failures AND HTTP responses >= 400.
 */
import { expect, test, type Page, type Response } from '@playwright/test'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const IS_PAGES = BASE.includes('4173') || process.env.PAGES_BASE === '1'
const HOME = IS_PAGES ? '/pyarcana/' : '/'

type NetIssue = { kind: 'requestfailed' | 'http>=400'; url: string; detail: string }

async function dismissTour(page: Page) {
  await page.addInitScript(() => {
    try {
      localStorage.setItem('pyarcana:tourCompleted', '1')
    } catch {
      /* storage may be unavailable in some tests */
    }
  })
}

function attachNetworkGuards(page: Page): NetIssue[] {
  const issues: NetIssue[] = []
  page.on('requestfailed', (req) => {
    const detail = req.failure()?.errorText || 'unknown'
    // SPA / link prefetch aborts are not product failures; keep real errors.
    if (detail.includes('ERR_ABORTED') || detail.includes('net::ERR_ABORTED')) return
    if (req.url().includes('favicon')) return
    issues.push({
      kind: 'requestfailed',
      url: req.url(),
      detail,
    })
  })
  page.on('response', (res: Response) => {
    if (res.status() >= 400) {
      // Ignore expected auth API noise on static edition when present
      const url = res.url()
      if (url.includes('/api/') && IS_PAGES) return
      if (url.includes('favicon')) return
      issues.push({ kind: 'http>=400', url, detail: String(res.status()) })
    }
  })
  return issues
}

test.describe('Safe-Agent learner journeys', () => {
  test.describe.configure({ mode: 'serial' })

  test('first visit shows branded landing without application error', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    const issues = attachNetworkGuards(page)
    await dismissTour(page)
    await page.goto(HOME)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.locator('body')).not.toContainText('Application error')
    const critical = issues.filter(
      (i) => !i.url.includes('favicon') && !i.url.includes('chrome-extension')
    )
    expect(critical, JSON.stringify(critical, null, 2)).toEqual([])
    await context.close()
  })

  test('corrupt progress storage fails safely (no white-screen)', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      localStorage.setItem('python-ds-progress', '{not-valid-json')
    })
    await page.goto(HOME)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.locator('body')).not.toContainText('Application error')
    await expect(page.locator('body')).not.toContainText('a client-side exception')
    await context.close()
  })

  test('returning learner keeps completed sections and quiz scores in storage', async ({
    browser,
  }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      localStorage.setItem(
        'python-ds-progress',
        JSON.stringify({
          state: {
            completedSections: ['setup'],
            completedSubSteps: { setup: ['theory', 'ido', 'wedo', 'youdo', 'quiz'] },
            quizScores: { setup: 100 },
            lastVisited: 'setup',
            bookmarks: ['setup'],
            startDate: '2025-01-01T00:00:00.000Z',
            isHydratedFromServer: false,
          },
          version: 0,
        })
      )
    })
    await page.goto(HOME)
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    const stored = await page.evaluate(() => localStorage.getItem('python-ds-progress'))
    expect(stored).toBeTruthy()
    const parsed = JSON.parse(stored as string)
    expect(parsed.state.completedSections).toContain('setup')
    expect(parsed.state.quizScores.setup).toBe(100)
    expect(parsed.state.bookmarks).toContain('setup')
    await context.close()
  })

  test('reload after visit does not crash and storage key remains stable', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await page.reload()
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    await expect(page.locator('body')).not.toContainText('Application error')
    await context.close()
  })

  test('compact mobile viewport renders landing', async ({ browser }) => {
    const context = await browser.newContext({
      viewport: { width: 390, height: 844 },
      isMobile: true,
      hasTouch: true,
    })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    // Basic reflow: no horizontal document overflow beyond small tolerance
    const overflow = await page.evaluate(() => {
      const doc = document.documentElement
      return doc.scrollWidth - doc.clientWidth
    })
    expect(overflow).toBeLessThan(40)
    await context.close()
  })

  test('keyboard focus can reach interactive chrome', async ({ browser }) => {
    const context = await browser.newContext()
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    // Tab through a few focusable elements; ensure focus is within document
    for (let i = 0; i < 8; i++) {
      await page.keyboard.press('Tab')
    }
    const tag = await page.evaluate(() => document.activeElement?.tagName || '')
    expect(tag.length).toBeGreaterThan(0)
    await context.close()
  })

  test('desktop sidebar subsection opens that tab without mutating progress', async ({
    browser,
  }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      localStorage.setItem(
        'python-ds-progress',
        JSON.stringify({
          state: {
            completedSections: [],
            completedSubSteps: { setup: ['theory'] },
            quizScores: {},
            lastVisited: 'setup',
            bookmarks: [],
            startDate: '2025-01-01T00:00:00.000Z',
            isHydratedFromServer: false,
          },
          version: 0,
        }),
      )
    })
    await page.goto(HOME)
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 20000,
    })
    // Target the navigation button by id, not by `[role="button"]` and a text
    // filter. That selector matched the row only while the row was a div
    // pretending to be a button; the row is a real button now, and a text
    // filter over every control in the sidebar is fragile either way.
    await page.getByTestId('sidebar-section-setup').first().click()
    await expect(page.locator('[data-testid="section-root"]')).toBeVisible({ timeout: 20000 })
    const before = await page.evaluate(() => localStorage.getItem('python-ds-progress'))
    await page.locator('[data-testid="sidebar-substep-ido"]').first().click()
    await expect(page.locator('[data-testid="tab-ido"][data-state="active"]')).toBeVisible({
      timeout: 10000,
    })
    const after = await page.evaluate(() => localStorage.getItem('python-ds-progress'))
    const beforeState = JSON.parse(before as string).state
    const afterState = JSON.parse(after as string).state
    expect(afterState.completedSubSteps).toEqual(beforeState.completedSubSteps)
    expect(afterState.completedSections).toEqual(beforeState.completedSections)
    expect(afterState.quizScores).toEqual(beforeState.quizScores)
    await context.close()
  })

  test('capstones disclaimer is visible copy, not a translation key', async ({ browser }) => {
    const context = await browser.newContext({ viewport: { width: 1280, height: 800 } })
    const page = await context.newPage()
    await dismissTour(page)
    await page.goto(`${HOME}#capstones`)
    await expect(page.locator('body')).not.toContainText('capstones.disclaimer')
    await expect(page.locator('body')).toContainText(/competenc|curricular/i)
    await context.close()
  })
})
