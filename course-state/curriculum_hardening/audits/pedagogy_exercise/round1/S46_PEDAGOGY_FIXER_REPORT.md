# S46 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Ingeniería de datos y orquestación de producción
- **id:** `gpu-computing` (archivo `s46-gpu-computing.ts`; contenido = pipeline de datos de producción, no GPU)
- **source:** `src/lib/course/sections/s46-gpu-computing.ts`
- **review input:** `round1/S46_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s46-gpu-computing.ts` (prose fields + instruction/feedback/why polish).
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
| S46-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: event-time/watermark → exactly-once + late policy → DAG Kahn → backfill/checkpoint → schema+freshness → lineage facet → merge incremental → SLI/SLO/RTO. Cada demo ancla CASO-HYO-046 y cierra con puente a We Do.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with Huancayo / promote / post mortem anchor

Fade preserved per subtema: fix predicado (E1) → assess de tres fixtures (E2) → decide CONTINUE/breach/incertidumbre (E3). Highlights:
- **T1-A:** ON_TIME/ALLOWED_LATE → PASS/SIDE_OUTPUT/MISSING → CONTINUE/WAIT_FOR_WATERMARK
- **T1-B:** set+checkpoint+policy → PASS/REPLAY/MISSING → CONTINUE/CHOOSE_LATE_POLICY
- **T2-A:** typed_io+Kahn → PASS/REJECT/MISSING → CONTINUE/DECLARE_ASSET_DEPENDENCY
- **T2-B:** solape half-open + resume → PASS/STOP/MISSING → CONTINUE/RECOVER_CHECKPOINT
- **T3-A:** schema+lag+owner → PASS/QUARANTINE/MISSING → CONTINUE/PAGE_DATA_OWNER
- **T3-B:** run/IO/null_rate/owner → PASS/INCIDENT/MISSING → CONTINUE/TRACE_LINEAGE
- **T4-A:** keys+delta0+small_files → PASS/REBUILD/MISSING → CONTINUE/REVIEW_INCREMENTAL_KEY
- **T4-B:** SLI/RTO/acciones/owner → PASS/DECLARE/MISSING → CONTINUE/ACTIVATE_RECOVERY_RUNBOOK

### You Do (1)
- Added `retrospective` de defensa portfolio / CP-N4-B (invariantes second_run_changes==0 e is_acyclic; sintético vs real/PII; frase de impacto medible; riesgo residual stdlib ≠ Flink).
- Left `context` / `objectives` / `requirements` / `rubric` / `portfolioNote` / starter unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` markers | **Unchanged** |
| Canonical PASS / CONTINUE / SIDE_OUTPUT / REPLAY / REJECT / STOP / QUARANTINE / TRACE / REBUILD / DECLARE tokens | **Unchanged** |
| Tautologías `meets_contract = ('…' == '…')` en E2/E3 | **Left as-is** (P2; tokens de salida intactos) |
| Section id `gpu-computing` | **Not renamed** (fuera de scope de prosa) |

## Validation
- iDo: 8 preamble + 8 retrospective + 8 expanded why
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual essay instructions without leading `1.`
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: watermark labels, all E1 PASS tokens, all E2/E3 transfer routes, demo first/retry/line/cycle/merge/ops
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Domain vocabulary (watermark, Kahn, SLI/SLO, side-output) stays appropriate for Master — keep Huancayo anchors if preambles expand.
3. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single «Contexto: el pipeline…» template across subtemas.
4. Simplificación pedagógica de watermark/gracia: lab no modela cierre de ventana Flink/Beam completo; retrospectives already avoid overclaim.
5. Tautologías `meets_contract` en solutionCode E2/E3: P2; alinear assert al predicado real sin cambiar tokens impresos.
6. Naming interno `gpu-computing` / `s46-gpu-computing.ts` confunde mantenedores, no learners en UI; fuera de scope.
7. You Do integra casi todos los subtemas; retrospective ya pide defensa de trade-offs y límites stdlib.

## Files touched
1. `src/lib/course/sections/s46-gpu-computing.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S46.md`
