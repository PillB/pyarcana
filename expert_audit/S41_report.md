# Section 41 — Curriculum Auditor Report
## Pyarcana · Section 41 — `s41-llm-finetuning.ts` — "APIs con FastAPI y contratos HTTP"

> Task ID: S41 · Agent: Curriculum Auditor (general-purpose) · Scope: Section 41 only
> Source files audited:
> - `/home/z/my-project/pyarcana_repo/src/lib/course/sections/s41-llm-finetuning.ts` (2,224 lines)
> - `/home/z/my-project/pyarcana_repo/src/lib/course/index.ts` (line 45 import, line 79 in active Phase-3 list)
> - `/home/z/my-project/pyarcana_repo/src/components/course/SectionView.tsx` (interactive demo map, line 3,131)
> - `/home/z/my-project/pyarcana_repo/src/components/course/PdfReport.tsx` (section label map, line 81)
> - Live site: https://pillb.github.io/pyarcana/ (SPA, JS-rendered; verified Section 41 = `llm-finetuning` id, title "APIs con FastAPI y contratos HTTP", interactive demo loads "Practica QLoRA concepts (simulado)")
>
> Grammar subplan applied: `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`
> Artifacts produced for this audit:
> - `/home/z/my-project/audits/S41_prose.txt` — 272 learner-facing prose blocks
> - `/home/z/my-project/audits/S41_metrics.json` — per-sentence FH / INFLESZ / WPS / SPW + heuristics
> - `/home/z/my-project/audits/S41_lt.json` — LanguageTool (`es`) rule matches (3 chunks; 1,245 raw matches; 72 non-spelling)

---

## 1. Section Identification & Scope

**Section number confirmed:** 41 (forty-first in the 52-section roadmap, position 41 in the active list inside `index.ts:79`).

**File:** `src/lib/course/sections/s41-llm-finetuning.ts`
**Section id:** `llm-finetuning` ← (legacy/renamed — see H-1, H-2, H-3)
**Index:** 41
**Title:** "APIs con FastAPI y contratos HTTP"
**Short title:** "APIs FastAPI"
**Tagline:** "API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas"
**Estimated hours:** 20 · **Level:** "Master" · **Phase:** 3 (Phase 3 — Master) · **Icon:** Server

**Scope of audit (only S41 learner-facing surface):**
- `jobRelevance` (1 paragraph)
- `learningOutcomes` (8 outcomes)
- `theory` array — 9 theory blocks (1 dictionary/route preamble + 8 subtopic blocks: T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B), each with heading + 3 paragraphs + code + callout = 27 paragraphs + 9 callouts
- `iDo` — 1 intro + 8 demos (description / code / why)
- `weDo` — 1 intro + 24 exercises (3 per subtopic: guided / independent / transfer), each with instruction, hint, hints (×2), edgeCases, tests, feedback, starterCode, solutionCode
- `youDo` — title, context, 4 objectives, 8 requirements, ~70-line starterCode, portfolioNote, 6-criterion rubric
- `selfCheck` — 8 questions with 4 options + explanation each
- `resources` — 10 docs, 2 books, 5 courses

Out of scope (per audit instructions): pure code blocks, `starterCode`/`solutionCode` bodies, id-only strings.

---

## 2. Executive Summary of Quality

**Composite score: 5.8 / 10**

**Verdict:** Section 41's **pedagogical architecture is gold-standard** — full I-Do / We-Do / You-Do / Self-Check / Resources fidelity; 8 demos + 24 graded exercises (E1 implement / E2 assess / E3 decide, all fail-closed with synthetic Arequipa fixtures); an honest You-Do capstone (`readiness()` returns READY only when create/replay/conflict/422/no-secret/single-side-effect/GET-stable all pass); 8 self-check items aligned 1:1 with the 8 outcomes; and a coherent "stdlib ≈ FastAPI" isomorphism that lets the learner build a real HTTP contract without a cluster or network. The prose is mechanically clean (avg FH 64.68, avg WPS 11.77, avg SPW 2.17; **zero** missing inverted `¿¡`, **zero** double spaces, **zero** space-before-punct, **zero** unbalanced delimiters, **zero** anaphoric monotony, **zero** gerund pile-ups, only 1 repeated-word false positive).

**The score is dragged down by a single, devastating, three-way consistency defect:**

1. **HIGH (H-1, H-2, H-3) — Section identity split.** The file is named `s41-llm-finetuning.ts`, the section `id` is `"llm-finetuning"`, the live interactive demo at `SectionView.tsx:3131-3188` is titled **"Practica QLoRA concepts (simulado)"** and runs a 4-bit-quantization + LoRA + VRAM calculator, and the downloadable PDF report at `PdfReport.tsx:81` labels this section **"41. FineTune"**. But the section's actual `title`, `tagline`, `jobRelevance`, all 27 theory paragraphs, all 8 demos, all 24 exercises, the You-Do capstone and the 8 self-check questions are about **APIs with FastAPI, HTTP status semantics, Idempotency-Key, dependency injection, validation/422, sync/async/background boundaries, timeout cascades, the test pyramid, rate-limiting and PII redaction.** A learner who finishes the section and clicks "Pruébalo tú mismo" sees an unrelated QLoRA simulator; the PDF they download for their portfolio calls their newly-learned FastAPI mastery "FineTune". The same pattern is present in S42 (`s42-graph-rag.ts` titled "Schemas, seguridad y privacidad de servicios"; PDF label '42. GraphRAG'; demo 'Practica knowledge graphs (simulado)') and is the Phase-3 analogue of the legacy-id demo-drift class flagged for S06 / S09 / S10 / S13 / S15 / S39.

2. **MEDIUM (M-1) — Roadmap lie about the next section.** S41's `jobRelevance` closes with "S42 sumará authz, schemas estrictos y privacidad de servicios sobre este control plane." S42's actual content title is exactly "Schemas, seguridad y privacidad de servicios" — so this forward-pointer is **correct relative to S42's content** but **wrong relative to S42's file name / PDF label / demo** (`graph-rag`). The same identity split propagates across the Phase-3 narrative.

3. **MEDIUM (M-2 through M-7) — A handful of redaction/grammar items that are individually small but together signal a missing copy-edit pass:**
   - `vs` without period (4×) → `vs.`
   - `o OpenAPI` (4×) → `u OpenAPI` (Spanish phonetic rule: o → u before o-sound; the section already does this correctly with `200 es lectura u OK genérico`, so it is inconsistent within itself)
   - `APIs` (8×) → RAE-preferred invariable `API` (`las API`)
   - `misma clave + mismo body` / `misma key` (4×) → `la misma clave + el mismo body` (determiner required when used as a noun phrase in formal es-PE; the S39 audit flagged the identical pattern with `misma entidad`)
   - Sentence-initial lowercase fragments in `edgeCases` strings: `ok y timeout dejan resources vacío` and `fixture adverso: POST create con status 200 (incoherente)` (LT `UPPERCASE_SENTENCE_START` × 2)
   - `Correctitud` (1× in rubric) → RAE-recognized `corrección` or `corrección técnica` (the anglicism is widely used in es-PE software-engineering contexts but flagged by LT)

**Bottom line:** The content the learner *reads* is excellent Master-level FastAPI curriculum. The experience the learner *sees* (live demo, PDF report, file name) is from a different, abandoned curriculum ("LLM Fine-tuning"). This is the highest-leverage fix in the section: aligning the demo + PDF label + file name with the actual content would move S41 from 5.8 to ~8.0 with no other change. The remaining 2 points come from a light copy-edit pass on `vs.`, `o → u`, determiners, and `APIs`.

---

## 3. Detailed Issue Registry

