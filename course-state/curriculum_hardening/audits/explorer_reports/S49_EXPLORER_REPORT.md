# S49 Explorer Report — Agentes, herramientas y context engineering

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Passes applied:** surface scan → pedagogical critique → redaction/grammar → meta-leak → comparative quality → loop refinement  
**Date:** 2026-07-24  
**Scope constraint:** Section 49 only. Analysis only — no curriculum TS edits applied.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Section index | **49** |
| Platform section id (hash) | `data-contracts` |
| Live URL | https://pillb.github.io/pyarcana/#data-contracts |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s49-data-contracts.ts` |
| Title | Agentes, herramientas y context engineering |
| shortTitle | Agentes y tools |
| Level / phase / hours | Master · phase 3 · 20h |
| Gate | CP-N4-C · agente acotado con aprobación humana |
| Case | `CASO-AYA-049` (Ayacucho sintético) |
| Structure inventory | Theory map + **8** subtopics (T1–T4 × A/B) · **8** iDo demos · **24** weDo (E1/E2/E3 × 8) · youDo portfolio · **5** selfCheck · resources |

**Live-site note:** The public SPA at pillb.github.io/pyarcana lists Section 49 correctly in the curriculum grid (title/tagline match). Full section body is client-rendered; this audit grounds content claims in the registered source file that the app serves (`section49` / `data-contracts`).

**Out of scope this run:** Fixes, other sections’ TS, product UI, harness pipeline code.

---

## 2. Executive Summary of Quality

### Score: **5.8 / 10**

**Verdict:** *Structurally complete and governance-aligned, but pedagogically thin, meta-leaky, and heavily template-generated.* Suitable as a **gate checklist curriculum** for fail-closed agent promotion; **not yet** a gold-standard teaching of agents / tools / context engineering compared to early sections (e.g. S02) or external references (Anthropic *Building effective agents*, *Effective context engineering for AI agents*).

**What works**
- Topic map matches industry vocabulary: workflow vs agent, planner/worker/evaluator, SRP tools, schema/permissions/idempotency, min context + JIT, compaction/LKG, budgets/stops, sandbox + human approval.
- Consistent **valid / breach / missing** triad in weDo trains fail-closed mental models (excellent for Master-level ops safety).
- Synthetic Peruvian case, no real PII, no open network, stdlib-only stack is coherent with course policy.
- selfCheck questions align with gates and ethics (synthetic data, STOP_AGENT, approval).
- Resources include Anthropic agents, OpenAI function calling, JSON Schema, NIST AI RMF, OWASP LLM Top 10, LangGraph.

**What fails the gold bar**
- **User-facing developer meta** (legacy id `data-contracts`, “path V3”, product jargon `iDo`/`weDo`).
- **`jobRelevance` promotion criterion is inverted/confused** relative to theory + exercises (and relative to S47’s clear “supera baseline” pattern).
- **Theory is near-identical scaffolding** across 8 subtopics (same Contrato operativo + CASO application stems); mechanism depth is 1–2 sentences then toys.
- **iDo demos are label printers**, not worked agent loops; students never observe a multi-step tool-use trace.
- **weDo is pure boolean-predicate inversion** — transferable skill is “fix inverted contract,” not design/implement agents.
- **CASO-LIM-049** comments in all 24 starters while fixtures are **CASO-AYA-049** — leftover template leakage.
- Headings lowercase / telegraphic Spanish; learning outcomes are fragments vs full competency statements in early sections.

**Automated prior auditor:** `S49_AUDIT.json` → ACCEPT, high_issue_count 0, mean_visible_rank 9.52. That audit optimizes for boilerplate tails/fragmentation, **not** pedagogical depth or semantic correctness of promotion rules. Explorer score is deliberately lower.

---

## 3. Detailed Issue Registry

Severity scale: **P0** blocker / wrong teaching · **P1** high pedagogical or trust damage · **P2** medium clarity/consistency · **P3** polish.

### ISS-01 · P0 · Inverted / incoherent agent promotion rule in `jobRelevance`

- **Location:** `jobRelevance` (source L15).
- **Evidence quote:**  
  > «Se promueve solo cuando el agente **no supera** baseline en tareas conocidas sin plan evaluado, y los side effects exigen approval.»
- **Contrast with section logic:** T1-A solution promotes **workflow** when `known_steps` and `baseline_success >= agent_success`. S47 pattern is «candidato **supera** baseline». Industry rule: prefer workflow when deterministic; promote agent when it **beats** baseline under an **evaluated** plan with budgets.
- **Pedagogical impact:** Students reading job relevance before theory may encode the opposite promotion policy. Undermines CP-N4-C and S50 evals bridge.
- **Dimensions:** (7) roadmap consistency, (6) exercise alignment, (2) redaction/clarity.

