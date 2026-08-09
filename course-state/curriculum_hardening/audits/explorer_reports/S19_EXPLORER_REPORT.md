# S19 Explorer Report — Visualización y comunicación accesible

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Scope:** Section 19 only (no fixes applied)  
**Generated:** 2026-07-24  
**Sources inspected:**
- Live curriculum index: https://pillb.github.io/pyarcana/ (Sección 19 · Viz accesible)
- Repo section TS: `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s19-databases-orm.ts`
- Exam bank: `/Users/pabloillescas/Projects/PyArcana/prisma/seed.ts` → `QUESTION_BANK['databases-orm']`
- Inventory: `/Users/pabloillescas/Projects/PyArcana/course-state/s19_phase6_validation.json`
- Residual metrics: `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/residual_score_v2.json`
- Paragraph dossier: `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/paragraph_analysis/S19_PARAGRAPHS.md`
- Gold comparison: `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s02-basics.ts`, connective S18 map
- External pedagogy: Wilke *Fundamentals of Data Visualization*, WCAG 2.x a11y for charts, Data-to-Viz chart choice, Harvard / UW / A11y Collective accessible viz guidance

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Section index | **19** |
| Platform id (hash) | `databases-orm` |
| Live URL | https://pillb.github.io/pyarcana/ → Sección 19 |
| Source file | `src/lib/course/sections/s19-databases-orm.ts` |
| Title (student) | Visualización y comunicación accesible |
| shortTitle | Viz accesible |
| Tagline | cuatro gráficos estáticos y una vista interactiva, todos con conclusión limitada a evidencia y versión no visual equivalente |
| Level / phase / hours | Competente · phase 1 · 19 h |
| Capstone thread | CP-N2-B (dashboard) → S20 Excel factory → S21 reportes |
| Inventory (phase-6) | 8 subtopics · 8 demos · 24 weDo · 24 exam MCQ · youDo + selfCheck present |
| Residual tier | `partial` (kb≈43.5, thin_heads=5, avg_para≈106.6) |
| Prior STORM expert_rank | 9.55 (dossier automated; **this Explorer re-scores independently**) |

**Subtopic graph (nodes):**

| ID | Heading (as authored) | Focus |
|----|----------------------|--------|
| map | De “Bases de Datos y ORMs” a visualización accesible (mapa) | Retarget V3 / scope |
| S19-T1-A | pregunta, audiencia y chart choice | Chart choice |
| S19-T1-B | ejes, escalas y encodings honestos | Truncated axes |
| S19-T2-A | Matplotlib / Seaborn | Static figures |
| S19-T2-B | composición, annotations y exportación | Multi-panel + export |
| S19-T3-A | Plotly / filtros / tooltips (modelo de datos) | Interactive **spec** |
| S19-T3-B | estado, performance y alternativas accesibles | a11y parity |
| S19-T4-A | unidades, fuente y limitaciones | Captions |
| S19-T4-B | color, contraste, texto alternativo y no sobreclaim | Ethics of claims |

**Out of scope for this run:** edits to TS/product code; sections other than 19 (except comparative references).

---

## 2. Executive Summary of Quality

### Score: **6.4 / 10**

### Verdict

S19 has a **coherent ethical core** aligned with best-in-class visualization literacy: chart choice driven by question/audience, zero-baseline honesty for absolute bars, caption provenance (unidad/fuente/limitación), numeric parity chart↔tabla, and anti-overclaim language for executive dashboards in a Peruvian synthetic KPI context (Lima/Cusco/Arequipa, PEN). The **structural skeleton** of I Do / We Do / You Do is complete (8×1 demos, 8×3 exercises, 8×3 exam concepts), and the bridge S18 EDA → S19 viz → S20/S21 reporting is narratively correct.

However, **student-facing quality is dragged down by three systemic failures**:

1. **Meta-leak / migration theater** — students are told the section is not SQLAlchemy/ORM, that id `databases-orm` is “conservado”, and that “material legado” was reubicado. That is developer documentation, not pedagogy.
2. **Exercise factory pattern** — almost every weDo instruction **spoils the exact solution**, uses English meta (“oráculo”, “Pass (salida exacta)”), and reduces “transfer” to flipping a constant. This breaks gradual release of responsibility for a 19 h *Competente* section whose tagline promises four real static charts + interactive view.
3. **Claim vs practice gap** — LOs and headings advertise Seaborn and Plotly; demos barely touch Seaborn and never run Plotly; practice is mostly dict/string contracts, not figure composition craft at Wilke/Knaflic depth.

