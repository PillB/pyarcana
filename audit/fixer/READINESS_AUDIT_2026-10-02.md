# Readiness audit — 2026-10-02

Measured at `a56a4167` (PR #74 merged to `main`), 52 live sections.
Re-run everything here with the commands in §6. Nothing in this file is hand-counted.

**Headline: the course-wide "0 surprising uses" is true of the instrument and false of the
course.** On the owner's definition — a term must be *explained on a surface that teaches* **and**
*exemplified* before it is used, tested or elaborated — **75 of 108 concepts are still
surprising.** The gate reports 0 because of three independent blind spots, all reproduced below.

---

## 1. Why the zero is not the owner's zero

| # | Blind spot | Scale | Status |
|---|---|---|---|
| 1 | ~~**Self-certifying first mention**~~ — **RETRACTED 2026-10-04**, see the note in §1.1: `concept_map.py` already had a surface hierarchy, and the surfaces it keeps are kept deliberately and only credited when a gloss is actually present | ~~46 concepts~~ **0** | withdrawn |
| 2 | **Explained but never exemplified** — the gate checks *explained*, never *exemplified*; the owner's definition requires both | **36 concepts** | measured |
| 3 | **Alias miss** — the glossary does not declare the form the course actually writes, so real teaching is invisible | proven on `data-leakage` | measured |
| — | never defined anywhere | 7 concepts | measured |
| — | union on the owner's definition | **75 / 108** | measured |

> **RETRACTION, 2026-10-04.** Blind spot 1 below is withdrawn. `scripts/concept_map.py` already
> had a surface hierarchy: `TEACHING_KINDS` filters definitions *before* the first one is chosen,
> and commit `fb27fcd8` had already removed `wedo.hint` and `selfcheck.option` from it for exactly
> the reason argued here. What it keeps it keeps deliberately — `outcome`/`tagline`/`jobRelevance`
> because D1 treats a gloss on a preview surface as a definition (excluding `outcome` had scored
> `ruff` never-explained across 39 uses), and `wedo.preamble`/`wedo.instruction` because We Do is a
> teaching phase in gradual release and the preamble *is* the guidance. The detector credits those
> surfaces only when `definesTerm` actually fires, i.e. when the text contains a gloss — and every
> sampled case does: *"`for` —la instrucción que repite un bloque de código…"*, *"un
> **repositorio**, una carpeta con historial que Git mantiene"*, *"precision —de los pares marcados
> como iguales, qué parte sí lo era—"*.
>
> **The `precision`/`recall` example below is therefore wrong**, and it was this section's most
> rhetorically effective one. S13's `outcome[1]` defines both, correctly. `SELF_CERTIFYING_DEFINITIONS_OWED`
> is retired; the ratchet counted a second opinion wearing a number. Blind spots 2 (explained but
> never exemplified, 35) and 3 (alias miss) stand, and 2 is the half of the owner's definition that
> genuinely goes unmeasured.

### 1.1 Self-certifying first mention

For every term below, `first_use` **is** `first_definition` — same section, same location, same
field. The detector finds the first appearance, finds a gloss-shaped phrase beside it, and credits
that appearance as the definition.

| surface | concepts entering the course this way |
|---|---:|
| `outcome` (a learning-outcome bullet) | 28 |
| `jobRelevance` (a market blurb) | 7 |
| `tagline` | 6 |
| `wedo.preamble` / `wedo.instruction` | 3 |
| `ido.why` / `ido.intro` | 2 |

An outcome bullet says *"you will learn to X"*. It does not explain X. Worked examples:

| concept | credited definition | examples |
|---|---|---:|
| `precision`, `recall` | `evidence-dashboard.outcome[1]` | 7, 10 |
| `llm` | `streamlit-dashboards.outcome[0]` | 2 |
| `slicing` | `collections.outcome[0]` | **0** |
| `list-comprehension` | `iteration-summaries.outcome[5]` | **0** |
| `for` | `iteration-summaries.tagline` | 341 |
| `if` | `basics.S02-T2-A-DEMO.why` | 438 |
| `coverage` | `rpa-advanced.S24-T4-A-E3.preamble` | **0** |
| `terminal-shell`, `correlación` | `jobRelevance` | 4, 1 |

`precision` and `recall` matter most: S25 teaches `f1-score` at L3 with its own figure, and F1 is
the harmonic mean of two concepts whose only explanation is a bullet promising to teach them.

*Correction to an earlier campaign note:* no concept currently has a `selfcheck.*` first
definition. The old reductio (`distribución-normal` defined by a distractor) is no longer live —
that concept now has no definition and no uses at all.

### 1.2 Explained but never exemplified

36 concepts have a definition and **zero examples**. Worst by reach:

| concept | depth | sections | exercises | self-checks |
|---|---|---:|---:|---:|
| `variable` | L1 | 18 | 3 | 3 |
| `slicing` | L1 | 13 | 7 | 4 |
| `list-comprehension` | L1 | 12 | 5 | 0 |
| `f-string` | L1 | 10 | 14 | 1 |
| `intérprete` | L1 | 9 | 1 | 2 |
| `data-leakage` | L1 | 4 | **0** | 1 |
| `context-manager`, `decorador` | L1 | 2 | 0 | 0 |

### 1.3 Alias miss — the instrument does not speak the course's Spanish

`src/lib/glossary/terms.ts` declares `data-leakage` as term `'Data leakage'`, aliases
`'Data leakage'` and `'fuga de datos'`. The course writes the word **bare**, every time:
*"Eso es **leakage**"*, *"leakage temporal"*, *"leakage de identidad"*, *"anti-leakage"*,
*"scan de leakage"*.

| measure | value |
|---|---:|
| bare `leakage` occurrences, live sections | **215** |
| sections containing it | **8** (S17 29 · S30 19 · S32 53 · S33 7 · S36 32 · S39 7 · S47 67 · S19 1) |
| uses recorded by the concept map | **5** |
| sections recorded | 4 |
| examples / exercises recorded | 0 / 0 |

S32's real title is **"Feature engineering y pipelines sin leakage"** and it carries the word
across theory, iDo, weDo, youDo *and* selfCheck — the whole flywheel. The instrument sees none of
it. So the measure is blind in both directions: it certifies definitions that do not teach, and it
misses teaching that does.

A further 31 terms literally appeared in sections the map did not record (129 term/section
pairs). **Triaged 2026-10-03: zero defects.** The method matters, because two earlier attempts were
wrong. Rather than guess which field an occurrence sits in, ask the extractor what text it actually
saw — check each section's own event texts in `.fixer/events.json`, honouring `aliasIsAcronym` so
acronym aliases match case-sensitively:

| outcome | count |
|---|---:|
| correct exclusion — the string appears only in content the extractor never walks | 111 |
| looked like a matcher bug | 4 |
| **actually a bug** | **0** |

All four are correct behaviour, and three are guards this campaign built: `for` in S02/S03 matches
inside the book title *"Python for Everybody"*, which `concept_syntax.mts` blanks via
`PROPER_NAMES`; `correlaci-n` in S09 matches *"identificador de correlación"*, blanked by the same
guard; and `pipeline` in S01 sits in a `solution` event, which is `learner_visible: false` and
correctly gated out. The 111 concentrate in `requirements-txt` (46 sections) and `github` (21),
whose declared strings live in URLs and shell commands — confirmed cause: `resources` push
`${label} ${note}` and never `url`, and `environment`, `feedback`, `edgeCases`, `portfolioNote`,
`books` and `courses` are not walked at all.

Two corrections to earlier figures in this file's own history: a "253 real misses" count came from
a classifier that ignored `aliasIsAcronym`, so the alias `ABC` matched `abc` inside code fixtures
course-wide; and a "nearest preceding key" heuristic kept reporting Python identifiers inside code
strings (`missing`, `bool`, `ValueError`) as section fields. **The only genuine alias defect in the
course was `data-leakage`.**

One real extractor gap found during the triage, small and left open: `s.resources.docs` is walked
but `s.resources.books` and `s.resources.courses` are not
(`scripts/course_event_extractor.mts:427`). Book and course labels are learner-visible and
invisible to the measure.

---

## 2. Required-skills map

`python3 scripts/badge_readiness_audit.py` → 31 badges, 13 capstones, **5 failures**, all
`PREREQUISITE_TAUGHT_LATER`. Gate 2 in `src/lib/eligibility/engine.ts` is non-compensatory and has
no retroactive path, so each one is **permanently unreachable**, not merely late.

| badge | needs | taught by | badge's own span ends |
|---|---|---|---|
| `applied_analytical_reasoning` | `independent_data_preparation` | S18 | S10 |
| `integrated_python_ai_capstone_foundations` | `independent_data_preparation` | S18 | S13 |
| `integrated_python_ai_capstone_foundations` | `reliable_automation_development` | S24 | S13 |
| `integrated_python_ai_capstone_independent` | `applied_sql_query_development` | S37 | S26 |
| `integrated_python_ai_capstone_advanced_applied` | `applied_mlops_pipeline_delivery` | S43 | S39 |

Root cause: badges labelled `foundation` carry `required_sections` that cross into the next level
(`independent_data_preparation` S06–S18, `reliable_automation_development` S13–S24). **A learner
who finishes N1 cannot be awarded the N1 credential.** This is Q1 rows 1–5 in `OPEN_QUESTIONS.md`,
now with the mechanism named.

**13 of 31 badges rest on a critical competency the course barely teaches.** Each publicly claims
*"puertas críticas no compensables"*:

| competency | badges citing it | taught today |
|---|---:|---|
| `type_safety_production_hardening` | 5 | `mypy` appears **2×, S05 only**; `pyright` 0 |
| `leakage_prevention` | 5 | taught well in S32/S47 — but **0 examples, 0 exercises** recorded |
| `sql_competency` | 4 | `EXPLAIN QUERY PLAN`/`CREATE INDEX` in S29 (27) and S12 (5) |
| `selector_resilience` | 3 | `máquina de estados` 9× (S22, S26); `dispatcher`/`performer` **0** |

`evidence_grounded_ai_systems_capstone` — the final credential — cites **all four**.

Sound by contrast: **30 of 31 badges do require a project.** The one that does not,
`progress_phase0_walked`, explicitly non-claims competence. That is correct by design.

---

## 3. The July gap matrix cannot be used as written

`industry_alignment/curriculum_gap_matrix.json` (2026-07-28, 41 gaps) computed every
`exact_section_and_insertion_point` from the section **`id` slug**. The slugs describe an abandoned
pre-V3 curriculum; `index`, `title` and content describe the real one. So its placements are
systematically wrong:

| matrix says | that section really is | where the content really lives |
|---|---|---|
| "add leakage to S10 (sklearn)" | S10 *Módulos, packaging y CLI* | **S32** *Feature engineering y pipelines sin leakage* |
| "add hypothesis testing to S06 (numpy)" | S06 *Colecciones* | **S18** *EDA, estadística descriptiva e incertidumbre* |
| "sql tuning → S37 (dbt-bigquery)" | S37 *Profiling y rendimiento* | **S29** *SQL avanzado y modelado relacional* |
| "reframework → S24 (rpa-advanced)" | S24 *OCR y Document AI* | **S23** *Browser RPA* / **S26** *Orquestación* |
| "mypy → S15 (stdlib-deep)" | S15 *Pandas: ingesta* | **S05** *Funciones y contratos* / **S44** *CI/CD* |

**Any artefact keyed on section slugs is unverified until re-checked.** Its severities survive;
its locations do not.

---

## 4. Verified gap list

Live sections only, word-boundary anchored, orphaned files excluded (`s07-pandas`,
`s08-visualization`, `s09-sklearn`, `s10-testing`, `s11-advanced-topics` are on disk and imported
nowhere — all 14 `StandardScaler` hits were in them).

| industry skill | July verdict | verified today | real defect |
|---|---|---|---|
| `leakage_prevention` | absent | **present, 215 occurrences / 8 sections** | glossary alias + **0 exercises** |
| `sql_performance_tuning` | absent | **partly present**, S29 (27) + S12 (5) | depth + assessment, not absence |
| `python_type_safety` | absent | **absent** — `mypy` 2×, S05 only | genuine gap |
| `reframework` | absent | **partly** — state machine named, `dispatcher`/`performer` 0 | genuine gap |
| `hypothesis_testing` | absent | **near-absent** — `scipy` 3×, `valor p` 9×, CI 2×, all S18; no t-test/χ²/ANOVA/Bonferroni/statsmodels | genuine gap |
| `regression` | absent | **near-absent** — `LinearRegression` 0, `Ridge`/`Lasso` 0, `LogisticRegression` 2 (S33) | genuine gap |
| `feature_engineering` | absent | **near-absent as a named skill** — 3 mentions, S32 | genuine gap |

A probe that matched `ttest` inside **"attestation"** produced 101 false hits in S44 and briefly
made statistics look taught. Anchor every probe; a bare substring is not evidence.

### 4.1 Seven promises the glossary makes and the course never keeps

Zero occurrences anywhere in the 52 live sections:

| term | glossary points at | reality |
|---|---|---|
| `args-y-kwargs` | `basics` (**S02**) | 0 — promised in the foundation level |
| `namedtuple` | `architecture-ddd-decisions` (S40) | 0 |
| `hyperparameter-tuning` | `ai-apis-advanced` (S36) | 0 |
| `standardscaler` | `ai-apis-advanced` (S36) | only inside a scikit-learn **URL** |
| `feature-engineering` | `microservices` (S32) | 3 prose mentions, no teaching |
| `distribución-normal` | — | 0 uses, 0 definitions |
| `estimando` | `data-engineering` (S18) | 0 |

---

## 5. Market evidence, refreshed 2026-10-02

The July brief's load-bearing claims were re-tested, not assumed.

- **SQL remains the auto-reject filter.** Still #1 for analytics roles in 2026, required in 90%+
  of postings, "fail once, auto-reject"; the bar is joins + window functions + CTEs. Python
  appears in ~40% of entry postings and is rarely a hard junior requirement. → `sql_competency`
  stays non-compensatory. *Holds.*
- **Data leakage is an explicit interview filter** — "a reliability filter that many candidates
  fail". Prevention is examined as practice: pipelines so preprocessing stays inside folds,
  time-based splits, label windows, imputation fitted on train only. → the fix must be a
  **performance task**, not an MCQ. *Holds, and raises the assessment bar.*
- **Typing is now assumed, but the tooling moved.** Type hints went "from optional to
  near-universal"; production fluency means typed Python plus a checker in CI. mypy has lost its
  monopoly to Pyright in-editor and Pyrefly/`ty` in CI. → teach *typing discipline + a CI gate*,
  tool-agnostic. **Supersedes the July matrix's mypy-specific wording.**
- **GenAI literacy is now expected even for classical ML roles** — RAG, LLM evaluation, prompt
  engineering, embeddings retrieval are described as default 2026 skills. → PyArcana's S20/S25/S48
  line is correctly placed, not optional enrichment.
- **Projects beat certificates.** "Five end-to-end portfolio projects beat a certification wall";
  recruiters use them to separate coursework candidates from people who shipped. → the 13-capstone
  architecture is the right strategy, and the owner's "a badge must be demonstrated in a project"
  rule is market-aligned. *Strongly supports current design.*
- **RPA hiring stays vendor-centric** (UiPath/Blue Prism/Automation Anywhere). The Python-only
  scope is a defensible omission that must stay **disclosed** on the RPA badge; the durable
  patterns (state machine, dispatcher/performer, queue, exception taxonomy) are the transferable
  core and are the part worth teaching.

Sources are listed in §7.

---

## 6. Reproduce

```bash
npx tsx scripts/course_event_extractor.mts     # refresh .fixer/events.json
python3 scripts/concept_map.py                 # concept map + docs/concept-map/*.md
python3 scripts/badge_readiness_audit.py       # required-skills map (exits 1 on failures)
```

Caveats that change results, both found with the S25 test-suite session:
- Local `python3` is **3.9.6**; CI runs **3.12**. Every measurement in this file was taken with
  `PATH="/usr/local/opt/python@3.12/libexec/bin:$PATH"`. A Claude session keeps the PATH it
  captured at start, so the profile change does not reach a running session.
- **Suite counts, verified by the S25 test-suite session under 3.12 at `a56a4167`:** 416 Python
  tests passed — but only **53 of 70 files contributed**, because 17 collected zero tests. With
  those wired in: **485 adversarial Python** (3 allowlisted skips), **11** in `tests/`, **381**
  Node. Use those figures, not the 416.
- **CI never regenerates `concept_map.json`**, and the may-not-rise ratchet lives only in
  `gate.py`. Nothing in CI defends the zero: a commit reintroducing surprising uses passes CI.

Two of my own analyses were wrong before they were right, both from unanchored regex — `roc`
matching *p**roc**eso*, `nan` matching *fi**nan**zas*, `repl` matching *replace* (305 phantom
misses), and `ttest` matching *a**ttest**ation* (101 phantom statistics hits). Run every probe's
own counterexample before believing it.

---

## 7. Where the missing teaching goes

### 7.1 The grid is full, and it is pinned

Every one of the 52 sections has **exactly 4 topics, 8 subtopics (A/B), 24 We Do exercises
(E1–E3)**. The adversarial suite pins this per section with exact counts — e.g.
`test_s07_text_contract.py` asserts exactly 40 `subtopicId`s, 8 `demoId`s and 24 exercise ids
matching `S07-T[1-4]-[AB]`.

**So the July matrix's core proposal — "add a new theory block T5-A" to S06/S10/S15/S24/S37 — is
not structurally available.** It would break those contracts in every section it touched. This is
the single biggest reason its recommendations cannot be executed as written.

What *is* available, in increasing order of cost:

| route | cost | constraint |
|---|---|---|
| **(d) deepen in place** — more theory paragraphs, figures, callouts, self-check items inside existing subtopics | none | theory arrays are uncapped (S01 reaches `theory[18]`) |
| **(a) rescope a subtopic or exercise** — change what an existing T-slot teaches | none structurally | displaces whatever it taught; D14 and O8 are the precedent |
| **(b) extend the grid to T5** | relaxes a pinned invariant in ~52 test files | **owner decision** |
| **(c) add new sections** | renumbers badge `required_sections`, capstone gates, `prisma/seed.ts`, localStorage keys | **owner decision** |

**Recommendation: (d) + (a) only. No new sections, no T5.** Every verified gap has a
correctly-titled existing section to live in — a fact visible only when you read `title` instead
of the `id` slug. Stated plainly: this buys structural safety at the price of displacing some
existing exercise content, and §7.2 names what gets displaced.

### 7.2 Placement, per verified gap

Each row is theory → I Do → We Do → You Do → self-check → exam → capstone, because a badge is
only honest when the skill is *demonstrated in a project*.

| gap | section (by real title) | route | connects back from | connects forward to | capstone evidence |
|---|---|---|---|---|---|
| **Inferential statistics** — null/alt hypothesis, CI, t-test, χ², multiple comparisons | **S18** *EDA, estadística descriptiva e incertidumbre* — already holds `scipy` 3×, `valor p` 9×, CI 2× | (d) deepen + (a) rescope one T4 exercise | S16 data quality; S18's own descriptive stats | S33 baselines (is this model better?); S34 thresholds | CP-N2-B (gate S21) |
| **Regression** — linear/logistic, ridge/lasso, coefficient reading | **S33** *ML supervisado y baselines responsables* — holds `LogisticRegression` 2×, "regresión lineal/logística" 6× | (d) deepen | S18 inference (coefficients are estimates) | S34 calibration; S35 explainability | CP-N3-C (gate S39) |
| **Feature engineering as a named skill** | **S32** *Feature engineering y pipelines sin leakage* | (d) deepen + glossary wiring | S17 joins/reshape | S33 baselines; S47 serving | CP-N3-B (gate S34) |
| **Leakage, assessed** (coverage already good: 215 occurrences / 8 sections) | **S32** teach · **S39** audit | (a) rescope a You Do sub-task into a planted-leakage performance task | S32's existing pipelines | S47 train/serve skew | **CP-N3-C** *Responsible ML Case Triage* — exact fit |
| **Type safety + CI gate** (tool-agnostic) | **S05** *Funciones, contratos y descomposición* (annotations as contracts; the 2 `mypy` mentions are already here) · **S44** *CI/CD* (the checker as a gate) | (d) deepen both | S05's own contract framing | S42 schemas; S43 containers | CP-N4-A (gate S43) |
| **SQL performance** — EXPLAIN, indexes, N+1, measured improvement | **S29** *SQL avanzado y modelado relacional* — already holds 27 `EXPLAIN QUERY PLAN`/`CREATE INDEX` | (d) deepen | S12 APIs/SQL basics | S37 profiling; S46 data engineering | CP-N3-A (gate S30) |
| **RPA durable patterns** — state machine, dispatcher/performer, queue, exception taxonomy | **S26** *Orquestación y VP RPA + AI Analyst* (holds `máquina de estados`) · reinforce **S23** *Browser RPA* | (d) deepen + (a) rescope one S26 exercise | S23 selectors; S09 exceptions | S38 resilient workflows | **CP-N2-C** *VP RPA + AI Analyst* — exact fit |

Note how often the right home is the section the capstone already gates. That is not luck: the
curriculum was built level-by-level, and the July matrix's placements looked wrong only because it
read slugs.

### 7.3 The seven undelivered promises — deliver or retire

| term | recommendation | basis |
|---|---|---|
| `args-y-kwargs` | **move the promise S02 → S05, then deliver** | D9 forbids function complexity in S02; S05 is *Funciones y contratos* |
| `namedtuple` | **retire** | the course teaches `dataclass` heavily (S11, 189 occurrences) and `pydantic` (S05/S41/S42); `namedtuple` 0. Retiring it is honest, not a cut |
| `hyperparameter-tuning` | **deliver in S33** | belongs with CV and model selection, not S36 |
| `standardscaler` | **deliver in S32** | currently only a scikit-learn URL |
| `feature-engineering` | **deliver in S32** | §7.2 |
| `distribución-normal` | **deliver in S18** | rides along with the inference work |
| `estimando` | **retire** | an estimand is causal-inference vocabulary; causal inference is a deliberate P2 scope decision |

A glossary entry that names a section which never teaches the term is worse than no entry: the
learner is told where to go and it is not there.

---

## 8. Decisions that are the owner's, with my recommendation

1. **The five badge prerequisite inversions (§2).** Three routes: (i) re-label the offending
   badges' `capability_level` to where their evidence actually completes; (ii) narrow their
   `required_sections` to their own level and accept a narrower claim; (iii) move the teaching
   earlier so the span closes inside the level. *Recommend (i) for `independent_data_preparation`
   and `reliable_automation_development`* — their evidence genuinely completes in N2, so the label
   is what is wrong, not the curriculum. **This changes what a credential claims, so it is
   ask-first and I have not touched it.**
2. **The 13 badges citing barely-taught competencies (§2).** Recommend closing the teaching gap
   (§7.2) rather than dropping the citations — but until it closes, those badges overclaim.
   Interim options: hold issuance, or add a disclosed `non_claims` line. *Recommend the teaching
   fix, with no interim relabelling.*
3. **T5 / new sections.** Recommend neither (§7.1). If you want statistics taught at more depth
   than one deepened section can hold, that is the one case where a new section is arguable, and
   I would want to scope the renumbering blast radius first.
4. **Retiring `namedtuple` and `estimando`.** Deleting tracked glossary entries is ask-first.
5. **Exercise displacement.** Routes (a) in §7.2 rescope existing exercises in S18, S26 and S39.
   Naming which exercise dies is a per-section decision I will bring with the brief, not decide
   here.

## 9. Ratchets this audit owes

Debt that cannot be paid in one round is counted so it cannot grow:

| ratchet | opening value | meaning |
|---|---:|---|
| `SELF_CERTIFYING_DEFINITIONS_OWED` | 46 | first definition on a non-teaching surface |
| `UNEXEMPLIFIED_CONCEPTS_OWED` | 36 | defined, zero examples |
| `NEVER_EXPLAINED_OWED` | 7 | no definition anywhere |
| `ALIAS_DIVERGENCE_OWED` | 32 terms / 129 pairs | declared string appears in a section the map does not record |
| `FIGURE_DEBT_OWED` | 103 concepts / 270 figures | `figure_gap > 0` |

Each must be two-sided — failing above (listing offenders) and below ("lower it to N") — on the
`D10_OWED` precedent, so a fix is recorded rather than absorbed.

---

## 10. Sources — market evidence refreshed 2026-10-02

- Jobright, *Stop Rejection: The Data Analyst Job Strategy (2026)* — https://jobright.ai/blog/data-analyst-jobs-2026/
- LoopCV, *Data Analyst Skills 2026: The Complete List Employers Want* — https://www.loopcv.pro/skills/data-analyst/
- InterviewPal, *25 Machine Learning Interview Questions for 2026* — https://blog.interviewpal.com/25-machine-learning-interview-questions-for-2026-and-how-senior-candidates-actually-answer-them/
- Prachub, *ML Model Evaluation Interview Questions: Metrics, Leakage, and Calibration* — https://prachub.com/resources/machine-learning-model-evaluation-interview-questions-metrics-leakage-and-calibration
- doit.software, *Top 15 Machine Learning Engineer Skills for 2026* — https://doit.software/blog/machine-learning-engineer-skills
- CodeGym, *Modern Python 2026: The Complete Feature Adoption Guide* — https://codegym.cc/groups/posts/modern-python-2026-complete-guide
- dasroot.net, *What Maintainers Look for in a Python Project* (2026-03) — https://dasroot.net/posts/2026/03/what-maintainers-look-for-python-project/
- CVWon, *Data Scientist CV 2026: Template, Skills & Portfolio* — https://cvwon.com/blog/data-scientist-cv-2026
- topgenaijobs, *Entry Level Gen AI Jobs: How to Land Your First AI Role in 2026* — https://www.topgenaijobs.com/blog/entry-level-genai-jobs-guide
- Scaler, *10 AI Portfolio Projects to Land Your Dream Job (2026)* — https://www.scaler.com/blog/10-ai-portfolio-projects-to-land-your-dream-job-2026/
- KnowledgeHut, *How to Become RPA Developer* — https://www.knowledgehut.com/blog/web-development/rpa-developer

Secondary, repo-internal: `industry_alignment/industry_reality_brief.md` (2,279 lines, §0–§32),
`industry_skill_graph.json` (62 skill nodes, 5 roles, 4 levels, 8 critical competencies),
`curriculum_gap_matrix.json` (41 gaps — severities usable, locations not).

---

# Part 2 — exercise displacement, argued per slot (2026-10-02)

Owner decision 5: argue, with pros and cons, which exercises should be displaced to make room for
new teaching, measured against the three new sections.

**Two rules govern every nomination.** A slot may be taken only by an exercise that (a) duplicates a
neighbour's skill or is pre-solved by its own iDo demo, and never by one carrying a unique assessed
skill; and (b) every displaced exercise's `retrospective` forward-pointer, `selfCheck` and
`topicEvaluations` references are re-pointed in the same round, so nothing is orphaned.

**Structural facts that make this safe.** Across S18, S26 and S39, `selfCheck` contains **zero**
references to any exercise, demo or subtopic id — every item is keyed to theory. `topicEvaluations`
(loaded from `course-state/topic_evaluations/sNN_te.json`, not inline) references only *subtopic*
ids. So displacing an exercise cannot orphan an assessment; only removing a whole subtopic could.
The real coupling is prose: each subtopic chains "Siguiente (E2)" → "Luego (E3)" in its
`retrospective`, so rescoping an E2 means rewriting its predecessor's closing sentence.

## S18 — no displacement *required*, but one is strongly *justified*

The statistics teaching that would have evicted S18 exercises now lives in S19/S20, so the grid is
safe. But the inventory surfaced something better than a cost: **S18's two richest theory blocks
have no exercises at all.**

| block | teaches | exercises |
|---|---|---|
| `:247` "De la diferencia observada al experimento aleatorizado" (tagged `S18-T2-B`) | randomisation, counterfactual, self-selection, the estimand; demo prints `dif_autoseleccion 41.35` vs `dif_aleatorizada 5.5` | **0** |
| `:353` "Leer el resultado sin exagerarlo: valor p, guardrails y pruebas repetidas" (tagged `S18-T3-A`) | p-value interpretation, statistical vs practical significance, multiple comparisons, peeking; demo computes p via `math.erfc` and shows `falso_positivo_una_mirada 0.045` vs `..._diez_miradas 0.191` | **0** |

And `selfCheck` Q9 (self-selection, 41 PEN) and Q10 (p = 0.013, CI (1.18, 9.82)) test **only** those
two blocks. **Those two self-checks are already orphaned on the practice side** — the course assesses
them without ever having the learner do them.

Five S18 slots are single-token repairs, each pre-solved elsewhere:

| candidate | what it actually asks | pre-solved by |
|---|---|---|
| `S18-T2-B-E2` "d de Cohen" | `(10-13)/2` → `(13-10)/2`; `2` is a magic literal, no `s_pooled` | theory `:199`, demo `cohens_d 1.118`, selfCheck Q8 |
| `S18-T4-A-E1` | `print(evidencia["hipotesis"])` → `["pregunta"]` — one dict key | — (no computation at all) |
| `S18-T1-B-E1` | `med/m` → `m/med`; success criterion is literally `ratio 2.43` | `S18-T1-B-DEMO` prints `ratio_mean_median 2.43` |
| `S18-T2-A-E1` | `.count("Madrid")` → `.count("Lima")` — one string | subsumed by E3's `max_bias` |
| `S18-T3-B-E1` | `0.5` → `1.5` | E3 hands the learner `lo, hi` already computed with 1.5 |

**Recommendation: rescope two of them — `S18-T2-B-E2` and `S18-T4-A-E1` — to practise S18's own
orphaned theory.** E2 becomes a randomised-vs-self-selected comparison in T2-B; T4-A-E1 becomes a
p-value reading exercise in T3-A.

*Pro:* closes two already-orphaned self-checks, converts the section's two best theory blocks from
read-only into practised, and costs nothing unique — both candidates are a sign flip and a dict
lookup whose concepts are carried by theory, demo and self-check already.
*Con:* S18's `retrospective` chain must be rewritten in both subtopics, and T2-B loses its only
explicit mention of Cohen's d as an exercise (mitigated: d stays in theory `:199`, in the demo, in
selfCheck Q8, and is a youDo deliverable `d + n`).
*Alternative considered and rejected:* leave S18 untouched and let S19/S20 carry the practice. That
keeps Q9/Q10 orphaned in their own section, which is the defect the owner's flywheel rule exists to
prevent.

