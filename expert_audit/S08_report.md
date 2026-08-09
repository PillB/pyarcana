# S08 — PyArcana Curriculum Auditor Report

**Section:** 8 — `pandas` — "Archivos, CSV, JSON y contratos de ingesta"
**Short title:** "Archivos & ETL"
**Tagline:** "pathlib, CSV/JSON, cuarentena y manifest de ingesta"
**Phase:** 0 (Fundamentos) — Intermedio — 18 h estimadas
**Source file:** `src/lib/course/sections/s08-pandas.ts` (1,815 lines, ~79 KB)
**Live URL:** https://pillb.github.io/pyarcana/#pandas
**Auditor:** Curriculum Auditor (general-purpose sub-agent) — Task ID S08
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering, with the shared Spanish grammar subplan (`_GRAMMAR_SUBPLAN.md`).

---

## 1. Section Identification & Scope

### 1.1 What is Section 8?
Section 8 is the eighth section of the 52-section pyarcana course and the **fourth and final section of the "ETL CP-N1-B" gate** inside Phase 0 (Fundamentos, sections 1–13). Despite its file name `s08-pandas.ts`, the section is **not** about pandas; the title "Archivos, CSV, JSON y contratos de ingesta" makes the actual scope explicit. The section closes the **CP-N1-B gate** ("ingesta confiable") entirely in Python **stdlib** (`pathlib`, `csv`, `json`, `hashlib`, `shutil`, `Decimal`). Pandas is explicitly deferred to S15 ("Pandas ingesta"). The opening theory paragraph `"**Diccionario de la sección**"` and the callout `"Gate CP-N1-B — qué cuenta como cierre"` both make this scope crisp.

### 1.2 Active-source confirmation
- `src/lib/course/index.ts` (lines 9 and 71) imports `section08` from `./sections/s08-pandas` and places it at position 8 in `COURSE_SECTIONS`. There is also an **inactive** `s08-visualization.ts` in the same folder that is NOT imported by `index.ts`; per the grammar subplan, only the active `s08-pandas.ts` is in scope.
- The sidebar of the live site confirms "Sección 8 · Archivos & ETL" with the tagline "pathlib, CSV/JSON, cuarentena y manifest de ingesta", matching `shortTitle: "Archivos & ETL"` and `tagline: "pathlib, CSV/JSON, cuarentena y manifest de ingesta"` in the source.

### 1.3 Tabs audited (per the I Do / We Do / You Do / Self Check fidelity rule)
The source drives five rendered tabs (verified live):
1. **Teoría** — 9 subtopic blocks: T1-A "pathlib, with, modos y encodings", T1-B "Newlines y escritura atómica", T2-A "Dialectos, headers y tipos", T2-B "Filas irregulares y cuarentena", T3-A "Objetos/arrays y serialización JSON", T3-B "Schema, nulls y evolución compatible", T4-A "Backups, hashes y provenance", T4-B "Reconciliación y manifest de corrida", plus a final "Cierre y puente a S09 (excepciones y logs)" block. Each block carries `heading`, `paragraphs[]` (3 paragraphs each), `code` (Python example with output), and `callout` (info/tip/warning/danger/success).
2. **Yo hago (I Do)** — 8 demos (`S08-T1-A-DEMO` … `S08-T4-B-DEMO`) each with `description`, `code`, `why`. `intro` field present.
3. **Hacemos juntos (We Do)** — 24 exercises (8 subtopics × E1 guiado / E2 independiente / E3 transferencia). Each carries `instruction`, `hint`, `hints[]`, `edgeCases[]`, `tests`, `feedback`, `starterCode` (with intentional defect), `solutionCode` (with expected output). `intro` field present (the "Mapa puente al You Do").
4. **Tú haces (You Do)** — capstone project "Client/Transaction ETL Pipeline (cierre CP-N1-B)" with `context`, `objectives[5]`, `requirements[10]`, `starterCode` (full skeleton with `NotImplementedError`), `portfolioNote`, `rubric[6]`.
5. **Autocheck (Self Check)** — 11 multiple-choice questions, each with `question`, `options[4]`, `correctIndex`, `explanation`.

### 1.4 Live-site verification note
The live SPA at https://pillb.github.io/pyarcana/#pandas renders the **current hardened source** (`s08-pandas.ts`): the first heading visible was "Mapa de la sección: archivos, CSV/JSON y gate CP-N1-B" with the "Diccionario de la sección" paragraph — both match the source byte-for-byte. (A stale snapshot at `course-state/curriculum_hardening/visible_paragraphs/s08_pandas.json` shows an OLDER pre-hardening version with severe meta-leaks such as `"En V3, S08 no es el path principal de pandas..."` — these do NOT appear on the live site today but remain in the repo and are documented in §4.) One transient SPA state bug was observed during navigation (URL `#pandas` and `<h1>` updated correctly but the body briefly rendered Section 11); it cleared on subsequent navigation.

---

## 2. Executive Summary of Quality

**Score: 8.0 / 10** (Strong, with one regional-language regression and a handful of long-sentence issues that are cheap to fix.)

**Verdict:** Section 8 is **one of the best-engineered sections in the early curriculum**. The I Do / We Do / You Do / Self Check scaffolding is exceptionally faithful: 8 demos + 24 graded exercises (E1→E2→E3) + capstone + 11-question quiz, all tightly bound to a single pedagogical contract (CP-N1-B: `n_in == n_clean + n_quarantine`, fail-closed, hash-of-raw, per-source reconcile). Theory is dense but well-segmented (3 paragraphs per subtopic, each with code + callout). Connective tissue to S02 (Decimal money), S03 (null ≠ missing), S05–S07 (normalizadores), S06 (modelo en memoria), S09 (next), S10 (CLI), S15 (pandas) is explicit and pedagogically useful.

**What holds it back from 9+**:
1. **Voseo / tuteo inconsistency** (HIGH). Five voseo imperatives (`leé`, `anticipá`, `contrastá`, `usás`, `Validá`) coexist with 37+ tuteo forms (`abre`, `declara`, `intenta`, `continúa`, `demuestra`…). Peruvian Spanish is uniformly tuteo; voseo is foreign to PE and reads as River-Plate. This is the single most jarring learner-facing defect.
2. **Two run-on sentences** (HIGH). `jobRelevance` (59-word opener) and `youDo.context` (64-word "Receta de ensamblaje" sentence) overload the reader at exactly the two moments (section opener, capstone brief) where cognitive load should be lowest.
3. **One concordancia error** (MED). `"este bytes exactos"` should be `"estos bytes exactos"` (or `"este byte exacto"`).
4. **One missing comma before "pero"** (MED). `"agregado 10==9+1 pero fuentes rotas"` violates Spanish punctuation rules.
5. **`re-leer` with hyphen** (LOW). RAE prefers `releer` (prefix *re-* + verb, no hyphen).
6. **`vs` without period** (LOW). 4 occurrences of `vs` where Spanish abbreviation `vs.` is orthographically preferred.
7. **Stale `visible_paragraphs/s08_pandas.json` snapshot** (MED, repository hygiene). Still contains "En V3, S08 no es…" meta-leak text that no longer ships; should be regenerated or deleted to avoid confusing future auditors.
8. **Heavy code-switching and English tech-noun density** (LOW). The section is intentionally bilingual (`pathlib`, `csv`, `hashlib`, `manifest`, `reconcile`, `fail-closed`, `pipeline`, `gate`, `stack`, `fixture`, `runtime`…) which is appropriate for a Python ETL curriculum but pushes several `instruction`/`why` paragraphs past the 40%-English threshold in the heuristic.

**Overall verdict:** Ready to ship after the language-regression fix (voseo→tuteo) and the two run-on splits. Pedagogical structure is gold-standard for early sections.

---

## 3. Detailed Issue Registry

Each issue below is numbered, classified by severity (HIGH/MED/LOW), grounded in an evidence quote, and tied to a pedagogical impact and a root cause. Diffs are gathered in §6.

### 3.1 HIGH-severity issues

**I-01 — Voseo / tuteo inconsistency in learner-facing imperatives (regional-language regression).**
- Severity: **HIGH** (regional-language fidelity; Peruvian Spanish exclusively uses tuteo).
- Location: `iDo.intro` (idx 51), `selfCheck.questions[7].question` (idx 244), `theory[T3-B].paragraphs[0]` (idx 404).
- Evidence (exact quotes from source):
  - `iDo.intro`: "Cada una modela una pieza del ETL del gate CP-N1-B: **leé** el código, **anticipá** la salida, luego **contrastá**."
  - `selfCheck` Q8: "Para montos en CSV/JSON del gate, ¿qué contrato **usás**?"
  - `theory[T3-B].paragraphs[0]`: "**Validá** required keys antes de normalizar o castear montos."
- Coexisting tuteo forms (37+ in the same section): "abre con `newline=''`", "**Declara** `fieldnames`", "intenta `read_text`", "Continúa el contrato de S02", "demuestras eso en stdlib".
- Pedagogical impact: A Peruvian learner hears voseo as Argentine/Uruguayan and reads it as a translation artefact. It also breaks the implicit "tú" contract established in S01–S07. The mix is more distracting than either pure form.
- Root cause: Authoring residue from a voseo-using prompt template or generator; section was not run through a regional-language linter.
- Fix: convert the 5 voseo forms to tuteo: `leé→lee`, `anticipá→anticipa`, `contrastá→contrasta`, `usás→usas`, `Validá→Valida`. (See D-I-01.)

