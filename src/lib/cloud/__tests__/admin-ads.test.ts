import test from 'node:test'
import assert from 'node:assert/strict'
import { AD_BATCH_MAX, adsPath, adsRequest, parseAdsList } from '@/lib/cloud/admin-api'

const ID = 'acct_AAAAAAAAAAAAAAAAAAAAAA'
const ID2 = 'acct_BBBBBBBBBBBBBBBBBBBBBB'

test('the ads list path keeps the filter inside the worker enum and drops a malformed cursor', () => {
  assert.equal(adsPath('gift', null), '/v1/admin/ads?filter=gift&limit=50')
  assert.equal(adsPath('all', `1800000000.${ID}`), `/v1/admin/ads?filter=all&limit=50&cursor=1800000000.${ID}`)
  assert.equal(adsPath('disabled', 'x&filter=all'), '/v1/admin/ads?filter=disabled&limit=50')
  assert.equal(adsPath('everyone' as never, null), '/v1/admin/ads?filter=all&limit=50')
})

test('the batch body: ids folded and checked, 1..100 of them, a reason required', () => {
  assert.deepEqual(adsRequest([ID, ID, ID2], true, '  beta cerrada '), { ok: true, body: { accountIds: [ID, ID2], adsDisabled: true, reason: 'beta cerrada' } })
  assert.deepEqual(adsRequest([ID], false, 'fin'), { ok: true, body: { accountIds: [ID], adsDisabled: false, reason: 'fin' } })
  assert.deepEqual(adsRequest([], true, 'x'), { ok: false, key: 'adm.ads.error.none' })
  assert.deepEqual(adsRequest(['not-an-id'], true, 'x'), { ok: false, key: 'adm.ads.error.none' })
  const many = Array.from({ length: AD_BATCH_MAX + 1 }, (_, i) => `acct_${String(i).padStart(22, 'C')}`)
  assert.deepEqual(adsRequest(many, true, 'x'), { ok: false, key: 'adm.ads.error.tooMany' })
  assert.deepEqual(adsRequest([ID], true, '   '), { ok: false, key: 'adm.error.reason' })
})

test('the list answer is parsed field by field; junk rows and junk cursors are dropped', () => {
  const parsed = parseAdsList({
    accounts: [
      { accountId: ID, email: 'a@b.test', displayName: null, source: 'gift', adsDisabled: false, showsAds: true, reason: 'default' },
      { accountId: ID2, email: null, source: 'weird', adsDisabled: true, showsAds: false, reason: 'disabled' },
      { accountId: 'bad id', reason: 'default' },
      { accountId: ID, reason: 'maybe' },
      'nope',
    ],
    nextCursor: `1800000000.${ID2}`,
  })
  assert.deepEqual(parsed.accounts.map((a) => [a.accountId, a.source, a.showsAds, a.reason]), [[ID, 'gift', true, 'default'], [ID2, null, false, 'disabled']])
  assert.equal(parsed.nextCursor, `1800000000.${ID2}`)
  assert.deepEqual(parseAdsList({ accounts: 'x', nextCursor: '../../x' }), { accounts: [], nextCursor: null })
})
