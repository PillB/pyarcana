# Section 16 Audit Report — "Calidad, limpieza y contratos de datos"

**Task ID:** S16
**Auditor:** Curriculum Auditor (general-purpose)
**Source file:** `src/lib/course/sections/s16-wxpython-gui.ts` (1,677 lines)
**Live URL:** https://pillb.github.io/pyarcana/#wxpython-gui
**Live H1 (confirmed via agent-browser):** "Calidad, limpieza y contratos de datos"
**Sidebar slot 16:** "Calidad y contratos"
**Phase:** 1 (Competente) · 18 h · level Competente · icon ShieldCheck
**Capstone gate:** CP-N2-A (quality gate)

---

## 1. Section Identification & Scope

Section 16 is the **second** section of Phase 1 (Competente) and the **16th** slot in the
active 52-section course array (`src/lib/course/index.ts:15`). The active source is
`src/lib/course/sections/s16-wxpython-gui.ts` (no inactive sibling file).

**Topic rescoping signal:** `docs/CROSS_REFERENCE_REPORT.md:191` ("### S16. GUI Desktop con
wxPython") reveals the original S16 was about wxPython GUIs. The current implementation is a
complete rescope to a **pandas-based data-quality gate** ("Calidad, limpieza y contratos de
datos"), but the file name, `id` field, live URL hash, and the interactive `Pruébalo tú mismo`
demo all still say "wxpython-gui". This is the central defect class of the section.

**Scope audited (all five learner-facing tabs):**
1. **Teoría** — 8 TheoryBlocks (T1-A Nulls, T1-B Indicators, T2-A Exact vs Conflict, T2-B Key
   evidence, T3-A Normalization, T3-B Outliers, T4-A Schema/Cross-field, T4-B Metrics & Audit).
2. **Yo hago (I Do)** — 8 demos (one per subtopic) with prose `description` and `why`.
3. **Hacemos juntos (We Do)** — 24 exercises (3 per subtopic: guided E1 → independent E2 →
   transfer E3) with starter/solution code, hints, edgeCases, tests, feedback.
4. **Tú haces (You Do)** — Capstone "Quality gate explicable ante schema drift" with context,
   objectives, requirements, starterCode, portfolioNote, rubric.
5. **Autocheck (selfCheck)** — 8 MCQs with question, 4 options, correctIndex, explanation.

**Not audited (out of scope per subplan):** `resources` arrays (only `note` and `label` strings,
already counted), the code bodies of `code`/`starterCode`/`solutionCode` (excluded by subplan),
glossary term rendering.

---

## 2. Executive Summary of Quality

**Composite score: 6.5 / 10** (would be 8.5–9 after P0+P1 fixes).

**Verdict:** Pedagogically the section is **excellent** — one of the strongest I Do / We Do /
You Do scaffolds in the course (1:3:1 mapping across 8 subtopics = 24 exercises + 8 demos + 1
capstone). The fail-closed philosophy, audit-trail discipline, and PEN locale contract are
best-in-class. **However, two P0 defects drag the score down sharply:**

1. **The interactive `Pruébalo tú mismo` demo teaches wxPython GUI button callbacks** while the
   section is about pandas data quality gates — a complete topic mismatch on the most engaging
   learner surface (SectionView.tsx:1526-1577). Same defect class as S06 ("numpy" id loading
   NumPy editor code into a NumPy-forbidden section).
2. **File name / `id` / URL hash all say "wxpython-gui"** for a Calidad-y-contratos section.
   The live URL `https://pillb.github.io/pyarcana/#wxpython-gui` is a structural meta-leak that
   surfaces the rescoping history to any learner who reads the URL bar.

A third P0 — **markdown rendering bug** — affects `jobRelevance`, three `weDo.instruction`
fields, and the entire `youDo.context` (which contains a markdown table that renders as a wall
of pipe-separated text instead of a table). This is the same systemic issue S06 reported; it is
the single most damaging defect for the capstone brief.

**Spanish grammar metrics (heuristic extractor + LanguageTool `es`):**
- 207 prose records → 349 sentences → 3 781 words → 7 511 syllables
- Mean WPS: **10.83** (target ~15–32; healthy)
- Mean SPW: **1.99** (normal)
- Aggregate Fernández-Huerta: **76.6** ("bastante fácil")
- Aggregate INFLESZ: **72.2** ("bastante fácil")
- Run-ons >45 w: **13** (P1)
- Long >32 w: 12 (M)
- Genuine grammar findings (after false-positive filtering): **~6** (DNIs, vs., comma-pero,
  candidatan, sale en fallo, audit-trail gloss missing)
- Meta-leak findings: **0** in prose (no TODO/FIXME/moved-from); **3 structural** (id, file
  name, demo).

**Strengths:**
- Exemplary I Do / We Do / You Do fidelity (8 × 3 = 24 exercises + 8 demos + capstone)
- Strong backward (S15) and forward (S17) connective tissue
- Consistent CP-N2-A capstone thread
- Robust fail-closed / audit-trail pedagogy aligned with industry (Great Expectations, McKinsey
  data-quality dimensions)
- Concrete synthetic Peru data (Lima/Arequipa/Cusco, `S/`, `C00x` ids)
- Strong ethical guardrails (no PII real, no DNIs, no arreglos silenciosos)
- PEN locale contract (comma decimal vs miles) is genuinely useful and well-explained
- Excellent domain-bound vs stat-outlier distinction
- 8 self-check MCQs with explanations and feedback loops
- You Do assertion is robust (`m["pass"] is False` on the fixture)

---

## 3. Detailed Issue Registry

Numbered, with severity (H/M/L), evidence quote, and pedagogical impact.

### Critical (P0)

#### Issue 1 — Identity meta-leak: file name / id / URL hash all say "wxpython-gui" for a Calidad-y-contratos section
- **Severity:** H (structural meta-leak)
- **Evidence:**
  - `src/lib/course/sections/s16-wxpython-gui.ts:4` → `id: "wxpython-gui"`
  - `src/lib/course/index.ts:15` → `import { section16 } from './sections/s16-wxpython-gui'`
  - Live URL: `https://pillb.github.io/pyarcana/#wxpython-gui`
  - Live H1 (confirmed via agent-browser): "Calidad, limpieza y contratos de datos"
  - Sidebar slot 16 text: "Calidad y contratos"
  - `docs/CROSS_REFERENCE_REPORT.md:191` → "### S16. GUI Desktop con wxPython"
- **Pedagogical impact:** Any learner who reads the URL bar, the file path (when contributing),
  or the deep-link hash sees "wxpython-gui" — an off-topic identity that contradicts the section
  title. The rescoping history is leaked to the learner. This is the same defect class reported
  for S05 (`id:"oop"` on a Functions section), S06 (`id:"numpy"` on a NumPy-forbidden section),
  S08 (`id:"pandas"` on an ETL section), S10 (`id:"sklearn"` on a packaging section), S11
  (`id:"testing"` on an OOP section), S12 (`id:"performance"` on an APIs/SQL section) —
  systemic across the curriculum.

#### Issue 2 — `Pruébalo tú mismo` interactive demo is completely off-topic (teaches wxPython GUI callbacks)
- **Severity:** H (pedagogical derailment)
- **Evidence:** `src/components/course/SectionView.tsx:1526-1577` — the `'wxpython-gui'` key in
  the `demos` map loads this code:

  ```python
  # Simulacion de eventos GUI (sin wxPython en Pyodide)
  # Concepto: como funcionan los callbacks de eventos

  class Button:
      """Simula un boton de GUI con event binding."""
      def __init__(self, name):
          self.name = name
          self.callback = None
      def bind(self, event_type, callback):
          """Vincula un callback a un evento (como wx.EVT_BUTTON)."""
          ...
      def click(self):
          """Simula un clic del usuario."""
          ...

  btn_saludar = Button("btn_saludar")
  btn_salir = Button("btn_salir")
  def on_saludar(event=None):
      print("    -> Hola desde el boton saludar!")
  def on_salir(event=None):
      print("    -> Cerrando aplicacion...")
  btn_saludar.bind("EVT_BUTTON", on_saludar)
  btn_salir.bind("EVT_BUTTON", on_salir)
  print("Simulando clics:")
  btn_saludar.click()
  btn_salir.click()
  ```
- **Title of demo (rendered above the editor):** "Practica eventos y callbacks (simulado)"
- **Hint:** "Anade un tercer boton con su propio callback y haz clic en el"
- **Pedagogical impact:** The most engaging surface in the section (a runnable Pyodide
  playground) teaches a topic that is **completely unrelated** to the section's quality-gate
  content. Learners who click "Pruébalo tú mismo" expecting to experiment with `isna()`,
  `drop_duplicates()`, IQR, or schema drift instead see a Button class with `EVT_BUTTON`
  events. This actively undermines the section's learning outcomes. Secondary issues inside the
  demo:
  - Missing Spanish accents: "Simulacion", "boton", "aplicacion", "Anade" (4 instances)
  - English-only code comments: "event binding", "event handlers"
  - Mixed English verbs in docstrings: "Simula un boton", "Vincula un callback"
  - No connection to the quality-gate / pandas topic of the section

#### Issue 3 — Markdown rendering bug: `jobRelevance`, `weDo.instruction`, `youDo.context`, etc. rendered as raw JSX without `<RichText>`
- **Severity:** H (visible defect on multiple tabs)
- **Evidence:** `src/components/course/SectionView.tsx` renders several learner-facing fields as
  raw `{field}` JSX instead of routing them through the `<RichText>` component (which parses
  `**bold**`, `` `inline code` ``, and markdown tables):
  - Line 189: `<p>{section.jobRelevance}</p>`
  - Line 215: `<span>{lo.text}</span>` (learning outcomes)
  - Line 224: `<p>{section.tagline}</p>`
  - Line 438: `<span>{step.description}</span>` (iDo)
  - Line 453: `<p>{step.why}</p>` (iDo)
  - Line 491: `<span>{step.instruction}</span>` (weDo) ← **3 instructions use `**bold**`**
  - Line 503: `{step.hint}` (weDo)
  - Line 571: `{step.feedback}` (weDo)
  - Line 577: `{step.tests}` (weDo)
  - Line 608: `<h3>{project.title}</h3>` (youDo)
  - Line 614: `<p>{project.context}</p>` (youDo) ← **contains markdown table**
  - Line 649: `{project.portfolioNote}`
  - Line 665: `<td>{r.criterion}</td>` (rubric)
  - Line 692: `<h4>{te.title}</h4>` (resources)
  - Line 787: `<p>{q.question}</p>` (selfCheck)
  - Line 845: `{q.explanation}` (selfCheck)
- **Fields that contain markdown in S16:**
  - `jobRelevance` (line 15) — `**quality gates explicables**`, `**CP-N2-A**`, `**fail-closed**`
  - `weDo.steps[].instruction`:
    - Line 597 (T1-A-E1): `campo **required**`
    - Line 954 (T2-B-E2): `conserva **todas** las columnas`
    - Line 1052 (T3-A-E2): `si hay **solo coma**`
  - `youDo.context` (line 1470) — `**Tabla de aceptación mínima (fixture del starter):**` +
    markdown table with 4 rows of `|` pipes + 7 inline `` `code` `` references
- **Pedagogical impact:** Learners see literal asterisks (`**required**`) instead of bold text
  in three We Do instructions and the entire "Por qué importa" paragraph. The capstone brief
  (`youDo.context`) — the most important instruction in the section — renders as a wall of
  pipe-separated text instead of a table, making the acceptance criteria hard to scan.
  (Confirmed as systemic by S06's audit; same root cause.)

### High (P1)

#### Issue 4 — Run-on sentences (13 sentences >45 words)
- **Severity:** H (cognitive load)
- **Worst offenders (with FH score):**
  1. `youDo.context` prose (line 1470) — **141 w**, FH ≈ 12 ("muy difícil")
  2. `jobRelevance` (line 15) — **89 w**, FH ≈ 24 ("muy difícil") — entire block is one
     sentence because there is no terminal period between the two paragraphs in source
  3. `theory[0].paragraphs[0]` (line 30) — **84 w**, FH ≈ 24 ("muy difícil") — "En S15
     leíste clientes y transacciones con dtypes controlados. Imagina el lunes siguiente:
     alguien hace `monto.fillna(0)` "para que no falle el job"…" (counts as 1 sentence due
     to bullet-like continuation)
  4. `theory[T3-A].paragraphs[1]` (line 197) — **62 w**, FH ≈ 30 — "Contrato de montos PEN
     sintéticos: quita `S/`; si hay coma y punto, el punto es miles y la coma es decimal…"
  5. `theory[T4-A].paragraphs[1]` (line 295) — **56 w**, FH ≈ 35 — "Ante schema drift
     (desviación de esquema: columna required faltante o renombrada), el gate falla con el
     nombre de la columna — no con un `KeyError` opaco al final del pipeline…"
  6. `weDo[S16-T4-B-E1].instruction` (line 1352) — **56 w**, FH ≈ 35
  7. `theory[0].paragraphs[1]` (line 31) — **55 w**, FH ≈ 38 — "Regla de oro: nunca
     'arreglar' silenciosamente. Toda transformación deja métrica…"
  8. `theory[T3-A].paragraphs[2]` (line 198) — **49 w**, FH ≈ 40
  9. `theory[0].paragraphs[2]` (line 32) — **50 w**, FH ≈ 42 — "Orden pedagógico: T1
     Ausencia (required/optional, indicadores, cap de imputación) → T2 Duplicados…"
  10. `theory[T1-A].paragraphs[2]` (line 47) — **47 w**, FH ≈ 45
  11. `weDo[S16-T1-A-E1].instruction` (line 597) — **52 w**, FH ≈ 38
  12. `youDo.context` table (line 1470) — **64 w** as a single "sentence" — extractor
      artifact, but the table itself is too dense
  13. `youDo.context` prose sentence 2 (line 1470) — **46 w**, FH ≈ 40
- **Pedagogical impact:** Many of these are theory-block opening paragraphs or capstone
  instructions where cognitive load matters most. Split into 2–3 sentences each.

#### Issue 5 — Anglicism "DNIs" (sigla with plural 's')
- **Severity:** M (orthography)
- **Evidence:** Line 31 — "nunca PII real ni DNIs de personas."
- **Rule:** LanguageTool `SIGLAS` — Spanish siglas are invariable for number.
- **Fix:** "nunca PII real ni DNI de personas."

#### Issue 6 — "vs" without period (15 occurrences)
- **Severity:** M (orthography)
- **Rule:** LanguageTool `PUNTO_EN_ABREVIATURAS` — "vs." is the abbreviation of "versus".
- **Occurrences** (all in S16 source):
  - Line 30: "duplicados vs conflictos"
  - Line 32: "exactos vs conflictos"
  - Line 119 (heading): "Duplicados exactos vs conflictos"
  - Line 124: "Cusco vs Arequipa"
  - Line 256 (heading): "Outliers plausibles vs errores"
  - Line 259: "error vs flag"
  - Line 397: "Required vs optional"
  - Line 430: "duplicados exactos vs conflictos"
  - Line 450: "Clasificar exacto vs conflicto"
  - Line 514: "outlier estadístico vs error"
  - Line 675: "no es fail-closed: llena viol desde isna"
  - Line 777: "mean vs median"
  - Line 781: "Clasifica con nunique de región"
  - Line 873: "exact vs conflict vs clean"
  - Line 881: "Lima vs Cusco"
  - Line 885: "exact vs conflict vs clean"
  - Line 885: "exact vs conflict vs clean"
- **Fix:** Replace `\bvs\b` → `vs.` (15 instances).

#### Issue 7 — Missing comma before "pero" (1 occurrence)
- **Severity:** M (orthography)
- **Rule:** LanguageTool `COMMA_PERO`.
- **Evidence:** Line 47 — "la tasa de null de email se reporta como métrica pero no tumba el
  gate por sí sola."
- **Fix:** "…se reporta como métrica, pero no tumba el gate por sí sola."

#### Issue 8 — Invented anglicism verb "candidatan"
- **Severity:** M (redaction)
- **Evidence:** Line 259 — "IQR/z-score solo **candidatan**; el dominio de negocio
  **decide** error vs flag."
- **Cause:** Calque of English "to candidate" (i.e., to mark as a candidate). "Candidatar"
  exists in Portuguese but is not standard Spanish in this sense.
- **Fix:** "IQR/z-score solo identifican candidatos; el dominio de negocio decide error vs.
  flag." (or: "IQR/z-score solo marcan candidatos…")

#### Issue 9 — Heavy code-mixing in prose paragraph (line 335)
- **Severity:** M (redaction)
- **Evidence:** Line 335 — "Caso: 2 filas in, 1 clean, 1 quarantine por `null_required_monto`;
  audit con evento quarantine. `metrics.pass` es false."
- **Cause:** Mixing English preposition "in" and English words "clean" / "quarantine" in
  Spanish prose. The reader has to mentally translate "in" → "de entrada" and "clean" →
  "limpia".
- **Fix:** "Caso: 2 filas de entrada, 1 limpia, 1 en cuarentena por `null_required_monto`; el
  audit registra un evento quarantine. `metrics.pass` es false."

#### Issue 10 — "sale en fallo" anglicism (calque of "exits with failure")
- **Severity:** M (redaction)
- **Evidence:**
  - Line 31 — "publica métricas y sale en fallo."
  - Line 333 — "Un fail **sin métricas** no se puede operar en un job nocturno ni explicar…"
- **Cause:** "Sale en fallo" is a calque of "exits with failure". Spanish verbs don't take
  "en" + state noun in this construction.
- **Fix:** "publica métricas y termina con error (exit code ≠ 0)."

### Medium (P2)

#### Issue 11 — "append-only" never glossed (5 occurrences)
- **Severity:** M (vocabulary)
- **Evidence:** Lines 31, 157, 334, 565, 1418 — "audit trail append-only", "lista append-only
  de eventos", "audit trail append-only" (iDo description).
- **Fix:** Gloss at first use (line 31): "audit trail (rastro de auditoría append-only — solo
  se agregan eventos, nunca se modifican ni borran)".

#### Issue 12 — "el set limpio" anglicism (3 occurrences)
- **Severity:** L (style)
- **Evidence:** Lines 32, 158, 476 — "El set limpio alimenta los joins…"
- **Cause:** "Set" is anglicism for "conjunto" (data-set sense).
- **Fix:** "El conjunto limpio alimenta los joins…" (or "El dataset limpio…").

#### Issue 13 — "warn o fail" used as bare verbs in Spanish sentence
- **Severity:** M (redaction)
- **Evidence:** Line 295 — "Columnas extra pueden warn o fail según política documentada en el
  runbook del job."
- **Cause:** English verbs "warn" and "fail" used directly in Spanish prose without
  conjugation/glossing.
- **Fix:** "Columnas extra pueden emitir warn o fallar según política documentada en el runbook
  del job."

#### Issue 14 — "audit" as bare noun in Spanish sentence
- **Severity:** L (style)
- **Evidence:**
  - Line 158 — "El audit permite reconstruir por qué se eligió una versión…"
  - Line 335 — "audit con evento quarantine."
  - Line 597 — "audit con evento quarantine."
- **Cause:** "Audit" used as Spanish noun instead of "audit trail" or "registro de auditoría".
- **Fix:** "El audit trail permite reconstruir…" or "El registro de auditoría permite
  reconstruir…".

#### Issue 15 — "Un fail sin métricas" — fail as Spanish noun
- **Severity:** L (style)
- **Evidence:** Line 333 — "Un fail **sin métricas** no se puede operar…"
- **Fix:** "Un fallo sin métricas no se puede operar…"

#### Issue 16 — Inconsistent ordering "Caso sintético Perú" vs "Caso Perú sintético"
- **Severity:** L (consistency)
- **Evidence:**
  - Line 47: "Caso sintético Perú: `cliente_id` y `monto` required…"
  - Line 198: "Caso Perú sintético: regiones con espacios/`LIM`…"
- **Fix:** Pick one canonical form (recommend "Caso sintético Perú") and apply throughout.

#### Issue 17 — "el job" anglicism (6 occurrences)
- **Severity:** L (style)
- **Evidence:** Lines 15, 30, 31, 333, 295, 675.
- **Cause:** "Job" is industry-standard in data engineering, but never glossed.
- **Fix:** Gloss at first use (line 15): "el job (tarea programada)" or use "proceso" /
  "tarea".

#### Issue 18 — "+ métricas" informal plus symbol in prose
- **Severity:** L (style)
- **Evidence:** Line 15 — "deja un set limpio + métricas para S17."
- **Fix:** "deja un conjunto limpio y métricas para S17."

#### Issue 19 — Acronyms not glossed at first use (PII, EDA, KPI)
- **Severity:** L (accessibility)
- **Evidence:**
  - "PII" (lines 15, 31, 1470, 1486, 1530) — never expanded.
  - "EDA" (lines 45, 261) — never expanded.
  - "KPI" (line 30) — never expanded.
- **Fix:** At first use, add parenthetical: "PII (Personally Identifiable Information / datos
  personales identificables)", "EDA (análisis exploratorio de datos)", "KPI (indicador clave
  de desempeño)".

