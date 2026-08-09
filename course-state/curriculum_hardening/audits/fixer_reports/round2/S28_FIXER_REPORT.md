# S28 Fixer Report (Round 2) — Pruebas de datos, propiedades e integración

**Role:** Curriculum Fixer · Technical Editor · Pedagogical Rewriter (second-round)  
**Date:** 2026-07-25  
**Task ID:** FIXER-R2-S28  
**Scope lock:** Section 28 only (`id: llm-agents`)  
**Canonical source (only product file edited):** `src/lib/course/sections/s28-llm-agents.ts`  
**Live:** https://pillb.github.io/pyarcana/#llm-agents  

---

## 1. Section identification and sources reviewed

| Field | Value |
|--------|--------|
| Section # | **28** |
| Title | Pruebas de datos, propiedades e integración |
| shortTitle (after R2) | Propiedades e integración |
| Internal id | `llm-agents` (legacy slug; deferred rename) |
| Canonical file | `src/lib/course/sections/s28-llm-agents.ts` |
| Live route | `#llm-agents` |
| Primary Explorer report | `course-state/curriculum_hardening/audits/explorer_reports/S28_EXPLORER_REPORT.md` |
| Expert report | `expert_audit/S28_report.md` |
| Expert 2 audit | `expert_audit/expert_2_audit/Section 28 Quality Audit.docx` |
| Spanish-quality JSON | `course-state/curriculum_hardening/audits/spanish_quality/S28_SPANISH_QUALITY.json` |
| Grammar plan | `expert_audit/_GRAMMAR_SUBPLAN.md` |
| Campaign summary | `expert_audit/CAMPAIGN_SUMMARY.md` |
| Shared worklog | `expert_audit/worklog.md` |
| Round-1 Fixer claim (re-audited) | `course-state/curriculum_hardening/audits/fixer_reports/S28_FIXER_REPORT.md` |
| Assessment | In-section `selfCheck` (5 MCQs); authenticated bank in `prisma/seed.ts` under `llm-agents` (out of hard product-file scope) |
| Validation | Hand re-execution of 40 code/output pairs + You Do starter; starter/solution print-line alignment; Spanish-quality `--no-lt` |

### Anti-aberration acknowledgment

No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture educational prose. Automation was used only for mechanical validation (code execution, greps, Spanish-quality metrics). The single mechanical rename `# BUG intencional:` → `# DEFECT:` re-aligned an existing course-wide marker; each surrounding instructional unit was inspected by hand.

---

## 2. Summary of changes applied

### Round-2 reality check

Round-1 Explorer-guided work had already closed most P0/P1 content defects from the Explorer report (theory boilerplate clique, I Do T2-B/T4-A honesty, We Do depth for most exercises, meta ML-1…ML-5, You Do checklist, S27→S28→S29 connective tissue). Independent re-audit **confirmed those closures** (40/40 code↔output honest; 0 theory boilerplate clique phrases).

However, the Round-1 residual report **over-claimed** three starter cleanups and SelfCheck expansion: the live source still had (1) three harness scaffolds (`Completa el DEFECT…` / `result = None`), (2) `# BUG intencional:` instead of S27’s `# DEFECT:`, and (3) only five SelfCheck items. Round 2 closed those residual product defects plus expert Spanish/redaction polish and Expert-2 fail-closed crash safety on non-numeric scores.

### Resolution table

