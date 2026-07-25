# Curriculum Auditor — Section 17 Report

**Section 17**: `Joins, reshape, groupby y cierre analítico` (`s17-packaging.ts`, `id: "packaging"`)
**Auditor**: Curriculum Auditor (general-purpose subagent S17)
**Method**: Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering, with the shared `_GRAMMAR_SUBPLAN.md` research pipeline (Fernández-Huerta 1959, Szigriszt-Pazos/INFLESZ, WPS/SPW, 13 pedagogical heuristics, LanguageTool `es` API).

---

## 1. Section Identification & Scope

### Source-of-truth confirmation

| Field | Value |
|---|---|
| File | `src/lib/course/sections/s17-packaging.ts` (1,564 lines) |
| `id` | `"packaging"` (legacy mismatch — see M-01) |
| `index` | `17` |
| `title` | `"Joins, reshape, groupby y cierre analítico"` |
| `shortTitle` | `"Joins · groupby · cierre"` |
| `tagline` | `"Executive Data Quality & EDA Portfolio con dataset limpio, notebook/script reproducible, reconciliación y preguntas de negocio"` |
| `phase` | `1` (Competente) — sections 14–26 |
| `estimatedHours` | `18` |
| `level` | `"Competente"` |
| Predecessor in roadmap | S16 (`Calidad y contratos`) |
| Successor in roadmap | S18 (`EDA e incertidumbre`) |
| Routing hash (live) | `https://pillb.github.io/pyarcana/#packaging` |

The section is the **17th** entry in `COURSE_SECTIONS` (`src/lib/course/index.ts` line 73: `section14, section15, section16, section17, section18, section19, ...`). Confirmed by reading `index.ts` and by clicking the live rail card "17 Joins · groupby · cierre" in the rendered SPA.

### Scope audited

All five tabs rendered for the learner, plus the supporting source fields:

- **Teoría** (Theory tab): 8 subtopic blocks (`S17-T1-A` Claves y cardinalidad, `S17-T1-B` Validate/anti-join, `S17-T2-A` Concat/melt/pivot, `S17-T2-B` Long/wide y nombres estables, `S17-T3-A` Groupby/agg/transform, `S17-T3-B` Ventanas/fechas/cohortes, `S17-T4-A` Denominadores y totales, `S17-T4-B` Leakage temporal) + meta callouts (mapa, diccionario).
- **Yo hago** (I Do tab): 8 demos (`S17-T1-A-DEMO` … `S17-T4-B-DEMO`), each with `description`, `code`, `output`, `why`.
- **Hacemos juntos** (We Do tab): 24 exercises (`S17-T1-A-E1` … `S17-T4-B-E3`), three per subtopic, decreasing-scaffold (guiado → independiente → transferencia). Each exercise has `instruction`, `hint`, `hints[]`, `edgeCases[]`, `tests`, `feedback`, `starterCode`, `solutionCode` (with `output`).
- **Tú haces** (You Do tab): capstone `portfolio_summary(clientes, tx, cutoff) -> dict` with `context`, `objectives[]`, `requirements[]`, `starterCode`, `portfolioNote`, `rubric[]` (7 criteria, weights sum 100%).
- **Autocheck** (Self-check tab): 5 MCQs with `question`, `options[]`, `correctIndex`, `explanation`.
- **Recursos**: 7 doc links, 2 books, 6 courses.

### Live-page verification

Visited `https://pillb.github.io/pyarcana/#packaging` with `agent-browser`. Confirmed:
- H1 heading renders `# Joins, reshape, groupby y cierre analítico`.
- 5 tab list (`Teoría / Yo hago / Hacemos juntos / Tú haces / Autocheck`) present.
- 8 theory headings match source byte-for-byte.
- 24 We Do exercises render in order with hints, starter code, feedback.
- You Do capstone `portfolio_summary` renders with rubric.
- 5 MCQs render.
- **Critical**: The "Pruébalo tú mismo" interactive playground on the Theory tab loads code titled `Practica semver y dependencias` (`parse_semver`, `bump_version`, `is_backward_compatible`) — completely off-topic from pandas joins/groupby (see M-02).
- **Critical**: Markdown markers in `callout.content` render as literal `**asterisks**` and backticks (see M-03).

### Method note (grammar dimension)

Pipeline (artifacts in `/home/z/my-project/audits/tmp_s17/`):

1. `extract.py` → `records.json` (566 learner-facing string records with line numbers and parent key).
2. `metrics.py` → `metrics.json` (Fernández-Huerta, INFLESZ, WPS, SPW per paragraph and per sentence, plus 13 pedagogical heuristics: run-on >45 / long >32, missing terminal, inverted marks, unbalanced delimiters, repeated word, English-dominant, meta-leak, gerund pile-up, comma density, paragraph = one long sentence, anaphoric monotony, space-before-punct, double-space).
3. `lt.py` → `lt.json` (LanguageTool public `es` API, 1 chunk of ~18k chars, throttled 4 s between chunks; 1,355 raw matches, 927 MORFOLOGIK spelling false positives on Python/tech terms, 428 non-spelling).

Spanish syllable counter is a heuristic vowel-cluster dipthong/hiatus estimator (validated against `totales`, `pipe`, `función`, `país`, `huérfanos` → 3/1/2/1/3 syllables). Sentence splitter is Spanish-aware (handles `¿¡`, light abbreviation protection).

---

## 2. Executive Summary of Quality

**Composite score: 6.5 / 10.**

**Verdict**: Pedagogically excellent (full I Do / We Do / You Do / selfCheck fidelity, decreasing-scaffold contract-driven exercises, strong Peruvian context, correct forward pointer to S18). **But the section is materially undermined by three classes of defect that surface on the live page**:

1. **Identity meta-leak (P0)** — the legacy `id: "packaging"` and filename `s17-packaging.ts` contradict the section's actual content (pandas joins/groupby/reshaping) and route the live URL `#packaging` to an interactive playground that loads **off-topic Semantic-Versioning Python code** (`parse_semver`, `bump_version`, `is_backward_compatible`) in the "Pruébalo tú mismo" panel. Same systemic pattern as S06 (`id:"numpy"` loading NumPy editor into a NumPy-forbidden section) and S13 (`id:"rpa-automation"` loading RPA editor into a Familiarity Evidence Dashboard section).
2. **Markdown leak (P0)** — 8 prose fields (`callout.content`, `step.why`, `step.instruction`, `step.hint`, `step.feedback`, `project.context`, `project.portfolioNote`, `rubric.criterion`) are rendered as raw JSX children without `<RichText>` in `SectionView.tsx`, so `**bold**` markers and backticks appear as literal characters on the live page (4 of 5 tabs affected).
3. **Code/output integrity drift (P0)** — 7 separate code/output/prose contradictions in T3-A and T4-A demos and exercises, where the input DataFrame, the printed Python output, the expected output, and the Spanish prose all disagree on region names and aggregation results. These are not pedagogical "bugs to fix" — they are **fabricated expected outputs that contradict the code**, and learners running the code will see different output than the page claims.

**Grammar aggregate** (469 sentences, 296 prose paragraphs):

| Metric | Sentence | Paragraph |
|---|---|---|
| Fernández-Huerta mean | 73.05 (normal / bastante fácil) | — |
| Fernández-Huerta median | 71.20 | — |
| INFLESZ mean | 68.67 | — |
| SPW mean | 2.01 | — |
| WPS mean | — | 12.31 |
| Run-on sentences >45 w | 7 (real prose) | — |
| Single-sentence paragraphs | 15 (mostly callouts) | — |

FH distribution by sentence: `muy_fácil` 109 / `fácil` 76 / `bastante_fácil` 76 / `normal` 70 / `bastante_difícil` 67 / `difícil` 49 / `muy_difícil` 22 (the `muy_difícil` band is mostly short headings and code-adjacent fragments, not real prose).

**Real Spanish grammar/style findings** (after filtering false positives):

- 8 occurrences of `vs` without period → `vs.` (P1)
- Anglicism drift `bridge` ↔ `tabla puente` (3 occurrences of `la bridge` as a noun, 3 occurrences of `tabla puente` as Spanish; the section defines both terms but then uses them inconsistently) (P2)
- 7 run-on sentences >45 words in theory prose (P2)
- 2 concordance issues flagged by LT (`el checklist`, `pandas local` → `pandas locales`) — borderline (P3)
- 1 missing `¿` in `edgeCases[]` item "orden importa en set? no" → "¿orden importa en set? No" (P3)
- Hints that start with lowercase code snippets and read as Spanish sentences (12 cases) — pedagogically acceptable, but capitalization would help readers (P3)

**No high-confidence developer meta-text leaks** in user-facing prose. The `TODO` matches flagged by the heuristic at L1383 (`context`) and L31 (`paragraphs[]`) are false positives — they match the legitimate Spanish word "todo" (meaning "all") in "todo el universo de tx" and "integra todo en un solo script".

---

## 3. Detailed Issue Registry

Issues are grouped by category. Severities: **C** Critical (breaks the learning experience), **H** High (substantive defect visible on the live page), **M** Medium (real grammar/style defect), **L** Low (style polish).

### 3.1 Identity / Meta-leak (3 issues)

#### M-01 · C · Section id/filename contradict content; URL surfaces "packaging" for a pandas joins section

- **Evidence**: `src/lib/course/index.ts:19` imports `section17` from `'./sections/s17-packaging'`. The section object's `id: "packaging"` (source line 4). The live URL is `https://pillb.github.io/pyarcana/#packaging`. The section `title: "Joins, reshape, groupby y cierre analítico"` (line 6) and `tagline` mention joins/groupby/EDA — **no packaging/CLI content**.
- **Pedagogical impact**: The callout at line 38 explicitly tells the learner *"No publicas un paquete en PyPI: empaquetas un dataset limpio…"*. But the URL hash and the section id both broadcast "packaging" to the learner, creating an identity mismatch the curriculum tries to talk its way out of.
- **Root cause**: V3 retarget (same pattern as S06 `id:"numpy"`, S09 `id:"visualization"`, S10 `id:"sklearn"`, S13 `id:"rpa-automation"`). When the section was repurposed from "packaging" to "joins/groupby/cierre", the routing `id` was not migrated.

#### M-02 · C · Interactive playground loads off-topic Semantic-Versioning code

