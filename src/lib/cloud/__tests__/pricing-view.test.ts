/**
 * /precios and /suscripcion (DESIGN-v2 §8.9, v3 §D/§I). Pinned:
 * - prices come from offer.ts only (itself pinned to wrangler.toml): PEN "S/ 19.90" with IGV
 *   included, USD "US$ 7.99" sold by Creem; no EUR, no Team plan;
 * - nothing is offered while the stage is off or sync (sync has no prices);
 * - pay buttons only in 'paid' AND only for a market whose rail is configured; otherwise the page
 *   says payments open soon instead of showing a button that cannot work;
 * - the yearly saving is floored, never overstated;
 * - the seller shown is the configured legal identity (Peru) or Creem as merchant of record.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { pricingView, sellerView } from '@/lib/cloud/pricing-view'

const base: CloudConfig = structuredClone(CLOUD_CONFIG)
const rails = (peru: 'mercadopago' | '', international: 'creem' | '') => ({ ...structuredClone(base), rails: { peru, international } })

test('off and sync: no offer at all', () => {
  assert.equal(pricingView('off', base).available, false)
  assert.equal(pricingView('sync', rails('mercadopago', 'creem')).available, false)
})

test('beta: prices shown from offer.ts, no pay button anywhere, "payments open soon"', () => {
  const v = pricingView('beta', rails('mercadopago', 'creem'))
  assert.equal(v.available, true)
  assert.deepEqual(
    v.rows.map((r) => [r.market, r.currency, r.monthly, r.yearly, r.savingPct, r.payRail]),
    [
      ['pe', 'PEN', 'S/ 19.90', 'S/ 119.90', 49, null],
      ['world', 'USD', 'US$ 7.99', 'US$ 49.00', 48, null],
    ]
  )
  assert.equal(v.payOpen, false)
})

test('paid: a pay button only for a market whose rail is configured', () => {
  assert.deepEqual(pricingView('paid', rails('mercadopago', 'creem')).rows.map((r) => r.payRail), ['mercadopago', 'creem'])
  assert.deepEqual(pricingView('paid', rails('mercadopago', '')).rows.map((r) => r.payRail), ['mercadopago', null])
  const none = pricingView('paid', rails('', ''))
  assert.deepEqual(none.rows.map((r) => r.payRail), [null, null])
  assert.equal(none.payOpen, false)
})

test('free sections come from the gate config; Pro starts at the next one', () => {
  const v = pricingView('beta', { ...structuredClone(base), gate: { ...base.gate, freeSections: 5 } })
  assert.deepEqual([v.freeSections, v.proFrom], [5, 6])
})

test('seller: the owner identity for Peru (or null until filled), Creem as merchant of record abroad', () => {
  // Review round 3 (finding 12): Creem is named only when its rail is configured.
  assert.deepEqual(sellerView({ ...base, rails: { ...base.rails, international: 'creem' } }), { owner: null, international: 'creem' })
  assert.deepEqual(sellerView({ ...base, rails: { ...base.rails, international: '' } }), { owner: null, international: null })
  const filled = { ...structuredClone(base), legal: { sellerName: 'Ana Pérez', ruc: '10123456789', address: 'Lima', complaintsBookUrl: 'https://x.example/libro', supportEmail: 'soporte@x.example' } }
  assert.deepEqual(sellerView(filled).owner, { name: 'Ana Pérez', ruc: '10123456789', address: 'Lima', email: 'soporte@x.example', complaintsBookUrl: 'https://x.example/libro' })
  // A complaints-book link must be https (it becomes an href).
  const bad = { ...filled, legal: { ...filled.legal, complaintsBookUrl: 'javascript:alert(1)' } }
  assert.equal(sellerView(bad).owner?.complaintsBookUrl, null)
})