#### Issue 20 — "KeyError opaco" — "opaco" as calque of "opaque"
- **Severity:** L (redaction)
- **Evidence:** Line 295 — "no con un `KeyError` opaco al final del pipeline."
- **Cause:** "Opaco" exists in Spanish but for errors we'd say "incomprensible" or "sin
  mensaje claro".
- **Fix:** "no con un `KeyError` sin mensaje claro al final del pipeline."

#### Issue 21 — "Para las sondas" — calque of "probes"
- **Severity:** L (style)
- **Evidence:** Line 1201 — "Para las sondas `[5000, -1, 10]`:"
- **Cause:** "Sondas" as direct calque of English "probes". "Para los valores de prueba" or
  "Para los puntos de prueba" would be more natural Spanish.
- **Fix:** "Para los valores de prueba `[5000, -1, 10]`:"

#### Issue 22 — Tagline starts lowercase
- **Severity:** L (style)
- **Evidence:** Line 8 — `tagline: "suite de calidad que falla de forma explicable ante schema
  drift, cuantifica pérdida y nunca arregla silenciosamente un dato"`
- **Fix:** Capitalize first letter: "Suite de calidad que falla de forma explicable ante
  schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato".

### Pedagogical (PED)

#### Issue 23 — We Do E3 transfer exercises use "starter prints wrong answer" pattern
- **Severity:** L (pedagogical note — actually a strength, but worth flagging the pattern)
- **Evidence:** All E3 transfer exercises have starter code that prints a hardcoded wrong
  answer (e.g., `print("pass")` instead of computing from data). Examples: lines 684 (E1-A-E3
  prints "pass"), 1004 (E2-B-E3 prints "card_ok"), 1218 (E3-B-E3 prints `["ok","ok","ok"]`),
  1335 (E4-A-E3 prints "schema_ok"), 1453 (E4-B-E3 prints `n_q > 0` which is wrong).
