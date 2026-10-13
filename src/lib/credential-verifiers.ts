/**
 * The server verifiers credential issuance trusts, one per requirement a capstone credential lists.
 *
 * A capstone's catalog entry lists assessment components (self_check, you_do_projects,
 * section_exams, integrator_project, defense) and prerequisite badges. A requirement counts only
 * when a verifier registered here passes it from evidence this server holds. The only evidence it
 * holds is ExamAttempt rows, so the registry has one entry: section_exams.
 *
 * A verifier also attests the eligibility-engine evidence it read, and nothing else reaches the
 * engine. Registering a verifier never opens issuance by itself: every engine gate must then pass
 * on what the registered verifiers attest, and the standing blockers must be gone
 * (credential-blockers.ts).
 */

import {
  bestRequiredSectionScores,
  countPassedSections,
  requiredSectionIds,
  type ExamAttemptEvidence,
} from './credential-gates'
import type { ActivityEvidence, BadgeSpec, Edition, LearnerProgress } from './eligibility/types'
import { TIER_YOU_DO } from './eligibility/types'

/** What the server holds for one learner and one request, read before any check runs. */
export interface IssuanceEvidence {
  /** The learner's completed ExamAttempt rows that count as evidence (GRADED_AS_EVIDENCE). */
  examAttempts: ExamAttemptEvidence[]
  /** The edition this server runs as. The route serves issuance on the dynamic LMS only. */
  edition: Edition
  /** The specificationVersion the request named: compared with the catalog, never signed. */
  requestedSpecVersion?: string
}

export interface VerifierResult {
  /** Whether the requirement is met, judged on server-held evidence alone. */
  passed: boolean
  /** The eligibility-engine evidence the verifier read from server-held records. */
  attests: Partial<Omit<LearnerProgress, 'learner_id'>>
}

export type ServerVerifier = (spec: BadgeSpec, evidence: IssuanceEvidence) => VerifierResult

/** Verifiers keyed by requirement: a component_id, or PREREQUISITES_REQUIREMENT. */
export type VerifierRegistry = Readonly<Record<string, ServerVerifier>>

/**
 * section_exams: every required section has a completed, evidence-grade attempt whose best score
 * meets CREDENTIAL_EXAM_FLOOR. Attests each attempted section's best score as its `Sxx-EXAM`
 * activity. The exam is server-graded independent work, so it is You Do tier, the tier the
 * engine asks of a capstone's activities (engine.ts evidenceTierMinimum).
 */
export function verifySectionExams(spec: BadgeSpec, evidence: IssuanceEvidence): VerifierResult {
  const best = bestRequiredSectionScores(spec, evidence.examAttempts)
  const activities: ActivityEvidence[] = [...best].map(([tag, score]) => ({
    activity_id: `${tag}-EXAM`,
    evidence_tier: TIER_YOU_DO,
    score_pct: score,
    server_verified: true,
  }))
  const passed =
    countPassedSections(spec, evidence.examAttempts) === requiredSectionIds(spec).length
  return { passed, attests: { activities } }
}

/** What production verifies. Add an entry only with a verifier that reads server-held evidence. */
export const SERVER_VERIFIERS: VerifierRegistry = {
  section_exams: verifySectionExams,
}

/**
 * Whether issuance writes a `Credential` row (prisma/schema.prisma), which ADR 5 makes the
 * credential's own record, with its evidence and revocations. It does not: the route writes a
 * Notification. Until it does, every request is refused with CREDENTIAL_STORE_NOT_IMPLEMENTED.
 */
export function credentialStorePersists(): boolean {
  return false
}
