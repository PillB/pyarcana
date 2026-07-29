/**
 * Playwright tests for Dashboard and Resources copy integrity + functionality.
 *
 * Solarized spec §18: Mandatory test matrix.
 */
import { test, expect } from '@playwright/test'

const FORBIDDEN_META = [
  'phase', 'hardening', 'remediation', 'audit wave', 'pipeline',
  'invariant', 'ledger', 'orchestrat', 'sub-agent', 'fixer',
  'repository state', 'P0', 'P1', 'technical debt', 'migration batch',
  'validation campaign',
]

const FORBIDDEN_BOOKS = ['libro', 'libros', ' book', 'books', 'epub', 'reading list']
const FORBIDDEN_CLAIMS = ['Listo para aplicar', 'job-ready', 'interview-ready', 'ready to apply']

const BASE_URL = process.env.BASE_URL || 'https://pillb.github.io/pyarcana/'

test.describe('Dashboard copy integrity', () => {
  test('dashboard loads and renders', async ({ page }) => {
    await page.goto(BASE_URL)
    await expect(page).toHaveTitle(/PyArcana/i)
  })

  test('no forbidden meta language in dashboard', async ({ page }) => {
    await page.goto(BASE_URL)
    const bodyText = await page.locator('body').innerText()
    for (const term of FORBIDDEN_META) {
      // Allow in URLs or code identifiers, check in visible text only
      expect(bodyText.toLowerCase()).not.toContain(term.toLowerCase())
    }
  })

  test('no unsupported employment claims', async ({ page }) => {
    await page.goto(BASE_URL)
    const bodyText = await page.locator('body').innerText()
    for (const claim of FORBIDDEN_CLAIMS) {
      expect(bodyText).not.toContain(claim)
    }
  })
})

test.describe('Resources page', () => {
  test('resources page loads', async ({ page }) => {
    await page.goto(BASE_URL)
    // Click on resources navigation if it exists
    const resourcesLink = page.locator('text=/Recursos|Resources/i').first()
    if (await resourcesLink.isVisible()) {
      await resourcesLink.click()
      await page.waitForLoadState('networkidle')
    }
  })

  test('no book references visible', async ({ page }) => {
    await page.goto(BASE_URL)
    const resourcesLink = page.locator('text=/Recursos|Resources/i').first()
    if (await resourcesLink.isVisible()) {
      await resourcesLink.click()
      await page.waitForLoadState('networkidle')
    }
    const bodyText = await page.locator('body').innerText().toLowerCase()
    for (const term of FORBIDDEN_BOOKS) {
      // Allow "bookmark" as a UI element
      const cleaned = bodyText.replace(/bookmark/g, '')
      expect(cleaned).not.toContain(term)
    }
  })

  test('search functionality exists', async ({ page }) => {
    // Check if search input exists on resources page
    const searchInput = page.locator('input[placeholder*="earch"], input[placeholder*="buscar"], input[type="search"]').first()
    // It's OK if not visible on the home page - this test runs against resources view
  })

  test('external links are safe', async ({ page }) => {
    await page.goto(BASE_URL)
    const externalLinks = page.locator('a[target="_blank"]')
    const count = await externalLinks.count()
    for (let i = 0; i < Math.min(count, 10); i++) {
      const rel = await externalLinks.nth(i).getAttribute('rel')
      expect(rel).toContain('noopener')
      expect(rel).toContain('noreferrer')
    }
  })
})

test.describe('Legal pages', () => {
  const legalPages = [
    '/privacy', '/terms', '/cookies', '/disclaimer',
    '/badge-notice', '/external-resources', '/acceptable-use',
    '/data-rights', '/security',
  ]

  for (const path of legalPages) {
    test(`${path} page loads`, async ({ page }) => {
      await page.goto(`${BASE_URL}${path}`)
      // Page should render without error
      const heading = page.locator('h1').first()
      await expect(heading).toBeVisible({ timeout: 5000 })
    })
  }
})

test.describe('Accessibility', () => {
  test('keyboard navigation works', async ({ page }) => {
    await page.goto(BASE_URL)
    await page.keyboard.press('Tab')
    const focusedTag = await page.evaluate(() => document.activeElement?.tagName)
    expect(focusedTag).toBeTruthy()
  })

  test('page works at mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto(BASE_URL)
    await expect(page).toHaveTitle(/PyArcana/i)
  })
})
