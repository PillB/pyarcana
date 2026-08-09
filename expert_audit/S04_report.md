# PyArcana Curriculum Audit — Section 4 (S04)
### "Iteración y resúmenes transaccionales" / `s04-functions-modules.ts`

> Auditor: Curriculum Auditor (general-purpose sub-agent S04)
> Scope: Section 4 of `https://pillb.github.io/pyarcana/` (repo `https://github.com/PillB/pyarcana`)
> Method: Stanford STORM + Graph/Loop/Harness Engineering, Spanish grammar subplan applied
> Source files audited:
> - `src/lib/course/index.ts` (order verification)
> - `src/lib/course/sections/s04-functions-modules.ts` (1760 lines, full content)
> Live page sampled: `https://pillb.github.io/pyarcana/` (SPA, section metadata confirmed in DOM)

---

## 1. Section Identification & Scope

**Section number (confirmed): 4**

Identification evidence:
- `src/lib/course/index.ts` line 5: `import { section04 } from './sections/s04-functions-modules'`
- `src/lib/course/index.ts` line 70: `section01, section02, section03, section04, section05, ...` — fourth in `COURSE_SECTIONS`.
- The file `s04-functions-modules.ts` line 5: `index: 4`.
- Live homepage DOM (fetched 2025-07-25) contains: `Sección <!-- -->4`, `Iteración & Resúmenes`, `for/while, contadores, comprehensions y cierre del Client Intake CP-N1-A`.

**Title (visible to learner):** "Iteración y resúmenes transaccionales"
**Short title:** "Iteración & Resúmenes"
**Tagline:** "for/while, contadores, comprehensions y cierre del Client Intake CP-N1-A"
**Estimated hours:** 18 · **Level:** Principiante · **Phase:** 0 (Fundamentos)
**Internal id:** `"functions-modules"` ← **mismatch with content** (see §4 Meta-Leak).

**Content scope audited (all learner-facing surface):**
- `jobRelevance`, `learningOutcomes[]` (8 outcomes)
- `theory[]` — 9 subsections (Mapa, T1-A for/range, T1-B enumerate/zip, T2-A while/centinelas, T2-B break/continue, T3-A contadores/tasas, T3-B comprehensions, T4-A trazado, T4-B costo/off-by-one). Each = heading + 2–3 paragraphs + code block + callout.
- `iDo` intro + 8 demos (one per subtopic)
- `weDo` intro + 24 exercises (8 subtopics × {E1 guided, E2 independent, E3 transfer}); each = instruction + 2 hints + edgeCases + tests + feedback + starterCode + solutionCode
- `youDo` — title, context, objectives[], requirements[], starterCode (`intake_quality_batch.py`), portfolioNote, rubric[]
- `selfCheck.questions[]` — 8 multiple-choice questions
- `resources.docs/books/courses`

---

## 2. Executive Summary of Quality

**Composite score: 6.5 / 10**

**Verdict:** Pedagogically excellent — a clear, well-scaffolded I Do / We Do / You Do arc that closes a real gate (CP-N1-A) and threads a single "intake batch" narrative across all four tabs. The Spanish prose is fluent, segmented, and largely correct (Peruvian Spanish, informal `tú`, code-aware). The pedagogy outperforms typical open Python courses (CS50P, Py4E) in tying iteration to a domain and to a verifiable gate.

**However, four systemic problems drag the score down from a potential 9:**

1. **CRITICAL — broken code↔output pairs.** At least **6** demo/solution blocks display a printed `output` that does NOT match the `code` shown beside it (theory T2-A, theory T2-B, I Do T1-B-DEMO, I Do T2-A-DEMO, We Do T1-A-E1 solution, We Do T2-B-E1 solution+instruction). The I Do `intro` explicitly promises *"el `output` debe coincidir al pulsar Run"* — so each mismatch is a contract violation visible to the learner.
2. **CRITICAL — the You Do gate CP-N1-A is unpassable as shipped.** `_run_tests` asserts `results[0]['raw']['raw_line'] == "30|Sucursal-Sur|0"` while the batch fixture row 0 has `raw_line == "30|Cliente-A|0"`. The requirements docstring says it should be `'30|Oficina-Este|0'` (a third value). A correct `process_batch` implementation will fail the assertion and never print `tests OK`. This blocks the section's gate.
3. **MEDIUM — structural meta-leak.** Internal `id: "functions-modules"` and the filename `s04-functions-modules.ts` are stale leftovers from a previous curriculum version (the section is about iteration, not functions/modules). The intro itself says "el diseño formal de funciones llega en la sección siguiente". Maintainability hazard and a latent URL/anchor risk if section deep links are ever exposed.
4. **LOW — minor redaction.** 3 quiz questions omit the leading `¿`. A 47-word run-on in `youDo.context`. A 37-word sentence in theory T1-A paragraph 2. Inconsistent anglicism density (loop/bucle ~50/50). Quiz questions end with `…` instead of `?`.

No actual developer prose meta-leaks (no "moved from section X", "TODO: rewrite", "WIP", etc.) were found in learner-facing strings. The only `TODO` tokens are pedagogically intentional inside `starterCode` stubs, which the subplan explicitly excludes.

**Top-priority fixes:** (1) regenerate all mismatched `output` strings from real execution, (2) fix the You Do `_run_tests` fixture↔assertion, (3) rename the file/id to `s04-iteration-batch` (or `s04-iteracion-resumenes`), (4) add leading `¿` to 3 quiz questions, (5) split the 2 long sentences.

---

## 3. Detailed Issue Registry

> Severity scale: **CRITICAL** (blocks learning) · **HIGH** (significant) · **MEDIUM** (real, recoverable) · **LOW** (polish).
> All evidence quoted verbatim from `s04-functions-modules.ts`.

### I-01 — CRITICAL · `youDo._run_tests` assertion compares against a `raw_line` not in the batch fixture
- **Location:** lines 1596–1606 (`youDo.starterCode`, `_run_tests`).
- **Evidence:**
  - Batch fixture (line 1596): `{"edad": 30, "region": "Oficina-Oeste", "monto_ingreso": 0, "raw_line": "30|Cliente-A|0"},`
  - Assertion (line 1602): `assert s["results"][0]["raw"]["raw_line"] == "30|Sucursal-Sur|0"`
  - Requirements docstring (line 1553): `"Fixture de _run_tests (3 filas): n_total == 3; results[0]['raw']['raw_line'] == '30|Oficina-Este|0'; lote vacío → tasa_reject is None"`
- **Three different values** across fixture, assertion, and requirements.
- **Pedagogical impact:** A learner who correctly implements `process_batch` (raw-preserving) will see `AssertionError` at line 1602 every time. The `_run_tests` block prints `tests OK` only after all asserts pass. The student never reaches the success message → the gate CP-N1-A cannot be closed → frustration and false impression that their code is wrong.
- **Root cause:** Author copied fixtures from a different draft (randomized fictional region names: Cliente-A, Cliente-B, Sucursal-Norte, Sucursal-Sur, Sucursal-Centro, Oficina-Este, Oficina-Oeste, Piura, Tacna, Lima, Cusco, Arequipa) and forgot to sync the assertion and the requirements docstring.
- **Fix:** Make the three values identical (see §7 diff).

### I-02 — CRITICAL · Theory T2-A `while_centinela.py` output mismatches the code
- **Location:** lines 134–147 (theory T2-A code block).
- **Evidence:**
  - Code (line 134): `lineas = ["C001|Lima", "C002|Cusco", "", "C003|Piura"]`
  - Expected (real execution): `procesadas: ['C001|Lima', 'C002|Cusco']`
  - Declared output (line 146): `procesadas: ['C001|Sucursal-Norte', 'C002|Sucursal-Sur']`
- **Pedagogical impact:** The learner runs the code in the playground and sees `['C001|Lima', 'C002|Cusco']`, NOT the values shown in the "expected output" panel. Directly contradicts the I Do intro promise that "el `output` debe coincidir al pulsar Run".
- **Fix:** Replace declared output to `procesadas: ['C001|Lima', 'C002|Cusco']`.

### I-03 — CRITICAL · Theory T2-B `break_continue.py` output mismatches the code
- **Location:** lines 167–187 (theory T2-B code block).
- **Evidence:**
  - Code (line 181): `raw_lines = ["  ", "C001|Sucursal-Centro", "SKIP", "C002|Oficina-Este", "END"]`
  - Expected: `kept = ['C001|Sucursal-Centro', 'C002|Oficina-Este']`
  - Declared output (line 186): `['C001|Oficina-Oeste', 'C002|Cliente-A']`
- **Pedagogical impact:** Same as I-02. Also the declared kept values don't even appear in the input list — visibly fabricated.
- **Fix:** Replace declared output to `['C001|Sucursal-Centro', 'C002|Oficina-Este']`.

