# S24 — Curriculum Auditor Report (Explorer pass)

> **Section 24** — `s24-rpa-advanced.ts` — Title: **"OCR y Document AI"** — Phase 1 (Competente) — estimatedHours 19 — `id: "rpa-advanced"` (legacy).
> Live URL hash: `#rpa-advanced`. Source: `src/lib/course/sections/s24-rpa-advanced.ts` (1 598 lines, ~73 KB).
> Method: live-site navigation (agent-browser) + repo source read + Fernández-Huerta / INFLESZ / WPS / SPW metrics + 13-rule pedagogical heuristics + LanguageTool `es`.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|-------|
| Position in `COURSE_SECTIONS` | 24 (Phase 1, Competente) — `src/lib/course/index.ts:26` |
| Source file | `src/lib/course/sections/s24-rpa-advanced.ts` |
| `id` | `"rpa-advanced"` (legacy V2 id — content retargeted to OCR/Document AI in V3; the live URL hash is `#rpa-advanced`, file name is `s24-rpa-advanced.ts`) |
| `title` | `"OCR y Document AI"` |
| `shortTitle` | `"OCR Document AI"` |
| `tagline` | `"extrae campos de documentos sintéticos, conserva bounding boxes/evidencia, abstiene bajo confidence y mide cada campo crítico"` |
| `estimatedHours` | 19 |
| Phase / Level | Phase 1 — Competente |
| Capstone binding | `CP-N2-C` (document intake; predecessor S23 Playwright download, successor S25 IA endpoints) |
| Tabs audited | Teoría (8 sub-topics × 4 paragraphs + callout + code), I Do (8 demos), We Do (24 exercises — guided / independent / transfer), You Do (capstone scaffold + 6-criterion rubric), selfCheck (5 MCQs), Recursos (6 docs + 2 books + 4 courses) |

**Live verification**: Opened `https://pillb.github.io/pyarcana/`, clicked the S24 sidebar button, confirmed `h1` = "OCR y Document AI", tagline and 19 h Competente badge match source. Confirmed all 8 theory headings ("OCR Document AI para intake CP-N2-C", "DPI, deskew, crop y contraste", "Ruido y orientación", "Idiomas, layout y confidence", "Texto, tablas y pares clave–valor", "Schema y normalización", "Validación cross-field y cola de revisión", "Golden set sintético, exactitud por campo y cobertura", "Privacidad, archivos hostiles y fallback") render verbatim. The interactive playground ("Pruébalo tú mismo") renders title `Practica orquestacion y retries` — see Meta-Leak Report §4.

---

## 2. Executive Summary of Quality

**Composite score: 7.5 / 10.**

| Dimension | Score | Note |
|-----------|------:|------|
| Pedagogical structure (I/We/You Do + progressive disclosure) | 9.5 / 10 | Anchor→Mechanism→Contract→Case schema uniform; 8 demos + 24 exercises + capstone + 5 MCQs; full DEFECT-pattern scaffold. |
| Code/output integrity (theory + We Do) | 9.5 / 10 | All 8 theory code blocks and all 24 starter/solution/output triples verified by manual execution — zero drift. |
| Spanish redaction & grammar | 8 / 10 | Mean FH 82.3 ("fácil"); 1 long sentence in `jobRelevance` (40 w, FH 52); systematic `auto-`/`re-` hyphenation; `vs` without period; `field y imprime` → `e`. |
| Meta-text / developer leakage | 5 / 10 | **HIGH**: the `'rpa-advanced'` key in `SectionView.tsx` (lines 2051–2126) still serves the legacy V2 RPA orchestration/retries demo (`@retry` decorator, `random.seed(42)`, "Pipeline RPA", "descargar_reporte"). This is the exact same retarget-debt pattern flagged in S05/S06/S07/S09/S11/S13. The `'rpa-advanced'` id and filename `s24-rpa-advanced.ts` are also stale but only visible in URL hash and PDF report label (`24. RPA+`). |
| Connective tissue / roadmap consistency | 9 / 10 | Explicit backward link to S23 (Playwright download) and forward link to S25 (OCR text feeds IA endpoints as untrusted input). CP-N2-C binding is consistent. |
| Cognitive load / progressive disclosure | 8 / 10 | Mini-glosario block, 4-paragraph theory block rhythm, callout density (1 per theory), but `jobRelevance` is a 4-sentence mega-paragraph with 6 bolded terms. |
| Exercise & exam alignment | 9 / 10 | 24/24 We Do have unique `hint` ≠ `hints[0]` (no DRY debt). All self-check MCQs calibrated against `reasons[]`/`needs_review ≠ fraude` policy. |
| Comparison with best-in-class external materials | 8 / 10 | Resource list covers Tesseract, pytesseract, Pillow, OpenCV, Azure Document Intelligence, Google Document AI, Practical MLOps, DeepLearning.AI, MIT 6.100L, CS50P, Landing AI. Honest about commercial processors being "lectura en Recursos" and "extensión opcional". |

**Verdict**: Pedagogically gold-standard (9.5/10 structure + 9.5/10 code integrity). The single biggest learner-facing defect is the **interactive playground demo leak** — learners see off-topic RPA-retries code on the most engaging interactive surface of the S24 page. Combined with the `vs.`/`auto-`/`re-` typography cleanup and one `y → e` concord rule, ~6 line-edits + 1 playground rewrite would lift this section to ~9.0/10.

---

## 3. Detailed Issue Registry

> Severity scale: **H** = blocks learning or contradicts curriculum contract; **M** = real defect, partial work-around exists; **L** = style/typography/consistency.

### I-01 — Wrong interactive playground demo for S24 (HIGH, meta-leak)
- **Evidence**: Live page S24 → "Pruébalo tú mismo" panel renders title `Practica orquestacion y retries` and code:
  ```python
  # Practica orquestacion de RPA (simulado)
  import time, random
  from functools import wraps
  def retry(max_attempts=3, delay=0.1): ...
  @retry(max_attempts=5, delay=0.05)
  def descargar_reporte(url): ...
  # Pipeline RPA con multiples tareas
  random.seed(42)
  ```
  Source: `src/components/course/SectionView.tsx:2051–2126` (`'rpa-advanced'` key in `demos` map).
- **Pedagogical impact**: Section content is OCR/Document AI (preproceso → OCR adapter → schema → cross-field → golden → gate hostil). Playground teaches RPA orchestration with `tenacity`-style retry decorators — a topic that no longer appears in S24. Learners who reach the playground after reading the theory tab will see code that has nothing to do with what they just learned, undermining the I Do / We Do → "try it yourself" transfer. Same defect class as S06 (`numpy` editor in colecciones), S09 (`matplotlib` editor in exceptions), S13 (`tenacity`/`argparse` editor in Familiarity Evidence Dashboard).
- **Root cause**: V3 retarget renamed the section's content from "RPA Advanced" (orchestration + retries) to "OCR y Document AI" but the `demos['rpa-advanced']` entry was never rewritten.

### I-02 — Stale `id` and filename surface as learner-visible URL/label (HIGH, structural)
- **Evidence**:
  - `id: "rpa-advanced"` (source line 4) → live URL `https://pillb.github.io/pyarcana/#rpa-advanced` (verified).
  - Filename `s24-rpa-advanced.ts` (GitHub URL leaks via "Repositorio" footer link).
  - `PdfReport.tsx:64`: `"rpa-advanced": '24. RPA+'` — PDF progress report labels the section "24. RPA+" while the actual title is "OCR y Document AI".
- **Pedagogical impact**: URL hash and PDF label are learner-visible artefacts that contradict the section's actual content. Same retarget-debt pattern flagged in S05/S06/S07/S09/S11/S12/S13.

### I-03 — `auto-` prefix hyphenated 9× (MEDIUM, RAE rule)
- **Evidence**: 9 occurrences in prose of `auto-aceptas`, `auto-aceptes`, `auto-acepta`, `auto-aceptar`, `auto-aceptar basura`, `auto-accept` (the last is an English code identifier in `auto-accept`, used 3× in We Do T2-A exercise hints/feedback — should be either Spanish `autoaceptar` or wrapped in `code`).
  - Line 32: `**fail-closed:** si hay duda, no auto-aceptas.`
  - Line 110: `Si score < 0.5 → manual_orient, no auto-aceptes.`
  - Line 118: `el intake auto-acepta basura.`
  - Line 245: `el documento no se auto-acepta si la lista no está vacía.`
  - Line 248: `(no auto-aceptar basura)`
  - Lines 719, 722, 728, 795: `auto-accept` (used as a noun phrase "el auto-accept" / "umbral de auto-accept" — English code identifier, should be `auto-accept` in backticks or `autoaceptar` in Spanish).
