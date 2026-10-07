# Round 5 revision of the ruled-placement design (S19 inference, S20 design, S35 regression)

## Part 0. Round-5 issues

All three blocking issues are conceded, and the design changes for each one. I defend one sub-point inside R5-B2: review A's example source for teaching homes cannot be used, and the reason is given in its row. Every non-blocking note is adopted. Seven of my own findings are added at the end of the table.

| issue id | from | CONCEDE/DEFEND | change or evidence |
|---|---|---|---|
| R5-B1-G17-fails-the-owner-ruled-titles | A, blocking | CONCEDE | G-17 splits into two guards. G-17a is an alias rule on terms.ts. G-17b is a prose rule that reads only the body fields of the three new section files. G-17b exempts a section's root `title` only when it equals that section's `### SXX — Title` heading in the HEAD roadmap, the file the owner applies (corrected after the closure check: no plan_A.json exists in the tree). It also exempts the roadmap `### S` heading. `shortTitle` stays in scope, because the owner never ruled it. Mutation pairs: both ruled titles pass; a changed S19 title with bare "contraste" fails; bare "contraste" in an S19 theory paragraph fails. Decision 12 now recommends keeping the ruled titles and gives the collision as information. |
| R5-B2-G16-teaching-home-has-no-input | A, blocking | CONCEDE; DEFEND on the source | **Phase 1a input.** G-16 reads `src/lib/eligibility/teaching_debt.json`, which has three O18 rows. It also reads `claimed_nodes_baseline.json` (the 46 nodes claimed today) and `teaching_homes.json` (empty). All three files exist before Phase 1.<br>**Computed count.** I computed the blocked set from the rule as written: 12 badges are refused directly, and 15 are not issuable once prerequisites are followed (engine.ts:156-171).<br>**Widening.** It happens in Phase 1's last commit, after the title re-key (§4.4).<br>**DEFEND.** curriculum_skill_graph.json cannot be the source. Its SECTION_SKILL_MAP (industry_alignment/_phase3_build/build_curriculum_graph.py:530-583) is keyed by hand to section numbers from the old order. It homes deep_learning at S23, S33, S34, S41, S44 and S46 (264 activities). That would retire O18's debt on paper. |
| R5-B1-S20-youDo-depends-on-the-S23-reports-factory | B, blocking | CONCEDE | The S20 You Do produces `readout_experimento.json` and `validar_readout(readout) -> list[str]` in plain Python and pandas. The function returns refusal reasons. It renders nothing.<br>**Bridge to new S21** (s19:1629, :1756): one of the four required figures plots the readout's intervals.<br>**Bridge to new S23** (s21:1660-1675): `reports.render(spec)` loads the readout and calls `validar_readout`. It writes the reasons to `ReportBundle.errors` and renders no experiment page when there are reasons.<br>The readout carries a `recomendacion` and `decision: None`, which matches s21:222 and :326. |
| A-n1 / B-n2 Katz taught twice | A, B | CONCEDE | S19-T3-B-E3 keeps only the log-RR bootstrap, the zero-control count and the named point estimates, and names Katz as a forward hook. S20-T3-A-E3 derives Katz as the delta method and checks it against S19's bootstrap CI. That is the gap-1 hook. |
| A-n2 / B-n5 CUPED ddof trap | A, B | CONCEDE | θ = `np.cov(X, Y)[0, 1] / np.cov(X, Y)[0, 0]`, so both sides use ddof=1. The check is `np.isclose(theta, np.polyfit(X, Y, 1)[0])`. Y is the outcome in the experiment period, X is the covariate from the pre-period, and both arms are pooled. The You Do aggregates to the merchant before CUPED and the SE. |
| A-n3 / B-n3 IPW by stratum equals post-stratification | A, B | CONCEDE | With e(s) = n1s/ns, both Horvitz–Thompson and Hájek reduce to Σ_s (n_s/n)(ȳ1s − ȳ0s). S20-T4-B-E1 prints both estimates and pins `iguales=True`. Stabilised weights leave the Hájek estimate unchanged, and the lesson shows this. T4-B adds three things: the weights view, the positivity diagnostic, and the observational assumption. |
| A-n4 S20 You Do forward dependency | A | CONCEDE | Merged into R5-B1 (review B). |
| A-n5 admin phase-0 display question | A | CONCEDE | The design settles it. The phase comes from `phase`, and phase 0 shows as band 1, as admin-analytics.ts:84 does today. No gate owns this item. |
| A-n6 normal definition in 0b-7 | A | CONCEDE | The rewrite of the normal definition, and its `1[.,]96` check, move to the S19 commit. 0b-7 now does exactly what O17 lists. |
| A-n7 SIM-11 in Gate B | A | CONCEDE | 0b-8 cites audit/fixer/DECISIONS_2026-09-21.md:1485 as its authority. Decision 15 drops SIM-11. |
| A-n8 stale roadmap prerequisites | A | CONCEDE | The owner's roadmap diff sets these prerequisites: new S21 "S20"; new S23 "S20 y S22"; new S36 "S35". R-1 fails when the section after an insertion does not name it. |
| A-n9 S18 chain lines missed | A | CONCEDE | s18:495, :833 and :1978 get chain-edit rows in §3. |
| A-n10 exitCapability citation | A | CONCEDE | Gate C cites catalog.ts:31 and :34. G-8 edits :30 and :33. |
| A-n11 PdfReport and certificado | A | CONCEDE | G-5 also adds 3 SECTION_NAMES entries (progress-document.test.ts:174-176). The certificado threshold becomes 55/55 (progress-document.ts:26-29). Decision 11's notice says so. |
| A-n12 confusor and error estándar are missing | A | CONCEDE | The S19 commit creates `error-estandar` and the S20 commit creates `confusor`. Both are homed at S18. Neither gets an acronym alias such as "SE". |
| A-n13 G-9 literal 55 on main | A | CONCEDE | G-9 asserts derived consistency. It names the literal 52s at v3_invariant_validator.py:21, :146-147 and v3_regression_counts.test.mjs:6, :35, :43-44, :53. |
| A-n14 runtime budgets | A | CONCEDE | §2 states R or B and a vectorised form for each simulation, within the 8 s budget (python_content_runtime_audit.py:38). |
| A-n15 / B-n12 verified items | A, B | noted | No change. |
| A-n16 environment and open checks | A | CONCEDE | I re-read everything in .claude/worktrees/readiness-gaps (HEAD 3ec808dd); `git ls-files --deleted` returns 0.<br>Closed checks:<br>• Figures per zone are 41/28/48.<br>• qa-tour-content.ts:104 is confirmed.<br>• CP-N2-B gate.json:8 "contraste conceptual" is confirmed.<br>• Browser storage keys progress by slug and by sub-step kind, never by exercise id (progress-store.ts:16-20; SectionView.tsx:306-328). The renumber therefore cannot show old work on another exercise.<br>The claim "mergewt has no .git" is withdrawn. |
| B-n1 damaged worktree | B | CONCEDE | No read in this round comes from mergewt. Phase 0 must run from a worktree outside /private/tmp. |
| B-n4 S20-T4-B-E3 pins | B | CONCEDE | In the data-generating process, selection depends only on the volume band. Each bootstrap resample re-estimates the band shares. |
| B-n6 flywheel gaps | B | CONCEDE | (a) S20-T2-A-E3 becomes the We Do for unit 25: segment readout, Holm, difference-of-effects z and Gelman–Stern. (b) Accepted. (c) Each of the 25 units maps to at least one selfCheck or topic-evaluation item, and the practice-home test asserts it. (d) S20-T3-A uses an ICC set in the data-generating process and the ANOVA estimator through `groupby`. |
| B-n7 SMD and Cohen's d | B | CONCEDE | S20-T3-B-E2 computes the pooled SD √((s1²+s0²)/2). This is a delta over s18:1291, which hands the learner `s_pooled=2`. |
| B-n8 hand-built avoid-list | B | CONCEDE | G-17a generates each section's avoid-list from terms.ts. G-17b bans bare "cobertura" in S19 body prose, because S18 uses it 32 times for sample coverage. I also found two collisions the reviewers missed (row S-6). |
| B-n9 "contraste" and "interacción" evidence | B | CONCEDE | Old S19 has 13 case-sensitive hits and 14 case-insensitive. Old S24 (new S26, OCR) has 5. Old S51 has 34 and 35. the plural "interacciones" first appears at s14:1116, and the singular whole word "interacción", which an alias would match, first appears in old S28 at line 1392 (new S30; corrected after the closure check). |
| B-n10 remaining hard-coded 52s | B | CONCEDE | G-4 and G-9 now name them (see A-n13). |
| B-n11 F-test caveat | B | CONCEDE | S35-T2-A states that the F equals `f_oneway` only when the model's sole predictor is one categorical variable with reference coding. |
| S-1 (mine) S21 bridge anchor | self | CONCEDE | s19:357 is the colour-contrast paragraph, and old S19 has no interval text. The recall moves to s19:40. The colour sense note stays at :357. |
| S-2 (mine) where G-16 refuses | self | CONCEDE | The issue route serves only `verified_credential` badges (credential-gates.ts:34-37). Competency badges and progress markers are refused in engine.ts. Mutation M-b targets both places. |
| S-3 (mine) claim fields | self | CONCEDE | The claim patterns read only `name`, `public_claim` and `newbie_friendly_description`. They never read `non_claims`, where the industry_alignment copy mentions fine-tuning for 3 badges. |
| S-4 (mine) prerequisite closure | self | CONCEDE | 12 badges are blocked directly. 15 cannot be issued, because 3 more depend on a blocked prerequisite: ai_governance_code_review_practice, evidence_grounded_ai_systems_capstone and progress_journey_completed. |
| S-5 (mine) launch decision against S23's rule | self | CONCEDE | S20 outputs `recomendacion` and leaves `decision: None`, matching S23's `pending_review` rule. |
| S-6 (mine) alias collisions | self | CONCEDE | "R2" is not an acronym under `aliasIsAcronym`. It would match `r2` in old S04, S13, S26, S30, S31 and S41. "DiD" matches whole-word `did` only in old S22 (new S24, 8 hits); the other counts were substrings such as "medida" (corrected after the closure check). Both are banned as aliases. |
| S-7 (mine) G-17 scope for "regresión" | self | CONCEDE | The bare-word bans for "regresión", "DAG", "LATE", "potencia" and "cumplimiento" now apply to aliases (G-17a), not to S35 or S20 prose. Their risk is a hover or first-use misfire. In the section that teaches the sense, prose may use the bare word. |

