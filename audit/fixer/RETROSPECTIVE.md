# Retrospective: six failures, one root cause

Every failure in this campaign so far was the same mistake wearing different clothes:
**a measurement was trusted without checking the precondition that makes it mean anything.**

| # | What happened | The unchecked precondition | Cost |
|---|---|---|---|
| 1 | Baselined "4 pre-existing runtime failures"; recorded S04 as introducing a P0 | The audit was running system Python 3.9 against a course pinned to 3.12. It reported `environment_matches_pins: "drifted"` and said so in prose. | 4 phantom failures treated as real; one false P0 blamed on codex |
| 2 | Waited 8 hours on a finished round | `pgrep -f "run_round.sh S04"` matches the waiter's own command line, so it always finds "a process" | 8 hours of zero progress |
| 3 | Committed an unrelated `CP-N4-C/run_state.json` change | `git add -A course-state/` stages whatever was already dirty, not just my work | Needed a revert commit |
| 4 | S03 shipped `DNI 12345678` after D2 said not to | A policy written as prose in a prompt is advice, not a check | One section carries known debt |
| 5 | Reported 101 vocabulary gaps, ~15 of them false | The detector could not see parenthetical or em-dash glosses, the two forms this course uses most | Would have sent codex to "fix" correct prose |
| 6 | S38 showed 41 P0s | 5 of 234 audit files grade `critical/high/medium`; reading `high` as top severity inflates P0 | Caught before it reached a fixer round |

Failure 1 is the sharpest: the gate printed its own invalidity in the same JSON I was reading
numbers out of. I baselined the warning.

## The rule that follows

**A gate must refuse to report a verdict when its own preconditions fail.** Not warn — refuse.
A warning next to a number gets read as a number.

`python_content_runtime_audit.py` now works this way: a drifted interpreter makes `ok` false,
for the same reason the file already refused to call a degraded run ok — a clean result would
be unearned. The same reasoning applies to every measurement this campaign depends on.

## What is now checked automatically

- `tools/fixer/preflight.py` runs before every chain: interpreter identity and pin match, all
  52 sections resolving, gate validity flags, and a snapshot of files that were already dirty.
- The dirty snapshot means a pre-existing modification can no longer be swept into a commit
  (failure 3). Staging is explicit paths only, never a directory or glob.
- Waiting is on marker files, never `pgrep` on a pattern that can match the waiter (failure 2).
- Standing decisions are gates, not prompt prose: D2 is `scripts/synthetic_identifier_audit.py`,
  and its violations are injected into each section's prompt as concrete work items (failure 4).
- Detector changes are validated by sweeping the corpus for what they newly accept or reject,
  not by one example (failure 5).
- Severity is normalised per file by detected vocabulary, with the raw string preserved
  (failure 6).

## What remains unguarded, honestly

Codex's content is checked for anchor uniqueness, type-correctness, runtime, vocabulary and
identifiers — but nothing verifies that a rewritten paragraph is *pedagogically better* than
what it replaced. That judgement still needs a human reading the diff, and no gate here
substitutes for it.