### ISS-02 · P1 · Developer meta-leak: legacy id + “path V3” in user-facing copy

- **Locations:** `jobRelevance` L15; theory map paragraph L33.
- **Evidence quotes:**  
  > «Id legacy `data-contracts` se conserva; el path V3 es agentes/tools (no solo contratos de tablas).»  
  > «Id legacy no limita a data contracts tabulares; V3 es agent tool-use gobernado.»
- **Impact:** Breaks immersion; exposes curriculum migration debt; confuses learners who search “data contracts” vs “agentes”. Same pattern as S43–S48 but still **user-facing leakage** for S49.
- **Dimensions:** (1) meta-leak, (3) narrative flow.

### ISS-03 · P1 · CASO-LIM-049 template residue in all weDo starters

- **Location:** Every `starterCode` comment in weDo (24×), e.g. L478 `# CASO-LIM-049 · workflow vs agent choice`.
- **Evidence:** Fixtures and prose use `CASO-AYA-049` / `CASO-AYA-049-1A`…; comments still say `CASO-LIM-049`.
- **Impact:** Students copy comments into portfolio; confuses geography of the synthetic case (Lima vs Ayacucho); reads as unfinished generation.
- **Dimensions:** (1) meta-leak, (6) exercise quality, (7) consistency.

### ISS-04 · P1 · Theory subtopics are copy-paste shells (cognitive monotony)

- **Location:** Theory blocks S49-T1-A … S49-T4-B (approx. L61–L290).
- **Evidence pattern (every subtopic):**  
  1) 1-sentence concept · 2) nearly identical «Contrato operativo. Entrada: objetivo acotado… Criterio de éxito: cada tool es idempotente…» · 3) «Aplicación de `…` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes… No contiene PII…»
- **Impact:** High extraneous cognitive load (same text 8×) without germane load (mechanism). Progressive disclosure fails: dictionary promises depth; body does not deliver. Violates Loop Engineering “freshness” and STORM multi-perspective teaching.
- **Dimensions:** (3) connective tissue, (5) cognitive load, (4) pedagogy.

### ISS-05 · P1 · iDo demos do not demonstrate agent/tool mechanics

- **Location:** `iDo.steps` L293–L457.
- **Evidence (representative):**  
  ```python
  print("agent_when", "open_ended")
  print("workflow_when", "fixed_steps")
  print("safety", prefer("default"))
  ```
  Similar label-printing for routing, SRP, schema, JIT, LKG, budgets, sandbox.
- **Impact:** “I Do” in gradual release of responsibility requires a **worked process** students can imitate. These demos are weaker than S02 theory code and weaker than external agent tutorials (tool schema → call → observation loop). Students cannot transfer to youDo.
- **Dimensions:** (4) I/We/You fidelity, (5) progressive disclosure, (8) external comparison.

### ISS-06 · P1 · weDo only trains inverted boolean contracts, not agent design

- **Location:** All 24 weDo steps.
- **Evidence pattern:** Starter sets `meets_contract` to the **negation** of the domain rule; solution flips comparisons/sets. No implementation of: tool registry, idempotency store, compaction function that preserves critical facts, approval queue, or bounded agent loop.
- **Impact:** Alignment with *outcomes* is partial (students can **score** a gate, not **build** tools/context systems). Portfolio youDo asks for real artefacts; weDo does not scaffold them. Skill transfer risk: interview “show me an agent tool contract” → student only has `assess(record)`.
- **Dimensions:** (4) pedagogy, (6) exercises, (8) external materials.

### ISS-07 · P2 · Edge-case labels describe the *pass rule*, not the adverse fixture

- **Location:** `edgeCases` on each weDo (e.g. T1-A L472).
- **Evidence quote:**  
  > `["falta agent_success", "fixture adverso: workflow preferido cuando pasos conocidos y baseline gana", "CASO-AYA-049-1A es sintético"]`
- **Impact:** The middle string describes the **success** predicate, not what the adverse fixture does (`known_steps:False`, high branches, agent>baseline). Misleads when students use edgeCases as study notes.
- **Dimensions:** (2) redaction, (6) exercises.

### ISS-08 · P2 · Lowercase / telegraphic headings and learning outcomes

- **Location:** Theory headings L62–L264; `learningOutcomes` L17–L25.
- **Evidence:** Headings like `workflow vs agente`, `funciones de responsabilidad única`; outcomes like `{ text: "Elige workflow vs agente" }` vs S02 full sentences («Identificar literales y tipos básicos…»).
- **Impact:** Spanish UX inconsistency; Master tone becomes “ticket title” not “competency”. Accessibility/skimming suffers.
- **Dimensions:** (2) grammar/redaction, (9) accessibility.

