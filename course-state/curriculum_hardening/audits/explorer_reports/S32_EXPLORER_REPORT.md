# S32 Explorer Report — Feature engineering y pipelines sin leakage

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor  
**Run mode:** Single-section (S32 only) · STORM multi-pass · Graph + Loop Engineering  
**Sources:** Live site `https://pillb.github.io/pyarcana/` (Sección 32 · Features sin leakage) · Repo `src/lib/course/sections/s32-microservices.ts` · Gold compare `s01-setup.ts` / peer `s31-streaming-data.ts` · External: sklearn common pitfalls, Google Rules of ML  
**Harness ids:** platform hash `microservices` · file `s32-microservices.ts` · index 32  
**Generated:** 2026-07-24  

---

## 1. Section Identification & Scope

| Field | Value |
| --- | --- |
| Index | 32 |
| Platform id (hash) | `microservices` *(legacy id retained; content is not microservices)* |
| Title | Feature engineering y pipelines sin leakage |
| Short title (UI) | Features sin leakage |
| Tagline | tabla de features versionada cuya construcción en train e inferencia es idéntica y no usa información futura o de decisión |
| Level / phase / hours | Competente a experto · Phase 2 · 18h |
| Capstone thread | CP-N3-B · `run_id=cpn3b-feat` · `CASO-LIM-032` · Red Andina sintético |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s32-microservices.ts` |
| Live surface | Curriculum card + full section render from the same TS object |

**Scope of this run (in):** metadata, jobRelevance, learningOutcomes, theory (9 blocks: intro + T1-A/B, T2-A/B, T3-A/B, T4-A/B), iDo (8 demos), weDo (24 labs E1–E3 × 8 subtopics), youDo, selfCheck (5), resources, rubric, callouts.

**Scope of this run (out):** no product code edits; no Fixer application; no audit of S31/S33 beyond consistency edges.

**Subtopic map**

| ID | Heading (theory) | Pedagogical claim |
| --- | --- | --- |
| (intro) | De microservicios legado a features sin leakage | Reframe legacy id → feature table gate train≡serve |
| S32-T1-A | numéricas/categóricas/texto | Feature catalog + key validation |
| S32-T1-B | missing indicators, escalamiento y encoding | Indicator + train-only μ/σ / mediana |
| S32-T2-A | shared contact/address, distance y graph features | Relational feats without label-as-feature |
| S32-T2-B | ventanas y frecuencia | Half-open `[t−w, t)` anti-leakage |
| S32-T3-A | ColumnTransformer y custom transformers | fit→transform, fail if not fitted |
| S32-T3-B | fit/transform y persistencia | Versioned state JSON `fs-vN` |
| S32-T4-A | split por entidad/grupo/tiempo | Time + group split, zero entity overlap |
| S32-T4-B | leakage, train–serve skew y versionado | Name scan + skew + feature_set id |

---

## 2. Executive Summary of Quality

### Score: **5.0 / 10**

### Key verdict

S32 has a **correct conceptual spine** (train≡serve, half-open windows, entity isolation, label-as-feature ban, versioned feature sets) that aligns with industry practice (sklearn pipelines / leakage pitfalls, Google Rules of ML on training–serving skew). As a **learner-facing curriculum unit for ~18h**, it is **under-taught and over-templated**: theory is telegraphic, I Do demos are near-trivial, We Do is almost entirely **boolean-flag repair** rather than feature engineering, and You Do is a **stub**. Developer meta-text (V3, legacy `microservices`, `section_passed`, gate V3) leaks into student surfaces. Compared with early gold-standard S01 (narrative, glossary, progressive disclosure, real deliverables), S32 reads like a **contract checklist generated for a workbench harness**, not a complete lesson.

**What works**
- Right learning outcomes and topic order (types → relational → pipeline → validation).
- Explicit anti-fraud / anti-parentesco framing on graph features (ethical consistency with S31).
- Self-check items target the right failure modes (half-open, fit-before-transform, entity overlap, label names).
- External resources are on-topic (sklearn compose, ColumnTransformer, Feast, Rules of ML, common pitfalls).
- Breach/REQUEST codes give a fail-closed vocabulary useful for later MLOps gates.

**What fails the learner**
- Meta-leaks and internal product language dominate the opening narrative.
- We Do does not train *construction* of features—only reading pre-baked flags.
- Theory code samples contain pedagogical bugs / incomplete promises (esp. T1-B z-score, T2-A path, T3-A “ColumnTransformer”).
- Cognitive load: dense jargon without a section dictionary (unlike S01).
- Time estimate (18h) is not justified by substantive practice volume.

**Automated prior signal:** `S32_AUDIT.json` verdict ACCEPT, high_issue_count 0 (surface redaction rank). That automated pass **does not** measure pedagogical fidelity of We Do / I Do; this Explorer overrides it for learning design.

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker for learner trust/correctness · **P1** high pedagogical damage · **P2** medium polish / consistency · **P3** low / optional.

---

### ISSUE-01 · P0 · Developer meta-leak in jobRelevance and theory intro

**Evidence**

```text
jobRelevance:
"… Id `microservices` conservado; V3 **Feature engineering y pipelines sin leakage** para el workbench CP-N3-B. …"

