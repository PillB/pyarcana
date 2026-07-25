# S21 Explorer Report — Documentos, plantillas y reportes trazables

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass · Graph Engineering · Loop Engineering · Harness Engineering  
**Focus:** Section 21 only (`fastapi` → Reporting Factory / CP-N2-B)  
**Sources:** Live site curriculum card + full source `src/lib/course/sections/s21-fastapi.ts`  
**Date of analysis:** 2026-07-24  
**Do not apply fixes in this run** — diffs are proposals only.

---

## 1. Section Identification & Scope

| Field | Value |
| --- | --- |
| Index | 21 |
| Platform id (hash) | `fastapi` |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s21-fastapi.ts` |
| Live URL | https://pillb.github.io/pyarcana/#fastapi |
| Title | Documentos, plantillas y reportes trazables |
| shortTitle (UI card) | Reportes trazables |
| Tagline | Accessible Insights Dashboard & Reporting Factory genera dashboard, DOCX/PDF y workbook desde una corrida, con números reconciliados y revisión visual |
| Level / phase | Competente · phase 1 |
| estimatedHours | 18 |
| Capstone thread | Cierre **CP-N2-B** (Reporting Factory) bridging S18 EDA → S19 dashboard → S20 Excel → S21 docs → S22 email/approval |
| Structural inventory | 1 map theory block + 8 subtopics (T1-A/B … T4-A/B); 8 I Do demos; 24 We Do exercises (E1/E2/E3 × 8); 1 You Do portfolio; 5 selfCheck items; resources (docs/books/courses) |
| Live-site note | SPA does not SSR section body; curriculum grid correctly shows “Reportes trazables”. Real FastAPI content lives in **S41** (“APIs FastAPI”). |

**In-scope analysis dimensions (all covered):** meta-leak · redaction (es-PE) · connective tissue · I/We/You Do · cognitive load · exercises/exam · roadmap consistency · external comparison · other domain issues.

**Out of scope:** applying fixes; auditing other sections except for comparative reference.

---

## 2. Executive Summary of Quality

### Score: **6.0 / 10**

### Verdict
S21 has a **sound professional spine** for a Reporting Factory at Competente level: Jinja separation of data/presentation, DOCX with real styles + reopen, PDF digital vs image/`needs_ocr`, executive narrative with H→evidence, numeric parity across dashboard/Excel/DOCX, a11y/decimal consistency, and provenance + visual checklist before approval. That domain message is largely correct and well ordered (T1→T4 progressive disclosure).

Quality is held back by **user-facing process meta-text** (V3 relocation, lane/ledger, oráculo/DEFECT, gate V3), **legacy FastAPI identity debt** (`id: "fastapi"`, `icon: "Server"`, filename `s21-fastapi.ts`), **telegraphic theory** vs gold early sections, **We Do spoiling** (instructions paste the solution), **concept↔exercise misalignment** (especially T3-B and T4-A), and **several Pass-string mismatches**. Relative to S02 “gold” narrative density, S21 reads like a compressed contract sheet with micro-drills, not an 18h taught section.

**Key strengths**
- Correct closure story for CP-N2-B: one run → aligned artifacts + visual review.
- High-value domain rules: missing ≠ 0; PDF digital ≠ scan; hallazgo ≠ decisión; parity gate.
- Artifact-first demos (save/reopen DOCX; PDF extract + PNG render).
- Resources cover Jinja2, python-docx, ReportLab, pypdf, WCAG, hashlib/json.

**Key risks for learners**
- Opening paragraph talks about *not* being FastAPI and keeping id `fastapi` — confuses before teaching.
- Exercises often give full solution in the instruction; starters expose `# DEFECT` and `# solutionCode`.
- Several concept labels do not match the code skill practiced.
- Self-check and rubric leak internal “lane/ledger/V3” process language.

---

## 3. Detailed Issue Registry

Severity: **P0** blocker / learner-facing confusion · **P1** high pedagogy or correctness · **P2** medium quality · **P3** polish.