- **Impact:** This is a strong pedagogical pattern (forces the learner to identify the bug
  rather than write from scratch). No fix required; flagged for the comparative-quality agent.

#### Issue 24 — You Do assertion could be tighter
- **Severity:** L (assessment rigor)
- **Evidence:** Lines 1521-1522 — `assert m["rows_in"] == len(df)` is trivially satisfied by
  any reasonable implementation. The assertion `assert m["pass"] is False` is the only
  substantive check.
- **Fix:** Add `assert m["rows_quarantine"] >= 2, "El fixture debe poner al menos 2 filas en
  cuarentena (null + conflicto + domain_error)"` to catch under-quarantining.

#### Issue 25 — Self-check Q6 has a weak distractor
- **Severity:** L (assessment quality)
- **Evidence:** Lines 1574-1578 — Q6 asks about "3,00" with options ["300.0 (coma de miles)",
  "3.0 (decimal latino)", "None (inválido)", "3,00 como string sin parsear"]. The 4th option
  ("3,00 como string sin parsear") is too obviously wrong; it's a non-answer.
- **Fix:** Replace with a stronger distractor like "30.0 (coma decimal, punto ignorado)" or
  "0.30 (coma como separador de fracción)".

#### Issue 26 — Self-check Q1 has an implausible distractor
- **Severity:** L (assessment quality)
- **Evidence:** Lines 1539-1541 — Q1 option "Convertirse a string vacío" is implausible (no
  one converts null required to empty string).
- **Fix:** Replace with "Imputarse con la moda del campo" or "Marcar como `unknown` en otra
  columna".

---

## 4. Meta-Leak Report

### Direct authoring residue in learner-facing Spanish prose
**None found.** Search of the source for `TODO|FIXME|XXX|HACK|moved from|never surface|no
surface|placeholder|V3 retarget|inner instruction|En V[23]|sección \d+ era` returned zero
hits. The section's prose is clean of authoring notes.

### Structural / scope-shift meta-leaks (3)

| # | Type | Location | Leaked text | Severity |
|---|------|----------|-------------|----------|
| ML-1 | URL hash | Browser address bar | `#wxpython-gui` | H |
| ML-2 | File name | `src/lib/course/sections/s16-wxpython-gui.ts` | `s16-wxpython-gui.ts` | H |
| ML-3 | Interactive demo | `SectionView.tsx:1526` keyed by `'wxpython-gui'` | Title "Practica eventos y callbacks (simulado)"; code teaches wxPython `Button` class, `EVT_BUTTON`, "btn_saludar", "btn_salir" | H |

### Secondary meta-leak (markdown rendering)
The `**bold**` markers in `jobRelevance` (Theory tab "Por qué importa"), 3 `weDo.instruction`
fields (Hacemos juntos tab), and `youDo.context` (Tú haces tab) render as literal asterisks
because those fields are rendered as raw JSX (see Issue 3). The markdown table in
`youDo.context` renders as literal `|` pipes. Same systemic defect reported by S06.

### Pedagogical-internal identifiers visible to learners
- `subtopicId` (e.g., `"S16-T1-A"`) is NOT rendered to learners — confirmed via grep of
  `SectionView.tsx` (the `subtopicId` field is metadata only). No leak.
- `demoId` (e.g., `"S16-T1-A-DEMO"`) is used only as a `data-testid` (line 431), not visible
  text. No leak.
- Exercise `id` (e.g., `"S16-T1-A-E1"`) — verified, not rendered. No leak.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos, one per subtopic):** Excellent 1:1 mapping. Each demo has a `description`
(imperative one-liner), a `why` (one-sentence rationale), and a complete code+output pair.
Verified all 8 code blocks execute correctly per the `output` field (manual trace). Pattern is
consistent: synthetic data → pandas operation → print result. The fail-closed pattern is shown
in demos T1-B (cap blocks imputation), T4-A (drift detection), T4-B (audit trail).

**We Do (24 exercises = 8 subtopics × 3 levels E1/E2/E3):** Exemplary scaffold.
- **E1 guided:** Provides a buggy starter, two conceptual hints, edge cases, and feedback.
  Pattern: starter prints wrong output; learner identifies and fixes the bug.
- **E2 independent:** Slightly less guidance; same defect-pattern starter.
- **E3 transfer:** Transfer of concept to a slightly different scenario (e.g., from a single
  column to a multi-column policy, from IQR to domain+IQR combination).
- Every exercise has a `solutionCode` with `output` for oracle comparison.
- Every exercise has a `tests` string ("salida coincide con solution output") — a simple but
  consistent oracle model.

**You Do (capstone):** Single project "Quality gate explicable ante schema drift" with:
- `context` (line 1470): 4-row markdown table of acceptance criteria (unfortunately rendered
  as raw text — see Issue 3).
- `objectives` (5 items): Clear, measurable, aligned with CP-N2-A.
- `requirements` (8 items): Concrete (function signature, dict keys, audit append-only, no
  PII, memo, gate alignment).
- `starterCode`: Full function skeleton with docstring contract, NotImplementedError, and a
  `__main__` block with assertions.
- `portfolioNote`: Honest note about JSON shape and S17 input contract.
- `rubric`: 6 weighted criteria (25% gate alignment, 20% correctness, 20% privacy, 15% edge
  cases, 10% code quality, 10% documentation).
- **Assertion robustness:** `assert m["pass"] is False` correctly captures the fail-closed
  contract. Could be tightened (see Issue 24).

**Self-check (8 MCQs):** Good coverage of all 8 subtopics. Each has explanation. Two weak
distractors (Issues 25, 26).

### 5.2 Cognitive load and progressive disclosure

**Strengths:**
- Each theory block follows a consistent 3-paragraph pattern: (1) concept, (2) contract /
  recipe, (3) synthetic Peru case. This reduces cognitive load.
- The "Regla de oro" callout (line 36-38) frames the section upfront.
- The "Mapa de la sección" theory block (T0) explicitly names the 4 subtopics and their
  order — strong progressive disclosure.
- Each callout reinforces one rule (Required no se rellena, Indicador > silencio, No
  drop_duplicates ciego, Evidencia completa, Raw al lado, No drops por IQR solo, Drift
  explicable, Métricas siempre).

**Weaknesses:**
- 13 run-on sentences (>45 w) in theory and instructions (Issue 4) increase cognitive load
  precisely where it matters most.
- The 4-row markdown table in `youDo.context` is rendered as a wall of pipe-separated text
  (Issue 3) — high cognitive load for the capstone brief.

### 5.3 Connective tissue and narrative flow

**Backward references:** S15 (ingesta tipada) — mentioned 4 times (lines 15, 30, 84). Clear
"Parte de la ingesta tipada de S15". Good.

**Forward references:** S17 (joins, portfolio) — mentioned 6 times (lines 15, 32, 124, 158,
197, 261, 335). Clear "El set limpio alimenta los joins y el portfolio de S17". Good.

**Capstone thread:** CP-N2-A mentioned 3 times (lines 15, 30, 124). Consistent alignment
with the capstone gate.

**Course roadmap alignment:** Phase 1 (Competente), slot 16, between S15 (Pandas ingesta) and
S17 (Joins · groupby · cierre). The data-quality topic fits naturally between ingesta and
joins — the clean set feeds the joins.

### 5.4 Consistency with overall roadmap

- Slot 14 = NumPy, slot 15 = Pandas ingesta, slot 16 = Calidad y contratos, slot 17 = Joins.
- The progression ingesta → calidad → joins is pedagogically sound.
- The `id` "wxpython-gui" is the only inconsistency — it's a leftover from the original
  Phase-1 plan (per `docs/CROSS_REFERENCE_REPORT.md:191`).

### 5.5 Comparison with best-in-class external materials

- **Great Expectations** (referenced in resources): GE uses declarative `expect_column_*`
  calls; S16 uses imperative pandas. S16's approach is more accessible at the Competente level
  and teaches the underlying mechanics. GE's declarative approach is mentioned only as
  "Inspiración de contratos y expectations" (line 1616).
