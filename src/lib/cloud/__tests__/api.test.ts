import test from 'node:test'
import assert from 'node:assert/strict'
import { createApiClient, apiUrl, isUnavailable } from '@/lib/cloud/api'

type Call = { url: string; init: RequestInit }

function fakeFetch(respond: (call: Call) => Promise<Response> | Response) {
  const calls: Call[] = []
  const fn = async (url: RequestInfo | URL, init: RequestInit = {}) => {
    const call = { url: String(url), init }
    calls.push(call)
    return respond(call)
  }
  return { fn: fn as typeof fetch, calls }
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json' } })

function header(init: RequestInit, name: string): string | null {
  return new Headers(init.headers).get(name)
}

test('GET goes to apiBaseUrl + /v1 path with the session cookie and no CSRF header', async () => {
  const f = fakeFetch(() => json(200, { ok: true, account: { id: 'acct_1' } }))
  const api = createApiClient({ baseUrl: '/api', fetch: f.fn })
  const r = await api.get('/v1/me')
  assert.equal(r.ok, true)
  assert.equal(f.calls[0].url, '/api/v1/me')
  assert.equal(f.calls[0].init.method, 'GET')
  assert.equal(f.calls[0].init.credentials, 'include')
  assert.equal(header(f.calls[0].init, 'X-PyArcana'), null)
  if (r.ok) assert.deepEqual(r.data, { ok: true, account: { id: 'acct_1' } })
})

test('every state-changing method carries X-PyArcana: 1 and a JSON body', async () => {
  const f = fakeFetch(() => json(200, { ok: true }))
  const api = createApiClient({ baseUrl: 'http://localhost:8787/', fetch: f.fn })
  await api.post('/v1/auth/logout', { everywhere: false })
  await api.put('/v1/me/progress', { baseRev: 1 })
  await api.patch('/v1/admin/reports/rep_1', { status: 'fixed' })
  await api.del('/v1/me', { confirm: 'DELETE' })
  assert.deepEqual(f.calls.map((c) => c.init.method), ['POST', 'PUT', 'PATCH', 'DELETE'])
  for (const c of f.calls) {
    assert.equal(header(c.init, 'X-PyArcana'), '1', c.init.method)
    assert.equal(header(c.init, 'Content-Type'), 'application/json')
    assert.equal(c.init.credentials, 'include')
  }
  assert.equal(f.calls[0].url, 'http://localhost:8787/v1/auth/logout')
  assert.equal(f.calls[1].init.body, '{"baseRev":1}')
})

test('a network failure resolves to reason network instead of throwing', async () => {
  const api = createApiClient({ baseUrl: '/api', fetch: (async () => { throw new TypeError('Failed to fetch') }) as typeof fetch })
  const r = await api.get('/v1/me')
  assert.deepEqual(r, { ok: false, status: 0, reason: 'network', data: null })
  assert.equal(isUnavailable(r), true)
})

test('a request that outlives the timeout is aborted and reported as timeout', async () => {
  const hang = ((_: unknown, init: RequestInit) =>
    new Promise((_, reject) => {
      init.signal!.addEventListener('abort', () => reject(new DOMException('aborted', 'AbortError')))
    })) as unknown as typeof fetch
  const api = createApiClient({ baseUrl: '/api', fetch: hang, timeoutMs: 20 })
  const started = Date.now()
  const r = await api.get('/v1/me')
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'timeout')
  assert.ok(Date.now() - started < 2000)
  assert.equal(isUnavailable(r), true)
})

test('server refusals keep their reason and body; 4xx is not "unavailable"', async () => {
  const f = fakeFetch(() => json(409, { ok: false, reason: 'conflict', rev: 3, doc: { v: 1 } }))
  const api = createApiClient({ baseUrl: '/api', fetch: f.fn })
  const r = await api.put('/v1/me/progress', {})
  assert.equal(r.ok, false)
  if (!r.ok) {
    assert.equal(r.status, 409)
    assert.equal(r.reason, 'conflict')
    assert.deepEqual(r.data, { ok: false, reason: 'conflict', rev: 3, doc: { v: 1 } })
  }
  assert.equal(isUnavailable(r), false)
  const unauth = await createApiClient({ baseUrl: '/api', fetch: fakeFetch(() => json(401, { ok: false, reason: 'unauthorized' })).fn }).get('/v1/me')
  assert.equal(isUnavailable(unauth), false)
})

test('a 5xx without JSON is unavailable with a status-derived reason', async () => {
  const f = fakeFetch(() => new Response('<html>Bad gateway</html>', { status: 502 }))
  const r = await createApiClient({ baseUrl: '/api', fetch: f.fn }).get('/v1/me')
  assert.deepEqual(r, { ok: false, status: 502, reason: 'http_502', data: null })
  assert.equal(isUnavailable(r), true)
})

test('a hostile reason string is replaced, never passed to the UI', async () => {
  const f = fakeFetch(() => json(400, { ok: false, reason: '<img src=x onerror=alert(1)>' }))
  const r = await createApiClient({ baseUrl: '/api', fetch: f.fn }).post('/v1/reports', {})
  assert.equal(r.ok, false)
  if (!r.ok) assert.equal(r.reason, 'http_400')
})

test('a 200 that is not a JSON object, or says ok:false, is a failure', async () => {
  const text = await createApiClient({ baseUrl: '/api', fetch: fakeFetch(() => new Response('hello', { status: 200 })).fn }).get('/v1/me')
  assert.equal(text.ok, false)
  if (!text.ok) assert.equal(text.reason, 'bad_response')
  const arr = await createApiClient({ baseUrl: '/api', fetch: fakeFetch(() => json(200, [1, 2])).fn }).get('/v1/me')
  assert.equal(arr.ok, false)
  const refused = await createApiClient({ baseUrl: '/api', fetch: fakeFetch(() => json(200, { ok: false, reason: 'trial_used' })).fn }).post('/v1/me/trial', {})
  assert.equal(refused.ok, false)
  if (!refused.ok) assert.equal(refused.reason, 'trial_used')
})

test('keepalive is passed through for the page-hide flush', async () => {
  const f = fakeFetch(() => json(200, { ok: true, rev: 2 }))
  await createApiClient({ baseUrl: '/api', fetch: f.fn }).put('/v1/me/progress', {}, { keepalive: true })
  assert.equal(f.calls[0].init.keepalive, true)
})

test('apiUrl joins the base and refuses anything outside /v1/', () => {
  assert.equal(apiUrl('/api', '/v1/me'), '/api/v1/me')
  assert.equal(apiUrl('/api/', '/v1/me'), '/api/v1/me')
  assert.equal(apiUrl('https://pyarcana.example/api', '/v1/health'), 'https://pyarcana.example/api/v1/health')
  for (const bad of ['/v2/me', 'v1/me', '/v1/../admin', '//evil.test/v1/me', '/v1/me\\..', 'https://evil.test/v1/me']) {
    assert.throws(() => apiUrl('/api', bad), /path/, bad)
  }
})
