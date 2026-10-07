I have what I need. Here is the review.

---

# VP review — three-section statistics insertion (52 → 55)

**Verdict: approve S19 (inference) with changes. Approve S20 (design) only if demoted to 3 topics or merged into S19's section-pair. REJECT S35 (regression) as designed — it is a re-scope of a V3 topic line the course already owns and failed to deliver, not a gap. And block the whole thing on one engineering defect: badge `required_sections` resolve by index, so renumbering silently re-points 26 of 31 badges at the wrong content.**

I'll separate what the repo evidences from what I'm asserting from my own knowledge of how statistics is taught. Everything with a `file:line` is repo evidence.

---

## 0. The one thing that must be fixed before any of this ships

`src/lib/credential-gates.ts:40-51` resolves a badge's `required_sections` token `"S19"` by **`index`**, not by slug:

```ts
const match = /^S(\d{2})$/.exec(tag)
const section = match && COURSE_SECTIONS.find((s) => s.index === Number(match[1]))
if (!section) throw new Error(...)
```

In a 55-section course every token `S01`–`S52` still resolves, so **nothing throws**. The gate just starts pointing somewhere else. The remap is: old ≤18 unchanged, old 19–32 → +2, old 33–52 → +3. Which means:

| badge token | resolves today to | resolves after insertion to |
|---|---|---|
| `S19` (`applied_sql_query_development`, `integrated_data_analyst_practice`, `integrated_data_science_practice`) | Visualización y comunicación accesible | **NEW Inferencia** |
| `S20` (`applied_rag_llm_service_development`, `integrated_ml_engineering_practice`) | Automatización de Excel | **NEW Diseño experimental** |
| `S33`,`S34` (`applied_deep_learning_practice`) | ML supervisado; Métricas/calibración | **Grafos; Feature engineering** |
| `S35` (`architecture_decision_practice`) | Explicabilidad/equidad | **NEW Regresión** |
| `S52` (`evidence_grounded_ai_systems_capstone`) | **final capstone** | Agentes y context engineering |

26 of 31 badges carry at least one token ≥ S19. `src/lib/section-id-migrations.ts` migrates slug→slug and cannot express an index shift; its own header states progress lives in localStorage keyed by slugs and "badge_catalog.json accepts those keys as evidence of section completion." So recorded `ExamAttempt` rows keep counting — toward a *different badge's* requirement. That is silent credential mis-issuance, and it affects the final capstone credential.

**Required before build:** a `SECTION_INDEX_REMAP` applied to both badge catalogs (`src/lib/eligibility/badge_catalog.json` is live; `industry_alignment/badge_catalog.json` is read by the only badge test that runs — per `audit/fixer/OWNER_DECISIONS.md:149`), to the 13 gate strings in `src/lib/capstones/catalog.ts:27-39` and the `contributingSections` arrays, and to `scripts/badge_readiness_audit.py:120-124`, whose prerequisite-inversion rule is literally `max(prereq section number) > max(own section number)`. O10's four relabels were computed against the 52-numbering; they must be re-derived, not carried.

O11 (`audit/fixer/OWNER_DECISIONS.md:142-153`) prices the migration at ~1,360 stable ids and ~816 "removed" exercise ids. **Both numbers check out** — I count 816 exercise-id declarations in S19+ and 34 × 40 = 1,360 unique stable ids. The cost estimate is honest. The badge index-resolution path is the item O11 does *not* name, and it is the one that corrupts credentials rather than just costing hours.

---

## 1. Placement — pedagogically

### S19 inference after S18: yes, and the repo makes a stronger case than the proposal does

S18 is `EDA, estadística descriptiva e incertidumbre` (`s18-data-engineering.ts:17`) and already carries far more inference than the audit's term counts suggest. It has **two full theory blocks with zero exercises**:

- `s18-data-engineering.ts:247` "De la diferencia observada al experimento aleatorizado" — randomisation, counterfactual, self-selection, prints `dif_autoseleccion 41.35` vs `dif_aleatorizada 5.5`
- `s18-data-engineering.ts:353` "Leer el resultado sin exagerarlo: valor p, guardrails y pruebas repetidas" — p-value as a conditional statement, both misreadings named, statistical vs practical significance, peeking (`falso_positivo_una_mirada 0.045` vs `..._diez_miradas 0.191`)

