/**
 * Progress sync between this device and the signed-in account (DESIGN-v2 §8.6).
 *
 * Headless and injectable: fetch (ApiClient), storage, clock and timers come in as dependencies,
 * so every rule below is unit-tested. The React wrapper only wires page events to it.
 *
 * - Changes are recorded from store updates (diff -> change log in `pyarcana-cloud-changes-v1`),
 *   also while signed out, so an un-toggle made offline still wins later.
 * - Pull on start and when the page becomes visible; push 5 s after the last change; flush on
 *   hide/pagehide with `keepalive` when the body is <= 64 KiB (the browser's keepalive budget).
 * - 409: merge the server copy (the worker sends it as `server: {rev, doc, updatedAt}`; without it,
 *   a re-pull) and retry, at most 3 times. During a page-hide flush the re-pull keeps `keepalive`.
 * - Owner rule: no owner or the same owner -> merge; a different owner and local work -> the
 *   learner chooses. "Usar solo mi cuenta" first copies the stored `python-ds-progress` string
 *   byte-for-byte to `python-ds-progress.archive.<owner>.<ts>` (never deleted), and only then
 *   adopts the account copy through the store's setState. Nothing here writes or removes
 *   `python-ds-progress` directly.
 * - Nothing is uploaded until this device is claimed by the signed-in account: not while the first
 *   pull is in flight, and not while the owner choice is pending (flush, debounce and sign-out
 *   included). Sign-out then drops the unanswered choice.
 * - Sign-out flushes first and keeps local progress.
 * - Cost (owner request, 4 Oct 2026): no upload when the document equals the last acknowledged one;
 *   the debounce never holds a change past PUSH_MAX_WAIT_MS; focus pulls are throttled to one per
 *   PULL_THROTTLE_MS (start and "Sincronizar ahora" always pull); offline, 5xx, 429 and 503 retry
 *   with capped exponential backoff and jitter, the server's `retryAfter` (s) winning; a
 *   `syncHint.minIntervalMs` in an answer (the worker's budget saver) raises the debounce, the
 *   maximum wait and the pull throttle until an answer comes without it.
 */
import { PROGRESS_STORAGE_KEY, parsePersistedEnvelope } from '@/lib/progress-sanitize'
import type { ApiClient, ApiResult } from '@/lib/cloud/api'
import { isUnavailable } from '@/lib/cloud/api'
import { utf8 } from '@/lib/cloud/b64'
import {
  buildRemoteDoc,
  cleanIncomingState,
  diffChanges,
  hasProgress,
  loadChangeLog,
  mergeProgress,
  parseRemoteDoc,
  recordChanges,
  saveChangeLog,
  unionInto,
  type ChangeLog,
  type ProgressState,
} from '@/lib/cloud/progress-merge'
import { isPlainObject, readRaw, writeRaw, type KeyValueStorage } from '@/lib/cloud/storage'

export const ARCHIVE_PREFIX = `${PROGRESS_STORAGE_KEY}.archive.`
export const PUSH_DEBOUNCE_MS = 5000
export const PUSH_MAX_WAIT_MS = 60_000
export const PULL_THROTTLE_MS = 60_000
export const RETRY_BASE_MS = 5000
export const RETRY_MAX_MS = 300_000
export const KEEPALIVE_MAX_BYTES = 64 * 1024
export const DOC_MAX_BYTES = 256 * 1024
export const MAX_CONFLICT_RETRIES = 3
const PROGRESS_PATH = '/v1/me/progress'
const OWNER_ID = /^[A-Za-z0-9_-]{1,64}$/
const ARCHIVE_KEY = /^python-ds-progress\.archive\.([A-Za-z0-9_-]{1,64})\.(\d{1,16})$/

export interface ProgressStoreAdapter {
  getState(): ProgressState
  setState(patch: Partial<ProgressState>): void
  subscribe(listener: (next: ProgressState, prev: ProgressState) => void): () => void
}

export interface OwnerAdapter {
  get(): string | null
  set(accountId: string): void
}

export interface Scheduler {
  setTimeout(fn: () => void, ms: number): unknown
  clearTimeout(handle: unknown): void
}

export interface SyncDeps {
  api: ApiClient
  storage: KeyValueStorage | null
  store: ProgressStoreAdapter
  owner: OwnerAdapter
  now: () => number
  scheduler?: Scheduler
  /** Called with the time of every successful pull or push. */
  onSynced?: (ms: number) => void
  /** [0, 1) for retry jitter; Math.random by default. */
  random?: () => number
}

