# Re-casting design G to the ruled placement (S19 inference, S20 design, S35 regression)

**Bottom line**
- The ruled placement can be built. S20 can teach design at N2. It uses only S01–S19, with CUPED via θ = cov(Y,X)/var(X) and IPW via the treated share per stratum.
- **Kept from G without change:**
  - all of Phase 0, with the lead's ordering fix;
  - S19 as designed, with the round-4 fixes;
  - the eight regression units;
  - the guards G-1 to G-15;
  - the three-gate structure;
  - the 25 completeness units.
- **Re-derived and checked in the tree:**
  - numbering, the shift zones, levels, hours, capstone arcs and gates, and positional spans;
  - the mapping function every guard uses;
  - the glossary commit schedule and every bridge.
- **The ruled placement costs these things:**
  - CP-N2-B grows to six sections, the longest arc in the course.
  - Design sits one level below the data-analyst and AI/ML ladders.
  - Model-based IPW becomes a bridge at S38, not a practised unit.
  - IPW comes 15 sections before the backdoor criterion.
  - The CUPED = OLS identity arrives 15 sections after CUPED.
  - S20 must avoid seven glossary aliases whose homes come later.
  - The title word "contraste" collides with colour contrast in S21, S54 and CP-N2-B's own gate.
- **The ruled placement gains these things:**
  - No edge in `industry_skill_graph.json` inverts. G inverted `experimental_design -> causal_inference`.
  - The delta-method hook gap shrinks from 18 sections to 1.
  - The CP-N3-C start marker does not move, so one ask-first item disappears.
  - Multi-period DiD leaves the boundary.
  - Design fits the data-scientist ladder.
- **Two corrections to the inputs:**
  1. **Covariance.** S18 does not teach covariance. `covarian`, `np.cov` and `.cov(` have 0 hits in all 52 active sections. S18 teaches `std`/`var(ddof=1)`, Pearson `corrcoef` and the `np.polyfit` slope (s18:307-341, :701-702, S18-T3-A-E3 at s18:1438-1490). The lead's conclusion still holds. S20 introduces `np.cov` as a one-line delta (cov = r·s_x·s_y) and checks θ against the polyfit slope.
  2. **Glossary homes.** G homes `error estándar` at S19 and `confusor` at the regression section. S18 already uses both words: "error estándar" at s18:1243, and "confusor/confusores" 22 times, all in S18 (for example s18:253). Homing them later raises DECLARED_LATE_OWED from 13 to 15. Both must be homed at S18. The same applies to `estimador` (s18:1088) if a term is created for it.

**Notation.** `sNN:L` means `src/lib/course/sections/sNN-*.ts` line L, using today's file names and line numbers (old numbering). Other paths are relative to the repository root.

## 0. What changed from G

| part | under G | under the ruled placement | why |
|---|---|---|---|
| Insertions | After old S18 (S19), after old S32 (S34), after old S34 (S37) | After old S18 (S19 and S20, grouped), after old S32 (S35) | Owner ruling |
| Shift zones | 0 / +1 / +2 / +3 | 0 / +2 / +3 | Two insertion points instead of three |
| Sections per level | 13 / 14 / 15 / 13 | 13 / **15** / **14** / 13 | Two new sections at N2, one at N3 |
| Hours | 118 / 127 / 136 / 137 = 518 | 118 / **136** / **127** / 137 = 518 | 9 h per new section, as for 48 of the 52 sections |
| Inference | S19, N2 | S19, N2, unchanged | Same slot |
| Design | S37, N3; opens CP-N3-C | **S20, N2**, inside CP-N2-B | Owner ruling |
| Regression | S34, after old S32 | **S35**, after old S32 (now S34), before old S33 (now S36) | Same slot, new number |
| CP-N2-B | S18–S22, gate S22 (5) | **S18–S23, gate S23 (6)** | S19 and S20 both fall inside the arc |
| CP-N3-B | S32–S36, gate S36 (5) | S33–S37, gate S37 (5) | S35 falls inside the arc |
| CP-N3-C | S37–S42 (6); marker moves from s35:48-50 (ask-first) | S38–S42 (5); **marker stays** at s35:48-50 | No design section opens N3-C |
| Positional spans | phase1 S14–S27; phase2 S28–S42 | phase1 **S14–S28**; phase2 **S29–S42** | Derived from `phase` |
| CUPED θ | S34's OLS slope | cov/var on pooled pre-period data; `np.cov` is new at S20; checked against S18's polyfit | OLS comes after S20 |
| IPW (practised) | Logistic propensity from old S33 plus calibration from old S34 (S37-T4-B) | **Treated share per stratum** (S20-T4-B) | Logistic and calibration come after S20 |
| Model-based IPW | Practised | **Bridge at S38** (s35:99), with a pointer at S37 (s34:376) | S38 is the first section after both logistic and calibration |
| Heterogeneous effects | S34-T1-B interaction terms | Per-segment differences, Holm, and a z-test on the difference of effects; S35-T1-B later reframes this as an interaction | No regression at N2 |
| DAG and adjustment | S34-T4-A, before design | S35-T4-A, **after** design | The S20 slots are full, and the backdoor criterion needs regression controls |
| DiD | S34-T4-B, two-period only | S35-T4-B, two-period, plus multi-period with a unit block bootstrap | S20-T3-A's cluster bootstrap now comes first |
| Delta-method hook | S19-T3-B-E3 to S37 (gap 18) | S19-T3-B-E3 to S20-T3-A (gap 1) | Adjacent sections |
| Peeking recall | s18:363-396 to S37 (gap 19) | s18:363-396 to S20-T2-B (gap 2) | Adjacent sections |
| Design youDo | Randomised pilot of the s34:408 threshold (CP-N3-C) | Experiment readout template in CP-N2-B's reports factory; the threshold pilot becomes a CP-N3-C brief deliverable (ask-first) | S20 comes before the threshold section (S37) |
| Graph edges | Inverts `experimental_design -> causal_inference` | **None inverts** | S20 comes before S35-T4 |
| Ladder fit | Design at N3 fits the DA and AI/ML ladders | Design at N2 fits the DS ladder; N3 design evidence comes from the CP-N3-C pilot plan | Ladders at industry_skill_graph.json roles[0], [1], [3] |
| Statistics nodes on credentials | capstone_independent: hypothesis_testing; capstone_advanced_applied: regression, experimental_design, causal_inference | capstone_independent: hypothesis_testing, **experimental_design**; capstone_advanced_applied: regression, causal_inference | Each node goes where its teaching completes |
| Glossary exposure | S37 came after every ML term home | S20 comes before 7 term homes: resample, stratifiedkfold, cross-validation, hyperparameter-tuning, standardscaler, onehotencoder, coverage | S20's brief must avoid those aliases |
| Ratchet commits | The S34 commit re-homes 3 terms | The **S35** commit re-homes the same 3 | Renumbered |
| Titles | G's three titles | The owner's titles; the S19 "contraste" collision raised at Gate B | Collision found after the owner confirmed the titles |
| Gate B content | Re-ask placement; G vs G' | No placement question; new questions 18–22 | Placement is ruled |
| Guard inputs | Mapping +1/+2/+3; admin cutoffs 13/27/42; ratchet pin S32→S33 | Mapping +2/+3; cutoffs **13/28/42**; pin S32→**S34**; R-1 allowlist re-derived | §4.2 |

