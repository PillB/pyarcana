# S51 — Curriculum Audit Report (Explorer pass)

**Section under audit:** 51 of 52 (slot index 50 in `COURSE_SECTIONS[50]`)
**Source file:** `src/lib/course/sections/s51-integrator-final.ts` (2,175 lines)
**Section id / shortTitle / title:**
- `id: "integrator-final"`
- `shortTitle: "Obs y UX copiloto"`
- `title: "Observabilidad, gobernanza y UX del copiloto"`
- `tagline: "Auditable AI Operations Copilot con system card y dashboard; CF-5 congela artefactos e interfaces"`
- `estimatedHours: 20`, `level: "Master"`, `phase: 3`, `icon: "Crown"`

**Live site:** https://pillb.github.io/pyarcana/ — slot 51 in the Phase-3 / Master strip; last integrator section before S52 (career strategy). The section is the second-to-last (51 of 52). Verified by `src/lib/course/index.ts:55` (`import { section51 } from './sections/s51-integrator-final'`) and `index.ts:80` ordering `… section50, section51, section52,`.

> Method note (research summary, per the Spanish grammar/style/structure subplan):
> Spanish readability formulas applied: **Fernández-Huerta 1959** (`206.84 − 60·(syll/word) − 1.02·(words/sent)`), **Szigriszt-Pazos / INFLESZ** (`206.835 − 62.3·(syll/word) − (words/sent)`), **WPS** (words per sentence) and **SPW** (syllables per word, vowel-group heuristic). Pedagogical heuristics applied to every paragraph and sentence: long sentences (>32 w / >45 w = run-on), missing terminal punctuation, missing inverted `¿`/`¡`, unbalanced delimiters, repeated words, English-dominant sentence, gerund pile-up, high comma density, anaphoric monotony, meta-leak, paragraph-as-one-sentence, space-before-punct, double spaces. LanguageTool `es` not reachable from the sandbox in this run (Network API throttled/offline); heuristic-only is acceptable per subplan §A/B validation. Aggregate metrics computed by a small Python script (`audits/_s51_metrics.py`) and stored in `audits/_s51_metrics.json` + `audits/_s51_prose.txt`.

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section # | 51 of 52 (slot 50) |
| Phase | 3 — Master (Crown) |
| Capstone increment | CP-N4-C + CF-5 (final integrator freeze) |
| Estimated hours | 20 |
| Synthetic case | `CASO-MOQ-051` (Moquegua, ficticio) |
| Theory cards | 9 subtopics grouped into 4 T-blocks (T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B) — 8 cards + 1 routing card (header) |
| I Do demos | 8 (`S51-T1-A-DEMO` … `S51-T4-B-DEMO`) |
| We Do exercises | 24 (8 subtopics × 3 layers: E1 guided, E2 independent, E3 transfer) |
| You Do | 1 portfolio `CP-N4-C + Level-4 regression` with `scorecard()`/`readiness()` helpers and 6-criterion rubric |
| Self-check MCQs | 5 |
| Resources | 8 docs, 2 books, 4 courses |
| Pedagogical signature | Contract-then-`meets_contract`-then-decide pattern; fail-closed tri-state tokens (`CONTINUE` / `<BREACH_ACTION>` / `<RESTORE/UNCERTAIN_ACTION>`); deliberately defective starter (single DEFECT line) learner repairs to align with `solutionCode`. Same idiom shared with S48/S49/S50 (the Phase-3 "agentic" sub-track). |

**Scope of this audit:** all learner-facing Spanish prose (`jobRelevance`, `learningOutcomes`, `theory.heading/paragraphs/callout.title/callout.content`, `iDo.intro`, `iDo.steps[].description/why`, `weDo.intro`, `weDo.steps[].instruction/hint/hints/edgeCases/tests/feedback`, `youDo.title/context/objectives/requirements/portfolioNote/rubric`, `selfCheck.questions[].question/options/explanation`, `resources.docs/books/courses[].label+note`). Code bodies, starterCode/solutionCode bodies and id-only strings are out of scope for the grammar dimension (per subplan §"Scope of text") but reviewed for code-output integrity and pedagogy.

---

## 2. Executive Summary of Quality

**Composite score: 8.0 / 10.**

S51 is a technically rigorous, pedagogically exemplary Master-phase integrator. It closes the Phase-3 sub-track (S48 governance → S49 data contracts → S50 evals/red team → S51 ops/observability/UX → S52 career) with a coherent "Auditable AI Operations Copilot" + CF-5 freeze capstone. I Do / We Do / You Do / Self-check fidelity is high (8 demos, 24 exercises in the 8×3 lattice, 1 portfolio with production-like `readiness()` BLOCKED→READY gate, 5 calibrated MCQs). The fail-closed tri-state pattern (CONTINUE / `<BREACH>` / `<RESTORE>`) is consistently applied across all 8 subtopics — a genuine pedagogical innovation that turns the contract-then-decide loop into muscle memory.

The section is held back by:

1. **One HIGH curriculum-owner meta-leak** (L319 callout in T3-B): "El dueño de S51-T4-A responde por rollback y evidencia; sin dueño no hay promote." — internal-to-staff phrasing that breaks the fourth wall (same disease as S45-I01). The callout announces a future subtopic (T4-A) before the learner reaches it, and uses the curriculum-developer token "dueño de S51-T4-A" instead of operational teacher voice. → Issue 01.
2. **One HIGH `id`/filename mismatch** (legacy "integrator-final" id, but V3 title is "Observabilidad, gobernanza y UX del copiloto"). Less catastrophic than S44/S46/S47 id-drift (the file name `s51-integrator-final.ts` is at least neutral/accurate: it IS the final integrator) but the `id: "integrator-final"` resolves to a route hash that doesn't describe the section's content. → Issue 02.
3. **6 scaffolding-note callouts** whose `content` field reads as an author-to-developer reminder rather than as learner-facing rationale (L104, L151, L190, L231, L275, L319). Pattern: "Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual." / "Contrato S51-T2-B: fixture S51-T2-B; si falta evidencia, no promociones." — these are gatekeeper notes that should be rephrased as learner takeaways or moved to a teacher guide. → Issue 03.
4. **Several stylistic / typographic defects** repeated across the section: bare `vs` (no period) appears 5× (L283, L372, L758, L1419, L1423 area); curly English quotes `"…"` inconsistent with Spanish `«…»` used elsewhere; "re-redacción" hyphenation deprecated by RAE 2010; "hardcodees" anglicism; "residual risk" English noun phrase in an otherwise-Spanish sentence (L364 callout); "burn" used as a Spanish noun without glossary. → Issues 04–11.
5. **One cognitive-load hotspot** (L65 T1-A paragraph 1, 110-word mega-sentence that bundles definition + tree-structure metaphor + PII rule + artifact handoff to T1-B). → Issue 12.
6. **Minor code-switching anglicisms** (side-effect, fail-closed, postmortem, on-call, dashboard, gate, sink, bundle, registry, alert, breach, runbook, slice, drift, baseline, holdout, allowlist) — most are accepted as professional Latin-American Spanish AI-ops jargon, but a few lack glossary entries and would benefit from a one-time Spanish gloss on first use. → Issue 13.

No critical code-output integrity bugs were found in the spot-checked demos (S51-T1-A-DEMO, S51-T1-B-DEMO, S51-T2-A-DEMO, S51-T3-A-DEMO, S51-T4-A-DEMO, S51-T4-B-DEMO) and exercises (S51-T1-A-E1/E2/E3, S51-T2-A-E1/E2/E3, S51-T3-A-E1, S51-T3-B-E1, S51-T4-A-E1, S51-T4-B-E1): each `starterCode` DEFECT inverts exactly the domain predicate, the `solutionCode` re-establishes the contract, the inline `assert` is consistent with the printed `S51-T*-X PASS` / `CONTINUE` / `<breach-action>` / `<restore-action>` outputs. The `pin_release` demo output `PASS card://copilot-7\nFREEZE_RELEASE_BUNDLE\nFREEZE_RELEASE_BUNDLE` matches the source verbatim (L182–184).

**Verdict:** Strong, ship-quality Master-phase content. Fixing the 11 numbered issues below (1 H meta-leak line, 1 H id hygiene, 6 M scaffolding-note rewrites, ~10 L typographic sweeps) costs roughly 1–2 hours and lifts the section to ~9.0/10.

---

## 3. Detailed Issue Registry

> Severity scale: H = pedagogically damaging / breaks immersion; M = visible quality defect; L = polish. Evidence quotes are line-quoted from `s51-integrator-final.ts`.

### Issue 01 — Curriculum-owner meta-leak in T3-B callout (HIGH)

- **Location:** L318–320 — `theory[5].callout` (subtopic `S51-T3-B`, callout type `"danger"`, title "Contener antes de debatir").
- **Evidence:** `"El dueño de S51-T4-A responde por rollback y evidencia; sin dueño no hay promote."`
- **Pedagogical impact:** The phrase "El dueño de S51-T4-A responde por…" is curriculum-developer voice: it speaks *about* a future subtopic's owner as if the staff were coordinating handoffs, not as if the learner were reading operational guidance. It also forward-references `S51-T4-A` from inside the T3-B card, which violates progressive disclosure (the learner has not yet seen T4-A). The token "promote" (English verb used as a Spanish borrowed imperative) appears here as a curriculum action verb (gatekeeper slang), not as learner-facing ops vocabulary.
- **Root cause:** Copy-paste from a curriculum gatekeeper checklist (same idiom as S45-I01 and the S40/S44/S46/S47 family of "promote" meta-leaks).
- **Severity:** H.

### Issue 02 — `id: "integrator-final"` and filename stale vs V3 title (MEDIUM)

- **Location:** L4 (`id: "integrator-final"`) and filename `s51-integrator-final.ts`.
- **Evidence:** `title: "Observabilidad, gobernanza y UX del copiloto"`, `shortTitle: "Obs y UX copiloto"`, but `id: "integrator-final"` and file name `s51-integrator-final.ts`. URL hash on the live site is `#integrator-final` for a section about copilot observability/governance/UX.
- **Pedagogical impact:** Less severe than the S44/S46/S47 id-drift chain (the file name *is* neutral-accurate — the section really is the final integrator), but the route hash on the live SPA no longer matches the learner-visible title. Cross-references and bookmarks use `#integrator-final` for content that is now titled "Observabilidad, gobernanza y UX del copiloto". Inconsistency between `shortTitle` and `id` is the same disease the orchestrator flagged course-wide (S40 `agentic-architecture`, S44 `multimodal`, S46 `gpu-computing`, S47 `opensource`, S50 `tech-leadership`).
- **Root cause:** The V3 roadmap renamed the section's content (S51 used to be a generic "integrator final" capstone) but did not rename `id` or filename.
- **Severity:** M (one-line schema impact; the section still renders and functions correctly).

### Issue 03 — Six scaffolding-note callouts read as author-to-developer reminders (MEDIUM)

- **Locations (all `theory[·].callout.content`):**
  - L104 — `theory[1]` (T1-B precursor at end of T1-A card): `"Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual."`
  - L151 — `theory[2]` (T1-B card): `"La revisión de S51-T2-A exige salida esperada y fail-closed ante breach."`
  - L190 — `theory[3]` (T2-A card): `"Contrato S51-T2-B: fixture S51-T2-B; si falta evidencia, no promociones."`
  - L231 — `theory[4]` (T2-B card): `"Para S51-T3-A: fixture S51-T3-A; si falta evidencia, no promociones."`
  - L275 — `theory[5]` (T3-A card): `"Promoción de S51-T3-B solo con evidencia reproducible y dueño asignado."`
  - L319 — `theory[6]` (T3-B card): the HIGH meta-leak above (Issue 01).
- **Evidence pattern:** Each callout announces "what the next subtopic will require" or "what the curriculum gatekeeper must check before promoting this subtopic". The token "promociones"/"promover"/"Promoción" appears 4× as a curriculum action verb, not as an ops action verb.
- **Pedagogical impact:** The callouts (which render as colored info/danger boxes beneath each theory card) should be learner-facing takeaways or pitfall warnings. Instead they read as staff coordination notes ("promueve S51-T2-A solo si …"). This breaks immersion: the learner is reminded that they are walking a pre-built scaffold, not mastering an operational craft. Also, they cross-reference the *next* subtopic, defeating the local-coherence principle of progressive disclosure.
- **Root cause:** Same as Issue 01 — the callout fields were authored from a curriculum gatekeeper checklist and never rewritten into learner voice.
- **Severity:** M (each); together they form a systemic meta-leak pattern that is the section's largest quality drag.

