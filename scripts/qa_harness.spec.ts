import { expect, test } from '@playwright/test'
import { readFile } from 'node:fs/promises'

test.use({ viewport: { width: 1366, height: 768 } })

const PIXEL_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Y9ZQMcAAAAASUVORK5CYII=',
  'base64',
)

test.describe('Internal QA testing harness', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem('pyarcana:tourCompleted', '1')
      // The QA tutorial has its own key by design; without it the tutorial
      // auto-opens over the workspace these tests are exercising.
      localStorage.setItem('pyarcana:qaTourCompleted', '1')
    })
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
    await page.waitForLoadState('domcontentloaded')
    await expect(page.locator('body')).not.toContainText('Application error')
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

  test('the QA tutorial opens once, teaches by asking, and leaves the workspace open', async ({ page }) => {
    // Opt back in: the suite seeds qaTourCompleted so the tutorial does not
    // cover the form, which means this is the only test that sees it. Cleared
    // after load and then reloaded, because an addInitScript registered here
    // would not re-run for a hash-only navigation.
    // No reload: beforeEach's addInitScript re-runs on every navigation and
    // would put the key straight back. The harness reads it when the dialog
    // opens, so clearing it in the live page is enough.
    await page.evaluate(() => localStorage.removeItem('pyarcana:qaTourCompleted'))
    await page.getByTestId('qa-harness-open').click()

    // First run: it introduces itself without being asked.
    await expect(page.getByTestId('qa-tour')).toBeVisible({ timeout: 20000 })

    // The workspace is taught before the taxonomy: which tab is for what, how
    // the context gets captured, how to get in and out without losing a draft.
    // The tour used to open straight onto the category dropdown, which explains
    // the fields to someone who does not yet know where they are.
    await page.getByTestId('qa-tour-next').click()
    await expect(page.getByTestId('qa-tour')).toContainText(/pesta/i)
    await page.getByTestId('qa-tour-next').click()
    await expect(page.getByTestId('qa-tour')).toContainText(/Señalar elemento/i)
    await page.getByTestId('qa-tour-next').click()
    await expect(page.getByTestId('qa-tour')).toContainText(/Alt \+ Q/i)

    // Every option the form offers is defined before the tester is asked to
    // choose one. Nine of the twenty-one used to appear for the first time in
    // the dropdown itself, with no definition anywhere.
    await page.getByTestId('qa-tour-next').click()
    await expect(page.getByTestId('qa-tour-definitions')).toBeVisible()
    for (const value of [
      'functionality', 'content', 'unexplained-term', 'unanswerable-question',
      'assessment-design', 'ui-ux', 'accessibility', 'compatibility', 'other',
    ]) {
      await expect(page.getByTestId(`qa-tour-def-${value}`)).toContainText(/significa .+Por ejemplo:/s)
    }

    // It teaches by asking. A wrong answer has to explain itself, not just
    // refuse -- the useful thing is why Contenido is the wrong axis here.
    await page.getByTestId('qa-tour-option-content').click()
    await expect(page.getByTestId('qa-tour-feedback')).toContainText(/afirmación equivocada/i)
    await page.getByTestId('qa-tour-option-unanswerable-question').click()
    await expect(page.getByTestId('qa-tour-feedback')).toContainText(/Correcto/i)
    await expect(page.getByText(/Regla:/)).toBeVisible()

    // Usable without a mouse. The tutorial used to be portalled to <body> as a
    // sibling of the Radix dialog, which keeps focus inside its own content: a
    // keyboard-only tester could see the options and never reach them. Tab from
    // the panel has to land inside the tour, not behind it.
    await page.keyboard.press('Tab')
    const reached = await page.evaluate(() => {
      const tour = document.querySelector('[data-testid="qa-tour"]')
      return !!tour && !!document.activeElement && tour.contains(document.activeElement)
    })
    expect(reached, 'Tab from the tour panel escaped into the workspace behind it').toBe(true)

    // Dismissing the tutorial must not throw the tester out of the form they
    // were about to fill: Radix reads a click on the overlay as an interaction
    // outside the dialog and closed the whole workspace.
    await page.getByTestId('qa-tour-skip').click()
    await expect(page.getByTestId('qa-tour')).toHaveCount(0)
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible()

    // Reopenable on demand, and silent on the next visit.
    await page.getByTestId('qa-tour-open').click()
    await expect(page.getByTestId('qa-tour')).toBeVisible()
    // Restarts at step 1. It used to reopen wherever it was left, which for a
    // finished tour is the one screen with nothing left to teach.
    await expect(page.getByTestId('qa-tour')).toContainText('paso 1 de')
    await page.getByTestId('qa-tour-skip').click()
    await expect(page.getByTestId('qa-tour')).toHaveCount(0)

    // Skipping wrote the key, so a returning tester is not interrupted again.
    expect(await page.evaluate(() => localStorage.getItem('pyarcana:qaTourCompleted'))).toBe('1')
  })

  test('the element picker names the thing you point at, not the body', async ({ page }) => {
    await page.getByTestId('qa-harness-open').click()
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible({ timeout: 20000 })

    // Nothing is claimed until the tester points at something. The field used
    // to capture document.activeElement, which is <body> unless focus happened
    // to be somewhere -- true of every report, and useless in all of them.
    await expect(page.getByTestId('qa-harness-dialog')).not.toContainText('Elemento')

    await page.getByTestId('qa-pick-element').click()
    await expect(page.getByTestId('qa-element-picker')).toBeVisible()

    // The workspace steps aside rather than closing: the page underneath has to
    // be clickable, and the draft has to survive the detour.
    await expect(page.getByTestId('qa-harness-dialog')).toHaveCSS('opacity', '0')

    // Point at a control that carries a test id and click it. The click must be
    // swallowed: picking the QA button must not re-open anything.
    const target = page.getByTestId('qa-harness-open')
    await target.click({ force: true })

    await expect(page.getByTestId('qa-element-picker')).toHaveCount(0)
    await expect(page.getByTestId('qa-harness-dialog')).toHaveCSS('opacity', '1')
    // A selector a reviewer can paste, plus the text that was on screen.
    await expect(page.getByTestId('qa-harness-dialog')).toContainText('[data-testid="qa-harness-open"]')
    await expect(page.getByTestId('qa-harness-dialog')).toContainText('QA interna')

    // And it can be taken back off.
    await page.getByTestId('qa-clear-element').click()
    await expect(page.getByTestId('qa-clear-element')).toHaveCount(0)
  })

  test('the element picker resolves a click on an icon to the control around it', async ({ page }) => {
    await page.getByTestId('qa-harness-open').click()
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible({ timeout: 20000 })
    await page.getByTestId('qa-pick-element').click()
    await expect(page.getByTestId('qa-element-picker')).toBeVisible()

    // People click the painted pixel. The svg inside the QA button is not the
    // subject of anyone's bug report; the button is.
    const icon = page.locator('[data-testid="qa-harness-open"] svg').first()
    await icon.click({ force: true })

    await expect(page.getByTestId('qa-harness-dialog')).toContainText('[data-testid="qa-harness-open"]')
    await expect(page.getByTestId('qa-harness-dialog')).not.toContainText('svg —')
  })

  test('Escape leaves the picker without changing the report', async ({ page }) => {
    await page.getByTestId('qa-harness-open').click()
    await page.getByTestId('qa-title').fill('Un borrador a medio escribir')
    await page.getByTestId('qa-pick-element').click()
    await expect(page.getByTestId('qa-element-picker')).toBeVisible()
    await page.keyboard.press('Escape')

    await expect(page.getByTestId('qa-element-picker')).toHaveCount(0)
    // Escape cancels the aim; it must not close the workspace or lose the draft.
    await expect(page.getByTestId('qa-harness-dialog')).toBeVisible()
    await expect(page.getByTestId('qa-title')).toHaveValue('Un borrador a medio escribir')
  })

  test('the picker disambiguates: unique over short, stable over generated', async ({ page }) => {
    // A fixture with the three things that make a naive selector useless: many
    // identical tags, a framework-generated id that differs next render, and a
    // duplicated aria-label. Injected into the real page so the selector is
    // resolved against a real document with everything else in it.
    await page.evaluate(() => {
      const host = document.createElement('div')
      host.id = 'picker-fixture'
      // Into the section content, not the end of <body>. Appended after the
      // footer it left the page in a state where the QA launcher never
      // settled for Playwright, which is a property of where the fixture was
      // put and not of anything the picker does.
      host.innerHTML = `
        <div><span>uno</span></div>
        <div><span>dos</span></div>
        <div id="radix-:r99:"><button aria-label="Duplicado">generado</button></div>
        <div><button aria-label="Duplicado">tambien duplicado</button></div>
        <div><button data-testid="fixture-unico" aria-label="Duplicado">el bueno</button></div>
      `
      const root = document.querySelector('[data-testid="section-root"]') ?? document.body
      root.appendChild(host)
    })

    const pickAndRead = async (selector: string) => {
      await page.getByTestId('qa-harness-open').click()
      await page.getByTestId('qa-pick-element').click()
      await page.locator(selector).first().click({ force: true })
      const text = await page.getByTestId('qa-harness-dialog').innerText()
      // Escape may land on an open hint before the dialog. That is the correct
      // order -- WCAG 2.2 SC 1.4.13 asks that hover/focus content be
      // dismissible, so the transient thing goes first -- but it means one
      // press is not guaranteed to close the workspace. Press until it is gone
      // rather than assume.
      for (let attempt = 0; attempt < 4; attempt += 1) {
        if (!(await page.locator('[data-testid="qa-harness-dialog"]').count())) break
        await page.keyboard.press('Escape')
        await page.waitForTimeout(150)
      }
      await expect(page.getByTestId('qa-harness-dialog')).toHaveCount(0)
      return text
    }

    // A test id wins outright, even though an aria-label is also present.
    expect(await pickAndRead('[data-testid="fixture-unico"]')).toContain('[data-testid="fixture-unico"]')

    // The generated id must not be offered: #radix-:r99: is gone next render.
    const generated = await pickAndRead('#picker-fixture button[aria-label="Duplicado"]')
    expect(generated).not.toContain('radix-')
    // And whatever it did choose has to actually resolve to one element.
    const chosen = generated.match(/#picker-fixture[^\n—]*|\[data-testid[^\]]*\]/)?.[0]?.trim()
    expect(chosen, 'no selector was recorded').toBeTruthy()
    expect(await page.locator(chosen!).count()).toBe(1)
  })
})
