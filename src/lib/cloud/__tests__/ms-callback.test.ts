import test from 'node:test'
import assert from 'node:assert/strict'
import { beginMicrosoft, takePending, MS_PENDING_KEY } from '@/lib/cloud/oidc'
import { completeMicrosoftCallback, msFailureView, type MsCallbackDeps } from '@/lib/cloud/ms-callback'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { createMemoryStorage, type KeyValueStorage } from '@/lib/cloud/storage'

const NOW = Date.parse('2026-09-28T12:00:00Z')
const CFG = {
  canonicalOrigin: 'https://pyarcana.example',
  microsoftClientId: '11111111-2222-3333-4444-555555555555',
  microsoftAuthority: 'common',
  termsVersion: '1.0',
}
const ID_TOKEN = 'eyJhbGciOiJSUzI1NiJ9.eyJzdWIiOiJ4In0.c2ln'

test('the pending sign-in records its purpose; missing means sign-in, anything else is refused', async () => {
  const s = createMemoryStorage()
  await beginMicrosoft(s, { authority: 'common', clientId: 'c', redirectUri: 'https://pyarcana.example/cuenta', nowMs: NOW, returnTo: '/', purpose: 'link' })
  assert.equal(takePending(s, NOW)?.purpose, 'link')
  await beginMicrosoft(s, { authority: 'common', clientId: 'c', redirectUri: 'https://pyarcana.example/cuenta', nowMs: NOW, returnTo: '/' })
  assert.equal(takePending(s, NOW)?.purpose, 'signin')
  const raw = { state: 's', verifier: 'v', noncePreimage: 'n', createdAt: NOW, returnTo: '/' }
  s.setItem(MS_PENDING_KEY, JSON.stringify(raw))
  assert.equal(takePending(s, NOW)?.purpose, 'signin', 'a record written before purposes existed')
  s.setItem(MS_PENDING_KEY, JSON.stringify({ ...raw, purpose: 'admin' }))
  assert.equal(takePending(s, NOW), null)
})

type Posted = { path: string; body: unknown }

async function setup(purpose: 'signin' | 'link' = 'signin') {
  const session = createMemoryStorage()
  const { url } = await beginMicrosoft(session, {
    authority: 'common', clientId: CFG.microsoftClientId, redirectUri: 'https://pyarcana.example/cuenta', nowMs: NOW, returnTo: '/#functions/wedo', purpose,
  })
  const state = new URL(url).searchParams.get('state')!
  const pending = JSON.parse(session.getItem(MS_PENDING_KEY)!)
  return { session, state, pending }
}

function deps(session: KeyValueStorage, hash: string, o: { tokenBody?: unknown; tokenStatus?: number; tokenThrows?: boolean; api?: ApiResult<Record<string, unknown>> } = {}) {
  const fetched: Array<{ url: string; init: RequestInit }> = []
  const posted: Posted[] = []
  const fetchImpl = (async (url: string, init: RequestInit) => {
    fetched.push({ url, init })
    if (o.tokenThrows) throw new TypeError('network')
    return new Response(JSON.stringify(o.tokenBody ?? { id_token: ID_TOKEN, access_token: 'AT' }), { status: o.tokenStatus ?? 200 })
  }) as unknown as typeof fetch
  const post = async (path: string, body: unknown) => {
    posted.push({ path, body })
    return (o.api ?? { ok: true, status: 200, data: { ok: true, account: { id: 'acct_1' } } }) as ApiResult<never>
  }
  const api = { post } as unknown as ApiClient
  const d: MsCallbackDeps = { hash, session, nowMs: NOW + 30_000, cfg: CFG, fetch: fetchImpl, api }
  return { d, fetched, posted }
}

test('a good callback redeems the code with PKCE and posts only the id_token and the nonce preimage', async () => {
  const { session, state, pending } = await setup()
  const { d, fetched, posted } = deps(session, `#code=AUTHCODE&state=${state}`)
  const r = await completeMicrosoftCallback(d)
  assert.equal(r.ok, true)
  assert.equal(r.returnTo, '/#functions/wedo')
  assert.equal(fetched.length, 1)
  assert.equal(fetched[0].url, 'https://login.microsoftonline.com/common/oauth2/v2.0/token')
  assert.equal(fetched[0].init.credentials, 'omit')
  const form = new URLSearchParams(String(fetched[0].init.body))
  assert.equal(form.get('code'), 'AUTHCODE')
  assert.equal(form.get('code_verifier'), pending.verifier)
  assert.equal(form.get('redirect_uri'), 'https://pyarcana.example/cuenta')
  assert.deepEqual(posted, [{ path: '/v1/auth/microsoft', body: { idToken: ID_TOKEN, noncePreimage: pending.noncePreimage, ageConfirmed: true, termsVersion: '1.0' } }])
  assert.doesNotMatch(JSON.stringify(posted), /AT/, 'the access token is discarded')
  assert.equal(session.getItem(MS_PENDING_KEY), null, 'single use')
})

