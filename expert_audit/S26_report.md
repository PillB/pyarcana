# Section 26 — Curriculum Auditor Report

**Section under audit:** S26 — *"Orquestación y VP RPA + AI Analyst"* (a.k.a. `shortTitle: "VP RPA + AI Analyst"`)
**Phase:** 1 — Competente (sections 14–26). S26 is the Phase‑1 capstone closer (CP‑N2‑C).
**Live site (verified):** https://pillb.github.io/pyarcana/ — Section 26 in course order is "VP RPA + AI Analyst" with the exact tagline quoted below. Confirmed via `agent-browser read` of the home page (entry #26 lists the same tagline that appears in the source file).
**Repository source (verified):** `src/lib/course/sections/s26-integrator-phase1.ts` (1 666 lines, exported as `section26`).
**Index verification:** `src/lib/course/index.ts` declares the Phase‑1 sequence `section14 … section25, section26` — S26 is unambiguously the 26th section.
**Method note (grammar dimension):** Applied the shared subplan `_GRAMMAR_SUBPLAN.md` (Fernández‑Huerta 1959, Szigriszt‑Pazos/INFLESZ, WPS/SPW, offline pedagogical heuristics, LanguageTool `es` via public API). Heuristic metrics produced by a Python pipeline (`/tmp/s26_metrics.py` reusing `grammar_metrics.py`). LT run via `/tmp/s26_lt.py` on the concatenated prose (2 chunks ≤18 k chars each). 209 learner‑facing Spanish string values were extracted from the TS source via `/tmp/s26_extract2.py`; 202 paragraph‑like entries were scored (325 sentences total). Full raw metrics: `/home/z/my-project/audits/S26_metrics.json`, `/home/z/my-project/audits/S26_lt.json`, `/home/z/my-project/audits/S26_prose.txt`.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| `id` | `integrator-phase1` |
| `index` | 26 |
| `title` | "Orquestación y VP RPA + AI Analyst" |
| `shortTitle` | "VP RPA + AI Analyst" |
| `tagline` | "VP RPA + AI Analyst: Excel/sistema → validación → análisis → modelo/IA → informe → aprobación → borrador de correo. Demo con datos sintéticos, evidencia de cada estado y recuperación de fallas" |
| `estimatedHours` | 19 |
| `level` | Competente |
| `phase` | 1 |
| `icon` / `accentColor` | Award / blue→indigo gradient |
| Subtopics | S26‑T1‑A, S26‑T1‑B, S26‑T2‑A, S26‑T2‑B, S26‑T3‑A, S26‑T3‑B, S26‑T4‑A, S26‑T4‑B (8 subtopics) |
| Theory blocks | 8 (one per subtopic), each with heading + 3 paragraphs + Python `code` block + callout |
| `iDo` | 8 demos (one per subtopic) with description, `demo.py` (incl. `output`), and `why` |
| `weDo` | 24 exercises (3 per subtopic, kinds: guided / independent / transfer) |
| `youDo` | 1 capstone: title, context, 5 objectives, 6 requirements, `starterCode` skeleton, `portfolioNote`, rubric (6 weighted criteria + 1 bonus checklist) |
| `selfCheck` | 5 multiple‑choice questions with explanations |
| `resources` | 6 docs (Prefect ×2, Airflow, SRE Workbook, SRE Book, 12factor), 2 books, 4 courses |

Scope of the audit: all learner‑facing Spanish prose in the above fields, plus the Python code blocks as evidence of contract consistency. Pure Python `code`/`starterCode`/`solutionCode` bodies were excluded from grammar scoring (per the subplan) but were inspected for meta‑leak and pedagogical alignment.

---

## 2. Executive Summary of Quality

**Overall score: 8.4 / 10** — *Gold‑standard pedagogical structure with one real grammar defect, one English meta‑leak (the “Thinking aloud” idiom) and one high‑load run‑on glossary paragraph.*

**Verdict.** S26 is one of the strongest sections audited so far in the campaign. The I‑Do / We‑Do / You‑Do fidelity is exemplary: 8 demos map 1:1 to the 8 subtopics; 24 We‑Do exercises follow a strict 3‑tier `guided → independent → transfer` ladder with DEFECT‑marked starterCode, 3‑tier hints, edge cases, tests, and feedback; the You‑Do capstone includes a weighted rubric summing to 100 % plus a bonus regression checklist. Acronym density is the highest in the Phase‑1 sequence (DAG, HITL, DLQ, SLO, P0, CF‑2, CP‑N2‑C, RUC, E2E, RPA, OCR, SLA, TTL…) which is appropriate for an SRE/RPA capstone closer but produces one measurable run‑on. Real Spanish‑grammar defects are few: one `Y_E_O_U` agreement (`y interfaces` → `e interfaces`), one `AUTO_NO_SEPARADO` style slip (`auto‑etiqueta` → `autoetiqueta`), one prefix‑joining style issue (`anti‑fraude‑auto`), and several `COMMA_PARENTHESIS_WHITESPACE` cases in code‑adjacent lists (`(a,b),(b,c)` → `(a, b), (b, c)`). One English meta‑leak — the phrase *“Thinking aloud”* in 5 demo descriptions and 4 code comments — sits next to the Spanish *“pensando en voz alta”* used in the I‑Do intro; this is inconsistent and should be unified. The worst sentence is the “Diccionario rápido” glossary paragraph at 57 words / FH = 14.0; converting it to a table or bulleted definition list would resolve both the readability and the cognitive‑load issues. No TODO/FIXME/AI‑authorship leaks were found.

| Dimension | Score | Notes |
|---|---|---|
| Meta‑leak detection | 8.5 / 10 | One English idiom leak (*Thinking aloud*); CASO‑LIM‑026 tags visible to learner are arguably internal‑label residue but defensible. |
| Grammar (es‑PE) | 8.0 / 10 | 1 real agreement defect (`y` → `e`); 2 RAE style slips (`auto‑etiqueta`, `anti‑fraude‑auto`); several comma/paren typography issues inside code‑adjacent text. |
| Connective tissue / flow | 9.0 / 10 | Each block opens with a connector back to the previous (`Acabas de fijar el DAG…`, `Con el path estable…`, `Tras checkpoint y DLQ…`). Excellent. |
| I Do / We Do / You Do fidelity | 9.5 / 10 | 8 demos ↔ 8 subtopics ↔ 24 exercises (3 each); You‑Do rubric sums to 100 %. Gold‑standard. |
| Cognitive load & progressive disclosure | 7.5 / 10 | Acronym density per paragraph is very high; the “Diccionario rápido” glossary is a 57‑word run‑on; CF‑2/CP‑N2‑C references assume perfect recall of Phase‑0/1 capstone nomenclature. |
| Exercise / exam quality | 9.5 / 10 | DEFECT‑marked starterCode with intentional bug + 3‑tier hints + edgeCases + tests + feedback = excellent. |
| Roadmap consistency | 9.0 / 10 | S25 handoff (`ai_assist`), S14–S26 regression, CP‑N2‑A/B/C, CF‑2 (Familiarity ↔ reporting ↔ automatización) all align with the master roadmap. |
| Comparison with best‑in‑class external | 8.5 / 10 | SRE Book / Release It! / Prefect docs cited in `resources`; content conceptually aligned. |
| Other (accessibility, motivation) | 8.0 / 10 | PE context (Lima, San Isidro, America/Lima tz, es‑PE rubric) is well localised; no accessibility annotations (alt text, ARIA) inside this TS — UI layer is out of scope. |

---

## 3. Detailed Issue Registry

> Severity key — **H** = blocks learning or grammar correctness; **M** = erodes quality / style; **L** = polish.

### 3.1 Meta‑text / developer leakage

