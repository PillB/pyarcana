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
  // The first-visit tour is a modal: left open, it takes every click this spec makes.
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('pyarcana:tourCompleted', '1'))
  })

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
    // Scoped to the open panel: unscoped, `button:has-text("A.")` matched a sidebar row whose
    // tagline contains "A." and opened another section.
    const opt = page
      .locator('[data-state="active"][role="tabpanel"]')
      .locator('[data-testid^="quiz-option-"], button:has-text("A."), [role="radio"]')
      .first()
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
    // → walks one step (tab) at a time and names the step it opens (tester feedback, 18 Nov 2026).
    // From Teoría it must stay in S01 and open Yo hago; the old button left the section.
    await openTab(page, 'theory')
    const next = page.getByTestId('section-next')
    const target = await next.getAttribute('data-target-step')
    expect(target).toBe('ido')
    await next.click({ force: true })
    await page.waitForTimeout(400)
    const root = page.getByTestId('section-root')
    await expect(root).toHaveAttribute('data-section-id', s1!.id)
    await expect(page.getByTestId(`tab-${target}`)).toHaveAttribute('data-state', 'active')
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
        // → steps through the remaining tabs, then opens the next section on Teoría.
        for (let i = 0; i < 5; i += 1) {
          const crosses = await page.getByTestId('section-next').getAttribute('data-crosses-section')
          await page.getByTestId('section-next').click({ force: true })
          await page.waitForTimeout(350)
          if (crosses === 'true') break
        }
        await expect(page.getByTestId('tab-theory')).toHaveAttribute('data-state', 'active')
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
