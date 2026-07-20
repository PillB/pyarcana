import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { gotoHash } from './nav'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

export const DEMO_STUDENT = {
  email: process.env.E2E_DEMO_EMAIL || 'demo@python-ds.pe',
  password: process.env.E2E_DEMO_PASSWORD || 'demo1234',
}

export const DEMO_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || 'admin@python-ds.pe',
  password: process.env.E2E_ADMIN_PASSWORD || 'admin123',
}

/** NextAuth credentials login via cookie jar (API), faster than UI. */
export async function loginViaApi(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  const csrfRes = await page.request.get(`${BASE}/api/auth/csrf`, {
    timeout: 60_000,
  })
  const { csrfToken } = await csrfRes.json()
  const res = await page.request.post(`${BASE}/api/auth/callback/credentials`, {
    form: {
      csrfToken,
      email,
      password,
      json: 'true',
      redirect: 'false',
      callbackUrl: BASE,
    },
    timeout: 60_000,
  })
  expect(res.ok(), `login failed for ${email}: ${res.status()}`).toBeTruthy()
}

export async function loginStudent(page: Page) {
  await loginViaApi(page, DEMO_STUDENT.email, DEMO_STUDENT.password)
  // Land on home so subsequent gotoSection is not fighting a sticky hash
  await gotoHash(page, '')
}

export async function loginAdmin(page: Page) {
  await loginViaApi(page, DEMO_ADMIN.email, DEMO_ADMIN.password)
  await gotoHash(page, 'admin')
}

export async function openAuthModalViaExam(page: Page) {
  await gotoHash(page, 'setup')
  await page.getByTestId('tab-quiz').click()
  // scroll to exam if present — exam is often after self-check
  const authBtn = page.getByTestId('exam-auth-required')
  if (await authBtn.isVisible().catch(() => false)) {
    await authBtn.click()
  }
}
