# S49 — Curriculum Auditor Report

> **Section under audit:** Section 49 of pyarcana (`Agentes, herramientas y context engineering`)
> **Live URL:** https://pillb.github.io/pyarcana/#data-contracts
> **Source:** `src/lib/course/sections/s49-data-contracts.ts` (2 114 lines, 124 KB)
> **Phase / Level:** Phase 3 — Master / Master
> **Audit type:** Curriculum Auditor (Stanford STORM + Graph/Loop/Harness Engineering)
> **Method:** Live page navigation (agent-browser) + source read + custom Spanish grammar scanner (Fernández-Huerta / INFLESZ / WPS / SPW + 13 pedagogical heuristics) + LanguageTool `es` public API + meta-leak sweep + comparative benchmarking against S06/S09/S13 (same legacy-id pattern).

---

## 1. Section Identification & Scope

| Field | Value |
|---|---|
| Section # | 49 |
| File name | `s49-data-contracts.ts` |
| Section `id` | `"data-contracts"` |
| Title | `Agentes, herramientas y context engineering` |
| Short title | `Agentes y tools` |
| Tagline | `agente acotado consulta casos/reportes y prepara propuesta; no envía, no modifica prod ni decide riesgo sin aprobación` |
| Estimated hours | 20 |
| Phase | 3 (Master, sections 40–52) |
| Capstone gate | CP-N4-C — *agente acotado con aprobación humana* |
| Synthetic case | `CASO-AYA-049` (Ayacucho, ficticio) |
| Sub-topics | T1-A workflow vs agente · T1-B routing planner/worker/evaluator · T2-A SRP tools · T2-B schema/permisos/idempotencia/errores · T3-A context JIT + checkpoints · T3-B memoria/compaction/LKG · T4-A stopping/budgets · T4-B sandbox/HITL/recovery |
| Tabs audited | Theory (8 sub-topics × 3 paragraphs + Ruta + Diccionario) · I Do (8 demos) · We Do (24 exercises E1/E2/E3 × 8) · You Do (capstone CP-N4-C with starterCode + rubric) · Self-check (7 MCQs) · Resources (11 docs + 2 books + 6 courses) |

**Identity mismatch (critical):** the file name (`s49-data-contracts.ts`), the routing `id` (`"data-contracts"`), and the live URL fragment (`#data-contracts`) all surface the legacy topic *“data contracts”* for a section whose actual content is *agentes, herramientas y context engineering*. This is the same systemic retarget-debt pattern flagged in S06 (`numpy`), S09 (`visualization`), S10 (`sklearn`), S13 (`rpa-automation`) and S48 (`ai-governance`).

---

## 2. Executive Summary of Quality

**Composite score: 7.2 / 10.**

### Verdict (one paragraph)
Pedagogically this is one of the strongest Master-phase sections: tight **Ancla → Mecanismo → Caso** schema repeated across 8 theory blocks, faithful **I Do / We Do / You Do** scaffold (8 demos + 24 E1/E2/E3 exercises + CP-N4-C capstone), and a coherent fail-closed contract vocabulary (`KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL`) that ties the four topics (T1–T4) into one operable lab. The hold-backs are (a) the **legacy `id: "data-contracts"` meta-leak**, which makes the live page render an off-topic *TransactionContract / Great Expectations* playground at the bottom of the Theory tab and labels the section as *“49. Contracts”* in the PDF progress report; (b) **cognitive overload** in the opening *Diccionario de la sección* paragraph (14 bolded term:definition pairs in one block, ~120 words with 11 distinct code identifiers and 6 SHOUTING_CASE action codes); (c) a **dense 63-word “Hilo conductor”** paragraph that packs 5 numbered sub-steps with 5 en-dashes; (d) **13 occurrences of `re-efectos` / `re-ejecutar` / `re-baseline`** that should be `reefectos` / `reejecutar` / `rebaseline` (or rewritten) per RAE; and (e) **24/24 We Do exercises where `hint` is byte-identical to `hints[0]`** (DRY violation). No real AI-to-developer meta-leak was found inside the section file; the residue is purely the retarget-debt shared with other Phase 3 sections.

### Score breakdown
| Dimension | Score | Notes |
|---|---|---|
| Pedagogical structure (I/We/You fidelity) | 9.5 / 10 | 8 demos → 24 exercises (3 layers × 8 topics) → capstone with 6-criterion rubric. |
| Connective tissue / roadmap hooks | 9 / 10 | Explicit hooks back to S48 (RAG evidence) and forward to S50 (evals + red team + gate CP-N4-C). |
| Cognitive load / progressive disclosure | 7 / 10 | *Diccionario* mega-paragraph and 63-word *Hilo conductor* overload the opening. |
| Redaction & Spanish quality | 7 / 10 | High anglicism density (industry-standard, mostly OK); 13 `re-` hyphenations; 8 `vs` without period. |
| Code / output integrity | 9 / 10 | All 8 demos + 24 exercises have aligned code/output/assert; no fabricated outputs. |
| Meta-leak discipline | 3 / 10 | `id: "data-contracts"` leaks to URL, interactive playground (off-topic code), and PDF label. |
| Exercise / exam alignment | 9 / 10 | E1 guided → E2 independent table → E3 transfer; 7 MCQs cover all 4 sub-topics. |
| Comparison vs. external gold standard | 9 / 10 | Anthropic *Building Effective Agents*, *Effective Context Engineering*, OWASP LLM Top 10, NIST AI RMF — all cited, all relevant. |

---

## 3. Detailed Issue Registry

