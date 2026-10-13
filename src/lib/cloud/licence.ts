/**
 * Offline verification of the PyArcana licence token (PAL), DESIGN-v3-delta "Licence token
 * REINSTATED" (D-ORCH-03).
 *
 * The cached /v1/me in localStorage is display-only: anyone can edit it. When the worker cannot be
 * reached, Pro is granted only by a token the worker signed with ES256 and that verifies against
 * the public keys pinned in config: header alg ES256, typ PAL, kid in the pinned list; claims
 * iss 'pyarcana-billing', aud = canonical origin, plan 'pro', exp/iat within ±300 s, and a
 * lifetime no longer than the worker's TTL (72 h).
 *
 * Token: compact JWS. header {alg:'ES256', typ:'PAL', kid}; payload {iss, sub, aud, plan, source,
 * iat, exp, indefinite}; signature = raw r||s (64 bytes, RFC 7518 §3.4), which is the format
 * WebCrypto's ECDSA verify expects.
 */
import { b64urlToBytes, fromUtf8, utf8, type Bytes } from '@/lib/cloud/b64'
import type { LicencePublicKey } from '@/lib/cloud/config'
import { isPlainObject } from '@/lib/cloud/storage'

export const LICENCE_ISSUER = 'pyarcana-billing'
export const LICENCE_TYPE = 'PAL'
export const LICENCE_SKEW_SECONDS = 300
export const LICENCE_MAX_LIFETIME_SECONDS = 72 * 3600
const MAX_TOKEN_LENGTH = 4096

export interface LicenceClaims {
  iss: string
  sub: string
  aud: string
  plan: 'pro'
  source: string
  iat: number
  exp: number
  indefinite: boolean
}

export type LicenceReason =
  | 'malformed'
  | 'no_audience'
  | 'bad_alg'
  | 'bad_typ'
  | 'unknown_kid'
  | 'bad_signature'
  | 'bad_claims'
  | 'bad_iss'
  | 'bad_aud'
  | 'bad_plan'
  | 'bad_sub'
  | 'expired'
  | 'not_yet_valid'
  | 'too_long'

export type LicenceResult = { ok: true; claims: LicenceClaims } | { ok: false; reason: LicenceReason }

export interface VerifyOptions {
  keys: LicencePublicKey[]
  audience: string
  nowSeconds: number
  /** When set, the token must be for this account (the cached signed-in account). */
  expectedSub?: string | null
}

interface Decoded {
  header: Record<string, unknown>
  payload: Record<string, unknown>
  signingInput: Bytes
  signature: Bytes
}

function decodeJsonPart(part: string): Record<string, unknown> | null {
  const bytes = b64urlToBytes(part)
  if (!bytes) return null
  try {
    const value = JSON.parse(fromUtf8(bytes)) as unknown
    return isPlainObject(value) ? value : null
  } catch {
    return null
  }
}

function decode(token: unknown): Decoded | null {
  if (typeof token !== 'string' || token.length > MAX_TOKEN_LENGTH) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  const header = decodeJsonPart(parts[0])
  const payload = decodeJsonPart(parts[1])
  const signature = b64urlToBytes(parts[2])
  if (!header || !payload || !signature || signature.length !== 64) return null
  return { header, payload, signingInput: utf8(`${parts[0]}.${parts[1]}`), signature }
}

/** Keys that are well-formed public P-256 keys. A pasted private key (with `d`) is never used. */
export function usableKeys(keys: LicencePublicKey[]): LicencePublicKey[] {
  return keys.filter(
    (k) =>
      isPlainObject(k) &&
      k.kty === 'EC' &&
      k.crv === 'P-256' &&
      typeof k.x === 'string' &&
      typeof k.y === 'string' &&
      typeof k.kid === 'string' &&
      (k.alg === undefined || k.alg === 'ES256') &&
      !('d' in k)
  )
}

function checkHeader(header: Record<string, unknown>, keys: LicencePublicKey[]): LicenceReason | LicencePublicKey {
  if (header.alg !== 'ES256') return 'bad_alg'
  if (header.typ !== LICENCE_TYPE) return 'bad_typ'
  const key = usableKeys(keys).find((k) => k.kid === header.kid)
  return key ?? 'unknown_kid'
}

async function signatureValid(key: LicencePublicKey, d: Decoded): Promise<boolean> {
  try {
    const cryptoKey = await globalThis.crypto.subtle.importKey(
      'jwk',
      { kty: 'EC', crv: 'P-256', x: key.x, y: key.y, ext: true },
      { name: 'ECDSA', namedCurve: 'P-256' },
      false,
      ['verify']
    )
    return await globalThis.crypto.subtle.verify({ name: 'ECDSA', hash: 'SHA-256' }, cryptoKey, d.signature, d.signingInput)
  } catch {
    return false
  }
}

function claimsShaped(p: Record<string, unknown>): boolean {
  return (
    typeof p.iat === 'number' &&
    typeof p.exp === 'number' &&
    Number.isFinite(p.iat) &&
    Number.isFinite(p.exp) &&
    typeof p.indefinite === 'boolean' &&
    typeof p.source === 'string'
  )
}

type ClaimRule = [LicenceReason, (p: Record<string, unknown>, o: VerifyOptions) => boolean]

/** Checked in order after the signature; the first failing rule names the reason. */
const CLAIM_RULES: ClaimRule[] = [
  ['bad_claims', (p) => claimsShaped(p)],
  ['bad_iss', (p) => p.iss === LICENCE_ISSUER],
  ['bad_aud', (p, o) => p.aud === o.audience],
  ['bad_plan', (p) => p.plan === 'pro'],
  ['bad_sub', (p, o) => typeof p.sub === 'string' && p.sub !== '' && (!o.expectedSub || p.sub === o.expectedSub)],
  ['expired', (p, o) => o.nowSeconds < (p.exp as number) + LICENCE_SKEW_SECONDS],
  ['not_yet_valid', (p, o) => (p.iat as number) <= o.nowSeconds + LICENCE_SKEW_SECONDS],
  ['too_long', (p) => (p.exp as number) - (p.iat as number) <= LICENCE_MAX_LIFETIME_SECONDS],
]

export async function verifyLicence(token: unknown, options: VerifyOptions): Promise<LicenceResult> {
  if (!options.audience) return { ok: false, reason: 'no_audience' }
  const decoded = decode(token)
  if (!decoded) return { ok: false, reason: 'malformed' }
  const key = checkHeader(decoded.header, options.keys)
  if (typeof key === 'string') return { ok: false, reason: key }
  if (!(await signatureValid(key, decoded))) return { ok: false, reason: 'bad_signature' }
  const failed = CLAIM_RULES.find(([, rule]) => !rule(decoded.payload, options))
  if (failed) return { ok: false, reason: failed[0] }
  return { ok: true, claims: decoded.payload as unknown as LicenceClaims }
}

/** Cheap shape check for values read back from storage (not a verification). */
export function looksLikeJws(value: unknown): value is string {
  return typeof value === 'string' && value.length <= MAX_TOKEN_LENGTH && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value)
}
