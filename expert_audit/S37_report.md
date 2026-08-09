# PyArcana — Section 37 Curriculum Audit Report (S37)

> **Auditor:** Curriculum Auditor (general-purpose subagent)
> **Section:** 37 (`section37`, `id: "dbt-bigquery"` — **stale identifier**, see S37-ISSUE-01)
> **Source file:** `src/lib/course/sections/s37-dbt-bigquery.ts` (1,787 lines)
> **Live site:** https://pillb.github.io/pyarcana/ — Section 37 = "Profiling y rendimiento"
> **Repo:** https://github.com/PillB/pyarcana (verified at `/home/z/my-project/pyarcana_repo`)
> **Method:** Stanford STORM + Graph/Loop/Harness Engineering; Spanish readability (Fernández-Huerta, INFLESZ, WPS/SPW) + LanguageTool `es` (public API) + offline pedagogical heuristics from `_GRAMMAR_SUBPLAN.md`.
> **Audit-only:** No edits applied. All diffs are proposals.

---

## 1. Section Identification & Scope

**Confirmed Section identity (live site + source).** The home page at https://pillb.github.io/pyarcana/ renders Section 37 with:

- `shortTitle`: `"Profiling y rendimiento"`
- `tagline` (verbatim): `"reporte antes/después con mismo resultado, dataset, hardware y límites; optimización reversible y justificada"`
- `index: 37`, `phase: 2` (Senior), `estimatedHours: 19`, `level: 'Competente a experto'`, `icon: 'Timer'`

The live index entry was located on the rendered page (between Section 36 "Clustering y anomalías" and Section 38 "Concurrencia y resiliencia") and matches the source TS file `s37-dbt-bigquery.ts` field-for-field. The prose is fully present in the source TS file (the live SPA is client-rendered Next.js, so the TS file is the canonical artifact).

**Critical scope anomaly (confirmed).** Despite the file name `s37-dbt-bigquery.ts` and the section `id: "dbt-bigquery"`, the **entire content of the section is about Python performance profiling / blocking / memory / budgets**, with **zero mention of dbt or BigQuery anywhere** in the 1,787-line source. The actual `title` field is `"Profiling, algoritmos y rendimiento"` and the `shortTitle` is `"Profiling y rendimiento"`. The file name and the `id` are stale residue from a previous (renamed or replaced) topic — a real meta-leak of authoring history (see S37-ISSUE-01).

**Scope audited (all learner-facing prose):**

| Field group | Count audited |
|---|---|
| `tagline`, `jobRelevance`, `learningOutcomes[*].text` | 1 + 1 + 8 |
| `theory[*].heading` + `paragraphs[*]` + `callout.{title,content}` | 8 headings, ~24 paragraphs, 8 callouts |
| `iDo.intro` + 8 × `iDo.steps[*].{description,why}` | 1 + 16 |
| `weDo.intro` + 24 × `weDo.steps[*].{instruction,hint,hints[],edgeCases[],tests,feedback}` | 1 + ~120 strings |
| `youDo.{title,context,objectives[],requirements[],portfolioNote,rubric[].criterion}` | ~25 strings |
| `selfCheck.questions[*].{question,options[],explanation}` | 5 × ~6 = ~30 strings |
| `resources.{docs,books,courses}[*].{label,note}` | 16 strings |

**Total Spanish prose units extracted and scored: 151 Spanish records → 198 sentences** (after filtering code-only / English-only scaffolding strings). Full extraction: `/home/z/my-project/audits/S37_records.json`.

The section is structured as **4 sub-topics × 2 demos each = 8 I-Do demos** plus **4 sub-topics × 3 exercises each = 24 We-Do exercises** with E1 (guided) → E2 (independent) → E3 (transfer) decreasing-scaffolding pattern. Sub-topics: T1 (Medición — wall/CPU/memoria/bench), T2 (Algoritmos y blocking), T3 (Memoria — dtypes/chunks/cache), T4 (Budgets y costo total).

---

## 2. Executive Summary of Quality

**Composite score: 7.2 / 10**

**Verdict:** Section 37 is a **technically rigorous, well-architected senior-level performance section**. The pedagogical scaffolding (I Do → We Do → You Do → Self-check, with E1/E2/E3 decreasing-scaffolding and explicit theory/code/callout triples) is **best-in-class for the course**, the synthetic-fixture discipline (`CASO-LIM-037`, no PII, same_result gate, before/after report) is exemplary, and the bridge back to S30 (recall de blocking) and forward to S38 (queues/retries) is the strongest narrative spine in the second half of the course.

The score is held back from 8.5+ by **fixable** issues:

1. **One HIGH meta-leak (file name + id mismatch)**: file is `s37-dbt-bigquery.ts` and `id: "dbt-bigquery"` but content is entirely about Python profiling/performance. This signals to anyone reading source or inspecting the SPA URL/state that the section was re-purposed without renaming. The mismatch also corrupts the implicit curriculum contract with learners who inspect URLs.
2. **One recurring grammar defect (6 occurrences)**: `"mismo resultado"` used without the article `"el"` in tagline, theory T4-B, weDo E3 instruction, youDo context/requirements, and rubric criterion — flagged by LanguageTool rule `MISMO_EL_MISMO` 3 times after deduplication. The same section also has 3 occurrences of the *correct* form `"el mismo resultado"`, confirming internal inconsistency rather than a deliberate stylistic choice.
3. **Extreme anglicism density** in theory paragraphs and `instruction` fields. Verbs (`Profilear`, `Benchmarkear`, `scorear`, `cachear`) and inline nouns (`wall`, `job`, `run`, `path`, `scorer`, `fixture`, `batch`, `shot`, `tradeoff`, `bound`, `leaderboard`, `compute`, `bugs`, `shaving`, `cold start`, `hot path`) appear in plain prose **without backticks** when they should either be translated (`perfilar`, `puntuar`, `guardar en caché`, `ruta`, `trabajo`, `carrera`, `compromiso`, `límite`, `cómputo`, `errores`, `recorte`, `arranque en frío`, `ruta caliente`) or wrapped as `code` for consistency.
4. **Inconsistent register**: tuteso (`ya te dijo`, `inventas`, `subes N o aíslas ruido`, `publicas ms`, `Cuentas costo`) mixed with impersonal `se` (`se reporta mediana`) and formal third person (`la métrica … es`) — often inside the **same paragraph** (e.g., theory T1-A and T1-B paragraphs).
5. **Two long, dense instruction fields** (S37-T1-A-E2 WPS=34, S37-T4-B-E2 WPS=40) packing code identifiers, predicates and parens into a single sentence — should be split.
6. **Verbatim hint duplication**: in 24/24 weDo steps, the `hint:` field is a verbatim duplicate of `hints[0]` — bloats the source and risks divergence (same pattern noted in S01 audit).
7. **`PRs` plural sigla** (Spanish academy rule: siglas are invariable — should be `los PR`); minor.
8. **One missing comma before `pero`** (`El starter ya mide wall pero reporta n=0` — S37-T1-A-E1 instruction).
9. **Spanglish adjective** `«más clever»` inside Spanish quotes (theory T1-A paragraph 2) — should be `«más ingenioso»` or `«más astuto»`.

None are catastrophic. Pedagogically the section is sound; the fixes are mostly cleanup and consistency.

---

## 3. Detailed Issue Registry

Issues are numbered `S37-ISSUE-NN`. Severity: **H** = High (blocks learning or leaks internals), **M** = Medium (clarity/quality defect), **L** = Low (polish).

### Meta-leak & internal-residue issues

#### S37-ISSUE-01 — Stale file name and `id` ("dbt-bigquery") contradict the section content [H]
- **Location:** File: `src/lib/course/sections/s37-dbt-bigquery.ts` (whole file). Field: `id: "dbt-bigquery"` (line 4).
- **Evidence (verbatim):**
  - Line 3-5: `export const section37: CourseSection = { id: "dbt-bigquery", index: 37, title: "Profiling, algoritmos y rendimiento", …`
  - File-name: `s37-dbt-bigquery.ts`
  - Title: `"Profiling, algoritmos y rendimiento"`; shortTitle: `"Profiling y rendimiento"`.
  - **No occurrence of "dbt" or "BigQuery" anywhere in the 1,787-line source** (verified with `grep`).
- **Pedagogical impact:** Three compounding harms:
  1. **URL / state leak**: if the SPA ever exposes `id` in the URL hash, query string, or analytics events, learners see `dbt-bigquery` and either expect a data-warehouse topic (cognitive dissonance with "Profiling") or believe the page is broken.
  2. **Source archaeology signal**: any maintainer / learner browsing the repo sees a file name that lies about its content; this erodes curriculum-trust and complicates grep-based audits.
  3. **Roadmap contract violation**: the master roadmap (`learning_roadmap_52_V3.md`) almost certainly lists Section 37 as the performance/dbt topic — if the roadmap still says "dbt/BigQuery", the curriculum contract is broken on the live site; if it was changed, the file name and `id` were missed in the rename pass.
- **Severity:** H.

#### S37-ISSUE-02 — Verbatim duplication of `hint:` and `hints[0]` across all 24 weDo steps [M]
- **Location:** Every `weDo.steps[*]` block (lines ~653–1642). Example, lines 658–659:
  - `hint: "Todo wall_ms viaja con su n.",`
  - `hints: ["Todo wall_ms viaja con su n.", "print('n', n) con n=1000 del fixture."]`
- **Evidence:** 24/24 weDo steps duplicate the `hint:` field verbatim as `hints[0]`. Same pattern was flagged in the S01 audit (S01-ISSUE-NN).
- **Pedagogical impact:** (a) Source bloat — ~24 redundant lines; (b) Divergence risk — if `hint` is updated but `hints[0]` is not (or vice versa), learners see inconsistent hints depending on which field the renderer picks; (c) The single-string `hint` field is redundant with the array `hints` and could be removed entirely.
- **Severity:** M.

#### S37-ISSUE-03 — Internal curriculum-code identifiers exposed in learner-facing headings [L]
- **Location:** `theory[0].heading` (line 28): `"Rendimiento del triage (CP-N3-C escala)"`; `youDo.title` (line 1646): `"Reporte antes/después de escala del triage (CP-N3-C escala)"`.
- **Evidence:** The internal competency code `CP-N3-C escala` is part of the roadmap taxonomy (CP = "Competency Path", N3 = "Nivel 3", C = the sub-level). It is exposed verbatim in learner-facing headings.
- **Pedagogical impact:** Minor. A learner unfamiliar with the code sees `(CP-N3-C escala)` as noise. The code adds zero learning value at the heading position; it could be moved to a `meta` field for grading/analytics.
- **Severity:** L.

#### S37-ISSUE-04 — Bridge references `S14→S30→S37` / `S37→S38` partially break narrative immersion [L]
- **Location:** `theory[0].paragraphs[4]` (line 34): `"Puente S14→S30→S37: en NumPy/vectorización (S14) mediste work denso; en entity resolution (S30) mediste **recall de blocking**. Aquí unes ambas líneas: … Puente S37→S38: los budgets y el reporte before/after de esta sección son la base cuando el path corra con colas, reintentos y variabilidad de proveedor."`
- **Evidence:** Inline section-number bridges are useful for senior learners but inject curriculum-meta into the conceptual flow.
- **Pedagogical impact:** Low — for a senior audience (phase 2, "Competente a experto") explicit bridges are pedagogically defensible (connective tissue back to recall from S30). Worth keeping but could be moved to a callout.
- **Severity:** L.

### Grammar & redaction issues

#### S37-ISSUE-05 — Recurring `"mismo resultado"` missing article `"el"` (6 occurrences) [M]
- **Location:** Lines 8, 355, 774, 1648, 1656, 1726.
- **Evidence (verbatim):**
  - L8 (tagline): `"reporte antes/después con mismo resultado, dataset, hardware y límites; …"`
  - L355 (theory T4-B ¶1): `"El entregable de escala es el reporte antes/después con mismo resultado, dataset y límites — …"`
  - L774 (weDo S37-T1-A-E3 instruction): `"El gate de escala exige mismo resultado funcional en CASO-LIM-037."`
  - L1648 (youDo context): `"Solo datos sintéticos; mismo resultado funcional."`
  - L1656 (youDo requirement): `"Mismo resultado funcional"`
  - L1726 (rubric bonus): `"Before/after con mismo resultado"`
- **LanguageTool evidence:** Rule `MISMO_EL_MISMO` ("Probablemente falta un artículo.") fired 3 times after deduplication on the concatenated prose chunk (see `/home/z/my-project/audits/S37_lt.json`).
- **Internal inconsistency:** Lines 31, 60, 186 use the **correct** form `"el mismo resultado funcional"`. So the section is internally split, not stylistically committed.
- **Pedagogical impact:** Grammatical defect in formal Spanish ("con mismo resultado" is substandard; RAE prescribes "con el mismo resultado"). High-seniority learners writing Spanish PRs will copy the form. Recurrence across tagline → theory → exercises → rubric amplifies the defect.
- **Severity:** M.

#### S37-ISSUE-06 — Verb anglicisms `Profilear`, `Benchmarkear`, `scorear`, `cachear` [M]
- **Location & evidence:**
  - L17 (learningOutcomes[0]): `"Profilear wall y CPU (perf_counter / process_time) y anotar memoria con n explícito"` — `Profilear` is a calque of "to profile".
  - L18 (learningOutcomes[1]): `"Benchmarkear con warmup, mediana y una nota de variabilidad …"` — `Benchmarkear` is a calque of "to benchmark".
  - L218 (theory T2-B ¶1): `"… recién después scorear con el modelo o reglas."` — `scorear` is a calque of "to score".
  - L219 (theory T2-B ¶2): `"Error: scorear el producto cartesiano y luego «optimizar» el scorer."` — repeated.
  - L292 (theory T3-B ¶1): `"Cachear features o resultados de blocking acelera re-runs, …"` — `Cachear` is a calque of "to cache".
