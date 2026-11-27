import { isTrackStepId, parseTrackProgress, trackProgressKey, trackFurthestKey, type KeyValueStore, type TrackProgress } from './progress'

export type TrackIssue = 'read' | 'format' | 'write' | 'lock'
export type TrackRead<T> = { ok: true; value: T } | { ok: false; issue: 'read' | 'format' }

function readRaw(store: KeyValueStore | null, key: string): TrackRead<string | null> {
  if (!store) return { ok: false, issue: 'read' }
  try { return { ok: true, value: store.getItem(key) } }
  catch { return { ok: false, issue: 'read' } }
}
function knownRecord(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const r = value as Record<string, unknown>
  if (r.v !== 1 || Object.keys(r).some(k => !['v','done','finished'].includes(k))) return false
  if (r.finished !== undefined && typeof r.finished !== 'boolean') return false
  return Array.isArray(r.done) && r.done.length <= 500 && r.done.every(isTrackStepId)
}
/** A backup is not permission to downgrade active data. */
export function readTrackRecord(store: KeyValueStore | null, id: string): TrackRead<TrackProgress> {
  const raw = readRaw(store, trackProgressKey(id))
  if (!raw.ok) return raw
  if (raw.value === null) return { ok: true, value: { done: [] } }
  try {
    if (!knownRecord(JSON.parse(raw.value))) return { ok: false, issue: 'format' }
    return { ok: true, value: parseTrackProgress(raw.value) }
  } catch { return { ok: false, issue: 'format' } }
}
export function readTrackPosition(store: KeyValueStore | null, id: string): TrackRead<string | null> {
  const raw = readRaw(store, trackFurthestKey(id))
  if (!raw.ok) return raw
  return raw.value === null || isTrackStepId(raw.value) ? raw : { ok: false, issue: 'format' }
}
