/**
 * Binds ProgressSync to the real stores through their PUBLIC APIs only: useProgressStore
 * getState / setState / subscribe / persist.hasHydrated / persist.onFinishHydration, and the
 * cloud session store for the progress owner. Nothing here touches localStorage.
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

export const progressStoreAdapter: ProgressStoreAdapter = {
  getState: () => pick(useProgressStore.getState()),
  setState: (patch) => useProgressStore.setState(patch),
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
