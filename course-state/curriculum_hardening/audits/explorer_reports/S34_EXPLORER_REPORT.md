# S34 Explorer Report — Curriculum Hardening

**Auditor role:** Elite multi-agent Curriculum Auditor (Live Site Navigator · Source Code Reader · Pedagogy & Learning Science · Redaction & Technical Writing · Meta-Leak Detector · Comparative Quality · Diff Architect · Reporter)  
**Scope rule:** Section 34 only. No product code was modified.  
**Analysis date:** 2026-07-24  
**Method:** Stanford STORM multi-pass (surface → pedagogy → redaction → meta-leak → comparative) + Graph Engineering node/edge review + Loop Engineering until residual issues registered.

---

## 1. Section Identification & Scope

| Field | Value |
|--------|--------|
| **Index** | 34 |
| **Platform id (hash)** | `cv-ai-integration` |
| **Title (metadata)** | Métricas, desbalance, calibración y umbrales |
| **shortTitle (live card)** | Métricas y umbrales |
| **Live URL** | https://pillb.github.io/pyarcana/#cv-ai-integration |
| **Repo source** | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s34-cv-ai-integration.ts` |
| **Phase / level** | Phase 2 · Competente a experto |
| **estimatedHours** | 19 |
| **Capstone frame** | Cierre **CP-N3-B** — Relationship Investigation Workbench |
| **Adjacent sections** | S33 baselines responsables → **S34** → S35 explainability/equidad |
| **Legacy residual** | Platform id and filename still encode “CV / AI integration”; content is metrics/calibration (V3 rewrite) |

### Scope of this run

Analyzed only S34 end-to-end:

- Metadata, learning outcomes, job relevance, tagline  
- Theory (intro + 8 subtopics S34-T1-A … S34-T4-B) with code, outputs, callouts  
- I Do (8 demos)  
- We Do (24 challenges: 8× E1 guided / E2 independent / E3 transfer)  
- You Do portfolio block  
- selfCheck (5 MCQs)  
- resources (docs / books / courses)  
- Live site catalog card for S34 and continuity vs S01 (gold narrative) / S33 / S35  
- Cross-check with `course-state/s34_phase5_exam_bank.json` (bank metadata only; not scoring bank items in detail)  
- Prior mechanical audit `S34_AUDIT.json` (ACCEPT) noted as **non-pedagogical** signal only  

**Out of scope:** fixing content; other sections; applying diffs.

### Graph snapshot (high level)

```
[S33 scores/baseline] → [S34-T1 metrics] → [S34-T2 imbalance] → [S34-T3 cal] → [S34-T4 thr/abstain]
                              ↓                    ↓                  ↓                ↓
                         I Do demos (flags)    same thin codes     clip≠Platt      thr-v1 flags
                              ↓                    ↓                  ↓                ↓
                         We Do E1/E2/E3 ×8  ─── same boolean-gate template (24×) ───┘
                              ↓
                         You Do empty report dict
                              ↓
                         selfCheck (concepts OK) → resources (sklearn/Google OK)
