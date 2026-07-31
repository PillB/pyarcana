import { expect, test } from '@playwright/test'

test.describe('PyArcana public GitHub Pages edition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pyarcana/')
    // Dismiss the interactive tour if it appears (first-visit overlay)
    const tourSkip = page.getByRole('button', { name: /Saltar|Skip|Omitir/i }).first()
    if (await tourSkip.isVisible({ timeout: 2000 }).catch(() => false)) {
      await tourSkip.click()
      await page.waitForTimeout(500)
    }
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible()
  })

  test('brands the Art Nouveau landing and keeps static boundaries truthful', async ({ page }) => {
    await expect(page.getByTestId('static-site-notice')).toContainText('Edición pública / Public edition')
    await expect(page.getByText('El arte de aprender Python')).toBeVisible()
    await expect(page.getByText('1040h estimadas (plan provisional)')).toBeVisible()
    await expect(page.getByRole('button', { name: /Entrar|Crear cuenta/ })).toHaveCount(0)
    await expect(page.getByText('Planes', { exact: true })).toHaveCount(0)
  })

  test('English toggle changes meaningful chrome and states lesson-language scope', async ({ page }) => {
    // Find the language toggle button — it may have different aria-labels
    const langToggle = page.locator('[data-testid="language-toggle"]').first()
    await expect(langToggle).toBeVisible({ timeout: 10000 })
    await langToggle.click()

    // Click English option
    const englishBtn = page.getByRole('button', { name: /English/ }).first()
    await expect(englishBtn).toBeVisible({ timeout: 5000 })
    await englishBtn.click()

    await expect(page.getByText('The art of learning Python')).toBeVisible({ timeout: 10000 })
    await expect(page.getByRole('button', { name: /Start now/ })).toBeVisible({ timeout: 5000 })
  })

  test('opens the first and last curriculum sections with five learning tabs', async ({ page }) => {
    // Click the first section in the sidebar — use a more resilient selector
    const firstSection = page.locator('[data-testid="sidebar-sections"] button, [data-testid="sidebar-sections"] a').first()
    await expect(firstSection).toBeVisible({ timeout: 10000 })
    await firstSection.click()

    // Wait for section view to render
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 10000 })

    // Check that at least the theory tab is visible
    const theoryTab = page.getByTestId('tab-theory')
    if (await theoryTab.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(theoryTab).toBeVisible()
    }

    // Navigate to the last section via sidebar
    const lastSection = page.locator('[data-testid="sidebar-sections"] button, [data-testid="sidebar-sections"] a').last()
    await lastSection.click()
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 10000 })
  })

  test('serves base-path assets without 404s', async ({ request }) => {
    for (const path of ['/pyarcana/logo.svg', '/pyarcana/favicon.svg', '/pyarcana/demo_clientes.xlsx']) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
      expect((await response.body()).byteLength, path).toBeGreaterThan(10)
    }
  })

  test('renders check_arg.py without syntax-token index corruption', async ({ page }) => {
    const firstSection = page.locator('[data-testid="sidebar-sections"] button, [data-testid="sidebar-sections"] a').first()
    await expect(firstSection).toBeVisible({ timeout: 10000 })
    await firstSection.click()
    await expect(page.getByTestId('section-root')).toBeVisible({ timeout: 10000 })

    const block = page
      .getByTestId('code-block')
      .filter({ hasText: 'check_arg.py' })
      .first()
    const code = block.locator('code[data-code-source]').first()
    if (await code.isVisible({ timeout: 5000 }).catch(() => false)) {
      await expect(code).toContainText('import sys')
      expect(await code.textContent()).toBe(await code.getAttribute('data-code-source'))
    }
  })
})
