# S31 Fixer Report (Round 2) — Grafos y evidencia relacional

**Task ID:** FIXER-R2-S31  
**Date:** 2026-07-25  
**Agent:** Second-round Section Fixer (Grok Build)  
**Section:** 31 — Grafos y evidencia relacional  
**Canonical:** `src/lib/course/sections/s31-streaming-data.ts`  
**Internal id:** `streaming-data` (preserved; never shown to learners)  
**Live route:** https://pillb.github.io/pyarcana/#streaming-data  

**Anti-aberration:** OK — all learner prose, demos, exercises, self-check options, and exam items were hand-crafted. Automation was used only for mechanical validation (code execution oracles, Spanish-quality metrics with `--no-lt`, residual greps, answer-position counts). No generators, loops, templates, or bulk mechanisms manufactured educational content.

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|-------|
| Section number / title | 31 — Grafos y evidencia relacional |
| Canonical file | `src/lib/course/sections/s31-streaming-data.ts` |
| Live route | `#streaming-data` |
| Internal ID | `streaming-data` (legacy; routing/progress compatibility) |
| Primary Explorer | `course-state/curriculum_hardening/audits/explorer_reports/S31_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S31_report.md` |
| Expert-2 (docx) | `expert_audit/expert_2_audit/Section 31 Graph Evidence Audit Report.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S31_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / worklog | `expert_audit/CAMPAIGN_SUMMARY.md`, `expert_audit/worklog.md` |
| Prior R1 Fixer | `course-state/curriculum_hardening/audits/fixer_reports/S31_FIXER_REPORT.md` |
| Assessments | Public `selfCheck` in canonical; authenticated bank `'streaming-data'` in `prisma/seed.ts` (V3) and `scripts/seed_questions_extra.txt` |
| Validation | Manual exec of 40 theory/I Do/solution code↔output pairs; `scripts/spanish_quality_audit.py --from 31 --to 31 --no-lt` |

---

## 2. Summary of changes applied

### 2.1 Issue-resolution ledger

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01–17 (I Do I/O, meta streaming/V3, DEFECT/oráculo, boilerplate, We Do depth, degree honesty, NetworkX bridge, You Do, self-check 10, headings, schema etypes, Spanglish) | Explorer R1 | **Already fixed** in R1 | Confirmed present; no regression | Grep 0 Kafka/V3/DEFECT/oráculo; 40/40 oracles PASS |
| Expert #1–5, #11, #24, #27, #30 (long sentences, jobRelevance, tagline, youDo, iDo intro, storyboard, scale policy, out-strength instruction) | Expert + SQ | Active polish | Hand-split dense openings; tagline→relacional; storyboard/scale policy cadence; E2 instruction split | SQ **10.0** |
| Expert #7 (gender: transfer es dirigida) | Expert | Active | Self-check Q8: «La arista `transfer` es dirigida…» | Source read |
| Expert #8 / SQ `vs` | Expert + SQ | Partial | Normalized learner prose to `vs.` | Grep |
| Expert #9 tagline temporal vs relacional | Expert | Active | Tagline aligned to evidencia **relacional** | Source |
| Expert #23 shared-contact | Expert | Active | → contacto compartido (prose) | Grep 0 shared-contact |
| SQ missing_terminal_punct (edgeCases) | SQ medium | Active | Periods on selected edgeCases | Source |
| E2 31-01 degree centrality wrong formula | Expert-2 **critical** | Active | Theory + T3-B-E1 use `deg/(n−1)`; print `hub_degree_cent 0.6` | REPL + oracle |
| E2 31-02 idempotence destroys direction | Expert-2 **critical** | Active | T4-A-E3 `sorted(set(edges))`; instruction forbids `sorted(e)` per edge | REPL + oracle |
| E2 31-03 mixed weight units | Expert-2 high | Active | Theory demo adds `unit` per etype; prose “unidades por etype” | Oracle units line |
| E2 31-04/05 aggregation/provenance key | Expert-2 high | Active | Aggregate key `(src,dst,etype)`; prose requires semantic key | Oracle E1_E2_tx |
| E2 31-06 hard-coded success | Expert-2 | Partial | path `repro` and ego `test_ok` computed; shared_phone computed | Oracle |
| E2 31-11/12 exam bias + garbage distractors | Expert-2 **critical** | Active | Rewrote 24 V3 MCQs (prisma) + 12 extra; balanced keys; domain distractors | Counter {0:5,1:6,2:8,3:5} |
| E2 31-17 contact models | Expert-2 medium | Active | Canonical: contact-as-node; direct shared_phone = derived shortcut | Theory T2-A |
| E2 31-19 Spanish agreement exam | Expert-2 | Active | «traza auditable», «arista auditable» | Seed |
| E2 31-20 rubric bonus/gate labels | Expert-2 | Active | bonus vs gate obligatorio clarified | Rubric |
| E2 31-22 id streaming-data | Expert-2 / Explorer | Deferred | Keep platform id; silence learner-facing | Compatibility residual |
| E2 31-08/09/10/13/14 We Do UI levels, topicEvaluations, viz graphics | Expert-2 | Deferred | Platform / multi-section scope | Residual platform |
| RichText Markdown, filename rename | Cross-cutting | Deferred | Global agents | Residual platform |

### 2.2 Spanish quality

| Metric | Before (campaign JSON) | After R2 (`--no-lt`) |
|--------|------------------------|----------------------|
| Quality score | 9.1 / 10 | **10.0 / 10** |
| Findings total | 44 | **5** (mostly technical-token LT-style false positives under structure) |
| FH mean | 81.6 | **82.6** (fácil) |

### 2.3 Code oracles

- Theory + I Do + We Do solutions: **40/40** stdout match declared `output`.
- Degree: hub n=6 → `hub_degree_cent 0.6` (= 3/5).
- T3-B-E1 star: still `score 1.0` under correct `deg/(n−1)`.
- T4-A-E3: direction-preserving idempotence; A→B ≠ B→A when both present.

---

## 3. Full corrected content or precise diffs

Primary product edits are in:

1. `src/lib/course/sections/s31-streaming-data.ts` — theory, demos, exercises, youDo, selfCheck  
2. `prisma/seed.ts` — authenticated V3 bank for `'streaming-data'` (24 items)  
3. `scripts/seed_questions_extra.txt` — replaced legacy Kafka placeholders with 12 graph MCQs  

### Representative canonical diffs (hand-crafted)

**Tagline + jobRelevance**

```diff
-  tagline: "grafo temporal que responde cómo están conectados…"
+  tagline: "grafo de evidencia relacional: responde cómo están conectados… y sin convertir centralidad en culpabilidad"
-  jobRelevance: "En investigación… (banca, BPO, compliance en Perú), necesitas un **grafo de evidencia**: nodos, aristas…"
+  jobRelevance: "En investigación… — banca, BPO y compliance en Perú — necesitas un **grafo de evidencia**. Ese grafo se compone de nodos…"
```

**Degree centrality (theory T3-B)**

```diff
- # degree centrality: grado normalizado por el máximo del grafo
- max_d = max(degree_cent.values())
- norm = {n: degree_cent[n] / max_d for n in degree_cent}
+ # Degree centrality estándar: deg / (n - 1), no deg / max_observed
+ deg_cent = {v: degree[v] / (n - 1) for v in degree}
+ print("hub_degree_cent", round(deg_cent["HUB"], 2))
```

**Idempotent directed builder (T4-A-E3)**

```diff
- return sorted(set(tuple(sorted(e)) for e in edges))
+ return sorted(set(edges))  # conserva (src, dst)
```

**Aggregation key (theory T2-B)**

```diff
- k = (d["src"], d["dst"])
+ k = (d["src"], d["dst"], d["etype"])
```

**Self-check Q8**

```diff
- "transfer es dirigida; owns es entidad→cuenta; shared_phone es hecho de contacto."
+ "La arista `transfer` es dirigida; `owns` es entidad→cuenta; `shared_phone` es un hecho de contacto."
```

Full file state is the complete corrected section source (~2046+ lines with R2 edits). Exam bank full text is in `prisma/seed.ts` at the Section 31 V3 comment marker.

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Explorer ISSUE-01–17 | **Already fixed** (R1) + re-validated |
| Expert Spanish polish #1–11, #23–30 | **Fixed** or intentional residual (tagline no period) |
| Expert-2 31-01 degree | **Fixed** |
| Expert-2 31-02 direction | **Fixed** |
| Expert-2 31-03 units | **Fixed** (theory demo + prose) |
| Expert-2 31-05 agg key | **Fixed** (theory) |
| Expert-2 31-11/12 exam | **Fixed** (rebalanced + domain distractors) |
| Meta-leaks M1–M9 | **None** in learner prose |
| Code execution 40/40 | **PASS** |
| Spanish quality | **9.1 → 10.0** (`--no-lt`) |
| Answer-position V3 bank | **{0:5, 1:6, 2:8, 3:5}** (was 21× index 1) |
| Markdown ** in jobRelevance | Platform RichText residual (global) |
| Previous/next continuity | S30 ER → S31 graph → soft S34 workbench preserved |
| Accessibility | Synthetic labels Cliente-Demo-*; redaction demos intact |

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals
- Provenance field names still vary slightly across micro-demos (`source` vs `source_system`, `rid` vs `record_id`) in short exercises — acceptable pedagogical compression; You Do documents the full contract.
- Some `print(..., True)` pedagogical flags remain where the flag *is* the teaching point (e.g. `guilt_label False`).
- I Do “think-aloud” remains relatively short (Expert-2 31-08); deeper narrative would be a content expansion, not a bug fix.
- NetworkX is bridge/comment only (not required runtime).

### Repository-wide / platform
- Platform id / filename `streaming-data` / `s31-streaming-data.ts` (Global Agent C migration with aliases).
- `SectionView.tsx` RichText for Markdown fields (Global Agent A).
- Topic evaluations not mounted (roadmap gap; Global / fleet).
- No interactive graph visual component (platform + design).

### Deferred compatibility
- Do **not** rename `id: "streaming-data"` without progress/URL/exam-key migration.

---

## 6. Updated Graph Memory notes

```yaml
section: 31
id: streaming-data
title: Grafos y evidencia relacional
file: src/lib/course/sections/s31-streaming-data.ts
round: 2
status: fixed_validated
explorer_r1_score: 5.5
expert_r1_score: 8.4
spanish_before: 9.1
spanish_after: 10.0
edges:
  predecessor: S30 (ER probabilístico / CP-N3-A)
  successor_soft: S32 features; S34 Relationship Investigation Workbench
  capstone: CP-N3-B start
