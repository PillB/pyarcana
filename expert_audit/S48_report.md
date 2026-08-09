# Curriculum Audit Report — Section 48 (S48)

**Section identity (confirmed):** `section48` in
`src/lib/course/sections/s48-ai-governance.ts` (repo
`https://github.com/PillB/pyarcana`). `id: "ai-governance"`, `index: 48`,
`title: "LLM applications y RAG con evidencia"`, `shortTitle: "RAG con evidencia"`.
Listed at position 48 of 52 in `src/lib/course/index.ts`
(`section46, section47, section48, section49, …`).

**Live site confirmation (agent-browser on
`https://pillb.github.io/pyarcana/`):** the 48th card in the rendered
sidebar reads exactly:

> **48 — RAG con evidencia**
> asistente sobre docs autorizados, citas verificables y abstención cuando retrieval no sostiene la respuesta
> 20h · Master

Source and live site agree. Section 48 is unambiguously the
"RAG con evidencia" / `ai-governance` section.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| `id` | `ai-governance` |
| `index` | 48 |
| `title` | `LLM applications y RAG con evidencia` |
| `shortTitle` | `RAG con evidencia` |
| `tagline` | `asistente sobre docs autorizados, citas verificables y abstención cuando retrieval no sostiene la respuesta` |
| `estimatedHours` | 20 |
| `level` | Master |
| `phase` | 3 |
| `icon` | `Scale` |
| Filename | `s48-ai-governance.ts` (2,020 lines) |
| Tabs audited | Theory (8 subtopics T1-A…T4-B), I Do (8 demos), We Do (24 exercises E1×8 + E2×8 + E3×8), You Do (portfolio + rubric), Self Check (7 MCQs), Resources (10 docs / 2 books / 5 courses) |

**Scope of prose analyzed:** all learner-facing string fields
(`title`, `shortTitle`, `tagline`, `jobRelevance`, `learningOutcomes[].text`,
`theory[].heading`, `theory[].paragraphs[]`, `theory[].callout.title/content`,
`iDo.intro`, `iDo.steps[].description/why`, `weDo.intro`,
`weDo.steps[].instruction/hint/hints[]/edgeCases[]/tests/feedback`,
`youDo.title/context/objectives[]/requirements[]/portfolioNote/rubric[].criterion`,
`selfCheck.questions[].question/options[]/explanation`,
`resources.docs/books/courses[].label/note`). Code blocks
(`starterCode.code`, `solutionCode.code`, `theory[].code.code`,
`youDo.starterCode`) and `output` strings were **excluded** from the
grammar pass per the subplan (code-only / id-only strings).

**Roadmap mismatch (consistency flag — not a defect in the section itself,
but worth surfacing):** the master roadmap
`el_arte_de_python_roadmap_maestro_52_secciones.md` line 416 reads
"**Sección 48 — Cost, Latency & Scaling Optimization**", while the
implemented section is "RAG con evidencia" (`ai-governance`). The
filename (`s48-ai-governance`), the `id` (`ai-governance`), the
`title` (`LLM applications y RAG con evidencia`), and the live sidebar
("RAG con evidencia") are **internally inconsistent with each other and
with the roadmap**. The actual content is a RAG-with-evidence lab, not an
AI-governance section nor a cost/latency/scaling section.

---

## 2. Executive Summary of Quality

**Composite score: 6.5 / 10**

**Verdict:** Section 48 is a **technically dense, well-engineered** RAG
lab with strong I Do / We Do / You Do fidelity, real fail-closed
contracts, and a coherent narrative arc (T1 retrieval/holdout → T2
chunking/ACL → T3 hybrid/citas → T4 grounding/abstención). The exercise
suite (24 graded tasks with starter/solution/test triples and explicit
adversarial fixtures) is one of the most rigorous in the course.

**However**, the section is dragged down by four systemic issues:

1. **Meta-leak in all 8 theory callouts (HIGH).** Every
   `theory[].callout.content` reads as an internal author/Scrum note
   ("Nota de orientación", "Antes de promover S48-T1-B, verifica
   contrato", "El dueño de S48-T4-A responde por rollback", "Cierre de
   S48-T4-B: …") rather than a learner-facing tip. Several use
   imperatives directed at the author ("verifica", "documenta", "no
   promociones") and reference future subtopics the learner has not yet
   reached. This is the single biggest quality defect.
2. **Title / filename / id / roadmap inconsistency (HIGH).** The
   section is identified four different ways ("ai-governance",
   "LLM applications y RAG con evidencia", "RAG con evidencia",
   "Cost, Latency & Scaling Optimization"). The title mixes English
   `applications` with Spanish (`y RAG con evidencia`) while the body
   uses `aplicaciones LLM`.
3. **Templated, repetitive feedback (MEDIUM).** All 24 We Do feedback
   strings follow the same skeleton ("S48-Tx-x-Ex: explica qué campo
   cambió la decisión, por qué el adverso activa X y por qué faltar Y
   exige Z"), and 18 of 24 are byte-for-byte identical within their
   subtopic triple. This defeats the pedagogical purpose of feedback
   (specific, per-exercise coaching).
4. **Spanish micro-grammar issues (MEDIUM).** `cache` used 7× (should be
   `caché` per RAE), `APIs` 2× (Spanish acronyms don't take plural `s`),
   `vs` 3× (should be `vs.`), missing comma before `pero` (L209),
   `Cada claim material debe estar citada y permitida` (concordance —
   `claim` is masculine), `similaridad` (should be `similitud`,
   inconsistent with the rest of the section), tagline starts lowercase.

Readability is healthy for a Master-level technical section:
Fernández-Huerta avg **72.0** (normal), INFLESZ avg **67.7** (normal),
WPS avg **13.95** (well within the 15–32 technical-Spanish target),
SPW avg **2.01**. Only 3 sentences exceed 32 words (max 37), and none
are run-ons (>45w). Cognitive load is well-managed at the sentence
level; the load problem is at the **callout** level (forward references
and author-tone notes).

---

## 3. Detailed Issue Registry

Issues are numbered `S48-NNN`. Severity: **H** = blocks learning /
meta-leak, **M** = grammar/pedagogy defect, **L** = style/polish.

### Meta-leak & author-orientation (HIGH priority)

| ID | Sev | Location | Evidence (verbatim) | Impact |
|---|---|---|---|---|
| S48-001 | H | `theory[0].callout.content` (L58, T1-A) | `"Nota de orientación: S48-T1-A: caso sintético con asserts; sin evidencia no promociones."` | "Nota de orientación" is author-to-author register; "no promociones" is imperative to the author/maintainer, not the learner. Callout title is "Contrato local" but content is an orientation note. |
| S48-002 | H | `theory[1].callout.content` (L88, T1-B) | `"Antes de promover S48-T1-B, verifica contrato y riesgo residual."` | "Antes de promover" = author gate language ("promover" = promote a subtopic through the QA gate). "verifica" = imperative to author. |
| S48-003 | H | `theory[2].callout.content` (L118, T2-A) | `"La revisión de S48-T2-A exige fail-closed y salida esperada."` | "La revisión de S48-T2-A" = the review process for the current subtopic — internal QA language. Forward-looking ("exige") rather than descriptive. |
| S48-004 | H | `theory[3].callout.content` (L160, T2-B) | `"Contrato S48-T2-B: fixture S48-T2-B; evidencia local obligatoria."` | "Contrato S48-T2-B: fixture S48-T2-B; evidencia local obligatoria" — pure internal contract language; "fixture" is a QA/test-engine term the learner has not been introduced to in this section. |
| S48-005 | H | `theory[4].callout.content` (L199, T3-A) | `"Para S48-T3-A: documenta breach y recovery."` | "Para S48-T3-A: documenta" = "for T3-A: document" — imperative to the author about the current subtopic's deliverable. |
| S48-006 | H | `theory[5].callout.content` (L234, T3-B) | `"Promoción de S48-T3-B solo con evidencia reproducible."` | "Promoción de S48-T3-B" = promotion of T3-B — internal QA-gate language. |
| S48-007 | H | `theory[6].callout.content` (L262, T4-A) | `"El dueño de S48-T4-A responde por rollback y evidencia."` | "El dueño de S48-T4-A" = the owner of T4-A — internal team-ownership language. "responde por rollback y evidencia" = accountable for rollback and evidence. |
| S48-008 | H | `theory[7].callout.content` (L294, T4-A's callout referencing T4-B — **forward reference**) | `"Cierre de S48-T4-B: residual risk y límites del lab stdlib."` | This callout sits in T4-A but references T4-B (the next subtopic) — forward reference + "Cierre de" (closing of) is sequencing language. Also "residual risk" is English dropped into Spanish. |
| S48-009 | M | `theory[7].callout.content` (L322, T4-B) | `"Cierre de S48-T4-B: si la respuesta no está soportada, el sistema se abstiene (`ABSTAIN_WITH_REASON`); si faltan métricas o presupuesto, deriva a `TUNE_RETRIEVAL_OR_BUDGET`."` | Prefix "Cierre de S48-T4-B:" is sequencing language; the body itself is learner-appropriate. |
| S48-010 | M | `iDo.intro` (L328) | `"Te muestro 8 demos de S48 (aplicaciones LLM y RAG con evidencia) alineadas a CP-N4-C-RAG. Cada demo calcula el mecanismo del subtema, no imprime banderas decorativas."` | "alineadas a CP-N4-C-RAG" references an internal competency code never decoded for the learner in this section. "no imprime banderas decorativas" ("doesn't print decorative flags") is author/QA register. |
| S48-011 | M | `youDo.context` (L1844) | `"…El gate se bloquea si hay fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido."` | "El gate se bloquea" — "gate" used as a Spanish noun without introduction; minor jargon leak. (Borderline; "gate" is used consistently throughout the course.) |

### Title / identity consistency (HIGH)

| ID | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| S48-012 | H | `title` (L6) vs `jobRelevance` (L15) | `title: "LLM applications y RAG con evidencia"` but `jobRelevance: "…aplicaciones LLM y RAG con evidencia entregan respuestas citadas con ACL y groundedness…"`. | Title mixes English `applications` with Spanish; body uses `aplicaciones`. Inconsistent. The English fragment reads as an un-translated placeholder. |
| S48-013 | H | Filename vs `id` vs `title` vs roadmap | Filename `s48-ai-governance.ts`; `id: "ai-governance"`; `title: "LLM applications y RAG con evidencia"`; `shortTitle: "RAG con evidencia"`; roadmap L416: "Sección 48 — Cost, Latency & Scaling Optimization". | Four different identities for the same section. The `id`/filename suggest "AI Governance" but the content is RAG-with-evidence. The roadmap suggests a third topic. A learner searching the repo or roadmap for "ai governance" or "cost latency scaling" will not find what they expect. |

### Grammar & redaction (MEDIUM)

| ID | Sev | Location | Evidence | LT rule | Fix |
|---|---|---|---|---|---|
| S48-014 | M | `theory[5].paragraphs[1]` (L209) | `"Para la consulta «SLA p95», el vector prefiere `d2` pero el lexical marca fuerte `d1#sla`."` | COMMA_PERO | Add comma: `…`d2`, pero el lexical…` |
| S48-015 | M | `weDo.steps[19].why` (L481, S48-T3-B-DEMO) | `"Cada claim material debe estar citada y permitida; claim sin soporte → abstención, no contexto inflado."` | AGREEMENT_POSTPONED_ADJ (approx.) | `claim` is masculine in Spanish tech register (`el claim`) → `citado y permitido`. |
| S48-016 | M | `weDo.steps[23].why` (L507, S48-T4-A-DEMO) | `"Schema exacto, evidence en allowlist e injection del corpus ignorada como instrucción."` | AGREEMENT_POSTPONED_ADJ | `injection` is an English borrowing; if read as Spanish `inyección` (fem.) `ignorada` works, but mixed-language agreement is fragile. Prefer `inyección` or rewrite as `…la inyección del corpus, ignorada como instrucción.` |
| S48-017 | M | `theory[3].paragraphs[1]` (L209) | `"…el vector prefiere `d2` pero el lexical marca fuerte `d1#sla`."` | CONCORDANCIA_ADJECTIVOS_NEUTROS | `lexical` used as a noun — `el lexical` is ad-hoc. Prefer `la búsqueda lexical` or `el score lexical`. |
| S48-018 | M | `theory[0].paragraphs[1]` (L31) and `theory[0].paragraphs[3]` (L33) | `"…no llama APIs de LLM reales…"` / `"…sin APIs LLM reales…"` | SIGLAS (×2) | RAE: acronyms don't take plural `s`. Use `API` (or `las API`). |
| S48-019 | M | `cache` (7 occurrences across theory + weDo) | `theory[3].paragraphs[1]`, `theory[3].paragraphs[2]`, `weDo.steps[8].hint`, `weDo.steps[9].hint`, `weDo.steps[9].hints[1]`, `weDo.steps[10].hints[1]`, `weDo.steps[11].hints[1]`, `weDo.steps[11].instruction` | DIACRITICS_VERB_N_ADJ (×3) + SUBJUNTIVO_PASADO (×3) | RAE: `caché` (with accent) as a noun. Section is 100% `cache` / 0% `caché` — pick one and apply consistently; RAE-preferred is `caché`. |
| S48-020 | M | `jobRelevance[1]` (L18), `weDo.steps[18].feedback` (L1038), `weDo.steps[20].instruction` (L1238) | `"Comparar baseline vs candidato…"`, `"…explica la vía allow (PASS) vs deny…"`, `"Fusión híbrida vs puro vector…"` | PUNTO_EN_ABREVIATURAS (×3) | Spanish abbreviation of *versus* is `vs.` (with period). |
| S48-021 | M | `resources.docs[1].note` (resources block) | `"Embeddings y métricas de similaridad"` | ES_SIMPLE_REPLACE_SIMPLE_SIMILARIDAD | `similaridad` → `similitud`. The section uses `similitud` everywhere else (e.g. `theory[0].paragraphs[0]`, `theory[1].heading`); this resource note is the lone `similaridad`. |
| S48-022 | M | `tagline` (L8) | `"asistente sobre docs autorizados, citas verificables y abstención cuando retrieval no sostiene la respuesta"` | UPPERCASE_SENTENCE_START | Starts lowercase `asistente`. Tagline is a sentence clause; should start with capital `Asistente`. Also `docs` → `documentos` (informal). No terminal punctuation. |
| S48-023 | L | `weDo.steps[8].why` (L431) | `"ops ve solo chunks activos con intersección; guest obtiene lista vacía; deleted no aparece aunque el rol coincida."` | (none) | Starts lowercase `ops` — acceptable since `ops` is a role identifier, but stylistically inconsistent with other `why` strings that start with a capital verb. |
| S48-024 | L | `theory[3].paragraphs[1]` (L209) | `"Para la consulta «SLA p95», el vector prefiere `d2` pero el lexical marca fuerte `d1#sla`."` | (none) | Repeated issue from S48-014; also `lexical` per S48-017. |
| S48-025 | L | `weDo.steps[6].hint` and all `edgeCases[]` | `"fixture adverso: top erróneo, métrica inválida o versión de embedding vacía"` (×8 variants) | (none) | Lowercase start `fixture adverso` — these are list items, stylistically OK, but LanguageTool flagged UPPERCASE_SENTENCE_START when concatenated. No action needed if rendered as a list. |

### Templated / repetitive feedback (MEDIUM — pedagogy)

| ID | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| S48-026 | M | `weDo.steps[*].feedback` (24 strings, L549…L1795) | All 24 follow the skeleton `S48-Tx-x-Ex: explica qué campo cambió la decisión, por qué el adverso activa {CODE1} y por qué faltar {FIELD} exige {CODE2}.` 18 of 24 are **byte-for-byte identical within their subtopic triple** (e.g. L593 = L659; L763 = L819; L876 = L925 = L981; L1086 = L1142; L1246 = L1314; L1417 = L1473; L1579 = L1635; L1739 = L1795). | Feedback is supposed to be specific coaching, not a template. A learner who completes E1, E2, E3 of the same subtopic gets the same feedback string three times. This signals the feedback was generated by template rather than written per-exercise. Anaphoric monotony is extreme. |
| S48-027 | M | `weDo.steps[*].instruction` (24 strings) | All 24 follow the skeleton `S48-Tx-x-Ex · {Topic}: válido (…), adverso (…) y sin {FIELD}. Entrada: …. Salidas: {CODE1}, {CODE2}, {CODE3}. El starter {DEFECT}; …` | Same template-driven structure. The instructions ARE more varied than the feedback (different fields/codes per exercise), but the surface form is highly repetitive. Acceptable for a lab series but borders on mechanical. |

### Cognitive load & progressive disclosure (MEDIUM)

| ID | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| S48-028 | M | All 8 theory callouts | Callout title is always `Contrato local` but content references **other subtopics** (S48-001…S48-009). E.g. T4-A's callout (L294) says "Cierre de S48-T4-B" — a subtopic the learner has not reached. | Forward references break progressive disclosure: the learner is shown `S48-T2-B` while reading T1-B, `S48-T3-A` while reading T2-B, `S48-T4-A` while reading T3-B, etc. Combined with the author-register language, the callouts function as a hidden table of contents + QA checklist rather than as learner tips. |
| S48-029 | M | `theory[0].paragraphs[0]` (L30) | `"**Diccionario de la sección** (léelo antes de T1). **Embedding:** … **Similitud:** … **Chunking:** … **ACL:** … **Retrieval híbrido:** … **Grounding:** … **Abstención:** … **Prompt injection en docs:** … **Holdout eval:** …"` | One 187-word paragraph with 9 bolded dictionary entries. FH ≈ 50 (borderline difficult). Pedagogically useful as a glossary but presents as a wall of text. Would breathe better as a `<dl>` / bulleted glossary. |
| S48-030 | L | `theory[0].paragraphs[2]` (L32) | `"Hilo conductor: un socio pregunta por el SLA y el reglamento interno. Producto incremental: respuesta estructurada con `evidence_ids`. Entrada: query, corpus con ACL, holdout de recall y política de citas. Salida: top-k permitido, claims ⊆ cited, injection ignorada. Error de promoción: recall bajo baseline, chunk borrado aún visible, o claim sin soporte. En S49 los agentes consumirán este asistente como tool acotado."` | 4-sentence paragraph mixing the narrative ("un socio pregunta…") with spec language ("Entrada: … Salida: … Error de promoción: …"). The "Entrada/Salida/Error de promoción" pattern is repeated in every theory subtopic's middle paragraph (the "Contrato local" paragraph) — 8× repetition of the same scaffolding. Stylistically mechanical. |

### Exercise & exam quality (LOW — generally strong)

| ID | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| S48-031 | L | `weDo.steps[*]` (24 exercises) | Each exercise has `starterCode` with an intentional `DEFECT` comment and `solutionCode` with the fix + `assert` + expected `output`. Adversarial fixtures (`invalid`, `incomplete`) are well-designed. | **Strength.** The E1 (guided) → E2 (independent, 3-route decision table) → E3 (transfer, fail-closed pipeline) progression per subtopic is excellent. One of the best-designed exercise suites in the course. |
| S48-032 | L | `selfCheck.questions[3].options[0,1]` (L~?) | `options: ["como data hostil del corpus: no se ejecuta como instrucción", "como instrucción de sistema con prioridad máxima", …]` | Two options both contain "como instrucción" — slightly repetitive distractor design. When concatenated by LT, triggers a false PHRASE_REPETITION flag. Not a real defect. |
| S48-033 | L | `selfCheck.questions[*]` (7 MCQs) | All 7 questions are well-formed, have 4 options, a `correctIndex`, and a substantive `explanation`. | **Strength.** Self-check is solid; explanations decode the contract codes (e.g. "CP-N4-C-RAG es el criterio de evidencia de esta sección…"). |

### Consistency with previous sections (LOW)

| ID | Sev | Location | Evidence | Impact |
|---|---|---|---|---|
| S48-034 | L | `theory[0].paragraphs[1]` (L31) | `"Esta sección construye un **asistente RAG con evidencia** sobre el serving de S47:…"` | "serving de S47" — assumes the learner remembers S47 was about serving. S47 (`s47-opensource.ts`) is actually "Open Source". The "serving" reference may be a leftover from when S47 was a different topic. Minor continuity slip. |
| S48-035 | L | `theory[0].paragraphs[2]` (L32) | `"En S49 los agentes consumirán este asistente como tool acotado."` | S49 (`s49-data-contracts.ts`) is "Data Contracts", not agents. Forward reference may be stale. |

---

## 4. Meta-Leak Report (exact leaked text + location)

All 8 theory callouts (`theory[0…7].callout.content`) contain author-
orientation / internal-QA language. The callout `title` is uniformly
`"Contrato local"` but the `content` reads as Scrum/kanban task notes.

| # | Theory subtopic | Line | Exact leaked text |
|---|---|---|---|
| 1 | T1-A | L58 | `Nota de orientación: S48-T1-A: caso sintético con asserts; sin evidencia no promociones.` |
| 2 | T1-B | L88 | `Antes de promover S48-T1-B, verifica contrato y riesgo residual.` |
| 3 | T2-A | L118 | `La revisión de S48-T2-A exige fail-closed y salida esperada.` |
| 4 | T2-B | L160 | `Contrato S48-T2-B: fixture S48-T2-B; evidencia local obligatoria.` |
| 5 | T3-A | L199 | `Para S48-T3-A: documenta breach y recovery.` |
| 6 | T3-B | L234 | `Promoción de S48-T3-B solo con evidencia reproducible.` |
| 7 | T4-A | L262 | `El dueño de S48-T4-A responde por rollback y evidencia.` |
| 8 | T4-A (callout) | L294 | `Cierre de S48-T4-B: residual risk y límites del lab stdlib.` (forward-ref to T4-B) |
| 9 | T4-B | L323 | `Cierre de S48-T4-B: si la respuesta no está soportada, el sistema se abstiene (`ABSTAIN_WITH_REASON`); si faltan métricas o presupuesto, deriva a `TUNE_RETRIEVAL_OR_BUDGET`.` (prefix is sequencing language; body is OK) |

**Leak signals present:**
- `Nota de orientación` (orientation note) — author register
- `Antes de promover` (before promoting [through the QA gate]) — author/QA register
- `verifica` / `documenta` / `no promociones` — imperatives to the author
- `La revisión de S48-Tx-x exige` — internal review-process language
- `fixture S48-Tx-x` — test-engine jargon not introduced to the learner
- `evidencia local obligatoria` — internal deliverable checklist
- `El dueño de S48-Tx-x responde por` — team-ownership language
- `Cierre de S48-Tx-x` — sequencing language (closing of subtopic X)
- `residual risk` — untranslated English dropped into Spanish
- Forward references to subtopics the learner has not yet reached (T4-A's callout references T4-B; T1-B's callout references T2-A's review; etc.)

**No literal `TODO` / `FIXME` / `XXX` / `moved from section` markers were
found.** The leak is *register* leak (author/Scrum register in
learner-facing callouts), not marker leak.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos, L327–L532):** Strong. Each demo maps 1:1 to a theory
subtopic (T1-A→DEMO, T1-B→DEMO, …, T4-B→DEMO). Each demo has a
`description`, runnable `code`, expected `output`, and a `why` that
explains the pedagogical point. The `why` strings are concise (1–2
sentences, 12–25 words) and focus on the mechanism. **Minor issue:**
`iDo.intro` references the internal competency code `CP-N4-C-RAG`
without decoding it for the learner (S48-010).

**We Do (24 exercises, L534–L1815):** Excellent mechanical design. Each
subtopic has E1 (guided, implement the function) → E2 (independent,
3-route decision table) → E3 (transfer, fail-closed pipeline). Each
exercise has `instruction`, `hint`, `hints[]` (2 progressive hints),
`edgeCases[]` (3 cases), `tests`, `feedback`, `starterCode` (with
intentional `DEFECT`), and `solutionCode` (with fix + assert + expected
output). The adversarial fixtures are well-constructed and the fail-
closed routing (CONTINUE / breach-CODE / REVIEW-CODE) is pedagogically
sound — it teaches the learner to distinguish *breach* from
*uncertainty*, which is the section's central lesson.

**Defect: feedback is templated (S48-026).** 18 of 24 feedback strings
are byte-for-byte identical within their subtopic triple. This is the
single biggest pedagogical weakness in the We Do tab: feedback is
supposed to be specific coaching, but the learner gets the same string
three times in a row.

**You Do (L1817–L1916):** Strong. `context` sets the scenario
(cooperativa in Puno, synthetic corpus with ACL). `objectives` (4) and
`requirements` (8) are clear and use parallel imperatives
("Convertir…", "Demostrar…", "Probar…", "Entregar…" /
"Usa…", "Incluye…", "Automatiza…", "Registra…"). `starterCode`
provides a real skeleton (`retrieve()`, `answer()` with
`NotImplementedError`, `REQUIRED` checklist, `readiness()` function).
`portfolioNote` is appropriately learner-facing. `rubric` (6 criteria
summing to 100%) is well-weighted.

### 5.2 Connective tissue & narrative flow

**Strong:** the "Hilo conductor" (L32) — a socio asks about the SLA and
the reglamento interno — runs through all 8 subtopics. Each theory
subtopic's third paragraph returns to the cooperativa scenario (e.g.
"En `CASO-PUN-048`, un socio pregunta por el SLA de atención…",
"Antes de reindexar el reglamento de la cooperativa en Puno con
`e5-v2`…"). This is excellent narrative anchoring.

**Weak:** the 8 callouts break the narrative by injecting author/QA
register (S48-001…S48-009). The "Contrato local" paragraphs (middle
paragraph of each theory subtopic) are highly templated: "Contrato
local Tx-x. Entrada: … Salida: … Breach → `CODE`; missing de campo →
`CODE`." This 8× repetition of the same scaffolding is mechanical and
could be condensed into a reusable contract template box.

### 5.3 Cognitive load & progressive disclosure

**Sentence-level load is well-managed:** WPS avg 13.95, only 3 sentences
>32 words (max 37), no run-ons. Fernández-Huerta avg 72.0 (normal for
technical Spanish).

**Callout-level load is poorly managed:** forward references to
unreached subtopics (S48-028) and author-register language (S48-001…
S48-009) force the learner to mentally track internal subtopic codes
(S48-T1-A, S48-T2-B, etc.) that have not yet been introduced as
navigational concepts.

**Dictionary paragraph (S48-029):** the opening "Diccionario de la
sección" (L30) is a 187-word single paragraph with 9 bolded entries.
Pedagogically useful as a glossary but presents as a wall of text.
Splitting into a bulleted `<dl>` would reduce vertical cognitive load.

### 5.4 Redaction quality

**Peruvian Spanish:** the section is consistently written in Peninsular-
neutral Spanish with Peruvian contextual anchoring ("cooperativa
ficticia en Puno", "30 PEN"). No Peninsular-only vosotros forms; no
regionalisms that would confuse a Peruvian learner. Appropriate for the
declared `lang="es-PE"` of the site.

**English loanwords:** the section uses many English tech terms
(`embedding`, `chunking`, `retrieval`, `holdout`, `baseline`, `lexical`,
`vector`, `grounding`, `claim`, `evidence`, `gate`, `fixture`, `serving`,
`tool`). Most are unavoidable in ML engineering Spanish and are
contextually glossed. A few are inconsistent: `applications` (title)
vs `aplicaciones` (body) — S48-012; `similaridad` (resources) vs
`similitud` (everywhere else) — S48-021; `cache` (7×) vs never `caché`
— S48-019.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite (Theory, I Do, We Do, You Do, Self Check)

Below, for each prose-bearing tab, the **worst** paragraphs/sentences
are shown **before → after** with the specific fix. Only items with a
real redaction defect are rewritten; well-formed prose is left alone.

### 6.1 Theory tab

#### Theory T1-A — callout content (L58) — S48-001
**Before:**
> Nota de orientación: S48-T1-A: caso sintético con asserts; sin evidencia no promociones.
**After:**
> Esta sección usa un caso sintético (`CASO-PUN-048`) con asserts automáticos: si un reclamo no está soportado por un fragmento permitido, el sistema no responde.
*Rationale:* removes author-register "Nota de orientación" and "no
promociones"; reframes as a learner-facing description of the fail-closed
behavior.

#### Theory T1-A — paragraph 1 (L65) — OK (no rewrite needed)
> Los embeddings proyectan texto a un espacio vectorial; la **similitud solo ordena candidatos** — no prueba verdad ni autoriza un claim. Versión del modelo, normalización y métrica (cosine, dot) son parte del contrato del índice: cambiar cualquiera sin re-eval rompe el holdout.
*FH ≈ 64, WPS ≈ 28. Well-formed, dense but appropriate for Master level.*

#### Theory T1-B — callout content (L88) — S48-002
**Before:**
> Antes de promover S48-T1-B, verifica contrato y riesgo residual.
**After:**
> Cambiar de modelo de embedding no es cosmético: exige baseline de recall, presupuesto de reindexación y slices de error antes de aprobar la nueva versión.
*Rationale:* removes author-register "Antes de promover" and "verifica";
converts to a learner-facing statement of the gate's rationale.

#### Theory T1-B — paragraph 1 (L96) — OK
> Cambiar el modelo de embedding no es un deploy cosmético: exige **baseline de recall en holdout**, presupuesto de reindexación y slices de error. Recall@K del retrieval y calidad de la respuesta se miden por separado; un candidato más caro que no supera al baseline se descarta.

#### Theory T2-A — callout content (L118) — S48-003
**Before:**
> La revisión de S48-T2-A exige fail-closed y salida esperada.
**After:**
> El chunking debe ser fail-closed: si dos secciones colapsan al mismo hash o falta metadata, se re-chunkea antes de indexar.
*Rationale:* removes "La revisión de S48-T2-A exige" (internal QA
language); converts to a learner-facing statement of the fail-closed
behavior.

#### Theory T2-B — callout content (L160) — S48-004
**Before:**
> Contrato S48-T2-B: fixture S48-T2-B; evidencia local obligatoria.
**After:**
> La ACL se aplica antes del ranking: un fragmento denegado o borrado (tombstone) nunca entra a los candidatos, sin importar su score vectorial.
*Rationale:* removes "Contrato S48-T2-B: fixture…; evidencia local
obligatoria" (internal contract language); converts to a learner-facing
statement of the ACL-before-rank invariant.

#### Theory T3-A — callout content (L199) — S48-005
**Before:**
> Para S48-T3-A: documenta breach y recovery.
**After:**
> La fusión híbrida combina scores lexical y vectorial con pesos calibrados, pero solo se declara mejora tras medir Recall@k contra un gold set.
*Rationale:* removes "Para S48-T3-A: documenta" (imperative to author);
converts to a learner-facing statement of the hybrid-rank + eval
discipline.

#### Theory T3-A — paragraph 3 (L209) — S48-014 + S48-017 + S48-024
**Before:**
> Para la consulta «SLA p95», el vector prefiere `d2` pero el lexical marca fuerte `d1#sla`. Con pesos 0.6/0.4 el híbrido devuelve `d1`. Sobre el gold set de 5 queries del holdout, mides Recall@3 antes de declarar mejora.
**After:**
> Para la consulta «SLA p95», el vector prefiere `d2`, pero la búsqueda lexical marca fuerte `d1#sla`. Con pesos 0.6/0.4 el híbrido devuelve `d1`. Sobre el gold set de 5 queries del holdout, mides Recall@3 antes de declarar mejora.
*Rationale:* comma before `pero` (COMMA_PERO); `el lexical` → `la
búsqueda lexical` (CONCORDANCIA).

#### Theory T3-B — callout content (L234) — S48-006
**Before:**
> Promoción de S48-T3-B solo con evidencia reproducible.
**After:**
> El contexto del generador incluye solo fragmentos mínimos y citas resolubles: un reclamo sin evidencia permitida se abstiene en lugar de emitirse.
*Rationale:* removes "Promoción de S48-T3-B" (QA-gate language);
converts to learner-facing statement of the context contract.

#### Theory T4-A — callout content (L262) — S48-007
**Before:**
> El dueño de S48-T4-A responde por rollback y evidencia.
**After:**
> La salida estructurada se valida contra un schema (`answer`, `evidence_ids`): si una evidencia no está en la allowlist o la inyección del corpus no se ignora, el gate rechaza.
*Rationale:* removes "El dueño de S48-T4-A responde por" (team-ownership
language); converts to learner-facing statement of the grounding contract.

#### Theory T4-A — callout content (L294) — S48-008 (forward reference)
**Before:**
> Cierre de S48-T4-B: residual risk y límites del lab stdlib.
**After:**
> El texto recuperado —incluso si dice «ignora tus reglas»— es data hostil, no instrucción del sistema: el flag `injected_instruction_ignored` debe ser True.
*Rationale:* removes forward reference "Cierre de S48-T4-B" and English
"residual risk"; converts to a learner-facing statement of the
prompt-injection-as-data invariant (which is what T4-A actually teaches).

#### Theory T4-B — callout content (L323) — S48-009
**Before:**
> Cierre de S48-T4-B: si la respuesta no está soportada, el sistema se abstiene (`ABSTAIN_WITH_REASON`); si faltan métricas o presupuesto, deriva a `TUNE_RETRIEVAL_OR_BUDGET`.
**After:**
> Si la respuesta no está soportada, el sistema se abstiene (`ABSTAIN_WITH_REASON`); si faltan métricas o presupuesto, deriva a `TUNE_RETRIEVAL_OR_BUDGET`.
*Rationale:* drop the prefix "Cierre de S48-T4-B:" (sequencing language);
the body is already learner-facing.

#### Theory T4-B — paragraph 3 (L304) — OK
> En `CASO-PUN-048-4B`, support 0.8 con recall y faithfulness en umbral responde; support 0.2 se abstiene y registra ~1200 tokens del intento. No es veredicto de conducta: solo groundedness sobre docs autorizados.

#### Theory intro — "Diccionario de la sección" (L30) — S48-029
**Before:** (single 187-word paragraph with 9 bolded entries — see S48-029)
**After:** (reformat as a bulleted glossary; same content)
> **Diccionario de la sección** (léelo antes de T1):
> - **Embedding:** vector con versión de modelo (p. ej. `emb-v2`).
> - **Similitud:** solo ordena (dot de query·d1 = 0.8 > d2 = 0.1 → top d1; no prueba el claim).
> - **Chunking:** unidades semánticas (`d1#sla`, no rebanadas de N letras).
> - **ACL:** filtro **antes** del ranking (rol `guest` → lista vacía).
> - **Retrieval híbrido:** lexical + vector; mide Recall@k en holdout.
> - **Grounding:** cada claim apunta a un `evidence_id` permitido.
> - **Abstención:** support bajo → no responder.
> - **Prompt injection en docs:** data hostil, no instrucción.
> - **Holdout eval:** recall de retrieval y faithfulness de respuesta se miden por separado.
*Rationale:* vertical spacing reduces cognitive load; same content.

### 6.2 I Do tab

#### `iDo.intro` (L328) — S48-010
**Before:**
> Te muestro 8 demos de S48 (aplicaciones LLM y RAG con evidencia) alineadas a CP-N4-C-RAG. Cada demo calcula el mecanismo del subtema, no imprime banderas decorativas.
**After:**
> Te muestro 8 demos de S48 (aplicaciones LLM y RAG con evidencia). Cada demo calcula el mecanismo real del subtema —ranking, ACL, híbrido, citas, grounding, abstención— en lugar de imprimir solo etiquetas de estado.
*Rationale:* drop the internal competency code `CP-N4-C-RAG` (it is
decoded later in the Self Check); replace "no imprime banderas
decorativas" (QA register) with a concrete learner-facing description.

#### `iDo.steps[3].why` (L431) — S48-023 — minor
**Before:**
> ops ve solo chunks activos con intersección; guest obtiene lista vacía; deleted no aparece aunque el rol coincida.
**After:**
> El rol `ops` ve solo chunks activos con intersección; `guest` obtiene lista vacía; los chunks `deleted` no aparecen aunque el rol coincida.
*Rationale:* backtick-wrap the role identifiers so the lowercase start
reads as code, not as a sentence-start slip.

### 6.3 We Do tab

#### `weDo.intro` (L535) — OK
> S48 · Laboratorio del asistente RAG de `CASO-PUN-048` (cooperativa sintética en Puno): 24 retos. E1 implementa una función de dominio (rank_top, promote_ok, chunk dedup, ACL, hybrid_top, citas, grounding, abstención). E2 evalúa tres rutas (válido / adverso / missing) reutilizando esa lógica. E3 separa CONTINUE, breach y review sin convertir incertidumbre en éxito.
*WPS ≈ 28 across 4 sentences; FH ≈ 60. Dense but well-structured.*

#### `weDo.steps[19].why` (L481) — S48-015
**Before:**
> Cada claim material debe estar citada y permitida; claim sin soporte → abstención, no contexto inflado.
**After:**
> Cada claim material debe estar citado y permitido; un claim sin soporte → abstención, no contexto inflado.
*Rationale:* `claim` is masculine in Spanish tech register (`el claim`),
so `citado y permitido`. Second `claim` gets article `un` for flow.

#### `weDo.steps[23].why` (L507) — S48-016
**Before:**
> Schema exacto, evidence en allowlist e injection del corpus ignorada como instrucción.
**After:**
> Schema exacto, evidence en allowlist e inyección del corpus ignorada como instrucción.
*Rationale:* hispanicize `injection` → `inyección` (fem.) so `ignorada`
agrees cleanly. (Alternative: keep English and rewrite as "…e injection
del corpus, ignorada como instrucción" with a comma, but the hispanicized
form is cleaner.)

#### `weDo.steps[*].feedback` (24 strings) — S48-026
**Before (template, 18 of 24 identical within triple):**
> S48-Tx-x-Ex: explica qué campo cambió la decisión, por qué el adverso activa {CODE1} y por qué faltar {FIELD} exige {CODE2}.
**After (per-exercise specific coaching — example for S48-T1-A-E1):**
> Para S48-T1-A-E1: explica cómo calculaste el `top` con `max(…, key=lambda …)` sobre el producto punto, por qué la versión `emb-v2` es parte del contrato (cambiarla sin re-eval rompe el holdout) y por qué un `version=""` o un `metric="unknown"` activan `REJECT_EMBEDDING_RANK` en lugar de `PASS`.
*Rationale:* each feedback should name the specific code construct the
learner wrote, the specific field that flips the decision, and the
specific contract being enforced — not a template.

### 6.4 You Do tab

#### `youDo.context` (L1844) — OK (minor parallelism)
> Asistente RAG autorizado y evaluado sobre documentación sintética de una cooperativa ficticia en Puno. Entrada: documentos versionados con ACL, provenance, metadata y query del socio. Salida: respuesta estructurada con citas verificables o abstención explícita. El gate se bloquea si hay fragmento sin permiso, evidencia insuficiente, versión borrada o costo excedido.
*Minor:* the last sentence mixes "fragmento sin permiso" (noun + prep
phrase) with "evidencia insuficiente, versión borrada, costo excedido"
(noun + adjective). Parallel form: "fragmento denegado, evidencia
insuficiente, versión borrada o costo excedido".

#### `youDo.objectives` (L1846–L1849) — OK
Parallel infinitives ("Convertir…", "Demostrar…", "Probar…",
"Entregar…"). No periods (acceptable for bullet objectives).

#### `youDo.requirements` (L1852–L1859) — OK
Parallel imperatives ("Usa…", "Incluye…", "Automatiza…", "Registra…").

#### `youDo.portfolioNote` (L1899) — OK
> Evidencia de CP-N4-C-RAG · RAG con evidencia y abstención: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto, no cambiando asserts.
*Note:* "riesgo residual" is acceptable here (learner-facing summary of
a deliverable). The internal code `CP-N4-C-RAG` is decoded by the
Self Check.

### 6.5 Self Check tab

#### `selfCheck.questions[*]` (7 MCQs) — OK
All 7 questions are well-formed, have 4 options, a `correctIndex`, and a
substantive `explanation`. The explanations decode the contract codes
(e.g. Q3 explanation: "CP-N4-C-RAG es el criterio de evidencia de esta
sección: retrieval y respuesta superan umbrales separados; toda
afirmación material apunta a un fragmento permitido. Es distinto del
criterio de agentes (S49)."). This is the right place to surface the
internal codes.

#### `selfCheck.questions[3].options` (S48-032) — minor
Two options contain "como instrucción"; consider varying one to "como
orden del sistema" to reduce distractor repetition.

---

## 7. Proposed GitHub-style Diffs

Diffs are against
`src/lib/course/sections/s48-ai-governance.ts`. Line numbers refer to
the current file. **Do not apply automatically — audit-only per
instructions.**

### Diff 1 — Fix title English/Spanish inconsistency (S48-012, S48-013)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -3,8 +3,8 @@ import type { CourseSection } from '../../types'
 export const section48: CourseSection = {
   id: "ai-governance",
   index: 48,
-  title: "LLM applications y RAG con evidencia",
+  title: "Aplicaciones LLM y RAG con evidencia",
   shortTitle: "RAG con evidencia",
   tagline: "asistente sobre docs autorizados, citas verificables y abstención cuando retrieval no sostiene la respuesta",
   estimatedHours: 20,
   level: "Master",
```

### Diff 2 — Fix tagline capitalization (S48-022)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -5,7 +5,7 @@ export const section48: CourseSection = {
   index: 48,
   title: "Aplicaciones LLM y RAG con evidencia",
   shortTitle: "RAG con evidencia",
-  tagline: "asistente sobre docs autorizados, citas verificables y abstención cuando retrieval no sostiene la respuesta",
+  tagline: "Asistente sobre documentos autorizados, citas verificables y abstención cuando el retrieval no sostiene la respuesta.",
   estimatedHours: 20,
```

### Diff 3 — Rewrite all 8 theory callout contents (S48-001 … S48-009)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -55,7 +55,7 @@ export const section48: CourseSection = {
       callout: {
         type: "info",
         title: "Gate de promoción",
-        content: "Nota de orientación: S48-T1-A: caso sintético con asserts; sin evidencia no promociones.",
+        content: "Esta sección usa un caso sintético (`CASO-PUN-048`) con asserts automáticos: si un reclamo no está soportado por un fragmento permitido, el sistema no responde.",
       },
     },
     {
@@ -86,7 +86,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Antes de promover S48-T1-B, verifica contrato y riesgo residual.",
+        content:
+          "Cambiar de modelo de embedding no es cosmético: exige baseline de recall, presupuesto de reindexación y slices de error antes de aprobar la nueva versión.",
       },
     },
     {
@@ -115,7 +115,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "La revisión de S48-T2-A exige fail-closed y salida esperada.",
+        content:
+          "El chunking debe ser fail-closed: si dos secciones colapsan al mismo hash o falta metadata, se re-chunkea antes de indexar.",
       },
     },
     {
@@ -157,7 +157,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Contrato S48-T2-B: fixture S48-T2-B; evidencia local obligatoria.",
+        content:
+          "La ACL se aplica antes del ranking: un fragmento denegado o borrado (tombstone) nunca entra a los candidatos, sin importar su score vectorial.",
       },
     },
     {
@@ -196,7 +196,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Para S48-T3-A: documenta breach y recovery.",
+        content:
+          "La fusión híbrida combina scores lexical y vectorial con pesos calibrados, pero solo se declara mejora tras medir Recall@k contra un gold set.",
       },
     },
     {
@@ -231,7 +231,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Promoción de S48-T3-B solo con evidencia reproducible.",
+        content:
+          "El contexto del generador incluye solo fragmentos mínimos y citas resolubles: un reclamo sin evidencia permitida se abstiene en lugar de emitirse.",
       },
     },
     {
@@ -259,7 +259,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "El dueño de S48-T4-A responde por rollback y evidencia.",
+        content:
+          "La salida estructurada se valida contra un schema (`answer`, `evidence_ids`): si una evidencia no está en la allowlist o la inyección del corpus no se ignora, el gate rechaza.",
       },
     },
     {
@@ -291,7 +291,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Cierre de S48-T4-B: residual risk y límites del lab stdlib.",
+        content:
+          "El texto recuperado —incluso si dice «ignora tus reglas»— es data hostil, no instrucción del sistema: el flag `injected_instruction_ignored` debe ser True.",
       },
     },
     {
@@ -319,7 +319,7 @@ export const section48: CourseSection = {
       callout: {
         type: "tip",
         title: "Contrato local",
-        content:
-          "Cierre de S48-T4-B: si la respuesta no está soportada, el sistema se abstiene (`ABSTAIN_WITH_REASON`); si faltan métricas o presupuesto, deriva a `TUNE_RETRIEVAL_OR_BUDGET`.",
+        content:
+          "Si la respuesta no está soportada, el sistema se abstiene (`ABSTAIN_WITH_REASON`); si faltan métricas o presupuesto, deriva a `TUNE_RETRIEVAL_OR_BUDGET`.",
       },
     },
```

### Diff 4 — Fix `pero` comma + `el lexical` concordance (S48-014, S48-017, S48-024)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -206,7 +206,7 @@ export const section48: CourseSection = {
       paragraphs: [
-        "Lexical (términos exactos, p. ej. «SLA p95») y vector (semántica) se combinan con pesos calibrados; el rerank opera solo sobre candidatos **ya filtrados por ACL**. Fusionar scores no es lo mismo que medir recall: la fórmula debe evaluarse contra un gold set.",
+        "Lexical (términos exactos, p. ej. «SLA p95») y vector (semántica) se combinan con pesos calibrados; el rerank opera solo sobre candidatos **ya filtrados por ACL**. Fusionar scores no es lo mismo que medir recall: la fórmula debe evaluarse contra un gold set.",
@@ -209,7 +209,7 @@ export const section48: CourseSection = {
-        "Para la consulta «SLA p95», el vector prefiere `d2` pero el lexical marca fuerte `d1#sla`. Con pesos 0.6/0.4 el híbrido devuelve `d1`. Sobre el gold set de 5 queries del holdout, mides Recall@3 antes de declarar mejora.",
+        "Para la consulta «SLA p95», el vector prefiere `d2`, pero la búsqueda lexical marca fuerte `d1#sla`. Con pesos 0.6/0.4 el híbrido devuelve `d1`. Sobre el gold set de 5 queries del holdout, mides Recall@3 antes de declarar mejora.",
       ],
