# CLAUDE.md

The agent policy for this repository is **[`AGENTS.md`](./AGENTS.md)**, at the repository
root: `/Users/pabloillescas/Documents/GitHub/pyarcana/AGENTS.md`.

Read it before doing anything here. It is binding, and it outranks habit. In particular:

- **Preservation comes first.** Existing content, tests, fixtures and IDs are valuable
  until repository evidence says otherwise.
- **The expert standard.** For every feature and every decision, name the expert who
  would review it and the published benchmark they would use. If you can say why they
  would reject your choice, the choice is already wrong.
- **Every trade-off is stated, never absorbed.** Work left undone is named.
- **A real test for every task and every round.** Tautological tests are worse than no
  test: they convert an unverified claim into a green check.
- **`chore(lint)` complexity ceiling.** `node scripts/complexity_gate.mjs` — cyclomatic
  complexity 15, enforced as a ratchet.
- **One failed hypothesis, then research.** If a fix hypothesis fails once, search for
  how others solved the same error before trying a second guess.
- **A blocked or rate-limited dependency is a stop, not a retry.** Surface it.

## Writing course content

Learner-facing Spanish follows **[`audit/fixer/writing_rules.md`](./audit/fixer/writing_rules.md)** —
distilled, checkable rules citing the full guides they came from:

- `ReviewerFixer/Solarized Website Content Comprehension Auditor & Rewriter.md`
- `ReviewerFixer/PYARCANA — MODO REVISOR ESCÉPTICO Y ANTI-COMPLACENCIA.md`
- `ReviewerFixer/_GRAMMAR_SUBPLAN.md`
- `Handcrafted Writing and Editorial Quality Protocol.docx`

Measured by `python3 scripts/prose_quality_audit.py`.

## Verifying content

Lesson code runs under `.venv-content` (Python 3.12, pinned packages). The runtime audit
refuses to report a verdict under any other interpreter, because it reports 3.12 syntax as
broken and pinned outputs as mismatched.

```bash
npm run test:v3                 # structure and invariants
npm run test:ux-gates           # glossary, first-use, identifiers, a11y, contrast
npm run test:python-content     # executes every lesson snippet
npm run test:course-complete
node scripts/complexity_gate.mjs
```
