/**
 * The signed-in session as the static site sees it (DESIGN-v2 §8.3, v3-delta licence section).
 *
 * Persisted under `pyarcana-cloud-v1`: the last /v1/me payload (DISPLAY ONLY), the signed licence
 * token (the only thing that may grant Pro offline, after verification), the progress owner and
 * the last sync time. The session itself is an HttpOnly cookie the page cannot read; nothing here
 * is a credential.
 *
 * The per-load outcome of /v1/me and the licence check live in a separate, non-persisted runtime
 * store: they must never survive a reload.
 */
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { createApiClient, isUnavailable, type ApiClient, type ApiResult } from '@/lib/cloud/api'
import { CLOUD_CONFIG, normalizeOrigin, type LicencePublicKey } from '@/lib/cloud/config'
import { checkCachedLicence, type LicenceStatus, type MeStatus } from '@/lib/cloud/access'
import { looksLikeJws } from '@/lib/cloud/licence'
import { createMemoryStorage, isPlainObject, safeStorage, type KeyValueStorage } from '@/lib/cloud/storage'

export const CLOUD_SESSION_KEY = 'pyarcana-cloud-v1'

export type AccessSource = 'paid' | 'gift' | 'trial' | 'tester' | null

export interface MeAccount {
  id: string
  email: string | null
  emailVerified: boolean
  displayName: string | null
  isAdmin: boolean
  roles: string[]
  firstSigninAt: number | null
  trialAvailable: boolean
  /** How THIS session signed in (the worker's session.method). */
  signInMethod: SignInMethod | null
  /**
   * Every way in the account holds (the worker's account.identities, provider only; the masked
   * subject is not kept). Empty for a cached payload from before the field existed.
   */
  identities: SignInMethod[]
}

export type SignInMethod = 'google' | 'microsoft' | 'email'
const METHODS = new Set<unknown>(['google', 'microsoft', 'email'])

export interface MeAccess {
  isPro: boolean
  source: AccessSource
  accessEnd: number | null
  indefinite: boolean
  graceUntil: number | null
  pendingGrantDays: number
  upcoming: Array<{ kind: string; start: number; end: number | null }>
}

export interface MeSubscription {
  id: string
  provider: string
  plan: string
  status: string
  cancelAtPeriodEnd: boolean
  paidThrough: number | null
  manageUrl: string | null
}

export interface MeGrant {
  id: string
  kind: string
  days: number | null
  start: number | null
  end: number | null
  state: string
}

/** Whether this account sees ads, and why (worker ads.mjs). */
export interface MeAds {
  show: boolean
  reason: 'default' | 'paid' | 'trial' | 'disabled'
}

export interface MePayload {
  account: MeAccount
  access: MeAccess
  /** Null for a payload from a worker without the field (older cache). */
  ads: MeAds | null
  subscriptions: MeSubscription[]
  grants: MeGrant[]
  checkoutPending: boolean
  serverTime: number | null
  licenseToken: string | null
}

const str = (v: unknown): string | null => (typeof v === 'string' ? v : null)
const num = (v: unknown): number | null => (typeof v === 'number' && Number.isFinite(v) ? v : null)
const list = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
const SOURCES = new Set(['paid', 'gift', 'trial', 'tester'])

/** Only https links reach an href (a provider "manage" URL from the server). */
export function safeHttpsUrl(v: unknown): string | null {
  if (typeof v !== 'string') return null
  try {
    return new URL(v).protocol === 'https:' ? v : null
  } catch {
    return null
  }
}

function parseIdentities(raw: unknown): SignInMethod[] {
  const providers = list(raw).filter(isPlainObject).map((i) => i.provider)
  return [...new Set(providers.filter((p): p is SignInMethod => METHODS.has(p)))]
}

