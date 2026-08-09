# S45 Explorer Report — Cloud, almacenamiento, colas e infraestructura

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering  
**Scope rule:** Section 45 only · analyze, do not fix  
**Date:** 2026-07-24  

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Section index | **45** |
| Platform section id (hash) | `iac` |
| Title | Cloud, almacenamiento, colas e infraestructura |
| Short title (catalog) | Cloud y colas |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s45-iac.ts` |
| Live URL | https://pillb.github.io/pyarcana/#iac |
| Level / phase | Master · Phase 3 |
| Estimated hours | 20 |
| Capstone gate | **CP-N4-B** · job asíncrono resiliente |
| Synthetic case | `CASO-IQU-045` (Iquitos, reportes sintéticos) |
| Structural inventory | Theory map + **8** subtopics (T1-A/B … T4-A/B) · **8** iDo demos · **24** weDo (E1/E2/E3 × 8) · **1** youDo · **5** selfCheck · resources (docs/books/courses) |

**Live site note.** The public SPA at https://pillb.github.io/pyarcana/ exposes S45 in the curriculum catalog as *Cloud y colas* with the tagline *job asíncrono con artifact store, status, retry y dead-letter; permisos y costos presupuestados* (20h · Master). Full subsection bodies are client-rendered from the same TS section object; this audit treats `s45-iac.ts` as the source of truth for all theory, I Do / We Do / You Do, exercises, exam (selfCheck), and notes.

**Pedagogical pre-round (domain-relevant).**

- Gradual release (I Do → We Do → You Do) must shift cognitive load with *faded guidance*: rich worked examples first, then completion problems, then independent transfer — not 24 near-identical boolean inversions.  
- Cognitive Load Theory: for distributed systems, reduce *extraneous* load (template boilerplate, meta versioning notes) so *intrinsic* load (delivery semantics, idempotency, DLQ, RPO/RTO, least privilege) can be encoded.  
- AWS Well-Architected Reliability stresses loosely coupled dependencies, **idempotent** mutating operations, controlled retries, queue limits, and **dead-letter** handling for poison messages — the conceptual spine of this section is right; depth of modeling must match Master level.  
- Domain teaching best practice: teach *contracts* with a single end-to-end narrative job (produce → store → queue → process → DLQ → cost/IAM) rather than eight isolated dict predicates.

**Out of scope:** applying fixes; other sections; product UI chrome.

---

## 2. Executive Summary of Quality

### Score: **5.8 / 10**

### Verdict

S45 is a **structurally complete Master scaffold** with the right *topic graph* (object/relational/cache → consistency/lifecycle/backup → queues/delivery → dedup/DLQ → compute/IAM/egress → IaC/environments → cost/recovery) and a promotion gate (CP-N4-B) aligned with platform ops. Fail-closed action tokens (`REDESIGN_PERSISTENCE`, `NACK_AND_RETRY`, `SEND_TO_DLQ` in youDo, etc.) and a section dictionary are real strengths.

Quality collapses under **industrial template fill**: theory paragraphs recycle the same “Contrato operativo / Aplicación al caso peruano / PII–fraude–parentesco” block; iDo demos print flags rather than model a job; weDo is 24× inverted-boolean completion with identical instructional prose; youDo is a readiness checklist, not a portfolio architecture. User-facing **meta-leaks** about legacy id `iac` and “path V3 / N4” break redaction standards. Residual **`CASO-LIM-045`** comments contradict `CASO-IQU-045`. At least one iDo demo (`scale_signal`) is **logically wrong**. Compared with gold early sections (rich narrative, progressive code, full learning outcomes), S45 reads as a **contract factory**, not a Master lesson on cloud/queues/infra.

**Promote to Fixer with high priority** on meta-leaks, case-id consistency, theory desubstitution, iDo/youDo substance, and selfCheck alignment — before any content expansion.

---

## 3. Detailed Issue Registry

Severity key: **P0** ship-blocker / student-facing wrongness · **P1** major pedagogy or redaction · **P2** quality / consistency · **P3** polish.

---

### ISSUE-01 · Meta-leak: legacy id + V3 path in `jobRelevance`
- **Severity:** P1  
- **Location:** `jobRelevance` (lines ~15)  
- **Evidence:**  
  > “Id legacy `iac` se conserva; el path V3 es cloud/colas/ops, no solo Terraform como fin en sí mismo.”  
- **Impact:** Students see internal product versioning and migration notes; confuses scope (“is this Terraform or not?”) without teaching. Violates redaction / meta-leak policy.  
- **Dimension:** Meta-text · Consistency with roadmap (internal, not learner-facing)

### ISSUE-02 · Meta-leak: legacy id + V3 / path N4 in theory map
- **Severity:** P1  
- **Location:** Theory intro “Ruta de S45…”, paragraph 4 (~line 33)  
- **Evidence:**  
  > “Id legacy `iac` no limita el alcance a un vendor; V3 es almacenamiento+colas+infra del path N4.”  
- **Impact:** Curriculum engineering language (“V3”, “path N4”) leaks into the first reading surface of the section.  
- **Dimension:** Meta-text

### ISSUE-03 · Residual template case id `CASO-LIM-045` vs `CASO-IQU-045`
- **Severity:** P1  
- **Location:** All 24 weDo starter headers (e.g. `# CASO-LIM-045 · object/relational/cache roles`) while `case_id` fields use `CASO-IQU-045-*`  
- **Evidence:**  
  > `# CASO-LIM-045 · at-least-once + idempotency ack`  
  > `record = {"case_id": "CASO-IQU-045-2A", ...}`  
