/**
 * What /api/credentials/issue checks before it issues a capstone credential (Class D).
 *
 * The requested badge's own catalog entry sets the requirement: the exams of its
 * `required_sections` (S01-S13 for Foundations, only S52 for the final capstone), and every other
 * requirement it lists. ExamAttempt rows are keyed by the section's id slug, never by its number,
 * so each number is resolved through COURSE_SECTIONS by `index`. A later slug rename cannot break
 * that, and a row still stored under a pre-rename slug counts through sectionIdAliases.
 *
 * Only exam evidence is recorded on this server. Self-checks, You Do rubrics, the integrator
 * project, the defense and prerequisite badges are not, so a credential is not issued until each
 * of them has a verifier here: the catalog forbids a claim beyond the evidence collected.
 *
 * Pure (no DB / session): the route and the adversarial tests run the same code.
 */

import { COURSE_SECTIONS } from './course'
import badgeCatalog from './eligibility/badge_catalog.json'
import { loadBadgeSpecs } from './eligibility/badge-specs'
import type { BadgeSpec } from './eligibility/types'
import { bestScoreBySection } from './exam-scoring'
import { sectionIdAliases, withCanonicalSectionIds } from './section-id-migrations'

/**
 * The exam score a required section needs, from the credential policy. Not PASS_THRESHOLD (70):
 * the catalog says a pass@70 exam score does not count toward a capstone credential below 85%.
 */
export const CREDENTIAL_EXAM_FLOOR: number = badgeCatalog.provisional_floors.section_exam_pct

/** The one assessment component this server can verify. */
const EXAM_COMPONENT = 'section_exams'

/** The catalog entry for a capstone credential, or undefined for any other badge id. */
export function credentialSpec(badgeId: string): BadgeSpec | undefined {
  const spec = loadBadgeSpecs().specs.get(badgeId)
  return spec?.credential_type === 'verified_credential' ? spec : undefined
}

/** Current section id for each of the badge's required sections. Throws if one has no section. */
export function requiredSectionIds(spec: BadgeSpec): string[] {
  if (spec.required_sections.length === 0) {
    throw new Error(`${spec.badge_id} lists no required sections`)
  }
  return spec.required_sections.map((tag) => {
    const match = /^S(\d{2})$/.exec(tag)
    const section = match && COURSE_SECTIONS.find((s) => s.index === Number(match[1]))
    if (!section) throw new Error(`${spec.badge_id}: section ${tag} is not in COURSE_SECTIONS`)
    return section.id
  })
}

/** Every slug the badge's required sections have been stored under, for the ExamAttempt query. */
export function requiredSectionAliases(spec: BadgeSpec): string[] {
  return requiredSectionIds(spec).flatMap(sectionIdAliases)
}

export interface ExamAttemptEvidence {
  sectionId: string
  score: number
  completedAt: Date | null
}

/**
 * How many of the badge's required sections have a completed attempt whose best score meets the
 * floor. A section retaken several times, or stored under two slugs, still counts once.
 */
export function countPassedSections(spec: BadgeSpec, attempts: ExamAttemptEvidence[]): number {
  const completed = attempts.filter((a) => a.completedAt !== null)
  const best = bestScoreBySection(withCanonicalSectionIds(completed))
  return requiredSectionIds(spec).filter((id) => {
    const score = best[id]
    return score !== undefined && score >= CREDENTIAL_EXAM_FLOOR
  }).length
}

/**
 * The badge's requirements this server cannot verify: every assessment component except the
 * exams, and its prerequisite badges. Any entry here means no credential is issued.
 */
export function unverifiedRequirements(spec: BadgeSpec): string[] {
  const components = spec.components
    .map((c) => c.component_id)
    .filter((id) => id !== EXAM_COMPONENT)
  return spec.prerequisite_badges.length > 0 ? [...components, 'prerequisite_badges'] : components
}
