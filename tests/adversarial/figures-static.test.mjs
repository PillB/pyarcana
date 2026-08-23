/**
 * Review pass 1 — static checks on every teaching figure.
 *
 * The floor moved 13 -> 14 after measuring the rendered page: at the canvas
 * scale a 13px label lands at 10.7px on a phone, which is not a readable size.
 *
 * These are the properties that can be decided from source alone, so they are
 * decided here instead of by looking at screenshots: theme tokens rather than
 * literal colours (or the figure breaks in one theme), a viewBox (or it cannot
 * scale), an accessible name, and a type floor.
 *
 * The type floor is the important one. An SVG with width:100% scales its text
 * with the viewBox, so a label that looks fine at 560 renders at roughly 82 %
 * of its size once the frame hits FIG.minWidth. Anything authored below
 * FIG.microSize lands under ~11px on a phone.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync, readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const DIR = fileURLToPath(new URL('../../src/components/course/figures/', import.meta.url))
// index.tsx is the registry, not a figure.
const FIGURE_FILES = readdirSync(DIR).filter((f) => f.endsWith('.tsx') && f !== 'index.tsx')
const SHELL = readFileSync(
  fileURLToPath(new URL('../../src/components/course/Figure.tsx', import.meta.url)),
  'utf8',
)

// The canvas contract the shell declares; the probes below depend on it.
const CANVAS_WIDTH = 560
const MICRO_SIZE = 14

test('every figure file is registered', () => {
  const index = readFileSync(`${DIR}index.tsx`, 'utf8')
  for (const file of FIGURE_FILES) {
    const component = file.replace('.tsx', '')
    // Static `from './X'` or lazy `import('./X')` both count as registered.
    const registered =
      new RegExp(`from '\\./${component}'`).test(index) ||
      new RegExp(`import\\('\\./${component}'\\)`).test(index)
    assert.ok(registered, `${file} is not imported by the registry`)
  }
})

test('the heavy graph dependency is loaded on demand, not by every section', () => {
  // A static import here puts @xyflow/react in the bundle for all 52 sections
  // when one uses it, which measurably slowed first paint.
  const index = readFileSync(`${DIR}index.tsx`, 'utf8')
  assert.match(index, /dynamic\(/, 'the React Flow figure must be dynamically imported')
  assert.doesNotMatch(
    index,
    /^import \{ S31EvidenceGraph \}/m,
    'S31 must not be imported statically by the registry',
  )
})

/**
 * Two kinds of figure exist, and they need different checks rather than a
 * weakened shared one.
 *
 *   svg — drawn on the FIG canvas, scaled by a viewBox. Type floor and
 *         off-canvas geometry are the risks.
 *   dom — a React Flow div tree (nodes are divs, edges an SVG layer). It has no
 *         viewBox and no <text>, so the canvas checks are meaningless; what
 *         matters instead is a declared height, an accessible name, and
 *         Tailwind type at or above the floor.
 *
 * Both kinds keep the token rule, because that one is about theming, not shape.
 */
const kindOf = (src) => (src.includes('@xyflow/react') ? 'dom' : 'svg')

