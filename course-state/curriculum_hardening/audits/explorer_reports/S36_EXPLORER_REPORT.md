# S36 Explorer Report — Clustering, anomalías y validación temporal

**Auditor role:** Curriculum Auditor + Pedagogical Analyst + Technical Editor (Explorer only; no fixes applied)  
**Platform section id:** `ai-apis-advanced`  
**Live curriculum:** https://pillb.github.io/pyarcana/ (Sección 36 · shortTitle «Clustering y anomalías»)  
**Deep link (hash):** https://pillb.github.io/pyarcana/#ai-apis-advanced  
**Source of truth:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s36-ai-apis-advanced.ts`  
**Seed / exam bank:** `prisma/seed.ts` key `'ai-apis-advanced'`  
**Prior automated audit:** `course-state/curriculum_hardening/audits/S36_AUDIT.json` → ACCEPT (0 high issues; structural redaction clean)  
**Blueprint context:** `course-state/s36_phase3.json` (V3 retheme of legacy AI-APIs slot)  
**Analysis date:** 2026-07-24  
**Passes executed:** surface scan → pedagogy/IDo-WeDo-YouDo → redaction/grammar es-PE → meta-leak → exercise/exam alignment → external benchmark → diff architecture → loop refinement  

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| Index | 36 |
| Display title | Clustering, anomalías y validación temporal |
| shortTitle (UI list) | Clustering y anomalías |
| Tagline | señales auxiliares evaluadas por utilidad de revisión; una anomalía nunca es conclusión de conducta indebida |
| Level / hours / phase | Competente a experto · **18 h** · phase 2 |
| Case fixture | `CASO-LIM-036` (Red Andina ficticia, Lima) |
| Capstone role | Señales auxiliares hacia **CP-N3-C** (triage) |
| Theory map | 1 mapa + 8 subtemas (T1-A/B … T4-A/B) |
| I Do | 8 demos (`S36-T*-DEMO`) |
| We Do | 24 ejercicios (E1 guided / E2 independent / E3 transfer × 8 subtopics) |
| You Do | Mini-pipeline señales + rubrica 6+gate |
| SelfCheck | 5 MCQ in-section |
| Stack didáctico declarado | stdlib (`statistics`, listas); sklearn solo referencia |
| Out of scope this run | Fixer edits, product TS changes, other sections |

**Live site note:** La home pública lista S36 con el shortTitle y tagline correctos (coinciden con el source). El contenido largo vive en el bundle SPA (hash `ai-apis-advanced`); el análisis de cuerpo se basó en el source canónico que alimenta el build, cruzado con metadata visible en https://pillb.github.io/pyarcana/ y con el bank de conceptos en `seed.ts`.

**Roadmap neighbors (consistency):**

- **S35** (Explainability/equidad): inicia ficha CP-N3-C.  
- **S36** (esta): añade señales no supervisadas *auxiliares* a la cola.  
- **S37** (Profiling): rendimiento del pipeline; puente narrativo débil desde S36.  
- **S39**: cierra Responsible ML Case Triage N3.

---

## 2. Executive Summary of Quality

### Score: **6.6 / 10**

### Verdict

**Solid ethics + contract scaffolding, thin algorithmic depth, significant learner-facing meta-leak of platform retheme, and We Do pollution by policy-print exercises.** The section successfully hammers the non-negotiable lesson *anomalía ≠ culpa* and aligns with CP-N3-C triage utility (precision@k, HITL, contamination-as-capacity). That ethical spine is best-in-class versus many unsupervised MOOCs. However, for a «Competente a experto · 18 h» unit whose learning outcomes name k-means, multi-seed stability, PCA, Isolation Forest/LOF, temporal backtests and scarce labels, the executable content is mostly 1D means, weighted toy projections, σ-rules, and `print` of governance booleans. Several outcomes are **named but not trained**. Automated lesson auditor ACCEPT (boilerplate-clean) is necessary but not sufficient: ACCEPT does not measure pedagogical fidelity or meta-leak of V3/legacy platform talk.

**Key strengths**

1. Opening dictionary (clustering, centroide, scale, PCA, novelty, contamination, P@k, HITL) mirrors gold-standard S01 progressive disclosure.  
2. Ethics fail-closed is repeated with *computational* hooks (flags + `misconduct=False`), not only prose.  
3. Full I/We/You structure with 8 demos and 24 defect-based starters (not empty TODOs).  
4. Resources point to sklearn docs, CS229, StatQuest, ISLR — good external bridges.  
5. SelfCheck + seed bank test scale sensitivity, contamination misuse, leakage, P@k.

**Key weaknesses**

1. **Meta-leak / developer retheme talk** exposed to learners (`legacy`, `path V3`, `Retarget`, `gate V3`, id conservation).  
2. **Outcome–code gap:** IF/LOF, density clustering, true multi-seed stability, real PCA eigenvalues never appear as runnable code.  
3. **Misleading demo artifact:** theory T1-A prints `scaled True` without scaling.  
4. **~9/24 We Do** are pure policy-string flips («print-theater» while iDo claims the opposite).  
5. **You Do** starter omits backtest/PCA listed in objectives; thin for 18 h.  
6. **Hours mismatch:** blueprint `s36_phase3.json` had 12 h; product ships 18 h without depth to justify inflation.  
7. **Connective tissue** to S35/S37 weaker than S01-class narrative; formulaic «Mecanismo → Contrato → Aplicación» every subtopic.

---

## 3. Detailed Issue Registry

Severity: **P0** ship-blocker / ethics or truthfulness · **P1** high pedagogy or meta-leak · **P2** medium quality · **P3** polish.

| ID | Severity | Dimension | Evidence (quote / location) | Pedagogical impact |
|----|----------|-----------|-----------------------------|--------------------|
| **S36-I01** | P1 | Meta-leak | `jobRelevance`: «Id \`ai-apis-advanced\` conservado por legacy de plataforma.» | Learner sees platform plumbing, not job skill. Undermines professional tone of es-PE curriculum. |
| **S36-I02** | P1 | Meta-leak | Theory map §: «El id de plataforma \`ai-apis-advanced\` se conserva por legacy; el path V3 es unsupervised signals, no tool-use de APIs de agentes.» | Explicit curriculum versioning + negative content map («not agent APIs») is author-to-author. Confuses URL/id vs title. |
| **S36-I03** | P1 | Meta-leak | Callout title: **«Retarget y ética»** | «Retarget» is internal retheme jargon; not a learner concept. |
| **S36-I04** | P2 | Meta-leak | `youDo.context`: «Id ai-apis-advanced conservado.» | Same leak in portfolio brief where only product goals should appear. |
| **S36-I05** | P2 | Meta-leak | Rubric: «Alineación al gate V3 de señales auxiliares» | Internal gate naming in learner-facing rubric; prefer plain language («señales auxiliares CP-N3-C»). |
| **S36-I06** | P2 | Meta-leak / tone | `iDo.intro`: «8 demos calculados **(no print-theater)**» | Meta self-defense about curriculum quality; learner does not need anti-pattern name. Irony: many We Do *are* print-theater. |
| **S36-I07** | P1 | Cognitive honesty | Theory T1-A code prints `scaled True` while never scaling `xs` | Teaches false correspondence between flag and action; scale-first message is verbally right, computationally wrong. |
| **S36-I08** | P1 | Outcomes vs content | LO: «Detectar rareza con reglas σ **e ideas IF/LOF**»; heading T3-A «Isolation Forest / LOF…»; only σ implemented | Illusion of coverage; expert-level claim without practice of IF/LOF even as pseudocode walkthrough. |
| **S36-I09** | P1 | Outcomes vs content | Heading T1-A «k-means / **density**»; density never operationalized (no DBSCAN/core-distance toy) | Seed exam asks density/DBSCAN concept; theory barely defines it. |
| **S36-I10** | P1 | Outcomes vs content | LO multi-seed stability; code only prints `"stable_check", "multi_seed"` or compares two hardcoded equal k’s | No assignment loops, no ARI, no centroid jitter — stability remains slogan. |
| **S36-I11** | P1 | We Do quality | Policy-print exercises: T1-B-E2, T2-A-E3, T2-B-E1, T2-B-E3, T3-A-E3, T3-B-E3, T4-A-E2, T4-B-E2, T4-B-E3 (~9/24) | Gradual release collapses to string replacement; weak active recall of math; risks habit of «cambiar el bool y listo». |
| **S36-I12** | P2 | We Do boilerplate | Every instruction/tests tail: «Fixture sintético CASO-LIM-036; … anomalía ≠ culpa» × ~24 | Extraneous load; ethics already in map + callouts. Auditor ACCEPT means tails are varied enough not to trip markers, but still dense. |
| **S36-I13** | P1 | You Do alignment | Objectives list PCA + backtest; starter only `centroid` / `sigma_flags` / `precision_at_k` | Portfolio under-spec relative to stated objectives; learner can «pass» without temporal validation. |
| **S36-I14** | P2 | You Do depth | Starter ~20 lines; `estimatedHours: 18` | Time budget not justified by scope; either deepen project or lower hours (blueprint had **12**). |
| **S36-I15** | P2 | Connective tissue | Map says CP-N3-C and CASO-LIM-036 but does not restate S35 ficha layers or handoff to S37 | At phase «Competente a experto», narrative bridges matter for graph memory; feels factory-templated vs S01. |
| **S36-I16** | P2 | Technical pedagogy | «k-means» taught as pre-split group means (no assign–update loop) | Acceptable progressive disclosure *if labeled*; risk of overclaiming «k-means» skill. Prefer «centroides 1D (núcleo de k-means)» consistently in LO text. |
| **S36-I17** | P2 | Technical pedagogy | PCA as fixed weights `0.8, 0.2` without variance explained or scale-before-PCA demo | Prudence messaging is excellent; math intuition thinner than linked StatQuest/ISLR. |
| **S36-I18** | P2 | Technical correctness pedagogy | σ-rule theory uses `body = xs[:-1]` assuming last point is the outlier | Hidden assumption; real pipelines cannot drop last index. Prefer explicit `ref` normals like demo T3-A. |
| **S36-I19** | P3 | Grammar / es-PE | Callouts EN: «Scale first»; objectives: «disclaimer **ethical**»; mixed EN prints (`scaled`, `verdict`) | Tech bilingualism is OK in PE professional Spanish, but titles/objectives should be es-PE first. |
| **S36-I20** | P3 | Glossary gap | Dictionary omits **fail-closed**, **print-theater**, **gate**, **V3**, **retarget** (yet text uses some) | Either define or remove. |
| **S36-I21** | P2 | Edge cases vs code | edgeCases list `sd=0`, empty groups; solutions often omit guards (except theory centroid empty) | Transfer incomplete; We Do never forces the edge. |
| **S36-I22** | P3 | Consistency | `s36_phase3.json` estimatedHours **12** vs section **18** | Roadmap/hours honesty for dashboard «1040 h». |
| **S36-I23** | P3 | SelfCheck distractors | Options like «Kafka lag», «Blocking de candidatos», «Backpressure» | Good cross-section memory *if* prior mastery; can feel random if learner skims. Acceptable. |
| **S36-I24** | P2 | Comparative quality | vs CS229 / sklearn user guide / StatQuest: ethics stronger, algorithms much shallower | For LATAM job interviews mentioning IsolationForest, gap is material unless S39+ covers it. |
| **S36-I25** | P3 | Accessibility | No alt narrative for visual PCA scatter (prose-only ok; no figure) | Section is text/code; fine if intentional. |
| **S36-I26** | P2 | Motivation / jobRelevance | Mentions Interbank/fintech Lima well, then pivots to legacy id | Job story diluted by meta-leak (I01). |
| **S36-I27** | P3 | Indentation style | Some demos use 4-space body, theory often 1-space inside template strings | Cosmetic; may render inconsistently in code panes. |

---

## 4. Meta-Leak Report

Exact learner-facing leaks (do **not** apply fixes here — for Fixer):

| # | Location | Exact / near-exact text | Why it is a leak |
|---|----------|-------------------------|------------------|
| M1 | `jobRelevance` | «Id \`ai-apis-advanced\` conservado por legacy de plataforma.» | Platform migration note. |
| M2 | Theory map paragraphs | «El id de plataforma \`ai-apis-advanced\` se conserva por legacy; el path V3 es unsupervised signals, no tool-use de APIs de agentes.» | Version path + negative scope for authors. |
| M3 | Map callout `title` | «Retarget y ética» | Internal retheme verb. |
| M4 | `youDo.context` | «Id ai-apis-advanced conservado.» | Same as M1 in portfolio. |
| M5 | `youDo.rubric[0]` | «Alineación al gate V3 de señales auxiliares» | Internal gate label. |
| M6 | `iDo.intro` | «(no print-theater)» | Curriculum QA jargon to student. |

**Not counted as meta-leak (intentional pedagogy):** starter comments `# DEFECT:`; `CASO-LIM-036`; ethics disclaimers; sklearn «en producción usarías…» progressive disclosure; CP-N3-C product naming (domain, not authoring).

