# S20 Explorer Report — Automatización robusta de Excel

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Platform section id (hash):** `rag`  
**Source file:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s20-rag.ts`  
**Live URL:** https://pillb.github.io/pyarcana/#rag  
**Roadmap alignment:** `learning_roadmap_52_V3.md` → S20 — Automatización robusta de Excel  
**Generated:** 2026-07-24  
**Scope rule:** Section 20 only. Analysis and proposed diffs; **no fixes applied**.

---

## 1. Section Identification & Scope

| Field | Value |
| --- | --- |
| Index | 20 |
| Title | Automatización robusta de Excel |
| shortTitle | Excel factory |
| id (stable hash) | `rag` (legacy; **not** RAG content in V3) |
| Phase / level | Phase 1 · Competente |
| estimatedHours | 18 |
| Icon / accent | `MessageSquare` · blue→indigo gradient |
| Prerequisites (stated) | S17–S19 |
| Downstream | S21 Reporting Factory · CP-N2-B gate |
| Structure inventory | 9 theory blocks (1 map + 8 subtopics T1–T4), 8 I Do demos, 24 We Do exercises (8× guided/independent/transfer), 1 You Do portfolio, 5 selfCheck items, resources (docs/books/courses) |

**What the section claims to teach**

1. Workbook model: sheets, cells, tables, named ranges; formulas vs cached values.  
2. Presentation: styles, charts, templates; dates/locales, merges, sheet protection.  
3. Quality: reconciliation of totals/n, pivots, validation rules, structure preservation.  
4. Operations: batch over many xlsx, corrupt/lock isolation, backups, idempotency, structural tests + manifest.

**Live vs source**

- Live curriculum card shows shortTitle/tagline matching the Excel factory retheme (public site lists “Excel factory”).  
- Source is the single content authority for theory / I Do / We Do / You Do / quiz; this report is grounded primarily in `s20-rag.ts` plus live catalog confirmation and roadmap V3.  
- Prior shallow auditor (`S20_AUDIT.json`) verdict **ACCEPT** (0 high issues) — this Explorer pass finds **substantive pedagogical and meta-leak defects** that automated boilerplate ranking missed.

**Pre-round pedagogy research (relevant lenses applied)**

- **Gradual release of responsibility (I Do → We Do → You Do):** worked examples first, then completion problems, then independent transfer.  
- **Cognitive Load Theory:** limit extraneous load (jargon, meta-redesign notes); use completion/faded scaffolding rather than “fix this Boolean” micro-edits.  
- **Domain best practice (openpyxl / Excel automation):** Real Python + official tutorial emphasize `Workbook`/`load_workbook`, `save`, `iter_rows`, formulas vs `data_only`, styles, charts; industry guidance stresses graceful error handling, relative paths, never overwrite masters without backup.  
- **S20 product angle (factory/ops)** is legitimately more ambitious than a pure “hello openpyxl” tutorial — but only if file I/O, template copy, and reconciliation are actually practiced end-to-end.

---

## 2. Executive Summary of Quality

### Score: **5.8 / 10**

### Verdict

S20 has a **coherent V3 conceptual spine** (Excel as delivery contract in Peruvian ops/finance; synthetic Lima/Cusco/PEN; fail-closed reconciliation; manifest; handoff to S21/CP-N2-B). Topic order T1→T4 matches the roadmap. I Do coverage is one demo per subtopic. Privacy posture (synthetic only, no PII) is consistent.

However, learner-facing quality is **materially below early gold-standard sections (e.g. S01)** and below external openpyxl teaching (Real Python / openpyxl docs):

1. **Heavy curriculum meta-leak** (RAG→Excel redesign, “id `rag` conservado”, “Material legado”, “V3”, “oráculo”, “DEFECT”) pollutes jobRelevance, theory map, callouts, exercises, quiz distractors, rubric, and resources.  
2. **Outcomes over-promise, demos under-deliver:** named ranges, charts, sheet protection, `load_workbook`/`save`, template-copy-from-master, real `BadZipFile`/locks are claimed but barely or never coded.  
3. **We Do quality is template-generated:** formulaic instructions; multiple **instruction↔solution concept mismatches**; many exercises are non-openpyxl Boolean/dict edits that do not build factory skill.  
4. **At least one theory code sample is indent-broken** (`batch.py`) and would raise `IndentationError` if executed as shown.  
5. **Connective tissue is telegram-dense** (VP, gate, CP-N2-B, fail-closed) without a S01-style glossary for the Competente learner who is still building reporting muscle.

**Net:** Ready as a *skeleton* for CP-N2-B Excel factory; **not ready as polished student-facing curriculum** without a Fixer pass focused on redaction of meta-text, outcome/demo alignment, exercise integrity, and real file I/O.

---

## 3. Detailed Issue Registry

Severity scale: **P0** blocker for trust/learning · **P1** high impact · **P2** medium · **P3** polish.

### Issue 01 — P0 · Meta-leak: theory map frames “we used to be RAG”

| | |
| --- | --- |
| **Location** | `theory[0]` heading/paragraphs + callout |
| **Evidence** | Heading: `De “RAG en producción” a Excel factory (mapa)`. Body: `En V3, **S20 no es RAG de embeddings en producción**. El id \`rag\` se conserva…`. Callout: `Material legado de RAG de este archivo **no es el camino V3 en S20**.` |
| **Impact** | Students experience internal redesign notes, not a lesson. Extraneous load; erodes professionalism of the public edition. |
| **Pedagogy** | Violates “user-facing only” redaction; confuses topic identity (Excel vs RAG/embeddings). |