Relative to gold-standard early sections (e.g. S02), S19 is **thinner in explanatory prose**, weaker in starter scaffolding for You Do, and more polluted by V3 retarget callouts. Residual tier `partial` and thin_heads=5 match this Explorer judgment better than the automated STORM 9.55.

**Key strengths:** honesty gates, a11y parity, Perú synthetic framing, progressive T1→T4 order, exam bank conceptually aligned.  
**Key blockers for “gold”:** strip meta-leaks; despoil exercises; deepen weDo/youDo to real figure work; Spanish headings + glosses; align icon/id narrative; fix instruction/output mismatches.

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker for student trust · **P1** high pedagogical damage · **P2** medium quality · **P3** polish.

| # | Sev | Dimension | Location | Evidence (quote / observation) | Pedagogical impact |
|---|-----|-----------|----------|--------------------------------|--------------------|
| 1 | P0 | Meta-leak | `jobRelevance` | «Esta sección (id `databases-orm` conservado) retematiza a V3 **Visualización…**» | Student sees platform plumbing; breaks immersion and implies course is unfinished retarget. |
| 2 | P0 | Meta-leak | Theory map P1 | «En V3, **S19 no es el path de SQLAlchemy/ORM de bases de datos** (reubicado). El id `databases-orm` se conserva…» | Cognitive load spent on curriculum archaeology, not chart literacy. |
| 3 | P0 | Meta-leak | Map callout | title «Contenido reubicado conceptualmente»; content «Material legado de ORM/DB de este archivo **no es el camino V3 en S19**» | Explicit developer note in user-facing UI. |
| 4 | P0 | Meta-leak / consistency | `id`, `icon` | `id: "databases-orm"`, `icon: "Database"` while title is viz | Live card / deep-links / mental model mismatch; Database icon contradicts “Viz accesible”. |
| 5 | P1 | Exercise quality | All 24 weDo `instruction` | Template: «Completa el TODO del starter sin borrar el oráculo; … Pass (salida exacta del solution): `…`» and often embeds full solution code | Zero productive struggle; spoils answer; “oráculo” is internal grader jargon. |
| 6 | P1 | Exercise quality | E1–E3 pattern | Starters are “DEFECT: change one literal”; transfer tasks rarely require design judgment | Does not build chart authorship skill promised by tagline (4 figures + interactive). |
| 7 | P1 | Spec mismatch | S19-T1-A-E3 instruction vs `solutionCode.output` | Instruction pass text: `` `line \| bar` ``; actual output is two lines `line` then `bar` | False failures / confusion when students match documented contract. |
| 8 | P1 | Spec mismatch | S19-T4-B-E2 | Pass: `` `True \| True` ``; solution prints two lines; body uses tautology `"n=" in alt or "n=" in alt.replace("n=", "n=")` | Teaches nothing; brittle nonsense check. |
| 9 | P1 | Spec mismatch | S19-T2-A-E3 expected | `` `{'n_bars': 2, 'ylim0': np.float64(0.0)}` `` | `np.float64` repr is version/backend dependent; students without numpy echo may fail. |
| 10 | P1 | Truncated instructions | S19-T3-A-E1, S19-T3-B-E3 | Fixture text cuts mid-expression: `if r[\"region\"] .` / `for r.` | Unprofessional; increases load; shows copy-paste generation artifact. |
| 11 | P1 | Cognitive load / progressive disclosure | Theory map + LOs | Opens with ORM negation before defining chart vocabulary; no “diccionario de la sección” like S02 | Compared to gold S02 map (terms first), S19 front-loads migration noise. |
| 12 | P1 | Claim vs practice | T2-A heading “Matplotlib / Seaborn”; exam concept `matplotlib-seaborn` | No Seaborn demo/exercise; only optional note in resources | Exam asks Seaborn role without instructional cycle (I→We→You). |
| 13 | P1 | Claim vs practice | T3-A “Plotly / filtros…”; exam `plotly-filters-tooltips` | Content correctly models **spec without Plotly**, but heading/exam say Plotly | Misleading promise; students may try to install/run Plotly and feel section is incomplete. |
| 14 | P1 | You Do under-scaffolded | `youDo.starterCode` | Only builds a 3-row DataFrame and `print(df)`; comment “4 figuras + alt/caption + tabla” | Gap between 19 h portfolio promise and starter; weak transfer from weDo micro-drills. |
| 15 | P1 | Rubric meta | `youDo.rubric[0]` | «Alineación al gate V3 de la sección» (25%) | Student does not know “gate V3”; criterion should be viz/a11y domain-specific. |
| 16 | P2 | Redaction ES | Subtopic headings | lowercase starts: «pregunta, audiencia…», «ejes, escalas…», «composición, annotations…» | Unprofessional Spanish titles; “annotations” not “anotaciones”. |
| 17 | P2 | EN/ES density | Theory throughout | chart choice, encodings, baseline, dual-axis, tooltip, viewport, a11y, overclaim without gloss | Acceptable for APIs; excessive for conceptual terms when audience is es-PE. |
| 18 | P2 | Feedback mono-culture | All weDo `feedback` | «Compara tu salida con la solución.» | No concept-specific remediation (why bar vs line, why baseline 0). |
| 19 | P2 | Hints thin | Most `hints` | Two short phrases («Dict literal.», «print.») | Guided practice without process cues; violates We Do spirit. |
| 20 | P2 | Starter pollution | Nearly all starters | trailing `print('ok', True)` while solutions omit it | Students must discover to remove or fail exact-output graders. |
| 21 | P2 | Theory depth | T1–T4 paragraphs | Solid contracts but thin craft: almost no bar ordering, horizontal vs vertical, faceting, colorblind palettes worked in code | Below Wilke / Storytelling with Data depth referenced in resources. |
| 22 | P2 | Resources mismatch | `resources.courses` | CS50P, MIT 6.100L, Coursera P4E, “Awesome Python Learning” | Not viz/a11y courses; weak alignment with section topic. |
| 23 | P2 | Connective tissue | Map ↔ S18 | S18 ends EDA/uncertainty; S19 assumes medians by region but does not restate “hallazgo ≠ decisión” with a worked chart example from S18 numbers | Mild seam gap for narrative continuity. |
| 24 | P2 | SelfCheck formatting | last selfCheck item | Extra blank line / brace spacing before 5th question | Minor render/maintainability issue. |
| 25 | P2 | Iconography / branding | `accentColor` | Same blue–indigo gradient as many phase-1 siblings | Low differentiation for “viz” skill in UI. |
| 26 | P3 | External roadmap drift | `learning_roadmap.md` (repo, not live card) | Still «Databases & ORM» for section 19 | Confuses contributors; live site card is correct (“Viz accesible”). |
| 27 | P3 | Accessibility practice gap | T4-B theory | Mentions contrast & non-color channels but no exercise measuring contrast ratio or hatch patterns | a11y taught as slogans more than craft. |
| 28 | P3 | Performance claim | T3-B | Sampling 5k/50k mentioned once; no exercise | Thin vs exam question on Plotly performance. |
| 29 | P3 | Demo environment | All iDo | Correct `Agg` backend — good — but never `savefig` real path in demos | Export contract is mostly dict theater. |
| 30 | P3 | Phase-6 blind spot | `s19_phase6_validation.json` | `issues_found: []`, authorized close | Structural inventory green-lights content that still fails student-facing quality (meta + spoiler). |

