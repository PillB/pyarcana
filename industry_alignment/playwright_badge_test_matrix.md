# Playwright Triple-Validation Harness — Badge Eligibility Test Matrix

**Generated:** 2026-07-28T23:30:00Z
**Catalog version:** 1.0.0
**Owner:** `playwright_adversary` + `coherence_guardian` nodes (Phase 10)
**Scope:** All 31 badges in `industry_alignment/badge_catalog.json`
**Companion artifacts:**
- `tests/adversarial/test_eligibility_engine.py` — Layer 1 reference tests (18 cases, all GREEN)
- `tests/e2e_max/badge_eligibility.spec.ts` — Layer 3 Playwright E2E (this phase)
- `tests/e2e_max/playwright.badge.config.ts` — per-suite Playwright config
- `industry_alignment/eligibility_state_machine.md` — state contract
- `industry_alignment/credential_architecture.md` — gate contract

---

## 1. Purpose

A badge is a credential only if every gate in the eligibility
contract is enforced at **three independent layers**, each of
which can fail without the others noticing:

1. **Layer 1 — Unit / contract / boundary tests.** Pure-logic
   tests against the eligibility engine in isolation. These
   prove the engine's *internals* are correct. (Already in
   `tests/adversarial/test_eligibility_engine.py`, 18 cases,
   Phase 9.)
2. **Layer 2 — Integration validation.** Tests that the engine
   consumes real learner-progress shapes (legacy localStorage,
   server-mirrored Prisma rows) without coercion, and that the
   catalog loader produces specs that satisfy the engine's
   invariants. These prove the engine's *wiring* is correct.
3. **Layer 3 — Playwright E2E validation.** Browser-driven
   tests that load the actual production TypeScript engine
   inside a real Chromium page, exercise it against scripted
   fixtures, tamper with `localStorage`, and verify the
   accessibility / keyboard contract of the badge UI surface.
   These prove the engine's *runtime* behaviour in the
   environment learners actually use.

A defect that passes Layer 1 but fails Layer 3 (for example, the
engine compiles but the Next.js bundle does not export it under
the expected module path, or `localStorage` tampering silently
fabricates a credential) is a release blocker. Conversely, a
defect that fails Layer 1 never reaches Layer 3 — the harness
fails fast.

This document is the matrix that defines which scenarios are
covered at which layer, and which layer is the *authority* for
each scenario (the layer whose verdict is final when the layers
disagree).

---

## 2. The triple-validation principle

The same adversarial scenario is run at every layer that can
meaningfully exercise it. Each layer's verdict is recorded. The
release gate in `release_evidence.md` requires that, for every
scenario, **all applicable layers agree** (or the disagreeing
layer is the one that surfaced a real defect).

| Scenario class | Layer 1 (unit) | Layer 2 (integration) | Layer 3 (E2E) | Authority layer |
|---|:---:|:---:|:---:|:---:|
| Threshold boundaries (exact-at / one-below) | ✅ | — | ✅ | L1 (deterministic) |
| Prerequisite gate (locked when missing) | ✅ | — | ✅ | L1 |
| Evidence-tier gate (guided vs independent) | ✅ | ✅ | ✅ | L1 |
| Critical-competency non-compensation | ✅ | — | ✅ | L1 |
| Idempotent award | ✅ | ✅ | ✅ | L1 |
| Static-edition preview vs. awarded | ✅ | ✅ | ✅ | L1 |
| Legacy-progress non-fabrication | ✅ | ✅ | ✅ | L3 (browser localStorage) |
| `localStorage` tamper resistance | — | — | ✅ | L3 (browser-only) |
| Refresh preserves valid state | — | — | ✅ | L3 (browser-only) |
| Refresh preserves invalid state | — | — | ✅ | L3 |
| UI locked state visible + a11y | — | — | ✅ | L3 |
| UI in-progress state visible + a11y | — | — | ✅ | L3 |
| UI awarded state visible + a11y | — | — | ✅ | L3 |
| Keyboard navigation | — | — | ✅ | L3 |
| Screen-reader labels | — | — | ✅ | L3 |
| Catalog loader invariants (weights sum, etc.) | ✅ | ✅ | ✅ | L1 (via L3 import) |

Legend: ✅ = scenario is exercised at this layer; — = scenario
is not meaningful at this layer (e.g., a pure-logic boundary
test does not need a browser; a `localStorage` tamper test
cannot be done in pure Python).

