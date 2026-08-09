import { test, expect } from '@playwright/test'
import { loadCatalog } from './helpers/catalog'
import { attachConsoleGuard } from './helpers/assert'
import { gotoSection, openTab } from './helpers/nav'

const SUB = ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const

test.describe('E2E max — 52 sections × 5 tabs', () => {
  const cat = loadCatalog()

  for (const section of cat.sections) {
    test(`section ${section.index} ${section.id}: all tabs`, async ({ page }) => {
      test.setTimeout(90_000)
      const guard = attachConsoleGuard(page)
      await gotoSection(page, section.id)

      // 5 tabs
      for (const tab of SUB) {
        await expect(page.getByTestId(`tab-${tab}`)).toBeVisible()
      }

      for (const tab of SUB) {
        await openTab(page, tab)
        const panel = page.locator('[data-state="active"][role="tabpanel"]')
        await expect(panel).toBeVisible()
        const text = (await panel.textContent()) || ''
        expect(
          text.trim().length,
          `${section.id}/${tab} empty`
        ).toBeGreaterThan(10)
      }

      // Prefer stable testids; aria labels are i18n ("Sección anterior" / "Previous section")
      await expect(page.getByTestId('section-prev')).toBeVisible()
      await expect(page.getByTestId('section-next')).toBeVisible()

      const crit = guard.critical()
      expect(crit, crit.join('\n')).toHaveLength(0)
    })
  }
})
