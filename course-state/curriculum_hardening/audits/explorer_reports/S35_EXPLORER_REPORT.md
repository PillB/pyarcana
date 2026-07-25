# S35 Explorer Report — Explicabilidad, equidad e incertidumbre

**Auditor role:** Curriculum Auditor · Pedagogical Analyst · Technical Editor (Stanford STORM + Graph + Loop + Harness)  
**Generated:** 2026-07-24  
**Scope constraint:** Section 35 only — analysis and proposed diffs; **no product files modified**.

---

## 1. Section Identification & Scope

| Field | Value |
|-------|--------|
| Index | **35** |
| Platform hash id | `system-design` (legacy id retained) |
| Live URL | https://pillb.github.io/pyarcana/#system-design |
| Source file | `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s35-system-design.ts` |
| Title (metadata) | Explicabilidad, equidad e incertidumbre |
| shortTitle (UI card) | Explainability y equidad |
| tagline | ficha de caso que distingue evidencia observada, contribución del modelo, incertidumbre y decisión humana |
| Phase / level | Phase 2 · Competente a experto |
| estimatedHours | 18 |
| Capstone thread | Inicio **CP-N3-C** (ficha de caso responsable); parte de S34 (métricas/umbrales/workbench) |
| Synthetic case | `CASO-LIM-035` · Red Andina (Lima, ficticia) |
| Subtopics | T1-A/B, T2-A/B, T3-A/B, T4-A/B (8) |
| iDo demos | 8 (`S35-T*-*-DEMO`) |
| weDo exercises | 24 (E1 guided / E2 independent / E3 transfer × 8) |
| youDo | Ficha 4 capas + model card + override audit |
| selfCheck | 5 MCQ |
| resources | Model Cards, sklearn inspection, Molnar, FairML, MAPIE, NIST AI RMF, TF Responsible AI, Coursera, MIT 6.100L, CS50P |

**In-scope artifacts reviewed**
- Full `s35-system-design.ts` (theory, iDo, weDo, youDo, selfCheck, resources)
- Live site curriculum card for Sección 35 (SPA hash; content body is source-driven)
- Gold bar: `GOLD_STANDARD_CHECKLIST.md` + early peer `s01-setup.ts`
- Prior automated audit: `S35_AUDIT.json` (ACCEPT, high_issue_count=0 — structural only; **not** gold-truth for pedagogy)
- Research anchors: Molnar Interpretable ML, FairML book, Model Cards (Mitchell et al.), sklearn permutation importance, MAPIE conformal, Frontiers XAI pedagogy (3-pillar conceptual/technique/practice)

**Out of scope:** Fixes, edits to curriculum TS, other sections.

---

## 2. Executive Summary of Quality

### Score: **7.3 / 10**

**Verdict:** Structurally complete and ethically strong (fail-closed, “explicar ≠ acusar”, synthetic Peru case, 4-layer ficha), but **pedagogically thinner and more template-driven** than early gold peers (S01–S03). The learner practices **contract predicates and REJECT codes** more than real explainability/fairness *mechanisms*. Multiple **developer meta-leaks** (legacy id, V3 retarget, `section_passed`) appear in learner-facing copy. WeDo `edgeCases` systematically describe the *valid* contract as the “fixture adverso,” which confuses remediation. YouDo is under-scaffolded relative to the 18h claim and gate weight.

**What works well**
- Clear product story: ficha de caso con capas evidencia | modelo | incertidumbre | humano
- Consistent ethics spine: `means_fraud=False`, `causal=False`, OOD → abstain, no auto-label, model card `out_of_scope`
- Full I Do / We Do / You Do + selfCheck + domain resources skeleton
- Progressive disclosure honesty on conformal as “toy” / conceptual
- Bridge from S34 metrics/thresholds into CP-N3-C

**What keeps it off gold (≥ 9.5)**
- Meta-text leakage and gate jargon in UI-facing fields
- Theory depth ≈ “contrato + toy print” vs S01 narrative + mechanism teaching
- WeDo isomorphic across 24 items (invert boolean → assess 3-path → decide fail-closed)
- Technique gap vs best-in-class XAI curricula (no SHAP/LIME/PDP naming, no comparative trade-offs)
- edgeCases inverted wording (24×)
- youDo starter ≈ print keys; rubric cites “gate V3”
- Lowercase theory headings; shortTitle EN/ES mix; selfCheck weak distractors

---

## 3. Detailed Issue Registry

Severity legend: **P0** blocker / leak · **P1** high pedagogy · **P2** medium clarity · **P3** polish.

