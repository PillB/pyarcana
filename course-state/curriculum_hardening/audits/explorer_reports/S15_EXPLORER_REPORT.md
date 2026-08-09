# S15 Explorer Report — Pandas: ingesta, selección y tipos

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering + Harness Engineering  
**Scope rule:** Section 15 only — analyze, do not fix  
**Generated:** 2026-07-24  

**Sources consulted**
- Live site: https://pillb.github.io/pyarcana/ (curriculum card + pedagogy model I Do / We Do / You Do)
- Live focus hash: `#stdlib-deep`
- Repo source (workspace): `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s15-stdlib-deep.ts`
- Gold peers: `s01-setup.ts`, `s02-basics.ts`; adjacent N2 peer: `s14-security.ts` (NumPy)
- Prior automated audit: `course-state/curriculum_hardening/audits/S15_AUDIT.json` (ACCEPT — **insufficient** as gold oracle: no meta-leak / pedagogy depth)
- Gold bar: `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md`
- External pedagogy / domain: Cognitive Load Theory + worked examples; pandas docs (`read_csv`, indexing, dtypes, IO); Real Python SettingWithCopy / file IO; Effective Pandas (Harrison); Python for Data Analysis (McKinney); DataQuest / Data School on chained assignment

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Section index | **15** |
| Platform id (hash) | `stdlib-deep` |
| Title (learner-facing) | Pandas: ingesta, selección y tipos |
| shortTitle / live card | Pandas ingesta |
| Source file | `src/lib/course/sections/s15-stdlib-deep.ts` |
| estimatedHours | 18 |
| level / phase | Competente · phase 1 |
| Capstone thread | CP-N2-A (dataset): clientes/transacciones sintéticas, schema, coerciones, manifest |
| Structural inventory | Theory map + **8** subtopics (T1–T4 × A/B); **8** I Do demos; **24** We Do (E1/E2/E3 × 8); You Do project; **5** selfCheck MCQ; resources |
| Out of scope this run | S14, S16+, product TS edits, applying diffs |

**Topic graph (nodes)**  
`Series/Index/DataFrame` → `read_csv/excel + parser` → `loc/iloc/assign` → `copy/chained assignment` → `string/nullable/datetime/category` → `schema + coercion report` → `export CSV/Excel + parquet contract` → `manifest/provenance/memory` → **You Do ingest tipada**.

**Edges to adjacent sections (roadmap-consistent)**  
S14 NumPy vectorizado → S15 Pandas ingesta → S16 Calidad/contratos → S17 Joins/groupby. S08 archivos/ETL already introduced CSV/pathlib; S15 is the first full pandas modeling layer for CP-N2-A.

---

## 2. Executive Summary of Quality

### Score: **6.2 / 10**

### Verdict
**Structurally complete and domain-correct core**, but **not gold**. S15 has the right skeleton (8/8/24, real pandas APIs, synthetic Lima/Arequipa cases, fail-closed schema ethos) and demos that mostly *compute* rather than pure print-theater. However, **learner-facing redaction is heavily contaminated by V3 retarget / authoring meta**, exercise instructions are **templated walls of curriculum-ops boilerplate**, theory lacks the **diccionario + narrative progressive disclosure** of S01/S02, You Do is a **thin stub** relative to eight LOs, and several copy issues (capitalization, truncated fence, *Coaccionar*) undermine ES-PE polish.

Prior `S15_AUDIT.json` (`verdict: ACCEPT`, `high_issue_count: 0`) and paragraph ranks (~9.55) **overstate** quality: they do not penalize meta-leak, exercise boilerplate, or connective-tissue gaps that the gold checklist and this Explorer pass treat as first-class defects.

### Dimension snapshot

