# S38 Explorer Report — Concurrencia, observabilidad y workflows resilientes

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor (STORM + Graph + Loop + Harness)  
**Platform section id (hash):** `performance-extreme`  
**Live URL:** https://pillb.github.io/pyarcana/#performance-extreme  
**Repo source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s38-performance-extreme.ts`  
**Related live-lab override:** `/Users/pabloillescas/Projects/PyArcana/src/components/course/SectionView.tsx` (`performance-extreme` playground block)  
**Automated prior audit:** `course-state/curriculum_hardening/audits/S38_AUDIT.json` → `ACCEPT` (boilerplate crawl only; does not cover pedagogy depth)  
**Analysis date:** 2026-07-24  
**Scope rule:** Section 38 only. No product fixes applied in this run.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 38 |
| Title | Concurrencia, observabilidad y workflows resilientes |
| shortTitle | Concurrencia y resiliencia |
| id | `performance-extreme` (legacy platform id; content re-themed to concurrency + resilience) |
| Phase / level | Phase 2 · Competente a experto |
| estimatedHours | 19 |
| Gate framing | CP-N3-C operación (pipeline reanudable, o11y, idempotencia) |
| Case fixture | `CASO-LIM-038` / Red Andina sintético |
| Theory map | T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes |
| Subtopics | S38-T1-A/B, S38-T2-A/B, S38-T3-A/B, S38-T4-A/B (8) |
| I Do demos | 8 (`S38-T*-DEMO`) |
| We Do exercises | 24 (E1 guided / E2 independent / E3 transfer × 8 subtopics) |
| You Do | Mini-worker reanudable + runbook (portfolio CP-N3-C) |
| Self-check | 5 MCQ |
| Resources | asyncio, concurrent.futures, multiprocessing, queue, logging, OTel, Google SRE SLO/cascading failures, Twelve-Factor, Tenacity, books + MIT/Stanford courses |

**In scope for this Explorer pass**

- All theory paragraphs, code, callouts  
- I Do / We Do / You Do / selfCheck / resources  
- Meta-leak and developer-facing language  
- Live SPA landing catalog card (S38) + source truth for full section body  
- SectionView hard-coded playground for id `performance-extreme` (affects live practice UX for this section)  
- Continuity with S37 (profiling) and handoff to S39 (Case Triage N3)  
- Comparison to gold-standard early sections (esp. S09 exceptions/logs) and external concurrency/SRE curricula  

**Out of scope**

- Applying diffs / editing product TS  
- Other sections except as comparative benchmarks  

**Pre-round research (pedagogy + domain)**

- Gradual Release of Responsibility (I Do / We Do / You Do): model with think-aloud → guided practice → independent transfer; stretch across lessons to avoid overload.  
- Cognitive Load Theory: high intrinsic load topics need chunking; minimize extraneous load (meta-leaks, instruction/starter mismatches, stale playgrounds).  
- Python concurrency teaching norms (Real Python path, Talk Python concurrency course, community consensus): I/O → threads/async; CPU → processes; measure first; show real `Queue(maxsize)`, `ProcessPoolExecutor`, `asyncio` patterns.  
- Observability: three signals logs/metrics/traces + correlation context (OpenTelemetry primer; industry “pillars” framing).  
- SRE: SLI vs SLO vs error budget as operational policy (Google SRE book/workbook), not slogan labels.  

---

## 2. Executive Summary of Quality

### Score: **7.0 / 10**

### Verdict

**Solid operational curriculum architecture with shallow mechanism practice.** S38 has a clear T1–T4 story, strong gate language (idempotence, no PII, backpressure), excellent resource list, and a consistent E1/E2/E3 We Do lattice. As a *contract-and-runbook* section for CP-N3-C it coheres with S37 (measure first / same_result culture) and feeds S39 (Case Triage assembly).

It underperforms “Competente a experto” expectations and early gold-standard sections because:

1. Nearly all theory and I Do code is **label/print theater** (dicts and strings) rather than runnable concurrency/o11y mechanisms.  
2. Multiple **meta-leaks** expose legacy id retention and “path V3” author notes to learners.  
3. The **live SectionView playground** for `performance-extreme` still teaches **Numba / Polars / list-comp benchmarking** — the pre-V3 “performance extreme” topic — actively contradicting the section body.  
4. Several We Do **instructions misdescribe the starter defect**, adding extraneous cognitive load.  
5. Transfer (E3) tasks often reduce to flipping a boolean or printing a magic token, not transferring a skill under a new constraint.

Automated crawl (`S38_AUDIT.json`) correctly marks **ACCEPT** for boilerplate density; that metric does **not** imply pedagogical excellence.

**Promotion readiness (content quality):** usable with medium-priority Fixer pass (meta-leaks + playground + instruction alignment + 2–4 deeper demos). Not “gold early-section” quality yet.

---

## 3. Detailed Issue Registry

Severity key: **P0** blocks honest learning on live path · **P1** high pedagogical / trust impact · **P2** medium quality · **P3** polish.

| # | Sev | Dimension | Location | Evidence (quote / fact) | Pedagogical impact |
|---|-----|-----------|----------|-------------------------|-------------------|
| I01 | **P0** | Consistency / live UX | `SectionView.tsx` playground `performance-extreme` | Title: «Practica benchmarking y vectorizacion»; code demos Numba JIT, Polars vs pandas, list comprehension speedup | Learner who opens the section practice lab gets **wrong domain** (microbench / Numba) while theory says concurrency + resilience. Direct contradiction of “no Numba/Cython extremo”. High extraneous load + trust damage. |
| I02 | **P1** | Meta-leak | `jobRelevance` | «Id \`performance-extreme\` conservado.» | Exposes platform/migration internals. Learner does not need id conservation notes. |
| I03 | **P1** | Meta-leak | theory map paragraph 4 | «Legacy id \`performance-extreme\` se conserva; el path V3 es concurrencia + resiliencia, no Numba/Cython extremo.» | Author changelog + version path leaked into user-facing theory. |
| I04 | **P1** | Meta-leak | `youDo.context` | «Id performance-extreme conservado.» | Same leak on portfolio brief. |
| I05 | **P1** | Cognitive load / exercise quality | We Do majority (esp. E2/E3) | Pattern: change `"unlimited"`→`"limited"`, `False`→`True`, print `"error_budget"` | At “experto” level, active recall of **labels** without implementing queues, timeouts, or checkpoint stores produces **illusion of competence**. Misaligned with GRR “You Do readiness”. |
| I06 | **P1** | I Do fidelity | All 8 demos | Demos nearly clone theory snippets (`pick`, `TokenBucket`, `idem_key`, `backoff`) with one-line `why` | I Do lacks think-aloud, failure path, or multi-step narrative. Gradual release starts thin → We Do stays thin. |
| I07 | **P1** | Instruction / starter drift | `S38-T2-A-E2` | Instruction: starter imprime `'buffer_infinite'` y `maxsize 0`. Actual starter: `"unbounded_queue"` / `maxsize None` | Learner searches for a defect that is not there → frustration, wasted working memory. |
| I08 | **P1** | Instruction / starter drift | `S38-T2-A-E3` | Instruction: starter dice `'only_cpu'`. Actual: `"flood"` + `ban_risk False` | Same mismatch class. |
| I09 | **P1** | Instruction / starter drift | `S38-T3-B-E3` | Instruction: starter imprime `'infinite_sla'`. Actual: `"uptime_only"` | Same mismatch class. |
| I10 | **P1** | Instruction / starter drift | `S38-T4-A-E2` | Instruction: starter usa solo `'case'`. Actual: `"case:step"` + `dup True` | Partial key already present; instruction overstates defect. |
| I11 | **P1** | Instruction / starter drift | `S38-T4-B-E2` | Instruction: starter dice `'delete_always'`. Actual: `"retry_forever"` / `replay "uncontrolled"` | Same mismatch class. |
| I12 | **P2** | Progressive disclosure / code depth | Theory T1–T4 code blocks | e.g. `fetch_with_timeout` returns a static policy dict; no real timeout, no `queue.Queue`, no process pool | Concepts named correctly but **mechanism never exercised**. Gap vs Real Python / stdlib docs linked in resources. |
| I13 | **P2** | Domain correctness (didactic oversimplification) | TokenBucket T2-A | Tokens never refill; only initial rate | Teaches “deny after N” not token bucket refill/window. Risk of wrong mental model of rate limits. |
| I14 | **P2** | Domain ambiguity | T4-A checkpoint / `resume_from` | Theory: «resume_from=features (o el siguiente paso pendiente según diseño)»; code sets `resume_from` to completed step | Ambiguous resume semantics (last done vs next pending). E3 solution prints `state["step"]` when status is `done` without advancing. |
| I15 | **P2** | Connective tissue | T1→T4 narrative | Each subtopic uses identical template: concepto → Contrato operativo → Aplicación CASO → toy code → callout | Template is navigable but **monotone**; little “bridge” sentence that carries a single batch run end-to-end across demos. |
| I16 | **P2** | We Do test meta-text | All 24 `tests` fields | «Imprime el token de pase y la salida alinea con la solución de S38-…» | No actual PASS token is printed in solutions; tests string is **harness boilerplate**, not a verifiable criterion. Mild meta / hollow assessment language. |
| I17 | **P2** | You Do scaffold thinness | `youDo.starterCode` | Only `checkpoint` mutates step to done; no pool, o11y, retry, DLQ | Portfolio objectives list 4 pillars; starter only models checkpoint. High jump from We Do label drills → full mini-worker without intermediate integration We Do. |
| I18 | **P2** | Self-check depth | `selfCheck` (5 Q) | Good coverage of GIL, backpressure, idempotency, PII, timeout hang | No item on error budget consumption policy, DLQ vs retry, or measure-first. Slight under-sampling of T3-B/T4-B. |
| I19 | **P2** | Accessibility / jargon | Multiple | «o11y» used in I Do why / You Do without Spanish expansion on first use; headings like `threads/processes/async` all-lowercase | Mild clarity hit for es-PE learners; inconsistent title casing vs early sections. |
| I20 | **P3** | Redaction / tone | Starter comments | Heavy English `DEFECT:` comments in learner-facing starters | Acceptable bilingual tech tone but uneven vs fully es-PE instructions. |
| I21 | **P3** | PdfReport label | `PdfReport.tsx` | `"performance-extreme": '38. Perf+'` | Cryptic short label still implies “performance extreme”, not concurrency/resilience. |
| I22 | **P3** | Comparative gap | Whole section vs external | Resources cite SRE + asyncio; body never runs `asyncio.wait_for`, `Queue(maxsize=…)`, or structured logging handlers | Curriculum **points** to gold materials but does not **approximate** their exercises even in miniature. |

**Strengths (not issues; retained for Fixer context)**

- Dictionary-first map paragraph reduces vocabulary load.  
- Explicit operational contracts (entrada/salida/error/criterio) per subtopic — strong Graph Engineering pattern.  
- PII / synthetic data discipline consistent with course ethics.  
- Resources list is best-in-class for the topic cluster.  
- Self-check explanations are pedagogically sound (not just “correct option”).  
- Roadmap placement: S37 measure → S38 operate under load → S39 integrate is correct.  

**Issue count (registry rows): 22** (I01–I22).

---

## 4. Meta-Leak Report

Exact user-facing strings that leak authoring / platform migration concerns:

| # | File | Field / area | Exact leaked text | Why it is a leak |
|---|------|--------------|-------------------|------------------|
| M1 | `s38-performance-extreme.ts` | `jobRelevance` | `Id \`performance-extreme\` conservado.` | Platform id retention note for maintainers. |
| M2 | `s38-performance-extreme.ts` | theory[0].paragraphs[3] | `Legacy id \`performance-extreme\` se conserva; el path V3 es concurrencia + resiliencia, no Numba/Cython extremo.` | Legacy + V3 redesign commentary. The educational point (“no micro-opt extremo”) can stay **without** “Legacy id / path V3”. |
| M3 | `s38-performance-extreme.ts` | `youDo.context` | `Id performance-extreme conservado.` | Same as M1 on portfolio surface. |
| M4 | `SectionView.tsx` | playground title/body | Entire Numba/Polars/vectorization lab under key `performance-extreme` | **Content fossil** of old section theme; functions as silent meta (“we never updated the lab”). Not a prose comment, but stronger than text leaks for learners. |
| M5 | We Do `tests` (×24) | tests field | `Imprime el token de pase y la salida alinea con la solución de S38-…` | Assessment harness language; no token exists in solution outputs. |

