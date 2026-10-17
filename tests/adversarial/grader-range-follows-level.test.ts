/**
 * G-8 (the grader part): the integrator section of a level names that level's section range.
 *
 * S39 (slug `integrator-phase2`) is the grader of the third level. Its learner prose and its gate
 * token name the range the level covers: "regresión S27–S39", "regression_S27_S39". That range is
 * the level's phase span, derived from the bindings, so the catalogue's level bands (G-8) and this
 * prose cannot disagree. The renumber moves the range to S29–S42; a range left at S27–S39 is named
 * line by line. The text is Codex-written, so the guard names the stale range and does not write it.
 *
 * The section is found by its slug, not its file name, because the renumber moves the file.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { readBindings } from '../../scripts/course_bindings.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..')
const GRADER_SLUG = 'integrator-phase2'

/** A range token: `S27–S39`, `S27-S39` or the gate token's `S27_S39`, not preceded by a letter or digit. */
const RANGE = /(?<![A-Za-z0-9])S(\d{2})([–_-])S(\d{2})(?![0-9])/g
const pad = (n: number): string => `S${String(n).padStart(2, '0')}`

/** The first and last section numbers of the level a grader closes. */
export function levelNumbers(bindings: readonly { number: number; phase: number }[], phase: number): [number, number] {
  const members = bindings.filter((b) => b.phase === phase).map((b) => b.number)
  return [Math.min(...members), Math.max(...members)]
}

/** One line per range token that does not name the level, with its line number. */
export function graderFailures(text: string, [first, last]: readonly [number, number]): string[] {
  const out: string[] = []
  text.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(RANGE)) {
      if (Number(m[1]) !== first || Number(m[3]) !== last) {
        out.push(`line ${i + 1}: '${m[0]}' is not the level's range ${pad(first)}–${pad(last)}`)
      }
    }
  })
  return out
}

function graderText(): { text: string; bindings: ReturnType<typeof readBindings> } {
  const bindings = readBindings(ROOT)
  const grader = bindings.find((b) => b.id === GRADER_SLUG)
  if (!grader) throw new Error(`no bound section has the slug ${GRADER_SLUG}`)
  const text = fs.readFileSync(path.join(ROOT, 'src/lib/course/sections', `${grader.stem}.ts`), 'utf-8')
  return { text, bindings }
}

describe('G-8 grader range on the real tree', () => {
  it('every range the grader names is its level, and it names at least one', () => {
    const { text, bindings } = graderText()
    const grader = bindings.find((b) => b.id === GRADER_SLUG)
    const span = levelNumbers(bindings, grader.phase)
    assert.ok([...text.matchAll(RANGE)].length >= 1, 'the grader names no range: the check would pass on nothing')
    assert.deepEqual(graderFailures(text, span), [])
  })
})

describe('G-8 recreations on the grader text', () => {
  it('a range left at the old level span is named, line by line', () => {
    const text = "const tagline = 'regresión S27–S39 y CF-3'\nconst gate = 'regression_S27_S39'\n"
    assert.deepEqual(graderFailures(text, [27, 39]), [])
    assert.deepEqual(graderFailures(text, [29, 42]), [
      "line 1: 'S27–S39' is not the level's range S29–S42",
      "line 2: 'S27_S39' is not the level's range S29–S42",
    ])
  })

  it('the gate token with the underscore separator is checked as well', () => {
    assert.deepEqual(graderFailures("'regression_S29_S42'", [27, 39]), [
      "line 1: 'S29_S42' is not the level's range S27–S39",
    ])
  })

  it('a number inside a longer token is not read as a range', () => {
    assert.deepEqual(graderFailures('S39-T1-A and CP-N3-C and S2027–S3039', [27, 39]), [])
  })

  it('the level of the grader is derived from its phase: the grader of phase 2 closes S27 to S39', () => {
    const bindings = [
      { number: 27, phase: 2 },
      { number: 28, phase: 2 },
      { number: 39, phase: 2 },
      { number: 40, phase: 3 },
    ]
    assert.deepEqual(levelNumbers(bindings, 2), [27, 39])
  })
})