- **Impact:** Lima vs Iquitos inconsistency; looks like unfinished generation; undermines “casos situados en Perú” credibility and search/trace of the case.  
- **Dimension:** Consistency · Redaction · Meta residual

### ISSUE-04 · Theory paragraph monotony (Contrato operativo template)
- **Severity:** P1  
- **Location:** T1-A, T1-B, T2-A, T3-A, T3-B, T4-A, T4-B (second paragraph of each)  
- **Evidence (repeated nearly verbatim):**  
  > “Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. … Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.”  
- **Impact:** Extraneous cognitive load + zero progressive disclosure: every subtopic claims the *section-level* success criteria instead of a local learning target. Students cannot tell what is *new* in T3-B vs T1-A.  
- **Dimension:** Cognitive load · Connective tissue · Progressive disclosure

### ISSUE-05 · Inappropriate ER / fraud boilerplate in cloud theory
- **Severity:** P1  
- **Location:** Application paragraphs of most subtopics  
- **Evidence:**  
  > “No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.”  
- **Impact:** Language is correct for ER/relationship sections (S11–S36) but **off-topic** for object stores, IAM, and budgets. Dilutes domain focus; suggests copy-paste from another section family.  
- **Dimension:** Narrative flow · Domain relevance · Consistency

### ISSUE-06 · Telegraphic learning outcomes
- **Severity:** P2  
- **Location:** `learningOutcomes`  
- **Evidence:**  
  > “Elige object/relacional/cache” · “Define consistencia, lifecycle y backups” · “Garantiza dedup, orden y DLQ”  
- **Impact:** Gold early sections use full, assessable outcomes (“Definir funciones con def…”, “Usar parámetros…”). Master S45 outcomes read as backlog tickets, not measurable student behaviors.  
- **Dimension:** Pedagogy · Comparison to gold sections

### ISSUE-07 · Thin / non-explanatory theory code samples
- **Severity:** P1  
- **Location:** Theory `code` blocks for T1–T4  
- **Evidence (T1-A):**  
  ```python
  def store_choices() -> tuple:
      kinds = sorted(["cache", "object", "relational"])
      return kinds, "artifacts", "by_access_pattern"
  ```  
  Prints a sorted list; does **not** show when to pick each store, consistency trade-offs, or a job writing artifact+status.  
- **Impact:** Master students leave theory without a worked mental model. Contrasts with S05 gold pattern (real `normalize_*` with wrong/right outputs).  
- **Dimension:** I Do readiness · Cognitive load · External benchmark gap

### ISSUE-08 · iDo demos are flag printers, not worked jobs
- **Severity:** P1  
- **Location:** `iDo.steps` (all 8 demos)  
- **Evidence (pattern):**  
  > `print("least_privilege", True)` · `print("recovery_drill", True)` · `why: "…el demo modela el contrato, no un servicio externo."`  
- **Impact:** I Do should be a **think-aloud worked example** of the full (or partial) job. Printing constants fails GRR “I Do” and does not prepare weDo predicate repair.  
- **Dimension:** Pedagogical structure (I Do fidelity)

### ISSUE-09 · Pedagogical logic bug in T3-A iDo `scale_signal`
- **Severity:** P0  
- **Location:** `S45-T3-A-DEMO`  
- **Evidence:**  
  ```python
  def scale_signal(queue_lag: int, threshold: int = 100) -> str:
      return "lag" if queue_lag >= 0 else "cpu"
  print("scale_on", scale_signal(50))  # always "lag" for any lag >= 0; threshold unused
  ```  
- **Impact:** Teaches an incorrect autoscaling signal rule. `threshold` is dead code. Students who trust the demo encode a wrong model.  
- **Dimension:** Domain correctness · Exercise alignment

### ISSUE-10 · T2-B theory `ingest` demo does not exercise DLQ path
- **Severity:** P2  
- **Location:** Theory T2-B code `dedup_ordering_dlq.py`  
- **Evidence:** Function supports `dlq` when `attempts >= max_attempts`, but demo only calls `ingest` twice for dup and then `print("dlq", "after_3")` as a string label.  
- **Impact:** Missed worked example of poison → DLQ; ordering is only printed, not demonstrated.  
- **Dimension:** Exercise quality · Progressive disclosure