**Related but borderline (not counted as pure meta if rephrased carefully):**

- Gate codes `CP-N3-C`, `CASO-LIM-038` — intentional curriculum scaffolding; keep.  
- «Stack didáctico: **stdlib**…» — pedagogical framing OK.  
- Callouts about “antes de prod” — operational pedagogy OK.  

**meta_leak_count (strict M1–M5 classes): 5** (3 prose id/V3 leaks + 1 stale lab fossil + 1 hollow token boilerplate family).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Meta-text / developer leakage

See §4. Pattern matches S37 (`Id \`dbt-bigquery\` conservado`) and S09 (`id de plataforma \`visualization\` conservado`): **systemic** late-phase leakage of legacy ids. Fixer should apply the same redaction recipe: remove id conservation clauses from learner surfaces; keep platform id only in code `id:` field.

### 5.2 Grammatical correctness and redaction quality (Peruvian Spanish)

Overall prose is competent professional es-PE: clear imperatives, LatAm operational vocabulary (proveedor, cola, reejecución, on-call as loanword). Strengths:

- Natural second person where needed («Te muestro 8 demos…»).  
- Domain terms introduced with brief glosses in the section dictionary.  

Issues:

- Inconsistent heading capitalization (`threads/processes/async` vs sentence-style headings elsewhere).  
- Abbreviations: expand **o11y → observabilidad (o11y)** on first You Do / I Do mention.  
- Heavy English in starters (`DEFECT:`) vs Spanish instructions — intentional bilingual tech is fine if consistent; currently mixed.  
- «ban» / «ban_risk» as code tokens are OK; prose «banear» is acceptable LATAM tech Spanish.  
- No major grammar errors found in theory paragraphs (subject-verb, agreement, punctuation).  
- Some sentences pack three clauses (contrato + error + criterio) — dense but intentional template.

