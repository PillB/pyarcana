/**
 * Deterministic eligibility engine.
 *
 * Same inputs -> same outputs. No time-of-day dependence (freshness
 * is computed against a provided `now` argument, not `Date.now()`).
 * No randomness. No implicit state.
 *
 * This file is the TypeScript runtime implementation of the contract
 * specified in:
 *   - industry_alignment/credential_architecture.md
 *   - industry_alignment/eligibility_state_machine.md
 *   - industry_alignment/assessment_validity_report.md (Phase 7)
 *
 * The Python reference implementation in
 * `tests/adversarial/test_eligibility_engine.py` mirrors this engine
 * exactly; both must produce identical outputs for the same inputs.
 * The Python tests are the executable specification.
 */

import type {
  ActivityEvidence,
  BadgeSpec,
  Edition,
  EligibilityReport,
  EligibilityEngineInterface,
  LearnerProgress,
  RequirementResult,
} from './types'
import {
  EDITION_DYNAMIC,
  EDITION_STATIC,
  PROVISIONAL_FLOORS,
  STATE_ASSESSMENT_READY,
  STATE_AWARDED,
  STATE_AVAILABLE,
  STATE_EVIDENCE_INCOMPLETE,
  STATE_ELIGIBLE_PENDING_VERIFICATION,
  STATE_IN_PROGRESS,
  STATE_LOCKED,
  TIER_WE_DO,
  TIER_YOU_DO,
} from './types'
import { loadBadgeSpecs } from './badge-specs'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Round DOWN to `places` decimals. Conservative direction for floor
 * checks: a score of 84.999 becomes 84.99 and fails the 85 floor.
 */
function roundDown(value: number, places = 2): number {
  const factor = 10 ** places
  return Math.floor(value * factor) / factor
}

/**
 * Exactly at threshold = pass; one below = fail (after round-down).
 */
function passesFloor(score: number, floor: number): boolean {
  return roundDown(score) >= roundDown(floor)
}

function isProgress(spec: BadgeSpec): boolean {
  return spec.credential_type === 'local_achievement'
}

function isCompetency(spec: BadgeSpec): boolean {
  return spec.credential_type === 'competency_badge'
}

function isCapstone(spec: BadgeSpec): boolean {
  return spec.credential_type === 'verified_credential'
}

/**
 * Required activities are section-level (YOUDO, EXAM, SELFCHECK). These
 * are tier 4 evidence for both competency AND capstone badges. The
 * capstone's tier-6 defense evidence is enforced separately via the
 * `defense` component (floor=100) and the critical-competency gate —
 * not via the activity-tier check.
 */
function evidenceTierMinimum(spec: BadgeSpec): number {
  if (isCompetency(spec) || isCapstone(spec)) {
    return TIER_YOU_DO
  }
  return TIER_WE_DO // progress badges accept any walk-through evidence
}

// ---------------------------------------------------------------------------
// Engine
// ---------------------------------------------------------------------------

export class EligibilityEngine implements EligibilityEngineInterface {
  private readonly specs: Map<string, BadgeSpec>
  readonly catalogVersion: string

  constructor(specs?: Map<string, BadgeSpec>, catalogVersion?: string) {
    if (specs) {
      this.specs = specs
      this.catalogVersion = catalogVersion ?? '1.0.0'
    } else {
      const loaded = loadBadgeSpecs()
      this.specs = loaded.specs
      this.catalogVersion = loaded.catalogVersion
    }
  }

  // ----- public API ------------------------------------------------------

