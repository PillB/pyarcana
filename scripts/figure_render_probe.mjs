#!/usr/bin/env node
/**
 * Rendered review of the teaching figures — passes 2, 3 and 4.
 *
 * The repo's forensic capture already measures HTML boxes: horizontal
 * overflow, elements past the viewport, missing accessible names. None of that
 * sees inside an <svg>, so a diagram can pass every existing gate while its
 * labels sit on top of each other or run off the canvas.
 *
 * This probe measures the things that are specific to a figure:
 *   - every <text> against the figure's own painted area (clipping)
 *   - every <text> against every other <text> in the same figure (occlusion)
 *   - rendered font size after the viewBox scale (mobile legibility)
 *   - the frame against its column (does the page scroll sideways?)
 *
 * Run against a dev server, at each viewport, in both themes.
 *
 *   node scripts/figure_render_probe.mjs --base-url http://localhost:3000
 */
import { chromium } from 'playwright'
import { writeFileSync, mkdirSync } from 'node:fs'

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, arr) => (a.startsWith('--') ? [[a.slice(2), arr[i + 1]]] : [])),
)
const BASE = args['base-url'] ?? 'http://localhost:3000'
const OUT = args.out ?? 'course-state/figure_render_report.json'

/** section id -> figure id, mirroring the registry. */
const TARGETS = [
  ['setup', 'S01-cwd-path'],
  ['data-structures', 'S03-tri-state'],
  ['functions-modules', 'S04-denominator'],
  ['oop', 'S05-contract'],
  ['numpy', 'S06-three-structures'],
  ['data-acquisition', 'S07-nfc-nfd'],
  ['pandas', 'S08-reconcile'],
  ['security', 'S14-view-vs-copy'],
  ['stdlib-deep', 'S15-dataframe'],
  ['data-engineering', 'S18-interval'],
  ['packaging', 'S17-wide-long'],
  ['microservices', 'S32-leakage'],
  ['ai-apis-advanced', 'S36-rolling-origin'],
  ['gpu-computing', 'S46-event-time'],
  ['streaming-data', 'S31-evidence-graph'],
]

const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 390, height: 844 },
  // 320 is the narrowest phone still in real use; it is the stress case, not
  // the target, so its findings are reported separately.
  { name: 'stress-320', width: 320, height: 640 },
]

const THEMES = ['light', 'dark']