| # | Severity | Location (line in source) | Evidence quote | Pedagogical impact |
|---|---|---|---|---|
| M1 | **M** | `iDo.steps[*].description` (lines 364, 402, 462, 499, 524, 551, 578) and starterCode/code comments inside backticks (lines 368, 406, 466, 503, 528, 555, 588) | `"Thinking aloud: create-once no pisa; si falla el draft, pop draft y report → superseded."` and `# Thinking aloud: el orden no se inventa; sale de las dependencias de negocio.` | The English phrase *“Thinking aloud”* appears in 5 demo descriptions + 4 code comments, while the I‑Do `intro` (line 358) already uses the correct Spanish *“pensando en voz alta”*. Mixed‑language idiom in an es‑PE course breaks immersion; learners may copy the English tag into their own runbooks. |
| M2 | **L** | Every We‑Do `starterCode` first comment, e.g. line 642 `# CASO-LIM-026 · path parcial derivado de edges (sin AI/email)` | `# CASO-LIM-026 · …` appears 24 times | The internal curriculum code `CASO-LIM-026` is exposed to the learner as a code‑comment header. While arguably a useful reference tag, it reads as an authoring‑system label; learners may wonder what `CASO-LIM` means. |
| M3 | **L** | `weDo.steps[*].feedback` and `theory[*].paragraphs` | `print-theater` (line 1430), `tumba el export` (lines 96, 781, 421), `tumbar el endpoint` (line 96) | Slightly informal register (`tumba`, `print‑theater`) seeps into Peruvian‑professional prose. Acceptable in moderation but flagged for consistency with the `es‑PE profesional` rubric criterion (line 1557). |
| M4 | — | whole file | No TODO/FIXME/XXX/HACK, no “moved from section X”, no AI‑authorship residue, no Copilot/ChatGPT markers. | Clean. |

### 3.2 Grammatical correctness & redaction quality (es‑PE)

| # | Severity | Rule (LT or heuristic) | Evidence quote (source line) | Pedagogical impact |
|---|---|---|---|---|
| G1 | **H** | `Y_E_O_U` (LT GRAMMAR) | Line 1558, `youDo.rubric[6].criterion`: `"Notas de regresión N2 y CF-2 con: lista de tests re-ejecutados, resultado, y interfaces CF-2 verificadas"` | When `y` precedes a word starting with `i`/`hi`, Spanish requires `e`. The current form is a grammar error visible in the You‑Do rubric — the same rubric that grades the learner on `es-PE profesional`. High irony cost. |
| G2 | **M** | `AUTO_NO_SEPARADO` (LT MISSPELLING) | Line 320: `"el VP no auto-etiqueta fraude"` | RAE prefers the joined form `autoetiquetar` / `autoetiqueta` (prefix `auto‑` attaches directly to the verb). Hyphenated form is non‑standard. |
| G3 | **M** | `PREFIJOS_JUNTOS_EN_DICCIONARIO` (LT MISSPELLING) | Line 1389, `weDo.steps[23].instruction`: `"Paquete de defensa anti-fraude-auto: pkg={...}"` | Multi‑prefix compound `anti‑fraude‑auto` is non‑standard; RAE prefers `antifraude` and rewriting the second element. The hyphen‑chain reads as a developer tag, not Spanish. |
| G4 | **M** | `SIGLAS` (LT MISSPELLING) | Line 96: `"protegen APIs y colas compartidas"` | Per RAE, acronyms are invariable in Spanish: `las API` (not `las APIs`). Industry usage tolerates `APIs`, but the course’s own rubric grades on `es-PE profesional`. |
| G5 | **L** | `COMMA_PARENTHESIS_WHITESPACE` (LT TYPOGRAPHY) — repeated | Lines 673, 681, 688, 707, 723, 729, 738, 754, 762, 857, 1022, 1036, 1086, 1118, 1217, 1352, 1376 | `(a,b),(b,c)` without spaces, `{'status':'pending'},{'status':'done'}` without spaces | Spanish typography requires a space after the comma. Inside code‑adjacent prose this slips constantly. Not a Python defect (Python tolerates it) but a Spanish‑typography defect in instruction strings. |
| G6 | **L** | `PUNTO_EN_ABREVIATURAS` (LT TYPOGRAPHY) | Line 50: `"vs manual"`; line 96: `"p. ej. Lima"` (correct), `"p. ej. 45"` (correct) | `vs` should be `vs.` (with period) in Spanish abbreviations, or rewritten as `frente a`. The two `p. ej.` instances are correct. |
| G7 | **L** | Heuristic: paragraph = one long sentence | Line 33 (`theory[0].paragraphs[3]`, the “Diccionario rápido” glossary): single 57‑word sentence, FH = 14.0, INFLESZ = 9.9 — the worst sentence in the section | Cramming 7 glossary entries into one semicolon‑chained sentence produces *muy difícil* readability and high cognitive load. A definition list or table is the canonical fix. |
| G8 | **L** | Heuristic: long sentence (>32 w) | Lines 30 (the intro “S26 cierra el Value Proposition…” at 36 w), 358 (I‑Do intro at 36 w), 320 (“SLO y runbook protegen el día a día…” at 33 w), 30 (Tras checkpoint… at 32 w) | Four sentences exceed the 32‑word soft target. None are run‑ons (>45 w); all are intelligible. Worth trimming or splitting. |
| G9 | **L** | Heuristic: missing terminal punctuation on tagline | Line 8: `"…recuperación de fallas"` (no terminal period) | The `tagline` is rendered as a paragraph‑style subtitle on the home page (verified via `agent-browser read`). Other short label fields (headings, learning outcomes) legitimately omit the period; the tagline reads as a sentence and would benefit from one. |
| G10 | — | Other LT rules triggered but false positives | `VOSEO` (×13): all are correct es‑PE `tú` imperatives (`imprime`, `construye`, `cuenta`, `arma`, `no entres`); `MORFOLOGIK_RULE_ES` (×918): tech/code loanwords (`metadata`, `schedule`, `audit`, `runbook`, `checkpoint`, `approve`, `reject`, `draft`, `bucket`, `tumba`, `lease`, `lease`, `burst`, etc.); `APOSTROFO_ACENTO`: code identifiers like `'run_id'`; `NUMBERS_IN_WORDS`: synthetic IDs `cpn2c-hitl-01`; `SINGLE_CHARACTER`: single‑letter Python vars `b`, `k`, `s`; `ESTAS_NO_TILDE` / `SUBJUNTIVO_PASADO`: triggered by code‑token `report está done`; `ES_QUESTION_MARK`: triggered by concatenating separate `question`/`options` fields; `WRONG_IMPERATIVE`: false positive on `deja evidencia`; `UPPERCASE_SENTENCE_START` (×12): all on intentional lowercase `hint`/`tests`/`edgeCases` short labels. | None. Documented for transparency. |

### 3.3 Connective tissue & narrative flow

| # | Severity | Evidence | Impact |
|---|---|---|---|
| C1 | **strength** | Each theory block opens with a connector: line 96 `"Acabas de fijar el DAG; ahora sin límites…"`, line 130 `"Con el path estable, un crash a mitad de analyze exige checkpoint…"`, line 179 `"Tras checkpoint y DLQ, el siguiente riesgo es el reintento exitoso dos veces…"`, line 218 `"Con resiliencia y compensación listas, el path aún no puede materializar correo…"`, line 280 `"Con el gate HITL y el audit en verde, falta operar el VP en producción."` | Excellent anaphora‑free progressive disclosure: every block names the prerequisite it builds on. |
| C2 | **strength** | I‑Do intro (line 358) explicitly invokes the S25 handoff: `"…pensando en voz alta: path canónico de 7 steps, resiliencia, HITL triple, SLO y un mini-runner E2E con regresión N2/CF-2 — sin envío real ni fraude automático."` | Sets clear scope for the demo sequence. |
| C3 | **M** | We‑Do exercises 1–3 (T1‑A) jump from a 4‑step partial path to a 3‑node synthetic `a/b/c` graph to a flow‑state aggregation, with no explicit bridge between E1 (path derivation) and E2 (edge construction). The `feedback` strings are good, but a one‑sentence transition in the We‑Do `intro` (line 622) would help. | Mild cognitive jump for the learner; remediable by adding one transitional sentence. |
| C4 | **L** | The `theory` dictionary paragraph (line 33) defines 7 acronyms in one sentence but `HITL`, `DLQ`, `SLO` are re‑defined again in lines 218, 257, 280. Slight redundancy. | Acceptable for reinforcement; flag for awareness. |