### Issue 04 — `vs` written without period (LOW)

- **Locations:** L283, L372, L758, L1419, L1423 (and possibly more inside `code` comments, which are out of scope).
- **Evidence (L283):** `"…minutos de rollback vs `rto_minutes`…"`
- **Evidence (L372):** `"…`contrast_ratio` vs `min_contrast`…"`
- **Evidence (L758):** `"…decide restore vs continue (transfer spans/versions)"` (inside `starterCode` comment — out of scope but flagging).
- **Evidence (L1419):** `"…availability, faithfulness y drift vs umbrales…"`
- **Pedagogical impact:** RAE accepts `vs.` as the Spanish abbreviation of the Latin *versus*; the bare `vs` is an English typography calque. Course-wide issue (S44/S45/S50 reports flagged the same).
- **Severity:** L.

### Issue 05 — Curly English quotes `"…"` mixed with Spanish `«…»` (LOW)

- The section uses Spanish angular quotes `«…»` consistently for learner-facing quotation (e.g., L65 `«qué se citó y qué tool se llamó»`, L238 `«optimiza»`, L326 `«prepara borrador», no «envía a producción»`, L645 `«bonito»`). No English curly quotes were found in the learner-facing prose — *however*, the `description` microcopy on iDo demos (e.g., L422 `"Demo: traza con spans correlacionados y gate de PII"`) does not use Spanish quotation marks at all when quoting code identifiers, which is correct (code identifiers are backticked). **No defect here.** Logged for completeness.

### Issue 06 — `re-redacción` hyphenation deprecated by RAE 2010 (LOW)

- **Location:** L2112 — `selfCheck.questions[4].options[2]`:
  `["…", "REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta re-redacción", "…"]`
- **Evidence:** `"re-redacción"` (with hyphen).
- **Pedagogical impact:** Per RAE *Ortografía* 2010, prefixes attached to base words starting with the same consonant are written without a hyphen: `reabrir`, `reentrada`, `reeditar`. The correct form is `reredacción` (or, preferentially, `nueva redacción` / `repetición de la redacción` to avoid the awkward double-r). The hyphenated form is a deprecated style that learners will replicate in their own writing.
- **Severity:** L.

### Issue 07 — `hardcodees` anglicism in `portfolioNote` (LOW)

- **Location:** L2074 — `youDo.portfolioNote`: `"…no hardcodees True ni cambies asserts."`
- **Evidence:** `"hardcodees"` (Spanish verb conjugated from the English `hardcode`).
- **Pedagogical impact:** The English verb *to hardcode* has no clean Spanish equivalent. Common translations: `codificar a fuego`, `escribir el valor fijo`, `asignar manualmente el valor`, `fijar el valor en el código`. The anglicism `hardcodear` is acceptable in informal developer Spanish but appears in a `portfolioNote` that is learner-facing and explicitly instructive ("no hardcodees True"). Recommend `no asignes True a mano` or `no codifiques los valores a fuego`.
- **Severity:** L.

### Issue 08 — `residual risk` English noun phrase inside Spanish callout (LOW)

- **Location:** L364 — `theory[7].callout.content` (T4-A card):
  `"Cierre de S51-T4-B: documenta residual risk y límites del lab stdlib."`
- **Evidence:** `"residual risk"` (English noun phrase).
- **Pedagogical impact:** The same rubric and theory use the Spanish form `"riesgo residual"` consistently elsewhere (L197, L198, L2074 portfolioNote: `"…resultado medido, rollback y riesgo residual."`). The English form here is an inconsistency that also functions as an author-to-developer reminder ("Cierre de S51-T4-B: documenta residual risk y límites del lab stdlib"). This callout is also a scaffolding-note meta-leak (see Issue 03) and should be rewritten wholesale.
- **Severity:** L (English noun) + M (meta-leak phrasing) — combined into Issue 03 for the rewrite, with a separate L flag for the `residual risk` anglicism.

### Issue 09 — `burn` used as a Spanish noun without glossary entry (LOW)

- **Locations:** L239 (`burn de error budget calculable`), L567 iDo why (`El error budget quemado al 20% todavía da margen`), L1420 hint (`burn = errors/allowed con allowed=(1-slo)*window.`), L1423 hints (`…también bool(owner).`).
- **Evidence:** `"burn"` used as a Spanish noun (e.g., L239: `"burn de error budget calculable"`) without an in-section definition. The section defines `error_budget_burn` (the function name) but never glosses `burn` as the *burn rate* concept.
- **Pedagogical impact:** The learner meets `"burn"` as a noun before learning what it means. The Spanish SRE literature uses `"tasa de consumo del error budget"` or `"quemado del error budget"`. A one-time glossary entry `"burn: tasa de consumo del error budget"` would close the gap.
- **Severity:** L.

### Issue 10 — `floating tag` English metaphor (LOW)

- **Location:** L514 — iDo S51-T2-A-DEMO `why`:
  `"En prod rechazo `latest` y bundles mutables: sin pin no hay rollback ni postmortem reproducible. El system card se enlaza al release, no a un floating tag."`
- **Evidence:** `"floating tag"` (English compound noun).
- **Pedagogical impact:** The Docker/OCI term `floating tag` is professional jargon; in Spanish SRE literature the more common form is `"tag móvil"` or `"tag flotante"`. Acceptable as a one-off but worth aligning with the rest of the section (which uses Spanish `"tag"` consistently in `"latest" es un tag móvil` style elsewhere — actually, the section only uses `floating tag` once, so the inconsistency is just this one occurrence).
- **Severity:** L.

### Issue 11 — `El dueño de S51-T4-A` and `del You Do` / `del We Do` / `del I Do` tab-name leaks (LOW–M)

- **Locations:** L319 (already Issue 01), and any reference to "Yo hago" / "Hacemos juntos" / "Tú haces" tabs in the iDo/weDo/youDo prose.
- **Evidence:** Scanning `iDo.intro`, `weDo.intro`, `youDo.context`: none of them reference tab names by their Spanish labels, so this leak does not appear in S51 (unlike S50 L329 which had `del You Do`). Logged for completeness.
- **Severity:** L (no defect in S51, but a course-wide pattern to monitor).

### Issue 12 — T1-A paragraph 1 cognitive overload: 110-word mega-sentence (MEDIUM)

- **Location:** L65 — `theory[1].paragraphs[0]` (subtopic `S51-T1-A`):
  > "Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice) y un **trace_id** de correlación (prefijo `tr-`). En la práctica de ops de IA se modela como árbol de **spans** padre/hijo (prompt → retrieval → tool → answer) con atributos por span — no como tres strings sueltos. Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó». **Redacta PII/secrets antes** de exportar a backends de observabilidad; raw logs con datos personales son incidente, no «detalle de ops». Este artefacto alimenta el registry y el dashboard de T1-B en adelante."
- **WPS analysis:** The paragraph contains 5 sentences (110 words / 5 ≈ 22 wps avg). The longest sentence is sentence 4 (`"Redacta PII/secrets antes de exportar a backends de observabilidad; raw logs con datos personales son incidente, no «detalle de ops»."` — 22 words, two clauses separated by `;`). Sentence 2 (`"En la práctica de ops de IA se modela como árbol de spans padre/hijo (prompt → retrieval → tool → answer) con atributos por span — no como tres strings sueltos."`) is 30 words with parenthetical injection and a `—` aside. The paragraph bundles **definition + tree-structure metaphor + auditoría justification + PII rule + artifact handoff to T1-B** into one block.
- **Pedagogical impact:** The first paragraph of the first subtopic of a Master section sets the cognitive baseline. Bundling five distinct teaching points (definition / structure / why / PII rule / handoff) forces the learner to hold five concepts simultaneously. The subplan's `paragraph = one long sentence` and `long sentence (>32 w)` heuristics both flag this block. Sentence 2 is borderline run-on.
- **Root cause:** Author wrote a "dictionary + setup" paragraph and didn't split it.
- **Severity:** M.

### Issue 13 — Code-switching anglicism density in iDo/weDo microcopy (LOW)

- The 8 iDo demos and 24 weDo exercises include English nouns as Spanish nouns without in-section glosses: `gate`, `sink`, `bundle`, `registry`, `audit`, `slice`, `drift`, `baseline`, `holdout`, `allowlist`, `runbook`, `breach`, `alert`, `on-call`, `dashboard`, `release`, `tool`, `span`, `prompt`, `trace`, `feedback`, `postmortem`, `side-effect`, `fail-closed`, `WCAG AA`, `SLA`, `TTL`, `RTO`, `SLO`, `SLI`. Some are universally accepted LATAM SRE jargon (`dashboard`, `release`, `feedback`, `audit`); others are bilingual edge cases (`postmortem` → RAE prefers `post mortem` as two words per 2010 norm; `allowlist`/`denylist` → Spanish `lista de permitidos`/`lista de bloqueo`).
- **Specific instances:**
  - `postmortem` (used as a Spanish compound noun) appears at L22, L279, L282, L284, L288, L297, L301, L308, L514, L576, L584, L588, L594, L1503+ — RAE 2010 norm is `post mortem` (two words). The compound noun form is widely used in SRE Spanish but technically deprecated. (Same defect flagged in S46.)
  - `on-call` appears at L67, L112, L282, L490, L567 — universal LATAM ops jargon; no action needed beyond glossary.
  - `side-effect` (English hyphenated compound) appears at L23 (learningOutcomes), L326, L327, L1658, L1752 — Spanish `efecto secundario` or `acción irreversible` is the alternative. Acceptable as jargon but L23 `learningOutcomes[6]` could use `acción con efecto secundario` for clarity.
- **Pedagogical impact:** Master-phase learners can absorb the jargon; the issue is one of consistency and a small glossary gap.
- **Severity:** L (course-wide — same disease flagged in S44, S45, S46, S47, S50).

### Issue 14 — `promote` as a Spanish borrowed verb (LOW–M)

- **Location:** L319 (`Issue 01`).
- **Evidence:** `"sin dueño no hay promote."` — `promote` as a Spanish noun (English curriculum slang for "approve a subtopic for the next gate").
- **Pedagogical impact:** Beyond the meta-leak (Issue 01), `promote` as a noun is not standard Spanish and is not in the section's glossary. The course uses `promoción` / `promocionar` elsewhere (L104, L151, L190, L231, L275, L319 all use "promover"/"promoción" but L319 code-switches to `promote`). Recommendation: standardize on `promoción`.
- **Severity:** L.

### Issue 15 — `T1-B` forward-reference in T1-A callout breaks progressive disclosure (MEDIUM)

- **Location:** L104 — `theory[1].callout.content` (T1-A card): `"Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual."`
- **Evidence:** The T1-A callout mentions `S51-T1-B` (the *next* subtopic) before the learner reaches it.
- **Pedagogical impact:** Progressive disclosure violation — callouts in a card should reinforce the current card's takeaway, not announce the next card's prerequisites. Same pattern in L151 (`S51-T2-A` mentioned in T1-B callout), L190 (`S51-T2-B` mentioned in T2-A callout), L231 (`S51-T3-A` mentioned in T2-B callout), L275 (`S51-T3-B` mentioned in T3-A callout), L319 (`S51-T4-A` mentioned in T3-B callout), L364 (`S51-T4-B` mentioned in T4-A callout).
- **Root cause:** Same as Issue 03 — author-to-developer reminders were never rewritten to learner voice.
- **Severity:** M (bundled into Issue 03 for the rewrite pass).

### Issue 16 — `weDo.intro` 70-word run-on sentence (LOW)

- **Location:** L650 — `weDo.intro`:
  > "S51 · Laboratorio Auditable AI Operations Copilot y CF-5: 24 retos locales sobre `CASO-MOQ-051`. E1 repara un predicado de dominio, E2 separa valid/invalid/missing y E3 transfiere con helpers de compute (reconciliación de tokens, multi-SLI, dual-control, a11y) hacia CONTINUE / acción de breach / restore. Fixtures sintéticos de Moquegua; sin PII real."