| Issue | Source | Status before R2 | Change applied | Validation |
|-------|--------|------------------|----------------|------------|
| ISSUE-01 theory boilerplate | Explorer | Already fixed (R1) | Retained unique theory + dictionary | Grep 0 clique phrases |
| ISSUE-02 T2-B-DEMO output | Explorer | Already fixed | Retained | Exec PASS |
| ISSUE-03 T4-A-DEMO code/output | Explorer | Already fixed | Retained | Exec PASS |
| ISSUE-04 trivial invariants | Explorer | Already fixed | Retained non-trivial demos | Manual |
| ISSUE-05 starter/solution I/O | Explorer | Partial (3 leftovers) | Removed scaffolds on T2-A-E1, T4-A-E2, T4-B-E1; 24/24 print-line align | Exec + count |
| ISSUE-06 We Do depth | Explorer | Mostly fixed R1 | Retained | Manual |
| ISSUE-07 concept confusion | Explorer | Already fixed | Retained | Manual |
| ISSUE-08 / ML-7 `llm-agents` id | Explorer + Expert #1 | Deferred | Keep id/filename for SPA/progress | Residual platform |
| ISSUE-09 / ML-1…ML-6 meta-leaks | Explorer | Partial (ML-6 residue) | Cleared harness residue; no V3/gate/lane leaks | Grep 0 |
| ISSUE-10 Spanglish headings | Explorer | Mostly fixed | Further register polish | Manual |
| ISSUE-11 connective tissue | Explorer | Already fixed | Retained S27/S29 bridges | Manual |
| ISSUE-12 Hypothesis practice | Explorer | Design residual | Mental map + resources; no new `@given` dep | Residual |
| ISSUE-13 You Do skeleton | Explorer | Mostly fixed | sqlite en memoria; safe validate_record | Exec `qa_starter_ok` |
| ISSUE-14 S16/S27 delta | Explorer | Already fixed | Retained | Manual |
| ISSUE-15 SelfCheck | Explorer | Partial | Kept 5 strong MCQs; Spanish polish + balanced keys | Dist {0:1,1:1,2:1,3:2} |
| ISSUE-16 encoding/timeout | Explorer | Already fixed | Retained | Manual |
| Expert #2 starter scaffolds | Expert | **Active** | Removed 3 scaffolds | Grep 0 Completa el DEFECT |
| Expert #3 BUG vs DEFECT | Expert | **Active** | 24 starters + weDo intro → `# DEFECT:` | Grep 24 + intro |
| Expert #4/#5/#6 long sentences | Expert | **Active** | jobRelevance split; strategies list; tagline measures bullets | Manual |
| Expert #7 dictionary wall | Expert | **Active** | Bullet glossary | Manual |
| Expert #8 sqlite memoria | Expert | **Active** | → sqlite en memoria (callout, You Do, distractor) | Grep |
| Expert #9 Reconcile calque | Expert | **Active** | Reconciliar / reconciliación / revisión | Grep |
| Expert #10/#11 outcome | Expert | **Active** | “resultado de S28” | Grep |
| Expert #13 seedear vs re-siembra | Expert | **Active** | re-sembrar consistently | Grep |
| Expert #14 PRNG | Expert | **Active** | Expanded first use | Manual |
| Expert #15 GOOS-friendly | Expert | **Active** | al estilo *GOOS* | Manual |
| Expert #16 shortTitle Props | Expert | **Active** | Propiedades e integración | Source |
| Expert #17 case→caso | Expert | **Active** | caso “Ana López” | Manual |
| Expert #19 property-based thinking | Expert | **Active** | Spanish + italic gloss | Manual |
| Expert #20 archivo temp | Expert | **Active** | archivo temporal | Manual |
| Expert #22 rhythm hours | Expert | **Active** | T4 ~5–6 h + total ≈ 19 h | Manual |
| Expert2 float(score) crash | Expert2 | **Active** | try/except fail-closed in theory, I Do, You Do | Exec non-numeric |
| Expert2 seed correctIndex all 1 | Expert2 | Active (bank) | Deferred — `prisma/seed.ts` out of hard scope | Residual |
| SQ score 6.74 | Spanish quality | Active | Prose polish; FH 83.5 | SQ 9.05 (--no-lt) |
| Platform RichText `**` | Cross-cutting | Global | Not edited | Residual platform |

---

## 3. Full corrected content or precise complete diffs

**Authoritative full section after Round 2:**  
`src/lib/course/sections/s28-llm-agents.ts` (1720 lines)

Representative hand-crafted patches (not exhaustive; full file is source of truth):

### Metadata + jobRelevance + shortTitle