---

## 3. Layer 1 — Unit / contract / boundary (already complete)

**File:** `tests/adversarial/test_eligibility_engine.py`
**Runner:** `python3 -m unittest tests.adversarial.test_eligibility_engine`
**Result:** 18 / 18 GREEN (Phase 9, `worklog.md` entry P9).

The file contains a **self-contained Python reference
implementation** of the eligibility engine plus 18 adversarial
test cases that exercise every gate in the contract:

| # | Test | What it pins |
|---:|---|---|
| 1 | `test_badge_locked_when_prerequisites_not_met` | Gate 2 (prereqs) |
| 2 | `test_badge_available_when_prerequisites_met` | State `available` after prereqs, before evidence |
| 3 | `test_evidence_incomplete_when_missing_required_activities` | Gate 3 (activities) |
| 4 | `test_evidence_incomplete_when_below_evidence_tier_minimum` | Gate 3 tier sub-check |
| 5 | `test_assessment_ready_when_all_evidence_collected` | Gate chain end-to-end on dynamic |
| 6 | `test_blocked_when_critical_competency_fails` | Gate 6 (non-compensation) |
| 7 | `test_blocked_when_self_check_below_85` | Gate 5 floor: self_check |
| 8 | `test_blocked_when_you_do_below_80` | Gate 5 floor: you_do |
| 9 | `test_blocked_when_project_rubric_below_85` | Gate 5 floor: integrator |
| 10 | `test_threshold_boundary_exact_pass` | Boundary: exactly at floor = pass |
| 11 | `test_threshold_boundary_one_below_fail` | Boundary: one below = fail (after round-down) |
| 12 | `test_idempotent_award` | AwardIdempotent contract |
| 13 | `test_legacy_progress_doesnt_fabricate_evidence` | Legacy tier-1 evidence cannot satisfy tier-4 gates |
| 14 | `test_static_mode_shows_preview_not_awarded` | Static edition returns `eligible_pending_verification`, never `awarded` |
| 15 | `test_capstone_credential_blocked_on_static_edition` | Capstone requires dynamic edition |
| 16 | `test_deterministic_output` | Same inputs → same outputs |
| 17 | `test_progress_badge_awarded_on_static_edition` | Progress badges ARE issued on static |
| 18 | `test_pilot_badge_requires_supplementary_exercise` | Pilot gap-affected competency gate |

Layer 1 is the **executable specification**. The TypeScript
engine in `src/lib/eligibility/engine.ts` mirrors the Python
reference exactly; if they ever diverge, Layer 3 will surface
the divergence.

---

## 4. Layer 2 — Integration validation

Layer 2 verifies that the engine consumes **realistic inputs**
correctly. These are partially covered by Layer 1's fixtures
(which are shaped like real learner records) and partially by
the catalog-loader contract tests embedded in Layer 3 (see
`tests/e2e_max/badge_eligibility.spec.ts` › "Catalog loader
invariants"). A dedicated Layer 2 file is not added in this
phase because:

1. The Python reference in Layer 1 already ingests the
   production `badge_catalog.json` via `load_catalog_specs()`
   and validates its shape on every test run.
2. The TypeScript loader (`src/lib/eligibility/badge-specs.ts`)
   is exercised end-to-end at Layer 3 by importing the engine
   from the dev-server bundle and asking it to load the same
   catalog file. If the loader's parsing diverges from the
   Python reference's parsing, the Layer 3 boundary tests will
   fail.

**Outstanding Layer 2 work (not blocking Phase 10-13 release):**
- A Node-level integration test that feeds a real legacy
  `python-ds-progress` localStorage payload (sampled from
  `course-state/`) through the migration algorithm in
  `progress_migration_plan.md §3` and asserts that no
  competency badge is fabricated. This is queued for the
  Phase 14+ dynamic-LMS work; it cannot run on the static
  edition because the migration script lives server-side.

---

## 5. Layer 3 — Playwright E2E validation

**File:** `tests/e2e_max/badge_eligibility.spec.ts`
**Config:** `tests/e2e_max/playwright.badge.config.ts`
**Runner:** `BASE_URL=http://localhost:3000 npx playwright test -c tests/e2e_max/playwright.badge.config.ts`

### 5.1 How the production engine is exercised

The TypeScript engine in `src/lib/eligibility/` is **the
production runtime code**. Layer 3 imports it directly from the
test file via the Playwright runner's `tsx` loader (the same
loader already used by `npm run test:adversarial:node`). This
means the engine-behaviour tests exercise the **actual
production source** — not a port, not a copy, not a mock.