```

**Broken quality edges:** Theory *claims* (F1, PR-AUC, Fβ, Platt/isotonic, TN, recall@k) ↛ Theory *code*; Theory skill ↛ We Do (We Do never *computes* metrics); We Do volume ↛ You Do depth; Hours 19h ↛ actual practice density.

---

## 2. Executive Summary of Quality

### Score: **4.6 / 10**

### Verdict

S34 is a **structurally complete V3 shell** with the right product ethics (review ranking ≠ fraud label; capacity-aware thresholds; abstention as first-class) and a coherent T1→T4 map that correctly closes CP-N3-B after S33. Against best-practice evaluation pedagogy and against the course’s own early gold standard (S01 narrative depth + real skill demos), it is **pedagogically underpowered**: learners mostly flip boolean contracts on pre-filled dicts instead of computing precision/recall/F1, PR curves, Brier, reliability bins, or real calibrators. Theory codes are toy flags; headings promise PR-AUC/Fβ/Platt that never appear in executable form; We Do is a 24-exercise template factory; You Do is nearly empty; developer meta (legacy id, “no YOLO”, “V3”) leaks into user-facing copy. A mechanical redaction audit previously **ACCEPT**ed the section—that does not override the skill-delivery failure for a metrics section.

**What works**

- Correct framing for imbalanced review queues (accuracy traps, prevalence, top-k vs capacity).  
- Strong safety narrative: scores prioritize humans; never auto-fraud.  
- selfCheck items align with core messages.  
- External resources (sklearn evaluation/calibration, Google ML Crash Course, Rules of ML, imbalanced-learn) are appropriate.  
- Subtopic IDs and REJECT_*/REQUEST_* vocabulary are consistent *internally*.

**What fails**

- **I Do / We Do / You Do fidelity:** We Do does not practice the *skill named in the title*.  
- **Claim–code gap:** PR-AUC, Fβ, full confusion (TN), Platt/isotonic, recall@k, multi-point Brier.  
- **Meta-leaks** about curriculum migration (legacy id, YOLO, V3 gates).  
- **Redaction / es-PE:** English-heavy headings; telegraphic outcomes vs S01.  
- **iDo output bug** on `weight_ratio` expected print.  
- **edgeCases** copy-paste: adversarial fixtures described with *valid* conditions.  
- **Hours inflation:** 19h for boolean gates + stubs is not honest.

---

## 3. Detailed Issue Registry

Severity scale: **P0** blocker · **P1** high · **P2** medium · **P3** low/polish.

### ISSUE-01 — We Do is a boolean-gate factory, not metrics practice
- **Severity:** P0  
- **Location:** `weDo.steps` — all 24 of `S34-T*-E1/E2/E3`  
- **Evidence:** E1 solutions only flip predicates such as `record["accuracy_only"] is False and record["tp"] + … >= 1`; E2/E3 assess/decide on pre-baked `tp/fp/fn` or `brier/mean_p/freq` without computing them. Instruction pattern is uniform: “Reemplaza la expresión booleana defectuosa, no los datos”.  
- **Pedagogical impact:** Gradual Release of Responsibility requires We Do to *scaffold the same cognitive work* as I Do and prepare You Do. Here cognitive work is inverted boolean logic on policy flags—useful for product gates, **not** for learning P/R/F1/Brier/calibration. Students can “pass” S34 without ever computing a metric.  
- **Alignment:** Violates section title, LOs (“Elegir métricas…”, “Evaluar calibración…”, “Elegir umbral…”), and external best practice (choose metrics from decision needs, then *compute* them).

### ISSUE-02 — Theory/I Do never compute F1, PR-AUC, or Fβ despite headings and prose
- **Severity:** P0  
- **Location:** Theory `S34-T1-A` heading `"confusion matrix, precision/recall/F y PR-AUC"`; paragraphs mention Fβ and PR-AUC; code only `confusion_counts` → `tp,fp,fn`.  
- **Evidence:**  
  > "**Precision, recall, Fβ** y el área bajo la curva **precision-recall**…"  
  > Code ends with `print("accuracy_only", False)` — no P, R, F1, PR-AUC.  
- **Pedagogical impact:** Dual-coding fails: words introduce advanced metrics; code teaches a partial count + a boolean slogan. Creates illusion of coverage (exam bank family `confusion-pr-f-prauc` assumes concept was taught).

### ISSUE-03 — Confusion contract claims TN; implementation omits TN
- **Severity:** P1  
- **Location:** Theory S34-T1-A paragraph “salida TP/FP/FN/TN y F1”; `confusion.py` returns only `tp, fp, fn`.  
- **Evidence:**  
  ```python
  def confusion_counts(y, pred):
      ...
      return tp, fp, fn
  ```  
- **Pedagogical impact:** “Matriz completa” is asserted then under-delivered; specificity / all-negative stories in T2-B need TN for a full matrix story.

### ISSUE-04 — “Calibradores” demonstrated as score clipping only
- **Severity:** P1  
- **Location:** Theory/I Do `S34-T3-B` (`calibrator.py`, `cal_demo.py`)  
- **Evidence:** Prose names **Platt** and **isotonic**; executable code is `clip_scores` to `[0,1]` plus string `calibrator_set=holdout_v1`. Clipping is not calibration.  
- **Pedagogical impact:** Learners leave thinking “calibration = clip to unit interval.” Real reliability work (Platt logistic, isotonic on holdout, reliability diagram) is externalized to docs only—insufficient for “Competente a experto” / 19h claim.

### ISSUE-05 — Brier taught as single-point toy; reliability not computed
- **Severity:** P1  
- **Location:** `S34-T3-A` `brier.py` / `brier_demo.py`  
- **Evidence:** `brier_one(1.0, 1)` → 0.0; reliability is printed as static literals `mean_p 0.8 freq 0.5` without binning.  
- **Pedagogical impact:** Brier is a mean of squared errors over a set; reliability needs bins. Current demo is a formula postcard, not a skill.

### ISSUE-06 — You Do starter is an empty report skeleton
- **Severity:** P1  
- **Location:** `youDo.starterCode`  
- **Evidence:**  
  ```python
  report = {"confusion": {}, "precision_at_k": None, "thr_id": None, "decision": None}
  if __name__ == "__main__":
      print(sorted(report.keys()))
  ```  
  Comment: “Contrato de theory/iDo documentado (sin stubs)” — but the starter **is** a stub.  
- **Pedagogical impact:** You Do should be independent synthesis of T1–T4. Empty keys + print keys fails portfolio evidence and GRR “perform with no help.” Rubric asks thr versionado + reliability bin + capacidad without scaffolding data or expected interface.

### ISSUE-07 — Meta-leak: legacy id + “no YOLO / computer vision / V3”
- **Severity:** P1 (user-facing curriculum migration notes)  
- **Location:** `jobRelevance`; theory intro paragraph 3; You Do rubric criterion 1  
- **Evidence (exact):** see §4 Meta-Leak Report.  
- **Pedagogical impact:** Breaks immersion; confuses learners (“¿por qué el id dice computer vision?”); “V3” and “legacy” are author-process terms.

### ISSUE-08 — edgeCases text describes the *valid* condition as the adversarial fixture
- **Severity:** P1  
- **Location:** All We Do `edgeCases` arrays (pattern repeated 24×)  
- **Evidence (examples):**  
  - `"fixture adverso: counts de confusión con accuracy_only=False"` (valid policy)  
  - `"fixture adverso: precision@k con load dentro de capacidad"` (valid)  
  - `"fixture adverso: Brier bajo y reliability alineada en el bin"` (valid)  
- **Pedagogical impact:** Hints/edgeCases mis-teach; Fixer/instructor tooling that reads edgeCases will invert validity.

### ISSUE-09 — iDo expected output bug: `weight_ratio(9,1)` prints `9.0`, not `9`
- **Severity:** P1 (runtime/UI correctness)  
- **Location:** I Do `S34-T2-A-DEMO` `w_demo.py`  
- **Evidence:**  
  ```python
  print(weight_ratio(9, 1))  # Python 3 → 9.0
  ```  
  Declared `output`: `9`  
  Theory block correctly shows `weight_ratio 9.0`.  
- **Pedagogical impact:** Interactive runners that check exact output will fail; undermines trust in “expected output” pedagogy.

### ISSUE-10 — recall@k promised in prose, never coded
- **Severity:** P2  
- **Location:** S34-T1-B paragraph 1  
- **Evidence:** “**precision@k** y **recall@k**…”; only `precision_at_k` implemented; no labeled ranking set for recall@k.  
- **Pedagogical impact:** Incomplete ranking metric literacy for a workbench section.

### ISSUE-11 — Threshold selection is hardcoded, not optimized by cost/capacity
- **Severity:** P2  
- **Location:** `S34-T4-A` `threshold.py`  
- **Evidence:** `thr = 0.6` fixed; `n_in_review` and `review_cost` are decoupled demos; no search over thr given `c_fp/c_fn` and capacity.  
- **Pedagogical impact:** LO “Elegir umbral por costo y capacidad” is asserted, not taught as a procedure.

### ISSUE-12 — Learning outcomes are telegraphic and underspecified
- **Severity:** P2  
- **Location:** `learningOutcomes` (8 items)  
- **Evidence:** e.g. `"Elegir métricas para desbalance"`, `"Aplicar abstención y sensibilidad por slice"` — no observable criterion, no artifact. Compare S01 outcomes that unpack terms in situ.  
- **Pedagogical impact:** Weak goal orientation and self-assessment; hard to map to portfolio evidence.

### ISSUE-13 — English-dominant / mixed headings (es-PE redaction)
- **Severity:** P2  
- **Location:** Theory headings for T1–T4  
- **Evidence:** `"confusion matrix, precision/recall/F y PR-AUC"`, `"class weights y resampling dentro de CV"`, `"reliability curves y Brier"`, `"threshold por costo/capacidad"`; most start lowercase.  
- **Pedagogical impact:** Course brand is español peruano; mixed headings raise cognitive switching cost and look unfinished vs S01 Spanish-first headings.

### ISSUE-14 — Theory paragraph template monotony (Contrato / Error / Criterio / Aplicación)
- **Severity:** P2  
- **Location:** Every subtopic theory block (3-paragraph factory)  
- **Evidence:** All subtopics use the same “prose claim → Contrato/Error/Criterio → Aplicación a CASO-LIM-034” skeleton with near-identical density.  
- **Pedagogical impact:** Reduces narrative connective tissue and motivation; early gold sections use varied exposition, analogies, and progressive disclosure. Here progressive disclosure is structural only (T1→T4 labels), not cognitive.

### ISSUE-15 — We Do intro claims “24 retos” and “fail-closed con fixtures peruanos” but exercises are abstract dicts
- **Severity:** P2  
- **Location:** `weDo.intro`  
- **Evidence:** Intro promises domain repair + valid/invalid/missing + “fixtures peruanos sintéticos”; body is generic `record` dicts with no Red Andina narrative, no graph/features from S31–S33, no Spanish domain fields beyond `case_id`.  
- **Pedagogical impact:** Situational learning claim without situating content.

### ISSUE-16 — Feedback strings are copy-paste twins across E1/E2/E3
- **Severity:** P2  
- **Location:** `feedback` fields for each triad  
- **Evidence:** E1, E2, E3 for T1-A all use nearly identical: “explica qué campo cambió la decisión, por qué el adverso activa REJECT_… y por qué faltar X exige REQUEST_…”.  
- **Pedagogical impact:** Metacognitive prompts should differentiate guided vs transfer; repetition trains pattern-match, not reflection depth.

### ISSUE-17 — estimatedHours = 19 vs thin executable content
- **Severity:** P2  
- **Location:** metadata `estimatedHours: 19`  
- **Evidence:** ~8 short theory codes + 8 demos + 24 one-predicate fixes + empty You Do + 5 quiz items. Honest range is closer to **6–10h** for current depth (or content must expand to justify 19h).  
- **Pedagogical impact:** Trust and planning; learners who finish in a day may feel the course over-promises.

### ISSUE-18 — Platform id / filename / historical roadmap mismatch
- **Severity:** P2 (product consistency; partially intentional)  
- **Location:** `id: "cv-ai-integration"`, file `s34-cv-ai-integration.ts`; older roadmap texts still mention “CV + AI Integration / SUNAT Invoice Digitizer / Smart CCTV” in non-section files (`learning_roadmap.md`, `scripts/roadmap_sections.json` excerpts).  
- **Pedagogical impact:** Search, SEO, and student mental model (“¿esto es visión?”). Content correctly disclaims CV, but residual naming still confuses when meta-text is removed.

### ISSUE-19 — Class-weight demo is `n0/n1` ratio only; no sklearn-style `class_weight` or in-fold resample sketch
- **Severity:** P2  
- **Location:** S34-T2-A  
- **Evidence:** `weight_ratio(9,1) → 9`; flags `resample_global=False`. No pipeline sketch showing resample *inside* fold.  
- **Pedagogical impact:** Leakage rule is stated correctly but not shown as code structure (the actual skill that prevents inflated metrics).

### ISSUE-20 — selfCheck is solid but shallow relative to claimed topic surface
- **Severity:** P3  
- **Location:** `selfCheck.questions` (5 items)  
- **Evidence:** Covers accuracy trap, leaky resample, calibrator holdout, abstain, thr by cost—good. Missing PR-AUC vs ROC, Brier definition, precision@k under capacity, slice sensitivity.  
- **Pedagogical impact:** Active recall undersamples the LO graph; fine if We Do/You Do deepen, which they currently do not.

### ISSUE-21 — Rubric criterion “Alineación al gate V3 de la sección”
- **Severity:** P2 (meta + learner opacity)  
- **Location:** `youDo.rubric[0]`  
- **Evidence:** `"Alineación al gate V3 de la sección"` weight 25%. Learners do not know what “gate V3” means as a grading criterion.  
- **Pedagogical impact:** Opaque assessment language; curriculum version leak (also ISSUE-07).

### ISSUE-22 — No connective worked example end-to-end workbench
- **Severity:** P1  
- **Location:** Across theory/iDo/youDo  
- **Evidence:** Each subtopic uses tiny independent arrays; no single CASO-LIM-034 table of scores+labels flowing through confusion → precision@k → prevalence note → Brier → thr-v1 → abstain.  
- **Pedagogical impact:** Graph Engineering: missing integration node before “cierre CP-N3-B.” S33/S34 product story demands a through-line.

### ISSUE-23 — Grammar/style nits (es-PE professional)
- **Severity:** P3  
- **Locations / examples:**  
  - Repeated slogan “ER/matching ≠ parentesco ni fraude” without expansion on first use in S34.  
  - “clerical review” left in English (T1-B).  
  - Tagline mixes English product name with Spanish clause.  
  - Some `print('ok', True)` noise tokens in demos without pedagogical role.  
- **Pedagogical impact:** Minor polish; tone less polished than early sections.

---

## 4. Meta-Leak Report

Exact user-facing strings that leak authoring / migration process (not domain pedagogy):

| # | Location | Exact leaked / process text | Why it is a leak |
|---|----------|-----------------------------|------------------|
| ML-1 | `jobRelevance` | `Id \`cv-ai-integration\` conservado.` | Tells the learner a platform migration fact; not a learning objective. |
| ML-2 | Theory intro ¶3 | `Id legacy \`cv-ai-integration\` se conserva; **no** hay YOLO ni computer vision en V3 de esta sección.` | Explicit anti-CV disclaimer + “legacy” + “V3” = curriculum rewrite note for developers. |
| ML-3 | `youDo.rubric` | `Alineación al gate V3 de la sección` | Versioned internal gate as 25% grading criterion. |
| ML-4 | Theory intro ¶1–2 (borderline) | Heavy “Producto incremental… Entrada… salida…” author-brief style | Acceptable as product framing if softened; currently reads like a design ticket. |
| ML-5 | Callouts `Breach → REJECT_*` (borderline) | Domain codes are intentional product vocabulary | **Not** counted as meta-leak if explained once as workbench error codes; currently introduced without a learner glossary. Recommend promote to intentional domain language + glossary, not delete. |