**Issue count (registry rows): 30** (several may share one Fixer diff group).

---

## 4. Meta-Leak Report

Exact student-visible (or near-student-visible) developer / migration text:

### 4.1 High-severity leaks (must not ship as pedagogy)

| # | Location | Exact leaked text |
|---|----------|-------------------|
| M1 | `jobRelevance` | `id \`databases-orm\` conservado` · `retematiza a V3` |
| M2 | Theory map heading | `De “Bases de Datos y ORMs” a visualización accesible (mapa)` |
| M3 | Theory map paragraph 1 | `En V3, **S19 no es el path de SQLAlchemy/ORM de bases de datos** (reubicado). El id \`databases-orm\` se conserva…` |
| M4 | Map callout title | `Contenido reubicado conceptualmente` |
| M5 | Map callout body | `Material legado de ORM/DB de este archivo **no es el camino V3 en S19**. Target: viz accesible para CP-N2-B (dashboard).` |
| M6 | You Do rubric | `Alineación al gate V3 de la sección` |
| M7 | Resources courses note | `curso desplegado; V3 S19 viz CP-N2-B` |

### 4.2 Process / grader jargon (medium — leaks internal harness into student instructions)

| # | Location | Exact leaked pattern |
|---|----------|----------------------|
| M8 | All weDo instructions | `Completa el TODO del starter sin borrar el oráculo` |
| M9 | All weDo instructions | `Pass (salida exacta del solution): …` |
| M10 | All starters | `# CASO-LIM-019 · …` + `# DEFECT: …` (acceptable as lab case **if** framed for students; currently paired with spoiler solutions) |
| M11 | Some starters | `# Contrato: corrige el DEFECT; salida = solutionCode` |

