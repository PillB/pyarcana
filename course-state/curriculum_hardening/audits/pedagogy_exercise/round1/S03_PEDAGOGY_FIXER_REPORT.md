# S03 Pedagogy Fixer Report (Round 1)

## Section
- **title:** Decisiones y reglas de validación
- **id:** `data-structures`
- **index:** 3
- **source:** `src/lib/course/sections/s03-data-structures.ts`
- **counts:** iDo 8 · weDo 24 · youDo 1

## Method
- Read `PEDAGOGY_EXERCISE_SPEC.md` and Round-1 `S03_EXERCISE_PEDAGOGY_REPORT.md`.
- Hand-implemented `preamble` / `retrospective` / We Do `title` + slim `instruction` from the review ledger (no generators, no bulk prose paste scripts).
- Preserved solution **outputs** exactly; applied P1 starter scaffold alignments only where the review required integrity for guided/independent fade.
- Validated field coverage with a measurement-only Python scan; `tsc --noEmit` exit 0; execute-and-diff on non-`match` solutions PASS (system Python 3.9 cannot run `match`; course target is 3.12 / Pyodide).

## Acceptance checklist (§11)

- [x] Every iDo step: `preamble` + `retrospective` (8/8)
- [x] Every weDo step: short `title`, `preamble`, task-only `instruction`, `retrospective` (24/24)
- [x] youDo: `retrospective` (context/objectives/requirements/rubric unchanged)
- [x] Exact solution outputs preserved
- [x] Spanish PE; synthetic data only; no real PII
- [x] No generators / bulk manufacture of educational prose
- [x] Section source typechecks (`tsc --noEmit` OK)

## Unit implementation summary

### I Do (8)
| Unit | Fields added | Code/output |
|------|--------------|-------------|
| S03-T1-A-DEMO | preamble, retrospective | none |
| S03-T1-B-DEMO | preamble, retrospective | none |
| S03-T2-A-DEMO | preamble, retrospective | none |
| S03-T2-B-DEMO | preamble, retrospective | none |
| S03-T3-A-DEMO | preamble, retrospective | none |
| S03-T3-B-DEMO | preamble, retrospective | none |
| S03-T4-A-DEMO | preamble, retrospective | none |
| S03-T4-B-DEMO | preamble, retrospective | none |

### We Do (24)
Each unit received: `title` · `preamble` (context/goal/success/constraints) · step-only `instruction` · `retrospective`.

| Subtopic | E1 / E2 / E3 titles (fade) |
|----------|----------------------------|
| T1-A | Comparar edad y región (booleanos sueltos) · Membership en allowlist de tipo de documento · `is None` frente a `==` en validadores |
| T1-B | Tabla de truthiness (falsy vs truthy) · Predecir valores de `and` / `or` · Arreglar validador de monto (None ≠ 0) |
| T2-A | Bandas de score con if/elif/else · ifs secuenciales vs cadena exclusiva · Trazar bandas numéricas (orden de umbrales) |
| T2-B | Guards de `validate_edad` · Refactor de pirámide a guards (monto) · Detectar y reparar una rama muerta |
| T3-A | Allowlist de regiones (desconocido → review) · Rango de monto con outlier suave · Tipo de documento y longitud (códigos) |
| T3-B | Decision table código → status · Misma tabla con match/case y OR patterns · Elegir if o match según el sujeto |
| T4-A | Ejemplos canónicos del campo edad · Invariante multi-campo de apellidos · Contraejemplo a un invariante demasiado estricto |
| T4-B | Reescribir mensajes accionables de edad · Un caso de prueba por cada rama · Test rojo: frontera inclusiva en edad 18 |

### You Do
- Added **retrospective** only (defense prompts: None≠0 test, PII vs sintético, frase de impacto medible).
- Starter DEFECTs and `_run_tests` untouched (still intentionally red).

## P1 scaffold integrity (applied)

| Unit | Change | Output |
|------|--------|--------|
| **S03-T2-A-E2** | Starter loop → `[95, 60, 30]`; added `good` stub with DEFECT/`pass`; prints `bad=` / `good=` | solution preserved |
| **S03-T3-A-E3** | Starter cases include RUC; DEFECT comment names dict return shape | solution preserved |
| **S03-T4-A-E1** | Starter has empty `examples = []` + type DEFECT (repair-not-invent) | solution preserved |

## P2 polish applied
- **S03-T1-A-E1 feedback:** names real expressions vs `print(True)` and Cusco/Lima trap.
- **S03-T2-A-E1 feedback:** frontier reasoning (80 first, 49 reject).
- **S03-T2-B-E1 feedback:** None vs `"25"` not the same rejection.
- **S03-T3-B-E1:** starter loop token `"X"` → `"FOO"`; feedback mentions default `get`.
- **S03-T4-B-E2:** DEFECT comment → “falta lista cases + assert por rama”.

## Output integrity (PASS)
- Spot-check execute-and-diff: T1-B-E3, T2-A-E2, T3-A-E3, T4-A-E1, T4-B-E3 → **PASS**.
- Full We Do scan: 22/24 runnable on host Python 3.9; **T3-B-E2/E3** and **T3-B-DEMO** require `match` (3.10+) — canonical outputs unchanged; browser Pyodide remains the declared runtime.
- I Do demos: 7/8 PASS on host; T3-B-DEMO same `match` environment note.

## Residual risks (from review, still valid)
1. **Instruction bloat risk mitigated:** old mega-instructions replaced by numbered steps; success contracts live in preambles.
2. Open-ended message/table exercises (T4-B-E1, T3-B-E3): learner wording may vary; solution remains exemplar.
3. You Do starter fails tests by design — retrospective does not imply green starter.
4. Round-2 should re-read length caps and E1→E3 fade voice (no rubber stamp).

## Diff footprint
- `src/lib/course/sections/s03-data-structures.ts`: pedagogy shell + three starter scaffolds + light feedback/P2 polish.

---

Section 3 exercise pedagogy has been fixed and validated under strict anti-aberration rules. Ready for the next section.
