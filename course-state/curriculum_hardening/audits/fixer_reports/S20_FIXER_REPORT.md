# S20 Fixer Report — After-Fix Validation

**Generated:** 2026-07-24  
**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Authority (only):** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S20_EXPLORER_REPORT.md`  
**Edited file (only):** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s20-rag.ts`  
**Live reference:** https://pillb.github.io/pyarcana/#rag  
**Repo:** https://github.com/PillB/pyarcana  
**Explorer score before:** 5.8 / 10  
**Score after (estimate):** **9.7 / 10**

---

## 0. Anti-Aberration Acknowledgement

This Fixer pass explicitly obeyed the mission’s **CRITICAL ANTI-ABERRATION RULES**:

1. **No bulk / automated content generation** — no Python/JS (or other) scripts whose purpose is to mass-produce paragraphs, exercises, explanations, or educational text; no blurb factories, template expanders, or placeholder loops.
2. **No low-quality shortcuts** — no lorem/TODO filler; no copy-paste sentence factories; no depth reduction because the section is long.
3. **Human-quality craftsmanship** — every rewrite (theory samples, I Do demos, We Do instruction/solution alignment, You Do starter labels) was written deliberately as a careful teacher would write it.
4. **Self-correction** — validation used only structural/syntax/output checks and issue-by-issue reading; no educational content was manufactured by generators. Python was used solely to **verify** expected outputs of already-authored snippets (hashes, pivots, compile), never to invent learner prose.

**Explicit confirmation:** **no automated bulk content generation was used** for any learner-facing educational prose or exercise text.

---

## 1. Scope & Baseline

| Field | Value |
| --- | --- |
| Section | 20 · platform id `rag` (frozen; **not** mentioned in learner prose) |
| Title | Automatización robusta de Excel |
| shortTitle | Excel factory |
| Explorer issues | 20 (P0×3, P1×7, P2×7, P3×3) |
| Meta-leak surfaces (Explorer M1–M10) | 10 |
| In-scope for fix | Issues 01–19 (all P0/P1/P2 + overlapping P3 redaction) + residual code↔output integrity |
| Deferred | Issue 20 (platform id / URL hash freeze) |

**Baseline note:** Source already contained a strong prior redaction of Explorer Diffs A–M (meta-scrub, load/save, batch exceptions, We Do alignment, outcomes honesty, glossary, selfCheck 8). This pass **re-validated every Explorer issue against live source**, then applied residual hand-crafted integrity repairs: botched synthetic-region renames had left **instruction / code / expected output** out of sync in theory, I Do, and We Do — a fleet-floor regression risk even when meta-leaks were already clean.

---

## 2. Summary of changes applied (mapped to Explorer issue numbers)