### I-04 — CRITICAL · I Do `S04-T1-B-DEMO` (enumerate_zip) output mismatches the code
- **Location:** lines 375–393 (iDo step `S04-T1-B-DEMO`).
- **Evidence:**
  - Code (line 376): `regiones = ["Cliente-B", "Sucursal-Norte", "Arequipa"]`
  - Expected: `fila 1: C001 @ Cliente-B / fila 2: C002 @ Sucursal-Norte / fila 3: C003 @ Arequipa`
  - Declared output (line 390): `fila 1: C001 @ Oficina-Este / fila 2: C002 @ Oficina-Oeste / fila 3: C003 @ Arequipa`
- **Pedagogical impact:** Same as I-02. The third row matches by coincidence (Arequipa) but rows 1–2 are wrong.
- **Fix:** Replace declared output rows 1–2 with `Cliente-B` / `Sucursal-Norte`.

### I-05 — CRITICAL · I Do `S04-T2-A-DEMO` (while_end) output mismatches the code
- **Location:** lines 405–418 (iDo step `S04-T2-A-DEMO`).
- **Evidence:**
  - Code (line 405): `buf = ["Ana|Cliente-A", "Luis|Cliente-B", "END", "ignorada"]`
  - Expected: `['Ana|Cliente-A', 'Luis|Cliente-B']`
  - Declared output (line 417): `['Ana|Sucursal-Norte', 'Luis|Sucursal-Sur']`
- **Pedagogical impact:** Same as I-02. The declared output values do not exist in `buf`.
- **Fix:** Replace declared output to `['Ana|Cliente-A', 'Luis|Cliente-B']`.

### I-06 — HIGH · We Do `S04-T1-A-E1` (for_regiones) — three different fixtures across instruction / starter / solution, and the solution output doesn't match the solution code
- **Location:** lines 549–580 (weDo step `S04-T1-A-E1`).
- **Evidence:**
  - Instruction fixture (line 549): `regiones = ["Sucursal-Centro", "Oficina-Este", "Piura"]`
  - Starter fixture (line 563): `regiones = ["Oficina-Oeste", "Cliente-A", "Piura"]`
  - Solution fixture (line 572): `regiones = ["Cliente-B", "Sucursal-Norte", "Piura"]`
  - Solution output (line 576): `Sucursal-Sur / Sucursal-Centro / Oficina-Este / [0, 1, 2]`
- **Pedagogical impact:** The student is told the fixture is one thing, the starter code has another, the solution has a third, and the solution's printed output uses a fourth set. Even if the student follows the solution code exactly, the printed output won't match the shown expected output.
- **Fix:** Pick ONE fixture and use it consistently in instruction, starter, and solution; regenerate the output.

### I-07 — HIGH · We Do `S04-T2-B-E1` (continue_vacios) — instruction fixture vs starter fixture vs solution fixture mismatch; solution output doesn't match solution code; instruction itself internally inconsistent
- **Location:** lines 925–955 (weDo step `S04-T2-B-E1`).
- **Evidence:**
  - Instruction fixture (line 925): `raw = ["  ", "Oficina-Oeste", "", "Cliente-A"]`
  - Instruction says: *"imprime solo regiones válidas (Cliente-B y Sucursal-Norte, una por línea)"* — but `Cliente-B` and `Sucursal-Norte` are NOT in the instruction's own fixture.
  - Starter fixture (line 939): `raw = ["  ", "Oficina-Oeste", "", "Cliente-A"]` (same as instruction)
  - Solution fixture (line 948): `raw = ["  ", "Cliente-B", "", "Sucursal-Norte"]` (different)
  - Solution output (line 953): `Sucursal-Sur / Sucursal-Centro` — values not in solution fixture either.
- **Pedagogical impact:** The exercise text contradicts itself — the student cannot tell which values should print. The hint and feedback don't clarify. The "esperado" is unachievable from any of the three fixtures.
- **Fix:** Make instruction, starter, and solution use the same `raw` fixture; align the "expected" prose; regenerate the output.

### I-08 — MEDIUM · Three `selfCheck` questions missing leading `¿`
- **Location:** lines 1643, 1650, 1664.
- **Evidence:**
  - Line 1643: `question: "zip([1,2,3],[10,20]) sin strict…",`
  - Line 1650: `question: "Para la tasa de reject del gate, el denominador debe ser…",`
  - Line 1664: `question: "Un doble for anidado sobre n elementos es aproximadamente…",`
  - Compare to line 1636 (`"¿Qué produce list(range(3))?"`) and line 1657 (`"¿Qué hace continue en un for de líneas de intake?"`) which DO have `¿`.
- **Pedagogical impact:** Violates RAE orthography. A learner internalises the bad pattern. Minor, but visible.
- **Fix:** Add leading `¿` (and consider closing with `?` instead of `…` — see I-09).

### I-09 — LOW · `selfCheck` questions end with `…` instead of `?`
- **Location:** lines 1643, 1650, 1664, 1671 (partial).
- **Evidence:** `…` (ellipsis) where RAE-preferred style is `?` to close an interrogative.
- **Pedagogical impact:** Stylistic; informal "fill-in" style. Acceptable but inconsistent — 5 questions end with `?` and 3 with `…`.
- **Fix:** Standardise on `?` (with paired `¿`).

### I-10 — MEDIUM · 47-word run-on sentence in `youDo.context`
- **Location:** line 1541 (second sentence).
- **Evidence:** *"Sobre el parser (S02) y el motor de reglas (S03), construyes un procesador por **lotes**: múltiples registros sintéticos, un pase O(n), contadores accept/reject/review, **tasa de error con denominador = n_total** (`None` si el lote está vacío), conservación del **raw** por fila y reporte por stdout."* — 44–47 words (depending on token count of `accept/reject/review`).
- **Metrics:** WPS 47 · FH 48 · INFLESZ ~38 · commas 5 (comma_density hit).
- **Pedagogical impact:** Cognitive overload at the entry point of the most demanding tab (You Do). The sentence bundles 7 distinct obligations into one breath.
- **Fix:** Split into 2 sentences (see §6 + §7).

### I-11 — MEDIUM · 37-word long sentence in `theory[0].paragraphs[2]`
- **Location:** line 32.
- **Evidence:** *"El hilo conductor es un **script de intake por lotes**: lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro, imprime por stdout un resumen y **conserva el original (raw)** de cada fila."* — 37 words.
- **Metrics:** WPS 37 · FH 57.
- **Pedagogical impact:** Long, but readable. The first paragraph of the section's theory map; deserves cleaner pacing.
- **Fix:** Split after the colon (see §6 + §7).

### I-12 — MEDIUM · Structural meta-leak: `id` and filename say "functions-modules" but content is iteration
- **Location:** line 4 (`id: "functions-modules"`); filename `s04-functions-modules.ts`.
- **Evidence:**
  - Title: "Iteración y resúmenes transaccionales"
  - Tagline: "for/while, contadores, comprehensions y cierre del Client Intake CP-N1-A"
  - Intro (line 34): *"el diseño formal de funciones llega en la sección siguiente"* — confirming functions are NOT this section.
  - `index.ts` imports `section04` from `./sections/s04-functions-modules`.
- **Pedagogical impact:** No learner-visible damage on the current SPA (no per-section URL), but: (a) maintainability hazard for any future contributor or Fixer; (b) if deep links are ever exposed (`/sections/functions-modules`), the URL slug will be misleading; (c) breaks the convention seen in sibling files (`s01-setup`, `s02-basics`, `s03-data-structures`, `s05-oop`, `s06-numpy` …) where id/file name matches topic.
- **Fix:** Rename file to `s04-iteration-batch.ts` (or `s04-iteracion-resumenes.ts`), update `index.ts` import, and change `id: "iteration-batch"`. (Out of scope for an audit — to be done by the Fixer. See §7.)

### I-13 — LOW · Inconsistent terminology: `loop` vs `bucle` ~50/50
- **Location:** Section-wide.
- **Evidence:** `rg -c "\\bloop\\b|\\bloops\\b"` → 13 hits; `rg -c "\\bbucle[s]?\\b"` → 14 hits. Examples: line 20 "guardrails contra loops infinitos", line 128 "loop infinito", line 157 heading "loops infinitos", line 193 "loop infinito agota CPU", line 842 "loop infinito"; vs line 269 "bucle", line 271 "bucle", line 305 "bucles anidados", etc.
- **Pedagogical impact:** Style inconsistency; "bucle" is the RAE-preferred Spanish term, "loop" is accepted tech slang. Pick one and use the other only in code.
- **Fix:** Standardise on `bucle` (and `bucles`) in prose; reserve `loop` for inline code / variable names.

### I-14 — LOW · `guardrails` (English plural) used as Spanish
- **Location:** line 20 ("Aplicar break/continue y guardrails contra loops infinitos"), line 1011, 1012, 1014.
- **Evidence:** 4 hits of `guardrail(s)`.
- **Pedagogical impact:** Minor anglicism. Acceptable in tech-Spanish but inconsistent with the rest of the course's bilingual style (which uses Spanish nouns like "centinela", "denominador", "tasa" and English only for code identifiers).
- **Fix:** Either `salvaguardas` or `redes de seguridad` or accept `guardrails` consistently.