theory[0].paragraphs[0]:
"En V3, **S32 no es Docker/K8s**: construyes la **tabla de features versionada** …"

theory[0].paragraphs[2]:
"… Id legacy `microservices` se conserva. …"

theory[0].callout:
"… Sin section_passed si hay future ts."

youDo.rubric[0]:
"Alineación al gate V3 de la sección"
```

**Pedagogical impact:** Students see curriculum engineering notes (V3 migration, legacy hash ids, internal pass flags). This breaks immersion, confuses the title vs platform id (`microservices` ≠ features), and teaches them the wrong mental model (“this used to be Docker”).

**Graph edges:** meta → theory intro → job card → rubric → trust node.

---

### ISSUE-02 · P0 · We Do is boolean-predicate flipping, not feature engineering

**Evidence (pattern repeated 24×):** Starters precompute domain truth as flags (`catalog_ok`, `silent_fill`, `includes_t`, `uses_label`, …) and invert a comparison:

```python
# S32-T1-A-E1 starter
meets_contract = record["catalog_ok"] is False
```

Solution merely flips to `is True` (sometimes with a redundant set check that the fixture already guarantees). Learners never implement `window_count`, imputer, encoder, or leakage scan from raw events.

**Pedagogical impact:** Violates I Do / We Do / You Do fidelity. After “learning” S32, a student can pass every lab without knowing how to:
- compute half-open windows on timestamps,
- fit μ/σ only on train,
- build a ColumnTransformer,
- or detect entity overlap on real rows.

Active recall of **gate codes** ≠ skill of **feature pipeline construction**. Gradual release of responsibility collapses to “find the inverted boolean.”

**Impact on hours:** 18h claim becomes unjustifiable.

---

### ISSUE-03 · P0 · Theory code T1-B does not apply scale to the series it just filled

**Evidence (`missing_scale.py`):**

```python
def missing_and_scale(vals, fill=2, mu=0, sd=2):
    ind = [v is None for v in vals]
    filled = [fill if v is None else v for v in vals]
    z = [(x - mu) / sd for x in [2, 4]]  # hardcoded, ignores filled
    return ind, filled, z
```

**Pedagogical impact:** Directly contradicts the lesson goal (“z-score con μ/σ solo de train” on the filled series). Students who copy this learn a **wrong pattern**: scale unrelated constants while printing `silent_fill False`.

---

### ISSUE-04 · P1 · Heading / content mismatch: “ColumnTransformer” without ColumnTransformer

**Evidence:** Heading `ColumnTransformer y custom transformers`; body + code only show a custom `ModeImputer`. Paragraph mentions “pipeline fill0 luego *2” but code never chains steps or uses `sklearn.compose.ColumnTransformer`.

**Pedagogical impact:** Expectation violation; resources list ColumnTransformer but the section never demonstrates it. Cognitive schema for heterogeneous column pipelines is never built.

---

### ISSUE-05 · P1 · T2-A path feature demo is a no-op / always-99 toy

**Evidence:**

```python
path = {"E1-E9": 99}.get("E1-E9", 99)
```

Always returns 99; does not read entities `a`/`b` or compute min path. Combined with iDo `g_demo.py` that hardcodes `degree` 2.

**Pedagogical impact:** Graph features remain abstract slogans. Connection to S31 evidence graph is verbal only.

---

### ISSUE-06 · P1 · I Do demos are trivial print-stubs (low “Yo hago” fidelity)

**Evidence samples:**
- `S32-T4-A-DEMO`: `split_sizes(1, 1, 0)` returns its own arguments.
- `S32-T3-B-DEMO`: reads `state["median"]` only.
- `S32-T1-A-DEMO`: `sorted(schema.get("numeric", []))`.

Theory sometimes has slightly richer code than iDo (e.g. ModeImputer exists in theory, simplified away in iDo).

**Pedagogical impact:** Gradual release requires a **complete worked example** before guided practice. Here the demonstration is thinner than industry docs the student is linked to. Cognitive apprenticeship fails at the modeling stage.

---

### ISSUE-07 · P1 · You Do is a skeleton, not a portfolio project

**Evidence:**

```python
catalog = {"numeric": [], "categorical": [], "text": []}
state = {"version": "fs-v1"}
if __name__ == "__main__":
    print(state["version"])
