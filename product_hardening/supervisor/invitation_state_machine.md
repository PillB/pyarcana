# Invitation State Machine — PyArcana Cohort Invitations

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Scope:** Lifecycle of a `CohortInvitation` row. The state machine is enforced server-side by the invitation API routes; no client-side state transition is trusted.

---

## States

| State        | Meaning                                                                                  |
|--------------|------------------------------------------------------------------------------------------|
| `CREATED`    | Initial state. Used internally during row creation; never persisted (creation goes straight to `PENDING`). |
| `PENDING`    | Invitation sent; awaiting learner action. Token is valid; expiry timer running.          |
| `ACCEPTED`   | Learner accepted. `CohortMembership` row created. Token is now invalid.                  |
| `DECLINED`   | Learner declined. No membership created. Token is now invalid.                           |
| `CANCELLED`  | Supervisor (or admin) cancelled the invitation. Token is now invalid.                    |
| `EXPIRED`    | `expiresAt` passed without action. Token is now invalid.                                 |
| `SUPERSEDED` | Supervisor resent the invitation; a new `CohortInvitation` row was created with a fresh token. The old row is `SUPERSEDED`; its token is invalid. |

---

## Transitions

```
                 ┌──────────────────────────┐
                 │      (row created)       │
                 └────────────┬─────────────┘
                              │
                              ▼
                       ┌─────────────┐
              ┌────────│   PENDING   │────────┐
              │        └──────┬──────┘        │
              │               │               │
       cancel │       accept / decline        │ expire (expiresAt < now)
       (owner │               │               │ or resend (owner)
       or     │               │               │
       admin) │               │               │
              ▼               ▼               ▼
        ┌──────────┐   ┌────────────┐   ┌──────────┐
        │CANCELLED │   │  ACCEPTED  │   │ EXPIRED  │
        └──────────┘   │  or        │   └──────────┘
                       │  DECLINED  │
                       └────────────┘

              resend (owner)
              ──────────────▶
              creates a NEW row in PENDING and marks the OLD row SUPERSEDED
```

### Transition rules

| From        | To          | Trigger                                              | Actor        | Side effects                                                                                       |
|-------------|-------------|------------------------------------------------------|--------------|----------------------------------------------------------------------------------------------------|
| (none)      | `PENDING`   | `POST /api/cohorts/[id]/invite`                      | Owner        | Create `CohortInvitation` row; create `Notification` for invitee (if known); audit `invite_learner` |
| `PENDING`   | `ACCEPTED`  | `POST /api/invitations/[id]/accept`                  | Invitee      | Create `CohortMembership`; audit `accept_invitation`; notify owner                                 |
| `PENDING`   | `DECLINED`  | `POST /api/invitations/[id]/decline`                 | Invitee      | Audit `decline_invitation`; notify owner                                                           |
| `PENDING`   | `CANCELLED` | `POST /api/cohorts/[id]/invitations/[invId]/cancel`  | Owner/Admin  | Audit `cancel_invitation`                                                                          |
| `PENDING`   | `EXPIRED`   | Sweep job / lazy check on `GET /api/invitations`     | System       | Audit `expire_invitation`; notify owner                                                            |
| `PENDING`   | `SUPERSEDED`| `POST /api/cohorts/[id]/invitations/[invId]/resend`  | Owner        | Create new `CohortInvitation` row in `PENDING`; mark old row `SUPERSEDED`; audit `resend_invitation` |

### Forbidden transitions

- `ACCEPTED` → any state. Accepted invitations are immutable. If the supervisor wants to revoke membership, they must use `cohort:remove_learner` (which mutates `CohortMembership.status`, not the invitation).
- `DECLINED` → any state. Declined invitations cannot be "un-declined". A new invitation must be sent.
- `CANCELLED` → any state. Cancelled invitations cannot be un-cancelled. A new invitation must be sent.
- `EXPIRED` → any state. Expired invitations cannot be renewed. A new invitation must be sent.
- `SUPERSEDED` → any state. Superseded invitations are immutable.

---

## Token Validity Rules

The token validation logic in `POST /api/invitations/[id]/accept` is:

1. Look up the invitation by `id`. If not found, return 404.
2. If `status !== "PENDING"`, return 410 Gone with `{"error": "INVITATION_NO_LONGER_PENDING"}`.
3. If `expiresAt < now`, lazy-transition to `EXPIRED` (audit + notify owner) and return 410 Gone with `{"error": "INVITATION_EXPIRED"}`.
4. Compute `sha256(submittedToken)` and compare to `tokenHash`. If mismatch, return 401 with `{"error": "INVALID_TOKEN"}`. Do **not** reveal which step failed (avoid token-enumeration oracle).
5. If `intendedUserId !== null && intendedUserId !== session.user.id`, return 403 with `{"error": "INVITATION_NOT_FOR_YOU"}`.
6. If `intendedEmail !== null && intendedEmail !== session.user.email`, return 403 with `{"error": "INVITATION_NOT_FOR_YOU"}`.
7. If a `CohortMembership` already exists for `(cohortId, session.user.id)` with status `ACTIVE` or `LEFT`, return 409 with `{"error": "ALREADY_MEMBER"}` (for `ACTIVE`) or `{"error": "PREVIOUSLY_LEFT_REINVITE_REQUIRED"}` (for `LEFT`).
8. All checks pass: create the membership, transition to `ACCEPTED`.

---

## Rate Limiting

- `POST /api/cohorts/[id]/invite` (the creator of new `PENDING` invitations): 10 per hour per supervisor (in-memory token bucket). On rate limit, return 429 with `{"error": "RATE_LIMITED", "retryAfterMs": <ms>}`.
- `POST /api/invitations/[id]/accept`: no rate limit (the invitee is acting on a single invitation). However, an invitee with > 5 failed token attempts in 10 minutes is locked out for 30 minutes (anti-enumeration).

---

## Deduplication

- `CohortInvitation.deduplicationKey` = `cohortId + ":" + intendedEmail` (or `cohortId + ":user:" + intendedUserId` if known).
- On `POST /api/cohorts/[id]/invite`, the server checks for an existing `PENDING` invitation with the same `deduplicationKey`. If found, return 409 with `{"error": "DUPLICATE_PENDING", "existingInvitationId": <id>}`. The supervisor must cancel or wait for the existing invitation to expire.
- `ACCEPTED` / `DECLINED` / `CANCELLED` / `EXPIRED` / `SUPERSEDED` invitations do **not** block new invitations to the same email. Only `PENDING` blocks.

---

## Security Properties

1. **Token secrecy:** The raw token is shown to the supervisor exactly once in the API response. It is never persisted in plaintext; only `tokenHash` is stored. Logs must not log the raw token (enforced by lint rule on the invitation creation route).
2. **Token entropy:** 32 random bytes (256 bits) via `crypto.randomBytes(32)`. Brute-force is computationally infeasible.
3. **Token revocation:** Cancellation, expiry, and resend all invalidate the token by transitioning the row out of `PENDING`. The acceptance endpoint rejects any non-`PENDING` row.
4. **Enumeration resistance:** The acceptance endpoint returns 401 for invalid tokens and 410 for non-pending invitations; the error messages are distinct but the response time is normalised (a small artificial delay is added to the 401 path to make timing attacks harder).
5. **Audit trail:** Every transition creates a `CohortAuditEvent` row with the actor, the action, and the before/after state (JSON snapshot).
6. **No email PII in audit:** The audit event's `afterState` JSON includes `intendedEmail` (necessary for traceability) but the supervisor-facing notification body uses only the invitee's first name.

---

## Edge Cases

1. **Invitee registers after invitation sent:** The invitation was created with `intendedEmail` only (no `intendedUserId`). When the invitee registers and accepts, the acceptance route sets `intendedUserId = session.user.id` on the invitation (for future audit) and creates the membership.
2. **Invitee already a member of another cohort:** No conflict. Memberships are per-cohort; a learner can be in multiple cohorts.
3. **Cohort archived while invitation is pending:** The invitation remains `PENDING` but acceptance is blocked. The acceptance route checks `Cohort.status === "ACTIVE"` and returns 410 with `{"error": "COHORT_ARCHIVED"}` if not.
4. **Supervisor suspended while invitation is pending:** The invitation remains `PENDING` and the invitee can still accept. Suspension blocks new invitations but does not retroactively cancel existing ones.
5. **Supervisor downgrades while invitation is pending:** Same as suspension — the invitation remains `PENDING`. If the cohort is archived due to downgrade, see edge case 3.
6. **Token leaked:** The supervisor can cancel the invitation (transition to `CANCELLED`) and resend (creates a new `PENDING` row with a fresh token). The old token is now invalid.
7. **Invitation accepted twice (race):** The acceptance route uses a transaction. The first request transitions `PENDING → ACCEPTED` and creates the membership. The second request sees `status !== PENDING` and returns 410. The unique constraint on `CohortMembership(cohortId, userId)` is the backstop.