**meta_leak_count: 6** (M1–M6)

**Pattern note:** Same class of leak appears across S32–S37 (`Id X conservado`, `path V3`). S36 is not unique but still must be cleaned for user-facing quality.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

- **Gradual release (I/We/You):** worked example → guided repair → independent transfer. S36 structure matches; transfer often degrades to ethics booleans (I11).  
- **Cognitive load:** map dictionary reduces intrinsic load (good); 24× ethics tails raise extraneous load (I12).  
- **Unsupervised best practice:** scale before distance methods; interpret carefully; multiple metrics; contamination ≠ prevalence — section *states* these well.  
- **Evaluation with scarce labels:** precision@k + human review is industry-correct for review queues; ROC-with-sparse-labels warning is excellent.  
- **Ethics in anomaly detection:** rare strength vs generic «fraud detection» courses that over-promise.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Fidelity | Notes |
|-------|----------|-------|
| **I Do** | Medium-high | 8 demos, one per subtopic; mostly real arithmetic (centroid, z not shown in demos, σ, P@k). Several demos still append policy prints. Claim «no print-theater» overstates. |
| **We Do** | Medium-low | E1 often genuine bug-fix (sum vs mean, min vs max, z=0). E2/E3 frequently policy. Pattern «E1 calc / E2 policy / E3 transfer» is intentional but E2/E3 under-teach algorithms. |
| **You Do** | Medium-low | Correct ethical constraints; incomplete vs objectives (I13); thin for expert hours. |
| **SelfCheck** | High | 5 solid conceptual items; align with theory claims. |
| **Seed bank** | High | Broader than SelfCheck (density, stability, preprocess docs); slightly ahead of taught code (I09). |

