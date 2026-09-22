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

## D7 — Gate on what writing rule B5 forbids, not on a suffix count (2026-09-15)

**Decision.** The shared gate no longer fails a round on `nominalisations_per_100w`, the density
of words ending in *-ción, -miento, -idad, -anza, -encia*. It fails on
`b5_nominal_constructions_per_100_sentences`: a nominalisation as a sentence's actor ("La
validación del registro produce…"), a light verb carrying the action ("realizar la
comprobación"), or nominalisations stacked with *de* ("la ejecución de la validación"). Names
are excluded — glossary terms and aliases, and terms a section introduces in bold. The suffix
density is still measured and printed as `info:`.

**Why.** The Spanish-language pass was rejected in S28, S44 and S51 with every other gate green.
Listing the added words showed English nouns translated to Spanish nouns — *release* →
*lanzamiento*, *checks* → *comprobaciones*, *production* → *producción*. Replacing a noun with
a noun is not what B5 ("La validación del registro produce el rechazo" → "el validador rechaza
el registro") forbids. The proxy was penalising the fix the pass exists to make. Checked on ten
hand-written cases in both directions, and against the three rejected passes: S44 added no
B5 constructions; S28 added "regresiones del emparejamiento" four times, which the new measure
still fails, correctly.

**Trade-off, stated.** The new measure is blind to abstraction that takes none of the three
shapes — a lone abstract noun as object, heavy prose built from *-dad* words without *de*. It is
a regex over Spanish, so it has false positives ("la versión del lanzamiento" counts as a chain)
and will miss unusual light verbs. It is kept as a *regression* measure, so a false positive
present before and after costs nothing. Suffix density remains visible, so a sharp rise is
still seen by whoever reads the gate output. Rejected alternative: raising the tolerance on
the old metric — that would have hidden the S28 chain while still rejecting correct translations
in a longer pass.

## D8 — Declared outputs are compared line by line (2026-09-15)

**Decision.** `scripts/python_content_strict_output_audit.py` compares every line of every
declared `output:` against what the code prints under `.venv-content`, and the shared gate fails
a round that raises a section's mismatch count. The soft runtime audit still gates that snippets
run.

**Why.** The runtime audit reads only the first line and scrubs numbers when it differs; it
passed a planted `second_changes 1` where the code prints 0. The strict audit caught it. Run
course-wide it found six real stale outputs the soft audit had passed: S08 (an older return
shape), S09 ×2 (tracebacks without the source lines Python prints), S18 ×3 (a wrong hash,
dict keys in hand-written order where `groupby` sorts).

**How it keeps honest tolerance.** Each snippet runs under `PYTHONHASHSEED=0` and `=1`; only a
line that differs between the two runs is compared after scrubbing numbers. The patch release of
the pinned 3.12 and the file a traceback names are host-specific and neutralised. An ellipsis in
a declared output elides. Trade-off: a line nondeterministic in a way two seeds do not expose
(wall-clock timing that happens to match twice) reports as a mismatch — a false alarm, visible,
rather than a silent pass.

## D9 — `main()` and `__name__` stay out of the early sections (2026-09-17)
*Decided by the repo owner, closing the S01 entrypoint question in OPEN_QUESTIONS.*

Do not use or mention `def main()` or `if __name__ == "__main__":` in the first lessons. They are
taught only where they become *strictly necessary* — the point at which a learner stops treating
a file as a script and starts importing it as a module, which is far later in the course. Until
then, every example is top-level statements.

This reverses what the repository currently enforces. `S01-T1-A-E2` asks a beginner to rebuild the
guard from blanks, `S01-T1-B-E2` wraps an argv exercise in `def main():`, S02's You Do requires
both — and `scripts/newbie_agentic_validator.py` *fails* `hello_sys.py` when they are missing,
with `tests/adversarial/test_s01_independent_recovery.py:172` pinning the exact solution text.
Those gates were written against the old convention and must be repointed, not weakened: they
should assert the pattern's **absence** in the early sections and its presence where it is taught.

The analysis owed with this decision: *when* does the course first need it? The answer has to be
the section where the learner runs their own module both ways — S10 (`modules-packaging-cli`)
teaches `__name__` today — and the sections between S01 and there must be checked for the same
pattern rather than assumed clean.

## D10 — No `try`/`except` before the error-handling lesson (2026-09-17)
*Decided by the repo owner, same round.*

A learner does not need `try`/`except` anywhere before the lesson that teaches errors and testing.
S09 (`exceptions-logging`) is that lesson. Every earlier use is a forward dependency and comes out,
by rewriting the exercise so the failure is observed rather than caught, or by moving the piece
that needs catching to S09 or later.

This was invisible until 2026-09-17, because no glossary alias covered the keyword: adding
`except` and `try/except` to the `Excepción` entry surfaced 11 occurrences in S02, 7 in S04, 14 in
S05, 9 in S06, 3 in S07 and 10 in S08, all before S09's own 50. Several sit inside the S02–S04
cumulative capstone, so this decision and Q3's route interact and are resolved together.

## D11 — A capstone gets a primer or moves; it is never awarded retroactively (2026-09-17)
*Restated by the repo owner as binding, from the standing policy.*

When a capstone, project, exercise or self-check depends on a topic taught later, ask first
whether it needs the **full** topic or a *fundamentals* version of it. Most of the time it needs
the second, and the right treatment is a pill of knowledge — an explicit "trust me for now"
primer that says what the learner is about to run, in plain words, and names the later lesson
where it is explained properly. The worked shape, from the owner:

> "to work with the required data you will need to get the information from an online repository
> and load it into our Python session; we will use `read_excel` from the pandas library… For now
> you will just execute those rows so the processes after do not show errors, but in lesson A,
> lesson X and lesson D we will cover in detail why we are doing the cleaning and drill down into
> a more complete process."

If the dependency is genuinely integral and needs a maturity a primer cannot give, then rewrite
the capstone so its dependencies are relevant and appropriate; and if that is not possible, move
the capstone, project, exercise or self-check to after the knowledge is acquired. Record the
change in detail and raise it again for human review.

**Never award a capstone or a badge retroactively**, and never mark one as earned because the
evidence for it appears somewhere else in the course.

## D12 — Section exams: the key never leaves the server, attempts last 60 minutes, and pre-fix scores are not evidence (2026-09-18)
*Chosen by the repo owner, closing red-team finding `exam-submit-grades-client-chosen-questions`.*

- **The answer key is never shown**, on any attempt: not the correct option, not the explanation.
  The learner sees their score, the option they chose and whether it was right. This is V3:93
  ("nunca expone claves ni variantes futuras"), which outranks the red-team's "after the last
  attempt". Every learner-facing route redacts it — submit, `exam/attempts`, `progress`, and
  `exam/start`'s refusal at the cap; the admin views keep it.
- **An attempt lasts 60 minutes** from `exam/start`, shown as a countdown; at zero the page sends
  what is marked. The server accepts a submission up to 2 minutes late, for the request's trip,
  and closes a later one — or one abandoned in a closed tab, when the learner next starts — with
  0 and nothing answered. V3 sets no limit; this is the owner's choice, matching the 3600 s cap
  `timeSpentSec` already had.
- **Rows graded before the fix are not evidence.** `ExamAttempt.gradingVersion` 0 marks them. They
  count toward no credential, cohort figure, PDF report figure or best score, and use up none of
  the 3 attempts, so an honest learner can re-earn a pass. They stay in the learner's history,
  labelled.
- **A question whose key the learner was shown is drawn last, and an attempt that includes one is
  not evidence** (amended 2026-09-19). The old submit returned the key of every question id it was
  sent, from any section, and a legacy row's stored answers name exactly those. `exam/start` draws,
  per concept: a variant never shown with its key and not drawn before; one never shown with its
  key; one not drawn before; any. It records the number of seen questions it could not avoid in
  `ExamAttempt.exposedItems`. That attempt uses one of the 3, is graded, and shows its result, but
  its score is not evidence. In practice only a learner whose legacy attempts covered all three
  variants of a concept reaches that point; new variants are what would let them re-earn a pass.
- **One rule decides what a score is worth**: `isEvidence` in `src/lib/exam-scoring.ts` (graded,
  `gradingVersion` ≥ 1, `exposedItems` 0), failing closed when a caller did not select those
  fields. Credentials, cohort `examsPassed` (distinct sections, not attempts), the PDF report, the
  learner's best score and every admin score figure read it. Activity figures — attempts sent, time
  spent, last active — keep every attempt.
- **Submit grades against the form `exam/start` saved** (`ExamAttemptForm`): the questions as the
  learner saw them, with their key. A reseed or an edited question cannot change an attempt in
  progress. The form lives in its own table so no query returning attempts carries the key.

## D13 — The self-answering pass of 2026-09-21, and what it settled

*Recorded 2026-09-21.*

158 questions that the red team and this campaign had left for the owner were decided by a
thirteen-cluster pass: one decider per cluster, then an adversarial judge that re-read every cited
ruling and source and tried to refute it. The owner's instruction was to answer them from the
project's own heuristics, researched practice and prior art, and to surface only what that cannot
settle.

- **31 were already decided** by D1-D11 and the standing owner policy. They are not new rulings;
  they are those rulings with their sites listed. The largest is D9: `def main()` and the
  `__name__` guard come out of 20 sites in S02-S09 plus the two Level-1 capstone starters, S09's
  tests move into `audit_log.py` (a separate test module would run the demo on import), and S10
  teaches the guard with exactly that case.
- **64 are self-answered** and need nothing reserved to implement.
- **4 were refuted** by their judge and are not findings.
- **59 remain with the owner**, grouped into ten questions in `OWNER_PACKET_2026-09-21.md`, each
  with a recommendation. Every one of them changes a credential claim, relaxes a gate, restructures
  a practice layer, or edits `learning_roadmap_52_V3.md`.

The full record, with rationale, rulings, sources, implementation steps, the test that fails today
and the judge's verdict for each, is `audit/fixer/DECISIONS_2026-09-21.md`. A decision recorded
there is binding in the same way this file is: read it before reopening any of those questions.

Two standing consequences of the pass itself:

1. **A decision is not settled until its judge has read the sources.** Four decisions died on
   their judge's reading, and 38 more were amended - most often because a quoted line had moved,
   or because the fix would have broken a neighbouring block. Cite the file and line, and expect
   it to be checked.
2. **Classification is about what the change touches, not how sure you are.** A decision can be
   certain on the merits and still belong to the owner, because implementing it would rewrite what
   a badge claims or relax a threshold. That boundary is what kept the packet to ten questions.