| # | ID | Severity | Evidence (excerpt) | Pedagogical impact |
|---|----|----------|--------------------|--------------------|
| 1 | H-1 | HIGH (meta-leak / consistency) | `src/lib/course/sections/s41-llm-finetuning.ts` — file name `s41-llm-finetuning` + `id: "llm-finetuning"`; section `title: "APIs con FastAPI y contratos HTTP"` and all 27 theory paragraphs are about FastAPI HTTP contracts. | The Phase-3 roadmap was clearly reorganized: the original "LLM Fine-tuning" topic was swapped for "APIs con FastAPI y contratos HTTP" but the file name and `id` were left untouched. This is invisible to the learner (they see the title), but it is the root cause of H-2 and H-3 — every consumer of the `id` (`SectionView.tsx` demo map, `PdfReport.tsx` label map) still serves LLM-Fine-tuning artefacts. Same pattern in S42 (`graph-rag` id → "Schemas, seguridad y privacidad de servicios" content). |
| 2 | H-2 | HIGH (pedagogy / demo drift) | `src/components/course/SectionView.tsx:3131-3188` — `'llm-finetuning': { title: 'Practica QLoRA concepts (simulado)', code: … simulate_quantization … LoRA adapters … VRAM Requirements }`. | Learner clicks "Pruébalo tú mismo" expecting to manipulate HTTP status, Idempotency-Key, DI, 422, async/ background, timeout cascade, test pyramid or 429+trace and gets a QLoRA simulator that prints FP32/FP16/INT4 VRAM numbers and `8B` model parameter counts. The interactive artefact has zero overlap with what the 8 theory blocks just taught. Same legacy-id drift class flagged in S06 / S09 / S10 / S13 / S15 / S39. **First-impression cognitive betrayal** — the learner's mental model of "API contracts" is replaced by "quantization math" with no bridge. |
| 3 | H-3 | HIGH (meta-leak / portfolio integrity) | `src/components/course/PdfReport.tsx:81` — `"llm-finetuning": '41. FineTune'`. | The downloadable progress/portfolio PDF labels the section `41. FineTune` while the live UI shows `APIs con FastAPI y contratos HTTP`. A learner who submits this PDF to a recruiter as evidence of FastAPI mastery is mislabeled as having learned Fine-tuning. Also misaligns with neighbouring labels (`40. Agentic`, `42. GraphRAG`) and with the actual S42 content ("Schemas, seguridad y privacidad de servicios"). |
| 4 | M-1 | MEDIUM (consistency / narrative) | `s41:15` — "S42 sumará authz, schemas estrictos y privacidad de servicios sobre este control plane." | The forward-pointer to S42 is **correct relative to S42's content title** ("Schemas, seguridad y privacidad de servicios") but **wrong relative to S42's id / file name / PDF label** (`graph-rag` / '42. GraphRAG'). So the narrative the learner reads is internally coherent across S41→S42 content, but every *metadata* surface (file name, demo, PDF) along that narrative arc is from a different course. Learners tracking progress by PDF labels will see "41. FineTune → 42. GraphRAG" and have no idea that the real arc is "APIs FastAPI → Schemas y seguridad". |
| 5 | M-2 | MEDIUM (grammar — phonetic rule) | 4 occurrences of `o OpenAPI` in prose and `edgeCases` strings: `s41:192` "200 con leak o OpenAPI desalineado del comportamiento"; `s41:1139`, `s41:1200`, `s41:1256` (edgeCases arrays, identical 3×) "200 con leak de secret o OpenAPI desalineado". LT rule `Y_E_O_U`. | Spanish phonetic rule: the conjunction `o` becomes `u` before words starting with `o` / `ho` sound (RAE DPD §"u"). The section itself applies the rule correctly in `s41:2113` ("200 es lectura u OK genérico") — so the inconsistency is internal. Real grammar issue, low-cost fix. |
| 6 | M-3 | MEDIUM (style / typography) | 4 occurrences of `vs` without period: `s41:562` "El budget decide ok vs timeout"; `s41:611` "Calculo remaining vs 429 real"; `s41:1319` (code comment) "async IO vs CPU offload"; `s41:2104` (rubric) "Comunicación de trade-offs y límites (stdlib vs FastAPI)". LT rule `PUNTO_EN_ABREVIATURAS`. | The Latin abbreviation *versus* is written `vs.` in Spanish (RAE accepts `vs` without period only in compact scientific citations). The course is otherwise typographically strict (pairs `¿¡`, no double spaces) — `vs` slips through. Either add the period or rewrite as `frente a` / `contra`. |
| 7 | M-4 | MEDIUM (grammar — determiner) | 4 occurrences of `misma clave + mismo body` / `misma key` used as a noun phrase: `s41:30` "misma clave + mismo body canónico ⇒ un solo side effect"; `s41:106` "Misma clave + mismo body ⇒ **replay**" and "Misma clave + body distinto ⇒ **conflicto**"; `s41:792` "misma key+mismo body ⇒ `replay`". | The same pattern flagged as M-3 in the S39 audit (`misma entidad` → `la misma entidad`). When `mismo/a` functions as an adjective modifying a noun, the determiner is required in formal es-PE: `la misma clave + el mismo body`. As a bulleted contract-style fragment the omission is recoverable but grammatically substandard; in a section that aims at Master-level writing, fix it. |
| 8 | M-5 | MEDIUM (style — siglas plural) | 8 occurrences of `APIs` (capitalised plural sigla): `s41:6` (title), `s41:7` (shortTitle), `s41:15` (jobRelevance), `s41:28` (heading), `s41:379` (iDo intro), `s41:2006` (youDo title), `s41:2189` & `s41:2204` (resources notes). LT rule `SIGLAS`. | RAE rule (DPD §"siglas"): siglas are invariable in plural — `las API`, not `las APIs`. Es-PE practice widely accepts `APIs` and `las APIs` in technical writing, so this is a style-preference flag rather than a hard error, but the course should pick one form and apply it consistently. The English-borrowed plural is acceptable if the section explicitly treats API as an English loanword (in italics or in code-style), but the section uses it in bold display text without italics. |
| 9 | M-6 | MEDIUM (redaction — long sentence) | `s41:229` — 39-word sentence: "Trabajo **CPU-bound** (parse pesado, crypto, score) o **durable** (job que debe sobrevivir al request) no debe esconderse en una coroutine del request ni en una tarea en memoria sin cola durable: muévelo a worker/background con store confiable." | FH = 39.4 (difícil). The sentence packs two parenthetical classifying lists, a negative (`no debe esconderse`), an alternative (`ni en una tarea …`), and an imperative introduced by `:`. It is the only theory paragraph sentence flagged LONG (>32 words) in the section and it sits inside T3-A — the same subtopic where the demo's `why` field re-explains the same idea in 18 words. Splitting the contract-style list into a colon + bullets, or breaking at "request ni en una tarea en memoria sin cola durable" with a period + new imperative, would lift readability without losing precision. |
| 10 | M-7 | MEDIUM (redaction — sentence-initial lowercase) | `s41:1490` (edgeCases) "fixture adverso: CPU en event loop sin offload (boundary rota)"; `s41:685`, `s41:741`, `s41:807`, `s41:866`, `s41:936`, `s41:1004`, `s41:1063`, `s41:1139`, `s41:1200`, `s41:1256`, `s41:1313`, `s41:1376`, `s41:1432`, `s41:1489`, `s41:1556`, `s41:1616`, `s41:1673`, `s41:1728`, `s41:1784`, `s41:1841`, `s41:1900`, `s41:1956` (every We-Do `edgeCases` array). LT rule `UPPERCASE_SENTENCE_START` × 2. | Every We-Do exercise has an identical `edgeCases: ["falta <field>", "fixture adverso: <description>", "CASO-ARE-041-<X> es sintético"]` triple. The second element is a sentence-like fragment starting with lowercase `fixture` after a comma/space — LT fires `UPPERCASE_SENTENCE_START` on `ok y timeout dejan resources vacío` (`s41:1490` tests string) and on `fixture adverso: POST create con status 200 (incoherente)` (`s41:685`). These are display strings rendered as bullets in the UI; the lowercase is a typographic choice that reads as terse contract notation, but a Master-level course should at minimum capitalise the first letter of each bullet fragment. |
| 11 | M-8 | LOW-MEDIUM (meta-leak — lab scaffolding) | 24 starterCode files begin with `# CASO-ARE-041 · <topic>` header comment, 37 inline `# DEFECT:` comments, and 24 `# Contrato: corrige …` comments. Total `CASO-ARE-041` token occurrences in the file: **143** (across prose, code comments, ids, fixture names). | Same `CASO-LIM-NNN` / `CASO-ARE-NNN` case-ID scaffolding pattern flagged for S10 (31×), S15 (24×), S39 (8×). Here it appears 24× as the first line of every starterCode. The `CASO-ARE-041` token is the author's internal taxonomy ID for the synthetic Arequipa case; it leaks into the learner's editor. The inline `# DEFECT: …` and `# Contrato: …` comments are **intentional pedagogical scaffolding** (labelling the bug to fix), so they are not strict meta-leak — but they reinforce the "internal taxonomy" feel. |
| 12 | M-9 | LOW-MEDIUM (style — anglicism) | `s41:2099` (rubric criterion 1) "Correctitud del contrato y gate (create/replay/conflict + status)". LT rule `MORFOLOGIK_RULE_ES` (no RAE entry) + manual review. | `Correctitud` is an anglicism (← "correctness"). RAE-preferred `corrección` is in the dictionary; `corrección técnica del contrato y del gate` reads more naturally in es-PE. Same in other Spanish-speaking engineering markets. Anglicism is acceptable in casual es-PE software talk but incongruent at Master-level rubric writing. |
| 13 | L-1 | LOW (grammar — false positive logged) | LT `PREP_VERB` × 11 on phrases like `en create`, `en response`, `en timeout`, `en replay`. | LT flags `preposition + verb` combinations, but `create` / `response` / `replay` here function as English-derived nouns (the create-operation, the response-payload, the replay-event). False positives — but a signal that the section uses English zero-derivation heavily. Acceptable in es-PE technical writing; recommend a one-line "Diccionario de la sección" entry clarifying that `create`, `replay`, `conflict`, `response` are used as nouns (the section already does this for `Idempotency-Key` and `Recurso` but not for the verb-nouns). |
| 14 | L-2 | LOW (grammar — false positive logged) | LT `AGREEMENT_NUMERAL_PLURAL` × 10 on phrases like `429 recuperable, consumidor v1 y trace sin PII` and `POST create 201 OK; POST create con status 200`. | LT sees `429` and `201` as numerals requiring plural agreement with the following noun. False positive — these are HTTP status codes used as labels, not numerals modifying nouns. No action; documented as a known LT noise class. |
| 15 | L-3 | LOW (grammar — false positive logged) | LT `SUBJUNTIVO_PASADO` × 6 on `Breach ⇒`, `Luego el lab te pedirá implementar`, `sin evide…`. | LT misfires on the `⇒` symbol and on `te pedirá implementar` (periphrasis). All false positives. |
| 16 | L-4 | LOW (grammar — false positive logged) | LT `APOSTROFO_ACENTO` × 6 on slash-separated values like `válido/adverso/campo` (E2 instructions). | LT treats `/` as a possible apostrophe and fires. False positive. |
| 17 | L-5 | LOW (style — comma density) | 63 sentences with high comma density (>0.12 commas per word). | Many are intentional lists (`Entrada: dict con case_id, method, resource, created, status`) — not strictly wrong but they contribute to WPS pressure. Convert list-heavy sentences to bullet form where the list exceeds 4 items. |
| 18 | L-6 | LOW (consistency — rubric text) | `s41:2099-2104` rubric criterion strings end without a period: `Correctitud del contrato y gate (create/replay/conflict + status)`, `Pruebas normal/breach/uncertain y recuperación`, `Seguridad, privacidad y least privilege (sin PII/secretos en response)`, `Operación: observabilidad (trace) y rollback mental`, `Comunicación de trade-offs y límites (stdlib vs FastAPI)`. | 5 of 6 criteria are missing the terminal period (the only one with a period is implicit in the closing parenthesis). Acceptable for UI labels but the missing `vs.` (M-3) and missing determiners make the strings read as terse telegraphic fragments. A 1-character pass adding `.` to each criterion would lift the visual polish. |
| 19 | L-7 | LOW (voice — feedback strings) | 8 `feedback` strings of the form `S41-T1-A-E1: un create exitoso es 201, no 200. E2/E3 usan RETURN_CORRECT_HTTP_STATUS cuando el status del record es incoherente y REVIEW_RESOURCE_SEMANTICS si falta el campo.` | Author-to-learner contract note voice. The `S41-T1-A-E1:` prefix exposes the internal exercise-ID taxonomy into the feedback bubble; pedagogically harmless but reinforces the meta-leak feel. |
| 20 | L-8 | LOW (style — anaphora in We-Do intros) | 24 `feedback` strings of the form `S41-<subtopic>-E2: explica qué campo cambió la decisión, por qué el adverso activa <TOKEN> y por qué faltar <field> exige <TOKEN>.` | Template rhythm — 8 of the 8 E2 feedback strings follow the exact same syntactic pattern. Not anaphoric monotony at the paragraph level (the per-paragraph rule did not fire) but a 24× template-sentence pattern that a learner scrolling through will find repetitive. Varying the second clause ("y por qué faltar X exige Y" → "y por qué la ausencia de X obliga a Y" / "y por qué sin X hay que reenviar a Y") would break the rhythm. |
| 21 | L-9 | LOW (consistency — empty `subtopicId` on first theory block) | `s41:27-63` first theory block has `heading: "Ruta de S41: APIs con FastAPI y contratos HTTP"` and **no `subtopicId`** (the other 8 blocks have `subtopicId: "S41-T1-A"` through `"S41-T4-B"`). | Inconsistent schema: 8 of 9 theory blocks carry a `subtopicId` used by the callout cross-references (`S41-T1-A: caso sintético con asserts locales…`). The first block is a dictionary/route preamble and arguably does not need a subtopic id, but the inconsistency means the callout map has a hole and a future fixer adding cross-links will need to special-case block 0. |

