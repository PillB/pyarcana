# S42 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Schemas, seguridad y privacidad de servicios
- **shortTitle:** Schemas y seguridad
- **id:** `graph-rag` (archivo `s42-graph-rag.ts`; contenido = control plane fail-closed — schemas, authz, SSRF/path, secretos, minimización y purga — **no** “Graph RAG”)
- **source:** `src/lib/course/sections/s42-graph-rag.ts`
- **review input:** `round1/S42_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s42-graph-rag.ts` (prose fields + instruction/feedback/why polish + youDo retrospective/portfolioNote).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective; context already solid)
- [x] We Do has short `title` (24/24)
- [x] `instruction` is task-only (numbered steps; no dense “E# · Concepto + DEFECT” essay blend)
- [x] Exact outputs preserved
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` clean)

## What changed by kind

### I Do (8)
| Unit | Fields added/improved |
|------|------------------------|
| S42-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: schema estricto / extra=forbid → evolución aditiva + uniones → authn≠authz / no cross-tenant → scopes deny-by-default → SSRF/path → secretos/deps → minimización/retención → purga primario vs derivado (CP-N4-A).

### We Do (24)
For each E1/E2/E3 across T1-A/B … T4-A/B:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with revisor / promote / gate CP-N4-A anchor

Fade preserved: predicado (E1) → assess PASS/REJECT|DENY/MISSING (E2) → decide CONTINUE/breach/rama humana (E3) per subtema (schema, evolución, lectura, scopes, adjunto, CI, tablero, purga).

### You Do (1)
- Added `retrospective` de defensa/portafolio (no cross-tenant + no reaparición email; REJECT_SCHEMA + SSRF/path; frase de impacto; residual/rollback).
- Light touch on `portfolioNote` (missing≠breach en riesgo residual).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged (already CP-N4-A complete).

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# Defecto didáctico` markers | **Unchanged** |
| You Do starter (policy_engine chain + asserts) | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual long essay instructions without `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `valid True`, `S42-T1-A PASS` … `CONTINUE PURGE_DERIVATIVES VERIFY_DELETION_SCOPE`, `primary_gone True`, `email_in_log False`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. **Filename vs content:** `s42-graph-rag.ts` / id `graph-rag` still mismatch domain (schemas/seguridad/privacidad); do not “fix” domain toward Graph RAG — content is control plane fail-closed.
3. **Fade E1→E2→E3:** code fade is excellent; prose now differentiated by scene (ticket, notificaciones, lectura, worker, adjunto, CI, tablero, cierre). Round 2 should not collapse to a single “Contexto: Cusco…” template.
4. **Adverso multi-falla (T2-B-E2 invalid):** prod:write + shared-admin + route_declared False fails for several reasons; intentional; do not oversimplify fixture.
5. **True newbie + sección Master:** preambles lower the verbal barrier; code remains dense (sets, predicados, códigos de acción) — expected for Master.
6. Hints in E1 remain near-solution (acceptable guided); Round 2 may verify E3 hints stay principle-level.

## Files touched
1. `src/lib/course/sections/s42-graph-rag.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S42.md`

Section 42 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
