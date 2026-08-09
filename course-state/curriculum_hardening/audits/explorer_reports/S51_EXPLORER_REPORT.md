# S51 Explorer Report — Observabilidad, gobernanza y UX del copiloto

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Scope lock:** Section 51 only (`integrator-final`)  
**Live site:** https://pillb.github.io/pyarcana/#integrator-final  
**Repo source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s51-integrator-final.ts`  
**Platform residue (section-id keyed):** `/Users/pabloillescas/Projects/PyArcana/src/components/course/SectionView.tsx` (`integrator-final` playground), `/Users/pabloillescas/Projects/PyArcana/src/components/course/PdfReport.tsx`  
**Roadmap authority:** `learning_roadmap_52_V3.md` § S51  
**Gold bar:** `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md`  
**Analysis date:** 2026-07-24  
**Pre-round research:** LLM observability / OpenTelemetry GenAI conventions; Google SRE SLO + blameless postmortems; NIST AI RMF; WCAG 2.2; model cards; gradual release of responsibility (I Do / We Do / You Do); contestability and anti–dark-pattern UX for AI agents.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 51 |
| Platform id (hash) | `integrator-final` |
| Title | Observabilidad, gobernanza y UX del copiloto |
| shortTitle | Obs y UX copiloto |
| Phase / level | Phase 3 · Master |
| estimatedHours | 20 |
| Case family | `CASO-MOQ-051` (Moquegua sintético) |
| Product / gates | Auditable AI Operations Copilot · CP-N4-C + **CF-5** |
| Theory map | Overview + T1A/B, T2A/B, T3A/B, T4A/B (9 headings) |
| iDo | 8 demos (`S51-T*-*-DEMO`) |
| weDo | 24 exercises (E1 guided / E2 independent / E3 transfer × 8 subtopics) |
| youDo | Portfolio checklist → READY/BLOCKED |
| selfCheck | 5 MCQ |
| resources | OpenTelemetry, WCAG, NIST AI RMF, Model Cards, SRE, MLflow, courses |

**V3 roadmap topics (must teach):**

1. **T1 Observabilidad:** traces prompt/retrieval/tools; tokens, costo, latency y redacción.  
2. **T2 Gobierno:** registry modelo/prompt/dataset; change, acceso, retención y auditoría.  
3. **T3 Operación:** SLO, feedback y drift; incidents, rollback y postmortem.  
4. **T4 UX:** incertidumbre, citas y confirmaciones; a11y, corrección y contestabilidad.

**Explicit non-scope of this run:** no curriculum edits; no Fixer application; no S50/S52 deep audit (only boundary consistency).

**Live rendering note:** the SPA shell at `https://pillb.github.io/pyarcana/` correctly lists Section 51 as “Obs y UX copiloto” with tagline CF-5. Deep content is loaded client-side from the same section module; this audit treats `s51-integrator-final.ts` as the authoritative learner-facing corpus for theory/iDo/weDo/youDo/selfCheck. Platform playground keyed by `integrator-final` in `SectionView.tsx` still ships **legacy agentic/LangGraph** material and is reported as a section-id consistency defect.

---

## 2. Executive Summary of Quality

### Score: **6.1 / 10**

### Verdict

S51 is a **structurally complete Master shell** aligned at the title/roadmap level with V3 (observability + governance + UX of the copilot, CF-5 freeze), with **strong fail-closed operational vocabulary** (quarantine, freeze, rollback, contestation action codes) and **ethics rails** (synthetic Moquegua case, no raw PII, no fraud/parentesco inference). That is real curriculum asset.

It is **not gold** under the project’s own expert bar. The section is dominated by **template soup** (byte-near-identical “Contrato operativo” / “Aplicación de …” triplets), **print-theater demos** (identity/`print True` contracts instead of computed observability), **meta/geo leakage** (`CASO-LIM-051` comments on every weDo starter while fixtures are `CASO-MOQ-051`), and **developer-facing roadmap prose** leaked into theory (“Id legacy `integrator-final` … V3 es …”). iDo `why` strings and weDo E1→E3 scaffolding are formulaic; mechanism depth for OpenTelemetry-style traces, percentile SLIs, dual-control change, and WCAG flows is thin compared with external best practice (OTel GenAI conventions, SRE error budgets, model cards, contestable UX). Prior automated ranks (`residual_ledger` score 10, PA 9.55, S51_AUDIT ACCEPT) are **rejected** as ground truth: they measure length/structure, not expert pedagogical quality (see GOLD_STANDARD_CHECKLIST anti-stub rules).

**Compared to S01 gold:** S01 teaches *why → mechanism → worked example → edge* in long narrative Spanish with computed demos. S51 mostly teaches *labels + inverted boolean gates*. Fit for Master N4 closing of CP-N4-C is conceptually right; delivery is under-built for a 20h “Auditable AI Operations Copilot” claim.

