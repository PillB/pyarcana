# Curriculum Auditor Report — Section 34

**Section under audit:** S34 — `Métricas, desbalance, calibración y umbrales`
**Live site URL:** https://pillb.github.io/pyarcana/ (Section 34, shortTitle “Métricas y umbrales”)
**Repo source:** `src/lib/course/sections/s34-cv-ai-integration.ts` (2 349 lines, 333 learner-facing prose blocks, 442 sentences)
**Phase / level:** Phase 2 · Senior · “Competente a experto” · 18 h · `phase: 2`
**Capstone tag:** closes **CP-N3-B** of the *Relationship Investigation Workbench* (Red Andina, ficticia)
**Auditor:** Curriculum Auditor (general-purpose) · Stanford-STORM + Graph/Loop/Harness engineering
**Grammar subplan applied:** `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md` (Fernández-Huerta, INFLESZ, WPS/SPW, LanguageTool `es`, pedagogical heuristics)

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| `id` | `"cv-ai-integration"` |
| `index` | `34` |
| `title` | “Métricas, desbalance, calibración y umbrales” |
| `shortTitle` | “Métricas y umbrales” |
| `tagline` | “De scores del baseline a una cola humana calibrada: métricas honestas, thr versionado y abstención — nunca auto-fraude” |
| File | `src/lib/course/sections/s34-cv-ai-integration.ts` |
| Confirmed on live site | ✅ Live index lists section 34 = “Métricas y umbrales” with the same tagline |

**Scope of audit:** all learner-facing prose — `title`, `shortTitle`, `tagline`, `jobRelevance`, 8 `learningOutcomes`, 8 theory subsections (heading + 2–4 paragraphs + callout), 8 I-Do demos (`intro` + 8 steps each with `description`/`why`), 24 We-Do exercises (24 × {`instruction`, `hint`, `hints[2]`, `edgeCases[3]`, `tests`, `feedback`}), You-Do workbench (`title`, `context`, 4 `objectives`, 6 `requirements`, `portfolioNote`, 7 `rubric` items), 8 `selfCheck` questions, plus `resources` (excluded from prose audit). Code blocks (`starterCode`, `solutionCode`) and `output` were excluded from grammar scoring per the subplan; `output` strings are learner-visible so they were checked for content coherence but not for FH/SPW.

**Section topic confirmation:** Despite the file name `s34-cv-ai-integration.ts`, the section is **not** about computer vision. It is an ML-evaluation / decision-thresholds lesson for the *Relationship Investigation Workbench* (Red Andina, ficticia): confusion matrix, precision/recall/F1, precision@k/recall@k, class weights & resampling inside CV, prevalence, Brier, reliability bins, an affine Platt-skeleton calibrator fit on a versioned holdout, threshold search by cost/capacity (thr-vN), and an abstain band for the gray zone. The lesson explicitly disclaims “no de visión por computador” (line 49), which is itself a meta-leak flagged in §4.

---

## 2. Executive Summary of Quality

**Overall score: 7.5 / 10**

Verdict: **Solid, pedagogically honest, structurally mature — but hampered by a misleading source filename, a pervasive orthographic slip on the prefix *auto-*, several missing commas before *pero*, missing periods after *vs*, two typography slips on “a,b”, and a few long, hypotactic sentences that exceed the WPS soft target.**

Strengths:
- **I Do / We Do / You Do fidelity is excellent.** 8 I-Do demos map 1-to-1 to the 8 theory subtopics (S34-T1-A, S34-T1-B, S34-T2-A, S34-T2-B, S34-T3-A, S34-T3-B, S34-T4-A, S34-T4-B). Each subtopic then has 3 We-Do exercises that follow a deliberate Bloom ladder: E1 *guided* (fix the formula), E2 *independent* (triage valid/adversarial/missing), E3 *transfer* (fail-closed with CONTINUE / REJECT_* / REQUEST_*). That is consistent progressive disclosure.
- **Pedagogical honesty is unusually high.** The section repeatedly forbids the worst ML-evaluation anti-patterns (accuracy-only, resample-before-CV, in-sample calibration, fixed thr 0.5, force_1 in the band) and ties each breach to a fail-closed policy code (`REJECT_ACCURACY_ONLY`, `REJECT_LEAKY_RESAMPLE`, `REJECT_IN_SAMPLE_CAL`, `REJECT_FIXED_THR`, `REJECT_FORCE_LABEL`) and each missing-evidence case to a `REQUEST_*` code.
- **The You Do is a true capstone** that closes CP-N3-B and stitches all four tabs into one runnable report (`build_workbench_report`). The starter has *intentional* defects (`# DEFECT`) that the learner must repair, with three deliberate defects enumerated in a header comment — a very clean Loop-engineering pattern.
- **Readability is in the healthy band.** Aggregate Fernández-Huerta mean = 70.9 (“fácil”), median 71.3, SPW mean 2.07, WPS mean 11.6 (median 10.0). For technical Spanish aimed at senior learners this is on target — neither infantile nor cognitively overloading.
- **No developer/AI meta-comments in user-facing prose.** No `TODO`, `FIXME`, “moved from section X”, or “lorem ipsum” strings leaked (regex sweep clean).

Weaknesses (driving the 2.5-point deduction):
- **Meta-leak from file naming + explicit disclaimer** (“no de visión por computador”) — the source file `s34-cv-ai-integration.ts` advertises CV, but the content is ML evaluation. The disclaimer is a tell-tale of a renamed/repurposed file (see §4).
- **9 instances of hyphenated *auto-\** (`auto-fraude`, `auto-etiqueta`, `auto-etiquetar`). RAE 2010 Ortografía: prefixes attach without hyphen → `autofraude`, `autoetiqueta`, `autoetiquetar`. LanguageTool independently flagged 2 of them (`AUTO_NO_SEPARADO`).
- **3 missing commas before *pero*** joining clauses (`COMMA_PERO`).
- **7 missing periods after *vs*** (`PUNTO_EN_ABREVIATURAS`). Strict RAE: `vs.` with period.
- **2 typography slips** `a,b` without space after the comma (`COMMA_PARENTHESIS_WHITESPACE`).
- **10 sentences >32 words**, including one run-on of 52 words in `youDo.context` (FH 29.2) and one of 49 words in `youDo.portfolioNote` (FH 34.4). These two You-Do units are the worst redaction hot-spots.
- **Mild fourth-wall leaking** via “esqueleto didáctico” (×3), “ficticio”, “proxy didáctico” — pedagogically honest but breaks the immersive “this is the real workbench” frame.
- **English loanword/noun-phrase mixing** in Spanish prose: “labels top ordenados” (LT flagged `AGREEMENT_POSTPONED_ADJ`), “un miss es más caro”, “misses”, “loss”, “headcount”, “dashboard”. Acceptable in senior ML material but should be typographically isolated (italics or `code`).

---

## 3. Detailed Issue Registry

Issues are numbered `S34-I##`. Severities: **H** = pedagogically blocking, **M** = real defect, **L** = polish.

