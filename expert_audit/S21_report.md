# Section 21 — Curriculum Auditor Report
**Section:** 21 (1-based course order)
**File:** `src/lib/course/sections/s21-fastapi.ts` (1,677 lines, ~72 KB)
**Live URL:** https://pillb.github.io/pyarcana/#fastapi
**Live H1:** "Documentos, plantillas y reportes trazables"
**Source id:** `"fastapi"` · **shortTitle:** "Reportes trazables"
**Audit agent:** Curriculum Auditor (general-purpose) · S21
**Method:** Stanford STORM + Graph/Loop/Harness Engineering; Fernández-Huerta & INFLESZ readability, LanguageTool `es`, 13-rule pedagogical heuristic suite (see `_GRAMMAR_SUBPLAN.md`).

---

## 1. Section Identification & Scope

| Field | Value |
|-------|-------|
| Position in `COURSE_SECTIONS` | 21 (Phase 1 — Competente) |
| Title | Documentos, plantillas y reportes trazables |
| shortTitle | Reportes trazables |
| Tagline | "Una corrida genera dashboard, DOCX/PDF y workbook con números reconciliados, provenance y revisión visual" |
| estimatedHours | 18 h |
| Capstone gate | CP-N2-B (Reporting Factory) |
| Cross-section spine | S18 (EDA) → S19 (dashboard) → S20 (Excel factory) → **S21 (Reporting Factory)** → S22 (notificaciones/aprobación) |
| Source tabs | Teoría (9 TheoryBlocks, 8 code blocks), I Do (8 demos), We Do (24 exercises), You Do (CP-N2-B capstone), Self-check (7 MCQs), Resources |
| Live hash route | `#fastapi` ← **scope-shift residue** (see Meta-Leak Report) |

**Scope verification on the live site** (agent-browser navigation): The rendered H1 ("Documentos, plantillas y reportes trazables") and tagline match the source byte-for-byte. The URL hash `#fastapi` does NOT match the content; the learner can navigate via the sidebar "Reportes trazables" row but the URL fragment is `#fastapi`. This is the canonical residue pattern already reported for S05 (`id:"oop"` on a Functions section), S08 (`id:"pandas"` on an Ingesta section), S11 (`id:"testing"` on an OOP section), and S12 (`id:"performance"` on an APIs/SQL/Geo section).

**Content scope (verified against the source).** The section teaches a *Reporting Factory* for the CP-N2-B gate: Jinja templates (T1-A), conditional/table rendering with honest missing values (T1-B), python-docx artifact creation/reopening/extraction (T2-A), ReportLab PDF + pypdf text extraction + PyMuPDF PNG rendering + `needs_ocr` abstention (T2-B), executive narrative structure (resumen/método/hallazgos with H→evidencia) (T3-A), figure/table/caption/limit parity (T3-B), Peruvian-Spanish redaction + a11y + `fmt_pen` centralization (T4-A), and provenance + visual checklist + `pending_review` approval queue (T4-B). HTTP APIs are explicitly out of scope ("Las APIs HTTP se tratan más adelante") and the section declares the rescoping openly to the learner in theory[0].paragraphs[0] and paragraphs[3].

---

## 2. Executive Summary of Quality

**Composite score: 7.5 / 10** (would rise to ≈ 8.8/10 after the recommended fixes).

**Verdict.** Section 21 is a high-quality, pedagogically sound Reporting Factory unit with strong I Do / We Do / You Do fidelity, an unusually clean ethical spine (PII never used; honest missing; `needs_ocr` abstention; `pending_review` instead of `approved`), and tight cross-section coupling to S18/S19/S20/S22. The Spanish prose is fluent Peruvian Spanish (mean Fernández-Huerta = 80.5, INFLESZ = 76.3 — "bastante fácil / normal" bands for technical writing; mean WPS = 10.94, well under the 15–32 soft ceiling). The two material weaknesses are (a) a structural meta-leak (the file `s21-fastapi.ts` and `id:"fastapi"` are leftovers from a prior FastAPI syllabus that was rescoped; same pattern as S05/S08/S11/S12), and (b) two real code↔output mismatches in multi-line Jinja templates (theory T1-B `jinja_table.py` and iDo S21-T1-B-DEMO `demo_cond_table.py`) where Jinja2's default whitespace handling produces 4-space-indented second lines and a trailing whitespace-only line, contradicting the clean two-line outputs stated in the source. There are also a handful of orthographic slips (`metricas`/`limites` without tildes in one callout; `descripcion` without tilde in one starter/solution string; `APIs` plural sigla; checklist gender drift `completo` vs `completa`).

**Strengths.**
1. **I Do / We Do / You Do fidelity**: 8 subtopics × (1 I-Do demo + 3 We-Do exercises guided→independent→transfer) = 24 We-Do exercises, all with deliberate DEFECT-pattern starters that train the exact failure mode the theory calls out.
2. **Ethical / production-grade spine**: `pending_review` enforced as the only acceptable closure status; `needs_ocr` abstention instead of invented text; "hallazgo ≠ decisión de negocio" (`decision=None` until human review); no PII ever; SHA-256 vs SHA-1 lab cut honestly explained.
3. **Cross-section connective tissue**: theory[0] anchors the Reporting Factory to S18/S19/S20 inputs and S22 output; every subtopic's "Caso CASO-LIM-021" refers back to the same n=40 Lima median, so the parity contract is concretely visible.
4. **Bilingual term discipline (mostly)**: the section dictionary at theory[0].paragraphs[3] explicitly glosses `context`, `missing ≠ 0`, `PDF digital`, `needs_ocr`, `paridad`, `provenance` — a best practice rare in early sections.
5. **Readability**: mean FH=80.5 sits comfortably in the "bastante fácil" band appropriate for a Competente-phase learner; 0 run-on sentences (>45 words); only 4 long sentences (>32 words) of which only 1 is borderline (44 words).

**Weaknesses.**
1. **Structural meta-leak (HIGH)**: file name `s21-fastapi.ts` and `id:"fastapi"` are scope-shift residue; live URL `#fastapi` mismatches the H1. Same systemic pattern reported in S05/S08/S11/S12.
2. **Code↔output mismatches (HIGH)**: two Jinja template literals render with 4-space indentation drift not reflected in the stated output. A learner who runs the code sees different bytes than the doc claims — directly undermining the section's "el factory no miente" thesis.
3. **Orthographic slips (MEDIUM)**: `metricas, limites` (line 71 callout), `descripcion` (line 1325 starter + line 1333 solution), `APIs` (lines 30, 33), checklist gender inconsistency (`completo` lines 278/280 vs `mínima`/`completa` lines 23/1309/1412/1452).
4. **Anglicism load**: the section explicitly tells the learner (T4-A) to avoid anglicisms, yet uses *starter*, *scaffold*, *context*, *factory*, *render*, *renders*, *outline*, *checksum*, *bundle*, *missing*, *ready*, *claim*, *dashboard*, *dash*, *approval*, *reviewer* as common nouns/verbs in Spanish sentences. Most are domain terms the section glosses once, but several (starter, scaffold, outline, bundle, claim, render as verb) appear unglossed.
5. **Long sentences (LOW)**: 4 sentences exceed 32 words; the worst is the theory[0].paragraphs[0] second sentence (44 words, FH 33.8 — "difícil"). Worth splitting.
6. **Dictionary paragraph is prose, not a list**: theory[0].paragraphs[3] (the section dictionary) is a single semicolon-chained sentence defining 6 terms + a "what is not in scope" clause. A `<dl>` / bullet list would reduce cognitive load.

---

## 3. Detailed Issue Registry

Findings are numbered `S21-Fnn`. Severity: H = blocks learning or contradicts the section's own thesis; M = real defect, fixable in one edit; L = polish.

### S21-F01 — Structural meta-leak: `id:"fastapi"` and file `s21-fastapi.ts` are stale
- **Severity:** H (structural; same systemic pattern as S05/S08/S11/S12).
- **Location:** `s21-fastapi.ts` line 4 (`id: "fastapi"`), line 3 (`export const section21`), `src/lib/course/index.ts` line 23 (`import { section21 } from './sections/s21-fastapi'`).
- **Evidence:** The section teaches Jinja/DOCX/PDF/provenance, not FastAPI. The live URL `https://pillb.github.io/pyarcana/#fastapi` returns a page titled "Documentos, plantillas y reportes trazables". The section itself declares the rescoping openly in theory[0].paragraphs[0] ("Las APIs HTTP se tratan más adelante") and paragraphs[3] ("Qué no es el foco: montar APIs HTTP, autenticación ni despliegue en la nube"). Cross-references from S19 ("reportes (S21)", line 1614), S20 ("paquete de reportes de S21", line 1745), and S22 ("paquete de informe de S21", line 16/32/1672) all treat S21 as the Reporting Factory — so the content rename is complete; only the file name + id are stale.
- **Pedagogical impact:** A learner who bookmarks `#fastapi` and returns expecting FastAPI content is disoriented; a maintainer who greps for `fastapi` to find the "FastAPI section" lands on a Reporting Factory. Reduces trust in the URL scheme.
- **Cross-section signal:** Orchestrator should run `rg 'id:\s*"fastapi"|s21-fastapi'` repo-wide; only one section file is hit (verified). Coordinated rename with the parallel S05/S08/S11/S12 renames is recommended at the end of the campaign.