### 3.4 Pedagogical structure (I Do / We Do / You Do)

| # | Severity | Evidence | Impact |
|---|---|---|---|
| P1 | **strength** | 8 demos ↔ 8 subtopics ↔ 24 exercises (3 each) ↔ 1 capstone. The mapping is bijective and the kinds (guided / independent / transfer) are uniform across subtopics. | Gold‑standard structure. |
| P2 | **strength** | Each We‑Do exercise includes: `instruction`, `hint`, `hints[3]`, `edgeCases[]`, `tests`, `feedback`, `starterCode` with a marked `DEFECT`, `solutionCode` with `output`. The DEFECT pattern forces active debugging rather than passive copying. | Excellent learning psychology (productive failure + worked example). |
| P3 | **L** | I‑Do demo `S26-T1-B-DEMO` (line 407) defines `run_meta(run_id, api_rpm=30, tz="America/Lima")` returning only 3 keys, while the theory contract (line 96) lists 4 mandatory metadata fields: `run_id, trigger, git_sha, data_cutoff`. The demo is a simplified version but a learner might assume the demo’s 3‑key dict is the canonical contract. | Minor contract‑drift between theory and demo; clarify the demo is a subset. |
| P4 | **L** | `selfCheck` Q5 (line 1592) asks `"¿Dónde debe quedar y con qué atributo mínimo?"` with correct option `"En DLQ con owner y razón (p. ej. timeout_exhausted)"`. The explanation (line 1596) is accurate. All 5 questions have explanations — good. | No defect; recorded as a positive. |
| P5 | **L** | `youDo.rubric` weights: 25 + 20 + 20 + 15 + 10 + 10 = 100 % + bonus checklist. Verified arithmetic. | No defect. |

### 3.5 Cognitive load & progressive disclosure

| # | Severity | Evidence | Impact |
|---|---|---|---|
| L1 | **M** | The 57‑word “Diccionario rápido” sentence (line 33) defines 7 acronyms inline. A first‑time reader must hold 7 (acronym, expansion, Spanish gloss) triples in working memory while parsing the semicolon‑chained sentence. | High working‑memory demand; convert to a table or bulleted list. |
| L2 | **M** | First theory paragraph (line 30) introduces, in 4 sentences, the terms: `S25`, `ai_assist`, `S26`, `Value Proposition RPA + AI Analyst`, `CP‑N2‑C`, `pipeline sintético`, `Excel/sistema`, `validación`, `análisis`, `IA asistida`, `informe`, `aprobación humana`, `borrador de correo`, `evidencia por estado`, `recuperación ante fallas`, `escritorio de operaciones en Lima`, `run_id`, `logs`, `artefactos`, `cola HITL`. ~20 new technical tokens in 4 sentences. | Acronym density is appropriate for a capstone closer but borders on overload. Mitigation: the second sentence reduces density and the third lists the 4 thematic blocks. |
| L3 | **L** | Acronyms `CF‑2`, `CP‑N2‑A/B/C`, `Familiarity ↔ reporting ↔ automatización` are referenced without re‑anchoring. A learner who skipped Phase 0 (S01–S13) capstones will not know what `CF‑2` means. The `callout` at line 39 says `"La promoción exige CP-N2-A/B/C, regresión S14–S26 y CF-2 aprobados…"` but never defines `CF‑2`. | Minor: add a one‑clause reminder of what `CF‑2` is. |
| L4 | **strength** | The `tagline` (line 8) gives a clean 7‑step pipeline in 7 arrow‑separated tokens — perfect scaffolding anchor. | Excellent. |

### 3.6 Exercise & exam quality and alignment

| # | Severity | Evidence | Impact |
|---|---|---|---|
| E1 | **strength** | Every We‑Do exercise has a `tests` string that names the contract (e.g. line 637: `"orden derivado de partial_edges (4 steps) sin hardcodear la lista a ciegas"`). | Excellent alignment between instruction, tests, and feedback. |
| E2 | **strength** | DEFECTs are varied and pedagogically targeted: missing `validate` (E1), inverted boolean (T2‑B‑E3, T4‑A‑E2), wrong threshold (T1‑B‑E2: 100 vs 60), wrong operator (T4‑A‑E1: `>` vs `<`), missing field in return dict (T4‑B‑E3 omits `value_minutes_saved_est`). | Forces the learner to read for semantic intent, not just syntax. |
| E3 | **L** | `weDo` intro (line 622) claims `"24 ejercicios"` — verified count is exactly 24. | Honest count; no defect. |
| E4 | **L** | `selfCheck` Q3 (line 1578): the question text uses `pending>0` without spaces, matching code style but breaking the comma‑paren typography rule. Same pattern as G5. | Style consistency, not a defect per se. |
| E5 | **L** | `weDo.steps[8].instruction` (T2‑B‑E2, line 988): `"state={'report':'ok','draft':'ok'}"` — Python dict literal inside Spanish instruction. Necessary for contract clarity but the no‑space‑after‑comma typography recurs. | Same as G5. |

### 3.7 Consistency with the overall roadmap

| # | Severity | Evidence | Impact |
|---|---|---|---|
| R1 | **strength** | References `S25` handoff (`ai_assist`), `S14–S26` regression, `CP‑N2‑A/B/C` capstones, `CF‑2` (Familiarity ↔ reporting ↔ automatización), `Familiarity` (Phase 0 product) — all consistent with `learning_roadmap_52_V3.md` and the master roadmap. | Excellent curriculum coherence. |
| R2 | **L** | `CF‑1` (Phase 0 closer) is implied but never named in S26; only `CF‑2` appears. | Minor: a learner progressing linearly will already know `CF‑1`; not a defect. |
| R3 | **strength** | `youDo.requirements[5]` (line 1486): `"Español profesional (es-PE) en runbook y mensajes de UI"` — explicitly reinforces the es‑PE standard set in `COURSE_META.description` (`index.ts` line 33: `"curso autónomo en español peruano"`). | Strong meta‑consistency. |

### 3.8 Comparison with best‑in‑class external materials

| External reference | Comparison |
|---|---|
| **SRE Workbook — Implementing SLOs** (cited in `resources.docs[3]`) | S26’s `success_rate ≥ 0.95`, `p95_duration_min`, `sends_without_approve > 0 = P0`, error‑budget‑style alerting is consistent with the SRE Workbook’s SLO pattern. Strong alignment. |
| **Release It! (Nygard)** (cited in `resources.books[0]`) | S26’s DLQ + owner + SLA, retry with backoff + cap, fail‑closed concurrency, compensating transactions (`draft out, report superseded`) align with Nygard’s stability patterns. |
| **Prefect docs** (cited twice in `resources.docs[0]`/`[1]`) | S26 deliberately avoids installing Prefect/Airflow (line 48: `"sin Prefect/Airflow instalado"`) and uses dicts + topological sort. This is a pedagogically sound choice — learners see the contract before the framework. |
| **12factor App** (cited in `resources.docs[5]`) | S26’s “metadata inmutable al start; versiona un nuevo run_id si cambias la foto de datos” matches Factor IV (Backing services as attached resources) and Factor V (Build, release, run). |
| **Compared to gold‑standard early sections (S01, S03)** | S26 has higher acronym density (appropriate for a capstone) but BETTER exercise scaffolding (3‑tier hints + edgeCases + tests + feedback + DEFECT starterCode) than S01/S03. S26 is gold‑standard for the We‑Do dimension. |

