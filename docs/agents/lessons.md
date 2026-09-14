# Agent lessons and rationale

Moved verbatim from `AGENTS.md` on 2026-09-14 so the root file can stay short and
command-first. The root keeps every rule as a one-line constraint; this file keeps the
reasoning and the incidents behind them, because a rule without its reason gets argued
away the first time it is inconvenient.

Read the relevant section when a root rule seems wrong for your situation. It is probably
here for a reason that already cost something.

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

### A blocked dependency is a stop, not a retry

If a task or gate needs another service, agent or API and that resource is
unavailable, unstable, rate-limited or out of quota, **stop and tell the user**.
Do not keep calling it, do not work around it silently, and do not let a batch
run to completion against a resource that already refused the first request.

Retrying a blocked resource costs time and quota and produces nothing. Worse, it
buries the real news — that the work cannot be finished right now — under a wall
of identical failures the user has to read to discover it.

What to do instead:

1. **Stop at the first refusal** that is clearly about availability rather than
   about the request: quota, rate limit, auth failure, service down, timeout on
   every call. One retry to rule out a transient blip is fine; a second is not.
2. **Say what is blocked, what it blocked, and what remains undone.** Name the
   sections, files or checks that did not get their answer.
3. **Do not substitute a weaker signal without saying so.** Falling back to an
   older report, a cached result or your own judgement is sometimes right, but
   it is a different kind of evidence and must be labelled as one.
4. **Never report the blocked work as complete.** A gate that could not run is
   not a gate that passed. Counts drawn from a partially-refreshed dataset are
   stale in the parts that were refused, and saying so is mandatory.

This has already gone wrong here: a review batch hit `usage limit` on its first
call and was allowed to run through eleven more identical failures, and the
finding totals were briefly reported as if all sections had been re-reviewed
when twelve still carried data from an earlier run.

### "Shipped" means the content is live, and SHAs do not prove it

Before reporting work as shipped, confirm the change itself is at the deployed
SHA. Check the content, not the commit:

```sh
# Brace the variable. In zsh, "$SHA:AGENTS.md" is not what you wrote:
# ':A' is a parameter modifier meaning "absolute path", so the argument
# becomes <abspath>GENTS.md, git errors, and a piped `grep -c` prints 0 --
# a missing-content result produced by the shell, not by the repository.
git show "${DEPLOYED_SHA}:path/to/file" | grep -q '<the thing you added>'
```

Check the exit status or read the output. A `grep -c` on an empty pipe returns
0 whether the content is absent or the command failed, so a bare count is not
evidence of absence until you have seen `git show` succeed.

Do **not** use `git merge-base --is-ancestor <your-commit> main`. Squash-merge
rewrites history: the branch commit is never an ancestor of the squashed result,
so that check reports "not in main" for work that is plainly there. It fails
open in the other direction too -- an ancestor commit whose change was later
reverted still passes.

This is not hypothetical in either direction. A commit here was pushed to a
branch whose PR had already merged, sat orphaned, and was reported as shipped;
its tooltips and tutorial steps were on no branch anyone would deploy. The
ancestor check was then written as the fix, shipped, and immediately reported
"NOT in main" for the recovered commit that had just been squash-merged. The
first version of a verification is not automatically better than no
verification -- test the check itself against a case whose answer you know.

A second signal is worth naming: **an unexplained change in a test count is
evidence, not noise.** The node suite went 237 to 236 between two runs here.
The preservation sentinel showed no deletions, so it was written off as a
misread. The real cause was that the branch under test no longer contained the
commit that added the missing test -- the orphan, visible an hour before it was
found.

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
- work is reported as shipped without confirming the **content** is present at
  the deployed SHA  

---

Changes to this policy require independent human or verifier review
(CODEOWNERS).

---

## chore(lint): cyclomatic complexity ceiling

**Ceiling: 15.** Enforced by `node scripts/complexity_gate.mjs`.

McCabe's original guidance puts 10 at the edge of what one reader holds in mind at
once; most TypeScript/React codebases settle at 15. This repository's worst function
scores 90, so a hard ceiling applied today would block every change and be switched
off within a week — which is how complexity limits usually die.

So the ceiling is real and the enforcement is directional. The number of functions
above 15, and the worst score, may fall and may not rise:

```bash
node scripts/complexity_gate.mjs            # fails if complexity grew
node scripts/complexity_gate.mjs --update   # re-baseline after reducing debt
```

Baseline lives in `audit/fixer/complexity_baseline.json`. At the time of writing: 34
functions above the ceiling, worst 90 (`components/course/Dashboard.tsx`).

**New code meets 15.** A function that would exceed it gets split before it lands —
not silenced with a disable comment. When a change pushes the count up, the fix is to
split the new function or reduce debt elsewhere first, and the gate says which
functions are worst so the choice is informed.

**The trade-off, stated:** a ratchet tolerates existing debt indefinitely if nobody
touches it. It buys enforceability at the cost of never forcing the 90 down. Reducing
`Dashboard.tsx` is real work that this gate schedules but does not do.