```

Objectives list full pipeline (catalog, windows, graph, fs-vN, leakage scan, split) but starter has empty catalog and no acceptance tests, no sample event table, no expected artifact schema.

**Pedagogical impact:** You Do cannot transfer skill; students without strong prior knowledge will either stall or invent inconsistent deliverables. Rubric weights “gate V3” over concrete artifacts.

---

### ISSUE-08 · P1 · edgeCases copy is inverted / copy-pasted nonsense

**Evidence (many steps):**

```text
edgeCases: ["falta schema", "fixture adverso: row keys ⊆ catalog con catalog_ok", …]
```

The “adverso” description restates the **happy path** rule, not the adversarial condition (unknown feature / silent_fill / includes_t / uses_label / overlap>0).

**Pedagogical impact:** Hints and edgeCases mis-teach failure modes. A student reading edgeCases learns the opposite of the breach.

---

### ISSUE-09 · P1 · Telegraphic theory prose vs progressive disclosure (compare S01)

**Evidence style (S32 T1-A):** three short paragraphs: semantics → contrato → aplicación CASO, dense with `type→cols`, `keys ⊆ catálogo`, breach codes.

**S01 contrast:** multi-paragraph dictionary, motivation, Peru workplace framing, REPL vs script, hover glossary strategy.

**Pedagogical impact:** For “Competente a experto” this density might be intentional, but S32 introduces **new ML ops concepts** (train–serve skew, feature set versioning, group leakage) that still need worked narrative. Without progressive disclosure, intrinsic + extraneous load spike (Sweller). Missing: why leakage is catastrophic in investigation workbenches; a failing story before the correct window.

---

### ISSUE-10 · P1 · No real sklearn / pandas pipeline despite outcomes and resources

**Outcomes:** “Componer transformers reutilizables”, “Persistir fit y reutilizar en inferencia”, “Aplicar missing indicators, scale y encoding.”

**Reality:** pure-Python micro-snippets; no `Pipeline`, `ColumnTransformer`, `SimpleImputer`, `OneHotEncoder`, `StandardScaler`, no `joblib` persistence demo (resources mention model persistence).

**Pedagogical impact:** Transfer to workplace stack is weak. External materials (sklearn common pitfalls) show fit_transform only on train via Pipeline—the section claims this principle but never exercises the library that enforces it.

---

### ISSUE-11 · P2 · Grammar / redaction / register (Peruvian Spanish)

Issues found:
- Headings lowercased inconsistently: `numéricas/categóricas/texto` vs full Spanish titles elsewhere.
- Mixed EN tokens without gloss: “Breach”, “silent fill”, “serve”, “train≡serve”, “only” in callout (“PII sintético only”).
- `jobRelevance` sentence fragments and meta asides hurt professional Spanish register.
- Em dash / en dash inconsistency (`train–serve` vs `train-serve`).
- Some instructions are machine-templated: “Reemplaza la expresión booleana defectuosa, no los datos ni el assert” ×24 → monotony.

Not catastrophic Spanish; not S01-quality redaction.

---

### ISSUE-12 · P2 · Learning outcomes are checklist fragments without observability criteria

```text
"Diseñar features numéricas/categóricas/texto"
"Detectar leakage y versionar features"
```

No “evidence of mastery” (e.g. “produce `fs-vN` JSON with schema hash and zero-overlap split report”). Rubric partially compensates but is itself meta-heavy (ISSUE-01).

---

### ISSUE-13 · P2 · Self-check depth vs section breadth

Five MCQs cover half-open, fit order, entity overlap, label names (2×). Good targeting, but:
- No item on missing indicators / train-only stats.
- No item on train–serve skew measurement.
- No item on feature catalog unknown keys.
- Two questions are near-duplicates on label leakage (Q4 and Q5).

Active recall under-samples T1 and T3-B.

---

### ISSUE-14 · P2 · Estimated hours (18h) vs content substance

Rough realistic effort with current materials: theory+iDo ~2–3h, We Do boolean repair ~2–3h, You Do stub ~1–4h free-form. Gap of ~10h either implies missing labs or inflated marketing. Harms planning honesty.

---

### ISSUE-15 · P2 · Consistency with roadmap (S31 → S32 → S33)

**Good edges:** Continues CP-N3-B; reuses graph concepts; handoff “antes de entrenar el baseline S33” in iDo why of T4-B.

**Weak edges:** Does not import concrete S31 artifacts (edge list, path API) into a real feature builder; S33 cannot assume a shared feature table schema beyond prose `fs-vN`.

**Legacy id risk:** Hash `microservices` on live routing will confuse SEO/bookmarks and mentor communication (“open microservices section” ≠ microservices content). Same class of issue as S31 `streaming-data`.

---

### ISSUE-16 · P2 · Theory T1-A `catalog_ok` API is awkward / partially wrong teaching surface

```python
unknown = any(k not in known for k in row)
return sorted(schema["numeric"]), len(row["note"]), unknown
```

- Hardcodes `row["note"]` instead of using catalog text policy (`note_len` / `token_count` as named features).
- Returns length of raw note rather than documenting derived features as catalog entries.
- `unknown` is a boolean but named like a collection; easy to misread in PASS logic of We Do (pre-baked `catalog_ok`).

---

### ISSUE-17 · P3 · Feedback / hints template monotony

Almost all feedback strings: “explica qué campo cambió la decisión, por qué el adverso activa REJECT_… y por qué faltar X exige REQUEST_…”. Correct fail-closed idea, but zero variety and no prompt to recompute features from raw data.

---

### ISSUE-18 · P3 · Positive notes (preserve in Fixer)

- Ethical boundary: shared address / degree are **not** fraud or kinship labels.
- Gate vocabulary (`REJECT_FUTURE_TS`, `REJECT_LABEL_AS_FEATURE`, `REJECT_ENTITY_OVERLAP`) is interview-relevant.
- Window half-open policy is correctly stated when shown (`t - w <= ts < t`).
- Resources list is excellent and should remain.
- Self-check Q1–Q4 directions are pedagogically sound.

---

## 4. Meta-Leak Report

Exact leaked / internal-facing strings (user-visible surfaces in `s32-microservices.ts`):

| # | Location | Exact text / fragment | Why it is a leak |
| --- | --- | --- | --- |
| M1 | `jobRelevance` | `Id \`microservices\` conservado; V3 **Feature engineering y pipelines sin leakage** para el workbench CP-N3-B` | Curriculum versioning + platform hash maintenance note |
| M2 | theory intro ¶1 | `En V3, **S32 no es Docker/K8s**` | Addresses authors/migrators, not learners |
| M3 | theory intro ¶3 | `Id legacy \`microservices\` se conserva` | Same as M1 |
| M4 | theory intro callout | `Sin section_passed si hay future ts` | Internal progress-gate field name |
| M5 | `youDo.rubric[0]` | `Alineación al gate V3 de la sección` | Version/process gate, not learning criterion |
| M6 | Multiple intros | Heavy use of internal run codes without student glossary: `cpn3b-feat`, `CP-N3-B`, `CASO-LIM-032-*` as if they were self-explanatory product IDs | Borderline: acceptable as case ids if introduced; currently dropped cold after meta-heavy V3 framing |

