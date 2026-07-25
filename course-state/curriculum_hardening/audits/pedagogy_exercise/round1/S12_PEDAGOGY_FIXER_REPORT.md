# S12 Pedagogy Fixer Report (Round 1)

## Section
- **title:** APIs, SQL y geodatos responsables
- **id:** `performance` (archivo histórico `s12-performance.ts`; contenido = HTTP mock + SQLite + geoevidencia)
- **source:** `src/lib/course/sections/s12-performance.ts`
- **review input:** `round1/S12_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s12-performance.ts` (prose fields + instruction/feedback/hint polish).
- **No** generators, bulk templates, or cross-section paste.
- Preserved all canonical `solutionCode.output` / demo outputs (no integrity renames).
- Validated with field counts, residual-essay scan, and `tsc --noEmit`.

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
| S12-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–80 words), `retrospective` |

Focus: status antes que body → paginación/pausas → provenance sin token → contract/fallback offline → join de caso → batch atómico → MockGeocoder fail-closed → Haversine como geoseñal (no kinship).

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning (25–60 words band) on high-impact units (T1-A-E1, T1-B-E3, T2-A-E1, T3-B-E1, T4-A-E3, T4-B-E1/E3, and peers)
- Softened spoiling one-liner hints on several E2/E3 (p. ej. T1-B-E2/E3, T2-A-E2/E3, T4-A-E2/E3) while keeping E1 scaffold useful

Prioridad ética/cumplimiento cargada en preambles de **T3-B-E1** (SQL injection), **T4-A-E3** (egress allowlist) y **T4-B-E3** (geoseñal sin kinship). T2-B-E3 (`operation_mode`) lleva el «por qué» del feature flag offline en preamble, no en código.

### You Do (1)
- Added `retrospective` de defensa/portafolio (status N1, provenance sin secreto, frase de impacto medible hacia S13).
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# DEFECT:` | **Unchanged** |
| Política N1 (retry 429/503; 500 no retry) | **Unchanged** |
| Haversine R=6371; egress ALLOWED; kinship_verdict=None | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `E_n (guiado|…)` instruction essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: get_entity 200/404, status_action table, API_TOKEN missing, missing keys lon, join kinds, kinship None, 8.95 km
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Legacy `id: "performance"` / filename vs content (HTTP/SQL/geo, not systems profiling) — product residual, out of scope.
2. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
3. Hints still somewhat guided on a few E1s by design; E2/E3 soft-hints may need another fade pass if learners still over-rely on them.
4. Dual naming `verdict` (demo) vs `kinship_verdict` (E3) left intentional; outputs not unified without execute-and-diff campaign.
5. You Do cognitive load (12+ stubs) remains; retrospective + portfolioNote mitigate narrative close only.

## Files touched
1. `src/lib/course/sections/s12-performance.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S12.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*

Section 12 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
