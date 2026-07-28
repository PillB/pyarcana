# Eligibility State Machine

**Generated:** 2026-07-28T22:08:04Z  
**Catalog version:** 1.0.0

## Purpose
This document specifies the finite-state machine that governs
every badge's lifecycle in a learner's record. It is the
canonical reference for both the static GitHub Pages edition
(which implements only the local_achievement states) and the
dynamic LMS edition (which implements the full machine).
## States
Every badge in a learner's record is in exactly one of the
following states at any time:

| State | Applies to | Meaning |
|---|---|---|
| `not_started` | all badges | The learner has no evidence toward this badge yet. |
| `in_progress` | competency + verified | The learner has some evidence (one or more required activities completed) but has not met the badge's provisional floors. |
| `eligible` | competency + verified | All provisional floors met (self-check >=85%, You Do >=80%, exam >=85%, integrator >=85%, critical competency =100%). Ready for issuance but not yet issued. |
| `provisional` | competency + verified | Issued with provisional floor. On the dynamic LMS, this is the same as `verified` (provisional floors are the issuance floor, not a separate tier). On the static edition, this state is preview-only and never issued. |
| `verified` | competency + verified | Server-verified issuance. Cryptographic signature attached. Visible in the learner's public record. |
| `expired` | competency + verified | Past expiration date (3 years from issuance). The badge remains in the learner's record with an `expired` tag; the public_claim is no longer current. |
| `revoked` | all badges | Issuance was reversed per the badge's revocation_policy. The badge is removed from the public claim register but remains in the learner's private record with the revocation reason. |
| `superseded` | all badges | A newer badge version has replaced this one. The learner is offered a migration path to the successor badge. |
| `retired` | all badges | The badge has been retired (curriculum deprecation). Existing holders keep the credential; new issuance is closed. |

Progress badges (local_achievement) only ever enter `not_started`
or `verified` (local-only). They do not expire, are not revoked
for proficiency reasons, and are not superseded unless the
curriculum is fundamentally restructured.
## Transitions
Transitions are deterministic given the inputs. The dynamic LMS
enforces them server-side; the static edition enforces only the
`not_started -> verified` transition for progress badges.
```
stateDiagram-v2
[*] --> not_started
not_started --> in_progress: first required activity completed
in_progress --> in_progress: more evidence collected, floors not met
in_progress --> eligible: all provisional floors met
eligible --> in_progress: new evidence lowers a component below floor (rare; only on rubric re-evaluation)
eligible --> verified: server verifies evidence + signs credential
eligible --> provisional: (static edition only) preview; never persisted
verified --> expired: expiration_date passed
verified --> revoked: revocation_trigger fired
verified --> superseded: newer badge version published
expired --> verified: renewed (re-defense passed, new expiration set)
expired --> retired: badge retired by issuer
revoked --> not_started: 180-day cool-down elapsed (plagiarism/gaming only)
revoked --> verified: appeal upheld (issuance error / curriculum deprecation)
superseded --> verified: successor badge earned (migration path)
retired --> [*]: terminal
verified --> [*]: terminal (until expiration)
```

## Per-state inputs
Each transition has a defined input contract. The dynamic LMS's
badge service (`src/lib/badge/state_machine.ts`, to be
implemented in Phase 7) must verify every input before
transitioning.
### `not_started -> in_progress`
- **Input:** one `activity_completed` event for any
  `required_activity` of the badge.
- **Guard:** the activity's `learner_id` matches the badge
  record's `learner_id`.
- **Side effect:** none.
### `in_progress -> in_progress`
- **Input:** additional `activity_completed` or
  `rubric_score_updated` events.
- **Guard:** none beyond learner_id match.
- **Side effect:** update the badge's `evidence_map` with the
  new evidence pointer.
### `in_progress -> eligible`
- **Input:** all `required_activities` have evidence meeting
  the per-component floors in `assessment_blueprint`.
- **Guard:** every `critical_competency` has rubric evidence at
  100% floor. (Critical competencies are non-compensatory; a
  single one below floor blocks this transition.)
- **Guard:** every `prerequisite_badge` is in `verified` state
  for this learner.
- **Side effect:** set `eligible_at` timestamp; notify learner.
### `eligible -> verified`
- **Input:** learner-initiated issuance request (or auto-issue
  on eligibility, depending on LMS configuration).
- **Guard:** re-verify all floors (defense against
  race-conditions where evidence changed between eligibility
  and issuance).
- **Side effect:** generate cryptographic signature over the
  badge record (issuer private key); set `issued_at` and
  `expires_at` (issued_at + 1095 days); append to
  `evidence_registry.jsonl`.
### `eligible -> provisional` (static edition only)
- **Input:** learner views the badge detail page on the static
  GitHub Pages edition.
- **Side effect:** none. This is a UI-only state. The badge
  record in `localStorage` is marked `eligible` but never
  `verified`. A clear UI banner says "Verification unavailable
  on the static edition; sign in to the LMS to issue this
  credential."
### `verified -> expired`
- **Input:** system clock passes `expires_at`.
- **Side effect:** set `expired_at` timestamp; update public
  claim register to show the badge as `expired`.
### `verified -> revoked`
- **Input:** a `revocation_trigger` from
  `revocation_policy.revocation_triggers` is fired by an
  admin, an automated plagiarism detector, or a rubric audit.
- **Guard:** the trigger is logged with evidence pointer and
  reviewer signature.
- **Side effect:** set `revoked_at`, `revocation_reason`,
  `revocation_evidence_pointer`; remove from public claim
  register; notify learner with appeal instructions.
### `verified -> superseded`
- **Input:** a new badge version is published with
  `status=active` and the old badge's `status` flips to
  `superseded`.
- **Side effect:** set `superseded_at`, `successor_badge_id`;
  notify learner with migration path.
## Concurrency and idempotency
- Every transition is idempotent: re-applying the same input
  must not change the state.
- Every transition is logged to `evidence_registry.jsonl` with
  a monotonically-increasing sequence number.
- The state machine is single-writer per learner-badge pair:
  the dynamic LMS serializes transitions per
  `(learner_id, badge_id)` to prevent races.
- The static edition is read-only with respect to the state
  machine; it can render `not_started`, `in_progress`, and
  `eligible` (projected from `localStorage`), but cannot
  transition to `verified`.
## Audit trail
Every state transition is recorded in
`evidence_registry.jsonl` with:

- `event_id` (UUID)
- `learner_id`
- `badge_id`
- `from_state`, `to_state`
- `input_event` (structured)
- `guard_checks` (list of pass/fail per guard)
- `side_effects` (list of artifacts written)
- `timestamp` (UTC)
- `reviewer_signature` (for `verified -> revoked` only)

This trail is the canonical evidence for any audit of the
credential system.