/** A failure worth retrying by itself: offline, timeout, 5xx, or the server asking to wait. */
function retryable(r: ApiResult<unknown>): boolean {
  return !r.ok && (isUnavailable(r) || r.status === 429 || r.status === 503)
}

/** The server's `retryAfter` (seconds) in a failure body, in ms; null without one. */
function retryAfterMs(r: ApiResult<unknown>): number | null {
  const v = !r.ok && r.data ? r.data.retryAfter : undefined
  return typeof v === 'number' && Number.isFinite(v) && v > 0 ? Math.min(v, 86_400) * 1000 : null
}

/** `syncHint.minIntervalMs` in a success body; 0 without one. */
function hintMs(data: Record<string, unknown>): number {
  const hint = isPlainObject(data.syncHint) ? data.syncHint.minIntervalMs : undefined
  return typeof hint === 'number' && Number.isFinite(hint) && hint > 0 ? Math.min(hint, 3_600_000) : 0
}

export type SyncStatus =
  | 'idle'
  | 'pulling'
  | 'pushing'
  | 'synced'
  | 'offline'
  | 'conflict'
  | 'too_large'
  | 'remote_unreadable'
  | 'needs_choice'
  | 'signed_out'
  | 'error'

export type OwnerAction = 'merge' | 'ask'
export type OwnerChoice = 'merge' | 'use_account'

export function decideOwnerAction(owner: string | null, accountId: string, localHasProgress: boolean): OwnerAction {
  if (!owner || owner === accountId) return 'merge'
  return localHasProgress ? 'ask' : 'merge'
}

// --- archives --------------------------------------------------------------------------------

export function archiveKey(ownerId: string, ts: number): string {
  return `${ARCHIVE_PREFIX}${OWNER_ID.test(ownerId) ? ownerId : 'unknown'}.${Math.floor(ts)}`
}

/** Copy the stored progress string exactly as it is; ok only if the copy reads back identical. */
export function archiveLocalProgress(storage: KeyValueStorage | null, ownerId: string, nowMs: number): { ok: boolean; key: string } {
  const key = archiveKey(ownerId, nowMs)
  const raw = readRaw(storage, PROGRESS_STORAGE_KEY)
  if (raw === null) return { ok: false, key }
  const ok = writeRaw(storage, key, raw) && readRaw(storage, key) === raw
  return { ok, key }
}

export interface ArchiveInfo {
  key: string
  ownerId: string
  ts: number
}

export function listArchives(storage: KeyValueStorage | null): ArchiveInfo[] {
  if (!storage) return []
  const out: ArchiveInfo[] = []
  for (const key of storage.keys()) {
    const m = ARCHIVE_KEY.exec(key)
    if (m) out.push({ key, ownerId: m[1], ts: Number(m[2]) })
  }
  return out.sort((a, b) => b.ts - a.ts)
}

// --- helpers ---------------------------------------------------------------------------------

interface RemoteCopy {
  rev: number
  doc: unknown
}

function readRemoteCopy(data: Record<string, unknown> | null): RemoteCopy | null {
  if (!data || typeof data.rev !== 'number' || !Number.isInteger(data.rev) || data.rev < 0) return null
  return { rev: data.rev, doc: 'doc' in data ? data.doc ?? null : null }
}

/** The winner's copy in the worker's 409 body `{reason:'conflict', server:{rev, doc, updatedAt}}`. */
function conflictCopy(data: Record<string, unknown> | null): RemoteCopy | null {
  const server = data?.server
  return isPlainObject(server) && 'doc' in server ? readRemoteCopy(server) : null
}

function stableStringify(value: unknown): string {
  if (Array.isArray(value)) return `[${value.map(stableStringify).sort().join(',')}]`
  if (isPlainObject(value)) {
    return `{${Object.keys(value).sort().map((k) => `${JSON.stringify(k)}:${stableStringify(value[k])}`).join(',')}}`
  }
  return JSON.stringify(value) ?? 'null'
}

const EMPTY: ProgressState = {
  completedSections: [],
  completedSubSteps: {},
  quizScores: {},
  lastVisited: null,
  bookmarks: [],
  startDate: null,
  isHydratedFromServer: false,
}

function fullState(partial: Partial<ProgressState>, isHydratedFromServer: boolean): ProgressState {
  return {
    completedSections: partial.completedSections ?? [],
    completedSubSteps: partial.completedSubSteps ?? {},
    quizScores: partial.quizScores ?? {},
    lastVisited: partial.lastVisited ?? null,
    bookmarks: partial.bookmarks ?? [],
    startDate: partial.startDate ?? null,
    isHydratedFromServer,
  }
}

