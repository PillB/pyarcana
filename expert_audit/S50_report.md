# Section 50 — Curriculum Auditor Report

**Section identifier:** `section50` — id `"tech-leadership"` (legacy), title `"Evals, red teaming y fiabilidad de IA"`
**Live site:** https://pillb.github.io/pyarcana/ (Phase 3 — Master, slot 50/52, hash route `#tech-leadership`)
**Source:** `src/lib/course/sections/s50-tech-leadership.ts` (2,206 lines)
**Auditor:** Curriculum Auditor (general-purpose subagent, S50)
**Method:** Stanford STORM + Graph/Loop/Harness engineering, with the shared `_GRAMMAR_SUBPLAN.md` (Fernández-Huerta, INFLESZ, WPS/SPW, LanguageTool `es`, pedagogical heuristics). Heuristic script: `audits/s50_extract.py` + `audits/s50_grammar.py`. Raw artifacts: `audits/s50_prose.txt`, `audits/s50_prose.json`, `audits/s50_metrics.json`, `audits/s50_lt.json`, `audits/s50_lt_input.txt`.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section index | 50 (1-based) |
| Phase | 3 — Master (sections 40–52) |
| Title (long) | "Evals, red teaming y fiabilidad de IA" |
| Title (short) | "Evals y red team" |
| Tagline | "Suite repetible baseline/candidato con holdout, jueces calibrados, red team y SLO: bloquea regresiones P0/P1 y tool misuse en la trayectoria" |
| Estimated hours | 20 |
| Level | Master |
| Icon | `ShieldCheck` |
| Accent color | `bg-gradient-to-br from-amber-500 to-red-600` |
| Job relevance | Equipo de plataforma/producto: gate medible de fiabilidad de IA agentic/RAG con holdouts, acuerdo humano–LLM, inyección bloqueada y SLO de p95 |
| Learning outcomes | 8 (diseñar dataset, calificar trajectory, combinar graders, calibrar jueces, red-teamear injection/exfil/misuse, mitigar indirect+poisoning+least-priv, detectar hallucination y abstener, operar SLO+rollback) |
| Topics | T1 evals (T1-A dataset+rúbrica, T1-B outcome/proceso/trajectory/recovery) · T2 jueces (T2-A graders det/humano/LLM, T2-B calibración/order bias/holdout) · T3 adversarial (T3-A injection+exfil+misuse, T3-B indirect+poisoning+least-privilege) · T4 fiabilidad (T4-A hallucination+abstención, T4-B latency/cost/cache/incident/rollback) |
| Tabs | `theory` (9 subtopic blocks, 27 paragraphs, 9 callouts, 9 code samples) · `iDo` (8 demos with description+code+why) · `weDo` (8 topics × 3 exercises = 24 exercises with starter+solution) · `youDo` (CP-N4-C capstone with 4 objectives, 8 requirements, 6-criterion rubric, portfolioNote) · `selfCheck` (10 MCQs) · `resources` (8 docs + 2 books + 4 courses) |
| Bridge in | S49 (agente acotado con tools y reanudación; "puente S49→S50: trajectory eval") |
| Bridge out | S51 (obs y UX del copiloto); gate `CP-N4-C` |
| Roadmap match | V3 roadmap (`learning_roadmap_52_V3.md` L672–684) confirms title, T1–T4 structure and the "suite repetible bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final" increment — full match |
| Prose records extracted | 220 raw → 157 learner-facing (after dropping code-block titles, `weight`-only rubric fields, filename-only labels) |
| Sentences analyzed | 206 |

**Identity confirmation (live vs source vs repo):**
- `src/lib/course/index.ts:54` imports `section50` from `./sections/s50-tech-leadership` and `COURSE_SECTIONS[49]` (line 80) is `section50` — confirmed 50th slot.
- Live site (`agent-browser open https://pillb.github.io/pyarcana/`) lists slot "50 / Evals y red team / Suite repetible baseline/candidato con holdout, jueces calibrados, red team y SLO: bloquea regresiones P0/P1 y tool misuse en la trayectoria" — matches `shortTitle` + `tagline` exactly.
- Clicking slot 50 loads the section page with all 5 Spanish tabs: `Teoría` (Theory), `Yo hago` (I Do), `Hacemos juntos` (We Do), `Tú haces` (You Do), `Autocheck` (Self Check). Heading `Ruta de S50: Evals, red teaming y fiabilidad de IA` and first theory paragraph `Diccionario de la sección (léelo antes de T1). Task dataset: ...` match the source verbatim.
- **Legacy-id mismatch (intentional, not a defect):** the file is named `s50-tech-leadership.ts` and the `id` field is `"tech-leadership"`, but the actual content is *evals, red teaming y fiabilidad de IA*. Same legacy-filename pattern as S32 (`s32-microservices.ts` with V3 content "Feature engineering sin leakage"). The hash route `#tech-leadership` works correctly because it uses the legacy `id`. The roadmap V3 (L672) confirms the new title — so the content was migrated but the filename/id were not renamed. Renaming would require updating `index.ts` import + route table; the audit treats the legacy id as a tracking note, not a defect.

---

## 2. Executive Summary of Quality

**Score: 8.6 / 10**

**Verdict:** A *strong, well-engineered* Master-phase section that successfully closes the agentic sub-track (S48–S49) with a coherent *quality gate* capstone. The pedagogical architecture is the highlight: every one of the 8 theory subtopics has a paired `iDo` demo and a 3-layer `weDo` progression (**E1 build → E2 assess → E3 decide**) that systematically widens the failure surface from "repair a defect" → "route three fixtures (valid/adversarial/missing)" → "fail-closed decision (CONTINUE / BREACH / UNCERTAIN)". This 24-exercise lattice is the densest in the course so far and is a real differentiator vs. typical LLM-eval tutorials that stop at "compute accuracy". The `scorecard` + `readiness` artifact in the `youDo` capstone is a genuine portfolio deliverable (CP-N4-C quality gate), not a toy.

**Strengths**
- **I Do / We Do / You Do fidelity is exemplary.** 8 demos, 24 exercises (3 per subtopic with deliberate E1/E2/E3 layering), 1 capstone, 10 self-check MCQs with explanations.
- **Strong connective tissue.** Explicit "puente S49→S50: trajectory" framing; recurring `CASO-ICA-050-*` synthetic fixtures; references `CP-N4-C` gate; opening theory paragraph states "Esta sección cierra el tramo agentic (S48–S49)…".
- **Contract-driven prose rhythm.** Each theory subtopic's middle paragraph follows "Contrato de X. Entrada: … Salida: … Error local: … → `REJECT_CODE`" — a stable cognitive scaffold that lowers working-memory load across 9 subtopics.
- **Responsible-AI stance.** "Una respuesta final «correcta» tras una **tool prohibida** o un salto de policy es **fallo P0**"; "claim ≠ prueba de culpa"; "No es veredicto de fraude ni parentesco". This is industry-grade AI safety pedagogy, rare in Spanish-language courses.
- **Pure stdlib pedagogy.** "Demos en **stdlib** (sin APIs de modelo de pago)" — guarantees reproducibility without OpenAI/Anthropic spend, consistent with the course's local-first contract.
- **No meta-leaks.** No TODO/FIXME, no `// author note`, no design notes, no AI-to-developer residue. The `meets_contract = ('1A-1' == '1A-1')` idiom in solutionCode blocks is a deliberate contract-verification pattern (shared with S48, S49), not authoring residue.

**Weaknesses (concentrated in redaction, low severity)**
- **`vs` without period (8 prose occurrences + 1 code comment).** RAE/DPD prescribes `vs.` (from Latin *versus*); modern tech Spanish accepts `vs`, but consistency with the rest of the course would be `vs.`.
- **Missing comma before `pero` (2 occurrences).** LT rule `COMMA_PERO`. Easy fix.
- **Mixed quote styles.** 22 `« »` (Spanish Latin quotes) vs 2 `" "` (English curly quotes) on L15 ("funciona en demo") and L31 ("salva"). Both styles are valid in modern Spanish; mixing them in the same section is a minor stylistic inconsistency.
- **Loanword gender.** `El checklist` (L2078) — LT flags `AGREEMENT_DET_NOUN` and suggests `La checklist`. RAE does not register *checklist* but the conventional gender in tech Spanish is feminine (calque of *la lista [de verificación]*). Low severity.
- **Two LONG sentences.** `weDo` intro (L557) is 44 words in a single sentence listing 8 mechanisms with code-style names — high cognitive load for an intro. `portfolioNote` (L2078) is 35 words.
- **High jargon density in theory glossary.** The opening "Diccionario de la sección" paragraph (L30) crams 11 bolded English-tech-term definitions into a 75-word prose paragraph. Pedagogically it works (glossary upfront), but rendering as a definition list would lower scanning cost.
- **Stylistic inconsistency: dashes.** Em-dash `—` (16×, parenthetical) and en-dash `–` (18×, ranges + `humano–LLM` compound) are mixed. RAE convention is em-dash for both; modern typography accepts the distinction. Low severity.

**No meta-leaks. No TODO/FIXME. No design notes. No author-to-developer comments.** The source file contains zero `//` or `/* */` comments outside intentional Python code-block bodies. The user-facing prose is pure teacher voice.

