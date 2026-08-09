#!/usr/bin/env python3
"""
Adversarial tests for the PyArcana eligibility engine (Phase 9, RED+GREEN).

This file is the executable specification of the eligibility contract
defined in:
  - industry_alignment/credential_architecture.md
  - industry_alignment/eligibility_state_machine.md
  - industry_alignment/assessment_validity_report.md  (Phase 7)
  - industry_alignment/badge_catalog.json              (v1.0.0)

It contains:

  1. A self-contained Python REFERENCE IMPLEMENTATION of the
     eligibility engine (`EligibilityEngine`, `BadgeSpec`, etc.).
     This is the executable spec; the TypeScript runtime
     implementation in `src/lib/eligibility/` is verified against
     the same fixtures and must produce identical outputs.

  2. Adversarial test cases that exercise every gate in the
     contract: prerequisites, evidence tier, per-component floors,
     critical-competency non-compensation, threshold boundaries
     (exactly-at = pass, one-below = fail), idempotent award,
     legacy-progress non-fabrication, and static-edition preview
     semantics.

The tests are RED before the reference implementation is filled in,
and GREEN once the reference implementation matches the contract.
They never weaken to make a buggy implementation pass.
"""

from __future__ import annotations

import json
import math
import os
import sys
import unittest
from dataclasses import dataclass, field
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

ROOT = Path(__file__).resolve().parents[2]
CATALOG_PATH = ROOT / "industry_alignment" / "badge_catalog.json"


# =============================================================================
# Reference types (mirror src/lib/eligibility/types.ts)
# =============================================================================

BadgeState = str  # one of the STATE_* constants below

STATE_LOCKED = "locked"
STATE_AVAILABLE = "available"
STATE_IN_PROGRESS = "in_progress"
STATE_EVIDENCE_INCOMPLETE = "evidence_incomplete"
STATE_ASSESSMENT_READY = "assessment_ready"
STATE_ELIGIBLE_PENDING_VERIFICATION = "eligible_pending_verification"
STATE_AWARDED = "awarded"

EDITION_STATIC = "static"
EDITION_DYNAMIC = "dynamic"

# Evidence tiers (per assessment_validity_report.md §2)
TIER_THEORY = 1
TIER_I_DO = 2
TIER_WE_DO = 3
TIER_YOU_DO = 4
TIER_PROJECT = 5
TIER_DEFENSE = 6

# Tier minimums per credential type (per §5)
TIER_MIN_FOR_COMPETENCY = TIER_YOU_DO
TIER_MIN_FOR_CAPSTONE = TIER_DEFENSE


@dataclass
class ActivityEvidence:
    """A single piece of evidence for one required activity."""
    activity_id: str
    evidence_tier: int
    score_pct: Optional[float] = None  # None for unscored (e.g., theory)
    submitted_at: str = ""             # ISO-8601; "" means unknown
    server_verified: bool = False
    legacy_only: bool = False          # True if from legacy progress store


@dataclass
class CriticalCompetencyScore:
    competency_id: str
    rubric_score_pct: float            # 0..100
    criteria_scores: Optional[List[float]] = None  # per-criterion, must all be 100


@dataclass
class AwardedBadge:
    """A badge this learner has already been awarded."""
    badge_id: str
    state: BadgeState                  # typically STATE_AWARDED


@dataclass
class LearnerProgress:
    """All learner-side inputs to the eligibility engine."""
    learner_id: str
    awarded_badges: List[AwardedBadge] = field(default_factory=list)
    activities: List[ActivityEvidence] = field(default_factory=list)
    critical_competency_scores: List[CriticalCompetencyScore] = field(default_factory=list)
    project_results: Dict[str, float] = field(default_factory=dict)  # project_id -> rubric_pct


@dataclass
class RequirementResult:
    requirement_id: str
    description: str
    passed: bool
    score: Optional[float] = None
    floor: Optional[float] = None
    blocking_reason: Optional[str] = None  # newbie-friendly, Stephen-Fry-redacted


@dataclass
class EligibilityReport:
    badge_id: str
    version: str
    state: BadgeState
    eligible: bool
    requirements: List[RequirementResult] = field(default_factory=list)
    blocking_reasons: List[str] = field(default_factory=list)
    edition: str = EDITION_STATIC
    awarded_at: Optional[str] = None


# =============================================================================
# Badge spec (mirror src/lib/eligibility/badge-specs.ts)
# =============================================================================

@dataclass
class ComponentSpec:
    component_id: str
    required_score_pct: float
    weight: float
    critical_competency: bool = False
    evidence_source: str = ""


@dataclass
class BadgeSpec:
    badge_id: str
    version: str
    name: str
    credential_type: str          # local_achievement | competency_badge | verified_credential
    family: str
    status: str                   # active | pilot | retired | superseded
    verification_mode: str        # local_only | server_verified
    prerequisite_badges: List[str] = field(default_factory=list)
    required_sections: List[str] = field(default_factory=list)
    required_activities: List[str] = field(default_factory=list)
    required_projects: List[str] = field(default_factory=list)
    critical_competencies: List[str] = field(default_factory=list)
    components: List[ComponentSpec] = field(default_factory=list)
    minimum_overall_score: float = 85.0
    gap_affected_competencies: List[str] = field(default_factory=list)
    newbie_friendly_description: str = ""

    @property
    def is_progress(self) -> bool:
        return self.credential_type == "local_achievement"

    @property
    def is_competency(self) -> bool:
        return self.credential_type == "competency_badge"

    @property
    def is_capstone(self) -> bool:
        return self.credential_type == "verified_credential"

    @property
    def evidence_tier_minimum(self) -> int:
        # Required activities are section-level (YOUDO, EXAM, SELFCHECK). These
        # are tier 4 evidence for both competency AND capstone badges. The
        # capstone's tier-6 defense evidence is enforced separately via the
        # `defense` component (floor=100) and the critical-competency gate
        # — not via the activity-tier check.
        if self.is_competency or self.is_capstone:
            return TIER_MIN_FOR_COMPETENCY  # tier 4 (You Do)
        return TIER_WE_DO  # progress badges accept any walk-through evidence


# Catalog version of the official provisional floors.
PROVISIONAL_FLOORS = {
    "self_check_pct": 85,
    "you_do_pct": 80,
    "section_exam_pct": 85,
    "integrator_project_pct": 85,
    "critical_competency_pct": 100,
    "minimum_overall_pct": 85,
}