- **Pedagogical impact:** Verb anglicisms with the `-ear` suffix are non-standard Spanish; RAE accepts some (`tuitear`, `escanear`) but not these. The Spanish tech community uses `perfilar`, `evaluar con benchmark` / `realizar benchmarks`, `puntuar` / `evaluar` / `calificar`, `guardar en caché` / `almacenar en caché`. The anglicized verbs force learners to internalize non-transferable forms.
- **Severity:** M.

#### S37-ISSUE-07 — Extreme inline anglicism density in theory paragraphs (unformatted tech nouns) [M]
- **Location:** All 8 theory paragraphs (lines 30–357) and most `instruction` fields.
- **Evidence (representative, line 67 — theory T1-A ¶1):**
  > `"Wall time es el reloj de pared que percibe el usuario o el batch (\`time.perf_counter\`); CPU time es el tiempo de procesador (\`time.process_time\`). Cuando wall >> CPU, el job espera I/O o el SO; cuando ambos crecen, el path es compute-bound. La memoria pico limita si el job cabe en el worker: \`tracemalloc\` muestrea alocaciones en stdlib. Cuando el wall ya te dijo *qué tramo* es caro, \`cProfile\` nombra la **función** exacta (hot path) sin adivinar."`
- **Inline (un-backticked) anglicisms in this single paragraph:** `Wall time`, `CPU time`, `batch`, `job`, `I/O`, `path`, `compute-bound`, `worker`, `stdlib`, `hot path`. The article is also calqued (`el job`, `el path`, `el worker`).
- **Other representative lines:**
  - L31: `"«hacer el código más clever»"`, `"shaving del 2%"`, `"loop interno"`, `"wall se duplica"`, `"fixture completo"`.
  - L146: `"work(); luego N runs post-warmup; …"`, `"no inventas un speedup con un solo shot"`, `"thermal"`.
  - L254: `"el stack"`, `"bound de memoria"`, `"size de chunk"`, `"tradeoff entre overhead de bucle y pico de RAM"`, `"features"`.
  - L292: `"cache stale"`, `"feature set"`, `"cutoff"`, `"spill a disco"`, `"batch de triage"`.
  - L355: `"compute"`, `"bugs"`, `"leaderboard"`, `"microbenchmarks"`, `"path de producción"`.
- **Pedagogical impact:** (a) Forces Spanish-speaking learners to mentally translate every sentence; (b) breaks consistency with the section's own callouts and code blocks (which use backticks correctly); (c) makes the prose read like translated-from-English text rather than Peruvian-Spanish technical writing.
- **Severity:** M.

#### S37-ISSUE-08 — Spanglish adjective `«más clever»` inside Spanish quotes [L]
- **Location:** L31 (theory T1-A ¶2): `"Escalar el triage no es «hacer el código más clever»: es medir el path caliente …"`
- **Evidence:** The adjective `clever` is wrapped in Spanish `«»` quotes but kept in English.
- **Pedagogical impact:** Reads as code-switching residue. Spanish equivalents (`más ingenioso`, `más astuto`, `más «listo»`) are readily available.
- **Severity:** L.

#### S37-ISSUE-09 — Inconsistent grammatical register (tú / se / formal) [M]
- **Location:** Theory T1-A ¶1 (line 67) and T1-B ¶2 (line 146) are the worst offenders.
- **Evidence (mixed register within paragraphs):**
  - L67: `"Cuando el wall ya te dijo *qué tramo* es caro, \`cProfile\` nombra la función exacta …"` — informal **tú** (`te dijo`) next to impersonal third person (`nombra`, `limita`).
  - L146: `"Mecanismo: work(); luego N runs post-warmup; mediana en ms; anota n_runs y, si hace falta, rango o IQR simple como nota de variabilidad."` — imperative **tú** (`anota`) → `"Error: publicar un solo run sin warmup como «verdad»."` — impersonal infinitive → `"Si la variabilidad es alta, subes N o aíslas ruido (otras apps, thermal); no inventas un speedup con un solo shot."` — **tú** again (`subes`, `aíslas`, `inventas`).
- **Other examples of tuteso:** L138 callout (`No empieces por micro-shaving`), L327 (`no inventas un speedup` style elsewhere), L356 (`no lo confundas`), L138 (`empiezas`).
- **Pedagogical impact:** Inconsistent register signals lack of editorial review and is a classic Spanish technical-writing defect (cf. *Fundéu* guidance on `tú` vs. `usted` consistency). For a senior audience, **tú** is acceptable, but it must be uniform.
- **Severity:** M.

#### S37-ISSUE-10 — Long, dense `instruction` fields with embedded code identifiers (WPS ≥ 30) [M]
- **Location & evidence:**
  - L1567 (S37-T4-B-E2 instruction, WPS=40, FH=100.0): `"S37-T4-B-E2 · Claridad sobre shaving 2%: con algo_gain=0.80 y micro_gain=0.02, prefiere 'clarity' si micro_gain < 0.05 y algo_gain > micro_gain; imprime prefer, ok (algo_gain > micro_gain), shave '2pct_no'. Starter fija prefer='micro_shave' y shave='2pct_yes' sin aplicar la regla (defect)."`
  - L707 (S37-T1-A-E2 instruction, WPS=34, FH=99.8): `"S37-T1-A-E2 · Mide wall, CPU y pico de memoria del work sintético (perf_counter + process_time + tracemalloc) con n=5000; imprime wall_ok True, cpu_ok True, peak_ok True, n 5000. Starter mide solo wall, fuerza cpu_ok/peak_ok en False y reporta n 0 (defect). Contrato wall+CPU+memoria del triage sintético CASO-LIM-037."`
  - L774 (S37-T1-A-E3, WPS=32), L1493 (S37-T4-A-E3, WPS=32, FH=104.8), L930 (S37-T1-B-E3, WPS=30), L1077 (S37-T2-B-E1, WPS=28), L1605 (S37-T4-B-E3, WPS=27).
- **Metric:** Median WPS for the whole section is **11** (very easy); these instructions are 3-4× longer than the section median.
- **Pedagogical impact:** Cognitive-load spike. Learners must parse Python identifiers (`algo_gain`, `micro_gain`), predicates (`< 0.05`), quoted strings (`'clarity'`, `'2pct_no'`), parentheticals (`(defect)`, `(algo_gain > micro_gain)`), and a Semicolon-joined second clause all in one sentence. Should be split into 3 short sentences: setup → expected output → defect.
- **Severity:** M.

#### S37-ISSUE-11 — `PRs` plural sigla (Spanish academy: siglas are invariable) [L]
- **Location:** L662 (S37-T1-A-E1 feedback): `"S37-T1-A-E1: sin n el wall_ms no es comparable entre PRs."`
- **Evidence:** `PRs` pluralizes the sigla `PR` with a lowercase `-s`.
- **LanguageTool evidence:** Rule `SIGLAS` ("El plural de las siglas no se marca gráficamente.") fired on this token (see `/home/z/my-project/audits/S37_lt.json`).
- **RAE / Fundéu rule:** Siglas do not take plural mark: `los PR`, `las PR`. The plural is carried by the article.
- **Pedagogical impact:** Minor — but the section uses `PR` (singular) elsewhere (`un PR mergea un shaving`, `el PR «se siente»`), so internal consistency also demands `los PR`.
- **Severity:** L.

#### S37-ISSUE-12 — Missing comma before `pero` [L]
- **Location:** L657 (S37-T1-A-E1 instruction): `"El starter ya mide wall pero reporta n=0 (defect: el n del fixture no viaja al reporte)."`
- **Evidence:** Two clauses with different subjects (`starter mide` vs. `reporta`); contrastive `pero` requires preceding comma per RAE.
- **LanguageTool evidence:** Rule `COMMA_PERO` fired on this token.
- **Pedagogical impact:** Minor punctuation defect; learners writing Spanish PRs copy the pattern.
- **Severity:** L.

#### S37-ISSUE-13 — Missing comma after parenthetical close in instruction [L]
- **Location:** L1310 (S37-T3-B-E1 instruction): `"… Starter key incompleta solo ('fs-v1',) (defect: colisiones). Fixture de features sintéticas versionadas."`
- **Evidence:** After the parenthetical `('fs-v1',)` immediately followed by `(defect: colisiones)` there is no space-comma separator; LanguageTool rule `COMMA_PARENTHESIS_WHITESPACE` fired.
- **Pedagogical impact:** Minor typographic defect.
- **Severity:** L.

#### S37-ISSUE-14 — Colloquialism `"mata"` in formal theory paragraph [L]
- **Location:** L185 (theory T2-A ¶1): `"Comparar todos los pares es O(n²) y mata el entity resolution y el grafo cuando n crece."`
- **Evidence:** `mata` is colloquial for `bloquea` / `impide` / `inutiliza`.
- **Pedagogical impact:** Tone shift in formal theory prose.
- **Severity:** L.

#### S37-ISSUE-15 — Colloquialism `"un solo shot"` [L]
- **Location:** L146 (theory T1-B ¶2): `"… no inventas un speedup con un solo shot."`
- **Evidence:** `shot` is a colloquial English calque.
- **Pedagogical impact:** Tone/register defect; could be `"una sola medición"` or `"una sola corrida"`.
- **Severity:** L.

#### S37-ISSUE-16 — `"más clever"` calque in quoted phrase [L]
(See S37-ISSUE-08 — captured there.)

#### S37-ISSUE-17 — `"La métrica de costo número uno"` awkward phrasing [L]
- **Location:** L185 (theory T2-A ¶1, end): `"La métrica de costo número uno es el conteo de pares antes y después del blocking."`
- **Evidence:** `"número uno"` as a post-nominal ordinal-modifier is a calque of English "metric number one". Idiomatic Spanish: `"La métrica de costo principal"` or `"La métrica de costo más importante"`.
- **Pedagogical impact:** Reads translated.
- **Severity:** L.

#### S37-ISSUE-18 — `compute-bound`, `cold start`, `hot path`, `out-of-core` unexplained on first use [L]
- **Location:** L67 (theory T1-A ¶1): `"… el path es compute-bound."`; L145 (theory T1-B ¶1): `"… distorsionan el cold start."`; L67 again: `"… (hot path) sin adivinar."`; L292 (theory T3-B ¶1): `"Out-of-core significa no asumir que todo cabe en RAM …"`.
- **Evidence:** Each English compound is introduced without a Spanish gloss on first use. The section opens with a "Diccionario de la sección" (L30) that defines `Wall time`, `CPU time`, `Warmup`, `Blocking`, `Performance budget`, `same_result` — but `compute-bound`, `cold start`, `hot path`, `out-of-core`, `spill`, `cache stale`, `feature set`, `cutoff`, `shaving`, `leaderboard`, `microbenchmark` are **not** in the dictionary and appear without gloss.
- **Pedagogical impact:** Senior learners likely know these; but the dictionary's existence sets the expectation that terms are pre-defined. Missing them in the gloss is a progressive-disclosure defect.
- **Severity:** L.

### Cognitive-load / progressive-disclosure issues

#### S37-ISSUE-19 — `"Diccionario de la sección"` mega-paragraph (438 chars, 6 bolded terms) [M]
- **Location:** L30 (theory T1-A ¶0): `"**Diccionario de la sección** (léelo antes de T1). **Wall time:** reloj de pared (\`time.perf_counter\`). **CPU time:** tiempo de procesador (\`time.process_time\`). **Warmup:** corrida descartada (el cold start miente). **Blocking:** particionar por clave para no generar todos los pares O(n²). **Performance budget:** umbral de ms/memoria/pares que el CI light puede fallar. **same_result:** el speedup no vale si cambia el resultado funcional del matching/features."`
- **Evidence:** 6 bolded definitions in a single paragraph (438 chars, ~80 words).
- **Pedagogical impact:** Cognitive-load theory (Sweller) says interleave definitions with the *first use* of each term in context, not stack them. Worse: many of these terms (`wall`, `CPU`, `warmup`, `blocking`) recur in T1-A, T1-B, T2-A immediately — so the gloss could be inlined at first use instead of front-loaded.
- **Severity:** M.

#### S37-ISSUE-20 — Internal tag `CASO-LIM-037` exposed in 30+ learner-facing strings [L]
- **Location:** Recurring across tagline, jobRelevance, theory callouts, all `instruction` fields, `feedback`, `youDo.context`. e.g. L15: `"Caso CASO-LIM-037."`, L657: `"CASO-LIM-037-1A: mide wall del work sintético …"`.
- **Evidence:** `CASO-LIM-037` is an internal case-identifier code. It appears in **plain learner-facing prose** rather than as a `caseId` field.
- **Pedagogical impact:** Minor. The identifier is short and memorable; some learners may treat it as a real Red Andana case ID (which the section explicitly flags as fictitious: L33 `"Caso Red Andina (ficticio)"`). Acceptable for senior audience but feels like a leaked taxonomy tag.
- **Severity:** L.

### Exercise / exam-quality issues

#### S37-ISSUE-21 — `tests:` field is a one-line non-actionable string in all 24 weDo steps [L]
- **Location:** Every `weDo.steps[*].tests` (e.g. L661): `"Salida alinea con solution output de S37-T1-A-E1; predicado de dominio sobre fixture sintético."`
- **Evidence:** The `tests` field is supposed to describe the executable test. Instead, all 24 copies are the same boilerplate string with only the exercise ID swapped. There is no actual test predicate, no expected output spec beyond "alinea con solution output", no edge-case enumeration.
- **Pedagogical impact:** (a) Misleading field name — implies an executable test exists; (b) Reduces the section's "tests as living documentation" value; (c) The `edgeCases` field is similarly templated (`["<defect>", "sintético"]` in 24/24 steps — never a real edge-case scenario).
- **Severity:** L (downgraded from M because each `solutionCode` *does* include an `output` block that serves as the test oracle).

