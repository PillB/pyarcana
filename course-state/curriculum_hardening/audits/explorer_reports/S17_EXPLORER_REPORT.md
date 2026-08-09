# S17 Explorer Report — Joins, reshape, groupby y cierre analítico

**Platform id:** `packaging`  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s17-packaging.ts`  
**Live:** https://pillb.github.io/pyarcana/#packaging  
**Auditor role:** Curriculum Explorer (read-only; no product edits)  
**Date:** 2026-07-24  

---

## 1. Section Identification & Scope

| Field | Value |
| --- | --- |
| Index | 17 |
| Platform hash id | `packaging` (legacy; content rethemed) |
| Title | Joins, reshape, groupby y cierre analítico |
| shortTitle | Joins · groupby · cierre |
| Tagline | Executive Data Quality & EDA Portfolio con dataset limpio, notebook/script reproducible, reconciliación y preguntas de negocio |
| Level / phase / hours | Competente · phase 1 · 18h |
| Icon | `Package` (legacy packaging metaphor) |
| Capstone gate | Cierre **CP-N2-A** |
| Predecessors | S15 (ingesta tipada), S16 (calidad/contratos) |
| Successor | S18 (EDA e incertidumbre → CP-N2-B) |

**In-scope content inventory (source of truth = `s17-packaging.ts`):**

| Block | Count / structure |
| --- | --- |
| Theory | 9 blocks: 1 mapa + 8 subtopics (`S17-T1-A` … `S17-T4-B`) with code + callout each |
| I Do | 8 demos (`S17-T*-*-DEMO`), one per subtopic |
| We Do | 24 exercises (8 × E1 guided / E2 independent / E3 transfer) |
| You Do | Portfolio “Executive Data Quality & EDA Portfolio (cierre CP-N2-A)” + starter + rubric |
| selfCheck | 5 MCQ |
| resources | 6 pandas docs + 2 books + 6 courses/links |

**Pedagogical map declared in theory:**

1. **T1 Joins** — claves, cardinalidad, `validate`, anti-join  
2. **T2 Forma** — concat / melt / pivot, nombres estables  
3. **T3 Agregación** — groupby / agg / transform, ventanas y cohortes  
4. **T4 Reconciliación** — totales, denominadores, cutoff anti-leakage  

**Live-site note:** The SPA shell at https://pillb.github.io/pyarcana/ lists Section 17 as “Joins · groupby · cierre” with the same tagline/hours as source. Deep HTML fetch of `#packaging` does not hydrate theory/exercise bodies (client-rendered). Full paragraph/code audit is grounded in the repository source, which is the content pipeline for the live build.

**Out of scope for this run:** Fixing TS, neighboring sections, packaging/CLI curriculum (owned by S10 under id `sklearn`).

---

## 2. Executive Summary of Quality

### Score: **6.7 / 10**

### Verdict

S17 is a **structurally complete, production-minded mid-course capstone** for pandas joins/reshape/groupby with unusually strong attention to **cardinalidad, `validate`, anti-join, reconciliación de totales y leakage temporal** — topics that many free tutorials omit. The I Do (8) + We Do (24) + You Do + selfCheck skeleton matches the course contract and aligns the story with CP-N2-A after S15–S16.

Quality is held back by:

1. **Developer / V3 meta-leak** in the student-facing map, jobRelevance, callouts, rubric, and resource notes (same family of retheme leakage as S15/S16/S18).  
2. **Redaction defects** (English fragment `supposed`, anglicisms, lowercase headings, theory↔code number mismatches).  
3. **Thin formative layer**: micro-print exercises, boilerplate feedback, ultra-short hints, generic You Do rubric vs S01-level connective tissue.  
4. **Cognitive density** for 18h (joins + reshape + groupby + rolling/cohorts + reconciliation + leakage + portfolio close) without an integrated “We Do bridge” before You Do.  
5. **Resource misalignment** (CS50P / MIT intro / Coursera PE for a pandas joins section).

Compared to gold-standard early sections (e.g. S01 jobRelevance + diccionario + progressive glossary), S17 reads as a **competent specialist unit written in compressed V3 retheme voice**, not as a fully polished learner narrative.

**Automated prior signal:** `S17_AUDIT.json` (lesson_auditor) = ACCEPT, 0 high issues — consistent with “no structural boilerplate disaster,” but **understates** pedagogical/meta issues this Explorer pass surfaces.

---

## 3. Detailed Issue Registry

Severity legend: **P0** block learner / wrong fact · **P1** high pedagogical or meta impact · **P2** medium polish · **P3** nice-to-have.