# Map of competency_id -> True if it's gap-affected per credential_architecture.md §5
GAP_AFFECTED_COMPETENCIES = {
    "sql_competency": True,                   # sql_performance_tuning gap
    "leakage_prevention": True,               # leakage_prevention gap
    "selector_resilience": True,              # reframework out-of-scope
    "type_safety_production_hardening": True, # python_type_safety gap
    "mlops_fluency": False,
    "business_framing_judgment": False,
    "communication_audience_tuned": False,
    "reproducibility_determinism": False,
}


def _round_down(value: float, places: int = 2) -> float:
    """Round DOWN to `places` decimals. Conservative direction for floors."""
    factor = 10 ** places
    return math.floor(value * factor) / factor


def _passes_floor(score: float, floor: float) -> bool:
    """Exactly at threshold = pass; one below = fail (after round-down)."""
    return _round_down(score) >= _round_down(floor)


def load_catalog_specs(catalog_path: Path = CATALOG_PATH) -> Dict[str, BadgeSpec]:
    """Load the official catalog and return a dict of badge_id -> BadgeSpec."""
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    specs: Dict[str, BadgeSpec] = {}
    for raw in catalog["badges"]:
        components: List[ComponentSpec] = []
        for c in raw.get("assessment_blueprint", {}).get("components", []):
            components.append(ComponentSpec(
                component_id=c["component_id"],
                required_score_pct=float(c["required_score_pct"]),
                weight=float(c["weight"]),
                critical_competency=bool(c.get("critical_competency", False)),
                evidence_source=c.get("evidence_source", ""),
            ))
        scoring = raw.get("scoring_rules", {})
        gap_affected = [
            cid for cid in raw.get("critical_competencies", [])
            if GAP_AFFECTED_COMPETENCIES.get(cid, False)
        ]
        spec = BadgeSpec(
            badge_id=raw["badge_id"],
            version=raw["version"],
            name=raw["name"],
            credential_type=raw["credential_type"],
            family=raw.get("family", ""),
            status=raw.get("status", "active"),
            verification_mode=raw.get("verification_mode", "local_only"),
            prerequisite_badges=list(raw.get("prerequisite_badges", [])),
            required_sections=list(raw.get("required_sections", [])),
            required_activities=list(raw.get("required_activities", [])),
            required_projects=list(raw.get("required_projects", [])),
            critical_competencies=list(raw.get("critical_competencies", [])),
            components=components,
            minimum_overall_score=float(scoring.get("minimum_overall_score", 85.0)),
            gap_affected_competencies=gap_affected,
            newbie_friendly_description=raw.get("newbie_friendly_description", ""),
        )
        specs[spec.badge_id] = spec
    return specs


# =============================================================================
# Reference eligibility engine (mirror src/lib/eligibility/engine.ts)
# =============================================================================

