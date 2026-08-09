# S14 Explorer Report — NumPy y cómputo vectorizado

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Date:** 2026-07-24  
**Scope constraint:** Section 14 only — no fixes applied  

**Primary sources**
- Live site (home + S14 card): https://pillb.github.io/pyarcana/ (hash `#security`)
- Repo source: `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s14-security.ts`
- Prior automated audit: `course-state/curriculum_hardening/audits/S14_AUDIT.json` (verdict ACCEPT; 0 high issues; mean_visible_rank 9.52 — redaction-only signal, not full pedagogy)
- Comparative anchors: S02 (`s02-basics.ts`), S13 map, S15 map; NumPy Absolute Beginners (numpy.org); cognitive-load / progressive-disclosure pedagogy literature

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 14 |
| Platform id (hash) | `security` (**legacy**; content is NumPy) |
| Source file | `src/lib/course/sections/s14-security.ts` |
| Live title / shortTitle | NumPy y cómputo vectorizado / NumPy vectorizado |
| Tagline | cálculo vectorizado de métricas de calidad y señales por pares, con benchmark honesto y resultados equivalentes al baseline |
| Level / phase / hours | Competente · phase 1 · 18h |
| Icon (source) | `ShieldCheck` (security leftover) |
| Capstone thread | Inicio **CP-N2-A** (Executive Data Quality & EDA) |
| Stack in scope | NumPy ndarray / ufunc / broadcast; **sin** pandas (S15) ni sklearn |
| Theory subtopics | 8: S14-T1-A…T4-B |
| I Do demos | 8 |
| We Do exercises | 24 (E1 guided / E2 independent / E3 transfer × 8) |
| You Do | Portfolio “métricas de calidad y señales por pares” |
| Self-check | 5 MCQs |
| Resources | NumPy docs + books + courses |

**Explicit out-of-scope for this run:** no curriculum TS edits; no Fixer application; no re-audit of other sections.

**Narrative identity (student-facing intent):** After N1 (S01–S13) and the Familiarity Evidence Dashboard, S14 opens N2 with **vectorized quality metrics** on synthetic LatAm client arrays (Lima/Arequipa/Cusco, ids `C00x`): dtype/shape contracts → masks → reductions → broadcasting → views/copies → NaN/inf → honest benchmarks → `allclose`/memory.

---

## 2. Executive Summary of Quality

### Score: **7.2 / 10**

### Verdict
**Solid instructional skeleton with a strong applied story (quality board + synthetic PE data), but weakened by curriculum-meta leakage, two We Do starter↔instruction mismatches, formulaic exercise prose, thin self-check vs 8 LOs, and legacy `security` identity (id, filename, ShieldCheck icon).** The automated ACCEPT in `S14_AUDIT.json` correctly signals low boilerplate density; it does **not** mean the section is pedagogically clean for Fixer.

### What works
- Clear **T1→T4** progressive disclosure: arrays → ops → semantics → performance.
- Full **I Do (8) / We Do (24) / You Do** scaffolding aligned to subtopicIds.
- Applied domain (completitud, máscaras de score, señales por pares, allclose) better than generic “NumPy 101” dumps.
- Explicit **fail-closed** culture: assert dtype/shape; do not silently “fix” bad inputs.
- Honest **loop vs vectorizado** narrative + numerical equivalence (good professional habit).
- Resources point to official NumPy guides (broadcasting, indexing, `assert_allclose`).

### What hurts
- Student-visible **V3 / reubicación / OWASP-Presidio / id conservado** meta-text in jobRelevance, map theory, callout, rubric, and one resource note.
- **S14-T4-B-E2** and **S14-T4-B-E3**: starterCode and instruction/solution are about different tasks (critical We Do bug).
- Exercise instructions are long, copy-pasted templates (high **extraneous** cognitive load).
- You Do objectives list unicidad/rangos/benchmark but starter only scaffolds `completeness` + `pairwise_diff`.
- Self-check undersamples LOs (no dedicated items for broadcast, allclose, vectorization, memory).
- Bridge from S13 (ER dashboard, no NumPy) → S14 is thin beyond “inicio CP-N2-A”.

