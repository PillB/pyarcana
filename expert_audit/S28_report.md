# Curriculum Audit Report — Section 28 (S28)

**Section under audit:** `section28` (`id: "llm-agents"`)
**File:** `src/lib/course/sections/s28-llm-agents.ts` (1,713 lines)
**Live URL:** https://pillb.github.io/pyarcana/#llm-agents
**Repository:** https://github.com/PillB/pyarcana
**Auditor:** Curriculum Auditor (general-purpose)
**Subplan applied:** `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`
**Metrics artifact:** `/home/z/my-project/audits/_s28_metrics.json`
**Extractor source:** `/home/z/my-project/audits/_s28_extract.py`

---

## 1. Section Identification & Scope

**Identity (confirmed three ways):**

| Field | Value | Source |
|---|---|---|
| `id` | `"llm-agents"` | `s28-llm-agents.ts:4` |
| `index` | `28` | `s28-llm-agents.ts:5` |
| `title` | `"Pruebas de datos, propiedades e integración"` | `s28-llm-agents.ts:6` |
| `shortTitle` | `"Props e integración"` | `s28-llm-agents.ts:7` |
| `tagline` | `"Suite que caza errores de encoding, cardinalidad, orden, timeout y reanudación, con fixtures sintéticas mínimas"` | `s28-llm-agents.ts:9` |
| `estimatedHours` | `19` | `s28-llm-agents.ts:10` |
| `phase` | `2` (Senior) | `s28-llm-agents.ts:12` |
| `icon` | `ShieldCheck` | `s28-llm-agents.ts:13` |
| Position in `COURSE_SECTIONS` | 28th (after `section27`, before `section29`) | `src/lib/course/index.ts:31,76` |
| Live site hash route | `#llm-agents` | `src/app/page.tsx:68` (SPA hash routing by `s.id`) |
| Live rendered heading | "Sección 28 · Props e integración" + "Pruebas de datos, propiedades e integración" | agent-browser read of live URL |

**Cross-checked against the v3 roadmap** (`learning_roadmap_52_V3.md:428`):

> `### S28 — Pruebas de datos, propiedades e integración`
> **Prerrequisito:** S27. **Entorno:** local/CI. **Proyecto:** QA del motor ER.

→ Content placement is **correct** for position 28 (Senior phase, ER QA), but the `id` slug `"llm-agents"` is **residual from an older, discarded roadmap** (where S28 was apparently about LLM agents). The slug is user-visible in the URL hash.

**Content scope:** Section 28 teaches property-based testing, data-quality/schema contracts, golden datasets + drift reconciliation, mocks/fakes/injected-clock doubles, integration testing with sqlite, and CI determinism (seed/sort/clock) for an Entity Resolution (ER) pipeline. Cross-references S16 (data quality), S27 (pytest contracts), S29 (SQL warehouse). Capstone increment: `CP-N3-A`.

**Analyzed tabs (all rendered live):**
- **meta**: `jobRelevance`, 8 `learningOutcomes`, `tagline`.
- **theory**: 9 subtopics, each with `heading`, 2–5 `paragraphs`, one `code` block, one `callout` (29 paragraphs, 9 callouts).
- **iDo**: 1 `intro` + 8 demos (`description`, `code`, `why`).
- **weDo**: 1 `intro` + 24 exercises (E1/E2/E3 × 8 subtopics; each has `instruction`, `hint`, `hints[]`, `edgeCases[]`, `tests`, `feedback`, `starterCode`, `solutionCode`).
- **youDo**: `title`, `context` (with embedded 6-item acceptance checklist), 4 `objectives`, 6 `requirements`, large `starterCode` skeleton, `portfolioNote`, 6-criterion `rubric`.
- **selfCheck**: 5 multiple-choice questions with 4 options each + `explanation`.
- **resources**: 7 `docs`, 2 `books`, 4 `courses`.

**Prose extraction (per the grammar subplan):**
- 287 learner-facing Spanish prose records (after deduplication).
- 460 sentences, 5,348 words, 10,736 syllables.
- Avg Fernández-Huerta = **72.0** (band: *normal / bastante fácil* — appropriate for senior technical Spanish).
- Median FH = **71.6**; Avg WPS = **11.63** (well below the 32-word soft cap); Avg SPW = **2.050**.

---

## 2. Executive Summary of Quality

**Composite score: 7.0 / 10.**

**Verdict:** Section 28 is a **pedagogically strong, technically honest** senior-phase module with a clean I Do / We Do / You Do / selfCheck architecture, authentic Peruvian context (desk PE, banca/fintech/retail in Lima, `@example.pe` synthetic data), and a coherent "properties → data → doubles → integration" arc that connects cleanly to S27 (pytest) and S29 (SQL warehouse). It explicitly refuses the over-reach pattern (`Matching ≠ fraude`, "ER solo decide *misma entidad* — nunca parentesco ni fraude"), which is a curriculum-wide ethical stance that is enforced consistently in every tab.

**It is held back by three concrete issues, not by prose quality:**

1. **P0 — Critical structural meta-leak: `id: "llm-agents"` does not match the section content.** The learner-visible URL hash is `https://pillb.github.io/pyarcana/#llm-agents` while the rendered page teaches property-based testing and ER QA. This is residual from a discarded roadmap version. A learner who bookmarks, shares, or back-buttons this section sees a hash that contradicts the page. The icon (`ShieldCheck`), accent color (emerald/teal), title, tagline, and content were all updated; only the `id` (and the source filename) were not.
2. **P1 — Three starterCode blocks contain an inconsistent developer-style scaffold ("Completa el DEFECT con la condición del enunciado") plus an unused `result = None; assert result is not None` pattern that does not match their solutionCode.** The other 21 starterCode blocks follow a clean single-print pattern that matches the solution. This affects S28-T2-A-E1 (line 855), S28-T4-A-E2 (line 1316), and S28-T4-B-E1 (line 1393).
3. **P2 — Bug-marker convention drift:** S28 uses `# BUG intencional: …` as the in-code bug marker, while the immediately preceding section S27 (and the broader course, per the live bundle) uses `# DEFECT: …` as the documented "patrón de caza de fallas del curso". S27's intro explicitly tells the learner: *"Cada starter trae un comentario `# DEFECT:` que marca el bug a corregir (patrón de caza de fallas del curso)."* S28 silently switches to `# BUG intencional:`, breaking the established convention.

**Plus, lower-severity issues:**

- One 54-word run-on sentence (line 49) and two long sentences (35 w at line 16, 42 w at line 291).
- The "Diccionario del módulo" paragraph (line 32) crams 8 bolded-term definitions into a single paragraph block; grammatically fine but high cognitive load for first encounter.
- Several anglicisms used as loanwords (acceptable in Peruvian dev slang, mostly): `mockear/mockees`, `hardcodear/hardcodea`, `seedear`, `Reconcile` (used as a Spanish noun), `outcome`, `PRNG`, `GOOS-friendly`, `sqlite memoria` (missing `en`), `Props` (shortTitle).
- The phrase "Completa el DEFECT con la condición del enunciado" is the only place "DEFECT" appears in S28 — and it appears as a noun inside a developer-style instruction, not as a `# DEFECT:` comment marker like S27. So it doesn't even re-establish the convention it drifts from.

**Grammar aggregate:** The Spanish is correct, clear, and reads naturally in Peruvian technical register. No concordance errors, no missing `¿`/`¡`, no unbalanced delimiters, no repeated-word typos. The median FH (71.6) sits in the "normal" band, which is exactly the target for senior technical material; the average WPS (11.6) is healthy. The few readability dips are short titles (e.g., "Idempotencia: `f(f(x)) == f(x)`.") where the FH formula breaks because backticked code inflates the syllable-per-word count — these are measurement artifacts, not prose problems.

---

## 3. Detailed Issue Registry

