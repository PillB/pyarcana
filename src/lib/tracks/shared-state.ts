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
  /**
   * Ticks the browser refused to save, as intents (step id -> done), in click order. They are
   * re-applied to the latest stored record on every read and retried on the next tick, so a refused
   * save neither loses this page's ticks nor, once storage works again, erases what another tab
   * saved meanwhile: the outbox pattern, with storage as the destination (STATE_MACHINES.md SM2).
   */
  const pending = new Map<string, boolean>()
  let allIds: readonly string[] = []
  const publish = (next: TrackSnapshot) => {
    if (same(snapshot, next)) return
    snapshot = next
    for (const fn of [...listeners]) fn()
  }
  /** The latest stored record with this page's unsaved intents applied on top. */
  const current = (): TrackProgress => {
    let p = loadTrackProgress(store(), trackId)
    for (const [id, done] of pending) p = setTrackStep(p, id, done)
    return pending.size > 0 ? markTrackFinished(p, allIds) : p
  }
  const read = (): TrackSnapshot => ({
    progress: current(),
    furthestSeen: loadTrackFurthest(store(), trackId),
    saveFailed: pending.size > 0,
  })
  const state: TrackState = {
    subscribe(listener) {
      listeners.add(listener)
      if (!loaded) {
        loaded = true
        publish(read())
      }
      return () => void listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
    refresh: () => publish(read()),
    setStep(id, done, ids) {
      allIds = ids
      pending.delete(id) // re-inserted last, so the click order is kept
      pending.set(id, done)
      const progress = current()
      const saved = saveTrackProgressPreserving(store(), trackId, progress)
      if (saved) pending.clear()
      publish({ progress, furthestSeen: loadTrackFurthest(store(), trackId), saveFailed: !saved })
      return saved
    },
    visit(sections, sectionId) {
      const stored = loadTrackFurthest(store(), trackId)
      const next = advanceFurthest(sections, stored, sectionId)
      if (next && next !== stored) saveTrackFurthest(store(), trackId, next)
      // The mark is shown even when the browser refused to keep it, for this visit.
      publish({ ...snapshot, progress: current(), furthestSeen: next ?? snapshot.furthestSeen })
    },
    handleStorageEvent(key) {
      if (key === null || keys.includes(key)) state.refresh()
    },
  }
  return state
}
