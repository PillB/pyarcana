# S35 Fixer Report — Explicabilidad, equidad e incertidumbre

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-24  
**Scope lock:** Section 35 only (`id: system-design`)  
**Source (only product file edited):** `/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s35-system-design.ts`  
**Explorer baseline:** score **7.3 / 10** · 20 issues · 5 meta-leaks (M1–M5) · P0×2 · P1×7 · P2×7 · P3×4  
**Sole fix-guidance authority:** `/Users/pabloillescas/Projects/PyArcana/course-state/curriculum_hardening/audits/explorer_reports/S35_EXPLORER_REPORT.md`  
**Live:** https://pillb.github.io/pyarcana/#system-design  
**Repo:** https://github.com/PillB/pyarcana  
**Fleet target this pass:** score_after_estimate **≥ 9.5**

---

## Anti-Aberration Rules (acknowledged and obeyed)

1. **Forbidden:** bulk/automated content generation (Python/JS factories, blurb expanders, template loops that manufacture educational prose).  
2. **Forbidden:** placeholders, lorem-ipsum, TODO-as-content, copy-paste filler.  
3. **Required:** deliberate pedagogical craft for every paragraph, demo, exercise, and feedback line.  
4. **Self-correction:** if generation-by-script is started, discard and rewrite by hand.

This Fixer pass used targeted **validation** scripts only (execute existing solution snippets; greps for meta-leaks and inverted edgeCases). **All educational prose and code edits were written by hand.** No bulk generators, filler factories, or templated paragraph mass-production.

---

## 1. Summary of changes (mapped to Explorer issue IDs)

| Issue | Severity | Status | Change / evidence |
|-------|----------|--------|-------------------|
| **ISSUE-01** / M1–M2 Meta-leak legacy id + V3 retarget | P0 | **Fixed** | Removed from theory intro, `jobRelevance`, and youDo.context. Learner copy frames CP-N3-C product only. Grep clean. |
| **ISSUE-02** / M3 `section_passed` in callout | P0 | **Fixed** | Gate callout: “No des por cerrada la sección si falta evidencia, banda… o audit trail.” |
| **ISSUE-03** / M5 Rubric “gate V3” | P1 | **Fixed** | Rubric[0]: “Ficha CP-N3-C: cuatro capas + límites causal/means_fraud”. |
| **ISSUE-04** edgeCases inverted ×24 | P1 | **Fixed** | All 24 second-edgeCase strings describe the *adverse* fixture. Zero inverted leftovers. |
| **ISSUE-05** Theory/iDo mechanism-thin | P1 | **Fixed / deepened** | Theory + iDo compute domain ops; residual E1s compute ranking/contrib/slice/proxy/band/OOD/card/audit. Critical question on biased importance (T1-A). SHAP/LIME and conformal honesty named. |
| **ISSUE-06** WeDo isomorphic template | P1 | **Fixed (gold band)** | **Five** true transfers: **T1-B-E3** `build_ficha`, **T2-A-E3** `build_slice_report`, **T2-B-E3** `build_proxy_audit`, **T3-B-E3** `build_uncertainty`, **T4-A-E3** `build_card`. E1s compute domain ops; remaining E3s keep fail-closed muscle. Intro honesty updated. |
| **ISSUE-07** youDo under-scaffolded | P1 | **Fixed** | Runnable DEFECT `fill_*` bodies; asserts → `portfolio_ready`; workplace context Lima/Red Andina; measurable objectives. |
| **ISSUE-08** Lowercase theory headings | P2 | **Fixed** | All 8 subtopic headings title-cased in Spanish. |
| **ISSUE-09** shortTitle EN/ES mix | P2 | **Fixed** | `shortTitle: "Explicabilidad y equidad"`. Tagline capitalizada. |
| **ISSUE-10** jobRelevance thin + leak | P2 | **Fixed** | Multi-sentence workplace scene: workbench riesgo operativo, cola Lima, Red Andina sintético, CP-N3-C, audit trail. |
| **ISSUE-11** Callout timestamp vs code | P2 | **Fixed** | T4-B callout: audit case/human/by; timestamp recomendado en portfolio. T2-A includes `REQUEST_SLICE_N`. |
| **ISSUE-12** Telegraphic outcomes | P2 | **Fixed** | 8 measurable outcomes (ranking drop, local 4 capas, slice n, proxies, banda conceptual, OOD, card, audit). |
| **ISSUE-13** Weak selfCheck distractors | P2 | **Fixed** | 6 MCQ with professional distractors + low_n slice item. |
| **ISSUE-14** Breach-code vocabulary explosion | P2 | **Fixed** | Intro glossary: capas + REJECT_*/REQUEST_*/CONTINUE/PASS; “no memorices la lista entera”. |
| **ISSUE-15** External XAI technique gap | P2 | **Fixed (section-appropriate)** | Global/local taxonomy; SHAP/LIME trade-offs named; TPR gap; conformal calibration/coverage honesty; Molnar/FairML/MAPIE notes in resources aligned to theory. Full multi-module XAI elective remains out of scope for one 18h section. |
| **ISSUE-16** Theory paragraph density | P3 | **Fixed** | Bridges between T1→T4; mechanism + comparison + CASO-LIM application; progressive “por eso…” connective tissue. |
| **ISSUE-17** weDo “ocho fixtures distintos” | P3 | **Fixed** | Intro honesty + names five transfer E3s. |
| **ISSUE-18** iDo demo-toy feature names | P3 | **Fixed** | Demos use `shared_phone`, `amount_7d`, `amount_z`, `district_code`, CASO-LIM-035-4B. |
| **ISSUE-19** DEFECT comment typography | P3 | **Accepted** | `# DEFECT:` scaffolds retained intentionally (learner-facing). |
| **ISSUE-20** Conformal outcome overclaim | P1 | **Fixed** | Outcome: “banda p±q (conformal solo a nivel conceptual)”. Theory: set de calibración + cobertura; lab = banda toy. |

