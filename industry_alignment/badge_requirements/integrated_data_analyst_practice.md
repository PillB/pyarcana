# Badge Requirements — Integrated Data Analyst Practice

**Badge ID:** `integrated_data_analyst_practice`  
**Version:** 1.0.0  
**Family:** cross_section_capability  
**Credential type:** `competency_badge`  
**Capability level:** `independent_practitioner`  
**Verification mode:** `server_verified`  
**Status:** `active`  
**Issuer:** PyArcana Industry Alignment Campaign (issuer of record: PyArcana maintainers)  
**Generated:** 2026-07-28T22:08:04Z

## Public claim

> The learner has independently synthesized Python data foundations, independent data preparation, applied analytical reasoning, and applied SQL query development into a single integrated Data Analyst-style project with a documented business framing, a reproducible pipeline, and an audience-tuned writeup.

## Non-claims (what this badge does NOT say)

- Does not certify the learner as a Data Analyst at any seniority level (Junior, Mid, Senior, Lead, etc.).
- Does not include production BI deployment or experimental design.
- SQL performance tuning is NOT included (curriculum gap; the Applied SQL Query Development badge is at pilot status).

## Newbie-friendly description (Stephen Fry redaction)

> You can do an end-to-end Data-Analyst-style project: frame a business question (what decision will this answer support?), pull data with SQL (including window functions and CTEs — see the Applied SQL badge description), clean and validate it with pandas, compute descriptive statistics, build a Python visualization and a BI dashboard, train a simple classical ML model as a baseline, and write a 1-pager a non-technical PM (Project Manager) can act on. 'Integrated' means you do all of this in one project, not as disconnected exercises. NOTE: this badge does NOT make you a 'Data Analyst' — that's a job title that depends on the company. It says you can do Data-Analyst-style work independently.

## Roles aligned

- `data_analyst`

## Skill nodes (evidence-backed)

- `python_core`
- `python_idioms`
- `git_workflow`
- `packaging_reproducibility`
- `pandas_numpy`
- `descriptive_stats`
- `data_cleaning`
- `data_validation`
- `python_visualization`
- `bi_tools`
- `classical_ml`
- `model_evaluation`
- `sql_fundamentals`
- `sql_window_ctes`
- `business_framing`
- `stakeholder_translation`
- `written_communication`

## Critical competencies (non-compensatory)

- `sql_competency` — assessed at 100% floor; cannot be offset by strength elsewhere
- `reproducibility_determinism` — assessed at 100% floor; cannot be offset by strength elsewhere
- `communication_audience_tuned` — assessed at 100% floor; cannot be offset by strength elsewhere
- `business_framing_judgment` — assessed at 100% floor; cannot be offset by strength elsewhere

## Market evidence pointers

- `industry_reality_brief.md §13 C2 (weak SQL = auto-reject)`
- `industry_reality_brief.md §13 C6 (poor testing habits)`
- `industry_reality_brief.md §13 C8 (acronyms not explained)`
- `industry_reality_brief.md §13 C9 (no business impact)`
- `industry_reality_brief.md §28.3 (SQL competency row)`
- `industry_reality_brief.md §28.3 (business framing row)`
- `industry_reality_brief.md §28.3 (communication row)`
- `industry_reality_brief.md §28.3 (reproducibility row)`
- `industry_reality_brief.md §3.1 (DA auto-reject on SQL)`
- `industry_reality_brief.md §5 (DA required skills, SQL row)`
- `industry_skill_graph.json#critical_competencies`
- `role_skill_taxonomy.json#design_principles`

## Prerequisite badges

- `python_data_foundations`
- `independent_data_preparation`
- `applied_analytical_reasoning`
- `applied_sql_query_development`

## Required sections

`S06`, `S07`, `S08`, `S09`, `S10`, `S19`, `S37`

## Required activities

- `S06-YOUDO`
- `S07-YOUDO`
- `S08-YOUDO`
- `S09-YOUDO`
- `S10-YOUDO`
- `S19-YOUDO`
- `S37-YOUDO`

## Required projects

- `BADGE:integrated_data_analyst_practice:integrator`

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

The integrator project for this cross-section capability
badge is `BADGE:integrated_data_analyst_practice:integrator`. The learner must:

1. Hold every prerequisite applied-skill badge
   (`python_data_foundations`, `independent_data_preparation`, `applied_analytical_reasoning`, `applied_sql_query_development`).
2. Build an independent synthesis project that demonstrates
   every skill_node listed in the badge. The project scope
   is: a single end-to-end artifact (notebook, repo, or
   deployed service) that exercises every required section's
   primary skill. The artifact must NOT be a tutorial-clone
   (industry_reality_brief.md §13 C10).
3. Submit a project README that states:
   - The business question and stakeholder.
   - The design decisions and tradeoffs (>=2 documented options
     per major decision).
   - The reproducibility instructions (README + requirements
     + deterministic seed + `make` or `just` commands).
   - The audience-tuned 1-pager (separate file) for a
     non-technical PM.
4. Submit to a server-side rubric evaluation per
   `badge_rubrics/integrated_data_analyst_practice.json#integrator_rubric`.

The project is rubric-graded; minimum 85% overall, 100% on
every critical competency.


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



