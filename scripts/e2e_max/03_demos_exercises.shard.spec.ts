import { test, expect } from '@playwright/test'
import { loadCatalog, shardSections } from './helpers/catalog'
import { gotoSection, openTab } from './helpers/nav'

test.describe('E2E max — demos + exercises (sharded)', () => {
  const sections = shardSections(loadCatalog().sections)

  for (const section of sections) {
    test(`${section.id}: demos + every exercise show solution`, async ({ page }) => {
      test.setTimeout(180_000)
      await page.addInitScript(() => {
        localStorage.setItem('pyarcana:tourCompleted', '1')
      })
      await gotoSection(page, section.id)

      // Theory playground if present
      await openTab(page, 'theory')
      const playground = page.getByTestId(`demo-playground-${section.id}`)
      if (await playground.isVisible().catch(() => false)) {
        await expect(playground).toBeVisible()
        // Do not require Pyodide run success (CDN flake) — surface is enough for max map
      }

      // I Do demos
      await openTab(page, 'ido')
      for (const d of section.demos) {
        const card = page.getByTestId(`demo-${d.demoId}`)
        await expect(card, `missing demo ${d.demoId}`).toBeVisible()
      }
      // fallback: at least one demo-step if ids missing
      if (section.demos.length === 0) {
        const steps = page.locator('[data-testid^="demo-step-"]')
        await expect(steps.first()).toBeVisible()
      }

      // We Do exercises
      await openTab(page, 'wedo')
      for (const ex of section.exercises) {
        const card = page.getByTestId(`exercise-${ex.id}`)
        await expect(card, `missing or duplicate exercise ${ex.id}`).toHaveCount(1)
        await card.scrollIntoViewIfNeeded({ timeout: 10_000 })
        await expect(card).toBeVisible()
        const check = page.getByTestId(`exercise-check-${ex.id}`)
        const feedback = page.getByTestId(`exercise-feedback-${ex.id}`)
        // A solution is genuinely hidden until the learner asks for it.
        await expect(check).toHaveCount(1)
        await expect(check).toHaveAccessibleName(/Ver solución/i)
        await expect(feedback).toHaveCount(0)
        await check.click()
        await expect(feedback).toBeVisible({ timeout: 10_000 })
        // The Framer Motion panel expands from opacity/height 0. The button
        // can move while expansion is under way, so wait for its final visual
        // tick before the second (close) click. This also checks the animation.
        await expect(feedback).toHaveCSS('opacity', '1')
        await expect(check).toHaveAccessibleName(/Ocultar solución/i)
        await check.click()
        await expect(feedback).toHaveCount(0)
        await expect(check).toHaveAccessibleName(/Ver solución/i)
      }

      // You Do has content
      await openTab(page, 'youdo')
      const you = page.locator('[data-state="active"][role="tabpanel"]')
      await expect(you).toBeVisible()
      expect(((await you.textContent()) || '').length).toBeGreaterThan(20)
    })
  }
})