### 5.3 Cognitive load & progressive disclosure

**Works:** stdlib-first; dictionary; short code blocks; ethical schema repeated as flags.  
**Breaks:** naming IF/LOF/DBSCAN/PCA/k-means multi-seed without progressive *implementation* ladder; policy exercises add germane ethics load but steal practice slots from math.

**Suggested progressive ladder (for Fixer design, not applied):**

1. Scale + 1D centroids (current).  
2. Tiny 2D assign-to-nearest-centroid loop (true k-means micro).  
3. Multi-seed: two runs, compare labels (even with toy equality/difference).  
4. Weighted PCA + **explain** fixed weights vs real eigenvectors.  
5. σ-rule with explicit `ref` normals.  
6. Optional: Isolation Forest *conceptual table* (random partition depth) without requiring sklearn install.  
7. Temporal fit-on-past / score-on-future with two arrays.  
8. P@k + HITL.

### 5.4 Redaction & es-PE

- Tone is professional, synthetic-lab honest, Peru-relevant (Interbank/fintech Lima).  
- Formulaic stems «Mecanismo: / Contrato operativo. / Aplicación a CASO-…» every subtopic: readable, monotonous vs S01.  
- English callout titles and «disclaimer ethical» need es-PE pass (I19).  
- No catastrophic grammar failures found; no PII; synthetic data discipline strong.  
- Automated `S36_AUDIT.json` ACCEPT: no high boilerplate markers — consistent with this human review on *redaction cleanliness*, not depth.

