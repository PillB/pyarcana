# Deployment evidence

> Governing spec Section 13 (Harness Artifacts / Validation).
> Source of truth: the running Next.js dev server, `git log`, and the curl
> health check.

## Dev server

- Command: `bun run dev` (started in Phase 0).
- Port: **3000**.
- Route exposed to learners: `/` (only user-visible route).

## Health check (live)

```
$ curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3000/
HTTP 200
```

The page returns **HTTP 200**. The 13-capstone module-load invariant did not
throw (otherwise the server-rendered page would 500).

## Module-load invariant (live in the running server)

`src/data/capstones.ts` enforces the invariant at import time:

```ts
if (CAPSTONES.length !== 13) { throw new Error(...); }
for (const lv of [1, 2, 3, 4] as const) { /* exactly 3 principal capstones */ }
if (CAPSTONES.filter((c) => c.capstoneId === "CP-FINAL").length !== 1) { throw ... }
```

A 200 response is therefore evidence that the invariant holds in the deployed
process.

## Test suite (live)

```
$ bun test tests/capstones.test.ts
119 pass
0 fail
1821 expect() calls
Ran 119 tests across 1 file. [68.00ms]
```

## agent-browser rendering (planned)

The agent-browser skill is available. The verification matrix in
`validation/playwright_matrix.md` enumerates the user-visible checks: 4 levels,
3 cards/level, final card + 12 interfaces, N4-C flow (provider → task →
retrieval → tool → approve → verifier → trace → budget → cited), CP-FINAL flow
(12 deps → contracts → rollback → contribution), EN/ES toggle, sticky footer.
Snapshots are appended to the matrix file as each check runs.

## Git / push status

- `git log --oneline` shows a single local commit: `a251060 Initial commit`.
- `git remote -v` shows no configured remote yet.
- `gh` CLI is installed user-space at `~/.local/bin/gh` (v2.65.0).
- GitHub device-flow auth was started in Phase 0 in a detached background
  process; not yet completed.
- **Push to `PillB/pyarcana`: pending auth completion.**
- The 13-capstone system, the N4-C harness, the test suite, and the learner UI
  are **already runnable locally** regardless of push status.