**Not counted as meta-leak (lab scaffolding):** `# DEFECT: …` comments in starters—these are intentional for E1 repair pattern (but see ISSUE-02: the pattern itself is pedagogically thin).

**Meta-leak count (strict user-facing developer notes): 5** (M1–M5); M6 as soft/product-id hygiene.

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Pre-round research anchors (applied)

| Source / principle | Implication for S32 | S32 status |
| --- | --- | --- |
| sklearn *Common pitfalls* — fit only on train; Pipeline prevents leakage | Demos must fit on train and transform test/serve with frozen state | Claimed in prose; not practiced with Pipeline |
| Google *Rules of ML* — training–serving skew (Rules 29–37) | Measure skew; reuse code train/serve; log features at serve | Named (`skew`, `fs-vN`); no measurement workflow lab |
| Gradual release (I/We/You Do) | Demo full skill → guided → independent transfer | Broken: We/You do not construct features |
| Cognitive load theory | Segment new schemas; glossary; worked example before problem | Telegraphic; no dictionary; We Do is flag-matching |
| Desirable difficulties / active recall | Quiz + productive struggle on *computations* | Quiz OK; struggle is boolean polarity |
| S01 gold standard | Motivation, PE workplace, progressive vocabulary | Missing at S32 depth |

### 5.2 I Do / We Do / You Do fidelity

