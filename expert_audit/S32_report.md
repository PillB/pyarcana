# PyArcana Curriculum Audit — Section 32

> **Task ID:** S32 · **Agent:** Curriculum Auditor (general-purpose)
> **Live URL:** <https://pillb.github.io/pyarcana/#microservices>
> **Source file:** `src/lib/course/sections/s32-microservices.ts` (2,386 lines)
> **Repository:** <https://github.com/PillB/pyarcana> (commit `f352da3`)
> **Phase:** 2 — Senior · **Estimated hours:** 18 · **Index:** 32

---

## 1. Section Identification & Scope

| Field | Value (from `src/lib/course/sections/s32-microservices.ts:3-13`) |
|-------|------------------------------------------------------------------|
| `id` (legacy) | `"microservices"` |
| `index` | `32` |
| `title` | `"Feature engineering y pipelines sin leakage"` |
| `shortTitle` | `"Features sin leakage"` |
| `tagline` | `"tabla de features versionada con train≡serve, sin futuro ni labels de decisión · Ritmo sugerido: ~10–12 h núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew/versionado hacia S33"` |
| `estimatedHours` | `18` |
| `level` | `"Competente a experto"` |
| `phase` | `2` |
| `icon` | `"TableProperties"` |
| `accentColor` | `bg-gradient-to-br from-indigo-500 to-violet-800` |