### Pass notes used
1. Surface scan (structure, counts, live card match).  
2. Deep pedagogy (CLT, worked examples, I/We/You fidelity).  
3. Redaction & Peruvian Spanish.  
4. Meta-leak hunt.  
5. Comparative quality (S02 depth, official NumPy beginner guide, Kaggle-style drill sets).  
6. Loop pass for starter/instruction/solution triples on all 24 exercises (flagged T4-B E2/E3 and T1-A-E3 case drift).

---

## 3. Detailed Issue Registry

Severity scale: **P0** blocker · **P1** high · **P2** medium · **P3** low / polish.

| # | Severity | Dimension | Location | Evidence (quote / fact) | Pedagogical impact |
|---|----------|-----------|----------|-------------------------|--------------------|
| 1 | **P1** | Meta-leak | `jobRelevance` | “Esta sección (id de plataforma `security` conservado) retematiza a V3 **NumPy…**” | Students see internal platform/versioning; confuses identity of the lesson. |
| 2 | **P1** | Meta-leak | theory map heading + paras | Heading: “De ‘Seguridad para Automatizaciones e IA’ a NumPy…”. Body: “**S14 no es el path principal de OWASP LLM, prompt injection ni Presidio**. Ese material se reubica…” | Opens S14 with negative curriculum archaeology instead of a clean “why NumPy for quality”. |
| 3 | **P1** | Meta-leak | map `callout` | Title “Contenido reubicado conceptualmente”; “Material legado de seguridad/IA de este archivo **no es el camino V3 del estudiante en S14**.” | Developer note leaked as student UI callout. |
| 4 | **P2** | Meta-leak | `youDo.rubric[0]` | “Alineación al gate V3 de la sección” | Rubric criterion is internal curriculum jargon, not assessable student language. |
| 5 | **P2** | Meta-leak | `resources.courses` PyArcana live | note: “Curso desplegado; alinear con V3 S14 NumPy” | Meta instruction to authors, not a student resource note. |
| 6 | **P1** | Product consistency | `id` / file / `icon` | `id: "security"`, file `s14-security.ts`, `icon: "ShieldCheck"` while title is NumPy | Live hash `#security` and shield icon contradict “NumPy vectorizado”; hurts wayfinding and trust. |
| 7 | **P0** | Exercise integrity | `S14-T4-B-E2` | Instruction/solution: `allclose` True with atol. Starter: `# CASO-LIM-014 · dtype downcast` / `# DEFECT: no cast float32` / prints `a.dtype, a.nbytes` | Student practice path is broken: starter does not instantiate the task. |
| 8 | **P0** | Exercise integrity | `S14-T4-B-E3` | Instruction/solution: `assert_allclose` → print `fail`. Starter: memory budget on `(1000,100)` float64, prints `within_budget True` | Same class of bug: wrong defect, wrong prints, wrong concept for E3 transfer. |
| 9 | **P2** | Exercise integrity | `S14-T1-A-E3` | Starter invalid case is 2D float64; solution invalid case is 1D int (`np.array([1,2])`). Instruction pass text: `ok 2 \| err expected 1d float64` | Guided transfer message is OK overall, but starter↔solution diverge → grader/student confusion if they only “fix the defect”. |
| 10 | **P2** | Redaction / template | All 24 We Do `instruction` | Repeated stem: “Concepto: S14-T*-* (NumPy y cómputo vectorizado). Entrada: fixture sintético del starter (`CASO`/ids C00x)… Conserva el contrato… no pandas S15, no sklearn…” | High extraneous load; buries the actual task. S02 is also formulaic but S14’s stem is longer and more IDs-heavy. |
| 11 | **P2** | Redaction | `S14-T2-B-E2` instruction | Ends truncated: “…solo numpy ndarray/ufunc/broadcast (S01–S14).” appears as “no pandas S15,.” | Incomplete sentence / cut constraints list looks unedited. |
| 12 | **P2** | Cognitive load / You Do | `youDo` objectives vs `starterCode` | Objectives: completitud, **unicidad**, **rangos**, señales, **benchmark**, tests. Starter only: `completeness`, `pairwise_diff` + `NotImplementedError`. | Students lack scaffold for half the stated portfolio; risk of incomplete submissions. |
| 13 | **P2** | Exam quality | `selfCheck` | Only 5 items; covers dtype, mask, axis=0, view, nanmean. Missing: broadcast rules, allclose/rtol-atol, vectorization rationale, nbytes, writeable. | Weak active-recall gate for 8 LOs and 18h section; 70% unlock may pass without core skills. |
| 14 | **P2** | Connective tissue | Map vs S13 | S13 forbids NumPy; S14 opens with security-retheme map rather than “from rules ER to numeric quality board”. | Phase 0→1 transition feels abrupt; motivation for CP-N2-A underplayed. |
| 15 | **P3** | Grammar / style | Multiple headings | e.g. “creación, indexación y máscaras”, “ufuncs y reducciones” (sentence-case) vs title-case elsewhere | Minor polish; uneven heading hierarchy in UI. |
| 16 | **P3** | Technical writing | Theory T4-A / I Do T4-A outputs | Fixed `ratio_loop_over_vec 135.8` / `ratio 117.5` | Machine-specific numbers presented as canonical output; contradicts callout “un ratio en laptop no es SLA”. Prefer “ratio > 1” or placeholder. |
| 17 | **P2** | Pedagogy depth | Uniqueness LO | LO: “métricas de calidad…” / You Do: “unicidad”; theory barely teaches `np.unique` / uniqueness rate | LO–content misalignment; students may invent ad-hoc uniqueness. |
| 18 | **P3** | Accessibility / tone | Mixed jargon | “fail-closed”, “gate”, “fancy index”, “broadcast” without always pairing Spanish gloss | Acceptable for Competente level if map dictionary existed; currently map is meta, not glossary. |
| 19 | **P2** | Comparative quality | vs NumPy Absolute Beginners | Official guide builds mental model (why homogeneous arrays, view demo, broadcast pictures) before metrics. S14 compresses “why NumPy” into quality metrics immediately. | Efficient for job story, but weak first-principles for learners new to arrays after pure Python S01–S13. |
| 20 | **P3** | Meta / exercise convention | All starters | `# DEFECT: …` comments (course-wide pattern) | Acceptable as deliberate broken-starter pedagogy if documented once; still looks like author notes. Prefer student-facing “Bug a corregir:”. |
| 21 | **P3** | Consistency | `S14-T4-B-E2` starter comment typo-adjacent | DEFECT text elsewhere “cree float32” (E1 budget comment “cree”) | Typos in author comments; low impact if starters rewritten. |
| 22 | **P2** | Roadmap consistency | Live homepage blurb still lists “seguridad” among course themes generically | Course marketing OK; S14 card correctly shows NumPy | Residual brand confusion: hash `security` vs card “NumPy vectorizado”. |

