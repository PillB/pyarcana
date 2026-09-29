/**
 * What the config-driven legal sections say (DESIGN-v2 §8.12, v3 §E). Rules pinned here:
 * - nothing when accounts do not run here (stage off);
 * - the ads paragraph only when a NETWORK is enabled (provider adsense or ethicalads AND its id);
 *   house ads load nothing from anyone else and need no paragraph;
 * - the existing "sin cookies de terceros" statements stay only while they are true: no ad network
 *   and no Google sign-in button (its iframe comes from accounts.google.com) configured;
 * - processors are listed only when the config uses them;
 * - the controller is named only when the owner filled legal.sellerName.
 */
import test from 'node:test'
import assert from 'node:assert/strict'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import { adNetwork, adSharingClaimHolds, controllerOf, legalBlocks, processors, thirdPartyCookieClaimHolds } from '@/lib/cloud/legal-content'

const base: CloudConfig = structuredClone(CLOUD_CONFIG)
const cfg = (patch: Partial<CloudConfig> = {}): CloudConfig => ({ ...structuredClone(base), ...patch })
const ads = (provider: CloudConfig['ads']['provider'], ids: Partial<CloudConfig['ads']> = {}) => ({ ads: { provider, adsenseClient: '', adsenseSlots: {}, ethicaladsPublisher: '', ...ids } })

test('stage off: no section of any kind', () => {
  for (const kind of ['privacy', 'cookies', 'data-rights', 'terms'] as const) {
    assert.deepEqual(legalBlocks(cfg({ launchStage: 'paid', googleClientId: 'g' }), kind, 'off'), [], kind)
  }
})

test('an ad network counts only when it is the provider AND its id is set; house ads are not a network', () => {
  assert.equal(adNetwork(cfg(ads('house', { adsenseClient: 'ca-pub-1234567890123456' }))), null)
  assert.equal(adNetwork(cfg(ads('adsense'))), null)
  assert.equal(adNetwork(cfg(ads('adsense', { adsenseClient: 'ca-pub-1234567890123456' }))), 'adsense')
  assert.equal(adNetwork(cfg(ads('ethicalads', { adsenseClient: 'ca-pub-1234567890123456' }))), null)
  assert.equal(adNetwork(cfg(ads('ethicalads', { ethicaladsPublisher: 'pyarcana' }))), 'ethicalads')
})

test('privacy and cookies: the ads paragraph appears only with a network', () => {
  const house = cfg({ launchStage: 'beta' })
  const network = cfg({ launchStage: 'beta', ...ads('adsense', { adsenseClient: 'ca-pub-1234567890123456' }) })
  for (const kind of ['privacy', 'cookies'] as const) {
    assert.ok(!legalBlocks(house, kind, 'beta').includes('ads'), kind)
    assert.ok(legalBlocks(network, kind, 'beta').includes('ads'), kind)
  }
  assert.ok(!legalBlocks(network, 'terms', 'beta').includes('ads'))
})

test('privacy carries controller, data, processors, retention, stored keys, rights and the trial-claim rule', () => {
  const blocks = legalBlocks(cfg({ launchStage: 'sync' }), 'privacy', 'sync')
  for (const b of ['controller', 'accountData', 'processors', 'retention', 'storageKeys', 'rights', 'trialClaim', 'reports']) assert.ok(blocks.includes(b as never), b)
  const rights = legalBlocks(cfg({ launchStage: 'sync' }), 'data-rights', 'sync')
  assert.deepEqual(rights, ['rights', 'arcoDeadlines', 'exportDelete', 'trialClaim'])
})

test('cookies: the Google sign-in paragraph only when the Google button is configured', () => {
  assert.ok(!legalBlocks(cfg({ launchStage: 'sync' }), 'cookies', 'sync').includes('googleSignIn'))
  assert.ok(legalBlocks(cfg({ launchStage: 'sync', googleClientId: 'x.apps.googleusercontent.com' }), 'cookies', 'sync').includes('googleSignIn'))
})