**High/medium required set (P0+P1+P2):** all resolved. **P3:** fixed or accepted by design.

### This pass — residual focus (Explorer-only authority)

Pre-state already closed M1–M5, edgeCases, youDo scaffold, shortTitle ES, conformal honesty, and three build_* transfers. **Residual P1 (ISSUE-06):** equity track E3s (T2-A, T2-B) were still isomorphic `decide` gates labeled “transfer.” This pass hand-crafted:

1. **T2-A-E3** → `build_slice_report` from raw `region/n/precision/min_n/claim` (ok_n vs low_n+parity claim).  
2. **T2-B-E3** → `build_proxy_audit` from raw `features` risk tags + `proposed_action` (no auto_label).  
3. **weDo.intro** honesty updated to list T1-B / T2-A / T2-B / T3-B / T4-A as real build transfers.

No platform id rename (`system-design` retained as SPA hash only — not learner-facing prose).

**Structural inventory:** theory map + **8** subtopics · **8** I Do · **24** We Do · You Do + rubric · **6** selfCheck · domain resources.

**Scope isolation:** Only `s35-system-design.ts` edited for product content. Reports under `fixer_reports/` only.

---

## 2. Corrected content (in-file)

All fixes live in:

`/Users/pabloillescas/Projects/PyArcana/src/lib/course/sections/s35-system-design.ts`

### High-signal anchors (fleet ≥ 9.5)

**Metadata**  
- `shortTitle`: Explicabilidad y equidad  
- `tagline`: capitalizada  
- `jobRelevance`: Lima risk-ops workbench + ficha 4 capas + no acusar  
- Outcomes: 8 measurable skill statements (conformal honest)

**Theory**  
- Intro: taxonomy global/local · equidad/incertidumbre/gobernanza + pregunta guía + puente T1→T4 + glosario  
- T1-A: critical question proxy-biased importance; coeficientes vs permutación  
- T1-B: SHAP/LIME trade-off honesty; causal=False spine  
- T2-A: TPR gap / precision@slice; low_n honesty  
- T3-A: conformal = calibración + cobertura conceptual; lab toy  
- T3-B / T4: bridges to governance; audit case/human/by (ts portfolio-optional)

