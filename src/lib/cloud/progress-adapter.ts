/**
 * Binds ProgressSync to the real stores through their PUBLIC APIs only: useProgressStore
 * getState / setState / subscribe / persist.hasHydrated / persist.onFinishHydration, and the
 * cloud session store for the progress owner. Nothing here touches localStorage. Only the sync
 * and the handoff write through this adapter; the learner's own actions use the store's actions.
 */
import { useProgressStore } from '@/lib/progress-store'
import type { ProgressState } from '@/lib/cloud/progress-merge'
import type { OwnerAdapter, ProgressStoreAdapter } from '@/lib/cloud/progress-sync'
import { useCloudSession } from '@/lib/cloud/session'

function pick(s: ProgressState): ProgressState {
  return {
    completedSections: s.completedSections,
    completedSubSteps: s.completedSubSteps,
    quizScores: s.quizScores,
    lastVisited: s.lastVisited,
    bookmarks: s.bookmarks,
    startDate: s.startDate,
    isHydratedFromServer: s.isHydratedFromServer,
  }
}

let remoteDepth = 0

/**
 * True while the progress sync or the #import= handoff is writing into the progress store, i.e.
 * inside progressStoreAdapter.setState. zustand calls subscribers synchronously, so a listener that
 * reacts to the learner's own actions (section_complete, the CSAT prompt) can ignore these writes:
 * another device's completion arriving here is not a completion on this device.
 */
export function isApplyingRemote(): boolean {
  return remoteDepth > 0
}

export const progressStoreAdapter: ProgressStoreAdapter = {
  getState: () => pick(useProgressStore.getState()),
  setState: (patch) => {
    remoteDepth += 1
    try {
      useProgressStore.setState(patch)
    } finally {
      remoteDepth -= 1
    }
  },
  subscribe: (listener) => useProgressStore.subscribe((state, prev) => listener(pick(state), pick(prev))),
}

export const progressOwnerAdapter: OwnerAdapter = {
  get: () => useCloudSession.getState().progressOwner,
  set: (accountId) => useCloudSession.setState({ progressOwner: accountId }),
}

/** Run `fn` once the persisted progress has been read (sync must never start before that). */
export function whenProgressHydrated(fn: () => void): () => void {
  if (useProgressStore.persist.hasHydrated()) {
    fn()
    return () => {}
  }
  return useProgressStore.persist.onFinishHydration(() => fn())
}

