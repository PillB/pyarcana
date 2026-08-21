# Editorial and writing requirements

Binding source: `docs/policies/HANDCRAFTED_WRITING_PROTOCOL.md` (canonical per
`AGENTS.md` §MUST-10).

## Language

Learner-facing prose is Spanish as used in Peru: clear, cultivated, not
infantilising. English technical terms practitioners actually meet are preserved
(`p-value`, `guardrail`, `pushdown`, `row group`) and are **defined in Spanish on
first use**. This matches the existing house style in S18 and S15, which already
mixes `leakage`, `bootstrap`, `outlier` and `round-trip` into Spanish prose.

## House style observed in the target files, and matched

The existing S18/S15 voice has a recognisable shape that new prose must join
rather than interrupt:

- key terms in `**bold**` at the moment of definition;
- an explicit *contract* framing — what you receive, what you return, what makes
  it fail;
- named synthetic cases (`CASO-LIM-018`), never real people or real companies;
- a standing ethical guard — *"sin PII real"*, *"anomalía ≠ fraude"*;
- worked numbers carried through the prose so the reader can check the code
  against the sentence.

Departing from this would itself be an aberration under protocol §4.1
("abrupt changes in voice").

## Explanatory movement (internal, not a visible template)

concrete problem → intuitive picture → exact term → definition → mechanism →
worked example → interpretation → plausible wrong idea → limits → consolidation.

Applied per unit, never displayed as headings.

## Prohibited

- Jargon before motivation.
- Definitions with no mental hook.
- `"At its core…"`, `"Crucially…"`, `"This is not X; it is Y"` and their Spanish
  equivalents.
- Bullets substituting for explanation.
- `"como vimos antes"` where the recalled idea is *required* but not refreshed —
  the specific defect this campaign exists to repair.
- Any sentence that adds length without adding information, reasoning, evidence,
  clarification, distinction, illustration, qualification, implication,
  transition or synthesis (protocol §4.5).

## Editorial brief required before drafting each unit

Audience · starting point · purpose · core question · required outcome ·
prerequisites · new terms · key claims · evidence · worked example ·
misconceptions · limits · backward link · forward link · project transfer ·
risks. Recorded in `audit/content-campaign/evidence/<unit>/BRIEF.md`.

## Rubric gate (protocol §10)

Purpose · Structure · Substance · Readability · Voice · Original Authorship
Quality · Reliability, each 0–3.

**PASS requires:** total ≥ 18/21, none below 2, and Substance = Original
Authorship Quality = Reliability = 3.

The writer does not award the final score alone; see `08_TEST_VALIDATION_REQUIREMENTS.md`.

## Factual control

Every asserted stdout is produced by actually running the snippet on the
declared interpreter and pasting the real result. No benchmark numbers, no
invented API responses, no fabricated business impact. Where a claim is
version-sensitive or environment-dependent, it is marked as such in the prose.
