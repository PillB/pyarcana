import { expect, test } from '@playwright/test'

test.describe('PyArcana public GitHub Pages edition', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/pyarcana/')
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
    await page.getByRole('button', { name: 'Cambiar idioma de la interfaz' }).first().click()
    await page.getByRole('button', { name: /English/ }).click()
    await expect(page.getByText('The art of learning Python')).toBeVisible()
    await expect(page.getByRole('button', { name: /Start now/ })).toBeVisible()
    await expect(
      page.getByText('PyArcana · 52 sections · Lessons in Peruvian Spanish', { exact: true })
    ).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Course curriculum' })).toBeVisible()
  })

  test('opens the first and last curriculum sections with five learning tabs', async ({ page }) => {
    await page.getByText('Entorno reproducible', { exact: true }).first().click()
    await expect(page.getByTestId('section-root')).toHaveAttribute('data-section-id', 'setup')
    for (const tab of ['theory', 'ido', 'wedo', 'youdo', 'quiz']) {
      await expect(page.getByTestId(`tab-${tab}`)).toBeVisible()
    }

    await page.getByText('Capstone FINAL', { exact: true }).click()
    await expect(page.getByTestId('section-root')).toHaveAttribute('data-section-id', 'career-strategy')
    await expect(
      page.getByRole('heading', {
        name: 'Enterprise Relationship & Operations Intelligence Platform: capstone final',
      })
    ).toBeVisible()
  })

  test('serves base-path assets without 404s', async ({ request }) => {
    for (const path of ['/pyarcana/logo.svg', '/pyarcana/demo_clientes.xlsx']) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
      expect((await response.body()).byteLength, path).toBeGreaterThan(10)
    }
  })
})
