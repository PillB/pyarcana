'use client'

/**
 * Tiny React bindings over the pure cloud modules. Every hook reports the "nothing" value during
 * server rendering and hydration ('off', 'unknown' / 'none'), so prerendered HTML never contains
 * account, gate or ad UI; the real value arrives after mount.
 */
import { useMemo, useSyncExternalStore } from 'react'
import { currentStage, type LaunchStage } from '@/lib/cloud/config'
import { resolveAccessState, type AccessState } from '@/lib/cloud/access'
import { useCloudRuntime, useCloudSession } from '@/lib/cloud/session'
import { QA_MODE_EVENT, QA_MODE_KEY, QA_MODE_OFF, readQaMode, type QaMode } from '@/lib/cloud/qa-mode'
import { adEligibility, type AdEligibility } from '@/lib/cloud/ads'
import { createMemoryStorage, readRaw, safeStorage } from '@/lib/cloud/storage'
import { SITE_BASE_PATH } from '@/lib/runtime-mode'

const noopSubscribe = () => () => {}
const serverStage = (): LaunchStage => 'off'

/** 'off' on the server and during hydration; the configured stage after mount. */
export function useCloudStage(): LaunchStage {
  return useSyncExternalStore(noopSubscribe, () => currentStage(), serverStage)
}

export function useAccess(): AccessState {
  const stage = useCloudStage()
  const meStatus = useCloudRuntime((s) => s.meStatus)
  const licence = useCloudRuntime((s) => s.licence)
  const liveIsPro = useCloudSession((s) => s.me?.access.isPro === true)
  return resolveAccessState({ stage, meStatus, liveIsPro, licence, nowSeconds: Math.floor(Date.now() / 1000) })
}

function subscribeQaMode(onChange: () => void): () => void {
  window.addEventListener('storage', onChange)
  window.addEventListener(QA_MODE_EVENT, onChange)
  return () => {
    window.removeEventListener('storage', onChange)
    window.removeEventListener(QA_MODE_EVENT, onChange)
  }
}

export function useQaMode(): QaMode {
  const raw = useSyncExternalStore(subscribeQaMode, () => readRaw(safeStorage(), QA_MODE_KEY), () => null)
  return useMemo(() => (raw === null ? QA_MODE_OFF : readQaMode(createMemoryStorage({ [QA_MODE_KEY]: raw }))), [raw])
}

export function useAdEligibility(pathname: string): AdEligibility {
  const stage = useCloudStage()
  const access = useAccess()
  const qa = useQaMode()
  const meStatus = useCloudRuntime((s) => s.meStatus)
  const ads = useCloudSession((s) => s.me?.ads ?? null)
  return adEligibility({ stage, pathname, basePath: SITE_BASE_PATH, qa, access, liveAds: meStatus === 'ok' && ads ? ads.show : null })
}

/** Admins and testers: they see ads, but never a real network creative (chooseAdapter). */
export function useIsAdStaff(): boolean {
  return useCloudSession((s) => s.me !== null && (s.me.account.isAdmin || s.me.account.roles.includes('tester')))
}
