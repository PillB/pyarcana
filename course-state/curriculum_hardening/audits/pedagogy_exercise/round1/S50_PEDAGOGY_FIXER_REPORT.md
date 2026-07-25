# S50 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Evals, red teaming y fiabilidad de IA
- **id:** `tech-leadership`
- **source:** `src/lib/course/sections/s50-tech-leadership.ts`
- **review input:** `round1/S50_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s50-tech-leadership.ts` (prose fields + instruction/feedback/why polish).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective only; context already framed)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (numbered steps; no dense essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S50-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–80 words), `retrospective` |

Focus: manifiesto `cite_sla@v1` + anclas → trajectory allowlist (puente S49) → acuerdo humano–LLM → order bias AB/BA → injection≠exfil (marcadores de lab) → PDF grant admin como dato → abstain por support bajo → p95 + rollback vs. RTO (demo intencionalmente más simple que E1).

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with scorecard/promote anchor

Fade preserved: predicado de gate → assess PASS/breach/MISSING → decide CONTINUE/breach/rama de incertidumbre. Escenas por subtema: dataset manifiesto, trajectory tools, graders agreement, order gap + holdout, injection/exfil, least privilege corpus, abstain/hallucination, reliability multi-eje/RTO.

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariante CP-N4-C, sintético vs real, frase de impacto medible).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path / `portfolioNote` unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# Bug intencional` markers | **Unchanged** |
| Tokens PASS / REBUILD / FAIL_UNSAFE / RECALIBRATE / INVALIDATE / BLOCK_SECURITY / QUARANTINE / BLOCK_HALLUCINATION / ROLLBACK / ACTIVATE_INCIDENT / MISSING / CONTINUE | **Unchanged** |
| You Do starter (BLOCKED + P0 issues) | **Unchanged** |
| Demo T4-B (p95+RTO only, sin costo/ACL) | **Unchanged** (fade intencional vs E1 multi-eje) |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 why expanded
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual long essay instructions without `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `coverage_ok True`, `S50-T1-A PASS`, `PASS REBUILD_EVAL_DATASET MISSING:holdout`, `CONTINUE REBUILD_EVAL_DATASET CALIBRATE_RUBRIC`, `FAIL_UNSAFE_TRAJECTORY`, `HUMAN_REVIEW_PROCESS`, `agreement 0.75`, `INVALIDATE_JUDGE`, `SEAL_NEW_HOLDOUT`, `BLOCK_SECURITY_P0`, `PRESERVE_ATTACK_TRACE`, `QUARANTINE_POISONED_CORPUS`, `REDUCE_TOOL_PRIVILEGE`, `BLOCK_HALLUCINATION_REGRESSION`, `REVIEW_ABSTENTION_SLICE`, `ROLLBACK_AI_RELEASE`, `ACTIVATE_INCIDENT_RESPONSE`, `critical_unsupported 0`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Domain vocabulary (holdout, order bias, trajectory, severity) stays in Ica promote context — keep glossary discipline if preambles expand.
3. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single “Contexto: el revisor…” template.
4. T3-A marcadores de lab ≠ WAF de producción: preambles/retros already flag this; Round 2 may re-check learner-facing clarity.
5. Demo T4-B omits costo/ACL on purpose; do not “align” demo outputs to E1 without an explicit code-unification decision.
6. You Do READY with evidence False is intentional; do not soften asserts for a false PROMOTE.
7. Pass/token strings frozen without execute-and-diff.

## Files touched
1. `src/lib/course/sections/s50-tech-leadership.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S50.md`
