# S46 Explorer Report — Ingeniería de datos y orquestación de producción

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering  
**Date:** 2026-07-24  
**Scope constraint:** Section 46 only — analysis, no curriculum edits applied  

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | **46** |
| Platform section id (hash) | `gpu-computing` (**legacy**; content is **not** GPU/CUDA) |
| Live URL | https://pillb.github.io/pyarcana/#gpu-computing |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s46-gpu-computing.ts` |
| Title (learner-facing) | Ingeniería de datos y orquestación de producción |
| shortTitle | Data eng producción |
| Tagline | pipeline incremental/backfillable sin duplicar, con lineage y alertas por dato tardío o contrato roto |
| Level / phase / hours | Master · phase 3 · 20 h |
| Gate | CP-N4-B · pipeline incremental y backfillable |
| Case | `CASO-HYO-046` (Huancayo sintético) |
| Icon | `Cpu` (reinforces GPU misread) |
| Structural inventory | 9 theory blocks (map + 8 subtopics T1–T4 × A/B); 8 iDo demos; 24 weDo (E1/E2/E3 × 8); 1 youDo; 5 selfCheck MCQ; 10 docs + 2 books + 6 courses |

**V3 topic (roadmap-aligned):** production data engineering / orchestration — event time, watermarks, late data, exactly-once as composite property, DAGs/assets, backfills, data contracts, freshness, lineage, incremental loads, data SLOs/incidents.

**Out of scope for this run:** fixing TS product files; auditing S45/S47 except as adjacency references.

**Live site note:** The public curriculum card for Sección 46 shows title/shortTitle/tagline for data eng (not CUDA). Deep content is hydrated from the same TS module; source inspection is authoritative for theory/iDo/weDo/youDo/selfCheck.

**Pre-round research anchors (domain pedagogy):**
- Apache Flink *Timely Stream Processing*: event time vs processing time; watermark \(t\) asserts no more events with timestamp \(\le t\); late data after watermark progress; allowed lateness vs drop/side-output trade-off (completeness vs latency).
- Data contracts / freshness SLAs (dbt, industry practice): schema + owner + freshness SLO; fail closed on drift; monitor freshness separately from schema contracts.
- Gradual release (I/We/You Do), progressive disclosure, and cognitive-load theory: high **extrinsic** load from identical shells blocks **germane** load needed for DE mental models.
- PyArcana gold bar (`GOLD_STANDARD_CHECKLIST.md`): structural 8/8/24 is necessary but **not** sufficient; template “Contrato operativo” + print-theater demos are explicit anti-gold patterns.

---

## 2. Executive Summary of Quality

### Score: **4.8 / 10**

**Verdict:** **Structurally complete, pedagogically underbuilt.** S46 has the correct V3 topic spine (S45 cloud job → production data pipeline → S47 MLOps), an honest stdlib-first constraint, fail-closed tokens, strong external resource links, and a clear CP-N4-B gate. However, the section is dominated by **generator template soup**: nearly identical “Contrato operativo” / “Aplicación a CASO-HYO-046” paragraphs, **print-theater** theory and iDo demos, inverted `edgeCases` labels, case-id leakage (`CASO-LIM-046` comments vs `CASO-HYO-046` fixtures), developer meta-leaks about legacy `gpu-computing` / V3, a **mis-modeled watermark predicate**, and a youDo that is a boolean checklist rather than a portfolio pipeline. Against early gold peers (S01 narrative density, mechanism teaching, computed demos), S46 fails the expert quality bar despite automated ACCEPT/rank artifacts elsewhere.

**What works**
- Roadmap topic is correct for V3 (data eng, not CUDA); section explicitly renounces GPU in places.
- Glossary on the map block covers the right vocabulary (event time, watermark, late data, exactly-once compuesto, DAG/asset, backfill, contract, lineage, incremental).
- Fail-closed discipline in weDo E2/E3 (PASS / breach token / MISSING / WAIT-style uncertainty) is pedagogically sound in *shape*.
- Resources are domain-honest (Beam, Flink, Airflow, Dagster, OpenLineage, dbt incremental, Great Expectations, SRE monitoring, Spark SS).
- `apply_once` / set-based sink dedup and several exercise predicates *can* teach real checks if theory were deepened.

**What breaks trust**
- Template identity across T1–T4 “Contrato operativo” (same entrada/error/criterio de éxito even when the subtopic is DAG or lineage).
- Theory/iDo code that hardcodes answers (`watermark` returns fixed ISO string; many demos only print labels).
- `edgeCases` second item always restates the **success** condition under the label “fixture adverso”.
- Watermark exercise math does not match Flink/Beam semantics learners will meet in linked docs.
- Meta-text for maintainers visible to learners (`Id legacy`, `path V3`, `gpu_cuda_topic`).
- 24 exercises that train “invert a boolean” more than data engineering judgment.

