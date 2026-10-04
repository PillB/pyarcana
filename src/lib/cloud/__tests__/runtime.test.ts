import test from 'node:test'
import assert from 'node:assert/strict'
import { SyncController, type SyncLike } from '@/lib/cloud/sync-controller'
import { Measurement, BOUND_KEY, type MeasurementContext } from '@/lib/cloud/measurement'
import { buildCsp, LEGACY_CSP } from '@/lib/cloud/csp'
import { CLOUD_CONFIG, type CloudConfig } from '@/lib/cloud/config'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { createMemoryStorage } from '@/lib/cloud/storage'
import { CID_KEY, assignArm } from '@/lib/cloud/experiments'

// --- SyncController: page events -> ProgressSync ----------------------------------------------------

function fakeSync() {
  const log: string[] = []
  const sync: SyncLike = {
    attach: () => void log.push('attach'),
    detach: () => void log.push('detach'),
    start: async (id: string) => (log.push(`start:${id}`), 'synced'),
    pull: async () => (log.push('pull'), 'synced'),
    flush: async () => (log.push('flush'), 'synced'),
    pushNow: async () => (log.push('pushNow'), 'synced'),
    signOut: async () => void log.push('signOut'),
  }
  return { sync, log }
}

function fakeTarget() {
  const listeners = new Map<string, Set<() => void>>()
  return {
    visibilityState: 'visible' as string,
    addEventListener: (type: string, fn: () => void) => {
      if (!listeners.has(type)) listeners.set(type, new Set())
      listeners.get(type)!.add(fn)
    },
    removeEventListener: (type: string, fn: () => void) => void listeners.get(type)?.delete(fn),
    fire: (type: string) => listeners.get(type)?.forEach((fn) => fn()),
    count: () => [...listeners.values()].reduce((n, s) => n + s.size, 0),
  }
}

test('mounting records local changes even while signed out; sign-in starts sync once per account', async () => {
  const { sync, log } = fakeSync()
  const doc = fakeTarget()
  const win = fakeTarget()
  const c = new SyncController({ sync, doc, win })
  const unmount = c.mount()
  assert.deepEqual(log, ['attach'])
  c.setAccount('acct_a')
  c.setAccount('acct_a')
  assert.deepEqual(log, ['attach', 'start:acct_a'])
  c.setAccount(null)
  assert.deepEqual(log, ['attach', 'start:acct_a', 'signOut'], 'sign-out flushes and keeps local progress (ProgressSync.signOut)')
  c.setAccount(null)
  assert.equal(log.filter((l) => l === 'signOut').length, 1)
  unmount()
  assert.equal(doc.count() + win.count(), 0, 'listeners removed')
})

test('hidden and pagehide flush; visible pulls, but only for a signed-in account', () => {
  const { sync, log } = fakeSync()
  const doc = fakeTarget()
  const win = fakeTarget()
  const c = new SyncController({ sync, doc, win })
  c.mount()
  doc.fire('visibilitychange') // visible, signed out
  assert.deepEqual(log, ['attach'])
  c.setAccount('acct_a')
  doc.visibilityState = 'hidden'
  doc.fire('visibilitychange')
  win.fire('pagehide')
  doc.visibilityState = 'visible'
  doc.fire('visibilitychange')
  assert.deepEqual(log, ['attach', 'start:acct_a', 'flush', 'flush', 'pull'])
})

test('a different account on the same page starts sync for it (the owner rule then decides merge or ask)', () => {
  const { sync, log } = fakeSync()
  const c = new SyncController({ sync, doc: fakeTarget(), win: fakeTarget() })
  c.mount()
  c.setAccount('acct_a')
  c.setAccount('acct_b')
  assert.deepEqual(log, ['attach', 'start:acct_a', 'start:acct_b'])
})

// --- Measurement: experiments, exposure, events --------------------------------------------------------

const EXP = { experiments: [{ key: 'ads_house_v1', arms: ['none', 'house'], weights: [1, 1], surface: 'ad_slot' }] }