### S21-F02 — Code↔output mismatch: `jinja_table.py` (theory T1-B) renders with 4-space indent drift
- **Severity:** H (the section's thesis is "el factory no miente"; a learner who runs the code sees different bytes than the doc).
- **Location:** `s21-fastapi.ts` lines 85–98.
- **Evidence (template literal in source):**
  ```ts
  tmpl = Template(
   """{% for r in rows %}- {{ r.region }}: {{ '%.2f'|format(r.median) }} PEN
  {% endfor %}"""
  )
  ```
  Because the closing `{% endfor %}` line carries 4 leading spaces from the source indentation, Jinja2 emits `PEN\n    ` between iterations. Verified by local Jinja2 execution:
  ```
  $ python3 -c "from jinja2 import Template; ..."
  '- Lima: 28.00 PEN\n    - Cusco: 22.50 PEN\n    '
  ```
  Visible output is:
  ```
  - Lima: 28.00 PEN
      - Cusco: 22.50 PEN
      
  ```
  Stated output (line 96–98):
  ```
  - Lima: 28.00 PEN
  - Cusco: 22.50 PEN
  ```
- **Pedagogical impact:** The learner who copies the demo and runs it sees 4-space indented second line and a trailing blank line. They may believe they typed it wrong; or they may think Jinja is buggy. Both undermine the section's "auditable, deterministic factory" promise.
- **Fix options:** (a) Use `Environment(trim_blocks=True, lstrip_blocks=True)`; (b) collapse the template to a single line; (c) update the stated output to match reality. (a) or (b) is preferred.

### S21-F03 — Code↔output mismatch: `demo_cond_table.py` (iDo S21-T1-B-DEMO) same indent drift
- **Severity:** H (same as S21-F02; this is the I-Do demo).
- **Location:** `s21-fastapi.ts` lines 351–364.
- **Evidence:** Template `"{% for r in rows %}{{ r.region }}: {{ r.median if r.median is not none else '—' }}\n    {% endfor %}"` produces, via local execution:
  ```
  Lima: 28.0
      Cusco: —
      
  ```
  Stated output (line 362–364):
  ```
  Lima: 28.0
  Cusco: —
  ```
- **Pedagogical impact:** Same as F02 — first demo the learner sees on T1-B, immediately after the theory block; they will lose confidence in the doc.
- **Fix:** Same as F02.

### S21-F04 — Orthographic: `metricas, limites` without tildes in T1-A callout
- **Severity:** M (real typo; same word "métricas" appears correctly elsewhere in the same callout chain).
- **Location:** `s21-fastapi.ts` line 71, callout content.
- **Evidence:** `"Pasa un context versionado (run_id, metricas, limites) a todas las plantillas del factory..."` — confirmed by LanguageTool DIACRITICS_04 rule. The word "métricas" appears correctly in lines 15, 22, 31, 46, 234, etc. so this is a slip, not a house-style choice.
- **Pedagogical impact:** Visual inconsistency; undermines "redacción en español profesional (es-PE)" claim made in T4-A.

### S21-F05 — Orthographic: `descripcion` without tilde in T4-A-E3 starter and solution
- **Severity:** M (low-frequency but unambiguous).
- **Location:** `s21-fastapi.ts` line 1325 (starter) and line 1333 (solution).
- **Evidence:** Both starter and solution contain `print(a11y_min(True, ["descripcion larga de figura"]))`. Should be `"descripción larga de figura"`. This is a Python string literal but is Spanish text the learner reads and may copy. The same starter/solution mentions a11y (alt text length) so the string is intentional, not boilerplate.
- **Pedagogical impact:** The very exercise teaches alt text quality; the demo string has an orthographic defect that an alt reader (or screen reader pronunciation) would expose.

### S21-F06 — Orthographic: `APIs` plural sigla (×2)
- **Severity:** M (RAE: sigla plurals are not marked with `s`).
- **Location:** `s21-fastapi.ts` line 30 and line 33.
- **Evidence:** `"Las APIs HTTP se tratan más adelante..."` and `"montar APIs HTTP..."`. LanguageTool SIGLAS rule fires. Should be `API`.
- **Pedagogical impact:** Peruvian-Spanish formal register prefers `las API`. Same finding pattern as S11.

### S21-F07 — Concordance drift: `checklist` gender inconsistency (`completo` vs `completa`)
- **Severity:** M (gender drift within one section).
- **Location:** `s21-fastapi.ts` lines 23, 1309, 1412, 1452 (feminine: `mínima` / `completa` / `mínima` / `mínima`) vs lines 278, 280 (masculine: `completo` / `incompleto` / `completo`).
- **Evidence:**
  - Line 23: `"checklist mínima de a11y"` (fem)
  - Line 1309: `"checklist mínima a11y"` (fem)
  - Line 1412: `"checklist completa e incompleta"` (fem)
  - Line 1452: `"checklist a11y mínima"` (fem)
  - Line 278: `"Sin checklist visual completo (dashboard, xlsx, doc)"` (masc)
  - Line 280: `"checklist incompleto → ready False; completo → True"` (masc)
- **Pedagogical impact:** In-house consistency. Peruvian tech Spanish is split on `el/la checklist` but a single section should pick one (feminine is the majority here).

### S21-F08 — Long sentence: theory[0].paragraphs[0] sentence 2 (44 words, FH 33.8)
- **Severity:** M (only borderline run-on; 1 short of the 45-word run-on threshold; but FH = 33.8 is "difícil").
- **Location:** `s21-fastapi.ts` line 30, second sentence.
- **Evidence:** `"En analytics y operaciones en Perú, **cerrar CP-N2-B** no es "exportar bonito": es un **Reporting Factory** que une plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva, paridad numérica con el dashboard (S19) y el Excel (S20), provenance y cola de aprobación humana."` (44 words)
- **Pedagogical impact:** Dense enumeration inside prose; the reader has to hold 6 factory components in working memory before reaching the period. Should be split or converted to a list.

### S21-F09 — Long sentence: youDo.context sentence 1 (38 words, FH 63.9)
- **Severity:** M.
- **Location:** `s21-fastapi.ts` line 1447.
- **Evidence:** `"En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exports sueltos, sino una corrida que una EDA (S18), dashboard (S19) y Excel (S20) en un **factory de reportes trazables**."` (38 words)
- **Pedagogical impact:** Cognitive load at the start of the capstone intro. Splitting at "sino una corrida" would help.

### S21-F10 — Long sentence: iDo.intro sentence 1 (41 words, FH 45.0)
- **Severity:** M.
- **Location:** `s21-fastapi.ts` line 310.
- **Evidence:** `"I Do — observa el Reporting Factory en ocho demos (una por subtema): Jinja con context único → tablas con missing honesto → DOCX real reabierto → PDF digital + PNG → narrativa H→evidencia → paridad dash/xlsx/doc → fmt_pen y a11y mínima → provenance + checklist visual."` (41 words)
- **Pedagogical impact:** The arrow chain is a useful navigational device but the single-sentence form is dense. Could be reformatted as a small ordered list.

### S21-F11 — Long sentence: iDo.intro sentence 4 (33 words) and youDo.context sentence 2 (33 words)
- **Severity:** L (just above 32-word soft ceiling).
- **Locations:** line 310 sentence 4 ("El You Do orquesta build_docx / build_pdf / extract_and_render / manifest en una corrida: no saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2."); line 1447 sentence 2 ("El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo web), captions con Fuente, missing como —, provenance y cola `pending_review`.").
- **Pedagogical impact:** Minor; acceptable for a Competente-phase learner.

### S21-F12 — Section dictionary is a long semicolon-chained paragraph (theory[0].paragraphs[3])
- **Severity:** L (cognitive load).
- **Location:** `s21-fastapi.ts` line 33.
- **Evidence:** 6 definitions and an out-of-scope clause are joined by semicolons into one sentence. Examples: `**context** = dict versionado que alimenta todas las plantillas; **missing ≠ 0** = celda \`—\` cuando no hay dato; ...`
- **Pedagogical impact:** A definition list (`<dl>`) or bullet list would let the learner scan; current form forces linear reading. Pedagogical best practice (cf. *Developing Technical Training* — Clark) favors lateral scanning for reference material.

### S21-F13 — Anglicism load inconsistent with the section's own T4-A advice
- **Severity:** L (style inconsistency).
- **Location:** throughout, but especially lines 30, 31, 32, 78, 188, 278, 310, 538, 1447.
- **Evidence:** T4-A theory paragraph (line 249) says `"Evita anglicismos innecesarios ("outperform", "drive insights"); deja términos técnicos (KPI, SLA, a11y, provenance) donde el gremio los espera, glosándolos la primera vez si el lector no es técnico."` Yet the section uses **unglossed** anglicisms as common nouns: *starter* (line 538), *scaffold* (line 538), *outline* (line 142), *bundle* (line 221), *checksum* (line 219), *claim* (line 444 JSON key, but also "claim con el contraste" prose line 1044), *render* / *renders* as verb (line 309, 312, 537), *dash* / *dashboard* (lines 31, 219, 278, 310...), *approval* / *reviewer* (lines 278, 294), *context* (everywhere; glossed once in the dictionary), *factory* (everywhere; glossed via "Reporting Factory"), *missing* as noun (lines 78, 80, 251; glossed), *ready* (line 278, 1412).
- **Pedagogical impact:** The advice is correct; the section violates it. A learner who internalizes T4-A and then scans T4-A's own section sees the inconsistency. The Fixer should either gloss each anglicism on first use OR soften the T4-A advice to "evita anglicismos que el gremio no reconoce".

### S21-F14 — Self-check Q5 stem is long (32 words) and option D uses anglicism "Convertir el PDF a DOCX sin avisar en el provenance"
- **Severity:** L.
- **Location:** `s21-fastapi.ts` line 1564.
- **Evidence:** Stem: `"El PDF del informe se generó dibujando texto dentro de una imagen; pypdf no extrae capa de texto. ¿Qué debe devolver el contrato de trazabilidad?"` — the stem is fine (32 words). Option D `"Convertir el PDF a DOCX sin avisar en el provenance"` is an obviously wrong distractor but a learner might wonder if it's a real practice. Acceptable.
- **Pedagogical impact:** Negligible.

### S21-F15 — Em-dash `—` used for two distinct purposes (missing-value marker vs. Spanish parenthetical dash)
- **Severity:** L (potential learner confusion).
- **Location:** Throughout. E.g., line 80 `"median is None → \`—\`"` (missing marker); line 30 `"Las APIs HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**."` (no em-dash here); line 78 `"no inventes ceros** que alteren sumas"`; line 1447 `"captions con Fuente, missing como —, provenance y cola \`pending_review\`"` (missing marker); line 111 `""Se veía bien en Word del autor" no es evidencia auditable"` (parenthetical would use em-dash but uses quotes instead).
- **Evidence:** The em-dash `—` is defined as the missing-value symbol in theory[0].paragraphs[3] (`**missing ≠ 0** = celda \`—\``). The same glyph is also used as a Spanish parenthetical dash (e.g., line 310 "I Do — observa el Reporting Factory..."). The latter is a stylistic Spanish em-dash (raya), correctly used, but the dual meaning could be confusing.
- **Pedagogical impact:** Minor; could be avoided by using `--` or `·` for missing values (but that breaks conventions). Document the dual use explicitly in the section dictionary.

### S21-F16 — Resource list duplication: "ReportLab user guide" appears twice with same URL
- **Severity:** L (cleanup).
- **Location:** `s21-fastapi.ts` lines 1604–1607 (`docs`) and lines 1651–1654 (`courses`), both pointing to `https://www.reportlab.com/docs/reportlab-userguide.pdf`. WCAG standards also duplicated (lines 1614–1617 and 1666–1669).
- **Pedagogical impact:** Minor noise; a learner scanning resources sees the same link twice in different sections. Not a defect per se, but a small consistency issue.

### S21-F17 — Starter code in T4-A-E3 has a Python syntax-aware but visually confusing string
- **Severity:** L.
- **Location:** `s21-fastapi.ts` line 1325 (starter) and line 1333 (solution).
- **Evidence:** Both contain `print(a11y_min(True, ["descripcion larga de figura"]))`. The string "descripcion larga de figura" has 26 characters (>10, so passes the `len(a) > 10` check). The example is correct; only the missing tilde is the issue (already captured as F05).
- **Pedagogical impact:** None beyond F05.

### S21-F18 — `sintetico` without tilde in canvas/PIL drawString (intentional but documented narrowly)
- **Severity:** L (accept with note).
- **Location:** `s21-fastapi.ts` lines 164, 928, 1008, 1027 (`c.drawString(..., "Resumen sintetico: n=40")`, `c.drawString(..., "Resumen sintetico n=40")`, `ImageDraw.Draw(image).text(..., "Documento sintetico n=17")`).
- **Evidence:** The T1 callout (line 39) declares: `"En canvas ReportLab con Helvetica por defecto, los demos usan ASCII (\`sintetico\`) a propósito; en DOCX y Markdown del lab escribe **sintético** con tilde."` The justification applies cleanly to ReportLab's Helvetica (no built-in diacritic support). For PIL's default bitmap font (lines 1008/1027), the diacritic story is less crisp — PIL's default font can render `ó`. The justification is borderline for PIL but defensible.
- **Pedagogical impact:** Negligible. The callout's transparency makes this acceptable.

### S21-F19 — `feedback` field for T1-A-E3 says "Cusco n=18 es otra muestra" — the value 18 appears nowhere else
- **Severity:** L (consistency).
- **Location:** `s21-fastapi.ts` line 613, feedback.
- **Evidence:** `"Centraliza el template en la función: cada autor del informe no inventa su propio formato de KPI. n=18 es otra muestra (Cusco), no un desfase del paquete Lima n=40."` — the n=18 for Cusco appears only here and in the E3 instruction (line 605) and solution output (line 633). All other Cusco references in the section use n=? unspecified or match Lima n=40. The value 18 is internally consistent within E3, but the larger CASO-LIM-021 narrative elsewhere treats Cusco as just "the other region" without an n. Minor.
- **Pedagogical impact:** Negligible — the feedback explicitly says it's another context.

### S21-F20 — `ancla Lima del lab` calque from English "anchor"
- **Severity:** L (style).
- **Location:** `s21-fastapi.ts` line 1190 (T3-B-E2 feedback).
- **Evidence:** `"Usa n=40 (ancla Lima del lab), no un n inventado."` "Ancla" as a metaphor for "data anchor" is a calque from English; in Spanish "ancla" is mostly nautical. Could be `"muestra Lima del lab"` or `"n Lima del lab"`.
- **Pedagogical impact:** Negligible.

---

## 4. Meta-Leak Report

| # | Leaked text / artifact | Location | Type | Verdict |
|---|------------------------|----------|------|---------|
| M-1 | `id: "fastapi"` on a section titled "Documentos, plantillas y reportes trazables" | line 4 | Scope-shift residue (FastAPI→Reporting Factory rescoping) | **HIGH**. Live URL `#fastapi` mismatches the H1. Same pattern as S05/S08/S11/S12. |
| M-2 | File name `s21-fastapi.ts` | `src/lib/course/sections/` + import in `index.ts:23` | Scope-shift residue | **HIGH** (paired with M-1). |
| M-3 | `TODO` referenced in weDo intro ("completa el TODO, ejecuta y solo entonces compara") | line 538 (weDo.intro) | NOT a leak — intentional reference to the `# TODO` Python comment marker in starter code | **FALSE POSITIVE**. |
| M-4 | `CASO-LIM-021`/`S21-T1-A`/etc. identifiers | throughout | NOT leaks — declared pedagogical case identifiers | **FALSE POSITIVE**. |
| M-5 | `pending_review`, `approved`, `approval`, `reviewer` as JSON keys | starter/solution code | NOT leaks — domain status strings | **FALSE POSITIVE**. |
| M-6 | `# DEFECT` / `# TODO` Python comments inside starterCode | starterCode blocks (e.g. lines 557, 587, 617, 653, 683, 713, 746, 797, 846, 905, 954, 999, 1056, 1094, 1124, 1156, 1194, 1259, 1289, 1321, 1356, 1394, 1424) | NOT prose leaks — Python comments inside code, excluded per subplan | **FALSE POSITIVE** (excluded by subplan scope). |
| M-7 | `# Lab CASO-LIM-021 — …` Python comments in starter code | starterCode blocks | Same as M-6 | **FALSE POSITIVE**. |

**Net meta-leak verdict:** Exactly one genuine structural meta-leak (M-1+M-2 combined: stale `id`/file name). All other "meta-leak" heuristic hits are either (a) intentional Python-comment TODO markers, (b) declared case/subtopic identifiers, or (c) JSON status strings. No prose-level AI-to-developer notes, no "moved from section X" notes, no design notes. The section's prose is teacher-voiced and clean.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity (PEDAGOGY: 9/10)

The 8×3 We Do grid (8 subtopics × {guided, independent, transfer}) plus 8 I-Do demos (1 per subtopic) is a gold-standard instantiation of the method:

- **I Do**: 8 demos, each mapped 1:1 to a theory subtopic. Each demo is small (5–12 lines), runnable, and ends with a `why` sentence that names the *decision* behind the code (not just the print). E.g., T2-B-DEMO `why: "El contrato conserva PDF, texto extraído y render visual como evidencia separada."` — explicitly maps to the "extract ≠ render ≠ reconcile" triangle taught in theory.
- **We Do**: 24 exercises. Every starter has a deliberate DEFECT pattern: wrong default (`"approved"` → `"pending_review"`), wrong rounding (`round(v, 0)` → `round(v, 1)`), missing key (`pack_report` without `metodo`), wrong comparator (`any()` → `all()`), missing variable in template (`"{{ m }} PEN"` → `"{{ m }} PEN (n={{ n }})"`), missing tilde on missing value (`"0"` → `"—"`), missing Fuente in caption, etc. This is exactly the right pedagogy: the learner confronts the failure mode the theory warned about, then fixes it.
- **You Do**: CP-N2-B capstone. The starter provides 5 NotImplementedError stubs (`build_docx`, `build_pdf`, `extract_and_render`, `manifest`, plus an orchestration block) with explicit acceptance criteria as Python comments. The objectives (5), requirements (7), rubric (6 criteria summing to 100%), and portfolioNote are all aligned and pedagogically sound.

**Minor pedagogy note.** The weDo intro promises "T1 fija context y missing; T2 exige archivos reales reabiertos; T3 estructura narrativa y paridad; T4 cierra con a11y y provenance." This 4-phase summary is excellent navigational scaffolding. The iDo intro uses an arrow chain instead (`Jinja con context único → tablas con missing honesto → … → provenance + checklist visual`) which is also navigational but the two parallel summaries use different visual idioms. Standardizing on one (the arrow chain reads better as a journey) would tighten the connective tissue.

### 5.2 Cognitive load and progressive disclosure (PEDAGOGY: 8/10)

- **Theory order** is sound: T1 (templates) → T2 (artifacts) → T3 (narrative) → T4 (governance). The section's own "Orden pedagógico (no saltes adelante)" callout (line 32) makes the order explicit, which is best practice.
- **CASO-LIM-021 spine** keeps the same n=40 Lima median visible across all 9 theory blocks, all 8 demos, all 24 We-Do exercises, and the capstone. This constant variable is a powerful schema anchor.
- **Dictionary at the top** (line 33) is a best-practice move rare in early sections. The execution is suboptimal (long semicolon-chained paragraph — see F12) but the intent is right.
- **Cognitive overload risk**: theory[0] alone (4 paragraphs, ~270 words, 44-word run-on, 6-term dictionary, rhythm guide, dependency list, "what is not in scope") front-loads a lot. Splitting the dictionary into a list and splitting the 44-word sentence would reduce the load.

### 5.3 Connective tissue (PEDAGOGY: 9/10)

- **Backward references**: S18 (EDA, n=40 Lima/Cusco), S19 (dashboard), S20 (Excel factory) — all three explicitly named and the parity contract is concretely visible ("mismos *n* y métricas clave que el EDA de S18 y el factory de S20").
- **Forward references**: S22 (cola de aprobación / envío de emails) — explicitly named in theory[4].paragraphs[0], T4-B theory, and the capstone context.
- **Lateral references**: S24 (OCR depth) — mentioned as "más adelante" in T2-B theory. Cleanly flagged as out-of-scope.
- **CP-N2-B gate**: named in title, theory[0], theory[4], youDo.title, youDo.context, youDo.requirements, youDo.portfolioNote, selfCheck Q4. Strong spine.

### 5.4 Redaction quality (REDACTION: 7.5/10)

- **Tone**: Professional Peruvian-Spanish (es-PE) committee register — "el comité no firma", "el comité no acepta un Excel 'bonito'", "el VP de operaciones", etc. Consistent voice.
- **Punctuation**: Mostly correct. Spanish curly quotes ("…") used for citations; em-dashes used as Spanish raya for parentheticals; `—` (em dash) also used as missing-value marker (see F15).
- **Tildes**: 1 callout slip (F04: `metricas, limites`), 1 starter/solution slip (F05: `descripcion`).
- **Concordance**: 1 drift (F07: `checklist completo` vs `mínima`).
- **Sentence length**: Mean WPS = 10.94, healthy for Competente-phase technical prose. 4 long sentences (>32 words), 0 run-ons (>45).
- **Readability**: Mean FH = 80.5 (bastante fácil), INFLESZ = 76.3 (normal). For technical curriculum, this is on the easy side — appropriate for a Competente-phase learner; not under-teaching because the conceptual density (CP-N2-B, paridad, provenance, pending_review, needs_ocr, H→evidencia) carries the cognitive weight.

### 5.5 Exercise and exam quality (PEDAGOGY: 8/10)

- All 24 We-Do exercises have `instruction`, `hint`, `hints` (2 levels), `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` (with output). This is the most complete exercise schema in the course.
- **Self-check**: 7 MCQs covering templates/PDF/paridad/cierre/needs_ocr/missing/Heading. Each has an `explanation` of 1–2 sentences. Q5 stem is 32 words but well-structured. All 4 options per question are plausible distractors (no obviously silly options).
- **Capstone rubric**: 6 criteria, weights summing to 100% (25 + 20 + 20 + 15 + 10 + 10). Aligns with the 7 requirements and 5 objectives. Sound.

### 5.6 Consistency with the overall roadmap (CONSISTENCY: 8/10)

- The master roadmap (`el_arte_de_python_roadmap_maestro_52_secciones.md`) originally described Phase 1 Competente as including a FastAPI section (position 21 in some drafts). The current S21 has been rescoped to Reporting Factory for CP-N2-B. The rescoping is declared openly in theory[0].paragraphs[0] and paragraphs[3]. Cross-references from S19, S20, S22 all treat S21 as the Reporting Factory — so the curriculum-wide spine is consistent.
- The rescoping is a Phase-1 curriculum-design decision; it is not the auditor's job to second-guess it. The auditor's job is to flag the stale `id`/file name (F01).

### 5.7 Comparison with best-in-class external materials (COMPARATIVE: 8/10)

- **Real Python — Jinja templating** (linked in resources): S21 covers the same Jinja fundamentals (autoescape, `Template(...).render(**ctx)`, `{% for %}`/`{% if %}`) in a more disciplined, contract-driven way. Real Python is breezier; S21 is more "production-grade".
- **python-docx docs**: S21's "guardar → reabrir → extraer" loop is the canonical pattern; matches the official docs. Adds the OOXML ZIP signature check (`PK` bytes) which is a nice auditing touch not in the official docs.
- **ReportLab + pypdf + PyMuPDF**: The combination is non-trivial; S21's "generate → extract → render → abstain (`needs_ocr`)" pipeline is more rigorous than most tutorials, which usually only cover generation.
- **WCAG**: S21's `a11y_min` (H1 + alt length > 10) is a deliberately minimal checklist; the WCAG reference in resources is appropriate. A more thorough a11y treatment would be out of scope for a Reporting Factory section.
- **Docs for Developers** (Borchert et al.): referenced in books. The section's resumen/método/hallazgos structure echoes the book's advice on technical document architecture.
- **Comparison verdict**: S21 is at or above the quality bar of these external references, with the unique value-add of the paridad/provenance/pending_review contract spine.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewriting

### 6.1 Theory[0].paragraphs[0] (line 30) — opening anecdote + Reporting Factory definition

**Before (current):**
> Imagina la reunión de operaciones en Lima: el Excel de S20 muestra ticket mediano **28.0 PEN (n=40)** y el DOCX del analista dice **30 PEN** "porque redondeó a mano". El comité no firma. En analytics y operaciones en Perú, **cerrar CP-N2-B** no es "exportar bonito": es un **Reporting Factory** que une plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva, paridad numérica con el dashboard (S19) y el Excel (S20), provenance y cola de aprobación humana. Las APIs HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**.

**Issues:** 44-word run-on sentence (FH 33.8) listing 6 factory components in prose; `APIs` sigla plural (×1 here, ×1 in paragraphs[3]).

**After (proposed):**
> Imagina la reunión de operaciones en Lima: el Excel de S20 muestra ticket mediano **28.0 PEN (n=40)** y el DOCX del analista dice **30 PEN** "porque redondeó a mano". El comité no firma. En analytics y operaciones en Perú, **cerrar CP-N2-B** no es "exportar bonito": es un **Reporting Factory** con cinco piezas — plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva y paridad numérica con el dashboard (S19) y el Excel (S20) — más provenance y cola de aprobación humana. Las API HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**.

**Diff rationale:** Split the 6-item enumeration into a 5-piece + 2-overlay structure (em-dash insertion), reducing sentence length from 44 to ~32 words while preserving the same information. `APIs` → `API` per RAE.

### 6.2 Theory[0].paragraphs[3] (line 33) — section dictionary

**Before (current, single long semicolon-chained sentence):**
> **Diccionario de la sección** (consúltalo al dudar): **context** = dict versionado que alimenta todas las plantillas; **missing ≠ 0** = celda `—` cuando no hay dato; **PDF digital** = texto seleccionable (pypdf extrae); **needs_ocr** = extracción vacía sin inventar texto; **paridad** = mismas métricas clave en dashboard, Excel y documento; **provenance** = run_id + huellas + checklist visual antes de `pending_review`. **Qué no es el foco:** montar APIs HTTP, autenticación ni despliegue en la nube — solo el paquete de reportes locales del cierre CP-N2-B.

**Issues:** Prose form for what is structurally a definition list; `APIs` plural.

**After (proposed — convert to a definition list as the renderer allows; if not, keep prose but split into 2 sentences):**
> **Diccionario de la sección** (consúltalo al dudar):
>
> - **context** = dict versionado que alimenta todas las plantillas.
> - **missing ≠ 0** = celda `—` cuando no hay dato.
> - **PDF digital** = texto seleccionable (pypdf extrae).
> - **needs_ocr** = extracción vacía sin inventar texto.
> - **paridad** = mismas métricas clave en dashboard, Excel y documento.
> - **provenance** = run_id + huellas + checklist visual antes de `pending_review`.
>
> **Qué no es el foco:** montar API HTTP, autenticación ni despliegue en la nube — solo el paquete de reportes locales del cierre CP-N2-B.

**Diff rationale:** Definition list (or prose-rewritten with periods instead of semicolons) reduces cognitive load; learner can scan for a term. `APIs` → `API`.

### 6.3 Theory[1].paragraphs[0] (line 46) — Jinja separation

**Before (current):**
> Jinja separa **datos** (dict de contexto en Python) de **presentación** (`{{ var }}`, `{% for %}`). Calcula métricas **antes** del render: la plantilla no es el lugar de joins pesados ni de reglas de negocio opacas. Un solo `context` versionado (run_id, métricas, límites) alimenta DOCX, PDF y, más adelante, el correo de aprobación en S22. Si cada canal inventa su propio formato de KPI, la paridad muere en el primer redondeo.

**Issues:** None — sentence lengths 15/22/18/15, mean FH ≈ 70, healthy. No changes proposed.

### 6.4 Theory[1].callout.content (line 71) — T1-A callout

**Before (current):**
> Pasa un context versionado (run_id, metricas, limites) a todas las plantillas del factory. En HTML, activa autoescape en el Environment: el demo de arriba convierte `<b>28</b>` en entidades (`&lt;b&gt;…`), no en markup. Nunca uses `mark_safe` sobre input de usuario sin sanitizar. En este lab de texto plano (Markdown/DOCX) no hace falta desactivar el escape; cuando empaquetes HTML del dashboard, deja autoescape encendido.

**Issues:** `metricas, limites` without tildes (F04).

**After (proposed):**
> Pasa un context versionado (run_id, **métricas, límites**) a todas las plantillas del factory. En HTML, activa autoescape en el Environment: el demo de arriba convierte `<b>28</b>` en entidades (`&lt;b&gt;…`), no en markup. Nunca uses `mark_safe` sobre input de usuario sin sanitizar. En este lab de texto plano (Markdown/DOCX) no hace falta desactivar el escape; cuando empaquetes HTML del dashboard, deja autoescape encendido.

### 6.5 Theory[2].paragraphs[0] (line 78) — T1-B conditions/tables

**Before (current):**
> `{% if %}` y `{% for %}` construyen tablas y bloques condicionales. Formatea números en Python o con filtros Jinja explícitos (`'%.2f'|format(...)`). Cuando un valor falta, la celda muestra **—** y documenta missing: **no inventes ceros** que alteren sumas, promedios o la paridad con el Excel de S20. En un comité peruano de operaciones, un "0.00" en reclamos se lee como "no hubo reclamos", no como "no medimos reclamos".

**Issues:** Sentence 3 is 27 words (under 32); fine. The paragraph is good. No changes proposed.

### 6.6 Theory[4].paragraphs[0] (line 149) — T2-B PDF digital

**Before (current):**
> Un **PDF digital** tiene texto seleccionable (pypdf extrae); un **PDF escaneado** es imagen y puede requerir OCR con tasa de error. Si la extracción queda vacía, el contrato devuelve `needs_ocr` — **no inventa texto**. El render a PNG (PyMuPDF) prueba legibilidad visual; la extracción prueba la capa digital. Ninguna sustituye la reconciliación tabular.

**Issues:** None. Excellent 4-sentence paragraph; mean WPS ≈ 14; FH ≈ 65. No changes proposed.

### 6.7 Theory[6].paragraphs[0] (line 188) — T3-A narrative

**Before (current):**
> Con T2 ya tienes DOCX/PDF reales; T3 les da **voz ejecutiva** sin contaminar el método con opinión. La narrativa separa **resumen ejecutivo**, **método** y **hallazgos**. Cada hallazgo tiene id (H1…) y mapa a evidencia (Tabla1, Fig.1). No mezcles método con opinión; **hallazgo ≠ decisión** (eco de S18): `decision=None` hasta que un humano decida en la cola de aprobación. El comité debe poder ir de la frase al número en el Excel o dashboard en un clic mental.

**Issues:** Sentence 4 ("No mezcles método con opinión; **hallazgo ≠ decisión** (eco de S18): `decision=None` hasta que un humano decida en la cola de aprobación.") is 26 words but dense — three semicolon-separated clauses with embedded code. Slightly heavy but acceptable for Competente phase.

### 6.8 Theory[8].paragraphs[0] (line 278) — T4-B provenance + gender agreement

**Before (current):**
> T4-A dejó el texto y los decimales consistentes; el cierre del factory es **gobernanza**: ¿quién generó qué, con qué datos, y quién miró el paquete? Registra **provenance**: run_id, huella de datos, hashes de artefactos, checklist visual. Cola de aprobación: borrador → revisión visual → aprobado/rechazado con comentarios. Sin checklist visual completo (dashboard, xlsx, doc), **no hay cierre CP-N2-B**. El paquete en `pending_review` es la entrada limpia al flujo de email/aprobación de S22 — no marques `approved` desde el script del factory.

**Issues:** `completo` should be `completa` for gender agreement with the feminine `checklist` used elsewhere (F07).

**After (proposed):** Replace `Sin checklist visual completo` → `Sin checklist visual completa`. Same for line 280: `checklist incompleto → ready False; completo → True` → `checklist incompleta → ready False; completa → True`.

### 6.9 iDo.intro (line 310) — 8-demo arrow chain

**Before (current):**
> I Do — observa el Reporting Factory en ocho demos (una por subtema): Jinja con context único → tablas con missing honesto → DOCX real reabierto → PDF digital + PNG → narrativa H→evidencia → paridad dash/xlsx/doc → fmt_pen y a11y mínima → provenance + checklist visual. No copies a ciegas: nota qué se calcula, qué se persiste a disco y qué se deja en pending_review. En We Do practicarás cada pieza; en You Do las unes en una sola corrida CP-N2-B.

**Issues:** Sentence 1 is 41 words (F10). The arrow chain is dense.

**After (proposed — keep arrows but split):**
> I Do — observa el Reporting Factory en ocho demos (una por subtema): Jinja con context único → tablas con missing honesto → DOCX real reabierto → PDF digital + PNG → narrativa H→evidencia → paridad dash/xlsx/doc → fmt_pen y a11y mínima → provenance + checklist visual. No copies a ciegas: nota qué se calcula, qué se persiste a disco y qué se deja en `pending_review`. En We Do practicarás cada pieza; en You Do las unes en una sola corrida CP-N2-B.

(Splitting the arrow chain into a bulleted list would change the visual rhythm; for now, the 41-word sentence is kept but the period after "checklist visual" already breaks it. The first sentence is 41 words because of the arrows; without them, the prose-equivalent would be ~28 words. Acceptable as-is, but splitting after "→ PDF digital + PNG" would help.)

### 6.10 weDo.intro (line 538) — 4-phase summary

**Before (current):**
> We Do — practica el mini-factory en piezas (T1→T4). Cada starter es un scaffold incompleto o incorrecto a propósito: completa el TODO, ejecuta y solo entonces compara con la solución. T1 fija context y missing; T2 exige archivos reales reabiertos; T3 estructura narrativa y paridad; T4 cierra con a11y y provenance. El You Do orquesta build_docx / build_pdf / extract_and_render / manifest en una corrida: no saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2.

**Issues:** Sentence 4 ("El You Do orquesta build_docx / build_pdf / extract_and_render / manifest en una corrida: no saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2.") is 33 words (F11). Anglicisms *starter*, *scaffold* (F13).

**After (proposed):**
> We Do — practica el mini-factory en piezas (T1→T4). Cada **starter** (código de partida) es un **scaffold** (andamiaje) incompleto o incorrecto a propósito: completa el `TODO`, ejecuta y solo entonces compara con la solución. T1 fija context y missing; T2 exige archivos reales reabiertos; T3 estructura narrativa y paridad; T4 cierra con a11y y provenance. El You Do orquesta `build_docx` / `build_pdf` / `extract_and_render` / `manifest` en una corrida. No saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2.

**Diff rationale:** Gloss *starter* and *scaffold* on first use (the T4-A advice); split the 33-word sentence into two (the colon→period split).

### 6.11 youDo.context (line 1447) — capstone context

**Before (current):**
> En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exports sueltos, sino una corrida que una EDA (S18), dashboard (S19) y Excel (S20) en un **factory de reportes trazables**. El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo web), captions con Fuente, missing como —, provenance y cola `pending_review`. Datos sintéticos únicamente; sin PII. El siguiente paso del currículum (S22) envía/aprueba — aquí dejas el paquete listo para revisión humana.

