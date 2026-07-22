/**
 * Regression tests for "El Arte de Python" course.
 *
 * These tests ensure that future changes do NOT accidentally remove:
 *   - Any of the 52 sections
 *   - The 5 sub-steps per section (theory, ido, wedo, youdo, quiz)
 *   - The 4 capstone projects (S13, S26, S39, S51)
 *   - The CodePlayground demos
 *   - The exam spec content
 *   - Key navigation elements (HUD FABs, tabs, progress)
 *
 * Run: npx playwright test scripts/regression.spec.ts
 */
import { test, expect, type Page } from '@playwright/test'

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'

// All 52 section IDs — if any is removed, tests fail
const ALL_SECTION_IDS = [
  // Phase 0 (S1-S13)
  'setup', 'basics', 'data-structures', 'functions-modules', 'oop',
  'numpy', 'data-acquisition', 'pandas', 'visualization', 'sklearn',
  'testing', 'performance', 'rpa-automation',
  // Phase 1 (S14-S26)
  'security', 'stdlib-deep', 'wxpython-gui', 'packaging', 'data-engineering',
  'databases-orm', 'rag', 'fastapi', 'rapidfuzz-entity', 'computer-vision',
  'rpa-advanced', 'streamlit-dashboards', 'integrator-phase1',
  // Phase 2 (S27-S39)
  'async-concurrency', 'llm-agents', 'mlops', 'security-infra', 'streaming-data',
  'microservices', 'advanced-models', 'cv-ai-integration', 'system-design',
  'ai-apis-advanced', 'dbt-bigquery', 'performance-extreme', 'integrator-phase2',
  // Phase 3 (S40-S52)
  'agentic-architecture', 'llm-finetuning', 'graph-rag', 'llmops', 'multimodal',
  'iac', 'gpu-computing', 'opensource', 'ai-governance', 'data-contracts',
  'tech-leadership', 'integrator-final', 'career-strategy',
]

// Capstone sections that MUST exist
const CAPSTONE_IDS = ['rpa-automation', 'integrator-phase1', 'integrator-phase2', 'integrator-final']

// 5 sub-steps that MUST be present in every section
const SUB_STEPS = ['theory', 'ido', 'wedo', 'youdo', 'quiz']

async function openSection(page: Page, sectionId: string) {
  await page.goto(`${BASE_URL}/#${sectionId}`, { waitUntil: 'domcontentloaded' })
  await expect(page.getByTestId('section-root')).toHaveAttribute(
    'data-section-id',
    sectionId,
    { timeout: 15_000 }
  )
}

async function selectSection(page: Page, sectionId: string) {
  await page.evaluate((nextSectionId) => {
    window.location.hash = nextSectionId
  }, sectionId)
  await expect(page.getByTestId('section-root')).toHaveAttribute(
    'data-section-id',
    sectionId,
    { timeout: 15_000 }
  )
}