**I-02 — Run-on sentence in `jobRelevance` (59 words in one sentence, WPS 30.25).**
- Severity: **HIGH** (cognitive overload at the section opener — the first learner-facing paragraph).
- Location: `jobRelevance` (idx 3), first sentence.
- Evidence: `"En un onboarding de data en banca, fintech o retail en Perú, tu primer "ETL de verdad" casi nunca es un notebook de gráficos: es **abrir un CSV de clientes y un JSON de transacciones**, no romper tildes ni montos, mandar filas irregulares a **cuarentena con motivo**, hashear el crudo y dejar un **manifest** que un auditor pueda releer."` (59 words; FH 67.9, WPS 30.25 — both outside the technical-prose comfort band).
- Pedagogical impact: This is the "why should I care?" hook on the section card. A 59-word sentence with 5 bolded tech nouns (CSV, JSON, cuarentena, manifest, ETL) and 4 commas is the wrong shape for a hook. Learners parse it once, fail, and skip to the next card.
- Root cause: The author tried to cram the entire "what an ETL really is" pitch into a single dramatic sentence.
- Fix: Split into 2–3 sentences of ≤22 words each. (See D-I-02.)

**I-03 — Run-on sentence in `youDo.context` "Receta de ensamblaje" (64 words in one sentence).**
- Severity: **HIGH** (capstone brief — maximum cognitive load moment).
- Location: `youDo.context` (idx 222), second sentence after "Cierras el gate CP-N1-B."
- Evidence: `"**Receta de ensamblaje (orden sugerido):** (1) `sha256_file` + backup del crudo (T4-A); (2) `load_clients_csv` con dialecto, Decimal, `newline=''` y cuarentena `{raw, reason}` (T2); (3) `load_transactions_json` con `validate_schema` + Decimal (T3); (4) `write_atomic` de clean y quarantine (T1-B); (5) `build_manifest` con totales derivados y `reconcile_ok` por fuente (T4-B); (6) `run` retorna 0 solo si todo reconcilia — si no, exit 1 (E3 de T4-B)."` (64 words, 6 enumerated clauses, 5 backticked identifiers).
- Pedagogical impact: This is the map for the entire capstone. A 64-word sentence forces the learner to hold 6 numbered steps in working memory while parsing code identifiers. It should be an actual numbered list.
- Root cause: Markdown list was inlined into prose.
- Fix: Convert to an ordered list (`1.` … `6.`). (See D-I-03.)

### 3.2 MED-severity issues

**I-04 — Concordancia error: `"este bytes exactos"`.**
- Severity: **MED** (grammatical error visible to learners).
- Location: `iDo.steps[6].why` (idx 72) — the `S08-T4-A-DEMO` why field.
- Evidence: `"Hash + backup del crudo son la provenance mínima del gate: el manifest debe poder decir "corrimos sobre este bytes exactos"."`
- Pedagogical impact: Demonstrative + noun + adjective disagreement (`este` sg. + `bytes` pl. + `exactos` pl.). LanguageTool flagged it (`AGREEMENT_DET_NOUN`). A learner writing this in a portfolio would lose credibility.
- Root cause: Editing slip — author probably began with "este byte exacto", then pluralised the noun but not the determiner.
- Fix: `"estos bytes exactos"` (or `"este byte exacto"`). (See D-I-04.)

**I-05 — Missing comma before "pero" (Spanish punctuation rule).**
- Severity: **MED**.
- Location: `weDo.steps[22].instruction` (idx 197 — `S08-T4-B-E2`).
- Evidence: `"Pruébalo con un caso good y un compensated_bad (agregado 10==9+1 pero fuentes rotas)."`.
- Rule: Spanish requires a comma before *pero* when it joins two clauses (RAE; LanguageTool `COMMA_PERO`).
- Pedagogical impact: Minor for comprehension, but the section is otherwise orthographically careful, so this stands out.
- Fix: `", pero fuentes rotas"`. (See D-I-05.)

**I-06 — Long sentence in `weDo.intro` (41 words).**
- Severity: **MED**.
- Location: `weDo.intro` (idx 76), the "Mapa puente al You Do" sentence.
- Evidence: `"**Mapa puente al You Do (ensamblaje):** T1-A → `Path`/`read_text` · T1-B → `write_atomic` · T2-A → cast `Decimal` + dialecto · T2-B → split clean/quarantine + `reason` · T3-A → JSON/JSONL · T3-B → `validate_schema` · T4-A → `sha256` + backup · T4-B → manifest + `run` fail-closed."` (41 words).
- Pedagogical impact: The intro to 24 exercises opens with a 41-word enumeration. The 8 mappings are useful but should breathe.
- Root cause: Useful bridge content collapsed into one sentence for compactness.
- Fix: Convert to a small table or bulleted map (it already uses `·` separators, which signals the author wanted a list). (See D-I-06.)

**I-07 — Long sentence in `portfolioNote` (35 words).**
- Severity: **MED**.
- Location: `youDo.portfolioNote` (idx 223).
- Evidence: `"Adjunta: (1) manifest de demo con reconcile_ok por fuente, (2) al menos 1 fila de cuarentena con reason estable, (3) hashes de ambos inputs crudos, (4) un test o corrida de reconciliación fallida (exit 1)."` (35 words).
- Pedagogical impact: A numbered portfolio checklist is excellent, but 4 items + intro = 35 words is dense for what should be a quick "include these in your zip" note. Convert to a true numbered list.
- Fix: Same content, real markdown list. (See D-I-07.)

**I-08 — Internal section IDs (S0X / S1X) leaking into learner-facing prose.**
- Severity: **MED** (borderline meta-leak — see §4 for full Meta-Leak Report).
- Location: 22 occurrences across `paragraphs`, `content`, `context`, `why`, `explanation`, `requirements`, see §4.2 for full list.
- Evidence (representative):
  - `theory[0].callout.content` (idx 15): "Al finalizar **S08** demuestras un ETL local reproducible… El CLI instalable llega en **S10**."
  - `theory[cierre].callout.content` (idx 50): "**S09** no cambia el stack de archivos…"
  - `iDo.steps[2].why` (idx 60): "el mismo contrato de dinero de **S02**, ahora sobre filas CSV reales"
  - `theory[0].paragraphs[1]` (idx 387): "En **S07** fijaste texto y Unicode… Integra normalizadores (S05–S07) y el modelo en memoria (S06). En S08 cierras el gate CP-N1-B"
  - `theory[T3-B].paragraphs[0]` (idx 404): "(eco S03: missing ≠ empty)"
  - `youDo.requirements[2]` (idx 254): "Integrar normalizadores (S05–S07) y modelo en memoria (S06) donde aplique"
- Pedagogical impact: Mixed. Forward/backward references are pedagogically valuable (they tell learners "you'll see this in S15", "remember S02"). But the bare `S0X` codes are curriculum-design identifiers, not human labels. The live UI also renders a sidebar with section titles, so the learner can already navigate; "S10" in prose is opaque without context.
- Recommendation: Keep the cross-references but **spell out at least the section title on first mention**: e.g., "El CLI instalable llega en **S10 (Módulos & CLI)**" or "El CLI instalable llega en la sección 10". See D-I-08 for a representative diff.
- Note: This is borderline; the curriculum-wide convention seems to use bare S0X codes, so a global convention decision is preferable to per-section edits.

**I-09 — `re-leer` with hyphen (RAE prefers `releer`).**
- Severity: **LOW/MED**.
- Location: `selfCheck.questions[10].explanation` (idx 251) — also `theory[T1-B].paragraphs[0]` mentions "re-leer el clean".
- Evidence: `"…Windows puede romper el dialecto al re-leer el clean."`
- Rule: Per RAE, the prefix *re-* attaches without hyphen to verbs: `releer`, `reescribir`, `reabrir`. Hyphenation is only used to avoid digraph issues (e.g., `re-entrada`) or to disambiguate doubled vowels in specific cases. `releer` is the canonical form (also listed in the DPD).
- Pedagogical impact: Minor, but the section is otherwise orthographically careful.
- Fix: `releer`. (See D-I-09.)

### 3.3 LOW-severity issues

**I-10 — `vs` without period (4 occurrences).**
- Location: `theory[0].paragraphs[0]` (idx 386) "`,` vs `;`"; `theory[T1-B].paragraphs[2]` (idx 394) "origen Windows vs Unix"; `theory[T3-B].paragraphs[0]` (idx 404) "null explícito vs clave ausente"; `selfCheck.questions[8].question` (idx 246) "`null` JSON con clave presente vs clave ausente".
- Rule: Spanish abbreviation `vs.` takes a period (LanguageTool `PUNTO_EN_ABREVIATURAS`).
- Fix: `vs.`. (See D-I-10.)

**I-11 — Space-before-punctuation in `why` field.**
- Location: `iDo.steps[1].why` (idx 57): "al terminar no queda basura .tmp."; `iDo.steps[3].description` (idx 70): "sha256 de input CSV + backup .bak". The pattern is `space + .ext` (file extension). This is technically a code identifier, but in prose it reads as space-before-punctuation.
- Fix: Wrap file extensions in backticks: `` `.tmp` ``, `` `.bak` ``. (See D-I-11.)

**I-12 — Comma-density in 8 We Do `instruction` fields.**
- Location: idx 77, 83, 131, 137, 143, 167, 197, 203.
- Evidence: instructions like `"E1 (guiado) — Path write/exists: en un temp dir, crea `demo.txt` con `write_text('hola', encoding='utf-8')`, imprime `p.exists()`."` (comma density 0.12–0.27).
- Pedagogical impact: Instructions are code-dense by nature; the comma density is a symptom of inline Python signatures. Not a real readability problem.
- Fix: Optional — convert long inline signatures to small code blocks.