## 1. Numbering, levels, hours, capstones, spans, zones

```
old     S01 ─ S18 │             │ S19 ─ S32 │       │ S33 ─ S52
new     S01 ─ S18 │  S19   S20  │ S21 ─ S34 │  S35  │ S36 ─ S55
shift       0     │  new   new  │    +2     │  new  │    +3

N1  S01 ─────────── S13                                 13 sec  118 h  (unchanged)
N2  S14 ─ S18 · S19 · S20 · S21 ─ S28                   15 sec  136 h  (old S14–S26)
N3  S29 ─ S34 · S35 · S36 ─ S42                         14 sec  127 h  (old S27–S39)
N4  S43 ─────────── S54 · S55 FINAL                     13 sec  137 h  (old S40–S52)
```

**The mapping f, used by every guard:** n stays n for n ≤ 18; n becomes n+2 for 19 ≤ n ≤ 32; n becomes n+3 for 33 ≤ n ≤ 52. The new sections are S19, S20 and S35.

| zone | old | new | shift | sections | exercise ids | figure ids |
|---|---|---|---|---|---|---|
| 0 | S01–S18 | S01–S18 | 0 | 18 | 432 | 41 |
| A | S19–S32 | S21–S34 | +2 | 14 | 336 | 28 |
| B | S33–S52 | S36–S55 | +3 | 20 | 480 | 48 |
| new | — | S19, S20, S35 | — | 3 | 72 | new |

- **816 ids are rebound** and 72 are new, for 1,320 exercises, 440 demos and 55 exams.
- **34 section files move with `git mv`.**
- **No existing section changes level.** Old S26 (phase 1) becomes S28, still phase 1. Old S27 (phase 2) becomes S29, still phase 2.
- **Hours.** Hours are summed from index.ts:92-96 `PHASES` and the per-file `estimatedHours`: S01, S15 and S33 are 10 h; S52 is 29 h; the rest are 9 h. That gives 491 today. The three new sections at 9 h each give 518. `COURSE_META` changes to `totalSections` 55 and `totalHours` 518 (index.ts:62-64). `PHASES` change to sections '14-28', 136 h; '29-42', 127 h; '43-55', 137 h.

**Capstones** (catalog.ts:75-117; exact partition of 55):

| capstone | gate | contributing | n | change |
|---|---|---|---|---|
| CP-N1-A / B / C | S04 / S08 / S13 | S01–04 / S05–08 / S09–13 | 4/4/5 | none |
| CP-N2-A | S17 | S14–S17 | 4 | none |
| **CP-N2-B** | **S23** | **S18, S19, S20, S21, S22, S23** | **6** | +S19 and +S20; gate S21→S23; prerequisites S18–S22 |
| CP-N2-C | S28 | S24–S28 | 5 | +2 |
| CP-N3-A | S32 | S29–S32 | 4 | +2 |
| **CP-N3-B** | **S37** | **S33, S34, S35, S36, S37** | **5** | +S35; gate S34→S37 |
| CP-N3-C | S42 | S38–S42 | 5 | +3; marker stays at s35:48-50 |
| CP-N4-A / B | S46 / S50 | S43–46 / S47–50 | 4/4 | +3 |
| CP-N4-C | S54 | S51–S54; sub-gates S52/S53/S54 | 4 | +3 (SUB_N4C at catalog.ts:41-48) |
| CP-FINAL | S55 | S55 | 1 | +3 |

Total: 4+4+5+4+6+5+4+5+5+4+4+4+1 = 55.

**Other capstone values:**
- `LEVELS` bands: L2 'S14–S28', gates S17/S23/S28; L3 'S29–S42', gates S32/S37/S42; L4 'S43–S55', gates S46/S50/S54.
- CP-FINAL prerequisites: S04, S08, S13, S17, S23, S28, S32, S37, S42, S46, S50, S54.
- `GATE_MAP` follows the same mapping.
- Nine `gate.json` `gate_section` values change: S21→S23, S26→S28, S30→S32, S34→S37, S39→S42, S43→S46, S47→S50, S51→S54, S52→S55.

**Positional badge spans** (rule: the phase span from `phase`, with the FINAL section excluded from phase 3, as today):

