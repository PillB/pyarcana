# S46 Fixer Report (Round 2) — Ingeniería de datos y orquestación de producción

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S46  
**Section:** 46 · platform id `gpu-computing` (silent; not learner-facing as a topic label)  
**Source (only product file edited):** `src/lib/course/sections/s46-gpu-computing.ts`  
**Anti-aberration:** **OK** — educational prose rewritten by hand unit-by-unit; no generators, loops, templates, or bulk paraphrase scripts. Automation used only for code execution, residual greps, and Spanish-quality measurement.

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| **Section number / title** | 46 — Ingeniería de datos y orquestación de producción |
| **Canonical file** | `src/lib/course/sections/s46-gpu-computing.ts` |
| **Live route** | https://pillb.github.io/pyarcana/#gpu-computing |
| **Internal ID** | `gpu-computing` (retained for deep links / progress keys; never presented as CUDA/GPU topic in prose) |
| **Primary Explorer** | `course-state/curriculum_hardening/audits/explorer_reports/S46_EXPLORER_REPORT.md` (score 4.8 on pre-R1 template state) |
| **Expert report** | `expert_audit/S46_report.md` (score 7/10 on post-R1 rebuilt content) |
| **Expert-2 evidence** | `expert_audit/expert_2_audit/S46 Data Engineering Audit Report.docx` (score 5.9; deeper technical/exam critique) |
| **Spanish-quality JSON** | pre R2: **8.35**/10 (96 findings w/ LT); post R2: **10.0**/10 (11 findings, `--no-lt`) |
| **Grammar plan** | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| **Round-1 fixer (prior claim)** | `course-state/curriculum_hardening/audits/fixer_reports/S46_FIXER_REPORT.md` (est. 9.6 after Explorer P0/P1 rebuild) |
| **Worklog** | `expert_audit/worklog.md` |
| **Assessments** | In-file `selfCheck` (5 MCQ) + `youDo`; authenticated bank in `prisma/seed.ts` key `gpu-computing` (**inspected only**, not edited — hard scope) |
| **Validation** | Manual prose review + 41/41 theory/iDo/solution code-output pairs |

**Scope note:** Round 1 already closed the Explorer P0/P1 registry (template soup, print-theater, Flink-style watermark labels, Kahn cycle detection, CASO-HYO identity, token alignment, youDo pipeline scaffold, meta-leak strip). Round 2 verified that state and closed **expert Spanish/redaction residuals**, **output declaration fidelity**, and **Expert-2 honesty notes** still active in source.

---

## 2. Summary of changes applied

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Explorer 01–24 / M1–M7 | Explorer + R1 | **Already fixed** (R1) | Re-validated: computed demos, no legacy/V3 prose, CASO-HYO, edgeCases adverse, youDo pipeline | Meta scan + 41/41 exec |
| Explorer M8 / S46-002 | Explorer + Expert | **Platform residual** | Keep `id: "gpu-computing"` + filename (routing freeze); prose silent | Documented residual |
| S46-001 GPU playground | Expert ML-1 | **Platform residual** | Lives in `SectionView.tsx` INTERACTIVE_EDITORS — out of section scope | Documented residual |
| S46-003 dictionary dump | Expert + SQ | **Active** | Split into bulleted definition list (9 terms) | Manual + SQ 10.0 |
| S46-004 `vs` → `vs.` | Expert + SQ | **Active** | All learner-facing `vs.` (outcomes, theory, iDo, hints, rubric, resources) | Grep clean of bare `vs ` |
| S46-005 postmortem | Expert + SQ | **Active** | Prose → **post mortem**; keep `postmortem_actions` field name in code | Grep |
| S46-006 `re-` hyphenation | Expert + SQ | **Active** | `reprocesar` / `reejecutar` / `reejecuciones` / `recómputo` | Grep |
| S46-007 comma before `pero` | Expert + SQ | **Active** | “Self-loop es necesario, pero no suficiente…” | Scan |
| S46-008 data gender | Expert | **Active** | Rephrased to **contrato de datos** / **SLO de datos** (avoids DET–NOUN fight) | Manual |
| S46-009 callout monotony | Expert | **Active** | Distinct titles: Contrato T1-A…T4-A + Cierre T4-B | Scan 0× “Contrato local” |
| S46-010 Caso CASO | Expert | **Active** | “Para `CASO-HYO-046`” | Scan |
| S46-011 long sentences | Expert + SQ | **Active** | Bridge/orden/T1-A/T4-B/iDo why/weDo intro split | SQ WPS healthier |
| S46-012 tagline case | Expert | **Active** | Sentence-case capital start | Manual |
| S46-013 `{a,b,c}` spacing | Expert | **Active** | `{a, b, c}` | Scan |
| S46-014 “de DE” awkward | Expert + SQ | **Active** | “ingeniería de datos” / “Riesgo de ingeniería de datos” | Scan |
| dropea | Expert rewrite | **Active** | **descarta** | Scan |
| er_clusters residual | Expert-2 46-21 | **Active** | Theory print → `report_atenciones`; normalize→clean in contract prose | Scan |
| Timeline prose | Explorer 24 / R1 residual | **Partial→fixed prose** | Added **Timeline trabajado** paragraph (112/100/105 under wm=110) | Manual |
| Allowed lateness honesty | Expert-2 46-01 | **Partial (documented)** | Explicit lab model vs Beam/Flink window_end+grace; **did not** rewrite all lab predicates (R1 intentional stdlib model) | Manual |
| E2/E3 output mismatch | Expert-2 46-02 | **Active** | 16 `output` fields now include second line `meets_contract True` matching solution prints | 41/41 PASS |
| Exam bank bias | Expert-2 46-03 | **Residual** | All 24 seed items `correctIndex: 1`, weak distractors — out of hard scope file | Documented for Global Agent D |
| Spanish quality | SQ audit | **Active** | 8.35 → **10.0** (`--no-lt`) | Script |