**Total findings:** 3 HIGH, 8 MEDIUM, 10 LOW = 21 issues.

---

## 4. Meta-Leak Report

### Critical meta-leaks (exact leaked text + location)

**Leak #1 — File name + section `id` retain the abandoned topic "LLM Fine-tuning"**
- Location: `src/lib/course/sections/s41-llm-finetuning.ts:1,4`
- Leaked text: file name `s41-llm-finetuning.ts`; `id: "llm-finetuning"` (line 4)
- Visible to learners: indirectly — it propagates to the demo map (H-2) and PDF label (H-3) which are visible.
- Severity: HIGH — root cause of the entire identity split.

**Leak #2 — Interactive demo is the OLD topic's QLoRA simulator**
- Location: `src/components/course/SectionView.tsx:3131-3188`
- Leaked text (verbatim):
  ```
  'llm-finetuning': {
    title: 'Practica QLoRA concepts (simulado)',
    code: `# Simulacion de conceptos de fine-tuning
  # Sin transformers real - simulamos la matematica

  # Simular cuantizacion 4-bit
  def simulate_quantization(model_params, bits=4):
      """Simula cuantizacion: reduce precision de pesos."""
      ...
  ```
- Visible to learners: YES — the "Pruébalo tú mismo" panel on the live section page.
- Severity: HIGH — first-impression cognitive betrayal.

**Leak #3 — PDF report label is the OLD topic's "FineTune"**
- Location: `src/components/course/PdfReport.tsx:81`
- Leaked text: `"llm-finetuning": '41. FineTune',`
- Visible to learners: YES — the downloadable progress/portfolio PDF.
- Severity: HIGH — portfolio integrity violation.

**Leak #4 — Internal case-ID taxonomy `CASO-ARE-041` leaked into starterCode (24×)**
- Location: every `weDo.steps[*].starterCode.code` field (24 occurrences).
- Leaked text (verbatim from `s41-t1-a-e1.py`):
  ```python
  # CASO-ARE-041 · HTTP method+status create
  # DEFECT: create devuelve 200 en lugar de 201
  # Contrato: corrige status_for; salida alineada a solutionCode
  def status_for(method: str, resource: str, created: bool) -> int:
      # DEFECT: create genérico 200 confunde el contrato OpenAPI
  ```
- Visible to learners: YES — first line of every exercise's starterCode.
- Severity: LOW-MEDIUM — intentional scaffolding for the synthetic case, but the `CASO-ARE-041` token is the author's internal taxonomy ID and leaks the case-management vocabulary into the learner's editor. Same class flagged for S10 (`CASO-LIM-010`), S15 (`CASO-LIM-015`), S39 (`CASO-LIM-039`).

**Leak #5 — Exercise-ID prefixes in feedback strings**
- Location: every `weDo.steps[*].feedback` field.
- Leaked text (sample): `S41-T1-A-E1: un create exitoso es 201, no 200. E2/E3 usan RETURN_CORRECT_HTTP_STATUS cuando el status del record es incoherente y REVIEW_RESOURCE_SEMANTICS si falta el campo.`
- Visible to learners: YES — feedback bubble after submission.
- Severity: LOW — the `S41-T1-A-E1:` prefix exposes the internal subtopic/exercise grid. Pedagogically harmless but reinforces meta-leak feel.

### Items reviewed and explicitly cleared
- **No** `// TODO`, `// FIXME`, `// XXX` comments in the section file.
- **No** "moved from section X" notes.
- **No** AI-to-developer comments in user-facing prose (the `# DEFECT:` and `# Contrato:` comments are inside starterCode and are intentional lab scaffolding, not author-to-AI notes).
- **No** `console.log`, `debugger`, `print('TODO')` in code samples.
- **No** placeholder URLs (`example.com`, `placeholder`, `lorem`).
- **No** "En la versión 2…" / "En producción real…" hedge beyond what is pedagogically motivated.
- **No** `me dijo que…` / `lo que el equipo quería…` internal design notes.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — EXCELLENT

| Component | Count | Structure | Fidelity |
|---|---|---|---|
| **Theory** | 9 blocks (1 dictionary + 8 subtopic × {3 paragraphs + 1 code + 1 callout}) | Dictionary up front, then T1-A → T1-B → T2-A → T2-B → T3-A → T3-B → T4-A → T4-B; each block ends with a `callout` titled "Contrato local" that names the **next** subtopic's gate | ✓ Exemplary progressive disclosure |
| **I Do** | 1 intro + 8 demos (one per subtopic) | Each demo has `description`, `code` (compilable Python), `output`, `why` (think-aloud) | ✓ Pure I-Do: "Te muestro 8 demos… Piensa en voz alta conmigo" |
| **We Do** | 1 intro + 24 exercises (3 per subtopic × 8 subtopics) | Each subtopic has E1=guided implement / E2=independent assess / E3=transfer decide; each exercise has `instruction`, `hint`, `hints[2]`, `edgeCases[3]`, `tests`, `feedback`, `starterCode`, `solutionCode` | ✓ Full We-Do: scaffolded → released → transferred |
| **You Do** | 1 capstone (title, context, 4 objectives, 8 requirements, 70-line `readiness()`-driven starterCode, portfolioNote, 6-criterion rubric) | `readiness()` returns `("READY", [])` only when create/replay/conflict/422/no-secret/single-side-effect/GET-stable all pass; rubric weights sum to 100% | ✓ Real capstone, not a checklist |
| **Self Check** | 8 MCQs (4 options + explanation each) | Each MCQ maps 1:1 to a `learningOutcomes` entry; explanations name the rule and the anti-pattern | ✓ Exemplary alignment |
| **Resources** | 10 docs, 2 books, 5 courses | FastAPI official (3), RFC 9110, RFC 9457, OpenAPI, Pydantic, Stripe Idempotency, OWASP API Sec, asyncio; DDIA, SRE; Coursera API design, MIT 6.100L, CS50P, Py4E, pytest | ✓ High-quality, canonical |

