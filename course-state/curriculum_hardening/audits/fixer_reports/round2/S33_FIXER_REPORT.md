# S33 Fixer Report (Round 2) — ML supervisado y baselines responsables

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S33  
**Scope lock:** Section 33 only (`id: advanced-models`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s33-advanced-models.ts`  
**Live:** https://pillb.github.io/pyarcana/#advanced-models  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **33** |
| Title | ML supervisado y baselines responsables |
| shortTitle | Baselines ML responsables |
| Internal id | `advanced-models` |
| Canonical file | `src/lib/course/sections/s33-advanced-models.ts` |
| Live route | `#advanced-models` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S33_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S33_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Explorer Report — Section 33.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S33_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S33_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (now **7** MCQs); You Do CP-N3-B; authenticated bank key `advanced-models` (not rewritten) |
| Validation | Manual greps; execute-and-diff 64 Python blocks + 24 solution outputs; `scripts/spanish_quality_audit.py --from 33 --to 33 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (grep, code execution, output comparison, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Fixer already resolved Explorer **P0/P1** items in source: meta purge (V3 / id legacy / factory intro), T3-A stump demo (no `under_sample`), dual tracking win/lose with `beats_dummy=False` valid, compute-backed weDo residual, edgeCases adverse labels, gap=0.2, mean_fold `round(..., 3)`, youDo runnable scaffold. Independent re-check confirmed those **held**.

Expert report (8.5/10) described that post-R1 state and listed mostly Spanish polish. Expert-2 (docx, 6.3/10) raised **critical technical misconceptions** still present after R1 (L2 magnitude gate, dual-baseline abandonment in You Do, group CV as mere group count). Round 2 closed those residuals plus expert/Spanish findings.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| I-01…I-24 Explorer core | Explorer / R1 | **Already fixed (R1)** | Confirmed held (grep: no V3, under_sample, gate V3, Id legacy, factory intro) | Grep + structure |
| M-01…M-05 meta-leaks | Explorer | **Already fixed** | Held | Grep clean |
| EXP #1 prevalencia miradas | Expert + SQ | **Active → fixed** | `prevalencia mirada` in T1-A-E3 feedback | Grep |
| EXP #7 reponderar | Expert | **Active → fixed** | “reasigna pesos a los residuos…” | Grep |
| EXP #2 gap callout casing | Expert + SQ | **Active → fixed** | “Si el gap es grande… si falta seed…” | Source |
| EXP #5/#8 long intros | Expert + SQ | **Active → fixed** | iDo/weDo intros restructured | Source |
| EXP #6 T1-B-E1 41-word | Expert + SQ | **Active → fixed** | Split into short sentences | Source |
| EXP #3 `vs` → `vs.` | Expert + SQ | **Active → fixed** | Prose/hints/youDo title | Grep 0 bare `vs ` |
| EXP #4 plural siglas | Expert + SQ | **Active → fixed** | API / ID / los PR | Grep |
| EXP #12 T2-B-E3 fragment | Expert | **Active → fixed** | Lead clause “Aplica el fallo cerrado…” | Source |
| 33-01 L2 = weight norm | Expert-2 P0 | **Active → fixed** | Dictionary + theory + callout + T2-A E1/E2/E3 gate on `penalty=="l2"`; `l2_sq` diagnostic only; iDo prints penalty | 24 solutions PASS; theory/iDo exec |
| 33-02 dual baseline in You Do | Expert-2 P0 | **Active → fixed** | `rule_acc`, `beats_rule`, model cost; rubric/objectives | Source + scaffold exec |
| 33-05 group CV disjointness | Expert-2 P0 | **Active → fixed** | `groups_disjoint` in theory/iDo; T4-B-E1 requires disyunción | Exec + solution match |
| 33-03 cost in promotion | Expert-2 P1 | **Partial → improved** | Theory T4-A + You Do model_cost; full cost-based promotion deferred lightly | Source |
| 33-08 majority tie policy | Expert-2 | **Soft fix** | Lab tie policy stated in T1-B prose | Source |
| 33-11 gap as universal law | Expert-2 | **Fixed** | gap=0.2 framed as lab diagnostic | Source |
| 33-13 RF/boosting analogy | Expert-2 | **Fixed** | Vote ≠ RF; bagging vs boosting clarified | Source |
| 33-15 thr answer leak | Expert-2 | **Fixed** | Removed explicit “p. ej. 0.3” tip | Source |
| 33-16 self-check coverage | Expert-2 | **Improved** | +2 MCQs (L2 evidence; dual baseline) | 7 questions |
| 33-17 Spanish hybrid | Expert-2 + SQ | **Improved** | “únicamente”, vs., siglas, agreement | SQ 9.63 |
| 33-04 full sklearn fit | Expert-2 P1 | **Residual deferred** | Pure-Python progressive disclosure retained (resources link sklearn) | Documented |
| I-18 residual ledger count | Explorer P3 | **Deferred** | Tooling outside section TS | N/A |
| Platform RichText `**` | Cross-cutting | Platform | Not section-owned | Residual platform |
| Legacy id `advanced-models` | Cross-cutting | Compatibility | Kept as progress/URL key | Residual |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s33-advanced-models.ts`

### Representative corrections (post-R2)

**L2 mental model (theory T2-A excerpt):**
- Regularización L2 = configuración (`penalty="l2"` + C/λ).
- `l2_sq=Σw²` = diagnóstico de magnitud, no prueba de regularización.
- Gate weDo: `penalty=="l2"` vs adverso `penalty="none"` (even when l2_sq>0).

**Group CV (theory T4-B):**
```python
def groups_disjoint(train_ents, valid_ents):
    return set(train_ents).isdisjoint(set(valid_ents))
```

**You Do dual baseline:** documents `rule_acc`, `beats_rule`, `model_cost`, and entity disyunción; thr tip no longer gives the solution value.

**Spanish residuals:** `prevalencia mirada`; reasigna pesos; vs.; API/ID/PR; split intros; Datos sintéticos únicamente.

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer I-01…I-24 P0/P1 | **Already fixed (R1)** / held |
| Expert grammar #1, #2, #5–#8, #7 | **Fixed** |
| Expert-2 33-01 L2 | **Fixed** (config gate) |
| Expert-2 33-02 dual baseline You Do | **Fixed** |
| Expert-2 33-05 disjoint groups | **Fixed** (mechanism + E1) |
| Meta grep | `V3`, `legacy`, `under_sample`, `gate V3`, `prevalencia miradas`, `reponderar`, bare `vs ` → **0** |
| Code exec | **64/64** blocks exec OK |
| Solution output match | **24/24** match declared `output` |
| Spanish quality (`--no-lt`) | **8.01 → 9.63** (findings 89 → 23; residual mostly lab token casing / dense instructions) |
| Markdown / RichText | Platform residual: bold in non-RichText fields may still show `**` globally |
| Assessment | Public selfCheck **7** MCQs; exam bank not section-rewritten this pass |
| Previous/next | S32 features → S33 baselines → S34 metrics; bridges preserved |

**Explicit confirmation:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

### Issue-by-issue disposition

| Issue | Disposition |
|-------|-------------|
| Explorer structural/meta | fixed (R1) / already fixed |
| Spanish EXP/SQ | fixed |
| Expert-2 L2 / dual baseline / group disjoint | fixed |
| Expert-2 full sklearn fit / full cost promotion | residual risk (progressive disclosure) |
| Platform RichText / legacy id | residual platform |

---

## 5. Residual risks and later recommendations

1. **Section-local:** Full sklearn `.fit` pipeline still progressive-disclosure deferred (resources + pure-Python arithmetic); Expert-2 33-04 remains partial by design.  
2. **Section-local:** T2-A/T3-B E2/E3 still use fail-closed routing shells for CP-N3-B skill — intentional, not pure ML fit practice.  
3. **Platform:** SectionView RichText leak; PdfReport label `33. ML+`; progress key `advanced-models`.  
4. **Assessment bank:** Authenticated `advanced-models` variants in `prisma/seed.ts` not expanded this pass; optional later align with L2-config and dual-baseline items.  
5. **Live SPA** may lag until next deploy of `#advanced-models`.

---

## 6. Updated Graph Memory notes

```yaml
section: 33
id: advanced-models
file: s33-advanced-models.ts
round: 2
explorer_score_original: 5.5
r1_score_claim: 9.7
r2_spanish_score: 9.63
pedagogical_fidelity: high (post R2)
meta_leaks: none learner-facing
corrected_concepts:
  - L2_config_vs_weight_norm
  - dual_baseline_dummy_and_rule
  - group_cv_disjoint_entities
  - beats_dummy_false_valid_log
edges:
  - S32_features -> S33_baselines
  - S33_baselines -> S34_metrics_thresholds
  - S33 -> S35_explainability (SHAP deferred)
  - S33 -> CP-N3-B / S39_triage
resolved_defects:
  - weight_norm_as_L2_proof
  - youdo_dummy_only_promotion
  - group_count_as_group_cv
  - spanish_miradas_reponderar_vs_siglas
remaining_risks:
  - no_sklearn_fit_in_lab (intentional progressive disclosure)
  - platform_richtext
  - legacy_id_advanced-models
assessment_coverage:
  selfCheck: 7
  weDo: 24
  iDo: 8
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s33-advanced-models.ts` | Only product/content edit: Spanish residuals + Expert-2 technical/pedagogical fixes |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S33_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S33.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S33 |
| `course-state/curriculum_hardening/audits/spanish_quality/S33_SPANISH_QUALITY.json` | Regenerated by validation script (`--no-lt`) |

---

## 8. Worklog confirmation

Completion entry written to `expert_audit/worklog_entries_r2/S33.md` and brief pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S33**.

---

Section 33 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
