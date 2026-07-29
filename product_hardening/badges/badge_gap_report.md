# Phase 1 — Badge Gap Report

**Phase:** 1 (Badge Market Revalidation)  
**Author:** `product_hardening` agent (Solarized Phase 1)  
**Date:** 2026-07-29  
**Source:** `product_hardening/badges/badge_claim_matrix.json` (31 badges evaluated)

This report lists every badge that needs changes before it can be honestly issued, ranked by severity. It also records the badges that need no changes (the "retain" set). All decisions are recommendations — no source code is modified in Phase 1 (per decision D-003).

---

## 0. Executive summary

| Metric | Count |
|---|---:|
| Total badges evaluated | 31 |
| Defensible (retain as-is) | 15 |
| Overclaimed (must strengthen before issuing) | 16 |
| Underclaimed (rename to disclose covered skills) | 0 |
| Recommended split | 0 |
| Recommended retirement | 0 |

**Bottom line:** No badge needs to be retired, renamed, or split. Sixteen badges — every one that claims a critical competency blocked by a P0 curriculum gap — must be **strengthened** by closing the underlying P0 gap before they can be honestly issued at their claimed level. The remaining 15 (motivational markers, narrow applied skills that don't claim blocked competencies, and the foundational capstone) are defensible as-is.

The single highest-leverage fix is closing the four P0 curriculum gaps (GAP-P0-001 through GAP-P0-004), which would unblock 16 badges at once.

---

## 1. The 16 overclaimed badges (decision: strengthen)

All 16 overclaimed badges share the same root cause: they claim a `critical_competency` whose underlying skill is P0-blocked (i.e., the curriculum does not teach that skill as a named, assessed concept). The matrix's `critical_competencies_with_p0_blockers` field on each badge identifies which competency and which skill is blocked.

### 1.1 P0-blocked critical competencies (root cause)

| Critical competency | P0-blocked skill | Curriculum gap ID | Affected badges |
|---|---|---|---|
| `leakage_prevention` | `leakage_prevention` | GAP-P0-001 | 5 (see below) |
| `type_safety_production_hardening` | `python_type_safety` | GAP-P0-002 | 5 (see below) |
| `sql_competency` | `sql_performance_tuning` | GAP-P0-003 | 5 (see below) |
| `selector_resilience` | `reframework` | GAP-P0-004 | 2 (see below) |

### 1.2 Per-badge gap detail

#### 1.2.1 Badges blocked by `leakage_prevention` (GAP-P0-001)

These badges claim `critical_competency: leakage_prevention`. The curriculum teaches train/test split mechanics (S10) and cross-validation (S33) but never names leakage as a concept, never asks the learner to identify a leakage mode in a foreign pipeline, and never has them write a leakage-prevention test.

| Badge | Family | Level | Also blocked by |
|---|---|---|---|
| `reliable_automation_development` | applied_skill | foundation | `selector_resilience` (GAP-P0-004) |
| `responsible_machine_learning_evaluation` | applied_skill | independent_practitioner | — |
| `applied_deep_learning_practice` | applied_skill | advanced_applied | — |
| `integrated_data_science_practice` | cross_section_capability | independent_practitioner | `sql_competency` (GAP-P0-003) |
| `integrated_ml_engineering_practice` | cross_section_capability | advanced_applied | — |
| `integrated_python_ai_capstone_integrated_mastery` | capstone_credential | integrated_mastery | all four |
| `evidence_grounded_ai_systems_capstone` | capstone_credential | integrated_mastery | all four |

**Required action (Phase 3+):** Insert the leakage-prevention theory block + 3 We Do exercises + You Do extension in S10/S33/S39 per GAP-P0-001. Until then, these badges MUST NOT be issued at their claimed level; the engine's `evaluate()` should return `eligible: false` with a `blocking_reason` that names the gap.

#### 1.2.2 Badges blocked by `type_safety_production_hardening` (GAP-P0-002)

These badges claim `critical_competency: type_safety_production_hardening`. The curriculum mentions type hints in S05/S15 code blocks but never teaches mypy/Pyright as a discipline, never has the learner configure mypy in pyproject.toml, and never gates CI on `mypy --strict`.

| Badge | Family | Level | Also blocked by |
|---|---|---|---|
| `production_python_delivery_foundations` | applied_skill | independent_practitioner | — |
| `production_python_hardening_practice` | applied_skill | advanced_applied | — |
| `container_platform_engineering_practice` | applied_skill | integrated_mastery | — |
| `integrated_production_python_practice` | cross_section_capability | advanced_applied | — |
| `integrated_python_ai_capstone_integrated_mastery` | capstone_credential | integrated_mastery | all four |
| `evidence_grounded_ai_systems_capstone` | capstone_credential | integrated_mastery | all four |

**Required action (Phase 3+):** Insert the type-annotations theory block + 3 We Do exercises + mypy CI gate in S15/S17/S43 per GAP-P0-002.

#### 1.2.3 Badges blocked by `sql_competency` (GAP-P0-003)

These badges claim `critical_competency: sql_competency`. The curriculum teaches `sql_fundamentals` (S19/S37) and `sql_window_ctes` (S37, thin) but never teaches `sql_performance_tuning` — no EXPLAIN, no index strategy, no N+1 detection, no materialized-view design.

| Badge | Family | Level | Also blocked by |
|---|---|---|---|
| `applied_sql_query_development` | applied_skill | independent_practitioner | — |
| `integrated_data_analyst_practice` | cross_section_capability | independent_practitioner | — |
| `integrated_data_science_practice` | cross_section_capability | independent_practitioner | `leakage_prevention` |
| `integrated_python_ai_capstone_integrated_mastery` | capstone_credential | integrated_mastery | all four |
| `evidence_grounded_ai_systems_capstone` | capstone_credential | integrated_mastery | all four |

**Required action (Phase 3+):** Insert the query-plans/EXPLAIN theory block + 3 We Do exercises + You Do extension in S37 per GAP-P0-003.

#### 1.2.4 Badges blocked by `selector_resilience` (GAP-P0-004)

These badges claim `critical_competency: selector_resilience`. The curriculum teaches `selector_design` (S24, thin) and `exception_handling_rpa` (S13/S24) but never teaches `reframework` — the durable state-machine pattern (init/get-transaction/process/end-process), dispatcher/performer split, retry scope, business-rule vs system-exception taxonomy.

| Badge | Family | Level | Also blocked by |
|---|---|---|---|
| `reliable_automation_development` | applied_skill | foundation | `leakage_prevention` (GAP-P0-001) |
| `integrated_automation_engineering_practice` | cross_section_capability | independent_practitioner | — |
| `integrated_python_ai_capstone_integrated_mastery` | capstone_credential | integrated_mastery | all four |
| `evidence_grounded_ai_systems_capstone` | capstone_credential | integrated_mastery | all four |

**Required action (Phase 3+):** Insert the state-machine theory block + 3 We Do exercises + You Do extension in S24 per GAP-P0-004.

#### 1.2.5 Capstone badges blocked at integrated_mastery

The two apex capstones — `integrated_python_ai_capstone_integrated_mastery` and `evidence_grounded_ai_systems_capstone` — claim critical competencies that span all four P0 blockers. They cannot be honestly issued until ALL FOUR P0 gaps are closed.

- `integrated_python_ai_capstone_integrated_mastery` claims `['reproducibility_determinism', 'communication_audience_tuned', 'business_framing_judgment', 'mlops_fluency']` — but at leadership level across all 5 roles, the role-skill taxonomy requires `leakage_prevention`, `python_type_safety`, `sql_performance_tuning`, and `reframework`. The badge MUST either narrow `roles_aligned` or wait for the P0 gaps to close.
- `evidence_grounded_ai_systems_capstone` explicitly claims ALL EIGHT critical competencies including the four P0-blocked ones. This is the most overclaimed badge in the catalog.

**Required action (Phase 3+):** Either (a) close all four P0 gaps before issuing these capstones, or (b) split each apex capstone into per-role capstones (e.g. `evidence_grounded_ai_systems_capstone__data_scientist`, `...__production_python_engineer`) that only claim the critical competencies reachable for that role at that level. Option (b) avoids the all-or-nothing gate but multiplies the badge count.

---

## 2. The 15 defensible badges (decision: retain)

These badges need no immediate changes. They are either:

- Motivational markers with explicit `non_claims` disclaiming role-readiness (5 progress_achievement badges).
- Narrow applied-skill badges whose `skill_nodes` do not list any P0-blocked skill and whose `critical_competencies` do not include any P0-blocked competency (7 applied_skill badges).
- The foundational capstone, whose roles_aligned covers all 5 roles at foundation level (where no P0-blocked skill is yet required by the role-skill taxonomy) (1 capstone_credential badge).
- Two capstones at independent/advanced level whose `critical_competencies` are all in the "PASS" set (reproducibility, communication, business_framing, mlops_fluency) but whose `roles_aligned × leadership-level` coverage still triggers P0 missing — wait, let me re-check.

Wait — re-checking the matrix: `integrated_python_ai_capstone_independent` and `integrated_python_ai_capstone_advanced_applied` are both flagged `overclaimed` because their `roles_aligned` covers all 5 roles and at independent/advanced level, several roles require P0-blocked skills (leakage_prevention, python_type_safety, sql_performance_tuning, reframework).

Let me recount the defensible capstones:

| Badge | Family | Status | Why defensible |
|---|---|---|---|
| `integrated_python_ai_capstone_foundations` | capstone_credential | defensible | At foundation level, no role requires a P0-blocked skill. Critical_competencies (reproducibility, communication) are both PASS. |

So the 15 defensible badges are:

| # | Badge | Family | Why defensible |
|---|---|---|---|
| 1 | `progress_phase0_walked` | progress_achievement | Motivational marker; non_claims disclaim role-readiness. |
| 2 | `progress_phase1_walked` | progress_achievement | Same. |
| 3 | `progress_phase2_walked` | progress_achievement | Same. |
| 4 | `progress_phase3_walked` | progress_achievement | Same. |
| 5 | `progress_journey_completed` | progress_achievement | Same. |
| 6 | `python_data_foundations` | applied_skill | skill_nodes are all PASS skills; critical_competency is reproducibility (PASS). |
| 7 | `independent_data_preparation` | applied_skill | Same. |
| 8 | `applied_analytical_reasoning` | applied_skill | Same. |
| 9 | `applied_rag_llm_service_development` | applied_skill | Same. |
| 10 | `reliable_async_python_development` | applied_skill | Same. |
| 11 | `applied_mlops_pipeline_delivery` | applied_skill | Critical_competency mlops_fluency is PASS. |
| 12 | `architecture_decision_practice` | applied_skill | Critical_competencies business_framing_judgment, communication_audience_tuned, reproducibility — all PASS. |
| 13 | `llmops_production_delivery` | applied_skill | Same as 11. |
| 14 | `ai_governance_code_review_practice` | applied_skill | Same as 12. |
| 15 | `integrated_python_ai_capstone_foundations` | capstone_credential | Foundation-level role requirements contain no P0-blocked skills. |

---

## 3. Infrastructure gaps (apply to ALL 31 badges)

These gaps are not per-badge; they apply to the entire badge system. They are recorded here because they block the catalog from being a shippable product feature, regardless of how clean each badge's claim becomes.

### 3.1 No persisted badge-award store

- **Status:** Phase 0 finding F003.
- **Impact:** Every badge in the catalog is "issuable" in engine memory only. A server restart or a static-page refresh wipes any awarded badge. No learner can prove they earned a badge.
- **Required action (Phase 3+):** Add a Prisma `BadgeAward` model keyed by `(userId, badgeId, edition)` with `awardedAt`, `evidenceHash`, `revokedAt?`. Issue awards via an authenticated API route that runs `awardIdempotent()` and persists the result. Mirror to Firestore via `syncBadgeAward()` (per ADR-001 compliance gate 5).

### 3.2 No badge UI on the static export

- **Status:** Phase 0 finding (Q14).
- **Impact:** Even if awards were persisted, the public site (which is the static export) has no "your badges" page, no badge gallery, no per-badge detail page.
- **Required action (Phase 3+):** Add a `/badges` route (static-export-safe) that reads the catalog and renders badge cards with claim/non_claims/requirements. Add a `/me/badges` route (dynamic-only) that reads the learner's `BadgeAward` records and renders earned vs. in-progress badges with blocking reasons.

### 3.3 No public verification URL

- **Status:** Industry expectation §5.6 / §7.1.
- **Impact:** Employers cannot verify a learner's badge without logging in as the learner (which is forbidden). This blocks the Team-plan "manager reports" promise (Phase 0 finding F001).
- **Required action (Phase 3+):** Each `BadgeAward` gets a `verificationCode` (random 32-byte hex) and a public route `/verify/[code]` that returns a signed JSON: `{ badge_id, name, awarded_at, learner_email_hash, evidence_hash, signature }`. The signature is HMAC-SHA256 with a server secret. The static export can fetch and render this JSON without a dynamic backend.

### 3.4 No cohort-completion report

- **Status:** Industry expectation §7.2; Phase 0 finding F001.
- **Impact:** Employers paying for Team subscriptions cannot see which learners in a sponsored cohort have earned which badges by when.
- **Required action (Phase 4+):** Depends on the supervisor feature designed in Phase 2. Add a `Cohort` model + `CohortMembership` + a manager-facing dashboard route.

### 3.5 Critical-competency evidence thinness (GAP-P0-006)

- **Status:** Curriculum gap matrix §3 P0.
- **Impact:** Four critical competencies (`sql_competency`, `leakage_prevention`, `selector_resilience`, `type_safety_production_hardening`) have credential-eligible activities from only 1–3 sections each. Even after the per-skill P0 gaps close, the badge issuance would be one-section-deep for these competencies.
- **Required action (Phase 3+):** Ensure each critical competency has ≥2 distinct credential-eligible activities from ≥2 distinct sections. Static check on the curriculum graph.

### 3.6 S40 ID mismatch (DIV-001, GAP-P0-005)

- **Status:** Curriculum gap matrix §3 P0.
- **Impact:** `prisma/seed.ts` line 11743 stores section ID `agentic-architecture` but the section source file is `s40-architecture-ddd-decisions.ts` with ID `architecture-ddd-decisions`. Learners completing S40 You Do on the dynamic LMS cannot trigger exam credit. This blocks the CP-N4-A capstone completion evidence on the live LMS.
- **Required action (Phase 3+):** One-line fix in `prisma/seed.ts` line 11743: change `agentic-architecture` to `architecture-ddd-decisions`. Add a regression test asserting `prisma seed id === section source id` for all 52 sections. (This is the cheapest P0 fix in the entire gap matrix and should be the first commit of Phase 3.)

---

## 4. Decision roll-up

| Decision | Count | Badges |
|---|---:|---|
| retain | 15 | All `progress_achievement` (5), 9 narrow `applied_skill` badges (python_data_foundations, independent_data_preparation, applied_analytical_reasoning, applied_rag_llm_service_development, reliable_async_python_development, applied_mlops_pipeline_delivery, architecture_decision_practice, llmops_production_delivery, ai_governance_code_review_practice), 1 `capstone_credential` (integrated_python_ai_capstone_foundations). |
| strengthen | 16 | All `cross_section_capability` (5: integrated_data_analyst_practice, integrated_data_science_practice, integrated_ml_engineering_practice, integrated_automation_engineering_practice, integrated_production_python_practice), 4 `capstone_credential` (integrated_python_ai_capstone_independent, _advanced_applied, _integrated_mastery, evidence_grounded_ai_systems_capstone), 7 `applied_skill` (reliable_automation_development, applied_sql_query_development, production_python_delivery_foundations, responsible_machine_learning_evaluation, production_python_hardening_practice, applied_deep_learning_practice, container_platform_engineering_practice). |
| rename | 0 | — |
| split | 0 | (Optionally considered for `evidence_grounded_ai_systems_capstone` — see §1.2.5 — but recommended to strengthen rather than split.) |
| merge | 0 | — |
| retire | 0 | — |

---

## 5. Recommended Phase 3+ execution order

Ranked by leverage (badges unblocked per unit of curriculum work):

1. **Fix DIV-001** (one-line seed fix). Unblocks S40 exam → unblocks CP-N4-A capstone evidence. ~5 minutes of work + a regression test.
2. **Close GAP-P0-001 (leakage_prevention)** in S10/S33/S39. Unblocks 5 badges (responsible_machine_learning_evaluation, applied_deep_learning_practice, integrated_data_science_practice, integrated_ml_engineering_practice, evidence_grounded_ai_systems_capstone) + contributes to 1 more (reliable_automation_development).
3. **Close GAP-P0-002 (python_type_safety)** in S15/S17/S43. Unblocks 5 badges (production_python_delivery_foundations, production_python_hardening_practice, container_platform_engineering_practice, integrated_production_python_practice, evidence_grounded_ai_systems_capstone).
4. **Close GAP-P0-003 (sql_performance_tuning)** in S37. Unblocks 4 badges (applied_sql_query_development, integrated_data_analyst_practice, integrated_data_science_practice, evidence_grounded_ai_systems_capstone).
5. **Close GAP-P0-004 (reframework)** in S24. Unblocks 3 badges (reliable_automation_development, integrated_automation_engineering_practice, evidence_grounded_ai_systems_capstone).
6. **Add Prisma `BadgeAward` model + issuing API route** (infrastructure gap 3.1). Unblocks ALL 31 badges from being shippable.
7. **Add badge UI on static export** (infrastructure gap 3.2). Makes the 15 defensible badges visible to learners.
8. **Add public verification URL** (infrastructure gap 3.3). Enables employer verification — prerequisite for the Team-plan "manager reports" promise.
9. **Close GAP-P0-006** (≥2-section critical-competency evidence). Strengthens the integrity of all 16 strengthened badges.

After steps 1–5 are complete, all 16 overclaimed badges become issuable (decision flips from `strengthen` to `retain`). After step 6, the catalog becomes a shippable product feature. After steps 7–8, the Team-plan marketing bullet "Reportes de progreso para managers" can be honestly redeemed.

---

## 6. Acceptance criteria for this report

- [x] Every overclaimed badge has its root-cause P0 gap identified.
- [x] Every defensible badge has its defense articulated.
- [x] No source code is modified (per decision D-003).
- [x] Infrastructure gaps are listed separately from per-badge gaps.
- [x] Execution order is ranked by leverage.
