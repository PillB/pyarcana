# Anti-challenge, round 4: verdicts on the round-3 blocking issues and the revised design

**Bottom line**
- I keep the plan: three sections, with inference at S19 (N2), regression at S34 (head of the N3 ML block), and design and causality at S37 (placement G). Both reviewers now agree with this placement.
- I concede all four blocking issues. Each one was verified in the tree before I changed the design.
- **The VP's duality issue is right.** I counted 34 disagreeing tables, the same number the VP found. A better interval reduces the count but never removes it, so the qualifier has to stay in the lesson.
- **The VP's CV/MAE issue is right.** Moving the glossary term in the same commit keeps `DECLARED_LATE_OWED` at 13.
- **The red team's history issue is right.** G-11, G-14 and a new G-15 move to the preservation-sentinel job, which uses `fetch-depth: 0`. They fail when history is missing; they never skip.
- **The red team's ask-first issue is right.** §5 now has three gates: Gate A comes before any Phase 0 merge, Gate B before Phase 3, and Gate C before any claim text merges.
- **Two new findings came out of the checks.**
  - The sentinel goes red on the first push of a new branch.
  - SIM-11's `environment` switch was decided but never built.
- **One of my own round-3 claims is withdrawn.** I measured bootstrap-t: it reaches 0.933 at n = 5 and 0.943 at n = 10. "Nothing simple reaches 95% at small n with skew" was false.

## 0. Blocking issues: verdicts