| # | Sev | Dimension | Location | Evidence (quote / pointer) | Pedagogical impact |
| --- | --- | --- | --- | --- | --- |
| I-01 | P0 | Meta-leak | theory[0] map | «En V3, **S21 no es el path FastAPI de APIs HTTP** (reubicado). El id `fastapi` se conserva…» | Student-facing rewrite history; breaks trust and first-minute motivation. |
| I-02 | P0 | Identity / roadmap | metadata `id`, `icon`, filename | `id: "fastapi"`, `icon: "Server"`, file `s21-fastapi.ts` while title is Reporting Factory; S41 is real FastAPI | Hash URL `#fastapi` and Server icon contradict “Reportes trazables”; cognitive conflict with curriculum card. |
| I-03 | P0 | Meta-leak | We Do × 24 instructions | «Fixture `S21-…` / … Completa el TODO del starter sin borrar el **oráculo**; … Pass (salida exacta del solution)» | Internal harness language; spoils solutions; dilutes authentic task framing. |
| I-04 | P0 | Meta-leak | starterCode comments | `# CASO-LIM-021 · …` + `# DEFECT: …` + often `# Contrato: corrige el DEFECT; salida = solutionCode` | Developer QA notes rendered as student code; teaches “fix a labeled defect” not problem-solving. |
| I-05 | P1 | Meta-leak | T4-B callout | «…CP-N2-B no se considera cerrado en contenido (**el ledger lo confirma otra lane**).» | Opaque internal pipeline jargon. |
| I-06 | P1 | Meta-leak | youDo.portfolioNote + rubric | «otra lane marca passed»; criterion «Alineación al **gate V3** de la sección» | Portfolio rubric should use learner-visible quality criteria, not release process. |
| I-07 | P1 | Meta-leak | selfCheck Q4 | Option «Marcar section_passed desde esta lane»; explanation «Esta lane no marca passed en ledger…» | Quiz teaches internal ops, not reporting science. |
| I-08 | P1 | Meta-leak | resources.courses “PyArcana live” | note: «curso desplegado; **V3 S21** reporting factory» | Version-control chatter in student resources. |
| I-09 | P1 | Exercise correctness | S21-T1-B-E3 | Instruction Pass: `` `Lima:1 \| Cusco:2` ``; solution output is multiline `Lima:1\nCusco:2`; instruction text truncated mid-fixture | Students cannot know the true contract; breaks trust in “salida exacta”. |
| I-10 | P1 | Exercise correctness | S21-T2-A-E1 | Pass claims `` `True True \| True True` `` (single line with pipe); solution is two `print` lines without pipes | Same contract mismatch pattern. |
| I-11 | P1 | Concept misalignment | S21-T4-A E1/E2/E3 | E1 concept «redacción es-PE» → code is `round`; E2 «checklist a11y» → `fmt_pen`; E3 «precisión decimal» → `a11y_min` | Labels inverted/swapped; active recall binds wrong concept names to skills. |
| I-12 | P1 | Concept misalignment | S21-T3-B E1/E2 | E1 «caption alineado fuente/corte» → dash/doc parity dict; E2 «lista de limitaciones» → caption contains `"Fuente"` | Narrative topic not practiced; weak transfer to real captions/limits. |
| I-13 | P1 | Concept under-delivery | S21-T4-B-E1 | Concept «manifiesto de provenance» → only `print(approval["status"])` | Provenance (run_id, hashes, artifacts) is the section climax; exercise is trivial status string. |
| I-14 | P1 | Spoiling / GRR violation | All We Do instructions | Full solution code or near-full body embedded in instruction before starter | We Do collapses into copy-paste; gradual release fails (I Do already modeled; We Do should scaffold, not dump). |
| I-15 | P1 | Grain mismatch | T1-A-E1, T3-A-E1, T4-B-E1, etc. | E.g. print `"Hola Ana"`; print `h["id"]`; print `"pending_review"` | After S18–S20, micro-prints under-challenge Competente learners; theory promises factory, drills are one-liners. |
| I-16 | P1 | Theory density | All theory paragraphs | Pattern: 3 short “Contrato:/Caso:” bullets per subtopic; little worked narrative | High intrinsic load of stack (Jinja+docx+reportlab+pypdf+fitz+PIL) with low explanatory load support. |
| I-17 | P1 | Setup / cognitive load | T2 demos + You Do | Uses `docx`, `reportlab`, `pypdf`, `fitz`, `PIL` without install/env note in theory map | Environment friction before first success; violates “safe first win”. |
| I-18 | P2 | Connective tissue | theory[0] + tagline | English brand «Accessible Insights Dashboard & Reporting Factory» + abrupt V3 disclaimer | Weak emotional entry vs S02 job-relevance story; bilingual product speak dominates. |
| I-19 | P2 | Heading redaction | theory headings | «condiciones, tablas…», «resumen ejecutivo…», «gráficos, tablas…», «redacción…», «render visual…» start lowercase | Inconsistent title case vs «Jinja y…» / «DOCX real…»; looks unfinished. |
| I-20 | P2 | I Do structure | T4-A demo | `s21_ido_7` missing; bare code without `def s21_ido_7()`; numbering jumps 6→8 | Pattern break hurts automated runners and student mental model of demos. |
| I-21 | P2 | Numeric inconsistency | I Do PDF vs rest | `demo_pdf` embeds `n=32`; rest of section anchors `n=40` | Undermines the parity doctrine the section teaches. |
| I-22 | P2 | Evidence id drift | theory T3-A vs exercises | Theory hallazgo evidencia `"Tabla2"`; exercises use `"Tabla1"` | Minor but avoidable when teaching H→evidencia maps. |
| I-23 | P2 | Frozen demo output | theory T4-B | Code uses `datetime.now(...)` but fixed output `"ts": "2026-07-20T07:47:08Z"` | Live re-run fails “salida exacta” pedagogy; teaches that timestamps are static. |
| I-24 | P2 | Security pedagogy | provenance demos | Uses `hashlib.sha1` truncated to 8 hex | Fine as toy id; should note SHA-256 preferred for real integrity; 8 hex is collision-weak. |
| I-25 | P2 | Autoescape undemonstrated | T1-A theory | Warns about `mark_safe` / autoescape HTML but all demos are plain text | Warning without practice → inert knowledge. |
| I-26 | P2 | You Do under-specified | youDo.starterCode | Comments list `build_docx()`, `build_pdf()`, `extract_and_render()`, `manifest()` without acceptance tests beyond gate prose | Portfolio ambiguity vs detailed We Do oracles; high variance in submissions. |
| I-27 | P2 | jobRelevance tone | metadata | Dense acronym stack CP-N2-B / Reporting Factory without human stake | Weaker “why this job” than S02 banking/intake story. |
| I-28 | P2 | selfCheck coverage | selfCheck (5 Q) | No item on missing≠0, DOCX styles, or decimal consistency | Core section risks under-assessed. |
| I-29 | P3 | Orthography in samples | PDF strings | «Resumen **sintetico**» (missing accent) in multiple PDF samples | Acceptable for ASCII canvas demos; prefer “sintético” when Unicode is fine, or document ASCII constraint. |
| I-30 | P3 | Icon/color debt | metadata | Same blue-indigo gradient as S19–S22; Server icon non-semantic | Visual taxonomy fails; reporting should use FileText/FileStack-like metaphor. |
| I-31 | P3 | External resources fit | courses | Coursera PE, MIT 6.100L, CS50P are generic Python, weak for DOCX/PDF factory | Prefer targeted reportlab/docx/jinja tutorials already partly listed. |
| I-32 | P2 | Comparative (external) | whole section | Industry practice uses `docxtpl` (Jinja-in-DOCX) and HTML→PDF (WeasyPrint) pipelines; course only teaches imperative `python-docx` + ReportLab canvas | Valid pedagogical choice, but no mention of template-based DOCX alternatives → limited transfer to common stacks. |
| I-33 | P2 | Progressive disclosure gap | We Do → You Do | No mid-section “mini-factory” integrating Jinja+DOCX+parity before full You Do | Sudden release of responsibility at portfolio boundary. |
| I-34 | P3 | Live SPA | live site | Hash `#fastapi` works only after client hydration; content not scrapeable as static HTML | Accessibility of deep links for non-JS audit tools; not student-critical if UI works. |

