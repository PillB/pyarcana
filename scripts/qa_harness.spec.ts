import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test.use({ viewport: { width: 1366, height: 768 } })

const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQMcAAAAASUVORK5CYII=',
  'base64',
)

test.describe('Internal QA testing harness', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem('pyarcana:tourCompleted', '1'))
    await page.goto('/pyarcana/')
    await page.waitForLoadState('domcontentloaded')
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({ timeout: 15000 })
  })

  test('captures, persists, exports, clears and re-imports a reproducible issue', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await expect(page.getByTestId('qa-footer-bridge')).toBeVisible()
    await expect(page.getByTestId('qa-harness-open')).toContainText('QA interna')

    const sidebar = page.locator('[data-testid="sidebar-sections"]')
    await sidebar.getByRole('button', { name: /Entorno reproducible/i }).first().click()
    await expect(page.locator('[data-testid="section-root"], [data-section-id]').first()).toBeVisible({ timeout: 15000 })

    await page.keyboard.press('Control+Alt+q')
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible()
    await page.getByTestId('qa-category').selectOption('unanswerable-question')
    await page.getByTestId('qa-cause').selectOption('content-gap')
    await page.getByTestId('qa-severity').selectOption('high')
    await page.getByTestId('qa-title').fill('La pregunta pide información que la sección no enseña')
    await page.getByTestId('qa-description').fill('El enunciado exige un término y una decisión que no aparecen en la teoría ni en I Do / We Do.')
    await page.getByTestId('qa-repro').fill('1. Abrir S01\n2. Ir al ejercicio\n3. Intentar responder usando solo el material visible')

    const screenshotInput = page.locator('input[type="file"][accept="image/*"]')
    await screenshotInput.setInputFiles({ name: 'qa-evidence.png', mimeType: 'image/png', buffer: PIXEL_PNG })
    await page.getByTestId('qa-save-issue').click()

    await expect(page.getByTestId('qa-review-dashboard')).toBeVisible()
    await expect(page.getByTestId('qa-issue-row')).toHaveCount(1)
    await expect(page.getByTestId('qa-location-breadcrumb')).toContainText('S01')
    await expect(page.getByTestId('qa-screenshot-preview')).toBeVisible()

    await page.getByRole('button', { name: 'Close' }).click()
    await page.reload()
    await expect(page.getByRole('heading', { name: 'PyArcana', level: 1 })).toBeVisible({ timeout: 15000 })
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
    expect(payload.issues[0].screenshotDataUrl).toMatch(/^data:image\/png;base64,/)

    page.once('dialog', (dialog) => dialog.accept())
    await page.getByRole('button', { name: /Vaciar sesión local/i }).click()
    await expect(page.getByTestId('qa-issue-count')).toContainText('0 incidencias')

    const importInput = page.locator('input[type="file"][accept*="json"]')
    await importInput.setInputFiles(downloadPath!)
    await expect(page.getByTestId('qa-review-dashboard')).toBeVisible()
    await expect(page.getByTestId('qa-issue-row')).toHaveCount(1)
    await expect(page.getByTestId('qa-location-breadcrumb')).toContainText('S01')
  })
})
