# S47 Explorer Report — Curriculum Auditor

**Section:** 47 · `opensource` (legacy id)  
**V3 title:** MLOps: experimentos, registro y serving  
**Source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s47-opensource.ts`  
**Live:** https://pillb.github.io/pyarcana/ (Section 47 · shortTitle “MLOps serving”; hash `#opensource`)  
**Auditor role:** Stanford STORM + Graph Engineering + Loop Engineering + Harness Engineering (analyze only; no curriculum edits)  
**Generated:** 2026-07-24  

**Pre-round pedagogical anchors (domain):**
- Google Cloud MLOps whitepaper — experiment → registry → continuous delivery of models, feature store, ML metadata.  
- MLflow Tracking / Model Registry — params, metrics, artifacts, stages, approvals.  
- Google Model Cards — intended use, limits, metrics, risks.  
- Feast / train-serve parity — feature consistency to avoid training-serving skew.  
- SRE release engineering — shadow/canary, SLO, rollback.  
- Gold bar: `GOLD_STANDARD_CHECKLIST.md` (S01 voice/depth; anti-print-theater; anti-template-triplet).  
- Structural completeness alone is **not** gold (checklist rule).

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 47 |
| Platform id (hash) | `opensource` |
| File | `src/lib/course/sections/s47-opensource.ts` |
| Title | MLOps: experimentos, registro y serving |
| shortTitle | MLOps serving |
| tagline | Production Data/ML Platform: experimento→servicio con gates, lineage y rollback; CF-4 |
| Phase / level | 3 · Master · 20h |
| Case | `CASO-TAC-047` (Tacna sintético; priorización de atención) |
| Gates | CP-N4-B (cierre) + CF-4 |
| Theory | 1 map + 8 subtopics (T1–T4 × A/B) |
| iDo | 8 demos |
| weDo | 24 exercises (E1 guided / E2 independent / E3 transfer × 8) |
| youDo | Capstone checklist + rubric |
| selfCheck | 5 MCQ |
| resources | MLflow, KServe, Feast, Model Cards, TFX MLMD, Google MLOps, NIST AI RMF, SRE, Coursera, MIT, CS50P, Py4E |

**Scope of this run:** Section 47 only. No product TS edited. Prior auto-audit (`S47_AUDIT.json` ACCEPT, mean 9.52) and dossier rank 9.55 are treated as **unverified** against the expert gold bar.

**Subtopic map (as shipped):**

| ID | Heading (source) | Core gate verbs |
|----|------------------|-----------------|
| S47-T1-A | tracking y reproducibilidad | `MARK_RUN_NONREPRODUCIBLE` / `INVESTIGATE_RANDOMNESS` |
| S47-T1-B | data/code/env lineage y comparación | `INVALIDATE_COMPARISON` / `RESTORE_LINEAGE` |
| S47-T2-A | firmas, stages y approvals | `DENY_MODEL_PROMOTION` / `REQUEST_MODEL_APPROVAL` |
| S47-T2-B | artefactos, model card y compatibilidad | `REJECT_MODEL_ARTIFACT` / `COMPLETE_MODEL_CARD` |
| S47-T3-A | batch/online y feature consistency | `DISABLE_INCONSISTENT_SERVING` / `TRACE_FEATURE_PIPELINE` |
| S47-T3-B | latency, batching y fallback | `ACTIVATE_SAFE_FALLBACK` / `TUNE_BATCH_OR_CAPACITY` |
| S47-T4-A | shadow/canary y monitoring hooks | `STOP_CANARY` / `COLLECT_MORE_SHADOW_EVIDENCE` |
| S47-T4-B | rollback, retirement y audit | `ROLLBACK_TO_LAST_GOOD` / `REVIEW_RETIREMENT` |

---

## 2. Executive Summary of Quality

### Score: **5.7 / 10**

**Verdict:** **Structurally complete Master shell with correct MLOps vocabulary and a solid fail-closed exercise machine — but pedagogically under-taught relative to early gold (S01) and to external MLOps materials.** Theory is dominated by copy-pasted “Contrato operativo” shells and identical Tacna application tails; concept paragraphs for most subtopics are one-liners; theory/iDo demos are largely **print theater**; learner-facing **legacy id / V3 / OSS-licensing meta** leaks; starter comments use `CASO-LIM-047` while fixtures use `CASO-TAC-047`; edge-case labels misdescribe the adverse fixture; youDo/selfCheck action codes drift from the exercise vocabulary.

**What works**
- Clear section product: experiment → registry → feature parity → canary/rollback under CF-4.  
- Dictionary on the map block is useful and domain-honest.  
- weDo pattern E1/E2/E3 (fix inverted predicate → three-way assess → fail-closed decide) is coherent and teaches fail-closed governance.  
- Solutions are runnable and assertable; defects in starters are real (inverted comparisons).  
- Resources list is excellent and aligned with industry (MLflow, Feast, Model Cards, KServe, NIST).  
- Ethical framing (synthetic, no PII, no fraud/parentesco proof) is present.  
- T3-A is a positive outlier: diversified “Contrato de paridad” + more concrete code.

