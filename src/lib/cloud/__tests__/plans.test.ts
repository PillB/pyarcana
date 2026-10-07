/**
 * Pro prices in the dynamic build's plan table (src/lib/subscription-plans.ts) follow D-USER-01
 * (DESIGN-v3 §I): PE 19.90 / 119.90 PEN; US, EU and REST 7.99 / 49 USD, with the EU entry billed in
 * USD. They must equal the static price source (offer.ts, itself pinned to wrangler.toml), so the
 * two editions can never advertise different prices. formatPrice keeps its pinned outputs
 * ('S/ 29', '$9.99', tests/adversarial/subscription-plans.test.ts) and shows cents for a
 * non-integer sol amount instead of rounding S/ 19.90 up to "S/ 20".
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { formatPrice, getPlanByCode, type CountryCode } from '@/lib/subscription-plans'
import { OFFER } from '@/lib/cloud/offer'

const toMinor = (major: number) => Math.round(major * 100)

test('Pro prices equal the static offer in every region; EU is billed in USD', () => {
  const pro = getPlanByCode('pro')!
  assert.equal(toMinor(pro.pricing.PE.monthly), OFFER.pe.monthly)
  assert.equal(toMinor(pro.pricing.PE.yearly), OFFER.pe.yearly)
  assert.equal(pro.pricing.PE.currency, 'PEN')
  for (const region of ['US', 'EU', 'REST'] as CountryCode[]) {
    const p = pro.pricing[region]
    assert.equal(toMinor(p.monthly), OFFER.world.monthly, `${region} monthly`)
    assert.equal(toMinor(p.yearly), OFFER.world.yearly, `${region} yearly`)
    assert.equal(p.currency, 'USD', `${region} currency`)
    assert.equal(p.currencySymbol, '$', `${region} symbol`)
  }
})

test('the free plan keeps 5 sections, which the static gate derives its free range from', () => {
  assert.equal(getPlanByCode('free')!.maxSections, 5)
})

test('formatPrice: cents for a non-integer sol amount, pinned outputs unchanged', () => {
  assert.equal(formatPrice(19.9, 'S/'), 'S/ 19.90')
  assert.equal(formatPrice(119.9, 'S/'), 'S/ 119.90')
  assert.equal(formatPrice(0.5, 'S/'), 'S/ 0.50')
  assert.equal(formatPrice(29, 'S/'), 'S/ 29')
  assert.equal(formatPrice(290, 'S/'), 'S/ 290')
  assert.equal(formatPrice(9.99, '$'), '$9.99')
  assert.equal(formatPrice(7.99, '$'), '$7.99')
  assert.equal(formatPrice(49, '$'), '$49.00')
  assert.equal(formatPrice(0, 'S/'), 'Gratis')
})

test('a floating-point sum that is really an integer does not grow cents (12 x 19.90 - 119.90)', () => {
  // 12 * 19.9 - 119.9 = 118.89999999999999 in binary floating point; it must read S/ 118.90.
  assert.equal(formatPrice(12 * 19.9 - 119.9, 'S/'), 'S/ 118.90')
  // 3 * 0.1 * 10 = 3.0000000000000004: a whole number of soles after rounding to cents.
  assert.equal(formatPrice(3 * 0.1 * 10, 'S/'), 'S/ 3')
})