| badges | today | ruled |
|---|---|---|
| progress_phase0_walked, capstone_foundations | S01–S13 | S01–S13 (unchanged) |
| progress_phase1_walked, capstone_independent | S14–S26 | **S14–S28** |
| progress_phase2_walked, capstone_advanced_applied | S27–S39 | **S29–S42** |
| progress_phase3_walked, capstone_integrated_mastery | S40–S51 | **S43–S54** |
| progress_journey_completed | S01–S52 | S01–S55 |
| evidence_grounded_ai_systems_capstone | S52 | S55 (the token resolves by `index:`, credential-gates.ts:44-48) |

**Industry graph check** (industry_skill_graph.json skill_dependencies):

| edge | ruled positions | holds |
|---|---|---|
| `descriptive_stats -> hypothesis_testing` | S18 → S19 | yes |
| `hypothesis_testing -> experimental_design` | S19 → S20 | yes |
| `hypothesis_testing -> regression` | S19 → S35 | yes |
| `experimental_design -> causal_inference` | S20 → S35-T4 | yes; G inverted this edge |
| `regression -> classical_ml` | S35 → S36 | yes |

- `classical_ml -> feature_engineering` is already inverted today (old S32 comes before old S33). Both placements leave it as it is.
- `business_framing -> metric_design`: S20 adds N2 evidence for metric_design. I did not verify which section first teaches business_framing.

**Ladder fit** (roles[].levels):
- experimental_design sits at DS independent, DA advanced and AI/ML advanced. The ruled N2 placement fits DS and comes one level early for DA and AI/ML.
- causal_inference sits at advanced in both ladders that list it. Its observational half completes at S35 (N3), which fits.
- regression sits at DS and AI/ML independent. N3 is late for both, as under G. The justification is the `regression -> classical_ml` edge.

## 2. The new sections

Each topic has two subtopics, A and B, written as the delta over what the course already teaches. Codex writes all Spanish.

### S19 "Inferencia: incertidumbre, intervalos y contraste" (N2)

The machinery is G's, kept. It depends on nothing that moves.

**CP-N2-B increment.** Every claim that goes from a sample to a population, or compares groups, cites n, a confidence interval and an effect size. Tests apply only to pre-declared comparisons, with Holm across them.

| topic | A (delta over S18) | B (delta over S18) |
|---|---|---|
| T1 Probabilidad y distribución muestral | Conditional probability, independence and Bayes from a contingency table (base rate). Bernoulli and binomial. s18:2050 says p is conditional but teaches no rule. | Normal, CLT, SE and t. scipy enters through `t.ppf` and `norm.ppf`.<br>The coverage simulation uses a **named clean lognormal**, at a skew where the gaps exceed 3 MC SE (VP: σ = 1.0). It prints interval length next to coverage. The text says "closer to nominal", not "covers".<br>S18's population (lognormal plus the 400 and 450 outliers, s18:547) is taught as the case where no interval for the mean rescues you.<br>The code never uses the English word "coverage". |
| T2 Pruebas por aleatorización | H0 and a permutation test on the S18 pilot. E3 is the self-selection delta (s18:1891, :2040). This practises s18:247-253. | p as a tail area, one-sided and two-sided. The duality, with its qualifier, worked on T1-B's one-sample t. p ≠ P(H0\|datos), using T1-A's Bayes. This practises s18:353-357. |
| T3 Pruebas con nombre | `ttest_ind(equal_var=False)` and the Welch interval, named as the refinement of S18's unpooled z (s18:369-374). Q-Q check. Log-scale note. Permutation as the assumption-light route. Paired t. McNemar via `binomtest`. | E1: pooled z = `chi2_contingency(correction=False)`.<br>E2: 2/20 vs 7/20, with the pinned duality strings.<br>E3 (lead's fix plus the VP's): `riesgo_relativo=3.5` and `lift_relativo=2.5` (+250 %) as point estimates. It also prints the count of zero-control resamples at 2/20 (about 12 %) as a failure. The CI is a log-RR bootstrap plus Katz on a **powered dataset** with ≥30 expected control conversions. **S20-T3-A-E3 reuses that dataset.** |
| T4 Errores y decisiones | Type I and II errors, power, MDE and n. The closed form (z_{α/2}+z_β)²·2σ²/δ² is checked by simulation. Re-practises Cohen's d. | Holm and Benjamini–Hochberg. Recalls s18:359 (p_minimo 0.0283). |

**Glossary homes** (with the alias rules):
- **S19:** `distribuci-n-normal` (re-homed in the S19 commit), probabilidad condicional, teorema de Bayes, distribución binomial, teorema central del límite, distribución t, cobertura del intervalo, hipótesis nula, prueba de permutación, prueba t de Welch, prueba pareada / McNemar, chi-cuadrado, potencia estadística, error tipo I/II, efecto mínimo detectable, Holm, FDR/BH, riesgo relativo, lift relativo.
- **Kept at S18:** `error estándar` (correction).
- **Alias rules:**
  - Never "Student": s18:1232 has "t-student".
  - Never bare "potencia": S02 uses it for exponents.
  - Never bare "permutación": S38 uses it for permutation importance.
  - Never "resampling": it is the alias of `resample`, homed at S37.

### S20 "Diseño experimental, estimandos y causalidad" (N2)

**youDo: the CP-N2-B increment.** The learner builds an experiment readout spec for `reports.render(spec)`, using a merchant-level randomised rollout of S18's plan (s18:251).
- The template refuses to render without a pre-registered plan, a passing SRM check and an estimand sentence.
- It reports the cluster-aware ITT with its CI, the CUPED-adjusted ITT with θ and the variance reduction, and Wald/LATE as secondary.
- It reports the guardrail (cancellation rate, s18:358) per arm.
- It reads regions as pre-declared segments with Holm and a difference-of-effects z.
- It ends in the launch decision.
- This maps onto the capstone's P0 "Claims ejecutivos no soportados" (catalog.ts:75).