### 5.5 Graph Engineering (nodes & edges)

**Strong nodes:** scale-first · centroid · k-as-hypothesis · PCA exploratory · σ-flag · contamination-capacity · temporal leakage · P@k · HITL · anomalía≠culpa.

**Weak / dangling edges:**

- density methods → (almost no code)  
- IF/LOF → (mention only)  
- multi-seed → (string only)  
- S35 ficha 4 capas → S36 signal → (implicit)  
- S36 signals → S37 profiling → (missing)  
- platform id `ai-apis-advanced` → learner mental model of «AI APIs» → **broken** by retheme (must not be explained as legacy in UI)

### 5.6 Comparison to gold-standard early sections (S01)

| Criterion | S01 | S36 |
|-----------|-----|-----|
| Vocabulary first | Rich, hover-oriented | Good map dictionary |
| Workplace story | Extended, concrete | Short + meta-leak |
| Code honesty | Commands match claims | `scaled True` mismatch |
| Exercise authenticity | Real environment tasks | Many bool flips |
| Hours credibility | Dense for ~19 h | Sparse for 18 h |

### 5.7 Comparison to external materials

| Source | S36 relative quality |
|--------|----------------------|
| sklearn clustering / outlier detection guides | Weaker on APIs & diagnostics; stronger on human review ethics |
| CS229 unsupervised notes | Far shallower math |
| StatQuest K-means/PCA | Less visual intuition; good links in resources |
| Typical Kaggle «anomaly = fraud» notebooks | **Much stronger ethics** — keep this differentiator |
| IBM/industry unsupervised overviews | Comparable high-level framing; S36 better on review-queue metrics |

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only**. Do not apply in Explorer. Paths relative to repo root. Hunks illustrative; Fixer must re-read file before patching.

