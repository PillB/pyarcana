# Notification Matrix — PyArcana Supervisor System

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Scope:** Catalogue of notification types fired by the supervisor / cohort system. Each notification is persisted in the `Notification` model and surfaced in the recipient's notification centre. Email delivery is Phase 7+; Phase 6 is in-app only.

---

## Notification Type Catalogue

| Type                                | Recipient          | Trigger                                                                                                  | Default Channels                | Opt-out | Deduplication Key                          |
|-------------------------------------|--------------------|----------------------------------------------------------------------------------------------------------|---------------------------------|---------|--------------------------------------------|
| `supervisor_request_submitted`      | All admins         | Learner POSTs `/api/supervisor/request`                                                                  | in-app                          | no      | `req:{userId}`                             |
| `supervisor_request_approved`       | Requesting learner | Admin POSTs `/api/admin/supervisor/[id]/approve`                                                         | in-app                          | no      | `appr:{userId}`                            |
| `supervisor_request_rejected`       | Requesting learner | Admin POSTs `/api/admin/supervisor/[id]/reject`                                                          | in-app                          | no      | `rej:{userId}`                             |
| `supervisor_suspended`              | Suspended supervisor | Admin POSTs `/api/admin/supervisor/[id]/suspend`                                                       | in-app                          | no      | `susp:{userId}`                            |
| `invitation_received`               | Invitee            | Supervisor POSTs `/api/cohorts/[id]/invite` and invitee has an account                                   | in-app                          | yes     | `inv:{invitationId}`                       |
| `invitation_accepted`               | Cohort owner       | Invitee POSTs `/api/invitations/[id]/accept`                                                             | in-app                          | yes     | `inva:{invitationId}`                      |
| `invitation_declined`               | Cohort owner       | Invitee POSTs `/api/invitations/[id]/decline`                                                            | in-app                          | yes     | `invd:{invitationId}`                      |
| `invitation_expired`                | Cohort owner       | Sweep job or lazy check finds `expiresAt < now` and `status === "PENDING"`                               | in-app                          | yes     | `invexp:{invitationId}`                    |
| `invitation_cancelled`              | Invitee (if known) | Supervisor or admin cancels a `PENDING` invitation                                                       | in-app                          | yes     | `invc:{invitationId}`                      |
| `cohort_membership_removed`         | Affected learner   | Supervisor removes learner via `POST /api/cohorts/[id]/remove/[userId]` (Phase 7+; not in Phase 6)       | in-app                          | no      | `rem:{cohortId}:{userId}`                  |
| `cohort_member_left`                | Cohort owner       | Learner POSTs `/api/cohorts/[id]/leave`                                                                  | in-app                          | yes     | `left:{cohortId}:{userId}`                 |
| `cohort_archived`                   | All active members | Cohort transitions to `ARCHIVED`                                                                         | in-app                          | no      | `arch:{cohortId}:{userId}`                 |
| `cohort_restored`                   | All active members | Cohort transitions back to `ACTIVE` (Phase 7+)                                                           | in-app                          | no      | `rest:{cohortId}:{userId}`                 |
| `badge_earned`                      | Learner            | Eligibility engine awards a badge (Phase 7+; not in Phase 6)                                             | in-app                          | yes     | `badge:{userId}:{badgeId}`                 |
| `badge_nearly_eligible`             | Learner            | Eligibility engine detects a badge is one requirement away from being awarded (Phase 7+)                 | in-app (digest only)            | yes     | `nearly:{userId}:{badgeId}`                |
| `badge_blocked`                     | Learner            | Eligibility engine detects a previously-eligible badge is now blocked (Phase 7+)                         | in-app                          | yes     | `blocked:{userId}:{badgeId}`               |
| `learner_inactive`                  | Cohort owner       | A member's `lastActivity > 7 days` (Phase 7+ sweep; not in Phase 6)                                      | in-app (digest only)            | yes     | `inact:{cohortId}:{userId}`                |
| `weekly_digest`                     | Supervisor         | Weekly digest job runs (Phase 7+; in Phase 6 the digest is computed on-demand at `GET /api/notifications` if `digestFrequency === "WEEKLY"`) | in-app                          | yes     | `digest:{userId}:{isoWeek}`                |
| `report_ready`                      | Requester          | Async report export completes (Phase 7+; Phase 6 reports are synchronous so this type is not fired)       | in-app                          | yes     | `report:{exportId}`                        |
| `subscription_expiring`             | Subscriber         | Subscription `currentPeriodEnd` is within 7 days (existing flow; reused for supervisor context)          | in-app                          | no      | `subexp:{userId}:{periodEnd}`              |
| `supervisor_entitlement_exceeded`   | Supervisor         | Supervisor attempts to create a cohort beyond their entitlement limit                                    | in-app (immediate, one-shot)    | no      | `entexc:{userId}:{attemptIsoTime}`         |
| `cohort_member_capacity_reached`    | Cohort owner       | Cohort's active member count reaches `maxMembers`                                                        | in-app                          | yes     | `cap:{cohortId}`                           |

---

## Default Channels

- **in-app** — the notification is persisted in `Notification` and surfaced in the recipient's notification centre (`GET /api/notifications`).
- **email** — the notification is sent via the email provider (Phase 7+). In Phase 6, the `emailEnabled` flag is stored but no email is sent.
- **digest** — the notification is held back from immediate in-app display and rolled up into the next digest (daily / weekly / monthly per `NotificationPreference.digestFrequency`).

---