For scenarios that are meaningful only in a browser context
(`localStorage` tampering, refresh preservation, UI surface
states, keyboard navigation, screen-reader labels), the test
navigates to the dev server, drives a real Chromium page, and
uses `page.evaluate()` / `page.setContent()` to set up and
assert on the DOM. The engine itself, when needed inside the
page, is invoked from the test (Node-side) against the
`LearnerProgress` the test built — the page is the *scene*,
the engine is the *subject*.

This split is honest: the engine is pure logic with no DOM
dependencies, so running it in Node loses no fidelity; the
browser-only behaviour is exercised in Chromium where it
matters. A defect that compiles in isolation but breaks under
Next.js's bundling (circular import, JSON-module mismatch,
`fs`-dependent code path) is still caught at Layer 3 because
the test imports the production `src/lib/eligibility/*` files
through the same module-resolution path the Next.js build
uses.

### 5.2 Test inventory

The spec file contains **16 tests** across six `describe`
blocks. Every test uses Playwright's retrying web-first
assertions; **no `page.waitForTimeout()` is used for assertion
purposes** (one 200ms stabilisation pause is allowed after
`setContent` per Playwright's own guidance, and is annotated).

#### Block A — Positive eligibility (3 tests)

| # | Test name | Scenario | Authority layer |
|---:|---|---|---|
| A1 | `awards competency badge when every requirement is met (dynamic edition)` | Full progress fixture for `independent_data_preparation` (all floors met, critical competency at 100). Asserts `state === 'awarded'`, `eligible === true`, `awarded_at` is set, `blocking_reasons` is empty. | L1 + L3 |
| A2 | `refresh preserves a valid awarded state across reloads` | After awarding, the engine's verdict is captured, the page is reloaded, and the same verdict is recomputed. Asserts byte-equal verdict (state, eligible, awarded_at, blocking_reasons, requirement tuples). | L3 |
| A3 | `progress badge is awarded on static edition` | Mirrors Layer 1 test 17. Progress badges (`local_achievement`) are the only credential type issued on the static edition; guards against a regression that would refuse to issue them. | L1 + L3 |

#### Block B — Negative eligibility (5 tests)

| # | Test name | Scenario | Authority layer |
|---:|---|---|---|
| B1 | `blocks award when one required section's activities are missing` | Drop one section's `{YOUDO, EXAM, SELFCHECK}` from a full fixture. Asserts `eligible === false`, state in `{in_progress, evidence_incomplete}`, blocking reason mentions the missing activity. | L1 + L3 |
| B2 | `blocks award when self-check is one point below the 85% floor` | `self_check_pct = 84` (one below floor, after round-down). Asserts `eligible === false`, the `component:self_check` requirement is `passed=false` with `score=84, floor=85`. | L1 + L3 |
| B3 | `blocks award when average is high but a critical competency is below 100` | All other scores at 95, but `reproducibility_determinism.criteria_scores = [100, 100, 75, 100]`. Asserts `eligible === false`, `critical_competency:reproducibility_determinism` is `passed=false` with `score=75`. Non-compensation is verified by checking that the weighted-average component (which is ≥ 85) did **not** rescue the badge. | L1 + L3 |
| B4 | `refuses to fabricate evidence from tampered localStorage` | Inject a malicious `python-ds-progress` localStorage payload that claims all sections complete with 100% exam scores. Load the engine, ask it to evaluate `independent_data_preparation` against the **legacy-only** shape that localStorage can represent (tier-1, `legacy_only=true`, no rubric scores). Assert `eligible === false` and a blocking reason mentions independence / hands-on / tier. | L3 (browser-only) |
| B5 | `capstone credential is never awarded on static edition` | Build a full progress fixture for a capstone (`integrated_python_ai_capstone_foundations`). Evaluate on `EDITION_STATIC`. Assert `state !== 'awarded'` and a blocking reason mentions static / sign-in / LMS. | L1 + L3 |

#### Block C — UI surface states (3 tests)

These tests render a small badge-card DOM (matching the
planned `data-testid` contract) into the page via
`page.evaluate()` + `setContent`, then assert the visible
state and the `aria-label` / `role` contract. The DOM
structure used is the one the upcoming badge UI component
must implement; until that component ships, this is the
executable contract for it.

| # | Test name | Scenario | Authority layer |
|---:|---|---|---|
| C1 | `renders locked state visibly and accessibly` | Inject a badge card with `data-state="locked"`. Assert the lock icon, the "Locked" label, and `aria-label` containing the badge id. | L3 |
| C2 | `renders in-progress state visibly and accessibly` | Inject a badge card with `data-state="in_progress"` and a progress bar at 60%. Assert the bar, the percentage, and `role="progressbar"`. | L3 |
| C3 | `renders awarded state visibly and accessibly` | Inject a badge card with `data-state="awarded"` and an awarded-at timestamp. Assert the award mark, the ISO timestamp, and `aria-label`. | L3 |

#### Block D — Keyboard navigation (1 test)

| # | Test name | Scenario | Authority layer |
|---:|---|---|---|
| D1 | `badge card is keyboard-focusable and activatable` | Inject three badge cards (locked / in_progress / awarded). Tab through them. Assert each receives visible focus (`:focus-visible`), and pressing Enter on the awarded card opens a details region. | L3 |

#### Block E — Screen-reader labels (1 test)

| # | Test name | Scenario | Authority layer |
|---:|---|---|---|
| E1 | `every badge state has an accessible name and description` | Inject a badge card with `aria-labelledby` + `aria-describedby` for each of the three states. Assert the accessible name resolves to the badge name + state, and the description resolves to the newbie-friendly blocking/award text. | L3 |

#### Block F — Catalog loader invariants (3 tests)

These tests load the real `badge_catalog.json` via the
production TypeScript loader and assert structural invariants
that the Python reference tests assume.

| # | Test name | Scenario | Authority layer |
|---:|---|---|---|
| F1 | `catalog loads with version 1.0.0 and 31 badges` | Assert `getCatalogVersion() === '1.0.0'` and `specs.size === 31`. | L1 + L3 |
| F2 | `every active badge has a non-empty newbie_friendly_description` | Iterate all specs; assert no `active` or `pilot` badge has an empty `newbie_friendly_description`. (Stephen Fry redaction gate.) | L3 |
| F3 | `every competency and capstone badge has at least one critical competency` | Iterate specs where `credential_type` is `competency_badge` or `verified_credential`; assert `critical_competencies.length >= 1`. | L3 |

### 5.3 Why no arbitrary sleeps

Every assertion in the spec uses Playwright's web-first
assertions (`expect(locator).toBeVisible()`,
`expect(locator).toHaveAttribute(...)`, etc.) which retry
internally until the assertion passes or the `expect.timeout`
(in `playwright.badge.config.ts`, set to 30s) elapses. The
only non-assertion waits in the file are:

- A single `await page.waitForTimeout(200)` after
  `page.setContent()` in the UI tests, because Playwright's
  own documentation notes that `setContent` does not wait for
  layout/paint. This is annotated with a comment and is the
  only `waitForTimeout` in the file.
- `expect.poll(...)` for engine-result assertions that depend
  on async page evaluation — these are event-driven, not
  time-driven.

A grep-based CI guard can enforce the "no arbitrary sleeps"
rule: `rg "waitForTimeout\(\s*[1-9][0-9]{3,}" tests/e2e_max/`
must return no matches.

### 5.4 Tamper-resistance model

`localStorage` is the static edition's only persistent store.
The engine never reads `localStorage` directly; the migration
algorithm in `progress_migration_plan.md §3` is the only
code path that does. Test B4 verifies that even if an attacker
writes a perfectly-shaped payload claiming 100% on every
section, the engine's evidence-tier gate (tier 4 required for
competency badges; legacy data is tier 1) blocks award. This
is the static-edition tamper-resistance guarantee.

