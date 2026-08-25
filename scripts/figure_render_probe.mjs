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
import { writeFileSync, mkdirSync, readFileSync, readdirSync } from 'node:fs'

const args = Object.fromEntries(
  process.argv.slice(2).flatMap((a, i, arr) => (a.startsWith('--') ? [[a.slice(2), arr[i + 1]]] : [])),
)
const BASE = args['base-url'] ?? 'http://localhost:3000'
const OUT = args.out ?? 'course-state/figure_render_report.json'

/** section id -> figure id, mirroring the registry. */
/**
 * section id -> figure id, read from the content rather than hardcoded.
 *
 * This was a literal fifteen-row array. At ninety-two figures a hand-kept list
 * rots on the first commit that adds one, and a probe that silently stops
 * covering a figure is worse than no probe -- the whole reason this file exists
 * is that the previous gate reported clean on a figure it never measured.
 */
const TARGETS = (() => {
  const dir = 'src/lib/course/sections'
  const rows = []
  for (const file of readdirSync(dir).filter((f) => f.endsWith('.ts')).sort()) {
    const src = readFileSync(`${dir}/${file}`, 'utf8')
    const sec = src.match(/\n\s*id:\s*["']([^"']+)["']/)
    if (!sec) continue
    for (const m of src.matchAll(/figure:\s*\{\s*\n?\s*id:\s*["']([^"']+)["']/g)) {
      rows.push([sec[1], m[1]])
    }
  }
  return rows
})()

/**
 * --sections S03,S14 restricts the run to those sections.
 *
 * A full pass is ~312 page loads. Verifying one fix should not cost that, and
 * paying it every time is how a probe quietly stops being run at all. The
 * filter narrows the run; it never widens it, and CI passes no flag, so the
 * committed gate is always the whole set.
 */
const ONLY = args.sections
  ? new Set(args.sections.split(',').map((s) => s.trim().toLowerCase()).filter(Boolean))
  : null
const SELECTED = ONLY
  ? TARGETS.filter(([sec, fig]) => {
      const s = sec.toLowerCase()
      const f = fig.toLowerCase()
      // Sections are slugs ("data-structures") but figure ids carry the S-number
      // ("s03-tri-state"), and S03 is what anyone reading a finding will type.
      // Accept the slug, the exact figure id, or an S-number prefix of one.
      return [...ONLY].some((t) => s === t || f === t || f.startsWith(`${t}-`))
    })
  : TARGETS
if (ONLY && SELECTED.length === 0) {
  console.error(`--sections matched nothing. Known sections: ${[...new Set(TARGETS.map((t) => t[0]))].join(', ')}`)
  process.exit(2)
}


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
      // The wrapper's font-size is inherited and is not what the label uses:
      // this graph sets text-[14px] on descendant divs. Reading the wrapper
      // measures a size no reader ever sees, so take the smallest size among
      // the elements that actually hold text.
      const textEls = [...n.querySelectorAll('*')].filter(
        (el) => el.children.length === 0 && (el.textContent ?? '').trim().length > 0,
      )
      const sizes = (textEls.length ? textEls : [n]).map((el) =>
        parseFloat(getComputedStyle(el).fontSize),
      )
      return {
        label: (n.textContent ?? '').trim().slice(0, 40),
        x: b.left, y: b.top, w: b.width, h: b.height,
        right: b.right, bottom: b.bottom,
        px: Math.round(Math.min(...sizes) * flowScale * 10) / 10,
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
    // Counting them was not checking them: a clipped or overlapping edge label
    // left findings empty, which is the same blind spot in a smaller place.
    const edgeBoxes = [...fig.querySelectorAll('.react-flow__edge-textwrapper, .react-flow__edge-text')]
      .map((e) => {
        const b = e.getBoundingClientRect()
        return {
          label: (e.textContent ?? '').trim().slice(0, 40) || '(edge)',
          x: b.left, y: b.top, right: b.right, bottom: b.bottom,
          px: parseFloat(getComputedStyle(e).fontSize) * flowScale,
        }
      })
      .filter((e) => e.right > e.x && e.bottom > e.y)
    const edgeLabels = edgeBoxes.length

    for (const e of edgeBoxes) {
      if (e.x < paneBox.left - 1 || e.right > paneBox.right + 1 ||
          e.y < paneBox.top - 1 || e.bottom > paneBox.bottom + 1) {
        clipped.push(e.label)
      }
      for (const n of nodes) {
        const ox = Math.min(e.right, n.right) - Math.max(e.x, n.x)
        const oy = Math.min(e.bottom, n.bottom) - Math.max(e.y, n.y)
        if (ox > 1 && oy > 1) overlaps.push({ a: e.label, b: n.label, px: Math.round(ox * oy) })
      }
    }

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
      smallestRenderedPx: (() => {
        const all = [...nodes.map((n) => n.px), ...edgeBoxes.map((e) => e.px)].filter(Number.isFinite)
        return all.length ? Math.round(Math.min(...all) * 10) / 10 : null
      })(),
    }
  }

  // ---- contrast, measured on what is painted ----------------------------
  //
  // The a11y gate in test:ux-gates checks page colours and never looks inside
  // an <svg>, so a figure can hold text at 1.8:1 and every gate stays green.
  //
  // The first version of this block parsed colours with a /rgba?\(/ regex. This
  // theme is authored in oklch, and the figure frame's own background comes
  // back as oklab(... / 0.4), so every element failed to parse, every element
  // was skipped, and the check reported zero low-contrast elements while
  // measuring none of them. That is the fifth time in this campaign a gate has
  // reported clean without looking, and the first one I built myself.
  //
  // So the browser does the conversion: paint the colour onto a 1x1 canvas and
  // read the bytes back. That works for any colour space the browser accepts,
  // including whatever the theme is rewritten in next.
  const _cv = document.createElement('canvas')
  _cv.width = 1
  _cv.height = 1
  const _cx = _cv.getContext('2d', { willReadFrequently: true })
  const toRGBA = (css) => {
    if (!css || css === 'none' || css === 'transparent') return null
    _cx.clearRect(0, 0, 1, 1)
    _cx.fillStyle = '#000'
    _cx.fillStyle = css
    // An unparseable value leaves fillStyle at the previous colour; if the
    // browser did not accept it, treat it as unknown rather than as black.
    if (_cx.fillStyle === '#000000' && !/^(#000000|black|rgb\(0, ?0, ?0\))$/i.test(css.trim())) {
      return null
    }
    _cx.fillRect(0, 0, 1, 1)
    const d = _cx.getImageData(0, 0, 1, 1).data
    return { r: d[0], g: d[1], b: d[2], a: d[3] / 255 }
  }
  const over = (fg, bg) => ({
    r: fg.r * fg.a + bg.r * (1 - fg.a),
    g: fg.g * fg.a + bg.g * (1 - fg.a),
    b: fg.b * fg.a + bg.b * (1 - fg.a),
    a: 1,
  })
  const lum = (c) => {
    const f = (v) => {
      const x = v / 255
      return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)
    }
    return 0.2126 * f(c.r) + 0.7152 * f(c.g) + 0.0722 * f(c.b)
  }
  const ratio = (a, b) => {
    const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p)
    return (x + 0.05) / (y + 0.05)
  }

  // What is actually behind the figure: composite every translucent ancestor
  // background down onto the first opaque one. The figure frame itself is
  // painted at 40% alpha, so the naive "parent background" is not the answer.
  const behind = (() => {
    const stack = []
    let el = fig
    while (el) {
      const c = toRGBA(getComputedStyle(el).backgroundColor)
      if (c && c.a > 0) {
        stack.push(c)
        if (c.a >= 0.99) break
      }
      el = el.parentElement
    }
    let base = { r: 255, g: 255, b: 255, a: 1 }
    for (let i = stack.length - 1; i >= 0; i -= 1) base = over(stack[i], base)
    return base
  })()

  const lowContrast = []
  for (const el of svg.querySelectorAll('text, rect, line, circle, path')) {
    const cs = getComputedStyle(el)
    const isText = el.tagName.toLowerCase() === 'text'
    // For a shape, what the reader relies on is its BORDER, not its fill.
    // WCAG 1.4.11 covers the parts of a graphic needed to understand it; a card
    // background sitting a shade off the page is a surface, not information,
    // and measuring it flags every panel in the set at ~1.05:1. Measure the
    // stroke, which is what actually delineates the box, and fall back to the
    // fill only when the shape is filled with a tint that carries meaning
    // (a translucent chart colour) rather than a surface colour.
    const strokeC = isText ? null : toRGBA(cs.stroke)
    const fillOpAttr = el.getAttribute('fill-opacity')
    const tintedFill = !isText && fillOpAttr !== null && parseFloat(fillOpAttr) < 1
    const useStroke = !isText && strokeC !== null && !tintedFill
    const raw = isText ? toRGBA(cs.fill) : useStroke ? strokeC : tintedFill ? toRGBA(cs.fill) : null
    if (!raw) continue
    const opAttr = el.getAttribute(useStroke ? 'stroke-opacity' : 'fill-opacity')
    const op =
      (opAttr !== null ? parseFloat(opAttr) : parseFloat((useStroke ? cs.strokeOpacity : cs.fillOpacity) || '1')) *
      parseFloat(cs.opacity || '1')
    if (!Number.isFinite(op) || op <= 0.02) continue
    // A stepped figure dims what has not been revealed yet -- that is the
    // animation doing its job, not a styling defect. Measuring the resting
    // state flagged S03's "reject" and "accept" at 2.4:1 when both are at full
    // contrast the moment the learner steps to them. Skip element-level
    // opacity below 1; the colour itself is still checked at full strength.
    // Opacity composites down the tree but does not inherit as a computed
    // value, so a <text> inside a dimmed <g> still reports opacity 1. Checking
    // only the element let S03's stepped labels through as 2.4:1 defects when
    // they are simply not revealed yet. Walk up to the svg.
    let effectiveOpacity = 1
    for (let node = el; node && node !== svg; node = node.parentElement) {
      effectiveOpacity *= parseFloat(getComputedStyle(node).opacity || '1')
    }
    if (effectiveOpacity < 0.95) continue
    // What a label sits ON is often a filled shape, not the page. Measuring
    // reversed-out text against the page backdrop reported S07's accent glyph
    // at 1.02:1 -- white on white -- when it is actually white on a dark box.
    // SVG has no z-order query, so find the smallest painted rect in the same
    // group that geometrically contains this element.
    let backdrop = behind
    if (isText) {
      const tb = el.getBoundingClientRect()
      let best = null
      let bestArea = Infinity
      for (const cand of (el.parentElement ?? svg).querySelectorAll('rect')) {
        const cs2 = getComputedStyle(cand)
        const cf = toRGBA(cs2.fill)
        if (!cf) continue
        const cOp = parseFloat(cand.getAttribute('fill-opacity') ?? cs2.fillOpacity ?? '1')
        if (!Number.isFinite(cOp) || cOp < 0.5) continue
        const cb = cand.getBoundingClientRect()
        if (cb.left > tb.left + 1 || cb.right < tb.right - 1) continue
        if (cb.top > tb.top + 1 || cb.bottom < tb.bottom - 1) continue
        const area = cb.width * cb.height
        if (area < bestArea) {
          bestArea = area
          best = over({ ...cf, a: cf.a * cOp }, behind)
        }
      }
      if (best) backdrop = best
    }
    const painted = over({ ...raw, a: raw.a * op }, backdrop)
    const r = ratio(painted, backdrop)
    // WCAG 2.2: 4.5 for body text; 3.0 for large text, interface components and
    // graphics that carry meaning. Figure labels are 14-15px, so body text.
    const floor = isText ? 4.5 : 3.0
    if (r < floor) {
      lowContrast.push({
        tag: el.tagName.toLowerCase() + (useStroke ? ':stroke' : tintedFill ? ':tint' : ''),
        text: isText ? (el.textContent ?? '').trim().slice(0, 32) : '',
        ratio: Math.round(r * 100) / 100,
        floor,
      })
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
    lowContrast,
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

  // Grouped by section, and by (theme, viewport) inside that.
  //
  // The loop used to open a fresh browser context and reload the page for every
  // figure at every viewport in every theme. With one figure per section that
  // was 6 loads each; at two per section it silently doubled the work for no
  // extra coverage, because both figures are on the same page. Ninety-two
  // figures that way is 552 loads and the probe stops being runnable.
  const bySection = new Map()
  for (const [sectionId, figureId] of SELECTED) {
    if (!bySection.has(sectionId)) bySection.set(sectionId, [])
    bySection.get(sectionId).push(figureId)
  }

  for (const [sectionId, figureIds] of bySection) {
    for (const figureId of figureIds) report.figures[figureId] = {}
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
        const key = `${theme}/${vp.name}`
        for (const figureId of figureIds) {
        const r = await page.evaluate(PROBE, figureId)
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
          if (r.lowContrast?.length) {
            const worst = r.lowContrast.slice().sort((a, b) => a.ratio - b.ratio).slice(0, 3)
            report.findings.push(
              `${where}: ${r.lowContrast.length} element(s) below contrast floor: ` +
                worst.map((c) => `${c.tag}${c.text ? ` "${c.text}"` : ''} ${c.ratio}:1 < ${c.floor}`).join(', '),
            )
          }
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