### ISSUE-01 · P0 · Meta-leak: legacy id + V3 retarget in learner theory
- **Location:** theory intro paragraph 3; also jobRelevance; youDo.context  
- **Evidence:**  
  > `Id legacy \`system-design\` se conserva; V3 es explicabilidad y equidad, no diagramas de microservicios.`  
  > `Id \`system-design\` conservado.` (jobRelevance)  
  > `Id system-design conservado.` (youDo.context)  
- **Impact:** Breaks immersion; exposes curriculum migration notes; confuses learners who never saw “system design / microservices” as the section topic.

### ISSUE-02 · P0 · Meta-leak: `section_passed` and gate plumbing language
- **Location:** theory intro callout “Gate CP-N3-C”  
- **Evidence:**  
  > `Sin section_passed automático si falta evidencia o audit trail.`  
- **Impact:** Platform/dev vocabulary in student-facing tip; not Spanish-professional workplace framing.

### ISSUE-03 · P1 · Rubric criterion references internal “gate V3”
- **Location:** youDo.rubric[0]  
- **Evidence:**  
  > `Alineación al gate V3 de la sección`  
- **Impact:** Portfolio rubric should be learner-observable (4 capas, card, audit), not internal roadmap version labels.

### ISSUE-04 · P1 · WeDo edgeCases describe the *valid* contract as “fixture adverso” (systematic)
- **Location:** all 24 weDo steps, second edgeCases string  
- **Evidence (pattern):**  
  > `fixture adverso: ranking de drops con means_fraud=False y métrica de negocio`  
  > `fixture adverso: cuatro capas y causal=False en la ficha`  
  > `fixture adverso: n suficiente junto a precision de slice`  
  … (same inversion for T2-B–T4-B)  
- **Impact:** Learners (and Fixer) reading edgeCases get the **opposite** of the adverse fixture. Adverses actually set `means_fraud=True`, incomplete layers, `slice_n=5`, `action=auto_label`, etc. Undermines self-check of understanding.

### ISSUE-05 · P1 · Theory and iDo are mechanism-thin (“contrato theater”)
- **Location:** theory code blocks `perm_imp.py`, `local_exp.py`, `slices.py`, … and parallel iDo demos  
- **Evidence:**  
  - Permutation “importance” = `max(drops, key=drops.get)` on a hand-written dict (no shuffle, no metric recompute).  
  - Local explanation = value×weight only; no baseline/reference, no SHAP framing.  
  - Interval = `p±q` labeled `level="toy"`.  
  - OOD = `max(|z|) > thr`.  
- **Pedagogical impact:** Correct ethics flags, but weak transfer to real inspection APIs (sklearn `permutation_importance`, MAPIE, etc.) listed in resources. Compared to Frontiers XAI pedagogy (conceptual foundation + technique modules + practical integration) and Molnar’s technique depth, this is **policy literacy**, not **explainability craft**.

### ISSUE-06 · P1 · WeDo isomorphic template reduces progressive release quality
- **Location:** weDo intro claims “24 retos”; each subtopic E1/E2/E3  
- **Evidence:** Every E1 inverts a boolean; every E2 is `assess` PASS/REJECT/MISSING; every E3 is `decide` CONTINUE/REJECT/REQUEST_*. Hints share near-identical phrasing (“revisa dirección de comparación…”).  
- **Impact:** After 2–3 subtopics, exercises become pattern-matching, not XAI reasoning. E3 does not transfer to a new representation (e.g., write a 4-layer dict from raw score+features); it reuses the same gate.

### ISSUE-07 · P1 · youDo under-scaffolded for CP-N3-C portfolio claim
- **Location:** youDo.starterCode  
- **Evidence:**  
  ```python
  case = {
      "evidence": ["shared_phone"],
      "model": {"contrib": {}, "means_fraud": False},
      "uncertainty": {"interval": None, "ood": False},
      "human": {"decision": None, "by": None},
  }
  if __name__ == "__main__":
      print(sorted(case.keys()))
  ```  
- **Impact:** Gold bar expects independent challenge with real defect/work; printing keys does not force integration of perm/local/slice/OOD/card/audit taught above. Risk of empty portfolios.

### ISSUE-08 · P2 · Theory headings violate Spanish title casing / consistency
- **Location:** 8 subtopic headings  
- **Evidence:** `"coeficientes e importancia por permutación"`, `"explicación local, correlación y límites"`, … vs intro `"Inicio CP-N3-C: ficha de caso responsable"`  
- **Impact:** Visual redaction quality; looks machine-generated vs S01 capitalized narrative headings.

