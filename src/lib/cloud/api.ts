/**
 * The only way the static site talks to the worker (DESIGN-v2 §8.2, v3 §A).
 *
 * - Cookie session: `credentials: 'include'`; no bearer token is ever stored.
 * - CSRF: every state-changing request carries `X-PyArcana: 1` (forces a preflight cross-origin;
 *   the worker refuses its absence with 403 bad_origin).
 * - 8 s timeout. Never throws: network failure -> reason 'network', timeout -> 'timeout'.
 * - A reason string from the server reaches the UI only if it is a plain snake_case code.
 */
import { isPlainObject } from '@/lib/cloud/storage'

export type ApiOk<T> = { ok: true; status: number; data: T }
export type ApiFail = { ok: false; status: number; reason: string; data: Record<string, unknown> | null }
export type ApiResult<T> = ApiOk<T> | ApiFail

export interface RequestOptions {
  keepalive?: boolean
}

export interface ApiClient {
  get<T = Record<string, unknown>>(path: string, opts?: RequestOptions): Promise<ApiResult<T>>
  post<T = Record<string, unknown>>(path: string, body: unknown, opts?: RequestOptions): Promise<ApiResult<T>>
  put<T = Record<string, unknown>>(path: string, body: unknown, opts?: RequestOptions): Promise<ApiResult<T>>
  patch<T = Record<string, unknown>>(path: string, body: unknown, opts?: RequestOptions): Promise<ApiResult<T>>
  del<T = Record<string, unknown>>(path: string, body?: unknown, opts?: RequestOptions): Promise<ApiResult<T>>
}

export interface ApiClientOptions {
  baseUrl: string
  fetch?: typeof fetch
  timeoutMs?: number
}

export const API_TIMEOUT_MS = 8000
const REASON = /^[a-z][a-z0-9_]{0,63}$/
const SAFE_PATH = /^\/v1\/[A-Za-z0-9_\-/.?=&%]*$/

/** Join the base and a /v1/ path; throws on anything else (a bug, never user input). */
export function apiUrl(baseUrl: string, path: string): string {
  if (!SAFE_PATH.test(path) || path.includes('..') || path.includes('//')) {
    throw new Error(`api path must be a /v1/ path: ${path}`)
  }
  return baseUrl.replace(/\/+$/, '') + path
}

function buildInit(method: string, body: unknown, opts: RequestOptions, signal: AbortSignal): RequestInit {
  const headers: Record<string, string> = { Accept: 'application/json' }
  if (method !== 'GET') headers['X-PyArcana'] = '1'
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  return {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'include',
    cache: 'no-store',
    keepalive: opts.keepalive === true,
    signal,
  }
}

function parseBody(text: string): unknown {
  if (text === '') return {}
  try {
    return JSON.parse(text) as unknown
  } catch {
    return undefined
  }
}

function reasonOf(body: unknown, status: number): string {
  const reason = isPlainObject(body) ? body.reason : undefined
  return typeof reason === 'string' && REASON.test(reason) ? reason : `http_${status}`
}

export function interpret<T>(status: number, text: string): ApiResult<T> {
  const body = parseBody(text)
  const obj = isPlainObject(body) ? body : null
  const httpOk = status >= 200 && status < 300
  if (httpOk && !obj) return { ok: false, status, reason: 'bad_response', data: null }
  if (httpOk && obj!.ok !== false) return { ok: true, status, data: obj as T }
  return { ok: false, status, reason: reasonOf(obj, status), data: obj }
}

async function send<T>(options: ApiClientOptions, method: string, path: string, body: unknown, opts: RequestOptions = {}): Promise<ApiResult<T>> {
  const doFetch = options.fetch ?? ((input: RequestInfo | URL, init?: RequestInit) => globalThis.fetch(input, init))
  const controller = new AbortController()
  let timedOut = false
  const timer = setTimeout(() => {
    timedOut = true
    controller.abort()
  }, options.timeoutMs ?? API_TIMEOUT_MS)
  try {
    const res = await doFetch(apiUrl(options.baseUrl, path), buildInit(method, body, opts, controller.signal))
    const text = await res.text()
    return interpret<T>(res.status, text)
  } catch {
    return { ok: false, status: 0, reason: timedOut ? 'timeout' : 'network', data: null }
  } finally {
    clearTimeout(timer)
  }
}

export function createApiClient(options: ApiClientOptions): ApiClient {
  return {
    get: (path, opts) => send(options, 'GET', path, undefined, opts),
    post: (path, body, opts) => send(options, 'POST', path, body, opts),
    put: (path, body, opts) => send(options, 'PUT', path, body, opts),
    patch: (path, body, opts) => send(options, 'PATCH', path, body, opts),
    del: (path, body, opts) => send(options, 'DELETE', path, body, opts),
  }
}

/** The worker could not answer (offline, timeout, 5xx): the case where a cached licence counts. */
export function isUnavailable(result: ApiResult<unknown>): boolean {
  return !result.ok && (result.status === 0 || result.status >= 500)
}