- **McKinsey / DAMA-DMBOK data-quality dimensions**: S16 covers completeness (nulls),
  uniqueness (duplicates), consistency (normalization), validity (outliers + schema),
  accuracy (domain bounds), integrity (cross-field), and auditability (audit trail). Strong
  alignment with industry standard 7-dimension framework.
- **Real Python "Data Cleaning" course**: S16 covers similar territory but adds the
  fail-closed gate + audit trail + schema drift dimensions that Real Python doesn't emphasize.
  S16 is stronger for production-data-engineering contexts.
- **MIT 6.100L** (referenced in resources): Similar depth on outliers (IQR + domain). S16's
  emphasis on append-only audit trail is more practical for ops contexts.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrites

Method note: For each tab (Teoría, I Do, We Do, You Do, Autocheck), the worst paragraphs are
rewritten **before → after** with the specific grammar/style issues addressed. Only the
paragraphs with real defects are rewritten; clean paragraphs are noted as such.

### 6.1 Teoría tab

#### Theory[0] paragraph 1 (line 30) — 84 w run-on
**Before:**
> "En S15 leíste clientes y transacciones con dtypes controlados. Imagina el lunes siguiente:
> alguien hace `monto.fillna(0)` "para que no falle el job", el KPI de ticket promedio se infla
> y en la reunión de gerencia nadie puede decir **cuántas filas se inventaron**. En **S16**
> construyes el **quality gate de CP-N2-A** para que eso no pase: políticas de null, imputación
> limitada con indicadores, duplicados vs conflictos, normalización, outliers, contratos de
> schema/cross-field y cuarentena con audit trail (rastro de auditoría append-only)."

**After:**
> "En S15 leíste clientes y transacciones con dtypes controlados. Imagina el lunes siguiente:
> alguien hace `monto.fillna(0)` "para que no falle el job", el KPI de ticket promedio se infla
> y, en la reunión de gerencia, nadie puede decir **cuántas filas se inventaron**.
>
> En **S16** construyes el **quality gate de CP-N2-A** para que eso no pase. Abarca seis
> frentes: políticas de null, imputación limitada con indicadores, duplicados vs. conflictos,
> normalización, outliers y contratos de schema/cross-field — todo respaldado por una
> cuarentena con audit trail (rastro de auditoría append-only: solo se agregan eventos, nunca
> se modifican ni borran)."

**Fixes applied:**
- Split 84-word run-on into 2 paragraphs / 3 sentences
- Added comma before "en la reunión de gerencia" (parenthetical)
- `vs` → `vs.` (P1)
- Glossed "append-only" parenthetically (P2)

#### Theory[0] paragraph 2 (line 31) — 55 w run-on, anglicism "sale en fallo", "DNIs"
**Before:**
> "Regla de oro: **nunca "arreglar" silenciosamente**. Toda transformación deja métrica,
> indicador o fila en cuarentena. **Fail-closed** = si el contrato se rompe, el job **no**
> aprueba en silencio: publica métricas y sale en fallo. Datos sintéticos de clientes y montos
> (regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x`); nunca PII real ni DNIs de
> personas."

**After:**
> "Regla de oro: **nunca "arreglar" en silencio**. Toda transformación deja una métrica, un
> indicador o una fila en cuarentena. **Fail-closed** significa que, si el contrato se rompe,
> el job **no** aprueba en silencio: publica métricas y termina con error (exit code ≠ 0).
> Los datos son sintéticos — regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x` — y nunca
> incluyen PII (datos personales identificables) reales ni DNI de personas."

**Fixes applied:**
- "arreglar silenciosamente" → "arreglar en silencio" (more natural adverbial)
- "sale en fallo" → "termina con error (exit code ≠ 0)" (P2)
- "DNIs" → "DNI" (P1, SIGLAS rule)
- Glossed PII at first use (P2)
- "Datos sintéticos de clientes y montos (regiones Lima/Arequipa/Cusco, prefijos `S/`, ids
  `C00x`); nunca PII real ni DNIs" → smoother flow

#### Theory[0] paragraph 3 (line 32) — 50 w run-on, "vs" x2
**Before:**
> "Orden pedagógico: **T1 Ausencia** (required/optional, indicadores, cap de imputación) →
> **T2 Duplicados** (exactos vs conflictos, evidencia de clave) → **T3 Normalización**
> (strings/números/fechas/categorías, outliers) → **T4 Contratos** (schema, cross-field,
> métricas y audit). Solo pandas + stdlib de S01–S16. El set limpio alimenta los joins y el
> portfolio de **S17**."

**After:**
> "Orden pedagógico:
>
> 1. **T1 Ausencia** — required/optional, indicadores y cap de imputación.
> 2. **T2 Duplicados** — exactos vs. conflictos y evidencia de clave.
> 3. **T3 Normalización** — strings, números, fechas y categorías; outliers.
> 4. **T4 Contratos** — schema, cross-field, métricas y audit.
>
> Solo pandas + stdlib de S01–S16. El conjunto limpio alimenta los joins y el portfolio de
> **S17**."

**Fixes applied:**
- Converted 50-word run-on into a numbered list (cognitive load reduction)
- `vs` → `vs.` (×2)
- "set limpio" → "conjunto limpio" (P2)

#### Theory[T1-A] paragraph 3 (line 47) — 47 w, missing comma before "pero"
**Before:**
> "Caso sintético Perú: `cliente_id` y `monto` required; `email` optional. Filas con id o
> monto nulo entran a violaciones; la tasa de null de email se reporta como métrica pero no
> tumba el gate por sí sola. Imprime `violations` y `null_rate` de opcionales en el reporte
> del run."

**After:**
> "Caso sintético Perú: `cliente_id` y `monto` son required; `email` es optional. Las filas
> con id o monto nulo entran a `violations`; la tasa de null de email se reporta como métrica,
> pero no tumba el gate por sí sola. Imprime `violations` y el `null_rate` de los opcionales en
> el reporte del run."

**Fixes applied:**
- Comma before "pero" (P1, COMMA_PERO rule)
- Smoother verb agreement ("son required", "es optional")
- "del run" → "del run" (acceptable; "run" is industry term but could gloss)

#### Theory[T3-A] paragraph 2 (line 197) — 62 w run-on, dense locale contract
**Before:**
> "Contrato de montos PEN sintéticos: quita `S/`; si hay **coma y punto**, el punto es miles
> y la coma es decimal (`1.250,5` → `1250.5`); si **solo coma**, es decimal latino (`3,00` →
> `3.0`); si **solo punto**, es decimal estilo anglosajón (`10.50` → `10.5`). Conserva **raw**
> en columna lateral (`region_raw`, `monto_raw`) cuando el valor canónico puede disputarse.
> Valida dtypes post-normalización **antes** del join de S17."

**After:**
> "Contrato de montos PEN sintéticos:
>
> 1. Quita el prefijo `S/`.
> 2. Si hay **coma y punto**, el punto es miles y la coma es decimal: `1.250,5` → `1250.5`.
> 3. Si hay **solo coma**, es decimal latino: `3,00` → `3.0`.
> 4. Si hay **solo punto**, es decimal anglosajón: `10.50` → `10.5`.
>
> Conserva el **raw** en una columna lateral (`region_raw`, `monto_raw`) cuando el valor
> canónico pueda disputarse. Valida los dtypes después de normalizar y **antes** del join de
> S17."

**Fixes applied:**
- 62-word run-on → numbered list (cognitive load)
- "estilo anglosajón" → "anglosajón" (slightly tighter)
- "post-normalización" → "después de normalizar" (more natural Spanish)

#### Theory[T3-B] paragraph 1 (line 259) — invented verb "candidatan"
**Before:**
> "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio de negocio
> (monto alto legítimo en una campaña). Un **error de dominio** viola bounds (monto < 0, lat
> 999, edad 200). IQR/z-score solo **candidatan**; el dominio de negocio **decide** error vs
> flag."

**After:**
> "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio de negocio
> (por ejemplo, un monto alto legítimo en una campaña). Un **error de dominio** viola los
> bounds (monto < 0, lat 999, edad 200). IQR y z-score solo **identifican candidatos**; el
> dominio de negocio **decide** si es error o flag."

**Fixes applied:**
- "candidatan" → "identifican candidatos" (P1, no such verb in Spanish)
- "vs" → "o" (clearer disjunction here)
- "bounds" kept (acceptable industry term)
- "monto alto legítimo en una campaña" → "por ejemplo, un monto alto legítimo en una campaña"
  (clearer example marker)

#### Theory[T4-A] paragraph 2 (line 295) — 56 w run-on, "warn o fail" bare verbs, "KeyError opaco"
**Before:**
> "Ante **schema drift** (desviación de esquema: columna required faltante o renombrada), el
> gate falla con el **nombre** de la columna — no con un `KeyError` opaco al final del
> pipeline. Es el mismo espíritu fail-closed: el drift se hace visible al operador. Columnas
> extra pueden warn o fail según política documentada en el runbook del job."

**After:**
> "Ante **schema drift** (desviación de esquema: columna required faltante o renombrada), el
> gate falla con el **nombre** de la columna — no con un `KeyError` sin mensaje claro al final
> del pipeline. Es el mismo espíritu fail-closed: el drift se hace visible al operador. Las
> columnas extra pueden emitir `warn` o fallar, según la política documentada en el runbook
> del job."

**Fixes applied:**
- "opaco" → "sin mensaje claro" (P3)
- "warn o fail" → "emitir `warn` o fallar" (P2)
- "Columnas extra" → "Las columnas extra" (article)
- Kept "fail-closed", "schema drift", "runbook" (industry-standard)

#### Theory[T4-B] paragraph 2 (line 334) — heavy code-mix, "audit trail append-only"
**Before:**
> "Cuarentena = tabla de filas rechazadas + razón codificada. **Audit trail** = lista
> append-only de eventos (`ingest`, `quarantine`, `promote`). El gate publica el reporte aunque
> `pass=False` (exit code ≠ 0 acompañado de JSON de métricas)."

**After:**
> "La cuarentena es una tabla de filas rechazadas con la razón codificada. El **audit trail**
> es una lista append-only de eventos (`ingest`, `quarantine`, `promote`): solo se agregan
> eventos, nunca se modifican ni borran. El gate publica el reporte aunque `pass=False` (exit
> code ≠ 0 acompañado de un JSON de métricas)."

**Fixes applied:**
- "Cuarentena = tabla" → "La cuarentena es una tabla" (more natural Spanish)
- Glossed "append-only" inline (P2)
- "+" → "con" (formal prose)