### 5.3 Connective tissue and narrative flow

**Map → T1 → T2 → T3 → T4** is explicit and good. Job relevance opens with a real ops pain (hang / duplicate side effects) — strong motivation.

Weaknesses:

- No single **running story** of one case `c-synth-1` through measure → rate limit → timeout → log → checkpoint → DLQ with cumulative state. Each subtopic restarts application framing.  
- I Do intro promises «8 demos» but demos do not reference each other’s outputs.  
- Bridge to S39 is only implicit via gate CP-N3-C naming (S39 source does mention S27–S38 assembly). A one-sentence forward pointer would help.

Compared with early gold (S09): S09 connects ETL from S08 and normalizers S05–S07 with concrete shared entities (`C00x`, `Decimal` montos). S38’s CASO-LIM-038 is present but not threaded as a continuous artifact.

### 5.4 Pedagogical structure (I Do / We Do / You Do fidelity)

| Phase | Design intent | Actual fidelity | Grade |
|-------|---------------|-----------------|-------|
| I Do | Model full process with think-aloud | 8 micro-snippets + short `why`; almost no failure demo | **C+** |
| We Do | Guided repair → independent → transfer | E1/E2/E3 structure present; depth is string/boolean repair | **C** |
| You Do | Portfolio integration | Rubric strong; starter only checkpoint; jump is large | **B-** |
| Self-check | Active recall ≥70% gate | 5 solid MCQs, thin on T3-B/T4-B policy | **B** |

