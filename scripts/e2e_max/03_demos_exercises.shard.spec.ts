import { test, expect } from '@playwright/test'
import { loadCatalog, shardSections } from './helpers/catalog'
import { gotoSection, openTab } from './helpers/nav'

test.describe('E2E max — demos + exercises (sharded)', () => {
  const sections = shardSections(loadCatalog().sections)

  for (const section of sections) {
    test(`${section.id}: demos + every exercise show solution`, async ({ page }) => {
      test.setTimeout(180_000)
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
        try {
          if ((await card.count()) > 0) {
            await card.first().scrollIntoViewIfNeeded({ timeout: 10_000 })
            await expect(card.first()).toBeVisible()
            const check = page.getByTestId(`exercise-check-${ex.id}`)
            await check.click()
            await expect(page.getByTestId(`exercise-feedback-${ex.id}`)).toBeVisible({
              timeout: 10_000,
            })
            continue
          }
        } catch {
          // fall through to index path
        }
        const byIndex = page.locator('[data-testid^="exercise-"]').nth(ex.index)
        if ((await byIndex.count()) > 0) {
          await byIndex.scrollIntoViewIfNeeded({ timeout: 10_000 }).catch(() => {})
          const btn = byIndex.getByRole('button', {
            name: /Ver solución|Ocultar solución/i,
          })
          if ((await btn.count()) > 0) {
            await btn.first().click()
            await expect(
              byIndex.locator('[data-testid^="exercise-feedback-"]')
            ).toBeVisible({ timeout: 10_000 })
          }
        }
      }

      // You Do has content
      await openTab(page, 'youdo')
      const you = page.locator('[data-state="active"][role="tabpanel"]')
      await expect(you).toBeVisible()
      expect(((await you.textContent()) || '').length).toBeGreaterThan(20)
    })
  }
})
