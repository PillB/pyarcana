'use client'

/**
 * Client-side singletons and small UI stores for the account components. Everything is created
 * lazily in the browser; nothing here runs during prerendering.
 */
import { useEffect } from 'react'
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
import { signOutAccount, signOutRequest, type ActionResult } from '@/lib/cloud/account-api'
import { safeStorage } from '@/lib/cloud/storage'
import type { TrackedEvent } from '@/lib/cloud/experiments'
import { gisAllowedOn, isMicrosoftCallbackLoad } from '@/lib/cloud/oidc'
import { HandoffImporter } from '@/lib/cloud/handoff-import'
import { movedState } from '@/lib/cloud/ui-state'
import { IS_STATIC_SITE, SITE_BASE_PATH } from '@/lib/runtime-mode'

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

/** The store; read it through useLoadedAuthMethods, which also fetches it. */
const authMethodsStore = create<AuthMethods>()(() => ({ state: 'idle', email: false, google: false, microsoft: false, trialDays: null }))

export async function loadAuthMethods(): Promise<void> {
  if (authMethodsStore.getState().state !== 'idle') return
  authMethodsStore.setState({ state: 'loading' })
  const r = await cloudApi().get('/v1/auth/methods')
  if (!r.ok) {
    authMethodsStore.setState({ state: 'failed' })
    return
  }
  const d = r.data
  const days = typeof d.trialDays === 'number' && Number.isInteger(d.trialDays) && d.trialDays > 0 ? d.trialDays : null
  // A provider shows only when the worker accepts it AND this build's CSP allows its script/endpoint.
  authMethodsStore.setState({
    state: 'ok',
    email: d.email === true,
    google: d.google === true && CLOUD_CONFIG.googleClientId !== '',
    microsoft: d.microsoft === true && CLOUD_CONFIG.microsoftClientId !== '',
    trialDays: days,
  })
}

/**
 * The sign-in methods and trial length, fetched once per page on first use. Every reader loads it:
 * the signed-in panel used to read the store without loading it, so it could never offer to link
 * Google or Microsoft and the trial button lost its day count.
 */
export function useLoadedAuthMethods(): AuthMethods
export function useLoadedAuthMethods<T>(select: (m: AuthMethods) => T): T
export function useLoadedAuthMethods<T>(select?: (m: AuthMethods) => T): T | AuthMethods {
  useEffect(() => {
    void loadAuthMethods()
  }, [])
  return authMethodsStore((m) => (select ? select(m) : m))
}

// --- session ------------------------------------------------------------------------------------------

/** A live me payload from a sign-in, link, trial or refresh: it decides access for this load. */
export function applyMe(me: MePayload | null): void {
  if (!me) return
  useCloudSession.setState({ me, licenseToken: me.licenseToken, fetchedAt: Date.now() })
  useCloudRuntime.setState({ meStatus: 'ok', licence: { state: 'unchecked' } })
}

/**
 * Flush progress while the session still works, then end it. Local progress is never touched. Sync
 * stops through the SyncController only once the logout took effect (account-api signOutAccount).
 */
export function signOutCloud(everywhere = false): Promise<ActionResult> {
  return signOutAccount({
    sync: getProgressSync(),
    request: () => signOutRequest(cloudApi(), everywhere),
    onSignedOut: () => {
      useCloudSession.setState({ me: null, licenseToken: null, fetchedAt: Date.now() })
      useCloudRuntime.setState({ meStatus: 'signed_out', licence: { state: 'unchecked' } })
    },
  })
}

// --- progress sync --------------------------------------------------------------------------------------

interface SyncUi {
  status: SyncStatus
  lastError: string | null
  /** The learner closed the owner-choice dialog for now; the choice stays pending and sync paused. */
  choiceDeferred: boolean
}

export const useSyncUi = create<SyncUi>()(() => ({ status: 'idle', lastError: null, choiceDeferred: false }))

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
  // Leaving needs_choice clears "Decidir después", so a later conflict asks again.
  s.onStatus((status) => useSyncUi.setState({ status, lastError: s.lastError, choiceDeferred: status === 'needs_choice' && useSyncUi.getState().choiceDeferred }))
  return s
}

let controller: SyncController | null = null
export function getSyncController(): SyncController {
  controller = controller ?? new SyncController({ sync: getProgressSync(), doc: document, win: window })
  return controller
}

// --- #import= handoff (one per page load; the grandfather snapshot waits for it) -------------------------

function isImportTarget(hash: string): boolean {
  const input = { origin: window.location.origin, isStaticSite: IS_STATIC_SITE, canonicalOrigin: CLOUD_CONFIG.canonicalOrigin, movedToCanonical: CLOUD_CONFIG.movedToCanonical, hash }
  return movedState(input) === 'import'
}

let importer: HandoffImporter | null = null
export function getHandoffImporter(): HandoffImporter {
  importer = importer ?? new HandoffImporter({
    readHash: () => window.location.hash,
    currentHref: () => window.location.href,
    replaceUrl: (url) => window.history.replaceState(null, '', url),
    isImportTarget,
    store: progressStoreAdapter,
    storage: safeStorage(),
    now: () => Date.now(),
  })
  return importer
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
  measurement =
    measurement ??
    new Measurement({
      api: cloudApi(),
      storage: safeStorage(),
      context: measurementContext,
      search: () => window.location.search,
      accountId: () => useCloudSession.getState().me?.account.id ?? null,
    })
  return measurement
}

/** Record an allowlisted event when this visitor may be measured; a no-op with the stage off. */
export function track(event: TrackedEvent): void {
  if (currentStage() === 'off') return
  getMeasurement().track(event)
}

// --- Microsoft callback in progress ---------------------------------------------------------------------

const callback = { microsoft: false, leaving: false }

/**
 * Where this page view began, read when this module is first evaluated: before any component
 * renders, so before AccountPage's effect strips a Microsoft fragment with replaceState. Reading
 * location.hash later (a useState initializer at mount, say) can see the cleaned URL.
 */
const INITIAL_LOCATION = typeof window === 'undefined' ? { pathname: '', hash: '' } : { pathname: window.location.pathname, hash: window.location.hash }

/** Google's script may load in this page view (oidc.ts gisAllowedOn: not a Microsoft callback load). */
export function gisAllowedThisPageView(): boolean {
  return gisAllowedOn(INITIAL_LOCATION, SITE_BASE_PATH)
}

/** Mark that /cuenta is completing a Microsoft redirect (the page strips the fragment first). */
export function markMicrosoftCallback(active: boolean): void {
  callback.microsoft = active
}

/** /cuenta is about to location.replace() back to where sign-in started: start nothing here. */
export function markLeavingPage(): void {
  callback.leaving = true
}

export function isLeavingPage(): boolean {
  return callback.leaving
}

/**
 * True while a Microsoft redirect is being completed: a GET /v1/me racing the sign-in could answer
 * 401 after the new session landed and wipe it from the page.
 */
export function inMicrosoftCallback(): boolean {
  if (callback.microsoft) return true
  return isMicrosoftCallbackLoad(window.location.pathname, window.location.hash, SITE_BASE_PATH)
}
