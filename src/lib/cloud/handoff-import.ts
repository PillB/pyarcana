/**
 * The #import= handoff as ONE step per page load, shared by the moved banner and the grandfather
 * snapshot (DESIGN-v2 §8.4 and §8.7).
 *
 * On the canonical origin the handoff is how learners from the old origin bring their progress.
 * The grandfather snapshot is taken on the first load where the gate is active, and it must see
 * that imported progress, or a section finished before the gate existed would lock on arrival.
 * React runs <CloudSync/>'s effect before <MovedBanner/>'s, so ordering the two components cannot
 * be relied on. Instead, whichever caller runs first applies the import, and the snapshot path
 * always applies it before snapshotting. Later callers get the same outcome; nothing merges twice.
 *
 * Trade-off, stated: a snapshot already taken on an EARLIER gated load is not widened by a later
 * import. Grandfathering stays a first-load rule, as the design says.
 */
import { applyHandoff, decodeHandoff, stripImportFragment } from '@/lib/cloud/handoff'
import { ensureGrandfatherSnapshot, type GrandfatherSnapshot } from '@/lib/cloud/gate'
import { loadChangeLog, saveChangeLog, type ProgressState } from '@/lib/cloud/progress-merge'
import type { KeyValueStorage } from '@/lib/cloud/storage'

export type ImportOutcome = { status: 'none' } | { status: 'failed' } | { status: 'imported'; added: number }

export interface HandoffImportDeps {
  readHash(): string
  currentHref(): string
  /** history.replaceState to this path + query. */
  replaceUrl(url: string): void
  /** movedState(...) === 'import' for this hash: canonical origin, static build, movedToCanonical. */
  isImportTarget(hash: string): boolean
  store: { getState(): ProgressState; setState(patch: Partial<ProgressState>): void }
  storage: KeyValueStorage | null
  now(): number
}

const NONE: ImportOutcome = { status: 'none' }

export class HandoffImporter {
  private captured: string | null | undefined = undefined
  private outcome: ImportOutcome | null = null
  private noticeGiven = false

  constructor(private readonly deps: HandoffImportDeps) {}

  /** Read the fragment once and strip it from the address bar. Safe before progress hydrates. */
  capture(): void {
    if (this.captured !== undefined) return
    const hash = this.deps.readHash()
    this.captured = this.deps.isImportTarget(hash) ? hash : null
    if (this.captured !== null) this.deps.replaceUrl(stripImportFragment(this.deps.currentHref()))
  }

  /** Merge the captured fragment into progress (never a replace). Call after progress hydrated. */
  run(): ImportOutcome {
    if (this.outcome) return this.outcome
    this.capture()
    this.outcome = this.captured ? this.merge(this.captured) : NONE
    return this.outcome
  }

  /** The outcome for the one toast that reports it; null before the merge ran and after the first call. */
  notice(): ImportOutcome | null {
    if (!this.outcome || this.noticeGiven) return null
    this.noticeGiven = true
    return this.outcome
  }

  private merge(hash: string): ImportOutcome {
    const decoded = decodeHandoff(hash)
    if (!decoded.ok) return { status: 'failed' }
    const { storage, store, now } = this.deps
    const r = applyHandoff(store.getState(), loadChangeLog(storage, now()), decoded.state, now())
    store.setState(r.state)
    saveChangeLog(storage, r.changes)
    return { status: 'imported', added: r.added }
  }
}

/** The first-gated-load snapshot, taken only after a pending handoff on this load was merged. */
export function snapshotAfterHandoff(
  importer: HandoffImporter,
  storage: KeyValueStorage | null,
  getState: () => ProgressState,
  nowMs: number
): GrandfatherSnapshot {
  importer.run()
  return ensureGrandfatherSnapshot(storage, getState(), nowMs)
}