---

# The revised design

**Bottom line**
- The ruled placement can be built, and S20 rests only on S01–S19.
- Round 5 changed four parts of the design:
  - G-17 split into an alias rule and a prose rule, and the owner's titles are exempt;
  - G-16 got a finite input that exists before Phase 1, a computed blocked set, and a stated widening;
  - S20's You Do became a JSON readout plus a validator, which new S21 plots and new S23 renders;
  - the statistics fixes: Katz once, ddof=1, the IPW identity, the ICC estimator, the SMD delta and the unit-25 We Do.
- These parts are kept from G without change:
  - Phase 0, with the lead's ordering fix;
  - the eight regression units;
  - the guards G-1 to G-15;
  - the three-gate structure;
  - the 25 completeness units.
- The ruled placement costs these things:
  - CP-N2-B grows to six sections.
  - Design sits one level below the DA and AI/ML ladders.
  - Model-based IPW becomes a bridge at S38.
  - IPW comes 15 sections before the backdoor criterion.
  - The CUPED = OLS identity arrives 15 sections after CUPED.
  - "contraste" in S19's title shares the word with colour contrast in S21, image contrast in S26, accessibility contrast in S54 and CP-N2-B's own gate.json:8.
- The ruled placement gains these things:
  - No edge in the industry skill graph is inverted.
  - The delta-method hook gap is 1.
  - The CP-N3-C marker does not move.
  - Multi-period DiD is taught.
  - Design fits the DS ladder.
- Two corrections from round 5 stand:
  - S18 teaches no covariance (0 hits).
  - `error estándar` and `confusor` are homed at S18.

**Notation.** `sNN:L` means `src/lib/course/sections/sNN-*.ts` line L, with today's file names and old numbering. Other paths are relative to the repository root.

## 0. What changed from G

| part | under G | under the ruled placement | why |
|---|---|---|---|
| Insertions | After old S18, S32 and S34 | After old S18 (S19 and S20), and after old S32 (S35) | Owner ruling (O16) |
| Shift zones | 0 / +1 / +2 / +3 | 0 / +2 / +3 | Two insertion points |
| Sections per level | 13 / 14 / 15 / 13 | 13 / 15 / 14 / 13 | Two new sections at N2, one at N3 |
| Hours | 518 | 118 / 136 / 127 / 137 = 518 | 9 h per new section |
| Design | S37, N3; opens CP-N3-C | S20, N2, inside CP-N2-B | Owner ruling |
| Regression | S34 | S35 | Same slot, new number |
| CP-N2-B | S18–S22, gate S22 | S18–S23, gate S23 (6 sections) | S19 and S20 fall inside the arc |
| CP-N3-B | S32–S36 | S33–S37, gate S37 | S35 falls inside the arc |
| CP-N3-C | S37–S42; the marker moves | S38–S42; the marker stays at s35:48-50 | No design section opens N3-C |
| Positional spans | S14–S27; S28–S42 | S14–S28; S29–S42 | Derived from `phase` |
| CUPED θ | S34's OLS slope | `np.cov(X,Y)[0,1]/np.cov(X,Y)[0,0]` with ddof=1 on both, checked against S18's polyfit slope | OLS comes after S20 |
| IPW (practised) | Logistic plus calibration | Treated share per stratum; the identity with post-stratification is taught | Logistic comes after S20 |
| Model-based IPW | Practised | Bridge at S38 (s35:99), with a pointer at S37 (s34:376) | Needs logistic and calibration |
| Katz | S19 | S20-T3-A-E3 only, as the delta method | Taught once |
| Heterogeneous effects | Interaction terms | S20-T2-A-E3 (We Do) and the S20 You Do; S35-T1-B reframes them as an interaction | No regression at N2 |
| DAG and DiD | Before design | S35-T4, after design | The edge `experimental_design -> causal_inference` holds |
| Design You Do | Threshold pilot (CP-N3-C) | `readout_experimento.json` plus `validar_readout`; S23 renders it; the threshold pilot becomes a CP-N3-C deliverable | The reports factory comes at S23 |
| Titles | G's titles | The owner's titles, kept; the collision is information at Gate B | A guard never forces a title change |
| G-16 input | Undefined | `teaching_debt.json` (3 O18 rows), a 46-node baseline, `teaching_homes.json`; widening in Phase 1 | R5-B2 |
| G-17 | One prose ban including titles | G-17a for aliases; G-17b for body prose, with the title exempt | R5-B1 (A) |
| Normal-definition rewrite | 0b-7 | S19 commit | Outside O17's enumerated list |
| Admin bands | Open question | From `phase`; phase 0 shows as band 1 | No gate owns it |

