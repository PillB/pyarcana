# G0 — findings measured by the lead (Claude), independent of the three reviewers

## F1. The roadmap renumber is much wider than headings + prerequisites
learning_roadmap_52_V3.md carries S-numbers in at least 12 places besides `### SXX` and
`**Prerrequisito:**`:
- title `(S1–S52)`; `Escala: 4 niveles × 13 secciones = 52 secciones`
- the "Contrato curricular cuantificado" table: Por nivel 13/52/104/312..., Curso 52/208/416/1,248
  -> with 55 sections and uneven levels the "Por nivel" column has no single value
- "Progresión de niveles": `S14–S26`, `S27–S39`, `S40–S52`; "aprobar las 13 secciones"; "antes de S52"
- capstone table: gates S21 S26 S30 S34 S39 S43 S47 S51 S52
- `Ciclo obligatorio repetido en S1, S2, …, S52`; "La regresión total de S52"
- CF table: CF-2·S26, CF-3·S39, CF-4·S47, CF-5·S51, "bloquea S52"
- "Desde S27: pytest… Desde S32: leakage… Desde S40: ADRs… Desde S44: supply chain… Desde S49: evals"
- level headings `## Nivel 2 — S14–S26` etc.
- the phase-repetition map (S26, S27, S39, S40, S52) and "El ledger debe contener 52 filas"
- the 52-row entry-state table (S01..S52) with CP/CF references in its third column
- hours: "960 horas curriculares para S1–S52"
- production state (2026-07-15 snapshot): "S2–S52", "1,248", "52 exámenes"
Consequence: "renumber only, normalise nothing" (decision 8) is still the right rule, but the
quantified contract (52, 13 per level, 1,248, 416, 208) is not a renumber — it is a contract whose
VALUE changes. It must be in the diff or the roadmap contradicts itself on line 6.
Headings are unpadded (`### S1`), not `### S01`. The phase map and the entry-state table use padded
`S01`. The renderer must handle both.

## F2. S35 (Regresión y regularización) duplicates old S33's T2 and part of its T4
Roadmap old S33 T2: "Lineales: regresión/logística y regularización; coeficientes, supuestos y scaling".
S33 file practises it: S33-T2-A "Sigmoid, thr 0.6 y L2 documentada", "Assess: penalty l2",
S33-T2-B "Ranking |coef| sin claim causal", "Assess de coefs escalados", "REQUEST_SCALE_FLAG".
S33 T4-B practises group CV.
S33 does NOT teach: linear regression (LinearRegression 0), ridge/lasso (0), StandardScaler (0),
hyperparameter search (0), residual diagnostics (1 mention).
=> The plan's S35-T2 (logistic) and S35-T3-B (scaling) and S35-T4-B (CV) duplicate S33.
=> The roadmap's own S33-T2 promise "regularización … supuestos y scaling" is only partly delivered
   (L2 as a documented flag, no ridge/lasso comparison, no assumptions) — an unmet roadmap promise.

## F3. S19/S20 overlap S18 more than the plan assumed
S18 theory: IC for the mean (z), bootstrap IC, Cohen's d (T2-B); counterfactual, random assignment,
self-selection, confounder with a simulation (T2-B, diseno_experimento.py); p-value meaning, two
misreadings, primary metric + guardrails, 20-metric multiple comparisons, peeking 0.045 -> 0.191 (T3-A).
S18 practice: IC margin, d de Cohen, bootstrap, residualise a confounder.
NOT in S18: any formal test (t/Welch/chi2/proportions; scipy 2 mentions), power, sample size/MDE,
type I/II vocabulary, multiple-comparison CORRECTION (only the problem), estimand, randomisation
unit/interference, SRM, CUPED, observational designs (stratify/match/diff-in-diff).
=> Plan S19-T1 (muestra vs población, error estándar, bootstrap) duplicates S18-T2-A/B.
=> Plan S20-T2-A (por qué aleatorizar) and S20-T3 (primaria/guardarraíles, parada temprana)
   duplicate S18-T2-B and S18-T3-A theory.