function byteLength(text: string): number {
  return utf8(text).length
}

function realScheduler(): Scheduler {
  return {
    setTimeout: (fn, ms) => globalThis.setTimeout(fn, ms),
    clearTimeout: (h) => globalThis.clearTimeout(h as ReturnType<typeof setTimeout>),
  }
}

// --- the sync --------------------------------------------------------------------------------

export class ProgressSync {
  status: SyncStatus = 'idle'
  lastError: string | null = null
  private readonly deps: SyncDeps & { scheduler: Scheduler }
  private accountId: string | null = null
  private baseRev = 0
  private changes: ChangeLog
  private applying = false
  private changeSeq = 0
  private syncedSeq = 0
  private timer: unknown = null
  private unsubscribe: (() => void) | null = null
  private pending: RemoteCopy | null = null
  private chain: Promise<unknown> = Promise.resolve()
  private readonly listeners = new Set<(s: SyncStatus) => void>()
  /** JSON of the document the server last acknowledged (or that a pull showed it already holds). */
  private ackedJson: string | null = null
  /** When the oldest unsent change happened; bounds the debounce. */
  private dirtySince: number | null = null
  private lastSyncMs = 0
  private retries = 0
  private notBefore = 0
  private minIntervalMs = 0

  constructor(deps: SyncDeps) {
    this.deps = { ...deps, scheduler: deps.scheduler ?? realScheduler() }
    this.changes = loadChangeLog(deps.storage, deps.now())
    this.changeSeq = hasProgress(deps.store.getState()) ? 1 : 0
  }

  onStatus(listener: (s: SyncStatus) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /** Start recording local changes (also while signed out). Idempotent. */
  attach(): void {
    if (this.unsubscribe) return
    this.unsubscribe = this.deps.store.subscribe((next, prev) => this.onStoreChange(next, prev))
  }

  detach(): void {
    this.unsubscribe?.()
    this.unsubscribe = null
    this.cancelTimer()
  }

  start(accountId: string): Promise<SyncStatus> {
    this.attach()
    this.accountId = accountId
    return this.enqueue(() => this.pullNow())
  }

  /**
   * Pull again (page became visible). No-op when signed out, and while the owner choice is pending:
   * the learner may have closed that dialog with "Decidir después", and a re-pull would pass
   * through 'pulling' back to 'needs_choice' and reopen it on every tab switch. The pending remote
   * copy stays; the answer merges it, and a stale copy is corrected by the 409 path on upload.
   */
  pull(force = false): Promise<SyncStatus> {
    if (!this.accountId || this.pending) return Promise.resolve(this.status)
    const throttle = Math.max(PULL_THROTTLE_MS, this.minIntervalMs)
    if (!force && this.lastSyncMs > 0 && this.deps.now() - this.lastSyncMs < throttle) return Promise.resolve(this.status)
    return this.enqueue(() => this.pullNow())
  }

  resolveOwnerChoice(choice: OwnerChoice): Promise<SyncStatus> {
    const remote = this.pending
    if (!remote || !this.accountId) return Promise.resolve(this.status)
    this.pending = null
    return this.enqueue(() => (choice === 'merge' ? this.mergeRemote(remote) : this.useAccountOnly(remote)))
  }

  pushNow(): Promise<SyncStatus> {
    this.cancelTimer()
    return this.enqueue(() => this.push(false))
  }

  /** Page hidden or unloading: send now with keepalive, without waiting behind queued work. */
  flush(): Promise<SyncStatus> {
    this.cancelTimer()
    return this.push(true)
  }

  /** Sign-out flushes first; with an owner choice outstanding it uploads nothing and drops the choice. */
  async signOut(): Promise<void> {
    this.cancelTimer()
    await this.enqueue(() => this.push(false))
    this.accountId = null
    this.baseRev = 0
    this.pending = null
    this.setStatus('signed_out')
  }

  /** Merge an archived copy back in (additive), record it, and queue an upload. */
  restoreArchive(key: string): { ok: boolean; added: number } {
    const parsed = ARCHIVE_KEY.test(key) ? parsePersistedEnvelope(readRaw(this.deps.storage, key)) : null
    if (!parsed || !parsed.ok || parsed.reason === 'empty') return { ok: false, added: 0 }
    const incoming = cleanIncomingState(parsed.state, parsed.version)
    const r = unionInto(this.deps.store.getState(), this.changes, incoming, this.deps.now())
    this.apply(r.state, r.changes)
    this.markDirty()
    return { ok: true, added: r.added }
  }

  // --- internals -----------------------------------------------------------------------------

  private setStatus(status: SyncStatus): SyncStatus {
    this.status = status
    for (const l of this.listeners) l(status)
    return status
  }

  private enqueue<T>(job: () => Promise<T>): Promise<T> {
    const run = this.chain.then(job, job)
    this.chain = run.catch(() => undefined)
    return run
  }

  private cancelTimer(): void {
    if (this.timer === null) return
    this.deps.scheduler.clearTimeout(this.timer)
    this.timer = null
  }

  /** Debounce, bounded by the maximum wait since the oldest unsent change, never before notBefore. */
  private pushDelay(): number {
    const now = this.deps.now()
    let delay = Math.max(PUSH_DEBOUNCE_MS, this.minIntervalMs)
    if (this.dirtySince !== null) {
      const maxWait = Math.max(PUSH_MAX_WAIT_MS, this.minIntervalMs)
      delay = Math.min(delay, Math.max(0, this.dirtySince + maxWait - now))
    }
    return Math.max(delay, this.notBefore - now)
  }

  private schedulePush(): void {
    this.cancelTimer()
    this.timer = this.deps.scheduler.setTimeout(() => {
      this.timer = null
      void this.enqueue(() => this.push(false))
    }, this.pushDelay())
  }

  private markDirty(): void {
    this.changeSeq += 1
    if (this.dirtySince === null) this.dirtySince = this.deps.now()
    if (this.canPush()) this.schedulePush()
  }

  /** Offline, 5xx, 429 or 503: wait (server's retryAfter, else capped backoff with jitter) and retry. */
  private scheduleRetry(r: ApiResult<unknown>): void {
    const backoff = Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** this.retries)
    const jitter = 0.8 + 0.4 * (this.deps.random ?? Math.random)()
    this.retries += 1
    this.notBefore = this.deps.now() + (retryAfterMs(r) ?? Math.round(backoff * jitter))
    if (this.canPush() && this.changeSeq !== this.syncedSeq) this.schedulePush()
  }