/** Runs in the page. Returns per-figure geometry the DOM will not give us. */
const PROBE = (figureId) => {
  const fig = document.querySelector(`[data-figure-id="${figureId}"]`)
  if (!fig) return { present: false }
  const svg = fig.querySelector('svg')
  const isFlow = !!fig.querySelector('.react-flow')
  const figBox0 = fig.getBoundingClientRect()
  if (!svg || isFlow) {
    // A React Flow figure paints its labels as HTML nodes, not <text>. The
    // first version of this branch returned textCount: 0 with empty clipped
    // and overlaps arrays, so the one figure whose nodes are positioned by a
    // layout engine -- the one most likely to collide -- reported clean
    // without anything being measured. Measure the HTML instead.
    if (!isFlow) {
      return {
        present: true,
        kind: 'none',
        figureWidth: Math.round(figBox0.width),
        figureOverflow: Math.max(0, Math.round(figBox0.right - window.innerWidth)),
        pageOverflow: Math.max(0, Math.round(document.documentElement.scrollWidth - window.innerWidth)),
        textCount: 0,
        clipped: [],
        overlaps: [],
        smallestRenderedPx: null,
      }
    }

    const pane = fig.querySelector('.react-flow__viewport') ?? fig
    const paneBox = (fig.querySelector('.react-flow') ?? fig).getBoundingClientRect()
    // React Flow scales its whole viewport with a CSS transform. getComputedStyle
    // reports the *authored* font-size, which is not what the reader sees: at a
    // 0.36 fit-scale a 14px label paints at 5px. Read the matrix and apply it,
    // or this probe certifies legibility it never measured.
    const vpTransform = getComputedStyle(pane).transform
    const flowScale = (() => {
      if (!vpTransform || vpTransform === 'none') return 1
      const m = vpTransform.match(/matrix\(([^)]+)\)/)
      if (!m) return 1
      const parts = m[1].split(',').map(Number)
      return Number.isFinite(parts[0]) && parts[0] > 0 ? parts[0] : 1
    })()
    const nodes = [...fig.querySelectorAll('.react-flow__node')].map((n) => {
      const b = n.getBoundingClientRect()
      const cs = getComputedStyle(n)
      return {
        label: (n.textContent ?? '').trim().slice(0, 40),
        x: b.left, y: b.top, w: b.width, h: b.height,
        right: b.right, bottom: b.bottom,
        px: Math.round(parseFloat(cs.fontSize) * flowScale * 10) / 10,
        z: cs.zIndex === 'auto' ? 0 : Number(cs.zIndex),
      }
    })

    // A node painted outside the flow pane is clipped from the reader's view.
    const clipped = nodes
      .filter((n) => n.x < paneBox.left - 1 || n.right > paneBox.right + 1 ||
                     n.y < paneBox.top - 1 || n.bottom > paneBox.bottom + 1)
      .map((n) => n.label)

    // Two node boxes sharing pixels: one label is sitting on another.
    const overlaps = []
    for (let i = 0; i < nodes.length; i += 1) {
      for (let j = i + 1; j < nodes.length; j += 1) {
        const a = nodes[i]; const b = nodes[j]
        const ox = Math.min(a.right, b.right) - Math.max(a.x, b.x)
        const oy = Math.min(a.bottom, b.bottom) - Math.max(a.y, b.y)
        if (ox > 1 && oy > 1) {
          overlaps.push({ a: a.label, b: b.label, px: Math.round(ox * oy) })
        }
      }
    }

    // Edge labels are separate elements and collide with nodes just as easily.
    const edgeLabels = [...fig.querySelectorAll('.react-flow__edge-textwrapper, .react-flow__edge-text')].length

    return {
      present: true,
      kind: 'dom',
      figureWidth: Math.round(figBox0.width),
      figureOverflow: Math.max(0, Math.round(figBox0.right - window.innerWidth)),
      pageOverflow: Math.max(0, Math.round(document.documentElement.scrollWidth - window.innerWidth)),
      paneHeight: Math.round(paneBox.height),
      nodeCount: nodes.length,
      edgeLabelCount: edgeLabels,
      textCount: nodes.length,
      clipped,
      overlaps,
      flowScale: Math.round(flowScale * 1000) / 1000,
      smallestRenderedPx: nodes.length ? Math.min(...nodes.map((n) => n.px)) : null,
    }
  }

  const svgBox = svg.getBoundingClientRect()
  const vb = svg.viewBox.baseVal
  const scale = vb.width ? svgBox.width / vb.width : 1

  const texts = [...svg.querySelectorAll('text')].map((t) => {
    const b = t.getBoundingClientRect()
    return {
      text: (t.textContent || '').trim(),
      x: b.x - svgBox.x,
      y: b.y - svgBox.y,
      w: b.width,
      h: b.height,
      // authored size × scale = what the eye actually gets
      renderedFontPx: parseFloat(getComputedStyle(t).fontSize) * 1,
    }
  })

  // clipping: any text painted outside the svg's own box
  const clipped = texts.filter(
    (t) => t.x < -0.5 || t.y < -0.5 || t.x + t.w > svgBox.width + 0.5 || t.y + t.h > svgBox.height + 0.5,
  )

  // occlusion: pairwise overlap between distinct labels
  const overlaps = []
  for (let i = 0; i < texts.length; i++) {
    for (let j = i + 1; j < texts.length; j++) {
      const a = texts[i]
      const b = texts[j]
      const ix = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)
      const iy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)
      if (ix > 1 && iy > 1) {
        overlaps.push({ a: a.text, b: b.text, area: Math.round(ix * iy) })
      }
    }
  }

  const figBox = fig.getBoundingClientRect()
  const scroller = fig.querySelector('.overflow-x-auto')
  // Attribute honestly: the page may already overflow for reasons that have
  // nothing to do with this figure (PyArcana's header chrome does, at 320px).
  // What indicts a figure is its OWN frame sticking out of the column.
  const figureOverflow = Math.max(0, Math.round(figBox.right - window.innerWidth))

  return {
    present: true,
    kind: 'svg',
    scale: Number(scale.toFixed(3)),
    svgWidth: Math.round(svgBox.width),
    figureWidth: Math.round(figBox.width),
    // page overflow is recorded for context but never blamed on the figure
    pageOverflow: Math.max(0, Math.round(document.documentElement.scrollWidth - window.innerWidth)),
    figureOverflow,
    // does the figure scroll inside its own frame? (acceptable, by design)
    innerScroll: scroller ? Math.max(0, scroller.scrollWidth - scroller.clientWidth) : 0,
    smallestRenderedPx: texts.length
      ? Number(Math.min(...texts.map((t) => t.renderedFontPx * scale)).toFixed(1))
      : null,
    textCount: texts.length,
    clipped: clipped.map((t) => ({ text: t.text, x: Math.round(t.x), y: Math.round(t.y) })),
    overlaps,
  }
}