=> The "0 teaching" framing of hypothesis_testing/experimental_design is false in the same way the
   leakage one was: they are INTRODUCED in S18 at intuition depth, never practised to competence.
   The honest gap statement: "introduced, not operational".

## F4. VP claims the lead re-verified against the repo (2026-10-04)
- CONFIRMED credential-gates.ts:44-49 resolves `S(\d{2})` by `s.index` and throws only when no section
  has that index; at 55 sections every old token still resolves, to a different section. 26/31 badges
  carry a token >= S19 in BOTH catalogs.
- CONFIRMED pre-existing defect: applied_sql_query_development.required_sections = [S19, S37] in both
  catalogs. S19's file is s19-databases-orm.ts (title: Visualización), S37's is s37-dbt-bigquery.ts
  (title: Profiling). The badge was keyed on SLUGS. The real SQL sections are S12 and S29.
- CONFIRMED CP-N2-B contributing [S18,S19,S20,S21], gate S21 (catalog.ts:75).
- PARTLY WRONG "matplotlib in exactly one live section": active s19 (viz) 48 code lines; s01 2 mentions;
  s08-visualization.ts/s09-sklearn.ts carry it but are INACTIVE files. So true for the active route.
  Weak objection anyway: lesson code blocks render text `output:`, the visual channel is authored
  figure components, and S18 already ships S18Interval.tsx.
- CONFIRMED AGENTS.md:132 "52 active sections" invariant (protected path, owner-amended).
- CONFIRMED market graph (industry_skill_graph.json, 2026-07-28): regression DS [independent..],
  experimental_design DA [advanced, leadership] DS [independent..], causal_inference DS/AIML
  [advanced, leadership] only; deps descriptive -> hypothesis -> {regression, experimental_design},
  regression -> classical_ml.
  Internal inconsistency: classical_ml is graded `foundation` while its prerequisite regression is
  `independent` — the graph is not a reliable source for exact level placement.

## F5. Contract-surface claims the lead re-verified
- Filenames are NOT frozen: figure-data-schema.test.mjs:103 reads the number from the import
  BINDING `section(\d{2})`, not the filename. `git mv` keeps filename digits == index (true for
  all 52 today). Keeping them equal avoids adding a number drift on top of the slug drift.
- course_requirements.json:35 `does_not: replace, reduce, or renumber the existing 52 sections in
  learning_roadmap.md` is a provenance note about what V3 did in July relative to the older
  roadmap, under `relationship: complementary`. Not a forward prohibition — but it becomes false,
  so it must be amended in the same change, visibly.
- goal_verification_gate.py:61-80 requires S{n}_STORM.json with n_logged == n and len(cycles) == n
  — the cycle count is tied to the section number. Renumbering 34 sections breaks it; it cannot be
  fixed by renaming files.

## F6. Engineering consequence of WHERE the insertions go
Renumber cost is dominated by the SHIFT, not by the number of inserted sections: any insertion at
<= S19 moves all 34 later sections. The marginal cost of a 3rd section at S35 is (a) authoring one
more section and (b) making the shift NON-UNIFORM (+2 for old S19–S32, +3 for old S33–S52), which
creates ranges that straddle two shift amounts (roadmap line 551 `S27–S38` -> `S29–S41`) and two
classes of every number-keyed artifact. Two insertions both at S19/S20 give a UNIFORM +2.

## F7. The VP's own test for "deepen S33 instead of a regression section", measured
VP: "If after that S33 genuinely cannot hold it, come back with S33's measured word count and
exercise load as the evidence."
- S33 s33-advanced-models: 158,927 chars = 122% of the 52-section mean; 22,181 words;
  14 theory headings (course median 10, min 10, max 26). Its 24 exercises are full (8 subtopics x 3).
- S32 109%, S34 106%, S18 83% of mean.
- Deepening S33 with OLS + residual diagnostics + ridge/lasso + hyperparameter search = at least 4
  theory blocks and >= 2 displaced exercises in the course's already-heaviest ML section.
=> The evidence the VP asked for argues AGAINST "deepen S33" as the whole answer for regression.
=> It does not rescue the plan's S35 as drafted either (logistic/L2/scaling/CV duplicate S33).
   A regression section survives only if its topics are the ones S33 does NOT teach: OLS fit and
   interpretation, inference on coefficients (ties to S19), residual diagnostics and assumptions,
   regularization PATHS (ridge vs lasso vs elastic net, alpha sweep), hyperparameter search.