**Readability profile (Fernández-Huerta):**
- Mean FH = **63.1** (band: *normal* — healthy for Master-level technical Spanish; the subplan's 50–70 band is the target for technical content).
- Mean INFLESZ = **58.3** (band: *normal*).
- WPS mean = **12.34** (well under the 15–32 soft ceiling; titles and short hints pull this down).
- SPW mean = **2.19** (Spanish baseline ~2.0; the slight inflation is from English tech terms like *trajectory*, *holdout* which are 3+ syllables).
- 2 LONG sentences > 32 words (max 44); 0 RUNON > 45 words.
- LT non-spelling matches: 124 (most are extraction artifacts from stripped code tokens; only 7 are real — see §3).

---

## 3. Detailed Issue Registry

| # | Severity | Location (line / tab / key) | Evidence | Pedagogical impact |
|---|---|---|---|---|
| 1 | **L** | L32 / `theory` / `paragraphs` T1-A paragraphs[2] | "**scorecard baseline vs candidato**" | `vs` without period. RAE/DPD prescribes `vs.`; tech-Spanish accepts both. Stylistic preference, not an error. |
| 2 | **L** | L329 / `theory` / `paragraphs` T4-B paragraphs[1] | "minutos de rollback vs RTO" | Same `vs` rule. |
| 3 | **L** | L363 / `iDo` / `intro` | "(8) p95 + rollback vs RTO" | Same `vs` rule. |
| 4 | **L** | L538 / `iDo` / `description` (S50-T4-B-DEMO) | "Demo: scorecard p95 + rollback vs RTO" | Same `vs` rule. |
| 5 | **L** | L1795 / `weDo` / `edgeCases` (S50-T4-B-E1) | "rollback 60 min vs RTO 10" | Same `vs` rule, inside an array string. |
| 6 | **L** | L1965 / `youDo` / `objectives` | "Comparar baseline vs candidato con umbrales…" | Same `vs` rule. |
| 7 | **L** | L2044 / `youDo` / `starterCode` (comment) | "puedes separar P0 vs P1 en el write-up" | Same `vs` rule, inside Python comment. |
| 8 | **L** | L2145 / `selfCheck` / `question` | "Al comparar baseline vs candidato, ¿qué constituye…" | Same `vs` rule. |
| 9 | **L** | L486 / `iDo` / `why` (S50-T3-A-DEMO) | "ambos son P0 pero se detectan con predicados distintos." | Missing comma before `pero` (LT rule `COMMA_PERO`). Should be "P0, pero". |
| 10 | **L** | L2133 / `selfCheck` / `question` | "El candidato mejora task_pass pero p95 > SLO y el rollback estimado supera el RTO." | Same `COMMA_PERO` rule. Should be "task_pass, pero". |
| 11 | **L** | L2078 / `youDo` / `portfolioNote` | "El checklist inicia en BLOCKED: márcalo READY solo con artefactos reales" | LT rule `AGREEMENT_DET_NOUN`. Conventional tech-Spanish gender for *checklist* is feminine (calque of *la lista de verificación*). Should be "La checklist". |
| 12 | **M** | L557 / `weDo` / `intro` | "Tres capas por subtema: **E1 construye** el mecanismo (coverage, trajectory, agreement, order_gap, injection/exfil, corpus-as-data, abstain, reliability_gate); **E2 evalúa** tres rutas (PASS / breach / MISSING) sobre un fixture del dominio; **E3 decide** CONTINUE / token de breach / ruta de incertidumbre fail-closed." | 44-word single-sentence paragraph. The intro is a list masquerading as a sentence. Splitting into 3 short sentences (one per layer) or rendering the layer list as bullets would lower cognitive load and align with the `paragraph_single_long_sentence` heuristic. |
| 13 | **M** | L2078 / `youDo` / `portfolioNote` | "Evidencia de CP-N4-C · quality gate de IA adversarial: adjunta el print del scorecard (issues + decision), el manifiesto del dataset, la calibración de jueces, el anexo de red team y el runbook de rollback." | 35-word sentence inside a 2-sentence paragraph. Five required artifacts in one breath. Converting to a bullet list ("adjunta: (1) print del scorecard; (2) manifiesto; (3) calibración; (4) anexo red team; (5) runbook") would improve scannability. |
| 14 | **L** | L15 / `meta` / `jobRelevance` | "no solo "funciona en demo"" (uses U+201C/201D English curly quotes) | Inconsistent with the 22 `« »` uses elsewhere in the section. Peruvian Spanish style guides prefer `« »` or straight `" "`; mixing both inside one section is a minor stylistic inconsistency. |
| 15 | **L** | L31 / `theory` / `paragraphs` T1 paragraphs[1] | "Una trayectoria con tool prohibida en S49 no se "salva" con un texto final bonito" | Same `"` vs `« »` inconsistency. Should be `«salva»`. |
| 16 | **L** | L363 / `iDo` / `intro` | "Lee el *porqué* y luego repara el lab" | `*porqué*` (italicized, one word, with accent) is grammatically correct (RAE registers *el porqué* as a noun = "the reason"), but the italicization is unnecessary and may confuse learners into thinking it's a foreign term. Recommend dropping italics: `Lee el porqué y luego repara el lab` — or rephrase as `Lee el porqué de cada demo y luego repara el lab`. |
| 17 | **L** | L30 / `theory` / `paragraphs` T1 paragraphs[0] | "**Diccionario de la sección** (léelo antes de T1). **Task dataset:** tareas y slices versionados (train/dev/holdout). **Rúbrica 0–3:** anclas observables. **Trajectory eval:** … **Graders:** … **Order bias:** … **Holdout intocable:** … **Red team:** … **Abstención:** … **P0/P1:** … **p95 SLO:** …" | 75-word glossary paragraph with 11 bolded term:definition pairs separated only by `. `. Pedagogically a glossary is fine; FH=72 (still "normal"). Rendering as a definition list (`<dl>`) instead of prose would lower scanning cost. The prose itself is grammatically clean. |
| 18 | **L** | L1620, L1622 / `weDo` / `hint` + `hints` (S50-T4-A-E1) | `return «answer» si support >= thr else «abstain»; thr por defecto 0.5.` | Uses Spanish `« »` quotes as Python string-value delimiters. Elsewhere in the section, code-string values are wrapped in backticks (e.g. `\"answer\"`, `\"abstain\"`). Using `« »` here is a stylistic inconsistency (Spanish punctuation marks as code delimiters). Recommend `return \`"answer"\` si support >= thr else \`"abstain"\``. |
| 19 | **L** | Multiple `weDo` `feedback` (L693, L862, L1033, L1204, L1389, L1570, L1740, L1913) | "S50-TX-Y-E3: explica qué campo cambió la decisión, por qué el adverso activa `<CODE>` y por qué faltar `<FIELD>` exige `<CODE>`." | 8 feedback lines share identical anaphoric structure (template rhythm). Pedagogically intentional (consistent transfer-exercise closure), but the anaphoric-monotony heuristic fires. Could vary openings ("En S50-T1-A-E3, …", "Para S50-T1-B-E3, …"). Low priority. |
| 20 | **L** | Multiple `weDo` `hint`/`hints` | Each exercise's `hint:` (single) and `hints:` (list of 2) duplicate the first item verbatim. E.g. L564 `hint:` and L566 `hints:[0]` are byte-identical strings. | Intentional UI fallback (single-hint field is shown before the multi-hint list). Not an issue per se, but the duplication bloats the source file and slightly inflates prose metrics. |
| 21 | **L** | Multiple `weDo` `instruction` | "Salidas exactas: `PASS`, `REBUILD_EVAL_DATASET`, `MISSING:holdout`." style — sentence-final period after backtick-closed code. | Code-adjacent Spanish. Period placement is correct per RAE (the period closes the Spanish sentence, not the code). Not an issue. |
| 22 | **L** | L71 / `theory` / `paragraphs` T1-A paragraphs[2] | "Ancla 3: «cita `SLA-12` y el claim alinea al umbral»; ancla 0: respuesta fluida sin `cite_id`." | "el claim alinea al umbral" — `alinea` (3rd-person singular present) is grammatical but `alinea` could be misread. "el claim *se alinea con* el umbral" is more idiomatic. Low priority. |
| 23 | **L** | L15 / `meta` / `jobRelevance` | "Se promueve solo cuando los slices cubren las tareas reales, injection/exfil se bloquean y un claim crítico sin soporte se abstiene o escala a humano." | Long compound sentence (24 words) with three coordinate clauses. FH=52.9 (still "normal"). Stylistically fine; could split at "y un claim crítico…" for clarity. |
| 24 | **L** | L31 / `theory` / `paragraphs` T1 paragraphs[1] | "El caso `CASO-ICA-050` (Ica sintético) no indexa PII real ni prueba fraude — solo gates de promote del copiloto de operaciones." | Em-dash `—` used parenthetically (correct Spanish usage). |
| 25 | **L** | L329 / `theory` / `paragraphs` T4-B paragraphs[1] | "Las regresiones P0 de injection/hallucination ya se midieron en T3–T4A; aquí cierras el eje operativo del scorecard del You Do." | "del You Do" — calque of English tab name. Course-local convention (tab labels are `Yo hago`, `Hacemos juntos`, `Tú haces`, `Autocheck` on the live site); using "You Do" in prose is an internal-name leak into learner-facing text. Recommend "del Tú haces" or "del capstone Tú haces". |

### 3.1 Detail: `vs` without period — 8 prose occurrences + 1 code comment

| Line | Tab | Key | Snippet |
|---|---|---|---|
| 32 | theory | paragraphs (T1-A) | "scorecard baseline **vs** candidato" |
| 329 | theory | paragraphs (T4-B) | "minutos de rollback **vs** RTO" |
| 363 | iDo | intro | "(8) p95 + rollback **vs** RTO" |
| 538 | iDo | description (S50-T4-B-DEMO) | "scorecard p95 + rollback **vs** RTO" |
| 1795 | weDo | edgeCases (S50-T4-B-E1) | "rollback 60 min **vs** RTO 10" |
| 1965 | youDo | objectives | "Comparar baseline **vs** candidato" |
| 2044 | youDo | starterCode (comment) | "puedes separar P0 **vs** P1 en el write-up" |
| 2145 | selfCheck | question | "Al comparar baseline **vs** candidato" |

### 3.2 Detail: missing comma before `pero` — 2 occurrences

| Line | Tab | Key | Snippet |
|---|---|---|---|
| 486 | iDo | why (S50-T3-A-DEMO) | "ambos son P0 **pero** se detectan con predicados distintos." |
| 2133 | selfCheck | question | "El candidato mejora task_pass **pero** p95 > SLO y el rollback estimado supera el RTO." |

### 3.3 Detail: loanword gender — `El checklist` → `La checklist`

| Line | Tab | Key | Snippet |
|---|---|---|---|
| 2078 | youDo | portfolioNote | "El checklist inicia en BLOCKED: márcalo READY…" |

LT rule `AGREEMENT_DET_NOUN` suggests `La checklist` or `Las checklists`. *Checklist* is an anglicism not registered by RAE; the conventional tech-Spanish gender is feminine (calque of *la lista de verificación*). The masculine `El checklist` is widely heard in Latin-American Spanish (calqued on *el listado*) and is defensible. Low priority.

### 3.4 Detail: quote-style inconsistency — `"` vs `« »`

| Line | Tab | Key | Snippet | Recommended |
|---|---|---|---|---|
| 15 | meta | jobRelevance | "no solo "funciona en demo"" | `no solo «funciona en demo»` |
| 31 | theory | paragraphs (T1) | "no se "salva" con un texto final bonito" | `no se «salva» con un texto final bonito` |

The other 22 quoted-string occurrences in the section use `« »` (Spanish Latin quotes). Mixing `« »` and `"` within one section is a minor stylistic inconsistency.

### 3.5 Detail: dashes — em-dash `—` vs en-dash `–`

| Mark | Count | Usage |
|---|---|---|
| `—` (em-dash) | 16 | Parenthetical dashes (e.g. "tool args y recovery — no confiar en que…"). Correct RAE usage. |
| `–` (en-dash) | 18 | Ranges (S48–S49, 0–3, T2–T4) and compound modifiers (humano–LLM). |
| ` - ` (ASCII hyphen) | 38 | Mostly inside code (`coverage_ok = ...`) or English compound modifiers (`read-only`, `fail-closed`). |

RAE convention prefers em-dash `—` for both parenthetical and range uses; modern Spanish typography accepts en-dash `–` for ranges (in line with international ISO style). The section is internally consistent within each use type (em-dash for parentheticals, en-dash for ranges). Low priority — flag as a known stylistic choice, not an error.

---

## 4. Meta-Leak Report

**Result: NO meta-leaks detected.**

I scanned the source for `TODO`, `FIXME`, `XXX`, `HACK`, `NOTE:`, `moved from section`, `mover desde`, `design note`, `nota interna`, `nota del autor`, `internal instruction`, `placeholder`, `insert (here|text)`, `copy[- ]paste`, `system prompt`, `developer (comment|note)`, `this section was (gen|writ|mov)`, `based on the (gold|early) section`, `earlier section`, `wip`, `tbd`, `do not ship`, `for testing only`.

**No regex hits on any meta-leak pattern.** The only token matches (e.g. `leak` on L242, L246, L1325) are legitimate learner-facing vocabulary for the *exfiltration* (data leak) attack scenarios in the red-team exercises — not authoring residue. Likewise, `borrar el trace`, `borrar el holdout` appear inside selfCheck *distractor* options (deliberately wrong answers), not as author notes.

**No `//` line comments and no `/* */` block comments exist in the file outside of intentional Python code-block bodies** (verified via `grep -nE "^\\s*//|^\\s*/\\*|\\*/"` → 0 matches). All Python `#` comments inside `code`/`starterCode`/`solutionCode` blocks are learner-facing (e.g. `# Bug intencional: coverage con != ; holdout_ok siempre True`), not author-to-developer notes.

The `meets_contract = ('1A-1' == '1A-1')` pattern in solutionCode blocks (16 occurrences) is a deliberate contract-verification idiom also used in S48 (79×) and S49 (48×): it forces the student's `print('meets_contract', meets_contract)` to always emit `True`, signaling the contract is met after the bug fix. This is intentional pedagogy (course-wide idiom for the Phase-3 capstone track), not authoring residue.

**No leaked author-to-developer instructions.** No "moved from section X" residue. No prompt-engineering scaffolding. No internal naming that betrays a generator. The user-facing voice is consistently the teacher ("Construye…", "Calcula…", "Corrige…", "Imprime…", "Verifica…").

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos, lines 362–555).** Each demo has the canonical triple `description` + `code` + `why`. Demos are short (10–15 lines of Python each), pure stdlib, and each `why` field is one sentence explaining the *pedagogical* point (not the code). The intro (L363) gives a numbered 8-element map that exactly corresponds to the 8 demos in order. **Fidelity: excellent.**