test('a link callback posts to the link route, without sign-in terms', async () => {
  const { session, state, pending } = await setup('link')
  const { d, posted } = deps(session, `#code=C&state=${state}`)
  const r = await completeMicrosoftCallback(d)
  assert.equal(r.ok && r.purpose, 'link')
  assert.deepEqual(posted, [{ path: '/v1/me/link/microsoft', body: { idToken: ID_TOKEN, noncePreimage: pending.noncePreimage } }])
})

test('without a provider answer in the fragment nothing is consumed', async () => {
  const { session } = await setup()
  const { d, fetched } = deps(session, '#functions')
  const r = await completeMicrosoftCallback(d)
  assert.equal(!r.ok && r.reason, 'no_response')
  assert.notEqual(session.getItem(MS_PENDING_KEY), null)
  assert.equal(fetched.length, 0)
})

test('a forged or stale answer never reaches the token endpoint', async () => {
  const { session } = await setup()
  const forged = deps(session, '#code=C&state=someone-else')
  assert.equal(((await completeMicrosoftCallback(forged.d)) as { reason: string }).reason, 'state_mismatch')
  assert.equal(forged.fetched.length, 0)

  const noPending = deps(createMemoryStorage(), '#code=C&state=x')
  assert.equal(((await completeMicrosoftCallback(noPending.d)) as { reason: string }).reason, 'no_pending')
  assert.equal(noPending.fetched.length, 0)

  const again = await setup()
  const err = deps(again.session, `#error=access_denied&state=${again.state}`)
  const r = await completeMicrosoftCallback(err.d)
  assert.equal(!r.ok && r.reason, 'provider_error')
  assert.equal(err.fetched.length, 0)
})

test('token endpoint failures and a missing id_token stop before the worker', async () => {
  for (const o of [{ tokenStatus: 400, tokenBody: { error: 'invalid_grant' } }, { tokenThrows: true }]) {
    const { session, state } = await setup()
    const { d, posted } = deps(session, `#code=C&state=${state}`, o)
    const r = await completeMicrosoftCallback(d)
    assert.equal(!r.ok && r.reason, 'token_failed')
    assert.equal(posted.length, 0)
  }
  const { session, state } = await setup()
  const { d, posted } = deps(session, `#code=C&state=${state}`, { tokenBody: { access_token: 'AT' } })
  assert.equal(((await completeMicrosoftCallback(d)) as { reason: string }).reason, 'no_id_token')
  assert.equal(posted.length, 0)
})

test('a worker refusal is passed through (409 link_requires_email_code keeps its reason)', async () => {
  const { session, state } = await setup()
  const { d } = deps(session, `#code=C&state=${state}`, { api: { ok: false, status: 409, reason: 'link_requires_email_code', data: null } })
  const r = await completeMicrosoftCallback(d)
  assert.equal(!r.ok && r.reason, 'api')
  assert.equal(!r.ok && r.reason === 'api' && r.result.reason, 'link_requires_email_code')
})

test('without a Microsoft client id or canonical origin the callback refuses to run', async () => {
  const { session, state } = await setup()
  const { d, fetched } = deps(session, `#code=C&state=${state}`)
  const r = await completeMicrosoftCallback({ ...d, cfg: { ...CFG, microsoftClientId: '' } })
  assert.equal(!r.ok && r.reason, 'not_configured')
  assert.equal(fetched.length, 0)
})

test('a tenant that blocks the app ends as tenant_blocked, before any token request', async () => {
  const { session, state } = await setup()
  const { d, fetched } = deps(session, `#error=access_denied&error_description=AADSTS90094%3A+admin+permission&state=${state}`)
  const r = await completeMicrosoftCallback(d)
  assert.equal(!r.ok && r.reason, 'tenant_blocked')
  assert.equal(!r.ok && r.returnTo, '/#functions/wedo')
  assert.equal(fetched.length, 0)
})

test('the /cuenta failure view explains a blocked tenant and offers the other ways in; a cancel does not blame the tenant', () => {
  const back = '/'
  assert.deepEqual(msFailureView({ ok: false, reason: 'tenant_blocked', returnTo: back }), { key: 'cuenta.ms.tenantBlocked', offerOtherWays: true })
  assert.deepEqual(
    msFailureView({ ok: false, reason: 'api', result: { ok: false, status: 409, reason: 'link_requires_email_code', data: null }, returnTo: back }),
    { key: 'api', offerOtherWays: true },
    'an existing email account: the email-code option has to be right there',
  )
  assert.deepEqual(msFailureView({ ok: false, reason: 'api', result: { ok: false, status: 0, reason: 'network', data: null }, returnTo: back }), { key: 'api', offerOtherWays: false })
  assert.deepEqual(msFailureView({ ok: false, reason: 'provider_error', returnTo: back }), { key: 'cuenta.ms.cancelled', offerOtherWays: false })
  assert.deepEqual(msFailureView({ ok: false, reason: 'state_mismatch', returnTo: back }), { key: 'cuenta.ms.expired', offerOtherWays: false })
  assert.deepEqual(msFailureView({ ok: false, reason: 'token_failed', returnTo: back }), { key: 'account.error.unavailable', offerOtherWays: false })
})