**We Do transfers (ISSUE-06 closed to gold)**  
- T1-B-E3: `build_ficha` from raw fields  
- T2-A-E3: `build_slice_report` from region/n/precision/claim  
- T2-B-E3: `build_proxy_audit` from features + proposed_action  
- T3-B-E3: `build_uncertainty` from zs + proposed_action  
- T4-A-E3: `build_card` from prohibited/use/owner  

**You Do**  
- Workplace context; measurable objectives; DEFECT fill_*; portfolio_ready  

**SelfCheck**  
- Six non-cartoon items (layers, perm importance, OOD, card, low_n, local explanation)

**Resources notes**  
- Aligned to sklearn shuffle, Molnar taxonomy, FairML gaps, MAPIE coverage  

### Diff excerpt — residual T2-A-E3 (this pass)

```diff
- instruction: ... Contrasta fallo cerrado ... decide ...
+ instruction: ... Transferencia: ... build_slice_report ... claim=parity ...
+ def build_slice_report(raw):
+     ...
+     return {..., "flag": "low_n" if n < min_n else "ok_n", "claim": ...}
```

### Diff excerpt — residual T2-B-E3 (this pass)

```diff
- instruction: ... Contrasta fallo cerrado ... decide ...
+ instruction: ... Transferencia: ... build_proxy_audit ... high_risk ...
+ def build_proxy_audit(raw):
+     return {"high_risk": [...], "action": ..., "means_fraud": False}
```

---

## 3. After-Fix Validation Report

### 3.1 Issue-by-issue confirmation

| ID | Explorer claim | Post-fix verification | Result |
|----|----------------|------------------------|--------|
| 01 | Legacy/V3 in learner theory | Grep clean | **PASS** |
| 02 | section_passed in callout | Grep clean; workplace phrasing | **PASS** |
| 03 | gate V3 in rubric | Criterion is CP-N3-C capas | **PASS** |
| 04 | edgeCases inverted ×24 | Adverse strings correct for all 8×3 | **PASS** |
| 05 | Mechanism theater | Theory + iDo + E1s compute | **PASS** |
| 06 | Isomorphic WeDo | **5** build_* transfers + domain E1s | **PASS** |
| 07 | youDo print keys | Runnable DEFECT fill_* + portfolio_ready | **PASS** |
| 08 | Lowercase headings | 8 title-case headings | **PASS** |
| 09 | shortTitle EN | Explicabilidad y equidad | **PASS** |
| 10 | Thin jobRelevance | Multi-sentence Lima scene | **PASS** |
| 11 | timestamp drift | Callout aligned; ts optional | **PASS** |
| 12 | Outcomes telegraphic | 8 measurable | **PASS** |
| 13 | Weak MCQ | 6 items, stronger distractors | **PASS** |
| 14 | Code vocabulary load | Intro glossary | **PASS** |
| 15 | XAI external gap | Taxonomy + SHAP/LIME + TPR + resources | **PASS** (section-scoped) |
| 16 | Paragraph density | Bridges + mechanism notes | **PASS** |
| 17 | “Distintos” overclaim | Intro honesty + transfer list | **PASS** |
| 18 | iDo f1/f2 | Case feature names | **PASS** |
| 19 | DEFECT comments | Kept intentionally | **ACCEPTED** |
| 20 | Conformal overclaim | Outcome + theory + callout honest | **PASS** |

### 3.2 Meta-leak re-scan (M1–M5)

| Leak | Status |
|------|--------|
| M1 jobRelevance id conservado | **Gone** |
| M2 theory legacy/V3 microservicios | **Gone** |
| M3 section_passed | **Gone** |
| M4 youDo id conservado | **Gone** |
| M5 rubric gate V3 | **Gone** |

**meta_leak_count post-fix: 0** (learner-facing).  
Platform field `id: "system-design"` retained for SPA routing only (out of scope rename).

### 3.3 Executable checks (this pass)

- All **24** weDo `solutionCode` blocks exec clean under Python 3 → PASS  
- Transfer E3s T1-B / T2-A / T2-B / T3-B / T4-A → expected CONTINUE / REJECT / REQUEST triples  
- youDo corrected path → `portfolio_ready True`  
- `tsc --noEmit` → clean  
- Structure: 9 theory headings · 8 iDo · 24 weDo · 6 selfCheck · shortTitle ES  
- Inverted edgeCases leftovers: **0**  
- Learner meta-leak greps: **0**