**Issue count (registry):** 34  
**Meta-leak clusters (I-01, I-03–I-08 + starter DEFECT pattern):** treated as **8 distinct leak families** (see §4).

---

## 4. Meta-Leak Report

Exact leaked or process-facing strings that should not appear as student-facing prose (or should be rewritten).

### 4.1 Curriculum rewrite / V3 identity

| Location | Exact text |
| --- | --- |
| theory map ¶1 | `En V3, **S21 no es el path FastAPI de APIs HTTP** (reubicado). El id \`fastapi\` se conserva; aquí **cierras CP-N2-B**:…` |
| theory map ¶3 | `Progressive disclosure: sin routers FastAPI.` (borderline scope note; OK if decoupled from V3 rewrite) |
| resources.courses | `curso desplegado; V3 S21 reporting factory` |
| youDo.rubric | `Alineación al gate V3 de la sección` |

### 4.2 Internal pipeline (lane / ledger / passed)

| Location | Exact text |
| --- | --- |
| T4-B callout | `el ledger lo confirma otra lane` |
| youDo.portfolioNote | `listo para revisión de gate (otra lane marca passed)` |
| selfCheck Q4 options | `Marcar section_passed desde esta lane` |
| selfCheck Q4 explanation | `Esta lane no marca passed en ledger; sí entrega artefactos con provenance.` |

