import { test, expect } from '@playwright/test'
import { gotoSection, openTab } from './helpers/nav'

test('S02: independent hints are optional and Python execution distinguishes failure from success', async ({ page }) => {
  test.setTimeout(180_000)
  await page.addInitScript(() => localStorage.setItem('pyarcana:tourCompleted', '1'))
  await gotoSection(page, 'basics')
  await openTab(page, 'wedo')

  const independent = page.getByTestId('exercise-S02-T1-A-E2')
  const hints = independent.getByTestId('exercise-hints-S02-T1-A-E2')
  await expect(hints).toHaveCount(1)
  await expect(hints.locator('summary')).toHaveText('Mostrar pistas opcionales')
  await expect(hints).not.toHaveAttribute('open', '')
  await hints.locator('summary').click()
  await expect(hints).toHaveAttribute('open', '')
  await hints.locator('summary').click()
  await expect(hints).not.toHaveAttribute('open', '')

  const guided = page.getByTestId('exercise-S02-T1-A-E1')
  const toggle = guided.getByTestId('exercise-try-S02-T1-A-E1')
  const editor = guided.getByTestId('exercise-editor-S02-T1-A-E1')
  await expect(editor).toHaveCount(0)
  await toggle.click()
  await expect(editor).toBeVisible()
  const python = editor.getByRole('textbox', { name: 'Editor de código Python' })
  const run = editor.getByTestId('exercise-playground-S02-T1-A-E1-run')
  await expect(python).toHaveValue(/print\(repr\(entero\)/)
  await expect(run).toBeEnabled({ timeout: 90_000 })

  await python.fill('raise ValueError("ERROR_INTENCIONAL")')
  await run.click()
  await expect(editor.getByText(/ValueError: ERROR_INTENCIONAL/)).toBeVisible({ timeout: 45_000 })

  await python.fill('print("RESULTADO_VALIDO")')
  await run.click()
  await expect(editor.getByText('RESULTADO_VALIDO', { exact: true })).toBeVisible({ timeout: 45_000 })

  // A code editor must permit keyboard-only escape in both directions.
  await python.focus()
  await page.keyboard.press('Tab')
  await expect(python).not.toBeFocused()
  await expect(python).toHaveValue('print("RESULTADO_VALIDO")')
  await python.focus()
  await page.keyboard.press('Shift+Tab')
  await expect(python).not.toBeFocused()
  await expect(python).toHaveValue('print("RESULTADO_VALIDO")')

  // Closing a card must not silently discard an in-progress draft.
  await toggle.click()
  await expect(editor).toHaveCount(0)
  await toggle.click()
  await expect(editor.getByRole('textbox', { name: 'Editor de código Python' })).toHaveValue('print("RESULTADO_VALIDO")')

  // We Do is keyed by the animated tab: leaving unmounts every editor card.
  // Returning must recover an unfinished draft from the section-scoped memory map.
  await openTab(page, 'theory')
  await openTab(page, 'wedo')
  const restored = page.getByTestId('exercise-S02-T1-A-E1')
  await restored.getByTestId('exercise-try-S02-T1-A-E1').click()
  const restoredEditor = restored.getByTestId('exercise-editor-S02-T1-A-E1')
  await expect(restoredEditor.getByRole('textbox', { name: 'Editor de código Python' })).toHaveValue('print("RESULTADO_VALIDO")')

  await restoredEditor.getByTestId('exercise-playground-S02-T1-A-E1-reset').click()
  await expect(restoredEditor.getByRole('textbox', { name: 'Editor de código Python' })).toHaveValue(/print\(repr\(entero\)/)
})

test('S01: Bash and documentation exercises never advertise a Python Run button', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('pyarcana:tourCompleted', '1'))
  await gotoSection(page, 'setup')
  await openTab(page, 'wedo')
  await expect(page.locator('[data-testid^="exercise-try-"]')).toHaveCount(0)
  await expect(page.locator('[data-testid^="exercise-check-"]')).toHaveCount(24)
})
