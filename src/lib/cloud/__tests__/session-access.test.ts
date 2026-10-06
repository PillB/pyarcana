import test from 'node:test'
import assert from 'node:assert/strict'
import { parseMe, applyMeResponse, sanitizeCloudPersisted, createCloudSessionStore, createCloudRuntimeStore, refreshMe, CLOUD_SESSION_KEY } from '@/lib/cloud/session'
import { resolveAccessState, checkCachedLicence } from '@/lib/cloud/access'
import { createMemoryStorage } from '@/lib/cloud/storage'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import type { LicencePublicKey } from '@/lib/cloud/config'
import { bytesToB64url, utf8 } from '@/lib/cloud/b64'

const AUD = 'https://pyarcana.example'
const NOW = 1_790_000_000

function mePayload(overrides: Record<string, unknown> = {}) {
  return {
    ok: true,
    account: { id: 'acct_1', email: 'ana@pyarcana.example', emailVerified: true, displayName: 'Ana', isAdmin: false, roles: ['tester'], firstSigninAt: NOW - 86400 },
    access: { isPro: true, source: 'trial', accessEnd: NOW + 6 * 86400, indefinite: false, graceUntil: null, pendingGrantDays: 0, upcoming: [] },
    subscriptions: [],
    grants: [],
    checkoutPending: false,
    serverTime: NOW,
    licenseToken: null,
    ...overrides,
  }
}

// --- parseMe -------------------------------------------------------------------------------

test('parseMe keeps a well-formed payload', () => {
  const me = parseMe(mePayload())!
  assert.equal(me.account.id, 'acct_1')
  assert.deepEqual(me.account.roles, ['tester'])
  assert.equal(me.access.isPro, true)
  assert.equal(me.access.source, 'trial')
})

test('parseMe fails closed: a payload without access reads as not Pro', () => {
  const me = parseMe({ ok: true, account: { id: 'acct_1' }, serverTime: NOW })!
  assert.equal(me.access.isPro, false)
  assert.equal(me.account.isAdmin, false)
  assert.deepEqual(me.account.roles, [])
})

test('parseMe refuses a payload without an account id and drops hostile field types', () => {
  assert.equal(parseMe({ ok: true, account: {} }), null)
  assert.equal(parseMe('nope'), null)
  const me = parseMe(mePayload({
    account: { id: 'acct_1', isAdmin: 'true', roles: ['tester', 7, { x: 1 }] },
    access: { isPro: 'yes' },
    licenseToken: '<script>',
  }))!
  assert.equal(me.account.isAdmin, false)
  assert.deepEqual(me.account.roles, ['tester'])
  assert.equal(me.access.isPro, false)
  assert.equal(me.licenseToken, null)
})

test('a provider manage link reaches the page only as https', () => {
  const me = parseMe(mePayload({
    subscriptions: [
      { id: 'sub_1', provider: 'creem', manageUrl: 'javascript:alert(document.cookie)' },
      { id: 'sub_2', provider: 'mercadopago', manageUrl: 'https://www.mercadopago.com.pe/subscriptions' },
      { id: 'sub_3', provider: 'creem', manageUrl: 'http://creem.example/portal' },
      { provider: 'no-id' },
    ],
  }))!
  assert.deepEqual(me.subscriptions.map((s) => [s.id, s.manageUrl]), [
    ['sub_1', null],
    ['sub_2', 'https://www.mercadopago.com.pe/subscriptions'],
    ['sub_3', null],
  ])
})

// --- applyMeResponse -------------------------------------------------------------------------

const ok = (data: unknown): ApiResult<Record<string, unknown>> => ({ ok: true, status: 200, data: data as Record<string, unknown> })
const fail = (status: number, reason: string): ApiResult<Record<string, unknown>> => ({ ok: false, status, reason, data: null })

test('a live 200 stores me and the licence token', () => {
  const r = applyMeResponse(ok(mePayload({ licenseToken: 'aaa.bbb.ccc' })), NOW * 1000)
  assert.equal(r.status, 'ok')
  assert.equal(r.next.me!.account.id, 'acct_1')
  assert.equal(r.next.licenseToken, 'aaa.bbb.ccc')
  assert.equal(r.next.fetchedAt, NOW * 1000)
})