### 4.3 Exercise harness boilerplate (×24)

Pattern in every instruction:
```text
Fixture `S21-Tx-Y-Ez` / datos sintéticos: <often full solution>. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `…`.
```

### 4.4 Starter defect labels (×24)

Pattern:
```python
# CASO-LIM-021 · <slug>
# DEFECT: <diagnosis>
# Contrato: corrige el DEFECT; salida = solutionCode   # (many exercises)
print('ok', True)   # oracle residue
```

### 4.5 Non-leak (keep)

- Capstone codes `CP-N2-B`, `CASO-LIM-021` as **lab case id** (if introduced as student lab code, not defect label).
- Technical terms KPI, PEN, a11y, provenance when taught.
- Cross-links S18/S19/S20/S22.

### Meta-leak count (families)
**8 families** (rewrite/V3 · id FastAPI residual · lane/ledger · gate V3 rubric · selfCheck lane · resources V3 · oráculo/Pass boilerplate · DEFECT/solutionCode starters).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round pedagogical frame (applied)

Gradual Release of Responsibility (I Do → We Do → You Do) shifts cognitive load from instructor modeling to independent application; We Do must be *guided practice*, not solution dump. Cognitive load theory: for multi-tool document stacks, reduce extraneous load (meta-text, spoiling) and support intrinsic load (install path, one worked example of full package). Domain best practice for report automation separates data context from templates (Jinja), prefers real artifact verification (reopen DOCX / extract PDF), and treats missing metrics as explicit absence—not zero. Industry often uses Jinja-in-DOCX (`docxtpl`) or HTML→PDF; teaching imperative DOCX/PDF is valid if the *contracts* (parity, provenance, needs_ocr) remain the learning target.

### 5.2 Connective tissue & narrative flow

**Works:** T1→T2→T3→T4 order is coherent: templates → binary docs → narrative → governance. Lima/Cusco + `n=40` + median 28 PEN continuity with S18–S20 is strong. Bridge to S22 approval/email is stated.

**Fails:** Opening is an anti-syllabus (“not FastAPI”). Tagline is English product marketing. Theory paragraphs are contract lists, not taught stories. Compared with S02 (dictionary, intake persona, multi-paragraph worked examples), S21 lacks student-facing “why this report fails in a Lima ops review” narrative.

### 5.3 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
| --- | --- | --- |
| I Do | Medium-high | 8 demos cover each subtopic; why-lines are crisp. T4-A breaks function-wrapper convention; PDF n=32 drifts. |
| We Do | Low-medium | Structure 3×8 exists, but spoiling + trivial grain + concept swap break GRR. DOCX/PDF exercises (T2) are the best of the set. |
| You Do | Medium | Right portfolio ambition; starter is thin; rubric meta; portfolioNote process leak. |
| SelfCheck | Medium | 5 solid domain ideas; one polluted by lane/ledger; gaps on missing≠0 and styles. |

### 5.4 Cognitive load & progressive disclosure

- **Intrinsic load:** high (six libraries + narrative + governance).
- **Extraneous load:** high (meta-leaks, English brand, Pass mismatches, spoiling).
- **Germane load:** under-supported (few integration micro-projects before You Do).
- Progressive disclosure claim “sin routers FastAPI” is fine as scope; better phrased as student goals only.

### 5.5 Exercise & exam quality

**Strongest exercises:** T2-A (headings, styles, tables with —), T2-B (digital PDF, PNG render, needs_ocr)—these encode professional failure modes.

**Weakest:** T1-A-E1 (Hello Ana), T3-A-E1 (print id), T4-B-E1 (print status), T4-A label swaps.

**Pass/output bugs:** I-09, I-10; also instruction truncation mid-JSON in T1-B-E3.

**Assessment:** selfCheck only (no separate timed exam block—consistent with several mid sections, but coverage incomplete).

### 5.6 Roadmap consistency

- Aligns with S19 dashboard + S20 Excel factory toward CP-N2-B close; S22 next for email/approval.
- Systemic debt: S19–S21 all open with “En V3, Sxx no es el path …” and keep legacy ids (`databases-orm`, `rag`, `fastapi`). S21 is the worst UX because “fastapi” is a famous technology students expect.
- S41 owns real FastAPI—must remain the single HTTP API path.

### 5.7 Comparison to gold & external