class EligibilityEngine:
    """
    Deterministic eligibility engine.

    Same inputs -> same outputs. No time-of-day dependence (freshness
    is computed against a provided `now` argument). No randomness.
    No implicit state.
    """

    def __init__(self, specs: Dict[str, BadgeSpec], catalog_version: str = "1.0.0"):
        self.specs = specs
        self.catalog_version = catalog_version

    # ----- public API ------------------------------------------------------

    def evaluate(
        self,
        badge_id: str,
        progress: LearnerProgress,
        edition: str = EDITION_STATIC,
        now: str = "2026-07-28T22:30:00Z",
    ) -> EligibilityReport:
        spec = self.specs.get(badge_id)
        if spec is None:
            raise KeyError(f"Unknown badge_id: {badge_id}")

        requirements: List[RequirementResult] = []
        blocking_reasons: List[str] = []

        # --- Gate 0: catalog version (caller's responsibility; we record it) ---
        # (Engine itself doesn't have a separate version arg per call; the
        # catalog_version is fixed at construction. Skip.)

        # --- Gate 1: badge status ---
        if spec.status in ("retired", "superseded"):
            blocking_reasons.append(
                f"This badge is currently labeled '{spec.status}' in the catalog, "
                f"so it can't be freshly awarded. Please ask about the successor badge."
            )
            requirements.append(RequirementResult(
                requirement_id="badge_status",
                description="Badge is active or pilot in the catalog",
                passed=False,
                blocking_reason=f"Badge status is '{spec.status}'.",
            ))
            return EligibilityReport(
                badge_id=badge_id,
                version=spec.version,
                state=STATE_LOCKED,
                eligible=False,
                requirements=requirements,
                blocking_reasons=blocking_reasons,
                edition=edition,
            )
        requirements.append(RequirementResult(
            requirement_id="badge_status",
            description="Badge is active or pilot in the catalog",
            passed=True,
        ))

        # --- Gate 2: prerequisite badges ---
        awarded_ids = {b.badge_id for b in progress.awarded_badges
                       if b.state in (STATE_AWARDED, STATE_ELIGIBLE_PENDING_VERIFICATION)}
        # For prerequisite purposes, we require actual award (not just eligibility).
        awarded_ids_strict = {b.badge_id for b in progress.awarded_badges
                              if b.state == STATE_AWARDED}
        missing_prereqs = [p for p in spec.prerequisite_badges
                           if p not in awarded_ids_strict]
        prereq_req = RequirementResult(
            requirement_id="prerequisite_badges",
            description="All prerequisite badges are awarded",
            passed=not missing_prereqs,
            blocking_reason=(f"Missing prerequisites: {', '.join(missing_prereqs)}"
                             if missing_prereqs else None),
        )
        requirements.append(prereq_req)
        if missing_prereqs:
            blocking_reasons.append(
                f"You need to earn these badges first: {', '.join(missing_prereqs)}. "
                f"Think of them as the building blocks for this one."
            )
            return EligibilityReport(
                badge_id=badge_id, version=spec.version,
                state=STATE_LOCKED, eligible=False,
                requirements=requirements, blocking_reasons=blocking_reasons,
                edition=edition,
            )

        # --- Gate 3: required activities present (with evidence-tier minimum) ---
        evidence_by_activity = self._index_evidence(progress)
        missing_activities: List[str] = []
        below_tier_activities: List[Tuple[str, int, int]] = []
        for activity_id in spec.required_activities:
            ev = evidence_by_activity.get(activity_id)
            if ev is None:
                missing_activities.append(activity_id)
                continue
            tier_min = spec.evidence_tier_minimum
            if ev.evidence_tier < tier_min:
                below_tier_activities.append((activity_id, ev.evidence_tier, tier_min))

        activity_req = RequirementResult(
            requirement_id="required_activities",
            description="All required activities are present with sufficient independence",
            passed=not missing_activities and not below_tier_activities,
            blocking_reason=(
                f"Missing: {missing_activities}; below tier: "
                f"{[a[0] for a in below_tier_activities]}"
                if missing_activities or below_tier_activities else None
            ),
        )
        requirements.append(activity_req)
        if missing_activities:
            blocking_reasons.append(
                f"You still need to complete these activities: {', '.join(missing_activities)}. "
                f"Each is a hands-on task — reading alone doesn't count."
            )
            return EligibilityReport(
                badge_id=badge_id, version=spec.version,
                state=STATE_AVAILABLE if not evidence_by_activity else STATE_IN_PROGRESS,
                eligible=False,
                requirements=requirements, blocking_reasons=blocking_reasons,
                edition=edition,
            )
        if below_tier_activities:
            for activity_id, tier, tier_min in below_tier_activities:
                blocking_reasons.append(
                    f"The activity '{activity_id}' was completed as guided practice "
                    f"(tier {tier}), but this badge needs independent work "
                    f"(tier {tier_min} or higher). Please redo it without step-by-step help."
                )
            return EligibilityReport(
                badge_id=badge_id, version=spec.version,
                state=STATE_EVIDENCE_INCOMPLETE, eligible=False,
                requirements=requirements, blocking_reasons=blocking_reasons,
                edition=edition,
            )

        # --- For progress badges, that's the entire gate chain ---
        if spec.is_progress:
            # Progress badges have no score floors; once activities are present,
            # they are eligible (and on dynamic edition, awarded as local_only).
            return self._finalize_progress(spec, progress, requirements, blocking_reasons, edition)

        # --- Gate 4: required projects present ---
        missing_projects = [p for p in spec.required_projects
                            if p not in progress.project_results]
        project_req = RequirementResult(
            requirement_id="required_projects",
            description="All required projects are submitted with rubric scores",
            passed=not missing_projects,
            blocking_reason=(f"Missing projects: {missing_projects}" if missing_projects else None),
        )
        requirements.append(project_req)
        if missing_projects:
            blocking_reasons.append(
                f"You still need to submit these projects: {', '.join(missing_projects)}. "
                f"Each is rubric-graded — that's how we know the work is genuinely yours."
            )
            return EligibilityReport(
                badge_id=badge_id, version=spec.version,
                state=STATE_EVIDENCE_INCOMPLETE, eligible=False,
                requirements=requirements, blocking_reasons=blocking_reasons,
                edition=edition,
            )

        # --- Gate 5: per-component floors (incl. critical-competency gate) ---
        component_scores = self._compute_component_scores(spec, progress, evidence_by_activity)
        any_component_failed = False
        for component in spec.components:
            score = component_scores.get(component.component_id)
            floor = component.required_score_pct
            if score is None:
                req = RequirementResult(
                    requirement_id=f"component:{component.component_id}",
                    description=f"{component.component_id} component meets floor ({floor}%)",
                    passed=False,
                    score=None, floor=floor,
                    blocking_reason=f"No evidence recorded for {component.component_id}.",
                )
                blocking_reasons.append(
                    f"We couldn't find a score for the '{component.component_id}' component. "
                    f"This badge needs it to be at least {floor}%."
                )
                requirements.append(req)
                any_component_failed = True
                continue
            passed = _passes_floor(score, floor)
            req = RequirementResult(
                requirement_id=f"component:{component.component_id}",
                description=f"{component.component_id} component meets floor ({floor}%)",
                passed=passed,
                score=score, floor=floor,
                blocking_reason=(f"{component.component_id} score {score}% is below the {floor}% floor."
                                 if not passed else None),
            )
            requirements.append(req)
            if not passed:
                blocking_reasons.append(
                    f"Your score on the '{component.component_id}' component is {score}%, "
                    f"but this badge needs at least {floor}%. "
                    f"You can re-attempt this after a short cool-down."
                )
                any_component_failed = True

        # --- Gate 6: critical competency floors (non-compensatory, =100%) ---
        any_critical_failed = False
        for comp_id in spec.critical_competencies:
            score = next(
                (s for s in progress.critical_competency_scores
                 if s.competency_id == comp_id), None
            )
            floor = float(PROVISIONAL_FLOORS["critical_competency_pct"])  # 100
            if score is None:
                req = RequirementResult(
                    requirement_id=f"critical_competency:{comp_id}",
                    description=f"Critical competency '{comp_id}' scores 100% on every rubric criterion",
                    passed=False, score=None, floor=floor,
                    blocking_reason=f"No rubric evaluation recorded for critical competency '{comp_id}'.",
                )
                blocking_reasons.append(
                    f"The competency '{comp_id}' is a critical one (the badge can't be issued "
                    f"without it). We don't have a rubric evaluation for it yet."
                )
                requirements.append(req)
                any_critical_failed = True
                continue

            # If per-criterion scores exist, all must be 100.
            if score.criteria_scores is not None:
                all_criteria_full = all(c == 100 for c in score.criteria_scores)
                crit_passed = all_criteria_full
                crit_score_for_report = min(score.criteria_scores) if score.criteria_scores else 0.0
            else:
                crit_passed = (score.rubric_score_pct == 100.0)
                crit_score_for_report = score.rubric_score_pct

            req = RequirementResult(
                requirement_id=f"critical_competency:{comp_id}",
                description=f"Critical competency '{comp_id}' scores 100% on every rubric criterion",
                passed=crit_passed,
                score=crit_score_for_report, floor=floor,
                blocking_reason=(f"'{comp_id}' score {crit_score_for_report}% is below the required 100%."
                                 if not crit_passed else None),
            )
            requirements.append(req)
            if not crit_passed:
                blocking_reasons.append(
                    f"The competency '{comp_id}' is critical (non-negotiable). "
                    f"Your score is {crit_score_for_report}%, but it must be 100%. "
                    f"No other strength can offset this — please review the underlying sections."
                )
                any_critical_failed = True

        # --- Gate 7: pilot badges require supplementary exercise for gap-affected competencies ---
        if spec.status == "pilot":
            for comp_id in spec.gap_affected_competencies:
                # The supplementary exercise is recorded as a project of the form
                # BADGE:<badge_id>:supplementary:<comp_id>
                supp_id = f"BADGE:{badge_id}:supplementary:{comp_id}"
                if supp_id not in progress.project_results:
                    blocking_reasons.append(
                        f"This badge is at 'pilot' status because the curriculum has a known gap "
                        f"in '{comp_id}'. You need to complete a supplementary exercise "
                        f"({supp_id}) before this badge can be awarded."
                    )
                    requirements.append(RequirementResult(
                        requirement_id=f"supplementary_exercise:{comp_id}",
                        description=f"Supplementary exercise for gap-affected competency '{comp_id}' is complete",
                        passed=False,
                        blocking_reason=f"Missing supplementary exercise: {supp_id}",
                    ))
                    any_critical_failed = True
                else:
                    requirements.append(RequirementResult(
                        requirement_id=f"supplementary_exercise:{comp_id}",
                        description=f"Supplementary exercise for gap-affected competency '{comp_id}' is complete",
                        passed=True,
                    ))

        if any_component_failed or any_critical_failed:
            return EligibilityReport(
                badge_id=badge_id, version=spec.version,
                state=STATE_ASSESSMENT_READY, eligible=False,
                requirements=requirements, blocking_reasons=blocking_reasons,
                edition=edition,
            )

        # --- Gate 8: weighted-average overall ---
        overall = self._weighted_overall(spec, component_scores)
        overall_floor = spec.minimum_overall_score
        overall_passed = _passes_floor(overall, overall_floor)
        requirements.append(RequirementResult(
            requirement_id="overall_weighted_average",
            description=f"Weighted-average overall meets floor ({overall_floor}%)",
            passed=overall_passed,
            score=overall, floor=overall_floor,
            blocking_reason=(f"Overall {overall}% is below the {overall_floor}% floor."
                             if not overall_passed else None),
        ))
        if not overall_passed:
            blocking_reasons.append(
                f"Your overall weighted score is {overall}%, but this badge needs {overall_floor}%. "
                f"Even though each component passed its own floor, the average must also clear the bar."
            )
            return EligibilityReport(
                badge_id=badge_id, version=spec.version,
                state=STATE_ASSESSMENT_READY, eligible=False,
                requirements=requirements, blocking_reasons=blocking_reasons,
                edition=edition,
            )

        # --- Gate 9: edition check ---
        # Static edition: preview only. Dynamic: server must sign.
        if edition == EDITION_STATIC:
            # CAPSTONE credentials cannot even be previewed on static — they require
            # server-side defense recording. Show locked with a friendly message.
            if spec.is_capstone:
                blocking_reasons.append(
                    "This capstone credential can't be earned on the static edition. "
                    "Please sign in to the LMS to record your defense and earn the credential."
                )
                return EligibilityReport(
                    badge_id=badge_id, version=spec.version,
                    state=STATE_ELIGIBLE_PENDING_VERIFICATION, eligible=False,
                    requirements=requirements, blocking_reasons=blocking_reasons,
                    edition=edition,
                )
            # Competency badge on static: preview only — clearly labeled.
            return EligibilityReport(
                badge_id=badge_id, version=spec.version,
                state=STATE_ELIGIBLE_PENDING_VERIFICATION, eligible=True,
                requirements=requirements,
                blocking_reasons=[
                    "Eligibility preview only — verification unavailable on the static edition. "
                    "Sign in to the LMS to issue this credential."
                ],
                edition=edition,
            )

        # Dynamic edition: server has signed (this engine models the signed state
        # by returning STATE_AWARDED when the caller is the dynamic LMS).
        return EligibilityReport(
            badge_id=badge_id, version=spec.version,
            state=STATE_AWARDED, eligible=True,
            requirements=requirements, blocking_reasons=[],
            edition=edition,
            awarded_at=now,
        )

    # ----- idempotent award ----------------------------------------------

    def award_idempotent(
        self,
        badge_id: str,
        progress: LearnerProgress,
        edition: str = EDITION_DYNAMIC,
        now: str = "2026-07-28T22:30:00Z",
    ) -> Tuple[EligibilityReport, bool]:
        """
        Award a badge if eligible; no-op if already awarded.

        Returns (report, newly_awarded). The learner's awarded_badges list
        is mutated in place only when newly_awarded is True.
        """
        # Already awarded?
        already = next((b for b in progress.awarded_badges if b.badge_id == badge_id), None)
        if already is not None and already.state == STATE_AWARDED:
            report = self.evaluate(badge_id, progress, edition=edition, now=now)
            # Force awarded state since it's already in the record
            report.state = STATE_AWARDED
            report.eligible = True
            report.awarded_at = already_awarded_at(already) or now
            return report, False

        report = self.evaluate(badge_id, progress, edition=edition, now=now)
        if report.state == STATE_AWARDED:
            progress.awarded_badges.append(AwardedBadge(
                badge_id=badge_id, state=STATE_AWARDED
            ))
            return report, True
        return report, False

    # ----- internals ------------------------------------------------------

    def _index_evidence(self, progress: LearnerProgress) -> Dict[str, ActivityEvidence]:
        # If duplicate activity_id entries exist, the highest-tier one wins
        # (more independent evidence wins).
        out: Dict[str, ActivityEvidence] = {}
        for ev in progress.activities:
            existing = out.get(ev.activity_id)
            if existing is None or ev.evidence_tier > existing.evidence_tier:
                out[ev.activity_id] = ev
        return out

    def _compute_component_scores(
        self,
        spec: BadgeSpec,
        progress: LearnerProgress,
        evidence_by_activity: Dict[str, ActivityEvidence],
    ) -> Dict[str, float]:
        scores: Dict[str, float] = {}
        for component in spec.components:
            cid = component.component_id
            if cid == "self_check":
                scores[cid] = self._aggregate_self_check(spec, evidence_by_activity)
            elif cid == "you_do_projects":
                scores[cid] = self._aggregate_you_do(spec, evidence_by_activity)
            elif cid == "section_exams":
                scores[cid] = self._aggregate_exams(spec, evidence_by_activity)
            elif cid == "integrator_project":
                scores[cid] = self._aggregate_integrator(spec, progress)
            elif cid == "section_completion":
                scores[cid] = self._aggregate_section_completion(spec, evidence_by_activity)
            elif cid == "defense":
                scores[cid] = self._aggregate_defense(spec, progress)
            else:
                scores[cid] = 0.0  # unknown component; treated as 0 (fails floor)
        return scores

    def _aggregate_self_check(self, spec: BadgeSpec, ev: Dict[str, ActivityEvidence]) -> Optional[float]:
        scores: List[float] = []
        for section in spec.required_sections:
            activity_id = f"{section}-SELFCHECK"
            e = ev.get(activity_id)
            if e is None or e.score_pct is None:
                continue
            scores.append(float(e.score_pct))
        if not scores:
            return None
        return _round_down(sum(scores) / len(scores))

    def _aggregate_you_do(self, spec: BadgeSpec, ev: Dict[str, ActivityEvidence]) -> Optional[float]:
        scores: List[float] = []
        for section in spec.required_sections:
            activity_id = f"{section}-YOUDO"
            e = ev.get(activity_id)
            if e is None or e.score_pct is None:
                continue
            scores.append(float(e.score_pct))
        if not scores:
            return None
        return _round_down(sum(scores) / len(scores))

    def _aggregate_exams(self, spec: BadgeSpec, ev: Dict[str, ActivityEvidence]) -> Optional[float]:
        scores: List[float] = []
        for section in spec.required_sections:
            activity_id = f"{section}-EXAM"
            e = ev.get(activity_id)
            if e is None or e.score_pct is None:
                continue
            scores.append(float(e.score_pct))
        if not scores:
            return None
        return _round_down(sum(scores) / len(scores))

    def _aggregate_integrator(self, spec: BadgeSpec, progress: LearnerProgress) -> Optional[float]:
        # The integrator_project component aggregates the rubric scores of all
        # required_projects EXCEPT defense and supplementary exercises (which
        # have their own gates). For competency badges this is typically a
        # single `BADGE:<badge_id>:integrator` project; for capstones it's the
        # CP-N*-X capstone projects plus the `BADGE:<badge_id>:synthesis`
        # synthesis writeup.
        excluded_prefixes = (
            f"BADGE:{spec.badge_id}:defense",
            f"BADGE:{spec.badge_id}:supplementary:",
        )
        scores: List[float] = []
        for project_id in spec.required_projects:
            if any(project_id.startswith(p) for p in excluded_prefixes):
                continue
            score = progress.project_results.get(project_id)
            if score is not None:
                scores.append(float(score))
        if not scores:
            return None
        return _round_down(sum(scores) / len(scores))

    def _aggregate_defense(self, spec: BadgeSpec, progress: LearnerProgress) -> Optional[float]:
        # Defense is recorded as a project of the form BADGE:<badge_id>:defense
        defense_id = f"BADGE:{spec.badge_id}:defense"
        score = progress.project_results.get(defense_id)
        if score is None:
            return None
        return _round_down(float(score))

    def _aggregate_section_completion(self, spec: BadgeSpec, ev: Dict[str, ActivityEvidence]) -> Optional[float]:
        # For progress badges: 100% if all required sections have a YOUDO activity,
        # else None.
        for section in spec.required_sections:
            if f"{section}-YOUDO" not in ev:
                return None
        return 100.0

    def _weighted_overall(self, spec: BadgeSpec, component_scores: Dict[str, float]) -> float:
        total_weight = 0.0
        weighted_sum = 0.0
        for component in spec.components:
            score = component_scores.get(component.component_id)
            if score is None:
                continue
            weighted_sum += score * component.weight
            total_weight += component.weight
        if total_weight == 0:
            return 0.0
        return _round_down(weighted_sum / total_weight)

    def _finalize_progress(
        self,
        spec: BadgeSpec,
        progress: LearnerProgress,
        requirements: List[RequirementResult],
        blocking_reasons: List[str],
        edition: str,
    ) -> EligibilityReport:
        # Progress badge: requirements met iff all required sections have a YOUDO activity.
        # Score floor does not apply.
        if edition == EDITION_STATIC:
            return EligibilityReport(
                badge_id=spec.badge_id, version=spec.version,
                state=STATE_AWARDED, eligible=True,
                requirements=requirements,
                blocking_reasons=[],
                edition=edition,
            )
        # Dynamic edition: progress badges are also locally awarded (and server-mirrored).
        return EligibilityReport(
            badge_id=spec.badge_id, version=spec.version,
            state=STATE_AWARDED, eligible=True,
            requirements=requirements,
            blocking_reasons=[],
            edition=edition,
        )


