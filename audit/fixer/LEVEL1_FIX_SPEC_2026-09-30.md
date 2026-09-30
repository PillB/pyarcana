# Level 1 fixer specification — S01–S04

This is an implementation specification, not a claim that the large section source files have already been rewritten. It exists because the connected GitHub write API replaces whole files; blind replacement of 100–175 KB curriculum modules from truncated tool output would violate the repository's own source-first/safe-patch rules.

## S01

### Writing fix

Replace the opening Mars Climate Orbiter paragraph with:

> En 1999, la misión Mars Climate Orbiter se perdió por una discrepancia de unidades: un sistema en tierra proporcionó datos de impulso en unidades inglesas y el software de navegación esperaba unidades métricas. Cada parte podía producir números válidos dentro de su propio supuesto; el fallo estaba en el contrato compartido. En software cotidiano el costo no es una nave, pero el patrón se repite: dos personas creen ejecutar «el mismo proyecto» mientras una usa otro intérprete o versiones distintas de las dependencias. El código puede ser idéntico y el resultado no. Por eso esta sección empieza por hacer explícito el entorno antes de confiar en él.

Acceptance:
- NASA/JPL factual mechanism remains units-interface mismatch.
- `dependencias` is defined immediately after first meaningful use.
- no `int`/`float` causal analogy is introduced.
- no `main`, main guard or argv requirement re-enters S01.

## S02

### Scope invariant

A learner-editable S02 block MUST NOT require these constructs before they are taught:

`def`, `return`, `if`, `elif`, `else`, `for`, `while`, `try`, `except`, dict construction/access as authored logic, complex annotations, `main()`, `if __name__ == ...`, test functions/harnesses.

Prepared teacher-side code may use a future construct only when the learner is explicitly told to execute it mechanically, it is not assessed, it does not obscure the construct being taught, and the future lesson is named. Prefer removing it.

### Theory contract block

Replace the Python `section_contract()` example with a text/markdown contract. It currently violates the section's own promise by using `def`, `return`, dicts, lists, indexing and bools.

Proposed visible content:

```text
CASO-LIM-002
Ruta: valor → tipo → nombre → operador → I/O
Criterios de cierre:
- conservar raw antes de limpiar;
- Decimal para dinero;
- solo datos sintéticos;
- todavía no decidir ramas ni recuperar errores.
```

### Conversion teaching

Teach two separate experiences:

1. **Valid conversion:** `" 19 "` → `.strip()` → `"19"` → `int(...)` → `19`.
2. **Observed invalid conversion:** run `int("abc")`, read the exception name/message, and explain that S09 will teach recovery. Do not catch it.

The student can understand “this conversion fails” before learning “how a program recovers from the failure.”

### Project increment

Replace parser architecture with a top-level script containing only mature S02 concepts.

Required evidence:
- synthetic values only;
- raw scalar variables preserved;
- clean scalar variables separate;
- one valid `int` conversion;
- one valid `Decimal` amount conversion/quantization as already taught;
- f-string summary;
- comments identifying what S03 will add (decisions) and what S09 will add (recovery).

Do not grade invalid-input recovery at S02.

### RED checks

After rewrite, learner-visible S02 events before the first explicit primer must have zero requirements for:
- function definition/return;
- branch authoring;
- exception recovery;
- loop authoring;
- dict-as-record authoring;
- main guard;
- test harness authoring.

## S03

Keep the existing dedicated `def` / call / `return` block. Treat it as the first spiral teaching of functions for rule encapsulation; S05 remains the deeper contracts/functions section.

QA:
- `def` block appears before learner-authored functions.
- replace harness loops that require `for` before S04 with explicit calls, unless the loop is clearly non-editable and explained as a future mechanic.
- if a fixed `set`/dict literal is supplied, it cannot silently become proof that the learner knows collections.

## S04 / CP-N1-A

Gate must be solvable using mature S01–S04 knowledge.

Preferred dependency rewrite:
- top-level or simple S03-taught functions;
- S03 decisions;
- S04 iteration;
- stdin/stdout or simple positional/tuple records;
- no authored dict dependency before S06;
- no `try/except` dependency before S09.

If a future operation is mechanical, include a bounded primer that says:
1. what command/line to execute;
2. what it does at a surface level;
3. why it is needed now;
4. that it is not being assessed now;
5. where it will be taught in depth.

If the learner must design or justify it, a primer is insufficient.

## Regression checklist

- Rebuild `scripts/concept_map.py` from fresh events.
- Run `scripts/skills_content_readiness_map.py --check`.
- Run `--strict` only after known gaps are intentionally closed.
- Re-run existing course/test suites.
- Read S01–S04 in the deployed site after deployment; do not infer deployment from source SHA alone.
- Verify IDs, section slugs, progress keys and capstone IDs are unchanged unless migration is explicitly approved.
- Re-read every changed paragraph for grammar and for new widow terms.
