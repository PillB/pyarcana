# Phase 1 — Badge Market Requirements

**Phase:** 1 (Badge Market Revalidation)  
**Author:** `product_hardening` agent (Solarized Phase 1)  
**Date:** 2026-07-29  
**Source corpus:** `industry_reality_brief.md` (2,279 lines, 352 URLs, 5 roles × 4 levels), `curriculum_gap_matrix.md` (41 gaps), `industry_skill_graph.json` (62 skill nodes, 8 critical competencies), `role_skill_taxonomy.json` (437 role-level-skill assignments), `src/lib/eligibility/badge_catalog.json` (31 badges).

This document states **what the market requires of a Python-and-AI credential portfolio** in 2024–2026, derived from the industry reality brief. It is the market-side input to the badge-claim matrix. It does not yet prescribe what PyArcana should do — that is the job of `badge_gap_report.md`.

---

## 1. The five in-scope roles

The industry reality brief identifies five roles that PyArcana's curriculum credibly prepares learners for:

| Role ID | Role | Why in scope |
|---|---|---|
| `data_analyst` | Data Analyst | SQL + pandas + BI tools + communication — PyArcana S06, S19, S37 cover the core. |
| `data_scientist` | Data Scientist | Classical ML + model evaluation + statistics — PyArcana S10, S33, S39 cover the core. |
| `rpa_automation_developer` | RPA / Automation Developer | Python browser automation + selector design + exception handling — PyArcana S13, S24 cover the durable patterns. UiPath Studio itself is out of scope (Python-first). |
| `ai_ml_engineer` | AI/ML Engineer | MLOps + LLMOps + system design + production hardening — PyArcana S29, S41, S43, S48 cover the core. |
| `production_python_engineer` | Production Python Engineer | Async + containers + CI/CD + observability + type safety — PyArcana S17, S27, S43, S45 cover most of the core. |

Six additional skills are **deliberately omitted** under the Python-first scope: R language, Excel-as-analyst-tool, UiPath Studio, VB.NET/C#, Microsoft Power Automate, Automation Anywhere. PyArcana should continue to disclose these as "not covered" on relevant badges rather than imply coverage.

---

## 2. The four capability levels

The industry reality brief defines four levels per role, mapped to PyArcana badge `capability_level` as follows:

| Industry level | PyArcana capability_level | Autonomy |
|---|---|---|
| Foundational / Entry | `foundation` | Works under routine supervision; follows instructions. |
| Independent Practitioner | `independent_practitioner` | Works under general direction; manages own work within deadlines. |
| Advanced Delivery | `advanced_applied` | Works autonomously on complex, ambiguous problems; sets technical direction for self. |
| Technical Leadership / Mastery | `integrated_mastery` | Advises, leads, mentors; sets standards for a team or org. |

PyArcana badges MUST NOT use occupational seniority titles (Senior, Staff, Principal, Master) — this is a hard design constraint in `badge_catalog.json#design_constraints`. The four capability_levels above are the only permitted level vocabulary.

---

## 3. The eight critical competencies (non-compensatory)

These are the eight competencies that the industry brief flags as **non-compensatory** — a learner who lacks any one of them cannot honestly be awarded a badge that requires it, no matter how strong their other skills are.