function fakeApi(experiments: unknown = EXP) {
  const calls: Array<{ method: string; path: string; body?: unknown; keepalive?: boolean }> = []
  const answer = (path: string): ApiResult<Record<string, unknown>> =>
    path === '/v1/experiments' ? { ok: true, status: 200, data: experiments as Record<string, unknown> } : { ok: true, status: 200, data: {} }
  const api = {
    get: async (path: string) => (calls.push({ method: 'GET', path }), answer(path)),
    post: async (path: string, body: unknown, opts?: { keepalive?: boolean }) => (calls.push({ method: 'POST', path, body, keepalive: opts?.keepalive }), answer(path)),
  } as unknown as ApiClient
  return { api, calls }
}

const ctx = (p: Partial<MeasurementContext> = {}): MeasurementContext => ({
  canMeasure: true, signals: { gpc: false, dnt: false }, webdriver: false, allowAutomation: false, qaMode: false,
  isAdmin: false, isTester: false, access: 'free', ...p,
})

test('experiments are fetched once (public, no id) so the consent card knows whether to ask', async () => {
  const { api, calls } = fakeApi()
  const m = new Measurement({ api, storage: createMemoryStorage(), context: () => ctx({ canMeasure: false }), search: () => '' })
  assert.equal((await m.experiments()).length, 1)
  await m.experiments()
  assert.deepEqual(calls, [{ method: 'GET', path: '/v1/experiments' }])
  const broken = new Measurement({ api: fakeApi({ nope: 1 }).api, storage: null, context: () => ctx(), search: () => '' })
  assert.deepEqual(await broken.experiments(), [])
})

test('an enrolled visitor gets an arm and one exposure; no consent means control, no id and no events', async () => {
  const storage = createMemoryStorage()
  const { api, calls } = fakeApi()
  const m = new Measurement({ api, storage, context: () => ctx(), search: () => '' })
  const arm = await m.arm('ads_house_v1')
  assert.ok(arm === 'none' || arm === 'house')
  await m.arm('ads_house_v1')
  await m.flush(false)
  const sent = calls.filter((c) => c.path === '/v1/events')
  assert.equal(sent.length, 1)
  const body = sent[0].body as { cid: string; events: Array<{ name: string; arm: string }> }
  assert.match(body.cid, /^[0-9a-f]{32}$/)
  assert.deepEqual(body.events.map((e) => [e.name, e.arm]), [['exposure', arm]], 'exposure once, in whichever arm')

  const quiet = createMemoryStorage()
  const q = fakeApi()
  const noConsent = new Measurement({ api: q.api, storage: quiet, context: () => ctx({ canMeasure: false }), search: () => '' })
  assert.equal(await noConsent.arm('ads_house_v1'), 'none', 'control arm')
  noConsent.track({ name: 'house_ad_view' })
  await noConsent.flush(false)
  assert.equal(quiet.getItem(CID_KEY), null, 'no measurement id without consent')
  assert.equal(q.calls.filter((c) => c.path === '/v1/events').length, 0)
})

test('a disabled experiment has no arm; QA mode and automation send nothing', async () => {
  const m = new Measurement({ api: fakeApi({ experiments: [] }).api, storage: createMemoryStorage(), context: () => ctx(), search: () => '' })
  assert.equal(await m.arm('ads_house_v1'), null)
  for (const p of [{ qaMode: true }, { webdriver: true }, { signals: { gpc: true, dnt: false } }]) {
    const { api, calls } = fakeApi()
    const x = new Measurement({ api, storage: createMemoryStorage(), context: () => ctx(p), search: () => '' })
    await x.arm('ads_house_v1')
    x.track({ name: 'house_ad_click' })
    await x.flush(false)
    assert.equal(calls.filter((c) => c.path === '/v1/events').length, 0, JSON.stringify(p))
  }
})