```
Ideal:  I Do builds window + imputer + catalog → We Do repairs / extends code → You Do full fs-vN table
Actual: I Do prints constants → We Do flips flags → You Do empty catalog print version
```

**We Do structure (E1 guided / E2 independent / E3 transfer)** is *formally* present (kind fields + three routes CONTINUE/REJECT/REQUEST) and that fail-closed branching is valuable—but it is applied to **pre-labeled contracts**, not to **feature math**. The transfer step (E3) does not transfer feature skill; it transfers the REQUEST_* routing pattern only.

### 5.3 Cognitive load & progressive disclosure

- **Intrinsic load (high, appropriate):** leakage types (temporal, label, entity, statistical).
- **Extraneous load (high, inappropriate):** V3/legacy asides, 24× identical instruction templates, edgeCases inverted wording, hardcoded demos that don’t illustrate the math.
- **Germane load (low):** few opportunities to reorganize knowledge by building a real feature table.

Missing progressive path:
1. Story: model looks great offline, dies in serve (motivation).
2. Single numeric feature with future timestamp bug.
3. Fix window.
4. Add imputer with train-only median.
5. Add group split.
6. Package as `fs-vN`.

### 5.4 Connective tissue / narrative flow

- Opening is a **migration announcement** (“no es Docker/K8s”) rather than a learning hook.
- Links to S31 are asserted (“grafo de S31”) without a shared mini-fixture of edges.
- Handoff to S33 appears once in iDo why—good—but no “artifact contract” for S33 consumption.
- Within section, T1→T4 order is sound; paragraph rhythm is flat (contrato/error/criterio ×8).

### 5.5 Exercise & exam quality

| Layer | Count | Alignment | Quality |
| --- | --- | --- | --- |
| Theory code | 8 snippets | Topic labels | Mixed; some incorrect (ISSUE-03/05) |
| I Do | 8 | Same IDs | Too shallow |
| We Do | 24 | Gate codes | Template boolean; misaligned with skill claims |
| You Do | 1 | Outcomes list | Stub |
| SelfCheck | 5 | Core gates | OK; gaps on T1/T3-B; Q4≈Q5 |

No separate multi-item exam block beyond selfCheck (consistent with many sections).

### 5.6 Accessibility & motivation

- No plain-language definition block for: leakage, train–serve skew, feature store, half-open interval, group split.
- Motivation exists in tagline/jobRelevance (“features mal hechas filtran el futuro”) but is immediately polluted by meta-text.
- Synthetic PE case is good; underused (no tabla de eventos multi-fila realista).

### 5.7 Comparison with external best-in-class

| External | What they do well | Gap in S32 |
| --- | --- | --- |
| sklearn common pitfalls | Wrong vs right side-by-side with scores | No wrong-path numerical demo of optimistic metrics |
| Google Rules of ML | Engineering narrative + measurable skew | Mentions skew alert; no logging-at-serve exercise |
| Feature Engineering for ML (Zheng/Casari) | Worked feature recipes | No recipes; only gate checks |
| Feast docs | Offline/online parity | Linked only |
| Kaggle / practical FE courses | Notebooks with real transforms | Section stays flag-level |

### 5.8 Redaction pass (grammar sample fixes — not applied)

- “PII sintético only” → “solo PII sintético”.
- “numéricas/categóricas/texto” → “Features numéricas, categóricas y de texto”.
- Remove all “V3 / legacy id / section_passed” from student copy.
- Normalize “train–serve” spelling and expand first use: “sesgo train–serve (diferencia entre distribución/proceso de entrenamiento e inferencia)”.

---

## 6. Proposed GitHub-style Diffs

> Diffs are **proposals only** — Explorer does not apply them. Paths relative to repo root.

### DIFF-A · Strip meta-leaks from jobRelevance, intro, callout, rubric (ISSUE-01, Meta M1–M5)