### I-15 — LOW · `learningOutcomes[3]` mixes English `guardrails` and `loops` into a Spanish bullet
- **Location:** line 20.
- **Evidence:** "Aplicar break/continue y guardrails contra loops infinitos" — `guardrails`, `loops` are English plurals inside a Spanish verb-phrase objective.
- **Fix:** "Aplicar break/continue y salvaguardas contra bucles infinitos."

### I-16 — LOW · `youDo.requirements[3]` text uses an English `raw_line` value that doesn't match the actual fixture or assertion
- **Location:** line 1553.
- **Evidence:** `"Fixture de _run_tests (3 filas): n_total == 3; results[0]['raw']['raw_line'] == '30|Oficina-Este|0'; lote vacío → tasa_reject is None"`
  - `'30|Oficina-Este|0'` is neither the batch value (`'30|Cliente-A|0'`) nor the assertion value (`'30|Sucursal-Sur|0'`).
- **Pedagogical impact:** Layered on top of I-01 — the requirements text the learner reads before opening the starter is wrong too.
- **Fix:** Sync with I-01 fix.

### I-17 — LOW · `youDo.context` final sentence leaves a hanging reference
- **Location:** line 1541.
- **Evidence:** *"El empaquetado CLI se ve más adelante en el curso."* — fine standalone, but the previous sentence says "implementa las tres funciones hasta que `tests OK` se imprima". The jump to packaging is abrupt.
- **Pedagogical impact:** Minor flow break.
- **Fix:** Optional rephrase: "El empaquetado CLI no entra aquí: lo verás más adelante en el curso."

### I-18 — LOW · Inconsistent anglicism density in prose (raw / demo / hint / feedback / fixture / trace / batch)
- **Evidence (rg counts):** `raw` 20, `output` 41, `reject` 62, `accept` 46, `review` 23, `hint` 24, `feedback` 24, `demo` 25, `defect` 26, `fixture` 12, `trace` 11, `batch` 3.
- **Note:** Most of these are field names / status values / inline-code identifiers — legitimate. The prose-level anglicisms (`demo`, `hint`, `feedback`, `fixture`, `trace`, `starter`) are stylistic; not defects. Flagging only for consistency awareness.

### I-19 — LOW · `learningOutcomes` items end without terminal punctuation (by design)
- **Evidence:** All 8 outcomes are verb-phrase bullet items ending without `.` (e.g., line 17 "Recorrer secuencias con for y range sin off-by-one en el stop exclusivo").
- **Pedagogical impact:** None — bullet/objective style. Flagged only because the heuristic metric flagged 327 `no_terminal_punct` hits section-wide; the vast majority are intentional headings/labels/objectives/options. **Not a real issue.**

### I-20 — INFO · Aggregate readability profile (good)
- **Method:** Spanish-aware sentence splitter, Fernández-Huerta (1959), INFLESZ (Szigriszt-Pazos), with `de de / que que`, inverted-mark, delimiter-balance, gerund-pileup, comma-density, anaphora, spacing heuristics. 596 prose-ish sentences extracted.
- **Aggregate:**
  - Mean WPS 8.10 (skewed low by short labels / options / objectives)
  - Mean SPW 1.80
  - Mean Fernández-Huerta 93.7 → band "muy fácil"
  - Mean INFLESZ 89.8 → band "muy fácil"
- **Interpretation:** For a *technical intro* curriculum the aggregate is on the "very easy" side of healthy (subplan says 50–70 is typical for technical ES, but intro sections can be higher). The ease comes from heavy segmentation (many short sentences, lists, callouts) which is **good pedagogy** for Phase 0. The risk of "extreme easy → under-teaching" is not realised here because the difficulty lives in the code/exercises, not the prose.
- **Worst sentences by FH** (lowest = hardest):
  - FH 24 / INF 18 — "Orden pedagógico: T1 Recorrido (`for`/`range` → `enumerate`/`zip`) → T2 Repetición (`while`/centinelas → `break`/`continue`) → T3 Patrones (contadores/acumuladores → comprehensions) → T4 Razonamiento (trazado de estado → costo y off-by-one)." (line 33) — long navigation sentence with arrows;FH artificially deflated by inline code and arrows. Acceptable in context.
  - FH 29 — "Desalineación en zip produce resúmenes incorrectos y tasas infladas/deflactadas." (line 120) — short but dense; OK.
  - FH 31 — "Columnas: índice, input de la fila, contadores/acumuladores, decisión." (line 298) — list sentence; OK.
- **No duplicated-word hits, no real unbalanced delimiters, no real gerund pileups, no real space-before-punct** after filtering extraction artifacts (see §6 method note).

---

## 4. Meta-Leak Report

**No developer prose meta-leaks detected in learner-facing Spanish strings.**

Specific searches performed (ripgrep, case-insensitive) and outcomes:

| Pattern searched | Hits in prose | Verdict |
|---|---|---|
| `mov(ed|ing) from` / `tra(i|í)do de` / `vien(e|en) de` | 0 in prose | clean |
| `sección anterior` / `sección siguiente` / `next section` / `previous section` | 1 hit (line 34: *"el diseño formal de funciones llega en la sección siguiente"*) | **legitimate teacher voice** (forward reference to S05). Not a leak. |
| `TODO` / `FIXME` / `XXX` / `TBD` / `WIP` / `DRAFT` | 3 hits (lines 1571, 1584, 1590) | **inside `starterCode` body only** (`# TODO: devolver ...`, `# TODO: un solo for O(n)`, `# TODO: texto stdout ...`). Pedagogically intentional: the student is told what to implement. The grammar subplan explicitly **excludes** `starterCode`/`solutionCode` bodies from analysis. **Not a leak.** |
| `placeholder` / `pendiente` / `rehacer` / `borra esto` / `note to self` / `author note` / `editor note` | 0 in prose | clean |
| `[author` / `[editor` / `[internal` / `[private note` | 0 | clean |
| `NOTE:` / `NOTE -` (English meta-comment) | 0 in prose | clean |

**Structural / file-level meta-leak (non-prose):**
- **I-12** (see §3): the section `id` (`"functions-modules"`) and the file name (`s04-functions-modules.ts`) are leftovers from an earlier curriculum version in which Section 4 covered functions and modules. The current content is iteration/loops/comprehensions, and the section itself acknowledges that "el diseño formal de funciones llega en la sección siguiente" (S05). This is a **code-level meta-leak**: the developer-facing artifact (file name + id) reveals a refactoring history that the learner-facing UI mostly hides, but it is still a maintainability and consistency hazard and a latent URL-slug risk.
- No other code-level leaks (no orphaned imports, no commented-out prior-version strings, no `console.log` of authoring notes).

**Exact leaked text (only the structural one):**
- File name: `src/lib/course/sections/s04-functions-modules.ts`
- `id: "functions-modules"` (line 4)
- Import in `src/lib/course/index.ts`: `import { section04 } from './sections/s04-functions-modules'` (line 5)

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — **Excellent**

- **I Do:** 8 demos (one per subtopic S04-T1-A through S04-T4-B). Each demo has `demoId`, `subtopicId`, `environment: "browser-pyodide"`, a `description`, a runnable `code`, an `output`, and a one-line `why`. Faithful to the I-Do principle ("observe the expert"). The `intro` (line 340) clearly says "primero observas el patrón ejecutable, luego lo practicas en We Do".
- **We Do:** 24 exercises (8 subtopics × 3 = `guided`/`independent`/`transfer`). Each has `instruction`, `hint`, `hints[2]`, `edgeCases`, `tests`, `feedback`, `starterCode`, `solutionCode`. The starter always carries an intentional `# DEFECT: ...` comment so the learner practices debugging, not blank-page writing. This is the **scaffolded practice** layer done well.
- **You Do:** A single capstone (`intake_quality_batch.py`) that closes the gate CP-N1-A. Has `context`, 5 `objectives`, 6 `requirements`, a 64-line `starterCode` with three `TODO` stubs (`validate_record`, `process_batch`, `format_report`) plus a real `_run_tests` harness, a `portfolioNote`, and a 6-row `rubric` with weights summing to 100%. This is the **independent transfer** layer.
- **Self-check:** 8 MCQs, each with `explanation` (not just answer key) — supports self-correction.

The progressive-release curve (observe → fix a small defect → write from a stub) is well-calibrated for an 18-hour section.

### 5.2 Connective tissue / narrative flow — **Strong**

- A single "hilo conductor" (intake batch / CP-N1-A gate) is stated in the theory map (line 32) and revisited in every callout (`"Regla de intake"`, `"Gate de alineación"`, `"Denominador correcto"`, `"Traza mínima"`, `"n² en resúmenes"`). Forward references to S02 (parser), S03 (rule engine), S05 (functions), and "secciones posteriores" (CLI / packaging / OOP / logging) place the section in the roadmap without leaking authoring notes.
- The T1→T2→T3→T4 progression (Recorrido → Repetición → Patrones → Razonamiento) is announced in line 33 and executed faithfully in the 8 subtopic sequence.
- Minor flow breaks: the `iDo.intro` (line 340) is a 75-word paragraph mixing 5 ideas (ordering, environment, def-meaning, data nature, output-match promise). Could be split.