**meta_leak_count (strict user-facing process leaks ML-1..ML-3): 3**  
(ML-4/ML-5 tracked as style/domain-language issues, not pure meta-leaks.)

**No findings of:** raw “TODO”, “FIXME”, “moved from section X” move notes, or chain-of-thought AI chat paste beyond the migration phrases above.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

1. **Imbalanced classification metrics:** Prefer PR-AUC / precision-recall families when positives are rare; accuracy and sometimes ROC-AUC mislead; if probabilities matter, use Brier + reliability; if costs differ, use Fβ or explicit cost-sensitive thresholds.  
2. **Threshold calibration / decision thresholds:** Threshold choice is often as important as sampling strategies for imbalance; thresholds must couple to capacity and cost.  
3. **Gradual Release of Responsibility (I Do / We Do / You Do):** Cognitive load should shift from teacher modeling of the *target skill* to guided practice of that skill to independent performance—not from demo flags to inverted booleans to empty dicts.  
4. **Cognitive load / progressive disclosure:** Introduce one metric family, compute it, then add prevalence, then calibration, then decision policy—with a running case.

### 5.2 I Do / We Do / You Do fidelity

| Phase | Present? | Skill fidelity | Notes |
|-------|----------|----------------|-------|
| **I Do** | Yes (8 demos) | Low–medium | Shows tiny helpers + policy flags; good “why” sentences; weak on real metric pipelines. |
| **We Do** | Yes (24) | **Low** (P0) | Practices gate predicates, not metric math or evaluation design. |
| **You Do** | Shell only | **Very low** | Empty report; rubric richer than starter. |
| **selfCheck** | Yes (5) | Medium | Conceptually aligned; thin coverage. |

