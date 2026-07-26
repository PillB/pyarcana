# Independent text-first report — Section 3

## 1. Scope and authority

- Section: **S03 — Decisiones y reglas de validación**
- Canonical source: `src/lib/course/sections/s03-data-structures.ts`
- Compatibility id preserved: `data-structures`
- Baseline: deployed independent correctness pass on `b334b35`, plus the text-campaign activation commit `2ecf2b8`
- Product surfaces reviewed: metadata/job relevance; map and eight theory subtopics; eight I Do demos; 24 We Do exercises; You Do project; eight public self-check items; 24 authenticated variants; S03 playground and PDF label
- Evidence read: master campaign prompt; `S03_EXPLORER_REPORT.md`; `expert_audit/S03_report.md`; `S03_SPANISH_QUALITY.json`; `_GRAMMAR_SUBPLAN.md`; shared and independent worklogs; current source; current assessment/mapping blocks; attached `deep-research-report-3.md`

The attached deep-research report incorrectly inferred that S03 teaches biological sequences. It was therefore not used as topic evidence or replacement prose. Its generic recommendations on gradual release, connective tissue, prediction, and cognitive-load management were retained only where current S03 evidence independently supported them.

## 2. Baseline classification

The deployed pass had already fixed the earlier P0/P1 correctness defects:

- 41/41 published code/output pairs were aligned.
- 24 learner exercise ids were canonical, unique, and parser-visible.
- The runtime audit passed 65/65 artifacts.
- The public self-check and authenticated bank were balanced.
- The stale playground/PDF identities and learner-facing version meta-leaks were gone.
- Repeated Peruvian locality tokens were under the fleet cap.

Those fixes were treated as invariants, not as proof that the prose was finished.

### Active text-first gaps

1. The theory was technically accurate but often began with definitions rather than a problem a novice could recognize.
2. S02 was referenced, but the conceptual bridge from conversion to decision was too compressed.
3. The eight subtopics lacked a consistent causal cycle: problem → mental model → prediction → observation → misconception repair → forward bridge.
4. I Do preambles were strong, but several `why` fields summarized the output instead of narrating why the design prevented a particular failure.
5. All 24 We Do exercises had scaffolding, yet many retrospectives restated the lesson rather than eliciting an explanation, counterexample, boundary prediction, or code-review transfer.
6. You Do named the deliverable but did not make the build order and three-perspective review protocol explicit.
7. Public self-check explanations justified the correct option but did not consistently explain why the tempting distractor represented the wrong mental model.

## 3. Implemented learner-visible improvements

### Theory coverage

| Surface | Material change |
|---|---|
| Opening map | Added an international emergency-aid scenario, an explicit S02 bridge, a staged result-shape explanation, a novice glossary, a paced learning route, and a pre-section prediction. |
| T1-A | Added an Amsterdam bicycle-platform frame, a four-question operator model, a counterfactual prediction, boundary repair, and a T1-B bridge. |
| T1-B | Added a Berlin donation scenario, the distinction between language truthiness and domain meaning, explicit prediction, and misconception repair for negative truthy values. |
| T2-A | Added a Montreal support-queue frame, the “row of doors” model for branch order, boundary prediction, and overwriting diagnosis. |
| T2-B | Added a Nairobi admissions frame, the guard-as-embudo model, explicit TypeError/dead-branch prediction, and an equivalence warning for refactors. |
| T3-A | Added a Singapore insurance frame, unknown-vs.-invalid causal reasoning, paired-case prediction, and operational meaning for distinct codes. |
| T3-B | Added a global help-desk frame, table-first semantics, `if`/`match` equivalence reasoning, default-risk repair, and a T4 bridge. |
| T4-A | Added a Copenhagen logistics frame, specification-vs.-implementation reasoning, counterexample search, and a message/test bridge. |
| T4-B | Added a Toronto health-service frame, the status/code/message three-layer model, a red-test boundary prediction, and a staged You Do bridge. |

The international openings are explicitly hypothetical use cases. They do not attribute practices, quotations, or outcomes to real organizations.

### I Do coverage

All eight demos retain their exact code and output. Every `why` now explains a causal mechanism, and every retrospective now asks the learner to predict a counterfactual, trace a branch, propose a test, or defend a design choice:

- comparisons: isolate proposition failures;
- truthiness: distinguish language behavior from policy;
- exclusive branches: explain why order is part of the contract;
- guards: trace the evidence that survives the validation funnel;
- combined rules: preserve distinct failure causes;
- `if` vs. `match`: prove semantic equivalence;
- invariants: search for a new counterexample;
- branch tests: name the defect that would turn a case red.

### We Do coverage

The We Do introduction now describes how to use prediction, hints, execution evidence, and reflection. All **24/24** exercise retrospectives were rewritten by hand. Each now contains at least 45 words and requires a substantive action such as:

- explain an operand, boundary, or branch;
- compare two cases with different causal meanings;
- construct or challenge an invariant;
- identify a tempting misconception;
- predict a regression;
- defend a syntax choice from the shape of the problem;
- connect the result to the next exercise or the You Do.

