'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface ProgressState {
  completedSections: string[]
  completedSubSteps: Record<string, string[]> // sectionId -> ['theory','ido','wedo','youdo','quiz']
  quizScores: Record<string, number> // sectionId -> score percentage
  lastVisited: string | null
  bookmarks: string[]
  startDate: string | null

  // actions
  toggleSectionComplete: (sectionId: string) => void
  toggleSubStep: (sectionId: string, step: string) => void
  setQuizScore: (sectionId: string, score: number) => void
  setLastVisited: (sectionId: string) => void
  toggleBookmark: (sectionId: string) => void
  setStartDate: () => void
  resetAll: () => void
}

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      completedSections: [],
      completedSubSteps: {},
      quizScores: {},
      lastVisited: null,
      bookmarks: [],
      startDate: null,

      toggleSectionComplete: (sectionId) =>
        set((s) => ({
          completedSections: s.completedSections.includes(sectionId)
            ? s.completedSections.filter((id) => id !== sectionId)
            : [...s.completedSections, sectionId],
        })),

      toggleSubStep: (sectionId, step) =>
        set((s) => {
          const current = s.completedSubSteps[sectionId] || []
          return {
            completedSubSteps: {
              ...s.completedSubSteps,
              [sectionId]: current.includes(step)
                ? current.filter((st) => st !== step)
                : [...current, step],
            },
          }
        }),

      setQuizScore: (sectionId, score) =>
        set((s) => ({
          quizScores: { ...s.quizScores, [sectionId]: Math.max(score, s.quizScores[sectionId] || 0) },
        })),

      setLastVisited: (sectionId) => set({ lastVisited: sectionId }),
      toggleBookmark: (sectionId) =>
        set((s) => ({
          bookmarks: s.bookmarks.includes(sectionId)
            ? s.bookmarks.filter((id) => id !== sectionId)
            : [...s.bookmarks, sectionId],
        })),
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
        }),
    }),
    { name: 'python-ds-progress' }
  )
)

export const SUB_STEPS = ['theory', 'ido', 'wedo', 'youdo', 'quiz'] as const
export type SubStep = (typeof SUB_STEPS)[number]

export const SUB_STEP_LABELS: Record<SubStep, string> = {
  theory: 'Teoría',
  ido: 'Yo hago',
  wedo: 'Hacemos juntos',
  youdo: 'Tú haces',
  quiz: 'Autocheck',
}