**Fidelity score for GRR structure:** ~3/10 (structure present, skill transfer broken).

### 5.3 Cognitive load

- **Intrinsic load (topic):** High (metrics + imbalance + calibration + decision theory)—appropriate for Phase 2 expert track.  
- **Extraneous load:** High due to (a) REJECT_/REQUEST_ taxonomy without glossary, (b) 24 near-duplicate exercises, (c) meta-leaks about YOLO/legacy, (d) English headings.  
- **Germane load:** Low—too little effort spent *constructing* metrics representations.  

Net: overload on bureaucracy, underload on mathematics of evaluation.

### 5.4 Connective tissue & narrative flow

- **Good:** Explicit “cierra CP-N3-B”, references S31/S32/S33, Red Andina (ficticia), CASO-LIM-034.  
- **Weak:** No continuous dataset; no paragraph bridging “yesterday’s baseline scores” → “today’s ranking metrics”; repeated slogans instead of progressive story beats. Compared to S01’s dictionary + motivation + Peru workplace scene, S34 feels like a contract catalog.

### 5.5 Consistency with roadmap

| Check | Status |
|-------|--------|
| Live card shortTitle matches metrics theme | OK |
| Full title metrics/calibration | OK |
| Capstone CP-N3-B closure before S35 CP-N3-C | OK thematically |
| Platform id `cv-ai-integration` vs title | **Mismatch** (legacy) |
| Old roadmap “SUNAT / CCTV / CV” remnants outside section | Residual ecosystem debt |
| Exam bank title_v3 matches | OK |

