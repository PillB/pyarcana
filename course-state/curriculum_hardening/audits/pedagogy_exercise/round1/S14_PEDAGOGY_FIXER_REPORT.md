# S14 Pedagogy Fixer Report (Round 1)

## Section
- **title:** NumPy y cómputo vectorizado
- **id:** `security` (archivo histórico `s14-security.ts`; contenido = ndarray/máscaras/ufuncs/broadcast/views/NaN/bench/`allclose`)
- **source:** `src/lib/course/sections/s14-security.ts`
- **review input:** `round1/S14_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger for S14
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved starter defects, solution code, and exact demo/exercise outputs
- Prose in Peruvian professional Spanish, one primary goal per unit, lengths calibrated to the spec

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff; all solution outputs and demos unchanged |
| Spanish PE; no real PII | **PASS** — synthetic `C00x`, Lima/Arequipa/Cusco; tú/professional register |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback enriched with reasoning where thin; hints softened on T2-B-E2 and selected E3s |
| youDo | 1 | `retrospective` only (no new preamble; `context` remains canonical) |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33 · weDo `title` × 24

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S14-T1-A-DEMO | preamble + retrospective; why ampliado (contrato dtype/shape, fail-closed) |
| S14-T1-B-DEMO | preamble + retrospective; why ampliado (máscaras, `&` vs `and`) |
| S14-T2-A-DEMO | preamble + retrospective; why ampliado (ejes de negocio, unicidad) |
| S14-T2-B-DEMO | preamble + retrospective; why ampliado (pares, diagonal 0) |
| S14-T3-A-DEMO | preamble + retrospective; why ampliado (view vs copy, raw de auditoría) |
| S14-T3-B-DEMO | preamble + retrospective; why ampliado (NaN ≠ 0, inf→nan) |
| S14-T4-A-DEMO | preamble + retrospective; why ampliado (allclose antes del ratio) |
| S14-T4-B-DEMO | preamble + retrospective; why ampliado (O(n²), budget, rtol/atol) |

### weDo (P0 — all 24)

| Unit | Title |
|------|-------|
| S14-T1-A-E1 | Meta dtype/shape sin invertir ejes |
| S14-T1-A-E2 | Scores con linspace y nbytes |
| S14-T1-A-E3 | Validar 1D float64 o fallar |
| S14-T1-B-E1 | Índices con score >= 0.5 |
| S14-T1-B-E2 | Ids bajo la mediana del lote |
| S14-T1-B-E3 | Reordenar con fancy index |
| S14-T2-A-E1 | Completitud: mean por columnas y filas |
| S14-T2-A-E2 | Tasa de unicidad con np.unique |
| S14-T2-A-E3 | Centrar filas con keepdims |
| S14-T2-B-E1 | Sumar pesos a cada fila (broadcast) |
| S14-T2-B-E2 | Producto exterior con newaxis |
| S14-T2-B-E3 | Capturar broadcast incompatible |
| S14-T3-A-E1 | Demostrar que el view muta raw |
| S14-T3-A-E2 | Aislar mutación con copy |
| S14-T3-A-E3 | Bloquear escritura con writeable=False |
| S14-T3-B-E1 | Contar NaN con isnan |
| S14-T3-B-E2 | Media omitiendo NaN |
| S14-T3-B-E3 | Inf a nan y luego nansum |
| S14-T4-A-E1 | Equivalencia loop y suma vectorizada |
| S14-T4-A-E2 | Suma de cuadrados vectorizada |
| S14-T4-A-E3 | Timing de suma vectorizada con chequeo |
| S14-T4-B-E1 | nbytes de 1000 float64 |
| S14-T4-B-E2 | allclose con atol en floats |
| S14-T4-B-E3 | assert_allclose que debe fallar |

**P2 polish applied:** feedback sentences extended with misconception/razonamiento de tablero; hints de T2-B-E2 y T3-A-E3 / T3-B-E3 / T4-A-E3 suavizados para no regalar la API exacta.

### youDo (P1)
| Unit | Changes |
|------|---------|
| Métricas de calidad y señales por pares (CP-N2-A) | `retrospective` de defensa: invariantes de `_run_tests`, PII vs sintéticos, frase de impacto medible; ratio ≠ SLA |

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** starter defect renames (CASO-LIM-014 comments intact)
- Tests / edgeCases / fixtures unchanged

## Residual risks for Round 2
1. **Filename vs. contenido:** `s14-security.ts` / id `security` sigue siendo confuso; no renombrado en esta ronda.
2. **T3-A-E1 “éxito = corrupción”:** preamble ahora lo deja explícito; Round 2 puede verificar que el UI no diluye el contraste E1/E2.
3. **Longitud de preambles:** calibrados a 4 bullets / ~80–150 palabras; si el UI se siente pesado, recortar sin borrar success/constraints.
4. **Bench dependiente de máquina:** prosa de éxito usa `ratio_gt_1` / `timed True`, no un SLA numérico.
5. **Hints E3:** aún dan pistas útiles; el fade real ahora vive más en preamble/instruction.

## Validation
- Manual field counts: preamble 32, retrospective 33, weDo titles 24
- Per-unit parse: 8/8 iDo, 24/24 weDo, youDo retrospective present
- Sample outputs spot-check: intact
- `npx tsc --noEmit` — PASS
- Anti-aberration: hand-written application of Round-1 proposals only

---

Section 14 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
