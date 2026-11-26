# AGENTS.md — PyArcana

Binds automated agents and humans working with them. **Preservation comes first.**
Rules are constraints; the reasons and incidents behind them are in
[`docs/agents/lessons.md`](docs/agents/lessons.md). Content rules for lesson files:
[`src/lib/course/sections/AGENTS.md`](src/lib/course/sections/AGENTS.md). Lesson writing, the
explain-and-exemplify standard and how to use the dependency graphs (concept map, glossary, track
graphs): [`docs/agents/lesson-writing.md`](docs/agents/lesson-writing.md).

**When instructions conflict:** 1 safety and authorization · 2 explicit human requirements
in the current task · 3 preservation invariants here · 4 approved specs · 5 existing behaviour.

## Done means these pass

```bash
npm run lint && npx tsc --noEmit
npm run test:v3
npm run test:adversarial:node && npm run test:adversarial:py   # both halves, always
npm run test:python-content      # under .venv-content; refuses a verdict otherwise
npm run test:python-strict       # every declared output line equals what the code prints
npm run test:ux-gates            # glossary, first-use, identifiers, a11y, contrast
npm run test:course-complete
node scripts/preservation_sentinel.mjs   # approved deletions: audit/safe-agent/deletion-allowlist.json
node scripts/complexity_gate.mjs # cyclomatic ceiling 15, ratchet
python3 tools/fixer/ledger.py --check
npm run test:static-journeys     # when a change touches what a page renders: CI's browser journeys
```

Read results case-insensitively. A grep for `adversarial` hid `ADVERSARIAL(py) FAILED` for
four rounds. A gate that could not run did not pass.

## When fixing a section

The reviewer-fixer round. Goal and definition of done: [`audit/fixer/GOAL.md`](audit/fixer/GOAL.md).
Ledger: [`audit/fixer/LEDGER.md`](audit/fixer/LEDGER.md), every box computed, never hand-ticked;
per-section state in `audit/fixer/cycles/SXX.json`.
Re-read GOAL, decisions and LEDGER before each stage. When a round teaches something that
should change how **every** section is handled, append it to `audit/fixer/LEDGER_NOTES.md`,
dated and attributed to the section that taught it — every prompt reads that file.

```bash
python3 tools/fixer/preflight.py            # refuses to start on bad preconditions
tools/fixer/run_round.sh SXX --apply        # findings
tools/fixer/run_redaction.sh SXX            # grammar and redaction
tools/fixer/run_concepts.sh SXX             # concepts: remove, rephrase, gloss, teach, defer
tools/fixer/run_spanish.sh SXX              # English in the Spanish, decided word by word
```

Order, never skipped silently — anything unfinished goes to `audit/fixer/OPEN_QUESTIONS.md`:
**findings → redaction → concepts → figures → vocab → ids → runtime.**