| Critical competency | Underlying skill nodes | PyArcana status (per gap matrix §2) | P0 blocker |
|---|---|---|---|
| `sql_competency` | sql_fundamentals, sql_window_ctes, sql_performance_tuning | PARTIAL — sql_performance_tuning is UNCOVERED | **GAP-P0-003** |
| `leakage_prevention` | leakage_prevention | FAIL — leakage_prevention is UNCOVERED (only implicit in S10/S33/S39) | **GAP-P0-001** |
| `selector_resilience` | selector_design, exception_handling_rpa, reframework | PARTIAL — reframework (state machine) is UNCOVERED | **GAP-P0-004** |
| `type_safety_production_hardening` | python_type_safety, observability, ci_cd, packaging_reproducibility | PARTIAL — python_type_safety (mypy/Pyright) is UNCOVERED | **GAP-P0-002** |
| `mlops_fluency` | model_deployment, mlops_pipelines, drift_monitoring, system_design | PASS (24 credential-eligible activities; thin on model_deployment depth — GAP-P2-008) | — |
| `business_framing_judgment` | business_framing, metric_design, tradeoff_articulation | PASS (12 credential-eligible activities; metric_design thin — GAP-P2-005) | — |
| `communication_audience_tuned` | written_communication, oral_communication, stakeholder_translation | PASS (16 credential-eligible activities; clustered in Phase 3 — GAP-P1-011 timing risk) | — |
| `reproducibility_determinism` | packaging_reproducibility, git_workflow, testing_discipline | PASS (16 credential-eligible activities) | — |

**Implication for badges:** Any badge that lists one of the four P0-blocked critical competencies in its `critical_competencies` array cannot be honestly issued until the corresponding P0 gap is closed. The badge_claim_matrix flags every such badge as `overclaimed` with decision `strengthen`.

---

## 4. Market skill coverage requirements (per role-level)

The `role_skill_taxonomy.json` defines 437 role-level-skill assignments across 5 roles × 4 levels. Highlights relevant to badge revalidation:

### 4.1 Skills newly required at independent+ (2024–2026 trend)

The industry brief identifies these skills as **newly baseline** for independent+ roles:

- `python_type_safety` (mypy/Pyright) — required at PySE/independent+, AIML/independent+ — currently P0-blocked.
- `leakage_prevention` — required at DS/independent+, AIML/independent+ — currently P0-blocked.
- `hypothesis_testing` — required at DA/independent+, DS/foundation+, AIML/foundation+ — currently P1 (GAP-P1-001).
- `feature_engineering` — required at DS/independent+, AIML/independent+ — currently P1 (GAP-P1-003).
- `experimental_design` — required at DA/advanced+, DS/independent+, AIML/advanced+ — currently P1 (GAP-P1-004).
- `regression` — required at DS/independent+, AIML/independent+ — currently P1 (GAP-P1-002).

### 4.2 Skills required but thinly covered

- `sql_window_ctes` — taught in S37 only (thin). Required at DA/independent+, DS/independent+.
- `model_deployment` — taught in S29 only (thin). Required at AIML/independent+, DS/advanced+.
- `metric_design` — taught in S39 only (thin). Required at DA/advanced+, DS/advanced+, AIML/advanced+.
- `written_communication`, `oral_communication` — clustered in S50/S52 (Phase 3). Required at all roles at independent+.

### 4.3 Vendor-specific skills (deliberately out of scope, but must be disclosed)

The badges that align with `rpa_automation_developer` MUST disclose that UiPath Studio, Power Automate, and Automation Anywhere are out of scope. The disclosure must be in the badge's `non_claims` array — already done for `reliable_automation_development` and `integrated_automation_engineering_practice` per the catalog.

---

## 5. Market expectations for credential portfolios

Synthesising §0–§32 of the industry brief, the market in 2024–2026 expects a Python-and-AI credential portfolio to:

1. **Disclose what it does NOT cover.** R, Excel-as-analyst-tool, UiPath Studio, vendor automation platforms, and (separately) cloud-vendor certifications (AWS/GCP/Azure) are commonly expected "not covered" disclosures. Hiding them inflates the credential.
2. **Distinguish local achievement from verified credential.** A "completed the course" marker is a local achievement; a "defended a capstone at rubric X" is a verified credential. Mixing the two devalues both.
3. **Use independent performance evidence, not just guided completion.** We Do exercises don't count; You Do projects and section exams do. Self-checks don't count for either.
4. **Be non-compensatory on critical competencies.** A learner who is excellent at SQL but cannot prevent data leakage cannot honestly be awarded a Data Scientist independent+ badge.
5. **Avoid occupational seniority titles.** "Senior Data Scientist" is a job title, not a credential. PyArcana's `integrated_mastery` level is the highest permitted claim.
6. **Carry an evidence trail.** Each awarded badge should link to the learner's actual You Do projects, exam attempts, and capstone rubric scores — not just a yes/no flag.
7. **Be portable.** Badges should be Open Badges 3.0 compatible (or at least exportable as signed JSON) so they survive a PyArcana shutdown.

