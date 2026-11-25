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
import { useTheoryCheckpoints } from '@/lib/theory-checkpoints'

/** The synced state is two stores: the progress record and the theory parts read. */
function pick(s: ProgressState, theoryParts = useTheoryCheckpoints.getState().read): ProgressState {
  return {
    theoryParts,
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

/**
 * Runs `apply` as a write that did not come from this tab's learner, so listeners that read
 * isApplyingRemote() ignore it. Used when another tab's progress is re-read
 * (src/lib/progress-cross-tab.ts): a completion made in tab A is not a second completion in tab B.
 */
export function applyAsRemote<T>(apply: () => T): T {
  remoteDepth += 1
  try {
    return apply()
  } finally {
    remoteDepth -= 1
  }
}

export const progressStoreAdapter: ProgressStoreAdapter = {
  getState: () => pick(useProgressStore.getState()),
  setState: (patch) => {
    remoteDepth += 1
    try {
      // Progress first: a wipe there clears the parts (followProgressReset), and the account's
      // own parts, written after, must be what is left.
      const { theoryParts, ...progress } = patch
      useProgressStore.setState(progress)
      // Same content: leave the store alone (no re-render, no write to storage on every pull).
      if (theoryParts !== undefined && JSON.stringify(theoryParts) !== JSON.stringify(useTheoryCheckpoints.getState().read)) {
        useTheoryCheckpoints.setState({ read: theoryParts })
      }
    } finally {
      remoteDepth -= 1
    }
  },
  subscribe: (listener) => {
    const stopProgress = useProgressStore.subscribe((state, prev) => listener(pick(state), pick(prev)))
    const stopParts = useTheoryCheckpoints.subscribe((state, prev) => {
      if (state.read === prev.read) return
      const progress = useProgressStore.getState()
      listener(pick(progress, state.read), pick(progress, prev.read))
    })
    return () => {
      stopProgress()
      stopParts()
    }
  },
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

