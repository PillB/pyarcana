# Cohort State Machine — PyArcana Cohorts

**Author:** `product_hardening` agent (Solarized Phase 2)
**Date:** 2026-07-29
**Scope:** Lifecycle of a `Cohort` row. The state machine is enforced server-side by the cohort API routes; no client-side state transition is trusted.

---

## States

| State      | Meaning                                                                                              |
|------------|------------------------------------------------------------------------------------------------------|
| `ACTIVE`   | The cohort is operational. Members can be added/removed; invitations can be sent; exports can run. |
| `ARCHIVED` | The cohort is read-only. Memberships remain but no new invitations can be sent. Existing members can still view their own progress and the supervisor can still view the dashboard and export historical data. No mutations permitted except un-archive (Phase 7+). |

---

## Transitions

```
                 ┌──────────────────────────┐
                 │      (row created)       │
                 └────────────┬─────────────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   ACTIVE    │◀────────┐
                       └──────┬──────┘         │
                              │                │ un-archive
                              │ archive        │ (Phase 7+;
                              │ (owner or      │  admin-only
                              │  subscription  │  in Phase 6)
                              │  downgrade)    │
                              ▼                │
                       ┌─────────────┐         │
                       │  ARCHIVED   │─────────┘
                       └─────────────┘
```

### Transition rules