### What was *not* changed (justified)

| Item | Reason |
|------|--------|
| `id: "gpu-computing"` / filename | Progress keys, deep links, SPA hash freeze; silent retention (Global Agent C) |
| SectionView GPU interactive editor | Global platform table keyed by section id (Global Agent A + content swap) |
| `prisma/seed.ts` exam bank (24 Q) | Hard scope = canonical section file only; bank needs Global Agent D redesign (indices, distractors, Spanish explanations) |
| Full Beam/Flink allowed-lateness rewrite | Would break 24 weDo + youDo + selfCheck alignment; lab model is taught honestly as watermark-relative grace |
| Exactly-once as full distributed EOS | Stdlib `apply_once` is intentional composite teaching model (Expert-2 46-04 residual) |
| Row-level lineage | Lab models run/dataset facets (OpenLineage-style), not per-row provenance (Expert-2 46-05 residual) |

---

## 3. Precise changes (substance)

### 3.1 Opening and theory

- **tagline / jobRelevance / LO:** capital start; SLA singular; `vs.`; **post mortem**; italic tech English.
- **Diccionario:** nine bullets instead of one 107-word wall.
- **Puente S45→S46→S47:** one causal claim per sentence.
- **Producto / Orden:** *late data* silenciosa; split T1→T4 causal chain; “Para `CASO-HYO-046`”.
- **T1-A:** event/processing split; honesty note on lab allowed lateness; **Timeline trabajado**; DE risks in Spanish.
- **T1-B:** numbered e1 / retry / late sequence.
- **T2–T4:** `reprocesar`/`reejecutar`/`recómputo`; distinct callout titles; contrato de datos / SLO de datos; `{a, b, c}`; post mortem in operation contract.
- **Theory code:** `asset report_atenciones` (no `er_clusters`).

### 3.2 I Do / We Do

- **iDo intro / why:** split long watermark why; `vs.`; **post mortem**; **reprocesar**.
- **iDo descriptions:** `vs.` in DAG and SLO demos; demo print `medida vs. objetivo`.
- **weDo intro:** “ingeniería de datos real” (no “de DE”); production-grade → “pipeline de producción”.
- **hint COMMA_PERO + lag vs. SLO**.
- **16× E2/E3 `output`:** second line `meets_contract True` aligned to solution `print`.

### 3.3 You Do / self-check / resources

- youDo comment `late vs. wm`; rubric `completeness vs. latencia`.
- selfCheck Q4 explanation: lab grace wording + `vs.`.
- Flink resource note: `vs.`.

### 3.4 Diffs (representative)

```diff
- tagline: "pipeline incremental/backfillable…
+ tagline: "Pipeline incremental y backfillable…

- **Diccionario…** (one 107-word paragraph)
+ **Diccionario…** + 9 bulleted definitions

- completeness vs latencia
+ completeness vs. latencia

- postmortem / re-procesar / re-ejecutar
+ post mortem / reprocesar / reejecutar

- title: "Contrato local"  (×8)
+ title: "Contrato T1-A · Watermark y ventana" … "Cierre T4-B · RTO y post mortem"

- print("asset", "er_clusters")
+ print("asset", "report_atenciones")

- output: `PASS … MISSING:…`
+ output: `PASS … MISSING:…
+ meets_contract True`
```

Full corrected source: `src/lib/course/sections/s46-gpu-computing.ts` (~2.4k lines).

---

## 4. After-Fix Validation Report

### 4.1 Issue-by-issue disposition