### Issue 02 — P0 · Meta-leak in jobRelevance

| | |
| --- | --- |
| **Location** | `jobRelevance` |
| **Evidence** | `Esta sección (id \`rag\` conservado) retematiza a V3 **Automatización robusta de Excel** para **CP-N2-B (excel factory)**…` |
| **Impact** | First motivation block exposes stable-id engineering and versioning jargon. |
| **Pedagogy** | Motivation should sell *why Excel automation matters in Perú*, not how the CMS id was preserved. |

### Issue 03 — P1 · Icon leftover from RAG era

| | |
| --- | --- |
| **Location** | `icon: "MessageSquare"` |
| **Evidence** | Message/chat icon for an Excel factory section; RAG-era semantic residue. |
| **Impact** | Visual inconsistency on live catalog/section chrome; weak mental model. |
| **Pedagogy** | Icon should prime “spreadsheet/factory”, not “chat messages”. |

### Issue 04 — P1 · Learning outcomes promise skills never demonstrated

| | |
| --- | --- |
| **Location** | `learningOutcomes` vs theory/code |
| **Evidence** | Outcomes include “tablas y named ranges”, “charts y plantillas”, “protección”; theory mentions them; **no code** uses `defined_names`, `Table`, chart APIs, or `ws.protection`. Entire file never calls `load_workbook` or `wb.save`. |
| **Impact** | Outcome–assessment misalignment; students “pass” We Do without the skills outcomes claim. |
| **Pedagogy** | Outcomes must be observable in I Do/We Do/You Do (constructive alignment). |

### Issue 05 — P0 · Missing core openpyxl I/O for a “template adapter”

| | |
| --- | --- |
| **Location** | All theory codes, all I Do demos, You Do starter |
| **Evidence** | Zero `load_workbook`, zero `wb.save(...)`, zero copy of master template to output path. Tagline/gate: *“lee los formatos sintéticos del VP, produce un workbook… sin dañar la plantilla”*. |
| **Impact** | Students never practice the actual factory contract (read template → write output path → leave master intact). |
| **Pedagogy** | Worked examples omit the critical schema of professional Excel automation (Real Python / openpyxl tutorial: create/load/save is foundational). |

### Issue 06 — P1 · Theory `batch.py` code is indent-broken

| | |
| --- | --- |
| **Location** | `S20-T4-A` theory code `batch.py` |
| **Evidence** | ```python\nfor f in files:\n if f.startswith("b"):\n status[f] = "corrupt"\n else:\n status[f] = "ok"\n``` (body of `if`/`else` not indented past the conditional). |
| **Impact** | If the in-browser/runner executes theory snippets, this raises `IndentationError`; otherwise students copy broken “canonical” code. |
| **Pedagogy** | Worked example must be runnable; broken examples destroy trust (CLT: extraneous failure load). |

### Issue 07 — P1 · We Do instruction↔solution concept mismatches (systematic)

| | |
| --- | --- |
| **Location** | Multiple `weDo.steps` |
| **Evidence (examples)** | |
| | `S20-T2-A-E2` instruction: “freeze_panes o dimensión de print” → solution: `PatternFill` |
| | `S20-T2-B-E3` instruction: “protección / flag writable” → solution: count of `merged_cells.ranges` |
| | `S20-T3-A-E2` instruction: “conteo n filas de datos” → solution: `groupby…sum().to_dict()` |
| | `S20-T3-A-E3` instruction: “pivot materializado” → solution: `reconcile` tol function (no pivot) |
| | `S20-T3-B-E2` instruction: “structural_ok de sheetnames” → solution: allowlist of regions |
| | `S20-T3-B-E3` instruction: “preservar hoja de catálogo” → solution: `validate_rows` violators |
| **Impact** | Guided practice trains wrong labels; transfer exercises appear random; autocheck may pass while conceptual map fractures. |
| **Pedagogy** | Fatal for progressive disclosure: labels must match the schema being practiced. |

