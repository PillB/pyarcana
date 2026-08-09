/**
 * Crawl PyArcana as a learner: open each section → Theory tab → extract
 * visible paragraph/heading text (DOM as rendered, not source TS).
 *
 * Usage:
 *   BASE_URL=http://localhost:3000 node scripts/playwright_visible_paragraphs.mjs
 *   SECTIONS=setup,basics,ai-apis-advanced node scripts/playwright_visible_paragraphs.mjs
 *   FROM=36 TO=40 node scripts/playwright_visible_paragraphs.mjs
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const BASE = process.env.BASE_URL || 'http://localhost:3000'
const OUT_DIR =
  process.env.OUT_DIR ||
  path.join(ROOT, 'course-state/curriculum_hardening/visible_paragraphs')
const SCRATCH =
  process.env.SCRATCH ||
  '/var/folders/46/hqp40jys76g696ycvflt54mc0000gn/T/grok-goal-b11e0e04dcbc/implementer'

// Section id + index from active course (read via dynamic import of built paths is hard;
// parse index.ts imports and section files).
function loadActiveSections() {
  const indexText = fs.readFileSync(path.join(ROOT, 'src/lib/course/index.ts'), 'utf8')
  const names = [...indexText.matchAll(/from ['"]\.\/sections\/([^'"]+)['"]/g)].map((m) => m[1])
  const sections = []
  for (const name of names) {
    const file = path.join(ROOT, 'src/lib/course/sections', `${name}.ts`)
    const text = fs.readFileSync(file, 'utf8')
    const id = text.match(/\bid:\s*['"]([^'"]+)['"]/)?.[1]
    const index = Number(text.match(/\bindex:\s*(\d+)/)?.[1])
    const title = text.match(/\btitle:\s*['"]([^'"]+)['"]/)?.[1]
    if (id && index) sections.push({ id, index, title: title || id, file: `${name}.ts` })
  }
  sections.sort((a, b) => a.index - b.index)
  return sections
}

function filterSections(all) {
  if (process.env.SECTIONS) {
    const want = new Set(process.env.SECTIONS.split(',').map((s) => s.trim()))
    return all.filter((s) => want.has(s.id) || want.has(String(s.index)))
  }
  const from = process.env.FROM ? Number(process.env.FROM) : 1
  const to = process.env.TO ? Number(process.env.TO) : 52
  return all.filter((s) => s.index >= from && s.index <= to)
}

/** True if unit looks like a theory subheading, not body prose */
function looksLikeHeading(t) {
  if (t.length > 80) return false
  if (/[.!?;:]$/.test(t) && t.length > 45) return false
  // Title case / short label without full sentence
  if (!/[.!?]/.test(t) && t.split(/\s+/).length <= 12) return true
  if (/^(T\d|S\d{2}|Mapa|Ruta de)/i.test(t)) return true
  return false
}

/** Heuristic redaction / coherence flags on visible text units */
function analyzeUnit(text, ctx) {
  const issues = []
  const t = text.trim()
  const heading = looksLikeHeading(t)
  if (heading) {
    // Headings are expected short — do not penalize length
    return { issues: [], rank: 9.6, ctx: { ...ctx, kind: 'heading' } }
  }
  if (t.length < 40) issues.push({ code: 'too_short', severity: 'med', detail: `len=${t.length}` })
  if (t.length > 1200) issues.push({ code: 'too_long', severity: 'low', detail: `len=${t.length}` })
  if (/completa solo print/i.test(t))
    issues.push({ code: 'print_theater_phrase', severity: 'high', detail: 'banned theater phrase visible' })
  // Exact authoring stubs only (avoid false positives on words like "staged")
  if (/(?:^|[^A-Za-z])(?:TODO|FIXME|TBD|PLACEHOLDER)(?:[^A-Za-z]|$)/.test(t) || /lorem ipsum/i.test(t))
    issues.push({ code: 'placeholder', severity: 'high', detail: 'placeholder marker visible' })
  if (/(.)\1{8,}/.test(t))
    issues.push({ code: 'char_run', severity: 'med', detail: 'repeated character run' })
  // Template soup: same boilerplate repeated
  if (
    /documentas entrada, salida, error y dueño/i.test(t) ||
    /Documenta contrato, evidencia y límites en el laboratorio sintético/i.test(t)
  )
    issues.push({
      code: 'template_boilerplate',
      severity: 'high',
      detail: 'repeated ethics/lab boilerplate tail',
    })
  // Thin contracts only if no mechanism follow-up keywords
  if (
    /Contrato operativo\. Entrada:.*Salida:.*Error:/i.test(t) &&
    t.length < 220 &&
    !/Por qué|Mecanismo|Cómo verificar|Criterio/i.test(t)
  )
    issues.push({
      code: 'thin_contract_only',
      severity: 'med',
      detail: 'contract shell without mechanism depth',
    })
  // Coherence: broken words / encoding
  if (/\uFFFD|â€|Ã¡|Ã©/.test(t))
    issues.push({ code: 'encoding_glitch', severity: 'high', detail: 'mojibake / replacement chars' })
  // Duplicate sentence halves
  const sentences = t.split(/(?<=[.!?])\s+/).filter((s) => s.length > 30)
  const seen = new Map()
  for (const s of sentences) {
    const key = s.slice(0, 80).toLowerCase()
    seen.set(key, (seen.get(key) || 0) + 1)
  }
  for (const [k, c] of seen) {
    if (c >= 2)
      issues.push({ code: 'duplicate_sentence', severity: 'high', detail: `repeated: ${k}… ×${c}` })
  }
  // Rank
  let rank = 9.5
  for (const iss of issues) {
    if (iss.severity === 'high') rank -= 1.2
    else if (iss.severity === 'med') rank -= 0.5
    else rank -= 0.2
  }
  rank = Math.max(1, Math.round(rank * 10) / 10)
  return { issues, rank, ctx: { ...ctx, kind: 'prose' } }
}

