# S29 Fixer Report (Round 2) — SQL avanzado y modelado relacional

**Role:** Second-round Section Fixer · Technical Editor · Pedagogical Rewriter  
**Run date:** 2026-07-25  
**Task ID:** FIXER-R2-S29  
**Status:** `fixed_validated`

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section number / title | **29** — SQL avanzado y modelado relacional |
| Canonical file | `src/lib/course/sections/s29-mlops.ts` |
| Live route | https://pillb.github.io/pyarcana/#mlops |
| Internal ID | `mlops` (legacy slug retained for progress/URLs; content is SQL/ER warehouse, **not** MLOps) |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S29_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S29_report.md` (score 8.0; polish + id/level) |
| Expert-2 audit | `expert_audit/expert_2_audit/Auditoría de la Sección 29.docx` (score 7.9; schema/domain) |
| Spanish-quality JSON (pre) | `course-state/curriculum_hardening/audits/spanish_quality/S29_SPANISH_QUALITY.json` (pre **8.22**) |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign / fleet context | `expert_audit/CAMPAIGN_SUMMARY.md`, Spanish fleet summaries |
| Round-1 Fixer (context only) | `course-state/curriculum_hardening/audits/fixer_reports/S29_FIXER_REPORT.md` |
| Assessment surface | Public `selfCheck` (8 MCQs) in canonical file; authenticated exam bank not modified this pass |
| Validation | Python executable-oracle harness on **40** code↔output pairs + **24** We Do starter≠oracle; Spanish audit `--from 29 --to 29 --no-lt` |

**Scope obeyed:** Only `s29-mlops.ts` was edited. No `SectionView.tsx`, no other sections, no id/filename migration.

**Anti-aberration:** No scripts, generators, loops, templates, or bulk mechanisms manufactured educational prose. Python was used only to execute snippets and compare stdout to claimed `output`, and to run the Spanish-quality measurement script.

---

## 2. Summary of changes applied

### Reality check (Phase 2)

Round-1 Fixer already resolved Explorer **P0** trust issues (all 8 I Do demos aligned; FK `PRAGMA` honesty; We Do DEFECT bank; print-theater removed; meta-leaks M1–M3 eliminated). Re-validation this round: **40/40** code↔output, **24/24** We Do starter≠oracle, meta greps clean.

Active residuals came from the **expert report** (redaction/level) and **expert-2** (relational modeling of the You Do store, NOT EXISTS vs NOT IN contradiction, ACID/Consistency, cardinality math, progressive-load path).

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| Exp ISSUE-01…04 I Do/We Do oracles | Explorer | **Already fixed** (R1) | Re-validated | 40/40 oracles |
| Exp ISSUE-05 boilerplate | Explorer | Already fixed | Re-validated | Grep shells absent |
| Exp ISSUE-07…09 meta-leaks | Explorer | Already fixed | Re-validated | Grep clean |
| Exp ISSUE-17 / Expert H-1 id `mlops` | Explorer + Expert | Platform debt | **Preserved** `id: "mlops"`; prose silent | Residual product |
| Expert H-2 level | Expert | **Active** | `Competente` → `Competente a experto` | Read |
| Expert M-1 jobRelevance | Expert | Active | Split sentence; *warehouse* gloss | Editorial |
| Expert M-2 portfolioNote | Expert | Active | Numbered list (1)–(4) | Editorial |
| Expert M-3 youDo.context | Expert | Active | Multi-sentence brief + bridge schema | Editorial |
| Expert M-4 iDo.intro | Expert | Active | Semicolon list + predict/contrast | Editorial |
| Expert M-5/M-8 ACID + *commitear* | Expert | Active | ACID bullets; “confirmado/confirmarse”; no *commiteado* | Grep |
| Expert M-6 isolation run-on | Expert | Active | Three sentences; S38 forward | Editorial |
| Expert M-7 oráculo del solution | Expert | Active | “salida esperada de la solución”; backticks `starter`/`DEFECT` | Grep |
| Expert M-9 warehouse register | Expert | Active | Primary *almacén*; *warehouse* synonym once | Editorial |
| Expert L / vs. | Expert + grammar | Active | `vs.` in COUNT description + LO | Editorial |
| E2 ISSUE-01 source→entity reverse | Expert-2 | **Active P1** | Map + theory: N–N via `entity_source_links` | Read |
| E2 ISSUE-02 evidence FKs | Expert-2 | Active P1 | You Do: `decision_id NOT NULL REFERENCES decisions(id)` | Starter DDL |
| E2 ISSUE-03 UNIQUE(entity_a,entity_b) | Expert-2 | Active P1 | You Do UNIQUE + theory CHECK+UNIQUE | Starter DDL |
| E2 ISSUE-04 provenance fields | Expert-2 | Active P1 | `ingested_at`, `transform_version`, `run_id`, `linked_at`, `decided_at NOT NULL` | Starter DDL |
| E2 ISSUE-05 stdout-only tests | Expert-2 | Partial residual | You Do requires `test_store.py` suite; bank still stdout (platform) | Requirements |
| E2 ISSUE-06 NOT IN vs NOT EXISTS | Expert-2 | **Active P1** | Theory repo, T2-A-E1, T4-B-E3 → `NOT EXISTS`; pair_id NOT NULL | Oracles |
| E2 ISSUE-07 EXPLAIN text fragility | Expert-2 | Partial | Theory: plan diagnostic + `PRAGMA index_list`; self-check note | Editorial |
| E2 ISSUE-08 I Do think-aloud | Expert-2 | Partial | Intro predict/contrast; why fields enriched | Editorial |
| E2 ISSUE-09 load path | Expert-2 | Active | Núcleo / consolidación / extensión in overview + weDo.intro | Editorial |
| E2 ISSUE-10 concurrency oversell | Expert-2 | Active | Heading “reintentos y recuperación”; S38 honest scope | Editorial |
| E2 ISSUE-11 Consistency definition | Expert-2 | Active | Valid state + immediate FK timing in SQLite | Editorial |
| E2 ISSUE-12 cardinality math | Expert-2 | Active | n² vs n(n−1) vs C(n,2) ≈ 50M | Editorial |
| E2 ISSUE-13 acceptance suite | Expert-2 | Partial | Requirements list `test_store.py` + artifact set | Editorial |
| E2 ISSUE-14 ER diagram | Expert-2 | Deferred | Map text improved; full diagram residual | Residual |
| E2 ISSUE-15 lexicon | Expert-2 | Active | *writes*→escrituras, *prod*→producción, *migrations*→migraciones, glosses | Grep |
| E2 ISSUE-16 id mlops | Expert-2 | Deferred | Compatibility preserve | Residual |
| Spanish SQ mediums | Spanish JSON | Mostly FP | Real nits fixed (*matchean*, *commiteado*, long sentences) | SQ 9.68 |

---

## 3. Full corrected content or precise complete diffs

**File edited:** `src/lib/course/sections/s29-mlops.ts` only.

### Key prose / metadata deltas

- `level: "Competente a experto"`
- `jobRelevance`: split value sentence; *repository* / *warehouse* glossed
- Overview: chain with `entity_source_links`; load path núcleo/consolidación/extensión
- T1-A: 3NF + evidence→decision; N–N source links; UNIQUE pair
- T2-B: correct cardinality math (n² / n(n−1) / C(n,2))
- T3-A: ACID rewritten; no *commiteado*; Consistency precise; isolation split + S38
- T3-B heading: “Upserts, reintentos y recuperación”; multi-connection honesty
- T4-A heading: “Índices y migraciones”; plan diagnostic note
- T4-B: repository/pooling Spanish; `NOT EXISTS` in theory code
- iDo.intro: semicolon list + predict/contrast metacognition
- weDo.intro: salida esperada; E1 núcleo / E2 consolidación / E3 extensión
- T2-A-E1 & T4-B-E3: `NOT EXISTS` solutions; edge cases on NULL trap
- You Do: full schema bridge + UNIQUE + evidence FK + provenance; context/portfolio/rubric/requirements aligned
- selfCheck: *Commitearse*/*prod* cleaned; repository/EXPLAIN explanations enriched
- LO: entity_source_links, NOT EXISTS safety, migraciones, `vs.`

### You Do schema (core DDL change)

```sql
-- source_records + provenance columns
-- entities (no single source_record_id FK)
-- entity_source_links (N–N bridge with linked_at, transform_version, run_id)
-- candidate_pairs: CHECK(entity_a < entity_b), UNIQUE(entity_a, entity_b)
-- decisions: label CHECK, decided_at NOT NULL
-- evidence: decision_id NOT NULL REFERENCES decisions(id), note NOT NULL
```

### Diff magnitude

Hand-crafted edits across metadata, theory (T1–T4), iDo intro/why, weDo intro + 2 exercises, youDo block, selfCheck options/explanations, learning outcomes. No bulk rewrite of the 24-exercise bank beyond T2-A-E1 and T4-B-E3.

---

## 4. After-Fix Validation Report

| Check | Result |
|-------|--------|
| Theory + iDo + solution code ↔ `output` | **40/40 PASS** |
| We Do starter stdout ≠ solution oracle | **24/24 PASS** |
| Meta-leak greps (`legacy`, `section_passed`, `gate V3`, `oráculo del solution`, `commitead`) | **0 hits** |
| Spanish quality (pre → post, `--no-lt`) | **8.22 → 9.68** (FH **82.3**, WPS **16.88**) |
| Remaining SQ “medium” | Heuristic FPs (`NULL = NULL`, missing period on labels/edgeCases, unbalanced `…` in markdown) |
| Markdown `**` in jobRelevance | Still depends on global RichText (platform residual) |
| TypeScript project | Unrelated error in `s25-streamlit-dashboards.ts` (out of scope) |
| Authenticated exam bank | Not present as separate S29 file; public selfCheck only |

**Issue-by-issue disposition:**

| Band | Disposition |
|------|-------------|
| Explorer P0–P1 (01–13, 21) | Fixed in R1; re-validated R2 |
| Explorer P2–P3 | Fixed or deferred (id, hours) |
| Expert H-2 + M-1…M-9 | **Fixed** this round |
| Expert H-1 id rename | Residual (compatibility) |
| Expert-2 01–04, 06, 10–12, 15 | **Fixed** this round |
| Expert-2 05, 07–09, 13–14, 16–17 | Partial / residual (documented) |

**Explicit anti-aberration statement:**

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **Stdout-only We Do tests** (Expert-2 ISSUE-05): platform harness still matches printed oracle strings; full property tests would need exercise-runner changes outside this section file.
2. **ASCII/mermaid ER diagram** (ISSUE-14): map improved in prose; visual diagram still optional polish.
3. **I Do think-aloud depth** (ISSUE-08): intro + why enriched; not full per-line expert monologue.
4. **EXPLAIN exercises** still partially depend on plan text containing `INDEX`/`SCAN` (mitigated with diagnostic framing).

### Repository-wide platform dependencies

1. **`id: "mlops"` / `s29-mlops.ts` / `#mlops`:** confusable with S47 MLOps; needs Global Agent C migration with progress aliases.
2. **SectionView RichText** for `jobRelevance`, callouts, step fields: Global Agent A.
3. **Authenticated exam bank constructive alignment** if a shared bank keys on `mlops`.

