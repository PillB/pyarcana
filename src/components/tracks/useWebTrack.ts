'use client'

import { useCallback, useEffect, useSyncExternalStore } from 'react'
import { COURSE_SECTIONS } from '@/lib/course'
import { useProgressStore } from '@/lib/progress-store'
import { trackStanding, type TrackStanding } from '@/lib/tracks/placement'
import { countTrackDone, isTrackComplete } from '@/lib/tracks/progress'
import { createTrackState, EMPTY_TRACK_SNAPSHOT } from '@/lib/tracks/shared-state'
import { WEB_TRACK_ID } from '@/lib/tracks/web/content'
import { WEB_TRACK_PLACEMENT, WEB_TRACK_STEP_IDS } from '@/lib/tracks/web/placed'

function storage(): Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage
  } catch {
    return null
  }
}

/** One per page: the track page, the section banners and the menu read and write the same copy. */
const webTrackState = createTrackState(WEB_TRACK_ID, storage)

function subscribe(listener: () => void): () => void {
  const stop = webTrackState.subscribe(listener)
  const onStorage = (e: StorageEvent) => webTrackState.handleStorageEvent(e.key)
  window.addEventListener('storage', onStorage)
  return () => {
    stop()
    window.removeEventListener('storage', onStorage)
  }
}

/**
 * The learner's ticks on the web track and its standing for them. Every component reads the same
 * per-page store (`shared-state.ts`), so a tick on the track page shows in the menu at once; other
 * tabs' writes arrive through the `storage` event; every tick is applied to the latest stored
 * record, so two tabs never erase each other's ticks. The prerendered HTML has no storage and
 * renders the empty state (STATE_MACHINES.md, SM1 to SM3).
 */
export function useWebTrack(currentSectionId?: string | null) {
  const completedSections = useProgressStore((s) => s.completedSections)
  const completedSubSteps = useProgressStore((s) => s.completedSubSteps)
  const lastVisited = useProgressStore((s) => s.lastVisited)
  const { progress, furthestSeen, saveFailed } = useSyncExternalStore(subscribe, webTrackState.getSnapshot, () => EMPTY_TRACK_SNAPSHOT)
  useEffect(() => {
    if (currentSectionId) webTrackState.visit(COURSE_SECTIONS, currentSectionId)
  }, [currentSectionId])
  const setStep = useCallback((id: string, isDone: boolean) => void webTrackState.setStep(id, isDone, WEB_TRACK_STEP_IDS), [])
  const done = countTrackDone(progress, WEB_TRACK_STEP_IDS)
  const complete = isTrackComplete(progress, WEB_TRACK_STEP_IDS)
  const standing: TrackStanding = trackStanding(
    WEB_TRACK_PLACEMENT,
    COURSE_SECTIONS,
    { completedSections, completedSubSteps, lastVisited, currentSectionId, furthestSeen },
    complete,
  )
  return { progress, setStep, done, total: WEB_TRACK_STEP_IDS.length, complete, standing, saveFailed }
}
