import test from 'node:test'
import assert from 'node:assert/strict'
import {
  uiError,
  confirmWordFor,
  deleteConfirmMatches,
  deleteAccount,
  startEmail,
  verifyEmail,
  signInGoogle,
  linkProvider,
  startTrial,
  cancelSubscription,
  signOutRequest,
  DELETE_API_CONFIRM,
} from '@/lib/cloud/account-api'
import { saveIntent, takeIntent, peekIntent, shouldResumeTrial, claimTrialIntent, INTENT_KEY, INTENT_MAX_AGE_MS } from '@/lib/cloud/intent'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { createMemoryStorage } from '@/lib/cloud/storage'
import { parseMe } from '@/lib/cloud/session'
import { t, type Language } from '@/lib/i18n'

type Call = { method: string; path: string; body: unknown }

function fakeApi(answer: (c: Call) => ApiResult<Record<string, unknown>> = () => ({ ok: true, status: 200, data: {} })) {
  const calls: Call[] = []
  const rec = (method: string) => async (path: string, body?: unknown) => {
    const c = { method, path, body }
    calls.push(c)
    return answer(c) as ApiResult<never>
  }
  const api: ApiClient = { get: rec('GET'), post: rec('POST'), put: rec('PUT'), patch: rec('PATCH'), del: rec('DELETE') }
  return { api, calls }
}

const fail = (status: number, reason: string, data: Record<string, unknown> | null = null): ApiResult<Record<string, unknown>> => ({ ok: false, status, reason, data })

// --- error mapping -----------------------------------------------------------------------------

test('each worker refusal maps to an honest message key that exists in all three languages', () => {
  const cases: Array<[ApiResult<unknown>, string]> = [
    [fail(0, 'network'), 'account.error.network'],
    [fail(0, 'timeout'), 'account.error.network'],
    [fail(429, 'rate_limited', { retryAfter: 125 }), 'account.error.rateLimited'],
    [fail(429, 'too_many_codes', { retryAfter: 30 }), 'account.error.rateLimited'],
    [fail(503, 'email_unavailable'), 'account.error.emailUnavailable'],
    [fail(409, 'link_requires_email_code'), 'account.error.linkRequiresEmailCode'],
    [fail(409, 'identity_in_use'), 'account.error.identityInUse'],
    [fail(401, 'bad_code'), 'account.error.badCode'],
    [fail(401, 'code_expired'), 'account.error.codeExpired'],
    [fail(401, 'reauth_required'), 'account.error.reauth'],
    [fail(401, 'invalid_token'), 'account.error.invalidToken'],
    [fail(400, 'terms_required'), 'account.error.termsChanged'],
    [fail(400, 'bad_email'), 'account.error.badEmail'],
    [fail(403, 'account_disabled'), 'account.error.blocked'],
    [fail(409, 'trial_used'), 'account.error.trialUsed'],
    [fail(409, 'trial_not_available'), 'account.error.trialNotAvailable'],
    [fail(409, 'already_subscribed'), 'billing.error.alreadySubscribed'],
    [fail(409, 'rail_country_mismatch'), 'billing.error.railMismatch'],
    [fail(502, 'cancel_failed'), 'billing.error.cancelFailed'],
    [fail(503, 'google_not_configured'), 'account.error.unavailable'],
    [fail(500, 'http_500'), 'account.error.unavailable'],
    [fail(418, 'something_new'), 'account.error.generic'],
  ]
  for (const [result, key] of cases) {
    const e = uiError(result)
    assert.equal(e.key, key, JSON.stringify(result))
    for (const lang of ['es-PE', 'es-ES', 'en'] as Language[]) assert.notEqual(t(e.key, lang), e.key, `${e.key} missing in ${lang}`)
  }
})

test('a rate limit tells the wait in whole minutes, never 0, and never invents one', () => {
  assert.equal(uiError(fail(429, 'rate_limited', { retryAfter: 125 })).minutes, 3)
  assert.equal(uiError(fail(429, 'rate_limited', { retryAfter: 1 })).minutes, 1)
  assert.equal(uiError(fail(429, 'rate_limited', { retryAfter: 0 })).minutes, 1, 'never "try again in 0 min"')
  assert.equal(uiError(fail(429, 'rate_limited', { retryAfter: 'soon' })).minutes, undefined)
  assert.equal(uiError(fail(429, 'rate_limited', null)).minutes, undefined)
})

