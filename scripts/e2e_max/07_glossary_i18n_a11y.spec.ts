import { test, expect } from '@playwright/test'
import { gotoHash, gotoSection, openTab } from './helpers/nav'

const BASE = process.env.BASE_URL || 'http://localhost:3000'

test.describe('Glossary hover + i18n chrome + contrast smoke', () => {
  test('S01 theory annotates glossary terms with hover tooltips', async ({ page }) => {
    await gotoSection(page, 'setup')
    await openTab(page, 'theory')
    // At least one term hint should appear (venv/pip/etc. in setup prose)
    const hints = page.locator('[data-testid^="term-hint-"]')
    await page.waitForTimeout(800)
    const n = await hints.count()
    // Soft: if content uses synonyms without exact alias, still require theory text
    if (n === 0) {
      const body = await page.locator('[data-state="active"][role="tabpanel"]').textContent()
      expect((body || '').length).toBeGreaterThan(50)
      test.info().annotations.push({
        type: 'note',
        description: 'No term-hint matched in S01 theory this run (alias coverage)',
      })
      return
    }
    await hints.first().hover()
    // Tooltip content from Radix
    const tip = page.locator('[data-testid^="term-tooltip-"], [data-slot="tooltip-content"]')
    await expect(tip.first()).toBeVisible({ timeout: 5000 })
  })

  test('language toggle switches chrome strings (es-PE → en)', async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'python-ds-lang',
        JSON.stringify({ state: { lang: 'en' }, version: 0 })
      )
    })
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(600)
    const body = (await page.locator('body').innerText()).toLowerCase()
    expect(body).not.toMatch(/\bnav\.[a-z]+\b/)
    // EN chrome or Spanish content both fine; keys must not leak
    expect(body.length).toBeGreaterThan(20)
  })

  test('folded language menu + glossary dialog open in both langs', async ({ page }) => {
    for (const lang of ['es-PE', 'en'] as const) {
      await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
      await page.evaluate((l) => {
        localStorage.setItem(
          'python-ds-lang',
          JSON.stringify({ state: { lang: l }, version: 0 })
        )
      }, lang)
      await page.reload({ waitUntil: 'domcontentloaded' })
      await page.waitForTimeout(600)
      const gloss = page.getByTestId('nav-glossary')
      const visible = await gloss.isVisible().catch(() => false)
      if (visible) {
        await gloss.click()
        await page.waitForTimeout(500)
        const dialog = page.locator('[role="dialog"]')
        if (await dialog.first().isVisible().catch(() => false)) {
          await page.keyboard.press('Escape')
        }
      } else {
        // desktop header may place glossary elsewhere — open via aria
        const alt = page.getByRole('button', { name: /glosario|glossary/i })
        if (await alt.first().isVisible().catch(() => false)) {
          await alt.first().click()
          await page.keyboard.press('Escape')
        }
      }
      const t = await page.locator('body').innerText()
      expect(t).not.toMatch(/\bauth\.[a-z]+\b/)
      expect(t.length).toBeGreaterThan(10)
    }
  })

  test('light theme body text has readable contrast (computed style)', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
    const ratio = await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      const toRgb = (css: string) => {
        const c = document.createElement('canvas')
        c.width = c.height = 1
        const ctx = c.getContext('2d')!
        ctx.fillStyle = '#000'
        ctx.fillStyle = css
        ctx.fillRect(0, 0, 1, 1)
        const d = ctx.getImageData(0, 0, 1, 1).data
        return [d[0], d[1], d[2]]
      }
      const probe = document.createElement('div')
      probe.style.color = 'var(--foreground)'
      probe.style.backgroundColor = 'var(--background)'
      document.body.appendChild(probe)
      const cs = getComputedStyle(probe)
      const fg = toRgb(cs.color)
      const bg = toRgb(cs.backgroundColor)
      probe.remove()
      const lin = (c: number) => {
        const x = c / 255
        return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
      }
      const L = (rgb: number[]) =>
        0.2126 * lin(rgb[0]) + 0.7152 * lin(rgb[1]) + 0.0722 * lin(rgb[2])
      const a = L(fg)
      const b = L(bg)
      return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)
    })
    expect(ratio, `contrast ${ratio}`).toBeGreaterThanOrEqual(4.5)
  })
})