function parseAccount(raw: unknown): MeAccount | null {
  if (!isPlainObject(raw) || typeof raw.id !== 'string' || raw.id === '') return null
  return {
    id: raw.id,
    email: str(raw.email),
    emailVerified: raw.emailVerified === true,
    displayName: str(raw.displayName),
    isAdmin: raw.isAdmin === true,
    roles: list(raw.roles).filter((r): r is string => typeof r === 'string'),
    firstSigninAt: num(raw.firstSigninAt),
    trialAvailable: raw.trialAvailable === true,
    signInMethod: METHODS.has(raw.signInMethod) ? (raw.signInMethod as SignInMethod) : null,
    identities: parseIdentities(raw.identities),
  }
}

function parseUpcoming(raw: unknown): MeAccess['upcoming'] {
  return list(raw)
    .filter(isPlainObject)
    .filter((u) => typeof u.kind === 'string' && num(u.start) !== null)
    .map((u) => ({ kind: u.kind as string, start: u.start as number, end: num(u.end) }))
}

function parseAccess(raw: unknown): MeAccess {
  const a = isPlainObject(raw) ? raw : {}
  const source = typeof a.source === 'string' && SOURCES.has(a.source) ? (a.source as AccessSource) : null
  return {
    isPro: a.isPro === true,
    source,
    accessEnd: num(a.accessEnd),
    indefinite: a.indefinite === true,
    graceUntil: num(a.graceUntil),
    pendingGrantDays: num(a.pendingGrantDays) ?? 0,
    upcoming: parseUpcoming(a.upcoming),
  }
}

const AD_REASONS = new Set<unknown>(['default', 'paid', 'trial', 'disabled'])

function parseAds(raw: unknown): MeAds | null {
  if (!isPlainObject(raw) || typeof raw.show !== 'boolean' || !AD_REASONS.has(raw.reason)) return null
  return { show: raw.show, reason: raw.reason as MeAds['reason'] }
}

function parseSubscription(s: Record<string, unknown>): MeSubscription | null {
  if (typeof s.id !== 'string') return null
  return {
    id: s.id,
    provider: str(s.provider) ?? '',
    plan: str(s.plan) ?? '',
    status: str(s.status) ?? '',
    cancelAtPeriodEnd: s.cancelAtPeriodEnd === true,
    paidThrough: num(s.paidThrough),
    manageUrl: safeHttpsUrl(s.manageUrl),
  }
}

function parseGrant(g: Record<string, unknown>): MeGrant | null {
  if (typeof g.id !== 'string') return null
  return { id: g.id, kind: str(g.kind) ?? '', days: num(g.days), start: num(g.start), end: num(g.end), state: str(g.state) ?? '' }
}

/** Validate a /v1/me payload (or a cached copy). Null when there is no usable account. */
export function parseMe(raw: unknown): MePayload | null {
  if (!isPlainObject(raw)) return null
  const account = parseAccount(raw.account)
  if (!account) return null
  return {
    account,
    access: parseAccess(raw.access),
    ads: parseAds(raw.ads),
    subscriptions: list(raw.subscriptions).filter(isPlainObject).map(parseSubscription).filter((s): s is MeSubscription => s !== null),
    grants: list(raw.grants).filter(isPlainObject).map(parseGrant).filter((g): g is MeGrant => g !== null),
    checkoutPending: raw.checkoutPending === true,
    serverTime: num(raw.serverTime),
    licenseToken: looksLikeJws(raw.licenseToken) ? raw.licenseToken : null,
  }
}

export interface PersistedCloud {
  me: MePayload | null
  fetchedAt: number | null
  licenseToken: string | null
  progressOwner: string | null
  lastSyncAt: number | null
}

export const EMPTY_CLOUD: PersistedCloud = { me: null, fetchedAt: null, licenseToken: null, progressOwner: null, lastSyncAt: null }

/** Stored state is untrusted input: rebuild it field by field. */
export function sanitizeCloudPersisted(raw: unknown): PersistedCloud {
  const s = isPlainObject(raw) ? raw : {}
  return {
    me: parseMe(s.me),
    fetchedAt: num(s.fetchedAt),
    licenseToken: looksLikeJws(s.licenseToken) ? s.licenseToken : null,
    progressOwner: typeof s.progressOwner === 'string' && s.progressOwner !== '' ? s.progressOwner : null,
    lastSyncAt: num(s.lastSyncAt),
  }
}