| issue id | from | CONCEDE/DEFEND | change made or evidence |
|---|---|---|---|
| R3-B1-duality-vs-pooled-unpooled | VP | CONCEDE | **Verified.** I enumerated every two-arm table at n = 20, 30 and 50 per arm (3,997 tables, math only). The unpooled Wald CI disagrees with the pooled test in 34 of them (14, 8 and 12), the same count the VP found.<br>For 2/20 vs 7/20: the pooled test gives z 1.893 and p 0.058. The Wald ratio is 1.984 and the Wald CI is [0.003, 0.497].<br>**A better interval does not remove the problem.** Newcombe's Wilson-based hybrid interval (Newcombe 1998) disagrees with the test in 24 tables, and Agresti–Caffo in 32. Any CI that does not invert the test's own statistic needs the qualifier.<br>**Changes:**<br>(1) S19-T2-B states that the duality holds when the CI inverts the same test statistic. The worked case is T1-B's one-sample t interval with the one-sample t test.<br>(2) S19-T3-A checks that Welch's test and the Welch interval agree.<br>(3) S19-T3-B-E2 works through 2/20 vs 7/20. It explains that the pooled test uses the variance under H0 and the Wald CI uses the variance at the estimates. It computes Newcombe from `binomtest(k, n).proportion_ci(method='wilson')` for each arm; I checked that the call exists in scipy 1.13.1. The Newcombe interval is [−0.013, 0.479], which includes 0, so here it agrees with the test.<br>(4) **The readout rule:** the pooled test decides the pre-declared comparison, Newcombe reports the effect size, and a disagreement is labelled "evidencia en el límite".<br>(5) A concept-matrix row pins expected-output strings in S19-T3-B-E2: `prueba_agrupada_rechaza=False`, `ic_wald_excluye_0=True`, `ic_newcombe_excluye_0=False`. G-13 fails if those strings disappear.<br>This also answers the red team's Wilson note (Brown, Cai and DasGupta 2001). |
| R3-B2-kfold-mae-first-teaching-moves-but-old-S33-definitions-stay | VP | CONCEDE | **Verified.**<br>• terms.ts:681-687 homes `cross-validation` at `advanced-models`.<br>• Today its aliases first match in S33, which is its home, so the term is not late. Under G, S34 would use it first and `DECLARED_LATE_OWED` would become 14.<br>• s33:34 glosses CV as a new idea, and s33:442-450 (unscoped) defines CV and the fold from scratch. s33:530 glosses MAE.<br>• MAE, RMSE and R² occur only in S33 (6 hits, my count), and none of them has a glossary term.<br>**Changes:**<br>• Old-S33 (new S35) bridges add three rows to `renumber_edit_ledger.json`:<br>  – s33:34 is rewritten to the entity-grouping delta.<br>  – s33:442-450 becomes a K-fold recall from S34-T3-B; entity disjointness is the new idea.<br>  – s33:524-530 becomes an MAE recall from S34-T1-A; the seasonal baseline and the rolling origin are the new idea.<br>• `cross-validation` moves to S34's slug in **the S34 authoring commit that first uses it**, so `DECLARED_LATE_OWED` stays 13 and no constant changes.<br>• New terms `mae`, `rmse` and `r2` are homed at S34.<br>• The concept matrix names MAE, RMSE, R², K-fold and GridSearchCV as S34 homes, with recall rows at new S35.<br>• The `S33-group-folds` figure stays as a recall visual. |
| R3-B1-guards-without-history | red | CONCEDE | **Verified.** At tests.yml:18-20, only the sentinel job sets `fetch-depth: 0`. adversarial-unit (:95-120) checks out plainly at :99. My round-3 justification cited the wrong job.<br>**Change.** G-11, G-14 and the new G-15 become Node scripts in `scripts/preservation/`. That directory does not exist yet, but CODEOWNERS already lists it. Each script runs as a step in the **preservation-sentinel job**.<br>They are neither `test_*.py` nor `*.test.mjs` files, so neither adversarial runner picks them up, and the depth-1 job never runs them.<br>Each guard fails with `HISTORY_MISSING` in three cases: `git rev-parse --is-shallow-repository` prints `true`; the recorded sha or its parent is unreadable; or the branch-point object is unreadable. **No guard has a skip path.**<br>A guard is dormant only while its state file is absent (`renumber_epoch.json` or `curriculum55_window.json`). It then prints `DORMANT`.<br>**Mutation proof** lives in `tests/adversarial/renumber-history-guards.test.mjs`, which builds temporary repositories:<br>• `git clone --depth 1 file://…` (file:// is required, because a plain path ignores `--depth`) must exit non-zero with `HISTORY_MISSING`;<br>• a full clone must pass;<br>• squash, wrong-slug and unledgered cases must fail.<br>The test creates its own history, so it stays valid in the depth-1 job.<br>**Rejected alternative:** `fetch-depth: 0` on adversarial-unit. It is a one-line change, but it slows the most-run job, and these guards belong with the sentinel.<br>The same PR fixes the sentinel's red first push (row 183). |
| R3-B2-ask-first-after-the-act | red | CONCEDE | **Verified.** AGENTS.md's ask-first list (:92-96) names credential claims and protected paths. The protected paths (:139-143) include `tests/` and `.github/workflows/`, and CODEOWNERS covers both.<br>**Change.** §5 is split into three gates:<br>• **Gate A, before any Phase 0 merge:** decisions 2, 3, 6 and 14, plus new decision 16. Decision 16 reconciles the industry catalog copy and the `progress_phase3_walked` contract. It is presented as a credential-claim change with VP-1's field diff: credential_class 31, non_claims 31, public_claim 26, name 5, version 5, verification_mode 5, required_* 1.<br>• **Gate B, before Phase 3:** decisions 1, 4, 5, 7-13 and 15, plus new decision 17 (untaught claims).<br>• **Gate C, before any claim text merges** (Phase 1 and Phase 5): the Codex-written text for each changed badge, shown as a diff.<br>Phase 0 PRs may be drafted and run in CI before Gate A, so that the owner sees real diffs. None of them merges before Gate A.<br>The manifest lands with **role keys**, not placement slugs, so Phase 0 assumes nothing that Gate B decides. |

**Other changes this round, taken from the non-blocking notes and my own checks:**
- **The S19-T1-B coverage simulation is redone and measured.** It uses lognormal(3.0, 0.4), 1,500 repetitions and 999 resamples; the Monte Carlo SE is 0.0056. Coverage, in the order t / percentile / BCa / bootstrap-t:

  | n | t | percentile | BCa | bootstrap-t |
  |---|---|---|---|---|
  | 5 | 0.923 | 0.796 | 0.799 | 0.933 |
  | 10 | 0.927 | 0.880 | 0.882 | 0.943 |

  BCa, which is scipy's default, behaves like the percentile interval at small n. Bootstrap-t is the remedy for the mean under skew (Hesterberg 2015).
- **scipy enters at S19-T1-B** through `t.ppf`. T1-B needs t critical values before T3-A.
- **S34 is reorganised:**
  - T2-A teaches `X.T` and `np.linalg.solve`; `np.linalg` has 0 hits in the course today.
  - The ANOVA F-test moves into T2-A.
  - HC standard errors move to T2-B.
  - DiD collapses each unit to one pre/post difference.
- **S37 changes:**
  - T1-B-E1 also computes the true complier effect.
  - T2-B calibrates its stopping boundaries by simulation.
  - T3-A's delta method becomes a demo plus E3.
  - The CP-N3-C pilot keeps human review in both arms. It also uses a random audit below the threshold to get around selective labels.
- **Guard changes:**
  - The deploy gate checks out `workflow_run.head_sha`.
  - G-11's predicate is restated in (slug, suffix) terms, and G-11 gets a retire rule.
  - G-14's frozen set is defined and narrowed.
  - The glossary pin accepts S18's wording.
  - Each ratchet constant change is tied to a named commit.
- **New findings from my own checks:**
  - The sentinel fails `BASE_UNREADABLE` when `before` is all zeros (row 183).
  - SIM-11 is not implemented (row 178).
  - The data_scientist ladder places experimental_design at the independent level (row 181).

## 1. Finding-by-finding verdicts

Rows marked "(r4)" changed in this round. Rows 141 and up are new.

| # | source | finding | verdict | evidence | design change it forces |
|---|---|---|---|---|---|
| 1 | RT A1 = VP §0 | Badge tokens resolve by `index:` | NARROW | credential-gates.ts:44-48; RT-A1; RT-G1 (always 403) | Two-class remap through the manifest; G-3a |
| 2 | RT A1 | "Earns SQL without the SQL section" | DEFEND (premise) | LEAD-F9 | Phase 1 re-keys by title |
| 3 | RT A12 + VP-1 | The copies are independent, and the hash is a literal string | CONCEDE | RT-A12; 31 badge_requirements/*.md files; generator (row 136) | The manifest is the single source; G-3a checks all 4 copies |
| 4 (r4) | VP | The industry copy feeds the only engine test | CONCEDE | VP-1; test_eligibility_engine.py:44 | Retarget to src; decision 16 (Gate A) |
| 5 | VP-0 | The relabel chain was computed on slug-keyed tokens | CONCEDE | VP-0 | Re-derive it in Phase 1 |
| 6 | RT A2 | The transfer-contract test detaches | NARROW | RT-A2 | G-4 |
| 7 | Mine | test_concept_depth_ratchets.py:238 pins S32 | CONCEDE | Under G, S32 becomes old S31 | G-4 |
| 8 | RT A3 | PdfReport hardcodes "NN. Label" | NARROW | RT-A3 | G-5; frozen on `main` (G-14) |
| 9 | RT A4 | Resource tags re-point unseen | CONCEDE | RT-A4 | G-6; fix the 3 mismatched tags |
| 10 | RT A5 | Figure ids are unguarded | DEFEND | RT-A5 (figure-data-schema.test.mjs:103) | Rename the components (row 140) |
| 11 | RT A6 | 711 prose pointers | NARROW | 665 tokens measured, 355 of them ≥S19 | One mapping function plus the census |
| 12 | RT A6 | qa-tour-content.ts:85 states a distance in words | CONCEDE | "veintinueve secciones después" | Codex rewrites it |
| 13 (r4) | RT A7 | Unchanged ratchets prove nothing | CONCEDE | RT-B9 | G-11 runs in the sentinel job with full history |
| 14 | RT A8 | Three roadmaps; v3_regression is not in CI | CONCEDE | RT-A8 | G-7; decision 9 |
| 15 | RT A9 | section_ledger pairing | NARROW | The validator counts rows only | G-10 |
| 16 | RT A10 | "13 per level" is load-bearing | CONCEDE | course_requirements.json:14-15 | Derive the counts from `phase` |
| 17 | RT A11 | admin-analytics hardcodes cutoffs | CONCEDE | RT-A11 | Derive them from `phase`; G-4 |
| 18 | RT A13 | Walkthrough evidence is number-keyed | NARROW | Frozen evidence | Epoch sidecar |
| 19 | RT A14 | Concept-map .md files | CONCEDE | Generated by concept_map.py | Regenerate; never merge |
| 20 | RT B1 | EXERCISE_IDS_REMOVED | NARROW | RT-B1 | G-11 |
| 21 | RT B2 | Slug rename plus renumber in one commit | NARROW | RT-B2 | No slug is renamed |
| 22 | RT B3 | ACTIVE_SECTION_COUNT_NOT_52 | CONCEDE | preservation_sentinel.mjs:159 | G-11 takes the count from the roadmap |
| 23 | RT B4–B8, B10 | Loud contract tests | CONCEDE | SURF-3 | G-4 |
| 24 (r4) | RT B9 | Glossary ratchet by position | NARROW | RT-B9 | Constants change only in named commits (row 168) |
| 25 | RT B11 | The validator globs 57 files | CONCEDE | contract_surface §5b | Count imported sections only |
| 26 | RT C1/F1 | S19 is "70–80% S18" | NARROW | RT-C1; NOT-IN-S18 | S19 teaches the delta only |
| 27 | RT C1 | Rescoping S18-T2-B-E2 | CONCEDE (retracted) | s18:1267-1300 | Keep E2 |
| 28 | RT C1b = VP | Insertion splits CP-N2-B | NARROW | catalog.ts:75 | 5-section arc |
| 29 | RT C1c | Insert at S17, or split S18 | DEFEND | Graph; SPLIT-1; SIZE-1 | None |
| 30 | RT C2 | S18 already names the estimand | NARROW | RT-C2 | Codex adds "estimando" at s18:251 (Gate A) |
| 31 | RT C3 = VP | The drafted S35 duplicates S33-T2 | CONCEDE | RT-C3 | S34 teaches the delta only |
| 32 | RT C3b | Regression first breaks baseline-first | NARROW | S34-T1-A fits DummyRegressor first | S34 introduces the baseline discipline |
| 33 | RT C3c | Nothing needs linear regression | NARROW | Graph edge `regression -> classical_ml` | G |
| 34 | RT C3d | Splits CP-N3-B | CONCEDE (stated cost) | catalog.ts:87 | 5-section arc |
| 35 | VP §1d | Model selection without metrics | NARROW | R² has 0 hits outside S33 | S34-T1-A homes the metrics (row 142) |
| 36 | RT D2 | Two level taxonomies | DEFEND | plan.md:23-27 | None |
| 37 | RT D3 | Ranges widen silently | NARROW | roadmap:340 | R-1 |
| 38 | Mine + red | The CP-N3-C start marker | CONCEDE | s35:48-50 | Moving it is ask-first (decision 8) |
| 39 | RT D4 | The partition has no semantic check | CONCEDE | CAP-1 | Capstone briefs |
| 40 | RT D5 | "S27-S39" in the grader | CONCEDE | s39:2014-2488 | G-8 |
| 41 | RT D6 | The 29 h exemption is keyed on 52 | CONCEDE | contract_surface §5b | Key it on the slug |
| 42 | RT D7 | i18n and pricing copy say 52 | CONCEDE | contract_surface §5b | G-9; Codex writes the copy |
| 43 | RT E | The renumber cannot be staged across merges | CONCEDE | RT-E2 | Stage inside `curriculum/55` |
| 44 | RT E | COMPARE_SKIPPED exits OK | CONCEDE | RT-E1 | G-1 |
| 45 | RT E | Rename detection | DEFEND | ≤15.3% of lines change | `git mv`; also why G-14 can be narrowed (row 166) |
| 46 (r4) | RT E | Protected paths are touched | CONCEDE | AGENTS.md:92-96, 139-143 | Gate A precedes every Phase 0 merge |
| 47 | RT F2 | "~20× cost" | NARROW | 8 classes fail silently | Guards land first |
| 48 | RT F3 | Preconditions | CONCEDE (b, c); NARROW (a) | RT-B1 | Shift map plus (slug, suffix) pairs |
| 49 | RT F3(2) | Append S53–S55 | DEFEND | graph :2937-2957 | Rejected |
| 50 | VP §1a | S18:247 and :353 have no exercises | CONCEDE | RT-C1 | S19-T2-A-E3 and S19-T2-B |
| 51 | VP §1b | Inference would be text-only | NARROW | VP-3 | Distribution archetype |
| 52 | VP §2a | Bootstrap, then permutation, then named tests | CONCEDE | graph :1505 | S19 T2–T3 |
| 53 | VP §2b | The normal and sample size are missing | CONCEDE | NOT-IN-S18 | S19-T1-B, S19-T4-A |
| 54 | VP §2c | The spine is the plan | CONCEDE | graph :1564 | S37-T1-A, S37-T2-A |
| 55 | VP §2d | Calibration in S34; z-score in S32 | CONCEDE | VP-2 | Reuse both |
| 56 | VP §2e | No observational causality in N2 | CONCEDE | graph :1595 | S34-T4, S37 |
| 57 | VP §3a | Inference at N2 | CONCEDE | graph :1505 | S19 |
| 58 | VP §3b | Design at N3 | CONCEDE | catalog.ts:31, :34 | S37 (re-ask; row 181) |
| 59 | VP §3c | Deepen S33 instead | NARROW | SIZE-1 | New section |
| 60 | VP §3d | No claim gets more honest | NARROW | metric_design is claimed by 5 badges | S37-T2-A evidences it |
| 61 | VP §3e | Type safety first | NARROW | No dependency | Run in parallel |
| 62 | VP §4a-b | Gap matrix | CONCEDE | READINESS_AUDIT:182-195 | §2 count |
| 63 | VP §5.6 | statsmodels is not pinned | CONCEDE | requirements-content.txt:17-20 | Compute by hand; McNemar via `binomtest` |
| 64 | VP | AGENTS.md:131-132 says 52 | CONCEDE | — | Owner amends it (decision 13) |
| 65 | Mine | `index:` is never checked | CONCEDE | test_forward_dependencies.py | G-2 |
| 66 | Mine | Withheld scaffolds block the certificado | CONCEDE | progress-document.ts:28 | Superseded by option (c) |
| 67 | Mine | `ExerciseAttempt.exerciseId` | NARROW (latent) | No client posts to it | Record only |
| 68 | B1 + RT1-B3 | Positional badges | CONCEDE | 9 badges | Phase-span rule in the manifest |
| 69 | B2 | Probability is untaught | CONCEDE | 0 hits for Bayes or binomial | S19-T1-A |
| 70 (r4) | B3 | Causal scope | CONCEDE | graph :1595 | S34-T4 (two-period DiD); S37-T1-B; S37-T4-B; deferrals |
| 71 | B4 + red | Peeking and power duplicates | CONCEDE | s18:363-396 is one pinned block | S18 keeps the code; S37-T2-B recalls it |
| 72 | RT1-B1 | Scaffolds | CONCEDE | deploy.yml:3-6 | Option (c); G-13; deploy gate |
| 73 | RT1-B2 | Fixer state is number-keyed | CONCEDE | registry.json | G-12; epoch; rendering |
| 74 | VP | Regression trade-off absorbed | CONCEDE | Graph edge | G |
| 75 | VP + red | CUPED before OLS | CONCEDE | — | G order |
| 76 | VP + red | Credential integration | CONCEDE | 0 of 31 badges list the four nodes | Role keys; activities; blueprint |
| 77 (r4) | VP | Level fit for data scientists | CONCEDE | Row 181 | Re-ask shows both ladders |
| 78 | VP | Retrieval spacing | NARROW | Gaps of 15 and 3 sections | S37 recall block; relative-lift hook (row 156) |
| 79 (r4) | VP + red | First scipy and sklearn code | CONCEDE | s18:2067; 0 `from sklearn` | scipy enters at S19-T1-B (`t.ppf`); sklearn at S34-T1-A |
| 80 | VP | Moving Q10 trips a fixture | CONCEDE | content-campaign-progress-fixture.test.ts:104 | Q10 stays |
| 81 | VP | Exam banks are number-keyed | CONCEDE | 52 bank files | `git mv` plus remap; G-10 |
| 82 | VP | Boundary undeclared | CONCEDE | — | §2 |
| 83 | VP | Distribution archetype | CONCEDE | VP-3 | S19-T1-B, S19-T3-A (Q-Q), S34-T2-B |
| 84 | VP | Stopping rule | CONCEDE | — | S37-T2-B |
| 85 | red | A 52/52 learner drops to a constancia | CONCEDE | progressDocumentKind | Decision 11 |
| 86 | red | Cohen's d orphaned | CONCEDE | Row 27 | Pin |
| 87 | red | The design duplicates itself | CONCEDE | Row 71 | One home each |
| 88 | red | Adjustment before OLS | CONCEDE | Row 75 | G |
| 89 (r4) | red + VP | Homonyms | CONCEDE | "regresión N" ×16; DAG at S26:64-74; row 151 | Titles plus sense splits (decision 10) |
| 90 | red | Inactive files hold statistics material | CONCEDE | s09-sklearn.ts, s11 | Brief sources only |
| 91 | red | out_F is not the diff | NARROW | — | R-1 |
| 92 | red | Ratchet non-proof | CONCEDE | — | G-11 |
| 93 | red | G-6 fails today; G-8 covers bands only | CONCEDE / NARROW | RT-A4 | Fix the 3 tags; census |
| 94 | red | Activities and copy scope | CONCEDE | engine.ts:198 | G-3a maps activities |
| 95 (r4) | red + VP | Glossary homes | CONCEDE | terms.ts:681-687, 828-842, 962-970 | §3 glossary list; matrix (row 152) |
| 96 | red | Which roadmap is authoritative | CONCEDE | course_requirements.json:7, :35 | Decision 9 |
| 97 (r4) | red | Phase 1 collides and is outside CI | CONCEDE | RT-CI | It runs on `main` through the manifest; G-14 exempts the regenerated tokens |
| 98 | red | Name a credential for each new skill | CONCEDE | — | Decision 7 |
| 99 (r4) | red | Evidence supports E | NARROW | Each option inverts one edge | G and G' side by side, with the DiD-SE ledger |
| 100 | Mine | apply_patches.py:49 hardcodes 52 | CONCEDE | — | G-12 |
| 101 | Mine | The phase-3 claim is already false | CONCEDE | badge_catalog.json | Counts-free claims (decision 2) |
| 102 (r4) | Mine + red | Deploy does not wait for tests | CONCEDE | deploy.yml:3-6, :21, :38 | `workflow_run` with head_sha asserts (row 163) |
| 103 | Mine | Ticks are keyed by slug | DEFEND | progress-store.ts:61-74 | No tick migration |
| 104 | Mine | No badge holder exists | — | 0 writers | No retroactivity |
| 105 | VP R2-B1 | Wald identifies LATE | CONCEDE | — | S37-T1-B |
| 106 (r4) | VP R2-B2 | t on skewed small n | CONCEDE; the round-3 defence is now superseded | Row 179 measurement | Remedies taught: t and bootstrap-t |
| 107 (r4) | VP R2-B3 | The glossary p-value definition is wrong | CONCEDE | terms.ts:840 vs s18:356 | Rewritten in Phase 0 in S18's words; pin (row 167) |
| 108 (r4) | red R2-B1 | No CI on the branch; G-11 tied to the PR | CONCEDE | tests.yml:3-7 | CI on `curriculum/55`; G-11 in the sentinel job |
| 109 (r4) | red R2-B2 | G-3 has no baseline | CONCEDE | Catalog tokens | Manifest with role keys (row 175); M1–M3 |
| 110 | VP + red | G inverts `experimental_design -> causal_inference` | CONCEDE | graph :2952-2953 | G vs G' re-ask |
| 111 | VP | Overloaded subtopics | CONCEDE | — | Rebalanced (rows 147, 148, 154) |
| 112 | VP | "Fully written" is undefined | CONCEDE | invariant_vector | G-13 exit criteria |
| 113 (r4) | VP | Credential edits by slug | CONCEDE | — | Role keys; data_analyst design re-ask (row 158) |
| 114 | VP | Which mean R² uses | CONCEDE | r2_score uses the y_true mean | Brief states that the dummy scores ≤ 0 on test |
| 115 | VP | "dummy" and "DAG" homonyms | CONCEDE | terms.ts:765; S26:64-74 | "Variables indicadoras (one-hot)"; DAG split |
| 116 (r4) | VP | scipy pitfalls | CONCEDE | Yates default; SRM is goodness of fit | correction=False; z² = χ²; qualified duality (row 141); `chisquare` |
| 117 (r4) | VP | Paired tests, novelty, delta method | CONCEDE | Old S50: 0 CI/bootstrap hits | S19-T3-A; S37-T2-A; delta method as demo plus E3 (row 154) |
| 118 (r4) | VP | Missed bridges | CONCEDE | Old S35, S36; s33:595 | §3 bridges, now including s33:34, :442-450, :524-530 |
| 119 | VP | S19-T2-A-E3 overlaps S18 | CONCEDE | s18:1891, 2040 | Briefed as a delta |
| 120 | VP | Nested CV load | CONCEDE | — | Demo only |
| 121 (r4) | VP | DiD pre-trends; IPW assumptions | CONCEDE | — | Stated; DiD SE fixed (row 146) |
| 122 | VP | N2 exit text | CONCEDE | Graph levels | Claims inference, not experimental rigour |
| 123 | VP | Re-ask only the third placement | CONCEDE | — | Decision 1 |
| 124 | red | The graph argument is half-true | CONCEDE | Row 110 | Row 110 |
| 125 (r4) | red | Generated number-keyed artifacts | CONCEDE | 1,380 files ≥S19 | Regenerated files are exempt from G-14 and G-15; frozen directories get an epoch sidecar |
| 126 | red | Registry free text is not remapped | CONCEDE | 311 texts | `numbering_epoch: 52`; rendered through the mapping |
| 127 | red | Unguarded number duplicates | CONCEDE | catalog.ts:41-42, :108, :122; CapstonesPage.tsx:316 | Derived in Phase 0; G-4/G-10 |
| 128 | red | G-3 claim scope | CONCEDE | newbie_friendly_description | G-3b scans both fields |
| 129 | red | Unassigned learner-facing Spanish | CONCEDE | — | Codex authors all of it |
| 130 (r4) | red | Deploys from any ref | CONCEDE | deploy.yml:6 `workflow_dispatch` | Row 163 |
| 131 | red | Moving the CP-N3-C marker is ask-first | CONCEDE | AGENTS.md:93 | Decision 8 |
| 132 | red | Branch red between phases | CONCEDE | test_active_v3_curriculum_contract.py:44-45 | The roadmap commit lives only in PR-1 |
| 133 | red | Phase 1 pickup rule | CONCEDE | LEAD-F9 | Tested; untaught-claims case is row 173 |
| 134 | red | Verified and holding | — | — | None |
| 135 (r4) | Mine | Bootstrap and small skewed samples | CONCEDE (corrected) | Row 179 | s18:1945 softened in Phase 0 (Gate A, decision 6) |
| 136 | Mine | Fourth copy and generator | CONCEDE | build_badge_architecture.py:96-275, 512, 3819 | G-3a (M3) |
| 137 | Mine | Stale topic-evaluation slug map | CONCEDE | generate_topic_evaluations.py | Derived from index.ts |
| 138 | Mine | Peeking code shares a pinned block | CONCEDE | s18:363-396 | Row 71 |
| 139 | Mine | A commit cannot hold its own sha | — | — | PR-1 has three commits |
| 140 | Mine | Bespoke figure components are named by number | CONCEDE | figures/index.tsx:69-72 | `git mv` plus registry remap |
| 141 | VP R3-B1 | Unqualified duality vs pooled test and unpooled CI | CONCEDE | 34 of 3,997 tables; Newcombe 24; Agresti–Caffo 32 | §0 row 1 |
| 142 | VP R3-B2 | Old S33 still defines CV and MAE first | CONCEDE | terms.ts:681-687; s33:34, 442-450, 530 | §0 row 2 |
| 143 | red R3-B1 | History guards run at depth 1 | CONCEDE | tests.yml:18-20 vs :99 | §0 row 3 |
| 144 | red R3-B2 | Ask-first after the act | CONCEDE | AGENTS.md:92-96, 139-143 | §0 row 4; Gates A, B and C |
| 145 | VP note | G is right; DA ladder; re-ask two things | CONCEDE, with a nuance | graph roles[0]: hypothesis_testing at independent; experimental_design and metric_design at advanced | Decision 1 shows both ladders (row 181) |
| 146 | VP note | DiD SEs with HC on panel rows overstate precision | CONCEDE | Bertrand, Duflo and Mullainathan 2004 | S34-T4-B collapses each unit to one post−pre difference and regresses it on treatment with HC SEs. Multi-period DiD with clustered SEs goes to the boundary under G. Added to the G vs G' ledger. |
| 147 | VP note | `(X'X)⁻¹σ̂²` needs linear algebra the course never teaches | CONCEDE | `np.linalg`: 0 hits in 52 sections; `.T` only in s33:274-277 (backprop) | S34-T2-A teaches `X.T` and `np.linalg.solve` (`lstsq` named, `inv` avoided), checked against `coef_`. HC moves to T2-B. |
| 148 | VP note | The ANOVA F-test is inference | CONCEDE | — | T1-B: dummy coefficients reproduce group means. T2-A: `scipy.stats.f`, checked against `f_oneway`. |
| 149 | VP + red notes | Coverage simulation: reps, MC SE, BCa, runtime budget, Pyodide | CONCEDE | python_content_runtime_audit.py:39 (8 s); tests.yml:346 (4 workers); row 179 | The brief fixes R and B; t and bootstrap-t are vectorised; BCa runs with R = 500; MC SE is printed; claims need > 3 MC SE; nothing is claimed at n ≥ 30; pins come from `.venv-content`. |
| 150 | VP note | s18:1945 `preferir_bootstrap_si_colas` contradicts S19 | CONCEDE | Row 179 | Codex softens it in Phase 0 (Gate A, decision 6). Check the youDo expected output it feeds. |
| 151 | VP note | Homonyms: cobertura, contraste, potencia | CONCEDE | Measured: "cobertura" S18 32 hits; "contraste" S19 14, S51 35; "potencia" S02 5 | Title uses "pruebas de hipótesis" and "potencia estadística". Lessons write "cobertura del intervalo" in full. Three-way sense split for cobertura (test coverage S27, sampling frame S18, interval S19). |
| 152 | VP note | The glossary plan is under-specified | CONCEDE | — | The concept matrix homes about 40 terms before authoring (§3 glossary). |
| 153 | VP note | S37-T1-B-E1 never practises Wald ≈ LATE positively | CONCEDE | — | E1 also computes the true complier effect from the simulated types. |
| 154 | VP note | S37-T3-A is overloaded | CONCEDE | — | The delta method becomes demo plus E3, cross-checked by a cluster bootstrap. The motivating case is S19-T3-B-E3's relative lift. |
| 155 | VP note | No pinned group-sequential package | CONCEDE | requirements-content.txt | Pocock and O'Brien–Fleming boundaries are calibrated by simulation from S18's peeking loop. Lan–DeMets is named only. |
| 156 | VP note | Proportions readout: absolute and relative | CONCEDE | — | S19-T3-B-E3 reports the difference, the lift and a bootstrap CI for the lift. |
| 157 | VP note | CP-N2-B wording invites over-testing | CONCEDE | — | Restated (decision 8). |
| 158 | VP note | data_analyst also needs design and metric_design | CONCEDE | roles[0] advanced; no current badge claims the four nodes | Decision 7 re-ask; applied statistics badge recommended. |
| 159 | VP note | HTE in the youDo only is acceptable | CONCEDE | — | One worked segment readout goes in the S37-T2-A demo. |
| 160 | VP + red notes | Pilot: human review in both arms; selective labels | CONCEDE | catalog.ts:94 "Decisión adversa sin revisión"; Lakkaraju et al. 2017 | Both arms keep review. A random audit below the threshold supplies the guardrail data. The stopping rule names missed cases per arm. |
| 161 | VP note | Assumption checking | CONCEDE | — | A Q-Q-style check in S19-T3-A. |
| 162 | VP note | Old S33 pure-Python logistic after sklearn | CONCEDE | — | The T2-A bridge frames it as "abrir la caja" of `LogisticRegression`. |
| 163 | red note | The deploy gate is vacuous | CONCEDE | GitHub docs: on `workflow_run`, GITHUB_SHA is the default branch tip; deploy.yml:21, :38 | Check out `workflow_run.head_sha`. Assert `head_branch == 'main'`, `event == 'push'` and `conclusion == 'success'`. Stamp `head_sha`. Skip if head_sha is no longer main's tip. Remove `workflow_dispatch`. |
| 164 | red note | G-11's "reused id string" fails PR-1 | CONCEDE | 816 ids rebound by construction | The predicate is restated in (slug, suffix) terms (§4). |
| 165 | red note | G-11 has no retire rule | CONCEDE | tools/fixer writes no ledger rows | The window closes mechanically at the Phase 6 merge. `safe_commit.py` appends ledger rows on `curriculum/55`. |
| 166 | red note | G-14 frozen set is undefined; its cost is absorbed | CONCEDE | Row 45 rename detection; campaign at S03/S04 | Frozen set narrowed to renumber artifacts (§4). G-15 handles carried tokens. Override procedure added. Trade-off stated. |
| 167 | red note | The pin requires H0, which S18 never uses | CONCEDE | 0 hits for "hipótesis nula" or "H0"; s18:356 | The pin accepts `/sin efecto\|ningún efecto\|H0\|hipótesis nula/`, permanently. S19 gets its own `hipotesis-nula` term. |
| 168 | red note | Dead terms change the exact-equality constant | CONCEDE | terms.ts:828, :962; ratchet :89-90 | NEVER_APPEARS_OWED goes 5→4 in the Phase 0 S18 "estimando" commit and 4→3 in the S19 commit that first writes "Distribución normal". Scaffolds use no planned aliases. |
| 169 | red note | Runtime budget | CONCEDE | Merged into row 149 | Row 149 |
| 170 | red note | T1-B needs t critical values before T3-A | CONCEDE | — | scipy enters at T1-B. |
| 171 | red note | Completeness: BCa, bootstrap-t, Wilson, log scale | CONCEDE | Row 179; Newcombe via Wilson (row 141) | T1-B measures BCa and teaches bootstrap-t. T3-B uses Wilson and Newcombe. T3-A notes the log scale (it changes the estimand to the geometric mean) and the permutation test as the assumption-light route. Rank tests stay in the boundary. |
| 172 | red note | Selective labels | CONCEDE | Merged into row 160 | Row 160 |
| 173 | red note | The pickup rule meets untaught claims | CONCEDE | LEAD-F9; s33:274-277 has a hand-written backprop, so "untaught" holds at title level | New decision 17. |
| 174 | red note | The manifest is outside ask-first and CODEOWNERS | CONCEDE | CODEOWNERS:1 "when branch protection enforces it" | Decision 3 adds the CODEOWNERS entries, the AGENTS.md ask-first line, and a protection rule for `curriculum/55`. |
| 175 | red note | skill_node_evidence fixes slugs before placement | CONCEDE | — | Role keys (`inference`, `regression`, `design`), bound at Gate B. An unbound role fails any badge that lists its node. |
| 176 | red note | The census misses requirements-content.txt | CONCEDE | requirements-content.txt:36-43 | Added to the census and to G-15. |
| 177 | red note | The ruling holds; re-ask only design placement | CONCEDE | — | Decision 1 |
| 178 | Mine | SIM-11 was decided but not implemented | NEW | DECISIONS_2026-09-21.md (SIM-11): `environment` becomes load-bearing. Grep: 0 `environment` references in SectionView.tsx and CodePlayground.tsx; 0 `local-python` in src/components. | Implement SIM-11 in Phase 0. Mark every scipy and sklearn statistics block `local-python`. Until then the playground (Pyodide 0.26.2, numpy 1.26.4) cannot be trusted to print pinned outputs. |
| 179 | Mine | Bootstrap-t covers; BCa does not | NEW | In-memory sim with seed 20261005, lognormal(3.0, 0.4), R = 1,500, B = 999. n = 5: t 0.923, percentile 0.796, BCa 0.799, bootstrap-t 0.933. n = 10: 0.927, 0.880, 0.882, 0.943. MC SE 0.0056; about 3 s per n natively. | Withdraws round 3's "nothing simple reaches 95%". |
| 180 | Mine | No standard interval removes the duality gap | NEW | Wald 34, Agresti–Caffo 32, Newcombe 24 of 3,997 tables | The qualifier is necessary for any interval (row 141). |
| 181 | Mine | The DS ladder points the other way | NEW | graph roles[1] (data_scientist) independent lists hypothesis_testing, regression and experimental_design; roles[3] (ai_ml_engineer) advanced lists experimental_design and causal_inference | Decision 1 shows the DA and AI/ML ladders (design at N3) against the DS ladder (design at N2). |
| 182 | Mine | CV becomes late if S34 uses it while homed at S35 | NEW | First alias match today: S33 (old), equal to its home | Re-home in the same commit (row 142). |
| 183 | Mine | The sentinel goes red on a branch's first push | NEW | tests.yml:29 uses `github.event.before`, which is all zeros on branch creation; preservation_sentinel.mjs:68-69 accepts it, and :80 `git diff 000…...HEAD` fails with BASE_UNREADABLE | The sentinel treats an all-zero base as "branch created" and resolves `merge-base HEAD origin/main`. It still fails if that is unreadable. Mutation-proven. Lands in the CI PR (Gate A, decision 3). |
| 184 | Mine | The DA advanced level lists power and multiple comparisons | NEW | roles[0] advanced complexity: "statistical rigor in A/B tests (power, multiple comparisons)" | S19 (N2) teaches them early. N2 claims say "applies", not "advanced" (decision 7). |

## 2. The options, ranked

Graph edges (industry_skill_graph.json :2940-2957): `hypothesis_testing -> regression`, `hypothesis_testing -> experimental_design`, `experimental_design -> causal_inference` and `regression -> classical_ml`.

**Completeness count: 25 units**, made of 24 We Do slots and one youDo unit.

Inference (S19):
1. Probability and Bayes; binomial.
2. Normal, CLT, SE, t, and coverage, including bootstrap-t and BCa.
3. Null hypothesis and permutation test.
4. p as a tail area, and the qualified duality.
5. Welch and paired tests (paired t, McNemar), with assumption checks.
6. Proportions: pooled test = χ², Wald vs Newcombe, the disagreement case, and relative lift.
7. Errors, power, MDE and n.
8. Holm and Benjamini–Hochberg.

Regression (S34):

9. Estimator API, OLS, MAE, RMSE and R².
10. Indicator variables, interactions, and group means.
11. Coefficient inference with `solve`, plus the F-test.
12. Diagnostics and HC standard errors.
13. VIF, ridge, lasso and elastic net.
14. K-fold and GridSearchCV.
15. DAG and adjustment.
16. Two-period DiD (collapsed).

Design (S37):

17. Estimand.
18. Wald/LATE.
19. The plan.
20. Interim looks, by simulation.
21. Randomisation unit and design effect; delta method.
22. Balance checks and SRM.
23. CUPED and stratification.
24. IPW.
25. Heterogeneous effects and the launch decision (youDo).

**Declared boundary.** These stay untaught; the owner decides each one.
- 2SLS with an observational instrument.
- Do-calculus beyond the backdoor criterion. No claim may name it.
- Bayesian A/B readouts.
- Poisson and GLMs.
- Rank tests.
- Time-series inference.
- Survival analysis.
- Mixed models.
- Synthetic control and RDD.
- Multi-period or staggered DiD with clustered SEs (under G only).
- Exact Lan–DeMets spending (named only).

| rank | option | market skills taught | duplicates | migration cost and risk | level fit, and graph edges inverted | left untaught |
|---|---|---|---|---|---|---|
| **1** | **G (recommended).** S19 inference; S34 regression, between old S32 and old S33; S37 design, after old S34. | All four statistics nodes. | None, with old-S33's CV and MAE turned into recalls (row 142). | Three zones: +1, +2, +3. CP-N2-B 4→5, CP-N3-B 4→5, CP-N3-C 5→6. Manifest roles. | Fits the DA and AI/ML ladders. **Inverts** `experimental_design -> causal_inference`: S34-T4 comes before S37. DiD is two-period only, with correct SEs (row 146). | The boundary |
| 2 | **G'.** Same numbering. DiD moves to S37-T4-B, and S34-T4-B becomes polynomial and spline terms. | Same | None | Same as G | Only the DAG and adjustment come before S37 (the Mastering 'Metrics order). DiD after S37-T3-A can use clustered SEs, so multi-period DiD leaves the boundary. **Cost:** the plan and interim looks share S37-T2-A. | The boundary, minus multi-period DiD |
| 3 | **E-swap.** S36 regression, then S37 design. | Same | Same | Two zones; CP-N3-C grows to 7 | **Inverts** `regression -> classical_ml`: s33:159 and :208 come before linear regression. | The boundary |
| 4 | **A (as ruled).** S19, S20, S35. | All four | As drafted, it duplicates s33:159, 208, 486 and s18:143, 187. | +2/+3; CP-N2-B grows to 6 | Respects every edge. Design at N2 fits the DS ladder (row 181) but not the DA or AI/ML ladders. CUPED comes before OLS, and IPW before calibration. | IPW cannot be taught properly at S20. |
| 5 | **B.** S19/S20 plus deepening old S33. | Inference and design | — | Uniform +2 | — | Regression's 8 units do not fit in S33 (SIZE-1). |
| 6 | **C (VP round 1).** One N2 section. | Partial | — | +1 | Good | 16 units in 8 slots; fails the completeness rule. |
| 7 | **D-split.** Split S18 and S33. | Partial | Moves ids | 48 new exercises, and still renumbers (SPLIT-1) | — | Most units |
| 8 | **D-append.** S53–S55. | All, but late | — | Trips the 52-count tests | Breaks graph :2937-2957 | — |
| 9 | **E (round 1).** | — | — | — | CUPED before OLS. Retired. | — |

**Why G over G'.**
- G keeps one practised subtopic per unit.
- G' buys graph order plus multi-period DiD, and pays for it with an overloaded S37-T2-A.
- The DiD standard-error fix (row 146) makes G's two-period DiD correct, so G' now wins only on scope, not on correctness.
- The owner sees both ledgers.

## 3. The strongest design (G)

**Numbering:**
- Old S01–S18 stay as they are.
- New S19.
- Old S19–S32 become S20–S33.
- New S34.
- Old S33–S34 become S35–S36.
- New S37.
- Old S35–S52 become S38–S55.

**Levels:**
- N2 = S14–S27.
- N3 = S28–S42.
- N4 = S43–S55.

**Gates:**

| capstone | gate | contributing sections |
|---|---|---|
| CP-N2-B | S22 | S18–S22 |
| CP-N2-C | S27 | — |
| CP-N3-A | S31 | — |
| CP-N3-B | S36 | S32–S36 |
| CP-N3-C | S42 | S37–S42 |
| CP-N4-A | S46 | — |
| CP-N4-B | S50 | — |
| CP-N4-C | S54 | — |
| FINAL | S55 | — |

**Positional spans:**
- phase1 and capstone_independent = S14–S27.
- phase2 and capstone_advanced_applied = S28–S42.
- phase3 and integrated_mastery = S43–S54.
- journey_completed = S01–S55.

Codex drafts all Spanish, and the owner decides.

### S19, "Inferencia: probabilidad, pruebas de hipótesis y potencia estadística" (N2)

**CP-N2-B increment.** Every claim that goes from a sample to a population, or compares groups, cites n, a CI and an effect size. Tests apply only to pre-declared comparisons, with Holm across them.

| topic | A (delta) | B (delta) |
|---|---|---|
| T1 Probabilidad y distribución muestral | Conditional probability, independence and Bayes from a contingency table (base rate). Bernoulli and binomial. s18:2050 states that p is conditional but teaches no rule. | The normal, CLT and SE. t corrects for estimating σ.<br>**First scipy code:** `t.ppf` and `norm.ppf` (2.776 vs 1.96 at n = 5).<br>A coverage simulation on S18's tickets at n = 5 and 10 compares z, t, the percentile bootstrap, BCa and bootstrap-t (budget per row 149).<br>The remedy taught for the mean under skew is t, or bootstrap-t. Percentile and BCa are for exposing asymmetry and for statistics without a formula. The lesson names BCa as scipy's default.<br>Recalls s18:198. Always writes "cobertura del intervalo" in full. |
| T2 Pruebas por aleatorización | Null hypothesis and a permutation test on the S18 pilot. E3 is the self-selection delta (s18:1891, 2040). **This is where s18:247-252 is practised.** | p as a tail area, one-sided and two-sided.<br>**The duality, with its qualifier:** it holds when the CI inverts the same statistic. Worked with T1-B's one-sample t.<br>Recall: p ≠ P(H0\|datos), using T1-A's Bayes. **This is where s18:353 is practised.** |
| T3 Pruebas con nombre | `ttest_ind(equal_var=False)` with the Welch interval, showing that the duality holds. Assumptions checked with a Q-Q-style figure.<br>A log-scale note: it compares geometric means, which is a different estimand. The permutation test is the assumption-light route.<br>Paired t. McNemar via `binomtest`. Bridge to Evals (new S53). | **E1:** the pooled z-test, equal to `chi2_contingency(correction=False)` (z² = χ²). Yates is named. Then an r×c table.<br>**E2:** 2/20 vs 7/20. Pooled p 0.058; Wald [0.003, 0.497]; Newcombe [−0.013, 0.479]. The lesson explains why they differ and states the readout rule. Pinned strings per row 141.<br>**E3:** the readout gives the absolute difference, the relative lift (3.5×) and a bootstrap CI for the lift. This is the hook for S37's delta method. |
| T4 Errores y decisiones | Type I/II errors, power, MDE and n; power by simulation. Re-practises Cohen's d. Always writes "potencia estadística" in full. | Holm and Benjamini–Hochberg. Recalls s18:359 (p_minimo 0.0283). |

### S34, "Regresión lineal y regularización" (N3, head of the ML block)

**CP-N3-B increment.** A regression of investigation effort per case, with coefficient CIs. Its coefficients are not causal.

| topic | A | B |
|---|---|---|
| T1 Regresión lineal | `DummyRegressor`, then `LinearRegression`, on the same split. MAE, RMSE and R², with R² computed against the test-set mean. **Home of `mae`, `rmse` and `r2`.** | Indicator variables (one-hot) and the reference level. Interactions. The dummy coefficients reproduce the group means; there is no F-test here. |
| T2 Inferencia y diagnóstico | `X.T` and `np.linalg.solve` for β̂, checked against `coef_`. SE from σ̂²(X'X)⁻¹ via `solve`. CI and t with `scipy.stats.t`. The F-test for the group dummies with `scipy.stats.f`, checked against `f_oneway`. | Residuals against fitted values. Non-linearity, with a polynomial term. Heteroscedasticity, with **HC standard errors taught here**. Leverage and Cook's distance. |
| T3 Regularización | VIF. Ridge, lasso and elastic-net paths in a `Pipeline` with `StandardScaler`, reusing s32:131's frozen μ/σ. | K-fold plus `GridSearchCV` over alpha, with a held-out test set. Nested CV in the demo only. **Home of `cross-validation`** (re-homed in this commit) **and `hyperparameter-tuning`.** |
| T4 Coeficiente no es efecto | DAG, backdoor paths, confounder, mediator and collider; regression adjustment. Extends S18-T3-A-E3. DAG sense split from S26:64-74. | Two-period DiD. Collapse each unit to one post−pre difference and regress it on treatment with HC SEs. A pre-trend check cannot prove parallel trends. The target is the effect on the treated units. |

### S37, "Diseño experimental y causalidad" (N3, opens CP-N3-C; the marker moves from s35:48-50, ask-first)

**youDo: the CP-N3-C pilot of the s34:408 threshold.**
- Both arms keep human review (catalog.ts:94).
- The primary metric is review load.
- The guardrail is missed cases per arm. Its data come from a random audit below the threshold.
- The stopping rule is calibrated in T2-B.
- Heterogeneous effects are read by pre-declared segment, with S34-T1-B's interactions and S19-T4-B's Holm correction.
- The pilot ends in the launch decision.

| topic | A | B |
|---|---|---|
| T1 El estimando antes que el dato | Estimand, estimator and estimate. ATE, ATT and ITT. Recalls s18:251. | Non-compliance. Wald = ITT_Y/ITT_D = LATE/CACE under four assumptions.<br>**E1:** ITT, Wald and per-protocol, compared with both the true ATE **and the true complier effect**.<br>**E2:** breaks monotonicity, then exclusion.<br>**E3:** one-sided non-compliance, where Wald = ATT. |
| T2 El plan | The pre-registered plan: metrics, decision rule, segments. Duration, novelty and primacy. **The demo includes one worked segment readout.** | Interim looks. Recalls 0.045 vs 0.191. Pocock and O'Brien–Fleming-shaped boundaries are calibrated by simulation from S18's loop. Lan–DeMets is named only. The guardrail stopping rule works per arm. |
| T3 Asignación | Randomisation unit, interference, cluster randomisation and the design effect. **The delta method is demo plus E3,** using S19's relative lift and cross-checked by a cluster bootstrap. | Balance checks and SRM via `chisquare`, as a delta over S19's χ². |
| T4 Precisión y sin sorteo | CUPED, θ = S34's OLS slope. Stratification. | IPW, using old S33's logistic regression and old S34's calibration. Assumptions: no unmeasured confounding, overlap and positivity. |

### Existing content: what stays, moves or gets a bridge

**S18:**
- S18 keeps all of its content and all 24 exercises.
- Phase 0 edits, each needing Gate A:
  - "estimando" at s18:251;
  - softening `preferir_bootstrap_si_colas` at s18:1945.

**Old S33 (new S35)** keeps its exercises. Codex adds these bridges:
- **T1-A:** recalls S34's framing (s33:595).
- **T1-B:** recalls the dummy baseline.
- **T2-A:** ridge; "abrir la caja" of `LogisticRegression`.
- **T2-B:** the log-odds reading is the delta.
- **s33:34:** rewritten to the entity-grouping delta.
- **s33:442-450:** K-fold recall; entity disjointness is the delta.
- **s33:524-530:** MAE recall; the seasonal baseline and rolling origin are the delta.
- **T4-B:** recalls K-fold.
- **s33:274-277:** recalls S34's `.T`.

**Old S34 (new S36):**
- s34:306-310 recalls Bayes.
- s34:408 gets a bridge to the pilot.

**Old S35 (new S38):**
- The CP-N3-C marker moves to S37.
- s35:64 recalls S34's coefficients.
- Permutation importance recalls S19's permutation test.

**Old S36 (new S39):**
- The σ rules recall S19's normal.
- The backtests recall K-fold.

**Old S50 (new S53):** McNemar and paired comparisons.

Every bridge gets a row in `renumber_edit_ledger.json`.

**Glossary.** Each term below gets a concept-matrix row before authoring.
- **S18:**
  - `p-value` is rewritten in S18's words.
  - `estimando` stays homed here.
- **S19:**
  - `distribuci-n-normal` (re-homed and rewritten).
  - New terms: probabilidad condicional, teorema de Bayes, distribución binomial, teorema central del límite, error estándar, distribución t, cobertura del intervalo (sense split), hipótesis nula, prueba de permutación, prueba t de Welch, prueba pareada / McNemar, chi-cuadrado, potencia estadística, error tipo I/II, MDE, Holm, FDR / Benjamini–Hochberg.
- **S34:**
  - New terms: regresion-lineal, mae, rmse, r2, variables indicadoras, interacción, error estándar robusto, VIF, ridge/lasso/elastic net, confusor/mediador/colisionador, DiD.
  - Re-homed: `cross-validation`, `standardscaler`, `hyperparameter-tuning`.
  - A DAG sense split.
- **S37:** ATE/ATT/ITT, LATE/CACE, SRM, efecto de diseño, método delta, CUPED, IPW, puntaje de propensión.

## 4. Migration order and the hard blocks

1. **Phase 0a: draft, no merges.** The agent drafts the CI, guard and manifest PRs, and Codex drafts the claim text, glossary definitions and S18 edits. Each PR runs CI and carries its mutation proof.
2. **Gate A.** The owner answers decisions 2, 3, 6, 14 and 16.
3. **Phase 0b: merge, one PR each, in this order.**
   - a. CI and sentinel:
     - G-1;
     - the branch-created base fix (row 183);
     - `curriculum/55` triggers in tests.yml;
     - sentinel-job steps for G-11, G-14 and G-15, which start dormant;
     - the deploy gate (row 163);
     - CODEOWNERS and the AGENTS.md ask-first line for the manifest and window files.
   - b. Catalog reconciliation (decision 16), plus retargeting test_eligibility_engine.py.
   - c. The manifest (identity, phase-span rules, unbound role keys), plus G-3a.
   - d. Counts-free claims, plus G-3b.
   - e. The fixer-state re-key, plus G-12; `safe_commit.py` appends ledger rows on `curriculum/55`.
   - f. One commit: the glossary definitions, the pin, S18's "estimando", s18:1945, and NEVER_APPEARS_OWED 5→4.
   - g. Derive the number duplicates, plus G-2 and G-4 to G-10. Implement SIM-11 with its test.
   - h. G-11, G-14 and G-15 scripts (dormant), plus `renumber-history-guards.test.mjs`.
   - Then commit `curriculum55_window.json` on `main`, with `branch_point_sha` = its parent. Cut `curriculum/55` from that commit and apply its protection rule.
4. **Gate B.** The owner answers decisions 1, 4, 5, 7–13, 15 and 17.
5. **Phase 1, in parallel on `main`.** Re-key by title through the manifest. G-14 exempts regenerated tokens. The claim text waits for Gate C.
6. **Phase 3: PR-1 into `curriculum/55`, merged with a merge commit.** It has three commits:
   - the owner's roadmap diff;
   - the renumber: `git mv`, the mapping, full-grid scaffolds, the concept matrix, role binding, the partition, tokens, figures, banks and tags;
   - `renumber_epoch.json`.
7. **Phase 4: authoring, in the order S19, S34, S37.** Codex writes the bridges, and every edit gets a ledger row.
   - The S19 commit changes NEVER_APPEARS_OWED from 4 to 3.
   - The S34 commit re-homes `cross-validation`, so DECLARED_LATE_OWED stays 13.
8. **Gate C, then Phase 5.** The owner approves the Codex claim text; then the manifest nodes and claims change and the tokens are regenerated.
9. **Phase 6.** The branch marks the window closed, then merges into `main` with a merge commit and no squash.

| hard block | guard (location; job) | bad state it fails on |
|---|---|---|
| History present | G-11, G-14, G-15 (`scripts/preservation/*.mjs`; preservation-sentinel job, `fetch-depth: 0`) | `HISTORY_MISSING`: the repository is shallow, or the recorded sha, its parent or the branch point is unreadable. Mutation-proven in a `--depth 1` `file://` clone. |
| Renumber meaning | **G-11**, `renumber_meaning_guard.mjs` | (b) The renumber sha is not an ancestor of HEAD (squash or rebase).<br>(c) In the renumber commit, an id is bound to a slug other than mapping(its binding at sha^); a (slug, suffix) pair goes missing; or a new slug lacks a 24-grid.<br>(d) Inside the window, a moved file differs from the sha without a ledger row (authoring, bridge or carried_from_main), or a ledger row has no diff.<br>(e) The section count is not the roadmap's count.<br>Check (d) retires automatically at the first first-parent commit on `main` that contains the sha. Checks (a) to (c) stay. |
| Carried tokens | **G-15**, same script, branch side | A line that `main` added since the branch point, carrying an S-token ≥19, without mapped(line) at the mapped path and without a `carried_from_main` row. This covers requirements-content.txt. |
| Freeze on `main` | **G-14**, `curriculum55_freeze_guard.mjs` | While the window is open, any of these differs from its branch-point blob without an `overrides[]` row (path, reason, owner approval):<br>• index.ts and course_requirements.json;<br>• the three roadmaps;<br>• capstones catalog.ts;<br>• the figure registry;<br>• PdfReport.tsx;<br>• section_ledger;<br>• the exam-bank file set;<br>• in S19–S52, the parsed id, index, title, phase, exercise-id set and figure ids.<br>Prose, exercise bodies, the manifest, tools/fixer and the glossary are not frozen. Regenerated files are exempt.<br>**Trade-off:** merges from `main` can conflict on renumbered lines, and each carried edit needs a ledger row. |
| Sentinel | **G-1**, plus the row-183 fix | COMPARE_SKIPPED reported as OK. BASE_UNREADABLE on a branch's first push. |
| Deploy | deploy.yml | Not `head_branch == main`, `event == push` and `conclusion == success`; a deploy of anything other than head_sha; head_sha no longer main's tip; G-13 not empty. |
| Badge identity | **G-3a**, `tests/adversarial/test_badge_section_identity.py` | A token that does not resolve to its manifest slug. A positional badge not equal to its span. A node claimed while its role is unbound or its slug is missing. Mutations M1–M3. |
| Badge claim text | **G-3b** | A count or S-range literal in either claim field. Any mention of do-calculus. |
| Fixer state | **G-12** | A slug that does not match its number. A hardcoded 52. A missing epoch. |
| Authoring window | **G-13**, `test_authoring_window.py`, also run by deploy | A deploy, or a merge to `main`, while `authoring_pending.json` is not empty. A slug leaving the list before its exit criteria are met: 8 demos, 24 exercises, 4 topic evaluations, 24 exam variants, an exam, a project increment, a bank file, complete matrix rows, pinned strings present (including the duality row), and closed ledger rows. |
| `index:`, literals, labels, tags, banks, roadmaps, copy | G-2, G-4 to G-10, R-1 | As in round 3. |
| Glossary definitions | `glossary-statistics-definitions.test.mjs` | p-value: missing "al menos tan extrem", missing `/sin efecto\|ningún efecto\|H0\|hipótesis nula/`, or containing a threshold. Normal: missing `1[.,]96`. |
| Glossary ratchet | The owed constants | A change outside the named commits (row 168). |
| Practice homes | test_concept_depth_ratchets.py pins | Fewer than 3 S19 valor-p exercises. No S18 Cohen's d exercise. S37-T1-B not naming ITT, Wald/LATE and per-protocol, or not computing the complier effect. |

## 5. Owner decisions (recommendation first)

**Gate A: answered before any Phase 0 merge.**

2. **Positional badges (claim change).** Derive their spans from `phase`. Codex writes counts-free text for both claim fields, shown as a diff. Version the changed badges 2.0.0. Nothing is awarded retroactively.
3. **CI, deploy and branch window (protected paths).** Approve:
   - the tests.yml triggers;
   - the sentinel-job steps for G-11, G-14 and G-15;
   - the row-183 sentinel fix;
   - the `workflow_run` deploy gate, with `workflow_dispatch` removed;
   - merge-commit-only for PR-1 and Phase 6;
   - a protection rule for `curriculum/55`: CODEOWNERS review, no force-push, no linear-history requirement;
   - G-14's narrowed frozen set and its override procedure;
   - CODEOWNERS entries and an AGENTS.md ask-first line for the manifest, `src/lib/eligibility/`, and the window, epoch and ledger files.
6. **S18 and glossary edits.**
   - Codex adds "estimando" at s18:251.
   - Codex rewrites the p-value and normal-distribution definitions in S18's words.
   - Codex softens s18:1945, for example to "reporta n; bootstrap para ver asimetría".
   - The pin lands with these edits, and NEVER_APPEARS_OWED changes 5→4 in the same commit.
14. **Guards.** G-1 to G-15 and the pin. They live under `tests/` and `scripts/preservation/`.
16. **(new) Catalog reconciliation (claim change).** Sync the industry copy to the src copy. The field diff to approve covers credential_class 31, non_claims 31, public_claim 26, name 5, version 5, verification_mode 5 and required_* 1. Drop S52 from the `progress_phase3_walked` contract and bump its version. Retarget test_eligibility_engine.py. The alternative is to keep the industry copy as INACTIVE_PRESERVED and exclude it from G-3a.

**Gate B: answered before Phase 3.**

1. **Placement.** Keep inference at N2 and regression at S34. Re-ask only:
   - design at N3 S37 (recommended, following the DA and AI/ML ladders) or at N2 S20 (as ruled, following the DS ladder; row 181);
   - G or G' (G' allows multi-period DiD and overloads S37-T2-A).

   The manifest roles are bound from this answer.
4. **Causal deferrals.** Defer 2SLS with an observational instrument, and do-calculus beyond the backdoor criterion. Each gets a "retire when" line.
5. **Boundary.** Approve the §2 list, including multi-period DiD under G. Approve heterogeneous effects in the youDo, plus one demo readout.
7. **Credentials (by role key).**
   - data_analyst: inference, plus re-ask design with experimental_design and metric_design. N2 claims say "applies", not "advanced" (row 184).
   - data_science: all three roles and all four nodes.
   - capstone_independent: hypothesis_testing.
   - capstone_advanced_applied: regression, experimental_design and causal_inference.
   - Create one applied statistics badge: yes. No current badge claims any of the four nodes, so the pickup rule is not triggered.
8. **Capstones (ask-first).**
   - CP-N2-B adds S19, with the restated "n, CI, effect size; tests only pre-declared, with Holm" text.
   - CP-N3-B adds S34.
   - CP-N3-C moves its start to S37.
   - The pilot brief keeps review in both arms, uses a random audit below the threshold, and tracks missed cases per arm.
9. **Roadmap authority.** V3 is authoritative. Update learning_roadmap.md, or retire it through a DestructiveChangeRequest.
10. **Homonyms.** Use "pruebas de hipótesis" (never a bare "contraste"), "potencia estadística", and "cobertura del intervalo", each with sense splits. Use "variables indicadoras (one-hot)" and a DAG sense split.
11. **Learner notice.** Codex writes one line for learners at 52/55. Nothing is awarded.
12. **Titles.** Codex drafts "Inferencia: probabilidad, pruebas de hipótesis y potencia estadística", "Regresión lineal y regularización" and "Diseño experimental y causalidad".
13. **Amendments.** Change AGENTS.md:131-132 and course_requirements.json:14-15 and :35 visibly.
15. **Parallel work.** Phase 1 re-keys by title through the manifest, with the pickup rule. S05 type safety starts now. SIM-11 lands in Phase 0.
17. **(new) Untaught claims.** Deep learning, fine-tuning and graph-RAG are claimed but no section title teaches them. My recommendation is a recorded owner decision for each one: teach it or drop it. Carrying the claim forward is not an option. Note that s33:274-277 already teaches a hand-written backprop, so "untaught" holds at title level only.

**Gate C: answered before any claim text merges (Phase 1 and Phase 5).** The owner approves the Codex-written text of every changed badge, shown as a diff.

All reads came from `mergewt/` and `g0/` under `/private/tmp/claude-501/-Users-pabloillescas-Documents-GitHub-pyarcana/cc134761-bb7b-4536-886e-875c53ae213c/scratchpad/`. I wrote no files and ran no gate or audit scripts. The proportions enumeration and the coverage simulation ran in memory under system Python 3.9 with numpy 2.0.2 and scipy 1.13.1, not `.venv-content`, so the pinned outputs still have to come from `.venv-content`.