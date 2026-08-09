import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'
import { gotoHash } from './nav'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

export const E2E_STUDENT = {
  email: process.env.E2E_STUDENT_EMAIL || '',
  password: process.env.E2E_STUDENT_PASSWORD || '',
}

export const E2E_ADMIN = {
  email: process.env.E2E_ADMIN_EMAIL || '',
  password: process.env.E2E_ADMIN_PASSWORD || '',
}

/** NextAuth credentials login via cookie jar (API), faster than UI. */
export async function loginViaApi(
  page: Page,
  email: string,
  password: string
): Promise<void> {
  if (!email || !password) {
    throw new Error('E2E credentials are required through environment variables')
  }
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
  await loginViaApi(page, E2E_STUDENT.email, E2E_STUDENT.password)
  // Land on home so subsequent gotoSection is not fighting a sticky hash
  await gotoHash(page, '')
}

export async function loginAdmin(page: Page) {
  await loginViaApi(page, E2E_ADMIN.email, E2E_ADMIN.password)
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