| ID | Sev | Dimension | Location | Evidence (quote / pointer) | Pedagogical impact |
| --- | --- | --- | --- | --- | --- |
| S17-I01 | P1 | Meta-leak | `jobRelevance` | “Esta sección (id `packaging` conservado) retematiza a V3 y **cierra CP-N2-A**…” | Student sees platform archaeology and internal versioning, not motivation. Undermines professional ES-PE tone. |
| S17-I02 | P1 | Meta-leak | Theory map heading + paras + callout | Heading “De “Packaging y CLI” a joins/groupby… (mapa)”; “**S17 no es el path de pyproject.toml ni PyPI**”; callout “Contenido reubicado conceptualmente / Material legado de packaging/CLI **no es el camino V3**” | Front-loads curriculum ops. Cognitive load spent on “what this used to be” instead of joins. |
| S17-I03 | P2 | Meta-leak | `youDo.rubric[0]` | “Alineación al gate V3 de la sección” | Rubric speaks internal product language, not assessable portfolio criteria. |
| S17-I04 | P2 | Meta-leak | `resources.courses` PyArcana note | “curso desplegado; V3 S17 cierre CP-N2-A” | Internal release note leaked into resource list. |
| S17-I05 | P2 | Meta / UX | `icon: "Package"` | Icon still Package while title is joins/groupby | Visual mismatch with live catalog mental model; reinforces legacy packaging id. |
| S17-I06 | P1 | Grammar / EN leak | T1-A callout | “Si len(out) >> len(left) en un **supposed** 1:1, hay fan-out.” | Broken ES-PE; looks unedited. Same idea already correct in paragraph (“supuesto 1:1”). |
| S17-I07 | P2 | Redaction | T1-B theory | “no un **nice-to-have**” | Untranslated anglicism; prefer “no es un lujo opcional” / “no es opcional”. |
| S17-I08 | P2 | Redaction | All 8 content headings | e.g. `"claves y cardinalidad en joins"`, `"denominadores y totales"` | Inconsistent title casing vs Spanish pedagogical UI (should capitalize first letter at minimum). |
| S17-I09 | P0 | Factual consistency | T1-A theory narrative vs code | Narrative: “tx (dos filas C001, **ninguna C003**)”. Code: `tx` includes **C003** with monto 7.0. Left-merge output correctly excludes C003; wording of fixture is wrong. | Learner cannot reconcile story with printed fixture → trust erosion. |
| S17-I10 | P0 | Factual consistency | T4-B theory para vs theory code | Para: “feature segura **10**, leaky **1009**, delta **999**”. Code/output: pre **15**, total **115**, delta **100**. | Direct contradiction between prose and runnable example in the same block. |
| S17-I11 | P1 | Connective tissue | Map + jobRelevance vs S01 style | S17 opens with retheme/id conservation; S01 opens with workplace motivation + dictionary. No “diccionario de la sección” for join/cardinality/leakage terms. | Weaker onboarding; terms introduced mid-stream with high jargon density. |
| S17-I12 | P1 | Connective tissue | Bridge S16→S17→S18 | Mentions S15–S16 APIs and CP-N2-A close; almost no forward “qué queda para S18” beyond implicit EDA. | Capstone close feels abrupt; uncertainty/no-claims memo is requested without S18 scaffolding. |
| S17-I13 | P1 | Pedagogy I/We/You | We Do feedback (all 24) | `feedback: "Compara tu salida con la solución."` | Zero formative diagnosis; violates learning-science guidance for guided practice (why wrong, what misconception). |
| S17-I14 | P1 | Pedagogy | We Do `hints` | Often single tokens: `"merge how='left'."`, `"is_unique."`, `"melt."` | Insufficient scaffolding for autonomous learners (ES-PE course claims gradual release). |
| S17-I15 | P1 | Exercise quality | Transfer E3s | Many E3s still single `print(len(...))` / one number (e.g. T1-A-E3, T2-A-E3, T4-A-E3 residual). | “Transfer” label overstates; little transfer of *integration* of join+agg+reconcile. |
| S17-I16 | P2 | Exercise quality | Starters `print('ok', True)` | Every starter ends with extra `print('ok', True)` while solutions print only pass token | If autocheck is exact stdout, student who only fixes logic but keeps `ok` fails; if not, noise trains bad contracts. |
| S17-I17 | P2 | Pedagogy / meta | Starter `# DEFECT:` comments | e.g. `# DEFECT: inner merge acorta filas` + `youDo`: “corrige el DEFECT del starter” | Useful as bug-fix pedagogy but developer-ticket tone; pair with learner-facing “bug a corregir” wording. |
| S17-I18 | P1 | You Do / rubric | `youDo.rubric` | Generic weights (gate V3 25%, correctitud 20%, privacidad 20%…) without join-specific criteria | Portfolio can pass on process theater without documenting fan-out, anti-join table, schema set, leakage delta. |
| S17-I19 | P1 | Cognitive load | Whole section | 8 theory APIs + rolling/cohorts + leakage + 24 drills + portfolio in **18h** | Intrinsic load high; no progressive “mini-integration” between T2 and T4 before full portfolio. |
| S17-I20 | P2 | Cognitive load | Theory code wrappers | All theory/I Do wrapped in `def s17_th_N():` / `s17_ido_N()` | Extra ceremony vs flat scripts; mild extraneous load for “local-python” demos. |
| S17-I21 | P2 | Consistency demos | T1-B I Do vs theory | Theory catches `pd.errors.MergeError`; I Do uses bare `except Exception` | Teaches inconsistent exception discipline after S09 emphasis on specific exceptions. |
| S17-I22 | P2 | Resources | `resources.courses` | Coursera PE, MIT 6.100L, CS50P primary; weak pandas merge/groupby tutorials | Misaligned external path for Competente pandas section; dilutes “docs oficiales” promise. |
| S17-I23 | P3 | Accessibility / clarity | Terms `eps`, `bridge table`, `as-of`, `fan-out` | Used without first Spanish gloss in places | OK for advanced track if glossary exists; currently no section dictionary. |
| S17-I24 | P2 | selfCheck coverage | Quiz (5 Q) | Covers validate, anti-join, transform, leakage, reconciliation — **not** melt/pivot schema or cohort definition | Acceptable length but gaps vs learningOutcomes 3–6. |
| S17-I25 | P3 | Formatting | Entire file indentation | Single-space TS object indent (unlike S01 double-space style) | Maintainability / review noise; not student-facing if build works. |