### 5.6 Comparison to gold / external

| Benchmark | S34 relative quality |
|-----------|----------------------|
| **S01 (early gold narrative)** | Far weaker exposition, glossary, worked realism |
| **S33 (previous, same template family)** | Same contract/template DNA; S34 inherits factory issues |
| **sklearn model_evaluation / calibration docs** | Resources point correctly; section body does not reach doc-level skill |
| **Google ML Crash Course classification / Rules of ML** | Threshold & slices ideology present; practice layer thinner than those free courses’ exercises |
| **Imbalanced-learn / ML Mastery metric tours** | Section *names* the right metric families; does not *tour* them |

### 5.7 Accessibility & motivation

- Positive ethics (no fraud auto-label) reduces harmful motivation.  
- Low narrative agency for learner-as-analyst in Lima workbench.  
- No alt-text concerns in TS source (code-first).  
- Print `ok True` / `fraud_label False` noise is not accessible pedagogy—signals for harnesses more than humans.

### 5.8 Domain correctness notes (technical)

| Claim | Assessment |
|-------|------------|
| Accuracy fails under low prevalence | Correct |
| precision@k for review queues | Correct framing |
| Resample only in train fold | Correct |
| Calibrator fit out-of-sample | Correct |
| Clip ∈ [0,1] = calibration | **Incorrect** as teaching substitute |
| Brier single perfect point = “calibrated” teaching | Incomplete |
| thr default 0.5 bad; cost/capacity good | Correct |
| Abstain band as first-class | Correct product design |
| F1 from P=R=0.5 is 0.5 | Correct (asserted only) |

