# PyArcana Curriculum Audit — Section 52
## "Enterprise Relationship & Operations Intelligence Platform: capstone final" (Capstone FINAL)

**Task ID:** S52
**Auditor:** Curriculum Auditor (general-purpose subagent)
**Source file:** `src/lib/course/sections/s52-career-strategy.ts` (1,911 lines, 134 KB)
**Live page:** https://pillb.github.io/pyarcana/?section=52 (confirmed via `agent-browser`)
**Repository:** https://github.com/PillB/pyarcana
**Phase:** 3 — Master (sections 40–52) · Final section of the course
**Estimated learner effort:** 80 h
**Level:** Master

---

## 1. Section Identification & Scope

Section 52 is the **52nd and final section** of the 4-phase PyArcana course. It is
listed in `src/lib/course/index.ts` as the last element of `COURSE_SECTIONS` (line 80)
and imported from `./sections/s52-career-strategy` (line 56). Its `id: "career-strategy"`,
`index: 52`, `phase: 3`, `level: "Master"`, `estimatedHours: 80` all match the canonical
metadata declared by `COURSE_META` (52 sections, 1,040 h total). The live site
(https://pillb.github.io/pyarcana/?section=52) was navigated with `agent-browser`; the
section header text rendered as:

> S52 · Enterprise Relationship & Operations Intelligence Platform: capstone final
> Capstone FINAL · CP-FINAL: integración de 12 capstones, demo reproducible, system card
> y caso de impacto para CV · 80 h · Master

The scope audited here is **only Section 52**. The section is a capstone integrator and
its learner-facing surface includes:

| Field | Count | Notes |
|---|---|---|
| `theory` subsections | 8 (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) | 29 paragraphs total |
| `iDo.steps` (demos) | 8 | One per theory subsection; each has `description`, `code`, `why` |
| `weDo.steps` (exercises) | 24 | 3 per topic (E1 guided, E2 independent, E3 transfer) × 8 topics |
| `youDo` capstone | 1 | `context`, 4 `objectives`, 9 `requirements`, `starterCode`, `portfolioNote`, 6 `rubric` criteria |
| `selfCheck.questions` | 5 | Each with 4 `options`, `correctIndex`, `explanation` |
| `resources` | 8 docs, 2 books, 4 courses | All external links |
| `learningOutcomes` | 8 | "Revalidar CF-1...", "Firmar constraints...", etc. |
| Callouts | 8 (1 info, 1 danger, 6 tips) | One per theory subsection |
| Total learner-facing Spanish prose | ~43,000 chars across 543 sentences | After filtering code bodies |

---

## 2. Executive Summary of Quality

**Overall score: 7.5 / 10**

**Verdict:** Section 52 is a *competent, well-structured, content-rich* capstone finale
that successfully synthesises the curriculum's I Do / We Do / You Do scaffold at Master
level. Pedagogically it is one of the strongest sections in the course: it forces a
defensible, fail-closed, ethics-hardened portfolio rather than a CV of soft skills,
which is the correct pedagogical and professional framing for a senior-master exit gate.
The meta-leak detector finds **zero** genuine developer/AI-to-developer residue, and the
structure is fully consistent with the surrounding Phase 3 sections (S47–S51) and the
curriculum roadmap.

The deductions concentrate in three domains:

1. **Redaction density / readability.** Many learner-facing Spanish sentences exceed
   the 32-word soft target for technical Spanish (7 are >45 words; 9 are 32–45). The
   very first learner-facing block (the "Diccionario de la sección" glossary) renders as
   a single ~165-word paragraph of bolded definitions that *should* be a definition list.
   A handful of theory paragraphs pack 4–5 sub-clauses with `;`, `—` and `→` connectors.
2. **Spanish typography / morphology leaks (low-cost, high-frequency).** LanguageTool
   (`es`) flags: `APIs` → `API` (5×; RAE rule that the plural of an acronym is not
   marked with `s`), `vs` → `vs.` (3×), `auto-etiquetado` → `autoetiquetado`
   (1×, but the section uses `auto-*` compounds throughout). These are mechanical
   fixes with clear RAE backing.
3. **A few localised concordance / imperative-ambiguity issues.** "stakeholders, jobs
   y métricas actualizados" (mixed-gender adjacency), "lista stakeholders vivos"
   (imperative vs adjective), "El checklist" (anglicism gender).

These are *editorial* issues, not pedagogical defects: the section's pedagogy,
governance model (HITL, no-auto-fraud, no-PII, fail-closed gates), I Do / We Do / You Do
fidelity, exercise triple (E1/E2/E3), and self-check alignment are all sound. The
recommended fixes are mechanical and concentrated in 5–10 strings.

---

## 3. Detailed Issue Registry

Issues are numbered `I-001` onward. Severities: **H** = High (correctness/pedagogy),
**M** = Medium (style/redaction), **L** = Low (typography/cosmetic). "Evidence" quotes
the verbatim source string (markdown stripped for readability when long).

### I-001 — Long run-on sentence in "Plan 80 h orientativo" paragraph (H)
- **Severity:** H (readability / cognitive load)
- **Location:** `theory[0].paragraphs[4]` (source line 34, second sentence in the
  paragraph; `paragraphs#4 sent=1` in metrics)
- **Words:** 79
- **FH:** 35.1 (band: *dificil*)
- **Evidence:**
  > "Plan 80 h orientativo: sem. 1–2 CF-1/no-go (~16 h); sem. 3–5 integración
  > contexts/HITL y contract tests (~24 h); sem. 6–7 evals/red team/SLO/drill medido
  > (~16 h); sem. 8–9 demo + evidence bundle + defensa oral (~16–24 h). iDo modela el
  > procedimiento con fixtures; weDo entrena alfabetización de gate (qué código emitir
  > ante válido/adverso/ausente); youDo es el ensamblaje real de 80 h — APIs, regresión
  > S1–S52, drill y bundle. Stack: stdlib + artefactos del curso."
- **Pedagogical impact:** Three distinct messages (weekly schedule, role of each
  pedagogical phase, stack choice) are fused into one block. A learner scanning the page
  cannot tell where the plan ends and the method explanation begins. The 80 h plan
  deserves a numbered list or table.

### I-002 — Long run-on sentence in "Cómo se ensamblan los 12 capstones" paragraph (H)
- **Severity:** H
- **Location:** `theory[0].paragraphs[3]` (source line 33; `paragraphs#3 sent=0`)
- **Words:** 67
- **FH:** 14.9 (band: *muy dificil*)
- **Evidence:**
  > "Cómo se ensamblan los 12 capstones (grafo de dependencia, no basurero de repos
  > sueltos): fundaciones de datos/ETL/entidad (ER) alimentan intake + er + relationship;
  > modelos, evals y RAG alimentan reporting + copilot siempre bajo HITL; RPA y
  > operación alimentan triage y el paquete de DR; cada CP-N* aporta un artefacto o
  > contrato reutilizable, pero ningún capstone parcial compensa un CP-N4-C fallido ni
  > un P0 abierto. El hilo narrativo de defensa es: CF-1 delta → no-go firmado → mapa
  > de 6 contexts → cadena HITL → matriz de 6 capas → drill RPO/RTO → demo ≤10 min →
  > evidence bundle de 8."
- **Pedagogical impact:** The dependency-graph metaphor and the defense-narrative
  thread are both key ideas; fusing them with semicolons makes the graph invisible.
  The arrow chain at the end should be a separate sentence or a list.

### I-003 — Long run-on in `portfolioNote` (H)
- **Severity:** H (this is the closing note learners see in the You Do phase)
- **Location:** `youDo.portfolioNote` (source line ~1770; `portfolioNote#0 sent=1`)
- **Words:** 64
- **FH:** 30.0 (band: *muy dificil*)
- **Evidence:**
  > "El checklist inicia en BLOCKED por diseño; READY exige hitos 80 h, 6 contexts
  > cableados (con relationship), eventos declarados, HITL, drill con reloj
  > (availability/SLO/RPO/RTO + restore), paths de los 8 artefactos, guion de defensa,
  > regresión S1–S52, mejora vs baseline y contribución personal — no voltear booleans."
- **Pedagogical impact:** This is the closing call-to-action. The 14-item checklist
  baked into prose overwhelms short-term memory. A bulleted list would dramatically
  improve scannability and the "ready vs blocked" mindset the section is teaching.

### I-004 — Run-on "Checklist de integración" paragraph (H)
- **Severity:** H
- **Location:** `theory[3].paragraphs[1]` (T2-A, source line 128; `paragraphs#12 sent=0`)
- **Words:** 49
- **FH:** 55.2
- **Evidence:**
  > "Checklist de integración (ensamblaje real, no solo checklist mental): (1) dibuja
  > el mapa de los seis contexts y el dueño de cada uno; (2) versiona OpenAPI y event
  > schemas (`job.finished`, `case.updated` como mínimo); (3) prohíbe
  > `shared_database` entre contexts; (4) exige ≥10 contract tests verdes que fallen
  > si el productor cambia un campo. Flujo típico sintético: intake recibe el caso → er
  > propone identidad → relationship actualiza grafo → triage prioriza → reporting
  > emite métricas → copilot cita con RAG. Si falta mapa o tests, `MAP_BOUNDED_CONTEXTS`
  > / `STOP_INTEGRATION_RELEASE`."
- **Pedagogical impact:** The paragraph fuses a 4-step checklist AND a 6-step data
  flow AND the failure-mode trigger. The "(1)…(4)" enumeration embedded in prose
  competes with the arrow chain. Splitting into three short paragraphs or one list +
  one paragraph would carry the same content with lower cognitive load.

### I-005 — Long sentence in "Producto incremental defendible" paragraph (H)
- **Severity:** H
- **Location:** `theory[0].paragraphs[2]` (source line 32; `paragraphs#2 sent=0`)
- **Words:** 51
- **FH:** 21.9 (band: *muy dificil*)
- **Evidence:**
  > "Producto incremental defendible. **Entrada:** artefactos congelados S1–S51,
  > contratos, riesgos, no-go y benchmark. **Salida:** producto reproducible, demo,
  > cards, evidencia de drill y defensa de trade-offs/contribución personal. **El gate
  > bloquea la graduación** si hay P0/P1 abiertos, PII real, dependencia no
  > reproducible, rollback no probado o afirmación sin evidencia."