| Benchmark | S21 vs benchmark |
| --- | --- |
| S02 gold (narrative, dictionary, progressive depth) | S21 thinner, more contract-speak, more meta |
| S19/S20 peers | Similar exercise boilerplate disease; S21 domain contracts slightly stronger |
| External (docxtpl / Jinja HTML→PDF tutorials) | Course stronger on *governance* (parity, provenance, OCR honesty); weaker on production templating ergonomics |
| Fisher/Frey GRR | I Do OK; We Do fails (spoiling); You Do abrupt |

### 5.8 Redaction (es-PE)

- Body Spanish is mostly professional; anglicisms (KPI, SLA, caption, dashboard, factory) are acceptable in this domain if glossed once.
- Prefer «informe / paquete de reportes» over long English product name in student-facing titles.
- Fix lowercase headings; fix Pass strings; remove process English (lane, ledger, gate V3, oráculo).
- Accent: «sintético» when not constrained by ReportLab demo ASCII.

### 5.9 Graph memory (nodes & quality edges)

```
[Map CP-N2-B] --teaches--> [T1 Jinja context]
[T1] --feeds--> [T2 DOCX/PDF artifacts]
[T2] --embeds--> [T3 narrative H→evidencia]
[T3] --reconciles--> [S19 metrics] & [S20 Excel]
[T4 a11y+decimals] --gates--> [T4 provenance+approval]
[T4 approval] --handoff--> [S22 email]
[Legacy id fastapi] --conflicts--> [Learner schema "APIs"]
[Meta lane/ledger] --pollutes--> [SelfCheck, YouDo rubric]
[Spoiled WeDo] --breaks--> [GRR edge I→We]
[needs_ocr contract] --aligns--> [S24 OCR later]
```

Quality edges currently **red**: meta→learner trust; spoiling→We Do; id fastapi→identity.  
**Green:** missing≠0; parity; digital vs scan; H≠decisión.

---

## 6. Proposed GitHub-style Diffs

> Apply only in a Fixer run. Paths relative to repo root. Diffs are representative; expand similarly for all 24 exercises where the pattern repeats.

### Diff A — Remove V3/FastAPI rewrite leak; student-facing map (I-01, I-18)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- "En V3, **S21 no es el path FastAPI de APIs HTTP** (reubicado). El id `fastapi` se conserva; aquí **cierras CP-N2-B**: plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva, consistencia numérica con dashboard (S19) y Excel (S20), provenance y cola de aprobación de paquete.",
- "Una sola corrida produce artefactos alineados: mismos n y métricas clave que el EDA S18 y el factory S20. Datos sintéticos Lima/Cusco; sin PII; sin publicar el informe sin checklist visual.",
- "Orden: **T1 Plantillas** (Jinja, separación datos/presentación, tablas seguras) → **T2 Documentos** (DOCX real, PDF digital vs imagen/OCR) → **T3 Narrativa** (resumen, método, hallazgos, figuras/tablas, limitaciones) → **T4 Gobernanza** (redacción a11y, provenance, aprobación). Progressive disclosure: sin routers FastAPI.",
+ "En esta sección **cierras CP-N2-B** con un **Reporting Factory**: plantillas Jinja, documentos DOCX/PDF locales, narrativa ejecutiva, consistencia numérica con el dashboard (S19) y el Excel (S20), provenance y cola de aprobación del paquete. (Las APIs HTTP se tratan más adelante en el currículum.)",
+ "Una sola corrida produce artefactos alineados: mismos *n* y métricas clave que el EDA de S18 y el factory de S20. Usamos datos sintéticos Lima/Cusco, sin PII, y no publicamos el informe sin checklist visual.",
+ "Orden: **T1 Plantillas** (Jinja, separación datos/presentación, tablas seguras) → **T2 Documentos** (DOCX real; PDF digital vs imagen/OCR) → **T3 Narrativa** (resumen, método, hallazgos, figuras/tablas, limitaciones) → **T4 Gobernanza** (redacción y a11y, provenance, aprobación).",
```

### Diff B — Tagline + jobRelevance less English/process (I-18, I-27)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- tagline: "Accessible Insights Dashboard & Reporting Factory genera dashboard, DOCX/PDF y workbook desde una corrida, con números reconciliados y revisión visual",
+ tagline: "Una corrida genera dashboard, DOCX/PDF y workbook con números reconciliados, provenance y revisión visual",
@@
- "Cerrar **CP-N2-B** exige un **Reporting Factory** que una dashboard, Excel y documentos reales con números reconciliados, provenance y aprobación.",
+ "En analytics y operaciones en Perú, el comité no acepta un Excel “bonito” si el DOCX dice otro número. Cerrar **CP-N2-B** exige un factory de reportes que una dashboard, Excel y documentos reales con métricas reconciliadas, provenance y aprobación humana.",
```