  evaluate(
    badge_id: string,
    progress: LearnerProgress,
    options?: { edition?: Edition; now?: string },
  ): EligibilityReport {
    const edition: Edition = options?.edition ?? EDITION_STATIC
    const now: string = options?.now ?? '2026-07-28T22:30:00Z'

    const spec = this.specs.get(badge_id)
    if (!spec) {
      throw new Error(`Unknown badge_id: ${badge_id}`)
    }

    const requirements: RequirementResult[] = []
    const blockingReasons: string[] = []

    // --- Gate 1: badge status ---
    if (spec.status === 'retired' || spec.status === 'superseded') {
      blockingReasons.push(
        `This badge is currently labeled '${spec.status}' in the catalog, ` +
          `so it can't be freshly awarded. Please ask about the successor badge.`,
      )
      requirements.push({
        requirement_id: 'badge_status',
        description: 'Badge is active or pilot in the catalog',
        passed: false,
        blocking_reason: `Badge status is '${spec.status}'.`,
      })
      return {
        badge_id,
        version: spec.version,
        state: STATE_LOCKED,
        eligible: false,
        requirements,
        blocking_reasons: blockingReasons,
        edition,
      }
    }
    requirements.push({
      requirement_id: 'badge_status',
      description: 'Badge is active or pilot in the catalog',
      passed: true,
    })

    // --- Gate 2: prerequisite badges ---
    const awardedStrict = new Set(
      progress.awarded_badges
        .filter((b) => b.state === STATE_AWARDED)
        .map((b) => b.badge_id),
    )
    const missingPrereqs = spec.prerequisite_badges.filter(
      (p) => !awardedStrict.has(p),
    )
    requirements.push({
      requirement_id: 'prerequisite_badges',
      description: 'All prerequisite badges are awarded',
      passed: missingPrereqs.length === 0,
      blocking_reason:
        missingPrereqs.length > 0
          ? `Missing prerequisites: ${missingPrereqs.join(', ')}`
          : null,
    })
    if (missingPrereqs.length > 0) {
      blockingReasons.push(
        `You need to earn these badges first: ${missingPrereqs.join(', ')}. ` +
          `Think of them as the building blocks for this one.`,
      )
      return {
        badge_id,
        version: spec.version,
        state: STATE_LOCKED,
        eligible: false,
        requirements,
        blocking_reasons: blockingReasons,
        edition,
      }
    }

    // --- Gate 3: required activities present (with evidence-tier minimum) ---
    const evidenceByActivity = this.indexEvidence(progress)
    const missingActivities: string[] = []
    const belowTierActivities: Array<{
      activity_id: string
      tier: number
      tier_min: number
    }> = []
    for (const activity_id of spec.required_activities) {
      const ev = evidenceByActivity.get(activity_id)
      if (!ev) {
        missingActivities.push(activity_id)
        continue
      }
      const tier_min = evidenceTierMinimum(spec)
      if (ev.evidence_tier < tier_min) {
        belowTierActivities.push({ activity_id, tier: ev.evidence_tier, tier_min })
      }
    }
    requirements.push({
      requirement_id: 'required_activities',
      description:
        'All required activities are present with sufficient independence',
      passed: missingActivities.length === 0 && belowTierActivities.length === 0,
      blocking_reason:
        missingActivities.length > 0 || belowTierActivities.length > 0
          ? `Missing: ${missingActivities.join(', ')}; below tier: ` +
            belowTierActivities.map((a) => a.activity_id).join(', ')
          : null,
    })
    if (missingActivities.length > 0) {
      blockingReasons.push(
        `You still need to complete these activities: ${missingActivities.join(', ')}. ` +
          `Each is a hands-on task — reading alone doesn't count.`,
      )
      return {
        badge_id,
        version: spec.version,
        state: evidenceByActivity.size === 0 ? STATE_AVAILABLE : STATE_IN_PROGRESS,
        eligible: false,
        requirements,
        blocking_reasons: blockingReasons,
        edition,
      }
    }
    if (belowTierActivities.length > 0) {
      for (const { activity_id, tier, tier_min } of belowTierActivities) {
        blockingReasons.push(
          `The activity '${activity_id}' was completed as guided practice ` +
            `(tier ${tier}), but this badge needs independent work ` +
            `(tier ${tier_min} or higher). Please redo it without step-by-step help.`,
        )
      }
      return {
        badge_id,
        version: spec.version,
        state: STATE_EVIDENCE_INCOMPLETE,
        eligible: false,
        requirements,
        blocking_reasons: blockingReasons,
        edition,
      }
    }

    // --- For progress badges, that's the entire gate chain ---
    if (isProgress(spec)) {
      return this.finalizeProgress(spec, requirements, blockingReasons, edition, now)
    }

    // --- Gate 4: required projects present ---
    const missingProjects = spec.required_projects.filter(
      (p) => progress.project_results[p] === undefined,
    )
    requirements.push({
      requirement_id: 'required_projects',
      description: 'All required projects are submitted with rubric scores',
      passed: missingProjects.length === 0,
      blocking_reason:
        missingProjects.length > 0
          ? `Missing projects: ${missingProjects.join(', ')}`
          : null,
    })
    if (missingProjects.length > 0) {
      blockingReasons.push(
        `You still need to submit these projects: ${missingProjects.join(', ')}. ` +
          `Each is rubric-graded — that's how we know the work is genuinely yours.`,
      )
      return {
        badge_id,
        version: spec.version,
        state: STATE_EVIDENCE_INCOMPLETE,
        eligible: false,
        requirements,
        blocking_reasons: blockingReasons,
        edition,
      }
    }

    // --- Gate 5: per-component floors ---
    const componentScores = this.computeComponentScores(spec, progress, evidenceByActivity)
    let anyComponentFailed = false
    for (const component of spec.components) {
      const score = componentScores.get(component.component_id) ?? null
      const floor = component.required_score_pct
      if (score === null) {
        requirements.push({
          requirement_id: `component:${component.component_id}`,
          description: `${component.component_id} component meets floor (${floor}%)`,
          passed: false,
          score: null,
          floor,
          blocking_reason: `No evidence recorded for ${component.component_id}.`,
        })
        blockingReasons.push(
          `We couldn't find a score for the '${component.component_id}' component. ` +
            `This badge needs it to be at least ${floor}%.`,
        )
        anyComponentFailed = true
        continue
      }
      const passed = passesFloor(score, floor)
      requirements.push({
        requirement_id: `component:${component.component_id}`,
        description: `${component.component_id} component meets floor (${floor}%)`,
        passed,
        score,
        floor,
        blocking_reason: !passed
          ? `${component.component_id} score ${score}% is below the ${floor}% floor.`
          : null,
      })
      if (!passed) {
        blockingReasons.push(
          `Your score on the '${component.component_id}' component is ${score}%, ` +
            `but this badge needs at least ${floor}%. ` +
            `You can re-attempt this after a short cool-down.`,
        )
        anyComponentFailed = true
      }
    }

    // --- Gate 6: critical competency floors (non-compensatory, =100%) ---
    let anyCriticalFailed = false
    for (const comp_id of spec.critical_competencies) {
      const score = progress.critical_competency_scores.find(
        (s) => s.competency_id === comp_id,
      )
      const floor = Number(PROVISIONAL_FLOORS.critical_competency_pct) // 100
      if (!score) {
        requirements.push({
          requirement_id: `critical_competency:${comp_id}`,
          description: `Critical competency '${comp_id}' scores 100% on every rubric criterion`,
          passed: false,
          score: null,
          floor,
          blocking_reason: `No rubric evaluation recorded for critical competency '${comp_id}'.`,
        })
        blockingReasons.push(
          `The competency '${comp_id}' is a critical one (the badge can't be issued ` +
            `without it). We don't have a rubric evaluation for it yet.`,
        )
        anyCriticalFailed = true
        continue
      }
      let critPassed: boolean
      let critScoreForReport: number
      if (score.criteria_scores && score.criteria_scores.length > 0) {
        critPassed = score.criteria_scores.every((c) => c === 100)
        critScoreForReport = Math.min(...score.criteria_scores)
      } else {
        critPassed = score.rubric_score_pct === 100
        critScoreForReport = score.rubric_score_pct
      }
      requirements.push({
        requirement_id: `critical_competency:${comp_id}`,
        description: `Critical competency '${comp_id}' scores 100% on every rubric criterion`,
        passed: critPassed,
        score: critScoreForReport,
        floor,
        blocking_reason: !critPassed
          ? `'${comp_id}' score ${critScoreForReport}% is below the required 100%.`
          : null,
      })
      if (!critPassed) {
        blockingReasons.push(
          `The competency '${comp_id}' is critical (non-negotiable). ` +
            `Your score is ${critScoreForReport}%, but it must be 100%. ` +
            `No other strength can offset this — please review the underlying sections.`,
        )
        anyCriticalFailed = true
      }
    }

    // --- Gate 7: gap-affected competencies require supplementary exercises ---
    // Enforce for ALL badges (pilot and active) that have gap-affected
    // critical competencies. The final capstone (evidence_grounded_ai_systems_capstone)
    // has status='active' but still has 4 gap-affected competencies that require
    // supplementary exercises. The gate must not depend solely on pilot status.
    if (spec.gap_affected_competencies.length > 0) {
      for (const comp_id of spec.gap_affected_competencies) {
        const supp_id = `BADGE:${badge_id}:supplementary:${comp_id}`
        if (progress.project_results[supp_id] === undefined) {
          blockingReasons.push(
            `This badge requires a supplementary exercise for gap-affected ` +
              `competency '${comp_id}'. You need to complete ${supp_id} ` +
              `before this badge can be awarded.`,
          )
          requirements.push({
            requirement_id: `supplementary_exercise:${comp_id}`,
            description: `Supplementary exercise for gap-affected competency '${comp_id}' is complete`,
            passed: false,
            blocking_reason: `Missing supplementary exercise: ${supp_id}`,
          })
          anyCriticalFailed = true
        } else {
          requirements.push({
            requirement_id: `supplementary_exercise:${comp_id}`,
            description: `Supplementary exercise for gap-affected competency '${comp_id}' is complete`,
            passed: true,
          })
        }
      }
    }

    if (anyComponentFailed || anyCriticalFailed) {
      return {
        badge_id,
        version: spec.version,
        state: STATE_ASSESSMENT_READY,
        eligible: false,
        requirements,
        blocking_reasons: blockingReasons,
        edition,
      }
    }

    // --- Gate 8: weighted-average overall ---
    const overall = this.weightedOverall(spec, componentScores)
    const overallFloor = spec.minimum_overall_score
    const overallPassed = passesFloor(overall, overallFloor)
    requirements.push({
      requirement_id: 'overall_weighted_average',
      description: `Weighted-average overall meets floor (${overallFloor}%)`,
      passed: overallPassed,
      score: overall,
      floor: overallFloor,
      blocking_reason: !overallPassed
        ? `Overall ${overall}% is below the ${overallFloor}% floor.`
        : null,
    })
    if (!overallPassed) {
      blockingReasons.push(
        `Your overall weighted score is ${overall}%, but this badge needs ${overallFloor}%. ` +
          `Even though each component passed its own floor, the average must also clear the bar.`,
      )
      return {
        badge_id,
        version: spec.version,
        state: STATE_ASSESSMENT_READY,
        eligible: false,
        requirements,
        blocking_reasons: blockingReasons,
        edition,
      }
    }

    // --- Gate 9: edition check ---
    if (edition === EDITION_STATIC) {
      // CAPSTONE credentials cannot even be previewed on static — they require
      // server-side defense recording. Show eligible_pending_verification with
      // a clear "sign in to the LMS" message.
      if (isCapstone(spec)) {
        blockingReasons.push(
          `This capstone credential can't be earned on the static edition. ` +
            `Please sign in to the LMS to record your defense and earn the credential.`,
        )
        return {
          badge_id,
          version: spec.version,
          state: STATE_ELIGIBLE_PENDING_VERIFICATION,
          eligible: false,
          requirements,
          blocking_reasons: blockingReasons,
          edition,
        }
      }
      // Competency badge on static: preview only — clearly labeled.
      return {
        badge_id,
        version: spec.version,
        state: STATE_ELIGIBLE_PENDING_VERIFICATION,
        eligible: true,
        requirements,
        blocking_reasons: [
          `Eligibility preview only — verification unavailable on the static edition. ` +
            `Sign in to the LMS to issue this credential.`,
        ],
        edition,
      }
    }

    // Dynamic edition: server has signed (this engine models the signed state
    // by returning STATE_AWARDED when the caller is the dynamic LMS).
    return {
      badge_id,
      version: spec.version,
      state: STATE_AWARDED,
      eligible: true,
      requirements,
      blocking_reasons: [],
      edition,
      awarded_at: now,
    }
  }