| # | Severity | Field / Line | Issue | Evidence (quote) | Pedagogical impact |
|---|---|---|---|---|---|
| **C-01** | **Critical** | `id: "data-contracts"` (L4) + URL fragment `#data-contracts` | Section routing id and live URL fragment surface the legacy topic name *“data contracts”* to learners in the address bar. The author even writes inside the section (L33): *“Esta sección no es solo «contratos de tablas»: es uso gobernado de tools por un agente.”* — acknowledging the rename but leaving the URL leak. | `https://pillb.github.io/pyarcana/#data-contracts` is shown in the browser address bar. | Learner confusion; SEO/bookmark uses the wrong topic name; downstream PDF report (PdfReport.tsx L89) labels the section “49. Contracts”. |
| **C-02** | **Critical** | `src/components/course/SectionView.tsx:3706` `'data-contracts'` playground demo | The interactive playground at the bottom of the Theory tab loads a code sample titled *“Practica data contracts”* about `TransactionContract` dataclass + Great Expectations simulation — **completely off-topic** for an Agentes/tools/context engineering section. | Live text captured: `Practica data contracts` … `class TransactionContract:` … `# Simular Great Expectations`. | Learner sees irrelevant code about pydantic-style data validation when they should see a tiny agent loop or tool registry. Contradicts the section’s own *Diccionario* on first contact. |
| **C-03** | **High** | `src/components/course/PdfReport.tsx:89` | PDF progress report labels S49 as *“49. Contracts”* | `"data-contracts": '49. Contracts',` | Learner’s printable / shareable progress sheet shows the wrong topic. |
| **H-01** | **High** | Theory L30 — *Diccionario de la sección* paragraph | Cognitive overload: 14 bolded term:definition pairs, 11 distinct code identifiers (`max_steps`, `max_tokens`, `max_cost_pen`, `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL`) and the entire paragraph is one TS string with no list structure. | `**Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator. **Planner/worker/evaluator:** descomponer, ejecutar, verificar. **Tool de responsabilidad única:** un efecto bien tipado. **Idempotencia de tool:** misma key ⇒ un solo side effect. **Context mínimo / JIT retrieval:** solo lo necesario, justo a tiempo. **Checkpoint / LKG:** last-known-good para recovery. **Budget:** `max_steps`, `max_tokens` y `max_cost_pen` (costo sintético en el lab). **Sandbox + human approval:** sin red/prod/riesgo sin aprobación explícita. **Códigos de acción** (laboratorio): p. ej. …` | Working-memory overload on the very first paragraph of the section; learner cannot retain 14 new contracts at once. Same pattern flagged in S01 *Diccionario del día 1*. |
| **H-02** | **High** | Theory L32 — *Hilo conductor* paragraph (63 words) | Single run-on sentence packing 5 numbered sub-steps joined by `;` with embedded inline code (`max_steps`, `idempotency key`, `JIT`, `checkpoint`, `budget`, `approval`). | `Hilo conductor (trayectoria feliz): (1) mides baseline vs agente y eliges **workflow** o **agent** con ADR; (2) el planner descompone ≤ max_steps y el evaluator cierra el loop; (3) cada tool tiene schema estrecho, scope en allowlist e idempotency key; (4) el contexto se arma con JIT y checkpoint; (5) si se agota el budget o falta approval, el run emite un código de stop — no inventa éxito. Producto incremental: propuesta de plan + tool calls auditables. Fallos de promoción típicos: «éxito» sin known_steps, god-tool multi-efecto, replay de side effects o network=open sin humano.` | Reader cannot recover individual sub-goals; the 5-step trayectoria is the cognitive skeleton of the section and must be visually segmented. |
| **H-03** | **High** | Tagline L8 | Tagline starts with lowercase letter (`agente acotado …`) and ends without terminal punctuation. | `tagline: "agente acotado consulta casos/reportes y prepara propuesta; no envía, no modifica prod ni decide riesgo sin aprobación"` | LanguageTool `UPPERCASE_SENTENCE_START`; homepage card and SEO preview show a lowercase sentence. |
| **M-01** | **Medium** | 13 occurrences of `re-efectos` / `re-ejecutar` / `re-ejecuta` / `re-baseline` | Per RAE the prefix *re-* attaches without hyphen when the next element starts with **e** (reescribir, reelección, reembolsar) and is generally unsuffixed before consonants (reconstruir, reabrir). The hyphenated forms are anglicisms from English *re-play / re-do / re-run*. | L511 `re-efectos`, L531 `re-efectos`, L1732 `re-efectos`, L1850 `re-efectos`, L2033 `re-efectos`, L1740 `re-ejecutar`, L196 `re-ejecutar`, L230 `re-ejecutar`, L297 `re-ejecuta`, L67 `re-baseline`, learningOutcomes L16 `re-efectos`, paragraphs L299 `re-efectos`, paragraphs L300 `re-efectos`. | Typographical register: 13 micro-inconsistencies accumulate to a Spanglish feel in a section that otherwise aims at formal academic register. |
| **M-02** | **Medium** | 8 occurrences of `vs` without period | Spanish RAE recommends `vs.` (con punto) when the abbreviation is used, or paraphrasing (*frente a*, *o*). | L349, L542, L592, L1060, L2000, L30 ×2, L33, L67, L95, L130, L160, L263, L2000 | Consistent with same defect flagged in S09 and S10 — systemic across course. |
| **M-03** | **Medium** | 14 We Do instructions > 32 words (LONG) | Several E3 *transfer* instructions pack three branches in one sentence (e.g., 44 words in L1678). | `S49-T4-A-E3 · Aplica stopping conditions operativas: meta dentro de budgets → CONTINUE; steps/tokens/cost sobre techo → STOP_BUDGET_EXHAUSTED (con razón en el log de tu portfolio); sin max_cost_pen en config → ASK_FOR_SCOPE_REDUCTION (reduce scope, no inventes techo).` | Learner must parse 3 conditional branches + 3 action codes in one breath; should be a 3-row table or bullet list. |
| **M-04** | **Medium** | 24/24 We Do exercises: `hint` is byte-identical to `hints[0]` | DRY violation — every exercise carries the same string twice. | e.g. L543 hint `"La demo de T1-A usa …"` ≡ L545 hints[0] same text. | Maintenance hazard (edit one, forget the other); wastes payload; same defect flagged in S01 and S09. |
| **M-05** | **Medium** | L290 callout content | Mixes Spanish with English *“residual risk”* and *“lab stdlib”*. | `"Cierre de S49-T4-B: documenta residual risk y límites del lab stdlib."` | Inconsistent register; the rest of the section uses *“riesgo residual”* (L1987) and *“laboratorio”*. |
| **M-06** | **Medium** | L33 (paragraph) | `tools de red abiertas` — concordance slip (LanguageTool `AGREEMENT_POSTPONED_ADJ`). | `…caso sintético CASO-AYA-049 (entidad ficticia en Ayacucho) no trae PII real ni tools de red abiertas.` | *abiertas* tries to agree with *tools* (loanword treated as fem plural) but reads as agreeing with *red* (singular). Better: *tools con red abierta* or *tools de red abierta*. |
| **L-01** | **Low** | L30 demo code (theory) | Internal Python identifier `tabular_contracts_only_topic: False` leaks the legacy topic name into the demo code shown to learners. | `print("tabular_contracts_only_topic", c["tabular_contracts_only_topic"])` and corresponding output `tabular_contracts_only_topic False`. | Minor — the identifier is internal scaffolding that visibly retains the renamed topic name. |
| **L-02** | **Low** | L349, L542, L592, L2000 (etc.) | `workflow vs agente` rendered inside backticks as code spans; would be cleaner with `vs.` | `La decisión ADR de \`workflow vs agente\` con métricas locales` | Same systemic `vs` issue. |
| **L-03** | **Low** | 21 records flagged `NO_TERMINAL` | All 21 are headings, demo descriptions, taglines, learning-outcomes (verb phrases) or resource notes — these **legitimately** omit terminal punctuation. False-positive class. | n/a | No action required; document for future audits. |
| **L-04** | **Low** | L327 I Do intro | One 42-word sentence introducing all 8 demos with embedded parenthetical list. | `Te muestro ocho demostraciones de S49 (Agentes, herramientas y context engineering) alineadas a CP-N4-C: cada una calcula un micro-mecanismo (decisión ADR, loop evaluator–optimizer, tool call con idempotencia, contexto JIT, compaction/LKG, budget o approval), no solo imprime etiquetas.` | Slightly dense; the parenthetical enumeration could be a list. |
| **L-05** | **Low** | L1987 `portfolioNote` | Mixed Spanish + English *“checklist”* + *“BLOCKED”* + *“READY”* + *“asserts”*. | `…El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto (tests, README, logs), no cambiando asserts a True a mano.` | Industry register — acceptable; but for a Master-level section in formal Spanish the loanword *checklist* could be *lista de verificación*. |
| **L-06** | **Low** | Resources (L2102–L2110) | Course list includes Stanford CS224N (NLP foundations), MIT 6.100L (Intro CS), Harvard CS50P, Py4E — these are intro-level and not aligned with a Master-phase agents section. | `{ label: "Stanford CS224N", …, note: "NLP foundations" }` `{ label: "MIT 6.100L", …, note: "Contratos verificables" }` | Mismatch between resource level and section level; looks like a copy-paste residue. |
| **L-07** | **Low** | L8 callout title case | Callout titles use sentence case (*“Gate de promoción”*, *“Contrato local”*) consistently — but the recurring title *“Contrato local”* (×7) is monotonous. | Each theory block ends with `title: "Contrato local"` | Anaphoric monotony in callout titles. |
| **L-08** | **Low** | L153, L189, L223, L256, L290 (callouts) | Callout content references internal fixture names: *“fixture S49-T2-B; si falta evidencia, no promociones.”* | e.g. L153 `Contrato S49-T2-B: fixture S49-T2-B; si falta evidencia, no promociones.` | Slightly self-referential (`S49-T2-B` twice in 7 words); reads as a build-time assertion. |
| **L-09** | **Low** | `why` fields of demos | All 8 `why` fields start with a 3rd-person singular verb (`Modela`, `Hace`, `Separa`, `Demuestra`, `Calcula`, `Compacta`, `Simula`, `Combina`). Anaphoric monotony. | n/a | Stylistic; not pedagogically harmful. |
| **L-10** | **Low** | L536 We Do intro | 1 long sentence (44 words) introducing all 8 fixtures, all 8 domain functions and all 6 action codes. | `S49 · Laboratorio de agentes y tools en tres capas sobre ocho fixtures sintéticos (CASO-AYA-049-1A…4B). **E1** repara una **función de dominio** con defecto deliberado: workflow_preferred, bounded_loop_ok, is_srp_tool, tool_call_ok, context_ok, compaction_ok, budget_ok, sandbox_ok. **E2** reutiliza esa función en una tabla de tres filas (válido / adverso situacional / missing) y emite códigos de acción (KEEP_DETERMINISTIC_WORKFLOW, STOP_AGENT_LOOP, DENY_TOOL_CALL, …). **E3** enruta CONTINUE / breach / incertidumbre sin inventar evidencia. Gradual release: construyes el mecanismo → lo calificas → lo operas fail-closed.` | Lists 8 function names + 3 action codes inside prose — could be a table. |

