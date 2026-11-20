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
| `e2e_max/13` had been failing before it reached its subject | A spec no CI job runs rots unnoticed | Stated as undone work below |

The rule: when code reads lesson content or a value owned elsewhere, write the
simulation with the feature. Take the real 52 sections, apply the edits a
future round will make with a seeded generator (so a failure reproduces), and
assert what must survive: nothing lost, nothing invented, saved learner state
still meaningful. `src/lib/course/lesson-navigation-drift.test.ts` is the
worked example; it found two defects in code whose unit tests were green.

Still undone, named: `scripts/e2e_max/` is not run by any CI job, and
`course-state/interaction_catalog.json` is stale against the course.

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

## Proposal 10 section fixes: errors met and how they were closed (S04–S12, 17–18 Nov 2026)

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
