# User Flows — PyArcana Supervisor / Cohort System

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Scope:** End-to-end flows for the supervisor system. Each flow lists the actors, the steps, the API endpoints hit, the models mutated, the notifications sent, and the audit events emitted. Flows are the executable counterpart of `product_requirements.md`.

---

## Flow 1 — Request supervisor privileges

**Actors:** Learner (Pro or Team plan), Admin.

1. Learner navigates to `/cuenta` (Account page) and clicks "Solicitar privilegios de supervisor".
2. UI checks `GET /api/supervisor/status`. If `SupervisorProfile.status` is `PENDING` or `APPROVED`, the UI disables the button and shows the current status.
3. Learner fills the form: use case (free text), organisation (free text), anticipated size (int 5-200), entitlement (Pro or Team — auto-selected based on current subscription).
4. UI POSTs to `/api/supervisor/request` with the form payload.
5. Server validates: session present, user has Pro or Team subscription, no existing `SupervisorProfile` with status `PENDING` or `APPROVED`.
6. Server creates `SupervisorProfile` (status `PENDING`, entitlement, useCase, organisation, anticipatedSize, requestedAt = now()).
7. Server creates a `Notification` for each admin (type `supervisor_request_submitted`, body: *"Nueva solicitud de supervisor de {learnerFirstName}"* — Stephen Fry redacted: only first name, no email).
8. Server responds 201 with the new `SupervisorProfile` row.
9. UI shows "Solicitud enviada. Te avisaremos cuando sea revisada."

**Admin side:**

10. Admin sees the notification in their notification centre.
11. Admin navigates to `/admin/supervisor-requests` (existing admin console).
12. Admin reviews the request and clicks "Aprobar" or "Rechazar".
13. UI POSTs to `/api/admin/supervisor/[id]/approve` (or `/reject`).
14. Server validates: session present, `session.user.role === "ADMIN"`.
15. Server updates `SupervisorProfile.status` to `APPROVED` (or `REJECTED`), sets `approvedAt` (or `suspendedAt` for reject — actually `REJECTED` does not set `suspendedAt`; it just sets `status = REJECTED`), `approvedBy = session.user.id`.
16. Server creates a `Notification` for the learner (type `supervisor_request_approved` or `supervisor_request_rejected`).
17. Server responds 200 with the updated profile.

**Models mutated:** `SupervisorProfile`, `Notification`.
**Audit events:** none at the cohort level (the supervisor profile is global; cohort audit events begin at Flow 2). Admin actions on `SupervisorProfile` are themselves auditable via the `Notification` log + the `approvedBy` field; a future admin audit log is Phase 7+.

---

## Flow 2 — Create cohort

**Actors:** Approved supervisor.

