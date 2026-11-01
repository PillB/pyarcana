import assert from 'node:assert/strict'
import { test } from 'node:test'
import { anonymousFunctionFingerprint } from '../../scripts/lib/function_identity.mjs'
import { complexityRegressions } from '../../scripts/lib/complexity_policy.mjs'

const oldA = 'const a = (x) => { if (x) return 1; return 0 }'
const oldB = 'const b = (x) => { if (x) return 2; return 0 }'
const newcomer = 'const c = (x) => { if (x) return 3; return 0 }'
const key = (source, line) =>
  `file.ts::anonymous-fingerprint:${anonymousFunctionFingerprint(source, 'file.ts', line, 1)}#0`

test('anonymous function identity survives insertion and reordering in the same file', () => {
  const original = [oldA, oldB].join('\n')
  const reordered = [newcomer, oldB, oldA].join('\n')
  assert.equal(key(original, 1), key(reordered, 3))
  assert.equal(key(original, 2), key(reordered, 2))
  assert.notEqual(key(reordered, 1), key(original, 1))
  assert.notEqual(key(reordered, 1), key(original, 2))
})

test('new complexity-20 arrow fails despite deletion of grandfathered 29/32 arrows', () => {
  const original = [oldA, oldB].join('\n')
  const reordered = [newcomer, oldA].join('\n')
  const base = [
    { key: key(original, 1), score: 29 },
    { key: key(original, 2), score: 32 },
  ]
  const now = [
    { key: key(reordered, 1), score: 20 },
    { key: key(reordered, 2), score: 29 },
  ]
  assert.deepEqual(complexityRegressions(base, now, 15), [now[0]])
})

test('modifying a grandfathered anonymous function cannot inherit its old allowance', () => {
  const changed = oldA.replace('return 1', 'return 42')
  const base = [{ key: key(oldA, 1), score: 29 }]
  const now = [{ key: key(changed, 1), score: 30 }]
  assert.deepEqual(complexityRegressions(base, now, 15), now)
})
