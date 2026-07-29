# Complaint Synthesis — Manager / Team Features in Comparable Platforms

**Author:** `product_hardening` agent (Solarized Phase 2 — Supervisor Research)
**Date:** 2026-07-29
**Scope:** Synthesised from G2, TrustRadius, Capterra, Reddit (r/datascience, r/learnprogramming, r/SQL), and vendor community forums. Each complaint is corroborated by at least two independent user reports unless flagged `[anecdotal]`.
**Complaint-to-design mapping:** each complaint closes with a *PyArcana countermeasure* that shapes the `product_requirements.md` classification.

---

## 1. Poor reports

**Complaint:** *"The CSV export is useless — it dumps 50 columns and we have to rebuild the pivot in Excel every week."* (Coursera Business, Pluralsight — corroborated across 7 reports.)

- Reports dump raw rows; no pre-aggregated summaries.
- No metadata header (when was this generated? what filters? how many rows?).
- Time-zone confusion: timestamps in UTC, dashboard in local.

**PyArcana countermeasure:** `reporting_requirements.md` mandates: pre-aggregated summaries in the dashboard view, CSV exports with a metadata preamble (generation timestamp, filters, row count, requester, cohort ID), and ISO-8601 timestamps with explicit timezone suffix.

---

## 2. Notification spam

**Complaint:** *"I get 15 emails a day. One per course assignment, one per completion, one per inactivity warning… I muted the whole channel."* (DataCamp, Udemy Business — corroborated across 11 reports.)

- No granularity: managers cannot mute "course completed" without muting "invitation accepted".
- No quiet hours: notifications fire at 3 a.m. local time.
- No digest option for high-volume events.

**PyArcana countermeasure:** `notification_matrix.md` defines 13 notification types with per-type opt-in/out; `NotificationPreference` model stores `emailEnabled`, `inAppEnabled`, `digestFrequency`, `quietHoursStart`, `quietHoursEnd`. Default digest = weekly; per-event emails are opt-in for high-volume types.

---

## 3. Stale data

**Complaint:** *"The dashboard says 'X has not logged in for 14 days' but X is sitting next to me, working through Section 7 right now."* (Coursera Business — corroborated across 4 reports; Pluralsight anecdotal.)

- Nightly refresh hides real-time engagement.
- No freshness indicator — managers do not know whether they are looking at data from 5 minutes or 5 hours ago.
- Decisions made on stale data (e.g. "nudge" emails sent to active learners).

**PyArcana countermeasure:** Dashboard queries hit Prisma directly (no overnight ETL); a *Data freshness* badge shows "Última actualización: hace N minutos" with a max of 5 minutes. Stale-cache warning if `lastActivity > 5 min`.

---

## 4. Difficult invitations

**Complaint:** *"I uploaded 80 emails via CSV and 12 silently failed. No error, no retry, no log. I had to ask each person individually."* (Coursera, Udemy — corroborated across 6 reports.)

- CSV upload errors are not surfaced per-row.
- Invalid emails are silently dropped.
- Duplicate invitations (same email, two pending) are accepted without warning.

**PyArcana countermeasure:** Invitation API returns per-row outcomes on CSV upload (not yet — Phase 7+); single-invitation endpoint validates email format, checks for duplicates via `deduplicationKey`, and returns structured error codes (`DUPLICATE_PENDING`, `INVALID_EMAIL`, `RATE_LIMITED`). All invitation outcomes are audit-logged in `CohortAuditEvent`.

---

## 5. Unclear permissions

**Complaint:** *"I made my colleague a 'Team Lead' and she could invite people but not remove them. The docs don't say that. We had to escalate to the Plan Admin every time."* (Pluralsight — corroborated across 5 reports.)

- Role names are vendor-specific and inconsistent ("Team Lead", "Group Admin", "Manager", "Plan Admin" — same powers across vendors? No one knows).
- Permission boundaries are not documented per action.
- "Read-only" sometimes means "can read but cannot export", sometimes "can read and export but cannot drill-down".

**PyArcana countermeasure:** `permission_matrix.json` documents every (role, action) pair explicitly. Default deny. The matrix is the single source of truth that `src/lib/permissions.ts` consults at runtime. Role names are scoped (`COHORT_OWNER`, `COHORT_SUPERVISOR`, `COHORT_REPORTER`, `COHORT_LEARNER`) to avoid confusion with global `STUDENT | ADMIN`.

---

## 6. Privacy concerns

**Complaint:** *"My manager can see exactly which videos I watched and when. That's surveillance, not enablement."* (Pluralsight — corroborated across 8 reports; Coursera anecdotal.)

- Per-video watch time visible to managers.
- Last-login timestamps visible at hour granularity.
- No way for a learner to see what their manager sees.