| topic | A | B |
|---|---|---|
| T1 El estimando antes que el dato | Estimand, estimator and estimate. Potential outcomes. ATE, ATT and ITT.<br>E1: the true ATE and ATT from a table holding both potential outcomes.<br>E2: S19-T2-A-E3's self-selection estimate against the true ATE.<br>E3: write the estimand sentence and choose ITT vs ATE.<br>Delta: s18:251 names the quantity but never the potential-outcome contrast. | Non-compliance: Wald = ITT_Y/ITT_D = LATE/CACE under four assumptions.<br>E1: ITT, Wald and per-protocol against the true ATE **and** the true complier effect.<br>E2: breaks monotonicity, then exclusion.<br>E3: one-sided non-compliance, where Wald = ATT.<br>The CI comes from S18's bootstrap. |
| T2 El plan | The pre-registered plan: estimand, one primary metric, guardrails, decision rule, n from S19-T4-A, full weeks, novelty and primacy. The demo includes one worked segment readout with Holm.<br>Delta: s18:358 and :410 name the primary metric and guardrail in theory only, with no exercise. | Interim looks.<br>E1: reproduces s18:384-396 (0.045 vs 0.191).<br>E2: a Pocock-shaped boundary calibrated by simulation.<br>E3: an O'Brien–Fleming-shaped boundary, plus the per-arm guardrail stop.<br>Lan–DeMets is named only. |
| T3 Asignación y validez | Randomisation unit, interference, cluster randomisation, ICC and design effect 1+(m−1)·ICC.<br>A cluster bootstrap as the delta over S18's row bootstrap.<br>The delta method as demo plus E3. The demo covers a ratio metric and introduces `np.cov`. E3 is the Katz log-RR interval on S19-T3-B-E3's powered dataset, checked against the bootstrap. | Balance and SRM.<br>E1: SRM with `scipy.stats.chisquare`, a goodness-of-fit delta over S19's `chi2_contingency`.<br>E2: standardised mean difference on pre-period covariates, which is S18's Cohen's d (S18-T2-B-E2, s18:1267).<br>E3: an SRM failure blocks the readout. |
| T4 Precisión y pesos | CUPED: θ = cov(Y,X)/var(X) on **pooled** pre-period data. It is checked against `np.polyfit(X, Y, 1)[0]` from S18-T3-A-E3. Variance falls by ρ².<br>Stratified randomisation and post-stratification with `groupby` (S17). | IPW with stratum propensities (treated share per stratum).<br>E1: a ramp whose share changes by day. The pooled difference is biased, and IPW recovers the effect.<br>E2: S18's CASO-LIM-018, where merchants enrol if prior volume > 110 (s18:253). Positivity fails, and the code refuses; `positividad_falla=True` is pinned.<br>E3: soft self-selection by volume band, with stabilised weights, a bootstrap CI and the stated no-unmeasured-confounding assumption. |

**Prerequisites. S20 rests only on S01–S19:**

| S20 uses | taught at |
|---|---|
| Arrays; DataFrames; `groupby`/`agg`/`transform` | S14 NumPy; S15 Pandas; S17 (55 `groupby` hits) |
| `std`/`var(ddof=1)`; SE of a difference in means | s18:75, :89; s18:275-276, :372 |
| Row bootstrap | s18:198, :220; S18-T2-B-E3 (s18:1304) |
| Cohen's d | s18:199; S18-T2-B-E2 (s18:1267) |
| Counterfactual, unit, treatment, outcome, randomisation, CASO-LIM-018 | s18:247-253 |
| Pearson and the polyfit slope | s18:307-341, :701-702; S18-T3-A-E3 |
| p-value, primary metric, guardrails, multiple comparisons, peeking loop | s18:353-359; s18:363-396 |
| Bayes; t/normal critical values; permutation test; duality; Welch; χ²; powered lift dataset; power, MDE and n; Holm | S19 T1-A to T4-B |

- **New at S20, introduced and practised there:** `np.cov`, `chisquare`, ICC, the cluster bootstrap, the Katz/delta formula, boundary simulation, the Wald ratio and inverse-probability weights.
- **Not used at S20:** OLS (S35), logistic regression (S36), calibration (S37), K-fold (S35) and the visualisation libraries (S21).

**Glossary homes:**
- **S20:** ATE/ATT/ITT, LATE/CACE, no cumplimiento del tratamiento, prueba A/B, covarianza, SRM, efecto de diseño, correlación intraclase, método delta, CUPED, aleatorización estratificada / post-estratificación, IPW, puntaje de propensión, positividad.
- **Kept at S18:** `estimando`, `confusor`, `asignacion-aleatoria` and `autoseleccion`. plan.md's move of the last two to S20 would add 2 late terms.
- **Alias rules:**
  - Never bare "LATE": S49 uses it as a streaming event label (s46:99-100).
  - Never bare "cumplimiento": first used in S01, 21 hits.
  - Never bare "A/B": first used in S01.
  - Never bare "delta", "pesos", "riesgo" or "estratificación".
  - Never use the gerund "estimando" in S20 prose.

### S35 "Regresión y regularización" (N3, after old S32, before old S33)

**CP-N3-B increment.** A regression of review effort per case (`review_minutes`) in the Red Andina workbench (s33:595), with coefficient CIs, a ridge model selected by K-fold, HC SEs and an explicit non-causal label. The dataset, gate, rubric and brief need changing (ask-first, decision 8).