### Diff A — Strip platform legacy meta-leak from jobRelevance (I01 / M1)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- "Señales no supervisadas alimentan el triage CP-N3-C como **auxiliares** de cola de review. En banca de procesos, fintech y retail (p. ej. colas sintéticas tipo Interbank/fintech Lima en el laboratorio), un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Id `ai-apis-advanced` conservado por legacy de plataforma. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).",
+ "Señales no supervisadas alimentan el triage CP-N3-C como **auxiliares** de cola de review. En banca de procesos, fintech y retail (p. ej. colas sintéticas tipo Interbank/fintech Lima en el laboratorio), un flag de rareza mal comunicado se convierte en daño reputacional y operativo. Anomalía ≠ conducta indebida ni fraude. Caso sintético CASO-LIM-036 (Red Andina ficticia).",
```

### Diff B — Rewrite theory map paragraph without V3/legacy (I02 / M2)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- "Caso Red Andina (ficticio, Lima): montos y frecuencias inventadas. El id de plataforma `ai-apis-advanced` se conserva por legacy; el path V3 es unsupervised signals, no tool-use de APIs de agentes. Orden: T1 Clustering → T2 Dimensión/PCA → T3 Anomalías → T4 Tiempo y labels escasos. Stack didáctico: **stdlib** (`statistics`, listas) para progressive disclosure; sklearn se cita como referencia profesional sin exigir la librería en ejercicios."
+ "Caso Red Andina (ficticio, Lima): montos y frecuencias inventadas. Orden: T1 Clustering → T2 Dimensión/PCA → T3 Anomalías → T4 Tiempo y labels escasos. Stack didáctico: **stdlib** (`statistics`, listas) para progressive disclosure; sklearn se cita como referencia profesional sin exigir la librería en ejercicios. Esta sección no decide fraude ni parentesco: solo produce señales para la cola de review."
```

### Diff C — Callout title retarget → learner language (I03 / M3)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- title: "Retarget y ética",
+ title: "Ética de señales",
  content:
  "Anomalía ≠ culpa. Señal de rareza → candidato a revisión humana. Sin PII real; sin concluir conducta indebida automática.",
```

### Diff D — youDo context + rubric (I04, I05 / M4, M5)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- "Construye un mini-pipeline de clustering/anomalías sobre CASO-LIM-036 (sintético): scale → centroides o flags σ → backtest de flag_rate → P@k con HITL. Id ai-apis-advanced conservado. Sin concluir conducta indebida.",
+ "Construye un mini-pipeline de clustering/anomalías sobre CASO-LIM-036 (sintético): scale → centroides o flags σ → backtest de flag_rate → P@k con HITL. Sin concluir conducta indebida.",
@@
- { criterion: "Alineación al gate V3 de señales auxiliares", weight: "25%" },
+ { criterion: "Señales auxiliares al triage (cola de review, sin auto-culpa)", weight: "25%" },
```

