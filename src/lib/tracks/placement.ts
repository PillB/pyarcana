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
  /** Parts done per section (`useProgressStore`): a non-empty entry means the learner opened it. */
  completedSubSteps?: Readonly<Record<string, readonly string[]>>
  /** The last section the learner opened, wherever they are now. */
  lastVisited?: string | null
  /** The section open now, if any. */
  currentSectionId?: string | null
  /** The furthest section this browser has ever shown, kept by the track (`advanceFurthest`). */
  furthestSeen?: string | null
}

/**
 * Every section the learner has touched: completed, open now, last opened, or with a part done.
 * The track page has no open section, so a rule that read only "completed + open" gave it a lower
 * standing than the section banner showed a moment earlier (STATE_MACHINES.md, SM3).
 */
function touchedSections(pos: LearnerPosition): Set<string> {
  const touched = new Set(pos.completedSections)
  if (pos.currentSectionId) touched.add(pos.currentSectionId)
  if (pos.lastVisited) touched.add(pos.lastVisited)
  if (pos.furthestSeen) touched.add(pos.furthestSeen)
  for (const [id, parts] of Object.entries(pos.completedSubSteps ?? {})) {
    if (parts.length > 0) touched.add(id)
  }
  return touched
}

/**
 * The track's standing for this learner. `done` wins; then `required` once the learner has
 * touched a section of the phase where it becomes required; then `optional` once the anchor
 * section is complete or a later one has been touched; `upcoming` before that. Never a lock:
 * every standing opens the track.
 */
export function trackStanding(
  placement: TrackPlacement,
  sections: readonly PlacedSection[],
  pos: LearnerPosition,
  trackComplete: boolean,
): TrackStanding {
  if (trackComplete) return 'done'
  const touched = sections.filter((s) => touchedSections(pos).has(s.id))
  if (touched.some((s) => (s.phase ?? 0) >= placement.requiredFromPhase)) return 'required'
  const pastAnchor =
    pos.completedSections.includes(placement.recommendedAfter.id) || touched.some((s) => s.index > placement.recommendedAfter.index)
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

/**
 * The banner title for a section's link. A learner already in the advanced level who goes back to
 * S12 must not read "optional detour" there while the track page tells them it is required
 * (STATE_MACHINES.md, SM4): on a detour section the title follows the standing.
 */
export function trackLinkTitleKey(kind: TrackLinkKind, standing: TrackStanding): string {
  if (kind === 'detour' && standing === 'required') return 'track.link.detour.titleRequired'
  return `track.link.${kind}.title`
}

/**
 * A high-water mark: the furthest section the learner has opened, by course order. The course
 * store keeps only the last section opened, so a learner who opened S27 and went back to S12 would
 * otherwise drop to "optional" (STATE_MACHINES.md, SM3). Kept as a slug, so a renumbering keeps
 * pointing at the same lesson; a slug that no longer exists is replaced by the next real one.
 */
export function advanceFurthest(sections: readonly PlacedSection[], stored: string | null, candidate: string | null | undefined): string | null {
  const next = sections.find((s) => s.id === candidate)
  if (!next) return stored
  const prev = sections.find((s) => s.id === stored)
  return !prev || next.index > prev.index ? next.id : stored
}
