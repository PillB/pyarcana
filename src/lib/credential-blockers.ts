/**
 * What refuses a capstone credential (Class D). It fails closed: every check is a blocker until
 * this server shows it passed.
 *
 * - Each requirement the badge lists (its assessment components and its prerequisite badges)
 *   needs a registered server verifier that passes it (credential-verifiers.ts). Today only the
 *   exams have one.
 * - Each gate of the eligibility engine (ENGINE_GATES) must be reported passed by the real
 *   engine, run on the evidence the registered verifiers attest and on nothing else. A verifier's
 *   pass never clears a gate; the engine's report on what the verifier attested does.
 * - The request must not name a specification version other than the badge's own.
 * - Standing blockers hold until the work they name exists: no credential is written as a
 *   Credential row yet.
 *
 * The gate this replaces listed what was known to be missing, so it would have opened once each
 * listed item got a verifier, without the engine checks it never named. Here a check that nothing
 * shows passed is a blocker, including a gate the engine never reached: it returns at its first
 * failing gate among 1-4, and before the overall score when 5-7 fail.
 *
 * Pure (no DB / session): the route and the adversarial tests run the same code.
 */

import { PREREQUISITES_REQUIREMENT, credentialRequirements } from './credential-gates'
import {
  SERVER_VERIFIERS,
  credentialStorePersists,
  type IssuanceEvidence,
  type VerifierRegistry,
  type VerifierResult,
} from './credential-verifiers'
import { ENGINE_GATES, EligibilityEngine, GATE_REQUIREMENTS, type EngineGate } from './eligibility/engine'
import { STATE_AWARDED, type BadgeSpec, type EligibilityReport, type LearnerProgress } from './eligibility/types'

/** The blocker an engine gate raises. A gate that checks several items raises one per item. */
type GateBlocker =
  | 'BADGE_STATUS'
  | 'PREREQUISITES'
  | 'REQUIRED_ACTIVITIES'
  | 'REQUIRED_PROJECTS'
  | 'COMPONENT'
  | 'CRITICAL_COMPETENCY'
  | 'SUPPLEMENTARY'
  | 'OVERALL_SCORE'
  | 'EDITION'

export type BlockerCode =
  | 'BADGE_STATUS'
  | 'PREREQUISITES'
  | 'REQUIRED_ACTIVITIES'
  | 'REQUIRED_PROJECTS'
  | `COMPONENT:${string}`
  | `CRITICAL_COMPETENCY:${string}`
  | `SUPPLEMENTARY:${string}`
  | 'OVERALL_SCORE'
  | 'EDITION'
  | 'SPEC_VERSION_MISMATCH'
  | 'CREDENTIAL_STORE_NOT_IMPLEMENTED'

/**
 * Why a check blocks.
 * - unverified: no registered server verifier passes this requirement.
 * - unmet: the engine evaluated this gate and it failed, or the request contradicts the catalog.
 * - not_evaluated: the engine stopped at an earlier gate, so nothing shows this one passed.
 * - standing: the issuance path lacks something, whatever the learner's evidence.
 */
export type BlockerKind = 'unverified' | 'unmet' | 'not_evaluated' | 'standing'

export interface Blocker {
  code: BlockerCode
  kind: BlockerKind
}

/**
 * The blocker each engine gate raises. Checked against Record<EngineGate, …>, so a gate added to
 * ENGINE_GATES without a blocker here does not compile. Per-item gates append the item:
 * `COMPONENT:defense`.
 */
export const BLOCKER_FOR_GATE = {
  badge_status: 'BADGE_STATUS',
  prerequisite_badges: 'PREREQUISITES',
  required_activities: 'REQUIRED_ACTIVITIES',
  required_projects: 'REQUIRED_PROJECTS',
  component_floors: 'COMPONENT',
  critical_competencies: 'CRITICAL_COMPETENCY',
  supplementary_exercises: 'SUPPLEMENTARY',
  overall_weighted_average: 'OVERALL_SCORE',
  edition: 'EDITION',
} as const satisfies Record<EngineGate, GateBlocker>

function requirementBlocker(requirement: string): BlockerCode {
  return requirement === PREREQUISITES_REQUIREMENT ? 'PREREQUISITES' : `COMPONENT:${requirement}`
}

function emptyProgress(): LearnerProgress {
  // The engine never reads learner_id; the route knows the learner, the engine does not need to.
  return {
    learner_id: '',
    awarded_badges: [],
    activities: [],
    critical_competency_scores: [],
    project_results: {},
  }
}