### Diff E — iDo intro drop print-theater (I06 / M6)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- intro: "Te muestro 8 demos calculados (no print-theater) de clustering, PCA prudente, anomalías σ y backtests sin convertir rareza en culpa (CASO-LIM-036 sintético).",
+ intro: "Te muestro 8 demos con números calculados de clustering, PCA prudente, anomalías σ y backtests sin convertir rareza en culpa (CASO-LIM-036 sintético).",
```

### Diff F — Honest scale in theory T1-A (I07)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
 code: `def centroid_1d(xs):
  if not xs:
  raise ValueError("empty group")
  return sum(xs) / len(xs)
 
+def zscore_list(xs):
+ mu = sum(xs) / len(xs)
+ var = sum((x - mu) ** 2 for x in xs) / len(xs)
+ sd = var ** 0.5 or 1.0
+ return [(x - mu) / sd for x in xs], True
+
 xs = [1.0, 1.2, 5.0, 5.2, 5.1]
+xs_scaled, did_scale = zscore_list(xs)
 low, high = xs[:2], xs[2:]
 c1 = centroid_1d(low)
 c2 = centroid_1d(high)
 print("c1", round(c1, 2), "c2", round(c2, 2))
-print("scaled", True)
+print("scaled", did_scale)
 print("verdict", False)
 `,
```

*(Fixer should also recompute `output` if centroids are intended on scaled space — prefer: scale first, then split groups on scaled values, or document «scale flag after z-score of full vector».)*

### Diff G — Align LO wording with taught depth (I08, I16) — option soft

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- { text: "Aplicar clustering con escalamiento previo de features y centroides calculados" },
+ { text: "Aplicar escalamiento y centroides 1D (núcleo de k-means) sin tratar el cluster como culpa" },
@@
- { text: "Detectar rareza con reglas σ e ideas IF/LOF sin veredicto de conducta" },
+ { text: "Detectar rareza con reglas σ (y saber cuándo IF/LOF de sklearn aplica en producción) sin veredicto de conducta" },
```

**Option hard (preferred long-term):** keep LO ambitious and add a stdlib micro-demo of isolation-by-random-splits *or* optional `sklearn` sandbox note with expected API — not a one-line print.

### Diff H — Multi-seed micro-demo honesty (I10) — conceptual patch

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- scores = {2: 0.4, 3: 0.55, 4: 0.52}
- k, score = choose_k(scores)
- print("k", k)
- print("score", score)
- print("stable_check", "multi_seed")
+ scores_seed_a = {2: 0.4, 3: 0.55, 4: 0.52}
+ scores_seed_b = {2: 0.41, 3: 0.54, 4: 0.50}
+ k_a, _ = choose_k(scores_seed_a)
+ k_b, _ = choose_k(scores_seed_b)
+ print("k", k_a)
+ print("stable", k_a == k_b)
+ print("stable_check", "multi_seed")
```

Update `output` accordingly (`stable True` if both pick 3).

### Diff I — Convert one policy exercise to computation (I11 sample: T2-B-E3 remains ethics; upgrade T4-A-E2)

Replace T4-A-E2 pure print with a real temporal guard:

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- instruction: "S36-T4-A-E2 · Anti-leakage: train_end='2026-01', test_month='2026-02' → leakage False, order temporal, ok True. Starter marca leakage True (defect). CASO-LIM-036-4A.",
+ instruction: "S36-T4-A-E2 · Anti-leakage: con train_months=['2026-01'] y test_month='2026-02', implementa has_leakage(train, test) que sea True solo si test ∈ train. Imprime leakage False, order temporal, ok True. Starter usa test en train (defect).",
```

Starter defect: `train = ["2026-01", "2026-02"]`; solution: train only past months.

### Diff J — Strip repeated ethics tail from exercise tests strings (I12)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- tests: "Salida alinea con solution output de S36-T1-A-E1; fixture sintético CASO-LIM-036; anomalía ≠ culpa.",
+ tests: "Salida alinea con solution output de S36-T1-A-E1 (CASO-LIM-036).",
```

Apply analogously to all 24 `tests` / long `instruction` suffixes («Fixture sintético… conducta indebida» once in `weDo.intro` is enough).