  /**
   * Uploads need a signed-in account that has claimed this device (owner === account). Until the
   * first pull applies the owner rule, and while the learner has not answered the owner choice,
   * the local copy may be another account's progress, so nothing is sent (DESIGN-v2 §8.6).
   */
  private canPush(): boolean {
    return this.accountId !== null && this.pending === null && this.deps.owner.get() === this.accountId
  }

  private onStoreChange(next: ProgressState, prev: ProgressState): void {
    if (this.applying) return
    const diff = diffChanges(prev, next, this.deps.now())
    const itemsChanged = Object.keys(diff).length > 0
    if (itemsChanged) {
      this.changes = recordChanges(this.changes, diff)
      saveChangeLog(this.deps.storage, this.changes)
    }
    if (itemsChanged || next.quizScores !== prev.quizScores || next.startDate !== prev.startDate) this.markDirty()
  }

  private apply(state: ProgressState, changes: ChangeLog): void {
    this.applying = true
    try {
      this.deps.store.setState(state)
    } finally {
      this.applying = false
    }
    this.changes = changes
    saveChangeLog(this.deps.storage, changes)
  }

  private synced(): SyncStatus {
    this.lastError = null
    this.lastSyncMs = this.deps.now()
    this.retries = 0
    this.notBefore = 0
    this.deps.onSynced?.(this.deps.now())
    return this.setStatus('synced')
  }

  private failed(result: ApiResult<unknown>): SyncStatus {
    this.lastError = result.ok ? null : result.reason
    if (retryable(result)) this.scheduleRetry(result)
    if (isUnavailable(result)) return this.setStatus('offline')
    return this.setStatus(result.status === 401 ? 'signed_out' : 'error')
  }

  private async pullNow(): Promise<SyncStatus> {
    this.setStatus('pulling')
    const r = await this.deps.api.get(PROGRESS_PATH)
    const remote = r.ok ? readRemoteCopy(r.data) : null
    if (!remote) return r.ok ? this.setStatus('remote_unreadable') : this.failed(r)
    const local = this.deps.store.getState()
    if (decideOwnerAction(this.deps.owner.get(), this.accountId!, hasProgress(local)) === 'ask') {
      this.pending = remote
      return this.setStatus('needs_choice')
    }
    return this.mergeRemote(remote)
  }

  private differsFromRemote(state: ProgressState, changes: ChangeLog, remoteDoc: unknown): boolean {
    const remote = mergeProgress(EMPTY, {}, remoteDoc, this.deps.now())
    return stableStringify(buildRemoteDoc(state, changes)) !== stableStringify(buildRemoteDoc(remote.state, remote.changes))
  }