### Strengths (graph “quality edges” — do not regress)

- **LO ↔ theory ↔ I Do ↔ We Do** mapping is systematic (`S17-T*-A/B` ids consistently wired).  
- **Production gates** (`validate`, row counts pre/post, schema set equality, cutoff leakage delta) are pedagogically gold vs typical Kaggle “just merge”.  
- **Synthetic Perú context** (Lima/Cusco/Arequipa, PEN, `C00x`) without PII.  
- **You Do** requires memo de límites / no-claims — ethically aligned with later ML sections.  
- **Official pandas docs** for merge, groupby, reshaping, window, timeseries, MergeError are well chosen.  
- Defect-based starters (wrong `how`, inverted rate, no cutoff) support productive struggle when paired with better hints/feedback.

---

## 4. Meta-Leak Report

Exact student-facing (or rubric/resource) developer text to strip or rewrite:

| # | Location | Exact leaked / internal text | Recommended disposition |
| --- | --- | --- | --- |
| M1 | `jobRelevance` | `id \`packaging\` conservado` · `retematiza a V3` | Rewrite as pure job motivation (banca/fintech/retail Perú + portfolio EDA). Keep CP-N2-A only if product UI already surfaces capstone ids to students; else “cierre del portfolio de calidad + EDA”. |
| M2 | Theory heading | `De “Packaging y CLI” a joins/groupby y cierre CP-N2-A (mapa)` | Replace with learner map: “Mapa de la sección: joins → forma → agregación → reconciliación”. |
| M3 | Theory para 1 | `En V3, **S17 no es el path de pyproject.toml ni PyPI**. El id de plataforma \`packaging\` se conserva…` | Delete negation-of-legacy. Optionally one neutral line: packaging/CLI se cubrió en la sección de módulos/CLI. |
| M4 | Callout | Title `Contenido reubicado conceptualmente` · body `Material legado de packaging/CLI **no es el camino V3 en S17**…` | Replace with tip: “En esta sección empaquetas evidencia analítica, no un paquete PyPI.” |
| M5 | Rubric | `Alineación al gate V3 de la sección` | Replace with measurable criteria (see Diff for I18). |
| M6 | resources note | `curso desplegado; V3 S17 cierre CP-N2-A` | `Sección 17 del curso en vivo` or remove note. |
| M7 | We Do / You Do starters | `# DEFECT: …` · `corrige el DEFECT del starter` | Soften to `# Bug a corregir:` / “corrige el bug del starter” (keep pedagogy). |
| M8 | Icon (soft meta) | `icon: "Package"` | Prefer `GitMerge`, `Table`, `Layers`, or similar if available in icon set. |

