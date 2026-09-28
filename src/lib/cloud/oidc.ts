/**
 * Browser side of Google and Microsoft sign-in (DESIGN-v3 §B).
 *
 * Nonce, both providers: a 32-byte random preimage stays in the browser (memory for the GIS popup,
 * sessionStorage for the Microsoft redirect); the provider receives nonce = base64url(SHA-256(UTF-8
 * preimage)); the worker receives {idToken, noncePreimage} and checks the hash and single use.
 * The raw nonce inside a token therefore proves nothing to a thief.
 *
 * Microsoft: authorization code + PKCE (S256) from the browser, no MSAL, SPA platform, /common,
 * full-page redirect, response_mode=fragment, scope "openid profile email", prompt=select_account.
 * The callback route /cuenta strips the fragment first; the code is redeemed with credentials
 * 'omit' (the token endpoint answers Access-Control-Allow-Origin: *); the access token is discarded.
 *
 * Google: the GIS rendered button in popup mode with a callback; script loaded when the sign-in
 * panel mounts (never on the Microsoft callback route); no One Tap, no auto-select.
 */
import { randomB64url, sha256B64url } from '@/lib/cloud/b64'
import { normalizeOrigin } from '@/lib/cloud/config'
import { looksLikeJws } from '@/lib/cloud/licence'
import { routePath } from '@/lib/cloud/ads'
import { isPlainObject, readJson, removeKey, writeJson, type KeyValueStorage } from '@/lib/cloud/storage'

export const MS_LOGIN_ORIGIN = 'https://login.microsoftonline.com'
export const GIS_SRC = 'https://accounts.google.com/gsi/client'
export const MS_PENDING_KEY = 'pyarcana-ms-pkce-v1'
export const MS_CALLBACK_PATH = '/cuenta'
export const PENDING_MAX_AGE_MS = 10 * 60 * 1000
const SCOPE = 'openid profile email'
const GUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const NAMED_AUTHORITIES = new Set(['common', 'consumers', 'organizations'])
const ERROR_CODE = /^[a-z_]{1,64}$/

export function nonceFromPreimage(preimage: string): Promise<string> {
  return sha256B64url(preimage)
}

export async function makeNonce(): Promise<{ preimage: string; nonce: string }> {
  const preimage = randomB64url(32)
  return { preimage, nonce: await nonceFromPreimage(preimage) }
}

/** RFC 7636 §4.2: challenge = BASE64URL(SHA256(ASCII(verifier))). */
export function pkceChallenge(verifier: string): Promise<string> {
  return sha256B64url(verifier)
}

export async function makePkce(): Promise<{ verifier: string; challenge: string }> {
  const verifier = randomB64url(32)
  return { verifier, challenge: await pkceChallenge(verifier) }
}

function authorityPath(authority: string): string {
  if (NAMED_AUTHORITIES.has(authority) || GUID.test(authority)) return authority
  throw new Error(`unsupported Microsoft authority: ${authority}`)
}

export function microsoftRedirectUri(canonicalOrigin: string): string | null {
  const origin = normalizeOrigin(canonicalOrigin)
  return origin ? `${origin}${MS_CALLBACK_PATH}` : null
}

export interface AuthorizeArgs {
  authority: string
  clientId: string
  redirectUri: string
  state: string
  nonce: string
  codeChallenge: string
}

export function buildAuthorizeUrl(a: AuthorizeArgs): string {
  const url = new URL(`${MS_LOGIN_ORIGIN}/${authorityPath(a.authority)}/oauth2/v2.0/authorize`)
  const params: Record<string, string> = {
    client_id: a.clientId,
    response_type: 'code',
    redirect_uri: a.redirectUri,
    response_mode: 'fragment',
    scope: SCOPE,
    state: a.state,
    nonce: a.nonce,
    code_challenge: a.codeChallenge,
    code_challenge_method: 'S256',
    prompt: 'select_account',
  }
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v)
  return url.toString()
}

export interface TokenArgs {
  authority: string
  clientId: string
  redirectUri: string
  code: string
  verifier: string
}

export function buildTokenRequest(a: TokenArgs): { url: string; init: RequestInit } {
  const body = new URLSearchParams({
    client_id: a.clientId,
    grant_type: 'authorization_code',
    code: a.code,
    redirect_uri: a.redirectUri,
    code_verifier: a.verifier,
    scope: SCOPE,
  })
  return {
    url: `${MS_LOGIN_ORIGIN}/${authorityPath(a.authority)}/oauth2/v2.0/token`,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      credentials: 'omit',
      cache: 'no-store',
    },
  }
}

export type AuthResponse =
  | { ok: true; code: string }
  | { ok: false; reason: 'no_response' | 'state_mismatch' | 'missing_code' }
  | { ok: false; reason: 'provider_error'; error: string }

/** Read the redirect fragment. The state we sent must come back before anything else counts. */
export function parseAuthResponse(hash: string, expectedState: string | null): AuthResponse {
  const params = new URLSearchParams(hash.startsWith('#') ? hash.slice(1) : hash)
  if (!params.has('code') && !params.has('error') && !params.has('state')) return { ok: false, reason: 'no_response' }
  if (!expectedState || params.get('state') !== expectedState) return { ok: false, reason: 'state_mismatch' }
  const error = params.get('error')
  if (error !== null) return { ok: false, reason: 'provider_error', error: ERROR_CODE.test(error) ? error : 'unknown' }
  const code = params.get('code')
  return code ? { ok: true, code } : { ok: false, reason: 'missing_code' }
}

