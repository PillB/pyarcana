# AGENTS.md — Safe-Agent Policy for PyArcana

This file is the repository agent policy. It binds automated coding agents and
human contributors working with agents. **Preservation comes first.**

Priority order when instructions conflict:

1. Safety and authorization  
2. Explicit human requirements in the current task  
3. Preservation invariants in this file  
4. Approved repository specifications  
5. Existing implementation behavior  

---

## MUST

1. **Preserve by default.** Existing source, curriculum, tests, fixtures,
   migrations, assets, progress fields, IDs, and historical evidence are
   valuable until proven otherwise with repository evidence.
2. **Record baseline before edits.** Capture `git rev-parse HEAD`,
   `git status`, and identify any user/uncommitted work. Prefer a dedicated
   worktree and branch (never experiment directly on `main` production work).
3. **Establish a preservation baseline** before substantial changes
   (`audit/safe-agent/preservation-manifest-*.json` via
   `scripts/generate_preservation_manifest.mjs`).
4. **Inspect the diff after every mutation.** Stop immediately on unexpected
   tracked-file deletion or protected ID removal.
5. **Use small patches.** Prefer localized edits over whole-file rewrites.
6. **Use TDD for material defects:** reproduce → Red failing test → minimal
   Green → refactor → re-run affected tests → inspect diff → preservation
   sentinel.
7. **Validate untrusted inputs** at boundaries (progress store, URL/hash,
   curriculum JSON, query params, API responses, env config). Fail closed for
   malformed critical state; do not invent missing values.
8. **Run the appropriate test layer** before claiming success. Local unit tests
   do **not** prove production.
9. **Deploy only the exact tested SHA.** After deploy, verify live Pages and
   progress-fixture compatibility.
10. **Follow the editorial protocol for learner-facing prose.** Before creating or
    editing curriculum prose, read and apply
    `docs/policies/HANDCRAFTED_WRITING_PROTOCOL.md` (canonical text; the `.docx`
    is a human-distribution copy generated from it). If it conflicts with the
    active curriculum-audit skill or an explicit human requirement, apply the
    authority hierarchy at the top of this file and record the conflict.
11. **Scan commits for secrets** before push.

## MUST NOT

1. **Delete** tracked code, curriculum, tests, fixtures, migrations, assets,
   progress fields, IDs, or evidence without an approved
   `DestructiveChangeRequest` (see `audit/safe-agent/destructive-change-register.json`).
   Default deletion budget is **zero**.
2. **Run destructive Git** without explicit human authorization:
   `git clean -f*`, `git reset --hard`, `git checkout -- .`, `git restore .`,
   force-push, history rewrite, mass branch deletion, storage/DB reset of real
   user data.
3. **Reset, clean, overwrite, or stash** unrelated user/agent work.
4. **Skip, delete, or weaken** failing tests to get green CI.
5. **Ignore** TypeScript, lint, or build failures (`|| true` on critical CI is
   forbidden).
6. **Commit secrets**, credentials, private keys, or real learner PII.
7. **Present mocks/stubs/placeholders as production features.**
8. **Claim local tests prove production** or live deployment.
9. **Rewrite broad areas** or regenerate hand-written curriculum without scope.
10. **Modify production branch directly** when a PR path exists.
11. **Clear localStorage / progress** as a “migration fix.”
12. **Blindly update visual snapshots** because CI failed.

## Protected paths (non-exhaustive)

- `src/lib/course/sections/` — active and preserved lesson files  
- `src/lib/course/index.ts` — active S01–S52 import graph  
- `src/lib/progress-store.ts`, `src/lib/progress-sanitize.ts` — learner progress  
- `prisma/migrations/`  
- `public/` assets  
- `tests/`, `scripts/*regression*`, `scripts/static_public.spec.ts`  
- `learning_roadmap_52_V3.md`  
- `.github/workflows/`, `CODEOWNERS`, this `AGENTS.md`  
- Storage key: `python-ds-progress`  
- Progress fields: `completedSections`, `completedSubSteps`, `quizScores`,
  `lastVisited`, `bookmarks`, `startDate`, `isHydratedFromServer`

Inactive/legacy files may be classified as `INACTIVE_PRESERVED` and excluded
from active manifests; they must **not** be deleted.

## Deletion gate

Any deletion requires a `DestructiveChangeRequest` with:

- exact paths/objects  
- reason and requirement  
- obsolescence evidence + history/reference search  
- non-destructive alternatives considered  
- user-data impact, migration, rollback  
- tests  
- human authorization + verifier approval  

Unauthorized deletion is a release-blocking failure.

## CI preservation sentinel

```bash
node scripts/preservation_sentinel.mjs
```

Fails on unauthorized tracked-file deletions, removed protected curriculum IDs,
removed tests/migrations/progress fields. Approved deletions must appear in
`audit/safe-agent/deletion-allowlist.json` with a reviewed request ID.

## Testing hierarchy (minimum)

- **STATIC:** lint, `tsc --noEmit`, build (dynamic + static), secret scan  
- **UNIT / PROPERTY / CONTRACT:** adversarial suite, V3 counts, preservation tests  
- **E2E:** Playwright against built app; zero-retry audit jobs use
  `trace: retain-on-failure`, `screenshot: only-on-failure`,
  `video: retain-on-failure`  
- **LIVE:** post-deploy smoke on GitHub Pages; compare SHA/content  

Do not use E2E where a unit test localizes better; do not use a unit test as
proof of a complete user journey.

## Progress / migration invariants