// --- delete ------------------------------------------------------------------------------------

test('the delete confirm word is localized and maps to the API constant', async () => {
  assert.equal(confirmWordFor('es-PE'), 'ELIMINAR')
  assert.equal(confirmWordFor('es-ES'), 'ELIMINAR')
  assert.equal(confirmWordFor('en'), 'DELETE')
  assert.equal(deleteConfirmMatches(' eliminar ', 'es-PE'), true)
  assert.equal(deleteConfirmMatches('DELETE', 'es-PE'), false, 'a Spanish user is never asked for the English word')
  assert.equal(deleteConfirmMatches('ELIMINA', 'es-PE'), false)
  assert.equal(deleteConfirmMatches('', 'en'), false)

  const { api, calls } = fakeApi()
  const refused = await deleteAccount(api, 'ELIMINA', 'es-PE')
  assert.equal(refused.ok, false)
  assert.equal(calls.length, 0, 'a wrong word sends nothing')
  await deleteAccount(api, 'ELIMINAR', 'es-PE')
  assert.deepEqual(calls, [{ method: 'DELETE', path: '/v1/me', body: { confirm: DELETE_API_CONFIRM } }])
  assert.equal(DELETE_API_CONFIRM, 'DELETE')
})

test('delete without a recent sign-in reports reauth, not a generic failure', async () => {
  const { api } = fakeApi(() => fail(401, 'reauth_required'))
  const r = await deleteAccount(api, 'DELETE', 'en')
  assert.equal(r.ok, false)
  assert.equal(!r.ok && r.error.key, 'account.error.reauth')
})

// --- request shapes ----------------------------------------------------------------------------

const ME = { ok: true, account: { id: 'acct_1', email: 'a@b.pe' }, access: { isPro: false } }

test('sign-in requests carry the age confirmation and the configured terms version', async () => {
  const { api, calls } = fakeApi(() => ({ ok: true, status: 200, data: ME }))
  await startEmail(api, { email: ' Ana@Example.PE ', ageConfirmed: true, termsVersion: '1.0' })
  await verifyEmail(api, { email: 'ana@example.pe', code: '123 456', ageConfirmed: true, termsVersion: '1.0' })
  await signInGoogle(api, { idToken: 'h.p.s', noncePreimage: 'pre', ageConfirmed: true, termsVersion: '1.0' })
  assert.deepEqual(calls, [
    { method: 'POST', path: '/v1/auth/email/start', body: { email: 'Ana@Example.PE', ageConfirmed: true, termsVersion: '1.0' } },
    { method: 'POST', path: '/v1/auth/email/verify', body: { email: 'ana@example.pe', code: '123456', ageConfirmed: true, termsVersion: '1.0' } },
    { method: 'POST', path: '/v1/auth/google', body: { idToken: 'h.p.s', noncePreimage: 'pre', ageConfirmed: true, termsVersion: '1.0' } },
  ])
})

test('nothing is sent without the age confirmation', async () => {
  const { api, calls } = fakeApi()
  const r = await startEmail(api, { email: 'a@b.pe', ageConfirmed: false, termsVersion: '1.0' })
  const g = await signInGoogle(api, { idToken: 'h.p.s', noncePreimage: 'pre', ageConfirmed: false, termsVersion: '1.0' })
  assert.equal(calls.length, 0)
  assert.equal(!r.ok && r.error.key, 'account.error.ageRequired')
  assert.equal(!g.ok && g.error.key, 'account.error.ageRequired')
})

test('a successful sign-in returns the parsed me payload; a malformed one is a failure, not a session', async () => {
  const good = await verifyEmail(fakeApi(() => ({ ok: true, status: 200, data: ME })).api, { email: 'a@b.pe', code: '1', ageConfirmed: true, termsVersion: 'v' })
  assert.equal(good.ok, true)
  assert.deepEqual(good.ok && good.me, parseMe(ME))
  const bad = await verifyEmail(fakeApi(() => ({ ok: true, status: 200, data: { ok: true } })).api, { email: 'a@b.pe', code: '1', ageConfirmed: true, termsVersion: 'v' })
  assert.equal(bad.ok, false)
})