| ID | Severity | Location (key) | Evidence (excerpt) | Pedagogical impact |
|---|---|---|---|---|
| S34-I01 | **H** | file name `s34-cv-ai-integration.ts` + theory[0].paragraphs[2] | Theory says: “Esta lección es de **evaluación y umbrales de cola**, no de visión por computador.” | The need to disclaim CV is itself a meta-leak: the file name advertises computer-vision but the lesson is ML evaluation. Confuses maintainers and any learner who reads the source / URL slug; the disclaimer wouldn’t be needed if the file were named consistently. |
| S34-I02 | **M** | tagline (line 9), jobRelevance (16), theory[8].p[1] (346), weDo.intro (623), weDo.steps[23].feedback (2035), youDo.context (2082), youDo.starterCode comment (2105), youDo.portfolioNote (2205), youDo.rubric[0].criterion (2209) | “nunca auto-fraude”, “auto-etiqueta de fraude”, “no es auto-fraude ni prueba…”, “no auto-fraude” (9 occurrences of `auto-` + hyphen + base) | RAE 2010: prefixes join the base without hyphen (`autofraude`, `autoetiqueta`, `autoetiquetar`). LT `AUTO_NO_SEPARADO` independently confirmed 2 of these. Pedagogically the wrong model is shown for *all* `auto-` compounds in the section. |
| S34-I03 | **M** | theory[2].p[0] (line 115), weDo.steps[14].feedback (~line 1430), selfCheck.questions[7].question (~line 2275) | “Una cola con precision@k alta pero que genera más alertas que personas puede «ganar» el notebook y perder el turno”; “si mean_p y freq alinean pero Brier es alto”; “Si precision@k es alta pero load > capacity del equipo de analistas” | LT `COMMA_PERO` ×3. RAE: `pero` joining two clauses requires a preceding comma. Affects 3 different tabs (theory, We Do feedback, self-check). |
| S34-I04 | **L** | 7 sites: jobRelevance, theory[3].p[0] (~line 64), theory[4].p[1] (~line 116), theory[5].p[1] (~line 232), weDo.steps[2].feedback (~line 700), weDo.steps[16].feedback (~line 1548), selfCheck.questions[6] (~line 2268) | `mean_p vs frecuencia`, `discriminación vs calibración`, `misses vs cola`, `thr-v1 vs thr-v2`, `region/team en el reporte vs en el predicado`, `PR sobre ROC-AUC sola` | LT `PUNTO_EN_ABREVIATURAS` ×7. Modern Spanish accepts `vs` without period colloquially, but RAE-preferred form is `vs.` with period. Inconsistent with the otherwise formal tone of the section. |
| S34-I05 | **L** | weDo.steps[17].hints[0] (~line 1539), weDo.steps[17].hints[1] (~line 1539) | “Clip sin a,b no es calibración; aquí a,b vienen del holdout_v1 ficticio.” | LT `COMMA_PARENTHESIS_WHITESPACE` ×2. After a comma, leave a space: “a, b”. Affects the readability of the math variables. |
| S34-I06 | **M** | weDo.steps[16].instruction (~line 1535) | “Implementa búsqueda de thr: scores=[0.1,0.4,0.6,0.9], labels=[0,0,1,1], c_fp=2, c_fn=10, capacity=2.” — 10 commas / 15 words → density 0.67 | LT `COMMA_PARENTHESIS_WHITESPACE` + high comma density. Cramped list of tuples in prose; should be reformatted as a code block or a vertical list to lower cognitive load. |
| S34-I07 | **M** | weDo.steps[17].hint (line 1369), weDo.steps[17].hints[0] (1370) | “brier_mean = media de (p−y)²; con p=0.5 y y en {0,1}: (0.25+0.25)/2=0.25.” | LT `SPANISH_WORD_REPEAT_RULE` ×2. The repetition `y y` (variable `y` followed by the conjunction `y`) is hard to parse for learners and triggers automated repetition rules. Rewrite as “con p=0.5 y etiqueta y∈{0,1}” or rename the variable. |
| S34-I08 | **L** | weDo.steps[12].instruction (~line 1367) | “Brier medio sobre ps=[0.5,0.5] ys=[0,1] y un bin [0.0,1.0) con mean_p y freq.” | LT `ES_UNPAIRED_BRACKETS` ×2. The half-open interval `[0.0,1.0)` is mathematically correct but visually clashes with bracket-pair expectations; consider `[0.0, 1.0)` with a space, or `∈ [0.0, 1.0)`. |
| S34-I09 | **M** | youDo.context (~line 2082) | 52-word run-on, FH 29.2: “Integra, sobre el mismo mini-set sintético CASO-LIM-034 de Red Andina (cinco scores del baseline de S33 y labels `needs_review`), el flujo completo del Relationship Investigation Workbench que **cierra CP-N3-B**: confusión y F1 → precision@k bajo capacidad → Brier y reliability_bin → thr-v1 por costo y capacidad → decide() con abstain.” | Cognitive overload at the very moment the learner enters the You Do. The five-step pipeline should be a numbered list, not a single sentence. |
| S34-I10 | **M** | youDo.portfolioNote (~line 2205) | 49-word sentence, FH 34.4. | Same pattern — portfolio prompt runs together four requirements + a forward reference to S35. Split into 2–3 sentences. |
| S34-I11 | **M** | iDo.intro (~line 386) | 47-word sentence, FH 35.1 — enumerates nine I-Do demos in one breath. | The intro is the learner’s entry point; splitting into two sentences (“Te muestro cómo Red Andina convierte `CASO-LIM-034` en números auditables. Pasamos por confusión y F1, precision@k / recall@k, …”) would lower cognitive load. |
| S34-I12 | **M** | theory[1].paragraphs[0] (~line 63) | 44-word sentence: “Cuando el costo de un FN pesa más que el de un FP (perder un caso que sí merecía revisión), la familia se generaliza a Fβ con β>1; en el workbench anclamos en F1 y dejamos el desbalance de costos al umbral versionado de T4.” | Two clauses glued by `;` introducing Fβ and the workbench scope decision. Splitting at `;` would improve flow. |
| S34-I13 | **M** | jobRelevance (line 16) | 38-word sentence, FH 27.6 — defines the bridge from notebook to product. | Dense hypotaxis with three prepositional chains (“con métricas honestas bajo desbalance, calibración fuera de muestra y umbrales versionados por costo y capacidad del equipo”). |
| S34-I14 | **L** | theory[0].paragraphs[0] (~line 47) | 36-word sentence. | Acceptable for a hook paragraph but FH 50.1 is at the lower end of “normal”. |
| S34-I15 | **L** | theory[8].paragraphs[1] (~line 346) | 35-word sentence ending in “…es una deuda de equidad y de producto.” | Compound objects stacked after “mirar”. Could be split as “Antes de promover el thr conviene mirar **sensibilidad** … . También conviene mirar métricas **por slice** …”. |
| S34-I16 | **L** | learningOutcomes (8 items) | 8/8 outcomes are fragments without terminal period (e.g., “Calcular matriz de confusión completa … cuando la clase positiva es rara”). | Heuristic `missing_term` fires 142×, mostly on intentional UI fragments (titles, tagline, learning-outcome bullets, hints, edge cases, self-check options). Not a defect — UI convention. |
| S34-I17 | **L** | weDo.steps[*].edgeCases (24 items, all 24 exercises) | Each edge-case array is a list of three fragments, all lower-case (e.g., “falta tp”, “falta capacity”). | LT `UPPERCASE_SENTENCE_START` ×24. Stylistic choice consistent with code-like policy hints; defensible, but starting each fragment with a capital would reduce false positives and read more like Spanish. |
| S34-I18 | **L** | theory[0].paragraphs[2] (~line 49), theory[3].paragraphs[1] (~line 153), theory[5].paragraphs[0] (~line 270), iDo.steps[5].description (~line 545), code comments (lines 172, 278, 471, 1552) | Repeated “esqueleto didáctico” / “esqueleto de Platt” / “proxy didáctico” / “ficticio” disclaimers. | Mild fourth-wall breaking. Pedagogically honest but the word “esqueleto” conveys “this is a toy”. Better: “implementación afín inspirada en Platt” or “Platt simplificado”. |
| S34-I19 | **L** | weDo.steps[3].instruction (~line 879) | “precision_at_k en [0,1]” mixes a half-open interval with a closed one. | Mathematical ambiguity (the closed interval `[0,1]` is intentional, but the visual closeness to `[0.0, 1.0)` in S34-I08 may confuse learners). |
| S34-I20 | **L** | theory[2].paragraphs[1] (~line 116), callout title (line 145) | `REQUEST_CAPACITY` appears in a callout title; the workbench policy codes `REJECT_*` / `REQUEST_*` are quoted as identifiers. | Not a defect, but the policy-code density is high (≥20 distinct codes). A glossary callout in theory[0] already lists `REJECT_*` / `REQUEST_*`; the callouts in each theory subsection should at least once spell out the *meaning* in Spanish next to the code. |
| S34-I21 | **L** | weDo.steps[2].instruction (~line 687) | “`S34-T1-A-E2 · Tres rutas de política de confusión en la cola de Red Andina`” — the bullet separator `·` is followed by a space, then capital. | Style consistency: most instructions begin with the exercise ID `S34-T…-E# ·` followed by a verb in imperative (“Calcula”, “Implementa”, “Repara”). Verify all 24 instructions follow the same template. |
| S34-I22 | **L** | theory[6].paragraphs[1] (~line 271), code docstring (line 278) | “esqueleto didáctico de Platt” used both in theory prose and in a Python docstring inside `calibrator.py`. | The docstring is learner-visible in the rendered code panel; the same fourth-wall leak as S34-I18. |
| S34-I23 | **L** | selfCheck.questions[1] (~line 2233) and the option list | Option 3 “Introduce leakage y métricas infladas” uses the English loanword “leakage” inline. | Acceptable for ML-senior audience but inconsistent with the section’s otherwise strong Spanish-policy framing (“contamina la validación”, “fuga de datos”). |
| S34-I24 | **L** | weDo.steps[14].instruction (~line 1417) and elsewhere | `mean_p`, `freq`, `brier` written as bare identifiers inside Spanish sentences. | Heavy code-identifier density. The reader must context-switch between Spanish and Python; italicizing the identifiers or wrapping them in `code` (already done in markdown) is the right call — confirm the renderer styles it. |

### Aggregated counts (heuristic + LT)

