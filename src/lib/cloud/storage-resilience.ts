/**
 * Keeping the browser's copy of progress as safe as a browser allows (owner request, 4 Oct 2026).
 *
 * 1. navigator.storage.persist() asks the browser not to evict this site's storage under storage
 *    pressure. Chrome and Edge decide silently (engagement, installed app, bookmarks); Firefox may
 *    show a prompt; Safari's seven-day deletion of script-written storage for sites the user has not
 *    visited is not lifted by it for an ordinary website. It is asked once, after the learner's
 *    first completed step, and the answer is remembered so it is never asked again.
 * 2. A sign-in nudge for signed-out learners with progress worth keeping: the only copy that
 *    survives a cleared browser or a new device is the account's. Shown from NUDGE_MIN_STEPS
 *    completed steps, never where accounts are off, and at most once a week after "Ahora no".
 */
import type { LaunchStage } from '@/lib/cloud/config'
import type { KeyValueStorage } from '@/lib/cloud/storage'

export const PERSIST_KEY = 'pyarcana:storagePersist:v1'
export const NUDGE_KEY = 'pyarcana:signinNudge:v1'
export const NUDGE_MIN_STEPS = 3
export const NUDGE_SNOOZE_MS = 7 * 24 * 3600 * 1000

export type PersistAnswer = 'granted' | 'denied' | 'unsupported'

export interface StorageManagerLike {
  persist?: () => Promise<boolean>
  persisted?: () => Promise<boolean>
}

/** Completed sub-steps across every section. */
export function completedSteps(state: { completedSubSteps: Record<string, string[]> }): number {
  return Object.values(state.completedSubSteps ?? {}).reduce((n, steps) => n + (Array.isArray(steps) ? steps.length : 0), 0)
}

/** The remembered answer, or null when the browser was never asked. */
export function rememberedPersist(storage: KeyValueStorage | null): PersistAnswer | null {
  const v = storage?.getItem(PERSIST_KEY)
  return v === 'granted' || v === 'denied' || v === 'unsupported' ? v : null
}

/**
 * Ask once. An answer already stored is returned without asking; a browser without the API is
 * recorded as unsupported; an error counts as denied (never retried in a loop).
 */
export async function requestPersistOnce(manager: StorageManagerLike | undefined, storage: KeyValueStorage | null): Promise<PersistAnswer> {
  const known = rememberedPersist(storage)
  if (known) return known
  let answer: PersistAnswer = 'unsupported'
  if (manager && typeof manager.persist === 'function') {
    try {
      const already = typeof manager.persisted === 'function' && (await manager.persisted())
      answer = already || (await manager.persist()) ? 'granted' : 'denied'
    } catch {
      answer = 'denied'
    }
  }
  storage?.setItem(PERSIST_KEY, answer)
  return answer
}

/** Whether to show the sign-in nudge now. */
export function showSigninNudge(i: { signedIn: boolean; isStaticSite: boolean; stage: LaunchStage; steps: number; dismissedAt: number | null; now: number }): boolean {
  if (i.signedIn || !i.isStaticSite || i.stage === 'off') return false
  if (i.steps < NUDGE_MIN_STEPS) return false
  return i.dismissedAt === null || i.now - i.dismissedAt >= NUDGE_SNOOZE_MS
}

/** When "Ahora no" was last pressed, or null. */
export function nudgeDismissedAt(storage: KeyValueStorage | null): number | null {
  const n = Number(storage?.getItem(NUDGE_KEY))
  return Number.isFinite(n) && n > 0 ? n : null
}
