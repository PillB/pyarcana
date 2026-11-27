import { chooseOs, EMPTY_SETUP_PROGRESS, parseSetupProgress, saveSetupProgress, SETUP_PROGRESS_KEY, toggleStep, isDone, type KeyValueStore, type SetupProgress } from './progress'
import type { SetupOs } from './os'
import { isSetupOs } from './os'

export type SetupIntent = { type: 'os'; os: SetupOs } | { type: 'step'; id: string; done: boolean }
export type SetupIssue = 'read' | 'format' | 'write' | 'lock'
export interface SetupSnapshot {
  progress: SetupProgress
  saveFailed: boolean
  issue: SetupIssue | null
  pendingCount: number
}
export const EMPTY_SETUP_SNAPSHOT: SetupSnapshot = { progress: EMPTY_SETUP_PROGRESS, saveFailed: false, issue: null, pendingCount: 0 }

export function applySetupIntent(progress: SetupProgress, intent: SetupIntent): SetupProgress {
  if (intent.type === 'os') return chooseOs(progress, intent.os)
  return isDone(progress, intent.id) === intent.done ? progress : toggleStep(progress, intent.id)
}

type ReadResult = { ok: true; progress: SetupProgress } | { ok: false; issue: 'read' | 'format' }

/** Read and write permission are different. Never replace an inaccessible or newer record. */
function readRecord(store: KeyValueStore | null): ReadResult {
  if (!store) return { ok: false, issue: 'read' }
  let raw: string | null
  try { raw = store.getItem(SETUP_PROGRESS_KEY) }
  catch { return { ok: false, issue: 'read' } }
  if (raw === null) return { ok: true, progress: EMPTY_SETUP_PROGRESS }
  try {
    const value: unknown = JSON.parse(raw)
    if (!writableRecord(value)) return { ok: false, issue: 'format' }
    return { ok: true, progress: parseSetupProgress(raw) }
  } catch { return { ok: false, issue: 'format' } }
}

function writableRecord(value: unknown): boolean {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const record = value as Record<string, unknown>
  if (record.v !== undefined && record.v !== 1) return false
  if (Object.keys(record).some(key => !['v', 'os', 'done'].includes(key))) return false
  if (record.os !== null && !isSetupOs(record.os)) return false
  if (!Array.isArray(record.done) || record.done.length > 500) return false
  return record.done.every(id => typeof id === 'string' && id.length <= 80 && /^[a-z0-9]+(?:[.-][a-z0-9]+)*$/.test(id))
}

function sameTarget(a: SetupIntent, b: SetupIntent): boolean {
  if (a.type === 'os') return b.type === 'os'
  return b.type === 'step' && a.id === b.id
}

function sameSnapshot(a: SetupSnapshot, b: SetupSnapshot): boolean {
  return a.issue === b.issue && a.pendingCount === b.pendingCount
    && a.progress.os === b.progress.os
    && a.progress.done.join('|') === b.progress.done.join('|')
}

/** Browser-document lifetime. Read errors retain the last known good state, pending intents are
 * reapplied over a newly read record, and no refused read or incompatible format is overwritten.
 */
export function createSetupState(storage: () => KeyValueStore | null) {
  let pending: SetupIntent[] = []
  let lastGood = EMPTY_SETUP_PROGRESS
  let issue: SetupIssue | null = null
  let view = EMPTY_SETUP_SNAPSHOT
  const listeners = new Set<() => void>()
  const current = () => pending.reduce(applySetupIntent, lastGood)
  const publish = () => {
    const next: SetupSnapshot = { progress: current(), saveFailed: issue !== null, issue, pendingCount: pending.length }
    if (!sameSnapshot(view, next)) {
      view = next
      for (const fn of [...listeners]) fn()
    }
    return view
  }
  const read = (store: KeyValueStore | null) => {
    const result = readRecord(store)
    if (result.ok) {
      lastGood = result.progress
      if (issue === 'read' || issue === 'format') issue = null
    } else issue = result.issue
    return result.ok
  }
  const snapshot = () => { read(storage()); return publish() }
  const stage = (intent: SetupIntent) => {
    pending = pending.filter(old => !sameTarget(old, intent))
    pending.push(intent)
    return snapshot()
  }
  const retry = () => {
    const store = storage()
    if (!read(store)) return publish()
    if (!pending.length) { issue = null; return publish() }
    const progress = current()
    // Serialization has a 500-ID safety cap; never silently drop an acknowledged intent.
    if (progress.done.length > 500 || progress.done.some(id => id.length > 80)) {
      issue = 'format'
      return publish()
    }
    if (!saveSetupProgress(store, progress)) { issue = 'write'; return publish() }
    lastGood = progress
    pending = []
    issue = null
    return publish()
  }
  const refuseLock = () => { issue = 'lock'; return publish() }
  return {
    snapshot, stage, retry, refuseLock,
    getSnapshot: () => view,
    subscribe: (fn: () => void) => { listeners.add(fn); return () => { listeners.delete(fn) } },
    apply: (intent: SetupIntent) => { stage(intent); return retry() },
  }
}

type SetupState = ReturnType<typeof createSetupState>
export type SetupLock = (work: () => void) => Promise<unknown>

/** A supported lock that rejects is not permission to bypass it. Older browsers without Web
 * Locks use the existing best-effort sequential rebase; truly concurrent old clients remain a risk.
 */
export async function flushSetup(state: SetupState, lock?: SetupLock): Promise<void> {
  if (!lock) { state.retry(); return }
  try { await lock(() => { state.retry() }) }
  catch { state.refuseLock() }
}
