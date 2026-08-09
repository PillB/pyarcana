# S33 Explorer Report — ML supervisado y baselines responsables

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Platform section id (hash):** `advanced-models`  
**Live URL:** https://pillb.github.io/pyarcana/#advanced-models  
**Repo source:** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s33-advanced-models.ts`  
**Roadmap title (V3):** ML supervisado y baselines responsables  
**Date:** 2026-07-24  
**Scope rule:** Section 33 only — no content fixes applied.

**Pre-round research anchors (pedagogy + domain):**
- Google *Rules of ML* (baseline first, simple models, infrastructure before complexity; heuristics before opaque stacking).
- sklearn DummyClassifier / LogisticRegression / ensemble / GroupKFold docs (honest baselines, L2, controlled trees, entity-aware CV).
- ISL / Coursera Supervised ML (regularization, train–valid gap, interpretability before complexity).
- Gold-standard internal bar: `GOLD_STANDARD_CHECKLIST.md` (S01 prose depth, anti–print-theater, anti–template-soup) vs automated residual/PA ranks (explicitly *not* ground truth).

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | 33 |
| Id | `advanced-models` (legacy file id; V3 topic is supervised baselines) |
| Title | ML supervisado y baselines responsables |
| shortTitle | Baselines ML responsables |
| Phase / level | 2 · Competente a experto |
| estimatedHours | 18 |
| Capstone link | CP-N3-B (workbench baselines) · caso `CASO-LIM-033` |
| Upstream | S32 feature table without leakage |
| Downstream | S34 métricas/umbrales · S35 explainability · S39 Case Triage |
| Structure present | theory ×9 · iDo ×8 · weDo ×24 · youDo · selfCheck ×5 · resources |

**Live site check:** Curriculum card on https://pillb.github.io/pyarcana/ shows S33 as *Baselines ML responsables* with the honest-comparison tagline matching the TS source. Full in-app body is SPA-hydrated from the same section module; all evidence below is grounded in `s33-advanced-models.ts` (authoritative source for rendered content).

**In scope analyzed:** theory (all headings/paragraphs/code/callouts), jobRelevance, learningOutcomes, iDo (all demos), weDo (all 24 E1/E2/E3), youDo, selfCheck, resources.  
**Out of scope:** product UI chrome, other sections’ files, applying diffs.

---

## 2. Executive Summary of Quality

### Score: **5.5 / 10**

### Verdict
S33 has the **right product ethics and roadmap intent** (baseline-first, `needs_review_*` ≠ fraude, features from S32, group CV by entity, run logging with `beats_dummy`) and a **complete structural skeleton** (9 theory · 8 iDo · 24 weDo · youDo · 5 MCQ · solid external links). That is necessary but **not sufficient**.

Expert judgment against the gold bar (S01 depth, anti-theater rules, Google Rules of ML substance) finds:

1. **Developer meta-leakage** into learner-facing fields (`Id … conservado`, `V3`, `Id legacy`, rubric “gate V3”).
2. **Template soup:** nearly every theory block is *Concepto → Contrato entrada/error/criterio → Aplicación CASO-LIM* with thin mechanism teaching; every weDo is the same inverted-boolean gate drill.
3. **Print theater / demo bugs:** several demos hardcode results; **S33-T3-A-DEMO is fatally mismatched** (description/stump theory vs `under_sample` code).
4. **Learning-outcome misalignment:** outcomes promise training linear models, trees, CV and error analysis; We Do almost never *computes* dummy accuracy, L2, stump votes, or group CV — only schema predicates on pre-filled dicts.
5. **Responsible-ML anti-pattern in contracts:** T4-A treats `beats_dummy is True` as a PASS gate for a logged run — honest negative experiments would fail the “contract,” contradicting baseline-first culture.

Automated signals (`S33_AUDIT.json` ACCEPT, residual tier “gold”, PA rank 9.55) **overstate quality**; they measure structure and boilerplate, not pedagogical fidelity. Per `GOLD_STANDARD_CHECKLIST.md`, structural green alone is rejected as gold.

**Best of section:** ethical framing (queue priority ≠ guilt), progressive disclosure of sklearn APIs, resource list (DummyClassifier, Rules of ML, GroupKFold, MLflow), clear S32→S33→S34 chain.  
**Worst of section:** T3-A iDo code swap; 24× isomorphic contract exercises; meta/versioning prose; shallow theory vs 18h claim.

---

## 3. Detailed Issue Registry

Severity key: **P0** blocker / broken pedagogy · **P1** high learner harm · **P2** medium polish · **P3** low / optional.

| # | Severity | Location | Evidence (quote / summary) | Pedagogical impact |
|---|----------|----------|----------------------------|--------------------|
| I-01 | P1 | `jobRelevance` | `Id \`advanced-models\` conservado; V3 **ML supervisado y baselines responsables** (baseline del workbench CP-N3-B).` | Exposes curriculum versioning; confuses learners; not workplace framing like S01. |
| I-02 | P1 | Theory overview heading + P3 | Heading *“De modelos avanzados legado…”*; P3 *“Id legacy \`advanced-models\` se conserva”* | Meta-leak + legacy retarget narrative belongs in dossiers, not student theory. |
| I-03 | P0 | iDo `S33-T3-A-DEMO` | Description: stump thr=0.3 + majority vote; code is `under_sample` + hardcoded `majority 1` | **Broken I Do:** learner cannot observe the taught mechanism; trust collapse. |
| I-04 | P0 | Theory + weDo vs learningOutcomes | Outcomes: *“Entrenar modelos lineales… árboles… CV y análisis de errores”*; weDo only fixes inverted `meets_contract` / `assess` / `decide` booleans | Gradual release fails: We Do does not practice the skill named in outcomes. |
| I-05 | P1 | All theory subtopics P2 pattern | Repeated *“Contrato: entrada… Error:… Criterio:…”* + *“Aplicación a CASO-LIM-033”* | Template soup (gold anti-pattern #2); low mechanism teaching (sigmoid/L2/overfit *why*). |
| I-06 | P1 | Theory `baseline.py` | Cost hardcoded: `# lab fixture: 2 fp *1 + 1 fn *5` / `cost = 2 * c_fp + 1 * c_fn` | Print/lab theater: cost not derived from y vs predictions; under-teaches cost-sensitive baseline. |
| I-07 | P1 | Theory `tracking.py` + T4-A weDo | `print("beats_dummy", True)` hardcode; PASS requires `beats_dummy is True` | Contradicts responsible ML: runs that **fail** to beat dummy must still be logged and valid. |
| I-08 | P1 | iDo T3-B, T4-A, T4-B | Hardcoded `[1,0,4]`, `beats_dummy True`, `n_groups 3` without computing seed/groups | Print theater (gold anti-pattern #3); weakens I Do as cognitive model. |
| I-09 | P2 | Theory vs iDo gap thresholds | Theory `overfit(..., gap=0.2)`; iDo `gap=0.15` | Inconsistent contract; learner cannot reconcile “umbral”. |
| I-10 | P2 | Theory vs iDo mean_fold rounding | Theory `round(..., 3)` vs iDo `round(..., 2)` (same input luckily 0.65) | Fragile consistency; signals generated/templated code. |
| I-11 | P1 | weDo edgeCases (all 8 subtopics) | e.g. *“fixture adverso: target needs_review con horizonte y unit”* | **Copy-paste error:** describes the *valid* fixture as “adverso”; confuses hints/tests. |
| I-12 | P1 | weDo instructions E1–E3 ×8 | Near-identical shells differing only in field names / REJECT codes | Low transfer; E3 is structural clone of E2, not authentic transfer of ML skill. |
| I-13 | P2 | Theory headings T1–T4 | Lowercase *“unidad, target y horizonte”*, *“costos, baseline…”* | Redaction inconsistency vs title case elsewhere; weaker scannability. |
| I-14 | P2 | youDo rubric + portfolioNote | *“Alineación al gate V3 de la sección”*; *“Baseline first; portfolio: run log + group CV.”* | Meta “V3”; abrupt EN snippet in ES-PE course. |
| I-15 | P2 | youDo `starterCode` | `unit: None`, `baseline: None`, only `print(sorted(run.keys()))` | Near-empty scaffold (anti-stub #5/#6 risk); under-spec for 18h portfolio claim. |
| I-16 | P2 | Theory T2-A *“p≫n features”* | Notation `p≫n` without defining p vs n for LatAm audience | Cognitive load spike; easy to misread as probability p. |
| I-17 | P2 | Theory stump vs RF/boosting | Claims RF/boosting but only majority of stumps; no bagging/boosting distinction | Over-promises heading *“random forest/boosting”* relative to demo depth. |
| I-18 | P3 | selfCheck residual ledger | Residual claims `selfcheck_q: 4`; source has **5** questions | Audit tooling drift (not learner-facing); note for Graph Memory. |
| I-19 | P2 | Theory T1-B mentions rule `x>=thr` | Code never evaluates rule accuracy vs dummy | Incomplete dual-baseline lesson (dummy **and** rule). |
| I-20 | P2 | Connective tissue S32→S33 | Mentions *“features S32”* once; no worked bridge example using `shared_phone`/`amount_z` pipeline | Weak narrative bridge after leakage-safe features. |
| I-21 | P3 | Callouts | Uniform tip *“Contrato local”* with REJECT/REQUEST codes | Actionable but slogan-dense; little “what to type next” learner guidance. |
| I-22 | P2 | Comparative quality | vs S01: short paras, no dictionary, little workplace story; vs Google RoML: ethics OK, missing “launch without ML / simple first model” narrative depth | Section feels like gate DSL for CP-N3-B, not supervised ML lesson. |
| I-23 | P1 | Meta in weDo intro | *“S33 · Laboratorio baselines responsables (CP-N3-B): 24 retos. E1 repara predicado…”* | Exposes exercise-generation schema (E1/E2/E3 factory) to learner. |
| I-24 | P2 | iDo intro | *“S33 · Te muestro framing…”* prefix with section code | Mild meta; tone more lab-log than teacher voice of S01. |

---

## 4. Meta-Leak Report

Exact leaked / developer-facing strings that should not appear in student UI:

| # | Exact text | Location in `s33-advanced-models.ts` |
|---|------------|--------------------------------------|
| M-01 | `Id \`advanced-models\` conservado; V3 **ML supervisado y baselines responsables**` | `jobRelevance` |
| M-02 | `De modelos avanzados legado a baselines responsables` | theory[0].heading |
| M-03 | `Id legacy \`advanced-models\` se conserva` | theory[0].paragraphs[2] |
| M-04 | `Alineación al gate V3 de la sección` | youDo.rubric[0].criterion |
| M-05 | `S33 · Laboratorio … 24 retos. E1 repara predicado, E2 valida/adverso/missing, E3 fail-closed` | weDo.intro (factory schema leak) |
| M-06 | `S33 · Te muestro…` / `S33-T*-*` heavy ID clutter in intros | iDo.intro, exercise instructions (IDs OK for grading; factory language not) |
| M-07 | Comments `# DEFECT: …` in starterCode | All weDo starters — acceptable as lab defect markers if intentional; still reads as generator residue |

**No** classic “moved from section X”, TODO/FIXME/STUB, or AI chat logs found. Ethics language (fraude/parentesco) is **intentional product policy**, not meta-leak.

**meta_leak_count (strict learner-facing versioning/factory):** **5** core (M-01–M-05); M-06/M-07 optional style.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 I Do / We Do / You Do fidelity

| Phase | Expected | Observed | Verdict |
|-------|----------|----------|---------|
| **I Do** | Teacher models full skill with *why* | 8 demos exist; several theater; **T3-A wrong skill** | Fail partial |
| **We Do** | Guided repair → independent → transfer of *same skill* | 24 items are **boolean contract gates**, not ML computations | Fail alignment |
| **You Do** | Portfolio integrating framing+baseline+model+log+group CV | Thin starter; objectives right but under-scaffolded | Weak pass |
| **selfCheck** | Active recall of key ideas | 5 MCQs well-aligned to ethics/baseline/scaling/group CV | Pass |

Gradual release is **structurally present, functionally hollow**: the skill practiced in We Do is “fix inverted predicate on a dict,” not “compare dummy vs logistic under cost and group CV.”

### 5.2 Cognitive load & progressive disclosure

**Strengths:** Avoids dumping full sklearn APIs too early; pure-Python sigmoid/stump/seed keeps dependency surface small; S34 reserved for metrics/thresholds (good sequencing).

**Weaknesses:**
- Dual load of **product gate DSL** (`REJECT_*`, `REQUEST_*`) *and* ML concepts without enough worked math intuition.
- Template monotony increases **extraneous load** (Sweller): learners spend working memory on shell identity, not on baselines.
- `p≫n`, L2 as sum of squares without linking to penalty term in loss, RF/boosting name inflation.

### 5.3 Connective tissue & narrative flow

- Overview correctly orders T1 framing → T2 linear → T3 trees → T4 experiment.
- S32 features referenced; CP-N3-B / Red Andina / CASO-LIM-033 give situative context.
- Missing: short story of a *failed* ML launch that lost to dummy (Rules of ML #1/#4), and a single end-to-end numeric comparison table (dummy acc vs stump vs logistic) as narrative spine.
- Early gold S01 uses workplace Peru story + dictionary; S33 opens with **legacy rename** story — wrong emotional register for learners.

### 5.4 Grammar & redaction (ES-PE)

- Prose is largely correct technical Spanish with acceptable industry English terms (baseline, dummy, seed, stump).
- Issues: lowercase headings; anglicism *“overfittea”* (colloquial, OK if consistent); mixed EN portfolio note; dense telegraphic style vs S01 complete sentences.
- No major orthography disasters found.

### 5.5 Exercise & exam quality

**weDo pattern (all 8 subtopics):**
- E1: invert boolean on complete valid record → `S33-Tx-Y PASS`
- E2: valid / adverse / missing field → `PASS REJECT_* MISSING:*`
- E3: continue / reject / request → `CONTINUE REJECT_* REQUEST_*`

This is a solid **fail-closed product contract** pattern for later triage, but **mis-sited as the sole practice for supervised ML**. Transfer (E3) reuses the same three fixtures as E2 with different return tokens — not transfer of stump depth, L2, or group CV calculation.

**selfCheck:** Fair, non-trivial enough; supports ethics and baseline-first. Option noise (e.g. “solo deep learning”) is acceptable. No SHAP dependency in correct answers (good progressive disclosure).

### 5.6 Consistency with roadmap / neighbors

| Neighbor | Expectation | Status |
|----------|-------------|--------|
| S32 | Features without leakage feed S33 | Mentioned; no hands-on reuse |
| S34 | Metrics, imbalance, thresholds | Appropriately deferred |
| S35 | Explainability / fairness | Coefs + `causal=False` preview OK |
| CP-N3-B | Baseline workbench | Theme consistent; implementation shallow |

Legacy id `advanced-models` vs title is roadmap-correct but must not leak as student prose.

### 5.7 External comparison (best-in-class)

| Source | Alignment | Gap in S33 |
|--------|-----------|------------|
| Google Rules of ML | Baseline/heuristics first, simple model, metrics | Little narrative of *when not to use ML*; complexity gates without infra story |
| sklearn DummyClassifier | Documented in resources | Never used in runnable demos (stdlib majority is fine, but link not exercised) |
| ISL / Ng Supervised ML | Logistic + regularization + train/valid | Mechanism thin; no residual/plot intuition |
| Coursera / deeplearning.ai | Progressive math + coding labs | Labs here are schema predicates |
| S01 PyArcana gold | Deep ES-PE teaching voice | S33 is contract DSL voice |

### 5.8 Domain correctness notes

- Sigmoid(0)=0.5, pred_at(0.2)→0: correct.
- L2 as Σw² for [1,2]=5: correct as squared L2 (should name “norma L2 al cuadrado” to avoid confusion with √Σw²).
- majority_vote for [1,0,1]→1: correct.
- Group CV rationale: correct and important for entity pairs.
- **Wrong:** requiring `beats_dummy is True` for a valid logged run.
- **Wrong:** T3-A demo content.
- Prevalencia mentioned in theory but never computed in code (missed teachable moment).

---

## 6. Proposed GitHub-style Diffs

> Do **not** apply in this Explorer run. Paths relative to repo root.

### Diff A — Strip meta from `jobRelevance` (I-01, M-01)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@
   jobRelevance:
-    "Un workbench serio **no reemplaza** reglas claras por un modelo opaco sin baseline. Id `advanced-models` conservado; V3 **ML supervisado y baselines responsables** (baseline del workbench CP-N3-B). Predicción de prioridad de revisión ≠ etiqueta de fraude.",
+    "Un workbench serio **no reemplaza** reglas claras por un modelo opaco sin baseline. En equipos de datos en LatAm (banca, fintech, ops de riesgo), primero se documenta un **baseline** (dummy o regla) y costos de FP/FN de cola; solo entonces se prueba si un modelo supervisado mejora la **prioridad de revisión**. Predicción de cola ≠ etiqueta de fraude ni de parentesco. Capstone de referencia: workbench CP-N3-B con datos sintéticos.",
```

### Diff B — Overview theory without legacy meta (I-02, M-02/M-03)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@
     {
-      heading: "De modelos avanzados legado a baselines responsables",
+      heading: "Por qué baselines antes de modelos opacos",
       paragraphs: [
         "Esta sección **no** empuja stacking por deporte: define **unidad de scoring**, **target** y **horizonte**, y conserva un **baseline determinista** (dummy/regla) antes de cualquier modelo opaco en el workbench de Red Andina (CP-N3-B).",
         "Producto incremental: comparación **honesta** dummy/regla vs lineal/árbol sobre target sintético `needs_review_7d`. Entrada: features S32; salida: métricas y decisión `beats_dummy` — **sin** label de fraude ni parentesco.",
-        "Orden: **T1 framing** → **T2 lineales** → **T3 árboles** → **T4 experimento**. Id legacy `advanced-models` se conserva; progressive disclosure evita APIs no enseñadas aún. Predicción de prioridad de revisión ≠ veredicto de culpa."
+        "Orden: **T1 framing** → **T2 lineales** → **T3 árboles** → **T4 experimento**. Usamos Python estándar (sigmoid, stump, seed) antes de APIs pesadas; en recursos quedan sklearn y Rules of ML. Predicción de prioridad de revisión ≠ veredicto de culpa."
       ],
```

### Diff C — Fix fatal iDo T3-A demo (I-03)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@
         description: "Stump thr=0.3 y majority vote de tres predictores débiles.",
         code: {
           language: 'python',
           title: "stump_demo.py",
-          code: `def under_sample(y, keep_neg=1):
-    pos = [i for i, v in enumerate(y) if v == 1]
-    neg = [i for i, v in enumerate(y) if v == 0][:keep_neg]
-    return [y[i] for i in sorted(pos + neg)]
-
-print(under_sample([1, 0, 0, 0], 1))
-print("majority", 1)
-print("ok", True)`,
-          output: `[0, 1]
+          code: `def stump_preds(X, thr):
+    return [int(x >= thr) for x in X]
+
+def majority_vote(votes):
+    return int(sum(votes) >= (len(votes) + 1) // 2)
+
+print("stump", stump_preds([0.1, 0.4], 0.3))
+print("majority", majority_vote([1, 0, 1]))
+print("depth_unlimited", False)`,
+          output: `stump [0, 1]
 majority 1
-ok True`,
+depth_unlimited False`,
```

Ready-to-paste body (must match theory `stump.py`):

```python
def stump_preds(X, thr):
    return [int(x >= thr) for x in X]

def majority_vote(votes):
    return int(sum(votes) >= (len(votes) + 1) // 2)

print("stump", stump_preds([0.1, 0.4], 0.3))
print("majority", majority_vote([1, 0, 1]))
print("depth_unlimited", False)
```

### Diff D — Honest cost in theory baseline (I-06, I-19)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@
-        code: `def dummy_and_cost(y, c_fp=1, c_fn=5):
-    maj = max(set(y), key=y.count)
-    dummy = [maj] * len(y)
-    acc = sum(a == b for a, b in zip(y, dummy)) / len(y)
-    # lab fixture: 2 fp *1 + 1 fn *5
-    cost = 2 * c_fp + 1 * c_fn
-    return round(acc, 3), cost
-
-acc, cost = dummy_and_cost([1, 1, 0])
-print("dummy_acc", acc)
-print("cost", cost)
-print("has_baseline", True)`,
+        code: `def dummy_and_cost(y, pred, c_fp=1, c_fn=5):
+    maj = max(set(y), key=y.count)
+    dummy = [maj] * len(y)
+    acc = sum(a == b for a, b in zip(y, dummy)) / len(y)
+    cost = 0
+    for yt, yp in zip(y, pred):
+        if yp == 1 and yt == 0:
+            cost += c_fp
+        if yp == 0 and yt == 1:
+            cost += c_fn
+    return round(acc, 3), cost, True
+
+# regla simple x>=1 sobre x=[1,1,0] → pred [1,1,0]; y=[1,1,0]
+acc, cost, has_baseline = dummy_and_cost([1, 1, 0], [1, 1, 0])
+print("dummy_acc", acc)
+print("cost", cost)
+print("has_baseline", has_baseline)`,
```

*(Adjust expected `output` to match computed cost for the chosen pred vector; include a deliberate FP/FN example in narrative.)*

### Diff E — Log runs even when dummy wins (I-07)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ theory tracking.py
-print("beats_dummy", True)`,
+beats = metrics["accuracy"] > 0.667  # dummy_acc documentado
+print("beats_dummy", beats)`,
@@ T4-A solution predicate (conceptual)
-meets_contract = bool(record["metrics"]) and record["beats_dummy"] is True and bool(record["run_id"])
+meets_contract = (
+    bool(record["metrics"])
+    and "beats_dummy" in record
+    and bool(record["run_id"])
+)
+# beats_dummy may be False: el run sigue siendo válido si está logueado
```

Also rewrite T4-A invalid fixture to empty metrics / missing run_id, **not** `beats_dummy: False`.

### Diff F — Remove print theater in iDo T3-B / T4-B (I-08)

```diff
--- a/src/lib/course/sections/s33-advanced-models.ts
+++ b/src/lib/course/sections/s33-advanced-models.ts
@@ S33-T3-B-DEMO
-          code: `def overfit(train_acc, valid_acc, gap=0.15):
+          code: `import random
+
+def overfit(train_acc, valid_acc, gap=0.2):
     return (train_acc - valid_acc) > gap
 
+def seeded_ints(seed, n=3):
+    random.seed(seed)
+    return [random.randint(0, 9) for _ in range(n)]
+
 print("overfit", overfit(0.95, 0.70))
-print([1, 0, 4])
-print("ok", True)`,
+print(seeded_ints(42))
+print("seed", 42)`,
@@ S33-T4-B-DEMO
-print(mean_fold([0.6, 0.7, 0.65]))
-print("n_groups", 3)
-print("ok", True)`,
+print("mean", mean_fold([0.6, 0.7, 0.65]))
+print("n_groups", len(set(["e1", "e1", "e2", "e3"])))
+print("random_leak_ok", False)`,
```

Align `mean_fold` rounding with theory (`round(..., 3)`).

### Diff G — Unify overfit gap (I-09)

```diff
-def overfit(train_acc, valid_acc, gap=0.15):
+def overfit(train_acc, valid_acc, gap=0.2):
```

(in all demos/theory that teach the same gate)

### Diff H — Fix edgeCases copy-paste (I-11) — apply per subtopic

Example for T1-A:

```diff
-        edgeCases: ["falta horizon", "fixture adverso: target needs_review con horizonte y unit", "CASO-LIM-033-1A es sintético"],
+        edgeCases: ["falta horizon", "fixture adverso: target is_fraud (nombre prohibido)", "CASO-LIM-033-1A es sintético"],
```

Pattern for all eight: adverse description must name the **breach** condition (no baseline, l2==0, depth_unlimited, random_split, etc.), not the happy path.

### Diff I — weDo intro without factory schema (I-23, M-05)

```diff
-    intro: "S33 · Laboratorio baselines responsables (CP-N3-B): 24 retos. E1 repara predicado, E2 valida/adverso/missing, E3 fail-closed con CASO-LIM-033.",
+    intro: "Practicamos baselines responsables del workbench CP-N3-B con el caso sintético CASO-LIM-033. En cada tema: primero reparas el contrato, luego modelas rutas válido/adverso/faltante, y al final aplicas fallo cerrado (continuar / rechazar / pedir evidencia).",
```

### Diff J — youDo rubric + starter (I-14, I-15)

```diff
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Framing unit/target/horizon + baseline dummy/regla documentados", weight: "25%" },
@@
-    portfolioNote:
-      "Baseline first; portfolio: run log + group CV.",
+    portfolioNote:
+      "Primero baseline; el portafolio debe incluir run log (params/metrics/beats_dummy) y group CV por entidad.",
@@ starterCode (sketch)
-run = {"unit": None, "target": "needs_review_7d", "baseline": None, "metrics": {}}
-# Contrato de theory/iDo documentado (sin stubs)
-if __name__ == "__main__":
-    print(sorted(run.keys()))
+"""Scaffold mínimo: completa frame_task, dummy_and_cost, un modelo (logística o stump),
+log de run y n_groups. Datos sintéticos only; seed fija."""
+y = [1, 1, 0, 0]
+features = [0.1, 0.4, 0.2, 0.05]  # score sintético
+# TODO estudiante: unit/target/horizon, baseline, modelo, metrics, entities
+if __name__ == "__main__":
+    print("complete framing + baseline + run log")
```

### Diff K — Deepen at least one theory mechanism block (I-05 sample for T2-A)

```diff
       paragraphs: [
-        "La **logística** con sigmoid y regularización **L2** limita coeficientes grandes cuando hay muchas features de S32. Un **umbral** convierte probabilidad en **priorización de cola**, no en veredicto de fraude.",
-        "Contrato: entrada `w`, `b`, `x`, `thr`; salida `p` y `pred`. Error: modelo sin regularización cuando `p≫n` features. Criterio: penalty L2 **reportada** en el log del experimento.",
-        "Aplicación a `CASO-LIM-033`: `sigmoid(0)=0.5`; `w=1,b=0,x=0.2 thr=0.5` → pred 0; L2 de `w=[1,2]` es 5."
+        "La **regresión logística** modela P(y=1|x) con la **sigmoid** σ(z)=1/(1+e^{-z}), z=w·x+b. Sirve como primer modelo **interpretable** del workbench: cada feature de S32 aporta un peso, no una caja negra. La regularización **L2** (penalizar Σw²) evita coeficientes enormes cuando hay muchas features y pocas filas etiquetadas.",
+        "Si el número de features es grande frente al de ejemplos (notación: muchas columnas, pocas filas), un modelo sin penalización memoriza ruido. Reporta la penalty L2 en el log. El **umbral** thr convierte probabilidad en **prioridad de cola** (revisar sí/no), nunca en veredicto de fraude.",
+        "En `CASO-LIM-033`: σ(0)=0.5; con w=1, b=0, x=0.2 y thr=0.5 la pred es 0. La penalización L2 de w=[1,2] como Σw² es 5 (norma al cuadrado). Compara siempre accuracy/costo contra el dummy de T1-B antes de celebrar el modelo."
       ],
```

### Diff L — Heading capitalization (I-13)

```diff
-      heading: "unidad, target y horizonte",
+      heading: "Unidad, target y horizonte",
```
*(Repeat sentence case for all eight subtopic headings.)*

### Diff M — Strategic weDo content shift (I-04) — *one subtopic example*

Replace pure boolean E1 for T1-B with a **compute** defect (guided):

```diff
# Starter DEFECT: dummy majority wrong (uses min instead of max)
def dummy_acc(y):
    maj = min(set(y), key=y.count)  # DEFECT
    return round(sum(v == maj for v in y) / len(y), 3)
# Student fixes to max(...); prints S33-T1-B PASS when acc matches 0.667 on [1,1,0]
```

Keep E2/E3 fail-closed routes, but seed them from **computed** fields, not only pre-baked dict flags. Apply same philosophy to T2-A (compute sigmoid+L2), T3-A (stump preds), T4-B (n_groups from entities).

### Diff N — Theory T3-A heading honesty (I-17)

```diff
-      heading: "decisiones y random forest/boosting",
+      heading: "Stumps, voto y ensambles controlados",
```
Explain RF/boosting as *family names* deferred to depth limits + later sections, while teaching stump+vote now.

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Rationale |
|----------|-----------|-----------|
| **1 · P0** | I-03 (T3-A demo) | Broken demonstration; fix in minutes; blocks trust. |
| **2 · P0/P1** | I-04, Diff M (weDo teach ML ops) | Outcomes vs practice gap; largest learning impact. |
| **3 · P1** | I-07 (beats_dummy gate) | Fixes anti-pattern in “responsible” tracking. |
| **4 · P1** | I-01, I-02, I-14, I-23 (meta-leaks) | Student-facing redaction; quick string edits. |
| **5 · P1** | I-06, I-08, I-19 (theater) | Make demos compute from inputs. |
| **6 · P1** | I-11 (edgeCases) | Bulk wrong adverse labels. |
| **7 · P1/P2** | I-05, Diff K (theory depth) | At least T1–T2 mechanism paragraphs to S01-class. |
| **8 · P2** | I-09, I-10 (consistency) | gap/rounding alignment. |
| **9 · P2** | I-13, I-15, I-16, I-17, I-20–I-22 | Polish, youDo scaffold, narrative bridge. |
| **10 · P3** | I-18, I-21, I-24 | Tooling notes / callout voice. |

**Suggested Fixer batching:**
1. Hotfix demos + meta strings (Diffs A–C, F–G, I, L).  
2. Contract truthfulness (Diffs D–E, H).  
3. Pedagogical depth (Diffs K, M, N + youDo J).  
4. Re-score with human rubric (not residual “gold”).

---

## 8. Graph Memory Update Notes

For shared context (`GRAPH_MEMORY.json` / summary / residual):

```yaml
section: 33
id: advanced-models
file: s33-advanced-models.ts
explorer_score: 5.5
explorer_status: complete
structural_completeness: high   # 9/8/24/youDo/5MCQ/resources
pedagogical_fidelity: low-medium
meta_leaks:
  - jobRelevance V3/id conservado
  - theory legacy heading + Id legacy sentence
  - youDo rubric gate V3
  - weDo intro E1/E2/E3 factory language
critical_bugs:
  - S33-T3-A-DEMO code is under_sample not stump/majority
anti_patterns_hit:
  - template_contrato_triplet
  - print_theater
  - boolean_gate_weDo_not_domain_skill
  - beats_dummy_True_required_for_valid_run
edges:
  - S32_features -> S33_baselines (mentioned, weak hands-on)
  - S33_baselines -> S34_metrics_thresholds (appropriate deferral)
  - S33_ethics -> CP-N3-B / S39_triage (consistent)
do_not_trust:
  - residual_ledger tier gold / score 10 for S33
  - S33_PARAGRAPHS.md uniform 9.55 ranks
  - S33_AUDIT.json high_issue_count 0 as pedagogical oracle
  - residual selfcheck_q: 4 (actual 5)
fixer_entrypoints:
  - demoId S33-T3-A-DEMO
  - jobRelevance + theory[0]
  - weDo edgeCases all
  - T4-A meets_contract beats_dummy
next_explorer_hint: S34 should be checked for same DEFECT-template isomorphism
```

**Competitive research edge (for dossiers):** Google Rules of ML #1/#4/#14 (heuristic/baseline, simple first model, interpretable linear/logistic) strongly support S33 intent but require deeper theory + computational labs, not only REJECT gates.

---

## Issue count summary

| Category | Count |
|----------|-------|
| Registry issues (I-01…I-24) | **24** |
| Core meta-leaks (M-01…M-05) | **5** |
| P0 | 2 (I-03, I-04) |
| P1 | 10 |
| P2 | 10 |
| P3 | 2 |

---

This is the complete Explorer report for Section 33. Ready for the Fixer prompt.