  // ----- idempotent award ----------------------------------------------

  awardIdempotent(
    badge_id: string,
    progress: LearnerProgress,
    options?: { edition?: Edition; now?: string },
  ): { report: EligibilityReport; newly_awarded: boolean } {
    const edition: Edition = options?.edition ?? EDITION_DYNAMIC
    const now: string = options?.now ?? '2026-07-28T22:30:00Z'

    // Already awarded?
    const already = progress.awarded_badges.find((b) => b.badge_id === badge_id)
    if (already && already.state === STATE_AWARDED) {
      const report = this.evaluate(badge_id, progress, { edition, now })
      // Force awarded state since it's already in the record.
      report.state = STATE_AWARDED
      report.eligible = true
      report.awarded_at = already.awarded_at ?? now
      return { report, newly_awarded: false }
    }

    const report = this.evaluate(badge_id, progress, { edition, now })
    if (report.state === STATE_AWARDED) {
      progress.awarded_badges.push({
        badge_id,
        state: STATE_AWARDED,
        awarded_at: now,
      })
      return { report, newly_awarded: true }
    }
    return { report, newly_awarded: false }
  }

  // ----- internals ------------------------------------------------------

  /**
   * If duplicate activity_id entries exist, the highest-tier one wins
   * (more independent evidence wins).
   */
  private indexEvidence(progress: LearnerProgress): Map<string, ActivityEvidence> {
    const out = new Map<string, ActivityEvidence>()
    for (const ev of progress.activities) {
      const existing = out.get(ev.activity_id)
      if (!existing || ev.evidence_tier > existing.evidence_tier) {
        out.set(ev.activity_id, ev)
      }
    }
    return out
  }