### 5.9 Redaction quality (Peruvian Spanish)

- Body Spanish is generally clear and professional.  
- Headings and many tokens remain English-first.  
- Telegraphic LOs and “Contrato:” style feel internal.  
- No egregious grammar catastrophes; main issue is **register** (design-spec vs teacher).

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only**. Do not apply in this Explorer run. Paths relative to repo root.

### Diff A — Remove meta-leaks (ML-1, ML-2, ML-3)

```diff
--- a/src/lib/course/sections/s34-cv-ai-integration.ts
+++ b/src/lib/course/sections/s34-cv-ai-integration.ts
@@ jobRelevance
-    "Cierras **CP-N3-B** con el **Relationship Investigation Workbench**: grafo, features, baseline y **ranking calibrado** para humanos. Id `cv-ai-integration` conservado. Precision/recall de cola de revisión — **nunca** auto-etiqueta de fraude. ER/matching ≠ parentesco ni fraude.",
+    "Cierras **CP-N3-B** con el **Relationship Investigation Workbench**: grafo, features, baseline y **ranking calibrado** para humanos. Precision y recall de la cola de revisión — **nunca** auto-etiqueta de fraude. Entity resolution o matching de identidad **no** equivale a parentesco ni a fraude.",
@@ theory intro paragraph
-        "Orden: **T1 métricas** → **T2 desbalance** → **T3 calibración** → **T4 decisión**. Id legacy `cv-ai-integration` se conserva; **no** hay YOLO ni computer vision en V3 de esta sección. ER/matching ≠ parentesco ni fraude."
+        "Orden: **T1 métricas** → **T2 desbalance** → **T3 calibración** → **T4 decisión**. Esta lección es de **evaluación y umbrales de cola**, no de visión por computador. Entity resolution o matching **no** equivale a parentesco ni a fraude."
@@ youDo.rubric
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Reporte de métricas + thr versionado + abstención alineado al workbench (sin auto-fraude)", weight: "25%" },
```

### Diff B — S34-T1-A: full confusion + P/R/F1 (close claim–code gap)

```diff
--- a/src/lib/course/sections/s34-cv-ai-integration.ts
+++ b/src/lib/course/sections/s34-cv-ai-integration.ts
@@ S34-T1-A heading
-      heading: "confusion matrix, precision/recall/F y PR-AUC",
+      heading: "Matriz de confusión, precision, recall y F1",
@@ code
-def confusion_counts(y, pred):
-    tp = sum(1 for a, b in zip(y, pred) if a == 1 and b == 1)
-    fp = sum(1 for a, b in zip(y, pred) if a == 0 and b == 1)
-    fn = sum(1 for a, b in zip(y, pred) if a == 1 and b == 0)
-    return tp, fp, fn
-
-print("tp_fp_fn", confusion_counts([1, 0], [1, 1]))
-print("accuracy_only", False)
+def confusion_counts(y, pred):
+    tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
+    fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
+    fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
+    tn = sum(a == 0 and b == 0 for a, b in zip(y, pred))
+    return tp, fp, fn, tn
+
+def precision_recall_f1(tp, fp, fn):
+    p = tp / (tp + fp) if (tp + fp) else 0.0
+    r = tp / (tp + fn) if (tp + fn) else 0.0
+    f1 = 2 * p * r / (p + r) if (p + r) else 0.0
+    return p, r, f1
+
+tp, fp, fn, tn = confusion_counts([1, 0], [1, 1])
+p, r, f1 = precision_recall_f1(tp, fp, fn)
+print("tp_fp_fn_tn", (tp, fp, fn, tn))
+print("p_r_f1", (p, r, f1))
+print("accuracy_only", False)
@@ output
-tp_fp_fn (1, 1, 0)
-accuracy_only False
+tp_fp_fn_tn (1, 1, 0, 0)
+p_r_f1 (0.5, 1.0, 0.666...)  # use exact rounded values in final Fixer
+accuracy_only False
```

