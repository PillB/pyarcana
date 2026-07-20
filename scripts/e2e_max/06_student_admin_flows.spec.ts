import { test, expect } from '@playwright/test'
import { loginAdmin, loginStudent, DEMO_STUDENT } from './helpers/auth'
import { gotoHash, gotoSection, openTab } from './helpers/nav'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

test.describe('E2E max — student + admin flows', () => {
  test('student login + progress + exam start/submit on setup', async ({ page }) => {
    test.setTimeout(180_000)
    await loginStudent(page)

    const sess = await page.request.get(`${BASE}/api/auth/session`)
    const session = await sess.json()
    expect(session?.user?.email).toBe(DEMO_STUDENT.email)

    const prog = await page.request.get(`${BASE}/api/progress`)
    expect(prog.ok()).toBeTruthy()
    const progBody = await prog.json()
    expect(progBody).toHaveProperty('progress')

    await gotoSection(page, 'setup')
    await openTab(page, 'quiz')

    // Authenticated users see ExamView (not self-check QuizTab)
    const examStart = page.getByTestId('exam-start')
    const examAuth = page.getByTestId('exam-auth-required')
    const hasExamUi =
      (await examStart.isVisible().catch(() => false)) ||
      (await examAuth.isVisible().catch(() => false)) ||
      (await page.getByText(/examen|intentos|agotado/i).first().isVisible().catch(() => false))
    expect(hasExamUi, 'expected ExamView UI when logged in').toBeTruthy()

    // exam path via API (reliable)
    const start = await page.request.post(`${BASE}/api/exam/start`, {
      data: { sectionId: 'setup' },
    })
    if (start.ok()) {
      const exam = await start.json()
      expect(exam.questions.length).toBe(8)
      const answers = exam.questions.map((q: { id: string }) => ({
        questionId: q.id,
        selectedIndex: 0,
      }))
      const sub = await page.request.post(`${BASE}/api/exam/submit`, {
        data: { attemptId: exam.attemptId, answers, timeSpentSec: 40 },
      })
      expect([200, 400]).toContain(sub.status())
      if (sub.ok()) {
        const result = await sub.json()
        expect(result).toHaveProperty('score')
        expect(result).toHaveProperty('totalQuestions')
      }
    }

    if (await examStart.isVisible().catch(() => false)) {
      await examStart.click()
      await page.waitForSelector('[data-testid^="exam-q-"]', { timeout: 20_000 }).catch(() => {})
    }
  })

  test('admin students list + export + student denied', async ({ page, browser }) => {
    test.setTimeout(120_000)
    await loginAdmin(page)
    await gotoHash(page, 'admin')
    await expect(page.getByTestId('admin-students')).toBeVisible({ timeout: 30_000 })
    await expect(page.getByTestId('admin-export')).toBeVisible()

    // API export
    const exp = await page.request.get(`${BASE}/api/admin/export?type=students`)
    expect(exp.ok()).toBeTruthy()
    const csv = await exp.text()
    expect(csv).toContain('Email')
    expect(csv.split('\n').length).toBeGreaterThan(1)

    // Click export button (opens new tab — just ensure click does not crash)
    await page.getByTestId('admin-export').click()
    await page.waitForTimeout(500)

    // student cannot list admin
    const studentCtx = await browser.newContext()
    const studentPage = await studentCtx.newPage()
    // login student via API on this context
    const csrfRes = await studentPage.request.get(`${BASE}/api/auth/csrf`)
    const { csrfToken } = await csrfRes.json()
    await studentPage.request.post(`${BASE}/api/auth/callback/credentials`, {
      form: {
        csrfToken,
        email: DEMO_STUDENT.email,
        password: process.env.E2E_DEMO_PASSWORD || 'demo1234',
        json: 'true',
        redirect: 'false',
        callbackUrl: BASE,
      },
    })
    const denied = await studentPage.request.get(`${BASE}/api/admin/students`)
    expect(denied.status()).toBe(403)
    await studentCtx.close()
  })
})
