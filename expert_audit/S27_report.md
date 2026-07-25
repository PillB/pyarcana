# Section 27 — Curriculum Auditor Report

**Section under audit:** S27 — *"Estrategia de pruebas con pytest"* (`shortTitle: "Pytest y contratos"`).
**Phase:** 2 — Senior (sections 27–39). S27 is the Phase‑2 opener and the start of capstone **CP‑N3‑A**.
**Live site (verified):** https://pillb.github.io/pyarcana/#async-concurrency — Section 27 in course order is "Pytest y contratos" with the tagline quoted below. Confirmed via `agent-browser` navigation of the homepage course list (entry #27 lists exactly the same tagline as the source file) and a direct click‑through to the rendered section.
**Repository source (verified):** `src/lib/course/sections/s27-async-concurrency.ts` (1 623 lines, exported as `section27`).
**Index verification:** `src/lib/course/index.ts` places `section27` first in the Phase‑2 sequence (`section27, section28 … section39`); S27 is unambiguously the 27th section.
**Method note (grammar dimension):** Applied the shared subplan `_GRAMMAR_SUBPLAN.md` (Fernández‑Huerta 1959, Szigriszt‑Pazos / INFLESZ, WPS / SPW, offline pedagogical heuristics, LanguageTool `es` via public API). Prose was extracted from the TS source with a structural parser (`audits/S27_records.json`, 320 raw string records → 180 learner‑facing prose records after filtering code, IDs, and English‑only scaffolding). Sentence metrics in `audits/S27_prose.json` (299 sentences). LanguageTool chunked in 2 ≤18 k‑char requests → `audits/S27_lt.json` (495 raw matches, 17 non‑trivial after false‑positive filtering). Aggregate in `audits/S27_aggregate.json`.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| `id` | `"async-concurrency"` ⚠️ **stale slug** — content is about pytest, not async/concurrency (see §4). |
| `index` | 27 |
| `title` | `"Estrategia de pruebas con pytest"` |
| `shortTitle` | `"Pytest y contratos"` |
| `tagline` | `"Convertir supuestos de normalización y matching en contratos ejecutables con pytest; cada bug reproducido deja un test de regresión"` |
| `estimatedHours` | 19 |
| `level` | `Competente` ⚠️ **inconsistent with phase label** — Phase 2 is "Senior" in `index.ts` and `PHASES[2].level === "Senior"`, but the section declares `level: "Competente"`. (See §3.8 / §7.) |
| `phase` | 2 |
| `icon` / `accentColor` | `FlaskConical` / violet→purple gradient |
| Subtopics | S27‑T1‑A (Riesgos y pirámide), S27‑T1‑B (AAA y oráculos), S27‑T2‑A (Discovery y assertions), S27‑T2‑B (Fixtures, scopes y aislamiento), S27‑T3‑A (Bordes: excepciones/floats/fechas/tmp), S27‑T3‑B (Negativos y mensajes), S27‑T4‑A (Cobertura por rama y riesgo), S27‑T4‑B (Mutación conceptual y mantenimiento) — 8 subtopics |
| Theory blocks | 8 (one per subtopic), each with heading + 3 paragraphs + Python `code` block (with `output`) + callout (info / tip / warning / danger) |
| `iDo` | 8 demos (one per subtopic) with `demoId`, `subtopicId`, `environment: "local-python"`, `description`, `code`+`output`, `why` |
| `weDo` | 24 exercises (3 per subtopic, kinds: `guided` → `independent` → `transfer`), each with `id`, `subtopicId`, `kind`, `instruction`, `hint`, `hints[2]`, `edgeCases`, `tests`, `feedback`, `starterCode` (with `# DEFECT:` marker), `solutionCode`+`output` |
| `youDo` | 1 capstone: `title`, `context`, 5 `objectives`, 5 `requirements`, `starterCode` skeleton, `portfolioNote`, `rubric` (6 weighted criteria summing to 100 %) |
| `selfCheck` | 5 multiple‑choice questions (4 options each) with `explanation` |
| `resources` | 7 docs (pytest ×4, coverage.py, unittest.mock, Real Python), 2 books (Okken, Khorikov), 4 courses (Coursera, MIT 6.100L, CS50P, pytest tutorial) |

Scope of the audit: all learner‑facing Spanish prose in the above fields, plus the Python code blocks as evidence of contract consistency. Pure Python `code` / `starterCode` / `solutionCode` bodies were excluded from grammar scoring (per the subplan) but were inspected for meta‑leak and pedagogical alignment.

---

## 2. Executive Summary of Quality

**Overall score: 7.6 / 10** — *A pedagogically strong, grammar‑clean Phase‑2 opener undermined by one cosmetic but persistent identity mismatch (stale `id="async-concurrency"` + file name `s27-async-concurrency.ts` on a pytest section — same curriculum‑wide id‑drift pattern already flagged for S36) and one `level` metadata inconsistency (`Competente` vs Phase‑2 `Senior`).*

**Verdict.** S27 is one of the better‑structured sections in the Senior phase: the I‑Do / We‑Do / You‑Do fidelity is exemplary (8 demos ↔ 8 subtopics ↔ 24 exercises in a clean 3‑tier `guided → independent → transfer` ladder; capstone rubric sums to 100 %). The content is technically coherent with the v3 roadmap ("S27 — Estrategia de pruebas con pytest", "Inicio CP-N3-A") and the live rendered page matches the source file word‑for‑word. Real Spanish‑grammar defects are sparse: one `PORQUE` rule ("el *por qué*" → "el *porqué*"), one `COMMA_PERO` slip ("correcto pero el mensaje" → "correcto, pero el mensaje"), one prefix‑style issue ("re‑correr" → "re‑ejecutar / volver a correr"), one gender‑concordance inconsistency on the borrowed noun `fixture` (mostly masculine "un fixture", once feminine "una fixture"), one unspaced em‑dash ("pytest—no scripts" → "pytest —no scripts—" / "pytest: no scripts"), and a small set of typography slips (11 "N%" → "N %"; "2 a.m." → "2 a. m." or "2:00 h"). The readability profile is healthy: 299 sentences with mean WPS = 13.6 (median 12, p90 23), SPW = 1.89, mean Fernández‑Huerta = 79.4 ("algo fácil" band — appropriate for senior‑level technical Spanish). Nine sentences cross the 32‑word "long" threshold and the worst run‑on is the 44‑word `jobRelevance` opener — splitting it would resolve both readability and cognitive load. No TODO / FIXME / HACK / AI‑authorship leaks were detected, and the only meta‑leak‑class finding is the bilingual "We Do" reference inside the I‑Do intro (intentional pedagogical method name, not a leak). **The headline defect is structural identity, not prose**: the slug `async-concurrency` (still used as the URL hash on the live site, e.g. `https://pillb.github.io/pyarcana/#async-concurrency`) and the file name `s27-async-concurrency.ts` are leftovers from an earlier draft where S27 was about async/concurrency — that topic now lives in S38 ("Concurrencia y resiliencia"). This is the kind of stale metadata that breaks deep‑linking, search, and learner mental models, and should be the first fix.

