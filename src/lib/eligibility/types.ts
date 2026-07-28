/**
 * Eligibility engine — TypeScript types.
 *
 * This file is the canonical type contract for the PyArcana eligibility
 * engine. The Python reference implementation in
 * `tests/adversarial/test_eligibility_engine.py` mirrors these types
 * exactly; both must produce identical outputs for the same inputs.
 *
 * See:
 *   - industry_alignment/credential_architecture.md
 *   - industry_alignment/eligibility_state_machine.md
 *   - industry_alignment/assessment_validity_report.md (Phase 7)
 *   - industry_alignment/badge_catalog.json (v1.0.0)
 */

// ---------------------------------------------------------------------------
// Badge states (per eligibility_state_machine.md)
// ---------------------------------------------------------------------------

export const STATE_LOCKED = 'locked' as const
export const STATE_AVAILABLE = 'available' as const
export const STATE_IN_PROGRESS = 'in_progress' as const
export const STATE_EVIDENCE_INCOMPLETE = 'evidence_incomplete' as const
export const STATE_ASSESSMENT_READY = 'assessment_ready' as const
export const STATE_ELIGIBLE_PENDING_VERIFICATION =
  'eligible_pending_verification' as const
export const STATE_AWARDED = 'awarded' as const

export type BadgeState =
  | typeof STATE_LOCKED
  | typeof STATE_AVAILABLE
  | typeof STATE_IN_PROGRESS
  | typeof STATE_EVIDENCE_INCOMPLETE
  | typeof STATE_ASSESSMENT_READY
  | typeof STATE_ELIGIBLE_PENDING_VERIFICATION
  | typeof STATE_AWARDED

// ---------------------------------------------------------------------------
// Editions
// ---------------------------------------------------------------------------

export const EDITION_STATIC = 'static' as const
export const EDITION_DYNAMIC = 'dynamic' as const

export type Edition = typeof EDITION_STATIC | typeof EDITION_DYNAMIC

// ---------------------------------------------------------------------------
// Evidence tiers (per assessment_validity_report.md §2)
// ---------------------------------------------------------------------------

export const TIER_THEORY = 1 as const
export const TIER_I_DO = 2 as const
export const TIER_WE_DO = 3 as const
export const TIER_YOU_DO = 4 as const
export const TIER_PROJECT = 5 as const
export const TIER_DEFENSE = 6 as const

export type EvidenceTier =
  | typeof TIER_THEORY
  | typeof TIER_I_DO
  | typeof TIER_WE_DO
  | typeof TIER_YOU_DO
  | typeof TIER_PROJECT
  | typeof TIER_DEFENSE

/** Tier minimums per credential type (per §5 of the assessment validity report). */
export const TIER_MIN_FOR_COMPETENCY = TIER_YOU_DO
export const TIER_MIN_FOR_CAPSTONE = TIER_DEFENSE

// ---------------------------------------------------------------------------
// Provisional floors (per credential_architecture.md §6)
// ---------------------------------------------------------------------------

export const PROVISIONAL_FLOORS = {
  self_check_pct: 85,
  you_do_pct: 80,
  section_exam_pct: 85,
  integrator_project_pct: 85,
  critical_competency_pct: 100,
  minimum_overall_pct: 85,
} as const

// ---------------------------------------------------------------------------
// Gap-affected competencies (per credential_architecture.md §5)
// ---------------------------------------------------------------------------

export const GAP_AFFECTED_COMPETENCIES: Record<string, boolean> = {
  sql_competency: true,
  leakage_prevention: true,
  selector_resilience: true,
  type_safety_production_hardening: true,
  mlops_fluency: false,
  business_framing_judgment: false,
  communication_audience_tuned: false,
  reproducibility_determinism: false,
}

// ---------------------------------------------------------------------------
// Learner progress inputs
// ---------------------------------------------------------------------------

export interface ActivityEvidence {
  /** Activity ID, e.g. `S06-YOUDO`, `S06-EXAM`, `S06-SELFCHECK`. */
  activity_id: string
  /** Evidence tier (1=theory … 6=defense). */
  evidence_tier: EvidenceTier
  /** Rubric score 0..100, or null for unscored activities (e.g. theory). */
  score_pct: number | null
  /** ISO-8601 timestamp; '' means unknown. */
  submitted_at?: string
  /** True if the score was server-graded (dynamic LMS). */
  server_verified?: boolean
  /** True if this evidence came from the legacy `python-ds-progress` localStorage. */
  legacy_only?: boolean
}

export interface CriticalCompetencyScore {
  competency_id: string
  /** Overall rubric score 0..100. */
  rubric_score_pct: number
  /** Per-criterion scores; every criterion must be 100 to pass. */
  criteria_scores?: number[]
}

export interface AwardedBadge {
  badge_id: string
  state: BadgeState
  awarded_at?: string
}

export interface LearnerProgress {
  learner_id: string
  awarded_badges: AwardedBadge[]
  activities: ActivityEvidence[]
  critical_competency_scores: CriticalCompetencyScore[]
  /** project_id -> rubric score 0..100. */
  project_results: Record<string, number>
}

// ---------------------------------------------------------------------------
// Badge spec
// ---------------------------------------------------------------------------

export type CredentialType =
  | 'local_achievement'
  | 'competency_badge'
  | 'verified_credential'

export type BadgeStatus = 'active' | 'pilot' | 'retired' | 'superseded'

export type VerificationMode = 'local_only' | 'server_verified'

export interface ComponentSpec {
  component_id: string
  required_score_pct: number
  weight: number
  critical_competency?: boolean
  evidence_source?: string
}

export interface BadgeSpec {
  badge_id: string
  version: string
  name: string
  credential_type: CredentialType
  family: string
  status: BadgeStatus
  verification_mode: VerificationMode
  prerequisite_badges: string[]
  required_sections: string[]
  required_activities: string[]
  required_projects: string[]
  critical_competencies: string[]
  components: ComponentSpec[]
  minimum_overall_score: number
  gap_affected_competencies: string[]
  newbie_friendly_description: string
}

// ---------------------------------------------------------------------------
// Engine output
// ---------------------------------------------------------------------------

export interface RequirementResult {
  requirement_id: string
  description: string
  passed: boolean
  score?: number | null
  floor?: number | null
  /** Newbie-friendly (Stephen Fry redacted) explanation. */
  blocking_reason?: string | null
}

export interface EligibilityReport {
  badge_id: string
  version: string
  state: BadgeState
  eligible: boolean
  requirements: RequirementResult[]
  /** Newbie-friendly (Stephen Fry redacted) blocking reasons. */
  blocking_reasons: string[]
  edition: Edition
  awarded_at?: string | null
}

// ---------------------------------------------------------------------------
// Engine interface
// ---------------------------------------------------------------------------

export interface EligibilityEngineInterface {
  evaluate(
    badge_id: string,
    progress: LearnerProgress,
    options?: {
      edition?: Edition
      now?: string
    },
  ): EligibilityReport

  awardIdempotent(
    badge_id: string,
    progress: LearnerProgress,
    options?: {
      edition?: Edition
      now?: string
    },
  ): { report: EligibilityReport; newly_awarded: boolean }
}