test('account actions hit the contract routes', async () => {
  const { api, calls } = fakeApi(() => ({ ok: true, status: 200, data: ME }))
  await linkProvider(api, 'google', { idToken: 'h.p.s', noncePreimage: 'pre' })
  await linkProvider(api, 'microsoft', { idToken: 'h.p.s', noncePreimage: 'pre2' })
  await startTrial(api)
  await cancelSubscription(api, 'sub_1')
  await signOutRequest(api, false)
  assert.deepEqual(calls, [
    { method: 'POST', path: '/v1/me/link/google', body: { idToken: 'h.p.s', noncePreimage: 'pre' } },
    { method: 'POST', path: '/v1/me/link/microsoft', body: { idToken: 'h.p.s', noncePreimage: 'pre2' } },
    { method: 'POST', path: '/v1/me/trial', body: {} },
    { method: 'POST', path: '/v1/me/subscription/cancel', body: { subscriptionId: 'sub_1' } },
    { method: 'POST', path: '/v1/auth/logout', body: { everywhere: false } },
  ])
})

// --- trial intent through sign-in --------------------------------------------------------------

test('the trial intent survives the sign-in round trip once, and expires', () => {
  const s = createMemoryStorage()
  const now = Date.parse('2026-09-28T12:00:00Z')
  saveIntent(s, { kind: 'trial', sectionId: 'functions' }, now)
  assert.deepEqual(peekIntent(s, now + 1000), { kind: 'trial', sectionId: 'functions', at: now })
  assert.deepEqual(takeIntent(s, now + 1000), { kind: 'trial', sectionId: 'functions', at: now })
  assert.equal(takeIntent(s, now + 2000), null, 'single use')
  saveIntent(s, { kind: 'trial', sectionId: null }, now)
  assert.equal(takeIntent(s, now + INTENT_MAX_AGE_MS + 1), null, 'an old intent never starts a trial')
  assert.equal(s.getItem(INTENT_KEY), null)
  s.setItem(INTENT_KEY, '{"kind":"buy","at":1}')
  assert.equal(takeIntent(s, 2), null, 'unknown intents are dropped')
})

test('a trial is resumed only for a signed-in free account that can still start one', () => {
  const intent = { kind: 'trial' as const, sectionId: 'functions', at: 0 }
  const me = (trialAvailable: boolean, isPro: boolean) => parseMe({ account: { id: 'a', trialAvailable }, access: { isPro } })
  assert.equal(shouldResumeTrial(intent, me(true, false)), true)
  assert.equal(shouldResumeTrial(intent, me(false, false)), false)
  assert.equal(shouldResumeTrial(intent, me(true, true)), false, 'already Pro: no trial burned')
  assert.equal(shouldResumeTrial(null, me(true, false)), false)
  assert.equal(shouldResumeTrial(intent, null), false)
})

test('a page that is navigating away (Microsoft sign-in -> returnTo) leaves the trial intent for the next page', () => {
  const now = Date.parse('2026-09-29T12:00:00Z')
  const free = parseMe({ account: { id: 'a', trialAvailable: true }, access: { isPro: false } })
  const s = createMemoryStorage()
  saveIntent(s, { kind: 'trial', sectionId: 'functions' }, now)
  assert.equal(claimTrialIntent(s, free, now + 1000, true), false, '/cuenta starts no trial while it redirects')
  assert.notEqual(s.getItem(INTENT_KEY), null, 'the intent survives the redirect')
  assert.equal(claimTrialIntent(s, free, now + 2000, false), true, 'the return page starts it')
  assert.equal(s.getItem(INTENT_KEY), null, 'single use')
  assert.equal(claimTrialIntent(s, free, now + 3000, false), false)
})

test('claiming an intent the account cannot use still spends it (no surprise trial later)', () => {
  const now = Date.parse('2026-09-29T12:00:00Z')
  const pro = parseMe({ account: { id: 'a', trialAvailable: true }, access: { isPro: true } })
  const s = createMemoryStorage()
  saveIntent(s, { kind: 'trial', sectionId: null }, now)
  assert.equal(claimTrialIntent(s, pro, now + 1000, false), false)
  assert.equal(s.getItem(INTENT_KEY), null)
})