| Issue | Sev | Status | What is true in `s20-rag.ts` after this pass |
| --- | --- | --- | --- |
| **01** | P0 | **Fixed** | Theory map heading *Excel factory: de la plantilla al manifest (mapa)*; body sells Excel factory only; callout *Contrato de la sección*. No RAG redesign / “Material legado” / id-freeze prose. |
| **02** | P0 | **Fixed** | `jobRelevance`: Peruvian ops/finance motivation (bancos, cajas, retailers); VP/manifest glossed; excel factory + CP-N2-B/S21 handoff; no `id rag` / retheme / V3 jargon. |
| **03** | P1 | **Fixed** | `icon: "FileSpreadsheet"`. |
| **04** | P1 | **Fixed** | `learningOutcomes` aligned to taught skills (headers/sheets, materialize KPIs, styles+copy/save, dates/merges, reconcile/pivot, validation, batch quarantine, backup/idempotency/manifest). No untaught named-ranges/charts/protection claims. |
| **05** | P0 | **Fixed** | Core I/O present: `load_workbook` + `shutil.copy` + `wb.save` in T2-A theory, I Do `S20-T2-A-DEMO`, We Do `S20-T2-A-E3`, You Do starter. Master never written in-place. |
| **06** | P1 | **Fixed** | Theory `batch.py` is runnable nested `classify` with correct indentation (0 syntax fails across extracted blocks). |
| **07** | P1 | **Fixed** | Instruction↔solution concept alignment: T2-A-E2 PatternFill; T2-B-E3 count merges; T3-A-E2 groupby sum; T3-A-E3 reconcile tol; T3-B-E2 allowlist from sheet; T3-B-E3 validate_rows violators. **This pass:** also repaired data-label drift so solutions actually produce declared outputs. |
| **08** | P1 | **Fixed** | All 24 We Do instructions coach voice; no “oráculo”, “TODO del starter”, “Fixture `S20-…`”, “DEFECT:”. Starters use `# Pista:` / `# CASO-LIM-020`. |
| **09** | P1 | **Fixed / strengthened** | Exercises framed as factory contracts; openpyxl I/O in key steps; T2-A-E2 now asserts corporate RGB (not a free pass on default fill); T3-B-E2/E3 real allowlist violators; T4 batch Counter/hash manifest. |
| **10** | P1 | **Fixed** | T4-A theory + I Do 7 + We Do T4-A use `BadZipFile` / `PermissionError`. |
| **11** | P2 | **Fixed** | Theory map **Diccionario de la sección**; Peru ops failure narratives; I Do `why` expanded (incl. T2-A plantilla contract). |
| **12** | P2 | **Fixed** | Canonical sheets **Entrada / Datos / Salida**; demos and exercises use Entrada/Salida. Synthetic regions standardized to **Lima / Cusco / Arequipa** (+ Piura/Ica as violators). |
| **13** | P2 | **Fixed** | You Do: full factory skeleton + checklist; rubric #1 = plantilla + salida + manifest; rows Lima/Cusco; COMPLETAR gaps only on materialize / reconcile / manifest write. |
| **14** | P2 | **Fixed** | selfCheck Q3 distractor: *El nombre del archivo temporal del SO* (no Embeddings). |
| **15** | P2 | **Fixed** | selfCheck **8** items: formulas, merges, manifest, idempotency, fail-closed, template non-destructive write, BadZipFile, structural_ok. |
| **16** | P2 | **Fixed** | First-use glosses for VP, manifest, fail-closed, BadZipFile; professional es-PE mentor tone; light PE place names only (no slang stuffing). |
| **17** | P3 | **Fixed** | Pass criteria match multi-line `solutionCode.output` (no spurious pipe separators). |
| **18** | P3 | **Fixed** | Resources PyArcana note: *curso desplegado; sección Excel factory* (no V3). |
| **19** | P2 | **Fixed** | Headings/outcomes honest: styles + plantillas copy→save; fechas/merges; charts resource optional. |
| **20** | P3 | **Deferred (product)** | File `s20-rag.ts` / URL `#rag` frozen by platform policy. **All student-facing prose is silent about the freeze.** |

### Residual integrity repairs in this Fixer session (→ ≥ 9.5, estimate 9.7)

Critical **code ↔ declared output** mismatches introduced by incomplete region renames were hand-repaired:

1. **Theory T3-A `reconcile.py`** — pivot rows Lima/Lima/Cusco; output `{'region': ['Cusco', 'Lima'], 'monto': [7.0, 15.0]}`.
2. **Theory T3-B `structure.py`** — allowlist includes row region (domain_ok truly True).
3. **I Do sheets / dates / reconcile / validate / idempotent** — A2, merge anchor text, pivot dict, violators, and hash rows all match printed contracts.
4. **We Do T2-A-E3** — write/check both `Lima` (previously wrote one label and checked another → False forever).
5. **We Do T3-A-E2 / T3-B-E2 / T3-B-E3 / T4-B-E2** — instruction, starter, solution, and output share one coherent multiset of regions.
6. **T2-A-E2 PatternFill** — assert RGB ends with `1F4E79` so the starter no longer passes on default fill.
7. **You Do starter rows** — Lima/Cusco; context VP en Lima.

### Structural inventory after fix

- 9 theory blocks (map + 8 subtopics T1–T4 × A/B)  
- 8 I Do demos (one per subtopic)  
- 24 We Do exercises (guided → independent → transfer)  
- 1 You Do portfolio with factory skeleton  
- 8 selfCheck MCQs  
- Resources docs/books/courses cleaned  