  private computeComponentScores(
    spec: BadgeSpec,
    progress: LearnerProgress,
    evidenceByActivity: Map<string, ActivityEvidence>,
  ): Map<string, number | null> {
    const scores = new Map<string, number | null>()
    for (const component of spec.components) {
      const cid = component.component_id
      let score: number | null = null
      switch (cid) {
        case 'self_check':
          score = this.aggregateSelfCheck(spec, evidenceByActivity)
          break
        case 'you_do_projects':
          score = this.aggregateYouDo(spec, evidenceByActivity)
          break
        case 'section_exams':
          score = this.aggregateExams(spec, evidenceByActivity)
          break
        case 'integrator_project':
          score = this.aggregateIntegrator(spec, progress)
          break
        case 'section_completion':
          score = this.aggregateSectionCompletion(spec, evidenceByActivity)
          break
        case 'defense':
          score = this.aggregateDefense(spec, progress)
          break
        default:
          score = null
      }
      scores.set(cid, score)
    }
    return scores
  }

  private aggregateSelfCheck(
    spec: BadgeSpec,
    ev: Map<string, ActivityEvidence>,
  ): number | null {
    const scores: number[] = []
    for (const section of spec.required_sections) {
      const e = ev.get(`${section}-SELFCHECK`)
      if (!e || e.score_pct === null) continue
      scores.push(Number(e.score_pct))
    }
    if (scores.length === 0) return null
    return roundDown(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private aggregateYouDo(
    spec: BadgeSpec,
    ev: Map<string, ActivityEvidence>,
  ): number | null {
    const scores: number[] = []
    for (const section of spec.required_sections) {
      const e = ev.get(`${section}-YOUDO`)
      if (!e || e.score_pct === null) continue
      scores.push(Number(e.score_pct))
    }
    if (scores.length === 0) return null
    return roundDown(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private aggregateExams(
    spec: BadgeSpec,
    ev: Map<string, ActivityEvidence>,
  ): number | null {
    const scores: number[] = []
    for (const section of spec.required_sections) {
      const e = ev.get(`${section}-EXAM`)
      if (!e || e.score_pct === null) continue
      scores.push(Number(e.score_pct))
    }
    if (scores.length === 0) return null
    return roundDown(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private aggregateIntegrator(
    spec: BadgeSpec,
    progress: LearnerProgress,
  ): number | null {
    // Aggregate the rubric scores of all required_projects EXCEPT defense
    // and supplementary exercises (which have their own gates).
    const excludedPrefixes = [
      `BADGE:${spec.badge_id}:defense`,
      `BADGE:${spec.badge_id}:supplementary:`,
    ]
    const scores: number[] = []
    for (const project_id of spec.required_projects) {
      if (excludedPrefixes.some((p) => project_id.startsWith(p))) continue
      const score = progress.project_results[project_id]
      if (score !== undefined) scores.push(Number(score))
    }
    if (scores.length === 0) return null
    return roundDown(scores.reduce((a, b) => a + b, 0) / scores.length)
  }

  private aggregateDefense(
    spec: BadgeSpec,
    progress: LearnerProgress,
  ): number | null {
    const defense_id = `BADGE:${spec.badge_id}:defense`
    const score = progress.project_results[defense_id]
    if (score === undefined) return null
    return roundDown(Number(score))
  }

  private aggregateSectionCompletion(
    spec: BadgeSpec,
    ev: Map<string, ActivityEvidence>,
  ): number | null {
    // For progress badges: 100% if all required sections have a YOUDO
    // activity present, else null.
    for (const section of spec.required_sections) {
      if (!ev.has(`${section}-YOUDO`)) return null
    }
    return 100
  }

  private weightedOverall(
    spec: BadgeSpec,
    componentScores: Map<string, number | null>,
  ): number {
    let totalWeight = 0
    let weightedSum = 0
    for (const component of spec.components) {
      const score = componentScores.get(component.component_id)
      if (score === null || score === undefined) continue
      weightedSum += score * component.weight
      totalWeight += component.weight
    }
    if (totalWeight === 0) return 0
    return roundDown(weightedSum / totalWeight)
  }

  private finalizeProgress(
    spec: BadgeSpec,
    requirements: RequirementResult[],
    blockingReasons: string[],
    edition: Edition,
    now: string,
  ): EligibilityReport {
    // Progress badge: requirements met iff all required activities are present.
    // Score floor does not apply. Issued locally on both static and dynamic editions.
    return {
      badge_id: spec.badge_id,
      version: spec.version,
      state: STATE_AWARDED,
      eligible: true,
      requirements,
      blocking_reasons: [],
      edition,
      awarded_at: now,
    }
  }
}