## Opt-out Behaviour

For notification types marked `Opt-out: yes`:

- The recipient can disable the type via `PATCH /api/notifications/preferences` with a per-type opt-out list (Phase 7+; Phase 6 stores only the global `emailEnabled` and `inAppEnabled` flags).
- `Opt-out: no` types cannot be disabled; they are critical (e.g. `supervisor_suspended`, `cohort_archived`).

For Phase 6, the `NotificationPreference` model has only the global flags; per-type opt-out is deferred. All `Opt-out: yes` notifications fire by default; the user can mute all notifications via `inAppEnabled = false` (with a confirmation modal warning that critical notifications will also be hidden).

---

## Deduplication

- `Notification.deduplicationKey` prevents duplicate notifications for the same logical event.
- Before inserting a new notification, the server checks for an existing notification with the same `deduplicationKey` and `createdAt > now - 24h`. If found, the new notification is not inserted (idempotent).
- For digest-type notifications, the deduplication key includes the ISO week (or day, or month) so that one digest per period is allowed.

---

## Stephen Fry Redaction

Every notification `body` must be Stephen Fry redacted:

- **No** email addresses, phone numbers, or user IDs.
- **No** raw assessment answers, exercise code, or private feedback.
- **No** PII from other users (only the actor's first name, never the recipient's name in the body).
- Use `"tu supervisor"` / `"tu aprendiz"` / `"un aprendiz"` instead of names where possible.
- Use `"la cohorte"` instead of cohort names if the cohort name contains PII (Phase 7+; Phase 6 trusts the supervisor to name cohorts appropriately).

Example bodies:

- `supervisor_request_submitted`: *"Nueva solicitud de supervisor de {firstName}."*
- `invitation_received`: *"Te invitaron a la cohorte {cohortName}. {supervisorFirstName} será tu supervisor."*
- `invitation_accepted`: *"{learnerFirstName} aceptó tu invitación a {cohortName}."*
- `cohort_archived`: *"La cohorte {cohortName} fue archivada. Tu progreso no se pierde; puedes seguir viéndolo en modo solo lectura."*
- `badge_earned`: *"¡Felicidades! Obtuviste la insignia {badgeName}."*

---

## Quiet Hours

- `NotificationPreference.quietHoursStart` and `quietHoursEnd` define a window during which non-critical notifications are held for delivery after the quiet window ends.
- In Phase 6 (in-app only), quiet hours affect only the email channel (Phase 7+). In-app notifications are visible immediately; the user is expected to manage their own attention.
- Critical notifications (`Opt-out: no`) bypass quiet hours in Phase 7+ email.

---

## Expiry

- `Notification.expiresAt` is set to 90 days after `createdAt` for non-critical notifications and `null` (never expires) for critical notifications.
- A sweep job (Phase 7+) marks expired notifications as `isDismissed = true` and stops surfacing them.

---

## Phase 6 Implementation Status

| Type                                | Implemented in Phase 6? | Reason                                                                                              |
|-------------------------------------|-------------------------|-----------------------------------------------------------------------------------------------------|
| `supervisor_request_submitted`      | ✅                      | Core to the supervisor request flow.                                                                |
| `supervisor_request_approved`       | ✅                      | Core to the supervisor request flow.                                                                |
| `supervisor_request_rejected`       | ✅                      | Core to the supervisor request flow.                                                                |
| `supervisor_suspended`              | ✅                      | Core to admin flow.                                                                                  |
| `invitation_received`               | ✅                      | Core to invitation flow.                                                                            |
| `invitation_accepted`               | ✅                      | Core to invitation flow.                                                                            |
| `invitation_declined`               | ✅                      | Core to invitation flow.                                                                            |
| `invitation_expired`                | ✅ (lazy)               | Lazy check on `GET /api/invitations`; sweep job is Phase 7+.                                        |
| `invitation_cancelled`              | ✅                      | Core to invitation flow.                                                                            |
| `cohort_membership_removed`         | ❌                      | Removal flow is Phase 7+.                                                                           |
| `cohort_member_left`                | ✅                      | Core to leave flow.                                                                                 |
| `cohort_archived`                   | ✅                      | Core to archive flow.                                                                               |
| `cohort_restored`                   | ❌                      | Restore flow is Phase 7+.                                                                           |
| `badge_earned`                      | ❌                      | Badge award persistence is Phase 7+ (eligibility engine exists but no `BadgeAward` Prisma model yet).|
| `badge_nearly_eligible`             | ❌                      | Phase 7+ (requires persisted award state for diff).                                                 |
| `badge_blocked`                     | ❌                      | Phase 7+.                                                                                            |
| `learner_inactive`                  | ❌                      | Phase 7+ (requires sweep job).                                                                      |
| `weekly_digest`                     | ❌ (stub)               | `NotificationPreference.digestFrequency` is stored but no digest job runs in Phase 6.               |
| `report_ready`                      | ❌                      | Phase 6 reports are synchronous; this type fires only in Phase 7+ async path.                       |
| `subscription_expiring`             | ❌ (existing flow)      | Exists in the subscription system but not yet wired to the supervisor context. Phase 7+.            |
| `supervisor_entitlement_exceeded`   | ✅ (inline error)       | The error is returned inline as a 403; no notification is persisted in Phase 6. (Notification version is Phase 7+.) |
| `cohort_member_capacity_reached`    | ❌                      | Phase 7+ (requires capacity watcher; in Phase 6 the invite route rejects with 409 inline).          |
