'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useSession } from 'next-auth/react'
import { IS_STATIC_SITE } from '@/lib/runtime-mode'

interface ProgressState {
  completedSections: string[]
  completedSubSteps: Record<string, string[]>
  quizScores: Record<string, number>
  lastVisited: string | null
  bookmarks: string[]
  startDate: string | null
  // server sync
  isHydratedFromServer: boolean

  // actions
  toggleSectionComplete: (sectionId: string) => void
  toggleSubStep: (sectionId: string, step: string) => void
  setQuizScore: (sectionId: string, score: number) => void
  setLastVisited: (sectionId: string) => void
  toggleBookmark: (sectionId: string) => void
  setStartDate: () => void
  resetAll: () => void
  hydrateFromServer: (data: {
    progress: Record<string, string[]>
    bookmarks: string[]
  }) => void
}

// ── Persisted-state sanitization ───────────────────────────────────────────
// localStorage is user-writable and can be corrupted (intentionally by an
// attacker on a shared computer, or accidentally by a buggy extension). If we
// blindly trust the persisted JSON, malformed shapes (e.g.
// `completedSections: 42` or `bookmarks: null`) crash the app on next load
// with "a client-side exception has occurred" and the user cannot recover
// without DevTools knowledge.
//
// This sanitizer coerces any persisted value back to a safe default shape
// before Zustand hydrates the store. Corruption is logged to console (for
// debugging) but never crashes the UI.
function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}
function isStringRecord(v: unknown): v is Record<string, string[]> {
  return (
    typeof v === 'object' && v !== null && !Array.isArray(v) &&
    Object.entries(v).every(
      ([k, val]) => typeof k === 'string' && isStringArray(val)
    )
  )
}
function isNumberRecord(v: unknown): v is Record<string, number> {
  return (
    typeof v === 'object' && v !== null && !Array.isArray(v) &&
    Object.entries(v).every(
      ([k, val]) => typeof k === 'string' && typeof val === 'number' && !Number.isNaN(val)
    )
  )
}

function sanitizePersisted(raw: unknown): Partial<ProgressState> {
  if (typeof raw !== 'object' || raw === null || Array.isArray(raw)) {
    console.warn('[progress-store] persisted state was not an object; resetting to defaults.')
    return {}
  }
  const obj = raw as Record<string, unknown>
  const out: Partial<ProgressState> = {}
  if (isStringArray(obj.completedSections)) out.completedSections = obj.completedSections
  else if ('completedSections' in obj) console.warn('[progress-store] completedSections invalid; ignoring.')
  if (isStringRecord(obj.completedSubSteps)) out.completedSubSteps = obj.completedSubSteps
  else if ('completedSubSteps' in obj) console.warn('[progress-store] completedSubSteps invalid; ignoring.')
  if (isNumberRecord(obj.quizScores)) out.quizScores = obj.quizScores
  else if ('quizScores' in obj) console.warn('[progress-store] quizScores invalid; ignoring.')
  if (typeof obj.lastVisited === 'string' || obj.lastVisited === null) out.lastVisited = obj.lastVisited as string | null
  if (isStringArray(obj.bookmarks)) out.bookmarks = obj.bookmarks
  else if ('bookmarks' in obj) console.warn('[progress-store] bookmarks invalid; ignoring.')
  if (typeof obj.startDate === 'string' || obj.startDate === null) out.startDate = obj.startDate as string | null
  if (typeof obj.isHydratedFromServer === 'boolean') out.isHydratedFromServer = obj.isHydratedFromServer
  return out
}

