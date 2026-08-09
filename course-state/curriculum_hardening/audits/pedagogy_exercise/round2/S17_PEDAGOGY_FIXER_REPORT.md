# S17 Pedagogy Fixer Report (Round 2)

## Section
- **title:** Joins, reshape, groupby y cierre analítico
- **id:** `packaging` (archivo histórico `s17-packaging.ts`; contenido = joins/reshape/groupby/reconciliación, **no** empaquetado PyPI)
- **source file:** `src/lib/course/sections/s17-packaging.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S17_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual prose only; unit-by-unit strings from the Round-2 ledger; no generators, templates, or bulk pattern stamping of pedagogy text

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only (not re-bloated with pass criteria)
- [x] Exact outputs preserved (no execute-and-diff needed)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — We Do retros + role separation + transfer integrity

| Unit | Change |
|------|--------|
| **S17-T1-A-E1** | Retro expandida: self-check “si C002 no tiene tx, ¿debe aparecer?”; bridge a unicidad antes del merge. |
| **S17-T1-A-E2** | Retro reescrita: mide → limpia; self-check de `print(True)` inventado; bridge `rows_cli → rows_merge`. |
| **S17-T1-B-E1** | Feedback y retro **separados**: feedback = left_only vs both (export de evidencia); retro = misconception “no hay huecos” + self-check C001 + bridge validate. |
| **S17-T2-A-E1** | Retro reescrita (deja de clonar “melt multiplica…” del feedback): contrato filas × value_vars + self-check 3×10 + bridge pivot. |
| **S17-T2-B-E1** | Feedback reforzado (legibilidad stakeholder); retro = prefijo no cosmética + self-check colisión de nombre `e` + bridge set expected. |
| **S17-T3-A-E1** | Retro reescrita (deja de clonar mean/sum del feedback): error de **contrato de negocio** en el slide + self-check Lima 1+2 + bridge transform. |
| **S17-T4-B-E3** | **Hints no-spoiling** (sin recipe de merge/`total_pre`/delta); `hint` singular alineado. Retro: tres números + aclaración You Do añade huérfanos/`reconciled` (no “mismo contrato de keys”). |

### P2 — I Do thin retros

| Unit | Change |
|------|--------|
| **S17-T1-B-DEMO** | Retro: dos tickets distintos + self-check lista vs bool + We Do bridge. |
| **S17-T2-A-DEMO** | Retro: contrato de filas + misconception default mean vs sum. |
| **S17-T2-B-DEMO** | Retro: schema auditable + rename “a ojo” en notebook. |
| **S17-T3-A-DEMO** | Retro: agg vs transform + “te quedaste sin filas” + self-check fila por grupo vs por tx. |
| **S17-T3-B-DEMO** | Retro: cohorte = entrada + error clásico max/fecha del informe. |
| **S17-T4-B-DEMO** | Retro: 999 = contaminación post-cutoff + delta al memo (no filtrar en silencio). |

### P2 — remaining We Do / nits / thin feedback

| Unit | Change |
|------|--------|
| **S17-T1-B-E3** | Retro: lista vs conteo KPI + self-check left_only 2→0. |
| **S17-T2-A-E2** | Retro: index ≠ columna de export + error clásico “el pivot ya tiene id”. |
| **S17-T2-A-E3** | Hints suavizados (sin `print` del dict solución); retro con self-check `n_filas=1`. |
| **S17-T2-B-E3** | **Typo instruction** corregido: `rename(columns={'a': 'monto'})` (brace del dict). Retro: dict auditable vs lista opaca. |
| **S17-T3-A-E2** | Límites: “no armemos” → **“no armes un map manual”**. Retro: shape 2 vs 3 + self-check agg vs transform. |
| **S17-T3-A-E3** | Retro: named agg = schema `total`/`n` + self-check columna solo `monto`. |
| **S17-T3-B-E1** | Retro: self-check “¿por qué el primer punto no inventa 1.0?”. |
| **S17-T3-B-E2** | Feedback a piso: max vs min + distorsión de retención “aunque el código corra”. |
| **S17-T4-A-E1** | Retro: eps = contrato + self-check descuadre 0.5 / umbral 1.0. |
| **S17-T4-B-E1** | Feedback a piso: `[9.0]` = post-cutoff; as-of `<=` y score “a enero”. |

### Not changed (per report — A / none required)

- **S17-T1-A-DEMO**, **S17-T1-A-E3**, **S17-T1-B-E2**, **S17-T2-B-E2**, **S17-T3-B-E3**, **S17-T4-A-DEMO**, **S17-T4-A-E2**, **S17-T4-A-E3**, **S17-T4-B-E2**, **youDo**
- Starters, `solutionCode`, exact `output` strings, theory blocks, selfCheck quiz
- Section id / filename rename (orchestrator-only; no PyPI packaging invented)
- You Do key contract (`n_huerfanos_left_only`, `reconciled`, etc.) — E3 no forzado a esas keys

## Validation notes

- Outputs de `solutionCode` e iDo **no se alteraron** (incl. dicts de fan-out, named agg order, T4-B-E3 pass dict).
- Pares eco P1 (T1-B-E1, T2-A-E1, T2-B-E1, T3-A-E1): feedback = síntoma correctivo inmediato; retro = principio + misconception + transfer + self-check.
- T4-B-E3 hints ya no pegan `m = cli.merge...` ni fórmulas exactas de `total_pre`/delta.
- Typo T2-B-E3 y nit “armemos” verificados ausentes post-fix.
- Typecheck: `npx tsc --noEmit -p tsconfig.json` → exit 0.

## Residual risks (post-fix)

1. **Algunas retros ~36–40 w** (borde del piso) no se rellenaron con synonym soup; anti-bloat preferido.
2. **We Do preambles en 4 bullets** pueden medir <80 palabras totales; permitido por el spec (“or 4 short bullets”).
3. **Hints E1** siguen near-complete (aceptable en guided); no se reescribieron salvo T2-A-E3 / T4-B-E3 transfer.
4. **`groupby(...).to_dict()` key order** depende de sort de pandas; pass outputs asumen regiones alfabéticas — no tocados.
5. **Filename `s17-packaging.ts` / id `packaging`:** fuera de alcance de prosa.
6. **Sin re-ejecución Pyodide:** se asume `solutionCode.output` del fuente.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, hints, or retrospectives as pedagogical content. File edits applied unit-by-unit with the report’s proposed prose (and minor floor-length tightenings), not a cross-section template stamp.

---

Section 17 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
