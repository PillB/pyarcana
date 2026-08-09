# S25 Fixer Report (Round 2) — Endpoints de IA, Hugging Face y prompting evaluado

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S25  
**Scope lock:** Section 25 only (`id: streamlit-dashboards`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s25-streamlit-dashboards.ts`  
**Live:** https://pillb.github.io/pyarcana/#streamlit-dashboards  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **25** |
| Title | Endpoints de IA, Hugging Face y prompting evaluado |
| shortTitle | IA endpoints y prompts |
| Internal id | `streamlit-dashboards` (**legacy routing; kept**) |
| Canonical file | `src/lib/course/sections/s25-streamlit-dashboards.ts` |
| Live route | `#streamlit-dashboards` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S25_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S25_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Auditoría de Calidad de la Sección 25.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S25_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S25_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (5 MCQs); exam bank under `streamlit-dashboards` (seed out of scope) |
| Validation | Manual greps; execute-and-diff I Do + golden theory; `scripts/spanish_quality_audit.py --from 25 --to 25 --no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (grep, code execution, Spanish-quality metrics).

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Fixer had already restored **I Do code/output parity**, We Do de-meta (no DEFECT/oráculo/pass-string stems), field-level practice, circuit breaker, You Do scaffold, rubric observables, books with URLs, and student-facing Streamlit speech scrub (icon `Sparkles`). Independent re-check confirmed Explorer P0/P1 structural items **already fixed**.

Round 2 focused on **still-active expert, expert-2, and Spanish-quality residuals**: technical honesty of metrics/schema claims, dual-contract clarity, semantic error “solo borra”, Spanish register (El AI / vs. / auto- compounds), grader meta-leak, self-check question form, and bias LO alignment.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 / 15 I Do output parity | Explorer | **Already fixed (R1)** | Re-verified 8/8 demos + theory golden | Exec match OK |
| ISSUE-02 starter `print('ok', True)` | Explorer | **Already fixed (R1)** | Confirmed clean | Grep 0 |
| ISSUE-03 / 12 We Do meta stems | Explorer | **Already fixed (R1)** | Confirmed clean | Grep 0 DEFECT/oráculo |
| ISSUE-04–06 exercise / You Do depth | Explorer | **Already fixed (R1)** | Retained R1 authenticity lifts | Inventory intact |
| ISSUE-07 / 11 / 16 theory stems / headings | Explorer | **Already fixed (R1)** | Ethics callout + full headings kept; intro dual-contract bridge | Source inspect |
| ISSUE-08 / M1 legacy speech | Explorer | **Already fixed (student-facing)** | id kept by design | Residual routing |
| ISSUE-09 model key contract | Explorer | **Already fixed (R1)** | Unchanged | Grep contract |
| ISSUE-10 “field F1” | Explorer + Expert-2 #1 | **Misnomer active** | Renamed to **tasa de acierto por campo** / `field_match_rate`; prose states it is **not** statistical F1 | Theory + I Do + We Do E2 + You Do + outputs |
| ISSUE-13 gate V3 rubric | Explorer | **Already fixed (R1)** | Rubric further clarifies classifier vs narrative contract | Source |
| ISSUE-14 exam slug GLM | Explorer | **Deferred seed** | Theory brand-agnostic (R1 + R2) | Seed out of scope |
| ISSUE-17 circuit | Explorer | **Already fixed (R1)** | Retained | I Do + selfCheck Q5 |
| ISSUE-18 books | Explorer | **Already fixed (R1)** | URLs present | Source |
| Expert #3 El AI assist | Expert | **Active → fixed** | → **asistente de IA** in prose, jobRelevance, iDo, You Do, selfCheck | Grep 0 “El AI” |
| Expert #4 vs without period | Expert | **Active → fixed** | `vs.` in outcomes, baseline, feedback | Grep |
| Expert #5 auto- compounds | Expert | **Active → fixed** | autoetiquetar, autoenvío, autoetiqueta, autofraude, autoveredicto | Grep |
| Expert #6 re-facturar | Expert | **Active → fixed** | refacturar; caché in prose | Source |
| Expert #7 iDo intro run-on | Expert | **Active → fixed** | Numbered 8-demo list | Source |
| Expert #8–10 selfCheck stems | Expert | **Active → fixed** | Full `¿…?`; “operación correcta”; “omita la evaluación” | Source |
| Expert #12 PDF OCR | Expert | **Active → fixed** | “documento procesado con OCR” | Source |
| Expert #2 Streamlit demo | Expert | **Global platform** | Not edited (SectionView out of scope) | Residual |
| Expert-2 “solo borra” | Expert-2 | **Active → fixed** | “solo propone borradores” | Grep |
| Expert-2 JSON Schema honesty | Expert-2 #2 | **Active → fixed** | Lab = keys required (gate mínimo), not full JSON Schema engine | Theory T3-A / T4-A |
| Expert-2 dual contracts | Expert-2 #3 | **Active → fixed** | Classifier `{model,label,score}` vs narrative `{hallazgo,…,evidence_ids}` explicit in intro, T2-A, You Do, rubric | Source |
| Expert-2 evidence_ids late | Expert-2 #4 | **Partial → fixed** | T3-A + T4-A: evidence_ids from S24 fixture; no invent ids | Source |
| Expert-2 sesgo LO | Expert-2 #5 | **Active → mitigated** | LO + T4-B: document model-card limits / HITL; no fake disparity lab | Source |
| Expert-2 grader / exam bank leak | Expert-2 #8 | **Active → fixed** | Removed “grader” / “banco de examen” learner speech | Grep 0 |
| SQ high: El AI agreement | Spanish quality | **Fixed** with Expert #3 | | Score 7.82 → **9.33** |
| SQ cache / miss / matcheas | Spanish quality | **Fixed** (prose) | caché; miss glossed; matcheas → detectas | Source |

---

## 3. Full corrected content or precise complete diffs

Product file only: `src/lib/course/sections/s25-streamlit-dashboards.ts`.

### Representative diffs (hand-crafted)

**Metric honesty (theory T4-A):**

```diff
- **field F1** … promedio de aciertos por campo
+ **tasa de acierto por campo** (`field_match_rate`) … **No es F1 estadístico**
- def field_f1(...): ...
- return {..., "field_f1": f1}
+ def field_match_rate(...):  # docstring: No es F1 estadístico
+ return {..., "field_match_rate": match}
```

Same rename in I Do T4-A, We Do T4-A-E2 instruction/starter, You Do starter + rubric + objectives.

**Semantic + Spanish:**

```diff
- El AI assist solo borra; el humano aprueba acciones externas.
+ El asistente de IA **solo propone borradores**; el humano aprueba acciones externas.
- auto-etiquetar / auto-envío / vs baseline / re-facturar / la ops
+ autoetiquetar / autoenvío / vs. baseline / refacturar / la operación
```

**Dual contract + schema honesty + evidence_ids (intro / T2-A / T3-A):**

- Intro paragraph 3: classifier vs narrative contracts named.
- T2-A: classifier contract only; You Do narrative is different form.
- T3-A: lab validates required keys (not full JSON Schema); evidence_ids from S24.
- T4-B: bias mitigated via model-card limits + HITL (no fake F1-by-slice lab).

**Self-check:** five questions rewritten as proper Spanish questions with aligned options.

---

## 4. After-Fix Validation Report

### Explorer issue-by-issue (primary registry)

| ID | Status |
|----|--------|
| ISSUE-01 | **Already fixed** (R1) + re-validated 8/8 |
| ISSUE-02 | **Already fixed** |
| ISSUE-03 | **Already fixed** |
| ISSUE-04 | **Already fixed** (R1 residual lifts kept) |
| ISSUE-05 | **Already fixed** |
| ISSUE-06 | **Already fixed** |
| ISSUE-07 | **Already fixed** (+ R2 dual-contract connective tissue) |
| ISSUE-08 | **Fixed student-facing** / residual platform id |
| ISSUE-09 | **Already fixed** |
| ISSUE-10 | **Fixed (R2)** honest metric name |
| ISSUE-11 | **Already fixed** |
| ISSUE-12 | **Already fixed** + R2 PE polish |
| ISSUE-13 | **Already fixed** + R2 dual-contract rubric |
| ISSUE-14 | **Deferred seed** / mitigated in-section |
| ISSUE-15 | **Already fixed** |
| ISSUE-16 | **Already fixed** |
| ISSUE-17 | **Already fixed** |
| ISSUE-18 | **Already fixed** |
| ISSUE-19 | **Already fixed** |
| ISSUE-20 | **Already fixed** + R2 selfCheck PE |
| ISSUE-21 | **Already fixed** |
| ISSUE-22 | **Already fixed** |
| ISSUE-23 | **Already fixed** |
| ISSUE-24 | **Deferred** (phase metadata) |

### Code execution

| Surface | Result |
|---------|--------|
| 8 I Do demos code↔output | **8/8 OK** |
| Theory `golden_ai.py` | **OK** (`field_match_rate` key) |
| T4-A-E2 field match arithmetic | **OK** (0.5) |

### Spanish quality

| Metric | Before (audit JSON baseline) | After R2 (`--no-lt`) |
|--------|------------------------------|----------------------|
| quality_score_0_10 | 7.82 | **9.33** |
| findings_total | 105 | **35** |
| FH | 82.4 | 82.4 |

Remaining findings are mostly missing_terminal_punct on short hints (pedagogical fragments) and long technical instructions — accepted residual under grammar subplan judgment.

### Assessment

- Public selfCheck: 5 questions, correctIndex unchanged where content same; stems fixed; Q4/Q5 grammar fixed.
- Authenticated exam bank (`prisma/seed.ts`): **not edited** (out of section-TS scope). Concept slug `glm-thinking-tools-checkpoints` remains deferred residual.

### Markdown / platform

- Global RichText leak in SectionView: **not edited** (platform agent).
- Off-topic Streamlit interactive demo keyed by `streamlit-dashboards`: **not edited** (SectionView out of scope).

### Anti-aberration

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals

- Some We Do hints remain fragment-style without terminal period (playground UI; low learner harm).
- We Do exercises remain sandbox-sized oracles by grader design; You Do carries full assembly.
- Bias outcome is **documented/HITL**, not a full disparity lab (honest scope for S25 hours).

### Repository-wide / deferred

1. **Platform id** `streamlit-dashboards` (URL hash, seed key, glossary) — coordinated migration only.
2. **SectionView** `demos['streamlit-dashboards']` Streamlit simulator — Global Agent A/C.
3. **Exam concept slug** `glm-thinking-tools-checkpoints` in seed — rename when seed is in scope.
4. Full JSON Schema engine (types/enums/additionalProperties) — advanced topic; section now honest about key gate.
5. True statistical field F1 — defer to ML metrics sections; S25 teaches honest field match rate.

### Adjacent sections

- S26 should consume dual contracts (classifier signal + narrative JSON) without re-teaching S25 ethics stems.

---

## 6. Updated Graph Memory notes

```yaml
section: 25
id: streamlit-dashboards  # routing legacy; student speech V3
title_v3: Endpoints de IA, Hugging Face y prompting evaluado
file: src/lib/course/sections/s25-streamlit-dashboards.ts
explorer_score_before: 5.8
r1_claim: 9.55
r2_spanish_quality: 9.33
anti_aberration_ok: true
pass: fixer_round2

nodes_strength:
  - ethics_hitl_no_auto_fraud
  - i_do_output_fidelity
  - field_match_rate_honest_not_f1
  - dual_contract_classifier_vs_narrative
  - schema_gate_keys_not_full_json_schema
  - evidence_ids_bridged_from_s24
  - spanish_asistente_de_ia
  - no_grader_meta_leak
  - solo_propone_borradores_not_borra
  - circuit_breaker_selfcheck
  - you_do_scaffold_helpers

nodes_weak_residual:
  - platform_id_streamlit_legacy
  - sectionview_streamlit_demo_orphan
  - exam_slug_glm_branding_seed
  - we_do_sandbox_oracle_form_factor

edges:
  - S24_ocr_fields -> S25_untrusted_context_and_evidence_ids
  - S25_classifier_contract -> S25_narrative_contract (explicit adapter)
  - S25_ai_assist -> S26_vp_orchestration

do_not_regress:
  - no_auto_fraud_policy
  - fail_closed_schema
  - synthetic_only
  - model_key_contract_classifier
  - field_match_rate_not_called_f1
  - i_do_code_output_parity
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s25-streamlit-dashboards.ts` | Only product edit: R2 technical honesty + PE redaction + selfCheck |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S25_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S25.md` | Full worklog entry |
| `expert_audit/worklog.md` | Completion pointer FIXER-R2-S25 |
| `course-state/curriculum_hardening/audits/spanish_quality/S25_SPANISH_QUALITY.json` | Regenerated by validation script only |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S25.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S25**)

---

Section 25 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
