# Badge Requirements — Evidence-Grounded AI Systems Capstone

**Badge ID:** `evidence_grounded_ai_systems_capstone`  
**Version:** 1.0.0  
**Family:** capstone_credential  
**Credential type:** `verified_credential`  
**Capability level:** `integrated_mastery`  
**Verification mode:** `server_verified`  
**Status:** `active`  
**Issuer:** PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)  
**Generated:** 2026-07-28T22:08:04Z

## Public claim

> The learner has completed and defended CP-FINAL — the cross-curriculum integrator capstone at S52 — at rubric performance above the provisional floor, with explicit evidence-grounded defense of every critical competency in the PyArcana stack: SQL, leakage prevention, selector resilience, type safety + production hardening, MLOps fluency, business framing, communication, and reproducibility.

## Non-claims (what this badge does NOT say)

- Does not certify the learner as any role at any seniority level, including any 'Master', 'Senior', 'Staff', 'Principal', or 'Distinguished' title.
- The defense is against PyArcana's rubric, not against an external industry certification board.
- Where the curriculum has known gaps (leakage prevention, type safety, SQL performance tuning), the learner must demonstrate the competency via a supplementary independent exercise specified in the badge rubric. The credential explicitly notes which competencies were assessed via curriculum evidence vs. supplementary exercise.

## Newbie-friendly description (Stephen Fry redaction)

> You completed CP-FINAL — the cross-curriculum integrator capstone at S52 — and defended it against ALL EIGHT non-compensatory critical competencies in the PyArcana stack: SQL, leakage prevention, selector resilience, type safety + production hardening, MLOps fluency, business framing, communication, and reproducibility. 'Non-compensatory' means you cannot pass by being strong in seven and weak in one — all eight must meet the floor. This is the heaviest credential PyArcana issues. NOTE: It is NOT an industry certification (like AWS or Google Cloud certs). It is PyArcana's internal synthesis credential. NOTE: For competencies where the curriculum has gaps (leakage prevention, type safety, SQL performance tuning), you must demonstrate the competency via a supplementary independent exercise specified in the rubric.

## Roles aligned

- `data_analyst`
- `data_scientist`
- `rpa_automation_developer`
- `ai_ml_engineer`
- `production_python_engineer`

## Skill nodes (evidence-backed)

- `business_framing`
- `oral_communication`
- `written_communication`
- `stakeholder_management`

## Critical competencies (non-compensatory)

- `sql_competency` — assessed at 100% floor; cannot be offset by strength elsewhere
- `leakage_prevention` — assessed at 100% floor; cannot be offset by strength elsewhere
- `selector_resilience` — assessed at 100% floor; cannot be offset by strength elsewhere
- `type_safety_production_hardening` — assessed at 100% floor; cannot be offset by strength elsewhere
- `mlops_fluency` — assessed at 100% floor; cannot be offset by strength elsewhere
- `business_framing_judgment` — assessed at 100% floor; cannot be offset by strength elsewhere
- `communication_audience_tuned` — assessed at 100% floor; cannot be offset by strength elsewhere
- `reproducibility_determinism` — assessed at 100% floor; cannot be offset by strength elsewhere

## Market evidence pointers

- `industry_reality_brief.md §13 C2 (weak SQL = auto-reject)`
- `industry_reality_brief.md §13 C5 (data leakage = critical)`
- `industry_reality_brief.md §13 C6 (poor testing habits)`
- `industry_reality_brief.md §13 C8 (acronyms not explained)`
- `industry_reality_brief.md §13 C9 (no business impact)`
- `industry_reality_brief.md §19 (RPA failure modes)`
- `industry_reality_brief.md §22 (AIML frequently missing)`
- `industry_reality_brief.md §25 (PySE frequently missing)`
- `industry_reality_brief.md §28.3 (MLOps fluency row)`
- `industry_reality_brief.md §28.3 (SQL competency row)`
- `industry_reality_brief.md §28.3 (business framing row)`
- `industry_reality_brief.md §28.3 (communication row)`
- `industry_reality_brief.md §28.3 (leakage prevention row)`
- `industry_reality_brief.md §28.3 (reproducibility row)`
- `industry_reality_brief.md §28.3 (selector resilience row)`
- `industry_reality_brief.md §28.3 (type safety row)`
- `industry_reality_brief.md §3.1 (DA auto-reject on SQL)`
- `industry_reality_brief.md §5 (DA required skills, SQL row)`
- `industry_skill_graph.json#critical_competencies`
- `role_skill_taxonomy.json#design_principles`

