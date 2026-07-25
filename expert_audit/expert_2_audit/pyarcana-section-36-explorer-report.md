# PyArcana Explorer Report — Section 36

## 1. Section Identification & Scope

**Section:** 36 — *Clustering, anomalías y validación temporal*  
**Public route:** `/#ai-apis-advanced`  
**Canonical source:** `src/lib/course/sections/s36-ai-apis-advanced.ts`  
**Declared level:** Competente a experto  
**Estimated duration:** 19 hours  
**Project role:** Auxiliary unsupervised signals for CP-N3-C, later integrated into responsible case triage.

The audit covered only Section 36:

- eight theory subtopics;
- eight I Do demonstrations;
- 24 E1/E2/E3 exercises;
- the integrated You Do project and rubric;
- seven public self-check questions;
- notes, callouts and learning resources;
- meta-text and authoring leakage;
- alignment with Sections 35, 37 and 39;
- alignment with the authoritative 52-section roadmap.

No repository content was modified.

---

## 2. Executive Summary of Quality

### Overall score: **5.2/10**

**Verdict:** Ethically strong and structurally complete, but not technically ready for an expert-level release.

Section 36 has a strong responsible-use spine. It consistently distinguishes geometric rarity from wrongdoing, uses synthetic data, routes consequential flags to humans, and connects coherently to the CP-N3-C case-triage project.

Its central weakness is that several simplified demonstrations are presented under the names of professional machine-learning methods while omitting defining mechanics:

- the “PCA toy” is a fixed weighted sum, not PCA;
- the DBSCAN-style `min_samples` convention differs from scikit-learn without disclosing it;
- equal selected `k` values are treated as multi-seed stability without comparing fitted partitions;
- the Isolation Forest example is one hand-authored path through fixed cuts rather than an ensemble;
- LOF receives no executable demonstration;
- temporal leakage detection checks only exact month duplication rather than chronological ordering.

The section satisfies the numerical curriculum contract—eight demos and 24 exercises—but not the intended fading-and-transfer contract. Most activities are tightly specified defect-repair tasks with exact outputs and formula-level hints. The You Do starter already contains most of the solution. The public self-check has seven questions, although the roadmap requires one item for each of eight subtopics.

| Dimension | Score | Verdict |
|---|---:|---|
| Responsible-use framing | 9.3 | Excellent |
| Roadmap continuity | 7.6 | Strong |
| Narrative coherence | 6.4 | Clear macro-order, overloaded locally |
| Technical correctness | 4.1 | Major algorithmic inaccuracies |
| I Do / We Do / You Do fidelity | 5.0 | Correct counts, weak fading |
| Exercises and project | 4.3 | Extensive but repetitive and pre-solved |
| Assessment alignment | 3.8 | Missing one subtopic item |
| Peruvian Spanish redaction | 5.7 | Understandable, excessive code-switching |
| **Overall** | **5.2** | Major revision required |

The ethical policy should be preserved almost intact. The technical core, practice architecture and assessment need substantial revision around genuine estimator behaviour.

---

## 3. Detailed Issue Registry

### 1. The “PCA toy” is not PCA
**Severity: High**

The section defines the projection as:

```python
pc = w0 * x + w1 * y
```

and calculates a weight-share ratio while explicitly admitting that the weights are not real eigenvectors.

A fixed weighted sum is a linear projection, not principal-component analysis unless the weights were learned as principal axes from centred data. The learner can complete all “PCA” work without learning fitting, transformation, learned components, explained variance, loadings or training-only preprocessing.

**Impact:** The learner recognises PCA vocabulary without acquiring an operational PCA model.

---

### 2. DBSCAN `min_samples` is off by one relative to scikit-learn
**Severity: High**

The implementation subtracts the sample itself and then compares the number of other neighbours with `min_samples`:

```python
n_nb = sum(1 for y in xs if abs(x - y) <= eps) - 1
core.append(n_nb >= min_samples)
```