## 1. Numbering, levels, hours, capstones, spans, zones

```
old     S01 ─ S18 │             │ S19 ─ S32 │       │ S33 ─ S52
new     S01 ─ S18 │  S19   S20  │ S21 ─ S34 │  S35  │ S36 ─ S55
shift       0     │  new   new  │    +2     │  new  │    +3

N1  S01 ─────────── S13                                 13 sec  118 h
N2  S14 ─ S18 · S19 · S20 · S21 ─ S28                   15 sec  136 h
N3  S29 ─ S34 · S35 · S36 ─ S42                         14 sec  127 h
N4  S43 ─────────── S54 · S55 FINAL                     13 sec  137 h
```

**The mapping f, used by every guard:**
- n stays n for n ≤ 18.
- n becomes n+2 for 19 ≤ n ≤ 32.
- n becomes n+3 for 33 ≤ n ≤ 52.

| zone | old | new | shift | sections | exercise ids | figure ids |
|---|---|---|---|---|---|---|
| 0 | S01–S18 | S01–S18 | 0 | 18 | 432 | 41 |
| A | S19–S32 | S21–S34 | +2 | 14 | 336 | 28 |
| B | S33–S52 | S36–S55 | +3 | 20 | 480 | 48 |
| new | — | S19, S20, S35 | — | 3 | 72 | new |

- 816 ids are rebound and 72 are new, for 1,320 exercises.
- I re-measured the figure counts in this round from index.ts imports and `figure: { id:` matches.
- 34 section files move with `git mv`. Slugs do not change.
- Browser progress is keyed by slug, so it survives the move (progress-store.ts:16-20).
- No existing section changes level.
- `COURSE_META` becomes 55 sections and 518 h (index.ts:62-64).
- `PHASES` become '14-28' at 136 h, '29-42' at 127 h and '43-55' at 137 h.

**Capstones** (catalog.ts:75-117):

| capstone | gate | contributing | n | change |
|---|---|---|---|---|
| CP-N1-A / B / C | S04 / S08 / S13 | S01–04 / S05–08 / S09–13 | 4/4/5 | none |
| CP-N2-A | S17 | S14–S17 | 4 | none |
| CP-N2-B | S23 | S18–S23 | 6 | +S19 and +S20; gate S21→S23 |
| CP-N2-C | S28 | S24–S28 | 5 | +2 |
| CP-N3-A | S32 | S29–S32 | 4 | +2 |
| CP-N3-B | S37 | S33–S37 | 5 | +S35; gate S34→S37 |
| CP-N3-C | S42 | S38–S42 | 5 | +3; the marker stays |
| CP-N4-A / B | S46 / S50 | S43–46 / S47–50 | 4/4 | +3 |
| CP-N4-C | S54 | S51–S54; sub-gates S52/S53/S54 | 4 | +3 |
| CP-FINAL | S55 | S55 | 1 | +3 |

- The capstone sizes sum to 55.
- Nine `gate_section` values change: S21→S23, S26→S28, S30→S32, S34→S37, S39→S42, S43→S46, S47→S50, S51→S54 and S52→S55.
- `LEVELS` bands become 'S14–S28', 'S29–S42' and 'S43–S55'.

**Positional spans** (taken from `phase`; the final section is excluded from phase 3):
- progress_phase1_walked and capstone_independent cover S14–S28.
- progress_phase2_walked and capstone_advanced_applied cover S29–S42.
- progress_phase3_walked and capstone_integrated_mastery cover S43–S54.
- progress_journey_completed covers S01–S55.
- evidence_grounded_ai_systems_capstone resolves to S55 by `index:` (credential-gates.ts:44-48).

**Graph edges.** Every edge holds under the ruled positions:
- `descriptive_stats -> hypothesis_testing`: S18 → S19.
- `hypothesis_testing -> experimental_design`: S19 → S20.
- `hypothesis_testing -> regression`: S19 → S35.
- `experimental_design -> causal_inference`: S20 → S35-T4.
- `regression -> classical_ml`: S35 → S36.
- `classical_ml -> feature_engineering` is already inverted today, and the renumber leaves it as it is.

**Ladders.**
- Design at N2 fits the DS ladder. It comes one level early for DA and AI/ML. The CP-N3-C pilot plan supplies N3 evidence for those two ladders.
- Regression at N3 is late for the DS and AI/ML independent level. This cost is the same as under G.

## 2. The new sections

Each topic has subtopics A and B, written as the delta over what the course already teaches. Codex writes all Spanish. Every pin comes from `.venv-content` (Python 3.12). Each of the 25 units maps to at least one selfCheck or topic-evaluation item.

### S19 "Inferencia: incertidumbre, intervalos y contraste" (N2)

**CP-N2-B increment.** Every claim that goes from a sample to a population cites n, a CI and an effect size. Tests apply only to pre-declared comparisons, with Holm across them.

| topic | A | B |
|---|---|---|
| T1 Probabilidad y distribución muestral | Conditional probability, independence and Bayes from a contingency table. Bernoulli and binomial. Delta: s18:2050 calls p conditional but teaches no rule. | Normal, CLT, SE and t, through `t.ppf` and `norm.ppf`.<br>The coverage simulation uses a named clean lognormal with σ = 1.0. It prints interval length and MC SE. Claims need a gap of more than 3 MC SE.<br>S18's population (s18:547) is the case where no interval for the mean rescues you.<br>The code never writes "coverage". R is fixed and vectorised. |
| T2 Pruebas por aleatorización | H0 and a permutation test on the S18 pilot. E3 is the self-selection delta (s18:1891, :2040). | p as a tail area, one-sided and two-sided. The duality with its qualifier. p ≠ P(H0\|datos), using T1-A's Bayes. |
| T3 Pruebas con nombre | Welch `ttest_ind(equal_var=False)` and its interval, refining S18's unpooled z (s18:369-374). Q-Q check. Paired t. McNemar via `binomtest`. | E1: pooled z² = `chi2_contingency(correction=False)`.<br>E2: 2/20 vs 7/20, with the pinned duality strings.<br>E3: `riesgo_relativo=3.5` and `lift_relativo=2.5` as point estimates. It prints the zero-control resample rate at 2/20 (0.9²⁰ ≈ 12 %) as a failure. Then it computes a log-RR bootstrap CI on a powered dataset with ≥30 expected control conversions. **It names Katz as S20's forward hook and does not compute it.** |
| T4 Errores y decisiones | Type I and II errors, power, MDE and n. The closed form is checked by simulation. | Holm and BH. Recalls s18:359. |