| Dimension | Score (1–10) | One-line finding |
|-----------|--------------|------------------|
| 1. Meta-text / developer leakage | **3.0** | V3/stdlib reubicación, `id stdlib-deep`, DEFECT comments, “gate V3”, scope fences S16/S17 |
| 2. Grammar & redaction (ES-PE) | **6.0** | Generally correct technical Spanish; headings lowercase; typos/truncations; telegraphic style |
| 3. Connective tissue & flow | **5.5** | Map exists but meta-first; no student dictionary; weak bridge from S14 in learner voice |
| 4. Pedagogical structure (I/We/You) | **7.0** | Solid 8 demos + 24 ladder; You Do under-scaffolded; I Do intros inventory-like |
| 5. Cognitive load & progressive disclosure | **6.0** | Good topic order; exercise boilerplate raises extraneous load; T1-A E3 alignment is early |
| 6. Exercise & exam quality | **6.5** | Real defects/solutions/outputs; generic feedback/tests; truncated E3; thin quiz |
| 7. Roadmap consistency | **8.0** | Aligns S14→S15→S16→S17 and CP-N2-A; legacy id is platform debt only |
| 8. External best-in-class comparison | **6.5** | Matches McKinney/Harrison topic sequence; weaker narrative & isolation of SettingWithCopy than Real Python / Data School |
| 9. Other (a11y, motivation, deps) | **6.5** | openpyxl assumed; scores-as-guilt caution present; motivation thinner than S01 jobRelevance |

---

## 3. Detailed Issue Registry

Severity: **P0** blocker for gold · **P1** high learner impact · **P2** medium · **P3** polish.

### Issue 1 — P0 · Meta-leak: V3 retarget / “stdlib profunda” framing
- **Location:** `jobRelevance`; theory[0] heading + paragraphs; callout title/content  
- **Evidence:**
  - `"Esta sección (id \`stdlib-deep\` conservado) retematiza a V3 e incrementa **CP-N2-A (dataset)**..."`
  - `"En V3, **S15 no es el path principal de contextlib, functools, descriptors ni typing avanzado**. Ese material se reubica."`
  - Callout: `"Contenido reubicado conceptualmente"` / `"Material legado de stdlib avanzada **no es el camino V3 en S15**."`
- **Pedagogical impact:** Student opens S15 and is told what the course *used to be* and internal version codes. Extraneous load (CLT); breaks immersion; signals unfinished curriculum surgery.
- **Dimensions:** 1, 3, 5

### Issue 2 — P0 · Meta-leak: We Do instruction template (×24)
- **Location:** every `weDo.steps[].instruction`  
- **Evidence (pattern):**  
  `"E1 (guiado) — Concepto: S15-T1-A (Pandas ingesta, selección y tipos). Entrada: fixture sintético del starter (\`CASO\`/ids C00x) en Pandas ingesta. Tarea: ... Conserva el contrato del starter ... no quality-gate avanzado de S16, no joins S17 solo pandas Series/DataFrame + stdlib (S01–S15)."`  
- **Pedagogical impact:** Each exercise carries ~150–200 chars of curriculum-ops fence before the actual task. Students must filter authoring metadata (subtopic codes, future sections) — classic **extraneous cognitive load**. Also reads as AI/ops paste, not teacher voice.
- **Dimensions:** 1, 3, 5, 6

### Issue 3 — P1 · Meta-leak: `# DEFECT:` authoring tags in starters (×24)
- **Location:** every `starterCode.code` first lines, e.g. `# DEFECT: no set_index; imprime columns`  
- **Pedagogical impact:** The *bug-to-fix* pattern is pedagogically excellent (worked-example inversion), but the label `DEFECT` is developer/QA jargon. Learners should see student-facing phrasing (“Error a corregir”, “El bug: …”) or silent broken code with the instruction stating what is wrong. As written, it leaks authoring workflow.
- **Dimensions:** 1, 4, 6

### Issue 4 — P1 · Meta-leak: rubric & resources “V3”
- **Location:** `youDo.rubric[0]`; `resources.courses` note for PyArcana live  
- **Evidence:** `"Alineación al gate V3 de la sección"`; `"Curso desplegado; V3 S15 Pandas"`  
- **Pedagogical impact:** Rubric criterion is unintelligible to a portfolio reviewer or student; should name observable artifacts (schema report, row reconciliation, manifest).
- **Dimensions:** 1, 6

### Issue 5 — P1 · Truncated / broken exercise fence (S15-T4-A-E3)
- **Location:** instruction id `S15-T4-A-E3`  
- **Evidence:** ends with `"no quality-gate avanzado de S16, no."` — sentence cut off mid-template.  
- **Pedagogical impact:** Looks unfinished; confuses scope; redaction quality fail.
- **Dimensions:** 2, 6

### Issue 6 — P1 · Missing student “diccionario” and thin `jobRelevance` vs gold S01/S02
- **Location:** map theory block; `jobRelevance` (single dense sentence with meta)  
- **Evidence:** S01/S02 open with multi-paragraph workplace story + **Diccionario de la sección**. S15 map leads with “no es contextlib…”.  
- **Pedagogical impact:** First contact should define Series, DataFrame, Index, dtype, schema, coerce, manifest, provenance in learner Spanish *before* APIs. Without it, progressive disclosure depends on prior informal knowledge.
- **Dimensions:** 3, 5, 7, 8