### Diff C — Icon semantic fix (I-02, I-30)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- icon: "Server",
+ icon: "FileStack",
```

*Note:* Keep `id: "fastapi"` only if product hash stability is mandatory; if renames are allowed, prefer `id: "reporting-factory"` and redirect `#fastapi` → new hash in router. Document migration in Fixer, not Explorer.

### Diff D — T4-B callout without lane/ledger (I-05)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- "Sin provenance y sin revisión visual registrada, CP-N2-B no se considera cerrado en contenido (el ledger lo confirma otra lane).",
+ "Sin provenance y sin revisión visual registrada, el paquete CP-N2-B no se considera cerrado: faltan evidencias auditables del factory.",
```

### Diff E — You Do portfolio + rubric (I-06)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- "Paquete final CP-N2-B: dashboard + xlsx + informe con provenance; listo para revisión de gate (otra lane marca passed).",
+ "Paquete final CP-N2-B: dashboard + xlsx + informe con provenance y checklist visual; listo para revisión humana antes de S22.",
@@
- { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+ { criterion: "Artefactos DOCX/PDF reales, reabiertos, con paridad de métricas y provenance", weight: "25%" },
```

### Diff F — SelfCheck Q4 rewrite (I-07, I-28 partial)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- question: "El cierre de contenido de CP-N2-B incluye:",
- options: ["Solo un print", "Provenance, checklist visual y hallazgos trazables", "Subir secretos al repo", "Marcar section_passed desde esta lane"],
- correctIndex: 1,
- explanation:
- "Esta lane no marca passed en ledger; sí entrega artefactos con provenance.",
+ question: "El cierre de contenido de CP-N2-B incluye:",
+ options: ["Solo un print de éxito", "Provenance, checklist visual y hallazgos trazables", "Subir secretos al repo", "Omitir el PDF si el DOCX se ve bien"],
+ correctIndex: 1,
+ explanation:
+ "El factory cierra con artefactos verificables: provenance, revisión visual y hallazgos con evidencia. Un print no sustituye el paquete.",
```

### Diff G — Resources V3 note (I-08)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- note: "curso desplegado; V3 S21 reporting factory",
+ note: "curso en vivo — sección de reportes trazables",
```

### Diff H — Exercise instruction pattern (I-03, I-14) — example S21-T1-A-E1

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- "E1 (guiado) — Concepto: render Jinja de saludo. Fixture `S21-T1-A-E1` / datos sintéticos: print(Template(\"Hola {{ nombre }}\").render(nombre=\"Ana\")). Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `Hola Ana`.",
+ "E1 (guiado) — Renderiza un saludo con Jinja2. Contexto sintético: `nombre=\"Ana\"`. La plantilla debe ser `Hola {{ nombre }}`. Imprime solo el texto renderizado.",
```

Apply the same rewrite family to all 24 instructions: drop Fixture/oráculo/Pass-spoiler; state goal + constraints; keep expected output only in solutionCode / tests.

### Diff I — Starter DEFECT cleanup (I-04) — example

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- code: `# CASO-LIM-021 · jinja render
-# DEFECT: hardcode sin Template
-from jinja2 import Template
-print("Hola")
-print('ok', True)`,
+ code: `# Lab CASO-LIM-021 — saludo Jinja
+# TODO: usa jinja2.Template para saludar a Ana
+from jinja2 import Template
+print("Hola")`,
```

Remove `# DEFECT`, `salida = solutionCode`, and trailing `print('ok', True)` from student-visible starters across the section.

### Diff J — Fix T1-B-E3 Pass + complete instruction (I-09)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- "E3 (transferencia) — Concepto: for de filas region:value. Fixture `S21-T1-B-E3` / datos sintéticos: tmpl = Template(\"{% for r in rows %},{{ r.region }}:{{ r.v }}\\\\n{% endfor %}\"); print(tmpl.render(rows=[{\"region\": \"Lima\". Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `Lima:1 | Cusco:2`.",
+ "E3 (transferencia) — Con un Template Jinja, itera `rows` y emite una línea `region:v` por fila (sin espacios extra). Datos: Lima→1, Cusco→2. Imprime el bloque completo (dos líneas).",
```
Ensure `solutionCode.output` remains:
```
Lima:1
Cusco:2
```
and any harness expected string matches **exactly** (no `|` join).

### Diff K — Fix T2-A-E1 Pass string (I-10)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- … Pass (salida exacta del solution): `True True | True True`.
+ … Salida esperada (dos líneas): primera `True True` (existe + firma PK); segunda `True True` (contiene Resumen y n=40).
```

