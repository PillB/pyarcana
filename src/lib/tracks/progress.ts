/**
 * The learner's ticks on an applied track, remembered in their browser.
 *
 * Kept apart from the course's progress (`python-ds-progress`) and from Sesión 0's
 * (`pyarcana:sesion0:v1`) on purpose: a track is not one of the 52 sections, and its ticks must
 * never change what the course counts as completed (AGENTS.md: "additive media never alters
 * completion state"). Invalid stored state fails safe: it reads as empty and is left in place, so
 * a read never destroys anything.
 */

export interface TrackProgress {
  /** Ids of the steps ticked, in the order they were ticked. */
  done: string[]
  /**
   * Set when every step was ticked, cleared when the learner unticks one. A step added to the
   * track later does not clear it, so a learner who finished stays "done" (STATE_MACHINES.md, SM3).
   */
  finished?: boolean
}

/** `pyarcana:track:<id>:v1`. One key per track, so two tracks never share ticks. */
export function trackProgressKey(trackId: string): string {
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(trackId)) {
    throw new Error(`[tracks] "${trackId}" is not a valid track id: expected lowercase words joined by "-", such as "ruta-web".`)
  }
  return `pyarcana:track:${trackId}:v1`
}

const STEP_ID = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/
const MAX_IDS = 500

export function isTrackStepId(id: unknown): id is string {
  return typeof id === 'string' && id.length <= 80 && STEP_ID.test(id)
}

function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  for (const id of value) {
    if (isTrackStepId(id)) seen.add(id)
    if (seen.size >= MAX_IDS) break
  }
  return [...seen]
}

/** Unknown step ids are kept: a newer page may have written them, and an older tab must not drop them. */
export function parseTrackProgress(raw: string | null | undefined): TrackProgress {
  if (!raw) return { done: [] }
  try {
    const data: unknown = JSON.parse(raw)
    if (!data || typeof data !== 'object' || Array.isArray(data)) return { done: [] }
    const record = data as Record<string, unknown>
    const done = cleanIds(record.done)
    return record.finished === true ? { done, finished: true } : { done }
  } catch {
    return { done: [] }
  }
}

export function serializeTrackProgress(p: TrackProgress): string {
  return JSON.stringify(p.finished ? { v: 1, done: cleanIds(p.done), finished: true } : { v: 1, done: cleanIds(p.done) })
}

export function toggleTrackStep(p: TrackProgress, id: string): TrackProgress {
  if (!isTrackStepId(id)) return p
  return setTrackStep(p, id, !p.done.includes(id))
}

/**
 * Sets one step to the state the learner asked for. An intent ("done" or "not done"), not a flip:
 * a stale tab whose checkbox shows a step unticked, clicked, means "done" even if another tab
 * already ticked it.
 */
export function setTrackStep(p: TrackProgress, id: string, done: boolean): TrackProgress {
  if (!isTrackStepId(id) || p.done.includes(id) === done) return p
  if (done) return { ...p, done: [...p.done, id] }
  return { done: p.done.filter((d) => d !== id) } // an untick clears `finished`
}

/** Marks the record finished once every current step is ticked; never unmarks (only an untick does). */
export function markTrackFinished(p: TrackProgress, allIds: readonly string[]): TrackProgress {
  if (p.finished || allIds.length === 0 || countTrackDone(p, allIds) < allIds.length) return p
  return { ...p, finished: true }
}

/** Done for the standing and the banner: every step ticked now, or finished before steps were added. */
export function isTrackComplete(p: TrackProgress, allIds: readonly string[]): boolean {
  return p.finished === true || (allIds.length > 0 && countTrackDone(p, allIds) === allIds.length)
}

export function countTrackDone(p: TrackProgress, ids: readonly string[]): number {
  const done = new Set(p.done)
  return ids.reduce((n, id) => n + (done.has(id) ? 1 : 0), 0)
}

export interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/** Storage can throw (private mode, blocked cookies): that reads as empty. */
export function loadTrackProgress(store: KeyValueStore | null | undefined, trackId: string): TrackProgress {
  try {
    return parseTrackProgress(store?.getItem(trackProgressKey(trackId)))
  } catch {
    return { done: [] }
  }
}

/** Returns false when the browser refused, so the page can say the ticks will not stay. */
export function saveTrackProgress(store: KeyValueStore | null | undefined, trackId: string, p: TrackProgress): boolean {
  if (!store) return false
  try {
    store.setItem(trackProgressKey(trackId), serializeTrackProgress(p))
    return true
  } catch {
    return false
  }
}

/** True when a stored value is not a v1 record this code wrote: unparseable, another shape, or a newer version. */
export function isForeignTrackRecord(raw: string | null | undefined): boolean {
  if (!raw) return false
  try {
    const data = JSON.parse(raw) as Record<string, unknown> | null
    return !data || typeof data !== 'object' || Array.isArray(data) || data.v !== 1 || !Array.isArray(data.done)
  } catch {
    return true
  }
}

/** Where an unreadable record is copied before the first tick overwrites it. */
export function trackBackupKey(trackId: string, stamp: number): string {
  return `${trackProgressKey(trackId)}:unreadable:${stamp}`
}

/**
 * Applies one tick to the latest stored record, not to the copy this page loaded, and saves it.
 * Two open tabs each write their own change on top of the other's, so neither erases the other
 * (the localStorage analogue of an optimistic merge; STATE_MACHINES.md, SM2). A stored value this
 * code cannot read (corrupt, or written by a newer version) is copied to a backup key first and
 * the write is refused if the copy fails, so a tick never destroys what it could not read. When the
 * browser refuses to save, the change is still returned so the page shows it, with `saved: false`.
 */
export function commitTrackStep(
  store: KeyValueStore | null | undefined,
  trackId: string,
  id: string,
  done: boolean,
  now: () => number = Date.now,
  allIds: readonly string[] = [],
): { progress: TrackProgress; saved: boolean } {
  const progress = markTrackFinished(setTrackStep(loadTrackProgress(store, trackId), id, done), allIds)
  return { progress, saved: saveTrackProgressPreserving(store, trackId, progress, now) }
}

/**
 * Saves, but first copies a stored record this code cannot read to a backup key; if that copy
 * fails, nothing is written. Every write of a tick goes through here, including retries after a
 * refused save, so no path overwrites an unreadable record without a backup (Codex, PR #196).
 */
export function saveTrackProgressPreserving(
  store: KeyValueStore | null | undefined,
  trackId: string,
  p: TrackProgress,
  now: () => number = Date.now,
): boolean {
  return backUpForeignRecord(store, trackId, now) && saveTrackProgress(store, trackId, p)
}

function backUpForeignRecord(store: KeyValueStore | null | undefined, trackId: string, now: () => number): boolean {
  if (!store) return false
  try {
    const raw = store.getItem(trackProgressKey(trackId))
    if (isForeignTrackRecord(raw)) store.setItem(trackBackupKey(trackId, now()), raw as string)
    return true
  } catch {
    return false
  }
}

/** `pyarcana:track:<id>:furthest:v1`: the furthest section opened, a slug (placement.advanceFurthest). */
export function trackFurthestKey(trackId: string): string {
  trackProgressKey(trackId) // validates the id, throwing with the reason
  return `pyarcana:track:${trackId}:furthest:v1`
}

export function loadTrackFurthest(store: KeyValueStore | null | undefined, trackId: string): string | null {
  try {
    const raw = store?.getItem(trackFurthestKey(trackId)) ?? null
    return isTrackStepId(raw) ? raw : null
  } catch {
    return null
  }
}

export function saveTrackFurthest(store: KeyValueStore | null | undefined, trackId: string, slug: string): boolean {
  if (!store || !isTrackStepId(slug)) return false
  try {
    store.setItem(trackFurthestKey(trackId), slug)
    return true
  } catch {
    return false
  }
}
