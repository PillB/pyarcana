# S35 Fixer Report (Round 2) — Explicabilidad, equidad e incertidumbre

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S35  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **35** — Explicabilidad, equidad e incertidumbre |
| Canonical file | `src/lib/course/sections/s35-system-design.ts` |
| Live route | https://pillb.github.io/pyarcana/#system-design |
| Internal ID | `system-design` (legacy slug retained for progress/URLs; content is explainability/equity/uncertainty) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S35_EXPLORER_REPORT.md` (baseline **7.3**) |
| Expert report | `expert_audit/S35_report.md` (composite **7.0**; Spanish + platform id debt) |
| Expert-2 audit | `expert_audit/expert_2_audit/Section 35 Audit Report.docx` (score **7.0**; exam key, technical contracts) |
| Spanish-quality JSON (pre R2) | `course-state/curriculum_hardening/audits/spanish_quality/S35_SPANISH_QUALITY.json` (**7.66**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S35_FIXER_REPORT.md` |
| Assessment surfaces | Public `selfCheck` (now 8 MCQ) in canonical file; authenticated bank in `prisma/seed.ts` key `system-design` (24 variants) |
| Validation | Code↔output harness (16 theory+iDo + 24 We Do solutions); Spanish audit `--from 35 --to 35 --no-lt`; residual greps |

**Scope obeyed:** Edited only:
- `src/lib/course/sections/s35-system-design.ts`
- `prisma/seed.ts` (Section 35 / `system-design` bank only)

No edits to `SectionView.tsx`, `PdfReport.tsx`, or other sections.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Automation used only for mechanical validation (code execution, Spanish metrics, greps, answer-position counts).

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 already resolved Explorer **ISSUE-01…20** (meta-leaks M1–M5, inverted edgeCases ×24, youDo `fill_*`, shortTitle ES, headings, conformal honesty, five `build_*` transfers, stronger selfCheck). Re-validation: meta greps clean for V3/legacy/`section_passed`/`gate V3`; edgeCases adverse text correct; code oracles **40/40** PASS.

Active Round-2 work came from:
1. **Expert report** Spanish grammar (y→e, vs., reevalúa, comma+pero) and E3/weDo run-ons  
2. **Expert-2** wrong conformal answer key, answer-position bias, solutionCode meta in starters, technical honesty (baseline, min_n policy, proxy evidence, coverage_claim, OOD provenance, audit reconstruction), selfCheck coverage gaps, You Do slice/proxy documentation  

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp ISSUE-01…20 structural/meta | Explorer + R1 | **Already fixed** | Re-validated; no re-architecture | Greps + structure inventory |
| Exp ISS edgeCases inverted | Explorer | Already fixed | Re-validated ×24 | Grep adverse patterns |
| Expert I-04 `y imprime` ×5 | Expert | **Active** | `e imprime` | Grep clean |
| Expert I-05 `y hi > lo` ×2 | Expert | Active | `e hi > lo` | Grep clean |
| Expert I-06 `vs` | Expert | Active | `vs.` | 0 bare `vs` |
| Expert I-07 comma+pero | Expert | Active | `cajas negras, pero` | Read |
| Expert I-08 `re-evalúa` | Expert | Active | `reevalúa` | Grep |
| Expert I-09…I-15 run-ons | Expert + SQ | Active | Split weDo.intro + 5 transfer E3 instructions | SQ 9.51 |
| Expert I-01/I-02/I-03 id + playground + PDF | Expert | Platform | **Deferred** (compatibility; Global agents) | Residual |
| E2 Issue 1 conformal wrong key | Expert-2 **Critical** | Active `correctIndex: 1` on wrong option | Correct option marked (`correctIndex: 2` after reorder) | Seed inspect |
| E2 Issue 2 position bias 22× index 1 | Expert-2 | Active | Rebalanced 24 MCQ (0:7, 1:4, 2:8, 3:5); replaced cartoon distractors | Counter |
| E2 Issue 3 selfCheck coverage | Expert-2 | 6 Q | +2 MCQ (proxy, override audit) → **8** | correctIndex dist balanced |
| E2 Issue 4 solutionCode / slots meta | Expert-2 | Active ×24 starters + intro | Starter comment → “verifica la salida esperada del ejercicio”; intro “componentes del caso” | 0 `alineada a solutionCode` |
| E2 Issue 5 local baseline | Expert-2 | Active | Theory local_contrib with baseline + linear_score honesty; iDo why updated | Oracle PASS |
| E2 Issue 7 min_n=30 universal myth | Expert-2 | Active | Explicit lab policy language in theory, callout, iDo why, selfCheck | Read |
| E2 Issue 8 proxy pre-tags | Expert-2 | Active in theory | Theory+iDo `tag_from_evidence` from gaps; We Do still uses tags as ops contract with honesty note | Output `['district_code']` |
| E2 Issue 9 interval as false conformal | Expert-2 | Partial | `coverage_claim=False`, `q_source`, illustrative band language | Oracle PASS |
| E2 Issue 10 OOD provenance | Expert-2 | Active | `reference_split=train`, detector label, univariate honesty | Oracle PASS |
| E2 Issue 11 card_ok owner drift | Expert-2 | Partial (theory had owner; iDo missed) | iDo card_ok requires `owner` | Oracle PASS |
| E2 Issue 12 audit reconstructibility | Expert-2 | Overclaim | Min vs portfolio fields (ts/reason/model_version); dual audit flags | Oracle PASS |
| E2 Issue 13 You Do slice/proxy gap | Expert-2 | Active | Objectives/requirements/portfolioNote require slice + proxy documentation | Read |
| SQ high run-ons / claim anglicism | Spanish JSON | Active | Split E3s; claim→afirmación in key prose | SQ **7.66→9.51** |
| Resources MIT/CS50 off-topic | Expert I-24 | Active | Replaced with PAIR + Aequitas | URLs present |