**What fails the gold bar**
- Template triplet (generic contract + generic CASO paste) flagged in `GOLD_STANDARD_CHECKLIST.md` anti-stub list.  
- Print theater in theory and iDo (`print("tracking", "mlflow_like")`, hardcoded `True`).  
- Meta-leaks about legacy file id and OSS licensing.  
- Thin connective tissue vs S01 narrative depth.  
- Inflated prior ranks (9.55/9.6) do not survive expert re-read.

**Comparative snapshot**

| Peer | Relation to S47 |
|------|-----------------|
| S01 (gold) | Deep explanations, progressive glossary, real scripts; S47 lacks this prose density |
| S46 (adjacent Master) | Same factory template family (legacy-id meta, short LOs, Contrato operativo shells) |
| Google MLOps / Coursera MLOps / MLflow docs | Teach mechanisms (tracking API, registry stages, skew tests); S47 names them but demos do not compute them richly |
| External SRE canary practices | S47 names promote/stop correctly but theory code does not simulate traffic budgets |

---

## 3. Detailed Issue Registry

Severity key: **P0** = learner-facing wrong/misleading or meta-leak that must go; **P1** = major pedagogy/redaction debt; **P2** = polish / consistency; **P3** = nice-to-have.

---

### ISSUE-01 · P0 · Meta-leak: legacy id `opensource` and OSS licensing disclaimer in learner prose

**Location:** `jobRelevance` (L15); theory map P4 (L33); map code keys `oss_licensing_topic` (L42–48).

**Evidence quotes:**
> Id legacy `opensource` se conserva; el path V3 es MLOps, no licensing de OSS en abstracto.

> Id legacy `opensource` no es el foco; V3 es MLOps del servicio gobernado.

> `"oss_licensing_topic": False`

**Pedagogical impact:** Breaks immersion; exposes internal V3 rebrand and file-id archaeology. Learners do not need to know the section used to be about open source licensing. The map contract literally prints a negative topic flag that only authors care about.

**Graph nodes:** jobRelevance → map P4 → section_contract → learner confusion about section purpose.

---

### ISSUE-02 · P0 · Starter comments use wrong case id `CASO-LIM-047` (24×)

**Location:** All weDo `starterCode` first comment lines (e.g. L473, L510, … L1579).

**Evidence:**
> `# CASO-LIM-047 · tracking seed/metric reproducibility`

while records use:
> `"case_id": "CASO-TAC-047-1A"`

**Pedagogical impact:** Confuses case geography (Lima vs Tacna), breaks progressive case continuity, and signals bulk generation. Learners matching comments to fixtures get contradictory IDs.

---

### ISSUE-03 · P0 · edgeCases mislabel the adverse fixture (copy-paste of success condition)

**Location:** Every weDo step `edgeCases` array, second element.

**Evidence (T1-A):**
> `"fixture adverso: rerun dentro de tolerancia con seed/parámetros"`

That text describes the **valid** contract, not the adverse fixture (`seed:7`, empty params, `rerun_metric:0.65`). Same pattern for T1-B…T4-B (e.g. “fixture adverso: firma exacta, staging y aprobación”).

**Pedagogical impact:** Hints and edge-case lists actively mislead; weakens transfer (E3) and independent work (E2). Undermines fail-closed pedagogy by naming the green path as the “adverso”.

---

### ISSUE-04 · P1 · Template “Contrato operativo” shell (7/8 subtopics)

**Location:** Theory P2 for T1-A, T1-B, T2-A, T2-B, T3-B, T4-A, T4-B. T3-A is the only diversified contract (“Contrato de paridad”).

**Evidence (shared stem, only Salida swaps):**
> Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: [X]. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.

**Pedagogical impact:** High cognitive load without progressive disclosure of **mechanism**. Entrada/Error/Criterio are section-global, not subtopic-local — so T2-A “firmas” still talks about fallback and lineage incompleteness as the primary error framing. Violates gold anti-pattern #2 (template triplet).

---

### ISSUE-05 · P1 · Template “Aplicación al caso” tails (near-identical across subtopics)

**Location:** Theory P3 for nearly all subtopics.

**Evidence stem:**
> Aplicación de `[heading]` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es [Salida]. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.

**Pedagogical impact:** Ethics tail is correct but **non-specific**; does not instantiate Tacna fields (e.g. `features_v3`, p95 50ms, canary 5%) into a narrative scene. After first occurrence, zero new learning.

---

### ISSUE-06 · P1 · Thin concept paragraphs (mechanism missing)

