/**
 * Two tabs of the course: each holds its own copy of the course progress, so a tab left open kept
 * showing old completion (and the web track's standing) until reloaded. When another tab writes
 * `python-ds-progress`, this one re-reads it, the same way `theory-checkpoints.ts` follows its key.
 *
 * Re-reading goes through the store's own `persist` storage (parse, sanitize, migrate), so a
 * record another tab wrote is validated exactly as on load. The store file itself is not changed.
 * The re-read writes the same record back, and a write of an unchanged value fires no `storage`
 * event in the other tab, so two tabs settle after one exchange (checked in the browser:
 * scripts/web_track_sync_check.cjs). STATE_MACHINES.md, SM3.
 */
import { applyAsRemote } from '@/lib/cloud/progress-adapter'
import { PROGRESS_STORAGE_KEY } from '@/lib/progress-sanitize'
import { useProgressStore } from '@/lib/progress-store'

type Target = Pick<Window, 'addEventListener' | 'removeEventListener'>

export function followCourseProgressInOtherTabs(
  target: Target,
  // Under the remote guard: the survey prompt and the section_complete event count only this
  // tab's own completions (Codex review, PR #196). The store's sync storage makes rehydrate()
  // set state synchronously, so the guard is still raised when its subscribers run.
  rehydrate: () => unknown = () => applyAsRemote(() => useProgressStore.persist.rehydrate()),
): () => void {
  const onStorage = (event: StorageEvent) => {
    // A removal (newValue null, also what localStorage.clear() sends) is not re-read: re-reading
    // an absent record keeps this tab's copy and writes it straight back, so the tab would
    // resurrect what the other one removed at once instead of only on its next change.
    if (event.key === PROGRESS_STORAGE_KEY && event.newValue !== null) void rehydrate()
  }
  target.addEventListener('storage', onStorage as EventListener)
  return () => target.removeEventListener('storage', onStorage as EventListener)
}