### ISSUE-11 · weDo monotony (24× inverted-boolean factory)
- **Severity:** P1  
- **Location:** Entire `weDo.steps`  
- **Evidence:** Every E1 flips a defective predicate; every E2 is assess(valid/invalid/missing); every E3 is decide(continue/breach/uncertainty). Instructions differ only by topic noun phrase (“Calcula/Compara/Filtra el contrato de `…`”).  
- **Impact:** Students can pattern-match “invert the boolean” without learning cloud semantics. Violates faded guidance (completion should *vary* scaffolding). High volume (24) creates fatigue without depth.  
- **Dimension:** We Do fidelity · Cognitive load · Exercise quality

### ISSUE-12 · weDo intro overclaims fixture diversity
- **Severity:** P3  
- **Location:** `weDo.intro`  
- **Evidence:**  
  > “ocho fixtures peruanos sintéticos distintos”  
- **Impact:** There are eight *case families* with highly similar dict shapes, not eight rich narrative fixtures. Misleading about variety.  
- **Dimension:** Clarity

### ISSUE-13 · `edgeCases` wording confuses adverse fixture with success rule
- **Severity:** P2  
- **Location:** All weDo `edgeCases` arrays  
- **Evidence:**  
  > `["falta cache_ttl_s", "fixture adverso: object/relational por semántica y cache descartable", "CASO-IQU-045-1A es sintético"]`  
- **Impact:** Second item describes the *success* property as the adverse fixture label — reverse of intent. Accessibility/clarity issue for Spanish learners.  
- **Dimension:** Redaction · Exercise quality

### ISSUE-14 · youDo is checklist theater, not architecture portfolio
- **Severity:** P1  
- **Location:** `youDo.starterCode` + requirements  
- **Evidence:** Starter only flips four booleans in `evidence` to go from BLOCKED → READY; no queue, store, IAM policy model, or restore drill code. Requirements mention `SEND_TO_DLQ` / `PAUSE_AND_INSPECT` without scaffolds.  
- **Impact:** Capstone evidence for CP-N4-B can be faked by setting flags True. Rubric weights “Correctitud del contrato” but starter does not require implementing contracts.  
- **Dimension:** You Do fidelity · Exam/portfolio alignment

### ISSUE-15 · Grammar / redaction: youDo context
- **Severity:** P2  
- **Location:** `youDo.context`  
- **Evidence:**  
  > “El gate se bloquea ante: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención.”  
- **Impact:** Ungrammatical mix of list + conjugated verb (“…o restore no probado activa contención”). Same broken clause appears inside theory templates.  
- **Dimension:** Grammatical correctness (Peruvian Spanish)

### ISSUE-16 · SelfCheck breach token misaligned with section vocabulary
- **Severity:** P2  
- **Location:** `selfCheck` Q2  
- **Evidence:** Correct option is `emitir SEND_TO_DLQ…` while theory/weDo teach many local tokens (`REDESIGN_PERSISTENCE`, `NACK_AND_RETRY`, `DEDUP_OR_DLQ`, `DENY_IAM_OR_EGRESS`, …). `SEND_TO_DLQ` appears in youDo requirements, not in T1–T4 gates.  
- **Impact:** Active recall tests a token not taught as the universal S45 error response.  
- **Dimension:** Exam quality and alignment

### ISSUE-17 · SelfCheck Q1 only covers T1-A ADR
- **Severity:** P3  
- **Location:** selfCheck questions  
- **Impact:** Five questions, but multi-topic Master section under-samples queues, IAM, cost, IaC. Weak coverage of learning outcomes 3–8.  
- **Dimension:** Exam quality

### ISSUE-18 · Weak connective tissue S44 → S45
- **Severity:** P2  
- **Location:** Theory intro  
- **Evidence:**  
  > “Esta sección opera el artefacto de S44 como **job asíncrono en la nube**…”  
- **Impact:** Mentions S44 artifact once; no concrete bridge (what CI artifact becomes object key? which pipeline stage enqueues?). Early gold sections chain narrative tightly.  
- **Dimension:** Connective tissue · Roadmap consistency

### ISSUE-19 · Heading capitalization / bilingual tone inconsistency
- **Severity:** P3  
- **Location:** Theory headings  
- **Evidence:** `object store, relacional y cache` · `queue/event y delivery semantics` vs title case map heading.  
- **Impact:** Looks unfinished; uneven Spanish/English mix without glossary callouts in body.  
- **Dimension:** Technical writing