## F8. Renderer built and falsified (scratchpad/g0/render_roadmap.py)
- Identity plan (no insertions) -> byte-identical output; validator passes the original.
- First run of options A/B FAILED the validator: two insertions sharing one anchor were inserted
  reversed (S20 before S19). Fixed by grouping. So the validator is not vacuous.
- Options A (55: 19,20,35) and B (54: 19,20) now render and validate: headings 1..N in order,
  4 Tn bullets each with one ';', one metadata and one gate line per block, state table S01..SN
  with each row waiting on its predecessor, level headings agree with the headings under them,
  13 capstone ids, no token beyond SN.
- Range semantics: endpoints map; a range straddling an insertion now INCLUDES the new sections.
  `S17–S19` (Excel's prerequisites) -> `S17–S21`, i.e. Excel now lists inference/design as
  prerequisites. The surface agent's `S17–S22` was wrong (S22 would be Excel itself).
- Untouched by design: the dated "Estado real de producción al 2026-07-15" snapshot, and the
  "960 horas" line (stale vs the measured 491 h; owner item, not a renumber).

## F9. ROOT CAUSE the readiness audit missed: applied/integrated badges were keyed on SLUGS
Full listing: scratchpad/g0/badge_sections_by_title.txt. The level-span badges (progress_phase*,
integrated_python_ai_capstone_*) are contiguous ranges and fine. The applied_skill and most
integrated_* badges chose sections by SLUG meaning, so they cite sections that teach something else:
- applied_sql_query_development    S19 databases-orm -> Visualización; S37 dbt-bigquery -> Profiling
- applied_rag_llm_service_development S20 rag -> Excel; S21 fastapi -> Documentos/reportes
- applied_mlops_pipeline_delivery  S29 mlops -> SQL avanzado; S43 llmops -> Contenedores
- reliable_async_python_development S27 async-concurrency -> pytest; S28 llm-agents -> data tests;
                                    S31 streaming-data -> Grafos
- production_python_hardening_practice S30 security-infra -> ER; S32 microservices -> features; S38
- applied_deep_learning_practice   S33 advanced-models -> ML supervisado; S34 cv-ai-integration -> métricas
- architecture_decision_practice   S35 system-design -> Explicabilidad
- llmops_production_delivery       S41 llm-finetuning -> FastAPI; S42 graph-rag -> Schemas
- container_platform_engineering_practice S45 iac -> Cloud; S46 gpu-computing -> Data eng
- ai_governance_code_review_practice S47 opensource -> MLOps; S48 ai-governance -> RAG; S49 data-contracts -> Agentes
- responsible_machine_learning_evaluation S10 modules-packaging-cli; S23 computer-vision -> Browser RPA
- applied_analytical_reasoning     S09–S10 -> Excepciones, Módulos
- integrated_data_analyst/science/ml_engineering/automation/production_python: mixed, same pattern
READINESS_AUDIT_2026-10-02 §2 framed "13 badges citing barely-taught competencies" as TEACHING gaps.
The upstream cause is that the badges POINT AT THE WRONG SECTIONS. The decision-1 relabel chain
(spans "ending S18/S24/S37/S43") was computed on these slug-keyed tokens, so the five "inversions"
are at least partly artifacts of the keying, not of the curriculum.
Consequences:
1. The renumber must remap tokens by IDENTITY (each token keeps resolving to the same file). That
   preserves these defects exactly — the only reviewable choice; one change at a time.
2. G6 is not "relabel four badges": it is re-key every slug-keyed badge to the sections whose
   TITLES teach its claim, then recompute inversions. Changing what a credential claims is
   ask-first. The relabel chain in the plan must be re-derived after re-keying, not carried.
3. Ordering question for the owner: re-key badges BEFORE the renumber (fix on the 52 numbering,
   which the readiness evidence is written against) or after (one remap). Before is safer: the
   re-key is reviewed against titles everyone can read today, and the renumber then just maps.