### Issue 08 — P1 · Student-facing harness meta in every exercise instruction

| | |
| --- | --- |
| **Location** | All 24 We Do `instruction` strings + starter comments |
| **Evidence** | Boilerplate: `Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): …` Starters: `# DEFECT: …`, often `print('ok', True)` oracles. |
| **Impact** | “oráculo”, “TODO”, “DEFECT”, “Fixture `S20-…`” are developer/test-harness language. |
| **Pedagogy** | Increases extraneous load; sounds like internal QA, not coaching. |

### Issue 09 — P1 · We Do often too trivial / not openpyxl

| | |
| --- | --- |
| **Location** | e.g. `S20-T3-A-E1`, `S20-T4-A-E1`, `S20-T4-B-E1`, `S20-T3-B-E1` |
| **Evidence** | E1 reconcile: change `portada = 16` → `15`. Batch E1: change `"corrupt"` → `"ok"` in a generator. Backup E1: flip `False` → `True` in a dict. Schema E1: add missing `"monto"` to a list. |
| **Impact** | 18h section with 24 exercises that often reward pattern-matching the solution output, not Excel factory reasoning. |
| **Pedagogy** | Completion problems should remove productive steps of a *real* openpyxl workflow, not Boolean flips. |

### Issue 10 — P1 · Batch/corrupt/lock path is simulated with string heuristics only

| | |
| --- | --- |
| **Location** | Theory T4-A, I Do 7, We Do T4-A |
| **Evidence** | Theory text mentions `BadZipFile` and locks; code uses `if f.startswith("b")` or `"lock" in name`. No try/except around `load_workbook`. |
| **Impact** | Operational skill claimed at roadmap T4 is not practiced; false confidence. |
| **Pedagogy** | At least one worked example should catch real openpyxl/zip failure modes (even with synthetic corrupt bytes). |

### Issue 11 — P2 · Thin connective tissue vs gold-standard early sections

| | |
| --- | --- |
| **Location** | All theory paragraphs |
| **Evidence** | Typical block = 3 dense sentences: concept → “Contrato: …” → “Caso: …”. No S01-style dictionary, no “why this fails in a bank ops team” narrative arc beyond a sentence. |
| **Impact** | Competent learners can follow if already fluent; weaker or mid-track learners hit jargon walls (VP, gate, materializar, fail-closed, structural_ok). |
| **Pedagogy** | Narrative glue and progressive disclosure of vocabulary are weaker than S01–S05 quality bar. |

### Issue 12 — P2 · Inconsistent sheet naming across demos

| | |
| --- | --- |
| **Location** | Theory vs I Do |
| **Evidence** | Theory promotes `Entrada`/`Datos`/`Salida`; I Do uses `Datos`/`Resultados`; You Do starts with `Entrada` only. |
| **Impact** | Contract of stable names is taught then immediately violated by the course’s own demos. |
| **Pedagogy** | One canonical sheet contract for the section reduces germane load waste. |

### Issue 13 — P2 · You Do under-scaffolded vs rubric/gate

| | |
| --- | --- |
| **Location** | `youDo` |
| **Evidence** | Starter only creates `Entrada` + one row and prints `sheetnames`. Objectives require reconcile, batch, backup, idempotency, manifest. Rubric criterion: “Alineación al gate V3 de la sección”. |
| **Impact** | Large jump from micro-exercises to portfolio; incomplete GRR fade (We Do never assembled a full factory). |
| **Pedagogy** | Need intermediate scaffold (skeleton modules or checklist of files: `adapter.py`, `manifest.json`, `backup/`). |

### Issue 14 — P2 · Quiz distractor re-injects RAG/embeddings

| | |
| --- | --- |
| **Location** | `selfCheck` Q3 options |
| **Evidence** | Option: `"Embeddings"` among manifest audit answers. |
| **Impact** | Residual RAG framing; mild but confirms incomplete retheme hygiene. |
| **Pedagogy** | Distractors should be plausible Excel-ops mistakes (e.g. “solo el color de fuente” already present — embeddings is off-domain). |

### Issue 15 — P2 · Self-check depth thin for 18h