- **Pedagogical impact**: RAE rule: prefixes (`auto-`, `re-`, `pre-`, `post-`, `anti-`, `pro-`) attach without hyphen to the next word (`autoaceptar`, `autorregulación`, `autorización`). Hyphenated forms look unpolished and reinforce a "translated literal" tone.
- **Cause**: Authoring style drift; the same pattern was cleaned up in earlier sections (e.g. S06 → `autoaceptar`).

### I-04 — `re-` prefix hyphenated 3× (MEDIUM, RAE rule)
- **Evidence**:
  - Line 30: `Aquí no re-scrapeas el portal` → should be `rescrapeas` (or rewrite as `no vuelves a scrapear`).
  - Line 49: `barato frente a re-OCR` → should be `reOCR` (or `volver a correr OCR`).
  - Line 154: `sin re-OCRizar` → should be `reOCRizar` (or `sin volver a OCRizar`).
  - Line 322: `(re-escaneo o tipeo asistido)` → should be `reescaneo`.
- **Pedagogical impact**: Same RAE rule as I-03; reinforces typographic inconsistency.

### I-05 — `vs` without period (LOW, RAE abbreviation style)
- **Evidence**: 10 occurrences of `vs` (without `.`) in prose:
  - Line 33: `TesseractAdapter vs FakeOcrAdapter`
  - Line 247: `total 150.0 vs líneas [100, 50]` and `total 150.0 vs [100, 40]`
  - Line 283: `pred vs true`
  - Line 459: `Compara total vs suma de líneas`
  - Line 872: `infla sumas vs total en validación`
  - Line 881: `para no inflar sumas vs total`
  - Line 1067: `Suma 9 vs total 10`
  - Line 1487: `real vs fake adapter`
  - Line 1501: `Un mismatch total vs suma de líneas`
- **Pedagogical impact**: RAE accepts both `vs` and `vs.`; the latter is the formal style and the form used in other audited sections. Stylistic consistency only.

### I-06 — `y` → `e` concord rule violation (MEDIUM)
- **Evidence**: Line 904 (We Do S24-T2-B-E3 instruction): `adjunta bbox del **valor** (no del label) a cada field y imprime lista de (name, value, bbox) ordenada por name.` — `y imprime` should be `e imprime` because the next word starts with `/i/` sound (`imprime`).
- **Pedagogical impact**: Spanish concord rule (`y` → `e` before `i-` / `hi-` sounds). Real grammar finding, not a style preference.
- **LT finding**: `Y_E_O_U` (1 hit).

### I-07 — Self-check Q2 stem inconsistent with other 4 questions (LOW)
- **Evidence**: Line 1501:
  ```
  question: "Un mismatch total vs suma de líneas en la validación cross-field implica:",
  options: ["Fraude probado", "Cola de revisión / corrección", "Borrar el doc", "Subir DPI"]
  ```
  Other 4 questions use `¿...?` pair (e.g. line 1494 `"¿Qué haces si confidence de RUC es 0.6 (umbral lab 0.85)?"`).
- **Pedagogical impact**: Sentence-completion stems are acceptable in MCQ design, but mixing styles in the same `selfCheck` block breaks the visual rhythm and the Spanish inverted-question convention.

### I-08 — `jobRelevance` mega-paragraph (MEDIUM, cognitive load)
- **Evidence**: Line 15 — single 4-sentence paragraph (40 + 24 + 16 + 17 = 97 words, FH 52.0 overall, FH 47.2 on first sentence alone). 6 bolded terms (**campos con evidencia**, **document intake**, **encolar bien**, **real**, **fake**) pack the opener with vocabulary before the learner has context.
- **Pedagogical impact**: `jobRelevance` is the first learner-facing text on the section card (above the theory tab). Other sections have split this into 2–3 paragraphs (S01, S03, S08) — recommended pattern. Also flagged in S06, S07, S08, S10, S12, S13.

### I-09 — `youDo.context` dense sentence (MEDIUM, cognitive load)
- **Evidence**: Line 1404 — second sentence of `youDo.context`:
  > `Procesa al menos 3 "documentos" sintéticos: preproceso meta → extracción KV → normalización a schema (RUC 11, montos PE con coma decimal, fecha ISO) → validación cross-field → métricas por campo y cola de revisión.`
  Word count 29, FH 42.78 ("difícil"). The arrow chain `→` x4 with parentheticals makes this hard to parse on first read.
- **Pedagogical impact**: `youDo.context` is the capstone briefing; a numbered list would reduce cognitive load and match the style used elsewhere in the section (e.g. line 75 callout "Checklist: (1) ... (2) ... (3) ... (4) ...").

### I-10 — `logueas` anglicism (LOW)
- **Evidence**: Line 248: `marcas human_queue, logueas reasons y pasas al siguiente.`
- **Pedagogical impact**: `loguear` is informal Spanish for "to log"; RAE-accepted informal but `registras` / `dejas en el log` reads more polished. Same finding as S09.

### I-11 — `download` as Spanish noun (LOW)
- **Evidence**: Line 30: `un download verificado (PDF/PNG sintético) es la entrada típica del intake.`
- **Pedagogical impact**: `descarga verificada` is the Spanish equivalent; "download" as noun is informal Spanglish common in tech LatAm but should be glossed or replaced in formal prose.

### I-12 — `CASO-LIM-024` tag in starter code comments (LOW, borderline meta-leak)
- **Evidence**: 24 occurrences of `# CASO-LIM-024 · <topic>` as the first line of every `starterCode.code` block in We Do (lines 530, 562, 594, 632, 664, 696, 732, 764, 805, 851, 885, 917, 956, 990, 1022, 1071, 1103, 1139, 1190, 1222, 1254, 1296, 1330, 1362). Visible to learners in the We Do editor.
- **Pedagogical impact**: Internal cross-section case-tracking tag leaks into learner-visible starter code. Borderline: the comment is informative ("Caso límite 024 — DPI mínimo 200 para OCR legible") but the `CASO-LIM-024` identifier is an internal taxonomy not introduced anywhere in the learner-facing prose. Same pattern flagged in S05, S08.

### I-13 — `download verificado` and "download" repetition in tagline-adjacent prose (LOW)
- **Evidence**: Line 30 uses `download verificado` and `intake` (both anglicisms) twice in the same paragraph. The mini-glosario on line 32 then defines `adapter`, `bbox`, `confidence`, `HITL`, `golden set`, `fail-closed`, `coverage_auto`, `preflight` (8 English-coded terms, all bolded) without offering Spanish equivalents in parens.
- **Pedagogical impact**: This is intentional code-as-vocabulary pedagogy (the section explicitly uses `real`/`fake` adapter contracts), but adding Spanish glosses in parentheses for the first occurrence (e.g. `**golden set** (*conjunto dorado etiquetado*)`) would reduce cognitive load for first-time readers. Other sections (S01, S03) do this.

### I-14 — `mismatch` used as Spanish noun (LOW)
- **Evidence**: 6 occurrences of `mismatch` in prose (lines 245, 247, 276, 459, 1067, 1135, 1501).
- **Pedagogical impact**: `mismatch` is English; Spanish equivalents: `discrepancia`, `descuadre`, `diferencia`, `no cuadra`. The section does use "no cuadra" / "cuadra" in informal prose (lines 459, 470, 1135) — so the code-switch is inconsistent. Pick one register.

### I-15 — `auto_fraud_label`, `auto_fraud`, `human_rescan`, `coverage_auto`, `auto_fraud_label=False` exposed in prose without backticks (LOW)
- **Evidence**: Line 31: `Política fail-closed: \`auto_fraud_label=False\` siempre en este path.` (✓ backticked). But line 276: `Nunca emitas label auto_fraud desde OCR.` — `auto_fraud` is NOT backticked, reads as Spanish.
- **Pedagogical impact**: Code identifiers should always be in backticks to distinguish them from Spanish prose.