| topic | A (delta over old S33 and S18) | B |
|---|---|---|
| T1 Regresión lineal | `DummyRegressor`, then `LinearRegression`. MAE, RMSE and R², with R² against the test mean (the dummy scores ≤ 0).<br>Delta: s33:100 has the dummy only for classification, and s33:530 glosses MAE. | Reference coding with `drop='first'`. The intercept is the reference mean, and each coefficient is a difference from it. The singular full one-hot case is shown once. Interactions are introduced as the difference of segment effects, recalling the S20 youDo. |
| T2 Inferencia y diagnóstico | `X.T` and `np.linalg.solve` (0 hits today). SE, t CI and the F-test, checked against `f_oneway`.<br>Bridge: CUPED's θ is the one-covariate OLS slope (S20-T4-A). Lin-style ANCOVA is named. | Residuals against fitted values, a polynomial term, HC SEs, leverage and Cook's distance. |
| T3 Regularización | VIF. Ridge, lasso and elastic net in a `Pipeline` with `StandardScaler`, reusing s32:131's frozen μ/σ from the previous section.<br>Delta: s33:159 has L2 for logistic only, in pure Python. | K-fold and `GridSearchCV` over alpha, with a held-out test set. Nested CV in the demo only.<br>Delta: s33:442-450 glosses CV and never practises it. |
| T4 Coeficiente no es efecto | Causal graph, backdoor paths, mediator and collider (confounder recalled from S18). Regression adjustment as Frisch–Waugh–Lovell over S18-T3-A-E3. The same adjustment set by weighting, recalling S20-T4-B. | DiD.<br>E1: two-period, collapsed to post−pre per unit, regressed on treatment with HC SEs.<br>E2: a pre-period placebo, which cannot prove parallel trends.<br>E3: multi-period DiD with a unit block bootstrap from S20-T3-A, against naive HC. |

**Where each placement-sensitive piece lives:**

| piece | home | reasons | cost |
|---|---|---|---|
| DAG and adjustment | **S35-T4-A** | S20 already holds 8 units in 8 slots. The backdoor criterion's action is choosing controls, which first exists in S35. FWL needs regression. The edge `experimental_design -> causal_inference` holds. | S20-T4-B weights before the backdoor criterion. S20 supplies the adjustment variable: by design in E1, named in E2 and E3. |
| DiD | **S35-T4-B** | It needs HC SEs (T2-B) and a unit block bootstrap (S20-T3-A). S20 has no free slot. | None beyond G's |
| Model-based IPW | **Bridge at S38**, anchored at s35:99, with a one-line pointer at S37 (s34:376) | S36's logistic (s33:159) is L2-shrunk and uncalibrated until S37 (s34:337, :376). IPW divides by the score, so miscalibration near 0 and 1 dominates the weights. S38 already recalls calibration (s35:210) and separates explanation from effect (s35:64, :99). S38 opens CP-N3-C. | Worked example plus a topic-evaluation item, not a We Do exercise. The grid is full (decision 18). |

**Glossary homes at S35:**
- regresión lineal, mae, rmse, r2, variables indicadoras, término de interacción, error estándar robusto, VIF, ridge/lasso/elastic net, grafo causal, mediador, colisionador, diferencia en diferencias.
- Re-homed in this commit: `cross-validation`, `standardscaler`, `hyperparameter-tuning`.
- **Alias rules:**
  - Never bare "regresión": 178 hits, mostly regression testing.
  - Never bare "interacción": its one hit today is old S28, not statistics.
  - Never bare "DAG": orchestration at S28 and S49.
  - Never "DiD": not an acronym under `aliasIsAcronym` (terms.ts:1022), so it would match the variable `did` in S24 (8 hits) and add a late term.
  - Never bare "dummy": 110 hits in old S33.
  - Never "StratifiedKFold" or "split estratificado": homed at S37.

### Completeness units (25) and the declared boundary

| # | unit | practised at |
|---|---|---|
| 1–8 | Probability and Bayes; normal/CLT/SE/t/coverage; H0 and permutation; p and the qualified duality; Welch, paired and McNemar; proportions; errors, power, MDE and n; Holm/BH | S19 T1-A to T4-B |
| 9–16 | Estimator API and metrics; indicators and interactions; coefficient inference and F; diagnostics and HC; VIF and penalties; K-fold and GridSearchCV; DAG and adjustment; DiD | S35 T1-A to T4-B |
| 17–24 | Estimand; Wald/LATE; plan; interim looks; unit, design effect and delta method; balance and SRM; CUPED and stratification; IPW (stratum) | S20 T1-A to T4-B |
| 25 | Heterogeneous effects and the launch decision | S20 youDo |

**Declared boundary:**
- 2SLS with an observational instrument.
- Do-calculus beyond the backdoor criterion.
- Bayesian A/B readouts.
- Poisson models and GLMs.
- Rank tests.
- Time-series inference.
- Survival analysis.
- Mixed models.
- Synthetic control and RDD.
- **Staggered-adoption DiD.** Multi-period DiD leaves the boundary.
- Exact Lan–DeMets spending (named only).
- Doubly robust / AIPW.
- **Model-based IPW as a practised unit** (new; bridge only).
- Logistic odds ratios (decision 19).

## 3. Bridges and moves in existing sections

Every bridge gets a row in `renumber_edit_ledger.json`. Codex writes the text.

