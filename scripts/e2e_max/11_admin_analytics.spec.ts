import { test, expect } from '@playwright/test'
import { loginAdmin, loginStudent, E2E_STUDENT } from './helpers/auth'
import { gotoHash } from './helpers/nav'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

test.describe('E2E max — admin analytics dashboard', () => {
  test('overview KPIs, tabs, filters, analytics API, student denied', async ({
    page,
    browser,
  }) => {
    test.setTimeout(180_000)
    await loginAdmin(page)
    await gotoHash(page, 'admin')

    await expect(page.getByTestId('admin-students')).toBeVisible({ timeout: 30_000 })

    // Overview default
    await expect(page.getByTestId('admin-tab-overview')).toBeVisible()
    await page.getByTestId('admin-tab-overview').click()
    await expect(page.getByTestId('admin-overview')).toBeVisible({ timeout: 20_000 })
    await expect(page.getByTestId('admin-kpi-students')).toBeVisible()
    await expect(page.getByTestId('admin-kpi-completion')).toBeVisible()
    await expect(page.getByTestId('admin-chart-timeseries')).toBeVisible()
    await expect(page.getByTestId('admin-chart-scores')).toBeVisible()
    await expect(page.getByTestId('admin-chart-funnel')).toBeVisible()

    // Analytics API
    const analytics = await page.request.get(`${BASE}/api/admin/analytics`)
    expect(analytics.ok(), await analytics.text()).toBeTruthy()
    const body = await analytics.json()
    expect(body.kpis.totalStudents).toBeGreaterThanOrEqual(0)
    expect(body.sections.length).toBe(52)
    expect(body.cohorts.length).toBeGreaterThanOrEqual(5)
    expect(body.timeseries.length).toBe(30)

    // Cohorts tab
    await page.getByTestId('admin-tab-cohorts').click()
    await expect(page.getByTestId('admin-cohorts')).toBeVisible()
    await expect(page.getByTestId('admin-cohort-all')).toBeVisible()

    // Sections health
    await page.getByTestId('admin-tab-sections').click()
    await expect(page.getByTestId('admin-sections')).toBeVisible()
    await expect(page.getByText(/setup|Setup|S1/i).first()).toBeVisible({ timeout: 10_000 })

    // Students + filters + export
    await page.getByTestId('admin-tab-students').click()
    await expect(page.getByTestId('admin-export')).toBeVisible()
    await expect(page.getByTestId('admin-filter-search')).toBeVisible()
    await page.getByTestId('admin-filter-search').fill('demo')
    await page.waitForTimeout(300)

    // Open first student row if any
    const row = page.locator('[data-testid^="admin-student-row-"]').first()
    if (await row.isVisible().catch(() => false)) {
      await row.click()
      await expect(page.getByTestId('admin-student-detail')).toBeVisible({ timeout: 20_000 })
      await page.getByRole('button', { name: /volver/i }).click()
      await expect(page.getByTestId('admin-students')).toBeVisible()
    }

    // Feedback tab still works
    await page.getByTestId('admin-tab-feedback').click()
    await expect(page.getByTestId('admin-feedback')).toBeVisible({ timeout: 15_000 })

    // Student denied analytics
    const studentCtx = await browser.newContext()
    const studentPage = await studentCtx.newPage()
    const csrfRes = await studentPage.request.get(`${BASE}/api/auth/csrf`)
    const { csrfToken } = await csrfRes.json()
    await studentPage.request.post(`${BASE}/api/auth/callback/credentials`, {
      form: {
        csrfToken,
        email: E2E_STUDENT.email,
        password: E2E_STUDENT.password,
        json: 'true',
        redirect: 'false',
        callbackUrl: BASE,
      },
    })
    const denied = await studentPage.request.get(`${BASE}/api/admin/analytics`)
    expect(denied.status()).toBe(403)
    await studentCtx.close()
  })
})