### Diff K — You Do starter completes objectives (I13)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
 starterCode: `# CASO-LIM-036 · señales auxiliares (youDo)
 import statistics
 
 def centroid(xs):
  return sum(xs) / len(xs)
 
+def scale(xs):
+ mu = statistics.mean(xs)
+ sd = statistics.pstdev(xs) or 1.0
+ return [(x - mu) / sd for x in xs]
+
 def sigma_flags(xs, z=3.0):
- mu = statistics.mean(xs)
- sd = statistics.pstdev(xs) or 1.0
- return [x > mu + z * sd for x in xs]
+ # TODO estudiante: fit μ,σ solo en train (sin mes de test)
+ mu = statistics.mean(xs)
+ sd = statistics.pstdev(xs) or 1.0
+ return [x > mu + z * sd for x in xs]
 
 def precision_at_k(ranked, k):
  return sum(ranked[:k]) / k
 
+def mean_flag_rate(windows):
+ return sum(r for _, r in windows) / len(windows)
+
 if __name__ == "__main__":
- print("c", centroid([1.0, 1.2]))
- print("flags", sigma_flags([10, 11, 10, 50]))
- print("p_at_2", precision_at_k([1, 0, 1], 2))
+ xs = scale([1.0, 1.2, 5.0, 5.2])
+ print("c", centroid(xs[:2]))
+ print("flags", sigma_flags([10, 11, 10, 50]))
+ print("mean_flag_rate", mean_flag_rate([("2026-01", 0.1), ("2026-02", 0.12)]))
+ print("p_at_2", precision_at_k([1, 0, 1], 2))
  print("auto_guilt", False)
 `,
```

### Diff L — es-PE polish (I19)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- title: "Scale first",
+ title: "Escala primero",
@@
- "Scale + cluster/centroides con disclaimer ethical",
+ "Scale + cluster/centroides con disclaimer ético",
```

### Diff M — Hours honesty (I14, I22) — product decision

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- estimatedHours: 18,
+ estimatedHours: 12,
```

**Or** keep 18 and implement Diff G-hard + K + multi-seed + optional IF conceptual lab. Do not keep 18 with current toy depth.

### Diff N — σ theory: explicit reference set (I18)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
- def sigma_flags(xs, z=3.0):
- body = xs[:-1]
- mu = statistics.mean(body)
- sd = statistics.pstdev(body) or 1.0
- return mu, [1 if x > mu + z * sd else 0 for x in xs]
+ def sigma_flags(xs, ref=None, z=3.0):
+ ref = list(ref) if ref is not None else xs
+ mu = statistics.mean(ref)
+ sd = statistics.pstdev(ref) or 1.0
+ return mu, [1 if x > mu + z * sd else 0 for x in xs]
 
 xs = [10, 11, 10, 12, 50]
- mu, rule = sigma_flags(xs)
+ mu, rule = sigma_flags(xs, ref=xs[:4])
```

### Diff O — Connective tissue paragraph (I15)

```diff
--- a/src/lib/course/sections/s36-ai-apis-advanced.ts
+++ b/src/lib/course/sections/s36-ai-apis-advanced.ts
@@
  "Clustering y detección de rareza alimentan el triage CP-N3-C como **señales auxiliares**, no como veredictos. …
+ "Puente: en S35 armaste la ficha (evidencia | modelo | incertidumbre | humano). Aquí agregas **scores no supervisados** a la capa modelo/cola, sin tocar la decisión humana. En S37 medirás costo/tiempo de generar estas señales; en S39 las integrarás al triage responsable.",
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Action |
|----------|-----------|--------|
| **1 — Meta-leak purge** | I01–I06, M1–M6 | Diffs A–E first; zero learner-facing legacy/V3/retarget/print-theater/gate V3 |
| **2 — Truthfulness of demos** | I07, I18 | Diffs F, N — never print flags that code did not earn |
| **3 — Outcome–content contract** | I08–I10, I16, I17 | Either soften LOs (Diff G soft) **or** add multi-seed + IF conceptual + density one-liner (hard path) |
| **4 — We Do substance** | I11, I12, I21 | Reduce policy-print count; strip ethics tails; implement ≥1 edge (sd=0) |
| **5 — You Do + hours** | I13, I14, I22 | Diff K + decide 12 vs 18 h (Diff M) |
| **6 — Narrative bridges** | I15, I26 | Diff O; clean jobRelevance story |
| **7 — es-PE polish** | I19, I20, I27 | Diff L; extend dictionary; optional indent normalize |
| **8 — External parity (optional)** | I24 | Stretch: mini assign–update k-means + variance-explained toy |

**Do not** reintroduce Red Andina ethics sentence doubles (global Fixer policy from S43–S50 log). Keep single ethics statements at map/callout level.

**Acceptance criteria for Fixer re-audit**

1. `meta_leak_count == 0` for legacy/V3/retarget/print-theater/gate V3 in user-facing strings.  
2. No `scaled True` (or similar) without computation.  
3. ≤3 pure policy-print exercises of 24 (ethics transfer allowed, not dominant).  
4. You Do starter exercises scale + temporal + P@k paths.  
5. LOs match runnable content **or** content upgraded to LOs.  
6. `lesson_auditor_agent.py --section 36` remains ACCEPT.  
7. Manual pedagogy score target ≥ **8.0 / 10**.

---

## 8. Graph Memory Update notes

For shared curriculum graph / later Explorer–Fixer rounds:

```yaml
section: 36
id: ai-apis-advanced
title: Clustering, anomalías y validación temporal
explorer_score: 6.6
status_explorer: complete
status_fixer: pending

