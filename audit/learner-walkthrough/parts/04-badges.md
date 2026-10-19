## 4. Badges

Sources: `src/lib/eligibility/badge_catalog.json` (31 badges, v1.0.0), `badge-specs.ts`,
`claim_evidence_contracts/*.json`, `src/lib/credential-gates.ts`, the learner pages `/badge-notice`
and `/credential-policy`, and the Dashboard's «Sobre los badges» card. Section titles below are the
**current** ones (from `src/lib/course/index.ts`), not the stale id slugs.

### 4.0 Facts that apply to every badge

- **T1 — The learner is never told what a specific badge asks of her [O].** No page lists the 31
  badges, their criteria or their floors (searched `src/app`, `src/components`; the only consumer of
  the catalog is the server route `src/app/api/credentials/issue`). The per-badge
  `newbie_friendly_description` exists only in the catalog and is **in English**. The
  `/badge-notice` page promises «puedes ver una vista previa de tu elegibilidad para insignias»; no
  component uses the eligibility engine (`src/lib/eligibility/engine.ts`), so that preview does not
  exist. Open Badges 3.0 expects `criteria` the earner can read; here she cannot.
- **T2 — The thresholds she is told are not the ones that count [O].** Dashboard: «Alcanzaste el
  umbral de la rúbrica (70% o más)». Self-check: «Si sacas 70% o más, desbloqueas la siguiente
  sección». Catalog floors: self-check 85, You Do 80, exam 85, integrator 85, critical 100, defense
  100. (W08)
- **T3 — Most of the evidence cannot be produced or recorded on this build [O].**
  - Exams: not reachable for a signed-in Pro learner (W02); where the bank is used, «always B» passes
    in 31 of 52 sections (W09).
  - Self-check: stored only in her browser/progress doc.
  - You Do: completion is the button «Proyecto enviado a mi GitHub», self-declared; nothing is submitted
    or checked.
  - Integrator projects (`BADGE:<id>:integrator`): described only in internal files
    (`industry_alignment/badge_requirements/*.md`), never shown to the learner.
  - Defense: no mechanism anywhere in the app.
  - «Pruebas ocultas» claimed by 15 competency badges: none exist (We Do has no runner, W05).
  - `src/lib/credential-gates.ts` says so itself: «Self-checks, You Do rubrics, the integrator project,
    the defense and prerequisite badges are not [recorded], so a credential is not issued until each of
    them has a verifier here.»
- **T4 — The section mapping predates the section renames [O].** Badges list sections by number,
  and the numbers' topics changed. The catalog was generated 2026-07-28, before the V3 re-sequencing
  that `src/lib/section-id-migrations.ts` records. 19 of the 21 competency badges (rows 6–26) require at least
  one section that does not teach the claimed skill (table below).
- **T5 — Placeholders in the evidence contracts [O] (MUST, §6).** All 31
  `claim_evidence_contracts/*.json` have `specification_hash` of the literal form
  `"sha256:<badge_id>:<version>"` (not a hash), and an empty `market_task_mappings: []`.
  `catalog.ts` points capstones at badge ids that do not exist in the catalog (`capstone_foundations`,
  `capstone_independent`, …).

**Badge verdict:** today no learner can earn a competency badge or a capstone credential, because
the evidence cannot be produced (T3). If it could, 19 of the 21 competency badges would certify skills their required sections do not teach (T4), against exams that a test-wise
learner passes without the skill (W09), with criteria she never sees (T1). The progress markers
(class A) are the only honest ones, and even they require exams their own claims do not mention.

### 4.1 One row per badge

"Told" is the same for every row (T1: nothing badge-specific in the UI), so the column states only
what differs. "Assessed" lists the catalog's components; their availability is T3.