test('terms: the subscription terms only when the gate runs (beta or paid)', () => {
  assert.ok(!legalBlocks(cfg({ launchStage: 'sync' }), 'terms', 'sync').includes('subscription'))
  assert.ok(legalBlocks(cfg({ launchStage: 'beta' }), 'terms', 'beta').includes('subscription'))
  assert.ok(legalBlocks(cfg({ launchStage: 'paid' }), 'terms', 'paid').includes('accountTerms'))
})

test('"sin cookies de terceros" stays only while true', () => {
  assert.equal(thirdPartyCookieClaimHolds(base), true, 'the shipped config')
  // Configured but switched off: nothing runs, so the statement is still true.
  assert.equal(thirdPartyCookieClaimHolds(cfg({ launchStage: 'off', googleClientId: 'g', ...ads('adsense', { adsenseClient: 'ca-pub-1234567890123456' }) })), true)
  assert.equal(thirdPartyCookieClaimHolds(cfg({ launchStage: 'beta' })), true, 'house ads and email sign-in only')
  assert.equal(thirdPartyCookieClaimHolds(cfg({ launchStage: 'sync', googleClientId: 'g' })), false)
  assert.equal(thirdPartyCookieClaimHolds(cfg({ launchStage: 'beta', ...ads('ethicalads', { ethicaladsPublisher: 'p' }) })), false)
})

test('"no compartimos datos con terceros para publicidad" stays only while no ad network can load', () => {
  assert.equal(adSharingClaimHolds(base), true, 'the shipped config')
  assert.equal(adSharingClaimHolds(cfg({ launchStage: 'off', ...ads('adsense', { adsenseClient: 'ca-pub-1234567890123456' }) })), true, 'configured but off')
  // Google sign-in sets third-party cookies but is not advertising: this claim survives it.
  assert.equal(adSharingClaimHolds(cfg({ launchStage: 'sync', googleClientId: 'g' })), true)
  assert.equal(adSharingClaimHolds(cfg({ launchStage: 'beta', ...ads('house', { adsenseClient: 'ca-pub-1234567890123456' }) })), true, 'house promos')
  assert.equal(adSharingClaimHolds(cfg({ launchStage: 'beta', ...ads('adsense', { adsenseClient: 'ca-pub-1234567890123456' }) })), false)
  assert.equal(adSharingClaimHolds(cfg({ launchStage: 'paid', ...ads('ethicalads', { ethicaladsPublisher: 'p' }) })), false)
})

test('processors follow the config: Cloudflare always; Google, Microsoft, rails and networks only when used', () => {
  assert.deepEqual(processors(cfg({ launchStage: 'sync' })).map((p) => p.key), ['cloudflare', 'email'])
  const all = cfg({
    launchStage: 'paid',
    googleClientId: 'g',
    microsoftClientId: 'm',
    rails: { peru: 'mercadopago', international: 'creem' },
    ...ads('adsense', { adsenseClient: 'ca-pub-1234567890123456' }),
  })
  assert.deepEqual(processors(all).map((p) => p.key), ['cloudflare', 'email', 'google', 'microsoft', 'mercadopago', 'creem', 'adsense'])
  assert.equal(processors(all).find((p) => p.key === 'mercadopago')?.country, 'PE')
})

test('controller: named only from legal.sellerName (with RUC and address when given)', () => {
  assert.deepEqual(controllerOf(cfg()), null)
  // The shipped config prefills only the support address (DESIGN-v3 §K): still no controller.
  assert.equal(base.legal.supportEmail, 'soporte@pyarcana.dev')
  assert.deepEqual(controllerOf(cfg({ legal: { ...base.legal, supportEmail: '', sellerName: '  Ana Pérez ', ruc: '10123456789' } })), { name: 'Ana Pérez', ruc: '10123456789', address: null, email: null })
  assert.deepEqual(controllerOf(cfg({ legal: { ...base.legal, sellerName: 'Ana Pérez' } })), { name: 'Ana Pérez', ruc: null, address: null, email: 'soporte@pyarcana.dev' })
})