### 3.4 Anti-aberration confirmation

- **No** Python/JS content generators, blurb factories, or template loops for educational prose.  
- **No** lorem-ipsum / TODO-as-content / placeholder pedagogy.  
- Validation scripts only executed *existing* learner/solution code for correctness.  
- Transfer E3s (including new T2-A/T2-B) and theory paragraphs were hand-written unit by unit.  

### 3.5 New problems introduced?

- None observed. Fail-closed codes and exact print contracts preserved for T2-A/T2-B E3 outputs.  
- Remaining non-build E3s (T1-A, T3-A, T4-B) intentionally keep decide-gate muscle memory; five build transfers cover explanation, equity (slice+proxy), uncertainty, and card — full product spine.

### 3.6 Score estimate

| Metric | Value |
|--------|-------|
| Explorer score_before | **7.3** |
| score_after_estimate | **9.6** |
| Fleet floor | **≥ 9.5** |
| Verdict | **Meets / exceeds fleet min** |

Rationale for 9.6 (not 10): full sklearn/MAPIE implementations and multi-module XAI elective remain intentionally out of section scope (ISSUE-15 section-appropriate residual). Ethics product framing, five transfers, youDo, and zero meta-leaks place S35 in gold band vs S01 peer bar.

---

## 4. Residual risks / recommendations for later sections

1. **S36+:** keep edgeCases adverse text non-inverted when cloning S35 exercise shells.  
2. **S39 Case Triage:** expect CP-N3-C ficha 4 capas vocabulary continuity from this section.  
3. **Optional depth track (not this section):** elective notebook with real `permutation_importance` + MAPIE coverage demo for learners who finish the ficha early.  
4. **Platform:** if product ever renames SPA hash `system-design` → `explainability-fairness`, do it in routing layer — not by stuffing migration notes into learner prose.  
5. **Remaining E3 decide-gates** (T1-A, T3-A, T4-B): acceptable muscle memory; only convert if a future Explorer re-flags isomorphism as residual after five builds.

---

## 5. Updated Graph Memory notes

```yaml
S35:
  id: system-design  # platform hash; learner title = Explicabilidad, equidad e incertidumbre
  title: Explicabilidad, equidad e incertidumbre
  shortTitle: Explicabilidad y equidad
  explorer_score: 7.3
  fixer_score_after_estimate: 9.6
  status_fixer: fixed_validated
  meta_leak_count_after: 0
  structural:
    theory_blocks: 9
    iDo: 8
    weDo: 24
    youDo: runnable_defect_fill_star
    selfCheck: 6
    transfer_e3_build:
      - S35-T1-B-E3  # build_ficha
      - S35-T2-A-E3  # build_slice_report
      - S35-T2-B-E3  # build_proxy_audit
      - S35-T3-B-E3  # build_uncertainty
      - S35-T4-A-E3  # build_card
  pedagogy_nodes:
    strength: ethics_4_layers_fail_closed
    strength: five_build_transfers_equity_spine
    strength: conformal_honest_toy
    accepted: DEFECT_comments_as_scaffold
  edges:
    prev: S34 metrics_thresholds_workbench
    next: S36 clustering_anomalies
    capstone: CP-N3-C_start -> S39 triage
  gold_gap_closed_vs_explorer:
    - meta_leaks_m1_m5
    - edgeCases_adverse_text
    - youDo_scaffold
    - shortTitle_es
    - isomorphic_weDo_residual_t2
  external_anchors_ok:
    - model_cards_mitchell
    - sklearn_inspection
    - molnar_iml
    - fairmlbook
    - mapie
    - nist_ai_rmf
  anti_aberration_ok: true
```

---

## 6. Explicit anti-aberration attestation

I did **not** write generators, loops, or template factories to mass-produce educational paragraphs, exercises, or explanations. Residual T2-A-E3 and T2-B-E3 transfer bodies were hand-authored. Validation used only execution of already-authored solution snippets and greps.

---

Section 35 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
