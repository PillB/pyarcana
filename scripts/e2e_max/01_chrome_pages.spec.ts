import { test, expect } from '@playwright/test'
import { loadCatalog } from './helpers/catalog'
import { attachConsoleGuard } from './helpers/assert'
import { gotoHash } from './helpers/nav'

test.describe('E2E max — chrome pages', () => {
  test('catalog gate', async () => {
    const cat = loadCatalog()
    expect(cat.totals.sections, JSON.stringify(cat.totals)).toBe(52)
    expect(cat.totals.demos).toBe(416)
    expect(cat.totals.exercises).toBeGreaterThanOrEqual(1000)
  })

  test('home loads and hash views open without crash', async ({ page }) => {
    const guard = attachConsoleGuard(page)
    const cat = loadCatalog()

    await gotoHash(page, '')
    await expect(page.locator('body')).toBeVisible()

    for (const view of cat.views) {
      if (view === 'home') {
        await gotoHash(page, '')
      } else {
        await gotoHash(page, view)
      }
      await page.waitForTimeout(500)
      // page should still be alive
      await expect(page.locator('body')).toBeVisible()
    }

    // glossary button
    await gotoHash(page, '')
    const gloss = page.getByTestId('nav-glossary')
    if (await gloss.isVisible().catch(() => false)) {
      await gloss.click()
      await page.waitForTimeout(300)
      // close dialog if open (Escape)
      await page.keyboard.press('Escape')
    }

    const crit = guard.critical()
    expect(crit, crit.join('\n')).toHaveLength(0)
  })

  test('click enabled chrome buttons on home without pageerror', async ({ page }) => {
    const pageErrors: string[] = []
    page.on('pageerror', (e) => pageErrors.push(String(e)))

    await gotoHash(page, '')
    const buttons = page.locator('header button:visible, nav button:visible')
    const n = await buttons.count()
    const limit = Math.min(n, 25)
    for (let i = 0; i < limit; i++) {
      const btn = buttons.nth(i)
      if (!(await btn.isEnabled().catch(() => false))) continue
      await btn.click({ timeout: 5000 }).catch(() => {})
      await page.waitForTimeout(150)
      await page.keyboard.press('Escape').catch(() => {})
    }
    expect(pageErrors, pageErrors.join('\n')).toHaveLength(0)
  })
})