#### S37-ISSUE-22 — `edgeCases` array is a templated 2-element string in all 24 steps [L]
- **Location:** Every `weDo.steps[*].edgeCases`. Examples: L660 `["ms sin n", "sintético"]`, L714 `["solo wall", "sintético"]`, L777 `["cambio silencioso", "sintético"]`, L827 `["un solo run", "sintético"]`, L1055 `["features O(n²)", "sintético"]`.
- **Evidence:** The pattern is `["<two-word defect label>", "sintético"]` in 24/24 steps. The second element is always `"sintético"`.
- **Pedagogical impact:** Edge-cases should be genuine boundary scenarios (e.g., `n=0`, `n=1`, `overflow int32`, `negative budget`), not 2-word stylistic tags. The field adds no learning value as written.
- **Severity:** L.

#### S37-ISSUE-23 — selfCheck `correctIndex` and `explanation` are correct but options mix anglicisms [L]
- **Location:** L1730–1760 (5 questions).
- **Evidence (sample, Q5):** Question: `"Un wall_ms sin n en el reporte:"`; option A: `"No es comparable entre cambios de dataset"`; option D: `"Hace innecesario el warmup si usas mediana"`. Explanations are accurate.
- **Pedagogical impact:** Solid self-check. Only minor: questions don't end with `?` (they end with `:`) — a deliberate styling choice consistent with the renderer's expectation. No `¿` is therefore needed. Acceptable.
- **Severity:** L (no fix needed; documented for completeness).

---

## 4. Meta-Leak Report (exact leaked text + location)

| # | Leaked text | Location | Type |
|---|---|---|---|
| 1 | `id: "dbt-bigquery"` and file name `s37-dbt-bigquery.ts` | L4 + filename | Stale authoring topic — content is "Profiling y rendimiento". **HIGH** meta-leak. |
| 2 | `(CP-N3-C escala)` | L28 (theory[0].heading), L1646 (youDo.title) | Internal competency code exposed in heading. Low-grade meta-leak. |
| 3 | `"Puente S14→S30→S37:"` and `"Puente S37→S38:"` | L34 (theory[0].paragraphs[4]) | Inline section-number bridges — defensible as connective tissue but reads as curriculum-meta. |
| 4 | `CASO-LIM-037`, `CASO-LIM-037-1A`, `CASO-LIM-037-T1A`, … | 30+ locations | Internal case-identifier code in learner-facing prose. Acceptable for senior audience. |
| 5 | `"S37-T1-A-E1 · …"` (every `instruction` and `feedback` field) | L654, L662, L703, L716, … | The leading `S37-T1-A-E1 ·` token in each `instruction` is an internal step-ID — useful for the grader but redundant in learner prose (the renderer likely shows it separately). |

**No AI-to-developer comments** (`// TODO`, `// FIXME`, `// moved from section X`, `// XXX`) were found in the file. **No design notes** were leaked into prose. The `id` mismatch (S37-ISSUE-01) is the only HIGH-severity meta-leak.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**Strong.** The section implements the gradual-release-of-responsibility model with high fidelity:

- **I Do (8 demos):** Each of T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B has a single self-contained Python demo with `description`, `code`, `output`, and `why`. The `why` field is consistently populated (not boilerplate) and explains the pedagogical move (e.g. L452: `"Deriva wall, CPU, pico de alocaciones y la función caliente (cProfile) del work real con n; los ms exactos varían por máquina, por eso el demo reporta predicados estables."`).
- **We Do (24 exercises):** Each sub-topic has E1 (guided) → E2 (independent) → E3 (transfer). The starter code has a clearly labeled `# DEFECT: …` comment; the solution code has the corrected version with an `output` block. The decreasing-scaffolding pattern is real: E1 fixes a single defect, E2 implements from a near-empty starter, E3 transfers the criterion to a new shape (e.g. E3 exercises require a comparison or selection, not just a fix).
- **You Do:** A complete portfolio project (`bench`, `all_pairs`, `blocked_pairs`, `same_result`, before/after report with `dataset` and `hardware` keys). The rubric (7 criteria, weights + 1 bonus) is concrete and aligned with the gate contract.
- **Self-check:** 5 multiple-choice questions with explanations. The distractors are pedagogically designed (e.g. Q2 distractor `"Solo el tamaño del log de auditoría"` tests whether the learner confused blocking with audit logging).

### 5.2 Cognitive load and progressive disclosure

**Mixed.** The 4-sub-topic × 2-sub-section structure (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) is well-paced: each sub-section is one concept (~3 paragraphs + 1 demo + 3 exercises). However:

- The opening `Diccionario de la sección` paragraph (S37-ISSUE-19) front-loads 6 definitions before any demo runs — a progressive-disclosure violation. Better: define each term at its first use in T1-A.
- The inline anglicism density (S37-ISSUE-07) raises cognitive load on every paragraph because learners must mentally translate `wall`, `job`, `path`, `scorer`, `fixture`, `cache stale`, `feature set`, `cutoff`, `shaving`, `leaderboard`, `microbenchmark` repeatedly.
- The long instructions (S37-ISSUE-10) are local cognitive-load spikes inside an otherwise well-paced section.

### 5.3 Connective tissue and narrative flow

**Strong.** The opening theory paragraph (L31) motivates the gate contract (`same_result`, `before_after`, `budget`) with a vivid failure story (`"un PR mergea un shaving del 2% en un loop interno y, en n=1e5 pares, el wall se duplica"`). The bridge paragraph (L34) explicitly connects to S14 (NumPy), S30 (entity resolution, recall), and forward to S38 (queues, retries). Each theory sub-section follows the same `Concepto → Mecanismo → Aplicación a CASO-LIM-037-XXX → callout` template, which gives the learner a stable mental scaffold.

### 5.4 Consistency with roadmap

**Strong** on content (performance / profiling / blocking / budgets / before-after report matches the live-site tagline and the broader phase-2 narrative arc). **Weak** on the file-name / `id` (S37-ISSUE-01) — the contract between file name, `id`, and content is broken.

### 5.5 Comparison with best-in-class external materials