Its self-check items at `s18-data-engineering.ts:2046` test exactly those two blocks, and the 24 We Do exercises are all keyed to the eight original subtopics — `S18-T2-B-E1/E2/E3` are CI margin, Cohen's *d*, bootstrap (`s18:1227,1267,1304`). The audit says this plainly at `READINESS_AUDIT_2026-10-02.md:437-442`: **the section assesses this material without the learner ever having practised it.** That is a flywheel violation in the one section that touches inference, and it is the best argument in the file for extraction. The proposal does not make it; it argues from absence instead, which is weaker and partly false.

Measured by me across the 52 live sections: `bootstrap` 38 (S18 ×35), `aleatoriz` 9 (all S18), `confusor` 22 (S18), `tamaño de efecto`/Cohen 20 (S18), `scipy` 3 (S18 — a `scipy.stats` resource URL at `s18:2068`). So S18 already owns bootstrap, randomisation, confounding and effect size. **"Genuinely absent" is wrong for roughly a third of proposed S19 and half of proposed S20.** What is genuinely absent is the named-test machinery: `t-test` 0, `chi²` 0, `ANOVA` 0, `Bonferroni`/`Holm`/`FDR` 0, `statsmodels` 0, `GridSearch` 0, `sesgo-varianza` 0.

**Where I'd push back on placement:** `matplotlib` appears in exactly one live section — S19 Visualización, 90 occurrences, and `requirements-content.txt:44` declares matplotlib as S19's dependency. Inserting two statistics sections *before* it means sampling distributions, CI coverage and bootstrap distributions must be taught with printed numbers only. From my own experience teaching this: the sampling distribution is the single hardest idea in introductory inference and it is normally carried by a picture. S18 proves text-only is survivable, and the repo has an authored-figure system (`src/components/course/figures/`) with 270 figures of acknowledged debt (`READINESS_AUDIT:386`). So this is solvable — but it must be solved deliberately: **budget authored SVG figures for the sampling distribution and for CI coverage, and do not assume matplotlib.** Alternatively place inference *after* the viz section (new S21), which costs nothing pedagogically and buys you histograms.

### S20 breaks the CP-N2-B capstone block

`src/lib/capstones/catalog.ts:75` — CP-N2-B "Fábrica de Reportes y Tablero Accesible", gate `S21`, contributing `S18,S19,S20,S21`. That is a coherent four-section arc: EDA → visualize → automate the workbook → emit the traceable report. `learning_roadmap_52_V3.md:318` confirms S18 is "**Proyecto:** inicio CP-N2-B" and `:351` confirms S21 is "cierre CP-N2-B".

Insert two statistics sections at 19/20 and that four-section unit becomes a **six-section unit containing an A/B-testing course**, with the gate landing on Visualización. N2 goes from 13 sections / 3 gates to 15 / 3, leaving a six-section ungated stretch. Either CP-N2-B's `contributingSections` is rewritten to skip the new pair (in which case two N2 sections contribute to no capstone and, per the repo's own rule at `READINESS_AUDIT:322`, "a badge is only honest when the skill is demonstrated in a project"), or CP-N2-B absorbs material it does not use. **Neither is acceptable as drawn.** The frozen 13-capstone cardinality (`src/lib/capstones/catalog.ts:5`) means you cannot just add a gate.

### S35 regression before "ML supervisado": no

Read `learning_roadmap_52_V3.md:487` — S33's topic line T2 is, verbatim:

> `- T2 Lineales: regresión/logística y regularización; coeficientes, supuestos y scaling.`

And `:490` T4 is "pipeline y tracking mínimo; validación cruzada apropiada y error analysis." The live section delivers it: `s33-advanced-models.ts:159` "Regresión logística y regularización L2", `:208` "Coeficientes, supuestos y scaling", `:486` "Validación cruzada por entidad y análisis de errores".

**So proposed S35 is not filling a gap. Three of its four topics duplicate a scheduled, implemented topic of the section it would sit in front of.** Worse, it teaches logistic regression two sections before S33 teaches it again. The real defect is narrower and sharper: V3 scheduled linear regression under "regresión/logística" and the implementation shipped only the logistic half — `LinearRegression` is 0 course-wide. That is an **undelivered contract line in S33**, and `READINESS_AUDIT:327` already routes it there ("(d) deepen", connects forward to S34 calibration and S35 explainability).