### ISS-09 · P2 · `youDo` prose grammar + checklist-only starter

- **Location:** `youDo.context` L1626; `youDo.starterCode` L1643–L1660.
- **Evidence quote:**  
  > «El gate se bloquea ante: tool no permitida, argumento inválido, presupuesto agotado o estado incierto **detiene el run**.»  
  (dangling predicate after “ante:”)
- **Starter:** All evidence flags `False` + `readiness()` — no skeleton for plan, tool table, checkpoint, or approval log.
- **Impact:** Grammar glitch + youDo under-scaffolded relative to 20h claim and 6-criterion rubric.
- **Dimensions:** (2) redaction, (4) You Do, (6) alignment.

### ISS-10 · P2 · Product jargon `iDo` / `weDo` inside Spanish theory

- **Location:** Map paragraph L33.
- **Evidence:** «Teoría medible, **iDo** con helpers, **weDo** con defecto agentic por ejercicio.»
- **Impact:** Internal field names; live UI uses “Yo hago / Hacemos juntos”. Prefer learner-facing labels.
- **Dimensions:** (1) soft meta-leak, (2) tone.

### ISS-11 · P2 · Theory code samples are under-powered relative to claims

- **Examples:**  
  - T2-A `srp_tools` is `return list(names)` — does not encode single responsibility.  
  - T3-B `compact` returns `steps[-keep:]` but LKG index `1` is arbitrary, not last-known-good semantics.  
  - T1-B only prints sorted role names — no loop bound between evaluator and worker.
- **Impact:** Code fails dual-coding (words + code) principle; students cannot ground abstract gates in runnable micro-mechanisms.
- **Dimensions:** (5) cognitive load, (8) external comparison.

### ISS-12 · P2 · Missing flagship resource for section title concept

- **Location:** `resources.docs`.
- **Gap:** Title centers **context engineering**, but docs omit Anthropic’s *Effective context engineering for AI agents* (2025) which defines attention budget, JIT retrieval, compaction, note-taking — core S49-T3 vocabulary. “Building effective agents” is present; context-engineering article is not.
- **Impact:** Students miss the best external anchor for T3.
- **Dimensions:** (8) external comparison, (7) roadmap.

### ISS-13 · P3 · Hash id / title mismatch (`data-contracts` vs agentes)

- **Location:** `id: "data-contracts"`; map contract key `tabular_contracts_only_topic: False`.
- **Impact:** Bookmarks, deep links, and SEO say “data contracts”; content is agents/tools. Mitigated by shortTitle, but still a discoverability footgun (report for Fixer awareness; may be intentional freeze).
- **Dimensions:** (7) consistency, (9) accessibility.

### ISS-14 · P3 · Unexplained jargon `cost_pen` / action token soup

- **Location:** T4-A exercises (`cost_pen`, `max_cost_pen`); callouts with `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, …
- **Impact:** Acceptable at Master if defined once in dictionary — currently not. Action tokens are good for ops culture but overload working memory without a single reference table.
- **Dimensions:** (5) cognitive load, (2) clarity.

### ISS-15 · P3 · SelfCheck coverage gaps

- **Location:** `selfCheck` L1671–L1703 (5 items).
- **Gap:** No item on JIT/compaction/LKG or budget exhaustion reason codes; heavy on ethics/gates. OK for autocheck length, weak for T3–T4 recall.
- **Dimensions:** (6) exam quality.

### ISS-16 · P2 · Map paragraph product-internal phrasing

- **Evidence L33:** «Teoría medible, iDo con helpers, weDo con defecto agentic por ejercicio.»
- **Impact:** “defecto agentic” is opaque (default agentic defect per exercise?); reads as generation log, not teaching.
- **Dimensions:** (1) meta-ish, (2) clarity.

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Severity | User impact |
|---|------------------------------|----------|-----------|-------------|
| M1 | `Id legacy \`data-contracts\` se conserva; el path V3 es agentes/tools (no solo contratos de tablas).` | `jobRelevance` | P1 | Migration note visible as career copy |
| M2 | `Id legacy no limita a data contracts tabulares; V3 es agent tool-use gobernado.` | theory map ¶4 | P1 | Same |
| M3 | `# CASO-LIM-049 · …` (×24) | all weDo `starterCode` comments | P1 | Wrong case id in learner-copied code |
| M4 | `iDo con helpers, weDo con defecto agentic por ejercicio` | theory map ¶4 | P2 | Product schema jargon |
| M5 | `tabular_contracts_only_topic` | map demo code (intentional teaching of “not only tables”) | P3 | Acceptable if framed as student-facing contract; still echoes legacy topic |