*(Fixer should recompute exact rounded F1 = 2/3 ≈ 0.667 and sync I Do demo.)*

**Follow-on (same issue family):** either (1) rename away from PR-AUC until a second subtopic computes average precision on a scored list, or (2) add a small `average_precision` demo on 5–10 labeled scores.

### Diff C — Fix iDo weight_ratio expected output

```diff
--- a/src/lib/course/sections/s34-cv-ai-integration.ts
+++ b/src/lib/course/sections/s34-cv-ai-integration.ts
@@ S34-T2-A-DEMO output
-          output: `9
+          output: `9.0
 overload False   # only if present; keep other lines
 ok True`,
```

(Exact block: change the first output line from `9` to `9.0` to match Python 3 float division.)

### Diff D — S34-T3-B: show real holdout calibration sketch (not only clip)

```diff
 # Proposal: replace pure clip with a minimal Platt-like affine map on a named holdout,
 # or document clip as pre-step and add:
 def reliability_bin(ps, ys, lo, hi):
     pair = [(p, y) for p, y in zip(ps, ys) if lo <= p < hi]
     if not pair:
         return None
     mean_p = sum(p for p, _ in pair) / len(pair)
     freq = sum(y for _, y in pair) / len(pair)
     return mean_p, freq
 # Fit calibrator ONLY on holdout_v1 indices; evaluate Brier on test indices.
```

Keep `calibrator_set="holdout_v1"`; never fit on test.

### Diff E — We Do: at least one compute path per topic (replace pure boolean for E1)

Illustrative for T1-A-E1 only (pattern for each subtopic):

```diff
-# DEFECT: PASS si accuracy_only True
-record = {"case_id": "CASO-LIM-034-1A", **{'tp': 1, 'fp': 1, 'fn': 0, 'accuracy_only': False}}
-meets_contract = record["accuracy_only"] is True
+# DEFECT: F1 mal calculado (suma en vez de media armónica)
+y, pred = [1, 0], [1, 1]
+tp = sum(a == 1 and b == 1 for a, b in zip(y, pred))
+fp = sum(a == 0 and b == 1 for a, b in zip(y, pred))
+fn = sum(a == 1 and b == 0 for a, b in zip(y, pred))
+p = tp / (tp + fp)
+r = tp / (tp + fn)
+f1 = p + r  # DEFECT
+# solution: f1 = 2 * p * r / (p + r)
+print("S34-T1-A", "PASS" if abs(f1 - 2/3) < 1e-9 else "REJECT_ACCURACY_ONLY")
```

Keep E2/E3 for fail-closed policy if desired, but **E1 must compute the metric**.

### Diff F — Fix edgeCases adversarial wording (all 24)

```diff
-edgeCases: ["falta tp", "fixture adverso: counts de confusión con accuracy_only=False", "CASO-LIM-034-1A es sintético"],
+edgeCases: ["falta tp", "fixture adverso: accuracy_only=True o counts todos en cero", "CASO-LIM-034-1A es sintético"],
```

Apply analogous fixes:

| Subtopic | Adversarial should mean |
|----------|-------------------------|
| T1-B | `load > capacity` |
| T2-A | `resample_global=True` |
| T2-B | `accuracy_enough=True` |
| T3-A | large `|mean_p-freq|` or high Brier |
| T3-B | `calibrator_set=train_in_sample` |
| T4-A | `thr_id=default` / `cost is None` |
| T4-B | `decision=force_1` in band |

### Diff G — You Do starter with end-to-end CASO-LIM-034

```diff
-report = {"confusion": {}, "precision_at_k": None, "thr_id": None, "decision": None}
-# Contrato de theory/iDo documentado (sin stubs)
-if __name__ == "__main__":
-    print(sorted(report.keys()))
+SCORES = [0.1, 0.4, 0.55, 0.6, 0.9]
+LABELS = [0, 0, 1, 0, 1]  # needs_review sintético
+CAPACITY = 2
+# TODO del estudiante: confusion, precision_at_k, brier, thr-v1 por capacidad, decide() abstain
+if __name__ == "__main__":
+    report = build_workbench_report(SCORES, LABELS, capacity=CAPACITY)
+    assert report["accuracy_only"] is False
+    assert report["thr_id"].startswith("thr-v")
+    print(report["precision_at_k"], report["decision_sample"])
```

### Diff H — Spanish headings + LO expansion (sample)

```diff
-    { text: "Elegir métricas para desbalance" },
+    { text: "Elegir y calcular precision, recall, F1 y precision@k cuando la clase positiva es rara" },
-      heading: "threshold por costo/capacidad",
+      heading: "Umbral por costo y capacidad de revisión",
```

### Diff I — Hours honesty (after content fix or if content stays thin)

```diff
-  estimatedHours: 19,
+  estimatedHours: 10,  # or keep 19 only if Diff B/D/E/G land with real labs
```

### Diff J — Integrate thr search (T4-A)

```diff
 def choose_thr(scores, labels, c_fp, c_fn, capacity):
     best = None
     for thr in sorted(set(scores)):
         pred = [1 if s >= thr else 0 for s in scores]
         # cost + n_review constraint...
     return best
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issues | Rationale |
|----------|--------|-----------|
| **1 — P0 skill repair** | ISSUE-01, ISSUE-02, ISSUE-06, ISSUE-22 | Section cannot claim “métricas” without computing them in We Do/You Do and closing the claim–code gap. |
| **2 — P1 correctness & trust** | ISSUE-03, ISSUE-04, ISSUE-05, ISSUE-09, ISSUE-08 | TN/F1, calibration honesty, Brier depth, output bug, edgeCases invert validity. |
| **3 — P1 meta-leaks** | ISSUE-07, ISSUE-21 | Strip legacy/V3/YOLO from learner surfaces; reword rubric. |
| **4 — P2 pedagogy polish** | ISSUE-10, ISSUE-11, ISSUE-12, ISSUE-13, ISSUE-14, ISSUE-15, ISSUE-16, ISSUE-17, ISSUE-19 | recall@k, thr search, LOs, Spanish headings, narrative, hours, weights-in-fold sketch. |
| **5 — P2 ecosystem** | ISSUE-18 | Plan rename of platform id only with coordinated routing/seed; do not half-rename. |
| **6 — P3** | ISSUE-20, ISSUE-23 | Expand selfCheck; micro redaction. |