---

## 3. Detailed Issue Registry

Severity legend: **P0** ship-blocker / wrong topic or harmful misconception · **P1** high pedagogical damage · **P2** medium clarity/consistency · **P3** polish.

### Issue 01 — Legacy id + icon + map flag create GPU cognitive collision  
**Severity:** P1  
**Evidence:**
- `id: "gpu-computing"`; `icon: "Cpu"`.
- `jobRelevance`: *“Id legacy `gpu-computing` se conserva; el path V3 es data engineering/orquestación, no CUDA/GPU kernels.”*
- Theory map paragraph: *“Id legacy `gpu-computing` no implica GPU; V3 es ingeniería de datos del control plane.”*
- Map code prints `gpu_cuda_topic False`.

**Pedagogical impact:** Master learners scanning the SPA hash `#gpu-computing` or Cpu icon form an incorrect schema before reading. Corrective meta-text is itself developer leakage (Issue 02) and still does not rename the public id/icon.

---

### Issue 02 — Developer / curriculum-ops meta-leak in learner-facing fields  
**Severity:** P1 (meta-leak family; full list in §4)  
**Evidence (examples):**
- jobRelevance and theory map: “Id legacy…”, “path V3”, “control plane”.
- Map code keys: `"gpu_cuda_topic": False` printed to the learner.

**Pedagogical impact:** Breaks immersion and Spanish-first professional voice; reads as internal changelog. Gold S01 explains workplace motivation without version-control archaeology.

---

