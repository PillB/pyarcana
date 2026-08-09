# S13 Explorer Report — Familiarity Evidence Dashboard y cierre de nivel

**Auditor role:** Multi-agent Curriculum Auditor (STORM + Graph Engineering + Loop Engineering + Harness Engineering)  
**Scope:** Section 13 only  
**Live site:** https://pillb.github.io/pyarcana/#rpa-automation  
**Source file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s13-rpa-automation.ts`  
**Platform section id (hash):** `rpa-automation`  
**Generated:** 2026-07-24  
**Method:** Live-site navigation + full source read + gold-standard comparison (S01) + competitive pedagogy/domain research (GRR / I–We–You; ER precision–recall + clerical thresholds) + multi-pass issue loop  

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 13 |
| Title (learner-facing) | Familiarity Evidence Dashboard y cierre de nivel |
| shortTitle | Evidence Dashboard |
| Tagline | ER determinista, señales de relación separadas, dashboard pseudonimizado, CP-N1-C + regresión N1 + CF-1 |
| Level / phase | Intermedio · phase 0 (cierre Nivel 1) |
| estimatedHours | 19 |
| Icon / accent | `Bot` · rose→pink gradient |
| Source module | `s13-rpa-automation.ts` (legacy filename) |
| Structural inventory | theory map + **8** subtopics (T1–T4 × A/B) · **8** iDo demos · **24** weDo (E1/E2/E3) · youDo CP-N1-C · **5** selfCheck · resources docs/books/courses |

**Pedagogical spine (as designed):**  
T1 Identidad (ER normalize/block/score + precision/recall + clerical) → T2 Relación (shared contact/geo/surname + graphlet txs) → T3 Decisión (evidence_score, uncertainty, thresholds, no auto_fraud/is_family) → T4 Producto/ops (pseudonymized dashboard, privacy sheet, demo command, runbook, level-1 regression, CF-1).

**Out of scope for this run:** Applying fixes; editing product TS; auditing S14+.

**Pre-round research anchors (domain + pedagogy):**
- Gradual Release of Responsibility (I Do / We Do / You Do): model → guided practice → independent transfer; avoid “sudden release.”
- Entity resolution evaluation: precision/recall on labeled pairs; tiered confidence (accept / review / abstain); FP cost vs merge cost; human clerical queue for ambiguous band.
- Gold bar (local): `GOLD_STANDARD_CHECKLIST.md` — narrative depth, oracle-honest outputs, no developer meta, progressive disclosure, synthetic-only ethics.

---

## 2. Executive Summary of Quality

### Score: **7.3 / 10**

### Key verdict
S13 is a **structurally complete and ethically strong Nivel-1 exit gate**: dual scores (ER ≠ relationship), fail-closed decisions, synthetic-only policy, privacy/CF-1 artifacts, and a clear T1→T4 arc. It correctly retargets away from Playwright/OCR/RPA toward the V3 Familiarity Evidence Dashboard.

It is **not gold-standard** under a skeptical explorer pass. Residual problems that matter to learners:

1. **Developer / curriculum meta-leaks** (V3 retarget notes, “lane”, `section_passed`, platform id conservation, “Material legado…”) appear in learner-facing prose, callouts, quiz distractors, and demo outputs.  
2. **Code ↔ output oracle mismatches** in theory and iDo (print-theater residual) — student trust erodes when “Run” cannot match the printed result.  
3. **Truncated / garbled weDo instructions** (mid-sentence cuts, broken E3 contract text).  
4. **Internal inconsistencies** (blocking key = last token vs paternal surname `parts[1]`; three different relationship weight schemes; geo signal only checks `a["km"]`).  
5. **youDo scaffold under-wires the rubric** (`NotImplementedError` cores; `main()` never exercises ER/decision matrix).  
6. **Prose density vs S01 gold**: many theory blocks are compact contract checklists rather than full Anchor → Mechanism → Worked case → Edge narratives in español peruano.

**Automated prior status** (`S13_AUDIT.json` ACCEPT, PA rank 9.55, `S13_DONE.md` gold) is **not accepted as ground truth** for this explorer pass: residual theater and meta-leaks remain visible in source.

**Comparative snapshot:** Architecture and ethics beat many intro ER tutorials (which jump to ML matching). Depth of narrative and oracle hygiene lag S01 and best-in-class explicit-teaching materials.

---

## 3. Detailed Issue Registry

Severity: **P0** = blocks trust / ethics / progressive disclosure · **P1** = high learner impact · **P2** = polish / consistency · **P3** = nice-to-have

### ISSUE-01 — Meta-leak: platform id + “retematiza a V3” in jobRelevance  
- **Severity:** P1  
- **Location:** `jobRelevance`  
- **Evidence:**  
  > “Esta sección (id de plataforma `rpa-automation` conservado) retematiza a V3 y es la **puerta de salida N1**…”  
- **Pedagogical impact:** Breaks immersion; exposes migration debt. Students do not need to know hash conservation or curriculum versioning.  
- **Dimension:** Meta-text; redaction  

### ISSUE-02 — Meta-leak: map theory “En V3… no es el path principal de Playwright…”  
- **Severity:** P1  
- **Location:** theory[0] paragraph 1  
- **Evidence:**  
  > “En V3, **S13 no es el path principal de Playwright, Ollama, OCR ni Prefect**. Ese material se reubica al tramo de automatización avanzada.”  
- **Pedagogical impact:** Correct *author* intent, wrong *learner* frame. Prefer positive framing of what S13 *is* (dashboard de evidencia) without curriculum archaeology. A short “más adelante verás RPA…” is enough.  
- **Dimension:** Meta-text; connective tissue  

### ISSUE-03 — Meta-leak: callout “Material legado RPA/IA de este archivo”  
- **Severity:** P1  
- **Location:** theory[0] callout `Contenido reubicado conceptualmente`  
- **Evidence:**  
  > “Material legado RPA/IA de este archivo **no es el camino V3 del estudiante en S13**.”  
- **Pedagogical impact:** Explicit developer-to-developer note in UI.  
- **Dimension:** Meta-text  

### ISSUE-04 — Meta-leak: “lane” / `section_passed` / ledger in theory + callout + youDo  
- **Severity:** P1  
- **Locations:**  
  - theory T4-B paragraph 3  
  - callout “Cierre N1”  
  - youDo.context  
  - portfolioNote  
  - iDo runbook demo **output** (`section_passed_written_by_this_lane False`)  
  - selfCheck distractor: “Marcar section_passed desde el author lane”  
- **Evidence (examples):**  
  > “Esta lane **no** marca `section_passed` ni actualiza el ledger del estudiante”  
  > `section_passed_written_by_this_lane False`  
  > “Marcar section_passed desde el author lane”  
- **Pedagogical impact:** Internal harness vocabulary. Learner-facing gate language should be: “esta entrega **documenta** evidencia CF-1; el curso marca progreso por el proceso de gate, no por este script.”  
- **Dimension:** Meta-text; exam quality  

### ISSUE-05 — Meta-leak: resources course note “alinear con V3 S13”  
- **Severity:** P2  
- **Location:** `resources.courses[0].note`  
- **Evidence:** “Curso desplegado; alinear con V3 S13 cierre N1.”  
- **Pedagogical impact:** Author checklist tone.  
- **Dimension:** Meta-text; redaction  

### ISSUE-06 — Theory oracle mismatch: `pr_metrics.py`  
- **Severity:** P0  
- **Location:** S13-T1-B theory code/output  
- **Evidence:** Code prints TP/FP/FN and precision/recall only; **output also claims** `fp_means_fraud False` which is never printed.  
- **Pedagogical impact:** Classic print-theater residual; violates gold “computes the concept / honest oracle.”  
- **Dimension:** Exercise/code quality; redaction  

### ISSUE-07 — Theory oracle mismatch: `ops_cf1.py`  
- **Severity:** P0  
- **Location:** S13-T4-B theory  
- **Evidence:** Code prints `sorted(keys)`, first runbook step, and incident actions list. Output shows full privacy dict, `demo_cmd`, full runbook list, full incident dict, and `level1_regression…` — **none of which the code emits**.  
- **Pedagogical impact:** Highest-severity theater in section; demolishes “run and compare.”  
- **Dimension:** Code quality; cognitive trust  

### ISSUE-08 — iDo oracle mismatch: `eval_clerical_demo.py` (S13-T1-B-DEMO)  
- **Severity:** P0  
- **Evidence:** Code:  
  `print("tp_fp_fn", pr_metrics(pairs))` and `print("clerical", …)`  
  Output: multi-line `tp 5 fp 0 fn 2` / `precision 1.0` / `recall 0.714` / `clerical_queue [...]`  
- **Pedagogical impact:** Demo cannot reproduce claimed metrics printout. Also, description says “20 pares” but precision/recall lines are not computed in code.  
- **Dimension:** iDo fidelity  

### ISSUE-09 — iDo oracle mismatch: `shared_geo_demo.py` (S13-T2-A-DEMO)  
- **Severity:** P1  
- **Evidence:** Code prints `kinship_verdict None`; output shows `kinship None` and an extra `explanation [...]` line not produced by code.  
- **Pedagogical impact:** Small but clear oracle drift.  
- **Dimension:** iDo fidelity  

### ISSUE-10 — iDo oracle mismatch: `graphlet_demo.py` (S13-T2-B-DEMO)  
- **Severity:** P1  
- **Evidence:** Code emits key `"shared"`; output uses `'via'`. Code does not print `collusion_claim False` but output includes it.  
- **Pedagogical impact:** Student who implements `shared` will think they failed.  
- **Dimension:** iDo fidelity  

### ISSUE-11 — iDo oracle mismatch: `runbook_demo.py` (S13-T4-B-DEMO)  
- **Severity:** P1  
- **Evidence:** Extra output lines `demo_cmd: …` and `section_passed_written_by_this_lane False` not in code.  
- **Pedagogical impact:** Combines theater + meta-leak.  
- **Dimension:** iDo; meta-text  

### ISSUE-12 — Truncated / garbled weDo instructions (multiple)  
- **Severity:** P1  
- **Locations (non-exhaustive):**  
  - **S13-T1-A-E3:** “0.5 si solo stdlib + reglas deterministas S01–S13” — contract text is **broken** (should describe partial score when same doc / different block).  
  - **S13-T1-B-E3:** ends with `(no.`  
  - **S13-T2-A-E3 / T2-B-E2 / T3-A-E2 / T4-A-E3:** cut at `no ML sklearn,.` / `Pandas de.`  
  - **S13-T2-B-E3 / T3-A-E1 / T3-A-E3 / T4-A-E2 / T4-B-E1 / T4-B-E3:** mid-phrase cuts (`no borres.`, `Conserva el.`, `no ML.`)  
- **Pedagogical impact:** Graded contracts become ambiguous; transfer exercises (E3) suffer most.  
- **Dimension:** Exercise quality; redaction  

### ISSUE-13 — Blocking key convention inconsistency  
- **Severity:** P1  
- **Evidence:**  
  - Theory `block_key` / demos: **last token** as apellido.  
  - weDo S13-T1-A-E2 solution: **`parts[1]`** (paternal surname for “Luis Huamán Soto” → `huamán`).  
  - Hint acknowledges ambiguity but theory never teaches Spanish full-name structure.  
- **Pedagogical impact:** Peruvian names are central to the course brand; silent convention flip increases cognitive load and false failures.  
- **Dimension:** Consistency; progressive disclosure; domain (PE)  

### ISSUE-14 — Relationship score weight schemes diverge without framing  
- **Severity:** P2  
- **Evidence:**  
  - Theory T2-A: 0.5 phone + 0.3 geo + 0.2 Jaccard → 0.84  
  - iDo T2-A: `min(1.0, 0.4 * len(signals))` → 1.0 with 3 signals  
  - weDo T2-A-E2: 0.6 geo + 0.4 jaccard  
- **Pedagogical impact:** Learners may think “the” formula changed; need one canonical N1 formula + optional “variante pedagógica” labels.  
- **Dimension:** Consistency; cognitive load  

### ISSUE-15 — Geo signal logic weak / asymmetric  
- **Severity:** P2  
- **Location:** iDo `relationship_signals`  
- **Evidence:** `if a.get("km") is not None and a["km"] <= 2.0` — uses a single field, not distance between entities; both fixtures share same `km`.  
- **Pedagogical impact:** Mis-teaches “distancia entre pares” promised in theory (S12 geoseñal).  
- **Dimension:** Domain correctness  

### ISSUE-16 — youDo starter does not exercise rubric-critical functions  
- **Severity:** P1  
- **Evidence:** `norm_doc`, `blocking_key`, `er_score`, `relationship_signal_score`, `decide_ops_status`, `pseudonymize` raise `NotImplementedError`, but `main()` only prints pseudo (will crash), privacy, decision_cases **count**, and regression note strings — never runs DECISION_MATRIX assertions.  
- **Pedagogical impact:** Sudden release risk: student can ship incomplete portfolio unless external harness exists. Rubric 20% on DECISION_MATRIX has no local green path.  
- **Dimension:** You Do quality; GRR fidelity  

### ISSUE-17 — Theory paragraphs thinner than S01 gold narrative  
- **Severity:** P2  
- **Evidence:** Most subtopics have 3 short paragraphs packed with gates/jargon; fewer “diccionario”, motivation, and step-by-step worked explanations than S01. Average depth is functional but checklist-like.  
- **Pedagogical impact:** Capstone section with high conceptual load needs more connective tissue between ER vs relationship vs ops status.  
- **Dimension:** Connective tissue; cognitive load  

### ISSUE-18 — Legacy identity friction (filename / icon / hash)  
- **Severity:** P2 (product debt; learner-facing via URL)  
- **Evidence:** File `s13-rpa-automation.ts`, id `rpa-automation`, icon `Bot`, while title is Evidence Dashboard. Live curriculum card says “Evidence Dashboard” correctly.  
- **Pedagogical impact:** Bookmark/share confusion; search “RPA” in repo finds wrong topic for S13.  
- **Dimension:** Consistency / accessibility  

### ISSUE-19 — Spanish micro-redaction  
- **Severity:** P3  
- **Evidence:** “telefono” without accent in theory T3-A; mixed EN jargon density is intentional but some sentences are telegraphic (“Target: dashboard…” in callout).  
- **Pedagogical impact:** Minor ES-PE polish.  
- **Dimension:** Grammar / tone  

### ISSUE-20 — Self-check shallow relative to 19h + gate stakes  
- **Severity:** P2  
- **Evidence:** 5 MCQs, all ethics/process; no item on blocking, precision formula, or exact 0.40/0.80 boundaries.  
- **Pedagogical impact:** Weak active recall for technical contracts that the rubric grades.  
- **Dimension:** Exam quality  

### ISSUE-21 — Cognitive load of full N1 regression inside S13  
- **Severity:** P2  
- **Evidence:** youDo + LEVEL1_REGRESSION_MATRIX requires re-check S01–S13 + full dashboard + CF-1 in same section (19h).  
- **Pedagogical impact:** Legitimate for level gate, but without a phased checklist in theory (what to re-run in 30 min vs full), overload risk.  
- **Dimension:** Cognitive load; progressive disclosure  

### ISSUE-22 — DEFECT comments in starters (intentional)  
- **Severity:** P3 (informational; **keep pattern**)  
- **Evidence:** 24× `# DEFECT: …` in weDo starters.  
- **Pedagogical impact:** Aligns with gold “one clear defect.” Not a meta-leak if student-facing as “bug a corregir.” Prefer Spanish label `# DEFECTO:` for ES-PE consistency (optional).  
- **Dimension:** Pedagogy (positive)  

### ISSUE-23 — E3 transfer tasks sometimes collapse to fixed-string print  
- **Severity:** P2  
- **Evidence:** T2-A-E3 (exact disclaimer print), T1-B-E3 / T2-B-E3 (fixed ethics strings).  
- **Pedagogical impact:** Ethics messaging is essential, but pure string copy is weak transfer; better: compute + attach disclaimer field.  
- **Dimension:** Exercise quality  

### ISSUE-24 — jobRelevance still strong overall; ethics excellence  
- **Severity:** n/a (strength)  
- **Note:** Separation of scores, no auto kinship/fraud, synthetic PE fixtures, privacy sheet — **best-in-class** for N1 ER teaching vs typical “merge everything” tutorials. Preserve and expand, do not dilute.  

---

## 4. Meta-Leak Report

Exact leaked / developer-facing text and locations:

| # | Exact text (or distinctive fragment) | Location |
|---|--------------------------------------|----------|
| M1 | `id de plataforma \`rpa-automation\` conservado` | `jobRelevance` |
| M2 | `retematiza a V3` | `jobRelevance` |
| M3 | `En V3, **S13 no es el path principal de Playwright, Ollama, OCR ni Prefect**` | theory[0] p1 |
| M4 | `Material legado RPA/IA de este archivo **no es el camino V3 del estudiante en S13**` | theory[0] callout |
| M5 | `Esta lane **no** marca \`section_passed\` ni actualiza el ledger del estudiante` | theory T4-B p3 |
| M6 | `Esta lane no marca section_passed ni actualiza ledger.` | callout T4-B |
| M7 | `section_passed_written_by_this_lane False` | iDo S13-T4-B-DEMO output |
| M8 | `Esta lane **no** marca section_passed ni edita checkpoint/ledger.` | youDo.context |
| M9 | `No afirmes section_passed hasta el proceso de gate del curso.` | youDo.portfolioNote (borderline: gate language OK if rewritten without harness jargon) |
| M10 | `Marcar section_passed desde el author lane` | selfCheck Q4 distractor |
| M11 | `Curso desplegado; alinear con V3 S13 cierre N1.` | resources.courses[0].note |
| M12 | File/module identity `s13-rpa-automation` / hash `rpa-automation` | product surface (URL, repo) |

**meta_leak_count (learner-facing prose/UI strings):** **11** distinct leak instances (M1–M11); M12 is product debt.

**Not counted as meta-leaks:** `# DEFECT:` in exercise starters (pedagogical scaffold); technical English identifiers (`entity_resolution_score`, CF-1, CP-N1-C).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity
| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Good structure, weak oracle hygiene | 8 demos, one per subtopic, with `why`. Several outputs do not match code (ISSUE-08–11). Descriptions generally honest. |
| **We Do** | Strong scaffold pattern | 24 exercises, E1 guided / E2 independent / E3 transfer; starters with clear defect. Instruction truncation (ISSUE-12) and some E3 print-only ethics (ISSUE-23) reduce quality. |
| **You Do** | Ambitious, under-instrumented | Excellent objectives/requirements/rubric alignment with CP-N1-C + CF-1 + level-1 regression. Starter incomplete (ISSUE-16). |

GRR principle: modeling is present; guided practice is present; **independent work jumps** from unit functions to full product without an intermediate “wire DECISION_MATRIX loop” guided step in youDo.

### 5.2 Connective tissue & narrative flow
- Opening map correctly sequences T1→T4 and names the gate metric (two scores + clerical + privacy + one-command demo).  
- Weak bridge from S12 (HTTP/SQL/geo adapters) into dashboard map tooltips — mentioned but not re-taught with a one-paragraph recap.  
- Weak bridge forward: “RPA later” is phrased as curriculum relocation (meta) rather than learner path (“en S23 volverás a automatización de browser”).  
- Compared to S01: missing “diccionario de la sección” for ER jargon (`blocking`, `clerical queue`, `fail-closed`, `uncertainty`).

### 5.3 Cognitive load & progressive disclosure
- **Positive:** Stack restricted to stdlib + prior N1; no sklearn/NumPy forward leak in solutions.  
- **Positive:** Ethics repeated at decision points (reduces harmful transfer).  
- **Risk:** Capstone + whole-level regression in 19h; dual score systems + graphlets + ops matrix in one section.  
- **Risk:** Three weight schemes + two blocking conventions (ISSUE-13/14).

### 5.4 Exercise & exam alignment
- Learning outcomes map cleanly to T1–T4 and youDo objectives.  
- Self-check over-weights policy and under-weights mechanics (ISSUE-20).  
- Rubric weights are professional (ethics + matrix + CF-1 heavy) — good for portfolio.

### 5.5 Roadmap / previous sections consistency
- Aligns with live curriculum card “Evidence Dashboard” and SECTION_MAP title.  
- Legacy id/filename diverges from V3 title (ISSUE-18).  
- Correctly defers probabilistic ER to later (S30) and RPA UI to S23+ — good progressive disclosure of *tools*, if meta language is cleaned.

### 5.6 External comparison (best-in-class)
| Source family | What S13 matches | What S13 lacks |
|---------------|------------------|----------------|
| ER industry (tiered thresholds, clerical review) | accept / needs_review / abstain; precision-first culture for risky merges | F-measure discussion; multi-key blocking; evaluation set design |
| NIST digital identity posture | identity proof ≠ relationship claim | Deeper “authenticator vs attribute” language (optional) |
| GRR / explicit teaching | I/We/You shells | Think-aloud richness of S01; some sudden release in youDo |
| CS50P / MIT 6.100L style | Small runnable functions | Output honesty; narrative worked examples |
| Data Matching (Christen) books note | Named in resources | No mini reading of blocking taxonomy in theory |

### 5.7 Grammar / ES-PE redaction
- Overall Spanish is serviceable professional ES-PE with industry English tokens (OK).  
- Telegraphic callouts (“Target: dashboard…”) feel English-author shorthand.  
- Accent slip: “telefono”.  
- Truncations are the dominant redaction failure, not grammar.

### 5.8 Strengths to preserve
1. Dual-score ethics (ER ≠ relationship).  
2. Explicit ban on `is_family` / `auto_fraud`.  
3. Fail-closed invalid_input / NaN / high uncertainty path.  
4. Synthetic PE fixtures and pseudonymization.  
5. CF-1 privacy + demo command + incident runbook as level exit.  
6. weDo DEFECT pattern (one bug per starter).  

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in this explorer run. Paths relative to repo root.

### Diff A — Strip jobRelevance meta (ISSUE-01)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ jobRelevance
-    "Cerrar el nivel 1 exige un **Familiarity Evidence Dashboard** con entity resolution determinista, señales de relación **separadas** del score ER, fichas pseudonimizadas, revisión humana y límites explícitos (sin parentesco/fraude automático). Esta sección (id de plataforma `rpa-automation` conservado) retematiza a V3 y es la **puerta de salida N1**: cierre **CP-N1-C**, **regresión de nivel 1 (S01–S13)** y artefactos **CF-1**.",
+    "Cerrar el nivel 1 exige un **Familiarity Evidence Dashboard** con entity resolution determinista, señales de relación **separadas** del score ER, fichas pseudonimizadas, revisión humana y límites explícitos (sin parentesco/fraude automático). Esta sección es la **puerta de salida N1**: cierras **CP-N1-C**, documentas la **regresión de nivel 1 (S01–S13)** y entregas artefactos **CF-1** listos para revisión.",
```

### Diff B — Learner-facing map theory (ISSUE-02, ISSUE-03)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ theory[0]
-        "En V3, **S13 no es el path principal de Playwright, Ollama, OCR ni Prefect**. Ese material se reubica al tramo de automatización avanzada. Aquí cierras **CP-N1-C** con un **Familiarity Evidence Dashboard**: entity resolution por reglas, señales de relación **separadas** del score ER, explicación humana y operación responsable.",
+        "Aquí cierras **CP-N1-C** con un **Familiarity Evidence Dashboard**: entity resolution por reglas, señales de relación **separadas** del score ER, explicación humana y operación responsable. La automatización de browser, OCR y orquestación avanzada llegan en secciones posteriores; en N1 el producto es la ficha de evidencia auditable.",
@@ callout
-        title: "Contenido reubicado conceptualmente",
-        content:
-          "Material legado RPA/IA de este archivo **no es el camino V3 del estudiante en S13**. Target: dashboard de evidencia + cierre N1. Nunca PII real; nunca auto_fraud/is_family.",
+        title: "Enfoque de esta sección",
+        content:
+          "El objetivo de S13 es el dashboard de evidencia + cierre N1. Solo datos sintéticos; nunca PII real; nunca auto_fraud/is_family.",
```

### Diff C — Remove lane/section_passed meta (ISSUE-04)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ theory T4-B
-        "Artefactos **CF-1** + checklist de **regresión level-1 (S01–S13)** cierran el nivel. Esta lane **no** marca `section_passed` ni actualiza el ledger del estudiante — solo evidencia el producto N1.",
+        "Artefactos **CF-1** + checklist de **regresión level-1 (S01–S13)** cierran el nivel. Tu entrega **documenta evidencia** del producto N1; el progreso del curso se registra por el proceso de gate, no por un flag dentro del script de demo.",
@@ callout Cierre N1
-          "CP-N1-C + regresión level-1 + CF-1. Esta lane no marca section_passed ni actualiza ledger.",
+          "CP-N1-C + regresión level-1 + CF-1. La demo evidencia el producto; no sustituye el gate formal del curso.",
@@ youDo.context
-      "... Esta lane **no** marca section_passed ni edita checkpoint/ledger.",
+      "... Esta entrega documenta evidencia CF-1 y la regresión N1; no inventes un flag de 'aprobado' dentro del código.",
@@ portfolioNote
-      "... No afirmes section_passed hasta el proceso de gate del curso.",
+      "... No declares el nivel cerrado hasta completar el proceso de gate del curso con la evidencia pedida.",
@@ selfCheck Q4 options
-        options: ["Solo un modelo de deep learning", "Privacy sheet, acceso, tests, demo y runbook", "Hardcodear tokens en el repo", "Marcar section_passed desde el author lane"],
+        options: ["Solo un modelo de deep learning", "Privacy sheet, acceso, tests, demo y runbook", "Hardcodear tokens en el repo", "Omitir la privacy sheet si el demo corre"],
```

### Diff D — Fix `pr_metrics.py` oracle (ISSUE-06)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ pr_metrics.py code
 tp, fp, fn, precision, recall = pr_from_pairs(pairs)
 print("tp", tp, "fp", fp, "fn", fn)
 print("precision", round(precision, 3), "recall", round(recall, 3))
+print("fp_means_fraud", False)
@@ output (unchanged semantics; now matches)
 tp 2 fp 1 fn 1
 precision 0.667 recall 0.667
 fp_means_fraud False
```

### Diff E — Fix `ops_cf1.py` code to match intended teaching output (ISSUE-07)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ ops_cf1.py
-print(sorted(privacy_sheet().keys()))
-print(runbook_steps()[0])
-print(incident_actions()["action"])
+print("privacy", privacy_sheet())
+print("demo_cmd", "python -m demo_n1_dashboard")
+print("runbook", runbook_steps())
+print("incident", incident_actions())
+print("level1_regression", "S01-S13 checklist required")
```

### Diff F — Fix iDo eval clerical demo (ISSUE-08)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ eval_clerical_demo.py
 def pr_metrics(pairs):
     tp = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 1)
     fp = sum(1 for p in pairs if p["y"] == 0 and p["pred"] == 1)
     fn = sum(1 for p in pairs if p["y"] == 1 and p["pred"] == 0)
-    return tp, fp, fn
+    precision = tp / (tp + fp) if (tp + fp) else 0.0
+    recall = tp / (tp + fn) if (tp + fn) else 0.0
+    return tp, fp, fn, precision, recall
 
 pairs = build_pairs()
-print("tp_fp_fn", pr_metrics(pairs))
-print("clerical", [p["id"] for p in pairs if 0.4 <= p["score"] <= 0.7])
+tp, fp, fn, precision, recall = pr_metrics(pairs)
+print("tp", tp, "fp", fp, "fn", fn)
+print("precision", round(precision, 3))
+print("recall", round(recall, 3))
+print("clerical_queue", [p["id"] for p in pairs if 0.4 <= p["score"] <= 0.7])
```

(Verify numeric output after change; if seed logic yields different PR, update output field to the true computed values.)

### Diff G — Fix shared_geo + graphlet + runbook demos (ISSUE-09–11)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ shared_geo_demo.py
 print("signals", signals)
 print("relationship_signal_score", rel)
+print("explanation", signals)
 print("kinship_verdict", None)
@@ output
 signals ['shared_phone', 'geo_distance_km=1.2', 'surname_match']
 relationship_signal_score 1.0
 explanation ['shared_phone', 'geo_distance_km=1.2', 'surname_match']
-kinship None
+kinship_verdict None

@@ graphlet_demo.py
-    evidence.append({"type": "common_counterparty", "nodes": [a, c], "shared": shared})
+    evidence.append({"type": "common_counterparty", "nodes": [a, c], "via": shared})
     return evidence
 ...
 print(graphlet_evidence(txs))
+print("collusion_claim", False)

@@ runbook_demo.py
 for s in cf1_runbook():
     print(s)
+print("demo_cmd: python -m demo_n1_dashboard --synthetic")
+print("demo_writes_course_progress", False)
@@ output last lines
-section_passed_written_by_this_lane False
+demo_writes_course_progress False
```

### Diff H — Canonical blocking + teach PE name order (ISSUE-13)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ theory T1-A paragraph addition (concept)
+        "En nombres peruanos sintéticos del curso usamos **apellido paterno** como token de blocking: con `Nombre ApellidoPaterno ApellidoMaterno`, toma el **segundo** token (`parts[1]`); si solo hay un token, usa ese. Documenta la regla en el memo: no mezcles 'último token' y 'paterno' en el mismo pipeline.",
@@ er_rules.py / demos block_key
-    ap = norm_name(rec["name"]).split()[-1]
+    parts = norm_name(rec["name"]).split()
+    ap = parts[1] if len(parts) >= 2 else parts[0]
```

(Align all theory demos, iDo T1-A, and E3 `bkey` with the same rule; update outputs.)

### Diff I — One canonical relationship formula (ISSUE-14) — sketch

```diff
# Document in T2-A callout:
# N1 canónico: rel = 0.5*shared_phone + 0.3*geo_close + 0.2*surname_jaccard
# Actualizar iDo shared_geo_demo y weDo T2-A-E2 para reutilizar la misma función o declarar "variante de práctica" en la instruction.
```

### Diff J — Repair critical weDo instruction texts (ISSUE-12) — examples

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ S13-T1-A-E3 instruction
-          "E3 (transferencia) — `er_score(a,b)`: 1.0 si norm_doc igual y mismo blocking_key; 0.5 si solo stdlib + reglas deterministas S01–S13. Documenta el criterio en el memo del ejercicio y no inventes evidencia fuera del fixture sintético.",
+          "E3 (transferencia) — Concepto: S13-T1-A. Implementa `er_score(a,b)`: 1.0 si `norm_doc` igual y mismo `blocking_key`; 0.5 si solo el documento coincide (bloques distintos); 0.0 en otro caso. Imprime los tres scores del fixture (A-B, A-C, A-D). Salida/pass: `1.0 0.5 0.0`. Solo stdlib + reglas S01–S13; no inventes evidencia fuera del fixture sintético.",

@@ S13-T1-B-E3 instruction (end)
-          "... Conserva el contrato del starter (no.",
+          "... Conserva el contrato del starter (no borres asserts ni datos); solo stdlib + reglas deterministas S01–S13.",
```

(Apply analogous full closings to every truncated instruction listed in ISSUE-12.)

### Diff K — youDo main exercises the matrix (ISSUE-16)

```diff
--- a/src/lib/course/sections/s13-rpa-automation.ts
+++ b/src/lib/course/sections/s13-rpa-automation.ts
@@ youDo starter main()
 def main() -> None:
     a = {"name": "Ana Quispe", "document_id": "D-1", "region": "Lima", "phone": "900", "km": 1.0}
     b = {"name": "ANA QUISPE", "document_id": "d1", "region": "Lima", "phone": "900", "km": 1.0}
     print("pseudo", pseudonymize(a["name"]))
+    print("er", er_score(a, b))
+    print("rel", relationship_signal_score(a, b))
+    for row in DECISION_MATRIX:
+        got = decide_ops_status(row["score"], row["uncertainty"])
+        assert got == row["expected"], (row, got)
+    print("decision_matrix_ok", True)
     print("privacy", privacy_sheet())
     print("decision_cases", len(DECISION_MATRIX))
     print("regression_notes", level1_regression_notes())
```

(Provide reference solutions in Fixer phase or partial implementations for guided path.)

### Diff L — Resources note (ISSUE-05)

```diff
-        note: "Curso desplegado; alinear con V3 S13 cierre N1.",
+        note: "Sección en vivo: Familiarity Evidence Dashboard y cierre N1.",
```

### Diff M — Self-check depth (ISSUE-20) — add 2 items (optional expansion)

```diff
+      {
+        question: "Si score=0.4 y uncertainty=low, decide_ops_status debe devolver…",
+        options: ["abstain", "accept_pair", "needs_review", "auto_fraud"],
+        correctIndex: 2,
+        explanation: "score < 0.8 y >= 0.4 cae en needs_review; 0.4 no es abstain (abstain es score < 0.4).",
+      },
+      {
+        question: "Blocking en N1 sirve para…",
+        options: [
+          "Inferir parentesco automáticamente",
+          "Reducir pares candidatos antes de reglas finas",
+          "Enviar PII a un geocoder público",
+          "Fusionar ER y relationship en un solo score",
+        ],
+        correctIndex: 1,
+        explanation: "Blocking acota el espacio de comparación; no es veredicto legal.",
+      },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 (P0)** | ISSUE-06, 07, 08 (+09–11) | Oracle honesty is non-negotiable; blocks trust in every demo. |
| **2 (P1)** | ISSUE-01–04, 05 (meta-leaks) | Visible developer voice; quick high-ROI redaction. |
| **3 (P1)** | ISSUE-12 (truncated instructions) | Breaks weDo contracts, especially E3. |
| **4 (P1)** | ISSUE-13 (blocking convention) | Domain-correct PE names; consistency across theory/demo/E2. |
| **5 (P1)** | ISSUE-16 (youDo harness) | Capstone must be completable against rubric. |
| **6 (P2)** | ISSUE-14, 15 (weights / geo) | Conceptual coherence of relationship signals. |
| **7 (P2)** | ISSUE-17, 20, 21, 23 | Narrative depth, quiz depth, load framing, E3 transfer quality. |
| **8 (P2/P3)** | ISSUE-18, 19 | Legacy id/icon (may be deferred product migration); accents. |
| **Keep** | ISSUE-22 / strength ISSUE-24 | DEFECT starters + ethics dual-score model. |

**Suggested Fixer batches:**  
1) Oracle pass (all code/output pairs green by actual execution).  
2) Meta-leak scrub + ES-PE polish.  
3) Instruction repair + blocking canonicalization.  
4) youDo + selfCheck deepen.  
5) Optional narrative expansion toward S01 gold rank ≥ 9.5.

