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
    test.setTimeout(480_000)
    const outputDir = testInfo.outputPath('code-fidelity')
    await mkdir(outputDir, { recursive: true })
    const manifest: ManifestEntry[] = []
    let surfaceNumber = 0

    await page.goto('/#setup', { waitUntil: 'domcontentloaded' })
    await expect(page.getByTestId('section-root')).toHaveAttribute('data-section-id', 'setup')

    for (const section of SECTION_IDS) {
      if (section !== 'setup') await selectSection(page, section)
      const capturedVisualKinds = new Set<'code' | 'terminal'>()

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
        const blockData = await activePanel.evaluate((panel) =>
          Array.from(panel.querySelectorAll<HTMLElement>('[data-testid="code-block"]')).map(
            (block) => {
              const code = block.querySelector<HTMLElement>('code[data-code-source]')
              const output = block.querySelector<HTMLElement>('code[data-output-source]')
              return {
                expected: code?.getAttribute('data-code-source') ?? null,
                actual: code?.textContent ?? null,
                outputExpected: output?.getAttribute('data-output-source') ?? null,
                outputActual: output?.textContent ?? null,
                fontFamily: code ? getComputedStyle(code).fontFamily : '',
                language: block.getAttribute('data-code-language') || 'python',
                title: block.firstElementChild?.textContent?.trim() || '',
              }
            },
          ),
        )
        const blocks = activePanel.getByTestId('code-block')
        for (const [index, data] of blockData.entries()) {
          expect(data.actual, `${section}/${tab}/code-block-${index}`).toBe(data.expected)
          if (data.outputExpected !== null) {
            expect(data.outputActual, `${section}/${tab}/output-${index}`).toBe(data.outputExpected)
          }
          expect(data.fontFamily.toLowerCase(), `${section}/${tab}/code-block-${index} font`).toMatch(
            /mono|courier/,
          )

          const language = data.language
          const visualKind: 'code' | 'terminal' = ['bash', 'sh', 'shell'].includes(language)
            ? 'terminal'
            : 'code'
          const title = data.title || language
          const entry: ManifestEntry = {
            section,
            tab,
            surface: surfaceNumber,
            kind: 'code-block',
            language,
            title,
            sourceLength: data.expected?.length ?? 0,
          }
          // DOM/source comparison above is exhaustive. Hosted element screenshots
          // take ~10 seconds each, so retain only diagnostic visual anchors: the
          // reported S01 block, an S01 terminal, and a final-section code window.
          const isReportedBlock = section === 'setup' && title.toLowerCase().includes('check_arg.py')
          const isSetupTerminal =
            section === 'setup' && visualKind === 'terminal' && !capturedVisualKinds.has('terminal')
          const isFinalCode =
            section === 'career-strategy' && visualKind === 'code' && !capturedVisualKinds.has('code')
          if (CAPTURE_SCREENSHOTS && (isReportedBlock || isSetupTerminal || isFinalCode)) {
            Object.assign(
              entry,
              await captureSurface(
                blocks.nth(index),
                outputDir,
                `${String(surfaceNumber).padStart(4, '0')}-${section}-${tab}-code.png`,
              ),
            )
            capturedVisualKinds.add(visualKind)
          }
          manifest.push(entry)
          surfaceNumber++
        }

        const playgroundData = await activePanel.evaluate((panel) =>
          Array.from(panel.querySelectorAll<HTMLTextAreaElement>('textarea[data-initial-code]')).map(
            (editor) => ({
              expected: editor.getAttribute('data-initial-code'),
              actual: editor.value,
              title:
                editor.closest<HTMLElement>('div[data-testid]')?.firstElementChild?.textContent?.trim() ||
                'Python playground',
            }),
          ),
        )
        for (const [index, data] of playgroundData.entries()) {
          expect(data.actual, `${section}/${tab}/playground-${index}`).toBe(data.expected)
          const entry: ManifestEntry = {
            section,
            tab,
            surface: surfaceNumber,
            kind: 'playground',
            language: 'python',
            title: data.title,
            sourceLength: data.expected?.length ?? 0,
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