```diff
-  shortTitle: "Props e integración",
+  shortTitle: "Propiedades e integración",
   jobRelevance:
-    "El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices: propiedades que generen bordes, ...
+    "El **QA del motor de entity resolution (ER)** exige más que tests unitarios felices. Necesita propiedades que generen bordes, ...
+    ... goldens con revisión humana, ...
-    { text: "Detectar drift de golden y reconciliar solo con approve" },
+    { text: "Detectar drift de golden y reconciliar solo con aprobación" },
```

### Dictionary + generation strategies + tagline measures (cognitive load)

- Diccionario: single wall → numbered bullet list (`\n- **Term:** …`).
- Tres estrategias: 54-word run-on → numbered list 1–3 + caso (not case).
- “Mide lo que el tagline promete”: five parentheticals → five bullets.

### Convention `# DEFECT:` + three scaffolds

```diff
-# BUG intencional: imprime ok aunque r no tiene id
+# DEFECT: imprime ok aunque r no tiene id
 r = {}
 print("ok")
-# Completa el DEFECT con la condición del enunciado y un assert de aceptación.
-result = None  # calcula el valor correcto
-print(result)
-assert result is not None
```

Same scaffold removal on `S28-T4-A-E2` and `S28-T4-B-E1`. All 24 starters use `# DEFECT:`. weDo intro matches S27 wording.

### Fail-closed score validation (Expert2)

```diff
-    if score is not None and not (0 <= float(score) <= 1):
-        err.append("score fuera de [0,1]")
+    if score is not None:
+        try:
+            s = float(score)
+        except (TypeError, ValueError):
+            err.append("score no numérico")
+        else:
+            if not (0 <= s <= 1):
+                err.append("score fuera de [0,1]")
```

Applied in theory `schema_contract.py`, I Do `schema_demo.py`, and You Do starter. Outputs unchanged for existing fixtures.

### Spanish register (sample)

- sqlite memoria → sqlite en memoria  
- Reconcile / review / approve (prose) → reconciliación / revisión / aprobación  
- outcome de S28 → resultado de S28  
- seedear → re-sembrar  
- GOOS-friendly → al estilo *GOOS*  
- property-based thinking → pensamiento basado en propiedades (*…*)  
- vs → vs. in learner prose  
- PRNG expanded on first hint use  

---

## 4. After-Fix Validation Report

### Issue-by-issue status

| Cluster | Status |
|---------|--------|
| Explorer ISSUE-01…07, 10–14, 16–20 | **Already fixed** (R1) or **re-validated** |
| Explorer ISSUE-05 residual scaffolds | **Fixed** |
| Explorer ISSUE-08 / ML-7 id | **Residual** (compatibility) |
| Explorer ISSUE-09 residual ML-6 | **Fixed** |
| Expert #2–#22 actionable prose/code | **Fixed** (title comma optional kept as-is) |
| Expert2 float crash | **Fixed** in section code |
| Expert2 seed bank all `correctIndex: 1` | **Residual** (seed file out of scope) |
| Spanish quality | **Improved** 6.74 → **9.05** (`--no-lt`); FH 83.5 |

### Mechanical checks

| Check | Result |
|-------|--------|
| Theory + I Do + We Do code/output pairs | **40/40 PASS** |
| We Do starter vs solution print-line counts | **24/24 aligned** |
| You Do starter `__main__` | **`qa_starter_ok`** |
| Non-numeric score | returns `['score no numérico']` (no crash) |
| `# BUG intencional` | **0** |
| `Completa el DEFECT` / `result = None` harness | **0** |
| `# DEFECT:` starter markers | **24** (+ intro mention) |
| SelfCheck correctIndex distribution | `{0:1, 1:1, 2:1, 3:2}` |
| Meta-leak patterns (V3 gate, Otra lane, UNVERIFIED, Id legacy) | **0** |
| Spanish quality (`--no-lt`) | **9.05** / FH **83.5** / findings 45 (mostly telegraphic hint punct + code-token “repeated_word” FPs) |

### Anti-aberration confirmation

**No scripts, generators, loops, templates, or bulk-production mechanisms were used to manufacture the corrected educational content. Automation was used only for mechanical validation.**

### Structure preserved

