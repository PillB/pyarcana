import assert from 'node:assert/strict'
import { test } from 'node:test'
import { complexityRegressions, complexityDebtReduced } from '../../scripts/lib/complexity_policy.mjs'

const baseline = [
  { key: 'old.ts::Function:one#0', score: 17 },
  { key: 'old.ts::Function:two#0', score: 78 },
]

test('a new complexity-20 function fails even if another offender disappears', () => {
  const now = [
    { key: 'old.ts::Function:two#0', score: 78 },
    { key: 'new.ts::Function:newCode#0', score: 20 },
  ]
  assert.deepEqual(complexityRegressions(baseline, now, 15).map((o) => o.key),
    ['new.ts::Function:newCode#0'])
})

test('an existing offender getting worse fails; unchanged and reduced debt pass', () => {
  assert.deepEqual(complexityRegressions(baseline, [
    { key: 'old.ts::Function:one#0', score: 20 },
    { key: 'old.ts::Function:two#0', score: 78 },
  ], 15).map((o) => o.score), [20])
  assert.deepEqual(complexityRegressions(baseline, baseline, 15), [])
  assert.equal(complexityDebtReduced(baseline, [{ key: 'old.ts::Function:two#0', score: 78 }]), true)
  assert.deepEqual(complexityRegressions(baseline, [
    ...baseline, { key: 'new.ts::Function:simple#0', score: 15 },
  ], 15), [])
})

test('missing or duplicate function baseline fails closed', () => {
  assert.throws(() => complexityRegressions(undefined, baseline, 15), /Missing/)
  assert.throws(() => complexityRegressions([baseline[0], baseline[0]], baseline, 15), /Duplicate/)
})