test('the page-hide flush uses keepalive; binding the id to the account happens once per account', async () => {
  const storage = createMemoryStorage()
  const { api, calls } = fakeApi()
  const m = new Measurement({ api, storage, context: () => ctx(), search: () => '' })
  m.track({ name: 'session_start' })
  await m.flush(true)
  assert.equal(calls.find((c) => c.path === '/v1/events')?.keepalive, true)
  await m.bind('acct_1')
  await m.bind('acct_1')
  const binds = calls.filter((c) => c.path === '/v1/me/experiments/bind')
  assert.equal(binds.length, 1)
  assert.deepEqual(binds[0].body, { cid: storage.getItem(CID_KEY) })
  assert.notEqual(storage.getItem(BOUND_KEY), null)
  const none = new Measurement({ api, storage: createMemoryStorage(), context: () => ctx({ canMeasure: false }), search: () => '' })
  await none.bind('acct_2')
  assert.equal(calls.filter((c) => c.path === '/v1/me/experiments/bind').length, 1, 'no id, nothing to bind')
})

test('the account\'s stored arm (from bind) wins over the id-derived arm, for the signed-in account only (DESIGN-v3 §F)', async () => {
  // Review round 1: bind's {arms} answer was discarded, so a second device showed the other arm.
  const exp = EXP.experiments[0]
  const storage = createMemoryStorage()
  let cid = ''
  for (let i = 0; ; i++) {
    cid = i.toString(16).padStart(32, '0')
    if (assignArm(cid, exp) === 'none') break
  }
  storage.setItem(CID_KEY, cid)
  const calls: string[] = []
  const api = {
    get: async () => ({ ok: true, status: 200, data: EXP }),
    post: async (path: string) => {
      calls.push(path)
      if (path === '/v1/me/experiments/bind') return { ok: true, status: 200, data: { ok: true, arms: { ads_house_v1: 'house', other_exp: 'x', bad: 3 } } }
      return { ok: true, status: 200, data: {} }
    },
  } as unknown as ApiClient
  let account: string | null = 'acct_1'
  const m = new Measurement({ api, storage, context: () => ctx(), search: () => '', accountId: () => account })
  await m.bind('acct_1')
  assert.equal(await m.arm('ads_house_v1'), 'house', 'the account keeps its first stored arm on this device')
  await m.flush(false)
  const again = new Measurement({ api, storage, context: () => ctx(), search: () => '', accountId: () => account })
  await again.bind('acct_1')
  assert.equal(calls.filter((c) => c === '/v1/me/experiments/bind').length, 1, 'still bound once per account and id')
  assert.equal(await again.arm('ads_house_v1'), 'house')
  account = 'acct_2'
  assert.equal(await again.arm('ads_house_v1'), 'none', 'another account does not inherit acct_1\'s arm')
  account = 'acct_1'
  const forced = new Measurement({ api, storage, context: () => ctx(), search: () => '?ab_ads_house_v1=none', accountId: () => account })
  assert.equal(await forced.arm('ads_house_v1'), 'none', 'a forced arm (QA) still wins')
  const excluded = new Measurement({ api, storage, context: () => ctx({ canMeasure: false }), search: () => '', accountId: () => account })
  assert.equal(await excluded.arm('ads_house_v1'), 'none', 'an excluded visitor still gets control')
})

test('a device bound before arms were kept binds once more to fetch them', async () => {
  const storage = createMemoryStorage()
  const calls: string[] = []
  const api = {
    get: async () => ({ ok: true, status: 200, data: EXP }),
    post: async (path: string) => (calls.push(path), { ok: true, status: 200, data: { ok: true, arms: { ads_house_v1: 'house' } } }),
  } as unknown as ApiClient
  const m = new Measurement({ api, storage, context: () => ctx(), search: () => '', accountId: () => 'acct_1' })
  await m.arm('ads_house_v1')
  storage.setItem(BOUND_KEY, JSON.stringify({ cid: storage.getItem(CID_KEY), account: 'acct_1' }))
  await m.bind('acct_1')
  await m.bind('acct_1')
  assert.equal(calls.filter((c) => c === '/v1/me/experiments/bind').length, 1)
})