**Glossary.**
- S19 homes these terms: `distribuci-n-normal` (re-homed in the S19 commit, with its definition rewritten there), probabilidad condicional, teorema de Bayes, distribución binomial, TCL, distribución t, cobertura del intervalo, hipótesis nula, prueba de permutación, prueba t de Welch, prueba pareada / McNemar, chi-cuadrado, potencia estadística, error tipo I/II, efecto mínimo detectable, Holm, FDR/BH, riesgo relativo and lift relativo.
- The S19 commit creates `error-estandar` with its home at S18. Its first use is s18:1243, the only hit.
- **Banned aliases (G-17a):**
  - "Student";
  - bare "potencia";
  - bare "permutación";
  - "resampling";
  - bare "contraste";
  - bare "cobertura";
  - "SE";
  - plus the avoid-list that G-17a generates from terms.ts.

### S20 "Diseño experimental, estimandos y causalidad" (N2)

**You Do (CP-N2-B increment): an experiment readout in plain Python and pandas.**

```
S18 data note JSON (s18:1952-1964, sha1_8)
   │
S19 intervals, tests, Holm, powered lift data
   │
S20 readout_experimento.json  +  validar_readout(readout) -> list[str]
   │                                   │
   ├──▶ S21 (old S19) You Do: one of the four figures plots ITT and CUPED-ITT CIs
   │
   └──▶ S23 (old S21) reports.render(spec): loads the readout, calls validar_readout,
        writes reasons to ReportBundle.errors, renders no experiment page if any
```

- **Data.** The data is a merchant-level randomised rollout of S18's plan (s18:251). The learner aggregates to the merchant before CUPED and every SE.
- **`readout` fields:**
  - `plan`: estimand sentence, primary metric, guardrails, decision rule, n and full weeks;
  - `srm`;
  - `itt` with its cluster-aware CI;
  - `cuped`: θ, the adjusted ITT and CI, and the variance reduction;
  - `wald_late`, as a secondary result;
  - `guardrail` per arm (the cancellation rate, s18:358);
  - `segmentos`: pre-declared regions, Holm and the difference-of-effects z;
  - `recomendacion`, from the pre-registered rule;
  - `decision: None`;
  - `fuente_sha1_8`, from S18's data note.
- **The validator.**
  - `validar_readout` returns these reasons: no plan, SRM failed, no estimand sentence, or `decision` not None.
  - An empty list writes the JSON. A non-empty list prints the reasons and writes nothing.
  - The code uses no try/except, consistent with D10.
- **Capstone fit.**
  - This maps onto the P0 "Claims ejecutivos no soportados" (catalog.ts:75-78).
  - The S20 criterion is checked at the S23 gate, so no credential changes.

| topic | A | B |
|---|---|---|
| T1 El estimando antes que el dato | Estimand, estimator and estimate. Potential outcomes. ATE, ATT and ITT.<br>E1: the true ATE and ATT from a table with both potential outcomes.<br>E2: S19-T2-A-E3's self-selection estimate against the truth.<br>E3: the estimand sentence; ITT vs ATE. | Non-compliance: Wald = ITT_Y/ITT_D = LATE under four assumptions.<br>E1: ITT, Wald and per-protocol against the true ATE and the true complier effect.<br>E2: breaks monotonicity, then exclusion.<br>E3: one-sided non-compliance, where Wald = ATT. |
| T2 El plan | E1: the plan dict, with a function that returns the missing fields.<br>E2: n from S19-T4-A, rounded to full weeks; novelty and primacy.<br>**E3 (We Do for unit 25):** a pre-declared segment readout, with Holm and the difference-of-effects z. The demo and one selfCheck item state Gelman–Stern: significant in one segment and not in the other is not evidence that the effects differ. | Interim looks.<br>E1: reproduces s18:384-396.<br>E2: a Pocock-shaped boundary calibrated by simulation.<br>E3: an O'Brien–Fleming-shaped boundary, plus a per-arm guardrail stop.<br>Budget: R = 2,000 trials × 5 looks, vectorised with cumulative sums over an (R, n) array. Lan–DeMets is named only. |
| T3 Asignación y validez | Unit, interference, cluster randomisation.<br>ICC: the data-generating process sets a known ICC. The learner computes the ANOVA estimator (MSB − MSW)/(MSB + (m−1)·MSW) with `groupby`.<br>Design effect 1+(m−1)·ICC. The naive SE·√deff is compared with a cluster bootstrap (B = 1,000, resampling merchants).<br>Demo: the delta method on a ratio metric, which introduces `np.cov`.<br>**E3: Katz as the delta method on log RR**, on S19-T3-B-E3's powered dataset, checked against S19's bootstrap CI. | E1: SRM with `scipy.stats.chisquare`.<br>E2: SMD with the pooled SD √((s1²+s0²)/2), computed by the learner. This is a delta over S18-T2-B-E2, which hands over `s_pooled=2` (s18:1291).<br>E3: an SRM failure becomes a `validar_readout` reason. |
| T4 Precisión y pesos | CUPED: θ = `np.cov(X, Y)[0, 1] / np.cov(X, Y)[0, 0]`. X is the pre-period covariate, Y is the experiment-period outcome, and both arms are pooled. It is checked with `np.isclose(theta, np.polyfit(X, Y, 1)[0])` (S18-T3-A-E3). Variance is multiplied by about (1 − ρ²). Stratified randomisation and post-stratification with `groupby`. | IPW with stratum propensities e(s) = n1s/ns. The identity is taught: HT = Hájek = post-stratification.<br>E1: a ramp whose treated share changes by day. The pooled difference is biased. IPW by day and post-stratification by day print the same number (`iguales=True`).<br>E2: CASO-LIM-018 (> 110, s18:253). Positivity fails, and `positividad_falla=True` is pinned.<br>E3: soft self-selection where selection depends only on the volume band. The no-unmeasured-confounding assumption is stated. A bootstrap (B = 1,000) re-estimates the band shares in every resample. The largest weight per arm is printed. The demo shows that stabilised weights leave the Hájek estimate unchanged. |

**Prerequisites. S20 rests only on S01–S19:**

| S20 uses | taught at |
|---|---|
| Functions that return a list; `json.dump` | S05; S08 (18 `json.dump` hits) |
| Arrays; DataFrames; `groupby`/`agg`/`transform` | S14; S15; S17 |
| `std`/`var(ddof=1)`; SE of a difference | s18:75, :89; s18:275-276, :372 |
| Row bootstrap; Cohen's d | s18:198, :1304; s18:1267 |
| Counterfactual, randomisation, CASO-LIM-018 | s18:247-253 |
| Pearson and the polyfit slope | s18:307-341; S18-T3-A-E3 |
| p-value, primary metric, guardrails, peeking | s18:353-359; s18:363-396 |
| The JSON data note with sha1_8 | s18:1952-1964 |
| Bayes; critical values; permutation; Welch; χ²; powered dataset; power and n; Holm | S19 |

- **New at S20, introduced and practised there:**
  - `np.cov`;
  - `chisquare`;
  - the ICC estimator;
  - the cluster bootstrap;
  - Katz as the delta method;
  - boundary simulation;
  - the Wald ratio;
  - stratum weights.