### ISSUE-09 · P2 · shortTitle EN/ES mix vs title ES
- **Location:** metadata shortTitle  
- **Evidence:** shortTitle `Explainability y equidad` vs title `Explicabilidad, equidad e incertidumbre`  
- **Impact:** Live curriculum card shows English “Explainability”; breaks es-PE brand consistency (S01: fully Spanish shortTitle).

### ISSUE-10 · P2 · jobRelevance too thin + leak vs gold peer
- **Location:** jobRelevance  
- **Evidence:** one dense sentence with id note; no workplace scene (risk ops / cola de revisión / analista en Lima) comparable to S01’s multi-sentence framing.  
- **Impact:** Motivation and “why this week matters” under-served for 18h competente→experto content.

### ISSUE-11 · P2 · Callout vs code inconsistency (timestamp; REQUEST codes)
- **Location:** S35-T4-B theory callout vs `governance.py` / exercises  
- **Evidence:** callout says `audit by/timestamp` but schema/checks only `case`, `human`, `by` — no `timestamp` field. T2-A callout omits `REQUEST_SLICE_N` used in E3.  
- **Impact:** Contract drift; learner cannot satisfy “timestamp” requirement from taught code.

### ISSUE-12 · P2 · Learning outcomes are telegraphic; uneven measurability
- **Location:** learningOutcomes  
- **Evidence:** `"Explicar con coeficientes e importancia"` (no success criterion); others denser (`Documentar model card y contestabilidad`).  
- **Impact:** Harder self-assessment; weaker alignment with youDo/selfCheck.

### ISSUE-13 · P2 · SelfCheck distractors too weak / double-barreled items
- **Location:** selfCheck Q1–Q5  
- **Evidence:** options like `"Solo UI"`, `"Borrar logs"`, `"Ignorar"`; Q5 packs layers + causal + OOD + audit into one correct option while wrong options are cartoonish.  
- **Impact:** Active recall undershoots; 70% gate becomes trivial relative to section density.

### ISSUE-14 · P2 · Cognitive load: breach-code vocabulary explosion
- **Location:** theory callouts + 24 exercises  
- **Evidence:** codes include `REJECT_CAUSAL_CLAIM`, `REQUEST_METRIC_DROP`, `REJECT_LOW_N_CLAIM`, `REQUEST_SLICE_N`, `REJECT_PROXY_FEATURE`, `REQUEST_PROXY_AUDIT`, `REJECT_POINT_ONLY`, `REQUEST_INTERVAL`, `REJECT_AUTO_LABEL`, `REQUEST_OOD_POLICY`, `REJECT_SCOPE_BREACH`, `REQUEST_CARD_KEYS`, `REJECT_SILENT_OVERRIDE`, `REQUEST_AUDIT_FIELDS`.  
- **Impact:** Working memory load competes with conceptual learning (permutation vs local, slice n, OOD policy). Codes are valuable for ops culture but need a single glossary table in intro.

### ISSUE-15 · P2 · Comparative gap vs external gold (XAI / fairness curricula)
- **Benchmarks:** Molnar (technique taxonomy + limits), FairML book (group metrics, proxies), Model Cards paper, sklearn inspection docs, Frontiers XAI course design (comparative / application / critical questions), NIST AI RMF.  
- **Gaps:** No explicit global vs local taxonomy table; no group fairness metric names (e.g., TPR gap) beyond precision@slice; conformal only toy; no “how could a biased model trick importance?” critical question; resources exist but theory does not *use* them.  
- **Impact:** Strong ethics product framing; weaker interview-ready XAI vocabulary.

### ISSUE-16 · P3 · Theory paragraph density vs progressive disclosure
- **Location:** each subtopic 3 short paragraphs (concept / contrato / CASO-LIM)  
- **Evidence:** Meets structural ≥3 paragraphs but average depth is “contract shell + case one-liner,” flagged in gold checklist as anti-pattern when mechanism is missing.  
- **Impact:** Feels like residual “template triplet” even when ethics content is real.

### ISSUE-17 · P3 · weDo intro overclaims “ocho fixtures … distintos” clarity
- **Location:** weDo.intro  
- **Evidence:** 8 case_id suffixes (1A…4B) reused across E1–E3; adverses mutate same ids. “Distintos” is partially true for slots, not for 24 unique scenarios.  
- **Impact:** Minor honesty/clarity issue.