test('a 401 signs out locally: me and licence dropped, progress owner kept', () => {
  const r = applyMeResponse(fail(401, 'unauthorized'), NOW * 1000)
  assert.equal(r.status, 'signed_out')
  assert.equal(r.next.me, null)
  assert.equal(r.next.licenseToken, null)
  assert.equal('progressOwner' in r.next, false)
})

test('network failure and 5xx keep the cache and report unavailable', () => {
  for (const res of [fail(0, 'network'), fail(0, 'timeout'), fail(503, 'http_503')]) {
    const r = applyMeResponse(res, NOW * 1000)
    assert.equal(r.status, 'unavailable')
    assert.deepEqual(r.next, {})
  }
})

test('a 200 with an unreadable body is treated as unavailable, not as signed out', () => {
  assert.equal(applyMeResponse(ok({ ok: true }), 0).status, 'unavailable')
})

test('another refusal (403, 429) is an error: cache kept, not Pro', () => {
  const r = applyMeResponse(fail(403, 'bad_origin'), 0)
  assert.equal(r.status, 'error')
  assert.deepEqual(r.next, {})
})

// --- persisted state -------------------------------------------------------------------------

test('persisted state is sanitized on the way in', () => {
  const clean = sanitizeCloudPersisted({
    me: { account: { id: 'acct_1' }, access: { isPro: true } },
    licenseToken: 'not a jws',
    progressOwner: 42,
    lastSyncAt: 'yesterday',
    fetchedAt: NOW,
    extra: 'dropped',
  })
  assert.equal(clean.me!.account.id, 'acct_1')
  assert.equal(clean.licenseToken, null)
  assert.equal(clean.progressOwner, null)
  assert.equal(clean.lastSyncAt, null)
  assert.equal(clean.fetchedAt, NOW)
  assert.equal('extra' in clean, false)
})

test('the session store persists under pyarcana-cloud-v1 and holds no secret beyond the signed licence', () => {
  const storage = createMemoryStorage()
  const store = createCloudSessionStore(() => storage)
  store.setState({ me: parseMe(mePayload()), licenseToken: 'aaa.bbb.ccc', progressOwner: 'acct_1', lastSyncAt: 5 })
  const saved = JSON.parse(storage.getItem(CLOUD_SESSION_KEY)!)
  assert.deepEqual(Object.keys(saved.state).sort(), ['fetchedAt', 'lastSyncAt', 'licenseToken', 'me', 'progressOwner'])
  assert.doesNotMatch(storage.getItem(CLOUD_SESSION_KEY)!, /session|cookie|pa_session|token_hash/i)
  const again = createCloudSessionStore(() => storage)
  assert.equal(again.getState().progressOwner, 'acct_1')
})

// --- resolveAccessState ----------------------------------------------------------------------

const base = { stage: 'beta' as const, liveIsPro: false, licence: { state: 'unchecked' as const }, nowSeconds: NOW }

test('access is unknown until /v1/me resolves (never flash the upsell)', () => {
  assert.equal(resolveAccessState({ ...base, meStatus: 'idle' }), 'unknown')
  assert.equal(resolveAccessState({ ...base, meStatus: 'pending' }), 'unknown')
})

test('a live /v1/me wins over any cached licence (revocation applies on the next load)', () => {
  const licence = { state: 'valid' as const, exp: NOW + 3600 }
  assert.equal(resolveAccessState({ ...base, meStatus: 'ok', liveIsPro: true }), 'pro')
  assert.equal(resolveAccessState({ ...base, meStatus: 'ok', liveIsPro: false, licence }), 'free')
  assert.equal(resolveAccessState({ ...base, meStatus: 'signed_out', licence }), 'free')
  assert.equal(resolveAccessState({ ...base, meStatus: 'error', licence }), 'free')
})

test('with the worker unavailable, only a verified licence gives Pro, and only until it expires', () => {
  assert.equal(resolveAccessState({ ...base, meStatus: 'unavailable', liveIsPro: true }), 'unknown')
  assert.equal(resolveAccessState({ ...base, meStatus: 'unavailable', licence: { state: 'checking' } }), 'unknown')
  assert.equal(resolveAccessState({ ...base, meStatus: 'unavailable', licence: { state: 'invalid' } }), 'free')
  assert.equal(resolveAccessState({ ...base, meStatus: 'unavailable', licence: { state: 'valid', exp: NOW + 10 } }), 'pro')
  assert.equal(resolveAccessState({ ...base, meStatus: 'unavailable', licence: { state: 'valid', exp: NOW - 301 } }), 'free')
})