test('a stored account arm that is not one of the experiment\'s arms is ignored', async () => {
  const storage = createMemoryStorage()
  const api = {
    get: async () => ({ ok: true, status: 200, data: EXP }),
    post: async (path: string) => ({ ok: true, status: 200, data: path.endsWith('/bind') ? { ok: true, arms: { ads_house_v1: 'retired_arm' } } : {} }),
  } as unknown as ApiClient
  const m = new Measurement({ api, storage, context: () => ctx(), search: () => '', accountId: () => 'acct_1' })
  await m.bind('acct_1')
  const arm = await m.arm('ads_house_v1')
  assert.equal(arm, assignArm(storage.getItem(CID_KEY)!, EXP.experiments[0]))
})

// --- CSP ------------------------------------------------------------------------------------------------

const cfg = (p: Partial<CloudConfig> = {}): CloudConfig => ({ ...CLOUD_CONFIG, ...p })
const directive = (csp: string, name: string) => csp.split('; ').find((d) => d.startsWith(`${name} `)) ?? ''

test('the shipped config produces exactly the CSP the site ships today', () => {
  assert.equal(buildCsp(CLOUD_CONFIG), LEGACY_CSP)
  assert.match(LEGACY_CSP, /^default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:\/\/cdn.jsdelivr.net;/)
  assert.equal(buildCsp(cfg({ googleClientId: 'x.apps.googleusercontent.com' })), LEGACY_CSP, 'stage off adds nothing')
})

test('with accounts on, each configured provider adds only its own hosts', () => {
  const on = cfg({ launchStage: 'sync', googleClientId: 'x.apps.googleusercontent.com', microsoftClientId: 'm', apiBaseUrl: 'http://localhost:8787' })
  const csp = buildCsp(on)
  assert.match(directive(csp, 'script-src'), /https:\/\/accounts.google.com\/gsi\/client/)
  assert.match(directive(csp, 'style-src'), /https:\/\/accounts.google.com\/gsi\/style/)
  assert.equal(directive(csp, 'frame-src'), "frame-src 'self' https://accounts.google.com/gsi/")
  assert.match(directive(csp, 'connect-src'), /https:\/\/login.microsoftonline.com/)
  assert.match(directive(csp, 'connect-src'), /http:\/\/localhost:8787/)
  assert.doesNotMatch(csp, /googlesyndication|ethicalads/, 'house ads add no network host')
  const sameOrigin = buildCsp(cfg({ launchStage: 'sync', apiBaseUrl: '/api', googleClientId: '', microsoftClientId: '' }))
  assert.equal(sameOrigin, LEGACY_CSP, "a same-origin API needs nothing beyond 'self'")
})

test('ad networks add their hosts only when that provider is enabled with its id', () => {
  const adsense = buildCsp(cfg({ launchStage: 'beta', ads: { ...CLOUD_CONFIG.ads, provider: 'adsense', adsenseClient: 'ca-pub-1' } }))
  assert.match(directive(adsense, 'script-src'), /https:\/\/pagead2.googlesyndication.com/)
  assert.match(directive(adsense, 'frame-src'), /https:\/\/googleads.g.doubleclick.net/)
  const noId = buildCsp(cfg({ launchStage: 'beta', ads: { ...CLOUD_CONFIG.ads, provider: 'adsense', adsenseClient: '' } }))
  assert.doesNotMatch(noId, /googlesyndication/)
  const ea = buildCsp(cfg({ launchStage: 'beta', ads: { ...CLOUD_CONFIG.ads, provider: 'ethicalads', ethicaladsPublisher: 'pyarcana' } }))
  assert.match(directive(ea, 'script-src'), /https:\/\/media.ethicalads.io/)
  assert.match(directive(ea, 'connect-src'), /https:\/\/server.ethicalads.io/)
})
