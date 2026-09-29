'use client'

/**
 * Client-side singletons and small UI stores for the account components. Everything is created
 * lazily in the browser; nothing here runs during prerendering.
 */
import { create } from 'zustand'
import { createApiClient, type ApiClient } from '@/lib/cloud/api'
import { CLOUD_CONFIG, currentStage } from '@/lib/cloud/config'
import { ProgressSync, type SyncStatus } from '@/lib/cloud/progress-sync'
import { progressOwnerAdapter, progressStoreAdapter } from '@/lib/cloud/progress-adapter'
import { SyncController } from '@/lib/cloud/sync-controller'
import { Measurement } from '@/lib/cloud/measurement'
import { canMeasure, readConsent, readPrivacySignals } from '@/lib/cloud/consent'
import { readQaMode } from '@/lib/cloud/qa-mode'
import { resolveAccessState } from '@/lib/cloud/access'
import { useCloudRuntime, useCloudSession, type MePayload } from '@/lib/cloud/session'
import { signOutRequest, type ActionResult } from '@/lib/cloud/account-api'
import { safeStorage } from '@/lib/cloud/storage'
import type { TrackedEvent } from '@/lib/cloud/experiments'
import { MS_CALLBACK_PATH } from '@/lib/cloud/oidc'
import { routePath } from '@/lib/cloud/ads'
import { SITE_BASE_PATH } from '@/lib/runtime-mode'

let api: ApiClient | null = null
export function cloudApi(): ApiClient {
  api = api ?? createApiClient({ baseUrl: CLOUD_CONFIG.apiBaseUrl })
  return api
}

// --- dialog and panels -----------------------------------------------------------------------------

export type AccountView = 'main' | 'checkout'

interface AccountUi {
  open: boolean
  view: AccountView
  setOpen: (open: boolean) => void
  show: (view?: AccountView) => void
}

export const useAccountUi = create<AccountUi>()((set) => ({
  open: false,
  view: 'main',
  setOpen: (open) => set({ open }),
  show: (view = 'main') => set({ open: true, view }),
}))

/** For page.tsx handleOpenAuth: open the cloud account dialog when accounts run here. */
export function openCloudAccount(): boolean {
  if (currentStage() === 'off') return false
  useAccountUi.getState().show('main')
  return true
}

// --- auth methods (GET /v1/auth/methods), fetched once per page --------------------------------------

export interface AuthMethods {
  state: 'idle' | 'loading' | 'ok' | 'failed'
  email: boolean
  google: boolean
  microsoft: boolean
  trialDays: number | null
}

export const useAuthMethods = create<AuthMethods>()(() => ({ state: 'idle', email: false, google: false, microsoft: false, trialDays: null }))

export async function loadAuthMethods(): Promise<void> {
  if (useAuthMethods.getState().state !== 'idle') return
  useAuthMethods.setState({ state: 'loading' })
  const r = await cloudApi().get('/v1/auth/methods')
  if (!r.ok) {
    useAuthMethods.setState({ state: 'failed' })
    return
  }
  const d = r.data
  const days = typeof d.trialDays === 'number' && Number.isInteger(d.trialDays) && d.trialDays > 0 ? d.trialDays : null
  // A provider shows only when the worker accepts it AND this build's CSP allows its script/endpoint.
  useAuthMethods.setState({
    state: 'ok',
    email: d.email === true,
    google: d.google === true && CLOUD_CONFIG.googleClientId !== '',
    microsoft: d.microsoft === true && CLOUD_CONFIG.microsoftClientId !== '',
    trialDays: days,
  })
}

// --- session ------------------------------------------------------------------------------------------

/** A live me payload from a sign-in, link, trial or refresh: it decides access for this load. */
export function applyMe(me: MePayload | null): void {
  if (!me) return
  useCloudSession.setState({ me, licenseToken: me.licenseToken, fetchedAt: Date.now() })
  useCloudRuntime.setState({ meStatus: 'ok', licence: { state: 'unchecked' } })
}

/** Flush progress while the session still works, then end it. Local progress is never touched. */
export async function signOutCloud(everywhere = false): Promise<ActionResult> {
  await getProgressSync().signOut()
  const r = await signOutRequest(cloudApi(), everywhere)
  if (r.ok || r.status === 401) {
    useCloudSession.setState({ me: null, licenseToken: null, fetchedAt: Date.now() })
    useCloudRuntime.setState({ meStatus: 'signed_out', licence: { state: 'unchecked' } })
  }
  return r
}

// --- progress sync --------------------------------------------------------------------------------------

interface SyncUi {
  status: SyncStatus
  lastError: string | null
}

export const useSyncUi = create<SyncUi>()(() => ({ status: 'idle', lastError: null }))

let sync: ProgressSync | null = null
export function getProgressSync(): ProgressSync {
  if (sync) return sync
  sync = new ProgressSync({
    api: cloudApi(),
    storage: safeStorage(),
    store: progressStoreAdapter,
    owner: progressOwnerAdapter,
    now: () => Date.now(),
    onSynced: (ms) => useCloudSession.setState({ lastSyncAt: ms }),
  })
  const s = sync
  s.onStatus((status) => useSyncUi.setState({ status, lastError: s.lastError }))
  return s
}

let controller: SyncController | null = null
export function getSyncController(): SyncController {
  controller = controller ?? new SyncController({ sync: getProgressSync(), doc: document, win: window })
  return controller
}

// --- measurement ------------------------------------------------------------------------------------------

function measurementContext() {
  const storage = safeStorage()
  const signals = readPrivacySignals(typeof navigator === 'undefined' ? undefined : navigator)
  const account = useCloudSession.getState().me?.account
  const runtime = useCloudRuntime.getState()
  const stage = currentStage()
  const liveIsPro = useCloudSession.getState().me?.access.isPro === true
  return {
    canMeasure: canMeasure(CLOUD_CONFIG.consent.mode, readConsent(storage), signals, null),
    signals,
    webdriver: typeof navigator !== 'undefined' && navigator.webdriver === true,
    allowAutomation: CLOUD_CONFIG.experiments.allowAutomation,
    qaMode: readQaMode(storage).testMode,
    isAdmin: account?.isAdmin === true,
    isTester: account?.roles.includes('tester') === true,
    access: resolveAccessState({ stage, meStatus: runtime.meStatus, liveIsPro, licence: runtime.licence, nowSeconds: Math.floor(Date.now() / 1000) }),
  }
}

let measurement: Measurement | null = null
export function getMeasurement(): Measurement {
  measurement = measurement ?? new Measurement({ api: cloudApi(), storage: safeStorage(), context: measurementContext, search: () => window.location.search })
  return measurement
}

/** Record an allowlisted event when this visitor may be measured; a no-op with the stage off. */
export function track(event: TrackedEvent): void {
  if (currentStage() === 'off') return
  getMeasurement().track(event)
}

// --- Microsoft callback in progress ---------------------------------------------------------------------

const callback = { microsoft: false }

/** Mark that /cuenta is completing a Microsoft redirect (the page strips the fragment first). */
export function markMicrosoftCallback(active: boolean): void {
  callback.microsoft = active
}

/**
 * True while a Microsoft redirect is being completed: a GET /v1/me racing the sign-in could answer
 * 401 after the new session landed and wipe it from the page.
 */
export function inMicrosoftCallback(): boolean {
  if (callback.microsoft) return true
  const onCallbackRoute = routePath(window.location.pathname, SITE_BASE_PATH) === MS_CALLBACK_PATH
  return onCallbackRoute && /[#&](code|error|state)=/.test(window.location.hash)
}