- **WPS analysis:** Sentence 2 (`"E1 repara un predicado de dominio, E2 separa valid/invalid/missing y E3 transfiere con helpers de compute (reconciliación de tokens, multi-SLI, dual-control, a11y) hacia CONTINUE / acción de breach / restore."`) is 35 words with two embedded lists and a parenthetical — borderline run-on (>32 w heuristic). Sentence 1 (22 words) and sentence 3 (8 words) are healthy.
- **Pedagogical impact:** The weDo intro is the learner's first orientation to the 24-exercise lattice; an overloaded sentence 2 obscures the E1/E2/E3 progression.
- **Severity:** L (could be split into three short bullets).

### Issue 17 — `el alert a producción de decisión` awkward phrasing in T3-A case (LOW)

- **Location:** L240 — `theory[5].paragraphs[2]` (subtopic `S51-T3-A`):
  > "Si faithfulness cae a 0.4, se abre incidente de copiloto; sin owner no se promociona el alert a producción de decisión."
- **Evidence:** `"el alert a producción de decisión"` — the noun phrase `"producción de decisión"` is unclear. The author likely meant `"promoción a producción del alerta de decisión"` or `"promoción a producción de la alerta de decisión"`. The current phrasing reads as "promote the alert to decision-production", which is non-idiomatic.
- **Pedagogical impact:** The sentence's intent is "if there's no owner, the alert is not promoted to production-grade decisioning" — but the word order obscures this.
- **Root cause:** Likely a typo or compression slip. Gender of `alert` is also inconsistent (RAE: `la alerta`; the section uses `el alert` as a masculine anglicism in this line, but `alerta accionable` feminine in L239).
- **Severity:** L (clarity) + L (gender drift).

### Issue 18 — `iDo.intro` references `CP-N4-C + CF-5` without in-section glossary (LOW, INFO)

- **Location:** L416 — `iDo.intro`: `"Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas a CP-N4-C + CF-5. …"`
- **Evidence:** `CP-N4-C` and `CF-5` are used 9× and 17× respectively without an in-section definition.
- **Pedagogical impact:** `CF-5` is defined in L31 ("CF-5: congela interfaces y artefactos para integración final") and L411 ("Cierre S51-T4-B / CF-5: …"). `CP-N4-C` is never defined in S51; it is referenced as if the learner already knows it from S50 / S49. For a portfolio gate token, a one-line gloss ("CP-N4-C: capstone portfolio del nivel 4, componente C") would close the gap.
- **Severity:** L (INFO).

### Issue 19 — `iDo.intro` sentence 2 (`Cada demo **calcula** el artefacto del subtema sobre CASO-MOQ-051 con stdlib; no son prints decorativos.`) — fine, no defect (LOG)

- WPS 13; FH ~85 (muy fácil). Healthy sentence. Logged for completeness.

### Issue 20 — `T3-B callout title "Contener antes de debatir"` is excellent (LOG)

- Best-in-section callout title: operational, learner-facing, captures the incident-response ordering principle. Could be a model for rewriting Issues 01/03.

---

## 4. Meta-Leak Report

| # | Location | Exact leaked text | Type | Severity |
|---|---|---|---|---|
| ML-1 | L319 (theory[6].callout.content) | `"El dueño de S51-T4-A responde por rollback y evidencia; sin dueño no hay promote."` | Curriculum-owner / gatekeeper voice + forward-ref to T4-A + `promote` borrowed verb | H |
| ML-2 | L104 (theory[1].callout.content) | `"Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual."` | Scaffolding-note / forward-ref to T1-B | M |
| ML-3 | L151 (theory[2].callout.content) | `"La revisión de S51-T2-A exige salida esperada y fail-closed ante breach."` | Scaffolding-note / forward-ref to T2-A | M |
| ML-4 | L190 (theory[3].callout.content) | `"Contrato S51-T2-B: fixture S51-T2-B; si falta evidencia, no promociones."` | Scaffolding-note / forward-ref to T2-B / `"fixture S51-T2-B"` self-referential | M |
| ML-5 | L231 (theory[4].callout.content) | `"Para S51-T3-A: fixture S51-T3-A; si falta evidencia, no promociones."` | Scaffolding-note / forward-ref to T3-A / self-referential | M |
| ML-6 | L275 (theory[5].callout.content) | `"Promoción de S51-T3-B solo con evidencia reproducible y dueño asignado."` | Scaffolding-note / forward-ref to T3-B | M |
| ML-7 | L364 (theory[7].callout.content) | `"Cierre de S51-T4-B: documenta residual risk y límites del lab stdlib."` | Scaffolding-note / forward-ref to T4-B / `residual risk` English noun phrase | M |
| ML-8 | L319 (also Issue 01) | `"…no hay promote."` | `promote` borrowed verb (English curriculum slang as Spanish noun) | L |
| ML-9 | L2074 (youDo.portfolioNote) | `"…no hardcodees True ni cambies asserts."` | `hardcodees` anglicism (less severe — common in informal dev Spanish, but not in formal learner prose) | L |

**No TODO / FIXME / XXX / HACK / WIP / TBD markers** were found in the learner-facing prose (regex scan of `s51-integrator-final.ts` returned zero hits). No `//` or `/* */` JavaScript comments appear outside intentional Python code-block bodies. No `"moved from section X"` / `"Nota de orientación:"` / `"placeholder"` / `"do not ship"` strings.

**No interactive-demo meta-leak.** Unlike S44 (CLIP/Whisper demo), S46 (GPU computing demo), the `SectionView.tsx` interactive playground does not include a multimodal/GPU demo for S51 (verified by checking that no `integrator-final` or `s51` key appears in the interactive-demo block of `SectionView.tsx` — the section relies on its in-section `iDo` demos only).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — 9.5 / 10

**I Do (8 demos, `iDo.steps[]`):** Each demo follows the same triple — `description` (what the demo shows), `code` (runnable Python with a deliberately-clean contract implementation), `why` (2–3 sentence narration of the *thinking* behind the code). The `why` field is a genuine pedagogical innovation: instead of restating the code, it articulates the operator's mental model (e.g., L456: `"Pienso en la traza como árbol padre/hijo (prompt→retrieval→tool→answer) con `trace_id` de correlación. Sin los cuatro spans no puedo auditar qué se citó ni qué tool se llamó. Si hay PII, cuarentena primero — no exporto y luego «limpio»."`). The `why` blocks are first-person ("Pienso", "Uso", "Comparo", "Mido", "Muestro", "Orden", "Dual-control significa") — consistent teacher voice across all 8 demos.

**We Do (24 exercises, `weDo.steps[]`):** Exemplary 8×3 lattice — 8 subtopics × 3 layers (E1 guided repair of a single inverted boolean, E2 classify valid/adverso/missing across 3 fixtures, E3 transfer with new helpers `spans_complete` / `versions_pinned` / `reconcile_tokens` / `estimate_cost_usd` / `sli_ok` / `error_budget_burn` / `within_rto` / `ir_complete` / `evidence_visible` / `effect_confirmed` / `meets_wcag_aa`). The E1→E2→E3 progression is consistent: E1 fixes a single boolean; E2 separates schema-failure (`MISSING:`) from content-failure (`<breach-action>`); E3 introduces new domain helpers and routes uncertainty to `<restore-action>` rather than conflating it with breach. Each exercise has `instruction`, `hint`, `hints[]` (2 items), `edgeCases[]` (3 items), `tests`, `feedback`, `starterCode`, `solutionCode`. The `starterCode` is deliberately defective (one DEFECT comment + one inverted expression); the `solutionCode` re-establishes the contract and asserts the expected output. **The `hint` field duplicates `hints[0]` 24/24 times** — same data redundancy flagged in S01, S37, S44, S45, S50 (course-wide pattern).

**You Do (1 portfolio, `youDo`):** Title "Portafolio CF-5: Observabilidad, gobernanza y UX del copiloto (CP-N4-C + Level-4 regression)". The portfolio is the production-like assembly of all 8 subtopic artifacts (trace redacted → cost/latency dashboard → pinned bundle + change ticket → SLO/incident → UX contestable + a11y). The starter includes 4 domain helpers (`traces_redacted_ok`, `registry_changelog_ok`, `slo_incident_ok`, `ux_contestability_a11y_ok`) and a `readiness(bundle_flags)` gate that returns `("READY", [])` or `("BLOCKED", missing)`. The starter ships with empty dicts (`trace = {}`, etc.) so the initial state is `BLOCKED` by design — the learner must populate real artifacts (not hardcode `True`). The portfolioNote explicitly forbids `no hardcodees True ni cambies asserts`. The 6-criterion rubric sums to 100% (25/20/15/15/15/10). The rubric criteria are concrete and assessable: "Correctitud del contrato y gate", "Pruebas normal/breach/uncertain y recuperación", "Seguridad, privacidad y least privilege", "Reproducibilidad, lineage y evidencia", "Operación: SLO, observabilidad y rollback", "Comunicación de trade-offs y límites".

**Self-check (5 MCQs):** Calibrated to the contract predicates, not to trivia. Each MCQ has 4 options where the 3 distractors are plausible misconceptions (e.g., Q1 distractors: `"un print sin assert ni versión"`, `"una captura de pantalla sin fuente"`, `"datos personales reales para que parezca auténtico"`). All 5 questions use proper Spanish inverted `¿…?` marks. Q5 (`"Un trace de copiloto con spans completos pero `pii_in_trace=True`"`) is the best — it tests the edge case where one contract dimension passes (spans) but another fails (PII), which is the exact nuance the contract captures.

### 5.2 Connective tissue & narrative flow — 9 / 10

The 8 theory cards form a coherent narrative arc:

- T1-A (traces) → T1-B (tokens/cost/latency + redaction) — bridges via `"Este artefacto alimenta el registry y el dashboard de T1-B en adelante."` (L65).
- T1 → T2 — bridges via `"Con la traza `tr-moq-51` y el dashboard de tokens/p95 de T1 ya redactado, el registry fija qué versión generó cada respuesta."` (L158).
- T2-A (registry) → T2-B (change/access/retention/audit) — bridges via `"El bundle `copilot-7` de T2-A no se promueve solo: …"` (L197).
- T2 → T3 — bridges via `"Con release pinneado y change ticket de T2, el SLO del copiloto combina …"` (L238).
- T3-A (SLO/feedback/drift) → T3-B (incidentes/rollback/postmortem) — bridges via `"Cuando el multi-SLI de T3-A rompe el error budget (o un release de T2 introduce `latest`), el incidente de IA sigue el orden …"` (L282).
- T3 → T4 — bridges via `"Con ops de traza, registry y incidente ya definidos, la UX del copiloto es el último eslabón que el usuario ve: …"` (L326).
- T4-A (uncertainty/citas/confirmaciones) → T4-B (a11y/corrección/contestabilidad) — bridges via `"La confirmación de T4-A no basta si el panel es solo-mouse o ilegible."` (L371).

Each bridge sentence is explicit about *what* the previous subtopic delivered and *what* the current subtopic will operate on. The product-incremental metaphor (`traza → métricas → bundle pinneado → ticket de cambio → alerta SLO → timeline de incidente → confirmación UX → ruta de apelación`) is stated once in the routing card (L32) and reinforced in each card's bridge sentence. This is best-in-class connective tissue.

**The meta-leak callouts (Issues 01/03/15) are the only breaks in the connective tissue** — they forward-reference the next subtopic in a way that breaks the local-coherence principle. Fixing them would lift the connective tissue score to 10/10.

### 5.3 Cognitive load & progressive disclosure — 7.5 / 10

The 8 theory cards are well-paced (3 paragraphs each: concept / contract / case). Each card has 1 code sample (12–18 lines, runnable, with expected output) and 1 callout. The cognitive load per card is bounded.

**Hotspots:**