- **Not used at S20:**
  - OLS (S35);
  - logistic regression (S36);
  - calibration (S37);
  - K-fold (S35);
  - visualisation libraries (S21);
  - Jinja, `reports.render`, DOCX and PDF (S23).

**Glossary.**
- S20 homes these terms: ATE/ATT/ITT, LATE/CACE, no cumplimiento del tratamiento, prueba A/B, covarianza, SRM, efecto de diseño, correlación intraclase, método delta, CUPED, aleatorización estratificada / post-estratificación, IPW, puntaje de propensión and positividad.
- The S20 commit creates `confusor` with its home at S18 (22 hits, all in S18).
- These terms stay at S18: `estimando`, `asignacion-aleatoria` and `autoseleccion`.
- **Banned aliases (G-17a):**
  - bare "LATE" (old S46 has 16 hits);
  - bare "cumplimiento" (first used in S01);
  - bare "A/B" (first used in S01);
  - bare "delta";
  - bare "pesos";
  - bare "riesgo";
  - bare "estratificación";
  - plus the generated avoid-list, which includes train-test-split, f1-score, roc-auc, shap, llm, columntransformer, feature-engineering, joblib, generator, defaultdict and every alias homed after S20.
- G-17b bans the gerund "estimando" in body prose (terms.ts:964 matches it without regard to case).

### S35 "Regresión y regularización" (N3, after old S32, before old S33)

**CP-N3-B increment.** A regression of `review_minutes` in the Red Andina workbench (s33:595), with coefficient CIs, ridge selected by K-fold, HC SEs and a non-causal label. This is ask-first (decision 8b).

| topic | A | B |
|---|---|---|
| T1 Regresión lineal | `DummyRegressor`, then `LinearRegression`. MAE, RMSE and R², with test R² ≤ 0 for the dummy. | Reference coding with `drop='first'`. Interactions as the difference of segment effects, recalling S20-T2-A-E3. |
| T2 Inferencia y diagnóstico | `X.T` and `np.linalg.solve`. SE, t CI and F. The F equals `f_oneway` only when the model's sole predictor is one categorical variable with reference coding. Bridge: CUPED's θ is the one-covariate OLS slope. | Residuals against fitted values, a polynomial term, HC SEs, leverage and Cook's distance. |
| T3 Regularización | VIF. Ridge, lasso and elastic net in a `Pipeline` with `StandardScaler`. | K-fold and `GridSearchCV` with a held-out test set. Nested CV in the demo only. |
| T4 Coeficiente no es efecto | Causal graph, backdoor paths, mediator and collider. Frisch–Waugh–Lovell over S18-T3-A-E3. The same adjustment by weighting recalls S20-T4-B. | DiD.<br>E1: two-period, collapsed, with HC SEs.<br>E2: a pre-period placebo.<br>E3: multi-period DiD with a unit block bootstrap (B = 1,000, vectorised) against naive HC. |

**Glossary.**
- S35 homes these terms: regresión lineal, mae, rmse, R², variables indicadoras, término de interacción, error estándar robusto, VIF, ridge/lasso/elastic net, grafo causal, mediador, colisionador and diferencia en diferencias.
- The S35 commit re-homes `cross-validation`, `standardscaler` and `hyperparameter-tuning`.
- **Banned aliases (G-17a):**
  - bare "regresión" (178 hits, mostly regression testing);
  - bare "interacción" (singular first in old S28, line 1392);
  - bare "DAG" (old S26 and S46);
  - "DiD" (whole-word `did` only in old S22);
  - "R2" or "r2" (old S04, S13, S26, S30, S31 and S41); use "R²", which has 0 hits;
  - bare "dummy";
  - "StratifiedKFold";
  - plus the generated avoid-list, which includes shap, roc-auc, resample and generator.
- **Sense notes in prose:**
  - S35-T1-A states the split between "regresión" as a model and regression testing (new S29–S30).
  - S35-T4-A states the split between a causal graph and an orchestration DAG (new S28).

**Where placement-sensitive pieces live.** These are unchanged from round 5:
- DAG and adjustment are at S35-T4-A.
- DiD is at S35-T4-B.
- Model-based IPW is a bridge at S38 (s35:99), with a pointer at s34:376.

### Completeness units and boundary

| # | unit | practised at |
|---|---|---|
| 1–8 | Probability and Bayes; normal/CLT/SE/t/coverage; H0 and permutation; p and the qualified duality; Welch, paired and McNemar; proportions; errors, power, MDE and n; Holm/BH | S19 T1-A to T4-B |
| 9–16 | Estimator API and metrics; indicators and interactions; coefficient inference and F; diagnostics and HC; VIF and penalties; K-fold and GridSearchCV; DAG and adjustment; DiD | S35 T1-A to T4-B |
| 17–24 | Estimand; Wald/LATE; plan; interim looks; unit, design effect, delta method and Katz; balance and SRM; CUPED and stratification; IPW by stratum and its identity | S20 T1-A to T4-B |
| 25 | Heterogeneous effects and the launch recommendation | S20-T2-A-E3 (We Do), S20 You Do, one selfCheck item |

**Declared boundary:**
- 2SLS;
- do-calculus beyond the backdoor criterion;
- Bayesian A/B;
- Poisson models and GLMs;
- rank tests;
- time-series inference;
- survival analysis;
- mixed models;
- synthetic control and RDD;
- staggered-adoption DiD;
- exact Lan–DeMets;
- AIPW;
- model-based IPW as a practised unit;
- logistic odds ratios (decision 19).

## 3. Bridges and moves in existing sections

Every bridge gets a row in `renumber_edit_ledger.json`. Codex writes the text.

