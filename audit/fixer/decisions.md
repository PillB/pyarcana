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

## D5 — 5–10 diagrams or animations per concept, load-bearing first
*Decided 2026-09-13 by the repo owner. The sequencing and the caveat are mine, stated not absorbed.*

**The target:** every concept carries 5–10 visuals — diagrams, animated reveals, or
interactive graphs — not one figure per section.

**Where the course stands:** 105 figures total; 81 of 95 concepts have none associated.
Reaching 5–10 across all 95 means 475–950 figures.

**The caveat, stated because it changes what "done" means.** `src/lib/types.ts` says a
figure "earns its place only by removing work the prose was doing badly — Mayer's
coherence principle — so decorative diagrams are out of scope." That is not repo
opinion: Mayer's coherence principle is the finding that *extraneous* visuals reduce
learning, measurably, rather than leaving it unchanged. Nine diagrams where the concept
supports three does not teach 3× better; it costs attention the learner needed for the
other six.

So the number is a target, and each figure still has to pass the same question: **what
work was the prose doing badly that this removes?** A figure that cannot answer it is
not built, and the shortfall is reported rather than padded.

**Sequencing** — by where a visual buys the most:

1. The 37 load-bearing concepts (taught with a worked example, used in three or more
   sections): `git`, `commit`, `venv`, `dependencias`, `dataframe`, `groupby`, `dtype`,
   `dict`, `list`, `coverage`, `llm` and the rest. 5–10 each.
2. Concepts at L2 with no figure at all — the largest single gap.
3. Everything else, one figure minimum where a visual has work to do.

**Form** follows D4: archetype figures (flow, decision, stack, timeline, set, bars,
table-shape, graph) are data entries and cheap; `framer-motion` reveals for sequences
where the order is the lesson; `@xyflow/react` where the structure is a real graph.
Reduced motion is honoured and the code-fidelity gate still applies.

**Authorship** follows the campaign rule: codex writes every headline, label, caption
and `alt` from the plan and instructions given to it. This repository's tooling places
them, validates the anchors, and runs the gates.

## D6 — Complete content outranks a fixed count; counts are floors, not ceilings
*Decided 2026-09-14 by the repo owner: "having complete content is more important than
fixing the number of subtopics to a maximum number."*

A structural count exists to stop canonical content from being **lost**. It must never stop
content from being **added**. When a count blocks teaching, the count is wrong.

**Verified before changing anything, because the obvious reading was wrong.** A grep for
exact-count assertions found about nineteen, and converting all of them looked necessary.
It was not. Adding a supporting theory block with a worked example and an exercise with a
non-canonical id, then running both adversarial halves and `test:v3`, tripped exactly
**one**: S02's `len(pairs) == 41`, whose regex matches any code/output pair. The rest match
only canonical id patterns — `S02-T[1-4]-[AB]-E[1-3]` cannot exceed 24 — so `== 24` already
means "all canonical items present" and tolerates extras. Converting them would have weakened
nineteen tests to fix one, which is what AGENTS.md MUST NOT #4 forbids.

That one is now `>= 41`, proven in both directions: it passes at 41 and still fails at 40.

**Correction.** "Exactly one" was wrong: the probe only exercised S02's tests. The S01
concept round then tripped `theory.count("      heading:") == 15`, pinned with the comment
"the count is still pinned exactly". A targeted search found one more of the same shape,
S06 at 9. Both are floors now; S01's was proven to pass at 26 headings and fail at 14. A
probe of one section's tests does not speak for fifty-two.

**How to add depth without breaking the spine.** The eight numbered subtopics are what demos
and exercises hang from, and `active_manifest` requires the eight theory tags to equal the
eight demo subtopic tags, in order. `parse_section_learner` deliberately ignores theory blocks
that carry no `subtopicId` — S02's source has ten theory blocks and the contract sees eight.
So:

- A supporting block that explains a concept in depth **carries no `subtopicId`.** It can be
  as long as the concept needs, hold its own example and figure, and sit next to the subtopic
  it serves.
- Giving it a `subtopicId` — new or duplicated — breaks the eight-to-eight alignment. That is
  exactly what the first concept rounds did, reverted in full.

**The two questions every surprising use must answer first**, also from the repo owner:

1. **Is this use necessary, or throwaway?** A term mentioned in passing that the lesson does
   not need is removed or replaced with plain words. That adds no cognitive load, where a
   definition adds some.
2. **Is this the right place to teach it?** If the concept is needed here, teach it here. If
   it cannot be taught properly at this point, move the use later, or teach it in an earlier
   section — do not bolt a definition onto a sentence that was never the place for it.

**A vital working concept gets instruction, not a gloss.** When the learner must use the
concept to do the section's work, the treatment follows the explicit-instruction sequence
the intervention literature converges on: say what it is and why it exists, model it on a
worked example with real values, guide the learner through a practice step with feedback,
have them do it independently, and check understanding. A parenthesis is the floor for a term
used once; it is not teaching for a concept the learning path depends on.