function addAttested(progress: LearnerProgress, attests: VerifierResult['attests']): void {
  progress.awarded_badges.push(...(attests.awarded_badges ?? []))
  progress.activities.push(...(attests.activities ?? []))
  progress.critical_competency_scores.push(...(attests.critical_competency_scores ?? []))
  Object.assign(progress.project_results, attests.project_results)
}

/**
 * Runs the registered verifier of each requirement the badge lists. Returns what they attest, as
 * the engine's only input, and a blocker for each requirement no verifier passes.
 */
function verifyRequirements(
  spec: BadgeSpec,
  evidence: IssuanceEvidence,
  verifiers: VerifierRegistry
): { progress: LearnerProgress; blockers: Blocker[] } {
  const progress = emptyProgress()
  const blockers: Blocker[] = []
  for (const requirement of credentialRequirements(spec)) {
    const verifier = Object.hasOwn(verifiers, requirement) ? verifiers[requirement] : undefined
    const result = verifier?.(spec, evidence)
    if (result) addAttested(progress, result.attests)
    if (result?.passed !== true) {
      blockers.push({ code: requirementBlocker(requirement), kind: 'unverified' })
    }
  }
  return { progress, blockers }
}

/**
 * A blocker for every engine requirement the report does not show passed: `unmet` when the
 * engine reports it failed, `not_evaluated` when the engine stopped before it.
 *
 * The edition gate reports no requirement; it is passed when the engine awards. A report that
 * does not award with every requirement passed is therefore an EDITION refusal, and also stands
 * for any refusal the engine might give without a failed requirement, so the decision never rests
 * on the list of requirements alone.
 */
function engineBlockers(spec: BadgeSpec, report: EligibilityReport): Blocker[] {
  const reported = new Map(report.requirements.map((r) => [r.requirement_id, r.passed]))
  const blockers: Blocker[] = []
  for (const gate of ENGINE_GATES) {
    for (const { requirement_id, item } of GATE_REQUIREMENTS[gate](spec)) {
      const passed = reported.get(requirement_id)
      if (passed === true) continue
      const family = BLOCKER_FOR_GATE[gate]
      blockers.push({
        code: (item === undefined ? family : `${family}:${item}`) as BlockerCode,
        kind: passed === false ? 'unmet' : 'not_evaluated',
      })
    }
  }
  if (!report.eligible || report.state !== STATE_AWARDED) {
    blockers.push({
      code: BLOCKER_FOR_GATE.edition,
      kind: blockers.length === 0 ? 'unmet' : 'not_evaluated',
    })
  }
  return blockers
}

function requestBlockers(spec: BadgeSpec, evidence: IssuanceEvidence): Blocker[] {
  const requested = evidence.requestedSpecVersion
  return requested !== undefined && requested !== spec.version
    ? [{ code: 'SPEC_VERSION_MISMATCH', kind: 'unmet' }]
    : []
}

function standingBlockers(): Blocker[] {
  return credentialStorePersists()
    ? []
    : [{ code: 'CREDENTIAL_STORE_NOT_IMPLEMENTED', kind: 'standing' }]
}

/** One blocker per code, the first reason found: a missing verifier before the gate it starves. */
function firstPerCode(blockers: Blocker[]): Blocker[] {
  const seen = new Set<string>()
  return blockers.filter((b) => {
    if (seen.has(b.code)) return false
    seen.add(b.code)
    return true
  })
}

/**
 * Everything that refuses the credential `spec` describes, for the learner whose server-held
 * evidence is `evidence`. Empty only when every requirement is verified, the real engine awards
 * on the verified evidence, the request names the badge's own version, and no standing blocker
 * remains. Order: requirements, engine gates in ENGINE_GATES order, request, standing.
 */
export function issuanceBlockers(
  spec: BadgeSpec,
  evidence: IssuanceEvidence,
  verifiers: VerifierRegistry = SERVER_VERIFIERS
): Blocker[] {
  const verified = verifyRequirements(spec, evidence, verifiers)
  const engine = new EligibilityEngine(new Map([[spec.badge_id, spec]]))
  const report = engine.evaluate(spec.badge_id, verified.progress, { edition: evidence.edition })
  return firstPerCode([
    ...verified.blockers,
    ...engineBlockers(spec, report),
    ...requestBlockers(spec, evidence),
    ...standingBlockers(),
  ])
}
