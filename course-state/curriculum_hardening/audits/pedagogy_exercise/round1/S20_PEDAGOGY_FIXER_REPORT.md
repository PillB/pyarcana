# S20 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Automatización robusta de Excel
- **shortTitle:** Excel factory
- **id:** `rag` (archivo histórico `s20-rag.ts`; contenido = excel factory openpyxl)
- **source:** `src/lib/course/sections/s20-rag.ts`
- **review input:** `round1/S20_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s20-rag.ts` (prose fields + instruction/feedback/hint polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (steps; no E_n essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S20-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: sheetnames canónicos Entrada/Salida → fórmulas vs. valores materializados (CI headless) → plantilla intocable copy→load→save → fechas ISO y merges/ancla → conciliación + pivot → headers/allowlist fail-fast → batch ok/corrupt/locked → manifest + idempotencia.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning and auditor/VP impact where the review flagged polish (T3-A, T3-B, T4-A, T4-B and peers)
- Softened spoiling one-liner hints on T2-A-E2, T2-A-E3, T2-B-E2, T4-A-E3, T4-B-E1/E2/E3 while keeping E1 scaffold useful

Fade preserved: rename+header → append/max_row → sheetnames Entrada/Salida; formula string → materialize sum → es_formula; Font bold → PatternFill 1F4E79 → copy/load/save; date ISO → non-anchor None → len merges; portada reconcile → groupby sum → reconcile(tol); headers → violators → validate_rows; ok_count → classify → Counter; manifest hash → dig sorted → structural_ok superset.

### You Do (1)
- Added `retrospective` de defensa/portafolio (manifest master hash + reconcile_ok; lock/corrupt real; frase de impacto medible hacia S21).
- Added one line to `portfolioNote` on expected console prints (`master_intact True`, `reconcile_ok True`, `manifest_written True`).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter defects (`# Pista:…`, mean vs sum, idempotent=False, structural_ok `==`) | **Unchanged** |
| Hash canónico T4-B-E1 `651f3b6b` | **Unchanged** |
| Hash demo T4-B `3e819052` | **Unchanged** |
| openpyxl dependency honesty | **Unchanged** |
| T2-B-E2 output only C1=`None` | **Unchanged** (optional harden left for Round 2) |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `E_n (guiado|…)` instruction essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `['Entrada', 'Salida']`, `python_value 25`, `results.xlsx`, `reconcile True`, `651f3b6b`, `{'ok': 2, 'corrupt': 1, 'locked': 1}`, `3e819052`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Hints still somewhat guided on E1s by design; E2/E3 soft-hints may need another fade pass if learners still over-rely on them.
3. openpyxl dependency: demos/exercises fail without the library — documented by environment `local-python`, not hidden.
4. T2-B-E2: output only validates non-anchor `None` (false-pass if learner skips writing B1); harden only if product accepts changing tests/output.
5. Internal id/path `rag` / `s20-rag.ts` still mismatches Excel-factory content — product/orchestrator concern, not exercise prose.
6. You Do starter with JSON write commented: retrospective + portfolioNote insist on `manifest_written True`.

## Files touched
1. `src/lib/course/sections/s20-rag.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S20.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*

Section 20 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