---

## 3. Full corrected content location

Single learner-facing authority:

`/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s20-rag.ts`

Representative anchors:

| Area | Anchor |
| --- | --- |
| Meta-scrub | `jobRelevance`, `theory[0]` heading/paragraphs/callout, rubric, resources courses note, selfCheck distractors |
| I/O spine | T2-A `template_copy_save.py`, I Do `demo_template_io.py`, We Do `S20-T2-A-E3`, You Do starter |
| Ops spine | T4-A `batch.py` + I Do/We Do BadZipFile/PermissionError |
| Integrity spine (this pass) | T3-A/T3-B theory codes; I Do 1/4/5/6/8; We Do T2-A-E2/E3, T3-A-E2, T3-B-E2/E3, T4-B-E2 |
| Outcomes honesty + glossary | `learningOutcomes` + map dictionary |

---

## 4. After-Fix Validation Report

### Issue-by-issue confirmation (Explorer registry)

| # | Status | Evidence in source |
| --- | --- | --- |
| 01 | **Resolved** | No RAG map heading/callout; student map is Excel factory only |
| 02 | **Resolved** | `jobRelevance` Excel-ops only; no id freeze language |
| 03 | **Resolved** | `FileSpreadsheet` |
| 04 | **Resolved** | Outcomes match demos (no untaught charts/named ranges/protection claims) |
| 05 | **Resolved** | `load_workbook` / `shutil.copy` / `save` in theory + I Do + We Do + You Do |
| 06 | **Resolved** | Nested indent + exception path; extracted Python snippets compile |
| 07 | **Resolved** | Explorer Diff G table concepts match solutions; data labels consistent |
| 08 | **Resolved** | Grep clean for oráculo / DEFECT: / Fixture harness boilerplate |
| 09 | **Resolved / strengthened** | Factory framing + RGB fill assert + coherent allowlists |
| 10 | **Resolved** | BadZipFile / PermissionError worked examples |
| 11 | **Resolved** | Glossary + narrative + expanded I Do why |
| 12 | **Resolved** | Entrada/Salida canon; Lima/Cusco/Arequipa case flavor |
| 13 | **Resolved** | You Do scaffold + checklist + rubric rewrite |
| 14 | **Resolved** | Embeddings distractor removed |
| 15 | **Resolved** | 8 selfCheck items |
| 16 | **Resolved** | Glosses on first technical English terms |
| 17 | **Resolved** | Pass strings match multi-line outputs |
| 18 | **Resolved** | Resources note without V3 |
| 19 | **Resolved** | Headings/outcomes de-scoped to taught skills |
| 20 | **Accepted residual** | Platform id freeze; prose silent |

### Meta-leak surfaces (Explorer M1–M10)

| Surface | After fix |
| --- | --- |
| M1 jobRelevance | Clean |
| M2 theory map heading | Clean |
| M3 theory map body | Clean |
| M4 callout “Material legado” | Clean → Contrato de la sección |
| M5 We Do harness boilerplate ×24 | Clean |
| M6 DEFECT starters | Clean → Pista |
| M7 rubric gate V3 | Clean |
| M8 Embeddings distractor | Clean |
| M9 resources V3 | Clean |
| M10 MessageSquare icon | Clean → FileSpreadsheet |

**meta_leak_count residual (student-facing):** **0** (id remains in code/URL only).

### Anti-aberration confirmation

- No scripts or loops used to mass-produce paragraphs, exercises, or explanations.  
- No lorem / TODO theater left in learner text.  
- Edits applied as deliberate pedagogical rewrites in `s20-rag.ts` only.  
- Python used only for **output verification** of authored snippets (40/40 match).  
- No bulk-generation artifacts detected.

### Automated smoke checks run

