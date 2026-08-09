# S42 Fixer Report (Round 2) — Schemas, seguridad y privacidad de servicios

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S42  
**Section:** 42 · platform id `graph-rag` (silent; not learner-facing)  
**Source (only product file edited):** `src/lib/course/sections/s42-graph-rag.ts`  
**Anti-aberration:** **OK** — educational prose rewritten by hand unit-by-unit; mechanical validation only for code execution and Spanish metrics; edgeCases first-letter capitalization was a mechanical orthography pass on existing strings (no new exercise content generated).

---

## 1. Section identification and sources reviewed

| Field | Value |
|-------|--------|
| **Section number / title** | 42 — Schemas, seguridad y privacidad de servicios |
| **Canonical file** | `src/lib/course/sections/s42-graph-rag.ts` |
| **Live route** | https://pillb.github.io/pyarcana/#graph-rag |
| **Internal ID** | `graph-rag` (retained for deep links; never explained to learners) |
| **Primary Explorer** | `course-state/curriculum_hardening/audits/explorer_reports/S42_EXPLORER_REPORT.md` |
| **Expert report** | `expert_audit/S42_report.md` |
| **Expert-2 evidence** | `expert_audit/expert_2_audit/Auditoría de Calidad de la Sección 42.docx` |
| **Spanish-quality JSON** | `course-state/curriculum_hardening/audits/spanish_quality/S42_SPANISH_QUALITY.json` (pre R2: **8.4**/10) |
| **Grammar plan** | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| **Round-1 fixer (prior claim)** | `course-state/curriculum_hardening/audits/fixer_reports/S42_FIXER_REPORT.md` |
| **Worklog** | `expert_audit/worklog.md` |
| **Assessments** | In-file `selfCheck` (5 MCQ) + `youDo` portfolio; no separate bank edit |

**Scope note:** Round 1 already closed the Explorer registry (meta-leaks, local theory contracts, computing demos, CASO-CUS identity, payload-real T1-A/T3-A, youDo `policy_engine`, E3 transfer narratives). Round 2 verified that state and closed **expert + Spanish residual** items still active in source.

---

## 2. Summary of changes applied

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| I-01…I-20 / M1–M6 | Explorer | **Already fixed** (R1) | Re-validated; no regression | Meta scan clean |
| H-1 id/filename | Expert | **Platform residual** | Id `graph-rag` silent; no learner prose | Documented residual |
| H-2 SectionView demo | Expert | **Platform residual** | Out of section file scope | Documented residual |
| H-3 PdfReport GraphRAG | Expert | **Platform residual** | Out of section file scope | Documented residual |
| H-4 / M-1 jobRelevance run-on | Expert + SQ | **Active** | Split 5-clause semicolon chain; topic sentence “Cuatro frentes lo sostienen” | Manual + SQ |
| M-2 authn notation | Expert | **Active** | `authn≠authz` → `authn ≠ authz`; T2-A opens in Spanish with (authn)/(authz) | Scan |
| M-3 T2-A callout LEE_LE | Expert + SQ | **Active** | “conserva la prueba de que el actor A no lee el caso B” | Scan |
| M-4 booleans | Expert | **Active** | `booleanos` in portfolioNote | Scan |
| M-5 URLs / APIs | Expert | **Active** | Diccionario “URL”; resources “controles de API” | Scan |
| M-6 vs. | Expert + SQ | **Active** | `vs.` in diccionario + iDo demo description | Scan |
| M-7 headings EN | Expert | **Active** | “identidades de servicio”; “Límites de entrada…” | Manual |
| M-8 T3-B callout | Expert | **Active** | Two imperatives; articles | Manual |
| SQ run_on weDo intro | Spanish quality | **Active** | Split enumeration + adversarial list | SQ |
| SQ long iDo intro | Spanish quality | **Active** | Arrows → comma list + “y” | SQ |
| SQ Fixtures válido | Spanish quality | **Active** | “Fixtures válidos…” | Scan |
| SQ T4-B callout agreement | Spanish quality | **Active** | “el borrado y la no-reaparición verificados” | Scan |
| SQ T4-B-E1 agreement | Spanish quality | **Active** | “el primario y el derivado están borrados…” | Scan |
| SQ youDo “rutas normal” | Spanish quality | **Active** | “rutas normales” | Scan |
| E2/E3 salida vs code | R2 fidelity (S41 pattern) | **Active** | Token-triple exact salida (not “meets_contract”) | Matches solution outputs |
| Transfer: label | Expert 6.10 | **Active** | `Transferencia:` on all 8 E3 | Scan |
| pinneadas | Expert 6.10 | **Active** | `deps fijadas` | Scan |
| Rubric Correctitud | Expert + S41 pattern | **Active** | “Corrección técnica…” + terminal periods | Manual |
| edgeCases casing | Expert M-7 / S41 | **Active** | Spanish first words capitalized (`Falta…`, `Campo…`) | Scan |
| Expert-2 threat model gap | Expert-2 Issue 1 | **Partial** | youDo requirement: threat model mínimo (actores, activos, entry points, amenazas, mitigaciones) + residual | Manual |
| LO terminal periods | Expert 6.2 | **Active** | Periods on 8 learning outcomes | Manual |
| selfCheck Q2 explanation | Expert polish | **Active** | Full `DENY_CROSS_TENANT`; article before breach | Manual |