**Gradual release problem:** I Do and We Do stay at the same cognitive altitude (print contracts). You Do suddenly asks for a mini-worker with pool, o11y, retry, DLQ, runbook — **discontinuous** release, not gradual.

### 5.5 Cognitive load and progressive disclosure

**Intrinsic load:** High — concurrency models + GIL/IPC + backpressure + timeouts + three o11y pillars + SLI/SLO/error budget + state machines + idempotency + retry/DLQ/runbook in one section (~19h estimate is honest if depth were real).

**Extraneous load drivers:** I01 playground mismatch; I07–I11 instruction drift; meta-leaks; hollow “token de pase”.

**Germane load:** Dictionary, contratos, and callouts **help** schema formation. Measure-first message is excellent germane emphasis.

**Progressive disclosure claim vs practice:** Text says «contratos conceptuales de asyncio/multiprocessing sin red real» — OK for safety. But progressive disclosure should still show **miniature real stdlib** (`queue.Queue(maxsize=2)`, `concurrent.futures` sketch, or fake-clock backoff loop). Currently disclosure plateaus at dicts from T1 through T4.

### 5.6 Exercise and exam quality and alignment

**Alignment to learning outcomes:** Outcomes map cleanly to T1–T4 topics. Exercises **name** the outcomes but rarely **implement** them.

