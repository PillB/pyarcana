# Deployed state — PyArcana capstone system

> Governing spec Section 13 — Harness Artifacts / Reality.
> This file is a *mirror* of the canonical TypeScript source of truth. The TS
> modules under `src/data/` and `src/lib/` remain canonical; this markdown is
> evidence that the modules are deployed and the invariants are live.

## What is deployed

- **Application type:** Next.js 16 learner-facing single-page app.
- **Route exposed to learners:** `/` (the only user-visible route).
- **Dev server:** running locally on **port 3000** (`bun run dev`).
- **Page health check:** `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/` → `200`.
- **Deployed commit:** `pending` — GitHub device-flow auth was started in Phase 0
  in a fully detached background process; the push to `PillB/pyarcana` is
  queued behind auth completion. Local commit `a251060 Initial commit` exists.

## Module-load invariant (live in production)

The 13-capstone invariant is **enforced at module load** in
`src/data/capstones.ts`:

```ts
if (CAPSTONES.length !== 13) {
  throw new Error(`PyArcana invariant violated: expected 13 capstones, got ${CAPSTONES.length}`);
}
for (const lv of [1, 2, 3, 4] as const) {
  const count = CAPSTONES.filter((c) => c.level === lv && c.capstoneId !== "CP-FINAL").length;
  if (count !== 3) {
    throw new Error(`PyArcana invariant violated: level ${lv} has ${count} principal capstones, expected 3`);
  }
}
if (CAPSTONES.filter((c) => c.capstoneId === "CP-FINAL").length !== 1) {
  throw new Error("PyArcana invariant violated: expected exactly one CP-FINAL");
}
```

If the invariant is ever violated, the server-rendered page refuses to load —
the error propagates before any HTML is sent. This is the runtime safety net
behind the test-suite checks.

## Cardinality snapshot (mirror of `CARDINALITY`)

- Levels: **4** · Principal capstones per level: **3** · Principal capstones: **12** · Final capstones: **1** · **Total: 13**.
- N4-D decision: `fold_into_n4c` (no CP-N4-D principal capstone is created).
- CP-N4-C sub-gates:
  - `CP-N4-C.1 · S49` — Harness, adapters, RAG, tools, web/SERP, budget and approval.
  - `CP-N4-C.2 · S50` — Evaluation, red-team, reliability and recovery.
  - `CP-N4-C.3 · S51` — Observability, governance, incident-response, UX and final CP-N4-C gate.

## Auth / push status

- `gh` CLI installed user-space at `~/.local/bin/gh` (v2.65.0).
- GitHub device-flow auth started in a detached process; not yet completed.
- Local commit exists; remote push pending auth completion.
- The 13-capstone system, the N4-C harness, the test suite and the learner UI
  are **already runnable locally** regardless of push status.
