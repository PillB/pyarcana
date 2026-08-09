# S47 Pedagogy Fixer Report (Round 1)

## Section
- **title:** MLOps: experimentos, registro y serving
- **shortTitle:** MLOps serving
- **id:** `opensource` (archivo `s47-opensource.ts`; el **contenido** es Production Data/ML Platform — tracking, registry, feature parity, canary y rollback — **no** “open source” genérico)
- **source:** `src/lib/course/sections/s47-opensource.ts`
- **review input:** `round1/S47_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s47-opensource.ts` (prose fields + instruction/feedback/why polish + youDo retrospective/portfolioNote).
- Pedagogical prose authored unit-by-unit from the review proposals (Tacna / CASO-TAC-047 / CF-4 vocabulary per subtema). **No** generators that invent educational content; **no** cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective; context already solid)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (numbered steps; no dense “E# · Concepto + DEFECT” essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used for educational prose
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S47-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: tracking/repro → lineage/comparación honesta → firmas/staging/approve → artefactos/card → batch/online parity → p95/fallback → canary/hooks → rollback/retirement/audit (CP-N4-B + CF-4).

### We Do (24)
For each E1/E2/E3 across T1-A/B … T4-A/B:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with revisor / promote / gate CF-4 anchor

Fade preserved: predicado (E1) → assess PASS/breach/MISSING (E2) → decide CONTINUE/breach/rama humana (E3) per subtema (repro, lineage, firma, card, skew, SLO, canary, rollback).

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariante CF-4 normal/breach/uncertain; PII sintético vs real; frase de impacto sin flipar flags).
- Light touch on `portfolioNote` (missing ≠ breach + rollback sin borrar evidencia).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged (already CP-N4-B + CF-4 complete).

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT` markers | **Unchanged** |
| You Do starter (predicados experiment→serve) | **Unchanged** |
| T4-B `"1.0.0" in retired` strictness (E1–E3) | **Preserved** (not unified with demo `bool(retired)`) |
| T4-A quality_delta demo −0.01 vs E1 +0.01 | **Preserved** (both PASS) |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual long essay instructions without `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `run_ok True`, `S47-T1-A PASS`, `PASS MARK_RUN_NONREPRODUCIBLE MISSING:tolerance`, `CONTINUE MARK_RUN_NONREPRODUCIBLE INVESTIGATE_RANDOMNESS`, `gates_green`, `S47-T4-B PASS`, `CONTINUE ROLLBACK_TO_LAST_GOOD REVIEW_RETIREMENT`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. **Filename vs content:** `s47-opensource.ts` / id `opensource` still mismatch domain (MLOps serving); do not “fix” domain toward open source — content is Production Data/ML Platform.
3. **Fade E1→E2→E3:** code fade is excellent; prose now differentiated by scene (repro, lineage, firma, card, skew, SLO, canary, rollback). Round 2 should not collapse to a single “Contexto: Tacna…” template.
4. **Adverso multi-falla (varios subtemas):** fixtures adversarios fallan por varias causas a la vez (intentional); do not oversimplify.
5. **True newbie + sección Master:** preambles lower the verbal barrier; code remains dense (predicados, códigos de acción) — expected for Master.
6. Hints in E1 remain near-solution (acceptable guided); Round 2 may verify E3 hints stay principle-level.
7. **Strictness de retired:** E1–E3 T4-B usan `"1.0.0" in retired`; demo usa `bool(retired)` — intentional; do not unify.

## Files touched
1. `src/lib/course/sections/s47-opensource.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S47.md`

Section 47 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