### What was *not* changed (justified)

| Item | Reason |
|------|--------|
| `id: "graph-rag"` / filename | Compatibility deep links; silent retention (Explorer + Expert H-1 global) |
| SectionView KnowledgeGraph demo / PdfReport “GraphRAG” | Global platform defect — not this agent’s file scope |
| Full Pydantic/FastAPI/OWASP production stack rewrite | Progressive stdlib model is intentional and stated; Expert-2 “toy controls” redesign is curriculum redesign, not R2 residual polish |
| Collapse 24 labs to ~12 | Structural product choice; missing≠breach taxonomy preserved |
| Variable name `meets_contract` inside E1 code | Legitimate domain variable; only learner **instructions** were corrected |

---

## 3. Precise changes (substance)

### 3.1 Opening and theory (hand-crafted)

- **jobRelevance:** one control family per sentence after a framing topic sentence.
- **learningOutcomes:** spaced `authn ≠ authz`; terminal periods.
- **Diccionario:** `vs.`; invariable `URL`.
- **T2-A P1:** Spanish authentication/authorization with parenthetical abbreviations.
- **Headings T2-B / T3-A:** Spanish-first terminology.
- **Callouts T2-A, T3-B, T4-B:** grammar, articles, split imperatives.

### 3.2 I Do / We Do

- **iDo intro:** comma enumeration instead of eight arrows.
- **iDo T4-B description:** `vs.`.
- **weDo intro:** shorter final clause; adversarial list as its own sentence.
- **8× E3:** `Transferencia:` + **salida exacta** = printed token triple.
- **7× E2** that still said “imprime meets_contract”: **salida exacta** = actual solution tokens.
- **T3-B-E3:** `pinneadas` → `fijadas`.
- **edgeCases ×24:** capitalised Spanish lead-ins where applicable.

### 3.3 You Do / self-check / resources

- Objective agreement; threat-model minimum requirement (Expert-2 light close).
- portfolioNote `booleanos`; clearer arrows.
- Rubric “Corrección técnica…” + periods.
- selfCheck explanation uses full deny code.
- Resources note: “API” invariable.

---

## 4. After-Fix Validation Report

### Issue-by-issue

| ID | Resolved? | Notes |
|----|-----------|-------|
| Explorer I-01…I-20 | **Already fixed** | Reconfirmed in current source |
| Explorer M1–M6 | **Already fixed** | Zero learner legacy/GraphRAG/DEFECT/LIM |
| Expert H-1/H-2/H-3 | **Residual platform** | Global agents |
| Expert H-4, M-1…M-8 | **Fixed** (section-local) | As table above |
| Spanish high AGREEMENT / LEE_LE | **Fixed** | SQ re-run |
| Expert-2 threat model | **Partial residual** | Requirement added; full STRIDE artifact still learner-owned depth |
| Expert-2 “toy path/SSRF/svc-” | **Residual pedagogical** | Stdlib model honesty retained |