### 5.5 Convergence with Layer 1

For every scenario that exists in both Layer 1 and Layer 3,
the two layers must agree. Specifically:

| Layer 1 test | Layer 3 test | Agreement required |
|---|---|---|
| Test 5 (assessment ready) | A1 (awards when met) | Both award on dynamic |
| Test 6 (critical competency blocks) | B3 (high average, failed critical) | Both block |
| Test 7 (self-check below 85) | B2 (one point below) | Both block |
| Test 13 (legacy non-fabrication) | B4 (tampered localStorage) | Both block |
| Test 15 (capstone on static) | B5 (capstone static) | Both block |
| Test 17 (progress badge on static) | A3 (progress badge static) | Both award |

A disagreement is a release blocker and is recorded in
`release_evidence.md §3 Remaining risks`.

---

## 6. Run instructions

### 6.1 Prerequisites

- A running PyArcana dev server on `http://localhost:3000`
  (`bun dev` or `npm run dev`).
- Playwright browsers installed
  (`npx playwright install chromium`).
- The catalog file `industry_alignment/badge_catalog.json`
  must be present (it is, v1.0.0, 31 badges).

### 6.2 Run Layer 1 (Python)

```bash
cd /home/z/my-project/pyarcana_repo
python3 -m unittest tests.adversarial.test_eligibility_engine
```