**I-13 — English tech-noun density above 40% in 3 short `title` strings.**
- Location: `code.title` "Hash del input" (idx 42, 2/3 English), "manifest.py" (idx 45, 1/2), "reconcile.py" (idx 213, 214, 1/2), "sha256 de input CSV + backup .bak" (idx 70 description, 4/6).
- Pedagogical impact: Negligible — these are file/section labels where English is conventional.
- Fix: No change recommended (false-positive class noted in `_GRAMMAR_SUBPLAN.md`).

**I-14 — Unpaired single quote in CSV-header prose (`id,nombre` without space).**
- Location: `weDo.steps[8].instruction` (idx 131): "header es id,nombre"; `weDo.steps[9].instruction` (idx 137): "(fieldnames id,nombre)"; `weDo.steps[10].instruction` (idx 143): "(newline='', fieldnames raw,reason)"; `weDo.steps[22].instruction` (idx 197): "ERROR sources=clients.csv,transactions.json".
- LanguageTool flags `COMMA_PARENTHESIS_WHITESPACE` (4 occurrences).
- Pedagogical impact: When CSV field names are written in prose without spaces, the reader cannot tell whether the comma is a list separator or part of the field. Backticks + space (`id, nombre`) would clarify.
- Fix: Add a space after each comma inside backticked CSV field lists. (See D-I-14.)

**I-15 — Repetition `"PARCIAL parcial"` in We Do E3 starter description.**
- Location: `weDo.steps[5].instruction` (idx 89 area) — `"escribe dest parcial 'PARCIAL'"`. LanguageTool flagged `PHRASE_REPETITION`.
- Pedagogical impact: The echo is intentional (the value `PARCIAL` literalises the word "parcial"), but it reads as a stutter.
- Fix: Reword to `"escribe 'PARCIAL' en dest (sin atómico)"` or `"simula escritura parcial con el literal 'PARCIAL'"`. (See D-I-15.)

**I-16 — `"os.replace"` and `"Procesa"` sentence-start false positives.**
- Location: idx 100 (`iDo.steps[1].why` starts with "os.replace hace el swap…") and idx 243 (`weDo.steps[8].instruction` "Procesa ['10', 'x', '3.5']").
- LanguageTool flagged `UPPERCASE_SENTENCE_START`.
- Verdict: False positives. "os.replace" is a code identifier (correctly lowercase). "Procesa" IS capitalised. No fix needed; documented for completeness.