### 5.3 Cognitive load / progressive disclosure — **Good**

- Each theory subsection is ~3 paragraphs + 1 code block + 1 callout — consistent shape, predictable for the learner.
- The "Antes de T1, tres ideas base" preamble (line 30) front-loads only 3 concepts (bucle, centinela, tasa) and explicitly says "(no memorices el resto aún)" — strong progressive-disclosure signal.
- The `weDo.intro` (line 542) advises "un subtema por sesión (~2 h) mantiene la carga razonable" — explicit load-management guidance.
- Potential overload points: the run-on I-10 (47 words in `youDo.context`) and the long I-11 (37 words in theory map).

### 5.4 Exercise & exam quality and alignment — **Excellent intent, broken execution**

- The E1→E2→E3 design (guided → independent → transfer) is uniformly applied across all 8 subtopics — strong alignment to learning outcomes.
- Each `tests` string is a short assertion description (e.g., `"2 1 3"`, `"5 25"`, `"DESALINEADO luego OK"`).
- The `feedback` strings are micro-lessons ("Un pase O(n) llena contadores; la tasa usa n total, no solo accepts." — line 467) — pedagogically rich.
- **BUT** the broken code↔output pairs (I-02…I-07) and the unpassable You Do assertion (I-01) undermine the entire exercise layer: a learner cannot trust the "esperado" panel, and cannot close the gate.
- **Self-check** questions cover the right spread (range, zip, denominador, continue, O(n²), centinela, continue-vs-break, enumerate). Explanations are short but informative. Only issue: 3 missing `¿` (I-08).

### 5.5 Consistency with the roadmap / previous sections — **Excellent**

- Backward references: S02 (parser, line 1541), S03 (rule engine, lines 15, 31, 1541), `validate_record` reused from S03 (lines 1567–1572, 1602).
- Forward references: S05 (functions, line 34), "sección siguiente" (line 34), "secciones posteriores" (logging, line 271), CLI/packaging/OOP (lines 31, 40, 1541).
- Gate CP-N1-A and CASO-LIM-004 are used consistently as the case-study anchors.

### 5.6 Comparison with best-in-class external materials

| Source | Treatment of iteration | PyArcana S04 vs. |
|---|---|---|
| **CS50P — Loops** | Toy examples, no domain | PyArcana wins on domain anchoring (intake batch) and on the I/We/You structure CS50P lacks. |
| **Python for Everybody (Py4E) — Iterations** | One narrative thread, no scaffolded practice | PyArcana wins on progressive release (E1/E2/E3). |
| **MIT 6.100L** | Deeper CS framing (invariants, complexity) | MIT wins on rigour for O(n)/O(n²); PyArcana wins on the CP-N1-A gate as a verifiable artefact. |
| **Kaggle Learn — Python** | Micro-practice, no narrative | PyArcana wins on connective tissue. |
| **Real Python — Loops** | Article-style, no exercises | PyArcana wins on exercises; loses on production polish (broken outputs). |

**Net:** PyArcana S04 is structurally ahead of all five on pedagogy; the broken output strings are the single biggest thing separating it from "gold standard" polish.

### 5.7 Other domain issues

- **Accessibility:** All callouts have `type` (info/tip/warning) — supports visual / screen-reader differentiation. Code blocks have `language` and `title`. Quiz questions have 4 options each. Good.
- **Motivation:** `jobRelevance` (line 15) frames the section in Peruvian fintech/retail/banking terms ("onboarding de data en bancos, fintech y retail en Perú") — strong localisation.
- **PII safety:** Repeated reminders ("Datos ficticios únicamente", "Nunca subas PII real al repo", "Datos sintéticos únicamente") — strong data-ethics hygiene.
- **Tone:** Consistent informal `tú` ("dominas", "validas", "construyes", "implementa"), code-aware, mentor-like. No patronising, no jargon-without-gloss.

---

## 6. Grammatical Improvements — Paragraph by Paragraph, Tab by Tab

> **Method note (per subplan):** Spanish-aware sentence splitter with light abbreviation protection (`Sr.`, `p. ej.`, etc.). For each unit compute Fernández-Huerta `206.84 − 60·SPW − 1.02·WPS`, INFLESZ `206.835 − 62.3·SPW − WPS`, plus heuristic findings (long >32w, run-on >45w, missing terminal `.?!`, missing `¿`/`¡`, unbalanced delimiters, duplicated words, English-dominant, gerund pileup ≥3, comma density ≥5, paragraph = one long sentence, anaphoric monotony, space-before-punct). Aggregate over 596 sentences. LanguageTool `es` (public API, 7.7 KB chunk, 135 raw matches of which 37 non-spell — **almost all false positives caused by inline-code stripping in my extractor**; verified manually that the underlying prose is clean).

> Note on `no_terminal_punct` (327 hits) and `english_dominant` (105 hits): these are largely **artifacts of the simple extractor** treating short labels / headings / bullet items / option strings / Python code lines as "sentences". For the audit I treat them as expected bullet style, not defects. Real prose-level findings are listed below.

### 6.1 Theory tab — `theory[0]` "Mapa de la sección: iteración y resúmenes por lotes"

**Paragraph 1 (line 30):** *"**Antes de T1, tres ideas base** (no memorices el resto aún). Un **bucle** repite un bloque mientras haya elementos o mientras una condición sea verdadera. Un **centinela** es un valor especial que marca el fin del lote (`""`, `"END"`). Una **tasa** es un contador dividido por el total de registros **intentados** — solo si ese total es mayor que cero; si el lote está vacío, reportas `None`, no divides."*
- Metrics: 4 sentences, WPS avg ~17, FH ~75. ✓ Healthy. No issues.

**Paragraph 2 (line 31):** *"Desde **S03** ya validas un registro (accept / reject / review). Aquí aplicas esa lógica a **muchas filas** en un solo pase **O(n)**: recorres el lote, acumulas contadores, evitas loops infinitos y emites un resumen con **denominador correcto**. Eso es lo que cierra el gate **CP-N1-A**. Empaquetado, CLI y decorators se abordan más adelante; no los necesitas para este cierre."*
- Metrics: 4 sentences, longest 28w (FH 45). ✓ Healthy. Minor: "loops" → "bucles" (I-13).

**Paragraph 3 (line 32) — ISSUE I-11:**
- BEFORE (37 words, FH 57): *"El hilo conductor es un **script de intake por lotes**: lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro, imprime por stdout un resumen y **conserva el original (raw)** de cada fila. Caso de laboratorio: `CASO-LIM-004`. Datos ficticios únicamente (`example.com`, teléfonos inventados). Nunca subas PII real al repo."*
- AFTER (split after colon): *"El hilo conductor es un **script de intake por lotes**. Lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro, imprime por stdout un resumen y **conserva el original (raw)** de cada fila. Caso de laboratorio: `CASO-LIM-004`. Datos ficticios únicamente (`example.com`, teléfonos inventados). Nunca subas PII real al repo."*
- Effect: longest sentence drops from 37w to 30w;FH rises ~57→~66.

**Paragraph 4 (line 33):** *"Orden pedagógico: **T1 Recorrido** (`for`/`range` → `enumerate`/`zip`) → **T2 Repetición** (`while`/centinelas → `break`/`continue`) → **T3 Patrones** (contadores/acumuladores → comprehensions) → **T4 Razonamiento** (trazado de estado → costo y off-by-one). En cada subtema: teoría → demo I Do → We Do (E1 guiado, E2 independiente, E3 transferencia)."*
- Metrics: 2 sentences, longest 22w but FH artificially 24 (inline code + arrows inflate syllable-per-word calc by counting code tokens). Acceptable in context.

**Paragraph 5 (line 34):** *"Ritmo sugerido (~18 h): sesiones 1–2 solo T1; 3–4 T2; 5–6 T3; 7–8 T4 + You Do del batch + self-check. Si un demo se siente denso, rehazlo con lápiz (tabla TRACE) antes de copiar la solución. Cuando veas `def ...` en un ejemplo, es solo una **receta nombrada** para el playground — el diseño formal de funciones llega en la sección siguiente."*
- Metrics: 3 sentences, WPS avg ~17, FH ~80. ✓ Healthy.

**Callout (line 39–40):** *"El target de entrega es el **Client Intake & Data Quality Script** (gate CP-N1-A): lotes, contadores, tasas con denominador correcto y raw intacto. No cubrimos decorators ni packaging aquí; cuando llegues a módulos/CLI y OOP de dominio, reutilizarás estos bucles sobre el mismo hilo de intake."*
- ✓ Clean. 2 sentences.