| Dimension | Score | Notes |
|---|---|---|
| Meta‑leak detection | 7.0 / 10 | No TODO/FIXME/AI residue. One **structural meta‑leak**: `id="async-concurrency"` + file name `s27-async-concurrency.ts` on a pytest section. `CASO-LIM-027` tags visible to learner are arguably internal‑label residue but defensible. |
| Grammar (es‑PE) | 8.0 / 10 | 1 real `PORQUE` slip; 1 `COMMA_PERO`; 1 prefix style ("re-correr"); 1 gender inconsistency on `fixture`; 1 unspaced em‑dash; typography slips on `%` and `a.m.`; 9 long sentences (no run‑ons). |
| Connective tissue / flow | 8.5 / 10 | Each theory block opens with a callback to the previous subtopic ("En S26 orquestaste el VP…", "Si mezclas el setup con el assert…", "No inviertas la pirámide…"). Strong. |
| I Do / We Do / You Do fidelity | 9.5 / 10 | 8 demos ↔ 8 subtopics ↔ 24 exercises (3 each); You‑Do rubric sums to 100 %. Gold‑standard. |
| Cognitive load & progressive disclosure | 7.5 / 10 | Acronym density (CP‑N3‑A, AAA, ER, RUC, RPA, HITL, CI, E2E, KPI, IEEE‑754, README…) is high but appropriate for a Senior‑phase opener. Two long sentences in `jobRelevance` (44w, 42w) front‑load the entire section's outcomes. |
| Exercise / exam quality | 9.5 / 10 | DEFECT‑marked `starterCode` with intentional bug + 3‑tier `hints` + `edgeCases` + `tests` + `feedback` = excellent. Self‑check MCQs have plausible distractors and tied explanations. |
| Roadmap consistency | 6.0 / 10 | Content matches v3 roadmap ("S27 — Estrategia de pruebas con pytest", "Inicio CP-N3‑A"). **But:** `id`/file‑name still say `async-concurrency` (now S38's topic), `level: "Competente"` contradicts `PHASES[2].level === "Senior"`, and the old master roadmap (`el_arte_de_python_roadmap_maestro_52_secciones.md` line 259) still labels S27 as "Advanced ML Pipelines in Production Contexts" — three roadmap documents, three different S27 identities. |
| Comparison with best‑in‑class external | 8.5 / 10 | Okken, Khorikov, coverage.py, Real Python, MIT 6.100L, CS50P all cited in `resources`. Content aligns with industry‑standard pytest pedagogy (AAA, parametrize, fixtures, mutation testing concept). |
| Other (accessibility, motivation) | 8.0 / 10 | PE context (RUC, `@example.pe`, bancos/fintech/retail peruanos) is well localised. No TODOs. No accessibility annotations inside this TS (UI layer out of scope). |

---

## 3. Detailed Issue Registry

> Severity key — **H** = blocks learning or grammar correctness / breaks structure; **M** = erodes quality / style; **L** = polish.

### 3.1 Meta‑text / developer leakage

| # | Severity | Location (line in source) | Evidence quote | Pedagogical impact |
|---|---|---|---|---|
| M1 | **M** | `id: "async-concurrency"` (line 4) and file name `s27-async-concurrency.ts` (path) and URL hash `#async-concurrency` (live site) | `id: "async-concurrency"` while `title: "Estrategia de pruebas con pytest"` and `shortTitle: "Pytest y contratos"` | The URL fragment a learner sees on the live site is `https://pillb.github.io/pyarcana/#async-concurrency` while the page renders "Sección 27 · Pytest y contratos". A learner who bookmarks, shares, or searches "async concurrency pyarcana" lands on a pytest page. The actual concurrency content is in S38. Same curriculum‑wide id‑drift pattern already flagged for S36 (`id: "ai-apis-advanced"` on a clustering section). **Caution:** renaming `id` may break persisted learner state if the app keys progress on `id` — see D1 for the safe variant. |
| M2 | **M** | `level: "Competente"` (line 11) vs `PHASES[2].level === "Senior"` (`src/lib/course/index.ts` line 92) | `level: "Competente"` inside a `phase: 2` section | The Phase‑2 metadata in `index.ts` declares level "Senior"; S27 (the Phase‑2 opener) still self‑declares "Competente". Either the section should be "Senior" (consistent with phase) or the Phase‑1→2 transition is intended to be gradual (in which case S28–S39 should also say "Competente" — they don't on the live site). |
| M3 | **L** | All 24 We‑Do `starterCode` first comments, e.g. line 615 `# CASO-LIM-027 · risk = impact*likelihood` | `# CASO-LIM-027 · …` appears 24 times in `starterCode` (and once in `weDo.intro` line 562) | The internal curriculum code `CASO-LIM-027` is exposed to the learner as a code‑comment header. Useful as a reference tag, but reads as authoring‑system residue; learners may wonder what `CASO-LIM` means. Same pattern as S26; consistent across Phase‑1/Phase‑2. |
| M4 | **L** | `iDo.intro` (line 561) | `"…y el *por qué* de cada demo antes de tocar los We Do."` | The I‑Do intro references "los We Do" by their pedagogical method name. This is intentional (the course uses "I Do / We Do / You Do" as a brand) and consistent with the homepage tab labels ("Yo hago / Hacemos juntos / Tú haces"). Not a true leak, but the italics on `*por qué*` (see §3.2 G1) compound the issue. |
| M5 | — | whole file | No TODO / FIXME / XXX / HACK / DRAFT / WIP / placeholder / "moved from section X" / "[author" / "[editor" / "internal" residue; no AI‑authorship markers; no Copilot/ChatGPT fingerprints. | Clean. |

### 3.2 Grammatical correctness & redaction quality (es‑PE)

| # | Severity | Rule (LT or heuristic) | Evidence quote (source location) | Pedagogical impact |
|---|---|---|---|---|
| G1 | **M** | `PORQUE` (LT GRAMMAR) | `iDo.intro` line 561: `"…y el *por qué* de cada demo antes de tocar los We Do."` | RAE: the noun "the reason / the why" is **`el porqué`** (one word, masculine). "por qué" (two words) is the interrogative "why" (e.g., "¿por qué?"). Author wrote "el *por qué*" → should be "el *porqué*" or rephrase as "la *razón* de cada demo" / "el *motivo* de cada demo". |
| G2 | **M** | `COMMA_PERO` (LT GRAMMAR) | `weDo.steps[15].feedback` (S27‑T3‑A‑E2): `"pytest.raises(..., match=) falla si el tipo es correcto pero el mensaje no cuadra: el fragmento es parte del contrato."` | When `pero` connects two clauses with different subjects (`el tipo` vs `el mensaje`), Spanish requires a comma before `pero`: `"…el tipo es correcto, pero el mensaje no cuadra…"`. Currently the comma is missing. |
| G3 | **M** | Heuristic: non‑standard prefix hyphenation (`NO_SEPARADO` LT, false‑positive on intent) | `theory[3].paragraphs[0]` (line 124): `"Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten re-correr solo el fallido con …"` | RAE: the prefix `re‑` attaches directly to the verb without a hyphen → `recorrer`. But `recorrer` already means "to traverse", not "to run again". The author meant "re‑run" — best Spanish is `re-ejecutar` (also no hyphen per RAE: `reejecutar`) or `volver a correr`. The current `re-correr` is a non‑standard English calque that confuses Spanish readers and triggers a LT misspelling flag. |
| G4 | **M** | Heuristic: gender concordance inconsistency on borrowed noun `fixture` | `selfCheck.questions[4].question` line ~1568: `"¿Cuál es el scope por defecto de **una fixture** de pytest…"` vs 3× `"un fixture"` (lines 209, 218, ~1305) vs `"Las **fixtures**"` (line 204) and `"factory fixtures"` (line 213) | The author treats `fixture` inconsistently: masculine singular ("un fixture session"), feminine singular ("una fixture"), feminine plural ("Las fixtures"). RAE / Fundéu guidance for borrowed English nouns ending in consonant: default masculine ("el fixture", "los fixtures"). The single feminine "una fixture" in the self‑check question is a concordance slip against the rest of the file. |
| G5 | **M** | Heuristic: unspaced em‑dash (Spanish raya) | `jobRelevance` line 16: `"…son **contratos ejecutables** con pytest—no scripts que "pasaron una vez en mi laptop"."` | Spanish typography requires the raya (—) used as parenthetical to be spaced: `pytest —no scripts—` (with spaces around both dashes if the inciso closes), or `pytest: no scripts` (colon form). The unspaced `pytest—no` is an English‑style em‑dash calque. Same content uses the correct spaced form elsewhere (`sintético — inicio de CP-N3-A`). |
| G6 | **L** | `SIGLAS` (LT MISSPELLING) | `theory[5].paragraphs[2]` line 274: `"Dos APIs: (1) `TemporaryDirectory()` borra…"` | RAE: acronyms are invariable in Spanish → "Dos API". Fundéu accepts "las APIs" or "las API" as a tolerated industry form; the course rubric grades on `es-PE profesional`, so the author should pick one convention and apply it consistently. The file uses "APIs" once (here) and "API" elsewhere — light inconsistency. |
| G7 | **L** | Heuristic: typography of percentage | 11 occurrences of `N%` without space, e.g. line 348 `"100% de **líneas** no implica 100% de riesgo cubierto…"`, line 354 `"¿llegamos al 90% de líneas?"`, line 352 `"meta vacía del 100%"` | RAE recommends `100 %` (with a space) when the symbol is used in prose. The rubric weights `"25%"` etc. are CSS‑like data, not prose, and can stay. The 6 prose occurrences should be `100 %` / `90 %`. |
| G8 | **L** | Heuristic: typography of `a.m.` / `p.m.` | `theory[3].paragraphs[0]` line 124: `"…cuando falla la suite a las 2 a.m.: solo ves "falló algo de normalize"."` | RAE prefers `2 a. m.` (with periods and a space) or `2 h` / `2:00 h`. The current `2 a.m.` is an English‑style calque. Style polish. |
| G9 | **L** | Heuristic: long sentence (32+ words, no run‑ons >45) | 9 sentences cross the 32‑word threshold. Worst: `jobRelevance` opener (44w, FH=43.3): `"En esta sección inicias CP-N3-A: priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos, aíslas datos con fixtures, cubres bordes (excepciones, floats, fechas, tmp) y demuestras con mutación conceptual que la suite realmente protege el contrato."` | The 44‑word `jobRelevance` opener front‑loads every learning outcome into a single comma‑chained sentence (5 commas). Splitting at "fixtures." would create two balanced sentences and lift FH by ~10 points. The 41‑word `youDo.context` paragraph and 41‑word `theory[6].paragraphs[0]` ("Branch coverage mide…") are similar. |
| G10 | **L** | Heuristic: comma density ≥5 | 4 sentences: `jobRelevance` opener (5 commas, 44w); `theory[0].paragraphs[2]` "Orden de aprendizaje" (6 commas, 32w); `weDo.intro` (5 commas, 28w); `weDo.steps[21].instruction` (artifactual, code‑stripped). | The two real prose cases (`jobRelevance` opener and "Orden de aprendizaje") are list‑style enumerations dressed as prose. Converting them to a bulleted list or `→` chain (already partially done in "Orden de aprendizaje") would resolve the density. |
| G11 | **L** | Heuristic: anaphoric monotony / repeated catch‑phrases | "teatro de cobertura" ×3, "teatro de verde" ×2, "teatro" ×7, "confianza falsa" ×2, "suerte empaquetada" ×1, "clerical queue" ×6, "merge request del colega" ×1 | The phrase "teatro (de cobertura / de verde / teatro sin más)" is the section's leitmotiv — pedagogically effective as a meme, but verges on formula when it appears in 5+ callouts. "Confianza falsa" appears twice in adjacent paragraphs (`theory[1].paragraphs[2]` and `theory[1].paragraphs[3]`). Style polish. |
| G12 | **L** | `AGREEMENT_DET_NOUN` (LT, false‑positive on borrowed term) | `theory[3].paragraphs[1]` line 134: `"Las **assertions** reescritas de pytest muestran diff útil…"` | LT flags "Las assertions" → "La assertion" (sigla/plural rule). Industry usage tolerates "las assertions". Same convention as G6 — pick one and apply consistently. |
| G13 | **L** | Heuristic: anglicism borrowings (acceptable but worth noting) | `demo` ×10, `starter` ×26 (mostly in `starterCode` field name, but also `"El starter X"` ×3 in feedback), `lab` ×1 (`"En este lab"`, line 134), `merge` ×2 (`"merge request"`, `"el merge"`), `badge` ×1, `runner` ×2, `flakes` ×4, `pretty-print` ×1, `happy path` ×1, `code review` ×2 | Consistent with Phase‑1 borrowings (S26 audit also flagged "Thinking aloud" + borrowed nouns). In a Senior‑phase Python‑testing section these borrowings are industry‑standard and pedagogically defensible — `pytest`, `fixture`, `flake`, `runner`, `badge` are untranslatable without losing precision. Style note only. |

### 3.3 Connective tissue & narrative flow

| # | Severity | Location | Evidence | Impact |
|---|---|---|---|---|
| C1 | **L** | `theory[0].paragraphs[0]` line 33 | `"En S26 orquestaste el VP con evidencia por estado (RPA + analista HITL). Ese pipeline **asume** que `normalize_name` y el matching se comportan igual mañana que hoy."` | Strong backward link to S26. Excellent. |
| C2 | **L** | `theory[0].paragraphs[2]` line 35 | `"Orden de aprendizaje: **T1 Diseño** (pirámide, riesgo, AAA y oráculos) → **T2 Pytest** (discovery, asserts, fixtures y scopes) → **T3 Bordes** (excepciones, floats, fechas, tmp, negativos) → **T4 Cobertura** (ramas de negocio y mutación conceptual)."` | Excellent forward map of the section's 4 tracks. Could be a `<ol>` for screen readers, but as prose it works. |
| C3 | **L** | `theory[7].paragraphs[2]` (last theory paragraph) | `"…Política del ciclo: **bug_repro → regression_test** antes de cerrar el ticket. En S28 ampliarás estos contratos con dobles (`unittest.mock`) y pruebas de integración entre módulos del motor ER."` | Strong forward link to S28. Excellent. |
| C4 | **L** | `theory[0].callout` line 47 | `"Datos seguros (vale para toda la sección): Fixtures y ejercicios usan solo contactos sintéticos `@example.pe`…"` | The "vale para toda la sección" parenthetical is a mild authorial intrusion but pedagogically justified (it sets the data‑safety contract once for the whole section). Acceptable. |

Connective tissue is the section's strongest dimension. Every theory block opens with a backward or forward reference. No orphan subsections.

### 3.4 Pedagogical structure (I Do / We Do / You Do fidelity)

| # | Severity | Location | Evidence | Impact |
|---|---|---|---|---|
| P1 | — | Whole section | 8 `theory` blocks ↔ 8 `iDo.steps` ↔ 24 `weDo.steps` (3 per subtopic) ↔ 1 `youDo` capstone ↔ 5 `selfCheck.questions` | Gold‑standard I‑Do / We‑Do / You‑Do fidelity. Each subtopic has theory + 1 demo + 3 exercises (guided / independent / transfer). The capstone integrates all 4 tracks (T1‑T4) and the rubric sums to 100 %. |
| P2 | **L** | `weDo.intro` line 562 | `"24 ejercicios en tres capas por subtema: **E1 guiado** (micro-bug), **E2 independiente**, **E3 transferencia**. Cubren pirámide de riesgo, AAA/oráculos, discovery y parametrize, fixtures/scopes, bordes (isclose, raises+match, tempfile), negativos, cobertura de ramas y mutación conceptual."` | The intro front‑loads the entire exercise map in 2 sentences (the second is 28 words with 5 commas — see G10). Pedagogically effective as a map but high cognitive load for an opener. |
| P3 | **L** | `weDo.steps[*].starterCode` (24 exercises) | Every `starterCode` opens with a `# DEFECT: …` comment marking the intentional bug | Excellent "bug‑hunting" pedagogy. Each `feedback` explains why the fix works and ties it back to the contract. |
| P4 | **L** | `selfCheck.questions[4]` line ~1568 | 4 plausible distractors per question, all keyed to real misconceptions (e.g., Q3: "Si mutas un casefold y ningún test falla: … Está bien / El contrato es débil; el mutante sobrevivió / pytest está roto siempre / Ignora cobertura") | Excellent distractor design. Explanations are tied to specific contract concepts, not generic "see the docs". |
| P5 | **L** | `youDo.rubric` line ~1583 | 6 criteria summing to 100 % (25+20+20+15+10+10) | Clean rubric. No double‑weighting. The "Privacidad / sin PII real / sin secretos / sin inferencia de fraude" criterion (20 %) is the section's ethical anchor and is properly weighted. |

### 3.5 Cognitive load & progressive disclosure

| # | Severity | Location | Evidence | Impact |
|---|---|---|---|---|
| L1 | **M** | `jobRelevance` line 16 | 2 sentences, 42w + 44w = 86w total | The first learner‑facing text on the page is a 44‑word comma‑chained enumeration of every learning outcome. New Phase‑2 learners (who just finished the Phase‑1 capstone S26) meet AAA, fixtures, mutación conceptual, isclose, raises+match, tmp_path, bug_repro, regression_test, CP‑N3‑A all in one breath. Splitting improves first‑impression readability. |
| L2 | **L** | `theory[1].paragraphs[2]` line 75 | 35w sentence with parenthetical `(no la forma de la pirámide)` and a colon introducing a 3‑clause contrast | Manageable, but a list form ("`un bug en matching de entidades` / `un typo de log` / `un cambio de color en la UI`") would lower cognitive load. |
| L3 | **L** | Acronym density | CP‑N3‑A, AAA, ER, RUC, RPA, HITL, CI, E2E, KPI, IEEE‑754, PII, README, CLI, node id, RUN_ID, URL, JSON, CSV, UI, DB, SQL, RFC | 22 acronyms in 1 623 lines. Appropriate for a Senior‑phase section but no glossary callout. S26 has a "Diccionario rápido" callout; S27 does not. |

### 3.6 Exercise and exam quality and alignment

| # | Severity | Location | Evidence | Impact |
|---|---|---|---|---|
| E1 | — | All 24 `weDo.steps` | Each exercise has: `id` (e.g. `S27-T1-A-E1`), `subtopicId`, `kind` (guided/independent/transfer), `instruction` with the exercise code (e.g. `S27-T1-A-E1 · El score de riesgo es `impact * likelihood`. Con impact=5 y likelihood=4…`), `hint` + 2 `hints`, `edgeCases` (1‑2 each), `tests` (1 line), `feedback` (1‑2 sentences), `starterCode` with `# DEFECT:` marker, `solutionCode` + `output` | Exemplary structure. The DEFECT‑marker pedagogy is consistent with S26 and earlier sections. |
| E2 | **L** | `weDo.steps[*].tests` | All 24 `tests` are 1‑line plain‑text descriptions of the expected output (e.g. `"score numérico = 20"`, `"lista de nombres unit before que e2e"`) | The `tests` field is a prose contract, not an executable test. This is consistent with the course's "dual‑track honesto" model (pytest on the learner's machine; assert+print in the course runner) but learners expecting executable tests in the `tests` field will be confused. The `weDo.intro` does explain this, but a one‑line tooltip would help. |
| E3 | **L** | `weDo.steps[1].tests` (S27‑T1‑A‑E2) | `"lista de nombres unit before que e2e"` | English word `before` slipped into a Spanish `tests` description. Should be `"lista de nombres unit antes que e2e"`. Minor anglicism in a learner‑facing field. |
| E4 | — | `selfCheck.questions` | 5 MCQs covering: pyramid base (Q1), oracle definition (Q2), mutation testing (Q3), ethical scope of matching (Q4), fixture scope default (Q5) | Excellent coverage of the 4 tracks. Q4 ("Las pruebas de matching en CP‑N3‑A demuestran: … Contratos de misma entidad / normalización — no riesgo ni relación") is the ethical‑anchor question and is well‑placed. |

### 3.7 Consistency with the overall roadmap and previous sections

| # | Severity | Location | Evidence | Impact |
|---|---|---|---|---|
| R1 | **H** | `id: "async-concurrency"` (line 4) vs v3 roadmap `learning_roadmap_52_V3.md` line 417 "S27 — Estrategia de pruebas con pytest" vs old master roadmap `el_arte_de_python_roadmap_maestro_52_secciones.md` line 259 "Sección 27 — Advanced ML Pipelines in Production Contexts" vs S38 (line 538 of v3) "S38 — Concurrencia, observabilidad y workflows resilientes" | Three roadmap documents describe S27 three different ways: (1) v3 = pytest ✓ matches content; (2) old master = ML pipelines ✗; (3) `id`/file‑name = async/concurrency ✗ (now lives in S38). | The v3 roadmap is the canonical source (matches the rendered live site and the TS content). The `id` and file name are stale. The old master roadmap should be archived or marked superseded. |
| R2 | **M** | `level: "Competente"` (line 11) vs `PHASES[2].level === "Senior"` (`index.ts` line 92) | S27 declares `Competente`; Phase 2 metadata declares `Senior` | Either S27 (and possibly S28) is a transition section (in which case the level field should document the transition), or the field should say `Senior`. S26 (Phase‑1 closer) is also `Competente`, so the transition happens at S27 — but then S27 is the first "Senior" section and should declare it. |
| R3 | **L** | `theory[0].paragraphs[0]` line 33 | `"En S26 orquestaste el VP con evidencia por estado (RPA + analista HITL)."` | Correct backward reference to S26's "VP RPA + AI Analyst" capstone. |
| R4 | **L** | `theory[7].paragraphs[2]` (last theory paragraph) | `"En S28 ampliarás estos contratos con dobles (`unittest.mock`) y pruebas de integración entre módulos del motor ER."` | Correct forward reference to S28 ("Pruebas de datos, propiedades e integración"). |
| R5 | **L** | `youDo.requirements[4]` | `"Inicio de CP-N3-A: contratos del motor ER listos para ampliar con dobles en S28"` | Correct capstone‑chain reference (CP‑N3‑A → S28 → S30 "cierre CP-N3-A"). |

### 3.8 Comparison with best‑in‑class external materials

| # | Severity | Aspect | S27 | Best‑in‑class | Verdict |
|---|---|---|---|---|---|
| X1 | — | AAA + oracles | "Arrange–Act–Assert y oráculos confiables" (theory[2]) | Khorikov "Unit Testing Principles" Ch. on assertions and oracles; Okken "Python Testing with pytest" Ch. 4 | Equivalent. S27's three‑oracle taxonomy (fixed value / invariant / reference algorithm) is a useful synthesis not found verbatim in either source. |
| X2 | — | Mutation testing | "Mutación conceptual, fallas útiles y mantenimiento" (theory[7]) | Khorikov Ch. on mutation testing; cosmic‑ray framework docs | S27 deliberately stays at "mutación conceptual a mano" without introducing a framework — pedagogically appropriate for a section‑opener, with a clear bridge to deeper tooling in later sections. |
| X3 | — | Risk‑based prioritisation | "Riesgos y pirámide de pruebas" (theory[1]) | Cohn "Succeeding with Agile" pyramid; Crispin/Gregory "Agile Testing" | S27's `score = impacto × probabilidad` heuristic is a pragmatic distillation. The "Regla de bolsillo: score ≥ 15 → ≥ 5 tests de contrato; 8–14 → 2–3; < 8 → smoke + un negativo" is concrete and actionable. |
| X4 | — | Ethics / no‑PII / no‑fraude | Throughout (`@example.pe`, "no etiqueta fraude ni parentesco", "Matching solo responde: ¿son la misma entidad sintética?") | Most pytest tutorials skip ethics entirely | S27 is notably stronger than external materials here. The ethics callout is repeated enough to anchor the contract without becoming preachy. |
| X5 | **L** | Fixtures / scope | "Fixtures, scopes y aislamiento" (theory[3]) | Okken Ch. on fixtures; pytest docs how‑to/fixtures | S27 correctly covers `function`/`class`/`module`/`session` scopes, factory fixtures, and deepcopy isolation. The "session‑scope solo para recursos caros de solo lectura" rule is correctly stated. No gaps vs external best practice. |

---

## 4. Meta‑Leak Report

> Subplan requires a dedicated meta‑leak section listing exact leaked text + location.

| # | Severity | Exact leaked text | Location (line) | Verdict |
|---|---|---|---|---|
| 1 | **M** | `id: "async-concurrency"` (the field value) → propagates to URL hash `#async-concurrency` on the live site | Line 4 + URL fragment | **Cosmetic but persistent structural meta‑leak.** The section is about pytest, not async/concurrency. The `id` is leftover scaffolding from an earlier curriculum draft. The actual async/concurrency content lives in S38. A learner who bookmarks / shares / searches the URL gets the wrong topic name. **Caution:** renaming `id` may break persisted learner state if the app keys progress on `id` (same caveat as S36's `ai-apis-advanced`). Recommend: (a) short term — keep `id` stable, document the drift in a code comment; (b) medium term — add a `redirectFrom: ["async-concurrency"]` field and rename `id` to `pytest-strategy` with a migration. |
| 2 | **M** | File name `s27-async-concurrency.ts` (propagates to GitHub source URL and `import` statements in `index.ts` line 30) | File name | **Cosmetic structural meta‑leak.** Renaming the file requires updating `index.ts` and any imports, but is a one‑time fix with no persisted‑state risk (file name is a build‑time concern, not a runtime key). Safe to do. |
| 3 | **M** | `level: "Competente"` | Line 11 | **Real metadata inconsistency.** Phase 2 is "Senior" per `PHASES[2].level`. Either S27 is a transition (document it) or it should say `Senior`. |
| 4 | **L** | `# CASO-LIM-027 · …` (24× in `starterCode` + 1× in `weDo.intro`) | Lines 615, 638, 661, 684, 707, 730, 753, 776, 803, 826, 849, 872, 895, 918, 941, 964, 987, 1010, 1033, 1056, 1079, 1102, 1125, 1148, 1189 (24 in starterCode) + 562 (intro) | **Borderline.** Internal curriculum code exposed to learner. Defensible as a "case tag" but reads as authoring‑system residue. Same pattern as S26. |
| 5 | — | No TODO / FIXME / XXX / HACK / WIP / DRAFT / "moved from section X" / "[author" / "[editor" / "internal" / "placeholder" / AI‑authorship markers / Copilot fingerprints | whole file | Clean. |
| 6 | — | `# DEFECT: …` comments in `starterCode` (24×) | Lines 617, 640, 663, … | **Intentional pedagogical marker** (bug‑hunting pattern), not a leak. Consistent with S26 and earlier sections. |
| 7 | — | `iDo.intro` line 561: `"…y el *por qué* de cada demo antes de tocar los We Do."` | Line 561 | The phrase "los We Do" references the pedagogical method by its brand name — intentional, not a leak. The italics on `*por qué*` is a grammar issue (G1), not a leak. |

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do structural analysis

The section follows the gold‑standard structure observed in S26 (Phase‑1 capstone closer) and earlier Phase‑0/1 sections:

- **Theory** (8 blocks): Each block has `heading` + 3 `paragraphs` + Python `code` (with `title`, `code`, `output`) + `callout` (`info` / `tip` / `warning` / `danger` with `title` + `content`). The 8 callouts are well‑distributed: 2× `info` (data safety, coverage sense), 3× `tip` (risk first, isclose > ==, test_* names, mutation), 2× `warning` (oracle ≠ print, no secrets in messages), 1× `danger` (mutar fixture session). The callout severity ladder is used correctly: `danger` only for the most destructive anti‑pattern (session‑scope mutation).
- **I Do** (8 demos): Each demo has `demoId` (e.g. `S27-T1-A-DEMO`), `subtopicId`, `environment: "local-python"`, `description` (1 sentence), `code` (10–20 lines with `output`), `why` (1 sentence). The `why` field is the pedagogical anchor: every demo explains *why this matters*, not just *what it does*. This is excellent practice.
- **We Do** (24 exercises): 3 per subtopic in a strict `guided → independent → transfer` ladder. Each exercise has `instruction` (with `S27-TX-Y-EZ ·` prefix matching S26's pattern), `hint` (1 sentence), `hints` (2 hints, escalating specificity), `edgeCases` (1–2 cases), `tests` (1 line), `feedback` (1–2 sentences explaining the fix), `starterCode` with `# DEFECT:` marker, `solutionCode` + `output`. The DEFECT‑marker pedagogy is the course's signature pattern and is implemented cleanly.
- **You Do** (1 capstone): `title`, `context` (3 sentences), 5 `objectives`, 5 `requirements`, `starterCode` (35‑line skeleton with file layout, 4 implemented `test_*` functions, and a `__main__` block), `portfolioNote`, `rubric` (6 criteria summing to 100 %). The capstone integrates all 4 tracks (T1‑T4) and explicitly references CP‑N3‑A and S28 (forward link).
- **Self‑Check** (5 MCQs): Each with 4 options and `explanation`. Distractors are plausible and tied to real misconceptions (e.g. Q5's distractor "package: es el default de pytest y aísla mutables sin necesidad de deepcopy" is a believable wrong answer that tests whether the learner understood scope vs deepcopy).

### 5.2 Cognitive‑load audit per track

| Track | Subtopic | Cognitive load | Notes |
|---|---|---|---|
| T1 | S27‑T1‑A (Riesgos y pirámide) | Medium | `score = impacto × probabilidad` is intuitive; the "Regla de bolsillo" (≥15 → ≥5 tests; 8–14 → 2–3; <8 → smoke+1 neg) is concrete and actionable. |
| T1 | S27‑T1‑B (AAA y oráculos) | Medium | The three‑oracle taxonomy (fixed value / invariant / reference algorithm) is a useful synthesis. The "suerte empaquetada" metaphor is memorable. |
| T2 | S27‑T2‑A (Discovery y assertions) | Low | `test_*` discovery + `pytest.raises(..., match=)` are standard pytest. The "dual‑track honesto" model (pytest on learner's machine; assert+print in course runner) is clearly explained. |
| T2 | S27‑T2‑B (Fixtures, scopes) | Medium‑High | Scopes (`function`/`class`/`module`/`session`), factory fixtures, and deepcopy isolation in one block. The `danger` callout ("Mutar fixture session") is well‑placed. |
| T3 | S27‑T3‑A (Bordes) | High | 4 borders in one block: exceptions (`pytest.raises`+match), floats (`math.isclose`), dates (clock injection), tmp (`TemporaryDirectory` + `NamedTemporaryFile`). High density but each gets its own paragraph + demo + 3 exercises. |
| T3 | S27‑T3‑B (Negativos y mensajes) | Medium | Negative cases with `ValueError`/`TypeError` + message contracts. The `require_email` example is well‑chosen (covers None, wrong type, empty, missing @). |
| T4 | S27‑T4‑A (Cobertura) | Medium | Branch vs line coverage, risk coverage, "reporta como evidencia, no como meta vacía del 100 %". |
| T4 | S27‑T4‑B (Mutación) | Medium | Mutation testing at the conceptual level (no framework), useful‑failure dict pattern, bug_repro → regression_test cycle. Forward link to S28 (dobles / `unittest.mock`). |

### 5.3 Redaction quality per learner‑facing surface

| Surface | Verdict |
|---|---|
| `tagline` | Clean, 1 sentence, FH ≈ 65. |
| `jobRelevance` | **2 long sentences (42w + 44w).** Split recommended. FH = 49.7 / 43.3 ("bastante difícil"). |
| `learningOutcomes` (8 bullets) | Clean, action‑verb openings ("Priorizar…", "Escribir…", "Nombrar…", "Aislar…", "Cubrir…", "Diseñar…", "Reportar…", "Aplicar…"). |
| `theory[*].heading` (8) | Clean, descriptive ("Riesgos y pirámide de pruebas", "Arrange–Act–Assert y oráculos confiables"). |
| `theory[*].paragraphs` (24 total) | 9 long sentences (32–39w). 1 `re-correr` style slip (G3). 1 unspaced em‑dash (G5). Otherwise clean. |
| `theory[*].callout.content` (8) | Clean. The "Datos seguros (vale para toda la sección)" callout is a well‑placed scope marker. |
| `iDo.intro` | 1 long sentence (27w), 1 `por qué` slip (G1). |
| `iDo.steps[*].description` (8) | Clean, 1 sentence each. |
| `iDo.steps[*].why` (8) | Clean, 1 sentence each. Excellent practice. |
| `weDo.intro` | 2 sentences (28w + 25w), 5 commas in the first (G10). |
| `weDo.steps[*].instruction` (24) | Clean. Each opens with `S27-TX-Y-EZ ·` prefix. One anglicism: `tests` field "lista de nombres unit before que e2e" (E3). |
| `weDo.steps[*].hint` / `hints` (24×3) | Clean, escalating specificity. |
| `weDo.steps[*].feedback` (24) | 1 `COMMA_PERO` slip (G2). Otherwise clean. |
| `weDo.steps[*].edgeCases` (24) | Clean. Short fragments. |
| `weDo.steps[*].tests` (24) | Prose contracts (not executable). 1 anglicism (`before` instead of `antes`) in S27‑T1‑A‑E2 (E3). |
| `youDo.title` | Clean. |
| `youDo.context` | 3 sentences (27w + 16w + 41w). The 41w sentence (G9) is a list‑style enumeration dressed as prose. |
| `youDo.objectives` (5) | Clean, action‑verb openings. |
| `youDo.requirements` (5) | Clean. |
| `youDo.starterCode` | 35‑line skeleton, well‑commented. |
| `youDo.portfolioNote` | 1 long sentence (29w, FH = 42.8). |
| `youDo.rubric` (6 criteria) | Clean. Sums to 100 %. |
| `selfCheck.questions` (5) | 1 gender‑concordance slip (G4: "una fixture"). Otherwise clean. |
| `selfCheck.explanations` (5) | Clean. |
| `resources.docs/books/courses` | Clean. URL labels use spaced em‑dash ("pytest — Getting started"). |

---

## 6. Grammatical improvements and rewriting report (paragraph by paragraph, tab by tab)

> Per the verbatim instruction, this section gives before/after rewrites for every paragraph and every tab. Only sentences with a real finding are rewritten; sentences that are already clean are listed as "OK" to keep the audit complete but compact. Rewrites are proposals — **diffs are not applied** in this pass.

### 6.1 Theory tab — Block 1: "Estrategia pytest e inicio CP-N3-A" (S27‑T1 opener, no subtopicId)

**Paragraph 1** (line 33): "En S26 orquestaste el VP con evidencia por estado (RPA + analista HITL). Ese pipeline **asume** que `normalize_name` y el matching se comportan igual mañana que hoy. Si alguien "arregla" un `strip` o un umbral sin red de seguridad, el clerical queue hereda basura con confianza falsa. Aquí **inicias CP-N3-A**: conviertes esos supuestos en **contratos de prueba** con pytest, para que un refactor o un typo no rompa en silencio lo que ya automatizaste." — **OK** (5 sentences, 64w total, FH ≈ 70. Clean backward link to S26.)

**Paragraph 2** (line 34): "Trabajamos un módulo sintético sobre contactos fakes del caso **`CASO-LIM-027`** (run_id=`cpn3a-01`, correos `@example.pe`): sin PII real y **sin** auto-veredicto de fraude o parentesco. Cada bug reproducido debe dejar un test de regresión con oráculo fijo. Matching solo responde: ¿son la misma entidad sintética tras normalizar? El resto del curso (S28+) ampliará dobles e integración; hoy sellas la base unitaria." — **OK** (4 sentences, 60w, FH ≈ 75. The colon introducing a question is correct Spanish typography. The `¿...?` is paired correctly.)

**Paragraph 3** (line 35): "Orden de aprendizaje: **T1 Diseño** (pirámide, riesgo, AAA y oráculos) → **T2 Pytest** (discovery, asserts, fixtures y scopes) → **T3 Bordes** (excepciones, floats, fechas, tmp, negativos) → **T4 Cobertura** (ramas de negocio y mutación conceptual). Dual-track honesto: en tu máquina `python -m pytest -q`; en este entorno del curso ejecutamos el **mismo contrato** como módulo con `assert` + `print` cuando no invocas el CLI. No hay teatro de "pytest sin pytest": verás formas `test_*` reales aunque el runner del curso no sea el CLI." — **M (G10: 32w, 6 commas in sentence 1).**

  *Before (sentence 1):* `"Orden de aprendizaje: **T1 Diseño** (pirámide, riesgo, AAA y oráculos) → **T2 Pytest** (discovery, asserts, fixtures y scopes) → **T3 Bordes** (excepciones, floats, fechas, tmp, negativos) → **T4 Cobertura** (ramas de negocio y mutación conceptual)."`
  *After (as bulleted list — proposal):*
  ```
  Orden de aprendizaje:
  - **T1 Diseño** — pirámide, riesgo, AAA y oráculos.
  - **T2 Pytest** — discovery, asserts, fixtures y scopes.
  - **T3 Bordes** — excepciones, floats, fechas, tmp, negativos.
  - **T4 Cobertura** — ramas de negocio y mutación conceptual.
  ```
  *After (as two sentences — alternative):* `"Orden de aprendizaje: cuatro tracks en secuencia. **T1 Diseño** (pirámide, riesgo, AAA y oráculos) → **T2 Pytest** (discovery, asserts, fixtures y scopes) → **T3 Bordes** (excepciones, floats, fechas, tmp, negativos) → **T4 Cobertura** (ramas de negocio y mutación conceptual)."`

**Callout** (line 41, type `info`): "Fixtures y ejercicios usan solo contactos sintéticos `@example.pe`. Una prueba de similitud **no** etiqueta fraude ni parentesco. Esa ética queda fijada aquí: no la repitas en cada párrafo; sí aplícala en cada assert y mensaje de error." — **OK** (3 sentences, FH ≈ 80. The "no la repitas en cada párrafo; sí aplícala" antithesis is pedagogically tight.)

### 6.2 Theory tab — Block 2: "Riesgos y pirámide de pruebas" (S27‑T1‑A)

**Paragraph 1** (line 64): "La **pirámide** prioriza muchas pruebas unitarias baratas, menos de integración y pocas E2E. El **riesgo** reordena el tiempo (no la forma de la pirámide): un bug en matching de entidades justifica más tests que un typo de log o un cambio de color en la UI de revisión. Si solo mides "número de tests", puedes hinchar la base con asserts triviales y dejar sin contrato la rama que mueve el clerical queue." — **M (G9: sentence 2 is 35w).**

  *Before (sentence 2):* `"El **riesgo** reordena el tiempo (no la forma de la pirámide): un bug en matching de entidades justifica más tests que un typo de log o un cambio de color en la UI de revisión."`
  *After:* `"El **riesgo** reordena el tiempo (no la forma de la pirámide). Un bug en matching de entidades justifica más tests que un typo de log o un cambio de color en la UI de revisión."` (split into two sentences at the colon)

**Paragraph 2** (line 65): "Clasifica riesgo por **impacto** (datos incorrectos, regresión silenciosa en el clerical queue, merge de entidades sintéticas mal hecha) y **probabilidad** (código tocado a menudo, reglas frágiles, historial de bugs). En entity resolution, normalización y comparadores son capa de alto riesgo: si fallan, el resto del pipeline hereda basura con confianza falsa y nadie nota el drift hasta que un humano revisa a ciegas." — **M (G9: sentence 1 is 29w, sentence 2 is 34w; G11: "confianza falsa" repeats from block 1 ¶1).**

  *Before (sentence 1):* `"Clasifica riesgo por **impacto** (datos incorrectos, regresión silenciosa en el clerical queue, merge de entidades sintéticas mal hecha) y **probabilidad** (código tocado a menudo, reglas frágiles, historial de bugs)."`
  *After:* `"Clasifica riesgo por **impacto** y **probabilidad**. Impacto: datos incorrectos, regresión silenciosa en el clerical queue, merge de entidades sintéticas mal hecho. Probabilidad: código tocado a menudo, reglas frágiles, historial de bugs."` (Note: also fixed "mal hecha" → "mal hecho" to agree with "merge" — `merge` is borrowed masculine per Fundéu.)

  *Before (sentence 2):* `"En entity resolution, normalización y comparadores son capa de alto riesgo: si fallan, el resto del pipeline hereda basura con confianza falsa y nadie nota el drift hasta que un humano revisa a ciegas."`
  *After:* `"En entity resolution, normalización y comparadores son capa de alto riesgo. Si fallan, el resto del pipeline hereda basura con confianza falsa y nadie nota el drift hasta que un humano revisa a ciegas."` (split at the colon)

**Paragraph 3** (line 66): "No inviertas la pirámide: una batería de E2E lentas no sustituye contratos unitarios de `strip`/`casefold`. Heurística práctica: **score = impacto × probabilidad**; ordena áreas y reparte más casos a las de mayor score. Ejemplo sintético de este caso: `normalize_name` (5×4=20) > `exact_match` (5×3=15) > repo SQL > cola UI. Regla de bolsillo para el equipo: score ≥ 15 → ≥ 5 tests de contrato; 8–14 → 2–3; < 8 → smoke + un negativo. El score no es ciencia exacta: es una cola de prioridad honestable en la retro del sprint." — **OK** (5 sentences, FH ≈ 65. The numeric example and the "Regla de bolsillo" are concrete and actionable. The colon usage is correct.)

### 6.3 Theory tab — Block 3: "Arrange–Act–Assert y oráculos confiables" (S27‑T1‑B)

**Paragraph 1** (line 95): "**AAA** separa preparación (Arrange), ejecución (Act) y verificación (Assert). Si mezclas el setup con el assert, un fallo no te dice si se rompió el dato de entrada, la función bajo prueba o el comparador: pierdes tiempo en CI y en code review. Un test AAA legible se lee en 10 segundos: "dado este raw sintético, al normalizar, espero este oráculo"." — **M (G9: sentence 2 is 34w; LT false‑positive on "bajo prueba" — actually fine but worth noting).**

  *Before (sentence 2):* `"Si mezclas el setup con el assert, un fallo no te dice si se rompió el dato de entrada, la función bajo prueba o el comparador: pierdes tiempo en CI y en code review."`
  *After:* `"Si mezclas el setup con el assert, un fallo no te dice si se rompió el dato de entrada, la función bajo prueba o el comparador. Pierdes tiempo en CI y en code review."` (split at the colon)

**Paragraph 2** (line 96): "Un **oráculo** es la fuente de verdad del assert: (1) valor fijo conocido (`"juan pérez"`), (2) propiedad invariante (longitud ≥ 0 tras normalizar; idempotencia de `normalize_name`) o (3) resultado de un algoritmo de referencia simple que confías más que el código bajo prueba. En matching, el oráculo **no** es un veredicto de fraude ni de parentesco: solo responde si dos cadenas normalizadas son la misma entidad sintética bajo el contrato de igualdad." — **M (G9: sentence 1 is 39w).**

  *Before (sentence 1):* `"Un **oráculo** es la fuente de verdad del assert: (1) valor fijo conocido (`"juan pérez"`), (2) propiedad invariante (longitud ≥ 0 tras normalizar; idempotencia de `normalize_name`) o (3) resultado de un algoritmo de referencia simple que confías más que el código bajo prueba."`
  *After (as a definition + list — proposal):* `"Un **oráculo** es la fuente de verdad del assert. Tres tipos sirven en ER: (1) valor fijo conocido (`"juan pérez"`); (2) propiedad invariante (longitud ≥ 0 tras normalizar; idempotencia de `normalize_name`); (3) resultado de un algoritmo de referencia simple que confías más que el código bajo prueba."`

**Paragraph 3** (line 97): "Oráculos frágiles generan *flakes* (tests que fallan al azar): reloj real (`datetime.now()`), orden de un `set`, JSON sin `sort_keys`, red o disco no mockeados. Usa contactos sintéticos deterministas (`ana@example.pe`) y fechas literales (`date(2026, 7, 20)`). Si el assert depende del azar, del entorno o del orden de inserción, no es contrato: es suerte empaquetada." — **OK** (3 sentences, FH ≈ 78. The "suerte empaquetada" metaphor is memorable.)

### 6.4 Theory tab — Block 4: "Discovery y assertions de pytest" (S27‑T2‑A)

**Paragraph 1** (line 124): "pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten re-correr solo el fallido con `pytest path::test_name -q`. Sin naming estable no puedes apuntar a un contrato concreto cuando falla la suite a las 2 a.m.: solo ves "falló algo de normalize"." — **M (G3: "re-correr"; G8: "2 a.m.").**

  *Before (sentence 2):* `"Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten re-correr solo el fallido con `pytest path::test_name -q`."`
  *After:* `"Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten **volver a correr** solo el fallido con `pytest path::test_name -q`."` (replace `re-correr` with `volver a correr`; alternatively `re-ejecutar` per RAE's no‑hyphen rule, though `reejecutar` is also valid)

  *Before (sentence 3):* `"Sin naming estable no puedes apuntar a un contrato concreto cuando falla la suite a las 2 a.m.: solo ves "falló algo de normalize"."`
  *After:* `"Sin naming estable no puedes apuntar a un contrato concreto cuando falla la suite a las 2 a. m.: solo ves "falló algo de normalize"."` (RAE: `a. m.` with periods and space)

**Paragraph 2** (line 125): "Las **assertions** reescritas de pytest muestran diff útil: `assert a == b` explica ambos lados sin escribir mensajes a mano. Para excepciones esperadas usa `pytest.raises(Tipo, match="fragmento")`. En este lab, si aún no instalas pytest, modelamos el **mismo contrato** con try/except + comprobación de mensaje: el aprendizaje es el criterio (tipo + fragmento), no la magia del import." — **OK** (3 sentences, FH ≈ 70. "lab" is borrowed English; acceptable in tech context.)

**Paragraph 3** (line 126): "Parametriza con `@pytest.mark.parametrize` (o una tabla de tuplas en un bucle) para casos de normalización sin copiar el cuerpo del test. Una tabla `(entrada, esperado)` es el corazón de los contratos de `normalize_name` y `exact_match`: cada fila es un node id conceptual; si falla la fila 7, sabes exactamente qué raw sintético rompió el oráculo." — **OK** (2 sentences, FH ≈ 72.)

### 6.5 Theory tab — Block 5: "Fixtures, scopes y aislamiento" (S27‑T2‑B)

**Paragraph 1** (line 204): "Las **fixtures** inyectan dependencias (datos sintéticos, `tmp_path`, relojes fijos) **sin globals** ni setup copiado en cada test. En pytest real escribes `@pytest.fixture` y el nombre del parámetro de la función de test recibe el valor. El **scope por defecto es function**: cada test recibe setup fresco; eso es lo que hace que la suite sea orden-independiente." — **OK** (3 sentences, FH ≈ 75. The "orden-independiente" hyphenation is borderline — RAE prefers "ordindependiente" but the compound is non‑standard; current form is acceptable.)

**Paragraph 2** (line 205): "Scopes: `function` (default), `class`, `module`, `session`. Un fixture session mutado contamina toda la suite y produce *flakes* de orden ("pasa solo si corre después de X"). Session-scope solo para recursos caros de **solo lectura** (catálogo estático, configuración inmutable, conexión de lectura a un dataset de fixtures). Si necesitas mutar, vuelve a function o usa una factory." — **L (G4: "una factory" — borrowed noun gender inconsistent with rest of file which uses "la factory" / "una factory" feminine; here it's feminine, consistent within this paragraph).** Actually "una factory" is internally consistent with "Las factory fixtures" (line 213) and "La factory fixture" (line 562). Only the `fixture` noun itself flips gender. OK as written.

**Paragraph 3** (line 206): "Las **factory fixtures** devuelven callables para crear N entidades sintéticas por caso (`make_contact(i)`). Mecanismo clave de aislamiento: **copia profunda** de estructuras mutables; un `list.copy()` superficial comparte dicts internos y un test ensucia al siguiente. Si ves un fallo que solo aparece con `-x` o al reordenar, sospecha fixture mutable con scope ancho." — **OK** (3 sentences, FH ≈ 72.)

### 6.6 Theory tab — Block 6: "Excepciones, floats, fechas y archivos temporales" (S27‑T3‑A)

**Paragraph 1** (line 245): "Prueba **excepciones** con el tipo y, si aplica, el **mensaje** (`pytest.raises(ValueError, match="vacío")` en pytest real; aquí, try/except + `"vacío" in str(e)`). Un `raises` que solo mira el tipo acepta un mensaje basura; el fragmento es parte del contrato. Para **floats** y scores de matching usa tolerancia (`math.isclose`) o decimal cuantizado: `==` exacto en `0.1 + 0.2` es trampa pedagógica y de producción en umbrales de matching." — **OK** (3 sentences, FH ≈ 65.)

**Paragraph 2** (line 246): "**Fechas**: no compares `datetime.now()` con literales frágiles. **Inyecta el reloj**: la función recibe `today: date` (o un callable de reloj) y el test pasa un literal fijo (`date(2026, 7, 20)`). Así el contrato no cambia de un día al otro ni entre zonas horarias de Lima y un runner en UTC. Librerías como freezegun son opcionales; la inyección de parámetro basta, es más explícita y no añade dependencia al CI del motor ER." — **OK** (4 sentences, FH ≈ 75. Lima/UTC example is well‑chosen for es‑PE context.)

**Paragraph 3** (line 247): "**tmp_path** (pytest) / `tempfile` (stdlib) evita escribir en el repo o en el home del desarrollador. Dos APIs: (1) `TemporaryDirectory()` borra al salir del `with`; (2) `NamedTemporaryFile(..., delete=False)` deja un path reabrable para reabrir y assert. Usa siempre `encoding='utf-8'` en texto y documenta si el contrato incluye el salto de línea final." — **OK** (3 sentences, FH ≈ 72. The "Dos APIs:" colon + numbered list is correct Spanish typography.)

### 6.7 Theory tab — Block 7: "Casos negativos y mensajes útiles" (S27‑T3‑B)

**Paragraph 1** (line 273): "Los **casos negativos** prueban inputs inválidos: `None`, vacío, tipo incorrecto, encoding roto, score fuera de rango. Deben fallar de forma **controlada** (excepción tipada con mensaje), no con un `AttributeError` críptico en la línea 87 de una librería interna ajena a tu contrato. Si el motor traga basura en silencio, el matching "funciona" con datos que no debían entrar." — **OK** (3 sentences, FH ≈ 68.)

**Paragraph 2** (line 274): "Mensajes de error **útiles** nombran el campo y el valor ofensivo (sintético, sin PII real ni tokens). Eso acelera el fix en CI: `email: se esperaba str, recibió None` gana a un genérico `invalid input` que no dice dónde mirar. En un equipo que opera el clerical queue, el mensaje es documentación viva del contrato de entrada." — **OK** (3 sentences, FH ≈ 72.)

**Paragraph 3** (line 275): "Diseña una tabla: input → excepción esperada → fragmento de mensaje. Cubre al menos un happy path y tres negativos por función pública del motor (`require_email`, `parse_score`, validadores de RUC sintético). Es la misma idea que `@pytest.mark.parametrize`, aplicada a bordes de validación en vez de a oráculos felices." — **OK** (3 sentences, FH ≈ 72.)

### 6.8 Theory tab — Block 8: "Cobertura por rama y por riesgo" (S27‑T4‑A)

**Paragraph 1** (line 333): "**Branch coverage** mide si cada rama (if/else) se ejecutó. 100% de **líneas** no implica 100% de riesgo cubierto: puedes cubrir logs, pretty-print y helpers de formato y dejar sin test la rama de umbral `review` que mueve el clerical queue. El reporte de coverage es un mapa; tú decides dónde poner la lupa." — **M (G7: "100%" ×2 → "100 %"; G9: sentence 2 is 41w).**

  *Before (sentence 2):* `"100% de **líneas** no implica 100% de riesgo cubierto: puedes cubrir logs, pretty-print y helpers de formato y dejar sin test la rama de umbral `review` que mueve el clerical queue."`
  *After:* `"100 % de **líneas** no implica 100 % de riesgo cubierto. Puedes cubrir logs, pretty-print y helpers de formato y dejar sin test la rama de umbral `review` que mueve el clerical queue."` (add space inside `%`; split at colon)

**Paragraph 2** (line 334): "**Risk coverage**: prioriza ramas de negocio (auto-match / review / non-match, campos faltantes, empates de score en el borde del umbral) sobre decoración. En un clasificador de pares sintéticos, las tres bandas de umbral son el núcleo del contrato — no el color del badge en la UI ni el orden de las columnas del CSV de evidencia." — **M (G9: sentence 2 is 34w; em‑dash is correctly spaced here, in contrast to G5).**

  *Before (sentence 2):* `"En un clasificador de pares sintéticos, las tres bandas de umbral son el núcleo del contrato — no el color del badge en la UI ni el orden de las columnas del CSV de evidencia."`
  *After:* `"En un clasificador de pares sintéticos, las tres bandas de umbral son el núcleo del contrato. No el color del badge en la UI ni el orden de las columnas del CSV de evidencia."` (split at the spaced em‑dash; or keep em‑dash — both are valid)

**Paragraph 3** (line 335): "Reporta cobertura como **evidencia** para el equipo, no como meta vacía del 100%. Una rama de umbral sin caso es deuda: en producción el clerical queue verá estados que CI nunca ejercitó y confiará en basura. En la retro del sprint, pregunta "¿qué rama de negocio no tiene caso?" antes de "¿llegamos al 90% de líneas?"." — **M (G7: "100%" ×2 → "100 %"; "90%" → "90 %").**

  *Before:* `"...no como meta vacía del 100%. ... antes de "¿llegamos al 90% de líneas?"."`
  *After:* `"...no como meta vacía del 100 %. ... antes de "¿llegamos al 90 % de líneas?"."`

### 6.9 Theory tab — Block 9: "Mutación conceptual, fallas útiles y mantenimiento" (S27‑T4‑B)

**Paragraph 1** (line 363): "**Mutación conceptual**: cambia deliberadamente el código (quita un `strip`, invierte un umbral, elimina `casefold`) y verifica que **algún test falle**. Si la suite sigue verde, el test es teatro de cobertura, no un contrato. No necesitas un framework de mutación el primer día: un mutante a mano en un branch local ya expone oráculos débiles." — **OK** (3 sentences, FH ≈ 68. "teatro de cobertura" appears for the first time here — the leitmotif is introduced naturally.)

**Paragraph 2** (line 364): "Fallas **útiles** muestran input sintético, esperado vs actual y el contrato violado. Evita `assert False` o un bare `assert got` sin contexto. Un dict `{"input": …, "expected": …, "actual": …}` (o el rewrite de pytest) acelera el fix en CI y en code review: el colega no tiene que adivinar qué raw entró." — **OK** (3 sentences, FH ≈ 72.)

**Paragraph 3** (line 365): "Mantenimiento: borra tests que solo copian la implementación; renombra con intención (`test_normalize_collapses_spaces`); parametriza tablas; no dupliques el mismo oráculo en tres sitios. Política del ciclo: **bug_repro → regression_test** antes de cerrar el ticket. En S28 ampliarás estos contratos con dobles (`unittest.mock`) y pruebas de integración entre módulos del motor ER." — **OK** (3 sentences, FH ≈ 65. Forward link to S28 is clean.)

### 6.10 I Do tab

**`iDo.intro`** (line 561): "Te muestro cómo priorizar riesgos, escribir AAA con oráculos, descubrir tests estilo pytest, aislar fixtures y matar mutantes sobre normalización/matching sintético — inicio de CP-N3-A. Observa el contrato (entrada → assert → salida) y el *por qué* de cada demo antes de tocar los We Do." — **M (G1: "el *por qué*" → "el *porqué*"; G9: sentence 1 is 27w).**

  *Before (sentence 2):* `"Observa el contrato (entrada → assert → salida) y el *por qué* de cada demo antes de tocar los We Do."`
  *After:* `"Observa el contrato (entrada → assert → salida) y el *porqué* de cada demo antes de tocar los We Do."` (RAE: `el porqué` as a noun)

**`iDo.steps[0..7].description` / `why`** — **OK** (8 demos, all 1‑sentence `description` + 1‑sentence `why`, FH ≈ 75 throughout. The `why` field is excellent pedagogical practice — every demo explains *why this matters*.)

### 6.11 We Do tab

**`weDo.intro`** (line 562): "24 ejercicios en tres capas por subtema: **E1 guiado** (micro-bug), **E2 independiente**, **E3 transferencia**. Cubren pirámide de riesgo, AAA/oráculos, discovery y parametrize, fixtures/scopes, bordes (isclose, raises+match, tempfile), negativos, cobertura de ramas y mutación conceptual. Cada starter trae un comentario `# DEFECT:` que marca el bug a corregir (patrón de caza de fallas del curso). Imprime **solo** las líneas del oráculo de la solución — sin prints extra de depuración. Datos sintéticos `@example.pe`; matching no etiqueta fraude ni parentesco." — **M (G9: sentence 2 is 28w, 5 commas).**

  *Before (sentence 2):* `"Cubren pirámide de riesgo, AAA/oráculos, discovery y parametrize, fixtures/scopes, bordes (isclose, raises+match, tempfile), negativos, cobertura de ramas y mutación conceptual."`
  *After (as a list — proposal):* `"Cubren: pirámide de riesgo; AAA/oráculos; discovery y parametrize; fixtures/scopes; bordes (isclose, raises+match, tempfile); negativos; cobertura de ramas; mutación conceptual."` (use semicolons for the inner list to disambiguate from the parenthetical commas)

**`weDo.steps[*].instruction`** (24 exercises) — **L (E3: S27‑T1‑A‑E2 `tests` field has "before" instead of "antes").**

  *Before (S27‑T1‑A‑E2 `tests`):* `"lista de nombres unit before que e2e"`
  *After:* `"lista de nombres unit antes que e2e"`

  All other 23 `instruction` fields are clean (FH ≈ 72 throughout).

**`weDo.steps[*].hint` / `hints`** (24×3) — **OK** (escalating specificity, FH ≈ 80.)

**`weDo.steps[*].feedback`** (24) — **M (G2: S27‑T3‑A‑E2 `feedback` has missing comma before `pero`).**

  *Before (S27‑T3‑A‑E2 `feedback`):* `"pytest.raises(..., match=) falla si el tipo es correcto pero el mensaje no cuadra: el fragmento es parte del contrato."`
  *After:* `"pytest.raises(..., match=) falla si el tipo es correcto, pero el mensaje no cuadra: el fragmento es parte del contrato."`

  All other 23 `feedback` fields are clean (FH ≈ 72 throughout).

**`weDo.steps[*].edgeCases`** (24) — **OK** (short fragments, FH not applicable.)

### 6.12 You Do tab

**`youDo.title`** — OK ("Contratos pytest de normalización y matching — inicio CP-N3-A").

**`youDo.context`** (3 sentences, 27w + 16w + 41w): "Construye una mini suite pytest (o, si aún no instalas pytest, un módulo de asserts equivalentes) sobre normalización y exact match con contactos sintéticos `@example.pe` (caso `CASO-LIM-027`, run_id `cpn3a-01`). Cada supuesto del ER debe ser un test ejecutable: mapa de riesgo por capa, tests AAA con oráculos fijos, fixtures con aislamiento function-scope, casos negativos con mensajes útiles, cobertura de ramas de umbral y al menos un mutante conceptual eliminado. Matching no implica fraude ni parentesco." — **M (G9: sentence 2 is 41w).**

  *Before (sentence 2):* `"Cada supuesto del ER debe ser un test ejecutable: mapa de riesgo por capa, tests AAA con oráculos fijos, fixtures con aislamiento function-scope, casos negativos con mensajes útiles, cobertura de ramas de umbral y al menos un mutante conceptual eliminado."`
  *After (as a colon‑introduced list — proposal):* `"Cada supuesto del ER debe ser un test ejecutable. El entregable cubre: mapa de riesgo por capa; tests AAA con oráculos fijos; fixtures con aislamiento function-scope; casos negativos con mensajes útiles; cobertura de ramas de umbral; al menos un mutante conceptual eliminado."`

**`youDo.objectives`** (5 bullets) — **OK** (action‑verb openings: "Mapa de riesgos…", "Tests AAA…", "Fixture function-scope…", "Cobertura…", "README…").

**`youDo.requirements`** (5 bullets) — **OK** (clean, ethical anchor in requirement 3: "Matching solo responde igualdad de entidad sintética: no implica fraude ni parentesco".)

**`youDo.starterCode`** — **OK** (35‑line skeleton, well‑commented with file layout, 4 implemented `test_*` functions, `__main__` block. Code is excluded from grammar scoring per the subplan.)

**`youDo.portfolioNote`** — **L (G9: 29w, FH = 42.8).**

  *Before:* `"Entrega de inicio CP-N3-A para tu portafolio: carpeta con código de normalización/matching sintético, tests (pytest preferido), README en español profesional con límites y evidencia de corrida."`
  *After:* `"Entrega de inicio CP-N3-A para tu portafolio. Carpeta con código de normalización/matching sintético, tests (pytest preferido) y README en español profesional con límites y evidencia de corrida."` (split at the colon)

**`youDo.rubric`** (6 criteria) — **OK** (clean, sums to 100 %.)

### 6.13 Self-Check tab

**`selfCheck.questions[0]`** — **OK** (Q: "En la pirámide de pruebas, la base más ancha suele ser:" — clean.)

**`selfCheck.questions[1]`** — **OK** (Q: "Un oráculo confiable es:" — clean. Note: "confiable" is the Latin American form; "fiable" is the peninsular form. es‑PE prefers "confiable" — correct.)

**`selfCheck.questions[2]`** — **OK** (Q: "Si mutas un casefold y ningún test falla:" — clean. The opening "Si" without `¿` is correct because this is a statement‑form question used as a prompt, not an interrogative clause.)

**`selfCheck.questions[3]`** — **OK** (Q: "Las pruebas de matching en CP-N3-A demuestran:" — clean.)

**`selfCheck.questions[4]`** — **M (G4: "una fixture" → "un fixture" for consistency with the rest of the file).**

  *Before:* `"¿Cuál es el scope por defecto de una fixture de pytest y por qué importa en datos mutables?"`
  *After:* `"¿Cuál es el scope por defecto de un fixture de pytest y por qué importa en datos mutables?"`

**`selfCheck.questions[*].explanation`** (5) — **OK** (all 5 explanations are clean, FH ≈ 72.)

---

## 7. Proposed GitHub‑style Diffs (one per issue or logical group)

> Diffs are proposals — **not applied in this pass.** Line numbers refer to `src/lib/course/sections/s27-async-concurrency.ts` at commit‑HEAD of the cloned `pyarcana_repo`.

### Diff D1 (M1 — fix stale `id` to match content; aligns with v3 roadmap S27)

> **Caution (persisted‑state risk):** the S36 audit flagged the same curriculum‑wide id‑drift pattern (`id: "ai-apis-advanced"` on a clustering section) and recommended **keeping `id` stable** if the app persists learner progress keyed on `id`. The safe variant below only renames the file (build‑time concern, no runtime risk) and leaves `id` untouched. The aggressive variant renames both — only do this after confirming the app does not key persisted state on `id`, or after writing a one‑time migration.

**Safe variant (recommended short term):**

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -27,7 +27,7 @@ import { section26 } from './sections/s26-integrator-phase1'
 // Phase 2 — Senior (27-39)
-import { section27 } from './sections/s27-async-concurrency'
+import { section27 } from './sections/s27-pytest-strategy'
 import { section28 } from './sections/s28-llm-agents'
```

Plus a `git mv src/lib/course/sections/s27-async-concurrency.ts src/lib/course/sections/s27-pytest-strategy.ts`. The `id: "async-concurrency"` field is **left untouched** to preserve any persisted learner state. Add a code comment explaining the drift:

```diff
--- a/src/lib/course/sections/s27-pytest-strategy.ts
+++ b/src/lib/course/sections/s27-pytest-strategy.ts
@@ -1,6 +1,10 @@
 import type { CourseSection } from '../../types'

+// NOTE: `id` stays "async-concurrency" for backward compatibility with persisted
+// learner state. The file was renamed from s27-async-concurrency.ts to match the
+// actual content (pytest strategy). The v3 roadmap confirms S27 = pytest; S38 =
+// concurrency. See audit S27_report.md for context.
 export const section27: CourseSection = {
   id: "async-concurrency",
   index: 27,
```

**Aggressive variant (medium term, requires migration):**

```diff
--- a/src/lib/course/sections/s27-pytest-strategy.ts
+++ b/src/lib/course/sections/s27-pytest-strategy.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section27: CourseSection = {
-  id: "async-concurrency",
+  id: "pytest-strategy",
   index: 27,
   title: "Estrategia de pruebas con pytest",
   shortTitle: "Pytest y contratos",
```

> The URL hash on the live site will change from `#async-concurrency` to `#pytest-strategy` — coordinate with any existing deep links (the GitHub Pages SPA handles hash routing client‑side). Write a one‑time migration that maps old `id` → new `id` in the learner‑progress store.

### Diff D2 (M2 — fix `level` to match Phase‑2 "Senior")

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -8,7 +8,7 @@ export const section27: CourseSection = {
   tagline:
     "Convertir supuestos de normalización y matching en contratos ejecutables con pytest; cada bug reproducido deja un test de regresión",
   estimatedHours: 19,
-  level: "Competente",
+  level: "Senior",
   phase: 2,
   icon: "FlaskConical",
```

> If S27 is intended as a transition section (Phase‑1 "Competente" → Phase‑2 "Senior"), keep `"Competente"` and add a one‑line note in `jobRelevance` explaining the transition. Otherwise align to `"Senior"`.

### Diff D3 (G1 — fix `el por qué` → `el porqué`)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -559,7 +559,7 @@ export const section27: CourseSection = {
   iDo: {
     intro:
-      "Te muestro cómo priorizar riesgos, escribir AAA con oráculos, descubrir tests estilo pytest, aislar fixtures y matar mutantes sobre normalización/matching sintético — inicio de CP-N3-A. Observa el contrato (entrada → assert → salida) y el *por qué* de cada demo antes de tocar los We Do.",
+      "Te muestro cómo priorizar riesgos, escribir AAA con oráculos, descubrir tests estilo pytest, aislar fixtures y matar mutantes sobre normalización/matching sintético — inicio de CP-N3-A. Observa el contrato (entrada → assert → salida) y el *porqué* de cada demo antes de tocar los We Do.",
     steps: [
```

### Diff D4 (G2 — add missing comma before `pero` in `weDo.steps[15].feedback`)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -1023,7 +1023,7 @@ export const section27: CourseSection = {
         tests: "True si el mensaje del ValueError contiene 'invalid'",
         feedback: "pytest.raises(..., match=) falla si el tipo es correcto pero el mensaje no cuadra: el fragmento es parte del contrato.",
+        feedback: "pytest.raises(..., match=) falla si el tipo es correcto, pero el mensaje no cuadra: el fragmento es parte del contrato.",
         starterCode: {
```

> Apply the comma fix to the `feedback` string only; the `tests` and `instruction` strings for the same exercise are clean.

### Diff D5 (G3 — replace non‑standard `re-correr` with `volver a correr`)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -122,7 +122,7 @@ export const section27: CourseSection = {
       paragraphs: [
-        "pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten re-correr solo el fallido con `pytest path::test_name -q`. Sin naming estable no puedes apuntar a un contrato concreto cuando falla la suite a las 2 a.m.: solo ves "falló algo de normalize".",
+        "pytest **descubre** funciones `test_*` y clases `Test*` en archivos `test_*.py` / `*_test.py`. Los **node ids** (`path::name[param]`) identifican cada caso en CI y permiten **volver a correr** solo el fallido con `pytest path::test_name -q`. Sin naming estable no puedes apuntar a un contrato concreto cuando falla la suite a las 2 a. m.: solo ves "falló algo de normalize".",
       ],
```

> Also fixes G8 (`2 a.m.` → `2 a. m.`) in the same sentence.

### Diff D6 (G4 — fix `una fixture` → `un fixture` for gender consistency)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -1568,7 +1568,7 @@ export const section27: CourseSection = {
       {
-        question: "¿Cuál es el scope por defecto de una fixture de pytest y por qué importa en datos mutables?",
+        question: "¿Cuál es el scope por defecto de un fixture de pytest y por qué importa en datos mutables?",
         options: ["session: reutiliza estado entre todos los tests (ideal para mutar listas)", "package: es el default de pytest y aísla mutables sin necesidad de deepcopy", "function: se recrea por test y reduce contaminación entre casos", "module: es el único scope que aísla copias profundas automáticamente"],
         correctIndex: 2,
```

> The file uses `un fixture` (3×) and `Las fixtures` (1×, plural feminine — acceptable per Fundéu since plural borrowed nouns often default to feminine in tech context). The single `una fixture` is the outlier.

### Diff D7 (G5 — fix unspaced em‑dash in `jobRelevance`)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -14,7 +14,7 @@ export const section27: CourseSection = {
   jobRelevance:
-    "En equipos de data engineering y compliance en Perú (bancos, fintech, retail con padrones de clientes), un motor de **entity resolution** solo es confiable si normalización y matching son **contratos ejecutables** con pytest—no scripts que "pasaron una vez en mi laptop". En esta sección inicias **CP-N3-A**: priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos, aíslas datos con fixtures, cubres bordes (excepciones, floats, fechas, tmp) y demuestras con mutación conceptual que la suite realmente protege el contrato. Matching solo responde "¿misma entidad sintética?"; **nunca** etiqueta fraude ni parentesco.",
+    "En equipos de data engineering y compliance en Perú (bancos, fintech, retail con padrones de clientes), un motor de **entity resolution** solo es confiable si normalización y matching son **contratos ejecutables** con pytest —no scripts que "pasaron una vez en mi laptop"—. En esta sección inicias **CP-N3-A**: priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos, aíslas datos con fixtures, cubres bordes (excepciones, floats, fechas, tmp) y demuestras con mutación conceptual que la suite realmente protege el contrato. Matching solo responde "¿misma entidad sintética?"; **nunca** etiqueta fraude ni parentesco.",
```

> Alternative simpler form: `…con pytest: no scripts que…` (colon instead of em‑dash). Spanish raya requires opening and closing when used as parenthetical (` —no scripts— `); when used as a final clarification at sentence end, only the opening raya is needed (` —no scripts que "pasaron…".`). The current unspaced form is the English em‑dash calque.

### Diff D8 (G7 — add space inside `%` in prose, 6 occurrences in `theory` and `theory[6]`)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -333,7 +333,7 @@ export const section27: CourseSection = {
       paragraphs: [
-        "**Branch coverage** mide si cada rama (if/else) se ejecutó. 100% de **líneas** no implica 100% de riesgo cubierto: puedes cubrir logs, pretty-print y helpers de formato y dejar sin test la rama de umbral `review` que mueve el clerical queue. El reporte de coverage es un mapa; tú decides dónde poner la lupa.",
+        "**Branch coverage** mide si cada rama (if/else) se ejecutó. 100 % de **líneas** no implica 100 % de riesgo cubierto: puedes cubrir logs, pretty-print y helpers de formato y dejar sin test la rama de umbral `review` que mueve el clerical queue. El reporte de coverage es un mapa; tú decides dónde poner la lupa.",
       ],
@@ -335,7 +335,7 @@ export const section27: CourseSection = {
-        "Reporta cobertura como **evidencia** para el equipo, no como meta vacía del 100%. Una rama de umbral sin caso es deuda: en producción el clerical queue verá estados que CI nunca ejercitó y confiará en basura. En la retro del sprint, pregunta "¿qué rama de negocio no tiene caso?" antes de "¿llegamos al 90% de líneas?".",
+        "Reporta cobertura como **evidencia** para el equipo, no como meta vacía del 100 %. Una rama de umbral sin caso es deuda: en producción el clerical queue verá estados que CI nunca ejercitó y confiará en basura. En la retro del sprint, pregunta "¿qué rama de negocio no tiene caso?" antes de "¿llegamos al 90 % de líneas?".",
```

> The rubric weights `"25%"`, `"20%"`, `"15%"`, `"10%"` are CSS‑like data values inside `weight:` fields, not prose — leave as‑is.

### Diff D9 (G9 — split 44w `jobRelevance` opener for readability)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -14,7 +14,7 @@ export const section27: CourseSection = {
   jobRelevance:
-    "En equipos de data engineering y compliance en Perú (bancos, fintech, retail con padrones de clientes), un motor de **entity resolution** solo es confiable si normalización y matching son **contratos ejecutables** con pytest—no scripts que "pasaron una vez en mi laptop". En esta sección inicias **CP-N3-A**: priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos, aíslas datos con fixtures, cubres bordes (excepciones, floats, fechas, tmp) y demuestras con mutación conceptual que la suite realmente protege el contrato. Matching solo responde "¿misma entidad sintética?"; **nunca** etiqueta fraude ni parentesco.",
+    "En equipos de data engineering y compliance en Perú (bancos, fintech, retail con padrones de clientes), un motor de **entity resolution** solo es confiable si normalización y matching son **contratos ejecutables** con pytest —no scripts que "pasaron una vez en mi laptop"—. En esta sección inicias **CP-N3-A**. Priorizas pruebas por riesgo y capa (unit/contract/integration), escribes tests AAA con oráculos fijos y aíslas datos con fixtures. Cubres bordes (excepciones, floats, fechas, tmp) y demuestras con mutación conceptual que la suite realmente protege el contrato. Matching solo responde "¿misma entidad sintética?"; **nunca** etiqueta fraude ni parentesco.",
```

> Splits the 44w sentence 2 into 3 sentences (24w + 14w + 16w). Lifts FH from 43.3 to ~70.

### Diff D10 (E3 — fix English `before` → `antes` in `weDo.steps[1].tests`)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -650,7 +650,7 @@ export const section27: CourseSection = {
         edgeCases: ["empates: el orden secundario no se pide aquí"],
-        tests: "lista de nombres unit before que e2e",
+        tests: "lista de nombres unit antes que e2e",
         feedback: "Orden descendente por impacto×probabilidad: unit (25) antes que e2e (2).",
```

### Diff D11 (Optional — split 41w `youDo.context` sentence)

```diff
--- a/src/lib/course/sections/s27-async-concurrency.ts
+++ b/src/lib/course/sections/s27-async-concurrency.ts
@@ -1499,7 +1499,7 @@ export const section27: CourseSection = {
   youDo: {
     title: "Contratos pytest de normalización y matching — inicio CP-N3-A",
     context:
-      "Construye una mini suite pytest (o, si aún no instalas pytest, un módulo de asserts equivalentes) sobre normalización y exact match con contactos sintéticos `@example.pe` (caso `CASO-LIM-027`, run_id `cpn3a-01`). Cada supuesto del ER debe ser un test ejecutable: mapa de riesgo por capa, tests AAA con oráculos fijos, fixtures con aislamiento function-scope, casos negativos con mensajes útiles, cobertura de ramas de umbral y al menos un mutante conceptual eliminado. Matching no implica fraude ni parentesco.",
+      "Construye una mini suite pytest (o, si aún no instalas pytest, un módulo de asserts equivalentes) sobre normalización y exact match con contactos sintéticos `@example.pe` (caso `CASO-LIM-027`, run_id `cpn3a-01`). Cada supuesto del ER debe ser un test ejecutable. El entregable cubre: mapa de riesgo por capa; tests AAA con oráculos fijos; fixtures con aislamiento function-scope; casos negativos con mensajes útiles; cobertura de ramas de umbral; al menos un mutante conceptual eliminado. Matching no implica fraude ni parentesco.",
```

### Diff D12 (Optional — archive or mark old master roadmap as superseded)

```diff
--- a/el_arte_de_python_roadmap_maestro_52_secciones.md
+++ b/el_arte_de_python_roadmap_maestro_52_secciones.md
@@ -1,3 +1,7 @@
+> **SUPERSEDED.** This master roadmap is preserved for historical reference.
+> The canonical curriculum is `learning_roadmap_52_V3.md`. Section numbering,
+> titles, and subtopics in this file may be out of date.
+
 # El Arte de Python — Master Roadmap

```

> The old master roadmap line 259 still says "Sección 27 — Advanced ML Pipelines in Production Contexts", which conflicts with the v3 roadmap and the rendered live site. A superseded banner prevents future confusion without deleting the historical document.

---

## 8. Recommended Priority Order for fixing

| Priority | Issue | Diff | Effort | Impact |
|---|---|---|---|---|
| 1 (P0) | M1: stale `id: "async-concurrency"` + file name on a pytest section | D1 (safe variant: file rename only; aggressive: id rename with migration) | S (5 min code + 5 min rename + 5 min index update; aggressive variant adds migration work) | M — fixes URL hash, deep links, learner mental model, search. Safe variant has no persisted‑state risk. |
| 2 (P0) | M2: `level: "Competente"` vs Phase‑2 "Senior" | D2 | XS (1 line) | M — fixes metadata consistency with `PHASES[2].level` |
| 3 (P1) | G1: `el *por qué*` → `el *porqué*` | D3 | XS (1 line) | M — grammar correctness in `iDo.intro` |
| 4 (P1) | G2: missing comma before `pero` in `weDo.steps[15].feedback` | D4 | XS (1 line) | M — grammar correctness in feedback |
| 5 (P1) | G3 + G8: `re-correr` → `volver a correr`; `2 a.m.` → `2 a. m.` | D5 | XS (1 line) | M — grammar + style in theory block |
| 6 (P1) | G4: `una fixture` → `un fixture` for gender consistency | D6 | XS (1 line) | M — concordance consistency |
| 7 (P1) | G5: unspaced em‑dash `pytest—no` → `pytest —no…—` | D7 | XS (1 line) | M — Spanish typography |
| 8 (P2) | G7: `100%` / `90%` → `100 %` / `90 %` in prose (6 occurrences) | D8 | XS (6 lines) | L — RAE typography |
| 9 (P2) | G9: split 44w `jobRelevance` opener | D9 | S (1 line rewrite) | M — readability (FH 43 → 70) |
| 10 (P2) | E3: `tests` field "before" → "antes" | D10 | XS (1 line) | L — anglicism in learner‑facing field |
| 11 (P3) | G9: split 41w `youDo.context` sentence | D11 | S (1 line rewrite) | L — readability |
| 12 (P3) | R1: archive / mark old master roadmap as superseded | D12 | S (1 banner) | M — roadmap consistency |
| 13 (P3) | L3: add a "Diccionario rápido" callout for the 22 acronyms (CP‑N3‑A, AAA, ER, RUC, RPA, HITL, CI, E2E, KPI, IEEE‑754, PII, README, CLI, node id, RUN_ID, URL, JSON, CSV, UI, DB, SQL, RFC) | (new callout) | S | L — cognitive load |
| 14 (P4) | G6: pick one convention for `API`/`APIs` and `assertion`/`assertions` and apply file‑wide | (style pass) | S | L — consistency |
| 15 (P4) | G11: vary the "teatro de cobertura/verde" leitmotif (appears 5+ times) | (style pass) | S | L — anaphoric monotony |

> P0 = blocks learner understanding or breaks structure. P1 = real grammar/style defects. P2 = readability/typography polish. P3 = cognitive load / meta consistency. P4 = style polish. All proposed diffs are non‑applied proposals.

---

## 9. Graph Memory Update notes (for the shared context files)

> Notes for the orchestrator's shared context. Append‑only; do not overwrite prior agent entries.

- **S27 identity node**: `id="async-concurrency"` is **stale** — content is pytest strategy. The actual async/concurrency content lives in S38. Recommend renaming `id` to `"pytest-strategy"` and the file to `s27-pytest-strategy.ts`. Update `index.ts` line 30 import path.
- **S27 phase/level node**: `level="Competente"` is **inconsistent** with `PHASES[2].level="Senior"`. Either align S27 to "Senior" or document the transition.
- **S27 ↔ S26 handoff**: clean. `theory[0].paragraphs[0]` opens with "En S26 orquestaste el VP con evidencia por estado (RPA + analista HITL)." Correct.
- **S27 ↔ S28 handoff**: clean. `theory[7].paragraphs[2]` and `youDo.requirements[4]` both forward‑reference S28 ("dobles / `unittest.mock` / pruebas de integración"). Correct.
- **S27 ↔ S38 de‑duplication**: S27 = pytest strategy; S38 = concurrency/resilience. The stale `id="async-concurrency"` on S27 creates a false duplicate with S38 ("Concurrencia y resiliencia"). Fixing D1 resolves this.
- **Roadmap canon**: `learning_roadmap_52_V3.md` is the canonical roadmap (matches live site and TS content). The old master `el_arte_de_python_roadmap_maestro_52_secciones.md` is superseded and should be marked as such (D12).
- **Grammar findings**: 17 non‑trivial LT matches (after false‑positive filtering). Real defects: G1 (`PORQUE`), G2 (`COMMA_PERO`), G3 (`re-correr`), G4 (`una fixture`), G5 (unspaced em‑dash). Typography: G7 (`N%` ×6), G8 (`a.m.`). Readability: G9 (9 long sentences, worst 44w in `jobRelevance`).
- **No AI‑authorship / TODO / FIXME / HACK residue** detected anywhere in the file.
- **No bilingual meta‑leak** like S26's "Thinking aloud" — S27's only English‑in‑Spanish leakage is the borrowed‑noun set (fixture, runner, badge, flakes, demo, starter, lab, merge) which is industry‑standard for a pytest section.
- **CASO-LIM-027 tag**: same authoring‑system tag pattern as S26's CASO-LIM-026. Consistent across Phase‑1/Phase‑2. Borderline meta‑leak but defensible as a case‑tracking code.
- ** Leitmotif "teatro de cobertura/verde"**: appears 5+ times across callouts and feedback. Effective as a meme but verges on formula. Worth varying in P4 pass.
- **Section scored**: 7.6 / 10 (overall). Strengths: I‑Do/We‑Do/You‑Do fidelity (9.5), exercise quality (9.5), connective tissue (8.5). Weaknesses: roadmap consistency (6.0) due to stale `id` + `level`, cognitive load (7.5) due to 9 long sentences and 22 acronyms.

---

## 10. Method Note (grammar dimension)

### 10.1 Pipeline

1. **Prose extraction**: a structural TS parser (`audits/S27_records.json`) walked the file respecting template literals, double‑quoted, and single‑quoted strings, and emitted 320 `(path, value)` records. 180 were filtered as learner‑facing Spanish prose (excluding pure code, IDs, file names, and English‑only scaffolding) using the `is_spanish` heuristic (accent or ≥2 Spanish function words).
2. **Sentence segmentation**: Spanish‑aware regex split on `[.?!]` followed by space + capital / `¿` / `¡`, with light abbreviation protection. 299 sentences extracted.
3. **Per‑sentence metrics**: Fernández‑Huerta 1959 (`206.84 − 60·SPW − 1.02·WPS`), Szigriszt‑Pazos / INFLESZ (`206.835 − 62.3·SPW − WPS`), WPS, SPW (Spanish vowel‑group heuristic). Stored in `audits/S27_prose.json`.
4. **Heuristic findings**: run‑on (>45w), long (>32w), missing terminal punctuation, missing `¿`/`¡`, unbalanced delimiters, duplicated function words, gerund pile‑up (≥3 `‑ndo`), comma density (≥5), space before punctuation, meta‑leak keyword scan.
5. **LanguageTool `es`**: concatenated prose chunked into 2 ≤18 k‑char requests, 4‑second sleep between requests. 495 raw matches → 17 non‑trivial after filtering false positives (MORFOLOGIK on tech terms, WHITESPACE / COMMA_PARENTHESIS_WHITESPACE / INCORRECT_SPACES from code‑stripping artifacts, UPPERCASE_SENTENCE_START from sentence‑boundary edge cases). Stored in `audits/S27_lt.json`.

### 10.2 Aggregate metrics (`audits/S27_aggregate.json`)

| Metric | Value |
|---|---|
| Prose records | 180 |
| Sentences | 299 |
| WPS mean / median / p90 / max | 13.6 / 12 / 23 / 44 |
| SPW mean / median | 1.89 / 1.88 |
| FH mean / median / min / max | 79.4 / 80.7 / 7.8 / 141.7 |
| Long sentences (32–45w) | 9 |
| Run‑on sentences (>45w) | 0 |
| No terminal punctuation | 77 (mostly learning‑outcome bullets and hint fragments — legitimate) |
| Comma density ≥5 | 4 (2 real prose, 2 code‑strip artifacts) |
| Missing inverted `¿`/`¡` | 1 (false positive on f‑string `print(f'campo score inválido: {v!r}')`) |
| Space before punctuation | 33 (mostly code‑strip artifacts) |
| Gerund pile‑up | 0 |
| Meta‑leak (heuristic) | 0 |
| LT total matches | 495 |
| LT interesting (non‑trivial) | 17 |

### 10.3 Interpretation

- **FH mean = 79.4** ("algo fácil" band) is appropriate for senior‑level technical Spanish. The subplan notes that "extreme easy may mean under‑teaching" — S27 is *not* under‑teaching; the mean is lowered by the 9 long sentences (FH 40–65) and raised by the many short hint/feedback fragments (FH 90+).
- **WPS mean = 13.6** is well within the pedagogical soft target (15–32 for technical ES). The 9 long sentences are the actionable tail.
- **LT false‑positive rate** is high (~97 %) because the section uses extensive inline code (`pytest.raises(...)`, `@pytest.mark.parametrize`, `f"…{v!r}"`) which, after stripping, creates artifacts (empty parentheses, duplicated commas, missing subjects) that LT flags. The 17 non‑trivial matches are the real signal.

### 10.4 Known false‑positive classes

- `MORFOLOGIK_RULE_ES` (336 matches): spelling‑checker flags on tech terms (`pytest`, `casefold`, `tmp_path`, `node`, `fixture`, `runner`, `flake`, `badge`, `parametrize`, `RUC`, `CP-N3-A`, `run_id`, etc.). Filter out.
- `WHITESPACE_RULE` (78) + `COMMA_PARENTHESIS_WHITESPACE` (48) + `INCORRECT_SPACES` (10): almost entirely from inline code (`(a, b)`, `@pytest.fixture`, `def test_*`) being stripped to `(a, b)` with comma‑space issues. Filter out.
- `UPPERCASE_SENTENCE_START` (6): from sentence boundaries inside code comments / output strings. Filter out.
- `UN_UNO` (2): "un `strip` o un umbral" → "un  o un umbral" after code‑strip — false positive.
- `AGREEMENT_DET_NOUN` (2): "Las fixtures" / "Las assertions" → borrowed English plurals. Real but defensible (Fundéu accepts).
- `PUNTO_EN_ABREVIATURAS` (2): "Evita `assert False`" → "Evita " after strip — false positive.

---

This is the complete Explorer report for Section 27. Ready for the Fixer prompt.