- **Evidence**: `src/components/course/SectionView.tsx:4046` does `const demo = demos[sectionId]`. The `demos` dictionary at line 1578 maps `'packaging'` to:
  ```
  title: 'Practica semver y dependencias',
  code: `# Practica Semantic Versioning y gestion de dependencias
  import re
  def parse_semver(version_str):
      """Parsea una version semver: MAJOR.MINOR.PATCH."""
      match = re.match(r"^(\\d+)\\.(\\d+)\\.(\\d+)", version_str)
      ...
  def bump_version(version_str, bump_type):
      ...
  def is_backward_compatible(old, new):
      ...
  print(f"Version actual: {version}")
  print(f"  patch bump:  {bump_version(version, 'patch')}")
  ...`,
  expectedOutput: `Version actual: 1.4.2
    patch bump:  1.4.3
    minor bump:  1.5.0
    major bump:  2.0.0
  1.4.2 -> 1.5.0 compatible: True
  1.4.2 -> 2.0.0 compatible: False`,
  hint: 'Implementa una funcion que determine si un bump es breaking change',
  ```
  This is the code shown on the live S17 Theory tab in the "Pruébalo tú mismo" panel. Verified by `agent-browser` snapshot: `data-testid="demo-run-packaging"` button contains the full semver code and output.
- **Pedagogical impact**: A learner opening Section 17 to study pandas `merge`/`groupby`/`pivot` instead sees a Python script about regex-based Semantic Versioning parsing — a topic that has nothing to do with the section's learning outcomes. The "Practica semver y dependencias" title and the `parse_semver`/`bump_version`/`is_backward_compatible` code actively contradict the section's own opening callout: *"No publicas un paquete en PyPI: empaquetas un dataset limpio…"*.
- **Root cause**: `demos` dictionary in `SectionView.tsx` was never updated when the section was retargeted.

#### M-03 · H · Markdown leak: 8 prose fields render raw without `<RichText>`

- **Evidence** (`src/components/course/SectionView.tsx`):
  - Line 189: `<p>{section.jobRelevance}</p>` (raw)
  - Line 401: `{block.callout.content}` inside `<Callout>` (raw)
  - Line 453: `<p>{step.why}</p>` (raw, I Do steps)
  - Line 491: `<span>{step.instruction}</span>` (raw, We Do steps)
  - Line 503: `{step.hint}` (raw, We Do steps)
  - Line 571: `{step.feedback}` (raw, We Do steps)
  - Line 614: `<p>{project.context}</p>` (raw, You Do)
  - Line 649: `{project.portfolioNote}` (raw, You Do)
  - Line 665: `<td>{r.criterion}</td>` (raw, Rubric)

  Verified on the live page: the Theory-tab callout at L37 (`"No publicas un paquete en PyPI: empaquetas un **dataset limpio, un script reproducible y un memo de límites** para un stakeholder."`) renders with literal `**dataset limpio, un script reproducible y un memo de límites**` visible to the learner. Same for backticks in We Do instructions: `Fixture \`FIX-S17-T1A-E1\`: cli={C001,C002}, tx={C001:1.0}. Haz \`merge\` por \`cliente_id\` con \`how='left'\`…` — the backticks show as literal characters.
- **Pedagogical impact**: 4 of 5 learner-facing tabs (Teoría callouts, Yo hago `why`, Hacemos juntos `instruction`/`hint`/`feedback`, Tú haces `context`/`portfolioNote`, Rubric) show `**bold**` and `` `code` `` markdown syntax as literal text. The intent — typographic emphasis and inline code formatting — is broken.
- **Root cause**: Same defect as S06 (where it was reported as P0). The fix is to route these 8 fields through `<RichText content={...} sectionId={section.id} />` like `intro` (line 426, 476) is already routed.

### 3.2 Code / Output Integrity (7 issues — Critical)

These are not "bugs to fix in the code" — these are **fabricated `output` strings** in the source that contradict what the Python code actually produces when run. A learner who copies the demo code into a REPL will see different output than the page claims, and a learner who reads the prose+code+output as a unit will be unable to reconcile the three.

#### C-01 · C · Theory T3-A demo `groupby_agg.py` — fabricated output

- **File**: `s17-packaging.ts:206-221`
- **Code** (input DataFrame):
  ```python
  df = pd.DataFrame({
      "region": ["Sucursal-Sur", "Sucursal-Centro", "Oficina-Este"],
      "monto": [10.0, 20.0, 5.0],
  })
  agg = df.groupby("region", as_index=False).agg(monto_sum=("monto", "sum"), n=("monto", "size"))
  df2 = df.copy()
  df2["monto_region_mean"] = df2.groupby("region")["monto"].transform("mean")
  print(agg.to_dict(orient="list"))
  print(df2["monto_region_mean"].tolist())
  ```
- **Source-claimed `output`** (line 220-221):
  ```
  {'region': ['Oficina-Oeste', 'Cliente-A'], 'monto_sum': [5.0, 30.0], 'n': [1, 2]}
  [15.0, 15.0, 5.0]
  ```
- **Actual output** (3 distinct singleton regions, sorted alphabetically):
  ```
  {'region': ['Oficina-Este', 'Sucursal-Centro', 'Sucursal-Sur'], 'monto_sum': [5.0, 20.0, 10.0], 'n': [1, 1, 1]}
  [5.0, 20.0, 10.0]
  ```
- **Defects**: (a) only 2 groups in claimed output vs. 3 in actual; (b) region names in claimed output (`'Oficina-Oeste'`, `'Cliente-A'`) don't appear in the input DataFrame at all; (c) `monto_sum=30.0` for `Cliente-A` is impossible since no row has region `Cliente-A`; (d) the `transform('mean')` values `[15.0, 15.0, 5.0]` are impossible — for three distinct singleton groups the means are `[5.0, 20.0, 10.0]`.
- **Pedagogical impact**: The reader is shown fabricated region names and aggregation values that the code cannot produce. The lesson on `transform vs agg` collapses because the example output is mathematically inconsistent with the input.
- **Root cause**: Incomplete synthetic-data refresh — code was edited to use one set of fixture names (`Sucursal-Sur`, `Sucursal-Centro`, `Oficina-Este`) but the output string still reflects a prior fixture (`Oficina-Oeste`, `Cliente-A`).

#### C-02 · C · I Do T3-A demo `demo_groupby.py` — fabricated output

- **File**: `s17-packaging.ts:446-458`
- **Code**:
  ```python
  df = pd.DataFrame({
      "region": ["Cliente-B", "Sucursal-Norte", "Arequipa", "Arequipa"],
      "monto": [10.0, 30.0, 5.0, 15.0],
  })
  resumen = df.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
  df = df.assign(mean_reg=df.groupby("region")["monto"].transform("mean"))
  print(resumen.to_dict(orient="list"))
  print(df["mean_reg"].tolist())
  ```
- **Source-claimed `output`** (line 457-458):
  ```
  {'region': ['Sucursal-Sur', 'Sucursal-Centro'], 'total': [20.0, 40.0], 'n': [2, 2]}
  [20.0, 20.0, 10.0, 10.0]
  ```
- **Actual output** (3 groups: Arequipa, Cliente-B, Sucursal-Norte; sorted alphabetically):
  ```
  {'region': ['Arequipa', 'Cliente-B', 'Sucursal-Norte'], 'total': [20.0, 10.0, 30.0], 'n': [2, 1, 1]}
  [10.0, 30.0, 10.0, 10.0]
  ```
- **Defects**: (a) claimed output has 2 groups vs. actual 3; (b) claimed region names (`'Sucursal-Sur'`, `'Sucursal-Centro'`) don't appear in input; (c) claimed `total=[20.0, 40.0]` is impossible; (d) claimed `mean_reg` `[20.0, 20.0, 10.0, 10.0]` is wrong: `Cliente-B` row should have mean 10.0 (singleton), `Sucursal-Norte` should have mean 30.0 (singleton), `Arequipa` rows should have mean 10.0 each `(5+15)/2`.
- **Pedagogical impact**: Same as C-01 — the `agg vs transform` demo is broken because the expected output is fabricated and inconsistent with the input.

#### C-03 · C · We Do S17-T3-A-E1 — instruction/starter/solution/expected-output all reference different fixtures; expected output is mathematically impossible

- **File**: `s17-packaging.ts:962-991`
- **Instruction** (L965-966): "Fixture region Cliente-B×2 y Sucursal-Norte×1 con montos 1,2,3. Imprime `groupby('region')['monto'].sum().to_dict()`. Pass: `{'Sucursal-Sur': 3.0, 'Sucursal-Centro': 3.0}`"
- **starterCode** (L981): `df = pd.DataFrame({"region": ["Oficina-Oeste", "Cliente-A", "Cliente-B"], "monto": [1.0, 2.0, 3.0]})` + `df.groupby("region")["monto"].mean().to_dict()` (the bug: `mean` instead of `sum`)
- **solutionCode** (L988): `df = pd.DataFrame({"region": ["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"], "monto": [1.0, 2.0, 3.0]})` + `df.groupby("region")["monto"].sum().to_dict()`
- **Expected output** (L990): `{'Oficina-Este': 3.0, 'Oficina-Oeste': 3.0}`
- **Actual solutionCode output**: `{'Sucursal-Centro': 3.0, 'Sucursal-Norte': 1.0, 'Sucursal-Sur': 2.0}` (3 singleton regions, sums = 1, 2, 3 sorted alphabetically)
- **Defects**: Four-way drift — (1) instruction names fixture regions `Cliente-B/Sucursal-Norte`; (2) starterCode uses `Oficina-Oeste/Cliente-A/Cliente-B`; (3) solutionCode uses `Sucursal-Norte/Sucursal-Sur/Sucursal-Centro`; (4) expected output names `Oficina-Este/Oficina-Oeste` with both sums = 3.0 — but the solutionCode produces three singletons with sums 1.0, 2.0, 3.0.
- **Pedagogical impact**: The exercise's "Pass" assertion (`{'Sucursal-Sur': 3.0, 'Sucursal-Centro': 3.0}`) cannot be satisfied by any version of the code in the section. The auto-grader (which compares `solutionCode` output to `expected output`) will fail; the learner cannot win.

#### C-04 · C · We Do S17-T3-A-E2 — solutionCode fixture doesn't produce the expected transform output

- **File**: `s17-packaging.ts:994-1023`
- **Instruction** (L998): "Fixture Cliente-A 1.0/3.0 y Cliente-B 2.0. Imprime lista de `groupby('region')['monto'].transform('mean')`. Pass: `[2.0, 2.0, 2.0]`."
- **starterCode** (L1013): 3 distinct regions `Sucursal-Norte/Sucursal-Sur/Sucursal-Centro` with montos `1.0/3.0/2.0` + `.sum().tolist()` (bug: sum instead of transform mean)
- **solutionCode** (L1020): 3 distinct regions `Oficina-Este/Oficina-Oeste/Cliente-A` with montos `1.0/3.0/2.0` + `.transform("mean").tolist()`
- **Expected output**: `[2.0, 2.0, 2.0]`
- **Actual solutionCode output**: `[1.0, 3.0, 2.0]` (3 distinct singleton regions, each mean = its own value)
- **Defects**: To get `[2.0, 2.0, 2.0]` from `transform('mean')` you need a fixture where Cliente-A has 2 rows with montos 1.0 and 3.0 (mean 2.0) and Cliente-B has 1 row with monto 2.0. The instruction describes this fixture, but the solutionCode uses 3 distinct singleton regions — yielding `[1.0, 3.0, 2.0]`.
- **Pedagogical impact**: The exercise's stated contract (`Pass: [2.0, 2.0, 2.0]`) is unsatisfiable with the provided solutionCode. The auto-grader will fail.