### 3.9 Other domain issues

| # | Severity | Evidence | Impact |
|---|---|---|---|
| O1 | **strength** | Privacy/safety is reinforced at every layer: `tagline` mentions synthetic data; line 33 says `"no uses RUC/nombres reales de clientes"`; line 320 enforces `fraud_labels=0`; line 1482 requires `"Cero envíos sin approve (y de hecho cero envíos reales)"`; line 1495 says `fraud_labels = 0  # debe permanecer 0: matching ≠ fraude`. | Excellent safety culture. |
| O2 | **L** | `theory[1].paragraphs[1]` (line 47) and `theory[1].paragraphs[2]` (line 48) use straight double quotes around `“preferencia”` (line 48) and `“correo automático con narrativa alucinada”` (line 219) but also use straight `'` for code identifiers. Spanish typography prefers «angular quotes» or “curly quotes” consistently. | Minor typographic inconsistency. |
| O3 | **L** | The You‑Do `portfolioNote` (line 1550) is a single 75‑word sentence. Not a defect (it is a portfolio note, not learner prose) but flagged for awareness. | Polish. |

---

## 4. Meta‑Leak Report

| Location | Leaked text | Severity | Cause |
|---|---|---|---|
| `iDo.steps[0].description` (line 364) and 7 other demo descriptions (lines 402, 462, 499, 524, 551, 578) and 4 code comments inside backticks (lines 368, 406, 466, 503, 528, 555, 588) | `Thinking aloud: …` / `# Thinking aloud: …` | **M** — English idiom in an es‑PE course, inconsistent with the I‑Do `intro` (line 358) which correctly uses `"pensando en voz alta"`. | Authoring residue: the demo persona was labelled in English and never localised. |
| All 24 We‑Do `starterCode` first comments, e.g. line 642 | `# CASO-LIM-026 · path parcial derivado de edges (sin AI/email)` | **L** — Internal curriculum code `CASO-LIM-026` is visible to the learner as a comment header. | Authoring‑system tag leaked into starterCode. |
| `weDo.steps[23].feedback` (line 1430) | `hardcodear solo dos claves es print-theater` | **L** — English coinage `print-theater` used as a pejorative. | Stylistic register slip. |
| `theory[1].paragraphs[0]` (line 96), `weDo.steps[4].feedback` (line 781), `iDo.steps[1].why` (line 421) | `tumba el export`, `tumbar el endpoint` | **L** — Informal Peruvian register `tumbar` for “knock down / overload”. | Acceptable in es‑PE informal but borders on the rubric’s `es‑PE profesional`. |

**No TODO / FIXME / XXX / HACK / “moved from” / “design note” / @author / Copilot / ChatGPT markers were found.** The file is clean of authoring residue except for the localisation slips above.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do (8 demos)

The I‑Do block is the strongest pedagogical element. The persona *“pensando en voz alta”* is established in the `intro` and each demo’s `why` field justifies the contract decision. The 8 demos walk the learner through:
1. T1‑A: deriving the 7‑step path from edges (topological intuition without naming it).
2. T1‑B: run metadata + preflight gate (`api_rpm > 60`).
3. T2‑A: checkpoint resume + retry exhaustion → DLQ with owner.
4. T2‑B: create‑once idempotency + compensating transaction (`draft out, report superseded`).
5. T3‑A: triple HITL queue (`any pending > 0` blocks).
6. T3‑B: reject requires reason; approve is append‑only.
7. T4‑A: SLO + P0 alert naming (runbook contract).
8. T4‑B: end‑to‑end mini‑runner tying path + crash + gate + `fraud_labels=0` + `n2_regression=pass`.

**Single weak spot (P3):** demo T1‑B’s `run_meta` returns 3 keys while the theory contract requires 4. Either expand the demo or add a one‑line caveat like `"Versión didáctica: en prod añade trigger, git_sha y data_cutoff"`.

### 5.2 We Do (24 exercises)

The 3‑per‑subtopic / guided → independent → transfer ladder is gold‑standard. The DEFECT pattern is varied and pedagogically targeted (see E2). The 3‑tier `hints` array escalates from a nudge (`"parte de first=edges[0][0]…"`) to a near‑solution (`"order = [partial_edges[0][0]]; luego for a,b in partial_edges: si a==order[-1], append b."`) to a context reminder. The `feedback` field reframes the defect conceptually (e.g. line 638: `"Si falta validate, el DAG de negocio se rompe antes de llegar a AI o email; derivar de edges evita inventar el orden."`).

**Single weak spot (C3):** no transitional sentence between E1 and E2 of T1‑A. The `intro` (line 622) is global to the We‑Do block; subtopic intros would smooth the cognitive jumps.

### 5.3 You Do (capstone)

The capstone is excellent: `context` restates the 7‑step canonical path and the regression contract; `objectives` (5) map 1:1 to the 4 subtopics + 1 documentation objective; `requirements` (6) include the safety invariants (`fraud_labels=0`, `matching ≠ fraude`, synthetic data only, zero real sends); `starterCode` is a runnable skeleton with `advance`, `can_draft`, `run_all`, `package_e2e` and 4 numbered portfolio tasks; `rubric` sums to 100 % + bonus checklist for `N2 regression + CF-2 interfaces`.

**Single weak spot:** the `portfolioNote` (line 1550) is a 75‑word single sentence. Splitting into 2–3 sentences would mirror the segmented style of the rest of the section.

### 5.4 Self‑Check (5 questions)

All 5 questions cover the high‑value invariants: approve‑before‑draft ordering, N2 regression scope, triple HITL gate, `fraud_labels=0`, DLQ owner/SLA. Each question has an `explanation`. The distractors are plausible (e.g. Q4 distractor `"Igual al score de matching"` tests exactly the matching‑≠‑fraude misconception). **No defects.**

### 5.5 Resources

The 6 docs, 2 books, 4 courses are well chosen and align with the section’s concepts (Prefect, Airflow, SRE Book/Workbook, 12factor, Release It!, Coursera data‑engineering, MIT 6.100L, Harvard CS50P, deeplearning.ai). **No defects.**

---

## 6. Grammatical Improvements — Paragraph‑by‑Paragraph Rewrites

> Format: **Before** (verbatim source) → **After** (proposed rewrite). Only paragraphs/sentences with a real or stylistic defect are rewritten.

### 6.1 Theory → Block 0 (Cierre CP‑N2‑C) → paragraph 3 — the glossary run‑on (line 33)

**Before**
```
"Diccionario rápido de la sección: **DAG** = grafo de dependencias sin ciclos; **HITL** (human-in-the-loop) = revisión humana obligatoria; **DLQ** (dead-letter queue) = cola de ítems que agotaron reintentos; **SLO** = objetivo de servicio medible; **fail-closed** = ante duda, bloquear; **drain** = vaciar workers antes de cambiar schema; **page on-call** = avisar al turno de guardia con severidad explícita. Privacidad: datos de demo sintéticos; no uses RUC/nombres reales de clientes."
```