### ISSUE-20 · Unexplained `forecast_pen` / `budget_pen` currency tokens
- **Severity:** P3  
- **Location:** T4-B exercises  
- **Evidence:** fields `forecast_pen`, `budget_pen` (likely soles PEN) never explained in theory.  
- **Impact:** Good localization intent, but students may read “pen” as pen/pencil or unknown unit.  
- **Dimension:** Clarity · Accessibility

### ISSUE-21 · `jobRelevance` density wall
- **Severity:** P2  
- **Location:** `jobRelevance`  
- **Impact:** Single long paragraph packs control plane, DLQ, IAM, cost, legacy id, Terraform disclaimer. First-screen motivation fails progressive disclosure.  
- **Dimension:** Motivation · Cognitive load

### ISSUE-22 · Hours vs depth mismatch (20h claim)
- **Severity:** P2  
- **Location:** Metadata `estimatedHours: 20` vs content depth  
- **Impact:** Catalog promises 20 Master hours; current theory+demos would not honestly fill that without substantial project work that youDo does not scaffold. Risk of trust erosion.  
- **Dimension:** Consistency · Honesty of design

### ISSUE-23 · Dictionary is strong but unused in body
- **Severity:** P3  
- **Location:** Theory map first paragraph  
- **Evidence:** Excellent short glossary (Object store, DLQ, IaC, Budget/quota…). Subsequent topics do not re-link or expand terms.  
- **Impact:** Wasted progressive disclosure opportunity.  
- **Dimension:** Cognitive load (positive partial)

### ISSUE-24 · External resources strong; internal demos weak vs best-in-class
- **Severity:** P2 (comparative)  
- **Location:** `resources` vs theory/iDo  
- **Evidence:** Links to Terraform language, Well-Architected, SQS best practices/DLQ, IAM, 12factor, FinOps, DDIA, SRE — excellent. Body never operationalizes even a *stdlib* mini-queue with visibility timeout / ack-after-effect narrative.  
- **Impact:** Gap between recommended reading and teachable surface is large vs AWS Skill Builder / 6.824-style conceptual labs.  
- **Dimension:** External comparison

---

## 4. Meta-Leak Report

| # | Exact leaked / residual text | Location | Classification |
|---|------------------------------|----------|----------------|
| M1 | “Id legacy `iac` se conserva; el path V3 es cloud/colas/ops, no solo Terraform como fin en sí mismo.” | `jobRelevance` | **Developer / versioning meta** |
| M2 | “Id legacy `iac` no limita el alcance a un vendor; V3 es almacenamiento+colas+infra del path N4.” | Theory map ¶4 | **Developer / versioning meta** |
| M3 | Semi-meta: “Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto cloud/ops por ejercicio.” | Theory map ¶4 | **Curriculum-structure meta** (borderline; rewrite for learners as “primero demos, luego labs…”) |
| M4 | Residual template id **`CASO-LIM-045`** in every weDo starter comment | All weDo starters | **Generation residual** (not AI-to-dev chat, but student-visible inconsistency) |

**Not counted as meta-leak (intentional pedagogy):** `# DEFECT: …` lines inside starters — these are part of the defect-repair lab design.

**Count for sidecar:** **meta_leak_count = 4** (M1–M4).

**No** AI-to-developer chat residue of the form “moved from section X / TODO fix later / ignore this” was found beyond the V3/legacy/path N4 and LIM residual.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Graph of the section (nodes)

```
[S44 artifact] --weak edge--> [S45 map + dictionary]
        |
        v
 T1-A store roles --> T1-B consistency/RPO-RTO
        |
        v
 T2-A delivery/ack --> T2-B dedup/order/DLQ
        |
        v
 T3-A scale/net --> T3-B IAM/egress
        |
        v
 T4-A IaC/envs --> T4-B cost/recovery
        |
        +--> iDo×8 (shallow) --> weDo E1→E2→E3 ×8 (isomorphic) --> youDo checklist --> selfCheck
        |
        v
   Gate CP-N4-B (promotion)
```

**Broken edges:** S44→S45 narrative; theory→iDo depth; iDo→weDo skill transfer; weDo→youDo (tokens diverge); selfCheck→multi-topic coverage; dictionary→body.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Expected (GRR + CLT) | S45 actual | Fidelity |
|-------|----------------------|------------|----------|
| **I Do** | Think-aloud full or partial job; show *why* each line | 8 independent flag demos; generic `why` template | **Low** |
| **We Do** | Guided completion with fading scaffolding & varied tasks | 24 isomorphic boolean repairs | **Medium structure / Low learning variety** |
| **You Do** | Transfer to portfolio artifact | Boolean readiness checklist | **Low** |
| **Autocheck** | Active recall of core contracts | 5 MCQs; partial topic coverage | **Medium-low** |

### 5.3 Cognitive load assessment