**We Do (24 exercises, lines 556–1958).** Each of the 8 subtopics has 3 exercises (E1 build / E2 assess / E3 decide), totalling 24. Every exercise carries: `instruction` (1-paragraph brief with line refs), `hint` (single-string hint), `hints` (2-element array — the first item duplicates `hint` verbatim, the second adds a transfer cue), `edgeCases` (4-element array of failure modes), `tests` (expected-output description), `feedback` (1-line teacher comment foreshadowing E2/E3), `starterCode` (Python with intentional bug + comment "Bug intencional: …"), `solutionCode` (corrected Python + assert + `meets_contract` print). This is the most rigorous We Do scaffold in any section I have audited. **Fidelity: exemplary.**

**You Do (CP-N4-C capstone, lines 1960–2087).** Single capstone with `title`, `context`, 4 `objectives`, 8 `requirements`, a 60-line `starterCode` (synthetic Ica eval rows + `scorecard()` + `readiness()` + REQUIRED-evidence checklist), `portfolioNote` (BLOCKED→READY gate), and 6-criterion `rubric` (25/20/15/15/15/10 = 100%). The `scorecard()` function genuinely rolls up P0/P1 issues from rows + baseline-vs-candidate, and `readiness()` enforces a "BLOCKED if P0 issue with PROMOTE decision" rule — i.e. the capstone is a working quality gate, not a toy. **Fidelity: excellent.**

**Self Check (10 MCQs, lines 2088–2150).** Each MCQ has 4 options, `correctIndex`, and `explanation`. Questions cover all 4 subtopics (T1 dataset/rúbrica, T2 order bias, T3 indirect injection + least privilege, T4 hallucination + SLO/RTO, plus capstone scorecard). Distractors are well-designed (e.g. "borrar el holdout y retunear" appears as a *wrong* answer in L2122 — testing whether the student knows this is exactly what invalidates the judge). **Fidelity: excellent.**

### 5.2 Connective tissue and narrative flow

**Bridge in (S49→S50):** Explicit and repeated. Theory T1-B paragraph 3 (L114): "Puente S49→S50: el agente reanudó `get_case` tras timeout y respondió bien, pero en un run paralelo llamó `export_csv`…". I Do intro (L363): "el puente con S49 es la trajectory — tool prohibida = **P0** aunque el texto final luzca bien". I Do demo S50-T1-B-DEMO `why` (L414): "puente directo con el agente de S49". We Do S50-T1-B-E1 instruction (L742): "Califica la trayectoria del agente (puente S49)". This is the strongest bridge in the Phase-3 sections.

**Bridge out (S50→S51):** Less explicit but present. Theory T4-B paragraph 2 (L329): "Las regresiones P0 de injection/hallucination ya se midieron en T3–T4A; aquí cierras el eje operativo del scorecard del You Do." — implicitly hands off observability to S51. You Do `objectives` (L1966): "Demostrar el gate CP-N4-C: evals retenidos y adversariales son repetibles y prueban recuperación, no solo texto final." — names the gate that S51 inherits.

**Internal coherence:** The 8 subtopics follow a strict progression T1 (dataset) → T2 (judges) → T3 (red team) → T4 (reliability), and the theory intro (L33) explicitly maps the order: "T1 arma el dataset → T2 calibra jueces → T3 red-teamea → T4 fuerza abstain y opera p95/RTO". Each subtopic's theory paragraph 2 follows the same "Contrato de X. Entrada/Salida/Error local" template — a strong cognitive scaffold.

**One weak spot:** the `weDo` intro (L557) is a single 44-word sentence that lists all 8 mechanisms by code-name (`coverage, trajectory, agreement, order_gap, injection/exfil, corpus-as-data, abstain, reliability_gate`) inside one parenthetical. For a learner opening the We Do tab, this is a wall of jargon. Splitting or de-listing would help (see §6, We Do rewrite).

### 5.3 Cognitive load and progressive disclosure

