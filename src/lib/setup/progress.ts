/**
 * The learner's ticks on Sesión 0, remembered in their browser.
 *
 * Kept apart from the course's progress (`python-ds-progress`, src/lib/progress-store.ts) on
 * purpose: Sesión 0 is not one of the 52 sections, and its ticks must never change what the
 * course counts as completed (AGENTS.md: "additive media never alters completion state"). A
 * separate key means a bug here cannot touch the course record, and clearing one never clears
 * the other.
 *
 * Invalid stored state fails safe (AGENTS.md invariants): anything unreadable becomes an empty
 * record, and the bad value is left alone rather than deleted, so nothing is destroyed by a read.
 */
import { isSetupOs, type SetupOs } from './os'

export const SETUP_PROGRESS_KEY = 'pyarcana:sesion0:v1'

export interface SetupProgress {
  /** The track the learner chose with the switch; null until they choose one. */
  os: SetupOs | null
  /** Ids of the steps the learner ticked, in the order they ticked them. */
  done: string[]
}

export const EMPTY_SETUP_PROGRESS: SetupProgress = Object.freeze({ os: null, done: [] }) as SetupProgress

/** A step id is short, plain and ours: `python.win.descargar`. Anything else is not kept. */
const STEP_ID = /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/
const MAX_IDS = 500

function cleanIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const seen = new Set<string>()
  for (const id of value) {
    if (typeof id === 'string' && id.length <= 80 && STEP_ID.test(id)) seen.add(id)
    if (seen.size >= MAX_IDS) break
  }
  return [...seen]
}

/**
 * Parse what was stored. Unknown step ids are kept, not dropped: a newer page may have written
 * them, and a learner who opens an older tab must not lose ticks a newer one recorded.
 */
export function parseSetupProgress(raw: string | null | undefined): SetupProgress {
  if (!raw) return { os: null, done: [] }
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    return { os: null, done: [] }
  }
  if (!data || typeof data !== 'object' || Array.isArray(data)) return { os: null, done: [] }
  const rec = data as Record<string, unknown>
  return { os: isSetupOs(rec.os) ? rec.os : null, done: cleanIds(rec.done) }
}

export function serializeSetupProgress(p: SetupProgress): string {
  return JSON.stringify({ v: 1, os: p.os, done: cleanIds(p.done) })
}

export function isDone(p: SetupProgress, id: string): boolean {
  return p.done.includes(id)
}

/** Tick or untick one step. Returns a new record; the old one is unchanged. */
export function toggleStep(p: SetupProgress, id: string): SetupProgress {
  if (!STEP_ID.test(id)) return p
  return isDone(p, id) ? { ...p, done: p.done.filter((d) => d !== id) } : { ...p, done: [...p.done, id] }
}

export function chooseOs(p: SetupProgress, os: SetupOs): SetupProgress {
  return { ...p, os }
}

/** How many of `ids` are ticked: the counter beside each part and at the top of the page. */
export function countDone(p: SetupProgress, ids: readonly string[]): number {
  const done = new Set(p.done)
  return ids.reduce((n, id) => n + (done.has(id) ? 1 : 0), 0)
}

/** Minimal storage surface, so tests pass a Map-backed fake and the page passes localStorage. */
export interface KeyValueStore {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

/** Read the record. Storage can throw (private mode, blocked cookies): that reads as empty. */
export function loadSetupProgress(store: KeyValueStore | null | undefined): SetupProgress {
  try {
    return parseSetupProgress(store?.getItem(SETUP_PROGRESS_KEY))
  } catch {
    return { os: null, done: [] }
  }
}

/** Write the record. Returns false when the browser refused, so the page can say ticks won't stay. */
export function saveSetupProgress(store: KeyValueStore | null | undefined, p: SetupProgress): boolean {
  if (!store) return false
  try {
    store.setItem(SETUP_PROGRESS_KEY, serializeSetupProgress(p))
    return true
  } catch {
    return false
  }
}
