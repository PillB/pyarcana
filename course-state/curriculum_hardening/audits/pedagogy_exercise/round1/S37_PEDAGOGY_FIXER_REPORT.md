# S37 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Profiling, algoritmos y rendimiento
- **shortTitle:** Profiling y rendimiento
- **id:** `dbt-bigquery` (archivo `s37-dbt-bigquery.ts`; contenido = escala del triage / matching sintético, no dbt ni BigQuery de producto)
- **source:** `src/lib/course/sections/s37-dbt-bigquery.ts`
- **review input:** `round1/S37_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s37-dbt-bigquery.ts` (prose fields + instruction/feedback/why polish + youDo context).
- **No** generators, bulk templates, or cross-section paste of pedagogical prose.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames; predicados estables intactos).
- Validated with field counts, residual-essay scan, key output spot-checks, and `tsc --noEmit`.

## Acceptance checklist

- [x] Every non-trivial unit has `preamble` + `retrospective` (You Do: retrospective; context enriched)
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
| S37-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–90 words), `retrospective` |

Focus: wall/CPU/peak/`hot_fn` con `n` → warmup/mediana/spread → all_pairs vs blocked → inverted index Lima → chunks/columnar/itemsize → cache hit/miss por versión → budget pass → speedup/pair_factor/`same_result`.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` tightened to ~25–60 words with PR de escala / gate `same_result` / CI light anchor where it was telegraphic

Fade preserved: n del fixture → wall+CPU+peak → same_result; mediana real → discard_first → proxy cola; pares → reduction → prefer blocking; set → bloque Lima → block→score; ceil chunks → columnar → dtype; key+cutoff → version miss → OOC; budget pass → fail rojo → multi-métrica; speedup ratio → clarity vs 2% → keys del reporte.

### You Do (1)
- Enriched `context` with gate-closing scene (`CASO-LIM-037`, same_result calculado, dataset/hardware, no hardcode, budget transparente).
- Added `retrospective` de defensa/portafolio (invariante del gate, sintético vs real + recall S30, frase de impacto medible; puente S38).
- Left `objectives` / `requirements` / `rubric` / starter smoke path / `portfolioNote` unchanged (starter already has bench, blocking, assert).

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` markers | **Unchanged** |
| Predicados estables (`*_ok True`, ms variables) | **Unchanged** |
| You Do starter (before/after path, report dict) | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual long essay instructions without `1.`
- youDo: 1 retrospective + enriched context
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `n 1000`, `same_result True`, `wall_ok True`, `0.778`, `prefer blocking`, `structure set`, `pairs_after_block 5`, `dtype int32`, `version_change`, `ooc chunk`, `measured 12`, `4.0`, `prefer clarity`, report keys, `hot_fn expensive`, `all_pairs 6`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. **Filename vs content:** `s37-dbt-bigquery.ts` / id `dbt-bigquery` still mismatch domain (profiling/rendimiento); do not “fix” domain toward dbt/BQ — content is escala del triage.
3. **reduction vs pair_factor:** T2-A fraction [0,1] vs T4-B integer factor — prose now distinguishes them; Round 2 should keep that explicit if rewriting.
4. **You Do almost-complete starter:** cognitive load is “defend the gate,” not build from zero; retrospective addresses that; Round 2 should not inflate starter into a blank scaffold.
5. Fade E1→E2→E3 of prose must stay differentiated if Round 2 rewrites; do not collapse to a single “Contexto: el triage…” template.
6. Ms variables: never freeze wall_ms exact values into outputs without execute-and-diff.

## Files touched
1. `src/lib/course/sections/s37-dbt-bigquery.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S37.md`
