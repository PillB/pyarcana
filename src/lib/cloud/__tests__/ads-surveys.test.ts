import test from 'node:test'
import assert from 'node:assert/strict'
import { adEligibility, chooseAdapter, networkHosts, scriptUrl, isAdRoute, AD_EXCLUDED_ROUTES, type AdapterInput, type AdEligibilityInput } from '@/lib/cloud/ads'
import { canPrompt, recordPrompt, readSurveyCap, SURVEY_CAP_KEY, type SurveyKind } from '@/lib/cloud/surveys'
import { CLOUD_CONFIG } from '@/lib/cloud/config'
import { createMemoryStorage } from '@/lib/cloud/storage'

const QA_OFF = { testMode: false, adPreview: false }
const adapterBase: AdapterInput = {
  eligibility: 'free',
  ads: CLOUD_CONFIG.ads,
  placement: 'section_end',
  signedIn: false,
  adultAttested: false,
  geo: { status: 'ok', country: 'PE' },
  adsenseOptIn: 'unset',
  desktop: true,
  staff: false,
}

const elig = (p: Partial<AdEligibilityInput> = {}) =>
  adEligibility({ stage: 'beta', pathname: '/', basePath: '', qa: QA_OFF, access: 'free', liveAds: null, ...p })

test('owner decision 2026-10-01: the live me.ads answer decides, so gift and tester Pro see ads unless switched off', () => {
  assert.equal(elig(), 'free')
  // A gift or tester holder is Pro, yet the worker says show: ads.
  assert.equal(elig({ access: 'pro', liveAds: true }), 'free')
  // Paid, trial, or the admin switch: the worker says no.
  assert.equal(elig({ access: 'pro', liveAds: false }), 'none')
  assert.equal(elig({ access: 'free', liveAds: false }), 'none')
  // No live answer on this load (offline on the licence): a Pro licence means no ads.
  assert.equal(elig({ access: 'pro', liveAds: null }), 'none')
  assert.equal(elig({ access: 'free', liveAds: null }), 'free')
})

test('staff (admin, tester) see house ads but never a real network creative: it becomes the test placeholder', () => {
  const adsense = { ...CLOUD_CONFIG.ads, provider: 'adsense' as const, adsenseClient: 'ca-pub-1', adsenseSlots: { section_end: '1' } }
  assert.equal(chooseAdapter({ ...adapterBase, ads: adsense, adsenseOptIn: 'accepted' }), 'adsense')
  assert.equal(chooseAdapter({ ...adapterBase, ads: adsense, adsenseOptIn: 'accepted', staff: true }), 'test')
  assert.equal(chooseAdapter({ ...adapterBase, ads: adsense, staff: true }), 'test')
  const ethical = { ...CLOUD_CONFIG.ads, provider: 'ethicalads' as const, ethicaladsPublisher: 'pyarcana' }
  assert.equal(chooseAdapter({ ...adapterBase, ads: ethical, placement: 'rail' }), 'ethicalads')
  assert.equal(chooseAdapter({ ...adapterBase, ads: ethical, placement: 'rail', staff: true }), 'test')
  // House promos load nothing third-party, so staff see them as everyone does.
  assert.equal(chooseAdapter({ ...adapterBase, ads: { ...CLOUD_CONFIG.ads, provider: 'house' }, staff: true }), 'house')
  assert.equal(chooseAdapter({ ...adapterBase, eligibility: 'none', staff: true }), 'none')
})

test('entitlement not yet known reserves the box and shows nothing (no ad flash at a Pro user)', () => {
  assert.equal(elig({ access: 'unknown' }), 'unknown')
  const adapter = chooseAdapter({ ...adapterBase, eligibility: 'unknown' })
  assert.equal(adapter, 'reserved')
  assert.deepEqual(networkHosts(adapter), [])
})

test('QA test mode or the ad preview show test placeholders to anyone, Pro and staff included', () => {
  for (const qa of [{ testMode: true, adPreview: false }, { testMode: false, adPreview: true }]) {
    assert.equal(elig({ qa, access: 'pro' }), 'test')
    assert.equal(elig({ qa, liveAds: false }), 'test')
    assert.equal(elig({ qa, access: 'unknown' }), 'test')
  }
  assert.equal(chooseAdapter({ ...adapterBase, eligibility: 'test', ads: { ...CLOUD_CONFIG.ads, provider: 'adsense', adsenseClient: 'ca-pub-1', adsenseSlots: { section_end: '1' } } }), 'test')
  assert.deepEqual(networkHosts('test'), [])
})

test('stage off renders nothing at all, even in QA mode', () => {
  assert.equal(elig({ stage: 'off' }), 'none')
  assert.equal(elig({ stage: 'off', qa: { testMode: true, adPreview: true } }), 'none')
})

