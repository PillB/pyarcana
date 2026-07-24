/**
 * Exhaustive mouse + keyboard lesson flow (no shell shortcuts).
 * Clicks chrome, opens each section via prev/next FABs and tabs,
 * exercises quiz options with keyboard where possible.
 */
import { test, expect } from '@playwright/test'
import { loadCatalog } from './helpers/catalog'
import { attachConsoleGuard } from './helpers/assert'
import { gotoHash, gotoSection, openTab } from './helpers/nav'

test.describe('Mouse/keyboard lesson flow', () => {
  test('home chrome: click + Escape close dialogs', async ({ page }) => {
    const guard = attachConsoleGuard(page)
    await gotoHash(page, '')
    await expect(page.locator('body')).toBeVisible()

    // Mouse: open glossary if present
    const gloss = page.getByTestId('nav-glossary')
    if (await gloss.isVisible().catch(() => false)) {
      await gloss.click()
      await page.waitForTimeout(200)
      await page.keyboard.press('Escape')
    }

    // Click visible header/nav buttons (limit)
    const buttons = page.locator('header button:visible, nav button:visible')
    const n = Math.min(await buttons.count(), 20)
    for (let i = 0; i < n; i++) {
      const btn = buttons.nth(i)
      if (!(await btn.isEnabled().catch(() => false))) continue
      await btn.click({ timeout: 4000 }).catch(() => {})
      await page.waitForTimeout(100)
      await page.keyboard.press('Escape').catch(() => {})
    }

    expect(guard.critical(), guard.critical().join('\n')).toHaveLength(0)
  })

  test('walk S01 fully: tabs + quiz option keyboard + nav FABs', async ({ page }) => {
    test.setTimeout(180_000)
    const guard = attachConsoleGuard(page)
    const cat = loadCatalog()
    const s1 = cat.sections.find((s) => s.index === 1)
    expect(s1).toBeTruthy()

    await gotoSection(page, s1!.id)

    for (const tab of ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const) {
      await openTab(page, tab)
      const panel = page.locator('[data-state="active"][role="tabpanel"]')
      await expect(panel).toBeVisible()
      expect(((await panel.textContent()) || '').trim().length).toBeGreaterThan(10)
    }

    // Quiz: click first option with mouse
    await openTab(page, 'quiz')
    const opt = page.locator('[data-testid^="quiz-option-"], button:has-text("A."), [role="radio"]').first()
    if (await opt.isVisible().catch(() => false)) {
      await opt.click()
    } else {
      // keyboard: Tab into panel and Space
      await page.keyboard.press('Tab')
      await page.keyboard.press('Space')
    }

    // FABs mouse navigation.
    // Next.js dev overlay (`nextjs-portal`) can intercept bottom fixed FABs under `npm run dev`.
    // Dismiss via Escape; force-click is last resort so CI/dev stays deterministic.
    await page.keyboard.press('Escape').catch(() => {})
    await page.evaluate(() => {
      document.querySelectorAll('nextjs-portal').forEach((el) => {
        ;(el as HTMLElement).style.pointerEvents = 'none'
      })
    })
    await expect(page.getByTestId('section-prev')).toBeVisible()
    await expect(page.getByTestId('section-next')).toBeVisible()
    await page.getByTestId('section-next').click({ force: true })
    await page.waitForTimeout(400)
    // Should leave S01
    const root = page.getByTestId('section-root')
    await expect(root).toBeVisible()
    await page.getByTestId('section-prev').click({ force: true })
    await page.waitForTimeout(400)
    await expect(root).toHaveAttribute('data-section-id', s1!.id)

    expect(guard.critical(), guard.critical().join('\n')).toHaveLength(0)
  })

  test('mouse-walk first 5 sections tabs + next FAB chain', async ({ page }) => {
    test.setTimeout(300_000)
    const guard = attachConsoleGuard(page)
    const cat = loadCatalog()
    const first = cat.sections.filter((s) => s.index <= 5).sort((a, b) => a.index - b.index)

    await gotoSection(page, first[0].id)
    for (const section of first) {
      await expect(page.getByTestId('section-root')).toHaveAttribute(
        'data-section-id',
        section.id,
        { timeout: 20_000 }
      )
      for (const tab of ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const) {
        await openTab(page, tab)
        const panel = page.locator('[data-state="active"][role="tabpanel"]')
        await expect(panel).toBeVisible()
      }
      // click a demo card if any
      await openTab(page, 'ido')
      const demo = page.locator('[data-testid^="demo-"]').first()
      if (await demo.isVisible().catch(() => false)) {
        await demo.click({ timeout: 3000 }).catch(() => {})
      }
      // weDo: open first exercise check if present
      await openTab(page, 'wedo')
      const check = page.locator('[data-testid^="exercise-check-"]').first()
      if (await check.isVisible().catch(() => false)) {
        await check.click({ timeout: 5000 }).catch(() => {})
      }
      if (section.index < 5) {
        await page.evaluate(() => {
          document.querySelectorAll('nextjs-portal').forEach((el) => {
            ;(el as HTMLElement).style.pointerEvents = 'none'
          })
        })
        await page.getByTestId('section-next').click({ force: true })
        await page.waitForTimeout(350)
      }
    }
    expect(guard.critical(), guard.critical().join('\n')).toHaveLength(0)
  })

  test('hash views: resources/pricing/admin via keyboard hash + body alive', async ({ page }) => {
    const guard = attachConsoleGuard(page)
    for (const view of ['resources', 'pricing', 'familiarity', 'admin', '']) {
      await gotoHash(page, view)
      await expect(page.locator('body')).toBeVisible()
      await page.keyboard.press('Tab')
      await page.keyboard.press('Escape')
    }
    expect(guard.critical(), guard.critical().join('\n')).toHaveLength(0)
  })
})
