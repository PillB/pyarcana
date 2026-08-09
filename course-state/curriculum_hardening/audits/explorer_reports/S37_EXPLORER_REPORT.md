# S37 Explorer Report — Profiling, algoritmos y rendimiento

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Method:** Stanford STORM multi-pass + Graph Engineering + Loop Engineering + Harness rules  
**Scope lock:** Section 37 only (`dbt-bigquery`)  
**Sources consulted:**
- Live site curriculum card: https://pillb.github.io/pyarcana/ (Sección 37 · *Profiling y rendimiento*)
- Platform hash target: https://pillb.github.io/pyarcana/#dbt-bigquery
- Workspace source (authoritative full content): `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s37-dbt-bigquery.ts` (1393 lines)
- Gold bar: `course-state/curriculum_hardening/GOLD_STANDARD_CHECKLIST.md`
- Prior auto-auditor: `course-state/curriculum_hardening/audits/S37_AUDIT.json` (ACCEPT structural; **not** gold pedagogy)
- Adjacent roadmap peers: S30 (ER + blocking), S36 (unsupervised signals), S38 (concurrency) — comparison only
- External anchors: Python `time`/`timeit`/`cProfile`/`tracemalloc`, Google SRE monitoring/budgets, MIT 6.006 / Princeton Algorithms, High Performance Python patterns, CS50P / Py4E progressive disclosure

**Pre-round pedagogical research (domain-relevant):**
1. **Measure before optimize** — wall vs CPU, fixed input size `n`, same functional result.
2. **Benchmark hygiene** — warmup, multiple runs, median (robust), document hardware/dataset.
3. **Algorithm first** — blocking / data structures beat micro-shaving of 1–2%.
4. **Performance budgets in CI** — regression tests must be able to fail.
5. **Gradual release (I/We/You)** — demos must *compute* the concept; exercises must force repair of a real defect, not print theater.
6. **Progressive disclosure** — stdlib-first is valid at S37 only if practice still measures real work.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 37 |
| Platform id (hash) | `dbt-bigquery` |
| Filename | `s37-dbt-bigquery.ts` |
| Title (metadata) | Profiling, algoritmos y rendimiento |
| shortTitle (live card) | Profiling y rendimiento |
| Tagline | reporte antes/después con mismo resultado, dataset, hardware y límites; optimización reversible y justificada |
| estimatedHours | 19 |
| level | Competente a experto |
| phase | 2 |
| Case id | `CASO-LIM-037` |
| Capstone link | CP-N3-C (escala del triage) |
| Structure | theory 1 map + 8 subtopics (T1–T4 × A/B); iDo 8 demos; weDo 24 (E1/E2/E3); youDo; selfCheck 5; resources |
| Live UI observation | Curriculum grid shows correct V3 title/tagline for Sección 37; SPA hash `#dbt-bigquery` is the legacy platform id (content is **not** dbt/BigQuery) |
| Out of scope this run | No curriculum TS edits; Fixer applies diffs later |

**Subtopic map (as shipped):**

| ID | Heading | Theme |
|----|---------|--------|
| (map) | Rendimiento del triage (CP-N3-C escala) | Gate same_result / before_after / budget |
| S37-T1-A | wall/CPU y memory profiling | `perf_counter`, report `n` |
| S37-T1-B | benchmark fixture, warmup y variabilidad | median, warmup |
| S37-T2-A | complejidad y blocking | pair counts, reduction |
| S37-T2-B | estructuras, vectorización y reducción de candidatos | inverted index, block→score |
| S37-T3-A | dtypes, chunking y columnar | chunks, column subset |
| S37-T3-B | caching, invalidación y out-of-core | versioned cache keys |
| S37-T4-A | performance budget y tests | measured ≤ budget |
| S37-T4-B | costo total, claridad y no microoptimización | speedup, pair_reduction |

---

## 2. Executive Summary of Quality (1–10 score + key verdict)

### Score: **6.0 / 10**

### Verdict
**Structurally complete and conceptually on-topic for V3, but pedagogically under-gold.** The theory map correctly teaches the *discipline* of scale (same_result, warmup, pair reduction, budgets, anti-microoptimization). That message is industry-honest and aligns with SRE + High Performance Python practice. However, the **We Do layer is predominantly print-theater** (literal label/flag printing), several **I Do demos do not compute** the skill they claim, **instruction text often disagrees with starterCode**, and the **legacy id `dbt-bigquery`** still leaks into learner-facing prose. Against the live gold bar (S01 depth + anti-theater rules), S37 is **not** 9.5-class; the prior paragraph dossier rank of ~9.55 is **overstated** for practice fidelity.

### Dimension snapshot

| Dimension | Grade | Note |
|-----------|-------|------|
| 1. Meta-text / developer leakage | D+ | Legacy id + path V3 + solutionCode + gate V3 + es-PE + carrera note |
| 2. Grammar & redaction (es-PE) | B | Generally clean professional Spanish; some anglicisms OK; a few opaque internal phrases |
| 3. Connective tissue / narrative flow | B | T1→T4 order clear; links triage/ER; thin bridge to S38 |
| 4. Pedagogical structure I/We/You | C | Skeleton 8/8/24 present; fidelity of *gradual release of skill* weak |
| 5. Cognitive load / progressive disclosure | B- | Glossary helps; stdlib-first OK; LO vs practice mismatch (CPU/mem never measured) |
| 6. Exercise & exam quality | D+ | 24 defects exist but most are flag flips; quiz better than labs |
| 7. Roadmap consistency | B | Topic matches SECTION_MAP V3 title; id/filename still pre-V3 |
| 8. External best-in-class comparison | C+ | Resources excellent; lab depth far below cProfile/timeit teaching norms |
| 9. Other (hours, accessibility, motivation) | C | 19h claim inflated vs actual practice depth; ethics/privacy OK |