| | |
| --- | --- |
| **Location** | `selfCheck` (5 questions) |
| **Evidence** | Good topics (formulas, merges, manifest, idempotency, fail-closed reconcile) but no items on `data_only`, template non-destructive write, structural sheet validation, or batch quarantine. |
| **Impact** | Autocheck unlock may not verify critical factory gates. |
| **Pedagogy** | Active recall set undersized vs content breadth. |

### Issue 16 — P2 · Spanish redaction / tone uneven (Peruvian professional target)

| | |
| --- | --- |
| **Location** | Mixed paragraphs |
| **Evidence** | Angled hybrids left bare: `fail-closed`, `gate`, `VP`, `DoS`, `ok_count`, `structural_ok`, `data_only=True`. Colloquial OK (“pinta ejecutiva”) next to telegram contracts. Occasional English code titles only (fine) but explanations don’t define terms on first use. |
| **Impact** | Accessibility for Spanish-first learners; tone less “mentor peruano” than S01. |
| **Pedagogy** | First use should gloss technical English; keep code identifiers English as industry norm. |

### Issue 17 — P3 · Pass criteria in instructions use wrong separator

| | |
| --- | --- |
| **Location** | e.g. `S20-T1-A-E1`, `S20-T1-B-E3` |
| **Evidence** | Pass text: `` `['Entrada'] | region` `` and `` `True | False` `` while actual outputs are multi-line prints without pipes. |
| **Impact** | Students may hunt for a single-line pipe format that never appears. |
| **Pedagogy** | Exact-match contracts must match `solutionCode.output` literally. |

### Issue 18 — P3 · Resources note still says “V3”

| | |
| --- | --- |
| **Location** | `resources.courses` → “PyArcana live” note |
| **Evidence** | `curso desplegado; V3 S20 Excel factory` |
| **Impact** | Minor meta-leak in resource list. |

### Issue 19 — P2 · Charts / named ranges / protection only in headings

| | |
| --- | --- |
| **Location** | T1-A heading, T2-A heading/paragraphs, T2-B heading |
| **Evidence** | Roadmap T1/T2 explicitly list named ranges, charts, protección; section mirrors headings then demos only Font/Fill, date, merge. |
| **Impact** | Roadmap fidelity cosmetic; skill gap vs V3 map. |
| **Pedagogy** | Either add minimal demos or narrow outcomes/headings to what is taught. |

### Issue 20 — P3 · Filename / id dissonance for maintainers (student-visible via URL hash)

| | |
| --- | --- |
| **Location** | File `s20-rag.ts`, URL `#rag` |
| **Evidence** | Live hash remains `rag` while title is Excel. |
| **Impact** | Sharing links says “rag”; support confusion. Acceptable if product policy freezes ids — but then **all student-facing prose must stop mentioning the freeze**. |

### Issue count summary

| Severity | Count |
| --- | --- |
| P0 | 3 (Issues 01, 02, 05) |
| P1 | 7 (03, 04, 06, 07, 08, 09, 10) |
| P2 | 7 (11–16, 19) |
| P3 | 3 (17, 18, 20) |
| **Total issues** | **20** |
| **Meta-leak items** | **≥ 8 distinct surfaces** (jobRelevance, theory map, callout, icon, exercise harness language ×24, quiz embeddings, rubric “gate V3”, resource “V3”) |

---

## 4. Meta-Leak Report

Exact leaked / developer-facing strings (user-visible if rendered as written):

| # | Location | Exact / representative text |
| --- | --- | --- |
| M1 | `jobRelevance` | `Esta sección (id \`rag\` conservado) retematiza a V3 **Automatización robusta de Excel**…` |
| M2 | `theory[0].heading` | `De “RAG en producción” a Excel factory (mapa)` |
| M3 | `theory[0].paragraphs[0]` | `En V3, **S20 no es RAG de embeddings en producción**. El id \`rag\` se conserva;…` |
| M4 | `theory[0].callout` | title `Contenido reubicado conceptualmente`; content `Material legado de RAG de este archivo **no es el camino V3 en S20**. Target: automatización Excel para CP-N2-B.` |
| M5 | We Do instructions (×24) | `Completa el TODO del starter sin borrar el oráculo;… Fixture \`S20-…\`` |
| M6 | We Do starters | `# DEFECT: …` / `print('ok', True)` harness lines |
| M7 | `youDo.rubric[0]` | `Alineación al gate V3 de la sección` |
| M8 | `selfCheck` Q3 option | `Embeddings` |
| M9 | `resources.courses` note | `curso desplegado; V3 S20 Excel factory` |
| M10 | Visual | `icon: "MessageSquare"` (RAG residue) |