### 4.3 Structural identity leak (not prose, but user-visible identity)

| # | Location | Leak |
|---|----------|------|
| M12 | Section `id` | `databases-orm` |
| M13 | Section `icon` | `Database` |

**meta_leak_count (distinct items M1–M13): 13**

**Fixer guidance:** Rewrite map as **student-facing section dictionary** (pregunta, audiencia, encoding, baseline, alt text, paridad) without mentioning ORM/SQLAlchemy/legado/V3/id conservation. Keep platform id stable in code if required, but **never surface it** in `jobRelevance`/theory. Change icon to a chart glyph if UI allows without breaking routes.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research (domain pedagogy)

External consensus used as quality bar:

- **Chart choice by data question** (Data-to-Viz; Wilke amounts chapter): bars for categorical amounts, start at zero for length encodings of absolute magnitudes; prefer clear order and horizontal bars for long labels.
- **Honest encodings** (Wilke; Knaflic): truncated axes inflate differences; dual axes frequently mislead; annotate without replacing data table.
- **Accessible viz** (WCAG 1.4.1 / 1.4.11; Harvard HUIT; UW AccessTech; A11y Collective): do not use color alone; provide textual/table equivalents; descriptive alt text with key takeaway + n/period; sufficient contrast for graphical objects.
- **Gradual release (I/We/You Do):** demonstration → guided practice with fading support → independent portfolio with authentic complexity.
- **Cognitive load:** progressive disclosure; define jargon; avoid dual-task of “learn viz + decode curriculum migration”.

S19 **aligns strongly** with honesty + a11y principles at the *message* level. It **under-delivers** on craft practice and **violates** gradual release via spoiled exercises.

### 5.2 Connective tissue & narrative flow

**Upstream (S18):** EDA with uncertainty, hallazgo vs decisión, synthetic regional tickets — good lead-in. S19 should explicitly reuse one S18-style finding (“mediana por región, n, limitación web”) and **show** it as a figure+caption+alt pack. Currently the link is asserted in map P2 (“alimentarán el reporting factory”) more than demonstrated.

**Downstream (S20–S21):** Clear: versioned PNG + captions travel to Excel factory and DOCX/PDF. Export dict (`fmt`, `dpi`, `panels`) is a good contract node.

**Internal order T1→T4:** Excellent progressive disclosure of *topics*. Weak progressive disclosure of *skill difficulty* (exercises stay trivial across E1/E2/E3).

### 5.3 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Medium-high | 8 demos, one per subtopic; good Agg usage; why-lines short but present. Still mostly print contracts; little visual judgment narration. |
| **We Do** | Low | Structure 8×(guided/independent/transfer) exists, but **transfer is fake**; instructions spoil; feedback generic; starters polluted with `print('ok', True)`. |
| **You Do** | Medium-low | Right portfolio title (Dashboard CP-N2-B) and requirements list; starter and rubric too generic/meta; no acceptance tests or sample figure checklist beyond bullet requirements. |
| **Autocheck / exam** | Medium-high | SelfCheck 5 items on core ethics; exam 24 MCQ covers 8 concepts. Plotly/Seaborn items overshoot teaching. |

### 5.4 Cognitive load

- **Intrinsic load:** appropriate for intermediate viz (encodings, a11y, claims).
- **Extraneous load:** high — V3/ORM migration, English jargon clusters, spoiler walls of instruction text, truncated fixtures.
- **Germane load:** undermined — students optimize for matching `Pass (salida exacta)` instead of designing charts.

### 5.5 Redaction (Peruvian Spanish)

- Tone is mostly professional es-PE mixed with technical English (acceptable for library APIs).
- Failures: uncapitalized headings; “annotations”; denseness of EN conceptual nouns; “oráculo/solution/Pass”.
- Grammar is generally correct; issues are **register and editorial consistency**, not gross orthography.