| section (new) | anchor | change |
|---|---|---|
| S18 | s18:251 | Add "estimando" (0b-7). |
| S18 | s18:1945 | Soften `preferir_bootstrap_si_colas` (0b-7). |
| S18 | s18:495 | "trazabilidad hacia S19–S21": f turns it into S21–S23; the chain edit adds S19 and S20. |
| S18 | s18:833, :1978 | "dashboard … S19": f turns it into S21; the chain edit names the readout from S20. |
| S18 | s18:532, :1831, :1874, :1881, :1900, :1952, :1968 | Codex adds S19 and S20 to the chain, for example "Hilo S17 → S18 → S19" at :1900. |
| S21 (old S19) | s19:40 | Recall S19's intervals and S20's readout in the opening paragraph. |
| S21 | s19:357 | Sense note: colour "contraste" here, as opposed to the hypothesis test in S19. |
| S21 | s19:1629, :1756 | One of the four required figures plots ITT and CUPED-ITT with CIs from `readout_experimento.json`. Its alt text cites n and the CI. f maps :1756 to "Excel (S22) y reportes (S23)", and the bridge adds "readout (S20)". |
| S22 (old S20) | roadmap:340 | Write "S17, S18 y S21". |
| S23 (old S21) | s21:1660-1675 | The package adds the readout. `reports.render(spec)` loads the JSON into the Jinja context and calls `validar_readout`. Reasons go to `ReportBundle.errors`, and no experiment page renders. `recomendacion` renders as a recommendation, and `decision` stays None (s21:222, :326). |
| S26 (old S24) | s24:74, :76, :106 | No edit. Listed in decision 12 as the image-contrast sense. |
| S28 (old S26) | s26:64-74 | Orchestration DAG. S35-T4-A states the split. |
| S36 (old S33) | s33:34; :100-110; :159; :208; :274-277; :442-450, :486; :524-530; :595 | As in round 5: recalls of the CV gloss, the dummy, ridge, odds ratios, `.T`, K-fold, MAE and the framing. |
| S37 (old S34) | s34:225-227; :306-310; :376; :408 | As in round 5. |
| S38 (old S35) | s35:48-50 (the marker stays); :64; :99; :210 | As in round 5. |
| S39 (old S36) | s36:313; :408 | As in round 5. |
| S42 (old S39) | s39:2014-2488 | The grader range becomes "S29–S42" (G-8). |
| S53 (old S50) | s50:57 | McNemar recall. |
| S55 (old S52) | s52:49, :60, :320, :1922, :1936, :2012, :2055, :2080, :2107, :2109 | "52" becomes 55 (G-9). |
| copy | qa-tour-content.ts:85 | Rewrite the line without a distance. |
| roadmap | headings and prerequisites of new S21, S23 and S36 | "Prerrequisito: S20"; "S20 y S22"; "S35". |
| capstone | CP-N2-B BRIEF.md "Prerrequisitos"; gate.json | Fix the stale names. Add the S19 criterion and the S20 criterion: the readout passes `validar_readout`, and S23 refuses the experiment page on a non-empty list. This is ask-first. |

## 4. Migration phases and guards

### 4.1 Phase order

1. **Phase 0a.** Draft every PR with CI and a mutation proof. Run from a worktree outside /private/tmp.
2. **Gate A** (approved, O17).
3. **Phase 0b**, merged one PR at a time:
   - **0b-1.** G-11, G-14 and G-15 (dormant), with `renumber-history-guards.test.mjs` and their sentinel steps; G-1; the first-push fix; sentinel :159 reading the count from the HEAD roadmap; the G-14 transition check; the `curriculum/55` triggers.
   - **0b-2.** The deploy gate, CODEOWNERS and the AGENTS.md ask-first line.
   - **0b-3.** Catalog reconciliation, and retargeting test_eligibility_engine.py:44.
   - **0b-4.** The manifest with unbound role keys, and G-3a.
   - **0b-5.** Counts-free positional claims at 2.0.0, and G-3b.
   - **0b-6.** The fixer-state re-key, and G-12.
   - **0b-7.** Glossary and S18: "estimando" at s18:251; s18:1945; the **p-value** definition and its pin. NEVER_APPEARS_OWED goes 5→4. **The normal definition is not touched here.**
   - **0b-8.** The number duplicates. G-2 and G-4 to G-10:
     - G-9 asserts derived consistency, not a literal;
     - admin bands come from `phase`, and phase 0 shows as band 1.
     - SIM-11 lands with its test, on the authority of DECISIONS_2026-09-21.md:1485.
   - Then commit `curriculum55_window.json`, cut `curriculum/55`, and apply its protection rule.
4. **Gate B.**
5. **Phase 1a.** G-16 lands in O18 scope (§4.4). It is green on landing.
6. **Phase 1.** Re-key badges by title through the manifest. **The last commit is the G-16 widening (§4.4).** No claim is removed.
7. **Phase 3: PR-1**, merged with a merge commit. It has three commits:
   - the roadmap diff, with the three new prerequisite lines;
   - the renumber by f, with scaffolds, role binding, G-17a, G-17b and `authoring_pending.json`;
   - the epoch file.
8. **Phase 4: authoring in curricular order.**
   - **S19 commit:** writes and re-homes `distribuci-n-normal`; rewrites the normal definition and adds its `1[.,]96` check; creates `error-estandar` (home S18); adds the `hypothesis_testing` home row. NEVER_APPEARS goes 4→3.
   - **S20 commit:** creates `confusor` (home S18); adds the `experimental_design` home row. No constant changes.
   - **S35 commit:** re-homes 3 terms; adds the `regression` and `causal_inference` home rows (practice ids from S20-T1 to T4 and S35-T4). NEVER_APPEARS goes 3→2. DECLARED_LATE_OWED stays 13.
   - The bridge rows for new S21 and S23 land with the S20 commit.
9. **Gate C, then Phase 5.** Claim text lands. New claimed nodes need home rows, and Phase 4 supplied them.
10. **Phase 6.** Close the window and merge with a merge commit.

### 4.2 Guard inputs that depend on placement

| guard | input |
|---|---|
| G-11(c) | f; 816 pairs rebound; 3 new slugs, each with a 24-grid |
| G-11(e), sentinel :159 | The HEAD roadmap's `### S` heading count |
| G-3a | The §1 spans; evidence_grounded resolves to S55 |
| G-4 | test_late_curriculum_transfer_contract.py:14, :29, :34 become slug sets; test_concept_depth_ratchets.py:238 "S32" becomes S34; admin-analytics.ts:79-88 and admin-analytics.test.ts:33-41 derive bands from `phase`, with phase 0 shown as band 1; test_master_curriculum_specificity.py:12-16 becomes a slug set |
| G-5 | PdfReport.tsx:61-113: 34 labels move by f; 3 entries are added (progress-document.test.ts:174-176); the certificado threshold becomes 55/55 (progress-document.ts:26-29) |
| G-6 | 46 tags move by f; fix ResourcesPage.tsx:1611-1614 first |
| G-8 | catalog.ts:30 'S14–S28'; :33 'S29–S42'; L4 'S43–S55'; the s39 grader |
| G-9 | totalSections = COURSE_SECTIONS.length = roadmap heading count = section_ledger rows; totalHours = Σ estimatedHours. It replaces the literals at v3_invariant_validator.py:21, :146-147 and v3_regression_counts.test.mjs:6, :35, :43-44, :53 |
| G-10 | 9 `gate_section` values; sub-gates; 47 capstone files; 52 banks plus 3; `section_ledger` |
| R-1 | Allowlist :1, :10, :40, :41, :270, :406, :413, :415, :551, :558, :696, :703, :716; :340 is fixed; it also checks the prerequisite of each section after an insertion |
| G-13 | `authoring_pending.json` lists the S19, S20 and S35 slugs |
| G-16 | §4.4 |
| G-17a/b | §4.3 |

### 4.3 Hard blocks

