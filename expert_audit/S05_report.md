# S05 — Curriculum Auditor Report (PyArcana)

> **Task ID:** S05
> **Agent:** Curriculum Auditor (general-purpose)
> **Target:** Section 5 of https://pillb.github.io/pyarcana/
> **Repo source:** `src/lib/course/sections/s05-oop.ts`
> **Methodology:** Stanford STORM + Graph/Loop/Harness Engineering; Spanish-grammar subplan (`_GRAMMAR_SUBPLAN.md`) applied per paragraph and per sentence; live-site verification via `agent-browser`; LanguageTool public API (`language=es`).

---

## 1. Section Identification & Scope

**Confirmed Section 5 on the live site** by opening https://pillb.github.io/pyarcana/, clicking the curriculum button labelled `"5 Funciones & Contratos — def, defaults seguros, docstrings, pureza e inicio de normalizadores CP-N1-B"` and reading the rendered H1.

| Field | Value (source `s05-oop.ts:3-13`) | Live-site match |
|-------|----------------------------------|-----------------|
| `id` | `"oop"` | ❌ **mismatched** (see §4 Meta-Leak) |
| `index` | `5` | ✅ |
| `title` | `"Funciones, contratos y descomposición"` | ✅ H1 on live |
| `shortTitle` | `"Funciones & Contratos"` | ✅ (curriculum button) |
| `tagline` | `"def, defaults seguros, docstrings, pureza e inicio de normalizadores CP-N1-B"` | ✅ |
| `estimatedHours` | `18` | ✅ ("18h") |
| `level` | `"Principiante"` | ✅ |
| `phase` | `0` (Fundamentos) | ✅ |
| `icon` | `"FunctionSquare"` | n/a (rendered as gradient tile) |
| File name | `s05-oop.ts` | ❌ **mismatched** (see §4) |

**Scope analysed in this run (S05 only):**

| Block | Count | Detail |
|-------|-------|--------|
| Theory blocks | 8 | `Mapa de la sección`, `Definición/llamada/retorno`, `Posicionales/keyword/defaults`, `Pre/post/docstrings`, `Type hints/errores dominio`, `Funciones pequeñas/composición`, `Pureza/efectos/IO`, `LEGB/closures`, `Pruebas ejemplo/refactor`. |
| I Do demos | 8 | one per subtopic (T1-A,T1-B,T2-A,T2-B,T3-A,T3-B,T4-A,T4-B) |
| We Do exercises | 24 | 8 subtopics × 3 kinds (guided/independent/transfer) |
| You Do capstone | 1 | `normalizers_pure.py` with starter + rubric |
| Self-check questions | 8 | multiple-choice with explanation |
| Resources | 6 docs + 2 books + 4 courses | docs/books/courses |

**Roadmap context (verified):**
- **S04** (`s04-functions-modules.ts`) closes CP-N1-A (Client Intake).
- **S05** (`s05-oop.ts`) opens CP-N1-B (núcleo puro reutilizable: `normalize_nombre/email/telefono/direccion`).
- **S06** (`s06-numpy.ts`, `id: "numpy"`, title `"Colecciones y estructuras de datos"`) continues CP-N1-B with collections.
- **S08** introduces pathlib/CSV.
- **S11** (`s11-testing.ts`, `id: "testing"`, title `"OOP y modelo de dominio"`) is the actual OOP section.

**Total Spanish prose extracted:** 254 learner-facing units, 422 sentences, 3 981 words (Spanish-only; English/code strings excluded by the `looks_spanish` filter).

---

## 2. Executive Summary of Quality

**Overall score: 8 / 10** — high-quality, content-wise excellent; one significant learner-visible defect and a handful of grammatical/style nits.

**Verdict (one paragraph):** Section 5 is one of the strongest early-course sections in PyArcana: it carries a single, well-engineered narrative thread (`normalize_nombre/email/telefono/direccion`), an honest contract-driven pedagogy (`CASO-LIM-005`, gate `CP-N1-B`), strict I Do / We Do / You Do fidelity (8 demos + 24 exercises + capstone + 8 quiz questions), strong Peruvian-Spanish context (bancos/fintech/retail en Perú, Lima/Arequipa, Quispe/Huamán/Larco), and good readability (mean FH ≈ 70, mean WPS ≈ 8). However, an internal **`id` mismatch** (`"oop"` on a Functions section) leaks an off-topic **"Practica clases y herencia"** interactive editor onto the rendered page — a real, learner-visible pedagogical defect. Spanish-prose grammar is mostly clean; LanguageTool surfaces 6 real findings (after filtering 350+ false positives on Python/tech terms). Four long sentences (>32 w) should be split. Spanglish jargon (`caller`, `keyword`, `fix`, `default`, `weDo`/`youDo`) is pervasive but consistent with programming-pedagogy norms.

**Score breakdown:**

| Dimension | Score | Notes |
|-----------|-------|-------|
| Pedagogical structure (I Do / We Do / You Do) | 9/10 | 8 demos, 24 exercises (guided→independent→transfer), capstone with rubric |
| Connective tissue & narrative flow | 9/10 | Single hilo conductor; cross-refs S04→S05→S06→S08→S11 |
| Cognitive load / progressive disclosure | 9/10 | 4 subtopics × 3 kinds; subtopic IDs T1-A…T4-B |
| Grammatical correctness (Peruvian Spanish) | 7.5/10 | 6 real findings + 4 long sentences |
| Redaction & technical writing | 8/10 | Spanglish jargon consistent but heavy |
| Meta-leak cleanliness | 7/10 | No TODO/AI notes; but `id:"oop"` + `s05-oop.ts` file name cause wrong editor render |
| Exercise/exam alignment | 9/10 | Each exercise ties to a subtopic and to a `tests:` string |
| Consistency with roadmap | 9/10 | Explicit forward refs to S08/S10/S11; backward refs to S02/S03 |
| Comparison to best-in-class external materials | 8/10 | PEP 257/8, CS50P, MIT 6.100L cited; Fluent Python referenced |

---

## 3. Detailed Issue Registry

> Severity legend: **H** = high (pedagogical impact), **M** = medium (grammar/style), **L** = low (style/typography).

