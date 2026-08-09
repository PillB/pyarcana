# S27 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Estrategia de pruebas con pytest
- **shortTitle:** Pytest y contratos
- **id:** `async-concurrency` (archivo `s27-async-concurrency.ts`; contenido = contratos pytest / CP-N3-A — **no** async/await)
- **index:** 27
- **source:** `src/lib/course/sections/s27-async-concurrency.ts`
- **review input:** `round1/S27_EXERCISE_PEDAGOGY_REPORT.md`
- **date:** 2026-07-25

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and the full Round-1 unit ledger for S27
- Hand-applied optional schema fields only in the assigned section source
- No generators, bulk templates, or cross-section copy-paste of pedagogical prose
- Preserved all starter `# DEFECT:` bugs, solution code, and exact demo/exercise outputs
- Prose in Peruvian professional Spanish; synthetic `@example.pe` only; matching ≠ fraude

## Acceptance checklist

| Criterion | Status |
|-----------|--------|
| Every non-trivial unit has `preamble` + `retrospective` | **PASS** — 8 iDo + 24 weDo; You Do retrospective only (context already frames project) |
| We Do has short `title` | **PASS** — 24/24 |
| `instruction` is task-only | **PASS** — goal/success/constraints moved into preamble bullets |
| Exact outputs preserved | **PASS** — no execute-and-diff needed; oráculos intactos |
| Spanish PE; no real PII | **PASS** — sintético `@example.pe`; ética matching reforzada en T1-B-E3 y youDo |
| No generators used | **PASS** |
| Section source compiles | **PASS** — `npx tsc --noEmit` exit 0 |

## Counts applied

| Kind | Units | Fields added |
|------|-------|----------------|
| iDo | 8 | `preamble` + `retrospective` each; `why` expanded to ~40–90 words |
| weDo | 24 | `title` + `preamble` + task-step `instruction` + `retrospective`; feedback tightened where review asked (producto vs suma, raises/match, fail útil) |
| youDo | 1 | `retrospective` only (no new preamble; `context`/`objectives`/`rubric` retained) |

**Totals in source after fix:** `preamble` × 32 · `retrospective` × 33 · weDo `title` × 24

## Unit ledger (fix)

### iDo (P1 — all 8)
| Unit | Changes |
|------|---------|
| S27-T1-A-DEMO | preamble (score reordena tiempo) + why ampliado + retrospective (misconception “más UI = mejor suite”) |
| S27-T1-B-DEMO | preamble AAA/oráculo ≠ print + why + retrospective |
| S27-T2-A-DEMO | preamble discovery `test_*` + why + retrospective (helpers no son casos) |
| S27-T2-B-DEMO | preamble flake de orden / deepcopy + why + retrospective |
| S27-T3-A-DEMO | preamble de cuatro bordes (atención guiada) + why + retrospective |
| S27-T3-B-DEMO | preamble negativos RUC sintético + why + retrospective |
| S27-T4-A-DEMO | preamble risk coverage de umbrales + why + retrospective |
| S27-T4-B-DEMO | preamble mutante / teatro de cobertura + why + retrospective |

### weDo guided E1 (P0)
| Unit | Title |
|------|-------|
| S27-T1-A-E1 | Score de riesgo: producto, no suma |
| S27-T1-B-E1 | Normalizar con casefold y colapsar espacios |
| S27-T2-A-E1 | Descubrir solo nombres test_ |
| S27-T2-B-E1 | deepcopy: no contamines el original |
| S27-T3-A-E1 | Scores con math.isclose, no == |
| S27-T3-B-E1 | Imprime el mensaje, no el tipo |
| S27-T4-A-E1 | Cubrir ambas ramas hi y lo |
| S27-T4-B-E1 | El mutante debe fallar el oráculo |

### weDo independent E2 (P0)
| Unit | Title |
|------|-------|
| S27-T1-A-E2 | Ordenar áreas por riesgo descendente |
| S27-T1-B-E2 | Tras el assert, imprime pass |
| S27-T2-A-E2 | Assert honesto: ok o fail |
| S27-T2-B-E2 | Scope seguro para datos mutables |
| S27-T3-A-E2 | raises + fragmento en el mensaje |
| S27-T3-B-E2 | Email sintético: exige arroba |
| S27-T4-A-E2 | ¿Falta la rama non? |
| S27-T4-B-E2 | Falla útil: input, expected, actual |

### weDo transfer E3 (P0)
| Unit | Title |
|------|-------|
| S27-T1-A-E3 | Capa del área de mayor score |
| S27-T1-B-E3 | Matching exacto tras normalizar ambos |
| S27-T2-A-E3 | Tabla parametrize con oráculo strip |
| S27-T2-B-E3 | Factory: longitud de make(3) |
| S27-T3-A-E3 | Leer el contenido del tempfile |
| S27-T3-B-E3 | Mensaje con campo y valor ofensivo |
| S27-T4-A-E3 | Cobertura como porcentaje entero |
| S27-T4-B-E3 | De bug_repro a regression_test |

### youDo (P1)
| Unit | Changes |
|------|---------|
| Contratos pytest CP-N3-A | `retrospective` de defensa: invariante mutante/umbral, mensajes sintéticos sin PII, frase de impacto 30 s, ética matching ≠ fraude |

## Fade E1→E2→E3 (prosa)
Preambles differentiate scaffold intentionally:
- **E1:** nombra el defecto del starter y pasos casi-completos
- **E2:** meta + éxito + límites; menos migas de API
- **E3:** superficie nueva (capa max, matching post-normalize, parametrize, factory, tempfile, f-string de campo, % coverage, regression_test) con el mismo principio del subtema

## Code / output integrity
- **No** solution code rewrites
- **No** output string changes
- **No** starter `# DEFECT:` removals
- Dual-track honesty preserved: T3-A-E2 still notes pytest `match=` is regex vs lab containment

## Notes out of prose scope (P2 residual)
- Filename/id `async-concurrency` still does not match content (pytest/contratos). Documented for maintainers; not changed in this pass (would be a rename/refactor outside exercise pedagogy).

## Residual risks for Round 2
1. **T3-A-DEMO cognitive load:** four borders in one demo — preamble mitigates attention; code left intact.
2. **Prose volume:** preambles target 80–150 words (bullets); Round 2 may trim if UI feels heavy.
3. **Dual-track pytest vs assert+print:** keep notes honest when tightening T3-A-E2 further.
4. **Filename mismatch** remains a discoverability risk for reviewers/search.

## Validation commands
- Field counts: preamble=32, retrospective=33, weDo titles after kind=24
- `npx tsc --noEmit` → exit 0

---

Section 27 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