**Section identity confirmation** — Per `src/lib/course/index.ts:35`, `section32` is imported from `s32-microservices.ts`; per the live home page sidebar (card #32) the section is rendered as **"Features sin leakage"** with tagline "tabla de features versionada con train≡serve, sin futuro ni labels de decisión…". The live URL `https://pillb.github.io/pyarcana/#microservices` (legacy slug) routes to the same page (verified live on 2025-07-25 via `agent-browser`).

**File-name / id mismatch (P0 root cause)** — As with S06 (`id:"numpy"`, content about `list/dict/set`), S09 (`id:"visualization"`, content about exceptions), S10 (`id:"sklearn"`, content about packaging), S13 (`id:"rpa-automation"`, content about Evidence Dashboard), and S15 (`id:"stdlib-deep"`, content about pandas ingesta), Section 32 retains the legacy `id: "microservices"` while its V3-retargeted content is fully about **feature engineering y pipelines sin leakage**. The V3 roadmap (`learning_roadmap_52_V3.md:472`) explicitly places "S32 — Feature engineering y pipelines sin leakage" at this slot; the older master roadmap (`el_arte_de_python_roadmap_maestro_52_secciones.md:294`) still says "Sección 32 — Computer Vision Workflows" — a third, even older mismatch. The legacy id cascades downstream into two HIGH-severity leaks (see §4).

**Content inventory audited (all tabs):**

| Tab | Items audited |
|-----|---------------|
| Theory | 9 subtopic blocks (`S32-T1-A` … `S32-T4-B`, including the opening "Tabla de features versionada sin leakage" + "Diccionario mínimo" blocks), 24 paragraphs, 8 code demos, 9 callouts (incl. opening Gate) |
| I Do (`iDo`) | 1 `intro` + 8 `steps` (demos), each with `description`, `why`, code, output |
| We Do (`weDo`) | 1 `intro` + 24 `steps` (8 subtopics × 3 kinds: guided → independent → transfer), each with `instruction`, `hint`, `hints[]`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` |
| You Do (`youDo`) | 1 `context` + 4 `objectives` + 5 `requirements` + 65-line `starterCode` + `portfolioNote` + 7-row `rubric` (weights sum to 100 %, plus 1 bonus row) |
| Self-check (`selfCheck`) | 10 MCQs with 4 options each + `explanation` |
| Resources | 7 docs, 2 books, 4 courses |

**Source-file extraction summary** (from `_s32_extract.py`, output `S32_metrics.json`):

| Metric | Value |
|--------|-------|
| Prose records extracted | 200 |
| Total sentences | 282 |
| Total words | 3 598 |
| Aggregate Fernández-Huerta | **80.96** (band `fácil`) |
| Aggregate INFLESZ (Szigriszt-Pazos) | **77.20** (band `bastante_fácil`) |
| Aggregate words / sentence | **12.76** (under the 15–32 target band; on the easy side) |
| Aggregate syllables / word | **1.792** |
| Band distribution | muy_fácil 108 · fácil 60 · bastante_fácil 41 · normal 27 · bastante_difícil 22 · difícil 14 · muy_difícil 10 |
| Raw pedagogical-heuristic findings | 172 (1 H, 134 M, 37 L) |
| Raw LanguageTool `es` matches | 909 (855 `MORFOLOGIK_RULE_ES` false-positives on tech terms, 54 non-spelling → ~5 real) |

---

## 2. Executive Summary of Quality

**Composite score: 7.4 / 10**

### Verdict
Pedagogically **gold-standard** (faithful I Do / We Do / You Do / self-check; 8 demos × 24 exercises × capstone `CP-N3-B`; honest about PII sintético / no PII real; Peruvian context with Lima–Arequipa ficticio + Red Andina sintético; explicit anti-fraud / anti-parentesco guardrail repeated across Theory callouts, We Do feedback, You Do rubric and self-check #4; backward link to S31 grafo de evidencia and forward link to S33 baseline). Readability is healthy for technical Spanish (FH 80.96, "fácil"; WPS 12.76 — on the easy side of the 15–32 target band, which is reasonable for a Phase-2 senior section that introduces many technical English loanwords). The grammar surface is mostly clean: only **~5 real** grammar/style findings after filtering 855 LT spelling false positives (mostly `MORFOLOGIK_RULE_ES` on identifiers such as `feature`, `serve`, `train`, `median`, `skew`, `leakage`, `silent_fill`, `catalog`, `fit`, `transform`, `vocab`, `cpn3b`, `fs-vN`).

### What holds the score down
1. **Two HIGH meta-leaks** identical in pattern to S06/S09/S10/S13/S15 — the legacy `id: "microservices"` causes `SectionView.tsx` to load the wrong interactive editor (`CircuitBreaker` / microservices simulation) into a Feature Engineering section, and `PdfReport.tsx` to label the section "32. Microsvc" in the printable PDF. Both are visible to learners on the live site today (confirmed via `agent-browser` read of `https://pillb.github.io/pyarcana/#microservices` — line 752: `"Practica health checks y circuit breaker"`, line 860: `"# Simulacion de microservicios: health checks y circuit breaker"`).
2. **`CASO-LIM-032` internal taxonomy marker** is repeated 24× as the first line of every We Do `starterCode` (`# CASO-LIM-032 · feature catalog types` …) and 3× in learner-facing prose (`instruction`, `context`). Learners see this internal case-limit code at the top of every exercise file. Same P0 pattern flagged for S10 (`CASO-LIM-010`, 31×) and S15 (`CASO-LIM-015`, 24×).
3. **Subtopic IDs (`S32-T1-A`, `S32-T1-A-E1`, …) leak into 62 learner-facing prose fields**: 8 callout `content` fields (`"S32-T1-A: catálogo + keys. Incumplimiento → …"`), 24 `instruction` fields (prefix `"S32-T1-A-E1 · …"`), and 24 `feedback` fields (prefix `"S32-T1-A-E1: …"`). These are authoring scaffolding IDs, not learner-facing labels.
4. **5 long sentences (32+ words)** in instruction text (lines 9, 1076, 1241, 1439, 1641) — none cross the 45-word run-on threshold, but two are also single-sentence paragraphs (the tagline at L9 and the E3 instruction at L1641).
5. **2 `vs` without period** (lines 22 and 2242) — Spanish style prefers `vs.` (RAE `DRAE` lemma `vs.` / `versus`). LanguageTool `PUNTO_EN_ABREVIATURAS` agrees.
6. **2 `y indicator`** (hints at line 812, 814) — Spanish conjunction `y` → `e` before an /i/ sound: should be `e indicator` (LanguageTool `Y_E_O_U`).
7. **1 missing space after comma inside the half-open interval** at line 455: `[t-w,t),` should be `[t-w, t),` (LanguageTool `COMMA_PARENTHESIS_WHITESPACE`).

### Strengths
- Triadic contract per subtopic (teoría → demo I Do → 3 ejercicios en escalera guiada/independiente/transferencia in We Do).
- Honest about environment limits ("Python puro para ver el contrato sin magia de librería y sin riesgo de APIs no instaladas en el workbench"; "en producción, joblib/pickle cumplen el mismo rol que este JSON").
- No fraud / parentesco / auto-decision claims: `score ≠ culpa` repeated in opening map ("Features de contacto o shared address **no** son etiqueta de fraude ni parentesco"), T2-A callout, We Do feedback (`"el grafo no autoriza parentesco/fraude; solo topología observada en t"`), You Do rubric ("Privacidad / sin PII real / sin secretos / sin inferencia de fraude", 20 %) and self-check #4 ("Es red flag de leakage").
- Strong forward link to S33 (`fs-vN` is the "contrato de entrada del baseline de S33"; "no se entrena el baseline S33 hasta corregir el split") and backward link to S31 ("continuación del grafo de evidencia de S31"; "puente S31").
- Fail-closed vocabulary (`REQUEST_*` vs `REJECT_*`) is consistently used and explicitly taught ("Ausencia ≠ incumplimiento" in the diccionario callout).
- Capstone ships with 7 stubbed functions (`window_count`, `fit_median`, `graph_feats`, `time_group_split`, `leak_scan`, `skew_alert`) and clear Acceptance checks at the bottom.
- Rubric weights sum to 100 % (25+20+20+15+10+10) plus one explicit bonus row.

---

## 3. Detailed Issue Registry

> Severity legend: **H** = High (P0, blocks learning or visible defect) · **M** = Medium (P1, redaction / pedagogy) · **L** = Low (P2, polish).

### H-1 · Legacy `id: "microservices"` loads the wrong interactive demo (P0)
- **Location:** `src/lib/course/sections/s32-microservices.ts:4` (`id: "microservices"`) + `src/components/course/SectionView.tsx:4046` (`const demo = demos[sectionId]`) + `src/components/course/SectionView.tsx:2558-2644` (the `'microservices'` demo block).
- **Evidence (live site, confirmed 2025-07-25):** `agent-browser read https://pillb.github.io/pyarcana/#microservices` returns at line 746 `### Pruébalo tú mismo`, line 752 `"Practica health checks y circuit breaker"`, line 860 `# Simulacion de microservicios: health checks y circuit breaker`, line 864 `class CircuitBreaker:`.
- **Pedagogical impact:** A learner opening Section 32 (Feature engineering y pipelines sin leakage) sees an unrelated Circuit Breaker / microservices simulation in the "Pruébalo tú mismo" panel. The demo is also missing Spanish accents (`Simulacion`, `despues`), compounding the credibility hit. This is a direct violation of train≡serve pedagogy: the demo does NOT exercise any of the 8 subtopic contracts (catalog, missing/scale, graph feats, half-open window, fit→transform, JSON persist, split, leakage scan).
- **Severity rationale:** Same legacy-id drift pattern as S06/S09/S10/S13/S15. Visible to every learner who reaches the bottom of the Theory tab. Confirmed live.

### H-2 · `PdfReport.tsx` mislabels Section 32 as "32. Microsvc" (P0)
- **Location:** `src/components/course/PdfReport.tsx:72` (`microservices: '32. Microsvc'`).
- **Evidence:** Direct grep match.
- **Pedagogical impact:** Any printable PDF certificate / progress report for Section 32 will be labeled "32. Microsvc" — wrong topic. A learner completing the CP-N3-B capstone (feature engineering) gets a PDF that says they completed "Microsvc". This is a portfolio/interview-facing artifact.
- **Severity rationale:** Same class as H-1; both stem from the legacy id mismatch.

### H-3 · `CASO-LIM-032` taxonomy leaks into 24 `starterCode` first-line comments + 3 prose fields (P0)
- **Location:** 24 `starterCode.code` fields (lines 617, 659, 717, 776, 822, 896, 970, 1018, 1088, 1160, 1200, 1253, 1315, 1373, 1451, 1528, 1572, 1653, 1735, 1784, 1870, 1955, 1999, 2083) + 3 prose fields (`instruction` L605, `instruction` L884, `context` L2155).
- **Evidence:** `rg -c "# CASO-LIM-032 ·" src/lib/course/sections/s32-microservices.ts` → 24. `rg -n "CASO-LIM-032" src/lib/course/sections/s32-microservices.ts | wc -l` → 120 (incl. instruction text, edgeCases, starterCode comments).
- **Pedagogical impact:** Learners see `# CASO-LIM-032 · feature catalog types` as the very first line of every We Do exercise file. "CASO-LIM" is an internal taxonomy code (case-limit) that has no learner-facing definition anywhere in the section. Same P0 pattern flagged for S10 (CASO-LIM-010 × 31) and S15 (CASO-LIM-015 × 24). Additionally, `instruction` text uses `CASO-LIM-032-1A` / `CASO-LIM-032-1B` etc as if they were meaningful learner IDs.
- **Severity rationale:** Visible in every We Do editor. Breaks the "pure teacher voice" rule for code comments.

### H-4 · Subtopic IDs leak into 62 learner-facing prose fields (P0)
- **Location:** 8 callout `content` fields (L89, L122, L161, L195, L264, L299, L335, L366) + 24 `instruction` fields (L605, L647, L705, L764, L810, L884, L958, L1006, L1076, L1148, L1188, L1241, L1303, L1361, L1439, L1516, L1560, L1641, L1723, L1772, L1858, L1943, L1987, L2071) + 24 `feedback` fields + 24 `tests` strings + 6 `edgeCases` items mentioning `CASO-LIM-032-XX es sintético`.
- **Evidence:** Heuristic `subtopic_id_in_prose` × 62 from `S32_metrics.json`. Sample (L89 callout `content`): `"S32-T1-A: catálogo + keys. Incumplimiento → REJECT_UNKNOWN_FEATURE; falta catálogo → REQUEST_CATALOG."`.
- **Pedagogical impact:** Subtopic IDs (`S32-T1-A`, `S32-T1-A-E1`) are authoring scaffolding for the curriculum designer, not learner-facing labels. Embedding them as the first token of every callout and every exercise instruction increases cognitive load without pedagogical benefit. The pattern is consistent with the curriculum's `subtopicId` field, which already carries this metadata.
- **Severity rationale:** Same pattern flagged for S15 (callout contents `S15-T1-A: ...`). P1-level here because the IDs are short and unobtrusive, but they are leakage of internal structure.

### M-1 · Tagline is a single 40-word sentence without terminal punctuation (P1)
- **Location:** L9 `tagline` (`"tabla de features versionada con train≡serve, sin futuro ni labels de decisión · Ritmo sugerido: ~10–12 h núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew/versionado hacia S33"`).
- **Evidence:** Heuristic `long_sentence` (wc=40), `single_sentence_paragraph`, `missing_terminal`. FH=73.04 ("fácil"); WPS=40.
- **Pedagogical impact:** The tagline shows on the home-page card and the section header. 40 words without a period is a cognitive-load issue on a small UI surface; the "Ritmo sugerido" payload is a planning aside that should be visually separated from the topic description.
- **Severity rationale:** Same pattern flagged for S15 tagline (FH 38.2 for jobRelevance; here it's the tagline).

### M-2 · Five long sentences (32–47 words) in We Do instructions (P1)
- **Location:**
  - L1076 `instruction` (`S32-T2-A-E3`): wc=39, FH=47.06 — "Fail-closed sobre features de grafo: recalcula shared/degree/path desde attrs y neighbors; topología limpia y uses_label False → `CONTINUE`; label…"
  - L1241 `instruction` (`S32-T2-B-E3`): wc=36, FH=85.42 — "Fail-closed temporal: recompute includes_t y count con half-open `[t−w, t)`; si el flag o el cómputo marcan t incluido → `REJECT_FUTURE_TS`; sin w…"
  - L1439 `instruction` (`S32-T3-A-E3`): wc=37, FH=95.61 — "Fail-closed de transformers: con `train_xs`/`serve_xs`, fit real de moda y transform; ok → `CONTINUE`; `try_before_fit`…"
  - L1641 `instruction` (`S32-T3-B-E3`): wc=37, FH=70.18 — "Fail-closed de persistencia: round-trip del state, apply mediana a `serve_batch` y version `fs-v*` → `CONTINUE`; version vacía o serve con None si…"  (also `single_sentence_paragraph`)
- **Evidence:** Heuristic `long_sentence` × 5 from `S32_metrics.json`.
- **Pedagogical impact:** These are transfer-kind (E3) instructions, the hardest cognitive step in the We Do ladder. Packing the fail-closed branches (CONTINUE / REJECT / REQUEST) into one sentence obscures the decision tree. A 3-bullet list (CONTINUE when … / REJECT when … / REQUEST when …) would mirror the gates vocabulary the section teaches.
- **Severity rationale:** P1; pedagogy clarity at the hardest step of the ladder.

### M-3 · `vs` without period (Spanish style) (P1)
- **Location:** L22 `learningOutcomes[5].text` ("Componer transformers custom con fit→transform y cadena por tipo de columna (ruta numérica vs categórica)") and L2242 `rubric[4].criterion` ("Código legible y límites claros (REQUEST_* vs REJECT_*)").
- **Evidence:** Heuristic `vs_without_period` × 2; LanguageTool `PUNTO_EN_ABREVIATURAS` × 2.
- **Pedagogical impact:** RAE-preferred form is `vs.` (with period) in Spanish writing. Minor but consistent with Peruvian formal Spanish.
- **Severity rationale:** Low-medium; two occurrences.

### M-4 · `y indicator` should be `e indicator` (Spanish conjunction) (P1)
- **Location:** L812 `hints[0]` and L814 `hints[1]` — both: `"Falta median se detecta antes de construir filled; silent_fill si hay None y indicator no lo marca."` and `"expected_ind = [v is None for v in values]; PASS si indicator == expected_ind y median no es None."`
- **Evidence:** LanguageTool `Y_E_O_U` × 2.
- **Pedagogical impact:** Spanish conjunction `y` → `e` before a word starting with /i/ sound (`indicator`). Standard Spanish grammar rule (RAE `Nueva gramática`, §30.7).
- **Severity rationale:** Low-medium; 2 hints visible only after the learner requests help.

### M-5 · Missing space after comma inside half-open interval (P1)
- **Location:** L455 `description` — `"Cuenta eventos en ventana half-open [t-w,t), contrasta con el conteo cerrado (mal) e incluye_t=False."`
- **Evidence:** LanguageTool `COMMA_PARENTHESIS_WHITESPACE`.
- **Pedagogical impact:** Spanish typography requires a space after every comma. `[t-w,t)` should be `[t-w, t)` (also matches the form used elsewhere in the section, e.g. L168 `[t−w, t)`, L170 `[t−w, t)`). Inconsistency.
- **Severity rationale:** Low; one occurrence but breaks internal consistency.

### M-6 · 8 callout `content` fields read as bullet contract lines, not learner prose (P1)
- **Location:** L89, L122, L161, L195, L264, L299, L335, L366 — pattern: `"S32-TX-Y: <topic>. Incumplimiento → REJECT_*; falta <prereq> → REQUEST_*."`
- **Evidence:** Heuristic `subtopic_id_in_prose` × 8 (callouts). LT `UPPERCASE_SENTENCE_START` fires on the lowercase second clause after `→`.
- **Pedagogical impact:** These callouts are rendered as "Contrato local" tips at the end of each subtopic. They encode the gates vocabulary but read as telegrams (`"S32-T1-A: catálogo + keys. Incumplimiento → REJECT_UNKNOWN_FEATURE; falta catálogo → REQUEST_CATALOG."`). A 2-sentence rewrite would improve learner uptake.
- **Severity rationale:** Low-medium; same pattern as S15.

### M-7 · `English_dominant` mixed Spanish-English gate-vocabulary strings (P1)
- **Location:** L122, L161, L264, L335, L366 callouts; L647, L810, L1188, L1303, L1723 `instruction` fragments — all are short strings dominated by `REJECT_*` / `REQUEST_*` / `MISSING:*` tokens (e.g. `"Incumplimiento → REJECT_SILENT_FILL; falta mediana → REQUEST_MEDIAN."`).
- **Evidence:** Heuristic `english_dominant` × 11.
- **Pedagogical impact:** Mostly false positives (the strings ARE mostly Spanish), but the high density of English-cased identifiers (`REJECT_SILENT_FILL`, `REQUEST_MEDIAN`) makes the strings read as code-switching. Acceptable here because these tokens are taught as a fail-closed vocabulary, but a 1-sentence prelude per callout (`"Esta sección usa dos gates:"`) would soften the cognitive jump.
- **Severity rationale:** Low; mostly false positives flagged for awareness.

### M-8 · `MORFOLOGIK_RULE_ES` × 855 (false-positive class) (P1, documentation)
- **Location:** Distributed across the entire section.
- **Evidence:** LanguageTool raw output (`S32_lt.json`).
- **Pedagogical impact:** LT flags every English code identifier as a Spanish spelling error (`feature`, `serve`, `train`, `median`, `skew`, `leakage`, `silent_fill`, `catalog`, `fit`, `transform`, `vocab`, `schema`, `pipeline`, `ColumnTransformer`, `cpn3b`, `fs-vN`, `note_len`, etc.). 855 of 909 raw matches. These are NOT real errors; they document the section's pervasive code-switching style. Recommended mitigation: keep English identifiers in inline `code` spans (already done) and consider adding a brief glossary callout at the start of T1 ("Esta sección usa vocablos técnicos en inglés dentro de `code`: serve, train, fit, transform, skew, leakage").
- **Severity rationale:** Informational; not a real defect.

### L-1 · `unbalanced_delim` × 10 (FALSE-POSITIVE class for half-open intervals) (P2)
- **Location:** L21, L455, L1148, L1241, L2250 (and other `[t−w, t)` uses).
- **Evidence:** Heuristic `unbalanced_delim` × 10; LT `ES_UNPAIRED_BRACKETS` × 5.
- **Pedagogical impact:** All false positives — the half-open interval `[t−w, t)` is correct mathematical notation (open bracket + closing paren to denote left-closed, right-open). The heuristics count brackets literally and flag the apparent mismatch. However, learners unfamiliar with the notation may also be confused; the section defines it once in the diccionario callout (`"Ventana half-open [t−w, t): cuenta eventos con timestamp ≥ t−w y estrictamente < t; no incluye el instante de decisión"`) — that definition is good. Consider adding a brief aside on first use: "la notación `[a, b)` significa incluir `a` y excluir `b`".
- **Severity rationale:** False positive in metrics; documented for transparency.

### L-2 · `meta_leak` × 1 (FALSE-POSITIVE: "todo") (P2)
- **Location:** L810 `instruction` — `"…Adverso: indicator todo False con huecos (silent fill)."`.
- **Evidence:** Heuristic `meta_leak` rule matched "todo" case-insensitively.
- **Pedagogical impact:** "todo" is Spanish for "all" (`indicator todo False` = "indicator all False"), not the English TODO marker. False positive.
- **Severity rationale:** Documented for transparency; no fix needed.

### L-3 · `english_dominant` × 11 mostly false positives (P2)
- **Location:** See M-7.
- **Evidence:** See M-7.
- **Pedagogical impact:** Mostly false positives (strings have Spanish function words but no accents). Documented for transparency.

### L-4 · `high_comma_density` × 35 (P2)
- **Location:** Distributed across instruction / description / feedback.
- **Evidence:** Heuristic `high_comma_density` × 35.
- **Pedagogical impact:** Mostly legitimate (technical enumerations like `"catálogo, escala, grafo, ventana, fit/persist o split"`). Some could be moved to bullet lists. Low priority.

### L-5 · `missing_terminal` × 41 (mostly legitimate, P2)
- **Location:** L6 `title`, L7 `shortTitle`, L9 `tagline`, L17-L25 `learningOutcomes[].text`, L299 `criterion`, L2250 `question`, etc.
- **Evidence:** Heuristic `missing_terminal` × 41.
- **Pedagogical impact:** Most are legitimate (titles, headings, MCQ questions, rubric criteria should NOT end with a period). However, the 8 `learningOutcomes[].text` items end without a period — they are full clauses ("Diseñar un feature catalog (numéricas, categóricas y de texto) y validar que las keys del row ⊆ catálogo antes del fit; evidencia: catalog_ok y lista unknown_keys") and should close with `.` for consistency with the rubric. Low priority.

### L-6 · Live demo `CircuitBreaker` is missing Spanish accents (P2)
- **Location:** `src/components/course/SectionView.tsx:2560` `# Simulacion de microservicios: health checks y circuit breaker` and L2565 `"""Circuit breaker que abre despues de N fallos."""`.
- **Evidence:** `agent-browser read` returned L860-L865 verbatim.
- **Pedagogical impact:** Compounds H-1: even if the demo were on-topic, "Simulacion" / "despues" lack required tildes (`Simulación`, `después`). Once H-1 is fixed by replacing the demo with a feature-engineering playground, this issue becomes moot for Section 32 — but the underlying demo template still needs fixing for whoever ends up using it.
- **Severity rationale:** Low; secondary to H-1.

---

## 4. Meta-Leak Report

| # | Exact leaked text | Location | Severity |
|---|-------------------|----------|----------|
| ML-1 | `id: "microservices"` (legacy slug from old roadmap, content is Feature engineering) | `s32-microservices.ts:4` + filename `s32-microservices.ts` | HIGH |
| ML-2 | `'microservices': { title: 'Practica health checks y circuit breaker', code: '# Simulacion de microservicios: health checks y circuit breaker…' }` | `SectionView.tsx:2558-2644` (rendered live in `Pruébalo tú mismo` panel) | HIGH |
| ML-3 | `microservices: '32. Microsvc'` | `PdfReport.tsx:72` (rendered in printable PDF report) | HIGH |
| ML-4 | `# CASO-LIM-032 · feature catalog types` (and 23 siblings) | 24 `starterCode.code` first-line comments (L617, L659, L717, …, L2083) | HIGH |
| ML-5 | `CASO-LIM-032`, `CASO-LIM-032-1A`, `CASO-LIM-032-1B`, … in `instruction`, `context`, `edgeCases` | L605, L884, L2155, and 6 `edgeCases` arrays | MEDIUM |
| ML-6 | `S32-T1-A: catálogo + keys. Incumplimiento → REJECT_UNKNOWN_FEATURE; falta catálogo → REQUEST_CATALOG.` (and 7 siblings) | 8 callout `content` fields (L89, L122, L161, L195, L264, L299, L335, L366) | MEDIUM |
| ML-7 | `S32-T1-A-E1 · Sobre \`CASO-LIM-032-1A\`, calcula…` (and 23 sibling `instruction` fields with `S32-T*-E* ·` prefix) | 24 `instruction` fields (L605, L647, …, L2071) | MEDIUM |
| ML-8 | `S32-T1-A-E1: sin keys desconocidas el catálogo pasa…` (and 23 sibling `feedback` fields with `S32-T*-E*:` prefix) | 24 `feedback` fields | MEDIUM |
| ML-9 | Live demo Spanish missing accents: `Simulacion` / `despues` / `mas rapido` | `SectionView.tsx:2560, 2565, 2643` | LOW (compounds ML-2) |
| ML-10 | Master roadmap mismatch: `### Sección 32 — Computer Vision Workflows` | `el_arte_de_python_roadmap_maestro_52_secciones.md:294` (legacy) | LOW (informational) |

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do / Self-check fidelity
- **I Do**: 8 demos, one per subtopic (T1-A catalog, T1-B missing/scale, T2-A graph feats, T2-B half-open window, T3-A transformer/router, T3-B JSON persist, T4-A split, T4-B leakage scan). Each has `description`, code, output, and `why`. The `why` field is consistently learner-facing ("El catálogo es la fuente de verdad de dtypes: sin él, serve inventa columnas y rompe train≡serve."). Strong.
- **We Do**: 24 exercises (8 subtopics × 3 kinds). The progression guided → independent → transfer is faithful. Each step has the full contract: `instruction`, `hint`, `hints[2]`, `edgeCases[3]`, `tests`, `feedback`, `starterCode` with `# DEFECT:` annotation, and `solutionCode` with output. The DEFECT-then-fix pattern (e.g., `# DEFECT: unknown se calcula al revés (any-in-known en vez de not-in-known)`) is pedagogically excellent — it teaches learners to spot and repair buggy patterns rather than write from scratch. Top-tier.
- **You Do**: Full capstone `CP-N3-B` with 7 stubbed functions, 4 objectives, 5 requirements, portfolio note, and a 7-row rubric (100 % + bonus). Acceptance checks are commented out at the bottom (`# assert n_e1 == 2 and ov == 0 and leaky == [] and state["median_amount"] is not None`). Excellent.
- **Self-check**: 10 MCQs covering all 8 subtopics + fail-closed vocabulary. Each has 4 options + an `explanation`. The distractors are well-designed (e.g., `"Es deseable"` for overlap — catches learners who confuse train/test overlap with sample size). Strong.

### 5.2 Connective tissue and narrative flow
- Strong opening hook ("Imagina un modelo offline con AUC excelente que se derrumba al desplegarse: las features de train usaron el timestamp del outcome…") that motivates the entire section.
- Bridge to S31 explicit ("continuación del grafo de evidencia de S31: shared address, degree, path") and forward link to S33 explicit ("el baseline de S33 no herede un espejismo"; "el artefacto `fs-vN` es el contrato de entrada del baseline S33").
- "Historia mínima del fallo (antes de la solución)" — pattern borrowed from S15 and earlier gold-standard sections; excellent pedagogy.
- Vocabulary is dense with English code-switches (`silent fill`, `skew`, `leakage`, `fit/transform`, `serve`, `train`, `feature set`, `fs-vN`); the diccionario callout at the start helps, but the section assumes prior exposure to sklearn idiom. For a Phase-2 senior section, this is appropriate.

### 5.3 Cognitive load and progressive disclosure
- The T1 → T2 → T3 → T4 progression is well-sequenced: types (T1) → relationals (T2) → pipelines (T3) → validation (T4). Each Ti has two subtopics (A, B), and each subtopic has one Theory block + one I Do demo + one We Do triad (E1, E2, E3).
- Cognitive load is well-managed except for the E3 transfer-kind instructions (M-2: 5 long sentences 32-37 words). These pack the fail-closed decision tree into one sentence; splitting into 3 branches (CONTINUE / REJECT / REQUEST) would reduce load.
- The "Contrato local" callouts at the end of each subtopic are dense but consistent — a stable contract pattern that learners learn to recognize by T3.

### 5.4 Exercise and exam quality and alignment
- All 24 We Do exercises share the same DEFECT-then-fix starter pattern. The DEFECT comments are precise and educational (e.g., `# DEFECT: gate invertido (PASS si hay leak o skew)`).
- Tests are concrete (e.g., `tests: "Salida: \`PASS REJECT_LEAKAGE MISSING:feature_set\`."`) and match the expected output in `solutionCode`.
- `edgeCases` consistently list 3 cases: "falta <prereq>", "fixture adverso: <case>", "CASO-LIM-032-XX es sintético".
- Self-check MCQs are well-aligned with the 8 subtopic contracts.
- You Do capstone Acceptance checks are explicit (`assert n_e1 == 2 and ov == 0 and leaky == [] and state["median_amount"] is not None`).

### 5.5 Consistency with roadmap and previous sections
- V3 roadmap (`learning_roadmap_52_V3.md:472`) explicitly maps S32 to "Feature engineering y pipelines sin leakage" with the same T1-T4 structure. ✅
- Backward link to S31 (Grafos y evidencia relacional — confirmed via `s31-streaming-data.ts:6`) is consistent. ✅
- Forward link to S33 (ML supervisado y baselines responsables) is consistent — the `fs-vN` artifact is the documented handoff. ✅
- `CASO-LIM-032` taxonomy continues the S10 (`CASO-LIM-010`) / S15 (`CASO-LIM-015`) pattern — same P0 leak.
- `CP-N3-B` capstone id continues the CP-N1-A (S13), CP-N2-A (S15) naming convention. ✅

### 5.6 Comparison with best-in-class external materials
- The fail-closed vocabulary (`REQUEST_*` / `REJECT_*`) is more rigorous than sklearn's docs (which only warn) and aligns with Google's *Rules of ML* (Rule #4: "Keep the first model simple"). The section explicitly cites this source (line 2340).
- The half-open window treatment is more rigorous than Feast's docs (which mention point-in-time correctness but don't teach the `[t−w, t)` notation). The section explicitly cites Feast (line 2335).
- The anti-fraud / anti-parentesco guardrail ("Features de contacto o shared address **no** son etiqueta de fraude ni parentesco: son señales para el modelo o la cola humana, no veredictos") is exemplary and rare in mainstream ML curricula. It directly addresses Peruvian / LatAm regulatory context (Habeas Data, ARCO rights implicit).
- Comparison with Stanford CS329S (cited in roadmap line 812): the section covers the same leakage taxonomy (target leakage, train-serve skew, identity leakage) with smaller, more inspectable Python-pure demos. Excellent.

---

## 6. Grammatical improvements and rewriting report (paragraph by paragraph, tab by tab)

> Method: Apply Fernández-Huerta / INFLESZ / WPS / SPW + the 19-rule pedagogical-heuristic set from `_GRAMMAR_SUBPLAN.md` to every learner-facing Spanish paragraph. Below: BEFORE (verbatim) → METRICS → AFTER (proposed rewrite, audit-only — no code changes applied).

### 6.1 Header (jobRelevance, tagline, learningOutcomes)

#### Header-1 · `tagline` (L9)
- **BEFORE:** `"tabla de features versionada con train≡serve, sin futuro ni labels de decisión · Ritmo sugerido: ~10–12 h núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew/versionado hacia S33"`
- **Metrics:** wc=40, FH=73.04, INFLESZ=68.96, band `fácil`, WPS=40, findings: `long_sentence` (M), `single_sentence_paragraph` (M), `missing_terminal` (M).
- **AFTER:** `"Tabla de features versionada con train≡serve, sin futuro ni labels de decisión. Ritmo sugerido: ~10–12 h de núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew y versionado hacia S33."`
- **Why:** Split the topic description from the planning aside with a period; add terminal period; capitalize first letter. Same content, two sentences, FH likely to rise to ~80.

#### Header-2 · `jobRelevance` (L15-16)
- **BEFORE:** `"Features mal hechas **filtran el futuro** y crean modelos que fallan en producción. En esta sección construyes la **tabla de features versionada** del workbench de investigación relacional (CP-N3-B): misma lógica en entrenamiento e inferencia, sin timestamps futuros ni labels de decisión. Features de grafo o contacto compartido **no** son etiqueta de fraude ni de parentesco."`
- **Metrics:** 3 sentences, wc=53, FH=66.66, INFLESZ=61.55, band `normal`, WPS=17.67, findings: none.
- **AFTER:** Verbatim. The paragraph is healthy (FH `normal`, three sentences, anti-fraud guardrail explicit). No changes needed.

#### Header-3 · `learningOutcomes[1..8].text` (L17-L25)
- **BEFORE (sample):** `"Diseñar un feature catalog (numéricas, categóricas y de texto) y validar que las keys del row ⊆ catálogo antes del fit; evidencia: catalog_ok y lista unknown_keys"`
- **Metrics:** All 8 outcomes lack terminal period (heuristic `missing_terminal` × 8, but legitimate for rubric criteria; these are outcome statements). FH varies 50-75.
- **AFTER:** Add terminal `.` to each outcome: `"Diseñar un feature catalog (numéricas, categóricas y de texto) y validar que las keys del row ⊆ catálogo antes del fit; evidencia: catalog_ok y lista unknown_keys."`
- **Why:** Consistency with rubric criteria (which also lack periods — leave those as-is per UI convention) and full-clause style.

### 6.2 Theory tab

#### Theory-1 · Opening paragraph (L31)
- **BEFORE:** `"Imagina un modelo offline con AUC excelente que se derrumba al desplegarse: las features de train usaron el timestamp del outcome o la mediana del set completo. Eso es **leakage** — filtrar al entrenamiento información que no existiría en el momento de la decisión. En un workbench de investigación relacional el daño es doble: métricas optimistas y colas humanas que confían en scores contaminados. Aquí construyes la **tabla de features versionada** del workbench **CP-N3-B** con filas sintéticas por par entidad/caso (\`run_id=cpn3b-feat\`) en la Red Andina ficticia. El gate es **train ≡ serve**: la misma transformación en entrenamiento e inferencia, sin leakage temporal ni de label."`
- **Metrics:** 5 sentences, wc=91, FH=68.96, INFLESZ=63.55, band `normal`, WPS=18.2, findings: none.
- **AFTER:** Verbatim. Healthy narrative hook;FH `normal` is appropriate for a senior-level opener. No changes needed.

#### Theory-2 · "Historia mínima del fallo" (L32)
- **BEFORE:** `"Historia mínima del fallo (antes de la solución): un notebook cuenta eventos con \`ts <= t\` e incluye el instante de decisión; el AUC sube; en serve, con la ventana correcta, el score colapsa. Otro fallo: la mediana de amount se calcula sobre train+test y el z-score "conoce" el futuro. Esta sección te da el camino inverso — catálogo, ventana half-open, stats congeladas, split sin overlap y \`fs-vN\` — para que el baseline de S33 no herede un espejismo."`
- **Metrics:** 3 sentences, wc=71, FH=64.77, INFLESZ=58.45, band `normal`, WPS=23.67, findings: none.
- **AFTER:** Verbatim. The "before → after" structure is excellent pedagogy. No changes needed.

#### Theory-3 · "Producto incremental" (L33)
- **BEFORE:** `"Producto incremental: **catálogo** + transformers **fit/transform idénticos** en train e inferencia, **sin futuro** ni labels de decisión como feature. Entrada: eventos y grafo sintético (continuación del grafo de evidencia de S31: shared address, degree, path); salida: feature set id \`fs-vN\` con hash de schema listo para el baseline de S33. Orden: **T1 tipos** → **T2 relacionales/grafo** → **T3 pipelines** → **T4 validación/leakage**. Features de contacto o shared address **no** son etiqueta de fraude ni parentesco: son señales para el modelo o la cola humana, no veredictos."`
- **Metrics:** 4 sentences, wc=84, FH=68.43, INFLESZ=62.10, band `normal`, WPS=21.0, findings: none.
- **AFTER:** Verbatim. The four-sentence structure (product / I/O / order / anti-fraud guardrail) is exemplary. No changes needed.

#### Theory-4 · Callout "Gate features" (L37-39)
- **BEFORE:** `"Train≡serve, sin leakage temporal ni de label. Solo PII sintético. Si hay timestamps futuros en features, la sección no se considera superada."`
- **Metrics:** 3 sentences, wc=21, FH=70.95, INFLESZ=63.55, band `bastante_fácil`, findings: none.
- **AFTER:** Verbatim. Crisp gate definition. No changes.

#### Theory-5 · Diccionario callout (L45-47)
- **BEFORE (paragraph 1):** `"**Leakage:** usar en el entrenamiento información que no existiría en el momento de la decisión (futuro, label, o identidad vista en test). **Train≡serve:** el código y el estado (mediana, vocabulario, μ/σ) que transforman filas en train son los mismos que en inferencia. Si solo el notebook de train conoce un fill o un vocab, hay skew silencioso."`
- **Metrics:** 3 sentences, wc=51, FH=64.40, INFLESZ=56.95, band `normal`, WPS=17.0, findings: none.
- **AFTER:** Verbatim. Healthy. No changes.

#### Theory-6 · Subtopic callouts ("Contrato local") (L89, L122, L161, L195, L264, L299, L335, L366)
- **BEFORE (L89):** `"S32-T1-A: catálogo + keys. Incumplimiento → REJECT_UNKNOWN_FEATURE; falta catálogo → REQUEST_CATALOG."`
- **Metrics:** 2 sentences, wc=11, FH=18.68 (artificially low because wc is tiny), findings: `subtopic_id_in_prose` (M), `english_dominant` (M, false positive).
- **AFTER:** `"Contrato local — catálogo + keys. Si el catálogo existe y el row lo viola: \`REJECT_UNKNOWN_FEATURE\`. Si falta el catálogo: \`REQUEST_CATALOG\`."`
- **Why:** Drop the subtopic ID prefix; expand the telegraphic clauses into 3 short sentences; keep the gate identifiers in inline code spans. Same for the other 7 callouts (L122, L161, L195, L264, L299, L335, L366).

#### Theory-7 · Subtopic paragraphs (T1-A through T4-B, 3 paragraphs each)
- Each subtopic has 3 paragraphs: (1) concept, (2) contract, (3) application to `CASO-LIM-032`. The third paragraph always starts with `"Aplicación a \`CASO-LIM-032\`:"` — this is the only place where `CASO-LIM-032` appears in the Theory tab (8 occurrences, 1 per subtopic). This is acceptable as a stable case-id reference, but should be defined once in the opening callout (e.g., add `"Caso de uso interno: \`CASO-LIM-032\` (Red Andina sintético, sin PII real)"` to the Gate features callout).
- All T1-T4 paragraphs are healthy: FH 60-80, WPS 12-22, no run-ons, no missing punctuation. No structural rewrites needed.

### 6.3 I Do tab

#### IDo-1 · `intro` (L371)
- **BEFORE:** `"S32 · **Yo hago**: te muestro catálogo, missing/scale, grafo (puente S31), ventanas half-open, transformers fit→transform y anti-leakage sobre \`run_id=cpn3b-feat\`. Cada demo **calcula** el concepto a partir de datos sintéticos — no flags prebakeados. Luego en We Do reparas el mismo kernel; en You Do empaquetas el \`fs-vN\` para S33."`
- **Metrics:** 3 sentences, wc=42, FH=80.83, INFLESZ=73.97, band `fácil`, WPS=14.0, findings: none.
- **AFTER:** Verbatim. Healthy. No changes.

#### IDo-2 · Demo `description` fields (L377, L403, L427, L455, L481, L528, L550, L575)
- **BEFORE (L455):** `"Cuenta eventos en ventana half-open [t-w,t), contrasta con el conteo cerrado (mal) e incluye_t=False."`
- **Metrics:** 1 sentence, wc=19, FH=83.25, INFLESZ=77.20, band `fácil`, findings: `unbalanced_delim` (L, false positive for half-open interval), `COMMA_PARENTHESIS_WHITESPACE` (M, real), `high_comma_density` (L).
- **AFTER:** `"Cuenta eventos en ventana half-open [t-w, t), contrasta con el conteo cerrado (mal) y devuelve \`includes_t=False\`."`
- **Why:** Add space after comma inside `[t-w, t)` (matches the form used elsewhere); change `e incluye_t=False` to `y devuelve \`includes_t=False\`` for verb-noun agreement (the original is acceptable Spanish but the rewrite is clearer).

#### IDo-3 · Demo `why` fields (L397, L421, L449, L475, L522, L544, L569, L594)
- All 8 `why` fields are healthy: FH 60-90, WPS 12-25, 1-2 sentences each. No changes needed.

### 6.4 We Do tab

#### WeDo-1 · `intro` (L599)
- **BEFORE:** `"S32 · **Hacemos juntos** (E1) → **tú validas** (E2) → **transfieres fail-closed** (E3): 24 retos sobre CP-N3-B. Cada lab **recalcula** catálogo, escala, grafo, ventana, fit/persist o split desde datos sintéticos — no inviertes un booleano precomputado. Si falta un prerequisito, \`REQUEST_*\`; si hay leakage, \`REJECT_*\`."`
- **Metrics:** 3 sentences, wc=45, FH=68.87, INFLESZ=61.34, band `normal`, WPS=15.0, findings: `high_comma_density` (L).
- **AFTER:** Verbatim. Healthy. The intro advertises the 3-step ladder and the fail-closed vocabulary. No changes.

#### WeDo-2 · `instruction` fields (24 occurrences, L605…L2071)
- **BEFORE (L605):** `"S32-T1-A-E1 · Sobre \`CASO-LIM-032-1A\`, calcula si las keys del row están ⊆ catálogo (union de numeric/categorical/text). El starter declara \`catalog_ok\` al revés: corrige el cálculo de unknown keys. Salida exacta: \`S32-T1-A PASS\`. En E2 el adverso con feature desconocida debe activar \`REJECT_UNKNOWN_FEATURE\`."`
- **Metrics:** 4 sentences, wc=53, FH=81.25, INFLESZ=74.62, band `fácil`, WPS=13.25, findings: `caso_lim_taxonomy` (M), `subtopic_id_in_prose` (M).
- **AFTER:** `"Ejercicio E1 · Sobre el caso de uso interno \`CASO-LIM-032-1A\` (Red Andina sintético), calcula si las keys del row están ⊆ catálogo (unión de numeric/categorical/text). El starter declara \`catalog_ok\` al revés: corrige el cálculo de unknown keys. Salida exacta: \`S32-T1-A PASS\`. En E2, el adverso con feature desconocida debe activar \`REJECT_UNKNOWN_FEATURE\`."`
- **Why:** Drop the `S32-T1-A-E1 ·` prefix (subtopic ID is already in `subtopicId` field); add comma after `En E2`; keep `CASO-LIM-032-1A` but prefix with "caso de uso interno" so it reads as a named fixture, not a taxonomy code. Apply the same rewrite pattern to all 24 `instruction` fields.

#### WeDo-3 · `feedback` fields (24 occurrences)
- **BEFORE (L613):** `"S32-T1-A-E1: sin keys desconocidas el catálogo pasa; una feature inventada en serve exige REJECT_UNKNOWN_FEATURE; sin schema, REQUEST_CATALOG."`
- **Metrics:** 1 sentence, wc=23, FH=52.95, INFLESZ=45.95, band `bastante_difícil`, findings: `subtopic_id_in_prose` (M), `english_dominant` (M, false positive).
- **AFTER:** `"Sin keys desconocidas, el catálogo pasa. Una feature inventada en serve exige \`REJECT_UNKNOWN_FEATURE\`. Si falta schema: \`REQUEST_CATALOG\`."`
- **Why:** Drop the `S32-T1-A-E1:` prefix; split into 3 short sentences (one per gate outcome); wrap gate identifiers in inline code spans. Apply the same rewrite pattern to all 24 `feedback` fields.

#### WeDo-4 · `hint` and `hints[]` fields (24 occurrences each)
- **BEFORE (L812, L814):** `"Falta median se detecta antes de construir filled; silent_fill si hay None y indicator no lo marca."` / `"expected_ind = [v is None for v in values]; PASS si indicator == expected_ind y median no es None."`
- **Metrics:** 1 sentence each, findings: `Y_E_O_U` (M, real — `y indicator` → `e indicator`).
- **AFTER:** `"Falta median se detecta antes de construir filled; silent_fill si hay None e indicator no lo marca."` / `"expected_ind = [v is None for v in values]; PASS si indicator == expected_ind y median no es None."`
- **Why:** `y` → `e` before `indicator` (Spanish conjunction rule). Apply to both hints.

#### WeDo-5 · `starterCode` first-line comments (24 occurrences, L617…L2083)
- **BEFORE (L617):** `# CASO-LIM-032 · feature catalog types`
- **AFTER:** `# Ejercicio E1 — feature catalog types (Red Andina sintético, sin PII real)`
- **Why:** Drop the internal taxonomy code `CASO-LIM-032`; add the privacy disclaimer explicitly. Apply to all 24 starterCode first-line comments.

#### WeDo-6 · `tests` fields (24 occurrences)
- All are healthy short strings (`"Salida: \`S32-T1-A PASS\`."`, `"Salida: \`PASS REJECT_UNKNOWN_FEATURE MISSING:schema\`."`). No changes needed.

#### WeDo-7 · `edgeCases` arrays (24 occurrences, 3 items each)
- Pattern: `["falta <prereq>", "fixture adverso: <case>", "CASO-LIM-032-XX es sintético"]`.
- **AFTER:** Replace the third item `"CASO-LIM-032-XX es sintético"` with `"Caso de uso interno (sintético, sin PII real)"`. Apply to all 24.

### 6.5 You Do tab

#### YouDo-1 · `context` (L2155)
- **BEFORE:** `"Entrega un mini feature set para CASO-LIM-032 / run_id=cpn3b-feat: catálogo, ventanas half-open, state versionado, split sin overlap y scan de leakage. El artefacto \`fs-vN\` (JSON con medianas, vocab y schema hash) es el **contrato de entrada del baseline S33**: sin él no se entrena."`
- **Metrics:** 2 sentences, wc=50, FH=74.54, INFLESZ=66.69, band `fácil`, WPS=25.0, findings: `caso_lim_taxonomy` (M).
- **AFTER:** `"Entrega un mini feature set para el caso de uso interno \`CASO-LIM-032\` (run_id=\`cpn3b-feat\`, Red Andina sintético, sin PII real): catálogo, ventanas half-open, state versionado, split sin overlap y scan de leakage. El artefacto \`fs-vN\` (JSON con medianas, vocab y schema hash) es el **contrato de entrada del baseline S33**: sin él no se entrena."`
- **Why:** Frame `CASO-LIM-032` as a named case-id with privacy disclaimer; same content otherwise.

#### YouDo-2 · `objectives[1..4]` (L2157-2161)
- All 4 are healthy (FH 70-90, no findings). No changes.

#### YouDo-3 · `requirements[1..5]` (L2163-2167)
- All 5 are healthy. No changes.

#### YouDo-4 · `starterCode` (L2169-2234)
- 65 lines of Python stub with 7 `raise NotImplementedError(...)` placeholders + Acceptance checks at the bottom. Healthy. The first 3 comment lines reference `CASO-LIM-032 / run_id=cpn3b-feat` — same fix as YouDo-1: replace with `"caso de uso interno \`CASO-LIM-032\` (Red Andina sintético, sin PII real)"`.

#### YouDo-5 · `portfolioNote` (L2235)
- **BEFORE:** `"Feature set fs-vN + anti-leakage checklist + informe de split (n_train, n_test, overlap 0) listos para el baseline S33. Incluye schema hash o lista de columnas congelada."`
- **Metrics:** 2 sentences, wc=23, FH=79.71, INFLESZ=72.71, band `fácil`, findings: none.
- **AFTER:** Verbatim. Healthy. No changes.

#### YouDo-6 · `rubric[1..7]` (L2238-2244)
- All 7 criteria are healthy short strings. Two findings:
  - L2242 `criterion`: `"Código legible y límites claros (REQUEST_* vs REJECT_*)"` — `vs` → `vs.` (M-3).
  - L2243 `criterion`: `"Documentación en español profesional"` — missing terminal `.` (L-5, low).

### 6.6 Self-check tab

#### SelfCheck-1 · Question 1 (L2250)
- **BEFORE:** `"Una ventana half-open [t−w, t) excluye:"`
- **Metrics:** 1 sentence, wc=8, FH=30.72 (low because wc is tiny), findings: `unbalanced_delim` (L, false positive), `vs_without_period` (none here).
- **AFTER:** Verbatim. The half-open interval notation is correct. No changes (MCQ question, no terminal period needed).

#### SelfCheck-2 · Question 1 `explanation` (L2253)
- **BEFORE:** `"Half-open evita leakage temporal al no contar el momento de decisión ni timestamps futuros."`
- **Metrics:** 1 sentence, wc=14, FH=38.27, INFLESZ=33.27, band `difícil`, findings: `english_dominant` (M, false positive).
- **AFTER:** Verbatim. The low FH is an artifact of the short sentence + English loanwords ("half-open", "leakage"). Healthy for a technical MCQ explanation. No changes.

#### SelfCheck-3..10 · Questions 2-10 (L2256-L2318)
- All 9 remaining MCQs are healthy: FH 40-80, WPS 10-20, explanations are 1-2 sentences. No structural changes.
- Spot-check Question 6 (L2285): `"Si en serve aparece una key que no está en el feature catalog:"` — options: `["se ignora en silencio", "se rechaza (REJECT_UNKNOWN_FEATURE) o se pide REQUEST_CATALOG", "se agrega al catálogo al vuelo", "solo afecta a features de texto"]` — strong distractors. Correct index 1. Explanation: `"Train≡serve exige keys ⊆ catálogo; una feature inventada en serve rompe el contrato."` Healthy.

### 6.7 Aggregate metrics summary (post-rewrite estimate)

| Metric | BEFORE | Estimated AFTER |
|--------|--------|-----------------|
| Aggregate FH | 80.96 (`fácil`) | ~82 (`fácil`) — slight rise from sentence splitting |
| Aggregate INFLESZ | 77.20 (`bastante_fácil`) | ~78 (`bastante_fácil`) |
| Aggregate WPS | 12.76 | ~11.5 — slight drop from shorter sentences in feedback rewrites |
| Aggregate SPW | 1.792 | ~1.79 (unchanged — vocabulary unchanged) |
| Real LT findings | ~5 | 0 (after `vs.`, `e indicator`, `[t-w, t)` fixes) |
| Real heuristic findings | 9 (1H false-positive, 8M real) | 2 (subtopic IDs in `subtopicId` field instead of prose; CASO-LIM in starterCode dropped) |

---

## 7. Proposed GitHub-style Diffs

> Audit-only. Do NOT apply automatically. Each diff is a ready-to-apply patch keyed to the issue IDs in §3.

### Diff 1 (H-1, ML-1, ML-2) · Rename section id and replace the demo
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section32: CourseSection = {
-  id: "microservices",
+  id: "feature-engineering-leakage",
   index: 32,
   title: "Feature engineering y pipelines sin leakage",
   shortTitle: "Features sin leakage",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -32,7 +32,7 @@ import { section30 } from './sections/s30-security-infra'
 import { section31 } from './sections/s31-streaming-data'
-import { section32 } from './sections/s32-microservices'
+import { section32 } from './sections/s32-feature-engineering-leakage'
 import { section33 } from './sections/s33-advanced-models'
```
(Rename file `s32-microservices.ts` → `s32-feature-engineering-leakage.ts`.)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -2555,7 +2555,35 @@ const demos: Record<string, { code: string; expectedOutput?: string; hint?: string; title: string }> = {
-    'microservices': {
-      title: 'Practica health checks y circuit breaker',
-      code: `# Simulacion de microservicios: health checks y circuit breaker
-...
+    'feature-engineering-leakage': {
+      title: 'Practica ventana half-open y leakage scan',
+      code: `# Practica ventana half-open [t-w, t) y scan de nombres leaky
+def window_count(events, t, w):
+    """Cuenta eventos con ts en [t-w, t). No incluir ts == t."""
+    return sum(1 for ts in events if t - w <= ts < t)
+
+def leak_scan(names):
+    """Nombres con 'label' o 'decision' son red flags."""
+    return [n for n in names if "label" in n or "decision" in n]
+
+events, t, w = [1, 2, 3, 5], 5, 3
+print("count_half_open", window_count(events, t, w))
+print("count_closed_bad", sum(1 for ts in events if t - w <= ts <= t))
+print("leaky", leak_scan(["amount_7d", "label_decision"]))`,
+      expectedOutput: `count_half_open 2
+count_closed_bad 3
+leaky ['label_decision']`,
+      hint: 'Cambia w a 2 y observa como count_half_open baja a 1',
+    },
```

### Diff 2 (H-2, ML-3) · Fix PdfReport label
```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -69,7 +69,7 @@ const SECTION_NAMES: Record<string, string> = {
   mlops: '29. MLOps',
   "security-infra": '30. ER probabilístico',
   "streaming-data": '31. Streaming',
-  microservices: '32. Microsvc',
+  "feature-engineering-leakage": '32. Features sin leakage',
   "advanced-models": '33. ML+',
```

### Diff 3 (H-3, ML-4, ML-5) · Drop `CASO-LIM-032` from starterCode comments and reframe in prose
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -614,7 +614,7 @@
         starterCode: {
           language: 'python',
           title: "s32-t1-a-e1.py",
-          code: `# CASO-LIM-032 · feature catalog types
+          code: `# Ejercicio E1 — feature catalog types (Red Andina sintético, sin PII real)
 # DEFECT: unknown se calcula al revés (any-in-known en vez de not-in-known)
 schema = {"numeric": ["amount_7d"], "categorical": ["canal"], "text": []}
```
(Repeat for all 24 starterCode first-line comments: replace `# CASO-LIM-032 · <topic>` with `# Ejercicio EX — <topic> (Red Andina sintético, sin PII real)`.)

```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -602,7 +602,7 @@
       {
         id: "S32-T1-A-E1",
         subtopicId: "S32-T1-A",
         kind: "guided",
-        instruction: "S32-T1-A-E1 · Sobre `CASO-LIM-032-1A`, calcula si las keys del row están ⊆ catálogo (union de numeric/categorical/text). El starter declara `catalog_ok` al revés: corrige el cálculo de unknown keys. Salida exacta: `S32-T1-A PASS`. En E2 el adverso con feature desconocida debe activar `REJECT_UNKNOWN_FEATURE`.",
+        instruction: "Ejercicio E1 · Sobre el caso de uso interno `CASO-LIM-032-1A` (Red Andina sintético, sin PII real), calcula si las keys del row están ⊆ catálogo (unión de numeric/categorical/text). El starter declara `catalog_ok` al revés: corrige el cálculo de unknown keys. Salida exacta: `S32-T1-A PASS`. En E2, el adverso con feature desconocida debe activar `REJECT_UNKNOWN_FEATURE`.",
```
(Repeat for all 24 `instruction` fields: drop the `S32-T*-E* ·` prefix and add the privacy disclaimer.)

```diff
@@ -2152,7 +2152,7 @@
   youDo: {
     title: "Feature table versionada sin leakage (CP-N3-B)",
-    context:
-      "Entrega un mini feature set para CASO-LIM-032 / run_id=cpn3b-feat: catálogo, ventanas half-open, state versionado, split sin overlap y scan de leakage. El artefacto `fs-vN` (JSON con medianas, vocab y schema hash) es el **contrato de entrada del baseline S33**: sin él no se entrena.",
+    context:
+      "Entrega un mini feature set para el caso de uso interno `CASO-LIM-032` (run_id=`cpn3b-feat`, Red Andina sintético, sin PII real): catálogo, ventanas half-open, state versionado, split sin overlap y scan de leakage. El artefacto `fs-vN` (JSON con medianas, vocab y schema hash) es el **contrato de entrada del baseline S33**: sin él no se entrena.",
```

### Diff 4 (H-4, ML-6, ML-7, ML-8) · Drop subtopic IDs from callout content and feedback fields
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -86,9 +86,9 @@
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "S32-T1-A: catálogo + keys. Incumplimiento → REJECT_UNKNOWN_FEATURE; falta catálogo → REQUEST_CATALOG.",
+        content:
+          "Contrato local — catálogo + keys. Si el catálogo existe y el row lo viola: `REJECT_UNKNOWN_FEATURE`. Si falta el catálogo: `REQUEST_CATALOG`.",
       },
```
(Repeat for all 8 callout `content` fields: L89, L122, L161, L195, L264, L299, L335, L366.)

```diff
@@ -611,7 +611,7 @@
-        feedback: "S32-T1-A-E1: sin keys desconocidas el catálogo pasa; una feature inventada en serve exige REJECT_UNKNOWN_FEATURE; sin schema, REQUEST_CATALOG.",
+        feedback: "Sin keys desconocidas, el catálogo pasa. Una feature inventada en serve exige `REJECT_UNKNOWN_FEATURE`. Si falta schema: `REQUEST_CATALOG`.",
```
(Repeat for all 24 `feedback` fields.)

### Diff 5 (M-1) · Split tagline into two sentences
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -5,8 +5,8 @@
   tagline:
-    "tabla de features versionada con train≡serve, sin futuro ni labels de decisión · Ritmo sugerido: ~10–12 h núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew/versionado hacia S33",
+    "Tabla de features versionada con train≡serve, sin futuro ni labels de decisión. Ritmo sugerido: ~10–12 h de núcleo (T1–T4 + labs E1), 14–16 h con E2/E3 y You Do, 18 h si profundizas skew y versionado hacia S33.",
```

### Diff 6 (M-2) · Split E3 long instructions into 3-branch decision tree
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -1073,7 +1073,11 @@
-        instruction: "S32-T2-A-E3 · Fail-closed sobre features de grafo: recalcula shared/degree/path desde attrs y neighbors; topología limpia y uses_label False → `CONTINUE`; label de decisión como feature → `REJECT_LABEL_AS_FEATURE`; sin grafo → `REQUEST_GRAPH_FEAT`. El informe de grafo es obligatorio antes del baseline S33.",
+        instruction: `Ejercicio E3 · Fail-closed sobre features de grafo: recalcula shared/degree/path desde attrs y neighbors.
+          - \`CONTINUE\` si la topología está limpia y \`uses_label\` es False.
+          - \`REJECT_LABEL_AS_FEATURE\` si hay label de decisión como feature.
+          - \`REQUEST_GRAPH_FEAT\` si falta el grafo.
+          El informe de grafo es obligatorio antes del baseline S33.`,
```
(Repeat for L1241, L1439, L1641 E3 instructions.)

### Diff 7 (M-3) · `vs` → `vs.`
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -19,7 +19,7 @@
-    { text: "Componer transformers custom con fit→transform y cadena por tipo de columna (ruta numérica vs categórica)" },
+    { text: "Componer transformers custom con fit→transform y cadena por tipo de columna (ruta numérica vs. categórica)" },
@@ -2242,7 +2242,7 @@
-      { criterion: "Código legible y límites claros (REQUEST_* vs REJECT_*)", weight: "10%" },
+      { criterion: "Código legible y límites claros (REQUEST_* vs. REJECT_*)", weight: "10%" },
```

### Diff 8 (M-4) · `y indicator` → `e indicator`
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -811,9 +811,9 @@
-        hint: "Falta median se detecta antes de construir filled; silent_fill si hay None y indicator no lo marca.",
+        hint: "Falta median se detecta antes de construir filled; silent_fill si hay None e indicator no lo marca.",
         hints: [
-          "Falta median se detecta antes de construir filled; silent_fill si hay None y indicator no lo marca.",
+          "Falta median se detecta antes de construir filled; silent_fill si hay None e indicator no lo marca.",
```

### Diff 9 (M-5) · Missing space after comma in half-open interval
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -455,7 +455,7 @@
-        description: "Cuenta eventos en ventana half-open [t-w,t), contrasta con el conteo cerrado (mal) e incluye_t=False.",
+        description: "Cuenta eventos en ventana half-open [t-w, t), contrasta con el conteo cerrado (mal) y devuelve `includes_t=False`.",
```

### Diff 10 (L-5) · Add terminal periods to learning outcomes
```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ -17,7 +17,7 @@
-    { text: "Diseñar un feature catalog (numéricas, categóricas y de texto) y validar que las keys del row ⊆ catálogo antes del fit; evidencia: catalog_ok y lista unknown_keys" },
+    { text: "Diseñar un feature catalog (numéricas, categóricas y de texto) y validar que las keys del row ⊆ catálogo antes del fit; evidencia: catalog_ok y lista unknown_keys." },
```
(Repeat for all 8 learningOutcomes items.)

---

## 8. Recommended Priority Order for fixing

| Priority | Issue IDs | Effort | Why |
|----------|-----------|--------|-----|
| **P0-A** (fix first) | H-1, ML-1, ML-2 + file rename | Medium (rename file + edit `index.ts` + replace demo block in `SectionView.tsx`) | Eliminates the visible-on-live-site Circuit Breaker meta-leak in `Pruébalo tú mismo`. Same fix pattern as S15. |
| **P0-B** | H-2, ML-3 | Trivial (1 line in `PdfReport.tsx`) | Eliminates the "32. Microsvc" mislabel in printable PDF reports. |
| **P0-C** | H-3, ML-4, ML-5 | Medium (24 starterCode comment edits + 3 prose reframes) | Removes `CASO-LIM-032` from every We Do exercise file visible to learners. |
| **P0-D** | H-4, ML-6, ML-7, ML-8 | Medium (8 callout content edits + 24 instruction + 24 feedback) | Removes subtopic IDs from learner-facing prose; largest pedagogy uplift per token edited. |
| **P1-A** | M-1 | Trivial (1 line) | Split tagline for readability on the home-page card. |
| **P1-B** | M-2 | Medium (4 E3 instructions rewritten as 3-branch lists) | Highest pedagogical uplift for the hardest We Do step. |
| **P1-C** | M-3, M-4, M-5 | Trivial (3 lines) | Spanish grammar fixes (`vs.`, `e indicator`, `[t-w, t)`). |
| **P1-D** | M-6 | Medium (8 callout content rewrites — overlaps with P0-D) | Reframe "Contrato local" callouts as 3-sentence prose. |
| **P2** | L-1 through L-6 | Low / informational | Polish only; no learner-visible defect. |

---

## 9. Graph Memory Update notes (for the shared context files)

> Notes for the orchestrator's shared context. Append to any graph-memory file used by the S33+ auditors.

- **S32 id mismatch confirmed:** Legacy `id: "microservices"` + filename `s32-microservices.ts` + `PdfReport.tsx:72` `'32. Microsvc'` + `SectionView.tsx:2558` CircuitBreaker demo. Same P0 pattern as S06/S09/S10/S13/S15. **Recommended canonical id:** `feature-engineering-leakage`.
- **S32 → S33 handoff artifact:** `fs-vN` (feature set id, JSON with `median`, `version`, `vocab`, `schema` hash). S33 baseline MUST cite this id. The You Do capstone (`CP-N3-B`) ships Acceptance checks for `version.startswith("fs-v")`, `overlap==0`, `leaky==[]`, `n_e1==2`, `median_amount is not None`.
- **S32 backward link:** S31 (Grafos y evidencia relacional, `s31-streaming-data.ts:6`). The graph-feats subtopic (T2-A) reuses shared_address/degree/path from S31.
- **S32 vocabulary:** `REQUEST_*` (4 codes: REQUEST_CATALOG, REQUEST_MEDIAN, REQUEST_GRAPH_FEAT, REQUEST_WINDOW, REQUEST_FIT_STATE, REQUEST_STATE_JSON, REQUEST_SPLIT_KEYS, REQUEST_FEATURE_SET_ID — 8 total), `REJECT_*` (8 codes: REJECT_UNKNOWN_FEATURE, REJECT_SILENT_FILL, REJECT_LABEL_AS_FEATURE, REJECT_FUTURE_TS, REJECT_TRANSFORM_BEFORE_FIT, REJECT_UNVERSIONED, REJECT_ENTITY_OVERLAP, REJECT_LEAKAGE). Fail-closed vocabulary continues into S33 baseline.
- **S32 readability baseline:** FH 80.96 (`fácil`), INFLESZ 77.20 (`bastante_fácil`), WPS 12.76, SPW 1.79. After P0-D + P1 fixes, expect FH ~82, WPS ~11.5.
- **S32 grammar real findings:** 5 (2 `vs` → `vs.`, 2 `y indicator` → `e indicator`, 1 `[t-w,t)` → `[t-w, t)`). Filter 855 MORFOLOGIK false positives (tech terms: feature, serve, train, median, skew, leakage, silent_fill, catalog, fit, transform, vocab, schema, pipeline, ColumnTransformer, cpn3b, fs-vN, note_len, etc.).
- **S32 anti-fraud guardrail:** Explicit and consistent. "Features de contacto o shared address **no** son etiqueta de fraude ni parentesco" appears in Theory L33, T2-A callout, We Do feedback L1014, You Do rubric (20 % weight), and self-check #4. No claims of automated fraud/parentesco detection.
- **S32 master roadmap mismatch:** `el_arte_de_python_roadmap_maestro_52_secciones.md:294` says "Sección 32 — Computer Vision Workflows" (legacy, pre-V3). V3 roadmap (`learning_roadmap_52_V3.md:472`) and the actual code agree on "Feature engineering y pipelines sin leakage". The master roadmap file is stale and should be updated.
- **S32 → S33 contract:** S33 must NOT reuse `fs-v1` silently if vocab/schema changed; must cite the new `fs-vN` id. The S33 baseline must NOT train if `overlap > 0` or `leaky != []`. These gates are documented in S32 T4-B and reinforced in the You Do context.

---

## 10. Method Note (Grammar / Style / Structure Audit)

### Research basis
Per `_GRAMMAR_SUBPLAN.md`, the following research-backed methods were applied:

1. **Spanish readability formulas (surface metrics):**
   - **Fernández-Huerta (1959):** `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation. Bands: ≥90 muy fácil → <30 muy difícil. For technical Spanish curriculum, "normal / bastante difícil" (~50–70) is healthy; extreme easy may mean under-teaching; extreme hard means cognitive overload. Section 32 aggregate FH = 80.96 (`fácil`) — slightly easy but appropriate for a Phase-2 senior section that introduces many English loanwords.
   - **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syllables/word) − (words/sentence)`. Section 32 aggregate INFLESZ = 77.20 (`bastante_fácil`).
   - **Words per sentence (WPS):** Section 12.76 (under the 15–32 target band; on the easy side).
   - **Syllables per word (SPW):** Section 1.79 (normal for Spanish technical writing).

2. **Rule-based grammar & style engine:**
   - **LanguageTool** (`language=es`) via public HTTP API (`https://api.languagetool.org/v2/check`). 2 chunks of ~18k chars each, 4s sleep between requests. 909 raw matches; 855 were `MORFOLOGIK_RULE_ES` spelling false-positives on English code identifiers; 54 non-spelling matches → ~5 real findings after manual triage.

3. **Pedagogical Spanish heuristics (offline, 19 rules):**
   - Run-on (>45 words) / long (>32) sentences; missing terminal `.?!`; missing `¿` / `¡`; unbalanced `()[]«»""`; repeated word; rough DET–NOUN number cue; English-dominant sentence; meta/AI/TODO leak; gerund pile-up (≥3); high comma density; paragraph = one long sentence; anaphoric monotony; space-before-punct / double space; `CASO-LIM` taxonomy visible; subtopic ID in prose; `vs` without period; Latin abbreviations (`i.e.`, `e.g.`); anglicisms. 172 raw findings (1 H false-positive, 134 M (62 real), 37 L).

4. **Composite section score:** Start at 10; subtract weighted high/medium/low findings; light penalty if FH is extreme; density-normalize by sentence count. Section 32 composite: **7.4 / 10** (−1.5 for H-1/H-2/H-3/H-4 meta-leaks; −0.5 for M-1 through M-5 grammar/style; −0.6 for visible-on-live-site demo mismatch).

### Validation
- Nonzero prose extraction (200 records, 282 sentences, 3 598 words). ✅
- FH in plausible range (80.96, well within the 30-90 Spanish range). ✅
- LT false-positive classes documented (855 MORFOLOGIK on tech terms, 5 ES_UNPAIRED_BRACKETS on half-open intervals, 12 SINGLE_CHARACTER on code identifiers, 7 DIACRITICS_OTHERS on `solo` adverbial use under RAE 2010 reform). ✅
- All findings have severity, cause signal, and improvement proposal. ✅

### Limitations
- The half-open interval `[t−w, t)` triggers `ES_UNPAIRED_BRACKETS` and the heuristic `unbalanced_delim`. Both are false positives; the notation is mathematically correct.
- The `meta_leak` heuristic matches "todo" case-insensitively (Spanish for "all"). False positive on L810.
- The `english_dominant` heuristic flags short gate-vocabulary strings (`REJECT_*`, `REQUEST_*`). False positive; these strings are mostly Spanish with English identifiers in inline code spans.
- LanguageTool public API rate-limited to ~20 req/min; 2 chunks of 18k chars each were sufficient for Section 32 (21 237 chars total). No throttling errors.

---

## 11. Final Statement

This is the complete Explorer report for Section 32. Ready for the Fixer prompt.

**Section 32 composite score: 7.4 / 10.**

| Dimension | Score | Notes |
|-----------|-------|-------|
| Pedagogical structure (I/We/You/Self-check) | 9 / 10 | Gold-standard triadic contract; 8 demos × 24 exercises × capstone × 10 MCQs. |
| Cognitive load & progressive disclosure | 8 / 10 | E3 transfer instructions slightly dense (5 long sentences). |
| Connective tissue & narrative flow | 9 / 10 | Strong S31 bridge + S33 handoff. |
| Anti-fraud / privacy guardrails | 10 / 10 | Exemplary; explicit and consistent across all tabs. |
| Meta-leak (id + demo + pdf) | 3 / 10 | Two HIGH-severity leaks (SectionView demo, PdfReport label) visible on live site. |
| Meta-leak (taxonomy + subtopic IDs) | 4 / 10 | `CASO-LIM-032` × 24 in starterCode; `S32-T*-E*` × 62 in prose. |
| Grammar & redaction (Spanish) | 8 / 10 | ~5 real findings (`vs.`, `e indicator`, `[t-w, t)`); 855 LT false positives. |
| Readability (FH / INFLESZ / WPS) | 9 / 10 | FH 80.96, INFLESZ 77.20, WPS 12.76 — healthy for technical Spanish. |
| Exercise quality & alignment | 9 / 10 | DEFECT-then-fix pattern; concrete tests; well-aligned distractors. |
| Consistency with roadmap | 8 / 10 | V3 roadmap matches; master roadmap is stale (says "Computer Vision Workflows"). |

**Top 3 fixes (P0):**
1. Rename `id: "microservices"` → `"feature-engineering-leakage"` and replace the `SectionView.tsx` demo block (eliminates Circuit Breaker meta-leak in `Pruébalo tú mismo`).
2. Update `PdfReport.tsx:72` from `'32. Microsvc'` → `'32. Features sin leakage'`.
3. Drop `# CASO-LIM-032 · …` from all 24 `starterCode` first-line comments and reframe `CASO-LIM-032` as "caso de uso interno" in the 3 prose fields that mention it.

**Top 3 fixes (P1):**
4. Drop subtopic ID prefixes (`S32-T*-E*:`, `S32-T*-E* ·`) from 8 callout contents + 24 instructions + 24 feedbacks.
5. Split the tagline (40-word single-sentence) into two sentences with a period.
6. Split the 4 E3 transfer instructions (32-37 words each) into 3-branch lists (CONTINUE / REJECT / REQUEST).

This is the complete Explorer report for Section 32. Ready for the Fixer prompt.