| # | Badge (status) | What it claims | Told | Where the course teaches it | Where it is assessed | Gap |
|---|---|---|---|---|---|---|
| 1 | `progress_phase0_walked` (active, local) | Completed S01–S13 «including the You Do project and self-check» | T1 | S01–S13 | progress store; activities also list S01–S13 **EXAM** | Claim omits the 13 exams it requires; exams unreachable (W02); W01 un-completes sections. |
| 2 | `progress_phase1_walked` | Completed S14–S26 incl. You Do, self-check, exam | T1 | S14–S26 | progress store + CP-N2-A/B/C | Requires three capstones; there is no capstone submission anywhere. |
| 3 | `progress_phase2_walked` | Completed S27–S39 … | T1 | S27–S39 | progress store + CP-N3-A/B/C | Same as 2. |
| 4 | `progress_phase3_walked` | Completed «S40 through S52» | T1 | S40–S52 | `required_sections` stops at **S51** | Claim says 13 sections; requirement lists 12. |
| 5 | `progress_journey_completed` | «El aprendiz completó las secciones asignadas de esta fase del curso.» | T1 | all | all sections + 13 capstones | Claim text is the generic phase template, wrong for a whole-course marker. |
| 6 | `python_data_foundations` (active) | Setup, Git, idiomatic Python, «use functions and modules», «write basic tests» | T1 | setup/Git S01; idioms S02–S06; functions S05; **modules S10; tests S27** | S01–S05 You Do + exams | Modules and tests are claimed but not in S01–S05. Exams S01–S05 have balanced key positions but the key is the longest option in 18–23 of 24. Critical `reproducibility_determinism`: S01 yes, S03–S04 barely (reading S03–S05). |
| 7 | `independent_data_preparation` (active) | Clean messy data «using pandas … and NumPy», descriptive statistics | T1 | NumPy S14, pandas S15–S16, EDA S18 | **S06, S07, S08**, S18 | S06–S08 are plain-Python collections/text/files and say they exclude pandas; only S18 fits. S14–S16 not required. |
| 8 | `applied_analytical_reasoning` (active) | Charts, a BI dashboard, train a classical ML model | T1 | viz S19; ML S33–S36; no BI tool taught | **S09 (exceptions), S10 (CLI)** | Nothing claimed is in the required sections. |
| 9 | `reliable_automation_development` (active) | Browser automation that survives UI change; critical `selector_resilience` | T1 | **selectors S23** | **S13 (evidence dashboard), S24 (OCR)** | The only selector section (S23) is not required. |
| 10 | `applied_sql_query_development` (pilot) | SELECT, JOIN, GROUP BY, windows, CTEs | T1 | SQL intro S12, **SQL S29** | **S19 (visualisation), S37 (profiling)** | No SQL in either required section; S19/S37 exams have no SQL items (reading S19). |
| 11 | `production_python_delivery_foundations` (pilot) | Packaging, CI/CD, a FastAPI service, tests | T1 | packaging S10; FastAPI S41; CI/CD S44; tests S27 | **S15 (pandas), S17 (joins), S21 (documents)** | None of the claim is in the required sections. |
| 12 | `responsible_machine_learning_evaluation` (pilot) | Train RF and «PyTorch or TensorFlow» models, evaluate honestly | T1 | ML S33–S35; **no deep learning anywhere** | **S10 (CLI), S23 (Playwright)** | Earnable with CLI + Playwright knowledge (reading S23). Deep learning untaught. |
| 13 | `applied_rag_llm_service_development` (active) | A RAG app exposed as a FastAPI service | T1 | RAG S48; FastAPI S41 | **S20 (Excel), S21 (documents)** | No RAG, LLM or FastAPI item in S20/S21 exams (reading S20–S21). |
| 14 | `reliable_async_python_development` (active) | async/await, pytest-asyncio, LLM agents | T1 | concurrency S38; agents S49; pytest S27 | S27, S28, **S31 (graphs)** | Async is not in S27/S28/S31. |
| 15 | `applied_mlops_pipeline_delivery` (active) | Serve a model with health checks, drift, retrain | T1 | containers S43; MLOps S47 | **S29 (SQL)**, S43 | S47 (MLOps) not required; S29 is SQL. Partial. |
| 16 | `production_python_hardening_practice` (pilot) | OWASP, observability, cloud deploy | T1 | security S42; supply chain S44; cloud S45; observability S38/S51 | **S30 (ER), S32 (features)**, S38 | Only S38 fits. |
| 17 | `applied_deep_learning_practice` (pilot) | CNNs/transformers with PyTorch/TensorFlow; calibration | T1 | **not taught**; calibration S34 | S33, S34 | Deep learning is not in the current curriculum at all. |
| 18 | `architecture_decision_practice` (active) | System design, DDD, trade-off ADRs | T1 | S40 | **S35 (explainability)**, S40 | S40 fits; S35 does not. Partial. |
| 19 | `llmops_production_delivery` (active) | «fine-tuning, graph-RAG, drift monitoring, observability» | T1 | RAG S48; evals S50; observability S51; **fine-tuning and graph-RAG not taught** | **S41 (FastAPI), S42 (schemas), S43 (containers)** | Required sections were `llm-finetuning`, `graph-rag`, `llmops` by slug; they now teach other things. |
| 20 | `container_platform_engineering_practice` (pilot) | Docker + Kubernetes via CI/CD | T1 | containers S43; CI/CD S44; infra S45 | S45, **S46 (data orchestration)** | S43/S44 not required. Kubernetes: not verified as taught. Partial. |
| 21 | `ai_governance_code_review_practice` (active) | Review AI code, open-source PRs, AI governance | T1 | governance S51; red teaming S50; supply chain S44 | **S47 (MLOps), S48 (RAG), S49 (agents)** | Slugs were `opensource`, `ai-governance`, `data-contracts`. Partial at best. |
| 22 | `integrated_data_analyst_practice` (active) | End-to-end DA: SQL, pandas, stats, viz, BI | T1 | SQL S29; pandas S15–S17; EDA S18; viz S19 | S06–S10, S19, **S37**; critical `sql_competency` | Requires `applied_sql_query_development` (row 10), so the SQL gate rests on S19/S37. The persona's target badge, and the most misaligned for her. |
| 23 | `integrated_data_science_practice` (pilot) | DA + train/evaluate a model + model card | T1 | ML S32–S36 | S06–S10, S19, **S23**, S37 | No ML section required. |
| 24 | `integrated_ml_engineering_practice` (pilot) | Train, deploy behind API, CI/CD retrain, monitor | T1 | S32–S36, S41, S43, S44, S47 | S09, S10, **S20, S21, S23**, S29, S43 | Only S43 fits. |
| 25 | `integrated_automation_engineering_practice` (active) | Process decomposition, a bot that survives UI change, tested service | T1 | Excel S20, docs S21, email S22, RPA S23, OCR S24, orchestration S26 | S13, S20, S21, S24 | Closest to aligned; misses S23 (selectors, the critical gate) and S26. |
| 26 | `integrated_production_python_practice` (pilot) | Package, containerise, deploy via CI/CD, observability, OWASP | T1 | S10, S42–S45, S51 | S15, S17, S21, S27, S28, S30, S32, S38 | Testing (S27/S28) and S38 fit; packaging, containers, CI/CD, security not required. |
| 27 | `integrated_python_ai_capstone_foundations` (verified) | Capstone + defense, public verification | T1 | S01–S13 (aligned) | S01–S13 + CP-N1-A/B/C + defense | **Cannot be earned at the end of L1**: prerequisite `reliable_automation_development` requires S24 (L2). `catalog.ts` names its badge `capstone_foundations`, which does not exist. |
| 28 | `integrated_python_ai_capstone_independent` (verified) | Same, L2 | T1 | S14–S26 (aligned) | + prerequisites | **Not earnable at end of L2**: prerequisite `applied_sql_query_development` requires S37 (L3); prerequisites promise RAG and deep learning (reading S26). |
| 29 | `integrated_python_ai_capstone_advanced_applied` (verified) | Same, L3 | T1 | S27–S39 (aligned) | + prerequisites | **Not earnable at end of L3**: prerequisite `applied_mlops_pipeline_delivery` requires S43 (L4); `applied_deep_learning_practice` is untaught. |
| 30 | `integrated_python_ai_capstone_integrated_mastery` (verified) | Same, L4 | T1 | S40–S51 (aligned) | + prerequisites | Prerequisites inherit rows 19–21's mismatches. |
| 31 | `evidence_grounded_ai_systems_capstone` (verified) | CP-FINAL defended on all 8 critical competencies | T1 | S52 | S52 + every integrated badge | Inherits every gap above; the final credential stands on rows 10, 12, 17 and 19, which are untaught or mis-mapped. |

**Proposed fixes (badges):**
- `src/lib/eligibility/badge_catalog.json` and `claim_evidence_contracts/*.json`: remap
  `required_sections` from current titles, e.g. SQL → S12+S29, selectors → S23, ML evaluation →
  S33–S35, RAG → S48, FastAPI → S41. Mark `applied_deep_learning_practice` and the
  fine-tuning/graph-RAG part of `llmops_production_delivery` as `retired` or `planned` until taught.
  This changes what a credential claims, which AGENTS.md puts under "Ask first", so it is the owner's
  decision.
- Translate `newbie_friendly_description` to Spanish and show it, with the floors, on a badges page
  wired to `EligibilityEngine` (the preview `/badge-notice` already promises).
- Make prerequisite chains respect level order (rows 27–29).
- Replace placeholder `specification_hash` values with real hashes of the spec.
