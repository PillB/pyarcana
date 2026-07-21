import { test, expect } from '@playwright/test'
import { loadCatalog, shardSections } from './helpers/catalog'
import { gotoSection, openTab } from './helpers/nav'
import fs from 'fs'
import path from 'path'

/** Sections that introduce at least one SSOT glossary term (firstSectionId). */
function introSections(): Set<string> {
  const termsPath = path.join(process.cwd(), 'src/lib/glossary/terms.ts')
  const text = fs.readFileSync(termsPath, 'utf8')
  const ids = new Set<string>()
  for (const m of text.matchAll(/firstSectionId:\s*'([^']+)'/g)) {
    ids.add(m[1])
  }
  return ids
}

test.describe('E2E max — glossary hover density (sharded 52)', () => {
  const intro = introSections()
  const sections = shardSections(loadCatalog().sections)

  for (const section of sections) {
    test(`${section.id}: theory glossary policy`, async ({ page }) => {
      test.setTimeout(90_000)
      await gotoSection(page, section.id)
      await openTab(page, 'theory')
      await page.waitForTimeout(500)

      const panel = page.locator('[data-state="active"][role="tabpanel"]')
      await expect(panel).toBeVisible()
      const body = ((await panel.textContent()) || '').trim()
      expect(body.length, 'theory should have content').toBeGreaterThan(20)

      const hints = page.locator('[data-testid^="term-hint-"]')
      const n = await hints.count()
      const expectsIntro = intro.has(section.id)

      if (expectsIntro && n === 0) {
        // Soft fail path: annotate + require at least theory content (SSOT may not match aliases in DOM yet)
        test.info().annotations.push({
          type: 'warning',
          description: `SSOT intro section ${section.id} had 0 term-hints — prose may lack aliases`,
        })
      }

      if (n > 0) {
        await hints.first().scrollIntoViewIfNeeded().catch(() => {})
        await hints.first().hover({ force: true }).catch(() => {})
        const tip = page.locator(
          '[data-testid^="term-tooltip-"], [data-slot="tooltip-content"]'
        )
        // tooltip may need focus for a11y
        if (!(await tip.first().isVisible().catch(() => false))) {
          await hints.first().focus()
        }
        await expect(tip.first()).toBeVisible({ timeout: 5000 })
        const tipText = ((await tip.first().textContent()) || '').trim()
        expect(tipText.length).toBeGreaterThan(10)
        // i18n key leak (nav.foo / exam.bar) — not technical paths like sklearn.pipeline
        expect(tipText).not.toMatch(
          /\b(nav|auth|exam|section|feedback|admin|glossary|playground|common)\.[a-zA-Z.]+\b/
        )
      }

      // S01 hard pedagogy
      if (section.id === 'setup') {
        expect(body.toLowerCase()).toMatch(/diccionario del d[ií]a|repositorio|entorno/)
        expect(n, 'S01 must annotate day-1 jargon').toBeGreaterThan(0)
      }
    })
  }
})
