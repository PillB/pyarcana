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

---

Changes to this policy require independent human or verifier review
(CODEOWNERS).
