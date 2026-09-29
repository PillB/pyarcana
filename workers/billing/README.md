# PyArcana accounts worker (`workers/billing`)

A Cloudflare Worker with no npm dependencies: accounts, cookie sessions, email-code, Google and
Microsoft sign-in, progress sync, the 7-day trial, Pro gifts (fixed or indefinite), the tester
role, bug reports and the QA/admin views, export and deletion. Storage is D1 only.

The binding design is `DESIGN-v2.md` as amended by `DESIGN-v3-delta.md` and `DESIGN-v3.md`
(kept outside the repository by the orchestrating session). This file says what is built, what
is not, and what only the owner can do.

## Running the tests

```bash
node scripts/run_billing_tests.mjs               # worker + client suites + complexity gate
node scripts/run_billing_tests.mjs --only worker # this worker's suites only
```

- Worker suites: `workers/billing/tests/*.test.mjs`, `node:test` on Node >= 22.13, with a D1 fake
  on `node:sqlite` (`tests/d1-fake.mjs`). Every external call (JWKS, email) goes through an
  injected `fetchImpl`, and the clock through `now`.
- Client suites: `src/lib/cloud/__tests__/*.test.ts` through `--import tsx`.
- Complexity gate: ESLint `complexity` at 15 over this worker, the runner, `src/lib/cloud` and
  `src/components/account`.
- Every suite has a floor (its test count when the floor was set); a missing file, a failing test
  or a suite below its floor fails the run. An unlisted test file fails the runner's own guard.
- CI runs it through `npm run test:adversarial:node`.

## Routes

The API is served at `/api/v1/...` on the site's own origin (DESIGN-v3 §A); bare `/v1/...` also
works (local dev, provider webhooks). Every state-changing request needs `X-PyArcana: 1` and an
allowed `Origin` (403 `bad_origin`). Answers are JSON `{ok, ...}` or `{ok: false, reason}`.

| Route | Access | What it does |
|---|---|---|
| `GET /v1/health` | public | Booleans only: db, pepper, terms, email, google, microsoft, mercadopago, creem, origins. |
| `GET /v1/auth/methods` | public | Which sign-in methods work, the client ids, trialDays. |
| `POST /v1/auth/email/start` | public | Emails a 6-digit code. Limits: 10/h and a daily share (cap / 9) per network, 5/h per email+network, 8/h per email, 3 live codes, `EMAIL_DAILY_CAP` per day. |
| `POST /v1/auth/email/verify` | public | Signs in with the code. 30/h per network; 20 attempts per email per UTC day, spent before comparing. |
| `POST /v1/auth/google` | public | `{idToken, noncePreimage, ageConfirmed, termsVersion}`. The nonce must be base64url(SHA-256(preimage)) and is single-use. |
| `POST /v1/auth/microsoft` | public | Same contract. No email-based linking (nOAuth). |
| `POST /v1/auth/logout` | optional session | `{everywhere?}`. |
| `GET /v1/me` | session | The me payload, including `account.identities` (masked). |
| `DELETE /v1/me` | session, recent auth | `{confirm: "DELETE"}`: cancels live subscriptions first, then erases and tombstones. |
| `GET /v1/me/export` | session, recent auth | Everything about the caller; 10 per hour. |
| `POST /v1/me/trial` | session | Starts the 7-day trial (one per person; anti-abuse claims). |
| `GET /v1/me/progress` | session | The synced progress document. |
| `PUT /v1/me/progress` | session | Compare-and-swap on `rev`; 256 KiB. |
| `POST /v1/reports` | optional session | A bug report with up to 3 screenshots (see "Stated deviations" for the byte budgets). |
| `GET /v1/me/reports` | session | The caller's reports and their status. |
| `GET /v1/qa/reports` | tester or admin | All reports without reporter identity; filters and a keyset cursor. |
| `GET /v1/qa/reports/:id` | tester or admin | One report and its attachment metadata. |
| `GET /v1/qa/reports/:id/attachments/:aid` | tester or admin | The image bytes, sniff-checked, `nosniff`, sandbox CSP. |
| `POST /v1/me/link/google` | session, recent auth | Adds Google; audited and notified to the proven address. |
| `POST /v1/me/link/microsoft` | session, recent auth | Adds Microsoft; audited and notified. |
| `DELETE /v1/me/identities/:provider` | session, recent auth | Removes a Google or Microsoft method, ends its sessions, never the last way in. |
| `POST /v1/admin/grants` | admin | `{email or accountId, days: 1..3650 or null, kind: gift or tester, note?, requestId}`. |
| `POST /v1/admin/grants/revoke` | admin | `{grantId, reason}`; idempotent. |
| `GET /v1/admin/grants` | admin | Who holds which kind of Pro, in which state. |
| `POST /v1/admin/roles` | admin | `{email or accountId, role: tester, days or null, note?}`. |
| `POST /v1/admin/roles/revoke` | admin | `{accountId, role, reason}`. |
| `GET /v1/admin/roles` | admin | The testers list. |
| `GET /v1/admin/account` | admin | `?id=` only; an address in the URL is refused. |
| `POST /v1/admin/account/lookup` | admin | `{email or accountId}`: everything about one account. |
| `POST /v1/admin/accounts/disable` | admin | `{email or accountId, reason}`: disables and ends every session. |
| `POST /v1/admin/accounts/enable` | admin | Undoes a disable. |
| `POST /v1/admin/accounts/email` | admin | `{accountId, newEmail, reason}`: rectification (stored unproven). |
| `GET /v1/admin/reports` | admin | Reports with contact and account email. |
| `PATCH /v1/admin/reports/:id` | admin | `{status?, adminNote?, duplicateOf?}`. |