| # | Sev | Field / line | Evidence (quote) | Impact |
|---|-----|--------------|------------------|--------|
| 1 | **H** | `s05-oop.ts:4` (`id:"oop"`) + `SectionView.tsx:1009-1049` | Live site Section 5 → "Pruébalo tú mismo" panel renders **"Practica clases y herencia"** with `class Animal / class Perro(Animal)` code | Learner on the **Functions** section sees an **OOP** practice editor with classes, inheritance, `super()`, `__init__` — completely off-curriculum for S05. Pedagogically confusing; signals that the section was rewritten from OOP to Functions without renaming the file or updating the `id`. |
| 2 | **M** | `paragraphs:107` (theory T1-B) | `"En llamadas, los keyword tras posicionales mejoran la lectura…"` | DET/NOUN disagreement: `los` (masc. plural) + `keyword` (Eng. singular loanword). LT rule `AGREEMENT_DET_NOUN`. Should be `los keywords` (treat as borrowed plural) or `las palabras clave`. |
| 3 | **M** | `paragraphs:300` (theory T4-A) | `"\`global\` y \`nonlocal\` existen pero en S05 **casi no** los necesitas…"` | Missing comma before adversative conjunction `pero`. LT rule `COMMA_PERO`. Should be `existen, pero en S05…`. |
| 4 | **M** | `instruction:1086` (WeDo S05-T3-A-E2) and `hints:1090` | `"…dict **solo** llamando helpers: nombre con colapsa+title; email strip+lower…"` | Preposition `con` + conjugated verb `colapsa` is grammatically impossible in Spanish. LT rule `PREP_VERB`. Should be `con colapso+title` (noun) or `con colapsar+title` (infinitive). |
| 5 | **M** | `jobRelevance:15` | `"En bancos, fintech y retail en Perú, un normalizador no idempotente, con default mutable o con \`print\` en el core genera basura silenciosa en el ETL y hace imposible el test unitario del intake (inicio **CP-N1-B**)."` | 38-word run-on sentence (heuristic `run_on > 45w` not triggered but `long_sentence > 32w` is). Comma-spliced conditions blur the main verb. |
| 6 | **M** | `jobRelevance:15` | `"Tras cerrar CP-N1-A, el siguiente salto de calidad en data engineering junior es **descomponer** la lógica en funciones con contrato: normalizar nombre, email, teléfono y dirección **sin** mezclar lectura de archivos."` | 33-word long sentence; two coordinate clauses joined by colon. |
| 7 | **M** | `instruction:924` (WeDo S05-T2-B-E1) | `"Mismo hábito de hints que usarás en \`normalize_*\`: anota \`def len_campo_raw(s: str) -> int\` (longitud del raw **antes** de normalizar), retorna \`len(s)\` (int real, no str) y demuestra que el hint **no** valida en runtime."` | 36-word long sentence; mixes instruction + code identifiers + clarification in a single span. |
| 8 | **M** | `paragraphs:32` (theory Mapa) | `"**Políticas canónicas del gate** (no cambian a mitad de sección): \`normalize_nombre\` colapsa espacios y aplica **title-case por palabra**; \`normalize_email\` hace strip+lower y **\`ValueError\` si falta \`@\`**; teléfono = solo dígitos (demo); dirección = colapsa + upper."` | 34-word long sentence; semicolon-separated policy list inside one sentence — better as a bullet list. |
| 9 | **M** | `paragraphs:33` (theory Mapa) | `"Orden pedagógico: **T1 Funciones** (def/return → params/defaults) → **T2 Contratos** (pre/post/docstrings → hints y errores de dominio) → **T3 Diseño** (funciones pequeñas → pureza/I/O) → **T4 Alcance** (LEGB/closures → tests y refactor)."` | 32-word sentence; arrow-notation list inside prose. Consider a real list. |
| 10 | **L** | `content:216` (callout T2-B) | `"raise para APIs internas puras; tupla/result object cuando el lote no debe abortar en la primera fila mala."` | Callout begins with lowercase `raise`. LT rule `UPPERCASE_SENTENCE_START`. Either capitalise (`Raise para…`) — Python keyword in title-case is unusual — or restructure as `Usa \`raise\` para APIs internas puras; …`. |
| 11 | **L** | `content:216` | `"…raise para APIs internas puras; tupla/result object…"` | `APIs` marked as plural sigla. LT rule `SIGLAS`. RAE prefers invariable `API`; `APIs` is widely accepted in tech writing. Style choice. |
| 12 | **L** | `paragraphs:30` (theory Mapa) | `"**\`return\`** entrega un valor al caller (sin return → \`None\`)."` | `al caller` mixes Spanish prep `al` + English noun `caller`. LT rule `ES_SPLIT_WORDS` (false-positive suggestion `alcaller`). Could be `al llamante` or `a quien llama`, but `caller` is widely understood in programming pedagogy. |
| 13 | **L** | Multiple starter-code comments: lines 600, 632, 667, 699, 734, 773, 811, 848, 894, 937, 971, 1019, 1063, 1099, 1145, 1192, 1228, 1269, 1308, 1347, 1389, 1435, 1476, 1520 | `# DEFECT: imprime dentro y no retorna (caller ve None)` | `DEFECT` is QA/dev-culture jargon, not learner-friendly Spanish. Borderline developer meta-leak (intentional, but uses English-Spanglish label where `FALLO`, `ERROR` or `PROBLEMA` would read more naturally to a Peruvian junior). |
| 14 | **L** | `youDo.starterCode:1576, 1583, 1590, 1597, 1603` | `# Contrato: corrige el DEFECT del starter (no dejes NotImplemented)` | Same `DEFECT` jargon + `starter` (English loanword). Could be `# Contrato: corrige el fallo del código inicial (no dejes NotImplemented)`. |
| 15 | **L** | `paragraphs:225` (theory T3-A) | `"El monstruo de 40 líneas con tres políticas de campo es el anti-patrón que descompondrás…"` | `anti-patrón` hyphenated. RAE prefers `antipatrón` (one word, prefix `anti-` joined to noun). |
| 16 | **L** | `paragraphs:265, 266, 267, 268` and elsewhere | `weDo` / `youDo` in camelCase inside Spanish prose (`"la misma que exige el youDo."`, `"la misma en demos, weDo y youDo."`) | Reads as code identifier inside prose. The curriculum UI labels these tabs `"Hacemos juntos"` / `"Tú haces"` — the prose should match (e.g. `el ejercicio "Tú haces"` or at minimum `el You Do`). |
| 17 | **L** | `youDo.starterCode:1581` | `"""strip + lower. ValueError si falta @.` (docstring of `normalize_email`) | Docstring starts with lowercase `strip`. Spanish/English convention: sentence start should be capital. `"""Strip + lower. ValueError si falta @.` (or `"""Normaliza: strip + lower. ValueError si falta @.`). |
| 18 | **L** | Multiple `description`, `why`, `feedback` strings | `"Orquestador delgado reutiliza piezas pequeñas."` (why:503), `"Idempotencia de normalize_telefono puro"` (description:509), `"Verde-refactor-verde es el hábito profesional."` (feedback:1471), `"Ejemplos primero, implementación después."` (feedback:1430) | These short phrases score FH<30 because they mix 3-syllable technical nouns (`normalize_telefono`, `idempotencia`, `orquestador`) with brevity. Not real readability problems (false-positive class documented in subplan), but worth knowing the FH bands dip on technical labels. |
| 19 | **L** | Filename | `s05-oop.ts` | File name suggests "OOP" but content is "Funciones & Contratos". Internal-only (no learner impact except via issue #1). Should be renamed `s05-functions-contracts.ts` and `id` updated to `"functions-contracts"` (with corresponding `SectionView.tsx` editor-key update). |
| 20 | **L** | Various `instruction` strings | `"El starter es un **monstruo**…"` (line 1132), `"…un normalizador alternativo en un test, inyéctalo…"` (line 267) | `starter` (English loanword) and `monstruo` (informal metaphor for "ugly function") are stylistic choices — acceptable but read colloquially. |
| 21 | **L** | `paragraphs:74` (theory T1-A) and elsewhere | `"Una función se define con **\`def nombre(params):\`** y devuelve con **\`return\`**."` | Inline backtick code (`def nombre(params):`) inside Spanish prose reads as a code identifier, not as natural Spanish. Acceptable for programming pedagogy; documenting as a style note. |
| 22 | **L** | `feedback:768, 889` | `"Default mutable es anti-patrón de producción."` (FH=30.7) and `"El bug None es el más común al migrar de scripts a funciones puras del pipeline."` (FH=30.7) | Borderline-difficult feedback strings; short technical sentences. Not real issues. |
| 23 | **L** | Live site footer | `"Método I Do / We Do / You Do · 52 secciones · Exámenes con anti-plagio · Español peruano · interfaz es-PE, es-ES y English · lecciones en español peruano / lessons in Peruvian Spanish"` | Site-wide footer (not S05-specific) but visible on S05 page. Notes "español peruano" — confirms the locale target. |

**False-positive findings (filtered out, documented for transparency):**

| Source | Count | Reason filtered |
|--------|-------|-----------------|
| LT `MORFOLOGIK_RULE_ES` on Python identifiers (`def`, `f`, `strip`, `return`, `None`, `gate`, `str`, `docstring`, `normalize_nombre`, `LEGB`, `dict`, `lower`, `strip_collapse`, `ETL`, `refactor`, `ValueError`, `hints`, `raise`, `intake`, `caller`, `title`, `closures`, `core`, `PR`, `runtime`, `PEP`, `CSV`, `CLI`, `JSON`, `PE`, `CL`, `pip`, `venv`, `PII`, `lambda`, `raw`, `tuple`, `bad`, `good`, `bucket`, `booleano`, `parse`, `whitespace`, `snake_case`, `email2`, `isinstance`, `nonlocal`, `fake`, `swap`, `assert`, `ok`, `SKIP`, `PASS`, `Optional`, `Tuple`, `Callable`, `typing`, `main`, `tests`, `suite`, `mock`, `output`, `input`, `fluent`, `Ramalho`, `Matthes`, `CS50P`, `MIT`, `Kaggle`, `Coursera`, `FunctionSquare`, etc.) | 344 | All are Python/tech identifiers or proper nouns intentionally kept in English/code form |
| LT `WHITESPACE_RULE` on `'  Ana   María  '`, `'  Juan   Pérez '`, `'  a  b '`, `'  A@B.COM '` | 8 | Intentional multi-space test data inside code-string literals |
| LT `DIACRITICS_02` on `titulo` (lines 686, 700, 701) | 3 | `titulo` is the Python parameter name (inside backticks), not Spanish prose. Python 3 permits accents in identifiers, but the codebase convention is no-accents. |
| LT `DIACRITICS_OTHERS` on `valida` (lines 924, 948) | 2 | `valida` is the 3rd-person singular verb of `validar` (`"el hint no valida en runtime"`), not the adjective `válida`. |
| LT `AGREEMENT_POSTPONED_ADJ` on `globales` (line 265) | 1 | `globales` is a noun (short for `variables globales`), not a postponed adjective. |
| LT `PUNTO_EN_ABREVIATURAS` on `doc` and `tel` (3 instances) | 3 | `doc` is short for `docstring` (English), `tel` is short for the code identifier `normalize_telefono`. Borderline; could be expanded to `docstring` / `teléfono` in prose. |
| Heuristic `no_terminal` on titles / headings / taglines / learning outcomes | ~30 | Titles and labels don't require terminal punctuation by convention. |
| Heuristic `unbalanced_delim` on `paragraphs:266, 345` | 2 | Sentence splitter breaks on the abbreviation `p.` (in `(p. ej. …)`), fragmenting parentheses across sentences. The original text is balanced. |

---

## 4. Meta-Leak Report

**Strict meta-leak scan** (regex `TODO|FIXME|XXX|HACK|moved from|see also|lorem|placeholder|TBD|WIP|draft|remove this|delete this|note to self|@author|@reviewer|@team|pending review|to be added|coming soon|originalmente|previamente|antes estaba|sección anterior|se movió|sección X|en realidad|cambiar a|cambió a|ojo:|nota interna|no borrar|no tocar|deprecated|obsoleto|legacy`):

- **Zero** direct AI-to-developer comments, zero "moved from section X" notes, zero TODO/FIXME markers in `s05-oop.ts`.
- **Zero** authoring-residue strings (`lorem`, `placeholder`, `TBD`, etc.).

**Indirect / structural meta-leaks (worth flagging):**

1. **`id:"oop"` on a Functions section** (line 4) — `s05-oop.ts` and the `id:"oop"` value are leftovers from an earlier OOP-themed draft that was rewritten into Functions & Contracts. The mismatch is invisible to a reader of the source file alone, but the live-site `SectionView.tsx` component keys its "Pruébalo tú mismo" interactive editor by `section.id`, so the rendered S05 page shows:
   - Title: `"Practica clases y herencia"` (line `SectionView.tsx:1010`)
   - Code: `class Animal / class Perro(Animal)` with `super()` and `__init__` (lines 1011-1042)
   - Hint: `'Crea una clase Gato que herede de Animal y haga "Miau!"'` (line 1048)
   
   This is a **learner-facing pedagogical leak**: a Functions section is showing OOP practice. The fix is to rename the file to `s05-functions-contracts.ts`, change `id` to `"functions-contracts"`, and add a new key `'functions-contracts'` in `SectionView.tsx`'s interactive-editor map with a Functions-appropriate starter (e.g. a `normalize_email` snippet).

2. **`DEFECT` label in starter-code comments** (lines 600, 632, 667, 699, 734, 773, 811, 848, 894, 937, 971, 1019, 1063, 1099, 1145, 1192, 1228, 1269, 1308, 1347, 1389, 1435, 1476, 1520, 1576, 1583, 1590, 1597, 1603) — used 29 times. The label is intentional (it tells the learner "this is the bug to fix"), but `DEFECT` is QA/dev jargon (English). Spanish-speaking juniors would recognise `FALLO`, `ERROR`, `BUG` or `PROBLEMA` more readily. Borderline meta-leak: it is a teacher→learner label, not a developer→developer one, but the word choice reveals an authoring style imported from English QA culture.

3. **`weDo` / `youDo` camelCase identifiers in Spanish prose** (lines 75, 152, 580, etc.) — these are pedagogical-method labels ("We Do" / "You Do") that the curriculum UI renders as `Hacemos juntos` / `Tú haces`. The prose should match the UI labels. The current `weDo`/`youDo` reads as a leaked code identifier.

**Verdict on meta-leak:** **Clean** for direct AI/developer residue. **One structural leak** (`id:"oop"` → wrong interactive editor on the live site) is the highest-impact issue in this audit.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos, lines 386-577):** Excellent fidelity. Each demo maps 1-to-1 to a subtopic (`S05-T1-A-DEMO` … `S05-T4-B-DEMO`), each has `description`, `code`, `why`, and `environment: "browser-pyodide"`. The `why` field is consistently one short sentence explaining the pedagogical beat (e.g. `"Una función, un return, política CP-N1-B: colapsar + title; Unicode simple."`). **Minor nit:** `why:503` reads `"Orquestador delgado reutiliza piezas pequeñas."` (FH=9.7) — short, technical, slightly telegraphic; could be `"El orquestador delgado reutiliza piezas pequeñas."` for full sentence grammar.

