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
works (local dev, provider webhooks). The same worker serves the static site: `wrangler.toml`
declares Workers Static Assets (`[assets]`, directory `../../out`, binding `ASSETS`,
`run_worker_first = ["/api/*"]`, `not_found_handling = "404-page"`), and `src/index.mjs` hands
any path outside `/api`, `/api/*`, `/v1` and `/v1/*` to `ASSETS` when the binding exists (else
the JSON 404). Every state-changing request needs `X-PyArcana: 1` and an
allowed `Origin` (403 `bad_origin`). Answers are JSON `{ok, ...}` or `{ok: false, reason}`.

| Route | Access | What it does |
|---|---|---|
| `GET /v1/health` | public | Booleans only: db, pepper, terms, email, google, microsoft, mercadopago, creem, origins. |
| `GET /v1/auth/methods` | public | Which sign-in methods work, the client ids, trialDays. |
| `GET /v1/geo` | public | `{country}` from Cloudflare's `request.cf.country`: two letters, or null (none, junk, `XX` unknown, `T1` Tor). Nothing else from `request.cf` leaves the worker. For the ads region check (DESIGN-v3 §E). |
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

## Sign-in email

`EMAIL_PROVIDER` picks exactly one provider; a key for another provider is never a fallback.

| `EMAIL_PROVIDER` | Needs | Notes |
|---|---|---|
| `cloudflare` (the documented default, D-USER-04) | the `send_email` binding `EMAIL` in `wrangler.toml`, `EMAIL_FROM` | Cloudflare Email Sending; Workers Paid (3,000 messages a month included). A thrown binding error is `email_unavailable`; only its `.code` is logged. |
| `resend` | `RESEND_API_KEY`, `EMAIL_FROM` | Alternative. |
| `brevo` | `BREVO_API_KEY`, `EMAIL_FROM` | Alternative. |
| `mailersend` | `MAILERSEND_API_KEY`, `EMAIL_FROM` | Alternative. |
| `dev-log` | every allowed origin `http://localhost[:port]` | Local end-to-end only: prints the code, sends nothing. |

Every provider shares `EMAIL_DAILY_CAP` (default 90 a day). The Hostinger SMTP provider of
DESIGN-v3 §K is dropped (D-USER-04): Hostinger mailbox credentials never go into the worker.

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
  record.
- The one-origin deploy script `scripts/deploy.sh` (DESIGN-v3 §A: static build at the root,
  `out/_headers` and `out/ads.txt`, then `wrangler deploy`). The `[assets]` block and the worker's
  fall-through to `ASSETS` are built; until the script exists the owner runs the three steps by
  hand.
- JWKS and authority URL overrides for an end-to-end mock identity provider (DESIGN-v3 §B allows
  them only when every allowed origin is localhost). The worker has no override at all: it always
  uses Google's and Microsoft's real JWKS URLs.
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
2. Set the secrets from `workers/billing/`: `SERVER_PEPPER` (`openssl rand -base64 32`) and
   `ADMIN_EMAILS` (use a Gmail address: Google is authoritative for it). With the default
   `EMAIL_PROVIDER = "cloudflare"` no email key is needed; with an alternative, set its key.
3. Prefilled for `https://pyarcana.dev` (DESIGN-v3 §K): `ALLOWED_ORIGINS`, `CANONICAL_ORIGIN`,
   `SITE_PATH`, `EMAIL_PROVIDER`, `EMAIL_FROM`, `EMAIL_FROM_NAME`. Still to fill: `TERMS_VERSION`,
   `GOOGLE_CLIENT_ID`, `MICROSOFT_CLIENT_ID`. Local development overrides them in
   `workers/billing/.dev.vars` (git-ignored), for example
   `ALLOWED_ORIGINS=http://localhost:3000` and `EMAIL_PROVIDER=dev-log`.
4. Cloudflare Email Sending (D-USER-04): move the account to Workers Paid, onboard `pyarcana.dev`
   to Email Sending (its records go on the `cf-bounce` subdomain, so the Hostinger MX, SPF, DKIM
   and DMARC records stay as they are) and verify `no-reply@pyarcana.dev` as a sender. The
   `[[send_email]]` binding in `wrangler.toml` may send only from that address; if `EMAIL_FROM`
   changes, change `allowed_sender_addresses` with it. Send one code to yourself after deploy:
   this sandbox cannot reach Cloudflare, so the live send is unproven here.
5. One origin (DESIGN-v3 §A, §K): build the static export at the root
   (`NEXT_PUBLIC_BASE_PATH= bun run build:static`, which writes `out/`), then `npx wrangler deploy`
   from `workers/billing/`, and attach `pyarcana.dev` as a Workers Custom Domain (the zone must be
   on Cloudflare first). `run_worker_first` as a list needs a recent wrangler 4.
6. Google Cloud console: an OAuth web client with the site origin as an authorized JavaScript origin.
7. Microsoft Entra: an app registration ("Any Entra ID Tenant + Personal Microsoft accounts",
   authority `common`, D-USER-05), SPA platform, redirect URI `https://pyarcana.dev/cuenta`
   exactly.
8. After the first deploy, open one Workers Logs entry and confirm which request fields it keeps
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
- `EMAIL_PROVIDER` left empty still means "not configured" (fail closed): `cloudflare` is the
  default only in `wrangler.toml`, not a silent fallback in code.
- The Microsoft authority (`common`, D-USER-05) is not a worker var: it is the client's
  `microsoftAuthority`. The worker verifies every token against the common JWKS and the token's own
  tenant issuer, which covers `common`, `organizations` and `consumers` alike.
- `GET /v1/geo` answers `country: null` for `XX` (unknown) and `T1` (Tor), not just for a missing
  value, so an unplaceable caller gets house ads.
- The JWKS fetch is aborted after 5 s with an AbortController and a cleared timer (the same abort
  as `AbortSignal.timeout`, without an unref'd timer).
