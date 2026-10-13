import test from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { OFFER, formatMinor, annualSavingPercent, defaultMarket, railFor } from '@/lib/cloud/offer'

test('static prices equal the worker vars in wrangler.toml (one price, two copies, checked)', () => {
  const toml = readFileSync(join(process.cwd(), 'workers/billing/wrangler.toml'), 'utf8')
  const read = (name: string) => {
    const m = new RegExp(`^${name}\\s*=\\s*"(\\d+)"`, 'm').exec(toml)
    assert.ok(m, `${name} missing from wrangler.toml`)
    return Number(m[1])
  }
  assert.equal(OFFER.pe.monthly, read('PRICE_PE_MONTHLY_MINOR'))
  assert.equal(OFFER.pe.yearly, read('PRICE_PE_YEARLY_MINOR'))
  assert.equal(OFFER.world.monthly, read('PRICE_US_MONTHLY_MINOR'))
  assert.equal(OFFER.world.yearly, read('PRICE_US_YEARLY_MINOR'))
})

test('prices are the ones the owner set (D-USER-01): PEN 19.90/119.90, USD 7.99/49', () => {
  assert.deepEqual(
    { pe: [OFFER.pe.currency, OFFER.pe.monthly, OFFER.pe.yearly], world: [OFFER.world.currency, OFFER.world.monthly, OFFER.world.yearly] },
    { pe: ['PEN', 1990, 11990], world: ['USD', 799, 4900] }
  )
})

test('formatMinor renders minor units with integer arithmetic', () => {
  assert.equal(formatMinor(1990, 'PEN'), 'S/ 19.90')
  assert.equal(formatMinor(11990, 'PEN'), 'S/ 119.90')
  assert.equal(formatMinor(799, 'USD'), 'US$ 7.99')
  assert.equal(formatMinor(4900, 'USD'), 'US$ 49.00')
  assert.equal(formatMinor(5, 'PEN'), 'S/ 0.05')
  assert.equal(formatMinor(0, 'USD'), 'US$ 0.00')
  assert.equal(formatMinor(123456, 'PEN'), 'S/ 1,234.56')
})

test('formatMinor refuses what it cannot show truthfully: fractions, negatives, other currencies', () => {
  assert.throws(() => formatMinor(19.9, 'PEN'), RangeError)
  assert.throws(() => formatMinor(-1, 'PEN'), RangeError)
  assert.throws(() => formatMinor(Number.NaN, 'USD'), RangeError)
  assert.throws(() => formatMinor(799, 'EUR' as never), RangeError)
})

test('the annual saving is derived from the prices and rounded down so it never overstates', () => {
  assert.equal(annualSavingPercent('pe'), 49) // 1 - 11990/23880 = 49.79 %
  assert.equal(annualSavingPercent('world'), 48) // 1 - 4900/9588 = 48.89 %
})

test('the default market is Peru only on evidence of Peru', () => {
  assert.equal(defaultMarket({ country: 'PE' }), 'pe')
  assert.equal(defaultMarket({ country: 'pe' }), 'pe')
  assert.equal(defaultMarket({ country: 'US', timeZone: 'America/Lima' }), 'world')
  assert.equal(defaultMarket({ country: null, timeZone: 'America/Lima' }), 'pe')
  assert.equal(defaultMarket({ language: 'es-PE' }), 'pe')
  assert.equal(defaultMarket({ timeZone: 'Europe/Madrid', language: 'es-ES' }), 'world')
  assert.equal(defaultMarket({}), 'world')
})

test('a market has a rail only when the owner configured it', () => {
  assert.equal(railFor('pe', { peru: 'mercadopago', international: '' }), 'mercadopago')
  assert.equal(railFor('pe', { peru: '', international: 'creem' }), null)
  assert.equal(railFor('world', { peru: 'mercadopago', international: 'creem' }), 'creem')
  assert.equal(railFor('world', { peru: 'mercadopago', international: '' }), null)
})
