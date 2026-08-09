# Phase 3 — Complete Curriculum Skill Graph Summary

**Generated:** 2026-07-28T21:36:53.116411+00:00  
**Generator:** curriculum_graph_builder node (Phase 3)

## 1. Source Inventory

- Canonical section files parsed: **52**
- Course index: `src/lib/course/index.ts`
- Sections directory: `src/lib/course/sections`
- Industry skill graph (Phase 2): `industry_alignment/industry_skill_graph.json`
- Industry skill node vocabulary size: **62**

## 2. Totals

| Resource | Count |
|---|---:|
| Sections | 52 |
| Theory blocks | 476 |
| I Do demos | 416 |
| We Do exercises (E1+E2+E3 variants) | 1248 |
| You Do projects | 52 |
| Self-check questions | 389 |
| Topic evaluations (inline) | 12 |
| Implicit exam activities (server-graded MCQ) | 52 |
| Total learning activities (incl. exams) | 2320 |
| Total skill edges | 4372 |
| Capstones referenced (CP-N*-X) | 13 |
| Credential-eligible activities | 104 |
| Estimated total course hours | 1040 |

## 3. Activities by Type (across all 52 sections)

| Activity type | Count |
|---|---:|
| `we_do` | 1248 |
| `theory` | 476 |
| `i_do` | 416 |
| `self_check` | 52 |
| `exam` | 52 |
| `you_do` | 49 |
| `topic_evaluation` | 24 |
| `capstone` | 3 |

## 4. Activities by Phase × Type

| Phase | theory | i_do | we_do | you_do | self_check | topic_evaluation | exam | capstone |
|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| 0 | 123 | 104 | 312 | 13 | 13 | 16 | 13 | 0 |
| 1 | 118 | 104 | 312 | 12 | 13 | 0 | 13 | 1 |
| 2 | 118 | 104 | 312 | 12 | 13 | 8 | 13 | 1 |
| 3 | 117 | 104 | 312 | 12 | 13 | 0 | 13 | 1 |

## 5. Edge Inventory

| Edge type | Count | Description |
|---|---:|---|
| `reinforcement` | 1666 | Within-section theory→demo→exercise chain per subtopic |
| `transfer` | 1248 | We Do → You Do transfer of skill (within section) |
| `assessment` | 832 | Theory → Self-check / Exam assessment edge |
| `skill_application` | 294 | Section activity maps to an industry skill node |
| `badge_evidence` | 104 | Activity contributes evidence to a phase-level badge |
| `skill_reinforcement` | 89 | Consecutive sections teaching the same skill reinforce it |
| `project_application` | 52 | You Do project applied to the section's exam scope |
| `prerequisite` | 51 | Sequential section→section pipeline edge (S1→S2→...→S52) |
| `capstone_integration` | 36 | Per-phase integrator section (S26/S39/S51) closes the phase capstone |

## 6. Capstone Inventory

| Capstone ID | Sections contributing |
|---|---|
| `CP-FINAL` | S52 |
| `CP-N1-A` | S01, S02, S03, S04 |
| `CP-N1-B` | S05, S06, S07, S08, S10 |
| `CP-N1-C` | S09, S11, S12, S13 |
| `CP-N2-A` | S14, S15, S16, S18, S26 |
| `CP-N2-B` | S18, S19, S20, S21 |
| `CP-N2-C` | S22, S23, S24, S25, S26 |
| `CP-N3-A` | S27, S28, S29, S30 |
| `CP-N3-B` | S31, S32, S33, S34 |
| `CP-N3-C` | S35, S36, S38, S39 |
| `CP-N4-A` | S40, S41, S42, S43 |
| `CP-N4-B` | S44, S45, S46, S47 |
| `CP-N4-C` | S48, S49, S50, S51, S52 |

## 7. Skill Node Coverage

- Industry skill nodes covered by at least one section: **46/62**
- Industry skill nodes NOT covered by any section (16):
  - `automation_anywhere`
  - `causal_inference`
  - `excel_spreadsheets`
  - `experimental_design`
  - `feature_engineering`
  - `hypothesis_testing`
  - `leakage_prevention`
  - `orchestrator_operations`
  - `power_automate`
  - `python_type_safety`
  - `r_language`
  - `reframework`
  - `regression`
  - `sql_performance_tuning`
  - `uipath_studio`
  - `vbdotnet_csharp`