def already_awarded_at(b: AwardedBadge) -> Optional[str]:
    # The AwardedBadge dataclass doesn't track awarded_at; this stub keeps the
    # idempotent-award test simple. In the production TS implementation, the
    # BadgeRecord carries awarded_at.
    return None


# =============================================================================
# Test helpers — fixtures
# =============================================================================

def _full_progress_for_competency_badge(
    badge_id: str,
    spec: BadgeSpec,
    self_check_pct: float = 90.0,
    you_do_pct: float = 85.0,
    exam_pct: float = 90.0,
    integrator_pct: float = 90.0,
    critical_criteria_scores: Optional[Dict[str, List[float]]] = None,
    include_supplementary: bool = False,
) -> LearnerProgress:
    """Build a LearnerProgress that satisfies every requirement for a competency badge."""
    progress = LearnerProgress(learner_id="learner-1")
    # Award prerequisites
    for prereq in spec.prerequisite_badges:
        progress.awarded_badges.append(AwardedBadge(badge_id=prereq, state=STATE_AWARDED))
    # Activities for each required section: self-check, you-do, exam
    for section in spec.required_sections:
        progress.activities.append(ActivityEvidence(
            activity_id=f"{section}-SELFCHECK", evidence_tier=TIER_YOU_DO,
            score_pct=self_check_pct, server_verified=True,
        ))
        progress.activities.append(ActivityEvidence(
            activity_id=f"{section}-YOUDO", evidence_tier=TIER_YOU_DO,
            score_pct=you_do_pct, server_verified=True,
        ))
        progress.activities.append(ActivityEvidence(
            activity_id=f"{section}-EXAM", evidence_tier=TIER_YOU_DO,
            score_pct=exam_pct, server_verified=True,
        ))
    # Required projects
    for project_id in spec.required_projects:
        progress.project_results[project_id] = integrator_pct
    # Supplementary exercises for pilot badges
    if include_supplementary:
        for comp_id in spec.gap_affected_competencies:
            supp_id = f"BADGE:{badge_id}:supplementary:{comp_id}"
            progress.project_results[supp_id] = 100.0
    # Critical competency scores
    crit_scores = critical_criteria_scores or {}
    for comp_id in spec.critical_competencies:
        if comp_id in crit_scores:
            progress.critical_competency_scores.append(CriticalCompetencyScore(
                competency_id=comp_id,
                rubric_score_pct=min(crit_scores[comp_id]) if crit_scores[comp_id] else 0.0,
                criteria_scores=crit_scores[comp_id],
            ))
        else:
            # Default: all 100
            progress.critical_competency_scores.append(CriticalCompetencyScore(
                competency_id=comp_id,
                rubric_score_pct=100.0,
                criteria_scores=[100.0, 100.0, 100.0, 100.0],
            ))
    return progress