### 5.6 Comparison with gold (S02) and external materials

| Criterion | S02 gold | S19 | External (Wilke / a11y) |
|-----------|----------|-----|-------------------------|
| Opening dictionary of terms | Yes | No (migration map instead) | N/A |
| Paragraph depth | High worked examples | Medium contracts | High visual examples |
| Exercise authenticity | Real parse tasks | Literal flips | Redesign bad charts |
| a11y | N/A | Principles strong, practice thin | Table+alt mandatory |
| Meta-leak | Some V3 but clearer student map | Heavy ORM/V3 | None |

### 5.7 Graph memory (quality edges)

```
S18_EDA_uncertainty --supports--> S19_chart_choice
S19_honest_axes --gates--> S19_static_export
S19_static_export --feeds--> S20_excel / S21_reports
S19_a11y_parity --gates--> CP-N2-B_portfolio
META_databases-orm_id --conflicts--> student_mental_model_viz
SPOILER_instructions --breaks--> weDo_gradual_release
EXAM_plotly_seaborn --overclaims--> theory_coverage
```

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in Explorer run. Paths relative to repo root.

### Diff group A — Strip meta-leaks (Issues 1–3, M1–M7)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@ jobRelevance
- "En equipos de analytics y reporting en Perú, una **visualización accesible y honesta** es el puente entre EDA y decisiones. Esta sección (id `databases-orm` conservado) retematiza a V3 **Visualización y comunicación accesible** para el incremento **CP-N2-B (dashboard)** con Matplotlib y tablas alternativas.",
+ "En equipos de analytics y reporting en Perú, una **visualización accesible y honesta** es el puente entre el EDA y las decisiones. Aquí construyes el incremento **CP-N2-B (dashboard)**: charts con ejes honestos, figuras Matplotlib exportables, tooltips/filtros modelados y alternativas no visuales con los mismos números.",

@@ theory map heading + paragraphs + callout
- heading: "De “Bases de Datos y ORMs” a visualización accesible (mapa)",
+ heading: "Mapa de la sección: visualización y comunicación accesible",
- "En V3, **S19 no es el path de SQLAlchemy/ORM de bases de datos** (reubicado). El id `databases-orm` se conserva, pero el estudiante construye **visualización y comunicación accesible** ..."
+ "**Diccionario breve:** *pregunta analítica* (qué decisión habilita), *audiencia* (ejecutivo vs analista), *encoding* (canal visual: posición, longitud, color), *baseline* (origen del eje), *alt text* (equivalente no visual), *paridad* (mismos números en chart y tabla). Construyes visualización accesible para el dashboard ejecutivo de CP-N2-B."
- title: "Contenido reubicado conceptualmente",
- content: "Material legado de ORM/DB ..."
+ title: "Fuera de alcance en S19",
+ content: "No profundizamos en ORMs ni modelado SQL aquí. El foco es chart choice, ejes honestos, export reproducible y a11y para CP-N2-B. Solo datos sintéticos.",

