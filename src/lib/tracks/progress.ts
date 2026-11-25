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
    return { done: cleanIds((data as Record<string, unknown>).done) }
  } catch {
    return { done: [] }
  }
}

export function serializeTrackProgress(p: TrackProgress): string {
  return JSON.stringify({ v: 1, done: cleanIds(p.done) })
}

export function toggleTrackStep(p: TrackProgress, id: string): TrackProgress {
  if (!isTrackStepId(id)) return p
  return p.done.includes(id) ? { done: p.done.filter((d) => d !== id) } : { done: [...p.done, id] }
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