| Source | Rule | Count |
|---|---|---|
| Heuristic | `long_sentence` (>32 wps) | 10 |
| Heuristic | `missing_terminal` (mostly intentional fragments) | 142 (≈24 real: title, tagline, etc.) |
| Heuristic | `high_comma_density` (>0.12) | 38 (most false positives on `Salidas: PASS, REJECT_…, MISSING:…`) |
| Heuristic | `repeated_word` | 2 (both on `y y` in equation) |
| Heuristic | `unbalanced_delim` | 1 (`[0.0,1.0)` — intentional) |
| LT | `MORFOLOGIK_RULE_ES` (spell-check) | 979 — **almost all false positives on English/code tokens** (`thr`, `REJECT_*`, `holdout_v1`, `mean_p`, `n_pos`, `LatAm`, `compliance`, etc.) |
| LT | `UPPERCASE_SENTENCE_START` | 24 — all on edge-case fragments (intentional style) |
| LT | `PUNTO_EN_ABREVIATURAS` | 7 — real (vs without period) |
| LT | `COMMA_PERO` | 3 — real |
| LT | `PREP_VERB` | 3 — false positives (LT misreads `con load`, `con precision`, `abstener en 0.5`) |
| LT | `AUTO_NO_SEPARADO` | 2 — real (subset of S34-I02) |
| LT | `ES_UNPAIRED_BRACKETS` | 2 — false positive (half-open interval) |
| LT | `SPANISH_WORD_REPEAT_RULE` | 2 — real (S34-I07) |
| LT | `COMMA_PARENTHESIS_WHITESPACE` | 2 — real (S34-I05) |
| LT | `AGREEMENT_DET_NOUN` | 1 — borderline (`un miss` loanword) |
| LT | `AGREEMENT_POSTPONED_ADJ` | 1 — real (`labels top ordenados`) |
| LT | `DIACRITICS_OTHERS` | 1 — false positive (`formula` verb vs `fórmula` noun — here it is the verb) |
| LT | `SINGLE_CHARACTER` | 1 — false positive (`k` identifier) |

Real LT issues: **17**. False positives: **1 008** (mostly spell-check on technical tokens — expected for an ML-evaluation section).

---

## 4. Meta-Leak Report

| # | Location | Exact leaked text | Type |
|---|---|---|---|
| ML-1 | `src/lib/course/sections/s34-cv-ai-integration.ts` — file name + `id: "cv-ai-integration"` | The file is named after *computer-vision AI integration* but the section is about **ML evaluation metrics, calibration, and thresholds** for a relationship-investigation workbench. | **Organizational meta-leak.** The file name is internal (not learner-visible) but it propagates into the source-map, the URL slug for any GitHub source link, and the cognitive model of maintainers. |
| ML-2 | `theory[0].paragraphs[2]` (line 49) | “Esta lección es de **evaluación y umbrales de cola**, no de visión por computador.” | **Compensating meta-leak.** The disclaimer only exists because the file name is wrong; if the file were renamed to e.g. `s34-metrics-thresholds.ts`, the disclaimer could be deleted. |
| ML-3 | `theory[3].paragraphs[1]` (line 153), `theory[6].paragraphs[0]` (line 270), `iDo.steps[5].description` (line 545), Python docstrings (lines 172, 278, 1552) | “esqueleto es `fold_plan(...)`”, “esqueleto didáctico de Platt”, “esqueleto de Platt en holdout”, “`# Esqueleto: aquí iría oversample`” | **Pedagogical fourth-wall break.** The word “esqueleto” reveals the implementation is a teaching stub; learners can take it as license to copy the skeleton into production. |
| ML-4 | `theory[6].paragraphs[2]` (line 272) | “(coeficientes ficticios de holdout_v1)” | **Pedagogical disclaimer that the `a, b` coefficients are not real.** Honest, but inside running prose it breaks immersion; better placed in a callout. |
| ML-5 | `theory[0].callout.content` (line 56) | “REJECT_*/REQUEST_* son políticas de cola del workbench (no de visión por computador).” | Second occurrence of the CV disclaimer — confirms the leak is intentional and pervasive. |
| ML-6 | `weDo.intro` (line 623) | “Los fixtures usan case_id peruanos sintéticos; no hay PII real ni auto-fraude” | Honest but the phrase “no hay PII real” is a meta-note about the dataset, not about the lesson. Move to a *Data notice* callout. |
| ML-7 | `youDo.starterCode` header (lines 2097–2105) | `# Workbench CP-N3-B — CASO-LIM-034 (sintético Red Andina)`, `# Defectos intencionales del starter (corrígelos):` followed by `#  1) …`, `#  2) …`, `#  3) …` | **Intentional design note** — but it tells the learner “we put bugs in here on purpose”, which can read as condescending. The same information is in `objectives` and `requirements`; the inline header could be shortened to `# Workbench CP-N3-B (sintético). Corrige los DEFECT marcados en el código.` |

No `TODO`, `FIXME`, `XXX`, `HACK`, `placeholder`, `lorem`, `WIP`, `moved from section X`, `section X` or `borrador` strings were found (regex sweep across the file).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pedagogical structure (I Do / We Do / You Do)

**I Do (8 demos).** Each demo is a single-file Python script with the *correct* implementation and a print block; `why` field maps to the theory subtopic. The progression is logical: T1-A confusion → T1-B top-k → T2-A class weights → T2-B prevalence → T3-A Brier → T3-B affine calibrator → T4-A thr search → T4-B abstain band. Each demo produces a print whose last line is `accuracy_only False` / `force_label False` / `fraud_label False` — a subtle rhetorical reinforcement of the policy. **Excellent fidelity.**

One critique: I-Do demos **re-implement** the same functions already shown in the theory `code` block (`confusion.py`, `topk.py`, …). This doubles the maintenance surface and risks drift; consider linking the I Do to the theory code via a “above you saw `confusion.py` — now watch it run on `CASO-LIM-034`” framing instead of re-pasting the body.

**We Do (24 exercises, 8 subtopics × 3).** The Bloom ladder is:
- **E1 *guided*:** the starter has one or two `# DEFECT` markers, the learner fixes the formula. (e.g., S34-T1-A-E1: `f1 = p + r` instead of harmonic mean; `tn = 0` instead of counting `(0,0)` pairs.)
- **E2 *independent*:** the learner writes an `assess(record: dict)` policy predicate with three branches — `PASS` / `REJECT_*` / `MISSING:field` — over valid/adversarial/incomplete fixtures.
- **E3 *transfer*:** the learner writes a `decide(record: dict)` fail-closed policy that returns `CONTINUE` / `REJECT_*` / `REQUEST_*`.

This is a clean **guided → independent → transfer** loop. Each E2 and E3 carries a `feedback` Socratic prompt that names the *conceptual* tension (e.g., S34-T2-B-E2: “¿por qué comparar precision entre Q1 y Q2 sin reportar prevalencia puede hacer que un modelo peor «gane» el dashboard?”).

**Cognitive load:** Each We-Do step is small (5–15 lines of starter, 5–10 lines of solution). The fixtures are consistent (`CASO-LIM-034-*A/B` with `region: "Lima-sintetica"`, `team: "cola-relaciones"`, `queue: "cola-revision-manana"`). The repetition is intentional and beneficial — the learner never has to re-learn the data model.

**You Do (capstone).** `build_workbench_report` is the integrative task: it calls `choose_thr` (must be repaired to do the cost search, not hardcode 0.5), `decide` (must abstain in band, not force `review`), and assembles a report dict with `accuracy_only=False`, `thr_id` starting with `thr-v`, `n_review ≤ CAPACITY`, `decision_sample == "abstain"`, `reliability_bin is not None`. The starter enumerates three intentional defects in a header comment. **The integrative task is exactly the right size** — it forces the learner to apply every concept from the section without inventing new scaffolding.

### 5.2 Connective tissue & narrative flow

The opening theory paragraph (`theory[0].paragraphs[0]`) explicitly connects to **S31** (grafo de relaciones), **S32** (features), and **S33** (baseline responsible). This anchors the lesson in the capstone arc. The mental map in `theory[0].paragraphs[2]` (“T1 → T2 → T3 → T4”) is a strong connective device.

The `portfolioNote` of the You Do forward-references **S35** (explainability and equidad por slice). Good continuity.

**Two flow gaps:**
1. The transition from T3-B (calibrator) to T4-A (threshold) is abrupt — there is no sentence stating *why* we now apply thr on calibrated scores vs raw scores. The learner is left to infer. A short connective sentence in T4-A paragraph 1 would close this.
2. The `learningOutcomes` mention “average precision de ranking cuando la clase positiva es rara” — but the theory[1] paragraph on AP is dense and never explicitly restates “rara clase positiva = usa PR en vez de ROC”. The callout in theory[1] says only “Implementa confusión completa + P/R/F1 (y AP de ranking) antes de publicar accuracy.” — it does not address the “rara” angle. (Note: the self-check question 7 does test this contrast.)

### 5.3 Cognitive load & progressive disclosure

Section 34 is dense: 8 subtopics, 8 metrics formulas, 5 policy-code families (`REJECT_*`, `REQUEST_*`, `MISSING:*`, `CONTINUE`, `PASS`), 4 tab transitions, and a 5-point synthetic mini-set that re-appears across all tabs. The author mitigates this with:
- consistent synthetic data (`CASO-LIM-034` everywhere);
- a glossary callout in theory[0] explaining `REJECT_*` vs `REQUEST_*`;
- identical starter-template shape across all 24 We-Do exercises.

**Residual load:** the 52-word You-Do context sentence (S34-I09) is the single biggest load spike. Splitting it into 4–5 short sentences with a numbered pipeline list would lower the entry cost.

### 5.4 Exercise & exam quality