---

## 4. Meta-Leak Report

Exact student-facing (or near-facing) leaks. **Do not leave these in production copy.**

### 4.1 High-visibility leaks

| ID | Location | Exact / near-exact text |
|----|----------|-------------------------|
| ML-1 | `jobRelevance` | “Esta sección (id de plataforma `security` conservado) retematiza a V3 **NumPy y cómputo vectorizado** e inicia **CP-N2-A**…” |
| ML-2 | theory[0].heading | “De “Seguridad para Automatizaciones e IA” a NumPy vectorizado (mapa de la sección)” |
| ML-3 | theory[0].paragraphs[0] | “En V3, **S14 no es el path principal de OWASP LLM, prompt injection ni Presidio**. Ese material se reubica al tramo de seguridad/IA.” |
| ML-4 | theory[0].callout | title: “Contenido reubicado conceptualmente”; content: “Material legado de seguridad/IA de este archivo **no es el camino V3 del estudiante en S14**. Target: NumPy vectorizado para CP-N2-A (inicio)…” |
| ML-5 | `youDo.rubric` | “Alineación al gate V3 de la sección” |
| ML-6 | `resources.courses` note | “Curso desplegado; alinear con V3 S14 NumPy” |

### 4.2 Structural / product identity leaks

| ID | Location | Leak |
|----|----------|------|
| ML-7 | `id: "security"` + URL hash | Student URL and internal id still say “security” while content is NumPy. |
| ML-8 | `icon: "ShieldCheck"` | Visual metaphor for security, not vectorized compute / arrays. |
| ML-9 | Filename `s14-security.ts` | Authoring leak only (not UI), but drives ML-7 forever if not renamed carefully. |

