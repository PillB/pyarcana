import test from 'node:test'
import assert from 'node:assert/strict'
import { verifyLicence, LICENCE_MAX_LIFETIME_SECONDS } from '@/lib/cloud/licence'
import { bytesToB64url, utf8 } from '@/lib/cloud/b64'
import type { LicencePublicKey } from '@/lib/cloud/config'

const AUD = 'https://pyarcana.example'
const NOW = 1_790_000_000

async function makeKey(kid: string) {
  const pair = (await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify'])) as CryptoKeyPair
  const jwk = (await crypto.subtle.exportKey('jwk', pair.publicKey)) as JsonWebKey
  const pub: LicencePublicKey = { kty: 'EC', crv: 'P-256', x: jwk.x!, y: jwk.y!, kid, alg: 'ES256', use: 'sig' }
  const priv = (await crypto.subtle.exportKey('jwk', pair.privateKey)) as JsonWebKey
  return { privateKey: pair.privateKey, pub, privateJwk: { ...priv, kid } }
}

const enc = (o: unknown) => bytesToB64url(utf8(JSON.stringify(o)))

async function sign(privateKey: CryptoKey, header: Record<string, unknown>, payload: Record<string, unknown>) {
  const input = `${enc(header)}.${enc(payload)}`
  const sig = new Uint8Array(await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, utf8(input)))
  return `${input}.${bytesToB64url(sig)}`
}

const baseClaims = () => ({
  iss: 'pyarcana-billing',
  sub: 'acct_123',
  aud: AUD,
  plan: 'pro',
  source: 'trial',
  iat: NOW - 60,
  exp: NOW + 3600,
  indefinite: false,
})
const header = (kid = 'k1') => ({ alg: 'ES256', typ: 'PAL', kid })

let current: Awaited<ReturnType<typeof makeKey>>
let other: Awaited<ReturnType<typeof makeKey>>
test.before(async () => {
  current = await makeKey('k1')
  other = await makeKey('k1') // same kid, different key: a forgery attempt
})

const opts = (extra: Record<string, unknown> = {}) => ({ keys: [current.pub], audience: AUD, nowSeconds: NOW, ...extra })

test('a genuine token verifies and returns its claims', async () => {
  const token = await sign(current.privateKey, header(), baseClaims())
  const r = await verifyLicence(token, opts())
  assert.deepEqual(r, { ok: true, claims: baseClaims() })
})

test('wrong audience is refused, and an unconfigured audience refuses everything', async () => {
  const token = await sign(current.privateKey, header(), { ...baseClaims(), aud: 'https://pillb.github.io' })
  assert.deepEqual(await verifyLicence(token, opts()), { ok: false, reason: 'bad_aud' })
  const good = await sign(current.privateKey, header(), baseClaims())
  assert.deepEqual(await verifyLicence(good, opts({ audience: '' })), { ok: false, reason: 'no_audience' })
})

test('only ES256 is accepted: HS256 and none are refused before any key is used', async () => {
  const hs = await sign(current.privateKey, { ...header(), alg: 'HS256' }, baseClaims())
  assert.deepEqual(await verifyLicence(hs, opts()), { ok: false, reason: 'bad_alg' })
  const none = `${enc({ alg: 'none', typ: 'PAL', kid: 'k1' })}.${enc(baseClaims())}.`
  const r = await verifyLicence(none, opts())
  assert.equal(r.ok, false)
})

test('typ must be PAL', async () => {
  const token = await sign(current.privateKey, { ...header(), typ: 'JWT' }, baseClaims())
  assert.deepEqual(await verifyLicence(token, opts()), { ok: false, reason: 'bad_typ' })
})

test('a kid that is not in the pinned list is refused', async () => {
  const token = await sign(current.privateKey, header('k-unknown'), baseClaims())
  assert.deepEqual(await verifyLicence(token, opts()), { ok: false, reason: 'unknown_kid' })
})

test('a token signed by a different key under a pinned kid is refused', async () => {
  const token = await sign(other.privateKey, header(), baseClaims())
  assert.deepEqual(await verifyLicence(token, opts()), { ok: false, reason: 'bad_signature' })
})