- Learner-facing words are authored by Codex, or by Claude when the owner approves each
  proposed change first: the passage, its replacement and the reasoning (owner, 2026-11-09).
  Tooling applies and verifies. Prose follows `audit/fixer/writing_rules.md`, including
  §I (machine-prose tropes, read against Zinsser's *On Writing Well*).
- Every concept, idea and technique not taught before is explained where it first appears; a
  technique is also exemplified by a runnable example, an exercise or walked script, or a figure
  (owner, 2026-11-25). Standard, failure modes and graph workflow: `docs/agents/lesson-writing.md`.
- Codex critiques each passage before returning it; unresolved concerns return twice, then
  go to a human.
- Research what the registry does not settle from several expert perspectives (STORM),
  synthesise, critique for what none raised.
- Fan out across sections; never within one. A definition in T1 changes what T3 may assume.
- `gpt-5.6-sol` medium for authoring; `gpt-6-astra` low only for agentic multi-file work.
- Converge at two quiet rounds, or five.
- A round that closes every finding and worsens the prose has regressed.

## When changing tests

- Never skip, delete or weaken a failing test to get green CI.
- A test must be able to fail. Prove it: break what it guards and watch it report.
- Model both behaviours. Before writing a test, name the correct behaviour and the defect it
  guards; the test passes on the first and goes red on the second. A test that only checks the
  happy path cannot alert when the issue comes back. Tautological tests are considered harmful.
- Every task and every round ships with such a test, and the PR names the mutation that turned
  it red.
- A skip is not a pass. A test that skips itself must skip on a condition that can only mean
  "this guard no longer applies", never on text another change can add. 21 Nov 2026: a guard
  skipped when any build script contained "prisma generate", and an unrelated error message
  that named the command turned it off while CI stayed green (#173). Count skips in the report.
- Counts are floors that catch loss, not ceilings on teaching (D6). Convert one only after
  probing that it actually blocks added content — most exact counts match canonical ids
  and already tolerate extras.
- Re-pin a prose snapshot only after checking the teaching move survived.
- Never update visual snapshots because CI failed.
- An unexplained change in a test count is evidence, not noise.

## When shipping

- Ship through a pull request. `main` has a PR rule; pushing past it is not a shortcut.
- Deploy only the exact tested SHA. Stage explicit paths; inspect `git diff --name-status`.
- "Shipped" means live: `python3 scripts/deployment_parity_audit.py`, then check the
  content itself at the deployed SHA with `git show "${SHA}:path"` — brace the variable.
- Never use `git merge-base --is-ancestor` as proof; squash-merge breaks it both ways.
- Scan commits for secrets. One commit per requirement; no mass reformat mixed in.

## Always

- Record `git rev-parse HEAD` and `git status` before edits; note others' uncommitted work.
- Establish a preservation baseline before substantial changes:
  `scripts/generate_preservation_manifest.mjs` → `audit/safe-agent/preservation-manifest-*.json`.
- Inspect the diff after every mutation; stop on an unexpected deletion or removed ID.
- Small patches. TDD for material defects: red → green → refactor → re-run → sentinel.
- Validate untrusted input at boundaries; fail closed; never invent missing values.
- State every trade-off. Name work left undone.
- Report every stub, placeholder, stand-in or fake, in code or tests, to the owner as a **MUST**
  item: where it is, why it exists, what it hides, and the decision needed. None is kept without
  the owner's decision. Find the root cause first: a stand-in is never the fix for an
  environment problem that can be solved for real (owner rule, 5 Oct 2026).
- Record a decision that binds later rounds in `audit/fixer/decisions.md`.
- When delegating to Claude subagents, follow [`docs/agents/model-ladder.md`](docs/agents/model-ladder.md):
  Haiku first; only verified failure hands up; limits, aborts and empty results stop; verify one level up.

## Ask first

- Deleting anything tracked. Default deletion budget is **zero**; a deletion needs a
  `DestructiveChangeRequest` (`audit/safe-agent/destructive-change-register.json`) with
  paths, reason, obsolescence evidence, alternatives, user-data impact, rollback, tests,
  and human plus verifier approval.
- Changing what a credential claims (`badge_catalog.json`, or the signed statement in
  `src/lib/credential-statement.ts`), or relaxing a gate threshold.
- Restructuring a practice layer or moving a project between sections.
- Changing a protected path.
- Changing a renumber guard input: the section manifest (`src/lib/eligibility/section_manifest.json`,
  the badge-identity file, not the preservation manifest), every other file under
  `src/lib/eligibility/`, including `src/lib/eligibility/skill_node_terms.json` and
  `src/lib/eligibility/claim_digests.json`,
  `audit/fixer/numbering_epoch.json`, `curriculum55_window.json`, `renumber_epoch.json`,
  `renumber_edit_ledger.json` or `authoring_pending.json`.
- Changing `audit/fixer/OWNER_DECISIONS.md`, the owner's decision record, which the exercise-meaning
  guard reads at the base. Recording an answer the owner has just given in chat, in the owner's own
  words, does not need asking first, because agents record those answers as a normal step (O27 101-Q2).

## Never

- Destructive git without explicit authorization: `git clean -f*`, `git reset --hard`,
  `git checkout -- .`, `git restore .`, force-push, history rewrite, mass branch deletion.
- Reset, clean, overwrite or stash unrelated work, or commit a file that was already dirty
  before your round started.
- Commit secrets, credentials, keys or real learner PII.
- Present mocks or placeholders as production features.
- Claim local tests prove production or live deployment.
- Rewrite broad areas or regenerate hand-written curriculum without scope.
- Clear localStorage or progress as a migration fix.
- Report a gate whose preconditions failed. Refuse instead.
- Edit `run_round.sh`, `run_chain.sh` or `run_concepts.sh` while a chain runs.
- Wait on a process with `pgrep -f` on a pattern the waiter itself contains.

## When stuck

- **One failed hypothesis, then research.** Read the real error, the source, the issue
  tracker. A second guess is not evidence.
- **A blocked dependency is a stop, not a retry.** At the first refusal on quota, rate
  limit, auth or outage: stop, say what it blocked and what is undone, label any weaker
  fallback as weaker, and never report the blocked work as complete.
- Never delete files to make an error go away.

## Expert standard

For every non-trivial decision, name the expert and the published benchmark they would use.
If you can say why they would reject your choice, it is already wrong — change it. Prefer
the feasible ideal over the cheap satisfier. Research before deciding, not after being
challenged: look it up (official docs, standards, papers, the issue tracker) and cite the source in
the PR. Weight methodological correctness, current practice, usability of the actual
path a person takes, and quality-of-life. Full text: `docs/agents/lessons.md`.

- **Ask of every feature: is it correct and production-ready?** Research it online before
  deciding. Name the authoritative source (a standard, the library's documentation, a
  peer-reviewed paper, or the weight of published practice) and cite it in the PR. Prefer what
  that source supports over what satisfies the stated constraints most cheaply. Weight
  scientific and methodological correctness first, then current state-of-the-art practice,
  then the usability and quality-of-life of the learner's or maintainer's actual path.
- **Retrospective and plan for every round.** Before a round, read the wiki
  (`docs/agents/lessons.md`) for the class of issue at hand and write the plan: routes, risks,
  the tests that will prove it. After the round, record what failed, its root cause and the
  guard that stops it recurring, so the next round does not re-diagnose it.

- **Pre-execution round.** Before building, name at least two routes, try each at the smallest
  scale that can tell them apart (a spike, a probe, a measurement), and choose against the
  expert's benchmark. The PR names the routes rejected and why.
- **Preamble and retrospective.** Open a round by reading the last rounds' lessons and the issues
  they left (`docs/agents/lessons.md`, open PRs); close it by recording what failed, its root cause,
  and the guard that now catches it.
- **Red-team before shipping.** Attack the chosen route as a hostile reviewer would: edge cases,
  bad input, the path a confused person takes, and every other place that shares the root cause.
  Fix the class, not the instance.

- **Simulate drift.** Code that reads lesson content, or a value another file owns, gets a
  test that applies the edits a future round will make (insert, retitle, untag, delete, a new
  id format, a changed constant) and states what must survive. A value kept in two files gets
  a test that reads both. An operator runbook is such a reader: every script line it quotes,
  path it names and version it pins is tested against the scripts, and every dashboard step
  cites the official doc it was checked against, with the date
  (`workers/billing/tests/redeploy-runbook.test.mjs`).
- **Simulate the platform, not only the content.** A local stack that behaves differently from
  production on an undocumented point is not evidence for that point. Name the assumption (rule
  order, header merging, caching), make the code correct under every plausible behaviour, and
  test all of them. 24 Nov 2026: `wrangler dev` applied `_headers` rules in file order and
  pyarcana.dev did not, so "/" got two CSPs and never hydrated while every local check passed
  (`src/lib/cloud/headers.ts` verifyHeadersFile, `scripts/serve_out_rule_order.mjs`).

## Fail loudly

Every test, gate and script fails verbose, with a diagnosis a stranger can act on: what failed,
where (file:line, id or URL), expected against actual, and the likely cause or next step.
An assertion carries a message naming the defect it guards. A gate that cannot run prints
`REFUSED` and why, and exits non-zero. A silent fallback, a bare `assert x`, or an exception
swallowed on a claimed path is a defect.

## Invariants

- 52 active sections, unique stable IDs; exercise IDs `Sxx-Ty-Z-En` stay present.
- Progress serialises round-trip; migrations are idempotent and never destroy completed work;
  invalid persisted state fails safe.
- Progress keys: storage `python-ds-progress`; fields `completedSections`,
  `completedSubSteps`, `quizScores`, `lastVisited`, `bookmarks`, `startDate`,
  `isHydratedFromServer`.
- Additive media never alters completion state.

## Protected paths

`src/lib/course/sections/` · `src/lib/course/index.ts` · `src/lib/progress-store.ts` ·
`src/lib/progress-sanitize.ts` · `prisma/migrations/` · `public/` · `tests/` ·
`scripts/*regression*` · `scripts/static_public.spec.ts` · `learning_roadmap_52_V3.md` ·
`.github/workflows/` · `CODEOWNERS` · this file.
Inactive legacy files are `INACTIVE_PRESERVED`: excluded from manifests, never deleted.

## Testing layers

STATIC lint, `tsc`, both builds, secret scan · UNIT/CONTRACT adversarial suite, V3,
preservation · E2E Playwright against the built app, traces and media retained on failure ·
LIVE post-deploy smoke on Pages, content compared at the SHA. Don't use E2E where a unit
test localises better, or a unit test as proof of a user journey.

Learner prose follows `docs/policies/HANDCRAFTED_WRITING_PROTOCOL.md` (canonical; the
`.docx` is a generated copy), distilled in `audit/fixer/writing_rules.md`.
