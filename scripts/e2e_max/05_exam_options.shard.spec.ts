import { test, expect } from '@playwright/test'
import { loadCatalog, shardSections } from './helpers/catalog'
import { loginStudent } from './helpers/auth'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

test.describe('E2E max — exam option paths (sharded)', () => {
  const all = shardSections(loadCatalog().sections)
  // Sample denser: first of shard + every 2nd index + always setup if present
  const sections = all.filter((s, i) => i === 0 || s.id === 'setup' || s.index % 2 === 1)

  for (const section of sections) {
    test(`${section.id}: exam start/submit + option matrix`, async ({ page }) => {
      test.setTimeout(180_000)
      await loginStudent(page)

      // --- API path (authoritative scoring) ---
      const startApi = await page.request.post(`${BASE}/api/exam/start`, {
        data: { sectionId: section.id },
        timeout: 60_000,
      })
      // 200 start; 400 = max attempts / incomplete already open — still a valid product response
      if (!startApi.ok()) {
        expect([400, 403, 429]).toContain(startApi.status())
        test.info().annotations.push({
          type: 'note',
          description: `exam start status=${startApi.status()} body=${(await startApi.text()).slice(0, 180)}`,
        })
        const attempts = await page.request.get(
          `${BASE}/api/exam/attempts?sectionId=${section.id}`,
          { timeout: 30_000 }
        )
        expect([200, 404]).toContain(attempts.status())
      } else {
        const exam = await startApi.json()
        expect(exam.questions?.length).toBeGreaterThan(0)
        for (const q of exam.questions as { id: string; options: string[] }[]) {
          expect(q.options.length).toBeGreaterThanOrEqual(2)
        }

        // Path A: all option 0
        const answersA = exam.questions.map((q: { id: string }) => ({
          questionId: q.id,
          selectedIndex: 0,
        }))
        const subA = await page.request.post(`${BASE}/api/exam/submit`, {
          data: {
            attemptId: exam.attemptId,
            answers: answersA,
            timeSpentSec: 25,
          },
          timeout: 60_000,
        })
        expect([200, 400]).toContain(subA.status())
        if (subA.ok()) {
          const r = await subA.json()
          expect(r).toHaveProperty('score')
          expect(r.totalQuestions).toBe(exam.questions.length)
        }

        // Path B: second attempt all last options (if allowed)
        const startB = await page.request.post(`${BASE}/api/exam/start`, {
          data: { sectionId: section.id },
          timeout: 60_000,
        })
        if (startB.ok()) {
          const examB = await startB.json()
          const answersB = examB.questions.map(
            (q: { id: string; options: string[] }) => ({
              questionId: q.id,
              selectedIndex: Math.max(0, (q.options?.length || 1) - 1),
            })
          )
          const subB = await page.request.post(`${BASE}/api/exam/submit`, {
            data: {
              attemptId: examB.attemptId,
              answers: answersB,
              timeSpentSec: 20,
            },
            timeout: 60_000,
          })
          expect([200, 400]).toContain(subB.status())
        }
      }

      // --- UI path: hard navigation remount ---
      await page.goto(`${BASE}/?e2e=${Date.now()}#${section.id}`, {
        waitUntil: 'domcontentloaded',
      })
      await page.waitForTimeout(800)
      // quiz tab
      const quizTab = page.getByTestId('tab-quiz')
      if (await quizTab.isVisible().catch(() => false)) {
        await quizTab.click()
        await page.waitForTimeout(400)
        const startBtn = page.getByTestId('exam-start')
        if (await startBtn.isVisible().catch(() => false)) {
          await startBtn.click()
          const appeared = await page
            .waitForSelector('[data-testid^="exam-q-"]', { timeout: 12_000 })
            .then(() => true)
            .catch(() => false)
          if (appeared) {
            const qCards = page.locator(
              '[data-testid^="exam-q-"]:not([data-testid*="-opt-"])'
            )
            const nq = await qCards.count()
            expect(nq).toBeGreaterThan(0)
            for (let i = 0; i < nq; i++) {
              const tid = await qCards.nth(i).getAttribute('data-testid')
              if (!tid?.startsWith('exam-q-')) continue
              const qid = tid.slice('exam-q-'.length)
              const opts = page.locator(`[data-testid^="exam-q-${qid}-opt-"]`)
              const n = await opts.count()
              for (let o = 0; o < n; o++) await opts.nth(o).click()
            }
          }
        }
      }
    })
  }
})