**meta_leak_count (distinct surfaces):** **10** (M1–M10; instructions counted as one surface class despite 24 instances).

**Fix principle:** Student text should never explain CMS id preservation, prior section themes, or internal version labels. Stable ids may remain in code; prose must sell Excel factory only.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
| --- | --- | --- |
| **I Do** | Moderate | 8 demos, one per subtopic — good breadth. Demos are short worked examples (GRR-aligned) but stay in-memory; never save/load. |
| **We Do** | Weak | Structure guided→independent→transfer is correct **formally**, but content is often label-mismatched and micro-edits. Hints are one-liners. Feedback always “Compara tu salida con la solución.” — no formative diagnosis. |
| **You Do** | Weak–moderate | Portfolio goal matches gate language, but starter and We Do never assembled the full pipeline; rubric still generic + “gate V3”. |

**Missing middle:** No “We Do capstone exercise” that wires: load template → validate headers → write values → reconcile → manifest → backup path.

### 5.2 Cognitive load & progressive disclosure

- **Intrinsic load:** High (openpyxl + pandas reconcile + ops resilience) — appropriate for Competente if scaffolded.  
- **Extraneous load:** High due to meta-leaks, harness jargon, mismatched exercise labels, missing save/load.  
- **Germane load:** Under-supported — few “why this design” expansions; contracts listed but not narrated as failure stories.  
- **CLT recommendation:** Define 6–8 glossary terms once (plantilla master, celda ancla, valor materializado, conciliación, fail-closed, manifest, idempotencia, cuarentena); remove redesign notes; ensure each We Do completes a step of that glossary.

### 5.3 Exercise & exam alignment

| Claimed skill | Practiced? | Assessment |
| --- | --- | --- |
| sheets/cells | Yes (theory, I Do, We Do T1-A) | OK |
| formulas vs values | Yes (T1-B) | Quiz Q1 OK |
| styles | Partial (Font/Fill only) | OK micro |
| charts | No | Outcome false |
| named ranges | No | Outcome false |
| merges/dates | Yes | Quiz Q2 OK |
| protection | No (label only) | Outcome false |
| reconcile/pivot | Partial (pandas, not xlsx values) | Quiz Q5 OK |
| structural validation | Partial (lists/sets) | Weak |
| batch corrupt/lock | Simulated only | Weak |
| backup/idempotency | Dict/hash micro | Quiz Q3–Q4 OK conceptually |
| load template / save output | **No** | **Gap vs gate** |

### 5.4 Roadmap & neighbor consistency

- **Matches V3 T1–T4 titles** closely.  
- **S19** hands off “figuras → reporting factory S20–S21”; S20 tagline continues that arc.  
- **S21** expects workbook + reconciled numbers from S20 — reinforces need for real xlsx artifacts, not only `print` contracts.  
- Same **retheme meta pattern** as S19 (`id … conservado`, “Material legado”) — systemic V3 hygiene debt; Fixer should treat as section-local instance of a family of bugs.

### 5.5 External benchmark (best-in-class)