**After** (split into a 2‑sentence intro + bulleted glossary; same content, FH improves from 14.0 to ~70)
```
"Diccionario rápido de la sección para que leas el resto sin tropezar con siglas:\n\n- **DAG**: grafo de dependencias sin ciclos.\n- **HITL** (human-in-the-loop): revisión humana obligatoria.\n- **DLQ** (dead-letter queue): cola de ítems que agotaron reintentos.\n- **SLO**: objetivo de servicio medible.\n- **fail-closed**: ante duda, bloquear.\n- **drain**: vaciar workers antes de cambiar schema.\n- **page on-call**: avisar al turno de guardia con severidad explícita.\n\nPrivacidad: usa solo datos sintéticos; no uses RUC ni nombres reales de clientes."
```

### 6.2 Theory → Block 0 → paragraph 1 (line 30) — long sentence (36 w)

**Before**
```
"S26 cierra el Value Proposition RPA + AI Analyst de CP-N2-C orquestando el pipeline sintético Excel/sistema → validación → análisis → IA asistida → informe → aprobación humana → borrador de correo, con evidencia por estado y recuperación ante fallas."
```

**After** (split into 2 sentences)
```
"S26 cierra el Value Proposition **RPA + AI Analyst** de CP‑N2‑C. Orquesta el pipeline sintético Excel/sistema → validación → análisis → IA asistida → informe → aprobación humana → borrador de correo, con evidencia por estado y recuperación ante fallas."
```

### 6.3 Theory → Block 1 (T1‑A) → paragraph 0 (line 46)

**Before**
```
"Un **DAG** (directed acyclic graph) codifica dependencias de negocio: no puedes analizar antes de validar ni generar draft_email antes de approve. Path canónico del VP (7 steps): **ingest → validate → analyze → ai_assist → report → approve → draft_email**. Ese orden es el contrato del cierre CP-N2-C; las vistas parciales de ejercicios lo declaran cuando omiten AI o email a propósito."
```
*No grammar defect; kept for context. Only a minor `vs` style note applies elsewhere.*

### 6.4 Theory → Block 1 (T1‑B) → paragraph 0 (line 96) — `APIs` plural + `p. ej.` (already correct)

**Before**
```
"Acabas de fijar el DAG; ahora sin **límites** un schedule tumba el export. **Rate limits** (api_rpm, max_parallel_tasks) protegen APIs y colas compartidas: un *burst* (ráfaga) nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Metadata inmutable al start del run: run_id, trigger (manual|schedule), git_sha sintético, data_cutoff — versionas un nuevo run_id si cambias la foto de datos."
```

**After** (`APIs` → `las API` per RAE invariable‑siglas rule; `tumba`/`tumbar` kept as es‑PE informal)
```
"Acabas de fijar el DAG; ahora, sin **límites**, un schedule tumba el export. **Rate limits** (`api_rpm`, `max_parallel_tasks`) protegen las API y las colas compartidas: un *burst* (ráfaga) nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Metadata inmutable al start del run: `run_id`, `trigger` (manual|schedule), `git_sha` sintético, `data_cutoff`. Si cambias la foto de datos, versiona un nuevo `run_id`."
```

### 6.5 Theory → Block 4 (T2‑B) → paragraph 0 (line 179) — `keys` Anglicism

**Before**
```
"Tras checkpoint y DLQ, el siguiente riesgo es el **reintento exitoso dos veces**: pasos **idempotentes** usan keys de negocio (`run_id`, `entity_id`) para que la segunda escritura no pise un valor ya materializado (create-once). Un retry **no** duplica drafts por reentrega del mensaje."
```

**After** (`keys` → `claves`; `drafts` → `borradores` for es‑PE consistency)
```
"Tras checkpoint y DLQ, el siguiente riesgo es el **reintento exitoso dos veces**: los pasos **idempotentes** usan claves de negocio (`run_id`, `entity_id`) para que la segunda escritura no pise un valor ya materializado (create‑once). Un retry **no** duplica borradores por reentrega del mensaje."
```

### 6.6 Theory → Block 5 (T3‑A) → paragraph 1 (line 219) — `narrativa alucinada` is fine; only the curly quotes need consistency

**Before**
```
"La IA asistida (**ai_assist**, handoff de S25) **solo propone** texto/highlights; **no cierra** el caso. Si `analysis` pending, el flow queda en `human_review` aunque `report` esté listo — evita "correo automático con narrativa alucinada"."
```

**After** (uniformise quotes to «angular» per Spanish typography; `handoff` → `entrega`/`traspaso` if strict es‑PE)
```
"La IA asistida (**ai_assist**, traspaso desde S25) **solo propone** texto y *highlights*; **no cierra** el caso. Si `analysis` está pendiente, el flow queda en `human_review` aunque `report` esté listo: así evitas «correo automático con narrativa alucinada»."
```

### 6.7 Theory → Block 7 (T4‑B) → paragraph 0 (line 320) — `auto-etiqueta` → `autoetiqueta`

**Before**
```
"SLO y runbook protegen el día a día; el **cierre de nivel** exige evidencia E2E del path canónico **ingest → validate → analyze → ai_assist → report → approve → draft_email** en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no auto-etiqueta fraude)."
```

**After**
```
"SLO y runbook protegen el día a día; el **cierre de nivel** exige evidencia E2E del path canónico **ingest → validate → analyze → ai_assist → report → approve → draft_email** en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no autoetiqueta fraude)."
```

### 6.8 I‑Do intro (line 358) — already good, kept for reference

**Before**
```
"Te muestro el cierre de CP-N2-C pensando en voz alta: path canónico de 7 steps, resiliencia, HITL triple, SLO y un mini-runner E2E con regresión N2/CF-2 — sin envío real ni fraude automático."
```
*FH = 61.8, 36 w. Acceptable. If tightened:*
```
"Te muestro el cierre de CP‑N2‑C pensando en voz alta: path canónico de 7 steps, resiliencia, HITL triple, SLO y un mini‑runner E2E con regresión N2/CF‑2. Sin envío real ni fraude automático."
```

### 6.9 I‑Do `steps[*].description` (lines 364, 402, 462, 499, 524, 551, 578) — unify *Thinking aloud* → *Pensando en voz alta*

**Before (line 462)**
```
"Thinking aloud: create-once no pisa; si falla el draft, pop draft y report → superseded."
```

**After**
```
"Pensando en voz alta: create-once no pisa; si falla el draft, pop draft y report → superseded."
```

(Analogous replacement on the other 4 descriptions and 4 code comments.)

### 6.10 We‑Do intro (line 622)

**Before**
```
"24 ejercicios de DAG, limits, checkpoint/DLQ, rollback, colas HITL, audit, SLO y E2E/regresión. Cada starter trae un **DEFECT** (fallo intencional) marcado en un comentario: tu trabajo es corregirlo hasta igualar el output de la solución."
```
*No grammar defect. FH ≈ 73. Acceptable.*

### 6.11 We‑Do T4‑B E3 instruction (line 1389) — `anti-fraude-auto` prefix chain

**Before**
```
"Paquete de defensa anti-fraude-auto: pkg={'fraud_labels':0,'approved':True}. Imprime 'ok' solo si fraud_labels==0 **y** approved es True; si no, 'fail'. Matching/OCR no generan labels de fraude; draft no se defiende sin approve. Pass: ok."
```

**After** (rewrite the prefix chain; keep the code)
```
"Paquete de defensa contra auto‑fraude: pkg={'fraud_labels':0,'approved':True}. Imprime 'ok' solo si fraud_labels==0 **y** approved es True; si no, 'fail'. Matching/OCR no generan etiquetas de fraude; el draft no se defiende sin approve. Pass: ok."
```

### 6.12 We‑Do T1‑A E2 instruction (line 673) — comma‑paren typography

**Before**
```
"Dado nodes=['a','b','c'] como path lineal del flow sintético, construye edges (a,b),(b,c) con zip y cuenta len(edges). Contrato: input lista de 3 nodos → output '2 [(...) ]' con pares ordenados. Ciclos prohibidos en producción; aquí solo path. Pass: 2 [('a', 'b'), ('b', 'c')]."
```

