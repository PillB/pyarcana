import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { loadCatalog, shardSections } from './helpers/catalog'
import { gotoSection, openTab } from './helpers/nav'
import {
  measureContrastInPanel,
  measureTooltipContrast,
  measureCodeTokens,
  setTheme,
  type ContrastPair,
} from './helpers/contrast'

const BASE = process.env.BASE_URL || 'http://localhost:3000'
const TABS = ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const
// Smoke mode: only first section of shard unless FULL=1
const FULL = process.env.READABILITY_FULL === '1'

test.describe('E2E readability — contrast exhaustive (sharded)', () => {
  const sections = shardSections(loadCatalog().sections)
  const toRun = FULL ? sections : sections.slice(0, 1)

  for (const section of toRun) {
    test(`${section.id}: contrast light+dark all tabs`, async ({ page }) => {
      test.setTimeout(240_000)
      const failures: (ContrastPair & { sectionId: string; tab: string; theme: string })[] = []
      let measured = 0

      await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' })
      await gotoSection(page, section.id)

      for (const theme of ['light', 'dark'] as const) {
        await setTheme(page, theme === 'dark')
        await page.waitForTimeout(200)

        for (const tab of TABS) {
          await openTab(page, tab)
          const panel = page.locator('[data-state="active"][role="tabpanel"]')
          await expect(panel).toBeVisible({ timeout: 15_000 })

          // Main body copy (avoid gradient headings via helper skip)
          const bodyPairs = await measureContrastInPanel(
            page,
            panel,
            'body_text',
            [
              '[data-state="active"][role="tabpanel"] > div p',
              '[data-state="active"][role="tabpanel"] .prose p',
              '.space-y-4 > p',
              'p.leading-relaxed',
              'li',
            ],
            4.5
          )
          // Code tokens / pane (primary hard gate for demos)
          const codePairs = await measureCodeTokens(page, panel)

          const all = [...bodyPairs, ...codePairs]
          measured += all.length
          for (const p of all) {
            if (!p.pass) {
              failures.push({ ...p, sectionId: section.id, tab, theme })
            }
          }

          // Term hints on theory
          if (tab === 'theory') {
            const hints = page.locator('[data-testid^="term-hint-"]')
            const n = await hints.count()
            if (n > 0) {
              await hints.first().scrollIntoViewIfNeeded().catch(() => {})
              await hints.first().hover({ force: true }).catch(() => {})
              await hints.first().focus().catch(() => {})
              await page.waitForTimeout(400)
              const tipPairs = await measureTooltipContrast(page)
              measured += tipPairs.length
              for (const p of tipPairs) {
                if (!p.pass) {
                  failures.push({ ...p, sectionId: section.id, tab, theme })
                }
              }
            }
          }
        }
      }

      // Write partial report artifact
      const reportDir = path.join(process.cwd(), 'course-state')
      const reportPath = path.join(reportDir, `readability_partial_${section.id}.json`)
      fs.mkdirSync(reportDir, { recursive: true })
      fs.writeFileSync(
        reportPath,
        JSON.stringify(
          {
            sectionId: section.id,
            measured,
            failCount: failures.length,
            failures: failures.slice(0, 50),
          },
          null,
          2
        )
      )

      // Soft-fail muted on exercise-dense panels is noisy; hard-fail code + term + body
      const hard = failures.filter(
        (f) =>
          f.family === 'term_hint' ||
          f.family === 'code_token' ||
          f.family === 'code_fg' ||
          f.family === 'body_text' ||
          f.family === 'code_line_num'
      )
      expect(
        hard,
        hard.map((f) => `${f.theme}/${f.tab}/${f.family} ${f.selector} ratio=${f.ratio}`).join('\n')
      ).toHaveLength(0)
    })
  }
})