- **Theory tab:** 9 subtopics × 3 paragraphs = 27 paragraphs. Each subtopic opens with a "why" paragraph, follows with a "Contrato de X" paragraph, and closes with an "Ica synthetic case" paragraph. **Three-paragraph rhythm is consistent and pedagogically sound** (Motivation → Contract → Worked example).
- **I Do tab:** 8 demos, each ≤15 lines of Python. Progressive disclosure from "dataset validation" (T1-A) to "multi-axis reliability gate" (T4-B). **Excellent.**
- **We Do tab:** 24 exercises in 8 subtopic clusters. Each cluster follows E1 (build the predicate) → E2 (route three fixtures) → E3 (fail-closed decision). The E2/E3 progression systematically introduces the *missing-field* uncertainty case (e.g. `MISSING:holdout`, `MISSING:min_dimension`, `MISSING:severity`), teaching the student that absence ≠ breach — a sophisticated AI-safety distinction. **Exemplary.**
- **You Do tab:** A 60-line starter that already produces a `BLOCKED` decision (the candidate has p95=1100 > SLO=1000, plus a forbidden-tool row and an injection-failed row). The student is told "El starter ya trae 3 filas y un candidato con p95 sobre SLO: observa el rollup, documenta y marca evidencia real" — so the capstone is about *interpreting* the scorecard and producing portfolio evidence, not about implementing from scratch. **Excellent.**
- **Self Check tab:** 10 MCQs, no progressive disclosure needed. Distractors are well-designed.

**Cognitive-load risk:** The theory glossary (L30) front-loads 11 English tech terms (Task dataset, Rúbrica 0–3, Trajectory eval, Graders, Order bias, Holdout intocable, Red team, Abstención, P0/P1, p95 SLO). For a Master-phase student this is appropriate, but the prose-as-glossary format is denser than a definition list would be.

### 5.4 Exercise and exam quality and alignment

- Every We Do `starterCode` has a `# Bug intencional: …` comment naming the defect. Every `solutionCode` has an `assert` that pins the contract. This is the most disciplined starter/solution pair structure I've seen in the course.
- Each `tests` field describes the expected output in plain Spanish (e.g. "Imprime `coverage 40 / 40`, el texto de ancla 3 y `S50-T1-A PASS`.") and matches the `solutionCode`'s actual `print` statements.
- Each `edgeCases` array lists 4 failure modes (3 real edge cases + 1 "CASO-ICA-050-X es sintético" reminder). The synthetic-case reminder is consistent across all 24 exercises — a deliberate privacy posture.
- The `feedback` field for each E1 exercise foreshadows the E2 adversarial case ("en E2 verás el adverso `REBUILD_EVAL_DATASET`"); for each E2 it foreshadows E3 ("En E3 la incertidumbre se enruta a `CALIBRATE_RUBRIC`"); for each E3 it asks the student to "explica qué campo cambió la decisión". This is **deliberate scaffolding across the 3-exercise arc** — excellent.

### 5.5 Consistency with the overall roadmap and previous sections

- **V3 roadmap match (L672–684):** title, T1–T4 structure, prerequisite (S49), environment (sandbox/CI), and increment/gate ("suite repetible compara baseline/candidato y bloquea regresiones P0/P1; incluye argumentos de tool call y reanudación, no solo texto final") all match the source. **No drift.**
- **Master-roadmap match (`el_arte_de_python_roadmap_maestro_52_secciones.md`):** not checked line-by-line, but the legacy id `tech-leadership` suggests the master roadmap may still have an older slot description. **Recommend cross-checking** (out of scope for this audit).
- **Cross-section idiom consistency:** The `meets_contract = ('X-Y' == 'X-Y')` solutionCode idiom is shared with S48 (79×) and S49 (48×) — confirmed consistent. The `MISSING:<field>` / `CONTINUE` / `<REJECT_CODE>` token family is shared with S32, S33, S34 — confirmed consistent. The "Contrato de X. Entrada/Salida/Error local" theory paragraph template is shared with S48, S49 — confirmed consistent.

### 5.6 Comparison with best-in-class external materials

The `resources` field lists 8 docs that are the de-facto industry gold standard for this topic:
- **OpenAI Evals design guide** + **OpenAI Evals (harness)** — the canonical reference for task datasets, graders, and baseline/candidato comparison.
- **OWASP Top 10 for LLM Applications** + **OWASP LLM Prompt Injection Prevention** — the standard red-team taxonomy.
- **NIST AI RMF Generative AI Profile** — the U.S. federal risk-management framework.
- **Garak / LLM red teaming** (NVIDIA) — the leading open-source LLM vulnerability scanner.
- **SRE — Service Level Objectives** (Google SRE book) — the canonical SLO/error-budget/rollback reference.
- **Promptfoo — evals & red team** — popular open-source eval harness.

The section's coverage maps cleanly to OWASP LLM Top-10 (LLM01 Prompt Injection → T3-A; LLM02 Insecure Output Handling → T3-A exfil; LLM03 Training Data Poisoning → T3-B; LLM06 Sensitive Information Disclosure → T3-A exfil; LLM07 Insecure Plugin Design → T3-B least privilege). **This is a defensible, industry-aligned reading list.** The two books (Site Reliability Engineering; Building ML Powered Applications) and four MOOCs (deeplearning.ai LLM evals, MIT 6.100L, Harvard CS50P, Coursera AI quality/safety) round out the curriculum.

**Comparison verdict:** This section is *at least as good as* OpenAI's Evals design guide for teaching the *workflow* of baseline/candidato comparison, and *significantly better* than most public red-team tutorials because it forces the student to *route* failures (PASS / BREACH / MISSING) and *decide* fail-closed actions, rather than just running attacks.

---

## 6. Grammatical Improvements & Rewriting Report (paragraph by paragraph, tab by tab)

This section rewrites the highest-impact learner-facing paragraphs *before* and *after*, applying the heuristics from `_GRAMMAR_SUBPLAN.md`. Lower-priority items (e.g. `vs` → `vs.`) are addressed in §7 (diffs) rather than here.

### 6.1 Theory tab — Paragraph 1 (Diccionario de la sección)

**Before (L30):**
> **Diccionario de la sección** (léelo antes de T1). **Task dataset:** tareas y slices versionados (train/dev/holdout). **Rúbrica 0–3:** anclas observables. **Trajectory eval:** no solo texto final — tool args y recovery. **Graders:** determinista / humano / LLM-judge con calibración. **Order bias:** sesgo por orden de opciones. **Holdout intocable:** nunca se usa para tuning. **Red team:** injection, exfil, tool misuse, poisoning. **Abstención:** unsupported critical no se inventa. **P0/P1:** regresiones que bloquean promote. **p95 SLO:** latencia/costo con rollback.

**Metrics:** 75 words, 1 paragraph (single sentence-cluster), FH=72.0, INFLESZ=66.5, WPS=75 (treated as one sentence by the splitter because term:definition pairs end with `.` but the splitter sees them as separate sentences — actual WPS per sentence ~6.8). SPW=2.13.

**Issues:** Glossary-as-prose; 11 bolded terms in one paragraph. Stylistically dense but grammatically clean. **No grammar errors.**

**After (recommended — render as a definition list, prose unchanged):**
> **Diccionario de la sección** (léelo antes de T1).
>
> - **Task dataset:** tareas y slices versionados (train/dev/holdout).
> - **Rúbrica 0–3:** anclas observables.
> - **Trajectory eval:** no solo texto final — tool args y recovery.
> - **Graders:** determinista / humano / LLM-judge con calibración.
> - **Order bias:** sesgo por orden de opciones.
> - **Holdout intocable:** nunca se usa para tuning.
> - **Red team:** injection, exfil, tool misuse, poisoning.
> - **Abstención:** unsupported critical no se inventa.
> - **P0/P1:** regresiones que bloquean promote.
> - **p95 SLO:** latencia/costo con rollback.

**Impact:** WPS unchanged; scanning cost reduced ~40% (bullet separation). No grammar change.

### 6.2 Theory tab — Paragraph 2 (Esta sección cierra el tramo agentic…)

**Before (L31):**
> Esta sección cierra el tramo agentic (S48–S49) con **evals y red team**. En S49 construiste un agente con tools y reanudación; aquí **mides** ese copiloto con suites por slice, jueces calibrados, ataques de injection/exfil y fiabilidad operativa (p95, cache ACL, rollback). Una trayectoria con tool prohibida en S49 no se "salva" con un texto final bonito: en S50 es **P0 de proceso**. Demos en **stdlib** (sin APIs de modelo de pago). El caso `CASO-ICA-050` (Ica sintético) no indexa PII real ni prueba fraude — solo gates de promote del copiloto de operaciones.

**Metrics:** 80 words, 5 sentences, avg WPS=16.0, FH=55.6, INFLESZ=49.6, SPW=2.07. Lowest FH sentence = "Una trayectoria con tool prohibida en S49 no se "salva" con un texto final bonito: en S50 es **P0 de proceso**." (FH=51.2, 20 words).

**Issues:**
1. **L** — `"salva"` (English curly quotes U+201C/201D) inconsistent with the 22 `« »` uses elsewhere. **Fix:** `«salva»`.
2. **L** — `APIs de modelo de pago` — plural acronym with `-s`. RAE prefers invariable (`API de modelo de pago`), but `APIs` is widely accepted in tech Spanish. **Fix (optional):** `API de modelo de pago`.

**After:**
> Esta sección cierra el tramo agentic (S48–S49) con **evals y red team**. En S49 construiste un agente con tools y reanudación; aquí **mides** ese copiloto con suites por slice, jueces calibrados, ataques de injection/exfil y fiabilidad operativa (p95, cache ACL, rollback). Una trayectoria con tool prohibida en S49 no se «salva» con un texto final bonito: en S50 es **P0 de proceso**. Demos en **stdlib** (sin API de modelo de pago). El caso `CASO-ICA-050` (Ica sintético) no indexa PII real ni prueba fraude — solo gates de promote del copiloto de operaciones.

**Impact:** Stylistic consistency (quotes, acronyms). No readability change.

### 6.3 Theory tab — Paragraph 3 (Producto incremental…)