async function gotoSection(page, sectionId) {
  const bust = `pw=${Date.now()}`
  await page.goto(`${BASE}/?${bust}#${sectionId}`, { waitUntil: 'domcontentloaded', timeout: 60_000 })
  await page.waitForTimeout(400)
  await page.evaluate((h) => {
    if (window.location.hash !== `#${h}`) window.location.hash = h
    else window.dispatchEvent(new HashChangeEvent('hashchange'))
  }, sectionId)
  await page.waitForFunction(
    (id) => document.querySelector('[data-testid="section-root"]')?.getAttribute('data-section-id') === id,
    sectionId,
    { timeout: 25_000 }
  )
}

async function openTheory(page) {
  const tab = page.getByTestId('tab-theory')
  await tab.waitFor({ state: 'visible', timeout: 15_000 })
  await tab.click()
  await page.waitForTimeout(250)
}

async function extractVisibleTheory(page) {
  // Prefer active theory tabpanel; fall back to main section content
  return page.evaluate(() => {
    const root =
      document.querySelector('[data-state="active"][role="tabpanel"]') ||
      document.querySelector('[data-testid="section-root"]')
    if (!root) return { headings: [], paragraphs: [], rawText: '' }

    const headings = []
    const paragraphs = []

    // Headings as user sees them
    root.querySelectorAll('h1,h2,h3,h4').forEach((el, i) => {
      const text = (el.innerText || '').trim()
      if (text && text.length > 1) {
        headings.push({ i, tag: el.tagName.toLowerCase(), text })
      }
    })

    // Paragraph-like blocks: p, and prose containers without nesting another p
    const paraEls = root.querySelectorAll('p, .prose > div, [class*="space-y"] > p')
    const seen = new Set()
    paraEls.forEach((el, i) => {
      // skip if inside code block / pre
      if (el.closest('pre, code, [data-testid^="demo-"]')) return
      const text = (el.innerText || '').trim()
      if (!text || text.length < 25) return
      // dedupe
      const key = text.slice(0, 120)
      if (seen.has(key)) return
      seen.add(key)
      // skip chrome UI
      if (/^Marcar teoría|^Yo hago|^Teoría$|^Siguiente|^Anterior/i.test(text)) return
      paragraphs.push({ i, text, len: text.length })
    })

    // Also split large RichText blocks that may be single elements with newlines
    if (paragraphs.length < 3) {
      const body = (root.innerText || '').trim()
      body.split(/\n{2,}/).forEach((chunk, i) => {
        const text = chunk.trim()
        if (text.length < 40) return
        if (/^Marcar teoría/i.test(text)) return
        const key = text.slice(0, 120)
        if (seen.has(key)) return
        seen.add(key)
        paragraphs.push({ i: 1000 + i, text, len: text.length, source: 'split' })
      })
    }

    return {
      headings,
      paragraphs,
      rawText: (root.innerText || '').slice(0, 50000),
      rawLen: (root.innerText || '').length,
    }
  })
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true })
  fs.mkdirSync(SCRATCH, { recursive: true })

  const all = loadActiveSections()
  const sections = filterSections(all)
  console.log(`BASE=${BASE} sections=${sections.length} out=${OUT_DIR}`)

  const browser = await chromium.launch({ headless: true })
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } })

  const report = {
    generated_at: new Date().toISOString(),
    base: BASE,
    sections: [],
    summary: { high: 0, med: 0, low: 0, units: 0, mean_rank: 0 },
  }
  const ranks = []

  for (const sec of sections) {
    const entry = {
      index: sec.index,
      id: sec.id,
      title: sec.title,
      file: sec.file,
      ok: false,
      error: null,
      headings: [],
      paragraphs: [],
      analysis: [],
      worst_rank: 10,
      high_issues: [],
    }
    try {
      await gotoSection(page, sec.id)
      await openTheory(page)
      // Focus main content for "user view"
      await page.locator('[data-testid="section-root"]').focus().catch(() => {})
      const vis = await extractVisibleTheory(page)
      entry.headings = vis.headings
      entry.paragraphs = vis.paragraphs
      entry.raw_len = vis.rawLen
      entry.ok = true

      // Screenshot theory tab for sample sections
      if ([1, 23, 36, 40, 52].includes(sec.index) || process.env.SCREENSHOT_ALL === '1') {
        const shot = path.join(OUT_DIR, `s${String(sec.index).padStart(2, '0')}_${sec.id}_theory.png`)
        await page.screenshot({ path: shot, fullPage: false })
        entry.screenshot = shot
      }

      for (const p of vis.paragraphs) {
        const a = analyzeUnit(p.text, { section: sec.index, id: sec.id, para_i: p.i })
        entry.analysis.push({
          i: p.i,
          len: p.len,
          rank: a.rank,
          issues: a.issues,
          excerpt: p.text.slice(0, 180),
          text: p.text,
        })
        ranks.push(a.rank)
        for (const iss of a.issues) {
          report.summary[iss.severity] = (report.summary[iss.severity] || 0) + 1
          if (iss.severity === 'high') {
            entry.high_issues.push({ i: p.i, ...iss, excerpt: p.text.slice(0, 120) })
          }
        }
      }
      entry.worst_rank = entry.analysis.reduce((m, x) => Math.min(m, x.rank), 10)
      // Per-section JSON for auditors
      fs.writeFileSync(
        path.join(OUT_DIR, `s${String(sec.index).padStart(2, '0')}_${sec.id}.json`),
        JSON.stringify(entry, null, 2)
      )
      console.log(
        `S${String(sec.index).padStart(2, '0')} ${sec.id}: paras=${entry.paragraphs.length} heads=${entry.headings.length} worst=${entry.worst_rank} high=${entry.high_issues.length}`
      )
    } catch (e) {
      entry.error = String(e && e.stack ? e.stack : e)
      console.error(`FAIL S${sec.index} ${sec.id}:`, entry.error.split('\n')[0])
    }
    report.sections.push(entry)
  }

  await browser.close()

  report.summary.units = ranks.length
  report.summary.mean_rank = ranks.length
    ? Math.round((ranks.reduce((a, b) => a + b, 0) / ranks.length) * 100) / 100
    : 0
  report.summary.sections_ok = report.sections.filter((s) => s.ok).length
  report.summary.sections_fail = report.sections.filter((s) => !s.ok).length
  report.summary.sections_with_high = report.sections.filter((s) => s.high_issues?.length).length

  const reportPath = path.join(OUT_DIR, 'VISIBLE_PARAGRAPH_REPORT.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
  fs.writeFileSync(path.join(SCRATCH, 'visible_paragraph_report.json'), JSON.stringify(report, null, 2))

  // Human-readable top issues
  const md = [
    '# Visible paragraph audit (Playwright / user view)',
    '',
    `Base: ${BASE}`,
    `Generated: ${report.generated_at}`,
    `Sections OK: ${report.summary.sections_ok} / fail: ${report.summary.sections_fail}`,
    `Units: ${report.summary.units} mean_rank: ${report.summary.mean_rank}`,
    `Issues high/med/low: ${report.summary.high}/${report.summary.med}/${report.summary.low}`,
    '',
    '## Sections with high-severity visible issues',
    '',
  ]
  for (const s of report.sections.filter((x) => x.high_issues?.length)) {
    md.push(`### S${String(s.index).padStart(2, '0')} \`${s.id}\` — ${s.title}`)
    md.push(`worst_rank=${s.worst_rank} paras=${s.paragraphs.length}`)
    for (const h of s.high_issues.slice(0, 8)) {
      md.push(`- **${h.code}** (para ${h.i}): ${h.detail} — _${h.excerpt}…_`)
    }
    md.push('')
  }
  fs.writeFileSync(path.join(OUT_DIR, 'VISIBLE_PARAGRAPH_REPORT.md'), md.join('\n'))
  fs.writeFileSync(path.join(SCRATCH, 'visible_paragraph_report.md'), md.join('\n'))
  console.log('Wrote', reportPath)
  console.log('Summary', report.summary)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