### Diff L — Realign T4-A concepts (I-11)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ S21-T4-A-E1 instruction concept
- "… Concepto: redacción es-PE de hallazgo. … print([round(v, 1) for v in vals]) …"
+ "… Concepto: precisión a 1 decimal en métricas PEN. …"
@@ S21-T4-A-E2
- "… Concepto: checklist a11y headings/alt. … fmt_pen …"
+ "… Concepto: formateo centralizado `fmt_pen` con unidad. …"
@@ S21-T4-A-E3
- "… Concepto: precisión decimal consistente. … a11y_min …"
+ "… Concepto: checklist mínima a11y (H1 + alt con longitud). …"
```
Optionally add a fourth micro-item later for true es-PE rewrite; do not claim “redacción es-PE” for `round`.

### Diff M — Realign T3-B concepts (I-12)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@
- "E1 (guiado) — Concepto: caption alineado fuente/corte. … dash/doc parity"
+ "E1 (guiado) — Concepto: paridad de métricas dashboard↔documento. …"
@@
- "E2 (independiente) — Concepto: lista de limitaciones. … Fuente in cap"
+ "E2 (independiente) — Concepto: caption con campo Fuente visible. …"
```
Add or retarget one exercise to literally build `limits = ["solo web"]` and assert presence in package if concept “limitaciones” remains in theory.

### Diff N — Strengthen T4-B-E1 provenance (I-13)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ starter/solution (illustrative)
- approval = {"status": "pending_review"}
- print(approval["status"])
+ prov = {
+   "run_id": "cpn2b-01",
+   "data_sha1_8": "385fcd67",
+   "approval": {"status": "pending_review"},
+ }
+ print(prov["run_id"], prov["approval"]["status"])
```
Instruction concept stays “manifiesto de provenance”; expected output includes run_id + status.

### Diff O — I Do T4-A wrapper + PDF n parity (I-20, I-21)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ demo_a11y_copy.py
- code: `def fmt_pen(x):
- return f"{round(float(x), 1)} PEN"
- …
- print("a11y_min", checks["has_h1"] and all(len(a) > 10 for a in checks["alts"]))`,
+ code: `def s21_ido_7():
+    def fmt_pen(x):
+        return f"{round(float(x), 1)} PEN"
+    checks = {
+        "decimals": [fmt_pen(28.04), fmt_pen(28.0)],
+        "has_h1": True,
+        "alts": ["Barras mediana por región, n por barra en tooltip"],
+    }
+    print(checks["decimals"])
+    print("decimal_ok", len(set(checks["decimals"])) == 1)
+    print("a11y_min", checks["has_h1"] and all(len(a) > 10 for a in checks["alts"]))
+
+s21_ido_7()`,
@@ demo_pdf_artifact.py
- c.drawString(72, 760, "Hallazgo H1; n=32")
+ c.drawString(72, 760, "Hallazgo H1; n=40")
```

