import { test, expect } from '@playwright/test'
import { loginAdmin, loginStudent } from './helpers/auth'
import { gotoHash } from './helpers/nav'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

test.describe('E2E max — feedback bug/idea + admin triage', () => {
  test('guest can open FAB and submit a recommendation', async ({ page }) => {
    test.setTimeout(60_000)
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
    await page.getByTestId('feedback-open').click()
    await expect(page.getByTestId('feedback-modal')).toBeVisible()

    await page.getByTestId('feedback-type').click()
    await page.getByRole('option', { name: /recomendaci[oó]n|recommendation/i }).click()

    await page.getByTestId('feedback-title').fill('Idea e2e: dark mode default')
    await page
      .getByTestId('feedback-body')
      .fill('Sería útil que el tema siga la preferencia del sistema de forma más clara en la home.')
    await page.getByTestId('feedback-email').fill('e2e-guest@example.com')
    await page.getByTestId('feedback-submit').click()

    // modal closes on success or shows error
    await page.waitForTimeout(1500)
    const err = page.getByTestId('feedback-error')
    if (await err.isVisible().catch(() => false)) {
      const msg = await err.textContent()
      throw new Error(`feedback submit failed: ${msg}`)
    }
    await expect(page.getByTestId('feedback-modal')).toBeHidden({ timeout: 10_000 })
  })

  test('student POST API links user; admin lists and patches', async ({ page }) => {
    test.setTimeout(90_000)
    await loginStudent(page)

    const post = await page.request.post(`${BASE}/api/feedback`, {
      data: {
        type: 'BUG',
        title: 'E2E student bug report',
        body: 'Reproducible: botón de feedback funciona; este es un reporte de prueba automatizado.',
        sectionId: 'setup',
        pagePath: '/#setup',
      },
    })
    expect(post.status(), await post.text()).toBe(201)
    const { id } = await post.json()
    expect(id).toBeTruthy()

    // student cannot list
    const denied = await page.request.get(`${BASE}/api/feedback`)
    expect(denied.status()).toBe(403)

    await loginAdmin(page)
    const list = await page.request.get(`${BASE}/api/feedback?limit=50`)
    expect(list.ok()).toBeTruthy()
    const body = await list.json()
    expect(body.items?.some((x: { id: string }) => x.id === id)).toBeTruthy()

    const patch = await page.request.patch(`${BASE}/api/feedback/${id}`, {
      data: { status: 'REVIEWING', adminNote: 'e2e triage' },
    })
    expect(patch.ok()).toBeTruthy()
    const updated = await patch.json()
    expect(updated.item.status).toBe('REVIEWING')

    // UI: admin feedback tab
    await gotoHash(page, 'admin')
    const tab = page.getByTestId('admin-tab-feedback')
    if (await tab.isVisible().catch(() => false)) {
      await tab.click()
      await expect(page.getByTestId('admin-feedback')).toBeVisible({ timeout: 15_000 })
    }
  })
})