- Active section count must not accidentally decrease (active index remains 52).  
- Section IDs unique and stable for imported sections.  
- Exercise IDs (`Sxx-Ty-Z-En`) remain present for active lessons.  
- Serialization/deserialization preserves valid progress.  
- Migrations never destroy completed work; must be idempotent.  
- Invalid persisted state fails safely (no white-screen).  
- Additive media must not alter completion state.

## Commit / PR discipline

Each commit maps to a requirement or accepted defect. Inspect
`git diff --name-status` before staging. Prefer explicit path staging. No mass
formatting mixed with behavior changes.

## Expert standard (binds every feature and every decision)

The bar is not "meets the stated constraints". The bar is what the best
practitioner in the relevant field would judge correct, measured against
evidence: peer-reviewed results, the preponderance of published research,
standards bodies, or the authoritative reference for that domain.

For each non-trivial decision:

1. **Name the expert and the benchmark.** Who would review this — an
   accessibility specialist, a psychometrician, a statistician, a distributed
   systems engineer, a Spanish-language editor — and against what published
   standard or result?
2. **State why they would reject the current choice.** If you can articulate
   that reason, the choice is already wrong. Do not ship it and note the
   objection; change it.
3. **Prefer the feasible ideal over the cheap satisfier.** A gate that passes
   because it measures nothing, a selector that resolves because it names
   `body`, a definition that restates its own label — these satisfy the
   constraint and fail the expert. Optimising for the constraint is how a
   codebase accumulates work that looks done.
4. **Research before deciding, not after being challenged.** Where a field has
   a settled answer — WCAG thresholds, reading-rate meta-analyses, Mayer's
   multimedia principles, item-writing guidelines for assessment — find it and
   use it. Where it does not, say so rather than inventing authority.

**Every trade-off is stated to the user, never absorbed.** If the ideal was not
reached, the report says what was traded, why, and what the expert would still
object to. Silence about a known gap is a false claim of completeness. The
same applies to scope: work left undone is named, not omitted.

Particular weight goes to:

- **Methodological and scientific correctness.** Claims about statistics,
  measurement, ML, security or systems behaviour must be true as an expert in
  that field would state them, not merely defensible to a beginner. A worked
  example whose narrative and output disagree is a defect regardless of whether
  any test caught it.
- **State of the art.** Prefer current accepted practice over what merely
  works. Where the repository's existing pattern is behind the field, say so.
- **Usability and intuitiveness of the flow.** A feature a user cannot find,
  cannot reach by keyboard, or reaches only by accident is not finished.
  Walk the actual path a person takes, at the sizes and on the devices they
  use, before calling it done.
- **Quality-of-life.** Defaults that spare a person work, states that survive
  a detour, controls placed where the hand already is. These are part of the
  feature, not polish to be deferred.

**Verification follows the same standard.** A passing gate is evidence only if
it can fail: demonstrate it by breaking the thing it guards and watching it
report. Empty findings prove nothing on their own.

### One failed hypothesis, then research

The first guess about an error is a hypothesis. **If it turns out wrong, stop
guessing and go find out how the error is actually caused and solved** — the
library's issue tracker, its source, the spec, the standard, or the accounts of
people who hit the same message. A second guess costs another edit, another
build and another test cycle, and lands no closer than the first.

The tell is the shape of the reasoning: "it must be X" followed by "then it must
be Y". Each is a fresh story fitted to the same symptom, and neither is evidence.
Prefer the diagnostic that names the cause outright — read the actual error
context, print the real state, dump the element the tool says is intercepting.

Record what the cause turned out to be in the commit message. An error explained
once should not have to be diagnosed twice.

### Tautological tests considered harmful

A test that cannot fail is worse than no test, because it converts an unchecked
area into one that looks checked. Delete or fix them on sight; never add one to
raise a count.

Recognisable forms, all of which have shipped in this repository:

- **Comparing a value to itself.** `digest_a = f"deps:{h}"` next to
  `digest_b = f"deps:{h}"`, then asserting they match — it proves the language
  is deterministic, not that two builds agree.
- **Asserting the shape of a pass.** A probe branch that returns
  `{clipped: [], overlaps: []}` without measuring anything.
- **Matching nothing.** A parser looking for `rgb()` against an `oklch` theme,
  or a term scan whose regex never fires: zero findings reported as zero
  defects.
- **Restating the implementation.** Asserting a helper is called by name rather
  than asserting the guarantee it exists to provide; the test then breaks on
  renames and passes through behaviour changes.
- **A satisfiable-by-degenerate-answer check.** `body` matches exactly one
  element and is an ancestor of everything, so an element-selector test that
  only checks uniqueness and ancestry accepts the useless answer.
- **A copy of the code under test.** A test that re-implements the function so
  it can run in isolation tests the copy; the original changed and the copy kept
  passing.
- **Vacuous truth.** `all()` over an empty list, a subset check against an
  empty allowlist, a loop whose body never executes.

The check to apply before committing any test: **name the change to production
code that would make this fail.** If you cannot, it is tautological. Where the
cost is low, prove it — break the thing, watch the test go red, restore it, and
say so in the commit message.

---

## Release readiness (READY)

Do **not** report READY if any of:

- unapproved deletion  
- learner progress can be lost  
- tests weakened  
- build/type failures ignored  
- mocks on claimed production paths  
- critical E2E flaky  
- live deploy differs from tested SHA  
- core feature has only local evidence  
- a decision fails the expert standard above and the objection has not been
  stated to the user  
- a known gap, unfixed finding, or unmet target is absent from the report  

---

Changes to this policy require independent human or verifier review
(CODEOWNERS).
