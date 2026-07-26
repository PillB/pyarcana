# S06 independent text-first report

## 1. Scope and identity

- Section: **6 — Colecciones y estructuras de datos**
- Canonical source: `src/lib/course/sections/s06-numpy.ts`
- Compatibility key/hash: `numpy`
- Current learner-facing playground: `Practica colecciones y conflictos`
- Current PDF label: `6. Colecciones`
- Branch: `agent/text-s06-r2`
- Baseline: `d5575990d5ab45874b8e2ebc6f02a2bd4bc516a2`

The filename and compatibility key are historical identifiers, not the instructional topic. Current source, section index, playground, PDF map, and runtime content agree that S06 teaches Python collections and an in-memory tabular model. Renaming the compatibility key would require a coordinated migration and was outside this section-owned rewrite.

No prior Fixer edit, report, score, or completion claim was accepted as evidence. Every current learner surface was reread from source, and executable behavior was revalidated after the rewrite.

## 2. Evidence reviewed and source mismatch

The evidence pass included:

- the complete campaign instructions;
- current S06 source and type contract;
- the current authenticated `numpy` bank in `prisma/seed.ts`;
- the S06 playground and PDF mappings;
- current Explorer, expert, Spanish, grammar, and independent-worklog artifacts as issue leads only;
- the attached `deep-research-report-6.md`.

The attached deep-research report incorrectly infers that S06 teaches pandas DataFrames and CSV import. Those subject-matter claims conflict with current canonical source and were rejected. Only its generic recommendations on gradual release, chunking, prediction, and aligned practice were applicable.

## 3. Fresh issue ledger

| Surface | Fresh finding | Text-first resolution |
|---|---|---|
| Job relevance | Compressed catalog of terms; raw-rendered markdown markers | Reframed collections as a concrete in-memory classification desk and removed raw markdown |
| Theory map | Named structures before giving a reason to choose them | Opened with three operational questions and bridged explicitly from S04–S05 |
| 8 theory subtopics | Correct reference prose, but too often rule-first | Added a distinct causal mental model, novice misconception, boundary prediction, and transfer bridge to every subtopic |
| 8 I Do demos | Preambles and conclusions summarized the rule | Added prediction-before-run, guided causal narration, counterfactuals, and evidence questions to every demo |
| 24 We Do exercises | Retrospectives were short and formulaic | Replaced all 24 with unique 45+ word prompts requiring explanation, prediction, comparison, boundary reasoning, or design defense |
| You Do | Requirements were present but the design process was implicit | Staged invariants → isolated helper tests → composition → edge matrix, then added author/operator/reviewer retrospectives |
| 9 self-checks | Explanations confirmed the key without repairing the distractor | Expanded all nine to explain the mechanism and the misconception behind the tempting wrong answer |
| Authenticated bank | Needed independent quality and balance review | Audited all 24; preserved unchanged because it remains specific, unique, balanced, and concept-aligned |
| Learner packet | Current parser saw 24 entries but only 22 unique IDs | Relocated the same 24 stable IDs beside their instructions; exact canonical order now parses 24/24 uniquely |
| Localization | Current S06 had 57 PE city tokens against the fleet cap of 55 | Generalized two redundant prose mentions; current count is exactly 55 without changing fixtures or outputs |

## 4. Coverage proof

| Required surface | Independent coverage | Material result |
|---|---:|---|
| Theory map | 1/1 | New operational opening, prerequisite bridge, staged route, prediction habit |
| Theory subtopics | 8/8 | New mental model and causal/boundary explanation in every block |
| Theory code/output | 8/8 | Inspected and preserved byte-for-byte |
| I Do | 8/8 | Every preamble, `why`, and retrospective rewritten |
| We Do | 24/24 | Every exercise inspected; every retrospective rewritten and made unique |
| Starter/solution/output pairs | 24/24 | Inspected and preserved |
| You Do | 1/1 | Context, portfolio note, and retrospective rewritten |
| Public self-check | 9/9 | Every explanation rewritten |
| Authenticated assessment | 24/24 | Independently audited; no product edit justified |
| Playground | 1/1 | Collections/conflicts identity confirmed; unchanged |
| PDF map | 1/1 | `6. Colecciones` confirmed; unchanged |

## 5. Representative before/after evidence

### Opening relevance

Before:

> En pipelines de onboarding y calidad de datos en bancos, fintech y retail en Perú, antes de CSV/JSON necesitas un modelo tabular en memoria…

After:

> Antes de guardar un lote en CSV o enviarlo a una base de datos, un programa necesita una mesa de clasificación en memoria. Allí conserva el orden de llegada, localiza clientes por ID, detecta repeticiones y deja constancia de los desacuerdos.

The revised opening begins with a workplace operation and its failure modes, then introduces the structures as tools.

### Theory mental model

Before:

> Una `list` es mutable y ordenada… Una `tuple` es inmutable…

After:

> Una secuencia se parece a una fila de vagones: la posición forma parte del significado. Una `list` permite añadir o retirar vagones… Una `tuple` conserva un trayecto fijo…

The new version connects mutability to a decision the learner can make and retain.

### I Do causal reflection

Before:

> Lista = orden de llegada; dict = lookup. `get` evita KeyError…

After:

> Compara dos contratos: «si no existe, muestra N/A» y «si no existe, detén el pipeline». El mismo diccionario sirve para ambos, pero no la misma forma de acceso. ¿Qué prueba escribirías para evitar que un typo como C020 se convierta silenciosamente en N/A?

The learner must now distinguish optional absence from a broken invariant and propose evidence.

### We Do transfer

Before:

> Idéntico = ruido; distinto = conflicto de calidad. Este es el mismo contrato del You Do.

After:

> Un set de IDs solo conserva «C001 ya apareció»; no conserva `v: 1`, así que no puede comparar la siguiente fila. Explica por qué `seen` debe ser diccionario y no set. Luego predice el resultado si aparecen dos versiones conflictivas adicionales…

The revised reflection traces the information lost by the tempting structure and transfers the policy to a new case.

### You Do

Before:

> Inicias el capstone CP-N1-B: representas clientes, contactos y transacciones…

After:

> Trabaja en cuatro pasadas. Primero escribe los invariantes… Después implementa cada helper y pruébalo por separado. En la tercera pasada compón el flujo de `main`; en la cuarta, ejecuta una matriz de bordes…

The project now exposes an expert workflow a beginner can follow and review.

### Self-check feedback

Before:

> list.sort muta y retorna None; usa sorted(...) para copia.

After:

> `.sort()` expresa su efecto modificando la lista y devuelve `None`; así evita sugerir que creó otra colección. La opción «la lista ordenada» confunde efecto con retorno y causa el bug `x = rows.sort()`.

The explanation now repairs the misconception rather than merely repeating the answer.

## 6. Assessment integrity

The authenticated bank remains unchanged after independent review:

- 24 unique questions;
- 8 concepts × 3 variants;
- answer positions 6/6/6/6 overall;
- answer positions 2/2/2/2 in each attempt slice;
- 24 distinct, concept-specific explanations;
- no generic “respuesta correcta” template;
- no curriculum archaeology or internal metadata.

The public self-check still has nine questions and preserves its existing answer keys. Only learner-facing explanations changed.

## 7. Anti-aberration and regression controls

- No theory code, I Do code, starter code, solution code, or expected output changed.
- No demo, exercise, subtopic, or compatibility identifier was renamed.
- The 24 existing exercise IDs were relocated only to satisfy the current learner-packet parser; their values and order remain exact.
- No authenticated bank, playground, PDF mapping, or shared component changed.
- No bulk prose generator or automated rewrite was used. Prose edits were hand-written; automation was validation-only.
- Raw-rendered S06 job relevance and callout content no longer contain markdown bold markers.
- Generated Spanish, runtime, and assessment JSON snapshots were restored before staging.

## 8. Validation evidence

| Gate | Result |
|---|---|
| `test_s06_text_first_contract` + existing S06 contract | 11/11 pass |
| S06 runtime audit | 64 pass, 0 fail, 0 skip |
| V3 count / structure / invariant gates | pass |
| Exam/self-check audit | 1,248 questions; 416 concepts; P0=0; P1=0 |
| Fresh Spanish audit | 9.13/10; FH 86.7; one medium false positive on intentional `cur = cur[k]` |
| TypeScript | pass |
| ESLint on S06 | pass |
| Node adversarial suite | 54/54 pass |
| Static production export | pass |
| Full Python adversarial suite | 140 tests; 79 inherited failures; 1 skip; no S06-owned failure |

The first broad run reported 81 failures, including S06 packet uniqueness and S06 locality. After the section-owned corrections, the suite reports 79. Remaining failures belong to other pending sections and known fleet contracts, including S48 title drift, late-section specificity/GRR, packet IDs outside S06, locality caps outside S06, S24 starter depth, and self-check cycles outside S06.

## 9. Closure

Ready for the next section.