### ISSUE-18 · P3 · iDo `why` good; descriptions still demo-toy
- **Location:** iDo steps  
- **Evidence:** e.g. `d = {"f1": 0.02, "f2": 0.1}` — computes max but teaches little about metric drop semantics from theory (`precision@k`, `shared_phone`).  
- **Impact:** Missed opportunity to reuse CASO-LIM feature names for narrative continuity (theory has them; demos often don’t).

### ISSUE-19 · P3 · Mixed punctuation / typography in starter comments (acceptable but uneven)
- **Location:** starterCode comments `# DEFECT: ...`  
- **Note:** Pedagogical DEFECT comments are **not** meta-leaks (learner-facing scaffold). Keep; do not remove.  
- **Impact:** None if consistent; ensure Spanish where possible for es-PE.

### ISSUE-20 · P1 · Domain claim vs taught skill: “conformal conceptualmente”
- **Location:** T3-A heading + learningOutcome “Comunicar incertidumbre y conformal”  
- **Evidence:** Code is symmetric `p±q`; MAPIE linked but never sketched (calibration set, coverage guarantee).  
- **Impact:** Outcome promises “conformal”; content delivers interval toy. Either rename outcome or add one honest conceptual paragraph + non-library sketch of coverage.

---

## 4. Meta-Leak Report

| # | Exact leaked / internal text | Location in `s35-system-design.ts` | Classification |
|---|------------------------------|------------------------------------|----------------|
| M1 | `Id \`system-design\` conservado.` | `jobRelevance` | Developer migration note |
| M2 | `Id legacy \`system-design\` se conserva; V3 es explicabilidad y equidad, no diagramas de microservicios.` | theory[0].paragraphs[2] | Roadmap retarget note to learner |
| M3 | `Sin section_passed automático si falta evidencia o audit trail.` | theory[0].callout.content | Platform gate API term |
| M4 | `Id system-design conservado.` | youDo.context | Same as M1 |
| M5 | `Alineación al gate V3 de la sección` | youDo.rubric[0].criterion | Internal version label |

**meta_leak_count: 5** (M1–M5)

**Not counted as leaks (intentional learner scaffolds):**
- `CP-N3-C`, `CASO-LIM-035`, REJECT/REQUEST codes (domain ops vocabulary once explained)
- Starter `# DEFECT:` comments (exercise design for learners)
- `Breach → REJECT_*` in callouts (policy contracts)

**Recommended learner-facing rewrites (intent only):**
- Replace id/V3 notes with product framing: “El id técnico de la sección en la plataforma es estable; el contenido que practicas es la ficha de caso responsable.”
- Replace `section_passed` with “no marques la sección como lista si falta evidencia o audit trail.”
- Rubric: “Cumple el gate de ficha 4 capas + card + audit (CP-N3-C).”

---

## 5. Pedagogical & Redaction Deep Dive

### 5.1 Meta-text / developer leakage
See §4. Severity is **high** because leaks sit in jobRelevance, first theory block, and portfolio rubric — highest-visibility surfaces.

### 5.2 Grammatical correctness & redaction (español peruano)
- Prose is largely grammatical, professional-technical, and consistent with fail-closed ethics voice used from S31–S34.
- Issues: lowercase headings (ISSUE-08); shortTitle anglicism (ISSUE-09); anglicisms `PASS`/`REJECT` are acceptable as code enums if introduced once in Spanish.
- Tone is more “ops contract manual” than S01’s conversational coach; acceptable at competente→experto if humanized slightly (motivation paragraph, glossary).
- Informal “gritar inequidad” is fine in PE register for emphasis; keep or soften to “afirmar inequidad”.

### 5.3 Connective tissue & narrative flow
- **Strong:** Explicit handoff from S34; order map T1→T4; repeated ethics refrain “explicar no es acusar”.
- **Weak:** Little connective tissue *between* subtopics beyond numbering (why local after global? why OOD after intervals?). S01-style “por eso ahora…” bridges missing.
- **Risk:** CP-N3-C / gate language without a one-screen dictionary of capa terms for learners who skimped S34.

### 5.4 I Do / We Do / You Do fidelity
| Layer | Fidelity | Notes |
|-------|----------|-------|
| I Do | Partial | 8 demos with why + output; compute simple functions; under-use case narrative |
| We Do | Structural yes / pedagogical partial | 24 items, clear defect, fail-closed E3 — but isomorphic template |
| You Do | Weak | Objectives good; starter insufficient; rubric partially internal |
| SelfCheck | Minimal | 5 MCQ; weak distractors |

