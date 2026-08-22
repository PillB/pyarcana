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

---

# Refined analysis (2026-08-22, verified against a real pandas 3.0.5 environment)

The earlier estimate of "13 section files contain `dtype`" overstated it.
`datetime64[ns]` appears in exactly two files, and one of them
(`s07-pandas.ts`) is inactive. **Real exposure is S15 alone.**

A pandas 3.0.5 / numpy 2.5.2 / Python 3.12 venv reproduced CI exactly (6 fails,
117 skips, same artifacts), so every number below is observed, not inferred.

## Two changes, needing very different treatment

| change | artifacts | nature |
|---|---|---|
| default datetime resolution `datetime64[ns]` → `[us]` | 4 | mechanical |
| default string dtype `object` → `str` | 2 | **re-teach** |
| `array_strptime` raises `AssertionError` | 1 starter | needs diagnosis |

**Datetime — done.** `S15-T1-B` asserted `str(dtype) == 'datetime64[ns]'` in its
preamble, instruction, `tests` and declared output. The lesson there is "declare
`parse_dates` so the column is a real date, not text"; the resolution suffix is
incidental to it. The assertion now checks the dtype *family*
(`.startswith('datetime64')`), which is `True` under both 2.3.3 and 3.0.5 —
verified in both. The feedback now teaches why that matters: a contract should
assert what you care about and nothing more, and this exact test broke on a
version bump with nothing wrong in the learner's code.

**String dtype — done (2026-08-22).** The pandas-3 lesson is:

- `str` is the inferred default for homogeneous text (missing as `NaN`);
- `string` (`astype('string')`) is the nullable schema contract (missing as `pd.NA`), still what CP-N2-A asks for ids;
- `object` is the leftover for mixed Python types. Seeing it on a supposed-text column means inference refused to call it `str`.

Declared outputs were recaptured under pandas 3.0.5 / numpy 2.2.6 (no pyarrow).
`series_df.py` now prints `dtypes.astype(str)` so the learner sees `'str'`, not
the `StringDtype(storage='python', …)` repr. Memory figures in the two
manifests moved with the dtype (266→254, 335→315); the CSV hashes did not.

**`array_strptime` — diagnosed, not papered over.** `starterCode-14` is
S15-T3-A-E3: `pd.to_datetime(..., errors="ignore")`. In pandas 3.0.5 that
path raises a pandas-internal `AssertionError`. `errors='ignore'` is no longer
a real option. The starter now uses the default (`raise` → `ValueError` on
`"no-fecha"`), marked `DEFECT`; the learner repairs it with `errors='coerce'`.
The exercise still teaches countable NaT; it no longer pretends `ignore` works.

## Current state

- Declared environment: pandas 3.0.5 / numpy 2.2.6 / scikit-learn 1.6.1 /
  scipy 1.13.1.
- S15 under that environment: **65 pass / 0 fail**.
- All 52 sections: **3265 pass / 0 fail / 92 skip**. The skip increase versus
  the pandas-2 local run (70) is fastapi/sqlalchemy/cv2 missing from the clean
  venv, not a dtype mismatch.
- A learner who `pip install pandas` now sees the dtype the lesson describes.
