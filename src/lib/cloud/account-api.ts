/**
 * The account routes the static site calls (DESIGN-v2 §4 as amended by v3), and the mapping from a
 * worker refusal to an honest message key. Every function takes the ApiClient, so the request
 * shapes are unit-tested; components only render the result.
 *
 * Messages say what happened and what the learner can do (writing_rules B4): a rate limit gives
 * the wait in minutes, a mail outage names the other ways in, a changed terms version asks for a
 * reload. Nothing is sent without the age confirmation.
 */
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { isPlainObject } from '@/lib/cloud/storage'
import { parseMe, type MePayload } from '@/lib/cloud/session'
import type { Language } from '@/lib/i18n'

/** The worker's constant (DELETE /v1/me {confirm:'DELETE'}); the learner types a localized word. */
export const DELETE_API_CONFIRM = 'DELETE'

export interface UiError {
  /** i18n key */
  key: string
  /** Whole minutes to wait, when the worker said so. */
  minutes?: number
}

export type ActionResult =
  | { ok: true; me: MePayload | null; data: Record<string, unknown> }
  | { ok: false; error: UiError; status: number; reason: string }

const REASON_KEYS: Record<string, string> = {
  network: 'account.error.network',
  timeout: 'account.error.network',
  rate_limited: 'account.error.rateLimited',
  too_many_codes: 'account.error.rateLimited',
  email_unavailable: 'account.error.emailUnavailable',
  link_requires_email_code: 'account.error.linkRequiresEmailCode',
  identity_in_use: 'account.error.identityInUse',
  email_in_use: 'account.error.identityInUse',
  bad_code: 'account.error.badCode',
  code_expired: 'account.error.codeExpired',
  reauth_required: 'account.error.reauth',
  invalid_token: 'account.error.invalidToken',
  terms_required: 'account.error.termsChanged',
  bad_email: 'account.error.badEmail',
  account_disabled: 'account.error.blocked',
  account_deleted: 'account.error.blocked',
  trial_used: 'account.error.trialUsed',
  trial_not_available: 'account.error.trialNotAvailable',
  already_subscribed: 'billing.error.alreadySubscribed',
  rail_country_mismatch: 'billing.error.railMismatch',
  cancel_failed: 'billing.error.cancelFailed',
  provider_not_configured: 'billing.error.unavailable',
  ageRequired: 'account.error.ageRequired',
  confirm_mismatch: 'account.error.confirmMismatch',
  bad_response: 'account.error.unavailable',
}

function retryMinutes(data: Record<string, unknown> | null): number | undefined {
  const s = data && typeof data.retryAfter === 'number' && Number.isFinite(data.retryAfter) ? data.retryAfter : null
  return s === null ? undefined : Math.max(1, Math.ceil(s / 60))
}

export function uiError(result: ApiResult<unknown>): UiError {
  if (result.ok) return { key: 'account.error.generic' }
  const known = Object.prototype.hasOwnProperty.call(REASON_KEYS, result.reason) ? REASON_KEYS[result.reason] : null
  if (known === 'account.error.rateLimited') return { key: known, minutes: retryMinutes(result.data) }
  if (known) return { key: known }
  if (result.status >= 500 || /_not_configured$|_unavailable$/.test(result.reason)) return { key: 'account.error.unavailable' }
  return { key: 'account.error.generic' }
}

function refused(reason: string): ActionResult {
  return { ok: false, error: uiError({ ok: false, status: 0, reason, data: null }), status: 0, reason }
}

function toAction(result: ApiResult<Record<string, unknown>>, expectMe: boolean): ActionResult {
  if (!result.ok) return { ok: false, error: uiError(result), status: result.status, reason: result.reason }
  const me = parseMe(result.data)
  if (expectMe && !me) return { ok: false, error: { key: 'account.error.unavailable' }, status: result.status, reason: 'bad_response' }
  return { ok: true, me, data: result.data }
}

// --- delete --------------------------------------------------------------------------------------

export function confirmWordFor(lang: Language): 'ELIMINAR' | 'DELETE' {
  return lang === 'en' ? 'DELETE' : 'ELIMINAR'
}

export function deleteConfirmMatches(typed: string, lang: Language): boolean {
  return typed.trim().toUpperCase() === confirmWordFor(lang)
}

export async function deleteAccount(api: ApiClient, typed: string, lang: Language): Promise<ActionResult> {
  if (!deleteConfirmMatches(typed, lang)) return refused('confirm_mismatch')
  return toAction(await api.del('/v1/me', { confirm: DELETE_API_CONFIRM }), false)
}

// --- sign-in ---------------------------------------------------------------------------------------

export interface SignInTerms {
  ageConfirmed: boolean
  termsVersion: string
}

export async function startEmail(api: ApiClient, b: { email: string } & SignInTerms): Promise<ActionResult> {
  if (b.ageConfirmed !== true) return refused('ageRequired')
  const body = { email: b.email.trim(), ageConfirmed: true, termsVersion: b.termsVersion }
  return toAction(await api.post('/v1/auth/email/start', body), false)
}

export async function verifyEmail(api: ApiClient, b: { email: string; code: string } & SignInTerms): Promise<ActionResult> {
  if (b.ageConfirmed !== true) return refused('ageRequired')
  const body = { email: b.email.trim(), code: b.code.replace(/\s+/g, ''), ageConfirmed: true, termsVersion: b.termsVersion }
  return toAction(await api.post('/v1/auth/email/verify', body), true)
}

export async function signInGoogle(api: ApiClient, b: { idToken: string; noncePreimage: string } & SignInTerms): Promise<ActionResult> {
  if (b.ageConfirmed !== true) return refused('ageRequired')
  const body = { idToken: b.idToken, noncePreimage: b.noncePreimage, ageConfirmed: true, termsVersion: b.termsVersion }
  return toAction(await api.post('/v1/auth/google', body), true)
}

export async function linkProvider(api: ApiClient, provider: 'google' | 'microsoft', b: { idToken: string; noncePreimage: string }): Promise<ActionResult> {
  return toAction(await api.post(`/v1/me/link/${provider}`, { idToken: b.idToken, noncePreimage: b.noncePreimage }), false)
}

// --- account -------------------------------------------------------------------------------------

export async function startTrial(api: ApiClient): Promise<ActionResult> {
  return toAction(await api.post('/v1/me/trial', {}), true)
}

export async function cancelSubscription(api: ApiClient, subscriptionId: string): Promise<ActionResult> {
  return toAction(await api.post('/v1/me/subscription/cancel', { subscriptionId }), false)
}

export async function refreshSubscription(api: ApiClient): Promise<ActionResult> {
  return toAction(await api.post('/v1/me/subscription/refresh', {}), false)
}

export async function exportAccount(api: ApiClient): Promise<ActionResult> {
  return toAction(await api.get('/v1/me/export'), false)
}

export async function signOutRequest(api: ApiClient, everywhere: boolean): Promise<ActionResult> {
  return toAction(await api.post('/v1/auth/logout', { everywhere }), false)
}

/** The export as a pretty JSON file body; null when the answer is not an object. */
export function exportFileBody(data: unknown): string | null {
  return isPlainObject(data) ? JSON.stringify(data, null, 2) : null
}
