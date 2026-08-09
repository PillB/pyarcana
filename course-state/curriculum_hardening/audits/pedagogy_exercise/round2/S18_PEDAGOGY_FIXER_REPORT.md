# S18 Pedagogy Fixer Report (Round 2)

## Section
- **title:** EDA, estadística descriptiva e incertidumbre
- **id:** `data-engineering` (archivo `s18-data-engineering.ts`; contenido = EDA + incertidumbre, no ETL clásico)
- **source file:** `src/lib/course/sections/s18-data-engineering.ts`
- **inputs:** `PEDAGOGY_EXERCISE_SPEC.md`, `round2/S18_EXERCISE_PEDAGOGY_REPORT.md`
- **method:** Hand-applied residual fixes unit-by-unit; no generators, templates, or bulk stamping of pedagogical prose

## Acceptance checklist

- [x] Every non-trivial unit retains `preamble` + `retrospective` (R1 shell intact)
- [x] We Do units retain short `title`
- [x] `instruction` remains task-only (not re-bloated with pass criteria)
- [x] Exact outputs preserved **except** T3-A-E1 and T3-B-E3 (execute-and-diff justified by integrity)
- [x] Spanish PE; no real PII
- [x] No generators used
- [x] Section source typechecks (`tsc --noEmit` exit 0)

## Changes applied

### P1 — Integrity (wrong≈right / weak verification)

| Unit | Change |
|------|--------|
| **S18-T3-A-E1** | Fixture y → `[2, 5, 5, 10]` (ya no lineal perfecto). Starter `corrcoef(y,y)` → `r 1.0` (falla). Solution `corrcoef(x,y)` → `r 0.934`. Preamble éxito actualizado; retro con “si sale 1.0 y el fixture no es lineal perfecto, sospecha argumentos”. |
| **S18-T3-B-E3** | Array → `[-20.0, 2.0, 3.0, 4.0, 100.0]`. Output canónico `[True, False, False, False, True]`. Unilateral `m > hi` produce `[False, False, False, False, True]` y **falla**. Preamble éxito + instruction “ambas cercas”. lo/hi verificados: −1.0 / 7.0. |

### P2 — We Do retros (eco feedback → metacognición)

| Unit | Change |
|------|--------|
| **S18-T1-A-E2** | Retro: IQR = cuerpo; p10/p90 aparte; self-check “rango típico → IQR o colas?”. |
| **S18-T1-B-E1** | Retro: semáforo de *lectura* de forma, no KPI; self-check mean vs median con ratio 2.43. |
| **S18-T1-B-E2** | Retro: MAD cambia ancla *y* agregador; “casi igual mean abs” no da igual con el 100. |
| **S18-T2-A-E1** | Retro: share correcto de región equivocada pasa aritmética y falla negocio; self-check Counter. |
| **S18-T2-A-E2** | Retro: bias positivo = sobremuestreo; hábito share − pob; max |bias| decide LIMITADA. |
| **S18-T2-B-E1** | Retro: SE se encoge con √n; self-check n 16→64; deja de clonar “dispersión vs SE” del feedback. |
| **S18-T2-B-E2** | Retro expandida: d = magnitud estandarizada, no “probado”; self-check qué más reportar con n chico. |
| **S18-T3-A-E1** | (junto al P1) Retro metacognitiva sobre tautología 1.0 + fixture no lineal. |
| **S18-T3-A-E2** | Retro: error de auditoría (Pearson con etiqueta spearman); self-check y=x². |
| **S18-T3-B-E1** | Retro: 0.5 inventa método sin documentar; self-check n_hi disparado → multiplicador primero. |
| **S18-T4-A-E1** | Retro: pregunta vs hipótesis como capas; revisor no sabe qué se midía. |
| **S18-T4-B-E1** | Retro expandida: copiar n_raw a n_final “porque casi no filtramos”. |

### P2 — I Do thin retros / why

| Unit | Change |
|------|--------|
| **S18-T1-B-DEMO** | Retro: no vender media ~39 cuando mediano ~16; bridge We Do ratio/MAD/log1p. |
| **S18-T2-A-DEMO** | Retro: mean impecable + muestra sesgada = local; umbral max |bias|. |
| **S18-T3-A-DEMO** | `why` + claim CP-N2-B tan importante como el número (~+15 w). |
| **S18-T3-B-DEMO** | Retro: “Cusco más flags → culpable”; límites de segmento. |
| **S18-T4-A-DEMO** | `why` + “ni cierra el caso”; retro con error clásico campaña por mediana. |

### Not changed (per report — A / none required)

- **S18-T1-A-DEMO**, **S18-T1-A-E1**, **S18-T1-A-E3**, **S18-T1-B-E3**
- **S18-T2-A-E3**, **S18-T2-B-DEMO**, **S18-T2-B-E3**
- **S18-T3-A-E3**, **S18-T3-B-E2**
- **S18-T4-A-E2**, **S18-T4-A-E3**, **S18-T4-B-DEMO**, **S18-T4-B-E2**, **S18-T4-B-E3**, **youDo**
- Seeds / outputs seed-dependent (T2-B demo seed 21, bootstrap seed 42, residuales seed 1, T1-A demo seed 18)
- Section id `data-engineering` / filename (out of prose scope)
- Theory blocks, selfCheck quiz, portfolio starter structure

## Validation notes

| Check | Result |
|-------|--------|
| T3-A-E1 wrong `corrcoef(y,y)` | `r 1.0` |
| T3-A-E1 right `corrcoef(x,y)` | `r 0.934` |
| T3-B-E3 bilateral | `[True, False, False, False, True]` |
| T3-B-E3 unilateral `m > hi` | `[False, False, False, False, True]` (≠ canónico) |
| T1-A-E1 sanity (untouched) | n 5 / mean 30.4 / median 14.0 |
| `npx tsc --noEmit` | exit 0 |

## Residual risks (post-fix)

1. **Preambles en 4 bullets** pueden medir &lt;80 palabras totales; permitido por el spec (“or 4 short bullets”).
2. **Algunas retros ~40–55 w** priorizan principio + misconception distinto + transfer; no se rellenaron con synonym soup.
3. **You Do starter generoso** sigue parcialmente relleno (checkpoints 2/4/5); mitigated por rúbrica + retro de defensa — no vaciado sin rediseño.
4. **Outputs seed-dependent** no regenerados.
5. **id `data-engineering`:** prosa ya es EDA; rename de id fuera de alcance.
6. **Anti-aberration:** cada retro reescrita a mano por unidad; no plantilla “El error clásico es X. Siguiente: Y” estampada 24 veces.

## Anti-aberration

All residual sentences written by hand against the Round-2 unit ledger. No script manufactured preambles, feedback, or retrospectives. Code/output changes limited to the two integrity units with live numpy verification. File edits applied unit-by-unit.

---

Section 18 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