| Load type | Assessment |
|-----------|------------|
| Intrinsic (cloud ops) | Appropriately high for Master — but under-taught |
| Extraneous | **High**: template paragraphs, meta V3, LIM/IQU, ER fraud language, English slug headings |
| Germane | **Low**: little productive struggle that builds a job mental model |

### 5.4 Redaction & Peruvian Spanish

- Tone is generally formal instructional Spanish with acceptable anglicisms for domain terms (queue, backlog, egress, DLQ) — OK for Master.  
- Recurrent grammar defect: “…restore no probado **activa** contención” attached to enumerations.  
- Case geography (Iquitos) is good; currency PEN is good if explained; **LIM residual** is a redaction failure.  
- Headings should be Spanish-first, sentence case consistent (e.g. “Almacén de objetos, relacional y caché”).

### 5.5 Domain alignment (external)

Aligned with AWS Well-Architected Reliability (idempotent mutations, retries, DLQ, decoupling) and SQS best practices at the *keyword* level. Not aligned with best-in-class *teaching*: no end-to-end async job story, no visibility-timeout / ack-after-write narrative code, no plan-vs-apply IaC micro-example beyond set equality of resource names.

### 5.6 Comparison to gold early sections (e.g. S05)

| Feature | Gold (S05-type) | S45 |
|---------|-----------------|-----|
| Learning outcomes | Full sentences, assessable | Ticket fragments |
| Theory code | Real functions with wrong/right behavior | Sorted lists / True flags |
| Narrative | Continuous normalizer story | Boilerplate case paragraph |
| Meta-leak | Occasional relocation callouts (still imperfect) | Legacy V3/N4 in student text |
| We Do | Varied defect types | Uniform predicate invert |
| You Do | Build real artifact | Flip readiness booleans |

### 5.7 What is already good (preserve)

1. Section dictionary on first theory block.  
2. Explicit non-goals: no real cloud account, no credentials, cache ≠ source of truth.  
3. Fail-closed separation of **breach** vs **missing/uncertainty** in E2/E3.  
4. Resource list (Well-Architected, SQS, IAM, 12factor, FinOps, DDIA, SRE).  
5. Gate CP-N4-B statement in callout and portfolio note.  
6. T2-B theory is slightly less templated and closer to a real contract than T1/T3/T4 siblings — use as rewrite exemplar.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — Explorer does not apply them. Paths relative to repo root.

### Diff A — ISSUE-01 · scrub `jobRelevance` meta

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
   jobRelevance:
-    "En equipos de plataforma y producto, **cloud, almacenamiento, colas e infraestructura** operan el job asíncrono del control plane: object store de artefactos, estado durable, colas con DLQ e IAM mínimo. Se promueve solo cuando reintentos no duplican resultados y costo, backup y recovery están medidos. Id legacy `iac` se conserva; el path V3 es cloud/colas/ops, no solo Terraform como fin en sí mismo.",
+    "En equipos de plataforma y producto, **cloud, almacenamiento, colas e infraestructura** operan el job asíncrono del control plane: object store de artefactos, estado durable, colas con reintentos y dead-letter (DLQ), e IAM de mínimo privilegio. Se promueve solo cuando los reintentos no duplican resultados y cuando costo, backup y recuperación están medidos. El foco es el contrato del job (almacenamiento + colas + ops), no aprender un vendor o herramienta de IaC como fin en sí mismo.",
```

### Diff B — ISSUE-02 · scrub theory map meta + tighten order paragraph

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
-        "Orden: T1 persistencia → T2 colas/dedup/DLQ → T3 compute/IAM/egress → T4 IaC, costo y recovery. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto cloud/ops por ejercicio. Id legacy `iac` no limita el alcance a un vendor; V3 es almacenamiento+colas+infra del path N4. Stack didáctico: **stdlib** modelando contratos cloud sin cuenta real.",
+        "Orden: T1 persistencia → T2 colas/dedup/DLQ → T3 compute/IAM/egress → T4 configuración declarativa, costo y recovery. Primero ves demos locales del contrato, luego reparas predicados fallidos (válido / adverso / dato faltante) y al final armas el job mínimo en el proyecto. Stack didáctico: **stdlib** de Python modelando contratos cloud **sin cuenta real ni egress**.",
```

### Diff C — ISSUE-03 · CASO-LIM → CASO-IQU in all starter comments

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
-# CASO-LIM-045 · object/relational/cache roles
+# CASO-IQU-045 · object/relational/cache roles
```

*(Apply `replace_all` for `# CASO-LIM-045` → `# CASO-IQU-045` across the file — 24 starters.)*

### Diff D — ISSUE-04/05 · replace one theory body (pattern for all 7 template subtopics)