| section (new) | anchor | change |
|---|---|---|
| S18 | s18:251 | Add "estimando" (Phase 0, Gate A). |
| S18 | s18:1945 | Soften `preferir_bootstrap_si_colas` (Phase 0, Gate A). Check the youDo output it feeds. |
| S18 | s18:532, :1831, :1874, :1881, :1900, :1952, :1968 | The mapping turns "S19" into S21 (Visualización). Codex adds S19 (inference) and S20 (design) to the chain. Example: "Hilo S17 → S18 → S19" at :1900. |
| S21 (old S19) | s19:357 | Error-bar recall: S19's intervals and S20's readout inside the dashboard. The colour "contraste" sense note goes here. |
| S22 (old S20) | roadmap:340 | "S17–S19" would silently widen to "S17–S21". Write "S17, S18 y S21". |
| S28 (old S26) | s26:64-74 | Orchestration DAG. S35-T4-A states the sense split. |
| S36 (old S33) | s33:34 | Rewrite the CV gloss to the entity-grouping delta. |
| S36 | s33:100-110 | Recall S35's `DummyRegressor`. The s33:48-50 baseline gate stays. |
| S36 | s33:159 | Ridge recall; "abrir la caja" of `LogisticRegression`. |
| S36 | s33:208 | Odds-ratio reading: decision 19. |
| S36 | s33:274-277 | Recall S35's `.T`. |
| S36 | s33:442-450; :486 | K-fold recall; entity disjointness is the delta. |
| S36 | s33:524-530 | MAE recall; the seasonal baseline and rolling origin are the delta. |
| S36 | s33:595 | Recall S35's framing in the same workbench. |
| S37 (old S34) | s34:225-227 | `resample` sense split (pandas time series vs class imbalance). |
| S37 | s34:306-310 | Recall Bayes (S19-T1-A). |
| S37 | s34:376 | One line: a propensity model is calibrated the same way (points to S38). |
| S37 | s34:408 | The threshold is piloted with S20's design (points to the CP-N3-C pilot plan). |
| S38 (old S35) | s35:48-50 | **The marker stays.** |
| S38 | s35:64 | Recall coefficient inference and "coeficiente no es efecto" (S35); permutation importance recalls S19's permutation test. |
| S38 | s35:99 | Model-based IPW: worked example plus a topic-evaluation item. |
| S38 | s35:210 | Conformal "cobertura" recalls S19's coverage simulation. |
| S39 (old S36) | s36:313; :408 | σ rules recall S19's normal; backtests recall S35's K-fold and s33:524. |
| S42 (old S39) | s39:2014-2488 | Grader "S27-S39" becomes "S29–S42" (G-8). |
| S53 (old S50) | s50:57 | The baseline-vs-candidate scorecard recalls McNemar and paired comparisons. |
| S55 (old S52) | s52:49, :60, :320, :1922, :1936, :2012, :2055, :2080, :2107, :2109 | "52" becomes 55 (G-9). |
| copy | qa-tour-content.ts:85 | "S30 … veintinueve" becomes S32 and 31. Rewrite it without a distance. |
| capstone | course-state/capstones/CP-N2-B/BRIEF.md "Prerrequisitos" | The prerequisite names are already wrong today: they name RAG and FastAPI, which come from slugs. Fix them with the S19/S20 change (ask-first). |

## 4. Migration phases and guards

### 4.1 Phase order

G's Phase 0 is kept. The lead's ordering fix is applied.

1. **Phase 0a.** Draft every PR, each with CI and a mutation proof.
2. **Gate A** (approved).
3. **Phase 0b, merged one PR at a time in this order:**
   - **0b-1, sentinel and history guards in one PR.** No CI step ever calls a missing file. The PR contains:
     - the G-11, G-14 and G-15 scripts (dormant), with `renumber-history-guards.test.mjs` and their sentinel-job steps;
     - G-1;
     - the row-183 first-push fix;
     - preservation_sentinel.mjs:159, now reading the section count from the HEAD roadmap. The mutation proof runs both ways: 55 sections with a 52-heading roadmap fails, and 55 with 55 passes;
     - the G-14 transition check: the window may close only in a tree that contains the sha recorded in `renumber_epoch.json`;
     - `curriculum/55` triggers.
   - **0b-2.** The deploy gate (`workflow_run`, head_sha asserts, `workflow_dispatch` removed), CODEOWNERS, and the AGENTS.md ask-first line.
   - **0b-3.** Catalog reconciliation, and retargeting test_eligibility_engine.py:44.
   - **0b-4.** The manifest with unbound role keys, and G-3a.
   - **0b-5.** Counts-free positional claims at 2.0.0, and G-3b. Gate A's approved diff counts as the Gate C approval for these badges.
   - **0b-6.** The fixer-state re-key, and G-12.
   - **0b-7.** The glossary and S18 commit:
     - "estimando" at s18:251; s18:1945;
     - the p-value and normal definitions;
     - the pin, accepting /al menos tan (extrem|grande)/ and /sin efecto|ningún efecto|H0|hipótesis nula/;
     - NEVER_APPEARS_OWED 5→4;
     - `distribuci-n-normal` is **not** re-homed here.
   - **0b-8.** Derive the number duplicates; add G-2 and G-4 to G-10; add SIM-11 with its test.
   - Then commit `curriculum55_window.json`, cut `curriculum/55`, and apply its protection rule.
4. **Gate B.**
5. **Phase 1a (main).** G-16, the teaching-debt guard, lands before any Phase 1 merge.
6. **Phase 1 (main).** Re-key badges by title through the manifest. No untaught claim is removed.
7. **Phase 3: PR-1, merged with a merge commit.** It has three commits:
   - the owner's roadmap diff, rendered by render_roadmap.py from plan_A.json with Codex-drafted entries and R-1;
   - the renumber by f, with three full-grid scaffolds and role binding (inference → S19 slug, design → S20 slug, regression → S35 slug), G-17, and `authoring_pending.json` listing the three slugs;
   - the epoch file.
8. **Phase 4: authoring in curricular order, S19, then S20, then S35.**
   - The practice-home pins land in these commits, never earlier.
   - The S19 commit re-homes and writes `distribuci-n-normal`: NEVER_APPEARS 4→3.
   - The S20 commit changes no constant.
   - The S35 commit re-homes `cross-validation`, `standardscaler` and `hyperparameter-tuning`. NEVER_APPEARS goes 3→2, because `hyperparameter-tuning` revives. DECLARED_LATE_OWED stays 13.
   - The last 2 dead terms, `args-y-kwargs` and `namedtuple`, belong to the 2026-10-02 decision 4 work.
9. **Gate C, then Phase 5** (node and claim text; regenerate tokens).
10. **Phase 6.** Close the window, then merge with a merge commit.

### 4.2 Guard inputs that depend on placement

