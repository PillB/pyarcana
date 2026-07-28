# Badge Requirements — PyArcana Journey Completed

**Badge ID:** `progress_journey_completed`  
**Version:** 1.0.0  
**Family:** progress_achievement  
**Credential type:** `local_achievement`  
**Capability level:** `integrated_mastery`  
**Verification mode:** `local_only`  
**Status:** `active`  
**Issuer:** PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)  
**Generated:** 2026-07-28T22:08:04Z

## Public claim

> The learner has walked all 52 sections of PyArcana and completed every You Do, self-check, and section exam, plus every phase-level capstone referenced in the curriculum (CP-N1-A through CP-N4-C and CP-FINAL).

## Non-claims (what this badge does NOT say)

- Motivational marker only; NOT proof of any occupational competency.
- Does not certify any role, level, or seniority.
- Does not by itself satisfy any applied-skill or capstone credential rubric; it only records that the guided learning journey was walked.

## Newbie-friendly description (Stephen Fry redaction)

> You walked the whole course: all 52 sections, all 13 capstones (a capstone is a larger project at the end of a curriculum phase that pulls together everything you learned). This marker says you finished the journey. It does NOT say you are job-ready for any specific role — that's what the verified credentials further down the stack are for.

## Roles aligned

- `data_analyst`
- `data_scientist`
- `rpa_automation_developer`
- `ai_ml_engineer`
- `production_python_engineer`

## Skill nodes (evidence-backed)

- _(none — this badge records walk-through only, not skill evidence)_

## Critical competencies (non-compensatory)

- _(none — progress badge; no critical competencies assessed)_

## Market evidence pointers

- `industry_skill_graph.json#critical_competencies`
- `role_skill_taxonomy.json#design_principles`

## Prerequisite badges

- `progress_phase0_walked`
- `progress_phase1_walked`
- `progress_phase2_walked`
- `progress_phase3_walked`

## Required sections

`S01`, `S02`, `S03`, `S04`, `S05`, `S06`, `S07`, `S08`, `S09`, `S10`, `S11`, `S12`, `S13`, `S14`, `S15`, `S16`, `S17`, `S18`, `S19`, `S20`, `S21`, `S22`, `S23`, `S24`, `S25`, `S26`, `S27`, `S28`, `S29`, `S30`, `S31`, `S32`, `S33`, `S34`, `S35`, `S36`, `S37`, `S38`, `S39`, `S40`, `S41`, `S42`, `S43`, `S44`, `S45`, `S46`, `S47`, `S48`, `S49`, `S50`, `S51`, `S52`

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
- `S14-YOUDO`
- `S15-YOUDO`
- `S16-YOUDO`
- `S17-YOUDO`
- `S18-YOUDO`
- `S19-YOUDO`
- `S20-YOUDO`
- `S21-YOUDO`
- `S22-YOUDO`
- `S23-YOUDO`
- `S24-YOUDO`
- `S25-YOUDO`
- `S26-YOUDO`
- `S27-YOUDO`
- `S28-YOUDO`
- `S29-YOUDO`
- `S30-YOUDO`
- `S31-YOUDO`
- `S32-YOUDO`
- `S33-YOUDO`
- `S34-YOUDO`
- `S35-YOUDO`
- `S36-YOUDO`
- `S37-YOUDO`
- `S38-YOUDO`
- `S39-YOUDO`
- `S40-YOUDO`
- `S41-YOUDO`
- `S42-YOUDO`
- `S43-YOUDO`
- `S44-YOUDO`
- `S45-YOUDO`
- `S46-YOUDO`
- `S47-YOUDO`
- `S48-YOUDO`
- `S49-YOUDO`
- `S50-YOUDO`
- `S51-YOUDO`
- `S52-YOUDO`
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
- `S14-EXAM`
- `S15-EXAM`
- `S16-EXAM`
- `S17-EXAM`
- `S18-EXAM`
- `S19-EXAM`
- `S20-EXAM`
- `S21-EXAM`
- `S22-EXAM`
- `S23-EXAM`
- `S24-EXAM`
- `S25-EXAM`
- `S26-EXAM`
- `S27-EXAM`
- `S28-EXAM`
- `S29-EXAM`
- `S30-EXAM`
- `S31-EXAM`
- `S32-EXAM`
- `S33-EXAM`
- `S34-EXAM`
- `S35-EXAM`
- `S36-EXAM`
- `S37-EXAM`
- `S38-EXAM`
- `S39-EXAM`
- `S40-EXAM`
- `S41-EXAM`
- `S42-EXAM`
- `S43-EXAM`
- `S44-EXAM`
- `S45-EXAM`
- `S46-EXAM`
- `S47-EXAM`
- `S48-EXAM`
- `S49-EXAM`
- `S50-EXAM`
- `S51-EXAM`
- `S52-EXAM`

## Required projects

- `CP-N1-A`
- `CP-N1-B`
- `CP-N1-C`
- `CP-N2-A`
- `CP-N2-B`
- `CP-N2-C`
- `CP-N3-A`
- `CP-N3-B`
- `CP-N3-C`
- `CP-N4-A`
- `CP-N4-B`
- `CP-N4-C`
- `CP-FINAL`

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