**Issues:** Sentence 1 is 38 words (F09). Sentence 2 is 33 words (F11). `exports sueltos` anglicism.

**After (proposed):**
> En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exportaciones sueltas, sino una corrida que una EDA (S18), dashboard (S19) y Excel (S20) en un **factory de reportes trazables**. El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo web), captions con Fuente, missing como `—`, provenance y cola `pending_review`. Datos sintéticos únicamente; sin PII. El siguiente paso del currículum (S22) envía y aprueba; aquí dejas el paquete listo para revisión humana.

**Diff rationale:** `exports sueltos` → `exportaciones sueltas`; `missing como —` → `missing como \`—\`` (the em-dash here is the missing-value marker, not a Spanish parenthetical, so backticking it as a literal symbol disambiguates F15); `envía/aprueba —` is an em-dash used as a Spanish parenthetical but the slash makes the phrase awkward — replaced with `envía y aprueba;`.

### 6.12 youDo.portfolioNote (line 1523) — final note

**Before (current):**
> Paquete final CP-N2-B: dashboard + xlsx + informe (DOCX/PDF/PNG) con provenance y checklist visual; listo para revisión humana antes del flujo de email/aprobación en S22. No marques el paquete como aprobado desde el código del factory.

**Issues:** None — concise, accurate. No changes proposed.