**No findings for classic AI-to-dev phrases** such as “moved from section X”, “TODO: rewrite”, “as an AI”, “Fixer”, “Explorer”, or unredacted design notes beyond the above.

**M3 count for sidecar:** treat as **1 logical leak pattern** with 24 instances; meta_leak_count below uses **distinct leak families** = 4 (M1–M4; M5 optional).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (agents & context engineering)

Industry best practices used as critique lenses:
- **Workflow vs agent:** Prefer deterministic workflows when steps are known; use agents for open-ended tool loops with evaluation (Anthropic *Building effective agents*).
- **Tools:** Single-purpose, minimal overlap, clear schemas; if a human cannot choose the tool, neither can the agent (*Writing tools for agents* / context engineering guidance).
- **Context engineering:** Context is a finite **attention budget**; prefer **JIT retrieval**, **compaction** that preserves critical decisions, structured memory/notes, sub-agents for isolation (Anthropic *Effective context engineering for AI agents*, 2025).
- **Pedagogy:** Gradual release (I Do → We Do → You Do); dual coding; reduce extraneous load; germane load via worked examples → completion problems → independent design (not 24× isomorphic boolean flips alone).

S49 **names** these ideas correctly. S49 **teaches execution of gates** more than **mechanisms**.

### 5.2 Connective tissue & narrative flow

| Element | Assessment |
|---------|------------|
| Section dictionary | Strong opener; good progressive disclosure setup |
| Bridge from S48 | Explicit “extiende RAG (S48)” — good |
| Subtopic progression T1→T4 | Logical architecture (choose → tools → context → stop/safety) |
| Intra-subtopic prose | Weak: concept → clone contract → clone CASO |
| Cross-links to S50 evals | Implicit via CP-N4-C; could be one explicit sentence |

Compared to **S02 gold pattern**: S02 explains *why* a type trap hurts intake with concrete Peruvian-flavored examples and progressive code. S49 rarely shows a failing agent trajectory then a fixed one.

### 5.3 I Do / We Do / You Do fidelity

| Phase | Expected | S49 actual | Grade |
|-------|----------|------------|-------|
| I Do | Expert models full reasoning + runnable micro-system | 8 demos ≈ print constants / trivial helpers | D |
| We Do | Guided construction with fading support | E1 guided flip · E2 three-path assess · E3 fail-closed decide — good *structure*, thin *domain* | C+ structure / D domain |
| You Do | Portfolio agent lab with evidence | Strong requirements list + rubric; weak starter (checklist only) | B requirements / C- scaffold |
| SelfCheck | Active recall of critical rules | 5 solid ethics/gate items; thin T3–T4 | B- |

### 5.4 Cognitive load & progressive disclosure

- **Intrinsic load:** High (agents + tools + memory + budgets + HITL) — appropriate for Master.
- **Extraneous load:** High due to repeated contract paragraphs, token soup, CASO-LIM noise, toy code that does not reduce abstraction.
- **Germane load:** Low-medium — students practice set/boolean logic, not agent design schemas.
- **Disclosure:** Dictionary helps; thereafter dumps full success criterion every subtopic (“cada tool es idempotente…”) before tools are taught — premature full-gate repetition.

### 5.5 Grammar & Peruvian Spanish redaction

- Register is ops-Spanish + English loanwords (`tool`, `budget`, `checkpoint`) — acceptable for Master platform engineers in LATAM.
- Issues: lowercase headings; missing articles; `youDo.context` dangling clause; telegraphic outcomes; “defecto agentic” unidiomatic.
- No major orthography disasters; redaction debt is **style + consistency**, not raw grammar collapse.

### 5.6 Exercise & exam alignment matrix

| Outcome (condensed) | Theory | iDo | weDo | youDo | Quiz |
|---------------------|--------|-----|------|-------|------|
| Workflow vs agent | Y thin | Y toy | Y gate | Y req | Y |
| Routing planner/eval | Y thin | Y toy | Y gate | Y req | partial |
| SRP tools | Y thin | Y toy | Y gate | Y req | partial |
| Schema/idempotency | Y thin | Y toy | Y gate | Y req | Y (side_effect) |
| Min context / JIT / CP | Y thin | Y toy | Y gate | Y req | N |
| Compaction / LKG | Y thin | Y toy | Y gate | Y req | N |
| Stops / budgets | Y thin | Y toy | Y gate | Y req | N |
| Sandbox / HITL | Y thin | Y toy | Y gate | Y req | Y |

**Alignment type:** outcome ↔ **gate predicate**, not outcome ↔ **construction skill**.