// ═══════════════════════════════════════════════════════════
// TEST 1: All 52 sections are registered in the course index
// ═══════════════════════════════════════════════════════════
test.describe('Section registry integrity', () => {
  test('course index exports exactly 52 sections', async () => {
    // Read the course index file and count sections
    const fs = await import('fs/promises')
    const indexContent = await fs.readFile(
      'src/lib/course/index.ts',
      'utf-8'
    )
    // Count import lines like "import { section01 }"
    const importMatches = indexContent.match(/import \{ section\d+ \}/g)
    expect(importMatches, 'Should have 52 section imports').toHaveLength(52)

    // Count entries in COURSE_SECTIONS array
    const arrayMatches = indexContent.match(/section\d+,/g)
    expect(arrayMatches, 'Should have 52 entries in COURSE_SECTIONS').toHaveLength(52)
  })

  test('every section ID appears in section files', async () => {
    const fs = await import('fs/promises')
    const path = await import('path')

    const sectionsDir = 'src/lib/course/sections'
    const files = await fs.readdir(sectionsDir)

    // Each .ts file should have an `id:` field
    for (const file of files) {
      if (!file.endsWith('.ts')) continue
      const content = await fs.readFile(path.join(sectionsDir, file), 'utf-8')
      expect(content, `${file} should have an id field`).toContain('id:')
      expect(content, `${file} should have an index field`).toContain('index:')
    }
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 2: All 52 sections load in the browser without errors
// ═══════════════════════════════════════════════════════════
test.describe('Section loading (browser)', () => {
  test('all 52 sections load and show tabs', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') errors.push(msg.text())
    })

    await openSection(page, ALL_SECTION_IDS[0])

    for (const [index, sectionId] of ALL_SECTION_IDS.entries()) {
      await test.step(`section "${sectionId}" loads and shows tabs`, async () => {
        const errorOffset = errors.length
        if (index > 0) await selectSection(page, sectionId)

        await expect(page.locator('#section-content')).toBeVisible()
        await expect(page.locator('[role="tab"]')).toHaveCount(5)
        await expect(page.locator('button[aria-label="Sección anterior"]')).toBeVisible()
        await expect(page.locator('button[aria-label="Sección siguiente"]')).toBeVisible()

        const criticalErrors = errors.slice(errorOffset).filter(
          (error) =>
            !error.includes('pyodide') &&
            !error.includes('cdn') &&
            !error.includes('favicon')
        )
        expect(
          criticalErrors,
          `Console errors for ${sectionId}: ${criticalErrors.join('; ')}`
        ).toHaveLength(0)
      })
    }
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 3: Each sub-step tab is clickable and shows content
// ═══════════════════════════════════════════════════════════
test.describe('Sub-step tabs functional', () => {
  for (const sectionId of ['setup', 'numpy', 'sklearn', 'rag', 'llm-agents']) {
    test(`${sectionId}: all 5 sub-step tabs switch content`, async ({ page }) => {
      await openSection(page, sectionId)

      for (const sub of SUB_STEPS) {
        const tab = page.locator(`[role="tab"][id$="-trigger-${sub}"]`)
        await tab.click()

        // The corresponding tab content should be visible
        const content = page.locator(`[data-state="active"][role="tabpanel"]`)
        await expect(content).toBeVisible()

        // Content should not be empty
        const text = await content.textContent()
        expect(text?.trim().length, `${sectionId}/${sub} content should not be empty`).toBeGreaterThan(10)
      }
    })
  }
})

// ═══════════════════════════════════════════════════════════
// TEST 4: Capstone sections exist and have project content
// ═══════════════════════════════════════════════════════════
test.describe('Capstone integrity', () => {
  for (const capstoneId of CAPSTONE_IDS) {
    test(`capstone "${capstoneId}" has You Do project`, async ({ page }) => {
      await openSection(page, capstoneId)

      // Click You Do tab
      const youdoTab = page.locator('[role="tab"][id$="-trigger-youdo"]')
      await youdoTab.click()

      // Should have project content (not empty)
      const content = page.locator('[data-state="active"][role="tabpanel"]')
      const text = await content.textContent()
      expect(text?.toLowerCase(), `${capstoneId} should mention "proyecto"`).toContain('proyecto')
    })
  }
})

// ═══════════════════════════════════════════════════════════
// TEST 5: CodePlayground demos exist in SectionView source
// ═══════════════════════════════════════════════════════════
test.describe('CodePlayground demo integrity', () => {
  test('SectionView has 52 demo entries (one per section)', async () => {
    const fs = await import('fs/promises')
    const content = await fs.readFile(
      'src/components/course/SectionView.tsx',
      'utf-8'
    )

    // Count demo entries by looking for the pattern `    '<id>': {`
    // This matches the start of each demo block in the demos record
    const demoMatches = content.match(/^    '[a-z0-9-]+': \{$/gm) || []

    // Should have at least 52 (one per section) — allow a few extra for legacy
    expect(demoMatches.length, `Should have at least 52 demo entries, got ${demoMatches.length}`).toBeGreaterThanOrEqual(52)
  })

  test('CodePlayground component is imported and used', async () => {
    const fs = await import('fs/promises')
    const content = await fs.readFile(
      'src/components/course/SectionView.tsx',
      'utf-8'
    )
    expect(content, 'Should import CodePlayground').toContain('import { CodePlayground }')
    expect(content, 'Should render CodePlayground').toContain('<CodePlayground')
  })

  test('each active section has a demo entry', async () => {
    const fs = await import('fs/promises')
    const content = await fs.readFile(
      'src/components/course/SectionView.tsx',
      'utf-8'
    )

    // For each section ID, verify there's a demo entry
    for (const sectionId of ALL_SECTION_IDS) {
      const pattern = new RegExp(`^    '${sectionId}': \\{`, 'm')
      expect(
        pattern.test(content),
        `Demo entry for section "${sectionId}" not found in SectionView.tsx`
      ).toBe(true)
    }
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 6: Learning roadmap has 52 sections documented
// ═══════════════════════════════════════════════════════════
test.describe('Roadmap integrity', () => {
  test('learning_roadmap.md has 52 section headers', async () => {
    const fs = await import('fs/promises')
    const content = await fs.readFile('learning_roadmap.md', 'utf-8')

    // Count ## N. headers (N = 1-52)
    const sectionHeaders = content.match(/^## \d+\. /gm) || []
    expect(sectionHeaders, `Should have 52 section headers in roadmap, got ${sectionHeaders.length}`).toHaveLength(52)
  })

  test('roadmap has 52 exam spec sections', async () => {
    const fs = await import('fs/promises')
    const content = await fs.readFile('learning_roadmap.md', 'utf-8')

    const examSpecs = content.match(/^### Auto-evaluación — Requisitos detallados del examen$/gm) || []
    expect(examSpecs, `Should have 52 exam spec sections, got ${examSpecs.length}`).toHaveLength(52)
  })

  test('roadmap has 3 phase headers (Fase 1-3; Fase 0 is implicit in S1-S13)', async () => {
    const fs = await import('fs/promises')
    const content = await fs.readFile('learning_roadmap.md', 'utf-8')

    const phaseHeaders = content.match(/^## Fase [1-3] —/gm) || []
    expect(phaseHeaders, `Should have 3 phase headers (Fase 1, 2, 3)`).toHaveLength(3)
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 7: HUD overlay elements are present
// ═══════════════════════════════════════════════════════════
test.describe('HUD overlay integrity', () => {
  test('section view has prev/next FABs and progress dots', async ({ page }) => {
    await openSection(page, 'setup')

    // Prev FAB
    await expect(page.locator('button[aria-label="Sección anterior"]')).toBeVisible()

    // Next FAB
    await expect(page.locator('button[aria-label="Sección siguiente"]')).toBeVisible()

    // Progress dots (5 dots, clickable)
    const dots = page.locator('button[aria-label^="Ir a "]')
    await expect(dots).toHaveCount(5)
  })

  test('compact top bar has section badge, title, progress ring', async ({ page }) => {
    await openSection(page, 'numpy')

    // Section badge
    await expect(page.locator('text=S6').first()).toBeVisible()

    // Title (gradient-text class)
    await expect(page.locator('h1.gradient-text, h1 .gradient-text').first()).toBeVisible()

    // Progress ring (svg with circle)
    await expect(page.locator('svg circle').first()).toBeVisible()
  })

  test('job relevance popover and outcomes sheet triggers exist', async ({ page }) => {
    await openSection(page, 'sklearn')

    // Briefcase icon (job relevance trigger)
    await expect(page.locator('button[title="¿Para qué te sirve?"]').first()).toBeVisible()

    // ListChecks icon (outcomes sheet trigger)
    await expect(page.locator('button[title="Objetivos de aprendizaje"]').first()).toBeVisible()
  })
})

// ═══════════════════════════════════════════════════════════
// TEST 8: No geometric overlaps in critical sections
// ═══════════════════════════════════════════════════════════
test.describe('Geometric integrity (no overlaps)', () => {
  for (const sectionId of ['setup', 'numpy', 'sklearn', 'rag', 'llm-agents']) {
    test(`${sectionId}: no text element overlaps another`, async ({ page }) => {
      await openSection(page, sectionId)
      await page.waitForTimeout(250)

      // Bounding boxes + DOM depth + position (sticky/fixed chrome false positives)
      const data = await page.evaluate(() => {
        const vw = window.innerWidth
        const vh = window.innerHeight
        const results: Array<{
          tag: string
          text: string
          x: number
          y: number
          w: number
          h: number
          depth: number
          position: string
        }> = []

        function getDepth(el: Element): number {
          let d = 0
          let n: Element | null = el
          while (n && n !== document.body) {
            d++
            n = n.parentElement
          }
          return d
        }

        // Content text only — exclude tiny controls; tabs/labels often nest in chrome
        const els = document.querySelectorAll(
          'main h1, main h2, main h3, main h4, main p, main button, main a[href], main [role="button"], main [role="tab"], main label'
        )
        els.forEach((el) => {
          const r = el.getBoundingClientRect()
          if (r.width < 2 || r.height < 2) return
          const cs = window.getComputedStyle(el as HTMLElement)
          if (cs.display === 'none' || cs.visibility === 'hidden' || cs.opacity === '0') return
          if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) return
          // Skip sticky/fixed (headers, FABs)
          if (cs.position === 'fixed' || cs.position === 'sticky') return

          const text = ((el as HTMLElement).textContent || '').trim().slice(0, 40)
          if (!text) return

          results.push({
            tag: el.tagName.toLowerCase(),
            text,
            x: r.x,
            y: r.y,
            w: r.width,
            h: r.height,
            depth: getDepth(el),
            position: cs.position,
          })
        })
        return results
      })

      // Overlap rules (see tests/adversarial/geometry_overlap.test.mjs):
      // skip identical text, full containment, depth-adjacent, tiny area noise
      let overlapCount = 0
      const overlaps: string[] = []
      const MIN_AREA = 24
      for (let i = 0; i < data.length; i++) {
        for (let j = i + 1; j < data.length; j++) {
          const a = data[i]
          const b = data[j]

          if (a.text === b.text) continue

          if (a.x <= b.x && a.x + a.w >= b.x + b.w && a.y <= b.y && a.y + a.h >= b.y + b.h) continue
          if (b.x <= a.x && b.x + b.w >= a.x + a.w && b.y <= a.y && b.y + b.h >= a.y + a.h) continue

          // Nested UI often differs by a few depth levels; use 3
          if (Math.abs(a.depth - b.depth) <= 3) continue

          const ix = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x))
          const iy = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y))
          const area = ix * iy
          if (ix >= 3 && iy >= 3 && area >= MIN_AREA) {
            overlapCount++
            const msg = `OVERLAP: <${a.tag}>"${a.text}" vs <${b.tag}>"${b.text}" — area=${area}px²`
            overlaps.push(msg)
          }
        }
      }

      if (overlapCount > 0) {
        console.log(`${sectionId} overlaps:\n${overlaps.join('\n')}`)
      }

      expect(overlapCount, `${sectionId} should have 0 text overlaps, got ${overlapCount}`).toBe(0)
    })
  }
})
