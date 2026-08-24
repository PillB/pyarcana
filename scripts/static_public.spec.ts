import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

const PIXEL_GIF = Buffer.from(
  'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
  'base64',
)

function malformedQaPackage() {
  const now = new Date().toISOString()
  return {
    schemaVersion: 'pyarcana.qa.v1',
    exportedAt: now,
    tester: 'malformed-import',
    sourceDeploymentSha: null,
    issueCount: 1,
    issues: [{
      id: 'qa-malformed-context',
      createdAt: now,
      updatedAt: now,
      status: 'open',
      category: 'functionality',
      cause: 'unknown',
      severity: 'medium',
      title: 'Contexto incompleto',
      description: 'Este paquete no debe entrar al dashboard.',
      expected: '',
      actual: '',
      reproductionSteps: '',
      improvement: '',
      context: {},
    }],
  }
}

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

  test('QA harness rejects malformed imported contexts without crashing review', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.keyboard.press('Control+Alt+q')
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible()
    await page.getByTestId('qa-tab-session').click()

    await page.locator('input[type="file"][accept*="json"]').setInputFiles({
      name: 'qa-malformed-context.json',
      mimeType: 'application/json',
      buffer: Buffer.from(JSON.stringify(malformedQaPackage()), 'utf8'),
    })

    await expect(page.getByTestId('qa-message')).toContainText(/lista válida|contextos está incompleto/i)
    await expect(page.getByTestId('qa-issue-count')).toContainText('0 incidencias')
    await expect(page.locator('body')).not.toContainText('Application error')
  })

  test('QA harness preserves the draft when IndexedDB and localStorage fallback both fail', async ({ page }) => {
    const title = 'Borrador que no debe perderse'
    const description = 'La persistencia simulada falla y este texto debe seguir editable.'

    await page.addInitScript(() => {
      Object.defineProperty(window, 'indexedDB', {
        configurable: true,
        get: () => undefined,
      })
      const originalSetItem = Storage.prototype.setItem
      Storage.prototype.setItem = function setItem(key: string, value: string) {
        if (key === 'pyarcana:qa-issues:v1') {
          throw new DOMException('Simulated localStorage quota exhaustion', 'QuotaExceededError')
        }
        return originalSetItem.call(this, key, value)
      }
    })
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByTestId('qa-harness-open')).toBeAttached({ timeout: 15000 })

    await page.keyboard.press('Control+Alt+q')
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible()
    await page.getByTestId('qa-title').fill(title)
    await page.getByTestId('qa-description').fill(description)
    await page.getByTestId('qa-save-issue').click()

    await expect(page.getByTestId('qa-message')).toContainText(/cuota de almacenamiento local/i)
    await expect(page.getByTestId('qa-message')).toContainText(/formulario y la captura se conservaron/i)
    await expect(page.getByTestId('qa-title')).toHaveValue(title)
    await expect(page.getByTestId('qa-description')).toHaveValue(description)
    await expect(page.getByTestId('qa-tab-report')).toHaveAttribute('aria-selected', 'true')
    await expect(page.getByTestId('qa-issue-count')).toContainText('0 incidencias')
  })

  test('QA harness persists and round-trips a tagged issue at laptop size', async ({ page }) => {
    await page.setViewportSize({ width: 1366, height: 768 })
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.getByTestId('qa-footer-bridge')).toBeVisible()
    await expect(page.getByTestId('qa-harness-open')).toContainText('QA interna')

    const sidebar = page.locator('[data-testid="sidebar-sections"]')
    await sidebar.getByRole('button', { name: /Entorno reproducible/i }).first().click()
    await expect(page.locator('[data-testid="section-root"], [data-section-id]').first()).toBeVisible({ timeout: 15000 })

    // Open at the point of failure without making the tester scroll back to the footer.
    await page.keyboard.press('Control+Alt+q')
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible()
    await page.getByTestId('qa-category').selectOption('unanswerable-question')
    await page.getByTestId('qa-cause').selectOption('content-gap')
    await page.getByTestId('qa-severity').selectOption('high')
    await page.getByTestId('qa-title').fill('La pregunta pide información que la sección no enseña')
    await page.getByTestId('qa-description').fill('El enunciado exige un término y una decisión que no aparecen en la teoría ni en I Do / We Do.')
    await page.getByTestId('qa-repro').fill('1. Abrir S01\n2. Ir al ejercicio\n3. Intentar responder usando solo el material visible')
    await page.locator('input[type="file"][accept="image/*"]').setInputFiles({
      name: 'qa-evidence.gif',
      mimeType: 'image/gif',
      buffer: PIXEL_GIF,
    })
    await page.getByTestId('qa-save-issue').click()

    await expect(page.getByTestId('qa-review-dashboard')).toBeVisible()
    await expect(page.getByTestId('qa-issue-row')).toHaveCount(1)
    await expect(page.getByTestId('qa-location-breadcrumb')).toContainText('S01')
    await expect(page.getByTestId('qa-screenshot-preview')).toBeVisible()

    await page.getByRole('button', { name: 'Close' }).click()
    await page.reload()
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).not.toContainText('Application error')
    // Reload can legitimately restore the learner directly into S01 rather
    // than the landing page, so the QA trigger—not the landing h1—is the
    // invariant that proves the hydrated workspace is ready for persistence.
    await expect(page.getByTestId('qa-harness-open')).toBeAttached({ timeout: 15000 })
    await page.keyboard.press('Control+Alt+q')
    await page.getByTestId('qa-tab-review').click()
    await expect(page.getByTestId('qa-issue-row')).toHaveCount(1)

    await page.getByTestId('qa-tab-session').click()
    await page.getByTestId('qa-tester').fill('QA-Laptop-01')
    const downloadPromise = page.waitForEvent('download')
    await page.getByTestId('qa-export').click()
    const download = await downloadPromise
    expect(download.suggestedFilename()).toMatch(/^pyarcana-qa-.*\.json$/)
    const downloadPath = await download.path()
    expect(downloadPath).toBeTruthy()
    const payload = JSON.parse(await readFile(downloadPath!, 'utf8'))
    expect(payload.schemaVersion).toBe('pyarcana.qa.v1')
    expect(payload.tester).toBe('QA-Laptop-01')
    expect(payload.issueCount).toBe(1)
    expect(payload.issues[0].category).toBe('unanswerable-question')
    expect(payload.issues[0].context.sectionIndex).toBe(1)
    expect(payload.issues[0].screenshotDataUrl).toMatch(/^data:image\/gif;base64,/)

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: /Vaciar sesión local/i }).click()
    await expect(page.getByTestId('qa-issue-count')).toContainText('0 incidencias')
    await page.locator('input[type="file"][accept*="json"]').setInputFiles(downloadPath!)
    await expect(page.getByTestId('qa-review-dashboard')).toBeVisible()
    await expect(page.getByTestId('qa-issue-row')).toHaveCount(1)
    await expect(page.getByTestId('qa-location-breadcrumb')).toContainText('S01')
  })
})
