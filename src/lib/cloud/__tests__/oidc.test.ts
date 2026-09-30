import test from 'node:test'
import assert from 'node:assert/strict'
import {
  makeNonce,
  nonceFromPreimage,
  makePkce,
  pkceChallenge,
  buildAuthorizeUrl,
  buildTokenRequest,
  parseAuthResponse,
  microsoftRedirectUri,
  beginMicrosoft,
  takePending,
  extractIdToken,
  gisInitOptions,
  gisButtonOptions,
  gisAllowedOn,
  createScriptLoader,
  GIS_SRC,
  MS_PENDING_KEY,
} from '@/lib/cloud/oidc'
import { createMemoryStorage } from '@/lib/cloud/storage'

const NOW = Date.parse('2026-09-28T12:00:00Z')

test('nonce = base64url(SHA-256(preimage)); the preimage is 32 random bytes', async () => {
  assert.equal(await nonceFromPreimage('abc'), 'ungWv48Bz-pBQUDeXa4iI7ADYaOWF3qctBD_YfIAFa0')
  const a = await makeNonce()
  const b = await makeNonce()
  assert.match(a.preimage, /^[A-Za-z0-9_-]{43}$/)
  assert.equal(a.nonce, await nonceFromPreimage(a.preimage))
  assert.notEqual(a.preimage, b.preimage)
  assert.notEqual(a.nonce, a.preimage)
})