---

## 3. Full corrected content or precise complete diffs

**Files edited:**
1. `src/lib/course/sections/s35-system-design.ts` — all learner prose, theory/iDo demos, weDo intro/E3 instructions, youDo, selfCheck, resources  
2. `prisma/seed.ts` — only the `'system-design': [...]` question array (24 variants)

### High-signal product deltas (canonical)

**Spanish / meta**
- `y imprime` → `e imprime` (5 tests strings)
- `y hi > lo` → `e hi > lo` (hint + hints[1])
- bare `vs` → `vs.`; `reevalúa`; comma before `pero`
- Starter meta: `# Contrato: corrige el DEFECT; verifica la salida esperada del ejercicio` (×24)
- weDo.intro: multi-paragraph learner framing; “ocho componentes del caso”

**Technical honesty**
- Local: baseline + `linear_score`; not SHAP
- Slices: `min_n=30` = política del lab
- Proxies: evidence-derived tags in theory/iDo
- Uncertainty: `coverage_claim=False`, `q_source`
- OOD: `reference_split=train`, univariate detector label
- Governance: audit mínimo vs portfolio (`ts`, `reason`, `model_version`)

**Assessments**
- selfCheck: 8 questions (added proxy + override audit)
- Authenticated bank: wrong conformal key fixed; positions rebalanced; distractors professionalized

### Exam bank conformal fix (evidence)

Before (expert-2 Critical): option 0 = correct science, but `correctIndex: 1` rewarded “Un reemplazo de todos los modelos”.

After: correct option is “Garantías de cobertura de conjuntos de predicción bajo supuestos” at `correctIndex: 2` (after option reorder with stronger distractors).

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer ISSUE-01…20 | **Already fixed** (R1) or re-confirmed |
| Expert Spanish I-04…I-08 | **Fixed** |
| Expert run-ons I-09…I-15 | **Fixed** (intro + transfer E3s) |
| Expert-2 conformal key | **Fixed** |
| Expert-2 position bias | **Fixed** (0:7, 1:4, 2:8, 3:5) |
| Expert-2 solutionCode starters | **Fixed** |
| Expert-2 technical contracts | **Fixed** or honesty-bounded (We Do tag filter retained as ops layer after theory evidence demo) |
| Code theory+iDo oracles | **16/16 PASS** |
| We Do solutionCode oracles | **24/24 PASS** |
| Spanish quality | **7.66 → 9.51** (FH 82.1, `--no-lt`, findings 38) |
| Meta greps (section_passed, gate V3, Explainability, Id legacy, alineada a solutionCode) | **Clean** |
| selfCheck n / dist | **8** Q · indices {0:2, 1:2, 2:3, 3:1} |
| Live shell | HTTP reachable (`pillb.github.io/pyarcana/`); content is source-driven SPA |
| Platform playground ADR under `#system-design` | **Residual** (SectionView — out of scope) |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

| Residual | Type | Notes |
|----------|------|-------|
| `id: "system-design"` + filename `s35-system-design.ts` | Compatibility / platform | Do not rename without alias migration; progress + URL hash |
| SectionView InteractivePlaygroundDemo for `system-design` still ADR/system-design | **Global** | Expert I-02 / E2 meta — Global Agent A/C |
| PdfReport `"35. SysDesign"` | **Global** | Expert I-03 |
| We Do proxy exercises still filter pre-tagged `high` | Section-local partial | Theory teaches evidence→tag; full We Do rewrite of 3 exercises deferred to avoid oracle regressions |
| Authenticated exam needs DB reseed after seed.ts change | Ops | Deploy pipeline must re-run seed for production exam |
| RichText markdown leak | Global 6.1 | Not section-local |
| Full SHAP/LIME/MAPIE lab modules | Curriculum scope | 18h section correctly remains policy + toy mechanisms with resources |

---

## 6. Updated Graph Memory notes

```yaml
S35:
  id: system-design  # retained
  title: Explicabilidad, equidad e incertidumbre
  fixer_r2: complete
  explorer_issues: all closed_or_already_fixed
  expert_spanish: fixed
  expert2:
    conformal_key: fixed
    answer_position: rebalanced
    solutionCode_meta: fixed
    technical_honesty: deepened
  spanish_quality: 9.51
  code_oracles: 40/40
  selfCheck: 8
  exam_bank: 24 variants rebalanced
  strengths_retained:
    - ethics_4_layers_fail_closed
    - five_build_transfers
    - CP-N3-C_start
  residuals:
    - platform_playground_ADR
    - PdfReport_SysDesign
    - id_filename_legacy
  edges:
    prev: S34_metrics_thresholds
    next: S36_clustering_anomalies
    capstone: CP-N3-C
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s35-system-design.ts` | Spanish, meta-leak comments, technical honesty, weDo intro/E3, youDo, selfCheck, resources, theory/iDo demos |
| `prisma/seed.ts` | Section 35 authenticated exam: conformal key, position balance, distractors |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S35_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S35.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |
| `course-state/curriculum_hardening/audits/spanish_quality/*` | Regenerated by validation script |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S35.md`
- Pointer appended to: `expert_audit/worklog.md` with Task ID **FIXER-R2-S35**

---

Section 35 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