| guard | input under the ruled placement |
|---|---|
| G-11(c) | f as above. 816 (slug, suffix) pairs rebound (336 at +2, 480 at +3). 3 new slugs, each with a 24-grid. |
| G-11(e), sentinel :159 | 55, read from the HEAD roadmap's `### S` headings. |
| G-14 frozen set | Same as G: it is defined on main's numbering (old S19–S52, plus the listed files). |
| G-15 | Lines on main carrying an S-token ≥ 19 are mapped through f. |
| G-3a | The spans in §1. evidence_grounded resolves to S55. |
| G-4 | test_late_curriculum_transfer_contract.py:14 `range(31,40)` becomes a slug set; :29 `[33]` → `advanced-models` (S36); :34 `[39]` → `integrator-phase2` (S42).<br>test_concept_depth_ratchets.py:238 "S32" → **S34**.<br>admin-analytics.ts:79-88 and admin-analytics.test.ts:33-41 → **13/28/42**, derived from `phase` (the phase-0 display question is open).<br>test_master_curriculum_specificity.py:12-16 → a slug set (new S43–S55).<br>`SUB_N4C`, `LEVELS` and CP-FINAL are derived. |
| G-5 | PdfReport.tsx:61-113: 34 labels move by f. |
| G-6 | 46 tags (19 distinct strings) ≥ S19 move by f; fix the 3 mismatched tags first (ResourcesPage.tsx:1611-1614). |
| G-8 | catalog.ts:30 → 'S14–S28'; :33 → 'S29–S42'; L4 → 'S43–S55'; s39 grader. |
| G-9 | 55 everywhere; 518 hours. |
| G-10 | The 9 `gate_section` values; sub-gates S52/S53/S54; 47 capstone files with S-tokens ≥ 19; 52 banks plus 3 new (length-balanced, LONGEST_IS_CORRECT_OWED 1125); `section_ledger`. |
| R-1 | Only roadmap:340 is a mistaken widening. Allowlisted intended widenings: :1, :10, :40, :41, :270, :406, :413, :415, :551, :558, :696, :703, :716. Lines :775 and :783-791 are owner-flagged or the frozen snapshot. The ruled insertion points are a subset of G's, so no lesson range literal straddles one. G measured 0. |
| G-13 | `authoring_pending.json` lists the S19, S20 and S35 slugs. |
| Ratchet | The commits named in §4.1. |

### 4.3 Hard blocks

| guard | location | bad state it fails on |
|---|---|---|
| History present | G-11, G-14, G-15 in `scripts/preservation/*.mjs` (sentinel job, `fetch-depth: 0`); proof in `tests/adversarial/renumber-history-guards.test.mjs` | `HISTORY_MISSING`: a shallow repository, or an unreadable sha, parent or branch point |
| G-1 | scripts/preservation_sentinel.mjs:262-268 | CURRICULUM_COMPARE_SKIPPED reported as OK |
| First push | preservation_sentinel.mjs:68-69, :80 | BASE_UNREADABLE when `before` is all zeros |
| Section count | preservation_sentinel.mjs:159 | The tree's count differs from the HEAD roadmap's heading count |
| G-11 renumber meaning | `renumber_meaning_guard.mjs` | A squash or rebase drops the renumber sha. An id is bound off f. A (slug, suffix) pair is missing. A new slug has no grid. A moved file differs without a ledger row. |
| G-15 carried tokens | Same script, branch side | A line from main with an S-token ≥ 19 arrives unmapped and has no `carried_from_main` row |
| G-14 freeze | `curriculum55_freeze_guard.mjs` | A frozen item changes on main without an `overrides[]` row. The window closes in a tree without the renumber sha. |
| Deploy | .github/workflows/deploy.yml | The run is not head_branch == main, event == push and conclusion == success. head_sha is no longer main's tip. G-13 is not empty. |
| G-2 | test_forward_dependencies.py | A binding is renumbered and `index:` is not |
| G-3a | tests/adversarial/test_badge_section_identity.py | A token does not resolve to its manifest slug. A positional span differs from its phase. A node is claimed while its role is unbound. |
| G-3b | Same test file | A count or S-range literal in either claim field. Any mention of do-calculus. |
| G-4 to G-10 | The tests named in §4.2 | A pass on the wrong section; a stale label, tag, band, copy or pairing |
| G-12 | Fixer state; apply_patches.py:49 | A slug and number mismatch; a hardcoded 52; a missing epoch |
| G-13 | tests/adversarial/test_authoring_window.py (also run by deploy) | A deploy or merge while scaffolds are pending. A slug leaves the list before its exit criteria are met. |
| Glossary definitions | tests/adversarial/glossary-statistics-definitions.test.mjs | The p-value definition lacks the extremeness or no-effect wording, or contains a threshold. The normal definition lacks `1[.,]96`. |
| Glossary ratchet | glossary-first-use-ratchet.test.mjs:44, :46 | A constant changes outside the named commits |
| Practice homes | test_concept_depth_ratchets.py | Fewer than 3 S19 valor-p exercises. No S18 Cohen's d exercise. S20-T1-B does not name ITT, Wald/LATE and per-protocol, or does not compute the complier effect. The S19-T3-B-E2/E3 or S20-T4-B pinned strings are absent. |
| **G-16 teaching debt (new)** | `tests/adversarial/test_teaching_debt_guard.py`; `src/lib/eligibility/teaching_debt.json`; a refusal in credential-gates.ts and engine.ts | A claimed node or claim pattern has neither a teaching home nor an open debt row. A badge with a debt is issuable. The route returns anything but 403 `TEACHING_DEBT_OPEN` for such a badge. A debt claim is deleted from its badge (never drop). Mutations M-a to M-d. |
| **G-17 sense guard (new)** | `tests/adversarial/statistics-sense-guard.test.mjs` | S19, S20 or S35 prose uses a banned bare word: "contraste" without "de hipótesis", the gerund "estimando", bare "potencia", "regresión", "DAG", "DiD", "LATE" or "cumplimiento". A new term has a bare alias from the §2 lists. |
| R-1 | render_roadmap.py (scratchpad tool) | A PLACEHOLDER; an unallowlisted straddling range; stale totals |

## 5. Remaining owner decisions