nodes_strong:
  - scale_before_distance
  - centroid_1d_as_kmeans_core
  - k_as_hypothesis_not_truth
  - pca_exploratory_not_judge
  - sigma_rule_readable_anomaly
  - contamination_is_capacity_not_fraud_rate
  - temporal_backtest_no_leakage
  - precision_at_k_scarce_labels
  - hitl_mandatory
  - anomaly_neq_misconduct

nodes_weak_or_dangling:
  - isolation_forest_lof_practice
  - density_clustering_practice
  - multi_seed_stability_practice
  - real_pca_eigen_intuition
  - bridge_S35_ficha_to_S36_signals
  - bridge_S36_to_S37_profiling

edges:
  - S35_case_card -> S36_auxiliary_signals -> S39_triage
  - S32_features -> S36_unsupervised_on_features
  - S34_metrics_P_at_k -> S36_scarce_label_eval

meta_leaks_open:
  - legacy_id_ai-apis-advanced_in_prose
  - path_V3_author_talk
  - retarget_callout_title
  - gate_V3_rubric
  - print-theater_ido_intro

factory_pattern_flags:
  - mechanism_contract_application_template: true
  - ethics_flags_in_code: true  # keep
  - policy_print_exercise_ratio: high  # reduce
  - platform_id_retheme_leak: systemic_S32_S37

hours:
  blueprint: 12
  product: 18
  recommendation: align_down_or_deepen

prior_auto_audit: ACCEPT
explorer_overrides_auto: true  # depth/meta not covered by auditor

comparer:
  better_than_external: ethics_review_queue_framing
  worse_than_external: algorithmic_depth_IF_LOF_kmeans_loop
```

**Shared risk:** Cleaning only S36 meta-leaks without a batch policy for S32–S37 will leave inconsistent learner experience (some sections still say «Id X conservado»). Recommend Fixer batch «legacy id prose strip» across phase-2 rethemes after per-section Explorers complete.

---

## Appendix A — Structure inventory (evidence)

| Block | Count | IDs / notes |
|-------|------:|-------------|
| Theory (map + topics) | 9 | Map + T1-A, T1-B, T2-A, T2-B, T3-A, T3-B, T4-A, T4-B |
| I Do demos | 8 | S36-T1-A-DEMO … S36-T4-B-DEMO |
| We Do exercises | 24 | `kind`: guided / independent / transfer |
| You Do | 1 | CP-N3-C señales |
| SelfCheck MCQ | 5 | anomaly, contamination, PCA, P@k, leakage |
| Resources docs | 6 | sklearn + statistics + Py4E |
| Resources books | 3 | ISLR, ESL, VanderPlas |
| Resources courses | 6 | CS229, Coursera ML, MIT, CS50P, StatQuest×2 |

## Appendix B — Issue count summary

| Class | Count |
|-------|------:|
| Registry issues (I01–I27) | 27 |
| Of which P0 | 0 |
| Of which P1 | 11 |
| Of which P2 | 12 |
| Of which P3 | 4 |
| Meta-leaks (M1–M6) | 6 |
| Proposed diff groups (A–O) | 15 |

**issue_count for sidecar:** 27 (registry); meta tracked separately.

---

This is the complete Explorer report for Section 36. Ready for the Fixer prompt.