test('only the course route carries ads; every other route is excluded (allowlist), base path aware', () => {
  assert.equal(isAdRoute('/'), true)
  assert.equal(isAdRoute('/pyarcana/', '/pyarcana'), true)
  assert.equal(isAdRoute('/pyarcana', '/pyarcana'), true)
  assert.equal(isAdRoute('/pyarcana/cuenta', '/pyarcana'), false)
  assert.equal(isAdRoute('/some-new-route'), false)
  for (const route of AD_EXCLUDED_ROUTES) assert.equal(isAdRoute(route), false, route)
  for (const route of ['/cuenta', '/admin', '/qa', '/precios', '/privacy', '/cookies', '/terms', '/data-rights', '/suscripcion']) {
    assert.ok(AD_EXCLUDED_ROUTES.includes(route), `${route} listed`)
  }
})

test('excluded routes never make a network request, whatever the user, mode or provider', () => {
  const providers = [
    CLOUD_CONFIG.ads,
    { ...CLOUD_CONFIG.ads, provider: 'adsense' as const, adsenseClient: 'ca-pub-1', adsenseSlots: { section_end: '1', rail: '2' } },
    { ...CLOUD_CONFIG.ads, provider: 'ethicalads' as const, ethicaladsPublisher: 'pyarcana' },
  ]
  for (const pathname of [...AD_EXCLUDED_ROUTES, '/cuenta/', '/admin/']) {
    for (const qa of [QA_OFF, { testMode: true, adPreview: true }]) {
      for (const access of ['free', 'pro', 'unknown'] as const) {
        const e = elig({ pathname, qa, access })
        assert.equal(e, 'none', `${pathname} ${access}`)
        for (const ads of providers) {
          const adapter = chooseAdapter({ ...adapterBase, eligibility: e, ads, adsenseOptIn: 'accepted', desktop: true, placement: 'rail' })
          assert.deepEqual(networkHosts(adapter), [], `${pathname} ${ads.provider}`)
          assert.equal(scriptUrl(adapter, ads), null)
        }
      }
    }
  }
})


test('launch default: house ads only, no network', () => {
  assert.equal(CLOUD_CONFIG.ads.provider, 'house')
  assert.equal(chooseAdapter(adapterBase), 'house')
  assert.deepEqual(networkHosts('house'), [])
  assert.equal(chooseAdapter({ ...adapterBase, eligibility: 'none' }), 'none')
})

test('EthicalAds: desktop right rail only, and only with a publisher id', () => {
  const ea = { ...CLOUD_CONFIG.ads, provider: 'ethicalads' as const, ethicaladsPublisher: 'pyarcana' }
  assert.equal(chooseAdapter({ ...adapterBase, ads: ea, placement: 'rail' }), 'ethicalads')
  // The rail is EthicalAds-only (client review finding 28, 2026-09-29): where it cannot show the
  // network it stays empty instead of adding a second house promo to the view.
  assert.equal(chooseAdapter({ ...adapterBase, ads: ea, placement: 'rail', desktop: false }), 'none')
  assert.equal(chooseAdapter({ ...adapterBase, ads: ea, placement: 'section_end' }), 'house')
  assert.equal(chooseAdapter({ ...adapterBase, ads: { ...ea, ethicaladsPublisher: '' }, placement: 'rail' }), 'none')
  assert.deepEqual(networkHosts('ethicalads'), ['https://media.ethicalads.io', 'https://server.ethicalads.io'])
  assert.equal(scriptUrl('ethicalads', ea), 'https://media.ethicalads.io/media/client/ethicalads.min.js')
})