### 5.7 Roadmap & previous sections

- Fits Phase 3 AI stack: S48 RAG → **S49 agents/tools** → S50 evals/red team → S51 copilot UX.
- Capstone language CP-N4-C consistent.
- Legacy hash `data-contracts` is the main roadmap UX scar.
- Safety continuity (approval, no prod side effects) aligns with S22 email approval and S42 permissions themes — good.

### 5.8 External comparison (best-in-class)

| Source | Teaches | S49 coverage |
|--------|---------|--------------|
| Anthropic Building effective agents | Workflows, routing, parallelization, evaluator-optimizer | Named; not implemented as loops |
| Anthropic Effective context engineering | Attention budget, JIT, compaction, memory notes | Named T3; no high-fidelity compaction worked example |
| OpenAI function calling docs | JSON schemas, tool choice, error handling | Schema mentioned; no JSON Schema exercise |
| LangGraph docs | Checkpoints, cycles, durable state | Linked only |
| deeplearning.ai agent courses | Hands-on multi-step agents | Out of stack by design (stdlib) — OK, but need richer stdlib simulations |

**Conclusion:** Concept graph is competitive; **worked example depth** is not.

### 5.9 Other domain issues

- **Motivation:** Tagline is excellent and safety-first. jobRelevance starts well then breaks on promotion clause.
- **Accessibility:** Dense monospaced action tokens without glossary table; no alt narrative of a full agent run in plain Spanish.
- **20h estimate:** Inflated if content stays gate-only; reasonable if youDo is a real multi-file lab (currently under-specified).
- **Security posture:** Strong (sandbox, approval, no secret dumps in happy path; invalid fixture uses `"secret dump"` as error_kind value — fine as synthetic bad label).

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root.

### Diff A — Fix promotion criterion + strip legacy meta from `jobRelevance` (ISS-01, ISS-02)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@
   jobRelevance:
-    "En equipos de plataforma y producto, **agentes, herramientas y context engineering** orquestan pasos con tools de scope mínimo, presupuestos y checkpoints. Se promueve solo cuando el agente no supera baseline en tareas conocidas sin plan evaluado, y los side effects exigen approval. Id legacy `data-contracts` se conserva; el path V3 es agentes/tools (no solo contratos de tablas).",
+    "En equipos de plataforma y producto, **agentes, herramientas y context engineering** orquestan pasos con tools de scope mínimo, presupuestos y checkpoints. Prefiere **workflow** cuando los pasos son conocidos y el baseline determinista iguala o supera al agente; promueve un **agente** solo si supera ese baseline con plan evaluado, budgets y tools de responsabilidad única. Todo side effect sensible exige aprobación humana explícita.",
```

### Diff B — Rewrite map closing paragraph: learner language, no V3/legacy (ISS-02, ISS-10, ISS-16)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@
-        "Orden: T1 baseline vs agente → T2 tools/scope → T3 context/checkpoint → T4 cost/network/approval. Teoría medible, iDo con helpers, weDo con defecto agentic por ejercicio. Id legacy no limita a data contracts tabulares; V3 es agent tool-use gobernado. Stack didáctico: **stdlib** sin frameworks de agentes ni red abierta.",
+        "Orden: T1 baseline vs agente → T2 tools/scope → T3 context/checkpoint → T4 cost/network/approval. En la demostración verás helpers mínimos; en el laboratorio corregirás contratos fallidos (modo agente mal acotado) hasta fallar cerrado. Esta sección no es solo «contratos de tablas»: es **uso gobernado de tools por un agente**. Stack didáctico: **stdlib** sin frameworks de agentes ni red abierta.",
```

