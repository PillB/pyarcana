# S45 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Cloud, almacenamiento, colas e infraestructura
- **id:** `iac`
- **source:** `src/lib/course/sections/s45-iac.ts`
- **review input:** `round1/S45_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s45-iac.ts` (prose fields + instruction/feedback/why polish).
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
| S45-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: ADR object/relacional/cache no autoritativo → RPO/RTO drill medido → at-least-once + VT + SKIP_DUP → new/dup/DLQ → escala por lag de cola → least privilege + prueba negativa → plan IaC sin secretos/destroy → PEN sintéticos + recovery/portability.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with revisor / reintento / portfolio anchor

Fade preserved per subtema: fix predicado (E1) → assess tres fixtures (E2) → decide CONTINUE/breach/rama humana (E3). Highlights:
- **T1-A:** object+relacional, no cache → PASS/REDESIGN/MISSING:ttl → CONTINUE/WRITE_STORE_ADR
- **T1-B:** RPO/RTO restore → PASS/DECLARE/MISSING:rto → CONTINUE/RUN_RESTORE_DRILL
- **T2-A:** ack post-efecto + key → PASS/NACK/MISSING:backoff → CONTINUE/VERIFY_DELIVERY_SEMANTICS
- **T2-B:** set dedup + DLQ terminal → PASS/DEDUP/MISSING:terminal → CONTINUE/INSPECT_MESSAGE_ORDER
- **T3-A:** cuota + backpressure → PASS/APPLY/MISSING:backpressure → CONTINUE/REQUEST_CAPACITY
- **T3-B:** least privilege egress → PASS/DENY/MISSING:egress_allow → CONTINUE/REQUEST_SCOPED_POLICY
- **T4-A:** plan limpio staging → PASS/REJECT/MISSING:destructive_changes → CONTINUE/REVIEW_DRIFT
- **T4-B:** PEN + recovery → PASS/FREEZE/MISSING:portable_export → CONTINUE/COST_OWNER_REVIEW

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariante efecto→ack + SKIP_DUP, stdlib vs cloud real, frase de impacto medible ante CP-N4-B).
- Left `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` markers | **Unchanged** (32 markers retained) |
| Canonical PASS / CONTINUE / breach / MISSING / rama humana strings | **Unchanged** |
| You Do starter `process_once` NotImplementedError | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual essay instructions without leading `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: all E1 PASS, E2 triples, E3 CONTINUE triples, demos (`artifact_in_object True`, `cost_ratio 0.82`)
- Residual dense `instruction: "S45-T…"` essays: **0**
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Domain vocabulary (visibility timeout, RPO/RTO, least privilege, DLQ) stays appropriate for Master — keep Iquitos/job anchors if preambles expand.
3. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single «Contexto: el job de Iquitos…» template across stores/colas/IAM/PEN.
4. **24 weDo same skeleton:** residual risk that learner feels mechanical if Round 2 shortens preambles too hard — vary escena by subtema.
5. **PEN sintéticos / sin cuenta cloud:** retrospectives name limits honestly; Round 2 should not imply vendor drills.
6. You Do integrates all families; retrospective pushes effect-before-ack and missing≠CONTINUE habits into the portfolio defense.

Section 45 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
