'use client'

import { useCallback, useEffect, useState } from 'react'
import { COURSE_SECTIONS } from '@/lib/course'
import { useProgressStore } from '@/lib/progress-store'
import { trackStanding, type TrackStanding } from '@/lib/tracks/placement'
import { countTrackDone, loadTrackProgress, saveTrackProgress, toggleTrackStep, type TrackProgress } from '@/lib/tracks/progress'
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
 * prerendered HTML has no storage) and again whenever the hook mounts, so a section banner reflects
 * ticks made on the track page.
 */
export function useWebTrack(currentSectionId?: string | null) {
  const completedSections = useProgressStore((s) => s.completedSections)
  const [progress, setProgress] = useState<TrackProgress>({ done: [] })
  const [saveFailed, setSaveFailed] = useState(false)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setProgress(loadTrackProgress(storage(), WEB_TRACK_ID))
  }, [])
  const toggle = useCallback((id: string) => {
    setProgress((prev) => {
      const next = toggleTrackStep(prev, id)
      setSaveFailed(!saveTrackProgress(storage(), WEB_TRACK_ID, next))
      return next
    })
  }, [])
  const done = countTrackDone(progress, WEB_TRACK_STEP_IDS)
  const complete = done === WEB_TRACK_STEP_IDS.length
  const standing: TrackStanding = trackStanding(WEB_TRACK_PLACEMENT, COURSE_SECTIONS, { completedSections, currentSectionId }, complete)
  return { progress, toggle, done, total: WEB_TRACK_STEP_IDS.length, complete, standing, saveFailed }
}