for (const file of FIGURE_FILES) {
  const src = readFileSync(`${DIR}${file}`, 'utf8')
  const kind = kindOf(src)

  test(`${file}: colours come from theme tokens, never literal hex`, () => {
    // A literal colour cannot follow the light/dark token swap, so one hex is
    // enough to make the figure unreadable in the other theme.
    const hex = src.match(/#[0-9a-fA-F]{3,8}\b/g) ?? []
    assert.deepEqual(hex, [], `literal colour(s) in ${file}: ${hex.join(', ')}`)
    const oklch = src.match(/oklch\(/g) ?? []
    assert.deepEqual(oklch, [], `raw oklch() in ${file}; use var(--token) instead`)
  })

  if (kind === 'svg') {
    test(`${file}: declares a viewBox on the shared canvas`, () => {
      assert.match(src, /viewBox=\{`0 0 \$\{FIG\.width\}/, `${file} must use the FIG.width canvas`)
    })

    test(`${file}: no type below the micro size`, () => {
      // Explicit numeric font sizes only; FIG.microSize / FIG.labelSize are safe
      // by construction because the shell defines them.
      const sizes = [...src.matchAll(/\bsize=\{(\d+(?:\.\d+)?)\}/g)].map((m) => Number(m[1]))
      const tooSmall = sizes.filter((s) => s < MICRO_SIZE)
      assert.deepEqual(
        tooSmall,
        [],
        `${file} has type below ${MICRO_SIZE}px: ${tooSmall.join(', ')} — unreadable once scaled to a phone`,
      )
    })

    test(`${file}: nothing is drawn outside the canvas`, () => {
      // Catches the arithmetic slip that puts a box at x=422 with width=140 on a
      // 560 canvas. Only literal-number FigBox calls can be checked statically;
      // computed ones are covered by the rendered pass.
      const boxes = [...src.matchAll(/x=\{(\d+)\}\s+y=\{[^}]+\}\s+w=\{(\d+)\}/g)]
      for (const [, x, w] of boxes) {
        const right = Number(x) + Number(w)
        assert.ok(
          right <= CANVAS_WIDTH,
          `${file}: a box ends at x=${right}, past the ${CANVAS_WIDTH} canvas`,
        )
      }
    })
  } else {
    test(`${file}: no Tailwind type below the micro size inside the diagram`, () => {
      // Same floor, different mechanism: a div tree sizes text in CSS, not in
      // viewBox units, so the arbitrary-value classes are what to check.
      //
      // Scope matters. The floor exists because figure labels are small and
      // dense; it applies to what is drawn *inside* the diagram — the nodes and
      // edge labels. Prose rendered beside the figure (its explanation panel,
      // its instruction line) is ordinary page copy and follows the site scale,
      // the same 13px the shell uses for every figcaption. Holding that to the
      // diagram floor would create a two-tier rule for identical text.
      const nodeStart = src.indexOf('function EntityNode')
      const nodeEnd = src.indexOf('const NODE_TYPES')
      assert.ok(nodeStart > -1 && nodeEnd > nodeStart, 'expected a node component to scope to')
      const inDiagram =
        src.slice(nodeStart, nodeEnd) +
        (src.match(/labelStyle:\s*\{[^}]*\}/g) ?? []).join(' ')
      const sizes = [
        ...[...inDiagram.matchAll(/text-\[(\d+)px\]/g)].map((m) => Number(m[1])),
        ...[...inDiagram.matchAll(/fontSize:\s*(\d+)/g)].map((m) => Number(m[1])),
      ]
      const tooSmall = sizes.filter((s) => s < MICRO_SIZE)
      assert.deepEqual(tooSmall, [], `${file} draws type below ${MICRO_SIZE}px: ${tooSmall.join(', ')}`)
      assert.ok(sizes.length > 0, 'expected to find sized text inside the diagram')
    })

    test(`${file}: declares a height and an accessible name`, () => {
      // React Flow collapses to zero height without an explicit one, and its
      // nodes are divs, so the figure needs a name of its own.
      assert.match(src, /height:\s*\d+/, `${file}: React Flow needs an explicit container height`)
      assert.match(src, /role="img"/, `${file}: the graph needs an accessible role`)
      assert.match(src, /aria-label=\{title\}/, `${file}: the graph needs an accessible name`)
    })

    test(`${file}: follows the viewer's theme`, () => {
      assert.match(src, /colorMode=/, `${file}: React Flow needs colorMode wired to the theme`)
    })
  }
}

test('the shell wires accessibility for all figures at once', () => {
  assert.match(SHELL, /role="img"/, 'figures need role="img"')
  assert.match(SHELL, /<title>\{title\}<\/title>/, 'figures need an SVG <title>')
  assert.match(SHELL, /className="sr-only"/, 'the long description must reach screen readers')
  assert.match(SHELL, /overflow-x-auto/, 'a figure wider than the column must scroll, not clip the page')
  assert.match(SHELL, /minWidth: FIG\.minWidth/, 'the type floor depends on a rendered min-width')
})

/**
 * Framer Motion writes animated SVG attributes on first paint. If a length
 * attribute (cx, y, …) exists only inside `animate={{ }}` and not as a static
 * JSX prop, the first frame — including SSR — emits `cx="undefined"`. The
 * browser then logs:
 *
 *   Error: <circle> attribute cx: Expected length, "undefined".
 *
 * `scripts/regression.spec.ts` fails the 52-section walk on any console error.
 * CI job "Browser Regression" failed on S03 (`data-structures`) for exactly
 * this: the token `motion.circle` animated `cx` with no static `cx={...}`.
 * S04 had the same pattern on `y`. Opacity/scale are not SVG length attrs
 * and do not produce that error.
 */
test('motion SVG length attributes are not left to animate from undefined', () => {
  const LENGTH_ATTRS = new Set([
    'cx',
    'cy',
    'r',
    'x',
    'y',
    'width',
    'height',
    'x1',
    'y1',
    'x2',
    'y2',
    'rx',
    'ry',
  ])
  const offenders = []
  for (const file of FIGURE_FILES) {
    const src = readFileSync(`${DIR}${file}`, 'utf8')
    const blocks = src.match(/<motion\.(?:circle|rect|ellipse|line|path)\b[\s\S]*?\/>/g) ?? []
    for (const block of blocks) {
      const animate = block.match(/animate=\{\{([^}]+)\}\}/)
      if (!animate) continue
      const keys = [...animate[1].matchAll(/\b([A-Za-z][\w]*)\s*:/g)].map((m) => m[1])
      for (const key of keys) {
        if (!LENGTH_ATTRS.has(key)) continue
        const hasStatic = new RegExp(`\\b${key}=\\{`).test(block)
        if (!hasStatic) {
          offenders.push(`${file}: animates ${key} without a static ${key}={...}`)
        }
      }
    }
  }
  assert.deepEqual(offenders, [], offenders.join('; '))
})