**After** (add spaces after commas inside the parenthesised tuples)
```
"Dado nodes=['a','b','c'] como path lineal del flow sintético, construye edges (a, b), (b, c) con zip y cuenta len(edges). Contrato: input lista de 3 nodos → output '2 [(...) ]' con pares ordenados. Ciclos prohibidos en producción; aquí solo path. Pass: 2 [('a', 'b'), ('b', 'c')]."
```

(Analogous fix on the other ~15 instances listed under G5.)

### 6.13 You‑Do `context` (line 1472) — already strong

**Before**
```
"Orquesta el VP sintético de punta a punta: ingest→validate→analyze→ai_assist→report→approve→draft_email. Incluye checkpoint/DLQ, triple cola HITL, audit, SLO y un checklist de **regresión N2** (tests críticos CP-N2-A/B/C, E2E S14–S26, privacidad/seguridad, CF-2 interfaces). No envíes correo real; fraud_labels=0; matching no implica fraude."
```
*No grammar defect. The high comma density (6 commas in 29 words) is acceptable for a contract enumeration. Keep.*

### 6.14 You‑Do `rubric[6]` (line 1558) — `y interfaces` → `e interfaces` (HIGH PRIORITY)

**Before**
```
"Notas de regresión N2 y CF-2 con: lista de tests re-ejecutados, resultado, y interfaces CF-2 verificadas"
```

**After**
```
"Notas de regresión N2 y CF-2 con: lista de tests re-ejecutados, resultado, e interfaces CF-2 verificadas"
```

### 6.15 You‑Do `portfolioNote` (line 1550) — split the 75‑word single sentence

**Before**
```
"Paquete de cierre CP-N2-C para portafolio: pipeline con evidencia por estado, HITL triple, draft en sandbox y sección explícita de **regresión N2** (S14–S26) más contratos **CF-2** (Familiarity ↔ reporting ↔ automatización). Documenta límites: datos sintéticos, fraud_labels=0 y cero envíos reales. Artefactos mínimos sugeridos: manifest de estados por step, sample de audit append-only, línea de costo (tokens/minutos) y nota de privacidad."
```

**After** (split into 3 sentences; the first is already short — keep)
```
"Paquete de cierre CP‑N2‑C para portafolio. Incluye pipeline con evidencia por estado, HITL triple, draft en sandbox y una sección explícita de **regresión N2** (S14–S26) más los contratos **CF‑2** (Familiarity ↔ reporting ↔ automatización). Documenta los límites: datos sintéticos, `fraud_labels=0` y cero envíos reales. Artefactos mínimos sugeridos: manifest de estados por step, muestra de audit append‑only, línea de costo (tokens/minutos) y nota de privacidad."
```

### 6.16 Self‑Check Q5 (line 1592) — already good

```
"Un item agota reintentos de timeout de export. ¿Dónde debe quedar y con qué atributo mínimo?"
```
*Correctly paired `¿…?`. No defect.*

---

## 7. Proposed GitHub‑style Diffs

> All diffs are against `src/lib/course/sections/s26-integrator-phase1.ts`. Line numbers refer to the current file. **Do not apply automatically — audit‑only per the campaign rules.**

### Diff 1 — Fix `y` → `e` agreement (G1, HIGH)

```diff
@@ -1558 +1558 @@
-      { criterion: "Notas de regresión N2 y CF-2 con: lista de tests re-ejecutados, resultado, y interfaces CF-2 verificadas", weight: "bonus checklist" },
+      { criterion: "Notas de regresión N2 y CF-2 con: lista de tests re-ejecutados, resultado, e interfaces CF-2 verificadas", weight: "bonus checklist" },
```

### Diff 2 — Unify *Thinking aloud* → *Pensando en voz alta* (M1)

```diff
@@ -364 +364 @@
-        description: "Derivo el path canónico de 7 steps desde edges (ai_assist + draft_email).",
+        description: "Derivo el path canónico de 7 steps desde edges (ai_assist + draft_email). Pensando en voz alta.",
@@ -402 +402 @@
-        description: "Metadata de run con límites y zona America/Lima (thinking aloud).",
+        description: "Metadata de run con límites y zona America/Lima (pensando en voz alta).",
@@ -462 +462 @@
-        description: "Thinking aloud: create-once no pisa; si falla el draft, pop draft y report → superseded.",
+        description: "Pensando en voz alta: create-once no pisa; si falla el draft, pop draft y report → superseded.",
@@ -499 +499 @@
-        description: "Thinking aloud: cuento pending en analysis/report/recipient y demuestro que un solo pending bloquea draft_email.",
+        description: "Pensando en voz alta: cuento pending en analysis/report/recipient y demuestro que un solo pending bloquea draft_email.",
@@ -524 +524 @@
-        description: "Thinking aloud: reject sin reason es invalid; approve append-only deja rastro defendible.",
+        description: "Pensando en voz alta: reject sin reason es invalid; approve append-only deja rastro defendible.",
@@ -551 +551 @@
-        description: "Thinking aloud: evalúo success_rate y sends_without_approve; nombro alertas como en el runbook.",
+        description: "Pensando en voz alta: evalúo success_rate y sends_without_approve; nombro alertas como en el runbook.",
@@ -578 +578 @@
-        description: "Mini-runner E2E: estados nodo a nodo, fallo en analyze, gate approve→draft, regresión pass.",
+        description: "Mini-runner E2E: estados nodo a nodo, fallo en analyze, gate approve→draft, regresión pass. Pensando en voz alta.",
```

### Diff 3 — Unify *Thinking aloud* in code comments (M1, continued)

```diff
@@ -368 +368 @@
-# Thinking aloud: el orden no se inventa; sale de las dependencias de negocio.
+# Pensando en voz alta: el orden no se inventa; sale de las dependencias de negocio.
@@ -406 +406 @@
-# Thinking aloud: el run_id une logs/HITL; api_rpm y tz fijan el contrato del schedule.
+# Pensando en voz alta: el run_id une logs/HITL; api_rpm y tz fijan el contrato del schedule.
@@ -466 +466 @@
-# Thinking aloud: idempotencia create-once + compensación parcial.
+# Pensando en voz alta: idempotencia create-once + compensación parcial.
@@ -503 +503 @@
-# Thinking aloud: tres colas; basta una >0 para bloquear el borrador.
+# Pensando en voz alta: tres colas; basta una >0 para bloquear el borrador.
@@ -528 +528 @@
-# Thinking aloud: reject exige reason; approve append-only sin reescribir.
+# Pensando en voz alta: reject exige reason; approve append-only sin reescribir.
@@ -555 +555 @@
-# Thinking aloud: nombres de alerta = contrato del runbook (no aliases).
+# Pensando en voz alta: nombres de alerta = contrato del runbook (no aliases).
@@ -588 +588 @@
-    # Thinking aloud: un solo lifecycle une path, fallo, gate HITL y draft.
+    # Pensando en voz alta: un solo lifecycle une path, fallo, gate HITL y draft.
```

### Diff 4 — Convert glossary run‑on to a list (G7, L1)

