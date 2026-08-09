# S15 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Pandas: ingesta, selección y tipos
- **id:** `stdlib-deep`
- **source:** `src/lib/course/sections/s15-stdlib-deep.ts`
- **review input:** `round1/S15_EXERCISE_PEDAGOGY_REPORT.md`
- **counts fixed:** iDo **8**, weDo **24**, youDo **1**

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the Round-1 review ledger unit by unit.
- Hand-edited **only** `s15-stdlib-deep.ts` (prose fields + instruction/feedback/hint polish).
- **No** generators, bulk templates, or cross-section paste.
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
| S15-T1-A-DEMO … T4-B-DEMO | `preamble`, expanded `why` (~40–80 words), `retrospective` |

Focus: Index de negocio estable → parser LatAm (sep/decimal/parse_dates) → loc+assign con etiqueta de laboratorio → loc+copy sin cadena → coerce con conteo de NaN → schema fail-closed + report → export CSV/Excel/contrato → manifest con hash del payload.

### We Do (24)
For each E1/E2/E3:
- `title` (4–10 words)
- `preamble` (context / goal / success / constraints bullets)
- `instruction` rewritten as ordered steps only
- `retrospective` (principle + misconception + transfer)
- `feedback` expanded with corrective reasoning (25–60 words band) on high-impact units (E1 of each subtopic and peers)
- Softened spoiling one-liner hints on several E2/E3 while keeping E1 scaffold useful

Fade preserved: set_index → etiqueta → add/fill_value; na_values → parse_dates → CSV latino+usecols; loc umbral → assign → iloc; loc flag → copy subset → aislamiento; category → to_numeric → to_datetime; delta isna → KeyError → dtype string; CSV index=False → Excel → contrato dtypes; memory deep → manifest rows/cols → hash CSV.

### You Do (1)
- Added `retrospective` de defensa/portafolio (invariantes de `_run_tests()`, datos reales vs. sintéticos, frase de impacto medible; score ≠ culpa).
- Added one line to `portfolioNote` on 30-second defense of coercion delta.
- Left `context` / `objectives` / `requirements` / `rubric` / starter smoke path unchanged.

## Code/output integrity
| Area | Action |
|------|--------|
| All demo / `solutionCode.output` | **Unchanged** |
| Starter `# Error a corregir:` | **Unchanged** |
| Hash canónico T4-B-E3 `309b0e45` | **Unchanged** |
| Fixture `SIN_DATO` (no NA default) | **Unchanged** |
| openpyxl dependency honesty | **Unchanged** |

## Validation
- iDo: 8 preamble + 8 retrospective
- weDo: 24 title + 24 preamble + 24 retrospective; 0 residual `E_n (guiado|…)` instruction essays
- youDo: 1 retrospective
- Field totals: preamble **32**, retrospective **33**
- Spot-check key outputs present: `['C001', 'C002']`, `0.9`, `{'C001': 1.0, 'C002': 2.5}`, `[15.5]`, `datetime64[ns]`, `309b0e45`
- `npx tsc --noEmit`: clean

## Residual risks (for Round 2)
1. Some retrospectives sit near the low end of the 40–80 word band (dense PE); Round 2 may tighten length without new concepts.
2. Hints still somewhat guided on a few E1s by design; E2/E3 soft-hints may need another fade pass if learners still over-rely on them.
3. openpyxl dependency: demos/E2 Excel fail without motor — documented, not hidden.
4. You Do cognitive load (four functions + dual fixtures) remains; retrospective + portfolioNote mitigate narrative close only.
5. Ethical note (score ≠ culpa) rests in T2-A demo, You Do context, and You Do retrospective — keep visible in Round 2.

## Files touched
1. `src/lib/course/sections/s15-stdlib-deep.ts`
2. This report
3. `expert_audit/worklog_entries_r2/PEDAGOGY_R1_S15.md`

---

*Round 1 Fix — hand-crafted only. No bulk generation.*

Section 15 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