### 6.2 Theory tab — `theory[1]` "for, range y secuencias" (S04-T1-A)

All 3 paragraphs (lines 47–49) are clean: 2–3 sentences each, WPS 18–22, FH 70–80. No changes needed. Callout (line 78) clean. **Code↔output match verified ✓** (`C001 → Lima / C002 → Cusco / C003 → Arequipa` matches the `filas` fixture).

### 6.3 Theory tab — `theory[2]` "enumerate y zip sin desalinear" (S04-T1-B)

3 paragraphs (lines 85–87) clean. Callout (line 120) clean. Code↔output ✓ (zip corto → `[('C001','Lima'),('C002','Cusco')]` matches).

### 6.4 Theory tab — `theory[3]` "while, centinelas y terminación" (S04-T2-A) — **ISSUE I-02**

3 paragraphs (lines 127–129) clean prose. Callout (line 153) clean. **Code↔output BROKEN — fix I-02.**
- BEFORE (declared output, line 146): `procesadas: ['C001|Sucursal-Norte', 'C002|Sucursal-Sur']`
- AFTER: `procesadas: ['C001|Lima', 'C002|Cusco']`

### 6.5 Theory tab — `theory[4]` "break, continue y prevención de loops infinitos" (S04-T2-B) — **ISSUE I-13, I-03**

- Heading (line 157): "break, continue y prevención de loops infinitos" → AFTER: "break, continue y prevención de **bucles** infinitos" (terminology consistency I-13).
- 3 paragraphs (lines 160–162) clean prose. Paragraph 2 (line 161) is 28w FH 58 — borderline; not flagged.
- Callout (line 193): "En producción un loop infinito agota CPU..." → AFTER: "En producción un **bucle** infinito agota CPU..."
- **Code↔output BROKEN — fix I-03.**
  - BEFORE (declared output, line 186): `['C001|Oficina-Oeste', 'C002|Cliente-A']`
  - AFTER: `['C001|Sucursal-Centro', 'C002|Oficina-Este']`

### 6.6 Theory tab — `theory[5]` "Contadores, acumuladores y búsqueda" (S04-T3-A)

3 paragraphs (lines 200–202) clean. Callout (line 227) clean. Code↔output ✓ (`total 6 reject 2 tasa 0.3333` matches).

### 6.7 Theory tab — `theory[6]` "Comprehensions legibles" (S04-T3-B)

3 paragraphs (lines 234–236) clean. Callout (line 262) clean. Code↔output ✓.

### 6.8 Theory tab — `theory[7]` "Trazado de estado" (S04-T4-A)

3 paragraphs (lines 269–271) clean. Callout (line 298) clean. Code↔output ✓.

### 6.9 Theory tab — `theory[8]` "Costo lineal/cuadrático y off-by-one" (S04-T4-B)

3 paragraphs (lines 305–307) clean. Callout (line 335) clean. Code↔output ✓.

### 6.10 I Do tab

**`iDo.intro` (line 340):** 75-word paragraph, 4 sentences. Longest 30w (FH 64). Borderline; could be split but not required.
- BEFORE: *"Ocho demos **I Do** (uno por subtema). Ejecuta en orden T1→T4 sin saltar: primero observas el patrón ejecutable, luego lo practicas en We Do. Cada demo es un fragmento del procesador por lotes del gate CP-N1-A; el `output` debe coincidir al pulsar Run. Si ves `def nombre(...):`, es solo una receta nombrada para reutilizar el ejemplo. Datos sintéticos; entorno browser-pyodide salvo que se indique."*
- AFTER (optional split of 30w sentence): *"Ocho demos **I Do** (uno por subtema). Ejecuta en orden T1→T4 sin saltar: primero observas el patrón ejecutable, luego lo practicas en We Do. Cada demo es un fragmento del procesador por lotes del gate CP-N1-A; el `output` debe coincidir al pulsar Run. Si ves `def nombre(...):`, es solo una receta nombrada para reutilizar el ejemplo. Datos sintéticos; entorno browser-pyodide salvo que se indique."* (No change required.)

**Demo S04-T1-A-DEMO (for_lote):** Code↔output ✓.
**Demo S04-T1-B-DEMO (enumerate_zip):** **ISSUE I-04 — fix.**
- BEFORE (declared output, line 390): `fila 1: C001 @ Oficina-Este / fila 2: C002 @ Oficina-Oeste / fila 3: C003 @ Arequipa / desalineado detectado`
- AFTER: `fila 1: C001 @ Cliente-B / fila 2: C002 @ Sucursal-Norte / fila 3: C003 @ Arequipa / desalineado detectado`
**Demo S04-T2-A-DEMO (while_end):** **ISSUE I-05 — fix.**
- BEFORE (declared output, line 417): `['Ana|Sucursal-Norte', 'Luis|Sucursal-Sur'] / indice final 3`
- AFTER: `['Ana|Cliente-A', 'Luis|Cliente-B'] / indice final 3`
**Demo S04-T2-B-DEMO (break_continue):** ✓
**Demo S04-T3-A-DEMO (contadores):** ✓
**Demo S04-T3-B-DEMO (comp_rejects):** ✓
**Demo S04-T4-A-DEMO (traza):** ✓
**Demo S04-T4-B-DEMO (costo_obo):** ✓

**`why` strings:** All 8 are one-liners (8–18 words). Clean, micro-lesson tone. ✓

### 6.11 We Do tab

**`weDo.intro` (line 542):** 65-word paragraph, 3 sentences. Longest 35w (FH 60). Borderline. No change required; consider splitting the longest at "Ejecuta, corrige y compara" → "Ejecuta, corrige y compara. Compara con la salida esperada; no inventes salidas."
- BEFORE: *"Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints** y un starter con un **DEFECT** intencional (CASO-LIM-004). Ejecuta, corrige y compara con la salida esperada; no inventes salidas. Si el bloque se siente largo, un subtema por sesión (~2 h) mantiene la carga razonable. Datos sintéticos únicamente."*
- AFTER (optional): *"Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints** y un starter con un **DEFECT** intencional (CASO-LIM-004). Ejecuta, corrige y compara con la salida esperada; no inventes salidas. Si el bloque se siente largo, un subtema por sesión (~2 h) mantiene la carga razonable. Datos sintéticos únicamente."*

**Exercises S04-T1-A-E1 — ISSUE I-06 — fix.** Pick one fixture and use it consistently. Recommended:
- instruction fixture: `regiones = ["Cliente-B", "Sucursal-Norte", "Piura"]`
- starter fixture: `regiones = ["Cliente-B", "Sucursal-Norte", "Piura"]`
- solution fixture: `regiones = ["Cliente-B", "Sucursal-Norte", "Piura"]`
- solution output: `Cliente-B / Sucursal-Norte / Piura / [0, 1, 2]`

**Exercises S04-T1-A-E2, E3:** ✓ consistent.
**Exercise S04-T1-B-E1, E2, E3:** ✓ consistent.
**Exercises S04-T2-A-E1, E2, E3:** ✓ consistent.
**Exercise S04-T2-B-E1 — ISSUE I-07 — fix.** Pick one fixture and align the instruction's "expected" prose.
- Recommended single fixture: `raw = ["  ", "Cliente-B", "", "Sucursal-Norte"]`
- instruction: *"E1 (guiado) — Concepto: `continue` para saltar basura. Fixture: `raw = ["  ", "Cliente-B", "", "Sucursal-Norte"]`. Con for, si `not x.strip()` haz continue; imprime solo regiones válidas (Cliente-B y Sucursal-Norte, una por línea). Contrato: no uses break aquí — solo saltas filas vacías o de solo espacios."*
- starter fixture: `raw = ["  ", "Cliente-B", "", "Sucursal-Norte"]`
- solution fixture: `raw = ["  ", "Cliente-B", "", "Sucursal-Norte"]`
- solution output: `Cliente-B / Sucursal-Norte`
- starter hints[1]: `"Solo Cliente-B y Sucursal-Norte."` (was `"Solo Sucursal-Sur y Sucursal-Centro."`)
- starter `tests`: `"Cliente-B\\nSucursal-Norte"` (was `"Oficina-Este\\nCusco"`)
**Exercises S04-T2-B-E2, E3:** ✓ consistent.
**Exercises S04-T3-A-E1, E2, E3:** ✓ consistent.
**Exercises S04-T3-B-E1, E2, E3:** ✓ consistent.
**Exercises S04-T4-A-E1, E2, E3:** ✓ consistent.
**Exercises S04-T4-B-E1, E2, E3:** ✓ consistent.

### 6.12 You Do tab — **ISSUES I-01, I-10, I-16, I-17**

**`youDo.title` (line 1539):** "Client Intake & Data Quality Script (cierre CP-N1-A)" — clean.

