# Section 4 text-first report

## Canonical identity and independent scope

- Section: S04
- Learner title: `Iteración y resúmenes transaccionales`
- Stable compatibility id: `functions-modules`
- Source: `src/lib/course/sections/s04-functions-modules.ts`
- Capstone: CP-N1-A, Client Intake & Data Quality Script
- Baseline: `d5575990d5ab45874b8e2ebc6f02a2bd4bc516a2`

The filename and id retain an older platform contract, but the current learner
journey is about iteration, termination, counting, tracing and honest batch
summaries. Previous Fixer and Explorer artifacts were read only as hypotheses.
Every present-day surface and executable claim was inspected again.

## Required-surface inventory

| Surface | Independently reviewed | Text-first result |
|---|---:|---|
| Opening and roadmap | 1/1 | Reframed from a narrow sector description to a transferable batch-processing problem |
| Theory | 9/9 blocks | Added decision-first mental models, invariants, failure boundaries and transfer |
| I Do | 8/8 demos | Added prediction or trace before execution and a distinct explanatory close |
| We Do | 24/24 exercises | Replaced templated closes with explanation, counterexample, boundary or transfer prompts |
| You Do | 1/1 capstone | Reframed as an auditable promise with explicit invariants and review evidence |
| Public self-check | 8/8 explanations | Expanded each answer into a misconception repair and boundary explanation |
| Authenticated assessment | 24/24 questions | Re-audited; the deployed 8×3 bank and 6/6/6/6 position balance remain valid |
| Playground and PDF | 1/1 each | Re-audited; S04-owned iteration playground and `4. Iteración` label remain correct |

## Before and after evidence

### Theory

- Before: the opening defined loop, sentinel and rate as vocabulary before
  giving the learner a reason to care.
- After: the section opens with a conveyor-belt model. Each row enters once,
  receives a decision and leaves an auditable mark; the model then names the
  three invariants that the code must preserve.
- Before: subtopics commonly led with syntax descriptions.
- After: each first paragraph leads with the decision the construct serves:
  value versus index, numbering versus alignment, known collection versus
  unknown duration, recoverable noise versus fatal state, and linear versus
  pairwise work.

### I Do

- Before: several preambles said “observe” or disclosed the expected result
  before the learner formed a prediction.
- After: all eight demonstrations require a prediction, classification or
  hand trace before Run. Their closes ask the learner to explain a boundary,
  state an invariant, or transfer the decision to another domain.
- The initial text-first pass left executable code and expected output
  unchanged. The locality follow-up below changes only one exercise's three
  region strings, with its starter, solution and expected output kept aligned.

### We Do

- Before: the 24 closes repeatedly used the template
  `Principio / Malentendido / Transfer / Self-check`.
- After: each exercise has a distinct reflective task. Examples include
  distinguishing an empty population from a zero rate, designing a fixture
  that catches `> 0` versus `>= 0`, proving `while` termination, explaining
  why a short `zip` can improve a metric dishonestly, and naming the question
  that would legitimately require O(n²).
- The richer preambles exposed a latent packet issue: seven IDs fell beyond a
  500-character parser lookback. All 24 existing IDs were mechanically moved
  next to their `instruction` fields, with no identifier or wording changed.
  The active manifest now exposes 24 ordered, unique canonical IDs.

### You Do and self-check

- Before: the capstone emphasized implementing until `tests OK`, and the
  self-check explanations were correct but terse.
- After: the learner first writes invariants for totals, raw preservation,
  empty batches and single-pass complexity; the final review asks them to
  defend those promises under changed inputs. Each of the eight self-check
  explanations now repairs the plausible misconception behind its distractors.

## Preserved technical contracts

- Stable id `functions-modules`, index 4 and learner title.
- Nine theory blocks, eight tagged subtopics, eight I Do demos and 24 We Do
  exercises.
- Every learner code/output contract. One repetitive region fixture was
  consistently diversified from three Peruvian cities to Quito, Bogotá and
  Madrid; its loop behavior and exact oracle remain unchanged in meaning.
- You Do starter, fixture, raw assertion, rubric and gate.
- Eight public self-check questions and their balanced positions.
- Authenticated bank: eight concepts × three variants, exactly 6/6/6/6 answer
  positions.
- S04 playground behavior and PDF mapping.

## Validation

| Gate | Result |
|---|---|
| Text-first + independent focused suites | 11/11 pass |
| Learner packet manifest | 24/24 ordered unique S04 exercise IDs |
| Scoped Python runtime audit | 64/64 artifacts pass; P0=0, P1=0 |
| V3 count, structure and invariant gates | pass; 52 sections, warnings=0 |
| Authenticated exam pedagogy | pass; 1,248 questions, 416 concepts, P0=0, P1=0 |
| TypeScript | pass |
| ESLint | pass |
| Node adversarial suite | 54/54 pass |
| Static production export | pass; 3/3 pages |
| Local exported site | HTTP 200; compiled bundle contains the new S04 prose |
| Spanish heuristic (`--no-lt`) | 9.01/10; no high or critical findings |
| Full Python adversarial suite | 79 inherited failures, 1 skip; no S04-owned failure |

The broad Python suite initially had 81 failures. Repairing S04's packet-ID
exposure removed one. A follow-up then reproduced and removed the remaining
S04-owned locality-density failure, reducing the suite from 80 to 79. The
remaining headings belong to untouched sections and known fleet contracts.

Generated fleet-audit JSON and Spanish-quality summaries were restored before
staging. No generated campaign artifact is part of this commit.

## Residuals

- `functions-modules` remains the stable compatibility id and historical
  filename; learner-facing mappings correctly say iteration.
- The offline Spanish heuristic reports three medium false positives caused by
  inline code tokens (`print print`, escaped delimiters and TRACE labels), plus
  low findings dominated by numbered instruction fragments. Direct inspection
  found no corresponding learner-language defect.
- The remaining 79 broad-suite failures are outside S04 and are assigned to
  pending section owners.

## Follow-up correction: locality-density contract

The first closure incorrectly described all 80 global failures as inherited.
Direct execution of `test_city_name_density_is_bounded` showed that S04 still
owned one: 68 Peruvian city tokens against the active cap of 55.

The repeated T1-A-E1 region fixture was hand-diversified from
`Lima / Cusco / Piura` to `Quito / Bogotá / Madrid`. This preserves the lesson's
international office-processing scenario, `for` behavior, stop-exclusive
`range` contract and exact code/output alignment while reducing S04's active
count to 53. The focused suite now imports the fleet's `PE_CITIES` expression
and asserts the same cap, so this miss cannot recur unnoticed.

Follow-up evidence:

- Active locality count: 68 → 53, cap 55.
- Focused text-first + independent suites: 11/11 pass.
- Scoped runtime: 64/64 artifacts, P0=0, P1=0.
- Full locality test: S04 passes; nine untouched sections remain above cap.
- Full Python adversarial suite: 140 tests, 79 inherited failures, 1 skip;
  no S04-owned failure heading.
- V3 structure/invariants and TypeScript: pass.
- Runtime-generated audit JSON restored before staging.

Ready for the next section.