### Diff C — Global replace CASO-LIM-049 comments in weDo starters (ISS-03)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@
-# CASO-LIM-049 ·
+# CASO-AYA-049 ·
```

(Apply to all 24 starter comment lines; keep the rest of each comment’s descriptive tail.)

### Diff D — Diversify theory: example for T1-A (template for ISS-04 / ISS-11)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ heading: "workflow vs agente"
       paragraphs: [
-        "Usa **workflow** cuando pasos y ramas son conocidos y deterministas; reserva **agente** solo para decisiones acotadas con beneficio medible frente a un baseline y salida verificable por un evaluator. Un agente abierto sin presupuesto ni tools de responsabilidad única no es «más inteligente»: es un riesgo de side effects.",
-        "Contrato operativo. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto (`max_steps`/`max_cost`). Salida de este subtema: ADR workflow/agente con baseline documentado. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run. Criterio de éxito: cada tool es idempotente, el agente se detiene y una persona aprueba toda acción sensible (red/prod/riesgo).",
-        "Aplicación de `workflow vs agente` al caso peruano sintético `CASO-AYA-049`: un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. La evidencia esperada es ADR que elige `workflow` cuando el path es determinista. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "Usa **workflow** cuando pasos y ramas son conocidos y deterministas; reserva **agente** solo para decisiones acotadas con beneficio medible frente a un baseline y salida verificable por un evaluator. Un agente abierto sin presupuesto ni tools de responsabilidad única no es «más inteligente»: es un riesgo de side effects.",
+        "Regla medible: si `known_steps` y el baseline determinista obtiene éxito ≥ al agente en el holdout local, el ADR elige **workflow**. Solo si el agente gana con plan acotado (`max_steps`/`max_cost`) y evaluator, documentas **agent** y dejas el side effect detrás de aprobación humana. Entrada del subtema: objetivo, métricas baseline/agente y flags de incertidumbre. Salida: ADR con decisión y razón. Error: tool no permitida, argumento inválido, presupuesto agotado o estado incierto → stop.",
+        "En `CASO-AYA-049` (entidad ficticia en Ayacucho), preparar un reporte con plantilla fija es workflow; reordenar fuentes desconocidas con tools de lectura puede ser agente — pero solo tras baseline. Evidencia: ADR. Sin PII real ni prueba de fraude/parentesco.",
       ],
```

*Fixer should apply analogous unique second/third paragraphs to T1-B…T4-B (do not paste one stem).*

### Diff E — Strengthen one iDo demo as pattern for ISS-05 (T2-B)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ demo_schema_perms_idempotency_errors.py
-          code: `def perms_mode(strict: bool) -> str:
-    return "allowlist" if strict else "open"
-
-print("schema", True)
-print("perms", perms_mode(True))
-print("errors", "typed")`,
-          output: `schema True
-perms allowlist
-errors typed`,
+          code: `def call_tool(scope: str, granted: set, key: str, store: dict) -> dict:
+    if scope not in granted:
+        return {"error": "forbidden", "kind": "terminal"}
+    if key in store:
+        return store[key]  # replay: un solo efecto
+    result = {"ok": True, "effect": 1, "idempotency_key": key}
+    store[key] = result
+    return result
+
+store = {}
+granted = {"report:prepare"}
+print(call_tool("report:prepare", granted, "k1", store))
+print(call_tool("report:prepare", granted, "k1", store))  # mismo efecto
+print(call_tool("prod:write", granted, "k2", store))`,
+          output: `{'ok': True, 'effect': 1, 'idempotency_key': 'k1'}
+{'ok': True, 'effect': 1, 'idempotency_key': 'k1'}
+{'error': 'forbidden', 'kind': 'terminal'}`,
```

### Diff F — Fix edgeCases wording pattern (ISS-07) for T1-A (replicate per subtopic)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ S49-T1-A-E1
-        edgeCases: ["falta agent_success", "fixture adverso: workflow preferido cuando pasos conocidos y baseline gana", "CASO-AYA-049-1A es sintético"],
+        edgeCases: ["falta agent_success", "adverso: known_steps=False o agent_success>baseline", "CASO-AYA-049-1A es sintético"],
```

### Diff G — Capitalize headings + expand outcomes (ISS-08)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@
   learningOutcomes: [
-    { text: "Elige workflow vs agente" },
-    { text: "Diseña routing planner/evaluator" },
-    { text: "Define tools de responsabilidad única" },
-    { text: "Esquema, permisos e idempotencia de tools" },
-    { text: "Minimiza contexto con JIT y checkpoints" },
-    { text: "Compacta memoria y conserva LKG" },
-    { text: "Define stops y budgets" },
-    { text: "Sandbox, aprobación humana y recovery" },
+    { text: "Elegir workflow vs agente con baseline documentado y ADR" },
+    { text: "Diseñar routing planner/worker/evaluator con máximo de iteraciones" },
+    { text: "Definir tools de responsabilidad única con casos válidos e inválidos" },
+    { text: "Aplicar schema, permisos, idempotencia y errores tipados en tools" },
+    { text: "Minimizar contexto con retrieval JIT y checkpoints consistentes" },
+    { text: "Compactar memoria conservando restricciones críticas y LKG" },
+    { text: "Definir stopping conditions y budgets con razón de parada explícita" },
+    { text: "Operar sandbox, aprobación humana y recovery sin re-efectos" },
   ],