#### Theory[T4-B] paragraph 3 (line 335) — heavy code-mix
**Before:**
> "Caso: 2 filas in, 1 clean, 1 quarantine por `null_required_monto`; audit con evento
> quarantine. `metrics.pass` es false. S17 solo debe consumir `clean` y el memo debe declarar
> cuántas filas quedaron fuera del universo analítico."

**After:**
> "Caso: 2 filas de entrada, 1 limpia, 1 en cuarentena por `null_required_monto`; el audit
> trail registra un evento `quarantine`. El campo `metrics.pass` es `false`. S17 solo debe
> consumir el set `clean`, y el memo debe declarar cuántas filas quedaron fuera del universo
> analítico."

**Fixes applied:**
- "2 filas in" → "2 filas de entrada" (P1)
- "1 clean, 1 quarantine" → "1 limpia, 1 en cuarentena" (P1)
- "audit con evento quarantine" → "el audit trail registra un evento `quarantine`" (P2)
- "false" → "`false`" (inline code for clarity)

### 6.2 I Do tab (Yo hago)

The I Do tab has `intro` (rendered via RichText, line 426) and 8 `step.description` + 8
`step.why` (rendered as raw JSX, lines 438 and 453).

#### iDo.intro (line 371) — 31 w, code-mix
**Before:**
> "Ocho demos de un solo hilo: un batch sintético de clientes PE pasa por null policy,
> imputación con cap, dups/conflictos, evidencia, normalización PEN, outliers, schema/cross-
> field y métricas+audit. Observa el patrón fail-closed en cada paso."

**After:**
> "Ocho demos de un solo hilo: un batch sintético de clientes PE pasa por null policy,
> imputación con cap, duplicados y conflictos, evidencia, normalización PEN, outliers,
> schema/cross-field y métricas con audit. Observa el patrón fail-closed en cada paso."

**Fixes applied:**
- "dups/conflictos" → "duplicados y conflictos" (more readable; "dups" is jargon)
- "métricas+audit" → "métricas con audit" (P2, no `+` in prose)

#### iDo.step.why for T1-A (line 397) — clean
> "Required vs optional se traduce en fail/cuarentena vs continuar."
- **Fix:** `vs` → `vs.` (P1).

#### iDo.step.why for T2-A (line 450) — clean
> "Clasificar exacto vs conflicto cambia la acción de limpieza."
- **Fix:** `vs` → `vs.` (P1).

#### iDo.step.why for T3-B (line 534) — clean
> "Dominio manda sobre IQR para etiquetar error."
- Clean; no fix needed.

#### iDo.step.why for T4-A (line 559) — clean
> "Schema + cross-field forman el contrato del quality gate."
- **Fix:** `+` → `y` (P2).

### 6.3 We Do tab (Hacemos juntos)

#### weDo.intro (line 590) — clean
> "24 ejercicios (E1 guiado → E2 independiente → E3 transferencia) por subtema del gate. Cada
> starter trae un error de lógica a corregir; dos pistas conceptuales. No imprimas éxito a
> ciegas: el oracle es la métrica o etiqueta correcta."
- Clean. No fix needed.

#### weDo[S16-T1-A-E1].instruction (line 597) — 52 w run-on, `**required**` markdown leak
**Before:**
> "E1 (guiado) — Concepto: conteo de nulls en campo **required**. Fixture con `id` required y
> un null. Imprime dos valores: (1) conteo de nulls con `isna` y (2) la etiqueta `violates` si
> el conteo > 0, si no `ok`. Pass: `1 violates`. No imputes antes de contar; no uses `notna`
> para el conteo de ausencias."

**After:**
> "E1 (guiado) — Concepto: conteo de nulls en un campo **required**.
>
> El fixture tiene `id` required con un null. Imprime dos valores:
>
> 1. El conteo de nulls con `isna`.
> 2. La etiqueta `violates` si el conteo > 0; si no, `ok`.
>
> Pass: `1 violates`. No imputes antes de contar; no uses `notna` para el conteo de
> ausencias."

**Fixes applied:**
- Split 52-word run-on into a numbered list (cognitive load)
- Note: the `**required**` markdown will leak as literal asterisks until Issue 3 is fixed
  (rendered as raw JSX at SectionView.tsx:491).

#### weDo[S16-T2-B-E2].instruction (line 954) — `**todas**` markdown leak
**Before:**
> "E2 (independiente) — Concepto: evidencia en cuarentena. Filtra filas con clave `id`
> duplicada y conserva **todas** las columnas de evidencia (incluido `batch`). Imprime
> `q.columns.tolist()`. Pass: `['id', 'batch']`. No proyectes solo la clave: sin `batch` el
> auditor no reconstruye el origen."

**After (minor):**
> "E2 (independiente) — Concepto: evidencia en cuarentena. Filtra las filas con clave `id`
> duplicada y conserva **todas** las columnas de evidencia (incluida `batch`). Imprime
> `q.columns.tolist()`. Pass: `['id', 'batch']`. No proyectes solo la clave: sin `batch`, el
> auditor no reconstruye el origen."

**Fixes applied:**
- "Filas con clave" → "Las filas con clave" (article)
- "incluido `batch`" → "incluida `batch`" (`batch` is treated as feminine column here)
- Comma after "sin `batch`" (parenthetical)

#### weDo[S16-T3-A-E2].instruction (line 1052) — `**solo coma**` markdown leak, dense
**Before:**
> "E2 (independiente) — Concepto: parse de montos PEN con locale documentado. Fixture
> `['S/1.5','3,00']`: quita `S/`; si hay **solo coma**, es decimal latino (`3,00` → `3.0`), no
> miles. Suma e imprime float. Pass: `4.5`. No borres la coma a ciegas (`replace(',', '')`
> convertiría 3,00 en 300)."

**After:**
> "E2 (independiente) — Concepto: parseo de montos PEN con locale documentado.
>
> Fixture: `['S/1.5', '3,00']`. Quita el `S/`. Si hay **solo coma**, es decimal latino
> (`3,00` → `3.0`), no de miles. Suma los valores e imprime el float. Pass: `4.5`. No borres
> la coma a ciegas: `replace(',', '')` convertiría `3,00` en `300`."

**Fixes applied:**
- "parse" → "parseo" (hispanicized)
- "no miles" → "no de miles" (clearer)
- "Suma e imprime float" → "Suma los valores e imprime el float" (more natural)
- Note: `**solo coma**` will leak until Issue 3 is fixed.

### 6.4 You Do tab (Tú haces)

#### youDo.context (line 1470) — 141 w run-on + markdown table that won't render
This is the single most damaged field in the section. It's rendered as raw JSX
(SectionView.tsx:614), so:
1. `**Tabla de aceptación mínima (fixture del starter):**` displays as literal asterisks.
2. The 4-row markdown table displays as a wall of pipe-separated text.
3. The 7 inline `` `code` `` references display with literal backticks.

**Before (raw source):**
```
Implementa una suite de checks sobre un dataset sintético de clientes/transacciones (regiones
Lima/Arequipa/Cusco, montos PEN ficticios): null policies required/optional, duplicados exactos
vs conflictos con evidencia, normalización con raw lateral, outliers dominio+IQR, contratos
schema/cross-field, cuarentena y audit trail append-only. El set clean alimenta S17/CP-N2-A.
Fail-closed (si el contrato se rompe, el job no aprueba en silencio): nunca arregles un dato
sin métrica ni uses PII real.

**Tabla de aceptación mínima (fixture del starter):**
| Señal en el fixture | Qué debe detectar el gate | reason / efecto |
| --- | --- | --- |
| `cliente_id` null (fila 3) | null required | `null_required` → cuarentena; no fillna mágico |
| C001 con Lima y Cusco | conflicto de atributo | `conflict_region` (o similar); no `drop_duplicates` ciego |
| monto `-1.0` (C003) | error de dominio | `domain_error`; no borrar solo por IQR |
| Resultado del run | `metrics.pass == False` | JSON con rows_in / rows_clean / rows_quarantine |
```

**After (proposed rewrite — assumes the markdown rendering bug is fixed so the table renders
properly; if not, the table should be moved to a separate field that DOES go through
RichText):**
```
Implementa una suite de checks sobre un dataset sintético de clientes y transacciones (regiones
Lima/Arequipa/Cusco, montos PEN ficticios). La suite debe cubrir:

- null policies required/optional
- duplicados exactos vs. conflictos, con evidencia
- normalización con columna raw lateral
- outliers (dominio + IQR)
- contratos schema/cross-field
- cuarentena y audit trail append-only

El conjunto limpio alimenta S17/CP-N2-A. El gate es fail-closed: si el contrato se rompe, el
job no aprueba en silencio. Nunca arregles un dato sin métrica ni uses PII real.

**Tabla de aceptación mínima (fixture del starter):**

| Señal en el fixture            | Qué debe detectar el gate    | reason / efecto                                                      |
| ------------------------------ | ---------------------------- | ------------------------------------------------------------------- |
| `cliente_id` null (fila 3)     | null required                | `null_required` → cuarentena; no fillna mágico                      |
| C001 con Lima y Cusco          | conflicto de atributo        | `conflict_region` (o similar); no `drop_duplicates` ciego           |
| monto `-1.0` (C003)            | error de dominio             | `domain_error`; no borrar solo por IQR                              |
| Resultado del run              | `metrics.pass == False`      | JSON con `rows_in` / `rows_clean` / `rows_quarantine`               |
```

**Fixes applied:**
- 141-word run-on → bulleted list + 3 sentences (cognitive load)
- `vs` → `vs.` (P1)
- "El set clean" → "El conjunto limpio" (P2)
- "dominio+IQR" → "dominio + IQR" (whitespace) — or better, "dominio e IQR"
- Aligned markdown table for readability
- Note: still depends on Issue 3 being fixed for the table to render.

#### youDo.portfolioNote (line 1525-1526) — clean enough
> "El gate debe emitir métricas incluso cuando pass=False. Ejemplo de forma esperada del JSON:
> {"pass": false, "rows_in": 4, "rows_clean": …, "rows_quarantine": …}. El set clean (si lo
> publicas) es el único input válido para los joins y el portfolio de S17."
- **Fix:** `pass=False` → `` `pass=False` `` (inline code); "set clean" → "conjunto clean" or
  "conjunto `clean`" (P2).

### 6.5 Autocheck tab (selfCheck)

#### Q1 (line 1539) — clean
> "Un campo con política required que tiene nulls debe:"
- Clean. No fix.