/** Map this load's /v1/me result onto a state patch and a status. */
export function applyMeResponse(result: ApiResult<Record<string, unknown>>, nowMs: number): { status: MeStatus; next: Partial<PersistedCloud> } {
  if (result.ok) {
    const me = parseMe(result.data)
    if (!me) return { status: 'unavailable', next: {} }
    return { status: 'ok', next: { me, licenseToken: me.licenseToken, fetchedAt: nowMs } }
  }
  if (result.status === 401) return { status: 'signed_out', next: { me: null, licenseToken: null, fetchedAt: nowMs } }
  return { status: isUnavailable(result) ? 'unavailable' : 'error', next: {} }
}

export function createCloudSessionStore(getStorage: () => KeyValueStorage) {
  return create<PersistedCloud>()(
    persist(() => ({ ...EMPTY_CLOUD }), {
      name: CLOUD_SESSION_KEY,
      version: 1,
      storage: createJSONStorage(getStorage),
      partialize: (s) => ({ me: s.me, fetchedAt: s.fetchedAt, licenseToken: s.licenseToken, progressOwner: s.progressOwner, lastSyncAt: s.lastSyncAt }),
      migrate: (persisted) => sanitizeCloudPersisted(persisted),
      merge: (persisted, current) => ({ ...current, ...sanitizeCloudPersisted(persisted) }),
    })
  )
}

export interface CloudRuntime {
  meStatus: MeStatus
  licence: LicenceStatus
}

export function createCloudRuntimeStore() {
  return create<CloudRuntime>()(() => ({ meStatus: 'idle', licence: { state: 'unchecked' } }))
}

export type CloudSessionStore = ReturnType<typeof createCloudSessionStore>
export type CloudRuntimeStore = ReturnType<typeof createCloudRuntimeStore>

let memoryFallback: KeyValueStorage | null = null
function browserOrMemory(): KeyValueStorage {
  const real = safeStorage()
  if (real) return real
  memoryFallback = memoryFallback ?? createMemoryStorage()
  return memoryFallback
}

export const useCloudSession = createCloudSessionStore(browserOrMemory)
export const useCloudRuntime = createCloudRuntimeStore()

export interface RefreshDeps {
  api: ApiClient
  session: CloudSessionStore
  runtime: CloudRuntimeStore
  keys: LicencePublicKey[]
  audience: string | null
  now: () => number
}

export function defaultRefreshDeps(): RefreshDeps {
  return {
    api: createApiClient({ baseUrl: CLOUD_CONFIG.apiBaseUrl }),
    session: useCloudSession,
    runtime: useCloudRuntime,
    keys: CLOUD_CONFIG.licence.publicKeys,
    audience: normalizeOrigin(CLOUD_CONFIG.canonicalOrigin),
    now: () => Date.now(),
  }
}

/** GET /v1/me once for this load; on an unreachable worker, verify the cached licence. */
export async function refreshMe(deps: RefreshDeps = defaultRefreshDeps()): Promise<MeStatus> {
  deps.runtime.setState({ meStatus: 'pending' })
  const result = await deps.api.get('/v1/me')
  const { status, next } = applyMeResponse(result, deps.now())
  deps.session.setState(next)
  deps.runtime.setState({ meStatus: status, licence: status === 'unavailable' ? { state: 'checking' } : { state: 'unchecked' } })
  if (status === 'unavailable') {
    const cached = deps.session.getState()
    const licence = await checkCachedLicence(cached.licenseToken, {
      keys: deps.keys,
      audience: deps.audience,
      nowSeconds: Math.floor(deps.now() / 1000),
      accountId: cached.me?.account.id ?? null,
    })
    deps.runtime.setState({ licence })
  }
  return status
}
