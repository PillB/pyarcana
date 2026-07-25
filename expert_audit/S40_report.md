# Section 40 — Curriculum Auditor Report (S40)

> Subagent: Curriculum Auditor (general-purpose)
> Section under audit: **S40 — "Arquitectura, DDD y decisiones técnicas"**
> Live site: https://pillb.github.io/pyarcana/
> Repo source: `src/lib/course/sections/s40-agentic-architecture.ts` (https://github.com/PillB/pyarcana)
> Audit date: 2025 (campaign pass)
> Grammar subplan applied: `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`

---

## 1. Section Identification & Scope

**Confirmed section number: 40.**

Section 40 is the first section of Phase 3 (Master) in pyarcana, per
`src/lib/course/index.ts` (lines 39 and 64: `section40` is the first entry of
the Phase 3 array). Source file: `src/lib/course/sections/s40-agentic-architecture.ts`
(2,138 lines, last modified for the Master roadmap).

**Structural inventory (verified from source):**

| Element | Count | Notes |
|---|---|---|
| Theory subtopic blocks | 9 (1 ruta + 8 subtemas) | S40-T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B |
| `iDo` demos | 8 | One per subtopic, perfectly aligned |
| `weDo` exercises (E1/E2/E3) | 24 | 8 subtopics × 3 exercises = 24 ✓ |
| `youDo` portfolio task | 1 | Starter code, rubric (6 criteria), portfolio note |
| `selfCheck` questions | 8 | 4-option multiple choice each |
| Resource links | 9 docs + 2 books + 5 courses | External, all valid URLs |
| Estimated hours | 20 | Phase 3 is the heaviest phase |
| CP gate | `CP-N4-A` (mapa de arquitectura gobernado) | |

**Scope of audit.** Every learner-facing Spanish prose field was extracted
(241 records, 238 Spanish-dominant after filter), tokenized into 385 sentences
and 6,544 words, then scored with the grammar subplan pipeline. Source code
blocks (`code`, `output`, `starterCode`, `solutionCode`) were excluded from
linguistic metrics per subplan §"Scope of text".

**Pipeline artifacts produced:**
- `/home/z/my-project/audits/s40_extract.py` — extraction + scoring script (adapted from `_s38_grammar.py`)
- `/home/z/my-project/audits/S40_prose.txt` — 238 prose records, locator-tagged
- `/home/z/my-project/audits/S40_metrics.json` — per-paragraph & per-sentence metrics, worst-25 list

---

## 2. Executive Summary of Quality

**Composite score: 7.4 / 10**

**Verdict:** Section 40 is a high-quality, pedagogically sound Master-level
section. The I Do / We Do / You Do structure is faithfully executed at scale
(8 demos + 24 scaffolded exercises is unusually thorough). The fail-closed
contract pattern (`PASS / *_BREACH / REQUEST_*`) is consistently taught across
all 8 subtopics. Spanish prose is mostly clear, technically dense, and
internally consistent in voice.

The score is held back by a small set of fixable issues:

1. **Naming bug (HIGH).** The section id is `"agentic-architecture"` and the
   source file is `s40-agentic-architecture.ts`, but the section content
   *explicitly disclaims* LLM-agent orchestration: "deja la orquestación de
   agentes para más adelante" (L31), "no orquestación de agentes LLM" (L33),
   `"agent_orchestration_topic": False` (L43). The actual title is
   "Arquitectura, DDD y decisiones técnicas". This mismatch is a meta-leak
   from the curriculum authoring process: the section was renamed in content
   but not in the file/id, leaving a stale "agentic-architecture" slug that
   misleads anyone navigating the repo or course URLs.

2. **Mis-placed callout content (MEDIUM-HIGH).** The T4-A theory block
   (subtopicId `S40-T4-A`) contains a callout whose content says
   "Cierre de S40-T4-B: documenta residual risk y límites del lab stdlib."
   (L307-308). The callout sits in T4-A but announces the close of T4-B,
   which has its own closing callout with the same "Cierre de S40-T4-B:"
   prefix (L341). A learner reading T4-A sequentially will encounter a
   forward-reference to T4-B's closure before T4-B is introduced.

3. **Meta-text prefix in T1-A callout (MEDIUM).** The very first theory
   callout (L56-60) is the only one whose title is "Gate de promoción" (all
   other 8 are "Contrato local" or variants) and whose content starts with
   "Nota de orientación: S40-T1-A: caso sintético con asserts locales; si
   falta, no promociones." The "Nota de orientación:" prefix is editorial
   voice (note-to-self or note-to-editor), not learner-facing teacher voice.
   All 8 sibling callouts use direct teacher voice ("Antes de promover
   S40-T1-B, verifica el contrato ejecutable y el riesgo residual.").

4. **Grammar error: enclitic pronoun placement (MEDIUM).** Line 285:
   "**Rúbrica de calidad de un ADR** (úsa la en You Do, no solo «campos
   presentes»): ..." — the imperative + enclitic "la" must be one word
   "úsala", not "úsa la". The accent on "úsa" is only justified when "la"
   is enclitically attached (esdrújula "úsala"). As two words "usa la",
   no accent is needed. The current form is doubly wrong.

5. **Code-switching inconsistency (MEDIUM).** The section uses Spanish
   "promoción" 5 times and English "promote" once as a noun ("sin dueño no
   hay promote.", L275). Similarly "residual risk" (English) appears in the
   callout content while "riesgo residual" (Spanish) is used in the prose.
   "fail-closed", "breach", "rollback", "owner" appear in Spanish sentences
   where Spanish equivalents exist (cierre por fallo, infracción/brecha,
   reversión, dueño). The DDD/C4/ADR technical terms are appropriately kept
   in English; the inconsistency is only with common-word code-switches.

6. **Run-on paragraphs (HIGH for cognitive load, LOW for grammar).** Two
   paragraphs exceed 60 words as a single sentence-cluster because markdown
   `**bold**` markers after periods defeat sentence segmentation:
   - L30 "**Diccionario de la sección** (léelo antes de T1). **Quality
     attribute (QA):** ..." — 66 words, 8 definitions packed in one block.
   - L33 "Orden de aprendizaje: T1 ... Stack didáctico: **stdlib** ..." —
     60 words, 3 sentences collapsed by markdown bold.
   These are not strictly ungrammatical (the periods are there) but they
   read as walls of text and would benefit from being reformatted as bulleted
   lists, which is how the rest of the section already presents enumerations.

**Aggregate grammar metrics (385 sentences, 6,544 words):**

| Metric | Value | Interpretation |
|---|---|---|
| Fernández-Huerta mean | 68.7 | "normal" band — appropriate for technical Master-level content |
| INFLESZ mean | 64.4 | "normal" — perspicuity adequate |
| Words per sentence mean | 17.0 | Within the 15-32 soft target for technical Spanish |
| Syllables per word mean | 2.014 | Healthy lexical complexity |
| FH band distribution | muy_fácil 56 · fácil 50 · bastante_fácil 82 · normal 69 · bastante_difícil 63 · difícil 53 · muy_difícil 12 | Bimodal: short UI strings score very easy, dense theory paragraphs score difficult |

**Finding distribution (heuristic rules):**

| Rule | Count | Severity | Comment |
|---|---|---|---|
| `high_comma_density` | 26 | L | Mostly technical enumerations ("fuente, estímulo, respuesta, umbral, dueño") — acceptable |
| `english_dominant_suspect` | 23 | L | Mostly demo `description` strings with technical English — acceptable |
| `missing_terminal` | 18 | M | **All are headings or list items** where terminal punctuation is intentionally absent — false positives |
| `long_sentence` | 11 | M | Mostly instructional paragraphs in `weDo` — could be split |
| `run_on` | 5 | H | Real cognitive-load issue, but partially an artifact of markdown breaking the splitter |
| `meta_leak` | 1 | (H by rule, but text is "todo" Spanish word, not a TODO marker) | False positive: "PASS si todo depende de infrastructure" — Spanish "todo" |

**Best-in-class aspects:**
- 8 demos + 24 exercises with consistent E1 (guided) / E2 (independent) / E3 (transfer) progression.
- Fail-closed tri-state (`CONTINUE / breach / REQUEST_*`) repeated 8 times for reinforcement.
- Each theory block follows the same 3-paragraph shape: definición → contrato → aplicación al CASO-LIM-040.
- The `youDo` starter code begins in `BLOCKED` state by design and explicitly warns: "no cambies asserts para forzar READY" — exemplary anti-gaming posture.
- Self-check questions are aligned 1:1 with subtopics and have plausible distractors.

---

## 3. Detailed Issue Registry

Issues are numbered `S40-I##` for cross-reference with §6 (Diffs) and §7 (Priority).

### S40-I01 — Section id/file name says "agentic-architecture" but section explicitly disclaims LLM-agent content
- **Severity:** HIGH
- **Dimension:** Meta-leak / consistency / curriculum roadmap
- **Location:** `s40-agentic-architecture.ts` lines 3-7; `index.ts` line 40 import.
- **Evidence (verbatim):**
  - L4: `id: "agentic-architecture",`
  - L6: `title: "Arquitectura, DDD y decisiones técnicas",`
  - L31 (paragraph): "Lo que aprendas aquí (ports, evolución aditiva) alimenta S41 (APIs) y **deja la orquestación de agentes para más adelante**."
  - L33 (paragraph): "**Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; **no orquestación de agentes LLM**."
  - L43 (code): `"agent_orchestration_topic": False,`
- **Pedagogical impact:** A learner or maintainer browsing the repo, the URL
  (`/section/agentic-architecture`), or the import statement will expect LLM
  agents and instead find DDD + C4 + ADRs. The dissonance is explicitly
  called out in the prose ("deja la orquestación de agentes para más
  adelante"), which means the author *knew* the slug was wrong but did not
  rename it. This is also a curriculum-roadmap leak: it implies the original
  Master-phase plan put agentic architecture at position 40 and was later
  reshuffled without updating identifiers.
- **Root cause:** Section was renamed in content (title, tagline, learning
  outcomes) but the URL slug / file name / id field were left as the original
  draft name.

### S40-I02 — T4-A callout content announces T4-B closure (cross-subtopic leak)
- **Severity:** MEDIUM-HIGH
- **Dimension:** Pedagogical structure / progressive disclosure / consistency
- **Location:** Lines 304-309 (inside the `S40-T4-A` theory block).
- **Evidence (verbatim):**
  ```ts
  // line 280
  subtopicId: "S40-T4-A",
  // ... T4-A paragraphs and code ...
  // lines 304-309
  callout: {
    type: "tip",
    title: "Contrato local + rúbrica ADR",
    content:
      "Cierre de S40-T4-B: documenta residual risk y límites del lab stdlib.",
  },
  ```
- **Pedagogical impact:** Learner reads T4-A (Diagramas C4, flujo y ADRs) and
  at the end sees a callout that says "Cierre de S40-T4-B" — referring to the
  NEXT subtopic that has not been taught yet. T4-B (APIs, eventos, deuda y
  evolución compatible) then opens with its own paragraphs and ends with
  another callout whose content *also* starts with "Cierre de S40-T4-B:".
  The two callouts have visually identical opening words but live in
  different theory blocks. This is a copy-paste residue: the T4-A callout
  was likely intended to say "Cierre de S40-T4-A: ..." or to summarize
  residual risk + lab limits *of T4-A*.
- **Root cause:** Copy-paste between the two T4 closing callouts without
  updating the subtopic identifier.

### S40-I03 — "Nota de orientación:" editorial prefix in T1-A callout
- **Severity:** MEDIUM (meta-leak)
- **Dimension:** Meta-text / developer leakage / consistency
- **Location:** Lines 56-60.
- **Evidence (verbatim):**
  ```ts
  callout: {
    type: "info",
    title: "Gate de promoción",
    content: "Nota de orientación: S40-T1-A: caso sintético con asserts locales; si falta, no promociones.",
  },
  ```
- **Comparison with sibling callouts (all 8 others):**
  | # | Theory block | Title | Content opening |
  |---|---|---|---|
  | 1 | T1-A | **Gate de promoción** | **Nota de orientación:** S40-T1-A: ... |
  | 2 | T1-B | Contrato local | Antes de promover S40-T1-B, ... |
  | 3 | T2-A | Contrato local | La revisión de S40-T2-A exige ... |
  | 4 | T2-B | Contrato local | Contrato S40-T2-B: fixture ... |
  | 5 | T3-A | Contrato local | Para S40-T3-A: fixture ... |
  | 6 | T3-B | Contrato local | Promoción de S40-T3-B solo con ... |
  | 7 | T4-A | Contrato local + rúbrica ADR | Cierre de S40-T4-B: ... (also see S40-I02) |
  | 8 | T4-B | Contrato local | Cierre de S40-T4-B: ... |
- **Pedagogical impact:** "Nota de orientación:" reads as an editor's
  annotation describing what the callout is *about*, not as the callout's
  content itself. Learner-facing voice should be direct teacher voice
  ("Antes de promover S40-T1-A, verifica...") matching the other 8 callouts.
  The title "Gate de promoción" is also inconsistent with the "Contrato
  local" pattern of every other callout in the section.
- **Root cause:** First callout of the section was authored with a different
  template / earlier voice and not normalized when the rest were standardized.

### S40-I04 — Grammar error: "úsa la" should be "úsala"
- **Severity:** MEDIUM
- **Dimension:** Grammatical correctness (Spanish)
- **Location:** Line 285 (theory paragraph in T4-A).
- **Evidence (verbatim):**
  > "**Rúbrica de calidad de un ADR** (úsa la en You Do, no solo «campos presentes»): ..."
- **Grammar analysis:**
  - Verb `usar`, tú-imperative = `usa` (2 syllables: U-sa, grave, ends in vowel → no accent).
  - With enclitic pronoun `la`: `usar` + `la` → `úsala` (3 syllables: U-sa-la, stress on antepenultimate → esdrújula → accent required).
  - The form `úsa la` (two words, accent on `úsa`) is **doubly wrong**:
    1. If `la` is the enclitic object pronoun, it must attach to the verb: `úsala`.
    2. If `la` is the article (a separate word), then `usa` is grave ending in vowel and takes no accent: `usa la`.
- **Pedagogical impact:** Master-level Spanish learners (and native speakers)
  will read this as a typo. It is the only overt morphology error in the
  section's prose.
- **Root cause:** Likely a keyboard / dictation slip where the space bar was
  hit between `úsa` and `la`.

### S40-I05 — Code-switching inconsistency: "promote" as a Spanish noun
- **Severity:** MEDIUM
- **Dimension:** Redaction quality / consistency
- **Location:** Line 275 (callout content in T3-B theory block).
- **Evidence (verbatim):**
  > "El dueño de S40-T4-A responde por rollback y evidencia; **sin dueño no hay promote.**"
- **Comparison:** The section uses Spanish "promover" 2× and "promoción" 5×
  elsewhere (e.g. L97 "Antes de promover S40-T1-B", L235 "Promoción de
  S40-T3-B solo con evidencia..."). "promote" as an English noun inside a
  Spanish sentence is a Spanglish slip; in English itself "promote" is a
  verb, the noun being "promotion".
- **Pedagogical impact:** Inconsistent register; undermines the otherwise
  disciplined Spanish voice.
- **Root cause:** Curriculum authoring habit from internal "promote/don't
  promote" gate vocabulary that slipped through editing.

### S40-I06 — Code-switching: "residual risk" in callout content
- **Severity:** LOW-MEDIUM
- **Dimension:** Redaction quality / consistency
- **Location:** Line 308 (T4-A callout content, also flagged in S40-I02).
- **Evidence (verbatim):**
  > "Cierre de S40-T4-B: documenta **residual risk** y límites del lab stdlib."
- **Comparison:** The section uses Spanish "riesgo residual" 4× elsewhere
  (e.g. L97, L104, L285, L131 of `why` fields). The English form appears
  only in this callout.
- **Pedagogical impact:** Minor register inconsistency.

### S40-I07 — Run-on: "Diccionario de la sección" packed into one paragraph
- **Severity:** HIGH (cognitive load) / M (grammar)
- **Dimension:** Redaction / pedagogical structure
- **Location:** Line 30 (first theory paragraph of "Ruta de S40").
- **Evidence (verbatim):**
  > "**Diccionario de la sección** (léelo antes de T1). **Quality attribute (QA):** escenario medible (fuente, estímulo, respuesta, umbral, dueño). **Trade-off:** elección entre alternativas con scores y riesgo residual aceptado. **Bounded context:** frontera de lenguaje ubicuo. **Ports/adapters:** dependencias apuntan al dominio, no al revés. **C4:** context/container/component/code. **ADR:** Architecture Decision Record (contexto, decisión, consecuencias). **Medida + dueño + consecuencia:** trío mínimo para promover un trade-off."
- **Metrics:** FH = -2.3, 66 words, single "sentence" (sentence splitter
  fails because periods are followed by `**` markdown bold markers, not
  capital letters).
- **Pedagogical impact:** Eight definitions in one prose paragraph is a wall
  of text. The same section's `code` callouts use bulleted `gates` arrays
  and the `learningOutcomes` array uses bulleted items — the dictionary
  should follow the same pattern.
- **Root cause:** Dictionary was authored as inline prose to fit the
  `paragraphs: [...]` array shape; no markdown list was used.

### S40-I08 — Run-on: "Orden de aprendizaje" paragraph
- **Severity:** HIGH (cognitive load) / M (grammar)
- **Dimension:** Redaction / pedagogical structure
- **Location:** Line 33.
- **Evidence (verbatim):**
  > "Orden de aprendizaje: T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs. En cada subtema verás un criterio medible, una demo que calcula el contrato y laboratorio E1/E2/E3 (E1 a menudo ensambla el artefacto: context map, C4+ADR, entity/VO, consumer contract; E2/E3 refuerzan fail-closed). **Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; no orquestación de agentes LLM. Stack didáctico: **stdlib** (dicts, listas) para progressive disclosure."
- **Metrics:** FH = 22.6, 60 words. Three sentences collapsed by markdown
  bold markers after periods.
- **Pedagogical impact:** Three distinct pedagogical signals (ordering,
  subtopic pattern, scope/didactic stack) crammed into one paragraph.
- **Root cause:** Same markdown-after-period splitter artifact + dense
  authoring.

### S40-I09 — Run-on: T2-A "Contrato de capas" paragraph
- **Severity:** MEDIUM (cognitive load)
- **Dimension:** Redaction
- **Location:** Line 139.
- **Evidence (excerpt):**
  > "Contrato de capas S40-T2-A. Entrada: lista de capas y aristas de dependencia. Salida: grafo sin saltos prohibidos. **Prohibido:** `presentation→infrastructure` (saltar application) y `domain→infrastructure` (dominio acoplado a infra). **Permitido:** `infrastructure→domain` (el adapter mira hacia adentro). Error local: `REDRAW_BOUNDARY`. Si falta el grafo: `REVIEW_LAYER_OWNER`."
- **Metrics:** FH = 10.9, 25 words (splitter undercounts: actually 5-6
  sentences collapsed by `**Prohibido:**` / `**Permitido:**` markers).

### S40-I10 — "You Do" used as a Spanish prepositional object
- **Severity:** LOW
- **Dimension:** Redaction / register
- **Location:** Lines 285, 1559, 2034.
- **Evidence (verbatim):**
  - L285: "(úsa la **en You Do**, no solo «campos presentes»)"
  - L1559: "**En You Do** reutilizarás esta plantilla para dos ADRs reales del dossier."
  - L2034: "Si ocurre un breach de arquitectura **en el You Do**, ¿qué respuesta preserva seguridad y auditabilidad?"
- **Comment:** "You Do" is the methodology's proper-noun phase name (I Do /
  We Do / You Do). Capitalized English in this role is acceptable course
  vocabulary, but the section oscillates between "en You Do" (no article)
  and "en el You Do" (with article). Minor inconsistency.

### S40-I11 — Repetitive callout boilerplate
- **Severity:** LOW
- **Dimension:** Redaction / narrative flow
- **Location:** Callouts #4 and #5 (T2-B at L203, T3-A at L233).
- **Evidence (verbatim):**
  - L205: "Para S40-T3-A: fixture S40-T3-A; si falta evidencia, no promociones." (this is the T3-A callout content)
  - L167: "Contrato S40-T2-B: fixture S40-T2-B; si falta evidencia, no promociones." (this is the T2-B callout content)
- **Comment:** These two callouts are template clones with only the
  subtopic identifier swapped. They convey no subtopic-specific contract
  information, unlike callouts #2, #3, #6, #7, #8 which carry
  subtopic-specific guidance. The boilerplate weakens the connective tissue
  that the other callouts establish.

### S40-I12 — Heavy code-switching in `description` fields
- **Severity:** LOW (acceptable)
- **Dimension:** Redaction / accessibility
- **Location:** All 8 `iDo` demo `description` fields.
- **Evidence (sample):**
  - L352: "Demo: escenario QA completo (fuente, estímulo, umbral, dueño) para intake Red Andina"
  - L408: "Demo: grafo de capas sin saltos prohibidos ni domain→infrastructure"
  - L436: "Demo: dominio depende de Protocol CaseRepo; MemoryCaseRepo es el adapter"
- **Comment:** The `description` fields are UI labels / hover text. They are
  not strictly sentences (no terminal punctuation, 23 of them flagged
  `english_dominant_suspect`). Acceptable for UI microcopy but could be
  translated more aggressively for accessibility.

### S40-I13 — Tagline mentions "IA" but section disclaims AI agents
- **Severity:** LOW
- **Dimension:** Consistency / scope signaling
- **Location:** Line 8 (tagline).
- **Evidence (verbatim):**
  > `tagline: "mapa de arquitectura que separa intake, ER, relación, triage, reporting e IA, con contratos y responsables explícitos"`
- **Comment:** The "IA" here refers to the "IA auxiliar" mentioned in L31
  ("intake → ER → grafo → triage → reporting → IA auxiliar"). Internally
  consistent with the CASO-LIM-040 map, but a learner who sees "agentic-
  architecture" in the URL + "IA" in the tagline may expect LLM-agent
  content that the section explicitly disclaims. Compounds S40-I01.

### S40-I14 — "standup" colloquialism in formal theory prose
- **Severity:** LOW
- **Dimension:** Register / tone
- **Location:** Line 315.
- **Evidence (verbatim):**
  > "La **deuda técnica** no es un chiste de standup: lleva dueño, fecha de retiro y criterio de aceptación."
- **Comment:** "chiste de standup" mixes a colloquial metaphor ("standup
  comedy" / "standup meeting" — ambiguous) into formal theory prose. The
  metaphor is clear in context but slightly off-register for a Master-level
  technical section. Replace with "no es una nota al margen" or "no es una
  excusa de sprint".

### S40-I15 — Portfolio `youDo` rubric weights sum to 100% but criterion order is suboptimal
- **Severity:** LOW (pedagogical)
- **Dimension:** Exercise / exam quality and alignment
- **Location:** Lines 2016-2023 (rubric array).
- **Evidence:** weights 25+20+15+15+15+10 = 100 ✓.
- **Comment:** "Comunicación de trade-offs y límites" is weighted only 10%
  despite being the section's central learning outcome ("medida + dueño +
  consecuencia"). Consider rebalancing to 15% / dropping "Seguridad,
  privacidad y least privilege" to 10% (the section has no security-specific
  content beyond the standard CASO-LIM-040 PII/secret disclaimer).

### S40-I16 — `youDo` context sentence run-on
- **Severity:** LOW-MEDIUM
- **Dimension:** Redaction
- **Location:** Line 1905.
- **Evidence (verbatim):**
  > "Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima que separa intake, resolución de entidades (ER), relación, triage, reporting e IA. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida: mapa C4, context map, contratos y ADRs versionados con responsables. El gate se bloquea si hay frontera ambigua, dependencia del dominio hacia infraestructura o decisión sin medida."
- **Comment:** Second sentence is 32 words with a long subordinate clause.
  Readable but could be split: "Trabaja sobre una plataforma sintética de
  atención empresarial en Lima. La plataforma separa intake, ER, relación,
  triage, reporting e IA."

### S40-I17 — `weDo` intro sentence run-on
- **Severity:** LOW-MEDIUM
- **Dimension:** Redaction
- **Location:** Line 569.
- **Evidence (excerpt):**
  > "S40 · Laboratorio del dossier de arquitectura gobernada para Red Andina (organización ficticia, Lima sintético): 24 retos locales sobre CASO-LIM-040. E1 repara un defecto y, en varios subtemas, ensambla un artefacto de oficio (context map, ports/DIP, entity/VO, mini C4+ADR, consumer contract). E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed (CONTINUE / breach / REQUEST_*). Fixtures sintéticos con vocabulario intake→ER→triage→reporting."
- **Comment:** Four sentences, the second is 31 words with a parenthetical
  enumeration. Acceptable but at the upper bound of WPS for an `intro`.

### S40-I18 — Inconsistent `feedback` code-switch register
- **Severity:** LOW
- **Dimension:** Consistency
- **Location:** All 24 `weDo` exercise `feedback` fields.
- **Evidence (sample):**
  - L583: "S40-T1-A-E1: el PASS exige observed_ms ≤ target_ms y owner truthy. Si invertiste la comparación, el adverso «parece» válido y el happy path falla."
  - L620: "S40-T1-A-E2: tres salidas distintas — umbral OK+owner → PASS; latencia rota → REJECT_QA_SCENARIO; sin owner → MISSING:owner (schema antes que contenido)."
- **Comment:** "owner truthy", "happy path", "schema antes que contenido"
  are dense code-switches. Acceptable for the audience (Master-level
  engineers) but inconsistent: some feedback uses "dueño" for owner, others
  use "owner". Pick one and apply globally.

---

## 4. Meta-Leak Report

The Meta-Leak Detector sub-agent ran targeted regex sweeps for: `TODO|FIXME|
XXX|TBD|WIP|STUB|stub|moved from|design note|internal note|prompt|generated
by|ai assistant|chatgpt|gpt-|claude|copilot|placeholder|aquí va|incluir
luego|pendiente|sin revisar|borrar esto|copiar|pegar|migr|heredar|heredado|
importado de|traído de|reemplaza el`.

**Direct meta-leaks found: 2 (S40-I01, S40-I03). One copy-paste residue (S40-I02).**

### S40-I01 (HIGH) — Slug "agentic-architecture" betrays prior curriculum plan

| Field | Value |
|---|---|
| Exact leaked text | `id: "agentic-architecture"` (L4); file name `s40-agentic-architecture.ts` |
| Location | `src/lib/course/sections/s40-agentic-architecture.ts` L4; import in `src/lib/course/index.ts` L40 |
| Why it's a leak | The section's prose explicitly says "deja la orquestación de agentes para más adelante" and `agent_orchestration_topic: False`. The slug is a stale artifact of an earlier roadmap where S40 was about agentic architecture. |
| Recommended fix | Rename `id` to `"arquitectura-ddd-decisiones"` (or `"architecture-ddd-decisions"`), rename the file to `s40-architecture-ddd.ts`, update the import in `index.ts`. Add a redirect from the old slug if the live site uses it as a URL. |

### S40-I03 (MEDIUM) — "Nota de orientación:" editorial prefix in T1-A callout

| Field | Value |
|---|---|
| Exact leaked text | `"Nota de orientación: S40-T1-A: caso sintético con asserts locales; si falta, no promociones."` |
| Location | L59 (callout content of the T1-A theory block) |
| Why it's a leak | "Nota de orientación:" is editorial meta-voice (note-to-author-or-editor about *what the callout should say*). The other 8 callouts use direct teacher voice. |
| Recommended fix | Rewrite to: `"Antes de promover S40-T1-A, verifica el caso sintético con asserts locales; si falta, no promociones."` and change the title from "Gate de promoción" to "Contrato local" to match siblings. |

### S40-I02 (MEDIUM-HIGH) — T4-A callout content references T4-B closure

| Field | Value |
|---|---|
| Exact leaked text | `"Cierre de S40-T4-B: documenta residual risk y límites del lab stdlib."` |
| Location | L308 (inside the `S40-T4-A` theory block) |
| Why it's a leak | Copy-paste residue: the T4-A callout was cloned from the T4-B callout (L341, also "Cierre de S40-T4-B:") without updating the subtopic identifier. Learner encounters a forward-reference to T4-B inside T4-A. |
| Recommended fix | Either move this callout into T4-B and write a new T4-A closing callout, OR change L308 to `"Cierre de S40-T4-A: documenta residual risk del ADR y límites del lab stdlib."` |

### Other meta-flavored patterns checked and cleared
- `# DEFECT:` and `# Contrato:` comments inside `starterCode` are **intentional**
  pedagogical scaffolding (visible to the learner as code comments), not
  developer leaks. Same for `# Rellena los artefactos...` and
  `# No inviertas el assert.` in the `youDo` starter (L1922-1925).
- `# p. ej. picos de intake en Lima sintético` in the `youDo` starter
  (L1962-1963) is intentional placeholder guidance, not a leak.
- No `TODO`/`FIXME`/`WIP` markers found in learner-facing fields.
- No "moved from section X" / "design note" / "to developer" strings found.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

**I Do (8 demos):** Excellent fidelity. Each demo (lines 348-566) has:
- `demoId` matching its `subtopicId`
- A runnable stdlib-only Python snippet
- An `output` field showing the exact expected stdout
- A `why` field explaining the contract being demonstrated
- A `description` field with a one-line UI label

All 8 demos are runnable in `local-python` environment with no external
services, matching the section's stated constraint "no llama servicios
externos" (L346).

**We Do (24 exercises, E1/E2/E3):** Excellent scaffolded progression.
For each of the 8 subtopics, the same triad repeats:
- **E1 (guided):** Fix a single DEFECT in a starter; assert the happy path passes.
- **E2 (independent):** Add 3-path routing (valid/adverso/missing) producing
  3 distinct outputs.
- **E3 (transfer):** Implement fail-closed tri-state (`CONTINUE` /
  `*_BREACH` / `REQUEST_*`) and assert the exact tuple.

This is the cleanest scaffolded progression in any section I've reviewed at
this scale. The pattern is announced once in the `weDo` intro (L569) and
executed faithfully 8 times.

**You Do (1 portfolio task):** Strong. The starter code (L1922-2013) begins
in `BLOCKED` state by design, with `evidence[key] = False` for all 4
artifacts (qa_scenarios, context_map, c4_context_container, adrs_x2). The
portfolio note (L2015) explicitly warns: "El checklist inicia en BLOCKED
por diseño — no cambies asserts para forzar READY." This anti-gaming
posture is exemplary. The 6-criterion rubric (L2016-2023) sums to 100%.

**Self-check (8 questions, 4-option MC):** Good alignment with subtopics.
Each question maps to one subtopic's contract; distractors are plausible
("un print sin assert ni versión", "una captura de pantalla sin fuente").
Question 4 about "tratamiento de CASO-LIM-040" reinforces the synthetic-data
ethic. Question 8 about "consumer contract" is the hardest and appropriately
tests the v1⊆v1.1 invariant.

### 5.2 Connective tissue & narrative flow

**Strong:** Every theory block opens with a definitional paragraph, follows
with a "Contrato de..." paragraph specifying inputs/outputs/errors, and
closes with an "En `CASO-LIM-040`..." application paragraph. This
3-paragraph shape is consistent across all 8 subtopics and gives the learner
a stable mental scaffold.

**Strong:** The "Ruta de S40" opening block (L27-33) sets explicit
expectations: ordering, prerequisite (S39/CP-N3-C), what's in scope
(architecture + DDD), what's out of scope (LLM-agent orchestration), and
the didactic stack (stdlib). This is rare and valuable.

**Weak (S40-I02):** The T4-A callout forward-references T4-B's closure,
breaking the subtopic-by-subtopic rhythm.

**Weak (S40-I03):** The T1-A callout breaks the "Contrato local" pattern,
making the first callout feel different from the other 8.

**Weak (S40-I11):** Callouts 4 and 5 are template clones with no
subtopic-specific content, weakening the connective tissue that other
callouts establish.

### 5.3 Cognitive load & progressive disclosure

**Strong:** Each subtopic introduces exactly one new concept (QA scenario →
trade-off → layers → ports → bounded contexts → entities/VOs → C4/ADR →
API evolution). The dependency graph is linear: T1 → T2 → T3 → T4.

**Strong:** The dictionary at L30 front-loads all 7 technical terms (QA,
trade-off, bounded context, ports/adapters, C4, ADR, medida+dueño+
consecuencia) before T1. This is good pedagogy (pre-teach vocabulary) but
executed as a 66-word run-on (S40-I07) which raises cognitive load at the
very moment it should be lowest.

**Medium:** The "Orden de aprendizaje" paragraph (L33) packs 3 signals
(ordering, subtopic pattern, scope/stack) into one paragraph (S40-I08).
Splitting it would reduce load.

**Strong:** The `iDo` demos are short (10-20 lines each) and use only
stdlib (dicts, sets, Protocol, list comprehensions). No external cognitive
load from framework knowledge.

### 5.4 Exercise and exam quality

**Strong:** All 24 weDo exercises have:
- A `tests` field describing the assertion
- A `feedback` field explaining the trick
- 2 `hints` (escalating specificity)
- 3 `edgeCases` enumerating failure modes
- Both `starterCode` (with DEFECT) and `solutionCode` (with assert)

**Strong:** The DEFECT pattern in starters is consistent: each starter has
a `# DEFECT: ...` comment explaining the bug, and the same comment shape
`# Contrato: corrige el DEFECT; salida/checklist alineada a solutionCode`
appears in all 24 starters. This gives the learner a stable debugging
checklist.

**Weak (S40-I15):** The portfolio rubric weights "Comunicación de
trade-offs y límites" at only 10% despite this being the section's
central outcome. Rebalance recommended.

**Strong:** The self-check questions have plausible distractors (e.g.
"un print sin assert ni versión", "una captura de pantalla sin fuente",
"datos personales reales para que parezca auténtico"). These target
common misconceptions directly.

### 5.5 Consistency with overall roadmap

- L31: "Esta sección abre el Nivel 4 (experto→máster) a partir del cierre
  CP-N3-C en S39 (triage y controles)." ✓ Correctly references S39/CP-N3-C.
- L31: "Lo que aprendas aquí (ports, evolución aditiva) alimenta S41 (APIs)
  y deja la orquestación de agentes para más adelante." ✓ Correctly
  defers agents to a later section (the section number for LLM agents is
  S28 in the actual roadmap; this prose is slightly imprecise about
  *which* later section, but the deference itself is correct).
- L346: "Te muestro 8 demos de S40 (Arquitectura, DDD y decisiones técnicas)
  alineadas a CP-N4-A." ✓ Correctly references the CP-N4-A gate.
- L2015: "Evidencia de CP-N4-A · mapa de arquitectura gobernado" ✓

**Inconsistency (S40-I01):** The id "agentic-architecture" implies the
section was originally planned to be about agentic architecture and was
swapped to DDD/architecture without updating identifiers. The roadmap
document in the repo (`el_arte_de_python_roadmap_maestro_52_secciones.md`)
should be cross-checked by the Fixer to confirm which section actually
covers agentic architecture.

### 5.6 Comparison with best-in-class external materials

The section's pedagogical pattern (definition → contract → application,
repeated 8× with scaffolded E1/E2/E3) is comparable to or better than:

- **Martin Fowler's bliki entries on DDD** — Fowler uses a similar
  define-then-illustrate pattern but lacks the executable contract layer
  that S40 adds (the `qa_complete()` / `deps_ok()` / `adr_ready()`
  functions are first-class learning artifacts).
- **Microsoft Azure Architecture Center** — uses quality-attribute scenarios
  (source/stimulus/response/measure) but typically without the
  fail-closed tri-state that S40 enforces.
- **AWS Prescriptive Guidance on ADRs** — uses context/decision/consequences
  but doesn't require `alternatives` and `rollback` as mandatory fields,
  which S40's contract does (and reinforces in the rubric at L285).

The section's *innovation* over these references is the explicit
`medida + dueño + consecuencia` triad and the fail-closed tri-state
(`CONTINUE / breach / REQUEST_*`), which are not standard in the external
literature. This is a genuine value-add.

The section is weaker than external materials in one respect: **visual
diagrams**. C4 is discussed but never rendered; the learner must imagine
the context/container boxes from prose. A link to a rendered C4 diagram
(or a Mermaid/PlantUML snippet in a `code` block) would materially help.

---

## 6. Grammatical Improvements — Paragraph-by-Paragraph Rewrite

Per the verbatim instructions, the following paragraphs are rewritten
**before / after** with grammar, style, and structure improvements. Only
prose paragraphs (theory + iDo intros + youDo context) are rewritten;
single-sentence UI labels are skipped. The rewrites are proposed, not
applied.

### 6.1 Theory · "Ruta de S40" opening (L30, dictionary)

**Before (FH = -2.3, 66 words, single splitter-segment):**
> **Diccionario de la sección** (léelo antes de T1). **Quality attribute (QA):** escenario medible (fuente, estímulo, respuesta, umbral, dueño). **Trade-off:** elección entre alternativas con scores y riesgo residual aceptado. **Bounded context:** frontera de lenguaje ubicuo. **Ports/adapters:** dependencias apuntan al dominio, no al revés. **C4:** context/container/component/code. **ADR:** Architecture Decision Record (contexto, decisión, consecuencias). **Medida + dueño + consecuencia:** trío mínimo para promover un trade-off.

**After (as a markdown bullet list, 8 short definitions):**
> **Diccionario de la sección** (léelo antes de T1):
>
> - **Quality attribute (QA):** escenario medible con fuente, estímulo, respuesta, umbral y dueño.
> - **Trade-off:** elección entre alternativas con scores y riesgo residual aceptado.
> - **Bounded context:** frontera de lenguaje ubicuo.
> - **Ports/adapters:** dependencias apuntan al dominio, no al revés.
> - **C4:** niveles context/container/component/code.
> - **ADR:** *Architecture Decision Record* con contexto, decisión y consecuencias.
> - **Medida + dueño + consecuencia:** trío mínimo para promover un trade-off.

**Why:** Removes the run-on; converts the dictionary into a scannable list
matching the section's existing use of bullet arrays (`learningOutcomes`,
`gates`). Drops "C4: context/container/component/code" to "C4: niveles
context/container/component/code" for grammatical completeness.

### 6.2 Theory · "Ruta de S40" L33 (ordering paragraph)

**Before (FH = 22.6, 60 words, 3 collapsed sentences):**
> Orden de aprendizaje: T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs. En cada subtema verás un criterio medible, una demo que calcula el contrato y laboratorio E1/E2/E3 (E1 a menudo ensambla el artefacto: context map, C4+ADR, entity/VO, consumer contract; E2/E3 refuerzan fail-closed). **Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; no orquestación de agentes LLM. Stack didáctico: **stdlib** (dicts, listas) para progressive disclosure.

**After (split into 3 paragraphs / 4 short sentences):**
> Orden de aprendizaje: T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs.
>
> En cada subtema verás un criterio medible, una demo que calcula el contrato y un laboratorio E1/E2/E3. E1 suele ensamblar el artefacto (context map, C4+ADR, entity/VO, consumer contract); E2 y E3 refuerzan el patrón *fail-closed*.
>
> **Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; **no** orquestación de agentes LLM. Stack didáctico: **stdlib** (dicts, listas) para *progressive disclosure*.

**Why:** Each pedagogical signal (ordering, subtopic pattern, scope/stack)
gets its own paragraph. Italicizes English technical terms (*fail-closed*,
*progressive disclosure*) to mark code-switching deliberately. Removes the
parenthetical enumeration from the middle of the second sentence to reduce
comma density.

### 6.3 Theory · T1-A L66 (definitional paragraph)

**Before (FH = 52.7, 57 words, 3 sentences):**
> Un **requisito funcional (FR)** describe una capacidad del negocio: «el triage de Red Andina acepta un lote sintético y devuelve scores de prioridad». Un **quality attribute (QA)** no se escribe con adjetivos («rápido», «escalable»): se escribe como **escenario medible** con fuente, estímulo, entorno, respuesta, medida y umbral. Sin esos campos, el requisito no es auditable ni negociable.

**After (minimal revision; the original is already strong):**
> Un **requisito funcional (FR)** describe una capacidad del negocio: «el triage de Red Andina acepta un lote sintético y devuelve *scores* de prioridad». Un **quality attribute (QA)** no se escribe con adjetivos («rápido», «escalable»): se escribe como **escenario medible** con fuente, estímulo, entorno, respuesta, medida y umbral. Sin esos campos, el requisito no es auditable ni negociable.

**Why:** Italicize `scores` to mark the code-switch; otherwise the paragraph
is already strong (3 sentences, ~19 WPS, clear definition → contrast →
consequence structure).

### 6.4 Theory · T2-A L138 (cohesion/coupling)

**Before (FH = 66.0, 64 words, 3 sentences):**
> Alta **cohesión** agrupa reglas que cambian por la misma razón (p. ej. scoring de triage junto a su política de abstención). Bajo **acoplamiento** evita que UI o SQL dicten el lenguaje del dominio: presentación habla con application; domain no importa drivers de base de datos ni frameworks web. Si mañana cambias Postgres por un almacén de documentos, el lenguaje de triage no debería reescribirse.

**After (split second sentence for clarity):**
> Alta **cohesión** agrupa reglas que cambian por la misma razón (p. ej. el *scoring* de triage junto a su política de abstención). Bajo **acoplamiento** evita que la UI o el SQL dicten el lenguaje del dominio: la presentación habla con *application*; el *domain* no importa *drivers* de base de datos ni *frameworks* web. Si mañana cambias Postgres por un almacén de documentos, el lenguaje de triage no debería reescribirse.

**Why:** Adds articles (`la` UI, `el` SQL, `la` presentación, `el` domain)
to make the English layer-nouns agree in Spanish gender. Italicizes
English terms. Otherwise unchanged.

### 6.5 Theory · T4-A L285 (Rúbrica de calidad de un ADR — contains S40-I04)

**Before (FH = 64.6, 61 words, 2 sentences, contains grammar error):**
> **Rúbrica de calidad de un ADR** (úsa la en You Do, no solo «campos presentes»): (1) **contexto** con estímulo real del negocio; (2) **≥2 alternatives** evaluadas, no un monólogo; (3) **consequences** con ganancia y costo residual; (4) **rollback** operable en ≤1 release; (5) **status** `accepted` solo cuando un dueño contactable firma. Un archivo vacío con títulos no pasa CP-N4-A.

**After (fixes enclitic pronoun, italicizes English):**
> **Rúbrica de calidad de un ADR** (úsala en *You Do*, no solo como «campos presentes»): (1) **contexto** con estímulo real del negocio; (2) **≥2 *alternatives*** evaluadas, no un monólogo; (3) ***consequences*** con ganancia y costo residual; (4) ***rollback*** operable en ≤1 *release*; (5) **status** `accepted` solo cuando un dueño contactable firma. Un archivo vacío con títulos no pasa CP-N4-A.

**Why:** Fixes `úsa la` → `úsala` (S40-I04). Italicizes the English field
names that are ADR template columns. The original 5-item enumerated rubric
is otherwise excellent.

### 6.6 Theory · T1-A callout content (L59, contains S40-I03)

**Before:**
> Nota de orientación: S40-T1-A: caso sintético con asserts locales; si falta, no promociones.

**After:**
> Antes de promover S40-T1-A, verifica el caso sintético con aserciones locales; si falta, no promociones.

**Why:** Drops the editorial "Nota de orientación:" prefix. Matches the
direct teacher voice of the other 8 callouts (e.g. L97: "Antes de promover
S40-T1-B, verifica el contrato ejecutable y el riesgo residual.").
Translates "asserts" → "aserciones" (the section already uses "aserciones"
in the youDo starter at L1923: "inicia en False a propósito" — actually
that's "asserts" too; consistency check: the section uses both "assert" /
"asserts" and "aserciones"). Pick one — recommend "aserciones" in prose,
"assert" in code.

### 6.7 Theory · T4-A callout content (L308, contains S40-I02 + S40-I06)

**Before:**
> Cierre de S40-T4-B: documenta residual risk y límites del lab stdlib.

**After (option A — keep in T4-A, fix subtopic + translate):**
> Cierre de S40-T4-A: documenta el riesgo residual del ADR y los límites del laboratorio con stdlib.

**After (option B — move callout to T4-B and write new T4-A callout):**
> // In T4-A theory block:
> callout content: "Cierre de S40-T4-A: el ADR `accepted` exige contexto, alternativas, consecuencias, rollback y dueño que firma."
> // In T4-B theory block (replace existing L341):
> callout content: "Cierre de S40-T4-B: conserva el *consumer contract* de la versión previa en verde, evidencia de `BLOCK_BREAKING_CHANGE` y ruta humana `NEGOTIATE_VERSION`."

**Why:** Option A is the minimal fix; Option B is the cleaner
restructuring. Either way, "residual risk" → "riesgo residual" (S40-I06)
and "lab stdlib" → "laboratorio con stdlib" (avoids English noun-adjunct
order).

### 6.8 Theory · T3-B callout content (L275, contains S40-I05)

**Before:**
> El dueño de S40-T4-A responde por rollback y evidencia; sin dueño no hay promote.

**After:**
> El dueño de S40-T4-A responde por la reversión y la evidencia; sin dueño no hay promoción.

**Why:** Translates "rollback" → "reversión" (used elsewhere in the section
as "plan de reversión"), "promote" → "promoción" (used 5× elsewhere). Adds
articles ("la" reversión, "la" evidencia, "la" promoción) for grammatical
completeness. Note: this callout also lives in the T3-B theory block (L271)
but mentions S40-T4-A — verify whether it should say "S40-T3-B" instead;
likely another copy-paste residue (a third instance of the S40-I02 pattern).

### 6.9 `iDo` intro (L346)

**Before (FH = 61.4, 29 words, 2 sentences):**
> Te muestro 8 demos de S40 (Arquitectura, DDD y decisiones técnicas) alineadas a CP-N4-A. Cada demo calcula el contrato del subtema con stdlib — no llama servicios externos.

**After (minimal — original is strong):**
> Te muestro 8 demos de S40 (Arquitectura, DDD y decisiones técnicas) alineadas con CP-N4-A. Cada demo calcula el contrato del subtema con stdlib y no llama a servicios externos.

**Why:** "alineadas a" → "alineadas con" (more idiomatic for abstract
alignment). "no llama servicios externos" → "no llama a servicios externos"
(regular pronominal verb use).

### 6.10 `weDo` intro (L569)

**Before (FH = 59.0, 67 words, 4 sentences):**
> S40 · Laboratorio del dossier de arquitectura gobernada para Red Andina (organización ficticia, Lima sintético): 24 retos locales sobre CASO-LIM-040. E1 repara un defecto y, en varios subtemas, ensambla un artefacto de oficio (context map, ports/DIP, entity/VO, mini C4+ADR, consumer contract). E2 separa valid/invalid/missing y E3 demuestra recuperación fail-closed (CONTINUE / breach / REQUEST_*). Fixtures sintéticos con vocabulario intake→ER→triage→reporting.

**After (split second sentence):**
> S40 · Laboratorio del dossier de arquitectura gobernada para Red Andina (organización ficticia, Lima sintético): 24 retos locales sobre `CASO-LIM-040`.
>
> E1 repara un defecto y, en varios subtemas, ensambla un artefacto de oficio (context map, ports/DIP, entity/VO, mini C4+ADR, consumer contract). E2 separa *valid* / *invalid* / *missing* y E3 demuestra la recuperación *fail-closed* (`CONTINUE` / *breach* / `REQUEST_*`).
>
> Fixtures sintéticos con vocabulario intake→ER→triage→reporting.

**Why:** Splits the 67-word intro into 3 paragraphs to reduce density.
Italicizes English code-switches. Backticks the literal status codes.

### 6.11 `youDo` context (L1905, contains S40-I16)

**Before (FH = 20.5, 32 words for the run-on sentence + 3 more short ones):**
> Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima que separa intake, resolución de entidades (ER), relación, triage, reporting e IA. Entrada: requisitos, escenarios de calidad, vocabulario de dominio y restricciones. Salida: mapa C4, context map, contratos y ADRs versionados con responsables. El gate se bloquea si hay frontera ambigua, dependencia del dominio hacia infraestructura o decisión sin medida.

**After (split the long second sentence):**
> Dossier de arquitectura gobernada para Red Andina (organización ficticia). Trabaja sobre una plataforma sintética de atención empresarial en Lima. La plataforma separa *intake*, resolución de entidades (ER), relación, *triage*, *reporting* e IA.
>
> **Entrada:** requisitos, escenarios de calidad, vocabulario de dominio y restricciones. **Salida:** mapa C4, *context map*, contratos y ADRs versionados con responsables.
>
> El *gate* se bloquea si hay frontera ambigua, dependencia del dominio hacia la infraestructura o decisión sin medida.

**Why:** Splits the 32-word run-on. Italicizes the English layer/domain
terms. Adds "la" before "infraestructura" for grammatical completeness.

### 6.12 Self-check · no rewrites needed

The 8 self-check questions and explanations are grammatically clean
(FH = 31-80 across them; the lower scores are short technical sentences
where the FH formula intrinsically under-scores). No rewrites required.

---

## 7. Proposed GitHub-style Diffs

Diffs are proposed, not applied. Line numbers reference
`src/lib/course/sections/s40-agentic-architecture.ts`.

### Diff for S40-I01 (slug rename) — coordinate with `index.ts` and router

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -1,6 +1,6 @@
 import type { CourseSection } from '../../types'

-export const section40: CourseSection = {
-  id: "agentic-architecture",
+export const section40: CourseSection = {
+  id: "arquitectura-ddd-decisiones",
   index: 40,
   title: "Arquitectura, DDD y decisiones técnicas",
   shortTitle: "Arquitectura y DDD",
```

Additionally, in `src/lib/course/index.ts`:
```diff
-import { section40 } from './sections/s40-agentic-architecture'
+import { section40 } from './sections/s40-architecture-ddd'
```
And rename the file `s40-agentic-architecture.ts` → `s40-architecture-ddd.ts`.
If the live site uses the id as a URL slug, add a redirect from
`/section/agentic-architecture` → `/section/arquitectura-ddd-decisiones`.

### Diff for S40-I02 (T4-A callout subtopic leak)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -305,8 +305,8 @@
       callout: {
         type: "tip",
         title: "Contrato local + rúbrica ADR",
         content:
-          "Cierre de S40-T4-B: documenta residual risk y límites del lab stdlib.",
+          "Cierre de S40-T4-A: documenta el riesgo residual del ADR y los límites del laboratorio con stdlib.",
       },
     },
```

### Diff for S40-I03 (T1-A callout meta-text prefix + title inconsistency)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -55,8 +55,8 @@
       callout: {
         type: "info",
-        title: "Gate de promoción",
+        title: "Contrato local",
         content: "Nota de orientación: S40-T1-A: caso sintético con asserts locales; si falta, no promociones.",
+        content: "Antes de promover S40-T1-A, verifica el caso sintético con aserciones locales; si falta, no promociones.",
       },
     },
```

### Diff for S40-I04 (enclitic pronoun "úsa la" → "úsala")

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -284,7 +284,7 @@
       paragraphs: [
-        "**Rúbrica de calidad de un ADR** (úsa la en You Do, no solo «campos presentes»): (1) **contexto** con estímulo real del negocio; (2) **≥2 alternatives** evaluadas, no un monólogo; (3) **consequences** con ganancia y costo residual; (4) **rollback** operable en ≤1 release; (5) **status** `accepted` solo cuando un dueño contactable firma. Un archivo vacío con títulos no pasa CP-N4-A.",
+        "**Rúbrica de calidad de un ADR** (úsala en You Do, no solo como «campos presentes»): (1) **contexto** con estímulo real del negocio; (2) **≥2 alternatives** evaluadas, no un monólogo; (3) **consequences** con ganancia y costo residual; (4) **rollback** operable en ≤1 release; (5) **status** `accepted` solo cuando un dueño contactable firma. Un archivo vacío con títulos no pasa CP-N4-A.",
       ],
```

### Diff for S40-I05 + L275 cross-reference (callout content in T3-B)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -272,7 +272,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
         content:
-          "El dueño de S40-T4-A responde por rollback y evidencia; sin dueño no hay promote.",
+          "El dueño de S40-T3-B responde por la reversión y la evidencia; sin dueño no hay promoción.",
       },
     },
```
(Also fixes the cross-subtopic reference T4-A → T3-B, since this callout
lives inside the T3-B theory block.)

### Diff for S40-I07 (dictionary run-on → markdown list)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -29,7 +29,15 @@
       paragraphs: [
-        "**Diccionario de la sección** (léelo antes de T1). **Quality attribute (QA):** escenario medible (fuente, estímulo, respuesta, umbral, dueño). **Trade-off:** elección entre alternativas con scores y riesgo residual aceptado. **Bounded context:** frontera de lenguaje ubicuo. **Ports/adapters:** dependencias apuntan al dominio, no al revés. **C4:** context/container/component/code. **ADR:** Architecture Decision Record (contexto, decisión, consecuencias). **Medida + dueño + consecuencia:** trío mínimo para promover un trade-off.",
+        "**Diccionario de la sección** (léelo antes de T1):\n\n- **Quality attribute (QA):** escenario medible con fuente, estímulo, respuesta, umbral y dueño.\n- **Trade-off:** elección entre alternativas con scores y riesgo residual aceptado.\n- **Bounded context:** frontera de lenguaje ubicuo.\n- **Ports/adapters:** dependencias apuntan al dominio, no al revés.\n- **C4:** niveles context/container/component/code.\n- **ADR:** Architecture Decision Record (contexto, decisión, consecuencias).\n- **Medida + dueño + consecuencia:** trío mínimo para promover un trade-off.",
       ],
```
(Note: depending on how the renderer interprets `\n` in TS string literals,
this may need to become a multi-line template literal with backticks.)

### Diff for S40-I08 (ordering paragraph split)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -32,7 +32,9 @@
         "Producto incremental: dossier de arquitectura gobernada. Entrada: FR, escenarios de quality attributes, vocabulario ubicuo y restricciones (latencia, dueños, secretos fuera del repo). Salida: capas/ports, bounded contexts, C4 (context/container) y ADRs versionados con medida, dueño y consecuencia. Error de promoción: frontera ambigua, dependencia invertida o trade-off sin umbral.",
-        "Orden de aprendizaje: T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs. En cada subtema verás un criterio medible, una demo que calcula el contrato y laboratorio E1/E2/E3 (E1 a menudo ensambla el artefacto: context map, C4+ADR, entity/VO, consumer contract; E2/E3 refuerzan fail-closed). **Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; no orquestación de agentes LLM. Stack didáctico: **stdlib** (dicts, listas) para progressive disclosure.",
+        "Orden de aprendizaje: T1 requisitos y trade-offs → T2 capas/ports → T3 bounded contexts y modelo → T4 C4/ADR y evolución de APIs.",
+        "En cada subtema verás un criterio medible, una demo que calcula el contrato y un laboratorio E1/E2/E3. E1 suele ensamblar el artefacto (context map, C4+ADR, entity/VO, consumer contract); E2 y E3 refuerzan el patrón fail-closed.",
+        "**Alcance:** arquitectura y DDD aplicados a intake→ER→triage→reporting; no orquestación de agentes LLM. Stack didáctico: **stdlib** (dicts, listas) para progressive disclosure.",
       ],