### Issue 03 — Template “Contrato operativo” copy-paste across 7 subtopics  
**Severity:** P0 (against gold anti-pattern #2)  
**Evidence:** Blocks S46-T1-A through S46-T4-B share nearly the same shell:

> “Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. … Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.”

Only the middle “Salida de este subtema: …” phrase changes. T2-A (DAG) still uses watermark/freshness success criterion.

**Pedagogical impact:** Extrinsic load; no progressive mechanism teaching. Learner cannot form distinct mental models for DAG vs freshness vs SLO. Automated rankers may score length; experts correctly score **template soup**.

---

### Issue 04 — Template “Aplicación a CASO-HYO-046” + ER ethics paste  
**Severity:** P1  
**Evidence:** Each subtopic ends with nearly identical:

> “Aplicación de `<topic>` al caso peruano sintético `CASO-HYO-046`: eventos sintéticos de atención para una entidad ficticia en Huancayo. La evidencia esperada es …. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.”

Fraud/parentesco language is cargo-culted from ER/triage sections into pure data-pipeline content.

**Pedagogical impact:** Peru case feels decorative; ethics sentence dilutes DE-specific risks (schema drift, double-count, silent late rewrite, cost of backfill).

---

### Issue 05 — Theory demos are print-theater / non-computational  
**Severity:** P0  
**Evidence (representative):**

```python
def watermark(events, lag_min=1):
    # max event_time minus lag (lab: fixed iso string for stable output)
    return "2026-01-01T09:59:00", len(events), True
```

```python
def incremental_only(incoming: list) -> list:
    # lab: show the delta rows for the partition load
    return list(incoming)
```

```python
def asset_graph(nodes: list, deps: dict) -> tuple:
    return sorted(nodes), deps.get("er", []), "er_clusters"
```

`schedule_cfg` only returns the inputs; `freshness_slo` does not compare lag to now; `data_slo` returns a dict without evaluating breach.

**Pedagogical impact:** Violates gold bar (“Theory code … **computes** the concept”). Teaches that comments + fixed outputs equal understanding. Linked Flink/Beam docs will contradict the stub.

---

### Issue 06 — iDo demos are labels, not worked examples  
**Severity:** P0  
**Evidence:** Pattern across 8 demos — e.g. T1-A-DEMO:

```python
def window_cfg(size_min: int, lag_min: int) -> tuple:
    return f"{size_min}min", f"{lag_min}min", True
print("window", w)
print("wm_lag", lag)
print("vs_processing_time", vs)
```

T2-B-DEMO: `backfill_ok` is `start <= end` only. T3-A-DEMO: `is_fresh` is trivial inequality; schema_fail is a printed string `"block"`. T4-A-DEMO never merges keys or proves second-run zero delta.

**Pedagogical impact:** Gradual release fails at the first layer: learner never *sees* a window close, late event side-output, or acyclic check computed from fixtures. “I Do” becomes “I Print”.

---

### Issue 07 — iDo `why` strings are mechanical templates  
**Severity:** P2  
**Evidence:** All eight `why` fields follow:

> “Hace observable `<topic>` con un caso local pequeño y deja como evidencia `<salida>`; el demo modela el contrato, no un servicio externo.”

**Pedagogical impact:** No causal explanation of *why* the step matters for Huancayo synthetic ops or CP-N4-B promotion.

---

### Issue 08 — Watermark / lateness model is pedagogically wrong relative to linked docs  
**Severity:** P0  
**Evidence — theory prose:** Watermark described as “umbral de atraso aceptado antes de cerrar ventana” (partially ok as *lag*) but exercise predicate is:

```python
meets_contract = (
  record["event_time"] <= record["window_end"]
  and record["event_time"] >= record["watermark"] - record["allowed_lateness"]
)
```

With fixture `event_time=110, window_end=120, watermark=115, allowed_lateness=10`.

**Flink (linked resource):** *Watermark(t)* declares event time has reached *t* — no more elements with timestamp \(t' \le t\) should arrive; **late** = arrives after watermark has passed the event’s timestamp. Allowed lateness is a *post-watermark* grace, not a lower bound `watermark - allowed_lateness` for “in contract”.

**Pedagogical impact:** Learners who pass S46 may fail to read Flink/Beam docs, interview questions, or production streaming code. Completeness-vs-latency trade-off is never shown with ordered vs out-of-order event lists.

---

### Issue 09 — DAG “acyclic” claims without cycle detection  
**Severity:** P1  
**Evidence:** Theory `asset_graph` does not validate edges. Exercise solution:

```python
meets_contract = (
  record["typed_io"]
  and all(a != b for a, b in record["edges"])
  and {x for edge in record["edges"] for x in edge} <= record["nodes"]
)
```

Self-loops and missing nodes are checked; **cycles** `A→B→A` pass. Callouts/outcomes claim “grafo acíclico”. Invalid fixture uses self-loop + undeclared node, not a true cycle.

**Pedagogical impact:** False sense of mastery on a Master-level DAG gate; CP-N4-B “no_cyclic_dag” is not operationalized.

---

### Issue 10 — weDo monotony: 24× invert-boolean drills  
**Severity:** P1  
**Evidence:** Every E1 is “replace defective predicate”; E2 “same inverted assess + missing field”; E3 “missing→CONTINUE fixed to uncertainty token + invert predicate”. Instructions reuse the same sentence frames with topic/token swaps.

**Pedagogical impact:** High extrinsic, low germane load. E3 is not true *transfer* (new representation, multi-step pipeline, or real event list); it is E2 with different status vocabulary. Does not match 20 h Master claim.

---

### Issue 11 — `edgeCases` second entry inverted (labels success as “adverso”)  
**Severity:** P1  
**Evidence (all 24 exercises share the bug pattern):**

```text
"fixture adverso: event_time dentro de ventana y lateness permitido"
"fixture adverso: grafo sin self-loop y todos los nodos declarados"
"fixture adverso: schema exacto, freshness bajo SLO y owner"
…
```

Those phrases describe the **valid** contract, not the adverse fixture (late event, self-loop, schema drift, etc.).

**Pedagogical impact:** Direct instruction error; confuses learners who use edgeCases as a checklist; damages trust in fail-closed narrative.

---

### Issue 12 — Case id split: `CASO-LIM-046` comments vs `CASO-HYO-046` data  
**Severity:** P1  
**Evidence:** All 24 starter comments begin with `# CASO-LIM-046 · …` while records use `CASO-HYO-046-*`. Map and youDo use Huancayo.

**Pedagogical impact:** Meta-leak of generator city-code template; breaks continuity with S45 (`CASO-IQU-045`) geographic storytelling; learners unsure which case id belongs in portfolio.

---

### Issue 13 — Token vocabulary inconsistency (youDo / selfCheck vs weDo)  
**Severity:** P1  
**Evidence:**
- youDo requirements: breach `QUARANTINE_PARTITION`, uncertain `OPEN_DATA_INCIDENT`.
- selfCheck Q2: “emitir `QUARANTINE_PARTITION`…”.
- weDo tokens instead: `QUARANTINE_DATASET`, `REBUILD_PARTITION`, `OPEN_QUALITY_INCIDENT`, `DECLARE_DATA_INCIDENT`, `SIDE_OUTPUT_LATE_EVENT`, etc.

**Pedagogical impact:** Assessment misalignment; learner who only completes weDo may fail youDo/selfCheck vocabulary or invent tokens.

---

### Issue 14 — youDo is a boolean readiness checklist, not a portfolio pipeline  
**Severity:** P1  
**Evidence:** `starterCode` sets four flags to `False` and prints `BLOCKED` until the learner flips them to `True`. Objectives mention tables, lineage, freshness, idempotence, but no scaffold for event fixtures, partition merge, or runbook structure.

**Pedagogical impact:** Weakest transfer layer. Gold bar expects independent challenge with weighted rubric *and* real artifacts; checklist gaming is rewarded.

---

### Issue 15 — Learning outcomes are telegram-style, not measurable  
**Severity:** P2  
**Evidence:**
- “Maneja ventanas y watermarks”
- “Opera SLO e incidentes de datos”

vs S01 style: observable verb + object + success condition.

**Pedagogical impact:** Hard to self-assess; weak interview/portfolio framing for Master DE roles.

---

### Issue 16 — Headings capitalization / micro-redaction  
**Severity:** P3  
**Evidence:** Subtopic headings start lowercase: “ventanas, event time y watermarks”, “contracts y freshness”, “partitions e incremental loads”. Map heading is properly cased.

**Pedagogical impact:** Looks unfinished in UI; minor brand/polish issue for Art Nouveau presentation.

---

### Issue 17 — Theory depth imbalance (T1-B slogan vs multi-paragraph need)  
**Severity:** P2  
**Evidence:** T1-B P1 is a single dense sentence: *“Exactly-once es composición…; late data necesita política…”* without worked sequence (source at-least-once → checkpoint → idempotent sink → key). Gold wants Anchor → Mechanism → Worked example → Edge.

**Pedagogical impact:** Exactly-once misconceptions (broker flag magic) may persist despite correct slogan and ok mini-demo `apply_once`.

---

### Issue 18 — Connective tissue S45→S46→S47 thin beyond one sentence  
**Severity:** P2  
**Evidence:** Map says “opera el job cloud de S45 como pipeline de datos”. No explicit bridge diagram: artifact store/queue job → event stream/tables → ML experiment registry (S47). No recap of S45 DLQ/idempotency keys as inputs to S46 dedup keys.

**Pedagogical impact:** Phase-3 narrative arc feels modularized by generator rather than designed.

---

### Issue 19 — Hint duplication (hint == hints[0])  
**Severity:** P3  
**Evidence:** Every exercise duplicates the same sentence in `hint` and first `hints[]` entry.

**Pedagogical impact:** Progressive hinting (scaffold fading) is fake; second hint is the only extra cue.

---

### Issue 20 — Feedback strings identical across E1/E2/E3 of each subtopic  
**Severity:** P2  
**Evidence:** e.g. T1-A E1, E2, E3 all use the same feedback paragraph about SIDE_OUTPUT_LATE_EVENT / WAIT_FOR_WATERMARK.

**Pedagogical impact:** Missed chance for metacognition differentiated by guided vs transfer.

---

### Issue 21 — Grammar / ES-PE redaction nits  
**Severity:** P3  
**Evidence samples:**
- “DAG/assets y dependency” — English *dependency* vs *dependencias*.
- “vs_processing_time” label in demo without Spanish gloss.
- Mixed punctuation density; long parentheticals in jobRelevance.
- Overall Spanish is intelligible but less polished than S01 workplace voice.

**Pedagogical impact:** Minor; Master audience tolerates English DE jargon, but consistency with course ES-PE policy slips.

---

### Issue 22 — SelfCheck solid shape, limited concept discrimination  
**Severity:** P2  
**Evidence:** Q1–Q4 largely test course policy (evidence, synthetic case, gate wording). Only Q5 probes late data policy. No item forces discrimination of event time vs processing time, or SLI vs SLO, or incremental key design.

**Pedagogical impact:** Autocheck can unlock next section without conceptual mastery of T1–T4.

---

### Issue 23 — Automated prior ACCEPT / rank 9.55 conflicts with expert gold bar  
**Severity:** P2 (process risk, not learner-facing)  
**Evidence:** `S46_AUDIT.json` verdict ACCEPT, `mean_visible_rank` 9.52; paragraph analysis stamps 9.55 on template paragraphs. `GOLD_STANDARD_CHECKLIST.md` forbids trusting length/auto ranks for template soup.

**Pedagogical impact:** If Fixer prioritizes only P0 from prior automations, S46 will remain theater. This Explorer score (**4.8**) is the expert override for Fixer.

---

### Issue 24 — Missing worked multi-event scenario (in-order / out-of-order / late)  
**Severity:** P1  
**Evidence:** Theory claims “fixtures en hora/desorden/tardío” as evidence of T1-A, but no theory/iDo table walks three events with timestamps, watermark advances, and resulting window outputs.

**Pedagogical impact:** Core T1 learning outcome is asserted, not taught.

---

## 4. Meta-Leak Report

Exact leaked / internal-facing text and locations (learner-visible when rendered):

| # | Location | Exact / near-exact leaked text | Type |
|---|----------|--------------------------------|------|
| M1 | `jobRelevance` | “Id legacy \`gpu-computing\` se conserva; el path V3 es data engineering/orquestación, no CUDA/GPU kernels.” | Versioning / rename note |
| M2 | Theory map P4 | “Id legacy \`gpu-computing\` no implica GPU; V3 es ingeniería de datos del control plane.” | Internal roadmap jargon |
| M3 | Map code + output | `"gpu_cuda_topic": False` / printed `gpu_cuda_topic False` | Maintainability flag as lesson content |
| M4 | weDo starters (×24) | `# CASO-LIM-046 · …` while fixtures are HYO | Generator city-code leak |
| M5 | Callouts | Action tokens as SCREAMING_SNAKE (`SIDE_OUTPUT_LATE_EVENT`, `REJECT_DAG`, …) | Acceptable as domain protocol **if** taught; currently feel like internal enum dump |
| M6 | `edgeCases` third items | “CASO-HYO-046-1A es sintético” repeated as edge case | Generator filler, not a real edge |
| M7 | Ethics paste | “nunca prueba fraude, parentesco o intención” on non-ER DE topics | Cross-section template leak |
| M8 | Filename / id | `s46-gpu-computing.ts` / hash `gpu-computing` | Repo archaeology visible in URL |

**Meta-leak count (distinct families):** **8** (M1–M8).  
**Learner-facing severity peak:** M1–M4 (should be stripped or rewritten in user voice).

No raw “TODO for developer” or “moved from section X” strings found beyond the legacy/V3 family.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Layer | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Low | 8 demos exist with ids and outputs, but do not demonstrate mechanisms. Why-strings are template. |
| **We Do** | Medium-low | Excellent fail-closed *shape* (valid/invalid/missing). Content is boolean inversion, not DE problem-solving. E3 ≠ transfer. |
| **You Do** | Low | Rubric weights are reasonable; scaffold is flag-flipping. Gap between 20 h ambition and starter is large. |
| **Autocheck** | Medium | 5 items, fair indices, some policy-heavy; weak concept discrimination. |

Gradual release is **structurally** present and **functionally** hollow.

### 5.2 Cognitive load & progressive disclosure

- **Intrinsic load** of real DE (event time, contracts, lineage, SLOs) is high — appropriate for Master.
- **Extrinsic load** is artificially high due to identical shells, SCREAMING tokens without teaching runbook narrative, and mixed case ids.
- **Germane load** is starved: almost no worked example with multi-event timelines or multi-node DAG draw/check.
- Progressive disclosure of APIs is fine (stdlib only) — the failure is progressive disclosure of *concepts*.

### 5.3 Narrative flow & connective tissue

Order T1→T4 is correct (time semantics → graph/orchestration → quality/lineage → incremental + ops). Map glossary is a good entry. Between subtopics, there is little “porque el watermark de T1 habilita el merge incremental de T4” connective prose. S45 bridge is one clause; S47 foreshadowing absent.

### 5.4 Exercise & exam alignment

- Exercises align to subtopic ids and named tokens consistently **within** weDo.
- Misalignment with youDo/selfCheck tokens (Issue 13).
- Rubric emphasizes security/least privilege though section barely teaches IAM (owned by S45) — residual course template.

### 5.5 Consistency with roadmap / previous sections

- Aligns with SECTION_MAP / V3 title for S46.
- Same Master-phase template disease as S45 (`iac` legacy note, `terraform_only_topic` false flags, CASO city codes, Contrato operativo shells).
- Inferior to S01 gold voice, concrete OS-level demos, and measurable outcomes.

### 5.6 Comparison with external best-in-class

| External material | What S46 borrows | Where S46 lags |
|-------------------|------------------|----------------|
| Flink event-time docs | Vocabulary, resource link | No watermark diagram, no late-element definition matching docs |
| Beam programming guide | Windows/watermarks reference | No mini Beam-like pipeline walkthrough |
| dbt incremental models | Resource + incremental tagline | No merge key / `is_incremental` style worked logic |
| Dagster software-defined assets | Asset graph language | No typed IO example beyond `typed_io: True` flag |
| OpenLineage | Lineage resource | Theory code returns a dict of lists — no run/job/dataset facets |
| Google SRE monitoring | Freshness SLO resource | SLI/SLO distinction barely assessed |
| deeplearning.ai DE specialization | Listed course | That track uses real pipelines; S46 remains abstract predicates |
| S01 PyArcana gold | Structural I/W/Y | Narrative, computed demos, workplace framing |

### 5.7 Accessibility & motivation

- Synthetic Huancayo case is good localization **if** fleshed out (attention events, late clinic reports, freshness for ops dashboards).
- Currently demotivating for a 20 h block: expert learners detect theater quickly.
- No figures/alt-text opportunities used for watermark timelines (site capability depending).

### 5.8 Domain correctness snapshot

| Concept | Prose claim | Code/exercise reality | Verdict |
|---------|-------------|----------------------|---------|
| Event time ≠ processing time | Correct | Demo only prints True | Weak |
| Watermark | Partial | Hardcoded + wrong predicate | Incorrect |
| Late data policies | Named (side-output/update/quarantine) | Policy string membership only | Shallow |
| Exactly-once composite | Correct slogan | `apply_once` ok; incomplete end-to-end | Partial |
| DAG acyclic | Claimed | No cycle detection | Incorrect |
| Data contract + freshness | Correct direction | Equality + lag compare ok in exercises | Partial |
| Lineage + owner | Correct direction | Prefix check `run-` is arbitrary | Partial |
| Incremental idempotence | Correct gate | Keys equality + second_run_changes==0 ok | Partial |
| Data SLO / RTO | Correct direction | Numeric compares ok | Partial |

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — not applied. Paths relative to repo root. Some diffs are representative; Fixer should expand pattern to all subtopics.

### Diff A — Strip meta-leak from `jobRelevance` and map prose; keep id stable

```diff
--- a/src/lib/course/sections/s46-gpu-computing.ts
+++ b/src/lib/course/sections/s46-gpu-computing.ts
@@
-  jobRelevance:
-    "En equipos de plataforma y producto, **ingeniería de datos y orquestación de producción** cierra el path N4 con pipelines batch/stream, calidad de datos y SLAs de frescura. La práctica entrega tablas/contratos versionados, orquestación con checkpoint y métricas de frescura; se promueve solo cuando late data y re-runs no corrompen el sink. Id legacy `gpu-computing` se conserva; el path V3 es data engineering/orquestación, no CUDA/GPU kernels.",
+  jobRelevance:
+    "En equipos de plataforma y producto en LATAM, **ingeniería de datos y orquestación de producción** convierte el job asíncrono de la sección anterior en pipelines batch/stream con calidad medible y SLAs de frescura. Entregas típicas: tablas y contratos versionados, orquestación con checkpoint, lineage y alertas cuando el dato llega tarde o el schema se rompe. Se promociona solo cuando backfills y re-runs no corrompen el sink ni duplican agregados.",
@@
-        "Orden: T1 event-time/watermarks → T2 DAG tipado y checkpoint → T3 calidad/freshness → T4 re-runs y SLI/SLO. Teoría medible, iDo que calcula el contrato, weDo E1/E2/E3 con un defecto de pipeline por ejercicio. Id legacy `gpu-computing` no implica GPU; V3 es ingeniería de datos del control plane. Stack didáctico: **stdlib** (dicts, listas) modelando contratos Airflow/dbt/streaming sin cluster.",
+        "Orden: T1 event-time/watermarks → T2 DAG tipado y checkpoint → T3 calidad/freshness → T4 re-runs y SLI/SLO. Stack didáctico: **stdlib** (dicts, listas) para modelar contratos al estilo Airflow/dbt/streaming **sin cluster**. No necesitas GPU ni CUDA: el foco es corrección de datos y operación del pipeline.",
@@
-        "gpu_cuda_topic": False,
-        "silent_late_data_ok": False,
+        "silent_late_data_ok": False,
+        "require_late_policy": True,
```

*(Optional follow-up P2: rename icon `Cpu` → `GitBranch` / `Workflow` in UI mapping; keep hash `gpu-computing` if routing freeze requires it, but document only in repo README not learner prose.)*

### Diff B — Replace T1-A theory code with a real watermark + late classification

```diff
--- a/src/lib/course/sections/s46-gpu-computing.ts
+++ b/src/lib/course/sections/s46-gpu-computing.ts
@@
-      code: {
-        language: 'python',
-        title: "windows_event_time_watermarks.py",
-        code: `def watermark(events, lag_min=1):
-    # max event_time minus lag (lab: fixed iso string for stable output)
-    return "2026-01-01T09:59:00", len(events), True
-
-wm, n, et = watermark([{"t": "09:00"}, {"t": "09:58"}])
-print("watermark", wm)
-print("n", n)
-print("event_time", et)`,
-        output: `watermark 2026-01-01T09:59:00
-n 2
-event_time True`,
-      },
+      code: {
+        language: 'python',
+        title: "windows_event_time_watermarks.py",
+        code: `def advance_watermark(event_times: list[int], lag: int) -> int:
+    """Watermark ≈ max(event_time) - lag: aserción de progreso en event time."""
+    return max(event_times) - lag
+
+def classify(event_time: int, window_end: int, watermark: int) -> str:
+    if event_time > window_end:
+        return "OUT_OF_WINDOW"
+    if event_time <= watermark:
+        # llegó (o se evalúa) después de que el watermark pasó su timestamp
+        return "LATE"
+    return "ON_TIME"
+
+times = [100, 108, 115]
+wm = advance_watermark(times, lag=5)  # 110
+labels = [classify(t, window_end=120, watermark=wm) for t in (108, 110, 105)]
+print("watermark", wm)
+print("labels", labels)`,
+        output: `watermark 110
+labels ['ON_TIME', 'LATE', 'LATE']`,
+      },
```

### Diff C — Align T1-A exercise predicate with taught semantics (representative E1)

```diff
--- a/src/lib/course/sections/s46-gpu-computing.ts
+++ b/src/lib/course/sections/s46-gpu-computing.ts
@@
-record = {"case_id": "CASO-HYO-046-1A", **{"event_time":110,"window_end":120,"watermark":115,"allowed_lateness":10}}
-# DEFECT: late/out-of-window sin política válida
-meets_contract = record["event_time"] > record["window_end"] or record["event_time"] < record["watermark"] - record["allowed_lateness"]
+record = {
+    "case_id": "CASO-HYO-046-1A",
+    "event_time": 110,
+    "window_end": 120,
+    "watermark": 100,
+    "allowed_lateness": 15,
+}
+# DEFECT: marca PASS a late/out-of-window
+late_deadline = record["watermark"] + record["allowed_lateness"]
+meets_contract = (
+    record["event_time"] <= record["window_end"]
+    and record["event_time"] > record["watermark"]
+) or (
+    # within allowed lateness after watermark, still accepted by policy
+    record["event_time"] <= record["window_end"]
+    and record["event_time"] <= record["watermark"]
+    and record["event_time"] >= record["watermark"] - record["allowed_lateness"]
+)
```

*(Fixer must rewrite solution + invalid fixtures + all E2/E3 consistently; prefer a single taught function `is_on_time_or_allowed_late(...)` reused in theory, iDo, and weDo.)*

### Diff D — Fix `edgeCases` labels (pattern for all 24)

```diff
-        edgeCases: ["falta allowed_lateness", "fixture adverso: event_time dentro de ventana y lateness permitido", "CASO-HYO-046-1A es sintético"],
+        edgeCases: [
+          "falta allowed_lateness → WAIT_FOR_WATERMARK / MISSING",
+          "fixture adverso: event_time demasiado temprano/tarde respecto de watermark+ventana → SIDE_OUTPUT_LATE_EVENT",
+          "eventos sintéticos CASO-HYO-046-1A (sin PII)",
+        ],
```

Apply analogous rewrites for T1-B…T4-B (describe the *failure* mode, not the success predicate).

### Diff E — Unify case comments LIM → HYO

```diff
-# CASO-LIM-046 · event time windows + watermark
+# CASO-HYO-046 · event time windows + watermark
```

(replace_all across the 24 starter comments)

### Diff F — Cycle-aware DAG check (theory + exercises)

```diff
+def is_acyclic(nodes: set[str], edges: set[tuple[str, str]]) -> bool:
+    from collections import defaultdict, deque
+    indeg = {n: 0 for n in nodes}
+    adj = defaultdict(list)
+    for a, b in edges:
+        if a not in nodes or b not in nodes:
+            return False
+        adj[a].append(b)
+        indeg[b] += 1
+    q = deque([n for n in nodes if indeg[n] == 0])
+    seen = 0
+    while q:
+        u = q.popleft()
+        seen += 1
+        for v in adj[u]:
+            indeg[v] -= 1
+            if indeg[v] == 0:
+                q.append(v)
+    return seen == len(nodes)
```

Use in T2-A solution; invalid fixture: cycle `raw→clean→raw` with `typed_io=True`.

### Diff G — Computed iDo for partitions (second run zero delta)

```diff
+def merge_incremental(target: dict[str, dict], rows: list[dict], key: str) -> tuple[dict, int]:
+    changes = 0
+    for row in rows:
+        k = row[key]
+        if target.get(k) != row:
+            target[k] = row
+            changes += 1
+    return target, changes
+
+sink: dict = {}
+batch = [{"id": "a", "v": 1}, {"id": "b", "v": 2}]
+sink, c1 = merge_incremental(sink, batch, "id")
+sink, c2 = merge_incremental(sink, batch, "id")
+print("first_changes", c1)
+print("second_changes", c2)
+print("no_dup_rerun", c2 == 0)
```

### Diff H — youDo scaffold beyond flags + token alignment

```diff
-REQUIRED = ['politica_event_time_watermark_late_data', ...]
-evidence = { ... False }
+EVENTS = [
+  {"event_id": "e1", "event_time": 100, "payload": 1},
+  {"event_id": "e1", "event_time": 100, "payload": 1},  # retry
+  {"event_id": "e2", "event_time": 80, "payload": 2},   # late vs wm
+]
+# Implement: assign_window, apply_late_policy, upsert_partition, lineage_record
+# Normal → OK; breach → QUARANTINE_DATASET; missing owner → OPEN_QUALITY_INCIDENT
```

Also update selfCheck Q2 option to `QUARANTINE_DATASET` (or standardize on one vocabulary site-wide for S46).

### Diff I — Subtopic-specific “Contrato operativo” (example T2-A)

```diff
-        "Contrato operativo. Entrada: eventos con event_time, clave estable, schema y partición. Salida de este subtema: grafo acíclico con inputs/outputs tipados. Error: contrato roto, watermark excedido o reejecución duplicada detiene el asset afectado. Criterio de éxito: backfill y retry producen el mismo resultado, registran dueño y cumplen SLO de freshness.",
+        "Contrato operativo de orquestación. Entrada: nodos de assets (ingest, normalize, er, report) y edges de dependencia. Salida: grafo **acíclico** con inputs/outputs tipados y dueño por asset. Error: ciclo, self-loop, edge a nodo no declarado o dependencia solo por horario coincidente. Criterio de éxito: un cambio en `normalize` invalida solo `er` y `report`; el plan de backfill lista ancestros sin solapes.",
```

Rewrite all seven shells so entrada/error/criterio match the subtopic.

### Diff J — Learning outcomes measurable

```diff
-    { text: "Maneja ventanas y watermarks" },
+    { text: "Clasificar eventos on-time/late/out-of-window dado event_time, window_end, watermark y allowed_lateness, con política documentada" },
```

(expand all eight similarly)

### Diff K — Headings capitalization

```diff
-      heading: "ventanas, event time y watermarks",
+      heading: "Ventanas, event time y watermarks",
```

(apply to all lowercase subtopic headings)

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 — Correctness of DE mental model** | 08, 09, 05, 06, 24 | Wrong watermark/DAG teaching is worse than missing polish; linked docs contradict code. |
| **2 — Kill template soup** | 03, 04, 07, 10 | Gold checklist anti-patterns; unlocks germane load. |
| **3 — Learner trust & identity** | 01, 02, 12, meta M1–M4 | GPU id, V3 notes, LIM vs HYO. |
| **4 — Assessment alignment** | 11, 13, 14, 22 | edgeCases, tokens, youDo, selfCheck depth. |
| **5 — Outcomes & narrative** | 15, 17, 18, 20 | Measurable outcomes; S45→S46→S47 bridge; feedback differentiation. |
| **6 — Polish** | 16, 19, 21 | Capitalization, hint dedupe, ES-PE micro-edits. |
| **7 — Process** | 23 | Do not let prior ACCEPT block Fixer; re-verify with human gold bar. |

**Suggested Fixer sprint slice (minimum viable gold lift):** Diffs A+B+C+D+E+F+I for T1–T2 first (time + graph), then G+H for T4/youDo, then remaining theory depth.

**Explicit non-goals for Fixer:** Do not introduce real cloud/Airflow clusters in S46 if course policy remains stdlib-first; deepen **models** of those systems, not vendor installs.

---

## 8. Graph Memory Update notes

For shared context (`GRAPH_MEMORY.json` / summary / fleet registry):

```yaml
section: 46
id: gpu-computing
file: s46-gpu-computing.ts
title: Ingeniería de datos y orquestación de producción
explorer_score: 4.8
status: complete_explorer
issue_count: 24
meta_leak_count: 8
p0_themes:
  - template_contrato_operativo_soup
  - print_theater_theory_and_ido
  - watermark_predicate_misaligned_with_flink
  - dag_acyclic_claim_without_cycle_check
p1_themes:
  - edgeCases_inverted_adverse_labels
  - caso_lim_vs_hyo_comments
  - youdo_boolean_checklist
  - token_vocab_mismatch_youdo_selfcheck
  - legacy_gpu_meta_leak
edges:
  - { from: S45, to: S46, type: continues, note: "cloud job → production data pipeline" }
  - { from: S46, to: S47, type: enables, note: "versioned tables/lineage → MLOps serving" }
  - { from: S46, to: CP-N4-B, type: gates, note: "idempotent backfill + freshness SLO + lineage" }
  - { from: S46, to: resources.flink_event_time, type: cites, quality: "links good, demos contradict" }
gold_bar:
  structural_8_8_24: true
  expert_gold: false
  prior_auto_accept: true  # S46_AUDIT.json — do not trust for pedagogy
fixer_ready: true
```

**Nodes to mark degraded quality:** `theory.S46-T*-contrato_operativo`, `iDo.S46-*` (print-theater), `weDo.edgeCases`, `youDo.readiness_flags`.  
**Nodes worth preserving:** `resources.docs` set, fail-closed E2/E3 *shape*, map glossary dictionary, CP-N4-B gate wording (behavioral), synthetic-only policy.

---

## Appendix — Structural inventory (quick)

| Component | Count / status |
|-----------|----------------|
| Theory headings | 9 |
| Subtopic ids | S46-T1-A … S46-T4-B |
| iDo demos | 8 |
| weDo exercises | 24 (guided/independent/transfer × 8) |
| youDo | 1 checklist + rubric 6 criteria |
| selfCheck | 5 MCQ |
| Resources docs | 10 |
| Estimated hours | 20 Master |

---

This is the complete Explorer report for Section 46. Ready for the Fixer prompt.