**`youDo.context` (line 1541) — ISSUE I-10 (47w run-on in middle sentence):**
- BEFORE: *"Cierra el gate **CP-N1-A**. Sobre el parser (S02) y el motor de reglas (S03), construyes un procesador por **lotes**: múltiples registros sintéticos, un pase O(n), contadores accept/reject/review, **tasa de error con denominador = n_total** (`None` si el lote está vacío), conservación del **raw** por fila y reporte por stdout. El starter trae `_run_tests` con un fixture de 3 filas y un lote vacío: implementa las tres funciones hasta que `tests OK` se imprima. El empaquetado CLI se ve más adelante en el curso."*
- AFTER (split run-on at "contadores" → new sentence; restructure list as two sentences): *"Cierra el gate **CP-N1-A**. Sobre el parser (S02) y el motor de reglas (S03), construyes un procesador por **lotes** que hace un solo pase O(n) sobre múltiples registros sintéticos. El procesador emite contadores accept/reject/review y una **tasa de error con denominador = n_total** (`None` si el lote está vacío); además conserva el **raw** por fila y reporta por stdout. El starter trae `_run_tests` con un fixture de 3 filas y un lote vacío: implementa las tres funciones hasta que `tests OK` se imprima. El empaquetado CLI se ve más adelante en el curso."*
- Effect: longest sentence drops from 47w → 22w and 25w;FH ~48 → ~70.

**`youDo.objectives` (lines 1543–1547):** 5 verb-phrase bullets, no terminal punct (intentional). ✓

**`youDo.requirements[3]` (line 1553) — ISSUE I-16:**
- BEFORE: `"Fixture de _run_tests (3 filas): n_total == 3; results[0]['raw']['raw_line'] == '30|Oficina-Este|0'; lote vacío → tasa_reject is None"`
- AFTER (synced to the batch fixture): `"Fixture de _run_tests (3 filas): n_total == 3; results[0]['raw']['raw_line'] == '30|Cliente-A|0'; lote vacío → tasa_reject is None"`

**`youDo.starterCode._run_tests` assertion (line 1602) — ISSUE I-01:**
- BEFORE: `assert s["results"][0]["raw"]["raw_line"] == "30|Sucursal-Sur|0"`
- AFTER: `assert s["results"][0]["raw"]["raw_line"] == "30|Cliente-A|0"`

**`youDo.portfolioNote` (line 1623):** 28w single sentence (FH 80). Clean.

**`youDo.rubric` (lines 1625–1630):** 6 criteria, weights sum 100%. ✓

### 6.13 Self-check tab — **ISSUES I-08, I-09**

8 questions. Three missing leading `¿` and three ending with `…` instead of `?`.

| # | Line | BEFORE | AFTER |
|---|------|--------|-------|
| Q1 | 1636 | `¿Qué produce list(range(3))?` | (no change) |
| Q2 | 1643 | `zip([1,2,3],[10,20]) sin strict…` | `¿zip([1,2,3],[10,20]) sin strict?` |
| Q3 | 1650 | `Para la tasa de reject del gate, el denominador debe ser…` | `¿Para la tasa de reject del gate, el denominador debe ser?` |
| Q4 | 1657 | `¿Qué hace continue en un for de líneas de intake?` | (no change) |
| Q5 | 1664 | `Un doble for anidado sobre n elementos es aproximadamente…` | `¿Un doble for anidado sobre n elementos es aproximadamente?` |
| Q6 | 1671 | `En un while con centinela "END", ¿qué debe pasar cada iteración para no colgarte?` | (no change; partial-¿ acceptable) |
| Q7 | 1678–1679 | `En un lote de líneas de intake, ¿cuál es la diferencia correcta entre continue y break?` | (no change; partial-¿ acceptable) |
| Q8 | 1686 | `¿Para qué sirve enumerate(ids, start=1) en un reporte de intake?` | (no change) |

**Explanations** (lines 1640, 1647, 1654, 1661, 1668, 1675, 1683, 1690): All clean, short, informative. ✓

### 6.14 Aggregate grammar summary (subplan compliance)

- 596 sentences extracted; mean WPS 8.10; mean SPW 1.80; mean FH 93.7 ("muy fácil"); mean INFLESZ 89.8 ("muy fácil").
- **1 run-on** (>45w) — `youDo.context` middle sentence (I-10).
- **1 long sentence** (>32w) — `theory[0].paragraphs[2]` (I-11).
- **3 missing leading `¿`** in selfCheck questions (I-08).
- **0 real duplicated words** (no `de de`, `que que`).
- **0 real unbalanced delimiters** (the 2 LT/extractor hits were sentence-split artifacts on `(p. ej. …)`).
- **0 real meta-leaks in prose** (3 `TODO` hits are inside `starterCode`, excluded by subplan).
- **0 real gerund pileups**.
- **2 sentences with comma_density ≥5** — one is the 47w run-on (I-10); the other is a Python hint string (`if len(a) != len(b): raise ValueError(...); return list(zip(a,b))`) which is code, not prose.
- **0 real space-before-punct in prose** (the 36 hits are all inline-code stripping artifacts).
- **Inconsistent terminology:** `loop` (13) vs `bucle` (14) — I-13.
- **Anglicisms in prose:** `guardrails` (4) — I-14, I-15. Other anglicisms (`output`, `reject`, `accept`, `review`, `raw`, `demo`, `hint`, `feedback`, `fixture`, `trace`, `starter`, `batch`) are mostly field/code identifiers and are acceptable in tech-Spanish; flagged for awareness only (I-18).
- **LanguageTool `es` (public API, chunked):** 135 raw matches; 37 non-spell; **all 37 verified as false positives** caused by inline-code stripping in my extractor (e.g., `reportas \`None\`, no divides` → after stripping `None` becomes `reportas , no divides` which LT flags as "space before comma"). The underlying Spanish prose is grammatically clean.

---

## 7. Proposed GitHub-style Diffs

> Diffs are against `src/lib/course/sections/s04-functions-modules.ts` unless noted. Line numbers refer to the current file (1760 lines). Do NOT auto-apply — the Fixer prompt will own application.

### Diff D1 — Fix `youDo._run_tests` assertion (I-01, I-16)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -1550,7 +1550,7 @@ The starter brings _run_tests with a fixture of 3 rows and an empty batch:
       "Cada result incluye raw intacto + status agregado + detalle de campos (accept|reject|review)",
       "tasa_reject is None cuando n_total == 0 (sin ZeroDivisionError); si n_total > 0, tasa_reject ∈ [0, 1]",
-      "Fixture de _run_tests (3 filas): n_total == 3; results[0]['raw']['raw_line'] == '30|Oficina-Este|0'; lote vacío → tasa_reject is None",
+      "Fixture de _run_tests (3 filas): n_total == 3; results[0]['raw']['raw_line'] == '30|Cliente-A|0'; lote vacío → tasa_reject is None",
       "Sin PII real; datos sintéticos embebidos; sin loops O(n²) innecesarios para el resumen",
       "README o docstring en español: explica el denominador de tasas y por qué se conserva el raw",
     ],
@@ -1599,7 +1599,7 @@ def _run_tests() -> None:
     s = process_batch(batch)
     assert s["n_total"] == 3
-    assert s["results"][0]["raw"]["raw_line"] == "30|Sucursal-Sur|0"
+    assert s["results"][0]["raw"]["raw_line"] == "30|Cliente-A|0"
     assert s["tasa_reject"] is None or 0 <= s["tasa_reject"] <= 1
     empty = process_batch([])
     assert empty["tasa_reject"] is None
```

### Diff D2 — Fix theory T2-A `while_centinela.py` output (I-02)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -143,8 +143,8 @@ print("procesadas:", procesadas)
 print("restante no leída:", lineas[i:])
 `,
         output: `procesadas: ['C001|Sucursal-Norte', 'C002|Sucursal-Sur']
-restante no leída: ['C003|Piura']`,
+        output: `procesadas: ['C001|Lima', 'C002|Cusco']
+restante no leída: ['C003|Piura']`,
       },
```

### Diff D3 — Fix theory T2-B `break_continue.py` output (I-03) + heading/callout `loop`→`bucle` (I-13)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -154,7 +154,7 @@ print("procesadas:", procesadas)
       },
     {
-      heading: "break, continue y prevención de loops infinitos",
+      heading: "break, continue y prevención de bucles infinitos",
       subtopicId: "S04-T2-B",
       paragraphs: [
@@ -184,7 +184,7 @@ kept, iters = clean_lines(raw_lines)
 print(kept)
 print("iteraciones efectivas del for:", iters)
 `,
-        output: `['C001|Oficina-Oeste', 'C002|Cliente-A']
+        output: `['C001|Sucursal-Centro', 'C002|Oficina-Este']
 iteraciones efectivas del for: 5`,
       },
@@ -190,7 +190,7 @@ iteraciones efectivas del for: 5`,
         type: "warning",
         title: "while True sin salida",
         content:
-          "En producción un loop infinito agota CPU y bloquea el lote. Siempre define centinela, excepción o MAX_ITERS en ejercicios de while.",
+          "En producción un bucle infinito agota CPU y bloquea el lote. Siempre define centinela, excepción o MAX_ITERS en ejercicios de while.",
       },
