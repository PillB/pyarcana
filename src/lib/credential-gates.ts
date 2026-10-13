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
 * of them has a verifier here: the catalog forbids a claim beyond the evidence collected. Which
 * requirements have one is credential-verifiers.ts; what refuses a credential is
 * credential-blockers.ts.
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

/** The requirement a badge's prerequisite badges are verified under, beside its components. */
export const PREREQUISITES_REQUIREMENT = 'prerequisite_badges'

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
 * The best completed score of each of the badge's required sections that has one, keyed by its
 * catalog tag (`S04`). A section retaken several times, or stored under two slugs, has one entry.
 */
export function bestRequiredSectionScores(
  spec: BadgeSpec,
  attempts: ExamAttemptEvidence[]
): Map<string, number> {
  const completed = attempts.filter((a) => a.completedAt !== null)
  const best = bestScoreBySection(withCanonicalSectionIds(completed))
  const ids = requiredSectionIds(spec)
  const scores = new Map<string, number>()
  spec.required_sections.forEach((tag, i) => {
    const score = best[ids[i]]
    if (score !== undefined) scores.set(tag, score)
  })
  return scores
}

/**
 * How many of the badge's required sections have a completed attempt whose best score meets the
 * floor. A section retaken several times, or stored under two slugs, still counts once.
 */
export function countPassedSections(spec: BadgeSpec, attempts: ExamAttemptEvidence[]): number {
  const scores = [...bestRequiredSectionScores(spec, attempts).values()]
  return scores.filter((score) => score >= CREDENTIAL_EXAM_FLOOR).length
}

/** What the badge requires beyond its gates: each assessment component, and its prerequisites. */
export function credentialRequirements(spec: BadgeSpec): string[] {
  const components = spec.components.map((c) => c.component_id)
  return spec.prerequisite_badges.length > 0 ? [...components, PREREQUISITES_REQUIREMENT] : components
}

/**
 * The badge's requirements this server cannot verify: those with no verifier among `verified`
 * (the keys of credential-verifiers.ts SERVER_VERIFIERS, which today is the exams alone). Any
 * entry here means no credential is issued, but an empty list does not open issuance:
 * credential-blockers.ts also requires every eligibility-engine gate to pass.
 */
export function unverifiedRequirements(spec: BadgeSpec, verified: Iterable<string>): string[] {
  const has = new Set(verified)
  return credentialRequirements(spec).filter((id) => !has.has(id))
}
