/**
 * The exam gates a learner must pass before /api/credentials/issue issues a capstone credential.
 *
 * The gates are the 13 capstone sections in GATE_MAP, written as section numbers (S04 ... S52).
 * ExamAttempt rows are keyed by the section's id slug, never by that number, so each number is
 * resolved through COURSE_SECTIONS by `index`. A later slug rename cannot break the gate, and a
 * row still stored under a pre-rename slug counts through sectionIdAliases.
 *
 * Pure (no DB / session): the route and the adversarial tests run the same code.
 */

import { GATE_MAP } from './capstones/catalog'
import { COURSE_SECTIONS } from './course'
import badgeCatalog from './eligibility/badge_catalog.json'
import { bestScoreBySection } from './exam-scoring'
import { sectionIdAliases, withCanonicalSectionIds } from './section-id-migrations'

/**
 * The exam score a gate section needs, from the credential policy. Not PASS_THRESHOLD (70): the
 * catalog says a pass@70 exam score does not count toward a capstone credential below 85%.
 */
export const CREDENTIAL_EXAM_FLOOR: number = badgeCatalog.provisional_floors.section_exam_pct

/** Current section id for every gate section, in GATE_MAP order. Throws if one has no section. */
export function gateSectionIds(): string[] {
  return Object.keys(GATE_MAP).map((tag) => {
    const match = /^S(\d{2})$/.exec(tag)
    const section = match && COURSE_SECTIONS.find((s) => s.index === Number(match[1]))
    if (!section) throw new Error(`Credential gate ${tag} has no section in COURSE_SECTIONS`)
    return section.id
  })
}

/** Every slug the gate sections have been stored under, for the ExamAttempt query. */
export function gateSectionAliases(): string[] {
  return gateSectionIds().flatMap(sectionIdAliases)
}

export interface GateAttempt {
  sectionId: string
  score: number
  completedAt: Date | null
}

/**
 * How many distinct gate sections have a completed attempt whose best score meets the floor.
 * A section retaken several times, or stored under two slugs, still counts once.
 */
export function countPassedGates(attempts: GateAttempt[]): number {
  const completed = attempts.filter((a) => a.completedAt !== null)
  const best = bestScoreBySection(withCanonicalSectionIds(completed))
  return gateSectionIds().filter((id) => {
    const score = best[id]
    return score !== undefined && score >= CREDENTIAL_EXAM_FLOOR
  }).length
}