### What works
- Gate triad `same_result` + `before_after` + `budget` is the right professional story for CP-N3-C scale.
- Blocking pair math `n*(n-1)//2` and reduction formula are correct and connected to ER (S30).
- Theory wall demo (`profile_wall`) and bench snippet with warmup *do* compute real timings.
- Self-check MCQs target genuine misconceptions (warmup, blocking, budgets, micro-opt theater, ms without `n`).
- Resources point to the right docs (perf_counter, timeit, cProfile, tracemalloc, SRE, pytest).

### What fails the gold bar hardest
- **Print theater** in ~20/24 weDo solutions (print fixed literals/flags).
- **Instruction ↔ starter mismatches** on ≥7 exercises (learner trust broken).
- **LO “Profilear wall/CPU y memoria”** never practiced for CPU or memory.
- **Legacy id / “path V3” / “solutionCode”** user-facing meta.

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker / **P1** high / **P2** medium / **P3** low polish.

### ISSUE-01 — Legacy platform id contradicts section topic (user-facing)
- **Severity:** P1  
- **Location:** `id`, `jobRelevance`, theory map para 4, `youDo.context`; filename `s37-dbt-bigquery.ts`  
- **Evidence:**  
  > Id \`dbt-bigquery\` conservado (legacy).  
  > El id de plataforma \`dbt-bigquery\` se conserva por legacy; el path V3 es profiling y algoritmos del triage N3, no un lab de SQL cloud.  
  > Id dbt-bigquery conservado.  
- **Impact:** Learners searching “dbt / BigQuery” or deep-linking the hash get profiling content; conversely, job seekers may undervalue a section that *looks* like cloud SQL. Breaks external SEO and mental model of the roadmap.  
- **Pedagogy:** Extraneous cognitive load explaining platform archaeology instead of teaching performance.

### ISSUE-02 — We Do is print-theater / anti-gold pattern
- **Severity:** P0 (pedagogy)  
- **Location:** essentially all of `weDo.steps` (24)  
- **Evidence (representative):**  
  - T1-A-E3 solution: `print("same_result", True)` only  
  - T1-B-E2: `print("warmup", True)` / `print("discard_first", True)`  
  - T2-A-E3: `print("prefer", "blocking")`  
  - T2-B-E1: `print("structure", "set")`  
  - T3-A-E3: `print("dtype", "int32")`  
  - T4-A-E3 / T4-B-E2 / T4-B-E3: list/flag prints  
- **Impact:** Violates GOLD_STANDARD anti-stub #3–#4 (“print theater”, “completa solo print/resultado”). Completing 24 labs does **not** build profiling skill; creates **false mastery** before You Do and S38/S39.  
- **Pedagogy:** Breaks gradual release: I Do shows some timing; We Do abandons measurement for policy slogans.

### ISSUE-03 — Instruction text disagrees with starterCode (multiple labs)
- **Severity:** P1  
- **Locations / evidence:**

| Exercise | Instruction claims starter… | Actual starter |
|----------|------------------------------|----------------|
| S37-T1-A-E2 | “solo `['wall']`” | `metrics = ["wall", "cpu", "memory"]` already; fails to print list / wrong `n` |
| S37-T2-A-E3 | prefer `'micro_loop'` | `print("prefer", "microopt")` |
| S37-T2-B-E1 | structure `'list'` | `"list_scan"` |
| S37-T3-A-E2 | columns `raw_blob` and `notes` | `["id", "amt", "blob", "notes"]` |
| S37-T3-B-E2 | starter `'never'` | `print("keep_forever")` |
| S37-T4-B-E1 | “Starter 80-20=60 (defect)” | `print(after / before)` (inverse ratio), not subtraction |
| S37-T4-B-E2 | prefer `'opaque_2pct'` | `"micro_shave"` |
| S37-T4-B-E3 | “omite hardware” only | omits **dataset and hardware** (`["before", "after"]`) |

- **Impact:** Student confuses “did the defect description match the code?” → thrashing, over-reliance on solution reveal, broken autograder mental model.  
- **Pedagogy:** Erodes trust in the teaching voice (critical at “Competente a experto”).

### ISSUE-04 — I Do demos that do not demonstrate the claimed skill
- **Severity:** P1  
- **Location:** `iDo.steps`  
- **Evidence:**  
  - **S37-T1-B-DEMO:** `median_runs([3, 1, 2])` — median of hardcoded ints; **no** `perf_counter`, no warmup run, no real work.  
  - **S37-T2-A-DEMO:** `blocked = 2  # p.ej. un bloque de size 2` hardcode; does not compute blocked pairs from block size.  
  - **S37-T3-A-DEMO:** `chunk_sizes` formula only — OK light, but never shows memory bound.  
  - **S37-T3-B-DEMO:** pre-seeded store hit — no put/invalidate path.  
  - **S37-T4-B-DEMO:** pure ratio `100/25` without pairs or same_result check.  