Scikit-learn’s `min_samples` includes the point itself. The course’s `min_samples=2` therefore behaves like scikit-learn `min_samples=3`.

The toy also teaches only a core-point mask. It omits border points, noise labels, density reachability and cluster expansion.

**Impact:** Parameters do not transfer correctly to the professional API, and learners may believe that core detection alone implements DBSCAN.

---

### 3. Empty k-means clusters receive a fabricated centroid of `0.0`
**Severity: High**

The helper returns:

```python
return [centroid_1d(g) if g else 0.0 for g in groups]
```

An empty cluster should preserve the previous centroid, be reinitialised according to a documented policy, or raise an explicit condition. Inserting `0.0` invents a location unrelated to the data.

**Impact:** The lesson normalises silent arbitrary imputation inside an iterative algorithm.

---

### 4. “Multi-seed stability” is not actually measured
**Severity: High**

The section defines stability as:

```python
stable = k_a == k_b
```

Two runs choosing the same number of clusters do not necessarily produce the same partition. Stability requires fitting actual runs and comparing assignments, inertia or centroid locations. A permutation-invariant measure such as adjusted Rand index is appropriate.

**Impact:** Learners practise dictionary lookup rather than model validation.

---

### 5. Stdlib micro-toys are misaligned with the declared level
**Severity: High**

The section is marked “Competente a experto,” yet a learner can finish it without fitting:

- `KMeans`;
- `DBSCAN`;
- `PCA`;
- `IsolationForest`;
- `LocalOutlierFactor`.

Transparent micro-examples are useful as pretraining, but the section rarely completes the bridge to real estimators, diagnostics and validation.

**Impact:** The lesson under-assesses the professional competence promised by the roadmap.

---

### 6. Isolation Forest and LOF are materially under-taught
**Severity: High**

The Isolation Forest “idea” uses one fixed list of cuts:

```python
cuts = [15, 30, 40]
```

Actual Isolation Forest uses many random isolation trees and averages path behaviour. LOF is discussed in prose but receives no executable model or exercise.

**Impact:** The learner memorises “short path means rarer” without learning the estimator lifecycle or local-density comparison.

---

### 7. The sigma-rule detector is one-sided without a declared one-sided contract
**Severity: High**

The canonical rule flags only:

```python
x > mu + z * sd
```

A very low observation is never flagged. A one-sided rule can be valid for an explicitly upper-tail business requirement, but the section speaks generically about rare observations.

**Impact:** Learners may believe that 3σ anomaly detection is inherently upper-tail only.

---

### 8. Novelty and outlier detection are reduced to a z-score label
**Severity: High**

A transfer exercise defines:

```python
kind = "novelty" if z > 3 else "in_distribution"
```

Novelty is a deployment regime: fit a normality model on a reference set and score unseen observations. Outlier detection permits contaminated training data. For LOF, novelty mode also changes the API.

**Impact:** The lesson teaches terminology rather than the operational distinction.

---

### 9. `contamination` is treated as an exact flagged count
**Severity: Medium–High**

The section uses:

```python
expected_flags = int(n * contamination)
```

as though it were the number the estimator will certainly flag. Numeric contamination is a threshold-setting assumption, not a universal exact-count guarantee. The helper also lacks a legal-range guard.

**Impact:** The section correctly rejects “contamination = fraud prevalence” but replaces it with another oversimplification.

---

### 10. Temporal leakage detection is logically insufficient
**Severity: Critical**

The helper is:

```python
def has_leakage(train_months, test_month):
    return test_month in train_months
```

This catches exact duplication but not future data in the training set. For example, training on March while testing February returns `False`.

The project also does not clearly enforce training-only fitting of preprocessing parameters.

**Impact:** A gate-level requirement can certify a leaking experiment as clean.

---

### 11. `precision_at_k` is under-guarded and semantically misnamed
**Severity: High**

The function divides by `k` even when `k` is greater than the number of judged items. The binary target is defined as “the reviewer said it helped,” which is an operational utility judgement rather than necessarily predictive relevance.

