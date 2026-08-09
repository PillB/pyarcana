# S30 Fixer Report (Round 2) — Entity resolution probabilístico

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S30  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **30** — Entity resolution probabilístico |
| Canonical file | `src/lib/course/sections/s30-security-infra.ts` |
| Live route | https://pillb.github.io/pyarcana/#security-infra |
| Internal ID | `security-infra` (legacy slug retained for progress/URLs; content is ER, **not** server hardening) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S30_EXPLORER_REPORT.md` (score 4.2 pre-R1) |
| Expert report | `expert_audit/S30_report.md` (score 8.4/10; grammar/meta polish) |
| Expert-2 audit | `expert_audit/expert_2_audit/Section 30 Entity Resolution Audit.docx` (score 6.1/10; split leakage, exam bank, terminology) |
| Spanish-quality JSON (pre) | `course-state/curriculum_hardening/audits/spanish_quality/S30_SPANISH_QUALITY.json` (pre-R2 snapshot **6.76**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S30_FIXER_REPORT.md` (Explorer P0/P1 structural fix; estimate 9.6) |
| Assessment surface | Public `selfCheck` (9 MCQs) + new `topicEvaluations` (4) in canonical file; authenticated bank outside section TS (residual) |
| Validation | Python execute-and-diff of 40 theory/iDo/weDo code↔output pairs; Spanish audit `--from 30 --to 30 --no-lt` |