### Mechanical validation

| Suite | Result |
|-------|--------|
| Theory + iDo titled code (17) + weDo solutions (24) | **41/41 PASS** — stdout matches declared `output` |
| youDo starter | `CASO-CUS-042 READY`; `deny_cross DENY_CROSS_TENANT`; `path_block REJECT_UNTRUSTED_INPUT` |
| Spanish quality (`--from 42 --to 42 --no-lt`) | **8.4 → 9.97**/10; findings 93 → 28; mean FH 82.5 |
| Meta-leak scan | 0: `CASO-LIM`, `graph_rag_topic`, `Id legacy`, `# DEFECT`, `GraphRAG` prose, `booleans`, `pinneadas`, `Transfer:`, bare `vs`, `authn≠authz`, “imprime … meets_contract” |

### Markdown / platform

- Section still uses `**bold**` in fields that may render as raw text via global SectionView RichText defect — **repository-wide**, not section-local.
- Live hash `#graph-rag` remains correct for SPA routing.

### Accessibility / continuity

- S41 → S42 map `handle()` request story retained.
- S42 → S43 forward sentence retained.
- Self-check 5 MCQ keys unchanged (`correctIndex` preserved).

**Explicit statement:**  
No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation (code execution, residual greps, Spanish-quality measurement, edgeCases capitalization).

---

## 5. Residual risks and later recommendations

1. **Platform (global):** replace SectionView `'graph-rag'` KnowledgeGraph playground with a `policy_engine` simulator; fix PdfReport label `"42. GraphRAG"` → `"42. Schemas y seguridad"`. Do **not** rename `id` without migration aliases.
2. **Pedagogy (optional later):** appendix with real Pydantic `extra='forbid'` / OAuth scopes; optional path confinement with `os.path`/`pathlib` beyond string prefix model.
3. **Expert-2 depth:** optional dedicated threat-model worksheet artifact beyond the new youDo requirement line.
4. **Volume:** 24 isomorphic E1/E2/E3 still intentional for missing≠breach; not reduced in R2.

---

## 6. Updated Graph Memory notes

```yaml
section: 42
id: graph-rag
file: s42-graph-rag.ts
title: Schemas, seguridad y privacidad de servicios
explorer_score: 6.0
r1_status: fixed
r2_status: residual_polish_complete
spanish_quality_before: 8.4
spanish_quality_after: 9.97
gate: CP-N4-A
case: CASO-CUS-042
prereq: S41 HTTP versioned API
forward: S43 governed platform / containers
retained_strengths:
  - local contracts per subtopic
  - missing ≠ breach taxonomy
  - computing demos (no print theater)
  - policy_engine youDo with calculated READY
resolved_defect_nodes:
  - jobRelevance_runon
  - authn_notation_drift
  - callout_LEE_LE
  - E2_E3_salida_meets_contract
  - Transfer_ES_label
  - booleanos_vs_booleans
remaining_risks:
  - platform_demo_graphrag
  - platform_pdf_label
  - stdlib_model_vs_production_stack
compatibility:
  - id graph-rag stable
assessment_coverage:
  - selfCheck 5 MCQ aligned CP-N4-A schema authz SSRF evolution
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s42-graph-rag.ts` | Only product/curriculum edit for Section 42 |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S42_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S42.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S42 |
| `course-state/curriculum_hardening/audits/spanish_quality/S42_SPANISH_QUALITY.json` (and fleet summary if regenerated by audit script) | Validation-only rewrite by audit script |

---

## 8. Worklog confirmation

- Full entry: `expert_audit/worklog_entries_r2/S42.md`
- Pointer appended to: `expert_audit/worklog.md` (Task ID: **FIXER-R2-S42**)

---

Section 42 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