### Adjacent-section notes (do not expand this fix)

- S30 should consume the corrected N–N source→entity model.
- S38 owns multi-connection isolation / `BEGIN IMMEDIATE` depth.

---

## 6. Updated Graph Memory notes

```yaml
section: 29
id: mlops
file: s29-mlops.ts
v3_topic: "SQL avanzado y modelado relacional / almacén ER CP-N3-A"
explorer_score_before: 4.6
r1_score_estimate: 9.65
r2_status: fixed_validated
spanish_quality: { before: 8.22, after: 9.68, fh: 82.3 }
meta_leaks_remaining: 0
corrected_concept_nodes:
  - entity_source_links_N_N
  - evidence_fk_decision_id
  - unique_canonical_pair
  - not_exists_anti_join
  - acid_consistency_state
  - cardinality_n2_vs_c_n_2
  - load_path_nucleo_consolidacion_extension
prerequisite_edges:
  - S12_SQL_param / S27_pytest / S28_props → S29
forward_edges:
  - S29 → S30_probabilistic_ER
  - S29_concurrency_honesty → S38
resolved_defect_nodes:
  - iDo_output_mismatch (R1)
  - print_theater_weDo (R1)
  - meta_legacy_mlops_prose (R1)
  - wrong_source_entity_cardinality (R2)
  - evidence_orphan_schema (R2)
  - not_in_null_trap_in_repo (R2)
  - commitear_anglicism (R2)
  - level_phase_mismatch (R2)
remaining_risks:
  - platform_id_mlops_vs_S47
  - stdout_only_autograde
  - richtext_markdown_platform
compatibility_constraints:
  - preserve id mlops and progress keys
assessment_coverage:
  - selfCheck: 8 (canonical order, append-only, ACID, repo, no_drop, FK pragma, IS NULL, EXPLAIN)
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s29-mlops.ts` | Sole product edit: schema, theory, I/We/You Do, self-check, Spanish/level polish |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S29_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S29.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer (append) |
| `course-state/curriculum_hardening/audits/spanish_quality/S29_SPANISH_QUALITY.json` | Regenerated by validation script only |

---

## 8. Worklog confirmation

- Full entry written to `expert_audit/worklog_entries_r2/S29.md`
- Completion pointer appended to `expert_audit/worklog.md` with Task ID **FIXER-R2-S29**

---

Section 29 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