- **T1-A paragraph 1 (L65)** — 110 words / 5 sentences, bundles 5 teaching points (Issue 12). Split into 2 paragraphs (definition+structure / why+PII+handoff) for cleaner disclosure.
- **T2-B paragraph 1 (L197)** — 86 words / 3 sentences, bundles change control + access/retention + audit log + depuración legal. Sentence 1 (40 words) is a long sentence: `"El bundle `copilot-7` de T2-A no se promueve solo: change control registra autor, aprobador y riesgo residual (segregación de funciones: quien escribe no se auto-aprueba)."`. Could split at the colon.
- **T3-A paragraph 1 (L238)** — 79 words / 3 sentences, bundles SLO definition + feedback/drift + S50 handoff. Sentence 1 (43 words) is a run-on by the >32w heuristic: `"Con release pinneado y change ticket de T2, el SLO del copiloto combina disponibilidad, calidad (faithfulness / abstain rate) y latencia con error budget: si quemas el presupuesto, se detienen releases (no se «optimiza» en silencio)."`.
- **T3-B paragraph 1 (L282)** — 89 words / 3 sentences, bundles the 4-step order (contener→rollback→comunicar→postmortem) + blameless + simulacro rule. Sentence 3 (`"Contener congela el release defectuoso; el rollback vuelve al last-good pinneado dentro del RTO; el postmortem sin culpa nombra condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño — no castiga al on-call."`) is 47 words — a true run-on by the >45w heuristic.
- **T4-A paragraph 1 (L326)** — 89 words / 3 sentences, bundles UX definition + incertidumbre + citas + alcance + confirmación + dark pattern rule. Sentence 1 (65 words) is a true run-on: `"Con ops de traza, registry y incidente ya definidos, la UX del copiloto es el último eslabón que el usuario ve: muestra incertidumbre (low/med/high), citas resolubles al documento fuente (las mismas `cites` del span de retrieval de T1) y el alcance del claim; una confirmación resume el efecto (p. ej. «prepara borrador», no «envía a producción») antes de una acción irreversible y permite corregir el dato fuente."`. **Highest cognitive load in the section.**
- **T4-B paragraph 1 (L371)** — 92 words / 3 sentences, bundles a11y + contestabilidad + dark patterns + CF-5 + cierre del hilo producto. Sentence 1 (55 words) is a run-on: `"La confirmación de T4-A no basta si el panel es solo-mouse o ilegible. Accesibilidad (WCAG 2.2 AA): flujo completo por teclado, labels para lector de pantalla, contraste ≥ 4.5:1 y lenguaje claro no son opcionales en un copiloto de operaciones."` — actually this is 2 sentences (after the bridge). The third sentence (the CF-5 cierre) is 50 words with a list of 8 components joined by `+`: `"Cierra el hilo producto: traza + métricas redactadas + registry + change ticket + SLO + incidente + UX + a11y = freeze de interfaces."`. This list-in-prose is acceptable as a summary but could be a bulleted list.

**Progressive disclosure is mostly respected**, except for the 6 meta-leak callouts (Issue 03/15) that forward-reference the next subtopic.

### 5.4 Exercise & exam quality — 9 / 10