/** 'signin' starts a session; 'link' adds Microsoft to the signed-in account (POST /v1/me/link/microsoft). */
export type MicrosoftPurpose = 'signin' | 'link'

export interface PendingMicrosoft {
  state: string
  verifier: string
  noncePreimage: string
  createdAt: number
  returnTo: string
  purpose: MicrosoftPurpose
}

/** Same-site relative paths only; anything else returns to the start page. */
function safeReturnTo(value: string): string {
  return value.startsWith('/') && !value.startsWith('//') && !value.includes('\\') ? value : '/'
}

export async function beginMicrosoft(
  session: KeyValueStorage | null,
  o: { authority: string; clientId: string; redirectUri: string; nowMs: number; returnTo: string; purpose?: MicrosoftPurpose }
): Promise<{ url: string }> {
  const [pkce, nonce] = await Promise.all([makePkce(), makeNonce()])
  const pending: PendingMicrosoft = {
    state: randomB64url(32),
    verifier: pkce.verifier,
    noncePreimage: nonce.preimage,
    createdAt: o.nowMs,
    returnTo: safeReturnTo(o.returnTo),
    purpose: o.purpose ?? 'signin',
  }
  const url = buildAuthorizeUrl({ authority: o.authority, clientId: o.clientId, redirectUri: o.redirectUri, state: pending.state, nonce: nonce.nonce, codeChallenge: pkce.challenge })
  writeJson(session, MS_PENDING_KEY, pending)
  return { url }
}

const PURPOSES = new Set<unknown>(['signin', 'link'])

function readPending(raw: unknown): PendingMicrosoft | null {
  if (!isPlainObject(raw)) return null
  const { state, verifier, noncePreimage, createdAt, returnTo } = raw
  const strings = [state, verifier, noncePreimage, returnTo].every((v) => typeof v === 'string' && v !== '')
  // A record written before purposes existed is a sign-in; any other value is refused.
  const purpose = raw.purpose === undefined ? 'signin' : raw.purpose
  if (!strings || typeof createdAt !== 'number' || !PURPOSES.has(purpose)) return null
  return { ...(raw as unknown as PendingMicrosoft), purpose: purpose as MicrosoftPurpose }
}

/** Read and delete the pending sign-in (single use); null when missing, corrupt or older than 10 min. */
export function takePending(session: KeyValueStorage | null, nowMs: number): PendingMicrosoft | null {
  const pending = readPending(readJson(session, MS_PENDING_KEY))
  removeKey(session, MS_PENDING_KEY)
  if (!pending || nowMs - pending.createdAt > PENDING_MAX_AGE_MS || nowMs < pending.createdAt) return null
  return { ...pending, returnTo: safeReturnTo(pending.returnTo) }
}

export function extractIdToken(body: unknown): string | null {
  return isPlainObject(body) && looksLikeJws(body.id_token) ? body.id_token : null
}

// --- Google Identity Services ----------------------------------------------------------------

export interface GisInitOptions {
  client_id: string
  callback: (response: { credential?: string }) => void
  nonce: string
  ux_mode: 'popup'
  auto_select: false
  context: 'signin'
}

export function gisInitOptions(o: { clientId: string; nonce: string; callback: GisInitOptions['callback'] }): GisInitOptions {
  return { client_id: o.clientId, callback: o.callback, nonce: o.nonce, ux_mode: 'popup', auto_select: false, context: 'signin' }
}

const GIS_LOCALE: Record<string, string> = { 'es-PE': 'es-419', 'es-ES': 'es', en: 'en' }

/** Button options; the button speaks the UI language. */
export function gisButtonOptions(uiLanguage: string) {
  return {
    type: 'standard',
    theme: 'outline',
    size: 'large',
    text: 'continue_with',
    shape: 'rectangular',
    logo_alignment: 'left',
    locale: GIS_LOCALE[uiLanguage] ?? 'es-419',
  } as const
}

/** No third-party script on the Microsoft callback route (it holds the code and the verifier). */
export function gisAllowedOn(pathname: string, basePath = ''): boolean {
  return routePath(pathname, basePath) !== MS_CALLBACK_PATH
}

export interface ScriptElement {
  src: string
  async: boolean
  onload: (() => void) | null
  onerror: (() => void) | null
}

export interface ScriptHost {
  createElement(tag: 'script'): ScriptElement
  appendScript(el: ScriptElement): void
}

export function browserScriptHost(): ScriptHost {
  return {
    createElement: () => document.createElement('script') as unknown as ScriptElement,
    appendScript: (el) => {
      document.head.appendChild(el as unknown as HTMLScriptElement)
    },
  }
}

/** One <script> per URL; concurrent callers share the load; a failed load can be retried. */
export function createScriptLoader(host: ScriptHost) {
  const loads = new Map<string, Promise<void>>()
  return {
    load(src: string): Promise<void> {
      const existing = loads.get(src)
      if (existing) return existing
      const promise = new Promise<void>((resolve, reject) => {
        const el = host.createElement('script')
        el.src = src
        el.async = true
        el.onload = () => resolve()
        el.onerror = () => {
          loads.delete(src)
          reject(new Error(`failed to load ${src}`))
        }
        host.appendScript(el)
      })
      loads.set(src, promise)
      return promise
    },
  }
}