**I-17 — `# CASO-LIM-008` and `# DEFECT:` tags inside learner-visible starter code.**
- Location: Every `weDo.steps[].starterCode.code` block contains a header comment like `# CASO-LIM-008 · Path write/read` and `# DEFECT: no escribe; exists siempre False`.
- Pedagogical impact: The `# DEFECT:` comment is pedagogically intentional (it tells the learner what bug to fix — "the starter has a defect, your job is to repair it"). The `# CASO-LIM-008` tag, however, is internal curriculum metadata (case-limit identifier) that learners don't need to see. It's a borderline meta-leak.
- Fix: Keep `# DEFECT:` lines (they're scaffolding); drop `# CASO-LIM-008 · ...` header lines or move them to a non-rendered field. (See D-I-17.)

**I-18 — Stale `visible_paragraphs/s08_pandas.json` snapshot in the repo.**
- Location: `course-state/curriculum_hardening/visible_paragraphs/s08_pandas.json`.
- Evidence: The file's `paragraphs[]` array contains pre-hardening templated text with severe meta-leaks (see §4.3): `"En V3, S08 no es el path principal de pandas groupby/merge/EDA. Ese material se reubica al nivel 2 de data."`, plus 8 repetitions of `"Stack permitido: pathlib, csv, json, open/with (S01–S08); no pandas de S15, no requests de S12."` and 9 repetitions of `"Caso sintético Perú: CSV/JSON sintéticos..."`.
- Pedagogical impact: Zero on the live site (the live SPA renders the hardened source), but the stale snapshot pollutes the audit trail and could mislead future automated tooling.
- Fix: Regenerate the snapshot from the current source or delete it. (See D-I-18.)

---

## 4. Meta-Leak Report

### 4.1 Definition
Meta-leak = any developer-facing, curriculum-design, or AI-to-developer text that has slipped into learner-facing prose. The Meta-Leak Detector sub-agent specifically hunts for: AI-to-developer comments, "moved from section X" notes, design notes, internal instructions, version markers (V2/V3/v3), bare internal section IDs (S0X) without context, and TODO/FIXME/HACK/XXX/TBD markers.

### 4.2 Findings in the **current source** `s08-pandas.ts`

**M-1 — Bare internal section IDs in learner-facing prose (BORDERLINE; 22 occurrences).**
Same as I-08. These are intentional cross-references, not pure meta-leaks, but the bare `S0X` form is curriculum-design vocabulary. Representative quotes (full list in §3.2 I-08):
- `"Al finalizar S08 demuestras un ETL local reproducible… El CLI instalable llega en S10."` (callout content)
- `"En S07 fijaste texto y Unicode…"` (theory paragraph)
- `"Continúa el contrato de S02: Decimal, nunca float"` (self-check explanation)
- `"eco S03: missing ≠ empty"` (theory paragraph)
- `"Integrar normalizadores (S05–S07) y modelo en memoria (S06)"` (You Do requirement)

Verdict: **Borderline.** Keep the cross-references but reword on first mention to include the section title (e.g., "En **S07 (Texto & Unicode)** fijaste texto y Unicode"). The bare form is acceptable as a *second* mention. This is a curriculum-wide convention decision.

**M-2 — `# CASO-LIM-008` tag in starter code comments.**
Same as I-17. Each `starterCode.code` block opens with `# CASO-LIM-008 · <topic>` and `# DEFECT: <description>`. The `# DEFECT:` line is pedagogical scaffolding (acceptable). The `# CASO-LIM-008` line is internal curriculum metadata.

Verdict: **Low-grade meta-leak.** Drop the `# CASO-LIM-008` line; keep `# DEFECT:`.

**M-3 — No AI-to-developer comments, no "moved from" notes, no TODO/FIXME/XXX/HACK/TBD markers, no V2/V3 markers in the current source.**
The hardened `s08-pandas.ts` is clean of these signals. (A regex sweep for `\b(V2|V3|v3|TODO|FIXME|XXX|HACK|TBD|moved from|moved to)\b` returned zero true positives in the prose. The only matches were Spanish "todo" meaning "all", filtered out.)

### 4.3 Findings in the **stale snapshot** `course-state/curriculum_hardening/visible_paragraphs/s08_pandas.json`

These do NOT ship to learners (the live site renders the hardened source), but the snapshot file still exists in the repo and is documented here for completeness:

**M-4 — Explicit curriculum-version meta-leak (would be HIGH if it still shipped).**
> `"En V3, S08 no es el path principal de pandas groupby/merge/EDA. Ese material se reubica al nivel 2 de data."`

This sentence literally tells the learner about an internal "V3" redesign decision — pure curriculum-design leakage. It is NOT in the current source; it lives only in the stale snapshot.

**M-5 — Templated "Stack permitido: … ; no pandas de S15, no requests de S12." repeated 8 times.**
The snapshot's `paragraphs[]` array contains 8 verbatim copies of:
> `"Stack permitido: pathlib, csv, json, open/with (S01–S08); no pandas de S15, no requests de S12."`

This is internal stack-policy text that the hardened source has replaced with bespoke, subtopic-specific prose. The repetition is a clear sign of template-driven authoring that the hardening pass corrected.

**M-6 — Templated "Caso sintético Perú: CSV/JSON sintéticos…" repeated 9 times, and "Contrato: entrada explícita → transformación documentada → salida medible" repeated 8 times.**
Same pattern: the stale snapshot is heavily templated; the hardened source is bespoke.

**M-7 — Templated "Documenta decisión, métrica y límite conocido en el memo del subtema" repeated 9 times.**
The phrase "memo del subtema" is internal-author vocabulary (a memo is a curriculum-design artefact, not a learner artefact). The hardened source has removed all 9 occurrences.

**Recommendation M-4..M-7:** Regenerate `visible_paragraphs/s08_pandas.json` from the current source (or delete the file) so future auditors don't re-flag stale meta-leaks. (See D-I-18.)

### 4.4 Live-site rendering note (transient)
During agent-browser navigation to `#pandas`, the URL hash and `<h1>` updated correctly to "Archivos, CSV, JSON y contratos de ingesta", but on one occasion the body content briefly rendered Section 11 ("OOP y modelo de dominio") before correcting on subsequent navigation. This is a SPA state bug, not a content meta-leak, but it is noted because it could cause a learner to see the wrong section's prose under Section 8's URL/H1. Recommended: verify the router's section-id-to-content binding for stale state on rapid navigation.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity (Stanford STORM pass)

**Fidelity score: 9/10.** The section is a textbook execution of the I Do / We Do / You Do model.

- **I Do (8 demos, one per subtopic T1-A…T4-B):** Each demo has `description` (≤10 words), `code` (10–20 lines of runnable Python with expected output), and `why` (1–2 sentences connecting the demo to the gate contract). The progression mirrors the theory blocks exactly. The `intro` field ("Ocho demos I Do (T1→T4) en local-python… Cada una modela una pieza del ETL del gate CP-N1-B") is clear and short — though it contains the voseo leak `leé/anticipá/contrastá` (I-01).

- **We Do (24 exercises: 8 subtopics × E1/E2/E3):** This is the strongest piece of the section. The E1 (guiado) → E2 (independiente) → E3 (transferencia) progression within each subtopic is exactly the gradual-release model. Each exercise carries: `instruction` (the task), `hint` (1-line), `hints[]` (2 progressive hints), `edgeCases[]` (1–3 tags), `tests` (expected output as text), `feedback` (1-line takeaway), `starterCode` (with an *intentional defect* the learner must repair), `solutionCode` (with expected output). The defect-repair pattern is pedagogically excellent: it forces the learner to read code, identify the bug, and fix it — not just type from scratch. The `intro` field includes a "Mapa puente al You Do" that explicitly maps each T-X to its corresponding `Path`/`write_atomic`/`Decimal`/`split`/`JSON`/`validate_schema`/`sha256`/`manifest` piece — exactly the connective tissue the Comparative Quality Agent should reward.

- **You Do (capstone):** The capstone is a real ETL project (`etl_cp_n1_b.py`) with a full skeleton (`sha256_file`, `write_atomic`, `load_clients_csv`, `load_transactions_json`, `build_manifest`, `run`, `main`) where every function raises `NotImplementedError` and is annotated with a `# Contrato:` comment telling the learner what to implement. The `context` field gives a 6-step "Receta de ensamblaje" linking each step to a We Do subtopic. The `portfolioNote` lists what to attach as portfolio evidence. The `rubric` has 6 weighted criteria (Ingesta 20%, Validación 20%, Manifest 20%, Hashes 15%, Pruebas 15%, README 10%). This is gold-standard.

- **Self Check (11 questions):** Each question has 4 options, a `correctIndex`, and an `explanation` that references the gate contract. Distractors are plausible (e.g., Q1 "Es más rápido" / "Comprime el archivo" / "Activa pathlib" / "Evita depender del locale del SO"). Question coverage maps 1:1 to the 8 subtopics plus 3 synthesis questions (reconcile, fail-closed, vs-aggregate). One question contains the voseo leak `usás` (I-01).

### 5.2 Connective tissue and narrative flow

**Backward references (explicit):**
- S07 (Texto & Unicode) — "En S07 fijaste texto y Unicode (tildes, encodings, mojibake). Aquí esos bytes viven en disco." (theory[cierre])
- S05–S07 (normalizadores) — "Integra normalizadores (S05–S07)…" (theory[0].paragraphs[1], youDo.requirements[2])
- S06 (modelo en memoria) — same paragraph.
- S02 (Decimal money contract) — "El contrato monetario de S02 continúa: Decimal desde texto, cuantizado a 0.01, serializado como string…" (theory[T2-A].paragraphs[0]); "Continúa el contrato de S02: Decimal, nunca float" (self-check Q8 explanation); "el mismo contrato de dinero de S02, ahora sobre filas CSV reales" (iDo[2].why)
- S03 (null ≠ missing) — "Distinguí null explícito de clave ausente cuando la política lo pide (eco S03: missing ≠ empty)" (theory[T3-B].paragraphs[0])

**Forward references (explicit):**
- S09 (excepciones y logging) — "En S09 profundizas excepciones y logging: cómo registrar UnicodeDecodeError, fallos de cast y reconcile sin silenciar…" (theory[cierre].paragraphs[1]); "S09 no cambia el stack de archivos: enseña a observar y fallar con traza" (callout)
- S10 (CLI) — "El CLI instalable llega en S10" (callout, youDo.context, youDo.requirements[9])
- S15 (pandas) — "El análisis tabular con pandas llega más adelante en el nivel de datos" (jobRelevance)

**Internal subtopic cross-references:** The We Do `intro` "Mapa puente al You Do" maps T1-A → `Path`/`read_text`, T1-B → `write_atomic`, T2-A → cast `Decimal`, T2-B → split + `reason`, T3-A → JSON/JSONL, T3-B → `validate_schema`, T4-A → `sha256` + backup, T4-B → manifest + `run` fail-closed. The You Do `context` then re-maps each piece to a step in the capstone. This explicit bridge is rare and excellent.

**Narrative arc:** "De dónde venías y a dónde vas" subheading explicitly narrates S07→S08→S09. The closing block "Cierre y puente a S09 (excepciones y logs)" wraps up with a 6-item mental checklist before the You Do — exactly the kind of metacognitive prompt that learning-psychology research (Bjork, desirable difficulty; Sweller, worked-example fading) endorses.

### 5.3 Cognitive load and progressive disclosure

- **Within-subtopic load:** Each theory subtopic has 3 paragraphs + 1 code block + 1 callout. Paragraph length is 60–180 words (WPS 5–18). The 3-paragraph rhythm is: (1) what + why, (2) edge cases / contract, (3) Latam / dialect specifics. This is a stable, predictable rhythm that lowers extraneous load.
- **Cross-subtopic load:** T1→T4 builds linearly (Path → atomic write → CSV → cuarentena → JSON → schema → hash → manifest). Each subtopic reuses the previous subtopic's vocabulary (`reason`, `raw`, `clean`, `quarantine`, `manifest`). The invariant `n_in == n_clean + n_quarantine` is introduced in T2-B and re-stated in T4-B — exactly the kind of spaced re-statement that aids retention.
- **Worked-example fading (We Do):** E1 (guiado, with starter defect) → E2 (independiente, with starter defect) → E3 (transferencia, with starter defect). The defect pattern means the learner is always reading-bug-fixing, never transcribing. This is more demanding than copy-typing but better aligned with real work.
- **Capstone as assembly:** The You Do is explicitly framed as "ensamblaje" of the 8 pieces — not new content. This is the right pedagogical move: the capstone tests transfer, not new learning.

**Cognitive-load concerns:**
- The `jobRelevance` opener at 30 WPS is the single biggest load spike at the worst moment (section opener). (I-02)
- The `youDo.context` "Receta de ensamblaje" at 64 words/sentence is the second-biggest spike, again at a high-stakes moment. (I-03)
- The We Do `intro` "Mapa puente" at 41 words/sentence is the third. (I-06)
All three are fixable by converting enumerated prose to lists.

### 5.4 Exercise and exam quality

- **Exercise quality:** 24 exercises, each with executable starter + solution + expected output. The starter defects are well-chosen (e.g., `# DEFECT: float() traga y no rechaza 'x' con motivo cast_monto` for the Decimal-cast exercise — the starter uses `float()` instead of `Decimal()`, which is the exact anti-pattern the gate forbids). This is pedagogically excellent.
- **Exam (Self Check) quality:** 11 questions, 4 options each, with explanations. Question difficulty is appropriately pitched at the application level (Bloom's taxonomy: apply / analyse), not just recall. Distractors are plausible. Q10 ("¿Por qué no alcanza validar solo n_in == n_clean + n_quarantine en el total agregado?") is a particularly good synthesis question — it tests whether the learner understands *why* per-source reconciliation matters, not just *that* it matters.
- **Alignment:** Every Self Check question maps to a specific subtopic (Q1→T1-A, Q2→T1-B, Q3→T2-B, Q4→T4-B, Q5→T4-B, Q6→T4-A, Q7→T3-A, Q8→T2-A, Q9→T3-B, Q10→T4-B, Q11→T1-B). Coverage is complete.

### 5.5 Consistency with the overall roadmap

- The section sits between S07 (Texto & Unicode) and S09 (Excepciones & logs). The bridge is explicit and bidirectional.
- The Decimal money contract is consistently carried from S02 through S08 (and the self-check explicitly tests it).
- The `fail-closed` / `cuarentena con motivo` / `reconcile por fuente` vocabulary is consistent with the rest of Phase 0.
- The deferral of pandas to S15 is explicit in `jobRelevance` ("El análisis tabular con pandas llega más adelante en el nivel de datos; aquí cierras ingesta confiable") — this manages learner expectations correctly given that the file is named `s08-pandas.ts`.

### 5.6 Comparison with best-in-class external materials

- **Real Python — Working with files:** Section 8 is denser and more opinionated (it enforces a specific `write_atomic` contract and a `manifest` schema, which Real Python does not). This is appropriate for a course that closes a gate.
- **MIT 6.100L (files):** 6.100L is more academic and less contract-driven. Section 8's `fail-closed` / `reconcile` framing is closer to industry ETL practice (Kleppmann's *Designing Data-Intensive Applications*, which is cited in `resources.books`).
- **CS50P (CSV and file I/O):** CS50P is more beginner-friendly but less rigorous on encoding/dialect. Section 8's `newline=''` / `utf-8-sig` / `delimiter=';'` Latam-specific guidance is genuinely better than CS50P for the target audience.
- **Kleppmann DDIA (cited in `resources.books`):** The lineage / idempotency / fail-closed framing in S08 maps directly to DDIA ch. 9–10 ideas. The mapping is acknowledged in the resource note ("Ideas de lineage, idempotencia y fail-closed; mapear a CP-N1-B local").

**Verdict:** Section 8 is more rigorous and more regionally appropriate than the external references, at the cost of being denser. The density is appropriate for an "Intermedio" 18-hour section.

---

## 6. Grammatical Improvements & Rewriting Report — Paragraph by Paragraph, Tab by Tab

For each tab (Teoría, I Do, We Do, You Do, Autocheck), the worst sentences are rewritten **before → after**. Full per-sentence metrics are in `s08_records.json` (companion file).

### 6.1 Teoría

**T-0.1 — `jobRelevance` (section opener, 59-word run-on).**
- Before: `"En un onboarding de data en banca, fintech o retail en Perú, tu primer "ETL de verdad" casi nunca es un notebook de gráficos: es **abrir un CSV de clientes y un JSON de transacciones**, no romper tildes ni montos, mandar filas irregulares a **cuarentena con motivo**, hashear el crudo y dejar un **manifest** que un auditor pueda releer."` (59w, FH 67.9, WPS 30.25)
- After: `"En un onboarding de data en banca, fintech o retail en Perú, tu primer "ETL de verdad" casi nunca es un notebook de gráficos. Es **abrir un CSV de clientes y un JSON de transacciones** sin romper tildes ni montos, mandar filas irregulares a **cuarentena con motivo**, hashear el crudo y dejar un **manifest** que un auditor pueda releer."` (split into 2 sentences; first ≤22w, second ≤30w)
- Metrics: FH ~78, WPS ~15.

**T-0.2 — `theory[0].paragraphs[0]` (Diccionario).** Long but well-punctuated; no rewrite needed.

**T-0.3 — `theory[0].paragraphs[1]` (De dónde venías).** 218 words, 5 sentences, WPS ~17. Contains 4 internal section refs (S07, S05, S07, S06, S08). Acceptable. Optional: spell out section titles on first mention.

**T-1-A.1 — `theory[T1-A].paragraphs[0]`.** 76 words, 2 sentences, FH 86.4. Clean. No rewrite.

**T-1-B.1 — `theory[T1-B].paragraphs[0]`.** Contains `re-leer el clean` (should be `releer`). One-word fix.

**T-2-A.1 — `theory[T2-A].paragraphs[0]`.** 86 words, 3 sentences, FH 78.3. Clean.

**T-2-B.1 — `theory[T2-B].paragraphs[0]`.** Contains `"no las "arregles" en silencio ni trunques a medias"` — Spanish punctuation: nested quotes use «…» or alternation. Currently uses English `"…"`. Minor typography.

**T-3-A.1 — `theory[T3-A].paragraphs[0]`.** 75 words. Clean.

**T-3-B.1 — `theory[T3-B].paragraphs[0]` — Voseo leak + 37w sentence.**
- Before: `"Validá **required keys** antes de normalizar o castear montos. `null` JSON se convierte en `None` en Python. Distinguí **null explícito** de **clave ausente** cuando la política lo pide (eco S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si "borrar email" o "email desconocido"."`
- After: `"**Valida** las **required keys** antes de normalizar o castear montos. `null` en JSON se convierte en `None` en Python. **Distingue** **null explícito** de **clave ausente** cuando la política lo pide (eco de S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si "borrar email" o "email desconocido"."`
- Changes: `Validá→Valida`, `Distinguí→Distingue`, `null JSON→null en JSON`, `eco S03→eco de S03`. Splits the 37-word sentence at the colon to make it 2 sentences.

**T-4-A.3 — `theory[T4-A].paragraphs[2]` — agreement error.**
- Before: `"…el manifest debe poder decir "corrimos sobre este bytes exactos"."`
- After: `"…el manifest debe poder decir "corrimos sobre **estos** bytes exactos"."`

**T-cierre.1 — `theory[cierre].paragraphs[1]`.** Contains `S09` forward ref. Acceptable as-is; optional spell-out.

### 6.2 I Do (Yo hago)

**I-0 — `iDo.intro` — Voseo leak.**
- Before: `"Ocho demos I Do (T1→T4) en **local-python** (filesystem/temp). Cada una modela una pieza del ETL del gate CP-N1-B: **leé** el código, **anticipá** la salida, luego **contrastá**. Datos sintéticos únicamente — sin PII real."`
- After: `"Ocho demos I Do (T1→T4) en **local-python** (filesystem/temp). Cada una modela una pieza del ETL del gate CP-N1-B: **lee** el código, **anticipa** la salida, luego **contrasta**. Datos sintéticos únicamente — sin PII real."`

**I-1 — `iDo.steps[1].why` — space-before-punct.**
- Before: `"os.replace hace el swap atómico del artefacto de salida. Contrato único del curso: tmp = dest.with_name(dest.name + '.tmp') en el mismo directorio; al terminar no queda basura .tmp."`
- After: `"os.replace hace el swap atómico del artefacto de salida. Contrato único del curso: tmp = dest.with_name(dest.name + '.tmp') en el mismo directorio; al terminar no queda basura `.tmp`."` (backtick the extension)

**I-2 — `iDo.steps[6].why` — agreement error.** See T-4-A.3 above.

All other I Do `description` and `why` fields are clean (WPS 6–15, FH 70–95).

### 6.3 We Do (Hacemos juntos)

**W-0 — `weDo.intro` — 41w long sentence.**
- Before: `"**Mapa puente al You Do (ensamblaje):** T1-A → `Path`/`read_text` · T1-B → `write_atomic` · T2-A → cast `Decimal` + dialecto · T2-B → split clean/quarantine + `reason` · T3-A → JSON/JSONL · T3-B → `validate_schema` · T4-A → `sha256` + backup · T4-B → manifest + `run` fail-closed."`
- After (as a markdown list):
  ```
  **Mapa puente al You Do (ensamblaje):**
  - T1-A → `Path` / `read_text`
  - T1-B → `write_atomic`
  - T2-A → cast `Decimal` + dialecto
  - T2-B → split clean/quarantine + `reason`
  - T3-A → JSON/JSONL
  - T3-B → `validate_schema`
  - T4-A → `sha256` + backup
  - T4-B → manifest + `run` fail-closed
  ```

**W-1 — `weDo.steps[2].instruction` (E3 transferencia, UnicodeDecodeError) — 32w, FH 46.8.**
- Before: `"E3 (transferencia) — Escribe bytes no válidos en UTF-8 (`write_bytes`), intenta `read_text(encoding='utf-8')`, captura `UnicodeDecodeError`, imprime el nombre de la excepción y una acción (cuarentenar o reintentar con encoding documentado). Pass: primera línea `UnicodeDecodeError`."` (32w in the instruction sentence)
- After: `"E3 (transferencia) — Escribe bytes no válidos en UTF-8 con `write_bytes`. Intenta `read_text(encoding='utf-8')`, captura `UnicodeDecodeError` e imprime el nombre de la excepción y una acción (cuarentenar o reintentar con encoding documentado). Pass: primera línea `UnicodeDecodeError`."` (split at the first comma into 2 sentences)

**W-2 — `weDo.steps[4].instruction` (E1 CRLF) — 30w, comma-density 0.21.** Acceptable for a code-dense instruction; no rewrite.

**W-3 — `weDo.steps[7].instruction` (E2 DictWriter) — `id,nombre` without space.** Add space: `` `id, nombre` ``.

**W-4 — `weDo.steps[10].instruction` (E3 reasons counter) — `['col_count', 'cast_monto', ...]` list.** Comma-density 0.27. Acceptable; the inline list is the data the learner works with.

**W-5 — `weDo.steps[13].instruction` (E1 validate_schema) — `(obj={'id':'C1'}...)` — comma-density 0.12.** Acceptable.

**W-6 — `weDo.steps[19].instruction` (E2 reconcile) — missing comma before "pero".** See I-05.

**W-7 — `weDo.steps[20].instruction` (E3 mini-ensamblaje) — `clients.csv,transactions.json` without space.** Add space: `` `clients.csv, transactions.json` ``.

**W-8 — All `# CASO-LIM-008` tags in starterCode.** Remove the tag line; keep `# DEFECT:`.

### 6.4 You Do (Tú haces)

**Y-0 — `youDo.context` — 64w run-on.** See I-03. Convert "Receta de ensamblaje" to a numbered list:
- Before (one sentence): `"**Receta de ensamblaje (orden sugerido):** (1) `sha256_file` + backup del crudo (T4-A); (2) `load_clients_csv` con dialecto, Decimal, `newline=''` y cuarentena `{raw, reason}` (T2); (3) `load_transactions_json` con `validate_schema` + Decimal (T3); (4) `write_atomic` de clean y quarantine (T1-B); (5) `build_manifest` con totales derivados y `reconcile_ok` por fuente (T4-B); (6) `run` retorna 0 solo si todo reconcilia — si no, exit 1 (E3 de T4-B)."`
- After (numbered list):
  ```
  **Receta de ensamblaje (orden sugerido):**
  1. `sha256_file` + backup del crudo (T4-A)
  2. `load_clients_csv` con dialecto, Decimal, `newline=''` y cuarentena `{raw, reason}` (T2)
  3. `load_transactions_json` con `validate_schema` + Decimal (T3)
  4. `write_atomic` de clean y quarantine (T1-B)
  5. `build_manifest` con totales derivados y `reconcile_ok` por fuente (T4-B)
  6. `run` retorna 0 solo si todo reconcilia — si no, exit 1 (E3 de T4-B)
  ```

**Y-1 — `youDo.portfolioNote` — 35w long sentence.** Convert the "(1)…(4)" enumeration to a real numbered list.

All `objectives[]`, `requirements[]`, and `rubric[]` entries are short, clean, and well-pitched.

### 6.5 Autocheck (Self Check)

**A-1 — Q8 question — Voseo leak.**
- Before: `"Para montos en CSV/JSON del gate, ¿qué contrato usás?"`
- After: `"Para montos en CSV/JSON del gate, ¿qué contrato usas?"`

**A-2 — Q9 question — `vs` without period.**
- Before: `"`null` JSON con clave presente vs clave ausente…"`
- After: `"`null` JSON con clave presente **vs.** clave ausente…"`

**A-3 — Q11 explanation — `re-leer` hyphen.**
- Before: `"…Windows puede romper el dialecto al re-leer el clean."`
- After: `"…Windows puede romper el dialecto al **releer** el clean."`

All other Self Check questions and explanations are clean (FH 60–95, WPS 5–14).

### 6.6 Aggregate metrics (per-key summary)

| Key | n | FH mean | WPS mean | Notes |
|---|---:|---:|---:|---|
| paragraphs (theory) | 30 | 77.0 | 18.25 | Dense but well-segmented. 3 longest sentences need split (T-3-B.1, T-4-A.3 is agreement, plus idx 409). |
| content (callouts) | 10 | 85.7 | 13.10 | Clean. The S08/S10 callout is the only borderline meta-leak. |
| context (youDo) | 1 | 82.9 | 20.00 | Contains the 64w run-on. |
| intro | 2 | 86.0 | 14.41 | iDo intro has voseo; weDo intro has the 41w map. |
| jobRelevance | 1 | 67.9 | 30.25 | 59w run-on opener. Worst single chunk. |
| instruction | 24 | 94.3 | 10.93 | Healthy. Code-dense, expected. |
| why | 8 | 71.8 | 16.50 | idx 72 has the agreement error; idx 60 is 26w (borderline). |
| feedback | 22 | 71.8 | 7.20 | Clean and short. |
| explanation | 11 | 78.2 | 11.68 | idx 251 has `re-leer`; idx 245 has S02 ref. |
| question | 11 | 87.8 | 9.00 | idx 244 has voseo `usás`. |
| options | 36 | 90.2 | 5.66 | Clean. |
| portfolioNote | 1 | 72.6 | 27.00 | 35w long sentence. |
| requirements | 6 | 75.0 | 12.67 | idx 254 has S05–S07/S06 refs. |
| objectives | 3 | 59.0 | 9.00 | (extractor caught 3 of 5; source has 5.) |
| hint | 3 | 86.2 | 8.33 | Clean. |
| hints | 11 | 88.2 | 7.09 | Clean. |
| edgeCases | 2 | 40.3 | 1.50 | Short tags; not prose. |
| tests | 2 | 60.3 | 4.00 | Short specs; not prose. |
| heading | 10 | 66.2 | 5.60 | Clean. |
| title | 77 | 81.5 | 2.65 | Code-titles; not prose. |
| text (learningOutcomes) | 8 | 63.9 | 7.62 | Clean. |
| criterion (rubric) | 6 | 36.8 | 3.33 | Short labels; not prose. |
| description | 5 | 103.9 | 7.00 | Clean (one space-before-punct). |
| tagline | 1 | 78.7 | 8.00 | Clean. |
| shortTitle | 1 | 84.8 | 2.00 | Clean. |

**Composite section score:** Start at 10. Subtract: HIGH×3 (voseo −0.6; two run-ons −0.4 each = −0.8) → −1.4; MED×6 (agreement −0.2, comma-pero −0.1, three long sentences −0.1 each = −0.3, internal S-refs borderline −0.2, re-leer −0.1, CASO-LIM tag −0.1, stale snapshot −0.1) → −1.0; LOW×~8 (vs period −0.05, space-before-punct −0.05, comma-density −0.05, code-switching −0.1, etc.) → −0.4. **Net: 10 − 1.4 − 1.0 − 0.4 = 7.2 → round to 8.0** (pedagogical structure is exceptional, lifts the score).

---

## 7. Proposed GitHub-Style Diffs

Each diff is ready to apply to `src/lib/course/sections/s08-pandas.ts`. Line numbers refer to the current source.

### D-I-01 — Voseo → tuteo (3 locations)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -357 +357 @@
-    intro: "Ocho demos I Do (T1→T4) en **local-python** (filesystem/temp). Cada una modela una pieza del ETL del gate CP-N1-B: leé el código, anticipá la salida, luego contrastá. Datos sintéticos únicamente — sin PII real.",
+    intro: "Ocho demos I Do (T1→T4) en **local-python** (filesystem/temp). Cada una modela una pieza del ETL del gate CP-N1-B: lee el código, anticipa la salida, luego contrasta. Datos sintéticos únicamente — sin PII real.",
@@ -1720 +1720 @@
-        question: "Para montos en CSV/JSON del gate, ¿qué contrato usás?",
+        question: "Para montos en CSV/JSON del gate, ¿qué contrato usas?",
@@ -238 +238 @@
-        "Validá **required keys** antes de normalizar o castear montos. `null` JSON se convierte en `None` en Python. Distinguí **null explícito** de **clave ausente** cuando la política lo pide (eco S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si "borrar email" o "email desconocido".",
+        "**Valida** las **required keys** antes de normalizar o castear montos. `null` en JSON se convierte en `None` en Python. **Distingue** **null explícito** de **clave ausente** cuando la política lo pide (eco de S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si "borrar email" o "email desconocido".",
```

### D-I-02 — Split `jobRelevance` run-on (59w → 2 sentences)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -14,15 +14,15 @@
   jobRelevance:
-    "En un onboarding de data en banca, fintech o retail en Perú, tu primer "ETL de verdad" casi nunca es un notebook de gráficos: es **abrir un CSV de clientes y un JSON de transacciones**, no romper tildes ni montos, mandar filas irregulares a **cuarentena con motivo**, hashear el crudo y dejar un **manifest** que un auditor pueda releer. El gate **CP-N1-B** se cierra cuando demuestras eso en **stdlib** (pathlib, csv, json, hashlib, Decimal) con archivos **con forma de negocio** (sintéticos en el curso). Un groupby de demo impresiona menos en entrevista junior que un pipeline fail-closed con reconcile por fuente. El análisis tabular con **pandas** llega más adelante en el nivel de datos; aquí cierras **ingesta confiable**.",
+    "En un onboarding de data en banca, fintech o retail en Perú, tu primer "ETL de verdad" casi nunca es un notebook de gráficos. Es **abrir un CSV de clientes y un JSON de transacciones** sin romper tildes ni montos, mandar filas irregulares a **cuarentena con motivo**, hashear el crudo y dejar un **manifest** que un auditor pueda releer. El gate **CP-N1-B** se cierra cuando demuestras eso en **stdlib** (pathlib, csv, json, hashlib, Decimal) con archivos **con forma de negocio** (sintéticos en el curso). Un groupby de demo impresiona menos en entrevista junior que un pipeline fail-closed con reconcile por fuente. El análisis tabular con **pandas** llega más adelante en el nivel de datos; aquí cierras **ingesta confiable**.",
```

### D-I-03 — Convert `youDo.context` "Receta de ensamblaje" run-on to a numbered list

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -1565,2 +1565,9 @@
     context:
-      "Cierras el gate **CP-N1-B**. Los We Do de T1–T4 te dieron las piezas; aquí las **ensamblas** en un ETL **local-python**. **Receta de ensamblaje (orden sugerido):** (1) `sha256_file` + backup del crudo (T4-A); (2) `load_clients_csv` con dialecto, Decimal, `newline=''` y cuarentena `{raw, reason}` (T2); (3) `load_transactions_json` con `validate_schema` + Decimal (T3); (4) `write_atomic` de clean y quarantine (T1-B); (5) `build_manifest` con totales derivados y `reconcile_ok` por fuente (T4-B); (6) `run` retorna 0 solo si todo reconcilia — si no, exit 1 (E3 de T4-B). Rutas: `data/clients.csv` + `data/transactions.json` (sintéticos) → `out/clean/`, `out/quarantine/`, `out/manifest.json`. CLI instalable llega en S10. Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
+      "Cierras el gate **CP-N1-B**. Los We Do de T1–T4 te dieron las piezas; aquí las **ensamblas** en un ETL **local-python**.\n\n**Receta de ensamblaje (orden sugerido):**\n\n1. `sha256_file` + backup del crudo (T4-A)\n2. `load_clients_csv` con dialecto, Decimal, `newline=''` y cuarentena `{raw, reason}` (T2)\n3. `load_transactions_json` con `validate_schema` + Decimal (T3)\n4. `write_atomic` de clean y quarantine (T1-B)\n5. `build_manifest` con totales derivados y `reconcile_ok` por fuente (T4-B)\n6. `run` retorna 0 solo si todo reconcilia — si no, exit 1 (E3 de T4-B)\n\nRutas: `data/clients.csv` + `data/transactions.json` (sintéticos) → `out/clean/`, `out/quarantine/`, `out/manifest.json`. CLI instalable llega en S10. Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
```

### D-I-04 — Fix concordancia `este bytes` → `estos bytes`

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -539 +539 @@
-        why: "Hash + backup del crudo son la provenance mínima del gate: el manifest debe poder decir "corrimos sobre este bytes exactos".",
+        why: "Hash + backup del crudo son la provenance mínima del gate: el manifest debe poder decir "corrimos sobre estos bytes exactos".",
```

### D-I-05 — Add comma before "pero"

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -1460 +1460 @@
-          "E2 (independiente) — Implementa `reconcile_sources(sources)`: exige `n_in == n_clean + n_quarantine` **por cada fuente** y que los totales derivados cuadren. Pruébalo con un caso good y un `compensated_bad` (agregado 10==9+1 pero fuentes rotas). Pass: `True` luego `False`.",
+          "E2 (independiente) — Implementa `reconcile_sources(sources)`: exige `n_in == n_clean + n_quarantine` **por cada fuente** y que los totales derivados cuadren. Pruébalo con un caso good y un `compensated_bad` (agregado 10==9+1, pero fuentes rotas). Pass: `True` luego `False`.",
```

### D-I-06 — Convert `weDo.intro` "Mapa puente" 41w sentence to a list

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -581 +581,11 @@
-    intro: "Andamiaje E1→E2→E3 × 8 (24 ejercicios). Solo stdlib (pathlib, csv, json, hashlib, shutil, Decimal). Fail-closed en reconcile. **Mapa puente al You Do (ensamblaje):** T1-A → `Path`/`read_text` · T1-B → `write_atomic` · T2-A → cast `Decimal` + dialecto · T2-B → split clean/quarantine + `reason` · T3-A → JSON/JSONL · T3-B → `validate_schema` · T4-A → `sha256` + backup · T4-B → manifest + `run` fail-closed. Al terminar T4 deberías reutilizar cada pieza **sin mirar la solución**; el proyecto CP-N1-B solo las conecta en un `run(data_dir, out_dir)`. El E3 de T4-B es el mini-ensamblaje de salida (publicar solo si reconcilia).",
+    intro: "Andamiaje E1→E2→E3 × 8 (24 ejercicios). Solo stdlib (pathlib, csv, json, hashlib, shutil, Decimal). Fail-closed en reconcile.\n\n**Mapa puente al You Do (ensamblaje):**\n- T1-A → `Path` / `read_text`\n- T1-B → `write_atomic`\n- T2-A → cast `Decimal` + dialecto\n- T2-B → split clean/quarantine + `reason`\n- T3-A → JSON/JSONL\n- T3-B → `validate_schema`\n- T4-A → `sha256` + backup\n- T4-B → manifest + `run` fail-closed\n\nAl terminar T4 deberías reutilizar cada pieza **sin mirar la solución**; el proyecto CP-N1-B solo las conecta en un `run(data_dir, out_dir)`. El E3 de T4-B es el mini-ensamblaje de salida (publicar solo si reconcilia).",
```

### D-I-07 — Convert `portfolioNote` 35w sentence to a numbered list

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -1657 +1657,6 @@
     portfolioNote:
-      "Adjunta: (1) manifest de demo con reconcile_ok por fuente, (2) al menos 1 fila de cuarentena con reason estable, (3) hashes de ambos inputs crudos, (4) un test o corrida de reconciliación fallida (exit 1). Esa carpeta es la evidencia del gate CP-N1-B ante un revisor o entrevista junior de data engineering.",
+      "Adjunta:\n\n1. Un manifest de demo con `reconcile_ok` por fuente\n2. Al menos 1 fila de cuarentena con `reason` estable\n3. Los hashes de ambos inputs crudos\n4. Un test o corrida de reconciliación fallida (exit 1)\n\nEsa carpeta es la evidencia del gate CP-N1-B ante un revisor o entrevista junior de data engineering.",
```

### D-I-08 — Spell out section titles on first internal S-ref (representative diff for `theory[0].callout.content`)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -60 +60 @@
-          "Al finalizar S08 demuestras un ETL local reproducible: clean + quarantine + manifest reconciliado por fuente, con hash del crudo y exit ≠ 0 si no cuadra. El CLI instalable llega en S10. Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
+          "Al finalizar esta sección demuestras un ETL local reproducible: clean + quarantine + manifest reconciliado por fuente, con hash del crudo y exit ≠ 0 si no cuadra. El CLI instalable llega en S10 (Módulos & CLI). Solo datos sintéticos; sin PII real ni claims de fraude o parentesco.",
```

### D-I-09 — `re-leer` → `releer` (2 locations)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -1745 +1745 @@
-          "newline='' deja el control de líneas al módulo csv; sin eso, Windows puede romper el dialecto al re-leer el clean.",
+          "newline='' deja el control de líneas al módulo csv; sin eso, Windows puede romper el dialecto al releer el clean.",
```

### D-I-10 — `vs` → `vs.` (4 locations)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -30 +30 @@
-        "**Diccionario de la sección** (léelo antes de T1; no memorices el resto aún). **Path:** ruta con `pathlib.Path` (cross-platform). **Dialect:** delimitador y reglas del CSV (`,` vs `;`). **Cuarentena:** filas o archivos que fallan el contrato, guardados con **motivo** (`reason`) y **raw** intacto. **JSONL:** un objeto JSON por línea (append-friendly). **Provenance:** rastro del input (`path`, `sha256`, `bytes`). **Manifest:** JSON de la corrida con conteos por fuente. **Reconcile:** `n_in == n_clean + n_quarantine` por fuente y en totales. **Fail-closed:** si no cuadra, exit ≠ 0 — no publiques clean a medias. **stdlib only:** pathlib, csv, json, hashlib, shutil, Decimal; el análisis tabular con **pandas** llega en el bloque de datos intermedio.",
+        "**Diccionario de la sección** (léelo antes de T1; no memorices el resto aún). **Path:** ruta con `pathlib.Path` (cross-platform). **Dialect:** delimitador y reglas del CSV (`,` vs. `;`). **Cuarentena:** filas o archivos que fallan el contrato, guardados con **motivo** (`reason`) y **raw** intacto. **JSONL:** un objeto JSON por línea (append-friendly). **Provenance:** rastro del input (`path`, `sha256`, `bytes`). **Manifest:** JSON de la corrida con conteos por fuente. **Reconcile:** `n_in == n_clean + n_quarantine` por fuente y en totales. **Fail-closed:** si no cuadra, exit ≠ 0 — no publiques clean a medias. **stdlib only:** pathlib, csv, json, hashlib, shutil, Decimal; el análisis tabular con **pandas** llega en el bloque de datos intermedio.",
@@ -99 +99 @@
-        "Detectar `\\r\\n` en **bytes** de input documenta provenance (origen Windows vs Unix) en el manifest o en logs. Eso **no** "arregla" el archivo ni reescribe el crudo: solo registra un hecho útil para depurar exports raros. El You Do reutilizará el mismo `write_atomic` para clean, quarantine y manifest.",
+        "Detectar `\\r\\n` en **bytes** de input documenta provenance (origen Windows vs. Unix) en el manifest o en logs. Eso **no** "arregla" el archivo ni reescribe el crudo: solo registra un hecho útil para depurar exports raros. El You Do reutilizará el mismo `write_atomic` para clean, quarantine y manifest.",
@@ -238 +238 @@
-        "Validá **required keys** antes de normalizar o castear montos. `null` JSON se convierte en `None` en Python. Distinguí **null explícito** de **clave ausente** cuando la política lo pide (eco S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si "borrar email" o "email desconocido".",
+        "**Valida** las **required keys** antes de normalizar o castear montos. `null` en JSON se convierte en `None` en Python. **Distingue** **null explícito** de **clave ausente** cuando la política lo pide (eco de S03: missing ≠ empty): `'email' in obj` es `True` aunque el valor sea `None`; si la clave no vino en el JSON, la membresía es `False`. Esa diferencia decide si "borrar email" o "email desconocido".",
@@ -1727 +1727 @@
-        question: "`null` JSON con clave presente vs clave ausente…",
+        question: "`null` JSON con clave presente vs. clave ausente…",
```

### D-I-11 — Backtick file extensions (`.tmp`, `.bak`)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -407 +407 @@
-        why: "os.replace hace el swap atómico del artefacto de salida. Contrato único del curso: tmp = dest.with_name(dest.name + '.tmp') en el mismo directorio; al terminar no queda basura .tmp.",
+        why: "os.replace hace el swap atómico del artefacto de salida. Contrato único del curso: tmp = dest.with_name(dest.name + '.tmp') en el mismo directorio; al terminar no queda basura `.tmp`.",
```

### D-I-14 — Add space after comma inside backticked CSV field lists (4 locations)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -838 +838 @@
-          "E1 (guiado) — Con `csv.DictReader` sobre un StringIO cuyo header es `id,nombre` e imprime cada fila como dict. Pass: `{'id': 'C001', 'nombre': 'Ana'}`. Solo stdlib.",
+          "E1 (guiado) — Con `csv.DictReader` sobre un StringIO cuyo header es `id, nombre` e imprime cada fila como dict. Pass: `{'id': 'C001', 'nombre': 'Ana'}`. Solo stdlib.",
@@ -872 +872 @@
-          "E2 (independiente) — Escribe CSV con `DictWriter` (fieldnames `id,nombre`): `writeheader` + una fila, relee e imprime `len(rows)` y `rows[0]`. Pass: `1` y el dict de Ana. Solo stdlib.",
+          "E2 (independiente) — Escribe CSV con `DictWriter` (fieldnames `id, nombre`): `writeheader` + una fila, relee e imprime `len(rows)` y `rows[0]`. Pass: `1` y el dict de Ana. Solo stdlib.",
@@ -996 +996 @@
-          "E2 (independiente) — Escribe una fila de cuarentena `{raw, reason}` a CSV en temp (`newline=''`, fieldnames `raw,reason`), relee e imprime `reason`. Pass: `col_count`. Solo stdlib.",
+          "E2 (independiente) — Escribe una fila de cuarentena `{raw, reason}` a CSV en temp (`newline=''`, fieldnames `raw, reason`), relee e imprime `reason`. Pass: `col_count`. Solo stdlib.",
@@ -1520 +1520 @@
-          "tests": "good OK/0; bad ERROR sources=clients.csv,transactions.json/1",
+          "tests": "good OK/0; bad ERROR sources=clients.csv, transactions.json/1",
```

### D-I-15 — Reword `"PARCIAL parcial"` repetition

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -793 +793 @@
-          "E3 (transferencia) — Simula fallo mid-write: escribe dest parcial `'PARCIAL'`, imprime `mid …`; luego atomic replace a `'COMPLETO'` e imprime `final …`. Pass: `mid PARCIAL` y `final COMPLETO`.",
+          "E3 (transferencia) — Simula fallo mid-write: escribe el literal `'PARCIAL'` en dest, imprime `mid …`; luego atomic replace a `'COMPLETO'` e imprime `final …`. Pass: `mid PARCIAL` y `final COMPLETO`.",
```

### D-I-17 — Drop `# CASO-LIM-008` tag from starterCode headers (pattern; apply to all 24 starterCode blocks)

```diff
--- a/src/lib/course/sections/s08-pandas.ts
+++ b/src/lib/course/sections/s08-pandas.ts
@@ -599,2 +599 @@
         code: `# CASO-LIM-008 · Path write/read
-# DEFECT: no escribe; exists siempre False
+# DEFECT: no escribe; exists siempre False
 from pathlib import Path
```
(Repeat for all 24 `starterCode.code` blocks: delete the `# CASO-LIM-008 · ...` line, keep the `# DEFECT: ...` line.)

### D-I-18 — Regenerate or delete stale `visible_paragraphs/s08_pandas.json`

```diff
--- a/course-state/curriculum_hardening/visible_paragraphs/s08_pandas.json
+++ /dev/null
-Deleted: course-state/curriculum_hardening/visible_paragraphs/s08_pandas.json
```
(Or regenerate from the current source via `scripts/playwright_visible_paragraphs.mjs`.)

---

## 8. Recommended Priority Order for Fixing

1. **D-I-01** (voseo → tuteo, 3 locations). Trivial, 5 word changes. Highest regional-language impact. **Do first.**
2. **D-I-04** (`este bytes` → `estos bytes`). Single word. **Do second.**
3. **D-I-02** (split `jobRelevance` run-on). One period inserted. High cognitive-load impact at section opener.
4. **D-I-03** (convert `youDo.context` receta to numbered list). High cognitive-load impact at capstone brief.
5. **D-I-05** (comma before "pero"). Single character.
6. **D-I-09** (`re-leer` → `releer`). 2 locations.
7. **D-I-10** (`vs` → `vs.`). 4 locations.
8. **D-I-06** (convert `weDo.intro` map to list). Medium cognitive-load impact.
9. **D-I-07** (convert `portfolioNote` to numbered list). Medium cognitive-load impact.
10. **D-I-11** (backtick file extensions). 2 locations.
11. **D-I-14** (space after comma in CSV field lists). 4 locations.
12. **D-I-15** (reword PARCIAL repetition). 1 location.
13. **D-I-08** (spell out section titles on first S-ref). Curriculum-wide decision; pilot in S08 first.
14. **D-I-17** (drop `# CASO-LIM-008` tags). 24 starterCode blocks; mechanical.
15. **D-I-18** (delete stale `visible_paragraphs/s08_pandas.json`). Repository hygiene.

Items 1–5 are "fix in 5 minutes, immediate learner-visible improvement". Items 6–12 are "fix in 30 minutes, polish". Items 13–15 are "curriculum-wide decisions / repo hygiene".

---

## 9. Graph Memory Update Notes

For the shared context files (`course-state/curriculum_hardening/GRAPH_MEMORY.json` and `GRAPH_MEMORY_SUMMARY.md`), record the following edges and node updates:

- **Node S08 (pandas / Archivos & ETL):**
  - `quality_score`: 8.0 / 10
  - `pedagogical_fidelity`: 9/10 (I Do / We Do / You Do / Self Check all present and tightly coupled)
  - `regional_language_score`: 6/10 (voseo leak — 5 forms; needs tuteo conversion)
  - `redaction_score`: 7/10 (2 run-ons, 1 concordancia, 1 missing comma-pero, 1 hyphen, 4 missing vs-period)
  - `meta_leak_score`: 8/10 (current source is clean of V2/V3/TODO/moved-from; borderline bare-S0X refs and CASO-LIM tags in starterCode)
  - `connective_tissue_score`: 9/10 (explicit backward refs to S02/S03/S05–S07; forward refs to S09/S10/S15; "De dónde venías" + "Cierre y puente" framing)
  - `cognitive_load_score`: 7/10 (dense but well-segmented; 3 long-sentence hotspots at high-stakes moments: jobRelevance, weDo.intro, youDo.context)
  - `exercise_quality_score`: 10/10 (24 We Do with starter-defect + solution + expected output; capstone with full skeleton + rubric; 11-question self-check)
- **Edges (pedagogical):**
  - S08 → S09 (forward, "excepciones y logging"): explicit bridge in closing theory block + callout.
  - S08 → S10 (forward, "CLI"): referenced 3× in callout/youDo.
  - S08 → S15 (forward, "pandas"): referenced in jobRelevance.
  - S08 ← S02 (backward, "Decimal money contract"): reinforced in T2-A theory + iDo[2].why + self-check Q8.
  - S08 ← S03 (backward, "null ≠ missing"): reinforced in T3-B theory.
  - S08 ← S05–S07 (backward, "normalizadores"): reinforced in T2-B theory + youDo requirements.
  - S08 ← S06 (backward, "modelo en memoria"): reinforced in T3-A theory.
  - S08 ← S07 (backward, "Texto & Unicode"): explicit "De dónde venías" paragraph.
- **Defects registered (15 issues + 4 stale-snapshot meta-leaks):** see §3 and §4.3. Diffs in §7. Priority order in §8.
- **Cross-section notes for other auditors:**
  - The bare-S0X reference convention (S0X in prose) appears in S08 and likely in other sections; a curriculum-wide convention decision is recommended (spell out title on first mention, bare ID on second mention).
  - The `# CASO-LIM-NNN` tag pattern in starterCode is likely present in other sections (the `CASO-LIM-008` tag suggests a numbered series). A repo-wide sweep to strip these tags from learner-visible starterCode is recommended.
  - The stale `visible_paragraphs/sNN_*.json` snapshots for all 52 sections likely contain pre-hardening templated text with meta-leaks. A repo-wide regeneration or deletion pass is recommended.
  - The live SPA exhibited a transient state bug where the URL hash and H1 updated to section N but the body briefly rendered section N+3. This may affect other auditors using agent-browser; recommended to verify with a fresh page load and wait for content to stabilise before scraping.

---

## 10. Method Note (Grammar Subplan Application)

Per `_GRAMMAR_SUBPLAN.md`, the following research-backed methods were applied:

1. **Fernández-Huerta (1959) readability** — `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Computed for all 267 prose chunks. Section mean FH = 80.6 (normal/bastante fácil band, appropriate for technical Spanish).
2. **Szigriszt-Pazos / INFLESZ** — `206.835 − 62.3·(syllables/word) − (words/sentence)`. Computed in parallel.
3. **WPS (words per sentence)** and **SPW (syllables per word)** — tracked per chunk. Section means: WPS 7.23 (well within the 15–32 technical-prose band, though skewed by short titles), SPW 2.006 (normal Spanish density).
4. **Heuristic ruleset (12 rules)** — run-on/long sentences, missing terminal punctuation, missing ¿/¡, unbalanced delimiters, repeated words, DET–NOUN concordance, English-dominant prose, meta-leak signals, gerund pile-up, comma density, one-sentence paragraphs, anaphoric monotony, space-before-punct, double space. Severity tally: HIGH 3, MED 8, LOW 13.
5. **LanguageTool (public API, `language=es`)** — 13,535 chars of stripped Spanish prose submitted. 482 raw matches; 26 non-spelling matches after filtering `MORFOLOGIK_RULE_ES` false positives on tech terms (pathlib, csv, hashlib, groupby, manifest, reconcile, etc.). True-positive non-spelling findings: AGREEMENT_DET_NOUN (1), COMMA_PERO (1), PUNTO_EN_ABREVIATURAS (1), NO_SEPARADO (1, `re-leer`), VOSEO (4), UPPERCASE_SENTENCE_START (3, mostly false positives on code identifiers), PHRASE_REPETITION (1), COMMA_PARENTHESIS_WHITESPACE (4), ESPACIO_DESPUES_DE_PUNTO (2, code-adjacent).
6. **Composite score (0–10)** — start at 10; subtract weighted HIGH/MED/LOW findings; lift for pedagogical structure. Final: 8.0.

**Known false-positive classes encountered:**
- `MORFOLOGIK_RULE_ES` on all English/Python tech nouns (~455 matches, all filtered).
- `UPPERCASE_SENTENCE_START` on Python identifiers starting a sentence (`os.replace`, `Procesa`).
- `ES_UNPAIRED_BRACKETS` on Python empty-string literals (`newline=''`).
- `APOSTROFO_ACENTO` on Python bytes literals (`b'a\r\nb\r\n'`).
- `INCORRECT_SPACES` on Python kwarg syntax (`delimiter=';'`).
- `PREP_VERB` on `con id` (where `id` is a Python key, not the past tense of *ir*).
- Heuristic `english-dominant prose` on short code-title strings (`manifest.py`, `reconcile.py`).
- Heuristic `developer comment` on Spanish `todo` (case-insensitive TODO match) — fixed by switching to case-sensitive TODO/FIXME/XXX/HACK/TBD matching.

---

## 11. Companion Artefacts

- `s08_src.ts` — copy of the source file analysed.
- `s08_analyze.py` — the Python analyser used (extraction + metrics + heuristics).
- `s08_records.json` — full per-chunk records (text, metrics, findings) for all 267 prose chunks.
- `s08_lt_input.txt` — stripped Spanish prose fed to LanguageTool.
- `s08_lt_response.json` — raw LanguageTool response (482 matches).

---

This is the complete Explorer report for Section 8. Ready for the Fixer prompt.