@@ youDo.rubric[0]
- { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+ { criterion: "Charts honestos (baseline, unidades) + alt/tabla con paridad numérica", weight: "25%" },
```

### Diff group B — Icon / identity UX (Issue 4, M12–M13)

```diff
--- a/src/lib/course/sections/s19-databases-orm.ts
+++ b/src/lib/course/sections/s19-databases-orm.ts
@@
- icon: "Database",
+ icon: "BarChart3",  // or "LineChart" — any chart glyph supported by the icon set
```

*Note:* Keep `id: "databases-orm"` if routes/progress depend on it; never print that id in student prose.

### Diff group C — Exercise instruction template (Issues 5–6, M8–M9)

Replace the universal instruction boilerplate across all 24 exercises:

```diff
- "E1 (guiado) — Concepto: … Fixture `…` / datos sintéticos: <SPOILER CODE>. Completa el TODO del starter sin borrar el oráculo; imprime el resultado del contrato. Pass (salida exacta del solution): `bar`.",
+ "E1 (guiado) — El comité quiere **comparar** ticket mediano entre regiones. El starter elige un chart inadecuado. Corrige la elección y muestra solo el tipo de chart resultante.",
```

- Move exact expected output to **grader-only** fields (`tests` / `solutionCode.output`), not student instruction.
- Remove «oráculo» / «solution» from student-facing strings.
- For transfer (E3), require a small design decision without pasting the full function body in the instruction.

### Diff group D — Fix broken contracts (Issues 7–10, 8)

```diff
--- S19-T1-A-E3 instruction pass text
- Pass ...: `line | bar`
+ (remove pass text from instruction; keep solution output as two lines)

--- S19-T4-B-E2 solutionCode
- alt = "Lima 28 PEN n=40"
- print("n=" in alt or "n=" in alt.replace("n=", "n="))
- print("n=" in "Lima 28 PEN n=40")
+ alt = "Lima 28 PEN n=40"
+ print("n=" in alt)

--- S19-T2-A-E3 solution meta
- out = {"n_bars": len(values), "ylim0": ax.get_ylim()[0]}
+ out = {"n_bars": len(values), "ylim0": float(ax.get_ylim()[0])}
# expected: {'n_bars': 2, 'ylim0': 0.0}

--- S19-T3-A-E1 / S19-T3-B-E3 instructions
# Rewrite complete sentences without mid-token truncation.
```

### Diff group E — Deepen We Do craft (Issues 6, 12–13, 21, 27)

Representative replacement for one transfer exercise (T2-A-E3) — pattern to replicate:

```diff
# Goal: build_figure(df) -> checks: ylim0==0, ylabel contains PEN, n_bars==3
# Starter: broken ylim + missing ylabel
# Solution: full minimal honest bar chart with labels Lima/Arequipa/Cusco
```

- Add **one** Seaborn-styled example *or* drop Seaborn from heading/exam.
- Rename T3-A heading to «Vista interactiva (modelo de filtros y tooltips)» and reword exam concept slug labels accordingly *or* add a tiny Plotly optional appendix.

### Diff group F — You Do scaffold (Issues 14–15)

```diff
--- youDo.starterCode
+ """
+ CP-N2-B — Dashboard accesible (esqueleto)
+ Entrega mínima:
+  1) fig_bar_medianas.png — barras, ylim 0, ylabel PEN, n en caption
+  2) fig_bar_volumen.png — n por región
+  3) fig_line_tendencia.png — serie semanal sintética
+  4) fig_scatter_n_vs_median.png — relación n–mediana
+  5) vista_logica.json — filtro + tooltip template
+  6) tabla_paridad.csv + alt_*.txt por figura
+ """
+ def build_bar_median(df):
+     ...
+ def caption(meta: dict) -> str:
+     ...
+ def alt_text(df, hallazgo: str) -> str:
+     ...
```

Rubric criteria (domain):

1. Honest axes + units (25%)  
2. Four static + one interactive spec (20%)  
3. Alt/tabla parity (20%)  
4. Captions fuente/limitación (15%)  
5. No sobreclaim (10%)  
6. Código legible / sin PII (10%)

### Diff group G — Redaction headings & feedback (Issues 16–19)

```diff
- heading: "pregunta, audiencia y chart choice",
+ heading: "Pregunta, audiencia y elección de gráfico",
- heading: "ejes, escalas y encodings honestos",
+ heading: "Ejes, escalas y encodings honestos",
- heading: "composición, annotations y exportación",
+ heading: "Composición, anotaciones y exportación",
- heading: "Plotly / filtros / tooltips (modelo de datos)",
+ heading: "Filtros, tooltips y vista interactiva (modelo de datos)",

# feedback examples
- feedback: "Compara tu salida con la solución.",
+ feedback: "Si elegiste línea o pie, recuerda: comparar magnitudes entre pocas categorías se lee mejor en barras con baseline 0.",
```

### Diff group H — Starter hygiene (Issue 20)

```diff
# Remove from all weDo starters:
- print('ok', True)
```

### Diff group I — Resources (Issue 22)

```diff
# Prefer viz-focused courses/docs already partially present:
# keep Wilke, Knaflic, WCAG, Data-to-Viz, Matplotlib tutorials
# demote or remove generic CS50P/MIT/P4E as primary "courses" for S19
# add e.g. UW AccessTech dataviz, Storytelling with Data exercises
```

### Diff group J — SelfCheck polish (Issue 24)

Normalize brace/spacing on the 5th selfCheck question object to match the first four.

---

## 7. Recommended Priority Order for Fixing

| Priority | Diff group / issues | Rationale |
|----------|---------------------|-----------|
| **1** | A — Meta-leaks (1–3, M1–M7) | Trust & first-screen quality; zero learning value |
| **2** | C — Despoil weDo instructions (5–6, M8–M9) | Restores We Do as practice, not copy-pass |
| **3** | D — Broken contracts (7–10) | Prevents false fails and nonsense solutions |
| **4** | B — Icon identity (4) | UI coherence with “Viz accesible” |
| **5** | H — Starter `print('ok')` (20) | Cheap exact-output hygiene |
| **6** | F — You Do scaffold + rubric (14–15) | Aligns 19 h portfolio with tagline |
| **7** | E — Deepen craft / Seaborn–Plotly honesty (12–13, 21, 27) | Closes claim–practice gap |
| **8** | G — Headings & feedback ES (16–19) | Professional redaction |
| **9** | I + J — Resources & selfCheck (22, 24) | Polish |
| **10** | 23, 25–26, 28–30 | Connective example, branding, roadmap note, phase-6 criteria upgrade |

**Suggested acceptance criteria after Fixer:**

1. Zero student-visible strings: `V3`, `reubicad`, `legado`, `databases-orm`, `oráculo`, `gate V3`, `SQLAlchemy` (unless a true historical footnote is intentionally designed — prefer omit).  
2. No weDo instruction contains the full solution or `Pass (salida exacta)`.  
3. At least 4 weDo items require creating/closing a Matplotlib figure with a measurable visual contract (`ylim`, `ylabel`, titles).  
4. You Do starter lists the four figures + interactive spec with function stubs.  
5. Headings capitalized; T3 not promising Plotly unless taught.  
6. All solution outputs stable (`float()` not `np.float64` repr).

---

## 8. Graph Memory Update notes

For shared context / future agents:

```yaml
section: 19
id: databases-orm
file: src/lib/course/sections/s19-databases-orm.ts
title: Visualización y comunicación accesible
explorer_score: 6.4
residual_tier: partial
storm_expert_rank_prior: 9.55  # treat as inflated; Explorer overrides
issue_count: 30
meta_leak_count: 13
status_for_fixer: ready

quality_nodes:
  keep:
    - honest_baseline_for_absolute_bars
    - caption_unidad_fuente_limitacion
    - chart_table_numeric_parity
    - anti_overclaim_muestra_vs_peru
    - synthetic_peru_kpi_lima_cusco_arequipa
    - progressive_T1_to_T4_topic_order
    - exam_bank_8x3_concept_coverage
  fix:
    - strip_V3_ORM_migration_prose
    - despoil_weDo_instructions
    - deepen_weDo_youDo_figure_craft
    - align_seaborn_plotly_claims_with_teaching
    - spanish_heading_capitalization
    - icon_Database_to_chart
  edges:
    - S18_EDA -> S19_viz -> S20_excel -> S21_reports
    - S19_export_meta -> S21_docx_pdf_provenance
  do_not:
    - change_platform_id_without_migration_plan
    - reintroduce_SQLAlchemy_as_S19_path

fixer_entrypoints:
  - src/lib/course/sections/s19-databases-orm.ts
  - prisma/seed.ts (QUESTION_BANK databases-orm)  # only if renaming Plotly/Seaborn concepts
```

**Comparative note for multi-section memory:** S18–S21 share the same “id conservado / retematiza a V3 / Contenido reubicado” map pattern; Fixer patterns for S19 should be reusable as a template for sibling sections, but **this report only authorizes analysis of S19**.

---

## Dimension checklist (required coverage)

| # | Dimension | Covered in |
|---|-----------|------------|
| 1 | Meta-text / developer leakage | §4, issues 1–4, M1–M13 |
| 2 | Grammatical correctness & redaction (es-PE) | §5.5, issues 16–17, Diff G |
| 3 | Connective tissue & narrative flow | §5.2, issue 23 |
| 4 | Pedagogical structure I/We/You Do | §5.3, issues 5–6, 14–15 |
| 5 | Cognitive load & progressive disclosure | §5.4, issue 11 |
| 6 | Exercise & exam quality/alignment | §3 issues 5–13, 18–20; exam notes §5.3 |
| 7 | Consistency with roadmap & previous sections | §1, §5.2, issues 4, 23, 26 |
| 8 | Comparison with best-in-class external materials | §5.1, §5.6, Wilke/WCAG/Data-to-Viz |
| 9 | Other (clarity, motivation, a11y, accessibility of resources) | issues 21–22, 27–29 |

---

This is the complete Explorer report for Section 19. Ready for the Fixer prompt.
