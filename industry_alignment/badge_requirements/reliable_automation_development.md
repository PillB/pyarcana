# Badge Requirements — Reliable Automation Development

**Badge ID:** `reliable_automation_development`  
**Version:** 1.0.0  
**Family:** applied_skill  
**Credential type:** `competency_badge`  
**Capability level:** `foundation`  
**Verification mode:** `server_verified`  
**Status:** `active`  
**Issuer:** PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)  
**Generated:** 2026-07-28T22:08:04Z

## Public claim

> The learner has independently demonstrated reliable browser-automation development — Python-based RPA with Playwright, process analysis, selector design, and exception handling — through You Do projects and section exams above the provisional floor.

## Non-claims (what this badge does NOT say)

- Does not certify the learner as an RPA Developer.
- Does not include UiPath, Automation Anywhere, or Power Automate (PyArcana's RPA track is Python-based by design).
- Does not include REFramework or Orchestrator operations (out-of-current-scope; see curriculum gap analysis).
- Selector resilience is assessed against a documented UI change scenario, not against an enterprise-scale deployment.

## Newbie-friendly description (Stephen Fry redaction)

> You can build a Python-based automation script (using Playwright or Selenium — libraries that drive a browser programmatically) that doesn't break the moment the website changes. 'Selector design' means picking stable references to page elements (like CSS IDs or data-test attributes) instead of brittle ones (like the third button on the page). 'Exception handling' means your script recovers gracefully when something goes wrong, instead of crashing. RPA (Robotic Process Automation) is the broader field of automating repetitive computer tasks.

## Roles aligned

- `rpa_automation_developer`

## Skill nodes (evidence-backed)

- `python_rpa_browser`
- `process_analysis`
- `exception_handling_rpa`
- `selector_design`

## Critical competencies (non-compensatory)

- `selector_resilience` — assessed at 100% floor; cannot be offset by strength elsewhere
- `reproducibility_determinism` — assessed at 100% floor; cannot be offset by strength elsewhere

## Market evidence pointers

- `industry_reality_brief.md §13 C6 (poor testing habits)`
- `industry_reality_brief.md §19 (RPA failure modes)`
- `industry_reality_brief.md §28.3 (reproducibility row)`
- `industry_reality_brief.md §28.3 (selector resilience row)`
- `industry_skill_graph.json#critical_competencies`
- `role_skill_taxonomy.json#design_principles`

## Prerequisite badges

- `python_data_foundations`

## Required sections

`S13`, `S24`

## Required activities

- `S13-YOUDO`
- `S13-EXAM`
- `S24-YOUDO`
- `S24-EXAM`

## Required projects

- `BADGE:reliable_automation_development:integrator`

## Assessment blueprint

```json
{
  "components": [
    {
      "component_id": "self_check",
      "description": "Aggregate of section self-check questions across required sections. Self-checks are MCQ-only and low-authenticity; they are weighted lightly and used as a participation/engagement signal, not as a proficiency signal.",
      "required_score_pct": 85,
      "weight": 0.15,
      "evidence_source": "self_check activities",
      "critical_competency": false
    },
    {
      "component_id": "you_do_projects",
      "description": "Aggregate of section You Do project rubric scores across required sections. You Do projects are independent (no step-by-step guidance) and high-authenticity; they are the primary evidence of independent capability.",
      "required_score_pct": 80,
      "weight": 0.4,
      "evidence_source": "you_do activities + section rubric",
      "critical_competency": false
    },
    {
      "component_id": "section_exams",
      "description": "Aggregate of section exam scores across required sections. Exams are server-graded MCQs (pass@70 baseline); the badge floor is stricter at 85%.",
      "required_score_pct": 85,
      "weight": 0.2,
      "evidence_source": "exam activities (server-graded)",
      "critical_competency": false
    },
    {
      "component_id": "integrator_project",
      "description": "Badge-specific integrator project (independent exercise specified in the badge rubric). For applied-skill badges, this is a bounded exercise that ties together the required sections' skills. For cross-section badges, this is a synthesis project. For capstone credentials, this is the phase capstone defense plus a synthesis writeup.",
      "required_score_pct": 85,
      "weight": 0.2,
      "evidence_source": "badge rubric evaluation (server-verified)",
      "critical_competency": false
    }
  ]
}
```

## Scoring rules

```json
{
  "aggregation_method": "weighted_average_with_non_compensatory_gates",
  "minimum_overall_score": 85,
  "critical_competency_floor": 100,
  "non_compensatory": true,
  "rounding": "down",
  "gates": [
    {
      "gate_id": "per_component_floor",
      "description": "Each scored component must meet its own required_score_pct. A single component below floor blocks the badge, regardless of the weighted average."
    },
    {
      "gate_id": "critical_competency_floor",
      "description": "Each critical_competency in the badge must be individually scored at 100% (full rubric credit). Critical competencies are non-compensatory: strength elsewhere cannot offset a critical-competency gap."
    },
    {
      "gate_id": "overall_floor",
      "description": "Even when every component and every critical competency passes its floor, the weighted average must still meet the minimum_overall_score."
    }
  ]
}
```

## Retake rules

```json
{
  "retake_policy": "If the badge is failed, the learner may retake the failed component(s) after a cool-down period. Section exams follow the existing per-section max-3-attempts rule. You Do project rubric may be re-evaluated after a substantive revision. The integrator project may be re-submitted after revision.",
  "cool_down_days": 7,
  "max_attempts_per_window": 3,
  "window_days": 90,
  "notes": "Competency badge retakes are server-logged. Repeated critical-competency failures trigger a recommendation (not a hard block) to revisit the corresponding section(s)."
}
```

## Evidence rules

```json
{
  "evidence_source": "section You Do projects + section exams + badge integrator project (+ capstone defense, for verified_credential)",
  "independent_work_required": true,
  "rubric_required": true,
  "server_verification_required": true,
  "acceptable_evidence": [
    "You Do project submitted with rubric evaluation >=80%",
    "Section exam passed with score >=85%",
    "Self-check aggregate >=85% across required sections",
    "Badge integrator project submitted with rubric evaluation >=85%",
    "(For verified_credential) Capstone defense passed at 100% rubric credit for every critical competency",
    "(For gap-affected competencies) Supplementary independent exercise completed per the badge rubric's gap-closure specification"
  ],
  "unacceptable_evidence": [
    "We Do exercise completion (guided, not independent)",
    "Theory block reading (passive)",
    "I Do demo viewing (passive)",
    "Tutorial-following without modification (tutorial-dependence is the #1 recruiter complaint; see industry_reality_brief.md \u00a713 C1)",
    "AI-generated code without review trail (see \u00a713 C7)",
    "Legacy course completion alone (does not fabricate missing badge evidence)"
  ],
  "gap_closure_policy": "Where the curriculum has known gaps (leakage_prevention, python_type_safety, sql_performance_tuning), the badge rubric specifies a supplementary independent exercise that the learner must complete. The supplementary exercise is rubric-graded and counts toward the critical-competency floor. The badge is issued at 'pilot' status until Phase 4 closes the curriculum gap; once closed, the badge is re-issued at 'active' status without requiring existing holders to re-test (the supplementary exercise evidence is preserved as equivalent)."
}
```

## Expiration policy

```json
{
  "expires": true,
  "expiration_period_days": 1095,
  "renewal_policy": "Renewal requires re-evaluation against the current badge rubric. If the badge has been superseded (status=superseded) or retired (status=retired) by the renewal date, the learner must earn the successor badge.",
  "notes": "Competency badges expire after 3 years because industry skill expectations change (see industry_reality_brief.md \u00a715). Expiration is per-badge, not per-learner."
}
```

## Revocation policy

```json
{
  "revocation_triggers": [
    "Plagiarism detected in any required activity or integrator project",
    "Critical-competency rubric found to have been gamed (e.g., test-set data used to inflate a model evaluation)",
    "Issuance error (wrong rubric applied, wrong learner record)",
    "Badge status changed to 'retired' or 'superseded' and the learner's evidence does not meet the successor badge's requirements",
    "Evidence later found to be unacceptable per evidence_rules (e.g., tutorial-clone portfolio, AI-generated code without review trail)"
  ],
  "revocation_process": "Server-side revocation flips the badge record to 'revoked' status. The learner is notified with the specific trigger and evidence pointer. The learner may appeal within 30 days. A revoked badge is removed from the public claim register but remains in the learner's private record with the revocation reason.",
  "reinstatement_policy": "After revocation for plagiarism or gaming, the learner must wait 180 days and then re-earn the badge from scratch (including all prerequisites, if applicable). After revocation for issuance error or curriculum deprecation, reinstatement is automatic once the underlying issue is resolved."
}
```

## Legacy progress policy

```json
{
  "legacy_progress_accepted": false,
  "scope": "Legacy course completion does NOT fabricate missing badge evidence. Each competency badge and capstone credential requires fresh, rubric-graded evidence per the badge's evidence_rules.",
  "limitations": [
    "Legacy section completion alone does not satisfy any competency badge or capstone credential requirement.",
    "Legacy exam scores >=85% MAY be carried forward as evidence for the corresponding section exam component, provided the exam questions have not been rotated. Legacy scores in the 70-84% range do NOT satisfy the badge floor and require a fresh exam attempt.",
    "Legacy You Do projects MAY be carried forward as evidence ONLY if re-evaluated against the current badge rubric. Re-evaluation is mandatory; the legacy rubric outcome is not accepted as-is.",
    "Legacy capstone completion (CP-N*-X) does NOT satisfy any capstone credential defense requirement. The defense must be re-done against the current capstone credential rubric."
  ],
  "migration_path": "Learners with legacy progress receive an automatic 'progress_*' badge for each phase they completed. To earn any competency badge or capstone credential, they must (a) meet the badge's prerequisite_badges chain, (b) re-evaluate their existing You Do projects against the current rubric, (c) re-take any section exam scoring below 85%, and (d) complete the badge integrator project (and defense, for verified_credential). No shortcut."
}
```

## Integrator project specification

The integrator project for this applied-skill badge is
`BADGE:reliable_automation_development:integrator`. The learner must:

1. Hold every prerequisite badge
   (`python_data_foundations`).
2. Complete every required section's You Do project and section
   exam at or above the provisional floor
   (You Do >=80%, exam >=85%, self-check >=85%).
3. Complete a bounded independent exercise that ties together
   the required sections' primary skills. The exercise
   specification is in `badge_rubrics/reliable_automation_development.json#integrator_spec`.
   The exercise is bounded (estimated 4-8 hours of independent
   work) and is rubric-graded.

The exercise is NOT a tutorial-following; it is independent work
that demonstrates the learner can apply the badge's skills
without step-by-step guidance.


## Critical-competency rubric specifications

Each critical competency is graded against a 4-criterion rubric. All four criteria must score 100% (full credit) for the competency to pass. Critical competencies are non-compensatory: a single failing criterion blocks the badge.

### `selector_resilience`

**Skill scope:** `selector_design`, `exception_handling_rpa`,
`reframework`.

**Note:** `reframework` is a known curriculum gap (Phase 3 §7).
PyArcana's RPA track is Python-based by design and does not
teach UiPath REFramework. The selector_resilience competency
is therefore assessed on Python-based selectors
(Playwright/Selenium) with explicit acknowledgment that
REFramework is out-of-current-scope.

**Rubric criteria (each must score 100%):**
1. **Stable selector choice** — selectors use stable
   attributes (data-test, ID, ARIA role) over brittle ones
   (nth-child, position-based).
2. **Anchor strategy** — when no stable selector exists,
   learner uses anchor-based location (find a stable nearby
   element, then walk to the target).
3. **Exception handling** — every UI interaction is wrapped
   in try/except with a defined recovery (retry, fallback,
   or fail-closed exit).
4. **UI-change resilience test** — learner demonstrates the
   bot survives a documented UI change (before/after
   screenshots + selector strategy memo).


### `reproducibility_determinism`

**Skill scope:** `packaging_reproducibility`, `git_workflow`,
`testing_discipline`.

**Rubric criteria (each must score 100%):**
1. **Reproducible environment** — `pyproject.toml` or
   `requirements.txt` with pinned versions; README
   instructions for setting up the environment from
   scratch.
2. **Deterministic seeds** — all randomness (NumPy,
   PyTorch, scikit-learn, hash seeds) is seeded; rerunning
   the pipeline produces the same output.
3. **Git hygiene** — commit history is clean (no force-
   pushes mid-project); branches are used for features;
   PRs are used for merges.
4. **Testing discipline** — at least one unit test per
   transformation function; tests run in CI; coverage
   reported (target >=70%, not gated at this level).



