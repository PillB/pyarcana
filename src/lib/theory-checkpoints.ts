/**
 * Which theory parts a learner has marked as read (see `course/theory-parts.ts`).
 *
 * Kept apart from `python-ds-progress` on purpose:
 * - that record's `completedSubSteps` counts five steps per section, and the percentage, the
 *   sidebar, the certificate and the server sync all assume those five; a part key there would
 *   inflate every one of them;
 * - `progress-store.ts` is a protected path, and this needs no change to it.
 *
 * The cost, stated: these checkpoints live in this browser only. They are not sent to the
 * account and do not follow a learner to another device. The theory step itself still syncs.
 *
 * The record is untrusted on read: anything that is not a known shape reads as empty, so a
 * damaged value can only lose checkpoints, never invent one.
 */
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { renameSectionId } from '@/lib/section-id-migrations'

export const THEORY_CHECKPOINTS_KEY = 'pyarcana-theory-checkpoints'

export type CheckpointMap = Record<string, string[]>

const SECTION_ID = /^[a-z0-9][a-z0-9-]{0,63}$/
// Any plain token, not only today's `S01-T1-A`: a tag in a new format (a tenth topic, a capstone
// id) must still save, or its checkpoint button would do nothing and say nothing.
const PART_KEY = /^[A-Za-z0-9][A-Za-z0-9._-]{0,47}(#\d{1,2})?$/
const MAX_PARTS_PER_SECTION = 64
const MAX_SECTIONS = 128

/** Keep only well-formed section ids and part keys, deduplicated, within fixed bounds. */
export function sanitizeCheckpoints(value: unknown): CheckpointMap {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return {}
  const out: CheckpointMap = {}
  for (const [sectionId, keys] of Object.entries(value).slice(0, MAX_SECTIONS)) {
    if (!SECTION_ID.test(sectionId) || !Array.isArray(keys)) continue
    // A section whose slug was renamed since the checkpoint was saved keeps its checkpoints
    // (section-id-migrations.ts); old and new entries for one section are merged.
    const id = renameSectionId(sectionId)
    const valid = keys.filter((k): k is string => typeof k === 'string' && PART_KEY.test(k))
    const clean = [...new Set([...(out[id] ?? []), ...valid])]
    if (clean.length > 0) out[id] = clean.slice(0, MAX_PARTS_PER_SECTION)
  }
  return out
}

/** Tick or untick one part. Returns a new map; the old one is unchanged. */
export function togglePart(map: CheckpointMap, sectionId: string, key: string): CheckpointMap {
  if (!SECTION_ID.test(sectionId) || !PART_KEY.test(key)) return map
  const current = map[sectionId] ?? []
  const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key]
  const out = { ...map }
  if (next.length > 0) out[sectionId] = next
  else delete out[sectionId]
  return out
}

interface TheoryCheckpointState {
  read: CheckpointMap
  toggle: (sectionId: string, key: string) => void
  clear: () => void
}

export const useTheoryCheckpoints = create<TheoryCheckpointState>()(
  persist(
    (set) => ({
      read: {},
      toggle: (sectionId, key) =>
        set((s) => {
          const read = togglePart(s.read, sectionId, key)
          // Refused keys change nothing; say so instead of leaving a button that does nothing.
          if (read === s.read) console.error(`[theory-checkpoints] refused checkpoint «${key}» in section «${sectionId}»: not a valid id`)
          return { read }
        }),
      clear: () => set({ read: {} }),
    }),
    {
      name: THEORY_CHECKPOINTS_KEY,
      version: 1,
      // Storage can throw (private mode, quota, blocked site data): checkpoints then last for
      // the tab, and nothing else on the page breaks.
      storage: createJSONStorage(() => ({
        getItem: (k) => { try { return window.localStorage.getItem(k) } catch { return null } },
        setItem: (k, v) => { try { window.localStorage.setItem(k, v) } catch { /* tab-only */ } },
        removeItem: (k) => { try { window.localStorage.removeItem(k) } catch { /* ignore */ } },
      })),
      partialize: (s) => ({ read: s.read }),
      // Untrusted on read: zustand hands back whatever JSON was stored.
      merge: (persisted, current) => ({
        ...current,
        read: sanitizeCheckpoints((persisted as { read?: unknown } | null)?.read),
      }),
    }
  )
)

/**
 * Two tabs: each holds its own copy and writes the whole record, so the tab that saved last
 * would erase the other's checkpoints. When another tab writes, this one re-reads first.
 */
export function followOtherTabs(target: Pick<Window, 'addEventListener' | 'removeEventListener'>): () => void {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEORY_CHECKPOINTS_KEY || event.key === null) void useTheoryCheckpoints.persist.rehydrate()
  }
  target.addEventListener('storage', onStorage as EventListener)
  return () => target.removeEventListener('storage', onStorage as EventListener)
}

/** The part of the progress record that tells a reset from an ordinary change. */
export interface ProgressShape {
  completedSubSteps: Record<string, string[]>
  completedSections: string[]
  startDate: string | null
}

function progressItems(p: ProgressShape): number {
  return p.completedSections.length + Object.values(p.completedSubSteps).reduce((n, steps) => n + steps.length, 0)
}

/** True for a wipe: everything gone at once. Unticking the one step a learner had is not a wipe. */
export function isProgressReset(prev: ProgressShape, next: ProgressShape): boolean {
  if (progressItems(next) > 0) return false
  const lost = progressItems(prev)
  return lost >= 2 || (lost === 1 && prev.startDate !== null && next.startDate === null)
}

/**
 * A progress reset also forgets the theory checkpoints. Without this, a learner who starts over
 * (`resetAll`, or adopting an empty account copy) would open Teoría and find every part already
 * ticked. Only a wipe clears: a first load that starts empty does not, and neither does
 * unticking a step.
 */
export function followProgressReset(
  progress: { subscribe: (listener: (next: ProgressShape, prev: ProgressShape) => void) => () => void }
): () => void {
  return progress.subscribe((next, prev) => {
    if (isProgressReset(prev, next)) useTheoryCheckpoints.getState().clear()
  })
}