test('changing any claim after signing breaks the signature', async () => {
  const token = await sign(current.privateKey, header(), baseClaims())
  const [h, , s] = token.split('.')
  const forged = `${h}.${enc({ ...baseClaims(), exp: NOW + 10 * 365 * 86400 })}.${s}`
  assert.deepEqual(await verifyLicence(forged, opts()), { ok: false, reason: 'bad_signature' })
})

test('expiry allows 300 s of clock skew and no more', async () => {
  const justExpired = await sign(current.privateKey, header(), { ...baseClaims(), exp: NOW - 299 })
  assert.equal((await verifyLicence(justExpired, opts())).ok, true)
  const expired = await sign(current.privateKey, header(), { ...baseClaims(), exp: NOW - 301 })
  assert.deepEqual(await verifyLicence(expired, opts()), { ok: false, reason: 'expired' })
})

test('a token issued in the future beyond the skew is refused', async () => {
  const token = await sign(current.privateKey, header(), { ...baseClaims(), iat: NOW + 301, exp: NOW + 4000 })
  assert.deepEqual(await verifyLicence(token, opts()), { ok: false, reason: 'not_yet_valid' })
})

test('a lifetime longer than the worker TTL (72 h) is refused', async () => {
  const token = await sign(current.privateKey, header(), { ...baseClaims(), exp: NOW - 60 + LICENCE_MAX_LIFETIME_SECONDS + 1 })
  assert.deepEqual(await verifyLicence(token, opts()), { ok: false, reason: 'too_long' })
  const edge = await sign(current.privateKey, header(), { ...baseClaims(), exp: NOW - 60 + LICENCE_MAX_LIFETIME_SECONDS })
  assert.equal((await verifyLicence(edge, opts())).ok, true)
})

test('issuer, plan, subject and claim types are checked', async () => {
  const cases: Array<[Record<string, unknown>, string]> = [
    [{ iss: 'vocal-entitlements' }, 'bad_iss'],
    [{ plan: 'free' }, 'bad_plan'],
    [{ sub: '' }, 'bad_sub'],
    [{ exp: String(NOW + 60) }, 'bad_claims'],
    [{ indefinite: 'yes' }, 'bad_claims'],
  ]
  for (const [patch, reason] of cases) {
    const token = await sign(current.privateKey, header(), { ...baseClaims(), ...patch })
    assert.deepEqual(await verifyLicence(token, opts()), { ok: false, reason }, JSON.stringify(patch))
  }
})

test('a token for another account than the cached one is refused', async () => {
  const token = await sign(current.privateKey, header(), baseClaims())
  assert.deepEqual(await verifyLicence(token, opts({ expectedSub: 'acct_other' })), { ok: false, reason: 'bad_sub' })
  assert.equal((await verifyLicence(token, opts({ expectedSub: 'acct_123' }))).ok, true)
})

test('rotation: a token signed with the previous pinned key still verifies', async () => {
  const prev = await makeKey('k0')
  const token = await sign(prev.privateKey, header('k0'), baseClaims())
  assert.equal((await verifyLicence(token, opts({ keys: [current.pub, prev.pub] }))).ok, true)
})

test('a private key pasted into the public list is never used', async () => {
  const token = await sign(current.privateKey, header(), baseClaims())
  const r = await verifyLicence(token, opts({ keys: [current.privateJwk as unknown as LicencePublicKey] }))
  assert.deepEqual(r, { ok: false, reason: 'unknown_kid' })
})

test('malformed input is refused without throwing', async () => {
  const good = await sign(current.privateKey, header(), baseClaims())
  const [h, p] = good.split('.')
  const inputs: unknown[] = [
    null,
    42,
    '',
    'a.b',
    `${h}.${p}`,
    `${h}.${p}.***`,
    `${bytesToB64url(utf8('not json'))}.${p}.${good.split('.')[2]}`,
    `${enc([1, 2])}.${p}.${good.split('.')[2]}`,
    `${h}.${p}.${bytesToB64url(new Uint8Array(71))}`, // DER-sized signature, not JWS raw r||s
    `${h}.${p}.${good.split('.')[2]}${'A'.repeat(5000)}`,
  ]
  for (const input of inputs) {
    const r = await verifyLicence(input, opts())
    assert.deepEqual(r, { ok: false, reason: 'malformed' }, String(input).slice(0, 40))
  }
})