  private async mergeRemote(remote: RemoteCopy): Promise<SyncStatus> {
    const now = this.deps.now()
    if (remote.doc !== null && !parseRemoteDoc(remote.doc, now)) return this.setStatus('remote_unreadable')
    const merged = mergeProgress(this.deps.store.getState(), this.changes, remote.doc, now)
    this.apply(merged.state, merged.changes)
    this.deps.owner.set(this.accountId!)
    this.baseRev = remote.rev
    if (!this.differsFromRemote(merged.state, merged.changes, remote.doc)) {
      this.syncedSeq = this.changeSeq
      this.ackedJson = JSON.stringify(buildRemoteDoc(merged.state, merged.changes))
      this.dirtySince = null
      return this.synced()
    }
    this.changeSeq += 1
    return this.push(false)
  }

  private async useAccountOnly(remote: RemoteCopy): Promise<SyncStatus> {
    const now = this.deps.now()
    const parsed = remote.doc === null ? { state: {}, changes: {} } : parseRemoteDoc(remote.doc, now)
    if (!parsed) return this.setStatus('remote_unreadable')
    const archived = archiveLocalProgress(this.deps.storage, this.deps.owner.get() ?? 'unknown', now)
    if (!archived.ok) {
      this.lastError = 'archive_failed'
      return this.setStatus('error')
    }
    this.apply(fullState(parsed.state, this.deps.store.getState().isHydratedFromServer), parsed.changes)
    this.deps.owner.set(this.accountId!)
    this.baseRev = remote.rev
    this.syncedSeq = this.changeSeq
    return this.synced()
  }

  private body(): { doc: ReturnType<typeof buildRemoteDoc>; baseRev: number } {
    return { doc: buildRemoteDoc(this.deps.store.getState(), this.changes), baseRev: this.baseRev }
  }

  private async push(keepalive: boolean): Promise<SyncStatus> {
    if (!this.canPush() || this.changeSeq === this.syncedSeq) return this.status
    if (this.unchangedSinceAck()) return this.synced()
    this.setStatus('pushing')
    for (let attempt = 0; attempt <= MAX_CONFLICT_RETRIES; attempt++) {
      const seq = this.changeSeq
      const body = this.body()
      const size = byteLength(JSON.stringify(body))
      if (size > DOC_MAX_BYTES) return this.setStatus('too_large')
      const r = await this.deps.api.put(PROGRESS_PATH, body, { keepalive: keepalive && size <= KEEPALIVE_MAX_BYTES })
      if (r.ok) return this.pushed(r.data, seq, JSON.stringify(body.doc))
      if (r.status !== 409) return this.failed(r)
      const absorbed = await this.absorbConflict(r.data, keepalive)
      if (absorbed !== null) return this.setStatus(absorbed)
    }
    return this.setStatus('conflict')
  }

  /** Nothing to send: the document equals what the server already holds. Marks it synced. */
  private unchangedSinceAck(): boolean {
    if (this.ackedJson === null || JSON.stringify(this.body().doc) !== this.ackedJson) return false
    this.syncedSeq = this.changeSeq
    this.dirtySince = null
    return true
  }

  private pushed(data: Record<string, unknown>, seq: number, sentJson: string): SyncStatus {
    if (typeof data.rev === 'number' && Number.isInteger(data.rev)) this.baseRev = data.rev
    this.minIntervalMs = hintMs(data)
    this.ackedJson = sentJson
    if (this.changeSeq === seq) this.dirtySince = null
    this.syncedSeq = seq
    if (this.changeSeq !== seq) this.schedulePush()
    return this.synced()
  }

  /** Take the server copy from the 409 body (or re-pull it) and merge; null when ready to retry. */
  private async absorbConflict(data: Record<string, unknown> | null, keepalive: boolean): Promise<SyncStatus | null> {
    let remote = conflictCopy(data)
    if (!remote) {
      const r = await this.deps.api.get(PROGRESS_PATH, { keepalive })
      remote = r.ok ? readRemoteCopy(r.data) : null
      if (!remote) return r.ok ? 'remote_unreadable' : this.failed(r)
    }
    const now = this.deps.now()
    if (remote.doc !== null && !parseRemoteDoc(remote.doc, now)) return 'remote_unreadable'
    const merged = mergeProgress(this.deps.store.getState(), this.changes, remote.doc, now)
    this.apply(merged.state, merged.changes)
    this.baseRev = remote.rev
    return null
  }
}