```diff
@@ -33 +33,11 @@
-        "Diccionario rápido de la sección: **DAG** = grafo de dependencias sin ciclos; **HITL** (human-in-the-loop) = revisión humana obligatoria; **DLQ** (dead-letter queue) = cola de ítems que agotaron reintentos; **SLO** = objetivo de servicio medible; **fail-closed** = ante duda, bloquear; **drain** = vaciar workers antes de cambiar schema; **page on-call** = avisar al turno de guardia con severidad explícita. Privacidad: datos de demo sintéticos; no uses RUC/nombres reales de clientes.",
+        "Diccionario rápido de la sección para que leas el resto sin tropezar con siglas:",
+        "- **DAG**: grafo de dependencias sin ciclos.",
+        "- **HITL** (human-in-the-loop): revisión humana obligatoria.",
+        "- **DLQ** (dead-letter queue): cola de ítems que agotaron reintentos.",
+        "- **SLO**: objetivo de servicio medible.",
+        "- **fail-closed**: ante duda, bloquear.",
+        "- **drain**: vaciar workers antes de cambiar schema.",
+        "- **page on-call**: avisar al turno de guardia con severidad explícita.",
+        "",
+        "Privacidad: usa solo datos sintéticos; no uses RUC ni nombres reales de clientes.",
```

> **Note:** the `theory[*].paragraphs` array is typed `string[]`; switching one paragraph into multiple bulleted strings is the lowest‑risk fix that preserves the schema. If the renderer does not render markdown bullets inside `paragraphs`, an alternative is to keep one paragraph but split the semicolons into separate sentences (still reduces WPS from 57 to ~7 per sentence).

### Diff 5 — `auto-etiqueta` → `autoetiqueta` (G2)

```diff
@@ -320 +320 @@
-        "SLO y runbook protegen el día a día; el **cierre de nivel** exige evidencia E2E del path canónico **ingest → validate → analyze → ai_assist → report → approve → draft_email** en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no auto-etiqueta fraude).",
+        "SLO y runbook protegen el día a día; el **cierre de nivel** exige evidencia E2E del path canónico **ingest → validate → analyze → ai_assist → report → approve → draft_email** en success con fixtures sintéticos. Seguridad: secretos fuera del repo, scopes mínimos, **`fraud_labels=0`** (el VP no autoetiqueta fraude).",
```

### Diff 6 — Rewrite `anti-fraude-auto` (G3)

```diff
@@ -1389 +1389 @@
-          "Paquete de defensa anti-fraude-auto: pkg={'fraud_labels':0,'approved':True}. Imprime 'ok' solo si fraud_labels==0 **y** approved es True; si no, 'fail'. Matching/OCR no generan labels de fraude; draft no se defiende sin approve. Pass: ok.",
+          "Paquete de defensa contra el auto-fraude: pkg={'fraud_labels':0,'approved':True}. Imprime 'ok' solo si fraud_labels==0 **y** approved es True; si no, 'fail'. Matching/OCR no generan etiquetas de fraude; el draft no se defiende sin approve. Pass: ok.",
```

### Diff 7 — `APIs` → `las API` (G4)

```diff
@@ -96 +96 @@
-        "Acabas de fijar el DAG; ahora sin **límites** un schedule tumba el export. **Rate limits** (api_rpm, max_parallel_tasks) protegen APIs y colas compartidas: un *burst* (ráfaga) nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Metadata inmutable al start del run: run_id, trigger (manual|schedule), git_sha sintético, data_cutoff — versionas un nuevo run_id si cambias la foto de datos.",
+        "Acabas de fijar el DAG; ahora, sin **límites**, un schedule tumba el export. **Rate limits** (`api_rpm`, `max_parallel_tasks`) protegen las API y las colas compartidas: un *burst* (ráfaga) nocturno de reintentos no debe tumbar el endpoint de export del sistema sintético. Metadata inmutable al start del run: `run_id`, `trigger` (manual|schedule), `git_sha` sintético, `data_cutoff`. Si cambias la foto de datos, versiona un nuevo `run_id`.",
```

### Diff 8 — Add spaces inside tuple/code literals in We‑Do instructions (G5, representative)

```diff
@@ -673 +673 @@
-          "Dado nodes=['a','b','c'] como path lineal del flow sintético, construye edges (a,b),(b,c) con zip y cuenta len(edges). Contrato: input lista de 3 nodos → output '2 [(...) ]' con pares ordenados. Ciclos prohibidos en producción; aquí solo path. Pass: 2 [('a', 'b'), ('b', 'c')].",
+          "Dado nodes=['a','b','c'] como path lineal del flow sintético, construye edges (a, b), (b, c) con zip y cuenta len(edges). Contrato: input lista de 3 nodos → output '2 [(...) ]' con pares ordenados. Ciclos prohibidos en producción; aquí solo path. Pass: 2 [('a', 'b'), ('b', 'c')].",
@@ -681 +681 @@
-        tests: "salida '2 [(\\'a\\', \\'b\\'), (\\'b\\', \\'c\\')]' o equivalente al solution output",
+        tests: "salida '2 [(\\'a\\', \\'b\\'), (\\'b\\', \\'c\\')]' o equivalente al solution output",
```
*(Identical fix on lines 707, 723, 729, 738, 754, 762, 857, 1022, 1036, 1086, 1118, 1185, 1217, 1352, 1376 — add a single space after each comma inside parenthesised code literals.)*

### Diff 9 — `vs manual` → `vs. manual` or `frente al manual` (G6)

```diff
@@ -321 +321 @@
-        "Costo: tokens de IA + minutos de RPA acotados. Valor: minutos ahorrados estimados (p. ej. 45) vs manual — estimación de producto, no promesa financiera.",
+        "Costo: tokens de IA + minutos de RPA acotados. Valor: minutos ahorrados estimados (p. ej. 45) frente al proceso manual — estimación de producto, no promesa financiera.",
```

### Diff 10 — Add terminal period to tagline (G9)

```diff
@@ -8 +8 @@
-  tagline: "VP RPA + AI Analyst: Excel/sistema → validación → análisis → modelo/IA → informe → aprobación → borrador de correo. Demo con datos sintéticos, evidencia de cada estado y recuperación de fallas",
+  tagline: "VP RPA + AI Analyst: Excel/sistema → validación → análisis → modelo/IA → informe → aprobación → borrador de correo. Demo con datos sintéticos, evidencia de cada estado y recuperación de fallas.",
```

### Diff 11 — Clarify I‑Do T1‑B demo is a subset of the theory contract (P3)

```diff
@@ -402 +402 @@
-        description: "Metadata de run con límites y zona America/Lima (pensando en voz alta).",
+        description: "Metadata de run con límites y zona America/Lima (pensando en voz alta). Versión didáctica: en producción añade trigger, git_sha y data_cutoff.",
```

### Diff 12 — Split You‑Do `portfolioNote` (O3)

```diff
@@ -1550 +1550 @@
-      "Paquete de cierre CP-N2-C para portafolio: pipeline con evidencia por estado, HITL triple, draft en sandbox y sección explícita de **regresión N2** (S14–S26) más contratos **CF-2** (Familiarity ↔ reporting ↔ automatización). Documenta límites: datos sintéticos, fraud_labels=0 y cero envíos reales. Artefactos mínimos sugeridos: manifest de estados por step, sample de audit append-only, línea de costo (tokens/minutos) y nota de privacidad.",
+      "Paquete de cierre CP‑N2‑C para portafolio. Incluye pipeline con evidencia por estado, HITL triple, draft en sandbox y una sección explícita de **regresión N2** (S14–S26) más los contratos **CF-2** (Familiarity ↔ reporting ↔ automatización). Documenta los límites: datos sintéticos, `fraud_labels=0` y cero envíos reales. Artefactos mínimos sugeridos: manifest de estados por step, muestra de audit append‑only, línea de costo (tokens/minutos) y nota de privacidad.",
```

### Diff 13 — Unify curly quotes to «angular» (O2)