Gradual release is **declared** but E1→E3 mainly escalates gate branching, not technique complexity.

### 5.5 Cognitive load & progressive disclosure
- Ethics and 4-layer separation: well progressive.
- Technique complexity: **under**-disclosed (too flat/simple).
- Ops codes: **over**-disclosed without glossary (ISSUE-14).
- Conformal: honest “toy” but outcome overclaims (ISSUE-20).

### 5.6 Exercise & exam quality and alignment
- Alignment to “no causal / no fraud label / report n / abstain OOD / card scope / audit override” is **excellent**.
- Alignment to “compute permutation importance / local contribution mechanics / slice analysis craft” is **weak** — exercises validate flags, not analyses.
- edgeCases inversion (ISSUE-04) is a correctness bug in metadata.
- selfCheck does not stress proxies FP delta, low-n claims, or model card keys.

### 5.7 Consistency with roadmap & previous sections
- Matches SECTION_MAP / V3 title (explicability/fairness/uncertainty) despite legacy id.
- Continues Red Andina / CASO-LIM / no-PII / no-fraud-label doctrine from S30–S34.
- Feeds S39 Case Triage N3 narrative correctly as CP-N3-C start.

### 5.8 Comparison with best-in-class external materials
| External | Standard | S35 relative |
|----------|----------|--------------|
| Molnar IML | Technique + limits + pitfalls | Ethics limits yes; techniques toy |
| FairML book | Group metrics, causality of harm | Slices + proxies named; metrics shallow |
| Model Cards (Mitchell) | Structured card sections | Minimal keys only — good start |
| sklearn inspection | Real perm importance API | Linked, not taught |
| MAPIE | Coverage / conformal | Linked, toy p±q only |
| Frontiers XAI pedagogy | Comparative + critical questions | Missing |
| S01 gold peer | Narrative + mechanism + workplace | S35 thinner |

### 5.9 Other (accessibility, motivation, clarity)
- Synthetic data and no real PII: excellent accessibility/ethics.
- Motivation for risk analyst role underplayed (ISSUE-10).
- Live SPA: curriculum card shows shortTitle EN mix; full section content loads from TS in app.

---

## 6. Proposed GitHub-style Diffs

> Paths relative to repo root. **Do not apply in Explorer run.** Line contexts approximate; Fixer must re-read file before patching.