#### Q1 option 3 (line 1540) — implausible distractor
> "Convertirse a string vacío"
- **Fix:** Replace with "Imputarse con la moda del campo" (stronger distractor).

#### Q5 (line 1567) — clean
> "Un quality gate que falla debe:"
- Clean.

#### Q6 (line 1574) — clean
> "En un contrato PEN sintético, el monto textual `3,00` (solo coma) se interpreta como:"
- Clean. Strong question.

#### Q6 option 4 (line 1575) — weak distractor
> "3,00 como string sin parsear"
- **Fix:** Replace with "30.0 (coma decimal, punto ignorado)".

#### Q8 (line 1588) — clean
> "Ante dos filas con el mismo cliente_id y regiones distintas, la acción correcta es:"
- Clean. Strong question.

#### Q8 explanation (line 1592) — clean
> "Conflicto de atributo ≠ duplicado exacto: borrar a ciegas elimina la evidencia. Cuarentena
> + audit permiten revisión humana."
- **Fix:** `+` → `y` (P2).

---

## 7. Proposed GitHub-style Diffs

### Diff D-1 (P0) — Fix identity meta-leak: rename file + change `id`
```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -13 +13 @@
-import { section16 } from './sections/s16-wxpython-gui'
+import { section16 } from './sections/s16-quality-gate'

--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-quality-gate.ts
@@ -1,0 +2 @@
+// (file renamed from s16-wxpython-gui.ts to reflect the actual topic)
@@ -3 +4 @@
-  id: "wxpython-gui",
+  id: "quality-gate",
```
Note: After rename, the live URL becomes `#quality-gate`. Coordinate with SectionView.tsx
demo key (Diff D-2) and any external links/deep links.

### Diff D-2 (P0) — Replace off-topic interactive demo with a pandas quality-gate demo
```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1526,51 +1526,55 @@
-    'wxpython-gui': {
-      title: 'Practica eventos y callbacks (simulado)',
-      code: `# Simulacion de eventos GUI (sin wxPython en Pyodide)
-# Concepto: como funcionan los callbacks de eventos
-
-class Button:
-    """Simula un boton de GUI con event binding."""
-    def __init__(self, name):
-        self.name = name
-        self.callback = None
-
-    def bind(self, event_type, callback):
-        """Vincula un callback a un evento (como wx.EVT_BUTTON)."""
-        self.callback = callback
-        print(f"  {self.name}: evento '{event_type}' vinculado")
-
-    def click(self):
-        """Simula un clic del usuario."""
-        if self.callback:
-            print(f"  {self.name}: CLICK detectado!")
-            self.callback()
-        else:
-            print(f"  {self.name}: sin callback vinculado")
-
-# Crear botones como en wxPython
-btn_saludar = Button("btn_saludar")
-btn_salir = Button("btn_salir")
-
-# Definir callbacks (event handlers)
-def on_saludar(event=None):
-    print("    -> Hola desde el boton saludar!")
-
-def on_salir(event=None):
-    print("    -> Cerrando aplicacion...")
-
-# Vincular eventos (como btn.Bind(wx.EVT_BUTTON, handler))
-btn_saludar.bind("EVT_BUTTON", on_saludar)
-btn_salir.bind("EVT_BUTTON", on_salir)
-
-# Simular clics
-print("Simulando clics:")
-btn_saludar.click()
-btn_salir.click()`,
-      expectedOutput: `  btn_saludar: evento 'EVT_BUTTON' vinculado
-  btn_salir: evento 'EVT_BUTTON' vinculado
-Simulando clics:
-  btn_saludar: CLICK detectado!
-    -> Hola desde el boton saludar!
-  btn_salir: CLICK detectado!
-    -> Cerrando aplicacion...`,
-      hint: 'Anade un tercer boton con su propio callback y haz clic en el',
+    'quality-gate': {
+      title: 'Practica políticas de null y cuarentena',
+      code: `# Mini quality gate: null required → cuarentena con razón
+# Concepto: fail-closed ante null_required
+
+import pandas as pd
+
+def run_quality_gate(df, schema):
+    """Aplica políticas de null por campo y devuelve métricas + cuarentena."""
+    violations = {}
+    for col, policy in schema.items():
+        if policy == "required":
+            n = int(df[col].isna().sum())
+            if n:
+                violations[col] = n
+    quarantine = df[df[list(violations)[0]].isna()].copy() if violations else df.iloc[0:0].copy()
+    if not quarantine.empty:
+        quarantine["reason"] = "null_required_" + list(violations)[0]
+    metrics = {
+        "rows_in": len(df),
+        "rows_clean": len(df) - len(quarantine),
+        "rows_quarantine": len(quarantine),
+        "pass": len(quarantine) == 0,
+    }
+    return metrics, quarantine
+
+# Fixture sintético Perú
+df = pd.DataFrame({
+    "cliente_id": ["C001", None, "C003"],
+    "monto": [10.0, 5.0, 8.0],
+})
+schema = {"cliente_id": "required", "monto": "required"}
+
+metrics, quarantine = run_quality_gate(df, schema)
+print("metrics:", metrics)
+print("quarantine:")
+print(quarantine.to_dict(orient="records"))`,
+      expectedOutput: `metrics: {'rows_in': 3, 'rows_clean': 2, 'rows_quarantine': 1, 'pass': False}
+quarantine:
+[{'cliente_id': None, 'monto': 5.0, 'reason': 'null_required_cliente_id'}]`,
+      hint: 'Añade una política "optional" para el campo email y verifica que no genere cuarentena',
     },
```

### Diff D-3 (P0) — Route raw JSX fields through `<RichText>`
```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -189 +189 @@
-                <p className="text-sm text-foreground/80">{section.jobRelevance}</p>
+                <RichText content={section.jobRelevance} sectionId={section.id} />
@@ -215 +215 @@
-                    <span className="text-xs text-foreground/90">{lo.text}</span>
+                    <RichText content={lo.text} sectionId={section.id} />
@@ -438 +438 @@
-              <span className="text-sm font-semibold">{step.description}</span>
+              <RichText content={step.description} sectionId={section.id} />
@@ -453 +453 @@
-              <p className="mt-1 text-sm text-foreground/80">{step.why}</p>
+              <RichText content={step.why} sectionId={section.id} />
@@ -491 +491 @@
-                <span className="text-sm font-semibold">{step.instruction}</span>
+                <RichText content={step.instruction} sectionId={section.id} />
@@ -503 +503 @@
-                  {step.hint}
+                  <RichText content={step.hint} sectionId={section.id} />
@@ -571 +571 @@
-                      {step.feedback}
+                      <RichText content={step.feedback} sectionId={section.id} />
@@ -577 +577 @@
-                      {step.tests}
+                      <RichText content={step.tests} sectionId={section.id} />
@@ -614 +614 @@
-            <p className="mt-1 text-sm text-foreground/80">{project.context}</p>
+            <RichText content={project.context} sectionId={section.id} />
@@ -649 +649 @@
-            {project.portfolioNote}
+            <RichText content={project.portfolioNote} sectionId={section.id} />
@@ -665 +665 @@
-                      <td className="px-3 py-2 text-foreground/80">{r.criterion}</td>
+                      <td className="px-3 py-2 text-foreground/80"><RichText content={r.criterion} sectionId={section.id} /></td>
@@ -692 +692 @@
-                  <h4 className="text-sm font-semibold">{te.title}</h4>
+                  <RichText content={te.title} sectionId={section.id} />
@@ -787 +787 @@
-                <p className="text-sm font-medium text-foreground">{q.question}</p>
+                <RichText content={q.question} sectionId={section.id} />
@@ -845 +845 @@
-                  {q.explanation}
+                  <RichText content={q.explanation} sectionId={section.id} />
```
Note: This is systemic across all sections (same fix proposed by S06). The `<RichText>`
component already supports `**bold**`, `` `inline code` ``, and markdown tables (see
`RichText.tsx:222-238`).

### Diff D-4 (P1) — Fix `DNIs` → `DNI`
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -31 +31 @@
-        "Regla de oro: **nunca "arreglar" silenciosamente**. Toda transformación deja métrica, indicador o fila en cuarentena. **Fail-closed** = si el contrato se rompe, el job **no** aprueba en silencio: publica métricas y sale en fallo. Datos sintéticos de clientes y montos (regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x`); nunca PII real ni DNIs de personas.",
+        "Regla de oro: **nunca "arreglar" en silencio**. Toda transformación deja una métrica, un indicador o una fila en cuarentena. **Fail-closed** significa que, si el contrato se rompe, el job **no** aprueba en silencio: publica métricas y termina con error (exit code ≠ 0). Los datos son sintéticos — regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x` — y nunca incluyen PII (datos personales identificables) reales ni DNI de personas.",
```

### Diff D-5 (P1) — Fix all `vs` → `vs.`
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -30 +30 @@
-... duplicados vs conflictos, normalización, ...
+... duplicados vs. conflictos, normalización, ...
@@ -32 +32 @@
-... exactos vs conflictos, evidencia ...
+... exactos vs. conflictos, evidencia ...
@@ -119 +119 @@
-      heading: "Duplicados exactos vs conflictos",
+      heading: "Duplicados exactos vs. conflictos",
@@ -124 +124 @@
-... Cusco vs Arequipa. ...
+... Cusco vs. Arequipa. ...
@@ -256 +256 @@
-      heading: "Outliers plausibles vs errores",
+      heading: "Outliers plausibles vs. errores",
@@ -259 +259 @@
-... error vs flag.
+... error vs. flag.
@@ -397 +397 @@
-    why: "Required vs optional se traduce en fail/cuarentena vs continuar.",
+    why: "Required vs. optional se traduce en fail/cuarentena vs. continuar.",
@@ -430 +430 @@
-        description: "Detectar duplicados exactos vs conflictos de región por cliente_id",
+        description: "Detectar duplicados exactos vs. conflictos de región por cliente_id",
@@ -450 +450 @@
-        why: "Clasificar exacto vs conflicto cambia la acción de limpieza.",
+        why: "Clasificar exacto vs. conflicto cambia la acción de limpieza.",
@@ -514 +514 @@
-        description: "Clasificar outlier estadístico vs error de dominio en montos",
+        description: "Clasificar outlier estadístico vs. error de dominio en montos",
@@ -777 +777 @@
-        edgeCases: ["mean vs median", "fillna 0"],
+        edgeCases: ["mean vs. median", "fillna 0"],
@@ -873 +873 @@
-          "E3 (transferencia) — Concepto: clasificar exact vs conflict vs clean. ...
+          "E3 (transferencia) — Concepto: clasificar exact vs. conflict vs. clean. ...
@@ -881 +881 @@
-        feedback: "Lima vs Cusco en el mismo cliente_id es conflicto, no clean. ...
+        feedback: "Lima vs. Cusco en el mismo cliente_id es conflicto, no clean. ...
@@ -885 +885 @@
-          code: `# Lab · exact vs conflict vs clean
+          code: `# Lab · exact vs. conflict vs. clean
```

