/**
 * Where an applied track sits in the course, as a pure function of the section list.
 *
 * The track is anchored to sections by their stable slug id and to levels by `phase`, never by
 * position or number: sections have been renumbered before (audit/fixer/numbering_epoch.json), and
 * a track pinned to "index 12" would silently follow whatever moved there. If an anchor slug
 * disappears, `resolveTrackPlacement` throws and names it, so the drift is caught by the test and
 * at build time, not by a learner who finds the link on the wrong lesson.
 *
 * "Optional at the intermediate level, required at the advanced level" (Pablo, 25 Nov 2026) is
 * expressed here as a standing the UI shows. It is advisory: no gate, badge, exam or paywall reads
 * it. Enforcing it would change what a credential claims, which AGENTS.md puts under "Ask first"
 * (audit/tracks/web/DESIGN.md §3).
 */

export interface PlacedSection {
  id: string
  index: number
  phase?: 0 | 1 | 2 | 3
  title?: string
}

export interface TrackAnchors {
  /** The section after which the track is recommended (the detour starts here). */
  recommendedAfter: string
  /** Further sections where the detour is offered, by slug. */
  alsoOfferedIn: readonly string[]
  /** The first phase in which the track becomes required. */
  requiredFromPhase: 0 | 1 | 2 | 3
}

export interface TrackPlacement {
  recommendedAfter: PlacedSection
  offeredIn: readonly PlacedSection[]
  /** The first section of `requiredFromPhase`, in course order. */
  requiredBefore: PlacedSection
  requiredFromPhase: 0 | 1 | 2 | 3
}

function bySlug(sections: readonly PlacedSection[], slug: string, role: string): PlacedSection {
  const found = sections.find((s) => s.id === slug)
  if (!found) {
    throw new Error(
      `[tracks] the ${role} anchor "${slug}" names no active section. ` +
        `Expected one of the ${sections.length} section ids in src/lib/course/index.ts. ` +
        'A section was renamed or removed: update the anchor in src/lib/tracks/web/content.ts, then re-run the web-track test.',
    )
  }
  return found
}

export function resolveTrackPlacement(sections: readonly PlacedSection[], anchors: TrackAnchors): TrackPlacement {
  const recommendedAfter = bySlug(sections, anchors.recommendedAfter, 'recommendedAfter')
  const offeredIn = anchors.alsoOfferedIn.map((slug) => bySlug(sections, slug, 'alsoOfferedIn'))
  const ordered = [...sections].sort((a, b) => a.index - b.index)
  const requiredBefore = ordered.find((s) => s.phase === anchors.requiredFromPhase)
  if (!requiredBefore) {
    throw new Error(`[tracks] no active section has phase ${anchors.requiredFromPhase}; the track cannot say where it becomes required.`)
  }
  if (requiredBefore.index <= recommendedAfter.index) {
    throw new Error(
      `[tracks] the track would be required (from ${requiredBefore.id}, index ${requiredBefore.index}) ` +
        `no later than it is recommended (after ${recommendedAfter.id}, index ${recommendedAfter.index}). Expected required to come later.`,
    )
  }
  return { recommendedAfter, offeredIn, requiredBefore, requiredFromPhase: anchors.requiredFromPhase }
}

export type TrackStanding = 'upcoming' | 'optional' | 'required' | 'done'

export interface LearnerPosition {
  completedSections: readonly string[]
  /** The section open now, if any. */
  currentSectionId?: string | null
}

/** The furthest phase the learner has reached: a completed section or the one open now. */
function reachedPhase(sections: readonly PlacedSection[], pos: LearnerPosition): number {
  const touched = new Set(pos.completedSections)
  if (pos.currentSectionId) touched.add(pos.currentSectionId)
  return sections.reduce((max, s) => (touched.has(s.id) && (s.phase ?? 0) > max ? s.phase ?? 0 : max), -1)
}

/**
 * The track's standing for this learner. `done` wins; then `required` once the learner has
 * reached the phase where it becomes required; then `optional` once the anchor section is
 * complete or a later one has been reached; `upcoming` before that. Never a lock: every standing
 * opens the track.
 */
export function trackStanding(
  placement: TrackPlacement,
  sections: readonly PlacedSection[],
  pos: LearnerPosition,
  trackComplete: boolean,
): TrackStanding {
  if (trackComplete) return 'done'
  if (reachedPhase(sections, pos) >= placement.requiredFromPhase) return 'required'
  const completed = new Set(pos.completedSections)
  const current = sections.find((s) => s.id === pos.currentSectionId)
  const pastAnchor = completed.has(placement.recommendedAfter.id) || (current?.index ?? 0) > placement.recommendedAfter.index
  return pastAnchor ? 'optional' : 'upcoming'
}

export type TrackLinkKind = 'detour' | 'required'

/**
 * Which link a section shows: the detour on the anchor and the sections it is offered in; the
 * "required" notice on the first section of the required phase while the track is not done; none
 * elsewhere, so the other 49 sections are not touched.
 */
export function trackLinkFor(sectionId: string, placement: TrackPlacement, trackComplete: boolean): TrackLinkKind | null {
  if (sectionId === placement.requiredBefore.id) return trackComplete ? null : 'required'
  if (sectionId === placement.recommendedAfter.id) return 'detour'
  return placement.offeredIn.some((s) => s.id === sectionId) ? 'detour' : null
}
