# S47 Fixer Report (Round 2) — MLOps: experimentos, registro y serving

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S47  
**Section:** 47 · platform id `opensource` (silent; not learner-facing)  
**Source (only product file edited):** `src/lib/course/sections/s47-opensource.ts`  
**Anti-aberration:** **OK** — educational prose rewritten by hand unit-by-unit; mechanical validation only for code execution and Spanish metrics; edgeCases lead-in capitalization was a mechanical orthography pass on existing strings (no new exercise content generated).

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| **Section number / title** | 47 — MLOps: experimentos, registro y serving |
| **Canonical file** | `src/lib/course/sections/s47-opensource.ts` |
| **Live route** | https://pillb.github.io/pyarcana/#opensource |
| **Internal ID** | `opensource` (retained for deep links; never explained to learners) |
| **Primary Explorer** | `course-state/curriculum_hardening/audits/explorer_reports/S47_EXPLORER_REPORT.md` |
| **Expert report** | `expert_audit/S47_report.md` |
| **Expert-2 evidence** | `expert_audit/expert_2_audit/section-47-explorer-report.md` |
| **Spanish-quality JSON** | `course-state/curriculum_hardening/audits/spanish_quality/S47_SPANISH_QUALITY.json` (pre R2 fleet: **8.76**/10; post R2 `--no-lt`: **10.0**/10) |
| **Grammar plan** | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| **Round-1 fixer (prior claim)** | `course-state/curriculum_hardening/audits/fixer_reports/S47_FIXER_REPORT.md` |
| **Worklog** | `expert_audit/worklog.md` |
| **Assessments** | In-file `selfCheck` (8 MCQ) + `youDo` portfolio; authenticated bank key `opensource` in `prisma/seed.ts` (not edited this pass) |

**Scope note:** Round 1 already closed the Explorer registry (meta-leaks, CASO-LIM, edgeCases adverse truths, diversified contracts, computing demos, action-code alignment, seed≠42 rule, measurable LOs, youDo scaffold, icon Server). Round 2 verified that state and closed **expert Spanish/redaction + Expert-2 technical-currency note + residual polish** still active in source.

---

## 2. Summary of changes applied

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01…21 / M1–M6 | Explorer | **Already fixed** (R1) | Re-validated; no regression | Meta/CASO-LIM/ROLLBACK_MODEL greps clean |
| Expert #1 / E2-I2 id/filename | Expert + Expert-2 | **Platform residual** | Id `opensource` silent; no learner prose | Documented residual |
| Expert #2 jobRelevance run-on | Expert HIGH | **Active** | Split into 4 sentences (context / cycle / promote criterion / rollback) | Manual + SQ |
| Expert #3 verificados | Expert + SQ | **Active** | Callout + hint echo → digest, card y compatibilidad **verificadas** | Scan |
| Expert #4 versionados slash-list | Expert | **Active** | Comma list in T1-B-E1 instruction, E2/E3 hints | Scan |
| Expert #5 o→u over-traffic | Expert + SQ | **Active** | Hint T4-A-E1: `u over-traffic` | Scan |
| Expert #6 vs. | Expert + SQ | **Active** | Prose `vs.` in LOs, theory T1-A, iDo desc, feedback E1/E3 | Scan |
| Expert #7 MIT 6.100 L | Expert | **Active** | Space before unit letter | Scan |
| Expert ML-2 CF-4/CP-N4-B | Expert INFO | **Active** | Glossary entries at start of map dictionary | Manual |
| Expert #8 tagline arrow | Expert LOW | **Active** | `del experimento al servicio` + `(CF-4)` | Manual |
| LO terminal periods | Expert/S42 pattern | **Active** | Periods on 8 learning outcomes | Manual |
| edgeCases casing | Expert M-7 / S42 | **Active** | `Falta…` / `Adverso:` lead-ins (24×) | Scan |
| Rubric polish | S42 pattern | **Active** | “Corrección técnica…” + terminal periods | Manual |
| Expert-2 Issue 1 MLflow stages | Expert-2 Critical | **Partial** | Dictionary + T2-A teach modern **alias/tags**; lab keeps `staging`/`production` as simplified environment gates; resource note updated; LO#3 + selfCheck Q5 rephrased | Manual (exercises unchanged by design) |
| Expert-2 Issue 6 youDo residual | Expert-2 High | **Partial** | Starter prints `residual_risk` evidence line | Code exec |
| Theory article “el lineage” | Expert 6.2 | **Active** | “desde el lineage… hacia el lineage…” | Manual |
| SQ long E3 / schema dumps | Spanish quality | **Residual intentional** | Contract rhythm preserved; not bulk-rewritten | SQ residual low |