### Diff D-6 (P1) — Fix missing comma before "pero" + smoother flow
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -47 +47 @@
-        "Caso sintético Perú: `cliente_id` y `monto` required; `email` optional. Filas con id o monto nulo entran a violaciones; la tasa de null de email se reporta como métrica pero no tumba el gate por sí sola. Imprime `violations` y `null_rate` de opcionales en el reporte del run.",
+        "Caso sintético Perú: `cliente_id` y `monto` son required; `email` es optional. Las filas con id o monto nulo entran a violaciones; la tasa de null de email se reporta como métrica, pero no tumba el gate por sí sola. Imprime `violations` y el `null_rate` de los opcionales en el reporte del run.",
```

### Diff D-7 (P1) — Fix invented verb "candidatan"
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -259 +259 @@
-        "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio de negocio (monto alto legítimo en una campaña). Un **error de dominio** viola bounds (monto < 0, lat 999, edad 200). IQR/z-score solo **candidatan**; el dominio de negocio **decide** error vs flag.",
+        "Un outlier **plausible** está lejos estadísticamente pero dentro del dominio de negocio (por ejemplo, un monto alto legítimo en una campaña). Un **error de dominio** viola los bounds (monto < 0, lat 999, edad 200). IQR y z-score solo **identifican candidatos**; el dominio de negocio **decide** si es error o flag.",
```

### Diff D-8 (P1) — Fix heavy code-mix in T4-B paragraph 3
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -335 +335 @@
-        "Caso: 2 filas in, 1 clean, 1 quarantine por `null_required_monto`; audit con evento quarantine. `metrics.pass` es false. S17 solo debe consumir `clean` y el memo debe declarar cuántas filas quedaron fuera del universo analítico.",
+        "Caso: 2 filas de entrada, 1 limpia, 1 en cuarentena por `null_required_monto`; el audit trail registra un evento `quarantine`. El campo `metrics.pass` es `false`. S17 solo debe consumir el conjunto `clean`, y el memo debe declarar cuántas filas quedaron fuera del universo analítico.",
```

### Diff D-9 (P1) — Fix "sale en fallo" anglicism + restructure theory[0].paragraphs[1]
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -31 +31 @@
-        "Regla de oro: **nunca "arreglar" silenciosamente**. Toda transformación deja métrica, indicador o fila en cuarentena. **Fail-closed** = si el contrato se rompe, el job **no** aprueba en silencio: publica métricas y sale en fallo. Datos sintéticos de clientes y montos (regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x`); nunca PII real ni DNIs de personas.",
+        "Regla de oro: **nunca "arreglar" en silencio**. Toda transformación deja una métrica, un indicador o una fila en cuarentena. **Fail-closed** significa que, si el contrato se rompe, el job **no** aprueba en silencio: publica métricas y termina con error (exit code ≠ 0). Los datos son sintéticos — regiones Lima/Arequipa/Cusco, prefijos `S/`, ids `C00x` — y nunca incluyen PII (datos personales identificables) reales ni DNI de personas.",
```
(Merges with Diff D-4.)

### Diff D-10 (P1) — Fix "warn o fail" bare verbs + "KeyError opaco"
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -295 +295 @@
-        "Ante **schema drift** (desviación de esquema: columna required faltante o renombrada), el gate falla con el **nombre** de la columna — no con un `KeyError` opaco al final del pipeline. Es el mismo espíritu fail-closed: el drift se hace visible al operador. Columnas extra pueden warn o fail según política documentada en el runbook del job.",
+        "Ante **schema drift** (desviación de esquema: columna required faltante o renombrada), el gate falla con el **nombre** de la columna — no con un `KeyError` sin mensaje claro al final del pipeline. Es el mismo espíritu fail-closed: el drift se hace visible al operador. Las columnas extra pueden emitir `warn` o fallar, según la política documentada en el runbook del job.",
```

### Diff D-11 (P1) — Split 84-word run-on in theory[0].paragraphs[0]
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -30 +30 @@
-        "En S15 leíste clientes y transacciones con dtypes controlados. Imagina el lunes siguiente: alguien hace `monto.fillna(0)` "para que no falle el job", el KPI de ticket promedio se infla y en la reunión de gerencia nadie puede decir **cuántas filas se inventaron**. En **S16** construyes el **quality gate de CP-N2-A** para que eso no pase: políticas de null, imputación limitada con indicadores, duplicados vs conflictos, normalización, outliers, contratos de schema/cross-field y cuarentena con audit trail (rastro de auditoría append-only).",
+        "En S15 leíste clientes y transacciones con dtypes controlados. Imagina el lunes siguiente: alguien hace `monto.fillna(0)` "para que no falle el job", el KPI de ticket promedio se infla y, en la reunión de gerencia, nadie puede decir **cuántas filas se inventaron**.\n\nEn **S16** construyes el **quality gate de CP-N2-A** para que eso no pase. Abarca seis frentes: políticas de null, imputación limitada con indicadores, duplicados vs. conflictos, normalización, outliers y contratos de schema/cross-field — todo respaldado por una cuarentena con audit trail (rastro de auditoría append-only: solo se agregan eventos, nunca se modifican ni borran).",
```

### Diff D-12 (P1) — Convert 62-word locale-contract run-on to numbered list
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -197 +197 @@
-        "Contrato de montos PEN sintéticos: quita `S/`; si hay **coma y punto**, el punto es miles y la coma es decimal (`1.250,5` → `1250.5`); si **solo coma**, es decimal latino (`3,00` → `3.0`); si **solo punto**, es decimal estilo anglosajón (`10.50` → `10.5`). Conserva **raw** en columna lateral (`region_raw`, `monto_raw`) cuando el valor canónico puede disputarse. Valida dtypes post-normalización **antes** del join de S17.",
+        "Contrato de montos PEN sintéticos:\n\n1. Quita el prefijo `S/`.\n2. Si hay **coma y punto**, el punto es miles y la coma es decimal: `1.250,5` → `1250.5`.\n3. Si hay **solo coma**, es decimal latino: `3,00` → `3.0`.\n4. Si hay **solo punto**, es decimal anglosajón: `10.50` → `10.5`.\n\nConserva el **raw** en una columna lateral (`region_raw`, `monto_raw`) cuando el valor canónico pueda disputarse. Valida los dtypes después de normalizar y **antes** del join de S17.",
```

### Diff D-13 (P1) — Tighten You Do assertion
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -1521,0 +1522 @@
+    assert m["rows_quarantine"] >= 2, "El fixture debe poner al menos 2 filas en cuarentena (null + conflicto + domain_error)"
```

### Diff D-14 (P2) — Fix weak self-check distractors
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -1540 +1540 @@
-        options: ["Imputarse siempre con 0", "Ignorarse si es <5% de filas", "Convertirse a string vacío", "Provocar violación/cuarentena o fail del gate"],
+        options: ["Imputarse siempre con 0", "Ignorarse si es <5% de filas", "Imputarse con la moda del campo", "Provocar violación/cuarentena o fail del gate"],
@@ -1575 +1575 @@
-        options: ["300.0 (coma de miles)", "3.0 (decimal latino)", "None (inválido)", "3,00 como string sin parsear"],
+        options: ["300.0 (coma de miles)", "3.0 (decimal latino)", "None (inválido)", "30.0 (coma decimal, punto ignorado)"],
```

### Diff D-15 (P2) — Capitalize tagline first letter
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -8 +8 @@
-  tagline: "suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato",
+  tagline: "Suite de calidad que falla de forma explicable ante schema drift, cuantifica pérdida y nunca arregla silenciosamente un dato",
```

### Diff D-16 (P2) — Fix inconsistent "Caso Perú sintético" / "Caso sintético Perú"
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -198 +198 @@
-        "Caso Perú sintético: regiones con espacios/`LIM`, montos `S/ 10.50`, `3,00` y `1.250,5`, fechas multi-formato (`01/03/2024`, `2024-03-15`, `15-03-2024`). Salida canónica Lima + floats correctos + fechas ISO; raw intacto para auditoría. Parsea fechas probando formatos documentados (no un solo `format` rígido). Nunca subas padrones reales ni PII al repo del curso.",
+        "Caso sintético Perú: regiones con espacios/`LIM`, montos `S/ 10.50`, `3,00` y `1.250,5`, fechas multi-formato (`01/03/2024`, `2024-03-15`, `15-03-2024`). Salida canónica Lima + floats correctos + fechas ISO; raw intacto para auditoría. Parsea fechas probando formatos documentados (no un solo `format` rígido). Nunca subas padrones reales ni PII al repo del curso.",
```