**Suggested Fixer batches**

1. **Batch A (safety/redaction):** Diff A + Diff F + Diff C  
2. **Batch B (skill core):** Diff B + Diff D + Diff E (one compute E1 per subtopic) + Diff G  
3. **Batch C (decision quality):** Diff J + Diff H + Diff I  

---

## 8. Graph Memory Update notes

For shared curriculum context / subsequent Fixer or Explorer agents:

```yaml
section: 34
id: cv-ai-integration
file: src/lib/course/sections/s34-cv-ai-integration.ts
title: Métricas, desbalance, calibración y umbrales
score_1_to_10: 4.6
status_explorer: complete
status_fixer: pending

nodes_strength:
  - ethics_no_auto_fraud
  - prevalence_accuracy_trap
  - capacity_aware_topk
  - abstain_first_class
  - resources_sklearn_google
  - selfcheck_core_messages
  - roadmap_cp_n3_b_closure

nodes_weakness:
  - we_do_boolean_factory_not_metrics
  - claim_code_gap_prauc_fb_platt
  - you_do_empty_report
  - meta_legacy_id_yolo_v3
  - edgecases_adversarial_wording_inverted
  - ido_weight_ratio_output_bug
  - hours_19_vs_depth
  - no_end_to_end_caso_lim_034_pipeline

edges:
  - S33_baseline_scores -> S34_ranking_metrics: thematic_ok_practice_thin
  - S34_metrics -> S35_explainability: dependency_ok
  - theory_claims -> theory_code: broken_for_F1_PR_AUC_TN_Platt
  - theory_skill -> we_do: broken_boolean_only
  - we_do -> you_do: broken_empty_starter

meta_leaks:
  - "Id `cv-ai-integration` conservado"
  - "Id legacy `cv-ai-integration` se conserva; **no** hay YOLO ni computer vision en V3 de esta sección"
  - "Alineación al gate V3 de la sección"

do_not_regress:
  - never_auto_label_fraud
  - synthetic_caso_lim_only
  - thr_versioning_concept
  - abstain_band_concept
  - resample_not_global_message

mechanical_audit_note: >
  S34_AUDIT.json verdict ACCEPT (2026-07-23) measured visible redaction ranks,
  not pedagogical skill delivery. Explorer overrides ACCEPT for Fixer priority.

external_pedagogy_refs:
  - imbalanced metrics: PR-AUC / P-R when positives rare; Brier if probabilities matter
  - GRR: We Do must practice the I Do skill
  - threshold + cost/capacity often dominates resampling alone
```

---

## Closing

This is the complete Explorer report for Section 34. Ready for the Fixer prompt.
