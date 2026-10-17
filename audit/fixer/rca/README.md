# Root-cause analyses, 2026-09-25

Five parallel agents were asked why the same classes of failure kept destroying content rounds.
Over two days, twenty-four sections were processed, codex produced roughly ninety patches with
**zero rejected on quality**, and eleven rounds were thrown away — every one of them on the
machinery rather than on the Spanish. The gate restores the section when it fails, so a bad
instrument does not report noise, it deletes the work.

Each file is one failure class: its root cause cited to `file:line`, why fixing instances did
not stop it, the blast radius measured rather than asserted, and proposed guards with their
false-positive risk. The headline findings, with what has been done about each:

| file | headline | status |
|---|---|---|
| `positional-pins.md` | 2,208 of 7,717 event locations (28.6%) are positional. 18 theory blocks were inserted across 15 of 19 rounds, none carrying a `subtopicId`, so `theory[N]` and `#N` shift on nearly every round. | guard added for both spellings, then widened after S15; every other adversarial test swept |
| `stale-first-section.md` | **ratcheted 2026-09-25 at 21 late + 5 unreachable.** `firstSectionId` was never re-derived after the curriculum rewrite — commit `a492d8ea` remapped 19 values mechanically via `SECTION_ID_RENAMES`, a *storage* migration that preserves the slot, not the meaning. 33 of 106 terms match nothing anywhere, so the gate is vacuous for them. | `pytest`, `F1-score` and `overfitting` repointed; the systematic sweep is still owed |
| `teach-vs-measure.md` | Three instruments confirmed, not two — plus `b5_nominal_constructions_per_100_sentences` reads a key **no script has ever produced**, so D7 has never been enforced and that measure can never fail. | concept buckets and `first_use_issues` fixed; the dead b5 measure is still owed |
| `homonym-false-positives.md` | Of 268 surprising uses, 10 are clear homonyms (3.7%) and 22 borderline; **236 (88%) are genuine**. Only 3 of the 202 in S02–S04 are homonyms. Corrects an earlier claim that the number was badly inflated. | measured again by alias language: 145 of 200 come from English-token aliases (low risk), 55 from twelve concepts whose aliases include an ordinary Spanish word |
| `blocked-s02-s04.md` | 202 of 268 sat in S02–S04, but **only 6 are in a You Do** — and CP-N1-A *is* the You Do. The block was attributed to one owner question whose own subject is 3% of the harm. | reframed for the owner; route 2 chosen, D14 granted, and the practice-layer work is under way |

These were recovered from the agent transcripts after the scratchpad they were written to was
deleted with the session's temp directory. They live here now because they are campaign
evidence, not working notes — the numbers in them are cited and were independently re-verified
before being acted on. Where a file says "in progress", that is the agent's own note: each was
instructed to append findings as it established them, on the assumption it would be interrupted.

## Reconciling the two "never matched" counts

`stale-first-section.md` reports **33 of 106** terms matching nowhere; a later alias-aware
survey found **5**. Both are right and they answer different questions:

- **33** is measured with the *gate's own* matcher, which tests only the `term` field and drops
  any mention whose first character follows a backtick. For those 33 the gate is **vacuous** —
  `firstUse` is `undefined` and its assertion never evaluates.
- **5** counts terms that appear nowhere even when every alias is tried against the whole
  section: genuinely dead entries, or an alias that is simply wrong
  (`args-y-kwargs`, `namedtuple`, `hyperparameter-tuning`, `distribución normal`, `estimando`).

The gap between them is the gate's blindness, not a disagreement. Counted with every alias,
**21 terms are declared later than the course first uses them** and the strict gate sees none of
them — `mlops` by 23 sections, `fastapi` by 20, `generator` by 19, `outlier` by 13.

Widening the strict gate would fail every round until all 21 are repaired, and repair is not
mechanical: moving a term's declaration earlier moves its hover earlier, and several definitions
lean on vocabulary the earlier section has not taught — `overfitting`'s said "training data" and
"score" — so the text needs the content author. `glossary-first-use-ratchet.test.mjs` therefore
counts the debt, forbids it growing, and requires the number to be lowered as it is paid.
