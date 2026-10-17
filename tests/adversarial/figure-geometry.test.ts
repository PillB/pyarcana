/**
 * The arithmetic behind a figure, where a wrong answer is invisible.
 *
 * A figure that renders is not a figure that is right. The number-line archetype shipped with
 * `at < min(fences) || at > max(fences)`, which is correct for a pair and marks EVERY value
 * when there is one fence -- the single-fence picture is exactly the upper-fence-only habit
 * S16-T3-B-E2 is built around, so the first reuse would have drawn every value as an outlier.
 * Nothing in the render probe could see it: the figure paints, the labels fit, the contrast
 * passes, and the rings are simply wrong.
 *
 * The data gate below is the other half: points may sit outside the axis domain (they get a
 * bay past the axis break), but a fence or a band edge has no bay. The component clamps them
 * so they cannot be painted off the canvas, which makes the mistake invisible again -- so the
 * authored data has to be right, and that is what this asserts.
 */
import assert from 'node:assert/strict'
import test from 'node:test'

import { outsideFences } from '../../src/components/course/figures/archetypes/types'
import { FIGURE_DATA } from '../../src/components/course/figures/data'

test('no fences marks nothing', () => {
  assert.equal(outsideFences(5, undefined), false)
  assert.equal(outsideFences(5, []), false)
})

test('a pair of fences marks what lies beyond either of them', () => {
  const fences = [{ at: 6.5 }, { at: 16.5 }]
  assert.equal(outsideFences(-1, fences), true)
  assert.equal(outsideFences(5000, fences), true)
  assert.equal(outsideFences(10, fences), false)
  assert.equal(outsideFences(6.5, fences), false, 'a value on the fence is not beyond it')
  assert.equal(outsideFences(16.5, fences), false)
})

test('a lone fence marks only its own side', () => {
  const upper = [{ at: 16.5, side: 'upper' as const }]
  assert.equal(outsideFences(5000, upper), true)
  assert.equal(outsideFences(-1, upper), false, 'the low value is not beyond an upper fence')
  assert.equal(outsideFences(10, upper), false)

  const lower = [{ at: 6.5, side: 'lower' as const }]
  assert.equal(outsideFences(-1, lower), true)
  assert.equal(outsideFences(5000, lower), false)
})

test('a lone fence with no side marks nothing rather than everything', () => {
  const fences = [{ at: 16.5 }]
  for (const v of [-1, 10, 11, 12, 13, 5000]) {
    assert.equal(outsideFences(v, fences), false, `${v} must not be marked by a sideless fence`)
  }
})

test('every number-line fence and band edge lies inside its own axis', () => {
  const offAxis: string[] = []
  for (const [id, data] of Object.entries(FIGURE_DATA)) {
    if (data.kind !== 'numberline') continue
    const inAxis = (v: number) => v >= data.from && v <= data.to
    for (const f of data.fences ?? []) {
      if (!inAxis(f.at)) offAxis.push(`${id}: fence ${f.at} outside [${data.from}, ${data.to}]`)
    }
    if (data.band && (!inAxis(data.band.from) || !inAxis(data.band.to))) {
      offAxis.push(`${id}: band ${data.band.from}-${data.band.to} outside [${data.from}, ${data.to}]`)
    }
  }
  assert.deepEqual(offAxis, [], 'widen the axis domain: only points get the off-scale bay')
})

test('a number line with one fence declares its side', () => {
  const missing: string[] = []
  for (const [id, data] of Object.entries(FIGURE_DATA)) {
    if (data.kind !== 'numberline') continue
    const fences = data.fences ?? []
    if (fences.length === 1 && !fences[0].side) missing.push(id)
  }
  assert.deepEqual(missing, [], 'one fence needs side: "lower" | "upper" or nothing is marked')
})
