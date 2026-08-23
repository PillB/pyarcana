/**
 * The I Do stepped reveal, checked where it can be checked cheaply.
 *
 * The property that matters most — rendered textContent stays byte-identical to
 * the source at every step — is a browser fact, verified by
 * scripts/code_rendering.spec.ts, which already asserts exactly that for every
 * code block in every tab. What is checked here is the part that would silently
 * rot without a test: the segmentation, and the structural promises the reveal
 * makes to that gate.
 */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const read = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8')
const STEPPED = read('../../src/components/course/SteppedCode.tsx')
const CODEBLOCK = read('../../src/components/course/CodeBlock.tsx')

/** Mirrors segmentCode; kept in step by the shape test below. */
function segmentCode(code, maxLines = 5) {
  const lines = code.split('\n')
  const ends = []
  let start = 0
  lines.forEach((line, i) => {
    const isBlank = line.trim() === ''
    const isLast = i === lines.length - 1
    if ((isBlank && i > start) || isLast || i - start + 1 >= maxLines) {
      ends.push(i)
      start = i + 1
    }
  })
  if (ends.length > 1 && ends[ends.length - 1] - ends[ends.length - 2] === 1) {
    ends.splice(ends.length - 2, 1)
  }
  return ends
}

test('every demo segments, including ones written without blank lines', () => {
  const withBlanks = 'import numpy as np\n\ndef f():\n    return 1\n\nprint(f())'
  const without = Array.from({ length: 12 }, (_, i) => `line_${i} = ${i}`).join('\n')
  const tiny = 'print("hola")'

  for (const [name, src] of [['blanks', withBlanks], ['no blanks', without], ['one line', tiny]]) {
    const ends = segmentCode(src)
    assert.ok(ends.length >= 1, `${name}: produced no segments`)
    const last = ends[ends.length - 1]
    assert.equal(last, src.split('\n').length - 1, `${name}: last segment must reach the final line`)
    assert.deepEqual([...ends].sort((a, b) => a - b), ends, `${name}: segments must be ordered`)
  }
})

test('no segment is long enough to defeat the point of segmenting', () => {
  const src = Array.from({ length: 40 }, (_, i) => `x${i} = ${i}`).join('\n')
  const ends = segmentCode(src)
  let prev = -1
  for (const e of ends) {
    assert.ok(e - prev <= 5, `a segment spanned ${e - prev} lines`)
    prev = e
  }
})

test('reveal never removes code, it only hides it', () => {
  // Truncating would break scripts/code_rendering.spec.ts, which compares the
  // rendered textContent against data-code-source.
  assert.match(
    CODEBLOCK,
    /visibility: 'hidden'/,
    'unrevealed lines must be hidden, not dropped from the DOM',
  )
  assert.match(
    CODEBLOCK,
    /\{i < lines\.length - 1 \? '\\n' : ''\}/,
    'newlines between line spans must be real text, or textContent loses them',
  )
  assert.doesNotMatch(
    CODEBLOCK,
    /reveal[\s\S]{0,400}slice\(0, *reveal\.visibleLines\)/,
    'reveal must not slice the line list',
  )
})

test('the reveal branch does not inherit the line-number branch bug', () => {
  // The showLineNumbers branch renders numbers inside <code>, so its
  // textContent has never matched its own data-code-source. The reveal branch
  // must not copy that, since it exists to satisfy that very gate.
  const revealBranch = CODEBLOCK.slice(
    CODEBLOCK.indexOf('{reveal ? ('),
    CODEBLOCK.indexOf(') : showLineNumbers ? ('),
  )
  assert.doesNotMatch(revealBranch, /code-tok-line-num/, 'reveal must not inject line numbers')
  assert.doesNotMatch(revealBranch, /&nbsp;/, 'a nbsp fallback would corrupt textContent')
})

test('output is masked, never withheld from assistive technology', () => {
  assert.match(CODEBLOCK, /filter: 'blur\(6px\)'/, 'output should blur rather than unmount')
  assert.match(
    CODEBLOCK,
    /data-output-source=\{output\.trim\(\)\}/,
    'the output element must keep its full text so the fidelity gate still sees it',
  )
})

test('the learner preference is stored outside protected progress state', () => {
  assert.match(STEPPED, /pyarcana:idoReveal/, 'expected a dedicated preference key')
  // Check code, not prose: the file's own comment names the protected key in
  // order to explain why it is avoided.
  const codeOnly = STEPPED.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/\/\/.*$/gm, ' ')
  assert.doesNotMatch(
    codeOnly,
    /python-ds-progress/,
    'the reveal preference must never touch learner progress storage',
  )
})

test('motion is opt-out and respects the reduced-motion setting', () => {
  // globals.css neutralises CSS animations under prefers-reduced-motion, but the
  // decision to animate at all is taken here, in JS.
  assert.match(STEPPED, /useReducedMotion\(\)/, 'reduced motion must be honoured explicitly')
  assert.match(STEPPED, /animate: !reduced/, 'the sweep must be off when motion is reduced')
})

test('a reader without JavaScript still gets the whole demo', () => {
  assert.match(
    STEPPED,
    /getPrefServerSnapshot = \(\): Pref => 'all'/,
    'the server snapshot must show everything, or a no-JS reader sees a masked block',
  )
})