const report = { generated_at: new Date().toISOString(), base: BASE, findings: [], page_overflow_context: [], figures: {} }

const browser = await chromium.launch()
try {
  // Warm the route once so the first measured load is not a compile.
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } })
    const page = await ctx.newPage()
    await page.addInitScript(() => localStorage.setItem('pyarcana:tourCompleted', '1'))
    await page.goto(`${BASE}/#setup`, { waitUntil: 'domcontentloaded' })
    await page.waitForSelector('[data-testid="section-root"]', { timeout: 120000 })
    await ctx.close()
  }

  for (const [sectionId, figureId] of TARGETS) {
    report.figures[figureId] = {}
    for (const theme of THEMES) {
      for (const vp of VIEWPORTS) {
        const ctx = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          colorScheme: theme,
        })
        const page = await ctx.newPage()
        // Sections are hash-routed, and the first-run tour overlays the page —
        // same setup the existing regression suite uses.
        await page.addInitScript(() => {
          localStorage.setItem('pyarcana:tourCompleted', '1')
        })
        await page.goto(`${BASE}/#${sectionId}`, { waitUntil: 'domcontentloaded' })
        // A dev server compiles on demand; the first hit can take far longer
        // than a warm one, and that is not a figure defect.
        await page.waitForSelector('[data-testid="section-root"]', { timeout: 90000 })
        // theory is the default tab; give layout a beat to settle
        await page.waitForTimeout(600)
        const r = await page.evaluate(PROBE, figureId)
        const key = `${theme}/${vp.name}`
        report.figures[figureId][key] = r

        const where = `${figureId} @ ${key}`
        if (!r.present) report.findings.push(`${where}: figure not rendered`)
        else {
          if (r.clipped?.length) {
            report.findings.push(`${where}: ${r.clipped.length} label(s) clipped: ${r.clipped.map((c) => c.text).join(' | ')}`)
          }
          if (r.overlaps?.length) {
            report.findings.push(`${where}: ${r.overlaps.length} label overlap(s): ${r.overlaps.map((o) => `"${o.a}"~"${o.b}"`).join(', ')}`)
          }
          if (r.figureOverflow > 1) {
            report.findings.push(`${where}: the figure frame sticks ${r.figureOverflow}px past the column`)
          }
          if (r.pageOverflow > 1) {
            // Context, not a figure finding — recorded so it is not lost.
            report.page_overflow_context.push(`${where}: page already scrolls ${r.pageOverflow}px (chrome, not the figure)`)
          }
          // The SVG figures hold 11.5px at every viewport including the 320px
          // stress case, so exempting stress-320 lets a figure be illegible
          // exactly where legibility is hardest. Hold one floor everywhere.
          if (r.smallestRenderedPx !== null && r.smallestRenderedPx < 11) {
            report.findings.push(`${where}: smallest label renders at ${r.smallestRenderedPx}px (floor 11)`)
          }
        }
        await ctx.close()
      }
    }
  }
} finally {
  await browser.close()
}

report.ok = report.findings.length === 0
mkdirSync(OUT.split('/').slice(0, -1).join('/'), { recursive: true })
writeFileSync(OUT, JSON.stringify(report, null, 2))
console.log(JSON.stringify({ ok: report.ok, findings: report.findings, page_overflow_note: report.page_overflow_context.length ? `${report.page_overflow_context.length} view(s) had pre-existing page chrome overflow — see report` : 'none' }, null, 2))
process.exit(report.ok ? 0 : 1)