```diff
@@ -48 +48 @@
-        "Implementación didáctica con dicts de nodos + edges y **orden topológico** (sin Prefect/Airflow instalado): si hay ciclo, el pipeline **no arranca**. Contrato: `edges list[(str,str)]` → `order list[str]`; `approve` **antes** de `draft_email` es dependencia de negocio, no de “preferencia”.",
+        "Implementación didáctica con dicts de nodos + edges y **orden topológico** (sin Prefect/Airflow instalado): si hay ciclo, el pipeline **no arranca**. Contrato: `edges list[(str,str)]` → `order list[str]`; `approve` **antes** de `draft_email` es dependencia de negocio, no de «preferencia».",
@@ -219 +219 @@
-        "La IA asistida (**ai_assist**, handoff de S25) **solo propone** texto/highlights; **no cierra** el caso. Si `analysis` pending, el flow queda en `human_review` aunque `report` esté listo — evita “correo automático con narrativa alucinada”.",
+        "La IA asistida (**ai_assist**, traspaso desde S25) **solo propone** texto y *highlights*; **no cierra** el caso. Si `analysis` está pendiente, el flow queda en `human_review` aunque `report` esté listo: así evitas «correo automático con narrativa alucinada».",
@@ -354 +354 @@
-          "CF-2 fija interfaces entre Familiarity, reporting y automatización. La regresión N2 no se “compensa” entre capstones.",
+          "CF-2 fija interfaces entre Familiarity, reporting y automatización. La regresión N2 no se «compensa» entre capstones.",
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue ID | Fix | Effort | Impact |
|---|---|---|---|---|
| 🔴 P0 | G1 | `y interfaces` → `e interfaces` in `youDo.rubric[6]` (Diff 1) | 1 line | Grammar correctness in the rubric that grades es‑PE. |
| 🟠 P1 | M1 | Unify *Thinking aloud* → *Pensando en voz alta* across 5 descriptions + 4 code comments (Diffs 2–3) | 9 lines | Removes the English meta‑leak; restores es‑PE immersion. |
| 🟠 P1 | G7 / L1 | Convert the 57‑word glossary run‑on to a bulleted definition list (Diff 4) | 1 paragraph | Drops the worst sentence (FH 14.0 → ~70); cuts cognitive load. |
| 🟡 P2 | G2 | `auto-etiqueta` → `autoetiqueta` (Diff 5) | 1 line | RAE conformance. |
| 🟡 P2 | G3 | Rewrite `anti-fraude-auto` (Diff 6) | 1 line | RAE prefix‑joining conformance. |
| 🟡 P2 | G4 | `APIs` → `las API` (Diff 7) | 1 line | RAE sigla invariability. |
| 🟢 P3 | G5 | Add spaces after commas inside `(a,b),(b,c)` tuples across ~15 instruction strings (Diff 8) | ~15 lines | Spanish typography consistency. |
| 🟢 P3 | G6 | `vs` → `frente a` (Diff 9) | 1 line | Style register. |
| 🟢 P3 | G9 | Add terminal period to `tagline` (Diff 10) | 1 line | Polish. |
| 🟢 P3 | P3 | Clarify I‑Do T1‑B demo is a subset of the theory contract (Diff 11) | 1 line | Contract clarity. |
| 🟢 P3 | O3 | Split `portfolioNote` into 3 sentences (Diff 12) | 1 line | Readability. |
| 🟢 P3 | O2 | Unify curly quotes → «angular» (Diff 13) | 3 lines | Spanish typography consistency. |
| ⚪ P4 | M2 | Decide whether `CASO-LIM-026` tags should remain visible in starterCode (no diff proposed — policy decision) | 24 comments | Authoring‑system label exposure. |
| ⚪ P4 | M3 | Audit informal register (`tumba`, `print-theater`) against the rubric’s `es‑PE profesional` standard | ~5 lines | Register consistency. |

---

## 9. Graph Memory Update Notes

For the shared orchestrator context (worklog / future Fixer pass):

- **S26 node**: phase‑1 capstone closer; 8 subtopics, 8 I‑Do demos, 24 We‑Do exercises (3 per subtopic, guided → independent → transfer), 1 You‑Do capstone, 5 self‑check questions, 6 docs + 2 books + 4 courses.
- **Edges to prior sections**: `S25` (ai_assist handoff), `S14–S26` (N2 regression), `CP‑N2‑A/B/C` (Phase‑1 capstone chain), `CF‑2` (Familiarity ↔ reporting ↔ automation interfaces), `Familiarity` (Phase 0 product).
- **Quality edges**: gold‑standard We‑Do scaffolding (DEFECT + 3‑tier hints + edgeCases + tests + feedback); strong safety invariants (`fraud_labels=0`, `matching ≠ fraude`, zero real sends, synthetic data only, RUC/names prohibition); strong PE localisation (America/Lima tz, Lima/San Isidro cases, es‑PE rubric criterion).
- **Defects queued for Fixer**: 13 diffs above; P0 = G1 (`y` → `e`); P1 = M1 (Thinking aloud) + G7/L1 (glossary run‑on); P2 = G2/G3/G4 (RAE style); P3 = typography + polish.
- **Metrics snapshot** (for cross‑section ranking): n_paragraphs=202, n_sentences=325, avg_WPS=11.81, avg_SPW=2.05, avg_FH=71.8, avg_INFLESZ=67.3, max_WPS=57, long_sentences_32plus=4, runon_45plus=0, missing_inverted_marks=0, unbalanced_delims=0, anaphora_paragraphs=0, high_comma_density=54, LT_non_spell_real=8 (Y_E_O_U ×1, AUTO_NO_SEPARADO ×1, PREFIJOS_JUNTOS ×1, SIGLAS ×1, COMMA_PARENTHESIS ×multiple, PUNTO_EN_ABREVIATURAS ×vs only).
- **Composite score**: 8.4 / 10 (top tier of Phase 1).

---

## 10. Method Note (Grammar Dimension)

**Research base applied** (per `_GRAMMAR_SUBPLAN.md`):

1. **Fernández‑Huerta (1959)** Spanish Flesch adaptation: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Bands: ≥90 muy fácil → <30 muy difícil. For technical Spanish curriculum, 50–70 (normal / bastante difícil) is healthy.
2. **Szigriszt‑Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)`. Same interpretive bands.
3. **Words per sentence (WPS)** and **syllables per word (SPW)** as structural‑load and lexical‑complexity indicators. Soft targets: WPS 15–32 for technical Spanish; SPW ~2.0–2.4.
4. **LanguageTool** (`language=es`) via the public HTTP API, in 2 chunks of ≤18 000 characters with 4 s sleep between requests. 986 raw matches; 68 non‑spellcheck; 8 real after manual false‑positive filtering.
5. **Pedagogical Spanish heuristics** (offline): run‑on >45 w / long >32 w / missing terminal `.?!` / missing `¿¡` / unbalanced `()[]«»""` / repeated `de de` / English‑dominant sentence / meta‑AI‑TODO leak / gerund pile‑up ≥3 / high comma density >0.12 / paragraph = one long sentence / anaphoric monotony / space‑before‑punct / double space.

**Validation.** Nonzero prose extraction (209 strings; 202 paragraph‑like; 325 sentences). FH range plausible (min −14.3 on a 5‑word heading, max 92.7 on a short clause; mean 71.8). LT false‑positive classes documented in §3.2 G10. Code fields and `${}` interpolations stripped before analysis.

**Known limitations.** (a) The syllable counter is a vowel‑group heuristic; it overcounts on loanwords ending in consonant clusters (e.g. `checkpoint` → 2 instead of 2; `workflow` → 2). (b) LT free API does not distinguish es‑PE from es‑ES; the `VOSEO` rule fires on all `tú` imperatives — all false positives for es‑PE. (c) Some “missing terminal punctuation” hits are intentional headings/labels and were not counted as defects. (d) The LT API was rate‑limited but reachable; 2 chunks completed without throttling.

---

**This is the complete Explorer report for Section 26. Ready for the Fixer prompt.**