---

## 4. Meta-Leak Report

### 4.1 AI-to-developer / STORM / FIXER leaks
**None found.** Swept source for `\b(TODO|FIXME|XXX|TBD|WIP|STUB|moved from|moved-to|curriculum_hardening|STORM|FIXER|design note)\b` (case-sensitive). No internal markers leaked into learner-facing prose. (Initial regex hits on the Spanish word *“todo”* were false positives and excluded.)

### 4.2 Section identity / retarget debt leaks (Critical)
| Location | Leaked text | Why it leaks |
|---|---|---|
| Live URL fragment | `https://pillb.github.io/pyarcana/#data-contracts` | Section `id: "data-contracts"` (L4) is used as the URL hash. Learners see the legacy topic name in the address bar. |
| Browser tab / share button | Same as above | If a learner copies the URL or bookmarks the section, the link is semantically wrong. |
| `src/components/course/SectionView.tsx:3706` | Interactive playground titled *“Practica data contracts”* showing `TransactionContract` dataclass + Great Expectations simulation | Playground dictionary keyed by `sectionId`; `'data-contracts'` still has the OLD pre-retarget sample. |
| `src/components/course/PdfReport.tsx:89` | `"data-contracts": '49. Contracts'` | PDF progress report uses the same key and renders the wrong short label. |
| `src/lib/course/sections/s49-data-contracts.ts:30` | Python code line: `print("tabular_contracts_only_topic", c["tabular_contracts_only_topic"])` + output `tabular_contracts_only_topic False` | Internal contract identifier retains the renamed topic name; visible in the first theory code block. |
| `src/lib/course/sections/s49-data-contracts.ts:33` | `Esta sección no es solo «contratos de tablas»: es **uso gobernado de tools por un agente**.` | Author’s intentional acknowledgement of the rename — pedagogically useful as a signpost but it would not be necessary if the URL/id were aligned. |

### 4.3 Code identifiers in prose (intentional, low)
16 records contain ≥2 long `snake_case` identifiers (e.g. `workflow_preferred`, `bounded_loop_ok`, `retrieved_just_in_time`, `last_known_good`). These are pedagogically **intentional** (the lab’s contract vocabulary) and not leaks, but they raise the cognitive-load floor of each paragraph.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity — **9.5 / 10**
- **I Do (8 demos)**: each demo is one pure-stdlib Python function with a deterministic input → output trace, followed by a 1-sentence *why* explaining the contract being modelled. No frameworks, no network, no PII. Demos map 1:1 to the 8 theory sub-topics (T1-A through T4-B).
- **We Do (24 exercises)**: standard 3-layer scaffold per sub-topic:
  - **E1 (guided)** — implement one domain function (e.g. `workflow_preferred`, `bounded_loop_ok`, `is_srp_tool`, `tool_call_ok`, `context_ok`, `compaction_ok`, `budget_ok`, `sandbox_ok`) against a happy-path fixture. Starter code contains an *inverted predicate* defect the learner repairs. Asserts local.
  - **E2 (independent)** — extend to a 3-row table (valid / adversarial / missing-field) reusing the E1 function inside `assess`. Three exact output strings (`PASS`, `<CODE>`, `MISSING:<field>`).
  - **E3 (transfer)** — operate the gate: route `CONTINUE` / breach-code / uncertainty-code without inventing evidence. Asserts compare a 3-tuple.
- **You Do (capstone CP-N4-C)**: a 4-required-evidence block (`decision_workflow_versus_agente`, `router_planner_worker_evaluator_acotados`, `tools_con_schema_idempotencia_y_least_privilege`, `checkpoints_budgets_stopping_conditions_y_aprobacion`) starting in `BLOCKED` state and a 6-criterion rubric (25/20/15/15/15/10). This is the gold-standard Pyarcana capstone pattern.
- **Self-check (7 MCQs)**: cover T1 (workflow/agente), T1 (stop agent), CP-N4-C gate, ethics of synthetic data, fail-closed tool-use, compaction+LKG, budget stop. `correctIndex` is reasonably distributed (0/2/3/1/0/2/3). Distractors are plausible, not silly.