There's also a prerequisite inversion the proposal creates. New S35 lands between S32 (feature engineering) and old-S33 (ML supervisado), so "Selección de modelo (sesgo-varianza / validación cruzada)" is taught **before** `S34 Métricas, desbalance, calibración y umbrales`. You would be asking a learner to select models before they have ROC-AUC, the confusion matrix, or PR curves — select *on what*? Precision/recall/F1 do appear earlier, at S30 (`s30-security-infra.ts` headings "F1: una sola cifra que exige precisión y recall"), so it is not a total vacuum, but the metric vocabulary the selection step needs is downstream.

---

## 2. Topic breakdown

**Bootstrap before or instead of the t-test — before, and the repo has already decided this for you.** S18-T2-B teaches the CI via `√n` and `1.96` *and* a bootstrap, with `S18-T2-B-E3` "Bootstrap simple de la media" as an exercise. My own view, stated as mine: for a Spanish-language applied course whose learners are analysts, bootstrap-first is the right spine — it makes the sampling distribution concrete without requiring a distributional assumption, and the t-test then arrives as "the closed-form shortcut when the assumption holds." Do **not** drop the t-test: `industry_skill_graph.json` describes `hypothesis_testing` as "t-test, chi-square, p-values, CIs, effect size, assumption checking," and interviews ask for the named test. Teach bootstrap → permutation test → t/χ²/proportions as three views of one question.

**Missing from S19, and a practitioner needs it:** the **normal/sampling distribution itself**. `READINESS_AUDIT:349` records `distribución-normal` as having **0 uses and 0 definitions anywhere**, with the recommendation "deliver in S18 — rides along with the inference work." Proposed S19-T1 says "error estándar" but never names the distribution the error standardises against, and T3 then asks the learner to choose between *t* and χ². You cannot choose a test without the idea of a reference distribution. **Require this as T1-B.** Also missing: "¿cuántos datos necesito?" as a *pre-data* question — it is currently buried in S20-T3 as "duración, potencia," which is the right content in the wrong section.

**Academic padding in S19:** none serious. T4 (type I/II, power, effect size, multiple comparisons) is the most job-relevant topic in the section — multiple comparisons and peeking are where real analyst reports go wrong — but note effect size and the peeking demo already exist in S18, so T4 is partly a re-home, not new teaching.