Top-20 skill nodes by activity count:

| Skill node | Activity count |
|---|---:|
| `python_core` | 769 |
| `data_cleaning` | 310 |
| `llmops` | 308 |
| `python_idioms` | 272 |
| `data_validation` | 265 |
| `system_design` | 265 |
| `python_async` | 265 |
| `deep_learning` | 264 |
| `observability` | 229 |
| `security_mindset` | 196 |
| `classical_ml` | 176 |
| `stakeholder_translation` | 176 |
| `architecture_leadership` | 176 |
| `packaging_reproducibility` | 145 |
| `cloud_platform` | 140 |
| `pandas_numpy` | 133 |
| `testing_discipline` | 132 |
| `code_review_literacy` | 132 |
| `performance_tuning` | 132 |
| `python_rpa_browser` | 132 |

## 8. Per-Section Inventory (52 rows)

| # | ID | Phase | Title | Theory | I Do | We Do | Self-check | You Do | Capstone | TE |
|---:|---|---:|---|---:|---:|---:|---:|---|---|---:|
| 1 | `setup` | 0 | Checklist de máquina limpia CP-N1-A | 13 | 8 | 24 | 8 | ✓ | CP-N1-A | 4 |
| 2 | `basics` | 0 | Suite  | 9 | 8 | 24 | 11 | ✓ | CP-N1-A | 4 |
| 3 | `data-structures` | 0 | Test rojo: frontera inclusiva en edad 18 | 9 | 8 | 24 | 8 | ✓ | CP-N1-A | 0 |
| 4 | `functions-modules` | 0 | Reescribe conteo n² a O(n) | 9 | 8 | 24 | 8 | ✓ | CP-N1-A | 0 |
| 5 | `oop` | 0 | Suite tabla para normalize_nombre | 9 | 8 | 24 | 8 | ✓ | CP-N1-B | 0 |
| 6 | `numpy` | 0 | Membership list vs. set y costo de n búsquedas | 9 | 8 | 24 | 9 | ✓ | CP-N1-B | 0 |
| 7 | `data-acquisition` | 0 | Sin afirmaciones de parentesco ni identidad | 10 | 8 | 24 | 10 | ✓ | CP-N1-B | 0 |
| 8 | `pandas` | 0 | run fail-closed con exit_code 0 o 1 | 10 | 8 | 24 | 11 | ✓ | CP-N1-B | 0 |
| 9 | `visualization` | 0 | Clave de idempotencia para re-ingesta | 9 | 8 | 24 | 11 | ✓ | CP-N1-C | 0 |
| 10 | `sklearn` | 0 | Endurecer defaults inseguros | 9 | 8 | 24 | 6 | ✓ | CP-N1-B | 0 |
| 11 | `testing` | 0 | Extraer decide_fraud; dejar solo signal_score | 9 | 8 | 24 | 6 | ✓ | CP-N1-C | 0 |
| 12 | `performance` | 0 | Distancia como geoseñal, no parentesco | 9 | 8 | 24 | 7 | ✓ | CP-N1-C | 0 |
| 13 | `rpa-automation` | 0 | Incidente PII y regresión N1 | 9 | 8 | 24 | 9 | ✓ | CP-N1-C | 0 |
| 14 | `security` | 1 | assert_allclose que debe fallar | 9 | 8 | 24 | 11 | ✓ | CP-N2-A | 0 |
| 15 | `stdlib-deep` | 1 | Hash del CSV exportado | 9 | 8 | 24 | 10 | ✓ | CP-N2-A | 0 |
| 16 | `wxpython-gui` | 1 | metrics.pass False si hay cuarentena | 9 | 8 | 24 | 8 | ✓ | CP-N2-A | 0 |
| 17 | `packaging` | 1 | Mini-integración join + cutoff + delta | 10 | 8 | 24 | 5 | ✓ | — | 0 |
| 18 | `data-engineering` | 1 | Nota post-filtro con seed 42 | 9 | 8 | 24 | 8 | ✓ | CP-N2-A, CP-N2-B | 0 |
| 19 | `databases-orm` | 1 | classify_claim por marco muestral | 9 | 8 | 24 | 5 | ✓ | CP-N2-B | 0 |
| 20 | `rag` | 1 | structural_ok: need es subconjunto | 9 | 8 | 24 | 8 | ✓ | CP-N2-B | 0 |
| 21 | `fastapi` | 1 | ready con all sobre la checklist | 9 | 8 | 24 | 8 | ✓ | CP-N2-B | 0 |
| 22 | `rapidfuzz-entity` | 1 | Audit create y retry_hit sin duplicar | 9 | 8 | 24 | 5 | ✓ | CP-N2-C | 0 |
| 23 | `computer-vision` | 1 | Payload de handoff actuable | 9 | 8 | 24 | 9 | ✓ | CP-N2-C | 0 |
| 24 | `rpa-advanced` | 1 | Gate mime/size y fallback human_rescan | 9 | 8 | 24 | 5 | ✓ | CP-N2-C | 0 |
| 25 | `streamlit-dashboards` | 1 | Score alto: signal_only, nunca fraud | 9 | 8 | 24 | 5 | ✓ | CP-N2-C | 0 |
| 26 | `integrator-phase1` | 1 | Paquete de defensa N2 value y CF-2 | 9 | 8 | 24 | 8 | ✓ | CP-N2-A, CP-N2-C | 0 |
| 27 | `async-concurrency` | 2 | De bug_repro a regression_test | 9 | 8 | 24 | 5 | ✓ | CP-N3-A | 0 |
| 28 | `llm-agents` | 2 | run(seed) determinista con sorted | 9 | 8 | 24 | 5 | ✓ | CP-N3-A | 0 |
| 29 | `mlops` | 2 | pending_count real con NOT EXISTS | 9 | 8 | 24 | 8 | ✓ | CP-N3-A | 0 |
| 30 | `security-infra` | 2 | Error slices de mayor conteo | 9 | 8 | 24 | 9 | ✓ | CP-N3-A | 4 |
| 31 | `streaming-data` | 2 | Política de escala: render o summarize | 9 | 8 | 24 | 10 | ✓ | CP-N3-B | 0 |
| 32 | `microservices` | 2 | Fail-closed: REQUEST_FEATURE_SET_ID hacia S33 | 10 | 8 | 24 | 10 | ✓ | CP-N3-B | 0 |
| 33 | `advanced-models` | 2 | REQUEST_GROUP_IDS sin lista de entidades | 9 | 8 | 24 | 7 | ✓ | CP-N3-B | 0 |
| 34 | `cv-ai-integration` | 2 | Fail-closed: REQUEST_ABSTAIN_BAND | 9 | 8 | 24 | 8 | ✓ | CP-N3-B | 0 |
| 35 | `system-design` | 2 | Fail-closed de override en cola | 9 | 8 | 24 | 8 | ✓ | CP-N3-C | 0 |
| 36 | `ai-apis-advanced` | 2 | Elegir P@k con labels ralos | 9 | 8 | 24 | 8 | ✓ | CP-N3-C | 0 |
| 37 | `dbt-bigquery` | 2 | Reporte: dataset y hardware incluidos | 9 | 8 | 24 | 5 | ✓ | — | 0 |
| 38 | `performance-extreme` | 2 | Runbook on-call con restart_worker | 9 | 8 | 24 | 9 | ✓ | CP-N3-C | 0 |
| 39 | `integrator-phase2` | 2 | Post mórtem blameless con acciones | 9 | 8 | 24 | 5 | ✓ | CP-N3-C | 0 |
| 40 | `architecture-ddd-decisions` | 3 | Fail-closed: NEGOTIATE_VERSION | 9 | 8 | 24 | 8 | ✓ | CP-N4-A | 0 |
| 41 | `llm-finetuning` | 3 | Gate edge: throttle o inspeccionar | 9 | 8 | 24 | 8 | ✓ | CP-N4-A | 0 |
| 42 | `graph-rag` | 3 | Cierre de ticket: CONTINUE o VERIFY_DELETION | 9 | 8 | 24 | 5 | ✓ | CP-N4-A | 0 |
| 43 | `llmops` | 3 | Auditar reporte de scan y límites | 9 | 8 | 24 | 5 | ✓ | CP-N4-A | 0 |
| 44 | `multimodal` | 3 | Fail-closed: asignar dueño del incidente | 9 | 8 | 24 | 5 | ✓ | CP-N4-B | 0 |
| 45 | `iac` | 3 | Decide FinOps: CONTINUE o COST_OWNER_REVIEW | 9 | 8 | 24 | 7 | ✓ | CP-N4-B | 0 |
| 46 | `gpu-computing` | 3 | Decide ops: CONTINUE o activa runbook | 9 | 8 | 24 | 5 | ✓ | CP-N4-B | 0 |
| 47 | `opensource` | 3 | Decide rollback: CONTINUE o REVIEW | 9 | 8 | 24 | 8 | ✓ | CP-N4-B | 0 |
| 48 | `ai-governance` | 3 | Responder: CONTINUE o TUNE budget | 9 | 8 | 24 | 7 | ✓ | CP-N4-C | 0 |
| 49 | `data-contracts` | 3 | Decide gate: CONTINUE o pedir humano | 9 | 8 | 24 | 7 | ✓ | CP-N4-C | 0 |
| 50 | `tech-leadership` | 3 | Decide ops: CONTINUE o INCIDENT | 9 | 8 | 24 | 10 | ✓ | CP-N4-C | 0 |
| 51 | `integrator-final` | 3 | Decide a11y: CONTINUE o enrutar contestación | 9 | 8 | 24 | 5 | ✓ | CP-N4-C | 0 |
| 52 | `career-strategy` | 3 | Decide bundle: CONTINUE o DEFENSE | 9 | 8 | 24 | 5 | ✓ | CP-FINAL, CP-N4-C | 0 |