### 4.3 Exercise-authoring language (systemic)

| ID | Pattern | Notes |
|----|---------|-------|
| ML-10 | `# DEFECT: …` in all We Do starters + You Do “corrige el DEFECT del starter” | Course-wide convention; still meta. Soften for learners. |
| ML-11 | “Concepto: S14-T1-A (NumPy…)” IDs in every instruction | Internal taxonomy exposed; useful for Fixer, noisy for students. |

**meta_leak_count (strict student-facing clusters ML-1…ML-6 + identity ML-7/8):** **8**  
(If counting every DEFECT line: 24+; report uses **clustered** count for Fixer prioritization.)

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round pedagogy principles applied

- **Cognitive Load Theory:** minimize extraneous load (meta, templates); sequence intrinsic difficulty (arrays → ops → views/NaN → performance).
- **Worked-example effect (I Do):** complete demos before independent practice.
- **Progressive disclosure / scaffolding:** E1→E2→E3 and I→We→You.
- **Transfer:** quality-metrics story links NumPy APIs to job-relevant outputs.
- **External gold standard:** NumPy Absolute Beginners teaches *why* homogeneous arrays and *when* views mutate before large pipelines — S14 should keep a short pure mental-model beat before the full quality board.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | **High** | 8 demos, each with `why`, synthetic PE regions, outputs. Good worked examples for masks, reductions, broadcast pair diffs, view corruption, nan policy, bench, allclose. |
| **We Do** | **Medium–High structure / Medium execution** | Perfect 3×8 grid and defect-starter pattern; **broken** on T4-B E2/E3; instructions overly templated. |
| **You Do** | **Medium** | Strong scenario (fintech PE data quality); starter thinner than objectives; rubric meta (“gate V3”). |
| **Self-check** | **Low–Medium** | Correct items where present; coverage gap vs LOs. |

### 5.3 Connective tissue & narrative flow

**Strengths**
- Within-section order T1→T4 is coherent.
- Recurring synthetic clients (`C00x`, Lima/Arequipa/Cusco) provide a through-line.
- Callouts on mask length, silent broadcast, view side-effects are well placed.

**Weaknesses**
- Opening map spends first attention on **what S14 is not** (OWASP/Presidio/legacy security). Compare S02, which still has V3 out-of-scope language but also a **student dictionary** of terms first — S14 lacks an equivalent “diccionario ndarray/dtype/shape/mask/broadcast/view/NaN”.
- S13 ends N1 with ER + no NumPy; S14 should explicitly say: “pasamos de scores por reglas a **vectores numéricos** para tableros de calidad del nivel 2” without mentioning file rethemes.

### 5.4 Cognitive load & progressive disclosure

| Load type | Assessment |
|-----------|------------|
| Intrinsic | Appropriate for Competente after Python stdlib path; broadcasting + views are the hard cores and are correctly mid-section. |
| Extraneous | **Elevated** by meta map, instruction boilerplate, mismatched starters, machine-specific ratios. |
| Germane | Quality-metric applications support schema building; uniqueness under-taught weakens germane practice for stated LOs. |

### 5.5 Redaction & Peruvian Spanish

