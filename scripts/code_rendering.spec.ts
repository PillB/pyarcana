import { createHash } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import { expect, test, type Locator, type Page } from '@playwright/test'

const SECTION_IDS = [
  'setup', 'basics', 'data-structures', 'functions-modules', 'oop',
  'numpy', 'data-acquisition', 'pandas', 'visualization', 'sklearn',
  'testing', 'performance', 'rpa-automation', 'security', 'stdlib-deep',
  'wxpython-gui', 'packaging', 'data-engineering', 'databases-orm', 'rag',
  'fastapi', 'rapidfuzz-entity', 'computer-vision', 'rpa-advanced',
  'streamlit-dashboards', 'integrator-phase1', 'async-concurrency', 'llm-agents',
  'mlops', 'security-infra', 'streaming-data', 'microservices', 'advanced-models',
  'cv-ai-integration', 'system-design', 'ai-apis-advanced', 'dbt-bigquery',
  'performance-extreme', 'integrator-phase2', 'agentic-architecture',
  'llm-finetuning', 'graph-rag', 'llmops', 'multimodal', 'iac', 'gpu-computing',
  'opensource', 'ai-governance', 'data-contracts', 'tech-leadership',
  'integrator-final', 'career-strategy',
] as const

const TABS = ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const
const CAPTURE_SCREENSHOTS = process.env.CODE_FIDELITY_SCREENSHOTS === '1'

type ManifestEntry = {
  section: string
  tab: string
  surface: number
  kind: 'code-block' | 'playground'
  language: string
  title: string
  sourceLength: number
  screenshot?: string
  screenshotSha256?: string
  width?: number
  height?: number
}

async function selectSection(page: Page, sectionId: string) {
  await page.evaluate((id) => {
    window.location.hash = id
  }, sectionId)
  await expect(page.getByTestId('section-root')).toHaveAttribute('data-section-id', sectionId)
}

async function revealSolutions(page: Page) {
  const buttons = page.locator('[data-testid^="exercise-check-"]')
  for (let index = 0; index < await buttons.count(); index++) {
    const button = buttons.nth(index)
    if ((await button.textContent())?.includes('Ver solución')) await button.click()
  }
}

async function captureSurface(
  locator: Locator,
  outputDir: string,
  filename: string,
): Promise<Pick<ManifestEntry, 'screenshot' | 'screenshotSha256' | 'width' | 'height'>> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await locator.waitFor({ state: 'visible' })
      const box = await locator.boundingBox()
      if (!box) throw new Error(`${filename} has no visible box on attempt ${attempt}`)
      expect(box.width, `${filename} should be wide enough to read`).toBeGreaterThan(80)
      expect(box.height, `${filename} should be tall enough to read`).toBeGreaterThan(20)

      const screenshotPath = path.join(outputDir, filename)
      const png = await locator.screenshot({ path: screenshotPath, animations: 'disabled' })
      expect(png.byteLength, `${filename} should not be an empty screenshot`).toBeGreaterThan(100)
      return {
        screenshot: filename,
        screenshotSha256: createHash('sha256').update(png).digest('hex'),
        width: Math.round(box.width),
        height: Math.round(box.height),
      }
    } catch (error) {
      if (attempt === 3) throw error
      await locator.page().waitForTimeout(200)
    }
  }

  throw new Error(`unreachable screenshot retry state for ${filename}`)
}

test.describe('Code rendering fidelity', () => {
  test('S01-S52 code, terminal, output, and playground text matches its source', async ({ page }, testInfo) => {
    test.setTimeout(CAPTURE_SCREENSHOTS ? 1_500_000 : 600_000)
    const outputDir = testInfo.outputPath('code-fidelity')
    await mkdir(outputDir, { recursive: true })
    const manifest: ManifestEntry[] = []
    let surfaceNumber = 0

    await page.goto('/#setup', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('section-root')).toHaveAttribute('data-section-id', 'setup')

    for (const section of SECTION_IDS) {
      if (section !== 'setup') await selectSection(page, section)

      for (const tab of TABS) {
        const tabTrigger = page.getByTestId(`tab-${tab}`)
        await tabTrigger.click()
        await expect(tabTrigger).toHaveAttribute('data-state', 'active')
        await page.waitForTimeout(250)
        if (tab === 'wedo') {
          await revealSolutions(page)
          await page.waitForTimeout(250)
        }

        const activePanel = page.locator('[role="tabpanel"][data-state="active"]')
        await expect(activePanel).toBeVisible()
        const blocks = activePanel.getByTestId('code-block')
        for (let index = 0; index < await blocks.count(); index++) {
          const block = blocks.nth(index)
          const code = block.locator('code[data-code-source]').first()
          const expected = await code.getAttribute('data-code-source')
          const actual = await code.textContent()
          expect(actual, `${section}/${tab}/code-block-${index}`).toBe(expected)

          const output = block.locator('code[data-output-source]')
          if (await output.count()) {
            expect(await output.textContent(), `${section}/${tab}/output-${index}`).toBe(
              await output.getAttribute('data-output-source'),
            )
          }

          const fontFamily = await code.evaluate((element) => getComputedStyle(element).fontFamily)
          expect(fontFamily.toLowerCase(), `${section}/${tab}/code-block-${index} font`).toMatch(
            /mono|courier/,
          )

          const language = (await block.getAttribute('data-code-language')) || 'python'
          const title = (await block.locator('div').first().textContent())?.trim() || language
          const entry: ManifestEntry = {
            section,
            tab,
            surface: surfaceNumber,
            kind: 'code-block',
            language,
            title,
            sourceLength: expected?.length ?? 0,
          }
          if (CAPTURE_SCREENSHOTS) {
            Object.assign(
              entry,
              await captureSurface(
                block,
                outputDir,
                `${String(surfaceNumber).padStart(4, '0')}-${section}-${tab}-code.png`,
              ),
            )
          }
          manifest.push(entry)
          surfaceNumber++
        }

        const playgrounds = activePanel.locator('textarea[data-initial-code]')
        for (let index = 0; index < await playgrounds.count(); index++) {
          const editor = playgrounds.nth(index)
          const expected = await editor.getAttribute('data-initial-code')
          expect(await editor.inputValue(), `${section}/${tab}/playground-${index}`).toBe(expected)

          const container = editor.locator('xpath=ancestor::div[@data-testid][1]')
          const entry: ManifestEntry = {
            section,
            tab,
            surface: surfaceNumber,
            kind: 'playground',
            language: 'python',
            title: (await container.locator('div').first().textContent())?.trim() || 'Python playground',
            sourceLength: expected?.length ?? 0,
          }
          if (CAPTURE_SCREENSHOTS) {
            Object.assign(
              entry,
              await captureSurface(
                container,
                outputDir,
                `${String(surfaceNumber).padStart(4, '0')}-${section}-${tab}-playground.png`,
              ),
            )
          }
          manifest.push(entry)
          surfaceNumber++
        }
      }
    }

    expect(manifest.filter((entry) => entry.kind === 'code-block').length).toBeGreaterThan(2500)
    expect(new Set(manifest.map((entry) => entry.section)).size).toBe(52)
    await writeFile(
      path.join(outputDir, 'manifest.json'),
      `${JSON.stringify({ screenshots: CAPTURE_SCREENSHOTS, surfaces: manifest }, null, 2)}\n`,
      'utf8',
    )
  })
})