### Diff D-17 (P2) — Fix "Para las sondas" calque
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -1201 +1201 @@
-          "E3 (transferencia) — Concepto: etiqueta error/flag/ok. Serie con montos [10,12,11,13,5000,-1]. Para las sondas `[5000, -1, 10]`: `error` si domain (monto < 0 o > 10000), `flag` si solo outlier IQR 1.5, `ok` else. Prioriza domain sobre IQR. Pass: `['flag', 'error', 'ok']`.",
+          "E3 (transferencia) — Concepto: etiqueta error/flag/ok. Serie con montos [10,12,11,13,5000,-1]. Para los valores de prueba `[5000, -1, 10]`: `error` si domain (monto < 0 o > 10000), `flag` si solo outlier IQR 1.5, `ok` en caso contrario. Prioriza domain sobre IQR. Pass: `['flag', 'error', 'ok']`.",
```

### Diff D-18 (P2) — Replace "+ métricas" and "+ audit" with "y" / "con"
```diff
--- a/src/lib/course/sections/s16-wxpython-gui.ts
+++ b/src/lib/course/sections/s16-wxpython-gui.ts
@@ -15 +15 @@
-    "Los equipos de datos en banca, fintech y retail en Perú necesitan **quality gates explicables**: políticas de null por campo, duplicados con evidencia, normalización con columna raw al lado, outliers con dominio y cuarentena con audit trail (rastro de auditoría). Aquí construyes el gate de calidad de **CP-N2-A**: falla de forma cerrada (**fail-closed**: si el contrato se rompe, el job no "aprueba" en silencio), sin PII real y sin arreglos silenciosos. Parte de la ingesta tipada de S15 y deja un set limpio + métricas para S17.",
+    "Los equipos de datos en banca, fintech y retail en Perú necesitan **quality gates explicables**: políticas de null por campo, duplicados con evidencia, normalización con columna raw al lado, outliers con dominio y cuarentena con audit trail (rastro de auditoría append-only: solo se agregan eventos, nunca se modifican ni borran). Aquí construyes el gate de calidad de **CP-N2-A**: falla de forma cerrada (**fail-closed**: si el contrato se rompe, el job no "aprueba" en silencio), sin PII real y sin arreglos silenciosos. Parte de la ingesta tipada de S15 y deja un conjunto limpio y métricas para S17.",
@@ -371 +371 @@
-    intro: "Ocho demos de un solo hilo: un batch sintético de clientes PE pasa por null policy, imputación con cap, dups/conflictos, evidencia, normalización PEN, outliers, schema/cross-field y métricas+audit. Observa el patrón fail-closed en cada paso.",
+    intro: "Ocho demos de un solo hilo: un batch sintético de clientes PE pasa por null policy, imputación con cap, duplicados y conflictos, evidencia, normalización PEN, outliers, schema/cross-field y métricas con audit. Observa el patrón fail-closed en cada paso.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|----------|-------|--------|--------|
| **P0** | Issue 1 (rename file + change `id`) | 30 min | Eliminates URL/identity meta-leak |
| **P0** | Issue 2 (replace wxPython demo with pandas demo) | 60 min | Eliminates the single most damaging defect |
| **P0** | Issue 3 (route raw JSX through `<RichText>`) | 30 min (systemic — same fix as S06) | Fixes markdown leak in 3 tabs |
| **P1** | Issue 4 (split 13 run-on sentences — Diffs D-9, D-11, D-12) | 90 min | Cognitive load reduction |
| **P1** | Issue 5 (DNIs → DNI — Diff D-4) | 5 min | Orthography |
| **P1** | Issue 6 (vs → vs., 15 instances — Diff D-5) | 15 min | Orthography |
| **P1** | Issue 7 (comma before "pero" — Diff D-6) | 2 min | Orthography |
| **P1** | Issue 8 (candidatan → identifican candidatos — Diff D-7) | 2 min | Redaction |
| **P1** | Issue 9 (heavy code-mix T4-B — Diff D-8) | 5 min | Redaction |
| **P1** | Issue 10 (warn o fail / KeyError opaco — Diff D-10) | 5 min | Redaction |
| **P2** | Issue 11 (gloss append-only at first use) | 5 min | Vocabulary |
| **P2** | Issue 12 (set limpio → conjunto limpio, 3 instances) | 5 min | Style |
| **P2** | Issue 14 (audit as bare noun — gloss as audit trail) | 5 min | Style |
| **P2** | Issue 17 (gloss job at first use) | 5 min | Style |
| **P2** | Issue 19 (gloss PII / EDA / KPI at first use) | 10 min | Accessibility |
| **P2** | Issue 22 (capitalize tagline — Diff D-15) | 1 min | Style |
| **P2** | Issue 24 (tighten You Do assertion — Diff D-13) | 5 min | Assessment rigor |
| **P2** | Issue 25/26 (replace weak self-check distractors — Diff D-14) | 5 min | Assessment quality |
| **P3** | Issues 12-21 (low-priority anglicisms / consistency / calques) | 30 min total | Polish |

**Total estimated effort:** ~5 hours for P0+P1; +1 hour for P2; +30 min for P3.

---

## 9. Graph Memory Update Notes (for shared context files)

For the orchestrator and future fixers:

1. **Systemic identity-rescope pattern:** S16 is the **7th confirmed section** with the
   file-name/id/URL-hash mismatch defect (S05, S06, S08, S10, S11, S12, S16). Pattern:
   original Phase-1 plan had different topics; rescope left `id` and file name stale. The
   `'wxpython-gui'` demo in `SectionView.tsx:1526` is one of 52 such demos; an audit of all
   `demos` keys vs current section content is recommended.

2. **Systemic markdown-rendering defect:** 14+ fields in `SectionView.tsx` render raw JSX
   instead of `<RichText>`. Same root cause as S06. A single PR fixing all 14 sites resolves
   the issue for all 52 sections simultaneously.

3. **PEN locale contract:** S16 introduces a useful 4-case PEN amount normalization rule
   (`S/` strip + comma/point disambiguation). This pattern should be referenced from S08
   (CSV/JSON ingesta) and S17 (joins) — currently S16 is the only place it's documented. Add
   to `glossary.ts` as a domain term.

4. **Capstone gate CP-N2-A:** S16 is the canonical reference for the CP-N2-A gate. The
   `run_quality_gate(df, schema)` signature in `youDo.starterCode` should be the canonical
   contract reused in S17 (joins) and S18 (EDA).

5. **Cross-section consistency for "audit trail" / "fail-closed" / "schema drift":** These
   terms appear in S06, S08, S10, S11, S16. S16 introduces "fail-closed" most explicitly.
   Consider adding them to `glossary.ts` so the inline-annotation hover hints fire on first
   use across sections.

6. **`vs` → `vs.` pattern:** Likely systemic across many sections. A repo-wide
   `rg "\bvs\b" src/lib/course/sections/` and bulk replacement is a low-cost, high-yield
   cleanup.

7. **`DNIs` → `DNI` pattern:** Same — search across all sections for siglas with plural `s`
   (DNIs, APIs, KPIs, IDEs, ORMs, DTOs). S11 already flagged APIs/ORMs/DTOs.

8. **Heavy code-mixing pattern:** "2 filas in, 1 clean, 1 quarantine" (S16 line 335) is a
   particularly egregious example. Other sections likely have similar patterns. Recommend a
   style guide rule: "In Spanish prose, English nouns/adjectives used as content words must
   be in backticks OR glossed parenthetically at first use."

---

## 10. Method Note (Spanish Grammar Audit)

**Metrics computed:**
- **Fernández-Huerta (1959):** `206.84 − 60·(syl/word) − 1.02·(words/sentence)` — Spanish
  Flesch adaptation. Bands: ≥90 muy fácil, 80-89 fácil, 70-79 bastante fácil, 60-69 normal,
  50-59 bastante difícil, 30-49 difícil, <30 muy difícil.
- **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syl/word) − (words/sentence)` — Spanish
  perspicuity formula. Bands: ≥80 muy fácil, 65-79 bastante fácil, 50-64 normal, 35-49
  bastante difícil, 15-34 difícil, <15 muy difícil.
- **WPS (words per sentence):** mean length. Pedagogy soft target ~15-32 for technical
  Spanish.
- **SPW (syllables per word):** Spanish vowel-group heuristic for syllable counting
  (diphthongs count as 1, hiatuses as 2).

**Rule-based heuristics (per sentence + per paragraph):**
- Run-on >45 w (H), Long >32 w (M)
- Missing terminal punctuation (.?!)
- Missing inverted marks ¿¡
- Unbalanced delimiters `()[]«»""`
- Duplicated function words (`de de`, `que que`, etc.)
- English-dominant sentence (≥3 English function words)
- Meta-leak (`TODO|FIXME|moved from|En V[23]|never surface` etc.)
- Gerund pile-up (≥3 gerunds in one sentence)
- High comma density
- Space-before-punct / double space

**LanguageTool (es) public API:** 1 chunk of ~11k chars submitted. 352 raw matches; 203
filtered as MORFOLOGIK_RULE_ES spelling false positives (caused by inline code identifiers
left as empty `()` after my extractor stripped them). The remaining 149 non-spell matches
were analyzed manually:
- 53 ES_UNPAIRED_BRACKETS — extractor artifact (inline code stripped leaves unbalanced `()`)
- 39 COMMA_PARENTHESIS_WHITESPACE — extractor artifact
- 24 INCORRECT_SPACES — extractor artifact
- 8 PUNTO_EN_ABREVIATURAS — real (`vs` → `vs.`)
- 7 ESPACIO_DESPUES_DE_PUNTO — extractor artifact (code line joins)
- 2 SIGLAS — real (`DNIs` → `DNI`)
- 1 COMMA_PERO — real (missing comma before "pero")
- 1 SI_AFIRMACION2 — extractor artifact (rate > cap stripped leaves "Si ," — original is
  valid `Si null_rate > cap, el gate...`)
- 2 EL_TILDE — extractor artifact (audit identifier stripped leaves "el permite" — original
  is `el audit permite`)
- 2 PREP_VERB — extractor artifact (cliente_id stripped leaves "y required")
- Other rules — extractor artifacts or false positives

**Genuine grammar findings after filtering:** ~6 (DNIs, vs., comma-pero, candidatan,
sale-en-fallo, audit-trail-gloss-missing). All addressed in the issue registry.

**Pipeline artifacts saved:**
- `/home/z/my-project/audits/_s16_extract.py` — heuristic extractor
- `/home/z/my-project/audits/_s16_metrics.json` — per-record + per-sentence metrics + findings
- `/home/z/my-project/audits/_s16_lt.json` — LanguageTool raw matches
- `/home/z/my-project/audits/_s16_lt.py` — LanguageTool runner

---

## Final Verdict

**Section 16 score: 6.5 / 10** (would be 8.5–9 after P0+P1 fixes).

The pedagogy is gold-standard (9/10 for I Do / We Do / You Do fidelity, 8/10 for cognitive
load and progressive disclosure, 8/10 for connective tissue, 9/10 for industry alignment).
The defects dragging the score are:
1. **Identity meta-leak** (`id: "wxpython-gui"` + URL hash + off-topic interactive demo) — P0,
   same defect class as 6 other sections.
2. **Markdown rendering bug** affecting `jobRelevance`, 3 `weDo.instruction`s, and the entire
   `youDo.context` — P0, systemic.
3. **13 run-on sentences** in theory and instructions — P1, cognitive load.
4. **~6 genuine Spanish grammar findings** (DNIs, vs., comma-pero, candidatan, sale-en-fallo,
   audit-trail-gloss) — P1.

With ~5 hours of fixer work (P0+P1), this section can reach 8.5–9.

**This is the complete Explorer report for Section 16. Ready for the Fixer prompt.**