- Grep: clean for oráculo / DEFECT: / Material legado / retematiza / Embeddings / gate V3 / MessageSquare / RAG en producción.  
- Python: 40 unique code/output pairs execute and match expected stdout (`run_ok=40 fail=0`).  
- Syntax: 0 parse failures on extracted solution/demo blocks.  
- Structure: FileSpreadsheet, load_workbook, BadZipFile, Diccionario, 24 We Do, 8 selfCheck.  
- Hash oracle: T4-B-E1 `input_sha1_8` = `651f3b6b` for `b"region,monto\nLima,10\n"`; I Do idempotent `sha1_8` = `3e819052` for Cusco/Lima sorted payload.

### New problems introduced?

None detected. Residual edits only restore truthfulness of demos/exercises and tighten one PatternFill assert.

### Score rationale (9.7)

| Dimension | Judgment |
| --- | --- |
| Meta-leak hygiene | 10 — zero student-facing residue |
| Outcome / demo alignment | 9.7 — taught skills only; I/O spine complete |
| I Do / We Do / You Do GRR | 9.6 — load/save practiced; portfolio assembles factory |
| Theory depth vs S01 gold | 9.5 — glossary + narrative + Peru ops arcs |
| Exercise integrity | 9.8 — concept match + **verified runnable outputs** (prior residual mismatches closed) |
| Residual risk | −0.1 for frozen `#rag` URL (product, not content) |

---

## 5. Residual risks / recommendations for later sections

1. **Issue 20:** URL hash `#rag` confuses share links until product migrates stable ids — out of Fixer scope; keep student prose silent.  
2. **Charts / named ranges / sheet protection:** intentionally de-scoped. If roadmap later requires them, add micro-demos rather than re-inflating outcomes alone.  
3. **Neighbor S21:** expects real xlsx artifacts; keep S20 demos file-I/O honest so S21 packaging stays credible.  
4. **Systemic retheme residue:** Explorer notes the same meta pattern in other frozen-id sections — scrub those in their own Fixer passes only.  
5. **Rename hygiene:** when swapping synthetic labels, always re-run code↔output contracts (this pass’s main residual defect class).  
6. **Optional future polish:** a single graded We Do “mini-capstone” (load→validate→write→reconcile→manifest in one exercise) remains nice-to-have; You Do already provides the full portfolio path.

---

## 6. Updated Graph Memory notes

```yaml
section: 20
id: rag
title: Automatización robusta de Excel
file: src/lib/course/sections/s20-rag.ts
explorer_score: 5.8
fixer_score_estimate: 9.7
status: fixed_validated
explorer_report: course-state/curriculum_hardening/audits/explorer_reports/S20_EXPLORER_REPORT.md
fixer_report: course-state/curriculum_hardening/audits/fixer_reports/S20_FIXER_REPORT.md
themes:
  - excel_factory
  - openpyxl
  - template_copy_save
  - reconcile_fail_closed
  - manifest_idempotency
  - batch_badzipfile_quarantine
  - cp_n2_b_increment
  - synthetic_regions_lima_cusco_arequipa
neighbors:
  upstream: [s17-packaging, s18-data-engineering, s19-databases-orm]
  downstream: [s21-fastapi]
edges_restored:
  - outcomes → demos (load/save, styles, dates/merges, reconcile, batch, manifest)
  - tagline gate → You Do starter (copy master → materialize → reconcile → manifest)
  - We Do labels → solution concepts (Issue 07 table)
  - T4-A theory code → runnable classify/BadZipFile
  - code samples → declared outputs (integrity pass 2026-07-24)
meta_leaks_cleared: true
critical_gaps_closed:
  - load_workbook / wb.save present
  - batch.py IndentationError fixed
  - We Do instruction-solution mismatches fixed
  - harness meta (oráculo/DEFECT/Fixture) removed
  - You Do factory skeleton
  - region-rename output drift fixed
  - PatternFill RGB assert (no free pass)
deferred:
  - platform id #rag migration (product)
anti_aberration_ok: true
quality_vs_gold:
  vs_s01: narrative + glossary competitive; denser ops contracts remain appropriate for Competente
  vs_real_python_openpyxl: file I/O taught; ops/reconcile/manifest framing stronger than tutorial baselines
```

---

## Closing

Section 20 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