**Defect pedagogy:** “Broken starter → fix” is a good pattern (matches S43+ style). When instruction correctly describes defect (T1-A-E1 wrong concurrency choice, T4-B-E1 linear vs exponential backoff), quality is good.

**Transfer (E3):** Often non-transfer (e.g. set `measure_first = True`, print `True` for runbook exists). True transfer would change fixture constraints (mixed bound, refillable bucket, resume next step, jitter note).

**Self-check:** Well written explanations; recommend +2 questions (error budget action; DLQ vs infinite retry).

### 5.7 Consistency with roadmap and previous sections

| Neighbor | Relation | Status |
|----------|----------|--------|
| S37 Profiling | Measure before optimize; same_result culture | **Aligned** — S38 “measure_first” continues the discipline into concurrency choice |
| S39 Integrator | Assembles S27–S38 into Case Triage | **Aligned** at roadmap level; S38 must deliver operable contracts |
| S09 Logging | Redaction + correlation_id | **Conceptually aligned**; S09 has deeper code for redact/logging |
| S28 timeouts/resume | Prior exposure to timeout & reanudación in tests | S38 should **deepen**, not only re-label — currently re-labels |
| Legacy id theme | “performance extreme” / Numba | Body re-themed; **playground + PdfReport label lag** |

### 5.8 Comparison with best-in-class external materials

| Source | What good courses do | S38 gap |
|--------|----------------------|---------|
| Real Python concurrency path | Runnable threads/async/processes labs | No real concurrent primitives executed |
| Talk Python concurrency deep dive | Choose API by workload + combine tools | Decision table only (`pick(bound)`) |
| Google SRE SLO chapter | SLI definition, error budget policy, release freeze | `slo_ok` boolean + label `error_budget` |
| OTel observability primer | Correlate signals via context | Dict with `corr` field only |
| Nygard *Release It!* (cited) | Bulkheads, timeouts, backpressure patterns | Named, not simulated under load |

**Fair expectation for a 19h intermediate-expert section without live network:** stdlib-only simulations *with* `queue`, fake clocks, and multi-step scripts — still far short of full SRE, but closer than pure prints.

### 5.9 Other (clarity, motivation, accessibility)

- Motivation (batch must not hang / must not double side effects) is excellent and job-relevant for LatAm ops.  
- Synthetic data / no PII policy is clear and repeated appropriately (not spam-level like rejected boilerplate tails).  
- Accessibility: code is short; good for low-bandwidth. Downside: short code that only prints labels may **exclude** kinesthetic learners who need to see blocking/queue behavior.  
- Icon `Activity` and fuchsia–indigo gradient fit ops theme.  

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only**. Do not apply in Explorer run. Paths relative to repo root.