### What was *not* changed (justified)

| Item | Reason |
|------|--------|
| `id: "opensource"` / filename `s47-opensource.ts` | Compatibility deep links, progress keys, seed bank; silent retention (Explorer + Expert + protocol: do not break stored progress) |
| SectionView RichText / global platform | Out of section file scope |
| Full MLflow server + real serving vertical slice | Expert-2 redesign of construct depth; intentional stdlib contract pedagogy preserved; would be a curriculum redesign, not R2 residual polish |
| Collapse/redesign of 24 E1–E3 labs into diverse artefact types | Structural product choice; fail-closed taxonomy and R1 scaffolding preserved |
| Rewrite all T2-A exercises to use only aliases | Lab contracts stay stable; theory now labels stages as simplified environment gates |
| Authenticated exam variants in `prisma/seed.ts` | Not required by residual Spanish/expert prose fixes; public selfCheck aligned |

---

## 3. Precise changes (substance)

### 3.1 Opening and theory (hand-crafted)

- **tagline:** arrow glyph → Spanish connective; CF-4 parenthetical.
- **jobRelevance:** four-sentence workplace scene (Lima/Arequipa ranker).
- **learningOutcomes:** measurable statements with terminal periods; LO#3 names entorno/alias + approve ≠ digest alone; `vs.`.
- **Diccionario:** CF-4, CP-N4-B; modern registry (alias/tags) with lab simplification note.
- **Map bridge:** definite articles on lineage phrases.
- **T2-A P1/P3:** modern MLflow alias/tag practice; staging as didactic pre-prod gate.
- **T2-B callout:** `verificadas` agreement.

### 3.2 I Do / We Do

- **iDo T2-A description:** `vs.`.
- **T1-A feedback E1/E3:** `vs.` abbreviations.
- **T1-B instruction + hints:** comma-separated lineage fields + versionados (multi-noun coordination preserved intentionally).
- **T2-B hint echo:** verificadas.
- **T4-A-E1 hint:** `u over-traffic`.
- **edgeCases ×24:** capitalised Spanish lead-ins (`Falta…`, `Adverso:`).

### 3.3 You Do / self-check / resources

- **youDo starter:** prints `residual_risk` for portfolio evidence discipline.
- **rubric:** “Corrección técnica…” + periods on criteria.
- **selfCheck Q5:** production as environment/alias without approve → block until approval + card.
- **resources:** MLflow Registry note (alias/tags; stages didactic); MIT `6.100 L`.

---

## 4. After-Fix Validation Report

### Issue-by-issue

| ID | Resolved? | Notes |
|----|-----------|-------|
| Explorer ISSUE-01…21 / M1–M6 | **Already fixed** | Reconfirmed in current source (R1) |
| Expert #1 id/filename | **Residual platform** | Silent id only |
| Expert #2–#7, ML-2, tagline, articles | **Fixed** | Section-local prose |
| Spanish high AGREEMENT / Y_E_O_U / PUNTO_EN_ABREVIATURAS | **Fixed** (actionable) | Score 8.76→10.0 (`--no-lt`) |
| Expert-2 MLflow stages | **Partial residual** | Taught as modern vs lab model; full alias-only exercises deferred |
| Expert-2 Boolean authenticity / 24-template | **Residual product** | Documented; not a silent omission of Explorer P0 |
| Expert-2 roadmap ledger contradiction | **Out of section file scope** | Global Agent C / docs |
| Code execution | **Pass** | 24/24 solutions; 17/17 theory+iDo demos; youDo READY path prints residual_risk |
| Markdown ** in jobRelevance | **Platform residual** | SectionView RichText global (not edited) |
| Answer keys selfCheck | **Intact** | correctIndex unchanged except Q5 wording; answer position same |

