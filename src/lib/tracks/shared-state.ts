/** Document-lifetime shared state. The browser stages intents and flushes under a native lock.
 * Synchronous wrappers remain for isolated callers; legacy backup migration is not a UI write.
 */
import { advanceFurthest, type PlacedSection } from './placement'
import { markTrackFinished, saveTrackProgress, setTrackStep, saveTrackFurthest,
  trackFurthestKey, trackProgressKey, isTrackStepId, type KeyValueStore, type TrackProgress } from './progress'
import { readTrackPosition, readTrackRecord, type TrackIssue } from './storage-admission'

export interface TrackSnapshot {
  progress: TrackProgress
  furthestSeen: string | null
  saveFailed: boolean
  issue: TrackIssue | null
  pendingCount: number
}
export const EMPTY_TRACK_SNAPSHOT: TrackSnapshot = Object.freeze({ progress: { done: [] }, furthestSeen: null, saveFailed: false, issue: null, pendingCount: 0 })

export interface TrackState {
  subscribe(listener: () => void): () => void
  getSnapshot(): TrackSnapshot
  refresh(): void
  stageStep(id: string, done: boolean, allIds: readonly string[]): void
  stageVisit(sections: readonly PlacedSection[], sectionId: string | null | undefined): void
  retry(): boolean
  refuseLock(): void
  setStep(id: string, done: boolean, allIds: readonly string[]): boolean
  visit(sections: readonly PlacedSection[], sectionId: string | null | undefined): void
  handleStorageEvent(key: string | null): void
}
function same(a: TrackSnapshot, b: TrackSnapshot): boolean {
  return a.furthestSeen === b.furthestSeen && a.issue === b.issue && a.pendingCount === b.pendingCount
    && a.progress.finished === b.progress.finished && a.progress.done.join('|') === b.progress.done.join('|')
}
function mergeSteps(base: TrackProgress, pending: Map<string, boolean>, allIds: readonly string[]): TrackProgress {
  let p = base
  for (const [id, done] of pending) p = setTrackStep(p, id, done)
  return pending.size ? markTrackFinished(p, allIds) : p
}

export function createTrackState(trackId: string, store: () => KeyValueStore | null): TrackState {
  const keys = [trackProgressKey(trackId), trackFurthestKey(trackId)]
  const listeners = new Set<() => void>()
  let snapshot = EMPTY_TRACK_SNAPSHOT
  let loaded = false
  const pending = new Map<string, boolean>()
  let allIds: readonly string[] = []
  let sections: readonly PlacedSection[] = []
  let pendingVisit: string | null = null
  let lastGood: TrackProgress = { done: [] }
  let lastPosition: string | null = null
  let progressIssue: TrackIssue | null = null
  let positionIssue: TrackIssue | null = null
  let lockIssue: TrackIssue | null = null
  const current = () => mergeSteps(lastGood, pending, allIds)
  const position = () => advanceFurthest(sections, lastPosition, pendingVisit)
  const publish = () => {
    const issue = progressIssue ?? positionIssue ?? lockIssue
    const next = { progress: current(), furthestSeen: position(), issue, saveFailed: issue !== null,
      pendingCount: pending.size + Number(pendingVisit !== null) }
    if (same(snapshot, next)) return
    snapshot = next
    for (const fn of [...listeners]) fn()
  }
  const readProgress = (kv: KeyValueStore | null) => {
    const result = readTrackRecord(kv, trackId)
    if (!result.ok) { progressIssue = result.issue; return false }
    lastGood = result.value
    if (!pending.size) progressIssue = null
    return true
  }
  const readPosition = (kv: KeyValueStore | null) => {
    const result = readTrackPosition(kv, trackId)
    if (!result.ok) { positionIssue = result.issue; return false }
    lastPosition = result.value
    if (!pendingVisit) positionIssue = null
    return true
  }
  const refresh = () => { const kv = store(); readProgress(kv); readPosition(kv); publish() }
  const queueStep = (id: string, done: boolean, ids: readonly string[]) => {
    if (!isTrackStepId(id)) return
    allIds = ids
    pending.delete(id)
    pending.set(id, done)
  }
  const queueVisit = (nextSections: readonly PlacedSection[], id: string | null | undefined) => {
    sections = nextSections
    pendingVisit = advanceFurthest(sections, pendingVisit, id)
  }
  const flushProgress = (kv: KeyValueStore | null) => {
    if (!readProgress(kv) || !pending.size) return
    const next = current()
    if (next.done.length > 500) { progressIssue = 'format'; return }
    if (!saveTrackProgress(kv, trackId, next)) { progressIssue = 'write'; return }
    lastGood = next
    pending.clear()
    progressIssue = null
  }
  const flushPosition = (kv: KeyValueStore | null) => {
    if (!readPosition(kv) || !pendingVisit) return
    const next = position()
    if (next && next !== lastPosition && !saveTrackFurthest(kv, trackId, next)) { positionIssue = 'write'; return }
    lastPosition = next
    pendingVisit = null
    positionIssue = null
  }
  const retry = () => {
    const kv = store()
    lockIssue = null
    flushProgress(kv)
    flushPosition(kv)
    publish()
    return !snapshot.saveFailed
  }
  const state: TrackState = {
    subscribe(listener) {
      listeners.add(listener)
      if (!loaded) { loaded = true; refresh() }
      return () => void listeners.delete(listener)
    },
    getSnapshot: () => snapshot,
    refresh,
    stageStep(id, done, ids) { queueStep(id, done, ids); refresh() },
    stageVisit(nextSections, id) { queueVisit(nextSections, id); refresh() },
    retry,
    refuseLock() { if (pending.size || pendingVisit) lockIssue = 'lock'; publish() },
    setStep(id, done, ids) { queueStep(id, done, ids); return retry() },
    visit(nextSections, id) { queueVisit(nextSections, id); retry() },
    handleStorageEvent(key) { if (key === null || keys.includes(key)) refresh() },
  }
  return state
}
export type TrackLock = (work: () => void) => Promise<unknown>
export async function flushTrack(state: TrackState, lock?: TrackLock): Promise<void> {
  if (!lock) { state.retry(); return }
  try { await lock(() => { state.retry() }) }
  catch { state.refuseLock() }
}