**Gate B: answered before Phase 3.**

12. **Titles. Recommendation: change S19's title to "Inferencia: incertidumbre, intervalos y contraste de hipótesis". Keep S20 and S35 as ruled.**
    - Bare "contraste" means colour contrast 14 times in old S19 (now S21), for example s19:34, :357 and :1561.
    - It means colour contrast 35 times in old S51 (now S54), for example s51:400-402.
    - It also appears in CP-N2-B's own gate.json ("contraste conceptual") and at qa-tour-content.ts:104.
    - S21 is two sections after S19, in the same capstone arc.
    - The change must be in the owner's roadmap diff, because the title test string-matches the heading.
    - Alternative: keep the title, and G-17 enforces "contraste de hipótesis" in the prose.
    - "estimandos" in S20's title does not trigger the `estimando` hover, because the alias regex rejects the plural.

8. **Capstones (ask-first).**
   - **8a. Recommendation: accept the six-section CP-N2-B arc, with no sub-gate.**
     - The gate moves S21→S23, and the learner carries the capstone for 54 h.
     - gate.json gains the S19 criterion (n, CI, effect size; Holm) and the S20 criterion (the readout refuses without plan, SRM and estimand).
     - The dataset gains a randomised merchant rollout. The brief's stale prerequisites are fixed.
     - Alternative: sub-gate CP-N2-B.1 at S20. It gives earlier feedback but adds structure that only CP-N4-C has today.
   - **8b.** CP-N3-B gets the S35 increment and a `review_minutes` field.
   - **8c. Recommendation: yes. CP-N3-C gets a pilot-plan deliverable for the s34:408 threshold.**
     - Review stays in both arms.
     - A random audit runs below the threshold.
     - Missed cases are counted per arm.
     - This gives design its N3 evidence for the DA and AI/ML ladders. The marker stays.

17. **Teaching-debt guard. The owner's ruling binds; only its definition is open. Recommendation:**
    - **Teaching home.** A node has a home when the manifest binds it to an active section whose title names the skill and whose concept-matrix rows show at least one practised subtopic.
      - Under this rule deep_learning has no home. The tiny network at s33:243-277 is one subtopic in "ML supervisado y baselines responsables".
      - Fine-tuning and graph-RAG have no home. s41 and s42 are titled "APIs con FastAPI…" and "Schemas, seguridad…".
    - **Scope.** All badge classes, as ruled. The guard blocks 12 badges:
      - progress_phase1/2/3_walked;
      - responsible_machine_learning_evaluation, applied_deep_learning_practice, llmops_production_delivery, container_platform_engineering_practice, integrated_data_science_practice and integrated_ml_engineering_practice;
      - all three level capstone credentials.
      - No learner holds any badge today. The route returns 403 for every credential (RT-G1). Nothing is revoked.
    - **Debt rows.** Each row records a scheduled slot "after Phase 6" and a retire-when line.

7. **Credentials (by role key).**
   - New badge `applied_statistical_inference` (independent_practitioner): S18–S20, with descriptive_stats, hypothesis_testing and experimental_design. It needs its own claim_evidence_contract file.
   - capstone_independent adds hypothesis_testing and experimental_design.
   - capstone_advanced_applied adds regression and causal_inference.
   - data_analyst adds hypothesis_testing and experimental_design.
   - data_science adds the same two only. Regression at S35 (N3) would invert its independent level. This cost is the same under G.
   - responsible_machine_learning_evaluation adds S35 only after Phase 1 relabels it to N3.
   - N2 claims say "aplica".

5. **Boundary.** Recommendation: approve the §2 list. That includes multi-period DiD inside the course (S35-T4-B-E3) and heterogeneous effects in the S20 youDo.

18. **Model-based IPW.** Recommendation: a worked example at s35:99 plus a topic-evaluation item, practised through the 8c pilot. Alternative: amend one S38 exercise under the displacement rule, with a ledger row.

19. **Logistic odds ratios** (VP). Recommendation: amend one existing S36-T2-B exercise (the s33:208 block) to print `exp(coef)` as an odds ratio, with a ledger row. Alternative: the boundary.

20. **G-17 sense guard.** Recommendation: approve it. It lives under `tests/`, which is a protected path.

4, 9, 10, 11, 13, 15. **Unchanged from G, with re-derived inputs:**
- **4.** Defer 2SLS and do-calculus, each with a retire-when line.
- **9.** V3 is authoritative; update or retire learning_roadmap.md.
- **10.** Homonyms. Add these to G's list:
  - "LATE" at S49;
  - "cumplimiento" and "A/B" (both first used in S01);
  - "DiD" (S24's variable);
  - the gerund "estimando";
  - a fourth sense of "cobertura" (report coverage in CP-N2-B's gate.json);
  - `resample` at s34:225.
- **11.** One learner notice; nothing is awarded retroactively.
- **13.** Amend AGENTS.md:131 and course_requirements.json:14-15 and :35 to 55 and 13/15/14/13.
- **15.** Parallel work, as in G.

**Gate C: answered before any claim text merges.** The owner approves Codex's text, shown as a diff, for:
- `applied_statistical_inference`;
- the node additions in decision 7;
- the progress_phase1/2_walked node additions;
- the L2 and L3 `exitCapability` lines (catalog.ts:30, :33);
- the learner notice.

The Gate A diff already covers the counts-free positional text.

**How this was produced:**
- All reads came from `mergewt/` and `g0/` under `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/`.
- `mergewt/` has no `.git`, so I ran no git commands. I ran no gate or audit scripts.
- I measured counts with `/usr/bin/python3` (system Python 3.9.6), not `.venv-content`. My Python copy of the glossary ratchet reproduced the 13 late terms and the 5 dead terms exactly.
- I wrote one scratch file outside any repository: `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/g0_facts_dump.txt`.
- No pinned lesson output was computed here. Every pin must come from `.venv-content` (Python 3.12).