---

## 8. Graph Memory Update Notes

For shared context (`GRAPH_MEMORY.json` / summary / residual ledger) — **notes only**, not applied here:

```yaml
section: 13
id: rpa-automation
title: Familiarity Evidence Dashboard y cierre de nivel
file: src/lib/course/sections/s13-rpa-automation.ts
explorer_score_1_to_10: 7.3
prior_pa_rank_claimed: 9.55
explorer_overrides_prior_gold: true
status_after_explorer: needs_fixer
issue_count: 24  # including 1 strength-note + 1 keep-pattern; actionable ≈ 22
meta_leak_count: 11
p0_oracle_mismatches:
  - theory.pr_metrics.output_extra_line
  - theory.ops_cf1.code_output_divergence
  - iDo.eval_clerical_demo
p1_meta_topics: [V3_retarget, lane, section_passed, platform_id_conservado, material_legado]
structural_ok:
  theory_subtopics: 8
  iDo: 8
  weDo: 24
  selfCheck: 5
  youDo: present
edges:
  - S12_geo_sql_http -> S13_dashboard_tooltips_privacy_egress
  - S13_CP_N1_C -> CF-1_level_gate
  - S13_deterministic_ER -> S30_probabilistic_ER
  - S13_not_RPA -> S23_Playwright_path
 residual_risks:
  - legacy_hash_rpa-automation
  - dual_blocking_conventions
  - relationship_weight_triplicity
  - youDo_NotImplemented_without_matrix_loop
preserve:
  - dual_score_ethics
  - fail_closed_thresholds
  - synthetic_only_CF1
  - DEFECT_weDo_pattern
fixer_ready: true
```

**Comparative memory:** Early gold (S01) still sets the narrative/oracle bar. S13 is **architecturally advanced** but **redaction/oracle lagging**. Do not mark expert gold until P0 oracles and P1 meta-leaks are cleared and re-verified by executing every theory/iDo snippet.

---

## Explorer process log (abbreviated STORM loops)

1. **Surface scan:** Live curriculum card “Evidence Dashboard”; source full structure 8/8/24; ethics slogans dense.  
2. **Deep pedagogy:** GRR present; youDo sudden-release risk; weight/blocking inconsistencies.  
3. **Redaction:** Truncated instructions; telegraphic callouts.  
4. **Meta-leak hunt:** V3/lane/section_passed/platform id/legado (11 hits).  
5. **Oracle loop:** pr_metrics, ops_cf1, eval_clerical, shared_geo, graphlet, runbook mismatches confirmed by static code/output comparison.  
6. **External compare:** ER tiered thresholds & clerical review industry-aligned; narrative below S01/CS50P clarity.  
7. **Diff architecture:** A–M proposals ready for Fixer.  

---

This is the complete Explorer report for Section 13. Ready for the Fixer prompt.