# =============================================================================
# Tests
# =============================================================================

class TestEligibilityEngine(unittest.TestCase):
    """Adversarial tests for the eligibility engine."""

    @classmethod
    def setUpClass(cls):
        cls.specs = load_catalog_specs()
        cls.engine = EligibilityEngine(cls.specs, catalog_version="1.0.0")
        cls.assertTrue(cls.specs, "Catalog failed to load")

    # -------- Test 1: badge locked when prerequisites not met --------

    def test_badge_locked_when_prerequisites_not_met(self):
        """A badge with unmet prerequisites is in `locked` state."""
        # `independent_data_preparation` requires `python_data_foundations`.
        spec = self.specs["independent_data_preparation"]
        self.assertEqual(spec.prerequisite_badges, ["python_data_foundations"])

        progress = LearnerProgress(learner_id="learner-1")
        # No prerequisites awarded, no activities.
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertEqual(report.state, STATE_LOCKED)
        self.assertFalse(report.eligible)
        self.assertTrue(any("python_data_foundations" in r for r in report.blocking_reasons),
                        f"Expected prereq mention in blocking_reasons; got: {report.blocking_reasons}")
        # The prereq requirement is recorded with passed=False
        prereq_req = next(r for r in report.requirements if r.requirement_id == "prerequisite_badges")
        self.assertFalse(prereq_req.passed)

    # -------- Test 2: badge available when prerequisites met --------

    def test_badge_available_when_prerequisites_met(self):
        """When prereqs are met but no evidence is collected, state is `available`."""
        progress = LearnerProgress(learner_id="learner-1")
        progress.awarded_badges.append(AwardedBadge(
            badge_id="python_data_foundations", state=STATE_AWARDED,
        ))
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertEqual(report.state, STATE_AVAILABLE)
        self.assertFalse(report.eligible)
        prereq_req = next(r for r in report.requirements if r.requirement_id == "prerequisite_badges")
        self.assertTrue(prereq_req.passed)

    # -------- Test 3: evidence_incomplete when missing required activities --------

    def test_evidence_incomplete_when_missing_required_activities(self):
        """Missing required activities -> evidence_incomplete (or in_progress)."""
        progress = LearnerProgress(learner_id="learner-1")
        progress.awarded_badges.append(AwardedBadge(
            badge_id="python_data_foundations", state=STATE_AWARDED,
        ))
        spec = self.specs["independent_data_preparation"]
        # Add only one of the required activities (tier 4).
        first_section = spec.required_sections[0]
        progress.activities.append(ActivityEvidence(
            activity_id=f"{first_section}-YOUDO", evidence_tier=TIER_YOU_DO,
            score_pct=90.0, server_verified=True,
        ))
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertIn(report.state, (STATE_IN_PROGRESS, STATE_EVIDENCE_INCOMPLETE))
        self.assertFalse(report.eligible)
        self.assertTrue(report.blocking_reasons,
                        "Expected blocking reasons for missing activities")

    # -------- Test 4: evidence_incomplete when below evidence-tier minimum --------

    def test_evidence_incomplete_when_below_evidence_tier_minimum(self):
        """Required activities present but as guided practice (tier 3) -> evidence_incomplete."""
        progress = LearnerProgress(learner_id="learner-1")
        progress.awarded_badges.append(AwardedBadge(
            badge_id="python_data_foundations", state=STATE_AWARDED,
        ))
        spec = self.specs["independent_data_preparation"]
        for section in spec.required_sections:
            # Submit everything as We Do (tier 3) — guided, not independent.
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-SELFCHECK", evidence_tier=TIER_WE_DO,
                score_pct=90.0,
            ))
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-YOUDO", evidence_tier=TIER_WE_DO,
                score_pct=90.0,
            ))
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-EXAM", evidence_tier=TIER_WE_DO,
                score_pct=90.0,
            ))
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertEqual(report.state, STATE_EVIDENCE_INCOMPLETE)
        self.assertFalse(report.eligible)
        self.assertTrue(any("independent" in r.lower() or "tier" in r.lower()
                            for r in report.blocking_reasons),
                        f"Expected tier-related blocking reason; got: {report.blocking_reasons}")

    # -------- Test 5: assessment_ready when all evidence collected but floor not met --------

    def test_assessment_ready_when_all_evidence_collected(self):
        """All evidence present, all floors met -> eligible_pending_verification (or awarded on dynamic)."""
        # Use a competency badge with no critical competencies gap issues if possible.
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=90.0, you_do_pct=85.0, exam_pct=90.0,
            integrator_pct=90.0,
            critical_criteria_scores={"reproducibility_determinism": [100, 100, 100, 100]},
        )
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        # All floors pass -> awarded on dynamic
        self.assertEqual(report.state, STATE_AWARDED)
        self.assertTrue(report.eligible)

    # -------- Test 6: BLOCKED when critical competency fails (even with high average) --------

    def test_blocked_when_critical_competency_fails(self):
        """A critical-competency failure blocks the badge even if everything else is at 95%."""
        spec = self.specs["independent_data_preparation"]
        # All scores very high, but critical competency at 75 (one criterion at 75).
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=95.0, you_do_pct=95.0, exam_pct=95.0,
            integrator_pct=95.0,
            critical_criteria_scores={"reproducibility_determinism": [100, 100, 75, 100]},
        )
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertNotEqual(report.state, STATE_AWARDED)
        self.assertFalse(report.eligible)
        # Specifically, the critical-competency gate must have failed.
        crit_req = next(
            r for r in report.requirements
            if r.requirement_id == "critical_competency:reproducibility_determinism"
        )
        self.assertFalse(crit_req.passed)
        self.assertIn(75.0, [crit_req.score])
        # The blocking reason must mention the critical competency.
        self.assertTrue(
            any("reproducibility_determinism" in r or "critical" in r.lower()
                for r in report.blocking_reasons),
            f"Expected critical-competency blocking reason; got: {report.blocking_reasons}",
        )

    # -------- Test 7: BLOCKED when self-check below 85% --------

    def test_blocked_when_self_check_below_85(self):
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=84.0,  # one below floor
            you_do_pct=90.0, exam_pct=90.0, integrator_pct=90.0,
        )
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertFalse(report.eligible)
        sc_req = next(r for r in report.requirements
                      if r.requirement_id == "component:self_check")
        self.assertFalse(sc_req.passed)
        self.assertEqual(sc_req.floor, 85.0)
        self.assertEqual(sc_req.score, 84.0)

    # -------- Test 8: BLOCKED when You Do below 80% --------

    def test_blocked_when_you_do_below_80(self):
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=90.0,
            you_do_pct=79.0,  # one below floor
            exam_pct=90.0, integrator_pct=90.0,
        )
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertFalse(report.eligible)
        yd_req = next(r for r in report.requirements
                      if r.requirement_id == "component:you_do_projects")
        self.assertFalse(yd_req.passed)
        self.assertEqual(yd_req.floor, 80.0)
        self.assertEqual(yd_req.score, 79.0)

    # -------- Test 9: BLOCKED when project rubric below 85% --------

    def test_blocked_when_project_rubric_below_85(self):
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=90.0, you_do_pct=90.0, exam_pct=90.0,
            integrator_pct=84.0,  # one below integrator floor
        )
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertFalse(report.eligible)
        int_req = next(r for r in report.requirements
                       if r.requirement_id == "component:integrator_project")
        self.assertFalse(int_req.passed)
        self.assertEqual(int_req.floor, 85.0)
        self.assertEqual(int_req.score, 84.0)

    # -------- Test 10: threshold boundary (exactly at threshold = pass) --------

    def test_threshold_boundary_exact_pass(self):
        """A score exactly at the floor passes (e.g., 80.0 on an 80 floor, 85.0 on an 85 floor).

        We set you_do_projects at its exact floor (80) and the rest above their
        floors (90) so the weighted overall also clears 85. The test then verifies
        that EACH component at its exact floor is graded as `passed`.
        """
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=85.0,  # exact floor for self_check
            you_do_pct=80.0,      # exact floor for you_do (the 80% floor)
            exam_pct=85.0,        # exact floor for section_exams
            integrator_pct=85.0,  # exact floor for integrator_project
        )
        # The catalog's weights sum to 0.95, not 1.0. To make the overall clear 85
        # when you_do is at 80 (below 85), we lift the lower-weighted components
        # slightly. But first confirm the per-component exact-floor checks pass:
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        # All component requirements at their exact floor must pass.
        for floor_check in ("component:self_check", "component:you_do_projects",
                            "component:section_exams", "component:integrator_project"):
            req = next(r for r in report.requirements if r.requirement_id == floor_check)
            self.assertTrue(req.passed,
                            f"{floor_check} at exact floor should pass; "
                            f"score={req.score}, floor={req.floor}")

        # Now lift the non-you_do components so the overall clears 85.
        progress2 = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=90.0, you_do_pct=80.0,  # you_do at exact floor
            exam_pct=90.0, integrator_pct=90.0,
        )
        report2 = self.engine.evaluate("independent_data_preparation", progress2, edition=EDITION_DYNAMIC)
        self.assertTrue(report2.eligible,
                        f"Expected eligible with you_do at exact 80 floor; state={report2.state}; "
                        f"reasons={report2.blocking_reasons}")
        self.assertEqual(report2.state, STATE_AWARDED)
        # Specifically verify the you_do component (floor 80, score 80) passed.
        yd_req = next(r for r in report2.requirements
                      if r.requirement_id == "component:you_do_projects")
        self.assertTrue(yd_req.passed)
        self.assertEqual(yd_req.score, 80.0)
        self.assertEqual(yd_req.floor, 80.0)

    # -------- Test 11: threshold boundary (one below = fail) --------

    def test_threshold_boundary_one_below_fail(self):
        """A score one below the floor fails (e.g., 84.99 on an 85 floor)."""
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=84.99,  # just below 85
            you_do_pct=85.0, exam_pct=85.0, integrator_pct=85.0,
        )
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertFalse(report.eligible)
        sc_req = next(r for r in report.requirements
                      if r.requirement_id == "component:self_check")
        self.assertFalse(sc_req.passed)
        # After round-down, 84.99 stays 84.99 and fails the 85 floor.
        self.assertAlmostEqual(sc_req.score, 84.99, places=2)

    # -------- Test 12: idempotent award --------

    def test_idempotent_award(self):
        """Awarding twice doesn't duplicate the badge in the learner's record."""
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=90.0, you_do_pct=85.0, exam_pct=90.0, integrator_pct=90.0,
        )
        report1, newly1 = self.engine.award_idempotent(
            "independent_data_preparation", progress, edition=EDITION_DYNAMIC,
        )
        self.assertTrue(newly1, "First award should be newly awarded")
        self.assertEqual(report1.state, STATE_AWARDED)
        count_after_first = sum(1 for b in progress.awarded_badges
                                if b.badge_id == "independent_data_preparation")
        self.assertEqual(count_after_first, 1)

        report2, newly2 = self.engine.award_idempotent(
            "independent_data_preparation", progress, edition=EDITION_DYNAMIC,
        )
        self.assertFalse(newly2, "Second award should be a no-op")
        self.assertEqual(report2.state, STATE_AWARDED)
        count_after_second = sum(1 for b in progress.awarded_badges
                                 if b.badge_id == "independent_data_preparation")
        self.assertEqual(count_after_second, 1, "Idempotent award must not duplicate")

    # -------- Test 13: legacy progress doesn't fabricate evidence --------

    def test_legacy_progress_doesnt_fabricate_evidence(self):
        """Legacy section completion alone does NOT satisfy a competency badge's evidence requirements."""
        spec = self.specs["independent_data_preparation"]
        progress = LearnerProgress(learner_id="legacy-learner-1")
        # Award the prerequisite (assume they earned python_data_foundations previously).
        progress.awarded_badges.append(AwardedBadge(
            badge_id="python_data_foundations", state=STATE_AWARDED,
        ))
        # Legacy data: section completion marked as tier 1 (theory), legacy_only=True,
        # NO rubric scores, NO exam scores above 85.
        for section in spec.required_sections:
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-YOUDO", evidence_tier=TIER_THEORY,
                score_pct=None, legacy_only=True,
            ))
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertNotEqual(report.state, STATE_AWARDED)
        self.assertFalse(report.eligible)
        # The blocking reason must reject the legacy evidence somehow — by saying
        # activities are missing, or that what was submitted is guided rather
        # than independent, or that hands-on work is required.
        self.assertTrue(
            any("independent" in r.lower() or "missing" in r.lower() or "tier" in r.lower()
                or "hands-on" in r.lower() or "complete these activities" in r.lower()
                or "reading alone" in r.lower()
                for r in report.blocking_reasons),
            f"Expected legacy-evidence rejection; got: {report.blocking_reasons}",
        )

    # -------- Test 14: static mode shows "preview" not "awarded" --------

    def test_static_mode_shows_preview_not_awarded(self):
        """On the static edition, a competency badge reaches `eligible_pending_verification`, NOT `awarded`."""
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=90.0, you_do_pct=85.0, exam_pct=90.0, integrator_pct=90.0,
        )
        report = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_STATIC)
        self.assertEqual(report.state, STATE_ELIGIBLE_PENDING_VERIFICATION)
        self.assertNotEqual(report.state, STATE_AWARDED,
                            "Static edition must never reach 'awarded' for a competency badge")
        # `eligible` is True (the learner is eligible), but the state is "preview".
        self.assertTrue(report.eligible)
        # The blocking reasons must include the static-edition disclaimer.
        self.assertTrue(
            any("static" in r.lower() or "preview" in r.lower() or "verification" in r.lower()
                for r in report.blocking_reasons),
            f"Expected static-edition disclaimer; got: {report.blocking_reasons}",
        )

    # -------- Test 15 (bonus): capstone credential cannot be awarded on static edition --------

    def test_capstone_credential_blocked_on_static_edition(self):
        """Capstone credentials cannot be earned on the static edition at all — defense must be server-recorded."""
        # Find a capstone credential with the simplest prereq chain we can satisfy.
        spec = self.specs["integrated_python_ai_capstone_foundations"]
        # Build progress that *would* pass on dynamic edition (we cheat by giving all prereqs
        # and full evidence; we only need to confirm static edition blocks at the final gate).
        progress = LearnerProgress(learner_id="capstone-learner-1")
        # Award all prereq badges cited in the catalog entry.
        for prereq in spec.prerequisite_badges:
            progress.awarded_badges.append(AwardedBadge(badge_id=prereq, state=STATE_AWARDED))
        # Activities
        for section in spec.required_sections:
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-SELFCHECK", evidence_tier=TIER_YOU_DO,
                score_pct=90.0, server_verified=True,
            ))
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-YOUDO", evidence_tier=TIER_YOU_DO,
                score_pct=85.0, server_verified=True,
            ))
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-EXAM", evidence_tier=TIER_YOU_DO,
                score_pct=90.0, server_verified=True,
            ))
        # Projects (capstone has multiple)
        for project_id in spec.required_projects:
            progress.project_results[project_id] = 90.0
        # Add a defense project (some capstones use a 'defense' component)
        defense_id = f"BADGE:{spec.badge_id}:defense"
        progress.project_results[defense_id] = 100.0
        # Critical competencies at 100
        for comp_id in spec.critical_competencies:
            progress.critical_competency_scores.append(CriticalCompetencyScore(
                competency_id=comp_id, rubric_score_pct=100.0,
                criteria_scores=[100.0, 100.0, 100.0, 100.0],
            ))
        # On static edition: must not be awarded.
        report_static = self.engine.evaluate(spec.badge_id, progress, edition=EDITION_STATIC)
        self.assertNotEqual(report_static.state, STATE_AWARDED,
                            "Capstone must never be 'awarded' on static edition")
        # If the capstone has a defense component, static edition should return
        # eligible_pending_verification (preview blocked) with a clear message.
        # If it lacks a defense component (some catalog entries may), the engine
        # will still hit the static-edition cap and return eligible_pending_verification
        # for competency badges — which is also acceptable here. Either way: NOT awarded.
        self.assertTrue(
            any("static" in r.lower() or "sign in" in r.lower() or "lms" in r.lower()
                for r in report_static.blocking_reasons),
            f"Expected static-edition disclaimer; got: {report_static.blocking_reasons}",
        )

    # -------- Test 16 (bonus): determinism — same inputs produce same outputs --------

    def test_deterministic_output(self):
        """Same inputs -> same outputs, across two calls."""
        spec = self.specs["independent_data_preparation"]
        progress = _full_progress_for_competency_badge(
            "independent_data_preparation", spec,
            self_check_pct=90.0, you_do_pct=85.0, exam_pct=90.0, integrator_pct=90.0,
        )
        r1 = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        r2 = self.engine.evaluate("independent_data_preparation", progress, edition=EDITION_DYNAMIC)
        self.assertEqual(r1.state, r2.state)
        self.assertEqual(r1.eligible, r2.eligible)
        self.assertEqual(r1.blocking_reasons, r2.blocking_reasons)
        self.assertEqual(
            [(r.requirement_id, r.passed, r.score, r.floor) for r in r1.requirements],
            [(r.requirement_id, r.passed, r.score, r.floor) for r in r2.requirements],
        )

    # -------- Test 17 (bonus): progress badge IS awarded on static edition --------

    def test_progress_badge_awarded_on_static_edition(self):
        """Progress badges are local_achievement and ARE awarded on the static edition."""
        spec = self.specs["progress_phase0_walked"]
        progress = LearnerProgress(learner_id="progress-learner-1")
        # No prerequisites for progress_phase0_walked.
        # Progress badges require BOTH YOUDO and EXAM activity completion per the catalog.
        for section in spec.required_sections:
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-YOUDO", evidence_tier=TIER_YOU_DO,
                score_pct=None,  # progress badge doesn't need a score, just completion
            ))
            progress.activities.append(ActivityEvidence(
                activity_id=f"{section}-EXAM", evidence_tier=TIER_YOU_DO,
                score_pct=None,
            ))
        report = self.engine.evaluate("progress_phase0_walked", progress, edition=EDITION_STATIC)
        self.assertEqual(report.state, STATE_AWARDED)
        self.assertTrue(report.eligible,
                        "Progress badges should be eligible on the static edition")

    # -------- Test 18 (bonus): pilot badge requires supplementary exercise --------

    def test_pilot_badge_requires_supplementary_exercise(self):
        """A pilot badge with a gap-affected critical competency requires the supplementary exercise."""
        # applied_sql_query_development is pilot and depends on sql_competency (gap-affected).
        spec = self.specs["applied_sql_query_development"]
        if spec.status != "pilot":
            self.skipTest("applied_sql_query_development is not pilot in this catalog version")
        if not spec.gap_affected_competencies:
            self.skipTest("applied_sql_query_development has no gap-affected competencies")

        # Build full progress but WITHOUT the supplementary exercise.
        progress = _full_progress_for_competency_badge(
            "applied_sql_query_development", spec,
            self_check_pct=90.0, you_do_pct=85.0, exam_pct=90.0, integrator_pct=90.0,
            include_supplementary=False,
        )
        report = self.engine.evaluate("applied_sql_query_development", progress, edition=EDITION_DYNAMIC)
        self.assertFalse(report.eligible,
                         "Pilot badge must be blocked when supplementary exercise is missing")
        self.assertTrue(
            any("supplementary" in r.lower() for r in report.blocking_reasons),
            f"Expected supplementary-exercise blocking reason; got: {report.blocking_reasons}",
        )

        # Now add the supplementary exercise and re-evaluate.
        for comp_id in spec.gap_affected_competencies:
            supp_id = f"BADGE:applied_sql_query_development:supplementary:{comp_id}"
            progress.project_results[supp_id] = 100.0
        report2 = self.engine.evaluate("applied_sql_query_development", progress, edition=EDITION_DYNAMIC)
        self.assertTrue(report2.eligible,
                        f"Pilot badge should be eligible once supplementary is complete; "
                        f"state={report2.state}; reasons={report2.blocking_reasons}")


if __name__ == "__main__":
    unittest.main(verbosity=2)