test('AdSense: only after an in-slot opt-in, never in the EEA/UK/CH or without a geo answer', () => {
  const as = { ...CLOUD_CONFIG.ads, provider: 'adsense' as const, adsenseClient: 'ca-pub-123', adsenseSlots: { section_end: '999' } }
  const c = (p: Partial<AdapterInput>) => chooseAdapter({ ...adapterBase, ads: as, ...p })
  assert.equal(c({}), 'adsense_optin')
  assert.deepEqual(networkHosts('adsense_optin'), [])
  assert.equal(c({ adsenseOptIn: 'accepted' }), 'adsense')
  assert.equal(c({ adsenseOptIn: 'declined' }), 'house')
  assert.equal(c({ adsenseOptIn: 'accepted', geo: { status: 'ok', country: 'ES' } }), 'house')
  assert.equal(c({ adsenseOptIn: 'accepted', geo: { status: 'ok', country: 'gb' } }), 'house')
  assert.equal(c({ adsenseOptIn: 'accepted', geo: { status: 'failed', country: null } }), 'house')
  assert.equal(c({ adsenseOptIn: 'accepted', geo: { status: 'unknown', country: null } }), 'house')
  assert.equal(c({ signedIn: true, adultAttested: false }), 'house', 'signed-in without the 18+ attestation: house only')
  assert.equal(c({ signedIn: true, adultAttested: true, adsenseOptIn: 'accepted' }), 'adsense')
  assert.equal(c({ adsenseOptIn: 'accepted', placement: 'resources_end' }), 'house', 'no slot configured for this placement')
  assert.equal(c({ adsenseOptIn: 'accepted', ads: { ...as, adsenseClient: '' } }), 'house')
  assert.equal(scriptUrl('adsense', as), 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-123')
})

// --- surveys ---------------------------------------------------------------------------------

const DAY = 86400000
const T = Date.parse('2026-10-01T00:00:00Z')
const base = (storage = createMemoryStorage()) => ({ cap: readSurveyCap(storage), sessionShown: false, nowMs: T, qaMode: false, random: () => 0.1, firstVisitAt: T - 30 * DAY })

test('no survey prompt of any kind in QA mode', () => {
  for (const kind of ['section_csat', 'nps', 'gate_reason', 'cancel_reason'] as SurveyKind[]) {
    assert.equal(canPrompt(kind, { ...base(), qaMode: true }), false, kind)
  }
})

test('at most one prompt per session and one per 7 days, across kinds', () => {
  const storage = createMemoryStorage()
  assert.equal(canPrompt('section_csat', base(storage)), true)
  recordPrompt(storage, 'section_csat', T)
  assert.equal(canPrompt('gate_reason', { ...base(storage), sessionShown: true, nowMs: T + 8 * DAY }), false)
  assert.equal(canPrompt('gate_reason', { ...base(storage), nowMs: T + 6 * DAY }), false)
  assert.equal(canPrompt('gate_reason', { ...base(storage), nowMs: T + 7 * DAY }), true)
})

test('section CSAT is sampled 1 in 3', () => {
  assert.equal(canPrompt('section_csat', { ...base(), random: () => 0.33 }), true)
  assert.equal(canPrompt('section_csat', { ...base(), random: () => 0.34 }), false)
})

test('NPS waits 14 days from the first visit and then 90 days between asks', () => {
  const storage = createMemoryStorage()
  assert.equal(canPrompt('nps', { ...base(storage), firstVisitAt: T - 13 * DAY }), false)
  assert.equal(canPrompt('nps', { ...base(storage), firstVisitAt: null }), false)
  assert.equal(canPrompt('nps', { ...base(storage), firstVisitAt: T - 14 * DAY }), true)
  recordPrompt(storage, 'nps', T)
  assert.equal(canPrompt('nps', { ...base(storage), nowMs: T + 60 * DAY }), false)
  assert.equal(canPrompt('nps', { ...base(storage), nowMs: T + 90 * DAY }), true)
})

test('the gate reason is asked once per device', () => {
  const storage = createMemoryStorage()
  recordPrompt(storage, 'gate_reason', T)
  assert.equal(canPrompt('gate_reason', { ...base(storage), nowMs: T + 365 * DAY }), false)
})

test('the optional cancel reason is part of the cancel flow: never capped, and it does not consume the cap', () => {
  const storage = createMemoryStorage()
  recordPrompt(storage, 'section_csat', T)
  assert.equal(canPrompt('cancel_reason', { ...base(storage), sessionShown: true }), true)
  recordPrompt(storage, 'cancel_reason', T + 8 * DAY)
  assert.equal(readSurveyCap(storage).lastAt, T)
})

test('a corrupt cap record reads as empty', () => {
  const storage = createMemoryStorage({ [SURVEY_CAP_KEY]: '{"lastAt":"soon","byKind":{"nps":"x","evil":1}}' })
  assert.deepEqual(readSurveyCap(storage), { lastAt: null, byKind: {} })
})

test('me.ads is parsed strictly: a malformed or missing field is null, never a guess', async () => {
  const { parseMe } = await import('@/lib/cloud/session')
  const base = { account: { id: 'acc_1' }, access: { isPro: true, source: 'gift' } }
  assert.deepEqual(parseMe({ ...base, ads: { show: true, reason: 'default' } })?.ads, { show: true, reason: 'default' })
  assert.deepEqual(parseMe({ ...base, ads: { show: false, reason: 'disabled' } })?.ads, { show: false, reason: 'disabled' })
  assert.equal(parseMe(base)?.ads, null)
  assert.equal(parseMe({ ...base, ads: { show: 'yes', reason: 'default' } })?.ads, null)
  assert.equal(parseMe({ ...base, ads: { show: true, reason: 'because' } })?.ads, null)
})
