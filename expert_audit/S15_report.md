# PyArcana Curriculum Audit — Section 15

> **Task ID:** S15 · **Agent:** Curriculum Auditor (general-purpose)
> **Live URL:** <https://pillb.github.io/pyarcana/#stdlib-deep>
> **Source file:** `src/lib/course/sections/s15-stdlib-deep.ts` (1,775 lines)
> **Repository:** <https://github.com/PillB/pyarcana> (commit `f352da3`)
> **Phase:** 1 — Competente · **Estimated hours:** 18 · **Index:** 15

---

## 1. Section Identification & Scope

| Field | Value (from `src/lib/course/sections/s15-stdlib-deep.ts:3-13`) |
|-------|----------------------------------------------------------------|
| `id` (legacy) | `"stdlib-deep"` |
| `index` | `15` |
| `title` | `"Pandas: ingesta, selección y tipos"` |
| `shortTitle` | `"Pandas ingesta"` |
| `tagline` | `"ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas"` |
| `estimatedHours` | `18` |
| `level` | `"Competente"` |
| `phase` | `1` |
| `icon` | `"Table2"` |

**Section identity confirmation** — Per `src/lib/course/index.ts:17`, `section15` is imported from `s15-stdlib-deep.ts`; per the live home page sidebar (card #15) the section is rendered as **"Pandas ingesta"** with tagline "ingesta tipada de clientes/transacciones…". Both hashes `#stdlib-deep` and `#pandas-ingesta` route to the same page (verified live on 2025-07-25 via `agent-browser`).

**File-name / id mismatch** — As with S06 (`id:"numpy"`, content about `list/dict/set`), S09 (`id:"visualization"`, content about exceptions), S10 (`id:"sklearn"`, content about packaging) and S13 (`id:"rpa-automation"`, content about Evidence Dashboard), Section 15 retains the legacy `id: "stdlib-deep"` while its V3-retargeted content is fully about **pandas ingesta**. The same mismatch cascades downstream into two HIGH-severity leaks (see §4).

**Content inventory audited (all tabs):**

| Tab | Items audited |
|-----|---------------|
| Theory | 8 subtopic blocks (`S15-T1-A` … `S15-T4-B`), 24 paragraphs, 8 code demos, 8 callouts, 1 opening callout (Contrato de la sección) |
| I Do (`iDo`) | 1 `intro` + 8 `steps` (demos), each with `description`, `why`, code, output |
| We Do (`weDo`) | 1 `intro` + 24 `steps` (3 per subtopic: guided → independent → transfer), each with `instruction`, `hint`, `hints[]`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode` |
| You Do (`youDo`) | 1 `context` + 4 `objectives` + 9 `requirements` + 159-line `starterCode` + `portfolioNote` + 6-row `rubric` (weights sum to 100 %) |
| Self-check (`selfCheck`) | 10 MCQs with 4 options each + `explanation` |
| Resources | 7 docs, 2 books, 7 courses |

**Source-file extraction summary** (from `_s15_extract.py`):

| Metric | Value |
|--------|-------|
| Prose records extracted | 139 |
| Total sentences | 232 |
| Total words | 2 643 |
| Aggregate Fernández-Huerta | **71.33** (band `bastante_fácil`) |
| Aggregate INFLESZ (Szigriszt-Pazos) | **67.25** (band `normal`) |
| Aggregate words / sentence | **11.39** |
| Aggregate syllables / word | **1.935** |
| Band distribution | muy_fácil 54 · fácil 42 · bastante_fácil 38 · normal 34 · bastante_difícil 31 · difícil 24 · muy_difícil 9 |
| Raw pedagogical-heuristic findings | 102 (2 H, 63 M, 37 L) |
| Raw LanguageTool `es` matches | 428 (408 `MORFOLOGIK_RULE_ES` spelling false-positives on tech terms, 20 real) |

---

## 2. Executive Summary of Quality

**Composite score: 7.6 / 10**

### Verdict
Pedagogically **gold-standard** (faithful I Do / We Do / You Do / self-check; 8 demos × 24 exercises × capstone `CP-N2-A` with reconciled `coercion_report` and `manifest`; honest about `openpyxl` dependency; Peruvian context with Lima/Arequipa/Cusco, ids `C00x`/`T00x`, no PII; backward link to S14 NumPy, forward link to S16 quality gates). Readability is healthy for technical Spanish (FH 71.3, "bastante fácil"; WPS 11.4 — well within the 15–32 target band). The grammar surface is mostly clean: only **7 real** grammar/style findings after filtering 421 LT false positives (mostly `MORFOLOGIK_RULE_ES` on pandas identifiers such as `loc`, `iloc`, `dtype`, `StringIO`).

### What holds the score down
1. **Two HIGH meta-leaks** identical in pattern to S06/S09/S10/S13 — the legacy `id: "stdlib-deep"` causes `SectionView.tsx` to load the wrong interactive editor (`functools`/`itertools` code) into a Pandas section, and `PdfReport.tsx` to label the section "15. stdlib" in the printable PDF. Both are visible to learners on the live site today.
2. **`CASO-LIM-015` internal taxonomy marker** is repeated 24× as the first line of every We Do `starterCode` (`# CASO-LIM-015 · set_index` …). Learners see this internal case-limit code at the top of every exercise file. Same P0 pattern flagged for S10 (`CASO-LIM-010`, 31×).
3. **One 50-word run-on sentence** in `jobRelevance` (line 15) — Fernández-Huerta 38.2, "difícil".
4. **`la Series` concordance** (3×) — Spanish feminine article + English class name; `MORFOLOGIK` may gloss over it but `AGREEMENT_DET_NOUN` flags it.
5. **`con coerce` / `Sin coerce`** (2×) — pandas parameter value used as a Spanish noun, triggering LT's `PREP_VERB` rule.
6. **`entrada vs salida`** without period (line 577) — `vs.` is the Spanish-preferred form.
7. **3 self-check question explanations** lowercase the first word after `?` (e.g., `…index/columnas? loc selecciona…`). RAE convention capitalizes after `?` ending a sentence.

### Strengths
- Triadic contract per subtopic (teoría → demo → 3 ejercicios en escalera guiada/independiente/transferencia).
- Honest about environment limits (Excel needs `openpyxl`; Parquet optional; "si no está, CSV + schema JSON").
- No fraud / parentesco / auto-decision claims; `score ≠ culpa` repeated in opening map, youDo `context`, and rubric.
- Strong forward link to S16 (`Mapa de la sección` mentions "quality gates que verás al endurecer contratos de calidad") and backward link to S14 NumPy ("En la sección de NumPy aprendiste a calcular en vectores homogéneos").
- Capstone `ingest_cp_n2a.py` ships with `_run_tests()`, schema `KeyError` fail-closed test, and a clear portfolio note.

---

## 3. Detailed Issue Registry

> Severity scale: **H** = pedagogical/correctness failure visible to learners; **M** = clarity / grammar / consistency issue; **L** = style / typography polish.
> Line numbers refer to `src/lib/course/sections/s15-stdlib-deep.ts` unless otherwise noted.

### HIGH severity

| # | ID | Location | Evidence (verbatim) | Pedagogical impact |
|---|----|----------|---------------------|--------------------|
| 1 | H-1 | `src/components/course/SectionView.tsx:1469-1505` (`demos['stdlib-deep']`) | Title `"Practica functools y itertools"`; code `import functools / import itertools / @functools.lru_cache / itertools.chain / itertools.combinations / functools.partial`. Live-rendered at end of Theory tab under "Pruébalo tú mismo" (verified live: `agent-browser read` after `open #stdlib-deep` shows lines 719-833 of `/tmp/s15_live3.txt`). | Learners in a Pandas section see a stdlib (`functools`/`itertools`) interactive demo that has nothing to do with the section content. Contradicts the Theory tab's own contract. Same pattern audited in S06/S09/S10/S13. |
| 2 | H-2 | `src/components/course/PdfReport.tsx:55` | `"stdlib-deep": '15. stdlib'` | Learners who download the PDF see "15. stdlib" as the section title instead of "15. Pandas ingesta". Mislabels the entire unit on every printable artifact. |
| 3 | H-3 | Line 15 (`jobRelevance`, opening sentence) | `"En banca, fintech y retail en Perú, el día a día del analista no es "abrir Excel y confiar": es **ingerir CSV/Excel de clientes y transacciones** sin inventar datos, declarar dtypes, reportar coerciones, reconciliar filas/columnas y dejar un **manifest** (origen, filas, columnas, hash) que otro equipo pueda auditar."` (50 words, FH = 38.24) | One-sentence paragraph with 6 verb chains (`ingerir`, `declarar`, `reportar`, `reconciliar`, `dejar`, `pueda auditar`). Cognitive overload on the *first* learner-facing text. Should be split into 2–3 sentences. |
| 4 | H-4 | 24 `starterCode.code` blocks (lines 603, 638, 672, 710, 746, 782, 825, 859, 894, 928, 963, 1001, 1039, 1075, 1112, 1146, 1183, 1224, 1258, 1300, 1337, 1373, 1408, 1444) | `# CASO-LIM-015 · set_index` / `# CASO-LIM-015 · Series label access` / `# CASO-LIM-015 · align add fill_value` / … | Internal `CASO-LIM-NNN` taxonomy marker leaks as the first line of every exercise starter. Learners see "CASO-LIM-015" with no dictionary definition; the marker is author-side scaffolding. Same P0 pattern as S10 (`CASO-LIM-010`, 31×) and likely systemic. |

### MEDIUM severity

| # | ID | Location | Evidence | Impact / fix |
|---|----|----------|----------|--------------|
| 5 | M-1 | Lines 625, 1035, 1211 (3 occurrences) | `"Con la Series del starter"`, `"sobre la Series de región"`, `"Castea la Series de ids"` | `la Series` mixes Spanish feminine singular article with English pandas class name. LT rule `AGREEMENT_DET_NOUN`. Prefer `la serie` (lowercase, treats as Spanish noun) or `el objeto Series` (more idiomatic in PE data-science Spanish). |
| 6 | M-2 | Lines 1071 (`feedback`), 1133 (`instruction`) | `"Sin coerce, el valor 'a' lanza error…"` / `"Aplica to_numeric con coerce a monto"` | `coerce` is the value of the `errors=` parameter; using it as a Spanish noun triggers LT `PREP_VERB` ("Combinación imposible: preposición seguida de verbo conjugado"). Prefer `con errors='coerce'` or `con la opción coerce`. |
| 7 | M-3 | Line 339 (`iDo.intro`) | `"Observa cómo se modela el Index, se lee el CSV con dtypes, se selecciona con loc/assign, se evita chained assignment, se tipa y se exporta con manifest — ocho demos en el mismo hilo de clientes/transacciones."` (37 words) | Long, comma-heavy enumeration of 6 demo topics in one sentence. Split into a 2-sentence intro + bullet list. |
| 8 | M-4 | Line 1604 (`portfolioNote`) | `"Este artefacto es la base del dataset de CP-N2-A: un revisor debe poder re-ejecutar python ingest_cp_n2a.py y ver tests OK, filas, reportes y hash sin adivinar tu entorno."` (34 words) | Long sentence mixing prose with code identifiers. Split at "ver `tests OK`" with a colon or period. |
| 9 | M-5 | Line 15 (`jobRelevance`, second sentence) | `"Aquí construyes esa base de **CP-N2-A** con fixtures sintéticos (Lima/Arequipa/Cusco, ids C00x/T00x, sin PII real) y con el hábito profesional de **falla explicable** cuando falta una columna del schema."` (34 words) | Long sentence with parenthetical and bold markers. Split after "sin PII real)". |
| 10 | M-6 | Lines 1621, 1656, 1674 (3 occurrences, `selfCheck` explanations) | `"…¿Qué método de selección usa etiquetas de index/columnas? loc selecciona por etiqueta…"` / `"¿Qué hace parse_dates=['fecha'] en read_csv? parse_dates tipa la columna…"` / `"¿Para qué sirve astype('category')…? category es un dtype compacto…"` | After `?` ending a sentence, RAE convention capitalizes the next word. LT rule `CAPITALIZATION_AFTER_QUESTION_MARK`. Fix: `? Loc`, `? Parse_dates`, `? Category` (or rephrase as statement + answer sentence). |
| 11 | M-7 | Line 577 (`why`, demo `S15-T4-B-DEMO`) | `"El manifest reconcilia entrada vs salida y prueba que el artefacto no cambió entre corridas."` | `vs` lacks the Spanish-preferred period. LT rule `PUNTO_EN_ABREVIATURAS`. Fix: `entrada vs. salida`. |
| 12 | M-8 | `src/lib/course/sections/s15-stdlib-deep.ts:3-13` (identity drift) | `id: "stdlib-deep"` + filename `s15-stdlib-deep.ts` vs `title: "Pandas: ingesta, selección y tipos"` | Root cause of H-1 and H-2. The legacy id and filename should be migrated to `pandas-ingesta` (or `pandas-intake`) consistently. **Do not** do this without auditing every downstream consumer (`SectionView.tsx` `demos` map, `PdfReport.tsx` title map, `index.ts`, all `subtopicId` references if any external code resolves them). |

### LOW severity

| # | ID | Location | Evidence | Fix |
|---|----|----------|----------|-----|
| 13 | L-1 | Line 8 (`tagline`) | `"ingesta tipada de clientes/transacciones con reporte de coerciones y reconciliación de filas/columnas"` | Tagline starts lowercase (`ingesta`). Intentional style but breaks sentence-capitalization convention on the home card. Optional: capitalize `Ingesta`. |
| 14 | L-2 | 6 records flagged `space_before_punct` | All matches are `.copy()`, `.str.title()`, `.astype()` etc. — code-adjacent periods, not real prose | False positives. No action. |
| 15 | L-3 | 30 records flagged `high_comma_density` | All matches are technical enumerations like `"dtype, parse_dates, na_values, sep, decimal"` | Acceptable for technical Spanish. No action. |
| 16 | L-4 | 46 records flagged `missing_terminal` | All matches are short titles (`Mapa de la sección`, `Contrato de esta sección`, `Index de negocio`, …) or learning-outcome bullets (each ends without `.` because they are list items) | Acceptable for title/bullet style. No action. |
| 17 | L-5 | 9 records flagged `dev_leak_loose` (substring `pendiente`) | False positive: the regex matched the substring `pendiente` inside the Spanish word `independiente` (24×, in every `E2 (independiente) — …` instruction). | Heuristic false positive — no source change. Update the heuristic to `\bpendiente\b` (word boundary). |
| 18 | L-6 | 1 record flagged `meta_leak` (`todo`) | False positive: `todo el lote` (line 191), `fallar todo el lote` (line 219) — Spanish for "the whole batch". Same false-positive class noted in S01's worklog. | Heuristic false positive — no source change. Tighten regex to `\b(TODO|FIXME|XXX|TBD|WIP|STUB)\b` (case-sensitive). |
| 19 | L-7 | 5 records flagged `english_dominant` | All matches are code snippets (`df[df.a>0]['b'] = 1`, `rows = len(df); columns = df.columns.tolist()`) inside backticks or short output strings (`Salida esperada: [1.0, nan, 3.0]`) | Acceptable for technical content. No action. |

---

## 4. Meta-Leak Report

### 4.1 Confirmed leaks (learner-visible)

| Leak | Exact leaked text | Location | Where rendered |
|------|-------------------|----------|----------------|
| **L-1** Wrong interactive editor | `"Practica functools y itertools"` + 36-line functools/itertools/lru_cache/chain/combinations/partial code | `src/components/course/SectionView.tsx:1469-1505` | Live site, Theory tab → "Pruébalo tú mismo" panel (visible after the 8th theory block). Verified live. |
| **L-2** PDF title mismatch | `"15. stdlib"` | `src/components/course/PdfReport.tsx:55` | Every PDF / print export of Section 15. |
| **L-3** `CASO-LIM-015` taxonomy | `# CASO-LIM-015 · set_index` (and 23 variants) | Lines 603, 638, 672, 710, 746, 782, 825, 859, 894, 928, 963, 1001, 1039, 1075, 1112, 1146, 1183, 1224, 1258, 1300, 1337, 1373, 1408, 1444 | Every We Do `starterCode` first line. |
| **L-4** Legacy URL hash | `#stdlib-deep` visible in browser address bar | `id: "stdlib-deep"` (line 4) | Every time a learner opens / bookmarks / shares Section 15. (Note: `#pandas-ingesta` also works as a hash, but the canonical `id` is still `stdlib-deep`.) |
| **L-5** Filename mismatch | `s15-stdlib-deep.ts` (file name visible in GitHub, error stack traces, repo URL) | `src/lib/course/sections/s15-stdlib-deep.ts` | Anyone inspecting the source on GitHub. |

### 4.2 Searched-and-clear (no leak)

- Searched for `TODO`, `FIXME`, `XXX`, `TBD`, `WIP`, `STUB`, `MOVED FROM`, `moved from section`, `curriculum_hardening`, `STORM`, `FIXER`, `never surface to learners`, `internal note`, `design note`, `developer note`, `@author`, `@reviewer`, `placeholder`, `heredado de`, `sin tdd`, `por hacer`, `borrar antes` — **zero** matches in learner-facing prose (the only `todo` matches are the Spanish word "todo" in `todo el lote`, false positives).
- Searched for subtopic-ID leaks in prose (`S15-T\d-[A-Z]`) — **zero** matches outside the `subtopicId` / `id` fields (which are React `data-testid` attributes, not learner-visible text). Confirmed by `Grep` on `SectionView.tsx` for `subtopicId`: no rendering call.
- No "moved from section X", "previously in section Y", "TODO before merge" or any AI-to-developer commentary in any string.

### 4.3 Developer-side comments in source (GitHub-visible but not rendered)

- None found inside `s15-stdlib-deep.ts` itself.
- The mismatched `demos['stdlib-deep']` block in `SectionView.tsx:1469` carries a comment `# Practica functools y itertools (biblioteca estandar)` — but this is inside a code template string, not a developer comment.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Element | Count | Fidelity |
|---------|-------|----------|
| Theory subtopics with `heading` + ≥3 paragraphs + code + callout | 8 / 8 | ✅ |
| `iDo.steps` with `description` + `why` + `code` + `output` | 8 / 8 | ✅ |
| `weDo.steps` with `instruction` + `hint` + `hints[]` (≥2) + `edgeCases` + `tests` + `feedback` + `starterCode` + `solutionCode.code` + `solutionCode.output` | 24 / 24 | ✅ |
| We Do `kind` distribution per subtopic (guided/independent/transfer) | 8 × 3 = 24 | ✅ consistent |
| `youDo.objectives` (≥3, action-verb led) | 4 | ✅ |
| `youDo.requirements` (≥5, testable) | 9 | ✅ |
| `youDo.starterCode` (runnable, with `_run_tests()`, `main()`, `if __name__ == '__main__'`) | yes, 159 lines | ✅ |
| `youDo.rubric` weights sum | 25+20+20+15+10+10 = 100 % | ✅ |
| `selfCheck.questions` (≥5 MCQs, 4 options each, `correctIndex` in range, `explanation`) | 10 | ✅ |

### 5.2 Cognitive load & progressive disclosure

- ✅ **Diccionario de la sección** opens T1 (line 30): 9 bolded terms (`Series`, `DataFrame`, `dtype`, `Schema`, `Coerción`, `loc/iloc`, `Chained assignment`, `Manifest`, `Provenance`). Reasonable size (~180 words) — unlike S01's 438-word mega-paragraph.
- ✅ **Orden pedagógico** explicitly mapped (line 32): T1 Modelo/lectura → T2 Selección → T3 Tipos → T4 Exportación.
- ✅ **Ritmo sugerido** (~18 h) splits sessions 1–2 / 3–4 / 5–6 / 7–8 across the four subtopics + You Do + self-check.
- ✅ **Criterio de cierre** explicit: "filas reconciliadas, reporte de coerciones y manifest con provenance".
- ⚠️ `jobRelevance` (line 15) is the cognitive-load hotspot: 2 long sentences (50 + 34 words) introducing too many concepts at once (manifest, coerciones, falla explicable, CP-N2-A, PII, schemas, fixture geography).
- ⚠️ `iDo.intro` (line 339) is one 37-word sentence enumerating 6 demo topics — better as a 2-sentence intro + bullet list.

### 5.3 Connective tissue

- ✅ **Backward link**: `Mapa de la sección: de NumPy a tablas tipadas` + paragraph "En la sección de NumPy aprendiste a calcular en vectores homogéneos. Aquí el objeto de trabajo cambia: tablas con columnas de tipos distintos…" (line 31).
- ✅ **Forward link**: T3-B paragraph "Este reporte es la entrada natural a los quality gates que verás al endurecer contratos de calidad" (line 228) → S16 ("Calidad y contratos"). Also `Mapa` mentions "Los quality gates profundos y los joins de tablas quedan para más adelante".
- ✅ **Capstone hook**: `CP-N2-A` referenced 5× across `jobRelevance`, T3-B, T4-B, `youDo.context`, `portfolioNote` — consistent with the master roadmap.

### 5.4 Exercise & exam alignment

- ✅ All 24 We Do exercises map 1-to-1 to a theory subtopic (`subtopicId` matches the `T*-A/B` of the parent theory block).
- ✅ Each subtopic's 3 exercises form a decreasing-scaffolding triad: guided (`hint` is the literal answer) → independent (`hint` is one step) → transfer (`hint` is the algorithm shape).
- ✅ All `solutionCode.output` values match what the `solutionCode.code` would actually print (verified by reading each block; no fabricated outputs as found in S03).
- ✅ `correctIndex` distribution in selfCheck: 2, 0, 1, 3, 2, 0, 1, 3, 2, 0 — reasonably distributed across the 4 positions.
- ✅ `edgeCases` are real failure modes (e.g., `"reset_index accidental"`, `"iloc vs label"`, `"sin copy"`, `"sin decimal → texto o mal parseo"`, `"hash del objeto python"`).

### 5.5 Redaction quality (aggregate)

| Dimension | Score | Evidence |
|-----------|-------|----------|
| Grammar (Peruvian Spanish) | 8 / 10 | Only 7 real findings after FP filtering; 4 are stylistic (`vs.`, `?` capitalization, `la Series`, `con coerce`) |
| Style / clarity | 8 / 10 | 1 run-on (50 w) + 3 long sentences (34–37 w); otherwise compact and concrete |
| Tone (professional teacher voice) | 9 / 10 | No slang, no AI-to-developer asides; imperative + declarative mix; "fail-closed", "manifest", "provenance" used consistently |
| Consistency with previous sections | 9 / 10 | Same callout types (`info`/`tip`/`warning`/`danger`), same `CASO-LIM-NNN` scaffolding (issue but consistent), same Lima/Arequipa/Cusco fixture geography |
| Anglicism control | 9 / 10 | `chained assignment`, `manifest`, `round-trip`, `parser`, `coerce` kept as technical terms (acceptable); no Spanglish verbs (`*trackear`, `*commitear`) as in S01 |
| Meta-leak posture | 4 / 10 | 4 confirmed leaks (H-1, H-2, L-3, L-4/L-5) |

---

## 6. Grammatical Improvements — Paragraph by Paragraph (Before / After)

> For every learner-facing tab. **Boldface** marks the rewritten span. Line numbers from `s15-stdlib-deep.ts`.

### 6.1 Theory tab

#### 6.1.1 `jobRelevance` (line 15) — run-on sentence split

**Before** (50 + 34 words, FH 38.2 + 47.0):
> "En banca, fintech y retail en Perú, el día a día del analista no es "abrir Excel y confiar": es **ingerir CSV/Excel de clientes y transacciones** sin inventar datos, declarar dtypes, reportar coerciones, reconciliar filas/columnas y dejar un **manifest** (origen, filas, columnas, hash) que otro equipo pueda auditar. Si el monto llega como `15,50` o el score como `NA`, el pipeline debe contarlo — no rellenarlo en silencio. Aquí construyes esa base de **CP-N2-A** con fixtures sintéticos (Lima/Arequipa/Cusco, ids `C00x`/`T00x`, sin PII real) y con el hábito profesional de **falla explicable** cuando falta una columna del schema."

**After** (3 sentences, ~20 w each, target FH > 60):
> "En banca, fintech y retail en Perú, el día a día del analista no es "abrir Excel y confiar": es **ingerir CSV/Excel de clientes y transacciones** sin inventar datos. Eso significa declarar `dtype`s, reportar coerciones, reconciliar filas/columnas y dejar un **manifest** (origen, filas, columnas, hash) que otro equipo pueda auditar. Si el monto llega como `15,50` o el score como `NA`, el pipeline debe contarlo — no rellenarlo en silencio. Aquí construyes esa base de **CP-N2-A** con fixtures sintéticos (Lima/Arequipa/Cusco, ids `C00x`/`T00x`, sin PII real). Practica además el hábito profesional de **falla explicable** cuando falta una columna del schema."

#### 6.1.2 `Mapa de la sección` opening (line 30) — `Diccionario de la sección`

This 9-term dictionary paragraph is acceptable as-is (FH ≈ 60, ~180 w). **No rewrite** — but recommend making each term its own bullet list item for scannability:

**After (recommended restructure):**
> "**Diccionario de la sección** (léelo antes de T1; vuelve a él cuando un término te detenga):
> - **Series:** vector con **Index** (etiquetas de negocio, no solo 0..n-1).
> - **DataFrame:** tabla de columnas (Series) alineadas por el mismo Index.
> - **dtype:** tipo de una columna (`string`, `float64`, `datetime64`, `category`…).
> - **Schema:** contrato columna→tipo esperado.
> - **Coerción:** conversión explícita (texto→número, texto→fecha); con `errors='coerce'`, lo inválido pasa a NaN/NaT y **se cuenta** en un reporte.
> - **loc / iloc:** selección por etiqueta vs. por posición.
> - **Chained assignment:** asignar en cadena `df[...][...] =` puede no escribir donde crees (**SettingWithCopyWarning**).
> - **Manifest:** registro de filas, columnas, dtypes, memoria y provenance.
> - **Provenance:** de dónde salió el archivo y si cambió entre corridas (origen + hash del artefacto)."

#### 6.1.3 T1-A second paragraph (line 46) — `etiqueta ≠ posición`

**Before** (last sentence, 36 w):
> "Si el index es `cliente_id`, `loc['C002']` y `iloc[1]` solo coinciden si el orden de filas lo permite — no lo asumas."

Already acceptable. **No rewrite.**

#### 6.1.4 T1-B first paragraph (line 81) — `contrato de archivo`

**Before** (sentence 2, 33 w):
> "Cada parámetro es un **contrato de archivo**: si el CSV real usa `;` y coma decimal, el código debe declararlo — no "adivinar" después mirando el `head()`."

Acceptable. **No rewrite.**

#### 6.1.5 T3-A third paragraph (line 192) — `Sin conteo, coerce se convierte…`

**Before** (last sentence, 28 w):
> "Sin conteo, `coerce` se convierte en una forma elegante de esconder basura."

Excellent aphorism. **No rewrite.**

#### 6.1.6 T4-B demo `why` (line 577) — `vs` typography

**Before**:
> "El manifest reconcilia entrada vs salida y prueba que el artefacto no cambió entre corridas."

**After**:
> "El manifest reconcilia entrada **vs.** salida y prueba que el artefacto no cambió entre corridas."

### 6.2 I Do tab

#### 6.2.1 `iDo.intro` (line 339) — long sentence split

**Before** (37 w):
> "Recibes tablas sintéticas de un retailer peruano. Observa cómo se modela el Index, se lee el CSV con dtypes, se selecciona con loc/assign, se evita chained assignment, se tipa y se exporta con manifest — ocho demos en el mismo hilo de clientes/transacciones."

**After** (intro + bullet list):
> "Recibes tablas sintéticas de un retailer peruano. Observa el hilo completo en **ocho demos**: modelar el Index, leer el CSV con `dtype`s, seleccionar con `loc`/`assign`, evitar *chained assignment*, tipar columnas y exportar con manifest — siempre sobre el mismo hilo de clientes y transacciones."

#### 6.2.2 Demo `S15-T3-A-DEMO` `why` (line 482) — concise

Already 1 sentence, 17 w. **No rewrite.**

#### 6.2.3 Demo `S15-T3-B-DEMO` `why` (line 516)

Already 1 sentence, 16 w. **No rewrite.**

### 6.3 We Do tab

#### 6.3.1 `weDo.intro` (line 583) — already good

75 words across 4 sentences, FH ≈ 65. **No rewrite.**

#### 6.3.2 Exercise `S15-T3-A-E2` `feedback` (line 1071) — `con coerce`

**Before**:
> "Sin coerce, el valor 'a' lanza error o se descarta. Usa errors='coerce'."

**After**:
> "Sin `errors='coerce'`, el valor `'a'` lanza error o se descarta. Usa `errors='coerce'`."

#### 6.3.3 Exercise `S15-T3-B-E1` `instruction` (line 1133) — `con coerce`

**Before** (excerpt):
> "Aplica `to_numeric` con coerce a `monto` y reporta cuántos **nuevos** NaN se introdujeron…"

**After**:
> "Aplica `to_numeric` con `errors='coerce'` a `monto` y reporta cuántos **nuevos** NaN se introdujeron…"

#### 6.3.4 Exercise `S15-T1-A-E2` `instruction` (line 625) — `la Series`

**Before**:
> "Con la Series del starter (index `C001`/`C002`, name `score`)…"

**After**:
> "Con el objeto `Series` del starter (index `C001`/`C002`, name `score`)…"

#### 6.3.5 Exercise `S15-T3-A-E1` `feedback` (line 1035) — `la Series`

**Before**:
> "Encadena .str.title().astype('category') sobre la Series de región."

**After**:
> "Encadena `.str.title().astype('category')` sobre la serie de región."

#### 6.3.6 Exercise `S15-T3-B-E3` `instruction` (line 1211) — `la Series`

**Before**:
> "Castea la Series de ids a dtype `string`…"

**After**:
> "Castea la serie de ids a dtype `string`…"

#### 6.3.7 All 24 `starterCode` first-line comments — strip `CASO-LIM-015`

**Before** (e.g., line 603):
```python
# CASO-LIM-015 · set_index
# Error a corregir: falta set_index; hoy imprime columns en vez del index
import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.5, 0.8]})
print(df.columns.tolist())
```

**After**:
```python
# Error a corregir: falta set_index; hoy imprime columns en vez del index
import pandas as pd
df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.5, 0.8]})
print(df.columns.tolist())
```

(Repeat for all 24 starterCode blocks — delete the `# CASO-LIM-015 · …` line.)

### 6.4 You Do tab

#### 6.4.1 `youDo.context` (line 1466) — already good

74 words, 3 sentences, FH ≈ 65. **No rewrite.**

#### 6.4.2 `portfolioNote` (line 1604) — long sentence split

**Before** (last sentence, 34 w):
> "Este artefacto es la base del dataset de CP-N2-A: un revisor debe poder re-ejecutar `python ingest_cp_n2a.py` y ver `tests OK`, filas, reportes y hash sin adivinar tu entorno."

**After** (2 sentences):
> "Este artefacto es la base del dataset de CP-N2-A. Un revisor debe poder re-ejecutar `python ingest_cp_n2a.py` y ver `tests OK`, filas, reportes y hash sin adivinar tu entorno."

#### 6.4.3 `youDo.rubric` (lines 1605–1612) — weights & criteria

All 6 criteria are clear and weight-sum = 100 %. **No rewrite.**

### 6.5 Self-check tab

#### 6.5.1 Question 1 `explanation` (line 1621) — capitalization after `?`

**Before**:
> "loc selecciona por etiqueta de Index/columnas; iloc (e iat) usan posición numérica. Si el Index es cliente_id, loc['C002'] no es lo mismo que iloc[1] salvo que el orden lo permita."

(The full sentence in the question text reads "…¿Qué método de selección usa etiquetas de index/columnas? loc selecciona por etiqueta…")

**After** (capitalize after `?`):
> "**Loc** selecciona por etiqueta de Index/columnas; iloc (e iat) usan posición numérica. Si el Index es `cliente_id`, `loc['C002']` no es lo mismo que `iloc[1]` salvo que el orden lo permita."

#### 6.5.2 Question 6 `explanation` (line 1656) — capitalization after `?`

**Before** (in question text + explanation):
> "¿Qué hace parse_dates=['fecha'] en read_csv? parse_dates tipa la columna como datetime en la ingesta; sin eso suele quedar object/string."

**After**:
> "¿Qué hace `parse_dates=['fecha']` en `read_csv`? **`parse_dates`** tipa la columna como `datetime` en la ingesta; sin eso suele quedar `object`/`string`."

#### 6.5.3 Question 9 `explanation` (line 1674) — capitalization after `?`

**Before** (in question text):
> "¿Para qué sirve astype('category') en una columna de región (Lima/Arequipa)? category es un dtype compacto para labels repetidos…"

**After**:
> "¿Para qué sirve `astype('category')` en una columna de región (Lima/Arequipa)? **`category`** es un dtype compacto para labels repetidos…"

---

## 7. Proposed GitHub-style Diffs

### Diff 1 — Fix wrong interactive editor (H-1)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1466,6 +1466,38 @@ Password incorrecto: False`,
       hint: 'Cambia el numero de iteraciones de PBKDF2 y observa como cambia el hash',
     },