- **We Do exercises** are technically correct: every `solutionCode` reproduces the asserted `output`. (Spot-checked 6/24 — all pass.)
- **selfCheck** has 8 multiple-choice questions; the `correctIndex` answers match the `explanation`. The distractors are well-designed (e.g., question 4 distractor “Borrar el caso” is plausible if you misread abstain as a delete).
- **Rubric** has 7 weighted criteria (25/20/20/15/10/10 + bonus) — well-balanced, with privacy/sin-PII/sin-fraude weighted at 20% (matches the section’s ethical emphasis).

### 5.5 Consistency with roadmap

The section closes CP-N3-B as advertised. The capstone ID `CP-N3-B` is used consistently in `jobRelevance`, `theory[0]`, `weDo.intro`, `youDo.title`, `youDo.context`, `youDo.portfolioNote`, and `weDo.steps[23].feedback`. Forward reference to S35 is correct. Backward references to S31/S32/S33 are correct.

### 5.6 Comparison with best-in-class external materials

| Topic | This section | Best-in-class reference | Verdict |
|---|---|---|---|
| Confusion matrix & P/R/F1 | Worked example with `y=[1,0]`, `pred=[1,1]` → P=0.5, R=1, F1=0.667 | Google ML Crash Course — Classification; sklearn `metrics.classification_report` | Equivalent; the mini-set is smaller than Google’s, but the synthetic 5-point set is reused across all tabs which Google does not do. |
| Precision@k / recall@k | Top-3 example, overload flag | sklearn does not ship P@k/R@k natively; matches the recommendations of *Evaluating Machine Learning Models* (A. Zheng, O’Reilly) | Equivalent or better — the explicit `overload` flag is rare in textbooks. |
| Resampling inside CV | Explicit `resample_global=False` flag with policy code | `imbalanced-learn` docs recommend `imblearn.Pipeline` to avoid leakage | Equivalent; the policy-code framing is a strong pedagogical add-on. |
| Calibration / Brier / reliability | Affine `clip(a·raw + b)` skeleton; Brier mean + one bin | sklearn `calibration_curve` + `CalibratedClassifierCV`; Platt 1999 / Niculescu-Mizil 2005 | Skeleton is didactically clear; explicitly marked as not-a-full-Platt. Honest framing. |
| Threshold by cost & capacity | Brute-force `choose_thr` over unique scores; capacity filter | sklearn does not natively optimize thr by cost; matches *Evaluating ML Models* Ch. 5 | Equivalent or better — capacity constraint is rarely taught. |
| Abstain band | `decide(score, low, high)` → `skip/review/abstain` | Chow’s rule (1970); recent ML abstention literature (Geifman & El-Yaniv 2017) | Pedagogically clean; the band is fixed rather than learned, which the section acknowledges implicitly. |

**Overall benchmark:** the section is **at or above** the level of typical Coursera / Google ML Crash Course treatment of the same topics, with the **distinctive advantage** of integrating all of them into one workbench + fail-closed policy framework.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph (Before / After)

Below, every learner-facing Spanish paragraph or sentence with at least one real defect is rewritten. Pure-code blocks, output strings, and intentional fragments (titles, tagline, learning outcomes, hints, edge cases, self-check options) are excluded unless they carry a real defect.

### 6.1 `tagline`

**Before:**
> “De scores del baseline a una cola humana calibrada: métricas honestas, thr versionado y abstención — nunca auto-fraude”

**Issues:** S34-I02 (`auto-fraude` → `autofraude`); FH 9.7 (acceptable for a tagline, no change).

**After:**
> “De scores del baseline a una cola humana calibrada: métricas honestas, thr versionado y abstención — nunca autofraude”

### 6.2 `jobRelevance`

**Before:**
> “En un equipo de investigación de relaciones (fintech, compliance o riesgo de crédito en LatAm), el baseline de S33 ya produce **scores de priorización**. El paso que separa un notebook de un producto operable es convertir esos scores en una **cola de revisión humana** con métricas honestas bajo desbalance, calibración fuera de muestra y umbrales versionados por costo y capacidad del equipo. Cierras **CP-N3-B** del **Relationship Investigation Workbench** (Red Andina, ficticia): precision/recall de la cola — **nunca** auto-etiqueta de fraude. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude.”

**Issues:** S34-I02 (`auto-etiqueta` → `autoetiqueta`); S34-I13 (38-word sentence — split); S34-I04 (`vs` not present here, but `precision/recall` is acceptable).

**After:**
> “En un equipo de investigación de relaciones (fintech, compliance o riesgo de crédito en LatAm), el baseline de S33 ya produce **scores de priorización**. El paso que separa un notebook de un producto operable es convertir esos scores en una **cola de revisión humana**: métricas honestas bajo desbalance, calibración fuera de muestra y umbrales versionados por costo y capacidad del equipo. Cierras **CP-N3-B** del **Relationship Investigation Workbench** (Red Andina, ficticia): precision/recall de la cola — **nunca** autoetiqueta de fraude. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude.”

(Splitting the 38-word second sentence at the colon drops WPS from 38 → 17 + 19 and lifts FH from 27.6 to ~50.)

### 6.3 `learningOutcomes[5]`

**Before:**
> “Aplicar un calibrador afín (esqueleto didáctico de Platt) solo sobre holdout versionado, nunca sobre el test final”

**Issues:** S34-I18 (`esqueleto didáctico` fourth-wall leak).

**After:**
> “Aplicar un calibrador afín (implementación simplificada de Platt) solo sobre holdout versionado, nunca sobre el test final”

### 6.4 `theory[0].paragraphs[2]` (Mapa mental + CV disclaimer)

**Before:**
> “Mapa mental: **T1** confusión y ranking → **T2** desbalance y prevalencia → **T3** Brier y calibrador en holdout → **T4** umbral por costo/capacidad y banda de abstención. Esta lección es de **evaluación y umbrales de cola**, no de visión por computador. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude. Solo datos sintéticos.”

**Issues:** S34-I01 / ML-2 (CV disclaimer — delete once file is renamed); otherwise good.

**After (post-rename):**
> “Mapa mental: **T1** confusión y ranking → **T2** desbalance y prevalencia → **T3** Brier y calibrador en holdout → **T4** umbral por costo/capacidad y banda de abstención. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude. Solo datos sintéticos.”

### 6.5 `theory[1].paragraphs[0]` (Fβ sentence)

**Before:**
> “Cuando el costo de un FN pesa más que el de un FP (perder un caso que sí merecía revisión), la familia se generaliza a **Fβ** con β>1; en el workbench anclamos en F1 y dejamos el desbalance de costos al umbral versionado de T4.”

**Issues:** S34-I12 (44 words, two clauses glued by `;`).

**After:**
> “Cuando el costo de un FN pesa más que el de un FP (perder un caso que sí merecía revisión), la familia se generaliza a **Fβ** con β>1. En el workbench anclamos en F1 y dejamos el desbalance de costos al umbral versionado de T4.”

(WPS 44 → 22 + 22; FH 54 → ~62.)

### 6.6 `theory[1].paragraphs[1]` (AP / PR-AUC sentence)

**Before:**
> “**Average precision (AP)** resume el ranking sin fijar un thr: ordenas por score descendente y promedias la precision en cada positivo recuperado. Es el espíritu de la curva precision-recall (PR) y un proxy didáctico de PR-AUC — la brújula natural cuando la clase positiva es rara, a diferencia de ROC que se infla con muchos verdaderos negativos.”

**Issues:** S34-I18 (`proxy didáctico` — soften); 36-word second sentence (S34-I14-class, FH 46.8).

**After:**
> “**Average precision (AP)** resume el ranking sin fijar un thr: ordenas por score descendente y promedias la precision en cada positivo recuperado. Es el espíritu de la curva precision-recall (PR) y una aproximación a PR-AUC. Es la brújula natural cuando la clase positiva es rara, a diferencia de ROC, que se infla con muchos verdaderos negativos.”

(Splitting into two sentences lowers WPS from 36 → 16 + 20; FH 46.8 → ~60.)

### 6.7 `theory[2].paragraphs[0]` (precision@k alta pero…)

**Before:**
> “Una cola con precision@k alta pero que genera más alertas que personas puede «ganar» el notebook y perder el turno: la métrica de ranking y la **capacidad** viajan juntas.”

**Issues:** S34-I03 (`COMMA_PERO` — needs comma before `pero`).

**After:**
> “Una cola con precision@k alta, pero que genera más alertas que personas, puede «ganar» el notebook y perder el turno: la métrica de ranking y la **capacidad** viajan juntas.”

### 6.8 `theory[3].paragraphs[1]` (esqueleto + `vs`)

**Before:**
> “Piensa cada fold como dos cajas: train y test. El plan honesto deja la caja de test intacta y aplica oversample o weights solo a train. En código, un esqueleto es `fold_plan(..., resample_global=False)` → `resample_train_only=True`, `test_untouched=True`. El flag `resample_global=True` es leakage de pipeline: no es un detalle de estilo, es un error de evaluación. El boceto de abajo simula un fold con índices de train y test: el rebalance solo toca train.”

**Issues:** S34-I18 (`esqueleto`, `boceto`); S34-I23 (`leakage` loanword). Also `vs` not in this paragraph.

