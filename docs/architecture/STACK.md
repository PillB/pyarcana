# Where PyArcana lives

Written 24 Nov 2026 from the repository (commit c33c9503) and the live headers of pyarcana.dev.
Each row names the file that proves it; if a row and its file disagree, the file wins and this
page is stale.

| Piece | Where | Proof in the repository |
|---|---|---|
| Source, issues, pull requests | GitHub `PillB/pyarcana`, default branch `main` | `.git`, `.github/workflows/` |
| Agent rules | `AGENTS.md` (binding), `CLAUDE.md` points to it | repository root |
| Course content | TypeScript modules, one per section | `src/lib/course/sections/` |
| Front end | Next.js app router, exported as static HTML (`out/`) | `src/app/`, `scripts/build_static_export.mjs` |
| **pyarcana.dev** (account edition) | One Cloudflare Worker, `pyarcana-billing`, on the custom domain; it serves `out/` as Static Assets and answers `/api/*` itself (`run_worker_first`) | `workers/billing/wrangler.toml` |
| Response headers, CSP | `out/_headers`, written at deploy from the built pages | `scripts/cloud-headers.mjs`, `src/lib/cloud/headers.ts` |
| Database | Cloudflare D1 `pyarcana-accounts`, binding `DB` (accounts, sessions, progress, subscriptions, ledger, events) | `workers/billing/wrangler.toml`, `workers/billing/src/*.mjs` |
| Scheduled jobs | Worker crons `17 9 * * *` (daily) and `7 * * * *` (hourly): provider reconciliation, clean-ups | `wrangler.toml [triggers]`, `workers/billing/src/reconcile.mjs` |
| Deploy of pyarcana.dev | Manual, from a laptop: `workers/billing/scripts/deploy.sh` (static build at the root, `_headers`, `wrangler deploy`) | that script; runbook in PR 186 |
| GitHub Pages edition | `https://pillb.github.io/pyarcana/`, no accounts (stage `off`), base path `/pyarcana`; built by CI after tests pass on `main` | `.github/workflows/deploy.yml` |
| CI | `tests.yml`: lint, typecheck, unit/adversarial, content gates, preservation sentinel, static and dynamic builds, browser regression | `.github/workflows/tests.yml` |
| Python in the browser | Pyodide 0.26.2 from jsDelivr (only that folder is allowed by the CSP) | `src/lib/pyodide.ts`, `src/lib/cloud/csp.ts` |
| Sign-in | Google Identity Services and Microsoft (MSAL) in the browser; email codes; sessions in D1 | `workers/billing/src/auth-*.mjs`, `src/lib/cloud/csp.ts` |
| Payments | Mercado Pago (Peru) and Creem (international), reconciled hourly and daily | `workers/billing/src/mercadopago.mjs`, `creem.mjs`, `reconcile.mjs` |
| Which edition a page load runs | `effectiveStage`: accounts only on the static build, at the canonical origin, with an API base | `src/lib/cloud/config.ts` |
| Dynamic LMS (server edition, Prisma) | Optional Node host; not what pyarcana.dev runs | `DEPLOY.md` "Dynamic LMS", `prisma/` |
| Documentation | `docs/` (architecture, policies, handovers), `DEPLOY.md`, `workers/billing/README.md` | those paths |

## Patterns already in place (checked 24 Nov 2026)

- **Optimistic locking**: progress writes are `PUT /v1/me/progress {doc, baseRev}`; the row is
  updated only `WHERE rev = baseRev`, and a lost race is a 409 with the winner's copy
  (`workers/billing/src/progress.mjs`). The client's `SyncStatus` `conflict` and `needs_choice`
  states handle it (`src/lib/cloud/progress-sync.ts`).
- **Outbox-like recovery for payments**: a lost or late webhook is caught by the hourly and daily
  reconciliation, which re-reads the provider and applies the same adapters
  (`reconcile.mjs`). A true transactional outbox is not needed for the webhook path because the
  provider is the source of truth and is re-read.
- **Connection pooling**: not applicable. D1 is reached through a per-request binding, not a TCP
  connection pool; there is nothing to pool.