### Diff A — Remove meta-leaks (ISSUE-01, 02, 03 / M1–M5)

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
@@ jobRelevance
-    "Inicias **CP-N3-C**: la ficha de caso separa **evidencia**, **modelo**, **incertidumbre** y **decisión humana**. Id `system-design` conservado. Explicar no es acusar de fraude.",
+    "Inicias **CP-N3-C**: en un workbench de revisión (p. ej. riesgo operativo en Lima, datos sintéticos) la **ficha de caso** separa **evidencia observada**, **contribución del modelo**, **incertidumbre** y **decisión humana**. Explicar un score **no** es acusar de fraude ni de parentesco.",
@@ theory intro P3
-        "Orden: **T1 explicación** → **T2 equidad/slices** → **T3 incertidumbre/OOD** → **T4 model card/override**. Id legacy `system-design` se conserva; V3 es explicabilidad y equidad, no diagramas de microservicios. Explicar **no** es acusar."
+        "Orden de la sección: **T1 explicación** (global y local) → **T2 equidad/slices y proxies** → **T3 incertidumbre y abstención OOD** → **T4 model card, contestabilidad y override**. El producto es la ficha auditable; explicar **no** es acusar."
@@ callout Gate CP-N3-C
-          "Inicio CP-N3-C: la ficha distingue capas; explicar no es acusar. Sin section_passed automático si falta evidencia o audit trail.",
+          "Inicio CP-N3-C: la ficha distingue las cuatro capas; explicar no es acusar. No des por cerrada la sección si falta evidencia, banda de incertidumbre o audit trail del override.",
@@ youDo.context
-      "Arma plantilla de ficha de caso con explicación local, slices, OOD abstain y model card sobre CASO-LIM-035. Id system-design conservado. Sin PII real ni auto-etiqueta de fraude.",
+      "Arma la plantilla de ficha de caso con explicación local, slices, abstención OOD y model card sobre CASO-LIM-035. Sin PII real ni auto-etiqueta de fraude.",
@@ rubric
-      { criterion: "Alineación al gate V3 de la sección", weight: "25%" },
+      { criterion: "Ficha CP-N3-C: cuatro capas + límites causal/means_fraud", weight: "25%" },
```

### Diff B — shortTitle + headings casing (ISSUE-08, 09)

```diff
--- a/src/lib/course/sections/s35-system-design.ts
+++ b/src/lib/course/sections/s35-system-design.ts
-  shortTitle: "Explainability y equidad",
+  shortTitle: "Explicabilidad y equidad",
@@ headings (each subtopic)
-      heading: "coeficientes e importancia por permutación",
+      heading: "Coeficientes e importancia por permutación",
-      heading: "explicación local, correlación y límites",
+      heading: "Explicación local, correlación y límites",
-      heading: "cohortes y métricas por slice",
+      heading: "Cohortes y métricas por slice",
-      heading: "proxies, sample size y daño diferencial",
+      heading: "Proxies, tamaño muestral y daño diferencial",
-      heading: "calibración, intervalos/conformal conceptualmente",
+      heading: "Calibración e intervalos (conformal a alto nivel)",
-      heading: "out-of-distribution y abstención",
+      heading: "Out-of-distribution y abstención",
-      heading: "model card y contestabilidad",
+      heading: "Model card y contestabilidad",
-      heading: "aprobación, override, apelación y retiro",
+      heading: "Aprobación, override, apelación y retiro",
```

### Diff C — Fix all edgeCases adverse descriptions (ISSUE-04)

Pattern (apply per subtopic; 24 occurrences):

```diff
# T1-A (×3 exercises)
-        edgeCases: ["falta drops", "fixture adverso: ranking de drops con means_fraud=False y métrica de negocio", "CASO-LIM-035-1A es sintético"],
+        edgeCases: ["falta drops", "fixture adverso: means_fraud=True (interpreta importancia como fraude)", "CASO-LIM-035-1A es sintético"],
# T1-B
-        edgeCases: ["falta layers", "fixture adverso: cuatro capas y causal=False en la ficha", "CASO-LIM-035-1B es sintético"],
+        edgeCases: ["falta layers", "fixture adverso: causal=True o layers incompletas", "CASO-LIM-035-1B es sintético"],
# T2-A
-        edgeCases: ["falta slice_n", "fixture adverso: n suficiente junto a precision de slice", "CASO-LIM-035-2A es sintético"],
+        edgeCases: ["falta slice_n", "fixture adverso: slice_n < min_n con claim de precisión alta", "CASO-LIM-035-2A es sintético"],
# T2-B
-        edgeCases: ["falta action", "fixture adverso: proxy high con acción de mitigación o review", "CASO-LIM-035-2B es sintético"],
+        edgeCases: ["falta action", "fixture adverso: action=auto_label sobre proxy high", "CASO-LIM-035-2B es sintético"],
# T3-A
-        edgeCases: ["falta q", "fixture adverso: intervalo con q>0 y level distinto de point", "CASO-LIM-035-3A es sintético"],
+        edgeCases: ["falta q", "fixture adverso: q==0 y level=point (solo score puntual)", "CASO-LIM-035-3A es sintético"],
# T3-B
-        edgeCases: ["falta action", "fixture adverso: OOD detectado con action abstain y sin auto-label", "CASO-LIM-035-3B es sintético"],
+        edgeCases: ["falta action", "fixture adverso: OOD con action=auto_fraud", "CASO-LIM-035-3B es sintético"],
# T4-A
-        edgeCases: ["falta out_of_scope", "fixture adverso: card con use queue_rank, out_of_scope fraud_label y contestability", "CASO-LIM-035-4A es sintético"],
+        edgeCases: ["falta out_of_scope", "fixture adverso: use=fraud_label y contestability=False", "CASO-LIM-035-4A es sintético"],
# T4-B
-        edgeCases: ["falta by", "fixture adverso: override con case, human y by no vacío", "CASO-LIM-035-4B es sintético"],
+        edgeCases: ["falta by", "fixture adverso: by vacío (override silencioso)", "CASO-LIM-035-4B es sintético"],
```

### Diff D — Align T4-B callout with code (ISSUE-11)

```diff
-          "S35-T4-B: audit by/timestamp. Breach → REJECT_SILENT_OVERRIDE; falta fields → REQUEST_AUDIT_FIELDS.",
+          "S35-T4-B: audit con case, human y by no vacío. Breach → REJECT_SILENT_OVERRIDE; falta fields → REQUEST_AUDIT_FIELDS. (Timestamp recomendado en portfolio; no exigido en el demo mínimo.)",
```

Optional stronger fix: add `"ts": "2026-07-24T12:00:00Z"` to event and require key `ts` in `audit_event` — only if exercises updated consistently.

### Diff E — Glossary + bridge in theory intro (ISSUE-14, connective tissue)

```diff
@@ after theory intro paragraphs, add paragraph or callout
+      paragraphs: [
+        "...existing...",
+        "Glosario mínimo de la ficha: **evidencia** = hechos del caso; **modelo** = score y contribuciones (no veredicto); **incertidumbre** = banda/OOD; **humano** = decisión con `by` auditable. Códigos de política: `REJECT_*` = incumplimiento; `REQUEST_*` = falta dato para decidir; `CONTINUE`/`PASS` = contrato satisfecho en el lab.",
+      ],
```

### Diff F — Deepen one mechanism example without new libraries (ISSUE-05, 18)

Example for T1-A theory code — still stdlib, teaches drop ranking *with* business metric name continuity:

```diff
 def rank_by_drop(drops, metric):
     ranked = sorted(drops.items(), key=lambda kv: kv[1], reverse=True)
     top_feat, top_drop = ranked[0]
     return {
         "metric": metric,
         "top_feature": top_feat,
         "drop": top_drop,
         "means_fraud": False,
     }

 report = rank_by_drop(
     {"shared_phone": 0.10, "amount_7d": 0.03, "region": 0.01},
     "precision_at_k",
 )
 print(report)