**`estimando` as S20's spine: no.** This is the design choice I'd argue hardest against. Repo evidence: `READINESS_AUDIT:348` recommends **retiring** the term — "an estimand is causal-inference vocabulary; causal inference is a deliberate P2 scope decision" — and the glossary currently promises `estimando` in S18 where it has 0 occurrences (`READINESS_AUDIT:349`). O12 (`OWNER_DECISIONS.md:155-168`) overrode that, but read what O12 actually settles: it establishes that *estimando* is a legitimate Spanish technical term following *sumando*/*minuendo*, and that it is a homonym with the gerund of *estimar* needing disambiguation. **That is a lexical ruling, not a pedagogical one.** It answers "is this a real word" and not "is estimand the right organising idea for an N2 learner."

My position, from my own knowledge of how this is taught: estimand/estimator/estimate is a graduate framing. It is genuinely clarifying *after* you have been burned by a vague question, and nearly content-free before. For an N2 analyst the load-bearing idea is the counterfactual — "what would have happened to these same units otherwise" — which S18:247 already teaches without the word. `industry_skill_graph.json` describes `experimental_design` as "pre-registered analysis plan with primary/secondary metrics, sample-size calculation, randomization unit, decision rule; **not a post-hoc t-test**." That description names four concrete artefacts and does not mention estimands. **Build S20's spine on the pre-registered analysis plan — a document the learner writes and then cannot change — and introduce `estimando` as one named line inside it.** That keeps O12 satisfied (the term is delivered in S20) without hanging a section on it.

**Does S35 need calibration? No — S34 owns it, decisively.** `calibra*` appears 302 times across the course, **124 of them in S34**, with dedicated theory at `s34-cv-ai-integration.ts:337` "Curvas de reliability y Brier" and `:376` "Calibradores y evaluación fuera de muestra", scheduled at `learning_roadmap_52_V3.md:500`. Adding calibration to a regression section would be straight duplication. Same answer for `StandardScaler`: S32 already teaches "z-score con μ/σ congelados" as a leakage-prevention move, and `READINESS_AUDIT:345` recommends delivering the glossary's `standardscaler` promise **in S32**. If new S35 claims it, three artefacts (glossary → S36, audit → S32, this proposal → S35) point at three different homes for one term, and the audit's own rule applies: "a glossary entry that names a section which never teaches the term is worse than no entry" (`READINESS_AUDIT:353`).

**Is four topics enough / is one section overloaded?** S19 as drawn is well-proportioned for four topics *if* you add the reference distribution and move power out. **S20 is the overloaded one** — it carries randomisation, A/B test operations, *and* observational causality (T4 "confusión y control / límites de la inferencia observacional"). That last topic is `causal_inference` in the skill graph: "IV, diff-in-diff, do-calculus, propensity scoring", graded **advanced and leadership only**, and downgraded to **P2** in the gap matrix (`curriculum_gap_matrix.json:242`, GAP-P1-005). Putting it as the fourth topic of an N2 section means teaching confounding control to learners who have just met the p-value. **Cut S20-T4.** Confounding as a *reason randomisation matters* already lives in S18-T3-A "Correlación y confusión"; confounding as a *method you apply* belongs in N3 near S35 Explicabilidad, or nowhere.

---

## 3. Level and credential fit

**Inference at N2: correct, and the repo's market graph says so.** `industry_skill_graph.json` puts `hypothesis_testing` at data_analyst `[independent, advanced]`, data_scientist `[foundation, …]`, ai_ml_engineer `[foundation, …]`. N2 = "Práctica Aplicada Independiente" (`src/lib/capstones/catalog.ts:30`). Exact match for the DA ladder; arguably late for DS.

**Experimental design at N2: the graph disagrees with you.** `experimental_design` is data_analyst `[advanced, leadership]`, data_scientist `[independent, advanced, leadership]`, ai_ml_engineer `[advanced, leadership]`. So it is N2 material for a *data scientist* and N3 for everyone else. GAP-P1-004's title says it outright: "required at DA L3+, DS L3+, AIML L3+". **Defensible at N2 only in the reduced 3-topic form** (write the plan, randomise, run the test); the T4 observational-causality topic is N3/N4 by the repo's own grading.

**Regression proposed at N3: reject the level, not just the section.** `regression` is data_scientist `[independent, advanced, leadership]` and ai_ml_engineer `[independent, advanced]` — **independent, i.e. N2**. And `skill_dependencies` reads `hypothesis_testing → regression → classical_ml → model_evaluation`. The proposal puts regression at N3 immediately before `classical_ml`, which respects the chain's *order* but lands the node one level later than the market graph wants it. If the argument for new S19/S20 is "the market needs this earlier," the same argument moves regression earlier, not later. My view: the coherent design is **inference late-N2, regression at the N2/N3 boundary, experimental design early-N3** — which is close to where V3 already put regression (S33-T2, first ML section of N3) and exactly why that line should be *deepened* rather than promoted.

### Badges

**Which badges should cite these sections.** By the skill graph's role mapping: `integrated_data_analyst_practice` and `integrated_data_science_practice` (both `independent_practitioner`, and both claim "transferencia integrada de Data Analysis/Data Science") must cite the inference section — the graph has `hypothesis_testing` at DS *foundation*. `integrated_data_science_practice` should cite experimental design. `applied_deep_learning_practice` and `integrated_ml_engineering_practice` should cite regression. `independent_data_preparation` should **not** — it is the one badge resting on S18 (`required_sections: S06,S07,S08,S18`), claims only `descriptive_stats`, and is accurate today.

**Does any existing public_claim become more honest? No — and this is the finding that matters.** I checked all 31: **`hypothesis_testing`, `regression`, `experimental_design` and `causal_inference` appear in zero badges' `skill_nodes`.** The catalog's statistical vocabulary stops at `descriptive_stats` (5 badges) and `uncertainty_quantification` (3). No claim names these skills, so no claim is currently lying about them, and **adding three sections changes no claim's honesty by itself.** The honesty gain requires editing `skill_nodes` and `required_sections` — which is the ask-first act O10/O13 treat as owner territory.

Meanwhile several claims become **less** honest, mechanically, via the index resolution in §0. `applied_sql_query_development` ("demostró independientemente SQL Query Development", `required_sections: [S19, S37]`) today resolves to Visualización + Profiling — already wrong, because the real advanced-SQL section is S29 `SQL avanzado y modelado relacional`. After insertion it resolves to **the new inference section** + Métricas/calibración. Wrong becomes newly wrong. `architecture_decision_practice` (`S35, S40`) would evidence architecture decisions from a regression section.

**On "badges citing critical competencies the course cannot evidence":** `role_skill_taxonomy.json` lists 8 non-compensatory critical competencies and **not one of them is statistical** — `sql_competency`, `leakage_prevention`, `selector_resilience`, `type_safety_production_hardening`, `mlops_fluency`, `business_framing_judgment`, `communication_audience_tuned`, `reproducibility_determinism`. `curriculum_gap_matrix.json` `critical_competency_status` reports leakage_prevention **FAIL** (blocking 6 badges) and three others **PARTIAL**. So on the repo's own market evidence, **the statistics gap is not the highest-severity credential gap the course has.** `python_type_safety` is a verified genuine absence (`mypy` ×2, S05 only) blocking 6 badges, and costs no renumbering. If this insertion consumes the campaign's budget while type safety and `reframework` stay open, that is a prioritisation error — and I'd say so to the owner.

---

## 4. Research validation — where `industry_alignment/` supports, contradicts, and is stale

**Supports:** the four skill nodes exist with exactly the proposal's content and are correctly ordered by `skill_dependencies` (`descriptive_stats → hypothesis_testing → {regression, experimental_design} → causal_inference`). Four gaps already name this material: GAP-P1-001 hypothesis_testing (`curriculum_gap_matrix.json:170`), GAP-P1-002 regression (`:188`), GAP-P1-004 experimental_design (`:224`), GAP-P1-005 causal_inference (`:242`). The P1 severities stand.

**Contradicts, in three specific ways:**

1. **All four gaps committed to additive extension, never new sections.** Each one's `backward_compatibility_impact` reads "Additive — extends SNN; no existing activity renumbered." The proposal reverses that commitment without engaging it.
2. **Severity.** `causal_inference` is **P2**, downgraded (`:31`), and `curriculum_gap_matrix.json` grades it advanced/leadership-only. The proposal elevates it to a topic of an N2 section.
3. **The audit explicitly recommended against this.** `READINESS_AUDIT_2026-10-02.md:312` lists route (c) "add new sections" with its cost and marks it **owner decision**; `:314` states "**Recommendation: (d) + (a) only. No new sections, no T5**"; `:368` repeats "Recommend neither." The owner overrode this at O11 and that is the owner's call to make — but the override has no written counter-argument against §7.2's placement table, and §7.2 is the stronger document on regression.

**Stale, concretely.** Generated `2026-07-28` and keyed on `id` slugs, so every `exact_section_and_insertion_point` is wrong — `READINESS_AUDIT:182-195` tabulates it. For this proposal specifically:

| gap matrix says | that section actually is | where it really belongs |
|---|---|---|
| hypothesis testing → "S06 (numpy)" | S06 *Colecciones y estructuras de datos* | S18 *EDA* |
| regression → "S10 (sklearn)" | S10 *Módulos, packaging y CLI* | S33 *ML supervisado* |
| A/B testing → "S39 (integrator-phase2)" | S39 *Responsible ML Case Triage*, a **level-closing integrator** | — |

That third row is the worst. GAP-P1-004 proposes teaching A/B testing inside the N3 integrator and GAP-P1-005 proposes adding causal inference as a **T6** of the same section. A capstone section is where you demonstrate, not where you first meet material; and `tests/adversarial/test_active_v3_curriculum_contract.py:60-62` pins exactly 8 subtopics, 8 demos and 24 exercises per section, so T5/T6 are not structurally available at all. **The gap matrix's placements are unusable; its severities are usable. Do not cite it as support for this design — it proposes something materially different and worse.**

**Does it propose something better?** For inference and experimental design, no — its placements are wrong and its structure is impossible. For regression, **yes, by accident**: "Reinforce in S33 with a 'compare OLS vs ridge with leakage-aware CV' exercise" is a better unit of work than a whole section, because S33 already has the logistic/L2/coefficients/scaling scaffolding to hang OLS and ridge on.

---

## 5. What I would refuse to ship

1. **Any renumber without an index remap applied to both badge catalogs, the 13 capstone gate strings, `contributingSections`, and `badge_readiness_audit.py`'s `max(section number)` rule.** O11 budgeted the id rewrites and the preservation sentinel; it did not budget this. Silent credential mis-issuance, including on the final capstone credential, is not a migration cost — it is a defect. Hard block.

2. **New S35 "Regresión y regularización" as a section.** `learning_roadmap_52_V3.md:487` already schedules it as S33-T2 and the live section implements it (`s33-advanced-models.ts:159,208,486`). **Instead I require:** deliver S33-T2's undelivered half (OLS, `LinearRegression`, residuals, assumptions) by deepening S33-T2-B; add ridge/lasso to S33-T2-A beside the existing L2; deliver the glossary's `hyperparameter-tuning` promise in S33-T4 beside the existing CV (`READINESS_AUDIT:344` already routes it there); deliver `standardscaler` in S32. Four theory blocks and two rescoped exercises against one new section, 816 id rewrites, and a duplicate logistic-regression lesson. If after that S33 genuinely cannot hold it, come back with S33's measured word count and exercise load as the evidence — not with `LinearRegression == 0`, which is an *implementation* gap dressed as a *curriculum* gap.

3. **S20-T4 "Cuando no puedes aleatorizar."** `causal_inference` is P2, graded advanced/leadership for DS and AIML only. Cut it; let S20 be three topics, or give T4 to "pre-registro y regla de decisión" — the artefact `industry_skill_graph.json` says the skill actually is. If you want observational causality in the course, it is an N3/N4 proposal with its own hours.

4. **Shipping S19/S20 while S18:247 and S18:353 stay exercise-less.** If the new sections take the teaching and S18 keeps the orphaned theory *and* the two self-checks that test it, you have duplicated the content and left the original defect in place. `READINESS_AUDIT:456` already rejected that path ("leave S18 untouched and let S19/S20 carry the practice… keeps Q9/Q10 orphaned in their own section"). **Require in the same PR:** S18:247 and S18:353 are reduced to forward-pointing bridges, or the two self-check items move to the new sections. Pick one in writing before build.

5. **`estimando` as S20's title and organising spine.** O12 ruled on the word; nobody has ruled on the frame. I require the counterfactual and the pre-registered analysis plan as the spine, `estimando`/`estimador` delivered as one named distinction inside T1, and the section retitled accordingly. If the owner wants the estimand frame kept, I want one sentence in O12 saying why an N2 analyst needs the word before they have run an experiment — because the audit's recommendation to retire it is still the only written argument on the question.

6. **Any build that assumes `statsmodels`.** It is not in `requirements-content.txt`, and every `output:` block is a verified promise against that file (`requirements-content.txt:1-9`). `scipy==1.13.1` **is** pinned, so t/χ²/proportions and power via `norm.ppf` are available. Decide before authoring: hand-roll power and OLS diagnostics on scipy + sklearn, or declare a ninth dependency. Do not discover this in the runtime audit.

7. **Any build that assumes matplotlib in S19/S20.** matplotlib's first and only teaching is the viz section, which the insertion pushes *behind* them. Budget authored figures for the sampling distribution and CI coverage, or move inference after viz.

**Two housekeeping requirements, not blocks.** `AGENTS.md:132` states "52 active sections" as an invariant and is itself a protected path; `learning_roadmap_52_V3.md` is protected *and* carries the count in its filename. Both need owner-signed amendment, not a quiet edit. And `tests/adversarial/test_active_v3_curriculum_contract.py:117` computes level hours as `range(s, s+13) for s in (1,14,27,40)` — hardcoded 13-section windows; with 13/15/14/12+1 that assertion and the four `PHASES.hours` in `index.ts` must be rewritten. Total hours are fine: 491 today, +27 for three 9h sections, against a ceiling of 760.

---

### What I'd actually approve today

One section, not three: **N2 "Inferencia y diseño de experimentos"** — bootstrap and the sampling distribution (incl. `distribución-normal`, currently 0/0 course-wide); confidence intervals and what they do not say; the named tests (t, χ², proportions) as closed forms of the bootstrap question; type I/II, power, effect size, multiple comparisons and peeking; and randomisation + pre-registered plan + primary metric and guardrails folded into T4 as the design that licenses the causal verb S18 keeps forbidding. That absorbs the orphaned S18 blocks, puts every genuinely-absent term in one place, costs one insertion instead of three, keeps N2 at 14 sections, and leaves CP-N2-B's four-section arc nearly intact. Regression stays in S33 and gets the depth V3 already promised it.