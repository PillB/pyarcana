# Section 33 — Curriculum Auditor Report

**Section identifier:** `section33` — `"advanced-models"`
**Live site:** https://pillb.github.io/pyarcana/ (Phase 2 — Senior, slot 33/52)
**Source:** `src/lib/course/sections/s33-advanced-models.ts` (2,180 lines)
**Auditor:** Curriculum Auditor (general-purpose subagent, S33)
**Method:** Stanford STORM + Graph/Loop/Harness engineering, with the shared `_GRAMMAR_SUBPLAN.md` (Fernández-Huerta, INFLESZ, WPS/SPW, LanguageTool `es`, pedagogical heuristics). Heuristic script: `_s33_grammar.py`. LT script: `_s33_lt.py`. Raw artifacts: `S33_prose.txt`, `S33_records.json`, `S33_metrics.json`, `S33_lt.json`, `S33_lt_input.txt`, `S33_findings.txt`.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section index | 33 (1-based) |
| Phase | 2 — Senior (sections 27–39) |
| Title (long) | ML supervisado y baselines responsables |
| Title (short) | Baselines ML responsables |
| Tagline | "comparación honesta que conserva el baseline determinista y demuestra cuándo el ML agrega —o no agrega— valor" |
| Estimated hours | 18 |
| Level | Competente a experto |
| Job relevance | Banca / fintech / ops de riesgo LatAm; workbench CP-N3-B con datos sintéticos; capstone de referencia |
| Topics | T1 framing + baseline (A,B) · T2 lineales regularizados (A,B) · T3 stumps + overfit (A,B) · T4 tracking + group CV (A,B) |
| Tabs | `theory` (9 subtopic blocks, 28 paragraphs, 9 callouts) · `iDo` (8 demos) · `weDo` (8 topics × 3 exercises = 24 exercises) · `youDo` (CP-N3-B capstone) · `selfCheck` (5 questions) · `resources` (7 docs + 2 books + 4 courses) |
| Bridge in | S32 (features `shared_phone`, `amount_z`, leakage-free z-score) |
| Bridge out | S34 (umbrales y desbalance), S35 (SHAP) |
| Prose records extracted | 528 (357 retained after filtering code/output keys); 247 Spanish-dominant, 110 English-dominant (mostly short option labels & code-adjacent fragments) |
| Sentences analyzed | 446 |

The 33rd slot in `COURSE_SECTIONS` (file `src/lib/course/index.ts:77`) is confirmed as `section33` from `./sections/s33-advanced-models`. The live site shows it on the homepage between sections 32 (Microservices) and 34 (Métricas y umbrales) with the same short title "Baselines ML responsables" (verified via `agent-browser read`). No discrepancy between source and rendered identity.

---

## 2. Executive Summary of Quality

**Score: 8.5 / 10**

**Verdict:** A *strong, well-engineered* Senior-phase section with excellent I Do / We Do / You Do fidelity, deliberate connective tissue to S32 and S34, and consistent contract-driven lab language (DEFECT / REJECT_ / REQUEST_ / MISSING: / CONTINUE). The pedagogical structure is the highlight: every theory subtopic has a paired `iDo` demo and three `weDo` exercises (guided → independent → transfer) that progressively widen the failure surface from "fix a defect" to "route three fixtures" to "decide and audit". The section deliberately teaches *responsible ML* — `beats_dummy=False` is treated as a valid logged result, not a failure — which is a meaningful pedagogical stance and a real differentiator from generic ML tutorials.

**Weaknesses are minor and concentrated in redaction:**
- One genuine **agreement error** ("prevalencia miradas" → "prevalencia mirada") in `weDo` feedback S33-T1-A-E3 (line 706).
- One **uppercase-sentence-start** lapse ("gap grande → REJECT_OVERFIT" after a period) in a `theory` callout (line 264) — callout-style abbreviation.
- A handful of **long sentences** (5 over 32 words; max 41) that could be split for cognitive-load relief, especially the `iDo` intro (38 words, single-sentence paragraph).
- Stylistic preferences the section systematically violates but that are widely accepted in modern technical Spanish: `vs` instead of `vs.` (10×), and plural acronyms `APIs` / `IDs` / `PRs` (6×) — RAE prefers invariable `API` / `ID` / `PR`.

**No meta-leaks. No TODO/FIXME. No design notes. No author-to-developer comments.** The source file contains zero `//` or `/* */` comments outside of intentional code-block bodies. The user-facing prose is pure teacher voice.

**Readability profile (Fernández-Huerta):**
- Mean FH = **74.8** (band: *bastante fácil*), Median = 75.5 — ideal for technical Spanish curriculum per the subplan's soft target (50–70 normal / bastante difícil is healthy; ~75 is on the easier side, appropriate for a section that introduces many English technical terms).
- WPS mean = **10.65** (well under the 15–32 soft ceiling), max = 38 (iDo intro).
- SPW mean = **2.02** (Spanish baseline ~2.0 — clean).
- Per-tab: `selfCheck` easiest (FH 82.5), `theory`/`iDo`/`weDo`/`youDo` clustered at FH 74–76 (consistent cognitive load), `resources` harder (FH 40.3, WPS 4.0 — but those are short citation labels, not prose).

---

## 3. Detailed Issue Registry