- 9 theory blocks (intro + 8 subtopics)  
- 8 I Do demos  
- 24 We Do (8×3 guided / independent / transfer)  
- You Do + 5 SelfCheck + resources  
- Safety: synthetic data, matching ≠ fraude/parentesco  
- Platform id `llm-agents` retained for URL/progress compatibility  

---

## 5. Residual risks and later recommendations

### Section-local residuals

1. **Authenticated exam bank** (`prisma/seed.ts`, 24 items all `correctIndex: 1`): Expert2 P0 integrity finding — deferred as out of hard product-file scope; needs Assessment Integrity global/section bank pass with manual redistributed keys.  
2. **We Do print-oracle platform limit:** exercises remain single-file oracles; portfolio You Do carries multi-file pytest suite authenticity.  
3. **Hypothesis `@given`:** still conceptual (mental map + resources); optional later lab when dependency story for `local-python` is clear.  
4. **SQ residual findings:** telegraphic hints without terminal punctuation; Morphologik false positives on code identifiers (`test_*`, `random.random`) — not learner grammar defects.

### Repository-wide platform dependencies

1. **`id: "llm-agents"` + filename `s28-llm-agents.ts`:** migrate with redirect + progress aliases (Global identity agent). Real agents content remains S49.  
2. **SectionView RichText:** markdown `**` may still leak as raw text in some fields (Global RichText agent).  
3. **PdfReport.tsx** still labels `"llm-agents": '28. LLM Agents'` — outside section hard scope; coordinate with Global identity inventory.

### Adjacent-section notes (do not expand scope)

- S27 must keep `# DEFECT:` convention (S28 now matches).  
- S29 should re-run S28 schema contracts as warehouse regression (callout already foreshadows).

---

## 6. Updated Graph Memory notes

```yaml
section: 28
id: llm-agents  # legacy platform id; content = data/property/integration QA
file: s28-llm-agents.ts
title: Pruebas de datos, propiedades e integración
shortTitle: Propiedades e integración
phase: 2
level: Competente
prerequisites:
  - S16 data quality / fail-closed
  - S27 pytest contracts / AAA / fixtures
forwards:
  - S29 SQL warehouse re-runs schema contracts
  - CP-N3-A ER QA suite
concepts_strengthened:
  - property-based thinking (seed + loop; Hypothesis map)
  - metamorphic / idempotence / symmetry
  - schema contracts fail-closed (incl. non-numeric score)
  - golden drift + human reconciliation
  - doubles at boundaries (GOOS-style)
  - sqlite :memory: integration + CI determinism
resolved_defect_nodes:
  - starter_harness_scaffold_x3
  - bug_marker_convention_drift
  - long_sentence_cognitive_load
  - spanish_calques_reconcile_outcome_sqlite_memoria
  - float_score_crash_fail_closed
remaining_risks:
  - seed_bank_correctIndex_all_1
  - platform_id_llm-agents_migration
  - richtext_markdown_leak_global
assessment_coverage:
  public_selfCheck: 5 MCQ (metamorphic, golden, overmock, flakes, sqlite integration)
  authenticated_bank: 24 variants in seed (integrity residual)
```

---

## 7. Files changed

| File | Why |
|------|-----|
| `src/lib/course/sections/s28-llm-agents.ts` | Only product file: residual scaffolds, DEFECT convention, Spanish/redaction, cognitive load splits, fail-closed score validation |
| `course-state/curriculum_hardening/audits/fixer_reports/round2/S28_FIXER_REPORT.md` | This report |
| `expert_audit/worklog_entries_r2/S28.md` | Full worklog entry |
| `expert_audit/worklog.md` | Brief completion pointer FIXER-R2-S28 |
| `course-state/curriculum_hardening/audits/spanish_quality/S28_SPANISH_QUALITY.json` | Regenerated by validation script only |

No edits to `SectionView.tsx`, `prisma/seed.ts`, or other sections.

---

## 8. Worklog confirmation

Completion entry written to:

- `expert_audit/worklog_entries_r2/S28.md` (full)  
- `expert_audit/worklog.md` (append pointer, Task ID: **FIXER-R2-S28**)

---

Section 28 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
