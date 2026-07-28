# Badge Requirements — Phase 0 — Foundations Walked

**Badge ID:** `progress_phase0_walked`  
**Version:** 1.0.0  
**Family:** progress_achievement  
**Credential type:** `local_achievement`  
**Capability level:** `foundation`  
**Verification mode:** `local_only`  
**Status:** `active`  
**Issuer:** PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)  
**Generated:** 2026-07-28T22:08:04Z

## Public claim

> The learner has completed all 13 sections of PyArcana Phase 0 (Foundations): S01 through S13, including the You Do project and self-check for each section.

## Non-claims (what this badge does NOT say)

- This is a motivational marker. It is NOT proof of proficiency.
- It does not certify any industry role, level, or job-readiness.
- It does not require independent (un-guided) exercise performance above the section-level self-check floor.
- Section completion alone does not satisfy any applied-skill, cross-section, or capstone credential requirement.

## Newbie-friendly description (Stephen Fry redaction)

> You finished the first 13 sections of PyArcana, the 'Foundations' phase. Each section ends with a You Do project (an exercise you do alone, without step-by-step help) and a short self-check quiz. Earning this marker means you walked through every section, submitted every You Do, and answered every self-check. It does NOT mean a hiring manager should treat you as a Data Analyst, Data Scientist, or any other role yet — it just means you did the work of walking through Phase 0.

## Roles aligned

- `data_analyst`
- `data_scientist`
- `rpa_automation_developer`
- `ai_ml_engineer`
- `production_python_engineer`

## Skill nodes (evidence-backed)

- `python_core`
- `python_idioms`
- `git_workflow`
- `packaging_reproducibility`
- `pandas_numpy`
- `data_cleaning`
- `data_validation`
- `descriptive_stats`
- `classical_ml`
- `model_evaluation`
- `python_visualization`
- `bi_tools`
- `testing_discipline`
- `performance_tuning`
- `python_rpa_browser`
- `process_analysis`
- `exception_handling_rpa`
- `code_review_literacy`
- `security_mindset`

## Critical competencies (non-compensatory)

- _(none — progress badge; no critical competencies assessed)_

## Market evidence pointers

- `industry_skill_graph.json#critical_competencies`
- `role_skill_taxonomy.json#design_principles`

## Prerequisite badges

- _(none — this is an entry-point badge)_

## Required sections

`S01`, `S02`, `S03`, `S04`, `S05`, `S06`, `S07`, `S08`, `S09`, `S10`, `S11`, `S12`, `S13`

## Required activities

- `S01-YOUDO`
- `S02-YOUDO`
- `S03-YOUDO`
- `S04-YOUDO`
- `S05-YOUDO`
- `S06-YOUDO`
- `S07-YOUDO`
- `S08-YOUDO`
- `S09-YOUDO`
- `S10-YOUDO`
- `S11-YOUDO`
- `S12-YOUDO`
- `S13-YOUDO`
- `S01-EXAM`
- `S02-EXAM`
- `S03-EXAM`
- `S04-EXAM`
- `S05-EXAM`
- `S06-EXAM`
- `S07-EXAM`
- `S08-EXAM`
- `S09-EXAM`
- `S10-EXAM`
- `S11-EXAM`
- `S12-EXAM`
- `S13-EXAM`

## Required projects


## Assessment blueprint

```json
{
  "components": [
    {
      "component_id": "section_completion",
      "description": "Each required section is marked completed when its You Do project is submitted and its self-check is answered. No score threshold applies; this is a walk-through marker, not a proficiency assessment.",
      "required_score_pct": 0,
      "weight": 1.0,
      "evidence_source": "progress store (localStorage + server mirror)",
      "critical_competency": false
    }
  ],
  "notes": "Progress badges are motivational markers. They are NOT proof of proficiency and they do NOT use the provisional floors. They are eligible on the static GitHub Pages edition (local_only) and the dynamic LMS edition."
}
```

## Scoring rules

```json
{
  "aggregation_method": "all_or_nothing",
  "minimum_overall_score": 0,
  "critical_competency_floor": 0,
  "non_compensatory": false,
  "rounding": "n/a",
  "notes": "Progress badges do not use a numeric floor. They are issued when every required activity is marked completed in the progress store."
}
```

## Retake rules

```json
{
  "retake_policy": "n/a (no assessment to retake)",
  "cool_down_days": 0,
  "max_attempts_per_window": null,
  "window_days": null,
  "notes": "Progress badges have no retake; they update continuously as activities are completed."
}
```

## Evidence rules

```json
{
  "evidence_source": "progress store only",
  "independent_work_required": false,
  "rubric_required": false,
  "server_verification_required": false,
  "acceptable_evidence": [
    "Section marked completed in progress store",
    "You Do project submitted (any rubric outcome)",
    "Self-check answered (any score)",
    "Exam attempt recorded (any score >=0%)"
  ],
  "unacceptable_evidence": [
    "Theory block read (passive consumption, not evidence)",
    "I Do demo watched (passive consumption, not evidence)",
    "We Do exercise completed (guided, not independent)"
  ],
  "legacy_progress_policy": "Legacy course completion from `python-ds-progress` localStorage is accepted as section-completed evidence. Legacy completion does NOT grant any competency badge or capstone credential; it only contributes to progress_* badges."
}
```

## Expiration policy

```json
{
  "expires": false,
  "expiration_period_days": null,
  "renewal_policy": "n/a",
  "notes": "Progress badges never expire; they record a historical walk-through."
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
  "legacy_progress_accepted": true,
  "scope": "Legacy `python-ds-progress` localStorage keys are accepted as evidence of section completion. Each legacy completed section counts toward the badge's required_sections list.",
  "limitations": [
    "Legacy progress does NOT grant any competency badge or capstone credential.",
    "Legacy exam scores (pass@70) count toward progress_* badges only; they do NOT count toward competency badges or capstone credentials unless they meet the stricter 85% floor.",
    "Legacy You Do completion (if any) counts toward progress_* badges; it does NOT count toward competency badges unless re-evaluated against the current badge rubric."
  ]
}
```

## Integrator project specification

_No integrator project for progress badges. The badge is issued automatically when all required activities are marked completed in the progress store._

## Critical-competency rubric specifications

_No critical competencies for this badge. See scoring_rules for the per-component and overall floors._

