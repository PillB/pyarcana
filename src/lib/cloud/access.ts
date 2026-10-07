/**
 * Who gets Pro on this page load (DESIGN-v3-delta "Licence token", DESIGN-v2 §8.4).
 *
 * 1. A live /v1/me that answered on this load decides. Revocation therefore applies on the next
 *    reload, and a signed-out answer (401) means free even if a licence is cached.
 * 2. Only when /v1/me could not be reached (network, timeout, 5xx): the cached licence token,
 *    verified offline against the pinned keys and bound to the cached account, gives Pro while it
 *    verifies. The cached `me` itself is display-only and never grants anything.
 * 3. Otherwise free. 'unknown' until 1 or 2 resolves, so the upsell never flashes at a Pro user.
 */
import type { LaunchStage, LicencePublicKey } from '@/lib/cloud/config'
import { verifyLicence, LICENCE_SKEW_SECONDS } from '@/lib/cloud/licence'

export type AccessState = 'unknown' | 'pro' | 'free'
/** Outcome of this page load's GET /v1/me. */
export type MeStatus = 'idle' | 'pending' | 'ok' | 'signed_out' | 'unavailable' | 'error'
export type LicenceStatus =
  | { state: 'unchecked' }
  | { state: 'checking' }
  | { state: 'valid'; exp: number }
  | { state: 'invalid' }

export interface AccessInput {
  stage: LaunchStage
  meStatus: MeStatus
  /** me.access.isPro from THIS load's live response; ignored unless meStatus is 'ok'. */
  liveIsPro: boolean
  licence: LicenceStatus
  nowSeconds: number
}

function fromLicence(licence: LicenceStatus, nowSeconds: number): AccessState {
  if (licence.state === 'valid') return nowSeconds < licence.exp + LICENCE_SKEW_SECONDS ? 'pro' : 'free'
  return licence.state === 'invalid' ? 'free' : 'unknown'
}

export function resolveAccessState(input: AccessInput): AccessState {
  if (input.stage === 'off') return 'free'
  switch (input.meStatus) {
    case 'ok':
      return input.liveIsPro ? 'pro' : 'free'
    case 'unavailable':
      return fromLicence(input.licence, input.nowSeconds)
    case 'signed_out':
    case 'error':
      return 'free'
    default:
      return 'unknown'
  }
}

export interface CachedLicenceOptions {
  keys: LicencePublicKey[]
  audience: string | null
  nowSeconds: number
  /** The cached signed-in account; a token for anyone else is refused. */
  accountId: string | null
}

export async function checkCachedLicence(token: string | null, opts: CachedLicenceOptions): Promise<LicenceStatus> {
  if (!token || !opts.accountId || !opts.audience) return { state: 'invalid' }
  const r = await verifyLicence(token, {
    keys: opts.keys,
    audience: opts.audience,
    nowSeconds: opts.nowSeconds,
    expectedSub: opts.accountId,
  })
  return r.ok ? { state: 'valid', exp: r.claims.exp } : { state: 'invalid' }
}