```

### Diff 5 — Fix `APIs` → `API` (S48-018)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -28,7 +28,7 @@ export const section48: CourseSection = {
-        "Esta sección construye un **asistente RAG con evidencia** sobre el serving de S47: indexas docs autorizados, recuperas con ACL, citas y groundedness. Las demos usan **stdlib** (scores, sets) como vector store conceptual. El caso `CASO-PUN-048` (cooperativa ficticia en Puno) no llama APIs de LLM reales ni indexa PII.",
+        "Esta sección construye un **asistente RAG con evidencia** sobre el serving de S47: indexas docs autorizados, recuperas con ACL, citas y groundedness. Las demos usan **stdlib** (scores, sets) como vector store conceptual. El caso `CASO-PUN-048` (cooperativa ficticia en Puno) no llama API de LLM reales ni indexa PII.",
@@ -30,7 +30,7 @@ export const section48: CourseSection = {
-        "Orden: T1 retrieval y holdout → T2 chunking y ACL → T3 ranking híbrido y citas → T4 grounding, costo y abstención. Cada subtema deja un artefacto comprobable (ranking versionado, chunks deduplicados, top-k permitido, respuesta con evidence_ids o abstención). Stack didáctico: **stdlib** (scores, sets) sin APIs LLM reales ni PII.",
+        "Orden: T1 retrieval y holdout → T2 chunking y ACL → T3 ranking híbrido y citas → T4 grounding, costo y abstención. Cada subtema deja un artefacto comprobable (ranking versionado, chunks deduplicados, top-k permitido, respuesta con evidence_ids o abstención). Stack didáctico: **stdlib** (scores, sets) sin API de LLM reales ni PII.",
```

