# AGENTS.md — PyArcana

Binds automated agents and humans working with them. **Preservation comes first.**
Rules are constraints; the reasons and incidents behind them are in
[`docs/agents/lessons.md`](docs/agents/lessons.md). Content rules for lesson files:
[`src/lib/course/sections/AGENTS.md`](src/lib/course/sections/AGENTS.md).

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

- Codex authors every learner-facing word, read-only; tooling applies and verifies.
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
- **Every task and every review round needs an executable falsifiable contract.** Before coding,
  write the intended user-visible outcome, at least one plausible wrong outcome, and the
  assertion that distinguishes them. Exercise a *negative control* (deliberately inject or
  simulate the wrong outcome) and record that the test goes RED, then restore the correct
  behavior and record GREEN. A test that merely re-reads its own fixture, counts its own
  generated tiles, clicks without asserting a resulting state, or catches a required
  interaction failure is not evidence. If mutation cannot be run safely, mark the gate
  unverified and explain why; never claim it passed.
- For each user journey, verify cause and effect across **input → action → visible state →
  persistent/API state when applicable**. An API-only success does not prove the UI flow;
  UI-only feedback does not prove server-side grading. Test incorrect as well as correct
  answers, retry/reset, no-selection, bounds, and reload where those states apply.
- Never swallow required clicks/assertions with broad `catch {}`, conditional existence
  checks, or `force: true` unless the test is explicitly proving a rejected/blocked path.
- **`chore(lint)` is mandatory on each code task and round:** `npm run lint:complexity`
  enforces a cyclomatic ceiling of 15, with explicitly registered legacy debt; new or
  worsened debt must fail. Run this in addition to `npm run lint` and the task-specific
  tests; a missing baseline or unavailable dependency is a failure, not a reset.
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
challenged. Weight methodological correctness, current practice, usability of the actual
path a person takes, and quality-of-life. Full text: `docs/agents/lessons.md`.

## Adversarial release protocol — per lesson, page and mechanic

- Resolve the canonical section through `src/lib/course/index.ts`; audit source and the
  deployed SHA separately. Inventory every visible element, hidden/expanded state, exercise,
  option and expected transition. For each captured viewport describe the reading path in a
  left-to-right Z pattern, occlusion, scrolling, keyboard focus, animation, and error feedback.
- Perform **five analysis rounds**, **five independent red-team passes** (technical/scientific,
  mathematical/contract, pedagogy/prerequisites, adversarial state/permutations, cross-section
  regression), and **four aesthetic/accessibility passes** (information hierarchy; visual
  collision; responsive/contrast; focus/motion/reduced motion) per lesson. Run six meaningful
  end-to-end exercise iterations when feasible, varying input, choices, retry, state and
  platform. Distinct passes must add distinct observations, not duplicate a verdict.
- For each finding: identify the exact source + observed behavior, construct an attack,
  construct the strongest plausible defense, and classify `CONFIRMED_FINDING`,
  `REJECTED_FINDING`, or `UNRESOLVED`. Trace root cause and all components or later lessons
  depending on it. Keep a typed JSON ledger with element/subtopic/paragraph IDs, severity,
  hypothesis, counterexample, expected/actual result, minimal fix, research sources,
  negative-control result and before/after evidence. Never hand-mark a pass.
- Have an **independent red-team/QA review** challenge each fix and surprise-sample analogous
  exercises, not just the case initially reported. The reviewer must verify the source,
  execution and rendered result rather than accepting another agent's completion claim.
- Research one failed fix hypothesis using authoritative docs, comparable bug reports and
  primary evidence **before** proposing the next hypothesis; record the failed attempt and
  why the replacement differs. Never hide a blocked test behind a weaker substitute.
- State every material trade-off (especially safety, methodological fidelity, test scope,
  performance and UX). Do not claim world-class quality, exhaustive permutations or production
  readiness unless there is executable evidence and zero unresolved release blockers.

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