### I-16 — `rule` count summary (informational)
- 29 `missing_terminal` heuristic hits — all are list items, callout criteria, MCQ options, or short labels (e.g. `"Pipeline completo: preproceso → OCR simulado → schema → validación → métricas por campo"`) where list-item punctuation is acceptable. Not actionable.
- 23 `high_comma_density` heuristic hits — all are checklists and step-by-step instructions where commas separate enumerations. Not actionable.
- 11 `english_dominant` heuristic hits — all are MCQ option strings (e.g. `"Subir DPI"`) or short technical labels. Not actionable.
- 4 `unbalanced_delim` heuristic hits — all sentence-splitter artifacts on `p. ej.` and inline code with brackets. Not actionable.
- 3 `det_noun_concord?` heuristic hits — false positives on "Un schema" / "el schema" (schema is masculine anglicism). Not actionable.
- 1 `repeated_word` heuristic hit — `Pass: reject reject human_rescan` is the literal expected stdout (3 lines). Not actionable.
- 1 `missing_inv_question` heuristic hit — false positive on `¿Por qué medir accuracy por campo (p. ej. acc_ruc) y no solo un accuracy global?` — sentence splitter broke on `p. ej.` inside parens. Not actionable.
- 1 `long` sentence (jobRelevance opener, 40 w) → addressed in I-08.

---

## 4. Meta-Leak Report

| # | Location | Leaked text | Severity |
|---|----------|-------------|----------|
| ML-1 | `src/components/course/SectionView.tsx:2051–2126` (`demos['rpa-advanced']`) | Title `Practica orquestacion y retries`; code: `# Practica orquestacion de RPA (simulado)`, `def retry(max_attempts=3, delay=0.1)`, `def descargar_reporte(url)`, `random.seed(42)`, `# Pipeline RPA con multiples tareas`. Renders live on S24 → "Pruébalo tú mismo" panel. | **HIGH** — interactive playground teaches the wrong (V2) curriculum. |
| ML-2 | `src/components/course/PdfReport.tsx:64` | `"rpa-advanced": '24. RPA+'` — PDF progress report labels the section "24. RPA+" instead of "24. OCR". | **MEDIUM** — learner-visible PDF label mismatch. |
| ML-3 | `id: "rpa-advanced"` (source line 4) → URL hash `#rpa-advanced` | URL exposes the legacy V2 id `rpa-advanced` on the live site. | **MEDIUM** — learner-visible URL contradiction. |
| ML-4 | `# CASO-LIM-024` starter-code comments (24×) | `# CASO-LIM-024 · <topic>` first line of every We Do starterCode. | **LOW** — internal case-tracking taxonomy leaks into learner-visible starter code; borderline (informative comment, but tag is never explained in prose). |
| ML-5 | Filename `s24-rpa-advanced.ts` | Visible via the "Repositorio" footer link → GitHub. | **LOW** — GitHub-only visibility, not in-app. |

**No prose-level developer-comment leaks**: full-file regex sweep for `\bTODO\b`, `\bFIXME\b`, `\bXXX\b`, `\bTBD\b`, `\bWIP\b`, `moved from`, `moved to`, `curriculum_hardening`, `STORM`, `FIXER`, `V3 retarget`, `En V3` returned zero hits inside the section file's prose fields (the only "pendiente" hit is line 510 `no te quedes en un solo print` — a normal Spanish phrase, not a leak marker).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do / selfCheck fidelity

| Layer | Count | Contract |
|-------|------:|----------|
| Theory blocks | 8 (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) | Each block: 4 paragraphs + 1 callout + 1 code block (canonical Anchor→Mechanism→Contract→Case). |
| I Do demos | 8 (one per subtopic) | Each demo: `demoId`, `subtopicId`, `environment: "local"`, `description`, `code`, `output`, `why`. All 8 outputs verified by manual execution. |
| We Do exercises | 24 (8 subtopics × 3 layers: guided / independent / transfer) | Each exercise: `id`, `subtopicId`, `kind`, `instruction`, `hint`, `hints[3]`, `edgeCases`, `tests`, `feedback`, `starterCode` (with DEFECT), `solutionCode` (with output). All 24 starter→solution→output triples verified. |
| You Do capstone | 1 (`title`, `context`, `objectives[4]`, `requirements[7]`, `starterCode` scaffold, `portfolioNote`, `rubric[6]`) | Rubric weights sum to 100% (25+20+20+15+10+10). |
| selfCheck | 5 MCQs | `correctIndex` fairly distributed (3, 1, 2, 0, 3). Each has `explanation` paragraph. |
| Resources | 6 docs + 2 books + 4 courses | All URLs reachable; mix of OCR engines (Tesseract, pytesseract), preprocess (Pillow, OpenCV), commercial Document AI (Azure, Google), MLOps (Practical MLOps), MOOCs (DeepLearning.AI, MIT 6.100L, CS50P), industry (Landing AI). |

### 5.2 Progressive disclosure

- The opening "Mapa de la sección" paragraph (line 30) explicitly names the 4 sub-topic ordering and the capstone binding (`CP-N2-C`) — pedagogically sound.
- The "Mini-glosario de intake" (line 32) bolds 8 vocabulary terms before they appear in subsequent theory blocks — meets the "glossary up front" pattern from gold-standard S01.
- Each theory block follows the **Anchor (case PE) → Mechanism (code) → Contract (callout) → Case (synthetic example)** schema uniformly.
- `reasons[]` / `needs_review` / `auto_fraud_label=False` ethics spine is repeated in 7 callouts (3 warnings, 1 danger, 3 tips) — reinforced without being preachy.
- The "Fail-closed ≠ Fail-stop" distinction (line 248) is a sophisticated product-vs-engineering concept taught with one sentence — best-in-class framing.

### 5.3 Cognitive load hotspots

- **jobRelevance opener (line 15)**: 40-word sentence with 5 bolded terms before learner has any context. (I-08.)
- **youDo.context (line 1404)**: 29-word arrow-chain sentence (I-09).
- **Theory T1-A paragraph 1 (line 46)**: "Cuando una boleta llega al intake a 96 DPI (foto de celular, PDF rasterizado barato), el motor OCR confunde '8' con 'B' y el RUC se rompe. DPI es densidad de puntos por pulgada..." — jumps straight into 4 bolded terms (DPI, Deskew, crop, contraste) in 4 sentences. Acceptable but borderline.

### 5.4 Connective tissue

- **Backward**: Line 30 explicitly references S23 (Playwright download) as the source of the artifact entering the intake.
- **Forward**: Line 33 explicitly states "Más adelante, el texto OCR alimenta endpoints de IA (S25) como entrada no confiable".
- **Capstone binding**: CP-N2-C is named in `jobRelevance` (line 15), `theory[0]` (line 30), `iDo.intro` (line 356), `youDo.title` (line 1402), `youDo.context` (line 1404). Consistent.
- **Ethics spine**: 7 callouts + 5 self-check explanations + 1 youDo rubric criterion all reinforce `needs_review ≠ fraude` and `auto_fraud_label=False`. Same posture as S03/S05/S09/S11/S13.

### 5.5 Roadmap consistency

- The original master roadmap described S24 as "RPA Avanzado: orquestación, retries, scheduling" (V1/V2). The V3 retarget to OCR/Document AI is openly declared in the section's own theory map (line 30: "Llegas desde el adaptador web de la sección anterior (S23)") and in `course-state/curriculum_hardening/paragraph_analysis/S24_PARAGRAPHS.md` (status: `expert_gold`, expert_rank: 9.55, method: `hand_STORM_domain_sources`).
- The retarget is internally coherent — no orphaned references to "orquestación" or "tenacity" inside the section file. The ONLY retarget debt is in the shared `SectionView.tsx` `demos` map (ML-1) and the `PdfReport.tsx` label (ML-2).

### 5.6 Comparison with best-in-class external materials