| Dimension | Subscore (0–10) | Note |
|-----------|-----------------|------|
| Meta-leak / developer residue | 4.5 | CASO-LIM×24; legacy-id paragraph; platform playground wrong topic |
| Grammar / redaction (ES-PE) | 6.5 | Mostly clean; lowercase headings; “ux”; stiff templates |
| Connective tissue / narrative | 5.5 | Glossary + S50→S51 bridge good; subtopics don’t deepen progressively |
| I Do / We Do / You Do fidelity | 6.0 | Structure present; demos/exercises under-model domain |
| Cognitive load / progressive disclosure | 5.5 | Action codes overload without teaching underlying ops craft |
| Exercise / exam quality | 6.5 | Consistent fail-closed triad; high repetition; 5 fair MCQ |
| Roadmap / prior-section consistency | 7.0 | V3 topics match; platform UI lag hurts |
| External competitive bar | 5.0 | Far thinner than OTel/SRE/LangSmith-class materials |
| Domain correctness of claims | 7.5 | P1 concepts sound; code does not demonstrate them fully |

---

## 3. Detailed Issue Registry

Severity key: **P0** blocker for promotion narrative · **P1** high pedagogical damage · **P2** medium polish · **P3** low.

### ISSUE-01 — Template “Contrato operativo” soup (7 subtopics)  
**Severity:** P0 (gold anti-pattern #2)  
**Location:** `s51-integrator-final.ts` theory blocks S51-T1-B … S51-T4-B, paragraph 2 of each.  
**Evidence quote:**

> `Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. … Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.`

Only the middle “Salida de este subtema: …” fragment changes; entrada/error/criterio are copy-pasted seven times.  
**Pedagogical impact:** Learners experience *one* generic CF-5 gate seven times instead of distinct contracts for cost SLIs, registry immutability, dual control, SLO/drift, IR, confirmation UX, and a11y. Cognitive load is high on slogans, low on mechanisms. Violates progressive disclosure and Anchor→Mechanism→Example→Edge.

### ISSUE-02 — Template “Aplicación al caso peruano” soup (7 subtopics)  
**Severity:** P0  
**Location:** Same blocks, paragraph 3.  
**Evidence quote (pattern):**

> `Aplicación de \`<topic>\` al caso peruano sintético \`CASO-MOQ-051\`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es <X>. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.`

**Pedagogical impact:** Ethics disclaimer is correct but **non-specific** to Moquegua ops scenarios (no concrete synthetic user story, dashboard row, or appeal ticket). Case situating fails; feels like ethics paste, not situative learning.

### ISSUE-03 — Print theater in theory code and all 8 iDo demos  
**Severity:** P0 (gold anti-pattern #3)  
**Location:** Theory mini-codes + `iDo.steps[*].code`.  
**Evidence quotes:**

```python
def tokens_ok(n: int) -> int:
    return n
print("tokens", tokens_ok(1200))
print("redaction", True)
```

```python
def contestable(edit: bool, contest: bool) -> bool:
    return edit and contest
print("a11y", True)
print("correction", True)
print("contest", contestable(True, True))
```

```python
def trace_spans(prompt_ver: str, cites: list, tool: str) -> tuple:
    return prompt_ver, cites, tool  # no correlation id, no redaction, no parent span
```

**Pedagogical impact:** I Do does not model *how* to build reconstructable traces, redact emails in attributes, pin release bundles, compute error budget burn, or gate irreversible actions. GRR fails: “I Do” is not a worked solution, so We Do becomes pure predicate surgery without transfer of craft.

### ISSUE-04 — Meta-geo leak: `CASO-LIM-051` on all 24 weDo starters  
**Severity:** P1 (meta-leak + consistency)  
**Location:** every `starterCode.code` first comment line, e.g. `# CASO-LIM-051 · trace contract gate`.  
**Evidence:** 24 occurrences of `CASO-LIM-051` while fixtures and instructions use `CASO-MOQ-051-*`.  
**Pedagogical impact:** Learner sees Lima (LIM) vs Moquegua (MOQ) contradiction; undermines “caso sintético situados en Perú” trust and signals bulk rewrite residue. Fixer must rewrite comments only (or unify case family intentionally).

### ISSUE-05 — Developer roadmap / versioning meta in learner theory  
**Severity:** P1  
**Location:** Overview paragraph 4.  
**Evidence quote:**

> `Id legacy \`integrator-final\` cierra N4; V3 es observabilidad+gobernanza+UX del copiloto (no capstone genérico). Stack: **stdlib** sin telemetría real de PII.`

**Pedagogical impact:** Speaks to curriculum authors (legacy slug, V3 rename debate), not to the student. Breaks immersion; pairs with platform residue ISSUE-06.

### ISSUE-06 — Platform playground still teaches OLD agentic capstone for this section id  
**Severity:** P0 (learner-visible if playground path used)  
**Location:** `SectionView.tsx` key `'integrator-final'`.  
**Evidence quotes:**

> title: `'Practica arquitectura agenticaca'` (typo)  
> code simulates LangGraph multi-agent researcher/analyst/writer + LLMOps metrics prints  

**Pedagogical impact:** Direct contradiction of V3 S51 (obs/gov/UX copiloto). Student may practice wrong skill for CF-5. Also Spanish quality (“agenticaca”, missing accents in comments). Related: `PdfReport.tsx` labels section as `'51. Capstone F'` instead of observability title.

### ISSUE-07 — iDo `why` strings are formula clones  
**Severity:** P1  
**Location:** all 8 demos’ `why` fields.  
**Evidence pattern:**

> `Hace observable \`<topic>\` con un caso local pequeño y deja como evidencia <artifact>; el demo modela el contrato, no un servicio externo.`

**Pedagogical impact:** No think-aloud of decisions (what span attributes matter, why p95 not mean, why dual-control ≠ self-approve). GRR “focused instruction” requires expert modeling language, not template meta-commentary.

### ISSUE-08 — weDo exercises are isomorphs (boolean invert → triad assess → triad decide)  
**Severity:** P1  
**Location:** 24 steps; only field names and action codes change.  
**Evidence:** E1 always inverted `meets_contract`; E2 always `PASS | ACTION | MISSING:field`; E3 always `CONTINUE | ACTION | RESTORE_*`.  
**Pedagogical impact:** Excellent for drilling fail-closed branching (valid/breach/missing) — keep that pattern — but **zero** exercise requires computing redaction transforms, span trees, cost = f(tokens, price), error-budget burn, or a11y contrast math beyond `>= min_contrast`. Transfer (E3) is structural, not domain transfer. Against gold: “E3 must transfer” beyond copy of same predicate.

### ISSUE-09 — Misleading `edgeCases` wording  
**Severity:** P2  
**Location:** e.g. S51-T1-A:

> `"fixture adverso: trace completo, bundle versionado y cero PII"`

**Pedagogical impact:** Labels the *success criteria* as the adversarial fixture description. Learner (and Fixer tooling) may invert polarity. Should describe the actual adverse state (empty `trace_id`, PII true, `latest` versions, etc.).

### ISSUE-10 — youDo REQUIRED keys truncated / non-human  
**Severity:** P1  
**Location:** `youDo.starterCode`  

```python
REQUIRED = [..., 'ux_accesible_con_incertidumbre_citas_confirmacion_y_contestabili']
```

Key ends mid-word (`contestabili` vs `contestabilidad`). Evidence dict mirrors truncation.  
**Pedagogical impact:** Portfolio scaffold looks machine-generated; signals incomplete generation. Students may copy broken identifiers into README/artifact maps.

### ISSUE-11 — Headings not title-cased / Spanish editorial polish  
**Severity:** P2  
**Location:** subtopic headings: `"traces de prompts/retrieval/tools"`, `"tokens, costo, latency y redacción"`, etc.  
**Also:** `jobRelevance` → “observabilidad, gobernanza y **ux** del copiloto” (should be UX).  
**Also:** youDo title prefix `"[FINAL]"` and nested parens `CP-N4-C (cierre)` read as editorial scaffolding.  
**Pedagogical impact:** Visual hierarchy weaker than S01; tone less polished for Master close.

### ISSUE-12 — Theory T1-A is relatively strong; later P1s under-teach mechanisms  
**Severity:** P1  
**Location:** T1-A P1 is domain-honest; T2–T4 P1s are short concept slogans (~1–2 sentences of real mechanism) then jump to template.  
**Missing relative to external bar:**

| Topic | Industry expectation | S51 gap |
|-------|----------------------|---------|
| Traces | parent/child spans, OTel GenAI attributes, correlation ids | tuple return of three strings |
| Cost/latency | p50/p95 by stage, budget alerts | dict of three numbers; redaction only on email toy |
| Registry | immutable versions, no `latest` in prod | `sorted(items.items())` |
| Change control | SoD, RFC, retention ≠ eternal PII | retention_days dict print |
| SLO/drift | error budget, biased feedback, slices + owner | `availability` float only |
| Incidents | contain → rollback → communicate → blameless PM | severity + rollback_to dict |
| UX | uncertainty display, citation resolve, confirm effect | flags print |
| a11y/contest | WCAG AA checks, appeal path SLAs | contrast AA flag |

**Pedagogical impact:** Master students finish S51 able to flip boolean gates, not able to design an auditable copilot ops surface.

### ISSUE-13 — Self-check Q2 action code mismatch with weDo codes  
**Severity:** P2  
**Location:** selfCheck Q2 expects `ROLLBACK_COPILOT`; weDo T3-B uses `ROLLBACK_AND_CONTAIN`; youDo mentions both `ROLLBACK_COPILOT` and `ESCALATE_TO_OWNER`.  
**Pedagogical impact:** Vocabulary scatter reduces retrieval practice. Prefer one canonical incident action set.

### ISSUE-14 — Self-check Q4 leans on ER/parentesco framing  
**Severity:** P3  
**Location:** Q4 options include “inferir fraude o parentesco desde ER”.  
**Pedagogical impact:** Continuity with course ethics is good, but question is weakly S51-specific (could be S30/S34). Prefer a question on redaction before export or dual-control approval.

### ISSUE-15 — Callouts are tip-only; no warning/danger for PII/incident  
**Severity:** P2  
**Location:** theory callouts almost all `type: "tip"` “Contrato local”. Overview has one `info` gate.  
**Pedagogical impact:** Gold bar wants actionable info/tip/warning/danger mix. PII-in-logs and irreversible tool execution deserve `danger`/`warning`.

### ISSUE-16 — jobRelevance is abstract, not workplace-situated (contrast S01)  
**Severity:** P2  
**Evidence:**

> `En equipos de plataforma y producto, observabilidad, gobernanza y ux del copiloto conecta decisiones técnicas con evidencia operativa. …`

No Peru/LatAm role story (on-call AI platform engineer, compliance, product ops). S01 names banks and day-1 tasks.  
**Pedagogical impact:** Motivation and transfer to “listo para LATAM” narrative weaker at Master end.

### ISSUE-17 — Inflated prior gold claims vs expert checklist  
**Severity:** P1 (process / graph memory, not learner-facing)  
**Evidence:** `residual_ledger.json` S51 `score: 10`, `selfcheck_q: 4` (actually 5 in source); `S51_PARAGRAPHS.md` uniform 9.55; `S51_AUDIT.json` ACCEPT with empty issues; `S51_DONE.md` “expert gold”.  
**Pedagogical impact:** Does not appear in UI, but misleads Fixer/fleet if treated as ground truth. Explorer **overrides**: not gold.

### ISSUE-18 — Overview says case “es sintético” twice (redundant)  
**Severity:** P3  
**Quote:**

> `El caso \`CASO-MOQ-051\` (Moquegua sintético) es sintético y puede ejecutarse…`

**Pedagogical impact:** Minor redaction noise.

### ISSUE-19 — Theory code for T2-A does not reject `latest`  
**Severity:** P2  
**Location:** `release_bundle` accepts any dict; exercises correctly reject `latest`/`immutable=False`, but theory demo never shows the anti-pattern.  
**Pedagogical impact:** Progressive path should show bad release then freeze; currently only success-path print.

### ISSUE-20 — Weak connective tissue between T1→T4 as one product story  
**Severity:** P1  
**Detail:** Overview promises incremental product CF-5; subtopics do not accumulate artifacts (trace → metrics dashboard → registry pin → change ticket → SLO alert → incident timeline → UX confirmation → appeal). Each subtopic restarts from the same generic entrada.  
**Pedagogical impact:** CF-5 “freeze interfaces and artifacts” never becomes a single worked system narrative; portfolio youDo then asks for four evidence flags without intermediate assembly demos.

---

## 4. Meta-Leak Report

| # | Exact leaked / residual text | Location | Class | Learner-visible? |
|---|------------------------------|----------|-------|------------------|
| M1 | `# CASO-LIM-051 · …` (24×) | weDo starterCode comments | Geo/case family copy-paste from LIM template | Yes (code comments) |
| M2 | `Id legacy \`integrator-final\` cierra N4; V3 es observabilidad+gobernanza+UX del copiloto (no capstone genérico).` | theory overview P4 | Author/roadmap meta | Yes |
| M3 | `Teoría medible, iDo con helpers, weDo con **DEFECT** de ops/UX por ejercicio.` | same paragraph | Curriculum-engineering jargon | Yes (borderline) |
| M4 | `Practica arquitectura agenticaca` + LangGraph multi-agent scaffold | `SectionView.tsx` `integrator-final` | Stale product content for section id | Yes if playground used |
| M5 | PdfReport label `51. Capstone F` | `PdfReport.tsx` | Legacy capstone naming | Yes in PDF export |
| M6 | youDo title `[FINAL]` scaffolding | youDo.title | Editorial marker | Yes |
| M7 | Truncated key `..._contestabili` | youDo.starterCode | Generation artifact | Yes |

**No** classic AI chat debris found (“as an AI…”, “TODO: rewrite section”, “moved from S43”, “FIXME”).  
**Meta-leak count (learner-facing unique classes):** **7** (M1 counts as one class with 24 instances).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research synthesis (what good S51 must do)

From industry + pedagogy sources used this run:

1. **LLM/agent observability** is end-to-end reconstructability: prompt template version, retrieval hits, tool calls, response, model version, costs, latency percentiles — ideally on open standards (OpenTelemetry GenAI conventions), with **redaction before export**.  
2. **Governance** ties releases to immutable registry entries + SoD approval + retention policy (append-only audit ≠ eternal PII).  
3. **SRE ops** for copilots needs multi-SLI SLOs (availability, quality/faithfulness, latency), biased-feedback awareness, drift slices with owners, contain→rollback→blameless postmortem.  
4. **UX** must surface uncertainty/cites, confirm irreversible effects, support correction and human appeal (contestability); dark patterns (hide abstention, auto-write tools) are anti-goals; WCAG is non-optional.  
5. **Gradual release (I/We/You):** expert models full procedure with think-aloud; guided practice repairs one defect; independent transfer builds novel combination — not thrice the same inverted boolean.

S51 **names** almost all of these correctly in dictionaries and P1s; it **does not teach** them at Master depth.

### 5.2 I Do / We Do / You Do fidelity

| Layer | Present? | Quality |
|-------|----------|---------|
| I Do intro | Yes | Mentions CP-N4-C + CF-5 + Level-4 regression |
| 8 demos | Yes | Structurally mapped to subtopics; compute theater |
| We Do intro | Yes | E1/E2/E3 roles stated clearly |
| 24 exercises | Yes | Deterministic outputs; honest inverted DEFECT; assert oracles |
| You Do | Yes | Rubric weighted; READY/BLOCKED readiness; synthetic case |
| Self-check | Yes | 5 MCQ, fair keys, anti-PII distractors |

**GRR gap:** responsibility is released on *predicate fixing*, not on *ops design skill*. After 24 exercises a learner can implement missing-field routing; they still may not design a redaction pipeline or an incident runbook.

### 5.3 Cognitive load

- **Positive:** section dictionary upfront; action codes make fail modes memorable; stdlib-only stack reduces tool overwhelm.  
- **Negative:** seven generic contracts restate the same global CF-5 criterion; many CAPITAL_SNAKE actions without a single worked timeline; theory+demo+E1+E2+E3 for each subtopic is high volume for thin novelty → **extraneous load** (Sweller).  
- **Intrinsic load** of true S51 topics is high; section should use progressive accumulation (one running trace id through T1–T4), not parallel template clones.

### 5.4 Spanish (Peruvian) redaction

- Register is largely professional ES with industry English terms (SLO, WCAG, PII, rollback) — appropriate.  
- Issues: lowercase headings; “ux”; stiff template Spanish (“operación sintética de un copiloto para una entidad ficticia en Moquegua” ×7); redundant “sintético”; no warm S01-style workplace narrative.  
- No major grammar breakage; no Spanglish chaos. Not “bad Spanish” — **over-generated** Spanish.

### 5.5 Alignment with S50 → S51 → S52

- Theory correctly states S50 (evals/red team) precedes production ops.  
- CF-5 freezes for S52 CP-FINAL — correct roadmap role.  
- Risk: if S50 already taught eval gates, S51 should show *ops signals feeding eval re-runs* and *red team findings as incident triggers*; currently no explicit bridge beyond one sentence.

### 5.6 Comparison with external best-in-class

| Peer | What they teach well | S51 relative |
|------|----------------------|--------------|
| OpenTelemetry docs / GenAI semconv | Span attributes, correlation | Named only |
| Google SRE book (SLO, postmortem) | Error budgets, blameless culture | Named; code is floats/flags |
| Model cards (Google) | Structured system card fields | Claimed in tagline; no card template exercise |
| WCAG 2.2 | Perceivable/operable criteria | Boolean flags, not user-flow demo |
| LangSmith / Phoenix-class courses | Trace UI mental model | Absent (stdlib abstraction OK if demos richer) |
| NIST AI RMF | Govern/map/measure/manage | Linked in resources; not operationalized in theory |
| S01 PyArcana gold | Narrative mechanism teaching | Large gap |

### 5.7 Graph Engineering view (nodes & edges)

**Strong nodes:** glossary terms; fail-closed action codes; CASO-MOQ fixture ids; CF-5 gate sentence; resources URLs.  
**Weak edges:** theory mechanism → demo computation (broken by print theater); demo → exercise novelty (isomorphic); subtopic → accumulated product artifact (missing); section id → platform playground (broken); overview promise → youDo checklist (flags only).  
**Toxic edges:** LIM comment → MOQ fixture (contradiction); legacy agentic playground → V3 title (contradiction).

### 5.8 STORM multi-pass summary

| Pass | Finding |
|------|---------|
| Surface scan | Complete 9/8/24/youDo/selfCheck/resources skeleton |
| Deep pedagogy | Template soup + theater dominate; GRR weak |
| Redaction | ES OK; headings/jobRelevance polish; LIM meta |
| Meta-leak | M1–M7 above |
| Comparative | Far below OTel/SRE/S01; prior “gold” rejected |
| Loop close | All material issues registered with diffs |

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — do not apply in Explorer. Paths relative to repo root.

### Diff A — Remove developer meta from overview (ISSUE-05, M2/M3)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-        "Orden: T1 traces/redacción → T2 registry/auditoría → T3 SLO/incidentes → T4 UX contestable y a11y. Teoría medible, iDo con helpers, weDo con **DEFECT** de ops/UX por ejercicio. Id legacy `integrator-final` cierra N4; V3 es observabilidad+gobernanza+UX del copiloto (no capstone genérico). Stack: **stdlib** sin telemetría real de PII.",
+        "Orden de aprendizaje: T1 traces y redacción → T2 registry y auditoría → T3 SLO e incidentes → T4 UX contestable y a11y. Cada tema cierra con un artefacto comprobable del **Auditable AI Operations Copilot**. Practicas solo con **stdlib** y fixtures sintéticos: sin telemetría real de PII ni backends externos obligatorios.",
```

### Diff B — Fix CASO-LIM → CASO-MOQ in all starter comments (ISSUE-04, M1)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-# CASO-LIM-051 · trace contract gate
+# CASO-MOQ-051 · trace contract gate
```

(Apply `replace_all` style for every `# CASO-LIM-051` → `# CASO-MOQ-051` in this file only.)

### Diff C — Replace one representative “Contrato operativo” with domain-specific contract (ISSUE-01 sample for T1-B)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-        "Contrato operativo. Entrada: trace id, versiones de prompt/modelo/dataset, evidencia, feedback y política. Salida de este subtema: dashboard por etapa con prueba de redacción. Error: PII en trace, versión desconocida, drift o acción irreversible activa incidente y rollback. Criterio de éxito: se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
+        "Contrato de costo y latencia. Entrada: contadores de tokens por etapa (prompt, retrieval, generation, tools), latencias p50/p95 y un sink de atributos. Salida: fila de dashboard con suma de tokens reconciliada, p95 ≤ SLO y **prueba de redacción** (email/token ausentes del export). Error: media en lugar de percentil, total_tokens que no cuadra, o PII en atributos. Criterio: un on-call puede explicar el costo de `CASO-MOQ-051` sin abrir raw logs.",
```

(Fixer must rewrite T2-A…T4-B contracts analogously — one unique contract per subtopic.)

### Diff D — Replace application paste with situative Moquegua vignette (ISSUE-02 sample T1-A remains specialized; sample T3-B)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-        "Aplicación de `incidents, rollback y postmortem` al caso peruano sintético `CASO-MOQ-051`: operación sintética de un copiloto para una entidad ficticia en Moquegua. La evidencia esperada es simulacro de rollback y acciones verificadas. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "En `CASO-MOQ-051-3B`, el copiloto de la entidad ficticia de Moquegua empezó a citar un índice `latest` tras un release. El simulacro exige: **contener** (congelar release), **rollback** a `copilot-6` dentro del RTO, timeline con dueños y postmortem blameless (sin culpar al on-call). Ningún campo del caso prueba fraude o parentesco; solo calidad operativa del sistema.",
```

### Diff E — Theory demo: real redaction + stage metrics (ISSUE-03 sample T1-B)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-def redact_email(s: str) -> str:
-    if "@" in s:
-        user, _ = s.split("@", 1)
-        return user[:3] + "@[redacted]"
-    return s
-
-def cost_metrics(tokens: int, cost: float, latency_ms: int) -> dict:
-    return {"tokens": tokens, "cost": cost, "latency_ms": latency_ms}
-
-print(redact_email("ana@example.pe"))
-print(cost_metrics(1200, 0.01, 900))
-print("no_raw_pii", True)
+def redact_attr(key: str, value: str) -> str:
+    if key in {"email", "authorization", "prompt_raw"} or "@" in value:
+        return "[REDACTED]"
+    return value
+
+def stage_metrics(prompt_t: int, retr_t: int, gen_t: int, p95_ms: int, slo_ms: int) -> dict:
+    total = prompt_t + retr_t + gen_t
+    return {
+        "total_tokens": total,
+        "p95_ok": p95_ms <= slo_ms,
+        "attrs": {
+            "email": redact_attr("email", "ana@example.pe"),
+            "model": redact_attr("model", "m-2"),
+        },
+    }
+
+m = stage_metrics(800, 400, 300, 900, 1200)
+print(m["total_tokens"], m["p95_ok"], m["attrs"]["email"])
+assert m["total_tokens"] == 1500 and m["attrs"]["email"] == "[REDACTED]"
```

(Update matching `output` field accordingly.)

### Diff F — iDo demo compute spans with correlation (ISSUE-03 sample T1-A)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-def spans() -> list:
-    return ["prompt", "retrieve", "tool"]
-
-print("trace_id", "t-1")
-print("spans", spans())
-print("audit", True)
+def build_trace(trace_id: str, prompt_ver: str, cites: list[str], tool: str, pii: bool) -> dict:
+    if pii:
+        return {"status": "REDACT_AND_QUARANTINE_TRACE", "trace_id": trace_id}
+    required = {"prompt", "retrieve", "tool", "answer"}
+    spans = [
+        {"name": "prompt", "ver": prompt_ver},
+        {"name": "retrieve", "cites": cites},
+        {"name": "tool", "call": tool},
+        {"name": "answer", "pinned": True},
+    ]
+    ok = {s["name"] for s in spans} >= required and trace_id.startswith("tr-")
+    return {"status": "PASS" if ok else "RESTORE_TRACE_CONTEXT", "spans": [s["name"] for s in spans]}
+
+print(build_trace("tr-moq-51", "p3", ["c1"], "get_case", False))
```

### Diff G — youDo fix truncated keys (ISSUE-10)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-REQUIRED = ['traces_de_prompt_retrieval_tool_con_redaccion', 'registry_y_change_log_de_versiones', 'slo_drift_feedback_incidente_postmortem', 'ux_accesible_con_incertidumbre_citas_confirmacion_y_contestabili']
+REQUIRED = [
+    "traces_redacted",
+    "registry_changelog",
+    "slo_incident_postmortem",
+    "ux_contestability_a11y",
+]
 evidence = {
-    "traces_de_prompt_retrieval_tool_con_redaccion": False,
-    "registry_y_change_log_de_versiones": False,
-    "slo_drift_feedback_incidente_postmortem": False,
-    "ux_accesible_con_incertidumbre_citas_confirmacion_y_contestabili": False
+    "traces_redacted": False,
+    "registry_changelog": False,
+    "slo_incident_postmortem": False,
+    "ux_contestability_a11y": False,
 }
```

### Diff H — edgeCases polarity fix (ISSUE-09 sample)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-        edgeCases: ["falta pii_in_trace", "fixture adverso: trace completo, bundle versionado y cero PII", "CASO-MOQ-051-1A es sintético"],
+        edgeCases: ["falta pii_in_trace", "fixture adverso: trace_id vacío, spans incompletos o pii_in_trace=True", "CASO-MOQ-051-1A es sintético"],
```

### Diff I — Platform playground re-key to CF-5 ops (ISSUE-06, M4) — *product file, Fixer may split*

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@
     'integrator-final': {
-      title: 'Practica arquitectura agenticaca',
-      code: `# Simulacion de plataforma agéntica completa
-... LangGraph multi-agent ...
+      title: 'Practica traza redactada y gate CF-5',
+      code: `# CASO-MOQ-051 · mini gate de copiloto auditable
+def assess_trace(record: dict) -> str:
+    required = {"trace_id", "spans", "versions", "pii_in_trace"}
+    missing = sorted(required - record.keys())
+    if missing:
+        return "RESTORE_TRACE_CONTEXT"
+    ok = (
+        str(record["trace_id"]).startswith("tr-")
+        and {"prompt", "retrieval", "tool", "answer"} <= set(record["spans"])
+        and all(record["versions"].values())
+        and record["pii_in_trace"] is False
+    )
+    return "CONTINUE" if ok else "REDACT_AND_QUARANTINE_TRACE"
+
+valid = {"trace_id": "tr-moq-51", "spans": {"prompt", "retrieval", "tool", "answer"},
+         "versions": {"prompt": "p3", "model": "m2"}, "pii_in_trace": False}
+print(assess_trace(valid))
+print(assess_trace({**valid, "pii_in_trace": True}))
 `,
-      hint: 'Anade un cuarto agente "Reviewer" ...',
+      hint: 'Añade verificación de pin de versiones (rechaza model=latest) antes de CONTINUE.',
```

### Diff J — PdfReport label (ISSUE-06, M5)

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
@@
-  "integrator-final": '51. Capstone F',
+  "integrator-final": '51. Obs y UX copiloto',
```

### Diff K — jobRelevance + headings polish (ISSUE-11, ISSUE-16)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@
-  jobRelevance:
-    "En equipos de plataforma y producto, observabilidad, gobernanza y ux del copiloto conecta decisiones técnicas con evidencia operativa. La práctica entrega dashboard redactado, SLO, audit trail y mecanismo de corrección o apelación y se promueve solo cuando se puede reconstruir qué respondió, qué citó, qué tool llamó, quién aprobó y cómo revertir.",
+  jobRelevance:
+    "En equipos de plataforma y producto (bancos, fintechs y ops digitales en Perú y LATAM), el rol de AI/Platform Engineer no termina al desplegar el copiloto: te piden **demostrar** qué versión respondió, qué citó, qué tool llamó, quién aprobó el release y cómo hacer rollback. Esta sección entrena dashboard redactado, SLO con owner, audit trail append-only y flujos de corrección/apelación; se promociona solo con evidencia reconstruible.",
@@
-      heading: "traces de prompts/retrieval/tools",
+      heading: "Traces de prompts, retrieval y tools",
```

(Apply title-style capitalization consistently to all eight subtopic headings.)

### Diff L — Canonical incident vocabulary (ISSUE-13)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ selfCheck Q2
-        options: ["emitir ROLLBACK_COPILOT y conservar evidencia", ...],
+        options: ["emitir ROLLBACK_AND_CONTAIN y conservar evidencia", ...],
@@
-        explanation: "El contrato falla cerrado con ROLLBACK_COPILOT; no convierte incertidumbre o breach en éxito.",
+        explanation: "El contrato falla cerrado con ROLLBACK_AND_CONTAIN; no convierte incertidumbre o breach en éxito.",
```

(Alternatively unify weDo/youDo to one code family — pick one and propagate.)

### Diff M — Danger callout for PII (ISSUE-15)

```diff
--- a/src/lib/course/sections/s51-integrator-final.ts
+++ b/src/lib/course/sections/s51-integrator-final.ts
@@ after T1-A tip callout, or replace tip:
+      callout: {
+        type: "danger",
+        title: "PII en el sink = incidente",
+        content:
+          "Exportar prompt_raw, email o tokens a logs/metrics es breach: REDACT_AND_QUARANTINE_TRACE. No promociones CF-5 con raw PII aunque el dashboard se vea completo.",
+      },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Rationale |
|----------|-----------|-----------|
| **1** | ISSUE-06, M4/M5 (platform playground + PdfReport) | Learner may train wrong skill for section id immediately |
| **2** | ISSUE-04 / M1 (CASO-LIM → MOQ) | Fast global string fix; high trust damage |
| **3** | ISSUE-05 / M2–M3 (legacy/V3 meta prose) | Quick redaction win |
| **4** | ISSUE-01 + ISSUE-02 (rewrite 7 contracts + 7 case vignettes) | Largest pedagogy lift; kill template soup |
| **5** | ISSUE-03 + ISSUE-07 (recompute theory + iDo demos + why think-alouds) | Make GRR real |
| **6** | ISSUE-10 (youDo keys) + ISSUE-13 (action vocabulary) | Portfolio/exam consistency |
| **7** | ISSUE-08 (diversify ≥1 E3 per topic with real compute) | Transfer quality |
| **8** | ISSUE-09, 11, 15, 16, 18, 19, 20 | Polish, callouts, accumulation story |
| **9** | ISSUE-17 | Update dossiers/ledger after Fixer; do not trust score 10 |

**Suggested Fixer slice for one PR:** Priorities 1–3 (correctness/meta) then 4–5 (depth). Do **not** “expand with another template pass.”

**Out of scope for Fixer unless product owner approves:** renaming platform id `integrator-final` → something like `obs-ux-copilot` (overview already warns legacy id; rename is multi-file).

---

## 8. Graph Memory Update Notes

For shared context files (`GRAPH_MEMORY.json` / summary / residual ledger — **notes only**, Explorer does not edit product curriculum):

```yaml
S51:
  id: integrator-final
  title: Observabilidad, gobernanza y UX del copiloto
  explorer_score: 6.1
  prior_claimed_gold: rejected  # residual 10 / PA 9.55 / DONE gold
  issue_count: 20
  meta_leak_classes: 7
  meta_leak_instances_LIM_comment: 24
  structural:
    theory_heads: 9
    iDo: 8
    weDo: 24
    selfCheck: 5  # residual_ledger wrongly said 4
    resources: strong_urls
  strengths:
    - fail_closed_action_codes
    - CF-5_and_CP-N4-C_framing
    - synthetic_MOQ_ethics
    - roadmap_topic_coverage_names
  defects_core:
    - template_contrato_operativo_x7
    - template_aplicacion_caso_x7
    - print_theater_iDo_and_theory
    - CASO-LIM_comment_leak
    - legacy_id_meta_in_theory
    - SectionView_playground_agentic_mismatch
    - youDo_truncated_key
  edges:
    - S50_evals -> S51_ops: mentioned_weak
    - S51_CF5 -> S52_CP_FINAL: correct_intent
    - section_id -> SectionView.playground: BROKEN_legacy_agentic
  fixer_ready: true
  do_not_mark_gold_until:
    - unique_contracts_per_subtopic
    - computed_demos_not_print_true
    - platform_playground_aligned
    - LIM_comments_gone
```

**Correction to fleet narrative:** S51 is **not** expert-gold closed for curriculum quality; it is **structurally complete with high template residue**. Downstream S52 should not assume learners already built a real system card + redacted dashboard from S51 alone without Fixer uplift.

---

## Appendix A — Inventory (source truth)

| Component | Count / IDs |
|-----------|-------------|
| Theory headings | 9 (map + T1A T1B T2A T2B T3A T3B T4A T4B) |
| Learning outcomes | 8 |
| iDo demos | S51-T1-A-DEMO … S51-T4-B-DEMO |
| weDo | S51-T{1..4}-{A,B}-E{1,2,3} |
| Breach codes used | REDACT_AND_QUARANTINE_TRACE, ALERT_COST_LATENCY, FREEZE_RELEASE_BUNDLE, REJECT_UNGOVERNED_CHANGE, OPEN_COPILOT_INCIDENT, ROLLBACK_AND_CONTAIN, BLOCK_UNCONFIRMED_ACTION, FAIL_ACCESSIBILITY_GATE |
| Uncertainty codes | RESTORE_TRACE_CONTEXT, FIX_REDACTION_PIPELINE, REGISTER_MISSING_VERSION, REQUEST_INDEPENDENT_APPROVAL, TRIAGE_DRIFT_SLICE, CONVENE_INCIDENT_REVIEW, ASK_USER_TO_CONFIRM, ROUTE_CONTESTATION |
| youDo extra codes | ROLLBACK_COPILOT, ESCALATE_TO_OWNER (not fully aligned with weDo) |

## Appendix B — What is already good (preserve)

1. Section dictionary (overview P1) — keep and expand examples.  
2. Explicit CF-5 reconstructability criterion — keep as single gate slogan, not 7 copies.  
3. Fail-closed triad design (valid / breach / missing) in weDo — keep shape; deepen predicates.  
4. Ethics: synthetic only; signals ≠ guilt; redaction before export.  
5. Resource list quality (OTel, WCAG, NIST, Model Cards, SRE, MLflow).  
6. Deterministic expected outputs on exercises.  
7. Roadmap topic list matches V3 S51.

---

This is the complete Explorer report for Section 51. Ready for the Fixer prompt.