### 6.13 selfCheck.explanation for Q1 (line 1540) — explanation quality

**Before (current):**
> La lógica y métricas viven en Python; la plantilla presenta. Así auditas números una sola vez y reutilizas el mismo context en DOCX, PDF y otros canales.

**Issues:** None — concise. No changes proposed.

### 6.14 selfCheck.explanation for Q4 (line 1561) — concise

**Before (current):**
> El factory cierra con artefactos verificables: provenance, revisión visual y hallazgos con evidencia. Un print no sustituye el paquete.

**Issues:** None — excellent 2-sentence explanation. No changes proposed.

### 6.15 Worst 5 sentences by length (re-write summary)

| Rank | Words | FH | Source | Sentence (first 120 chars) | Fix |
|------|-------|-----|--------|---------------------------|-----|
| 1 | 44 | 33.8 | theory[0].p[0] s2 | `En analytics y operaciones en Perú, **cerrar CP-N2-B** no es "exportar bonito": es un **Reporting Factory** que u…` | §6.1 — split with em-dash + 5-piece + 2-overlay |
| 2 | 41 | 45.0 | iDo.intro s1 | `I Do — observa el Reporting Factory en ocho demos (una por subtema): Jinja con context único → tablas con missin…` | §6.9 — keep arrows (navigational); acceptable |
| 3 | 38 | 63.9 | youDo.context s1 | `En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exports sueltos, sino u…` | §6.11 — `exports`→`exportaciones` |
| 4 | 33 | 78.6 | weDo.intro s4 | `El You Do orquesta build_docx / build_pdf / extract_and_render / manifest en una corrida: no saltes a portfolio…` | §6.10 — split at colon |
| 5 | 33 | 78.4 | youDo.context s2 | `El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo …` | §6.11 — minor; acceptable |

