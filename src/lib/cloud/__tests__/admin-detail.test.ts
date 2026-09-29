/**
 * The admin "Cuentas" view and the "not built yet" answer (DESIGN-v3 §H; worker contract in
 * workers/billing/src/admin-accounts.mjs accountDetail and router.mjs 404 not_found).
 * - the account detail is parsed field by field; anything not in the worker's shape is dropped;
 * - a subject id is never shown (the worker already masks it; the client does not even keep it);
 * - "the route does not exist" is recognised only from a 404 not_found, so a 403 or a 5xx is never
 *   presented as "not available yet".
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { parseAccountDetail, routeMissing } from '@/lib/cloud/admin-api'

const WORKER_BODY = {
  ok: true,
  account: {
    id: 'acct_abc',
    email: 'ana@example.com',
    emailVerified: true,
    displayName: null,
    createdAt: 1_700_000_000,
    firstSigninAt: 1_700_000_100,
    termsVersion: '1.0',
    trialUsedAt: null,
    disabledAt: null,
    disabledReason: null,
    deletedAt: null,
  },
  access: { isPro: true, source: 'gift', accessEnd: 1_800_000_000, indefinite: false, graceUntil: null },
  grants: [{ id: 'grt_1', accountId: 'acct_abc', kind: 'gift', days: 30, state: 'active', start: 1_700_000_100, end: 1_702_592_100, createdAt: 1_700_000_000 }, { id: 5 }],
  roles: [{ accountId: 'acct_abc', role: 'tester', state: 'active', createdAt: 1_700_000_000, expiresAt: null }],
  identities: [{ provider: 'google', subject: 'goo…123', createdAt: 1_700_000_000 }, { provider: 7 }],
  subscriptions: [
    { id: 'sub_1', provider: 'creem', providerRef: 'x', plan: 'pro_monthly', amountMinor: 799, currency: 'USD', status: 'active', cancelAtPeriodEnd: false, paidThrough: 1_702_000_000, createdAt: 1 },
    { id: 'sub_2', provider: 'mercadopago', plan: 'pro_yearly', amountMinor: '11990', currency: 'PEN', status: 'past_due', cancelAtPeriodEnd: true, paidThrough: null },
    { provider: 'creem' },
  ],
  charges: [{ id: 'chg_1' }],
  flags: { doubleSubscription: true },
  audit: [{ id: 1, action: 'admin.grants.create' }],
}

test('account detail: the worker body is parsed field by field', () => {
  const d = parseAccountDetail(WORKER_BODY)
  assert.ok(d)
  assert.deepEqual(d.account, {
    id: 'acct_abc',
    email: 'ana@example.com',
    emailVerified: true,
    displayName: null,
    createdAt: 1_700_000_000,
    firstSigninAt: 1_700_000_100,
    trialUsedAt: null,
    disabledAt: null,
    disabledReason: null,
    deletedAt: null,
  })
  assert.deepEqual(d.access, { isPro: true, source: 'gift', accessEnd: 1_800_000_000, indefinite: false })
  assert.deepEqual(d.grants.map((g) => g.id), ['grt_1'])
  assert.deepEqual(d.roles.map((r) => [r.role, r.state]), [['tester', 'active']])
  assert.deepEqual(d.identities, [{ provider: 'google', createdAt: 1_700_000_000 }])
  assert.equal(JSON.stringify(d).includes('goo…123'), false, 'the masked subject is not kept either')
  assert.deepEqual(d.subscriptions, [
    { id: 'sub_1', provider: 'creem', plan: 'pro_monthly', status: 'active', cancelAtPeriodEnd: false, paidThrough: 1_702_000_000, amountMinor: 799, currency: 'USD' },
    { id: 'sub_2', provider: 'mercadopago', plan: 'pro_yearly', status: 'past_due', cancelAtPeriodEnd: true, paidThrough: null, amountMinor: null, currency: 'PEN' },
  ])
  assert.equal(d.doubleSubscription, true)
})

test('account detail: no account, a foreign id shape or a non-object is null; missing lists are empty', () => {
  assert.equal(parseAccountDetail(null), null)
  assert.equal(parseAccountDetail({ ok: true }), null)
  assert.equal(parseAccountDetail({ account: { id: 'u_1' } }), null)
  const bare = parseAccountDetail({ account: { id: 'acct_x', disabledAt: 5, disabledReason: 'abuso' } })
  assert.ok(bare)
  assert.equal(bare.account.disabledAt, 5)
  assert.equal(bare.account.disabledReason, 'abuso')
  assert.equal(bare.account.emailVerified, false)
  assert.deepEqual(bare.access, { isPro: false, source: null, accessEnd: null, indefinite: false })
  assert.deepEqual([bare.grants, bare.roles, bare.identities, bare.subscriptions], [[], [], [], []])
  assert.equal(bare.doubleSubscription, false)
})

test('route missing: only a 404 not_found says "not built yet"; refusals and outages do not', () => {
  assert.equal(routeMissing({ ok: false, status: 404, reason: 'not_found', data: { ok: false, reason: 'not_found' } }), true)
  assert.equal(routeMissing({ ok: false, status: 404, reason: 'http_404', data: null }), true)
  assert.equal(routeMissing({ ok: false, status: 403, reason: 'forbidden', data: null }), false)
  assert.equal(routeMissing({ ok: false, status: 500, reason: 'http_500', data: null }), false)
  assert.equal(routeMissing({ ok: false, status: 0, reason: 'network', data: null }), false)
  assert.equal(routeMissing({ ok: false, status: 404, reason: 'report_not_found', data: null }), false)
  assert.equal(routeMissing({ ok: true, status: 200, data: {} }), false)
})