| Source | What they do better | What S20 does better |
| --- | --- | --- |
| [Real Python openpyxl guide](https://realpython.com/openpyxl-excel-spreadsheets-python/) | Progressive read→write→style→chart; real files; `load_workbook`/`save`; intermediate narrative | Production mindset: reconcile, fail-closed, manifest, synthetic PE ops context |
| [openpyxl official tutorial](https://openpyxl.readthedocs.io/en/stable/tutorial.html) | Canonical create/load/save, `iter_rows`, warnings | Batch/quarantine and idempotency framing |
| Automate the Boring Stuff (Excel chapters) | Task-driven beginner stories | Capstone/factory + privacy discipline |
| Industry Excel automation practice | Relative paths, graceful errors, never clobber masters | S20 **names** these norms but under-codes them |

**Comparative quality score vs external:** conceptual ops framing ~8/10; executable teaching craft ~4.5/10.

### 5.6 Redaction / grammar (español peruano profesional)

- Generally grammatical; short sentences work for scanability.  
- Issues: telegraphic “Contrato:” blocks without verbs; unglossed English; “oráculo” inappropriate; “pinta ejecutiva” acceptable colloquial; mixed `es-PE` requirement in You Do vs English code comments.  
- No catastrophic grammar failures found; **tone** is the larger problem (internal design doc vs mentor).

### 5.7 Accessibility & motivation

- Motivation line about Excel as delivery contract in Peruvian finance/ops is strong — **keep and expand**.  
- No alt-path for learners without Excel GUI (theory warns CI Linux has no Excel — good) but then doesn’t show headless assert strategy beyond “materialize values” (good principle, under-illustrated).  
- Color-only corporate header styling is fine for code demos.

### 5.8 Graph memory (nodes of concern)

```
[Meta-leak cluster] → erodes trust on all T* nodes
[Outcomes] ─broken edge─> [Demos missing named_ranges/charts/protection/save]
[Tagline gate] ─broken edge─> [You Do starter / We Do never load template]
[We Do labels] ─broken edge─> [Solution concepts]  (Issues 07)
[T4-A theory code] ─broken edge─> [Runnable example]
[S19 viz] ─ok─> [S20 factory] ─weak artifact─> [S21 package]
```

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only**. Paths relative to repo root. Apply in Fixer pass after product decisions on id freeze.

### Diff A — Strip meta-leak from jobRelevance (Issue 02)

```diff
--- a/src/lib/course/sections/s20-rag.ts
+++ b/src/lib/course/sections/s20-rag.ts
@@
- jobRelevance:
- "En finanzas, operaciones y reporting en Perú, **Excel sigue siendo el contrato de entrega**. Esta sección (id `rag` conservado) retematiza a V3 **Automatización robusta de Excel** para **CP-N2-B (excel factory)** con openpyxl, plantillas, conciliación y manifests — sin PII real.",
+ jobRelevance:
+ "En finanzas, operaciones y reporting en Perú, **Excel sigue siendo el contrato de entrega**. Aquí construyes un **excel factory** con openpyxl: lees plantillas sintéticas del VP, escribes un workbook de resultados sin dañar el master, concilias totales y dejas un **manifest** de cambios — sin PII real. Este incremento alimenta el paquete de reporting de CP-N2-B.",
```

### Diff B — Replace theory map intro + callout (Issue 01)

```diff
--- a/src/lib/course/sections/s20-rag.ts
+++ b/src/lib/course/sections/s20-rag.ts
@@
- heading: "De “RAG en producción” a Excel factory (mapa)",
+ heading: "Excel factory: de la plantilla al manifest (mapa)",
  paragraphs: [
- "En V3, **S20 no es RAG de embeddings en producción**. El id `rag` se conserva; el camino es la **automatización robusta de Excel** (openpyxl) como reporting factory: hojas, tablas, fórmulas vs valores, estilos, conciliación, validación estructural, batch e idempotencia.",
+ "Esta sección es **automatización robusta de Excel** con openpyxl: un reporting factory que manipula hojas, tablas, fórmulas vs valores, estilos, conciliación, validación estructural, batch e idempotencia.",
  "Hilo: workbook sintético `cpn2b_factory.xlsx` con hojas Entrada/Datos/Salida, regiones Lima/Cusco y montos PEN. Una corrida debe ser reejecutable sin corromper plantillas ni inventar filas. Nunca PII real en celdas.",
  "Orden: **T1 Modelo de libro** (sheets, celdas, tablas, named ranges; fórmulas vs cache) → **T2 Presentación** (estilos, charts Excel, fechas/locales, protección) → **T3 Calidad** (conciliación, pivots, validación, preservación) → **T4 Operación** (batch, corruptos/locks, backups, idempotencia, tests estructurales). Prerrequisitos S17–S19.",
  ],
  callout: {
- type: "info",
- title: "Contenido reubicado conceptualmente",
- content:
- "Material legado de RAG de este archivo **no es el camino V3 en S20**. Target: automatización Excel para CP-N2-B.",
+ type: "tip",
+ title: "Contrato de la sección",
+ content:
+ "Salida esperada: workbook de resultados + manifest (estados, conciliación, backup). La plantilla master no se sobrescribe. Datos solo sintéticos.",
  },
```

### Diff C — Icon (Issue 03)

```diff
- icon: "MessageSquare",
+ icon: "FileSpreadsheet", // or "Table" / "Sheet" — pick existing icon set member
```

### Diff D — Align outcomes to taught skills OR add demos (Issue 04 / 19)

**Option D1 (narrow outcomes — smaller change):**

```diff
  learningOutcomes: [
- { text: "Manipular sheets, celdas, tablas y named ranges" },
+ { text: "Manipular sheets, celdas y encabezados estables con openpyxl" },
  { text: "Distinguir fórmulas de valores cacheados" },
- { text: "Aplicar estilos, charts y plantillas" },
+ { text: "Aplicar estilos de encabezado y copiar plantillas a un path de salida" },
- { text: "Manejar fechas, locales, merged cells y protección" },
+ { text: "Manejar fechas ISO y celdas combinadas (celda ancla) sin romper layouts" },
  { text: "Conciliar totales y trabajar con pivots lógicos" },
  { text: "Preservar estructura y validaciones" },
- { text: "Operar batch con corruptos y locks" },
+ { text: "Operar batch aislando corruptos y locks con contadores auditables" },
  { text: "Garantizar backups, idempotencia y tests estructurales" }
  ],
```

**Option D2 (preferred product-wise):** keep outcomes; add I Do + theory snippets for `load_workbook`/`save`, one named range or table, minimal chart or explicit “charts optional — prefer S19 PNG”, and `protection.sheet` fail-clear message.

### Diff E — Add load/save worked example (Issue 05) — new theory or first I Do step

```diff
# Suggested new demo (insert as S20-T1-A-DEMO or expand existing):
+ from openpyxl import Workbook, load_workbook
+ from pathlib import Path
+ import shutil
+
+ master = Path("templates/cpn2b_factory.xlsx")
+ out = Path("out/results.xlsx")
+ # Never write master in-place:
+ shutil.copy(master, out)
+ wb = load_workbook(out)
+ ws = wb["Entrada"]
+ # ... write validated rows ...
+ wb.save(out)
+ print("saved", out.name, "master_intact", master.exists())
```

### Diff F — Fix `batch.py` indentation (Issue 06)

```diff
  code: `def s20_th_7():
     files = ["a.xlsx", "b.xlsx", "c.xlsx"]
     status = {}
     for f in files:
-     if f.startswith("b"):
-     status[f] = "corrupt"
-     else:
-     status[f] = "ok"
+        if f.startswith("b"):
+            status[f] = "corrupt"
+        else:
+            status[f] = "ok"
     print(status)
     print("ok_count", sum(v == "ok" for v in status.values()))

 s20_th_7()`,
```

(Prefer replacing string heuristic with try/except BadZipFile in a later diff.)

### Diff G — Fix We Do concept mismatches (Issue 07) — sample for T2-A-E2

```diff
  id: "S20-T2-A-E2",
  ...
  instruction:
- "E2 (independiente) — Concepto: freeze_panes o dimensión de print. …",
+ "E2 (independiente) — Concepto: relleno de encabezado con PatternFill. Crea un workbook, aplica PatternFill solid color 1F4E79 en A1 y muestra si fgColor no es None. Pass: `True`.",
```

Apply analogous renames for:

| id | Instruction concept must become |
| --- | --- |
| S20-T2-B-E3 | “contar rangos merged” (not protection) |
| S20-T3-A-E2 | “pivot/groupby suma por región” |
| S20-T3-A-E3 | “función reconcile con tolerancia” |
| S20-T3-B-E2 | “filtrar regiones fuera de allowlist” |
| S20-T3-B-E3 | “validate_rows: devolver violators” |

**Or** rewrite solutions to match the current instruction labels (heavier).

### Diff H — Humanize We Do instructions (Issue 08) — template

```diff
- "E1 (guiado) — Concepto: crear hoja y celda de encabezado. Fixture `S20-T1-A-E1` / datos sintéticos: wb = Workbook(); ws = wb.active. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `['Entrada'] | region`.",
+ "E1 (guiado) — Crea un workbook, renombra la hoja activa a `Entrada` y escribe `region` en A1. Imprime `sheetnames` y el valor de A1. Salida esperada (dos líneas):\n['Entrada']\nregion",
```

Starter comments:

```diff
- # DEFECT: no renombra hoja; A1 vacío
+ # Pista: falta renombrar la hoja y escribir el encabezado en A1
```

Remove trailing `print('ok', True)` from starters when solution does not print it (prevents accidental pass pollution).

### Diff I — Canonical sheet names in I Do (Issue 12)

```diff
- ws.title = "Datos"
+ ws.title = "Entrada"
  ...
- out = wb.create_sheet("Resultados")
+ out = wb.create_sheet("Salida")
```

(And align outputs.)

### Diff J — You Do scaffold + rubric (Issue 13 / M7)

```diff
  starterCode: `from openpyxl import Workbook, load_workbook
 from pathlib import Path
 import json, shutil, hashlib
 from copy import copy

 # 1) Copia plantilla master → out/results.xlsx (no escribas el master)
 # 2) Valida headers de Entrada
 # 3) Escribe hoja Salida con totales materializados en Python
 # 4) Conciliación: abs(sum_xlsx - sum_df) < 0.01 y n igual
 # 5) Escribe manifest.json {sheets, reconcile_ok, backup, input_sha1_8}
 # 6) Re-ejecutar no debe duplicar filas
 `,
  rubric: [
- { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+ { criterion: "Plantilla intacta + workbook de salida + manifest completo", weight: "25%" },
  ...
  ],
```

### Diff K — Quiz + resources meta cleanup (Issues 14, 18)

```diff
- options: ["Solo el color de fuente", "La contraseña del VP", "Estados de batch, conciliación y backups", "Embeddings"],
+ options: ["Solo el color de fuente", "La contraseña del VP", "Estados de batch, conciliación y backups", "El nombre del archivo temporal del SO"],
```

```diff
- note: "curso desplegado; V3 S20 Excel factory",
+ note: "curso desplegado; sección Excel factory",
```

### Diff L — Pass string fidelity (Issue 17)

```diff
- Pass … `['Entrada'] | region`.
+ Pass (exacto, dos líneas): primera `['Entrada']`, segunda `region`.
```

### Diff M — Optional: real corrupt handling sketch (Issue 10)

```diff
+ from openpyxl import load_workbook
+ from zipfile import BadZipFile
+
+ def classify(path: str) -> str:
+     try:
+         load_workbook(path, read_only=True)
+         return "ok"
+     except BadZipFile:
+         return "corrupt"
+     except PermissionError:
+         return "locked"
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
| --- | --- | --- |
| **1. Immediate P0 redaction** | 01, 02, M1–M4 | Public-facing curriculum must not discuss RAG redesign / id freeze. |
| **2. Runnable truth** | 06 (batch indent), 05 (load/save) | Broken or missing foundational examples. |
| **3. We Do integrity** | 07, 08, 09, 17 | Instruction/solution alignment + human language + less trivial tasks. |
| **4. Outcome / roadmap honesty** | 04, 19, 10 | Either teach named ranges/charts/protection/BadZipFile or narrow claims. |
| **5. Portfolio path** | 13, Diff J | Bridge micro-exercises → CP-N2-B excel factory. |
| **6. Polish** | 03, 11, 12, 14–16, 18, 20 | Icon, glossary, sheetname consistency, quiz/resources, Spanish glosses. |

**Suggested Fixer sprint (ordered commits):**

1. Meta-leak scrub (jobRelevance, theory map, callout, rubric, resources, quiz distractor).  
2. Fix `batch.py` + normalize code indentation style in demos.  
3. Add one load/copy/save demo; extend You Do starter.  
4. Rewrite mismatched We Do instructions (table in Issue 07).  
5. Humanize instruction boilerplate; remove DEFECT/oráculo.  
6. Align outcomes/headings or add missing micro-demos.  
7. Expand selfCheck to 8–10 items; add glossary callout.  
8. Icon swap + sheetname canon.

---

## 8. Graph Memory Update Notes

For shared curriculum graph / future agents:

```yaml
section: 20
id: rag
title: Automatización robusta de Excel
file: src/lib/course/sections/s20-rag.ts
explorer_score: 5.8
status: needs_fixer
themes:
  - excel_factory
  - openpyxl
  - reconcile_fail_closed
  - manifest_idempotency
  - cp_n2_b_increment
neighbors:
  upstream: [s17-packaging, s18-data-engineering, s19-databases-orm]
  downstream: [s21-fastapi]
systemic_pattern: |
  V3 retheme residue: jobRelevance + theory map callout "Material legado" + frozen id
  also present in S19 (databases-orm → viz). Treat as multi-section hygiene when Fixer
  runs mid-curriculum batches.
critical_gaps:
  - no load_workbook / wb.save in any demo
  - outcomes list named ranges / charts / protection without demos
  - weDo instruction-solution mismatches (list Issue 07)
  - batch.py IndentationError
meta_leaks:
  - id `rag` conservado / retematiza V3
  - RAG en producción / Material legado
  - oráculo / DEFECT / Fixture harness
  - gate V3 / V3 S20 in resources
  - Embeddings distractor
  - MessageSquare icon
quality_vs_gold:
  vs_s01: weaker narrative + glossary; denser telegram contracts
  vs_real_python_openpyxl: weaker file I/O teaching; stronger ops/reconcile framing
fixer_entrypoints:
  - Diffs A–M in this report
  - Do not change platform id unless product owns migration of #rag URLs
```

**Shared context suggestion:** Add `curriculum_hardening` flag `retheme_meta_scrub_phase1` covering S14–S26 frozen-id sections with the same callout pattern.

---

## Closing

This is the complete Explorer report for Section 20. Ready for the Fixer prompt.