### Issue 7 — P2 · ES-PE heading capitalization & tone
- **Location:** theory headings for T1-B…T4-B  
- **Evidence:** `"lectura CSV/Excel y opciones de parser"`, `"loc/iloc, filtros y assign"`, `"chained assignment y copy semantics"`, `"strings, nullable, fechas y categorías"`, `"coerción explícita y schema"`, `"índices, formatos, provenance y memoria"` — sentence-case / English-first, unlike polished Spanish titles on live cards (“Pandas ingesta”).  
- **Pedagogical impact:** UI TOC looks unfinished; mixed language hierarchy.
- **Dimensions:** 2, 9

### Issue 8 — P2 · Lexical error: “Coaccionar”
- **Location:** I Do step `S15-T3-A-DEMO` description  
- **Evidence:** `"Coaccionar string/category, numeric y fechas con conteo de NaN"`  
- **Note:** Spanish for dtype coercion is **coercionar** / **forzar conversión**; *coaccionar* = coerce a person (threaten).  
- **Pedagogical impact:** Wrong technical vocabulary in a Competente section.
- **Dimensions:** 2

### Issue 9 — P2 · Punctuation / grammar in scope fences
- **Location:** several instructions, e.g. S15-T1-A-E1, S15-T2-B-E1  
- **Evidence:** `"no joins S17 solo pandas Series/DataFrame"` (missing punctuation); `"con NaN como None en to_dict cuidado: usa fillna"` (run-on / informal).  
- **Pedagogical impact:** Low polish; harder parse under load.
- **Dimensions:** 2, 6

### Issue 10 — P2 · You Do under-aligned to LOs and portfolio bar
- **Location:** `youDo`  
- **Evidence:** Starter only implements `ingest_clientes` → `NotImplementedError`; objectives mention transacciones, reconcile, export, manifest, but starter has no transacciones fixture, no export helpers, no acceptance asserts. Rubric weights “gate V3” not artifacts.  
- **Pedagogical impact:** Gradual release breaks at transfer: We Do drills micro-skills; You Do does not recombine them into a portfolio-grade CP-N2-A slice.
- **Dimensions:** 4, 6, 7

### Issue 11 — P2 · Generic `tests` / `feedback` fields (×24)
- **Location:** all weDo steps  
- **Evidence:** `tests: "salida coincide con solution output"`; `feedback: "Compara tu salida con la solución."`  
- **Pedagogical impact:** No formative feedback pathways; no assertion predicates; weak for harness / self-check beyond string match.
- **Dimensions:** 6

### Issue 12 — P2 · Cognitive load: early Series alignment (T1-A E3)
- **Location:** `S15-T1-A-E3`  
- **Evidence:** requires `s1.add(s2, fill_value=0).sort_index()` after only introducing Index — closer to alignment/join intuition (S17 territory) than “set_index basics”.  
- **Pedagogical impact:** Transfer step may overload novices to pandas even at Competente if S14 was NumPy-only.
- **Dimensions:** 5, 6, 7

### Issue 13 — P2 · Latin decimal handling is ad-hoc
- **Location:** I Do `S15-T1-B-DEMO`  
- **Evidence:** `text = raw.replace(",", ".")` before `read_csv` rather than teaching `decimal=','` / `thousands` carefully, and may interact poorly if other commas appear.  
- **Pedagogical impact:** Missed chance to teach real LatAm CSV contracts; slightly fragile pedagogy.
- **Dimensions:** 6, 8, 9

### Issue 14 — P3 · Self-check thin for 18h section
- **Location:** `selfCheck` (5 items)  
- **Evidence:** Covers loc, SettingWithCopy, coerce, manifest, loc-vs-copy — good topics, but no schema-missing-column, parse_dates, index stability, export `index=False`, category.  
- **Pedagogical impact:** Active recall coverage incomplete vs 8 LOs.
- **Dimensions:** 6

### Issue 15 — P3 · I Do intro is inventory, not narrative
- **Location:** `iDo.intro`  
- **Evidence:** `"8 demos de modelo, lectura, loc/assign, copias, tipos, schema, export y manifest."`  
- **Pedagogical impact:** Misses “story arc” (recibes CSV de retailer → … → manifest).
- **Dimensions:** 3, 4

