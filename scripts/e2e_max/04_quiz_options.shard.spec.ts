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
      // The first-visit tour is a real modal; its overlay correctly blocks
      // clicks behind it. Tour behavior has its own tests. This journey begins
      // after onboarding, as the parallel demos/exercises journey already does.
      await page.addInitScript(() => {
        localStorage.setItem('pyarcana:tourCompleted', '1')
      })
      await gotoSection(page, section.id)
      await openTab(page, 'quiz')

      const questions = section.selfCheck
      expect(questions.length, `${section.id} selfCheck empty`).toBeGreaterThan(0)

      await expect(page.getByTestId('sc-submit')).toBeDisabled()
      // Negative control: every deliberately wrong answer must score ZERO,
      // irrespective of the randomized display order. This catches a grader
      // hardcoded to 100% and a UI that ignores option clicks.
      for (const q of questions) {
        const card = page.getByTestId(`sc-q-${q.qIndex}`)
        await expect(card).toBeVisible()
        const opts = page.locator(`[data-testid^="sc-q-${q.qIndex}-opt-"]`)
        const n = await opts.count()
        expect(n, `${section.id} q${q.qIndex} options`).toBeGreaterThanOrEqual(2)
        expect(q.correctIndex, `${section.id} q${q.qIndex} author key bounds`).toBeLessThan(n)
        for (let o = 0; o < n; o++) {
          await opts.nth(o).click()
          await expect(opts.nth(o)).toHaveAttribute('aria-pressed', 'true')
        }
        const wrongIndex = (q.correctIndex + 1) % n
        await page.getByTestId(`sc-q-${q.qIndex}-opt-${wrongIndex}`).click()
        await expect(page.getByTestId(`sc-q-${q.qIndex}-opt-${wrongIndex}`))
          .toHaveAttribute('aria-pressed', 'true')
      }
      await expect(page.getByTestId('sc-submit')).toBeEnabled()
      await page.getByTestId('sc-submit').click()
      await expect(page.getByTestId('sc-result')).toContainText(`0 de ${questions.length} correctas (0%)`)
      await expect(page.getByTestId('sc-below-pass')).toBeVisible()
      await page.getByRole('button', { name: 'Reintentar' }).click()
      await expect(page.getByTestId('sc-result')).toHaveCount(0)
      await expect(page.getByTestId('sc-submit')).toBeDisabled()

      // Positive control: correct authored answers must produce 100% even when
      // the UI shuffles their displayed positions after retry.
      for (const q of questions) {
        const correct = page.getByTestId(`sc-q-${q.qIndex}-opt-${q.correctIndex}`)
        await correct.click()
        await expect(correct).toHaveAttribute('aria-pressed', 'true')
      }
      await page.getByTestId('sc-submit').click()
      await expect(page.getByTestId('sc-result'))
        .toContainText(`${questions.length} de ${questions.length} correctas (100%)`)
      await expect(page.getByTestId('sc-below-pass')).toHaveCount(0)

      const savedQuiz = () => page.evaluate((sectionId: string) => {
        const raw = localStorage.getItem('python-ds-progress')
        const state = raw ? JSON.parse(raw).state : null
        return {
          done: state?.completedSubSteps?.[sectionId]?.includes('quiz') === true,
          score: state?.quizScores?.[sectionId] ?? 0,
        }
      }, section.id)
      await expect.poll(savedQuiz).toEqual({ done: true, score: 100 })

      // The learner may click "Marcar como completada" or retry a perfect
      // quiz. These are completion EVENTS, not toggles: neither may undo it.
      await page.getByRole('button', { name: 'Marcar como completada' }).click()
      await expect.poll(savedQuiz).toEqual({ done: true, score: 100 })
      await page.getByRole('button', { name: 'Reintentar' }).click()
      for (const q of questions) {
        await page.getByTestId(`sc-q-${q.qIndex}-opt-${q.correctIndex}`).click()
      }
      await page.getByTestId('sc-submit').click()
      await expect.poll(savedQuiz).toEqual({ done: true, score: 100 })
      await page.reload()
      await expect.poll(savedQuiz).toEqual({ done: true, score: 100 })
    })
  }
})
