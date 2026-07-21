/**
 * Adversarial unit tests — subscription plans & pricing.
 */
import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import {
  SUBSCRIPTION_PLANS,
  formatPrice,
  getPlanByCode,
  type CountryCode,
  type PlanCode,
} from '../../src/lib/subscription-plans.ts'

describe('SUBSCRIPTION_PLANS integrity', () => {
  it('has free/pro/team with unique codes', () => {
    const codes = SUBSCRIPTION_PLANS.map((p) => p.code)
    assert.deepEqual(codes.sort(), ['free', 'pro', 'team'].sort())
  })

  it('every plan has PE/US/EU/REST pricing with non-negative amounts', () => {
    const countries: CountryCode[] = ['PE', 'US', 'EU', 'REST']
    for (const plan of SUBSCRIPTION_PLANS) {
      for (const c of countries) {
        const pr = plan.pricing[c]
        assert.ok(pr, `${plan.code} missing ${c}`)
        assert.ok(pr.monthly >= 0)
        assert.ok(pr.yearly >= 0)
        // yearly should never be more expensive than 12 months (sanity)
        assert.ok(pr.yearly <= pr.monthly * 12 + 0.01)
      }
    }
  })

  it('free has maxSections 5 and no exams; pro unlimited exams', () => {
    const free = getPlanByCode('free')!
    const pro = getPlanByCode('pro')!
    assert.equal(free.maxSections, 5)
    assert.equal(free.hasExams, false)
    assert.equal(pro.maxSections, -1)
    assert.equal(pro.hasExams, true)
  })

  it('getPlanByCode returns undefined for garbage codes', () => {
    assert.equal(getPlanByCode('enterprise' as PlanCode), undefined)
  })
})

describe('formatPrice', () => {
  it('zero/negative/NaN is Gratis; PEN without decimals; USD with 2', () => {
    assert.equal(formatPrice(0, '$'), 'Gratis')
    assert.equal(formatPrice(-1, '$'), 'Gratis')
    assert.equal(formatPrice(Number.NaN, '$'), 'Gratis')
    assert.equal(formatPrice(29, 'S/'), 'S/ 29')
    assert.equal(formatPrice(9.99, '$'), '$9.99')
  })
})