| External resource | Where S37 wins | Where S37 loses |
|---|---|---|
| **High Performance Python (Micha Gorelick, Ian Ozsvald, O'Reilly)** | Comparable rigor on `perf_counter` vs `process_time`, `tracemalloc`, `cProfile`; S37 adds the `same_result` gate and the `before/after` report contract, which Gorelick treats only implicitly. | Gorelick writes cleaner English prose; S37's Spanish has anglicism density that hurts readability for native speakers. |
| **MIT 6.006 (OCW)** | S37's `n*(n-1)//2` blocking derivation matches the asymptotic-cost framing of 6.006; S37 adds the empirical `reduction = 1 − blocked/all` metric, which 6.006 leaves to recitation. | 6.006 has cleaner notation (no inline `wall`, `job`, `path` jargon in lecture notes). |
| **Google SRE Workbook — Monitoring** | S37's `performance budget` framing aligns with SRE SLI/SLO discipline; the `CI light vs nightly` split matches SRE's "tiered alerts". | SRE writes formal English; S37 mixes `«se siente» más rápido` colloquial register with formal contract language. |
| **pytest-benchmark docs** | S37's `warmup + median + spread` recipe matches pytest-benchmark's `rounds`/`iterations` defaults. | S37 doesn't cite pytest-benchmark in `resources.docs` (only raw `pytest` and `timeit`); a missed opportunity. |

### 5.6 Other domain issues

- **Accessibility:** no `alt` text or ARIA considerations in the source; the renderer's responsibility, but the prose does not preclude screen-reader use.
- **Motivation:** the failure story (PR with 2% shaving that doubled wall) is an excellent hook; could be reinforced with a 1-line code-block showing the before/after numbers.
- **Reproducibility:** the synthetic-fixture discipline (`CASO-LIM-037`, no PII, no credentials) is exemplary and matches the course-wide pattern.

---

## 6. Grammatical Improvements & Rewriting Report (paragraph-by-paragraph, per tab)

Method note: each paragraph below is scored with **WPS** (words per sentence), **SPW** (syllables per word), **FH** (Fernández-Huerta), **INFLESZ** (Szigriszt-Pazos). FH bands: ≥90 muy fácil / 70-90 fácil / 50-70 normal / 30-50 bastante difícil / <30 muy difícil. For technical senior content, "normal / bastante difícil" (50-70) is healthy; very-easy (>90) often indicates short labels/hints rather than substantive prose.

### 6.1 Header fields (tagline, jobRelevance)

#### Tagline (L8)
- **Before:** `"reporte antes/después con mismo resultado, dataset, hardware y límites; optimización reversible y justificada"` — WPS=14, SPW=1.6, FH=59.7, INFLESZ=52.0.
- **Findings:** Missing article `el` before `mismo resultado` (S37-ISSUE-05). Sentence fragment (no terminal punctuation) — acceptable for tagline style.
- **After:** `"Reporte antes/después con el mismo resultado, dataset, hardware y límites; optimización reversible y justificada."` — WPS=15, FH≈58.

#### jobRelevance (L15)
- **Before:** `"Escala el triage midiendo **antes/después** con el mismo dataset sintético. En data eng y ML ops de la región (matching, features, batch de entidad), un speedup sin **same_result** o sin **budget** en CI light es regresión disfrazada: el PR «se siente» más rápido y en n grande el wall se duplica. Optimizar no justifica saltarse privacidad ni tests. Caso CASO-LIM-037."` — WPS varies 13-30, FH≈70 (mean), dense.
- **Findings:** Second sentence is 30 words with 3 parentheticals and code-switches (`data eng`, `ML ops`, `matching`, `features`, `batch de entidad`, `speedup`, `same_result`, `budget`, `CI light`, `wall`). Fragment `"Caso CASO-LIM-037."` is a meta-tag (S37-ISSUE-20).
- **After:** `"Escala el triage midiendo **antes/después** con el mismo dataset sintético. En los pipelines de data engineering y ML ops de la región (matching, features, batch de entidad), un speedup sin **same_result** o sin **budget** en CI light es una regresión disfrazada: el PR «se siente» más rápido y, con `n` grande, el wall se duplica. Optimizar no justifica saltarse la privacidad ni los tests. Caso de referencia: `CASO-LIM-037`."` — splits the final fragment into a labeled reference.

### 6.2 Theory tab — T1-A "Wall, CPU y profiling de memoria"

#### ¶0 (L30) — Diccionario de la sección
- **Before:** `"**Diccionario de la sección** (léelo antes de T1). **Wall time:** reloj de pared (\`time.perf_counter\`). **CPU time:** tiempo de procesador (\`time.process_time\`). **Warmup:** corrida descartada (el cold start miente). **Blocking:** particionar por clave para no generar todos los pares O(n²). **Performance budget:** umbral de ms/memoria/pares que el CI light puede fallar. **same_result:** el speedup no vale si cambia el resultado funcional del matching/features."` — WPS≈30 if read as one sentence, but actually 6 short definitions.
- **Findings:** Front-loaded 6-term glossary (S37-ISSUE-19). `cold start` unexplained (S37-ISSUE-18). `CI light` un-backticked. `matching/features` slash-form awkward.
- **After (split):** Move each definition to its first use in T1-A and T1-B; keep only a one-line teaser here: `"**Diccionario de la sección** (léelo antes de T1). Los términos técnicos (Wall time, CPU time, Warmup, Blocking, Performance budget, same_result) se definen la primera vez que se usan en T1 y T2."`

#### ¶1 (L31) — Escalar el triage
- **Before:** `"Escalar el triage no es «hacer el código más clever»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests. Historia típica: un PR mergea un shaving del 2% en un loop interno y, en n=1e5 pares, el wall se duplica porque nadie midió el fixture completo."` — WPS=27/14/27.
- **Findings:** `«más clever»` (S37-ISSUE-08). `path caliente`, `shaving`, `loop interno`, `wall`, `fixture` un-backticked anglicisms (S37-ISSUE-07).
- **After:** `"Escalar el triage no es «hacer el código más ingenioso»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests. Historia típica: un PR mergea un \`shaving\` del 2 % en un loop interno y, con n=1e5 pares, el wall se duplica porque nadie midió el fixture completo."` — Replace `clever` → `ingenioso`; backtick `shaving` (or translate to `recorte`); use `con n=1e5` (Spanish `con` instead of `en`); space before `%` (RAE typography).

#### ¶2 (L32) — Contrato del gate de escala
- **Before:** `"Contrato del gate de escala. Entrada: fixture sintético \`CASO-LIM-037\`, métricas wall/CPU (y nota de memoria), conteo de pares candidatos y budgets acordados. Salida: reporte de escala con speedup y reducción de pares, más tests de regresión de performance. Error: cambiar el resultado semántico, omitir warmup o microoptimizar 2% sin medición bloquea el gate."` — WPS=8/13/14/13.
- **Findings:** Mostly fine. `wall/CPU` slash-form acceptable as shorthand. `gate` anglicism but contextual.
- **After (minor):** `"Contrato del gate de escala. Entrada: fixture sintético \`CASO-LIM-037\`, métricas wall/CPU (y nota de memoria), conteo de pares candidatos y budgets acordados. Salida: reporte de escala con speedup y reducción de pares, más tests de regresión de performance. Error: cambiar el resultado semántico, omitir warmup o microoptimizar un 2 % sin medición bloquea el gate."` — `2%` → `2 %` (RAE).

#### ¶3 (L33) — Caso Red Andana
- **Before:** `"Caso Red Andana (ficticio): matching y features sobre registros sintéticos de Lima/Cusco. Esta sección escala el path de triage (matching y features), no un laboratorio de SQL en la nube. Orden: T1 Medición → T2 Algos/blocking → T3 Memoria → T4 Budgets y costo total. Usamos **stdlib** (\`time\`, \`statistics\`, \`collections\`) para medir sin dependencias nuevas."` — WPS=8/19/9/9.
- **Findings:** Fine. Disambiguates "no es laboratorio de SQL en la nube" (implicitly addresses the file-name confusion of S37-ISSUE-01 — interesting; the author knew the topic had drifted).
- **After (no change needed).**

#### ¶4 (L34) — Puente S14→S30→S37
- **Before:** `"Puente S14→S30→S37: en NumPy/vectorización (S14) mediste work denso; en entity resolution (S30) mediste **recall de blocking**. Aquí unes ambas líneas: mides **costo** (pares y wall) sin abandonar same_result. Un blocking más agresivo que baje recall no es victoria de escala. Puente S37→S38: los budgets y el reporte before/after de esta sección son la base cuando el path corra con colas, reintentos y variabilidad de proveedor."` — WPS=13/15/9/19.
- **Findings:** Bridge meta-leak (S37-ISSUE-04). `entity resolution`, `work`, `wall` un-backticked.
- **After:** Keep bridges but wrap section codes: `"Puente **S14 → S30 → S37**: en NumPy/vectorización (S14) mediste work denso; en entity resolution (S30) mediste **recall de blocking**. Aquí unes ambas líneas: mides **costo** (pares y wall) sin abandonar \`same_result\`. Un blocking más agresivo que baje el recall no es victoria de escala. Puente **S37 → S38**: los budgets y el reporte before/after de esta sección son la base cuando el path corra con colas, reintentos y variabilidad de proveedor."`

#### Theory T1-A ¶1 (L67) — Wall, CPU, profiling de memoria
- **Before:** `"Wall time es el reloj de pared que percibe el usuario o el batch (\`time.perf_counter\`); CPU time es el tiempo de procesador (\`time.process_time\`). Cuando wall >> CPU, el job espera I/O o el SO; cuando ambos crecen, el path es compute-bound. La memoria pico limita si el job cabe en el worker: \`tracemalloc\` muestrea alocaciones en stdlib. Cuando el wall ya te dijo *qué tramo* es caro, \`cProfile\` nombra la **función** exacta (hot path) sin adivinar."` — WPS=22/22/16/14.
- **Findings:** S37-ISSUE-07 (inline anglicisms `job`, `path`, `compute-bound`, `worker`, `stdlib`, `hot path`), S37-ISSUE-09 (register: `te dijo` tú next to impersonal), S37-ISSUE-18 (`compute-bound`, `hot path` not in glossary).
- **After:** `"Wall time es el reloj de pared que percibe el usuario o el batch (\`time.perf_counter\`); CPU time es el tiempo de procesador (\`time.process_time\`). Cuando wall >> CPU, el job espera I/O o al SO; cuando ambos crecen, el path es **compute-bound** (acotado por cómputo, no por I/O). La memoria pico limita si el job cabe en el worker: \`tracemalloc\` muestrea alocaciones en stdlib. Cuando el wall ya indicó *qué tramo* es caro, \`cProfile\` nombra la **función** exacta (hot path) sin adivinar."` — Add inline gloss for `compute-bound`; `te dijo` → `indicó` (formal register).

#### Theory T1-A ¶2 (L68) — Mecanismo
- **Before:** `"Mecanismo: envuelve el path caliente, anota n del fixture, verifica el resultado funcional en el mismo run y solo entonces publicas ms. Un número sin n no sirve para decidir. Orden profesional: (1) wall+CPU con n, (2) si el wall no basta, \`cProfile\` del pipeline para ver qué función domina, (3) si hay riesgo de OOM, \`tracemalloc\` o un bound de bytes. El profile apunta al matching/grafo o features del batch sintético — no a un tramo frío del import."` — WPS=22/8/22/19.
- **Findings:** `path`, `run`, `ms`, `pipeline`, `OOM`, `bound`, `profile`, `matching`, `features`, `import` un-backticked anglicisms. `publicas ms` (tú) register.
- **After:** `"Mecanismo: envuelve el path caliente, anota \`n\` del fixture, verifica el resultado funcional en el mismo run y solo entonces publicas los ms. Un número sin \`n\` no sirve para decidir. Orden profesional: (1) wall+CPU con \`n\`, (2) si el wall no basta, \`cProfile\` del pipeline para ver qué función domina, (3) si hay riesgo de OOM, \`tracemalloc\` o un bound de bytes. El profile apunta al matching/grafo o features del batch sintético — no a un tramo frío del \`import\`."` — Backtick the inline identifiers; keep tech nouns (pipeline, OOM, profile, matching, features) but optionally gloss them on first use.

#### Theory T1-A ¶3 (L69) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T1A\`: un pipeline sintético con \`cheap\` y \`expensive\`; medimos wall/CPU, un pico de alocaciones con \`tracemalloc\` y, con \`cProfile\`, comprobamos que \`expensive\` es la función caliente. En el path real del triage se sustituye por el scorer; la disciplina wall+CPU+n+memoria+hot_fn se mantiene. Sin PII ni datasets productivos en el laboratorio del curso."` — WPS=20/14/9.
- **Findings:** Mostly fine — code identifiers are backticked. `path`, `scorer` un-backticked. `datasets` plural calque (could be `datos` or `datasets` as tech term).
- **After (minor):** `"Aplicación a \`CASO-LIM-037-T1A\`: un pipeline sintético con \`cheap\` y \`expensive\`; medimos wall/CPU, un pico de alocaciones con \`tracemalloc\` y, con \`cProfile\`, comprobamos que \`expensive\` es la función caliente. En el path real del triage se sustituye por el scorer; la disciplina wall+CPU+\`n\`+memoria+\`hot_fn\` se mantiene. Sin PII ni datos productivos en el laboratorio del curso."`

#### Theory T1-A callout (L60) — Gate de escala
- **Before:** `"Mismo resultado funcional + reporte antes/después con dataset/hardware/límites. Optimización reversible y justificada; no salta privacidad ni tests."` — WPS=10/9.
- **Findings:** Fine. `Mismo resultado funcional` here uses **correct** form (without `el` because it's an apposition noun phrase, not "con mismo resultado" — actually it should still have `el` for grammatical correctness, but RAE accepts headline-style fragments).
- **After:** Acceptable as a callout fragment.

### 6.3 Theory tab — T1-B "Benchmark: fixture, warmup y variabilidad"

#### T1-B ¶1 (L145)
- **Before:** `"La primera corrida miente: caches de CPU, import y JIT de librerías distorsionan el cold start. El warmup descarta esa corrida. Luego se reporta mediana (robusta frente a un outlier) y, con más muestras, un proxy de cola (p. ej. max en N chico, o p95 con N grande). El fixture fija dataset sintético y una nota de hardware del laboratorio."` — WPS=11/5/19/11.
- **Findings:** `cold start` not in glossary (S37-ISSUE-18). `outlier`, `proxy de cola` anglicisms. `caches` plural (could be `memorias caché`).
- **After:** `"La primera corrida miente: las memorias caché de CPU, el \`import\` y el JIT de las librerías distorsionan el cold start (arranque en frío). El warmup descarta esa corrida. Luego se reporta la mediana (robusta frente a un outlier) y, con más muestras, un proxy de cola (p. ej. el máximo con N chico, o el p95 con N grande). El fixture fija el dataset sintético y una nota de hardware del laboratorio."` — Gloss `cold start`; backtick `import`; add articles.

#### T1-B ¶2 (L146)
- **Before:** `"Mecanismo: work(); luego N runs post-warmup; mediana en ms; anota n_runs y, si hace falta, rango o IQR simple como nota de variabilidad. Error: publicar un solo run sin warmup como «verdad». Si la variabilidad es alta, subes N o aíslas ruido (otras apps, thermal); no inventas un speedup con un solo shot."` — WPS=15/9/22.
- **Findings:** `work()`, `runs`, `ms`, `ruido`, `apps`, `thermal`, `shot`, `speedup` un-backticked anglicisms. Register: `subes N o aíslas ruido`, `no inventas` (tú) next to `se reporta` (impersonal) in ¶1 (S37-ISSUE-09). `shot` colloquial (S37-ISSUE-15).
- **After:** `"Mecanismo: ejecuta \`work()\`; luego N runs post-warmup; mediana en ms; anota \`n_runs\` y, si hace falta, el rango o el IQR simple como nota de variabilidad. Error: publicar un solo run sin warmup como «verdad». Si la variabilidad es alta, sube N o aísla el ruido (otras apps, thermal); no presentes un speedup con una sola medición."` — Unify register to formal imperative (sube / aísla / presentes).

#### T1-B ¶3 (L147) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T1B\`: work = sum de cuadrados en rango 5000; warmup + 5 runs; mediana en ms. El mismo fixture viaja a CI light más adelante. Datos inventados; reproducible en la laptop del estudiante sin credenciales externas."` — WPS=12/8/9.
- **Findings:** `work`, `runs`, `ms`, `CI light` un-backticked.
- **After:** `"Aplicación a \`CASO-LIM-037-T1B\`: \`work\` = suma de cuadrados en rango 5000; warmup + 5 runs; mediana en ms. El mismo fixture viaja a CI light más adelante. Datos inventados; reproducible en la laptop del estudiante sin credenciales externas."` — Backtick `work`.

#### T1-B callout (L178)
- **Before:** `"La 1ª corrida miente. Publicar cold start como performance del algoritmo engaña al equipo y al PR."` — WPS=4/12.
- **Findings:** `1ª` is fine (Spanish ordinal abbreviation). `cold start` un-glossed.
- **After:** `"La 1ª corrida miente. Publicar el cold start como performance del algoritmo engaña al equipo y al PR."` — Add `el`.

### 6.4 Theory tab — T2-A "Complejidad y blocking"

#### T2-A ¶1 (L185)
- **Before:** `"Comparar todos los pares es O(n²) y mata el entity resolution y el grafo cuando n crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo número uno es el conteo de pares antes y después del blocking."` — WPS=20/16/15.
- **Findings:** `mata` colloquial (S37-ISSUE-14). `entity resolution` un-backticked. `número uno` calque (S37-ISSUE-17).
- **After:** `"Comparar todos los pares es O(n²) y bloquea el entity resolution y el grafo cuando \`n\` crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo principal es el conteo de pares antes y después del blocking."`

#### T2-A ¶2 (L186) — Mecanismo
- **Before:** `"Mecanismo: all_pairs = n*(n-1)//2; con B bloques de tamaño ~n/B, blocked_pairs ≈ B * size*(size-1)//2; reduction = 1 − blocked/all (fracción de pares eliminados, en [0,1]). Error: bajar 1% el inner loop y dejar n² intacto. Criterio: la reducción de pares se mide y se reporta junto al mismo resultado de matching sobre el fixture sintético."` — WPS=22/11/18.
- **Findings:** `inner loop` anglicism (acceptable, common). `1%` → `1 %` (RAE). Mathematical notation is fine.
- **After:** `"Mecanismo: \`all_pairs = n*(n-1)//2\`; con B bloques de tamaño ~n/B, \`blocked_pairs ≈ B * size*(size-1)//2\`; \`reduction = 1 − blocked/all\` (fracción de pares eliminados, en [0,1]). Error: bajar un 1 % el inner loop y dejar n² intacto. Criterio: la reducción de pares se mide y se reporta junto al mismo resultado de matching sobre el fixture sintético."`

#### T2-A ¶3 (L187) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T2A\`: n=100, 10 bloques → all_pairs=4950, blocked=450, reduction≈0.909. En S30 mediste recall de pares útiles; aquí el tradeoff es explícito: un blocking más agresivo que baje recall no es victoria de escala aunque los pares caigan. Primero cuentas costo; el recall sigue siendo gate del matching."` — WPS=14/27/9.
- **Findings:** `tradeoff`, `gate` anglicisms. `cuentas` (tú) register.
- **After:** `"Aplicación a \`CASO-LIM-037-T2A\`: n=100, 10 bloques → all_pairs=4950, blocked=450, reduction≈0.909. En S30 mediste recall de pares útiles; aquí el tradeoff es explícito: un blocking más agresivo que baje el recall no es victoria de escala aunque los pares caigan. Primero se cuenta el costo; el recall sigue siendo el gate del matching."` — Unify to impersonal.

#### T2-A callout (L211)
- **Before:** `"La métrica de costo #1 del ER/grafo es el conteo de candidatos. Si no cuentas pares, no sabes si el blocking funciona; si no mides recall (S30), puedes «ganar» costo y perder matches verdaderos."` — WPS=11/22.
- **Findings:** `#1` calque of "number 1" (S37-ISSUE-17 sibling). `cuentas`, `sabes` (tú). `ER` abbreviation not introduced.
- **After:** `"La métrica de costo principal del entity resolution (ER) y el grafo es el conteo de candidatos. Si no cuentas los pares, no sabes si el blocking funciona; si no mides el recall (S30), puedes «ganar» costo y perder matches verdaderos."` — Expand `ER` on first use; backtick or translate `#1`.

### 6.5 Theory tab — T2-B "Estructuras, vectorización y reducción de candidatos"

#### T2-B ¶1 (L218)
- **Before:** `"dict/set e índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después scorear con el modelo o reglas."` — WPS=10/19/16.
- **Findings:** `scans`, `arrays`, `features`, `path`, `scorear` (S37-ISSUE-06 verb anglicism).
- **After:** `"Los \`dict\`/\`set\` y los índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir los candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después **puntuar** (scorear) con el modelo o reglas."` — Translate `scorear` → `puntuar` (keep `scorear` in parens for the search-keyword); backtick `dict`/`set`.

#### T2-B ¶2 (L219) — Mecanismo
- **Before:** `"Mecanismo: construye el inverted index una vez (ciudad → lista de entity_id); membership con set/dict es O(1) amortizado frente a list scan O(n). Error: scorear el producto cartesiano y luego «optimizar» el scorer. Criterio: los candidatos salen del bloque, no de un scan global costoso."` — WPS=18/13/15.
- **Findings:** `inverted index`, `membership`, `scan`, `scorear`, `scorer` un-backticked anglicisms. `scorear` verb (S37-ISSUE-06).
- **After:** `"Mecanismo: construye el inverted index una vez (ciudad → lista de \`entity_id\`); la verificación de **membership** con \`set\`/\`dict\` es O(1) amortizado frente a un list scan O(n). Error: **puntuar** (scorear) el producto cartesiano y luego «optimizar» el scorer. Criterio: los candidatos salen del bloque, no de un scan global costoso."`

#### T2-B ¶3 (L220) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T2B\`: filas Lima/Lima/Cusco → bloques {Lima:2, Cusco:1}. Solo comparamos dentro de Lima. Sin afirmar parentesco ni fraude a partir de la ciudad; es solo clave de blocking sintética de laboratorio."` — WPS=11/5/15.
- **Findings:** Strong privacy-disclaimer sentence (matches course pattern). `blocking sintética de laboratorio` is fine.
- **After:** No change.

#### T2-B callout (L246)
- **Before:** `"Construye el índice o blocking key primero; el scorer caro opera sobre candidatos ya reducidos."` — WPS=13.
- **Findings:** `blocking key`, `scorer` anglicisms.
- **After:** `"Construye el índice o la \`blocking_key\` primero; el scorer caro opera sobre candidatos ya reducidos."`

### 6.6 Theory tab — T3-A "Dtypes, chunking y lectura columnar"

#### T3-A ¶1 (L253)
- **Before:** `"Elegir dtypes más angostos (int32 vs int64, categorías) reduce memoria: un int32 ocupa la mitad que un int64 por elemento si el dominio cabe. El chunking procesa el dataset por ventanas para no OOM. El enfoque columnar lee solo las columnas usadas (id, amount) en lugar del registro ancho que arrastra blobs innecesarios."` — WPS=22/9/19.
- **Findings:** `dtypes`, `chunking`, `dataset`, `OOM`, `blobs` un-backticked anglicisms. `angostos` regional (could be `estrechos`).
- **After:** `"Elegir \`dtypes\` más estrechos (int32 vs int64, categorías) reduce memoria: un \`int32\` ocupa la mitad que un \`int64\` por elemento si el dominio cabe. El chunking procesa el dataset por ventanas para no caer en OOM. El enfoque columnar lee solo las columnas usadas (\`id\`, \`amount\`) en lugar del registro ancho que arrastra blobs innecesarios."`

#### T3-A ¶2 (L254) — Mecanismo
- **Before:** `"Mecanismo: mide bytes por elemento (\`array.itemsize\` o el dtype del stack); declara un bound de memoria; elige size de chunk como tradeoff entre overhead de bucle y pico de RAM; proyecta columnas antes de features. Error: cargar todo en RAM «porque en mi laptop cabe». Criterio: el job documenta chunk_sizes, col_subset y un bound de bytes medible sobre el fixture sintético."` — WPS=22/9/16.
- **Findings:** Extreme anglicism density: `stack`, `bound`, `size de chunk`, `tradeoff`, `overhead`, `RAM`, `features`, `chunk_sizes`, `col_subset`. `stack` could be `pila`, `size de chunk` → `tamaño de chunk`.
- **After:** `"Mecanismo: mide bytes por elemento (\`array.itemsize\` o el dtype del stack); declara un bound de memoria; elige el tamaño de chunk como tradeoff entre el overhead del bucle y el pico de RAM; proyecta las columnas antes de features. Error: cargar todo en RAM «porque en mi laptop cabe». Criterio: el job documenta \`chunk_sizes\`, \`col_subset\` y un bound de bytes medible sobre el fixture sintético."` — Backtick the snake_case identifiers (`chunk_sizes`, `col_subset`); translate `size de chunk` → `tamaño de chunk`.

#### T3-A ¶3 (L255) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T3A\`: range(10) en chunks de 3 → [3,3,3,1]; subset ['id','amount']; int32 vs int64 con itemsize. Didáctica con listas y \`array.array\`; el mismo criterio aplica a formatos columnares cuando el stack del curso ya los introdujo."` — WPS=11/13.
- **Findings:** `stack` anglicism. Code identifiers not backticked: `range(10)`, `subset`, `itemsize`.
- **After:** `"Aplicación a \`CASO-LIM-037-T3A\`: \`range(10)\` en chunks de 3 → \`[3,3,3,1]\`; subset \`['id','amount']\`; \`int32\` vs \`int64\` con \`itemsize\`. Didáctica con listas y \`array.array\`; el mismo criterio aplica a formatos columnares cuando el stack del curso ya los introdujo."`

#### T3-A callout (L285)
- **Before:** `"Tradeoff overhead vs memoria. Demasiado pequeño: overhead; demasiado grande: OOM. Mide itemsize y el pico; no adivines el dtype."` — WPS=4/8/9.
- **Findings:** `Tradeoff`, `overhead`, `OOM` anglicisms.
- **After:** `"Tradeoff overhead vs memoria. Demasiado pequeño: overhead; demasiado grande: OOM. Mide \`itemsize\` y el pico; no adivines el dtype."` — Backtick `itemsize`.

### 6.7 Theory tab — T3-B "Caching, invalidación y out-of-core"

#### T3-B ¶1 (L292)
- **Before:** `"Cachear features o resultados de blocking acelera re-runs, pero un cache stale miente. La clave incluye versión del feature set y cutoff de datos. Out-of-core significa no asumir que todo cabe en RAM: chunk o spill a disco cuando n crece en el batch de triage."` — WPS=12/10/16.
- **Findings:** `Cachear` (S37-ISSUE-06 verb anglicism). `re-runs`, `cache stale`, `feature set`, `cutoff`, `Out-of-core`, `spill` anglicisms. `cache stale` mixes English adjective with no Spanish agreement.
- **After:** `"**Guardar en caché** (cachear) features o resultados de blocking acelera las re-runs, pero un cache stale miente. La clave incluye la versión del feature set y el cutoff de datos. **Out-of-core** significa no asumir que todo cabe en RAM: chunk o spill a disco cuando \`n\` crece en el batch de triage."` — Translate verb; backtick `n`; bold first-use terms.

#### T3-B ¶2 (L293) — Mecanismo
- **Before:** `"Mecanismo: put(key, value); hit si key ∈ store; al cambiar la versión del feature set (p. ej. fs-v1→fs-v2) o el cutoff, la key nueva no pega y se recomputa. Error: cache infinito sin versión de schema. Criterio: documentas invalidate_on=version_or_cutoff y ooc=chunk_if_needed de forma explícita."` — WPS=20/9/14.
- **Findings:** `put`, `hit`, `key`, `store`, `feature set`, `cutoff`, `pega`, `recomputa`, `cache`, `schema`, `invalidate_on`, `ooc` — high code-switching density. `documentas` (tú).
- **After:** `"Mecanismo: \`put(key, value)\`; hit si \`key ∈ store\`; al cambiar la versión del feature set (p. ej. \`fs-v1 → fs-v2\`) o el cutoff, la key nueva no pega y se recomputa. Error: cache infinito sin versión de schema. Criterio: se documenta \`invalidate_on = version_or_cutoff\` y \`ooc = chunk_if_needed\` de forma explícita."` — Backtick code; unify to impersonal `se documenta`.

#### T3-B ¶3 (L294) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T3B\`: key=('fs-v1','2026-01-01') almacena n_pairs; hit True tras put. Invalidar por version_or_cutoff. Solo estructuras en memoria didácticas; sin Redis ni servicios externos en el ejercicio del estudiante."` — WPS=11/4/12.
- **Findings:** `put`, `hit`, `Redis`, `version_or_cutoff` code-switches. `key=(...)` not backticked.
- **After:** `"Aplicación a \`CASO-LIM-037-T3B\`: \`key = ('fs-v1', '2026-01-01')\` almacena \`n_pairs\`; hit \`True\` tras \`put\`. Invalidar por \`version_or_cutoff\`. Solo estructuras en memoria didácticas; sin Redis ni servicios externos en el ejercicio del estudiante."`

#### T3-B callout (L319)
- **Before:** `"Invalidar es parte del diseño. Versiona features y cutoff; no reutilices scores de un schema viejo."` — WPS=6/11.
- **Findings:** `Versiona` is an anglicism verb (from "to version"). Better: `Versiona` → `Versiona las features y el cutoff` or `Mantén versionadas las features y el cutoff`.
- **After:** `"Invalidar es parte del diseño. Mantén versionadas las features y el cutoff; no reutilices scores de un schema viejo."`

### 6.8 Theory tab — T4-A "Performance budget y tests"

#### T4-A ¶1 (L326)
- **Before:** `"Un performance budget fija límites: p95 latency < X ms, memoria < Y, pares candidatos < Z. Un test de regresión de performance falla el PR si se rompe el budget sobre el mismo fixture. CI light corre un bench corto; nightly puede ser más largo y estricto."` — WPS=14/16/13.
- **Findings:** `performance budget`, `p95 latency`, `CI light`, `bench`, `nightly` anglicisms. `CI light` un-backticked.
- **After:** `"Un **performance budget** fija límites: p95 latency < X ms, memoria < Y, pares candidatos < Z. Un test de regresión de performance falla el PR si se rompe el budget sobre el mismo fixture. CI light corre un bench corto; el nightly puede ser más largo y estricto."` — Bold first-use term; add article before `nightly`.

#### T4-A ¶2 (L327) — Mecanismo
- **Before:** `"Mecanismo: pass = measured_ms ≤ budget_ms (y análogos para memoria/pares). Error: «en mi máquina pasa» sin umbral en CI. Criterio: el budget se acuerda con el dueño del servicio de triage y se versiona junto al dataset de bench sintético del repositorio."` — WPS=14/12/19.
- **Findings:** `pass`, `measured_ms`, `budget_ms`, `CI`, `bench` code-switches. `se acuerda` (impersonal) — fine.
- **After:** `"Mecanismo: \`pass = measured_ms ≤ budget_ms\` (y análogos para memoria/pares). Error: «en mi máquina pasa» sin umbral en CI. Criterio: el budget se acuerda con el dueño del servicio de triage y se versiona junto al dataset de bench sintético del repositorio."` — Backtick the predicate.

#### T4-A ¶3 (L328) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T4A\`: budget 50ms, measured 12ms → pass True. Si un cambio de scorer sube a 80ms, el test falla y se exige justificar o revertir. Sin red real; medición local del proxy de trabajo del laboratorio."` — WPS=10/16/9.
- **Findings:** `pass`, `measured`, `scorer`, `proxy` code-switches. `budget 50ms` → `budget de 50 ms` (RAE space before unit).
- **After:** `"Aplicación a \`CASO-LIM-037-T4A\`: budget de 50 ms, measured 12 ms → \`pass = True\`. Si un cambio de scorer sube a 80 ms, el test falla y se exige justificar o revertir. Sin red real; medición local del proxy de trabajo del laboratorio."` — Add `de` and space before `ms`.

#### T4-A callout (L348)
- **Before:** `"Bench corto en PR; largo en nightly. Mismo dataset de bench; no cambies n en silencio."` — WPS=8/9.
- **Findings:** `Bench`, `PR`, `nightly`, `n` code-switches. `Mismo dataset` here is acceptable (no `mismo resultado` pattern).
- **After:** `"Bench corto en PR; largo en nightly. Mismo dataset de bench; no cambies \`n\` en silencio."`

### 6.9 Theory tab — T4-B "Costo total, claridad y no microoptimización"

#### T4-B ¶1 (L355)
- **Before:** `"El costo total incluye ingeniería humana, compute y riesgo de bugs. Una microoptimización del 2% que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después con mismo resultado, dataset y límites — no un leaderboard de microbenchmarks desconectados del path de producción."` — WPS=11/12/26.
- **Findings:** `compute`, `bugs`, `leaderboard`, `microbenchmarks`, `path` anglicisms. `2%` → `2 %`. `mismo resultado` missing `el` (S37-ISSUE-05, recurrence).
- **After:** `"El costo total incluye ingeniería humana, cómputo y riesgo de bugs. Una microoptimización del 2 % que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después **con el mismo resultado**, dataset y límites — no un leaderboard de microbenchmarks desconectados del path de producción."`

#### T4-B ¶2 (L356) — Mecanismo
- **Before:** `"Mecanismo: speedup = before_ms / after_ms (ratio, no resta). pair_factor = before_pairs // after_pairs dice «cuántas veces menos pares»; no lo confundas con reduction = 1 − after/before de T2-A (fracción eliminada). micro_only=False cuando el ganador fue blocking/algo. El PR explica el tradeoff en español profesional."` — WPS=11/22/9/9.
- **Findings:** `speedup`, `pair_factor`, `reduction`, `micro_only`, `blocking/algo`, `tradeoff` code-switches. `algo` is colloquial short for `algoritmo` (formal writing should use `algoritmo`). `no lo confundas` (tú) register.
- **After:** `"Mecanismo: \`speedup = before_ms / after_ms\` (ratio, no resta). \`pair_factor = before_pairs // after_pairs\` dice «cuántas veces menos pares»; no lo confundas con \`reduction = 1 − after/before\` de T2-A (fracción eliminada). \`micro_only = False\` cuando el ganador fue el blocking o el algoritmo. El PR explica el tradeoff en español profesional."`

#### T4-B ¶3 (L357) — Aplicación
- **Before:** `"Aplicación a \`CASO-LIM-037-T4B\`: before 100ms/1e6 pares → after 20ms/5e4 pares: speedup 5×, pair_factor 20× (y reduction 0.95 si lo reportas como fracción). El equipo prefiere ese cambio al rewrite opaco de un 2%. Datos sintéticos del path N3 de Red Andina ficticia."` — WPS=14/13/7.
- **Findings:** `before`, `after`, `speedup`, `pair_factor`, `reduction`, `rewrite`, `path` code-switches. `100ms` → `100 ms` (RAE space). `2%` → `2 %`.
- **After:** `"Aplicación a \`CASO-LIM-037-T4B\`: before 100 ms / 1e6 pares → after 20 ms / 5e4 pares: \`speedup = 5×\`, \`pair_factor = 20×\` (y \`reduction = 0.95\` si lo reportas como fracción). El equipo prefiere ese cambio al rewrite opaco de un 2 %. Datos sintéticos del path N3 de Red Andina ficticia."`

#### T4-B callout (L382)
- **Before:** `"Mismo resultado, dataset, hardware y límites. Before/after legible para el revisor humano del PR."` — WPS=7/7.
- **Findings:** `Mismo resultado` without `el` (S37-ISSUE-05). Acceptable as apposition fragment but RAE-prescriptive form would be `El mismo resultado, …`.
- **After:** `"Mismo resultado, dataset, hardware y límites. Before/after legible para el revisor humano del PR."` — Acceptable as callout.

### 6.10 I Do tab

#### iDo.intro (L387)
- **Before:** `"Te muestro 8 demos de medición, blocking, memoria y budgets del path de escala del triage sobre CASO-LIM-037 (sintético)."` — WPS=18.
- **Findings:** `Te muestro` (tú) register — consistent with `iDo` teacher voice. `path`, `budgets` un-backticked. `CASO-LIM-037` inline tag (S37-ISSUE-20).
- **After:** `"Te muestro 8 demos de medición, blocking, memoria y budgets del path de escala del triage sobre \`CASO-LIM-037\` (sintético)."` — Backtick the case ID.

#### iDo.steps[0].why (L452) — Sample why field
- **Before:** `"Deriva wall, CPU, pico de alocaciones y la función caliente (cProfile) del work real con n; los ms exactos varían por máquina, por eso el demo reporta predicados estables."` — WPS=29 (long).
- **Findings:** `wall`, `CPU`, `cProfile`, `work`, `ms` code-switches. `n` not backticked. Long sentence (>25 WPS).
- **After:** `"Deriva wall, CPU, pico de alocaciones y la función caliente (\`cProfile\`) del work real con \`n\`. Los ms exactos varían por máquina; por eso el demo reporta predicados estables."` — Split into two sentences; backtick `cProfile` and `n`.

#### iDo.steps[7].why (L646) — Sample why field
- **Before:** `"Before/after con ratio, factor de pares y same_result; micro_only False cuando ganó el algoritmo."` — WPS=14.
- **Findings:** `same_result`, `micro_only` un-backticked. `ganó el algoritmo` — fine.
- **After:** `"Before/after con ratio, factor de pares y \`same_result\`; \`micro_only = False\` cuando ganó el algoritmo."`

(The other 6 `why` fields follow the same pattern; the same backticking / sentence-splitting applies.)

### 6.11 We Do tab

#### weDo.intro (L651)
- **Before:** `"S37 · Laboratorio de escala del triage (24 retos). E1 repara el defecto de medición o costo, E2 fija la política y E3 transfiere el criterio al reporte before/after. Fixtures CASO-LIM-037; sin PII real. Cada reto exige un predicado calculado, no solo imprimir un lema."` — WPS=8/22/6/12.
- **Findings:** `S37 ·` step-ID prefix (S37-ISSUE-04 sibling). `defecto de medición o costo` — `de medición o de costo` would be more idiomatic. `before/after`, `PII`, `Fixtures CASO-LIM-037` code-switches.
- **After:** `"**S37 ·** Laboratorio de escala del triage (24 retos). E1 repara el defecto de medición o de costo, E2 fija la política y E3 transfiere el criterio al reporte before/after. Fixtures \`CASO-LIM-037\`; sin PII real. Cada reto exige un predicado calculado, no solo imprimir un lema."` — Bold the prefix; add `de` before `costo`; backtick the case ID.

#### weDo.steps[0].instruction (L657) — S37-T1-A-E1
- **Before:** `"S37-T1-A-E1 · CASO-LIM-037-1A: mide wall del work sintético con time.perf_counter y reporta n=1000, metric 'wall', ok True. El starter ya mide wall pero reporta n=0 (defect: el n del fixture no viaja al reporte). Corrige el reporte de medición."` — WPS=18/22/5.
- **Findings:** `S37-T1-A-E1 ·` prefix. `wall`, `time.perf_counter`, `metric` code-switches. `pero` without preceding comma (S37-ISSUE-12).
- **After:** `"**S37-T1-A-E1 ·** \`CASO-LIM-037-1A\`: mide el wall del work sintético con \`time.perf_counter\` y reporta \`n=1000\`, \`metric='wall'\`, \`ok=True\`. El starter ya mide el wall, pero reporta \`n=0\` (defect: el \`n\` del fixture no viaja al reporte). Corrige el reporte de medición."` — Bold prefix; backtick code; add comma before `pero`.

#### weDo.steps[1].instruction (L707) — S37-T1-A-E2 (WPS=34, dense)
- **Before:** `"S37-T1-A-E2 · Mide wall, CPU y pico de memoria del work sintético (perf_counter + process_time + tracemalloc) con n=5000; imprime wall_ok True, cpu_ok True, peak_ok True, n 5000. Starter mide solo wall, fuerza cpu_ok/peak_ok en False y reporta n 0 (defect). Contrato wall+CPU+memoria del triage sintético CASO-LIM-037."` — WPS=34/22/7.
- **Findings:** S37-ISSUE-10 (long dense instruction). Same prefix/code-switch issues.
- **After (split):** `"**S37-T1-A-E2 ·** Mide wall, CPU y pico de memoria del work sintético (\`perf_counter\` + \`process_time\` + \`tracemalloc\`) con \`n=5000\`. Imprime \`wall_ok True\`, \`cpu_ok True\`, \`peak_ok True\`, \`n 5000\`. El starter mide solo wall, fuerza \`cpu_ok\`/\`peak_ok\` en \`False\` y reporta \`n 0\` (defect). Contrato wall+CPU+memoria del triage sintético \`CASO-LIM-037\`."` — Split into 3 sentences; backtick all code.

#### weDo.steps[0].feedback (L662)
- **Before:** `"S37-T1-A-E1: sin n el wall_ms no es comparable entre PRs."` — WPS=10.
- **Findings:** `PRs` plural sigla (S37-ISSUE-11). `wall_ms`, `n` code-switches.
- **After:** `"**S37-T1-A-E1:** sin \`n\` el \`wall_ms\` no es comparable entre PR."` — Plural sigla `PR` (invariable); backtick `n` and `wall_ms`.

#### weDo.steps[16].instruction (L1310) — S37-T3-B-E1 (comma-parenthesis whitespace)
- **Before:** `"S37-T3-B-E1 · Cache key completa: imprime ('fs-v1','cut'), hit True, ok True. Starter key incompleta solo ('fs-v1',) (defect: colisiones). Fixture de features sintéticas versionadas."` — WPS=12/13/5.
- **Findings:** `('fs-v1',) (defect:` — no space between parenthetical close and next paren (S37-ISSUE-13). `Cache key` anglicism (could be `clave de caché`).
- **After:** `"**S37-T3-B-E1 ·** Clave de caché completa: imprime \`('fs-v1','cut')\`, \`hit True\`, \`ok True\`. El starter usa una key incompleta, solo \`('fs-v1',)\` (defect: colisiones). Fixture de features sintéticas versionadas."` — Translate `Cache key`; add comma-space after parenthetical close.

#### weDo.steps[21].instruction (L1567) — S37-T4-B-E2 (WPS=40, densest)
- **Before:** `"S37-T4-B-E2 · Claridad sobre shaving 2%: con algo_gain=0.80 y micro_gain=0.02, prefiere 'clarity' si micro_gain < 0.05 y algo_gain > micro_gain; imprime prefer, ok (algo_gain > micro_gain), shave '2pct_no'. Starter fija prefer='micro_shave' y shave='2pct_yes' sin aplicar la regla (defect)."` — WPS=40/13.
- **Findings:** S37-ISSUE-10 (longest instruction in section). `shaving 2%` → `shaving del 2 %`. `claridad` is a Spanish word used as a code-string value — ambiguous. `prefer`, `ok`, `shave`, `2pct_no`, `2pct_yes`, `micro_shave`, `algo_gain`, `micro_gain` code-switches packed in.
- **After (split + backtick):** `"**S37-T4-B-E2 ·** Claridad sobre shaving del 2 %: con \`algo_gain=0.80\` y \`micro_gain=0.02\`, prefiere \`'clarity'\` si \`micro_gain < 0.05\` y \`algo_gain > micro_gain\`. Imprime \`prefer\`, \`ok\` (\`algo_gain > micro_gain\`), \`shave '2pct_no'\`. El starter fija \`prefer='micro_shave'\` y \`shave='2pct_yes'\` sin aplicar la regla (defect)."` — Split into 3 sentences.

(The remaining 20 weDo instructions follow the same patterns; the same fix templates apply. Full per-step rewrite is left to the Fixer pass.)

### 6.12 You Do tab

#### youDo.context (L1648)
- **Before:** `"Mide path caliente, aplica blocking/estructuras, budget test y reporte. Solo datos sintéticos; mismo resultado funcional."` — WPS=8/6.
- **Findings:** `path`, `blocking/estructuras`, `budget test` code-switches. `mismo resultado funcional` missing `el` (S37-ISSUE-05).
- **After:** `"Mide el path caliente, aplica blocking/estructuras, budget test y reporte. Solo datos sintéticos; **el mismo resultado funcional**."`

#### youDo.requirements[0] (L1656)
- **Before:** `"Mismo resultado funcional"` — WPS=4, fragment.
- **Findings:** `mismo resultado` missing `el` (S37-ISSUE-05). Acceptable as a bulleted requirement fragment.
- **After:** `"El mismo resultado funcional"` (or keep as bulleted fragment with the article implied).

#### youDo.portfolioNote (L1718)
- **Before:** `"Escala CP-N3-C: adjunta el dict report (before/after ms, pares, reduction, same_result, budget, dataset, hardware) y una nota breve del tradeoff en español profesional."` — WPS=20.
- **Findings:** `CP-N3-C` internal code (S37-ISSUE-03). `dict`, `report`, `tradeoff` code-switches. `before/after ms, pares, reduction, …` list inside prose.
- **After:** `"Escala **CP-N3-C**: adjunta el \`dict\` \`report\` (before/after ms, pares, \`reduction\`, \`same_result\`, \`budget\`, \`dataset\`, \`hardware\`) y una nota breve del tradeoff en español profesional."` — Backtick the snake_case identifiers; bold the competency code.

#### youDo.rubric[6].criterion (L1726)
- **Before:** `"Before/after con mismo resultado"` — WPS=5, fragment.
- **Findings:** `mismo resultado` missing `el` (S37-ISSUE-05).
- **After:** `"Before/after con el mismo resultado"` (or accept as bulleted rubric fragment).

#### youDo.starterCode (L1661–1716)
- **Before:** Multi-line Python code block. Not Spanish prose. No grammar findings.
- **Findings:** Inline Spanish comments are minimal (`# warmup`, `# warmup descartada`, `# ms exactos varían por máquina; predicados estables + hot_fn`, `# alocación acotada didáctica`, `# anota el fixture exacto`, `# reemplaza por tu máquina real (p. ej. M2-16GB)`, `# same_result: misma semántica de conteo de referencia`). These are clean.
- **After:** No change.

### 6.13 Self-check tab

#### Q1 (L1732)
- **Before:** `"Warmup sirve para:"` — fragment ending with `:`. Options are 4 short Spanish sentences. CorrectIndex=0, explanation: `"La primera corrida incluye cold start; warmup la descarta para reportar el estado estacionario del algoritmo."`
- **Findings:** No issues. `cold start` un-glossed (S37-ISSUE-18 sibling).
- **After:** `"Warmup sirve para:"` — Add `cold start (arranque en frío)` in the explanation: `"La primera corrida incluye cold start (arranque en frío); warmup la descarta para reportar el estado estacionario del algoritmo."`

#### Q2 (L1738)
- **Before:** `"Blocking reduce:"` — fragment. Correct option: `"Pares candidatos O(n²) (con tradeoff de recall)"`. Explanation: `"Particionar por clave reduce el número de pares que entran al scorer caro; el recall sigue siendo gate (S30)."`
- **Findings:** `tradeoff`, `scorer`, `gate` code-switches.
- **After:** Add articles: `"Particionar por clave reduce el número de pares que entran al scorer caro; el recall sigue siendo el gate (S30)."`

#### Q3 (L1744)
- **Before:** `"Performance budget en CI:"`. Correct option: `"Falla si se rompe el límite acordado sobre el fixture"`. Explanation: `"El test de regresión de performance debe poder poner rojo el PR cuando se viola el budget."`
- **Findings:** `poner rojo el PR` is informal/idiomatic ("make the PR red"). `budget` code-switch. Otherwise accurate.
- **After:** `"El test de regresión de performance debe poder poner en rojo el PR cuando se viola el budget."` — `poner en rojo` (more standard).

#### Q4 (L1750)
- **Before:** `"Microoptimizar 2% sin medición:"`. Correct option: `"Teatro; prioriza claridad y cambios algorítmicos medidos"`. Explanation: `"El costo total incluye bugs y review; sin medición el 2% es ruido y a menudo pérdida neta."`
- **Findings:** `2%` → `2 %`. `bugs`, `review` code-switches. `Microoptimizar` is acceptable (the verb is in DLE-Rae via derivation).
- **After:** `"Microoptimizar un 2 % sin medición:"` and `"El costo total incluye bugs y review; sin medición, el 2 % es ruido y a menudo pérdida neta."`

#### Q5 (L1756)
- **Before:** `"Un wall_ms sin n en el reporte:"`. Correct option: `"No es comparable entre cambios de dataset"`. Explanation: `"Sin el tamaño del input no puedes comparar benches ni validar que el fixture no cambió en silencio. Hardware ayuda, pero no sustituye n."`
- **Findings:** `wall_ms`, `n`, `dataset`, `benches`, `Hardware`, `n` code-switches. `no puedes` (tú) register.
- **After:** `"Un \`wall_ms\` sin \`n\` en el reporte:"` and `"Sin el tamaño del input no puedes comparar benches ni validar que el fixture no cambió en silencio. El hardware ayuda, pero no sustituye \`n\`."` — Backtick `n`; add article before `hardware`.

---

## 7. Proposed GitHub-style Diffs

> Diffs are proposals only. Do not apply. Each diff is anchored to a unique substring of the source.

### Diff S37-DIFF-01 (S37-ISSUE-01 — Stale file name and id)
**This is the highest-impact fix.** Two coordinated changes:

```diff
--- a/src/lib/course/sections/s37-dbt-bigquery.ts
+++ b/src/lib/course/sections/s37-dbt-bigquery.ts
 (file rename: s37-dbt-bigquery.ts → s37-profiling-rendimiento.ts)
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section37: CourseSection = {
-  id: "dbt-bigquery",
+  id: "profiling-rendimiento",
   index: 37,
   title: "Profiling, algoritmos y rendimiento",
   shortTitle: "Profiling y rendimiento",
```

And in `src/lib/course/index.ts`:
```diff
-import { section37 } from './sections/s37-dbt-bigquery'
+import { section37 } from './sections/s37-profiling-rendimiento'
```

**Caveat:** Renaming the file and changing `id` may break persisted learner state in localStorage / Firestore keyed by `id`. Check `course-state` directory and any persisted-progress keying before applying.

### Diff S37-DIFF-02 (S37-ISSUE-05 — "mismo resultado" missing article)
Apply across all 6 occurrences:

```diff
--- a/src/lib/course/sections/s37-dbt-bigquery.ts
+++ b/src/lib/course/sections/s37-dbt-bigquery.ts
@@ -8,1 +8,1 @@
-  tagline: "reporte antes/después con mismo resultado, dataset, hardware y límites; optimización reversible y justificada",
+  tagline: "Reporte antes/después con el mismo resultado, dataset, hardware y límites; optimización reversible y justificada.",
@@ -355,1 +355,1 @@
-        "El costo total incluye ingeniería humana, compute y riesgo de bugs. Una microoptimización del 2% que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después con mismo resultado, dataset y límites — no un leaderboard de microbenchmarks desconectados del path de producción.",
+        "El costo total incluye ingeniería humana, cómputo y riesgo de bugs. Una microoptimización del 2 % que oscurece el código suele ser pérdida neta. El entregable de escala es el reporte antes/después con el mismo resultado, dataset y límites — no un leaderboard de microbenchmarks desconectados del path de producción.",
@@ -774,1 +774,1 @@
-        instruction: "S37-T1-A-E3 · Correctitud junto a velocidad: calcula same_result comparando before_fn y after_fn sobre el mismo input; imprime same_result, ok (igual a same_result) y n 1. Starter usa after_fn defectuosa que cambia el resultado (defect: same_result False). El gate de escala exige mismo resultado funcional en CASO-LIM-037.",
+        instruction: "S37-T1-A-E3 · Correctitud junto a velocidad: calcula `same_result` comparando `before_fn` y `after_fn` sobre el mismo input; imprime `same_result`, `ok` (igual a `same_result`) y `n 1`. El starter usa una `after_fn` defectuosa que cambia el resultado (defect: `same_result False`). El gate de escala exige el mismo resultado funcional en `CASO-LIM-037`.",
@@ -1648,1 +1648,1 @@
-      "Mide path caliente, aplica blocking/estructuras, budget test y reporte. Solo datos sintéticos; mismo resultado funcional.",
+      "Mide el path caliente, aplica blocking/estructuras, budget test y reporte. Solo datos sintéticos; el mismo resultado funcional.",
@@ -1656,1 +1656,1 @@
-      "Mismo resultado funcional",
+      "El mismo resultado funcional",
@@ -1726,1 +1726,1 @@
-      { criterion: "Before/after con mismo resultado", weight: "bonus" },
+      { criterion: "Before/after con el mismo resultado", weight: "bonus" },
```

### Diff S37-DIFF-03 (S37-ISSUE-06 — Verb anglicisms)

```diff
--- a/src/lib/course/sections/s37-dbt-bigquery.ts
+++ b/src/lib/course/sections/s37-dbt-bigquery.ts
@@ -17,2 +17,2 @@
-    { text: "Profilear wall y CPU (perf_counter / process_time) y anotar memoria con n explícito" },
-    { text: "Benchmarkear con warmup, mediana y una nota de variabilidad (rango o IQR simple)" },
+    { text: "Perfilar wall y CPU (`perf_counter` / `process_time`) y anotar memoria con `n` explícito" },
+    { text: "Realizar benchmarks con warmup, mediana y una nota de variabilidad (rango o IQR simple)" },
@@ -218,1 +218,1 @@
-        "dict/set e índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después scorear con el modelo o reglas.",
+        "Los `dict`/`set` y los índices invertidos evitan scans O(n) repetidos. La vectorización ayuda cuando hay arrays densos, pero no sustituye reducir los candidatos antes de features caras. El orden correcto del path de escala es bloquear, indexar y recién después **puntuar** (scorear) con el modelo o reglas.",
@@ -219,1 +219,1 @@
-        "Mecanismo: construye el inverted index una vez (ciudad → lista de entity_id); membership con set/dict es O(1) amortizado frente a list scan O(n). Error: scorear el producto cartesiano y luego «optimizar» el scorer. Criterio: los candidatos salen del bloque, no de un scan global costoso.",
+        "Mecanismo: construye el inverted index una vez (ciudad → lista de `entity_id`); la verificación de **membership** con `set`/`dict` es O(1) amortizado frente a un list scan O(n). Error: **puntuar** (scorear) el producto cartesiano y luego «optimizar» el scorer. Criterio: los candidatos salen del bloque, no de un scan global costoso.",
@@ -292,1 +292,1 @@
-        "Cachear features o resultados de blocking acelera re-runs, pero un cache stale miente. La clave incluye versión del feature set y cutoff de datos. Out-of-core significa no asumir que todo cabe en RAM: chunk o spill a disco cuando n crece en el batch de triage.",
+        "**Guardar en caché** (cachear) features o resultados de blocking acelera las re-runs, pero un cache stale miente. La clave incluye la versión del feature set y el cutoff de datos. **Out-of-core** significa no asumir que todo cabe en RAM: chunk o spill a disco cuando `n` crece en el batch de triage.",
```

### Diff S37-DIFF-04 (S37-ISSUE-08 — `«más clever»`)

```diff
@@ -31,1 +31,1 @@
-        "Escalar el triage no es «hacer el código más clever»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests. Historia típica: un PR mergea un shaving del 2% en un loop interno y, en n=1e5 pares, el wall se duplica porque nadie midió el fixture completo.",
+        "Escalar el triage no es «hacer el código más ingenioso»: es medir el path caliente, preservar el mismo resultado funcional y publicar un reporte antes/después con dataset, hardware y límites explícitos. Sin esa disciplina, la optimización es teatro y puede romper privacidad o tests. Historia típica: un PR mergea un `shaving` del 2 % en un loop interno y, con `n=1e5` pares, el wall se duplica porque nadie midió el fixture completo.",
```

### Diff S37-DIFF-05 (S37-ISSUE-09 — Register unification, T1-A ¶1)
```diff
@@ -67,1 +67,1 @@
-        "Wall time es el reloj de pared que percibe el usuario o el batch (`time.perf_counter`); CPU time es el tiempo de procesador (`time.process_time`). Cuando wall >> CPU, el job espera I/O o el SO; cuando ambos crecen, el path es compute-bound. La memoria pico limita si el job cabe en el worker: `tracemalloc` muestrea alocaciones en stdlib. Cuando el wall ya te dijo *qué tramo* es caro, `cProfile` nombra la **función** exacta (hot path) sin adivinar.",
+        "Wall time es el reloj de pared que percibe el usuario o el batch (`time.perf_counter`); CPU time es el tiempo de procesador (`time.process_time`). Cuando wall >> CPU, el job espera I/O o al SO; cuando ambos crecen, el path es **compute-bound** (acotado por cómputo, no por I/O). La memoria pico limita si el job cabe en el worker: `tracemalloc` muestrea alocaciones en stdlib. Cuando el wall ya indicó *qué tramo* es caro, `cProfile` nombra la **función** exacta (hot path) sin adivinar.",
```

### Diff S37-DIFF-06 (S37-ISSUE-10 — Split long instruction S37-T4-B-E2)
```diff
@@ -1567,1 +1567,3 @@
-        instruction: "S37-T4-B-E2 · Claridad sobre shaving 2%: con algo_gain=0.80 y micro_gain=0.02, prefiere 'clarity' si micro_gain < 0.05 y algo_gain > micro_gain; imprime prefer, ok (algo_gain > micro_gain), shave '2pct_no'. Starter fija prefer='micro_shave' y shave='2pct_yes' sin aplicar la regla (defect).",
+        instruction: "S37-T4-B-E2 · Claridad sobre shaving del 2 %: con `algo_gain=0.80` y `micro_gain=0.02`, prefiere `'clarity'` si `micro_gain < 0.05` y `algo_gain > micro_gain`. Imprime `prefer`, `ok` (`algo_gain > micro_gain`), `shave '2pct_no'`. El starter fija `prefer='micro_shave'` y `shave='2pct_yes'` sin aplicar la regla (defect).",
```

### Diff S37-DIFF-07 (S37-ISSUE-10 — Split long instruction S37-T1-A-E2)
```diff
@@ -707,1 +707,3 @@
-        instruction: "S37-T1-A-E2 · Mide wall, CPU y pico de memoria del work sintético (perf_counter + process_time + tracemalloc) con n=5000; imprime wall_ok True, cpu_ok True, peak_ok True, n 5000. Starter mide solo wall, fuerza cpu_ok/peak_ok en False y reporta n 0 (defect). Contrato wall+CPU+memoria del triage sintético CASO-LIM-037.",
+        instruction: "S37-T1-A-E2 · Mide wall, CPU y pico de memoria del work sintético (`perf_counter` + `process_time` + `tracemalloc`) con `n=5000`. Imprime `wall_ok True`, `cpu_ok True`, `peak_ok True`, `n 5000`. El starter mide solo wall, fuerza `cpu_ok`/`peak_ok` en `False` y reporta `n 0` (defect). Contrato wall+CPU+memoria del triage sintético `CASO-LIM-037`.",
```

### Diff S37-DIFF-08 (S37-ISSUE-11 — `PRs` plural sigla)
```diff
@@ -662,1 +662,1 @@
-        feedback: "S37-T1-A-E1: sin n el wall_ms no es comparable entre PRs.",
+        feedback: "S37-T1-A-E1: sin `n` el `wall_ms` no es comparable entre PR.",
```

### Diff S37-DIFF-09 (S37-ISSUE-12 — Missing comma before `pero`)
```diff
@@ -657,1 +657,1 @@
-        instruction: "S37-T1-A-E1 · CASO-LIM-037-1A: mide wall del work sintético con time.perf_counter y reporta n=1000, metric 'wall', ok True. El starter ya mide wall pero reporta n=0 (defect: el n del fixture no viaja al reporte). Corrige el reporte de medición.",
+        instruction: "S37-T1-A-E1 · `CASO-LIM-037-1A`: mide el wall del work sintético con `time.perf_counter` y reporta `n=1000`, `metric 'wall'`, `ok True`. El starter ya mide el wall, pero reporta `n=0` (defect: el `n` del fixture no viaja al reporte). Corrige el reporte de medición.",
```

### Diff S37-DIFF-10 (S37-ISSUE-13 — Comma-parenthesis whitespace)
```diff
@@ -1310,1 +1310,1 @@
-        instruction: "S37-T3-B-E1 · Cache key completa: imprime ('fs-v1','cut'), hit True, ok True. Starter key incompleta solo ('fs-v1',) (defect: colisiones). Fixture de features sintéticas versionadas.",
+        instruction: "S37-T3-B-E1 · Clave de caché completa: imprime `('fs-v1','cut')`, `hit True`, `ok True`. El starter usa una key incompleta, solo `('fs-v1',)` (defect: colisiones). Fixture de features sintéticas versionadas.",
```

### Diff S37-DIFF-11 (S37-ISSUE-14 — `mata` colloquialism)
```diff
@@ -185,1 +185,1 @@
-        "Comparar todos los pares es O(n²) y mata el entity resolution y el grafo cuando n crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo número uno es el conteo de pares antes y después del blocking.",
+        "Comparar todos los pares es O(n²) y bloquea el entity resolution y el grafo cuando `n` crece. El blocking particiona por clave (ciudad, prefijo, ventana) y solo genera candidatos dentro del bloque. La métrica de costo principal es el conteo de pares antes y después del blocking.",
```

### Diff S37-DIFF-12 (S37-ISSUE-15 — `un solo shot`)
```diff
@@ -146,1 +146,1 @@
-        "Mecanismo: work(); luego N runs post-warmup; mediana en ms; anota n_runs y, si hace falta, rango o IQR simple como nota de variabilidad. Error: publicar un solo run sin warmup como «verdad». Si la variabilidad es alta, subes N o aíslas ruido (otras apps, thermal); no inventas un speedup con un solo shot.",
+        "Mecanismo: ejecuta `work()`; luego N runs post-warmup; mediana en ms; anota `n_runs` y, si hace falta, el rango o el IQR simple como nota de variabilidad. Error: publicar un solo run sin warmup como «verdad». Si la variabilidad es alta, sube N o aísla el ruido (otras apps, thermal); no presentes un speedup con una sola medición.",
```

### Diff S37-DIFF-13 (S37-ISSUE-19 — Split dictionary mega-paragraph)
```diff
@@ -30,1 +30,1 @@
-        "**Diccionario de la sección** (léelo antes de T1). **Wall time:** reloj de pared (`time.perf_counter`). **CPU time:** tiempo de procesador (`time.process_time`). **Warmup:** corrida descartada (el cold start miente). **Blocking:** particionar por clave para no generar todos los pares O(n²). **Performance budget:** umbral de ms/memoria/pares que el CI light puede fallar. **same_result:** el speedup no vale si cambia el resultado funcional del matching/features.",
+        "**Diccionario de la sección** (léelo antes de T1). Los términos técnicos (`Wall time`, `CPU time`, `Warmup`, `Blocking`, `Performance budget`, `same_result`) se definen la primera vez que se usan en T1 y T2. Si prefieres una vista rápida: `Wall time` = reloj de pared (`time.perf_counter`); `CPU time` = tiempo de procesador (`time.process_time`); `Warmup` = corrida descartada (el cold start miente); `Blocking` = particionar por clave para no generar todos los pares O(n²); `Performance budget` = umbral de ms/memoria/pares que el CI light puede fallar; `same_result` = el speedup no vale si cambia el resultado funcional del matching/features.",
```

### Diff S37-DIFF-14 (S37-ISSUE-02 — Remove duplicate `hint:` field)
Requires touching all 24 weDo steps. Pattern:

```diff
@@ -657,3 +657,2 @@
         instruction: "...",
-        hint: "Todo wall_ms viaja con su n.",
         hints: ["Todo wall_ms viaja con su n.", "print('n', n) con n=1000 del fixture."],
```

(Repeat for all 24 weDo steps. The renderer should be audited to confirm it reads `hints[0]` when `hint` is absent. If it reads `hint` only, the inverse migration is needed: drop `hints` and keep `hint`.)

### Diff S37-DIFF-15 (S37-ISSUE-03 — Strip `(CP-N3-C escala)` from headings)
```diff
@@ -28,1 +28,1 @@
-      heading: "Rendimiento del triage (CP-N3-C escala)",
+      heading: "Rendimiento del triage",
@@ -1646,1 +1646,1 @@
-    title: "Reporte antes/después de escala del triage (CP-N3-C escala)",
+    title: "Reporte antes/después de escala del triage",
```

(Move `CP-N3-C escala` to a `meta.competencyCode` field if it's needed for grading/analytics.)

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Severity | Effort | Why first |
|---|---|---|---|---|
| 1 | S37-ISSUE-01 (file name + `id` mismatch) | H | Low (rename + state-migration check) | Top-pedagogical-contract violation; undermines learner trust and URL semantics |
| 2 | S37-ISSUE-05 (`mismo resultado` missing article, ×6) | M | Trivial (find/replace) | Recurring grammar defect in 6 learner-facing strings including tagline |
| 3 | S37-ISSUE-06 (verb anglicisms `Profilear`, `Benchmarkear`, `scorear`, `cachear`) | M | Low (4 string edits) | High-visibility learner-facing verb forms |
| 4 | S37-ISSUE-10 (split long instructions, ×8) | M | Low (8 string splits) | Cognitive-load spikes in We-Do tab where learners execute |
| 5 | S37-ISSUE-07 (inline anglicism backticking, ~80 occurrences) | M | Medium (mechanical pass) | Reads as translated-from-English; backticking alone improves readability substantially |
| 6 | S37-ISSUE-09 (register unification, ~10 verbs) | M | Low | Editorial consistency in formal theory paragraphs |
| 7 | S37-ISSUE-08 (`«más clever»` → `«más ingenioso»`) | L | Trivial | Single-edit fix |
| 8 | S37-ISSUE-11 (`PRs` → `PR`) | L | Trivial | Single-edit fix |
| 9 | S37-ISSUE-12 (comma before `pero`) | L | Trivial | Single-edit fix |
| 10 | S37-ISSUE-13 (comma-parenthesis whitespace) | L | Trivial | Single-edit fix |
| 11 | S37-ISSUE-14 (`mata` → `bloquea`) | L | Trivial | Single-edit fix |
| 12 | S37-ISSUE-15 (`un solo shot` → `una sola medición`) | L | Trivial | Single-edit fix |
| 13 | S37-ISSUE-17 (`número uno` → `principal`) | L | Trivial | Single-edit fix |
| 14 | S37-ISSUE-19 (split dictionary mega-paragraph) | M | Low | Progressive-disclosure improvement |
| 15 | S37-ISSUE-18 (glossary additions for `compute-bound`, `cold start`, `hot path`, `out-of-core`) | L | Low | Adds 4 dictionary entries |
| 16 | S37-ISSUE-02 (remove duplicate `hint` field) | M | Low (×24) but requires renderer audit | Source hygiene; same fix as S01 |
| 17 | S37-ISSUE-03 (strip `CP-N3-C escala` from headings) | L | Trivial | Internal-code exposure in headings |
| 18 | S37-ISSUE-20 (`CASO-LIM-037` inline tag) | L | Medium (30+ strings) | Acceptable for senior audience; defer |
| 19 | S37-ISSUE-21/22 (templated `tests` and `edgeCases` fields) | L | Medium (24 each) | Cosmetic; defer to a section-wide refactor |
| 20 | S37-ISSUE-04 (bridge references) | L | None | Defensible as connective tissue; keep |

---

## 9. Graph Memory Update notes (for the shared context files)

For the orchestrator's shared context / next-pass agents:

- **Section 37 = `Profiling, algoritmos y rendimiento`** (NOT dbt-bigquery despite file name and `id`). The file `s37-dbt-bigquery.ts` and `id: "dbt-bigquery"` are stale; the live site correctly renders the profiling content. Any cross-section audit referencing dbt/BigQuery for S37 should ignore the file name.
- **Bridge map**: S37 receives from S14 (NumPy vectorization), S30 (entity resolution / blocking recall); S37 forwards to S38 (queues, retries, vendor variability). The bridge is explicit at L34.
- **Synthetic-fixture contract**: `CASO-LIM-037` is the synthetic case ID for S37 (fictitious Red Andana case; no PII; matches the course-wide pattern of `CASO-LIM-NNN`).
- **Pattern overlap with S01 audit**: same `hint` vs `hints[0]` duplication (24/24 weDo steps in S37, same as S01). The Fixer pass should apply the same remediation pattern to both sections.
- **No AI-to-developer comments found** in S37 source (`// TODO`, `// FIXME`, `// moved from`, etc.) — cleaner than S01 in that dimension.
- **Worst sentence in section**: S37-T4-B-E2 instruction at L1567 (WPS=40, FH=100.0) — `long_gt32` finding. Best sentence (illustrative of the section's voice at its best): `"La primera corrida miente: caches de CPU, import y JIT de librerías distorsionan el cold start. El warmup descarta esa corrida."` (L145) — concrete, motivated, properly signed by the contract.
- **LanguageTool API hits**: 442 total matches; 407 are `MORFOLOGIK_RULE_ES` (false positives on intentional English tech terms like `Profiling`, `Benchmark`, `warmup`); 22 substantive matches (3 `MISMO_EL_MISMO`, 1 `COMMA_PERO`, 1 `SIGLAS`, 1 `COMMA_PARENTHESIS_WHITESPACE`, plus false-positive `ES_SPLIT_WORDS` and `PREP_VERB` triggered by inline `n` variable). See `/home/z/my-project/audits/S37_lt.json`.
- **Aggregate readability (S37 vs. course)**: FH median = 100.6 (very easy); WPS median = 11 (short). The high readability reflects that most prose is short labels, hints, and feedback strings, not long paragraphs. The 8 dense `instruction` fields (WPS 27-40) drag the section's effective cognitive load higher than the median suggests.
- **Composite score: 7.2/10** (pedagogical structure 9/10; redaction quality 6/10; meta-leak hygiene 5/10 due to the file-name mismatch; exercise alignment 9/10).

---

## Appendix A — Method Note (research summary)

This audit applies the Spanish-grammar subplan from `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`. Concretely:

1. **Source extraction** (`s37_extract.py`): regex-based extraction of `key: "..."` and `key: \`...\`` TS string literals from `s37-dbt-bigquery.ts`, filtered to learner-facing prose fields (`title`, `tagline`, `jobRelevance`, `learningOutcomes`, `theory[].paragraphs`, `iDo.steps[].why`, `weDo.steps[].{instruction,hint,feedback,edgeCases,tests}`, `youDo.{context,objectives,requirements,rubric}`, `selfCheck.questions`, `callout.content`, etc.). 151 Spanish records → 198 sentences.
2. **Sentence segmentation** (Spanish-aware): split on `.!?` followed by capital letter or `¿`/`¡`; protects `p. ej.`, `Dr.`, `Sra.`, etc.
3. **Per-sentence metrics**: WPS (words/sentence), SPW (syllables/word via Spanish vowel-group heuristic with diphthong/hiatus rules), Fernández-Huerta (`206.84 − 60·SPW − 1.02·WPS`), INFLESZ/Szigriszt-Pazos (`206.835 − 62.3·SPW − WPS`).
4. **Heuristic findings** (offline, no API): run-on (>45 W), long (>32 W), missing terminal punctuation, missing `¿`/`¡`, unbalanced quotes/brackets, repeated words, gerund pile-up, high comma density, paragraph-as-one-sentence, anaphoric monotony, space-before-punct, double-space, meta/AI/TODO leak.
5. **LanguageTool API**: 1 chunk of 13,935 chars sent to `https://api.languagetool.org/v2/check` with `language=es`, `level=default`. 442 matches returned; 22 substantive after filtering `MORFOLOGIK_RULE_ES` (intentional English tech terms) and single-character false positives.
6. **Aggregate composite score**: 10 minus weighted findings; density-normalized by sentence count. Used for ranking, not as absolute truth.

Known false-positive classes for S37:
- `MORFOLOGIK_RULE_ES` on intentional English tech terms (`Profiling`, `Benchmark`, `Warmup`, `Blocking`, `Performance budget`, `same_result`, `wall`, `CPU`, `cache`, `scorer`, `fixture`).
- `ES_SPLIT_WORDS` (`reporta n` → `reportan`, `para n` → `paran`, `usa n` → `usan`) caused by inline variable `n` without surrounding spaces in the concatenated prose chunk.
- `PREP_VERB` ("Combinación imposible: preposición seguida de verbo conjugado") on `con time.perf_counter y reporta` — false positive due to tech-term splitting.
- `SUBJUNTIVO_PASADO` at sentence boundaries (`...rendimiento ... reporte ...`) — false positive caused by missing sentence break in concatenated prose.
- `MISMO_EL_MISMO` is a **real** finding (3 confirmed after deduplication); same for `COMMA_PERO`, `SIGLAS`, `COMMA_PARENTHESIS_WHITESPACE`.

---

## Appendix B — Metric Summary

| Metric | min | p25 | median | p75 | max | mean |
|---|---|---|---|---|---|---|
| **WPS** (words/sentence) | 3 | 7 | 11 | 16 | 40 | 12.3 |
| **SPW** (syllables/word) | 0.8 | 1.4 | 1.6 | 1.7 | 3.0 | 1.5 |
| **Fernández-Huerta** | 22.8 | 93.7 | 100.6 | 111.9 | 150.7 | 102.6 |
| **INFLESZ / Szigriszt-Pazos** | 15.9 | 89.8 | 97.2 | 109.4 | 148.9 | 99.3 |

**Interpretation:** median FH 100.6 falls in the "muy fácil" band, but this is misleading — it reflects the high proportion of short labels, hints, and feedback strings (median WPS 11). The 8 long `instruction` fields (WPS 27-40) are the real cognitive-load carriers and push the section's effective difficulty into the "normal / bastante difícil" band for those strings.

**Findings count (heuristic engine):**
- `missing_terminal`: 42 (mostly taglines, headings, callout titles, rubric criteria — acceptable fragments, **not real defects**).
- `meta_leak`: 1 (the `Puente S14→S30→S37` reference; defensible).
- `long_gt32`: 2 (the two longest instruction fields).
- `high_comma_density`: 5 (instruction fields packing predicate lists).

**LanguageTool substantive findings:**
- `MISMO_EL_MISMO`: 3 (S37-ISSUE-05).
- `COMMA_PERO`: 1 (S37-ISSUE-12).
- `SIGLAS`: 1 (S37-ISSUE-11).
- `COMMA_PARENTHESIS_WHITESPACE`: 1 (S37-ISSUE-13).
- `AGREEMENT_PARTICIPLE_NOUN`: 1 (false positive from concatenated rubric criteria).
- `ESPACIO_DESPUES_DE_PUNTO`: 1 (false positive from concatenation).

---

**This is the complete Explorer report for Section 37. Ready for the Fixer prompt.**