---

## 7. Proposed GitHub-Style Diffs

> All diffs are proposals; do NOT apply in this audit pass. Line numbers reference the current `s21-fastapi.ts`.

### D-01 — Fix `id` and file name (F01 / M-1+M-2)

**Coordinate with orchestrator** — same pattern as S05/S08/S11/S12. A rename to `id: "reporting-factory"` changes the live URL hash `#fastapi` → `#reporting-factory` (any external bookmarks break).

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-reporting-factory.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section21: CourseSection = {
- id: "fastapi",
+ id: "reporting-factory",
  index: 21,
  title: "Documentos, plantillas y reportes trazables",
  shortTitle: "Reportes trazables",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -20,7 +20,7 @@ import { section20 } from './sections/s20-rag'
-import { section21 } from './sections/s21-fastapi'
+import { section21 } from './sections/s21-reporting-factory'
 import { section22 } from './sections/s22-rapidfuzz-entity'
```

### D-02 — Fix `jinja_table.py` code↔output mismatch (F02)

Use `Environment(trim_blocks=True, lstrip_blocks=True)` so the multi-line template renders without 4-space indent drift.

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -83,11 +83,13 @@ callout: {
  code: {
  language: 'python',
  title: "jinja_table.py",
- code: `def s21_th_2():
-    from jinja2 import Template
+ code: `def s21_th_2():
+    from jinja2 import Environment, select_autoescape
+
+    env = Environment(trim_blocks=True, lstrip_blocks=True)
-    tmpl = Template(
+    tmpl = env.from_string(
      """{% for r in rows %}- {{ r.region }}: {{ '%.2f'|format(r.median) }} PEN
      {% endfor %}"""
     )
```

(Or alternatively, collapse the template to a single line: `Template("- {% for r in rows %}{{ r.region }}: {{ '%.2f'|format(r.median) }} PEN\\n{% endfor %}")`.)

### D-03 — Fix `demo_cond_table.py` code↔output mismatch (F03)

Same fix as D-02 but for the iDo demo.

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -348,12 +348,14 @@ code: {
  language: 'python',
  title: "demo_cond_table.py",
- code: `def s21_ido_2():
-    from jinja2 import Template
+ code: `def s21_ido_2():
+    from jinja2 import Environment
+
+    env = Environment(trim_blocks=True, lstrip_blocks=True)
-    tmpl = Template(
+    tmpl = env.from_string(
      """{% for r in rows %}{{ r.region }}: {{ r.median if r.median is not none else '—' }}
      {% endfor %}"""
     )
```

### D-04 — Fix `metricas, limites` tildes in T1-A callout (F04)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -68,7 +68,7 @@ callout: {
  type: "tip",
  title: "Context dict único y autoescape",
  content:
- "Pasa un context versionado (run_id, metricas, limites) a todas las plantillas del factory. En HTML, activa autoescape en el Environment: el demo de arriba convierte `<b>28</b>` en entidades (`&lt;b&gt;…`), no en markup. Nunca uses `mark_safe` sobre input de usuario sin sanitizar. En este lab de texto plano (Markdown/DOCX) no hace falta desactivar el escape; cuando empaquetes HTML del dashboard, deja autoescape encendido.",
+ "Pasa un context versionado (run_id, métricas, límites) a todas las plantillas del factory. En HTML, activa autoescape en el Environment: el demo de arriba convierte `<b>28</b>` en entidades (`&lt;b&gt;…`), no en markup. Nunca uses `mark_safe` sobre input de usuario sin sanitizar. En este lab de texto plano (Markdown/DOCX) no hace falta desactivar el escape; cuando empaquetes HTML del dashboard, deja autoescape encendido.",
 },
```

### D-05 — Fix `descripcion` tilde in T4-A-E3 starter and solution (F05)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -1322,7 +1322,7 @@ starterCode: {
- print(a11y_min(True, ["descripcion larga de figura"]))
+ print(a11y_min(True, ["descripción larga de figura"]))
 print(a11y_min(True, ["corto"]))`,
 },
@@ -1330,7 +1330,7 @@ solutionCode: {
- print(a11y_min(True, ["descripcion larga de figura"]))
+ print(a11y_min(True, ["descripción larga de figura"]))
 print(a11y_min(True, ["corto"]))`,
```

### D-06 — Fix `APIs` → `API` (F06, ×2)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -30,7 +30,7 @@ paragraphs: [
-... Las APIs HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**.",
+... Las API HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**.",
@@ -33,7 +33,7 @@ paragraphs: [
-... **Qué no es el foco:** montar APIs HTTP, autenticación ni despliegue en la nube — solo el paquete de reportes locales del cierre CP-N2-B.",
+... **Qué no es el foco:** montar API HTTP, autenticación ni despliegue en la nube — solo el paquete de reportes locales del cierre CP-N2-B.",
```

### D-07 — Fix `checklist` gender agreement (F07)

Standardize on feminine (the majority usage) by editing 2 lines.

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -278,7 +278,7 @@ paragraphs: [
-... Sin checklist visual completo (dashboard, xlsx, doc), **no hay cierre CP-N2-B**. ...
+... Sin checklist visual completa (dashboard, xlsx, doc), **no hay cierre CP-N2-B**. ...
@@ -280,7 +280,7 @@ paragraphs: [
-"Caso CASO-LIM-021: checklist incompleto → `ready` False; completo → True. ...
+"Caso CASO-LIM-021: checklist incompleta → `ready` False; completa → True. ...
```

### D-08 — Split the 44-word run-on in theory[0].paragraphs[0] (F08)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -30,7 +30,7 @@ paragraphs: [
-"Imagina la reunión de operaciones en Lima: el Excel de S20 muestra ticket mediano **28.0 PEN (n=40)** y el DOCX del analista dice **30 PEN** "porque redondeó a mano". El comité no firma. En analytics y operaciones en Perú, **cerrar CP-N2-B** no es "exportar bonito": es un **Reporting Factory** que une plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva, paridad numérica con el dashboard (S19) y el Excel (S20), provenance y cola de aprobación humana. Las APIs HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**.",
+"Imagina la reunión de operaciones en Lima: el Excel de S20 muestra ticket mediano **28.0 PEN (n=40)** y el DOCX del analista dice **30 PEN** "porque redondeó a mano". El comité no firma. En analytics y operaciones en Perú, **cerrar CP-N2-B** no es "exportar bonito": es un **Reporting Factory** con cinco piezas — plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva y paridad numérica con el dashboard (S19) y el Excel (S20) — más provenance y cola de aprobación humana. Las API HTTP se tratan más adelante; aquí el entregable son **archivos locales verificables**.",
```

### D-09 — Convert section dictionary to a definition list (F12)

> The renderer may or may not support `paragraphs` arrays as bullet lists; if not, the Fixer should split the long sentence with periods instead of semicolons. Proposed here as the prose-with-periods form.

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -33,7 +33,7 @@ paragraphs: [
-"**Diccionario de la sección** (consúltalo al dudar): **context** = dict versionado que alimenta todas las plantillas; **missing ≠ 0** = celda `—` cuando no hay dato; **PDF digital** = texto seleccionable (pypdf extrae); **needs_ocr** = extracción vacía sin inventar texto; **paridad** = mismas métricas clave en dashboard, Excel y documento; **provenance** = run_id + huellas + checklist visual antes de `pending_review`. **Qué no es el foco:** montar APIs HTTP, autenticación ni despliegue en la nube — solo el paquete de reportes locales del cierre CP-N2-B.",
+"**Diccionario de la sección** (consúltalo al dudar): **context** = dict versionado que alimenta todas las plantillas. **missing ≠ 0** = celda `—` cuando no hay dato. **PDF digital** = texto seleccionable (pypdf extrae). **needs_ocr** = extracción vacía sin inventar texto. **paridad** = mismas métricas clave en dashboard, Excel y documento. **provenance** = run_id + huellas + checklist visual antes de `pending_review`. **Qué no es el foco:** montar API HTTP, autenticación ni despliegue en la nube — solo el paquete de reportes locales del cierre CP-N2-B.",
```

### D-10 — Gloss `starter` and `scaffold` on first use in weDo.intro (F13)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -538,7 +538,7 @@ intro: "We Do — practica el mini-factory en piezas (T1→T4). Cada starter es un
-intro: "We Do — practica el mini-factory en piezas (T1→T4). Cada starter es un scaffold incompleto o incorrecto a propósito: completa el TODO, ejecuta y solo entonces compara con la solución. T1 fija context y missing; T2 exige archivos reales reabiertos; T3 estructura narrativa y paridad; T4 cierra con a11y y provenance. El You Do orquesta build_docx / build_pdf / extract_and_render / manifest en una corrida: no saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2.",
+intro: "We Do — practica el mini-factory en piezas (T1→T4). Cada starter (código de partida) es un scaffold (andamiaje) incompleto o incorrecto a propósito: completa el `TODO`, ejecuta y solo entonces compara con la solución. T1 fija context y missing; T2 exige archivos reales reabiertos; T3 estructura narrativa y paridad; T4 cierra con a11y y provenance. El You Do orquesta `build_docx` / `build_pdf` / `extract_and_render` / `manifest` en una corrida. No saltes a portfolio sin haber fallado y corregido al menos un DOCX y un PDF en T2.",
```

### D-11 — Replace `exports sueltos` and backtick the missing-value `—` in youDo.context (F11/F13/F15)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -1447,7 +1447,7 @@ context:
-"En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exports sueltos, sino una corrida que una EDA (S18), dashboard (S19) y Excel (S20) en un **factory de reportes trazables**. El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo web), captions con Fuente, missing como —, provenance y cola `pending_review`. Datos sintéticos únicamente; sin PII. El siguiente paso del currículum (S22) envía/aprueba — aquí dejas el paquete listo para revisión humana.",
+"En un comité de analytics en Lima te piden el **paquete único** de CASO-LIM-021: no tres exportaciones sueltas, sino una corrida que una EDA (S18), dashboard (S19) y Excel (S20) en un **factory de reportes trazables**. El entregable cierra **CP-N2-B**: DOCX y PDF con los mismos números (mediana Lima 28.0 PEN, n=40, cobertura solo web), captions con Fuente, missing como `—`, provenance y cola `pending_review`. Datos sintéticos únicamente; sin PII. El siguiente paso del currículum (S22) envía y aprueba; aquí dejas el paquete listo para revisión humana.",
```

### D-12 — De-duplicate resources (ReportLab + WCAG) (F16)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -1651,10 +1651,6 @@ courses: [
- {
- label: "ReportLab user guide (PDF)",
- url: "https://www.reportlab.com/docs/reportlab-userguide.pdf",
- note: "canvas y PDF digital programático",
- },
- {
- label: "WCAG overview (W3C)",
- url: "https://www.w3.org/WAI/standards-guidelines/wcag/",
- note: "criterios de accesibilidad para informes",
- },
```

(Remove the two duplicates in `courses`; keep the originals in `docs`.)

### D-13 — Replace `ancla` calque (F20)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ -1190,7 +1190,7 @@ feedback:
-feedback: "Un pie sin «Fuente» impide reconciliar la figura con el dataset del factory. Usa n=40 (ancla Lima del lab), no un n inventado.",
+feedback: "Un pie sin «Fuente» impide reconciliar la figura con el dataset del factory. Usa n=40 (muestra Lima del lab), no un n inventado.",
```

---

## 8. Recommended Priority Order for Fixing

| Pri | Issue | Severity | Effort | Notes |
|-----|-------|----------|--------|-------|
| P0 | F02 — `jinja_table.py` code↔output mismatch | H | 5 min | Use `Environment(trim_blocks=True, lstrip_blocks=True)` (D-02). |
| P0 | F03 — `demo_cond_table.py` code↔output mismatch | H | 5 min | Same fix as D-02 (D-03). |
| P1 | F04 — `metricas, limites` tildes | M | 1 min | One-line edit (D-04). |
| P1 | F05 — `descripcion` tilde | M | 1 min | Two-line edit (D-05). |
| P1 | F06 — `APIs` → `API` | M | 1 min | Two-line edit (D-06). |
| P1 | F07 — `checklist` gender agreement | M | 1 min | Two-line edit (D-07). |
| P2 | F01 — `id:"fastapi"` and file rename | H (structural) | 10 min | Coordinate with orchestrator + parallel S05/S08/S11/S12 renames (D-01). Changes live URL hash. |
| P2 | F08 — Split 44-word run-on in theory[0].paragraphs[0] | M | 2 min | D-08. |
| P2 | F12 — Convert section dictionary to definition list (or split with periods) | L | 5 min | D-09. Renderer-dependent. |
| P3 | F10 — Split iDo.intro 41-word arrow chain | L | 3 min | Optional; arrow chain is navigational. |
| P3 | F11 — Split 33-word weDo.intro sentence 4 + youDo.context sentence 2 | L | 3 min | D-10 + D-11. |
| P3 | F13 — Gloss starter/scaffold/outline/bundle/checksum on first use | L | 10 min | D-10 (partial); scan for other instances. |
| P3 | F15 — Backtick `—` as missing-value marker to disambiguate from Spanish parenthetical | L | 5 min | D-11 (partial for youDo.context). |
| P4 | F16 — De-duplicate ReportLab + WCAG resources | L | 2 min | D-12. |
| P4 | F20 — Replace `ancla` calque | L | 1 min | D-13. |
| Accept | F18 — `sintetico` ASCII in canvas/PIL | L | — | Already documented in T1 callout; intentional. |
| Accept | F14, F17, F19 | L | — | No action needed. |

**Estimated total Fixer time:** ≈ 50–60 minutes for the P0–P3 fixes; +10 min for P4. Coordinated rename (P2/F01) adds a 5-min orchestrator step.

---

## 9. Graph Memory Update Notes (for shared context files)

The following signals should be propagated to the orchestrator and to sibling section auditors:

1. **Systemic meta-leak pattern (5th instance).** Section 21 (`s21-fastapi.ts`, `id:"fastapi"`) is the **5th confirmed instance** of the file-name + section-id scope-shift residue pattern (after S05 `oop`→functions, S08 `pandas`→ingesta, S11 `testing`→oop, S12 `performance`→apis). Recommend a single coordinated rename pass at the end of the campaign: `rg 'id:\s*"(oop|pandas|testing|performance|fastapi)"' src/lib/course/sections/` and update both the source `id` field and the file name + import in `index.ts`. Each rename changes the live URL hash, so document the URL migration in `DEPLOY.md` or `README.md`.

2. **Code↔output mismatch pattern (Jinja whitespace).** Two multi-line Jinja template literals in S21 (theory T1-B `jinja_table.py` and iDo S21-T1-B-DEMO `demo_cond_table.py`) render with 4-space indent drift not reflected in the stated output. Root cause: Python source-code indentation leaks into the Jinja template body when `{% endfor %}` is on its own indented line. Fix: `Environment(trim_blocks=True, lstrip_blocks=True)` or single-line templates. **Recommend a repo-wide grep** for multi-line Jinja template literals (`re.search(r'"""\s*\{% (for|if)', src)`) in all 52 sections; this is likely a systemic defect class.

3. **CASO-LIM-021 spine is consistent.** The CASO-LIM-021 case (n=40 Lima median 28.0 PEN, web-only) is consistently threaded through S18 → S19 → S20 → S21 → S22. No drift detected in the cross-section narrative values (unlike the S04 region-name drift reported by the S04 auditor).

4. **`APIs` plural sigla — systemic.** S21 has 2 instances (`Las APIs HTTP`, `montar APIs HTTP`). S11 also had `APIs`. Recommend a repo-wide grep: `rg '\bAPIs\b' src/lib/course/sections/` and replace with `API` per RAE guidance. **Confirmed instances so far:** S11, S21.

5. **Checklist gender drift.** S21 uses both `checklist mínimo/completo` (masculine) and `checklist mínima/completa` (feminine). The majority is feminine. Recommend a repo-wide house-style decision: `la checklist` (feminine, matches Peruvian tech-Spanish majority) or `el checklist` (masculine, RAE-tolerated). Apply consistently across all 52 sections.

6. **Anglicism load.** S21 uses *starter*, *scaffold*, *context*, *factory*, *render*, *renders*, *outline*, *checksum*, *bundle*, *missing*, *ready*, *claim*, *dashboard*, *dash*, *approval*, *reviewer* as common nouns/verbs in Spanish sentences. The section's own T4-A advice says to avoid anglicisms; this is internally inconsistent. **Cross-section question for the orchestrator:** is the curriculum's house style "gloss each anglicism on first use" (current S21 dictionary attempts this for `context`/`missing`/`provenance` but not for `starter`/`scaffold`/`outline`/`bundle`/`checksum`)? If yes, the Fixer should add glosses; if no, the T4-A advice should be softened.

7. **`es-PE` notation.** S21 uses `es-PE` (hyphen) consistently in 3 places (lines 249, 1460, 1530). Other sections (per worklog) use `es_PE` (underscore) in some places. Recommend a repo-wide standardization on `es-PE` (BCP-47 canonical form).

8. **Readability metrics.** S21 mean FH = 80.5, INFLESZ = 76.3 — sits in the "bastante fácil / normal" band, appropriate for Competente-phase. Compare to S04 (lower, more dense), S07 (FH ≈ 70.6), S11 (FH ≈ 71.5), S12 (FH ≈ 67). S21 is on the easier end of the Phase-1 sections; this is appropriate because the conceptual density (CP-N2-B, paridad, provenance, pending_review, needs_ocr, H→evidencia) carries the cognitive weight, so prose-level complexity is correctly kept low.

9. **Helper artifacts for the orchestrator.**
   - Grammar extraction script: `/home/z/my-project/audits/_s21_extract.py`
   - Per-record metrics JSON: `/home/z/my-project/audits/_s21_metrics.json`
   - Prose dump: `/home/z/my-project/audits/_s21_prose.txt`
   - LanguageTool raw response: `/home/z/my-project/audits/_s21_lt.json`
   - LT input chunk: `/home/z/my-project/audits/_s21_lt_input.txt`

---

## 10. Method Note (Grammar Subplan Compliance)

Per the `_GRAMMAR_SUBPLAN.md` research summary, the following methods were applied:

- **Fernández-Huerta (1959)** readability: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Computed per sentence and per paragraph (mean). S21 mean = 80.5 ("bastante fácil").
- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`. S21 mean = 76.3 ("normal").
- **Words-per-sentence (WPS)**: S21 mean = 10.94 (well under the 15–32 soft ceiling for technical Spanish). 4 sentences > 32 words, 0 > 45.
- **Syllables-per-word (SPW)**: Spanish vowel-group heuristic with hiato/diptongo handling. S21 mean = 1.92.
- **13-rule pedagogical heuristic suite** (run-on, missing terminal, missing ¿/¡, unbalanced delimiters, repeated words, DET–NOUN concordance, English-dominant prose, meta-leak signals, gerund pile-up, comma density, paragraph-is-one-sentence, anaphoric monotony, space-before-punct). Implementation: `/home/z/my-project/audits/_s21_extract.py`.
- **LanguageTool public API** (`language=es`): 1 chunk of 16,293 chars submitted; 275 raw matches, 29 non-spelling after filtering `MORFOLOGIK_RULE_ES` false positives on Python identifiers/tech nouns. Of the 29, 2 genuine findings (DIACRITICS_04 on `metricas, limites`; SIGLAS on `APIs`); 27 are false positives caused by code identifiers (`doc`, `n`, `Template`, `Lima n=40`, `approval.status=`, `cpn2b-01`) being parsed as Spanish words.

**False-positive classes documented (per subplan validation requirement):**
- `doc` (5×): PUNTO_EN_ABREVIATURAS fires because LT treats `doc` as an abbreviation of "doctor" or "documento"; in S21 it's a key name in `dash/xlsx/doc` and `dashboard, xlsx, doc` enumerations. False positive.
- `n` (3×): SINGLE_CHARACTER fires because standalone `n` is unusual; in S21 it's the variable name for sample size. False positive.
- `Template` (3×): WRONG_IMPERATIVE fires because LT parses `Template` as the Spanish verb "template" (voseo imperative of "templar"). In S21 it's the Jinja2 class name. False positive.
- `Lima n=40` (3×): ES_SPLIT_WORDS fires because LT suggests "Liman" (merging Lima + n). In S21 `Lima` is the city and `n` is a variable. False positive.
- `Sin id de evidencia` (2×): PREP_VERB fires because LT parses `id` as the verb "idir" (not a real Spanish verb). In S21 `id` is the JSON key. False positive.

---

## Final Statement

This is the complete Explorer report for Section 21. Ready for the Fixer prompt.