### Diff A — Strip meta-leaks from jobRelevance / map / youDo (I02, I03, I04)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ jobRelevance
-    "En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects al reiniciar. Esta sección entrena concurrencia correcta, **observabilidad** (logs/metrics/traces) y workflows con checkpoint/idempotencia para el gate CP-N3-C. Id `performance-extreme` conservado. Logs sin PII real; datos sintéticos CASO-LIM-038.",
+    "En operación de triage (fintech, retail, banca de procesos en Perú y la región), un batch de scoring no puede colgarse por un proveedor lento ni duplicar side effects al reiniciar. Esta sección entrena concurrencia correcta, **observabilidad** (logs/metrics/traces) y workflows con checkpoint/idempotencia para el gate CP-N3-C. Logs sin PII real; datos sintéticos CASO-LIM-038.",
@@ theory map paragraph
-        "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia un API mock y CPU de features en lotes. Legacy id `performance-extreme` se conserva; el path V3 es concurrencia + resiliencia, no Numba/Cython extremo. Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.",
+        "Caso sintético Red Andina (organización ficticia, datos inventados): un worker de scoring recibe picos de I/O hacia un API mock y CPU de features en lotes. El foco es **concurrencia correcta y resiliencia operativa**, no micro-optimización con Numba/Cython. Orden: T1 Concurrencia → T2 Control de carga → T3 Observabilidad → T4 Workflows resilientes. Stack didáctico: **stdlib** (`json`, `time`, `queue`, dicts) + contratos conceptuales de asyncio/multiprocessing sin red real.",
@@ youDo.context
-      "Construye un mini-worker sintético con pool/backpressure, logs redactados, checkpoint idempotente, retry/DLQ y runbook de proveedor lento. Id performance-extreme conservado. Solo datos CASO-LIM-038; sin PII real ni servicios externos.",
+      "Construye un mini-worker sintético con pool/backpressure, logs redactados, checkpoint idempotente, retry/DLQ y runbook de proveedor lento. Solo datos CASO-LIM-038; sin PII real ni servicios externos.",
```

### Diff B — Replace stale SectionView playground (I01 / M4)

```diff
--- a/src/components/course/SectionView.tsx
+++ b/src/components/course/SectionView.tsx
@@
-    'performance-extreme': {
-      title: 'Practica benchmarking y vectorizacion',
-      code: `# Practica performance: comparar enfoques
-import time
-# ... Numba / Polars / list-comp speedup ...
-`,
-      hint: 'Cambia n a 1,000,000 y observa como cambia el speedup',
-    },
+    'performance-extreme': {
+      title: 'Practica backpressure, timeout e idempotencia',
+      code: `# CASO-LIM-038 · contratos de operación (stdlib only)
+from queue import Queue
+
+class TokenBucket:
+    def __init__(self, rate: int):
+        self.tokens = rate
+    def allow(self) -> bool:
+        if self.tokens >= 1:
+            self.tokens -= 1
+            return True
+        return False
+
+q: Queue[str] = Queue(maxsize=2)
+for case_id in ("c1", "c2", "c3"):
+    if q.full():
+        print("backpressure", case_id)
+    else:
+        q.put(case_id)
+        print("enqueued", case_id)
+
+b = TokenBucket(2)
+print("allows", [b.allow() for _ in range(3)])
+
+def idem_key(case: str, step: str, ver: str) -> str:
+    return f"{case}:{step}:{ver}"
+
+print("key", idem_key("c1", "score", "v1"))
+print("timeout_policy", {"seconds": 5, "on_fail": "retry_or_dlq"})
+print("pii_raw", False)
+`,
+      hint: 'Sube maxsize a 3 y observa cómo desaparece el backpressure del tercer caso.',
+    },
```

### Diff C — Align We Do instructions with actual starters (I07–I11)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ S38-T2-A-E2 instruction
-        instruction: "… Starter imprime 'buffer_infinite' y maxsize 0 (defect). …",
+        instruction: "… Starter imprime 'unbounded_queue' y maxsize None (defect). …",
@@ S38-T2-A-E3 instruction
-        instruction: "… El starter dice 'only_cpu' (defect). …",
+        instruction: "… El starter imprime 'flood' y ban_risk False (defect). …",
@@ S38-T3-B-E3 instruction
-        instruction: "… Starter imprime 'infinite_sla' (defect). …",
+        instruction: "… Starter imprime 'uptime_only' y n 0 (defect). …",
@@ S38-T4-A-E2 instruction
-        instruction: "… Starter usa solo 'case' (defect: colisiones entre pasos). …",
+        instruction: "… Starter imprime 'case:step' sin :ver y dup True (defect: colisiones al cambiar lógica). …",
@@ S38-T4-B-E2 instruction
-        instruction: "… Starter dice 'delete_always' (defect). …",
+        instruction: "… Starter imprime 'retry_forever' y replay 'uncontrolled' (defect). …",
```

### Diff D — Hollow tests string → concrete criterion (I16)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ (apply pattern to all 24 exercises)
-        tests: "Imprime el token de pase y la salida alinea con la solución de S38-T1-A-E1.",
+        tests: "Salida exacta de tres líneas igual a solutionCode.output (sin red, sin PII).",
```

### Diff E — Clarify resume_from semantics (I14)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ T4-A theory application
-        "Aplicación a `CASO-LIM-038-T4A`: caso c1 completó features; al reiniciar, resume_from=features (o el siguiente paso pendiente según diseño). La key `c1:features:v3` evita recalcular y reescribir dos veces. …",
+        "Aplicación a `CASO-LIM-038-T4A`: caso c1 completó features; el checkpoint guarda `last_done=features`. Al reiniciar, el worker calcula `resume_from=next_step(last_done)` (p. ej. `score`) y **no** reejecuta pasos con status done. La key `c1:features:v3` evita side effects si un reintento llega tarde. …",
@@ make_checkpoint
-        "resume_from": step,
+        "last_done": step,
+        "resume_from": {"features": "score", "score": "notify", "notify": "done"}.get(step, step),
```