1. Supervisor navigates to `/supervisor` (a new supervisor dashboard landing page).
2. UI checks `GET /api/supervisor/status`. If `status !== "APPROVED"`, redirect to `/cuenta`.
3. UI fetches `GET /api/cohorts` (the supervisor's existing cohorts).
4. Supervisor clicks "Crear cohorte".
5. UI shows a form: name (required), description (optional), maxMembers (default 25, bounded by entitlement).
6. UI POSTs to `/api/cohorts`.
7. Server validates: session present, `SupervisorProfile.status === "APPROVED"`, cohort count under entitlement limit (Pro: 1; Team: 5).
8. Server creates `Cohort` (ownerId = session.user.id, status `ACTIVE`, maxMembers).
9. Server creates `CohortMembership` (cohortId, userId = session.user.id, scopedRole `COHORT_OWNER`, status `ACTIVE`, invitedBy = null, consentVersion = "1.0").
10. Server creates `CohortAuditEvent` (action `create_cohort`, actorId = session.user.id, targetType `cohort`, targetId = cohort.id, afterState = JSON snapshot of the new cohort).
11. Server responds 201 with the new cohort.
12. UI redirects to `/supervisor/cohorts/[id]`.

**Models mutated:** `Cohort`, `CohortMembership`, `CohortAuditEvent`.
**Notifications:** none.
**Audit events:** `create_cohort`.

---

## Flow 3 — Invite learner

**Actors:** Supervisor (or co-supervisor with invite permission — but in Phase 6 only `COHORT_OWNER` can invite), learner (invitee).

1. Supervisor navigates to `/supervisor/cohorts/[id]` and clicks "Invitar aprendiz".
2. UI shows a form: email (required), optional personal message (≤ 280 chars).
3. UI POSTs to `/api/cohorts/[id]/invite` with `{ email, message }`.
4. Server validates:
   - Session present.
   - Caller is `COHORT_OWNER` of this cohort (or `COHORT_SUPERVISOR` if a future flow allows it).
   - Cohort `status === "ACTIVE"`.
   - Member count < `maxMembers`.
   - Email format valid.
   - No existing `CohortInvitation` with status `PENDING` for the same `(cohortId, intendedEmail)` (rate-limit duplicate prevention).
   - Rate limit: caller has < 10 invitations in the last hour (in-memory counter).
5. Server generates a 32-byte random token via `crypto.randomBytes(32)`, base64url-encodes it, computes `tokenHash = sha256(token)`.
6. Server creates `CohortInvitation` (cohortId, invitedBy = session.user.id, intendedEmail, tokenHash, status `PENDING`, expiresAt = now + 7 days, deduplicationKey = `cohortId + ":" + intendedEmail`).
7. Server checks if a `User` exists with that email:
   - **Yes:** set `intendedUserId` on the invitation; create a `Notification` for that user (type `invitation_received`, body: *"Te invitaron a la cohorte {cohortName} de {supervisorFirstName}"*, actionRoute `/invitations`).
   - **No:** the invitation is created but no in-app notification is sent (the supervisor must share the link out-of-band). Email delivery is Phase 7+.
8. Server creates `CohortAuditEvent` (action `invite_learner`, actorId = session.user.id, targetType `invitation`, targetId = invitation.id, afterState = JSON snapshot of the invitation).
9. Server responds 201 with `{ invitationId, token }` — the **raw token** is returned to the supervisor exactly once; the supervisor must copy it and share it with the learner. The token is never persisted in plaintext.
10. UI shows the token + a copy button + a warning: *"Este enlace se mostrará una sola vez. Cópialo ahora."*

**Models mutated:** `CohortInvitation`, `Notification` (if invitee has an account), `CohortAuditEvent`.
**Notifications:** `invitation_received` (to invitee, if known).
**Audit events:** `invite_learner`.

---

## Flow 4 — Learner accepts / declines invitation

**Actors:** Learner (invitee).

### 4a. Accept

1. Learner sees the `invitation_received` notification in their notification centre and clicks it (or receives the link out-of-band).
2. UI navigates to `/invitations` and lists `GET /api/invitations` (the learner's pending invitations).
3. Learner clicks the invitation; UI shows the consent page: cohort name, supervisor name, what the supervisor can see (link to privacy matrix), how to leave.
4. Learner clicks "Aceptar".
5. UI POSTs to `/api/invitations/[id]/accept` with the token in the request body (or in the URL fragment, depending on link format).
6. Server validates:
   - Session present.
   - Invitation `intendedUserId === session.user.id` (or `intendedEmail === session.user.email`).
   - Invitation `status === "PENDING"`.
   - Invitation `expiresAt > now`.
   - Token hash matches `sha256(submittedToken)`.
7. Server creates `CohortMembership` (cohortId, userId, scopedRole `COHORT_LEARNER`, status `ACTIVE`, invitedBy = invitation.invitedBy, consentVersion = "1.0", joinedAt = now()).
8. Server updates `CohortInvitation.status = "ACCEPTED"`, `acceptedAt = now()`.
9. Server creates a `Notification` for the cohort owner (type `invitation_accepted`, body: *"{learnerFirstName} aceptó tu invitación a {cohortName}"*, actionRoute `/supervisor/cohorts/[id]`).
10. Server creates `CohortAuditEvent` (action `accept_invitation`, actorId = learner, targetType `invitation`, targetId = invitation.id).
11. Server responds 200 with the new membership.
12. UI redirects to `/cohorts/[id]` (learner view of the cohort — name + their own progress).

### 4b. Decline

1-4. Same as 4a.
5. UI POSTs to `/api/invitations/[id]/decline`.
6. Server validates as in 4a steps 6.1-6.4.
7. Server updates `CohortInvitation.status = "DECLINED"`, `declinedAt = now()`.
8. Server creates a `Notification` for the cohort owner (type `invitation_declined`, body: *"{learnerFirstName} declinó tu invitación a {cohortName}"*).
9. Server creates `CohortAuditEvent` (action `decline_invitation`, actorId = learner, targetType `invitation`, targetId = invitation.id).
10. UI shows "Invitación declinada."

### 4c. Expired (automatic)

- A background sweep (Phase 7+; for Phase 6 a lazy check on next `GET /api/invitations`) marks `CohortInvitation.status = "EXPIRED"` when `expiresAt < now` and `status === "PENDING"`. The supervisor is notified via `invitation_expired`.

**Models mutated (4a):** `CohortMembership`, `CohortInvitation`, `Notification`, `CohortAuditEvent`.
**Models mutated (4b):** `CohortInvitation`, `Notification`, `CohortAuditEvent`.
**Notifications (4a):** `invitation_accepted` to supervisor.
**Notifications (4b):** `invitation_declined` to supervisor.
**Audit events:** `accept_invitation` / `decline_invitation`.

---

## Flow 5 — View dashboard

**Actors:** Supervisor, co-supervisor, reporter.

1. Supervisor navigates to `/supervisor/cohorts/[id]`.
2. UI fetches `GET /api/cohorts/[id]/dashboard`.
3. Server validates:
   - Session present.
   - Caller is `COHORT_OWNER`, `COHORT_SUPERVISOR`, or `COHORT_REPORTER` of this cohort.
   - Cohort `status === "ACTIVE"` (or `ARCHIVED` for read-only access).
4. Server queries:
   - `CohortMembership` where cohortId + status `ACTIVE` (list of members).
   - `Progress` for each member (last 30 days).
   - `ExamAttempt` for each member (best score per section).
   - `CohortInvitation` where cohortId + status `PENDING` (pending invites).
   - `CohortAuditEvent` where cohortId, last 20 rows (recent activity).
   - Badge eligibility (computed by `src/lib/eligibility/` over each member's `LearnerProgress`).
5. Server computes:
   - Active learners (last 7 / 30 days).
   - Mean / median / % complete.
   - Badge status counts (awarded, eligible, blocked).
   - Data freshness (max `Progress.completedAt` across members).
6. Server responds 200 with the dashboard payload (per `reporting_requirements.md`).
7. UI renders the dashboard: KPI cards at top, members table, recent activity feed, data freshness badge.

**Models read:** `Cohort`, `CohortMembership`, `Progress`, `ExamAttempt`, `CohortInvitation`, `CohortAuditEvent`.
**Models mutated:** none.
**Notifications:** none.
**Audit events:** none (read-only).

---

## Flow 6 — Export report

**Actors:** Supervisor, co-supervisor, reporter (all have download permission per `permission_matrix.json`).

1. Supervisor (or reporter) navigates to the cohort dashboard and clicks "Exportar CSV".
2. UI POSTs to `/api/cohorts/[id]/export` with `{ reportType: "progress_summary", filters: {} }`.
3. Server validates:
   - Session present.
   - Caller has download permission (`COHORT_OWNER`, `COHORT_SUPERVISOR`, or `COHORT_REPORTER`).
   - Cohort is not deleted.
4. **Synchronous path (cohort ≤ 25 members):**
   - Server queries the same data as Flow 5.
   - Server builds the CSV: metadata preamble + one row per member.
   - Server applies formula-injection sanitisation to every cell.
   - Server responds 200 with `Content-Type: text/csv; charset=utf-8` and `Content-Disposition: attachment; filename="cohort_{id}_progress_{timestamp}.csv"`.
5. **Asynchronous path (cohort > 25 members):**
   - Server creates a `ReportExport` row (status `PENDING`).
   - Server returns 202 with `{ exportId }`.
   - A background job (Phase 7+) processes the export and sets `status = "COMPLETED"` + `artifactPath`.
   - For Phase 6, the asynchronous path is not implemented; cohorts are capped at 100 members and the synchronous path is used.
6. UI either downloads the CSV immediately (sync) or shows "Tu reporte se está generando. Te avisaremos cuando esté listo." (async).

**Models mutated (sync):** none.
**Models mutated (async, Phase 7+):** `ReportExport`, `Notification` (when complete).
**Notifications (async):** `report_ready`.
**Audit events:** `export_report` (Phase 7+).

---

## Flow 7 — Learner leaves cohort

**Actors:** Learner (member).

1. Learner navigates to `/cohorts/[id]` (their cohort view).
2. UI shows "Salir de la cohorte" button (with a confirmation modal).
3. Learner confirms.
4. UI POSTs to `/api/cohorts/[id]/leave` (or `DELETE /api/cohorts/[id]/membership` — TBD; Phase 6 uses `POST /api/cohorts/[id]/leave`).
5. Server validates:
   - Session present.
   - Caller is `COHORT_LEARNER` of this cohort (owners cannot leave without transferring ownership — Phase 7+; for Phase 6, owners cannot leave).
   - Membership `status === "ACTIVE"`.
6. Server updates `CohortMembership.status = "LEFT"`, `leftAt = now()`.
7. Server creates a `Notification` for the cohort owner (type `cohort_membership_removed`, body: *"{learnerFirstName} dejó la cohorte {cohortName}"*).
8. Server creates `CohortAuditEvent` (action `leave_cohort`, actorId = learner, targetType `membership`, targetId = membership.id).
9. UI redirects to `/cuenta` and shows "Saliste de la cohorte."

**Models mutated:** `CohortMembership`, `Notification`, `CohortAuditEvent`.
**Notifications:** `cohort_membership_removed` (to supervisor).
**Audit events:** `leave_cohort`.

---

## Flow 8 — Cohort archive / downgrade

**Actors:** Supervisor (owner), Admin.

### 8a. Owner-initiated archive

1. Supervisor navigates to cohort settings and clicks "Archivar cohorte".
2. UI shows a confirmation modal: *"Esta acción es reversible. La cohorte pasará a solo lectura."*
3. Supervisor confirms.
4. UI POSTs to `/api/cohorts/[id]/archive`.
5. Server validates: caller is `COHORT_OWNER`.
6. Server updates `Cohort.status = "ARCHIVED"`, `archivedAt = now()`.
7. Server creates `Notification` for all active members (type `cohort_archived`, body: *"La cohorte {cohortName} fue archivada. Tu progreso no se pierde."*).
8. Server creates `CohortAuditEvent` (action `archive_cohort`, actorId = owner).
9. UI shows "Cohorte archivada."

### 8b. Subscription-downgrade archive

- Triggered when a supervisor's subscription downgrades from Pro/Team to Free, or from Team to Pro (exceeding the new entitlement's cohort count).
- A webhook (Phase 7+) or a periodic sweep (Phase 6 fallback) marks the excess cohorts `ARCHIVED` with reason `SUBSCRIPTION_DOWNGRADE`.
- The 30-day grace period (`cohort_grace_period_ends_at`) is **not** a separate column in Phase 6 — the cohort is `ARCHIVED` immediately but not deleted; the membership rows remain `ACTIVE` so the supervisor can still export and the learners can still view (read-only).
- The audit log records `archive_cohort` with reason `SUBSCRIPTION_DOWNGRADE`.

### 8c. Restoration

- The owner can un-archive via `POST /api/cohorts/[id]/restore` (Phase 7+; for Phase 6 archived cohorts stay archived unless the supervisor re-upgrades and the admin manually restores).

**Models mutated:** `Cohort`, `Notification`, `CohortAuditEvent`.
**Notifications:** `cohort_archived` to all members.
**Audit events:** `archive_cohort`.

---

## Flow 9 — Admin suspends supervisor

**Actors:** Admin.

1. Admin reviews a supervisor (e.g. a complaint has been received).
2. Admin navigates to `/admin/supervisors` and clicks "Suspender".
3. UI shows a modal: reason (free text, required).
4. UI POSTs to `/api/admin/supervisor/[id]/suspend` with `{ reason }`.
5. Server validates: session present, `session.user.role === "ADMIN"`.
6. Server updates `SupervisorProfile.status = "SUSPENDED"`, `suspendedAt = now()`, `suspendReason = reason`.
7. Server **does not** archive the supervisor's cohorts — they remain `ACTIVE` but the supervisor can no longer create new cohorts or invite new learners. Existing members continue to access.
8. Server creates `Notification` for the supervisor (type `supervisor_suspended`, body: *"Tu cuenta de supervisor fue suspendida. Razón: {reason}"*).
9. Server creates `CohortAuditEvent` per cohort the supervisor owns (action `supervisor_suspended`, actorId = admin).

**Models mutated:** `SupervisorProfile`, `Notification`, `CohortAuditEvent`.
**Notifications:** `supervisor_suspended` to supervisor.
**Audit events:** `supervisor_suspended` per cohort.

---

## Flow 10 — Send nudge

**Actors:** Supervisor, co-supervisor.

1. Supervisor views the cohort dashboard and sees a learner with `lastActivity > 7 days`.
2. Supervisor clicks "Enviar recordatorio" next to that learner.
3. UI shows a modal: optional personal message (≤ 280 chars). Default message: *"¡Hola! Notamos que no has avanzado en {cohortName} esta semana. ¿Todo bien?"*
4. UI POSTs to `/api/cohorts/[id]/nudge/[userId]` (Phase 7+; not in Phase 6).
5. Server creates `Notification` for the learner (type `learner_nudge`, body: *"Tu supervisor en {cohortName} te envió un recordatorio."* + the personal message).
6. Server creates `CohortAuditEvent` (action `nudge_learner`, actorId = supervisor, targetType `user`, targetId = learner).

**Note:** For Phase 6, the nudge flow is **not** implemented (it requires a separate endpoint and rate-limiting logic). The dashboard surfaces inactive learners; the supervisor must contact them out-of-band. The flow is documented here for Phase 7+ planning.

**Models mutated (Phase 7+):** `Notification`, `CohortAuditEvent`.
**Notifications:** `learner_nudge`.
**Audit events:** `nudge_learner`.

---

## Cross-Flow Invariants

- Every mutation creates a `CohortAuditEvent`. Read-only flows do not.
- Every notification body is Stephen Fry redacted: only the actor's first name appears; no email, no ID, no PII.
- Every endpoint validates `IS_STATIC_SITE` and returns 404 if true.
- Every endpoint validates the caller's role via `src/lib/permissions.ts`; default deny.
- Every invitation token is 32 random bytes; the hash is stored; the raw token is shown to the supervisor exactly once.
- Every consent action records `consentVersion`; if the privacy matrix is updated, a new consent version is required for existing members (Phase 7+ re-consent flow).