// Custom storage logic is inlined in the `storage` option below (direct
// localStorage access) so TypeScript infers the correct return type without
// the StateStorage union getting in the way.

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedSections: [],
      completedSubSteps: {},
      quizScores: {},
      lastVisited: null,
      bookmarks: [],
      startDate: null,
      isHydratedFromServer: false,

      toggleSectionComplete: (sectionId) =>
        set((s) => ({
          completedSections: s.completedSections.includes(sectionId)
            ? s.completedSections.filter((id) => id !== sectionId)
            : [...s.completedSections, sectionId],
        })),

      toggleSubStep: (sectionId, step) =>
        set((s) => {
          const current = s.completedSubSteps[sectionId] || []
          const newSteps = current.includes(step)
            ? current.filter((st) => st !== step)
            : [...current, step]
          // Sync to server if logged in (fire-and-forget)
          syncToServer(sectionId, step, !current.includes(step))
          return {
            completedSubSteps: {
              ...s.completedSubSteps,
              [sectionId]: newSteps,
            },
          }
        }),

      setQuizScore: (sectionId, score) =>
        set((s) => ({
          quizScores: { ...s.quizScores, [sectionId]: Math.max(score, s.quizScores[sectionId] || 0) },
        })),

      setLastVisited: (sectionId) => set({ lastVisited: sectionId }),

      toggleBookmark: (sectionId) =>
        set((s) => {
          const isBookmarked = s.bookmarks.includes(sectionId)
          // Sync bookmark to server
          syncBookmark(sectionId, !isBookmarked)
          return {
            bookmarks: isBookmarked
              ? s.bookmarks.filter((id) => id !== sectionId)
              : [...s.bookmarks, sectionId],
          }
        }),

      setStartDate: () =>
        set((s) => (s.startDate ? {} : { startDate: new Date().toISOString() })),

      resetAll: () =>
        set({
          completedSections: [],
          completedSubSteps: {},
          quizScores: {},
          lastVisited: null,
          bookmarks: [],
          startDate: null,
          isHydratedFromServer: false,
        }),

      hydrateFromServer: (data) =>
        set({
          completedSubSteps: data.progress || {},
          bookmarks: data.bookmarks || [],
          isHydratedFromServer: true,
        }),
    }),
    {
      name: 'python-ds-progress',
      storage: {
        getItem: (name) => {
          // Direct localStorage access (not via safeStorage) so TS infers
          // string | null (not the StateStorage union with Promise).
          if (typeof window === 'undefined') return null
          let raw: string | null = null
          try {
            raw = window.localStorage.getItem(name)
          } catch {
            return null
          }
          if (!raw) return null
          try {
            const parsed = JSON.parse(raw)
            if (typeof parsed !== 'object' || parsed === null) return null
            const clean = sanitizePersisted((parsed as any).state)
            return { state: clean, version: (parsed as any).version ?? 0 }
          } catch (e) {
            console.warn('[progress-store] failed to parse persisted state; resetting.', e)
            return null
          }
        },
        setItem: (name, value) => {
          try {
            window.localStorage.setItem(name, JSON.stringify(value))
          } catch (e) {
            console.warn('[progress-store] could not persist state (storage unavailable).', e)
          }
        },
        removeItem: (name) => {
          try {
            window.localStorage.removeItem(name)
          } catch {
            // ignore
          }
        },
      },
    }
  )
)

// Fire-and-forget sync to server
async function syncToServer(sectionId: string, subStep: string, completed: boolean) {
  if (IS_STATIC_SITE) return
  try {
    const res = await fetch('/api/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, subStep, completed }),
    })
    if (!res.ok) {
      // Silently fail — local state is still updated
      console.debug('Progress sync failed (non-critical)')
    }
  } catch {
    // Silent fail — local state is source of truth when offline
  }
}

async function syncBookmark(sectionId: string, bookmarked: boolean) {
  if (IS_STATIC_SITE) return
  try {
    await fetch('/api/progress', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sectionId, bookmarked }),
    })
  } catch {
    // Silent fail
  }
}

export const SUB_STEPS = ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const
export type SubStep = (typeof SUB_STEPS)[number]

export const SUB_STEP_LABELS: Record<SubStep, string> = {
  theory: 'Teoría',
  ido: 'Yo hago',
  wedo: 'Hacemos juntos',
  youdo: 'Tú haces',
  quiz: 'Autocheck',
}

// Hook to hydrate progress from server when user logs in
export function useServerProgressSync() {
  const { data: session, status } = useSession()
  const { hydrateFromServer, isHydratedFromServer } = useProgressStore()

  if (!IS_STATIC_SITE && status === 'authenticated' && session?.user && !isHydratedFromServer) {
    // Fetch progress from server
    fetch('/api/progress')
      .then((r) => r.json())
      .then((data) => {
        hydrateFromServer({
          progress: data.progress || {},
          bookmarks: data.bookmarks || [],
        })
      })
      .catch(() => {})
  }
}