## 8b. You Do Project Detail (per section)

| # | Hours | Objectives | Requirements | Rubric criteria | Capstone refs |
|---:|---:|---:|---:|---:|---|
| 1 | 18 | 4 | 9 | 5 | CP-N1-A |
| 2 | 18 | 6 | 8 | 4 | CP-N1-A |
| 3 | 18 | 5 | 7 | 6 | CP-N1-A |
| 4 | 18 | 5 | 6 | 6 | CP-N1-A |
| 5 | 18 | 5 | 6 | 6 | CP-N1-B |
| 6 | 18 | 5 | 6 | 5 | CP-N1-B |
| 7 | 20 | 5 | 8 | 6 | CP-N1-B |
| 8 | 18 | 5 | 10 | 6 | CP-N1-B |
| 9 | 19 | 6 | 9 | 6 | CP-N1-C |
| 10 | 18 | 6 | 8 | 6 | CP-N1-B |
| 11 | 19 | 5 | 9 | 6 | CP-N1-C |
| 12 | 19 | 5 | 6 | 5 | CP-N1-C |
| 13 | 19 | 8 | 8 | 5 | CP-N1-C |
| 14 | 18 | 4 | 6 | 6 | CP-N2-A |
| 15 | 18 | 4 | 9 | 6 | CP-N2-A |
| 16 | 18 | 5 | 8 | 6 | CP-N2-A |
| 17 | 18 | 7 | 6 | 7 | — |
| 18 | 18 | 5 | 7 | 6 | CP-N2-A, CP-N2-B |
| 19 | 19 | 5 | 11 | 6 | CP-N2-B |
| 20 | 18 | 6 | 6 | 6 | CP-N2-B |
| 21 | 18 | 5 | 7 | 6 | CP-N2-B |
| 22 | 19 | 4 | 7 | 6 | CP-N2-C |
| 23 | 19 | 5 | 5 | 6 | CP-N2-C |
| 24 | 19 | 4 | 9 | 6 | CP-N2-C |
| 25 | 19 | 4 | 4 | 6 | CP-N2-C |
| 26 | 19 | 5 | 6 | 7 | CP-N2-A, CP-N2-C |
| 27 | 19 | 5 | 5 | 6 | CP-N3-A |
| 28 | 19 | 4 | 6 | 6 | CP-N3-A |
| 29 | 18 | 4 | 8 | 6 | CP-N3-A |
| 30 | 18 | 5 | 5 | 8 | CP-N3-A |
| 31 | 18 | 5 | 8 | 8 | CP-N3-B |
| 32 | 18 | 4 | 5 | 7 | CP-N3-B |
| 33 | 18 | 4 | 4 | 7 | CP-N3-B |
| 34 | 18 | 4 | 6 | 7 | CP-N3-B |
| 35 | 18 | 5 | 4 | 7 | CP-N3-C |
| 36 | 19 | 4 | 4 | 7 | CP-N3-C |
| 37 | 19 | 4 | 4 | 7 | — |
| 38 | 19 | 4 | 6 | 7 | CP-N3-C |
| 39 | 19 | 8 | 6 | 9 | CP-N3-C |
| 40 | 20 | 4 | 8 | 6 | CP-N4-A |
| 41 | 20 | 4 | 8 | 6 | CP-N4-A |
| 42 | 20 | 4 | 8 | 6 | CP-N4-A |
| 43 | 20 | 4 | 8 | 6 | CP-N4-A |
| 44 | 20 | 4 | 8 | 6 | CP-N4-B |
| 45 | 20 | 4 | 9 | 6 | CP-N4-B |
| 46 | 20 | 5 | 7 | 6 | CP-N4-B |
| 47 | 20 | 4 | 8 | 6 | CP-N4-B |
| 48 | 20 | 4 | 8 | 6 | CP-N4-C |
| 49 | 20 | 6 | 8 | 6 | CP-N4-C |
| 50 | 20 | 4 | 8 | 6 | CP-N4-C |
| 51 | 20 | 4 | 8 | 6 | CP-N4-C |
| 52 | 80 | 4 | 10 | 6 | CP-FINAL, CP-N4-C |