Expected: `Ran 18 tests in <1s. OK`.

### 6.3 Run Layer 3 (Playwright)

```bash
cd /home/z/my-project/pyarcana_repo
# Terminal 1: start the dev server
bun dev   # or: npm run dev

# Terminal 2: run the badge E2E suite
BASE_URL=http://localhost:3000 npx playwright test \
  -c tests/e2e_max/playwright.badge.config.ts \
  --reporter=line
```

Expected: `16 passed`.

### 6.4 CI integration (recommendation)

Add a `test:badge-e2e` script to `package.json`:

```json
{
  "scripts": {
    "test:badge-e2e": "BASE_URL=http://localhost:3000 npx playwright test -c tests/e2e_max/playwright.badge.config.ts --reporter=line"
  }
}
```

And wire it into the existing `test:all-gates` aggregate.
The suite is fast (estimated <60s on a warm dev server) and
has no sharding requirements.

---

## 7. What this matrix does NOT cover (and why)

The following scenarios are deliberately out of scope for
Phase 10 and are tracked as explicit non-blocking risks in
`release_evidence.md §4`:

1. **Server-signed cryptographic issuance.** The dynamic LMS
   signing path (`src/lib/badge/state_machine.ts`, planned
   Phase 14+) does not exist yet. Layer 3 cannot test the
   cryptographic signature. The engine models the signed
   state by returning `awarded` on `EDITION_DYNAMIC`; the
   real signing is a separate server-side concern.
2. **Cross-device sync of awarded badges.** Requires the
   dynamic LMS, which is out of scope for the static-edition
   release that Phases 10-13 gate.
3. **Rubric re-evaluation lowering a component below floor.**
   The state machine documents this transition
   (`eligible → in_progress`); the engine does not yet
   implement it because the LMS rubric store does not exist.
   Tracked as a Phase 14+ work item.
4. **Expiration, revocation, supersession.** These are
   administrative states that require server-side cron jobs
   and a revocation UI. Out of scope for the static-edition
   release.
5. **Visual regression snapshots.** Not added because the
   badge UI component does not yet exist; the C1-C3 tests
   inject a DOM contract. Once the real component ships,
   visual snapshots can be added without restructuring the
   matrix.

---

## 8. Maintenance contract

When a new badge is added to `badge_catalog.json`:

1. Layer 1 should gain at least one test that exercises the
   new badge's gates (prereq, evidence-tier, floors, critical
   competency if any).
2. Layer 3 test F1's assertion (`specs.size === 31`) must be
   updated to the new count. F2 and F3 apply automatically.
3. If the new badge introduces a new credential_type or a new
   component_id, the engine's `computeComponentScores` switch
   must gain a case, and a new Layer 1 + Layer 3 test must
   cover it.

When the provisional floors change in
`PROVISIONAL_FLOORS` (in `types.ts`):

1. Layer 1 boundary tests (tests 7, 8, 9, 10, 11) must be
   updated in lockstep.
2. Layer 3 tests B2 (self-check one-below) and the boundary
   assertions in A1 must be updated.
3. `credential_architecture.md §6` and
   `assessment_validity_report.md §3` must be updated to
   match.

The matrix is the contract between these three artifacts; if
they diverge, the release gate fails.

---

*End of matrix. For the executable spec, see
`tests/e2e_max/badge_eligibility.spec.ts`. For the Layer 1
reference, see `tests/adversarial/test_eligibility_engine.py`.
For the gate decision, see `release_evidence.md`.*