**We Do (24 exercises, lines 581-1542):** Exemplary 3-kind scaffold per subtopic:
- `E1` (guided) — half-solved starter with `# DEFECT:` comment.
- `E2` (independent) — starter with `# DEFECT:`, learner writes the body.
- `E3` (transfer) — applies the pattern to a near-real scenario (intake edge, batch tolerance, factory).

Each exercise carries: `instruction`, `hint`, `hints[2]`, `edgeCases[]`, `tests`, `feedback`, `starterCode`, `solutionCode`. The two-hint progressive disclosure (`hint` then `hints[]`) is excellent — the UI shows both, but the first is the canonical nudge. **Minor nit:** `instruction:924` is 36 words long (issue #7); `instruction:798` is 30 words; both could be split. The `tests` strings (e.g. `"exact line 2"`, `"Juan Pérez / Quispe"`, `"999000 y 999-000"`) are concrete and checkable. The `feedback` strings are pedagogically rich (e.g. `"__doc__ es el contrato legible por help() y por el revisor del PR."`).

**You Do (capstone, lines 1544-1648):** Capstone `normalizers_pure.py` is a well-scoped portfolio artefact: 4 normalizers + `normalize_record` orchestrator + `is_idempotent` helper + `_run_tests()` + `main()`. The `starterCode` raises `NotImplementedError` in each function with a `# Contrato: corrige el DEFECT del starter` comment — learner must implement each. The `rubric` weights are sensible (25% correctness, 25% idempotency, 20% purity, 15% docstrings/hints/errors, 10% orchestrator+tests, 5% Spanish docs). The `portfolioNote` directs the learner to document policy in Spanish and mention that file I/O comes in S08 — strong forward reference. **Nit:** the starter docstring `"""strip + lower. ValueError si falta @.` (line 1581) starts lowercase (issue #17); should be `"""Strip + lower. ValueError si falta @.` for sentence-case convention. Also `normalize_telefono`'s docstring `"""Solo dígitos (política PE sintética de demo)."""` is fine but the body comment `# Contrato: corrige el DEFECT del starter` again uses the `DEFECT` jargon (issue #14).

**Self-check (8 questions, lines 1651-1707):** All 8 questions cover distinct concepts (return None, default mutable, purity, LEGB, idempotencia, docstring vs `#`, keyword-only `*`, orquestador delgado). Each has 4 options, `correctIndex`, and `explanation`. The distractors are pedagogically plausible (e.g. for LEGB: `"List, Else, Generator, Break"`, `"Loop, Eval, Global, Binary"`, `"Lambda, Except, Goto, Block"` — all real-sounding acronyms). Explanations are 1-line. **Nit:** `explanation:1670` `"Pureza = determinismo + sin side effects; ideal para normalizadores."` (FH=18.7) mixes Spanish with `side effects` (English). Could be `"Pureza = determinismo + sin efectos colaterales; ideal para normalizadores."`.

### 5.2 Cognitive load & progressive disclosure

The 4-topic × 3-kind lattice keeps cognitive load controlled:
- **T1** (Funciones) introduces `def`/`return`/params/defaults — syntactic foundation.
- **T2** (Contratos) layers docstrings, type hints, domain errors — semantic layer.
- **T3** (Diseño) introduces composition, purity, I/O at the edge — design layer.
- **T4** (Alcance) introduces LEGB, closures, refactor-with-tests — scope/testing layer.

Each subtopic has its own `subtopicId` (e.g. `S05-T1-A`) referenced from theory → iDo → weDo, so a learner can navigate horizontally. The "Políticas canónicas del gate" callout (line 32) freezes the four normalization policies up-front — a strong cognitive-load reducer.

**One concern:** the theory Mapa section (lines 28-34) front-loads 8 dictionary terms (`Función`, `return`, `Contrato`, `Default seguro`, `Función pura`, `Idempotencia`, `Orquestador delgado`, `LEGB`, `Keyword-only`) in a single 88-word paragraph (line 30) at FH=70.4 (bastante fácil). For a Principiante-level section this is dense; consider breaking the dictionary into a real `<ul>` of definitions (the UI already supports Markdown lists).

### 5.3 Connective tissue & narrative flow

Strongest dimension of S05. The four normalizers (`normalize_nombre/email/telefono/direccion`) are introduced in the Mapa and re-appear in every theory block, every I Do demo, every We Do exercise, and the You Do capstone. Cross-references are explicit and load-bearing:
- Backward: S02 (Decimal/string contract), S03 (rules), S04 (cierre CP-N1-A).
- Forward: S06 (colecciones), S08 (pathlib/CSV), S10 (CLI), S11 (clases de dominio).
- Sideways: PEP 257, PEP 8, Fluent Python (Ramalho), Python Crash Course (Matthes), CS50P, MIT 6.100L.

The `CASO-LIM-005` lab-case ID is referenced 33 times — a strong contract anchor.

### 5.4 Redaction & technical writing

Tone is consistently teacher-voiced (second-person singular `tú`: `"corrige"`, `"no abuses"`, `"demuéstralo"`, `"inyéctalo"`). Peruvian-Spanish markers: `bancos, fintech y retail en Perú`, `Lima`, `Arequipa`, `Cusco`, `Quispe`, `Huamán`, `Larco`, `Unión`, `Pérez`, `María José`. Numerals use Peruvian decimal/thousand conventions (no `1.234,56` mismatches). Em-dashes (`—`) are used consistently for parenthetical breaks. Curly quotes (`""`) are used for scare-quoted terms (`"romper"`, `"refactor"`, `"de paso"`, `"normalice"`) — typographically correct.

**Spanglish inventory** (words appearing in Spanish prose that are English/Python loanwords): `caller`, `keyword`, `keywords`, `default`, `defaults`, `hint`, `hints`, `fix`, `fake`, `edge cases`, `starter`, `inline`, `call site`, `weDo`, `youDo`, `I Do`, `We Do`, `You Do`, `lambda`, `tuple`, `dict`, `list`, `set`, `int`, `str`, `bool`, `Optional`, `Tuple`, `Callable`, `runtime`, `typechecker`, `mypy`, `pytest`, `snake_case`, `title-case`, `lower`, `upper`, `strip`, `split`, `join`, `print`, `return`, `def`, `None`, `ValueError`, `NameError`, `NotImplementedError`, `__doc__`, `__main__`, `Nonlocal`, `global`, `PR`, `ETL`, `CLI`, `CSV`, `JSON`, `JSONL`, `SQL`, `BOM`, `CRLF`, `LF`, `ASCII`, `UTF-8`, `PII`, `PE`, `CL`, `CP-N1-A`, `CP-N1-B`, `CASO-LIM-005`, `LEGB`, `PEP`, `S05`, `S08`, `S10`, `S11`, `T1-A`, `T4-B`, etc.

This volume of loanwords is **expected** in a programming curriculum and is consistent with the "español peruano técnico" register declared in the site footer. No action needed unless the team wants to translate the most jarring ones (`caller`→`llamante`, `fix`→`parche`, `fake`→`falso`).

### 5.5 Comparison with best-in-class external materials

| Resource | How S05 compares |
|----------|-------------------|
| **Python Tutorial (docs.python.org)** — "Defining Functions" | S05 covers the same ground (`def`, `return`, defaults, keyword) but adds the contract layer (pre/post/docstrings) and the I/O-at-the-edge principle — both absent from the official tutorial. ✅ Stronger. |
| **PEP 257 (Docstring Conventions)** | S05 cites PEP 257 in resources and uses one-line + multi-line docstrings correctly in demos/exercises. The docstring style is consistent (Spanish summary + `Pre:`/`Post:`/`Raises:` tags). ✅ Aligned. |
| **PEP 8 (Function names)** | snake_case + verb-noun convention enforced (`normalize_email`, `strip_collapse`, `make_phone_normalizer`). ✅ Aligned. |
| **CS50P — Functions** | S05 has more depth (contracts, purity, idempotency, LEGB) and more exercises (24 vs ~6). ✅ Stronger. |
| **MIT 6.100L** | S05 mirrors the abstractions-and-contracts framing but adds the LATAM data-engineering context (intake, ETL, PII). ✅ Differentiated. |
| **Fluent Python (Ramalho)** | S05 cites it for "post-S05" depth. The closure-factory demo (`make_phone_normalizer`) is a faithful miniature of Ramalho's Chapter 7 pattern. ✅ Aligned. |
| **Python Crash Course (Matthes)** | S05 is more rigorous on defaults-mutable and idempotency; Matthes is gentler. ✅ Complementary. |

**Verdict:** S05 is at or above the quality of these references for its scope (junior data-engineer track in Peruvian Spanish).

---

## 6. Grammatical improvements — paragraph-by-paragraph rewrites (before / after)

> For each tab (Theory / I Do / We Do / You Do / Self-check), I select the paragraphs/sentences with real grammar or readability issues and propose a rewrite. Issues marked **(false positive)** are documented but not rewritten.

### 6.1 Theory tab

#### Theory block 1 — `Mapa de la sección: funciones con contrato` (line 28)

**Paragraph 1 (line 30, dictionary) — FH=70.4, WPS=8.8, 10 sentences, 88 words:**
- *Before:* `"**Diccionario de la sección** (léelo antes de T1). **Función (\`def\`):** bloque reutilizable con nombre de verbo. **\`return\`** entrega un valor al caller (sin return → \`None\`). **Contrato:** precondiciones + postcondiciones documentadas (docstring) y alineadas al código. **Default seguro:** no uses lista/dict mutable como valor por defecto. **Función pura:** mismo input → mismo output, sin I/O ni prints. **Idempotencia:** \`f(f(x)) == f(x)\` en el caso feliz. **Orquestador delgado:** combina normalizadores sin reimplementar reglas. **LEGB:** orden Local → Enclosing → Global → Builtin. **Keyword-only:** parámetros tras \`*\` que obligan \`nombre=\` en la llamada."`
- *After (split into a list, replace `al caller` → `a quien llama`):* `"**Diccionario de la sección** (léelo antes de T1):\n\n- **Función (\`def\`)**: bloque reutilizable con nombre de verbo.\n- **\`return\`**: entrega un valor a quien llama (sin \`return\` → \`None\`).\n- **Contrato**: precondiciones + postcondiciones documentadas (docstring) y alineadas al código.\n- **Default seguro**: no uses lista/dict mutable como valor por defecto.\n- **Función pura**: mismo input → mismo output, sin I/O ni \`print\`s.\n- **Idempotencia**: \`f(f(x)) == f(x)\` en el caso feliz.\n- **Orquestador delgado**: combina normalizadores sin reimplementar reglas.\n- **LEGB**: orden Local → Enclosing → Global → Builtin.\n- **Keyword-only**: parámetros tras \`*\` que obligan \`nombre=\` en la llamada."`
- *Why:* Reduces cognitive load (9 definitions as a list, not a wall of text); replaces Spanglish `al caller` with `a quien llama`.

**Paragraph 3 (line 32) — issue #8, 34-word long sentence:**
- *Before:* `"**Políticas canónicas del gate** (no cambian a mitad de sección): \`normalize_nombre\` colapsa espacios y aplica **title-case por palabra**; \`normalize_email\` hace strip+lower y **\`ValueError\` si falta \`@\`**; teléfono = solo dígitos (demo); dirección = colapsa + upper. Cada normalizador debe ser **idempotente** en el caso feliz: \`f(f(x)) == f(x)\`."`
- *After (split into list):* `"**Políticas canónicas del gate** (no cambian a mitad de sección):\n\n- \`normalize_nombre\`: colapsa espacios + **title-case por palabra**.\n- \`normalize_email\`: \`strip\` + \`lower\` y \`ValueError\` si falta \`@\`.\n- \`normalize_telefono\`: solo dígitos (demo).\n- \`normalize_direccion\`: colapsa + \`upper\`.\n\nCada normalizador debe ser **idempotente** en el caso feliz: \`f(f(x)) == f(x)\`."`
- *Why:* 34w sentence → 4 short bullets + 1 short sentence. Lower WPS, lower cognitive load.

**Paragraph 4 (line 33) — issue #9, 32-word long sentence:**
- *Before:* `"Orden pedagógico: **T1 Funciones** (def/return → params/defaults) → **T2 Contratos** (pre/post/docstrings → hints y errores de dominio) → **T3 Diseño** (funciones pequeñas → pureza/I/O) → **T4 Alcance** (LEGB/closures → tests y refactor). En cada subtema: teoría, un demo I Do y tres prácticas We Do (guiada, independiente, transferencia). Más adelante empaquetarás esto en CLI y modelarás registros con clases de dominio. Hoy el objetivo es el **núcleo puro** que un ETL junior puede testear sin abrir archivos."`
- *After (split):* `"Orden pedagógico:\n\n- **T1 Funciones**: \`def\`/\`return\` → params/defaults.\n- **T2 Contratos**: pre/post/docstrings → hints y errores de dominio.\n- **T3 Diseño**: funciones pequeñas → pureza/I/O.\n- **T4 Alcance**: LEGB/closures → tests y refactor.\n\nEn cada subtema: teoría, un demo I Do y tres prácticas We Do (guiada, independiente, transferencia). Más adelante empaquetarás esto en CLI y modelarás registros con clases de dominio. Hoy el objetivo es el **núcleo puro** que un ETL junior puede testear sin abrir archivos."`
- *Why:* Same pattern — convert arrow-notation list inside prose into a real list.

#### Theory block 3 — `Posicionales, keyword y defaults seguros` (line 103)

**Paragraph 2 (line 107) — issue #2, DET/NOUN disagreement:**
- *Before:* `"Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los keyword tras posicionales mejoran la lectura en sitios de llamada largos (orquestadores, tests) y evitan invertir argumentos silenciosamente — un swap \`nombre, email\` es un incidente de calidad de datos."`
- *After:* `"Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los **keyword arguments** tras los posicionales mejoran la lectura en sitios de llamada largos (orquestadores, tests) y evitan invertir argumentos silenciosamente — un swap \`nombre, email\` es un incidente de calidad de datos."`
- *Why:* `los keyword` → `los keyword arguments` (treat `keyword argument` as a borrowed compound noun, pluralised on the head noun `argument`). Alternative: `las palabras clave`. Either fixes the DET/NOUN disagreement.

#### Theory block 7 — `LEGB y closures básicos` (line 295)

**Paragraph 3 (line 300) — issue #3, missing comma before `pero`:**
- *Before:* `"\`global\` y \`nonlocal\` existen pero en S05 **casi no** los necesitas: prefiere **return** de valores nuevos y factories con closure. Mutar globales complica tests, rompe pureza y hace que dos normalizadores compartan estado invisible entre llamadas — un anti-patrón en ETL junior."`
- *After:* `"\`global\` y \`nonlocal\` existen, pero en S05 **casi no** los necesitas: prefiere **return** de valores nuevos y factories con closure. Mutar globales complica tests, rompe pureza y hace que dos normalizadores compartan estado invisible entre llamadas — un antipatrón en ETL junior."`
- *Why:* Add comma before `pero` (LT `COMMA_PERO`); join `anti-patrón` → `antipatrón` (RAE preference, issue #15).

#### Theory block 6 — `Pureza, efectos e inyección de I/O` (line 262)

**Paragraph 3 (line 267) — 32-word sentence, issue #9 class:**
- *Before:* `"La **I/O** (stdin, archivos, red) se queda en el **borde**: \`main\`, CLI, o funciones \`load_*\` / \`save_*\`. El core no conoce el filesystem. Cuando necesites un normalizador alternativo en un test, **inyéctalo** como argumento (ver tip); no hardcodees \`open(...)\` dentro del pure core ni uses un \`lambda\` gigante como sustituto de un \`def\` con nombre."`
- *After (split the long last sentence):* `"La **I/O** (stdin, archivos, red) se queda en el **borde**: \`main\`, CLI, o funciones \`load_*\` / \`save_*\`. El core no conoce el filesystem. Cuando necesites un normalizador alternativo en un test, **inyéctalo** como argumento (ver tip). No hardcodees \`open(...)\` dentro del pure core ni uses un \`lambda\` gigante como sustituto de un \`def\` con nombre."`
- *Why:* Split 32w sentence into 2 sentences at the semicolon.

#### Theory block 2 — `Definición, llamada y retorno` (line 71)

**Paragraph 2 (line 75) — `youDo` camelCase in prose, issue #16:**
- *Before:* `"Las funciones son **valores de primera clase**: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización; no abuses de callbacks todavía. El primer normalizador del hilo, \`normalize_nombre\`, ya usa la política del gate: colapsar espacios y title-case por palabra — la misma que exige el youDo."`
- *After:* `"Las funciones son **valores de primera clase**: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización; no abuses de callbacks todavía. El primer normalizador del hilo, \`normalize_nombre\`, ya usa la política del gate: colapsar espacios y title-case por palabra — la misma que exige el ejercicio **Tú haces**."`
- *Why:* Replace leaked code identifier `youDo` with the UI label `Tú haces` (or, at minimum, `You Do`).

### 6.2 I Do tab

**`intro` (line 385):** `"Ocho demos I Do (uno por subtema). Del def al refactor con ejemplos. Los normalizadores son el hilo hacia CP-N1-B. Datos sintéticos; browser-pyodide."` — FH=78.4, fine. **No rewrite needed.**

**`why:503`:** `"Orquestador delgado reutiliza piezas pequeñas."` — 5w, FH=9.7 (technical-label false positive). **No rewrite needed** (FH band misleading on a 5-word label).

**`description:509`:** `"Idempotencia de normalize_telefono puro"` — title-style, FH=9.7 false positive. **No rewrite needed.**

**All 8 I Do `description` strings:** clean. **No rewrites needed.**

### 6.3 We Do tab

**`intro` (line 580):** `"Andamiaje por subtema: **E1 guiado → E2 independiente → E3 transferencia**. Completa los **8 subtemas** (24 ejercicios). Cada uno trae **2 hints**. Ejecuta y compara. Datos sintéticos únicamente."` — FH=48.2 (difficult), 4.6 WPS. Low FH is a false positive (short technical sentences). **No rewrite needed.**

**`instruction:924` (WeDo S05-T2-B-E1) — issue #7, 36w long sentence:**
- *Before:* `"E1 (guiado) — CASO-LIM-005. Mismo hábito de hints que usarás en \`normalize_*\`: anota \`def len_campo_raw(s: str) -> int\` (longitud del raw **antes** de normalizar), retorna \`len(s)\` (int real, no str) y demuestra que el hint **no** valida en runtime. Imprime el resultado y la línea exacta \`hint no valida en runtime\`. Pasa: \`3\` y esa nota."`
- *After (split the long second sentence):* `"E1 (guiado) — CASO-LIM-005. Mismo hábito de hints que usarás en \`normalize_*\`. Anota \`def len_campo_raw(s: str) -> int\` (longitud del raw **antes** de normalizar), retorna \`len(s)\` (int real, no str) y demuestra que el hint **no** valida en runtime. Imprime el resultado y la línea exacta \`hint no valida en runtime\`. Pasa: \`3\` y esa nota."`
- *Why:* Replace colon-join with a period to break 36w sentence into 24w + 12w.

**`instruction:1086` (WeDo S05-T3-A-E2) — issue #4, `con colapsa+title` PREP_VERB:**
- *Before:* `"E2 (independiente) — CASO-LIM-005. Orquestador \`normalize_contact(nombre, email)\` devuelve dict **solo** llamando helpers: nombre con colapsa+title; email strip+lower con **ValueError si falta @**. Pasa: \`{'nombre': 'Luis', 'email': 'l@e.com'}\`."`
- *After:* `"E2 (independiente) — CASO-LIM-005. Orquestador \`normalize_contact(nombre, email)\` devuelve dict **solo** llamando helpers: nombre con **colapso + title**; email con **strip + lower** y \`ValueError\` si falta \`@\`. Pasa: \`{'nombre': 'Luis', 'email': 'l@e.com'}\`."`
- *Why:* `colapsa` (verb) → `colapso` (noun) — fixes `PREP_VERB`. Also smoothes the parallel `con ... con ...` structure.

**`hints:1090`:** `"norm_e: strip+lower y raise si falta @ (mismo contrato del gate)."` — same `colapsa` issue class but here `colapsa` doesn't appear. **No rewrite needed.**

**`feedback:768`:** `"Default mutable es anti-patrón de producción."` → `"El default mutable es un antipatrón de producción."` (issue #15: `anti-patrón` → `antipatrón`; add article `El` and `un` for natural Spanish flow). Minor.

**`feedback:889`:** `"El bug None es el más común al migrar de scripts a funciones puras del pipeline."` — fine, no rewrite. `bug None` is acceptable Spanglish for "None bug".

**`instruction:1132` (WeDo S05-T3-A-E3):** `"El starter es un **monstruo** con tres políticas inline (nombre title, email con @, tel dígitos). Descompón en 3 funciones + orquestador delgado. Misma salida. Pasa: dict con \`nombre\`/\`email\`/\`tel\` normalizados."` — `starter` and `inline` are English loanwords. Could be `"El código inicial es un **monstruo** con tres políticas intercaladas (nombre title, email con @, tel dígitos)…"`. Style choice; current form is acceptable for the programming register.

### 6.4 You Do tab

**`context` (line 1547):** `"Inicias **CP-N1-B** con el núcleo reutilizable: \`normalize_nombre\`, \`normalize_email\`, \`normalize_telefono\`, \`normalize_direccion\` como funciones **puras**, con docstring, hints graduales e **idempotencia** demostrada. Sin pathlib CSV todavía (S08) y sin clases de dominio (S11). Solo datos sintéticos."` — FH=51.8, 3 sentences, 38 words. Sentence 1 is 22w — at threshold but acceptable. **No rewrite needed.**

**`portfolioNote` (line 1639):** `"Documenta en español la política de cada normalizador y pega la salida de la suite. Menciona que la I/O de archivos llegará en S08; aquí solo el core puro."` — clean. **No rewrite needed.**

**`starterCode` docstring (line 1581):** `"""strip + lower. ValueError si falta @.` — issue #17, lowercase sentence start.
- *After:* `"""Strip + lower. ValueError si falta @.`

**`starterCode` comments (lines 1576, 1583, 1590, 1597, 1603) — issue #14, `DEFECT` jargon:**
- *Before:* `# Contrato: corrige el DEFECT del starter (no dejes NotImplemented)`
- *After:* `# Contrato: corrige el fallo del código inicial (no dejes NotImplemented)`
- *Why:* Replace `DEFECT` (QA/dev jargon) and `starter` (English loan) with Spanish equivalents. Apply to all 5 occurrences.

### 6.5 Self-check tab

**`question:1652`:** `"Si una función no tiene return, ¿qué devuelve la llamada?"` — clean. **No rewrite.**

**`explanation:1670`:** `"Pureza = determinismo + sin side effects; ideal para normalizadores."` — `side effects` English.
- *After:* `"Pureza = determinismo + sin efectos colaterales; ideal para normalizadores."`

**`explanation:1677`:** `"Orden de resolución de nombres en Python."` — clean. **No rewrite.**

**`question:1687`:** `"¿Qué diferencia un docstring de un comentario \`#\` justo bajo \`def\`?"` — clean. **No rewrite.**

**All 8 questions** are pedagogically aligned to the 8 subtopics. Distractors are well-designed. **No rewrites needed except #1670.**

---

## 7. Proposed GitHub-style Diffs

> Diffs are **proposed only**; not applied. Line numbers reference `src/lib/course/sections/s05-oop.ts` unless noted.

### Diff 1 (HIGH — fix `id` and filename; add editor key in SectionView)

```diff
--- a/src/lib/course/sections/s05-oop.ts
+++ b/src/lib/course/sections/s05-oop.ts
-Renamed: src/lib/course/sections/s05-functions-contracts.ts
@@ -1,8 +1,8 @@
 import type { CourseSection } from '../../types'
 
 export const section05: CourseSection = {
-  id: "oop",
+  id: "functions-contracts",
   index: 5,
   title: "Funciones, contratos y descomposición",
   shortTitle: "Funciones & Contratos",
```

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
-import { section05 } from './sections/s05-oop'
+import { section05 } from './sections/s05-functions-contracts'
```

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -1006,6 +1006,29 @@ const interactiveEditors: Record<string, { title: string; code: string; expected
       hint: 'Crea una clase Gato que herede de Animal y haga "Miau!"',
     },
+    'functions-contracts': {
+      title: 'Practica funciones puras y normalizadores',
+      code: `# Practica funciones puras (S05 / CP-N1-B)
+def normalize_email(raw: str) -> str:
+    """Strip + lower; ValueError si falta @."""
+    s = raw.strip().lower()
+    if "@" not in s:
+        raise ValueError("email sin @")
+    return s
+
+# Idempotencia: f(f(x)) == f(x)
+samples = ["  A@B.COM ", "x"]
+for s in samples:
+    try:
+        once = normalize_email(s)
+        twice = normalize_email(once)
+        print(s, "→", once, "idempotent=", once == twice)
+    except ValueError as e:
+        print(s, "→ err:", e)`,
+      expectedOutput: `  A@B.COM  → a@b.com idempotent= True
+x → err: email sin @`,
+      hint: 'Crea normalize_telefono(raw) que devuelva solo dígitos y verifica idempotencia',
+    },
     'numpy': {
```

> **Note:** Also rename `s11-testing.ts`'s `id: "testing"` to `"oop-dominio"` (or similar) — that file's title is `"OOP y modelo de dominio"`, so the `testing` id is itself a leftover from a prior draft. Out of scope for S05 audit but flagged for S11's auditor.

### Diff 2 (M — `los keyword` agreement, line 107)

```diff
@@ paragraphs (line 107) @@
-        "Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los keyword tras posicionales mejoran la lectura en sitios de llamada largos (orquestadores, tests) y evitan invertir argumentos silenciosamente — un swap `nombre, email` es un incidente de calidad de datos.",
+        "Orden recomendado: obligatorios posicionales, luego opcionales con default. En llamadas, los **keyword arguments** tras los posicionales mejoran la lectura en sitios de llamada largos (orquestadores, tests) y evitan invertir argumentos silenciosamente — un swap `nombre, email` es un incidente de calidad de datos.",
```

### Diff 3 (M — missing comma before `pero` + `anti-patrón` → `antipatrón`, line 300)

```diff
@@ paragraphs (line 300) @@
-        "`global` y `nonlocal` existen pero en S05 **casi no** los necesitas: prefiere **return** de valores nuevos y factories con closure. Mutar globales complica tests, rompe pureza y hace que dos normalizadores compartan estado invisible entre llamadas — un anti-patrón en ETL junior.",
+        "`global` y `nonlocal` existen, pero en S05 **casi no** los necesitas: prefiere **return** de valores nuevos y factories con closure. Mutar globales complica tests, rompe pureza y hace que dos normalizadores compartan estado invisible entre llamadas — un antipatrón en ETL junior.",
```

### Diff 4 (M — `con colapsa+title` PREP_VERB, line 1086)

```diff
@@ instruction (line 1086) @@
-          "E2 (independiente) — CASO-LIM-005. Orquestador `normalize_contact(nombre, email)` devuelve dict **solo** llamando helpers: nombre con colapsa+title; email strip+lower con **ValueError si falta @**. Pasa: `{'nombre': 'Luis', 'email': 'l@e.com'}`.",
+          "E2 (independiente) — CASO-LIM-005. Orquestador `normalize_contact(nombre, email)` devuelve dict **solo** llamando helpers: nombre con **colapso + title**; email con **strip + lower** y `ValueError` si falta `@`. Pasa: `{'nombre': 'Luis', 'email': 'l@e.com'}`.",
```

### Diff 5 (M — split long sentence in jobRelevance, line 15)

```diff
@@ jobRelevance (line 15) @@
-    "Tras cerrar CP-N1-A, el siguiente salto de calidad en data engineering junior es **descomponer** la lógica en funciones con contrato: normalizar nombre, email, teléfono y dirección **sin** mezclar lectura de archivos. En bancos, fintech y retail en Perú, un normalizador no idempotente, con default mutable o con `print` en el core genera basura silenciosa en el ETL y hace imposible el test unitario del intake (inicio **CP-N1-B**). Aquí construyes el núcleo puro reutilizable; más adelante lo empaquetas en CLI y lo modelas con clases de dominio cuando el contrato ya sea confiable.",
+    "Tras cerrar CP-N1-A, el siguiente salto de calidad en data engineering junior es **descomponer** la lógica en funciones con contrato: normalizar nombre, email, teléfono y dirección **sin** mezclar lectura de archivos. En bancos, fintech y retail en Perú, un normalizador no idempotente —o con default mutable, o con `print` en el core— genera basura silenciosa en el ETL y hace imposible el test unitario del intake (inicio **CP-N1-B**). Aquí construyes el núcleo puro reutilizable; más adelante lo empaquetas en CLI y lo modelas con clases de dominio cuando el contrato ya sea confiable.",
```

> *Rationale:* Replace comma-spliced conditions `no idempotente, con default mutable o con print` with em-dash parenthetical `no idempotente —o con default mutable, o con print—` to mark them as apposition rather than coordinate clauses. Reduces WPS without losing meaning.

### Diff 6 (M — split long sentence in instruction, line 924)

```diff
@@ instruction (line 924) @@
-          "E1 (guiado) — CASO-LIM-005. Mismo hábito de hints que usarás en `normalize_*`: anota `def len_campo_raw(s: str) -> int` (longitud del raw **antes** de normalizar), retorna `len(s)` (int real, no str) y demuestra que el hint **no** valida en runtime. Imprime el resultado y la línea exacta `hint no valida en runtime`. Pasa: `3` y esa nota.",
+          "E1 (guiado) — CASO-LIM-005. Mismo hábito de hints que usarás en `normalize_*`. Anota `def len_campo_raw(s: str) -> int` (longitud del raw **antes** de normalizar), retorna `len(s)` (int real, no str) y demuestra que el hint **no** valida en runtime. Imprime el resultado y la línea exacta `hint no valida en runtime`. Pasa: `3` y esa nota.",
```

### Diff 7 (M — convert paragraph 32 to a list, line 32)

```diff
@@ paragraphs (line 32) @@
-        "**Políticas canónicas del gate** (no cambian a mitad de sección): `normalize_nombre` colapsa espacios y aplica **title-case por palabra**; `normalize_email` hace strip+lower y **`ValueError` si falta `@`**; teléfono = solo dígitos (demo); dirección = colapsa + upper. Cada normalizador debe ser **idempotente** en el caso feliz: `f(f(x)) == f(x)`.",
+        "**Políticas canónicas del gate** (no cambian a mitad de sección):\n\n- `normalize_nombre`: colapsa espacios + **title-case por palabra**.\n- `normalize_email`: `strip` + `lower` y `ValueError` si falta `@`.\n- `normalize_telefono`: solo dígitos (demo).\n- `normalize_direccion`: colapsa + `upper`.\n\nCada normalizador debe ser **idempotente** en el caso feliz: `f(f(x)) == f(x)`.",
```

### Diff 8 (L — callout starts lowercase, line 216)

```diff
@@ callout content (line 216) @@
-          "raise para APIs internas puras; tupla/result object cuando el lote no debe abortar en la primera fila mala.",
+          "Usa `raise` para APIs internas puras; devuelve `tupla/result object` cuando el lote no debe abortar en la primera fila mala.",
```

### Diff 9 (L — `al caller` → `a quien llama`, line 30)

```diff
@@ paragraphs (line 30) @@
-        "**Diccionario de la sección** (léelo antes de T1). **Función (`def`):** bloque reutilizable con nombre de verbo. **`return`:** entrega un valor al caller (sin return → `None`). **Contrato:** precondiciones + postcondiciones documentadas (docstring) y alineadas al código. **Default seguro:** no uses lista/dict mutable como valor por defecto. **Función pura:** mismo input → mismo output, sin I/O ni prints. **Idempotencia:** `f(f(x)) == f(x)` en el caso feliz. **Orquestador delgado:** combina normalizadores sin reimplementar reglas. **LEGB:** orden Local → Enclosing → Global → Builtin. **Keyword-only:** parámetros tras `*` que obligan `nombre=` en la llamada.",
+        "**Diccionario de la sección** (léelo antes de T1). **Función (`def`):** bloque reutilizable con nombre de verbo. **`return`:** entrega un valor a quien llama (sin `return` → `None`). **Contrato:** precondiciones + postcondiciones documentadas (docstring) y alineadas al código. **Default seguro:** no uses lista/dict mutable como valor por defecto. **Función pura:** mismo input → mismo output, sin I/O ni `print`s. **Idempotencia:** `f(f(x)) == f(x)` en el caso feliz. **Orquestador delgado:** combina normalizadores sin reimplementar reglas. **LEGB:** orden Local → Enclosing → Global → Builtin. **Keyword-only:** parámetros tras `*` que obligan `nombre=` en la llamada.",
```

### Diff 10 (L — `weDo`/`youDo` in prose → UI labels, lines 75 and 152)

```diff
@@ paragraphs (line 75) @@
-        "Las funciones son **valores de primera clase**: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización; no abuses de callbacks todavía. El primer normalizador del hilo, `normalize_nombre`, ya usa la política del gate: colapsar espacios y title-case por palabra — la misma que exige el youDo.",
+        "Las funciones son **valores de primera clase**: puedes pasarlas, guardarlas en listas y devolverlas. En S05 nos basta con **definir, llamar y retornar** resultados de normalización; no abuses de callbacks todavía. El primer normalizador del hilo, `normalize_nombre`, ya usa la política del gate: colapsar espacios y title-case por palabra — la misma que exige el bloque **Tú haces**.",

@@ paragraphs (line 152) @@
-        "En intake sintético: pre = tipo str; post = forma canónica o `ValueError` de dominio. La política de email del gate es **strip+lower y raise si falta `@`** — la misma en demos, weDo y youDo. Si docstring y código discrepan, el revisor devuelve el PR.",
+        "En intake sintético: pre = tipo str; post = forma canónica o `ValueError` de dominio. La política de email del gate es **strip+lower y raise si falta `@`** — la misma en demos, **Hacemos juntos** y **Tú haces**. Si docstring y código discrepan, el revisor devuelve el PR.",
```

### Diff 11 (L — You Do starterCode: docstring lowercase + `DEFECT` jargon, lines 1576-1604)

```diff
@@ youDo.starterCode (lines 1576-1604) @@
 def normalize_email(raw: str) -> str:
-    """strip + lower. ValueError si falta @.
+    """Strip + lower. ValueError si falta @.
     """
-    # Contrato: corrige el DEFECT del starter (no dejes NotImplemented)
+    # Contrato: corrige el fallo del código inicial (no dejes NotImplemented)
     raise NotImplementedError
```

> Apply the same 5 occurrences (lines 1576, 1583, 1590, 1597, 1603) and the docstring at 1581.

### Diff 12 (L — `DEFECT` jargon in starter-code comments, lines 600, 632, 667, 699, 734, 773, 811, 848, 894, 937, 971, 1019, 1063, 1099, 1145, 1192, 1228, 1269, 1308, 1347, 1389, 1435, 1476, 1520)

```diff
-# DEFECT: <description>
+# FALLO: <description>
```

> Apply to all 24 starter-code `# DEFECT:` comments. This is a global s/DEFECT/FALLO/ on the starterCode blocks (not on the prose). Alternative: keep `DEFECT` and add a one-line legend in the We Do intro: `"Cuando veas \`# DEFECT:\` en un starter, es el bug que debes corregir."`

### Diff 13 (L — `explanation:1670` Spanglish, line 1670)

```diff
@@ selfCheck questions[2].explanation (line 1670) @@
-          "Pureza = determinismo + sin side effects; ideal para normalizadores.",
+          "Pureza = determinismo + sin efectos colaterales; ideal para normalizadores.",
```

---

## 8. Recommended Priority Order for Fixing

1. **🔴 Diff 1** (HIGH) — fix `id:"oop"` → `"functions-contracts"`, rename file, add `functions-contracts` editor in `SectionView.tsx`. Without this, every learner on S05 sees an OOP editor at the bottom of the page. **Highest learner impact.**
2. **🟠 Diff 4** (M) — `con colapsa+title` is grammatically impossible in Spanish (`PREP_VERB`). Quick fix.
3. **🟠 Diff 3** (M) — missing comma before `pero`. Quick fix.
4. **🟠 Diff 2** (M) — `los keyword` DET/NOUN disagreement. Quick fix.
5. **🟠 Diff 7** (M) — convert paragraph 32 (Políticas canónicas) to a list. Reduces cognitive load on the Mapa section.
6. **🟠 Diff 5** (M) — split 38w sentence in `jobRelevance`.
7. **🟠 Diff 6** (M) — split 36w sentence in `instruction:924`.
8. **🟡 Diff 10** (L) — replace `weDo`/`youDo` in prose with UI labels `Hacemos juntos` / `Tú haces`. Apply globally.
9. **🟡 Diff 11** (L) — You Do starterCode: docstring capitalisation + `DEFECT`→`fallo`.
10. **🟡 Diff 13** (L) — `side effects` → `efectos colaterales` in self-check explanation.
11. **🟡 Diff 8** (L) — callout starts with `raise` lowercase. Restructure.
12. **🟡 Diff 9** (L) — `al caller` → `a quien llama`. Apply where it reads naturally; leave `caller` in code-adjacent contexts if preferred.
13. **🟡 Diff 12** (L) — `DEFECT` → `FALLO` in 24 starterCode comments. Batch find/replace.
14. **🟢 No-action items** — false-positive LT findings (344 MORFOLOGIK on tech terms, 8 WHITESPACE on test data, 3 DIACRITICS on `titulo`, 2 DIACRITICS on `valida` verb, 3 PUNTO_EN_ABREVIATURAS on `doc`/`tel`). Document but don't change.

---

## 9. Graph Memory Update notes (for shared context files)

For the orchestrator's cross-section graph memory:

- **S05** uses `id:"oop"` (file `s05-oop.ts`) but is actually the **Functions & Contracts** section. **S11** uses `id:"testing"` (file `s11-testing.ts`) but is actually the **OOP y modelo de dominio** section. The two appear to have been swapped during a refactor. Any auditor touching S11 should verify the same `id` mismatch (and the same `SectionView.tsx` editor-key coupling) and recommend coordinated renames.
- **S05** establishes the four-normalizer hilo conductor (`normalize_nombre/email/telefono/direccion`) that should reappear in **S06** (collections), **S08** (pathlib/CSV), **S10** (CLI), **S11** (domain classes). Auditors of those sections should check that the normalizer names and policies (`colapsa+title`, `strip+lower+require_@`, `digits_only`, `colapsa+upper`) remain stable.
- **S05** opens gate **CP-N1-B**. **S06** continues CP-N1-B (modelo en RAM). **S08** likely extends CP-N1-B with file I/O. Auditors should verify the gate progression.
- **S05** cites `CASO-LIM-005` 33 times — the lab-case ID is the contract anchor. Other sections use their own `CASO-LIM-NNN` IDs (e.g. S04 likely uses `CASO-LIM-004`).
- **`SectionView.tsx`** keys interactive editors by `section.id`. Any section whose `id` doesn't appear in the editor map will silently fall back to a default editor (or no editor). Auditors should verify each section's `id` has a matching key in `interactiveEditors` (currently `functions-modules`, `oop`, `numpy`, `pandas`, etc.).
- **Spanish readability baseline for early-course sections:** S05 mean FH ≈ 70, mean WPS ≈ 8, mean SPW ≈ 2.0. Other Phase-0 sections should be in the same band. Sections with mean FH < 50 or mean WPS > 15 warrant investigation.
- **Spanglish inventory baseline:** S05 uses ~80 English/Python loanwords in Spanish prose (caller, keyword, default, hint, fix, fake, etc.). This is the expected register for "español peruano técnico" per the site footer. Auditors of other sections can use this as a baseline; sections with significantly more loanwords may be over-Englished.
- **`DEFECT` label convention:** S05 uses `# DEFECT:` in 24 starter-code comments and 5 You Do starter comments. If this is a course-wide convention, it should be documented in a style guide. If not, S05 is an outlier and should adopt the prevailing convention.
- **`weDo`/`youDo` camelCase in prose:** S05 uses these as in-prose references to the curriculum tabs. The UI labels are `Hacemos juntos` / `Tú haces`. If other sections also use `weDo`/`youDo` in prose, this is a course-wide style choice to revisit.

---

## 10. Method Note (Spanish-grammar subplan)

**Research basis applied** (per `_GRAMMAR_SUBPLAN.md`):

1. **Fernández-Huerta (1959)** readability: `FH = 206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Spanish Flesch adaptation.
2. **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`.
3. **Words per sentence (WPS)** and **syllables per word (SPW)** as structural-load metrics.
4. **LanguageTool public API** (`language=es`) for rule-based grammar/style findings.
5. **Pedagogical heuristics** (run-on >45w, long >32w, missing `¿`/`¡`, unbalanced delims, repeated words, gerund pile-up, anaphoric monotony, etc.).

**Pipeline:**
- Parsed `s05-oop.ts` text with a conservative line-based string-literal extractor (handles `"..."`, `` `...` ``, and `["...","..."]` arrays).
- Filtered prose units by `looks_spanish()` (requires Spanish function-word density ≥8% or accented chars) — excluded pure code blocks and English-only scaffolding.
- Computed FH, INFLESZ, WPS, SPW per unit and per sentence (Spanish-aware syllable counter using vowel-group heuristics with hiato/diptongo rules).
- Applied 11 heuristic checks per sentence.
- Concatenated all prose (18 000-char chunk) → LanguageTool `es` API in a single throttled POST request.
- Filtered 350+ false positives on Python/tech identifiers and intentional test data.

**Validation:** 254 prose units, 422 sentences, 3 981 words extracted. Mean FH ≈ 70 (within "normal" band for technical Spanish). All real findings (6 from LT + 4 long-sentence heuristics) catalogued in §3.

**Known false-positive classes documented:** Python identifiers in prose (`def`, `f`, `strip`, etc.), intentional multi-space test data (`'  Ana   María  '`), Python parameter names inside backticks (`titulo`), verb-vs-adjective disambiguation (`valida`), noun-vs-adjective (`globales`), abbreviation splitting on `p.` in `(p. ej. …)`, and title/heading terminal-punctuation convention.

**Metrics artefacts:** `/home/z/my-project/audits/_s05_metrics.json` (per-unit + per-sentence), `/home/z/my-project/audits/_s05_lt.json` (raw LanguageTool response), `/home/z/my-project/audits/_s05_extract.py` (extractor script).

---

## Final Statement

This is the complete Explorer report for Section 5. Ready for the Fixer prompt.