#### C-05 · M · We Do S17-T3-A-E3 — instruction names regions differently from solutionCode

- **File**: `s17-packaging.ts:1026-1057`
- **Instruction** (L1030): "Fixture region Cliente-B/Sucursal-Norte."
- **starterCode** (L1045): `df = pd.DataFrame({"region": ["Sucursal-Sur", "Sucursal-Centro"], "monto": [1.0, 2.0]})`
- **solutionCode** (L1053): `df = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste"], "monto": [1.0, 2.0]})`
- **Expected output** (L1056): `['region', 'total', 'n']` (column names — these are correct for any input)
- **Defects**: Three different region-name sets across instruction / starter / solution. The expected output (column names) happens to be correct regardless of fixture, so the auto-grader passes — but the learner sees three different "región" naming schemes in the same exercise card. Same synthetic-data drift pattern as C-03/C-04.
- **Pedagogical impact**: Lower than C-03/C-04 because the pass criterion is column names not values. But the drift erodes trust in the section's coherence.

#### C-06 · H · Theory T4-A demo `reconcile.py` — prose vs code disagree on parts and tasa

- **File**: `s17-packaging.ts:272-294`
- **Prose** (L275): "Caso sintético: total nacional 100 PEN; partes **Sucursal-Norte/Sucursal-Sur/Arequipa**; tasa de completitud **150/200=0.75**."
- **Code** (L283-289): `parts = pd.Series({"Sucursal-Centro": 60.0, "Oficina-Este": 30.0, "Arequipa": 10.0})` and `activos = 50; pagados = 20; print("tasa", pagados / activos, "denominador", activos)`
- **Output** (L292-293): `sum_parts 100.0 ok True` / `tasa 0.4 denominador 50`
- **Defects**: (a) Prose says parts are `Sucursal-Norte/Sucursal-Sur/Arequipa` but code uses `Sucursal-Centro/Oficina-Este/Arequipa`. (b) Prose says tasa is `150/200=0.75` but code computes `pagados=20/activos=50 = 0.4`. (c) Output `tasa 0.4 denominador 50` matches the code but contradicts the prose.
- **Pedagogical impact**: A learner reading the prose expects `tasa 0.75`; running the code produces `tasa 0.4`. The reconciliation lesson is sabotaged because the prose and code tell different stories.

#### C-07 · M · I Do T4-A demo `demo_totals.py` — prose vs code disagree on region names