A better name is `review_utility_at_k` unless a formal relevance protocol is defined.

**Impact:** Learners may report subjective helpfulness as predictive precision.

---

### 12. The PCA/visualisation topic contains no actual visualisation
**Severity: Medium**

The code prints projected values but produces no scatter plot, scree plot, loading plot or accessible equivalent table.

**Impact:** Students practise arithmetic rather than visual diagnosis and interpretation.

---

### 13. I Do demonstrations show outputs but insufficient expert reasoning
**Severity: Medium**

The demos rarely model:

- why an algorithm is appropriate;
- assumptions;
- alternative explanations;
- falsifying diagnostics;
- stop conditions;
- the fit window;
- deployment limits.

**Impact:** Learners see code execution, not enough professional judgement.

---

### 14. E1/E2/E3 meets the count contract but not fading and transfer
**Severity: High**

Most E2 and E3 activities still provide exact formulas, inputs, outputs and near-solution hints. Several “transfer” tasks merely vary constants.

**Impact:** Students become proficient at repairing author-selected defects, not diagnosing new unsupervised-learning problems.

---

### 15. “Tests” are output descriptions and `ok True` prints
**Severity: High**

Many exercise records say only that output must match the solution and print:

```python
print("ok", True)
```

without executable assertions.

Declared edge cases—empty groups, invalid contamination, future months, ties, `k > len(ranked)`—are frequently not tested.

**Impact:** Hard-coded output can pass without satisfying the contract.

---

### 16. The You Do project is already substantially solved
**Severity: High**

The starter already implements scaling, clustering helpers, projection, sigma flags, path length, temporal fitting, leakage checking and P@k.

**Impact:** The independent phase does not establish the ability to construct a pipeline independently.

---

### 17. The public assessment has seven items instead of eight
**Severity: High**

The quiz covers anomaly meaning, contamination, PCA, sparse labels, temporal leakage, path length and density core. It lacks a dedicated item for choosing `k` or evaluating cluster stability.

**Impact:** A learner can pass without demonstrating one entire subtopic.

---

### 18. The opening glossary and code-switching create unnecessary load
**Severity: Medium**

The first paragraph front-loads almost all of the section’s vocabulary and repeatedly mixes Spanish with unmanaged English:

- `features`;
- `scale`;
- `density`;
- `seed`;
- `review`;
- `flaggear`;
- `fit`;
- `labels ralos`;
- `toy`;
- `guilt`.

**Impact:** Reading effort rises before learners have concrete representations for the concepts.

---

### 19. Two authoring-process notes leaked into learner-facing prose
**Severity: Medium**

Leaked text:

> “Stack didáctico: stdlib (`statistics`, listas) para progressive disclosure…”

and:

> “Cada starter tiene un defect real … no un TODO vacío.”

These describe content-generation decisions rather than the learner’s task.

**Impact:** They break immersion and expose internal quality-control language.

---

### 20. Resources are broad but not precise enough for the main defects
**Severity: Medium**

The list lacks direct references for:

- `TimeSeriesSplit`;
- preprocessing leakage;
- k-means stability;
- exact DBSCAN semantics;
- LOF novelty restrictions;
- sparse-review annotation uncertainty.

**Impact:** The bibliography does not directly support several high-risk technical contracts.

---

## 4. Meta-Leak Report

### ML-36-01

**Exact text**

> “Stack didáctico: **stdlib** (`statistics`, listas) para progressive disclosure; sklearn se cita como referencia profesional sin exigir la librería en ejercicios.”

**Location:** introductory theory map.

**Classification:** Authoring rationale exposed to learners.

**Recommended action:** Replace it with a learner-centred progression statement: inspect a transparent mechanism first, then fit and compare real estimators.

### ML-36-02

**Exact text**

> “Cada starter tiene un defect real (fórmula o contrato), no un TODO vacío.”

**Location:** We Do introduction.