## Prerequisite badges

- `integrated_python_ai_capstone_integrated_mastery`
- `integrated_data_analyst_practice`
- `integrated_data_science_practice`
- `integrated_ml_engineering_practice`
- `integrated_automation_engineering_practice`
- `integrated_production_python_practice`

## Required sections

`S52`

## Required activities

- `S52-YOUDO`
- `S52-EXAM`

## Required projects

- `CP-FINAL`
- `BADGE:evidence_grounded_ai_systems_capstone:synthesis`

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
      "weight": 0.25,
      "evidence_source": "badge rubric evaluation (server-verified)",
      "critical_competency": false
    },
    {
      "component_id": "defense",
      "description": "Oral or written defense of the capstone synthesis. The learner must articulate (a) the business question, (b) the design decisions and tradeoffs, (c) the competencies demonstrated, and (d) the limitations of the work. Defense is graded pass/fail with a written rubric; a fail blocks the credential.",
      "required_score_pct": 100,
      "weight": 0.0,
      "evidence_source": "defense rubric (server-verified)",
      "critical_competency": true
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
  "retake_policy": "If the badge is failed, the learner may retake the integrator project and defense after a cool-down period. Section exams follow the existing per-section max-3-attempts rule. You Do project rubric may be re-evaluated after a substantive revision (git diff non-empty).",
  "cool_down_days": 14,
  "max_attempts_per_window": 2,
  "window_days": 90,
  "notes": "Capstone credentials are server-verified; retakes are logged server-side and visible to the learner's record. Three consecutive failed defenses trigger a mandatory mentor-review step before the next attempt."
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
  "renewal_policy": "Renewal requires re-defense against the current capstone rubric. If the curriculum has been revised, the learner may need to complete new supplementary exercises for any newly-added critical competencies.",
  "notes": "Capstone credentials expire after 3 years. The credential record remains visible (with an 'expired' tag) so employers can see the historical achievement; but the public_claim is no longer current until renewed."
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

The integrator project for this capstone credential is the
**synthesis defense** specified in
`BADGE:evidence_grounded_ai_systems_capstone:synthesis`. The learner must:

1. Complete every required phase capstone project
   (`CP-FINAL`).
2. Write a synthesis document (1,500-3,000 words) that:
   - States the business question each capstone answers.
   - Articulates the design decisions and tradeoffs made in each.
   - Identifies the critical competencies demonstrated and
     provides a pointer to the rubric evidence for each.
   - Names the limitations of the work and what would be
     needed to address them.
3. Defend the synthesis in a 30-minute oral review (or
   equivalent async written review) with a PyArcana reviewer
   or designated industry mentor. The defense is graded
   pass/fail against the defense rubric in
   `badge_rubrics/evidence_grounded_ai_systems_capstone.json#defense_rubric`.

The synthesis document and defense recording are stored
server-side and linked to the learner's credential record.

Prerequisites for this credential: `integrated_python_ai_capstone_integrated_mastery`, `integrated_data_analyst_practice`, `integrated_data_science_practice`, `integrated_ml_engineering_practice`, `integrated_automation_engineering_practice`, `integrated_production_python_practice`.


## Critical-competency rubric specifications

Each critical competency is graded against a 4-criterion rubric. All four criteria must score 100% (full credit) for the competency to pass. Critical competencies are non-compensatory: a single failing criterion blocks the badge.

### `sql_competency`

**Skill scope:** `sql_fundamentals`, `sql_window_ctes`,
`sql_performance_tuning`.

**Note:** `sql_performance_tuning` is a known curriculum
gap (Phase 3 §7). Until Phase 4 closes the gap, the
learner must complete the supplementary exercise specified
in `badge_rubrics/<id>.json#gap_closure_sql_performance_tuning`.

**Rubric criteria (each must score 100%):**
1. **Query correctness** — every submitted query returns the
   intended result on the test database. Partial results
   count as failure.
2. **Idiomatic SQL** — uses window functions and CTEs where
   they improve readability; does not use correlated
   subqueries where a JOIN or window function would be clearer.
3. **Schema awareness** — query references the correct
   columns and tables; understands primary/foreign key
   relationships.
4. **Performance reasoning** — for `sql_performance_tuning`
   only: can read a query plan, identify the bottleneck, and
   propose an index or rewrite. (This criterion is assessed
   via the supplementary exercise until the curriculum gap
   is closed.)


### `leakage_prevention`

**Skill scope:** `leakage_prevention`, `model_evaluation`.

**Note:** `leakage_prevention` is a known curriculum gap
(Phase 3 §7). Until Phase 4 closes the gap, the learner
must complete the supplementary exercise specified in
`badge_rubrics/<id>.json#gap_closure_leakage_prevention`.

**Rubric criteria (each must score 100%):**
1. **Train/test split discipline** — split is performed
   before any feature engineering that uses target-derived
   statistics; group-aware splitting when groups exist; time-
   aware splitting for time series.
2. **Target leakage audit** — the learner articulates, for
   every feature, whether it could leak the target. Features
   derived from the target are removed or correctly isolated.
3. **Preprocessing pipeline integrity** — all preprocessing
   (scaling, imputation, encoding) is fit on the training
   set only and applied via a fitted pipeline; no fit-on-full-
   data shortcuts.
4. **Evaluation honesty** — the learner reports a relevant
   baseline, the chosen metric with rationale, and an honest
   error analysis; does not cherry-pick a favorable metric.


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


### `type_safety_production_hardening`

**Skill scope:** `python_type_safety`, `observability`,
`ci_cd`, `packaging_reproducibility`.

**Note:** `python_type_safety` is a known curriculum gap
(Phase 3 §7). Until Phase 4 closes the gap, the learner
must complete the supplementary exercise specified in
`badge_rubrics/<id>.json#gap_closure_python_type_safety`.

**Rubric criteria (each must score 100%):**
1. **Type annotations** — all function signatures and class
   attributes are type-annotated; no `# type: ignore` without
   a justification comment.
2. **mypy/Pyright baseline** — `pyproject.toml` has a mypy
   or Pyright config; CI runs the type-checker as a gate;
   the codebase passes clean.
3. **Observability** — structured logs (JSON), OpenTelemetry
   tracing, Prometheus metrics; all present in the
   submitted artifact.
4. **CI/CD gate** — CI pipeline runs tests, type-checker,
   and linter on every push; deployment is gated on all
   three passing.


### `mlops_fluency`

**Skill scope:** `model_deployment`, `mlops_pipelines`,
`drift_monitoring`, `system_design`.

**Rubric criteria (each must score 100%):**
1. **Deployment artifact** — model is served behind a
   containerized API with health check and latency budget;
   not just a `.pkl` file.
2. **Pipeline reproducibility** — retraining pipeline is
   code (not click-ops); runs end-to-end from a single
   command; deterministic seeds; pinned dependencies.
3. **Drift monitoring** — learner articulates data drift,
   concept drift, and target drift; wires at least one into
   a retraining trigger or alert.
4. **System design memo** — learner writes a 1-page design
   memo identifying the system's SLOs, failure modes, and
   rollback plan.


### `business_framing_judgment`

**Skill scope:** `business_framing`, `metric_design`,
`tradeoff_articulation`.

**Rubric criteria (each must score 100%):**
1. **Business question** — README or writeup states the
   business question, the stakeholder, and the decision the
   work supports.
2. **Metric design** — the chosen metric matches the
   business question (not just accuracy); the learner
   articulates why this metric and not another.
3. **Tradeoff articulation** — at least two options are
   documented per major decision, with pros, cons, the
   chosen option, and the conditions under which to revisit.
4. **Impact framing** — the work is framed in dollar/impact
   terms (revenue, cost, time saved, risk reduced), not just
   technical terms.


### `communication_audience_tuned`

**Skill scope:** `written_communication`, `oral_communication`,
`stakeholder_translation`.

**Rubric criteria (each must score 100%):**
1. **Written artifact** — a 1-pager that a non-technical PM
   can act on: question, finding, recommendation, caveat,
   next step.
2. **Audience tuning** — separate artifacts (or sections)
   for technical vs. non-technical audiences; jargon is
   explained inline on first use.
3. **Oral defense** (for verified_credential only) — a
   recorded 5-minute presentation, audience-tuned, with
   slides.
4. **Stakeholder translation** — the learner articulates,
   for at least one technical finding, the corresponding
   business implication and recommended action.


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