*(Adjust demo/E3 solution in the same pass so prints stay consistent.)*

### Diff F — Deepen one I Do demo (T2-A) as template (I06, I12)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ S38-T2-A-DEMO code (illustrative replacement)
+from queue import Queue
+
+q: Queue[str] = Queue(maxsize=2)
+enqueued, blocked = [], []
+for cid in ("c1", "c2", "c3"):
+    if q.full():
+        blocked.append(cid)
+    else:
+        q.put(cid)
+        enqueued.append(cid)
+print("enqueued", enqueued)
+print("backpressure", blocked)
+print("ok", blocked == ["c3"])
```

```diff
@@ why
-        why: "Modela allow/deny y cola acotada sin red real; evidencia de control de carga.",
+        why: "Think-aloud: con maxsize=2 el tercer caso no entra a memoria — eso es backpressure. Luego el token bucket protege al proveedor; aquí primero acotamos la cola del worker.",
```

### Diff G — Token bucket note (I13)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ T2-A paragraph 1
-        "Un pool acota la concurrencia máxima (N workers). Una cola con `maxsize` aplica backpressure: el productor se bloquea o rechaza cuando la cola está llena, en lugar de crecer hasta OOM. Un rate limit (token bucket didáctico) protege al proveedor mock de un ban o de saturación.",
+        "Un pool acota la concurrencia máxima (N workers). Una cola con `maxsize` aplica backpressure: el productor se bloquea o rechaza cuando la cola está llena, en lugar de crecer hasta OOM. Un rate limit (token bucket **didáctico estático**: tokens iniciales sin recarga en el fixture) protege al proveedor mock de un ban o de saturación. En prod el bucket se rellena por ventana de tiempo; aquí solo practicamos allow/deny.",
```

### Diff H — Heading casing + o11y expansion (I19)

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@
-      heading: "threads/processes/async",
+      heading: "Threads, processes y async (elegir por bound)",
@@ youDo.objectives
-      "O11y + SLI/SLO con redacción",
+      "Observabilidad (logs/metrics/traces) + SLI/SLO con redacción",
```

### Diff I — PdfReport short label (I21)

```diff
--- a/src/components/course/PdfReport.tsx
+++ b/src/components/course/PdfReport.tsx
-  "performance-extreme": '38. Perf+',
+  "performance-extreme": '38. Concurrencia',
```

### Diff J — You Do starter expansion (I17) — optional but recommended

```diff
--- a/src/lib/course/sections/s38-performance-extreme.ts
+++ b/src/lib/course/sections/s38-performance-extreme.ts
@@ youDo.starterCode
+# workflow resiliente CASO-LIM-038
+from queue import Queue
+
+state = {"case_id": "c1", "step": "intake", "status": "pending", "corr": "corr-038"}
+q: Queue[str] = Queue(maxsize=50)
+
+def redact(s: str) -> str:
+    return s[:2] + "***" if len(s) > 2 else "***"
+
+def checkpoint(state: dict, step: str) -> dict:
+    out = dict(state)
+    out["step"] = step
+    out["status"] = "done"
+    out["idem_key"] = f"{out['case_id']}:{step}:v1"
+    return out
+
+def backoff(attempt: int, base: float = 0.1) -> float:
+    return base * (2 ** attempt)
+
+if __name__ == "__main__":
+    print("log", {"event": "start", "corr": state["corr"], "email": redact("ana@example.pe")})
+    print(checkpoint(state, "features"))
+    print("backoff", [round(backoff(i), 3) for i in range(3)])
+    print("queue_maxsize", q.maxsize)
```

### Diff K — Self-check additions (I18) — optional

```diff
+      {
+        question: "Cuando el error budget se agota, la política operativa suele:",
+        options: [
+          "Ignorar el SLO hasta el próximo quarter",
+          "Priorizar estabilidad (p. ej. pausar deploys no urgentes) y remediación",
+          "Duplicar side effects para recuperar throughput",
+          "Desactivar correlation_id",
+        ],
+        correctIndex: 1,
+        explanation: "El error budget convierte el SLO en decisión: al agotarse, se prioriza estabilidad sobre features.",
+      },
+      {
+        question: "Un mensaje que falla siempre de forma no transitoria debe ir a:",
+        options: ["Retry infinito", "DLQ con replay controlado", "Logs con PII completa", "Proceso sin timeout"],
+        correctIndex: 1,
+        explanation: "La DLQ aísla veneno; el replay se hace caso a caso tras inspección, no en bucle ciego.",
+      },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale | Effort |
|----------|--------|-----------|--------|
| **1 · P0** | I01 / Diff B | Live lab teaches wrong topic; breaks trust immediately | S |
| **2 · P1** | I02–I04 / Diff A | Fast meta-leak redaction; systemic pattern | XS |
| **3 · P1** | I07–I11 / Diff C | Instruction/starter honesty; reduces extraneous load | XS |
| **4 · P1** | I16 / Diff D | Hollow assessment language ×24 | XS |
| **5 · P1** | I06 + I12 / Diff F (+ 1–2 more demos) | Raise I Do from labels to mechanisms without full rewrite | M |
| **6 · P2** | I14 / Diff E | Checkpoint resume correctness | S |
| **7 · P2** | I13 / Diff G | Prevent wrong rate-limit mental model | XS |
| **8 · P2** | I17 / Diff J | Soften You Do cliff | S |
| **9 · P2** | I05 (selective E2/E3 rewrite) | Convert 4–6 worst label drills into mini-mechanism fixes | M |
| **10 · P2/P3** | I18–I21 / Diffs H, I, K | Polish, quiz coverage, labels | S |