**Classification:** Internal content-quality rule exposed to learners.

**Recommended action:** Delete the comparison with TODO placeholders and describe only the learner action.

### Structural residue

The source still uses:

- `s36-ai-apis-advanced.ts`;
- `id: "ai-apis-advanced"`.

This does not match the actual section topic. Any rename should preserve existing bookmarks and local progress through a backward-compatible alias.

No hidden AI prompt, “moved from Section X,” unresolved TODO or FIXME was identified beyond the two confirmed leaks.

---

## 5. Pedagogical & Redaction Deep Dive

### Narrative graph

The macro progression is strong:

```text
S35: explanations, fairness and uncertainty
  ↓
S36: unsupervised auxiliary signals
  ↓
S37: profiling and performance
  ↓
S39: integrated responsible case triage
```

The internal concept graph is coherent in name:

```text
Scaling
  ├─ clustering
  ├─ PCA
  └─ distance-sensitive anomaly methods

Clustering
  ├─ choice of k
  ├─ stability
  └─ metric limitations

Anomaly scoring
  ├─ reference distribution
  ├─ novelty vs outlier
  ├─ contamination and capacity
  └─ human review

Time
  ├─ historical fit
  ├─ future scoring
  ├─ window stability
  └─ sparse-label evaluation
```

The main problem is semantic graph integrity: several labels point to weaker implementations than the terms imply.

### I Do

Strengths:

- eight demos;
- small inspectable inputs;
- runnable examples;
- consistent safety invariant;
- explicit failure modes.

Weaknesses:

- insufficient expert think-aloud;
- little algorithm selection;
- weak assumption checking;
- few diagnostics;
- no real-estimator bridge.

Recommended pattern:

```text
transparent mechanism
→ real estimator
→ diagnostic
→ failure case
→ review-use decision
```

### We Do

The section has 24 exercises, but the gradient is too flat:

```text
E1: repair a stated defect
E2: repair a similar stated defect
E3: repair another stated defect
```

A stronger gradual release is:

```text
E1: complete a worked process
E2: locate and explain the defect
E3: choose the method, implement it, test it and justify limits
```

### You Do

The rubric is strong, but the starter is nearly complete. A credible 19-hour deliverable should produce:

```text
s36-signals/
├── README.md
├── pyproject.toml
├── data/
│   ├── synthetic_events.csv
│   └── data_contract.md
├── src/
│   ├── clustering.py
│   ├── anomalies.py
│   ├── temporal_eval.py
│   └── review_metrics.py
├── tests/
├── artifacts/
│   ├── cluster_stability.csv
│   ├── pca_loadings.csv
│   ├── temporal_backtest.csv
│   ├── review_queue.csv
│   └── reviewer_annotations.csv
├── figures/
│   ├── clusters.png
│   ├── pca_projection.png
│   └── flag_rate_by_window.png
└── SIGNAL_CARD.md
```

### Assessment alignment

The alignment gap is:

```text
Outcomes: fit, compare, evaluate, validate
Practice: calculate, repair, print
Assessment: recognise and select definitions
```

The assessment should include code diagnosis, computation and decision-making rather than mostly recognition.

### Cognitive load

The section combines:

```text
High terminology load
+
Low authentic reasoning demand
=
Vocabulary recognition without robust schemas
```

Vocabulary should be introduced immediately before its first worked example.

### Peruvian Spanish redaction

Recommended terminology:

| Current wording | Recommended wording |
|---|---|
| features | características (*features*) |
| scale | escalamiento / estandarización |
| density | basado en densidad |
| seed | semilla aleatoria |
| score | puntuación |
| review | revisión |
| flaggear | marcar / señalar |
| fit | ajustar / `fit()` |
| train | conjunto histórico de entrenamiento |
| future | periodo futuro / evaluación |
| labels ralos | etiquetas escasas |
| toy | ejemplo simplificado |
| bool | valor booleano |

### Safety and human factors

Preserve:

- anomaly does not equal misconduct;
- synthetic data;
- no automatic sanctions;
- human review;
- capacity-aware queues.

Strengthen with:

- reviewer roles;
- evidence packets;
- annotation protocol;
- disagreement handling;
- appeal and override;
- sampling of unflagged cases;
- automation-bias monitoring.

A printed `human_in_loop=True` is not evidence of a functioning review process.

---

## 6. Proposed GitHub-Style Diffs

These are proposals only and were not applied.

### Diff 1 — Remove authoring leaks

```diff
- "Caso Red Andina ... Stack didáctico: stdlib ... progressive disclosure ..."
+ "Caso Red Andina ... Primero inspeccionarás mecanismos pequeños y
+ transparentes; después ajustarás y compararás los estimadores
+ profesionales equivalentes."

- intro: "... Cada starter tiene un defect real ... no un TODO vacío ..."
+ intro: "E1 completa un proceso guiado, E2 retira parte del apoyo y
+ E3 transfiere el criterio a un escenario distinto."
```

### Diff 2 — Correct DBSCAN semantics and empty clusters

```diff
-def update_centroids(xs, labels, k):
+def update_centroids(xs, labels, previous_centroids):
+    k = len(previous_centroids)
     groups = [[] for _ in range(k)]
     for x, lab in zip(xs, labels):
         groups[lab].append(x)
-    return [centroid_1d(g) if g else 0.0 for g in groups]
+    return [
+        centroid_1d(group) if group else previous_centroids[i]
+        for i, group in enumerate(groups)
+    ]

-def density_core_1d(xs, eps=0.5, min_samples=2):
+def density_core_1d(xs, eps=0.5, min_samples=3):
     core = []
     for x in xs:
-        n_nb = sum(1 for y in xs if abs(x-y) <= eps) - 1
-        core.append(n_nb >= min_samples)
+        n_including_self = sum(1 for y in xs if abs(x-y) <= eps)
+        core.append(n_including_self >= min_samples)
     return core
```

### Diff 3 — Measure partition stability

```diff
+from sklearn.cluster import KMeans
+from sklearn.metrics import adjusted_rand_score, silhouette_score
+from sklearn.preprocessing import StandardScaler

-stable = k_a == k_b
+labelings = [
+    KMeans(n_clusters=k, n_init=10, random_state=seed).fit_predict(X_scaled)
+    for seed in seeds
+]
+pairwise_ari = [
+    adjusted_rand_score(labelings[i], labelings[j])
+    for i in range(len(labelings))
+    for j in range(i + 1, len(labelings))
+]
+stable = min(pairwise_ari) >= 0.90
```

### Diff 4 — Replace fixed projection with real PCA

```diff
+import numpy as np
+from sklearn.decomposition import PCA
+from sklearn.preprocessing import StandardScaler

-X_scaled = scale_xy(points)
-pc = [w0 * x + w1 * y for x, y in X_scaled]
+X_scaled = StandardScaler().fit_transform(X)
+pca = PCA(n_components=2)
+projection = pca.fit_transform(X_scaled)

-print("weight_share_pc1", weight_share(w))
+print("components", pca.components_)
+print("explained_variance_ratio", pca.explained_variance_ratio_)
+print("projection", projection)
 print("decision_model", False)
```

### Diff 5 — Teach IF/LOF lifecycle and two-sided sigma rules

```diff
+from sklearn.ensemble import IsolationForest
+from sklearn.neighbors import LocalOutlierFactor
+from sklearn.pipeline import make_pipeline
+from sklearn.preprocessing import StandardScaler

-def sigma_flags(xs, ref, z=3.0):
+def sigma_flags(xs, ref, z=3.0, direction="two-sided"):
     mu = statistics.mean(ref)
     sd = statistics.pstdev(ref) or 1.0
-    return [int(x > mu + z * sd) for x in xs]
+    if direction == "upper":
+        return [int(x > mu + z * sd) for x in xs]
+    if direction == "lower":
+        return [int(x < mu - z * sd) for x in xs]
+    return [int(abs(x - mu) > z * sd) for x in xs]

+if_model = IsolationForest(
+    n_estimators=200,
+    contamination=0.10,
+    random_state=36,
+).fit(X_train)
+
+lof_model = make_pipeline(
+    StandardScaler(),
+    LocalOutlierFactor(
+        n_neighbors=2,
+        contamination=0.10,
+        novelty=True,
+    ),
+).fit(X_train)
```

