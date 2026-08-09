/**
 * Adversarial unit tests — feedback rate limit + sanitize.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  FEEDBACK_MAX_REQ,
  checkRateLimit,
  clientIpFromForwarded,
  isValidFeedbackType,
  sanitizeFeedbackText,
  type RateLimitStore,
} from '../../src/lib/feedback-guards.ts'

describe('sanitizeFeedbackText', () => {
  it('strips null bytes and control chars but keeps normal text', () => {
    assert.equal(sanitizeFeedbackText('hola\u0000mundo'), 'holamundo')
    assert.equal(sanitizeFeedbackText('  ok  '), 'ok')
    assert.equal(sanitizeFeedbackText('line1\nline2'), 'line1\nline2')
  })

  it('non-string input yields empty string (malformed)', () => {
    // @ts-expect-error adversarial
    assert.equal(sanitizeFeedbackText(null), '')
    // @ts-expect-error adversarial
    assert.equal(sanitizeFeedbackText(42), '')
  })
})

describe('checkRateLimit', () => {
  it('allows up to MAX then blocks (exhaustion)', () => {
    const store: RateLimitStore = new Map()
    const now = 1_000_000
    for (let i = 0; i < FEEDBACK_MAX_REQ; i++) {
      assert.equal(
        checkRateLimit('ip1', store, { now, windowMs: 60_000, maxReq: FEEDBACK_MAX_REQ }),
        true,
        `req ${i + 1}`
      )
    }
    assert.equal(
      checkRateLimit('ip1', store, { now, windowMs: 60_000, maxReq: FEEDBACK_MAX_REQ }),
      false
    )
  })

  it('resets after window (race-ish clock jump)', () => {
    const store: RateLimitStore = new Map()
    const t0 = 0
    assert.equal(checkRateLimit('k', store, { now: t0, windowMs: 100, maxReq: 1 }), true)
    assert.equal(checkRateLimit('k', store, { now: t0 + 50, windowMs: 100, maxReq: 1 }), false)
    assert.equal(checkRateLimit('k', store, { now: t0 + 101, windowMs: 100, maxReq: 1 }), true)
  })

  it('isolates keys (no cross-IP state corruption)', () => {
    const store: RateLimitStore = new Map()
    const now = 5
    assert.equal(checkRateLimit('a', store, { now, maxReq: 1, windowMs: 1000 }), true)
    assert.equal(checkRateLimit('a', store, { now, maxReq: 1, windowMs: 1000 }), false)
    assert.equal(checkRateLimit('b', store, { now, maxReq: 1, windowMs: 1000 }), true)
  })

  it('rejects empty key and invalid window/max', () => {
    const store: RateLimitStore = new Map()
    assert.equal(checkRateLimit('', store), false)
    assert.equal(checkRateLimit('x', store, { windowMs: 0 }), false)
    assert.equal(checkRateLimit('x', store, { maxReq: 0 }), false)
  })
})

describe('clientIpFromForwarded', () => {
  it('takes first hop and bounds length', () => {
    assert.equal(clientIpFromForwarded('1.2.3.4, 5.6.7.8'), '1.2.3.4')
    assert.equal(clientIpFromForwarded(null), 'unknown')
    assert.equal(clientIpFromForwarded('  '), 'unknown')
    const long = 'x'.repeat(200)
    assert.equal(clientIpFromForwarded(long)!.length, 128)
  })
})

describe('isValidFeedbackType', () => {
  it('accepts only enum members', () => {
    assert.equal(isValidFeedbackType('BUG'), true)
    assert.equal(isValidFeedbackType('hack'), false)
    assert.equal(isValidFeedbackType(undefined), false)
  })
})