Example for T1-A; Fixer should specialize each subtopic similarly (local entrada/salida only; drop fraud boilerplate).

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
       paragraphs: [
         "Elige **object store** para blobs/artefactos por key, **relacional** para invariantes y consultas, y **cache** solo para copias descartables. **No uses cache como registro autoritativo**: si el job reintenta, la verdad debe vivir en store o DB durable, no en un TTL que mentirá al revisor.",
-        "Contrato operativo. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida de este subtema: ADR de persistencia con fuente de verdad (`object` | `relational` | `cache`). Error: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención. Criterio de éxito: reintentos no duplican resultados y costo, IAM, backup y recuperación quedan medidos.",
-        "Aplicación de `object store, relacional y cache` al caso peruano sintético `CASO-IQU-045`: procesamiento sintético de reportes para una organización ficticia en Iquitos. La evidencia esperada es ADR de persistencia con fuente de verdad (artefactos en object store; status del job en relacional). No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "Contrato local de este subtema. **Entrada:** tipo de dato (blob de reporte, fila de status, lectura caliente). **Salida:** ADR de persistencia con fuente de verdad explícita (`object` | `relational` | `cache`). **Error de diseño:** marcar `cache_authoritative=true` o guardar transacciones solo en cache. **Éxito medible:** un reintento del job relee status desde relacional y el artefacto por key en object store.",
+        "En `CASO-IQU-045` (reportes sintéticos, organización ficticia en Iquitos): el PDF/JSON del reporte vive en object store; el status del job (`queued|running|done|failed`) en tabla relacional; un cache opcional acelera lecturas del dashboard y **nunca** es autoritativo. Datos 100% sintéticos; sin PII ni secretos.",
       ],
```

### Diff E — ISSUE-06 · learning outcomes as assessable sentences

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
   learningOutcomes: [
-    { text: "Elige object/relacional/cache" },
-    { text: "Define consistencia, lifecycle y backups" },
-    { text: "Diseña colas y delivery semantics" },
-    { text: "Garantiza dedup, orden y DLQ" },
-    { text: "Dimensiona compute y red" },
-    { text: "Restringe IAM, paths privados y egress" },
-    { text: "Declara infra y environments" },
-    { text: "Presupuesta costo y recovery" },
+    { text: "Elegir object store, relacional o cache según el patrón de acceso y declarar la fuente de verdad" },
+    { text: "Definir consistencia por operación, lifecycle y un restore sintético con RPO/RTO medidos" },
+    { text: "Diseñar colas/eventos con semántica de entrega (p. ej. at-least-once) y ack posterior al efecto durable" },
+    { text: "Garantizar deduplicación por clave, ordenamiento acotado y terminalización en DLQ" },
+    { text: "Dimensionar compute/autoscaling y red privada con señal de backlog y backpressure" },
+    { text: "Restringir IAM al mínimo, paths privados y egress allowlisted con prueba negativa" },
+    { text: "Declarar infraestructura por environment y rechazar planes con secretos o destrucción inesperada" },
+    { text: "Presupuestar costo/cuotas y documentar recovery y portabilidad ensayadas" },
   ],
```

### Diff F — ISSUE-09 · fix `scale_signal` demo

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
-          code: `def scale_signal(queue_lag: int, threshold: int = 100) -> str:
-    return "lag" if queue_lag >= 0 else "cpu"
-
-print("scale_on", scale_signal(50))
-print("private", True)
-print("api_edge", True)`,
-          output: `scale_on lag
+          code: `def scale_signal(queue_lag: int, threshold: int = 100) -> str:
+    """Escala por backlog de cola cuando el lag supera el umbral; si no, observa CPU."""
+    return "lag" if queue_lag >= threshold else "cpu"
+
+print("scale_on", scale_signal(50, threshold=100))
+print("scale_on", scale_signal(150, threshold=100))
+print("private_network", True)`,
+          output: `scale_on cpu
+scale_on lag
 private True
-api_edge True`,
```

*(Fix output keys to match prints: `private_network True` only — drop unused `api_edge` or keep consistently.)*

Corrected intended output:

```
scale_on cpu
scale_on lag
private_network True
```

### Diff G — ISSUE-10 · make T2-B theory demonstrate DLQ

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
 seen = set()
 print(ingest(seen, "k1", 0))
 print(ingest(seen, "k1", 1))
-print("dlq", "after_3")`,
-        output: `new
+print(ingest(set(), "poison", 3))`,
+        output: `new
 dup