### 5.2 Cognitive load & progressive disclosure — STRONG

- The opening "Diccionario de la sección" (T0) front-loads 8 bold-key definitions (Recurso, Status semántico, Idempotency-Key, OpenAPI, Dependency injection, Compatibilidad de lectura, PII en errores) **before** the first subtopic — exactly the kind of pre-teaching vocabulary that cognitive-load theory recommends.
- Each subtopic opens with a "Desde S40 ya tienes fronteras de dominio; aquí la frontera se vuelve HTTP" / "Con el recurso y el 201 claros, el riesgo operativo es el reintento del cliente" / "Ya sabes *qué* devolver…; ahora *dónde* vive cada regla" / "El handler delgado asume un body ya confiable: hay que validar el esquema antes del dominio" / "El contrato HTTP puede ser correcto y aun así bloquear el event loop" / "Cuando el worker o el upstream tarda de más…" / "Ya tienes contratos, DI, 422 y timeouts: falta demostrar que un fallo se atrapa en el nivel correcto" / "El gate CP-N4-A no solo pide create idempotente: pide que un cliente v1 siga leyendo". This **explicit bridge sentence** at the start of every theory block is exactly the connective tissue the early sections were flagged for missing.
- Each subtopic closes with a CASO-ARE-041 anchor and a forward pointer to the next subtopic — a closed narrative loop.

### 5.3 Exercise quality and alignment — STRONG

- Each We-Do triplet follows the same E1/E2/E3 contract: E1 implements a domain function with a seeded DEFECT; E2 evaluates válido/adverso/missing on a record dict; E3 decides CONTINUE / breach-token / uncertainty-token. The 8 breach tokens (`RETURN_CORRECT_HTTP_STATUS`, `REVIEW_RESOURCE_SEMANTICS`, `RETURN_IDEMPOTENCY_CONFLICT`, `REPLAY_STORED_RESPONSE`, `THIN_THE_HANDLER`, `REVIEW_DEPENDENCY_BOUNDARY`, `REJECT_AND_REDACT`, `REGENERATE_OPENAPI`, `MOVE_WORK_OFF_EVENT_LOOP`, `CHOOSE_BACKGROUND_BOUNDARY`, `CANCEL_AND_CLOSE`, `RECALCULATE_TIMEOUT_BUDGET`, `BLOCK_UNTESTED_CONTRACT`, `ADD_MISSING_TEST_LEVEL`, `THROTTLE_AND_REDACT`, `INSPECT_COMPATIBILITY`) are domain-meaningful, not generic.
- Each E3 exercise closes with a comment: `# Los tokens (RETURN_*, THIN_THE_HANDLER, …) son códigos de lab fail-closed — no enums de producción.` — explicitly framing the lab as a learning artefact, not production code. Good anti-meta-leak hygiene *in the prose*, even if the breach tokens themselves are lab-internal.
- The You-Do `readiness()` function is the single best artefact: it asserts **seven** invariants in one function, so the learner cannot fake completion by flipping a boolean. The `portfolioNote` explicitly says "No fuerces flags booleanos: los asserts miden el comportamiento."

### 5.4 Consistency with the overall roadmap — MIXED

- The **content** narrative (S40 → S41 → S42) is internally coherent: S41 says "convierten las fronteras de S40 en endpoints versionados" and "S42 sumará authz, schemas estrictos y privacidad de servicios"; S42's actual title is "Schemas, seguridad y privacidad de servicios". ✓
- The **metadata** narrative (file names, demo keys, PDF labels) is broken at S41 (LLM Fine-tuning instead of APIs FastAPI) and at S42 (GraphRAG instead of Schemas y seguridad). ✗ This is the single biggest risk to the learner's mental model of the Phase-3 arc.
- The `CASO-ARE-041` synthetic case is consistent across the section and provides an honest Arequipa-office framing. ✓
- The cross-section `CASO-ARE-041-<X>` ID syntax (where `<X>` is the subtopic code like `1A`, `1B`, `2A`, `2B`, `3A`, `3B`, `4A`, `4B`) is consistent across all 24 exercises. ✓

### 5.5 Comparison with best-in-class external materials — STRONG

- **Topic overlap**: S41 covers the same ground as Stripe's "Idempotent requests" doc, the FastAPI testing tutorial, RFC 9110 (HTTP Semantics), RFC 9457 (Problem Details), and the test-pyramid literature (Cohn / Sloyer). The resources list correctly cites all five.
- **What S41 adds**: the stdlib-isomorphism pattern (build the contract in dicts/functions first, then map to `@app.post` / `Depends` / `BaseModel` / `TestClient`) is **not** in any of the canonical external materials and is a genuinely useful pedagogical move — it lets the learner reason about the contract without a FastAPI install or a running server. This is the section's pedagogical signature and it works.
- **What S41 lacks**: no mention of HTTP/2, gRPC, or GraphQL (out of scope, fine); no mention of API versioning strategies beyond URL path (`/v1/`) — header-based or content-negotiation versioning is implied by "compatibilidad de lectura" but never named; no mention of webhook delivery / outbound idempotency. These are reasonable omissions for a 20-hour section.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite (Theory, I-Do, We-Do, You-Do, Self-Check)

Method note (research summary): Per the `_GRAMMAR_SUBPLAN.md`, every learner-facing sentence in the section was scored with the Spanish Fernández-Huerta (FH) and Szigriszt-Pazos/INFLESZ formulas (syllable count via Spanish vowel-group heuristic), words-per-sentence (WPS) and syllables-per-word (SPW), plus 13 pedagogical heuristics (run-on, missing terminal punctuation, missing inverted `¿¡`, unbalanced delimiters, repeated words, English-dominant sentence, meta/AI/TODO leak, gerund pile-up, high comma density, paragraph-as-one-sentence, anaphoric monotony, space-before-punct, double space). The concatenated prose was also sent to the LanguageTool public API (`language=es`) in 3 chunks of ≤18,000 chars; 1,245 raw matches returned (1,173 of which are `MORFOLOGIK_RULE_ES` spelling-rule false positives on tech jargon like `FastAPI`, `Idempotency-Key`, `OpenAPI`, `Pydantic`, `trace_id`, `JobStore`, etc.). The 72 non-spelling matches were classified into 17 rule classes; the real ones are quoted in §3.

**Section-wide averages:**
- 272 prose blocks, 509 sentences
- Avg WPS = 11.77 (target ≤ 32 for technical es-PE) ✓
- Avg FH = 64.68 ("normal" / "bastante fácil" band for technical curriculum) ✓
- Avg SPW = 2.17 ✓
- Long (>32 w) sentences: 3 · Run-on (>45 w) sentences: 0 ✓
- Missing terminal punctuation: 75 (all in `title`/`tagline`/`heading`/`description`/`criterion`/`question`/`edgeCases`/`hint` label fields — acceptable for UI labels)
- Missing inverted `¿¡`: 0 ✓ · Unbalanced delimiters: 0 ✓ · Double spaces: 0 ✓ · Space-before-punct: 0 ✓ · Gerund pile-up: 0 ✓ · Anaphoric monotony: 0 ✓ · Repeated-word: 1 (false positive)

Below are the worst-sentences / paragraph-level rewrites for each tab where there is a real issue.

### 6.1 `theory` array — block T3-A paragraph 1 (M-6, the 39-word LONG sentence)

**Before (s41:229, original):**
> Trabajo **CPU-bound** (parse pesado, crypto, score) o **durable** (job que debe sobrevivir al request) no debe esconderse en una coroutine del request ni en una tarea en memoria sin cola durable: muévelo a worker/background con store confiable.
> [39 words · FH 39.4 · WPS 39 · flag LONG]

**After (proposed rewrite — split into 2 sentences, lift FH ~25 points):**
> Trabajo **CPU-bound** (parse pesado, crypto, score) o **durable** (un job que debe sobrevivir al request) no debe esconderse en una coroutine del request ni en una tarea en memoria sin cola durable. Muévelo a un worker en background con un store confiable.
> [~35 words across 2 sentences · estimated FH ≈ 55]

### 6.2 `theory` array — block T1-A paragraph 1 (style — M-2 / M-3 / M-4 / M-5 cluster, the dense status-matrix sentence)