## 9. Classification Heuristic (per activity type)

| Activity type | Independence | Strength | Authenticity | Feedback | Credential-eligible |
|---|---|---|---|---|---|
| theory | none | none | low | low | no |
| i_do | guided | weak | low | low | no |
| we_do E1 | guided | moderate | medium | medium | no |
| we_do E2 | partially_guided | moderate | medium | medium | no |
| we_do E3 | independent | moderate | medium | medium | no |
| you_do | independent | strong | high | medium | yes |
| self_check | independent | weak | low | medium | no |
| topic_evaluation | partially_guided | moderate | medium | medium | no |
| exam | independent | strong | low | low | yes |
| capstone (S26/S39/S51) | independent | strong | high | medium | yes |

## 10. Phase 3 Gate Check

- [x] All 52 canonical sections read
- [x] All sections have ≥1 theory block
- [x] All sections have ≥1 I Do step
- [x] All sections have ≥1 We Do exercise
- [x] All sections have a You Do project
- [x] All You Do projects have ≥1 objective
- [x] All You Do projects have ≥1 requirement
- [x] All You Do projects have ≥1 rubric criterion
- [x] All sections have ≥1 self-check question
- [x] All sections mapped to ≥1 industry skill node
- [x] Each activity classified with evidence_independence + strength + authenticity + feedback_quality + credential_eligible
- [x] Capstone integration edges present for S26, S39, S51
- [x] All 13 capstones referenced (CP-N1-A..CP-N4-C + CP-FINAL)

**Overall: PASS**

## 11. Handoff to Phase 4 (Gap Analysis)

Phase 4 should consume `curriculum_skill_graph.json` to:
1. Compare `skill_node_coverage.uncovered_skills` against `industry_skill_graph.json#skill_nodes` to identify durable industry gaps that the curriculum never addresses.
2. For each `industry_skill_graph.json#critical_competencies` entry, verify whether at least one `credential_eligible=true` activity maps to its `skill_ids` — otherwise the badge cannot be issued for that competency.
3. Use the `capstone_integration` edges to verify that every phase capstone (CP-N1-A, CP-N2-A/B/C, CP-N3-*) has at least one credential-eligible contribution from each section in the phase.
4. Audit `activities_by_type` to confirm the I Do / We Do / You Do ratio matches Gradual Release of Responsibility (target: We Do ≥ I Do ≥ You Do per section, with E1+E2+E3 variants present).
5. Flag sections whose `selfCheck.questionCount < 5` (V3 spec calls for 5 questions) — recorded but not gated here.