Admin means all of: the account's verified email is in `ADMIN_EMAILS` (read per request); the
session is younger than 12 hours; and it was created by a Google identity that belongs to this
account, for that same address, where Google is authoritative (`@gmail.com` or a Workspace `hd`).
Every admin request is audited (rate-limited ones excepted).

Scheduled: daily at 09:17 UTC the retention sweep (login codes, sessions, rate limits, stale open
checkouts, spent nonces, report screenshots). The hourly cron does nothing yet.

## Not built yet

Named undone work; nothing below exists in the code today.

- Payments: `POST /v1/checkout`, `POST /v1/me/subscription/refresh`,
  `POST /v1/me/subscription/cancel`, `POST /v1/webhooks/mercadopago`, `POST /v1/webhooks/creem`,
  and the provider adapters. Until then account deletion answers 502 `cancel_failed` for an
  account that still has a pending, active or past_due subscription (none can exist yet).
- The hourly provider reconciliation (the cron entry is a no-op).
- The licence token (DESIGN-v3-delta D-ORCH-03): `GET /v1/jwks`, `licenseToken` in the me payload,
  the signing key and `scripts/generate-keys.mjs`.
- Experiments and events (DESIGN-v3 §F): `GET /v1/experiments`, `POST /v1/events`,
  `POST /v1/me/experiments/bind`, `GET /v1/admin/experiments`, `GET /v1/admin/experiments/results`.
- Satisfaction surveys (DESIGN-v3 §G): `POST /v1/surveys`, `GET /v1/admin/surveys`; the consents
  record; `GET /v1/geo` for the ads region check.
- The SMTP email provider for the Hostinger mailbox (DESIGN-v3 §K); today: resend, brevo,
  mailersend, or dev-log for localhost.
- The one-origin deployment: the `[assets]` block in `wrangler.toml` and `scripts/deploy.sh`
  (DESIGN-v3 §A). The worker already strips `/api`.
- Turnstile in front of email codes and anonymous reports (DESIGN-v2 §0 lists it as out of scope);
  per-network daily shares bound the abuse instead.
- A route that proves an email address on an existing account (for example a Microsoft-only
  account); admins target such accounts by `accountId`.