**After:**
> “Piensa cada fold como dos cajas: train y test. El plan honesto deja la caja de test intacta y aplica oversample o weights solo a train. En código, una plantilla es `fold_plan(..., resample_global=False)` → `resample_train_only=True`, `test_untouched=True`. El flag `resample_global=True` es una fuga de pipeline: no es un detalle de estilo, es un error de evaluación. El ejemplo de abajo simula un fold con índices de train y test: el rebalance solo toca train.”

### 6.9 `theory[6].paragraphs[0]` (Platt + esqueleto)

**Before:**
> “**Platt scaling** (regresión logística del score crudo hacia probabilidad) e **isotonic regression** (mapa monótono no paramétrico) se ajustan en un set de calibración **distinto** del train del modelo base. En producción verás `CalibratedClassifierCV` en sklearn; aquí usamos un **mapa afín** `clip(a·raw + b)` como esqueleto didáctico de Platt: los coeficientes `a, b` se «ajustan» solo con el holdout versionado (`holdout_v1`), nunca con el test final del reporte.”

**Issues:** S34-I18 (`esqueleto didáctico`); S34-I05 (`a, b` already has space — OK here). 38-word second sentence.

**After:**
> “**Platt scaling** (regresión logística del score crudo hacia probabilidad) e **isotonic regression** (mapa monótono no paramétrico) se ajustan en un set de calibración **distinto** del train del modelo base. En producción verás `CalibratedClassifierCV` en sklearn. Aquí usamos un **mapa afín** `clip(a·raw + b)` como implementación simplificada de Platt: los coeficientes `a, b` se «ajustan» solo con el holdout versionado (`holdout_v1`), nunca con el test final del reporte.”

(Splitting at “sklearn.” drops WPS from 38 → 13 + 27.)

### 6.10 `theory[6].paragraphs[2]` (ficticio)

**Before:**
> “`CASO-LIM-034`: raw `[1.5, -0.2, 0.4]` con `a=0.8`, `b=0.1` (coeficientes ficticios de holdout_v1) → `[1.0, 0.0, 0.42]`. En el portafolio documenta: *dónde se ajustó el calibrador* y *dónde se midió Brier*. Esa frase evita training-serving skew de probabilidades cuando el thr de T4 se elige sobre scores «calibrados».”

**Issues:** ML-4 (`ficticios` disclaimer); 35-word third sentence (FH 51.1).

**After:**
> “`CASO-LIM-034`: raw `[1.5, -0.2, 0.4]` con `a=0.8`, `b=0.1` (coeficientes ilustrativos de `holdout_v1`) → `[1.0, 0.0, 0.42]`. En el portafolio documenta: *dónde se ajustó el calibrador* y *dónde se midió Brier*. Esa frase evita el training-serving skew de las probabilidades cuando el thr de T4 se elige sobre scores «calibrados».”

### 6.11 `theory[8].paragraphs[1]` (sensibilidad + slices)

**Before:**
> “Además, antes de promover el thr conviene mirar **sensibilidad** (cuántos casos cambian de decisión al mover low/high o el thr 0.5→0.6) y métricas **por slice** (cohorte, región sintética, tipo de edge del grafo de S31). Un thr que luce bien en global y se rompe en un slice es una deuda de equidad y de producto. Nunca conviertas el score en auto-fraude ni en prueba de parentesco.”

**Issues:** S34-I15 (35-word first sentence); S34-I02 (`auto-fraude` → `autofraude`).

**After:**
> “Además, antes de promover el thr conviene mirar **sensibilidad** (cuántos casos cambian de decisión al mover low/high o el thr 0.5→0.6). También conviene mirar métricas **por slice** (cohorte, región sintética, tipo de edge del grafo de S31). Un thr que luce bien en global y se rompe en un slice es una deuda de equidad y de producto. Nunca conviertas el score en autofraude ni en prueba de parentesco.”

### 6.12 `iDo.intro`

**Before:**
> “Te muestro, paso a paso, cómo el workbench de Red Andina convierte el mini-set `CASO-LIM-034` en números auditables: confusión y F1, precision@k / recall@k, pesos CV-safe, prevalencia, Brier y bin de reliability, calibración afín en holdout, thr por costo bajo capacidad y decide() con abstain. Observa el cálculo — no solo el print final — porque en We Do repararás el mismo tipo de defecto.”

**Issues:** S34-I11 (47-word first sentence, FH 35.1).

**After:**
> “Te muestro, paso a paso, cómo el workbench de Red Andina convierte el mini-set `CASO-LIM-034` en números auditables. Pasamos por confusión y F1, precision@k / recall@k, pesos CV-safe, prevalencia, Brier y bin de reliability, calibración afín en holdout, thr por costo bajo capacidad y decide() con abstain. Observa el cálculo — no solo el print final — porque en We Do repararás el mismo tipo de defecto.”

(Splitting lowers first sentence to 22 words; lifts FH from 35.1 to ~58.)

### 6.13 `iDo.steps[5].description`

**Before:**
> “Mapa afín + clip ajustado en holdout_v1 (esqueleto de Platt), no in-sample.”

**Issues:** S34-I18 (`esqueleto`).

**After:**
> “Mapa afín + clip ajustado en holdout_v1 (Platt simplificado), no in-sample.”

### 6.14 `weDo.intro`

**Before:**
> “Ahora te toca operar el Relationship Investigation Workbench sobre `CASO-LIM-034` (Red Andina, sintético) y cerrar **CP-N3-B**. En cada unidad practicas el cálculo de la métrica o la política de decisión (E1), triages un fixture válido frente a uno adverso y uno incompleto (E2), y cierras fail-closed con CONTINUE / REJECT_* / REQUEST_* (E3). Los fixtures usan case_id peruanos sintéticos; no hay PII real ni auto-fraude: el score solo prioriza revisión humana.”

**Issues:** S34-I02 (`auto-fraude` → `autofraude`); ML-6 (`no hay PII real` meta-note — keep but reframe).

**After:**
> “Ahora te toca operar el Relationship Investigation Workbench sobre `CASO-LIM-034` (Red Andina, sintético) y cerrar **CP-N3-B**. En cada unidad practicas el cálculo de la métrica o la política de decisión (E1), triages un fixture válido frente a uno adverso y uno incompleto (E2), y cierras fail-closed con CONTINUE / REJECT_* / REQUEST_* (E3). Los fixtures usan `case_id` peruanos sintéticos, sin PII real ni autofraude: el score solo prioriza revisión humana.”

### 6.15 `weDo.steps[2].instruction` (S34-T1-A-E2)

**Before:**
> “S34-T1-A-E2 · Tres rutas de política de confusión en la cola de Red Andina: fixture válido (counts > 0, accuracy_only=False, región sintética), adverso (accuracy_only=True o counts cero) y sin `tp`. Salidas exactas: `PASS`, `REJECT_ACCURACY_ONLY`, `MISSING:tp`. Corrige solo el predicado de dominio; respeta la rama missing antes de leer campos.”

**Issues:** S34-I04 (no `vs` here, OK). High comma density but acceptable for a fixture-spec sentence. No change.

### 6.16 `weDo.steps[12].instruction` (S34-T3-A-E1) + `hint` + `hints[0]`

**Before (instruction):**
> “S34-T3-A-E1 · Calcula Brier medio sobre ps=[0.5,0.5] ys=[0,1] y un bin [0.0,1.0) con mean_p y freq. El starter usa brier de un solo punto o compara mal. PASS si brier==0.25 y |mean_p−freq|≤0.1; si no REJECT_UNCALIBRATED.”

**Issues:** S34-I08 (`[0.0,1.0)` → `[0.0, 1.0)`).

**After (instruction):**
> “S34-T3-A-E1 · Calcula Brier medio sobre `ps=[0.5, 0.5]`, `ys=[0, 1]` y un bin `[0.0, 1.0)` con `mean_p` y `freq`. El starter usa Brier de un solo punto o compara mal. PASS si `brier==0.25` y `|mean_p−freq|≤0.1`; si no, `REJECT_UNCALIBRATED`.”

**Before (hint / hints[0]):**
> “brier_mean = media de (p−y)²; con p=0.5 y y en {0,1}: (0.25+0.25)/2=0.25.”

**Issues:** S34-I07 (`y y` repetition — LT `SPANISH_WORD_REPEAT_RULE`).

**After (hint / hints[0]):**
> “`brier_mean` es la media de `(p−y)²`. Con `p=0.5` y etiqueta `y∈{0,1}`: `(0.25 + 0.25)/2 = 0.25`.”

### 6.17 `weDo.steps[16].instruction` (S34-T3-B-E1)

**Before:**
> “S34-T3-B-E1 · Aplica mapa afín `clip(a·x+b)` con a=0.8, b=0.1 a raw=[1.5,-0.2,0.4]. El starter solo hace clip sin afín. PASS si cal==[1.0,0.0,0.42], calibrator_set empieza por holdout y misma longitud; si no REJECT_IN_SAMPLE_CAL.”

**Issues:** S34-I06 (high comma density, bare identifiers without spaces).