-dlq after_3`,
+dlq`,
```

### Diff H — ISSUE-14/15 · youDo context grammar + starter that models a mini job

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
-    context: "Arquitectura distribuida mínima declarativa. Trabaja sobre procesamiento sintético de reportes para una organización ficticia en Iquitos. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida: estado durable, resultado en object store y fallas terminales en dead-letter queue. El gate se bloquea ante: mensaje duplicado, cuota, egress no autorizado o restore no probado activa contención.",
+    context: "Arquitectura distribuida mínima declarativa. Trabaja sobre procesamiento sintético de reportes para una organización ficticia en Iquitos. Entrada: job idempotente, artefacto, política de entrega, presupuesto y permisos mínimos. Salida: estado durable, resultado en object store y fallas terminales en dead-letter queue. El gate se bloquea si hay mensaje duplicado con side-effect, cuota excedida, egress no autorizado o restore no probado.",
```

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
-    starterCode: `CASE_ID = "CASO-IQU-045"
-REQUIRED = ['decision_de_store_cache_y_consistencia', 'cola_con_deduplicacion_retry_dlq', 'iam_red_y_egress_minimos', 'iac_por_entorno_con_presupuesto_cuotas_y_restore']
-evidence = {
-    "decision_de_store_cache_y_consistencia": False,
-    "cola_con_deduplicacion_retry_dlq": False,
-    "iam_red_y_egress_minimos": False,
-    "iac_por_entorno_con_presupuesto_cuotas_y_restore": False
-}
-
-def readiness(bundle: dict[str, bool]) -> tuple[str, list[str]]:
-    missing = [name for name in REQUIRED if bundle.get(name) is not True]
-    return ("READY", []) if not missing else ("BLOCKED", missing)
-
-status, missing = readiness(evidence)
-print(CASE_ID, status)
-print("missing", ",".join(missing))
-assert status in {"READY", "BLOCKED"}
-`,
+    starterCode: `CASE_ID = "CASO-IQU-045"
+# Esqueleto del job asíncrono local (sin cloud real).
+# Completa process_once: ack solo tras efecto durable; dups → skip; poison → SEND_TO_DLQ.
+
+object_store: dict[str, bytes] = {}
+job_status: dict[str, str] = {}
+seen_keys: set[str] = set()
+dlq: list[dict] = []
+
+def process_once(msg: dict, *, max_attempts: int = 3) -> str:
+    key = msg["idempotency_key"]
+    if key in seen_keys:
+        return "SKIP_DUP"
+    if msg.get("attempts", 0) >= max_attempts:
+        dlq.append(msg)
+        return "SEND_TO_DLQ"
+    if not msg.get("artifact_bytes"):
+        return "PAUSE_AND_INSPECT"
+    # TODO: escribir artifact en object_store, status durable, luego marcar seen_keys
+    raise NotImplementedError("implementa efecto durable + ack lógico")
+
+print(CASE_ID, "skeleton")
+`,
```

### Diff I — ISSUE-16 · align selfCheck Q2 with multi-gate teaching

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
       {
-        question: "Si ocurre la condición de error de S45, ¿qué respuesta preserva seguridad y auditabilidad?",
-        options: ["continuar y ocultar el warning", "inventar evidencia faltante", "emitir SEND_TO_DLQ y conservar evidencia", "borrar el trace para reducir ruido"],
-        correctIndex: 2,
-        explanation: "El contrato falla cerrado con SEND_TO_DLQ; no convierte incertidumbre o breach en éxito.",
+        question: "Ante un mensaje poison tras N reintentos (o un breach de entrega), ¿qué respuesta preserva seguridad y auditabilidad?",
+        options: [
+          "continuar y ocultar el warning",
+          "inventar evidencia faltante",
+          "terminar en DLQ (p. ej. SEND_TO_DLQ / DEDUP_OR_DLQ) y conservar evidencia",
+          "borrar el trace para reducir ruido",
+        ],
+        correctIndex: 2,
+        explanation: "Los contratos de S45 fallan cerrado: breach o poison van a contención/DLQ con evidencia; la incertidumbre se enruta a inspección, no a éxito silencioso.",
       },
```

### Diff J — ISSUE-18 · S44 bridge sentence (add after map dictionary)

```diff
--- a/src/lib/course/sections/s45-iac.ts
+++ b/src/lib/course/sections/s45-iac.ts
@@
         "Esta sección opera el artefacto de S44 como **job asíncrono en la nube** (modelo didáctico, sin cuenta real): object store, relacional, cache, colas con delivery semantics y presupuestos. Contratos al estilo Well-Architected/Terraform language (referencia). El caso `CASO-IQU-045` (reportes sintéticos en Iquitos) no usa credenciales ni egress real.",
+        "Puente desde S44: el artefacto de pipeline (imagen/paquete firmado o bundle de release) es la **entrada** del job; aquí decides dónde se guarda el resultado, cómo se encola el trabajo, qué pasa si el worker muere a mitad, y con qué permisos/presupuesto corre. No reimplementas CI: **consumes** su salida de forma idempotente.",
```

### Diff K — ISSUE-13 · edgeCases wording (pattern)

```diff
-        edgeCases: ["falta cache_ttl_s", "fixture adverso: object/relational por semántica y cache descartable", "CASO-IQU-045-1A es sintético"],
+        edgeCases: ["falta cache_ttl_s", "fixture adverso: cache_authoritative=true o transactions=cache", "CASO-IQU-045-1A es sintético"],
```