```

```diff
-      heading: "workflow vs agente",
+      heading: "Workflow vs agente",
-      heading: "routing, planner/worker y evaluator–optimizer",
+      heading: "Routing, planner/worker y evaluator–optimizer",
# … analogously capitalize first letter of each subtopic heading
```

### Diff H — youDo context grammar + richer starter skeleton (ISS-09)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@
-    context: "Workflow de herramientas seguro y recuperable. Trabaja sobre un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida: propuesta trazable y checkpoint; nunca un cambio de producción. El gate se bloquea ante: tool no permitida, argumento inválido, presupuesto agotado o estado incierto detiene el run.",
+    context: "Workflow de herramientas seguro y recuperable. Trabaja sobre un workflow sintético de preparación de reportes para una entidad ficticia en Ayacucho. Entrada: objetivo acotado, contexto mínimo, tools tipadas, permisos y presupuesto. Salida: propuesta trazable y checkpoint; nunca un cambio de producción. El run se detiene (fail-closed) si la tool no está permitida, el argumento es inválido, el presupuesto se agota o el estado es incierto.",
```

```diff
     starterCode: `CASE_ID = "CASO-AYA-049"
+TOOLS = {
+    "get_case": {"scope": "case:read", "side_effect": False},
+    "prepare_report": {"scope": "report:prepare", "side_effect": True},
+}
+BUDGET = {"max_steps": 6, "max_cost_pen": 0.06}
 REQUIRED = ['decision_workflow_versus_agente', 'router_planner_worker_evaluator_acotados', 'tools_con_schema_idempotencia_y_least_privilege', 'checkpoints_budgets_stopping_conditions_y_aprobacion']
 evidence = {
@@
+def decide_mode(known_steps: bool, baseline: float, agent: float) -> str:
+    if known_steps and baseline >= agent:
+        return "workflow"
+    return "agent"
+
 status, missing = readiness(evidence)
 print(CASE_ID, status)
+print("mode_hint", decide_mode(True, 0.96, 0.90))
 print("missing", ",".join(missing))
 assert status in {"READY", "BLOCKED"}
 `,
```

### Diff I — Add context-engineering resource (ISS-12)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ resources.docs
       {
         label: "Anthropic — Building effective agents",
         url: "https://www.anthropic.com/research/building-effective-agents",
         note: "Workflows, routing y evaluator-optimizer",
       },
+      {
+        label: "Anthropic — Effective context engineering for AI agents",
+        url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents",
+        note: "Attention budget, JIT retrieval, compaction y memoria",
+      },
```

### Diff J — Dictionary extension for budgets + action tokens (ISS-14)

```diff
--- a/src/lib/course/sections/s49-data-contracts.ts
+++ b/src/lib/course/sections/s49-data-contracts.ts
@@ diccionario
-        "**Diccionario de la sección** (léelo antes de T1). **Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator. **Planner/worker/evaluator:** descomponer, ejecutar, verificar. **Tool de responsabilidad única:** un efecto bien tipado. **Idempotencia de tool:** misma key ⇒ un solo side effect. **Context mínimo / JIT retrieval:** solo lo necesario, justo a tiempo. **Checkpoint / LKG:** last-known-good para recovery. **Budget:** max_steps y max_cost. **Sandbox + human approval:** sin red/prod/riesgo sin aprobación explícita.",
+        "**Diccionario de la sección** (léelo antes de T1). **Workflow vs agente:** pasos conocidos vs decisiones acotadas con evaluator. **Planner/worker/evaluator:** descomponer, ejecutar, verificar. **Tool de responsabilidad única:** un efecto bien tipado. **Idempotencia de tool:** misma key ⇒ un solo side effect. **Context mínimo / JIT retrieval:** solo lo necesario, justo a tiempo. **Checkpoint / LKG:** last-known-good para recovery. **Budget:** `max_steps`, `max_tokens` y `max_cost_pen` (costo sintético en el lab). **Sandbox + human approval:** sin red/prod/riesgo sin aprobación explícita. **Códigos de acción** (weDo): p. ej. `KEEP_DETERMINISTIC_WORKFLOW`, `STOP_AGENT_LOOP`, `DENY_TOOL_CALL`, `COMPACT_AND_CHECKPOINT`, `STOP_BUDGET_EXHAUSTED`, `REQUEST_HUMAN_APPROVAL` — respuesta fail-closed, no éxito silencioso.",
```

### Diff K — Optional selfCheck items for T3/T4 (ISS-15)

```diff
+      {
+        question: "¿Qué práctica reduce el «attention budget» sin perder una restricción crítica?",
+        options: [
+          "volcar todo el historial y todos los docs al prompt",
+          "compactar conservando hechos/decisiones con provenance y LKG",
+          "borrar el checkpoint para ahorrar tokens",
+          "re-ejecutar side effects en cada recovery",
+        ],
+        correctIndex: 1,
+        explanation: "Compaction + LKG es el contrato de S49-T3: menos tokens, sin perder restricciones ni re-efectos.",
+      },
+      {
+        question: "Si `steps > max_steps` o `cost_pen > max_cost_pen`, el agente debe…",
+        options: [
+          "continuar hasta cumplir el goal a cualquier costo",
+          "detenerse con razón de presupuesto y no inventar éxito",
+          "abrir network=open automáticamente",
+          "duplicar effects para compensar",
+        ],
+        correctIndex: 1,
+        explanation: "Stopping conditions y budgets terminan el run con estado explícito (STOP_BUDGET_EXHAUSTED).",
+      },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Action | Effort | Why first |
|----------|-----------|--------|--------|-----------|
| **1** | ISS-01 | Rewrite `jobRelevance` promotion sentence | XS | Semantic error; learner-facing |
| **2** | ISS-02, ISS-10, ISS-16 | Strip legacy/V3/iDo-weDo from job + map | XS | Meta-leak / trust |
| **3** | ISS-03 | `CASO-LIM-049` → `CASO-AYA-049` (24 comments) | XS | Consistency / portfolio pollution |
| **4** | ISS-09 | Fix youDo grammar + minimal starter skeleton | S | You Do is the 20h core |
| **5** | ISS-07 | Correct edgeCases adverse descriptions | S | Study-aid accuracy |
| **6** | ISS-08 | Capitalize headings; expand outcomes | S | UX + competency clarity |
| **7** | ISS-12, ISS-14 | Resource + dictionary tokens/cost_pen | XS | Context-engineering promise |
| **8** | ISS-05, ISS-11 | Rebuild **at least 4** iDo demos as real micro-mechanisms (idempotency store, budget loop, approval gate, compaction preserving facts) | M | I Do fidelity |
| **9** | ISS-04 | Unique theory ¶2–¶3 per subtopic (no shared “Contrato operativo” clone) | M | Cognitive load / redaction quality |
| **10** | ISS-06 | Add **one** weDo “build” track per theme (or E0 scaffold) beyond boolean flip — optional V3.1 | L | Transfer to interviews |
| **11** | ISS-15 | +2 quiz items T3/T4 | XS | Coverage |
| **12** | ISS-13 | Document id freeze or redirect note in teacher-only docs — **do not** rename hash without product plan | — | Avoid breaking links |

**Do not** reintroduce Red Andina ethics boilerplate tails (per FIXER_LOG_S43_S50).

---

## 8. Graph Memory Update notes

For shared curriculum graph / future Fixer & Explorer context:

```yaml
section: 49
id: data-contracts
title: Agentes, herramientas y context engineering
file: src/lib/course/sections/s49-data-contracts.ts
explorer_score: 5.8
automated_audit: ACCEPT  # S49_AUDIT.json — not contradictory; different rubric
nodes:
  concepts:
    - workflow_vs_agent
    - planner_worker_evaluator
    - srp_tools
    - schema_permissions_idempotency
    - min_context_jit_checkpoint
    - memory_compaction_lkg
    - stopping_budgets
    - sandbox_human_approval
  edges:
    - S48_RAG -> S49_agents_tools: "extends retrieval with tool-use loops"
    - S49_agents_tools -> S50_evals: "CP-N4-C agent gates need eval suite"
    - S22_email_approval -> S49_HITL: "approval pattern continuity"
  quality_edges:
    - jobRelevance --contradicts--> T1A_solution_baseline_rule  # ISS-01
    - starter_comments --mismatches--> CASO-AYA-049 fixtures     # ISS-03
    - theory_paragraphs --duplicate_stem--> contrato_operativo_x8 # ISS-04
    - iDo --underdelivers--> worked_agent_example               # ISS-05
  meta_leaks:
    - legacy_id_data_contracts_in_jobRelevance
    - path_V3_in_map
    - CASO-LIM-049_x24
    - iDo_weDo_product_jargon
  case: CASO-AYA-049
  gate: CP-N4-C
  stack: stdlib_only_no_open_network
  residual_risk: "gates strong; mechanism teaching weak; 20h may overpromise"
  fixer_hints:
    - "Priority: ISS-01 then meta strip then CASO-LIM replace"
    - "Do not bulk-append ethics tails"
    - "When diversifying theory, keep fail-closed gate language but unique mechanism sentences"
```

**Comparative memory:** Early gold (S02) = rich dual-coded explanation + progressive I/O story. Late Master templates (S48/S49) = dictionary + 8× contract shells + boolean labs. S49 is **on-template** with S48; both need mechanism enrichment for gold parity.

---

## Closing

This is the complete Explorer report for Section 49. Ready for the Fixer prompt.
