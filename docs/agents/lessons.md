# Agent lessons and rationale

Moved verbatim from `AGENTS.md` on 2026-09-14 so the root file can stay short and
command-first. The root keeps every rule as a one-line constraint; this file keeps the
reasoning and the incidents behind them, because a rule without its reason gets argued
away the first time it is inconvenient.

Read the relevant section when a root rule seems wrong for your situation. It is probably
here for a reason that already cost something.

## Delegating to subagents: the model ladder

Any session that hands work to Claude subagents follows [`model-ladder.md`](model-ladder.md):
start on Haiku, hand a task up to Sonnet and then Opus only on verified failure, stop (never hand
up) on a usage limit, an abort or an empty result, and verify one level above the drafter. Its
reusable workflow script, recreation tests and ledger are in [`model-ladder/`](model-ladder/).

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

### Pre-execution and red-team rounds

Design by comparison, not by the first idea that works. Before building, write
down at least two routes and run each at the smallest scale that separates
them: a spike, a probe against the real page, a measurement on real content.
Judge them against the expert benchmark above, choose, and record the routes
rejected with the reason, so the next reader does not re-litigate them.

Then attack the choice before it ships: hostile and malformed input, the path a
confused learner takes, small screens and keyboard-only use, and every other
place in the repository that shares the same root cause. A finding that recurs
elsewhere is fixed as a class. (Worked example: PR #169 compared per-block,
per-topic and per-subtopic theory checkpoints, and a browser walk then found
three defects the unit tests could not see.)

### Simulate drift before it happens (retrospective, PR #169)

Every defect found in PR #169 after its first push had the same shape: the new
code was right for today's content and today's files, and something else moved.

| What happened | Root cause | What now prevents the class |
|---|---|---|
| CI's static journeys failed twice after every gate in "Done means" had passed | The browser journeys ran only in CI; nothing local could run them without `playwright install` | `npm run test:static-journeys` (same build, server and specs as CI), `PW_CHROMIUM_PATH`, listed in "Done means" |
| A second `[data-section-id]` element made QA reports ambiguous | A consumer selected by a generic attribute, not by the element it meant | `QAFooterBridge` selects the section root by name; a test forbids the attribute elsewhere |
| The URL effect rewrote `#S05` to the slug | A "normalising" write changed a value another feature captures | The effect writes only the tab suffix; the journey spec guards it |
| The ← button covered «Recursos» | The sidebar width lived in `page.tsx` and its offset in another file | A test reads both and fails with both numbers |
| An inserted lead-in would have renamed a part (`…#2`) and orphaned its checkpoint | Grouping depended on block adjacency, which content rounds change weekly | Found by simulation, fixed, and the simulation is kept |
| A tag in a new format made the checkpoint button a silent no-op | A validator pinned to today's id format, failing closed without a word | Any plain token is accepted; a refused key logs which key and section |
| Two older tests pinned source text and broke on a refactor | Tests asserting how the code is written | Listed under tautological forms: "Restating the implementation" |
| `e2e_max/13` had been failing before it reached its subject, and `e2e_max/02` failed on all 52 sections | A spec no CI job runs rots unnoticed: a first-visit modal took every click | The four specs that run on the static build are a CI step (`npm run test:lesson-e2e`); the modal is dismissed once, in the suite's config |
| The storage list a learner reads did not name the checkpoint record | The test that guards the list scans two folders, and the new key lived in a third | The key is listed, and its own test fails if it leaves the list |

The rule: when code reads lesson content or a value owned elsewhere, write the
simulation with the feature. Take the real 52 sections, apply the edits a
future round will make with a seeded generator (so a failure reproduces), and
assert what must survive: nothing lost, nothing invented, saved learner state
still meaningful. `src/lib/course/lesson-navigation-drift.test.ts` is the
worked example; it found two defects in code whose unit tests were green.

Still undone, named: the other `scripts/e2e_max/` specs (exhaustive shards,
admin and student flows) need the dynamic app and its accounts and are run by
no CI job.

### Fail loudly, with a diagnosis

A failure is only useful if the person reading it can act without re-running
anything. Every test, gate and script reports:

- **what** failed, in the words of the defect it guards ("the sanitizer drops
  S01-T1-B#2"), not just "assertion failed";
- **where**: file and line, id, URL or section;
- **expected against actual**, both printed;
- **the likely cause or next step**, when known.

A gate whose preconditions do not hold prints `REFUSED` with the reason and
exits non-zero; it never reports a pass it did not measure. Silent fallbacks,
bare `assert x`, `catch {}` on a claimed path, and logs that say "error" with
no subject are defects in their own right.

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

## Traps of the Claude Code cloud sandbox, and how to avoid them (Sesión 0, 5–6 Oct 2026)

Each one cost at least one failed attempt while building `/empezar`; several recurred. Root cause
first, then the fix that worked.

- **`bun install` fails with 403 on every tarball.** `bun.lock` pins tarball URLs to
  `registry.npmjs.com`. The sandbox proxy lets `registry.npmjs.org` through and refuses the `.com`
  alias. Fix: back up `bun.lock`, rewrite `registry.npmjs.com` to `registry.npmjs.org` in it, run
  `BUN_CONFIG_REGISTRY=https://registry.npmjs.org bun install --frozen-lockfile`, then copy the
  backup back. Check `git status` shows `bun.lock` unchanged. Never commit the rewritten lockfile.
- **`pkill -f <pattern>` kills your own shell** when the pattern also appears in the command line
  that runs it (AGENTS.md already warns about `pgrep -f`). It struck again with
  `pkill -f serve.mjs`, and the background job died with exit 144. Fix: keep the PID when you start
  a process (`cmd & echo $! > pid`) and `kill "$(cat pid)"`.
- **Top-level `await` in a `.mjs` script breaks the unit tests that import it.** `node --import
  tsx` loads an imported `.mjs` as CommonJS, and esbuild refuses top-level await in CJS. `npx tsx -e`
  evals are CJS too. It struck twice (`scripts/setup_screenshots.mjs`, the prose-audit dump). Fix:
  end a script with `main().catch(…)` behind an "am I the entry point" check, and use static
  imports in `tsx -e` code.
- **A scratch script outside the repo cannot import `playwright`.** Node resolves packages from the
  script's own directory upwards, and the scratchpad has no `node_modules`. It struck three times.
  Fix: write throwaway scripts into the repo (`scripts/.name.mjs`, deleted after use), or run them
  with the repo as the working directory and an absolute import path.
- **Images from `raw.githubusercontent.com` can be 130-byte text files.** Repositories that keep
  images in Git LFS (`microsoft/vscode-docs`) serve a pointer there. Fix: fetch
  `https://media.githubusercontent.com/media/<owner>/<repo>/<branch>/<path>`, and check every
  download with `file` before using it.
- **Most documentation websites are blocked, their source repositories are not.** python.org,
  docs.github.com, learn.microsoft.com, code.visualstudio.com and git-scm.com refused the proxy
  CONNECT; `git clone`, raw GitHub and the LFS media host worked. Read the docs and the programs'
  own strings (installer `.wxl`, `gh` Go sources, Git's `po/es.po`) from GitHub instead of
  guessing, and mark anything read only from a search snippet as such.
- **A bare `npx tsc --noEmit` does not know `import x from './a.png'`.** Next's image module types
  come from `next-env.d.ts`, which is generated and gitignored. Fix: `src/types/next-image-types.d.ts`
  references `next/image-types/global`.
- **A chained gate hides everything after its first failure.** `npm run test:ux-gates` stops at
  `test:first-use-all`, which fails before any change of yours. Run the rest one by one before
  reporting, and compare each failure with a clean worktree of the base commit before calling it
  pre-existing.
- **A ratchet gate that is already red stops being read.** `complexity_gate.mjs` failed from 5 Oct
  (34 against a baseline of 33), and every later round reported it as "pre-existing". Root cause,
  found by diffing the offender lists at the baseline commit and at HEAD: `QATour` reached 18 in
  `ac4f4ad`. When a gate is red at base, name the function and the commit, so the red gets fixed
  instead of inherited.
- **`npx playwright test` reports every test failed when Playwright cannot find its own Chromium
  build.** The repo's `@playwright/test` wants `chromium_headless_shell-<rev>`, which the sandbox
  does not have. Fix: a throwaway config that spreads `playwright.config.ts` and sets
  `use.launchOptions.executablePath: '/opt/pw-browsers/chromium'`. Read the first error before
  counting failures: "11 failed" was 11 launch errors and zero findings.
- **Codex in the cloud sandbox: device sign-in, once the hosts are allowed.** `npm i -g
  @openai/codex` works, because the npm registry is reachable. A sandbox has no browser for the
  default `codex login` and its `localhost` callback, so use `codex login --device-auth`: it
  prints a URL and a one-time code, and the owner approves on any device. The alternative is
  `printenv OPENAI_API_KEY | codex login --with-api-key`, with the key stored as an environment
  secret and never pasted into chat. Both need `auth.openai.com`, `api.openai.com` and
  `chatgpt.com` in the environment's allowed domains. On 6 Oct 2026 they were refused
  ("error sending request for url (https://auth.openai.com/api/accounts/deviceauth/usercode)").
  Codex then runs under the same network policy as Claude, so it can fetch only what the sandbox
  can reach.
- **A network allowlist change is not instant, and it belongs in the environment.** The
  claude.ai account setting (Settings → Capabilities → Domain allowlist) does not govern Claude
  Code cloud sessions; the environment's own Network access setting does. After the environment
  changed, curl passed within minutes while Chromium still got "Host not in allowlist" once. Retry
  a refused capture once before calling it blocked. GitHub separately serves a bot-protection page
  to automated browsers; capture GitHub's own pages by hand rather than working around it.

## Proposal 10 section fixes: errors met and how they were closed (S04–S13, 17–19 Nov 2026)

Each entry gives the symptom, the root cause, the fix, and the guard that stops it from coming
back. Read this list before a section round; every item cost at least one failed run.

- **An exercise passes the wrong answer it exists to correct.** Symptom: 13 S07 We Do exercises
  printed the expected output with `lower` where `casefold` is taught, with `search` where
  `fullmatch` is taught, without `\b`, or without NFC. Root cause: each exercise checked only
  the easy input, so its expected output did not separate the right answer from the wrong one.
  This is a weak test oracle: the test runs the code but checks too little to notice a fault.
  Mutation testing measures exactly this ([Schuler & Zeller, ICST 2011, "Assessing oracle
  quality with checked coverage"](https://www.st.cs.uni-saarland.de/publications/files/schuler-icst-2011.pdf)).
  Fix: add the input where the two answers differ (`straße`/`STRASSE`, `LIMA`, a ten-digit run,
  `lim-02`, an NFD pair, an empty side, `Ana Ana`/`Ana` scored 1.0). Guard: for every
  exercise, plant the wrong answer in the reference solution and require the pinned output to
  change (`MUTANTS` in `tests/adversarial/test_proposal10_s07.py`). Also confirm each starter
  prints something other than the pin.
- **`repr` hides the bug a Unicode exercise teaches.** `repr('José')` and `repr('José')`
  both print `'José'`, so the learner cannot see why `==` fails. Fix: print `ascii()`, which
  escapes non-ASCII characters (`'Jos\xe9'` versus `'José'`); see the
  [`ascii` built-in](https://docs.python.org/3/library/functions.html#ascii). Guard: a mutation
  that drops NFC must change the output.
- **A local fix created a contradiction elsewhere.** Patching the S07 particle counterexample to
  "accept exactly three tokens" contradicted T1-B, where `María del Carmen Quispe Ríos` is ok.
  Root cause: the finding was fixed inside one block without searching the section, the We Do
  and the exam bank for the same rule. Fix: one rule everywhere (fewer than three tokens, or a
  particle among the last two, goes to review). Guard: `test_two_tokens_go_to_review_everywhere`
  reads the theory, the We Do and the bank together. Before you change a rule, grep for every
  place that states or runs it.
- **"Earlier sections use it" is not evidence that a construct is taught.** S02 contains
  `__name__` 51 times, yet `test_forward_dependencies` (D9) holds the entrypoint idiom until S10
  teaches modules. Those S02 hits are owed debt in the ratchet, not teaching. Adding
  `if __name__ == "__main__":` to the S07 You Do broke D9. Beginners find this idiom confusing
  before they import their own modules (see the [python-dev discussion of a beginner-friendly
  alternative](https://discuss.python.org/t/built-in-is-main-function-as-a-more-beginner-friendly-alternative-to-if-name-main/18570)).
  Fix: tests are plain `assert` lines at the end of the file. Guard: before you introduce an
  idiom, check `D9_OWED`/`D10_OWED` in `tests/adversarial/test_forward_dependencies.py`.
- **A rewritten retrospective lost its required shape.** `test_s07_text_first_quality` requires
  each We Do retrospective to name a cause (`porque`, `causa`, …) and a transfer (`transfiere`,
  `aplica`, …). A clearer rewrite dropped both words. Fix: keep one causal clause and one
  transfer sentence. Guard: run the section's own quality tests after any retrospective edit.
- **A docstring rewrite broke an exact-string test.** `test_you_do_places_review_state_in_the_return_contract`
  asserts the one-line docstring `"""→ {raw, normalized, transforms, status, review_reasons}."""`.
  Fix: keep that line and put extra guidance in comments. Guard: `grep -rn` the old text in
  `tests/` before you change any starter line.
- **Anchors schema field guessed instead of read.** The ledger script used `['fingerprint']`; the
  anchors file stores `['sha256']`. Fix: read one record before writing code against it.
- **A hint that is a prefix of a `hints` entry matched twice.** `P.rep` asserts an exact count,
  so the patch stopped. Fix: replace `hint:` first, or anchor on the full line.
- **A mutation test that changes nothing proves nothing.** An S06 test used an input where both
  answers agreed. Fix: `caught()` raises on a no-op mutation, and each suite has an irrelevant
  edit that must not be caught.
- **Ledger conflicts on every merge.** Each section PR appends rows to the same JSON list. Fix:
  after `git merge origin/main`, rebuild the rows with the renumber script (main's rows, then
  this branch's new rows from main's max). Never hand-edit row numbers.
- **The strict output audit runs longer than a default 120 s tool timeout.** It is not stuck.
  Run it with a 590 s timeout and read its summary line.
- **Codex review is rate-limited.** On #162 the Codex bot reported "usage limits" and no review.
  This is a blocked dependency: report it, do not retry it, and do not treat it as a pass.
- **S08: a step-bounds helper matched the wrong exercise when `id` came before `subtopicId`.**
  The patch helper `rex()` located an exercise by searching backwards for `subtopicId:`, but
  half of the S08 We Do steps list `id` first, so the window covered the previous exercise and
  the replacement found nothing. Root cause: the helper assumed a key order that TypeScript
  object literals do not guarantee. Fix: bound a step by the object braces (`\n      {\n` to
  the next one or the closing `],`). Guard: the helper asserts an exact count, so a wrong
  window stops the patch instead of editing a neighbour.
- **S08: `tell()` works on `io.StringIO` but fails on an open file inside a `for` loop.** The
  theory recovers `raw` with `stream.tell()` on a `StringIO`. A learner who copies it to
  `open(path)` gets `OSError: telling position disabled by next() call`. Root cause:
  `TextIOWrapper` disables `tell()` while it iterates by line, because its read-ahead buffer
  makes the position ambiguous ([bpo-37036](https://bugs.python.org/issue37036),
  [Stack Overflow 49785865](https://stackoverflow.com/questions/49785865)). Fix: the theory and
  the You Do say to read the file with `read_text` and walk the text with `StringIO`. Guard:
  `test_proposal10_s08.test_the_tell_trap_is_real` runs the failing case, so the warning stays
  true.
- **S08: an mtime check can pass by accident on a coarse clock.** Comparing `st_mtime_ns` of a
  file and its `write_bytes` copy can be equal when both writes land in the same kernel clock
  tick (Linux file timestamps use a coarse clock). Fix: the fixture sets a fixed past mtime
  with `os.utime(..., ns=...)` before the copy, so only `shutil.copy2` keeps it. Guard: the
  `write_bytes` and `shutil.copy` mutants in `test_proposal10_s08` must be caught.
- **S08: "never trim the key".** EXAM-04's finding suggested shortening the keyed option, but
  `test_exam_length_cue` says to lengthen the distractors instead, and a trimmed key stayed the
  longest anyway. Fix: keep the key's wording, lengthen the three distractors with plausible
  wrong reasons, and lower `LONGEST_IS_CORRECT_OWED` by one. Guard: read the ratchet's message
  before following a finding's suggested fix.
- **S08: an exit-1 demo that the inputs cannot produce.** With correct loaders, `n_in` always
  equals `n_clean + n_quarantine`, so the You Do's "broken counts → exit 1" could not be shown,
  and `try/except` is held until S09 (D10). Fix: a `DEMO_RECONCILE_ROTO` flag passes a
  hand-written broken source to `build_manifest`; the uncaught `ValueError` makes Python exit
  with code 1, which S01 teaches the learner to read with `echo $?`. Guard:
  `test_the_exit_1_demo_exits_1_before_running`, with the flag-off run as the negative control.

- **S09: a rewritten option list moved the answer away from `correctIndex`.** Symptom: self-check
  q7 ("¿Por qué es dañino un `except:` bare?") marked "se salte el bloque finally" correct.
  Root cause: the old options ended with the key at index 3; the rewrite kept the key text but
  put a new distractor after it, and `correctIndex: 3` was not touched. The length-cue test
  caught it only by luck (the wrong "key" was longest). A miskeyed item is the first flaw item
  writing guides check for ([Haladyna, Downing & Rodriguez 2002, "A review of multiple-choice
  item-writing guidelines"](https://doi.org/10.1207/S15324818AME1503_5); the [RSC item-writing
  flaws instrument](https://pubs.rsc.org/en/content/articlehtml/2019/rp/c8rp00262b)). Fix: put
  the key back at its index. Guard: `test_rewritten_options_keep_the_answer_key` pins every
  rewritten question's key text, and a diff script compares each key with `origin/main`'s key
  (only intended rewrites may differ). Run that diff for the self-check and the exam bank after
  any option edit.
- **S09: a key and a distractor tied for longest.** Lengthening distractors to beat the length
  cue can land exactly on the key's length; `assertLess` treats a tie as a cue. Fix: lengthen the
  distractor further. Guard: the per-question `assertLess` in the section test.
- **S09: a count in the instructions went stale after the output grew.** T4-A-E3 gained three
  cases but its `tests` text still said "4 líneas". Root cause: the output changed and only the
  preamble was updated. Fix: "7 líneas". Guard: run every We Do and I Do solution and compare
  each "N líneas"/"seis líneas" claim with the real stdout line count before committing
  (read the context: "tres … y tres" is six).
- **S09: the prose baseline in `course-state/prose_quality_report.json` on main was stale.** It
  showed 6,395 words for S09; a fresh run on `origin/main` gives 7,686 and 16 long sentences.
  Comparing against the stale file hides or invents regressions. Fix: regenerate the baseline in
  a detached `origin/main` worktree (`course_event_extractor` then `prose_quality_audit.py S09`)
  and compare against that. When a split puts a `snake_case` identifier at the start of a
  sentence, lead with a noun ("Los casos una_fila_data…"); never capitalise the identifier.

- **S10: one config contract told two ways.** Symptom: the theory said `ingest` needs
  `input_path`, while the `validar_tarde` demo failed with `KeyError: 'manifest_path'` on
  `ingest`. Root cause: the demo was written for a different subcommand and the error text was
  never checked against the contract paragraph. Fix: the demo now runs `report`, so the contract
  is single (`ingest` → `input_path`, `report` → `manifest_path`). Guard:
  `test_one_contract_per_command` requires the same command-to-key mapping in all three blocks
  that state it, and the demo's output to name `report`.
- **S10: a You Do whose invariants had no test.** The brief asked for exit 2 on a bad flag and
  for an import that prints nothing, but the shipped suite tested neither, so a package that
  printed on import passed. Fix: `InvariantTests` in starter and solution. Guard: the section
  test builds a package that prints on import and requires the suite to fail on it (negative
  control), and requires it to pass on the clean solution.
- **S10: demos used an API the course had not taught.** `redirect_stdout`/`redirect_stderr`
  appeared in three demos with no explanation. Fix: a one-sentence gloss at each first use in a
  block, because a learner may open any block first. Guard: before adding a stdlib helper to a
  demo, grep the earlier sections for it; if absent, gloss it where it is used.
- **S10: patch anchors matched the wrong copy.** New preambles quoted the demo's output, so an
  anchor like the output string matched twice, and a bare `"feature"` inside a TS
  double-quoted string broke the parse. Fix: anchor outputs with the `output: ` prefix, write
  quotes as `\"` (in a Python patch source, `\\"`), and let the patch helper assert the count.
- **S10: `meta_leaks` counts the Spanish word "todo".** `prose_quality_audit.py` compiles its
  leak pattern with `re.I`, so "si todo sale bien" scores as a `TODO` leak; S10 went from 6 to 8
  this way, with no real leak. Not fixed here (the audit is outside the section's scope). Guard:
  when `meta_leaks` rises, list the matches before rewording; never reword correct Spanish to
  satisfy a false positive. The fix, when scheduled, is to drop `re.I` for `TODO|FIXME`.
- **S10: a correct gloss moved three concept ratchets.** Naming `contextlib` in the S10 demos
  matched an alias of `context-manager`, which then reached three sections (S09, S10, S38) and
  became load-bearing: figure target +4, figure debt +4, one more D3 offender, and one fewer
  unexemplified concept. Root cause: not a regression; the dependency was real and had been
  invisible. Fix: raise `FIGURES_OWED`, `FIGURE_TARGET_FLOOR` and `D3_SUBTOPIC_OWED` with a dated
  line, and lower `UNEXEMPLIFIED_CONCEPTS_OWED`, on the proposal 05 `f-string` precedent. Guard:
  when a ratchet in `test_concept_depth_ratchets` moves, diff `build_concepts` output between
  `origin/main` and the branch before deciding; never drop the term to make the count fall back.

- **S11: one class name, three shapes.** `Transaction` had four fields in the We Do and the You
  Do, three in a theory counterexample and in T1-B-E1; `ResolvedEntity` had one, two or a
  document field depending on the block. A learner who copied one block and called it as another
  got a `TypeError`. Root cause: each block was written on its own, and nothing compared class
  definitions across a section. Fix: one field list per class (the date exercise T2-A-E2 is
  exempt and named). Guard: `test_one_shape_per_class` parses every `class X` body in theory,
  demos, starters, solutions and the You Do starter.
- **S11: a warning about a failure the default code does not produce.** The theory warned that
  a mutable entity's hash "changes" in a dict; a plain `@dataclass` (eq by fields, not frozen)
  has `__hash__ = None`, so the learner meets `TypeError: unhashable type` instead
  ([Python docs, dataclasses: `unsafe_hash` and `eq`](https://docs.python.org/3/library/dataclasses.html#dataclasses.dataclass)).
  Fix: the block runs the plain dataclass first and prints the real error; the changing hash is
  named only for a hand-written `__hash__`. Guard: run the warning's own case before writing it.
- **S11: an oracle that says "solo si todo está correcto" and is not.** The You Do `test_domain`
  printed `tests_pass` for six variants that break stated requirements (blank ids with spaces,
  three decimals, the same id on both sides, exclusive bounds, `is_fraud` on a class). Fix:
  cases for each. Guard: `YouDoOracleIsHonest` builds a reference from the starter's TODOs,
  requires it to pass, and requires each of the six mutants to fail.
- **S11: an exam item on a technique no lesson showed.** EXAM-23 asks how to make a test
  deterministic when a service needs the time and a new id; the theory only said "sin reloj de
  red". Fix: a counterexample block (`reloj_inyectado.py`) that injects the clock and the id
  generator, after S09's injected clock. Guard: when an exam item's key names a technique, grep
  the section's theory and demos for it before closing the bank.
- **S11: splitting long sentences after the main baseline showed 0.** Main had no sentence over
  32 words in S11; the glosses this round added nine. Fix: split them before the PR (0 again).
  Guard: compare against a fresh baseline every round, even for a section that was clean.
- **S10/S11: "never the longest" moved the length cue instead of removing it.** The S10 round
  gave every item a distractor longer than the key, so the key became second-longest on 17 of
  24; the strategy simulation showed "pick the second-longest" passing that bank for 100% of
  simulated learners (S11's first pass: 36.5%). It went unseen because S10 was already on the
  owed list for that strategy. Root cause: the fix targeted one strategy, not the cue. The
  item-writing guideline is homogeneous option length, which means no rank the key prefers
  (Haladyna, Downing & Rodriguez 2002, "A review of multiple-choice item-writing guidelines",
  guideline on option length). Fix: spread the key's length rank (S10 now 3/7/7/7, S11 4/6/7/7,
  no rank above 7 of 24, no ties), with three S10 keys longest again on purpose. Guard: the
  section tests assert the spread, not "never longest", and the owed lists in
  `exam-strategy-simulation.test.ts` are re-read after every bank change; a bank leaving an owed
  list must not join another.
- **S11: `*args` in a test loop tripped the first-use gate.** `RelationshipEvidence(*args)`
  inside `test_invalid_evidence_is_rejected` is the `args-y-kwargs` concept, which the course
  teaches later, so `test:ux-gates` reported a first use without gloss. Fix: unpack in the loop
  header (`for left_id, right_id, score in ...`) and pass the three names. Guard: in a demo, call
  with named values; reach for `*` only after the section that teaches it.
- **S12 (P1): a sentence that credited `executemany` with the rollback.** The theory said
  `executemany` with `BEGIN`/`COMMIT` makes a batch atomic and a broken `UNIQUE` gives
  `COUNT(*)==0`. In fact the rows before the failing one stay in the open transaction; only the
  explicit `rollback()` removes them, and the count returns to the count before the batch, not
  to 0 ([Python docs, sqlite3: transaction control](https://docs.python.org/3/library/sqlite3.html#transaction-control)).
  Root cause: the demo's table started empty, so "0" and "the count before" looked the same.
  Fix: the block now runs the batch with and without `rollback()` and prints `2` for the second;
  the self-check key says "conteo previo al lote". Guard: when a lesson states a guarantee, run
  the case where the guarantee's cause is removed and print what happens.
- **S12: a constant printed as if it were measured.** `print("token_logged", False)` and
  `print("pages_fetched", 3, ...)` showed a security property and a count that no code checked.
  Fix: compute both (`token in linea`, a page counter). Guard: the section test plants the leak
  (the token in the manifest) and the missing counter, and requires the output to change.
- **S12: "a hash dumps no PII".** A 12-hex SHA-256 of `{"entity_id": "C001", ...}` was reversed
  by trying 999 ids and three signal lists. Hashing a low-entropy value is pseudonymisation, not
  anonymisation ([FTC, "No, hashing still doesn't make your data anonymous", July 2024](https://www.ftc.gov/policy/advocacy-research/tech-at-ftc/2024/07/no-hashing-still-doesnt-make-your-data-anonymous)).
  Fix: the demo says the hash proves integrity only. Guard: before calling a hash anonymous, count
  the possible inputs; if they can be listed, so can the hashes.
- **S12: two names and three shapes for one contract.** The geo signal key was `verdict` in a
  demo and `kinship_verdict` elsewhere; the geocoder contract was `{lat, lon, label}`,
  `{lat, lon, provider}` and `{lat, lon}`; the provider was `mock` and `authorized_mock`; the
  synthetic cities were Lima/Quito in code and Quito/Santiago in titles. Root cause: the same
  failure as S11's "one class, three shapes", at the level of dict keys. Fix: one name each.
  Guard: `test_one_contract_one_key_one_provider` and `test_one_city_list`.
- **S12: money stored as `REAL`.** The case join used `amount REAL`, the float S02 warns
  against. First fix was integer cents; the owner asked (2026-11-19) whether `Decimal` is taught
  by then. It is: S02 teaches it for soles and S11 reuses it, so S12 stores the amount as `TEXT`,
  writes `str(Decimal(...))` and reads it back with `Decimal(text)`. SQLite has no decimal type,
  and `SUM` over a `TEXT` column converts to float, so the sum runs in Python
  ([SQLite: datatypes](https://www.sqlite.org/datatype3.html)). A counterexample block shows all
  three lines. Guard: before choosing a representation, grep the earlier sections for the type
  the course already uses, and keep it; name the alternative (integer cents) in one sentence.
- **S12: exercises that printed only the cases a wrong answer also passes** (16 of 24). The
  pattern is the one S10 and S11 met: the Límites named a rule (no 500 retry, empty token fails,
  NOT NULL, exact index column) and no printed case exercised it. Guard: for each Límites line,
  name the printed case that fails without it; if none, add one, and plant the mutant in the
  section test.
- **S13: two contracts for one missing input.** A pair with no document got `None` in
  `er_rules.py` ("falta evidencia"), 0.0 in the counterexample and 0.0 in the exercise. The two
  answers mean different things: 0.0 says "different people" and sends the pair to `abstain`;
  `None` says "no data", and `decide_ops_status` sets it apart as `invalid_input`. Root cause:
  each block was written to pass its own output, and nothing compared the blocks. Fix: `None`
  everywhere, with a fourth printed case (A-E) in the exercise. Guard: before changing a
  contract, grep every block of the section for the same input, and add the case to the exercise
  that teaches it. The same check found `auto_fraud False` printed by the theory while the next
  exercise deleted the key; the forbidden keys are now absent and asserted absent.
- **S13: a signal named for what it was meant to measure.** `surname_jaccard` computed the
  Jaccard of the full name, so a learner who built the surname-only score got 1/3 where the text
  said 0.2. Fix: rename to `name_jaccard` in theory, exercises and the You Do. Guard: name a
  value after its input, and test that the old name is gone (`test_one_name_for_the_name_signal`).
- **S13: a test harness that prepended code before `from __future__ import annotations`.** The
  You Do now reads `--synthetic` with argparse, and the probe runs code under `python -c`, where
  `sys.argv` is `['-c']`. Prepending `sys.argv = [...]` gave `SyntaxError`, because a future
  statement must be the first statement of a module
  ([Python reference: future statements](https://docs.python.org/3/reference/simple_stmts.html#future)).
  Without the flag, argparse exits with status 2 by raising `SystemExit`, which derives from
  `BaseException`, so the probe's `except Exception` did not catch it and the probe process died
  ([argparse: exiting methods](https://docs.python.org/3/library/argparse.html#exiting-methods),
  [SystemExit](https://docs.python.org/3/library/exceptions.html#SystemExit)). Fix: insert the
  argv line right after the future import; the new section test runs the file the way the
  runbook says (`python -m demo_n1_dashboard --synthetic` in a temporary directory) and checks
  exit code 2 without the flag. Guard: inject into a module after its `__future__` line, never
  before; test a CLI as a subprocess, not through `exec`.
- **S13: the length-cue ratchet and the per-rank cap pull against each other.** The bank had
  ties and 9 of 24 keys at rank 4. Spreading them first put 6 at rank 1, and
  `test_exam_length_cue` failed: the course-wide "key is longest" count may fall but never
  grow (1018 → 1022). With rank 1 held at 2, the other ranks carry 22 keys, so one holds 8.
  Fix: plan rank 1 first, then spread the rest (2, 7, 8, 7); the section test allows 8 and says
  why. Guard: run `test_exam_length_cue` right after any bank rebalance, before the full gates.
- **S13: a test that parsed the starter up to a named function.** `test_proposal10_p1` read
  `PAIR_CASES` up to `"\ndef main"`; adding `parse_args` between them broke `literal_eval`.
  Fix: cut at the next top-level `def`. Guard: parse a literal up to the next top-level
  statement, not up to a function that happens to follow it today.
- **S13: a rewritten self-check moved a key out of its position cycle.** Each section's
  self-check keys follow a fixed position cycle (`scripts/rebalance_selfcheck_positions.mjs`,
  checked by `test_selfcheck_position_bias`); S13 expects `0, 2, 3, 1` repeating, so question 9
  must keep its key at index 0. Writing new options put it at 2. A new outcome also wrote
  "(ER)", an alias of the glossary term `entity-resolution`, before the theory defines it, and
  `test_surprising_uses_ratchet` caught it. Guard: after rewriting a self-check, keep each
  `correctIndex` as it was and reorder the options around it; after editing outcomes, run
  `test:ux-gates` and grep the glossary aliases (`src/lib/glossary/terms.ts`) for any
  abbreviation you added.

## Proposal 11: capstones and badges, errors met and how they were closed (21 Nov 2026)

- **A generator that is re-run undoes hand fixes.** Symptom: re-running
  `course-state/capstones/_generate_formal_packages.py` replaced CP-N1-A's `demo.py` with the
  pre-#141 version (155 diff lines). Measured on a copy, the two generators together change 2 to 9
  committed files in every other package too. Root cause: #141 marked CP-N1-A as hand-maintained
  in only one of the two generators (`scripts/enrich_capstone_packages.py`), and nothing compared
  generator output with the tree. Packages were edited by hand after the last generation, so the
  generator stopped being the source without anyone saying so. Fix: one shared list,
  `course-state/capstones/HAND_MAINTAINED.json`, read by both scripts; both refuse to run without
  `--overwrite-hand-edits`; `tests/adversarial/test_capstone_generators_hand_maintained.py` runs
  them on a copy and asserts the listed packages are byte-identical. Guard: when you hand-edit a
  generated file, add its package to the list in the same commit, or delete the generator path for it.
- **A green execution record without evidence.** `execution.json` said `tests_pass: true` for
  CP-N1-B and CP-N1-C, whose tests were five `assert True  # placeholder` and a demo exit check.
  Root cause: the record ran the suite and trusted its exit code, and a placeholder cannot fail.
  Fix: `execution_record` counts placeholder bodies and records `tests_pass: false` while any
  remain; `INDEX.json` follows the record. Guard: a check that cannot fail is a failed check;
  count placeholders, and prove each suite red on a mutant.
- **Moving a learner file can silently narrow a scan.** Symptom: none, which is the danger.
  `test_forward_dependencies.py` scans capstone starters at `STARTER/*.py`; proposal 11 moved
  CP-N1-A's starter to the package root, and the scan would have stopped reading it while still
  reporting clean. Its own coverage test (`test_every_capstone_starter_is_scanned`) compares the
  scan with the same glob, so it would have agreed. The move also tripped the preservation
  sentinel: `git diff --diff-filter=D` reports a rename as a deletion when the new content is
  under git's 50% similarity threshold (an 8-line stub became a 96-line scaffold). Fix: the
  learner's file stays at `STARTER/cp_n1_a.py`; only the reference moved. Guard: before moving a
  file, `git grep` its directory name in `tests/` and `scripts/`, check every glob that names it,
  and run `npm run test:preservation` after committing (it diffs commits, not the index).
- **A test suite that imports the answer by default certifies no work.** CP-N1-A's tests
  defaulted to `demo.py` (the reference) and its starter README said "run the tests", so an
  untouched starter passed 11 of 11. Root cause: the default served the maintainer, who runs the
  reference, rather than the learner. Fix: the default target is the learner's `cp_n1_a.py`;
  `CAPSTONE_TARGET=reference` selects the reference; the execution record and CI both require the
  untouched starter to fail. Guard: for any starter, run its checks with no work done and expect
  red.
- **A design written from the capstone's files can contradict the section it closes.** Proposal
  11 gave CP-N1-B a schema (`id,name,email`; `tx_id,...,date`) taken from its old brief. S08's
  You Do already specifies CP-N1-B in full: `id,nombre,monto`, `id,client_id,monto`,
  `{raw, record_number, reason}`, a manifest reconciled per source, and a `uuid4` `run_id` per run.
  Following the proposal literally would have made the capstone disagree with the lesson the
  learner just finished. Root cause: the proposal read the package, not the section. Fix: the
  rebuild follows S08 and the PR names the deviation. Guard: before designing a capstone, read
  the You Do of its closing section (`grep -n "cierre CP-" src/lib/course/sections/`).
- **"Idempotent" and a per-run id pull in opposite directions.** The old brief wanted "rerun →
  same manifest hash"; S08 wants a new `run_id` on every run, inside the manifest. Both hold once
  idempotency is stated over the outputs and `sources` (hashes and counts), with `run_id` set
  aside; the brief now answers "¿por qué cambia el manifest si los datos no cambiaron?".
- **Served copies drift silently.** `public/capstones/CP-N1-A_RUBRIC.json` (served to learners
  by `CapstonesPage.tsx`) had differed from the package rubric since #141; only the brief copy
  had been updated. Fix: each CP-N1 contract test asserts both public copies equal the package
  files. Guard: `ls public/capstones/` lists every served copy; update all of them.
- **A meta-test regex that drops digits.** `impl\.([a-zA-Z_]+)` read `impl.sha256_file` as
  `sha`, so "the starter declares every function" failed for the wrong reason (it would also
  have passed wrongly on a name that is a prefix). Use `[A-Za-z0-9_]+` for identifiers.
- **Look for an existing ratchet before adding a guard.** `test_suite_hygiene.py` already holds
  a placeholder-assert allowlist that must shrink with each fix; step 1 added a second detector
  to `execution_record`. Both now agree, and CP-N1-B left the allowlist in the same commit.
- **`@dataclass` in a module loaded with `spec_from_file_location` crashes** with
  `AttributeError: 'NoneType' object has no attribute '__dict__'` in `dataclasses._is_type`. The
  module uses `from __future__ import annotations`, so field types are strings, and dataclasses
  looks them up through `sys.modules[cls.__module__]`, which `module_from_spec` does not fill.
  Fix: `sys.modules[name] = module` before `exec_module`, the importlib docs recipe "Importing a
  source file directly" (also CPython issue gh-89831 for the same traceback). Guard: every
  `load()` helper in a contract test registers the module first.
- **A refresh can write a stale version where the file check cannot see it.** The enrich
  generator re-measured hand-maintained `execution.json` with the version in its own `SPECS`
  (still 2.0.0 for every CP-N1), so running it with the flag would have rolled CP-N1-A and
  CP-N1-B back to 2.0.0. The "no file changed" test missed it because `digests()` skips
  `execution.json` (its date changes on every run). Fix: the refresh reads the version from the
  package's `RUBRIC.json`, and a new test compares each refreshed record with the committed one,
  `verified_at` aside. Guard: when a check excludes a file, add a narrower check for that file.
- **Follow the section's states, even where the proposal named others.** Proposal 11 gave
  CP-N1-C the statuses `needs_review`, `abstain` and `no_signal`, and "abstain when evidence is
  missing". S13 teaches four (`invalid_input`, `abstain`, `needs_review`, `accept_pair`), sends a
  `None` ER to `invalid_input`, and keeps `accept_pair` for the same document and block, the
  "match" of the Fellegi–Sunter three-way rule (match, possible match for clerical review,
  non-match). The rebuild follows S13, and the brief answers "¿`accept_pair` no es una decisión
  automática?". Root cause: same as CP-N1-B, the design read the package before the section.
- **Cite the subtopic from its `subtopicId`, not from memory.** The first CP-N1-C brief put
  blocking in T1-B and the privacy sheet in T4-A; S13 has them in T1-A and T4-B. Guard:
  `grep -n 'heading:\|subtopicId:' src/lib/course/sections/sNN-*.ts` before writing "(T…)".
- **A test that the brief documents every output key finds real gaps.** For CP-N1-C it found
  that `case_id` and `rules_version` were in the packet but not in the brief. The check reads
  the keys from a real `review()` and `apply_correction()` run, so it cannot fall behind the code.
- **A reimplementation of a contract drifts; a call to it cannot.** CP-FINAL kept its own copies
  of the three level-1 contracts (`intake_cli.run`, `etl.run(batch)`, `familiarity.review` with
  `signals`), still at 2.0.0 after all three packages moved to 3.0.0, and every CP-FINAL test was
  green because the tests checked the copies. Fix: `integration/upstream.py` loads each CP-N1
  package's published interface, the platform translates the shared scenario into each package's
  shape in one place (`_build_subsystem_inputs`), and a test asserts each adapter returns exactly
  what the package returns on the same input. The honesty test that said "the twelve runners do
  not import the packages" was updated with the docs, and now also checks the code. Guard: when a
  contract changes version, grep every consumer for the old field names (`n_ok`, `manifest_hash`,
  `decision_evidence`), not only the copies of the signature.
- **A catalog field the engine never reads is a promise nobody keeps.** Symptom: the progress
  badges listed `required_projects` (13 capstones for the journey, three per phase) and the journey
  description said "all 13 capstones", but `engine.ts` returns from `finalizeProgress` before the
  project gate, so no capstone was ever checked. The phase 0 claim named the self-check, which the
  catalog never listed. The first draft of the claim test made the same mistake: it counted a
  progress badge's `required_projects` as a capstone requirement and so passed the old journey
  text. Root cause: claims and tests were written from the catalog data, not from the path the
  engine runs. Fix (proposal 11, §5.1 and §5.2): the progress lists are empty, self-checks are
  `required_activities`, and `tests/adversarial/test_badge_claims_match_engine.py` derives what is
  required from the engine's rules (activities for every required section; capstones only past
  the progress path). Guard: before a badge text names a piece of work, find the gate in
  `engine.ts` that blocks without it, and show the test failing on the old catalog.
- **Every badge version is pinned by hand in the credential tests.** Bumping the capstone
  credentials for the self-check change broke 12 node tests with `SPEC_VERSION_MISMATCH`:
  `credential-blockers.test.ts` (`VERSION`) and `credential-issue-gates.test.ts`
  (`SPEC_VERSION`, which defaulted to the catalog's top-level `1.0.0`) write each version out so
  the test does not read the value it checks. That is the intended design, not drift. Guard: a
  catalog version bump updates both maps in the same commit, and K4 now also refuses the version a
  badge had before the bump.
- **A positional tuple read one field off.** `generate_capstone_validation.py` built each CAPSTONE
  row as a 12-item tuple and read `c[10]` (critical failures) as the interface, so all 12 upstream
  entries in `final_integration_contracts.json` held a list where a signature belongs. Proposal 11
  fixed CP-N1-A's entry by hand, and the next regeneration would have undone it (Codex on #175).
  Root cause: indexes into an unnamed tuple, and no test compared the generator's output with the
  committed file. Fix: `final_contracts()` names what it reads and emits `criticalFailures`; the
  committed file is its output, and `test_regenerating_keeps_the_final_contracts` checks it, and
  checks that every interface is a string with `->`. Guard: when you hand-fix a generated file, fix
  the generator in the same commit and add a regenerate-and-compare test.
- **A new input rule broke a caller two packages away.** CP-N1-B's `run` began refusing a `run_id`
  that is not ASCII letters and digits, to keep `backups/{run_id}` inside `out_dir` (Codex on #176).
  CP-FINAL passes its batch id, `syn-batch-001`, and 15 CP-FINAL tests went red; the package's own
  suite stayed green. Root cause: the rule was written from the attack (`../x`) and checked only
  against the package's own tests. Fix: allow `-` and `_`, keep refusing `/` and `.`. Guard: before
  tightening an interface, `git grep` its callers (here `upstream.load("CP-N1-B")`) and run their
  suites on the stack's tip, not only the branch you changed.
- **Bare asserts in a learner suite hide the defect.** All three CP-N1 suites had message-less
  asserts; the runner printed the test's docstring and an empty `AssertionError`, so a learner could
  not tell which of seven checks failed. Codex found it in CP-N1-B and CP-N1-C; CP-N1-A had 21 more.
  Fix: an `igual(obtenido, esperado, que)` helper (with `is` for None and booleans), the runner
  prints the failing line, and each package's adversarial test refuses a bare assert (`ast`).
  Guard: when a finding names one file, grep the sibling packages for the same pattern.

## Proposal 12, first PR: wrong keys and starters that print the answer (21 Nov 2026)

- **The starter gate covered S01–S13 only, so ten S14–S27 starters printed the answer.**
  Root cause: `test_starter_is_not_the_answer` was written for batch 1 with a fixed stem list,
  and `scripts/planted_defect_audit.py`, which saw most of them, is wired into no gate. Fix: the
  gate now also runs `BATCH_2` (S14–S27, 336 exercises, about 60 s) with no owed list. Guard:
  when a gate names a batch, add the next batch's stems the day that batch is reviewed.
- **A starter that passes only some runs.** S22-T3-B-E1 printed `list(set(xs))`; string hashes
  are salted per process (`PYTHONHASHSEED`, see the `object.__hash__` note in the Python data
  model docs), so set order changes between runs and the starter matched the answer in about
  half of them. The first scan missed it and the gate caught it. Fix: a starter whose output
  is always wrong (`sorted(set(xs))` on `b, a, b`). Guard: never make a starter's defect depend
  on set or dict-of-set order; if it must, run the gate twice.
- **pandas 3 removed the defect an exercise taught.** S15-T2-B-E2 asked for `.copy()` before
  writing to a subset. Under Copy-on-Write (default in pandas 3.0) the subset is already
  independent, so the starter without `.copy()` printed the answer. What pandas 3 still gets
  wrong is the chained write: `df[mask]['ok'] = True` leaves `df` unchanged and raises a
  `ChainedAssignmentError` warning (pandas user guide, "Copy-on-Write", section "Chained
  assignment"). Guard: when a pinned library changes major version, rerun every starter of the
  sections that teach it, not only the solutions.
- **Rewording an instruction removed the defect marker.** The planted-defect audit only runs
  exercises whose text says `bug`, `defect` or `Error:`. Rewriting S22-T3-B-E1's step 1 dropped
  "(bug de orden)", and the audit's count fell from 698 to 697 with no failure. Guard: compare
  the audit's `checked` count before and after a content edit; a drop is a lost exercise.
- **A fixed key can trip the length ratchets.** Moving three keys to the right option changed
  which option is the key, so `test_exam_key_odd_feature` reported a repaired bank (the old
  S27 key was the only option with "todos") and asked for a lower count. The distractors were
  jokes ("Cambiar el logo del producto"), so they were rewritten as real misconceptions at least
  as long as the key. Guard: a key fix is a distractor fix; run `test_exam_length_cue` and
  `test_exam_key_odd_feature` right after it.
- **A starter-only edit needs no ledger row.** The exercise-meaning fingerprint covers the
  title, tests, solution code and output, not the starter, so S14-T4-A-E3 kept its anchor.
  Guard: build the ledger rows from the anchor diff (`exercise_fingerprints.mts --write`), not
  from the list of edited exercises.
- **A test class that skips without the content interpreter breaks the adversarial CI job.**
  `BatchTwoStartersAreNotTheAnswer` passed locally, where `.venv-content` exists, and failed CI's
  "Adversarial unit suite": that job has no pinned content environment, so the class skips, and
  `scripts/run_adversarial_py.py` fails every skip that `tests/adversarial/skip_allowlist.json`
  does not name. Root cause: the local runner never skipped, so it could not show the problem.
  Fix: allowlist each skipped test with the job where it really runs (content-gates). Guard: run
  the runner once from a fresh worktree without `.venv-content`
  (`git worktree add`, symlink `node_modules`) before pushing a test that uses `CONTENT_PY`, and
  make sure the content-gates job runs that file.

## Proposal 12, S14: errors met and how they were closed (21 Nov 2026)

- **The prose audit can measure a stale copy of the course.** `scripts/prose_quality_audit.py`
  reads `.fixer/events.json` if it exists and only regenerates it when it is missing, so a
  measure taken after an edit can describe the text before it. Fix: delete the cache, then
  rerun. Guard: `rm .fixer/events.json` before every prose measurement in a round.
- **Glosses made sentences long.** Adding the definitions the review asked for ("time.time, el
  reloj de pared, que puede saltar...") inside existing sentences raised S14's sentences over
  32 words from 5 to 12, though every finding was closed. Fix: give each gloss its own sentence
  (5 → 3). Guard: list the over-32 sentences of the section (the audit's `sentences()` and the
  32-word rule) after the content edits and before the commit.
- **A bank rewrite pays four ratchets at once.** Rewriting the S14 distractors lowered
  `LONGEST_IS_CORRECT_OWED` (1018 → 1000), removed `security` from `PERFECT_CUE_BANKS_OWED` and
  from the strategy simulation's "longest" list, and cleared the bank's thin explanations
  (`THIN_RATIONALES_OWED` 508 → 506). Each ratchet fails until it is lowered by hand. Guard: after
  a bank rewrite, run `test_exam_length_cue`, `test_exam_key_odd_feature`,
  `exam-strategy-simulation.test.ts` and `exam-rationale-depth.test.ts` together, and lower what
  they report in the same commit.
- **Plan the key's length rank first, then write the distractors.** Writing each distractor to a
  target rank (6 questions each at ranks 1 to 4) gave an even spread on the first run. Writing
  them first and fixing ranks afterwards is how S13 ended with one rank at 8.

## Proposal 12, S15: errors met and how they were closed (21 Nov 2026)

- **A `\n` inside Python code in a TS template literal becomes a real newline.** The S15 hash
  examples gained `lineterminator="\n"`. Written into the section's template literal as `\n`, the
  TS string held a line break, so the pinned code read `lineterminator="` + newline + `"` and
  three snippets failed with `SyntaxError: unterminated string literal`. Root cause: a template
  literal processes escapes like any JS string; `\n` there is the newline, not two characters.
  Fix: write `\\n` in the `.ts` file (the Python source then shows `\n`). Double-quoted prose
  strings in the section need the same `\\n`. Guard: after any edit to lesson code, run every
  snippet of the section against its pin before anything else (the scratch `s15check.py` loop
  or `npm run test:python-content`); a syntax error shows at once.
- **pandas 3 renamed the copy warning, and old prose keeps the old name.** The pinned pandas is
  3.0.5. There Copy-on-Write is the default, a chained write never reaches the parent, and the
  warning is `ChainedAssignmentError` (a `Warning` subclass: the script continues, catch it with
  `warnings.catch_warnings(record=True)`). `SettingWithCopyWarning` is the pandas 2.x name and
  2.x sometimes wrote through. Writing in an uncopied subset (`sub = df[mask]; sub['x'] = 1`)
  raises nothing in pandas 3 and leaves the parent unchanged. Source: the pandas Copy-on-Write
  user guide (pandas.pydata.org/docs/user_guide/copy_on_write.html). Guard:
  `test_proposal12_s15` fails when "SettingWithCopy" appears in S15 or its bank without
  "pandas 2.x" beside it. Expect the same name in later sections that use pandas.
- **The dtype of a mixed column depends on where it came from.** In pandas 3, a CSV column that
  mixes numbers and text reads as `str`; a Python list `[1, 'a']` and an Excel column with mixed
  cells give `object`. S15 said "mixed means object" in four places, which the learner's own CSV
  contradicted. Guard: before stating a dtype rule, run the read the learner will run (CSV, Excel
  and list) under `.venv-content`.
- **An exercise check passes the usual wrong answer when the fixture makes two answers agree.**
  Twelve S15 checks did: label and position matched, a RangeIndex made `loc` and `iloc` agree, no
  prior null made the delta equal the total, `> 0` held for any frame. Fix: change the fixture so
  the two answers differ, or print a second value that only the right answer gets. Guard: plant
  the wrong answer in the solution and confirm the pinned output catches it (the `MUTATIONS`
  table in `test_proposal12_s15`).
- **Two guards reach outside the file a round edits.** Trimming a sentence broke
  `concept-definition-detector.test.mjs`, which keeps the phrase "bloques de filas llamados
  **row groups**" as its real-course example of a definition. Adding category outputs
  (`['Lima']`) pushed S15 to 57 Peruvian city tokens, over the cap of 55 in
  `test_over_localized_language`. Fix: keep the guarded phrase; describe the categories without
  repeating the city. Guard: before rewording a sentence, `grep -rn` a distinctive part of it in
  `tests/` and `scripts/`; count city tokens when an edit adds fixture text.

## Proposal 12, S16: errors met and how they were closed (21 Nov 2026)

- **Two sets that must partition the input were built by two different operations.** S16 built
  `clean` with `drop_duplicates(key, keep='first')` and `quarantine` with
  `duplicated(key, keep=False)`, so the surviving row of a conflicting key sat in both. Two blocks
  later, the metrics and the You Do computed `rows_clean = rows_in - rows_quarantine`, which only
  holds for a partition: the learner got two counts for the same data (the review's P1). Root
  cause: each block stated its own rule and none stated the invariant between them. Fix: one
  rule for the whole section (exact copies leave one row in clean and the rest as `dup_exact`;
  every row of a conflicting key goes to quarantine as `dup_conflict`; schema drift holds the
  whole batch), the identity `rows_in == rows_clean + rows_quarantine` stated in prose, and
  demos that print the sum. Guard: when two sections of a lesson split or count the same rows,
  run the demos and assert the identity (`OnePartition` in `test_proposal12_s16`), with the old
  split as a negative control.
- **Peruvian money is written with a comma for thousands and a dot for decimals.**
  `Intl.NumberFormat('es-PE', {style: 'currency', currency: 'PEN'})` prints `S/ 1,250.50` (CLDR
  es-PE: group ",", decimal "."). The S16 parser took "if both, the dot is thousands" from the
  es-ES habit and read that receipt as 1.2505, 1000 times too small. Fix: the separator that
  appears last is the decimal; a single separator followed by exactly three digits (`1,250`) is
  ambiguous and raises `ValueError` so the row goes to quarantine. Guard: the test feeds the
  parser the string Node prints for es-PE, so a rule written from another locale fails.
- **Trying date formats until one parses is a silent guess.** A loop over `%d/%m/%Y`, `%Y-%m-%d`,
  ... accepts the first format that does not raise, so a month-first source with day <= 12
  (`03/04/2024`) parses as day-first with no error. pandas documents the same trap for
  `dayfirst`, which is not strict (pandas `to_datetime` reference; pandas-dev/pandas#12585), and
  recommends an explicit `format`. Fix: one documented format per separator and per source; a
  value that does not match becomes `NaT` and is reviewed. Guard: the theory fixture keeps a
  month-first date that must pin as `NaT`.
- **One fixture and one printed value is a check a hardcoded print passes.** All 24 S16 We Do
  exercises compared one output on one fixture. Fix: each solution is a small function run on two
  fixtures with different answers, or on one fixture that separates the usual mistake (a rate equal
  to the cap for `>` vs `>=`, a 0.0 for `< 0` vs `<= 0`, `fin == inicio` for `<` vs `<=`, mean and
  median that differ). Guard: the `MUTATIONS` table plants each usual wrong answer and the pin
  must catch it; a test also requires every pin to hold more than one result.
- **A guard at its cap leaves no room for a substitution.** S16 already had 55 Peruvian city
  tokens, the cap of `test_over_localized_language`. Replacing "Madrid" with any city in that
  guard's list would have failed it. Puno and Ica are real Peruvian regions outside the list.
  Guard: count city tokens before choosing a replacement place name.
- **`skip_allowlist.json` has two lists.** The first list in the file is `_doc`, the prose
  header; the entries live in `allowed`. A script that appended to "the first list" wrote the
  entries into the header. Guard: address the key by name (`d["allowed"]`) and read the diff,
  which should show additions only.
- **Browser Regression failed twice on trees that had passed (#175, #176).** Symptoms:
  `exercise-feedback` count 24 vs 0 in `revealSolutions`, and `section-root` not found after a
  hash change. Both re-runs on the same tree passed. The job starts `bun run dev` and waits a fixed
  15 s; the spec already gives the first navigation 30 s for the dev server's cold compile, but
  later section switches keep the 5 s default. Leading hypothesis, not yet confirmed (CI traces
  cannot be downloaded through the proxy): a section's chunk compiles on demand and a click lands
  before React hydrates it, so the click does nothing. Next step if it recurs: wait for a hydration
  signal before clicking, or run the job against `next build && next start`.
- **It recurred on #180 and on main (4abf8058), three runs in a row, and the hydration hypothesis
  is wrong.** The failure is on S02's We Do: 24 buttons clicked, 0 solutions shown. The spec
  reproduces it locally on a cold `next dev` and passes on a warm one (three runs). Two
  hypotheses were ruled out by experiment:
  - The 3 s first call to `/api/auth/session` is not it. Delaying that route by 3 s on a warm
    server still passes.
  - A plain Fast Refresh is not it. Touching `s02-basics.ts` after revealing the solutions keeps
    all 24 open.

  What the cold run does show is that the first visits compile chunks on demand:
  `[Fast Refresh] rebuilding` at 13.9 s, `done in 4644ms`, then a server refresh
  (`GET /?_rsc=…`) at 19.7 s. Both land inside the S01–S03 walk. The tab is in the URL hash
  (`#basics/wedo`), so anything that remounts the page keeps the tab and drops the We Do's local
  `showSolutions` state. That is the symptom.

  Production has no hot reload, so learners never see this. The cause is that the job tests
  `next dev`. Fixes, in order of fidelity:
  - run the job against `next build && next start`, as Playwright's docs recommend for CI;
  - make `revealSolutions` re-click until every solution shows, and re-check the count before
    reading the code blocks, so a remount can't shrink what the spec compares.

  A green run does not close it: #180 at e6625c86 passed the same job an hour after main failed
  it. In CI it depends on where the rebuild lands in the walk. Locally on a cold server it failed
  once in one try, and on a warm server it passed three times.
- **The Proposal 12 section tests failed the first time CI ran them (#181, 22–23 Nov 2026).**
  The stacked PRs target other branches, so CI never ran on them. Their content-gates step first
  ran when #181 was retargeted to main, and it failed twice:
  - First, `ERR_MODULE_NOT_FOUND`: the job installed Python packages but no Node packages, and
    the tests read each section through `tsx`. Fix: the job runs `ci_bun_install.sh` first.
  - Then, `does not provide an export named 'section14'`. `tsx` loads a `.ts` file in this
    CommonJS package as CommonJS. Node 22 exposes its named exports to ESM, but Node 20, which
    this job pins, puts them only on `default`. Locally (Node 22) the test passed.

  Fix: read with `const mod = await import(path)` and `mod.sectionNN ?? mod.default?.sectionNN`.
  It was reproduced on Node 20.20.2 (`npm i --no-save node@20` in the scratchpad) with the pinned
  environment: the old read gave 44 errors and the new one passes. Guard: before pushing a test
  that shells out to `node`, run it under the Node version of the job that will run it, and
  remember that a stacked PR's CI only runs once it targets main.
- **A review fix pushed a section over the city-name cap (#184, 23 Nov 2026).** The fixture added
  for Codex's finding used Lima and Cusco. The cap in `test_over_localized_language` counts city
  tokens in code as well as prose, so S16 went from 52 to 62 (cap 55). Before pushing, only the
  section's own tests and the meaning ledger had run. Root cause: a follow-up fix was treated as
  too small for the full suite. Guard: every push runs `scripts/run_adversarial_py.py` and the
  Node suite, and new fixture values come from regions outside the cap list (Puno, Ica).
- **A one-line header edit used a term before anything defined it (proposal 12 S17, 25 Nov 2026).**
  The review asked that a learning outcome stop calling `concat` a reshape tool. The rewrite named
  `melt` and `pivot_table`. The outcomes come before the theory, and the section defines
  `pivot_table` only in its T2-A block, so `test_surprising_uses_ratchet` (held at 0 since
  2026-10-02) failed: `S17 packaging.outcome[2] pivot-table`. The section's own test and the
  sentence-length check passed; only the full Python suite saw it. Root cause: a header was
  treated as a summary, when the detector reads it as the learner's first contact with every term
  in it. Fix: the outcome says «`melt` y su operación inversa». Guard: a term added to a tagline,
  job-relevance line or outcome must be one an earlier section taught, or be glossed in place;
  and the full suites run before every push, as the city-cap entry above already says.
- **A symmetric fixture let the named mistake pass (proposal 12 S18, 25 Nov 2026).** WEDO-09 asks
  for the worst coverage bias, `max(|count/n − share|)`, and its limits say «no devuelvas el
  mínimo». Its fixture had two regions against a 50/50 population: 9 Lima and 1 Madrid. With two
  regions the two shares sum to 1, so both biases are 0.4 and `min` prints the same answer as
  `max`. The section test's mutation `max` → `min` reported «the planted mistake prints the pinned
  answer». The exercise's own check could not fail on the mistake it warns about. Root cause: with
  two categories every bias has the same absolute value, so no aggregate (max, min or mean) tells
  them apart. Fix: three regions against 50/30/20, with 8 Lima, 2 Madrid and no Bogota rows. That
  gives max 0.3, min 0.1 and mean 0.2, and `counts[k]` raises on the missing region. Guard: an
  exercise whose limits name a wrong answer gets a fixture where that wrong answer prints
  something else, and the section test plants that mistake and checks the output changes.
- **A rewritten code comment removed a concept's only worked example (proposal 12 S18, 25 Nov
  2026).** The Spearman demo's comment «monótona creciente → correlación de rangos = 1.0» was
  replaced by a note on ties. `concept_map.py` counts a concept as exemplified when its name
  appears in a theory code block, and that comment was the only place `correlación` did. The
  concept fell from L2 to L1 and stopped being load-bearing. Three ratchets in
  `test_concept_depth_ratchets` moved together: the figure target fell from 320 to 316, the
  unexemplified count rose from 32 to 33, and D3 fell from 30 to 29. The D3 drop looked like a
  repair, but it was a loss. Root cause: a comment was read as decoration, when the concept map
  reads it as teaching. Fix: the original comment is back, and the note on ties is a second line.
  Guard: when two concept ratchets move in opposite directions in one round, diff
  `build_concepts(fresh_events())` against the base before lowering any constant.
- **A section already at the city-name cap went over on consistency fixes (proposal 12 S18, 25 Nov
  2026).** S18 had exactly 55 `Lima` tokens at the cap of 55. Making titles match the code
  («Proporción de Lima», «Tasa de flags solo en Lima»), and the new three-region fixture, added
  12. The fix kept every `Lima` that a title, fixture or output needs. It replaced the repeats in
  prose, hints and starter comments with «la región pedida» or «esa región», which gives 54.
  Guard: before editing a section, count its city tokens (`test_over_localized_language`). If the
  count is at the cap, budget every added name against a repeat you remove.
- **A distractor that states a true fact (Codex on #189, 25 Nov 2026; the same check then found
  three in S18).** The S17 named-aggregation item asked what `agg(total=..., n=('monto',
  'count'))` is for. One distractor said it keeps NaN out of `n`, which `count` does anyway. A
  learner who picked a true statement was marked wrong. The length and odd-feature ratchets cannot
  see this, because they measure the form of an option and not whether it is true. Rereading the
  S18 bank with that question found three more:
  - a trimmed mean «resiste» an outlier;
  - a median above the mean does signal a dragging tail;
  - listing the non-significant tests is the practice the lesson teaches.

  Root cause: a distractor was written as «a plausible wrong practice». Several of them were bad
  practice only because of a detail, not false as an answer to the question asked. Fix: each
  distractor now makes a claim that the lesson or a run refutes, and the S17 one is checked by
  running pandas. Guard: before a bank ships, read each distractor alone and ask whether it is a
  true answer to the question as worded. When the claim is about code behaviour, run it.
- **One chart, two sets of numbers (proposal 12 S19, 25 Nov 2026).** S19 draws the same synthetic
  chart in eight places. Lima was 28.0 with n=40 in the bar demo and 24.0 with n=28 in the tooltip
  demo, and Madrid had the reverse. Two P1s came from it. The lookup exercise told the learner to
  filter Lima in rows that had no Lima, which raises StopIteration. The You Do example alt said
  Madrid leads with 28 PEN and n=40, which the starter's data contradicts. Each block was right
  alone. Root cause: every demo typed its own literals, and nothing compared them. Fix: the
  section has one dataset, Lima 28.0 (n=40), Madrid 24.0 (n=28) and Bogota 22.5 (n=32). The
  section test reads every region and value pair in code, pins and prose, and fails on any value
  that differs. Guard: a section that repeats a chart across blocks declares its dataset once in
  its test, and every new block is checked against it. The same review found three checks that
  could not fail: a parity test that compared a dict with its own copy, and export metadata and
  claim verdicts typed by hand. Their tests now change the input and expect the output to move.
- **A new pandas test passed locally and failed CI as an unlisted skip (#189, 25 Nov 2026).**
  The Codex fix added `ExamBank.test_the_named_aggregation_nan_distractor_is_false` behind
  `@needs_pandas`. Here `.venv-content` exists, so the test ran and passed. The adversarial CI job
  has no pandas, so it skipped, and `run_adversarial_py.py` failed the job because
  `skip_allowlist.json` did not name that skip. Root cause: the allowlist is checked against the
  skips that happen, and which skips happen depends on the machine. A missing entry is invisible
  on every machine where a change is written: a check that reads the run can only see what this
  run did. Fix: the entry was added. Guard:
  `tests/adversarial/test_content_skips_are_allowlisted.py` reads the decorators with `ast`
  instead of the run. Any module-level `unittest.skipUnless/skipIf` whose reason names the pinned
  content interpreter marks a content skip, and every test it decorates must have an allowlist
  entry, on any machine. Before the entry it failed on exactly this test; with it, it passes.
- **A guard that read before it awaited (billing ledger, 25 Nov 2026).** `applyChange` checked that
  a webhook was not older than the stored row and that `canceled` was terminal, then awaited
  more reads and wrote without checking again. A cancel at +300 s and an older past_due at +200 s
  racing left the row past_due with its provider time moved back, and two status events both
  said `from: active`. Every test sent webhooks one at a time. Root cause: a check-then-act on a
  row with no compare-and-set at the write. Fix: `subscriptions.version` and a guard that writes
  NULL into the NOT NULL column when the row moved on, which rolls the D1 batch back, then a
  re-read. Guard: `workers/billing/tests/ledger-concurrency.test.mjs` races both orders and checks
  that the status events form one chain. Any new read-decide-write on shared rows gets a
  `Promise.all` test over the D1 fake, which yields between statements the way D1 does.
