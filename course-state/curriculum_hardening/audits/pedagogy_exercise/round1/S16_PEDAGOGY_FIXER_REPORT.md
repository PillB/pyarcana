# S16 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Calidad, limpieza y contratos de datos
- **id:** `wxpython-gui` (archivo histórico `s16-wxpython-gui.ts`; contenido = quality gate pandas)
- **source:** `src/lib/course/sections/s16-wxpython-gui.ts`
- **review input:** `round1/S16_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger (33 units)
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved starter defects, solution code, and exact demo/exercise outputs
- Feedback lightly enriched with named misconception / gate reasoning where thin (P2)

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff; oracles intact (`1 violates`, `{'a': 1}`, `fail`, `[False, True]`, `blocked`, `1.5 [1.0, 2.0, 1.5]`, dups/conflict/card labels, norm/PEN/raw, domain/IQR labels, drift/metrics/audit) |
| Spanish PE; no real PII | **PASS** — synthetic C00x / Lima-Arequipa-Cusco / S/ montos |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + expanded `why` + `retrospective` each |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback reasoning polish |
| youDo | 1 | `retrospective` only; minor portfolioNote line aligning reasons to acceptance table |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33 · weDo unit `title` × 24

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S16-T1-A-DEMO | preamble (required vs optional scene) + why expanded + retrospective |
| S16-T1-B-DEMO | preamble (cap + indicador order) + why expanded + retrospective |
| S16-T2-A-DEMO | preamble (exact vs conflict predict) + why expanded + retrospective |
| S16-T2-B-DEMO | preamble (clean + quarantine evidence) + why expanded + retrospective |
| S16-T3-A-DEMO | preamble (PEN locale + raw) + why expanded + retrospective |
| S16-T3-B-DEMO | preamble (domain vs IQR) + why expanded + retrospective |
| S16-T4-A-DEMO | preamble (schema + cross-field) + why expanded + retrospective |
| S16-T4-B-DEMO | preamble (metrics + audit with pass=false) + why expanded + retrospective |

### weDo (P0 — all 24)
| Unit | Title |
|------|-------|
| S16-T1-A-E1 | Contar nulls required y etiquetar violates |
| S16-T1-A-E2 | Mapa de violaciones solo required |
| S16-T1-A-E3 | Gate pass/fail desde violaciones required |
| S16-T1-B-E1 | Marcar was_null antes de imputar |
| S16-T1-B-E2 | Bloquear imputación si null_rate supera cap |
| S16-T1-B-E3 | Imputar mediana de no-nulos (no cero) |
| S16-T2-A-E1 | Contar filas de duplicado exacto (keep=False) |
| S16-T2-A-E2 | Listar cliente_id con conflicto de región |
| S16-T2-A-E3 | Clasificar exact, conflict o clean |
| S16-T2-B-E1 | Separar quarantine y clean por clave |
| S16-T2-B-E2 | Conservar columnas de evidencia en cuarentena |
| S16-T2-B-E3 | Validar cardinalidad 1:1 por id |
| S16-T3-A-E1 | Normalizar región con strip y title |
| S16-T3-A-E2 | Parsear montos PEN con decimal latino |
| S16-T3-A-E3 | Crear region canónica sin pisar el raw |
| S16-T3-B-E1 | Marcar domain_error en montos negativos |
| S16-T3-B-E2 | Listar outliers IQR con ambos fences |
| S16-T3-B-E3 | Etiquetar error, flag u ok por monto |
| S16-T4-A-E1 | Listar columnas required faltantes |
| S16-T4-A-E2 | Índices donde fin es anterior a inicio |
| S16-T4-A-E3 | Flag de schema drift fail-closed |
| S16-T4-B-E1 | Armar el bloque metrics del run |
| S16-T4-B-E2 | Append del evento quarantine sin pisar start |
| S16-T4-B-E3 | metrics.pass False si hay cuarentena |

Each We Do: preamble checklist (context/goal/success/constraints), ordered task `instruction`, retrospective (principle + misconception + transfer). Feedback extended where needed for reasoning without spoiling E3.

### youDo (P1)
| Unit | Changes |
|------|---------|
| Quality gate explicable ante schema drift | `retrospective` defense prompts; portfolioNote note to align quarantine reasons with acceptance table |

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** starter defect rewrites
- Tests/edgeCases/hints structure preserved (hints left as progressive conceptual scaffolding)

## Residual risks for Round 2
- Volume of new prose may need length trim if UI feels heavy on mobile (preambles target 80–150 words)
- E1 hints still near-solution in places — acceptable for guided tier; Round 2 can soften if faded worked example feels spoiled
- File id `wxpython-gui` vs quality-gate title remains historical naming debt (out of pedagogy scope)
- You Do has no canonical solution in source; retrospective anchors to asserts and acceptance table only
- T3-B-E2 fixture only exercises upper fence; feedback notes bilateral mask habit explicitly

## Validation
- Manual field counts: iDo preamble/retrospective 8/8; weDo title/preamble/retrospective 24/24/24; youDo retrospective 1
- `npx tsc --noEmit` — PASS (exit 0)
- Anti-aberration: hand-written application of Round-1 proposals only

---

Section 16 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
