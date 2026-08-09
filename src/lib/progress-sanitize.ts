/**
 * Pure sanitization and merge helpers for learner progress.
 * Used by the Zustand progress store and unit/property tests.
 *
 * Invariants:
 * - Invalid fields are dropped (fail safe), not invented.
 * - Merge never decreases completed work when combining local + server.
 * - Additive unknown fields on the wire are ignored, not fatal.
 */

export const PROGRESS_STORAGE_KEY = 'python-ds-progress'

export const PROGRESS_FIELDS = [
  'completedSections',
  'completedSubSteps',
  'quizScores',
  'lastVisited',
  'bookmarks',
  'startDate',
  'isHydratedFromServer',
] as const

export type ProgressField = (typeof PROGRESS_FIELDS)[number]

export interface SanitizedProgressState {
  completedSections: string[]
  completedSubSteps: Record<string, string[]>
  quizScores: Record<string, number>
  lastVisited: string | null
  bookmarks: string[]
  startDate: string | null
  isHydratedFromServer: boolean
}

export const EMPTY_PROGRESS: SanitizedProgressState = {
  completedSections: [],
  completedSubSteps: {},
  quizScores: {},
  lastVisited: null,
  bookmarks: [],
  startDate: null,
  isHydratedFromServer: false,
}

export function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

export function isStringRecord(v: unknown): v is Record<string, string[]> {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    Object.entries(v).every(([k, val]) => typeof k === 'string' && isStringArray(val))
  )
}

export function isNumberRecord(v: unknown): v is Record<string, number> {
  return (
    typeof v === 'object' &&
    v !== null &&
    !Array.isArray(v) &&
    Object.entries(v).every(
      ([k, val]) => typeof k === 'string' && typeof val === 'number' && !Number.isNaN(val)
    )
  )
}

/**
 * Coerce untrusted persisted JSON into a partial safe shape.
 * Does not invent domain values for missing fields.
 */
export function sanitizePersisted(raw: unknown): Partial<SanitizedProgressState> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    return {}
  }
  const obj = raw as Record<string, unknown>
  const out: Partial<SanitizedProgressState> = {}
  if (isStringArray(obj.completedSections)) out.completedSections = obj.completedSections
  if (isStringRecord(obj.completedSubSteps)) out.completedSubSteps = obj.completedSubSteps
  if (isNumberRecord(obj.quizScores)) out.quizScores = obj.quizScores
  if (typeof obj.lastVisited === 'string' || obj.lastVisited === null) {
    out.lastVisited = obj.lastVisited as string | null
  }
  if (isStringArray(obj.bookmarks)) out.bookmarks = obj.bookmarks
  if (typeof obj.startDate === 'string' || obj.startDate === null) {
    out.startDate = obj.startDate as string | null
  }
  if (typeof obj.isHydratedFromServer === 'boolean') {
    out.isHydratedFromServer = obj.isHydratedFromServer
  }
  return out
}

export function parsePersistedEnvelope(raw: string | null): {
  state: Partial<SanitizedProgressState>
  version: number
  ok: boolean
  reason?: string
} {
  if (raw == null || raw === '') {
    return { state: {}, version: 0, ok: true, reason: 'empty' }
  }
  try {
    const parsed = JSON.parse(raw) as unknown
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
      return { state: {}, version: 0, ok: false, reason: 'envelope-not-object' }
    }
    const env = parsed as Record<string, unknown>
    const version = typeof env.version === 'number' && !Number.isNaN(env.version) ? env.version : 0
    const state = sanitizePersisted(env.state)
    return { state, version, ok: true }
  } catch {
    return { state: {}, version: 0, ok: false, reason: 'json-parse-failed' }
  }
}

function uniqueStrings(values: string[]): string[] {
  return [...new Set(values)]
}

function mergeStepMaps(
  a: Record<string, string[]>,
  b: Record<string, string[]>
): Record<string, string[]> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const out: Record<string, string[]> = {}
  for (const key of keys) {
    out[key] = uniqueStrings([...(a[key] || []), ...(b[key] || [])])
  }
  return out
}

function mergeQuizScores(
  a: Record<string, number>,
  b: Record<string, number>
): Record<string, number> {
  const keys = new Set([...Object.keys(a), ...Object.keys(b)])
  const out: Record<string, number> = {}
  for (const key of keys) {
    const av = a[key]
    const bv = b[key]
    if (typeof av === 'number' && typeof bv === 'number') out[key] = Math.max(av, bv)
    else if (typeof av === 'number') out[key] = av
    else if (typeof bv === 'number') out[key] = bv
  }
  return out
}

/**
 * Merge server progress into local progress without losing completed work.
 * Server empty maps must not wipe local sub-steps or bookmarks.
 */
export function mergeServerProgress(
  local: Pick<
    SanitizedProgressState,
    'completedSubSteps' | 'bookmarks' | 'completedSections' | 'quizScores'
  >,
  server: {
    progress?: Record<string, string[]> | null
    bookmarks?: string[] | null
  }
): Pick<
  SanitizedProgressState,
  'completedSubSteps' | 'bookmarks' | 'completedSections' | 'quizScores' | 'isHydratedFromServer'
> {
  const serverSteps = isStringRecord(server.progress) ? server.progress : {}
  const serverBookmarks = isStringArray(server.bookmarks) ? server.bookmarks : []

  return {
    completedSubSteps: mergeStepMaps(local.completedSubSteps || {}, serverSteps),
    bookmarks: uniqueStrings([...(local.bookmarks || []), ...serverBookmarks]),
    // Server API currently does not return completedSections/quizScores;
    // preserve local values so hydrate never clears them.
    completedSections: uniqueStrings([...(local.completedSections || [])]),
    quizScores: { ...(local.quizScores || {}) },
    isHydratedFromServer: true,
  }
}

/**
 * Idempotent identity migration placeholder: re-running must not drop fields.
 * Future schema bumps add cases while preserving completed work.
 */
export function migrateProgressState(
  state: Partial<SanitizedProgressState>,
  fromVersion: number,
  toVersion: number
): { state: Partial<SanitizedProgressState>; version: number } {
  let current = { ...state }
  let version = fromVersion
  while (version < toVersion) {
    // v0 → v1: no structural change; ensure arrays/objects stay present when known.
    if (version === 0) {
      current = {
        ...current,
        completedSections: isStringArray(current.completedSections)
          ? current.completedSections
          : current.completedSections,
        bookmarks: isStringArray(current.bookmarks) ? current.bookmarks : current.bookmarks,
      }
    }
    version += 1
  }
  return { state: current, version }
}

export function serializeProgressEnvelope(
  state: Partial<SanitizedProgressState>,
  version = 0
): string {
  return JSON.stringify({ state, version })
}

export function roundTripProgress(
  state: Partial<SanitizedProgressState>,
  version = 0
): Partial<SanitizedProgressState> {
  const raw = serializeProgressEnvelope(state, version)
  return parsePersistedEnvelope(raw).state
}
