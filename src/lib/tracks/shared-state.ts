/**
 * One copy of a track's state per page, shared by every component that shows it.
 *
 * The track page, the section banner and the menu entry each called the hook, and each kept its
 * own copy: a tick on the track page reached other tabs (`storage` event) but not the menu in the
 * same tab, because a page never receives its own `storage` events (STATE_MACHINES.md, SM2). This
 * store is read with React's `useSyncExternalStore`: every writer in the page goes through it, and
 * it notifies all readers. Another tab's writes arrive through `handleStorageEvent`.
 */
import { advanceFurthest, type PlacedSection } from './placement'
import {
  commitTrackStep,
  markTrackFinished,
  saveTrackProgressPreserving,
  setTrackStep,
  loadTrackFurthest,
  loadTrackProgress,
  saveTrackFurthest,
  serializeTrackProgress,
  trackFurthestKey,
  trackProgressKey,
  type KeyValueStore,
  type TrackProgress,
} from './progress'

export interface TrackSnapshot {
  progress: TrackProgress
  furthestSeen: string | null
  /** The last write was refused by the browser. */
  saveFailed: boolean
}

export const EMPTY_TRACK_SNAPSHOT: TrackSnapshot = Object.freeze({ progress: { done: [] }, furthestSeen: null, saveFailed: false })

export interface TrackState {
  subscribe(listener: () => void): () => void
  getSnapshot(): TrackSnapshot
  /** Re-read storage; readers are notified only if something changed. */
  refresh(): void
  setStep(id: string, done: boolean, allIds: readonly string[]): boolean
  /** Raise the furthest-section mark to `sectionId` if it is further along. */
  visit(sections: readonly PlacedSection[], sectionId: string | null | undefined): void
  /** A `storage` event's key: re-read when it is one of this track's keys, or a clear (null). */
  handleStorageEvent(key: string | null): void
}

function same(a: TrackSnapshot, b: TrackSnapshot): boolean {
  return a.furthestSeen === b.furthestSeen && a.saveFailed === b.saveFailed && serializeTrackProgress(a.progress) === serializeTrackProgress(b.progress)
}

export function createTrackState(trackId: string, store: () => KeyValueStore | null): TrackState {
  const keys = [trackProgressKey(trackId), trackFurthestKey(trackId)]
  const listeners = new Set<() => void>()
  let snapshot: TrackSnapshot = EMPTY_TRACK_SNAPSHOT
  let loaded = false
  const publish = (next: TrackSnapshot) => {
    if (same(snapshot, next)) return
    snapshot = next
    for (const fn of [...listeners]) fn()
  }
  const read = (saveFailed: boolean): TrackSnapshot => ({
    progress: loadTrackProgress(store(), trackId),
    furthestSeen: loadTrackFurthest(store(), trackId),
    saveFailed,
  })
  const state: TrackState = {
    subscribe(listener) {
      listeners.add(listener)
      if (!loaded) {
        loaded = true
        publish(read(false))
      }
      return () => void listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
    // While the browser refuses writes, this page's ticks exist only in memory: re-reading storage
    // would throw them away, so the progress is kept and only the furthest mark is re-read.
    refresh: () => publish(snapshot.saveFailed ? { ...snapshot, furthestSeen: loadTrackFurthest(store(), trackId) } : read(false)),
    setStep(id, done, allIds) {
      if (snapshot.saveFailed) {
        // Codex review on PR #196: rebuilding from storage dropped every earlier unsaved tick.
        const progress = markTrackFinished(setTrackStep(snapshot.progress, id, done), allIds)
        const saved = saveTrackProgressPreserving(store(), trackId, progress)
        publish({ progress, furthestSeen: snapshot.furthestSeen, saveFailed: !saved })
        return saved
      }
      const r = commitTrackStep(store(), trackId, id, done, Date.now, allIds)
      publish({ progress: r.progress, furthestSeen: loadTrackFurthest(store(), trackId), saveFailed: !r.saved })
      return r.saved
    },
    visit(sections, sectionId) {
      const stored = loadTrackFurthest(store(), trackId)
      const next = advanceFurthest(sections, stored, sectionId)
      if (next && next !== stored) saveTrackFurthest(store(), trackId, next)
      // Shown even when the browser refused to keep it, for this visit.
      // Unsaved ticks stay as they are while the browser refuses writes (Codex, PR #196).
      const progress = snapshot.saveFailed ? snapshot.progress : loadTrackProgress(store(), trackId)
      publish({ ...snapshot, progress, furthestSeen: next ?? snapshot.furthestSeen })
    },
    handleStorageEvent(key) {
      if (key === null || keys.includes(key)) state.refresh()
    },
  }
  return state
}