### Diff P — Deterministic provenance timestamp (I-23)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ s21_th_8
- "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
+ "ts": "2024-06-30T12:00:00Z",
```
Or document “timestamp illustrative” and stop claiming exact full-JSON match including live `now()`.

### Diff Q — Theory install callout (I-17)

```diff
--- a/src/lib/course/sections/s21-fastapi.ts
+++ b/src/lib/course/sections/s21-fastapi.ts
@@ theory map callout (add or extend)
+ title: "Dependencias del lab"
+ content: "En tu venv: `pip install jinja2 python-docx reportlab pypdf pymupdf pillow`. No uses PII real. Trabaja en un directorio de lab limpio: los demos crean informe.docx/pdf/png locales."
```

### Diff R — Headings capitalization (I-19)

```diff
- heading: "condiciones, tablas y formato seguro",
+ heading: "Condiciones, tablas y formato seguro",
- heading: "resumen ejecutivo, método y hallazgos",
+ heading: "Resumen ejecutivo, método y hallazgos",
- heading: "gráficos, tablas, fuentes y limitaciones",
+ heading: "Gráficos, tablas, fuentes y limitaciones",
- heading: "redacción, accesibilidad y consistencia",
+ heading: "Redacción, accesibilidad y consistencia",
- heading: "render visual, provenance y aprobación",
+ heading: "Render visual, provenance y aprobación",
```

### Diff S — Evidence id consistency (I-22)

```diff
- "hallazgos": [{"id": "H1", "texto": "Lima > Cusco en mediana", "evidencia": "Tabla2"}],
+ "hallazgos": [{"id": "H1", "texto": "Lima > Cusco en mediana", "evidencia": "Tabla1"}],
```
(or change exercises to Tabla2—pick one canon).

### Diff T — Optional selfCheck items (I-28)

Add 2 questions (or replace weak ones):
1. Missing median must render as `—`, not `0.00`.
2. DOCX headings must be real styles (`Heading 1`), not only bold runs.

### Diff U — SHA note (I-24)

```diff
+ callout tip: "En producción preferir SHA-256 del artefacto completo; aquí usamos un recorte corto solo como id de lab."
```

---

## 7. Recommended Priority Order for Fixing

1. **P0 meta-leaks student-visible** — Diffs A, D, E, F, G, H, I (map rewrite, lane/ledger, oráculo, DEFECT).  
2. **P0/P1 identity** — Diff C (icon); decide keep-vs-rename `id: fastapi` with product owner.  
3. **P1 exercise correctness** — Diffs J, K (Pass mismatches).  
4. **P1 concept alignment** — Diffs L, M, N (T3-B, T4-A, T4-B-E1).  
5. **P1 cognitive support** — Diff Q (deps); raise grain of T1-A/T3-A micro-drills; add one mini-integration We Do (Diff-class for I-33).  
6. **P2 I Do polish** — Diffs O, P, S (wrappers, n=40, timestamps, Tabla ids).  
7. **P2 redaction** — Diffs B, R (tagline/jobRelevance, headings).  
8. **P2 assessment** — Diff T (selfCheck gaps).  
9. **P3** — Diff U; resources curation (I-31); optional docxtpl mention (I-32); orthography sintético (I-29).

**Do not** expand section into full FastAPI content—S41 owns that.

---

## 8. Graph Memory Update notes

For shared curriculum memory / Fixer context:

```yaml
section: 21
id: fastapi
title: Documentos, plantillas y reportes trazables
file: src/lib/course/sections/s21-fastapi.ts
score_1_to_10: 6.0
status: explorer_complete

nodes_add:
  - S21.ReportingFactory.CP-N2-B
  - S21.Jinja.ContextDict
  - S21.MissingAsEmDash
  - S21.DOCX.RealStyles.Reopen
  - S21.PDF.DigitalVsImage.needs_ocr
  - S21.Narrative.H_to_Evidence
  - S21.Parity.Dash_Xlsx_Doc
  - S21.Provenance.VisualChecklist
  - S21.LegacyId.fastapi_debt
  - S21.MetaLeak.V3_lane_oraculo_DEFECT

edges_add:
  - { from: S18.EDA, to: S21.Narrative, type: metrics_continuity }
  - { from: S19.Dashboard, to: S21.Parity, type: same_kpis }
  - { from: S20.ExcelFactory, to: S21.Parity, type: same_kpis }
  - { from: S21.Provenance, to: S22.EmailApproval, type: handoff }
  - { from: S21.needs_ocr, to: S24.OCR, type: foreshadow }
  - { from: S21.LegacyId.fastapi, to: S41.FastAPI, type: identity_conflict }

fixer_must:
  - strip_V3_rewrite_paragraph
  - strip_lane_ledger_oraculo_DEFECT
  - fix_Pass_mismatches_T1B_E3_T2A_E1
  - realign_T3B_T4A_concept_labels
  - icon_Server_to_FileStack_or_equivalent
  - stabilize_demo_timestamps_and_n40
  - add_deps_callout

quality_edges:
  green: [missing_neq_zero, digital_vs_ocr, parity_gate, H_neq_decision]
  red: [meta_leaks, exercise_spoiling, fastapi_id_icon, concept_mislabel]
```

**Comparative baseline:** treat S02 narrative depth as gold; treat S19–S21 meta-boilerplate as a **cluster fix** opportunity (same instruction template disease).

---

## Explorer multi-pass checklist (STORM)

| Pass | Result |
| --- | --- |
| Surface scan | Structure complete (8× I Do, 24 We Do, You Do, 5 selfCheck); UI title OK |
| Deep pedagogy | GRR broken by spoiling; grain too fine; factory climax under-exercised |
| Redaction / es-PE | Process English + lowercase headings + English product tagline |
| Meta-leak | 8 families confirmed with exact quotes |
| Comparative | Domain contracts competitive; teaching form behind gold S02 and external templating practice |
| Loop refinement | Registry expanded through I-34; no major unreported P0/P1 remains |

---

This is the complete Explorer report for Section 21. Ready for the Fixer prompt.