- **Note:** The metrics count this as one 51-word sentence because the splitter does
  not break on `:` followed by bold text. The underlying issue is real but smaller
  than the metric suggests: the *third* bolded sentence ("El gate bloquea…") is a
  ~28-word sentence with five failure modes packed by `o`. Splitting the failure modes
  into a list would help.

### I-006 — Glossary paragraph rendered as a single 165-word block (H)
- **Severity:** H (readability + structure)
- **Location:** `theory[0].paragraphs[0]` (source line 30; `paragraphs#0 sent=0`)
- **Words (as one block):** ~165 (the metrics splitter fails because every term is
  bolded, so `**` appears between sentences and breaks the `(?<=.?!)\s+[A-Z]` rule)
- **Evidence:** The "Diccionario de la sección" paragraph contains **16 distinct
  bolded definitions** (CP-FINAL, CF-1, No-go, Bounded contexts, HITL, RAG, RPO/RTO,
  SLO, ADR, C4, Regresión S1–S52, Disaster exercise, System/model cards, Demo
  reproducible, Defensa técnica, Promoción máster) separated only by `. `
- **Pedagogical impact:** As a paragraph this is unreadable. The same content as a
  Markdown definition list (`<dl>`) or a table would be far more scannable for a
  learner who needs to look up terms while doing the capstone.

### I-007 — `jobRelevance` first sentence (43 words) and second sentence (37 words) (M)
- **Severity:** M
- **Location:** `jobRelevance` (source line 15)
- **Evidence:**
  > S1 (43w): "En equipos de plataforma y producto (fintech, retail, gobierno digital
  > en Perú y LatAm), el cierre de carrera se juega con un **portfolio defendible**:
  > demo reproducible, system/model cards, métricas con baseline y límites éticos — no
  > con un CV de soft skills genérico."
  > S2 (37w): "Esta sección integra tu **Enterprise Relationship & Operations
  > Intelligence Platform** (caso sintético multi-región: Lima, Arequipa, Cusco,
  > Piura) y solo promociona cuando 52/52, 12/12 capstones, CP-FINAL y regresión
  > completa pasan **sin compensar** CP-N4-C."
- **Pedagogical impact:** The `jobRelevance` field is the first thing many learners
  read; it currently packs audience + value prop + ethics + graduation contract in
  two long sentences. Splitting improves scanability.

### I-008 — `intro` (iDo) first sentence (45 words) (M)
- **Severity:** M
- **Location:** `iDo.intro` (source line ~322; `intro#0`)
- **Words:** 45
- **Evidence:**
  > "Ocho demos de **modelado de procedimiento** (no teatro de `print(True)`): cada
  > una calcula el predicado de CP-FINAL a partir de fixtures sintéticos `CASO-PER-052`
  > — delta CF-1, no-go, seis contexts, cadena HITL, seis capas de tests, RPO/RTO
  > medidos, guion de demo y bundle de 8."
- **Pedagogical impact:** The list of 8 sub-predicates inside an em-dash parenthetical
  is a comprehension tax on the learner.

### I-009 — `intro` (weDo) first sentence (35 words) (M)
- **Severity:** M
- **Location:** `weDo.intro` (source line ~495; `intro#1`)
- **Words:** 35
- **Evidence:**
  > "S52 · Laboratorio CP-FINAL (24 retos en tríada E1/E2/E3). **E1** repara un
  > predicado de dominio invertido; **E2** separa válido / adverso / missing; **E3**
  > enruta CONTINUE / breach / incertidumbre con el código de acción del subtema."
- **Pedagogical impact:** Three distinct exercise kinds in one sentence; a numbered
  list would be clearer.

### I-010 — Long `feedback` sentences (35–39 words) in T3-B and T4-A exercises (M)
- **Severity:** M
- **Locations:** `weDo.steps[15].feedback` (T3-B-E1) and `weDo.steps[16].feedback`
  (T3-B-E2), etc. The feedback strings commonly fuse a numerical explanation, an
  adverse-contrast clause, and a schema-fallback clause in one sentence.
- **Example (`feedback#15`, 39w):**
  > "S52-T3-B-E1: muestra con números del fixture por qué availability/SLO, backup vs
  > RPO y rollback vs RTO + restore pasan; contrasta con el adverso (p. ej. rollback
  > 120 min) que fuerza `NO_GO_RESILIENCE`; sin flag de drill → `RUN_DISASTER_EXERCISE`."
- **Pedagogical impact:** Feedback is *reactive* — the learner reads it after a failed
  attempt. Splitting the explanation, the contrast, and the fallback into 2–3 short
  sentences aids the failure-to-learning loop.

### I-011 — Spanish acronym plural: `APIs` → `API` (M, RAE rule)
- **Severity:** M (typography / RAE norm)
- **Locations:** All instances of `APIs` in prose (theory paragraphs and youDo
  requirements). LanguageTool flags this with rule `SIGLAS` and message "El plural de
  las siglas no se marca gráficamente."
- **Evidence (5 occurrences found by LT):**
  - `paragraphs#11` (line 127): "Se integran por **APIs y eventos versionados**"
  - `paragraphs#12` (line 128): "incluye relationship), **APIs/eventos** versionados"
  - `youDo.requirements[1]` (line ~1700): "vía **APIs/eventos** y human workflow"
  - `theory[0].paragraphs[0]` dictionary: "integradas por **API/evento**, no por DB compartida"
    (this one is already correct: `API/evento`)
- **RAE rule:** *Diccionario panhispánico de dudas* (2005), s.v. "siglas": the plural
  of acronyms written in capitals is not marked with `-s` ("las API", "las ONG").
- **Recommended fix:** Replace every `APIs` with `API` (when used as a plural noun) or
  `API/eventos` (in the slash compounds).

### I-012 — Abbreviation `vs` should be `vs.` (L, Spanish typography)
- **Severity:** L
- **Locations:** Multiple uses of `vs` without a period in: `paragraphs#21` (T3-B
  theory), `feedback#15` (T3-B-E1), `portfolioNote`, `youDo.requirements`. LT rule
  `PUNTO_EN_ABREVIATURAS` flags each.
- **Evidence:**
  > "edad de backup **vs** RPO", "rollback **vs** RTO", "mejora **vs** baseline"
- **Fix:** Use `vs.` (with period) consistently, or replace with `contra` for
  readability.

### I-013 — `auto-etiquetado` → `autoetiquetado` (L, RAE preference)
- **Severity:** L
- **Location:** `paragraphs#1` (line 31) "sin auto-etiquetar fraude"; also
  `learningOutcomes[3]` (line 20) "sin auto-etiquetar fraude ni parentesco".
- **LT rule:** `AUTO_NO_SEPARADO` — "Probablemente se escribe junto."
- **RAE rule:** The prefix `auto-` is joined without a hyphen when it precedes a word
  (e.g., *autoetiquetado*, *autoevaluación*). The hyphenated form is deprecated.
- **Note:** The section also uses `auto-fraude`, `auto-riesgo`, `auto-aprobación`,
  `auto-risk-decision` — the last is a code identifier (keep as-is in code; the prose
  forms should be `autofraude`, `autorriesgo`, `autoaprobación`).

### I-014 — "lista stakeholders vivos" imperative/adjective ambiguity (M)
- **Severity:** M (grammar / clarity)
- **Location:** `paragraphs#6` (line 67), inside the procedure list for T1-A:
  > "Procedimiento de revalidación: (1) lista stakeholders vivos y jobs actuales; …"
- **LT rule:** `AGREEMENT_ADJ_NOUN` — "Posible error de concordancia."
- **Cause:** "lista" is read by the reader (and LT) as the feminine adjective
  ("ready") rather than the imperative of *listar* ("make a list"). The following
  word "stakeholders" is English (gender-neutral), so the agreement check fails.
- **Fix:** Replace "lista stakeholders vivos" with "enumera los stakeholders vivos" or
  "haz una lista de stakeholders vivos".

### I-015 — "stakeholders, jobs y métricas actualizados" mixed-gender adjacency (M)
- **Severity:** M
- **Location:** `paragraphs#0` (line 30, dictionary) — "**CF-1 revalidación:**
  stakeholders, jobs y métricas actualizados."
- **LT rule:** `AGREEMENT_POSTPONED_ADJ` — suggests `actualizadas` to agree with
  `métricas`.
- **Cause:** "stakeholders" and "jobs" are English nouns (no Spanish gender);
  "métricas" is feminine. Spanish mixed-gender groups default to masculine plural
  ("actualizados"), which is grammatically defensible. But because the only Spanish
  noun in the series is feminine, the RAE preference for *proximity agreement* makes
  "actualizadas" more idiomatic.
- **Fix (preferred):** Rewrite as "stakeholders, jobs y métricas **actualizadas**"
  (proximity agreement with the closest noun).
- **Alternative:** Rewrite as "stakeholders, jobs y métricas actualizados (matriz
  viva)" keeping the masculine as the default for a mixed list with English nouns.

### I-016 — Gender of loanword "El checklist" (L)
- **Severity:** L
- **Location:** `portfolioNote` (line ~1770) — "El checklist inicia en BLOCKED por
  diseño"; also `youDo.starterCode` and `weDo` instructions.
- **LT rule:** `AGREEMENT_DET_NOUN` — suggests "La checklist / Las checklists".
- **Cause:** "Checklist" is an English loanword; Spanish assigns gender by analogy.
  RAE/Fundéu recommend feminine ("la lista de verificación" / "la checklist") by
  analogy with *lista*, but masculine usage is widespread in tech.
- **Fix:** Either consistently feminine ("La checklist inicia en BLOCKED…") or replace
  with the Spanish calque "La lista de verificación inicia en BLOCKED…".