**Location:** Theory P1 for T1-B, T2-A, T2-B, T3-B, T4-A, T4-B (often one sentence).

**Evidence:**
> Cada run enlaza versión de data, código y entorno; comparar exige misma partición/metric definition y reportar incertidumbre.

> Una firma fija nombres/tipos/rangos de entrada y salida; stages son estados gobernados y approval requiere evidencia independiente.

**Pedagogical impact:** Master-level learners still need *why* (why train-split comparison invalidates promote; why approval is independent of digest). Compared to S01 multi-paragraph mechanism teaching, S47 dumps glossary-level slogans then jumps to gates. Cognitive load spikes at exercises because theory never worked an example.

**Positive contrast:** T1-A P1 and T3-A P1 are stronger (reproducibility vs dashboard anecdote; train-serve skew named).

---

### ISSUE-07 · P1 · Print theater in theory code and iDo demos

**Location:** Multiple theory `code` blocks and all iDo steps (esp. T1-A demo L299–307).

**Evidence (iDo T1-A):**
```python
def track_seed(seed: int) -> int:
    return seed

print("tracking", "mlflow_like")
print("params", True)
print("seed", track_seed(42))
```

Theory T1-A:
```python
def log_run(run_id: str, metrics: dict, seed: int) -> tuple:
    return run_id, metrics, seed
```

Theory T4-B prints `cf4 deployable_path` without computing rollback safety.

**Pedagogical impact:** Gold bar forbids demos that only print precomputed literals. Learners do not see *computation* of reproducibility (abs(metric-rerun) ≤ tol), parity, canary gates — those appear only later in weDo solutions, creating I Do / We Do disconnect (I Do is weaker than We Do).

---

### ISSUE-08 · P1 · iDo `why` strings are factory-identical

**Location:** All 8 iDo `why` fields.

**Evidence pattern:**
> Hace observable `[topic]` con un caso local pequeño y deja como evidencia [output]; el demo modela el contrato, no un servicio externo.

**Pedagogical impact:** “Why” should answer *instructional* purpose (what misconception it fixes). Here it only restates structure. Weak gradual release of responsibility.

---

### ISSUE-09 · P1 · Action-code drift: youDo / selfCheck vs weDo vocabulary

**Location:**
- youDo requirements: `ROLLBACK_MODEL`, `HOLD_STAGE` (L1634)  
- selfCheck Q2: `ROLLBACK_MODEL` (L1676–1678)  
- weDo T4-B: `ROLLBACK_TO_LAST_GOOD`, `REVIEW_RETIREMENT`  
- selfCheck Q1–Q3 use section-level gates correctly for CF-4, but Q2 invents a different code

**Pedagogical impact:** Active recall and portfolio requirements do not match practiced verbs. Undermines spaced retrieval and “exact pass string” discipline taught in weDo.

---

### ISSUE-10 · P1 · Solutions overfit `seed == 42` (and other magic constants)

**Location:** T1-A solution predicates (L487, L536, L590).

**Evidence:**
> `record["seed"] == 42 and bool(record["params"])`

**Pedagogical impact:** Teaches “reproducible means seed is literally 42” instead of “seed is fixed, params non-empty, |metric−rerun| ≤ tolerance”. Invalid fixture uses seed 7 — works for the lab, but the **rule** should be “seed present and stable across rerun,” not equality to a lab constant. Same class of issue: T2-A hardcodes exact signature dicts (acceptable for fixtures) without teaching general signature equality.

---

### ISSUE-11 · P1 · Learning outcomes too terse for Master phase

**Location:** `learningOutcomes` L17–24.

**Evidence:** `"Trackea experimentos reproducibles"`, `"Revierte, retira y audita modelos"` (7–40 chars).

**Pedagogical impact:** Not measurable at S01 standard (who/what evidence). Weak job-interview phrasing for a 20h Master section on MLOps.

---

### ISSUE-12 · P1 · youDo starter is readiness checklist theater

**Location:** `youDo.starterCode` L1638–1655.

**Evidence:** Boolean flags for four mega-requirements; `readiness()` returns READY/BLOCKED; no scaffold for log_run, promote, feature_parity, canary.

**Pedagogical impact:** Portfolio prompt asks for a full platform path, but starter only teaches checklist flipping. Risk: learners set flags to True without implementing contracts (portfolioNote warns, but scaffold still invites theater).

---

### ISSUE-13 · P2 · Subject–verb agreement and mixed-language fragments (ES-PE redaction)

**Location:** Repeated Error sentence; T1-B P1.

**Evidence:**
> Error: lineage incompleto, firma incompatible, regresión o fallback ausente **impide** promoción.