### Issue 16 — P3 · Dependency / environment: openpyxl assumed
- **Location:** theory T4-A, I Do export, We Do T4-A-E2  
- **Evidence:** `engine="openpyxl"` required; map says pandas + stdlib but Excel needs third-party.  
- **Pedagogical impact:** Exercise fails hard if env only has pandas; needs explicit S01-style dependency note in theory or callout.
- **Dimensions:** 6, 9

### Issue 17 — P3 · Theory density vs gold narrative depth
- **Location:** most theory paragraphs (~2–3 short paras per subtopic)  
- **Evidence:** Gold bar asks Anchor → Mechanism → Worked example → Edge with ~≥250 chars avg and workplace story; S15 is correct but telegraphic; S01 has multi-sentence elaboration and hover dictionary strategy.  
- **Pedagogical impact:** Competent learners can follow, but retention and transfer weaker without narrative glue.
- **Dimensions:** 3, 5, 8

### Issue 18 — P3 · Icon / id semantics mismatch (platform debt, learner-visible only via meta)
- **Location:** `id: "stdlib-deep"`, `icon: "Settings"`  
- **Note:** Live title correctly shows Pandas; only meta prose exposes id. Keep id for routing, strip from learner text (ties to Issue 1).  
- **Dimensions:** 7, 9

### Issue 19 — P3 · Starter noise `print('ok', True)`
- **Location:** many weDo starters  
- **Evidence:** broken logic then always prints `ok True` — may teach students that “ok” is success signal unrelated to the real pass string.  
- **Pedagogical impact:** Mild confusion; prefer single wrong output matching the grading channel.
- **Dimensions:** 6

### Strengths (for Fixer balance — not issues)
1. **Topic sequence** matches industry pandas teaching (Series/DF → IO → select → types → export/provenance).  
2. **Fail-closed schema** + coercion *report* (not silent fill) is excellent professional ethics for Perú banking/retail synthetic cases.  
3. **Chained assignment** treated with loc + `.copy()` and danger callout — aligned with Real Python / DataQuest guidance.  
4. **Demos compute** from DataFrames (not pure `print("expected")`).  
5. **24-exercise ladder** guided → independent → transfer structure is intact.  
6. **Resources** point to official pandas docs + McKinney + Harrison.  
7. **No real PII**; score ≠ culpa stated in map.  
8. Structural 8/8/24 present (necessary gold conditions).

---

## 4. Meta-Leak Report

Exact learner-visible (or starter-visible) leaked text and locations.

| # | Exact / pattern text | Location |
|---|----------------------|----------|
| M1 | `id \`stdlib-deep\` conservado` + `retematiza a V3` | `jobRelevance` |
| M2 | `De “stdlib profunda” a Pandas ingesta (mapa de la sección)` | theory[0].heading |
| M3 | `En V3, **S15 no es el path principal de contextlib, functools, descriptors ni typing avanzado**. Ese material se reubica.` | theory[0].paragraphs[0] |
| M4 | Title `Contenido reubicado conceptualmente` + `Material legado de stdlib avanzada **no es el camino V3 en S15**` | theory[0].callout |
| M5 | `Concepto: S15-T*-*` + `no quality-gate avanzado de S16, no joins S17` + `stdlib (S01–S15)` | **24×** `weDo.steps[].instruction` |
| M6 | `# DEFECT: …` | **24×** `starterCode` |
| M7 | `Alineación al gate V3 de la sección` | `youDo.rubric[0]` |
| M8 | `Curso desplegado; V3 S15 Pandas` | `resources.courses` PyArcana note |
| M9 | Internal subtopic/demo ids in learner prose dense form (`S15-T1-A` inside instruction “Concepto:”) | weDo instructions |

**meta_leak_count (distinct sites):** **9 patterns** · **~54 concrete instances** if counting each exercise DEFECT + each fence.

**Not counted as meta-leak (acceptable):** technical English API names (`loc`, `iloc`, `read_csv`, `SettingWithCopyWarning`); case ids `CASO-LIM-015` as lab fixture labels; forward pedagogical pointers to S16/S17 *if rewritten in student voice* (“en la próxima sección harás quality gates; aquí solo reportas coerciones”).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (applied)

