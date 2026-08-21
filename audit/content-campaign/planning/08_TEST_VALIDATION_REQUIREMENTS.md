# Test and validation requirements

Only commands that exist in this repository are used. Nothing is invented.

## Layer 1 — structural invariants (must stay green)

```bash
npm run test:v3-counts        # 52 sections, 24 exercises, 8 demos
npm run test:v3-structure     # S01 subtopic/demo/exercise tags
npm run test:v3-invariant     # all 52 against the canonical counting vector
```

## Layer 2 — preservation (release-blocking)

```bash
node scripts/preservation_sentinel.mjs
npm run test:preservation
```

## Layer 3 — content correctness

```bash
python3 scripts/python_content_runtime_audit.py --only s18-data-engineering
python3 scripts/python_content_runtime_audit.py --only s15-stdlib-deep
npm run test:exam-pedagogy
```

The runtime audit is the honesty gate: it re-executes every extracted snippet,
including theory code, and compares behaviour. A fabricated `output:` field
cannot survive it.

## Layer 4 — static analysis and build

```bash
npx tsc --noEmit
npm run lint
npm run build:static
```

## Layer 5 — glossary regression guard

```bash
python3 scripts/glossary_intro_audit.py
python3 scripts/glossary_coverage_audit.py
```

Both **already fail at baseline** (2 forward refs; 46 P1 coverage misses). The
requirement is not "make them pass" — that is out of scope — but that the
numbers do not get worse.

## Layer 6 — render inspection

The rendered `/curso/data-engineering` and `/curso/stdlib-deep` theory tabs are
inspected at desktop and narrow widths for overflow, truncated code, broken
lists, heading hierarchy and console errors. A source diff is not a render
validation.

## Layer 7 — legacy save fixture

A representative `python-ds-progress` envelope is captured **before** the change
and replayed against the built app afterwards. Required survivals: completed
sections, all five sub-step tokens, quiz scores, bookmarks, `lastVisited`,
`startDate`, and no reset or migration warning.

## Layer 8 — novice validation

An isolated reader is given only the learner-visible material up to and
including the candidate unit, and must answer the new Autocheck questions and
name the term-introduction chain. They may not see the research notes, the
writer's rationale, or any later section. A correct answer that the allowed
context cannot support is a curriculum failure, not a pass.

## Layer 9 — independent editorial validation

A reviewer who did not write the prose scores the §10 rubric and hunts for
hidden prerequisites, answer leakage, weak distractors and voice drift.

## Convergence

Maximum 5 repair rounds per unit; 2 consecutive quiet rounds required. Any
unresolved material defect at budget end is reported as `NOT_CONVERGED`, not as
complete.