test('PKCE S256 matches RFC 7636 Appendix B', async () => {
  assert.equal(await pkceChallenge('dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk'), 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM')
  const p = await makePkce()
  assert.match(p.verifier, /^[A-Za-z0-9_-]{43,128}$/)
  assert.equal(p.challenge, await pkceChallenge(p.verifier))
})

const authorizeArgs = {
  authority: 'common',
  clientId: '11111111-2222-3333-4444-555555555555',
  redirectUri: 'https://pyarcana.example/cuenta',
  state: 'state-value',
  nonce: 'nonce-hash',
  codeChallenge: 'challenge',
}

test('the authorize URL is the code + PKCE request with a fragment response', () => {
  const url = new URL(buildAuthorizeUrl(authorizeArgs))
  assert.equal(url.origin + url.pathname, 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize')
  assert.deepEqual(Object.fromEntries(url.searchParams), {
    client_id: authorizeArgs.clientId,
    response_type: 'code',
    redirect_uri: 'https://pyarcana.example/cuenta',
    response_mode: 'fragment',
    scope: 'openid profile email',
    state: 'state-value',
    nonce: 'nonce-hash',
    code_challenge: 'challenge',
    code_challenge_method: 'S256',
    prompt: 'select_account',
  })
})

test('only a known authority form is accepted (no URL injection through config)', () => {
  for (const authority of ['consumers', 'organizations', '9188040d-6c67-4c5b-b112-36a304b66dad']) {
    assert.doesNotThrow(() => buildAuthorizeUrl({ ...authorizeArgs, authority }))
  }
  for (const authority of ['common/../evil', 'evil.test/x', '', 'common?x=1', 'a b']) {
    assert.throws(() => buildAuthorizeUrl({ ...authorizeArgs, authority }), /authority/, authority)
  }
})

test('the redirect URI is the canonical /cuenta route exactly', () => {
  assert.equal(microsoftRedirectUri('https://pyarcana.example/'), 'https://pyarcana.example/cuenta')
  assert.equal(microsoftRedirectUri('http://localhost:3000'), 'http://localhost:3000/cuenta')
  assert.equal(microsoftRedirectUri(''), null)
})

test('beginMicrosoft stores the verifier, state and nonce preimage in session storage and binds them into the URL', async () => {
  const session = createMemoryStorage()
  const r = await beginMicrosoft(session, { authority: 'common', clientId: authorizeArgs.clientId, redirectUri: authorizeArgs.redirectUri, nowMs: NOW, returnTo: '/#setup/theory' })
  const url = new URL(r.url)
  const pending = JSON.parse(session.getItem(MS_PENDING_KEY)!)
  assert.equal(url.searchParams.get('state'), pending.state)
  assert.equal(url.searchParams.get('nonce'), await nonceFromPreimage(pending.noncePreimage))
  assert.equal(url.searchParams.get('code_challenge'), await pkceChallenge(pending.verifier))
  assert.equal(pending.createdAt, NOW)
  assert.equal(pending.returnTo, '/#setup/theory')
  assert.equal(url.toString().includes(pending.verifier), false, 'the verifier never travels in the URL')
  assert.equal(url.toString().includes(pending.noncePreimage), false, 'the preimage never travels in the URL')
})

test('the pending sign-in is single use and expires after 10 minutes', async () => {
  const session = createMemoryStorage()
  await beginMicrosoft(session, { authority: 'common', clientId: 'c', redirectUri: 'https://pyarcana.example/cuenta', nowMs: NOW, returnTo: '/' })
  const first = takePending(session, NOW + 60_000)
  assert.ok(first)
  assert.equal(takePending(session, NOW + 60_000), null)
  await beginMicrosoft(session, { authority: 'common', clientId: 'c', redirectUri: 'https://pyarcana.example/cuenta', nowMs: NOW, returnTo: '/' })
  assert.equal(takePending(session, NOW + 11 * 60_000), null)
  assert.equal(session.getItem(MS_PENDING_KEY), null)
  session.setItem(MS_PENDING_KEY, '{"state":1}')
  assert.equal(takePending(session, NOW), null)
})

test('a returnTo that leaves the site is replaced by /', async () => {
  const session = createMemoryStorage()
  await beginMicrosoft(session, { authority: 'common', clientId: 'c', redirectUri: 'https://pyarcana.example/cuenta', nowMs: NOW, returnTo: '//evil.test/x' })
  assert.equal(takePending(session, NOW)!.returnTo, '/')
})

test('the fragment response is accepted only with the state we sent', () => {
  assert.deepEqual(parseAuthResponse('#code=abc&state=s1&session_state=x', 's1'), { ok: true, code: 'abc' })
  assert.deepEqual(parseAuthResponse('#code=abc&state=s2', 's1'), { ok: false, reason: 'state_mismatch' })
  assert.deepEqual(parseAuthResponse('#code=abc&state=s1', null), { ok: false, reason: 'state_mismatch' })
  assert.deepEqual(parseAuthResponse('#code=abc', 's1'), { ok: false, reason: 'state_mismatch' })
  assert.deepEqual(parseAuthResponse('#error=access_denied&error_description=User+cancelled&state=s1', 's1'), { ok: false, reason: 'provider_error', error: 'access_denied', kind: 'other' })
  assert.deepEqual(parseAuthResponse('#error=%3Cimg%3E&state=s1', 's1'), { ok: false, reason: 'provider_error', error: 'unknown', kind: 'other' })
  assert.deepEqual(parseAuthResponse('#state=s1', 's1'), { ok: false, reason: 'missing_code' })
  assert.deepEqual(parseAuthResponse('', 's1'), { ok: false, reason: 'no_response' })
  assert.deepEqual(parseAuthResponse('#setup/theory', 's1'), { ok: false, reason: 'no_response' })
})

test('the code is redeemed from the browser without cookies (Microsoft answers ACAO *)', () => {
  const r = buildTokenRequest({ authority: 'common', clientId: 'cid', redirectUri: 'https://pyarcana.example/cuenta', code: 'the-code', verifier: 'the-verifier' })
  assert.equal(r.url, 'https://login.microsoftonline.com/common/oauth2/v2.0/token')
  assert.equal(r.init.method, 'POST')
  assert.equal(r.init.credentials, 'omit')
  assert.equal(new Headers(r.init.headers).get('Content-Type'), 'application/x-www-form-urlencoded')
  assert.equal(new Headers(r.init.headers).get('X-PyArcana'), null)
  assert.deepEqual(Object.fromEntries(new URLSearchParams(String(r.init.body))), {
    client_id: 'cid',
    grant_type: 'authorization_code',
    code: 'the-code',
    redirect_uri: 'https://pyarcana.example/cuenta',
    code_verifier: 'the-verifier',
    scope: 'openid profile email',
  })
})

test('only the id_token is kept from the token response', () => {
  assert.equal(extractIdToken({ id_token: 'aa.bb.cc', access_token: 'secret' }), 'aa.bb.cc')
  assert.equal(extractIdToken({ access_token: 'secret' }), null)
  assert.equal(extractIdToken({ id_token: 'not a jwt' }), null)
  assert.equal(extractIdToken(null), null)
})

test('GIS is initialised with the hashed nonce, popup mode and no automatic sign-in', () => {
  const callback = () => {}
  const opts = gisInitOptions({ clientId: 'gid', nonce: 'hashed', callback })
  assert.deepEqual(opts, { client_id: 'gid', callback, nonce: 'hashed', ux_mode: 'popup', auto_select: false, context: 'signin' })
  assert.equal(GIS_SRC, 'https://accounts.google.com/gsi/client')
  assert.deepEqual(gisButtonOptions('en'), { type: 'standard', theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular', logo_alignment: 'left', locale: 'en' })
  assert.equal(gisButtonOptions('es-PE').locale, 'es-419')
  assert.equal(gisButtonOptions('es-ES').locale, 'es')
})

test('no third-party sign-in script on the Microsoft callback route', () => {
  assert.equal(gisAllowedOn('/'), true)
  assert.equal(gisAllowedOn('/cuenta'), false)
  assert.equal(gisAllowedOn('/cuenta/'), false)
  assert.equal(gisAllowedOn('/pyarcana/cuenta', '/pyarcana'), false)
})

function fakeDocument() {
  const appended: Array<Record<string, unknown>> = []
  return {
    appended,
    doc: {
      createElement: (tag: string) => ({ tag, src: '', async: false, onload: null as null | (() => void), onerror: null as null | (() => void) }),
      appendScript: (el: Record<string, unknown>) => {
        appended.push(el)
      },
    },
  }
}

test('the script loader appends once, shares the pending load, and allows a retry after an error', async () => {
  const { doc, appended } = fakeDocument()
  const loader = createScriptLoader(doc as never)
  const p1 = loader.load(GIS_SRC)
  const p2 = loader.load(GIS_SRC)
  assert.equal(appended.length, 1)
  assert.equal(appended[0].src, GIS_SRC)
  assert.equal(appended[0].async, true)
  ;(appended[0].onload as () => void)()
  await Promise.all([p1, p2])
  await loader.load(GIS_SRC)
  assert.equal(appended.length, 1)
  const p3 = loader.load('https://accounts.google.com/other')
  ;(appended[1].onerror as () => void)()
  await assert.rejects(p3)
  const p4 = loader.load('https://accounts.google.com/other')
  assert.equal(appended.length, 3, 'a failed load can be retried')
  ;(appended[2].onload as () => void)()
  await p4
})

test('a work or school tenant that blocks the app is told apart from a plain cancel (DESIGN-v3 §L D-USER-05)', () => {
  // Microsoft Entra: the callback carries error=access_denied (or consent_required) with an AADSTS
  // consent code in error_description when the tenant requires admin approval.
  const kind = (h: string) => {
    const r = parseAuthResponse(`${h}&state=s1`, 's1')
    return !r.ok && r.reason === 'provider_error' ? r.kind : null
  }
  assert.equal(kind('#error=access_denied&error_description=AADSTS90094%3A+The+grant+requires+admin+permission.'), 'tenant_blocked')
  assert.equal(kind('#error=access_denied&error_description=AADSTS65001:+The+user+or+administrator+has+not+consented'), 'tenant_blocked')
  assert.equal(kind('#error=access_denied&error_description=AADSTS90095%3A+Admin+consent+is+required'), 'tenant_blocked')
  assert.equal(kind('#error=access_denied&error_description=AADSTS50105%3A+not+assigned+to+a+role'), 'tenant_blocked')
  assert.equal(kind('#error=consent_required&error_description=whatever'), 'tenant_blocked')
  assert.equal(kind('#error=access_denied&error_subcode=cancel&error_description=AADSTS65004%3A+User+declined'), 'cancelled')
  assert.equal(kind('#error=access_denied&error_description=AADSTS900144%3A+other'), 'other', 'a longer code is not a consent code')
  assert.equal(kind('#error=server_error'), 'other')
  const r = parseAuthResponse('#error=access_denied&error_description=AADSTS90094%3A+%3Cscript%3E&state=s1', 's1')
  assert.deepEqual(Object.keys(r).sort(), ['error', 'kind', 'ok', 'reason'], 'the free-text description itself is never kept')
})