### Explicit anti-aberration statement

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (solution/demo execution, Spanish-quality metrics, residual greps).

### Metrics

| Metric | Before R2 | After R2 |
|--------|-----------|----------|
| Spanish quality (`--no-lt`) | 8.76 (fleet JSON with LT noise) | **10.0** (findings 17, mostly long E3 + intentional schema lists) |
| Fernández-Huerta (section) | ~71.2 | **71.7** |
| Solution codes | n/a (R1 already green) | **24/24 PASS** |
| Theory + iDo demos | n/a | **17/17 PASS** |
| youDo starter | path prints ok | + `residual_risk` line; rc 0 |

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **E3 instruction length / comma-density schema dumps** — intentional contract precision; optional future split into bullet schemas without changing predicates.
2. **Heuristic `repeated_word` on `fallback`, `fallback_tested`** — false positive (two distinct field names).
3. **Expert-2 construct depth** — predicates-as-gates remain the didactic core; a future optional lab track with local MLflow would be a product decision.

### Repository-wide / platform

1. **`id: "opensource"`** + filename + seed bank key — needs Global Agent C migration with alias redirect.
2. **SectionView RichText** for `jobRelevance` / callouts — Global Agent A.
3. **Roadmap / ledger “Open Source” residue** — docs/ledger fix, not this TS file.

### Deferred

- Renaming platform hash.
- Replacing 24 Boolean labs with multi-artefact transfer set.
- Editing `prisma/seed.ts` authenticated variants (public selfCheck already aligned).

---

## 6. Updated Graph Memory notes

```json
{
  "section": 47,
  "id": "opensource",
  "v3_title": "MLOps: experimentos, registro y serving",
  "round": "FIXER-R2",
  "explorer_score_original": 5.7,
  "r1_status": "P0/P1_closed",
  "r2_focus": ["jobRelevance_split", "vs_period", "o_u_over_traffic", "verificadas", "CF4_glossary", "mlflow_alias_note", "edgeCases_casing", "residual_risk_print"],
  "strengths_retained": [
    "fail_closed_E1_E2_E3_lattice",
    "computing_demos_not_print_theater",
    "CASO_TAC_047_continuity",
    "action_verbs_aligned",
    "selfCheck_x8_coverage"
  ],
  "resolved_defect_nodes": [
    "jobRelevance_48w_runon",
    "vs_without_period",
    "o_over_traffic",
    "verificados_agreement",
    "undefined_CF4_on_first_read",
    "stages_taught_as_only_modern_path"
  ],
  "remaining_risks": [
    "platform_id_opensource",
    "expert2_boolean_vs_real_mlops_depth",
    "SectionView_RichText_markdown"
  ],
  "edges": {
    "prev": "S46 data lineage → S47 model lineage/serving",
    "next": "S48 AI governance (phase continuity)",
    "gates": ["CP-N4-B", "CF-4"]
  },
  "compatibility": {
    "url_hash": "opensource",
    "progress_key": "opensource",
    "seed_bank": "opensource"
  }
}
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s47-opensource.ts` | Only product edit: residual expert Spanish, glossary, MLflow currency note, polish, youDo residual_risk |
| `course-state/.../fixer_reports/round2/S47_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S47.md` | Full worklog entry |
| `expert_audit/worklog.md` | Append-only completion pointer |
| `course-state/.../spanish_quality/S47_SPANISH_QUALITY.json` | Regenerated by validation script (`--no-lt`) |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S47.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S47**)

---

Section 47 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