- The admin web page's address lookup must use the POST lookup route, never an address in a URL
  (client stage).
- A retention rule for report text, and an admin route to delete old reports. Until then, once
  `REPORT_TEXT_CAP_MB` is reached, new reports get 507 until the owner deletes rows in D1
  (`npx wrangler d1 execute`), and nothing alerts the admin that the ceiling was reached.

## Owner steps

Only the owner can do these; nothing here is deployed.

1. Create the database, paste its id into `wrangler.toml`: `npx wrangler d1 create pyarcana-accounts`.
2. Set the secrets from `workers/billing/`: `SERVER_PEPPER` (`openssl rand -base64 32`),
   `ADMIN_EMAILS` (use a Gmail address: Google is authoritative for it), and the key of the email
   provider named in `EMAIL_PROVIDER`.
3. Fill the public vars: `ALLOWED_ORIGINS`, `CANONICAL_ORIGIN`, `TERMS_VERSION`, `EMAIL_PROVIDER`,
   `EMAIL_FROM`, `GOOGLE_CLIENT_ID`, `MICROSOFT_CLIENT_ID`. Local development overrides them in
   `workers/billing/.dev.vars` (git-ignored).
4. Google Cloud console: an OAuth web client with the site origin as an authorized JavaScript origin.
5. Microsoft Entra: an app registration (any tenant and personal accounts), SPA platform, redirect
   URI `https://<domain>/cuenta` exactly.
6. After the first deploy, open one Workers Logs entry and confirm which request fields it keeps
   (not verifiable from here).

## Stated deviations

Each one is a decision someone may want to revisit.

- Admin is bound to the admin's own Google identity (see "Routes"); a listed admin with any other
  session gets 401 `reauth_required`. An `ADMIN_EMAILS` account links only a Google identity for
  its own address (409 `admin_identity_mismatch`).
- A Google address Google is not authoritative for (not `@gmail.com`, no `hd`) is display-only on
  a new account, like a Microsoft address: it is not stored as proven, never counts for admin or
  trial claims, and an email-code sign-in for that address creates a separate account.
- A revoked grant keeps the stretch it already covered; later grants re-flow from the revocation.
- Trial claims are plain INSERTs in the same batch as the grant: a racing second trial fails whole.
- Rate limits count networks: an IPv4 address, or an IPv6 /64. One network gets at most a ninth of
  `EMAIL_DAILY_CAP` in codes per day, and 5 anonymous reports per day. A classroom behind one NAT
  shares those.
- Report screenshots: 10 MiB per account and 20 MiB for all anonymous reports per UTC day, and a
  global ceiling `REPORT_ATTACHMENTS_CAP_MB` (default 200). Past a limit the report text is still
  stored and the answer is 201 with `attachmentsDropped` and `attachmentsReason`
  (`attachment_budget` or `storage_full`), not an error. Screenshots are deleted 90 days after
  their report is closed, or 180 days after it was filed.
- Report text: each report is charged `text_bytes`, the UTF-8 size of its text plus 256 bytes per
  row. Per UTC day: 512 KiB per account; 64 KiB per network and 1 MiB for all anonymous reports
  (429 `rate_limited` with `budget: "report_text"`). A global ceiling `REPORT_TEXT_CAP_MB`
  (default 100) is checked inside the report INSERT; past it a new report gets 507
  `report_storage_full` and nothing is stored. With the screenshot ceiling, reports can take at
  most ~315 MB of D1 Free's 500 MB. Report text is never swept: the ceiling is its only bound.
- The admin's free-text reason is kept in the audit row as `adminReason`, with email-shaped words
  replaced by `[email]`.
- `POST /v1/admin/accounts/enable` and `accountId` targeting are additions to DESIGN-v2.
- The JWKS fetch is aborted after 5 s with an AbortController and a cleared timer (the same abort
  as `AbortSignal.timeout`, without an unref'd timer).