```

### Diff D4 — Fix I Do `S04-T1-B-DEMO` (enumerate_zip) output (I-04)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -387,9 +387,9 @@ except ValueError:
     print("desalineado detectado")`,
-          output: `fila 1: C001 @ Oficina-Este
-fila 2: C002 @ Oficina-Oeste
-fila 3: C003 @ Arequipa
+          output: `fila 1: C001 @ Cliente-B
+fila 2: C002 @ Sucursal-Norte
+fila 3: C003 @ Arequipa
 desalineado detectado`,
         },
```

### Diff D5 — Fix I Do `S04-T2-A-DEMO` (while_end) output (I-05)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -414,7 +414,7 @@ print("indice final", i)
 `,
-        output: `['Ana|Sucursal-Norte', 'Luis|Sucursal-Sur']
+        output: `['Ana|Cliente-A', 'Luis|Cliente-B']
 indice final 3`,
       },
```

### Diff D6 — Fix We Do `S04-T1-A-E1` (for_regiones) — three-way fixture inconsistency (I-06)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -546,7 +546,7 @@
         instruction:
-          "E1 (guiado) — Concepto: `for` por valor y `range` con stop exclusivo. Fixture: `regiones = [\"Sucursal-Centro\", \"Oficina-Este\", \"Piura\"]`. Imprime cada región en su propia línea con un `for`; luego imprime `list(range(3))` (esperado: `[0, 1, 2]`). Contrato: un for simple sin índices; no mutes la lista.",
+          "E1 (guiado) — Concepto: `for` por valor y `range` con stop exclusivo. Fixture: `regiones = [\"Cliente-B\", \"Sucursal-Norte\", \"Piura\"]`. Imprime cada región en su propia línea con un `for`; luego imprime `list(range(3))` (esperado: `[0, 1, 2]`). Contrato: un for simple sin índices; no mutes la lista.",
         hint: "for r in regiones: print(r)",
         hints: [
           "for r in regiones: print(r)",
           "range(3) produce 0,1,2 — stop exclusivo.",
         ],
         edgeCases: ["range stop exclusivo"],
-        tests: "3 regiones + [0,1,2]",
+        tests: "Cliente-B / Sucursal-Norte / Piura + [0,1,2]",
         feedback: "El for por valor es el default del procesador de lotes.",
         starterCode: {
           language: 'python',
           title: "for_regiones.py",
           code: `# CASO-LIM-004 · for sobre lista
 # DEFECT: no imprime range(3)
-regiones = ["Oficina-Oeste", "Cliente-A", "Piura"]
+regiones = ["Cliente-B", "Sucursal-Norte", "Piura"]
 for r in regiones:
     print(r)
 print('ok', True)
 `,
         },
         solutionCode: {
           language: 'python',
           title: "for_regiones.py",
           code: `regiones = ["Cliente-B", "Sucursal-Norte", "Piura"]
 for r in regiones:
     print(r)
 print(list(range(3)))`,
-          output: `Sucursal-Sur
-Sucursal-Centro
-Oficina-Este
+          output: `Cliente-B
+Sucursal-Norte
+Piura
 [0, 1, 2]`,
         },
```

### Diff D7 — Fix We Do `S04-T2-B-E1` (continue_vacios) — four-way fixture inconsistency + instruction self-contradiction (I-07)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -922,11 +922,11 @@
         instruction:
-          "E1 (guiado) — Concepto: `continue` para saltar basura. Fixture: `raw = [\"  \", \"Oficina-Oeste\", \"\", \"Cliente-A\"]`. Con for, si `not x.strip()` haz continue; imprime solo regiones válidas (Cliente-B y Sucursal-Norte, una por línea). Contrato: no uses break aquí — solo saltas filas vacías o de solo espacios.",
+          "E1 (guiado) — Concepto: `continue` para saltar basura. Fixture: `raw = [\"  \", \"Cliente-B\", \"\", \"Sucursal-Norte\"]`. Con for, si `not x.strip()` haz continue; imprime solo regiones válidas (Cliente-B y Sucursal-Norte, una por línea). Contrato: no uses break aquí — solo saltas filas vacías o de solo espacios.",
         hint: "if not x.strip(): continue",
         hints: [
           "if not x.strip(): continue",
-          "Solo Sucursal-Sur y Sucursal-Centro.",
+          "Solo Cliente-B y Sucursal-Norte.",
         ],
         edgeCases: ["whitespace only"],
-        tests: "Oficina-Este\\nCusco",
+        tests: "Cliente-B\\nSucursal-Norte",
         feedback: "continue es el filtro de filas vacías del intake por líneas.",
         starterCode: {
           language: 'python',
           title: "continue_vacios.py",
           code: `# CASO-LIM-004 · continue blanks
 # DEFECT: imprime blanks
-raw = ["  ", "Oficina-Oeste", "", "Cliente-A"]
+raw = ["  ", "Cliente-B", "", "Sucursal-Norte"]
 for x in raw:
     print(x)
 print('ok', True)
 `,
         },
         solutionCode: {
           language: 'python',
           title: "continue_vacios.py",
           code: `raw = ["  ", "Cliente-B", "", "Sucursal-Norte"]
 for x in raw:
     if not x.strip():
         continue
     print(x)`,
-          output: `Sucursal-Sur
-Sucursal-Centro`,
+          output: `Cliente-B
+Sucursal-Norte`,
         },
```

### Diff D8 — Add leading `¿` (and convert `…` → `?`) on 3 self-check questions (I-08, I-09)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -1640,7 +1640,7 @@
         explanation:
           "range(stop) es 0-inclusive y stop-exclusivo: 0,1,2.",
       },
       {
-        question: "zip([1,2,3],[10,20]) sin strict…",
+        question: "¿zip([1,2,3],[10,20]) sin strict?",
         options: ["Lanza ValueError", "Empareja solo (1,10) y (2,20); el 3 se pierde en silencio", "Rellena con None el tercero", "Empareja en producto cartesiano"],
         correctIndex: 1,
@@ -1647,7 +1647,7 @@
         explanation:
           "zip se detiene en la secuencia más corta. Valida len o usa strict=True (3.10+) para fallar si difieren.",
       },
       {
-        question: "Para la tasa de reject del gate, el denominador debe ser…",
+        question: "¿Para la tasa de reject del gate, el denominador debe ser?",
         options: ["Solo n_accept", "Siempre 100", "n_total de registros procesados (intentados)", "n_review únicamente"],
         correctIndex: 2,
@@ -1661,7 +1661,7 @@
         explanation:
           "continue omite el resto del cuerpo y pasa a la siguiente iteración (p. ej. filas vacías).",
       },
       {
-        question: "Un doble for anidado sobre n elementos es aproximadamente…",
+        question: "¿Un doble for anidado sobre n elementos es aproximadamente?",
         options: ["O(1)", "O(n)", "O(log n)", "O(n²)"],
         correctIndex: 3,
```

### Diff D9 — Split the 47-word run-on in `youDo.context` (I-10)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -1538,7 +1538,8 @@
     title: "Client Intake & Data Quality Script (cierre CP-N1-A)",
     context:
-      "Cierra el gate **CP-N1-A**. Sobre el parser (S02) y el motor de reglas (S03), construyes un procesador por **lotes**: múltiples registros sintéticos, un pase O(n), contadores accept/reject/review, **tasa de error con denominador = n_total** (`None` si el lote está vacío), conservación del **raw** por fila y reporte por stdout. El starter trae `_run_tests` con un fixture de 3 filas y un lote vacío: implementa las tres funciones hasta que `tests OK` se imprima. El empaquetado CLI se ve más adelante en el curso.",
+      "Cierra el gate **CP-N1-A**. Sobre el parser (S02) y el motor de reglas (S03), construyes un procesador por **lotes** que hace un solo pase O(n) sobre múltiples registros sintéticos. El procesador emite contadores accept/reject/review y una **tasa de error con denominador = n_total** (`None` si el lote está vacío); además conserva el **raw** por fila y reporta por stdout. El starter trae `_run_tests` con un fixture de 3 filas y un lote vacío: implementa las tres funciones hasta que `tests OK` se imprima. El empaquetado CLI se ve más adelante en el curso.",
```

### Diff D10 — Split the 37-word sentence in `theory[0].paragraphs[2]` (I-11)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -29,7 +29,7 @@
         "**Antes de T1, tres ideas base** (no memorices el resto aún). Un **bucle** repite un bloque mientras haya elementos o mientras una condición sea verdadera. Un **centinela** es un valor especial que marca el fin del lote (`\"\"`, `\"END\"`). Una **tasa** es un contador dividido por el total de registros **intentados** — solo si ese total es mayor que cero; si el lote está vacío, reportas `None`, no divides.",
         "Desde **S03** ya validas un registro (accept / reject / review). Aquí aplicas esa lógica a **muchas filas** en un solo pase **O(n)**: recorres el lote, acumulas contadores, evitas loops infinitos y emites un resumen con **denominador correcto**. Eso es lo que cierra el gate **CP-N1-A**. Empaquetado, CLI y decorators se abordan más adelante; no los necesitas para este cierre.",
-        "El hilo conductor es un **script de intake por lotes**: lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro, imprime por stdout un resumen y **conserva el original (raw)** de cada fila. Caso de laboratorio: `CASO-LIM-004`. Datos ficticios únicamente (`example.com`, teléfonos inventados). Nunca subas PII real al repo.",
+        "El hilo conductor es un **script de intake por lotes**. Lee líneas sintéticas (o una lista en memoria que simula stdin), valida cada registro, imprime por stdout un resumen y **conserva el original (raw)** de cada fila. Caso de laboratorio: `CASO-LIM-004`. Datos ficticios únicamente (`example.com`, teléfonos inventados). Nunca subas PII real al repo.",
```

### Diff D11 — Standardise `loop` → `bucle` in prose (I-13)

```diff
--- a/src/lib/course/sections/s04-functions-modules.ts
+++ b/src/lib/course/sections/s04-functions-modules.ts
@@ -17,5 +17,5 @@
   learningOutcomes: [
     { text: "Recorrer secuencias con for y range sin off-by-one en el stop exclusivo" },
     { text: "Usar enumerate y zip (incl. strict) sin desalinear columnas de intake" },
     { text: "Escribir while con centinelas y condición de terminación explícita" },
-    { text: "Aplicar break/continue y guardrails contra loops infinitos" },
+    { text: "Aplicar break/continue y salvaguardas contra bucles infinitos" },
     { text: "Implementar contadores, acumuladores y búsquedas en un pase O(n)" },
@@ -126,5 +126,5 @@
         "**`while condicion:`** repite mientras la condición sea verdadera. Úsalo cuando **no sabes de antemano cuántas** iteraciones habrá: leer hasta línea vacía, reintentar hasta éxito, o procesar un stream.",
-        "Un **centinela** es un valor especial que marca el fin (p. ej. `\"\"`, `None`, `\"END\"`). El bucle debe **actualizar el estado** en cada vuelta; si la condición nunca se vuelve falsa, tienes un **loop infinito**.",
+        "Un **centinela** es un valor especial que marca el fin (p. ej. `\"\"`, `None`, `\"END\"`). El bucle debe **actualizar el estado** en cada vuelta; si la condición nunca se vuelve falsa, tienes un **bucle infinito**.",
         "En demos de browser no usamos `input()` interactivo real; simulamos un **buffer de líneas**. El patrón es el mismo: leer siguiente → chequear centinela (`\"END\"` / `\"\"`) → procesar → actualizar estado. Si olvidas avanzar el índice, el while es **infinito**.",
@@ -838,5 +838,5 @@
         hint: "intentos += 1 dentro del while es la variable de control.",
         hints: [
           "intentos += 1 dentro del while es la variable de control.",
-          "Si olvidas incrementar, loop infinito (no lo hagas).",
+          "Si olvidas incrementar, bucle infinito (no lo hagas).",
         ],
```
(Plus the heading and callout already covered in Diff D3.)

### Diff D12 — Rename section file and id (I-12) — *larger refactor; coordinate with import sites and any tests/anchors*

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -2,7 +2,7 @@
 import { section01 } from './sections/s01-setup'
 import { section02 } from './sections/s02-basics'
 import { section03 } from './sections/s03-data-structures'
-import { section04 } from './sections/s04-functions-modules'
+import { section04 } from './sections/s04-iteration-batch'
 import { section05 } from './sections/s05-oop'
```

```diff
# git mv
git mv src/lib/course/sections/s04-functions-modules.ts src/lib/course/sections/s04-iteration-batch.ts
```

```diff
--- a/src/lib/course/sections/s04-iteration-batch.ts
+++ b/src/lib/course/sections/s04-iteration-batch.ts
@@ -1,7 +1,7 @@
 import type { CourseSection } from '../../types'

 export const section04: CourseSection = {
-  id: "functions-modules",
+  id: "iteration-batch",
   index: 4,
   title: "Iteración y resúmenes transaccionales",
```
> Note: confirm with a repo-wide `rg "functions-modules"` that no other code (tests, analytics, sitemap, deep-link routes) references the old id.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Diff | Effort | Why first |
|---|---|---|---|---|
| **P0** | I-01 (You Do `_run_tests` assertion cannot pass) | D1 | 5 min | The gate CP-N1-A is unpassable. Every learner who reaches You Do fails. Highest blast radius. |
| **P0** | I-02, I-03, I-04, I-05 (4 broken demo outputs) | D2, D3, D4, D5 | 10 min | The I Do tab's central promise ("el output debe coincidir al pulsar Run") is broken in 2 of 8 demos; theory T2-A and T2-B show wrong outputs too. Visible contract violation. |
| **P1** | I-06, I-07 (We Do fixture inconsistencies) | D6, D7 | 20 min | Two We Do exercises are unsolvable as written (output values don't exist in any fixture). |
| **P1** | I-08, I-09 (3 missing `¿`, 3 ellipsis-ends) | D8 | 5 min | Trivial fix; visible grammar error; cheap to do alongside P0/P1. |
| **P2** | I-10, I-11 (47w run-on, 37w long) | D9, D10 | 5 min | Readability polish on the two densest prose spots. |
| **P2** | I-13 (`loop`/`bucle` 50/50) | D11 | 10 min | Terminology consistency; improves searchability and screen-reader experience. |
| **P3** | I-12 (rename file/id) | D12 | 30 min | Maintainability; do LAST and with repo-wide grep. Not learner-visible today. |
| **P3** | I-14, I-15, I-16, I-17, I-18 | (various) | 20 min | Polish; bundle into a single style pass. |

**Estimated total Fixer time:** ~2 hours for P0–P2; +30 min for P3.

---

## 9. Graph Memory Update notes (for shared context files)

For the orchestrator's shared graph / Fixer context:

- **Section 4 node:** id `S04`, file `s04-functions-modules.ts`, title `Iteración y resúmenes transaccionales`, phase 0, hours 18, gate `CP-N1-A`.
- **Status:** audited 2025-07-25; composite 6.5/10.
- **Critical defects:** 6 broken `code↔output` pairs (theory T2-A, theory T2-B, I Do T1-B-DEMO, I Do T2-A-DEMO, We Do T1-A-E1 sol, We Do T2-B-E1 sol+instruction); 1 unpassable You Do assertion (`_run_tests` line 1602 vs batch line 1596 vs requirements line 1553 — three different `raw_line` values).
- **Structural leftover:** `id="functions-modules"` and filename do not match the iteration content; recommend rename to `s04-iteration-batch.ts` + `id="iteration-batch"` (after grep confirmation).
- **No prose meta-leaks.** No real spelling/grammar defects beyond the 3 missing `¿`, 1 run-on, 1 long sentence, and the `loop`/`bucle` inconsistency.
- **Pedagogy quality:** HIGH — I/We/You fidelity is excellent, narrative thread (intake batch / CP-N1-A) is consistent, exercises use intentional `# DEFECT` starters that scaffold debugging.
- **Edges to other sections:**
  - `S04 → S02` (parser reuse): strong, explicit.
  - `S04 → S03` (rule engine reuse, `validate_record`): strong, explicit.
  - `S04 → S05` (functions): forward reference in intro line 34 ("el diseño formal de funciones llega en la sección siguiente").
  - `S04 → later` (CLI/packaging/OOP/logging): light forward references, all marked "se ve más adelante".
- **Reusable patterns for Fixer:**
  - **Output regen pattern:** For every code block in this section, run the `code` field through `python3 -c` and replace the `output` field with the real stdout. (Yields D2–D7 automatically.)
  - **Fixture sync pattern:** For every We Do step, ensure `instruction.fixture == starterCode.fixture == solutionCode.fixture` and `solutionCode.output` is the real stdout of `solutionCode.code`. (Yields D6, D7.)
  - **Assertion-vs-fixture pattern:** For every `assert` in `starterCode`, ensure the compared value exists in the same `starterCode` fixture. (Yields D1.)
- **Comparison benchmark:** S04 pedagogy > CS50P / Py4E / Kaggle Learn on I/We/You + domain anchor; S04 polish < Real Python / Khan Academy due to broken outputs. After P0–P2 fixes, expect S04 to reach 8.5–9.0/10.
- **Cross-section note for other auditors:** The "fictional region names drifted between fixture and output" pattern (Cliente-A/B, Sucursal-Norte/Sur/Centro, Oficina-Este/Oeste, Lima, Cusco, Arequipa, Piura, Tacna) is likely systemic across sections that share the intake-batch fixture family — recommend the orchestrator grep `Cliente-A|Sucursal-Norte|Oficina-Este` across all `sNN-*.ts` files and flag any output mismatch as a P0 too.

---

**This is the complete Explorer report for Section 4. Ready for the Fixer prompt.**