- Overall Spanish is professional, LatAm-appropriate, and free of major grammar collapse.
- Prefer student language: “criterio de entrega del portfolio” over “gate V3”; “falla de forma segura” can gloss “fail-closed” once.
- Heading capitalization inconsistent (P3).
- Truncated instruction on T2-B-E2 (P2).

### 5.6 Exercise & exam alignment matrix (summary)

| Subtopic | Theory | I Do | E1–E3 | Self-check | Gap |
|----------|--------|------|-------|------------|-----|
| T1-A dtype/shape | ✓ | ✓ | ✓ | ✓ dtype | E3 starter case drift |
| T1-B masks | ✓ | ✓ | ✓ | ✓ filter | — |
| T2-A ufuncs/reduce | ✓ | ✓ | ✓ | ✓ axis | — |
| T2-B broadcast | ✓ | ✓ | ✓ | ✗ | add quiz |
| T3-A views/copies | ✓ | ✓ | ✓ | ✓ view | — |
| T3-B NaN/inf | ✓ | ✓ | ✓ | ✓ nanmean | — |
| T4-A vectorize | ✓ | ✓ | ✓ | ✗ | add quiz |
| T4-B mem/allclose | ✓ | ✓ | **E2/E3 broken** | ✗ | fix starters + quiz |

### 5.7 Comparison with early gold-standard (S02) and external materials

| Criterion | S02 (early) | S14 | External (NumPy beginners / Kaggle drills) |
|-----------|-------------|-----|-----------------------------------------------|
| Student dictionary up front | Strong | Weak (meta map instead) | Strong conceptual framing |
| Worked examples | Strong | Strong | Strong |
| Broken-starter We Do | Present | Present (2 wrong) | Varies |
| Portfolio job story | Strong intake parser | Strong quality board | Often weaker domain story |
| Meta V3 leakage | Present (pattern) | Present + **security rename** more jarring | N/A |
| Breadth drills | Focused | 24 micro-exercises good | 50–160 drill sets denser on pure API |

**Net:** S14’s applied story is a competitive advantage vs generic NumPy notebooks; Fixer should **preserve domain thread** while scrubbing meta and repairing We Do triples.

---

## 6. Proposed GitHub-style Diffs

> **Do not apply in Explorer.** Paths relative to repo root. Diffs are illustrative precise patches for Fixer.

### Diff 1 — Strip jobRelevance platform/V3 meta (Issue 1 / ML-1)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ jobRelevance
-    "En data quality y analytics de banca, fintech y retail en Perú, el **cómputo vectorizado con NumPy** es la base de métricas de completitud, unicidad y señales por pares. Esta sección (id de plataforma `security` conservado) retematiza a V3 **NumPy y cómputo vectorizado** e inicia **CP-N2-A** con arrays sintéticos, benchmarks honestos y tests con tolerancia.",
+    "En data quality y analytics de banca, fintech y retail en Perú, el **cómputo vectorizado con NumPy** es la base de métricas de completitud, unicidad y señales por pares. Aquí abres **CP-N2-A** con arrays sintéticos, benchmarks honestos y tests con tolerancia numérica.",
```

### Diff 2 — Student-facing map (replace meta retheme) (Issues 2–3 / ML-2–4)

```diff
--- a/src/lib/course/sections/s14-security.ts
+++ b/src/lib/course/sections/s14-security.ts
@@ theory[0]
-      heading: "De “Seguridad para Automatizaciones e IA” a NumPy vectorizado (mapa de la sección)",
+      heading: "Mapa de la sección: NumPy para un tablero de calidad",
       paragraphs: [
-        "En V3, **S14 no es el path principal de OWASP LLM, prompt injection ni Presidio**. Ese material se reubica al tramo de seguridad/IA. Aquí inicia **CP-N2-A**: ndarrays, máscaras, ufuncs, broadcasting, views/copies, NaN y vectorización aplicada a **métricas de calidad sintéticas**.",
+        "**Diccionario rápido:** **ndarray** (bloque homogéneo), **dtype** (tipo), **shape** (dimensiones), **máscara** (filtro booleano), **ufunc** (op. elemento a elemento), **broadcast** (alinear shapes), **view vs copy**, **NaN/inf** (no son ceros de negocio). Tras el dashboard de evidencia de S13 (reglas y scores por caso), aquí calculas **métricas vectorizadas** sobre lotes sintéticos.",
         "El hilo conductor es un **tablero de calidad** (completitud, unicidad, rangos, señales por pares) en NumPy. Solo datos sintéticos latam (Lima/Arequipa/Cusco, ids `C00x`). Si el shape o dtype no cumple el contrato de la función, **aserta y falla** — no “arregles” en silencio. Stack: NumPy ndarray/ufunc/broadcast; **sin** pandas (S15) ni sklearn.",
         "Orden: **T1 Arrays** → **T2 Operaciones** → **T3 Semántica** → **T4 Rendimiento**. Métrica del gate: métricas vectorizadas equivalentes al baseline loop dentro de tolerancia (`allclose`). Nunca PII real ni scores tratados como culpa.",
       ],
       callout: {
         type: "info",
-        title: "Contenido reubicado conceptualmente",
-        content:
-          "Material legado de seguridad/IA de este archivo **no es el camino V3 del estudiante en S14**. Target: NumPy vectorizado para CP-N2-A (inicio). Conserva datos sintéticos; nunca PII real.",
+        title: "Límite de esta sección",
+        content:
+          "Solo NumPy sobre datos sintéticos. No uses pandas (S15), sklearn ni PII real. Si el contrato dtype/shape falla, reporta el error; no lo ocultes.",
       },