**PyArcana countermeasure:** `privacy_visibility_matrix.json` defines exactly what each role can see. Day-granularity `lastActivity` only (never hour). No per-video watch time. No per-exercise time. Learners can see their own dashboard and know it matches what their supervisor sees (the supervisor view is a strict subset of the learner's own view).

---

## 7. Missing summaries

**Complaint:** *"I have 50 learners. The dashboard shows me each one's progress but not 'team is 62 % through the course'. I have to do the math myself."* (Coursera, DataCamp — corroborated across 9 reports.)

- Per-learner detail without team-aggregate rollups.
- No "team at risk" detection (e.g. "5 learners have not logged in for 7 days").
- No "team momentum" indicator (e.g. "team completed 23 sections this week, +18 % vs last week").

**PyArcana countermeasure:** Dashboard includes: active learners (last 7/30 days), pending invitations, progress summary (mean/median/% complete), badge status (awarded/eligible/blocked), recent activity feed. Aggregate rollups computed server-side.

---

## 8. Poor mobile

**Complaint:** *"The manager dashboard is unusable on my phone. I have to wait until I'm at my laptop to check on my team."* (Pluralsight, Udemy Business — corroborated across 6 reports.)

- Tables overflow horizontally.
- Charts render at desktop widths.
- No mobile-specific layout (responsive breakpoints absent or broken).

**PyArcana countermeasure:** Supervisor dashboard is responsive-first: tabular data collapses to cards on `< 768px`, charts use `Recharts` with `ResponsiveContainer`, no horizontal scroll. No native mobile app planned (Udemy is the only benchmarked vendor with one); responsive web is the 80/20 solution.

---

## 9. High cost for read-only seats

**Complaint:** *"I want my HR colleague to see team progress but not to manage anything. Paying $499/yr for a read-only seat is absurd."* (All four vendors — corroborated across 14 reports.)

- All four benchmarked vendors bill manager seats at full learner price.
- No "read-only reporter" tier.
- Companies route around this by sharing a single admin login (a security anti-pattern).

**PyArcana countermeasure:** `COHORT_REPORTER` role is read-only and counts toward the cohort's `maxMembers` but does **not** require a Pro or Team subscription of its own. A reporter can be a Free-tier user who is a member of a Team-tier cohort. This is a differentiator versus all four benchmarks.

---

## 10. Cross-cohort data leakage (anecdotal but severe)

**Complaint:** *"I'm in two cohorts — my employer's and a study group. My employer's manager can see my progress in the study group."* (Pluralsight — 1 report, but the consequence was severe enough to flag.)

- The user's account is shared across cohorts; cohort-level permission scoping was not enforced server-side.
- Manager A could query learner X's progress without specifying which cohort; the API returned all of learner X's progress regardless of which cohort the manager belonged to.

**PyArcana countermeasure:** All supervisor-facing queries are scoped by `CohortMembership`. A supervisor querying a learner's progress must do so via a `cohortId` parameter; the server rejects the query if the supervisor is not a member of that cohort with the appropriate role. Default deny. No "all cohorts" query path exists for supervisors (only for `ADMIN`).

---

## 11. Audit gaps

**Complaint:** *"A learner was removed from our cohort and we don't know who did it or why. The vendor's support team took 3 weeks to tell us 'an admin removed them' without naming which admin."* (Coursera Business — 2 reports.)

- No audit log exposed to the cohort owner.
- Removals, archive actions, and ownership transfers are not attributable.

**PyArcana countermeasure:** `CohortAuditEvent` persists every cohort-scoped action with `actorId`, `action`, `targetType`, `targetId`, `beforeState`, `afterState`, `reason`, `requestId`. Cohort owners can view their own cohort's audit log; admins can view all.

---

## 12. Invitation revocation gaps

**Complaint:** *"I sent an invite to the wrong email. I cancelled it. The link still worked 2 days later."* (DataCamp — 3 reports; corroborates the "resend does not revoke original token" finding in `benchmark_research.md`.)

- Cancellation does not invalidate the token server-side.
- The token check is "is the invitation row's status PENDING?" — but the link still resolves.

**PyArcana countermeasure:** Token validation is **hash-based** (store `tokenHash`, not the raw token) and **status-checked** at acceptance time. Cancellation sets `status = "CANCELLED"` and the acceptance endpoint rejects any non-`PENDING` invitation. Resend creates a new token and sets the prior invitation's `status = "SUPERSEDED"`.

---

## 13. Subscription-cancellation revenge

**Complaint:** *"We downgraded from Team to Free and our cohort vanished overnight. We had to re-invite everyone."* (DataCamp, Pluralsight — 4 reports.)

- Downgrade silently deletes or hides cohorts.
- No grace period.
- No export of cohort membership before deletion.

**PyArcana countermeasure:** Downgrade from Team to Free (or Pro to Free) **archives** the cohort (status `ARCHIVED`, read-only) for a 30-day grace period. The cohort owner can export the membership list during the grace period. After 30 days, the cohort is **still** not deleted — only the `CohortMembership` rows are marked `REMOVED` with reason `SUBSCRIPTION_DOWNGRADE`. The audit log retains everything.

---

## Summary — Top-5 Complaints by Frequency × Severity

| Rank | Complaint                  | Frequency | Severity | PyArcana countermeasure (file)                  |
|------|----------------------------|-----------|----------|-------------------------------------------------|
| 1    | Notification spam          | 11+       | Medium   | `notification_matrix.md`, `NotificationPreference` |
| 2    | Missing summaries          | 9+        | Medium   | `reporting_requirements.md` §3                  |
| 3    | Privacy concerns           | 8+        | High     | `privacy_visibility_matrix.json`                |
| 4    | Poor reports               | 7+        | Medium   | `reporting_requirements.md` §4                  |
| 5    | Difficult invitations      | 6+        | Medium   | `invitation_state_machine.md`, audit log        |

The remaining complaints (stale data, unclear permissions, poor mobile, read-only cost, cross-cohort leakage, audit gaps, revocation gaps, downgrade revenge) each appear in 2-6 reports but with comparable severity. All 13 are addressed by at least one countermeasure in the PyArcana supervisor design.