| Principle | Implication for S15 |
|-----------|---------------------|
| **Worked examples (CLT)** | I Do demos reduce germane load for pandas APIs — present and mostly good |
| **Progressive disclosure** | One new operator family per subtopic — mostly honored; map dumps full stack early |
| **Extraneous load** | Meta fences and DEFECT tags inflate load without teaching |
| **Gradual release (I/We/You)** | We ladder exists; You Do does not fully recombine skills |
| **Industry pandas path** | McKinney/Harrison: IO + dtypes + indexing + mutation safety — content aligned |
| **SettingWithCopy teaching** | Consensus: single `loc` assignment or explicit `.copy()` — section teaches this well |

### 5.2 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | High structure, medium narrative | 8 demos with `why`; code+output honest; intro is a checklist |
| **We Do** | High structure, low language quality | E1/E2/E3 present; starters are real defects; instructions are ops-template soup |
| **You Do** | Low–medium | Context OK; starter incomplete vs stated objectives; rubric meta |
| **Self-check** | Medium | 5 fair MCQs with explanations; under-coverage |

### 5.3 Cognitive load map

```
Germane (desired): Series/DF model → typed read → select/assign → copy safety → dtypes → schema report → export/manifest
Extraneous (remove): V3/stdlib history, platform id, S15-T* concept codes, S16/S17 ops fences, DEFECT tags, gate V3
Intrinsic (manage): SettingWithCopy + nullable dtypes + schema — keep sequencing; soften T1-A E3 or add bridge sentence
```

### 5.4 Connective tissue vs gold peers

| Element | S01/S02 gold | S15 current |
|---------|--------------|-------------|
| Workplace story | Long, Perú-specific | One meta-heavy sentence |
| Diccionario | Explicit block | Absent |
| Map callout | Learner tips | “Contenido reubicado” |
| Exercise voice | Task-first | Fence-first |
| You Do | Full challenge arc | Partial stub |

### 5.5 Consistency with roadmap

- Live curriculum card matches title/tagline (Pandas ingesta).  
- Content matches V3 S15 topic, **not** legacy stdlib-deep — good content decision, bad learner-facing explanation of the decision.  
- Stack boundary S16 quality / S17 joins is correct pedagogically; phrase as “por ahora no hagas X” without catalog codes.

### 5.6 External comparison

| Source | What S15 matches | Where S15 lags |
|--------|------------------|----------------|
| pandas Getting Started | Series/DF, IO | Less narrative onboarding |
| Real Python SettingWithCopy | loc + copy patterns | Less “why view vs copy” story |
| Effective Pandas | assign, dtypes | Less method-chaining style teaching |
| Keith Galli / Kaggle-style | practical CSV | Fewer end-to-end “messy CSV” stories in theory |
| CLT worked examples | I Do steps | We Do text not process-oriented |

### 5.7 Redaction notes (ES-PE)

- Prefer **coerción / coercionar**, never *coaccionar*.  
- Capitalize headings as Spanish titles.  
- Prefer “índice de negocio”, “reporte de coerciones”, “manifiesto de exportación” consistently (mix of manifest/provenance English is OK if defined once).  
- Replace telegraphic “Hilo:” with full sentence for voice consistency with S01.

### 5.8 Graph memory (nodes with weak edges)

| Node | Weak edge | Risk |
|------|-----------|------|
| Map | → Student motivation | Dropout at section open |
| WeDo instruction | → Task clarity | Students skim wrong |
| YouDo starter | → LO export/manifest | Portfolio incomplete |
| T1-A E3 align | → T1-A theory | Early overload |
| openpyxl | → Env contract | Silent exercise fail |

---

## 6. Proposed GitHub-style Diffs

> **Do not apply in this Explorer run.** Paths relative to repo root. Diffs are illustrative Fixer-ready patches; Fixer may merge/split.

### Diff A — Strip jobRelevance meta; add workplace framing (Issue 1, 6)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@
   jobRelevance:
-    "La **ingesta tipada con Pandas** es el día a día de analistas en banca y retail en Perú: CSV/Excel de clientes y transacciones, dtypes controlados y export reproducible. Esta sección (id `stdlib-deep` conservado) retematiza a V3 e incrementa **CP-N2-A (dataset)** con fixtures sintéticos.",
+    "En banca, fintech y retail en Perú, el día a día del analista es **ingerir CSV/Excel de clientes y transacciones** sin inventar datos: declarar dtypes, reportar coerciones, reconciliar filas/columnas y exportar un dataset analítico con **manifest** (quién, cuántas filas, hash). Aquí construyes esa base de **CP-N2-A** con fixtures sintéticos (Lima/Arequipa, ids `C00x`/`T00x`, sin PII real).",
```

### Diff B — Rewrite map theory + callout (Issue 1, 6, 15)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@
     {
-      heading: "De “stdlib profunda” a Pandas ingesta (mapa de la sección)",
+      heading: "Mapa de la sección: de NumPy a tablas tipadas",
       paragraphs: [
-        "En V3, **S15 no es el path principal de contextlib, functools, descriptors ni typing avanzado**. Ese material se reubica. Aquí construyes el **dataset de CP-N2-A**: Series/DataFrame, lectura tipada, selección, tipos nullable, coerción con schema y export con provenance.",
-        "Hilo: **clientes y transacciones sintéticas** (Lima/Arequipa, montos en PEN, ids `C00x`/`T00x`). Sin PII real. Si una columna del schema falta o el dtype no cuadra, **falla explicable** — no inventes defaults. Stack: pandas + stdlib S01–S15; quality-gate avanzado es S16; joins profundos son S17.",
-        "Orden: **T1 Modelo/lectura** → **T2 Selección** → **T3 Tipos** → **T4 Exportación**. Métrica del gate: filas leídas reconciliadas, reporte de coerciones y manifest de export. Nunca PII real ni scores como culpa.",
+        "**Diccionario de la sección** (léelo antes de T1). **Series:** vector con **Index** (etiquetas). **DataFrame:** tabla de columnas alineadas por el mismo Index. **dtype:** tipo de una columna (`string`, `float64`, `datetime64`, `category`…). **Schema:** contrato columna→tipo esperado. **Coerción:** conversión explícita (p. ej. texto→número); con `errors='coerce'`, lo inválido pasa a NaN y **se cuenta**. **loc / iloc:** selección por etiqueta vs por posición. **Chained assignment:** asignar en cadena `df[...][...] =` puede no escribir donde crees (**SettingWithCopyWarning**). **Manifest:** registro de filas, columnas, dtypes, memoria y provenance (origen + hash). **Provenance:** de dónde salió el archivo y si cambió entre corridas.",
+        "Tras el cómputo vectorizado de S14, aquí modelas el **dataset de CP-N2-A** con pandas: lectura tipada, selección idiomática, tipos nullable y export reproducible. El hilo son **clientes y transacciones sintéticas** (Lima/Arequipa, montos en PEN, ids `C00x`/`T00x`). Sin PII real. Si falta una columna del schema o el dtype no cuadra, **falla explicable** — no inventes defaults. Los quality gates profundos y los joins quedan para secciones siguientes; aquí te enfocas en ingesta honesta.",
+        "Orden: **T1 Modelo/lectura** → **T2 Selección** → **T3 Tipos** → **T4 Exportación**. Criterio de cierre: filas leídas reconciliadas, reporte de coerciones y manifest de export. Nunca PII real ni trates un score sintético como culpa o fraude.",
       ],
       callout: {
         type: "info",
-        title: "Contenido reubicado conceptualmente",
+        title: "Contrato de esta sección",
         content:
-          "Material legado de stdlib avanzada **no es el camino V3 en S15**. Target: Pandas ingesta tipada para CP-N2-A.",
+          "Stack: pandas + lo ya visto en el curso. Reporta coerciones; no “arregles” en silencio. Exporta con `index=False` salvo que el index sea clave de negocio documentada.",
       },
     },
```

### Diff C — Capitalize theory headings (Issue 7)

```diff
-      heading: "lectura CSV/Excel y opciones de parser",
+      heading: "Lectura CSV/Excel y opciones del parser",
-      heading: "loc/iloc, filtros y assign",
+      heading: "loc, iloc, filtros y assign",
-      heading: "chained assignment y copy semantics",
+      heading: "Chained assignment y semántica de copias",
-      heading: "strings, nullable, fechas y categorías",
+      heading: "Strings, nullable, fechas y categorías",
-      heading: "coerción explícita y schema",
+      heading: "Coerción explícita y schema",
-      heading: "índices, formatos, provenance y memoria",
+      heading: "Índices, formatos, provenance y memoria",
```

### Diff D — Fix “Coaccionar” (Issue 8)

```diff
-        description: "Coaccionar string/category, numeric y fechas con conteo de NaN",
+        description: "Coercionar string/category, numeric y fechas con conteo de NaN",
```

