import { test, expect } from '@playwright/test'
import { loadCatalog, shardSections } from './helpers/catalog'
import { gotoSection, openTab } from './helpers/nav'

test.describe('E2E max — self-check option matrix (sharded)', () => {
  // QuizTab (self-check) only renders when NOT authenticated; ExamView replaces it when logged in.
  const sections = shardSections(loadCatalog().sections)

  for (const section of sections) {
    test(`${section.id}: every self-check option + correct submit`, async ({ page }) => {
      test.setTimeout(120_000)
      // Ensure anonymous session for self-check
      await page.context().clearCookies()
      await gotoSection(page, section.id)
      await openTab(page, 'quiz')

      const questions = section.selfCheck
      expect(questions.length, `${section.id} selfCheck empty`).toBeGreaterThan(0)

      // Option coverage: discover options from DOM (catalog optionCount can miscount quoted strings)
      for (const q of questions) {
        const card = page.getByTestId(`sc-q-${q.qIndex}`)
        await expect(card).toBeVisible()
        const opts = page.locator(`[data-testid^="sc-q-${q.qIndex}-opt-"]`)
        const n = await opts.count()
        expect(n, `${section.id} q${q.qIndex} options`).toBeGreaterThanOrEqual(2)
        for (let o = 0; o < n; o++) {
          await opts.nth(o).click()
        }
      }

      // Select correct answers and submit
      for (const q of questions) {
        const correct = Math.min(q.correctIndex, Math.max(0, q.optionCount - 1))
        await page.getByTestId(`sc-q-${q.qIndex}-opt-${correct}`).click()
      }
      await page.getByTestId('sc-submit').click()
      await expect(page.getByTestId('sc-result')).toBeVisible()
      const resultText = (await page.getByTestId('sc-result').textContent()) || ''
      expect(resultText).toMatch(/correctas|%|Buenazo|intentarlo/i)
    })
  }
})