Compound subject (several conditions) with singular verb. Also:
> misma partición/**metric definition**

English fragment mid-Spanish without italics/backticks as intentional term.

**Pedagogical impact:** Low severity individually; high cumulative polish debt for “español peruano prioritario” brand.

---

### ISSUE-14 · P2 · Headings lack sentence case / pedagogical specificity

**Location:** Subtopic headings L62–261.

**Evidence:** `"tracking y reproducibilidad"`, `"firmas, stages y approvals"` (lowercase start; <50 chars for some).

**Pedagogical impact:** Fixer log for S43–S50 already expanded short headings for fragmented_prose. S47 still has choppy map labels vs gold S01 full titles. UI index may look unfinished.

---

### ISSUE-15 · P2 · Icon / accent legacy of OSS section

**Location:** `icon: "Github"` (L12).

**Pedagogical impact:** Visual affordance still signals “open source / GitHub,” not MLOps serving. Reinforces ISSUE-01 identity confusion on the live curriculum card.

---

### ISSUE-16 · P2 · Identical feedback copy across E1/E2/E3 per subtopic

**Location:** e.g. T1-A feedback L470, L506, L560 (byte-identical).

**Pedagogical impact:** Missed opportunity for gradual release: E1 should explain the comparison direction; E2 the missing-field branch; E3 the CONTINUE vs INVESTIGATE distinction.

---

### ISSUE-17 · P2 · Grammar / punctuation in youDo title

**Location:** L1620.

**Evidence:**
> `[FINAL] MLOps: experimentos, registro y serving (CP-N4-B (cierre) + CF-4)`

Nested parentheses awkward; “FINAL” bracket tone is meta/course-ops.

---

### ISSUE-18 · P2 · Connective tissue weak between T1→T4

**Location:** Map P4 lists order once; no “bridge” sentences at start of T2/T3/T4 (“habiendo demostrado rerun… ahora el registry exige…”).

**Pedagogical impact:** Graph of learning is flat. External MLOps curricula chain experiment tracking → candidate selection → registry → serving → monitor as a pipeline story. S47 is eight independent gate micro-lessons.

---

### ISSUE-19 · P2 · Theory T1-B code does not compare candidates

**Location:** L101–109.

**Evidence:** `print("diff", True)` — no baseline/candidate comparison despite heading “comparación”.

**Pedagogical impact:** Heading–code mismatch; We Do later does the real work alone.

---

### ISSUE-20 · P3 · selfCheck depth / coverage

**Location:** selfCheck L1667–1698.

**Notes:** Five questions are fair and avoid PII traps. Gaps: no item on feature parity / train-serve skew; no item on canary traffic budget; Q2 action-code wrong (ISSUE-09). Expand to 6–8 for Master CF-4 coverage.

---

### ISSUE-21 · P3 · jobRelevance prose density vs S01

**Location:** L15.

**Notes:** Workplace framing exists but is abstract (“equipos de plataforma”). S01 names Interbank/BBVA-style day-1 tasks. For MLOps, a one-scene “equipo de producto en Lima promueve un ranker de atención con canary 5%” would increase motivation without adding PII.

---

## 4. Meta-Leak Report

| # | Exact leaked text | Location | Classification |
|---|-------------------|----------|----------------|
| M1 | `Id legacy \`opensource\` se conserva; el path V3 es MLOps, no licensing de OSS en abstracto.` | jobRelevance | Authoring/rebrand note |
| M2 | `Id legacy \`opensource\` no es el foco; V3 es MLOps del servicio gobernado.` | theory map P4 | Authoring/rebrand note |
| M3 | `"oss_licensing_topic": False` + printed in output | map code | Negative-topic self-talk for authors |
| M4 | `# CASO-LIM-047 · …` (24×) | weDo starterCode comments | Bulk-generator leftover (wrong case family) |
| M5 | `[FINAL]` in youDo title | youDo.title | Course-ops marker |
| M6 | `icon: "Github"` | section metadata | Legacy OSS visual identity (UI-facing) |

**No findings:** “moved from section X”, TODO/STUB/TBD, raw AI chain-of-thought, Red Andina ethics boilerplate doubles (already cleaned in sibling Master sections).

**Meta-leak count (distinct classes):** **6** (M1–M6); line-level CASO-LIM occurrences: **24**.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| Theory | Partial | Glossary good; mechanism thin; template contracts |
| I Do | **Low** | 8 demos present but mostly print theater; weaker than We Do |
| We Do | **High structure / medium concept** | Excellent fail-closed lattice; inverted-predicate defects teach comparison direction; instructions long enough |
| You Do | **Low–medium** | Objectives align with CF-4; starter is checklist; action codes drift |
| Autocheck | Medium | Fair MCQs; incomplete topic coverage; one wrong code |

**Gradual release breach:** We Do demands richer predicates than I Do demonstrates → learners reverse-engineer from solution pressure rather than from modeled process.

### 5.2 Cognitive load & progressive disclosure

- **Good:** Section stays on stdlib (no sudden MLflow install); progressive disclosure of libraries OK.  
- **Bad:** Introduces many simultaneous gate verbs (16+) with little worked narrative.  
- **Bad:** Global “Entrada/Error/Criterio” repeated 7 times → illusion of depth, actual working memory occupied by same sentence.  
- **Good:** E2 missing-field branch before content evaluation is a strong cognitive-safety pattern.

### 5.3 Connective tissue & narrative flow

Map dictionary + T order is the only spine. Missing:
- Bridge from S46 data lineage → S47 model lineage.  
- Bridge from S33–S34 baselines/metrics → promote decision.  
- Story of one Tacna model version walking Staging→Canary→Prod→Rollback.

### 5.4 Exercise / exam quality

| Dimension | Assessment |
|-----------|------------|
| Alignment to theory | Medium (theory too thin; exercises carry the course) |
| Defect clarity | High (comments state DEFECT) |
| Fixture realism | Medium (synthetic dicts OK; seed==42 overfit) |
| edgeCases accuracy | **Fail** (ISSUE-03) |
| Transfer (E3) | Structure good; feedback not differentiated |
| selfCheck fairness | Good distractors; incomplete coverage |

### 5.5 Roadmap consistency

- V3 title matches SECTION_MAP and live card “MLOps serving”.  
- Legacy id `opensource` preserved for hash stability (correct engineering) but **must not be learner prose**.  
- Capstone CF-4 / CP-N4-B references are consistent with phase-3 platform story.  
- Sibling S29 still notes id legacy `mlops` for SQL — historical id churn is a fleet-wide issue; S47 learner text should not narrate it.

### 5.6 Comparison with external best-in-class

| External | Gap in S47 |
|----------|------------|
| MLflow Tracking tutorial | No worked multi-run comparison table in theory |
| Model Registry stages | Stages named; promote_request demo is shallow |
| Model Cards (Google) | card_sections set in exercises only; theory one-liner |
| Feast / skew literature | T3-A best subtopic; still signature equality only |
| SRE canary | traffic_pct ≤ 10 encoded in weDo; theory code does not simulate |
| Coursera “ML Engineering for Production” | Multi-week pipelines; S47 correctly scopes stdlib but must still teach mechanisms |

### 5.7 Accessibility / motivation / other

- Spanish primary with English industry terms: appropriate.  
- Synthetic ethics: good.  
- Motivation: Tacna case under-used (name only).  
- Accessibility: code outputs present; no alt narrative for non-visual beyond rubric language.

### 5.8 Graph Engineering snapshot

```
[S46 lineage] --weak edge--> [S47 map glossary]
[map glossary] --strong--> [T1-A concept] --weak--> [T1-A demo theater]
[T1-A demo] --gap--> [T1-A weDo predicates]  # I Do weaker than We Do
[Contrato shell] --duplicate edges--> [T1-B..T4-B]  # 7× same node
[weDo verbs] --broken edge--> [youDo ROLLBACK_MODEL / HOLD_STAGE]
[legacy opensource] --leak edge--> [jobRelevance, map P4, icon Github]
```

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals for the Fixer**. Do not apply in Explorer. Paths relative to repo root. Snippets abbreviated with `...` where full file context is huge; Fixer should expand carefully.

### Diff A — ISSUE-01 / M1–M3 · Remove legacy/OSS meta from learner surfaces

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@
-  icon: "Github",
+  icon: "Package", // or "Activity" / "Server" — MLOps, not OSS
@@
   jobRelevance:
-    "En equipos de plataforma y producto, **MLOps: experimentos, registro y serving** industrializa el modelo del workbench: runs reproducibles, registry con etapas, feature parity y rollout/rollback. Se promueve solo cuando el candidato supera baseline con datos fijos y el serving respeta el feature contract. Id legacy `opensource` se conserva; el path V3 es MLOps, no licensing de OSS en abstracto.",
+    "En equipos de plataforma y producto en LatAm, **MLOps** industrializa el modelo del workbench: runs reproducibles, registry con etapas, feature parity y rollout/rollback. Se promueve solo cuando el candidato supera el baseline con datos fijos y el serving respeta el feature contract; si el canary rompe el SLO, se revierte sin borrar evidencia.",
@@
-        "Orden: T1 runs/métricas → T2 registry/cards → T3 features online/batch → T4 traffic y rollback. Teoría medible, iDo con helpers, weDo con defecto MLOps por ejercicio. Id legacy `opensource` no es el foco; V3 es MLOps del servicio gobernado. Stack didáctico: **stdlib** modelando contratos MLflow/registry sin cluster GPU.",
+        "Orden: T1 runs/métricas → T2 registry/cards → T3 features online/batch → T4 traffic y rollback. Teoría medible, demos con helpers y laboratorio con un defecto de promoción por ejercicio. Stack didáctico: **stdlib** que modela contratos al estilo MLflow/registry sin cluster GPU ni servicios externos obligatorios.",
@@
     return {
         "case": "CASO-TAC-047",
         "gates": ["repro_metrics", "approve_before_prod", "feature_parity", "rollback_possible"],
-        "oss_licensing_topic": False,
         "prod_without_approve_ok": False,
     }
 ...
-print("oss_licensing_topic", c["oss_licensing_topic"])
+print("gates", ",".join(c["gates"]))
 print("prod_without_approve_ok", c["prod_without_approve_ok"])
```

(Update matching `output` block.)

### Diff B — ISSUE-02 · Normalize starter comments to CASO-TAC-047

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@
-# CASO-LIM-047 · tracking seed/metric reproducibility
+# CASO-TAC-047 · tracking seed/metric reproducibility
```

Apply `replace_all` for `# CASO-LIM-047` → `# CASO-TAC-047` within this file only.

### Diff C — ISSUE-03 · Fix edgeCases adverse labels (example T1-A; replicate per subtopic)

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@
-        edgeCases: ["falta tolerance", "fixture adverso: rerun dentro de tolerancia con seed/parámetros", "CASO-TAC-047-1A es sintético"],
+        edgeCases: [
+          "falta `tolerance` → MISSING / INVESTIGATE_RANDOMNESS",
+          "adverso: seed distinto o vacío params o |metric−rerun| > tolerance → MARK_RUN_NONREPRODUCIBLE",
+          "CASO-TAC-047-1A es sintético (sin PII)",
+        ],
```

**Per-subtopic adverse truths for Fixer:**

| Subtopic | Adverse reality |
|----------|-----------------|
| T1-B | data/env vacíos, code=`latest`, split train, metric unknown |
| T2-A | production + approved=False + firma rota |
| T2-B | digest `latest`, feature skew, card incompleta |
| T3-A | online features ≠ batch, leakage=True, contract_tests=0 |
| T3-B | p95>slo, batch 512, fallback none, untested |
| T4-A | mode full, traffic 100%, quality drop, hooks false |
| T4-B | compatible_features false, rollback untested, retired empty |

### Diff D — ISSUE-04/05/06 · Diversify theory P1–P3 (pattern; Fixer rewrites all 7 thin subtopics)

Example for **T1-B** (illustrative full rewrite):

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@
-      heading: "data/code/env lineage y comparación",
+      heading: "S47-T1-B · Lineage data/code/env y comparación honesta",
       subtopicId: "S47-T1-B",
       paragraphs: [
-        "Cada run enlaza versión de data, código y entorno; comparar exige misma partición/metric definition y reportar incertidumbre.",
-        "Contrato operativo. Entrada: dataset versionado, commit, entorno fijado, parámetros y firma de features. Salida de este subtema: lineage completo y comparación homogénea. Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción. Criterio de éxito: solo gates aprobados promueven y una versión previa puede restaurarse sin perder evidencia.",
-        "Aplicación de `data/code/env lineage y comparación` al caso peruano sintético `CASO-TAC-047`: un modelo sintético de priorización de atención para una organización ficticia en Tacna. La evidencia esperada es lineage completo y comparación homogénea. No contiene PII ni secretos; una señal incierta se deriva y nunca prueba fraude, parentesco o intención.",
+        "Un run solo es comparable si fija **tres anclas de lineage**: versión de datos, commit de código y entorno bloqueado (lockfile/imagen). Sin ellas, un F1=0.82 es una anécdota. Además, la **definición de métrica** y el **split** (holdout-v1, no el train) deben ser idénticos entre baseline y candidato; si no, la comparación es inválida aunque el número del candidato sea mayor.",
+        "Contrato de comparación. Entrada: `data`, `code`, `env`, `split`, `metric_definition`, `candidate`, `baseline`. Salida: `PASS` solo si el lineage está completo y `candidate > baseline` bajo la misma métrica/split. Error local: lineage incompleto o candidato que no supera baseline → `INVALIDATE_COMPARISON`. Si falta `baseline` → `RESTORE_LINEAGE` (incertidumbre, no breach silencioso).",
+        "En `CASO-TAC-047-1B` (priorización sintética en Tacna) el holdout `holdout-v1` y la métrica `f1-v2` están fijados: el candidato 0.82 supera al baseline 0.78 con lineage `ds-v3` / `git:abc` / `lock:def`. Un run con `code=latest` y `split=train` se invalida aunque el score sea 0.90: no es evidencia de promote.",
       ],
```

Apply analogous rewrites for T2-A/B, T3-B, T4-A/B; keep T3-A’s diversified contract as reference quality.

### Diff E — ISSUE-07 · Replace print-theater demos (example T1-A theory + iDo)

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@ theory T1-A code
-def log_run(run_id: str, metrics: dict, seed: int) -> tuple:
-    return run_id, metrics, seed
-
-rid, m, seed = log_run("r1", {"f1": 0.81}, 42)
-print(rid)
-print(m)
-print("repro", seed)
+def reproducible(metric: float, rerun: float, tolerance: float, seed: int | None) -> bool:
+    if seed is None:
+        return False
+    return abs(metric - rerun) <= tolerance
+
+print("repro", reproducible(0.81, 0.805, 0.01, 42))
+print("nonrepro", reproducible(0.81, 0.65, 0.01, 42))
+print("missing_seed", reproducible(0.81, 0.805, 0.01, None))
@@ iDo T1-A
-def track_seed(seed: int) -> int:
-    return seed
-
-print("tracking", "mlflow_like")
-print("params", True)
-print("seed", track_seed(42))
+def within_tol(metric: float, rerun: float, tol: float) -> bool:
+    return abs(metric - rerun) <= tol
+
+run = {"params": {"depth": 4}, "metric": 0.81, "rerun": 0.805, "seed": 42, "tol": 0.01}
+ok = bool(run["params"]) and run["seed"] is not None and within_tol(run["metric"], run["rerun"], run["tol"])
+print("run_ok", ok)
+print("seed", run["seed"])
+print("delta", round(abs(run["metric"] - run["rerun"]), 3))
```

(Update `output` fields to match.)

### Diff F — ISSUE-09 · Align youDo and selfCheck action codes

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@ youDo requirements
-      "Automatiza un caso normal, uno de breach (`ROLLBACK_MODEL`) y uno incierto (`HOLD_STAGE`).",
+      "Automatiza un caso normal, uno de breach (`ROLLBACK_TO_LAST_GOOD` o el gate de breach del subtema) y uno incierto (`REVIEW_RETIREMENT` / `INVESTIGATE_*` según evidencia faltante).",
@@ selfCheck Q2
-        options: ["emitir ROLLBACK_MODEL y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
-        correctIndex: 0,
-        explanation: "El contrato falla cerrado con ROLLBACK_MODEL; no convierte incertidumbre o breach en éxito.",
+        options: ["emitir ROLLBACK_TO_LAST_GOOD y conservar evidencia", "continuar y ocultar el warning", "inventar evidencia faltante", "borrar el trace para reducir ruido"],
+        correctIndex: 0,
+        explanation: "El contrato falla cerrado con ROLLBACK_TO_LAST_GOOD (u otro verbo de breach del subtema); no convierte incertidumbre o breach en éxito.",
```

### Diff G — ISSUE-10 · Teach stable seed, not magic 42

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
@@ solution T1-A-E1
-meets_contract = abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"] and record["seed"] == 42 and bool(record["params"])
+meets_contract = (
+    record.get("seed") is not None
+    and bool(record["params"])
+    and abs(record["metric"] - record["rerun_metric"]) <= record["tolerance"]
+)
```

(Align invalid fixture to fail on empty params / large delta only; keep seed present-but-different only if theory states seed must match baseline run id — if so, compare to `baseline_seed` field instead of literal 42.)

### Diff H — ISSUE-11 · Measurable learning outcomes

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
   learningOutcomes: [
-    { text: "Trackea experimentos reproducibles" },
-    { text: "Compara runs con lineage completo" },
+    { text: "Registrar un experiment run con params, métricas, seed, artefactos y versión de dataset, y re-ejecutarlo dentro de tolerancia" },
+    { text: "Comparar baseline vs candidato solo cuando data/code/env/split y la definición de métrica coinciden" },
     ...
   ],
```

### Diff I — ISSUE-12 · Substantive youDo starter (sketch)

```diff
--- a/src/lib/course/sections/s47-opensource.ts
+++ b/src/lib/course/sections/s47-opensource.ts
     starterCode: `
 CASE_ID = "CASO-TAC-047"
+
+def log_run(params, metric, rerun, seed, tol):
+    ok = seed is not None and abs(metric - rerun) <= tol
+    return {"ok": ok, "metric": metric, "seed": seed}
+
+def can_promote(stage, approved, signature_ok):
+    return stage == "staging" and approved and signature_ok
+
+def feature_parity(batch_sig, online_sig):
+    return batch_sig == online_sig
+
+def canary_ok(traffic_pct, error_rate, max_error, hooks):
+    return traffic_pct <= 10 and error_rate <= max_error and hooks
+
+# TODO(estudiante): cablea un caso normal, un breach y un missing;
+# no pongas READY a mano sin pasar los predicados.
 ...
 `,
```

### Diff J — ISSUE-13 · Grammar fix (global shell; better fixed by Diff D)

```diff
-Error: lineage incompleto, firma incompatible, regresión o fallback ausente impide promoción.
+Error: un lineage incompleto, una firma incompatible, una regresión o un fallback ausente impiden la promoción.
```

### Diff K — ISSUE-16 · Differentiated feedback (T1-A example)

```diff
-        feedback: "S47-T1-A-E1: explica qué campo cambió la decisión, por qué el adverso activa MARK_RUN_NONREPRODUCIBLE y por qué faltar tolerance exige INVESTIGATE_RANDOMNESS.",
+        feedback: "S47-T1-A-E1: la dirección del comparador es ≤ tolerancia (no >). Di qué delta produce PASS en 0.81 vs 0.805.",
...
+        feedback: "S47-T1-A-E2: el orden importa — missing primero; luego contenido. ¿Por qué el adverso falla por params/delta y no por schema?",
...
+        feedback: "S47-T1-A-E3: missing ≠ breach. Justifica CONTINUE vs MARK_RUN_NONREPRODUCIBLE vs INVESTIGATE_RANDOMNESS con un campo cada uno.",
```

### Diff L — ISSUE-17 · youDo title cleanup

```diff
-    title: "[FINAL] MLOps: experimentos, registro y serving (CP-N4-B (cierre) + CF-4)",
+    title: "Proyecto: plataforma MLOps de experimentos, registro y serving (CP-N4-B + CF-4)",
```

### Diff M — ISSUE-19 · Theory T1-B code computes comparison

```diff
-print(lineage("ds-v3", "git:abc", "locked"))
-print("compare", ["f1", "latency"])
-print("diff", True)
+lin = lineage("ds-v3", "git:abc", "locked")
+candidate, baseline = 0.82, 0.78
+comparable = all(lin.values()) and candidate > baseline
+print("lineage", lin)
+print("comparable", comparable)
+print("delta_f1", round(candidate - baseline, 2))
```

---

## 7. Recommended Priority Order for Fixing

| Order | Issue(s) | Rationale |
|------:|----------|-----------|
| 1 | ISSUE-01 / M1–M3 / M6 | Meta-leak + wrong visual identity; zero pedagogy risk |
| 2 | ISSUE-02 (CASO-LIM) | Mechanical, high consistency win |
| 3 | ISSUE-03 (edgeCases) | Stops active mis-instruction |
| 4 | ISSUE-09 (action codes) | Aligns quiz/portfolio with lab verbs |
| 5 | ISSUE-07 + ISSUE-19 (demos) | Restore I Do ≥ conceptual level of We Do |
| 6 | ISSUE-04/05/06 (theory rewrite) | Largest learning gain; use T3-A as template |
| 7 | ISSUE-10 (seed==42) | Correct mental model of reproducibility |
| 8 | ISSUE-12 + ISSUE-11 (youDo / LOs) | Portfolio honesty + measurable outcomes |
| 9 | ISSUE-08/16/14/13/17/18/20/21 | Polish, bridges, selfCheck expansion |

**Out of scope for Fixer unless asked:** Renaming platform hash `opensource` (breaks deep links); migrating off stdlib to real MLflow.

**Do not trust as done:** prior `S47_DONE.md` expert rank 9.55 / `S47_VERIFY.md` 9.6 — structural ACCEPT ≠ gold pedagogy.

---

## 8. Graph Memory Update notes

For shared context files (`GRAPH_MEMORY.json` / summary), record:

```json
{
  "section": 47,
  "id": "opensource",
  "v3_title": "MLOps: experimentos, registro y serving",
  "explorer_score": 5.7,
  "structural": {
    "theory_blocks": 9,
    "ido": 8,
    "wedo": 24,
    "youdo": true,
    "selfcheck": 5,
    "resources": "strong_mlops"
  },
  "strengths": [
    "fail_closed_E1_E2_E3_lattice",
    "domain_vocab_mlflow_registry_canary",
    "excellent_resources",
    "T3A_contract_outlier_quality"
  ],
  "debts": [
    "meta_leak_legacy_opensource",
    "CASO_LIM_vs_TAC_comment_mismatch",
    "template_contrato_operativo_x7",
    "print_theater_ido_theory",
    "edgeCases_adverse_mislabeled",
    "action_code_drift_ROLLBACK_MODEL",
    "seed_eq_42_overfit",
    "youdo_checklist_theater"
  ],
  "edges": {
    "prev": "S46 data lineage / orchestration → S47 model lineage / serving",
    "next": "S48 RAG con evidencia",
    "gates": ["CP-N4-B", "CF-4"]
  },
  "anti_patterns_hit": [
    "template_triplet_contrato_caso",
    "print_theater",
    "meta_legacy_id_in_prose",
    "byte_identical_feedback"
  ],
  "fixer_ready": true
}
```

**Fleet note:** S47 shares the Master-phase factory template with S46 (legacy-id sentences, short LOs, Contrato operativo shells). Fixes should prefer **mechanism-specific contracts** (like S47-T3-A and the better S46-T1-B “Contrato de dedup”) over global paste.

---

This is the complete Explorer report for Section 47. Ready for the Fixer prompt.