**Scope obeyed:** Only `s30-security-infra.ts` was edited. No `SectionView.tsx`, no `PdfReport.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation was used only for mechanical validation (Spanish metrics, code/output execution, residual greps) and mechanical taxonomy token cleanup (`Caso CASO-LIM-030` → **Caso 30** in learner instructions / starter headers), matching the R2 pattern used for other sections.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 Fixer had already resolved Explorer P0/P1 (I Do code↔output fidelity, meta-leaks DEFECT/oráculo/gate V3/legacy confession, theory boilerplate purge, We Do redesign, You Do scaffold, self-check enrichment, NIST resource swap). Product surfaces ISSUE-06/07 already show ER playground and PDF label `30. ER probabilístico` (verified read-only; out of section TS scope).

Expert report **8.4/10** still had active grammar/style residuals. Expert-2 raised a **critical technical teaching error** still present in We Do `S30-T4-A-E3` (mixed pair labeled `test` = entity leakage disguised as anti-leakage).

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp 01–05 I Do code/output | Explorer | Already fixed R1 | Re-exec PASS (T2-A/B, T3-A, T4-A/B) | Exec 40/40 |
| Exp 06 Zero Trust playground | Explorer | Fixed outside TS | Verified SectionView ER demo; **not edited** | Read-only |
| Exp 07 PDF Sec/Infra | Explorer | Fixed outside TS | Verified `30. ER probabilístico`; **not edited** | Read-only |
| Exp 08–12, 17 meta / We Do voice | Explorer | Already fixed R1 | Grep clean | Grep |
| Exp 10 boilerplate | Explorer | Already fixed R1 | Progressive T1–T4 preserved | Read |
| Exp 13–15, 18–19, 22, 25 pedagogy | Explorer | Already fixed R1 | Preserved + co-cluster naming honesty | Read |
| Exp 20 id `security-infra` | Explorer | Product debt | **Preserved** id/filename; no learner confession | Residual |
| Exp 14 accent lesson | Explorer | Fixed R1 | Callout + López consistency in I Do | Read |
| Expert 3.3 comma before *pero* | Expert | **Active** | `reduce candidatos, pero` | Read |
| Expert 3.4 *documentado* agreement | Expert | **Active** | → **de forma documentada** | Read |
| Expert 3.5 *decide misma entidad* | Expert | **Active** | → decide si dos registros son la misma entidad | Read |
| Expert 3.6 Lopez accent | Expert + SQ | **Active** | I Do description + code → **López** | Exec |
| Expert 3.2 `# TODO:` | Expert | **Active** | → `# Tu implementación:` | Grep 0 TODO |
| Expert 3.9 *approve clerical* | Expert | **Active** | → **aprobación clerical** (theory/iDo) | Grep |
| Expert 3.7 long sentences | Expert + SQ | **Active** | Orden pedagógico split; cluster defs split; iDo intro; T4-B why | Editorial |
| Expert 3.8 `vs` | Expert + grammar | **Active** | → `vs.` in learner prose | Grep |
| Expert 3.10 leakage gloss | Expert | **Active** | Self-check option *Leakage (fuga)* | Read |
| Expert 3.11 *Monitorea* | Expert | **Active** | → **Vigila** | Read |
| Expert-2 S30-01 entity split leak | Expert-2 P0 | **Active** | T4-A-E3 → train/test/**cross_split**; theory T4-A rewritten | Exec output |
| Expert-2 S30-03 not calibrated prob. | Expert-2 | Partial honesty | Stronger labels: score ≠ probabilidad calibrada | Read |
| Expert-2 S30-04 missing in comparators | Expert-2 | **Active** | theory + You Do: `None` if missing; scorer skips missing keys | Read/exec |
| Expert-2 S30-05 bridge merge | Expert-2 | Partial | Theory note: valida merge, no solo union | Read |
| Expert-2 S30-06 pairs completeness name | Expert-2 | **Active** | Co-cluster completeness/quality + blocking literature note | Read |
| Expert-2 S30-07 topicEvaluations | Expert-2 | Missing | **Mounted 4 hand-crafted TE** (T1–T4) | Schema |
| Expert-2 S30-11 rubric gate | Expert-2 | **Active** | Ético → **gate**; stretch → recomendado | Read |
| Expert-2 S30-02 exam bank all B | Expert-2 | Out of TS | Authenticated bank not in canonical file | Residual |
| Taxonomy Caso 30 | R2 fleet pattern | Active CASO-LIM flood | Instruction/starter labels → **Caso 30**; fixture id retained where needed | Grep |
| SQ medium terminal/run-on | Spanish JSON | **Active** | Hints/edgeCases periods; E3 instruction split | SQ 10.0 |

**Post-fix Spanish metrics (validation only):** quality_score **10.0** / FH **79.7** (was 6.76 / 80.2 pre-campaign snapshot); findings **14**, all **low** under `--no-lt`.

---

## 3. Full corrected content or precise complete diffs

Product file: `src/lib/course/sections/s30-security-infra.ts` (single authority).

### Diff group R2-A — Expert grammar / style (3.3–3.6, 3.8–3.11)

- T2-A: comma before *pero*.
- T3-A: *de forma documentada*.
- T2-B: *Vigila*; *vs.* typography.
- T3-B / iDo: *aprobación clerical*; bridge-merge caution.
- iDo T1-A: **López** in description + Jaccard demo.
- iDo intro: shorter enumeration; *score y umbrales*.
- We Do T3-B-E3 feedback: article + *si dos registros son la misma entidad*.
- Self-check: *vs.*; leakage gloss; co-cluster Q9 wording.

### Diff group R2-B — Expert-2 critical split + missing + terminology

**T4-A theory:** partition entities first; labels `train` / `test` / `cross_split`; mixed pairs never count as clean test.

**We Do S30-T4-A-E3 (critical):**

```diff
- print(["train" if {a, b} <= train_e else "test" for a, b in pairs])
- output: ['train', 'test', 'test']
+ def label(a, b):
+     ents = {a, b}
+     if ents <= train_e: return "train"
+     if ents.isdisjoint(train_e): return "test"
+     return "cross_split"
+ print([label(a, b) for a, b in pairs])
+ output: ['train', 'test', 'cross_split']
```

**Comparators / scorer honesty:** theory `exact`/`token_jaccard` return `None` on missing; You Do `pair_score` normalizes only over observed fields; T1-A prose states score is not calibrated probability.

**T4-B naming:** *co-cluster completeness/quality* with explicit note that blocking literature uses *pairs completeness* for candidate space.

### Diff group R2-C — You Do / rubric / topicEvaluations / taxonomy

- You Do: `# Tu implementación:`; missing-aware exact/token; entity_split TODO mentions cross_split; context/objectives/requirements/portfolioNote/rubric gates.
- Rubric: ético → **gate** (fallo automático); stretch **recomendado**.
- **topicEvaluations:** four authentic formative packages S30-T1…T4-TE (hand-written deliverables, not boilerplate paste).
- Caso taxonomy: learner-facing *Caso 30*; fixture id `CASO-LIM-030` retained in portfolio/context where the synthetic case name matters.

---

## 4. After-Fix Validation Report

### Explorer issues (ISSUE-01…25)

| Issue | Status |
|-------|--------|
| 01–05 I Do fidelity | Fixed (R1 + re-validated exec) |
| 06–07 product surfaces | Fixed outside scope (verified) |
| 08–12, 17 meta / We Do | Fixed (R1 + re-validated) |
| 10, 13–16, 18–19, 21–25 | Fixed R1; R2 deepened split/missing/co-cluster/TE |
| 20 id/filename | Residual (compatibility) |

### Expert issues (3.1–3.13)

| Issue | Status |
|-------|--------|
| 3.1 id rename | Residual (compatibility; not migrated) |
| 3.2–3.6, 3.8–3.11 | Fixed |
| 3.7 long sentences | Fixed (main densest units) |
| 3.12–3.13 style nits | Residual / low (callout title Auto-match acceptable) |

### Expert-2 issues (S30-01…12)

| Issue | Status |
|-------|--------|
| S30-01 entity split leak | **Fixed** (E3 + theory) |
| S30-02 exam all index 1 | Residual — bank outside section TS (`course-state/s30_phase5_exam_bank.json`) |
| S30-03 probabilistic claim | Improved honesty labels; full FS still didactic |
| S30-04 missing integration | Fixed in theory + You Do scaffold |
| S30-05 bridge safety | Documented; full constraint engine residual |
| S30-06 metric names | Fixed co-cluster labeling |
| S30-07 topicEvaluations | **Mounted** |
| S30-08 fading scaffold | Residual (platform shows all hints; no global UI change) |
| S30-09 exam discrimination | Residual (authenticated bank out of scope) |
| S30-10 acceptance contract | Partially improved via TE + portfolio; full CLI contract residual |
| S30-11 rubric gates | Fixed |
| S30-12 security-infra name | Residual (compatibility) |

### Mechanical validation

| Check | Result |
|-------|--------|
| Code↔output execute-and-diff | **40/40 PASS** |
| You Do `__main__` scaffold | `auto_match lopez|lim` / `fold_demo True` |
| Spanish quality (`--no-lt`) | **10.0** (was 6.76); FH **79.7**; 14 low findings |
| Residual meta greps | Clean (no DEFECT/oráculo/TODO/approve clerical/legacy confession) |
| TypeScript | No new S30 errors (unrelated S25 parse error pre-exists) |
| Markdown / RichText | Platform-wide residual; section not edited for it |
| Previous/next continuity | S29 SQL ER store → S30 → S31 graphs (prose bridges intact) |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (and mechanical Caso-30 taxonomy token cleanup in instructions/starters).

---

## 5. Residual risks and later recommendations

### Section-local residuals

- Full Fellegi–Sunter (m/u, λ, EM) still deliberately didactic; S34 may deepen calibration.
- Cluster bridge constraints are taught textually; no full constraint solver in demos.
- We Do scaffolding still relatively dense (E2/E3 formulas visible) — platform always surfaces hints.

### Repository-wide / deferred

- **Authenticated exam bank** answer-position exploit (Expert-2 S30-02): fix in exam-bank pipeline / Global Agent D; not in section TS.
- **id/filename** `security-infra` migration needs aliases + progress key strategy (Global Agent C).
- **SectionView RichText** markdown leak (global).
- SectionView/PdfReport already domain-correct for ER; leave to global agents only if further renames happen.

### Adjacent-section recommendations

- None that require editing S29/S31 in this pass. S31 can assume Union-Find entities exported after merge validation.

---

## 6. Updated Graph Memory notes

```yaml
section: 30
id: security-infra
title: Entity resolution probabilístico
file: src/lib/course/sections/s30-security-infra.ts
round2_status: fixed_validated
capstone: CP-N3-A_close
depends_on: [S27-tests, S28-props, S29-sql-er-store]
feeds: [S31-graphs-evidence]
preserve:
  - ethics_ER_not_fraud
  - T1_to_T4_topic_map
  - theory_blocking_accent_failure_example
  - resources_splink_christen_rapidfuzz_linacre
  - iDo_code_output_fidelity
resolved_this_round:
  - entity_split_cross_split_contract
  - missing_None_comparator_contract
  - co_cluster_metric_naming
  - topicEvaluations_mounted_x4
  - expert_spanish_polish
  - youDo_TODO_to_tu_implementacion
  - rubric_ethical_gate
remaining_risks:
  - authenticated_exam_bank_position_bias
  - legacy_id_security-infra
  - platform_hint_fading
  - full_FS_probability_deferred
compatibility:
  - keep_id_security-infra
  - keep_filename_s30-security-infra.ts
assessment_coverage:
  - selfCheck_9
  - topicEvaluations_4
  - weDo_24
  - iDo_8
spanish_quality_post: 10.0
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s30-security-infra.ts` | Sole product content edit for Section 30 R2 |
| `course-state/curriculum_hardening/audits/spanish_quality/S30_SPANISH_QUALITY.json` | Regenerated by validation audit script |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S30_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S30.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S30.md` (full)
- `expert_audit/worklog.md` (append pointer, Task ID: **FIXER-R2-S30**)

---

Section 30 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