No starter, solution, output, id, hint contract, assessment key, or exercise order changed.

### You Do and self-check

The You Do now exposes a four-pass build sequence:

1. write invariants;
2. implement field validators;
3. compose `validate_record`;
4. run the branch matrix.

Its portfolio note now asks for a reviewable decision narrative with evidence, and its retrospective uses three perspectives: author, operations, and reviewer.

All eight public self-check explanations now repair a named misconception. Correct indices and the 2/2/2/2 balance remain unchanged.

### Authenticated assessment audit

No authenticated-bank edit was necessary. The current S03 bank was already exemplar-quality for this pass:

- exactly 24 unique questions and 24 unique explanations;
- eight concepts × three variants;
- scenario- and mechanism-specific stems, not cosmetic A/B/C rewrites;
- plausible distractors tied to errors taught in S03;
- answer positions 6/6/6/6 overall;
- answer positions 2/2/2/2 in each attempt slice;
- every explanation has at least seven substantive words;
- no generic template such as “aplica el concepto con evidencia verificable”.

Changing this bank merely for novelty would add risk without a learner-visible pedagogical gain.

## 4. Before/after evidence

### Opening map

**Before**

> Aquí dominas lo que el motor de reglas de intake necesita ahora: booleanos, control de flujo y políticas accept / reject / review…

**After**

> Imagina un formulario internacional de ayuda de emergencia. Dos registros contienen `monto = 0`: uno declara correctamente que no hubo ingresos; el otro dejó el campo sin responder y debería contener `None`.

The new opening begins with the semantic conflict that motivates the syntax, then bridges explicitly from S02.

### Theory mental model

**Before**

> Ya sabes predecir booleanos y truthiness; ahora esos booleanos se convierten en una sola rama dominante.

**After**

> Lee la cadena como una fila de puertas. Python prueba la primera; si se abre, deja de mirar las demás.

The new paragraph makes evaluation order imaginable and then explains the overwrite misconception.

### I Do reasoning

**Before**

> Interior y fronteras en una sola cadena if/elif/else: una etiqueta por registro.

**After**

> Los valores interiores muestran las tres categorías; 80 y 50 revelan la política exacta de las fronteras. La cadena no “elige la mejor” rama: se detiene en la primera verdadera.

The explanation now narrates the causal mechanism and directly repairs a novice misconception.

### We Do reflection

**Before**

> Bloques `if` secuenciales ≠ cadena exclusiva. Durante la revisión de cambios, busca `status =` repetido.

**After**

> Compara la traza de `bad(95)` con `good(95)` asignación por asignación. ¿Qué segunda condición borra una decisión correcta? Durante una revisión, busca variables de estado asignadas en varios `if` y pregunta si las condiciones se solapan.

The learner must now explain the defect and transfer the diagnostic to code review.

### You Do integration

**Before**

> Construyes el motor de reglas sobre el parser de intake de S02…

**After**

> Parte del parser de S02 y construye el motor en cuatro pasadas: (1) escribe el invariante… (2) implementa un validador… (3) compón `validate_record`; (4) ejecuta una matriz…

The final task now gives a cognitive sequence without revealing the solution.

## 5. Anti-aberration and preservation evidence

- Educational prose was written manually, one surface at a time.
- No generator, loop, mass template, translation script, or bulk prose rewrite was used.
- Validation automation only counted, parsed, linted, executed, and compared existing artifacts.
- Compatibility id, filenames, exercise ids, outputs, question keys, answer positions, playground, PDF label, and code contracts were preserved.
- Generated Spanish/runtime/exam JSON side effects were restored before staging.

## 6. Validation

| Command / gate | Result |
|---|---|
| `python3 -m unittest tests.adversarial.test_s03_text_first_contract tests.adversarial.test_s03_independent_contract` | 12/12 pass |
| `python3 scripts/python_content_runtime_audit.py --only s03-data-structures` | 65 pass, 0 fail, 0 skip |
| `npm run test:v3` | counts, structure, and invariant pass |
| `python3 scripts/exam_selfcheck_pedagogy_audit.py` | 1,248 questions; 416 concepts; P0=0; P1=0 |
| `python3 scripts/spanish_quality_audit.py --from 3 --to 3 --no-lt` | 9.22/10; FH 87.4 |
| TypeScript (`tsc --noEmit`) | pass |
| ESLint on S03 TypeScript | pass |
| `npm run test:adversarial:node` | 54/54 pass |
| Static production export | pass |
| Full Python adversarial suite | 124 tests; **81 inherited failures**, 1 skip; no S03-owned failure |

The 81 broad-suite failures are the pre-existing fleet debt assigned to later sections (including S04–S06/S10–S52 packet contracts, S24 starter depth, S40–S52 specificity, locality caps in other sections, S48 title, and self-check cycles outside S03). S03 remains present in passing rows for packet ids, locality, self-check cycle, runtime, and assessment integrity.

## 7. Closure

Section 3 has been fully fixed and validated under strict anti-aberration rules. Ready for the next section.