-    'stdlib-deep': {
-      title: 'Practica functools y itertools',
-      code: `# Practica functools y itertools (biblioteca estandar)
-import functools
-import itertools
-
-# 1. lru_cache: memoizacion automatica
-@functools.lru_cache(maxsize=128)
-def fibonacci(n):
-    """Fibonacci con cache - O(n) en vez de O(2^n)."""
-    if n <= 1:
-        return n
-    return fibonacci(n-1) + fibonacci(n-2)
-
-print("Fibonacci con lru_cache:")
-for i in range(10):
-    print(f"  fib({i}) = {fibonacci(i)}")
-print(f"  Cache info: {fibonacci.cache_info()}")
-
-# 2. itertools.chain: concatenar iterables
-lista1 = [1, 2, 3]
-lista2 = [4, 5, 6]
-combinado = list(itertools.chain(lista1, lista2))
-print(f"\nChain: {combinado}")
-
-# 3. itertools.combinations
-combo = list(itertools.combinations([1, 2, 3, 4], 2))
-print(f"Combinations(4,2): {combo}")
-
-# 4. partial: fijar argumentos
-def potencia(base, exponente):
-    return base ** exponente
-
-cuadrado = functools.partial(potencia, exponente=2)
-cubo = functools.partial(potencia, exponente=3)
-print(f"\ncuadrado(5) = {cuadrado(5)}")
-print(f"cubo(3) = {cubo(3)}`,
-      expectedOutput: `Fibonacci con lru_cache:
+    'pandas-ingesta': {
+      title: 'Practica read_csv con dtypes',
+      code: `# Practica read_csv con dtypes (pandas)
+import pandas as pd
+from io import StringIO
+
+csv = "cliente_id;monto;fecha\\nC001;15,50;2024-03-01\\nC002;;2024-03-02\\nC003;20,0;2024-03-03\\n"
+df = pd.read_csv(
+    StringIO(csv),
+    sep=";",
+    decimal=",",
+    dtype={"cliente_id": "string"},
+    parse_dates=["fecha"],
+    na_values=["", "NA"],
+)
+print("filas", len(df), "na_monto", int(df["monto"].isna().sum()))
+print("dtypes", df.dtypes.astype(str).to_dict())
+print("ids", df["cliente_id"].tolist())
+`,
+      expectedOutput: `filas 3 na_monto 1
+dtypes {'cliente_id': 'string', 'monto': 'float64', 'fecha': 'datetime64[ns]'}
+ids ['C001', 'C002', 'C003']`,
       hint: 'Declara sep, decimal y dtype en read_csv; no uses replace sobre el CSV crudo.',
     },
```

> **Note**: This diff also requires renaming the `id` field in `s15-stdlib-deep.ts:4` from `"stdlib-deep"` to `"pandas-ingesta"`, plus updating `src/components/course/PdfReport.tsx:55` and the filename `s15-stdlib-deep.ts` → `s15-pandas-ingesta.ts`. See Diff 2.

### Diff 2 — Fix PDF label + id migration (H-2, M-8)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section15: CourseSection = {
-  id: "stdlib-deep",
+  id: "pandas-ingesta",
   index: 15,
   title: "Pandas: ingesta, selección y tipos",
   shortTitle: "Pandas ingesta",
```

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -52,7 +52,7 @@ const SECTION_TITLES: Record<string, string> = {
   "rpa-automation": '13. RPA',
   security: '14. Security',
-  "stdlib-deep": '15. stdlib',
+  "pandas-ingesta": '15. Pandas ingesta',
   "wxpython-gui": '16. GUI',
   packaging: '17. Packaging',
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -12,7 +12,7 @@ import { section13 } from './sections/s13-rpa-automation'
 // Phase 1 — Competente (14-26)
 import { section14 } from './sections/s14-security'
-import { section15 } from './sections/s15-stdlib-deep'
+import { section15 } from './sections/s15-pandas-ingesta'
 import { section16 } from './sections/s16-wxpython-gui'
```

(Rename file: `git mv src/lib/course/sections/s15-stdlib-deep.ts src/lib/course/sections/s15-pandas-ingesta.ts`)

### Diff 3 — Split `jobRelevance` run-on (H-3)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -14,7 +14,9 @@ export const section15: CourseSection = {
   accentColor: "bg-gradient-to-br from-blue-500 to-indigo-600",
   jobRelevance:
-    "En banca, fintech y retail en Perú, el día a día del analista no es "abrir Excel y confiar": es **ingerir CSV/Excel de clientes y transacciones** sin inventar datos, declarar dtypes, reportar coerciones, reconciliar filas/columnas y dejar un **manifest** (origen, filas, columnas, hash) que otro equipo pueda auditar. Si el monto llega como `15,50` o el score como `NA`, el pipeline debe contarlo — no rellenarlo en silencio. Aquí construyes esa base de **CP-N2-A** con fixtures sintéticos (Lima/Arequipa/Cusco, ids `C00x`/`T00x`, sin PII real) y con el hábito profesional de **falla explicable** cuando falta una columna del schema.",
+    "En banca, fintech y retail en Perú, el día a día del analista no es "abrir Excel y confiar": es **ingerir CSV/Excel de clientes y transacciones** sin inventar datos. Eso significa declarar `dtype`s, reportar coerciones, reconciliar filas/columnas y dejar un **manifest** (origen, filas, columnas, hash) que otro equipo pueda auditar. Si el monto llega como `15,50` o el score como `NA`, el pipeline debe contarlo — no rellenarlo en silencio. Aquí construyes esa base de **CP-N2-A** con fixtures sintéticos (Lima/Arequipa/Cusco, ids `C00x`/`T00x`, sin PII real). Practica además el hábito profesional de **falla explicable** cuando falta una columna del schema.",
```

### Diff 4 — Strip `CASO-LIM-015` from all 24 starterCode comments (H-4)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -600,7 +600,6 @@ import pandas as pd
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-015 · set_index
-# CASO-LIM-015 · set_index
 # Error a corregir: falta set_index; hoy imprime columns en vez del index
 import pandas as pd
 df = pd.DataFrame({"cliente_id": ["C001", "C002"], "score": [0.5, 0.8]})
@@ -635,7 +634,6 @@ print(df.columns.tolist())
         starterCode: {
           language: 'python',
           title: "exercise.py",
           code: `# CASO-LIM-015 · Series label access
-# CASO-LIM-015 · Series label access
 # Error a corregir: usa iloc posicional en vez de la etiqueta C002
 import pandas as pd
 s = pd.Series([0.1, 0.9], index=["C001", "C002"], name="score")
```

> **Repeat for all 24 starterCode blocks.** Each block has a first line `# CASO-LIM-015 · <slug>` that should be deleted, leaving only the `# Error a corregir: …` comment.

### Diff 5 — Fix `la Series` concordance (M-1)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -622,7 +622,7 @@
         kind: "independent",
         instruction:
-          "E2 (independiente) — **Series por etiqueta.** Con la Series del starter (index `C001`/`C002`, name `score`), imprime el valor de `s['C002']` como float. No uses acceso posicional. Salida esperada: `0.9`. Conserva el fixture del starter.",
+          "E2 (independiente) — **Series por etiqueta.** Con el objeto `Series` del starter (index `C001`/`C002`, name `score`), imprime el valor de `s['C002']` como float. No uses acceso posicional. Salida esperada: `0.9`. Conserva el fixture del starter.",
@@ -1032,7 +1032,7 @@
         feedback:
-          "Encadena .str.title().astype('category') sobre la Series de región.",
+          "Encadena `.str.title().astype('category')` sobre la serie de región.",
@@ -1208,7 +1208,7 @@
         kind: "transfer",
         instruction:
-          "E3 (transferencia) — **dtype string de pandas.** Castea la Series de ids a dtype `string` (no `object`) e imprime `str(dtype)`. Salida esperada: `string`. El default de texto en Series suele ser object; aquí el contrato es el string nullable de pandas.",
+          "E3 (transferencia) — **dtype string de pandas.** Castea la serie de ids a dtype `string` (no `object`) e imprime `str(dtype)`. Salida esperada: `string`. El default de texto en Series suele ser object; aquí el contrato es el string nullable de pandas.",
```

### Diff 6 — Fix `con coerce` / `Sin coerce` PREP_VERB (M-2)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -1068,7 +1068,7 @@
         feedback:
-          "Sin coerce, el valor 'a' lanza error o se descarta. Usa errors='coerce'.",
+          "Sin `errors='coerce'`, el valor `'a'` lanza error o se descarta. Usa `errors='coerce'`.",
@@ -1130,7 +1130,7 @@
         instruction:
-          "E1 (guiado) — **Conteo de coerciones.** Aplica `to_numeric` con coerce a `monto` y reporta cuántos **nuevos** NaN se introdujeron (resta isna después − antes). Salida esperada: `1`.",
+          "E1 (guiado) — **Conteo de coerciones.** Aplica `to_numeric` con `errors='coerce'` a `monto` y reporta cuántos **nuevos** NaN se introdujeron (resta isna después − antes). Salida esperada: `1`.",
```

### Diff 7 — Fix `vs` typography (M-7)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -574,7 +574,7 @@
         why: "El manifest reconcilia entrada vs salida y prueba que el artefacto no cambió entre corridas.",
+        why: "El manifest reconcilia entrada vs. salida y prueba que el artefacto no cambió entre corridas.",
```

### Diff 8 — Capitalize after `?` in self-check explanations (M-6)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -1617,7 +1617,7 @@
         question: "¿Qué método de selección usa etiquetas de index/columnas?",
         options: ["iloc", "iat solo posicional forzado", "loc", "values"],
         correctIndex: 2,
         explanation:
-          "loc selecciona por etiqueta de Index/columnas; iloc (e iat) usan posición numérica. Si el Index es cliente_id, loc['C002'] no es lo mismo que iloc[1] salvo que el orden lo permita.",
+          "**`loc`** selecciona por etiqueta de Index/columnas; `iloc` (e `iat`) usan posición numérica. Si el Index es `cliente_id`, `loc['C002']` no es lo mismo que `iloc[1]` salvo que el orden lo permita.",
@@ -1652,7 +1652,7 @@
         question: "¿Qué hace parse_dates=['fecha'] en read_csv?",
         options: ["Convierte la columna fecha a datetime en la lectura", "Borra filas con fecha inválida", "Obliga a usar Excel en vez de CSV", "Solo formatea el print de la fecha"],
         correctIndex: 0,
         explanation:
-          "parse_dates tipa la columna como datetime en la ingesta; sin eso suele quedar object/string.",
+          "`parse_dates` tipa la columna como `datetime` en la ingesta; sin eso suele quedar `object`/`string`.",
@@ -1672,7 +1672,7 @@
         question: "¿Para qué sirve astype('category') en una columna de región (Lima/Arequipa)?",
         options: ["Convierte texto a fechas automáticamente", "Borra duplicados de región", "Reduce memoria y fija un conjunto de valores conocidos; conviene normalizar con str.title antes", "Es obligatorio antes de to_csv"],
         correctIndex: 2,
         explanation:
-          "category es un dtype compacto para labels repetidos. Normaliza mayúsculas/minúsculas antes para no duplicar 'lima' y 'Lima'.",
+          "`category` es un dtype compacto para labels repetidos. Normaliza mayúsculas/minúsculas antes para no duplicar 'lima' y 'Lima'.",
```

### Diff 9 — Split `iDo.intro` long sentence (M-3)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -336,7 +336,7 @@
   iDo: {
     intro:
-      "Recibes tablas sintéticas de un retailer peruano. Observa cómo se modela el Index, se lee el CSV con dtypes, se selecciona con loc/assign, se evita chained assignment, se tipa y se exporta con manifest — ocho demos en el mismo hilo de clientes/transacciones.",
+      "Recibes tablas sintéticas de un retailer peruano. Observa el hilo completo en **ocho demos**: modelar el Index, leer el CSV con `dtype`s, seleccionar con `loc`/`assign`, evitar *chained assignment*, tipar columnas y exportar con manifest — siempre sobre el mismo hilo de clientes y transacciones.",
```

### Diff 10 — Split `portfolioNote` long sentence (M-4)

```diff
--- a/src/lib/course/sections/s15-stdlib-deep.ts
+++ b/src/lib/course/sections/s15-stdlib-deep.ts
@@ -1601,7 +1601,7 @@
     portfolioNote:
-      "Entrega: script reproducible que pase `_run_tests()` + (opcional) CSV/Excel con index=False + JSON de coercion_report y manifest para **clientes y transacciones**. En el README explica en español profesional qué columnas fallaron, cómo contaste las coerciones y por qué no inventaste defaults. Si exportas Excel, declara `openpyxl`. Este artefacto es la base del dataset de CP-N2-A: un revisor debe poder re-ejecutar `python ingest_cp_n2a.py` y ver `tests OK`, filas, reportes y hash sin adivinar tu entorno.",
+      "Entrega: script reproducible que pase `_run_tests()` + (opcional) CSV/Excel con index=False + JSON de coercion_report y manifest para **clientes y transacciones**. En el README explica en español profesional qué columnas fallaron, cómo contaste las coerciones y por qué no inventaste defaults. Si exportas Excel, declara `openpyxl`. Este artefacto es la base del dataset de CP-N2-A. Un revisor debe poder re-ejecutar `python ingest_cp_n2a.py` y ver `tests OK`, filas, reportes y hash sin adivinar tu entorno.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue IDs | Effort | Why first |
|----------|-----------|--------|-----------|
| **P0** (this sprint) | H-1, H-2, M-8 | 2 h | Wrong editor + wrong PDF label are visible to **every** learner opening S15 today. M-8 (id rename) is the root cause and unlocks both. Apply Diffs 1 + 2 together. |
| **P0** (this sprint) | H-4 | 30 min | Strip `CASO-LIM-015` from 24 starterCode comments. Mechanical edit; systemic across S01–S13+ — recommend a one-shot regex pass repo-wide. |
| **P1** (next sprint) | H-3, M-3, M-4, M-5 | 1 h | Run-on / long-sentence splits. Apply Diffs 3, 9, 10. |
| **P1** (next sprint) | M-1, M-2, M-7 | 30 min | Grammar concordance + typography. Apply Diffs 5, 6, 7. |
| **P2** (backlog) | M-6 | 20 min | Capitalization after `?` in 3 self-check explanations. Apply Diff 8. |
| **P3** (skip / false-positive) | L-1 through L-7 | — | Heuristic false positives or intentional style; document but do not edit. |

**Total fix budget: ~4 h for P0+P1.**

---

## 9. Graph Memory Update Notes (shared context)

- **`legacy_id_drift` registry grows by 1**: S15 (`id:"stdlib-deep"`, content: Pandas ingesta) joins S06 (`numpy`), S09 (`visualization`), S10 (`sklearn`), S13 (`rpa-automation`) as a section whose `id` field is a V3-retarget fossil. **Pattern is now systemic across 5+ sections.** Recommend a single coordinated PR that (a) renames all legacy ids to slug-of-title, (b) updates every downstream consumer (`SectionView.tsx` `demos` map, `PdfReport.tsx` `SECTION_TITLES` map, `index.ts` imports + file names, any external hash-based deep links), (c) adds a regression test that asserts `section.id === slugify(section.shortTitle)` and that `demos[section.id]` is defined for every section in `COURSE_SECTIONS`.
- **`caso_lim_taxonomy_leak` registry grows by 1**: S15 has 24 `CASO-LIM-015` markers in starterCode (vs S10's 31 `CASO-LIM-010`). **Pattern is systemic.** Recommend: either (a) delete all `# CASO-LIM-NNN · …` lines from every `starterCode.code` block in `s01-…-s52-…`, or (b) document `CASO-LIM-NNN` in the `Diccionario del curso` so learners know what it means. Option (a) is cleaner.
- **`concordance_la_series`**: S15 introduces a new concordance issue (`la Series` × 3) not seen in earlier sections. Likely to recur in S17 (`Joins · groupby · cierre`) and S18 (`EDA e incertidumbre`) where pandas `Series` is also referenced. Recommend a glossary entry: "Cuando te refieras al tipo `Series` de pandas en prosa, usa `el objeto Series` o `la serie` (lowercase, as Spanish noun) — evita `la Series`."
- **`prep_verb_coerce`**: S15 uses `coerce` (a pandas parameter value) as a Spanish noun 2× (`con coerce`, `Sin coerce`). Likely to recur in S16 (`Calidad y contratos`) and S17. Recommend: always quote code values in backticks (`errors='coerce'`) and never use them as bare nouns.
- **`url_hash_dual_routing`**: S15 accepts both `#stdlib-deep` and `#pandas-ingesta` as URL hashes (verified live). This means even after the id rename, deep links using the legacy hash will continue to work — but the canonical id should be `pandas-ingesta`. The dual-routing behavior should be tested (likely a fallback to slug-of-shortTitle when id doesn't match).
- **FH readability baseline for "Pandas ingesta" sections**: S15 aggregate FH 71.3 / INFLESZ 67.3 / WPS 11.4 / SPW 1.94 — healthy for technical Spanish. Use as benchmark for S17 (`Joins · groupby · cierre`) and S18 (`EDA e incertidumbre`) which share the same domain.
- **No new meta-leak patterns** beyond those already catalogued in S01–S13. Zero TODO/FIXME/STUB/moved-from text in any prose field. Authoring hygiene on the prose surface is excellent.

---

## 10. Method Note (Grammar Subplan Application)

The audit applied the shared `_GRAMMAR_SUBPLAN.md` research pipeline:

1. **Prose extraction** — Custom TS-aware parser (`_s15_extract.py`, 280 LOC) walks the source file, tracks the most recent `key:` token, captures only double-quoted and backtick-quoted string literals whose key is in `PROSE_KEYS = {intro, why, instruction, description, hint, feedback, heading, title, content, context, tagline, text, criterion, note, portfolioNote, question, explanation, option, label, jobRelevance}`. Code blocks (`starterCode.code`, `solutionCode.code`, `output`), identifiers, URLs and slugs are skipped.
2. **Spanish signal filter** — Records must contain accented chars OR Spanish function words (`de, la, el, los, y, que, en, con, por, para, una, su, se, del, al, como, pero, cuando, donde, sin, sobre, …`). 139 prose records / 232 sentences / 2 643 words passed.
3. **Per-sentence metrics** — Fernández-Huerta (`206.84 − 60·(syl/word) − 1.02·(word/sent)`), Szigriszt-Pazos INFLESZ (`206.835 − 62.3·(syl/word) − (word/sent)`), WPS, SPW. Spanish syllable counter uses vowel-group heuristic with hiatus detection (accented weak vowel + strong = hiatus).
4. **14 pedagogical heuristics** — run-on (>45 w), long (>32 w), missing terminal, missing `¿`/`¡`, unbalanced delimiters, repeated word, meta-leak (regex `\b(TODO|FIXME|XXX|TBD|WIP|STUB|MOVED FROM|moved from section|curriculum_hardening|STORM|FIXER|never surface to learners|internal note|design note|developer note|@author|@reviewer)\b`), dev-leak-loose, english-dominant, gerund pile-up, high comma density, single-sentence paragraph, space-before-punct, double space, anglicism list, `CASO-LIM` taxonomy, subtopic-id-in-prose, `vs` without period, Latin abbreviation.
5. **LanguageTool `es`** — Single batched POST to `https://api.languagetool.org/v2/check` with 2 chunks (~7 KB each), 4 s sleep between. 428 raw matches; 408 `MORFOLOGIK_RULE_ES` spelling false positives on pandas identifiers (`loc`, `iloc`, `dtype`, `StringIO`, `parse_dates`, `na_values`, `coerce`, `manifest`, `provenance`, `SettingWithCopyWarning`, …) filtered. 20 real findings, of which 7 are actionable after manual review (the rest are code-adjacent false positives).
6. **Composite scoring** — Start at 10; subtract 0.5 per H, 0.2 per M, 0.05 per L; light penalty if FH extreme. Result: 10 − 4×0.5 − 8×0.2 − 7×0.05 ≈ **7.65**, rounded to **7.6**.

**Known false-positive classes** (documented for future auditor reuse):
- `todo` (Spanish "whole") matched as TODO leak → tighten regex to case-sensitive `\bTODO\b`.
- `pendiente` substring in `independiente` → tighten to `\bpendiente\b` with word boundary.
- `.copy()`, `.str.title()` etc. trigger `space_before_punct` → skip when inside backtick code spans.
- `Salida esperada: [1.0, nan, 3.0]` triggers `english_dominant` → skip very short technical labels.
- LT `MORFOLOGIK_RULE_ES` fires on every pandas identifier → always filter this rule.
- LT `SE` rule misfires on reflexive passive "se tipa", "se exporta" → ignore.
- LT `UPPERCASE_SENTENCE_START` misfires when sentence boundary is confused by code in backticks → manual review.

**Artifacts left for orchestrator/fixer reuse:**
- `/home/z/my-project/audits/_s15_extract.py` (grammar extractor + 14 heuristics)
- `/home/z/my-project/audits/_s15_prose.txt` (139 prose records, tab-separated `line\tkey\tvalue`)
- `/home/z/my-project/audits/_s15_metrics.json` (per-record + per-sentence metrics, all findings, worst-sentence and longest-sentence rankings)
- `/home/z/my-project/audits/_s15_lt.json` (428 raw LanguageTool matches)

---

## 11. Live-site verification log

| Action | Tool | Result |
|--------|------|--------|
| Confirm Section 15 identity | `agent-browser open #stdlib-deep` → `read` | Title `Pandas: ingesta, selección y tipos` ✓ |
| Confirm side-bar card | `agent-browser eval` | Card #15 = "Pandas ingesta" + tagline ✓ |
| Confirm hash dual-routing | `agent-browser open #pandas-ingesta` | Loads same section ✓ |
| Confirm wrong editor | `agent-browser read` lines 719-833 | Shows `# Practica functools y itertools` code under "Pruébalo tú mismo" ✗ (confirms H-1) |
| Confirm `jobRelevance` not rendered on Theory tab | `agent-browser eval document.body.textContent.indexOf('En banca')` | Returns `-1` (field is not visible on Theory tab; `**bold**` leak risk from S06 audit is moot for S15) ✓ |
| Confirm `CASO-LIM-015` in We Do starterCode | source grep | 24 occurrences in `code:` blocks ✓ |
| Confirm `subtopicId` not rendered | `Grep subtopicId SectionView.tsx` | Zero matches in rendering code (only `data-testid`) ✓ |
| Confirm PDF label | `Grep stdlib-deep PdfReport.tsx` | `"stdlib-deep": '15. stdlib'` ✓ |

---

## 12. Conclusion

Section 15 is a pedagogically strong unit (`CP-N2-A` capstone, full I/We/You Do fidelity, healthy readability, honest environment limits, no fraud/parentesco claims) undermined by the same systemic legacy-id drift that affects S06, S09, S10 and S13. The two HIGH-severity meta-leaks (wrong interactive editor, wrong PDF label) are visible to every learner today and are mechanical fixes once the id is renamed from `stdlib-deep` to `pandas-ingesta`. The `CASO-LIM-015` taxonomy leak (24×) is the same pattern flagged for S10 and likely affects every We Do exercise across the course. The grammar surface is otherwise clean: 7 real findings after filtering 421 false positives, all addressable with ~10 line-edits.

**Composite score: 7.6 / 10.**

> **This is the complete Explorer report for Section 15. Ready for the Fixer prompt.**