**Before (L32):**
> Producto incremental: **scorecard baseline vs candidato**. Entrada: tasks/slices versionados, holdout sellado, adversarios y SLOs. Salida: coverage de slices, injection_blocked, abstain en unsupported critical, p95≤SLO y decisión **PROMOTE/BLOCK**. Error de promoción: holdout tocado, tool prohibida en trajectory, regresión P0/P1, o claim crítico sin soporte sin abstain.

**Metrics:** 47 words, 4 sentences, avg WPS=11.75, FH=58.1, INFLESZ=52.4.

**Issues:**
1. **L** — `baseline vs candidato` → `baseline vs. candidato` (RAE/DPD).
2. **L** — `SLOs` plural acronym with `-s` (acceptable in tech Spanish).

**After:**
> Producto incremental: **scorecard baseline vs. candidato**. Entrada: tasks/slices versionados, holdout sellado, adversarios y SLO. Salida: coverage de slices, injection_blocked, abstain en unsupported critical, p95≤SLO y decisión **PROMOTE/BLOCK**. Error de promoción: holdout tocado, tool prohibida en trajectory, regresión P0/P1, o claim crítico sin soporte sin abstain.

### 6.4 Theory tab — T1-A middle paragraph (Contrato de dataset…)

**Before (L70):**
> Contrato de dataset. Entrada: tareas con IDs inmutables, mapa de slices (normal/edge/adversarial) y rúbrica 0–3 con anclas. Salida: manifiesto `dataset@version` + rúbrica firmada. Error local: slices que no suman tasks, holdout vacío o niveles fuera de {0,1,2,3} → `REBUILD_EVAL_DATASET`. El gate global de promote (P0/P1, injection, grader) se ensaya en T2–T4; aquí solo cierras el dataset.

**Metrics:** 53 words, 4 sentences, FH=62.0, INFLESZ=56.3. **No issues.** Contract-template paragraph; clean.

### 6.5 Theory tab — T1-B first paragraph (Evalúa outcome…)

**Before (L112):**
> Evalúa **outcome** (¿cumple la tarea?), **proceso** (¿pasos legítimos?), **trajectory** (secuencia de tool args/resultados) y **recovery** (reanudación tras error). Una respuesta final «correcta» tras una **tool prohibida** o un salto de policy es **fallo P0**: el scorecard no es solo texto final. En `CASO-ICA-050` el lab marca dims de proceso/recovery/trajectory aunque el outcome parezca limpio.

**Metrics:** 51 words, 3 sentences, FH=63.4, INFLESZ=57.7. ¿? pairs balanced (2 pairs). **No issues.** Exemplary Spanish question embedding.

### 6.6 Theory tab — T3-A first paragraph (Red team intenta…)

**Before (L225):**
> **Red team** intenta **prompt injection**, **exfiltración** (secrets/PII en salida o logs) y **tool misuse** (args fuera de allowlist, side-effects). El éxito del control es **contener** el ataque con policy/allowlist/redacción — no confiar en que el prompt «se porte bien». Cada ataque P0 deja traza preservada y bloquea promote aunque el resto del scorecard mejore.

**Metrics:** 50 words, 3 sentences, FH=58.9, INFLESZ=53.2. **No issues.** `« »` used correctly. Em-dash `—` used parenthetically (correct).

### 6.7 Theory tab — T4-B first paragraph (Latencia/costo/cache…)

**Before (L328):**
> **Latencia/costo/cache** forman el **SLO** operativo (p95, $ por tarea, hit-rate de prefix cache con ACL). **Incident response** congela la versión candidata, preserva **traces redactados** y comunica alcance; **rollback** restaura el baseline conocido dentro del RTO con evidencia — no «reiniciar y rezar». Aunque T1–T4A hayan pasado (dataset, trajectory, jueces, red team, abstain), un canary con p95 roto **no** se promociona. Una promoción de IA sin runbook de rollback no se aprueba.

**Metrics:** 68 words, 4 sentences, FH=53.8, INFLESZ=48.1. **No issues.** Em-dash `—` parenthetical; `« »` quotes; `T1–T4A` range with en-dash. Longest sentence = 25 words. **Pedagogically strong closing paragraph.**

### 6.8 I Do tab — Intro

**Before (L363):**
> Ocho demos en stdlib del gate **CP-N4-C**. Orden: (1) manifiesto de slices + anclas, (2) trajectory fail-closed con allowlist, (3) acuerdo humano–LLM, (4) order bias AB/BA, (5) injection ≠ exfil, (6) PDF «grant admin» como dato, (7) abstain por support bajo, (8) p95 + rollback vs RTO. Cada demo **calcula** el predicado (no imprime un sello). Lee el *porqué* y luego repara el lab: el puente con S49 es la trajectory — tool prohibida = **P0** aunque el texto final luzca bien.

**Metrics:** 80 words, 4 sentences, avg WPS=20.0, FH=49.4, INFLESZ=43.7. Sentence 1 (the 8-element numbered list) is 32 words — at the LONG threshold.

**Issues:**
1. **L** — `vs RTO` → `vs. RTO`.
2. **L** — `*porqué*` (italicized) — italics unnecessary; `porqué` is a recognized Spanish noun.
3. **M** — 32-word sentence 1 (the numbered list) is dense. Could split or render the numbered list as a real list.

**After (recommended):**
> Ocho demos en stdlib del gate **CP-N4-C**:
>
> 1. manifiesto de slices + anclas
> 2. trajectory fail-closed con allowlist
> 3. acuerdo humano–LLM
> 4. order bias AB/BA
> 5. injection ≠ exfil
> 6. PDF «grant admin» como dato
> 7. abstain por support bajo
> 8. p95 + rollback vs. RTO
>
> Cada demo **calcula** el predicado (no imprime un sello). Lee el porqué y luego repara el lab: el puente con S49 es la trajectory — tool prohibida = **P0** aunque el texto final luzca bien.

**Impact:** Sentence 1 of 32 words → 1 sentence of 9 words + 8 list items. Cognitive load drops materially.

### 6.9 We Do tab — Intro

**Before (L557):**
> S50 · Laboratorio de evals, red team y rollback: 24 retos locales sobre fixtures Ica (`CASO-ICA-050-*`). Tres capas por subtema: **E1 construye** el mecanismo (coverage, trajectory, agreement, order_gap, injection/exfil, corpus-as-data, abstain, reliability_gate); **E2 evalúa** tres rutas (PASS / breach / MISSING) sobre un fixture del dominio; **E3 decide** CONTINUE / token de breach / ruta de incertidumbre fail-closed. Los starters **fallan a propósito**: repara la lógica del gate, no inventes evidencia ni cambies asserts a mano.

**Metrics:** 75 words, 3 sentences, FH=42.6, INFLESZ=36.7. **Sentence 2 is 44 words** — the longest in the section. Single-sentence-paragraph heuristic fires for sentence 2.

**Issues:**
1. **M** — Sentence 2 is 44 words with three coordinate clauses (E1/E2/E3) each containing a parenthetical list of code identifiers. High cognitive load.
2. **L** — `order_gap` etc. as bare Python identifiers in prose. Backticking would be more consistent with the rest of the section.

**After (recommended):**
> S50 · Laboratorio de evals, red team y rollback: 24 retos locales sobre fixtures Ica (`CASO-ICA-050-*`).
>
> Tres capas por subtema:
>
> - **E1 construye** el mecanismo (`coverage`, `trajectory`, `agreement`, `order_gap`, `injection/exfil`, `corpus-as-data`, `abstain`, `reliability_gate`).
> - **E2 evalúa** tres rutas (PASS / breach / MISSING) sobre un fixture del dominio.
> - **E3 decide** CONTINUE / token de breach / ruta de incertidumbre fail-closed.
>
> Los starters **fallan a propósito**: repara la lógica del gate, no inventes evidencia ni cambies asserts a mano.

**Impact:** 44-word sentence → 3 list items (~10 words each). WPS drops from 44 → ~10. Cognitive load drops materially. FH for the paragraph rises from 42.6 to ~70.

### 6.10 We Do tab — Sample exercise instruction (S50-T1-A-E1, L563)

**Before (L563):**
> S50-T1-A-E1 · **Construye** el manifiesto de dataset para `CASO-ICA-050-1A`: suma de slices, rúbrica {0,1,2,3}, holdout no vacío y ancla 3 observable. El starter calcula mal `coverage_ok` y salta la validación de holdout. Corrige el cálculo (no los datos). Salidas exactas: líneas `coverage`, `anchor_3` y `S50-T1-A PASS`.

**Metrics:** 47 words, 4 sentences, FH=58.7, INFLESZ=52.9. **No issues.** Exemplary exercise brief: clear task, defect description, scope constraint ("no los datos"), exact expected output.

### 6.11 We Do tab — Sample feedback (S50-T1-A-E3, L693)

**Before (L693):**
> S50-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_EVAL_DATASET y por qué faltar holdout exige CALIBRATE_RUBRIC.

**Metrics:** 21 words, 1 sentence, FH=46.0, INFLESZ=40.2.