### Diff 6 — Validate contamination as a planning assumption

```diff
+from math import ceil

-def expected_flags(n, contamination):
-    return int(n * contamination)
+def planned_review_count(n, contamination):
+    if n < 0:
+        raise ValueError("n must be non-negative")
+    if not 0.0 < contamination <= 0.5:
+        raise ValueError("contamination must be in (0, 0.5]")
+    return ceil(n * contamination)
```

### Diff 7 — Enforce chronology

```diff
-def has_leakage(train_months, test_month):
-    return test_month in train_months
+def month_number(value):
+    year_text, month_text = value.split("-")
+    year = int(year_text)
+    month = int(month_text)
+    if month < 1 or month > 12:
+        raise ValueError(f"invalid month: {value}")
+    return year * 12 + month
+
+def has_temporal_leakage(train_months, test_month):
+    test_number = month_number(test_month)
+    return any(
+        month_number(train_month) >= test_number
+        for train_month in train_months
+    )
```

Regression test:

```python
def test_future_training_month_is_leakage():
    assert has_temporal_leakage(
        ["2026-01", "2026-03"],
        "2026-02",
    )
```

### Diff 8 — Rename and guard the review metric

```diff
-def precision_at_k(ranked, k):
-    return sum(ranked[:k]) / k
+def review_utility_at_k(judgments, k):
+    if not 1 <= k <= len(judgments):
+        raise ValueError("k must be between 1 and len(judgments)")
+    top_k = judgments[:k]
+    if any(value is None for value in top_k):
+        raise ValueError("top-k contains unreviewed cases")
+    if any(value not in (0, 1) for value in top_k):
+        raise ValueError("judgments must be binary")
+    return sum(top_k) / k
```

### Diff 9 — Replace decorative `ok True` with pytest

```diff
- tests: "Salida alinea con solution output..."
+ tests: "pytest -q course-labs/s36/tests/test_centroid.py"

-print("ok", True)
```

```python
def test_centroid_uses_mean():
    assert centroid([1.0, 2.0]) == pytest.approx(1.5)

def test_centroid_rejects_empty_group():
    with pytest.raises(ValueError):
        centroid([])
```

### Diff 10 — Make the You Do project authentic

```diff
- "Construye un mini-pipeline ... PCA toy ... path length ..."
+ "Extiende el baseline transparente a un pipeline reproducible con
+ KMeans, DBSCAN, PCA, Isolation Forest y LOF; usa preprocessing
+ ajustado solo en el periodo histórico y ejecuta un backtest temporal."
```

Add required evidence:

```text
README
dependency lock
pytest suite
cluster_stability.csv
pca_loadings.csv
temporal_backtest.csv
reviewer_annotations.csv
accessible plots and tables
SIGNAL_CARD.md
```

### Diff 11 — Add the eighth assessment item

```diff
+{
+  question:
+    "Dos corridas de k-means eligen k=3, pero sus etiquetas tienen ARI=0.18. ¿Cuál es la conclusión correcta?",
+  options: [
+    "La solución es estable porque ambas eligieron k=3",
+    "La partición es inestable y debe investigarse",
+    "ARI bajo demuestra fraude",
+    "Se debe aumentar contamination"
+  ],
+  correctIndex: 1,
+  explanation:
+    "El mismo k no garantiza la misma partición. ARI bajo indica poca estabilidad de las asignaciones."
+}
```

### Diff 12 — Use a two-sided distance heuristic