- **File**: `s17-packaging.ts:490-510`
- **Description** (L493): "Reconciliar total nacional vs suma por región"
- **Code** (L499): `parts = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste", "Cliente-A"], "monto": [50.0, 30.0, 20.0]})`
- **Theory prose** (L275) describes the same case as "total nacional 100 PEN; partes Sucursal-Norte/Sucursal-Sur/Arequipa".
- **Output** (L509-510): `diff 0.0 reconciled True` / `tasa 0.75 den 200` (this matches the code: 50+30+20=100; 150/200=0.75)
- **Defects**: I Do demo and theory prose describe the "same" national reconciliation but use different region names (`Oficina-Este/Oficina-Oeste/Cliente-A` vs `Sucursal-Norte/Sucursal-Sur/Arequipa`) and different denominators (`200` vs the theory's `200` — actually this part matches).
- **Pedagogical impact**: Same as C-06 — the prose–code naming drift creates cognitive friction. The reconciliation math is correct in the I Do demo (sums to 100.0); only the prose-code naming is inconsistent.

### 3.3 Redaction / Style (5 issues)

#### G-01 · M · `vs` abbreviation used 13 times without period

- **Evidence**: `vs` (no period) appears at L15, L32 (×2), L225, L493, L546, L1271, L1384, L1389, L1412, L1433, L1437, L1528. LanguageTool `PUNTO_EN_ABREVIATURAS` rule fires 8 times with suggestion `vs.`.
- **Pedagogical impact**: Peruvian Spanish style (RAE) writes `vs.` (or, preferred, `c.` for "contra" or simply rewriting as "frente a" / "en comparación con"). The bare `vs` looks like English residue.
- **Examples**: `(suma vs media)`, `transform vs agg`, `Reconciliar total nacional vs suma por región`, `< vs <=`, `agg vs transform`.

#### G-02 · M · Anglicism drift `bridge` ↔ `tabla puente`

- **Evidence**: The section **defines** the Spanish term `tabla puente` (L45 "residual documentado en una tabla puente (**bridge**)") and `Contrato puente (**bridge table**)` (L274). But subsequent text switches to using `la bridge` as a feminine noun (L512 "el residual se documenta en la bridge", L1233 "la bridge es total → segmento_A → residual", L1241 "La bridge documenta total, segmento y residual juntos", L1413 "si usas bridge externa").
- **Pedagogical impact**: Inconsistency — once a Spanish term (`tabla puente`) is defined, subsequent references should use it consistently. The English borrow `bridge` as a Spanish feminine noun reads as Spanglish.
- **RAE guidance**: When a foreign term is italicized or quoted as a technical borrow, agreement is possible, but the cleaner solution is to use the Spanish term after defining it.

#### G-03 · M · Run-on sentences >45 words in theory prose (7 cases)

- **L14 (jobRelevance)** — 52-word run-on: *"En un equipo de analytics de banca, fintech o retail en Perú (p. ej. un tablero de clientes y transacciones en Lima, Cusco o Arequipa), el analista que solo "hace merge y groupby" sin documentar **cardinalidad**, sin **anti-join** de huérfanos y sin **cutoff** anti-leakage es el que entrega números inflados al comité."* — FH ≈ -25 (muy difícil).
- **L32 (paragraphs[])** — 54-word: *"Orden pedagógico (gradual release): **T1 Joins** (claves, cardinalidad, validate, anti-join) → **T2 Forma** (concat, melt, pivot, nombres estables) → **T3 Agregación** (groupby/agg/transform, ventanas y cohortes) → **T4 Reconciliación** (totales, denominadores, cutoff anti-leakage)."*
- **L44 (paragraphs[])** — 52-word: *"**Cardinalidad:** cuántas filas del lado derecho (o izquierdo) corresponden a cada clave (1:1, 1:m, m:m). **Fan-out:** explosión de filas por claves duplicadas en un join (típico m:m accidental). **Anti-join:** filas de un lado sin match (`left_only` / `right_only` con `indicator=True`)."* — single sentence (paragraph_single_sentence heuristic).
- **L45 (paragraphs[])** — 58-word: *"**Cohorte:** periodo de la primera observación válida de cada entidad (p. ej. mes de primera compra), no la fecha del batch de hoy. **Cutoff / as-of:** solo datos conocidos hasta la fecha *t* (`fecha <= t`). **Leakage temporal:** usar post-cutoff como si fuera pasado. **Reconciliación:** suma de partes ≈ total de referencia (tolerancia `eps`) o residual documentado en una tabla puente (**bridge**)."* — single sentence.
- **L199 (paragraphs[])** — 37-word: *"Con la forma long/wide ya estable, pasamos a **colapsar o reinyectar** números. `groupby` + `agg` **colapsa** grupos a una fila por clave (resúmenes ejecutivos). `transform` **reinyecta** el agregado al shape original (features a nivel fila: monto / media_región)."*
- **L201 (paragraphs[])** — 46-word: *"Caso sintético: regiones Sucursal-Norte/Cusco con montos → `agg` produce total y n; `transform('mean')` deja la media regional en cada fila. El EDA del portfolio usa agg para tablas y transform para scores relativos sin leakage de fechas (eso es T4-B)."*
- **L1383 (context)** — 26-word sentence in the middle of the You Do context paragraph.
- **Pedagogical impact**: Cognitive overload. The L14 `jobRelevance` opener is the first thing a learner reads in the section header (rendered raw, M-03) — a 52-word sentence at FH≈-25 is the wrong way to introduce the topic. L44/L45 are glossary entries crammed into single 50+ word sentences with 4–5 bolded terms each.

#### G-04 · L · Hints starting with lowercase code snippets

- **Evidence**: LanguageTool `UPPERCASE_SENTENCE_START` fires on 17 hints/edgeCases items. Most are pure code (e.g. `m = cli.merge(tx, on='cliente_id', how='inner')` at L620, `s.sort_index() antes de rolling(2).mean()` at L1139) where capitalization would be inappropriate. But several mix Spanish and code in ways that read as Spanish sentences:
  - L656: "merge left con indicator=True; filtra _merge == 'left_only'."
  - L1204: "tasa = pagados / activos (numerador de éxito sobre universo activo)."
  - L1269: "fecha > cutoff selecciona el post-periodo (9.0), no el as-of."
  - L1302: "delta = sum(todos los montos) - sum(montos con fecha <= cutoff)."
  - L1336: "left merge → filtra fecha<=cutoff para total_pre; leakage_delta = sum(monto merge) - total_pre."
- **Pedagogical impact**: Minor. The hints read as imperative-Spanish-with-inline-code. Capitalizing the first Spanish word ("Merge left con indicator=True…" / "Tasa = pagados / activos…") would improve readability without harming the code.

#### G-05 · L · Missing `¿` in edgeCase and uppercase after `?`

- **Evidence** (L906 edgeCases): `"orden importa en set? no"` — LanguageTool `CAPITALIZATION_AFTER_QUESTION_MARK` and `inverted_marks` both fire. Should be `"¿orden importa en set? No"`.
- **Pedagogical impact**: Small but visible — edge cases appear as small chips/badges; a learner scanning the chip reads "orden importa en set? no" which lacks the inverted question mark and the post-? capitalization that Peruvian Spanish orthography requires.

### 3.4 Pedagogical Structure (1 strength, 1 minor issue)

#### P-01 · Strength · Full I Do / We Do / You Do / selfCheck fidelity with capstone increment

- 8 I Do demos aligned 1:1 with the 8 theory subtopics (`S17-T1-A-DEMO` … `S17-T4-B-DEMO`).
- 24 We Do exercises (3 per subtopic × 8 subtopics) with decreasing scaffold: `kind: "guided"` → `kind: "independent"` → `kind: "transfer"`.
- The final We Do exercise (`S17-T4-B-E3`) is explicitly labeled "mini-integración (puente al You Do)" and joins merge + cutoff + leakage_delta in one contract — strong forward connective tissue.
- You Do capstone `portfolio_summary(clientes, tx, cutoff) -> dict` defines an explicit dict contract (`rows_merge`, `n_huerfanos_left_only`, `total_monto`, `total_pre_cutoff`, `leakage_delta`, `reconciled`) — auditable and testable.
- Rubric has 7 criteria summing to 100% with weights matching the theory emphasis (joins 20%, reshape 15%, groupby 15%, reconciliation 15%, leakage 15%, privacy 10%, reproducibility+memo 10%).
- selfCheck has 5 MCQs with `correctIndex` fairly distributed (indices 0, 2, 3, 1, 0) — not always the first option.

#### P-02 · M · `hint` field is byte-identical to `hints[0]` in 24/24 We Do exercises

- **Evidence**: Every We Do exercise has a `hint: "..."` scalar field and a `hints: ["...", "..."]` array where `hints[0]` is byte-identical to `hint`. E.g. L554 `hint` and L556 `hints[0]` both say `"Usa cli.merge(tx, on='cliente_id', how='left') para conservar clientes sin tx."`.
- **Pedagogical impact**: DRY violation. The renderer (`SectionView.tsx:495-503`) prefers `hints[]` if it exists, so `hint` is dead data in the source. Same pattern reported in S01 and S09.
- **Root cause**: Authoring template emitted both fields with the same value.

### 3.5 Cognitive Load & Progressive Disclosure (1 issue)

#### L-01 · M · Glossary block (L44-L46) crams 9 terms into 3 dense single-sentence paragraphs

- **Evidence**: The "Diccionario rápido de la sección" theory block (heading at L42) has 3 paragraphs:
  - P1 (L44, 52 words): Cardinalidad / Fan-out / Anti-join / Long/wide — 4 bolded terms in one sentence.
  - P2 (L45, 58 words): Cohorte / Cutoff / as-of / Leakage temporal / Reconciliación / bridge — 6 bolded terms in one sentence.
  - P3 (L46, 38 words): meta-instruction about using the glossary.
- **Pedagogical impact**: This is the second thing the learner reads (after the section map at L29-L32). Cramming 10 bolded terms into 2 sentences of 52+58 words at FH ≈ 22.5 ("muy difícil") violates the Miller-Cowan working-memory principle (4±1 chunks per unit). Compare with S15's "Diccionario de la sección" which segments each term into its own sentence/clause.
- **Improvement**: Convert to a bullet list with one short sentence per term.

### 3.6 Connective Tissue (strengths)

- **Backward pointer** (L31): *"El empaquetado de módulos/CLI ya se trabajó en la sección de módulos y CLI; aquí el 'paquete' es la evidencia analítica reproducible."* — explicit handoff from S10.
- **Backward pointer** (L52): *"Tras S16, normaliza `cliente_id` a str en ambos lados y verifica unicidad en el lado 1."* — explicit dtype-alignment bridge from S16.
- **Backward pointer** (L32): *"Solo APIs de pandas ya vistas en S15–S16 más merge/groupby de esta sección."* — scopes the API surface.
- **Forward pointer** (L32, L236, L308, L1384, L1433): S18 (EDA e incertidumbre) is named 5 times as the section that adds the incertidumbre / hallazgo-vs-hipótesis / intervalos layer on top of the tables prepared here. This is the strongest forward connective tissue in any section I've audited so far.
- **Internal contract consistency**: The `portfolio_summary` dict contract in the You Do (`rows_merge`, `n_huerfanos_left_only`, `total_monto`, `total_pre_cutoff`, `leakage_delta`, `reconciled`) is prefigured by the We Do mini-integración at L1331 (`{'rows_merge': int, 'total_pre': float, 'leakage_delta': float}`) — strong scaffolded handoff.

### 3.7 Comparison with Best-in-Class External Materials

- **Kaggle Pandas course** (cited at L1533): Kaggle teaches `merge`/`groupby`/`pivot` in 5 short notebooks with one concept per notebook. PyArcana S17 compresses the same material into 8 subtopics + 24 exercises + a capstone. The PyArcana compression is denser but the per-contract framing (filas pre/post, validate, anti-join, cutoff, residual) is more rigorous than Kaggle.
- **pandas user guide (merging, groupby, reshaping)** (cited at L1491, L1497, L1502): The official docs are reference-oriented (API by API). PyArcana S17 organizes by **analytical intent** (joins → form → aggregation → reconciliation) which is pedagogically superior for a portfolio-first course.
- **Python for Data Analysis (McKinney)** (cited at L1523): The book treats joins/reshape/groupby as separate chapters. PyArcana S17 integrating them around an "Executive Portfolio" narrative is novel and effective — when the code/output bugs (C-01 to C-07) are fixed, this section will be the strongest single-section treatment of the topic I've seen in a Spanish-language Python course.

### 3.8 Other Domain Issues

#### O-01 · L · Tagline is English-headed ("Executive Data Quality & EDA Portfolio con dataset limpio…")

- **Evidence** (L8): `"Executive Data Quality & EDA Portfolio con dataset limpio, notebook/script reproducible, reconciliación y preguntas de negocio"`
- The tagline opens with a 5-word English noun phrase before the Spanish connectors kick in. The card subtitle on the live page renders this verbatim.
- Improvement: `"Portfolio ejecutivo de calidad + EDA: dataset limpio, script reproducible, reconciliación y preguntas de negocio"`.

#### O-02 · L · `tests` field in all 24 We Do exercises is the same stub string

- **Evidence**: Every We Do exercise has `tests: "salida coincide con solution output"` (e.g. L560, L594, L626, L662, L698, L735, L771, L803, L837, L872, L907, L941, L973, L1005, L1037, L1071, L1103, L1143, L1176, L1208, L1240, L1272, L1306, L1343) — 24 identical strings.
- **Pedagogical impact**: This is a metadata field, not learner-facing text (the renderer doesn't display `tests`), so the impact is on maintainability rather than pedagogy. The string signals "the auto-grader compares stdout to solutionCode.output", which is fine as a contract — but if the auto-grader fails (as it will for C-03 and C-04), the failure is opaque.
- **Root cause**: Authoring template; same pattern as S02.

---

## 4. Meta-Leak Report

### 4.1 Confirmed developer meta-text leaks in user-facing prose

**None.** The two `meta_leak` heuristic hits at L1383 (`context`) and L31 (`paragraphs[]`) are false positives — they match the legitimate Spanish word "todo" (meaning "all") in:
- L1383: `"...total_monto (float, todo el universo de tx del merge)..."` 
- L31: `"...el You Do integra todo en un solo script."`

The regex `\bTODO\b` with `re.IGNORECASE` matches the lowercase Spanish word. The fix is to use case-sensitive `\bTODO\b` without `IGNORECASE` (or to whitelist the Spanish word "todo" when surrounded by Spanish determiners).

### 4.2 Source-code comments in `s17-packaging.ts`

**None.** No `//` or `/* */` JS comments are present in the 1,564-line file. The file is pure data.

### 4.3 Identity / routing leaks (systemic, not author-intent)

The three identity meta-leaks (M-01, M-02, M-03) are not author comments — they are infrastructure defects where the routing `id`, the interactive playground dictionary, and the JSX rendering pipeline were not updated when the section was retargeted. They affect the live learner experience as if they were author leaks:

- **M-01**: Live URL `#packaging` broadcasts "packaging" for a joins/groupby section. The section callout at L38 acknowledges the mismatch ("No publicas un paquete en PyPI: empaquetas un dataset limpio…") — which means the author was aware of the identity drift but did not migrate the `id`.
- **M-02**: The `demos['packaging']` entry in `SectionView.tsx:1578-1628` loads semver Python code into the S17 Theory tab's interactive playground. The learner sees `parse_semver` / `bump_version` / `is_backward_compatible` code — none of which appear in the section's theory, demos, exercises, or rubric.
- **M-03**: `**bold**` and `` `code` `` markdown markers from 8 source fields render as literal characters because `SectionView.tsx` renders them as raw JSX children without `<RichText>`. Verified on the live page.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do structural fidelity

| Tab | Subtopics | Activities | Per-subtopic count | Scaffold | Verdict |
|---|---|---|---|---|---|
| Teoría | 8 | 8 demos + 8 callouts | 1:1 demo:theory | — | ✓ |
| Yo hago (I Do) | 8 | 8 demos | 1 demo per subtopic | description → code → output → why | ✓ |
| Hacemos juntos (We Do) | 8 | 24 exercises | 3 per subtopic | guided → independent → transfer | ✓ |
| Tú haces (You Do) | 1 capstone | portfolio_summary dict + rubric | — | starterCode → requirements → rubric | ✓ |
| Autocheck | — | 5 MCQs | — | correctIndex distributed | ✓ |

**Fidelity verdict**: 9.5/10. The scaffold is gold-standard. The only structural nit (P-02) is the duplicate `hint` / `hints[0]` field.

### 5.2 Cognitive load analysis

- **Map paragraph** (L30, L31, L32): 3 paragraphs introducing the portfolio narrative, the synthetic dataset, and the T1→T4 ordering. L32 is a 54-word run-on (G-03) listing all 4 subtopics with their sub-contracts.
- **Glossary** (L44, L45, L46): 10 bolded terms in 110 words across 2 single-sentence paragraphs (L-01). Cognitive load is high.
- **Theory subtopic blocks**: each has 3 paragraphs (~30–50 words each) + 1 code demo + 1 callout. Mean paragraph FH ≈ 70 (normal). Acceptable.
- **We Do exercises**: each instruction is 30–80 words with embedded code identifiers. The instructions are dense but contract-driven ("Fixture `FIX-S17-T1A-E1`: cli={C001,C002}, tx={C001:1.0}. Haz `merge` por `cliente_id` con `how='left'` e imprime `len` del resultado. Pass: una línea con `2` (C002 se conserva aunque sin tx)."). WPS ≈ 12.3 — healthy for technical Spanish.
- **You Do capstone**: 6-paragraph `context` field at 156 words is at the upper bound of cognitive load for a single field.

### 5.3 Redaction quality

- **Tone**: Professional, second-person singular ("tú") throughout, consistent with the rest of the course. No code-switching into "usted" or plural.
- **Voice**: Active, imperative-leaning ("Documenta `rows_cli → rows_merge`", "Filtra `fecha <= cutoff`"). Consistent with the contract-driven pedagogy.
- **Terminology consistency**: Good — `cardinalidad`, `fan-out`, `anti-join`, `cohorte`, `cutoff`, `leakage`, `reconciliación`, `bridge`/`tabla puente` are all defined in the glossary and reused in demos/exercises. The only inconsistency is the `bridge` / `tabla puente` drift (G-02).
- **Markdown usage**: Heavy use of `**bold**` for term definitions and `` `code` `` for inline identifiers. The intent is correct; the rendering pipeline (M-03) breaks the typographic result.
- **Peruvian Spanish**: Region names rotate through Lima / Cusco / Arequipa / Sucursal-Norte / Sucursal-Sur / Sucursal-Centro / Oficina-Este / Oficina-Oeste / Cliente-A / Cliente-B — these rotate too much (synthetic-data refresh drift, see C-01 to C-07). PEN currency is consistent throughout. No "vos", no "ustedes".

### 5.4 Worst sentences (by Fernández-Huerta)

| Rank | Line | Key | FH | WPS | SPW | Preview |
|---|---|---|---|---|---|---|
| 1 | L1200 | instruction | -65.2 | 2 | 4.50 | `Imprime pagados/activos.` (2 words, 9 syllables — SPW=4.5 pushes FH negative; short technical fragment, not real prose) |
| 2 | L1029 | instruction | -36.2 | 3 | 4.00 | `Fixture region Cliente-B/Sucursal-Norte.` (3-word technical fragment) |
| 3 | L1402 | starterCode | -7.9 | 83 | 2.17 | docstring — code, not prose |
| 4 | L275 | paragraphs[] | -7.4 | 10 | 3.40 | `Caso sintético: total nacional 100 PEN; partes Sucursal-Norte/Sucursal-Sur/Arequipa; tasa de completitud 150/200=0.75.` — single-sentence case-study with 3 numeric facts crammed in |
| 5 | L1438 | criterion | 3.7 | 8 | 3.25 | `Reconciliación de totales/denominadores con diff o residual documentado` |
| 6 | L270 | heading | 3.8 | 3 | 3.33 | `Denominadores y totales` (heading — short by design) |
| 7 | L1476 | options[] | 3.8 | 3 | 3.33 | `Documentas el denominador` (MCQ option — short by design) |
| 8 | L91 | heading | 9.7 | 5 | 3.20 | `Validate, duplicación accidental y anti-join` |
| 9 | L1209 | feedback | 10.7 | 6 | 3.17 | `Si imprimiste 4.0, invertiste el cociente (activos/pagados).` |
| 10 | L1383 | context | 11.9 | 26 | 2.81 | You Do context — 156-word paragraph, mid-sentence extracted |
| 11 | L32 | paragraphs[] | 13.8 | 29 | 2.72 | Run-on "Orden pedagógico" sentence (G-03) |
| 12 | L1395 | requirements[] | 17.7 | 9 | 3.00 | `Fixtures sintéticos end-to-end (Cliente-B/Sucursal-Norte/Sucursal-Sur, `C00x`, PEN; sin PII real)` |
| 13 | L1390 | objectives[] | 19.7 | 7 | 3.00 | `Reconciliación de totales/denominadores con residual o eps` |
| 14 | L541 | why | 20.7 | 6 | 3.00 | `Cutoff y as-of evitan contaminación before/after.` |
| 15 | L45 | paragraphs[] | 22.5 | 58 | 2.09 | Glossary run-on (G-03) |

**Interpretation**: The `muy_difícil` band is dominated by short technical fragments (headings, MCQ options, code identifiers) where the FH formula breaks down — these are not real prose issues. The genuinely problematic sentences are the run-on theory paragraphs at L14, L32, L44, L45, L1383 — all addressed by G-03.

### 5.5 Heuristic findings summary

| Heuristic | Count | Notes |
|---|---|---|
| `missing_terminal` | 129 | Mostly false positives on headings, titles, callout titles, MCQ options, edge cases, criteria, requirements, notes — these are short-label strings, not prose sentences |
| `runon` (>45w / >32w) | 23 | 7 real prose run-ons (G-03); rest are code blocks (false positives) |
| `english_dominant` | 23 | Mix of false positives (short Spanish fragments with all-ASCII words) and real code-heavy instructions (acceptable for technical curriculum) |
| `unbalanced` | 20 | All false positives from markdown `**bold**` markers being counted as unbalanced `*` |
| `repeated_word` | 17 | All false positives from `code code` pattern after stripping markdown code blocks |
| `paragraph_single_sentence` | 15 | Real findings in glossary + some callouts (L-01) |
| `comma_density` | 8 | Minor — long instruction sentences with embedded lists |
| `space_before_punct` | 4 | Minor — markdown artifacts |
| `meta_leak` (TODO) | 2 | **Both false positives** — Spanish word "todo" (4.3) |
| `inverted_marks` | 1 | Real — L906 "orden importa en set? no" (G-05) |

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrites

For each tab, I list the worst paragraphs/sentences with **before** and **after** rewrites. Rewrites preserve all factual content (region names, code identifiers, contract names) and only fix grammar, run-on structure, anglicism drift, and `vs.` punctuation.

### 6.1 Theory tab

#### Theory · Map paragraph · L14 `jobRelevance`

> **Before** (52 words, FH≈-25):
> "En un equipo de analytics de banca, fintech o retail en Perú (p. ej. un tablero de clientes y transacciones en Lima, Cusco o Arequipa), el analista que solo "hace merge y groupby" sin documentar **cardinalidad**, sin **anti-join** de huérfanos y sin **cutoff** anti-leakage es el que entrega números inflados al comité."

> **After** (3 sentences, ~17 words each):
> "En un equipo de analytics de banca, fintech o retail en Perú (p. ej. un tablero de clientes y transacciones en Lima, Cusco o Arequipa), el analista que solo "hace merge y groupby" sin documentar **cardinalidad** entrega números inflados al comité. Lo mismo pasa si omites el **anti-join** de huérfanos o el **cutoff** anti-leakage. Cerrar un **portfolio de data quality + EDA** exige unir tablas con claves limpias, reshape long/wide con schema estable, agregaciones con contrato (suma vs. media) y reconciliación de totales que un stakeholder no técnico pueda auditar."

#### Theory · Order pedagógico paragraph · L32

> **Before** (54-word run-on):
> "Orden pedagógico (gradual release): **T1 Joins** (claves, cardinalidad, validate, anti-join) → **T2 Forma** (concat, melt, pivot, nombres estables) → **T3 Agregación** (groupby/agg/transform, ventanas y cohortes) → **T4 Reconciliación** (totales, denominadores, cutoff anti-leakage). Solo APIs de pandas ya vistas en S15–S16 más merge/groupby de esta sección. **Ritmo sugerido (~18 h):** ~4 h T1, ~4 h T2, ~5 h T3, ~3 h T4 + We Do de integración, ~2 h You Do/memo. **Después, S18** abre la lectura de incertidumbre (hallazgo vs hipótesis, intervalos): aquí dejas las tablas y los gates listos para esa capa."

> **After** (split with bullets and `vs.` fix):
> "Orden pedagógico (gradual release):
> - **T1 Joins** (claves, cardinalidad, validate, anti-join).
> - **T2 Forma** (concat, melt, pivot, nombres estables).
> - **T3 Agregación** (groupby/agg/transform, ventanas y cohortes).
> - **T4 Reconciliación** (totales, denominadores, cutoff anti-leakage).
>
> Solo APIs de pandas ya vistas en S15–S16, más `merge`/`groupby` de esta sección. **Ritmo sugerido (~18 h):** ~4 h T1, ~4 h T2, ~5 h T3, ~3 h T4 + We Do de integración, ~2 h You Do/memo. Después, **S18** abre la lectura de incertidumbre (hallazgo vs. hipótesis, intervalos): aquí dejas las tablas y los gates listos para esa capa."

#### Theory · Diccionario · L44 and L45

> **Before** (110 words, 2 single-sentence paragraphs, 10 bolded terms):
> "**Cardinalidad:** cuántas filas del lado derecho (o izquierdo) corresponden a cada clave (1:1, 1:m, m:m). **Fan-out:** explosión de filas por claves duplicadas en un join (típico m:m accidental). **Anti-join:** filas de un lado sin match (`left_only` / `right_only` con `indicator=True`). **Long/wide:** forma apilada por periodo (long) versus una columna por periodo (wide)."
> "**Cohorte:** periodo de la primera observación válida de cada entidad (p. ej. mes de primera compra), no la fecha del batch de hoy. **Cutoff / as-of:** solo datos conocidos hasta la fecha *t* (`fecha <= t`). **Leakage temporal:** usar post-cutoff como si fuera pasado. **Reconciliación:** suma de partes ≈ total de referencia (tolerancia `eps`) o residual documentado en una tabla puente (**bridge**)."

> **After** (bullet list, one short clause per term; consistent Spanish `tabla puente`):
> "- **Cardinalidad:** cuántas filas del lado derecho (o izquierdo) corresponden a cada clave (1:1, 1:m, m:m).
> - **Fan-out:** explosión de filas por claves duplicadas en un join (típico en un m:m accidental).
> - **Anti-join:** filas de un lado sin match (`left_only` / `right_only` con `indicator=True`).
> - **Long/wide:** forma apilada por periodo (long) versus una columna por periodo (wide).
> - **Cohorte:** periodo de la primera observación válida de cada entidad (p. ej. mes de primera compra), no la fecha del batch de hoy.
> - **Cutoff / as-of:** solo datos conocidos hasta la fecha *t* (`fecha <= t`).
> - **Leakage temporal:** usar datos post-cutoff como si fueran pasados.
> - **Reconciliación:** la suma de partes ≈ total de referencia (tolerancia `eps`) o residual documentado en una tabla puente."

#### Theory · T4-A · L275

> **Before** (10-word case-study sentence, FH≈-7, prose-code disagreement C-06):
> "Caso sintético: total nacional 100 PEN; partes Sucursal-Norte/Sucursal-Sur/Arequipa; tasa de completitud 150/200=0.75."

> **After** (aligned with code at L283-L289, fixing C-06):
> "Caso sintético: total nacional 100 PEN, con partes Sucursal-Centro (60), Oficina-Este (30) y Arequipa (10). Tasa de completitud: 20 pagados de 50 activos = 0.40."

#### Theory · T4-A · L274

> **Before** (anglicism `bridge table`):
> "Contrato puente (**bridge table**): `total → segmento_A → residual`. Si Cliente-B=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográfico solo porque "sale un número bonito" en el slide. El residual es evidencia, no un error a esconder."

> **After** (Spanish `tabla puente` consistently):
> "Contrato de tabla puente: `total → segmento_A → residual`. Si Cliente-B=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográfico solo porque "sale un número bonito" en el slide. El residual es evidencia, no un error a esconder."

### 6.2 I Do (Yo hago) tab

#### I Do · T4-A demo why · L512

> **Before** (anglicism `la bridge`):
> "Totales y denominadores anclan el EDA ejecutivo. Si `sum(partes) ≠ total`, el residual se documenta en la bridge — no se oculta en el slide ni se "redondea" a ojo."

> **After**:
> "Totales y denominadores anclan el EDA ejecutivo. Si `sum(partes) ≠ total`, el residual se documenta en la **tabla puente** — no se oculta en el slide ni se "redondea" a ojo."

#### I Do · T3-A demo description · L441 (no rewrite needed; just fix code/output C-02)

Description is fine: "Agregar montos por región y reinyectar media con transform". The bug is the `output` field at L457-458 — see proposed diff D-C02.

### 6.3 We Do (Hacemos juntos) tab

#### We Do · S17-T3-A-E1 instruction · L965-966

> **Before** (C-03 — four-way fixture drift; expected output mathematically impossible):
> "E1 (guiado) — Concepto: groupby + sum. Fixture region Cliente-B×2 y Sucursal-Norte×1 con montos 1,2,3. Imprime `groupby('region')['monto'].sum().to_dict()`. Pass: `{'Sucursal-Sur': 3.0, 'Sucursal-Centro': 3.0}` (orden de keys puede seguir sort de pandas)."

> **After** (aligned fixture across instruction/starter/solution/output; Pass matches actual solutionCode output):
> "E1 (guiado) — Concepto: `groupby` + `sum`. Fixture: regiones Sucursal-Norte, Sucursal-Sur y Sucursal-Centro, cada una con un monto (1.0, 2.0, 3.0 respectivamente). Imprime `groupby('region')['monto'].sum().to_dict()`. Pass: `{'Sucursal-Centro': 3.0, 'Sucursal-Norte': 1.0, 'Sucursal-Sur': 2.0}` (las keys siguen el sort alfabético de pandas)."

#### We Do · S17-T3-A-E2 instruction · L998

> **Before** (C-04 — solutionCode fixture doesn't produce expected output):
> "E2 (independiente) — Concepto: transform mean al shape original. Fixture Cliente-A 1.0/3.0 y Cliente-B 2.0. Imprime lista de `groupby('region')['monto'].transform('mean')`. Pass: `[2.0, 2.0, 2.0]`. No uses agg (colapsa filas)."

> **After** (fixture described matches the actual solutionCode that produces `[2.0, 2.0, 2.0]`):
> "E2 (independiente) — Concepto: `transform('mean')` al shape original. Fixture: Cliente-A con dos montos (1.0, 3.0) y Cliente-B con un monto (2.0). Imprime la lista de `groupby('region')['monto'].transform('mean')`. Pass: `[2.0, 2.0, 2.0]`. No uses `agg` (colapsa filas)."

> **Plus the solutionCode rewrite** (so the code matches the description):
> ```python
> import pandas as pd
> df = pd.DataFrame({"region": ["Cliente-A", "Cliente-A", "Cliente-B"], "monto": [1.0, 3.0, 2.0]})
> print(df.groupby("region")["monto"].transform("mean").tolist())
> # Output: [2.0, 2.0, 2.0]
> ```

#### We Do · S17-T3-A-E3 instruction · L1030

> **Before** (C-05 — instruction names regions differently from solution):
> "E3 (transferencia) — Concepto: contrato de columnas del resumen ejecutivo. Fixture region Cliente-B/Sucursal-Norte. Construye `groupby(..., as_index=False).agg(total=('monto','sum'), n=('monto','count'))` e imprime columns.tolist(). Pass: `['region', 'total', 'n']`."

> **After** (aligned with solutionCode fixture):
> "E3 (transferencia) — Concepto: contrato de columnas del resumen ejecutivo. Fixture: regiones Oficina-Este y Oficina-Oeste, cada una con un monto (1.0, 2.0). Construye `groupby(..., as_index=False).agg(total=('monto','sum'), n=('monto','count'))` e imprime `columns.tolist()`. Pass: `['region', 'total', 'n']`."

#### We Do · T4-A-E3 instruction · L1233

> **Before** (anglicism `la bridge`):
> "E3 (transferencia) — Concepto: tabla puente (bridge) nacional→Cliente-A con residual documentado. total=100, lima=60; imprime el dict `{'total': 100.0, 'lima': 60.0, 'residual': float}` con residual = total−lima. Pass: `{'total': 100.0, 'lima': 60.0, 'residual': 40.0}`. Transfer: en el memo del portfolio la bridge es total → segmento_A → residual, no un descuadre oculto ni un solo float suelto."

> **After**:
> "E3 (transferencia) — Concepto: tabla puente nacional → Cliente-A con residual documentado. `total=100`, `lima=60`; imprime el dict `{'total': 100.0, 'lima': 60.0, 'residual': float}` con `residual = total − lima`. Pass: `{'total': 100.0, 'lima': 60.0, 'residual': 40.0}`. Transfer: en el memo del portfolio la **tabla puente** es `total → segmento_A → residual`, no un descuadre oculto ni un solo float suelto."

#### We Do · T4-A-E3 feedback · L1241

> **Before**:
> "Si imprimiste -40.0 o residual negativo, restaste al revés (lima−total). La bridge documenta total, segmento y residual juntos (40.0)."

> **After**:
> "Si imprimiste -40.0 o un residual negativo, restaste al revés (`lima − total`). La **tabla puente** documenta total, segmento y residual juntos (40.0)."

#### We Do · S17-T2-B-E2 edgeCases · L906

> **Before** (G-05 — missing `¿`, lowercase after `?`):
> `"orden importa en set? no"`

> **After**:
> `"¿orden importa en set? No"`

#### We Do · All 24 exercises · `tests` field

Not learner-facing (metadata only), but if exposed in future: `"salida coincide con solution output"` → `"la salida coincide con la del solutionCode"`.

### 6.4 You Do (Tú haces) tab

#### You Do · context · L1383

> **Before** (156 words, run-on at the "Criterios de aceptación del dict" sentence, `vs` without period ×2):
> "Integra clientes/transacciones sintéticas limpias (S15–S16) con joins validados (cardinalidad + anti-join), reshape long/wide con schema estable, groupby/agg/transform, reconciliación de totales/denominadores y controles de leakage con cutoff. Entrega un script reproducible (`if __name__`), respuestas de negocio con evidencia numérica y un memo de límites/no-claims en español profesional. Sin PII real ni datos de producción. **Criterios de aceptación del dict** (mínimo): `rows_merge` (int), `n_huerfanos_left_only` (int), `total_monto` (float, todo el universo de tx del merge), `total_pre_cutoff` (float, solo `fecha <= cutoff`), `leakage_delta` (`total_monto - total_pre_cutoff`), `reconciled` (bool: p. ej. residual de partes vs total bajo eps). Este entregable es la base tabular; en **S18** trabajarás la lectura de incertidumbre (hallazgo vs hipótesis) sobre estos mismos hallazgos."

> **After** (split into 4 paragraphs; `vs.` fix; consistent terminology):
> "Integra clientes/transacciones sintéticas limpias (S15–S16) con joins validados (cardinalidad + anti-join), reshape long/wide con schema estable, `groupby`/`agg`/`transform`, reconciliación de totales/denominadores y controles de leakage con cutoff. Entrega un script reproducible (`if __name__`), respuestas de negocio con evidencia numérica y un memo de límites/no-claims en español profesional. Sin PII real ni datos de producción.
>
> **Criterios de aceptación del dict** (mínimo):
> - `rows_merge` (int): filas del merge.
> - `n_huerfanos_left_only` (int): clientes del maestro sin transacciones.
> - `total_monto` (float): suma de montos de todo el universo del merge.
> - `total_pre_cutoff` (float): suma de montos con `fecha <= cutoff` (as-of).
> - `leakage_delta` (float): `total_monto − total_pre_cutoff`.
> - `reconciled` (bool): `True` si el residual de partes vs. total de referencia cabe en `eps`.
>
> Este entregable es la base tabular; en **S18** trabajarás la lectura de incertidumbre (hallazgo vs. hipótesis) sobre estos mismos hallazgos."

#### You Do · portfolioNote · L1433

> **Before** (`vs` without period):
> "Este cierre del portfolio de calidad + EDA debe poder mostrarse a un stakeholder no técnico: métricas, reconciliación, límites y ausencia de claims causales no soportados. En S18 añadirás la capa de incertidumbre (intervalos, hallazgo vs hipótesis) sobre estos números — no reescribas los joins; reutiliza el dataset limpio."

> **After**:
> "Este cierre del portfolio de calidad + EDA debe poder mostrarse a un stakeholder no técnico: métricas, reconciliación, límites y ausencia de claims causales no soportados. En S18 añadirás la capa de incertidumbre (intervalos, hallazgo vs. hipótesis) sobre estos números — no reescribas los joins; reutiliza el dataset limpio."

#### You Do · rubric criteria · L1437, L1438

> **Before** (`vs` without period ×2):
> - L1437: "Groupby/agg/transform alineado a la pregunta de negocio (suma vs media)"
> - L1438: "Reconciliación de totales/denominadores con diff o residual documentado"

> **After**:
> - L1437: "Groupby/agg/transform alineado a la pregunta de negocio (suma vs. media)"
> - L1438: "Reconciliación de totales/denominadores con `diff` o residual documentado"

### 6.5 Self-check (Autocheck) tab

The 5 MCQs are short and grammatically clean. The `explanation` fields contain `validate` (English pandas parameter), which triggers LanguageTool's `VOSEO` rule (false positive — `validate` is not the Spanish imperative `valídate`). No real grammar issues.

#### Self-check · Q5 explanation · L1479

> **Before** (clean):
> "Cualquier agregado o feature con fecha > cutoff contamina el análisis before/after; filtra as-of (`fecha <= cutoff`) y reporta el delta de leakage en el memo."

> **After** (minor — translate `before/after` for consistency with the rest of the section):
> "Cualquier agregado o feature con fecha > cutoff contamina el análisis antes/después; filtra as-of (`fecha <= cutoff`) y reporta el delta de leakage en el memo."

---

## 7. Proposed GitHub-style Diffs

Each diff is against `src/lib/course/sections/s17-packaging.ts` unless the path prefix says otherwise.

### D-M01 · Rename section id `packaging` → `joins-groupby-cierre`

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -1,7 +1,7 @@
 import type { CourseSection } from '../../types'

 export const section17: CourseSection = {
- id: "packaging",
+ id: "joins-groupby-cierre",
  index: 17,
  title: "Joins, reshape, groupby y cierre analítico",
  shortTitle: "Joins · groupby · cierre",
```

(Plus a corresponding rename of the file `s17-packaging.ts` → `s17-joins-groupby-cierre.ts` and the import in `src/lib/course/index.ts:19`. This is a breaking change for any saved progress keyed by old id — coordinate with the migration plan that S06/S09/S10/S13 also need.)

### D-M02 · Replace the off-topic `demos['packaging']` entry with pandas joins/groupby demo code

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1575,9 +1575,28 @@
       hint: 'Anade un tercer boton con su propio callback y haz clic en el',
     },
-    'packaging': {
-      title: 'Practica semver y dependencias',
-      code: `# Practica Semantic Versioning y gestion de dependencias
-import re
+    'joins-groupby-cierre': {
+      title: 'Practica merge, groupby y reconciliacion',
+      code: `# Practica pandas merge, groupby y reconciliacion (sin dependencias externas)
+import pandas as pd

-def parse_semver(version_str):
-    """Parsea una version semver: MAJOR.MINOR.PATCH."""
-    match = re.match(r"^(\\d+)\\.(\\d+)\\.(\\d+)", version_str)
-    if not match:
-        return None
-    return tuple(int(x) for x in match.groups())
+# Maestro de clientes y transacciones sinteticas
+cli = pd.DataFrame({"cliente_id": ["C001", "C002"], "region": ["Lima", "Cusco"]})
+tx = pd.DataFrame({"cliente_id": ["C001", "C001", "C003"], "monto": [10.0, 5.0, 7.0]})

-def bump_version(version_str, bump_type):
-    """Incrementa una version semver."""
-    major, minor, patch = parse_semver(version_str)
-    if bump_type == "patch":
-        patch += 1
-    elif bump_type == "minor":
-        minor += 1
-        patch = 0
-    elif bump_type == "major":
-        major += 1
-        minor = 0
-        patch = 0
-    return f"{major}.{minor}.{patch}"
+# Left merge con indicator=True (anti-join de huerfanos)
+m = cli.merge(tx, on="cliente_id", how="left", indicator=True)
+print("rows", len(cli), "->", len(m))
+print("huerfanos_left_only", m.loc[m["_merge"] == "left_only", "cliente_id"].tolist())

-# Demostrar semver
-version = "1.4.2"
-print(f"Version actual: {version}")
-print(f"  patch bump:  {bump_version(version, 'patch')}")
-print(f"  minor bump:  {bump_version(version, 'minor')}")
-print(f"  major bump:  {bump_version(version, 'major')}")
+# Groupby con suma de montos por region
+agg = m.groupby("region", as_index=False).agg(total=("monto", "sum"), n=("monto", "count"))
+print(agg.to_dict(orient="list"))

-# Verificar compatibilidad
-def is_backward_compatible(old, new):
-    """True si new es backward compatible con old."""
-    o_major, o_minor, _ = parse_semver(old)
-    n_major, n_minor, _ = parse_semver(new)
-    return n_major == o_major and n_minor >= o_minor
+# Reconciliacion: total de tx vs total del merge
+print("reconciled", abs(tx["monto"].sum() - m["monto"].sum()) < 1e-9)
+`,
+      expectedOutput: `rows 2 -> 3
+huerfanos_left_only ['C002']
+{'region': ['Cusco', 'Lima'], 'total': [nan, 15.0], 'n': [1, 2]}
+reconciled True
+`,
+      hint: 'Usa how="left" e indicator=True; luego groupby("region").agg(total=..., n=...)',
+    },
```

(If the `id` rename in D-M01 is not applied, keep the key as `'packaging'` but replace the value with the pandas demo.)

### D-M03 · Route the 8 raw prose fields through `<RichText>`

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -186,7 +186,7 @@
                   <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0" title={tr('section.jobRelevance')}>
                     <Briefcase className="h-4 w-4" />
                   </Button>
-                  <p className="text-sm text-foreground/80">{section.jobRelevance}</p>
+                  <p className="text-sm text-foreground/80"><RichText content={section.jobRelevance} sectionId={section.id} /></p>
                 </div>
               )}
             </div>
@@ -398,7 +398,7 @@
           {block.callout && (
             <Callout type={block.callout.type} title={block.callout.title}>
-              {block.callout.content}
+              <RichText content={block.callout.content} sectionId={section.id} />
             </Callout>
           )}
@@ -450,7 +450,7 @@
                 <div className="px-5 py-3 space-y-2">
-                  <p className="mt-1 text-sm text-foreground/80">{step.why}</p>
+                  <p className="mt-1 text-sm text-foreground/80"><RichText content={step.why} sectionId={section.id} /></p>
                 </div>
@@ -488,7 +488,7 @@
-                <span className="text-sm font-semibold">{step.instruction}</span>
+                  <RichText content={step.instruction} sectionId={section.id} />
@@ -499,7 +499,7 @@
-                  {step.hint}
+                  <RichText content={step.hint} sectionId={section.id} />
@@ -567,7 +567,7 @@
                   {step.feedback && (
-                      {step.feedback}
+                      <RichText content={step.feedback} sectionId={section.id} />
                   )}
@@ -611,7 +611,7 @@
-            <p className="mt-1 text-sm text-foreground/80">{project.context}</p>
+            <p className="mt-1 text-sm text-foreground/80"><RichText content={project.context} sectionId={section.id} /></p>
@@ -646,7 +646,7 @@
-            {project.portfolioNote}
+            <RichText content={project.portfolioNote} sectionId={section.id} />
@@ -662,7 +662,7 @@
-                  <td className="px-3 py-2 text-foreground/80">{r.criterion}</td>
+                  <td className="px-3 py-2 text-foreground/80"><RichText content={r.criterion} sectionId={section.id} /></td>
```

(Note: applying this same fix to all 52 sections resolves M-03 globally. The fix is mechanical but requires verifying that `<RichText>` is imported in scope — it is already used at lines 387, 426, 476.)

### D-C01 · Fix T3-A theory demo `output` (groupby_agg.py)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -217,8 +217,8 @@
 s17_th_5()`,

- output: `{'region': ['Oficina-Oeste', 'Cliente-A'], 'monto_sum': [5.0, 30.0], 'n': [1, 2]}
-[15.0, 15.0, 5.0]`,
+ output: `{'region': ['Oficina-Este', 'Sucursal-Centro', 'Sucursal-Sur'], 'monto_sum': [5.0, 20.0, 10.0], 'n': [1, 1, 1]}
+[5.0, 20.0, 10.0]`,
  },
  callout: {
```

### D-C02 · Fix T3-A I Do demo `output` (demo_groupby.py)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -454,8 +454,8 @@ s17_ido_5()`,

- output: `{'region': ['Sucursal-Sur', 'Sucursal-Centro'], 'total': [20.0, 40.0], 'n': [2, 2]}
-[20.0, 20.0, 10.0, 10.0]`,
+ output: `{'region': ['Arequipa', 'Cliente-B', 'Sucursal-Norte'], 'total': [20.0, 10.0, 30.0], 'n': [2, 1, 1]}
+[10.0, 30.0, 10.0, 10.0]`,
  },
```

### D-C03 · Fix S17-T3-A-E1 (instruction + starter + solution + expected output aligned)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -963,9 +963,9 @@
  instruction:
- "E1 (guiado) — Concepto: groupby + sum. Fixture region Cliente-B×2 y Sucursal-Norte×1 con montos 1,2,3. Imprime `groupby('region')['monto'].sum().to_dict()`. Pass: `{'Sucursal-Sur': 3.0, 'Sucursal-Centro': 3.0}` (orden de keys puede seguir sort de pandas).",
+ "E1 (guiado) — Concepto: `groupby` + `sum`. Fixture: regiones Sucursal-Norte, Sucursal-Sur y Sucursal-Centro, cada una con un monto (1.0, 2.0, 3.0 respectivamente). Imprime `groupby('region')['monto'].sum().to_dict()`. Pass: `{'Sucursal-Centro': 3.0, 'Sucursal-Norte': 1.0, 'Sucursal-Sur': 2.0}` (las keys siguen el sort alfabético de pandas).",

@@ -978,7 +978,7 @@
  starterCode: {
   ...
-  df = pd.DataFrame({"region": ["Oficina-Oeste", "Cliente-A", "Cliente-B"], "monto": [1.0, 2.0, 3.0]})
+  df = pd.DataFrame({"region": ["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"], "monto": [1.0, 2.0, 3.0]})
   print(df.groupby("region")["monto"].mean().to_dict())
  ...

@@ -985,7 +985,7 @@
  solutionCode: {
   ...
   df = pd.DataFrame({"region": ["Sucursal-Norte", "Sucursal-Sur", "Sucursal-Centro"], "monto": [1.0, 2.0, 3.0]})
   print(df.groupby("region")["monto"].sum().to_dict())
  ...
- output: `{'Oficina-Este': 3.0, 'Oficina-Oeste': 3.0}`,
+ output: `{'Sucursal-Centro': 3.0, 'Sucursal-Norte': 1.0, 'Sucursal-Sur': 2.0}`,
  },
```

### D-C04 · Fix S17-T3-A-E2 (solutionCode fixture + instruction aligned to `[2.0, 2.0, 2.0]`)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -1018,7 +1018,7 @@
  solutionCode: {
   ...
-  df = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste", "Cliente-A"], "monto": [1.0, 3.0, 2.0]})
+  df = pd.DataFrame({"region": ["Cliente-A", "Cliente-A", "Cliente-B"], "monto": [1.0, 3.0, 2.0]})
   print(df.groupby("region")["monto"].transform("mean").tolist())
  ...
```

### D-C05 · Fix S17-T3-A-E3 (instruction aligned to solutionCode fixture)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -1027,7 +1027,7 @@
  instruction:
- "E3 (transferencia) — Concepto: contrato de columnas del resumen ejecutivo. Fixture region Cliente-B/Sucursal-Norte. Construye `groupby(..., as_index=False).agg(total=('monto','sum'), n=('monto','count'))` e imprime columns.tolist(). Pass: `['region', 'total', 'n']`. Transfer: named agg fija el schema que el stakeholder verá en el CSV del portfolio.",
+ "E3 (transferencia) — Concepto: contrato de columnas del resumen ejecutivo. Fixture: regiones Oficina-Este y Oficina-Oeste, cada una con un monto (1.0, 2.0). Construye `groupby(..., as_index=False).agg(total=('monto','sum'), n=('monto','count'))` e imprime `columns.tolist()`. Pass: `['region', 'total', 'n']`. Transfer: named agg fija el schema que el stakeholder verá en el CSV del portfolio.",
```

(Also fix the starterCode at L1045 to use the same fixture for consistency.)

### D-C06 · Fix T4-A theory prose (L275) to match the code (L283-L289)

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -272,7 +272,7 @@
  paragraphs: [
-  "Tras joins y agregaciones, el stakeholder pregunta: "¿cuadra el total?". Reconciliación ejecutiva: la **suma de partes debe igualar el total** de referencia (o la diferencia queda documentada con tolerancia `abs(diff)<eps`). Los **denominadores** de tasas (pagados/activos, completos/universo) deben ser el mismo filtro que declaras en el texto del hallazgo — no un universo "más cómodo".",
-  "Contrato puente (**bridge table**): `total → segmento_A → residual`. Si Cliente-B=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográfico solo porque "sale un número bonito" en el slide. El residual es evidencia, no un error a esconder.",
-  "Caso sintético: total nacional 100 PEN; partes Sucursal-Norte/Sucursal-Sur/Arequipa; tasa de completitud 150/200=0.75. El portfolio imprime `diff`, `reconciled` y la tasa con su denominador explícito para el stakeholder no técnico. Si el join de T1 tenía fan-out no documentado, este bloque es el primero que "no cierra": por eso T1 va antes que T4.",
+  "Tras joins y agregaciones, el stakeholder pregunta: "¿cuadra el total?". Reconciliación ejecutiva: la **suma de partes debe igualar el total** de referencia (o la diferencia queda documentada con tolerancia `abs(diff)<eps`). Los **denominadores** de tasas (pagados/activos, completos/universo) deben ser el mismo filtro que declaras en el texto del hallazgo — no un universo "más cómodo".",
+  "Contrato de tabla puente: `total → segmento_A → residual`. Si Sucursal-Centro=60 y total=100, el residual del resto es 40. Nunca uses un denominador de otro corte temporal o geográfico solo porque "sale un número bonito" en el slide. El residual es evidencia, no un error a esconder.",
+  "Caso sintético: total nacional 100 PEN, con partes Sucursal-Centro (60), Oficina-Este (30) y Arequipa (10). Tasa de completitud: 20 pagados de 50 activos = 0.40. El portfolio imprime `diff`, `reconciled` y la tasa con su denominador explícito para el stakeholder no técnico. Si el join de T1 tenía fan-out no documentado, este bloque es el primero que "no cierra": por eso T1 va antes que T4.",
```

### D-C07 · Fix T4-A I Do demo (L499) region names to match theory prose

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -496,7 +496,7 @@
   code: `def s17_ido_7():
    import pandas as pd
-   parts = pd.DataFrame({"region": ["Oficina-Este", "Oficina-Oeste", "Cliente-A"], "monto": [50.0, 30.0, 20.0]})
+   parts = pd.DataFrame({"region": ["Sucursal-Centro", "Oficina-Este", "Arequipa"], "monto": [50.0, 30.0, 20.0]})
    total_ref = 100.0
    diff = float(parts["monto"].sum() - total_ref)
    print("diff", diff, "reconciled", abs(diff) < 1e-9)
```

(Both region sets sum to 100.0 so the `output` field at L509-510 is unchanged. The diff just aligns the demo with the theory prose naming.)

### D-G01 · Fix all `vs` → `vs.` (13 occurrences)

Use `replace_all` on the literal ` vs ` → ` vs. ` in the source file. Care: do not match `vs.` (already correct) or substrings like `CSV`. The 13 occurrences are at L15, L32 (×2), L225, L493, L546, L1271, L1384, L1389, L1412, L1433, L1437, L1528.

### D-G02 · Replace `la bridge` / `La bridge` / `bridge externa` → `la tabla puente` / `La tabla puente` / `tabla puente externa`

Lines: L512, L1233 (×2), L1241, L1413. Plus drop the parenthetical `(**bridge**)` and `(**bridge table**)` once the Spanish term is established.

### D-G03 · Split run-on sentences (L14, L32, L44, L45, L1383)

See paragraph-by-paragraph rewrites in §6.

### D-G05 · Fix L906 edgeCase `¿` and capitalization

```diff
--- a/src/lib/course/sections/s17-packaging.ts
+++ b/src/lib/course/sections/s17-packaging.ts
@@ -903,7 +903,7 @@
  edgeCases: ["dejar multiindex", "espacios",
-  "orden importa en set? no",
+  "¿orden importa en set? No",
   "list =="],
```

### D-P02 · Deduplicate `hint` field (24 exercises)

Either (a) delete the `hint:` scalar field in all 24 We Do exercises (since the renderer prefers `hints[]`), or (b) update `SectionView.tsx` to make `hint` an alias that always reads from `hints[0]`. Option (a) is simpler.

### D-L01 · Convert glossary block (L44-L46) to bullet list

See §6.1 "Diccionario" rewrite.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue IDs | Effort | Impact |
|---|---|---|---|
| **P0** (blocking the learning experience) | M-02, M-03, C-01, C-02, C-03, C-04 | ~3 h | Off-topic playground + markdown leak + 4 fabricated outputs in T3-A demos/exercises |
| **P1** (visible defects, easy fix) | M-01, C-05, C-06, C-07, G-01, G-02 | ~2 h | Identity rename + 3 fixture-name drifts + `vs.`/`bridge` consistency |
| **P2** (run-on sentences, cognitive load) | G-03, L-01 | ~1.5 h | Split 7 run-ons + convert glossary to bullets |
| **P3** (style polish) | G-04, G-05, P-02, O-01, O-02 | ~1 h | Hint capitalization, `¿`, dedup `hint`, tagline Spanish, `tests` string |
| **P4** (long-term systemic) | M-01 file rename, M-03 global `<RichText>` sweep | ~6 h across all 52 sections | Same defects exist in S06/S09/S10/S13 and likely 30+ other sections |

**Total estimated fix time for S17 alone**: ~8 hours (P0+P1+P2+P3) by a single editor.

---

## 9. Graph Memory Update Notes (for shared context files)

The following observations should be added to the orchestrator's shared graph memory for reuse by other section auditors and by the Fixer:

1. **Identity meta-leak is systemic across retargeted sections**: confirmed in S06 (`id:"numpy"`), S09 (`id:"visualization"`), S10 (`id:"sklearn"`), S13 (`id:"rpa-automation"`), and now S17 (`id:"packaging"`). The pattern is: V3 retarget leaves `id` and filename unchanged, but the `demos[id]` dictionary in `SectionView.tsx` was never updated. **Recommended Fixer strategy**: write a one-time audit script that for each `section.id` checks whether the corresponding `demos[id]` title contains any token from the section's `title` — flag mismatches.

2. **Markdown leak is systemic**: the 8 raw JSX render sites in `SectionView.tsx` (lines 189, 401, 453, 491, 503, 571, 614, 649, 665) affect every section that uses `**bold**` or `` `code` `` in those fields. S06 reported this; S17 confirms. **Recommended Fixer strategy**: a single PR that routes all 8 fields through `<RichText>` fixes all 52 sections at once.

3. **Synthetic-data refresh drift is the most damaging defect class**: in S17, 7 separate code/output/prose contradictions in T3-A and T4-A all stem from a partial fixture-name refresh — the code was edited to use one set of region names but the `output` strings and the prose were not updated. The same root cause was identified in S03 (5-string drift). **Recommended Fixer strategy**: write a Python harness that, for each We Do / I Do `code` block, executes the code and asserts that the printed output matches the stored `output` field. Run as a CI check.

4. **`hint` ↔ `hints[0]` duplication is systemic**: S01 reported it (24/24), S09 reported it (21/24), S17 now reports it (24/24). Authoring template emitted both. **Recommended Fixer strategy**: delete the `hint:` scalar field from all We Do exercises across all 52 sections (renderer prefers `hints[]`).

5. **`tests: "salida coincide con solution output"` stub is systemic**: 24/24 We Do exercises in S17 have this identical metadata string. Same pattern in S02. The renderer doesn't display it, but it signals a single auto-grader contract. If the orchestrator plans to introduce real per-exercise test logic, this field needs to be a real assertion.

6. **`vs` without period is the most frequent Spanish style defect** in technical sections (13 occurrences in S17 alone). Likely present in all 52 sections. **Recommended Fixer strategy**: global `s/ vs / vs. /g` across all `src/lib/course/sections/*.ts` files (with a unit test that no `vs.` becomes `vs..`).

7. **`bridge` / `tabla puente` anglicism drift** is section-specific to S17. Other sections may have analogous borrow-word drift (e.g. `el score`, `la queue`, `el feature`). Auditors should check for terms defined as `Spanish (English)` in a glossary and then verify subsequent uses prefer the Spanish form.

8. **Fernández-Huerta aggregate for S17**: mean 73.05 (normal), median 71.20 — healthy for technical Spanish. Comparable to S02 (83.6) and S09 (70.5). The `muy_difícil` band (22 sentences) is dominated by short headings and code-adjacent fragments, not real prose. The grammar quality of S17's prose is above average for the course.

9. **LanguageTool `VOSEO` rule is a high-false-positive source**: it flags every occurrence of the pandas parameter `validate` as the Spanish voseo imperative `valídate`. Auditors should disable or filter this rule when the section uses `validate` as a code identifier.

10. **`meta_leak` heuristic should be case-sensitive for `TODO`**: the regex `\bTODO\b` with `re.IGNORECASE` matches the legitimate Spanish word "todo" (meaning "all"). Auditors should either drop `IGNORECASE` for `TODO` or whitelist the Spanish construction.

---

## 10. Method Note (research summary)

### Heuristics applied

| Source | Heuristic | Implementation |
|---|---|---|
| Fernández-Huerta (1959) | `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` | Spanish syllable counter with vowel-cluster dipthong/hiatus handling |
| Szigriszt-Pazos / INFLESZ | `206.835 − 62.3·(syllables/word) − (words/sentence)` | Same syllable counter |
| WPS (words per sentence) | mean length, soft target 15–32 for technical Spanish | Word regex `[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:[-'/][A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)*` |
| SPW (syllables per word) | rough Spanish vowel-group heuristic | Same syllable counter |
| LanguageTool `es` | agreement, spelling, typography, style rules | Public API `https://api.languagetool.org/v2/check`, chunked to ≤18k chars, throttled 4 s |
| Run-on >45w / long >32w | structural overload | Per-sentence word count |
| Missing terminal `.?!` | editing fragments | Last-char check |
| Inverted marks `¿`/`¡` | English calque | Pair-balance check |
| Unbalanced delimiters | cut/paste / markdown | Paren / bracket / quote balance |
| Repeated word | typo | Adjacent duplicate check |
| English-dominant sentence | residual EN titles | >70 % ASCII words AND no Spanish markers |
| Meta-leak (TODO/FIXME/etc.) | authoring residue | Case-insensitive regex |
| Gerund pile-up | generated style | ≥3 gerunds per sentence |
| Comma density | hypotaxis | ≥7 commas per sentence |
| Paragraph = one long sentence | no segmentation | 1 sentence AND >30 words |
| Anaphoric monotony | template rhythm | ≥3 sentences starting with same word |
| Space-before-punct / double-space | format noise | Regex |

### False-positive classes documented

1. **`meta_leak TODO`** matches Spanish "todo" — fix: case-sensitive `\bTODO\b`.
2. **`english_dominant`** on short Spanish fragments with all-ASCII words (e.g. "No imputa ni reordena.") — fix: lower the ASCII threshold or require sentence length ≥5 words.
3. **`repeated_word code code`** from markdown code-stripping (I replaced `` `code` `` blocks with the literal word `code`) — fix: replace with ` CODE_TOKEN ` and exclude from word counting.
4. **`unbalanced * `** from markdown `**bold**` markers — fix: strip markdown before counting.
5. **`missing_terminal`** on headings, titles, MCQ options, edge cases, criteria — fix: only apply to prose paragraphs, not to short-label fields.
6. **LanguageTool `MORFOLOGIK_RULE_ES`** on Python/pandas identifiers (`cliente_id`, `monto`, `merge`, `groupby`, etc.) — filter out.
7. **LanguageTool `VOSEO`** on pandas parameter `validate` — filter out.
8. **LanguageTool `WHITESPACE_RULE`** and `COMMA_PARENTHESIS_WHITESPACE` triggered by markdown `code` insertion artifacts — these are pre-existing in the source text (double spaces around inline code) but mostly render fine.

---

**This is the complete Explorer report for Section 17. Ready for the Fixer prompt.**
