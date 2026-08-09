# S17 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Joins, reshape, groupby y cierre analítico
- **id:** `packaging` (contenido = joins/reshape/groupby/reconciliación; no empaquetado PyPI)
- **source:** `src/lib/course/sections/s17-packaging.ts`
- **review input:** `round1/S17_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved starter defects, solution code, and exact demo/exercise outputs
- Spanish PE professional; synthetic Lima/Cusco/Arequipa, `C00x`, PEN; no real PII

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff; all solution outputs untouched |
| Spanish PE; no real PII | **PASS** — tú/professional register; CASO-LIM-017 sintético |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` (context/goal/success/constraints) + task-step `instruction` + `retrospective`; feedback enriched with stakeholder impact where thin |
| youDo | 1 | `retrospective` only (no new preamble; `context` remains canonical) |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S17-T1-A-DEMO | preamble + retrospective; why alargado (gate pre/post + assert unicidad) |
| S17-T1-B-DEMO | preamble + retrospective; why: MergeError como gate + anti-join evidencia |
| S17-T2-A-DEMO | preamble + retrospective; why: long/wide + aggfunc contrato |
| S17-T2-B-DEMO | preamble + retrospective; why: sets/orden + gate explicable |
| S17-T3-A-DEMO | preamble + retrospective; why: named agg + as_index |
| S17-T3-B-DEMO | preamble + retrospective; why: min cohorte + sort + no-claims → S18 |
| S17-T4-A-DEMO | preamble + retrospective; why: numerador/denominador/residual |
| S17-T4-B-DEMO | preamble + retrospective; why: as-of + delta al memo |

### weDo guided E1 (P0)
| Unit | Title |
|------|-------|
| S17-T1-A-E1 | Left join que conserva clientes sin tx |
| S17-T1-B-E1 | Anti-join: clientes sin transacciones |
| S17-T2-A-E1 | Melt wide→long (contar filas) |
| S17-T2-B-E1 | Prefijo monto_ tras pivot |
| S17-T3-A-E1 | Groupby sum de montos por región |
| S17-T3-B-E1 | Rolling mean con NaN inicial |
| S17-T4-A-E1 | Reconciliar totales con eps 1e-9 |
| S17-T4-B-E1 | Filtro as-of fecha <= cutoff |

### weDo E2/E3 (P0)
All 16 remaining We Do units received the same field shell: title, preamble (context/goal/success/constraints), ordered instruction steps, retrospective (principle + misconception + transfer). Feedback extended with stakeholder/portfolio impact where previously dry.

| Unit | Title |
|------|-------|
| S17-T1-A-E2 | Medir unicidad del maestro (is_unique) |
| S17-T1-A-E3 | Documentar fan-out 1:m (rows pre/post) |
| S17-T1-B-E2 | Gate validate one_to_one (MergeError) |
| S17-T1-B-E3 | KPI de huérfanos (conteo left_only) |
| S17-T2-A-E2 | Pivot_table y columnas con id |
| S17-T2-A-E3 | Concat de lotes (n_lotes y n_filas) |
| S17-T2-B-E2 | Gate set(columns) == expected |
| S17-T2-B-E3 | Rename explícito a nombre de negocio |
| S17-T3-A-E2 | Transform mean sin colapsar filas |
| S17-T3-A-E3 | Named agg: schema total y n |
| S17-T3-B-E2 | Cohorte mensual (primera fecha) |
| S17-T3-B-E3 | Sort_index antes de rolling |
| S17-T4-A-E2 | Tasa pagados sobre activos |
| S17-T4-A-E3 | Tabla puente total–Lima–residual |
| S17-T4-B-E2 | Delta de leakage (total − pre) |
| S17-T4-B-E3 | Mini-integración join + cutoff + delta |

### P2 polish applied
- **S17-T3-B-E3** hint: removed explicit `(2+3)/2 = 2.5` spoiling; keeps sort_index guidance without revealing the pass number in the second hint.
- **S17-T4-A-E3** second hint: no longer hardcodes residual 40.0 in the print recipe (still success in preamble).
- Feedback sentences on most We Do units now name stakeholder/portfolio impact.

### youDo (P1)
| Unit | Changes |
|------|---------|
| Portfolio ejecutivo de calidad + EDA | `retrospective` defense: invariantes del dict, PII vs sintéticos, frase de impacto 30s, puente S18 |

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** fixture/key changes on CASO-LIM-017 starters
- Starter `# Bug a corregir` defects and tests unchanged
- You Do contract keys (`rows_merge`, `n_huerfanos_left_only`, `leakage_delta`, `reconciled`, …) untouched

## Residual risks for Round 2
- Volume of new prose may need length trim if UI feels heavy (preambles target 80–150 words / 4 bullets)
- Groupby `to_dict()` key order depends on pandas sort (alphabetic regions) — outputs not revalidated by re-run; Round 2 can smoke-execute if pandas version drifts
- E3 T4-B is a subset of You Do keys by design; narrative bridge is in retrospective only
- File id `packaging` vs content joins/groupby remains a historical naming quirk (not exercise bug)

## Validation
- Manual field counts: preamble 32, retrospective 33, weDo titles 24
- Per-unit scan: no weDo/iDo missing title/preamble/retrospective
- `npx tsc --noEmit` — PASS
- Anti-aberration: hand-written application of Round-1 proposals only

---

Section 17 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