## S26 — two slots, both clean

| candidate | evidence | verdict |
|---|---|---|
| **`S26-T1-A-E2`** "Aristas lineales con zip de nodos" | the `zip` the title advertises is **already written in the starter**; the instruction says *"Deja `list(zip(nodes, nodes[1:]))`"* — *leave it alone* — and the only change from starter to solution is `print(len(edges))` → `print(len(edges), edges)` | **displace — this is not an exercise, it is a print statement** |
| **`S26-T4-A-E2`** "P0 si hay envío sin approve" | same subtopic, adjacent to E1, both are `print(LABEL if <one comparison> else 'ok')` and both defects are an inverted comparison | **displace — duplicate of E1** |

Both become the dispatcher/performer and durable-queue exercises (`dispatcher`/`performer` are at
**zero** occurrences course-wide, so this is genuinely new teaching that needs real slots).

*Pro:* T1-A-E2 carries no skill whatsoever, and T4-A-E2's policy fact (*"un solo envío ya es P0"*) is
independently carried by selfCheck and by the youDo's binding requirement *"Cero envíos sin
approve"*. *Con:* two `retrospective` sentences need rewriting; T4-A's E1→E2→E3 ramp shortens.
*Held in reserve, not taken:* `S26-T3-A-E1` (same `'pending'` predicate as E3, and
`S26-T3-A-DEMO` already contains E2's complete solution verbatim) and `S26-T2-B-E2`. Available if the
RPA teaching needs a third slot; not spent speculatively.

## S39 — a defect, not just a displacement opportunity

`S39`'s `weDo.intro` states the template outright: *"E1 repara un predicado de dominio; E2 separa
válido, adverso y missing; E3 demuestra fail-closed con tokens de error exactos."* In practice **all
eight E1 slots compile to the same shape**:

```python
<literal fixture dict/list>
meets = <boolean expression over those literals>
status = "PASS" if meets else "<REJECT_TOKEN>"
print("S39-Tn-X", status)
assert meets is True
```

There is no input, the fixture never varies, and **`assert meets is True` is unfalsifiable by
construction** — the learner edits a literal until a tautology holds. `AGENTS.md` names this exact
failure: *"Tautological tests are worse than no test: they convert an unverified claim into a green
check."* Eight exercises in a level-closing integrator section are built on one.

Worse, **six of the eight E1s are a strict logical subset of their own E2** — T1-A-E2's `assess()`
re-implements E1's predicate verbatim before adding a missing-key pre-check. And `S39-T3-B-E1` and
`S39-T3-B-E2` have **byte-identical solution functions**:

```python
def mode(drift_high, incident):
    if incident:   return "human_only"
    if drift_high: return "abstain_more"
    return "normal"
```

E1's own retrospective concedes it: *"Siguiente: tabla completa normal / drift / incident."*

**Recommendation: `S39-T3-B-E1` is the cleanest reclaim in the course** — byte-identical duplication,
and selfCheck Q4 (the only item covering T3-B) is satisfied by E2 and E3 independently. Take it for
the leakage-audit You Do sub-task.

**Raised separately, not actioned here:** the E1 tier's tautological-assert pattern is a quality
defect across 8 exercises in S39, independent of any displacement need. Fixing it means giving each
E1 a real input and a falsifiable assertion — a section round of its own, and **an owner decision**,
because it rewrites assessed exercises rather than reclaiming empty ones.

## Net

| section | slots reclaimed | for |
|---|---|---|
| S18 | 2 (rescoped to its **own** orphaned theory) | p-value and randomisation practice |
| S26 | 2 (3rd held in reserve) | dispatcher/performer, durable queue |
| S39 | 1 | leakage-audit You Do sub-task |
| S32 | **0** | nothing needed — all five leakage modes already taught |

Five slots, every one of them either not an exercise, a duplicate, or pre-solved by its own demo.
No slot carrying a unique assessed skill is touched.