```diff
-def far_from_mean(pc, thresh=3.0):
+def far_from_center(pc, thresh=3.0):
+    if not pc:
+        raise ValueError("pc must not be empty")
     mean_pc = sum(pc) / len(pc)
-    return max(pc) - mean_pc > thresh
+    return max(abs(value - mean_pc) for value in pc) > thresh
```

The text must still state that this is a didactic heuristic, not a PCA anomaly detector.

---

## 7. Recommended Priority Order for Fixing

### P0 — Release-blocking technical corrections

1. Replace the fixed weighted projection with genuine PCA.
2. Correct DBSCAN `min_samples` semantics.
3. Remove the `0.0` empty-centroid fallback.
4. Replace equal-`k` logic with fitted partition stability.
5. Repair chronological leakage checks and training-only preprocessing.
6. Correct novelty/outlier operational semantics.
7. Make sigma detection two-sided by default or declare a one-sided contract.

### P1 — Mastery and evidence

8. Add actual `KMeans`, `DBSCAN`, `PCA`, `IsolationForest` and `LocalOutlierFactor` activities.
9. Convert output descriptions into executable pytest contracts.
10. Redesign E2/E3 for genuine fading and transfer.
11. Turn the You Do into an evidence-producing project.
12. Add real plots plus accessible alternatives.
13. Separate review utility@k from predictive precision@k.
14. Restore the eighth exam item and create A/B/C variants.

### P2 — Redaction and learning efficiency

15. Split the opening glossary across T1–T4.
16. Apply a controlled es-PE bilingual terminology policy.
17. Consolidate repeated ethical statements.
18. Remove the two authoring-process leaks.
19. Ground PCA interpretation in original features.

### P3 — Maintenance and references

20. Add precise primary sources for DBSCAN, PCA, stability, leakage and LOF novelty.
21. Replace generic bibliography entries with identifiable chapters or papers.
22. Plan a backward-compatible migration from the stale `ai-apis-advanced` ID.

---

## 8. Graph Memory Update Notes

```yaml
section:
  id: S36
  title: "Clustering, anomalías y validación temporal"
  public_hash: "ai-apis-advanced"
  source: "src/lib/course/sections/s36-ai-apis-advanced.ts"
  audited_on: "2026-07-25"
  score: 5.2
  status: "major technical and assessment revision required"

scope_verified:
  theory_subtopics: 8
  i_do_demos: 8
  exercises: 24
  you_do_projects: 1
  self_check_items: 7
  required_self_check_items: 8
  source_changes_applied: false

strong_nodes:
  - synthetic_case_context
  - anomaly_not_misconduct_invariant
  - mandatory_human_review
  - contamination_not_fraud_rate
  - S35_to_S36_to_S37_to_S39_continuity
  - explicit_privacy_gate
  - comprehensive_project_rubric

critical_or_high_defect_nodes:
  - pca_name_points_to_fixed_weight_projection
  - dbscan_min_samples_off_by_one
  - dbscan_reduced_to_core_mask
  - empty_kmeans_cluster_becomes_zero
  - same_k_misnamed_as_partition_stability
  - isolation_forest_reduced_to_fixed_path
  - lof_has_no_executable_practice
  - generic_sigma_rule_is_one_sided
  - novelty_reduced_to_z_score_string
  - temporal_leakage_only_checks_exact_membership
  - preprocessing_fit_window_not_enforced
  - precision_at_k_lacks_k_upper_bound
  - reviewer_helpfulness_misnamed_as_precision
  - exercises_lack_executable_tests
  - you_do_is_substantially_pre_solved
  - exam_missing_one_subtopic_item

meta_leaks:
  - "stdlib para progressive disclosure"
  - "no un TODO vacío"

preserve_without_weakening:
  - anomaly_never_equals_guilt
  - synthetic_data_only
  - human_review_gate
  - no_automatic_sanction
  - explicit_capacity_constraints
```

**This is the complete Explorer report for Section 36. Ready for the Fixer prompt.**
