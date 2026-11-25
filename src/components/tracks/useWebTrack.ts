'use client'

import { useCallback, useEffect, useState } from 'react'
import { COURSE_SECTIONS } from '@/lib/course'
import { useProgressStore } from '@/lib/progress-store'
import { advanceFurthest, trackStanding, type TrackStanding } from '@/lib/tracks/placement'
import {
  commitTrackStep,
  countTrackDone,
  loadTrackFurthest,
  loadTrackProgress,
  saveTrackFurthest,
  trackFurthestKey,
  trackProgressKey,
  type TrackProgress,
} from '@/lib/tracks/progress'
import { WEB_TRACK_ID } from '@/lib/tracks/web/content'
import { WEB_TRACK_PLACEMENT, WEB_TRACK_STEP_IDS } from '@/lib/tracks/web/placed'

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

/**
 * The learner's ticks on the web track and its standing for them. Ticks are read after mount (the
 * prerendered HTML has no storage), again whenever another tab writes them (`storage` event), and
 * every tick is applied to the latest stored record, so two open tabs never erase each other's
 * ticks (audit/tracks/web/STATE_MACHINES.md, SM1 and SM2).
 */
export function useWebTrack(currentSectionId?: string | null) {
  const completedSections = useProgressStore((s) => s.completedSections)
  const completedSubSteps = useProgressStore((s) => s.completedSubSteps)
  const lastVisited = useProgressStore((s) => s.lastVisited)
  const [progress, setProgress] = useState<TrackProgress>({ done: [] })
  const [saveFailed, setSaveFailed] = useState(false)
  const [furthestSeen, setFurthestSeen] = useState<string | null>(null)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadTrackProgress(storage(), WEB_TRACK_ID))
    setFurthestSeen(loadTrackFurthest(storage(), WEB_TRACK_ID))
    const key = trackProgressKey(WEB_TRACK_ID)
    const furthestKey = trackFurthestKey(WEB_TRACK_ID)
    const onStorage = (e: StorageEvent) => {
      if (e.key === key || e.key === null) setProgress(loadTrackProgress(storage(), WEB_TRACK_ID))
      if (e.key === furthestKey || e.key === null) setFurthestSeen(loadTrackFurthest(storage(), WEB_TRACK_ID))
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])
  useEffect(() => {
    // Advance from the stored mark, not this page's copy, so an older tab never lowers it.
    const stored = loadTrackFurthest(storage(), WEB_TRACK_ID)
    const next = advanceFurthest(COURSE_SECTIONS, stored, currentSectionId)
    if (next && next !== stored) saveTrackFurthest(storage(), WEB_TRACK_ID, next)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (next) setFurthestSeen(next)
  }, [currentSectionId])
  const setStep = useCallback((id: string, isDone: boolean) => {
    const r = commitTrackStep(storage(), WEB_TRACK_ID, id, isDone)
    setProgress(r.progress)
    setSaveFailed(!r.saved)
  }, [])
  const done = countTrackDone(progress, WEB_TRACK_STEP_IDS)
  const complete = done === WEB_TRACK_STEP_IDS.length
  const standing: TrackStanding = trackStanding(
    WEB_TRACK_PLACEMENT,
    COURSE_SECTIONS,
    { completedSections, completedSubSteps, lastVisited, currentSectionId, furthestSeen },
    complete,
  )
  return { progress, setStep, done, total: WEB_TRACK_STEP_IDS.length, complete, standing, saveFailed }
}