### I-017 — Soft capitalisation inconsistency: `LatAm` vs `LATAM`/`Latam` (L)
- **Severity:** L
- **Location:** `jobRelevance` (line 15) — "Perú y LatAm".
- **LT finding:** MORFOLOGIK suggests "LATAM" or "Latam".
- **Cross-section check:** Section 51 uses "LATAM" (line 14: "fintechs y ops digitales
  en Perú y LATAM").
- **Fix:** Adopt the ALL-CAPS form "LATAM" to match Section 51 and Fundéu guidance
  for acronyms of acronyms.

### I-018 — "intake" as a Spanish-flowing noun (L)
- **Severity:** L (terminology)
- **Location:** Theory paragraphs throughout, e.g., `paragraphs#11` (line 127):
  > "Seis contexts: intake, er, relationship, triage, reporting, copilot"
- **Cause:** The bounded-context names are code identifiers and could legitimately be
  left in English. But when they appear inside Spanish sentences ("intake recibe el
  caso"), they read as anglicisms. Fundéu accepts italicising foreign terms used as
  common nouns.
- **Fix (optional):** Either italicise the context names in prose (`*intake* recibe el
  caso`) or wrap them in code spans (`` `intake` recibe el caso``) consistently.

### I-019 — Numerical/typographic: range "15–20 min" vs "≤10 min" inconsistency (L)
- **Severity:** L
- **Location:** `paragraphs#28` (line ~290, T4-B closing) and `paragraphs#23` (line
  ~260, T4-A) — both use "demo ≤10 min" and "15–20 min". The en-dash "–" is correctly
  used in "15–20 min" but the section also uses "16–24 h" (en-dash) and "S1–S52"
  (en-dash). All consistent. **No issue.** *Kept for completeness of the registry.*

### I-020 — Self-check option string is a single word/short phrase without terminal punctuation (L)
- **Severity:** L (consistency)
- **Locations:** Many `selfCheck.questions[].options[]` strings are short phrases
  without terminal punctuation ("un print sin assert ni versión", "una captura de
  pantalla sin fuente"). This is acceptable for multiple-choice options but is flagged
  by the heuristic `no_terminal_punct`.
- **Fix (optional):** No action — multiple-choice options conventionally omit terminal
  punctuation.

### I-021 — `iDo.intro` reference to `print(True)` reads oddly (L)
- **Severity:** L
- **Location:** `iDo.intro` (line ~322) — "(no teatro de `print(True)`)"
- **Cause:** `print(True)` is used metaphorically for "fake demo that hard-codes the
  pass condition". This is a teaching-device phrase used across the course (cf. S51
  uses the same idiom), so it is consistent rather than a defect.
- **Fix:** None required; flag as intentional course voice.

### I-022 — Inconsistent capitalisation of "iDo / weDo / youDo" vs "I Do / We Do / You Do" (L)
- **Severity:** L
- **Location:** The section uses camelCase `iDo`, `weDo`, `youDo` in prose (e.g.,
  `paragraphs#4`, `iDo.intro`, `weDo.intro`). The course-level `COURSE_META`
  uses "I Do / We Do / You Do" (Title Case) in `description`.
- **Cause:** The camelCase form mirrors the TS object keys (`iDo:`, `weDo:`, `youDo:`)
  — it is an in-joke for developers reading the source, but it reads oddly in
  learner-facing prose. However, this is a course-wide convention used since S01, so
  changing it in S52 alone would create inconsistency.
- **Fix:** Course-wide decision; out of scope for S52 audit.

### I-023 — `<em>` tag in dictionary `*evidence bundle de 8*` is bolded inconsistently (L)
- **Severity:** L
- **Location:** `paragraphs#4` (line 34) — "evidence bundle de 8*." (closing asterisk
  with no opening asterisk in the same paragraph).
- **Cause:** This is a markdown rendering artifact — the source line actually contains
  the closing `*` of an italic span that started earlier. Reviewing the source line
  shows: "y el **bundle de 8 artefactos**." (correct bold), so the closing `*` is
  spurious in the metric's text extraction. Not a real source bug. *Kept for
  completeness.*

### I-024 — `theory[0].paragraphs[0]` (dictionary) uses `**bold**` for *every* term (L)
- **Severity:** L (style)
- **Evidence:** The paragraph bolds every glossary term: "**CP-FINAL:**", "**CF-1
  revalidación:**", "**No-go:**", "**Bounded contexts:**", "**HITL:**", "**RAG:**",
  "**RPO/RTO:**", "**SLO:**", "**ADR:**", "**C4:**", "**Regresión S1–S52:**",
  "**Disaster exercise:**", "**System/model cards:**", "**Demo reproducible:**",
  "**Defensa técnica:**", "**Promoción máster:**".
- **Cause:** When *everything* is emphasised, nothing is. Markdown best practice is
  to use bold sparingly. The pedagogical intent is "make the term stand out so the
  learner can scan the glossary" — but a definition list or table would serve that
  intent better.

### I-025 — `requirements[5]` lists the 8 artefacts inline (M)
- **Severity:** M
- **Location:** `youDo.requirements[5]` (line ~1705): "Incluye los 8 artefactos:
  architecture (C4), README, ADR, system_card, model_card, LICENSE, demo_video,
  defense_notes."
- **Cause:** A list of 8 items is embedded in prose. Learners are expected to
  cross-check this list against their own portfolio; a bulleted list is far more
  scannable.
- **Fix:** Convert to a bulleted list (the surrounding requirements array could
  include a sub-list).

### I-026 — `requirements[8]` schedule is a single sentence with 4 semicolon-separated phases (M)
- **Severity:** M
- **Location:** `youDo.requirements[8]`: "Hitos 80 h (orientativo): sem. 1–2
  CF-1/no-go; sem. 3–5 contexts+HITL; sem. 6–7 verificación+DR; sem. 8–9
  demo+bundle+defensa."
- **Cause:** Same content is also in `paragraphs#4` (I-001). Repeating it as a single
  sentence in requirements compounds the readability cost. Consider a small table.

### I-027 — Resource note for GitHub URL is generic (L)
- **Severity:** L
- **Location:** `resources.docs[7]` (line ~1905): `{ label: "PyArcana — repositorio
  del curso (CP-FINAL)", url: "https://github.com/PillB/pyarcana", note: "Código,
  demos y regresión S1–S52 del capstone final" }`
- **Cause:** The note is acceptable but doesn't tell the learner *where* in the repo
  the S52 artefacts live. A direct deep link (`/tree/main/src/lib/course/sections/`)
  would be more useful.

### I-028 — `learningOutcomes[0]` mentions "matriz viva stakeholder/job/métrica" (L)
- **Severity:** L
- **Location:** `learningOutcomes[0]` (line 17): "Revalidar CF-1 con matriz viva
  stakeholder/job/métrica y baseline sintético congelado (evidencia: change_log +
  fixtures)"
- **Cause:** Uses slash-separated compound `stakeholder/job/métrica`. Acceptable as a
  learning-outcome label, but the same phrase appears in many places; consider
  standardising as "stakeholders, jobs y métricas" in prose and as
  `stakeholder_job_metric` in code.

### I-029 — Inconsistent use of accents on "rol/roles" vs English "owner" (L)
- **Severity:** L
- **Location:** Throughout the section, "owner" is used as a Spanish-flowing noun
  ("cada riesgo en el registro lleva owner").
- **Cause:** Fundéu accepts "owner" as a loanword in tech contexts but recommends
  Spanish "responsable" or "dueño" in formal writing. The section already uses
  "responsable" in `youDo.requirements[7]` ("Registra riesgo residual,
  responsable, criterio de rollback…"). Inconsistent.
- **Fix:** Standardise on "responsable" in prose; keep "owner" only inside code
  identifiers (`risks_with_owner`).

### I-030 — Inconsistent number style: "≤10 min" vs "≤ 10 min" (L)
- **Severity:** L
- **Location:** Many `≤10 min` and `≤ 10 min` instances. Spot check:
  `paragraphs#4`: "demo ≤10 min" (no space); `paragraphs#23`: "demo ≤10 min"
  (no space); `iDo.steps[7].description`: "guion de demo ≤10 min" (no space). All
  consistent. **No issue.** *Kept for completeness.*

### I-031 — `weDo.intro` uses `**E1**`, `**E2**`, `**E3**` inline bold (L)
- **Severity:** L
- **Location:** `weDo.intro` (line ~495).
- **Cause:** Bold labels inside a parenthetical list — readable but adds visual noise.
  The same E1/E2/E3 distinction appears in `instruction` strings for every exercise
  with the prefix `S52-T*-E* · …`, so the learner already sees the triple structure.
  No fix needed.

---

## 4. Meta-Leak Report

The meta-leak detector (rules from `_GRAMMAR_SUBPLAN.md` plus a manual review) found
**zero genuine developer/AI-to-developer leaks** in Section 52. The three candidate
hits were reviewed and confirmed as legitimate learner-facing content:

| Detected pattern | Location | Verdict |
|---|---|---|
| `\bdraft\b` | `paragraphs#16` line 159: "prepara draft, cita y deja decidir al humano" | **False positive** — "draft" is the English loanword for the RPA *draft* artefact in the HITL chain (`rpa_prepares_draft`). Used consistently in code and prose. |
| `\bTODO\b` | `paragraphs#18` line 188: "no un print de «todo ok»" | **False positive** — "todo ok" is the Spanish phrase "todo [está] bien", not the developer `TODO` tag. The LT regex `\bTODO\b` matches case-insensitively but the source actually has lowercase "todo". |
| `\bdraft\b` | `hints#19` line 961: "proponer → priorizar → draft → citar → humano decide" | **False positive** — same HITL chain; "draft" is the action noun. |

A manual scan of the source for additional leak patterns (`FIXME`, `XXX`, `pendiente`,
`rehacer`, `borra esto`, `placeholder`, `moved from`, `traído de`, `traer de`, `sección
anterior`, `sección siguiente`, `next section`, `previous section`, `internal note`,
`private note`, `WIP`, `DRAFT`, `[author`, `[editor`, `revisar:`, `añadir:`) returned
**no genuine leaks**. The starter code uses `# DEFECT: …` and `# Contrato: …` comments
intentionally as learner instructions; these are pedagogical scaffolding, not dev residue.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

Section 52 implements the I Do / We Do / You Do scaffold **with high fidelity** and at
the right grain size for a Master capstone:

- **I Do (8 demos).** Each of the 8 theory subsections has a paired iDo demo that
  *computes the same predicate* the theory introduces. The demos are not "print(True)"
  theatre — they take synthetic `CASO-PER-052-*` fixtures and return `PASS` /
  `REOPEN_CF1` / `DECLARE_NO_GO` / `STOP_INTEGRATION_RELEASE` /
  `BLOCK_AUTOMATED_RISK_DECISION` / `BLOCK_FINAL_ON_P0_P1` / `NO_GO_RESILIENCE` /
  `REJECT_UNSUPPORTED_PORTFOLIO_CLAIM` / `BLOCK_INCOMPLETE_EVIDENCE_BUNDLE` based on
  real boolean logic. Each demo's `why` field explains *why* the predicate is what it
  is and *what the weDo inverts*. Excellent modelling.
- **We Do (24 exercises).** The 3-per-topic triple (E1 guided / E2 independent / E3
  transfer) is a textbook application of **gradual release of responsibility** (Pearson
  & Gallagher, 1983) and **deliberate practice** (Ericsson). E1 fixes a *defective
  predicate* (the starter has the boolean inverted); E2 introduces three branches
  (valid/adverse/missing) and the `MISSING:field` schema-fallback; E3 adds the
  uncertainty-vs-breach distinction (CONTINUE / breach-code / fallback-code). This is
  the cleanest 3-stage transfer progression in the audited sections.
- **You Do (capstone).** The youDo is a genuine 80 h assembly project, not a drill.
  The `portfolioNote` explicitly tells the learner the difference ("weDo entrenó los
  códigos de acción; este youDo es el ensamblaje real del producto de CV"). The
  `starterCode` is a 100-line readiness checklist that *starts BLOCKED on purpose*
  and refuses to flip to READY until 14 conditions are met with real artefact paths.
  This is a masterclass in *behavioural gating*: the learner cannot fool themselves.
- **Self-check (5 questions).** Each question tests one subtopic (T1-A, T2-A, gate,
  T3-B, T4-A) with a plausible distractor set. Explanations are short and
  actionable.

### 5.2 Connective tissue & narrative flow

The section uses a consistent **"Puente a T*-X"** connector at the end of each theory
subsection:

- "Puente a T1-B: con la matriz viva ya puedes firmar constraints y no-go."
- "Puente a T2: con no-go firmado ya puedes mapear los seis bounded contexts sin
  diluir límites éticos."
- "Puente a T2-B: con los contexts cableados, la cadena HITL (ER→triage→RPA→RAG→humano)
  cierra el loop de decisión sensible sin auto-fraude."
- "Puente a T3: el stack ya es auditable; ahora la matriz de tests debe congelarlo."
- "Puente a T3-B: con P0/P1 en cero, toca demostrar resiliencia con reloj."
- "Puente a T4: con DR medido ya puedes narrar demo (baseline→resultado) y empaquetar
  el evidence bundle de 8."
- "Puente a T4-B: la narrativa lista se empaqueta en el evidence bundle de 8
  artefactos…"

This is strong **discourse coherence** — each topic explicitly hands off to the next.
The narrative thread stated in `paragraphs#3` ("CF-1 delta → no-go firmado → mapa de 6
contexts → cadena HITL → matriz de 6 capas → drill RPO/RTO → demo ≤10 min → evidence
bundle de 8") is *actually followed* by the 8 theory subsections in order. This is a
gold-standard example of anaphora-as-roadmap.

### 5.3 Cognitive load & progressive disclosure

The section discloses complexity in layers:

1. The **opening dictionary** defines every acronym before it is used (CP-FINAL, CF-1,
   No-go, Bounded contexts, HITL, RAG, RPO/RTO, SLO, ADR, C4, Regresión S1–S52,
   Disaster exercise, System/model cards, Demo reproducible, Defensa técnica,
   Promoción máster).
2. **T1** (revalidate CF-1, sign no-go) is the simplest layer; T2 (contexts, HITL)
   adds architecture; T3 (tests, DR) adds operational depth; T4 (demo, bundle) adds
   communication depth.
3. **E1 → E2 → E3** progressively adds branches: E1 has 2 outcomes, E2 has 3, E3 has
   3-with-uncertainty-routing.

This is correct **scaffolding** (Wood, Bruner & Ross, 1976) and matches the
**Worked-example effect** (Sweller, 2006) — the iDo demos are worked examples that
reduce extraneous load before the weDo exercises.

**Cognitive load concern:** The first theory paragraph (the dictionary) is information
density ~165 words of bolded terms. Even with progressive disclosure in T1–T4, the
opening hits the learner with 16 acronyms at once. Splitting the dictionary into a
definition list, or moving some less-critical terms (C4, ADR) into the relevant T3/T4
subsections where they are first used, would lower the front-loaded load.

### 5.4 Exercise & exam quality

- **Starter → solution alignment.** Every E1 starter has the *inverted* predicate; the
  solution fixes the boolean while preserving the data and the `assert`. This is
  deliberate-practice scaffolding at its best.
- **Edge cases.** Each exercise lists 3 edge cases (e.g., "falta `baseline_frozen`",
  "fixture adverso: solo ops, jobs=0, métricas vacías, baseline no frozen",
  "CASO-PER-052-1A es sintético"). The third edge case is a *pedagogical meta-note*
  that reinforces that the data is synthetic — a nice touch for the ethics frame.
- **Tests.** Each exercise specifies the exact output string ("imprime `S52-T1-A PASS`
  y el assert booleano pasa"). This makes the exercises self-grading and reduces the
  "did I solve it?" ambiguity.
- **Self-check.** 5 questions cover T1-A, T2-A, the global gate, T3-B numerical
  reasoning, and T4-A honesty contract. The distractors are *plausible* (e.g., "una
  captura de pantalla sin fuente" — a real anti-pattern) rather than obvious. The
  explanations cite the subtopic ID.

### 5.5 Consistency with the overall roadmap

Section 52 is consistent with:

- **COURSE_META** (52 sections, 4 phases, 1,040 h, es-PE).
- **Phase 3 metadata** (sections 40–52, "Master", 320 h).
- **Section 51** (also uses the "Diccionario de la sección" + 8 theory subsections +
  8 iDo demos + 24 weDo exercises + 1 youDo + 5 selfCheck + resources pattern).
  S52 explicitly references S51 in `paragraphs#0` ("integra S01–S51") and
  `jobRelevance` ("sin compensar CP-N4-C"), maintaining the cross-capstone gate
  narrative.
- **Capstone IDs.** `CASO-PER-052` follows the same pattern as `CASO-MOQ-051`
  (Section 51), `CASO-LIM-XXX`, etc. used throughout the course. Multi-region
  synthetic case (Lima, Arequipa, Cusco, Piura) is the right finale.
- **Pedagogical voice.** Same idioms ("no teatro de `print(True)`", "Puente a T*-X",
  "ensamblaje real", "alfabetización de gate") as the rest of Phase 3.

### 5.6 Comparison with best-in-class external materials

| Dimension | PyArcana S52 | External best-in-class | Verdict |
|---|---|---|---|
| **Capstone integrator** | Integrates 12 capstones + 51 prior sections into one platform | MIT 6.100L final project; CS50P final project; Coursera capstones | S52 is **broader** (whole-curriculum integration) but **less deep** than a pure capstone-only course (which is by design — S52 is a 1-section finale, not a 4-week capstone course). |
| **Ethics / governance** | HITL, no-PII, no-auto-fraud, fail-closed gates, no-compensation rule for CP-N4-C | NIST SSDF, Google SRE Book (DR), C4 model | S52 is **at or above** industry standard for ethics framing. The "no compensa CP-N4-C" rule is unusual and pedagogically strong. |
| **System card / model card** | Listed as artefacts in the evidence bundle | Google's "Model Cards for Model Reporting" (Mitchell et al., 2019); HuggingFace Model Cards | S52 cites the artefact type but does not teach *how* to write a model card. Sufficient for a capstone integrator; deeper coverage belongs in S33 (advanced models) or S48 (AI governance). |
| **Disaster recovery drill** | RPO/RTO measured, restore verified, drill with reloj | Google SRE Book Ch. 11 (Disaster Recovery) | S52 is consistent with SRE practice. The explicit anti-pattern "tabletop verbal sin números no cuenta" is exactly the SRE guidance. |
| **Demo narrative** | "Problema → baseline → decisión → métrica → límite" in ≤10 min | STAR method, Amazon 6-pager narrative | S52's 5-beat demo script is **clearer and more engineering-specific** than STAR. |

---

## 6. Grammatical Improvements & Rewriting Report (paragraph-by-paragraph)

For each learner-facing surface, the table gives: (a) the verbatim source text; (b) the
heuristic metric (FH, INFLESZ, words-per-sentence); (c) the proposed rewrite. Re-writes
preserve all technical content and only restructure for readability + Spanish
typography/RAE norms. GitHub-style diffs are in §7.

### 6.1 `jobRelevance` (line 15)

**Before (3 sentences; FH mean ~50):**
> "En equipos de plataforma y producto (fintech, retail, gobierno digital en Perú y
> LatAm), el cierre de carrera se juega con un **portfolio defendible**: demo
> reproducible, system/model cards, métricas con baseline y límites éticos — no con un
> CV de soft skills genérico. Esta sección integra tu **Enterprise Relationship &
> Operations Intelligence Platform** (caso sintético multi-región: Lima, Arequipa,
> Cusco, Piura) y solo promociona cuando 52/52, 12/12 capstones, CP-FINAL y regresión
> completa pasan **sin compensar** CP-N4-C. En una entrevista senior te pedirán el
> trade-off, el reloj del drill y qué aportaste tú."

**After (4 sentences; FH mean ~65):**
> "En equipos de plataforma y producto (fintech, retail, gobierno digital en Perú y
> LATAM), el cierre de carrera se juega con un **portfolio defendible**: demo
> reproducible, system/model cards, métricas con baseline y límites éticos. No basta
> con un CV de soft skills genérico. Esta sección integra tu **Enterprise Relationship
> & Operations Intelligence Platform** (caso sintético multi-región: Lima, Arequipa,
> Cusco, Piura) y solo promociona cuando 52/52, 12/12 capstones, CP-FINAL y la
> regresión completa pasan **sin compensar** CP-N4-C. En una entrevista senior te
> pedirán el trade-off, el reloj del drill y qué aportaste tú."

Changes: split S1 (43w→20w+11w); `LatAm` → `LATAM` (I-017); "regresión completa" → "la
regresión completa" (article restoration).

### 6.2 `theory[0].paragraphs[0]` — "Diccionario de la sección" (line 30)

**Before:** one 165-word paragraph with 16 bolded definitions.

**After (structured as a definition list, not flowing prose):**

```
**Diccionario de la sección** (léelo antes de T1).

- **CP-FINAL:** capstone de integración del currículo completo.
- **CF-1 revalidación:** stakeholders, jobs y métricas actualizadas.
- **No-go:** decisión de no desplegar si riesgo o evidencia faltan.
- **Bounded contexts:** fronteras intake, ER, relationship, triage, reporting, copilot
  (integradas por API/evento, no por DB compartida).
- **HITL:** human-in-the-loop — humano decide en riesgos sensibles.
- **RAG:** retrieval-augmented generation con citas.
- **RPO/RTO:** Recovery Point/Time Objective (cuánto dato y tiempo puedes perder).
- **SLO:** Service Level Objective.
- **ADR:** Architecture Decision Record.
- **C4:** modelo de arquitectura (contexto→contenedores→componentes→código).
- **Regresión S1–S52:** smoke de contratos y demos.
- **Disaster exercise:** backup/rollback probados con reloj.
- **System/model cards:** límites y ownership.
- **Demo reproducible:** un comando + fixtures sintéticos.
- **Defensa técnica:** trade-offs y contribución personal.
- **Promoción máster:** 52/52 + 12/12 + CP-FINAL + regresión sin P0/P1; **no compensa**
  CP-N4-C.
```

Pedagogical rationale: a Markdown bullet list with bolded terms is rendered as a
scannable list on the live site. The learner can Cmd-F any acronym and see its
definition in isolation. (I-006, I-024)

### 6.3 `theory[0].paragraphs[1]` — "Esta sección es el cierre senior-master" (line 31)

**Before (4 sentences; FH mean ~50):**
> "Esta sección es el **cierre senior-master**: integra S01–S51 y los **12 capstones**
> en la **Enterprise Relationship & Operations Intelligence Platform** (producto del
> CV, no un curso de soft skills). El caso `CASO-PER-052` (plataforma nacional
> sintética multi-región: Lima, Arequipa, Cusco, Piura — datos inventados) corre sin
> credenciales, sin PII real y sin auto-etiquetar fraude. Graduación exige 52/52 +
> 12/12 + CP-FINAL + regresión — **sin compensar** CP-N4-C. Aquí **carrera
> profesional** significa **portfolio técnico defendible** (demo, métricas, límites y
> contribución personal)."

**After:** Same content, with `auto-etiquetar` → `autoetiquetar` (I-013), and "Graduación
exige" → "La graduación exige" (article restoration):

> "Esta sección es el **cierre senior-master**: integra S01–S51 y los **12 capstones**
> en la **Enterprise Relationship & Operations Intelligence Platform** (producto del
> CV, no un curso de soft skills). El caso `CASO-PER-052` (plataforma nacional
> sintética multi-región: Lima, Arequipa, Cusco, Piura — datos inventados) corre sin
> credenciales, sin PII real y sin autoetiquetar fraude. La graduación exige 52/52 +
> 12/12 + CP-FINAL + regresión — **sin compensar** CP-N4-C. Aquí **carrera
> profesional** significa **portfolio técnico defendible** (demo, métricas, límites y
> contribución personal)."

### 6.4 `theory[0].paragraphs[2]` — "Producto incremental defendible" (line 32)

**Before (3 sentences; S3 is 51w with 5 failure modes joined by `o`):**

> "Producto incremental defendible. **Entrada:** artefactos congelados S1–S51,
> contratos, riesgos, no-go y benchmark. **Salida:** producto reproducible, demo,
> cards, evidencia de drill y defensa de trade-offs/contribución personal. **El gate
> bloquea la graduación** si hay P0/P1 abiertos, PII real, dependencia no reproducible,
> rollback no probado o afirmación sin evidencia. Cuando ese gate pasa en serio — con
> reloj, baseline y bundle de 8 — el cierre no es castigo: es **celebración legítima**
> de un portfolio que un revisor externo puede ejecutar y cuestionar."

**After (S3 split into a list):**

> "Producto incremental defendible.
>
> **Entrada:** artefactos congelados S1–S51, contratos, riesgos, no-go y benchmark.
> **Salida:** producto reproducible, demo, cards, evidencia de drill y defensa de
> trade-offs/contribución personal.
>
> **El gate bloquea la graduación** si se da alguna de estas condiciones:
>
> - P0 o P1 abiertos
> - PII real
> - dependencia no reproducible
> - rollback no probado
> - afirmación sin evidencia
>
> Cuando ese gate pasa en serio — con reloj, baseline y bundle de 8 — el cierre no es
> castigo: es **celebración legítima** de un portfolio que un revisor externo puede
> ejecutar y cuestionar."

### 6.5 `theory[0].paragraphs[3]` — "Cómo se ensamblan los 12 capstones" (line 33)

**Before (67w sentence + 28w sentence):** see I-002.

**After (3 sentences + arrow chain as a list):**

> "Cómo se ensamblan los 12 capstones (grafo de dependencia, no basurero de repos
> sueltos):
>
> - Fundaciones de datos/ETL/entidad (ER) alimentan **intake + er + relationship**.
> - Modelos, evals y RAG alimentan **reporting + copilot** siempre bajo HITL.
> - RPA y operación alimentan **triage** y el paquete de DR.
>
> Cada CP-N* aporta un artefacto o contrato reutilizable, pero **ningún capstone
> parcial compensa** un CP-N4-C fallido ni un P0 abierto.
>
> El hilo narrativo de defensa es:
>
> 1. CF-1 delta
> 2. no-go firmado
> 3. mapa de 6 contexts
> 4. cadena HITL
> 5. matriz de 6 capas
> 6. drill RPO/RTO
> 7. demo ≤10 min
> 8. evidence bundle de 8"

### 6.6 `theory[0].paragraphs[4]` — "Orden de ensamblaje" + "Plan 80 h" (line 34)

**Before (3 sentences; the second is 79w — I-001):** see I-001.

**After (one short sentence + table for the plan + one paragraph for the method):**

> "Orden de ensamblaje (no saltes etapas): **T1** revalida CF-1 y firma no-go → **T2**
> cablea seis contexts + HITL → **T3** congela verificación y mide DR → **T4**
> empaqueta demo/CV y el bundle de 8 artefactos.
>
> Plan 80 h orientativo:
>
> | Semanas | Fase | Horas |
> |---|---|---|
> | 1–2 | CF-1/no-go | ~16 h |
> | 3–5 | Integración contexts/HITL y contract tests | ~24 h |
> | 6–7 | Evals/red team/SLO/drill medido | ~16 h |
> | 8–9 | Demo + evidence bundle + defensa oral | ~16–24 h |
>
> iDo modela el procedimiento con fixtures; weDo entrena **alfabetización de gate**
> (qué código emitir ante válido/adverso/ausente); youDo es el **ensamblaje real de
> 80 h** — API, regresión S1–S52, drill y bundle. Stack: **stdlib** + artefactos del
> curso."

Note: `APIs` → `API` per I-011.

### 6.7 `theory[3].paragraphs[1]` — T2-A "Checklist de integración" (line 128)

**Before (49w sentence):** see I-004.

**After (numbered list + arrow chain as separate list + failure clause):**

> "Checklist de integración (ensamblaje real, no solo checklist mental):
>
> 1. Dibuja el mapa de los seis contexts y el dueño de cada uno.
> 2. Versiona OpenAPI y event schemas (`job.finished`, `case.updated` como mínimo).
> 3. Prohíbe `shared_database` entre contexts.
> 4. Exige ≥10 contract tests verdes que fallen si el productor cambia un campo.
>
> Flujo típico sintético: intake recibe el caso → er propone identidad → relationship
> actualiza grafo → triage prioriza → reporting emite métricas → copilot cita con RAG.
>
> Si falta mapa o tests, emite `MAP_BOUNDED_CONTEXTS` o `STOP_INTEGRATION_RELEASE`."

### 6.8 `theory[1].paragraphs[1]` — T1-A procedure (line 67) — imperative ambiguity fix

**Before (I-014):** "(1) lista stakeholders vivos y jobs actuales"

**After:** "(1) enumera los stakeholders vivos y los jobs actuales"

### 6.9 `paragraphs#11` (T2-A theory, line 127) — `APIs` → `API`

**Before:** "Se integran por **APIs y eventos versionados**; **contratos y ownership**
evitan una base compartida como acoplamiento oculto."

**After:** "Se integran por **API y eventos versionados**; **contratos y ownership**
evitan una base compartida como acoplamiento oculto."

(Also: in `theory[3].paragraphs[2]` line 129 and `youDo.requirements[1]` line ~1700.)

### 6.10 `youDo.portfolioNote` (line ~1770) — long sentence + `vs` period

**Before (64w sentence — I-003):** see I-003.

**After:**

> "Evidencia de CP-FINAL · plataforma integral defendible: baseline TTR (u otra
> métrica), decisión, pruebas, resultado medido, RPO/RTO numéricos, rollback y riesgo
> residual.
>
> El checklist inicia en BLOCKED por diseño. READY exige:
>
> - hitos 80 h completos
> - 6 contexts cableados (incluyendo relationship)
> - eventos declarados
> - HITL
> - drill con reloj (availability/SLO/RPO/RTO + restore verificado)
> - paths de los 8 artefactos
> - guion de defensa
> - regresión S1–S52
> - mejora vs. baseline
> - contribución personal explícita
>
> No se aprueba volteando booleans. weDo entrenó los códigos de acción; este youDo es
> el ensamblaje real del producto de CV."

(`vs` → `vs.` per I-012.)

### 6.11 `weDo.steps[15].feedback` (T3-B-E1, line ~1240) — split feedback

**Before (39w):** see I-010.

**After (3 sentences):**

> "S52-T3-B-E1: muestra con números del fixture por qué pasan availability/SLO, backup
> vs. RPO y rollback vs. RTO + restore. Contrasta con el adverso (p. ej. rollback 120
> min) que fuerza `NO_GO_RESILIENCE`. Sin flag de drill, emite `RUN_DISASTER_EXERCISE`."

### 6.12 `weDo.intro` (line ~495) — split triple-clause sentence

**Before (35w — I-009):** see I-009.

**After:**

> "S52 · Laboratorio CP-FINAL (24 retos en tríada E1/E2/E3).
>
> - **E1** repara un predicado de dominio invertido.
> - **E2** separa válido / adverso / missing.
> - **E3** enruta CONTINUE / breach / incertidumbre con el código de acción del
>   subtema.
>
> Fixtures sintéticos multi-región (`CASO-PER-052-*`). Estos drills no sustituyen el
> build de 80 h: entrenan **alfabetización de gate** — qué emitir cuando CF-1, no-go,
> contexts, HITL, P0/P1, DR o portfolio fallan. El **youDo** es el ensamblaje real:
> cablear 6 contexts (con relationship), regresión S1–S52, disaster drill con reloj,
> demo ≤10 min y evidence bundle de 8. Orden T1→T4; no marques READY si milestones,
> paths del bundle o contribución personal son teatro."

### 6.13 `iDo.intro` (line ~322) — split parenthetical

**Before (45w — I-008):** see I-008.

**After:**

> "Ocho demos de **modelado de procedimiento** (no teatro de `print(True)`). Cada una
> calcula el predicado de CP-FINAL a partir de fixtures sintéticos `CASO-PER-052`,
> cubriendo: delta CF-1, no-go, seis contexts, cadena HITL, seis capas de tests,
> RPO/RTO medidos, guion de demo y bundle de 8. Observa el *cómo se decide*; el weDo
> te pide reparar el mismo contrato cuando llega roto; el youDo ensambla la plataforma
> real en ~80 h."

### 6.14 Self-check questions

The 5 self-check questions are well-formed. No changes recommended except a minor
typography pass: in `selfCheck.questions[1].options[3]` ("borrar el context
relationship para simplificar el monólito") the word "context" is in singular where
"el context relationship" should be "el context *relationship*" or "el contexto
*relationship*". Optional italics for the English context name.

### 6.15 youDo.requirements[5] — list of 8 artefacts (I-025)

**Before:** "Incluye los 8 artefactos: architecture (C4), README, ADR, system_card,
model_card, LICENSE, demo_video, defense_notes."

**After:** keep the sentence as an intro, then render as a bulleted list:

> "Incluye los 8 artefactos del evidence bundle:
>
> - `architecture` (modelo C4)
> - `README`
> - `ADR` (Architecture Decision Records)
> - `system_card`
> - `model_card`
> - `LICENSE`
> - `demo_video`
> - `defense_notes`"

### 6.16 Aggregate redaction metrics (post-fix estimate)

After applying the proposed rewrites:

| Metric | Before | After (estimated) |
|---|---|---|
| Sentences > 45 words | 7 | 0 |
| Sentences 32–45 words | 9 | 4 |
| Mean words / sentence (prose) | 13.8 | ~10.5 |
| Mean FH (prose) | 66.4 | ~70 |
| LT real findings (APIs, vs., auto-) | ~12 | 0 |
| Glossary block as 1 paragraph | yes | no (list) |

---

## 7. Proposed GitHub-style Diffs

Diffs are against `src/lib/course/sections/s52-career-strategy.ts`. Line numbers are
approximate (taken from the source). All diffs are *proposed* — none are applied.

### Diff 1 — `jobRelevance` (I-007, I-017)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:14 @@
   jobRelevance:
-    "En equipos de plataforma y producto (fintech, retail, gobierno digital en Perú y LatAm), el cierre de carrera se juega con un **portfolio defendible**: demo reproducible, system/model cards, métricas con baseline y límites éticos — no con un CV de soft skills genérico. Esta sección integra tu **Enterprise Relationship & Operations Intelligence Platform** (caso sintético multi-región: Lima, Arequipa, Cusco, Piura) y solo promociona cuando 52/52, 12/12 capstones, CP-FINAL y regresión completa pasan **sin compensar** CP-N4-C. En una entrevista senior te pedirán el trade-off, el reloj del drill y qué aportaste tú.",
+    "En equipos de plataforma y producto (fintech, retail, gobierno digital en Perú y LATAM), el cierre de carrera se juega con un **portfolio defendible**: demo reproducible, system/model cards, métricas con baseline y límites éticos. No basta con un CV de soft skills genérico. Esta sección integra tu **Enterprise Relationship & Operations Intelligence Platform** (caso sintético multi-región: Lima, Arequipa, Cusco, Piura) y solo promociona cuando 52/52, 12/12 capstones, CP-FINAL y la regresión completa pasan **sin compensar** CP-N4-C. En una entrevista senior te pedirán el trade-off, el reloj del drill y qué aportaste tú.",
```

### Diff 2 — Dictionary as bullet list (I-006, I-024)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:30 @@
-        "**Diccionario de la sección** (léelo antes de T1). **CP-FINAL:** capstone de integración del currículo completo. **CF-1 revalidación:** stakeholders, jobs y métricas actualizados. **No-go:** decisión de no desplegar si riesgo o evidencia faltan. **Bounded contexts:** fronteras intake, ER, relationship, triage, reporting, copilot (integradas por API/evento, no por DB compartida). **HITL:** human-in-the-loop — humano decide en riesgos sensibles. **RAG:** retrieval-augmented generation con citas. **RPO/RTO:** Recovery Point/Time Objective (cuánto dato y tiempo puedes perder). **SLO:** Service Level Objective. **ADR:** Architecture Decision Record. **C4:** modelo de arquitectura (contexto→contenedores→componentes→código). **Regresión S1–S52:** smoke de contratos y demos. **Disaster exercise:** backup/rollback probados con reloj. **System/model cards:** límites y ownership. **Demo reproducible:** un comando + fixtures sintéticos. **Defensa técnica:** trade-offs y contribución personal. **Promoción máster:** 52/52 + 12/12 + CP-FINAL + regresión sin P0/P1; **no compensa** CP-N4-C.",
+        "**Diccionario de la sección** (léelo antes de T1).\n\n- **CP-FINAL:** capstone de integración del currículo completo.\n- **CF-1 revalidación:** stakeholders, jobs y métricas actualizadas.\n- **No-go:** decisión de no desplegar si riesgo o evidencia faltan.\n- **Bounded contexts:** fronteras intake, ER, relationship, triage, reporting, copilot (integradas por API/evento, no por DB compartida).\n- **HITL:** human-in-the-loop — humano decide en riesgos sensibles.\n- **RAG:** retrieval-augmented generation con citas.\n- **RPO/RTO:** Recovery Point/Time Objective (cuánto dato y tiempo puedes perder).\n- **SLO:** Service Level Objective.\n- **ADR:** Architecture Decision Record.\n- **C4:** modelo de arquitectura (contexto→contenedores→componentes→código).\n- **Regresión S1–S52:** smoke de contratos y demos.\n- **Disaster exercise:** backup/rollback probados con reloj.\n- **System/model cards:** límites y ownership.\n- **Demo reproducible:** un comando + fixtures sintéticos.\n- **Defensa técnica:** trade-offs y contribución personal.\n- **Promoción máster:** 52/52 + 12/12 + CP-FINAL + regresión sin P0/P1; **no compensa** CP-N4-C.",
```

Note: `actualizados` → `actualizadas` (proximity agreement with `métricas`; I-015).

### Diff 3 — `auto-etiquetar` → `autoetiquetar` (I-013)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:20 @@
-    { text: "Ensamblar datos/modelos/RPA/RAG bajo human workflow (HITL) sin auto-etiquetar fraude ni parentesco" },
+    { text: "Ensamblar datos/modelos/RPA/RAG bajo human workflow (HITL) sin autoetiquetar fraude ni parentesco" },
@@ src/lib/course/sections/s52-career-strategy.ts:31 @@
-...sin PII real y sin auto-etiquetar fraude. Graduación exige...
+...sin PII real y sin autoetiquetar fraude. La graduación exige...
```

### Diff 4 — T1-A procedure imperative (I-014)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:67 @@
-        "Procedimiento de revalidación: (1) lista stakeholders vivos y jobs actuales; (2) marca métricas retiradas en change_log; (3) congela baseline sintético (`baseline_frozen=True`); (4) si falta dueño o baseline, `INTERVIEW_STAKEHOLDER` / `REOPEN_CF1`. No reutilices la matriz de S01 sin delta: el producto final defiende *esta* versión. Puente a T1-B: con la matriz viva ya puedes firmar constraints y no-go.",
+        "Procedimiento de revalidación: (1) enumera los stakeholders vivos y los jobs actuales; (2) marca las métricas retiradas en change_log; (3) congela el baseline sintético (`baseline_frozen=True`); (4) si falta dueño o baseline, emite `INTERVIEW_STAKEHOLDER` o `REOPEN_CF1`. No reutilices la matriz de S01 sin delta: el producto final defiende *esta* versión. Puente a T1-B: con la matriz viva ya puedes firmar constraints y no-go.",
```

### Diff 5 — `APIs` → `API` (I-011), all occurrences

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:127 @@
-        "Tras firmar no-go (T1), la plataforma se descompone en **seis bounded contexts**: intake, er, relationship, triage, reporting, copilot. Se integran por **APIs y eventos versionados**; **contratos y ownership** evitan una base compartida como acoplamiento oculto. Contract tests end-to-end fallan el release si un productor rompe el schema — no se «arregla en el consumidor» a escondidas. **Relationship** no es opcional: es el corazón del nombre de la plataforma y del caso multi-región.",
+        "Tras firmar no-go (T1), la plataforma se descompone en **seis bounded contexts**: intake, er, relationship, triage, reporting, copilot. Se integran por **API y eventos versionados**; **contratos y ownership** evitan una base compartida como acoplamiento oculto. Los contract tests end-to-end fallan el release si un productor rompe el schema — no se «arregla en el consumidor» a escondidas. **Relationship** no es opcional: es el corazón del nombre de la plataforma y del caso multi-región.",
@@ src/lib/course/sections/s52-career-strategy.ts:129 @@
-        "En `CASO-PER-052-2A` el fixture válido trae los seis contexts (incluye relationship), APIs/eventos versionados, shared_database=False y contract_tests≥10. Un monólito `all-in-one` con DB compartida fuerza `STOP_INTEGRATION_RELEASE`. Datos sintéticos multi-región; sin secretos en el repo. Puente a T2-B: con los contexts cableados, la cadena HITL (ER→triage→RPA→RAG→humano) cierra el loop de decisión sensible sin auto-fraude.",
+        "En `CASO-PER-052-2A` el fixture válido trae los seis contexts (incluye relationship), API/eventos versionados, shared_database=False y contract_tests≥10. Un monólito `all-in-one` con DB compartida fuerza `STOP_INTEGRATION_RELEASE`. Datos sintéticos multi-región; sin secretos en el repo. Puente a T2-B: con los contexts cableados, la cadena HITL (ER→triage→RPA→RAG→humano) cierra el loop de decisión sensible sin autofraude.",
@@ src/lib/course/sections/s52-career-strategy.ts:~1700 (youDo.requirements[1]) @@
-      "Incluye arquitectura con seis contexts (intake, er, relationship, triage, reporting, copilot) vía APIs/eventos y human workflow.",
+      "Incluye arquitectura con seis contexts (intake, er, relationship, triage, reporting, copilot) vía API/eventos y human workflow.",
```

### Diff 6 — `vs` → `vs.` (I-012), all occurrences

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:~213 (T3-B theory) @@
-        "Con la matriz de tests en verde (T3-A), **SLO, backup, rollback y disaster exercise** se demuestran con **reloj y evidencia**, no con promesas de runbook. Mides: availability ≥ SLO, edad del backup ≤ RPO (horas), tiempo de rollback ≤ RTO (minutos), y **restore verificado** en un drill. Un PDF de procedimientos sin ejercicio **no reduce riesgo** operativo.",
+        "Con la matriz de tests en verde (T3-A), **SLO, backup, rollback y disaster exercise** se demuestran con **reloj y evidencia**, no con promesas de runbook. Mides: availability ≥ SLO, edad del backup ≤ RPO (horas), tiempo de rollback ≤ RTO (minutos), y **restore verificado** en un drill. Un PDF de procedimientos sin ejercicio **no reduce el riesgo** operativo.",
@@ src/lib/course/sections/s52-career-strategy.ts:~1240 (weDo feedback) @@
-        "S52-T3-B-E1: muestra con números del fixture por qué availability/SLO, backup vs RPO y rollback vs RTO + restore pasan; contrasta con el adverso (p. ej. rollback 120 min) que fuerza `NO_GO_RESILIENCE`; sin flag de drill → `RUN_DISASTER_EXERCISE`.",
+        "S52-T3-B-E1: muestra con números del fixture por qué pasan availability/SLO, backup vs. RPO y rollback vs. RTO + restore. Contrasta con el adverso (p. ej. rollback 120 min) que fuerza `NO_GO_RESILIENCE`. Sin flag de drill, emite `RUN_DISASTER_EXERCISE`.",
@@ src/lib/course/sections/s52-career-strategy.ts:~1770 (portfolioNote) @@
-...mejora vs baseline y contribución personal — no voltear booleans...
+...mejora vs. baseline y contribución personal — no voltear booleans...
```

### Diff 7 — Split run-on "Plan 80 h" paragraph (I-001)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:34 @@
-        "Orden de ensamblaje (no saltes etapas): **T1** revalida CF-1 y firma no-go → **T2** cablea seis contexts + HITL → **T3** congela verificación y mide DR → **T4** empaqueta demo/CV y el bundle de 8 artefactos. Plan 80 h orientativo: sem. 1–2 CF-1/no-go (~16 h); sem. 3–5 integración contexts/HITL y contract tests (~24 h); sem. 6–7 evals/red team/SLO/drill medido (~16 h); sem. 8–9 demo + evidence bundle + defensa oral (~16–24 h). iDo modela el procedimiento con fixtures; weDo entrena **alfabetización de gate** (qué código emitir ante válido/adverso/ausente); youDo es el **ensamblaje real de 80 h** — APIs, regresión S1–S52, drill y bundle. Stack: **stdlib** + artefactos del curso.",
+        "Orden de ensamblaje (no saltes etapas): **T1** revalida CF-1 y firma no-go → **T2** cablea seis contexts + HITL → **T3** congela verificación y mide DR → **T4** empaqueta demo/CV y el bundle de 8 artefactos.\n\nPlan 80 h orientativo:\n\n| Semanas | Fase | Horas |\n|---|---|---|\n| 1–2 | CF-1/no-go | ~16 h |\n| 3–5 | Integración contexts/HITL y contract tests | ~24 h |\n| 6–7 | Evals/red team/SLO/drill medido | ~16 h |\n| 8–9 | Demo + evidence bundle + defensa oral | ~16–24 h |\n\niDo modela el procedimiento con fixtures; weDo entrena **alfabetización de gate** (qué código emitir ante válido/adverso/ausente); youDo es el **ensamblaje real de 80 h** — API, regresión S1–S52, drill y bundle. Stack: **stdlib** + artefactos del curso.",
```

### Diff 8 — Split T2-A "Checklist de integración" paragraph (I-004)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:128 @@
-        "Checklist de integración (ensamblaje real, no solo checklist mental): (1) dibuja el mapa de los seis contexts y el dueño de cada uno; (2) versiona OpenAPI y event schemas (`job.finished`, `case.updated` como mínimo); (3) prohíbe `shared_database` entre contexts; (4) exige ≥10 contract tests verdes que fallen si el productor cambia un campo. Flujo típico sintético: intake recibe el caso → er propone identidad → relationship actualiza grafo → triage prioriza → reporting emite métricas → copilot cita con RAG. Si falta mapa o tests, `MAP_BOUNDED_CONTEXTS` / `STOP_INTEGRATION_RELEASE`.",
+        "Checklist de integración (ensamblaje real, no solo checklist mental):\n\n1. Dibuja el mapa de los seis contexts y el dueño de cada uno.\n2. Versiona OpenAPI y event schemas (`job.finished`, `case.updated` como mínimo).\n3. Prohíbe `shared_database` entre contexts.\n4. Exige ≥10 contract tests verdes que fallen si el productor cambia un campo.\n\nFlujo típico sintético: intake recibe el caso → er propone identidad → relationship actualiza grafo → triage prioriza → reporting emite métricas → copilot cita con RAG.\n\nSi falta mapa o tests, emite `MAP_BOUNDED_CONTEXTS` o `STOP_INTEGRATION_RELEASE`.",
```

### Diff 9 — Split `portfolioNote` (I-003, I-016)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:~1770 @@
-    portfolioNote: "Evidencia de CP-FINAL · plataforma integral defendible: baseline TTR (u otra métrica), decisión, pruebas, resultado medido, RPO/RTO numéricos, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño; READY exige hitos 80 h, 6 contexts cableados (con relationship), eventos declarados, HITL, drill con reloj (availability/SLO/RPO/RTO + restore), paths de los 8 artefactos, guion de defensa, regresión S1–S52, mejora vs baseline y contribución personal — no voltear booleans. weDo entrenó los códigos de acción; este youDo es el ensamblaje real del producto de CV.",
+    portfolioNote: "Evidencia de CP-FINAL · plataforma integral defendible: baseline TTR (u otra métrica), decisión, pruebas, resultado medido, RPO/RTO numéricos, rollback y riesgo residual.\n\nLa lista de verificación inicia en BLOCKED por diseño. READY exige:\n\n- hitos 80 h completos\n- 6 contexts cableados (incluyendo relationship)\n- eventos declarados\n- HITL\n- drill con reloj (availability/SLO/RPO/RTO + restore verificado)\n- paths de los 8 artefactos\n- guion de defensa\n- regresión S1–S52\n- mejora vs. baseline\n- contribución personal explícita\n\nNo se aprueba volteando booleans. weDo entrenó los códigos de acción; este youDo es el ensamblaje real del producto de CV.",
```

Note: also "El checklist" → "La lista de verificación" (I-016).

### Diff 10 — `iDo.intro` split (I-008)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:~322 @@
-    intro: "Ocho demos de **modelado de procedimiento** (no teatro de `print(True)`): cada una calcula el predicado de CP-FINAL a partir de fixtures sintéticos `CASO-PER-052` — delta CF-1, no-go, seis contexts, cadena HITL, seis capas de tests, RPO/RTO medidos, guion de demo y bundle de 8. Observa el *cómo se decide*; el weDo te pide reparar el mismo contrato cuando llega roto; el youDo ensambla la plataforma real en ~80 h.",
+    intro: "Ocho demos de **modelado de procedimiento** (no teatro de `print(True)`). Cada una calcula el predicado de CP-FINAL a partir de fixtures sintéticos `CASO-PER-052`, cubriendo: delta CF-1, no-go, seis contexts, cadena HITL, seis capas de tests, RPO/RTO medidos, guion de demo y bundle de 8. Observa el *cómo se decide*; el weDo te pide reparar el mismo contrato cuando llega roto; el youDo ensambla la plataforma real en ~80 h.",
```

### Diff 11 — `weDo.intro` split (I-009)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:~495 @@
-    intro: "S52 · Laboratorio CP-FINAL (24 retos en tríada E1/E2/E3). **E1** repara un predicado de dominio invertido; **E2** separa válido / adverso / missing; **E3** enruta CONTINUE / breach / incertidumbre con el código de acción del subtema. Fixtures sintéticos multi-región (`CASO-PER-052-*`). Estos drills no sustituyen el build de 80 h: entrenan **alfabetización de gate** — qué emitir cuando CF-1, no-go, contexts, HITL, P0/P1, DR o portfolio fallan. El **youDo** es el ensamblaje real: cablear 6 contexts (con relationship), regresión S1–S52, disaster drill con reloj, demo ≤10 min y evidence bundle de 8. Orden T1→T4; no marques READY si milestones, paths del bundle o contribución personal son teatro.",
+    intro: "S52 · Laboratorio CP-FINAL (24 retos en tríada E1/E2/E3).\n\n- **E1** repara un predicado de dominio invertido.\n- **E2** separa válido / adverso / missing.\n- **E3** enruta CONTINUE / breach / incertidumbre con el código de acción del subtema.\n\nFixtures sintéticos multi-región (`CASO-PER-052-*`). Estos drills no sustituyen el build de 80 h: entrenan **alfabetización de gate** — qué emitir cuando CF-1, no-go, contexts, HITL, P0/P1, DR o portfolio fallan. El **youDo** es el ensamblaje real: cablear 6 contexts (con relationship), regresión S1–S52, disaster drill con reloj, demo ≤10 min y evidence bundle de 8. Orden T1→T4; no marques READY si milestones, paths del bundle o contribución personal son teatro.",
```

### Diff 12 — `youDo.requirements[5]` list (I-025)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:~1705 @@
-      "Incluye los 8 artefactos: architecture (C4), README, ADR, system_card, model_card, LICENSE, demo_video, defense_notes.",
+      "Incluye los 8 artefactos del evidence bundle:\n\n- `architecture` (modelo C4)\n- `README`\n- `ADR` (Architecture Decision Records)\n- `system_card`\n- `model_card`\n- `LICENSE`\n- `demo_video`\n- `defense_notes`",
```

### Diff 13 — `weDo.steps[15].feedback` split (I-010)

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:~1240 @@
-        feedback: "S52-T3-B-E1: muestra con números del fixture por qué availability/SLO, backup vs RPO y rollback vs RTO + restore pasan; contrasta con el adverso (p. ej. rollback 120 min) que fuerza `NO_GO_RESILIENCE`; sin flag de drill → `RUN_DISASTER_EXERCISE`.",
+        feedback: "S52-T3-B-E1: muestra con números del fixture por qué pasan availability/SLO, backup vs. RPO y rollback vs. RTO + restore. Contrasta con el adverso (p. ej. rollback 120 min) que fuerza `NO_GO_RESILIENCE`. Sin flag de drill, emite `RUN_DISASTER_EXERCISE`.",
```

### Diff 14 — Replace `owner` with `responsable` in prose (I-029)

Apply selectively to prose fields (not code identifiers). Example:

```diff
@@ src/lib/course/sections/s52-career-strategy.ts:~95 @@
-        "Contrato no-go: `real_pii` y `auto_fraud_label` siempre bloqueados; `match_is_fraud` es False. Cada riesgo en el registro lleva owner; residual_risk_accepted debe ser explícito. Si falta firma o residual, `INDEPENDENT_RISK_REVIEW`. CP-FINAL no se aprueba si el no-go se viola — ethics fail-closed en toda la plataforma.",
+        "Contrato no-go: `real_pii` y `auto_fraud_label` siempre bloqueados; `match_is_fraud` es False. Cada riesgo en el registro lleva responsable; residual_risk_accepted debe ser explícito. Si falta firma o residual, emite `INDEPENDENT_RISK_REVIEW`. CP-FINAL no se aprueba si el no-go se viola — ethics fail-closed en toda la plataforma.",
```

(Repeat for every prose instance of "owner" outside code identifiers and outside the
`risks_with_owner` field name.)

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue IDs | Action | Effort | Impact |
|---|---|---|---|---|
| **P1** | I-011 | Replace every `APIs` with `API` in prose (5 occurrences) | 5 min | High (RAE rule, cross-section consistency) |
| **P1** | I-013 | Replace every `auto-etiquetado` / `auto-fraude` / `auto-riesgo` / `auto-aprobación` with the joined form in prose (keep code identifiers) | 5 min | Medium (RAE preference) |
| **P1** | I-012 | Replace every `vs ` with `vs. ` in prose | 5 min | Low (typography) |
| **P1** | I-017 | `LatAm` → `LATAM` (consistency with S51) | 1 min | Low (consistency) |
| **P2** | I-014 | `lista stakeholders vivos` → `enumera los stakeholders vivos` | 1 min | Medium (grammar ambiguity) |
| **P2** | I-015 | `actualizados` → `actualizadas` in dictionary entry | 1 min | Low (debatable, RAE proximity) |
| **P2** | I-016 | `El checklist` → `La lista de verificación` (or `La checklist`) in portfolioNote | 2 min | Low (loanword gender) |
| **P3** | I-006, I-024 | Convert "Diccionario de la sección" paragraph to a Markdown bullet list | 10 min | High (readability) |
| **P3** | I-001 | Split "Plan 80 h" paragraph; convert schedule to a table | 10 min | High (readability) |
| **P3** | I-003 | Split `portfolioNote` long sentence into a list | 10 min | High (readability of closing call-to-action) |
| **P3** | I-004 | Split T2-A "Checklist de integración" paragraph | 10 min | Medium (readability) |
| **P3** | I-005 | Split `paragraphs#2` "El gate bloquea…" into a list of 5 failure modes | 5 min | Medium (readability) |
| **P3** | I-002 | Split T1 "Cómo se ensamblan los 12 capstones" paragraph | 10 min | Medium (readability) |
| **P4** | I-007, I-008, I-009, I-010 | Split long sentences in `jobRelevance`, `iDo.intro`, `weDo.intro`, and feedback strings | 20 min | Medium (readability) |
| **P4** | I-025, I-026 | Convert `requirements[5]` (8 artefacts) and `requirements[8]` (schedule) to lists | 10 min | Medium (scannability) |
| **P5** | I-029 | Standardise `owner` → `responsable` in prose | 15 min | Low (style consistency) |
| **P5** | I-018 | Italicise or code-span the 6 bounded-context names in prose | 10 min | Low (style) |
| **P5** | I-027 | Deep-link the GitHub resource URL | 2 min | Low (usefulness) |

**Total estimated effort:** ~2 hours of editorial work for a fully-cleaned Section 52.

---

## 9. Graph Memory Update Notes

For the shared `/home/z/my-project/audits/` context:

- **Section 52 graph node:** `S52-career-strategy` · phase 3 · master · 80h · capstone
  finale · integrates S01–S51 + 12 capstones.
- **Strong edges (curriculum):**
  - S52 → S51 (CP-N4-C non-compensation rule; CF-5 freeze inherited)
  - S52 → S50 (evals/red team referenced in T3-A)
  - S52 → S48 (AI governance referenced in T1-B no-go)
  - S52 → S35 (system design, C4 architecture)
  - S52 → S29 (MLOps, contract tests)
  - S52 → S26 (Integrator Phase 1 — same HITL pattern at lower level)
- **Pedagogical pattern:** `Diccionario` + 8 theory subsections (T1-A/T1-B/T2-A/T2-B/T3-A/T3-B/T4-A/T4-B) + 8 iDo demos + 24 weDo exercises (E1/E2/E3 × 8) + 1 youDo capstone + 5 selfCheck + 8 docs + 2 books + 4 courses. This pattern is shared with S47–S51 and is the gold standard for Phase 3.
- **Cross-section consistency findings:**
  - `APIs` plural issue likely affects ALL Phase 3 sections that mention "APIs y eventos" — recommend a course-wide fix.
  - `auto-*` hyphenation issue likely affects all sections that mention `autoetiquetado`/`autofraude`/`autoaprobación` — recommend course-wide fix.
  - `vs` abbreviation period likely affects all sections — recommend course-wide fix.
  - `LatAm` vs `LATAM` inconsistency between S51 (LATAM) and S52 (LatAm) — recommend course-wide standardisation.
- **Quality benchmark:** S52 is in the upper tier of Phase 3 sections audited so far.
  Pedagogical structure is excellent; redaction density is the only meaningful deduction.
- **Suggested follow-up audits:**
  - Verify that the `weDo` exercises' `assert` statements in `solutionCode` all pass when run (executable verification) — out of scope for this audit but flagged for the Fixer.
  - Verify that `youDo.starterCode` runs without error in its initial BLOCKED state (the `assert status in {"READY", "BLOCKED"}` at the end should pass).

---

## 10. Method Note (Grammar Subplan Application)

Per `/home/z/my-project/audits/_GRAMMAR_SUBPLAN.md`:

1. **Surface metrics computed:** Fernández-Huerta (FH) and INFLESZ (Szigriszt-Pazos)
   for every extracted sentence; words-per-sentence (WPS) and syllables-per-word
   (SPW). Spanish vowel-group syllable heuristic per the shared `audit_tools/s04_extract.py`.
2. **Rule-based engine:** LanguageTool public API (`https://api.languagetool.org/v2/check`
   with `language=es`) was run on the section's prose in 3 chunks (one chunk returned
   HTTP 500; the other 2 returned 574 total matches, of which 558 were
   `MORFOLOGIK_RULE_ES` false positives on tech terms and 16 were genuine rule
   violations).
3. **Pedagogical heuristics:** All 13 rules from the subplan table were applied
   offline (run-on, missing terminal punctuation, missing inverted marks, unbalanced
   delimiters, duplicated words, English-dominant sentence, meta/AI/TODO leak,
   gerund pile-up, high comma density, paragraph-as-one-sentence, anaphoric monotony,
   space-before-punct, double space).
4. **Composite score:** Computed in two passes — a harsh initial pass (0.0/10 because
   of false-positive inflation from `space_before_punct` on inline-code-stripped
   sentences and `no_terminal_punct` on multiple-choice options) and a calibrated pass
   that filtered known false-positive classes (calibrated to 7.5/10).
5. **False-positive classes documented:**
   - 558 `MORFOLOGIK_RULE_ES` hits on intentional English tech terms (CP-FINAL, HITL,
     RAG, RPO, RTO, SLO, ADR, C4, PII, RPA, ER, ETL, DB, baseline, drill, gate,
     bundle, etc.) — all by design at Master level.
   - 108 `double_space` false positives caused by inline-code stripping in the
     metrics pipeline (e.g., `CASO-PER-052` stripped to empty leaves a double space
     in the metric text but not in the source).
   - 71 `space_before_punct_or_double` false positives where the "space before colon"
     is correct Spanish typography (e.g., "CP-FINAL: capstone…").
   - 15 `english_dominant` false positives where the sentence has accents but lacks
     Spanish function words from the heuristic's word list.
   - 3 `meta_leak` false positives ("draft", "todo ok") — see §4.
   - 2 `duplicated_word` false positives ("y y") caused by stripping two adjacent
     inline-code spans separated by " y ".

---

## 11. Final Verdict

Section 52 is a **pedagogically sound, well-governed, content-rich** finale to the
PyArcana course. Its defects are concentrated in **editorial readability** (long
sentences, dense paragraphs, glossary-as-prose) and **Spanish typography/RAE norms**
(`APIs` → `API`, `auto-*` → `auto*`, `vs` → `vs.`, `LatAm` → `LATAM`). None of the
defects are pedagogical or structural; all are addressable with ~2 hours of editorial
work using the 14 proposed diffs in §7.

**This is the complete Explorer report for Section 52. Ready for the Fixer prompt.**
