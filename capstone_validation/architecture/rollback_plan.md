# Rollback plan — curriculum change

> Status: standing.
> Date: 2026-07-30.
> Governing spec: Section 11 (Backward compatibility), Section 13 (Harness
> Artifacts / Architecture).

## Goal

If the curriculum change (CP-N4-C v1 → v2 expansion, or any future 13-capstone
edit) needs to be reverted, do so **without losing learner progress** and
**without breaking stable IDs**.

## What is reversible

The capstone system is entirely data-driven. The canonical sources are:

- `src/data/types.ts`
- `src/data/capstones.ts`
- `src/data/levels.ts`
- `src/data/sections.ts`
- `src/data/rubrics.ts`
- `src/data/badges.ts`
- `src/data/i18n.ts`
- `src/lib/copilot-harness.ts`
- `src/app/page.tsx`
- `tests/capstones.test.ts`

Each is plain TypeScript with no schema migration; reverting a file is a
`git checkout` of that file. The `capstone_validation/` mirror is regenerated
by `bun run scripts/mirror.mjs` after the revert.

## What is preserved across a rollback

- **Learner progress** — stored in the browser's `localStorage`, keyed by
  `capstoneId`. Because the rollback preserves stable IDs (CP-N1-A … CP-N4-C,
  CP-FINAL), the progress entries continue to resolve.
- **Badge eligibility flags** — same `capstoneId` keying.
- **Local-only assessment state** — the UI never writes a "verified" award from
  `localStorage`; assessment is server-side (the disclaimer in
  `src/app/page.tsx` documents this). A rollback therefore cannot forge a
  verified award.

## Rollback procedure (example: revert CP-N4-C v2 → v1)

1. `git revert <commit-that-bumped-CP-N4-C-to-v2>` (or `git checkout <prev> -- src/data/capstones.ts src/data/rubrics.ts src/lib/copilot-harness.ts`).
2. `bun run scripts/mirror.mjs` — regenerates `capstone_validation/` from the
   reverted sources.
3. `bun test tests/capstones.test.ts` — confirms the 13-capstone invariant and
   the *Backward compatibility* test group still pass.
4. `bun run dev` — confirms the learner UI still renders (the page refuses to
   load if the invariant is violated).
5. Inspect `capstone_validation/capstones/capstone_ledger.json` — `CP-N4-C`
   should be back at `v1.x` with `subGateIds: []`.

## Rollback procedure (example: revert the entire curriculum change)

1. `git checkout <pre-change-commit> -- src/data/ src/lib/copilot-harness.ts src/app/page.tsx tests/capstones.test.ts`
2. `bun run scripts/mirror.mjs`
3. `bun test tests/capstones.test.ts`
4. `bun run dev`

## What is NOT reversible

- **Server-side assessment records** — if a learner has already received a
  verified award (badge issued after a server-side assessment), the badge
  record is not destroyed by a curriculum rollback; only the *contract* reverts.
  Re-issuance rules are out of scope for this plan.
- **Pushed commits to the remote** — once a commit is pushed to
  `PillB/pyarcana`, the rollback must be a new commit on top (not a
  force-push). The 13-capstone invariant and the *Backward compatibility* test
  group protect against silent cardinality regressions on the remote.