```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ jobRelevance
-    "Features mal hechas **filtran el futuro** y crean modelos que fallan en producción. Id `microservices` conservado; V3 **Feature engineering y pipelines sin leakage** para el workbench CP-N3-B. Features de grafo/contacto no son etiqueta de fraude.",
+    "Features mal hechas **filtran el futuro** y crean modelos que fallan en producción. En esta sección construyes la **tabla de features versionada** del workbench de investigación relacional (CP-N3-B): misma lógica en entrenamiento e inferencia, sin timestamps futuros ni labels de decisión. Features de grafo o contacto compartido **no** son etiqueta de fraude ni de parentesco.",
@@ theory intro paragraphs
-        "En V3, **S32 no es Docker/K8s**: construyes la **tabla de features versionada** del workbench **CP-N3-B** con filas sintéticas por par entidad/caso (`run_id=cpn3b-feat`) en Red Andina ficticia. El gate es **train ≡ serve** sin leakage temporal ni de label.",
+        "Aquí construyes la **tabla de features versionada** del workbench **CP-N3-B** con filas sintéticas por par entidad/caso (`run_id=cpn3b-feat`) en la Red Andina ficticia. El gate es **train ≡ serve**: la misma transformación en entrenamiento e inferencia, sin leakage temporal ni de label.",
-        "Orden: **T1 tipos** → **T2 relacionales/grafo** → **T3 pipelines** → **T4 validación/leakage**. Id legacy `microservices` se conserva. Features de contacto/shared address **no** son etiqueta de fraude ni parentesco."
+        "Orden: **T1 tipos** → **T2 relacionales/grafo** → **T3 pipelines** → **T4 validación/leakage**. Features de contacto o shared address **no** son etiqueta de fraude ni parentesco."
@@ callout
-          "Train≡serve, sin leakage temporal ni de label. PII sintético only. Sin section_passed si hay future ts.",
+          "Train≡serve, sin leakage temporal ni de label. Solo PII sintético. Si hay timestamps futuros en features, la sección no se considera superada.",
@@ rubric
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Train≡serve, sin leakage temporal/de label y feature set versionado", weight: "25%" },
```

### DIFF-B · Fix T1-B theory code to scale the filled series (ISSUE-03)

```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ missing_scale.py
-def missing_and_scale(vals, fill=2, mu=0, sd=2):
-    ind = [v is None for v in vals]
-    filled = [fill if v is None else v for v in vals]
-    z = [(x - mu) / sd for x in [2, 4]]
-    return ind, filled, z
-
-ind, filled, z = missing_and_scale([1, None, 3])
-print(ind, filled)
-print(z)
-print("silent_fill", False)
+def missing_and_scale(vals, fill=2.0, mu=0.0, sd=2.0):
+    ind = [v is None for v in vals]
+    filled = [fill if v is None else float(v) for v in vals]
+    # μ/σ provienen del fit en train (congelados); nunca se reestiman en serve/test
+    z = [(x - mu) / sd for x in filled]
+    return ind, filled, z
+
+ind, filled, z = missing_and_scale([1, None, 3], fill=2.0, mu=0.0, sd=2.0)
+print(ind, filled)
+print(z)
+print("silent_fill", False)
@@ output
-[False, True, False] [1, 2, 3]
-[1.0, 2.0]
-silent_fill False
+[False, True, False] [1.0, 2.0, 3.0]
+[0.5, 1.0, 1.5]
+silent_fill False
```

### DIFF-C · Align T3-A heading/code with a real chain (ISSUE-04) — proposal sketch

```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ heading
-      heading: "ColumnTransformer y custom transformers",
+      heading: "Transformers custom y cadena fit→transform",
```

*Alternatively (preferred long-term):* keep the ColumnTransformer heading and replace `transformer.py` with a minimal pure-Python stand-in that routes numeric vs categorical columns (or a short sklearn snippet if the runtime allows), showing fit once and transform on a serve batch.

### DIFF-D · We Do E1 should compute the feature, not flip a flag (ISSUE-02) — exemplar for T2-B

```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ S32-T2-B-E1 starter (conceptual replacement)
-record = {"case_id": "CASO-LIM-032-2B", **{'events': [1, 2, 3, 5], 't': 5, 'w': 3, 'includes_t': False}}
-meets_contract = record["includes_t"] is True
-status = "PASS" if meets_contract else "REJECT_FUTURE_TS"
-print("S32-T2-B", status)
+events, t, w = [1, 2, 3, 5], 5, 3
+# DEFECT: usa <= t (incluye el instante de decisión)
+count = sum(1 for ts in events if t - w <= ts <= t)
+includes_t = any(ts == t for ts in events if t - w <= ts <= t)
+meets_contract = (count == 2) and (includes_t is False)
+# pista: corrige el predicado de ventana a half-open [t-w, t)
+status = "PASS" if meets_contract else "REJECT_FUTURE_TS"
+print("S32-T2-B", status)
```