| Source | What it does better than S24 | What S24 does better |
|--------|------------------------------|----------------------|
| Tesseract docs | Reference exhaustiveness | Pedagogical scaffolding (Tesseract is "opcional" until runtime declares it; section teaches the *contract*, not the engine) |
| Microsoft Document Intelligence | Layout multi-columna, processors comerciales | Honest scoping ("quedan como lectura en Recursos y extensión opcional"); `real`/`fake` adapter contract is testable without a cloud account |
| Practical MLOps (O'Reilly) | Golden-set methodology depth | Concrete `field_acc = correct / n` + `coverage_auto = auto / (auto + review)` formulas in 1 paragraph each |
| MIT 6.100L | CS-theoretic depth | Domain-honest PE context (Lima, boletas, RUC 11 dígitos, montos con coma decimal) |
| Real Python / pyArcana gold standard | — | Full I/We/You Do fidelity that commercial tutorials lack |

---

## 6. Grammatical improvements — paragraph by paragraph (before / after)

### 6.1 Theory tab — `jobRelevance` (line 15)

**BEFORE** (97 words, 4 sentences, FH 52.0):
> En un backoffice de Lima (facturas, boletas y PDFs de proveedores), el cuello de botella no es "leer letras": es convertir un artefacto (PNG/PDF sintético en el lab) en **campos con evidencia** que un humano pueda auditar en minutos. El **document intake** de CP-N2-C modela ese camino: preproceso → OCR con confidence y bbox → schema → validación cross-field → cola HITL y métricas por campo. El OCR se expone con un contrato común `real`/`fake` para tests; abstenerse bajo confidence es control de calidad, no veredicto de fraude. El valor profesional es **encolar bien** — no "cerrar" casos por score ni inventar dígitos de RUC.

**AFTER** (split into 3 paragraphs, FH per sentence ≈ 70):
> En un backoffice de Lima (facturas, boletas y PDFs de proveedores), el cuello de botella no es "leer letras": es convertir un artefacto (PNG/PDF sintético en el lab) en **campos con evidencia** que un humano pueda auditar en minutos.
>
> El **document intake** de CP-N2-C modela ese camino: preproceso → OCR con confidence y bbox → schema → validación cross-field → cola HITL y métricas por campo. El OCR se expone con un contrato común `real`/`fake` para tests; abstenerse bajo confidence es control de calidad, no veredicto de fraude.
>
> El valor profesional es **encolar bien** — no "cerrar" casos por score ni inventar dígitos de RUC.

### 6.2 Theory tab — `theory[0].paragraphs[0]` (line 30, "Llegas desde el adaptador web…")

**BEFORE** (90 words, 3 sentences):
> Llegas desde el adaptador web de la sección anterior (S23): un download verificado (PDF/PNG sintético) es la entrada típica del intake. Aquí no re-scrapeas el portal — **consumes el artefacto** y lo conviertes en campos con evidencia. Construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no "cerrar" casos por score.

**AFTER** (fix `re-scrapeas` → `rescrapeas`, `download verificado` → `descarga verificada`):
> Llegas desde el adaptador web de la sección anterior (S23): una **descarga verificada** (PDF/PNG sintético) es la entrada típica del intake. Aquí no rescrapeas el portal — **consumes el artefacto** y lo conviertes en campos con evidencia. Construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no "cerrar" casos por score.

### 6.3 Theory tab — `theory[1].paragraphs[3]` (line 49)

**BEFORE**:
> Borde útil: si el sesgo es casi nulo (`|skew| < 0.5°`), no marques deskew "por si acaso"; un flag falso ensucia la auditoría. Si el DPI ya es 300, `max(dpi, 200)` lo deja intacto. El preproceso es barato frente a re-OCR: invierte ahí antes de culpar al motor.

**AFTER**:
> Borde útil: si el sesgo es casi nulo (`|skew| < 0.5°`), no marques deskew "por si acaso"; un flag falso ensucia la auditoría. Si el DPI ya es 300, `max(dpi, 200)` lo deja intacto. El preproceso es barato frente a re-OCR: invierte ahí antes de culpar al motor. *(accept either `reOCR` or rewrite as "frente a volver a correr OCR")*

### 6.4 Theory tab — `theory[4].paragraphs[1]` (line 154)

**BEFORE**:
> La evidencia no es el label "RUC" en negrita: es el **bbox del valor** (los dígitos). El revisor en UI resalta ese rectángulo sin re-OCRizar. Si solo guardas el bbox del label, el humano no ve el número dudoso y pierde tiempo.

**AFTER**:
> La evidencia no es el label "RUC" en negrita: es el **bbox del valor** (los dígitos). El revisor en UI resalta ese rectángulo sin re-OCRizar (sin volver a pasar el motor). Si solo guardas el bbox del label, el humano no ve el número dudoso y pierde tiempo.

### 6.5 Theory tab — `theory[6].paragraphs[3]` (line 248)

**BEFORE**:
> En batch nocturno, un doc en cola no debe detener el archivo: marcas `human_queue`, logueas reasons y pasas al siguiente. Fail-closed de *calidad* (no auto-aceptar basura) no es lo mismo que fail-stop de *throughput* (tirar el batch entero).

**AFTER**:
> En batch nocturno, un doc en cola no debe detener el archivo: marcas `human_queue`, registras las reasons en el log y pasas al siguiente. Fail-closed de *calidad* (no autoaceptar basura) no es lo mismo que fail-stop de *throughput* (tirar el batch entero).

### 6.6 Theory tab — `theory[7].paragraphs[3]` (line 322)

**BEFORE**:
> Si el OCR falla con un binario corrupto (`ocr_fail`), el fallback operativo es `human_rescan` (re-escaneo o tipeo asistido) — no reintentar 100 veces el mismo archivo. Reintentar en bucle quema CPU y no mejora un PDF roto.

**AFTER**:
> Si el OCR falla con un binario corrupto (`ocr_fail`), el fallback operativo es `human_rescan` (reescaneo o tipeo asistido) — no reintentar 100 veces el mismo archivo. Reintentar en bucle quema CPU y no mejora un PDF roto.

### 6.7 I Do tab — `iDo.intro` (line 356)

**BEFORE** (24 words, FH 59.86):
> Te muestro el document intake CP-N2-C en ocho demos cortos: preproceso, orientación, confidence, KV, schema, cross-field, golden y gate hostil — sin inferir fraude.

**AFTER** (no change needed — FH 59.86 is in "normal" band; the sentence is pedagogically compact and the em-dash clause is intentional).

### 6.8 We Do tab — `weDo.intro` (line 510)

**BEFORE** (25 words, FH 42.14):
> 24 ejercicios en tres capas por subtema: **guiado** (arregla un defecto obvio), **independiente** (aplicas el contrato sin plantilla larga) y **transferencia** (compones funciones del intake real). Cubre preproceso, orientación, OCR/KV, schema PE, validación, golden y hostiles. En transferencia no te quedes en un solo print: arma el mini-módulo que luego reutilizarás en el You Do.

**AFTER** (split the long first sentence; convert second sentence to a list):
> 24 ejercicios en tres capas por subtema:
>
> - **Guiado**: arregla un defecto obvio.
> - **Independiente**: aplicas el contrato sin plantilla larga.
> - **Transferencia**: compones funciones del intake real.
>
> Cubren preproceso, orientación, OCR/KV, schema PE, validación, golden y hostiles. En transferencia no te quedes en un solo print: arma el mini-módulo que luego reutilizarás en el You Do.

### 6.9 We Do tab — `weDo.steps[11].instruction` (line 904, S24-T2-B-E3)

**BEFORE** (with `y imprime`):
> Evidencia KV: lines=['RUC: 20123456789','Total: 150.00'] con bboxes={RUC:[0,0,10,10], Total:[0,20,40,30]}. Parsea KV (clave:valor), adjunta bbox del **valor** (no del label) a cada field y imprime lista de (name, value, bbox) ordenada por name. Pass: [('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])].

**AFTER** (`y` → `e`):
> Evidencia KV: lines=['RUC: 20123456789','Total: 150.00'] con bboxes={RUC:[0,0,10,10], Total:[0,20,40,30]}. Parsea KV (clave:valor), adjunta bbox del **valor** (no del label) a cada field **e** imprime lista de (name, value, bbox) ordenada por name. Pass: [('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])].

### 6.10 You Do tab — `youDo.context` (line 1404)

**BEFORE** (97 words, 3 sentences, second sentence FH 42.78):
> Cierra el arco S23→S24: el artefacto descargado (meta de imagen + tokens OCR simulados) entra al **document intake** de CP-N2-C. Procesa al menos 3 "documentos" sintéticos: preproceso meta → extracción KV → normalización a schema (RUC 11, montos PE con coma decimal, fecha ISO) → validación cross-field → métricas por campo y cola de revisión. Sin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status y reasons[] por doc, más acc_ruc / acc_total / coverage_auto sobre un mini golden (≥2 filas).

**AFTER** (convert the arrow-chain to a numbered list):
> Cierra el arco S23→S24: el artefacto descargado (meta de imagen + tokens OCR simulados) entra al **document intake** de CP-N2-C. Procesa al menos 3 "documentos" sintéticos siguiendo estos pasos:
>
> 1. Preproceso de la meta de imagen.
> 2. Extracción KV.
> 3. Normalización a schema (RUC 11 dígitos, montos PE con coma decimal, fecha ISO).
> 4. Validación cross-field.
> 5. Métricas por campo y cola de revisión.
>
> Sin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status y `reasons[]` por doc, más `acc_ruc` / `acc_total` / `coverage_auto` sobre un mini golden (≥2 filas).

### 6.11 selfCheck — `selfCheck.questions[1]` (line 1501)

**BEFORE**:
> Un mismatch total vs suma de líneas en la validación cross-field implica:
> options: ["Fraude probado", "Cola de revisión / corrección", "Borrar el doc", "Subir DPI"]

**AFTER** (rewrite as full `¿...?` question for consistency with the other 4 MCQs; also fix `vs` → `vs.`):
> ¿Qué implica un mismatch entre el total y la suma de líneas en la validación cross-field?
> options: ["Fraude probado", "Cola de revisión / corrección", "Borrar el doc", "Subir DPI"]

### 6.12 selfCheck — `selfCheck.questions[3]` explanation (line 1519)

**BEFORE**:
> Allowlist de mime (pdf/png/jpeg) y tope de tamaño: zip no es documento de factura del lab; se rechaza antes del motor.

**AFTER** (no change needed — `Allowlist` is in code-style position; could be `Lista de permitidos (allowlist)` but acceptable as-is).

---

## 7. Proposed GitHub-style Diffs

### Diff D-01 — Rewrite the interactive playground demo for S24 (fixes ML-1, I-01)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -2048,73 +2048,80 @@
 Pixeles blancos: 13/25 (52%)`,
       hint: 'Cambia el threshold a 35 y observa como cambian los pixeles blancos',
     },
-    'rpa-advanced': {
-      title: 'Practica orquestacion y retries',
-      code: `# Practica orquestacion de RPA (simulado)
-import time
-import random
-from functools import wraps
-
-# Decorador de retry (simulando tenacity)
-def retry(max_attempts=3, delay=0.1):
-    """Reintenta una funcion hasta max_attempts veces."""
-    def decorator(func):
-        @wraps(func)
-        def wrapper(*args, **kwargs):
-            for attempt in range(1, max_attempts + 1):
-                try:
-                    result = func(*args, **kwargs)
-                    print(f"  ✓ Intento {attempt}: exitoso")
-                    return result
-                except Exception as e:
-                    print(f"  ✗ Intento {attempt}: fallo - {e}")
-                    if attempt < max_attempts:
-                        time.sleep(delay)
-                        print(f"    Reintentando en {delay}s...")
-                    else:
-                        print(f"  ✗ Agotados {max_attempts} intentos")
-                        raise
-        return wrapper
-    return decorator
-
-# Simular tarea RPA que falla aleatoriamente
-@retry(max_attempts=5, delay=0.05)
-def descargar_reporte(url):
-    """Simula descarga que falla 60% de las veces."""
-    if random.random() < 0.6:
-        raise ConnectionError(f"Timeout en {url}")
-    return {"status": "ok", "data": [1, 2, 3]}
-
-# Pipeline RPA con multiples tareas
-print("=== Pipeline RPA ===")
-random.seed(42)
-
-tareas = [
-    ("Login", lambda: {"status": "ok", "token": "abc123"}),
-    ("Navegar", lambda: {"status": "ok", "page": "reportes"}),
-    ("Descargar", lambda: descargar_reporte("https://api.com/report")),
-    ("Cerrar sesion", lambda: {"status": "ok"}),
-]
-
-for nombre, tarea in tareas:
-    print(f"\\nEjecutando: {nombre}")
-    try:
-        result = tarea()
-        print(f"  Resultado: {result}")
-    except Exception as e:
-        print(f"  ERROR FATAL: {e}")
-        break
-
-print("\\n✓ Pipeline completado")`,
-      expectedOutput: `=== Pipeline RPA ===
-
-Ejecutando: Login
-  Resultado: {'status': 'ok', 'token': 'abc123'}
-
-Ejecutando: Navegar
-  Resultado: {'status': 'ok', 'page': 'reportes'}
-
-Ejecutando: Descargar
-  ✓ Intento 1: exitoso
-  Resultado: {'status': 'ok', 'data': [1, 2, 3]}
-
-Ejecutando: Cerrar sesion
-  Resultado: {'status': 'ok'}
-
-✓ Pipeline completado`,
-      hint: 'Cambia la probabilidad de fallo a 0.9 y observa cuantos intentos necesita',
+    'rpa-advanced': {
+      title: 'Practica preproceso OCR y abstencion',
+      code: `# Practica preproceso + OCR + abstencion (CP-N2-C)
+# Sin Tesseract real: simulamos el contrato del adapter.
+
+def preprocess_meta(img):
+    # img: dict sintetico (no OpenCV)
+    out = dict(img)
+    out["dpi"] = max(out.get("dpi", 72), 200)
+    out["deskew"] = abs(out.get("skew_deg", 0.0)) >= 0.5
+    out["skew_deg"] = 0.0  # tras deskew simulado
+    return out
+
+def fake_ocr(tokens, lang="spa"):
+    # FakeOcrAdapter: devuelve tokens con conf y bbox fijados
+    return [{"text": t["text"], "conf": t["conf"], "bbox": t["bbox"], "lang": lang} for t in tokens]
+
+def gate_field(fields, thr=0.85):
+    # Abstencion por campo critico (no por promedio)
+    weak = [f["name"] for f in fields if f["conf"] < thr]
+    status = "needs_review" if weak else "auto"
+    return status, weak
+
+# 1) Preproceso: eleva DPI y marca deskew
+img = {"w": 1000, "h": 1400, "dpi": 96, "skew_deg": 1.8}
+meta = preprocess_meta(img)
+print("meta", meta["dpi"], meta["deskew"], meta["skew_deg"])
+
+# 2) OCR simulado con confidence
+tokens = fake_ocr([
+    {"text": "FACTURA", "conf": 0.98, "bbox": [10, 10, 120, 40]},
+    {"text": "RUC", "conf": 0.91, "bbox": [10, 50, 50, 70]},
+    {"text": "20123456789", "conf": 0.72, "bbox": [60, 50, 200, 70]},
+])
+print("tokens", [(t["text"], t["conf"]) for t in tokens])
+
+# 3) Gate por campo critico (RUC < 0.85 -> needs_review)
+fields = [
+    {"name": "ruc", "conf": 0.72},
+    {"name": "total", "conf": 0.91},
+]
+status, weak = gate_field(fields)
+print("status", status, "weak", weak)
+print("note: needs_review != fraude")`,
+      expectedOutput: `meta 200 True 0.0
+tokens [('FACTURA', 0.98), ('RUC', 0.91), ('20123456789', 0.72)]
+status needs_review weak ['ruc']
+note: needs_review != fraude`,
+      hint: 'Cambia el conf de RUC a 0.9 y observa como el status pasa a auto',
     },
     'streamlit-dashboards': {
```

### Diff D-02 — Fix PdfReport label (fixes ML-2)

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -61,7 +61,7 @@
   "rapidfuzz-entity": '22. RapidFuzz',
   "computer-vision": '23. CV',
-  "rpa-advanced": '24. RPA+',
+  "rpa-advanced": '24. OCR',
   "streamlit-dashboards": '25. Streamlit',
   "integrator-phase1": '26. Capstone P1',
```

### Diff D-03 — Fix `auto-` prefix hyphenation (fixes I-03)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -29,7 +29,7 @@
-        "**Mini-glosario de intake** (léelo una vez; lo reutilizas en demos y ejercicios). **bbox:** rectángulo `[x0,y0,x1,y1]` que localiza el valor en la página para el revisor. **confidence:** score 0–1 del motor por token o campo. **HITL** (*human-in-the-loop*): cola donde un humano decide. **golden set:** páginas/campos etiquetados a mano para medir exactitud. **adapter:** interfaz común (`real`/`fake`) hacia el motor OCR. **fail-closed:** si hay duda, no auto-aceptas. **coverage_auto:** fracción de docs que pasan sin revisión humana. **preflight:** chequeos (mime, tamaño, orientación) antes del motor.",
+        "**Mini-glosario de intake** (léelo una vez; lo reutilizas en demos y ejercicios). **bbox:** rectángulo `[x0,y0,x1,y1]` que localiza el valor en la página para el revisor. **confidence:** score 0–1 del motor por token o campo. **HITL** (*human-in-the-loop*): cola donde un humano decide. **golden set:** páginas/campos etiquetados a mano para medir exactitud. **adapter:** interfaz común (`real`/`fake`) hacia el motor OCR. **fail-closed:** si hay duda, no autoaceptas. **coverage_auto:** fracción de docs que pasan sin revisión humana. **preflight:** chequeos (mime, tamaño, orientación) antes del motor.",
@@ -107,7 +107,7 @@
-          "Si el mejor score es 180° (aunque sea 0.7), rota la página y *después* llama al motor. OCR "al revés para ahorrar un paso" genera campos basura con confidence engañosa. Si score < 0.5 → manual_orient, no auto-aceptes.",
+          "Si el mejor score es 180° (aunque sea 0.7), rota la página y *después* llama al motor. OCR "al revés para ahorrar un paso" genera campos basura con confidence engañosa. Si score < 0.5 → manual_orient, no autoaceptes.",
@@ -115,7 +115,7 @@
-        "Cada token/campo trae **confidence** entre 0 y 1. El error clásico es promediar: un RUC a 0.55 y un "FACTURA" a 0.99 promedian "bien" y el intake auto-acepta basura. Usa **abstención por campo crítico** (RUC, total): si conf del RUC < 0.85 → `review_queue`. No inventes dígitos ni "corrijas" con un checksum inventado sin política escrita.",
+        "Cada token/campo trae **confidence** entre 0 y 1. El error clásico es promediar: un RUC a 0.55 y un "FACTURA" a 0.99 promedian "bien" y el intake autoacepta basura. Usa **abstención por campo crítico** (RUC, total): si conf del RUC < 0.85 → `review_queue`. No inventes dígitos ni "corrijas" con un checksum inventado sin política escrita.",
@@ -242,7 +242,7 @@
-        "La validación **cross-field** compara campos entre sí: `abs(sum(líneas) - total) > 0.01` → `total_mismatch`. RUC `None` → `ruc_missing`. Confidence de RUC bajo umbral → `ruc_low_conf`. Las reasons se **acumulan** en una lista; el documento no se auto-acepta si la lista no está vacía.",
+        "La validación **cross-field** compara campos entre sí: `abs(sum(líneas) - total) > 0.01` → `total_mismatch`. RUC `None` → `ruc_missing`. Confidence de RUC bajo umbral → `ruc_low_conf`. Las reasons se **acumulan** en una lista; el documento no se autoacepta si la lista no está vacía.",
@@ -245,7 +245,7 @@
-        "En batch nocturno, un doc en cola no debe detener el archivo: marcas `human_queue`, logueas reasons y pasas al siguiente. Fail-closed de *calidad* (no auto-aceptar basura) no es lo mismo que fail-stop de *throughput* (tirar el batch entero).",
+        "En batch nocturno, un doc en cola no debe detener el archivo: marcas `human_queue`, registras las reasons en el log y pasas al siguiente. Fail-closed de *calidad* (no autoaceptar basura) no es lo mismo que fail-stop de *throughput* (tirar el batch entero).",
```

### Diff D-04 — Fix `re-` prefix hyphenation (fixes I-04)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -27,7 +27,7 @@
-        "Llegas desde el adaptador web de la sección anterior (S23): un download verificado (PDF/PNG sintético) es la entrada típica del intake. Aquí no re-scrapeas el portal — **consumes el artefacto** y lo conviertes en campos con evidencia. Construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no "cerrar" casos por score.",
+        "Llegas desde el adaptador web de la sección anterior (S23): una descarga verificada (PDF/PNG sintético) es la entrada típica del intake. Aquí no rescrapeas el portal — **consumes el artefacto** y lo conviertes en campos con evidencia. Construyes el **document intake** de CP-N2-C: imagen sintética → preproceso → adapter OCR (confidence + bbox) → normalización a schema → validación cross-field → golden set por campo. En un backoffice sintético de facturas en Lima, el objetivo es encolar revisión, no "cerrar" casos por score.",
@@ -46,7 +46,7 @@
-        "Borde útil: si el sesgo es casi nulo (`|skew| < 0.5°`), no marques deskew "por si acaso"; un flag falso ensucia la auditoría. Si el DPI ya es 300, `max(dpi, 200)` lo deja intacto. El preproceso es barato frente a re-OCR: invierte ahí antes de culpar al motor.",
+        "Borde útil: si el sesgo es casi nulo (`|skew| < 0.5°`), no marques deskew "por si acaso"; un flag falso ensucia la auditoría. Si el DPI ya es 300, `max(dpi, 200)` lo deja intacto. El preproceso es barato frente a reOCR: invierte ahí antes de culpar al motor.",
@@ -151,7 +151,7 @@
-        "La evidencia no es el label "RUC" en negrita: es el **bbox del valor** (los dígitos). El revisor en UI resalta ese rectángulo sin re-OCRizar. Si solo guardas el bbox del label, el humano no ve el número dudoso y pierde tiempo.",
+        "La evidencia no es el label "RUC" en negrita: es el **bbox del valor** (los dígitos). El revisor en UI resalta ese rectángulo sin re-OCRizar (sin volver a pasar el motor). Si solo guardas el bbox del label, el humano no ve el número dudoso y pierde tiempo.",
@@ -319,7 +319,7 @@
-        "Si el OCR falla con un binario corrupto (`ocr_fail`), el fallback operativo es `human_rescan` (re-escaneo o tipeo asistido) — no reintentar 100 veces el mismo archivo. Reintentar en bucle quema CPU y no mejora un PDF roto.",
+        "Si el OCR falla con un binario corrupto (`ocr_fail`), el fallback operativo es `human_rescan` (reescaneo o tipeo asistido) — no reintentar 100 veces el mismo archivo. Reintentar en bucle quema CPU y no mejora un PDF roto.",
```

### Diff D-05 — Fix `y` → `e` concord (fixes I-06)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -901,7 +901,7 @@
-          "Evidencia KV: lines=['RUC: 20123456789','Total: 150.00'] con bboxes={RUC:[0,0,10,10], Total:[0,20,40,30]}. Parsea KV (clave:valor), adjunta bbox del **valor** (no del label) a cada field y imprime lista de (name, value, bbox) ordenada por name. Pass: [('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])].",
+          "Evidencia KV: lines=['RUC: 20123456789','Total: 150.00'] con bboxes={RUC:[0,0,10,10], Total:[0,20,40,30]}. Parsea KV (clave:valor), adjunta bbox del **valor** (no del label) a cada field e imprime lista de (name, value, bbox) ordenada por name. Pass: [('RUC', '20123456789', [0, 0, 10, 10]), ('Total', '150.00', [0, 20, 40, 30])].",
```

### Diff D-06 — Standardise `vs` → `vs.` in prose (fixes I-05)

Apply to lines 33, 247 (×2), 283, 459, 872, 881, 1067, 1487, 1501.

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -30,7 +30,7 @@
-        "Orden: **T1 Imagen** (DPI, deskew, ruido, orientación) → **T2 OCR** (idiomas, layout, KV/tablas) → **T3 Extracción** (schema, validación, cola) → **T4 Evaluación** (golden set, privacidad, hostiles, fallback). Frontera real/fake: TesseractAdapter vs FakeOcrAdapter nunca se confunden en contract tests. Más adelante, el texto OCR alimenta endpoints de IA (S25) como entrada **no confiable** — aquí aprendes a no inventar dígitos ni cerrar por score.",
+        "Orden: **T1 Imagen** (DPI, deskew, ruido, orientación) → **T2 OCR** (idiomas, layout, KV/tablas) → **T3 Extracción** (schema, validación, cola) → **T4 Evaluación** (golden set, privacidad, hostiles, fallback). Frontera real/fake: TesseractAdapter vs. FakeOcrAdapter nunca se confunden en contract tests. Más adelante, el texto OCR alimenta endpoints de IA (S25) como entrada **no confiable** — aquí aprendes a no inventar dígitos ni cerrar por score.",
@@ -244,7 +244,7 @@
-        "Caso sintético del lab (mismos números en teoría, demo y transferencia): total 150.0 vs líneas [100, 50] y RUC confiable → `auto` con reasons vacías; total 150.0 vs [100, 40], ruc None y conf 0.5 → `needs_review` con `total_mismatch`, `ruc_missing` y `ruc_low_conf`.",
+        "Caso sintético del lab (mismos números en teoría, demo y transferencia): total 150.0 vs. líneas [100, 50] y RUC confiable → `auto` con reasons vacías; total 150.0 vs. [100, 40], ruc None y conf 0.5 → `needs_review` con `total_mismatch`, `ruc_missing` y `ruc_low_conf`.",
@@ -280,7 +280,7 @@
-        "Un **golden set** es un conjunto pequeño de páginas/campos etiquetados a mano (pred vs true) que sirve de "verdad de laboratorio". Mides exactitud **por campo** (ruc, total, fecha), no un accuracy global que esconde fallos caros. Caer en RUC es más grave que errar una glosa opcional: cada campo crítico tiene su propio SLO.",
+        "Un **golden set** es un conjunto pequeño de páginas/campos etiquetados a mano (pred vs. true) que sirve de "verdad de laboratorio". Mides exactitud **por campo** (ruc, total, fecha), no un accuracy global que esconde fallos caros. Caer en RUC es más grave que errar una glosa opcional: cada campo crítico tiene su propio SLO.",
@@ -456,7 +456,7 @@
-        description: "Compara total vs suma de líneas: ok si cuadra, needs_review si no (sin label de fraude).",
+        description: "Compara total vs. suma de líneas: ok si cuadra, needs_review si no (sin label de fraude).",
@@ -869,7 +869,7 @@
-          "Filas de datos en tabla sintética: t=[['H1','H2'],['a','b']]. La fila 0 es header; imprime el número de filas de datos (len(t)-1). Contar el header como ítem infla sumas vs total en validación. Pass: 1.",
+          "Filas de datos en tabla sintética: t=[['H1','H2'],['a','b']]. La fila 0 es header; imprime el número de filas de datos (len(t)-1). Contar el header como ítem infla sumas vs. total en validación. Pass: 1.",
@@ -878,7 +878,7 @@
-        feedback: "len(t) incluye header (2); el contrato pide solo filas de datos (1) para no inflar sumas vs total.",
+        feedback: "len(t) incluye header (2); el contrato pide solo filas de datos (1) para no inflar sumas vs. total.",
@@ -1064,7 +1064,7 @@
-        feedback: "Suma 9 vs total 10 supera 0.01 → needs_review. Siempre 'auto' era el defecto del starter (anti-patrón).",
+        feedback: "Suma 9 vs. total 10 supera 0.01 → needs_review. Siempre 'auto' era el defecto del starter (anti-patrón).",
@@ -1484,7 +1484,7 @@
-      { criterion: "Código legible, funciones puras y límites claros (real vs fake adapter)", weight: "10%" },
+      { criterion: "Código legible, funciones puras y límites claros (real vs. fake adapter)", weight: "10%" },
@@ -1498,7 +1498,7 @@
-        question: "Un mismatch total vs suma de líneas en la validación cross-field implica:",
+        question: "¿Qué implica un mismatch entre el total y la suma de líneas en la validación cross-field?",
```

### Diff D-07 — Split `jobRelevance` mega-paragraph (fixes I-08)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -12,7 +12,11 @@
   jobRelevance:
-    "En un backoffice de Lima (facturas, boletas y PDFs de proveedores), el cuello de botella no es "leer letras": es convertir un artefacto (PNG/PDF sintético en el lab) en **campos con evidencia** que un humano pueda auditar en minutos. El **document intake** de CP-N2-C modela ese camino: preproceso → OCR con confidence y bbox → schema → validación cross-field → cola HITL y métricas por campo. El OCR se expone con un contrato común `real`/`fake` para tests; abstenerse bajo confidence es control de calidad, no veredicto de fraude. El valor profesional es **encolar bien** — no "cerrar" casos por score ni inventar dígitos de RUC.",
+    "En un backoffice de Lima (facturas, boletas y PDFs de proveedores), el cuello de botella no es "leer letras": es convertir un artefacto (PNG/PDF sintético en el lab) en **campos con evidencia** que un humano pueda auditar en minutos.\n\nEl **document intake** de CP-N2-C modela ese camino: preproceso → OCR con confidence y bbox → schema → validación cross-field → cola HITL y métricas por campo. El OCR se expone con un contrato común `real`/`fake` para tests; abstenerse bajo confidence es control de calidad, no veredicto de fraude.\n\nEl valor profesional es **encolar bien** — no "cerrar" casos por score ni inventar dígitos de RUC.",
```

> NOTE: verify whether `jobRelevance` is rendered as a single string in `SectionView.tsx`. If the renderer splits on `\n\n`, the rewrite above works; if it renders as a single `<p>`, add the `\n`-splitting in the renderer or change the type to an array of strings (matching `paragraphs[]` in theory blocks).

### Diff D-08 — Convert `youDo.context` arrow-chain to a numbered list (fixes I-09)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -1401,7 +1401,12 @@
     context:
-      "Cierra el arco S23→S24: el artefacto descargado (meta de imagen + tokens OCR simulados) entra al **document intake** de CP-N2-C. Procesa al menos 3 "documentos" sintéticos: preproceso meta → extracción KV → normalización a schema (RUC 11, montos PE con coma decimal, fecha ISO) → validación cross-field → métricas por campo y cola de revisión. Sin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status y reasons[] por doc, más acc_ruc / acc_total / coverage_auto sobre un mini golden (≥2 filas).",
+      "Cierra el arco S23→S24: el artefacto descargado (meta de imagen + tokens OCR simulados) entra al **document intake** de CP-N2-C. Procesa al menos 3 "documentos" sintéticos siguiendo estos pasos:\n\n1. Preproceso de la meta de imagen.\n2. Extracción KV.\n3. Normalización a schema (RUC 11 dígitos, montos PE con coma decimal, fecha ISO).\n4. Validación cross-field.\n5. Métricas por campo y cola de revisión.\n\nSin PII real; sin label de fraude. Criterio de aceptación: un script o notebook que, al correr, imprima status y `reasons[]` por doc, más `acc_ruc` / `acc_total` / `coverage_auto` sobre un mini golden (≥2 filas).",
```

### Diff D-09 — Rewrite self-check Q2 stem with `¿...?` (fixes I-07)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -1498,7 +1498,7 @@
       {
-        question: "Un mismatch total vs suma de líneas en la validación cross-field implica:",
+        question: "¿Qué implica un mismatch entre el total y la suma de líneas en la validación cross-field?",
         options: ["Fraude probado", "Cola de revisión / corrección", "Borrar el doc", "Subir DPI"],
         correctIndex: 1,
         explanation:
```

### Diff D-10 — Strip `# CASO-LIM-024` from starterCode first-line comments (fixes ML-4 / I-12, optional)

```diff
--- a/src/lib/course/sections/s24-rpa-advanced.ts
+++ b/src/lib/course/sections/s24-rpa-advanced.ts
@@ -527,7 +527,6 @@
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-024 · DPI mínimo 200 para OCR legible
 # DEFECT: deja el escaneo en 96 dpi (tipografía pequeña se rompe)
 dpi = 96
 print(dpi)
```
Apply to all 24 We Do starterCode blocks. (Alternatively, rewrite `# CASO-LIM-024 · <topic>` to a learner-facing Spanish comment like `# Caso de borde: DPI mínimo 200 para OCR legible` — this keeps the explanation but drops the internal taxonomy tag.)

---

## 8. Recommended Priority Order for fixing

| Priority | Diff(s) | Severity | Effort | Description |
|----------|---------|----------|--------|-------------|
| **P0** | D-01 | H (ML-1) | 30 min | Rewrite the `'rpa-advanced'` playground demo in `SectionView.tsx` to teach preproceso + OCR + abstención instead of RPA retries. **Highest learner-facing impact** — the playground is the most engaging surface of the section. |
| **P0** | D-02 | M (ML-2) | 2 min | Change PdfReport label `24. RPA+` → `24. OCR`. |
| **P1** | D-03 | M (I-03) | 5 min | Fix `auto-aceptas` → `autoaceptas` (5 prose occurrences). |
| **P1** | D-04 | M (I-04) | 5 min | Fix `re-scrapeas` → `rescrapeas`, `re-OCR` → `reOCR`, `re-OCRizar` → `reOCRizar`, `re-escaneo` → `reescaneo`. Also fix `download verificado` → `descarga verificada` and `logueas reasons` → `registras las reasons en el log`. |
| **P1** | D-05 | M (I-06) | 1 min | Fix `field y imprime` → `field e imprime` (Y_E_O_U rule). |
| **P2** | D-06 | L (I-05 + I-07) | 10 min | Standardise `vs` → `vs.` (10 prose occurrences) and rewrite self-check Q2 stem with `¿...?`. |
| **P2** | D-07 | M (I-08) | 10 min | Split `jobRelevance` mega-paragraph into 3 (verify renderer handles `\n\n`). |
| **P2** | D-08 | M (I-09) | 5 min | Convert `youDo.context` arrow-chain to numbered list. |
| **P3** | D-09 | L (I-07) | 1 min | (Combined with D-06.) |
| **P3** | D-10 | L (ML-4 / I-12) | 20 min | Strip or rewrite `# CASO-LIM-024` tags in 24 starterCode comments. |
| **P4** | — | L | — | Optional: gloss English-coded vocabulary (`golden set`, `HITL`, `fail-closed`, `coverage_auto`, `preflight`) with Spanish equivalents in parens on first mention. |
| **P4** | — | structural | coordinated | Rename `id: "rpa-advanced"` → `id: "ocr-document-ai"` and file `s24-rpa-advanced.ts` → `s24-ocr-document-ai.ts`. Requires updates to `src/lib/course/index.ts`, `prisma/seed.ts`, `src/components/course/SectionView.tsx` (demos key + any sectionId-keyed maps), `src/components/course/PdfReport.tsx`, `src/lib/glossary/terms.ts`, `scripts/generate_seed_questions.py`, `scripts/generate_sections.py`, `course-state/curriculum_hardening/SECTION_PROGRESS_LEDGER.json`, `course-state/curriculum_hardening/GRAPH_MEMORY.json`, `course-state/curriculum_hardening/dossiers/S24_STORM.json`, `course-state/curriculum_hardening/paragraph_analysis/S24_PARAGRAPHS.md`. Coordinate with the parallel P14 fixes flagged in S05/S06/S07/S09/S11/S12/S13. |

**Estimated total effort for P0+P1+P2**: ~75 minutes of editing + 30 min of cross-component verification.

---

## 9. Graph Memory Update Notes

For the shared `course-state/curriculum_hardening/GRAPH_MEMORY.json`:

| Node | Field | Old | New |
|------|-------|-----|-----|
| `sections["s24-rpa-advanced"]` | `retarget_debt` | (none) | `["SectionView.tsx:demos['rpa-advanced']", "PdfReport.tsx:SECTION_NAMES['rpa-advanced']", "id='rpa-advanced' (URL hash)", "filename s24-rpa-advanced.ts"]` |
| `sections["s24-rpa-advanced"]` | `audit_score_s24` | (none) | `7.5 / 10` |
| `sections["s24-rpa-advanced"]` | `audit_date_s24` | (none) | `2026-07-25` (or current date) |
| `sections["s24-rpa-advanced"]` | `audit_report` | (none) | `/home/z/my-project/audits/S24_report.md` |

**Edges to add** (graph engineering):

- `S24 —retarget_debt_in—> S05/S06/S07/S09/S11/S12/S13` — same pattern (V2 id/filename/playground demo left over after V3 retarget). The Fixer should treat this as a single coordinated change across 7+ sections.
- `S24 —cross_section_pattern—> S05/S06/S07/S09/S11/S12/S13` — the `'rpa-advanced'` / `'numpy'` / `'visualization'` / `'testing'` / `'performance'` / `'data-acquisition'` / `'rpa-automation'` keys in `SectionView.tsx:demos` map all carry V2 demos that contradict V3 content. Recommend a single PR that rewrites all 7+ playground entries in one pass (the Fixer already has the pattern from S06/S07/S09/S13 reports).
- `S24 —ethics_spine—> S03/S05/S09/S11/S13` — `needs_review ≠ fraude` / `auto_fraud_label=False` / fail-closed ethics posture is consistent across this cluster.
- `S24 —capstone_binding—> CP-N2-C` — document intake capstone; predecessor S23 (Playwright download), successor S25 (IA endpoints consume OCR text as untrusted input).

**Cross-section pattern for the Fixer**:

> The `'rpa-advanced'` key in `SectionView.tsx:2051` is one of at least 7 stale V2 playground demos retargeted in V3 (the others are `'numpy'`, `'visualization'`, `'testing'`, `'performance'`, `'data-acquisition'`, `'rpa-automation'`). A single coordinated PR that rewrites all 7 demos — using the same scaffold (preproceso + adapter + gate + 3-line stdout + Spanish hint) — would clear ~70% of the meta-leak debt flagged across S05–S13 audits in one shot.

**Heuristic refinement for other auditors**:

- The `meta_leak` regex should be tightened to `\b(TODO|FIXME|XXX|TBD|WIP)\b` (case-sensitive) to avoid Spanish false positives ("todo lo demás", "wip" as example commit message). Already noted in S01.
- The `det_noun_concord?` heuristic should whitelist masculine anglicisms ending in 'a' (`schema`, `pipeline`, `dashboard`, `framework`) — false positives on "un schema", "el dashboard" etc.
- The `unbalanced_delim` heuristic should mask `p. ej.` abbreviations before splitting, otherwise every paragraph that uses `p. ej.` inside parens generates false positives.

---

## 10. Method Note (research-backed heuristics applied)

Following `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

| Method | Implementation | Output |
|--------|----------------|--------|
| **Fernández-Huerta (1959)** | `FH = 206.84 − 60·(syl/word) − 1.02·(words/sentence)` per sentence and per paragraph | Section mean FH 82.31 ("fácil" band); per-record range 2.56 (short criterion) – 95+ (short callouts). |
| **Szigriszt-Pazos / INFLESZ** | `INFLESZ = 206.835 − 62.3·(syl/word) − (words/sentence)` | Section mean INFLESZ 78.15. |
| **WPS (words per sentence)** | mean = 10.51 (healthy for technical Spanish; subplan target 15–32). | 1 sentence > 32 w (jobRelevance opener 40 w). |
| **SPW (syllables per word)** | mean = 1.897 (within healthy range for Spanish tech prose). | — |
| **13-rule pedagogical heuristics** | run-on >45 w; long >32 w; missing terminal `.?!`; missing `¿`/`¡`; unbalanced delimiters; repeated word; rough DET–NOUN concord; English-dominant; meta-leak signals; gerund pileup ≥3; high comma density; paragraph = 1 long sentence; anaphoric monotony; space-before-punct; double space. | See §3 (I-16). |
| **LanguageTool `es` (public API)** | 1 chunk of 16 891 chars; 553 raw matches; 517 MORFOLOGIK false positives on tech identifiers; 36 non-MORFOLOGIK matches, of which 8 are real Spanish findings (1 `Y_E_O_U`, 1 `AUTO_NO_SEPARADO`, 5 `PUNTO_EN_ABREVIATURAS` on `vs`, 1 false-positive `VOSEO` on `validate(doc)`). | Real findings folded into I-03, I-05, I-06. |

**Heuristic scan summary**:
- 120 Spanish prose records extracted (182 raw records, 62 filtered as English-only or <3 chars).
- 248 sentences analyzed.
- 2 607 Spanish words.
- 1 run-on >45 w: **0** (no run-ons).
- 1 long >32 w: 1 (jobRelevance opener, 40 w).
- 0 meta-leak signals in prose (only structural meta-leaks in `SectionView.tsx` / `PdfReport.tsx`).
- 0 missing `¿`/`¡` in actual prose (the 1 flagged hit is a sentence-splitter artifact).
- 0 gerund pileups.
- 0 anaphoric monotony paragraphs.
- 0 unbalanced delimiters in actual prose (4 flagged hits are sentence-splitter artifacts on `p. ej.`).

**Aggregate verdict**: S24 prose is in the "fácil" band (FH 82.31), with a healthy WPS (10.51) and SPW (1.897). The single readability hot-spot is the `jobRelevance` opener (FH 52.0). The grammar findings are systematic but low-severity (prefix hyphenation, abbreviation period, concord rule). No spelling errors. No prose-level developer-meta leaks. The dominant defect is structural (`SectionView.tsx` playground demo leak) and is shared with 6+ other retargeted sections.

---

**This is the complete Explorer report for Section 24. Ready for the Fixer prompt.**