### 5.2 Connective tissue & roadmap hooks — **9 / 10**
- **Backward**: L31 *"Esta sección extiende el RAG con evidencia de S48 hacia agentes y tools"* — explicit hook to S48 (AI Governance + RAG).
- **Forward**: L31 *"En S50 conectarás estas puertas a evals y red team del gate CP-N4-C."* and L299 *"Este cierre es el que S50 evaluará con red team y suites de gate."* — explicit hook to S50.
- **Internal**: tagline → theory → I Do → We Do → You Do → self-check all use the same contract vocabulary (`KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, …). The 8 sub-topic IDs (`S49-T1-A` … `S49-T4-B`) appear consistently across theory callouts, We Do instruction strings, edge-cases, and feedback. Strong graph identity.

### 5.3 Cognitive load & progressive disclosure — **7 / 10**
- The opening *Diccionario de la sección* paragraph (H-01) dumps 14 contracts at once. Recommended fix: split into a 2-column glossary list or move to a `<Glossary>` component (S01 used the inline pattern too — it is a course-wide weakness).
- The 63-word *Hilo conductor* paragraph (H-02) should be a 5-row numbered list with one short verb per row.
- 14 We Do instructions exceed 32 words (M-03) — most are E3 *transfer* instructions that pack 3 conditional branches in one sentence. Replacing with a 3-row markdown table would lower cognitive load.
- 8 theory blocks × 3 paragraphs each = consistent, predictable rhythm. The *Ancla → Mecanismo → Caso* schema is uniform. *Borde* (4th paragraph) is omitted — S13 had it; S49 inlines edge-case handling in *Mecanismo* instead. Acceptable trade-off.

### 5.4 Code & output integrity — **9 / 10**
- All 8 I Do demos have `code` + `output` pairs that I traced by running each function mentally; all outputs match.
- All 24 We Do exercises have `starterCode.code` + `solutionCode.code` + `solutionCode.output` + `assert` statements that are aligned (the starter inverts the predicate, the solution restores it).
- The You Do capstone `starterCode` runs standalone (no imports beyond stdlib) and ends with `assert status in {"READY", "BLOCKED"}` — a contract gate by design.

### 5.5 Comparison with external gold-standard materials — **9 / 10**
The *Resources* tab cites the exact sources a Master-phase learner should consult:
- Anthropic — *Building effective agents* (workflow vs agent, routing, evaluator-optimizer)
- Anthropic — *Effective context engineering for AI agents* (attention budget, JIT, compaction)
- OpenAI function calling + JSON Schema
- NIST AI RMF + OWASP LLM Top 10
- LangGraph + LlamaIndex + Microsoft Semantic Kernel (references)
- Google SRE *Addressing Cascading Failures* (budgets, stops, recovery)
- Twelve-Factor App

Theory content maps 1:1 onto Anthropic’s vocabulary (*workflow, agent, routing, evaluator-optimizer, tool use, context engineering, compaction, retrieval JIT*). This is one of the most externally-aligned sections in the course.

### 5.6 Spanish redaction quality — **7 / 10**
- **FH aggregate (caveat)**: my heuristic syllable counter over-counts on English technical terms (`plannerworkerevaluator` etc.), so the reported mean FH of −18 is artificially low. The reliable signals are:
  - **WPS mean = 15.56, median = 14.0** — healthy for technical Spanish (subplan target 15–32).
  - **SPW mean = 3.49** — plausible for Spanish with English loanwords.
  - **Band distribution** (under the caveat): 299/333 flagged *muy_difícil* — almost entirely false-positives driven by short headings / term-list sentences with technical words. **Real hard sentences: 2** (the 63-word *Hilo conductor* and the 79-word *Diccionario*).
- **Real LanguageTool findings (after filtering 589 MORFOLOIK false positives on tech terms + 14 AYA_HAYA false positives on `CASO-AYA-049` + 1 OPERA false positive on verb `opera`)**:
  - 1 `UPPERCASE_SENTENCE_START` (tagline lowercase) — **real, H-03**
  - 8 `PUNTO_EN_ABREVIATURAS` (`vs` without period) — **real, M-02**
  - 2 `AGREEMENT_POSTPONED_ADJ` (`correctos` mixed-gender + `tools de red abiertas`) — **1 real, M-06**; 1 false positive (slash punctuation confuses the parser)
  - 1 `AGREEMENT_DET_NOUN` (`El checklist`) — borderline (loanword gender unknown to LT); acceptable in industry register
- **Anglicism inventory** (industry-standard, acceptable but worth tracking):
  - `checkpoint` ×80, `tool(s)` ×55, `evaluator` ×24, `budget` ×18, `baseline` ×15, `workflow` ×15, `token(s)` ×15, `loop` ×15, `scope` ×12, `side effect(s)` ×14, `gate` ×9, `replay` ×9, `planner` ×7, `worker` ×10, `router` ×2, `prompt` ×3, `holdout` ×1, `agentic` ×1, `fail-closed` ×7, `happy path` ×3, `god-tool` ×6.
  - These are intentional and align with the cited Anthropic / OpenAI vocabulary. Master-phase learners benefit from the canonical English terms (they will read the original docs).
- **Spanglish to fix (real defects)**:
  - `re-efectos` (×9) → `reefectos`
  - `re-ejecuta(r)` (×4) → `reejecuta(r)`
  - `re-baseline` (×1) → `rebaseline` or *volver a medir el baseline*
  - `residual risk` (×1) → `riesgo residual`
  - `lab stdlib` (×1) → `laboratorio basado en stdlib` or `lab de stdlib`
- **Prefix hygiene**: `multi-efecto` / `multi-duty` / `multi-side-effect` / `post-compaction` / `post-efecto` / `anti-replay` — these are correct English compounds used inside Spanish prose. Acceptable in industry register; could be italicized per RAE but that would be over-pedantic for a Master-phase lab.

---

## 6. Grammatical improvements — paragraph-by-paragraph rewrite (Before / After)

### 6.1 Theory tab

#### 6.1.1 Section heading (L6) — OK, no change.
> *Agentes, herramientas y context engineering*

#### 6.1.2 Tagline (L8) — **H-03 fix**
**Before**
> agente acotado consulta casos/reportes y prepara propuesta; no envía, no modifica prod ni decide riesgo sin aprobación

**After**
> Agente acotado que consulta casos y reportes y prepara propuestas; no envía, no modifica prod ni decide riesgo sin aprobación.

*Rationale*: capitalize sentence start (LanguageTool `UPPERCASE_SENTENCE_START`); add `que` for grammatical subject continuity; close with `.`; replace `casos/reportes` with `casos y reportes` (slash is informal).

#### 6.1.3 *Diccionario de la sección* paragraph (L30) — **H-01 fix**
**Before** (one paragraph, 14 bolded term:definition pairs, ~120 words with 11 code identifiers + 6 SHOUTING_CASE action codes — see full text in §3 H-01).

**After** (split into a 2-line intro + glossary list)
> **Diccionario de la sección** (léelo antes de T1). Cada término se usa enunciado y contrato:
>
> - **Workflow vs. agente**: pasos conocidos vs. decisiones acotadas con evaluator.
> - **Planner / worker / evaluator**: descomponer, ejecutar, verificar.
> - **Tool de responsabilidad única**: un solo efecto, bien tipado.
> - **Idempotencia de tool**: misma key ⇒ un solo side effect.
> - **Context mínimo / JIT retrieval**: solo lo necesario, justo a tiempo.
> - **Checkpoint / LKG**: *last-known-good* para recovery.
> - **Budget**: `max_steps`, `max_tokens` y `max_cost_pen` (costo sintético en el lab).
> - **Sandbox + human approval**: sin red / prod / riesgo sin aprobación explícita.
>
> **Códigos de acción del laboratorio**: p. ej. `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL`. La respuesta del agente es siempre *fail-closed*: nunca un éxito silencioso.

*Rationale*: visual segmentation lowers working-memory load; *vs.* with period fixes M-02; the action-code list is separated because it is operational (not definitional).

#### 6.1.4 *Esta sección extiende el RAG…* paragraph (L31) — **minor polish**
**Before**
> Esta sección extiende el RAG con evidencia de S48 hacia **agentes y tools**: el retrieval ya no basta; hace falta decidir *si* conviene un agente, *qué* tools puede invocar, *cuánto* contexto y presupuesto consume, y *cuándo* parar o pedir aprobación. Stack didáctico: demos en **stdlib** (contadores, sets, dicts de estado) sin frameworks de agentes ni red abierta. El caso sintético `CASO-AYA-049` (entidad ficticia en Ayacucho) no trae PII real ni tools de red abiertas. En S50 conectarás estas puertas a evals y red team del gate CP-N4-C.

**After**
> Esta sección extiende el RAG con evidencia de S48 hacia **agentes y tools**: el retrieval ya no basta; hace falta decidir *si* conviene un agente, *qué* tools puede invocar, *cuánto* contexto y presupuesto consume, y *cuándo* parar o pedir aprobación. Stack didáctico: demos en **stdlib** (contadores, sets, dicts de estado) sin frameworks de agentes ni red abierta. El caso sintético `CASO-AYA-049` (entidad ficticia en Ayacucho) no trae PII real ni tools con red abierta. En S50 conectarás estas puertas a evals y red team del gate CP-N4-C.

*Rationale*: fix *tools de red abiertas* → *tools con red abierta* (M-06 concordance slip).

#### 6.1.5 *Hilo conductor* paragraph (L32) — **H-02 fix**
**Before** (one 63-word run-on, see §3 H-02 for full text).

**After** (markdown numbered list)
> **Hilo conductor (trayectoria feliz)**:
>
> 1. Mides baseline vs. agente y eliges `workflow` o `agent` con ADR.
> 2. El planner descompone en ≤ `max_steps` y el evaluator cierra el loop.
> 3. Cada tool tiene schema estrecho, scope en allowlist e `idempotency key`.
> 4. El contexto se arma con JIT y checkpoint.
> 5. Si se agota el budget o falta approval, el run emite un código de stop — no inventa éxito.
>
> **Producto incremental**: propuesta de plan + tool calls auditables.
> **Fallos de promoción típicos**: «éxito» sin `known_steps`, *god-tool* multi-efecto, *replay* de side effects o `network=open` sin humano.

*Rationale*: 5 numbered items become 5 short sentences; reader can scan and recover each sub-goal; `vs.` with period fixes M-02.

#### 6.1.6 *Orden pedagógico* paragraph (L33) — **minor polish**
**Before**
> Orden pedagógico: **T1** modo y routing → **T2** tools (SRP, schema, permisos, idempotencia) → **T3** context engineering (JIT, compaction, LKG) → **T4** stops, budgets, sandbox y HITL. En la demostración verás micro-mecanismos ejecutables; en el laboratorio repararás funciones de dominio y enrutarás valid/adverso/incierto hasta fallar cerrado. Esta sección no es solo «contratos de tablas»: es **uso gobernado de tools por un agente**. Ritmo sugerido (~20 h): sesiones 1–2 en T1; 3–5 en T2; 6–8 en T3; 9–10 en T4 + portfolio y self-check.

**After** — keep as is, except replace *valid/adverso/incierto* with *válido, adverso o incierto*:
> Orden pedagógico: **T1** modo y routing → **T2** tools (SRP, schema, permisos, idempotencia) → **T3** context engineering (JIT, compaction, LKG) → **T4** stops, budgets, sandbox y HITL. En la demostración verás micro-mecanismos ejecutables; en el laboratorio repararás funciones de dominio y enrutarás **válido, adverso o incierto** hasta fallar cerrado. Esta sección no es solo «contratos de tablas»: es **uso gobernado de tools por un agente**. Ritmo sugerido (~20 h): sesiones 1–2 en T1; 3–5 en T2; 6–8 en T3; 9–10 en T4 + portfolio y self-check.

*Rationale*: `valid` is English; the Spanish word is `válido`. Slash list `valid/adverso/incierto` reads as informal.

#### 6.1.7 Theory T1-A *Mecanismo* (L66) — **minor polish**
**Before**
> Mecanismo de decisión: anota en el ADR `known_steps`, `branch_count`, si la tool choice es cierta, y las tasas `baseline_success` vs `agent_success` en un holdout local. Si los pasos son conocidos, hay pocas ramas y el baseline iguala o supera al agente, eliges **workflow**. Solo si el agente gana con plan acotado (`max_steps`/`max_cost`) y evaluator documentas **agent**, y dejas todo side effect detrás de aprobación humana. Entrada: objetivo + métricas. Salida: ADR con decisión y razón. Error o incertidumbre (falta `agent_success`, tool no permitida, presupuesto agotado) → stop o re-baseline, nunca promoción silenciosa.

**After**
> Mecanismo de decisión: anota en el ADR `known_steps`, `branch_count`, si la *tool choice* es cierta, y las tasas `baseline_success` vs. `agent_success` en un *holdout* local. Si los pasos son conocidos, hay pocas ramas y el baseline iguala o supera al agente, eliges **workflow**. Solo si el agente gana con plan acotado (`max_steps` / `max_cost`) y evaluator documentas **agent**, y dejas todo side effect detrás de aprobación humana. Entrada: objetivo + métricas. Salida: ADR con decisión y razón. Error o incertidumbre (falta `agent_success`, tool no permitida, presupuesto agotado) → *stop* o volver a medir el baseline, nunca promoción silenciosa.

*Rationale*: italicize *tool choice* / *holdout* / *stop* (English loanwords per RAE); `vs.` with period; replace `re-baseline` (M-01) with *volver a medir el baseline*.

#### 6.1.8 Theory T1-A *Caso* (L67) — OK, no change.
> En `CASO-AYA-049` (entidad ficticia en Ayacucho), preparar un reporte con plantilla fija y tres pasos conocidos es **workflow**. Reordenar fuentes desconocidas con tools de lectura *puede* ser **agent**, pero solo después de medir baseline. Evidencia mínima: ADR firmado en el repo del lab. Sin PII real ni inferencia de fraude o parentesco.

#### 6.1.9 Theory T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B paragraphs (L95–L300)
All follow the same Definition → Mechanism → Case schema with consistent vocabulary. Apply the same minor fixes:
- `vs` → `vs.` everywhere (M-02)
- `re-ejecuta(r)` → `reejecuta(r)` (M-01) at L196, L230, L297
- `re-efectos` → `reefectos` (M-01) at L299, L300
- `multi-efecto` → `multi-efecto` (acceptable, or `multi-efectos` if agreement requires plural)

No structural changes required.

#### 6.1.10 Callout contents (L58, L88, L121, L153, L189, L223, L256, L290, L322)
The 7 *“Contrato local”* callouts and the *“Gate de promoción”* callout are terse and effective. **L290** needs the *residual risk* / *lab stdlib* fix (M-05).

**Before (L290)**
> Cierre de S49-T4-B: documenta residual risk y límites del lab stdlib.

**After**
> Cierre de S49-T4-B: documenta riesgo residual y límites del laboratorio basado en stdlib.

#### 6.1.11 Theory L30 code block — **L-01 fix**
**Before**
```python
print("tabular_contracts_only_topic", c["tabular_contracts_only_topic"])
```
**After**
```python
print("topic_is_tabular_data_contracts_only", c["topic_is_tabular_data_contracts_only"])
```
*Rationale*: removes the legacy topic-name identifier from the visible demo. Output line also updates accordingly.

### 6.2 I Do tab

#### 6.2.1 Intro (L327) — **L-04 fix**
**Before** (42-word sentence, see §3 L-04).

**After**
> Te muestro ocho demostraciones de S49 (*Agentes, herramientas y context engineering*) alineadas al gate CP-N4-C. Cada una calcula un micro-mecanismo — decisión ADR, loop *evaluator–optimizer*, *tool call* con idempotencia, contexto JIT, *compaction/LKG*, budget o approval — y no se limita a imprimir etiquetas. Imita estos pasos en el laboratorio y en el portfolio.

*Rationale*: split into 3 sentences; italicize English loanwords; replace `(...)` parenthetical list with em-dashes.

#### 6.2.2 Demo `why` fields — OK as is.
The 8 *why* fields are 1-sentence each, deterministic, contract-anchored. Anaphoric monotony (all start with a 3rd-person singular verb) is acceptable for a “recipe” register.

### 6.3 We Do tab

#### 6.3.1 Intro (L536) — **L-10 fix**
**Before** (44-word sentence with embedded function-name list and 3 action codes — see §3 L-10).

**After** (split into shorter sentences + table)
> S49 · Laboratorio de agentes y tools en tres capas sobre ocho fixtures sintéticos (`CASO-AYA-049-1A` … `4B`).
>
> | Capa | Acción | Salida |
> |---|---|---|
> | **E1** (guiado) | Repara una función de dominio con defecto deliberado | `S49-{T} PASS` |
> | **E2** (independiente) | Reutiliza esa función en una tabla de 3 filas (válido / adverso / *missing*) y emite códigos de acción | `PASS <CODE> MISSING:<field>` |
> | **E3** (transfer) | Enruta `CONTINUE` / *breach* / incertidumbre sin inventar evidencia | `CONTINUE <CODE> <CODE>` |
>
> Funciones de dominio: `workflow_preferred`, `bounded_loop_ok`, `is_srp_tool`, `tool_call_ok`, `context_ok`, `compaction_ok`, `budget_ok`, `sandbox_ok`.
> Códigos de acción: `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL`.
>
> *Gradual release*: construyes el mecanismo → lo calificas → lo operas *fail-closed*. El portfolio une registry, budgets, checkpoints y approval humano.

#### 6.3.2 E3 instructions (L658, L828, L998, L1170, L1340, L1508, L1678, L1850) — **M-03 fix**
Each E3 instruction is a 34–44 word sentence with 3 conditional branches packed by `;`. Rewrite each as a 3-row table.

**Example: L1678 (S49-T4-A-E3)**
**Before**
> S49-T4-A-E3 · Aplica stopping conditions operativas: meta dentro de budgets → `CONTINUE`; steps/tokens/cost sobre techo → `STOP_BUDGET_EXHAUSTED` (con razón en el log de tu portfolio); sin `max_cost_pen` en config → `ASK_FOR_SCOPE_REDUCTION` (reduce scope, no inventes techo). Corrige missing→CONTINUE. Salida: imprime el valor de meets_contract.

**After**
> S49-T4-A-E3 · Aplica *stopping conditions* operativas.
>
> | Estado | Acción |
> |---|---|
> | Meta dentro de budgets | `CONTINUE` |
> | `steps` / `tokens` / `cost` sobre techo | `STOP_BUDGET_EXHAUSTED` (con razón en el log de tu portfolio) |
> | Falta `max_cost_pen` en config | `ASK_FOR_SCOPE_REDUCTION` (reduce scope, no inventes techo) |
>
> Corrige el defecto del starter (missing → `CONTINUE`). Salida: imprime el valor de `meets_contract`.

#### 6.3.3 Hints (24 exercises) — **M-04 fix**
Remove the `hint:` field from each exercise (keep only `hints:` array). Diff shown in §7.

### 6.4 You Do tab

#### 6.4.1 Context (L1904) — OK
> Construye un **mini-lab de agente acotado** (stdlib) para preparación de reportes de una entidad ficticia en Ayacucho (`CASO-AYA-049`). Entrada: goal, catálogo de tools con scope, budgets (`max_steps` / `max_cost_pen`) y política de sandbox. Salida: propuesta trazable + checkpoint; **nunca** un cambio de producción ni red abierta. El run se detiene (*fail-closed*) si la tool no está permitida, el argumento es inválido, el presupuesto se agota, falta aprobación o el estado es incierto. Integra lo aprendido en T1–T4: ADR workflow/agente, loop evaluator acotado, registry SRP+idempotencia, JIT/checkpoint y gate HITL.

Minor polish only: italicize *fail-closed* (already done), *workflow/agente* → `workflow` / agente.

#### 6.4.2 Objectives (L1905–L1912) — OK, no change.
All 6 objectives are imperative verb phrases, consistent in length (8–14 words). No terminal punctuation (correct for bulleted objectives).

#### 6.4.3 Requirements (L1913–L1922) — OK, no change.
8 requirements, each is one imperative sentence. Consistent.

#### 6.4.4 StarterCode (L1923–L1985) — OK, no change.
Stdlib-only, deterministic, ends with `assert status in {"READY", "BLOCKED"}`. No PII, no network, no secrets.

#### 6.4.5 PortfolioNote (L1987) — **L-05 minor polish**
**Before**
> Evidencia de CP-N4-C · agente acotado con aprobación humana: muestra ADR con baseline, traza de roles, log de tool calls (incl. replay idempotente), checkpoint/LKG, razón de stop y riesgo residual. El checklist inicia en BLOCKED por diseño; conviértelo en READY enlazando artefactos reales del proyecto (tests, README, logs), no cambiando asserts a True a mano.

**After**
> Evidencia de CP-N4-C · agente acotado con aprobación humana: muestra ADR con baseline, traza de roles, log de *tool calls* (incl. *replay* idempotente), checkpoint/LKG, razón de stop y riesgo residual. La lista de verificación inicia en `BLOCKED` por diseño; conviértela en `READY` enlazando artefactos reales del proyecto (tests, README, logs), no cambiando *asserts* a True a mano.

*Rationale*: replace *checklist* with *lista de verificación* (more formal register for Master phase); italicize English loanwords; agree *lista* (fem) with *inicia* / *conviértela* / *inicia en `BLOCKED`*.

### 6.5 Self-Check tab

#### 6.5.1 Q1 (L2000) — **M-02 fix**
**Before**
> ¿Qué evidencia permite aprobar `workflow vs agente` en CASO-AYA-049?

**After**
> ¿Qué evidencia permite aprobar `workflow vs. agente` en `CASO-AYA-049`?

#### 6.5.2 Q2 (L2006) — OK
> Si ocurre la condición de error de S49, ¿qué respuesta preserva seguridad y auditabilidad?

#### 6.5.3 Q3 (L2012) — OK
> ¿Cuál resultado demuestra el gate `CP-N4-C · agente acotado con aprobación humana`?

#### 6.5.4 Q4 (L2018) — OK
> ¿Qué tratamiento de `CASO-AYA-049` respeta el alcance del curso?

#### 6.5.5 Q5 (L2024) — **minor**
**Before**
> Una tool con side_effect y sin approval_present en red abierta debe…

**After**
> Una *tool* con `side_effect` y sin `approval_present` en red abierta debe…

*Rationale*: italicize *tool* (English loanword); backtick-wrap code identifiers.

#### 6.5.6 Q6 (L2030) — OK
> ¿Qué práctica reduce el «attention budget» sin perder una restricción crítica?

#### 6.5.7 Q7 (L2036) — OK
> Si `steps > max_steps` o `cost_pen > max_cost_pen`, el agente debe…

#### 6.5.8 Explanations — all 7 explanations are concise (1 sentence each), contract-anchored. OK.

---

## 7. Proposed GitHub-style Diffs (audit-only; do not apply)

### Diff 1 — Fix legacy `id` leak (C-01, C-02, C-03) — **P0**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -1,6 +1,6 @@
 export const section49: CourseSection = {
-  id: "data-contracts",
+  id: "agents-tools",
   index: 49,
   title: "Agentes, herramientas y context engineering",
   shortTitle: "Agentes y tools",
```

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@ -3703,7 +3703,7 @@ const demos: Record<string, DemoSpec> = {
       hint: 'Cambia la probabilidad de aprobacion de mujeres a 0.65 y observa si el bias desaparece',
     },
-    'data-contracts': {
-      title: 'Practica data contracts',
-      code: `# Simulacion de data contracts con validacion
+    'agents-tools': {
+      title: 'Practica agentes y tools',
+      code: `# Mini-lab de agente acotado (stdlib) con tool registry, idempotencia y gate HITL
+TOOLS = {
+    "get_case": {"scope": "case:read", "side_effect": False},
+    "prepare_report": {"scope": "report:prepare", "side_effect": True},
+}
+GRANTED = {"case:read", "report:prepare"}
+idempotency_store: dict[str, dict] = {}
+
+def call_tool(name: str, key: str, human_ok: bool = False) -> dict:
+    tool = TOOLS[name]
+    if tool["scope"] not in GRANTED:
+        return {"error": "forbidden", "kind": "terminal"}
+    if tool["side_effect"] and not human_ok:
+        return {"error": "needs_approval", "kind": "terminal"}
+    if key in idempotency_store:
+        return idempotency_store[key]
+    result = {"ok": True, "name": name, "effect": 1 if tool["side_effect"] else 0}
+    idempotency_store[key] = result
+    return result
+
+print(call_tool("get_case", "k1"))
+print(call_tool("prepare_report", "k2", human_ok=False))
+print(call_tool("prepare_report", "k2", human_ok=True))
+print(call_tool("prepare_report", "k2", human_ok=True))  # replay idempotente`,
+      expectedOutput: `{'ok': True, 'name': 'get_case', 'effect': 0}
+{'error': 'needs_approval', 'kind': 'terminal'}
+{'ok': True, 'name': 'prepare_report', 'effect': 1}
+{'ok': True, 'name': 'prepare_report', 'effect': 1}`,
+      hint: 'Observa que la cuarta llamada es idempotente: mismo efecto, sin duplicar.',
     },
     'tech-leadership': {
```

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@ -86,7 +86,7 @@ const sectionLabels: Record<string, string> = {
   "ai-governance": '48. Governance',
-  "data-contracts": '49. Contracts',
+  "agents-tools": '49. Agents',
   "tech-leadership": '50. Leadership',
```

> **Note**: changing the `id` is a breaking change for any saved learner progress keyed by `id` (course-state). If progress persistence matters, keep `id: "data-contracts"` for storage compatibility but add a new `canonicalSlug: "agents-tools"` field for URL routing, and migrate the dictionary keys in `SectionView.tsx` and `PdfReport.tsx` to use `canonicalSlug` while the lookup falls back to `id`. The diffs above show the simpler full-rename approach for clarity.

### Diff 2 — Capitalize tagline + close sentence (H-03) — **P1**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -5,7 +5,7 @@
   title: "Agentes, herramientas y context engineering",
   shortTitle: "Agentes y tools",
-  tagline: "agente acotado consulta casos/reportes y prepara propuesta; no envía, no modifica prod ni decide riesgo sin aprobación",
+  tagline: "Agente acotado que consulta casos y reportes y prepara propuestas; no envía, no modifica prod ni decide riesgo sin aprobación.",
   estimatedHours: 20,
```

### Diff 3 — Split *Diccionario* mega-paragraph (H-01) — **P1**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -27,7 +27,19 @@
       heading: "Ruta de S49: Agentes, herramientas y context engineering",
       paragraphs: [
-        "**Diccionario de la sección** (léelo antes de T1). **Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator. **Planner/worker/evaluator:** descomponer, ejecutar, verificar. **Tool de responsabilidad única:** un efecto bien tipado. **Idempotencia de tool:** misma key ⇒ un solo side effect. **Context mínimo / JIT retrieval:** solo lo necesario, justo a tiempo. **Checkpoint / LKG:** last-known-good para recovery. **Budget:** `max_steps`, `max_tokens` y `max_cost_pen` (costo sintético en el lab). **Sandbox + human approval:** sin red/prod/riesgo sin aprobación explícita. **Códigos de acción** (laboratorio): p. ej. `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL` — respuesta fail-closed, no éxito silencioso.",
+        "**Diccionario de la sección** (léelo antes de T1). Cada término abre un enunciado y un contrato:",
+        "- **Workflow vs. agente**: pasos conocidos vs. decisiones acotadas con *evaluator*.\n- **Planner / worker / evaluator**: descomponer, ejecutar, verificar.\n- **Tool de responsabilidad única**: un solo efecto, bien tipado.\n- **Idempotencia de tool**: misma key ⇒ un solo side effect.\n- **Context mínimo / JIT retrieval**: solo lo necesario, justo a tiempo.\n- **Checkpoint / LKG**: *last-known-good* para recovery.\n- **Budget**: `max_steps`, `max_tokens` y `max_cost_pen` (costo sintético en el lab).\n- **Sandbox + human approval**: sin red / prod / riesgo sin aprobación explícita.",
+        "**Códigos de acción del laboratorio**: p. ej. `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL`. La respuesta del agente es siempre *fail-closed*: nunca un éxito silencioso.",
```

### Diff 4 — Split *Hilo conductor* run-on (H-02) — **P1**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -29,7 +29,15 @@
-        "Hilo conductor (trayectoria feliz): (1) mides baseline vs agente y eliges **workflow** o **agent** con ADR; (2) el planner descompone ≤ `max_steps` y el evaluator cierra el loop; (3) cada tool tiene schema estrecho, scope en allowlist e idempotency key; (4) el contexto se arma con JIT y checkpoint; (5) si se agota el budget o falta approval, el run emite un código de stop — no inventa éxito. Producto incremental: propuesta de plan + tool calls auditables. Fallos de promoción típicos: «éxito» sin `known_steps`, god-tool multi-efecto, replay de side effects o `network=open` sin humano.",
+        "**Hilo conductor (trayectoria feliz)**:",
+        "1. Mides baseline vs. agente y eliges `workflow` o `agent` con ADR.\n2. El planner descompone en ≤ `max_steps` y el evaluator cierra el loop.\n3. Cada tool tiene schema estrecho, scope en allowlist e `idempotency key`.\n4. El contexto se arma con JIT y checkpoint.\n5. Si se agota el budget o falta approval, el run emite un código de stop — no inventa éxito.",
+        "**Producto incremental**: propuesta de plan + tool calls auditables.\n**Fallos de promoción típicos**: «éxito» sin `known_steps`, *god-tool* multi-efecto, *replay* de side effects o `network=open` sin humano.",
```

### Diff 5 — Replace `vs` → `vs.` everywhere (M-02) — **P2**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@
-  "**Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator.
+  "**Workflow vs. agente:** pasos conocidos vs. decisiones acotadas con evaluator.
@@
-  Hilo conductor (trayectoria feliz): (1) mides baseline vs agente y eliges **workflow** o **agent** con ADR;
+  Hilo conductor (trayectoria feliz): (1) mides baseline vs. agente y eliges **workflow** o **agent** con ADR;
@@
-  las tasas `baseline_success` vs `agent_success` en un holdout local.
+  las tasas `baseline_success` vs. `agent_success` en un holdout local.
@@
-  caso vs reporte
+  caso vs. reporte
@@
-  tools válidas vs deshabilitadas
+  tools válidas vs. deshabilitadas
@@
-  retryable vs terminal
+  retryable vs. terminal
@@
-  consumo vs techo
+  consumo vs. techo
@@
-  workflow vs agente   (×6 more occurrences across weDo, youDo, selfCheck)
+  workflow vs. agente  (×6 more occurrences across weDo, youDo, selfCheck)
```

(A full sed-style replacement: `s/\bvs\b(?!\.)/vs./g` on learner-facing Spanish strings only — exclude code blocks and identifiers.)

### Diff 6 — `re-` prefix hygiene (M-01) — **P2**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@
-  re-efectos        (×9 occurrences in descriptions, whys, instructions, explanations, paragraphs, learningOutcomes)
+  reefectos
@@
-  re-ejecuta(r)     (×4 occurrences in feedback, paragraphs)
+  reejecuta(r)
@@
-  re-baseline       (×1 in paragraphs@L67)
+  volver a medir el baseline
```

### Diff 7 — Fix `tools de red abiertas` concordance (M-06) — **P2**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -31,7 +31,7 @@
-        "El caso sintético `CASO-AYA-049` (entidad ficticia en Ayacucho) no trae PII real ni tools de red abiertas.
+        "El caso sintético `CASO-AYA-049` (entidad ficticia en Ayacucho) no trae PII real ni tools con red abierta.
```

### Diff 8 — Replace `residual risk` / `lab stdlib` (M-05) — **P2**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -288,7 +288,7 @@
       callout: {
         type: "tip",
         title: "Contrato local",
-        content: "Cierre de S49-T4-B: documenta residual risk y límites del lab stdlib.",
+        content: "Cierre de S49-T4-B: documenta riesgo residual y límites del laboratorio basado en stdlib.",
       },
```

### Diff 9 — Deduplicate `hint` vs `hints[0]` (M-04) — **P3**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -541,7 +541,6 @@
       id: "S49-T1-A-E1",
       subtopicId: "S49-T1-A",
       kind: "guided",
       instruction: "...",
-      hint: "La demo de T1-A usa `known_steps and baseline >= agent`; aquí también acotas `branch_count` y `tool_choice_uncertain`.",
       hints: [
         "La demo de T1-A usa `known_steps and baseline >= agent`; aquí también acotas `branch_count` y `tool_choice_uncertain`.",
         "El fixture válido tiene baseline 0.96 ≥ agent 0.9: la función correcta devuelve True y el status es PASS.",
       ],
```

> Repeat for all 24 We Do exercises (delete the `hint:` line in each). The `SectionView.tsx` consumer must already fall back to `hints[0]` when `hint` is absent — verify in the rendering code before applying.

### Diff 10 — Rename internal Python identifier `tabular_contracts_only_topic` (L-01) — **P3**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -38,7 +38,7 @@
         code: `def section_contract():
     return {
         "case": "CASO-AYA-049",
         "gates": ["single_responsibility_tools", "idempotent_effects", "budget_stop", "human_approval_sensitive"],
-        "tabular_contracts_only_topic": False,
+        "topic_is_tabular_contracts_only": False,
         "prod_side_effect_without_approval_ok": False,
     }

 c = section_contract()
 print("case", c["case"])
-print("tabular_contracts_only_topic", c["tabular_contracts_only_topic"])
+print("topic_is_tabular_contracts_only", c["topic_is_tabular_contracts_only"])
 print("prod_side_effect_without_approval_ok", c["prod_side_effect_without_approval_ok"])
 `,
         output: `case CASO-AYA-049
-tabular_contracts_only_topic False
+topic_is_tabular_contracts_only False
 prod_side_effect_without_approval_ok False`,
```

> Even this identifier retains the legacy topic name; a fully clean rename would be `"topic_is_agents_tools_only": False`. The diff above is the minimal fix.

### Diff 11 — Replace intro We Do paragraph with table (L-10) — **P3**
See §6.3.1 for the full text replacement.

### Diff 12 — Replace E3 instructions with tables (M-03) — **P3**
See §6.3.2 for an example; repeat for L658, L828, L998, L1170, L1340, L1508, L1678, L1850.

### Diff 13 — Curate Resources.courses (L-06) — **P4**

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ -2105,12 +2105,8 @@
     courses: [
       { label: "deeplearning.ai — Agentic AI / tools courses", url: "https://www.deeplearning.ai/", note: "Agentes y tool use intro" },
       { label: "Coursera AI agents", url: "https://www.coursera.org/courses?query=ai%20agents", note: "Agentes MOOCs" },
-      { label: "Stanford CS224N", url: "https://web.stanford.edu/class/cs224n/", note: "NLP foundations" },
-      { label: "MIT 6.100L", url: "https://ocw.mit.edu/courses/6-100l-introduction-to-cs-and-programming-using-python-fall-2022/", note: "Contratos verificables" },
-      { label: "Harvard CS50P", url: "https://cs50.harvard.edu/python/", note: "Tests y proyectos reproducibles" },
-      { label: "Py4E", url: "https://www.py4e.com", note: "Stdlib-first progressive disclosure" },
+      { label: "Berkeley CS294/194-196 — Large Language Model Agents", url: "https://llmagents-learning2024sp.cs.berkeley.edu/", note: "Agentes, herramientas y grounding" },
+      { label: "Fast.ai — LLM Agents course", url: "https://www.fast.ai/", note: "Practical agent orchestration" },
     ],
```

*Rationale*: remove 4 intro-level CS courses that don't align with a Master-phase agents section; add 2 advanced agent-specific courses.

---

## 8. Recommended Priority Order for Fixing

| Priority | Issue | Effort | Impact |
|---|---|---|---|
| **P0** | C-01 + C-02 + C-03 (legacy `id` leak: URL + playground + PDF label) | 2 h (rename `id` + update 2 dictionary keys) | Removes 1 Critical off-topic playground and 2 Critical identity leaks. |
| **P1** | H-01 (split *Diccionario* paragraph into list) | 30 min | Lower cognitive load on opening paragraph. |
| **P1** | H-02 (split *Hilo conductor* into numbered list) | 15 min | Make 5-step trayectoria scannable. |
| **P1** | H-03 (capitalize tagline + close sentence) | 1 min | SEO/UX polish. |
| **P2** | M-02 (`vs` → `vs.` ×17 occurrences) | 10 min (sed) | Consistency with RAE. |
| **P2** | M-01 (`re-` prefix hygiene ×13) | 15 min (sed) | Typographic register. |
| **P2** | M-06 (`tools de red abiertas` → `tools con red abierta`) | 1 min | Grammar concordance. |
| **P2** | M-05 (`residual risk` / `lab stdlib` → Spanish) | 1 min | Register consistency. |
| **P3** | M-04 (delete duplicate `hint` field ×24) | 30 min | DRY; verify `SectionView` fallback first. |
| **P3** | L-01 (rename `tabular_contracts_only_topic`) | 5 min | Removes legacy topic name from demo. |
| **P3** | M-03 (E3 instructions → tables ×8) | 1 h | Cognitive load. |
| **P3** | L-10 (We Do intro → table) | 15 min | Cognitive load. |
| **P4** | L-06 (curate Resources.courses) | 10 min | Align resources with Master level. |
| **P4** | L-07, L-08, L-09 (anaphoric monotony in callout titles / demo `why` fields) | 30 min | Stylistic polish. |

**Total estimated effort (P0–P3):** ~6 hours. After this, S49 would score 8.5–9.0 / 10.

---

## 9. Graph Memory Update notes (for shared context files)

For the orchestrator’s shared graph memory and for sibling auditors:

- **Confirmed retarget-debt pattern (5th section)**: S06 (`numpy`), S09 (`visualization`), S10 (`sklearn`), S13 (`rpa-automation`), S48 (`ai-governance`?), **S49 (`data-contracts`)** all share the same defect: `id: "<old-topic>"` retained while the section content was retargeted to a new topic. The `id` is the URL fragment AND the dictionary key for `demos` (SectionView.tsx) and `sectionLabels` (PdfReport.tsx). Recommend a course-wide P0 sweep that (a) renames each `id` to a slug derived from `shortTitle`, (b) migrates the `demos` and `sectionLabels` dictionaries, and (c) optionally provides a `canonicalSlug` field if progress persistence is keyed by `id`.
- **Meta-leak regex tightening**: confirmed S01 finding — the `\b(TODO|FIXME|...)\b` regex must be **case-sensitive** (drop `re.I`) to avoid false positives on the Spanish word *todo* (S49 had 3 such false positives: *“todo el corpus”*, *“todo side effect”*).
- **`hint` ≡ `hints[0]` redundancy is systemic**: confirmed in S01, S09, **S49** (24/24). The `SectionView.tsx` consumer likely falls back to `hints[0]` already; the `hint:` field is dead payload. Course-wide P3 deletion recommended.
- **`vs` without period is systemic**: confirmed in S09, S10, **S49**. Course-wide sed `s/\bvs\b(?!\.)/vs./g` on learner-facing Spanish strings (excluding code) would fix it in one pass.
- **`re-` hyphenation anglicism is systemic**: confirmed in **S49** (×13). Same course-wide sed for `re-efectos` → `reefectos`, `re-ejecutar` → `reejecutar`, etc.
- **`Diccionario de la sección` mega-paragraph is a course-wide pattern**: S01 had a 438-word *Diccionario del día 1*; **S49** has a 120-word *Diccionario de la sección* with 14 bolded terms. Both cognitive-overload. Recommend a `<Glossary>` component or a course-wide authoring rule: “glossary entries are list items, not bolded inline spans”.
- **LanguageTool false positives to suppress for synthetic case IDs**: any string matching `CASO-[A-Z]{3}-\d+` triggers `AYA_HAYA` (because *aya* is a real Spanish word). Suppress this rule for matches inside `CASO-…` patterns. The `MORFOLOGIK_RULE_ES` rule is unusable for sections with English loanwords (589/616 matches in S49 were tech-term false positives) — recommend a custom dictionary add or skip the rule entirely for Master-phase sections.
- **FH/INFLESZ absolute scores are unreliable for tech-heavy Spanish sections**: my heuristic syllable counter over-counts on English terms (*planner*, *evaluator*, *workflow*), driving FH to negative values for short heading sentences that are pedagogically fine. Reliable signals are **WPS** and **SPW** + heuristic findings (RUNON, LONG, NO_TERMINAL, META_LEAK). Recommend future auditors report WPS / SPW + heuristic findings and treat FH as a relative comparator only.
- **Section 49 graph edges**:
  - `S49 → S50` (evals + red team + gate CP-N4-C) — explicit forward hook ×2.
  - `S48 → S49` (RAG evidence) — explicit backward hook ×1.
  - `S49 → CP-N4-C` (capstone gate) — You Do tab.
  - `S49 ↔ Anthropic Building Effective Agents` (external gold standard) — full vocabulary alignment.
  - `S49 ↔ Anthropic Effective Context Engineering` (external gold standard) — full vocabulary alignment.
- **No real AI-to-developer meta-leaks** in this section file (no TODO/FIXME/STUB/STORM/FIXER/curriculum_hardening residue). The only residue is the legacy `id` retarget-debt, which is structural not authorial.

---

## Method note (grammar dimension)

- **Prose extraction**: custom TS-aware Python parser (records.json, 153 Spanish-dominant prose records out of 256 total).
- **Sentence splitting**: Spanish-aware splitter with abbreviation protection (`p.`, `ej.`, `p.ej.`, `etc.`, `vs.`, `Sr.`, `Sra.`, `Dr.`) and inverted-mark handling.
- **Syllable counter**: heuristic Spanish vowel-group splitter with digraph awareness (`bl`, `br`, `cl`, `cr`, `dr`, `fl`, `fr`, `gl`, `gr`, `pl`, `pr`, `tl`, `tr`, `ll`, `rr`, `ch`). **Known over-counting on English loanwords** — documented as a caveat for FH/INFLESZ interpretation.
- **Fernández-Huerta (1959)**: `206.84 − 60·(syll/word) − 1.02·(word/sent)`. Bands: ≥90 *muy fácil* → <30 *muy difícil*.
- **Szigriszt-Pazos / INFLESZ**: `206.835 − 62.3·(syll/word) − (word/sent)`.
- **13 pedagogical heuristics**: RUNON (>45w), LONG (32–45w), NO_TERMINAL, MISSING_INV_Q, UNBALANCED, REPEATED_WORD, ENGLISH_DOMINANT, META_LEAK (case-sensitive), CODE_IDS_PROSE, GERUND_PILEUP, COMMA_DENSITY, SPACE_BEFORE_PUNCT, DOUBLE_SPACE.
- **LanguageTool `es`**: 1 chunk of 19 990 chars → 616 matches; 589 MORFOLOGIK_RULE_ES false positives on tech terms; 14 AYA_HAYA false positives on `CASO-AYA-049`; 1 OPERA false positive on verb *opera*. After filtering: **27 real findings** reduced to **6 actionable items** (1 uppercase, 8 `vs`, 1 concordance, 1 mixed-gender adj, 1 borderline loanword gender).
- **Live verification**: agent-browser navigation to `https://pillb.github.io/pyarcana/#data-contracts`, captured rendered text including the off-topic *Practica data contracts* playground code with `TransactionContract` dataclass and Great Expectations simulation.
- **Artifacts**: `/home/z/my-project/audits/tmp_s49/{records.json, sentences.json, metrics.json, prose.txt, lt.json, extract.py, grammar.py, inspect.py}`.

---

> **This is the complete Explorer report for Section 49. Ready for the Fixer prompt.**
