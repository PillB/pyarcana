# Deployment Evidence

**Generated:** 2026-08-09 · **Scope:** GitHub Pages deployment · **Method:** CI/CD pipeline + live verification

## Deployment pipeline

| Stage | Workflow | Status | Evidence |
|---|---|---|---|
| Lint | `bun run lint` | ✓ pass | ESLint clean |
| Type check | `tsc --noEmit` | ✓ pass | No type errors |
| Unit tests | `bun test` | ✓ pass | All tests pass |
| Course complete gate | `python3 scripts/course_complete_gate.py` | ✓ pass | Exit 0 |
| V3 regression | `npm run test:v3` | ✓ pass | Counts + structure + invariant |
| Layout bounds | `npm run test:layout` | ✓ pass | Self-test exit 0 |
| Playwright regression | `npx playwright test scripts/v3_regression.spec.ts` | ✓ pass | 17/17 |
| Static build | `node scripts/build_static_export.mjs` | ✓ pass | Static export to `out/` |
| GitHub Pages deploy | `.github/workflows/deploy.yml` | ✓ pass | Deployed to `pillb.github.io/pyarcana/` |

## Live site verification

| Check | URL | Status | Evidence |
|---|---|---|---|
| Landing page | `https://pillb.github.io/pyarcana/` | ✓ 200 | Art Nouveau landing renders |
| Capstones page | `/#capstones` view | ✓ 200 | 13 capstone cards render |
| Language toggle | EN/ES switch | ✓ pass | Labels translate |
| Dark mode | Theme toggle | ✓ pass | Persisted in localStorage |
| Keyboard nav | Tab/Enter/Esc | ✓ pass | All interactive elements reachable |
| Mobile layout | 375px viewport | ✓ pass | Responsive grid collapses |
| 200% zoom | Browser zoom | ✓ pass | No horizontal scroll |
| Progress persistence | localStorage | ✓ pass | Bookmarks + progress survive refresh |

## Deployed commit

- **Commit:** `e4607b8` (deployed to GitHub Pages)
- **Branch:** `main`
- **Deploy date:** 2026-07-23
- **CI badge:** [![GitHub Pages](https://github.com/PillB/pyarcana/actions/workflows/deploy.yml/badge.svg)](https://github.com/PillB/pyarcana/actions/workflows/deploy.yml)

## Rollback plan

1. The GitHub Pages deployment is driven by `.github/workflows/deploy.yml`.
2. To roll back, revert the commit on `main` and push; CI re-deploys automatically.
3. The static build is reproducible from any commit via `node scripts/build_static_export.mjs`.
4. No database or server-side state on GitHub Pages; all progress is browser-local.

## Post-deployment smoke tests

| Test | Method | Status |
|---|---|---|
| Page loads | `curl -sI https://pillb.github.io/pyarcana/` | ✓ 200 |
| Assets load | Check CSS/JS bundle | ✓ 200 |
| No console errors | Browser devtools | ✓ clean |
| Capstones render | `agent-browser snapshot` | ✓ 13 cards |
| Language parity | EN ↔ ES toggle | ✓ labels translate |
