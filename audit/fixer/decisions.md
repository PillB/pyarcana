# Standing decisions for the fixer campaign

Binding on every section from S01 onward. Each entry records who decided it and why,
so a later round does not quietly reverse it.

## D1 — Gloss every term inline, including in preview surfaces
*Decided 2026-09-11 by the repo owner, at the S01 boundary.*

The tagline, `learningOutcomes` and `jobRelevance` are **not** exempt from
define-before-use. A learner who reads only the outcomes must not meet a word the
course has not explained. If an outcome names a term the learner has not met in an
earlier section, gloss it in place — a short parenthetical or an em-dash appositive,
the way S01 now writes "el intérprete Python correcto (el programa que ejecuta tu
código)".

Rejected alternative: exempting preview surfaces and only requiring the term to be
defined before an exercise needs it. Rejected because outcomes are the first thing a
learner reads and the place they decide whether the section is for them.

## D2 — Synthetic records carry no DNI
*Decided 2026-09-11 by the repo owner, at the S01 boundary, closing S01-U02.*

Course material must **not** generate, print or store a Peruvian DNI, not even a
"ficticio" one. Drop the field from synthetic records entirely.

The audit raised this and codex declined to invent a pattern, correctly: any made-up
DNI range risks colliding with a real, issued identifier, which is the exact harm the
"use fake data" instruction exists to prevent. Removing the field has zero collision
risk and nothing in the curriculum depends on having one.

When a section needs a per-person key, use an opaque internal id (`cliente_id`,
`CLI-0001`) and say plainly that real national identifiers never belong in practice
data or in a repository. Applies to S01, S02, S03, S07, S09, S11, S22, S41 and S52,
which mention DNI today.

## D3 — A load-bearing concept gets a subsection, not a gloss
*Decided 2026-09-13 by the repo owner, after the S01 redaction pass.*

D1 requires a term to be explained where it first appears. That is the floor, not the
ceiling. When a concept is **load-bearing** — the section's later work fails without it,
and it recurs across the course — an inline parenthetical is not teaching, it is a
label. Those concepts get their own subtopic: orientation, a worked example with real
values, a figure, and a check the learner can perform.

`git`, `venv`, `commit`, `PATH`, `dependencias`, `intake`, `raw`/`clean` are examples.
A term used once in passing is not.

Test for whether a concept qualifies: *if the learner misunderstands this, does a later
exercise in this section become unsolvable?* If yes, it needs a subsection.

This costs length. The trade-off is accepted deliberately: a section that takes longer
to read and leaves the learner able to do the work beats a shorter one that leaves them
recognising vocabulary.

## D4 — Diagrams and animation are first-class; screenshots are not
*Recorded 2026-09-13. Corrects an earlier version of this entry that understated what
the platform already does.*

Available today, and already used in course figures:

- **Inline SVG figures**, bespoke or built from eight data-driven archetypes in
  `src/components/course/figures/archetypes/` — flow, decision, stack, timeline, set,
  bars, table-shape, graph. Adding one is a data entry in
  `src/components/course/figures/data/` (`kind`, `headline`, stages, `outcome`),
  referenced by `figure.id` from a TheoryBlock. 94 exist.
- **Animation** via `framer-motion` (^12.23.2). `SteppedCode` reveals an I Do demo line
  by line so the "predice la salida" instruction is honest instead of asking the learner
  to predict something already on screen. `S14ViewVsCopy` animates a figure.
- **Interactive graphs** via `@xyflow/react` (^12.11.3) — `GraphFigure` and
  `S31EvidenceGraph`, loaded dynamically because pulling xyflow into every section cost
  ~5s of hydration on S01.

Two constraints that come with them, both load-bearing:

1. **Reduced motion is honoured.** `SteppedCode` reads `useReducedMotion`. Any new
   animation does the same; motion is never the only carrier of meaning.
2. **The code-fidelity gate still applies.** `scripts/code_rendering.spec.ts` asserts the
   rendered text of every code block is byte-identical to `data-code-source`. So an
   animated reveal hides lines with `visibility`, never by truncating them, and output
   stays in the DOM with its full text. An animation that withholds text from the
   accessibility tree fails.

**Screenshots remain out of scope.** There is no image pipeline, `src/lib/types.ts`
states figures are inline SVG "not images", and a raster screenshot would need
light/dark variants and exemption from the geometry and contrast gates every other
visual passes — then rot the moment the UI moves. Where one feels necessary, use an
archetype figure plus a real code block: that block executes in the runtime audit, and
a screenshot cannot.