PyArcana's badge catalog already encodes 1–5 in its `design_constraints` and per-badge `non_claims`. Items 6–7 are unimplemented and are flagged in `badge_gap_report.md` as infrastructure gaps.

---

## 6. Hard requirements for any badge that wants to claim "role readiness"

A PyArcana badge that lists a role in `roles_aligned` at capability_level X is implicitly claiming "this badge contributes to role-readiness at level X". For this claim to be honest, the badge MUST:

1. Cover (in `skill_nodes`) every critical competency required for that role at level X — OR explicitly disclose in `non_claims` which critical competencies are NOT covered and therefore which higher-level badges the learner is NOT yet eligible for.
2. Not list any P0-blocked skill in `skill_nodes` until the corresponding curriculum gap is closed.
3. Not claim any critical_competency whose underlying skill is P0-blocked, until the gap is closed.
4. Cover at least 70% of the in-scope (non-deliberate-omission) skills required for that role at level X — OR explicitly narrow `roles_aligned` to roles where the 70% bar is met.
5. Cite, in `required_activities` and `required_projects`, at least 2 distinct credential-eligible activities per critical_competency (per GAP-P0-006).

Badges that fail 1–3 today are flagged `overclaimed`/`strengthen` in the claim matrix. Badges that fail 4–5 are flagged in the gap report.

---

## 7. Market expectations specific to supervisor / cohort features (preview for Phase 2)

Although Phase 2 will research this in depth, the industry brief surfaces three market expectations that already constrain badge design:

1. **Employer-verifiable badges.** Employers paying for Team subscriptions expect to verify a learner's badge without logging in as the learner. This requires either a public verification URL (signed JSON) or a manager-facing dashboard. Neither exists today (Phase 0 finding F001).
2. **Cohort-completion reporting.** Employers expect a "cohort completion report" showing which learners in a sponsored cohort have earned which badges by when. This requires a `Cohort` model + a `BadgeAward` persistence model. Neither exists today (Phase 0 finding F003).
3. **Skill-gap reporting per learner.** Employers expect to see, per learner, which badges they're close to earning and which critical competencies are blocking them. This requires the eligibility engine to persist evaluation reports, not just awards. Today the engine is in-memory only.

These expectations will be fleshed out in `product_hardening/supervisor/product_requirements.md` (Phase 2 deliverable).

---

## 8. Acceptance criteria for the badge catalog (post-Phase-1)

A future Phase 3+ sprint that closes the badge gaps MUST produce a catalog where:

- [ ] Zero badges list a P0-blocked skill in `skill_nodes`.
- [ ] Zero badges claim a P0-blocked critical_competency.
- [ ] Every `cross_section_capability` and `capstone_credential` badge either covers ≥70% of in-scope role-required skills at its level OR has narrowed `roles_aligned`.
- [ ] Every badge has ≥2 distinct credential-eligible activities per cited critical_competency.
- [ ] Every badge lists its `non_claims` covering deliberate oissions (R, Excel-as-analyst-tool, UiPath Studio, etc.) where relevant.
- [ ] Every `verified_credential` badge has a public verification URL (signed JSON) — infrastructure to be designed in Phase 3+.
- [ ] Every badge award is persisted in a Prisma `BadgeAward` model with evidence trail.

Until all seven boxes are ticked, the catalog is a specification, not a shippable product feature.
