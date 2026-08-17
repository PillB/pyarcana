# Deployment evidence

> Governing spec: AGENTS.md release-readiness (exact tested SHA after
> deploy verification). Local/CI evidence does **not** establish
> production readiness.

This file distinguishes two different artifacts. They must not be
collapsed into one “live” claim.

## 1. Verified live baseline (already on GitHub Pages)

Source of truth: `audit/safe-agent/parity-local-live.json`.

| Field | Recorded value |
| --- | --- |
| Status | `parity_verified` |
| Merged / deployed SHA | `038c2352ccc48f65b901c0689d2564f614a2cf96` |
| Tested PR tip SHA (pre-merge) | `5bf0e89144b1b7954c8bfab44a33724090f93f36` |
| Deploy run | `31219792163` |
| Live URL | https://pillb.github.io/pyarcana/ |
| Live HTTP | 200 |
| Live last-modified | Fri, 07 Aug 2026 21:24:00 GMT |
| Recorded | 7 August 2026 |

That SHA is **`main` after PR #22/#23**. It is the last independently
verified live baseline in this repository. It does **not** include the
CP-FINAL / OTLP work on this branch.

Stale SHAs that must not be cited as the live site:

- `e4607b8` (23 July) — superseded by the August 7 parity record.
- This branch's HEAD — see section 2.

## 2. Un-deployed candidate (this PR / `feat/scoped-v4`)

PR #25 is a **candidate**. It has not been deployed. No Pages SHA, no
live HTTP check, and no progress-fixture replay has been recorded for
this tree.

After this branch is tested, the exact tested SHA must be written here
only once a post-deploy smoke on GitHub Pages has compared that same
SHA/content. Until then:

- Do **not** claim PR #25 is live.
- Do **not** treat local `bun run dev` HTTP 200 as deployment evidence.
- Do **not** treat CI green as production readiness.

### Candidate local/CI checks (not live)

These are the checks that belong to the candidate tree. They remain
local or CI evidence until the SHA is deployed and re-verified:

- Preservation sentinel: `node scripts/preservation_sentinel.mjs`
- CP-N4-C OTLP suite: `python3 -m pytest course-state/capstones/CP-N4-C/tests/test_otel_export.py`
- CP-FINAL deep suite: `python3 -m pytest course-state/capstones/CP-FINAL/tests/test_integration_deep.py`
- Lint, `tsc --noEmit`, dynamic/static builds, adversarial suite

Fill in after deploy verification (leave blank until then):

| Field | Value |
| --- | --- |
| Candidate SHA tested | _not yet recorded_ |
| Deployed SHA (must equal tested SHA) | _not deployed_ |
| Live URL check | _not run_ |
| Live content / SHA comparison | _not run_ |
| Progress-fixture compatibility | _not run_ |

## 3. Rollback plan (unchanged)

If a future deploy of this candidate fails live verification, roll
Pages back to the last verified baseline
`038c2352ccc48f65b901c0689d2564f614a2cf96` (or whatever later
`parity-local-live.json` record supersedes it). Do not clear
`python-ds-progress` as a migration fix.