preserve:
  - ethics: centrality_not_guilt
  - ethics: shared_contact_not_kinship
  - fixture: CASO-LIM-031 / cpn3b-01 / @example.pe
  - pure_python algorithms + NetworkX bridge notes
  - R1 meta-leak eradication
resolved_r2:
  - degree_centrality_standard_formula
  - directed_idempotent_builder
  - weight_units_per_etype
  - aggregate_key_includes_etype
  - exam_bank_rebalance_and_distractors
  - spanish_polish_tagline_jobRelevance_long_sentences
  - contact_node_canonical_vs_derived_shared_phone
remaining_risks:
  - platform_id_streaming-data
  - RichText_markdown_global
  - topicEvaluations_not_mounted
  - no_interactive_graph_viz
compatibility:
  - keep id streaming-data
  - exam key streaming-data
assessment_coverage:
  - selfCheck: 10 MCQ (ethics + mechanics)
  - exam_v3: 24 MCQ balanced positions
  - exam_extra: 12 MCQ graph content (replaced Kafka stubs)
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s31-streaming-data.ts` | R2 pedagogy, technical correctness, Spanish polish |
| `prisma/seed.ts` | Authenticated exam bank S31 V3 only |
| `scripts/seed_questions_extra.txt` | Replace obsolete streaming placeholders for S31 only |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S31_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S31.md` | Full worklog entry |
| `expert_audit/worklog.md` | Completion pointer append |
| `course-state/curriculum_hardening/audits/spanish_quality/S31_SPANISH_QUALITY.json` | Regenerated by validation script |

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S31.md` (full)
- `expert_audit/worklog.md` (pointer Task ID: **FIXER-R2-S31**)

---

Section 31 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