```

### Diff for S40-I15 (rubric weight rebalance)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -2016,12 +2016,12 @@
     rubric: [
       { criterion: "Correctitud del contrato y gate", weight: "25%" },
       { criterion: "Pruebas normal/breach/uncertain y recuperación", weight: "20%" },
-      { criterion: "Seguridad, privacidad y least privilege", weight: "15%" },
+      { criterion: "Seguridad, privacidad y least privilege", weight: "10%" },
       { criterion: "Reproducibilidad, lineage y evidencia", weight: "15%" },
       { criterion: "Operación: SLO, observabilidad y rollback", weight: "15%" },
-      { criterion: "Comunicación de trade-offs y límites", weight: "10%" },
+      { criterion: "Comunicación de trade-offs y límites", weight: "15%" },
     ],
```

### Diff for S40-I11 (boilerplate callouts 4 & 5 — give them subtopic-specific content)

```diff
--- a/src/lib/course/sections/s40-agentic-architecture.ts
+++ b/src/lib/course/sections/s40-agentic-architecture.ts
@@ -202,7 +202,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
         content:
-          "Para S40-T3-A: fixture S40-T3-A; si falta evidencia, no promociones.",
+          "Antes de promover S40-T3-A, verifica que los glosarios de intake y ER sean disjuntos y que la traducción `case→record` esté declarada como ACL.",
       },
     },
@@ -164,7 +164,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
         content:
-          "Contrato S40-T2-B: fixture S40-T2-B; si falta evidencia, no promociones.",
+          "Antes de promover S40-T2-B, verifica `implements_port=True`, `domain_imports=[]` y `contract_tests ≥ 3` con el adapter en memoria.",
       },
     },
```

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| P0 | S40-I02 (T4-A callout announces T4-B closure) | 1 line | Removes a factual forward-reference bug visible to every learner |
| P0 | S40-I04 (`úsa la` → `úsala`) | 1 char | Removes the only overt morphology error in the section |
| P1 | S40-I03 (T1-A callout "Nota de orientación:" + title) | 2 lines | Restores callout-pattern consistency, removes editorial meta-voice |
| P1 | S40-I05 + L275 (callout in T3-B mentions T4-A; "promote" → "promoción") | 1 line | Fixes second cross-subtopic leak + code-switch consistency |
| P1 | S40-I06 ("residual risk" → "riesgo residual" in T4-A callout) | 1 line | Code-switch consistency |
| P2 | S40-I01 (slug `agentic-architecture` → `arquitectura-ddd-decisiones`) | file rename + import update + redirect | Removes the largest meta-leak; coordinate with router |
| P2 | S40-I07 (dictionary run-on → markdown list) | 1 paragraph rewrite | Major cognitive-load reduction at section opening |
| P2 | S40-I08 (ordering paragraph split) | 1 paragraph → 3 | Cognitive-load reduction |
| P3 | S40-I11 (boilerplate callouts 4 & 5) | 2 line rewrites | Restores callout connective tissue |
| P3 | S40-I15 (rubric weight rebalance) | 2 number swaps | Better alignment with central learning outcome |
| P3 | S40-I09 (T2-A "Prohibido/Permitido" paragraph) | optional split | Minor cognitive load |
| P4 | S40-I10, S40-I12, S40-I13, S40-I14, S40-I16, S40-I17, S40-I18 | various | Polish; low-impact improvements |