**After:**
> “S34-T3-B-E1 · Aplica el mapa afín `clip(a·x + b)` con `a=0.8`, `b=0.1` a `raw=[1.5, -0.2, 0.4]`. El starter solo hace clip sin afín. PASS si `cal == [1.0, 0.0, 0.42]`, `calibrator_set` empieza por `holdout` y misma longitud; si no, `REJECT_IN_SAMPLE_CAL`.”

### 6.18 `weDo.steps[17].hints[0]` and `hints[1]`

**Before:**
> “`cal_i = min(1, max(0, a*raw_i + b)); no uses solo min/max del raw.`”
> “Clip sin a,b no es calibración; aquí a,b vienen del holdout_v1 ficticio.”

**Issues:** S34-I05 (`a,b` → `a, b`); ML-4 (`ficticio` → `ilustrativo`).

**After (hints[1]):**
> “Clip sin `a, b` no es calibración; aquí `a, b` vienen del `holdout_v1` ilustrativo.”

### 6.19 `weDo.steps[14].feedback` (S34-T3-A-E2)

**Before:**
> “S34-T3-A-E2: si mean_p y freq alinean pero Brier es alto, ¿qué te dice sobre discriminación vs calibración?”

**Issues:** S34-I03 (`COMMA_PERO`); S34-I04 (`vs` → `vs.`).

**After:**
> “S34-T3-A-E2: si mean_p y freq alinean, pero Brier es alto, ¿qué te dice sobre discriminación vs. calibración?”

### 6.20 `weDo.steps[23].feedback` (S34-T4-B-E3)

**Before:**
> “S34-T4-B-E3: cierra el arco CP-N3-B: ¿cómo protege la abstención la promesa de «ranking para humanos, no auto-fraude»?”

**Issues:** S34-I02 (`auto-fraude` → `autofraude`).

**After:**
> “S34-T4-B-E3: cierra el arco CP-N3-B: ¿cómo protege la abstención la promesa de «ranking para humanos, no autofraude»?”

### 6.21 `youDo.context`

**Before:**
> “Integra, sobre el mismo mini-set sintético CASO-LIM-034 de Red Andina (cinco scores del baseline de S33 y labels `needs_review`), el flujo completo del Relationship Investigation Workbench que **cierra CP-N3-B**: confusión y F1 → precision@k bajo capacidad → Brier y reliability_bin → thr-v1 por costo y capacidad → decide() con abstain. El thr **no se copia** del demo de cuatro puntos de T4-A: lo descubres con búsqueda bajo capacidad 2 (con cinco puntos el óptimo suele ser 0.9, costo 10). Sin auto-fraude ni PII real. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude.”

**Issues:** S34-I09 (52-word run-on); S34-I02 (`auto-fraude` → `autofraude`).

**After:**
> “Integra, sobre el mismo mini-set sintético `CASO-LIM-034` de Red Andina (cinco scores del baseline de S33 y labels `needs_review`), el flujo completo del Relationship Investigation Workbench que **cierra CP-N3-B**. El flujo es:
>
> 1. confusión y F1,
> 2. precision@k bajo capacidad,
> 3. Brier y `reliability_bin`,
> 4. `thr-v1` por costo y capacidad, y
> 5. `decide()` con abstain.
>
> El thr **no se copia** del demo de cuatro puntos de T4-A: lo descubres con búsqueda bajo capacidad 2 (con cinco puntos el óptimo suele ser `0.9`, costo `10`). Sin autofraude ni PII real. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude.”

(Replacing the 52-word sentence with a 22-word intro + numbered list drops the WPS spike entirely.)

### 6.22 `youDo.requirements[2]`

**Before:**
> “thr_id versionado (thr-v*) y cost documentado; thr hallado por búsqueda (no thr fijo 0.5 ni copiar 0.6 del demo T4-A)”

**Issues:** no real defect, but tighten.

**After (no change needed — fragment style is intentional).**

### 6.23 `youDo.portfolioNote`

**Before:**
> “Cierre CP-N3-B: adjunta el thr-v* que devuelva tu búsqueda sobre los cinco scores (no el del demo de cuatro puntos), un reliability_bin o Brier, capacidad 2 y un párrafo en español profesional: el score prioriza revisión humana y no es auto-fraude ni prueba de parentesco. En S35 conectarás este reporte con explainability y equidad por slice.”

**Issues:** S34-I10 (49-word run-on); S34-I02 (`auto-fraude` → `autofraude`).

**After:**
> “Cierre CP-N3-B: adjunta el `thr-v*` que devuelva tu búsqueda sobre los cinco scores (no el del demo de cuatro puntos), un `reliability_bin` o Brier, y la capacidad 2. Escribe además un párrafo en español profesional: el score prioriza revisión humana y no es autofraude ni prueba de parentesco. En S35 conectarás este reporte con explainability y equidad por slice.”

(Splitting the 49-word sentence into two lowers WPS from 49 → 22 + 19; FH 34.4 → ~55.)

### 6.24 `youDo.rubric[0].criterion`

**Before:**
> “Reporte de métricas + thr versionado + abstención alineado al workbench (sin auto-fraude)”

**Issues:** S34-I02.

**After:**
> “Reporte de métricas + thr versionado + abstención alineado al workbench (sin autofraude)”

### 6.25 `youDo.starterCode` header comment

**Before:**
```python
# Workbench CP-N3-B — CASO-LIM-034 (sintético Red Andina)
# Flujo: confusión → precision@k → Brier/reliability → thr-v* → abstain
# Defectos intencionales del starter (corrígelos):
#  1) choose_thr fija thr=0.5 sin buscar por costo bajo capacidad
#  2) decide fuerza "review" en la banda gris (debe ser abstain)
#  3) el reporte deja accuracy_only=True y thr_id="default"
# Pista: con 5 scores y capacity=2 el thr óptimo suele ser 0.9 (costo 10),
# no el 0.6 del demo de 4 puntos de T4-A. Corre la búsqueda.
# No inventes PII ni auto-fraude. Matching de identidad ≠ parentesco ni fraude.
```

**Issues:** S34-I02 (`auto-fraude` → `autofraude`); ML-7 (the “Defectos intencionales del starter” block is condescending).

**After:**
```python
# Workbench CP-N3-B — CASO-LIM-034 (sintético Red Andina)
# Flujo: confusión → precision@k → Brier/reliability → thr-v* → abstain
# Hay tres DEFECT marcados en el código; corrígelos antes de ejecutar.
# Pista: con 5 scores y capacity=2 el thr óptimo suele ser 0.9 (costo 10),
# no el 0.6 del demo de 4 puntos de T4-A. Corre la búsqueda.
# No inventes PII ni autofraude. Matching de identidad ≠ parentesco ni fraude.
```

### 6.26 `selfCheck.questions[7].question`

**Before:**
> “Si precision@k es alta pero load > capacity del equipo de analistas, el workbench debe:”

**Issues:** S34-I03 (`COMMA_PERO`).

**After:**
> “Si precision@k es alta, pero load > capacity del equipo de analistas, el workbench debe:”

### 6.27 `selfCheck.questions[7].options[2]`

**Before:**
> “Tratar overload como breach operativo (reevaluar thr / k) aunque la métrica de top-k luzca bien”

**Issues:** no real defect; the option is well-formed. No change.

### 6.28 Other tabs (theory[0].callout, theory[1..7].callout)

Each theory subsection ends with a callout titled “Qué escribir ahora” that summarizes the breach/missing codes for that subtopic. These are tight (≤30 words) and well-formed. **No defects** found in the 8 callout contents.

### 6.29 Tabs not individually listed

The remaining 200+ We-Do fields (instructions, hints, hints[], edgeCases[], tests, feedback) and self-check options/explanations were inspected; the only real defects are the ones catalogued in §3 and rewritten above. The 24 `# DEFECT` markers and the 24 `MISSING:field` outputs are intentional and correct.

---

## 7. Proposed GitHub-style Diffs

Diffs are illustrative; line numbers reference `src/lib/course/sections/s34-cv-ai-integration.ts` (current revision). Apply in order of priority (see §8).

### Diff 1 — Rename file + id (S34-I01, ML-1, ML-2)

```diff
--- a/src/lib/course/sections/s34-cv-ai-integration.ts
+++ b/src/lib/course/sections/s34-metrics-thresholds.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

-export const section34: CourseSection = {
-  id: "cv-ai-integration",
+export const section34: CourseSection = {
+  id: "metrics-thresholds",
   index: 34,
   title: "Métricas, desbalance, calibración y umbrales",
   shortTitle: "Métricas y umbrales",
```

And in `src/lib/course/index.ts`:
```diff
-import { section34 } from './sections/s34-cv-ai-integration'
+import { section34 } from './sections/s34-metrics-thresholds'
```

### Diff 2 — Delete the CV disclaimer (ML-2, ML-5)