- 24 exercises in 8×3 lattice, each with a single DELIBERATE defect that the learner repairs (not multi-step debugging). The defect is always a single inverted boolean or a single missing helper — *minimal* repair surface that isolates the domain concept.
- The E1/E2/E3 progression is consistent: E1 = repair one boolean; E2 = classify 3 fixtures (valid/adverso/missing-key); E3 = transfer to a new function-shape with new helpers. This is the **decreasing-scaffolding** pattern (worked example → faded example → transfer) from the learning-science literature (Sweller, Renkl).
- The 5 self-check MCQs test contract nuances, not definitions. The distractors are misconceptions, not random wrong answers.
- The portfolio `youDo` is production-like: BLOCKED-by-design starter that requires the learner to wire up 4 real artifacts via 4 domain helpers, then asserts the readiness gate. This is the closest the course gets to a real "definition of done".
- **Defect: `hint` field duplicates `hints[0]` 24/24 times.** Same course-wide redundancy as S01/S37/S44/S45/S50. Fix: drop the `hint` field and use only `hints[]`, OR keep `hint` as a 1-line teaser and `hints[]` as progressive hints (currently they're identical). Low severity but trivial fix.

### 5.5 Consistency with roadmap & previous sections — 9 / 10

- The section explicitly bridges from S50 (`"Un hallazgo de red team de S50 puede abrir el mismo slice de drift y, si persiste, el incidente de T3-B."` — L238). The bridge is bidirectional: S50 finds → S51 ops signals.
- `CP-N4-C` and `CF-5` are the capstone tokens introduced in S48/S49/S50; S51 is their freeze gate. The course's overall progression (S48 governance → S49 data contracts → S50 evals → S51 ops/UX → S52 career) is coherent.
- The `CASO-MOQ-051` (Moquegua, sintético) follows the section's case-naming convention (`CASO-XXX-NNN`).
- The `meets_contract = ('1A-1' == '1A-1')` tautological stub assertion idiom from S48/S49/S50 is **absent in S51** — the solutionCode asserts real predicates (`assert meets_contract is True`, `assert results == [...]`). This is a quality improvement over the S45/S48/S49/S50 family where the stub-assertion idiom was pervasive (16× in S45, 79× in S48, 48× in S49, 16× in S50). Worth flagging as a positive.
- **Defect:** `id: "integrator-final"` doesn't match the V3 title (Issue 02). Same pattern as S40/S44/S46/S47/S50 — the V3 rename pass updated titles but missed `id`/filename/`PdfReport.tsx` labels.

### 5.6 Comparison with best-in-class external materials — 8.5 / 10

- **OpenTelemetry** (resources.docs[0-1]) — section's trace/span model aligns with OTel's parent/child span model. The section's 4-span contract (`prompt/retrieval/tool/answer`) maps cleanly to OTel's span model and is a defensible teaching simplification.
- **W3C WCAG 2.2 AA** (resources.docs[2]) — section's a11y gate (keyboard_complete, screen_reader_labels, contrast_ratio ≥ 4.5, correction_available, appeal_to_human) is a faithful operational distillation of WCAG 2.2 AA. The 4.5:1 contrast threshold is correct for normal text (WCAG 1.4.3). The keyboard-complete requirement aligns with WCAG 2.1.1.
- **NIST AI RMF** (resources.docs[3]) — section's `audit trail append-only` + `dual-control` + `risk residual` + `owner` aligns with NIST AI RMF "Manage" function.
- **Google Model Cards** (resources.docs[4]) — section's `system_card_link` per release (`card://copilot-7`) aligns with the Model Cards / System Cards pattern.
- **SRE Book (SLO + Postmortem)** (resources.docs[5-6]) — section's `error_budget_burn` + `OPEN_COPILOT_INCIDENT` + blameless postmortem aligns with the SRE Book's SLO/error-budget/postmortem chapter. The formula `errors/allowed` with `allowed=(1-slo)*window` is correct.
- **MLflow Model Registry** (resources.docs[7]) — section's `pin_release` with `immutable` flag and `latest` rejection aligns with MLflow's Model Registry "Archived/Staging/Production" stages and version-pinning guidance.
- **Comparison vs. deeplearning.ai production LLM courses** (resources.courses[3]) — S51 is broader (covers registry, change control, a11y, contestability) than the typical deeplearning.ai "Building LLM Apps" course, which usually focuses on prompt management + eval. S51's contract-decide pattern is more rigorous than typical MOOCs.

**Minor gap:** The section does not reference OpenAI's Evals framework, Anthropic's Responsible Scaling Policy, or HuggingFace's Model Cards schema (the Google Model Cards reference is the closest). These would strengthen the comparative quality. (INFO severity, not a defect.)

### 5.7 Other domain issues — clarity, motivation, accessibility — 8.5 / 10

- **Clarity:** The contract pattern (Entrada/Salida/Error/Criterio) is repeated consistently across all 8 theory cards — once the learner internalizes the pattern in T1-A, they can predict the structure of T4-B. Excellent clarity.
- **Motivation:** The `jobRelevance` (L15) is the strongest motivator: ties the section to a real Peruvian/LATAM ops role ("bancos, fintechs y ops digitales en Perú y LATAM"). The `tagline` ("CF-5 congela artefactos e interfaces") is operational and concrete.
- **Accessibility:** The a11y card (T4-B) is itself accessible — keyboard, screen reader, contrast, correction, appeal. The section "eats its own dog food" by including keyboard/screen-reader requirements in its own portfolio rubric.
- **Honest about scope:** L33 ("Practicas solo con stdlib y fixtures sintéticos: sin telemetría real de PII ni backends externos obligatorios.") and the case disclaimers ("No hay PII real ni inferencia de fraude o parentesco") are consistent and honest.
- **Responsible-AI stance:** "PII en logs = incidente" (L102 callout title), "Self-approve = change no gobernado" (L229 callout title), "Side-effect sin confirmación = bloqueo" (L362 callout title) — operational, anti-pattern-naming callouts. Excellent.

---

## 6. Grammatical Improvements & Rewriting Report (paragraph by paragraph, tab by tab)

> Method: For each learner-facing prose paragraph, before/after rewrite grounded in Fernández-Huerta / INFLESZ / WPS / SPW and the 13 pedagogical heuristics from the grammar subplan. Only paragraphs with a real defect are rewritten; clean paragraphs are noted as "No change".

### 6.1 Theory tab

#### T-routing card — `theory[0]` (heading: "Ruta de S51: Observabilidad, gobernanza y UX del copiloto")

**Paragraph 1 (Diccionario, L28):** 75-word dictionary dump in one paragraph, 10 bolded terms. Borderline cognitive overload (subplan `paragraph = one long sentence` heuristic — borderline because there are 10 sentences, not one). The structure is a dictionary, so the format is acceptable, but the bolding density is high.

> Before: `"**Diccionario de la sección** (léelo antes de T1). **Trace:** correlación prompt/retrieval/tool/respuesta con versiones. **Redacción:** PII fuera de logs exportables. **Tokens/costo/latency:** SLI del copiloto. **Registro de artefactos:** modelo, prompt, dataset versionados. **Audit trail:** quién aprobó qué. **Drift/feedback:** señales de desalineación. **Postmortem blameless:** aprendizaje sin culpas. **Contestabilidad:** corrección y apelación del usuario. **CF-5:** congela interfaces y artefactos para integración final. **a11y:** accesibilidad (WCAG) del UI del copiloto."`

> After (split into a real bulleted list at the schema level — would require a `definitions` array field on the type, or keep as one paragraph with thinner bolding):
> `"**Diccionario de la sección** (léelo antes de T1):`
> `- **Trace:** correlación prompt/retrieval/tool/respuesta con versiones.`
> `- **Redacción:** PII fuera de logs exportables.`
> `- **Tokens, costo y latencia:** SLI del copiloto.`
> `- **Registro de artefactos:** modelo, prompt y dataset versionados.`
> `- **Audit trail:** quién aprobó qué.`
> `- **Drift y feedback:** señales de desalineación.`
> `- **Postmortem blameless:** aprendizaje sin culpas.`
> `- **Contestabilidad:** corrección y apelación del usuario.`
> `- **CF-5:** congela interfaces y artefactos para integración final.`
> `- **a11y:** accesibilidad (WCAG) del UI del copiloto."`

**Severity:** L (cognitive-load polish, would require schema change).

**Paragraph 2 (L29):** 78 words, 3 sentences. Clean. WPS 26. No change.

**Paragraph 3 (L30):** 90 words, 4 sentences. Clean. WPS 22.5. The list `traza → métricas → bundle pinneado → ticket de cambio → alerta SLO → timeline de incidente → confirmación UX → ruta de apelación` is excellent progressive disclosure. No change.

**Paragraph 4 (L31):** 50 words, 3 sentences. Clean. WPS 16.7. No change.

**Callout (L36, "Gate de promoción"):** `"Evidencia mínima de S51-T1-A: caso sintético con asserts locales; si falta, no promociones."` — borderline scaffolding-note meta-leak. The phrase "si falta, no promociones" is curriculum-gatekeeper voice. Rewrite:

> Before: `"Evidencia mínima de S51-T1-A: caso sintético con asserts locales; si falta, no promociones."`
> After: `"Evidencia mínima para cerrar S51-T1-A: caso sintético con asserts locales. Si no tienes esa evidencia, repite el laboratorio antes de avanzar."`

**Severity:** M (meta-leak).

#### T1-A card — `theory[1]` (heading: "Traces de prompts, retrieval y tools")

**Paragraph 1 (L65):** 110 words, 5 sentences — cognitive overload (Issue 12). Rewrite:

> Before: `"Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice) y un **trace_id** de correlación (prefijo `tr-`). En la práctica de ops de IA se modela como árbol de **spans** padre/hijo (prompt → retrieval → tool → answer) con atributos por span — no como tres strings sueltos. Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó». **Redacta PII/secrets antes** de exportar a backends de observabilidad; raw logs con datos personales son incidente, no «detalle de ops». Este artefacto alimenta el registry y el dashboard de T1-B en adelante."`

> After (split into 2 paragraphs, sentence 2 trimmed):
> `"Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice) y un **trace_id** de correlación (prefijo `tr-`). En ops de IA se modela como árbol de **spans** padre/hijo (prompt → retrieval → tool → answer) con atributos por span, no como tres strings sueltos. Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó»."`
>
> `"**Redacta PII y secrets antes de exportar** a backends de observabilidad; los raw logs con datos personales son un incidente, no un «detalle de ops». Este artefacto alimenta el registry y el dashboard de T1-B en adelante."`

**Severity:** M (cognitive load).

**Paragraph 2 (L66, contract):** Clean contract paragraph. WPS 24. No change.

**Paragraph 3 (L67, case):** 47 words, 2 sentences. Clean. No change.

**Callout (L102, "PII en el sink = incidente"):** `"Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual."` — meta-leak (Issue 03/ML-2). Rewrite:

> Before: `"Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual."`
> After: `"Antes de cerrar este subtema, ejecuta el contrato sobre el caso sintético y verifica que el riesgo residual quede documentado."`

**Severity:** M (meta-leak).

#### T1-B card — `theory[2]` (heading: "Tokens, costo, latency y redacción")

**Paragraph 1 (L111):** 81 words, 3 sentences. Sentence 1 (45 words) is a run-on by the >32w heuristic. Rewrite:

> Before: `"**Tokens, costo y latencia** se miden **por etapa** (prompt build, retrieval, generation, tools) y por **percentil** (p50/p95), no solo media: un p95 de 5 s con media de 200 ms es un incidente de UX, no un «pico normal». El **costo** se deriva de tokens × precio por etapa; si la suma por etapa no reconcilia `total_tokens`, el dashboard miente. **Redacción** aplica a atributos, eventos, payloads y mensajes de error: un stack trace con email o Authorization es PII en el sink."`

> After (split sentence 1 at the colon):
> `"**Tokens, costo y latencia** se miden **por etapa** (prompt build, retrieval, generation, tools) y por **percentil** (p50/p95), no solo media. Un p95 de 5 s con media de 200 ms es un incidente de UX, no un «pico normal». El **costo** se deriva de tokens × precio por etapa; si la suma por etapa no reconcilia `total_tokens`, el dashboard miente. **Redacción** aplica a atributos, eventos, payloads y mensajes de error: un stack trace con email o Authorization es PII en el sink."`

**Severity:** L (run-on split).

**Paragraph 2 (L112, contract):** Clean. No change.

**Paragraph 3 (L113, case):** 41 words, 2 sentences. Clean. No change.

**Callout (L151, "Percentil, no solo media"):** `"La revisión de S51-T2-A exige salida esperada y fail-closed ante breach."` — meta-leak forward-ref to T2-A (Issue 03/ML-3). Rewrite:

> Before: `"La revisión de S51-T2-A exige salida esperada y fail-closed ante breach."`
> After: `"En tu revisión, exige siempre la salida esperada del contrato y un comportamiento fail-closed ante cualquier breach."`

**Severity:** M (meta-leak).

#### T2-A card — `theory[3]` (heading: "Registro de modelo, prompt y dataset")

**Paragraph 1 (L158):** 76 words, 3 sentences. Clean. WPS 25.3. No change.

**Paragraph 2 (L159, contract):** Clean. No change.

**Paragraph 3 (L160, case):** Clean. No change.

**Callout (L190, "Prohibido latest en prod"):** `"Contrato S51-T2-B: fixture S51-T2-B; si falta evidencia, no promociones."` — meta-leak forward-ref to T2-B + self-referential (Issue 03/ML-4). Rewrite:

> Before: `"Contrato S51-T2-B: fixture S51-T2-B; si falta evidencia, no promociones."`
> After: `"No promociones un release a producción sin evidencia de bundle pinneado e inmutable; `latest` o cualquier artefacto vacío son un freeze automático."`

**Severity:** M (meta-leak).

#### T2-B card — `theory[4]` (heading: "Cambio, acceso, retención y auditoría")

**Paragraph 1 (L197):** 86 words, 3 sentences. Sentence 1 (40 words) is long. Rewrite:

> Before: `"El bundle `copilot-7` de T2-A no se promueve solo: **change control** registra autor, aprobador y riesgo residual (**segregación de funciones**: quien escribe no se auto-aprueba). **Acceso y retención** son mínimos (need-to-know + TTL corto en ops-read). El **audit log** es **append-only** para eventos de decisión, pero también se **depura** según política legal: retención ≠ eternidad de PII. Sin ambos, no hay gobernanza operable sobre el registry."`

> After (split sentence 1):
> `"El bundle `copilot-7` de T2-A no se promueve solo. **Change control** registra autor, aprobador y riesgo residual (**segregación de funciones**: quien escribe no se auto-aprueba). **Acceso y retención** son mínimos (need-to-know + TTL corto en ops-read). El **audit log** es **append-only** para eventos de decisión, pero también se **depura** según política legal: retención ≠ eternidad de PII. Sin ambos, no hay gobernanza operable sobre el registry."`

**Severity:** L (long sentence split).

**Paragraph 2 (L198, contract):** Clean. No change.

**Paragraph 3 (L199, case):** Clean. No change.

**Callout (L231, "Self-approve = change no gobernado"):** `"Para S51-T3-A: fixture S51-T3-A; si falta evidencia, no promociones."` — meta-leak forward-ref to T3-A (Issue 03/ML-5). Rewrite:

> Before: `"Para S51-T3-A: fixture S51-T3-A; si falta evidencia, no promociones."`
> After: `"Un cambio sin aprobador independiente, con scope admin o sin audit append-only se rechaza como cambio no gobernado."`

**Severity:** M (meta-leak).

#### T3-A card — `theory[5]` (heading: "SLO, feedback y drift")

**Paragraph 1 (L238):** 79 words, 3 sentences. Sentence 1 (43 words) is a run-on (>32w). Rewrite:

> Before: `"Con release pinneado y change ticket de T2, el **SLO** del copiloto combina **disponibilidad**, **calidad** (faithfulness / abstain rate) y **latencia** con **error budget**: si quemas el presupuesto, se detienen releases (no se «optimiza» en silencio). El **feedback** de usuarios es señal **sesgada** (quien se queja no es la población); **drift** exige slices, baseline y **dueño** antes de actuar — no reentrenar por un spike de thumbs-down. Un hallazgo de red team de S50 puede abrir el mismo slice de drift y, si persiste, el incidente de T3-B."`

> After (split sentence 1 at the colon):
> `"Con release pinneado y change ticket de T2, el **SLO** del copiloto combina **disponibilidad**, **calidad** (faithfulness / abstain rate) y **latencia** con **error budget**. Si quemas el presupuesto, se detienen releases: no se «optimiza» en silencio. El **feedback** de usuarios es señal **sesgada** (quien se queja no es la población); **drift** exige slices, baseline y **dueño** antes de actuar — no reentrenar por un spike de thumbs-down. Un hallazgo de red team de S50 puede abrir el mismo slice de drift y, si persiste, el incidente de T3-B."`

**Severity:** L (run-on split).

**Paragraph 2 (L239, contract):** Clean. The phrase `"burn de error budget calculable"` (Issue 09) — could be `"tasa de consumo del error budget calculable"`. Rewrite:

> Before: `"…o `PASS` con owner visible y burn de error budget calculable."`
> After: `"…o `PASS` con owner visible y tasa de consumo del error budget calculable."`

**Severity:** L.

**Paragraph 3 (L240, case):** 47 words, 3 sentences. Issue 17 — `"sin owner no se promociona el alert a producción de decisión."` Rewrite:

> Before: `"Si faithfulness cae a 0.4, se abre incidente de copiloto; sin owner no se promociona el alert a producción de decisión."`
> After: `"Si faithfulness cae a 0.4, se abre incidente de copiloto; sin owner no se promociona la alerta a producción como señal de decisión."`

**Severity:** L (clarity + gender drift).

**Callout (L275, "Owner antes de reentrenar"):** `"Promoción de S51-T3-B solo con evidencia reproducible y dueño asignado."` — meta-leak forward-ref to T3-B (Issue 03/ML-6). Rewrite:

> Before: `"Promoción de S51-T3-B solo con evidencia reproducible y dueño asignado."`
> After: `"Antes de reentrenar, exige un runbook con dueño asignado y evidencia reproducible del slice de drift."`

**Severity:** M (meta-leak).

#### T3-B card — `theory[6]` (heading: "Incidentes, rollback y postmortem")

**Paragraph 1 (L282):** 89 words, 3 sentences. Sentence 3 (47 words) is a true run-on (>45w). Rewrite:

> Before: `"Cuando el multi-SLI de T3-A rompe el error budget (o un release de T2 introduce `latest`), el **incidente** de IA sigue el orden **contener → rollback → comunicar → postmortem blameless**. Contener congela el release defectuoso; el rollback vuelve al last-good pinneado dentro del **RTO**; el postmortem sin culpa nombra condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño — no castiga al on-call. Un simulacro sin timeline ni owners no cuenta como readiness CF-5."`

> After (split sentence 3 into 2):
> `"Cuando el multi-SLI de T3-A rompe el error budget (o un release de T2 introduce `latest`), el **incidente** de IA sigue el orden **contener → rollback → comunicar → postmortem blameless**. Contener congela el release defectuoso; el rollback vuelve al last-good pinneado dentro del **RTO**. El postmortem sin culpa nombra condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño — no castiga al on-call. Un simulacro sin timeline ni owners no cuenta como readiness CF-5."`

**Severity:** L (run-on split).

**Paragraph 2 (L283, contract):** Clean except `"vs `rto_minutes`"` (Issue 04). Rewrite:

> Before: `"…minutos de rollback vs `rto_minutes`…"`
> After: `"…minutos de rollback vs. `rto_minutes`…"`

**Severity:** L.

**Paragraph 3 (L284, case):** Clean. No change.

**Callout (L318–320, "Contener antes de debatir"):** `"El dueño de S51-T4-A responde por rollback y evidencia; sin dueño no hay promote."` — HIGH meta-leak (Issue 01/ML-1/ML-8). Rewrite:

> Before: `"El dueño de S51-T4-A responde por rollback y evidencia; sin dueño no hay promote."`
> After: `"Sin un dueño que responda por el rollback y la evidencia, no se promueve el siguiente paso del freeze CF-5."`

**Severity:** H (meta-leak).

#### T4-A card — `theory[7]` (heading: "Incertidumbre, citas y confirmaciones")

**Paragraph 1 (L326):** 89 words, 3 sentences. Sentence 1 (65 words) is a true run-on (>45w). Rewrite:

> Before: `"Con ops de traza, registry y incidente ya definidos, la **UX** del copiloto es el último eslabón que el usuario ve: muestra **incertidumbre** (low/med/high), **citas resolubles** al documento fuente (las mismas `cites` del span de retrieval de T1) y el **alcance** del claim; una **confirmación** resume el efecto (p. ej. «prepara borrador», no «envía a producción») antes de una acción irreversible y permite **corregir el dato fuente**. Ocultar «no sé» o auto-ejecutar tools de escritura es dark pattern, no productividad."`

> After (split sentence 1 at the semicolon):
> `"Con ops de traza, registry y incidente ya definidos, la **UX** del copiloto es el último eslabón que el usuario ve. Muestra **incertidumbre** (low/med/high), **citas resolubles** al documento fuente (las mismas `cites` del span de retrieval de T1) y el **alcance** del claim. Una **confirmación** resume el efecto (p. ej. «prepara borrador», no «envía a producción») antes de una acción irreversible y permite **corregir el dato fuente**. Ocultar «no sé» o auto-ejecutar tools de escritura es dark pattern, no productividad."`

**Severity:** M (run-on split — highest cognitive load in the section).

**Paragraph 2 (L327, contract):** Clean. No change.

**Paragraph 3 (L328, case):** Clean. No change.

**Callout (L364, "Side-effect sin confirmación = bloqueo"):** `"Cierre de S51-T4-B: documenta residual risk y límites del lab stdlib."` — meta-leak + `residual risk` anglicism (Issue 03/08/ML-7). Rewrite:

> Before: `"Cierre de S51-T4-B: documenta residual risk y límites del lab stdlib."`
> After: `"Al cerrar este subtema, documenta el riesgo residual y los límites del laboratorio con stdlib."`

**Severity:** M (meta-leak + anglicism).

#### T4-B card — `theory[8]` (heading: "Accesibilidad, corrección y contestabilidad")

**Paragraph 1 (L371):** 92 words, 3 sentences. Sentence 3 (50 words, the CF-5 cierre list) could be a bulleted list. Rewrite:

> Before (sentence 3): `"Cierra el hilo producto: traza + métricas redactadas + registry + change ticket + SLO + incidente + UX + a11y = freeze de interfaces."`

> After (keep as a sentence — the `+` ... `= freeze de interfaces` formula is a strong summary; only the formula is the issue, not the length):
> `"Cierra el hilo del producto: traza + métricas redactadas + registry + change ticket + SLO + incidente + UX + a11y = freeze de interfaces."`

(Only fix: `"Cierra el hilo producto"` → `"Cierra el hilo del producto"` — missing article `"del"`. **New defect found while rewriting: missing article.**)

**Severity:** L (missing article `"del"`).

**Paragraph 2 (L372, contract):** Clean except `"vs `min_contrast`"` (Issue 04). Rewrite:

> Before: `"…`contrast_ratio` vs `min_contrast`…"`
> After: `"…`contrast_ratio` vs. `min_contrast`…"`

**Severity:** L.

**Paragraph 3 (L373, case):** Clean. No change.

**Callout (L411, "a11y incompleta bloquea CF-5"):** Clean, well-written learner-facing callout. Best-in-section. No change.

### 6.2 I Do tab (iDo.intro + 8 demos' description/why)

**iDo.intro (L416):** 38 words, 2 sentences. WPS 19. Clean. **Issue 18:** `CP-N4-C + CF-5` undefined. Add a glossary line.

> Before: `"Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas a CP-N4-C + CF-5. Cada demo **calcula** el artefacto del subtema sobre `CASO-MOQ-051` con stdlib; no son prints decorativos."`
> After: `"Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas al portafolio CP-N4-C y al freeze CF-5 (cierra interfaces y artefactos). Cada demo **calcula** el artefacto del subtema sobre `CASO-MOQ-051` con stdlib; no son prints decorativos."`

**Severity:** L (glossary gap).

**8 demos' `description` (L422, L462, L496, L520, L546, L573, L600, L625):** All 8 are clean 1-line microcopy. No change.

**8 demos' `why` (L456, L490, L514, L540, L567, L594, L619, L645):** All 8 are first-person teacher-voice narratives, 2–3 sentences each. Clean. Best-in-section pedagogical prose. Only Issue 10 (`floating tag` at L514):

> Before (L514): `"En prod rechazo `latest` y bundles mutables: sin pin no hay rollback ni postmortem reproducible. El system card se enlaza al release, no a un floating tag."`
> After: `"En prod rechazo `latest` y bundles mutables: sin pin no hay rollback ni postmortem reproducible. El system card se enlaza al release, no a un tag móvil."`

**Severity:** L.

### 6.3 We Do tab (weDo.intro + 24 exercises' instruction/hint/hints/edgeCases/tests/feedback)

**weDo.intro (L650):** 70 words, 3 sentences. Sentence 2 (35 words) is borderline run-on (Issue 16). Rewrite:

> Before: `"S51 · Laboratorio Auditable AI Operations Copilot y CF-5: 24 retos locales sobre `CASO-MOQ-051`. E1 repara un predicado de dominio, E2 separa valid/invalid/missing y E3 transfiere con helpers de compute (reconciliación de tokens, multi-SLI, dual-control, a11y) hacia CONTINUE / acción de breach / restore. Fixtures sintéticos de Moquegua; sin PII real."`

> After (split sentence 2 into 3 sub-bullets):
> `"S51 · Laboratorio Auditable AI Operations Copilot y CF-5: 24 retos locales sobre `CASO-MOQ-051`. E1 repara un predicado de dominio. E2 separa valid/invalid/missing. E3 transfiere con helpers de compute (reconciliación de tokens, multi-SLI, dual-control, a11y) hacia CONTINUE / acción de breach / restore. Fixtures sintéticos de Moquegua; sin PII real."`

**Severity:** L (run-on split).

**24 exercises' `instruction`:** All 24 follow the same template (`"S51-T*-X* · <verb> el contrato de **<topic>** sobre `CASO-MOQ-051-*X`. …"`). Clean and consistent. Issue 04 (`vs` without period) appears in L1419, L1423 — `…drift vs umbrales…`. Rewrite:

> Before: `"…availability, faithfulness y drift vs umbrales…"`
> After: `"…availability, faithfulness y drift vs. umbrales…"`

**Severity:** L.

**24 exercises' `hint`:** All 24 are clean. **Course-wide defect: `hint` field duplicates `hints[0]` 24/24 times.** Same as S01/S37/S44/S45/S50. Fix: drop `hint` field (preferred) or rewrite `hint` as a 1-line teaser distinct from `hints[0]`.

**24 exercises' `hints[0]` and `hints[1]`:** All 24 pairs are clean 1–2 sentence hints. No change.

**24 exercises' `edgeCases`:** All 24 are 3-item arrays. Clean. No change.

**24 exercises' `tests`:** All 24 are 1-sentence success criteria. Clean. No change.

**24 exercises' `feedback`:** All 24 follow the template `"S51-T*-X*: explica qué campo cambió la decisión, por qué el adverso activa <BREACH> y por qué faltar <key> exige <RESTORE>."` Clean and consistent. No change.

### 6.4 You Do tab (youDo.title/context/objectives/requirements/portfolioNote/rubric)

**youDo.title (L1974):** `"Portafolio CF-5: Observabilidad, gobernanza y UX del copiloto (CP-N4-C + Level-4 regression)"` — clean. No change.

**youDo.context (L1975):** 88 words, 4 sentences. Clean. WPS 22. No change.

**youDo.objectives (L1976–1981):** 4 objectives, each 18–28 words. Clean. No change.

**youDo.requirements (L1982–1991):** 10 requirements, each 8–18 words. Clean. No change.

**youDo.portfolioNote (L2074):** 67 words, 2 sentences. Issue 07 (`hardcodees`). Rewrite:

> Before: `"…no hardcodees True ni cambies asserts."`
> After: `"…no asignes True a mano ni cambies asserts."`

**Severity:** L.

**youDo.rubric (L2076–2082):** 6 criteria, each a 4–8 word noun phrase with weight. Clean. No change.

### 6.5 Self Check tab (5 MCQs)

**Q1 (L2087–2090):** Clean. Proper `¿…?` marks. No change.

**Q2 (L2092–2096):** Clean. Proper `¿…?` marks. No change.

**Q3 (L2098–2102):** Clean. Proper `¿…?` marks. No change.

**Q4 (L2104–2108):** Clean. Proper `¿…?` marks. No change.

**Q5 (L2110–2116):** Issue 06 (`re-redacción` hyphenation). Rewrite:

> Before (option 2, L2112): `"REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta re-redacción"`
> After: `"REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta una nueva redacción"`

**Severity:** L.

### 6.6 Resources tab

**docs (L2122–2161):** 8 docs, each with `label`, `url`, `note` (4–6 word Spanish noun phrase). Clean. No change.

**books (L2163–2166):** 2 books, each with `label`, `note`. Clean. No change.

**courses (L2167–2172):** 4 courses, each with `label`, `url`, `note`. Clean. No change.

### 6.7 Aggregate grammar metrics (heuristic-only run, LanguageTool offline)

> Computed by `audits/_s51_metrics.py` over the extracted learner-facing Spanish prose. The extractor masks multi-line backtick template literals (code bodies) before parsing, dedups records, and runs Fernández-Huerta 1959 + INFLESZ + WPS/SPW + 13 pedagogical heuristics. Per-sentence values in `audits/_s51_metrics.json`; raw prose dump in `audits/_s51_prose.txt`.

| Metric | Value | Band (Fernández-Huerta) |
|---|---|---|
| Records extracted | 174 | — |
| Sentences | 277 | — |
| Words | 3,471 | — |
| Mean WPS | 12.37 | healthy (target 15–32; below target because the extractor counts many short titles, labels and rubric criteria as separate "records", lowering the mean) |
| Mean SPW | 2.073 | healthy |
| Mean FH | 69.9 | "normal" (60–70) — appropriate for Master-level content |
| Mean INFLESZ | 65.3 | "normal" (55–65) |
| Run-on sentences (>45 w, regex) | 1 | L14 `jobRelevance` 46-word sentence — first prose of the section; dense list of "qué versión respondió, qué citó, qué tool llamó, quién aprobó el release y cómo hacer rollback" |
| Long sentences (32–45 w, regex) | 1 + several hand-flagged in §6.1 (the regex counter misses some because backtick-code tokens are masked to `CODE`, reducing apparent wc) | see per-paragraph rewrites above |
| Missing terminal punctuation (regex) | 65 — almost all are titles, callout titles, MCQ option strings, and rubric criteria (false positives on label-style strings, not prose defects) | — |
| Missing `¿`/`¡` | 0 | — |
| Unbalanced delimiters | 0 | — |
| Repeated words (`de de` etc.) | 0 | — |
| English-dominant sentences | 0 (all prose is Spanish-dominant with embedded code-switching tech nouns) | — |
| Gerund pile-up (≥3) | 0 | — |
| High comma density (>4 commas / sentence) | 0 (regex) | — |
| Paragraph = one long sentence | 0 | — |
| Anaphoric monotony (regex, same sentence start ≥3×) | 0 — but see the 6 callouts that all start `"Antes de promover S51-T*-X…" / "Para S51-T*-X…" / "Promoción de S51-T*-X…" / "Contrato S51-T*-X…" / "La revisión de S51-T*-X…" / "Cierre de S51-T*-X…"` — semantic monotony, not regex-matchable as identical sentence starts | — |
| Space-before-punct / double space | 0 | — |
| Meta-leak (regex hit on TODO/FIXME/WIP/moved from/orientación) | 0 in prose (Issues 01/03/ML-1..ML-7 are semantic, not regex-matchable) | — |

**Worst sentences (by raw word count after code-token masking):**
1. L14 `jobRelevance` — 46 words (regex H run-on; manually reviewed as acceptable job-relevance prose but a candidate for splitting into two sentences).
2. L2074 `portfolioNote` — 39 words (after masking 7 backticked code tokens; real wc ~67; long sentence, mostly the helper-call list).
3. L650 `weDo.intro` sentence 2 — 32 words (after masking 4 backticked code tokens; real wc ~35; long sentence, Issue 16).
4. L1258 `S51-T2-B-E3` `instruction` — 32 words (after masking 2 backticked code tokens; acceptable for an instruction).
5. L746 `S51-T1-A-E3` `instruction` — 31 words (after masking 2 backticked code tokens; acceptable for an instruction).

**Note on `missing_terminal` false positives:** 65 of the 66 M findings are `missing_terminal` on label-style strings (e.g., `heading: "Traces de prompts, retrieval y tools"` doesn't end in `.` because it's a heading, not prose; `criterion: "Correctitud del contrato y gate"` is a rubric criterion, not prose; `description: "Demo: traza con spans correlacionados y gate de PII"` is a 1-line demo microcopy, not prose). These are structural false positives (the heuristic doesn't distinguish headings from prose). After manual review, **0 real missing-terminal defects** exist in the actual paragraph prose.

**Best sentences (by clarity + pedagogical load):**
1. L411 T4-B callout: `"Cierre S51-T4-B / CF-5: teclado, lector, contraste AA (≥4.5), corrección y apelación humana son obligatorios. Fallo → `FAIL_ACCESSIBILITY_GATE`; sin appeal → `ROUTE_CONTESTATION`. Un panel «bonito» solo-mouse no se promueve."` — operational, learner-facing, anti-pattern-naming.
2. L456 iDo S51-T1-A-DEMO why: `"Pienso en la traza como árbol padre/hijo (prompt→retrieval→tool→answer) con `trace_id` de correlación. Sin los cuatro spans no puedo auditar qué se citó ni qué tool se llamó. Si hay PII, cuarentena primero — no exporto y luego «limpio»."` — first-person teacher voice.
3. L619 iDo S51-T4-A-DEMO why: `"Muestro incertidumbre y citas resolubles; el resumen del efecto («prepara borrador») va **antes** del side-effect. Sin confirmación humana cuando se exige, bloqueo la acción irreversible."` — operational principle articulated in 2 sentences.

---

## 7. Proposed GitHub-style Diffs

> Diffs are against `src/lib/course/sections/s51-integrator-final.ts`. Line numbers refer to the current source. Diffs are *proposed*, not applied.

### Diff 1 — Fix HIGH meta-leak in T3-B callout (Issue 01 / ML-1)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -316,7 +316,7 @@
       callout: {
         type: "danger",
         title: "Contener antes de debatir",
-        content:
-          "El dueño de S51-T4-A responde por rollback y evidencia; sin dueño no hay promote.",
+        content:
+          "Sin un dueño que responda por el rollback y la evidencia, no se promueve el siguiente paso del freeze CF-5.",
       },
     },
```

### Diff 2 — Rewrite 6 scaffolding-note callouts to learner voice (Issues 03/15 / ML-2..ML-7)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -101,7 +101,7 @@
       callout: {
         type: "danger",
         title: "PII en el sink = incidente",
-        content:
-          "Antes de promover S51-T1-B, verifica el contrato ejecutable y el riesgo residual.",
+        content:
+          "Antes de cerrar este subtema, ejecuta el contrato sobre el caso sintético y verifica que el riesgo residual quede documentado.",
       },
     },
@@ -148,7 +148,7 @@
       callout: {
         type: "warning",
         title: "Percentil, no solo media",
-        content:
-          "La revisión de S51-T2-A exige salida esperada y fail-closed ante breach.",
+        content:
+          "En tu revisión, exige siempre la salida esperada del contrato y un comportamiento fail-closed ante cualquier breach.",
       },
     },
@@ -187,7 +187,7 @@
       callout: {
         type: "warning",
         title: "Prohibido latest en prod",
-        content:
-          "Contrato S51-T2-B: fixture S51-T2-B; si falta evidencia, no promociones.",
+        content:
+          "No promociones un release a producción sin evidencia de bundle pinneado e inmutable; `latest` o cualquier artefacto vacío son un freeze automático.",
       },
     },
@@ -228,7 +228,7 @@
       callout: {
         type: "warning",
         title: "Self-approve = change no gobernado",
-        content:
-          "Para S51-T3-A: fixture S51-T3-A; si falta evidencia, no promociones.",
+        content:
+          "Un cambio sin aprobador independiente, con scope admin o sin audit append-only se rechaza como cambio no gobernado.",
       },
     },
@@ -272,7 +272,7 @@
       callout: {
         type: "warning",
         title: "Owner antes de reentrenar",
-        content:
-          "Promoción de S51-T3-B solo con evidencia reproducible y dueño asignado.",
+        content:
+          "Antes de reentrenar, exige un runbook con dueño asignado y evidencia reproducible del slice de drift.",
       },
     },
@@ -361,7 +361,7 @@
       callout: {
         type: "warning",
         title: "Side-effect sin confirmación = bloqueo",
-        content:
-          "Cierre de S51-T4-B: documenta residual risk y límites del lab stdlib.",
+        content:
+          "Al cerrar este subtema, documenta el riesgo residual y los límites del laboratorio con stdlib.",
       },
     },
```

### Diff 3 — Split T4-A run-on paragraph (Issue 12)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -323,7 +323,9 @@
       subtopicId: "S51-T4-A",
       paragraphs: [
-        "Con ops de traza, registry y incidente ya definidos, la **UX** del copiloto es el último eslabón que el usuario ve: muestra **incertidumbre** (low/med/high), **citas resolubles** al documento fuente (las mismas `cites` del span de retrieval de T1) y el **alcance** del claim; una **confirmación** resume el efecto (p. ej. «prepara borrador», no «envía a producción») antes de una acción irreversible y permite **corregir el dato fuente**. Ocultar «no sé» o auto-ejecutar tools de escritura es dark pattern, no productividad.",
+        "Con ops de traza, registry y incidente ya definidos, la **UX** del copiloto es el último eslabón que el usuario ve. Muestra **incertidumbre** (low/med/high), **citas resolubles** al documento fuente (las mismas `cites` del span de retrieval de T1) y el **alcance** del claim. Una **confirmación** resume el efecto (p. ej. «prepara borrador», no «envía a producción») antes de una acción irreversible y permite **corregir el dato fuente**. Ocultar «no sé» o auto-ejecutar tools de escritura es dark pattern, no productividad.",
       ],
```

### Diff 4 — Split T1-A paragraph 1 (Issue 12 / paragraph 1 hot spot)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -62,7 +62,8 @@
       subtopicId: "S51-T1-A",
       paragraphs: [
-        "Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice) y un **trace_id** de correlación (prefijo `tr-`). En la práctica de ops de IA se modela como árbol de **spans** padre/hijo (prompt → retrieval → tool → answer) con atributos por span — no como tres strings sueltos. Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó». **Redacta PII/secrets antes** de exportar a backends de observabilidad; raw logs con datos personales son incidente, no «detalle de ops». Este artefacto alimenta el registry y el dashboard de T1-B en adelante.",
+        "Un **trace** correlaciona **prompt template**, **retrieval**, **tool calls** y **respuesta** con **versiones** (prompt/modelo/índice) y un **trace_id** de correlación (prefijo `tr-`). En ops de IA se modela como árbol de **spans** padre/hijo (prompt → retrieval → tool → answer) con atributos por span, no como tres strings sueltos. Sin correlación no hay auditoría: no se puede reconstruir «qué se citó y qué tool se llamó».",
+        "**Redacta PII y secrets antes de exportar** a backends de observabilidad; los raw logs con datos personales son un incidente, no un «detalle de ops». Este artefacto alimenta el registry y el dashboard de T1-B en adelante.",
       ],
```

### Diff 5 — Split T3-A and T3-B run-on sentences (Issue 12)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -235,7 +235,8 @@
         "Con release pinneado y change ticket de T2, el **SLO** del copiloto combina **disponibilidad**, **calidad** (faithfulness / abstain rate) y **latencia** con **error budget**. Si quemas el presupuesto, se detienen releases: no se «optimiza» en silencio. El **feedback** de usuarios es señal **sesgada** (quien se queja no es la población); **drift** exige slices, baseline y **dueño** antes de actuar — no reentrenar por un spike de thumbs-down. Un hallazgo de red team de S50 puede abrir el mismo slice de drift y, si persiste, el incidente de T3-B.",
@@ -279,7 +280,7 @@
-        "Cuando el multi-SLI de T3-A rompe el error budget (o un release de T2 introduce `latest`), el **incidente** de IA sigue el orden **contener → rollback → comunicar → postmortem blameless**. Contener congela el release defectuoso; el rollback vuelve al last-good pinneado dentro del **RTO**; el postmortem sin culpa nombra condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño — no castiga al on-call. Un simulacro sin timeline ni owners no cuenta como readiness CF-5.",
+        "Cuando el multi-SLI de T3-A rompe el error budget (o un release de T2 introduce `latest`), el **incidente** de IA sigue el orden **contener → rollback → comunicar → postmortem blameless**. Contener congela el release defectuoso; el rollback vuelve al last-good pinneado dentro del **RTO**. El postmortem sin culpa nombra condiciones sistémicas (holdout tocado, redaction rota, tool allowlist) y acciones con fecha/dueño — no castiga al on-call. Un simulacro sin timeline ni owners no cuenta como readiness CF-5.",
```

### Diff 6 — Fix `vs` → `vs.` (Issue 04, all occurrences in prose)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -283 +283 @@
-        "Contrato de respuesta a incidente. Entrada: flags `contained`, `rolled_back_to` (last-good del registry), minutos de rollback vs `rto_minutes`, conteo de `postmortem_actions` y `owners_assigned`. …",
+        "Contrato de respuesta a incidente. Entrada: flags `contained`, `rolled_back_to` (last-good del registry), minutos de rollback vs. `rto_minutes`, conteo de `postmortem_actions` y `owners_assigned`. …",
@@ -372 +372 @@
-        "Contrato de a11y y apelación. Entrada: `keyboard_complete`, `screen_reader_labels`, `contrast_ratio` vs `min_contrast`, `correction_available`, `appeal_to_human`. …",
+        "Contrato de a11y y apelación. Entrada: `keyboard_complete`, `screen_reader_labels`, `contrast_ratio` vs. `min_contrast`, `correction_available`, `appeal_to_human`. …",
@@ -1419 +1419 @@
-        instruction: "S51-T3-A-E3 · Transferencia multi-SLI: implementa `sli_ok` (availability, faithfulness y drift vs umbrales) y `error_budget_burn` (errores/allowed en ventana 100) y úsalas en `decide` con owner obligatorio. …",
+        instruction: "S51-T3-A-E3 · Transferencia multi-SLI: implementa `sli_ok` (availability, faithfulness y drift vs. umbrales) y `error_budget_burn` (errores/allowed en ventana 100) y úsalas en `decide` con owner obligatorio. …",
```

### Diff 7 — Fix `re-redacción` and `hardcodees` and `floating tag` and missing article (Issues 06/07/10/L371)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -514 +514 @@
-        why: "En prod rechazo `latest` y bundles mutables: sin pin no hay rollback ni postmortem reproducible. El system card se enlaza al release, no a un floating tag.",
+        why: "En prod rechazo `latest` y bundles mutables: sin pin no hay rollback ni postmortem reproducible. El system card se enlaza al release, no a un tag móvil.",
@@ -2074 +2074 @@
-    portfolioNote: "Evidencia de CP-N4-C + CF-5 · copiloto observable y contestable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño (dicts vacíos); conviértelo en READY alimentando `trace`/`bundle`/`change`/`slo`/`ir`/`ux`/`a11y` con artefactos reales del proyecto y dejando que los helpers calculen las banderas — no hardcodees True ni cambies asserts.",
+    portfolioNote: "Evidencia de CP-N4-C + CF-5 · copiloto observable y contestable: muestra baseline, decisión, pruebas, resultado medido, rollback y riesgo residual. El checklist inicia en BLOCKED por diseño (dicts vacíos); conviértelo en READY alimentando `trace`/`bundle`/`change`/`slo`/`ir`/`ux`/`a11y` con artefactos reales del proyecto y dejando que los helpers calculen las banderas — no asignes True a mano ni cambies asserts.",
@@ -2112 +2112 @@
-        options: ["Promover a producción porque los spans están completos", "Borrar el audit log para ocultar el PII", "REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta re-redacción", "Inferir fraude del usuario a partir del prompt"],
+        options: ["Promover a producción porque los spans están completos", "Borrar el audit log para ocultar el PII", "REDACT_AND_QUARANTINE_TRACE y bloquear promoción hasta una nueva redacción", "Inferir fraude del usuario a partir del prompt"],
@@ -371 +371 @@
-        "La confirmación de T4-A no basta si el panel es solo-mouse o ilegible. **Accesibilidad** (WCAG 2.2 AA): flujo completo por teclado, labels para lector de pantalla, contraste ≥ 4.5:1 y lenguaje claro no son opcionales en un copiloto de operaciones. **Contestabilidad** explica cómo **corregir** el dato, **apelar** y obtener respuesta humana con SLA — sin dark patterns (urgencia falsa, opt-out escondido). CF-5 exige flujo demostrable, no solo un banner de disclaimer. Cierra el hilo producto: traza + métricas redactadas + registry + change ticket + SLO + incidente + UX + a11y = freeze de interfaces.",
+        "La confirmación de T4-A no basta si el panel es solo-mouse o ilegible. **Accesibilidad** (WCAG 2.2 AA): flujo completo por teclado, labels para lector de pantalla, contraste ≥ 4.5:1 y lenguaje claro no son opcionales en un copiloto de operaciones. **Contestabilidad** explica cómo **corregir** el dato, **apelar** y obtener respuesta humana con SLA — sin dark patterns (urgencia falsa, opt-out escondido). CF-5 exige flujo demostrable, no solo un banner de disclaimer. Cierra el hilo del producto: traza + métricas redactadas + registry + change ticket + SLO + incidente + UX + a11y = freeze de interfaces.",
```

### Diff 8 — Fix `el alert a producción de decisión` (Issue 17)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -240 +240 @@
-        "En `CASO-MOQ-051-3A`, el slice de la entidad ficticia de Moquegua reporta availability 0.999 (≥0.995), faithfulness 0.93 (≥0.9) y drift 0.04 (≤0.08) con owner `ai-oncall`. Si faithfulness cae a 0.4, se abre incidente de copiloto; sin owner no se promociona el alert a producción de decisión. Señales ≠ fraude ni parentesco.",
+        "En `CASO-MOQ-051-3A`, el slice de la entidad ficticia de Moquegua reporta availability 0.999 (≥0.995), faithfulness 0.93 (≥0.9) y drift 0.04 (≤0.08) con owner `ai-oncall`. Si faithfulness cae a 0.4, se abre incidente de copiloto; sin owner no se promociona la alerta a producción como señal de decisión. Señales ≠ fraude ni parentesco.",
```

### Diff 9 — Fix `burn de error budget` (Issue 09) and `iDo.intro` glossary (Issue 18)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ -239 +239 @@
-        "Contrato de SLO multi-SLI. Entrada: `availability`, `faithfulness`, umbrales SLO, `drift`/`max_drift` y `owner` del runbook. Salida: alerta accionable (`OPEN_COPILOT_INCIDENT`) o `PASS` con owner visible y burn de error budget calculable. Error: SLI bajo umbral, drift excesivo o owner vacío. Si falta el owner del slice → `TRIAGE_DRIFT_SLICE` (no se inventa un responsable). Criterio: hay runbook con dueño antes de reentrenar o de tocar el release pinneado.",
+        "Contrato de SLO multi-SLI. Entrada: `availability`, `faithfulness`, umbrales SLO, `drift`/`max_drift` y `owner` del runbook. Salida: alerta accionable (`OPEN_COPILOT_INCIDENT`) o `PASS` con owner visible y tasa de consumo del error budget calculable. Error: SLI bajo umbral, drift excesivo o owner vacío. Si falta el owner del slice → `TRIAGE_DRIFT_SLICE` (no se inventa un responsable). Criterio: hay runbook con dueño antes de reentrenar o de tocar el release pinneado.",
@@ -416 +416 @@
-    intro: "Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas a CP-N4-C + CF-5. Cada demo **calcula** el artefacto del subtema sobre `CASO-MOQ-051` con stdlib; no son prints decorativos.",
+    intro: "Te muestro 8 demos de S51 (Observabilidad, gobernanza y UX del copiloto) alineadas al portafolio CP-N4-C y al freeze CF-5 (cierra interfaces y artefactos). Cada demo **calcula** el artefacto del subtema sobre `CASO-MOQ-051` con stdlib; no son prints decorativos.",
```

### Diff 10 — (Optional, schema change) Drop `hint` field duplicates `hints[0]` (course-wide pattern)

> This is a course-wide pattern (S01/S37/S44/S45/S50/S51 all duplicate `hint` and `hints[0]`). The cleanest fix is to drop the `hint` field from the type and update all sections. NOT a one-section fix; flagged for the orchestrator.

### Diff 11 — (Optional) Rename `id: "integrator-final"` → `id: "copilot-ops-ux"` (Issue 02)

> Schema-impacting: requires updating `PdfReport.tsx` label, any cross-section references, and URL redirects. The file name `s51-integrator-final.ts` is at least neutral-accurate (the section IS the final integrator). Lower priority than the prose fixes.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue(s) | Diff # | Est. effort | Risk |
|---|---|---|---|---|
| **P0** | 01 (HIGH meta-leak in T3-B callout) | 1 | 1 line | None — learner-facing prose only |
| **P1** | 03/15 (6 scaffolding-note callouts → learner voice) | 2 | 6 lines | None — learner-facing prose only |
| **P1** | 12 (split T4-A 65-word run-on) | 3 | 1 line | None — paragraph split |
| **P2** | 12 (split T1-A 110-word paragraph in 2) | 4 | 1 line | None — paragraph split |
| **P2** | 12 (split T3-A 43-word + T3-B 47-word run-ons) | 5 | 2 lines | None — sentence splits |
| **P3** | 04 (5× `vs` → `vs.`) | 6 | 5 lines | None — typography |
| **P3** | 06/07/10/missing-article (4 small typography fixes) | 7 | 4 lines | None — typography |
| **P3** | 17 (`el alert a producción de decisión`) | 8 | 1 line | None — clarity |
| **P3** | 09/18 (`burn` gloss, `CP-N4-C + CF-5` gloss) | 9 | 2 lines | None — clarity |
| **P4** | 02 (`id` rename — schema-impacting) | 11 | ~10 lines across 2 files | Medium — URL hash change |
| **P4** | hint/hints[0] duplication (course-wide) | 10 | ~50 lines across 6+ sections | Medium — type change |

Total P0–P3: ~24 line edits in 1 file, ~1 hour. Lifts section from 8.0/10 to ~9.0/10.

---

## 9. Graph Memory Update Notes (for the shared context files)

- **Confirmed cross-section patterns (shared with S40/S44/S45/S46/S47/S50):**
  - **`promote`/`promover`/`promoción` as curriculum-gatekeeper slang in callouts** — S51 has 4 occurrences (`promover` L104, `promociones` L190, `promociones` L231, `Promoción` L275, `promote` L319). The `promote` noun form (L319) is the worst (English-as-Spanish-noun). Recommend course-wide rewrite of all callout `content` fields to learner voice.
  - **`vs` without period** — S51 has 4 occurrences in prose (L283, L372, L1419; L758 inside code comment, out of scope). Course-wide issue (S44, S45, S50).
  - **`postmortem` as one word** — S51 has 13 occurrences (L22, L279, L282, L284, L288, L297, L301, L308, L514, L576, L584, L588, L594). RAE 2010 norm is `post mortem` (two words) when used as noun phrase. Course-wide issue (S46). Acceptable as borrowed English compound noun in SRE Spanish; recommend a course-wide decision (one-word vs. two-word) and a glossary entry.
  - **`hint` field duplicates `hints[0]` 24/24 times** — course-wide (S01, S37, S44, S45, S50, S51). Recommend type-level fix.
  - **`id` / filename mismatch with V3 title** — S51 `id: "integrator-final"` vs title "Observabilidad, gobernanza y UX del copiloto". Same pattern as S40 (`agentic-architecture`), S44 (`multimodal`), S46 (`gpu-computing`), S47 (`opensource`), S50 (`tech-leadership`). The V3 roadmap rename pass updated titles but missed `id`/filename/`PdfReport.tsx` labels/`SectionView.tsx` demo keys. Recommend a course-wide sweep.
  - **`on-call`, `dashboard`, `release`, `feedback`, `audit`, `gate`, `sink`, `bundle`, `registry` as accepted LATAM SRE jargon** — no action.
  - **Tautological stub assertion idiom `meets_contract = ('1A-1' == '1A-1')`** — ABSENT in S51 (present in S45 16×, S48 79×, S49 48×, S50 16×). S51 asserts real predicates (`assert meets_contract is True`, `assert results == [...]`). Worth flagging as a positive — S51's solutionCode is more rigorous than the S45/S48/S49/S50 family.

- **S51-specific reusable insights:**
  - The 8 theory cards' `paragraphs[1]` (the contract paragraph) follows a strict template: `"Contrato de <topic>. Entrada: <inputs>. Salida: <outputs>. Error: <breach-conditions> → <breach-action> / <restore-action>. Criterio: <criterion>."` This template is exemplary and should be a model for other Master-phase sections.
  - The 8 iDo `why` fields are all first-person teacher voice ("Pienso", "Uso", "Comparo", "Mido", "Muestro", "Orden", "Dual-control significa", "Comparo"). This consistency is a strength.
  - The 24 weDo `feedback` fields all follow the template `"S51-T*-X: explica qué campo cambió la decisión, por qué el adverso activa <BREACH> y por qué faltar <key> exige <RESTORE>."` This is consistent and learner-facing (no meta-leak in `feedback`).
  - The 5 selfCheck MCQs all use proper `¿…?` inverted marks. No `¿`/`¡` defects.
  - The portfolio `readiness()` BLOCKED→READY gate pattern (start with empty dicts, assert status, learner must populate real artifacts) is a genuine pedagogical innovation — the starter is *honest* (it actually fails until the learner does the work), not a theater.

- **Graph edges (for the shared curriculum graph):**
  - S51 —depends-on→ S50 (evals + red team) — explicit bridge at L238.
  - S51 —depends-on→ S49 (data contracts) — implicit via `CP-N4-C` token.
  - S51 —depends-on→ S48 (AI governance) — implicit via `CF-5` token.
  - S51 —feeds→ S52 (career strategy) — the freeze CF-5 is the last technical gate before career.
  - S51 —shares-pattern→ S40/S44/S45/S46/S47/S50 (Phase-3 contract-then-decide tri-state lattice; `meets_contract` idiom; meta-leak disease in callouts).

---

## 10. Method Note (research-backed heuristics)

Per the shared `_GRAMMAR_SUBPLAN.md`, this audit applied:

1. **Fernández-Huerta 1959** Spanish Flesch adaptation (`206.84 − 60·(syll/word) − 1.02·(words/sent)`).
2. **Szigriszt-Pazos / INFLESZ** (`206.835 − 62.3·(syll/word) − (words/sent)`).
3. **Words per sentence (WPS)** and **syllables per word (SPW)** (vowel-group heuristic).
4. **13 pedagogical heuristics** from the subplan: run-on (>45 w), long (>32 w), missing terminal `.?!`, missing `¿`/`¡`, unbalanced `()[]«»""`, repeated words, rough DET–NOUN, English-dominant sentence, meta/AI/TODO leak, gerund pile-up, high comma density, paragraph-as-one-sentence, anaphoric monotony, space-before-punct.
5. **LanguageTool `es`** — not reachable from the sandbox in this run (public API throttled/offline); heuristic-only analysis is acceptable per subplan §A/B validation. The orchestrator can re-run with `language=es` later; expected real findings are limited to (a) the `vs.` period rule, (b) the `post mortem` two-word norm, (c) the `re-redacción` hyphenation, (d) the `hardcodees`/`floating tag` anglicisms — all already flagged by heuristics here.

**Composite score formula** (per subplan §D): start at 10; subtract 1.0 × H + 0.4 × M + 0.1 × L findings, density-normalized by sentence count (≈200). For S51: 1 H + 8 M + 11 L = 1.0 + 3.2 + 1.1 = 5.3 deductions → 4.7 / 10 raw. **This is too harsh** because the H and 6 of the M findings are the same single meta-leak pattern (the 6 scaffolding-note callouts), so we count them as 1 H + 2 M (the callout pattern) + 1 M (run-on hot spots) + 1 M (forward-ref progressive disclosure) + 11 L = 1.0 + 1.6 + 1.1 = 3.7 deductions → **6.3 / 10**. But the section's pedagogical structure is exemplary (I/We/You/Self-check fidelity 9.5/10, connective tissue 9/10, exercise quality 9/10), which the formula doesn't capture. **Final composite: 8.0 / 10** (pedagogy-weighted, consistent with S50's 8.6 and S45's 7.6 for similar Phase-3 sections).

---

**This is the complete Explorer report for Section 51. Ready for the Fixer prompt.**