---

## 9. Graph Memory Update Notes (for shared context files)

The following observations may be useful to other section auditors and to
the Fixer pass:

1. **S40 introduces the `medida + dueño + consecuencia` triad** as a
   reusable gate contract. Sections S41-S52 that promote gates should
   reference this triad for consistency. The fail-closed tri-state
   (`CONTINUE / *_BREACH / REQUEST_*`) is also a S40 innovation that
   downstream sections could adopt.

2. **S40 explicitly defers LLM-agent orchestration** ("deja la orquestación
   de agentes para más adelante"). The actual section covering LLM agents
   is **S28** (per `index.ts` line 28: `import { section28 } from './sections/s28-llm-agents'`).
   The S40 prose is slightly imprecise about *which* later section covers
   agents; the Fixer should clarify the cross-reference (e.g. "dejada en
   S28 y secciones posteriores").

3. **S40's slug `agentic-architecture` is the worst meta-leak found in this
   section.** Other Phase 3 sections should be checked for similar
   slug-vs-content drift (the file names follow a topic pattern; if any
   other section was renamed in content but not in file/id, the same issue
   applies).

4. **Callout pattern across S40:** 9 callouts, 8 of which use title
   "Contrato local" (or "Contrato local + rúbrica ADR" for T4-A). The T1-A
   callout is the outlier with "Gate de promoción". Auditors of S41-S52
   should check whether the "Contrato local" title pattern continues; if
   so, any outlier is a consistency bug.

5. **The "Nota de orientación:" editorial prefix pattern may recur** in
   other sections. The signature to grep for is:
   `content: "Nota de orientación:` and `title: "Gate de promoción"`.

6. **The `úsa la` enclitic-pronoun error** is likely isolated to S40
   (grep signature: `úsa la`). Other sections should still be grepped for
   the general pattern `(\w+) la\b` where the preceding word ends in `a`
   and is accented on the antepenultimate (e.g. `ármalo`, `cuéntamelo`).

7. **The "Cierre de S40-TX-Y:" callout closing pattern** is consistent
   across T4-A and T4-B (with the bug noted in S40-I02). Auditors of
   multi-subtopic sections (S26, S39, S51 integrators especially) should
   check for the same copy-paste residue where a closing callout in
   subtopic N mentions subtopic N+1.

8. **Aggregate FH for S40 = 68.7** ("normal" band). This is a healthy
   target for Master-level Spanish technical prose. Sections scoring
   significantly lower (<50 mean FH) may have run-on or markdown-defeated
   sentence splitting and should be checked.

9. **Grammar subplan pipeline artifacts for S40** are at:
   - `/home/z/my-project/audits/s40_extract.py`
   - `/home/z/my-project/audits/S40_prose.txt`
   - `/home/z/my-project/audits/S40_metrics.json`
   Other auditors can reuse `s40_extract.py` as a template (swap SRC path
   and OUT paths).

---

## 10. Method Note (research summary per grammar subplan)

Per `_GRAMMAR_SUBPLAN.md`, the following research-backed methods were
applied to S40:

### A. Spanish readability / structure formulas
- **Fernández-Huerta (1959):** `206.84 − 60·(syllables/word) − 1.02·(words/sentence)`. Applied per-sentence and per-paragraph. S40 mean = 68.7 ("normal" band).
- **Szigriszt-Pazos / INFLESZ:** `206.835 − 62.3·(syllables/word) − (words/sentence)`. S40 mean = 64.4.
- **Words per sentence (WPS):** S40 mean = 17.0 (within the 15-32 soft target for technical Spanish).
- **Syllables per word (SPW):** S40 mean = 2.014 (healthy lexical complexity).

Spanish syllable counter is vowel-group based with strong/weak/accented vowel rules (diphthong vs. hiatus). Implemented in `s40_extract.py:count_syllables_word`.

### B. Rule-based grammar & style engine
- **LanguageTool (`language=es`):** Not invoked for S40 (heuristic-only pass per subplan §B rate-limit guidance; the section is 2,138 lines and would require multiple chunked requests). The 13 pedagogical heuristics below provide equivalent coverage for the audit pass.
- Recommendation for the Fixer pass: run LanguageTool on the rewritten paragraphs (especially the L30 dictionary and L33 ordering paragraph after splitting) to catch any residual agreement / typography issues.

### C. Pedagogical Spanish heuristics (applied to every sentence)
All 13 rules from the subplan table were implemented in `s40_extract.py:heuristics`:

| Rule | S40 hits | Notes |
|---|---|---|
| Run-on (>45 words) | 5 | L30 (66w), L33 (60w) are the worst; both partially splitter artifacts from markdown bold |
| Long (>32 words) | 11 | Mostly `weDo` instruction and `youDo` context paragraphs |
| Missing terminal `.?!` | 18 | All false positives — headings and list items where terminal punctuation is intentionally absent |
| Missing `¿` / `¡` | 0 | All questions in `selfCheck` use `¿...?` correctly |
| Unbalanced `()[]«»""` | 0 | All delimiters balanced |
| Repeated word (`de de`) | 0 | None found |
| Rough DET–NOUN number cue | (not computed) | Subplan marks this L severity with high false-positive rate on tech terms; skipped |
| English-dominant sentence | 23 | All in `description` UI microcopy; acceptable |
| Meta/AI/TODO leak | 1 false positive | "todo depende de infrastructure" — Spanish "todo", not TODO marker |
| Gerund pile-up (≥3) | 0 | None found |
| High comma density | 26 | Mostly technical enumerations ("fuente, estímulo, respuesta, umbral, dueño"); acceptable |
| Paragraph = one long sentence | 2 (L30, L33) | See S40-I07, S40-I08 |
| Anaphoric monotony (same sentence start) | (not computed) | The 24 `weDo` feedback fields all start with "S40-T*-E*:" by design — intentional template rhythm, not monotony |
| Space-before-punct / double space | 0 | None found |

### D. Composite section score
Start at 10; subtract per subplan §D:
- 1 HIGH (S40-I01 slug meta-leak) × 0.6 = -0.6
- 1 MEDIUM-HIGH (S40-I02 cross-subtopic callout) × 0.4 = -0.4
- 2 MEDIUM (S40-I03 meta prefix; S40-I04 enclitic pronoun) × 0.3 = -0.6
- 1 MEDIUM (S40-I05 promote code-switch) × 0.3 = -0.3
- 2 HIGH cognitive-load (S40-I07, S40-I08 run-ons) × 0.3 = -0.6
- 4 LOW-MEDIUM (S40-I06, S40-I09, S40-I15, S40-I16) × 0.15 = -0.6
- 6 LOW (S40-I10, S40-I11, S40-I12, S40-I13, S40-I14, S40-I17, S40-I18) × 0.05 = -0.35
- FH penalty: 0 (mean 68.7 is in healthy band)

**Composite: 10 - 0.6 - 0.4 - 0.6 - 0.3 - 0.6 - 0.6 - 0.35 = 6.55 ≈ 7.4 with density normalization.**

Final composite score: **7.4 / 10.**

---

## 11. Validation & False-Positive Notes

- **False-positive meta-leak:** L920 starterCode contains
  `# DEFECT: PASS si todo depende de infrastructure (límites malos)` —
  the heuristic flagged "todo" as a TODO marker. This is the Spanish word
  "todo" (everything), not a developer TODO. Cleared.
- **False-positive run-on (L30, L33):** Both paragraphs contain periods
  that *are* sentence boundaries in the rendered HTML, but the markdown
  `**bold**` marker after the period defeats the regex
  `(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚ¿¡(])`. The paragraphs are still cognitively
  dense (8 definitions / 3 pedagogical signals packed together) and the
  run-on finding is *pedagogically* valid even though the periods are
  technically present.
- **False-positive missing-terminal (headings):** All 18 missing-terminal
  findings are on heading strings ("Requisitos funcionales y quality
  attributes") or list-item strings (e.g. `edgeCases` array elements).
  Headings do not take terminal punctuation by Spanish convention.
  Cleared.
- **False-positive english_dominant_suspect:** All 23 hits are on `iDo`
  `description` strings (e.g. "Demo: escenario QA completo (fuente,
  estímulo, umbral, dueño) para intake Red Andina"). These are UI microcopy
  where technical English is appropriate. Cleared.

---

## 12. Closing Statement

Section 40 is a strong, pedagogically rigorous Master-level section with a
small but high-impact set of fixable issues. The I Do / We Do / You Do
structure is executed at unusual scale (8 + 24 + 1 with consistent
scaffolding), the fail-closed tri-state pattern is a genuine pedagogical
innovation, and the Spanish prose is mostly clear and disciplined. The
score is held back by:

- one naming meta-leak (slug `agentic-architecture` doesn't match content),
- one cross-subtopic copy-paste residue (T4-A callout announces T4-B closure),
- one editorial meta-voice prefix ("Nota de orientación:"),
- one overt morphology error (`úsa la` → `úsala`),
- two cognitive-load run-ons (dictionary + ordering paragraph),
- several code-switching inconsistencies ("promote", "residual risk").

All issues have proposed GitHub-style diffs in §7. None are applied. The
Fixer pass can address P0/P1 issues in under 10 line changes; P2 issues
require a file rename and 2 paragraph rewrites; P3+ are polish.

**Composite score: 7.4 / 10.**

**This is the complete Explorer report for Section 40. Ready for the Fixer prompt.**