| From     | To        | Trigger                                                                                  | Actor                     | Side effects                                                                                                                                |
|----------|-----------|------------------------------------------------------------------------------------------|---------------------------|----------------------------------------------------------------------------------------------------------------------------------------------|
| (none)   | `ACTIVE`  | `POST /api/cohorts` (create)                                                             | Owner (supervisor)        | Create `Cohort` row; create `CohortMembership` for owner with role `COHORT_OWNER`; audit `create_cohort`                                     |
| `ACTIVE` | `ARCHIVED`| `POST /api/cohorts/[id]/archive` (owner-initiated)                                       | Owner                     | Set `Cohort.status = "ARCHIVED"`, `archivedAt = now()`; notify all active members; audit `archive_cohort` with reason `OWNER_INITIATED`      |
| `ACTIVE` | `ARCHIVED`| Subscription downgrade sweep (owner's plan drops below entitlement required for cohort)  | System (cron / webhook)   | Same as above but reason = `SUBSCRIPTION_DOWNGRADE_*`; grace period of 30 days applies (cohort stays `ARCHIVED` but is not deleted)          |
| `ACTIVE` | `ARCHIVED`| Admin force-archive (e.g. ToS violation)                                                 | Admin                     | Same as above but reason = `ADMIN_FORCE_ARCHIVE`                                                                                              |
| `ARCHIVED`| `ACTIVE` | `POST /api/cohorts/[id]/restore` (Phase 7+)                                              | Admin (or owner if subscription allows) | Set `Cohort.status = "ACTIVE"`, clear `archivedAt`; notify all active members; audit `restore_cohort`                                       |

### Forbidden transitions

- `ARCHIVED` → `ARCHIVED`. No-op; return 409.
- `ACTIVE` → `ACTIVE`. No-op; return 200 (idempotent re-archive attempt should fail clearly with 409 in Phase 6; in Phase 7+, if reason differs, log a new audit event but do not transition).
- Any state → deleted. Cohorts are never hard-deleted (see `entitlement_matrix.json` `deletionPolicy: "never_auto_delete"`). A future admin-only hard-delete flow is Phase 8+ and would require its own ADR.

---

## Permissions Per State

| Action                          | `ACTIVE` | `ARCHIVED` |
|----------------------------------|----------|------------|
| `cohort:view`                    | ✅       | ✅         |
| `cohort:rename`                  | ✅       | ❌         |
| `cohort:update_description`      | ✅       | ❌         |
| `cohort:archive`                 | ✅       | ❌         |
| `cohort:restore`                 | ❌       | ✅ (Phase 7+) |
| `cohort:invite_learner`          | ✅       | ❌         |
| `cohort:cancel_invitation`       | ✅       | ✅ (only for `PENDING` invitations; new invites blocked) |
| `cohort:resend_invitation`       | ✅       | ❌         |
| `cohort:remove_learner`          | ✅       | ❌ (Phase 6; Phase 7+ allows removal from archived cohorts with reason) |
| `cohort:add_co_supervisor`       | ✅       | ❌         |
| `cohort:remove_co_supervisor`    | ✅       | ❌         |
| `cohort:view_progress`           | ✅       | ✅         |
| `cohort:view_assessment_summary` | ✅       | ✅         |
| `cohort:view_badge_eligibility`  | ✅       | ✅         |
| `cohort:download_badge`          | ✅       | ✅         |
| `cohort:download_report`         | ✅       | ✅         |
| `cohort:send_nudge`              | ✅       | ❌         |
| `cohort:view_audit_log`          | ✅       | ✅         |
| `cohort:view_members`            | ✅       | ✅         |
| `cohort:view_dashboard`          | ✅       | ✅ (read-only; "Última actualización" indicator shows archived timestamp) |
| `cohort:leave` (learner)         | ✅       | ✅         |

When the cohort is `ARCHIVED`:

- All write actions return 423 Locked with `{"error": "COHORT_ARCHIVED"}`.
- Read actions continue to work but the dashboard shows an "Archivada" badge and the data-freshness indicator turns red (frozen at `archivedAt`).
- Learners can still leave (they are not trapped). The owner cannot remove them (Phase 6; the only way to clear an archived cohort's roster is the Phase 7+ restore + remove flow).

---

## Subscription Downgrade Handling

When a supervisor's subscription changes, a sweep (Phase 7+ webhook; Phase 6 fallback is a periodic sweep on `GET /api/supervisor/status`) checks:

1. Is the supervisor's `SupervisorProfile.status === "APPROVED"`?
2. Is the supervisor's active subscription plan lower than the entitlement recorded on `SupervisorProfile.entitlement`?
   - If yes, the supervisor is "over-entitled". The sweep:
     a. Updates `SupervisorProfile.entitlement` to the new plan.
     b. If the new plan is `FREE`, archives all cohorts.
     c. If the new plan is `PRO` (from `TEAM`), archives all but the first cohort (the most recently active one is kept; others are archived).
     d. Notifies the supervisor and all affected members.
     e. Audit `archive_cohort` with reason `SUBSCRIPTION_DOWNGRADE_*`.

The 30-day grace period (`cohortArchiveGraceDays: 30` in `entitlement_matrix.json`) means:

- The cohort stays `ARCHIVED` (not deleted) for at least 30 days.
- During the grace period, the owner can export member lists and the dashboard remains viewable (read-only).
- After the grace period, the cohort **remains** `ARCHIVED`. The grace period is a minimum, not a maximum.
- If the supervisor re-upgrades within the grace period, the cohorts can be restored (Phase 7+) without loss of data.

---

## Audit Events

Every transition creates a `CohortAuditEvent` row:

| Action              | When                                              | `actorId`           | `reason` example                       |
|---------------------|---------------------------------------------------|---------------------|----------------------------------------|
| `create_cohort`     | `ACTIVE` first set                                | Owner               | (none)                                 |
| `archive_cohort`    | `ACTIVE → ARCHIVED`                               | Owner / Admin / System | `OWNER_INITIATED` / `ADMIN_FORCE_ARCHIVE` / `SUBSCRIPTION_DOWNGRADE_TEAM_TO_PRO` |
| `restore_cohort`    | `ARCHIVED → ACTIVE` (Phase 7+)                    | Admin / Owner       | `SUBSCRIPTION_UPGRADE` / `OWNER_REQUEST` |

The audit event's `beforeState` and `afterState` are JSON snapshots of the `Cohort` row (excluding the `visibilityJSON` and `reportingJSON` blobs, which can be large; those are stored as a hash in the audit event for tamper-evidence).

---

## Edge Cases

1. **Owner downgrades mid-invitation:** A `PENDING` invitation exists when the cohort is archived. The invitation remains `PENDING` but acceptance is blocked (the acceptance route checks `Cohort.status === "ACTIVE"`). The supervisor must cancel the invitation or wait for it to expire.
2. **Owner suspended mid-cohort:** The cohort stays `ACTIVE`. The owner can still view but cannot invite (suspension blocks `cohort:invite_learner`). Co-supervisors (if any) cannot invite either (only the owner can invite in Phase 6).
3. **Cohort has 0 members after archive:** The cohort remains `ARCHIVED` with the owner as the only member. This is a valid state.
4. **Cohort has 100 members at archive time:** All 100 memberships remain `ACTIVE`. The dashboard continues to work. No data loss.
5. **Two cohorts owned by the same supervisor, both archived due to downgrade:** Both cohorts remain `ARCHIVED`. The owner can still view both (read-only). If the owner re-upgrades to Team, both can be restored (Phase 7+).
6. **Restoration attempt on a cohort whose owner is no longer a supervisor:** The restore route (Phase 7+) checks `SupervisorProfile.status === "APPROVED"` and the cohort count is under the entitlement limit. If the owner is no longer a supervisor, restore is blocked.
7. **Concurrent archive attempts:** The archive route uses optimistic concurrency (`@updatedAt`); the first request wins, subsequent requests see `status === "ARCHIVED"` and return 409.
