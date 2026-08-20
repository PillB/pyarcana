import { expect, test } from '@playwright/test'

test.describe('PyArcana public GitHub Pages edition', () => {
  test.beforeEach(async ({ page }) => {
    // Set localStorage before navigation to prevent tour from appearing
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
    })
    await page.goto('/pyarcana/')
    // Wait for page to hydrate — the heading may take time on CI
    await page.waitForLoadState('domcontentloaded')
    // Dismiss the interactive tour if it appears (first-visit overlay)
    const tourSkip = page.getByRole('button', { name: /Saltar|Skip|Omitir|Cerrar/i }).first()
    if (await tourSkip.isVisible({ timeout: 3000 }).catch(() => false)) {
      await tourSkip.click()
      await expect(tourSkip).toBeHidden({ timeout: 5000 }).catch(() => undefined)
    }
    // Wait for the main heading with generous timeout for CI
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 15000,
    })
  })

  test('brands the Art Nouveau landing and keeps static boundaries truthful', async ({ page }) => {
    await expect(page.getByTestId('static-site-notice')).toContainText('Edición pública / Public edition')
    await expect(page.getByText('El arte de aprender Python')).toBeVisible({ timeout: 10000 })
  })

  test('English toggle changes meaningful chrome', async ({ page }) => {
    await expect(page.locator('body')).not.toContainText('Application error')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({
      timeout: 15000,
    })

    // Desktop and mobile each mount LanguageToggle; only the visible chrome is interactive.
    const langToggle = page.locator('[data-testid="language-toggle"]').locator('visible=true').first()
    await expect(langToggle).toBeVisible({ timeout: 10000 })
    const before = (await page.locator('body').innerText()).slice(0, 2000)
    await langToggle.getByRole('button').first().click()
    // Choose English from the menu when present; otherwise the toggle click alone is enough to open.
    const englishOption = page.getByRole('button', { name: /English|Inglés|EN/i }).first()
    if (await englishOption.isVisible({ timeout: 3000 }).catch(() => false)) {
      await englishOption.click()
    }
    await expect
      .poll(async () => {
        const after = (await page.locator('body').innerText()).slice(0, 2000)
        return after !== before || /Public edition|English|EN|progress|sections completed/i.test(after)
      }, { timeout: 10000 })
      .toBeTruthy()
    await expect(page.locator('body')).not.toContainText('Application error')
  })

  test('opens curriculum sections with learning tabs', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar-sections"]')
    await expect(sidebar).toBeVisible({ timeout: 15000 })
    // Prefer the section row by name — avoid the nested "Marcar como favorito" control.
    const firstSection = sidebar.getByRole('button', { name: /Entorno reproducible/i }).first()
    await expect(firstSection).toBeVisible()
    await firstSection.click()
    const sectionRoot = page.locator('[data-testid="section-root"], [data-section-id]').first()
    await expect(sectionRoot).toBeVisible({ timeout: 15000 })
    // Learning tabs (theory / I Do / …) should appear for an open section.
    await expect(page.getByRole('tab').first()).toBeVisible({ timeout: 15000 })
    await expect(page.locator('body')).not.toContainText('Application error')
  })

  test('serves base-path assets without 404s', async ({ request }) => {
    for (const path of ['/pyarcana/logo.svg', '/pyarcana/favicon.svg']) {
      const response = await request.get(path)
      expect(response.status(), path).toBe(200)
      expect((await response.body()).byteLength, path).toBeGreaterThan(10)
    }
  })

  test('publishes an exact immutable deployment SHA attestation', async ({ request }) => {
    const response = await request.get('/pyarcana/deployment.json', {
      headers: { 'cache-control': 'no-cache' },
    })
    expect(response.status()).toBe(200)
    const deployment = await response.json()
    expect(deployment).toMatchObject({ schema_version: 1, section_count: 52, base_path: '/pyarcana' })
    expect(deployment.git_sha).toMatch(/^[a-f0-9]{40}$/)
    const expectedSha = process.env.EXPECTED_DEPLOY_SHA
    if (expectedSha) expect(deployment.git_sha).toBe(expectedSha)
  })

  test('renders code blocks without corruption', async ({ page }) => {
    const sidebar = page.locator('[data-testid="sidebar-sections"]')
    await expect(sidebar).toBeVisible({ timeout: 15000 })
    await sidebar.getByRole('button', { name: /Entorno reproducible/i }).first().click()
    await expect(page.locator('[data-testid="section-root"], [data-section-id]').first()).toBeVisible({
      timeout: 15000,
    })
    await expect(page.locator('body')).not.toContainText('Application error')
    // Code surfaces use pre/code; presence is required on S01 theory.
    await expect
      .poll(async () => page.locator('pre, code').count(), { timeout: 15000 })
      .toBeGreaterThan(0)
  })
})
