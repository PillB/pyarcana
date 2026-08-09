# S34 Fixer Report (Round 2) — Métricas, desbalance, calibración y umbrales

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S34  
**Scope lock:** Section 34 only (`id: cv-ai-integration`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s34-cv-ai-integration.ts`  
**Live:** https://pillb.github.io/pyarcana/#cv-ai-integration  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **34** |
| Title | Métricas, desbalance, calibración y umbrales |
| shortTitle | Métricas y umbrales |
| Internal id | `cv-ai-integration` (legacy slug; retained for URL/progress compatibility) |
| Canonical file | `src/lib/course/sections/s34-cv-ai-integration.ts` |
| Live route | `#cv-ai-integration` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S34_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S34_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Explorer Curriculum Audit — Section 34.docx` |
| Spanish-quality JSON (pre R2) | `course-state/curriculum_hardening/audits/spanish_quality/S34_SPANISH_QUALITY.json` (score **8.6**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S34_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (8 MCQs); We Do 24 × E1/E2/E3; You Do workbench CP-N3-B |
| Validation | Hand re-execution of 16 theory/I Do + 24 solutionCode pairs; You Do thr search sanity; Spanish-quality `--from 34 --to 34 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture educational prose. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics). Every prose unit changed in this pass was rewritten by hand with deliberate pedagogical intent.

---

## 2. Summary of changes applied

### Round-2 reality check

**Explorer (score 4.6) vs current source:** Round-1 already closed the pedagogical P0/P1 cluster (boolean-gate We Do, missing F1/TN/AP, clip-as-only-calibrator framing, empty You Do stub, adversarial edgeCases inverted, weight_ratio `9` vs `9.0`, recall@k, `choose_thr` search, expanded LOs, Spanish-first headings, no YOLO/V3 learner leaks). Independent re-audit **confirmed those closures**:

- Theory/I Do compute P/R/F1 + TN + AP; Brier set + reliability bin; affine holdout calibrator; thr search by cost/capacity; abstain band.
- We Do E1 units repair real formulas (`# DEFECT`), not only boolean gates.
- You Do is a full `build_workbench_report` with three intentional `# DEFECT` markers.
- edgeCases adversarial lines describe true breaches.
- I Do `weight_ratio` output is `9.0`.

**Expert report (score 7.5) vs current source:** Orthography and redaction residuals were still active (`auto-` compounds, `vs` without period, `COMMA_PERO`, long You Do/I Do sentences, “esqueleto didáctico”, CV disclaimer meta-leak). **Round 2 focused on these.**

**Expert 2 (docx, score 5.8):** Aligns with Explorer on historical under-delivery of calibration/You Do depth; current source already improved those skills. Residual noted: You Do measures Brier on raw scores without applying the affine map (portfolio documents fit location; simplified Platt honesty retained).

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 We Do boolean factory | Explorer | Already fixed (R1) | Retained E1 compute + E2/E3 policy | 24/24 solutionCode PASS |
| ISSUE-02 F1/PR-AUC claim–code | Explorer | Already fixed | Retained P/R/F1 + AP demos | Exec PASS |
| ISSUE-03 TN omitted | Explorer | Already fixed | Retained TN in theory/I Do/You Do/E1 | Assert `(1,1,0,1)` |
| ISSUE-04 cal = clip only | Explorer | Already fixed | Affine + holdout; prose clip ≠ cal | Manual + exec |
| ISSUE-05 Brier toy | Explorer | Already fixed | Set Brier + bin | Exec PASS |
| ISSUE-06 empty You Do | Explorer | Already fixed | Full workbench starter | Manual |
| ISSUE-07 YOLO/CV/V3 meta | Explorer | Mostly fixed | **R2:** removed learner “visión por computador” disclaimers | Grep 0 |
| ISSUE-08 edgeCases inverted | Explorer | Already fixed | Breach wording retained | Grep adversarial |
| ISSUE-09 weight_ratio 9 vs 9.0 | Explorer | Already fixed | Output `9.0` | Exec PASS |
| ISSUE-10 recall@k | Explorer | Already fixed | Implemented | Exec PASS |
| ISSUE-11 thr hardcoded | Explorer | Already fixed | `choose_thr` search | Exec thr 0.6 demo; You Do 0.9 |
| ISSUE-12 telegraphic LOs | Explorer | Already fixed | Expanded outcomes retained | Manual |
| ISSUE-13 EN headings | Explorer | Already fixed | Spanish-first headings | Manual |
| ISSUE-14 theory monotony | Explorer | Partial R1 | **R2:** T4-A connective from calibrated scores | Manual |
| ISSUE-15 abstract fixtures | Explorer | Partial R1 | Domain situating retained | Manual |
| ISSUE-17 hours | Explorer | Debated | Kept **18** (honest for full labs now; R1 12 not applied) | Residual |
| ISSUE-18 id/filename | Explorer | Deferred | Keep `cv-ai-integration` | Platform residual |
| S34-I01 CV disclaimer | Expert | **Active** | Removed learner CV disclaimers; id/filename kept | Grep 0 visión |
| S34-I02 auto- compounds | Expert + LT | **Active** | `autofraude` / `autoetiqueta` / `autoetiquetes` | Grep 0 `auto-` |
| S34-I03 COMMA_PERO | Expert | **Active** | Commas before clausal *pero* (theory, feedback, selfCheck) | Manual |
| S34-I04 vs → vs. | Expert + SQ | **Active** | All learner `vs.` | Grep 0 bare ` vs ` |
| S34-I05 a,b spacing | Expert | **Active** | `a, b` in hints | Manual |
| S34-I06 dense thr/cal instructions | Expert | **Active** | Spaced identifiers in T3-B-E1 (and T3-A-E1) | Manual |
| S34-I07 y y Brier | Expert | **Active** | “etiqueta `y∈{0,1}`” | Manual |
| S34-I08 half-open bin | Expert | Soft | `[0.0, 1.0)` spacing | Manual |
| S34-I09 youDo.context run-on | Expert + SQ | **Active** | Split + numbered flow (1)–(5) | Manual |
| S34-I10 portfolioNote run-on | Expert | **Active** | Split into 3 sentences | Manual |
| S34-I11 iDo.intro | Expert + SQ | **Active** | Split entry sentence | Manual |
| S34-I12 Fβ sentence | Expert | **Active** | Split at semicolon | Manual |
| S34-I13 jobRelevance density | Expert | **Active** | Colon split after cola | Manual |
| S34-I15 sensibilidad/slices | Expert | **Active** | Two sentences + autofraude | Manual |
| S34-I18/I22 esqueleto | Expert | **Active** | plantilla / implementación simplificada / Platt simplificado | Grep 0 esqueleto |
| S34-I23 leakage loanword | Expert | **Active** | “fuga de datos” in selfCheck option | Manual |
| labels top ordenados | Expert LT | **Active** | “labels del top ordenado” | Manual |
| ML-7 starter header | Expert | **Active** | Shortened DEFECT header | Manual |
| thr callout capital | SQ | **Active** | “Thr fijo…” after period | Manual |
| Expert2 cal honesty | Expert2 | Partial | Retained simplified Platt + clip≠cal; You Do Brier-on-raw residual | Residual |

---

## 3. Full corrected content / precise diffs

Product edit only: `src/lib/course/sections/s34-cv-ai-integration.ts`  
`git diff --stat`: **49 insertions, 52 deletions** (≈101 lines touched).

### Representative hand-crafted diffs

**Tagline / jobRelevance / outcomes**

```diff
- nunca auto-fraude
+ nunca autofraude
- …cola de revisión humana** con métricas honestas…
+ …cola de revisión humana**: métricas honestas…
- **nunca** auto-etiqueta de fraude
+ **nunca** autoetiqueta de fraude
- mean_p vs frecuencia
+ mean_p vs. frecuencia
- esqueleto didáctico de Platt
+ implementación simplificada de Platt
```

**Theory meta-leak + orthography**

```diff
- …abstención. Esta lección es de **evaluación y umbrales de cola**, no de visión por computador. Entity resolution…
+ …abstención. Entity resolution…
- no auto-etiquetes fraude
+ no autoetiquetes fraude
- REJECT_*/REQUEST_* son políticas… (no de visión por computador).
+ `REJECT_*` / `REQUEST_*` son políticas de cola del workbench.
- un esqueleto es `fold_plan…` … es leakage de pipeline … El boceto de abajo
+ una plantilla es `fold_plan…` … es una fuga de pipeline … El ejemplo de abajo
- como esqueleto didáctico de Platt
+ como implementación simplificada de Platt
- coeficientes ficticios de holdout_v1
+ coeficientes ilustrativos de `holdout_v1`
- Nunca conviertas el score en auto-fraude
+ Nunca conviertas el score en autofraude
+ Con scores ya calibrados en holdout (T3-B), el **umbral**…
```

**I Do / We Do / You Do**

```diff
- …números auditables: confusión y F1, precision@k…
+ …números auditables. Pasamos por confusión y F1, precision@k…
- (esqueleto de Platt)
+ (Platt simplificado)
- ni auto-fraude
+ ni autofraude
- labels top ordenados
+ labels del top ordenado
- con p=0.5 y y en {0,1}
+ con p=0.5 y etiqueta y∈{0,1}
- Clip sin a,b … holdout_v1 ficticio
+ Clip sin `a, b` … `holdout_v1` ilustrativo
- flow as one 52-word sentence
+ flow as (1)–(5) + thr guidance + autofraude
- Defectos intencionales del starter (corrígelos): 1) 2) 3)
+ Hay tres DEFECT marcados en el código; corrígelos antes de ejecutar.
```

**Self-check**

```diff
- Introduce leakage y métricas infladas
+ Introduce fuga de datos y métricas infladas
- Si precision@k es alta pero load
+ Si precision@k es alta, pero load
- Auto-etiquetar el excedente
+ Autoetiquetar el excedente
```

Complete machine-readable diff: `git diff src/lib/course/sections/s34-cv-ai-integration.ts` in the working tree.

---

## 4. After-Fix Validation Report

| Check | Result |
|--------|--------|
| Explorer ISSUE-01…16 skill claims | **Already fixed** (R1); re-confirmed |
| Expert S34-I02…I15, I18 orthography/load | **Fixed** |
| Expert S34-I01 file rename | **Residual** (compatibility): id/filename kept; learner CV disclaimer removed |
| Spanish quality score | **8.6 → 9.66** (`--no-lt`; findings 69 → 19) |
| FH mean | ~96.4 (muy fácil; technical tokens inflate ease) |
| Theory + I Do code/output | **16/16 PASS** |
| We Do solutionCode | **24/24 PASS** |
| You Do thr search on 5 scores | thr=`0.9`, cost=`10`, n_review=1 ≤ capacity 2 |
| selfCheck keys | `[1,3,0,2,1,3,0,2]` — balanced, no single-index bias |
| Meta-leaks YOLO/V3/visión/esqueleto/auto- | **0** |
| Markdown RichText platform | **Global residual** (not section-local) |
| Accessibility | No section-local a11y changes |
| S33→S34→S35 continuity | Retained (baseline → workbench → explainability) |

**Issue disposition summary**

| Class | Count disposition |
|--------|-------------------|
| Fixed in R2 | Expert orthography/load/meta-disclaimer cluster |
| Already fixed (R1) | Explorer P0/P1 skill-delivery cluster |
| Not applicable / false positive | SQ `lowercase_after_period` on `vs.`; half-open `[0.0,1.0)`; outcome fragments |
| Residual risk | Legacy id/filename; platform RichText; You Do Brier without affine map; hours debate |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- **You Do Brier on raw scores:** Expert2 notes the portfolio does not force applying `calibrate_affine` before Brier/thr. Intentional simplification for the five-point set; portfolio already asks where calibrator was fit. Optional later: one explicit `cal` step in `build_workbench_report`.
- **Affine ≠ full Platt:** Already disclosed; do not claim full logistic fit without teaching it.
- **estimatedHours 18:** Defensible after skill repair; R1 proposed 12. Leave until product analytics justify change.

### Platform / deferred
- **`id: cv-ai-integration` + filename `s34-cv-ai-integration.ts`:** Compatibility migration needs aliases (Global Agent C).
- **SectionView RichText** for callouts/jobRelevance (Global Agent A).
- Authenticated exam bank re-key if seed still uses old distractor wording (“leakage”) — inspect seed separately; not edited in this pass.

### Adjacent (do not expand here)
- S35 should consume thr-v* + slice metrics as promised in portfolioNote.

---

## 6. Updated Graph Memory notes

| Node | Note |
|------|------|
| Section node | S34 Métricas, desbalance, calibración y umbrales (`cv-ai-integration`) |
| Concept nodes corrected | autofraude orthography; Platt simplificado framing; T3→T4 calibrated-scores bridge |
| Prerequisite edges | S31 graph → S32 features → S33 baseline scores → **S34** queue metrics |
| Forward edges | S34 thr/abstain report → S35 explainability & equity by slice |
| Retained strengths | I Do/We Do/You Do fidelity; REJECT_*/REQUEST_*; no auto-fraud ethics; CASO-LIM-034 thread |
| Resolved defect nodes | CV learner disclaimer; auto- hyphen; vs.; COMMA_PERO; run-on You Do/I Do; esqueleto fourth-wall |
| Remaining risks | Legacy id; platform Markdown; optional You Do calibration step |
| Compatibility | Do not rename id/filename without migration |
| Assessment coverage | 8 MCQs cover accuracy trap, CV-safe resample, holdout cal, abstain, thr-vN, Brier, PR vs ROC, overload |

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s34-cv-ai-integration.ts` | Only product edit: Spanish/orthography, meta-leak, load splits, connective T4-A, selfCheck wording |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S34_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S34.md` | Full R2 worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S34 |
| `course-state/curriculum_hardening/audits/spanish_quality/S34_SPANISH_QUALITY.json` | Regenerated by validation script only |

No edits to `SectionView.tsx`, other sections, or global platform files.

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S34.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S34**)

---

Section 34 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
