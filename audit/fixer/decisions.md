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

## D4 — Figures are inline SVG; screenshots are out of scope
*Recorded 2026-09-13 from the existing schema, not newly decided.*

`src/lib/types.ts` states it directly: "Figures are inline SVG components, not images:
they follow the theme tokens, scale without loss, and are checked by the same geometry
gates as the rest of the page."

So diagrams and light animation are available; **screenshots are not**, and adding them
would mean a new asset pipeline, theme-aware light/dark variants, and exemption from the
geometry and contrast gates every other visual passes. A screenshot also rots the moment
the UI moves, which is the failure mode the SVG decision was made to avoid.

Where a screenshot feels necessary — terminal output, an editor state — the substitute
is a figure built from the archetypes in `src/components/course/figures/archetypes/`
(flow, decision, stack, timeline, set, bars, table-shape, graph) plus a real code block
showing the exact command and its output. Those execute in the runtime audit; a
screenshot cannot.

Adding a figure is cheap and data-driven: an entry in
`src/components/course/figures/data/` with `kind`, `headline`, stages and an `outcome`,
referenced by `figure.id` from the TheoryBlock. 94 exist today.