| guard | location | bad state it fails on |
|---|---|---|
| History present | G-11, G-14, G-15 in `scripts/preservation/*.mjs`; proof in `tests/adversarial/renumber-history-guards.test.mjs` | `HISTORY_MISSING` |
| G-1 | scripts/preservation_sentinel.mjs:262-268 | CURRICULUM_COMPARE_SKIPPED reported as OK |
| First push | preservation_sentinel.mjs:68-69, :80 | BASE_UNREADABLE when `before` is all zeros |
| Section count | preservation_sentinel.mjs:159 | The tree's count differs from the roadmap heading count |
| G-11 | `renumber_meaning_guard.mjs` | A dropped renumber sha; an id bound off f; a missing pair; a new slug without a grid; a moved file with no ledger row |
| G-15 | Same script | A carried S-token ≥ 19 arrives unmapped |
| G-14 | `curriculum55_freeze_guard.mjs` | A frozen item changes on main without an override row; the window closes without the renumber sha |
| Deploy | .github/workflows/deploy.yml | The run is not a successful push to main; head_sha is not main's tip; G-13 is not empty |
| G-2 | test_forward_dependencies.py | A binding is renumbered and `index:` is not |
| G-3a / G-3b | tests/adversarial/test_badge_section_identity.py | An unresolved token; a span off its phase; an unbound role; a count or S-range literal in a claim |
| G-4 to G-10 | The tests named in §4.2 | A pass on the wrong section; a stale label, tag, band, copy, pairing or literal |
| G-12 | Fixer state; apply_patches.py:49 | A slug and number mismatch; a hardcoded 52; a missing epoch |
| G-13 | tests/adversarial/test_authoring_window.py | A deploy or merge while scaffolds are pending |
| Glossary definitions | tests/adversarial/glossary-statistics-definitions.test.mjs | From 0b-7: the p-value definition lacks the extremeness or no-effect wording. From the S19 commit: the normal definition lacks `1[.,]96` |
| Glossary ratchet | glossary-first-use-ratchet.test.mjs:44, :46 | A constant changes outside the named commits |
| Practice homes | test_concept_depth_ratchets.py | Fewer than 3 S19 p-value exercises. S20-T1-B lacks ITT, Wald/LATE and per-protocol. A pinned string is missing: S19-T3-B-E2/E3, S20-T3-A-E3 (Katz against bootstrap), S20-T4-B-E1 `iguales=True`, or S20-T4-B-E2 `positividad_falla=True`. A unit 1–25 has no selfCheck or topic-evaluation item |
| **G-16** | §4.4 | §4.4 |
| **G-17a alias rule** | `tests/adversarial/statistics-sense-guard.test.mjs` (terms.ts block) | A term homed at S19, S20 or S35 has a banned alias from §2. The test also writes each new section's avoid-list (every alias whose `firstSectionId` comes after the section) to the Codex brief. The existing ratchet stays the lateness guard. Mutations: an alias "R2" fails and "R²" passes; "LATE" fails; "DiD" fails |
| **G-17b prose rule** | Same file (section block) | It reads only body fields of the three new section files; the root `title` is skipped only when it equals the section's `### SXX — Title` heading in the HEAD roadmap. In S19, "contraste(s)" not followed by "de hipótesis" fails. In S19, S20 and S35, "estimando" not preceded by a determiner (el, un, del, al, este, ese, cada, su, otro, mismo) fails. In S19, "cobertura" without a qualifier (del intervalo, nominal, real, empírica, observada) fails.<br>Mutation pairs:<br>• both ruled titles pass;<br>• a changed S19 title with bare "contraste" fails;<br>• a theory paragraph with bare "contraste" fails, and the same paragraph with "contraste de hipótesis" passes;<br>• "seguimos estimando" fails, and "el estimando" passes;<br>• shortTitle "Inferencia y contraste" fails |
| R-1 | render_roadmap.py | A PLACEHOLDER; an unallowlisted straddling range; stale totals; a prerequisite that skips an insertion |

### 4.4 G-16, the teaching-debt guard

```
Phase 1a (O18 scope)        Phase 1, last commit          Phase 4                after Phase 6
teaching_debt: 3 rows  ───▶ + rows for nodes the     ───▶ home rows for     ───▶ rows only shrink;
homes: empty                 re-key finds homeless        hypothesis_testing,    O18 retires when
baseline: 46 nodes          homes: every homed node       experimental_design,   its 3 rows reach 0
refused: 12 direct,         baseline deleted;             regression,
  15 by prerequisite         full scope switches on       causal_inference
```

**Files** (all committed in Phase 1a):
- **`src/lib/eligibility/teaching_debt.json`.** Each row has `id`, `kind`, `match`, `fields`, `source`, `opened`, `scheduled: "after Phase 6"`, `retire_when` and `home: null`. Phase 1a has three rows, all with `source: "O18"`:
  - TD-1 is `node: deep_learning`.
  - TD-2 is the claim pattern `(?i)fine[- ]?tun`.
  - TD-3 is the claim pattern `(?i)graph[- ]?rag|graphrag`.
  - The patterns read only `name`, `public_claim` and `newbie_friendly_description`. They never read `non_claims`.
- **`src/lib/eligibility/claimed_nodes_baseline.json`.**
  - It lists the 46 nodes claimed in badge_catalog.json today.
  - It also lists the (badge, debt) pairs: 12 deep_learning pairs, plus llmops_production_delivery's `public_claim` and `newbie_friendly_description` for TD-2 and TD-3.
- **`src/lib/eligibility/teaching_homes.json`.**
  - It starts empty.
  - Each row has `node`, `section_slug`, `title`, `named_as`, `basis` (title or outcome), `practice_ids`, `assessment_ids` and `accepted_by` (rule or owner).

**Refusal sites:**
- engine.ts gets a `teaching_debt` gate after Gate 2 (engine.ts:156-171). It covers every badge class.
- src/app/api/credentials/issue/route.ts returns 403 `TEACHING_DEBT_OPEN` before line 128, for verified credentials.
- credential-gates.ts exports `openTeachingDebts(spec)`.

**Tests:**
- `tests/adversarial/test_teaching_debt_guard.py` covers the data files.
- `tests/adversarial/teaching-debt-refusal.test.ts` covers the engine and the route.
- The row count is a two-sided ratchet constant, like glossary-first-use-ratchet.test.mjs:44.

**Phase 1a assertions:**
1. Every badge whose nodes or claim fields match an open row is refused by the engine. Today that is 12 badges.
2. Every verified credential with such a match gets 403 `TEACHING_DEBT_OPEN`.
3. No baseline (badge, debt) pair disappears, because a claim is never dropped.
4. A node not in the baseline is claimed only if it has a home row.
5. A home row resolves:
   - `practice_ids` exist as We Do or You Do ids;
   - `assessment_ids` exist as selfCheck, topic-evaluation or exam items;
   - `named_as` appears in the section's title or in one of its learning outcomes, unless `accepted_by` is owner.
6. A debt row leaves only when a home row for it resolves, and the constant drops with it.

**Mutations:**
- M-a: delete TD-1 with no home row → red.
- M-b: remove the engine gate, so applied_deep_learning_practice becomes eligible → red. Remove the route check, so integrated_python_ai_capstone_independent returns 403 without the code → red.
- M-c: delete "fine-tuning" from llmops_production_delivery's `public_claim` → red.
- M-d: add `hypothesis_testing` to capstone_independent with no home row → red.
- M-e: give a home row a non-existent practice id → red.
- M-f: give a home row a `named_as` that is in neither the title nor the outcomes → red.
- M-g: add a debt row outside the widening commit → red.