test('stage off never computes access', () => {
  assert.equal(resolveAccessState({ ...base, stage: 'off', meStatus: 'ok', liveIsPro: true }), 'free')
})

// --- refreshMe end to end with a real signed licence ----------------------------------------

async function signer() {
  const pair = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])) as CryptoKeyPair
  const jwk = (await crypto.subtle.exportKey('jwk', pair.publicKey)) as JsonWebKey
  const pub: LicencePublicKey = { kty: 'EC', crv: 'P-256', x: jwk.x!, y: jwk.y!, kid: 'k1' }
  const enc = (o: unknown) => bytesToB64url(utf8(JSON.stringify(o)))
  const token = async (sub: string) => {
    const input = `${enc({ alg: 'ES256', typ: 'PAL', kid: 'k1' })}.${enc({ iss: 'pyarcana-billing', sub, aud: AUD, plan: 'pro', source: 'gift', iat: NOW - 10, exp: NOW + 3600, indefinite: false })}`
    const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, pair.privateKey, utf8(input)))
    return `${input}.${bytesToB64url(sig)}`
  }
  return { pub, token }
}

function fakeApi(result: ApiResult<Record<string, unknown>>): ApiClient {
  const r = async () => result as never
  return { get: r, post: r, put: r, patch: r, del: r }
}

async function run(cached: Record<string, unknown>, result: ApiResult<Record<string, unknown>>, keys: LicencePublicKey[]) {
  const storage = createMemoryStorage({ [CLOUD_SESSION_KEY]: JSON.stringify({ state: cached, version: 1 }) })
  const session = createCloudSessionStore(() => storage)
  const runtime = createCloudRuntimeStore()
  await refreshMe({ api: fakeApi(result), session, runtime, keys, audience: AUD, now: () => NOW * 1000 })
  const s = session.getState()
  const rt = runtime.getState()
  return resolveAccessState({ stage: 'beta', meStatus: rt.meStatus, liveIsPro: s.me?.access.isPro === true, licence: rt.licence, nowSeconds: NOW })
}

test('offline with a genuine cached licence for the cached account: Pro', async () => {
  const { pub, token } = await signer()
  const cached = { me: mePayload(), licenseToken: await token('acct_1') }
  assert.equal(await run(cached, fail(0, 'network'), [pub]), 'pro')
})

test('the v3 attack: edit cached me to Pro and block the worker -> still free', async () => {
  const { pub } = await signer()
  const cached = { me: mePayload({ access: { isPro: true, source: 'paid', accessEnd: NOW + 9e8 } }), licenseToken: null }
  assert.equal(await run(cached, fail(0, 'network'), [pub]), 'free')
})

test('offline with a licence minted for a different account: free', async () => {
  const { pub, token } = await signer()
  const cached = { me: mePayload(), licenseToken: await token('acct_someone_else') }
  assert.equal(await run(cached, fail(503, 'http_503'), [pub]), 'free')
})

test('a live free answer revokes a still-valid cached licence', async () => {
  const { pub, token } = await signer()
  const cached = { me: mePayload(), licenseToken: await token('acct_1') }
  const live = ok(mePayload({ access: { isPro: false }, licenseToken: null }))
  assert.equal(await run(cached, live, [pub]), 'free')
})

test('checkCachedLicence refuses without a token or without a cached account', async () => {
  const { pub, token } = await signer()
  const t = await token('acct_1')
  assert.deepEqual(await checkCachedLicence(null, { keys: [pub], audience: AUD, nowSeconds: NOW, accountId: 'acct_1' }), { state: 'invalid' })
  assert.deepEqual(await checkCachedLicence(t, { keys: [pub], audience: AUD, nowSeconds: NOW, accountId: null }), { state: 'invalid' })
  assert.deepEqual(await checkCachedLicence(t, { keys: [pub], audience: AUD, nowSeconds: NOW, accountId: 'acct_1' }), { state: 'valid', exp: NOW + 3600 })
})
