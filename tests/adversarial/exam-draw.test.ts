/**
 * Contract: exam/start's shuffle reaches every order of a question's options, each equally often.
 *
 * Owner decision O20 (2026-10-07): options are shuffled per attempt. 31 banks keep every key at
 * option B, so a stored-order exam is passed by answering B throughout. A shuffle that is not
 * uniform only moves the cue: Sattolo's variant never leaves an option where it was, and the
 * "naive" swap with any position makes some orders likelier than others.
 *
 * Two proofs. The exact one walks every sequence of values the RNG could return, for n = 1..6:
 * every run must ask for the bounds n, n-1, ..., 2 (so each sequence has probability 1/n! under a
 * uniform RNG), and the n! sequences must give n! distinct permutations. Together: uniform. The
 * statistical one runs presentQuestion with the real secureRandomInt and checks where a key stored
 * at B ends up.
 *
 * Run: node --import tsx --test tests/adversarial/exam-draw.test.ts
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import type { QuestionBank } from '@prisma/client'

import { drawOnePerConcept, presentQuestion, shuffledOrder } from '../../src/lib/exam-draw.ts'
import { secureRandomInt } from '../../src/lib/exam-rng.ts'

type Rng = (bound: number) => number
type Run = { bounds: number[]; result: number[] }

/** Runs past this mean the code under test asks for far more randomness than a shuffle needs. */
const MAX_RUNS = 1_000_000

/**
 * Every run `draw` can make, one per sequence of values the RNG could return: a depth-first walk
 * over its calls that branches on each value the requested bound allows. Records the bounds each
 * run asked for and what it returned.
 */
function everyRun(draw: (rng: Rng) => number[]): Run[] {
  const runs: Run[] = []
  let prefix: number[] = []
  for (;;) {
    const bounds: number[] = []
    const rng: Rng = (bound) => {
      if (!Number.isInteger(bound) || bound < 1) throw new Error(`rng asked for bound ${bound}`)
      const value = prefix[bounds.length] ?? 0
      bounds.push(bound)
      return value
    }
    runs.push({ bounds, result: draw(rng) })
    if (runs.length > MAX_RUNS) throw new Error(`more than ${MAX_RUNS} runs`)
    // Advance like an odometer: the last call that still has a larger value left.
    const values = bounds.map((_, k) => prefix[k] ?? 0)
    let k = bounds.length - 1
    while (k >= 0 && values[k] === bounds[k]! - 1) k--
    if (k < 0) return runs
    prefix = [...values.slice(0, k), values[k]! + 1]
  }
}

const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1))
const isPermutation = (order: number[], n: number) =>
  order.length === n && [...order].sort((a, b) => a - b).every((v, i) => v === i)

describe('shuffledOrder: exact, over every sequence the RNG could return', () => {
  for (let n = 1; n <= 6; n++) {
    const runs = everyRun((rng) => shuffledOrder(n, rng))
    const expected = Array.from({ length: n - 1 }, (_, k) => n - k)

    it(`n = ${n}: every run asks for the bounds [${expected.join(', ')}]`, () => {
      for (const run of runs) assert.deepEqual(run.bounds, expected)
    })

    it(`n = ${n}: the ${factorial(n)} sequences give the ${factorial(n)} permutations, once each`, () => {
      assert.equal(runs.length, factorial(n), 'sequences')
      for (const run of runs) assert.ok(isPermutation(run.result, n), `not a permutation: ${run.result}`)
      assert.equal(new Set(runs.map((r) => r.result.join())).size, factorial(n), 'distinct permutations')
    })
  }
})

describe('presentQuestion: a 4-option question with its key stored at B', () => {
  const row = {
    id: 'q', concept: 'c', variant: 1, question: '¿?', correctIndex: 1, explanation: '',
    options: JSON.stringify(['w', 'KEY', 'y', 'z']),
  }

  it('reaches each of the 24 orders through one run each, the key moving with its text', () => {
    const runs = everyRun((rng) => {
      const item = presentQuestion(row, rng)
      assert.equal(item.options[item.correctIndex], 'KEY')
      return item.optionOrder!
    })
    for (const run of runs) assert.deepEqual(run.bounds, [4, 3, 2])
    assert.equal(runs.length, 24)
    assert.equal(new Set(runs.map((r) => r.result.join())).size, 24)
  })

  it('moves the key to each displayed position equally often with the real secureRandomInt (chi-square, 3 df)', () => {
    const SHUFFLES = 40_000
    const counts = [0, 0, 0, 0]
    let keyLost = 0
    for (let t = 0; t < SHUFFLES; t++) {
      const item = presentQuestion(row, secureRandomInt)
      if (item.options[item.correctIndex] !== 'KEY') keyLost += 1
      counts[item.correctIndex]! += 1
    }
    assert.equal(keyLost, 0)
    const expected = SHUFFLES / 4
    const chiSquare = counts.reduce((sum, c) => sum + (c - expected) ** 2 / expected, 0)
    // 30.66 is the 3-df critical value at alpha 1e-6: a uniform shuffle fails one run in a
    // million. Stored order puts all 40,000 at B, which scores 120,000.
    assert.ok(chiSquare < 30.66, `chi-square ${chiSquare.toFixed(2)} over positions ${counts.join(', ')}`)
  })
})

describe('drawOnePerConcept takes its randomness from the rng it is given', () => {
  /** Two concepts with three variants each, as in a section bank. */
  const bank: QuestionBank[] = ['a', 'b'].flatMap((concept) =>
    [1, 2, 3].map((variant) => ({
      id: `${concept}${variant}`, sectionId: 's', concept, variant, question: `${concept}${variant}?`,
      options: '["x","y"]', correctIndex: 0, explanation: '', createdAt: new Date(0),
    })))

  it('asks it for each concept variant, then for the question order', () => {
    const bounds: number[] = []
    const rng: Rng = (bound) => {
      bounds.push(bound)
      return bound - 1
    }
    const { selectedQuestions, variantSeed } = drawOnePerConcept(bank, [], new Set(), rng)
    // A variant from each concept's three, then one Fisher-Yates step over the two questions.
    assert.deepEqual(bounds, [3, 3, 2])
    // The last of each concept's variants; the swap with itself leaves b after a.
    assert.deepEqual(selectedQuestions.map((q) => q.id), ['a3', 'b3'])
    assert.deepEqual(variantSeed.map((s) => s.questionId), ['a3', 'b3'])
  })

  it('skips variants an earlier attempt drew, as recorded in its variantSeed', () => {
    const earlier = [{ variantSeed: JSON.stringify([{ concept: 'a', variant: 3 }, { concept: 'b', variant: 1 }]) }]
    const bounds: number[] = []
    const { selectedQuestions } = drawOnePerConcept(bank, earlier, new Set(), (bound) => {
      bounds.push(bound)
      return 0
    })
    // Two variants left per concept; rng 0 takes the first left, then swaps the two questions.
    assert.deepEqual(bounds, [2, 2, 2])
    assert.deepEqual(selectedQuestions.map((q) => q.id), ['b2', 'a1'])
  })
})