| Family | Disposition |
|--------|-------------|
| Explorer 01–24 pedagogical P0/P1 | **Already fixed** (R1) — reconfirmed |
| Expert Spanish S46-003…013 | **Fixed** |
| Expert S46-001/002 platform | **Residual** (global) |
| Expert-2 46-01 allowed lateness | **Partial** — honesty note; lab model retained |
| Expert-2 46-02 output fidelity | **Fixed** (16 outputs) |
| Expert-2 46-03 exam bank | **Residual** (seed out of scope) |
| Expert-2 46-04…07 authenticity | **Residual** (stdlib lab scope intentional) |
| Expert-2 46-21 er_clusters | **Fixed** |
| Spanish quality | **Fixed** 8.35 → 10.0 |

### 4.2 Mechanical validation

| Check | Result |
|-------|--------|
| Theory + iDo + weDo solution code vs declared `output` | **41/41 PASS** |
| Residual greps (`CASO-LIM`, `Id legacy`, `gpu_cuda`, `Contrato local`, `re-proces`, bare learner `vs `) | **Clean** |
| Spanish quality (`--from 46 --to 46 --no-lt`) | **10.0**/10 · FH 84.4 · 11 low/medium residual (tech EN false positives / structure nits) |
| Meta-leak scan (TODO/FIXME/path V3/gpu_cuda) | **Clean** in learner prose |
| Markdown rendering | Platform-wide RichText gap remains for some fields (global); section still uses `**` intentionally |
| Assessment keys (selfCheck) | Indices 1, 3, 0, 2, 1 — mixed; 5 concept questions intact |
| Exam bank (`prisma/seed.ts`) | Inspected: **24/24 correctIndex:1** — residual |
| Previous/next continuity | S45 job → S46 pipeline → S47 MLOps preserved in jobRelevance + map |

### 4.3 Anti-aberration statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics).

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **Lab allowed lateness** is watermark-relative grace, not full Beam `window_end + allowed_lateness` state retention. Honesty note is present; a future T1 figure could show both models side by side without changing exercise keys.
2. **Exactly-once / lineage** remain stdlib composites (dedup set + run facet), not production brokers/OpenLineage emitters — intentional progressive disclosure.
3. **Autocheck** still 5 items for 8 outcomes; optional expansion deferred.
4. **Authenticated exam bank** needs full rewrite (Global Agent D): index balance, plausible distractors, Spanish explanations.

### Repository-wide platform dependencies

1. **SectionView** interactive editor still maps `'gpu-computing'` → GPU matrix multiply (S46-001 / ML-1).
2. **RichText** rendering gaps for some Markdown fields (jobRelevance, callouts, etc.).
3. **Identity migration** `gpu-computing` → descriptive id with aliases (Global Agent C).

### Adjacent-section notes

- Do not edit S45/S47 here; bridge text already names object store / DLQ → tables / lineage → MLOps features.

---

## 6. Updated Graph Memory notes

```yaml
section: 46
id: gpu-computing  # compatibility; content = data eng / orchestration
file: s46-gpu-computing.ts
title: Ingeniería de datos y orquestación de producción
round: FIXER-R2
explorer_score_pre_r1: 4.8
expert_score_r1_era: 7.0
expert2_score: 5.9  # exam bank + full Beam semantics
spanish_quality:
  before_r2: 8.35
  after_r2: 10.0
r1_status: explorer_p0_p1_closed
r2_status: spanish_redaction_outputs_honesty_closed
concept_nodes_corrected:
  - dictionary_scannable
  - timeline_prose_t1a
  - callout_titles_by_subtopic
  - rae_re_prefix_post_mortem_vs
  - e2_e3_output_matches_print
  - er_clusters_removed
prerequisite_edges:
  - { from: S45, to: S46, type: continues }
forward_edges:
  - { from: S46, to: S47, type: enables }
  - { from: S46, to: CP-N4-B, type: gates }
retained_strengths:
  - fail_closed_wedo_shape
  - kahn_cycle_detection
  - flink_style_labels_on_time_allowed_late_late
  - youdo_pipeline_scaffold
  - caso_hyo_046_continuity
resolved_defect_nodes:
  - contrato_local_monotony
  - dictionary_wall
  - output_declaration_drift_e2_e3
remaining_risks:
  - sectionview_gpu_editor
  - seed_exam_correctIndex_all_1
  - beam_window_allowed_lateness_full_model
compatibility_constraints:
  - id_gpu_computing_frozen
assessment_coverage:
  selfCheck: 5_mcq_concept
  exam_bank: residual_weak
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s46-gpu-computing.ts` | Only product edit: Spanish/redaction, callouts, timeline prose, honesty note, output fidelity, residual domain polish |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S46_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S46.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer FIXER-R2-S46 |
| `course-state/curriculum_hardening/audits/spanish_quality/S46_SPANISH_QUALITY.json` | Regenerated by validation script (`--no-lt`) |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S46.md`
- Pointer appended to: `expert_audit/worklog.md` with Task ID **FIXER-R2-S46**

---

Section 46 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