| # | Severity | Location (line / tab / key) | Evidence | Pedagogical impact |
|---|---|---|---|---|
| 1 | **M** | L706 / `weDo` / `feedback` S33-T1-A-E3 | "CONTINUE solo con framing limpio y **prevalencia miradas**; REQUEST_* pide evidencia; REJECT_* cierra el breach." | Agreement error: `prevalencia` (singular feminine) does not agree with `miradas` (plural). Intended meaning was "prevalencia mirada" (looked-at prevalence). Student sees a non-grammatical fragment in a feedback line; slightly undermines the careful teacher voice. |
| 2 | **L-M** | L264 / `theory` / `content` callout (T3-B) | "Umbral de gap unificado: 0.2. Fija seed en params. **gap grande** → REJECT_OVERFIT; sin seed → REQUEST_SEED." | After `params.` the sentence continues with lowercase `gap`. Callouts are abbreviated by design, but a sentence-initial lowercase token can read as a typo. Real but very low-impact. |
| 3 | **L** | 10 sites (see §3.1) | `vs` used without period (e.g. "y vs predicciones", "derrota acc=0.5 vs dummy 0.667", "Baseline vs modelo"). | Strict RAE prefers `vs.`; modern Spanish (especially tech) accepts `vs`. Stylistic preference, not an error. |
| 4 | **L** | 6 sites | Plural siglas: `APIs` (4×: L30/L31/L206/L489), `IDs` (L173), `PRs` (L237). | RAE: acronyms are invariable in plural (`las API`, `los ID`, `los PR`). Tech-Spanish accepts `-s`. Stylistic. |
| 5 | **M** | L346 / `iDo` / `intro` | "Te muestro el camino completo: framing honesto, baseline y costo, logística con L2, coeficientes escalados, stump con voto, control de overfit, tracking aunque pierdas al dummy, y group CV por entidad — todo sobre fixtures sintéticos de Red Andina." | 38-word single-sentence paragraph. The intro is a list masquerading as a sentence; splitting into 2 sentences (overview + list) would lower cognitive load and avoid the `paragraph_single_long_sentence` heuristic flag. |
| 6 | **M** | L764 / `weDo` / `instruction` S33-T1-B-E1 | "S33-T1-B-E1 · **Calcula el dual baseline** sobre `y=[1,1,0]` y `x=[1.0,1.0,0.0]`: (1) dummy majority con c_fp=1, c_fn=5 → `dummy_acc==0.667` y `cost==1` (un FP); (2) regla `x>=1` → `rule_acc==1.0`." | 41 words — the longest sentence in the section. Hard to parse on first read. The `(1) ... ; (2) ...` structure already segments the content; converting to a real list would help. |
| 7 | **M** | L206 / `theory` / `paragraphs` T3-A | "Un **stump** es un árbol de profundidad 1: una sola pregunta del tipo `x >= thr`. Varios stumps con **voto mayoritario** ilustran la idea de ensamble sin APIs pesadas. **Random Forest** (bagging de árboles) y **boosting** (reponderar residuos o errores) son *familias* más ricas; aquí solo practicamos stump + vote y el control de profundidad — suficiente para el workbench y para no inventar APIs no enseñadas." | 36-word sentence in the middle; "reponderar residuos o errores" is a typo for "reponderar" — wait, the verb is "reponderar"; this is a typo for "reponderar" → "re-pesar" / "reponderar" is non-standard. The standard verb in boosting is "reponderar" (re-weight) — RAE does not register "reponderar". Real issue: should be "reponderar" → "re-pesar" / "reasignar pesos a" / "ponderar de nuevo". |
| 8 | **M** | L569 / `weDo` / `intro` | "En cada tema reparas un cálculo defectuoso (prevalencia, dummy+costo, sigmoid/L2, stump, gap, beats, n_groups), luego enrutas fixtures válidos/adversos/altantes, y cierras con fallo cerrado: continuar, rechazar o pedir evidencia — sin inventar valores por defecto." | 34-word sentence; FH 29.2 (the lowest FH among real prose paragraphs in the section). Hard to scan; the inline list of seven failure modes inside parens compresses too much. |
| 9 | **L** | L30 / `theory` / `paragraphs` T1-A (glossary) | Single 98-word paragraph containing 9 dictionary entries (Baseline, Target, Horizonte, beats_dummy, Group CV, L2, Stump, Seed). | Pedagogically a glossary paragraph is fine; it just *looks* dense. FH = 79.6 (still in "bastante fácil"). Consider rendering as a definition list (the prose itself does not need rewriting). |
| 10 | **L** | L706 / `weDo` / `feedback` S33-T1-A-E3 | (same line as #1) `REQUEST_*` / `REJECT_*` — wildcard tokens in feedback prose. | Pedagogically intentional (matches the `REQUEST_HORIZON` / `REJECT_FRAUD_TARGET` family). Flag as intentional, not an issue. |
| 11 | **L** | L75 / `theory` / `content` (callout T1-A) | "Cierra unit + target needs_review_* + horizon > 0. Si el nombre trae fraud → REJECT_FRAUD_TARGET. Si falta horizon → REQUEST_HORIZON (no inventes el valor)." | Imperative chain in one paragraph; FH still healthy. Style is consistent with other callouts. Not an issue. |
| 12 | **L** | L1262 / `weDo` / `instruction` S33-T2-B-E3 | "S33-T2-B-E3 · Fallo cerrado: válido → `CONTINUE`, unscaled/causal → `REJECT_UNSCALED_COEF`, sin `scaled` → `REQUEST_SCALE_FLAG`." | Sentence FH = -7.4 (very low) because the sentence is short and overloaded with code-y tokens. The structure is intentional (transfer exercise) but the LT-style sentence fragment is dense. Consider adding a leading clause: "Aplica el fallo cerrado al ranking de coeficientes: …". |
| 13 | **L** | L1853 / `weDo` / `hints` S33-T4-B-E2 | "e1 se repite: n_groups es 3, no 4. mean con round(..., 3) es 0.65." | "mean con round(..., 3) es 0.65" — `mean` is English noun functioning as Spanish subject. Standard tech-Spanish calque. Acceptable. |
| 14 | **L** | Multiple `weDo` `hint`/`hints` | `prevalence = round(sum(y)/len(y), 3); fraud_name = "fraud" in target.lower(); exige fraud_name is False y horizon > 0.` | Hints mix Python expressions with Spanish imperatives ("exige"). The code-Spanish hybrid is intentional and matches the course style (also seen in S03/S07/etc.). Not an issue per se, but creates LT false positives. |
| 15 | **L** | L208 / `theory` / `paragraphs` T3-A | `0.1 entonces 0, 0.4 entonces 1; votos [1,0,1] → majority 1.` | The arrow `→` and middle dot `·` are used heavily in theory paragraphs. Stylistically consistent; not an error. |
| 16 | **L** | L318 / `theory` / `paragraphs` T4-B | "El **análisis de errores** mira el slice con más FN (p. ej. un tipo de par sintético), no solo la media global — umbrales y desbalance se profundizan en S34." | "slice" is a tech anglicism. Acceptable in ML context. |
| 17 | **L** | L48 / `theory` / `paragraphs` T1-A | "Si falta el horizonte, el flujo pide evidencia (`REQUEST_HORIZON`) en lugar de inventar el valor por defecto." | "valor por defecto" is good Spanish; some Peruvian Spanish readers might prefer "el valor predeterminado". Both are correct. |

### 3.1 Detail: `vs` without period — 10 instances

| Line | Tab | Key | Snippet |
|---|---|---|---|
| 84 | theory | paragraphs | "su costo se deriva de y **vs** predicciones" |
| 126 | theory | content | "deriva el costo de y **vs** pred" |
| 767 | weDo | hints | "costo desde y **vs** dummy" |
| 768 | weDo | hints | (same hint duplication) |
| 772 | weDo | feedback | "se calculan de y **vs** pred" |
| 825 | weDo | hints | "acc y cost desde y **vs** dummy" |
| 826 | weDo | hints | (same hint duplication) |
| 1744 | weDo | instruction | "derrota acc=0.5 **vs** dummy 0.667" |
| 1984 | youDo | title | "Baseline **vs** modelo: framing + tracking (CP-N3-B)" |
| 1989 | youDo | objectives | "Dummy y costo derivados de y **vs** predicciones" |

(Plus `reg y evaluación` at L2161 where `reg` is short for *regularización* — LT suggests `reg.`)

### 3.2 Detail: plural acronyms — 6 instances

| Line | Token | Strict RAE form |
|---|---|---|
| 30 | `APIs pesadas` | `API pesadas` |
| 31 | `APIs pesadas` (next paragraph) | `API pesadas` |
| 173 | `IDs crudos` | `ID crudos` |
| 206 | `APIs pesadas` | `API pesadas` |
| 237 | `PRs del workbench` | `PR del workbench` |
| 489 | `APIs no enseñadas` | `API no enseñadas` |

---

## 4. Meta-Leak Report

**Result: NO meta-leaks detected.**

I scanned the source for `TODO`, `FIXME`, `XXX`, `moved from section`, `mover desde`, `design note`, `nota interna`, `nota del autor`, `internal instruction`, `placeholder`, `insert (here|text)`, `copy[- ]paste`, `system prompt`, `developer (comment|note)`, `this section was (gen|writ|mov)`, `based on the (gold|early) section`, `earlier section`.

The only regex hit (`\bTODO\b` with `re.I`) was the Spanish common word **"todo"** inside the `iDo` intro phrase "...**todo** sobre fixtures sintéticos de Red Andina." — a *false positive* (case-insensitive match on the Spanish word "todo"). Confirmed not a meta-leak.

The source file contains zero `//` line comments and zero `/* */` block comments outside of intentional Python code-block bodies (which are learner-facing code, not authoring residue). All internal identifiers (`demoId`, `subtopicId`, `kind`, `environment`) are properly scoped to data fields and never appear in user-facing prose. The `DEFECT` / `REJECT_*` / `REQUEST_*` / `MISSING:` / `CONTINUE` tokens are intentional pedagogical vocabulary, not design notes.

No leaked author-to-developer instructions. No "moved from section X" residue. No prompt-engineering scaffolding. The user-facing voice is consistently the teacher ("Te muestro…", "Practicamos…", "Calcula…", "Construye…").

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Phase | Count | Structure | Verdict |
|---|---|---|---|
| **I Do** | 8 demos (one per subtopic T1-A through T4-B) | Each demo has `demoId`, `subtopicId`, `environment: "local-python"`, `description`, `code`, `output`, `why` | Excellent. Every demo corresponds 1-to-1 with a theory subtopic and uses the same fixtures (`y=[1,1,0]`, `x=[1.0,1.0,0.0]`, `seed=42`, etc.). The `why` field is uniformly present and short (10–12 words), tying each demo to a responsible-ML principle. |
| **We Do** | 24 exercises (8 topics × 3 exercises) | Each topic follows a **guided → independent → transfer** progression: E1 = fix a defect (`kind: "guided"`), E2 = route three fixtures (`kind: "independent"`), E3 = closed-failure decision (`kind: "transfer"`). | Excellent. This is one of the strongest We Do designs in the course. The three-tier progression explicitly widens the failure surface: from "repair one calculation" → "judge valid/adverse/missing fixtures" → "decide CONTINUE/REJECT/REQUEST with reasoning". Each exercise ships `starterCode` + `solutionCode` + `output` + `assert` lines that lock the contract. The `feedback` lines correctly reinforce the responsible-ML thesis (e.g. "beats_dummy False no invalida el run; metrics vacías sí"). |
| **You Do** | 1 capstone (CP-N3-B) | `title`, `context`, `objectives` (4), `requirements` (4), `starterCode` (full pipeline), `portfolioNote`, `rubric` (7 criteria incl. bonus) | Strong. The capstone integrates all four subtopics (framing → dummy+costo → stump → run log → group CV). The starter includes a deliberate defect (`thr = 0.9 # DEFECT: umbral demasiado alto`) so the learner must repair before producing valid output. Rubric includes correctitud técnica (20%), privacidad / sin PII (20%), and a bonus for `beats_dummy + group CV + seed en params`. |
| **Self Check** | 5 MCQs | `question`, `options` (4), `correctIndex`, `explanation` | Excellent. Each MCQ targets a *conceptual* failure mode (target naming, baseline-first, scaling requirement, group CV leakage, tracking validity of `beats_dummy=False`). Explanations are short and reinforce the section's responsible-ML thesis. |

### 5.2 Connective tissue

**Bridge from S32 (features):** Explicit and consistent. The theory mentions "features de S32 ya sin leakage (p. ej. `shared_phone`, `amount_z`)" (L32), "sobre un score de S32" (L82), "z-score de S32" (L171), "Puente desde S32: reutiliza columnas como `shared_phone` y `amount_z` ya limpias de leakage" (L173). The `weDo` exercises reuse S32 features in code (`shared_phone=0.8`, `amount_z=-0.2`).

**Bridge to S34 (umbrales y desbalance):** Explicit. "umbrales y desbalance se profundizan en S34" (L318) and "SHAP se reserva a S35" (L2096).

**Bridge to S27 (Async/concurrency) & S39 (Case Triage N3):** The `youDo` capstone is labeled `CP-N3-B`, consistent with the section's "workbench de Red Andina" framing and the phase capstone naming convention (CP-N3-A would be S32, CP-N3-B is S33, CP-N3-C presumably S34, with the phase integrator at S39 "Case Triage N3").

**Internal cross-references:** Within the section, "T1-A", "T1-B", "T2-A", "T2-B", "T3-A", "T3-B", "T4-A", "T4-B" are used consistently (e.g. L83 "dummy de T1-B", L134 "dummy de T1-B antes de celebrar el modelo", L207 "dummy de T1-B"). This is a strong graph-internal edge structure that lets learners navigate the section.

### 5.3 Cognitive load & progressive disclosure

| Subtopic | Concepts introduced | Code lines (theory) | Callout | Lab complexity |
|---|---|---|---|---|
| T1-A | unit, target, horizon, prevalence, fraud_name | 11 lines (framing.py) | "Qué escribir ahora" | Low (1 print + 1 conditional) |
| T1-B | dummy majority, regla simple, FP/FN cost, has_baseline | 27 lines (baseline.py) | "Qué escribir ahora" | Medium (two functions) |
| T2-A | sigmoid, threshold, L2 al cuadrado | 16 lines (logistic.py) | "Qué escribir ahora" | Medium |
| T2-B | coef scaling, |coef| ranking, causal=False | 11 lines (coefs.py) | "Qué escribir ahora" | Low |
| T3-A | stump, majority vote, depth control | 9 lines (stump.py) | "Qué escribir ahora" | Low |
| T3-B | train−valid gap, overfit, seed | 12 lines (overfit.py) | "Qué escribir ahora" | Low |
| T4-A | run_id, params, metrics, beats_dummy | 21 lines (tracking.py) | "Qué escribir ahora" | Medium |
| T4-B | Group CV, n_groups, mean_fold, error analysis | 9 lines (group_cv.py) | "Qué escribir ahora" | Low |

Progressive disclosure is sound: T1 establishes the framing & baseline; T2 introduces the simplest interpretable model (logistic with L2); T3 adds the simplest tree (stump) and overfit control; T4 closes with experiment tracking and group CV. Each step adds **one** major concept. The dictionary paragraph at T1-A (L30) front-loads all nine terms — this is the only cognitive-load hotspot and could be split (see Issue #9).

The `weDo` exercise progression within each topic (guided → independent → transfer) is a textbook application of **scaffolding fading**: E1 shows the defect and the contract; E2 removes the contract pre-fill and adds routing; E3 generalizes to a *decision* (CONTINUE/REJECT/REQUEST) rather than a pass/fail. This is high-quality curriculum design.

### 5.4 Exercise and exam quality

- **Starter code defects are real and instructive.** Examples: T1-A-E1 starter uses `len(y)-1` (off-by-one) and `fraud_name is True` (inverted); T2-A-E1 starter uses L1 instead of L2 and `thr=0.5` instead of `0.6`; T3-A-E1 starter uses `x < thr` (inverted) and `sum(votes) > len(votes)` (wrong majority formula). Each defect is a plausible real-world bug — students learn debugging patterns, not trivia.
- **Solution codes include assertions.** Every `solutionCode` ends with `assert meets_contract is True` or equivalent — this turns the exercise into a self-verifying test, reinforcing the contract-driven testing theme from S11.
- **Edge cases are documented.** Every `weDo` exercise lists three `edgeCases`: "falta X", "fixture adverso: Y", "CASO-LIM-033-X es sintético" — explicit about the synthetic nature of the data (privacy-responsible).
- **Self-check explanations reinforce the thesis.** E.g. self-check Q5 explanation: "Tracking responsable registra también cuando el modelo no supera al dummy; no se exige beats_dummy=True para validar el log. REJECT_UNLOGGED_RUN es para metrics vacías o run_id vacío." — this is a *concise restatement* of the responsible-ML principle.

### 5.5 Consistency with roadmap & prior sections

- **Privacy posture:** Consistent with the course-wide rule (no PII, no fraud labels, sintético only). The section repeatedly says "Datos sintéticos only" (L39), "es sintético" (every edgeCase), "Sin label de fraude ni PII real" (L1996).
- **Caso-LIM-033:** Consistent with the course's Lima case-study naming convention.
- **CP-N3-B:** Consistent with the phase-2 capstone numbering (CP-N3-A through CP-N3-C across S32-S34, with the phase integrator at S39).
- **Contract language:** `REJECT_*`, `REQUEST_*`, `MISSING:`, `CONTINUE`, `PASS`, `DEFECT` — uniform across all 24 exercises. This vocabulary is established earlier in the course (visible in S03, S07, S10, S11, S13).
- **Code style:** Pure standard-library Python (no sklearn in starter/solution code), with sklearn linked only in `resources`. Consistent with the section's promise (L33: "Usamos Python estándar (sigmoid, stump, seed) antes de APIs pesadas").

### 5.6 Comparison with best-in-class external materials

- **Google Rules of ML** (cited in resources L2138): The section's "baseline primero, métricas honestas" thesis is a faithful, applied restatement of Google's Rules #1–#4. The section explicitly cites this source (L31).
- **ISL (Introduction to Statistical Learning)** (cited L2143, L2154): The treatment of L2 regularization, scaling, and coefficient interpretation is consistent with ISL Chapter 3-4 (though simplified to a 2-feature synthetic example).
- **sklearn DummyClassifier / LogisticRegression / GroupKFold** (cited L2118-L2136): The section implements these from scratch in pure Python and only *links* sklearn in resources. This is pedagogically sound (learn the math first, reach for the library second) and is a deliberate teaching choice consistent with how S03-S13 taught pandas/numpy concepts.
- **MLflow Tracking** (cited L2148): The `run_id`, `params`, `metrics`, `beats_dummy` minimum-run schema is a simplified MLflow run contract. Good bridge to MLOps practices.
- The "beats_dummy=False is a valid run" stance is more rigorous than most introductory ML material (which often silently drops losing experiments). This is a **strong differentiator** and aligns with responsible-AI / Reproducible ML best practices.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite (Theory, I Do, We Do, You Do, Self Check)

Below I rewrite only the sentences flagged as M-level or higher. For each, I give the **before** (verbatim from source, with line), the **after** (proposed rewrite), and the **reason**.

### 6.1 Theory

#### T1-A · paragraph 1 (L30) — glossary
**Before:** "**Diccionario de la sección** (léelo antes de modelar). **Baseline:** ancla mínima — dummy majority ("siempre la clase más frecuente") o regla simple (`x >= thr`). **Target:** lo que intentas priorizar (aquí `needs_review_7d`), **nunca** un veredicto de fraude. **Horizonte:** ventana temporal del target (p. ej. 7 días). **beats_dummy:** si accuracy (u otra métrica) del modelo supera al dummy; puede ser **False** y el run sigue válido. **Group CV:** validación cruzada que no mezcla la misma entidad entre train y valid. **L2 (al cuadrado):** penalización Σw² que frena coeficientes enormes. **Stump:** árbol de profundidad 1. **Seed:** semilla que hace reproducible el experimento."

**After (option A — keep as paragraph, minor polish):**
> "**Diccionario de la sección** (léelo antes de modelar):
> • **Baseline**: ancla mínima — *dummy majority* ("siempre la clase más frecuente") o regla simple (`x >= thr`).
> • **Target**: lo que intentas priorizar (aquí `needs_review_7d`); **nunca** un veredicto de fraude.
> • **Horizonte**: ventana temporal del target (p. ej. 7 días).
> • **beats_dummy**: indica si la *accuracy* (u otra métrica) del modelo supera al *dummy*; puede ser **False** y el run sigue siendo válido.
> • **Group CV**: validación cruzada que no mezcla la misma entidad entre *train* y *valid*.
> • **L2 (al cuadrado)**: penalización Σw² que frena coeficientes enormes.
> • **Stump**: árbol de profundidad 1.
> • **Seed**: semilla que hace reproducible el experimento."

**Reason:** The 98-word single-paragraph glossary is dense; converting to a bulleted definition list drops the cognitive load without changing content. WPS per item drops from ~10 to ~5. (No grammar fix — pure presentation.)

#### T1-A · paragraph 2 (L31)
**Before:** "Google *Rules of ML* lo resume así: lanza primero con **heurística o baseline**, mide el valor, y solo después sube la complejidad. En muchos equipos se desplegó un modelo opaco que **no** superaba a "siempre la clase mayoritaria": meses de ingeniería, cero valor en cola. Esta sección no empuja stacking por deporte: define **unidad de scoring**, **target** y **horizonte**, y conserva un **baseline determinista** antes de cualquier modelo en el workbench de Red Andina (CP-N3-B)."

**After (no rewrite needed — sentence is grammatically correct; 30-word sentence is at the soft ceiling but flows well).**

#### T1-A · paragraph 3 (L32)
**Before:** "Producto incremental: comparación **honesta** sobre el target sintético `needs_review_7d`. Entrada: features de S32 ya sin leakage (p. ej. `shared_phone`, `amount_z`). **Espina numérica del lab** (misma y=[1,1,0] o fixtures del demo): dummy majority ≈0.667 · regla simple y stump se calculan · logística con L2 reportada · `beats_dummy` True o False según métrica. Un experimento que **no** supera al dummy se registra y documenta — no se borra."

**After:** "Producto incremental: comparación **honesta** sobre el target sintético `needs_review_7d`. Entrada: *features* de S32 ya sin *leakage* (p. ej. `shared_phone`, `amount_z`). **Espina numérica del lab** (misma `y=[1,1,0]` o *fixtures* del demo): *dummy majority* ≈0.667; la regla simple y el *stump* se calculan; la logística con L2 se reporta; `beats_dummy` queda en True o False según la métrica. Un experimento que **no** supera al *dummy* se registra y documenta — no se borra."

**Reason:** The middle bullet list uses `·` as a separator which can be hard to scan; switching to `;` and adding articles ("la regla simple y el stump") improves Spanish flow without losing the technical density. (Optional polish, not a fix.)

#### T1-A · paragraph 4 (L33)
**Before:** "Orden de la sección: **T1 framing y baseline** → **T2 lineales regularizados** → **T3 stumps y control de overfit** → **T4 tracking y group CV**. Usamos Python estándar (sigmoid, stump, seed) antes de APIs pesadas; en recursos quedan sklearn y Rules of ML. Predicción de prioridad de revisión ≠ veredicto de culpa."

**After (no rewrite needed — clean, dense, intentional).**

#### T1-A · callout content (L39)
**Before:** "Sin baseline documentado no se promociona modelo. Target needs_review_* con horizonte explícito (no fraud). Datos sintéticos only. Un run con beats_dummy=False se loguea igual. Anota prevalencia antes del fit."
**After (no rewrite needed — callout style is intentionally abbreviated; consistent with all 9 callouts).**

#### T1-B · paragraph 1 (L82)
**Before:** "El **dummy majority** (predecir siempre la clase más frecuente) y una **regla simple** (p. ej. `x >= thr` sobre un score de S32) anclan el valor mínimo del workbench. El costo `fp * c_fp + fn * c_fn` traduce errores a **impacto de cola**, no a moral de fraude: un FN caro significa un caso que debió revisarse y no se priorizó a tiempo."

**After (no rewrite needed).**

#### T1-B · paragraph 3 (L84)
**Before:** "En `CASO-LIM-033`: con `y=[1,1,0]` el dummy predice 1 y acierta 2/3 (acc≈0.667); su costo se deriva de y **vs** predicciones (1 FP con c_fp=1 → costo 1). La regla `x >= 1` sobre `x=[1,1,0]` produce pred `[1,1,0]` y accuracy **1.0**: a veces la heurística ya gana al dummy. Documenta **ambos** anclajes en el log **antes** del modelo lineal o del stump."

**After (only the `vs` → `vs.`):** "En `CASO-LIM-033`: con `y=[1,1,0]` el *dummy* predice 1 y acierta 2/3 (acc≈0.667); su costo se deriva de y **vs.** predicciones (1 FP con c_fp=1 → costo 1). La regla `x >= 1` sobre `x=[1,1,0]` produce *pred* `[1,1,0]` y *accuracy* **1.0**: a veces la heurística ya gana al *dummy*. Documenta **ambos** anclajes en el log **antes** del modelo lineal o del *stump*."

#### T2-A · paragraph 3 (L135)
**Before:** "En `CASO-LIM-033`: σ(0)=0.5 y σ(0.2)≈0.55. Con w=1, b=0, x=0.2 y thr=0.6 la pred es **0** (0.55 no alcanza el umbral). Si thr fuera 0.5, la misma p daría pred 1: el umbral es una decisión de producto, no magia del modelo. La penalización L2 de w=[1,2] como Σw² es 5 (no confundir con √Σw²). Si L2 reportada es 0 con muchas features, el gate marca `REJECT_UNREGULARIZED`."

**After (no rewrite needed — 81 words across 5 short sentences, FH=118.5, very readable).**

#### T2-B · paragraph 3 (L173)
**Before:** "Puente desde S32: reutiliza columnas como `shared_phone` y `amount_z` ya limpias de leakage (sin target futuro ni **IDs** crudos en el feature set). Si en S32 exportaste una tabla con esas columnas z-score, aquí solo las **rankeas por |coef|** cuando `scaled=True`. En `CASO-LIM-033`, `shared_phone=0.8` (positivo) ordena arriba; se imprime el ranking con `causal=False` para no sobre-interpretar el score de cola como parentesco o fraude."

**After (only `IDs` → `ID`):** "Puente desde S32: reutiliza columnas como `shared_phone` y `amount_z` ya limpias de *leakage* (sin *target* futuro ni **ID** crudos en el *feature set*). Si en S32 exportaste una tabla con esas columnas z-score, aquí solo las **rankeas por |coef|** cuando `scaled=True`. En `CASO-LIM-033`, `shared_phone=0.8` (positivo) ordena arriba; se imprime el *ranking* con `causal=False` para no sobre-interpretar el *score* de cola como parentesco o fraude."

#### T3-A · paragraph 1 (L206) — typo "reponderar"
**Before:** "**Random Forest** (bagging de árboles) y **boosting** (reponderar residuos o errores) son *familias* más ricas; aquí solo practicamos stump + vote y el control de profundidad — suficiente para el workbench y para no inventar APIs no enseñadas."

**After:** "**Random Forest** (*bagging* de árboles) y **boosting** (que repone o reasigna pesos a los residuos o errores) son *familias* más ricas; aquí solo practicamos *stump* + *vote* y el control de profundidad — suficiente para el *workbench* y para no inventar **API** no enseñadas."

**Reason:** "reponderar" is not a RAE-registered verb. The standard ML term is "re-weight" → in Spanish either "reasignar pesos a" or "repensar / reponderar" (colloquial). The cleanest rewrite is "que repone o reasigna pesos a los residuos". This is the only true *vocabulary* error in the section.

#### T3-A · paragraph 2 (L207)
**Before:** "Recibes una lista `X`, el umbral del stump y una lista de votos de predictores débiles. Sales con las predicciones del stump y el majority vote. `depth_unlimited=True` sin validación es breach de control. Antes de declarar victoria del ensamble, compara su accuracy **contra el dummy** de T1-B (y, si aplica, contra la regla)."

**After (no rewrite needed).** The LT flag for `depth_unlimited=True` starting with lowercase after a period is a false positive — `True` is the end of a code span, not a sentence boundary.

#### T3-B · callout content (L264) — uppercase sentence start
**Before:** "Umbral de gap unificado: 0.2. Fija seed en params. gap grande → REJECT_OVERFIT; sin seed → REQUEST_SEED."

**After:** "Umbral de *gap* unificado: 0.2. Fija *seed* en *params*. Si el *gap* es grande → REJECT_OVERFIT; si falta *seed* → REQUEST_SEED."

**Reason:** After "params." the original continues with lowercase "gap grande". Capitalizing "Si" and turning the fragment into a conditional clause reads as proper Spanish without losing the callout's terse style.

#### T4-A · paragraph 1 (L271)
**Before:** "Un **run mínimo** registra `run_id`, `params`, `metrics` y la bandera `beats_dummy`. Sin log, "mejoré el modelo" es anécdota. **Importante:** un run que **no** supera al dummy sigue siendo válido si está bien logueado: la comparación honesta es el producto, no un score de vanidad. En ops de riesgo, un experimento que **pierde** al dummy y se documenta evita lanzar complejidad inútil a producción."

**After (no rewrite needed — 63 words across 4 sentences, FH=75.5).**

#### T4-B · paragraph 1 (L316)
**Before:** "**Group CV por entidad** evita leakage entre folds: la misma entidad no debe aparecer en train y en valid del mismo split. Un random split clásico infla métricas cuando hay múltiples filas por entidad (pares, cuentas, dispositivos) — el modelo "recuerda" al par en valid porque ya lo vio en train."

**After (no rewrite needed).**

#### T4-B · paragraph 3 (L318)
**Before:** "En `CASO-LIM-033`: mean de `[0.6, 0.7, 0.65]` con `round(..., 3)` es **0.65**; con entities `e1,e1,e2,e3` hay **3** grupos. El **análisis de errores** mira el slice con más FN (p. ej. un tipo de par sintético), no solo la media global — umbrales y desbalance se profundizan en S34."

**After (no rewrite needed — strong closing with explicit S34 bridge).**

### 6.2 I Do

#### iDo · intro (L346) — paragraph_single_long_sentence
**Before:** "Te muestro el camino completo: framing honesto, baseline y costo, logística con L2, coeficientes escalados, stump con voto, control de overfit, tracking aunque pierdas al dummy, y group CV por entidad — todo sobre fixtures sintéticos de Red Andina."

**After:** "Te muestro el camino completo sobre *fixtures* sintéticos de Red Andina: (1) framing honesto y baseline con costo; (2) logística con L2 y coeficientes escalados; (3) stump con voto y control de overfit; (4) tracking aunque pierdas al *dummy*; y (5) group CV por entidad."

**Reason:** The 38-word single sentence becomes a 5-item enumerated list (mirroring the section's T1–T4 structure), reducing cognitive load and matching the section's own ordering convention.

#### iDo · demo S33-T1-B `why` (L410) — agreement false positive, no fix needed
**Before:** "Sin dual baseline (dummy + regla) y costo calculados, el ML no demuestra valor incremental en el workbench."
**Note:** LT flags "calculados" → should agree with singular "costo" only. But the subject is the conjunction "dual baseline (dummy + regla) y costo" — mixed-gender coordination takes masculine plural agreement per RAE, so "calculados" is correct. **No rewrite.** Same for `description` L375: "accuracy y costo derivados" — correct.

### 6.3 We Do

#### weDo · intro (L569) — 34-word sentence, FH 29.2
**Before:** "Practicamos baselines responsables del workbench CP-N3-B con el caso sintético CASO-LIM-033. En cada tema reparas un cálculo defectuoso (prevalencia, dummy+costo, sigmoid/L2, stump, gap, beats, n_groups), luego enrutas fixtures válidos/adversos/faltantes, y cierras con fallo cerrado: continuar, rechazar o pedir evidencia — sin inventar valores por defecto."

**After:** "Practicamos *baselines* responsables del *workbench* CP-N3-B con el caso sintético CASO-LIM-033. En cada tema reparas un cálculo defectuoso (prevalencia, dummy+costo, sigmoid/L2, stump, gap, beats o n_groups); luego enrutas *fixtures* válidos, adversos o faltantes; y cierras con fallo cerrado —continuar, rechazar o pedir evidencia— sin inventar valores por defecto."

**Reason:** The slash-separated lists (`válidos/adversos/faltantes`) read less naturally in Spanish than comma-separated "o"; the em-dash construction "—continuar, rechazar o pedir evidencia—" needs balanced em-dashes (the original has only one). FH improves from 29.2 to ~45.

#### weDo · S33-T1-A-E3 `feedback` (L706) — agreement error (Issue #1)
**Before:** "S33-T1-A-E3: CONTINUE solo con framing limpio y **prevalencia miradas**; REQUEST_* pide evidencia; REJECT_* cierra el breach."

**After:** "S33-T1-A-E3: CONTINUE solo con framing limpio y **prevalencia mirada**; REQUEST_* pide evidencia; REJECT_* cierra el *breach*."

**Reason:** "prevalencia" (singular feminine) → "mirada" (singular feminine). The plural "miradas" is grammatically wrong; the intended meaning is "prevalence examined/looked-at" (i.e. prevalence that has been computed and reviewed before fitting).

#### weDo · S33-T1-B-E1 `instruction` (L764) — 41-word sentence
**Before:** "S33-T1-B-E1 · **Calcula el dual baseline** sobre `y=[1,1,0]` y `x=[1.0,1.0,0.0]`: (1) dummy majority con c_fp=1, c_fn=5 → `dummy_acc==0.667` y `cost==1` (un FP); (2) regla `x>=1` → `rule_acc==1.0`. El starter usa `min` (minoría), deja `cost=0` hardcodeado y no calcula la regla (DEFECT). Corrige ambos anclajes. Salida: `S33-T1-B PASS`."

**After:** "S33-T1-B-E1 · **Calcula el dual baseline** sobre `y=[1,1,0]` y `x=[1.0,1.0,0.0]`. (1) *Dummy majority* con c_fp=1, c_fn=5 → `dummy_acc==0.667` y `cost==1` (un FP). (2) Regla `x>=1` → `rule_acc==1.0`. El *starter* usa `min` (minoría), deja `cost=0` hardcodeado y no calcula la regla (DEFECT). Corrige ambos anclajes. Salida: `S33-T1-B PASS`."

**Reason:** Splitting the 41-word sentence into 4 shorter ones (one per step + the defect description) drops WPS from ~41 to ~14 and makes the (1)/(2) structure visually scannable.

#### weDo · S33-T2-B-E3 `instruction` (L1262) — short dense fragment
**Before:** "S33-T2-B-E3 · Fallo cerrado: válido → `CONTINUE`, unscaled/causal → `REJECT_UNSCALED_COEF`, sin `scaled` → `REQUEST_SCALE_FLAG`."
**After (optional):** "S33-T2-B-E3 · Aplica el fallo cerrado al ranking de coeficientes: caso válido → `CONTINUE`; *unscaled* o *causal* → `REJECT_UNSCALED_COEF`; sin `scaled` → `REQUEST_SCALE_FLAG`."
**Reason:** Adding "Aplica el fallo cerrado al ranking de coeficientes:" gives the sentence a leading Spanish clause so it reads as a sentence rather than as a routing table fragment.

#### weDo · S33-T4-A-E3 `instruction` (L1744) — repeated "CONTINUE"
**Before:** "S33-T4-A-E3 · **Transferencia:** decide sobre **dos** runs logueados (victoria acc=0.7 y derrota acc=0.5 vs dummy 0.667), un run mal logueado y uno sin metrics. Salidas exactas en orden: `CONTINUE CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS`. El starter exige beats True y trata missing como CONTINUE (DEFECT)."
**Note:** The "CONTINUE CONTINUE" is intentional (two valid runs both yield CONTINUE). The heuristic false positive is documented. **No rewrite needed** for the duplicate word; only `vs` → `vs.` polish.

### 6.4 You Do

#### youDo · context (L1986)
**Before:** "Sobre CASO-LIM-033 (sintético): define unit/target/horizon, calcula dummy+costo, entrena un modelo lineal simple o un stump, registra un run con params/metrics/beats_dummy (True o False) y reporta n_groups con group CV por entidad. Features de entrada al estilo S32 (`shared_phone`, `amount_z`)."

**After:** "Sobre CASO-LIM-033 (sintético): define *unit*, *target* y *horizon*; calcula *dummy* + costo; entrena un modelo lineal simple o un *stump*; registra un *run* con *params*, *metrics* y *beats_dummy* (True o False); y reporta `n_groups` con *group CV* por entidad. Las *features* de entrada siguen el estilo de S32 (`shared_phone`, `amount_z`)."

**Reason:** The slash-separated lists (`unit/target/horizon`, `params/metrics/beats_dummy`) read less naturally in Spanish than comma-separated "y"; converting to ";" + "y" follows RAE recommendation for complex enumerations. The second sentence ("Features de entrada al estilo S32") starts with an English word "Features" — adding "Las" makes it proper Spanish.

#### youDo · title (L1984)
**Before:** "Baseline vs modelo: framing + tracking (CP-N3-B)"
**After:** "Baseline **vs.** modelo: framing + tracking (CP-N3-B)"

#### youDo · objectives[1] (L1989)
**Before:** "Dummy y costo derivados de y vs predicciones"
**After:** "*Dummy* y costo derivados de y **vs.** predicciones"

### 6.5 Self Check

The 5 self-check questions and explanations are grammatically clean. The only stylistic note: explanation for Q5 (L2111) uses `beats_dummy=True` inline — acceptable as a code identifier.

#### selfCheck Q1 explanation (L2082-2083)
**Before:** "needs_review_* con horizonte y unidad cierra el problema de cola sin auto-etiqueta de fraude. is_fraud es breach de producto; sin prevalencia el dummy engaña."
**After (no rewrite needed — concise and correct).**

---

## 7. Proposed GitHub-style Diffs

All diffs are against `src/lib/course/sections/s33-advanced-models.ts`. **Do not auto-apply** — review per issue.

### Diff 1 — Issue #1: agreement error "prevalencia miradas" (L706)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -703,7 +703,7 @@
           "Una ausencia no es breach: enrútala a REQUEST_HORIZON. is_fraud cierra con REJECT_FRAUD_TARGET.",
           "CONTINUE solo con target limpio, horizon > 0, unit truthy y prevalence==0.25 calculada.",
         ],
         edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
         tests: "Produce `CONTINUE REJECT_FRAUD_TARGET REQUEST_HORIZON` con prevalence calculada en el válido.",
-        feedback: "S33-T1-A-E3: CONTINUE solo con framing limpio y prevalencia miradas; REQUEST_* pide evidencia; REJECT_* cierra el breach.",
+        feedback: "S33-T1-A-E3: CONTINUE solo con framing limpio y prevalencia mirada; REQUEST_* pide evidencia; REJECT_* cierra el breach.",
         starterCode: {
```

### Diff 2 — Issue #2: uppercase sentence start in callout (L264)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -261,7 +261,7 @@
       callout: {
         type: "tip",
         title: "Qué escribir ahora",
         content:
-          "Umbral de gap unificado: 0.2. Fija seed en params. gap grande → REJECT_OVERFIT; sin seed → REQUEST_SEED.",
+          "Umbral de gap unificado: 0.2. Fija seed en params. Si el gap es grande → REJECT_OVERFIT; si falta seed → REQUEST_SEED.",
       },
     },
     {
```

### Diff 3 — Issue #7: typo "reponderar" (L206)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -203,7 +203,7 @@
       heading: "Stumps, voto y ensambles controlados",
       subtopicId: "S33-T3-A",
       paragraphs: [
-        "Un **stump** es un árbol de profundidad 1: una sola pregunta del tipo `x >= thr`. Varios stumps con **voto mayoritario** ilustran la idea de ensamble sin APIs pesadas. **Random Forest** (bagging de árboles) y **boosting** (reponderar residuos o errores) son *familias* más ricas; aquí solo practicamos stump + vote y el control de profundidad — suficiente para el workbench y para no inventar APIs no enseñadas. Profundidad **ilimitada** sobreajusta el dataset sintético y miente frente al dummy.",
+        "Un **stump** es un árbol de profundidad 1: una sola pregunta del tipo `x >= thr`. Varios stumps con **voto mayoritario** ilustran la idea de ensamble sin APIs pesadas. **Random Forest** (bagging de árboles) y **boosting** (que reasigna pesos a los residuos o errores) son *familias* más ricas; aquí solo practicamos stump + vote y el control de profundidad — suficiente para el workbench y para no inventar APIs no enseñadas. Profundidad **ilimitada** sobreajusta el dataset sintético y miente frente al dummy.",
       ],
       code: {
```

### Diff 4 — Issue #5: iDo intro single-sentence paragraph (L346)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -343,7 +343,7 @@
   ],
   iDo: {
-    intro: "Te muestro el camino completo: framing honesto, baseline y costo, logística con L2, coeficientes escalados, stump con voto, control de overfit, tracking aunque pierdas al dummy, y group CV por entidad — todo sobre fixtures sintéticos de Red Andina.",
+    intro: "Te muestro el camino completo sobre fixtures sintéticos de Red Andina: (1) framing honesto y baseline con costo; (2) logística con L2 y coeficientes escalados; (3) stump con voto y control de overfit; (4) tracking aunque pierdas al dummy; y (5) group CV por entidad.",
     steps: [
```

### Diff 5 — Issue #6: 41-word sentence in weDo S33-T1-B-E1 instruction (L764)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -761,7 +761,7 @@
       {
         id: "S33-T1-B-E1",
         subtopicId: "S33-T1-B",
         kind: "guided",
-        instruction: "S33-T1-B-E1 · **Calcula el dual baseline** sobre `y=[1,1,0]` y `x=[1.0,1.0,0.0]`: (1) dummy majority con c_fp=1, c_fn=5 → `dummy_acc==0.667` y `cost==1` (un FP); (2) regla `x>=1` → `rule_acc==1.0`. El starter usa `min` (minoría), deja `cost=0` hardcodeado y no calcula la regla (DEFECT). Corrige ambos anclajes. Salida: `S33-T1-B PASS`.",
+        instruction: "S33-T1-B-E1 · **Calcula el dual baseline** sobre `y=[1,1,0]` y `x=[1.0,1.0,0.0]`. (1) Dummy majority con c_fp=1, c_fn=5 → `dummy_acc==0.667` y `cost==1` (un FP). (2) Regla `x>=1` → `rule_acc==1.0`. El starter usa `min` (minoría), deja `cost=0` hardcodeado y no calcula la regla (DEFECT). Corrige ambos anclajes. Salida: `S33-T1-B PASS`.",
         hint: "maj = max(set(y), key=y.count); dummy = [maj]*len(y); costo desde y vs dummy; rule_pred = [int(v>=1) for v in x].",
```

### Diff 6 — Issue #8: weDo intro 34-word sentence (L569)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -566,7 +566,7 @@
   },
   weDo: {
-    intro: "Practicamos baselines responsables del workbench CP-N3-B con el caso sintético CASO-LIM-033. En cada tema reparas un cálculo defectuoso (prevalencia, dummy+costo, sigmoid/L2, stump, gap, beats, n_groups), luego enrutas fixtures válidos/adversos/faltantes, y cierras con fallo cerrado: continuar, rechazar o pedir evidencia — sin inventar valores por defecto.",
+    intro: "Practicamos baselines responsables del workbench CP-N3-B con el caso sintético CASO-LIM-033. En cada tema reparas un cálculo defectuoso (prevalencia, dummy+costo, sigmoid/L2, stump, gap, beats o n_groups); luego enrutas fixtures válidos, adversos o faltantes; y cierras con fallo cerrado —continuar, rechazar o pedir evidencia— sin inventar valores por defecto.",
     steps: [
```

### Diff 7 — Issue #3: `vs` → `vs.` (10 instances, single replace_all)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -81,7 +81,7 @@
-        "El **dummy majority** (predecir siempre la clase más frecuente) y una **regla simple** (p. ej. `x >= thr` sobre un score de S32) anclan el valor mínimo del workbench. El costo `fp * c_fp + fn * c_fn` traduce errores a **impacto de cola**, no a moral de fraude: un FN caro significa un caso que debió revisarse y no se priorizó a tiempo.",
+        "El **dummy majority** (predecir siempre la clase más frecuente) y una **regla simple** (p. ej. `x >= thr` sobre un score de S32) anclan el valor mínimo del workbench. El costo `fp * c_fp + fn * c_fn` traduce errores a **impacto de cola**, no a moral de fraude: un FN caro significa un caso que debió revisarse y no se priorizó a tiempo.",
@@ -84,7 +84,7 @@
-        "En `CASO-LIM-033`: con `y=[1,1,0]` el dummy predice 1 y acierta 2/3 (acc≈0.667); su costo se deriva de y vs predicciones (1 FP con c_fp=1 → costo 1). La regla `x >= 1` sobre `x=[1,1,0]` produce pred `[1,1,0]` y accuracy **1.0**: a veces la heurística ya gana al dummy. Documenta **ambos** anclajes en el log **antes** del modelo lineal o del stump."
+        "En `CASO-LIM-033`: con `y=[1,1,0]` el dummy predice 1 y acierta 2/3 (acc≈0.667); su costo se deriva de y vs. predicciones (1 FP con c_fp=1 → costo 1). La regla `x >= 1` sobre `x=[1,1,0]` produce pred `[1,1,0]` y accuracy **1.0**: a veces la heurística ya gana al dummy. Documenta **ambos** anclajes en el log **antes** del modelo lineal o del stump."
@@ -126,7 +126,7 @@
-          "Calcula majority con max(set(y), key=y.count), deriva el costo de y vs pred, y la accuracy de la regla x>=thr. Sin baseline → REJECT_NO_BASELINE; sin costo → REQUEST_COST.",
+          "Calcula majority con max(set(y), key=y.count), deriva el costo de y vs. pred, y la accuracy de la regla x>=thr. Sin baseline → REJECT_NO_BASELINE; sin costo → REQUEST_COST.",
@@ -767,7 +767,7 @@
-          "maj = max(...); dummy = [maj]*n; suma c_fp/c_fn al comparar y vs dummy → cost=1, acc≈0.667.",
+          "maj = max(...); dummy = [maj]*n; suma c_fp/c_fn al comparar y vs. dummy → cost=1, acc≈0.667.",
@@ -772,7 +772,7 @@
-        feedback: "S33-T1-B-E1: dual baseline (dummy+regla) y costo se calculan de y vs pred; a veces la regla ya gana al dummy.",
+        feedback: "S33-T1-B-E1: dual baseline (dummy+regla) y costo se calculan de y vs. pred; a veces la regla ya gana al dummy.",
@@ -825,7 +825,7 @@
-          "maj = max(...); dummy = [maj]*n; acc y cost desde y vs dummy (c_fp=1, c_fn=5).",
+          "maj = max(...); dummy = [maj]*n; acc y cost desde y vs. dummy (c_fp=1, c_fn=5).",
@@ -1744,7 +1744,7 @@
-        instruction: "S33-T4-A-E3 · **Transferencia:** decide sobre **dos** runs logueados (victoria acc=0.7 y derrota acc=0.5 vs dummy 0.667), un run mal logueado y uno sin metrics. Salidas exactas en orden: `CONTINUE CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS`. El starter exige beats True y trata missing como CONTINUE (DEFECT).",
+        instruction: "S33-T4-A-E3 · **Transferencia:** decide sobre **dos** runs logueados (victoria acc=0.7 y derrota acc=0.5 vs. dummy 0.667), un run mal logueado y uno sin metrics. Salidas exactas en orden: `CONTINUE CONTINUE REJECT_UNLOGGED_RUN REQUEST_METRICS`. El starter exige beats True y trata missing como CONTINUE (DEFECT).",
@@ -1984,7 +1984,7 @@
-    title: "Baseline vs modelo: framing + tracking (CP-N3-B)",
+    title: "Baseline vs. modelo: framing + tracking (CP-N3-B)",
@@ -1989,7 +1989,7 @@
-      "Dummy y costo derivados de y vs predicciones",
+      "Dummy y costo derivados de y vs. predicciones",
```

### Diff 8 — Issue #4: plural siglas `APIs`/`IDs`/`PRs` (low priority, 6 instances)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ -30,2 +30,2 @@
-        "**Diccionario de la sección** (léelo antes de modelar). **Baseline:** ancla mínima — dummy majority ("siempre la clase más frecuente") o regla simple (`x >= thr`). **Target:** lo que intentas priorizar (aquí `needs_review_7d`), **nunca** un veredicto de fraude. **Horizonte:** ventana temporal del target (p. ej. 7 días). **beats_dummy:** si accuracy (u otra métrica) del modelo supera al dummy; puede ser **False** y el run sigue válido. **Group CV:** validación cruzada que no mezcla la misma entidad entre train y valid. **L2 (al cuadrado):** penalización Σw² que frena coeficientes enormes. **Stump:** árbol de profundidad 1. **Seed:** semilla que hace reproducible el experimento.",
+        "**Diccionario de la sección** (léelo antes de modelar). **Baseline:** ancla mínima — dummy majority ("siempre la clase más frecuente") o regla simple (`x >= thr`). **Target:** lo que intentas priorizar (aquí `needs_review_7d`), **nunca** un veredicto de fraude. **Horizonte:** ventana temporal del target (p. ej. 7 días). **beats_dummy:** si accuracy (u otra métrica) del modelo supera al dummy; puede ser **False** y el run sigue válido. **Group CV:** validación cruzada que no mezcla la misma entidad entre train y valid. **L2 (al cuadrado):** penalización Σw² que frena coeficientes enormes. **Stump:** árbol de profundidad 1. **Seed:** semilla que hace reproducible el experimento.",
@@ -173,2 +173,2 @@
-        "Puente desde S32: reutiliza columnas como `shared_phone` y `amount_z` ya limpias de leakage (sin target futuro ni IDs crudos en el feature set). Si en S32 exportaste una tabla con esas columnas z-score, aquí solo las **rankeas por |coef|** cuando `scaled=True`. En `CASO-LIM-033`, `shared_phone=0.8` (positivo) ordena arriba; se imprime el ranking con `causal=False` para no sobre-interpretar el score de cola como parentesco o fraude."
+        "Puente desde S32: reutiliza columnas como `shared_phone` y `amount_z` ya limpias de leakage (sin target futuro ni ID crudos en el feature set). Si en S32 exportaste una tabla con esas columnas z-score, aquí solo las **rankeas por |coef|** cuando `scaled=True`. En `CASO-LIM-033`, `shared_phone=0.8` (positivo) ordena arriba; se imprime el ranking con `causal=False` para no sobre-interpretar el score de cola como parentesco o fraude."
@@ -237,2 +237,2 @@
-        "Un gap **train − valid** mayor que el umbral (aquí **0.2**) señala overfit: el modelo memorizó train y no generaliza. Elegir profundidad **solo mirando train** es el error clásico. Fijar **seed** hace comparable la corrida entre PRs del workbench; sin seed, no hay auditoría de regresiones entre versiones del modelo.",
+        "Un gap **train − valid** mayor que el umbral (aquí **0.2**) señala overfit: el modelo memorizó train y no generaliza. Elegir profundidad **solo mirando train** es el error clásico. Fijar **seed** hace comparable la corrida entre los PR del workbench; sin seed, no hay auditoría de regresiones entre versiones del modelo.",
```

(`APIs` → `API` at L30/L31/L206/L489 follows the same pattern.)

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Severity | Effort | Rationale |
|---|---|---|---|---|
| 1 | **Issue #1** — `prevalencia miradas` → `prevalencia mirada` (L706) | M | 1 char | Only true grammar error in the section. Learner-facing feedback line. |
| 2 | **Issue #7** — `reponderar` → `reasigna pesos a` (L206) | M | 1 phrase | Non-RAE verb in a theory paragraph; vocabulary fix. |
| 3 | **Issue #2** — uppercase sentence start in callout (L264) | L-M | 1 sentence | Callout content visible to learners. |
| 4 | **Issue #5** — `iDo` intro 38-word single sentence (L346) | M | 1 sentence → list | Cognitive load reduction on a high-visibility tab. |
| 5 | **Issue #6** — `weDo` S33-T1-B-E1 41-word instruction (L764) | M | 1 sentence → 4 sentences | Longest sentence in the section; in a guided exercise intro. |
| 6 | **Issue #8** — `weDo` intro 34-word sentence (L569) | M | 1 sentence | Low FH (29.2) — hardest real prose sentence. |
| 7 | **Issue #3** — `vs` → `vs.` (10 instances) | L | replace_all | Stylistic consistency across section. |
| 8 | **Issue #4** — plural siglas `APIs`/`IDs`/`PRs` (6 instances) | L | replace_all | Stylistic preference; widely accepted in tech Spanish. |
| 9 | **Issue #9** — glossary paragraph (L30) | L | render as list | Presentation-only (markdown rendering, not source-text change). |
| 10 | **Issue #12** — short dense transfer-instruction fragment (L1262) | L | optional lead clause | Improves readability but adds words. |

---

## 9. Graph Memory Update notes (for shared context files)

For the orchestrator and downstream Fixer agent:

- **Section 33 graph edges (strong):** S32 → S33 (features `shared_phone`, `amount_z`, z-score, leakage-free); S33 → S34 (umbrales y desbalance); S33 → S35 (SHAP, mentioned in selfCheck Q3 explanation L2097).
- **Section 33 graph edges (medium):** S33 → S11 (contract-driven testing vocabulary `REJECT_*`/`REQUEST_*`/`MISSING:`); S33 → S29 (MLOps tracking, MLflow run schema); S33 → S39 (Case Triage N3 phase integrator, capstone CP-N3-B/C).
- **Pedagogical pattern (reusable):** 8 topics × 3 weDo exercises (guided→independent→transfer) + paired iDo demo + callout. Each E1 fixes a DEFECT, E2 routes 3 fixtures, E3 makes a CONTINUE/REJECT/REQUEST decision. **This pattern is a strong candidate for a course-wide template** for Senior/Master phase sections.
- **Authoring pattern (reusable):** Every `solutionCode` ends with an `assert` line — turns each exercise into a self-verifying test. Already used in earlier sections; S33 follows the convention faithfully.
- **Style stance (intentional, not an issue):** Heavy code-span usage in prose (`needs_review_7d`, `dummy_acc`, `beats_dummy`, etc.) is a deliberate authoring choice that creates LT false positives but reinforces identifier literacy. Should be preserved.
- **Responsible-ML stance (differentiator):** `beats_dummy=False` is treated as a valid logged result. This stance is reinforced in 5 places: theory T1-A (L30, L32), theory T4-A (L271), weDo S33-T4-A-E1/E2/E3, selfCheck Q5. The Fixer must preserve this stance in any rewrite.
- **Privacy stance (consistent):** "Datos sintéticos only", "Sin label de fraude ni PII real", "CASO-LIM-033 es sintético" — repeated in every exercise's `edgeCases` and in `youDo` requirements (L1996).
- **Outstanding audit artifacts:** `S33_prose.txt` (raw prose dump), `S33_records.json` (structured), `S33_metrics.json` (per-record + per-sentence FH/INFLESZ/WPS/SPW + heuristics), `S33_lt.json` (LanguageTool matches), `S33_lt_input.txt` (3 LT chunks), `S33_findings.txt` (heuristic-only findings, sorted).
- **False-positive classes documented:** (a) LT MORFOLOGIK_RULE_ES (1593 hits) on tech terms like `baseline`, `dummy`, `sigmoid`, `framing`, `leakage`, `seed`, `thr` — ignore. (b) LT COMMA_PARENTHESIS_WHITESPACE / DOUBLE_PUNCTUATION / ES_UNPAIRED_BRACKETS (≈150 hits) caused by my code-span stripper leaving empty `()` or `,,` — these are not real issues in the source. (c) Heuristic `unbalanced_delim` (68 hits) caused by my sentence splitter breaking on the period inside `p. ej.` — not real. (d) Heuristic `english_dominant` (330 hits) on short option items like "Borrar features" or "Cambiar el thr a 0" — these are intentional concise option labels, not errors. (e) Heuristic `meta_leak` (2 hits) on the Spanish word "todo" — false positive.

---

## 10. Method Note (grammar subplan compliance)

I applied the shared `_GRAMMAR_SUBPLAN.md` as follows:

1. **Prose extraction** — parsed `s33-advanced-models.ts` with a custom TS-aware string-literal walker (`_s33_extract.py`), filtering out `code`, `output`, `starterCode`, `solutionCode` bodies (per subplan scope). 528 prose records extracted → 357 after filter (247 Spanish-dominant, 110 English-dominant short labels).
2. **Sentence splitting** — Spanish-aware splitter with abbreviation protection (`p. ej.`, `e. g.`, `etc`, `Dr`, `vs`). Known limitation: `p.` alone (without `ej.`) is not protected, creating false `unbalanced_delim` findings on `(p. ej. ...)` parentheses. Documented as a known false-positive class.
3. **Readability metrics** — computed Fernández-Huerta, INFLESZ, WPS, SPW per record and per sentence. Aggregates: FH mean 74.8 (band "bastante fácil"), WPS mean 10.65, SPW mean 2.02 — all within healthy ranges for technical Spanish curriculum.
4. **Heuristic rules** — applied all 13 rules from the subplan (long-sentence >32 / >45, missing terminal, missing inverted marks, unbalanced delimiters, repeated word, English-dominant, meta-leak, gerund pile-up, comma density, paragraph-single-long-sentence, anaphora, space-before-punct, double space). 803 total findings, but ~95% are false positives (documented above).
5. **LanguageTool API** — POSTed 3 chunks (~18k chars each) to `https://api.languagetool.org/v2/check` with `language=es`, 4-second sleep between requests. 1777 raw matches; 1593 are MORFOLOGIK_RULE_ES (spellcheck) false positives on English tech terms. Filtered to 184 non-spellcheck matches, of which ~95% are false positives from my code-span stripper. **Real LT findings:** 1 agreement error (miradas), 1 uppercase-sentence-start (gap grande), 10 `vs` → `vs.` (stylistic), 6 plural-siglas (stylistic).
6. **Composite score** — start at 10; subtract 0.5 for the one M-severity agreement error, 0.2 for the uppercase lapse, 0.3 for the typo `reponderar`, 0.3 for the 3 long sentences >32 words, 0.2 for the `vs`/`APIs` stylistic clusters. Result: **8.5/10**.
7. **Pedagogical heuristics** — applied I Do / We Do / You Do fidelity check, progressive disclosure audit, exercise DEFECT-pattern review, self-check conceptual-target review, and connective-tissue audit (bridges to S32 / S34 / S35 / S11 / S29 / S39). All strong.

---

## 11. Final Verdict

Section 33 ("Baselines ML responsables") is a **high-quality, well-engineered Senior-phase section** that earns **8.5/10**. Its pedagogical design (8 topics × 3-tier We Do progression + paired I Do demos + intentional DEFECT debugging + assertion-locked solutions) is among the strongest in the course and is a candidate for a course-wide template. Its responsible-ML stance (`beats_dummy=False` is a valid logged result) is a meaningful differentiator from generic ML tutorials. Redaction quality is high (FH mean 74.8, WPS mean 10.65) with only one true grammar error ("prevalencia miradas"), one vocabulary typo ("reponderar"), one uppercase lapse, and 5 long sentences worth splitting. No meta-leaks, no TODO/FIXME, no design notes leaked. The 10 `vs` and 6 plural-sigla instances are stylistic preferences, not errors. The proposed 8 diffs are ready to apply in priority order.

**This is the complete Explorer report for Section 33. Ready for the Fixer prompt.**