### Diff E — Humanize one exercise instruction template (apply pattern to all 24) (Issues 2, 5, 9)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@
         instruction:
-          "E1 (guiado) — Concepto: S15-T1-A (Pandas ingesta, selección y tipos). Entrada: fixture sintético del starter (`CASO`/ids C00x) en Pandas ingesta. Tarea: Crea un DataFrame con columnas cliente_id y score (2 filas) y pon cliente_id como index; imprime index.tolist(). Salida/pass: `['C001', 'C002']`. Conserva el contrato del starter (no borres asserts ni datos); no quality-gate avanzado de S16, no joins S17 solo pandas Series/DataFrame + stdlib (S01–S15).",
+          "E1 (guiado) — **Index de negocio.** Con el DataFrame del starter (ids `C001`/`C002`), pon `cliente_id` como index e imprime `index.tolist()`. Salida esperada: `['C001', 'C002']`. No borres los datos del starter. Quédate en Series/DataFrame (sin joins ni validaciones de calidad avanzadas).",
```

**Same pattern for T4-A-E3 (fix truncation):**

```diff
-          "E3 (transferencia) — Concepto: S15-T4-A ... no quality-gate avanzado de S16, no.",
+          "E3 (transferencia) — **Contrato de dtypes.** Emite un dict `{col: str(dtype)}` para el DF del starter e imprímelo ordenado por clave. Salida esperada: `{'cliente_id': 'object', 'monto': 'float64'}`. Solo pandas/stdlib; sin quality gates avanzados ni joins.",
```

### Diff F — Student-facing defect comments (Issue 3, 19) — example E1

```diff
-          code: `# CASO-LIM-015 · set_index
-# DEFECT: no set_index; imprime columns
+          code: `# CASO-LIM-015 · set_index
+# Error a corregir: falta set_index; hoy imprime columns en vez del index
 import pandas as pd
 df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.5, 0.8]})
 print(df.columns.tolist())