**Not counted as leak (intentional pedagogy):** fixture labels `CASO-LIM-017`, subtopic ids `S17-T1-A`, demoIds — course-native navigation ids.  
**Borderline:** `CP-N2-A` appears often; if the UI shows capstone codes, retain; else gloss once (“cierre del portfolio nivel 2A”).

**meta_leak_count (for sidecar):** **8** (M1–M8).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

- **Gradual release (I Do / We Do / You Do):** demonstration → guided practice with fading support → independent transfer. S17 implements the *slots* correctly but under-implements fading support (hints/feedback).  
- **Worked-example effect / cognitive load:** theory examples are short worked examples (good), but packing rolling+cohorts+leakage into the same capstone week risks overload without an intermediate integration task.  
- **Pandas teaching norms (official merging guide):** teach `how`, key uniqueness/`validate`, and indicator-based anti-joins as first-class — S17 does this well, better than many intro courses.  
- **Responsible analytics:** reconciliation + temporal leakage before executive claims — S17’s T4 is a differentiator vs Kaggle “groupby and plot”.

### 5.2 Meta-text / developer leakage

See §4. Pattern matches S15/S16/S18 “De {legacy} a {V3 topic} (mapa)” template. Fix pattern should be **shared** across mid-course rethemes, not one-off.

### 5.3 Grammatical correctness & redaction (Peruvian Spanish)

- Critical EN fragment: **`supposed`** (I06).  
- Anglicisms acceptable when domain-standard (`merge`, `groupby`) vs avoidable (`nice-to-have`, bare `bridge table` without gloss).  
- Headings should be sentence-case Spanish: “Claves y cardinalidad en joins”.  
- Overall body Spanish is competent, technical, and consistent with Lima/Cusco/Arequipa voice.  
- Theory T1-A and T4-B **number/story bugs** are redaction failures with factual weight (I09, I10).

### 5.4 Connective tissue & narrative flow

**Present:**

- Explicit T1→T4 order.  
- References to dtype normalization from S16 before merge.  
- Portfolio thread: clientes + transacciones sintéticas → evidencia ejecutiva.

**Missing vs early gold standard:**

- Opening dictionary (cardinalidad, fan-out, anti-join, long/wide, cohorte, cutoff, leakage, reconciliación).  
- Emotional/job narrative longer than one compressed sentence (S01 style).  
- Micro-transitions “antes de agregar, asegura cardinalidad…” between blocks (partially present in callouts, weak between T2 and T3).  
- Explicit handoff to S18 on incertidumbre / hallazgo vs hipótesis.

### 5.5 Pedagogical structure (I/We/You fidelity)

| Phase | Fidelity | Notes |
| --- | --- | --- |
| I Do | Medium-high | 8 aligned demos; `why` one-liners are correct but thin (rarely expose misconception). |
| We Do | Medium | E1/E2/E3 taxonomy exists; E3 often not true transfer; feedback non-formative. |
| You Do | Medium | Good integration goals; starter skeleton OK; rubric generic; no acceptance tests listed for `portfolio_summary`. |
| Autocheck | Medium-high | 5 solid concept questions; incomplete LO coverage. |

Defect-driven starters are a **strength** of the We Do design (productive failure) if reworded and if pass contracts ignore stray `ok` lines.

### 5.6 Cognitive load & progressive disclosure

- **Good progressive disclosure:** join mechanics before reshape before agg before temporal leakage.  
- **Compression risk:** T3-B (rolling + cohorts) could be a lighter “preview” with full depth in S18/S32, or earn a mini-lab.  
- **Extraneous load:** retheme map, `s17_th_*` wrappers, dual language (ES prose + EN API) without glossary.  
- **Intrinsic load:** appropriate for Competente **if** hours and scaffolding match; currently scaffolding is light for 18h density.

### 5.7 Exercise & exam quality / alignment

**Alignment matrix (summary):**

| Subtopic | LO | Theory | I Do | E1/E2/E3 | Quiz |
| --- | --- | --- | --- | --- | --- |
| T1-A keys/card | ✓ | ✓ | ✓ | ✓ | partial (via validate Q) |
| T1-B validate/anti | ✓ | ✓ | ✓ | ✓ | ✓ |
| T2-A melt/pivot/concat | ✓ | ✓ | ✓ | ✓ | ✗ |
| T2-B stable names | ✓ | ✓ | ✓ | ✓ | ✗ |
| T3-A groupby/agg/transform | ✓ | ✓ | ✓ | ✓ | ✓ transform |
| T3-B windows/cohorts | ✓ | ✓ | ✓ | ✓ | ✗ |
| T4-A totals/denoms | ✓ | ✓ | ✓ | ✓ | ✓ |
| T4-B leakage | ✓ | ✓ | ✓ | ✓ | ✓ |