Apply the same philosophy to T1-A (validate keys against catalog), T1-B (compute indicator+median from train list), T4-A (compute overlap from row list), T4-B (scan names + skew from means).

### DIFF-E · Fix edgeCases adversarial wording (ISSUE-08) — pattern

```diff
-        edgeCases: ["falta w", "fixture adverso: ventana half-open sin incluir t", "CASO-LIM-032-2B es sintético"],
+        edgeCases: ["falta w", "fixture adverso: includes_t=True o ts>=t en el conteo", "CASO-LIM-032-2B es sintético"],
```

Repeat per subtopic with true adversarial descriptions.

### DIFF-F · You Do starter with a real mini-table (ISSUE-07)

```diff
--- a/src/lib/course/sections/s32-microservices.ts
+++ b/src/lib/course/sections/s32-microservices.ts
@@ starterCode
-    starterCode: `# features CP-N3-B — CASO-LIM-032
-catalog = {"numeric": [], "categorical": [], "text": []}
-state = {"version": "fs-v1"}
-# Contrato de theory/iDo documentado (sin stubs)
-if __name__ == "__main__":
-    print(state["version"])
-`,
+    starterCode: `# features CP-N3-B — CASO-LIM-032 / run_id=cpn3b-feat
+# Entrega: catálogo, state versionado, ventana half-open, split sin overlap, scan de leakage.
+events = [
+    {"entity": "E1", "ts": 1, "canal": "app", "amount": 10.0},
+    {"entity": "E1", "ts": 2, "canal": "app", "amount": 12.0},
+    {"entity": "E2", "ts": 3, "canal": "web", "amount": 8.0},
+    {"entity": "E2", "ts": 5, "canal": "app", "amount": 9.0},
+]
+decision_t = 5
+catalog = {"numeric": ["amount_3t", "n_events_3t"], "categorical": ["canal_mode"], "text": []}
+state = {"version": "fs-v1", "median_amount": None}  # fit solo con train
+
+def window_count(entity_events, t, w):
+    raise NotImplementedError("half-open [t-w, t)")
+
+if __name__ == "__main__":
+    print(state["version"])
+`,
```

### DIFF-G · I Do T4-A: show real split (ISSUE-06)

```diff
-def split_sizes(n_train, n_test, overlap):
-    return n_train, n_test, overlap
-a, b, o = split_sizes(1, 1, 0)
+rows = [
+    {"ts": "2026-01-10", "entity": "e1"},
+    {"ts": "2026-02-10", "entity": "e2"},
+]
+cut = "2026-02-01"
+train = [r for r in rows if r["ts"] < cut]
+test = [r for r in rows if r["ts"] >= cut]
+overlap = set(r["entity"] for r in train) & set(r["entity"] for r in test)
+a, b, o = len(train), len(test), len(overlap)
```

### DIFF-H · Self-check: replace duplicate Q5; add train-stats item (ISSUE-13)

```diff
-      {
-        question: "Una feature que usa label_decision del futuro en train es…",
-        options: ["buena ingeniería de features", "obligatoria para el grafo", "irrelevante si hay z-score", "leakage: debe rechazarse en el scan de nombres/contrato"],
-        correctIndex: 3,
-        explanation:
-          "Anti-leakage: features no pueden incorporar la decisión/etiqueta futura.",
-      }
+      {
+        question: "Al estandarizar amount, μ y σ deben calcularse…",
+        options: [
+          "sobre train+test juntos para más datos",
+          "solo sobre train y reutilizarse en serve",
+          "solo sobre test para validar",
+          "de nuevo en cada fila de serve",
+        ],
+        correctIndex: 1,
+        explanation:
+          "Estadísticas de escalado/encoding se aprenden en fit (train) y se congelan; re-fit en test/serve es leakage o skew.",
+      }
```

### DIFF-I · Add short theory dictionary after intro (ISSUE-09)

