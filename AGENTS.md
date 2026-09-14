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
Re-read GOAL, decisions and LEDGER before each stage.

```bash
python3 tools/fixer/preflight.py            # refuses to start on bad preconditions
tools/fixer/run_round.sh SXX --apply        # findings
tools/fixer/run_redaction.sh SXX            # grammar and redaction
tools/fixer/run_concepts.sh SXX             # concepts: remove, rephrase, gloss, teach, defer
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
- Record a decision that binds later rounds in `audit/fixer/decisions.md`.

## Ask first

- Deleting anything tracked. Default deletion budget is **zero**; a deletion needs a
  `DestructiveChangeRequest` (`audit/safe-agent/destructive-change-register.json`) with
  paths, reason, obsolescence evidence, alternatives, user-data impact, rollback, tests,
  and human plus verifier approval.
- Changing what a credential claims (`badge_catalog.json`), or relaxing a gate threshold.
- Restructuring a practice layer or moving a project between sections.
- Changing a protected path.

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
