# Deployment Evidence

**Generated:** 2026-08-09 · **Scope:** GitHub Pages deployment

## Deployed commit

- **Commit:** `038c2352ccc48f65b901c0689d2564f614a2cf96` (verified via `audit/safe-agent/parity-local-live.json`)
- **Branch:** `main`
- **Deploy date:** August 7, 2026
- **Live URL:** https://pillb.github.io/pyarcana/
- **Live HTTP:** 200
- **Live last-modified:** Fri, 07 Aug 2026 21:24:00 GMT

## CI/CD pipeline

| Stage | Workflow | Status |
|---|---|---|
| Lint | `bun run lint` | ✓ pass |
| Type check | `tsc --noEmit` | ✓ pass |
| V3 regression | `npm run test:v3` | ✓ pass |
| Layout bounds | `npm run test:layout` | ✓ pass |
| Playwright | `npx playwright test scripts/v3_regression.spec.ts` | ✓ 17/17 |
| Static build | `node scripts/build_static_export.mjs` | ✓ pass |
| GitHub Pages deploy | `.github/workflows/deploy.yml` | ✓ pass |

## Rollback plan

1. Revert the commit on `main` and push; CI re-deploys automatically.
2. Static build is reproducible from any commit.
3. No server-side state on GitHub Pages; all progress is browser-local.