*(Repeat per subtopic with the actual adverse condition.)*

### Diff L — ISSUE-20 · explain PEN in T4-B theory first paragraph

```diff
-        "Presupuesto y quotas son controles operativos; recovery y portability se ensayan con exportaciones/formatos abiertos, no se prometen.",
+        "Presupuesto y quotas son controles operativos (montos en **PEN**, soles peruanos sintéticos: campos `forecast_pen` / `budget_pen`); recovery y portability se ensayan con exportaciones/formatos abiertos, no se prometen.",
```

### Diff M — ISSUE-08 (scope note for Fixer, not a full rewrite)

Rewrite **one** end-to-end iDo demo first (recommended order: T2-A delivery + T2-B DLQ as a single narrative job), then thin the other demos to call into shared helpers — rather than eight independent `print(True)` blocks. Full multi-demo rewrite is larger than a single patch; prioritize T2 narrative + T3-A bugfix (Diff F).

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 · Ship hygiene** | ISSUE-01, 02, 03 (meta + CASO-LIM) | Student-visible residuals; zero conceptual risk; pure redaction |
| **2 · Correctness** | ISSUE-09 (scale_signal), ISSUE-10 (DLQ demo), ISSUE-15 (grammar) | Wrong teaching is worse than thin teaching |
| **3 · Theory desubstitution** | ISSUE-04, 05, 07, 18, 20, 06 | Restore progressive disclosure and domain voice |
| **4 · I Do substance** | ISSUE-08 (+ Diff M) | GRR fails without worked examples |
| **5 · You Do + exam** | ISSUE-14, 16, 17 | Portfolio honesty + active recall alignment |
| **6 · We Do variety** | ISSUE-11, 12, 13 | After theory/iDo fixed; avoid rewriting 24 labs twice |
| **7 · Polish** | ISSUE-19, 21, 22, 23, 24 | Headings, hours honesty, resource-to-lab bridge |

**Suggested Fixer MVP (one PR):** Diffs A+B+C+F+G+I+K+L + theory rewrites for T1-A and T2-A as templates for remaining subtopics.

---

## 8. Graph Memory Update Notes

For shared curriculum hardening context:

```yaml
section: 45
id: iac
file: src/lib/course/sections/s45-iac.ts
title: Cloud, almacenamiento, colas e infraestructura
score_1_to_10: 5.8
tier_signal: structural_scaffold_not_gold
issue_count: 24
meta_leak_count: 4
p0_count: 1
p1_count: 11

preserve:
  - section_dictionary_T0
  - fail_closed_valid_invalid_missing_E2_E3
  - CP-N4-B_gate_language
  - no_real_cloud_account_policy
  - resources_well_architected_sqs_iam_finops

fix_first:
  - scrub_legacy_iac_V3_N4_meta
  - CASO-LIM_to_CASO-IQU_comments
  - scale_signal_threshold_bug
  - theory_template_desubstitution
  - youDo_checklist_to_job_skeleton

graph_edges:
  - S44_artifact -> S45_async_job (declared, under-taught)
  - S45 -> S46_data_eng (downstream; not audited here)
  - ER_fraud_boilerplate -> incorrectly_copied_into_S45_theory (remove)

comparative:
  gold_early_sections: richer_narrative_and_code
  external_well_architected: concept_keywords_aligned_depth_low
  external_hands_on_cloud: intentionally_stdlib_ok_but_need_stdlib_depth

explorer_status: complete
fixer_ready: true
```

**Nodes quality flags for fleet memory**

| Node family | Quality edge |
|-------------|--------------|
| Dictionary | keep / expand |
| Theory bodies | rewrite (template) |
| Theory code | deepen |
| iDo | rewrite (worked job) |
| weDo E1–E3 | keep structure; vary defects later |
| youDo | rewrite starter |
| selfCheck | expand + align tokens |
| resources | keep |
| meta (legacy/V3) | delete from UX |

---

## Pass log (STORM loops)

1. **Surface scan:** Catalog + full `s45-iac.ts` inventory (theory 9 blocks, iDo 8, weDo 24, youDo, selfCheck 5, resources).  
2. **Deep pedagogy:** GRR/CLT against I/We/You; template monotony; hours honesty.  
3. **Redaction & grammar:** Spanish defects; LIM/IQU; heading tone.  
4. **Meta-leak detection:** legacy `iac`, V3, path N4, CASO-LIM residual.  
5. **Comparative:** Well-Architected Reliability / SQS DLQ / gold S05-style sections.  
6. **Diff architecture:** A–M proposals ready for Fixer.  
7. **Loop check:** No major dimension left blank (meta, grammar, flow, IWY, load, exams, roadmap, external, domain bugs).

---

This is the complete Explorer report for Section 45. Ready for the Fixer prompt.