**Before (s41:68, original):**
> Desde S40 ya tienes fronteras de dominio; aquí la frontera se vuelve **HTTP**. Modela recursos con **sustantivos** versionados (`/v1/jobs`, `/v1/health`), no verbos en la URL. El método comunica intención: **GET** es lectura segura e idempotente; **POST** crea o encola. El **status** es parte del contrato: **201** crea un recurso (cuerpo del job nuevo), **200** lectura OK, **422** body inválido (validación de esquema; FastAPI/Pydantic lo usa por defecto), **404** recurso ausente, **409** conflicto de negocio/idempotencia, **500** fallo interno. Elegir 200 en un create exitoso confunde a clientes y a OpenAPI.
> [34 words for the long sentence · FH 27.5 · WPS 34 · flag LONG]

**After (proposed rewrite — convert the status table to a colon + list, lift FH ~20 points):**
> Desde S40 ya tienes fronteras de dominio; aquí la frontera se vuelve **HTTP**. Modela recursos con **sustantivos** versionados (`/v1/jobs`, `/v1/health`), no verbos en la URL. El método comunica intención: **GET** es lectura segura e idempotente; **POST** crea o encola. El **status** es parte del contrato:
>
> - **201** — crea un recurso (cuerpo del job nuevo)
> - **200** — lectura OK
> - **422** — body inválido (validación de esquema; FastAPI/Pydantic lo usa por defecto)
> - **404** — recurso ausente
> - **409** — conflicto de negocio o de idempotencia
> - **500** — fallo interno
>
> Elegir 200 en un `create` exitoso confunde a los clientes y a OpenAPI.

### 6.3 `theory` T0 dictionary paragraph (M-4 — `misma clave + mismo body` determiner)

**Before (s41:30, original):**
> **Idempotency-Key:** misma clave + mismo body canónico ⇒ un solo side effect; body distinto ⇒ conflicto, no segundo create.

**After (proposed rewrite):**
> **Idempotency-Key:** la misma clave + el mismo body canónico ⇒ un solo side effect; body distinto ⇒ conflicto, no segundo `create`.

### 6.4 `theory` T1-B paragraph 1 (M-4 — `Misma clave + mismo body` at sentence start)

**Before (s41:106, original):**
> Misma clave + mismo body ⇒ **replay** sin segundo side effect. Misma clave + body distinto ⇒ **conflicto** (no silenciar ni crear otro job).

**After (proposed rewrite):**
> La misma clave + el mismo body ⇒ **replay** sin segundo side effect. La misma clave + un body distinto ⇒ **conflicto** (no silenciar ni crear otro job).

### 6.5 `iDo.intro` (M-3 — `vs` and the long enumeration, FH 38.6)

**Before (s41:379, original):**
> Te muestro 8 demos de S41 (APIs con FastAPI y contratos HTTP) alineadas a CP-N4-A. Piensa en voz alta conmigo: cada demo **calcula** un contrato en stdlib (no imprime la respuesta mágica) — status, idempotencia+keyset, DI, validación 422, boundaries async, timeouts con Problem Details, pirámide de tests y 429+trace. Luego el lab te pedirá implementar la misma idea.
> [33 words for the long sentence · FH 38.6]

**After (proposed rewrite — keep as one sentence but convert enumeration to a list, lift FH ~20 points):**
> Te muestro 8 demos de S41 (APIs con FastAPI y contratos HTTP) alineadas a CP-N4-A. Piensa en voz alta conmigo: cada demo **calcula** un contrato en stdlib (no imprime la respuesta mágica):
>
> - status HTTP y matriz método/recurso
> - idempotencia con keyset
> - dependency injection
> - validación 422
> - boundaries async / background
> - timeouts con Problem Details
> - pirámide de tests
> - 429 + trace sin PII
>
> Luego el lab te pedirá implementar la misma idea.

### 6.6 `iDo.steps[5].why` (M-3 — `vs`)

**Before (s41:562, original):**
> El budget decide ok vs timeout; el `finally` cierra recursos en ambos caminos. El error lleva `trace_id` y título seguro — sin PII — al estilo Problem Details.

**After (proposed rewrite):**
> El budget decide entre `ok` y `timeout`; el `finally` cierra recursos en ambos caminos. El error lleva `trace_id` y título seguro — sin PII — al estilo Problem Details.

### 6.7 `iDo.steps[7].why` (M-3 — `vs`)

**Before (s41:611, original):**
> Calculo remaining vs 429 real (no un string decorativo) y redacto el log: el email no sale. Compatibilidad v1 se preserva dejando `job_id`/`trace_id` estables.

**After (proposed rewrite):**
> Calculo `remaining` frente a un `429` real (no un string decorativo) y redacto el log: el email no sale. La compatibilidad v1 se preserva dejando `job_id` y `trace_id` estables.

### 6.8 `weDo.intro` (the long enumeration — keep but tighten, FH 44.8 borderline)

**Before (s41:616, original):**
> S41 · Laboratorio de contratos HTTP (modelo stdlib de FastAPI) para jobs y evidencia: 24 retos locales. **E1 implementa** la función de dominio del subtema (status, idempotencia, DI, 422, boundary, timeout, pirámide, 429) con un DEFECT real en el cuerpo de la función — no solo invertir un booleano sobre un dict. **E2 evalúa** válido/adverso/missing con `assess`. **E3 decide** CONTINUE / token de breach / token de incertidumbre. Los tokens (`RETURN_*`, `THIN_THE_HANDLER`, …) son códigos de lab fail-closed — no enums de producción. Fixtures sintéticos Arequipa (`CASO-ARE-041-*`).
> [32 words for the long sentence · FH 44.8 · borderline LONG]

**After (proposed rewrite — split the long sentence, lift FH ~15 points):**
> S41 · Laboratorio de contratos HTTP (modelo stdlib de FastAPI) para jobs y evidencia: 24 retos locales.
>
> - **E1 implementa** la función de dominio del subtema (status, idempotencia, DI, 422, boundary, timeout, pirámide, 429) con un DEFECT real en el cuerpo de la función — no solo invertir un booleano sobre un dict.
> - **E2 evalúa** válido / adverso / missing con `assess`.
> - **E3 decide** `CONTINUE` / token de breach / token de incertidumbre.
>
> Los tokens (`RETURN_*`, `THIN_THE_HANDLER`, …) son códigos de lab fail-closed — no enums de producción. Fixtures sintéticos Arequipa (`CASO-ARE-041-*`).

### 6.9 `weDo.steps[*].edgeCases` arrays (M-7 — 24×, sentence-initial lowercase)

**Before (sample, s41:685, original):**
> `edgeCases: ["falta status", "fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"]`

**After (proposed rewrite — capitalise the first letter of each fragment):**
> `edgeCases: ["Falta status", "Fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"]`

(Applies identically to all 24 `edgeCases` arrays — only the second element needs capitalising; the third element is a proper-noun case-ID and already starts with capital `CASO`.)

### 6.10 `weDo.steps[*].instruction` for E2 exercises — `o OpenAPI` (M-2, 1 occurrence inside an edgeCases string + 3 in instruction strings)

**Before (s41:192, original, theory T2-B paragraph 1):**
> Anti-patrón: 200 con leak o OpenAPI desalineado del comportamiento.

**After (proposed rewrite):**
> Anti-patrón: 200 con leak u OpenAPI desalineado del comportamiento.

(Same one-character fix at `s41:1139`, `s41:1200`, `s41:1256` — identical `edgeCases` array repeated 3×.)

### 6.11 `youDo.context` (M-5 — `APIs`; long sentence, FH 49.4)

**Before (s41:2007, original):**
> API versionada de jobs y evidencia para una oficina ficticia en Arequipa (`CASO-ARE-041`). Entrada: solicitudes HTTP con identidad sintética e Idempotency-Key. Salida: respuestas sin PII con status semánticos, evidencia y errores tipados. El gate se bloquea si un payload inválido, un timeout, un duplicado conflictivo o un límite excedido no produce un error tipado y observable — o si el replay duplica side effects.
> [31 words for the long sentence · FH 49.4]

**After (proposed rewrite — split the long sentence for clarity):**
> API versionada de jobs y evidencia para una oficina ficticia en Arequipa (`CASO-ARE-041`). Entrada: solicitudes HTTP con identidad sintética e `Idempotency-Key`. Salida: respuestas sin PII, con status semánticos, evidencia y errores tipados.
>
> El gate se bloquea si un payload inválido, un timeout, un duplicado conflictivo o un límite excedido no produce un error tipado y observable. También se bloquea si el replay duplica side effects.

### 6.12 `youDo.rubric[0].criterion` (M-9 — `Correctitud` anglicism) and `rubric[5].criterion` (M-3 — `vs`)

**Before (s41:2099, 2104, original):**
> `{ criterion: "Correctitud del contrato y gate (create/replay/conflict + status)", weight: "25%" }`
> `{ criterion: "Comunicación de trade-offs y límites (stdlib vs FastAPI)", weight: "10%" }`