-print('ok', True)`,
+`,
```

(Apply analogous rewrites for all 24 starters; drop trailing `print('ok', True)` unless the pass channel depends on it.)

### Diff G — Rubric + resources de-meta (Issue 4)

```diff
     rubric: [
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Schema tipado + reporte de coerciones y reconciliación de filas/columnas", weight: "25%" },
...
-        note: "Curso desplegado; V3 S15 Pandas",
+        note: "Sección en vivo: Pandas ingesta",
```

### Diff H — Strengthen You Do (Issue 10) — outline

```diff
     starterCode: `import pandas as pd
 from io import StringIO
+import hashlib
+import json

 CLIENTES = """cliente_id,region,score
 C001,Lima,0.9
 C002,Arequipa,0.4
 C003,Lima,NA
 """

+TRANSACCIONES = """tx_id,cliente_id,monto,fecha
+T001,C001,10.5,2024-01-15
+T002,C002,N/A,2024-02-01
+T003,C001,3.0,2024-02-10
+"""
+
+SCHEMA_CLIENTES = {"cliente_id": "string", "region": "string", "score": "float64"}
+
 def ingest_clientes(text: str) -> tuple[pd.DataFrame, dict]:
-    # Contrato: read_csv + schema + report
+    \"\"\"Lee CSV, aplica schema, devuelve (df, coercion_report).\"\"\"
     raise NotImplementedError
+
+def reconcile(df: pd.DataFrame, expected_cols: list[str]) -> dict:
+    \"\"\"Devuelve {rows, columns, missing_columns}.\"\"\"
+    raise NotImplementedError
+
+def export_with_manifest(df: pd.DataFrame, source: str) -> dict:
+    \"\"\"CSV index=False + manifest con rows/columns/sha1/source.\"\"\"
+    raise NotImplementedError

 if __name__ == "__main__":
     df, report = ingest_clientes(CLIENTES)
-    print(df.head(), report)
+    print(df.head())
+    print("coercion_report", report)
+    print("reconcile", reconcile(df, list(SCHEMA_CLIENTES)))
+    print("manifest", export_with_manifest(df, "synthetic_clientes_v1"))
 `,
```

### Diff I — Self-check expansion sketch (Issue 14)

Add 3 MCQs: (1) `parse_dates` vs string dates; (2) missing schema column → KeyError / fail-closed; (3) `to_csv(..., index=False)` prevents `Unnamed`.

### Diff J — I Do intro (Issue 15)

```diff
-    intro: "8 demos de modelo, lectura, loc/assign, copias, tipos, schema, export y manifest.",
+    intro: "Recibes tablas sintéticas de un retailer peruano. Observa cómo se modela el Index, se lee el CSV con dtypes, se selecciona con loc/assign, se evita chained assignment, se tipa y se exporta con manifest — ocho demos en el mismo hilo de clientes/transacciones.",
```

### Diff K — openpyxl callout (Issue 16)

```diff
+      // attach near T4-A or T1-B Excel mention
+      callout: {
+        type: "warning",
+        title: "Dependencia Excel",
+        content:
+          "Para `to_excel`/`read_excel` necesitas `openpyxl` en el entorno (`pip install openpyxl`). Si no está, completa el contrato con CSV + schema JSON y documenta el límite.",
+      },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 — P0 meta strip** | 1, 2, 4 (Diffs A, B, E, G) | Highest learner-trust damage; cheapest high-ROI redaction |
| **2 — P1 exercise voice** | 3, 5, 9, 19 (Diffs E, F) | 24× surface; do as systematic template rewrite |
| **3 — P1 You Do arc** | 10 (Diff H) | Completes gradual release to CP-N2-A |
| **4 — P2 language polish** | 7, 8 (Diffs C, D) | ES-PE credibility |
| **5 — P2 pedagogy polish** | 11, 12, 13, 14, 15, 16 (Diffs I–K + feedback predicates) | Load, deps, active recall |
| **6 — P3 depth** | 17, 18 | Narrative expansion toward ≥9.5 gold only after P0–P2 clean |

**Suggested Fixer acceptance gates**
1. Zero occurrences of learner-facing `V3`, `retematiza`, `stdlib profunda`, `contenido reubicado`, `gate V3`, `id \`stdlib-deep\`` in section prose.  
2. Zero `# DEFECT:` (replaced by student-facing error notes or none).  
3. Every weDo instruction task-first; no truncated fences.  
4. You Do exercises at least schema + coerce report + reconcile + export/manifest.  
5. Headings title-case Spanish; *coercionar* spelling fixed.  
6. Re-read live `#stdlib-deep` after deploy for TOC/map voice vs S01.

---

## 8. Graph Memory Update notes

```yaml
section: 15
id: stdlib-deep
file: s15-stdlib-deep.ts
title: "Pandas: ingesta, selección y tipos"
explorer_score: 6.2
status: explorer_complete
gold_gap: true

nodes:
  - S15.map: weak_edge_to_motivation (meta-first)
  - S15.theory.T1-T4: domain_ok, narrative_thin
  - S15.iDo.8: strength_compute_demos
  - S15.weDo.24: structure_ok, instruction_boilerplate_p0
  - S15.youDo: under_scaffolded_vs_LOs
  - S15.selfCheck: thin_coverage
  - S15.meta_leaks: V3_stdlib_DEFECT_gate_fences

edges:
  - S14.numpy -> S15.pandas: roadmap_ok, learner_bridge_weak
  - S15.ingest -> S16.quality_gate: correctly_deferred, badly_phrased_in_fences
  - S15.types -> S17.joins: MultiIndex mention ok
  - S08.etl_csv -> S15.read_csv: assumed_prior_ok

fixer_queue:
  - strip_meta_V3_stdlib
  - rewrite_24_instructions
  - rephrase_24_DEFECT
  - expand_youDo
  - capitalize_headings
  - fix_coaccionar
  - openpyxl_callout

anti_oracle:
  - S15_AUDIT.json ACCEPT must not block Fixer
  - paragraph_analysis 9.55 ranks overstate (template analysis)

shared_context_for_S16_explorer:
  - expect_same_meta_patterns_if_sibling_retarget
  - S15 promises coercion_report feeds S16 — keep contract language aligned
```

---

## Appendix — Structural inventory (evidence)

| Block | Count / note |
|-------|----------------|
| learningOutcomes | 8 |
| theory headings | 9 (1 map + 8 subtopics) |
| iDo.steps | 8 (`S15-T1-A-DEMO` … `S15-T4-B-DEMO`) |
| weDo.steps | 24 (E1/E2/E3 × 8) |
| youDo | 1 project, thin starter |
| selfCheck.questions | 5 |
| resources.docs | 7 |
| Synthetic geography | Lima, Arequipa, Cusco |
| Lab case tag | `CASO-LIM-015` |

---

This is the complete Explorer report for Section 15. Ready for the Fixer prompt.