**Risks:**

- Exact-string pass criteria for dicts (groupby key order) — partially mitigated by sort defaults / notes.  
- No multi-step We Do that joins → groupby → reconcile → cutoff in one exercise before You Do.  
- You Do `portfolio_summary` raises `NotImplementedError` without specifying required dict keys (students guess contract).

### 5.8 Roadmap consistency

- **Correct:** Packaging/CLI lives in S10; S17 is joins/groupby; S18 starts CP-N2-B EDA.  
- **Friction:** Platform id `packaging` and icon Package conflict with title (documented in meta, still student-visible in URL hash `#packaging`).  
- Synthetic regions/ids consistent with S15–S16.  
- Leakage theme anticipates S32 feature pipelines — good long-range edge.

### 5.9 Comparison with best-in-class external materials

| Source | S17 vs external |
| --- | --- |
| [pandas user guide — merge/join/concat](https://pandas.pydata.org/docs/user_guide/merging.html) | S17 correctly elevates `validate` and `indicator` (anti-join) as quality gates; docs show same APIs with richer diagrams. S17 should link **user guide merging** not only API `DataFrame.merge`. |
| Kaggle / generic pandas drills | S17 is **stronger** on fan-out, reconciliation, leakage; **weaker** on narrative continuous dataset and visual intuition. |
| McKinney *Python for Data Analysis* (listed in books) | Book offers longer wrangling narrative; S17 is more “contract/gate” oriented — good differentiation if connected with a single end-to-end fixture story. |
| CS50P / MIT 6.100L (listed courses) | Poor topical fit for S17; prefer pandas-focused or data-cleaning courses. |

### 5.10 Other domain issues

- Privacy: excellent (synthetic only).  
- Motivation: jobRelevance is on-theme but meta-polluted.  
- Accessibility: no alt descriptions needed in TS; code outputs use plain text (good).  
- Exception hygiene regression in I Do bare `except Exception` (I21).

---

## 6. Proposed GitHub-style Diffs

> Paths relative to repo root. **Do not apply in Explorer run** — for Fixer only.  
> Diffs are surgical; combine related ones in one PR if desired.

### Diff A — Strip meta from jobRelevance (I01 / M1)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
- jobRelevance:
- "Cerrar un **portfolio de data quality + EDA** en banca, fintech o retail en Perú exige joins con cardinalidad documentada, reshape long/wide estable, groupby con contratos de agregación y reconciliación de totales sin leakage temporal. Esta sección (id `packaging` conservado) retematiza a V3 y **cierra CP-N2-A** con evidencias reproducibles y memo de límites — sin PII real ni claims causales no soportados.",
+ jobRelevance:
+ "Cerrar un **portfolio de data quality + EDA** en banca, fintech o retail en Perú exige joins con cardinalidad documentada, reshape long/wide estable, groupby con contratos de agregación y reconciliación de totales sin leakage temporal. Aquí cierras el portfolio de calidad + EDA del nivel: evidencias reproducibles, memo de límites y **sin PII real ni claims causales** no soportados.",
```

### Diff B — Learner-facing map + callout (I02 / M2–M4)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
- heading: "De “Packaging y CLI” a joins/groupby y cierre CP-N2-A (mapa)",
+ heading: "Mapa de la sección: joins → forma → agregación → reconciliación",
  paragraphs: [
- "En V3, **S17 no es el path de pyproject.toml ni PyPI**. El id de plataforma `packaging` se conserva, pero el camino del estudiante es el **cierre de CP-N2-A**: unir tablas sintéticas de clientes y transacciones, reshapes long/wide, agregaciones con groupby y un memo de reconciliación sin leakage temporal.",
+ "En esta sección **cierras el portfolio de calidad + EDA**: unes tablas sintéticas de clientes y transacciones, reshapes long/wide, agregas con groupby y redactas un memo de reconciliación **sin leakage temporal**. El empaquetado de módulos/CLI ya se trabajó en la sección de módulos y CLI; aquí el “paquete” es la evidencia analítica reproducible.",
  "El hilo conductor es un **portfolio ejecutivo de data quality + EDA** con regiones ficticias (Lima, Cusco, Arequipa), `cliente_id` tipo `C00x` y montos en PEN sintéticos. Entregable: dataset limpio + script reproducible + respuestas de negocio con evidencia + memo de límites y no-claims. Nunca PII real.",
  "Orden pedagógico: **T1 Joins** (claves, cardinalidad, validate, anti-join) → **T2 Forma** (concat, melt, pivot, nombres estables) → **T3 Agregación** (groupby/agg/transform, ventanas y cohortes) → **T4 Reconciliación** (totales, denominadores, cutoff anti-leakage). Solo APIs de pandas ya vistas en S15–S16 más merge/groupby de esta sección.",
  ],
  callout: {
- type: "info",
- title: "Contenido reubicado conceptualmente",
- content:
- "Material legado de packaging/CLI **no es el camino V3 en S17**. Target: joins/groupby y cierre CP-N2-A.",
+ type: "info",
+ title: "Qué empaquetas aquí",
+ content:
+ "No publicas un paquete en PyPI: empaquetas un **dataset limpio, un script reproducible y un memo de límites** para un stakeholder. Joins y groupby son el camino.",
  },
```

### Diff C — Fix English callout + anglicism (I06, I07)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
- "Si len(out) >> len(left) en un supposed 1:1, hay fan-out.",
+ "Si len(out) >> len(left) en un supuesto 1:1, hay fan-out.",
@@
- "El parámetro `validate='one_to_one'|'one_to_many'|...` hace que pandas **falle temprano** con `MergeError` si la cardinalidad real no coincide con el contrato. Es un quality gate de join, no un nice-to-have: un m:m accidental multiplica filas y sesga sumas de montos.",
+ "El parámetro `validate='one_to_one'|'one_to_many'|...` hace que pandas **falle temprano** con `MergeError` si la cardinalidad real no coincide con el contrato. Es un quality gate de join, no un lujo opcional: un m:m accidental multiplica filas y sesga sumas de montos.",
```

### Diff D — Capitalize theory headings (I08)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
- heading: "claves y cardinalidad en joins",
+ heading: "Claves y cardinalidad en joins",
@@
- heading: "validate, duplicación accidental y anti-join",
+ heading: "Validate, duplicación accidental y anti-join",
@@
- heading: "concat, melt y pivot",
+ heading: "Concat, melt y pivot",
@@
- heading: "long/wide y nombres estables",
+ heading: "Long/wide y nombres estables",
@@
- heading: "groupby / agg / transform",
+ heading: "Groupby / agg / transform",
@@
- heading: "ventanas, fechas y cohortes",
+ heading: "Ventanas, fechas y cohortes",
@@
- heading: "denominadores y totales",
+ heading: "Denominadores y totales",
@@
- heading: "leakage temporal y controles antes/después",
+ heading: "Leakage temporal y controles antes/después",
```

### Diff E — Fix T1-A fixture narrative (I09)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
- "Caso sintético Perú: `cli` (C001 Lima, C002 Cusco) left-merge con `tx` (dos filas C001, ninguna C003). Salida esperada: C001 se duplica por monto; C002 queda con NaN en columnas de tx. Documenta `rows_cli → rows_merge` en el portfolio.",
+ "Caso sintético Perú: `cli` (C001 Lima, C002 Cusco) left-merge con `tx` (dos filas C001 y una C003 huérfana de maestro). Salida esperada: C001 se duplica por monto; C002 queda con NaN en columnas de tx; C003 no entra al left-merge. Documenta `rows_cli → rows_merge` en el portfolio.",
```

### Diff F — Align T4-B theory prose with theory code (I10)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
- "Caso: C001 con tx 10 PEN en ene y 999 en mar; cutoff 2024-01-31 → feature segura 10, leaky 1009, delta de leakage 999. El cierre CP-N2-A debe demostrar al menos un control as-of de este tipo en el script reproducible.",
+ "Caso (mismo fixture del código): C001 con montos 10 y 5 en enero y 100 en febrero; cutoff 2024-01-31 → total con leakage 115, pre-cutoff 15, delta de leakage 100. El cierre del portfolio debe demostrar al menos un control as-of de este tipo en el script reproducible.",
```

*Alternative:* change theory code/output to 10+999=1009 to match I Do demo — pick one source of truth.

### Diff G — You Do rubric + remove V3 meta (I03, I18, M5)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
  rubric: [
- { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
- { criterion: "Correctitud técnica en entorno declarado", weight: "20%" },
- { criterion: "Privacidad / sin PII real / sin secretos", weight: "20%" },
- { criterion: "Pruebas o casos de borde documentados", weight: "15%" },
- { criterion: "Código legible y límites claros", weight: "10%" },
- { criterion: "Documentación en español profesional", weight: "10%" }
+ { criterion: "Joins con cardinalidad documentada (filas pre/post, validate o anti-join de huérfanos)", weight: "20%" },
+ { criterion: "Reshape o schema estable long/wide con columnas expected validadas", weight: "15%" },
+ { criterion: "Groupby/agg/transform alineado a la pregunta de negocio (suma vs media)", weight: "15%" },
+ { criterion: "Reconciliación de totales/denominadores con diff o residual documentado", weight: "15%" },
+ { criterion: "Control de leakage temporal (cutoff/as-of) con delta explícito", weight: "15%" },
+ { criterion: "Privacidad: solo sintéticos, sin PII real ni secretos", weight: "10%" },
+ { criterion: "Script reproducible (`if __name__`) + memo de límites/no-claims en español profesional", weight: "10%" }
  ],
```

### Diff H — Resource note + course links (I04, I22, M6)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
  {
  label: "PyArcana live",
  url: "https://pillb.github.io/pyarcana/",
- note: "curso desplegado; V3 S17 cierre CP-N2-A",
+ note: "curso en vivo — sección Joins · groupby · cierre",
  },
```

Recommended resource additions (Fixer may insert):

```ts
{
  label: "pandas user guide — Merge, join, concatenate",
  url: "https://pandas.pydata.org/docs/user_guide/merging.html",
  note: "how, validate, indicator, anti-patrones de fan-out",
},
```

Prefer de-emphasizing CS50P/MIT as primary for this section (keep as optional fundamentals elsewhere).

### Diff I — Formative feedback samples (I13) — pattern for all 24

Apply per exercise; example for `S17-T1-A-E1`:

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@
- feedback: "Compara tu salida con la solución.",
+ feedback: "Si imprimiste 1, usaste inner y perdiste C002. Left join conserva el maestro de clientes aunque no tengan transacciones.",
```

Example `S17-T4-B-E1`:

```diff
- feedback: "Compara tu salida con la solución.",
+ feedback: "Si viste [9.0], filtraste fecha > cutoff (post-periodo). El control as-of usa fecha <= cutoff.",
```

### Diff J — Richer hints sample (I14) — pattern

```diff
  hints: [
- "merge how='left'.",
- "Cuenta filas.",
+ "Usa cli.merge(tx, on='cliente_id', how='left') para conservar clientes sin tx.",
+ "Imprime solo len(...) del resultado; el pass esperado es 2.",
  ],
```

### Diff K — Strip starter noise `print('ok', True)` (I16) — pattern for all We Do starters

```diff
- print(len(cli.merge(tx, on="cliente_id", how="inner")))
- print('ok', True)
+ print(len(cli.merge(tx, on="cliente_id", how="inner")))
```

### Diff L — Soften DEFECT wording (I17 / M7) — pattern

```diff
- # DEFECT: inner merge acorta filas
+ # Bug a corregir: inner merge acorta filas (pierde clientes sin tx)
```

```diff
- # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
+ # Contrato: implementa la función (no dejes NotImplemented)
```

### Diff M — I Do exception specificity (I21)

```diff
-    try:
-     cli.merge(tx, on="cliente_id", validate="one_to_one")
-    except Exception:
-     print("validate_caught_fanout", True)
+    try:
+     cli.merge(tx, on="cliente_id", validate="one_to_one")
+    except pd.errors.MergeError:
+     print("validate_caught_fanout", True)
```

### Diff N — You Do contract docstring (I15/I18 support)

```diff
 def portfolio_summary(clientes: pd.DataFrame, tx: pd.DataFrame, cutoff: str) -> dict:
- """Joins, métricas, reconciliación y agregados pre-cutoff."""
+ """Devuelve dict con al menos:
+ rows_merge, n_huerfanos_left_only, total_monto, total_pre_cutoff,
+ leakage_delta, reconciled (bool). Solo usa tx con fecha <= cutoff en métricas 'pre'.
+ """
```

### Diff O — Optional glossary paragraph after map (I11, I23)

Insert new theory block or first paragraph addition:

```ts
{
  heading: "Diccionario rápido de la sección",
  paragraphs: [
    "**Cardinalidad:** cuántas filas del lado derecho (o izquierdo) corresponden a cada clave (1:1, 1:m, m:m). **Fan-out:** explosión de filas por claves duplicadas. **Anti-join:** filas de un lado sin match (`left_only` / `right_only`). **Long/wide:** forma apilada por periodo vs una columna por periodo. **Cohorte:** periodo de la primera observación válida. **Cutoff / as-of:** solo datos conocidos hasta la fecha t. **Leakage temporal:** usar post-cutoff como si fuera pasado. **Reconciliación:** suma de partes ≈ total (tolerancia eps) o residual documentado.",
  ],
},
```

### Diff P — Icon (I05 / M8) if icon set allows

```diff
- icon: "Package",
+ icon: "GitMerge",
```

(Verify icon exists in the app’s icon map before applying.)

### Diff Q — selfCheck add one reshape item (I24) — optional replace or extend if schema allows only 5

If limited to 5, replace weakest distractor set or rotate; suggested Q:

```ts
{
  question: "Tras un pivot a wide para un dashboard, el portfolio debería:",
  options: [
    "Validar set de columnas esperado (p. ej. monto_ene, monto_feb)",
    "Dejar MultiIndex sin documentar",
    "Renombrar columnas solo en el slide de PowerPoint",
    "Usar mean por defecto en pivot_table sin declararlo",
  ],
  correctIndex: 0,
  explanation:
    "Un schema estable (set de columnas expected) evita roturas del dashboard; aggfunc y nombres se documentan en el memo.",
},
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Why first |
| --- | --- | --- |
| 1 | I09, I10 | Factual theory↔code contradictions (trust + correctness). |
| 2 | I01, I02, M1–M4 | Meta-leak at section entry (first screen students read). |
| 3 | I06, I07, I08 | Cheap redaction wins (ES-PE polish). |
| 4 | I03, I18, Diff G/N | Rubric + You Do contract make portfolio assessable. |
| 5 | I13, I14, I16, I17 | Formative We Do quality (scale with templates). |
| 6 | I21, I15 | Demo exception hygiene + upgrade true transfer tasks. |
| 7 | I11, I12, Diff O | Glossary + S18 bridge (connective tissue). |
| 8 | I05, I22, I24, I19, I20, I25 | Icon, resources, quiz gap, load wrappers, formatting. |

**Suggested Fixer batches:**

1. **Batch A (P0/P1 content truth + meta):** Diffs E, F, A, B, C, D  
2. **Batch B (assessment):** Diffs G, N, I, J, K, L  
3. **Batch C (polish):** Diffs M, H, O, P, Q  

---

## 8. Graph Memory Update notes

For shared curriculum graph / later Explorer-Fixer loops:

```yaml
section: 17
id: packaging
title: Joins, reshape, groupby y cierre analítico
file: src/lib/course/sections/s17-packaging.ts
score_1_to_10: 6.7
status_explorer: complete

nodes:
  - S17-map (meta-heavy; retheme template shared with S15/S16/S18)
  - S17-T1-A keys/cardinality
  - S17-T1-B validate/anti-join
  - S17-T2-A melt/pivot/concat
  - S17-T2-B stable schema names
  - S17-T3-A groupby agg transform
  - S17-T3-B rolling cohorts
  - S17-T4-A reconcile denominators
  - S17-T4-B temporal leakage cutoff
  - S17-youdo CP-N2-A portfolio
  - S17-selfcheck (5)

edges_quality:
  - S15_ingest --> S17_joins (dataset)
  - S16_quality --> S17_joins (dtype/keys clean)
  - S17_portfolio --> S18_eda (handoff weak; strengthen)
  - S17_leakage --> S32_features (long-range preview)
  - S10_packaging_cli -x- S17 (content ownership: not here; id collision only)

open_fix_themes:
  - "V3 retheme map callout" pattern mid-course
  - boilerplate feedback "Compara tu salida con la solución."
  - starter print('ok', True) pattern
  - generic youDo rubric "gate V3"
  - legacy platform ids in jobRelevance

do_not_regress:
  - validate + indicator anti-join emphasis
  - row count pre/post discipline
  - reconciliation + leakage in same section
  - synthetic PE context without PII
  - 8×3 We Do coverage grid

fixer_entrypoints:
  - theory[0] map/callout
  - theory T1-A narrative; T4-B narrative
  - callout T1-A "supposed"
  - youDo.rubric
  - weDo.*.feedback / hints / starter ok lines
```

**Comparative baseline note:** Against S01, S17 lacks diccionario + workplace story depth. Against external pandas merging docs, S17’s gate culture is a product strength. Against S15/S16, meta-leak pattern is **shared systemic**, not unique regression.

---

This is the complete Explorer report for Section 17. Ready for the Fixer prompt.