**After (proposed rewrite):**
> `{ criterion: "Corrección técnica del contrato y del gate (create/replay/conflict + status)", weight: "25%" }`
> `{ criterion: "Comunicación de trade-offs y límites (stdlib vs. FastAPI)", weight: "10%" }`

### 6.13 `selfCheck.questions[*]` — overall: clean

The 8 self-check questions and their explanations are grammatically clean (FH range 50–80; no run-on; no missing terminal punct on explanations; MCQ options correctly use `…` ellipsis where the question trails). No rewrite needed.

The only micro-issue: `s41:2111` option (d) "202 siempre, aunque el job sea síncrono y ya exista el recurso" — the option is grammatically correct but pedagogically the rubric for "wrong option" should be visibly absurd; this one is, so it works.

### 6.14 `learningOutcomes` — overall: clean (FH range 55–75)

The 8 outcomes start with 8 different infinitive verbs (Diseñar, Implementar, Separar, Validar, Elegir, Presupuestar, Construir, Probar) — exemplary anaphoric variety for a list. No rewrite needed.

### 6.15 `jobRelevance` — long sentence (FH 28.1, the 31-word "En equipos de plataforma y producto…" sentence)

**Before (s41:15, original):**
> En equipos de plataforma y producto, **APIs con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa: respuestas OpenAPI sin PII (status, evidencia, errores tipados). Gate de promoción CP-N4-A: la misma Idempotency-Key no duplica side effects y la lectura conserva compatibilidad v1. S42 sumará authz, schemas estrictos y privacidad de servicios sobre este control plane.
> [31 words for the first sentence · FH 28.1]

**After (proposed rewrite — split the long sentence, also fix `APIs` and add determiner):**
> En equipos de plataforma y producto, las **APIs con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa: respuestas OpenAPI sin PII (status, evidencia, errores tipados).
>
> Gate de promoción CP-N4-A: la misma `Idempotency-Key` no duplica side effects y la lectura conserva compatibilidad v1. S42 sumará authz, schemas estrictos y privacidad de servicios sobre este control plane.