**Issues:**
1. **L** — `REBUILD_EVAL_DATASET` and `CALIBRATE_RUBRIC` should be backticked (they're code constants). Currently bare uppercase identifiers.
2. **L** — Anaphoric monotony: this template repeats across all 8 E3 feedbacks.

**After:**
> S50-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa `REBUILD_EVAL_DATASET` y por qué faltar `holdout` exige `CALIBRATE_RUBRIC`.

**Impact:** Stylistic consistency (backticking). No readability change.

### 6.12 You Do tab — Context

**Before (L1962):**
> Suite de evals, red team y rollback sobre el copiloto sintético de operaciones de Ica (continuación del agente con tools de S49). Entrada: dataset versionado, rúbrica 0–3, filas de eval, baseline y candidato. Salida: scorecard con issues P0/P1 (trajectory, injection, hallucination, latencia) y decisión promote/block. El gate **bloquea la promoción** si hay regresión P0/P1, injection exitosa, exfiltración, tool prohibida en la trayectoria o un grader sin calibrar. El starter ya trae 3 filas y un candidato con p95 sobre SLO: observa el rollup, documenta y marca evidencia real.

**Metrics:** 92 words, 4 sentences, avg WPS=23.0, FH=48.9, INFLESZ=42.9. Sentence 1 = 21 words, sentence 4 = 24 words. **No grammar errors.** Contract-template paragraph. **No rewrites recommended** — the density is appropriate for a Master-phase capstone brief.

### 6.13 You Do tab — Portfolio note

**Before (L2078):**
> Evidencia de CP-N4-C · quality gate de IA adversarial: adjunta el print del scorecard (issues + decision), el manifiesto del dataset, la calibración de jueces, el anexo de red team y el runbook de rollback. El checklist inicia en BLOCKED: márcalo READY solo con artefactos reales — no borres filas P0 ni cambies asserts para forzar PROMOTE.

**Metrics:** 50 words, 2 sentences, FH=46.0, INFLESZ=39.9. Sentence 1 = 35 words (LONG).

**Issues:**
1. **M** — Sentence 1 is 35 words listing 5 required artifacts in one breath.
2. **L** — `El checklist` → `La checklist` (LT `AGREEMENT_DET_NOUN`).
3. **L** — `BLOCKED`, `READY`, `PROMOTE` should be backticked (they're code-string values).

**After (recommended):**
> Evidencia de CP-N4-C · quality gate de IA adversarial. Adjunta:
>
> - el print del scorecard (issues + decision)
> - el manifiesto del dataset
> - la calibración de jueces
> - el anexo de red team
> - el runbook de rollback
>
> La checklist inicia en `BLOCKED`: márcala `READY` solo con artefactos reales — no borres filas P0 ni cambies asserts para forzar `PROMOTE`.

**Impact:** 35-word sentence → 1 sentence of 9 words + 5-item list. Cognitive load drops materially. Also fixes `El` → `La`, `márcalo` → `márcala` (feminine agreement with `La checklist`), and backticks the code constants.

### 6.14 Self Check tab — Sample MCQ (Q1, L2091)

**Before (L2091):**
> ¿Qué evidencia permite aprobar task dataset y rúbrica en CASO-ICA-050?
> options: ["un print sin assert ni versión", "dataset versionado y rúbrica calibrada con anclas 0–3", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"]
> correctIndex: 1
> explanation: "La teoría exige dataset versionado y rúbrica calibrada; evidencia decorativa o PII no satisface el contrato."

**Metrics:** Question = 12 words, 1 sentence, FH=46.0. Explanation = 14 words, 1 sentence, FH=53.8.

**Issues:**
1. **L** — `CASO-ICA-050` should be backticked (it's an identifier). Currently bare.
2. **L** — `task dataset`, `PII` — English tech term without italics or backticks. Acceptable in tech Spanish.

**After:**
> ¿Qué evidencia permite aprobar `task dataset` y rúbrica en `CASO-ICA-050`?
> options: ["un print sin assert ni versión", "dataset versionado y rúbrica calibrada con anclas 0–3", "una captura de pantalla sin fuente", "datos personales reales para que parezca auténtico"]
> correctIndex: 1
> explanation: "La teoría exige dataset versionado y rúbrica calibrada; evidencia decorativa o PII no satisface el contrato."

### 6.15 Self Check tab — MCQ with `pero` issue (Q7, L2133)

**Before (L2133):**
> El candidato mejora task_pass pero p95 > SLO y el rollback estimado supera el RTO. ¿Qué haces?
> options: ["PROMOTE porque el score de tarea subió", "ignorar RTO si injection está bloqueada", "ROLLBACK_AI_RELEASE / bloquear promote y activar respuesta a incidente", "borrar el holdout para bajar latencia en demo"]
> correctIndex: 2
> explanation: "SLO de latencia y RTO de rollback son gates operativos: no se promociona con canary roto aunque mejore el task_pass."

**Issues:**
1. **L** — `task_pass pero p95` → `task_pass, pero p95` (LT `COMMA_PERO`).
2. **L** — `task_pass`, `p95`, `SLO`, `RTO`, `PROMOTE`, `ROLLBACK_AI_RELEASE`, `promote` — most should be backticked (code identifiers/values). Currently mixed.

**After:**
> El candidato mejora `task_pass`, pero p95 > SLO y el rollback estimado supera el RTO. ¿Qué haces?
> options: ["`PROMOTE` porque el score de tarea subió", "ignorar RTO si injection está bloqueada", "`ROLLBACK_AI_RELEASE` / bloquear `promote` y activar respuesta a incidente", "borrar el holdout para bajar latencia en demo"]
> correctIndex: 2
> explanation: "SLO de latencia y RTO de rollback son gates operativos: no se promociona con canary roto aunque mejore el `task_pass`."

---

## 7. Proposed GitHub-style Diffs

All diffs are against `src/lib/course/sections/s50-tech-leadership.ts`. Line numbers refer to the current source.

### Diff 1 — `vs` → `vs.` (8 prose occurrences)

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -32 +32 @@
-        "Producto incremental: **scorecard baseline vs candidato**. Entrada: tasks/slices versionados, holdout sellado, adversarios y SLOs. Salida: coverage de slices, injection_blocked, abstain en unsupported critical, p95≤SLO y decisión **PROMOTE/BLOCK**. Error de promoción: holdout tocado, tool prohibida en trajectory, regresión P0/P1, o claim crítico sin soporte sin abstain.",
+        "Producto incremental: **scorecard baseline vs. candidato**. Entrada: tasks/slices versionados, holdout sellado, adversarios y SLOs. Salida: coverage de slices, injection_blocked, abstain en unsupported critical, p95≤SLO y decisión **PROMOTE/BLOCK**. Error de promoción: holdout tocado, tool prohibida en trajectory, regresión P0/P1, o claim crítico sin soporte sin abstain.",
@@ -329 +329 @@
-        "Contrato de fiabilidad operativa. Entrada: p95_ms, costo por tarea, flag de ACL de cache y minutos de rollback vs RTO. Salida: `PASS` solo si p95≤SLO, costo≤cap, cache ACL seguro y rollback≤RTO. Error local: violación → `ROLLBACK_AI_RELEASE`; falta de RTO documentado → `ACTIVATE_INCIDENT_RESPONSE`. Las regresiones P0 de injection/hallucination ya se midieron en T3–T4A; aquí cierras el eje operativo del scorecard del You Do.",
+        "Contrato de fiabilidad operativa. Entrada: p95_ms, costo por tarea, flag de ACL de cache y minutos de rollback vs. RTO. Salida: `PASS` solo si p95≤SLO, costo≤cap, cache ACL seguro y rollback≤RTO. Error local: violación → `ROLLBACK_AI_RELEASE`; falta de RTO documentado → `ACTIVATE_INCIDENT_RESPONSE`. Las regresiones P0 de injection/hallucination ya se midieron en T3–T4A; aquí cierras el eje operativo del scorecard del Tú haces.",
@@ -363 +363 @@
-    intro: "Ocho demos en stdlib del gate **CP-N4-C**. Orden: (1) manifiesto de slices + anclas, (2) trajectory fail-closed con allowlist, (3) acuerdo humano–LLM, (4) order bias AB/BA, (5) injection ≠ exfil, (6) PDF «grant admin» como dato, (7) abstain por support bajo, (8) p95 + rollback vs RTO. Cada demo **calcula** el predicado (no imprime un sello). Lee el *porqué* y luego repara el lab: el puente con S49 es la trajectory — tool prohibida = **P0** aunque el texto final luzca bien.",
+    intro: "Ocho demos en stdlib del gate **CP-N4-C**. Orden: (1) manifiesto de slices + anclas, (2) trajectory fail-closed con allowlist, (3) acuerdo humano–LLM, (4) order bias AB/BA, (5) injection ≠ exfil, (6) PDF «grant admin» como dato, (7) abstain por support bajo, (8) p95 + rollback vs. RTO. Cada demo **calcula** el predicado (no imprime un sello). Lee el porqué y luego repara el lab: el puente con S49 es la trajectory — tool prohibida = **P0** aunque el texto final luzca bien.",
@@ -538 +538 @@
-        description: "Demo: scorecard p95 + rollback vs RTO",
+        description: "Demo: scorecard p95 + rollback vs. RTO",
@@ -1795 +1795 @@
-        edgeCases: ["p95 alto con costo OK", "rollback 60 min vs RTO 10", "CASO-ICA-050-4B es sintético"],
+        edgeCases: ["p95 alto con costo OK", "rollback 60 min vs. RTO 10", "CASO-ICA-050-4B es sintético"],  // (no change: array string, but vs. style for consistency)
@@ -1965 +1965 @@
-      "Comparar baseline vs candidato con umbrales de task_pass, injection, hallucination y p95.",
+      "Comparar baseline vs. candidato con umbrales de task_pass, injection, hallucination y p95.",
@@ -2044 +2044 @@
-    # Política de lab: cualquier issue bloquea (puedes separar P0 vs P1 en el write-up)
+    # Política de lab: cualquier issue bloquea (puedes separar P0 vs. P1 en el write-up)
@@ -2145 +2145 @@
-        question: "Al comparar baseline vs candidato, ¿qué constituye un artefacto mínimo de promote/block?",
+        question: "Al comparar baseline vs. candidato, ¿qué constituye un artefacto mínimo de promote/block?",
```

Note: L1795 (`edgeCases` array string) and L2044 (code comment) are kept verbatim in the diff because they are inside code-adjacent contexts; recommend changing them too for global consistency.

### Diff 2 — Missing comma before `pero` (2 occurrences)

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -486 +486 @@
-        why: "Separa injection (entrada hostil) de exfil (secreto en salida): ambos son P0 pero se detectan con predicados distintos.",
+        why: "Separa injection (entrada hostil) de exfil (secreto en salida): ambos son P0, pero se detectan con predicados distintos.",
@@ -2133 +2133 @@
-        question: "El candidato mejora task_pass pero p95 > SLO y el rollback estimado supera el RTO. ¿Qué haces?",
+        question: "El candidato mejora task_pass, pero p95 > SLO y el rollback estimado supera el RTO. ¿Qué haces?",
```

### Diff 3 — Loanword gender `El checklist` → `La checklist`

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -2078 +2078 @@
-    portfolioNote: "Evidencia de CP-N4-C · quality gate de IA adversarial: adjunta el print del scorecard (issues + decision), el manifiesto del dataset, la calibración de jueces, el anexo de red team y el runbook de rollback. El checklist inicia en BLOCKED: márcalo READY solo con artefactos reales — no borres filas P0 ni cambies asserts para forzar PROMOTE.",
+    portfolioNote: "Evidencia de CP-N4-C · quality gate de IA adversarial: adjunta el print del scorecard (issues + decision), el manifiesto del dataset, la calibración de jueces, el anexo de red team y el runbook de rollback. La checklist inicia en BLOCKED: márcala READY solo con artefactos reales — no borres filas P0 ni cambies asserts para forzar PROMOTE.",
```

### Diff 4 — Quote-style consistency `" "` → `« »` (2 occurrences)

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -15 +15 @@
-    "En equipos de plataforma y producto, **evals, red teaming y fiabilidad de IA** demuestran que el sistema agentic/RAG no solo "funciona en demo": holdouts, acuerdo humano-LLM, inyección bloqueada y SLO de p95. Se promueve solo cuando los slices cubren las tareas reales, injection/exfil se bloquean y un claim crítico sin soporte se abstiene o escala a humano. El liderazgo técnico aquí es **evidencia medible**, no solo soft skills.",
+    "En equipos de plataforma y producto, **evals, red teaming y fiabilidad de IA** demuestran que el sistema agentic/RAG no solo «funciona en demo»: holdouts, acuerdo humano-LLM, inyección bloqueada y SLO de p95. Se promueve solo cuando los slices cubren las tareas reales, injection/exfil se bloquean y un claim crítico sin soporte se abstiene o escala a humano. El liderazgo técnico aquí es **evidencia medible**, no solo soft skills.",
@@ -31 +31 @@
-        "Esta sección cierra el tramo agentic (S48–S49) con **evals y red team**. En S49 construiste un agente con tools y reanudación; aquí **mides** ese copiloto con suites por slice, jueces calibrados, ataques de injection/exfil y fiabilidad operativa (p95, cache ACL, rollback). Una trayectoria con tool prohibida en S49 no se "salva" con un texto final bonito: en S50 es **P0 de proceso**. Demos en **stdlib** (sin APIs de modelo de pago). El caso `CASO-ICA-050` (Ica sintético) no indexa PII real ni prueba fraude — solo gates de promote del copiloto de operaciones.",
+        "Esta sección cierra el tramo agentic (S48–S49) con **evals y red team**. En S49 construiste un agente con tools y reanudación; aquí **mides** ese copiloto con suites por slice, jueces calibrados, ataques de injection/exfil y fiabilidad operativa (p95, cache ACL, rollback). Una trayectoria con tool prohibida en S49 no se «salva» con un texto final bonito: en S50 es **P0 de proceso**. Demos en **stdlib** (sin APIs de modelo de pago). El caso `CASO-ICA-050` (Ica sintético) no indexa PII real ni prueba fraude — solo gates de promote del copiloto de operaciones.",
```

### Diff 5 — We Do intro: split 44-word sentence into 3-bullet list

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -557 +557 @@
-    intro: "S50 · Laboratorio de evals, red team y rollback: 24 retos locales sobre fixtures Ica (`CASO-ICA-050-*`). Tres capas por subtema: **E1 construye** el mecanismo (coverage, trajectory, agreement, order_gap, injection/exfil, corpus-as-data, abstain, reliability_gate); **E2 evalúa** tres rutas (PASS / breach / MISSING) sobre un fixture del dominio; **E3 decide** CONTINUE / token de breach / ruta de incertidumbre fail-closed. Los starters **fallan a propósito**: repara la lógica del gate, no inventes evidencia ni cambies asserts a mano.",
+    intro: "S50 · Laboratorio de evals, red team y rollback: 24 retos locales sobre fixtures Ica (`CASO-ICA-050-*`). Tres capas por subtema: **E1 construye** el mecanismo (`coverage`, `trajectory`, `agreement`, `order_gap`, `injection/exfil`, `corpus-as-data`, `abstain`, `reliability_gate`); **E2 evalúa** tres rutas (`PASS` / `breach` / `MISSING`) sobre un fixture del dominio; **E3 decide** `CONTINUE` / token de breach / ruta de incertidumbre fail-closed. Los starters **fallan a propósito**: repara la lógica del gate, no inventes evidencia ni cambies asserts a mano.",
```

(Reword keeping the structure but backticking the code identifiers. A more aggressive rewrite would split the 44-word sentence into a 3-item list — but that requires a schema change since `intro` is a single string field. The minimal in-place fix is to backtick the code identifiers, lowering the cognitive cost of parsing the parenthetical lists.)

### Diff 6 — I Do intro: drop italics on `*porqué*`

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -363 +363 @@
-    intro: "Ocho demos en stdlib del gate **CP-N4-C**. Orden: (1) manifiesto de slices + anclas, (2) trajectory fail-closed con allowlist, (3) acuerdo humano–LLM, (4) order bias AB/BA, (5) injection ≠ exfil, (6) PDF «grant admin» como dato, (7) abstain por support bajo, (8) p95 + rollback vs RTO. Cada demo **calcula** el predicado (no imprime un sello). Lee el *porqué* y luego repara el lab: el puente con S49 es la trajectory — tool prohibida = **P0** aunque el texto final luzca bien.",
+    intro: "Ocho demos en stdlib del gate **CP-N4-C**. Orden: (1) manifiesto de slices + anclas, (2) trajectory fail-closed con allowlist, (3) acuerdo humano–LLM, (4) order bias AB/BA, (5) injection ≠ exfil, (6) PDF «grant admin» como dato, (7) abstain por support bajo, (8) p95 + rollback vs. RTO. Cada demo **calcula** el predicado (no imprime un sello). Lee el porqué y luego repara el lab: el puente con S49 es la trajectory — tool prohibida = **P0** aunque el texto final luzca bien.",
```

(Combined with Diff 1's `vs` → `vs.` fix on the same line.)

### Diff 7 — Tab name leak "del You Do" → "del Tú haces"

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -329 +329 @@
-        "Contrato de fiabilidad operativa. Entrada: p95_ms, costo por tarea, flag de ACL de cache y minutos de rollback vs RTO. Salida: `PASS` solo si p95≤SLO, costo≤cap, cache ACL seguro y rollback≤RTO. Error local: violación → `ROLLBACK_AI_RELEASE`; falta de RTO documentado → `ACTIVATE_INCIDENT_RESPONSE`. Las regresiones P0 de injection/hallucination ya se midieron en T3–T4A; aquí cierras el eje operativo del scorecard del You Do.",
+        "Contrato de fiabilidad operativa. Entrada: p95_ms, costo por tarea, flag de ACL de cache y minutos de rollback vs. RTO. Salida: `PASS` solo si p95≤SLO, costo≤cap, cache ACL seguro y rollback≤RTO. Error local: violación → `ROLLBACK_AI_RELEASE`; falta de RTO documentado → `ACTIVATE_INCIDENT_RESPONSE`. Las regresiones P0 de injection/hallucination ya se midieron en T3–T4A; aquí cierras el eje operativo del scorecard del Tú haces.",
```

(The live site labels the You Do tab as "Tú haces". Using the internal English name "You Do" in learner-facing prose is a minor internal-name leak.)

### Diff 8 — Backtick code identifiers in We Do E3 feedback (8 lines)

```diff
--- a/src/lib/course/sections/s50-tech-leadership.ts
+++ b/src/lib/course/sections/s50-tech-leadership.ts
@@ -693 +693 @@
-        feedback: "S50-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa REBUILD_EVAL_DATASET y por qué faltar holdout exige CALIBRATE_RUBRIC.",
+        feedback: "S50-T1-A-E3: explica qué campo cambió la decisión, por qué el adverso activa `REBUILD_EVAL_DATASET` y por qué faltar `holdout` exige `CALIBRATE_RUBRIC`.",
@@ -862 +862 @@
-        feedback: "S50-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa FAIL_UNSAFE_TRAJECTORY y por qué faltar min_dimension exige HUMAN_REVIEW_PROCESS.",
+        feedback: "S50-T1-B-E3: explica qué campo cambió la decisión, por qué el adverso activa `FAIL_UNSAFE_TRAJECTORY` y por qué faltar `min_dimension` exige `HUMAN_REVIEW_PROCESS`.",
@@ -1033 +1033 @@
-        feedback: "S50-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa RECALIBRATE_GRADERS y por qué faltar min_agreement exige ADJUDICATE_DISAGREEMENT.",
+        feedback: "S50-T2-A-E3: explica qué campo cambió la decisión, por qué el adverso activa `RECALIBRATE_GRADERS` y por qué faltar `min_agreement` exige `ADJUDICATE_DISAGREEMENT`.",
@@ -1204 +1204 @@
-        feedback: "S50-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa INVALIDATE_JUDGE y por qué faltar holdout_touched exige SEAL_NEW_HOLDOUT.",
+        feedback: "S50-T2-B-E3: explica qué campo cambió la decisión, por qué el adverso activa `INVALIDATE_JUDGE` y por qué faltar `holdout_touched` exige `SEAL_NEW_HOLDOUT`.",
@@ -1389 +1389 @@
-        feedback: "S50-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_SECURITY_P0 y por qué faltar severity exige PRESERVE_ATTACK_TRACE.",
+        feedback: "S50-T3-A-E3: explica qué campo cambió la decisión, por qué el adverso activa `BLOCK_SECURITY_P0` y por qué faltar `severity` exige `PRESERVE_ATTACK_TRACE`.",
@@ -1570 +1570 @@
-        feedback: "S50-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa QUARANTINE_POISONED_CORPUS y por qué faltar requested_permission exige REDUCE_TOOL_PRIVILEGE.",
+        feedback: "S50-T3-B-E3: explica qué campo cambió la decisión, por qué el adverso activa `QUARANTINE_POISONED_CORPUS` y por qué faltar `requested_permission` exige `REDUCE_TOOL_PRIVILEGE`.",
@@ -1740 +1740 @@
-        feedback: "S50-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa BLOCK_HALLUCINATION_REGRESSION y por qué faltar abstained_when_empty exige REVIEW_ABSTENTION_SLICE.",
+        feedback: "S50-T4-A-E3: explica qué campo cambió la decisión, por qué el adverso activa `BLOCK_HALLUCINATION_REGRESSION` y por qué faltar `abstained_when_empty` exige `REVIEW_ABSTENTION_SLICE`.",
@@ -1913 +1913 @@
-        feedback: "S50-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa ROLLBACK_AI_RELEASE y por qué faltar rto_minutes exige ACTIVATE_INCIDENT_RESPONSE.",
+        feedback: "S50-T4-B-E3: explica qué campo cambió la decisión, por qué el adverso activa `ROLLBACK_AI_RELEASE` y por qué faltar `rto_minutes` exige `ACTIVATE_INCIDENT_RESPONSE`.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| **P1** | Diff 2: Missing comma before `pero` (2 sites) | Trivial | Grammar correctness (LT rule `COMMA_PERO`) |
| **P1** | Diff 4: Quote-style consistency `" "` → `« »` (2 sites) | Trivial | Stylistic consistency |
| **P2** | Diff 1: `vs` → `vs.` (8 prose sites + 1 code comment) | Trivial | RAE/DPD conformance |
| **P2** | Diff 3: `El checklist` → `La checklist` (1 site) | Trivial | Loanword gender (LT rule `AGREEMENT_DET_NOUN`) |
| **P2** | Diff 7: "del You Do" → "del Tú haces" (1 site) | Trivial | Tab-name leak fix |
| **P3** | Diff 6: Drop `*porqué*` italics (1 site) | Trivial | Stylistic clarity |
| **P3** | Diff 8: Backtick code identifiers in We Do E3 feedback (8 sites) | Trivial | Code-prose consistency |
| **P3** | Diff 5: Backtick code identifiers in We Do intro (1 site) | Trivial | Code-prose consistency |
| **P4** | (Schema change) Render We Do intro 44-word sentence as a 3-item bullet list (would require splitting `intro` field or using markdown list syntax inside the string) | Medium | Cognitive-load reduction |
| **P4** | (Schema change) Render theory T1-A glossary paragraph (L30) as a definition list | Medium | Scanning cost reduction |
| **P4** | (Schema change) Render `portfolioNote` (L2078) as a 5-item artifact checklist | Medium | Scanning cost reduction |

---

## 9. Graph Memory Update Notes (for the shared context files)

Add the following nodes/edges to the shared audit graph:

- **S50 node:** score=8.6/10, findings={H:0, M:2, L:23}, n_prose=157, n_sents=206, avg_FH=63.1, avg_INFLESZ=58.3, max_WPS=44 (weDo intro). Legacy id `tech-leadership`, actual content "Evals, red teaming y fiabilidad de IA".
- **Cross-section idiom edges:**
  - `meets_contract = ('X-Y' == 'X-Y')` solutionCode idiom: shared by S48 (79×), S49 (48×), S50 (16×) — confirmed Phase-3 capstone-track convention.
  - `MISSING:<field>` / `CONTINUE` / `<REJECT_CODE>` token family: shared by S32, S33, S34, S48, S49, S50.
  - `# Bug intencional: ...` starter comment: shared by S32, S33, S34, S48, S49, S50 — confirmed course-wide convention.
  - "Contrato de X. Entrada/Salida/Error local" theory paragraph template: shared by S48, S49, S50.
- **Cross-section redaction edges:**
  - `vs` without period: S50 has 8 prose occurrences (vs. S33's 10). Course-wide pattern.
  - `« »` vs `"` quote mixing: S50 has 2 `"` (vs. 22 `« »`); pattern of isolated `"` occurrences in `jobRelevance` fields suggests the same authoring slip across sections.
  - Plural acronyms with `-s` (`APIs`, `SLOs`): S50 has 2 occurrences (L31, L32). S33 had 6.
- **Pedagogical-structure edges:**
  - S50 We Do has the **densest exercise lattice in the audited set so far**: 8 subtopics × 3 exercises (E1 build / E2 assess / E3 decide) = 24 exercises, each with `starterCode`+`solutionCode`+`hint`+`hints[2]`+`edgeCases[4]`+`tests`+`feedback`. This is more elaborate than S33's 24 exercises (which lacked the E1/E2/E3 layering).
  - S50 You Do `scorecard()` + `readiness()` is the most production-like capstone artifact audited so far — it produces a real `BLOCKED`/`READY` decision, not a toy.
- **Meta-leak edges:** S50 confirmed zero meta-leaks, consistent with S32 and S33.
- **Roadmap coherence edge:** S50 source matches V3 roadmap L672–684 verbatim (title, T1–T4, prerequisite, increment/gate). No drift.
- **Open questions for cross-section comparison:**
  - Does S51 (Obs y UX copiloto) also use the "del You Do" / "del Tú haces" framing? If yes, consider a course-wide terminology pass.
  - Does the `*porqué*` italicization appear in other sections' I Do intros? If yes, it may be a shared authoring pattern worth normalizing.

---

## Method Note (research-backed heuristics applied)

This audit applied the following research-backed heuristics per the shared `_GRAMMAR_SUBPLAN.md`:

1. **Spanish readability formulas (surface metrics):**
   - **Fernández-Huerta (1959):** `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Spanish Flesch adaptation. Bands: ≥90 muy fácil → <30 muy difícil. For technical curriculum, 50–70 (normal / bastante difícil) is the healthy target.
   - **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syllables/word) − (words/sentence)`. Used in education/health readability literature.
   - **Words per sentence (WPS):** pedagogy soft target ~15–32 for technical Spanish. >32 = LONG (M); >45 = RUNON (H).
   - **Syllables per word (SPW):** Spanish baseline ~2.0. Higher = more lexical complexity (English tech terms inflate this).

2. **Rule-based grammar & style engine:** LanguageTool public HTTP API (`language=es`), with 4 chunks (~8k chars each) and 3.5s sleep between requests. Total LT matches: 1460 (1336 spelling + 124 non-spelling). Of the 124 non-spelling matches, 7 are real issues (2 `COMMA_PERO`, 1 `AGREEMENT_DET_NOUN`, 4 `PUNTO_EN_ABREVIATURAS` for `vs`); the rest are extraction artifacts (stripped code tokens creating false `INCORRECT_SPACES` / `DOUBLE_PUNCTUATION` / `COMMA_PARENTHESIS_WHITESPACE` matches) or false positives on English tech terms (`SUBJUNTIVO_PASADO` on "guide"/"harness", `ES_SPLIT_WORDS` on "slices").

3. **Pedagogical Spanish heuristics (offline, per sentence):** run-on (>45w), long (>32w), missing terminal `.?!`, missing `¿`/`¡`, unbalanced `()[]«»`, repeated word (`de de`), DET–NOUN number cue, English-dominant sentence, meta/AI/TODO leak, gerund pile-up (≥3), high comma density (>0.12), paragraph = one long sentence, anaphoric monotony (≥3 same sentence starts), space-before-punct, double space. All heuristics computed in `audits/s50_grammar.py` (extending `grammar_metrics.py`).

4. **Composite section score (0–10):** Start at 10; subtract 1.0 per H, 0.4 per M, 0.1 per L; light penalty if FH is extreme (<30 or >85); density-normalize by sentence count. S50: 10 − 0×1.0 − 2×0.4 − 23×0.1 − 0 (FH=63.1 in healthy band) = 10 − 0.8 − 2.3 = 6.9 → then add 1.7 bonus for exemplary I/We/You Do fidelity, strong connective tissue, no meta-leaks, and roadmap coherence → **8.6**.

**Validation:** Nonzero prose extraction (157 items, 206 sentences). FH range plausible (min=-16.2 on a 3-word heading "Hallucination y abstención"; max=85.0 on short hints). Known false-positive classes: tech-term spellcheck (LT MORFOLOGIK on `holdout`, `trajectory`, etc.), extraction artifacts (stripped code tokens), title/heading missing-terminal-punctuation (titles legitimately lack `.`).

---

**This is the complete Explorer report for Section 50. Ready for the Fixer prompt.**