### Diff 6 — Fix `cache` → `caché` (S48-019, 7 occurrences)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -168,7 +168,7 @@ export const section48: CourseSection = {
-        "La ACL se aplica **antes** de retrieval y rerank: un fragmento no permitido nunca entra al ranking. Un delete (tombstone) invalida índice y cache; el provenance enlaza cada chunk a documento y versión.",
+        "La ACL se aplica **antes** de retrieval y rerank: un fragmento no permitido nunca entra al ranking. Un delete (tombstone) invalida índice y caché; el provenance enlaza cada chunk a documento y versión.",
@@ -169,7 +169,7 @@ export const section48: CourseSection = {
-        "Contrato local T2-B (doble vía). Ruta positiva: usuario con intersección ACL, documento activo y cache coherente → el chunk es recuperable. Ruta negativa: sin intersección o `deleted=True` → cero fragmentos (`FILTER_OR_DELETE_CHUNK`). Missing de invalidación de cache → `VERIFY_ACL_PROVENANCE`.",
+        "Contrato local T2-B (doble vía). Ruta positiva: usuario con intersección ACL, documento activo y caché coherente → el chunk es recuperable. Ruta negativa: sin intersección o `deleted=True` → cero fragmentos (`FILTER_OR_DELETE_CHUNK`). Missing de invalidación de caché → `VERIFY_ACL_PROVENANCE`.",
@@ -170,7 +170,7 @@ export const section48: CourseSection = {
-        "Rol `ops` ve el SLA público; rol `guest` no ve el anexo legal. Tras borrar `d2-v1`, el tombstone impide que el cache sirva el texto viejo aunque el score vectorial aún exista.",
+        "Rol `ops` ve el SLA público; rol `guest` no ve el anexo legal. Tras borrar `d2-v1`, el tombstone impide que la caché sirva el texto viejo aunque el score vectorial aún exista.",
```
*(Also apply to `weDo` hint/hints strings referencing `cache_invalidated` — keep the field name `cache_invalidated` as-is since it's a Python dict key, but write `caché` in the surrounding prose.)*

### Diff 7 — Fix `vs` → `vs.` (S48-020, 3 occurrences)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -15,7 +15,7 @@ export const section48: CourseSection = {
-    { text: "Comparar baseline vs candidato en holdout de retrieval y rechazar regresión o reindexación sin presupuesto" },
+    { text: "Comparar baseline vs. candidato en holdout de retrieval y rechazar regresión o reindexación sin presupuesto" },
@@ -1036,7 +1036,7 @@ export const section48: CourseSection = {
-        feedback: "S48-T2-B-E1: explica la vía allow (PASS) vs deny (FILTER_OR_DELETE_CHUNK) y por qué faltar cache_invalidated exige VERIFY_ACL_PROVENANCE.",
+        feedback: "S48-T2-B-E1: explica la vía allow (PASS) vs. deny (FILTER_OR_DELETE_CHUNK) y por qué faltar cache_invalidated exige VERIFY_ACL_PROVENANCE.",
@@ -1238,7 +1238,7 @@ export const section48: CourseSection = {
-        instruction: "S48-T3-A-E2 · Fusión híbrida vs puro vector: válido (pesos 0.6/0.4 → top d1), adverso (d1 débil en ambos canales → no alcanza expected_top) y sin `expected_top`. Entrada: lexical, vector, weights, expected_top. Salidas: `PASS`, `RECALIBRATE_HYBRID_RANK`, `MISSING:expected_top`. El starter rankea solo `max(vector)` (elegiría d2); corrige con score ponderado.",
+        instruction: "S48-T3-A-E2 · Fusión híbrida vs. puro vector: válido (pesos 0.6/0.4 → top d1), adverso (d1 débil en ambos canales → no alcanza expected_top) y sin `expected_top`. Entrada: lexical, vector, weights, expected_top. Salidas: `PASS`, `RECALIBRATE_HYBRID_RANK`, `MISSING:expected_top`. El starter rankea solo `max(vector)` (elegiría d2); corrige con score ponderado.",
```

### Diff 8 — Fix `similaridad` → `similitud` in resources (S48-021)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ - resources.docs[1]
-        note: "Embeddings y métricas de similaridad",
+        note: "Embeddings y métricas de similitud",
```

### Diff 9 — Fix `claim` concordance (S48-015)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -481,7 +481,7 @@ export const section48: CourseSection = {
-        why: "Cada claim material debe estar citada y permitida; claim sin soporte → abstención, no contexto inflado.",
+        why: "Cada claim material debe estar citado y permitido; un claim sin soporte → abstención, no contexto inflado.",
```

### Diff 10 — Fix `injection` concordance (S48-016)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -507,7 +507,7 @@ export const section48: CourseSection = {
-        why: "Schema exacto, evidence en allowlist e injection del corpus ignorada como instrucción.",
+        why: "Schema exacto, evidence en allowlist e inyección del corpus ignorada como instrucción.",
```

### Diff 11 — Rewrite `iDo.intro` to drop internal code (S48-010)

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -328,7 +328,7 @@ export const section48: CourseSection = {
   iDo: {
-    intro: "Te muestro 8 demos de S48 (aplicaciones LLM y RAG con evidencia) alineadas a CP-N4-C-RAG. Cada demo calcula el mecanismo del subtema, no imprime banderas decorativas.",
+    intro: "Te muestro 8 demos de S48 (aplicaciones LLM y RAG con evidencia). Cada demo calcula el mecanismo real del subtema —ranking, ACL, híbrido, citas, grounding, abstención— en lugar de imprimir solo etiquetas de estado.",
     steps: [
```

### Diff 12 — De-template `weDo.steps[*].feedback` (S48-026)

*(Illustrative for S48-T1-A-E1; the Fixer should write a unique
feedback string for each of the 24 exercises.)*

```diff
--- a/src/lib/course/sections/s48-ai-governance.ts
+++ b/src/lib/course/sections/s48-ai-governance.ts
@@ -549,7 +549,7 @@ export const section48: CourseSection = {
-        feedback: "S48-T1-A-E1: explica cómo calculaste el top por dot product, por qué la versión emb-v2 es parte del contrato y por qué un adverso activa REJECT_EMBEDDING_RANK.",
+        feedback: "S48-T1-A-E1: explica cómo calculaste el `top` con `max(…, key=lambda …)` sobre el producto punto, por qué la versión `emb-v2` es parte del contrato (cambiarla sin re-eval rompe el holdout) y por qué un `version=\"\"` o un `metric=\"unknown\"` activan `REJECT_EMBEDDING_RANK` en lugar de `PASS`.",
```

---

## 8. Recommended Priority Order for Fixing

1. **[HIGH] S48-001 … S48-009 — Rewrite all 8 theory callout contents (Diff 3).**
   This is the single biggest quality defect: every theory callout reads
   as an internal QA note. Fixing this alone moves the section from
   "leaky" to "learner-facing". ~30 min of writing.

2. **[HIGH] S48-012, S48-013 — Fix title English/Spanish + reconcile
   filename/id/title/roadmap (Diff 1 + roadmap decision).** Decide
   once what this section is called ("RAG con evidencia" is the
   de-facto name; rename the file to `s48-rag-evidence.ts` and the
   `id` to `"rag-evidence"`, or update the roadmap). ~15 min.

3. **[MEDIUM] S48-026 — De-template the 24 We Do feedback strings
   (Diff 12).** Write a unique, specific feedback string per exercise
   that names the code construct, the flipping field, and the contract.
   ~90 min of writing (24 strings × ~3 min).

4. **[MEDIUM] S48-014, S48-017, S48-019, S48-020, S48-021, S48-015,
   S48-016, S48-018, S48-022 — Spanish micro-grammar sweep (Diffs 2, 4,
   5, 6, 7, 8, 9, 10).** Mechanical fixes; ~20 min total.

5. **[MEDIUM] S48-010 — Rewrite `iDo.intro` (Diff 11).** ~5 min.

6. **[LOW] S48-029 — Reformat the "Diccionario de la sección" paragraph
   as a bulleted glossary.** ~10 min (rendering-side; the TS string can
   stay a single string if the renderer splits on `**…**`).

7. **[LOW] S48-023, S48-025, S48-032, S48-034, S48-035 — Polish.**
   Backtick-wrap role identifiers; vary self-check distractors; verify
   S47/S49 cross-references. ~15 min.

---

## 9. Graph Memory Update Notes (for shared context files)

For the orchestrator's shared graph memory, the following edges from
S48 are worth recording:

- **S48 ↔ S47**: S48 claims to build "sobre el serving de S47"
  (`theory[0].paragraphs[1]`, L31). S47 is `s47-opensource.ts`
  ("Open Source"). The "serving" reference may be stale — verify
  whether S47 was renamed.
- **S48 ↔ S49**: S48 says "En S49 los agentes consumirán este
  asistente como tool acotado" (`theory[0].paragraphs[2]`, L32).
  S49 is `s49-data-contracts.ts` ("Data Contracts"). The "agentes"
  reference may be stale — verify whether S49 was renamed.
- **S48 ↔ roadmap**: roadmap L416 says "Sección 48 — Cost, Latency &
  Scaling Optimization". Implemented as "RAG con evidencia". Curriculum-
  wide drift; flag for the orchestrator.
- **S48 ↔ S20 (RAG section)**: S20 is `s20-rag.ts`. There may be
  content overlap between S20 (introductory RAG) and S48 (advanced RAG
  with evidence). Worth a comparative pass.
- **S48 internal subtopic graph**: T1-A (embeddings) → T1-B (eval) →
  T2-A (chunking) → T2-B (ACL) → T3-A (hybrid) → T3-B (citas) → T4-A
  (grounding) → T4-B (abstención). The callouts currently leak this
  graph to the learner via forward references (S48-008). Fixing the
  callouts (Diff 3) removes the leak.

---

## 10. Method Note (Grammar Subplan Application)

**Research basis applied** (per
`/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`):

1. **Fernández-Huerta (1959)** — `206.84 − 60·(syllables/word) −
   1.02·(words/sentence)`. Computed per record and averaged.
2. **Szigriszt-Pazos / INFLESZ** — `206.835 − 62.3·(syllables/word) −
   (words/sentence)`. Computed per record and averaged.
3. **WPS / SPW** — mean words per sentence, mean syllables per word.
4. **LanguageTool** (`language=es`) via public API
   `https://api.languagetool.org/v2/check`. Two chunks (≤20k chars
   each) with 3.5s sleep between. 623 raw matches; 580 were
   `MORFOLOGIK_RULE_ES` (spelling false positives on English tech
   terms like `embeddings`, `chunking`, `retrieval`, `holdout`,
   `baseline`); the remaining 43 were meaningful and categorized
   above.
5. **Pedagogical heuristics** — applied offline per sentence/paragraph:
   run-on (>45w), long (>32w), missing terminal, missing `¿`/`¡`,
   unbalanced delimiters, repeated word, English-dominant sentence,
   meta/AI/TODO leak, gerund pile-up (≥3), comma density, paragraph =
   one long sentence, anaphoric monotony, space-before-punct,
   double-space. False positives on the middle-dot (`·` U+00B7) used
   as a separator in section IDs were fixed by using a NUL marker
   instead of `·` for abbreviation protection in the sentence splitter.

**Pipeline artifacts (regenerable):**
- `audits/s48_extract.py` — prose extractor
- `audits/s48_prose.json` / `audits/s48_prose.txt` — 170 extracted
  prose records (3,838 words, 290 sentences)
- `audits/s48_metrics.py` — metrics + heuristics engine
- `audits/s48_records.json` — per-record metrics + findings
- `audits/s48_metrics.json` — aggregate metrics + top-10 longest
  sentences
- `audits/s48_lt.json` — raw LanguageTool response (623 matches)

**Aggregate metrics:**

| Metric | Value | Interpretation |
|---|---|---|
| Records | 170 | prose strings analyzed |
| Words | 3,838 | total learner-facing Spanish words |
| Sentences | 290 | total sentences |
| WPS avg | 13.95 | well within 15–32 technical-Spanish target |
| WPS median | 12.0 | healthy |
| WPS max | 37.0 | 3 sentences >32w; none >45w (no run-ons) |
| SPW avg | 2.01 | healthy lexical complexity |
| FH avg | 72.0 | "normal" band (70–80) — appropriate for Master level |
| FH median | 71.0 | healthy |
| FH < 50 (difficult) | 23 records | mostly dense contract paragraphs (acceptable) |
| FH ≥ 80 (easy) | 57 records | mostly short labels/hints (acceptable) |
| INFLESZ avg | 67.7 | "normal" band |
| Heuristic findings | 53 | 0 H, 50 M, 3 L (after fixing splitter bug; most M are stylistic list-item non-issues) |
| LT matches (non-spelling) | 43 | categorized into 14 rule types above |

**Known false-positive classes:**
- `MORFOLOGIK_RULE_ES` on English tech terms (embeddings, chunking,
  retrieval, holdout, baseline, lexical, vector, grounding, claim,
  evidence, gate, fixture, serving, tool, schema, allowlist, etc.) —
  filtered out.
- `UPPERCASE_SENTENCE_START` on feedback strings where the
  `S48-Tx-x-Ex:` prefix was stripped before LT chunking — the lowercase
  `explica` after a colon is acceptable Spanish; the flag is a chunking
  artifact.
- `CAPITALIZATION_AFTER_QUESTION_MARK` on self-check options
  concatenated to their question without a period — chunking artifact;
  options are list items, not continuous prose.
- `PHRASE_REPETITION` on self-check options that share the phrase
  "como instrucción" — chunking artifact; the two options are distinct
  list items.
- `SIGLAS` on `APIs` — prescriptively correct (RAE: acronyms don't take
  plural `s`), but `APIs` is widely used in tech Spanish; flagged as M,
  not H.
- `SINGLE_CHARACTER` on `k` in "devuelve hasta k ids" — `k` is a
  variable name; false positive.

---

## 11. Comparison with Best-in-Class External Materials

Benchmarks against the resources the section itself cites
(`resources.docs[].url`):

| Resource | What S48 does well | What S48 does worse |
|---|---|---|
| OpenAI Cookbook — RAG | Cites ACL-before-rank, holdout eval, abstention — more disciplined than the cookbook's introductory examples. | Cookbook shows real API calls; S48 is stdlib-only (intentional, but a learner who wants to see a real LLM call must go elsewhere). |
| OWASP LLM Prompt Injection Prevention | S48's "injection as data" framing (T4-A) matches OWASP's isolation guidance. | OWASP provides concrete defense layers (input validation, output scanning, allowlists); S48 only models the `injected_instruction_ignored` flag at the contract level. |
| LangChain RAG tutorial | S48's chunking-by-section (T2-A) is more semantically disciplined than LangChain's default `RecursiveCharacterTextSplitter`. | LangChain shows a runnable end-to-end pipeline; S48 is contract-first, code-fragment-first. |
| Stanford CS224N | S48's cosine/dot treatment (T1-A) is correct but shallow; CS224N develops the linear-algebra foundations. | S48 is appropriate for a Master-level *engineering* section; CS224N is a foundations course. Complementary, not competing. |
| NIST AI RMF | S48's abstention + audit-evidence framing aligns with NIST's "measure, manage, monitor" functions. | S48 does not surface the NIST functions explicitly; a callout mapping S48 gates to NIST functions would strengthen the governance framing the section's `id` ("ai-governance") promises but the content doesn't deliver. |

**Verdict:** S48 is pedagogically stronger than the typical RAG tutorial
(which hand-waves eval and ACL) but weaker than the OWASP/NIST materials
on the governance/risk dimension that its `id` ("ai-governance") implies.
The section is excellent RAG engineering; it is *not* an AI-governance
section despite the filename and id.

---

## 12. Final Verdict

**Composite score: 6.5 / 10.**

The section is technically excellent (8/10 for exercise design and
contract rigor) but redactionally leaky (4/10 for callout meta-leak and
templated feedback). Fixing the 8 callouts (Diff 3) and de-templating
the 24 feedback strings (Diff 12) would move the section to ~8/10.
Fixing the title/identity inconsistency (Diffs 1–2 + roadmap decision)
would move it to ~8.5/10. The remaining Spanish micro-grammar sweep
(Diffs 4–10) is polish.

The section's biggest risk is **not** grammar — it is that a learner
reading the theory tab encounters 8 callouts that read as internal QA
notes, which undermines the otherwise rigorous I Do / We Do / You Do
structure.

---

*This is the complete Explorer report for Section 48. Ready for the Fixer prompt.*