(Note: the `S42` forward-pointer is **content-correct** — S42's actual content title is "Schemas, seguridad y privacidad de servicios". The metadata fix in H-1/H-2/H-3 is what will make the rest of the visible roadmap match this forward-pointer.)

---

## 7. Proposed GitHub-style Diffs (one per issue or logical group)

### Diff 7.1 — H-1, H-2, H-3 (the identity split)

The cleanest fix is to rename the file and update the `id` so that all three downstream consumers (SectionView demo, PdfReport label, future breadcrumbs) pick up the new identity by key. Renaming the file requires touching `index.ts` and the two consumer maps.

```diff
--- a/src/lib/course/index.ts
+++ b/src/lib/course/index.ts
@@ -42,7 +42,7 @@
 // Phase 3 — Master (40-52)
 import { section40 } from './sections/s40-agentic-architecture'
-import { section41 } from './sections/s41-llm-finetuning'
+import { section41 } from './sections/s41-fastapi-contracts'
 import { section42 } from './sections/s42-graph-rag'
```

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-fastapi-contracts.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

 export const section41: CourseSection = {
-  id: "llm-finetuning",
+  id: "fastapi-contracts",
   index: 41,
   title: "APIs con FastAPI y contratos HTTP",
```

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -78,7 +78,7 @@
   "performance-extreme": '38. Concurrencia',
   "integrator-phase2": '39. Capstone P2',
   "agentic-architecture": '40. Agentic',
-  "llm-finetuning": '41. FineTune',
+  "fastapi-contracts": '41. APIs FastAPI',
   "graph-rag": '42. GraphRAG',
```

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -3128,28 +3128,42 @@
       hint: 'Anade un cuarto agente "Reviewer" que valide el reporte',
     },
-    'llm-finetuning': {
-      title: 'Practica QLoRA concepts (simulado)',
-      code: `# Simulacion de conceptos de fine-tuning
-# Sin transformers real - simulamos la matematica
-
-# Simular cuantizacion 4-bit
-def simulate_quantization(model_params, bits=4):
-    """Simula cuantizacion: reduce precision de pesos."""
-    max_val = 2**bits - 1
-    quantized = [round(p * max_val) / max_val for p in model_params]
-    compression = (32 - bits) / 32  # de FP32 a N-bit
-    return quantized, compression
-... (QLoRA demo body removed) ...
-      hint: 'Calcula la VRAM necesaria para un modelo de 70B en INT4',
+    'fastapi-contracts': {
+      title: 'Practica Idempotency-Key y status (simulado)',
+      code: `# Contrato HTTP en stdlib (isomorfo a FastAPI)
+# Sin servidor real - modelamos el contrato
+
+def status_for(method, resource, created):
+    """Status semántico: 201 create, 200 read, 404 missing, 405 method."""
+    if method == "POST" and resource.endswith("/jobs") and created:
+        return 201
+    if method == "GET" and resource.endswith("/health"):
+        return 200
+    if method == "GET" and resource.endswith("/jobs") and not created:
+        return 404
+    return 405
+
+def idempotent_create(store, key, body):
+    """Misma key + mismo body => replay; body distinto => conflict."""
+    if key in store:
+        return "replay" if store[key] == body else "conflict"
+    store[key] = body
+    return "created"
+
+print("=== Status matrix ===")
+for m, r, c in [("POST","/v1/jobs",True), ("GET","/v1/health",False), ("GET","/v1/jobs",False)]:
+    print(m, r, status_for(m, r, c))
+
+print("\\n=== Idempotency ===")
+store = {}
+print(idempotent_create(store, "k1", {"name":"job"}))
+print(idempotent_create(store, "k1", {"name":"job"}))
+print(idempotent_create(store, "k1", {"name":"other"}))
+print("side_effects", len(store))`,
+      expectedOutput: `=== Status matrix ===
+POST /v1/jobs 201
+GET /v1/health 200
+GET /v1/jobs 404
+
+=== Idempotency ===
+created
+replay
+conflict
+side_effects 1`,
+      hint: 'Agrega un GET /v1/jobs/{id} que devuelva 200 o 404 según el store',
     },
     'graph-rag': {
```

> **Note for the Fixer agent:** if the orchestrator prefers not to rename the file (to keep the diff surface small), the alternative is to keep the file name and `id` as-is and **only** update the demo content (SectionView.tsx:3131-3188) and the PDF label (PdfReport.tsx:81) so they reflect the actual content. That is a smaller change but leaves the file-name/id misnomer in place for future contributors. The Diff Architect's recommendation is the full rename above.

### Diff 7.2 — M-2 (`o OpenAPI` → `u OpenAPI`, 4 occurrences)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -189,7 +189,7 @@
-        "Rutas que debes poder ejecutar en lab: body crudo + allow-set → `(422, error tipado)` si faltan campos; si es válido → vista sin campos internos. `internal_key` no aparece en la respuesta y el caso inválido no llama a `create_job`. Anti-patrón: 200 con leak o OpenAPI desalineado del comportamiento.",
+        "Rutas que debes poder ejecutar en lab: body crudo + allow-set → `(422, error tipado)` si faltan campos; si es válido → vista sin campos internos. `internal_key` no aparece en la respuesta y el caso inválido no llama a `create_job`. Anti-patrón: 200 con leak u OpenAPI desalineado del comportamiento.",
@@ -1136,7 +1136,7 @@
-        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret o OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
+        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret u OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
@@ -1197,7 +1197,7 @@
-        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret o OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
+        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret u OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
@@ -1253,7 +1253,7 @@
-        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret o OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
+        edgeCases: ["falta openapi_matches", "fixture adverso: 200 con leak de secret u OpenAPI desalineado", "CASO-ARE-041-2B es sintético"],
```

### Diff 7.3 — M-3 (`vs` → `vs.`, 4 occurrences)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -559,7 +559,7 @@
-        why: "El budget decide ok vs timeout; el `finally` cierra recursos en ambos caminos. El error lleva `trace_id` y título seguro — sin PII — al estilo Problem Details.",
+        why: "El budget decide entre `ok` y `timeout`; el `finally` cierra recursos en ambos caminos. El error lleva `trace_id` y título seguro — sin PII — al estilo Problem Details.",
@@ -608,7 +608,7 @@
-        why: "Calculo remaining vs 429 real (no un string decorativo) y redacto el log: el email no sale. Compatibilidad v1 se preserva dejando `job_id`/`trace_id` estables.",
+        why: "Calculo `remaining` frente a un `429` real (no un string decorativo) y redacto el log: el email no sale. La compatibilidad v1 se preserva dejando `job_id` y `trace_id` estables.",
@@ -1316,7 +1316,7 @@
-          code: `# CASO-ARE-041 · async IO vs CPU offload
+          code: `# CASO-ARE-041 · async IO vs. CPU offload
@@ -2101,7 +2101,7 @@
-      { criterion: "Comunicación de trade-offs y límites (stdlib vs FastAPI)", weight: "10%" },
+      { criterion: "Comunicación de trade-offs y límites (stdlib vs. FastAPI)", weight: "10%" },
```

### Diff 7.4 — M-4 (`misma clave + mismo body` → `la misma clave + el mismo body`, 4 occurrences)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -27,7 +27,7 @@
-        "**Diccionario de la sección** (léelo antes de T1). **Recurso:** sustantivo versionado (`/v1/jobs`). **Status semántico:** 201 create, 200 read, **422** validación de body (Pydantic/FastAPI), **405** método no permitido en el recurso, 404 ausencia, 409 conflicto de negocio/idempotencia, 429 rate limit, 5xx servidor. No uses 400 genérico para enmascarar un 422 de esquema. **Idempotency-Key:** misma clave + mismo body canónico ⇒ un solo side effect; body distinto ⇒ conflicto, no segundo create. **OpenAPI:** contrato de request/response documentado y fiel al comportamiento. **Dependency injection:** handler delgado; capacidad inyectada (`Depends` en FastAPI). **Compatibilidad de lectura:** clientes v1 siguen leyendo campos estables. **PII en errores:** prohibido — códigos, título y `trace_id` seguros (estilo RFC 9457).",
+        "**Diccionario de la sección** (léelo antes de T1). **Recurso:** sustantivo versionado (`/v1/jobs`). **Status semántico:** 201 create, 200 read, **422** validación de body (Pydantic/FastAPI), **405** método no permitido en el recurso, 404 ausencia, 409 conflicto de negocio/idempotencia, 429 rate limit, 5xx servidor. No uses 400 genérico para enmascarar un 422 de esquema. **Idempotency-Key:** la misma clave + el mismo body canónico ⇒ un solo side effect; body distinto ⇒ conflicto, no segundo create. **OpenAPI:** contrato de request/response documentado y fiel al comportamiento. **Dependency injection:** handler delgado; capacidad inyectada (`Depends` en FastAPI). **Compatibilidad de lectura:** clientes v1 siguen leyendo campos estables. **PII en errores:** prohibido — códigos, título y `trace_id` seguros (estilo RFC 9457).",
@@ -103,7 +103,7 @@
-        "Con el recurso y el 201 claros, el riesgo operativo es el **reintento del cliente**. La **Idempotency-Key** (header de industria, p. ej. Stripe) liga una clave al **hash canónico del body** y a la respuesta guardada. Misma clave + mismo body ⇒ **replay** sin segundo side effect. Misma clave + body distinto ⇒ **conflicto** (no silenciar ni crear otro job). El **versionado** (`/v1/...`) congela campos públicos; la **paginación por cursor** (keyset: `next=job-020`) es más estable que offset puro cuando el set cambia entre requests.",
+        "Con el recurso y el 201 claros, el riesgo operativo es el **reintento del cliente**. La **Idempotency-Key** (header de industria, p. ej. Stripe) liga una clave al **hash canónico del body** y a la respuesta guardada. La misma clave + el mismo body ⇒ **replay** sin segundo side effect. La misma clave + un body distinto ⇒ **conflicto** (no silenciar ni crear otro job). El **versionado** (`/v1/...`) congela campos públicos; la **paginación por cursor** (keyset: `next=job-020`) es más estable que offset puro cuando el set cambia entre requests.",
@@ -789,7 +789,7 @@
-        instruction: "S41-T1-B-E1 · Implementa `idempotent_create(store, key, body)` para el contrato de idempotencia (`CASO-ARE-041-1B`). Primera llamada con key+body ⇒ `created`; misma key+mismo body ⇒ `replay`; misma key+body distinto ⇒ `conflict`. El starter ignora la store y siempre crea (DEFECT). Tras dos POST idénticos, `len(store)==1`. Salida exacta: `S41-T1-B PASS`. En E2/E3 evaluarás el mismo criterio como assess/decide.",
+        instruction: "S41-T1-B-E1 · Implementa `idempotent_create(store, key, body)` para el contrato de idempotencia (`CASO-ARE-041-1B`). Primera llamada con key+body ⇒ `created`; la misma key + el mismo body ⇒ `replay`; la misma key + un body distinto ⇒ `conflict`. El starter ignora la store y siempre crea (DEFECT). Tras dos POST idénticos, `len(store)==1`. Salida exacta: `S41-T1-B PASS`. En E2/E3 evaluarás el mismo criterio como assess/decide.",
```

### Diff 7.5 — M-6 (split the 39-word LONG sentence in T3-A paragraph 1)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -226,7 +226,8 @@
       paragraphs: [
-        "El contrato HTTP puede ser correcto y aun así **bloquear el event loop**. **Async** brilla cuando el handler **espera I/O** (red, disco, DB): `await` libera el loop. Trabajo **CPU-bound** (parse pesado, crypto, score) o **durable** (job que debe sobrevivir al request) no debe esconderse en una coroutine del request ni en una tarea en memoria sin cola durable: muévelo a worker/background con store confiable.",
+        "El contrato HTTP puede ser correcto y aun así **bloquear el event loop**. **Async** brilla cuando el handler **espera I/O** (red, disco, DB): `await` libera el loop. Trabajo **CPU-bound** (parse pesado, crypto, score) o **durable** (un job que debe sobrevivir al request) no debe esconderse en una coroutine del request ni en una tarea en memoria sin cola durable. Muévelo a un worker en background con un store confiable.",
```

### Diff 7.6 — M-7 (capitalise second element of all 24 `edgeCases` arrays)

This is a 24× mechanical change. The Fixer agent can apply it with a single sed-style substitution scoped to the We-Do `edgeCases` arrays, replacing `"fixture adverso:` with `"Fixture adverso:`. (The first element `"falta <field>"` is intentionally lowercase as a contract-notation token; the Fixer should decide whether to capitalise it too for visual consistency — recommended yes.)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -682,7 +682,7 @@
-        edgeCases: ["falta status", "fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
+        edgeCases: ["Falta status", "Fixture adverso: POST create con status 200 (incoherente)", "CASO-ARE-041-1A es sintético"],
@@ -738,7 +738,7 @@   (identical substitution)
@@ -797,7 +797,7 @@   (identical substitution, subtopic 1B)
@@ -850,7 +850,7 @@   (identical substitution, subtopic 1B)
@@ +20 more identical lines for the remaining 20 edgeCases arrays
```

### Diff 7.7 — M-9 (`Correctitud` → `Corrección técnica`)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -2096,7 +2096,7 @@
   rubric: [
-      { criterion: "Correctitud del contrato y gate (create/replay/conflict + status)", weight: "25%" },
+      { criterion: "Corrección técnica del contrato y del gate (create/replay/conflict + status)", weight: "25%" },
```

### Diff 7.8 — L-8 (vary the We-Do E2 feedback template, 8 occurrences)

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -685,7 +685,7 @@
-        feedback: "S41-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso activa RETURN_CORRECT_HTTP_STATUS y por qué faltar status exige REVIEW_RESOURCE_SEMANTICS.",
+        feedback: "S41-T1-A-E2: explica qué campo cambió la decisión, por qué el adverso dispara RETURN_CORRECT_HTTP_STATUS y por qué la ausencia de status obliga a REVIEW_RESOURCE_SEMANTICS.",
@@ -853,7 +853,7 @@
-        feedback: "S41-T1-B-E2: explica qué campo cambió la decisión, por qué el adverso activa RETURN_IDEMPOTENCY_CONFLICT y por qué faltar version exige REPLAY_STORED_RESPONSE.",
+        feedback: "S41-T1-B-E2: explica qué campo cambió la decisión, qué condición del adverso produce RETURN_IDEMPOTENCY_CONFLICT y por qué sin version hay que reenviar a REPLAY_STORED_RESPONSE.",
@@ +6 more analogous variations to break the 8× template rhythm
```

### Diff 7.9 — M-5 (`APIs` → `API` invariable, optional / es-PE-aware)

The course should pick a single convention. The Fixer agent should either:
(a) keep `APIs` everywhere (acceptable in es-PE technical writing — add a one-line note in T0 dictionary: `**APIs:** plural aceptado en es-PE técnico; RAE prefiere la sigla invariable ("las API").`) **or**
(b) replace `APIs` → `API` throughout (8 occurrences) for RAE compliance.

```diff
--- a/src/lib/course/sections/s41-llm-finetuning.ts
+++ b/src/lib/course/sections/s41-llm-finetuning.ts
@@ -3,7 +3,7 @@
 export const section41: CourseSection = {
   id: "llm-finetuning",
   index: 41,
-  title: "APIs con FastAPI y contratos HTTP",
-  shortTitle: "APIs FastAPI",
+  title: "API con FastAPI y contratos HTTP",
+  shortTitle: "API FastAPI",
   tagline: "API versionada que crea jobs y consulta resultados/evidencia, sin exponer PII ni claves internas",
@@ -13,7 +13,7 @@
   jobRelevance:
-    "En equipos de plataforma y producto, **APIs con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa: respuestas OpenAPI sin PII (status, evidencia, errores tipados). Gate de promoción CP-N4-A: la misma Idempotency-Key no duplica side effects y la lectura conserva compatibilidad v1. S42 sumará authz, schemas estrictos y privacidad de servicios sobre este control plane.",
+    "En equipos de plataforma y producto, las **API con FastAPI y contratos HTTP** convierten las fronteras de S40 en endpoints versionados con evidencia operativa: respuestas OpenAPI sin PII (status, evidencia, errores tipados). Gate de promoción CP-N4-A: la misma Idempotency-Key no duplica side effects y la lectura conserva compatibilidad v1. S42 sumará authz, schemas estrictos y privacidad de servicios sobre este control plane.",
@@ +5 more analogous substitutions at lines 28, 379, 2006, 2189, 2204
```

---

## 8. Recommended Priority Order for Fixing

1. **(P0) H-1, H-2, H-3 — Section identity split.** Rename `s41-llm-finetuning.ts` → `s41-fastapi-contracts.ts`, change `id` to `fastapi-contracts`, replace the QLoRA demo in `SectionView.tsx:3131-3188` with an HTTP-contract demo (status matrix + idempotency), and update the PDF label in `PdfReport.tsx:81` to `'41. APIs FastAPI'`. Single coordinated change. Score impact: +2.2 (5.8 → 8.0).
2. **(P0) M-1 — Verify the S42 forward-pointer aligns after the Phase-3 metadata sweep.** The `jobRelevance` sentence "S42 sumará authz, schemas estrictos y privacidad de servicios sobre este control plane" is content-correct, but only if S42's metadata is also fixed in the same pass. Coordinate with S42's auditor / fixer.
3. **(P1) M-2 — `o OpenAPI` → `u OpenAPI`** (4 occurrences, 1 character each). Mechanical, 5-minute fix.
4. **(P1) M-3 — `vs` → `vs.`** (4 occurrences). Mechanical.
5. **(P1) M-4 — `misma clave + mismo body` → `la misma clave + el mismo body`** (4 occurrences). Mechanical.
6. **(P2) M-6 — Split the 39-word T3-A sentence** (1 rewrite, lift FH 39 → ~55).
7. **(P2) M-7 — Capitalise second element of all 24 `edgeCases` arrays** (mechanical sed-style substitution).
8. **(P2) M-9 — `Correctitud` → `Corrección técnica`** (1 occurrence in rubric).
9. **(P3) M-5 — `APIs` convention** (pick one and apply consistently; 8 occurrences).
10. **(P3) L-8 — Vary the 8 E2 feedback templates** to break the rhythm.
11. **(P4) M-8 — Strip the `# CASO-ARE-041 · <topic>` header comment from starterCode** if the course-wide convention is to remove internal case-ID scaffolding from learner-visible code (decide once, apply to S10 / S15 / S39 / S41 together).
12. **(P4) L-9 — Add a `subtopicId: "S41-T0"` to the first theory block** for schema consistency with the other 8 blocks.
13. **(P5) L-1 through L-7** — false-positive LT classes; no action needed beyond documentation.

---

## 9. Graph Memory Update Notes (for the shared context files)

- **Pattern: Phase-3 metadata drift.** S41 is the second confirmed case (after S39's `demos['integrator-phase2']` CI/CD-simulator drift) where the Phase-3 section `id` does not match the section content. S42 is the third (`graph-rag` id with "Schemas, seguridad y privacidad de servicios" content + GraphRAG demo + '42. GraphRAG' PDF label). The shared graph memory should add an edge: **(Phase-3 section id) — DRIFTED_FROM — (Phase-3 section content title)** for S40, S41, S42, …, S52 so the orchestrator can decide whether to do a Phase-3-wide metadata sweep.
- **Pattern: `CASO-ARE-NNN` / `CASO-LIM-NNN` case-ID scaffolding in starterCode.** S41 (24×) joins S10 (31×), S15 (24×), S39 (8×). The shared graph memory should track this as a course-wide P4-class cleanup task (single decision: keep as scaffolding or strip from learner-visible code).
- **Pattern: `vs` without period.** S41 (4×) joins S39 (4×). Course-wide typography pass recommended.
- **Pattern: `o <O-sound>` → `u <O-sound>`** (e.g. `o OpenAPI`, `o OWASP`). S41 (4×) — add to the course-wide redaction checklist.
- **Pattern: `misma <noun>` without determiner.** S41 (4× `misma clave`) joins S39 (3× `misma entidad`). Course-wide grammar pass recommended.
- **Pattern: `APIs` plural sigla.** S41 (8×). Add to the course-wide style guide decision (pick `APIs` or `API`).
- **Section-specific strength: stdlib-isomorphism pattern.** S41 introduces a pedagogical signature not seen in earlier sections — "build the contract in stdlib dicts/functions first, then map to `@app.post` / `Depends` / `BaseModel` / `TestClient`". This is a transferable pattern worth surfacing in the orchestrator's "best practices" memory for future capstone-style sections.
- **Section-specific strength: `readiness()`-driven You-Do capstone.** The `readiness()` function that asserts seven invariants in one place is the strongest anti-fake-completion mechanism seen in the audited sections. Worth flagging as a template for S51 (`integrator-final`).
- **LT noise classes confirmed for S41:** `MORFOLOGIK_RULE_ES` (1,173 false positives on tech jargon), `PREP_VERB` (11 false positives on `en create` / `en response`), `AGREEMENT_NUMERAL_PLURAL` (10 false positives on HTTP status codes used as labels), `SUBJUNTIVO_PASADO` (6 false positives on `⇒` and periphrasis), `APOSTROFO_ACENTO` (6 false positives on slash-separated values). These should be added to the shared LT-noise allowlist so future section auditors do not re-report them as real findings.

---

## 10. Method Note (Spanish Grammar / Style / Structure Audit)

Per the `_GRAMMAR_SUBPLAN.md`, the following research-backed methods were applied:

**A. Spanish readability / structure formulas (surface metrics)** — computed offline for every sentence and paragraph:
- **Fernández-Huerta (1959)**: `206.84 − 60·(syllables/word) − 1.02·(words/sentence)` — Spanish Flesch adaptation.
- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syllables/word) − (words/sentence)` — used in es-PE education literature.
- **Words per sentence (WPS)** and **Syllables per word (SPW)** with a Spanish vowel-group heuristic for syllable counting.

Interpretive bands for technical es-PE: avg FH 50–70 is healthy (S41 = 64.68 ✓); avg WPS ≤ 32 is the soft ceiling (S41 = 11.77 ✓).

**B. Rule-based grammar & style engine** — LanguageTool public HTTP API (`language=es`), 3 chunks of ≤18,000 characters with 4-second sleeps. 1,245 raw matches returned; 1,173 are `MORFOLOGIK_RULE_ES` spelling-rule false positives on tech jargon and were filtered. The 72 non-spelling matches were classified into 17 rule classes; 6 are real findings (`Y_E_O_U`, `PUNTO_EN_ABREVIATURAS`, `SIGLAS`, `UPPERCASE_SENTENCE_START`, `WRONG_IMPERATIVE` for noun-`create`, `SPANISH_WORD_REPEAT_RULE` × 1 false positive). The rest are false positives on tech-token / status-code / slash-separator patterns documented in §9.

**C. Pedagogical Spanish heuristics (curriculum-specific)** — applied offline to every sentence and paragraph:
- Long-sentence (>32 w) / run-on (>45 w) detection: 3 long, 0 run-on ✓
- Missing terminal `.?!` detection: 75 hits, all in label/heading/criterion fields (acceptable)
- Missing `¿` / `¡` detection: 0 ✓
- Unbalanced `()[]«»""` detection: 0 ✓
- Repeated-word (`de de`) detection: 1 (false positive on `trabajo (I/O o sync OK)`)
- English-dominant sentence detection: 0 ✓
- Meta / AI / TODO leak detection: 0 in prose (the `# DEFECT:` / `# Contrato:` comments in starterCode are intentional scaffolding, classified separately in §4)
- Gerund pile-up (≥3) detection: 0 ✓
- High comma density (>0.12 commas/word) detection: 63 (mostly intentional lists — see L-3)
- Paragraph-as-one-sentence detection: 0 ✓
- Anaphoric monotony (same sentence start ≥3 in a paragraph) detection: 0 ✓
- Space-before-punct / double space detection: 0 ✓

**D. Composite section score (0–10)** — start at 10; subtract weighted H/M/L findings; light penalty if FH is extreme. S41: 10 − 3·0.6 (3 HIGH) − 8·0.18 (8 MEDIUM) − 10·0.05 (10 LOW) = 10 − 1.8 − 1.44 − 0.5 = **6.26**, rounded to **5.8** with an additional small penalty for the identity-split's outsized pedagogical impact (a learner's first "Pruébalo tú mismo" click betraying the just-learned content is a critical-experience failure that the raw finding-count does not fully capture).

---

**This is the complete Explorer report for Section 41. Ready for the Fixer prompt.**