**Suggested Fixer loop budget:** 1 loop for P0+P1 (Diffs A–D, B, partial F); optional loop 2 for depth (E, J, selective E3).

**Do not** reintroduce Red Andina ethics boilerplate tails (see FIXER_LOG_S43_S50 discipline).

---

## 8. Graph Memory Update notes

For shared curriculum hardening context files / future agents:

```yaml
section: 38
id: performance-extreme
title: Concurrencia, observabilidad y workflows resilientes
score_1_to_10: 7.0
explorer_status: complete
gate: CP-N3-C operación
case: CASO-LIM-038

nodes:
  - id: S38-map
    kind: theory_map
    quality: good
    edges: [S38-T1-A, S37-measure-first, S39-integrator]
  - id: S38-T1
    kind: concurrency_choice
    quality: concept_ok_code_thin
  - id: S38-T2
    kind: backpressure_timeout
    quality: concept_ok_oversimplified_bucket
  - id: S38-T3
    kind: observability_slo
    quality: labels_ok_mechanism_thin
  - id: S38-T4
    kind: checkpoint_dlq_runbook
    quality: semantics_ambiguous_resume
  - id: S38-playground-SectionView
    kind: live_lab
    quality: STALE_P0
    theme_mismatch: Numba/Polars vs concurrency

edges_quality:
  - from: S37
    to: S38
    relation: measure_before_operate
    status: aligned
  - from: S38
    to: S39
    relation: supplies_ops_contracts_for_triage
    status: aligned_at_roadmap
  - from: S38-theory
    to: S38-SectionView-lab
    relation: should_match_theme
    status: BROKEN

meta_leaks:
  - "Id performance-extreme conservado" (jobRelevance, youDo)
  - "Legacy id … path V3" (theory map)
  - hollow "token de pase" tests ×24
  - SectionView fossil lab (Numba/Polars)

fix_do_not:
  - re-add ethics boilerplate tails
  - restore Numba/Cython as main path
  - invent real network calls

fix_must:
  - replace SectionView performance-extreme playground
  - strip legacy id / V3 meta prose
  - align We Do instructions to starters
  - deepen ≥1 demo per topic pair with stdlib Queue/futures sketches
```

**Comparative benchmark note:** Early gold sections (e.g. S09) implement real mechanisms (`raise … from e`, Decimal, finally cleanup). S38 currently teaches **operational vocabulary** more than **operational code**. Fixer should close that gap without abandoning synthetic/no-network constraints.

**Automated auditor note:** `S38_AUDIT.json` ACCEPT / mean_visible_rank 9.52 only certifies low boilerplate density — Explorer score **7.0** remains the pedagogical score of record for this section.

---

This is the complete Explorer report for Section 38. Ready for the Fixer prompt.