```

### Diff 3 — Icon toward compute (Issue 6 / ML-8)

```diff
-  icon: "ShieldCheck",
+  icon: "Binary", // or "Grid3x3" / "Sigma" — pick an icon already in the app set
```

*(If id rename is deferred for routing stability, document only in internal map; **never** explain “id conservado” in student prose.)*

### Diff 4 — Fix S14-T4-B-E2 starter to match allclose task (Issue 7 / P0)

```diff
         starterCode: {
           language: 'python',
           title: "exercise.py",
-          code: `# CASO-LIM-014 · dtype downcast
-# DEFECT: no cast float32
+# CASO-LIM-014 · allclose con atol
+# Bug a corregir: comparación demasiado estricta o sin allclose
 import numpy as np
-a = np.arange(10, dtype=np.float64)
-print(a.dtype, a.nbytes)
-print('ok', True)`,
+a = np.array([1.0, 2.0])
+b = np.array([1.0 + 1e-9, 2.0])
+print(a == b)  # comparación exacta: incorrecta para floats
+print('ok', True)`,
         },
```

### Diff 5 — Fix S14-T4-B-E3 starter to match assert_allclose fail (Issue 8 / P0)

```diff
         starterCode: {
           language: 'python',
           title: "exercise.py",
-          code: `# CASO-LIM-014 · memory budget
-# DEFECT: no chequea budget
+# CASO-LIM-014 · assert_allclose debe fallar
+# Bug a corregir: no captura AssertionError / no fuerza falla
 import numpy as np
-a = np.zeros((1000, 100), dtype=np.float64)
-budget = 1_000_000
-print("within_budget", True)
-print(a.nbytes)
-print('ok', True)`,
+try:
+    np.testing.assert_allclose([0.0, 0.0], [0.0, 0.0], atol=1e-3)  # pasa: defect
+    print("ok")
+except AssertionError:
+    print("fail")`,
         },
```

### Diff 6 — Align T1-A-E3 starter invalid case with solution (Issue 9)

```diff
 validate(np.array([0.1, 0.2], dtype=np.float64))
 try:
-    validate(np.array([[1, 2]], dtype=np.float64))
+    validate(np.array([1, 2]))  # 1D pero no float64
 except ValueError as e:
-    print(e)
-print('ok', True)`,
+    print("err", e)`,
```

*(Instruction already expects `err expected 1d float64`; keep solution message stable.)*

### Diff 7 — Shorten We Do instruction stem (Issue 10) — pattern for all 24

```diff
-        instruction:
-          "E2 (independiente) — Concepto: S14-T4-B (NumPy y cómputo vectorizado). Entrada: fixture sintético del starter (`CASO`/ids C00x) en NumPy vectorizado. Tarea: Usa allclose entre [1.0, 2.0] y [1.0+1e-9, 2.0] con atol=1e-8; imprime el booleano. Salida/pass: `True`. Conserva el contrato del starter (no borres asserts ni datos); no pandas S15, no sklearn; solo numpy ndarray/ufunc/broadcast (S01–S14).",
+        instruction:
+          "E2 (independiente) — Usa `np.allclose` entre `[1.0, 2.0]` y `[1.0+1e-9, 2.0]` con `atol=1e-8` e imprime el booleano. Salida esperada: `True`. Solo NumPy; corrige el bug del starter.",
```

### Diff 8 — Repair truncated T2-B-E2 instruction (Issue 11)

```diff
-          "…no pandas S15,.",
+          "…no pandas (S15) ni sklearn; solo NumPy.",
```

### Diff 9 — Expand You Do starter toward full objectives (Issue 12)

```diff
 def completeness(flags: np.ndarray) -> np.ndarray:
     """flags: (n_clients, n_fields) 0/1 → media por campo."""
-    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
     raise NotImplementedError
 
+def uniqueness_rate(ids: np.ndarray) -> float:
+    """Proporción de ids únicos (unicidad)."""
+    raise NotImplementedError
+
+def in_range_rate(scores: np.ndarray, lo: float = 0.0, hi: float = 1.0) -> float:
+    """Fracción de scores finitos dentro de [lo, hi]."""
+    raise NotImplementedError
+
 def pairwise_diff(scores: np.ndarray) -> np.ndarray:
     """scores (n,) → matriz (n,n) de diferencias score_i - score_j."""
-    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
     raise NotImplementedError
