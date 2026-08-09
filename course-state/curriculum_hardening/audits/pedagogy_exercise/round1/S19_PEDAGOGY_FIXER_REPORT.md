# S19 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Visualización y comunicación accesible
- **id:** `databases-orm` (archivo histórico `s19-databases-orm.ts`; contenido = charts honestos, Matplotlib, a11y y claims — no ORM/SQL)
- **source:** `src/lib/course/sections/s19-databases-orm.ts`
- **review input:** `round1/S19_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger for S19
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved starter defects, solution code, and exact demo/exercise outputs
- Prose in Peruvian professional Spanish, one primary goal per unit, lengths calibrated to the spec
- Hints softened where Round-1 flagged spoiling (T1-B-E2, T4-B-E1)

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff; all solution outputs and demos unchanged |
| Spanish PE; no real PII | **PASS** — synthetic CASO-LIM-019 / Lima/Cusco/Arequipa PEN; professional register |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback enriched with comité/a11y/S20–S21 impact where thin; hints softened on T1-B-E2 and T4-B-E1 |
| youDo | 1 | `retrospective` only; micro-line in `portfolioNote` for oral defense |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33 · weDo `title` × 24

## Unit ledger (summary)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S19-T1-A-DEMO | preamble + retrospective; why ampliado (pregunta→encoding, no estética; pie_3d score 0) |
| S19-T1-B-DEMO | preamble + retrospective; why ampliado (baseline como encoding; factor de inflación) |
| S19-T2-A-DEMO | preamble + retrospective; why ampliado (Agg, hatch WCAG, get_ylim/ylabel assertables) |
| S19-T2-B-DEMO | preamble + retrospective; why ampliado (savefig real vs dict; seed_data; close) |
| S19-T3-A-DEMO | preamble + retrospective; why ampliado (unidad+n en tooltip; filtro recalcula) |
| S19-T3-B-DEMO | preamble + retrospective; why ampliado (paridad precisión; alt ≠ imagen grande) |
| S19-T4-A-DEMO | preamble + retrospective; why ampliado (caption entregable; limitacion acota claim) |
| S19-T4-B-DEMO | preamble + retrospective; why ampliado (muestra ≠ población; alt con n) |

### weDo (P0 — all 24)

| Unit | Title |
|------|-------|
| S19-T1-A-E1 | Barras para comparar regiones |
| S19-T1-A-E2 | Brief de diseño con tres claves |
| S19-T1-A-E3 | Función elige_chart por keyword |
| S19-T1-B-E1 | Factor de inflación del eje recortado |
| S19-T1-B-E2 | Gate de baseline en barras absolutas |
| S19-T1-B-E3 | Marcar dual-axis como riesgo alto |
| S19-T2-A-E1 | Forzar ylim desde cero |
| S19-T2-A-E2 | Ylabel con PEN y baseline 0 |
| S19-T2-A-E3 | meta_bar con n_bars y ylim0 |
| S19-T2-B-E1 | Export PNG real y meta de paneles |
| S19-T2-B-E2 | Nombre versionado del PNG |
| S19-T2-B-E3 | Títulos de panel Vol y Med |
| S19-T3-A-E1 | Lookup de mediana filtrada a Lima |
| S19-T3-A-E2 | Tooltip con unidad y n |
| S19-T3-A-E3 | Función tooltip reutilizable |
| S19-T3-B-E1 | Paridad chart y tabla a 28.0 |
| S19-T3-B-E2 | Estado JSON con sample y universo |
| S19-T3-B-E3 | Alt text con unidad desde tabla |
| S19-T4-A-E1 | Pie mínimo con unidad y fuente |
| S19-T4-A-E2 | Caption con unidad, fuente y limitación |
| S19-T4-A-E3 | Formatter pie k: v |
| S19-T4-B-E1 | Rechazar sobreclaim nacional |
| S19-T4-B-E2 | Alt con n= y hatch no-color |
| S19-T4-B-E3 | classify_claim por marco muestral |

**P2 polish applied:** feedback extended with impacto a comité / a11y / S20–S21 where Round-1 noted thin notes; T1-B-E2 and T4-B-E1 hints no longer name the exact output string.

### youDo (P1)
| Unit | Changes |
|------|---------|
| Dashboard accesible CP-N2-B | `retrospective` de defensa: baseline/ylabel, paridad+n, claim acotado a muestra, frase de impacto; `portfolioNote` con lista 4 PNG + claim permitido vs rechazado |

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** starter defect renames (CASO-LIM-019 comments intact)
- Tests / edgeCases / fixtures unchanged

## Residual risks for Round 2
1. **Filename vs. contenido:** `s19-databases-orm.ts` / id `databases-orm` sigue siendo confuso; no renombrado en esta ronda.
2. **Dependencia Matplotlib/Agg:** We Do T2 fallan sin Matplotlib en el entorno del learner — fuera de scope de prosa.
3. **E1 muy cortos (print de un string):** preambles + retrospectives mitigan adivinanza del output; Round 2 puede medir si el learner verbaliza el principio.
4. **You Do incompleto por diseño (TODOs):** correcto; retrospective empuja asserts de ylim, paridad y claims, no solo “llenar TODOs”.
5. **Longitud de preambles:** calibrados a 4 bullets / ~80–150 palabras; si el UI se siente pesado, recortar sin borrar success/constraints.

## Validation
- Manual field counts: preamble 32, retrospective 33, weDo titles 24
- Per-unit parse: 8/8 iDo, 24/24 weDo, youDo retrospective present
- Sample outputs spot-check: intact
- `npx tsc --noEmit` — PASS
- Anti-aberration: hand-written application of Round-1 proposals only

---

Section 19 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
