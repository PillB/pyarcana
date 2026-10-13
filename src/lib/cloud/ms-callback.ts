/**
 * Completing the Microsoft redirect on /cuenta (DESIGN-v3 §B): authorization code + PKCE from the
 * browser. The page strips the fragment first (history.replaceState) and then calls this with the
 * hash it read.
 *
 * Order matters and is tested: nothing is consumed unless the fragment carries a provider answer;
 * the state we stored must come back before the code is used; the code is redeemed with
 * credentials 'omit'; only the id_token and the nonce PREIMAGE go to the worker (the access token
 * is discarded). A sign-in carries the age confirmation the learner gave before the redirect (the
 * button is disabled until the box is ticked) and the configured terms version.
 */
import type { ApiClient, ApiFail } from '@/lib/cloud/api'
import { buildTokenRequest, extractIdToken, microsoftRedirectUri, parseAuthResponse, takePending, type MicrosoftPurpose } from '@/lib/cloud/oidc'
import type { KeyValueStorage } from '@/lib/cloud/storage'

export interface MsCallbackDeps {
  hash: string
  session: KeyValueStorage | null
  nowMs: number
  cfg: { canonicalOrigin: string; microsoftClientId: string; microsoftAuthority: string; termsVersion: string }
  fetch: typeof fetch
  api: ApiClient
}

type FailReason =
  | 'no_response'
  | 'no_pending'
  | 'state_mismatch'
  | 'provider_error'
  | 'tenant_blocked'
  | 'missing_code'
  | 'token_failed'
  | 'no_id_token'
  | 'not_configured'

export type MsCallbackResult =
  | { ok: true; purpose: MicrosoftPurpose; returnTo: string; data: Record<string, unknown> }
  | { ok: false; reason: FailReason; returnTo: string }
  | { ok: false; reason: 'api'; result: ApiFail; returnTo: string }

const TOKEN_TIMEOUT_MS = 8000

async function redeem(d: MsCallbackDeps, code: string, verifier: string, redirectUri: string): Promise<string | null | 'failed'> {
  const { url, init } = buildTokenRequest({ authority: d.cfg.microsoftAuthority, clientId: d.cfg.microsoftClientId, redirectUri, code, verifier })
  try {
    const res = await d.fetch(url, { ...init, signal: AbortSignal.timeout(TOKEN_TIMEOUT_MS) })
    if (!res.ok) return 'failed'
    return extractIdToken(await res.json())
  } catch {
    return 'failed'
  }
}

export async function completeMicrosoftCallback(d: MsCallbackDeps): Promise<MsCallbackResult> {
  const probe = parseAuthResponse(d.hash, null)
  if (!probe.ok && probe.reason === 'no_response') return { ok: false, reason: 'no_response', returnTo: '/' }
  const pending = takePending(d.session, d.nowMs)
  if (!pending) return { ok: false, reason: 'no_pending', returnTo: '/' }
  const back = pending.returnTo
  const auth = parseAuthResponse(d.hash, pending.state)
  if (!auth.ok) {
    const tenantBlocked = auth.reason === 'provider_error' && auth.kind === 'tenant_blocked'
    return { ok: false, reason: tenantBlocked ? 'tenant_blocked' : auth.reason, returnTo: back }
  }
  const redirectUri = microsoftRedirectUri(d.cfg.canonicalOrigin)
  if (!redirectUri || !d.cfg.microsoftClientId) return { ok: false, reason: 'not_configured', returnTo: back }
  const idToken = await redeem(d, auth.code, pending.verifier, redirectUri)
  if (idToken === 'failed') return { ok: false, reason: 'token_failed', returnTo: back }
  if (idToken === null) return { ok: false, reason: 'no_id_token', returnTo: back }
  const link = pending.purpose === 'link'
  const body = link
    ? { idToken, noncePreimage: pending.noncePreimage }
    : { idToken, noncePreimage: pending.noncePreimage, ageConfirmed: true, termsVersion: d.cfg.termsVersion }
  const result = await d.api.post(link ? '/v1/me/link/microsoft' : '/v1/auth/microsoft', body)
  if (!result.ok) return { ok: false, reason: 'api', result, returnTo: back }
  return { ok: true, purpose: pending.purpose, returnTo: back, data: result.data }
}

const FAIL_KEYS: Partial<Record<FailReason, string>> = {
  no_pending: 'cuenta.ms.expired',
  state_mismatch: 'cuenta.ms.expired',
  provider_error: 'cuenta.ms.cancelled',
  tenant_blocked: 'cuenta.ms.tenantBlocked',
}

/** Worker refusals after which the learner should be offered the other ways in right away. */
const OTHER_WAYS_API_REASONS = new Set(['link_requires_email_code'])

/**
 * What /cuenta says after a failed Microsoft callback (DESIGN-v3 §L D-USER-05). `key: 'api'` means
 * "use the worker's own message". `offerOtherWays` puts the sign-in dialog (email code; Google from
 * the course) one button away when Microsoft cannot work for this learner.
 */
export function msFailureView(r: Exclude<MsCallbackResult, { ok: true }>): { key: string; offerOtherWays: boolean } {
  if (r.reason === 'api') return { key: 'api', offerOtherWays: OTHER_WAYS_API_REASONS.has(r.result.reason) }
  return { key: FAIL_KEYS[r.reason] ?? 'account.error.unavailable', offerOtherWays: r.reason === 'tenant_blocked' }
}

/**
 * Owner decision 2026-10-01: the beta may run with email codes off (Workers Free, no sender).
 * These messages name the email code as the way out; with email off they use a variant that
 * points to Google, a personal Microsoft account or linking Microsoft from the account instead.
 */
const EMAIL_FREE_KEYS: Readonly<Record<string, string>> = {
  'cuenta.ms.tenantBlocked': 'cuenta.ms.tenantBlockedNoEmail',
  'cuenta.ms.otherWays': 'cuenta.ms.otherWaysNoEmail',
  'account.error.linkRequiresEmailCode': 'account.error.linkRequiresEmailCodeNoEmail',
}

export function withoutEmailCode(key: string, emailOn: boolean): string {
  return emailOn ? key : (EMAIL_FREE_KEYS[key] ?? key)
}