**Widening, the last commit of Phase 1:**
- The input is the manifest's bindings by title, plus each section's title, learning outcomes and activity ids. All of these exist once the re-key lands.
- The commit writes a home row for every baseline node that meets the rule.
- It writes a debt row with `source: "re-key"` for every baseline node that does not.
- It deletes the baseline file, sets the ratchet constant once, and switches G-16 to full scope: every claimed node needs a home row or an open debt row.
- Owner involvement:
  - The new debt rows block issuance at once. Gate B decision 17 authorises this; O18's scope covers only its three nodes (corrected after the closure check). No claim is removed.
  - The diff goes to Gate C.
  - The owner may accept a home whose title and outcomes do not name the skill.
  - The owner never waives practice or assessment, which O18's retire-when requires.
- **Scale screen** (a keyword screen, not the rule; Phase 1 computes the real table):
  - Titles alone leave 13 candidate nodes homeless.
  - Titles plus outcomes leave 7: ai_code_review_literacy, code_review_literacy, deep_learning, git_workflow, kubernetes, mentoring and selector_design.
  - Following prerequisites, either set blocks **all 31 badges**.
  - The effect today is nil. No learner holds a badge, and the route already returns 403 for every credential (RT-G1).

## 5. Remaining owner decisions

### Gate B: answered before Phase 3

**12. Titles. Recommendation: keep all three ruled titles.**
- G-17b enforces "contraste de hipótesis" in S19's body prose, and the title stays exempt.
- What follows is information, not a request to change a ruled title:
  - Colour "contraste" appears in new S21 (old S19: 13 case-sensitive hits, 14 case-insensitive), two sections after S19 in the same arc.
  - Image contrast appears in new S26 (old S24: 5 hits).
  - Accessibility contrast appears in new S54 (old S51: 34 and 35 hits).
  - CP-N2-B's gate.json:8, YOUDO.md:5 and demo.py:27 use colour contrast.
  - qa-tour-content.ts:104 uses accessibility contrast.
- Option: re-ask the S19 title as "… y contraste de hipótesis". This is the owner's call only, and it would enter the owner's roadmap diff.
- "estimandos" in S20's title does not trigger the `estimando` hover.

**8. Capstones (ask-first).**
- **8a. Recommendation: accept the six-section CP-N2-B arc with no sub-gate.**
  - The gate moves from S21 to S23.
  - gate.json gains the S19 criterion (n, CI, effect size; Holm).
  - It also gains the S20 criterion: the readout passes `validar_readout`, and S23 refuses the experiment page on a non-empty list.
  - The brief's stale prerequisites are fixed.
  - Alternative: a CP-N2-B.1 sub-gate at S20.
- **8b.** CP-N3-B gets the S35 increment and `review_minutes`.
- **8c. Recommendation: yes. CP-N3-C gets a pilot-plan deliverable for the s34:408 threshold.** The marker stays.

**17. Teaching-debt guard definition. Recommendation: adopt §4.4.**
- **Rule.** A home is a manifest-bound section where:
  - the title or a learning outcome names the skill;
  - at least one We Do or You Do practises it;
  - at least one selfCheck, topic-evaluation or exam item assesses it.
- **Phase 1a.** The guard has three O18 rows. It refuses 12 badges directly, and 15 cannot be issued once prerequisites are followed:
  - progress_phase1/2/3_walked;
  - responsible_machine_learning_evaluation;
  - applied_deep_learning_practice;
  - llmops_production_delivery;
  - container_platform_engineering_practice;
  - integrated_data_science_practice;
  - integrated_ml_engineering_practice;
  - the three level capstones;
  - by prerequisite: ai_governance_code_review_practice, evidence_grounded_ai_systems_capstone and progress_journey_completed.
- **Widening.** The Phase 1 widening may block all 31 badges until debts are paid or homes are accepted.
- **Alternative.** Exempt the 5 `local_achievement` badges, whose non_claims already say they evidence no competency (corrected from 4 after the closure check: progress_phase0_walked is the fifth).

**7. Credentials (by role key).**
- New badge `applied_statistical_inference` (independent_practitioner), S18–S20.
- capstone_independent adds hypothesis_testing and experimental_design.
- capstone_advanced_applied adds regression and causal_inference.
- data_analyst and data_science each add the two N2 nodes.
- N2 claims say "aplica".
- Each new node needs its Phase 4 home row.

**5. Boundary. Recommendation: approve the §2 list.**

**18. Model-based IPW. Recommendation: a worked example at s35:99, plus a topic-evaluation item, practised through 8c.**

**19. Logistic odds ratios. Recommendation: amend one S36-T2-B exercise (s33:208) to print `exp(coef)`, with a ledger row.**

**20. G-17. Recommendation: approve the split into G-17a (aliases) and G-17b (body prose, title exempt).** It lives under `tests/`.

**4, 9, 10, 11, 13, 15. Unchanged in substance:**
- **4.** Defer 2SLS and do-calculus.
- **9.** V3 is authoritative.
- **10.** Homonyms. Add these:
  - "LATE" (old S46);
  - "cumplimiento" and "A/B" (both first used in S01);
  - "DiD" (whole-word `did` only in old S22);
  - "R2" (`r2` from old S04);
  - the gerund "estimando";
  - "cobertura" in S18;
  - `resample` at s34:225;
  - image "contraste" in S26.
- **11.** One learner notice. The certificado threshold becomes 55/55. Nothing is awarded retroactively.
- **13.** Amend AGENTS.md:131 and course_requirements.json:14-15, :35.
- **15.** Parallel work. SIM-11 is no longer a Gate B item.

### Gate C: answered before any claim text merges

The owner approves Codex's text, shown as a diff, for:
- `applied_statistical_inference`;
- the node additions in decision 7;
- the progress_phase1/2_walked node additions;
- the L2 and L3 `exitCapability` lines (catalog.ts:31, :34);
- the learner notice;
- **the G-16 widening diff:** each new debt row, and each home the owner accepts on a basis other than title or outcome.

The Gate A diff already covers the counts-free positional text.

### How this was produced

- I read everything in /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps at HEAD 3ec808dd. `git ls-files --deleted` returned 0.
- I edited, staged and wrote nothing, and I ran no gate or audit script.
- I measured counts with /usr/bin/python3 3.9.6, not `.venv-content`. I computed no pinned lesson output.
- **Measured in this round:**
  - figure zones 41/28/48;
  - "contraste" 13/14 in old S19, 5 in old S24 and 34/35 in old S51;
  - "cobertura" 32 times in S18;
  - `s_pooled=2` at s18:1291;
  - the 46 claimed nodes;
  - 12 badges blocked directly and 15 by prerequisite;
  - the screens: 13 and 7 nodes, which both block 31 of 31 badges;
  - the alias collisions R2, DiD, LATE, DAG and MAE;
  - 0 hits for ATE, ATT, ITT, SRM, IPW, VIF, CUPED, CACE, Holm, BH, FDR, ICC, MDE and OLS;
  - storage keyed by slug.

Key files:
- /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps/.fixer/g0r5/recast_design.md
- /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps/src/lib/eligibility/badge_catalog.json
- /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps/src/lib/eligibility/engine.ts
- /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps/src/app/api/credentials/issue/route.ts
- /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps/industry_alignment/_phase3_build/build_curriculum_graph.py
- /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps/src/lib/course/sections/s21-fastapi.ts
- /Users/pabloillescas/Documents/GitHub/pyarcana/.claude/worktrees/readiness-gaps/src/lib/course/sections/s19-databases-orm.ts