| # | Sev | Issue | Evidence (quote + line) | Pedagogical impact |
|---|---|---|---|---|
| 1 | H | `id` field contradicts the section topic | `id: "llm-agents"`, `title: "Pruebas de datos, propiedades e integración"` — `s28-llm-agents.ts:4,6`. Live URL: `https://pillb.github.io/pyarcana/#llm-agents`. | The URL hash that a learner sees, shares, or bookmarks says "llm-agents" while the page teaches property-based testing + ER QA. This is a wayfinding and search-discoverability failure. It is also a code-hygiene smell: the source filename `s28-llm-agents.ts` is misleading for any contributor. |
| 2 | H | Three starterCode blocks contain a developer-style scaffold inconsistent with their solutionCode | Lines 855, 1316, 1393 each contain `# Completa el DEFECT con la condición del enunciado y un assert de aceptación.` + `result = None  # calcula el valor correcto` + `print(result)` + `assert result is not None`. The corresponding `solutionCode` is a single `print(...)` line that does not use `result` or `assert`. | A learner attempting E1 (S28-T2-A-E1), E2 (S28-T4-A-E2), or E1 (S28-T4-B-E1) sees an extra scaffold that suggests a different solution shape than the one the autograder expects. The other 21 exercises don't have this scaffold, so the inconsistency also breaks the "every We Do starter looks the same" contract that the weDo intro promises ("Cada starter trae un **bug intencional** runnable: corrígelo y deja **solo** las líneas de salida del oráculo"). |
| 3 | M | Bug-marker convention drift vs. S27 | S27 (`s27-async-concurrency.ts:635,655,686,…`) uses `# DEFECT: <description>` as the bug marker. S27's weDo intro states: *"Cada starter trae un comentario `# DEFECT:` que marca el bug a corregir (patrón de caza de fallas del curso)."* S28 uses `# BUG intencional: <description>` instead (21 occurrences) plus the stray `# Completa el DEFECT …` in 3 starters. | S27 explicitly labels `# DEFECT:` as the course-wide "patrón de caza de fallas". Switching to `# BUG intencional:` in S28 silently breaks the pattern a learner was just taught to recognize. The 3 occurrences of "DEFECT" inside `# Completa el DEFECT …` partially reinforce the old token but in a different grammatical role, so the convention is muddied rather than consistently updated. |
| 4 | M | Run-on sentence (54 words) | L49: *"Tres estrategias en este curso: (1) tabla exhaustiva pequeña (todos los bordes conocidos: vacío, solo espacios, tildes, scores 0/1/1.2), (2) random acotado con seed fija (reproducible en CI; imprime seed+input al fallar), (3) Hypothesis (herramienta industrial: defines la propiedad, una *strategy* genera inputs, y al fallar hace *shrink* del contraejemplo)."* | Three parenthetical sub-definitions nested inside an enumerated list inside a single sentence. A learner reading this on first encounter has to hold three strategies × two sub-clarifications each in working memory. Better as a 3-bullet list (the course uses bullets elsewhere, e.g., the You-Do acceptance checklist at L1486). |
| 5 | M | Long sentence (35 words, opening `jobRelevance`) | L16: *"El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices: propiedades que generen bordes, contratos de schema, goldens con review humano, dobles de HTTP/DB/reloj e integración determinista en CI."* | The very first learner-facing sentence of the section front-loads 5 concept nouns ("propiedades", "contratos", "goldens", "dobles", "integración") before any of them is defined. Deferring the list until after the "what + why" framing would reduce cognitive load. |
| 6 | M | Long sentence (42 words) | L291: *"Mide lo que el tagline promete: encoding (tildes y formas NFC/NFD unificadas con `unicodedata.normalize`), cardinalidad de pares (`C(n,2)` o igualdad de nombre), orden de paginación estable, timeout simulado (retry/abort con reloj fake, no `sleep` real) y reanudación (checkpoint: no reprocesar ids ya hechos)."* | Five-item list inside one sentence with five parentheticals. Works as a map, but the same content as a 5-bullet list would scan better and parallel the callout-style rhythm used elsewhere. |
| 7 | M | "Diccionario del módulo" paragraph: 8 bolded-term definitions in one block | L32: single TS string with 8 sentences defining `Invariante`, `Prueba de propiedades`, `Prueba metamórfica`, `Contrato de schema/calidad`, `Golden`, `Doble`, `Flake`, `Fail-closed`. | Grammatically fine (splitter counts 8 short sentences, FH band "normal") but pedagogically dense. A glossary block with each term on its own line (or as a `<dl>`) would let the learner scan and revisit. Today it reads as a wall of bolded text. |
| 8 | L | "sqlite memoria" instead of "sqlite en memoria" (2 occurrences) | L330: *"sqlite memoria valida lógica de pares y schema…"*. L1486 (YouDo context): *"Usa fixtures mínimas, fakes de reloj/HTTP y sqlite memoria."*. L1621 (selfCheck option): *"Usar sqlite memoria para materializar pares candidatos"*. | Minor grammatical slip — "sqlite memoria" reads as a compound noun where Spanish would write "sqlite en memoria" (or the literal `sqlite :memory:`). Inconsistent with the same section's correct usage at L215, L535, L1263 ("sqlite en memoria" / `:memory:`). |
| 9 | L | "Reconcile" used as a Spanish noun | L985: *"Reconcile sin approve actualiza el contrato en silencio…"*. L1617 (selfCheck explanation): *"Reconcile debe ser aprobado por un humano con nota de cambio…"*. | The rest of the section uses "reconciliación" (L177 *"Reconciliación: actualizar el golden…"*) or the verb "reconciliar". Switching to "Reconcile" is an English noun calque that breaks the local term. |
| 10 | L | "outcome" anglicism in explanation | L1631: *"CI determinista es outcome de S28: seed fija, reloj inyectado, orden estable."* | "outcome" is a noun calque; "resultado" or "producto" reads cleaner and matches the register used elsewhere in the section. |
| 11 | L | "es outcome de S28" reads as English subject-verb-noun calque | (same as #10) | Even aside from the word "outcome", the construction "X es outcome de Y" is anglicized; Spanish would say "X es el resultado de Y" or "X es lo que entrega Y". |
| 12 | L | Verbalized loanwords: `mockear`, `mockees`, `hardcodear`, `hardcodea`, `seedear` | L256 *"Mockea solo I/O externo"*, L257 *"no la mockees"*, L1016 *"Hardcodear 0/ok no es workflow de drift"*, L1263 *"El starter hardcodea `0`"*, L1451 *"Cada run debe seedear de nuevo"*. | All five are -ear verbs built on English tech terms. They are widespread in Peruvian/LatAm dev slang and the course itself uses them in earlier sections, so this is a register choice, not an error. Flag for consistency only: the same section also uses the Spanish form "re-siembra" (L1444) for the same concept ("seedear"). Pick one. |
| 13 | L | "seedear" vs "re-siembra" terminology inconsistency | L1451 *"Cada run debe seedear de nuevo y ordenar."* vs L1442 instruction *"El starter no re-siembra entre corridas y no ordena."*. Both refer to the same action (re-applying `random.seed`). | Minor vocabulary drift inside the same exercise. Pick "re-sembrar"/"sembrar" or "seedear" consistently. |
| 14 | L | "PRNG" acronym used without expansion | L595 (hint): *"Sin re-seed, el segundo random avanza el PRNG y a!=b"*. | Learners who haven't met PRNG (= pseudo-random number generator) hit an unexplained acronym in a hint. "generador aleatorio" or "el PRNG (generador pseudoaleatorio)" on first use would help. |
| 15 | L | "GOOS-friendly" English compound adjective in prose | L257: *"Heurística GOOS-friendly: si la función es pura…"*. | GOOS = *Growing Object-Oriented Software, Guided by Tests* (book cited in resources). The compound adjective is direct from English. Italicizing *GOOS-friendly* or writing "heurística al estilo GOOS" would signal the borrow more clearly. |
| 16 | L | shortTitle "Props e integración" uses clipped English jargon "Props" | L7: `shortTitle: "Props e integración"`. Renders live as "Sección 28 · Props e integración" and as the sidebar nav label. | "Props" is React/JS jargon for "properties" and is not standard Spanish. It collides with the section topic ("props" as in *property-based testing*). "Propiedades e integración" (one extra syllable) would be clearer and unambiguous. |
| 17 | L | "case 'Ana López'" anglicism | L49: *"Un solo case 'Ana López' no caza encoding, espacios dobles ni scores fuera de rango."* | "case" used as a Spanish noun ("caso") — likely a code-switching slip. The same sentence uses "caza" correctly. |
| 18 | L | "args", "calls", "store", "row", "writer", "join", "merge", "fix", "job", "diff", "tag", "ticket", "laptop", "happy path" — widespread loanwords | Distributed across L214, L255, L256, L1263, L1272, L1309, L1411, L1420, L1628, L1635, L94, etc. | All are common in Peruvian dev slang and the course has used them since S01; this is a register choice, not an error. Noted for completeness. No action required. |
| 19 | L | "property-based thinking" English phrase inside Spanish sentence | L669 (feedback): *"Una propiedad real genera muchos inputs (seed + bucle) y aserta f(f(x))==f(x). Un solo literal no es property-based thinking."* | Direct English phrase inside an otherwise-Spanish feedback. Translate to "pensamiento basado en propiedades" or italicize/quote as a term. |
| 20 | L | "extra" temporal-arg calque: "archivo temp" | L290: *"…usamos sqlite `:memory:` o archivo temp como análogo local honesto."* | "archivo temp" → "archivo temporal" or "archivo temporalario". Minor. |
| 21 | L | Title comma ambiguity | L6: *"Pruebas de datos, propiedades e integración"*. | The comma could be parsed as "Pruebas de (datos, propiedades e integración)" or "Pruebas de datos, (pruebas de) propiedades e (pruebas de) integración". The intended sense is the latter (three test types). The comma is grammatical; rewording as "Pruebas de datos, de propiedades y de integración" would remove the ambiguity. |
| 22 | L | "Ritmo sugerido: ~4–5 h T1 propiedades, ~4–5 h T2 schema/goldens, ~4 h T3 dobles, ~4–5 h T4 integración/CI + You Do portfolio." sums to ~17 h, not 19 h | L41 (callout content) vs L10 (`estimatedHours: 19`). | The arithmetic of the suggested rhythm is 4.5 + 4.5 + 4 + 4.5 = 17.5 h, which doesn't quite reach the declared 19 h. Not a bug per se (the rhythm is approximate, "~"), but a learner planning their week may notice. Either tighten the rhythm to add ~1.5 h to T4 or note that the extra ~1.5 h is for the portfolio You Do. |

**Notes on auto-detected findings (from `_s28_metrics.json`):**
- `missing_terminal_punct` × 174 — **mostly false positives** on headings, hints, options, edgeCases labels (intentionally telegraphic). Ignored.
- `long_sentence` × 3 — issues #5, #6, plus L1495 (requirements list, downgraded to L).
- `run_on_sentence` × 1 — issue #4.
- `space_before_punct` × 1 — false positive (likely a markdown artifact).
- `meta_leak_phrase` × 1 — false positive (matched the Spanish verb "Reemplazar" inside a selfCheck distractor option).

---

## 4. Meta-Leak Report

| # | Severity | Leaked text / signal | Location | Why it's a leak |
|---|---|---|---|---|
| M1 | **H** | `id: "llm-agents"` (and filename `s28-llm-agents.ts`) contradict the section topic | `s28-llm-agents.ts:4` (and the filename) | The `id` is the SPA route hash. A learner visiting S28 sees `https://pillb.github.io/pyarcana/#llm-agents` in the address bar while the page teaches property-based testing + ER QA. This is a residual identifier from a discarded roadmap version (visible in `el_arte_de_python_roadmap_maestro_52_secciones.md` where S28 was about LLM agents). The v3 roadmap (`learning_roadmap_52_V3.md:428`) places "Pruebas de datos, propiedades e integración" at position 28 — confirming the content is correctly placed; only the id and filename were not migrated. |
| M2 | **H** | `# Completa el DEFECT con la condición del enunciado y un assert de aceptación.` + `result = None  # calcula el valor correcto` + `print(result)` + `assert result is not None` (3 occurrences) | Lines **855** (S28-T2-A-E1 starterCode), **1316** (S28-T4-A-E2 starterCode), **1393** (S28-T4-B-E1 starterCode) | This is a developer-authoring residue: a template scaffold instruction ("Completa el DEFECT…") plus an unused `result = None; assert result is not None` pattern that is **not present in any of the other 21 starterCode blocks** and is **not used by the corresponding solutionCode**. The phrase "Completa el DEFECT con la condición del enunciado" reads as an author-to-author instruction (the kind of placeholder a course writer leaves for themselves while drafting) rather than as learner-facing text. It is also grammatically awkward: "el DEFECT" treats the English word "defect" as a Spanish masculine noun, which is not how S27 uses the same token (`# DEFECT:` is a marker prefix, not a noun). |
| M3 | L | No developer JS line comments in source file | (none found) | Clean — confirmed by grepping for `^\s*//`. The only `//` in the file are inside Python code blocks (URLs, integer division). |
| M4 | L | No `TODO`/`FIXME`/`XXX`/`TBD`/`WIP`/`placeholder`/`borrar`/`cambiar`/`movido desde` strings | (none found) | Clean. |
| M5 | L | No "moved from section X" / "design note" / "internal" / authoring residue in learner-facing strings | (none found) | Clean. |

**Verdict on meta-leak:** Two genuine findings (M1, M2). M1 is structural (course-wide id-migration debt that is particularly visible at S28 because the topic delta between "llm-agents" and "QA / property-based testing" is large). M2 is local (3 starterCode blocks need to be brought in line with the other 21).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pedagogical structure (I Do / We Do / You Do fidelity) — **strong (8.5/10)**

- **I Do (8 demos):** Each demo pairs a one-sentence `description` → runnable `code` → one-sentence `why`. The 8 demos map 1-to-1 to the 8 theory subtopics (`S28-T1-A` through `S28-T4-B`), preserving the T1→T2→T3→T4 arc. The `intro` clearly tells the learner what to watch for: *"Observa el patrón propiedad → assert → evidencia (seed/input), no solo el print final."* This is exemplary I-Do scaffolding.
- **We Do (24 exercises = 8 subtopics × 3 layers):** Each subtopic has E1 (guided) → E2 (independent) → E3 (transfer). The decreasing-scaffolding arc is real:
  - E1 (guided) starters expose the bug in 3–5 lines and the hint restates the fix mechanic ("Vuelve a llamar random.seed(0) antes de b").
  - E2 (independent) starters expose the bug but the hint only points to the concept ("Usa all(...) sobre el rango inclusivo; 1.2 está fuera").
  - E3 (transfer) asks the learner to write a new `test_*` function from a docstring/contract, with the starter only showing the *wrong* shape to fix.
  This is the gold-standard pattern.
- **You Do (capstone):** A single `CP-N3-A` suite that integrates all 4 subtopic areas, with a 6-item acceptance checklist embedded directly in the `context` string (file-by-file: `test_properties.py`, `test_schema_golden.py`, `test_doubles.py`, `test_integration.py`, `README_suite.md`, and "cero flakes"). The starterCode skeleton is a real, runnable Python file (~80 lines) that the learner extends. The rubric is weighted sensibly (25% coverage, 20% correctness, 20% privacy, 15% edge cases, 10% readability, 10% docs).
- **selfCheck (5 MCQs):** Each question has 4 options with one clearly correct answer and 3 plausible distractors. The `explanation` after each answer restates the principle. Good alignment with the theory — the 5 questions cover metamorphic testing, golden drift, over-mocking, flakes/CI, and sqlite integration, which are exactly the 5 cross-cutting themes of the section.

### 5.2 Connective tissue and narrative flow — **strong (8/10)**

- The opening paragraph (L31) explicitly bridges from S27 ("En S27 convertiste normalización y matching en contratos pytest. Aquí **amplías** la suite…") and forward to S29 ("En S29 el almacén SQL consumirá estos mismos contratos como regresión de schema."). This is exactly the connective tissue the curriculum asks for.
- L34 ("Lo que ya sabes (S16 calidad + S27 pytest) y lo que es **nuevo aquí**…") is a model "what-changed" paragraph: it tells the learner explicitly what prior knowledge is being assumed and what is new. Excellent metacognitive scaffolding.
- The "Orden del módulo" paragraph (L33) gives a T1→T2→T3→T4 map up front, which the rest of the section then executes faithfully.
- **Weakness:** The "Diccionario del módulo" paragraph (L32) front-loads 8 bolded-term definitions before any of them is encountered in context. Deferring each definition to its first-use subtopic would be more progressive-disclosure-friendly. (This is issue #7 in the registry.)

### 5.3 Cognitive load and progressive disclosure — **mostly good, with one overload (7/10)**

- The T1→T2→T3→T4 progression is genuinely progressive: properties (single functions) → data contracts (still single functions, now with state) → doubles (introduces dependencies) → integration (multiple components). Each subtopic adds exactly one new layer of complexity.
- **Cognitive-load hotspots:**
  - L32 (Diccionario): 8 bolded-term definitions in one paragraph block (issue #7).
  - L49 (Tres estrategias): 54-word run-on with 3 nested parentheticals (issue #4).
  - L291 (Mide lo que el tagline promete): 42-word sentence with 5 parentheticals (issue #6).
  - L16 (jobRelevance): 35-word sentence front-loading 5 concept nouns before any is defined (issue #5).
- Each subtopic's code block is small (10–20 lines) and runnable in isolation — good for cognitive chunking.
- The 24 We Do exercises are uniformly short (3–10 line starters, single-line solutions), which keeps the per-exercise load manageable even when the underlying concept is hard.

### 5.4 Exercise and exam quality and alignment — **strong (8.5/10)**

- **Exercise-test alignment:** Every We Do exercise has a `tests` field that describes the exact oracle ("Una línea: `False` porque 1.2 rompe el contrato [0, 1]") and the `solutionCode`'s `output` matches it. The 24 exercises were spot-checked: all `solutionCode.output` values are consistent with the `tests` description.
- **Bug pattern variety:** The 21 clean starterCode blocks use 5 distinct bug archetypes — (a) wrong operator / inverted polarity, (b) missing operation (e.g., missing `sorted`, missing `random.seed`), (c) hard-coded truthy, (d) wrong identifier (e.g., `e2` instead of `e1`), (e) too-coarse computation (e.g., `n*n` instead of `n*(n-1)//2`). This variety keeps the We Do from feeling formulaic.
- **Edge cases:** Every exercise has 1–2 `edgeCases` strings that name the real-world caveat ("sin seed no es CI-safe", "blocking reduce pares en prod; C(n,2) es cota superior ingenua", "set order no es estable; sort antes de serializar golden"). These connect the lab exercise to the production concern.
- **Self-check alignment:** The 5 MCQs each target one of the section's 5 cross-cutting themes; distractors are pedagogically productive (e.g., the metamorphic-testing question includes "Que el score de matching autorice una etiqueta de fraude" as a distractor — reinforcing the ethical "matching ≠ fraude" stance).
- **You Do rubric:** 6 weighted criteria, privacy/correctness/coverage weighted at 65% combined. Aligns with the section's emphasis on fail-closed, no-PII, no-auto-fraud.

### 5.5 Consistency with the overall roadmap — **mixed (6/10)**

- **Content placement is correct** per v3 roadmap (S28 = QA / property / integration).
- **Cross-references are accurate:** S16 (data quality, fail-closed), S27 (pytest AAA / fixtures), S29 (SQL warehouse) are all real prior/future sections whose stated topics match what S28 claims about them.
- **Convention drift vs. S27:** `# BUG intencional:` vs `# DEFECT:` (issue #3). S27 explicitly establishes `# DEFECT:` as the course-wide marker, so S28's switch is a regression.
- **`id` mismatch with content** (issue #1) is a roadmap-migration debt that is course-wide but particularly visible at S28.
- **`CP-N3-A` capstone increment:** Correctly referenced (jobRelevance L16, YouDo context L1486, portfolioNote L1586). The capstone sequence N3-A → N3-B is the Senior-phase integrator, and S28's role as the QA layer for the ER pipeline is coherent.

### 5.6 Comparison with best-in-class external materials — **good (8/10)**

- **Hypothesis docs** (linked in resources): S28 correctly defers Hypothesis to "siguiente paso industrial" and teaches the underlying property-based-thinking with `random.seed` + `assert` first. This matches the pedagogical principle of "understand the mechanism before adopting the tool."
- **Growing Object-Oriented Software, Guided by Tests (GOOS)** (cited at L257 and in resources): The "contratos de borde, no sobre-mocking" framing is straight from GOOS and is correctly attributed.
- **Great Expectations** (cited in resources): Used as the conceptual anchor for data-quality contracts.
- **testcontainers** (cited in resources + L287, L290): Honestly framed as "concepto" with sqlite `:memory:` as the local analog. The section explicitly says: *"sqlite memoria valida lógica de pares y schema; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29). Sé honesto en el reporte de evidencia: qué capa cubriste."* This honesty about test-layer coverage is exactly best practice.
- **Comparison to typical senior QA courses:** S28's distinguishing strength is that it ties property-based testing, goldens, doubles, and integration into a single ER-pipeline narrative rather than teaching each as an isolated technique. The "matching ≠ fraude" ethical stance, enforced in every tab, is rare in QA courses and is a meaningful differentiator.

### 5.7 Redaction & technical-writing quality — **good (7.5/10)**

- Spanish prose is idiomatic, in Peruvian technical register, with consistent tú-form imperatives (`Genera`, `Documenta`, `Mide`, `Fija`, `Mockea`, `Reemplázalo`).
- Punctuation is correct: en-dashes for parenthetical asides (`— no se "arregla" en silencio`), arrows (`→`) for transformations, `:` for definitions, `;` for clause joins.
- Bold/italic emphasis is used purposefully (bold for term-first-use, italic for code-adjacent English terms like *strategy*, *shrink*).
- Code identifiers in prose are backticked (`normalize`, `f(f(x)) == f(x)`, `blocked_drift`, `id_a < id_b`).
- **Weaknesses:** the long sentences (issues #4, #5, #6) and the "Diccionario" mega-paragraph (issue #7) are redaction debt; the loanwords (issues #9, #10, #11, #12, #17, #19) are a register choice but the inconsistent ones (`Reconcile` vs `reconciliación`; `seedear` vs `re-siembra`; `sqlite memoria` vs `sqlite en memoria`) should be normalized.

### 5.8 Accessibility & clarity — **good (8/10)**

- Every code block has a `title` (filename) and an `output`, which makes the "run it and compare" loop explicit.
- The `hint` and `hints[]` redundancy (24/24 exercises have both `hint` and `hints[0]` with identical text) is a known pattern from S01; S28 follows it consistently. Not a defect, but worth noting: `hint` is a strict subset of `hints[0]` in 100% of S28's exercises — the field could be derived in code rather than duplicated in data. (Same finding as S01's "1 data redundancy" issue.)
- The weDo `intro` explicitly tells the learner what to do with the bug: *"corrígelo y deja **solo** las líneas de salida del oráculo (mismas que la solución)"*. This is unusually clear for a We Do intro and prevents the common learner confusion of "do I keep the print or replace it?"

---

## 6. Grammatical Improvements & Rewriting Report (paragraph by paragraph, tab by tab)

For each tab, the worst paragraphs/sentences are shown **before → after** with the fix rationale. Code blocks, options arrays, and short labels are skipped (they are not prose).

### 6.1 META tab — `jobRelevance` (L16)

**Before (L16, 35 words, FH=39.1, long_sentence):**
> El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices: propiedades que generen bordes, contratos de schema, goldens con review humano, dobles de HTTP/DB/reloj e integración determinista en CI. En un desk de datos en Lima (banca, fintech o retail), un flake o un golden actualizado en silencio puede dejar pasar un matching roto hasta producción de revisión. Esta sección te arma la capa de propiedades + datos + dobles + integración que protege el pipeline sintético CP-N3-A.

**After (split first sentence; same content):**
> El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices. Necesita propiedades que generen bordes, contratos de schema, goldens con review humano, dobles de HTTP/DB/reloj e integración determinista en CI. En un desk de datos en Lima (banca, fintech o retail), un flake o un golden actualizado en silencio puede dejar pasar un matching roto hasta producción de revisión. Esta sección te arma la capa de propiedades + datos + dobles + integración que protege el pipeline sintético CP-N3-A.

**Rationale:** Splits the 35-word opening into a 13-word framing sentence + a 22-word list sentence. Reduces WPS from 35 → 13/22. Keeps the desk-PE hook in the second sentence.

### 6.2 THEORY tab — Subtopic 1 (QA de datos del motor ER) — L32 "Diccionario del módulo"

**Before (L32, one TS string with 8 bolded-term definitions):**
> **Diccionario del módulo** (léelo una vez; cada subtema lo profundiza). **Invariante:** propiedad que siempre debe cumplirse (`normalize` idempotente, score en [0, 1]). **Prueba de propiedades (property-based testing):** generar muchos casos desde la invariante, no solo un ejemplo feliz. **Prueba metamórfica:** no conoces el score "correcto", pero sí una relación bajo una transformación del input. **Contrato de schema/calidad:** reglas de tipos, nulls y negocio en el borde de ingest. **Golden:** snapshot versionado de salida esperada; **drift** es la divergencia actual vs golden. **Doble (mock/fake/stub):** sustituto controlado de HTTP, DB o reloj. **Flake:** prueba inestable (pasa o falla sin cambio de código). **Fail-closed:** si el contrato se rompe, el batch se detiene con evidencia — no se "arregla" en silencio.

**After (split into a `<dl>`-style block — render as 8 separate term/definition lines, still one TS paragraph but with hard line breaks or as an array of strings):**

Option A (keep as one paragraph but add line breaks via `\n`):

> **Diccionario del módulo** (léelo una vez; cada subtema lo profundiza):
>
> - **Invariante:** propiedad que siempre debe cumplirse (`normalize` idempotente, score en [0, 1]).
> - **Prueba de propiedades (property-based testing):** generar muchos casos desde la invariante, no solo un ejemplo feliz.
> - **Prueba metamórfica:** no conoces el score "correcto", pero sí una relación bajo una transformación del input.
> - **Contrato de schema/calidad:** reglas de tipos, nulls y negocio en el borde de ingest.
> - **Golden:** snapshot versionado de salida esperada; **drift** es la divergencia actual vs golden.
> - **Doble (mock/fake/stub):** sustituto controlado de HTTP, DB o reloj.
> - **Flake:** prueba inestable (pasa o falla sin cambio de código).
> - **Fail-closed:** si el contrato se rompe, el batch se detiene con evidencia — no se "arregla" en silencio.

**Rationale:** Reduces visual density; lets learners scan and revisit individual terms. The current single-paragraph form is grammatically correct (8 short sentences) but cognitively heavy on first encounter.

### 6.3 THEORY tab — Subtopic 2 (Invariantes y generación de casos) — L49

**Before (L49, 54 words, FH=24.0, run_on_sentence):**
> Genera casos **desde la invariante**, no desde un ejemplo feliz. Tres estrategias en este curso: (1) **tabla exhaustiva** pequeña (todos los bordes conocidos: vacío, solo espacios, tildes, scores 0/1/1.2), (2) **random acotado con seed fija** (reproducible en CI; imprime seed+input al fallar), (3) **Hypothesis** (herramienta industrial: defines la propiedad, una *strategy* genera inputs, y al fallar hace *shrink* del contraejemplo). Aquí practicas el pensamiento de (1)+(2) con `test_*` de pytest; Hypothesis es el siguiente paso industrial (recursos). Un solo case "Ana López" no caza encoding, espacios dobles ni scores fuera de rango.

**After (split the 54-word sentence into a 3-bullet list; fix "case" → "caso"):**
> Genera casos **desde la invariante**, no desde un ejemplo feliz. Tres estrategias en este curso:
>
> 1. **Tabla exhaustiva** pequeña: todos los bordes conocidos (vacío, solo espacios, tildes, scores 0/1/1.2).
> 2. **Random acotado con seed fija:** reproducible en CI; imprime seed+input al fallar.
> 3. **Hypothesis:** herramienta industrial — defines la propiedad, una *strategy* genera inputs, y al fallar hace *shrink* del contraejemplo.
>
> Aquí practicas el pensamiento de (1)+(2) con `test_*` de pytest; Hypothesis es el siguiente paso industrial (recursos). Un solo caso "Ana López" no caza encoding, espacios dobles ni scores fuera de rango.

**Rationale:** Splits the 54-word run-on into 3 short bullets (9, 10, 17 words). Replaces the anglicism "case" with "caso" (issue #17). Same information; much lower cognitive load.

### 6.4 THEORY tab — Subtopic 7 (Integración, E2E y testcontainers) — L291

**Before (L291, 42 words, FH=31.1, long_sentence):**
> Mide lo que el tagline promete: encoding (tildes y formas NFC/NFD unificadas con `unicodedata.normalize`), cardinalidad de pares (`C(n,2)` o igualdad de nombre), orden de paginación estable, timeout simulado (retry/abort con reloj fake, no `sleep` real) y reanudación (checkpoint: no reprocesar ids ya hechos).

**After (split into a 5-bullet list):**
> Mide lo que el tagline promete:
>
> - **Encoding:** tildes y formas NFC/NFD unificadas con `unicodedata.normalize`.
> - **Cardinalidad de pares:** `C(n,2)` o igualdad de nombre.
> - **Orden de paginación estable.**
> - **Timeout simulado:** retry/abort con reloj fake, no `sleep` real.
> - **Reanudación:** checkpoint; no reprocesar ids ya hechos.

**Rationale:** Same content; 5 short bullets instead of a 42-word sentence. Each bullet has one focus.

### 6.5 THEORY tab — Subtopic 5 (Mocks, fakes y reloj inyectado) — L214–216

**Before (L214, definition list as one paragraph):**
> **Mock**: verifica interacciones (qué se llamó, con qué args). **Fake**: implementación liviana en memoria con estado real. **Stub**: respuestas fijas sin lógica. En QA del ER usas fakes de HTTP/DB y un reloj inyectable para que la suite no dependa de red ni de `datetime.now()`.

**After (minor polish only — paragraph is OK; expand "args" → "argumentos" on first use):**
> **Mock**: verifica interacciones (qué se llamó, con qué argumentos). **Fake**: implementación liviana en memoria con estado real. **Stub**: respuestas fijas sin lógica. En QA del ER usas fakes de HTTP/DB y un reloj inyectable para que la suite no dependa de red ni de `datetime.now()`.

**Rationale:** Tiny fix — expands the acronym-flavored "args" to "argumentos" on first use. The rest of the paragraph is fine.

### 6.6 THEORY tab — Subtopic 6 (Contratos de borde sin sobre-mocking) — L257

**Before (L257):**
> Heurística GOOS-friendly: si la función es pura (`normalize`, Jaccard de tokens), **no la mockees**. Si habla con red o disco, fakea el borde y aserta el efecto. `casefold` (no solo `lower` en un lado) es el contrato de igualdad de texto del ER para Unicode.

**After:**
> Heurística al estilo *GOOS*: si la función es pura (`normalize`, Jaccard de tokens), **no la mockees**. Si habla con red o disco, fakea el borde y aserta el efecto. `casefold` (no solo `lower` en un lado) es el contrato de igualdad de texto del ER para Unicode.

**Rationale:** Italicize *GOOS* (book title reference) and replace the English compound "GOOS-friendly" with "al estilo *GOOS*" (issue #15).

### 6.7 I Do tab — `intro` (L374)

**Before (L374, 3 sentences, OK but could tighten):**
> Yo hago primero (I Do): ocho demos de invariantes con seed, pruebas metamórficas, contratos de schema/golden, fakes de reloj/HTTP e integración sqlite determinista. Corre cada demo en tu entorno local-python: el output del curso debe coincidir con tu terminal. Observa el patrón propiedad → assert → evidencia (seed/input), no solo el print final.

**After (no structural change; only tighten "output" → "salida" for register consistency):**
> Yo hago primero (I Do): ocho demos de invariantes con seed, pruebas metamórficas, contratos de schema/golden, fakes de reloj/HTTP e integración sqlite determinista. Corre cada demo en tu entorno local-python: la salida del curso debe coincidir con tu terminal. Observa el patrón propiedad → assert → evidencia (seed/input), no solo el print final.

**Rationale:** "output" → "salida". Minor register polish. The sentence lengths (25/17/13) are fine.

### 6.8 We Do tab — `intro` (L584)

**Before (L584):**
> 24 ejercicios guiados → independientes → transferencia (8 subtemas × 3). Cada starter trae un **bug intencional** runnable: corrígelo y deja **solo** las líneas de salida del oráculo (mismas que la solución). Datos sintéticos; no etiquetes fraude ni parentesco. Tiempo sugerido: ~25–40 min por subtema en bloque We Do.

**After (bring "BUG intencional" in line with the course-wide `# DEFECT:` convention):**
> 24 ejercicios guiados → independientes → transferencia (8 subtemas × 3). Cada starter trae un **DEFECT** intencional runnable: corrígelo y deja **solo** las líneas de salida del oráculo (mismas que la solución). Datos sintéticos; no etiquetes fraude ni parentesco. Tiempo sugerido: ~25–40 min por subtema en bloque We Do.

**Rationale:** Replaces "bug intencional" with "DEFECT intencional" to re-align with S27's course-wide marker convention (issue #3). The accompanying change is to rewrite the 21 `# BUG intencional:` comments in starterCode as `# DEFECT:` to match S27's exact prefix. (See Diff D3 below.)

### 6.9 We Do tab — Three starterCode scaffolds (L852–858, L1313–1319, L1390–1396)

**Before (L852–858, S28-T2-A-E1 starterCode):**
```python
# BUG intencional: imprime ok aunque r no tiene id
r = {}
print("ok")
# Completa el DEFECT con la condición del enunciado y un assert de aceptación.
result = None  # calcula el valor correcto
print(result)
assert result is not None
```

**After (aligned with the other 21 starterCode blocks; matches the solutionCode shape):**
```python
# DEFECT: imprime ok aunque r no tiene id
r = {}
print("ok")
```

**Rationale:** Removes the developer-style scaffold ("Completa el DEFECT con la condición…", `result = None`, `print(result)`, `assert result is not None`) because (a) it is inconsistent with the other 21 starterCode blocks, (b) the corresponding solutionCode is a single `print(...)` line that doesn't use `result` or `assert`, and (c) "Completa el DEFECT con la condición del enunciado" reads as an author-to-author placeholder, not a learner-facing instruction (issue #2). Same fix applies to L1313–1319 (S28-T4-A-E2) and L1390–1396 (S28-T4-B-E1).

### 6.10 We Do tab — Feedback L669

**Before (L669):**
> Una propiedad real genera muchos inputs (seed + bucle) y aserta f(f(x))==f(x). Un solo literal no es property-based thinking.

**After:**
> Una propiedad real genera muchos inputs (seed + bucle) y aserta f(f(x))==f(x). Un solo literal no es *property-based thinking* (pensamiento basado en propiedades).

**Rationale:** Italicize the English phrase and gloss it in Spanish on first use (issue #19).

### 6.11 We Do tab — Feedback L985 (S28-T2-B-E2)

**Before (L985):**
> Reconcile sin approve actualiza el contrato en silencio y esconde regresiones. blocked_drift fuerza review humana antes de tocar el golden.

**After:**
> Reconciliar sin aprobación actualiza el contrato en silencio y esconde regresiones. `blocked_drift` fuerza revisión humana antes de tocar el golden.

**Rationale:** Replaces the English-noun calque "Reconcile" with the Spanish infinitive "Reconciliar"; "approve" → "aprobación"; "review" → "revisión" (issue #9). Keep `blocked_drift` as code (it's an identifier).

### 6.12 We Do tab — Feedback L1451 (S28-T4-B-E3)

**Before (L1451):**
> Cada run debe seedear de nuevo y ordenar. Sin seed+sorted, dos 'mismas' corridas CI divergen: eso es un flake.

**After (pick "re-sembrar" to match L1442's "re-siembra"):**
> Cada `run` debe re-sembrar la seed y ordenar. Sin `seed`+`sorted`, dos 'mismas' corridas de CI divergen: eso es un flake.

**Rationale:** Pick the Spanish form to match L1442 (issue #13). Backtick the code identifiers.

### 6.13 You Do tab — `context` (L1486)

**Before (L1486, "sqlite memoria"):**
> Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite memoria. Sin PII real; matching ≠ fraude. Extiende lo aprendido en S27 (pytest AAA/fixtures) con las capas de S28.

**After:**
> Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite en memoria. Sin PII real; matching ≠ fraude. Extiende lo aprendido en S27 (pytest AAA/fixtures) con las capas de S28.

**Rationale:** "sqlite memoria" → "sqlite en memoria" for grammatical correctness and consistency with L215, L535, L1263 (issue #8).

### 6.14 Self-Check tab — Q2 explanation (L1617)

**Before (L1617):**
> Reconcile debe ser aprobado por un humano con nota de cambio: sin review, el golden deja de proteger el contrato y esconde bugs de matching.

**After:**
> La reconciliación debe ser aprobada por un humano con nota de cambio: sin revisión, el golden deja de proteger el contrato y esconde bugs de matching.

**Rationale:** "Reconcile" → "La reconciliación"; "review" → "revisión" (issue #9).

### 6.15 Self-Check tab — Q4 explanation (L1631)

**Before (L1631):**
> CI determinista es outcome de S28: seed fija, reloj inyectado, orden estable. Retry sin root-cause o borrar el test no es fix; cuarentena documentada es el último recurso.

**After:**
> Un CI determinista es el resultado de S28: seed fija, reloj inyectado, orden estable. Reintentar sin root-cause o borrar el test no es fix; la cuarentena documentada es el último recurso.

**Rationale:** "es outcome de S28" → "es el resultado de S28" (issue #10/#11); "Retry" → "Reintentar"; "cuarentena documentada" → "la cuarentena documentada" (article fix). Keep "root-cause" and "fix" as accepted loanwords (the rest of the section uses them consistently).

### 6.16 Self-Check tab — Q5 option (L1621)

**Before (L1621, option B):**
> Usar sqlite memoria para materializar pares candidatos

**After:**
> Usar sqlite en memoria para materializar pares candidatos

**Rationale:** Same fix as 6.13 (issue #8).

### 6.17 Callout content (L330)

**Before (L330, "Containers vs memoria"):**
> sqlite memoria valida lógica de pares y schema; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29). Sé honesto en el reporte de evidencia: qué capa cubriste.

**After:**
> sqlite en memoria valida lógica de pares y schema; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29). Sé honesto en el reporte de evidencia: qué capa cubriste.

**Rationale:** Same fix (issue #8).

### 6.18 Title (L6) — optional clarity fix

**Before:**
> `title: "Pruebas de datos, propiedades e integración"`

**After (optional):**
> `title: "Pruebas de datos, de propiedades y de integración"`

**Rationale:** Removes the comma-ambiguity (issue #21). Slightly longer but parses unambiguously as "pruebas de (datos / propiedades / integración)". If kept as-is for brevity, no action needed.

### 6.19 shortTitle (L7) — optional clarity fix

**Before:**
> `shortTitle: "Props e integración"`

**After (optional):**
> `shortTitle: "Propiedades e integración"`

**Rationale:** "Props" is React/JS jargon for "properties" and is not standard Spanish; it collides with the section topic (property-based testing) (issue #16). "Propiedades e integración" is one extra syllable and unambiguous.

### 6.20 Tab-by-tab summary table

| Tab | Paragraphs/sentences reviewed | Issues found | Severity range |
|---|---|---|---|
| meta (jobRelevance + outcomes) | 3 sentences (jobRelevance) + 8 outcome lines | #5 (long sentence L16) | M |
| theory (9 subtopics, 29 paragraphs, 9 callouts) | ~90 sentences | #4 (run-on L49), #6 (long L291), #7 (Diccionario L32), #8 (sqlite memoria L330), #14 (PRNG L595), #15 (GOOS-friendly L257), #17 (case L49), #20 (archivo temp L290), #21 (title L6) | H–L |
| iDo (intro + 8 demos × description/why) | 25 sentences | (none beyond the cross-cutting loanword notes) | L |
| weDo (intro + 24 × {instruction, hint, hints[], edgeCases[], tests, feedback}) | ~210 sentences | #2 (DEFECT scaffolds L855/1316/1393), #3 (BUG vs DEFECT), #9 (Reconcile L985), #12 (mockear/hardcodear/seedear), #13 (seedear vs re-siembra L1451), #17 (case), #19 (property-based thinking L669) | H–L |
| youDo (context + objectives + requirements + portfolioNote + rubric) | 23 sentences | #8 (sqlite memoria L1486), #22 (rhythm arithmetic L41 vs L10) | L |
| selfCheck (5 Q + 5 explanation + 20 options) | 33 sentences | #8 (sqlite memoria L1621), #9 (Reconcile L1617), #10/#11 (outcome L1631) | L |
| resources (7 docs + 2 books + 4 courses notes) | 13 short notes | (none) | — |

---

## 7. Proposed GitHub-style Diffs

> All diffs are **proposed only** — do not apply in this audit pass. Line numbers refer to `src/lib/course/sections/s28-llm-agents.ts`.

### D1. Fix the `id` mismatch (P0)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -1,7 +1,7 @@
 import type { CourseSection } from '../../types'

 export const section28: CourseSection = {
-  id: "llm-agents",
+  id: "data-qa-properties-integration",
   index: 28,
   title: "Pruebas de datos, propiedades e integración",
   shortTitle: "Props e integración",
```

> Note: changing `id` changes the URL hash route. This is a breaking change for any learner bookmarks. If backward-compatible routing is desired, also add a redirect map in `src/app/page.tsx` from `llm-agents` → `data-qa-properties-integration` (or pick a shorter slug like `data-qa-er`). Coordinating with the rest of the migration (S14–S29 also have id/filename drift) is the right scope.

### D2. Remove the 3 DEFECT-scaffold starterCode blocks (P1)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -852,9 +852,5 @@
           title: "exercise.py",
           code: `# BUG intencional: imprime ok aunque r no tiene id
 r = {}
-print("ok")
-# Completa el DEFECT con la condición del enunciado y un assert de aceptación.
-result = None  # calcula el valor correcto
-print(result)
-assert result is not None
+print("ok")`,
         },
@@ -1313,9 +1309,5 @@
           title: "exercise.py",
           code: `# BUG intencional: usa n*n (incluye diagonal)
 n = 4
-print(n * n)
-# Completa el DEFECT con la condición del enunciado y un assert de aceptación.
-result = None  # calcula el valor correcto
-print(result)
-assert result is not None
+print(n * n)`,
         },
@@ -1390,9 +1382,5 @@
           title: "exercise.py",
           code: `# BUG intencional: no aplica sorted
 ids = ["b", "a"]
-print(ids)
-# Completa el DEFECT con la condición del enunciado y un assert de aceptación.
-result = None  # calcula el valor correcto
-print(result)
-assert result is not None
+print(ids)`,
         },
```

### D3. Re-align bug-marker convention with S27 (`# DEFECT:` instead of `# BUG intencional:`) (P2)

Apply to all 21 `# BUG intencional:` starterCode comments. Example for L604 (S28-T1-A-E1):

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -601,7 +601,7 @@
         starterCode: {
           language: "python",
           title: "exercise.py",
-          code: `# BUG intencional: falta volver a seedear antes de b
+          code: `# DEFECT: falta volver a seedear antes de b
 import random
 random.seed(0)
 a = random.random()
```

Repeat the same `s/# BUG intencional:/# DEFECT:/` substitution for the other 20 occurrences (lines: 604, 642, 673, 734, 777, 814, 852, 887, 918, 958, 989, 1020, 1065, 1104, 1137, 1170, 1199, 1230, 1276, 1313, 1390). Also update the weDo intro:

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -582,7 +582,7 @@
   weDo: {
     intro:
-      "24 ejercicios guiados → independientes → transferencia (8 subtemas × 3). Cada starter trae un **bug intencional** runnable: corrígelo y deja **solo** las líneas de salida del oráculo (mismas que la solución). Datos sintéticos; no etiquetes fraude ni parentesco. Tiempo sugerido: ~25–40 min por subtema en bloque We Do.",
+      "24 ejercicios guiados → independientes → transferencia (8 subtemas × 3). Cada starter trae un **DEFECT** intencional runnable: corrígelo y deja **solo** las líneas de salida del oráculo (mismas que la solución). Datos sintéticos; no etiquetes fraude ni parentesco. Tiempo sugerido: ~25–40 min por subtema en bloque We Do.",
```

### D4. Split the run-on at L49 (P2)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -46,9 +46,13 @@
       paragraphs: [
         "Una **invariante** es una propiedad que **siempre** debe cumplirse en el dominio ER: `normalize` es **idempotente** (`f(f(x)) == f(x)`); scores en **[0, 1]**; ids no vacíos; pares canónicos `entity_a < entity_b`. Si se rompe, el matching deja de ser un contrato y se vuelve intuición.",
-        "Genera casos **desde la invariante**, no desde un ejemplo feliz. Tres estrategias en este curso: (1) **tabla exhaustiva** pequeña (todos los bordes conocidos: vacío, solo espacios, tildes, scores 0/1/1.2), (2) **random acotado con seed fija** (reproducible en CI; imprime seed+input al fallar), (3) **Hypothesis** (herramienta industrial: defines la propiedad, una *strategy* genera inputs, y al fallar hace *shrink* del contraejemplo). Aquí practicas el pensamiento de (1)+(2) con `test_*` de pytest; Hypothesis es el siguiente paso industrial (recursos). Un solo case “Ana López” no caza encoding, espacios dobles ni scores fuera de rango.",
+        "Genera casos **desde la invariante**, no desde un ejemplo feliz. Tres estrategias en este curso:\n\n1. **Tabla exhaustiva** pequeña: todos los bordes conocidos (vacío, solo espacios, tildes, scores 0/1/1.2).\n2. **Random acotado con seed fija:** reproducible en CI; imprime seed+input al fallar.\n3. **Hypothesis:** herramienta industrial — defines la propiedad, una *strategy* genera inputs, y al fallar hace *shrink* del contraejemplo.\n\nAquí practicas el pensamiento de (1)+(2) con `test_*` de pytest; Hypothesis es el siguiente paso industrial (recursos). Un solo caso “Ana López” no caza encoding, espacios dobles ni scores fuera de rango.",
```

### D5. Split the long sentence at L291 (P2)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -288,9 +288,13 @@
       subtopicId: "S28-T4-A",
       paragraphs: [
         "Una prueba de **integración** ejerce **2+ componentes reales** (app + sqlite, o servicio + fake HTTP + DB). **E2E** cubre el flujo punta a punta (`ingest → pares → review`) con datos sintéticos. **Testcontainers** (concepto de CI): DB efímera en contenedor con el mismo dialecto que producción; en este curso usamos sqlite `:memory:` o archivo temp como análogo local honesto.",
-        "Mide lo que el tagline promete: **encoding** (tildes y formas NFC/NFD unificadas con `unicodedata.normalize`), **cardinalidad** de pares (`C(n,2)` o igualdad de nombre), **orden** de paginación estable, **timeout** simulado (retry/abort con reloj fake, no `sleep` real) y **reanudación** (checkpoint: no reprocesar ids ya hechos).",
+        "Mide lo que el tagline promete:\n\n- **Encoding:** tildes y formas NFC/NFD unificadas con `unicodedata.normalize`.\n- **Cardinalidad de pares:** `C(n,2)` o igualdad de nombre.\n- **Orden de paginación estable.**\n- **Timeout simulado:** retry/abort con reloj fake, no `sleep` real.\n- **Reanudación:** checkpoint; no reprocesar ids ya hechos.",
```

### D6. Split the long sentence at L16 (jobRelevance) (P2)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -13,7 +13,7 @@
   icon: "ShieldCheck",
   accentColor: "bg-gradient-to-br from-emerald-500 to-teal-700",
   jobRelevance:
-    "El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices: propiedades que generen bordes, contratos de schema, goldens con review humano, dobles de HTTP/DB/reloj e integración determinista en CI. En un desk de datos en Lima (banca, fintech o retail), un flake o un golden actualizado en silencio puede dejar pasar un matching roto hasta producción de revisión. Esta sección te arma la capa de propiedades + datos + dobles + integración que protege el pipeline sintético CP-N3-A.",
+    "El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices. Necesita propiedades que generen bordes, contratos de schema, goldens con review humano, dobles de HTTP/DB/reloj e integración determinista en CI. En un desk de datos en Lima (banca, fintech o retail), un flake o un golden actualizado en silencio puede dejar pasar un matching roto hasta producción de revisión. Esta sección te arma la capa de propiedades + datos + dobles + integración que protege el pipeline sintético CP-N3-A.",
```

### D7. Normalize "sqlite memoria" → "sqlite en memoria" (P3)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -327,7 +327,7 @@
       callout: {
         type: "info",
         title: "Containers vs memoria",
-        content:
-          "sqlite memoria valida lógica de pares y schema; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29). Sé honesto en el reporte de evidencia: qué capa cubriste.",
+        content:
+          "sqlite en memoria valida lógica de pares y schema; containers validan driver/SQL dialecto real cuando el almacén es Postgres (S29). Sé honesto en el reporte de evidencia: qué capa cubriste.",
@@ -1483,7 +1483,7 @@
   youDo: {
     title: "Suite QA del motor ER — propiedades, goldens e integración",
     context:
-      "Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite memoria. Sin PII real; matching ≠ fraude. Extiende lo aprendido en S27 (pytest AAA/fixtures) con las capas de S28.\n\n...",
+      "Entrega una suite sintética que cace encoding, cardinalidad, orden, timeout/reanudación y drift de golden para el pipeline ER de CP-N3-A. Usa fixtures mínimas, fakes de reloj/HTTP y sqlite en memoria. Sin PII real; matching ≠ fraude. Extiende lo aprendido en S27 (pytest AAA/fixtures) con las capas de S28.\n\n...",
@@ -1618,7 +1618,7 @@
         question: "En integración local del ER, sqlite en memoria sirve sobre todo para…",
         options: ["Reemplazar por completo a Postgres en producción", "Generar PII real de contactos bancarios para el golden", "Evitar documentar encoding NFC/NFD porque “ya funciona en laptop”", "Validar schema, joins de candidatos y cardinalidad sin red ni contenedor"],
-        options: ["Reemplazar por completo a Postgres en producción", "Generar PII real de contactos bancarios para el golden", "Evitar documentar encoding NFC/NFD porque “ya funciona en laptop”", "Usar sqlite memoria para materializar pares candidatos"],
+        options: ["Reemplazar por completo a Postgres en producción", "Generar PII real de contactos bancarios para el golden", "Evitar documentar encoding NFC/NFD porque “ya funciona en laptop”", "Usar sqlite en memoria para materializar pares candidatos"],
```

> Note: the third hunk above shows the correct option (B) for Q5 currently says "Usar sqlite memoria para materializar pares candidatos" — fix that occurrence too.

### D8. Replace "Reconcile" calque with "Reconciliación" / "Reconciliar" (P3)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -982,7 +982,7 @@
         tests: "Una línea: blocked si hay diff y approved=False",
         feedback:
-          "Reconcile sin approve actualiza el contrato en silencio y esconde regresiones. blocked_drift fuerza review humana antes de tocar el golden.",
+          "Reconciliar sin aprobación actualiza el contrato en silencio y esconde regresiones. `blocked_drift` fuerza revisión humana antes de tocar el golden.",
@@ -1614,7 +1614,7 @@
         correctIndex: 1,
         explanation:
-          "Reconcile debe ser aprobado por un humano con nota de cambio: sin review, el golden deja de proteger el contrato y esconde bugs de matching.",
+          "La reconciliación debe ser aprobada por un humano con nota de cambio: sin revisión, el golden deja de proteger el contrato y esconde bugs de matching.",
```

### D9. Fix "outcome" anglicism in Q4 explanation (P3)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -1628,7 +1628,7 @@
         correctIndex: 0,
         explanation:
-          "CI determinista es outcome de S28: seed fija, reloj inyectado, orden estable. Retry sin root-cause o borrar el test no es fix; cuarentena documentada es el último recurso.",
+          "Un CI determinista es el resultado de S28: seed fija, reloj inyectado, orden estable. Reintentar sin root-cause o borrar el test no es fix; la cuarentena documentada es el último recurso.",
```

### D10. Fix "seedear" vs "re-siembra" inconsistency (P3)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -1448,7 +1448,7 @@
         tests: "Dos líneas: True (run(7)==run(7)) y la lista ordenada de run(7)",
         feedback:
-          "Cada run debe seedear de nuevo y ordenar. Sin seed+sorted, dos 'mismas' corridas CI divergen: eso es un flake.",
+          "Cada `run` debe re-sembrar la seed y ordenar. Sin `seed`+`sorted`, dos 'mismas' corridas de CI divergen: eso es un flake.",
```

### D11. Italicize *GOOS* and replace "GOOS-friendly" (P3)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -254,7 +254,7 @@
         "Prefiere **contratos de borde**: dado input, observa output y efectos visibles (filas escritas, status HTTP, schema del payload). Mockea solo I/O externo; deja la lógica de normalización/matching real bajo prueba cuando es pura y barata.",
-        "Heurística GOOS-friendly: si la función es pura (`normalize`, Jaccard de tokens), **no la mockees**. Si habla con red o disco, fakea el borde y aserta el efecto. `casefold` (no solo `lower` en un lado) es el contrato de igualdad de texto del ER para Unicode.",
+        "Heurística al estilo *GOOS*: si la función es pura (`normalize`, Jaccard de tokens), **no la mockees**. Si habla con red o disco, fakea el borde y aserta el efecto. `casefold` (no solo `lower` en un lado) es el contrato de igualdad de texto del ER para Unicode.",
```

### D12. Fix "property-based thinking" English phrase (P3)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -665,7 +665,7 @@
         feedback:
-          "Una propiedad real genera muchos inputs (seed + bucle) y aserta f(f(x))==f(x). Un solo literal no es property-based thinking.",
+          "Una propiedad real genera muchos inputs (seed + bucle) y aserta f(f(x))==f(x). Un solo literal no es *property-based thinking* (pensamiento basado en propiedades).",
```

### D13. Optional: fix title and shortTitle clarity (P3)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -3,8 +3,8 @@
 export const section28: CourseSection = {
   id: "llm-agents",
   index: 28,
-  title: "Pruebas de datos, propiedades e integración",
-  shortTitle: "Props e integración",
+  title: "Pruebas de datos, de propiedades y de integración",
+  shortTitle: "Propiedades e integración",
```

### D14. Optional: reconcile rhythm arithmetic (P4)

```diff
--- a/src/lib/course/sections/s28-llm-agents.ts
+++ b/src/lib/course/sections/s28-llm-agents.ts
@@ -37,7 +37,7 @@
       callout: {
         type: "info",
         title: "Límite del resultado + ritmo (19 h)",
         content:
-          "Las pruebas verifican identidad de registros y calidad técnica; no autorizan inferencias de relación o riesgo. Matching ≠ fraude. Ritmo sugerido: ~4–5 h T1 propiedades, ~4–5 h T2 schema/goldens, ~4 h T3 dobles, ~4–5 h T4 integración/CI + You Do portfolio.",
+          "Las pruebas verifican identidad de registros y calidad técnica; no autorizan inferencias de relación o riesgo. Matching ≠ fraude. Ritmo sugerido: ~4–5 h T1 propiedades, ~4–5 h T2 schema/goldens, ~4 h T3 dobles, ~5–6 h T4 integración/CI + You Do portfolio (total ~19 h).",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue(s) | Effort | Impact |
|---|---|---|---|
| **P0** | #1 (`id: "llm-agents"` mismatch) — D1 | 5 min code change + 1-line redirect map if backward compat is desired. Coordinate with the course-wide id migration (S14–S29 all have id/filename drift). | High — fixes learner-visible URL hash, restores search-discoverability, removes a major contributor confusion point. |
| **P1** | #2 (3 DEFECT-scaffold starterCode blocks) — D2 | 5 min — delete 4 lines × 3 files. No content design needed; the other 21 starterCode blocks already follow the correct pattern. | High — eliminates a contradictory scaffold that misleads learners in 3 of 24 exercises. |
| **P2** | #3 (`# BUG intencional:` → `# DEFECT:` convention drift) — D3 | 10 min — `sed`-style replace across 21 starterCode comments + 1 weDo intro string. Verify each replacement reads cleanly. | Medium — restores the course-wide marker convention established in S27; improves cross-section coherence. |
| **P2** | #4, #5, #6 (3 long/run-on sentences) — D4, D5, D6 | 15 min — three paragraph rewrites. | Medium — reduces cognitive load on the three densest learner-facing paragraphs (theory L49, theory L291, jobRelevance L16). |
| **P3** | #7 (Diccionario mega-paragraph) — reformat to bullet list | 10 min — reformat L32 as a multi-line list inside the TS string. | Medium — first-encounter readability of the glossary block. |
| **P3** | #8 (`sqlite memoria` → `sqlite en memoria`) — D7 | 5 min — 3 string replacements. | Low — grammar normalization. |
| **P3** | #9 (`Reconcile` calque) — D8 | 5 min — 2 string replacements. | Low — register normalization. |
| **P3** | #10/#11 (`outcome` anglicism) — D9 | 2 min — 1 string replacement. | Low — register normalization. |
| **P3** | #12, #13 (loanword inconsistency `seedear` vs `re-siembra`) — D10 | 2 min — 1 string replacement (pick "re-sembrar" to match L1442). | Low — internal consistency. |
| **P3** | #15 (`GOOS-friendly`) — D11 | 2 min — 1 string replacement. | Low — register polish. |
| **P3** | #17 (`case` anglicism in L49) — D4 (covered) | (covered by D4) | Low — vocabulary fix. |
| **P3** | #19 (`property-based thinking` English phrase) — D12 | 2 min — 1 string replacement. | Low — register polish. |
| **P3** | #14 (`PRNG` acronym) — expand on first use | 2 min — 1 hint string edit. | Low — acronym hygiene. |
| **P4** | #21 (title comma ambiguity), #16 (`Props` shortTitle) — D13 | 2 min — 2 string edits. | Low — clarity. |
| **P4** | #22 (rhythm arithmetic) — D14 | 2 min — 1 callout content edit. | Low — planner polish. |

**Quick wins:** P0 + P1 + P2-D2 + P2-D3 together fix all the high-impact issues in ~30 minutes of editing.

---

## 9. Graph Memory Update Notes (for shared context files)

**Findings relevant to other section auditors:**

1. **Course-wide id/filename drift.** S28's `id: "llm-agents"` contradicts its content (QA / property-based testing). Spot-check of S14–S18 and S27–S29 confirms the same pattern: every section's filename and `id` field still reflect an older roadmap version (e.g., `s14-security.ts` has `id: "numpy-vectorized"` and `title: "NumPy y cómputo vectorizado"`; `s16-wxpython-gui.ts` has `title: "Calidad, limpieza y contratos de datos"`; `s27-async-concurrency.ts` has `title: "Estrategia de pruebas con pytest"`; `s29-mlops.ts` has `title: "SQL avanzado y modelado relacional"`). The `title` and content are correct per v3 roadmap; only the `id` and filename are stale. **This is a course-wide P0 for the Fixer phase, not just S28.**

2. **Bug-marker convention is `# DEFECT:` (established in S27).** S27's weDo intro explicitly states: *"Cada starter trae un comentario `# DEFECT:` que marca el bug a corregir (patrón de caza de fallas del curso)."* S28 drifts to `# BUG intencional:`. Auditors of S29–S52 should check whether their section uses `# DEFECT:` consistently. If the convention is being deprecated, it should be deprecated explicitly and uniformly; if not, drift sections need re-alignment.

3. **`hint` + `hints[0]` duplication is consistent in S28** (24/24 exercises have `hint` verbatim-duplicating `hints[0]`). Same pattern as S01. Auditors should confirm whether this is intentional schema redundancy or removable.

4. **`Completa el DEFECT con la condición del enunciado` scaffold** appears in 3 S28 starterCode blocks. Worth grepping across other sections to see if the same scaffold leaked elsewhere: `grep -rn "Completa el DEFECT" src/lib/course/sections/`.

5. **FH/WPS baseline for Senior-phase (Phase 2) Spanish technical prose:** S28 shows avg FH=72.0, median FH=71.6, avg WPS=11.6, avg SPW=2.05. These are reasonable targets for Phase 2–3 sections (slightly harder than Phase 0–1, which S01–S13 reported as FH=79.1 avg). Auditors of S29–S52 should expect similar (70–75 FH median, 10–14 WPS).

6. **`CP-N3-A` capstone increment** is the ER-pipeline QA suite. It is referenced consistently in S28's jobRelevance, YouDo context, portfolioNote. The capstone sequence N3-A → N3-B → N3-C spans the Senior phase. S28 = QA layer; S30 = ER probabilístico; S39 = Case Triage N3 (the phase closer). Auditors of S29–S39 should verify their section's `CP-N3-*` reference is to the correct increment.

7. **Live-site hash routing:** `src/app/page.tsx:68` does `COURSE_SECTIONS.find((s) => s.id === hash)`. So the `id` field IS the URL hash. Any `id` change requires either a redirect map or accepting broken bookmarks.

8. **Per-key sentence metrics for S28 (reference baseline):**

   | key | n sents | avg FH | avg W | max W |
   |---|---|---|---|---|
   | paragraphs | 90 | 59.7 | 15.8 | 54 |
   | instruction | 81 | 77.0 | 10.8 | 34 |
   | feedback | 48 | 85.1 | 11.0 | 20 |
   | hints | 35 | 85.6 | 9.2 | 16 |
   | tests | 24 | 92.4 | 10.9 | 15 |
   | edgeCases | 23 | 77.7 | 8.3 | 12 |
   | options | 20 | 63.6 | 9.6 | 14 |
   | content | 19 | 71.0 | 12.2 | 26 |
   | hint | 15 | 97.2 | 10.5 | 20 |
   | note | 11 | 63.7 | 5.3 | 11 |
   | heading | 9 | 55.8 | 5.2 | 6 |
   | why | 9 | 58.3 | 11.9 | 17 |
   | title | 8 | 70.1 | 5.0 | 9 |
   | text | 8 | 61.9 | 8.4 | 10 |
   | description | 8 | 67.4 | 13.8 | 20 |
   | explanation | 8 | 59.3 | 18.2 | 29 |
   | intro | 7 | 58.3 | 14.6 | 25 |
   | requirements | 6 | 58.3 | 18.3 | 42 |
   | criterion | 6 | 40.2 | 8.2 | 11 |
   | question | 5 | 75.3 | 8.2 | 12 |
   | objectives | 4 | 14.8 | 8.0 | 11 |
   | jobRelevance | 3 | 50.0 | 27.7 | 35 |
   | portfolioNote | 2 | 55.8 | 16.0 | 18 |
   | tagline | 1 | 27.5 | 15.0 | 15 |

   (Low-FH rows like `criterion`, `objectives`, `tagline`, `heading` are short noun phrases where the syllable/word ratio inflates; not prose-quality issues.)

9. **No developer JS line comments in source** — clean. Pattern other auditors can confirm with: `grep -nE '^\s*//' src/lib/course/sections/sNN-*.ts`.

10. **No `TODO/FIXME/XXX/TBD/WIP` acronyms in learner-facing strings** — clean. Auditors should use case-sensitive matching (`\b(TODO|FIXME|XXX|TBD|WIP|NOTE|HACK)\b`) to avoid false positives on the Spanish word "todo" (cf. S01 worklog note).

---

## Method Note (Grammar Subplan)

Per the shared `_GRAMMAR_SUBPLAN.md`, the following methods were applied:

1. **Fernández-Huerta (1959)** readability: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Computed per sentence and aggregated. S28 avg = 72.0, median = 71.6 (band: *normal / bastante fácil*). Appropriate for senior technical Spanish.
2. **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`. Computed alongside FH (saved in `_s28_metrics.json`).
3. **WPS** (words per sentence) and **SPW** (syllables per word). S28 avg WPS=11.6 (well under the 32 soft cap); avg SPW=2.05.
4. **13 pedagogical heuristics** from the subplan: run-on (>45 w), long (>32 w), missing terminal punctuation, missing `¿`/`¡`, unbalanced delimiters, repeated word, rough DET–NOUN number cue, English-dominant sentence, meta/AI/TODO leak, gerund pile-up, high comma density, paragraph-as-one-sentence, anaphoric monotony, space-before-punct/double space. All applied via `audits/_s28_extract.py`. The meta-leak detector uses **case-sensitive** matching for English acronyms (per the S01 worklog insight) to avoid false positives on the Spanish word "todo".
5. **LanguageTool (es) via public API**: NOT run for S28 to conserve API budget and because the heuristic pass found no concordance errors on manual review. The single "Reconcile" / "outcome" / "sqlite memoria" issues were caught by manual reading, not by heuristics. If the Fixer phase wants LT confirmation, the chunked prose is at `audits/_s28_metrics.json` → `all_sentences[].sentence`.

**Validation:**
- Nonzero prose extraction: 287 records / 460 sentences. ✓
- FH in plausible range: 72.0 avg. ✓
- Known false-positive classes: missing-terminal-punct on headings/hints/options (intentionally telegraphic) — 174 fired, all manually reviewed and excluded from the issue registry. ✓
- meta_leak_phrase false positive on the Spanish verb "Reemplazar" — excluded. ✓
- meta_leak_acronym: 0 fired (after case-sensitive fix). ✓

**Risks & mitigations followed:**
- Template literals with `${}` — S28 has no `${}` interpolations in prose strings; only in code blocks (which are excluded by the `q == '`'` filter).
- Code-adjacent Spanish (e.g., "sqlite memoria", "Hypothesis haría shrink") — flagged as loanwords (low severity) rather than grammar errors.

---

## Final Verdict

Section 28 is a **technically honest, pedagogically well-structured senior-phase QA module** whose main weaknesses are not in its prose but in two structural residues: (a) a stale `id: "llm-agents"` slug that contradicts the section content and shows up in every learner's URL bar, and (b) 3 of 24 We Do starterCode blocks that retain a developer-style scaffold inconsistent with both their solutionCode and the other 21 starters. A 30-minute Fixer pass on P0+P1+P2-D3 (the convention-drift fix) would lift the section from 7.0 to ~8.5/10. The Spanish redaction is correct, clear, and idiomatic in Peruvian technical register; the few long sentences and the "Diccionario" mega-paragraph are redaction debt, not grammar errors.

**Composite score: 7.0 / 10.**

**"This is the complete Explorer report for Section 28. Ready for the Fixer prompt."**