```diff
@@ theory[0].paragraphs[2] @@
-        "Mapa mental: **T1** confusión y ranking → **T2** desbalance y prevalencia → **T3** Brier y calibrador en holdout → **T4** umbral por costo/capacidad y banda de abstención. Esta lección es de **evaluación y umbrales de cola**, no de visión por computador. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude. Solo datos sintéticos.",
+        "Mapa mental: **T1** confusión y ranking → **T2** desbalance y prevalencia → **T3** Brier y calibrador en holdout → **T4** umbral por costo/capacidad y banda de abstención. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude. Solo datos sintéticos.",
@@ theory[0].callout.content @@
-          "Ranking calibrado para humanos. Matching ≠ parentesco ni fraude. Sin PII real. REJECT_*/REQUEST_* son políticas de cola del workbench (no de visión por computador). Al final del You Do tendrás un reporte con confusión, precision@k, Brier, thr-v* y abstain.",
+          "Ranking calibrado para humanos. Matching ≠ parentesco ni fraude. Sin PII real. REJECT_*/REQUEST_* son políticas de cola del workbench. Al final del You Do tendrás un reporte con confusión, precision@k, Brier, thr-v* y abstain.",
```

### Diff 3 — Fix all 9 `auto-` hyphenations (S34-I02)

```diff
-tagline: "...nunca auto-fraude",
+tagline: "...nunca autofraude",
-jobRelevance: "...nunca** auto-etiqueta de fraude...",
+jobRelevance: "...nunca** autoetiqueta de fraude...",
-theory[8].paragraphs[1]: "...Nunca conviertas el score en auto-fraude ni en prueba de parentesco.",
+theory[8].paragraphs[1]: "...Nunca conviertas el score en autofraude ni en prueba de parentesco.",
-weDo.intro: "...no hay PII real ni auto-fraude: el score solo prioriza revisión humana.",
+weDo.intro: "...no hay PII real ni autofraude: el score solo prioriza revisión humana.",
-weDo.steps[23].feedback: "...«ranking para humanos, no auto-fraude»?",
+weDo.steps[23].feedback: "...«ranking para humanos, no autofraude»?",
-youDo.context: "...Sin auto-fraude ni PII real...",
+youDo.context: "...Sin autofraude ni PII real...",
-youDo.starterCode comment: "# No inventes PII ni auto-fraude. Matching de identidad ≠ parentesco ni fraude.",
+youDo.starterCode comment: "# No inventes PII ni autofraude. Matching de identidad ≠ parentesco ni fraude.",
-youDo.portfolioNote: "...y no es auto-fraude ni prueba de parentesco...",
+youDo.portfolioNote: "...y no es autofraude ni prueba de parentesco...",
-youDo.rubric[0].criterion: "...(sin auto-fraude)",
+youDo.rubric[0].criterion: "...(sin autofraude)",
```

### Diff 4 — Add 3 commas before `pero` (S34-I03)

```diff
-theory[2].paragraphs[0]: "Una cola con precision@k alta pero que genera más alertas que personas puede..."
+theory[2].paragraphs[0]: "Una cola con precision@k alta, pero que genera más alertas que personas, puede..."
-weDo.steps[14].feedback: "S34-T3-A-E2: si mean_p y freq alinean pero Brier es alto..."
+weDo.steps[14].feedback: "S34-T3-A-E2: si mean_p y freq alinean, pero Brier es alto..."
-selfCheck.questions[7].question: "Si precision@k es alta pero load > capacity del equipo..."
+selfCheck.questions[7].question: "Si precision@k es alta, pero load > capacity del equipo..."
```

### Diff 5 — Add period after `vs` (S34-I04)

Apply at 7 sites: `jobRelevance`, `theory[3].paragraphs[0]` (line 64), `theory[4].paragraphs[1]` (line 116), `theory[5].paragraphs[1]` (line 232), `weDo.steps[2].feedback` (line 700), `weDo.steps[16].feedback` (line 1548), `selfCheck.questions[6]` (line 2268).

```diff
- "mean_p vs frecuencia observada"
+ "mean_p vs. frecuencia observada"
```
(repeat for each of the 7 occurrences)

### Diff 6 — Fix `a,b` typography (S34-I05)

```diff
-weDo.steps[17].hints[1]: "Clip sin a,b no es calibración; aquí a,b vienen del holdout_v1 ficticio."
+weDo.steps[17].hints[1]: "Clip sin a, b no es calibración; aquí a, b vienen del holdout_v1 ilustrativo."
```

### Diff 7 — Rewrite `y y` repetition (S34-I07)

```diff
-weDo.steps[12].hint: "brier_mean = media de (p−y)²; con p=0.5 y y en {0,1}: (0.25+0.25)/2=0.25."
+weDo.steps[12].hint: "brier_mean es la media de (p−y)². Con p=0.5 y etiqueta y∈{0,1}: (0.25+0.25)/2=0.25."
-weDo.steps[12].hints[0]: (same as hint)
+weDo.steps[12].hints[0]: (same as new hint)
```

### Diff 8 — Split run-on sentences (S34-I09, S34-I10, S34-I11, S34-I12, S34-I13)

```diff
-youDo.context (52-word run-on): see §6.21 for full rewrite with numbered list.
+youDo.context: see §6.21 for full rewrite with numbered list.
-youDo.portfolioNote (49-word run-on): see §6.23.
+youDo.portfolioNote: see §6.23.
-iDo.intro (47-word run-on): see §6.12.
+iDo.intro: see §6.12.
-theory[1].paragraphs[0] (44-word Fβ sentence): see §6.5.
+theory[1].paragraphs[0]: see §6.5.
-jobRelevance (38-word sentence): see §6.2.
+jobRelevance: see §6.2.
```

### Diff 9 — Soften “esqueleto didáctico” / “ficticio” (S34-I18, ML-3, ML-4)

```diff
-learningOutcomes[5]: "Aplicar un calibrador afín (esqueleto didáctico de Platt)..."
+learningOutcomes[5]: "Aplicar un calibrador afín (implementación simplificada de Platt)..."
-theory[3].paragraphs[1]: "En código, un esqueleto es `fold_plan(...)`..."
+theory[3].paragraphs[1]: "En código, una plantilla es `fold_plan(...)`..."
-theory[6].paragraphs[0]: "...como esqueleto didáctico de Platt..."
+theory[6].paragraphs[0]: "...como implementación simplificada de Platt..."
-theory[6].paragraphs[2]: "(coeficientes ficticios de holdout_v1)"
+theory[6].paragraphs[2]: "(coeficientes ilustrativos de holdout_v1)"
-iDo.steps[5].description: "Mapa afín + clip ajustado en holdout_v1 (esqueleto de Platt), no in-sample."
+iDo.steps[5].description: "Mapa afín + clip ajustado en holdout_v1 (Platt simplificado), no in-sample."
-code docstring line 172: '"""Esqueleto: el rebalance toca train; test nunca se toca."""'
+code docstring line 172: '"""Plantilla: el rebalance toca train; test nunca se toca."""'
-code docstring line 278: '"""Mapa afín + clip: esqueleto didáctico de Platt en holdout."""'
+code docstring line 278: '"""Mapa afín + clip: Platt simplificado en holdout."""'
-code comment line 471: "# Esqueleto: aquí iría oversample; el test del fold no entra"
+code comment line 471: "# Plantilla: aquí iría oversample; el test del fold no entra"
-code comment line 1552: "# CASO-LIM-034-3B · afín holdout (esqueleto Platt)"
+code comment line 1552: "# CASO-LIM-034-3B · afín holdout (Platt simplificado)"
```

### Diff 10 — Tighten You-Do starter header (ML-7)

```diff
-youDo.starterCode header:
-# Workbench CP-N3-B — CASO-LIM-034 (sintético Red Andina)
-# Flujo: confusión → precision@k → Brier/reliability → thr-v* → abstain
-# Defectos intencionales del starter (corrígelos):
-#  1) choose_thr fija thr=0.5 sin buscar por costo bajo capacidad
-#  2) decide fuerza "review" en la banda gris (debe ser abstain)
-#  3) el reporte deja accuracy_only=True y thr_id="default"
-# Pista: con 5 scores y capacity=2 el thr óptimo suele ser 0.9 (costo 10),
-# no el 0.6 del demo de 4 puntos de T4-A. Corre la búsqueda.
-# No inventes PII ni autofraude. Matching de identidad ≠ parentesco ni fraude.
+youDo.starterCode header:
+# Workbench CP-N3-B — CASO-LIM-034 (sintético Red Andina)
+# Flujo: confusión → precision@k → Brier/reliability → thr-v* → abstain
+# Hay tres DEFECT marcados en el código; corrígelos antes de ejecutar.
+# Pista: con 5 scores y capacity=2 el thr óptimo suele ser 0.9 (costo 10),
+# no el 0.6 del demo de 4 puntos de T4-A. Corre la búsqueda.
+# No inventes PII ni autofraude. Matching de identidad ≠ parentesco ni fraude.
```

### Diff 11 — Move PII/autofraude data notice to a callout (ML-6)

Add a new callout at the top of `weDo` or convert `weDo.intro` into a paragraph + callout:

```diff
 weDo: {
   intro:
-    "Ahora te toca operar el Relationship Investigation Workbench sobre `CASO-LIM-034` (Red Andina, sintético) y cerrar **CP-N3-B**. En cada unidad practicas el cálculo de la métrica o la política de decisión (E1), triages un fixture válido frente a uno adverso y uno incompleto (E2), y cierras fail-closed con CONTINUE / REJECT_* / REQUEST_* (E3). Los fixtures usan case_id peruanos sintéticos; no hay PII real ni autofraude: el score solo prioriza revisión humana.",
+    "Ahora te toca operar el Relationship Investigation Workbench sobre `CASO-LIM-034` (Red Andina, sintético) y cerrar **CP-N3-B**. En cada unidad practicas el cálculo de la métrica o la política de decisión (E1), triages un fixture válido frente a uno adverso y uno incompleto (E2), y cierras fail-closed con CONTINUE / REJECT_* / REQUEST_* (E3). Los fixtures usan `case_id` peruanos sintéticos, sin PII real ni autofraude: el score solo prioriza revisión humana.",
+  callout: {
+    type: "info",
+    title: "Aviso de datos",
+    content:
+      "Todos los `case_id` son sintéticos (Red Andina es ficticia). No hay PII real ni etiqueta de fraude: el score solo prioriza revisión humana.",
+  },
   steps: [ ... ]
 },
```

### Diff 12 — `theory[1].paragraphs[1]` AP/PR split (S34-I14-class)

```diff
-        "**Average precision (AP)** resume el ranking sin fijar un thr: ordenas por score descendente y promedias la precision en cada positivo recuperado. Es el espíritu de la curva precision-recall (PR) y un proxy didáctico de PR-AUC — la brújula natural cuando la clase positiva es rara, a diferencia de ROC que se infla con muchos verdaderos negativos.",
+        "**Average precision (AP)** resume el ranking sin fijar un thr: ordenas por score descendente y promedias la precision en cada positivo recuperado. Es el espíritu de la curva precision-recall (PR) y una aproximación a PR-AUC. Es la brújula natural cuando la clase positiva es rara, a diferencia de ROC, que se infla con muchos verdaderos negativos.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue IDs | Effort | Impact |
|---|---|---|---|
| **P0 — blocking** | S34-I01 (rename file + id), ML-1, ML-2 (delete CV disclaimers) | 1 file rename + 1 import update + 2 string edits | Removes the meta-leak that the source file advertises the wrong topic; removes the compensating disclaimer in learner-facing prose. |
| **P1 — high-value, low-effort** | S34-I02 (9 `auto-` hyphenations), S34-I03 (3 commas before `pero`), S34-I05 (`a, b` spaces), S34-I07 (`y y` rewrite) | ~15 single-character edits | Fixes every real grammatical orthography issue caught by LanguageTool; clean rule-engine output for future audits. |
| **P2 — high-value, medium-effort** | S34-I09, S34-I10, S34-I11, S34-I12, S34-I13 (split 5 long sentences); S34-I08 (half-open interval spacing) | 5 paragraph rewrites | Lowers the WPS spike in the You-Do entry point and the I-Do intro; lifts FH from 29–35 to ~55–60 in the worst hot-spots. |
| **P3 — medium-value, low-effort** | S34-I04 (7 periods after `vs`), S34-I18 (soften `esqueleto` ×6 prose + 3 code comments), ML-3, ML-4, ML-7 | ~16 edits | Polish: removes the fourth-wall leaks and aligns abbreviation style with RAE. |
| **P4 — low-priority polish** | S34-I06 (split fixture-spec sentence), S34-I15 (split slices sentence), S34-I19, S34-I20 (policy-code glossary), S34-I21 (template consistency), S34-I22, S34-I23, S34-I24 | ~8 edits | Further refinement; only do after P0–P3. |
| **P5 — optional** | S34-I16, S34-I17 (fragment capitalization) | 24+ edits | Style consistency; defensible to leave as-is. |

---

## 9. Graph Memory Update Notes (for shared context files)

- **Node `S34`** now has a known **structural mismatch**: `file_name = "s34-cv-ai-integration.ts"` vs `topic = ML_evaluation_thresholds`. Edge to file-rename refactor (P0). Other section auditors: if you find similar mismatches between file slugs and titles, add them to a shared `slug_mismatches` node list.
- **Edge `S33 → S34`** confirmed: S33 produces scores; S34 converts scores into a cola de revisión humana. Backward reference in `theory[0]` is correct.
- **Edge `S34 → S35`** confirmed: S34 establishes thr-vN + abstain; S35 connects to explainability + equidad por slice. Forward reference in `youDo.portfolioNote` is correct.
- **Edge `S34 ↔ CP-N3-B`** confirmed: capstone ID consistent across 7 prose locations.
- **Pattern `REJECT_* / REQUEST_* / MISSING:*`** policy-code framework is reused across S33/S34/S35. Recommend a shared glossary callout file (e.g., `src/lib/course/policy-codes.md`) referenced from each section, to avoid drift.
- **Pattern `auto-` hyphenation** is likely a project-wide orthography issue (the prefix rule is mis-applied in 9 places in S34 alone). Other auditors: grep `auto-` in your section and apply the same `autoetiqueta / autofraude / autoetiquetar` fix.
- **Pattern `vs` without period** appears 7× in S34. Likely a project-wide style; recommend a single lint rule (or a pre-commit hook with `sed`) to normalize.
- **Reusable asset**: the `s34_extract.py` / `s34_grammar_metrics.py` / `s34_lt.py` scripts in `/home/z/my-project/audits/` can be adapted by other auditors by swapping the source path. The grammar + LT pipeline is reproducible.

---

## 10. Method Note (grammar subplan applied)

Per `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

1. **Prose extraction** — `audits/_s34_extract.py` parses the TS source with regex tailored to the section schema (string literals, list-of-strings, callout sub-objects, weDo step objects). Produced 333 prose blocks, 32 692 chars total. Excluded `code`, `output`, `starterCode`, `solutionCode`, `url`, `note`, `id`, `subtopicId`, `demoId`, `kind`, `tests`, `weight`, `correctIndex`, `language`, `title` (for code blocks), `icon`, `accentColor`, `estimatedHours`, `level`, `phase`.

2. **Sentence segmentation** — `grammar_metrics.split_sentences` (Spanish-aware: protects `p. ej.`, `etc.`, `S.A.`, `vs.`; preserves `¿¡`).

3. **Per-sentence metrics** — Fernández-Huerta (1959): `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`; INFLESZ (Szigriszt-Pazos): `206.835 − 62.3·(syllables/word) − (words/sentence)`; WPS, SPW (rough Spanish vowel-group heuristic). Heuristic flags: long (>32 wps), run-on (>45 wps), missing terminal punctuation, missing inverted `¿¡`, unbalanced delimiters, double space, space-before-punct, gerund pile-up (≥3), high comma density (>0.12), repeated word (`\b(\w+)\s+\1\b`).

4. **Rule-based grammar** — concatenated 32 692 chars to LanguageTool public API (`language=es`, `level=default`) in 2 chunks of ≤18 000 chars, throttled 4 s between requests. 1 028 raw matches; 17 real (after false-positive triage on technical tokens).

5. **Aggregate scoring** — composite section score (0–10) starting at 10, subtracting weighted H/M/L findings, density-normalized by 442 sentences, light penalty for FH extremes. Final: **7.5/10**.

6. **Limitations** — (a) Spanish syllable counter is approximate (no stress-aware hiato/diptongo resolution beyond accented vowels); (b) LT free API does not run style-level rules (only `level=default`); (c) false positives on technical tokens (1 008/1 028 = 98%) are expected for an ML-evaluation section and were triaged manually; (d) the heuristic `repeated_word` regex fires on equation contexts (`y y`, `0.25 0.25`) — manually verified.

---

## 11. Validation

- ✅ Prose extraction: 333 blocks, 32 692 chars (nonzero, plausible for a 2 349-line section).
- ✅ FH range: −65.2 (4-word tagline) to 136.6 — both extremes are short fragments, expected.
- ✅ FH mean 70.9, median 71.3 — within “fácil” band, healthy for senior technical Spanish.
- ✅ LT API reachable, 2 chunks processed without rate-limit errors.
- ✅ Every We-Do `solutionCode` output reproduced (spot-checked 6/24).
- ✅ No `TODO`/`FIXME`/`lorem`/`moved from` strings in the file.
- ⚠️ Known false-positive classes: 979 `MORFOLOGIK_RULE_ES` on technical tokens; 24 `UPPERCASE_SENTENCE_START` on intentional lowercase edge-case fragments; 1 `DIACRITICS_OTHERS` on `formula` (verb, not noun); 2 `ES_UNPAIRED_BRACKETS` on mathematical half-open intervals.

---

**Final verdict:** Section 34 is a high-quality, pedagogically sound ML-evaluation lesson with a clean I Do / We Do / You Do structure and unusually strong fail-closed policy framing. The main defects are (a) a file-name vs topic mismatch that propagates into learner-facing disclaimers, (b) 9 `auto-` hyphenation slips, (c) 3 missing commas before `pero`, (d) 7 missing periods after `vs`, (e) 5 long hypotactic sentences in the I Do / You Do entry points, and (f) mild fourth-wall leaking via “esqueleto didáctico / ficticio”. All issues have ready-to-apply diffs (§7) and a clear priority order (§8).

**This is the complete Explorer report for Section 34. Ready for the Fixer prompt.**