- **Contrast:** Theory `wall.py` / `bench.py` / `blocking_cost.py` *do* compute — demos regressed relative to theory.  
- **Impact:** I Do fails “show how”, so We Do cannot scaffold from a real procedure.

### ISSUE-05 — Learning outcomes overclaim relative to labs
- **Severity:** P1  
- **Location:** `learningOutcomes` vs exercises  
- **Evidence:**  
  - LO: “Profilear wall/**CPU** y **memoria** con n explícito” — no `time.process_time`, no `tracemalloc`, no `resource`.  
  - LO: “Benchmarkear con warmup, mediana y nota de **variabilidad**” — weDo never reports variance/stdev/IQR.  
  - LO: “Aplicar **dtypes**, chunks y lectura columnar mínima” — dtype exercise is string label, not actual array dtype choice.  
  - LO: “Diseñar cache con invalidación y estrategia **out-of-core**” — ooc is a printed token `"chunk"`.  
- **Impact:** Assessment/portafolio expects skills not trained → unfair You Do / interview gap.

### ISSUE-06 — Theory template soup (“Contrato operativo” shell)
- **Severity:** P2  
- **Location:** every subtopic paragraphs 2–3  
- **Evidence pattern:**  
  > Contrato operativo. Entrada: … Salida: … Error: … Criterio: …  
  > Aplicación a \`CASO-LIM-037-T…\`: …  
- **Impact:** GOLD_STANDARD anti-stub #2. After S30–S36, students may skim contracts as noise. Mechanism depth varies: T1-A/T2-A stronger; T3 dtype/columnar thinner (lists only, no measured RAM).  
- **Pedagogy:** Reduces encoding of *why* under dual-coding theory (too much identical frame).

### ISSUE-07 — CPU / memory profiling taught in prose, not code
- **Severity:** P2  
- **Location:** T1-A theory + resources (cProfile, tracemalloc)  
- **Evidence:** Code only uses `time.perf_counter` + `sum(range(n))`. Resources list cProfile/tracemalloc but no mini-demo.  
- **Impact:** Progressive disclosure of *tools* is incomplete: learner leaves without ever running a profiler API despite LO.  
- **External bar:** High Performance Python / official docs teach at least one sampling/deterministic profile snippet.

### ISSUE-08 — Blocking recall tradeoff under-taught
- **Severity:** P2  
- **Location:** T2-A theory  
- **Evidence:**  
  > En producción las claves de blocking se validan por recall de pares útiles; aquí aprendemos a contar…  
- **Impact:** One sentence only. After S30 (blocking with recall medido), S37 should **measure** cost *and* mention/rehearse that aggressive blocking can drop true pairs. Otherwise scale narrative can be misread as “always block harder.”  
- **Pedagogy:** Missing transfer from S30 metrics into S37 cost budgets.

### ISSUE-09 — Hardcoded timing outputs as “truth”
- **Severity:** P3 (with P2 risk if grader is strict on floats)  
- **Location:** theory `wall.py` output `wall_ms 1.505`; iDo `wall_ms 0.156`; theory `median_ms 0.323`  
- **Evidence (iDo why):**  
  > el ms exacto puede variar — el demo fija un output de referencia didáctico.  
- **Impact:** Partial mitigation in iDo why, but theory output still presents one machine’s float as canonical. Prefer relative assertions (`ms >= 0`, order of magnitude) or `statistics` on fixed pure loops with note “tu máquina varía”.

### ISSUE-10 — You Do under-specified for 19h / portfolio claim
- **Severity:** P2  
- **Location:** `youDo`  
- **Evidence:** Starter only medians a `sum(range(1000))` loop; objectives list four bullets; rubric weights “gate V3” 25%; portfolioNote:  
  > Escala CP-N3-C; evidencia before/after. No PASS automático de carrera.  
- **Impact:** No required artifact schema (markdown report fields), no same_result assert scaffold, no pair-count before/after fixture, no budget test file sketch. Learner who only did weDo print labs cannot assemble a portfolio piece without inventing the whole stack.  
- **Pedagogy:** You Do should be the transfer of *measured* scale report; currently a stub scaffold.

### ISSUE-11 — Meta / internal jargon in rubric and requirements
- **Severity:** P2  
- **Location:** `youDo.rubric[0]`, `youDo.requirements`  
- **Evidence:**  
  > Alineación al gate V3 de la sección  
  > es-PE  
- **Impact:** “V3” and locale code are authoring-system terms, not learner goals. Prefer “cumple el gate de escala de esta sección” and “documentación en español profesional (Perú)”.

### ISSUE-12 — Starter meta-comment leaks solution pipeline
- **Severity:** P1 (meta-leak)  
- **Location:** S37-T2-B-E2 starterCode  
- **Evidence:**  
  > # Contrato: corrige el DEFECT; salida alineada a solutionCode  
  > # DEFECT: count queda en 0 (no filtra por Lima)  *(duplicated twice)*  
- **Impact:** Exposes internal field name `solutionCode` and double DEFECT noise. Pure developer residue.

### ISSUE-13 — Estimated hours vs practice density mismatch
- **Severity:** P2  
- **Location:** `estimatedHours: 19`  
- **Impact:** If labs remain print-theater, honest completion is ~4–8h; if Fixer deepens labs to real benches, 19h may be fair. Current mismatch either over-promises time or under-delivers practice. Damages trust in course hour estimates globally.

### ISSUE-14 — Grammar / style nits (es-PE)
- **Severity:** P3  
- **Evidence samples:**  
  - Mixed register: “shaving 2%”, “micro_only”, “CI light” (acceptable industry English) embedded without brief Spanish gloss in some places.  
  - “cold start miente” — fine colloquial PE, good.  
  - Heading casing inconsistent: “wall/CPU y memory profiling” (English) vs Spanish headings elsewhere.  
  - “leaderboard de microbenchmarks vanidosos del autor” — vivid OK; slightly snarky for formal es-PE professional track.  
- **Impact:** Minor; does not block comprehension.

### ISSUE-15 — Self-check distractors slightly cartoonish but fair
- **Severity:** P3  
- **Location:** `selfCheck.questions`  
- **Evidence:** options like “Inflar métricas”, “Borrar cache siempre”, “Evitar tests”, “Seeds”.  
- **Impact:** Low — explanations are solid. Could raise difficulty with near-miss distractors (e.g. mean vs median, p95 vs max proxy) to match “Competente a experto”.

### ISSUE-16 — Connective tissue to previous/next sections thin
- **Severity:** P2  
- **Evidence:** Mentions triage N3 / matching / features / Red Andina; no explicit “en S30 mediste recall de blocking; aquí mides costo de pares y wall”; no forward “S38 aplicará budgets bajo concurrencia”.  
- **Impact:** Graph edge S30→S37→S38 exists in roadmap but not in learner narrative glue.

### ISSUE-17 — Theory `pair_reduction` uses integer division only
- **Severity:** P3  
- **Location:** T4-B `before_after.py`  
- **Evidence:** `return before_pairs // after_pairs` → prints `20` for 1e6/5e4; theory prose says “pair_reduction 20×” OK, but loses fractional reductions and differs from T2-A reduction ratio in [0,1]. Two incompatible “reduction” semantics without glossary link.  
- **Impact:** Mild conceptual split (ratio of counts vs 1 − blocked/all).

### ISSUE-18 — Automated ACCEPT masks pedagogy debt
- **Severity:** P2 (process)  
- **Location:** `S37_AUDIT.json` verdict ACCEPT, high_issue_count 0  
- **Impact:** Structural auditor cannot see print-theater or instruction mismatches. Explorer/Fixer must not treat ACCEPT as gold.

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location | Learner-facing? | Classification |
|---|------------------------------|----------|-----------------|----------------|
| M1 | `Id \`dbt-bigquery\` conservado (legacy)` | `jobRelevance` | Yes | Platform archaeology |
| M2 | `El id de plataforma \`dbt-bigquery\` se conserva por legacy; el path V3 es profiling…` | theory map para 4 | Yes | Legacy id + curriculum version |
| M3 | `Id dbt-bigquery conservado` | `youDo.context` | Yes | Same |
| M4 | `path V3` / `gate V3` | theory map; `youDo.rubric` | Yes | Internal curriculum versioning |
| M5 | `Stack didáctico: **stdlib** … progressive disclosure` | theory map para 4 | Yes | Authoring pedagogy jargon |
| M6 | `español profesional (es-PE)` | theory T4-B; `requirements: "es-PE"` | Yes | Locale code as learner requirement |
| M7 | `# Contrato: corrige el DEFECT; salida alineada a solutionCode` | S37-T2-B-E2 starter | Yes | **Hard leak** of schema field |
| M8 | `No PASS automático de carrera` | `youDo.portfolioNote` | Yes | Internal career-gate language |
| M9 | Resource note `Stdlib-first progressive disclosure` | `resources.courses` Py4E note | Mild | Pedagogy meta in resource blurb |
| M10 | Filename `s37-dbt-bigquery.ts` | repo / imports | Dev-facing | Legacy naming (affects contributors more than learners) |

**Not classified as meta-leak (pedagogical scaffolding OK):** `# DEFECT:` markers in starters (course pattern), `CASO-LIM-037`, `CP-N3-C`, Red Andina ficticia, “sintético / sin PII”.

**meta_leak_count (distinct user-facing clusters):** **8** (M1–M8; M9 mild optional; M10 repo-level).

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Layer | Intent | Reality in S37 |
|-------|--------|----------------|
| **I Do** | Expert demonstrates full procedure with why | 8 demos present; ~half are literal or pre-answered; best demos are T1-A (wall), T2-B (index sizes), T4-A (budget predicate) |
| **We Do** | Guided repair of one defect with growing independence E1→E3 | Skeleton kinds `guided`/`independent`/`transfer` present, but **cognitive demand flat**: almost all are print-target alignment |
| **You Do** | Portfolio transfer under open constraints | Title/objectives right; starter too thin; rubric partly internal jargon |
| **Self-check** | Active recall gate | 5 MCQs, fair keys, good explanations — strongest assessment layer |

**Gradual release failure mode:** Theory introduces measurement → I Do sometimes drops measurement → We Do drops measurement further → You Do asks for measurement again without scaffold. That is inverted progressive difficulty.

### 5.2 Cognitive load

**Helps:**
- Section dictionary (wall, CPU, warmup, blocking, budget, same_result).
- Explicit gate and fail modes (semantic change, no warmup, micro-opt theater).
- Synthetic-only / no PII / no fraud inference — ethics consistent with S30–S36.

**Hurts:**
- Explaining legacy id and path V3 in the opening case paragraph.
- 24 near-isomorphic “print the policy flag” labs → massed practice without varied encoding.
- LO lists CPU/memory without tools → goal free-load (student doesn’t know what success looks like).
- Dual meaning of “reduction” (fraction vs × factor).

### 5.3 Narrative / connective tissue

**Strengths:**
- Clear internal arc T1 measure → T2 algorithm → T3 memory → T4 governance.
- Situates work in triage/matching (Red Andina, Lima/Cusco synthetic).
- Anti-theater message about optimization is on-brand for PyArcana honesty culture.

**Weaknesses:**
- Under-references S14 vectorized benchmarks and S30 blocking recall as prerequisites.
- No explicit handoff sentence to S38 (resilience under load) or S39 (N3 promotion).
- Opening is denser in process meta than in a motivating failure story (e.g. “PR merged 2% micro-opt, doubled wall on n=1e5 pairs”).

### 5.4 Redaction & Spanish quality

- Overall professional es-PE with appropriate English technical terms (warmup, wall time, PR, CI, budget).
- Contract prose is readable but formulaic.
- No broken Spanish grammar of high severity found in theory paragraphs.
- User-facing English headings (T1-A style) slightly break bilingual bar “ES-PE primary prose”.
- Avoid snark if course voice is mentor-professional; keep “teatro” (already course vocabulary) over “vanidosos del autor”.

### 5.5 Exercise / exam alignment matrix

| LO (short) | Theory | iDo | weDo | youDo | quiz |
|------------|--------|-----|------|-------|------|
| wall + n | strong | partial | weak (prints n) | weak | strong |
| warmup / median | strong | weak | partial (T1-B-E1 real median) | weak | strong |
| O(n²) / blocking | strong | partial | partial (formula E1–E2) | none | strong |
| inverted index / structures | good | good | partial | none | — |
| dtypes / chunks / columnar | medium | light | print labels | none | — |
| cache / ooc | medium | light | print labels | none | — |
| budgets / CI | good | good | good (E1–E2 compare) | named only | strong |
| cost total / clarity | good | light | print policy | named | strong |
| same_result | good | — | print True | named | via options |

**Best weDo cells (keep and deepen):** T1-B-E1 (median vs mean), T2-A-E1 (pairs formula), T2-A-E2 (reduction), T2-B-E2 (count Lima), T3-A-E1 (ceil chunks), T3-B-E1 (cache key), T4-A-E1/E2 (budget pass/fail), T4-B-E1 (speedup ratio).

**Worst cells (rewrite):** T1-A-E3, T1-B-E2, T2-A-E3, T2-B-E1, T2-B-E3, T3-A-E2/E3, T3-B-E2/E3, T4-A-E3, T4-B-E2/E3 as pure flags.

### 5.6 Comparison: gold early section (S01) vs S37

| Gold trait (S01) | S37 |
|------------------|-----|
| Workplace story with defined terms | Present but shorter + legacy id digression |
| Code that runs the concept | Theory yes; weDo often no |
| Starter with one clear fixable defect | Defect labeled, but often only wrong print |
| Transfer E3 requires reasoning | Many E3 = flip order/flag |
| Hover/dictionary culture | Dictionary block present |
| Honest hours for work | 19h vs light practice — suspect |

### 5.7 External best-in-class (same topics)

| Source | What they force the learner to do | S37 gap |
|--------|-----------------------------------|--------|
| Python docs timeit / perf_counter | Time real callables; autorange | Mostly fixed N prints |
| cProfile docs | Identify hot function | Linked, never used in lab |
| Google SRE monitoring | SLI/SLO/budget with fail | Budget boolean only; good seed |
| MIT 6.006 / Princeton Algs | Prove cost; reduce asymptotic class | Pair counts good; no growth experiment over n |
| High Performance Python | Profile → change → remeasure same_result | Narrative yes; lab loop incomplete |
| CS50P / Py4E | Progressive functions | weDo rarely uses `def` + predicate |

**Conclusion:** S37’s *story* matches best practice; its *reps* do not.

### 5.8 Graph memory (nodes & edges observed)

```
[S30 blocking+recall] --should_inform--> [S37-T2 pair cost]
[S37-T1 measure] --feeds--> [S37-T4 budget]
[S37 same_result] --gate--> [any optimization node]
[legacy id dbt-bigquery] --noise_edge--> [learner topic model]
[resources cProfile] --broken_edge--> [no lab node]
[weDo print flags] --false_mastery--> [youDo portfolio]
[S37 budgets] --should_feed--> [S38 concurrency metrics]
```

---

## 6. Proposed GitHub-style Diffs

> **Do not apply in Explorer run.** Diffs are Fixer-ready sketches against `src/lib/course/sections/s37-dbt-bigquery.ts`.

### Diff group A — Meta-leak & id communication (ISSUE-01, M1–M8)

```diff
--- a/src/lib/course/sections/s37-dbt-bigquery.ts
+++ b/src/lib/course/sections/s37-dbt-bigquery.ts
@@ jobRelevance
-  "Escala el triage midiendo **antes/después** con el mismo dataset sintético. En data eng y ML ops de la región, un speedup sin same_result o sin budget en CI es regresión disfrazada. Id `dbt-bigquery` conservado (legacy). Optimizar no justifica saltarse privacidad ni tests. Caso CASO-LIM-037.",
+  "Escala el triage midiendo **antes/después** con el mismo dataset sintético. En data eng y ML ops de la región, un speedup sin same_result o sin budget en CI es regresión disfrazada. Optimizar no justifica saltarse privacidad ni tests. Caso CASO-LIM-037.",
@@ theory map paragraph
-        "Caso Red Andina (ficticio): matching y features sobre registros sintéticos de Lima/Cusco. El id de plataforma `dbt-bigquery` se conserva por legacy; el path V3 es profiling y algoritmos del triage N3, no un lab de SQL cloud. Orden: T1 Medición → T2 Algos/blocking → T3 Memoria → T4 Budgets y costo total. Stack didáctico: **stdlib** (`time`, `statistics`, `collections`) para progressive disclosure.",
+        "Caso Red Andina (ficticio): matching y features sobre registros sintéticos de Lima/Cusco. Esta sección escala el path de triage (matching y features), no un laboratorio de SQL en la nube. Orden: T1 Medición → T2 Algos/blocking → T3 Memoria → T4 Budgets y costo total. Usamos **stdlib** (`time`, `statistics`, `collections`) para medir sin dependencias nuevas.",
@@ youDo.context
-      "Mide path caliente, aplica blocking/estructuras, budget test y reporte. Id dbt-bigquery conservado. Solo datos sintéticos; mismo resultado funcional.",
+      "Mide path caliente, aplica blocking/estructuras, budget test y reporte. Solo datos sintéticos; mismo resultado funcional.",
@@ youDo.requirements
-    requirements: ["Mismo resultado funcional", "Dataset/hardware anotados", "es-PE", "Budget que puede fallar en CI light"],
+    requirements: ["Mismo resultado funcional", "Dataset/hardware anotados", "Documentación en español profesional", "Budget que puede fallar en CI light"],
@@ youDo.rubric
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Alineación al gate de escala de la sección (same_result + before/after + budget)", weight: "25%" },
@@ youDo.portfolioNote
-      "Escala CP-N3-C; evidencia before/after. No PASS automático de carrera.",
+      "Escala CP-N3-C: adjunta evidencia before/after reproducible (dataset, hardware, límites).",
```

```diff
@@ S37-T2-B-E2 starterCode
-# CASO-LIM-037 · count Lima rows
-# DEFECT: count queda en 0 (no filtra por Lima)
-# Contrato: corrige el DEFECT; salida alineada a solutionCode
-rows = [("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")]
-# DEFECT: count queda en 0 (no filtra por Lima)
+# CASO-LIM-037 · count Lima rows
+# DEFECT: count queda en 0 (no filtra por ciudad Lima)
+rows = [("Lima", "e1"), ("Lima", "e2"), ("Cusco", "e3")]
 count = 0
```

*Note for Fixer:* Keep platform `id: "dbt-bigquery"` if routing depends on it, but **stop explaining it** in learner prose. Optional later migration: alias id → `profiling-performance` with redirect (product change, out of content-only Fixer).

### Diff group B — Align instructions with starters (ISSUE-03)

```diff
-        instruction: "S37-T1-A-E2 · Lista las tres métricas base del profile: wall, cpu, memory. Imprime la lista, ok True, n 3. Starter solo ['wall'] (defect). Completa el contrato de métricas de performance del triage sintético CASO-LIM-037.",
+        instruction: "S37-T1-A-E2 · Lista las tres métricas base del profile: wall, cpu, memory. Imprime la lista, ok True, n 3. Starter ya tiene la lista pero no la imprime y reporta n 0 (defect). Completa el contrato de métricas de performance del triage sintético CASO-LIM-037.",

-        instruction: "S37-T2-A-E3 · Prioriza algoritmo: imprime prefer 'blocking', ok True, micro False. Starter prefiere 'micro_loop' (defect). Complejidad y blocking ganan a shaving del 1% en CASO-LIM-037.",
+        instruction: "S37-T2-A-E3 · Prioriza algoritmo: imprime prefer 'blocking', ok True, micro False. Starter prefiere 'microopt' y micro True (defect). Complejidad y blocking ganan a shaving del 1% en CASO-LIM-037.",

-        instruction: "S37-T2-B-E1 · Estructura preferida para membership: imprime structure 'set', ok True, scan False. Starter 'list' con scan True (defect). Contrato de lookup del path de candidatos sintético.",
+        instruction: "S37-T2-B-E1 · Estructura preferida para membership: imprime structure 'set', ok True, scan False. Starter usa 'list_scan' con scan True (defect). Contrato de lookup del path de candidatos sintético.",

-        instruction: "S37-T3-B-E2 · Razón de invalidación: imprime 'version_change', ok True, stale True. Starter 'never' (defect). Contrato de diseño del cache del triage sintético Red Andina.",
+        instruction: "S37-T3-B-E2 · Razón de invalidación: imprime 'version_change', ok True, stale True. Starter imprime 'keep_forever' y stale False (defect). Contrato de diseño del cache del triage sintético Red Andina.",

-        instruction: "S37-T4-B-E1 · Speedup 80/20 = 4.0 (ratio, no resta). Imprime 4.0, ok True, micro_only False. Starter 80-20=60 (defect). Fixture before/after sintético del path N3.",
+        instruction: "S37-T4-B-E1 · Speedup 80/20 = 4.0 (ratio before/after, no el inverso). Imprime 4.0, ok True, micro_only False. Starter imprime after/before y marca micro_only True (defect). Fixture before/after sintético del path N3.",

-        instruction: "S37-T4-B-E2 · Claridad sobre shaving 2%: imprime prefer 'clarity', ok True, shave '2pct_no'. Starter prefer 'opaque_2pct' (defect). Política de costo total del equipo sintético Red Andina.",
+        instruction: "S37-T4-B-E2 · Claridad sobre shaving 2%: imprime prefer 'clarity', ok True, shave '2pct_no'. Starter prefer 'micro_shave' y shave '2pct_yes' (defect). Política de costo total del equipo sintético Red Andina.",

-        instruction: "S37-T4-B-E3 · Claves del reporte before/after: imprime ['before','after','dataset','hardware'], ok True, n 4. Starter omite hardware (defect). Entregable del gate de escala CASO-LIM-037.",
+        instruction: "S37-T4-B-E3 · Claves del reporte before/after: imprime ['before','after','dataset','hardware'], ok True, n 4. Starter solo ['before','after'] (defect: omite dataset y hardware). Entregable del gate de escala CASO-LIM-037.",
```

### Diff group C — Deepen representative labs (ISSUE-02, ISSUE-05) — pattern, not all 24

Example rewrite of **T1-A-E1** from print-n to measured wall + n:

```diff
         starterCode: {
           language: 'python',
           title: "s37-t1-a-e1.py",
-          code: `# CASO-LIM-037 sintético · sin PII real
-# DEFECT: n reportado como 0; el sample de wall debe ser 1000
-n = 1000
-print("n", 0)
-print("metric", "wall")
-print("ok", True)
-`,
+          code: `# CASO-LIM-037 sintético · sin PII real
+# DEFECT: reporta n=0 y no mide wall con perf_counter
+import time
+n = 1000
+
+def work(n: int) -> int:
+    return sum(range(n))
+
+t0 = time.perf_counter()
+result = work(n)
+wall_ms = round((time.perf_counter() - t0) * 1000, 3)
+print("n", 0)          # DEFECT: debe ser n
+print("metric", "wall")
+print("ok", result >= 0 and wall_ms >= 0)
+`,
         },
         solutionCode: {
           language: 'python',
           title: "s37-t1-a-e1.py",
-          code: `print("n", 1000)
-print("metric", "wall")
-print("ok", True)
-`,
-          output: `n 1000
-metric wall
-ok True`,
+          code: `import time
+n = 1000
+
+def work(n: int) -> int:
+    return sum(range(n))
+
+t0 = time.perf_counter()
+result = work(n)
+wall_ms = round((time.perf_counter() - t0) * 1000, 3)
+print("n", n)
+print("metric", "wall")
+print("ok", result >= 0 and wall_ms >= 0)
+`,
+          output: `n 1000
+metric wall
+ok True`,
         },
```

Example rewrite of **T1-B-DEMO** to real warmup+median:

```diff
-          code: `import statistics
-
-def median_runs(samples):
-    return statistics.median(samples), True, len(samples)
-
-med, warmup, n_runs = median_runs([3, 1, 2])
-print("median", med)
-print("warmup", warmup)
-print("n_runs", n_runs)`,
-          output: `median 2
-warmup True
-n_runs 3`,
+          code: `import time, statistics
+
+def work():
+    return sum(i * i for i in range(3000))
+
+work()  # warmup (descartada)
+times = []
+for _ in range(5):
+    t0 = time.perf_counter()
+    work()
+    times.append(time.perf_counter() - t0)
+med = statistics.median(times)
+print("median_ms", round(med * 1000, 3) >= 0)  # booleano estable didáctico
+print("warmup", True)
+print("n_runs", 5)`,
+          output: `median_ms True
+warmup True
+n_runs 5`,
```

Example **T2-A-DEMO** compute blocked pairs:

```diff
-n = 4
-blocked = 2  # p.ej. un bloque de size 2
-print("all_pairs", pair_count(n))
-print("blocked", blocked)
-print("ok", pair_count(n) > blocked)`,
+n, blocks = 4, 2
+size = n // blocks
+blocked = blocks * size * (size - 1) // 2
+print("all_pairs", pair_count(n))
+print("blocked", blocked)
+print("ok", pair_count(n) > blocked)`,
```

### Diff group D — Connective tissue (ISSUE-16, ISSUE-08)

```diff
+        "Puente S30→S37: en entity resolution ya mediste **recall de blocking**; aquí mides **costo** (pares y wall) sin abandonar same_result. Un blocking más agresivo que baje recall no es «victoria» de escala.",
+        "Puente S37→S38: los budgets y el reporte before/after de esta sección son la base cuando el path corra con colas, reintentos y variabilidad de proveedor.",
```

### Diff group E — You Do scaffold (ISSUE-10)

```diff
     starterCode: `import time
+import statistics
+
 def bench(fn, n=5):
-    fn(); ts=[]
+    fn()  # warmup
+    ts = []
     for _ in range(n):
-        t0=time.perf_counter(); fn(); ts.append(time.perf_counter()-t0)
-    return sorted(ts)[len(ts)//2]
+        t0 = time.perf_counter()
+        fn()
+        ts.append(time.perf_counter() - t0)
+    return statistics.median(ts)
+
+def all_pairs(n: int) -> int:
+    return n * (n - 1) // 2
+
+def blocked_pairs(n: int, blocks: int) -> int:
+    size = n // blocks
+    return blocks * size * (size - 1) // 2
+
 if __name__=='__main__':
-    print(bench(lambda: sum(range(1000))))
+    n = 200
+    before = {"ms": bench(lambda: sum(range(n * n // 4))) * 1000, "pairs": all_pairs(n)}
+    after = {"ms": bench(lambda: sum(range(n))) * 1000, "pairs": blocked_pairs(n, 10)}
+    # TODO estudiante: same_result check, budget assert, reporte dataset/hardware
+    print("before", before)
+    print("after", after)
 `,
```

### Diff group F — Optional theory CPU/memory micro-snippet (ISSUE-07)

```diff
+# After wall demo, add callout code note or second snippet:
+# import time
+# t0 = time.process_time(); work(); cpu_s = time.process_time() - t0
+# (tracemalloc optional advanced tip — link resource)
```

---

## 7. Recommended Priority Order for Fixing

| Order | Issue(s) | Why first |
|-------|----------|-----------|
| 1 | **ISSUE-03** instruction↔starter mismatches | Immediate learner confusion; pure redaction; low risk |
| 2 | **ISSUE-12 / Meta M7** solutionCode leak + duplicate DEFECT | Hard meta-leak; one-line fix |
| 3 | **ISSUE-01 / Meta M1–M4, M8, M11** strip legacy/V3/carrera/es-PE from learner prose | Trust + professionalism |
| 4 | **ISSUE-04** fix worst iDo demos (T1-B, T2-A) | Restores model for We Do |
| 5 | **ISSUE-02 / ISSUE-05** rewrite print-theater weDo (batch: policy-flag E3s + T1-A measurement track) | Core pedagogy debt |
| 6 | **ISSUE-10 / Diff E** You Do scaffold | Portfolio integrity |
| 7 | **ISSUE-16 / ISSUE-08** S30/S38 bridges + blocking recall caveat | Roadmap graph |
| 8 | **ISSUE-07 / ISSUE-17** CPU/mem touch + unify reduction semantics | Completeness |
| 9 | **ISSUE-13** re-validate estimatedHours after lab deepening | Honest planning |
| 10 | **ISSUE-09 / ISSUE-14 / ISSUE-15** polish floats, headings, quiz distractors | Final pass |

**Do not prioritize:** Renaming platform `id` in this content Fixer cycle unless product routing is ready (keep id, scrub prose).

**Success criteria for Fixer exit:**
- Zero instruction↔starter contradictions.
- Zero `solutionCode` / `path V3` / `gate V3` / `es-PE` / “carrera” leaks in learner text.
- ≥12/24 weDo require a **computed** predicate (function + numeric relation), not only labels.
- ≥6/8 iDo demos derive outputs from inputs/work.
- You Do starter supports before/after + pairs + same_result hook.
- Self-check remains ≥5 with explanations.

---

## 8. Graph Memory Update notes

```yaml
section: 37
id: dbt-bigquery
title: Profiling, algoritmos y rendimiento
explorer_score: 6.0
status: explored
nodes:
  - S37_gate: {same_result, before_after, budget}
  - S37_T1_measure: {wall, warmup, median}
  - S37_T2_algo: {pairs, blocking, inverted_index}
  - S37_T3_memory: {chunks, dtype_label, cache_key, ooc_label}
  - S37_T4_gov: {budget_test, speedup, clarity}
  - S37_legacy_id: dbt-bigquery  # noise; scrub from prose
edges:
  - S30_blocking_recall -> S37_T2_pair_cost: under_linked
  - S37_T1_measure -> S37_T4_budget: present
  - S37_resources_cProfile -> S37_labs: broken
  - S37_weDo_print_theater -> false_mastery: active_defect
  - S37 -> S38_concurrency: should_link_budgets
gold_bar:
  structure_8_8_24: pass
  anti_print_theater: fail
  instruction_starter_align: fail
  meta_leak_free: fail
  expert_rank_claim_9_55: rejected_by_explorer
fixer_queue: [ISSUE-03, ISSUE-12, ISSUE-01, ISSUE-04, ISSUE-02, ISSUE-10, ISSUE-16, ISSUE-07]
notes:
  - Automated S37_AUDIT ACCEPT is structural only.
  - Content topic is correct for V3 roadmap; filename/id remain pre-V3 legacy.
  - Best assets to preserve: theory dictionary, blocking_cost math, budget pass/fail E1/E2, selfCheck.
```

---

## Appendix A — Structure inventory (evidence of completeness)

| Component | Count | Status |
|-----------|-------|--------|
| theory headings | 9 (1 map + 8) | Present |
| iDo demos | 8 | Present; quality mixed |
| weDo exercises | 24 | Present; many print-theater |
| youDo | 1 | Present; thin starter |
| selfCheck | 5 | Present; good |
| resources docs | 8 | Present; strong |
| resources books | 2 | Present |
| resources courses | 5 | Present |

## Appendix B — Live site vs source

- Live curriculum card for Sección 37 shows **Profiling y rendimiento** and the correct tagline (before/after, same result, hardware, limits).  
- Platform id remains `dbt-bigquery` (hash/routing).  
- SPA did not expose full section body to static fetch; full pedagogical analysis used workspace source `s37-dbt-bigquery.ts`, which is the render source for the app.

## Appendix C — Issue count summary

| Severity | Count |
|----------|-------|
| P0 | 1 (print-theater systemic) |
| P1 | 6 |
| P2 | 8 |
| P3 | 3 |
| **Total registry issues** | **18** |
| **Meta-leak clusters (user-facing)** | **8** |

---

This is the complete Explorer report for Section 37. Ready for the Fixer prompt.