+
+def bench_weighted_mean(X: np.ndarray, w: np.ndarray) -> dict:
+    """Compara loop vs X @ w; devuelve dict con allclose y ratio (o tiempos)."""
+    raise NotImplementedError
```

### Diff 10 — Rubric + resource note de-meta (Issues 4–5)

```diff
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Cumple los objetivos de métricas vectorizadas y evidencia del portfolio", weight: "25%" },
@@ resources
-        note: "Curso desplegado; alinear con V3 S14 NumPy",
+        note: "Edición pública del curso (progreso en el navegador)",
```

### Diff 11 — Self-check expansion (Issue 13) — add 3 items (sketch)

```diff
+    {
+      question: "¿Cuándo son compatibles dos shapes para broadcasting?",
+      options: [
+        "Solo si son idénticos",
+        "Si, de derecha a izquierda, cada dimensión es igual o una es 1 (o ausente)",
+        "Si el producto de las dimensiones coincide",
+        "Solo con keepdims=True",
+      ],
+      correctIndex: 1,
+      explanation: "El broadcasting alinea de derecha a izquierda; si no hay compatibilidad, ValueError.",
+    },
+    {
+      question: "np.allclose(a, b, rtol=…, atol=…) sirve principalmente para:",
+      options: [
+        "Cambiar el dtype a float32",
+        "Comparar floats con tolerancia (p. ej. loop vs vectorizado)",
+        "Forzar una view",
+        "Eliminar NaN automáticamente",
+      ],
+      correctIndex: 1,
+      explanation: "allclose/assert_allclose validan equivalencia numérica con rtol y atol.",
+    },
+    {
+      question: "Un benchmark honesto loop vs vectorizado debe incluir:",
+      options: [
+        "Solo N=10 y el tiempo del loop",
+        "Mismo input/dtype, timing y verificación de equivalencia numérica",
+        "Solo el ratio sin chequear igualdad",
+        "Usar print en cada iteración del loop",
+      ],
+      correctIndex: 1,
+      explanation: "Sin equivalencia, un ratio de tiempo no demuestra que la versión vectorizada sea correcta.",
+    },
```

### Diff 12 — Soften machine-specific ratio outputs (Issue 16)

```diff
-        output: `equal True
-ratio_loop_over_vec 135.8`,
+        output: `equal True
+ratio_loop_over_vec >1.0  # el valor exacto depende de la máquina`,
```

*(If the UI requires exact string match for demos, keep numeric output but add theory sentence: “el número de tu máquina variará”.)*

### Diff 13 — Uniqueness micro-content (Issue 17)

```diff
+ // In T2-A or new callout after reductions:
+ // "Unicidad: n_unique / n = np.unique(ids).size / ids.size sobre ids sintéticos C00x."
```

Plus one We Do optional polish or You Do helper as in Diff 9.

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 — P0** | #7, #8 (T4-B E2/E3 starters) | Broken practice path; undermines last topic and portfolio readiness. |
| **2 — P1** | #1–#3, #6 (meta map + identity) | First screen trust; remove curriculum archaeology. |
| **3 — P1/P2** | #9 (T1-A-E3 alignment), #11 (truncated instruction) | Integrity and polish of We Do. |
| **4 — P2** | #10 (instruction stems), #4–#5 (rubric/resource) | Extraneous load + residual meta. |
| **5 — P2** | #12 (You Do scaffold), #13 (self-check), #17 (unicidad) | LO alignment and assessment coverage. |
| **6 — P2/P3** | #14 (S13 bridge), #16 (ratios), #15/#18/#20 (style) | Flow and polish after structural fixes. |
| **Defer** | Full `id`/`filename` rename | Requires routing/tests plan; scrub student text first; keep internal SECTION_MAP note. |

**Suggested Fixer acceptance checks**
1. No student-visible “V3”, “reubic”, “legado”, “id de plataforma”, “OWASP”, “Presidio” in S14 copy.  
2. Every We Do triple: instruction task ≡ starter domain ≡ solution output.  
3. Self-check ≥ 8 items spanning T1–T4.  
4. You Do starter mentions or stubs all stated objectives.  
5. Live card title remains NumPy; icon not security-themed if icon set allows.

---

## 8. Graph Memory Update notes

*(For shared curriculum hardening context — S14 node only.)*

```yaml
node: S14
platform_id: security   # legacy; student title: NumPy y cómputo vectorizado
file: src/lib/course/sections/s14-security.ts
phase: 1
capstone: CP-N2-A (start)
upstream:
  - S13: Familiarity Evidence Dashboard; no NumPy; ends N1
downstream:
  - S15: Pandas ingesta (same CP-N2-A thread)
edges:
  - quality_board_story: strong (completitud, máscaras, pairwise, allclose)
  - i_we_you_structure: complete_8x
  - meta_leak: high (V3 retheme + security legacy identity)
  - we_do_integrity: broken_on_T4B_E2_E3
  - self_check_coverage: partial_5_of_8_LOs
  - automated_audit_S14: ACCEPT (boilerplate only; do not treat as pedagogy sign-off)
score_explorer: 7.2
fixer_focus:
  - repair_T4B_starters
  - rewrite_map_without_security_archaeology
  - de_meta_jobRelevance_rubric_resources
  - expand_selfcheck_youdo_uniqueness
graph_warnings:
  - icon_ShieldCheck_mismatches_topic
  - hash_security_vs_title_NumPy
  - do_not_reintroduce_OWASP_Presidio_into_S14_student_path
```

**Shared pattern flag (cross-section, not fixed here):** Many V3 retargeted sections use the same “De {legacy title} a {new topic}” map + “Contenido reubicado conceptualmente” callout (also seen S13/S15). Fixer should treat this as a **template debt** when batching early phase-1 sections.

---

## Explorer closing

**Section 14 is pedagogically viable (strong quality-metrics narrative + full I/We/You grid) but not release-clean:** two We Do starters are wrong, opening copy leaks curriculum retheme/security identity, and assessment/portfolio coverage lag the stated learning outcomes.

This is the complete Explorer report for Section 14. Ready for the Fixer prompt.
