# Open gap — the curriculum is written for pandas 2, learners now install pandas 3

**Found:** 2026-08-22, by the new `content-gates` CI job on PR #34.
**Status:** OPEN. Pinning CI does not fix this; it only makes the gate testable.

## What happened

The CI job installed `numpy pandas scikit-learn` unpinned and got
**pandas 3.0.5 / numpy 2.5.2**. Six artifacts in S15 (`stdlib-deep`) failed that
pass locally on **pandas 2.3.3 / numpy 2.0.2**:

| artifact | kind | reason |
|---|---|---|
| `starterCode-14` | starter | `AssertionError` inside `pandas._libs.tslibs.strptime.array_strptime` |
| `solutionCode-4` | solution | output_mismatch |
| `solutionCode-20` | solution | output_mismatch |
| `code-block-1` | demo | output_mismatch |
| `code-block-4` | demo | output_mismatch |
| `code-block-14` | demo | output_mismatch |

Five of the six print **dtype contracts**, and that is the mechanism:

```
declared (pandas 2):  {'cliente_id': 'object', 'monto': 'float64'}
pandas 3 produces  :  {'cliente_id': 'str',    'monto': 'float64'}
```

pandas 3.0 changed the default string dtype from `object` to `str`. S15 teaches
dtype contracts deliberately and prints them, so the change lands directly on
learner-visible output.

## Why this is a content problem, not just a CI problem

Nothing in the repository declared a Python environment — no `requirements.txt`,
no `pyproject.toml`. The `output:` blocks were verified against whatever the
author had installed. A learner who follows the course today and runs
`pip install pandas` gets 3.x, runs the S15 demo, and sees `str` where the
lesson says `object`.

So the course is **already wrong for a new learner**, and was before this
campaign — CI simply made it visible for the first time.

## What was done now

`requirements-content.txt` declares the environment the content is verified
against, and CI installs it. That gives the gate a specification: "these outputs
are true in this environment." It is a real engineering decision, not a way to
get green — without a declared environment, "does the content run?" has no
answer.

## What remains

A pandas-3 migration pass over the dtype-printing content. Exposure: **13
section files** contain `dtype`, with S15 the concentration. The work is:

1. decide the target — teach pandas 3 dtypes, or teach `object` and tell learners
   to pin (S15 already teaches pinning and reproducible environments, so either
   is defensible);
2. re-run every affected snippet under the chosen version and paste real output;
3. check the prose, not just the outputs — S15 explains *why* a column is
   `object`, and that reasoning changes under pandas 3;
4. move the pin forward and re-run the gate.

This is a bounded but genuine content project. It must not be done by
find-and-replacing `'object'` with `'str'`: the surrounding explanation is part
of the lesson.