```

Mirror feature names in iDo demos (`shared_phone` not only `f1`/`f2`).

### Diff G — Strengthen youDo starter (ISSUE-07)

```diff
-    starterCode: `# ficha de caso CP-N3-C — CASO-LIM-035
-case = {
-    "evidence": ["shared_phone"],
-    "model": {"contrib": {}, "means_fraud": False},
-    "uncertainty": {"interval": None, "ood": False},
-    "human": {"decision": None, "by": None},
-}
-# Contrato de theory/iDo documentado (sin stubs)
-if __name__ == "__main__":
-    print(sorted(case.keys()))
-`,
+    starterCode: `# ficha de caso CP-N3-C — CASO-LIM-035
+# Completa contrib, intervalo, ood, card y audit. No inventes fraude.
+from copy import deepcopy
+
+case = {
+    "evidence": ["shared_phone", "amount_z"],
+    "model": {"contrib": {}, "means_fraud": False, "causal": False},
+    "uncertainty": {"interval": None, "ood": False, "reason": None},
+    "human": {"decision": None, "by": None},
+    "card": {"use": None, "out_of_scope": [], "contestability": False},
+}
+
+def fill_local_contrib(case, feats):
+    """feats: dict feature -> (value, weight). Rellena model.contrib."""
+    # TODO: implementa value*weight; deja means_fraud/causal en False
+    raise NotImplementedError
+
+def fill_uncertainty(case, p, q, zs, thr=3.0):
+    """Banda p±q; si OOD -> action abstain y no auto-label."""
+    raise NotImplementedError
+
+def fill_card_and_audit(case, owner="risk_ops"):
+    """use=queue_rank, out_of_scope incluye fraud_label, human.by obligatorio si hay decisión."""
+    raise NotImplementedError
+
+if __name__ == "__main__":
+    c = deepcopy(case)
+    # Demo mínimo esperado en portfolio: capas presentes + flags éticos
+    print(sorted(c.keys()))
+`,
```

### Diff H — Outcome honesty for conformal (ISSUE-20)

```diff
-    { text: "Comunicar incertidumbre y conformal" },
+    { text: "Comunicar incertidumbre con banda (y conformal solo a nivel conceptual)" },
```

Or expand T3-A paragraph with one coverage sentence referencing MAPIE without importing it.

### Diff I — SelfCheck tougher distractors (ISSUE-13) — sample Q2/Q5

```diff
-        question: "Perm importance prueba:",
-        options: ["Sensibilidad del modelo a barajar features", "Fraude", "Parentesco", "Causalidad legal"],
+        question: "La importancia por permutación, con la misma métrica de negocio, mide:",
+        options: [
+          "Sensibilidad del modelo al barajar una feature (drop de métrica)",
+          "La causa legal del comportamiento de una persona en el caso",
+          "Que el top_feature implica etiqueta de fraude",
+          "Paridad perfecta entre regiones sin reportar n",
+        ],
```

```diff
-        question: "Una explicación local del score del caso debe…",
-        options: ["afirmar causalidad legal de fraude", "omitir audit del override", "separar evidencia/modelo/incertidumbre/humano con causal=False", "forzar label en OOD"],
+        question: "En la ficha de caso, una explicación local correcta:",
+        options: [
+          "Separa evidencia, modelo, incertidumbre y humano, con causal=False",
+          "Convierte la mayor contribución local en prueba de fraude",
+          "Omite el campo by si el analista hace override_skip",
+          "Fuerza pred=1 cuando el vector z es OOD para no perder recall",
+        ],
```

### Diff J — Optional: one non-isomorphic E3 transfer (ISSUE-06)

Replace **one** E3 (e.g. T1-B-E3) so learner *builds* the 4-layer dict from raw fields instead of only flipping PASS/REJECT. Keep other E3s for fail-closed muscle memory. (Full replacement omitted for brevity; Fixer should design output contract `CONTINUE` only if all four keys present and `causal is False`.)

---

## 7. Recommended Priority Order for Fixing

| Priority | Issue IDs | Rationale |
|----------|-----------|-----------|
| **1** | ISSUE-01, 02, 03 (meta-leaks M1–M5) | User-facing pollution; zero pedagogical cost to remove |
| **2** | ISSUE-04 (edgeCases ×24) | Incorrect remediation guidance; mechanical fix |
| **3** | ISSUE-11 (timestamp / REQUEST consistency) | Contract honesty |
| **4** | ISSUE-07 + ISSUE-03 (youDo scaffold/rubric) | Portfolio is the section product |
| **5** | ISSUE-09, 08 (shortTitle + headings) | Brand/redaction |
| **6** | ISSUE-05, 18, 20 (mechanism depth + conformal honesty) | Raise expert rank toward gold |
| **7** | ISSUE-10, glossary ISSUE-14, bridges | Motivation + cognitive load |
| **8** | ISSUE-06, 13 (WeDo diversity, selfCheck) | After spine solid |
| **9** | ISSUE-12, 15–17 (outcomes polish, external depth) | Gold polish band |

**Do not prioritize:** rewriting all 24 exercises into wholly new forms in one pass (regression risk). Prefer edgeCases + meta-leak + youDo first.

---

## 8. Graph Memory Update Notes

Suggested updates for shared context (`GRAPH_MEMORY.json` / summary — **Explorer does not write product curriculum**):

```yaml
S35:
  id: system-design
  title: Explicabilidad, equidad e incertidumbre
  explorer_score: 7.3
  status_explorer: complete
  meta_leaks:
    - jobRelevance id conservado
    - theory legacy/V3 microservicios note
    - callout section_passed
    - youDo id conservado
    - rubric gate V3
  structural:
    theory_blocks: 9  # intro + 8
    iDo: 8
    weDo: 24
    youDo: present_weak_starter
    selfCheck: 5
  pedagogy_nodes:
    strength: ethics_4_layers_fail_closed
    weakness: template_weDo_contract_predicates
    weakness: mechanism_thin_perm_local_conformal
    defect: edgeCases_adverse_text_inverted_x24
  edges:
    prev: S34 metrics_thresholds_workbench
    next: S36 clustering_anomalies
    capstone: CP-N3-C_start -> S39 triage
  gold_gap_vs_S01:
    - narrative_workplace_depth
    - mechanism_before_contract
    - no_dev_meta_in_learner_copy
  external_anchors_ok:
    - model_cards_mitchell
    - sklearn_inspection
    - molnar_iml
    - fairmlbook
    - mapie
    - nist_ai_rmf
  fixer_first_wave:
    - strip_meta_leaks
    - fix_edgeCases
    - youDo_scaffold
    - shortTitle_es
```

**Note on prior PA rank 9.55 / S35_AUDIT ACCEPT:** automated paragraph ranks and structural ACCEPT are **insufficient** for gold. This Explorer expert judgment places S35 at **7.3** until meta-leaks, edgeCases, youDo, and mechanism depth are addressed.

---

## Analysis Pass Log (STORM-style, condensed)

1. **Surface scan:** structure 9/8/24 complete; resources domain-real; ethics refrain present.  
2. **Deep pedagogy:** WeDo isomorphism + thin mechanisms + weak youDo.  
3. **Redaction/grammar:** lowercase headings; EN shortTitle; PE tone OK.  
4. **Meta-leak:** 5 explicit learner-facing leaks.  
5. **Comparative:** below Molnar/FairML technique bar; strong on contestability/governance product framing.  
6. **Loop refine:** edgeCases inversion confirmed across all 24; callout/code timestamp drift confirmed; conformal outcome mismatch confirmed.

---

This is the complete Explorer report for Section 35. Ready for the Fixer prompt.