```diff
+    {
+      heading: "Diccionario mínimo de la sección",
+      paragraphs: [
+        "**Leakage:** usar en el entrenamiento información que no existiría en el momento de la decisión (futuro, label, o identidad vista en test).",
+        "**Train≡serve:** el código y el estado (mediana, vocabulario, μ/σ) que transforman filas en train son los mismos que en inferencia.",
+        "**Ventana half-open [t−w, t):** cuenta eventos con timestamp ≥ t−w y **estrictamente < t**; no incluye el instante de decisión.",
+        "**Feature set `fs-vN`:** identificador versionado del catálogo + transformers fit; un cambio de vocab o schema sube N.",
+        "**Skew train–serve:** divergencia de distribuciones o de lógica entre entrenamiento e inferencia; se monitorea (p. ej. |mean_serve − mean_train|).",
+      ],
+    },
```

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue(s) | Rationale |
| --- | --- | --- |
| **1** | ISSUE-01 / Meta M1–M5 · DIFF-A | Fast, high trust impact; no pedagogy redesign required |
| **2** | ISSUE-03 · DIFF-B | Incorrect teaching code must not ship |
| **3** | ISSUE-02 · DIFF-D (roll across 8 subtopics) | Core skill of the section; largest learning gain |
| **4** | ISSUE-08 · DIFF-E | Cheap fix; stops inverted edgeCases |
| **5** | ISSUE-06 / ISSUE-07 · DIFF-G / DIFF-F | Restore I Do / You Do substance |
| **6** | ISSUE-04 / ISSUE-05 / ISSUE-10 · DIFF-C + graph path rewrite | Align headings, demos, and sklearn claims |
| **7** | ISSUE-09 / ISSUE-11 / ISSUE-12 · DIFF-I + outcomes polish | Narrative + Spanish register |
| **8** | ISSUE-13 / ISSUE-14 · DIFF-H + hours review | Quiz coverage; honesty on estimatedHours |
| **9** | ISSUE-15 | Contract artifact for S33 (schema of `fs-vN`) after content solid |

**Suggested Fixer batches**
1. Redaction/meta only (P0 surface).  
2. Correct broken theory demos.  
3. Rebuild We Do computational kernels (one subtopic at a time starting T2-B and T1-B).  
4. You Do + I Do enrichment.  
5. Glossary + quiz + hours.

---

## 8. Graph Memory Update notes

For shared curriculum graph / future Explorer-Fixer context:

```yaml
section: 32
id: microservices  # legacy hash; title is feature engineering
title: Feature engineering y pipelines sin leakage
explorer_score: 5.0
status_explorer: complete
depends_on:
  - S31: graph evidence (shared_address, degree, path) — verbal link only; needs shared fixture
feeds:
  - S33: baselines ML — expects fs-vN feature table without leakage
capstone: CP-N3-B
case_ids: [CASO-LIM-032, CASO-LIM-032-1A..4B]
run_id: cpn3b-feat
gates:
  - train_equiv_serve
  - half_open_window
  - no_label_as_feature
  - zero_entity_overlap
  - feature_set_version_fs_vN
  - skew_tol
meta_leaks:
  - V3 migration language
  - legacy id microservices in student copy
  - section_passed
  - gate V3 rubric
pedagogy_pattern: "contract_flag_lab_x24"  # anti-pattern: boolean invert, not FE compute
quality_edges:
  - resources: strong (sklearn, Feast, Rules of ML)
  - ethics: strong (no fraud label from graph feats)
  - weDo_skill_alignment: weak
  - theory_code_correctness: partial (T1-B broken, T2-A path noop)
gold_delta_vs_S01:
  - missing_dictionary
  - missing_motivation_story
  - thinner_worked_examples
fixer_ready: true
do_not_regress:
  - half_open policy statement
  - REJECT_* / REQUEST_* vocabulary
  - synthetic PII / no real fraud verdict framing
```

**Nodes to add in global memory:** `feature_catalog`, `half_open_window`, `train_serve_skew`, `fs_vN`, `entity_group_split`, `label_as_feature_ban`.

**Edges to reinforce:** S31.path_evidence → S32.graph_feats; S32.fs_vN → S33.baseline_input.

**Anti-pattern flag for batch audits:** `BOOLEAN_CONTRACT_LAB_TEMPLATE` shared across late phase-2 sections if present elsewhere.

---

## Summary counts

| Metric | Value |
| --- | --- |
| Overall score | **5.0 / 10** |
| Issues registered | **18** (incl. 1 positive-preservation note as ISSUE-18) |
| Actionable defects | **17** |
| P0 | 3 (meta-leak cluster, We Do hollow, T1-B wrong code) |
| P1 | 7 |
| P2 | 6 |
| P3 | 2 (monotony + preserve note) |
| Strict meta-leaks | **5** (M1–M5) |
| Diff groups proposed | **9** (A–I) |

---

This is the complete Explorer report for Section 32. Ready for the Fixer prompt.
