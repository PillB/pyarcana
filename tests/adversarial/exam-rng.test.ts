/**
 * Contract: the exam draw's randomness comes from node:crypto's randomInt, not Math.random.
 *
 * exam/start uses this to pick each concept's variant, the question order and every question's
 * option order. A swap to Math.random would still look uniform to the chi-square test in
 * exam-draw.test.ts, so statistics cannot catch it; this replaces node:crypto with a recorder and
 * checks that the call reaches it. randomInt(max) is uniform over [0, max) and avoids modulo bias
 * (Node.js crypto docs, crypto.randomInt).
 *
 * Run: node --experimental-test-module-mocks --import tsx --test tests/adversarial/exam-rng.test.ts
 */
import { before, describe, it, mock } from 'node:test'
import assert from 'node:assert/strict'

if (typeof mock.module !== 'function') {
  throw new Error('mock.module is unavailable: run with --experimental-test-module-mocks')
}

// Node 25.9 renamed mock.module's `namedExports` option to `exports` and deprecated the old name
// (nodejs/node#61727). CI runs Node 22, which only has `namedExports`.
function moduleExports(named: Record<string, unknown>) {
  const [major, minor] = process.versions.node.split('.').map(Number)
  return major > 25 || (major === 25 && minor >= 9) ? { exports: named } : { namedExports: named }
}

/** Each call's range as [min, max), whichever of randomInt's two forms was used. */
const ranges: Array<[number, number]> = []
const RETURNED = 7

mock.module('node:crypto', moduleExports({
  randomInt: (...args: unknown[]) => {
    const [min, max] = args.length === 1 ? [0, args[0]] : [args[0], args[1]]
    ranges.push([min as number, max as number])
    return RETURNED
  },
}))

let secureRandomInt: (n: number) => number

// Imported after the mock is registered, so the module binds to it.
before(async () => {
  ;({ secureRandomInt } = await import('../../src/lib/exam-rng.ts'))
})

describe('secureRandomInt', () => {
  it('asks node:crypto randomInt for an integer in [0, n) and returns what it gave', () => {
    ranges.length = 0
    assert.equal(secureRandomInt(4), RETURNED)
    assert.equal(secureRandomInt(24), RETURNED)
    assert.deepEqual(ranges, [[0, 4], [0, 24]])
  })
})
