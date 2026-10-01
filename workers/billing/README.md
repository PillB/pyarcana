# PyArcana accounts worker (`workers/billing`)

A Cloudflare Worker with no npm dependencies: accounts, cookie sessions, email-code, Google and
Microsoft sign-in, progress sync, the 7-day trial, Pro gifts (fixed or indefinite), the tester
role, bug reports and the QA/admin views, export and deletion, Pro subscriptions through
Mercado Pago (PEN) and Creem (USD) with a charges ledger and reconciliation, the signed ES256
licence, anonymous events and A/B experiments with their admin results, satisfaction surveys and
the consent record. Storage is D1 only.

The binding design is `DESIGN-v2.md` as amended by `DESIGN-v3-delta.md` and `DESIGN-v3.md`
(kept outside the repository by the orchestrating session). This file says what is built, what
is not, and what only the owner can do. It is public: it names roles and role addresses on
PyArcana's domain, never a person's mailbox.

## Setup order

Everything runs on the owner's machine (Node >= 20, bun, a PyArcana checkout); the Cloudflare
API is not reachable from the build sandbox. Once the zone and the identity providers exist:

```bash
read -rs CLOUDFLARE_API_TOKEN && export CLOUDFLARE_API_TOKEN   # typed, not echoed
export CLOUDFLARE_ACCOUNT_ID=<account id from the dashboard>
workers/billing/scripts/setup.sh          # first run, and every later run (idempotent)
workers/billing/scripts/deploy.sh         # later deploys
workers/billing/scripts/setup.sh --rotate-key k2   # only to replace the licence key
```

The token needs two account permissions, both Edit: Workers Scripts and D1. With
`CLOUDFLARE_ACCOUNT_ID` set it needs no Account Settings:Read. Make a fresh token for the run and
revoke it afterwards.

`scripts/setup.sh`, in order:

1. Checks Node >= 20, `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID` before any wrangler call.
2. Finds the D1 database `pyarcana-accounts` with `wrangler d1 list --json` (never `d1 info`,
   which reads the placeholder as an id), or creates it, and writes its id into the LOCAL
   `wrangler.toml`. The repository keeps `TODO_REPLACE_WITH_D1_DATABASE_ID`
   (`tests/wrangler.test.mjs` checks it): do not commit the id.
   `git checkout -- workers/billing/wrangler.toml` restores the placeholder, and the next run
   writes the id again (it finds the database by name).
3. Stops while any `TODO_` value survives in `wrangler.toml`, before any secret or deploy.
4. Reads the Worker's secret names (`wrangler secret list`). "Worker not found" means none yet.
   Any other failure stops the script, so a secret that may exist is never replaced blindly.
5. Asks for `ADMIN_EMAILS` (comma-separated). Enter keeps the stored value, or skips it on a
   first run. A malformed list stops the script before anything is stored.
6. Licence key: when absent, or with `--rotate-key <new kid>`, it generates an ES256 pair. The
   private half is piped straight into `wrangler secret put LICENSE_PRIVATE_KEY_PKCS8_B64`, so it
   never reaches a file or the terminal. Rotation then writes the new `LICENSE_KEY_ID` into
   `wrangler.toml`.
7. `SERVER_PEPPER`: when absent, 32 random bytes are piped the same way. The script never rotates
   it, because every session, sign-in code, rate-limit key and hashed id is keyed by it.
8. `ADMIN_EMAILS` is piped into `wrangler secret put`.
9. Prints the PUBLIC JWK for `src/lib/cloud/config.ts` (`licence.publicKeys`). It prints before
   the deploy, so a failed deploy cannot lose it.
10. Runs `scripts/deploy.sh`.

`scripts/deploy.sh`:

1. Refuses while a `TODO_` placeholder is in `wrangler.toml`.
2. Runs `NEXT_PUBLIC_BASE_PATH= bun run build:static` at the repository root, then refuses unless
   `out/deployment.json` records base path `""`. `scripts/static_base_path.mjs` makes an empty
   value mean the root; the check guards against any build that would still land under `/pyarcana`.
3. Runs `node scripts/cloud-headers.mjs out` (`out/_headers`, `out/ads.txt`) when the script
   exists, and says so when it does not.
4. Runs `wrangler deploy` from `workers/billing/`.

Neither script ever pipes an interactive wrangler command. wrangler is interactive only when stdin
AND stdout are terminals, and a piped `deploy` answers its own questions with fallbacks. `secret
put` is always piped: it reads stdin when stdin is not a terminal.

Wrangler is `npx --yes wrangler@4.144.0`, the version whose source these scripts were checked
against: output shapes, `secret put` reading stdin, and draft-Worker creation. `WRANGLER_PKG`
overrides the version. `PYARCANA_WRANGLER` is the tests' fake-wrangler seam; leave it unset.
`tests/operator-scripts.test.mjs` runs both scripts under a real pty (`script -qec`, util-linux,
so Linux only) against `tests/wrangler-fake.mjs`, which copies wrangler 4.144.0's output shapes.
Nothing has run against the live Cloudflare API from here.

## Configuration: vars and secrets

`wrangler.toml` is public. `[vars]` holds only values that are safe to publish. Secrets are set
with `wrangler secret put` (by `setup.sh`, or by hand for the payment keys), never in a file.

| Kind | Name | Default / how to set |
|---|---|---|
| var | `ALLOWED_ORIGINS`, `CANONICAL_ORIGIN` | `https://pyarcana.dev`; local dev adds `http://localhost:3000` in `.dev.vars` (git-ignored) |
| var | `SITE_PATH` | `""` (served at the root) |
| var | `TERMS_VERSION` | owner fills it; empty = sign-in answers 503 |
| var | `TRIAL_DAYS`, `GRACE_DAYS`, `SESSION_MAX_DAYS` | `7`, `7`, `180` |
| var | `GOOGLE_CLIENT_ID`, `MICROSOFT_CLIENT_ID` | owner fills them (public by design) |
| var | `EMAIL_PROVIDER`, `EMAIL_FROM`, `EMAIL_FROM_NAME`, `EMAIL_DAILY_CAP` | `cloudflare`, `no-reply@pyarcana.dev`, `PyArcana`, `90` |
| var | `REPORT_ATTACHMENTS_CAP_MB`, `REPORT_TEXT_CAP_MB` | `200`, `100` |
| var | `PRICE_PE_MONTHLY_MINOR`, `PRICE_PE_YEARLY_MINOR`, `PRICE_US_MONTHLY_MINOR`, `PRICE_US_YEARLY_MINOR` | `1990`, `11990`, `799`, `4900` (integer minor units; must equal `src/lib/cloud/offer.ts`) |
| var | `CREEM_API_BASE`, `CREEM_PRODUCT_PRO_MONTHLY`, `CREEM_PRODUCT_PRO_YEARLY`, `MP_API_BASE` | live API bases; product ids filled by the owner |
| var | `LICENSE_KEY_ID`, `LICENSE_TTL_SECONDS`, `LICENSE_PREV_PUBLIC_JWK` | `k1`, `259200`, `""` (the old PUBLIC JWK during a rotation) |
| var | `EXPERIMENTS_ENABLED`, `EVENTS_ENABLED` | `""`, `"true"` |
| binding | `DB` (D1), `EMAIL` (`send_email`), `ASSETS` (static assets) | `wrangler.toml`; the D1 id is written locally by `setup.sh` |
| secret | `SERVER_PEPPER` | `setup.sh` (generated, piped) |
| secret | `LICENSE_PRIVATE_KEY_PKCS8_B64` | `setup.sh` (generated, piped; `--rotate-key` replaces it) |
| secret | `ADMIN_EMAILS` | `setup.sh` (typed at its prompt, piped) |
| secret | `MP_ACCESS_TOKEN`, `MP_WEBHOOK_SECRET`, `CREEM_API_KEY`, `CREEM_WEBHOOK_SECRET` | by hand: `npx wrangler secret put <NAME>` from `workers/billing/` |
| secret | `RESEND_API_KEY`, `BREVO_API_KEY`, `MAILERSEND_API_KEY` | only for the matching alternative `EMAIL_PROVIDER` |

`tests/wrangler.test.mjs` fails if any secret name is ever assigned in `wrangler.toml`, or if a
`@gmail.com` address appears there.

## Running the tests

```bash
node scripts/run_billing_tests.mjs               # worker + client suites + complexity gate
node scripts/run_billing_tests.mjs --only worker # this worker's suites only
```

- Worker suites: `workers/billing/tests/*.test.mjs`, `node:test` on Node >= 22.13, with a D1 fake
  on `node:sqlite` (`tests/d1-fake.mjs`). Every external call (JWKS, email) goes through an
  injected `fetchImpl`, and the clock through `now`.
- `tests/operator-scripts.test.mjs` runs `scripts/setup.sh` and `scripts/deploy.sh` under a pty
  with util-linux `script -qec`, so it needs Linux (CI); macOS's BSD `script` takes other flags.
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
| `GET /v1/jwks` | public | The licence verification keys: the current one (derived from the signing key) and `LICENSE_PREV_PUBLIC_JWK` during a rotation. 503 `license_not_configured` without a key. See "Licence". |
| `GET /v1/experiments` | public | `{experiments: [{key, arms, weights, surface}]}` for the keys in `EXPERIMENTS_ENABLED`; no id, no database. |
| `POST /v1/events` | public (CSRF) | `{cid, qa?, events: [<= 25]}`, 16 KB; see "Events and experiments". |
| `POST /v1/me/experiments/bind` | session | `{cid}`: links the measurement id to the account; answers the account's stored arms. 30/h. |
| `POST /v1/me/consents` | session | `{kind: "measurement", value: granted or denied, version, at}`: appends the consent record. 30/h. |
| `POST /v1/surveys` | optional session | `{kind, score?, reasonCode?, text?, sectionIndex?, cid?}`; see "Surveys". 20/h per network, 30/h per account. |
| `GET /v1/geo` | public | `{country}` from Cloudflare's `request.cf.country`: two letters, or null (none, junk, `XX` unknown, `T1` Tor). Nothing else from `request.cf` leaves the worker. For the ads region check (DESIGN-v3 §E). |
| `POST /v1/auth/email/start` | public | Emails a 6-digit code. Limits: 10/h and a daily share (cap / 9) per network, 5/h per email+network, 8/h per email, 3 live codes, `EMAIL_DAILY_CAP` per day. |
| `POST /v1/auth/email/verify` | public | Signs in with the code. 30/h per network; 20 attempts per email per UTC day, spent before comparing. |
| `POST /v1/auth/google` | public | `{idToken, noncePreimage, ageConfirmed, termsVersion}`. The nonce must be base64url(SHA-256(preimage)) and is single-use. |
| `POST /v1/auth/microsoft` | public | Same contract. No email-based linking (nOAuth). |
| `POST /v1/auth/logout` | optional session | `{everywhere?}`. |
| `GET /v1/me` | session | The me payload, including `account.identities` (masked) and `licenseToken` (see "Licence"). |
| `DELETE /v1/me` | session, recent auth | `{confirm: "DELETE"}`: cancels live subscriptions first, then erases and tombstones. |
| `GET /v1/me/export` | session, recent auth | Everything about the caller; 10 per hour. |
| `POST /v1/me/trial` | session | Starts the 7-day trial (one per person; anti-abuse claims). |
| `POST /v1/checkout` | session | `{provider, plan, payerEmail?, acceptTerms: true, adultOrAuthorized: true, force?}`: starts a Mercado Pago or Creem checkout; see "Payments". |
| `POST /v1/me/subscription/refresh` | session | Re-reads the provider for the caller's open checkouts and live subscriptions; the me payload plus `refresh: {ok}`. 30/h. |
| `POST /v1/me/subscription/cancel` | session | `{subscriptionId}`: cancels at the provider, re-reads, stores the confirmed state; 502 `cancel_failed` otherwise. |
| `POST /v1/webhooks/mercadopago` | provider (signed) | `x-signature` over the query `data.id`; the body is a pointer; the resource is re-read. |
| `POST /v1/webhooks/creem` | provider (signed) | `creem-signature` HMAC of the raw body; envelope ids deduplicated for ever. |
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
| `GET /v1/admin/experiments` | admin | Every registry entry: enabled flag, plan, raw exposures per arm, SRM. |
| `GET /v1/admin/experiments/results` | admin | `?key=`: the analysed sample; see "Events and experiments". |
| `GET /v1/admin/surveys` | admin | `?kind=`: aggregates and the 20 newest texts; see "Surveys". |

Admin means all of: the account's verified email is in `ADMIN_EMAILS` (read per request); the
session is younger than 12 hours; and it was created by a Google identity that belongs to this
account, for that same address, where Google is authoritative (`@gmail.com` or a Workspace `hd`).
Every admin request is audited (rate-limited ones excepted).

Scheduled: daily at 09:17 UTC the retention sweep (login codes, sessions, rate limits, stale open
checkouts, spent nonces, report screenshots) and the measurement sweep (events, arms and
bindings after 180 days, survey answers after 2 years), then reconciliation of every pending, active or
past_due subscription. Hourly at :07, reconciliation of recent rows (open checkouts and pending
subscriptions younger than 7 days). Each set is capped at 50 rows a run, least recently
reconciled first (`reconciled_at`, migration 5).

## Payments

DESIGN-v2 §4-§7. Provider field names come from vendor SDK and OpenAPI source (live docs were
unreachable from the build sandbox); the first live test on real test accounts is the proof.

- **Money** is integer minor units everywhere. Prices are the `PRICE_*` vars (Mercado Pago bills
  `PRICE_PE_*` in PEN, Creem bills `PRICE_US_*` in USD); `tests/money.test.mjs` checks they equal
  `src/lib/cloud/offer.ts`. Mercado Pago decimals become `Math.round(x * 100)` and are refused
  unless that is a safe integer; Creem amounts must already be integer cents.
- **Checkout.** Mercado Pago: `POST /preapproval` with `status: "pending"`, no plan,
  `external_reference: "pyarcana:<acct>:<chk>"`, `X-Idempotency-Key: <chk>`, `back_url`
  `CANONICAL_ORIGIN + SITE_PATH + /cuenta/?billing=return&checkout=<chk>`; a PENDING subscription
  row is stored with the checkout (pending never entitles). Creem: `POST /v1/checkouts` with
  `request_id: <chk>` and `metadata: {account_id, checkout_id}`; the subscription row is created
  by `checkout.completed`. Refusals, in order: 429 (10/h, refusals included), 400
  `terms_required`, `bad_provider`, `bad_plan`, `provider_not_configured`, `bad_payer_email`,
  `payer_email_required`, 409 `rail_country_mismatch` (advisory on `request.cf.country`: Mercado
  Pago for PE or unknown, Creem outside PE; an admin's `force` overrides it and is audited), 409
  `already_subscribed`, and 502 `provider_unavailable` (checkout expired).
- **Ledger.** `charges` is UNIQUE on (provider, provider charge id); the subscription row, the
  charges, `subscription_events` (append-only, only for real changes), audit lines and the
  `webhook_events` marker are written in ONE `db.batch` after the provider read, so a duplicate
  delivery re-applies the same state. Paid-through comes from approved charges without a refund
  or chargeback (`access.mjs`). A Mercado Pago charge's period is fixed when it is first seen
  approved: it starts at the previous clean period's end when approved within `GRACE_DAYS` of
  it (no drift), else at approval, and lasts the plan's calendar months. Creem states its own
  period. `canceled` is terminal; a status older than the stored provider time is ignored.
- **Mercado Pago mapping** (one test per row in `tests/webhook-mp.test.mjs`): preapproval pending
  -> pending; authorized -> active (first_active_at at the first approved charge); paused ->
  past_due; cancelled -> canceled; payment approved -> charge approved; rejected, pending,
  in_process, cancelled -> a charge with that status, never entitling; refunded ->
  `refunded_at`; charged_back -> `charged_back_at`; in_mediation -> flagged, still entitling,
  audited; a partial refund -> no change, audited. The payment and the authorized payment of one
  collection share the payment id, so they are one ledger row. A full refund or chargeback also
  cancels the preapproval (re-read confirmed; a failure answers 502 so the delivery is retried).
- **Creem mapping** (`tests/webhook-creem.test.mjs`): checkout.completed -> subscription row
  (sub id -> account stored) + the first charge when the order names its transaction;
  subscription.active -> active; .paid -> charge approved with Creem's period; .past_due ->
  past_due; .scheduled_cancel -> cancel_at_period_end; .canceled and .expired -> canceled;
  .trialing -> ignored; refund.created -> `refunded_at` (partial: no change, audited);
  dispute.created -> `charged_back_at`; a full refund or dispute cancels the subscription.
- **Binding.** A resource counts only when it names one of OUR checkouts for the same account
  with the same product (Creem), net price, currency and cadence; anything else answers 200 and
  writes `webhook.unmatched` (no email in it). A deleted account is never entitled: its charges
  are flagged `refund_due`, the provider object is cancelled, and `webhook.deleted_account` is
  audited for a manual refund. A second renewing subscription on one account writes
  `double_subscription`; it is not auto-cancelled.
- **Cancel.** The buyer's cancel is Mercado Pago `PUT /preapproval/{id} {status: "cancelled"}`
  (immediate; access runs to paid-through, no grace) or Creem `mode: "scheduled"`. Account
  deletion and the refund policy cancel Creem with `mode: "immediate"`.

## Licence

DESIGN-v3-delta D-ORCH-03, a port of Vocal Studio's `license.js` (`src/license.mjs`). When the
browser cannot reach the worker it grants Pro only while a token this worker signed verifies
against the public keys pinned in the site config (`src/lib/cloud/licence.ts`); live `/v1/me`
always wins, so a revocation takes effect on the next load that reaches the worker.

- Compact JWS, header `{alg: "ES256", typ: "PAL", kid: LICENSE_KEY_ID}`; claims `iss:
  "pyarcana-billing"`, `sub` (account id), `aud` (`CANONICAL_ORIGIN`), `plan: "pro"`, `source`,
  `iat`, `exp`, `indefinite`. Signature raw r||s (64 bytes).
- `exp = min(now + LICENSE_TTL_SECONDS, accessEnd)`; an indefinite access runs on the TTL. The TTL
  defaults to 72 h and is clamped to 60 s..72 h (the browser refuses longer tokens).
- `licenseToken` is null when the account is not Pro, when `CANONICAL_ORIGIN` is empty, or when the
  key is missing or unusable (logged by error name only, never the key). `/v1/me` never fails
  because of the licence: without a key, offline Pro simply does not exist (fail closed).
- One secret: the public key is derived from `LICENSE_PRIVATE_KEY_PKCS8_B64`; the imported key is
  cached per isolate and per secret, and one payload signs once.
- `scripts/generate-keys.mjs [kid]` prints the private key (for `wrangler secret put`), the public
  JWK (for the site config `licence.publicKeys`) and the `LICENSE_KEY_ID` line. Nothing is written
  to disk.

## Events and experiments

DESIGN-v3 §F, trimmed from Vocal Studio's `events.js` and `stats.js`.

- Registry (`src/experiments.mjs`): `aa_2026_q4` (a/b, surface `gate_or_home`, 200 per arm),
  `pkg_ab_v1` (a/b, `gate`, 400), `ads_house_v1` (none/house, `ad_slot`, 400); equal weights, 14
  days minimum, primary metric `trial_14d`. The control is `arms[0]`. Nothing runs until its key
  is in `EXPERIMENTS_ENABLED`.
- `POST /v1/events`: GPC (`Sec-GPC: 1`), DNT, a missing or bot user agent, and `EVENTS_ENABLED =
  "false"` answer 202 and store nothing. Then 600 requests/h per network, the batch shape (400
  `bad_cid`, `bad_events`, `bad_qa`), 60 requests/h per id. Allowlisted names only (the client's
  eleven); an event with an unknown key, a bad token or a section outside 1..999 is dropped and
  counted in `{accepted, dropped}`. An `exposure` is kept only for an enabled experiment's
  registered arm and records the id's FIRST arm (intent to treat).
- The id is never stored: `cid_hash = HMAC(SERVER_PEPPER, "cid:" + cid)`. A bind links an id to an
  account (the first binding of an id wins; the account keeps its first arm per experiment).
- Results (`src/experiment-results.mjs`): unit = exposed id. Exclusions at read time, first match
  wins: admin (listed, verified address), tester (role or tester grant), gift holder, an id that
  sent QA-mode events. Metrics over the 14 days after the first exposure: trial started (grant,
  through the binding), paid (approved charge, not refunded or charged back), D7 return (an event
  on days 7-13). Rates count only ids exposed at least 14 days ago. Wilson 95 % intervals,
  Newcombe differences against the control, SRM chi-square flagged at p < 0.001, arm-switch rate.
  The plan gate: every arm has `minPerArm` matured ids and the first exposure is `minDays` old;
  before that only `exposed` is returned, and no comparison.

## Surveys

DESIGN-v3 §G (`src/surveys.mjs`). `section_csat` score 1..5, `nps` 0..10, `gate_reason` and
`cancel_reason` a code from the client's lists; text at most 500 characters; the optional `cid`
is stored hashed. Admin aggregates: CSAT n, mean with a normal 95 % interval and the score split;
NPS n, score, interval from 30 answers, promoters/passives/detractors; reasons counted per code;
the 20 newest texts (never the account). Answers are kept 2 years and are exported and deleted
with the account, as are the consent records and the measurement rows of every id bound to it.

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

- Payments, named gaps: the Polar adapter; a Creem customer-portal link in the me payload
  (`manageUrl` is null for Creem; `POST /v1/customers/billing` exists but is not called); Mercado
  Pago's dedicated chargeback topic (`topic_chargebacks_wh` / `chargebacks` is acknowledged and
  ignored; a chargeback is applied from the payment's `charged_back` status); legacy IPN
  deliveries without a query `data.id` (400); Creem `subscription.unpaid`, `.paused` and
  `.update` events (ignored; a re-read maps `unpaid` to past_due); verifying the Creem return
  URL's `signature` (the return page calls refresh, an API read, instead); resubscribing or
  switching plan while a cancelled period still runs (409 `already_subscribed`); refunds
  themselves (manual, in the provider dashboards); an admin view of `double_subscription` and
  `webhook.deleted_account` beyond the audit rows.
- Measurement, named gaps: a consent withdrawal stores the record only; server-side erasure of
  the id's past rows on withdrawal is not built (the browser forgets its id and stops sending;
  account deletion erases them). The `ads_house_v1` guardrail metrics (sections completed per
  active user per week, CLS) are not computed; results show trial, paid and D7 only. Vocal's
  per-day ingest counters (`ingest_daily`) are not ported: drops are reported per request only.
  The plan gate is fixed-horizon: reading results repeatedly after it is met, or across three
  metrics, is not corrected for multiple looks. Survey aggregates exclude nobody (the client sends
  none in QA mode) and have no date filter. The health route has no licence flag; the JWKS route
  is the check.
- A live run of `setup.sh` / `deploy.sh`. They are tested only against a fake wrangler that copies
  wrangler 4.144.0's source, under a pty. The first real run on the owner's machine is the proof.
  In particular, creating the Worker as a draft on the first `secret put` (before the first
  deploy) is read from wrangler's source (`createDraftWorker`, fallback "yes" when not
  interactive). Vocal Studio's live-proven order was deploy first, then secrets.
- Automatic `LICENSE_PREV_PUBLIC_JWK` on rotation. `setup.sh --rotate-key` prints what to keep,
  and the owner pastes the old public JWK into `wrangler.toml` and the site config.
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

1. Run `workers/billing/scripts/setup.sh` (see "Setup order"). It creates the D1 database, writes
   its id into the local `wrangler.toml`, and sets `SERVER_PEPPER`, `ADMIN_EMAILS` and the licence
   key. For `ADMIN_EMAILS` use an address Google is authoritative for, such as a Gmail address.
   It then deploys. By hand, the same steps are `npx wrangler d1 create pyarcana-accounts`, the
   id pasted into `wrangler.toml`, and `npx wrangler secret put` for each secret, with the value
   typed at wrangler's prompt.
2. With the default `EMAIL_PROVIDER = "cloudflare"` no email key is needed; with an alternative,
   set its key.
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
5. One origin (DESIGN-v3 §A, §K): `workers/billing/scripts/deploy.sh` (the static build at the
   root, `out/_headers`, `wrangler deploy`). Attach `pyarcana.dev` as a Workers Custom Domain; the
   zone must be on Cloudflare first (`docs/HOSTINGER_SETUP.md` has the pointer). `run_worker_first`
   as a list needs a recent wrangler 4. It needs the root-build fix (see "Not built yet").
6. Google Cloud console: an OAuth web client with the site origin as an authorized JavaScript origin.
7. Microsoft Entra: an app registration ("Any Entra ID Tenant + Personal Microsoft accounts",
   authority `common`, D-USER-05), SPA platform, redirect URI `https://pyarcana.dev/cuenta`
   exactly.
8. After the first deploy, open one Workers Logs entry and confirm which request fields it keeps
   (not verifiable from here).
9. Payments, Mercado Pago (Peru): create the application in "Tus integraciones", set
   `MP_ACCESS_TOKEN` (`npx wrangler secret put MP_ACCESS_TOKEN`), configure the webhook URL
   `https://pyarcana.dev/api/v1/webhooks/mercadopago` for the topics Payments and Subscriptions
   (preapproval and authorized payments), and put its "secret signature" in `MP_WEBHOOK_SECRET`.
   Then prove with test users (buyer and seller must both be test users): one sandbox
   `POST /preapproval` in PEN succeeds (the vendor sources disagree on Peru availability), the
   buyer authorizes at `init_point`, the webhook arrives signed and the account turns Pro; a
   refund from the dashboard ends access and cancels the preapproval.
10. Payments, Creem: create the two products (monthly, yearly) in USD at exactly
    `PRICE_US_MONTHLY_MINOR` / `PRICE_US_YEARLY_MINOR`, paste their ids into
    `CREEM_PRODUCT_PRO_MONTHLY` / `CREEM_PRODUCT_PRO_YEARLY`, set `CREEM_API_KEY` and, after adding
    the webhook `https://pyarcana.dev/api/v1/webhooks/creem`, `CREEM_WEBHOOK_SECRET` (the whole
    `whsec_...` string). Use `CREEM_API_BASE = "https://test-api.creem.io"` with test keys first.
    Decide the products' tax mode (the worker compares the NET price) and keep the store's default
    cancel mode irrelevant: the worker always sends `mode` explicitly.
11. Workers Paid is already needed for Email Sending; reconciliation also needs its subrequest
    allowance (a Mercado Pago row costs two or three subrequests, 50 rows per set per run).
12. Licence key: `setup.sh` generates it and pipes the private half into the secret. Put the
    public JWK it prints into the site config `licence.publicKeys`, and after deploy check that
    `GET /api/v1/jwks` lists that kid. For rotation, run `setup.sh --rotate-key <new kid>`: it
    writes the new `LICENSE_KEY_ID`. Keep the old public JWK in the site config and in
    `LICENSE_PREV_PUBLIC_JWK` for at least 72 h. The manual path, `node scripts/generate-keys.mjs
    k1` plus a paste at wrangler's prompt, still works. It prints the private key to the terminal,
    so clear the scrollback afterwards.
13. Experiments: enable one at a time by adding its key to `EXPERIMENTS_ENABLED` and redeploying;
    run `aa_2026_q4` first and read its SRM before trusting any other result. The consent text
    and `consent.mode` are a legal decision (DESIGN-v3 §F keeps `everywhere` until a lawyer says
    otherwise).

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
- Payments: Creem charges are keyed by the TRANSACTION id (the id refunds and disputes carry), so
  `checkout.completed` records the first charge only when its order names the transaction;
  otherwise `subscription.paid` (the event Creem recommends for access) records it. A partial
  Creem refund is treated like a partial Mercado Pago refund (no change, audited). Creem amounts
  are compared as NET prices (product `price`, transaction `amount`), tax excluded.
- Payments: the Mercado Pago marker is (topic, data.id, x-request-id), and a redelivery re-reads
  and re-applies the current state; Creem envelope ids are refused as duplicates for ever.
  The rail/country check reads only Cloudflare's `request.cf.country`; a `country` in the
  checkout body (DESIGN-v2 lists it) is ignored, because the client could send anything.
  Unknown providers answer 400 `bad_provider` (DESIGN-v2 names only `bad_plan` and
  `provider_not_configured`). Refresh also answers `refresh: {ok}` beside the me payload. No
  cancel-confirmation email is sent (DESIGN-v3-delta: no voluntary promises).
- Payments: two DIFFERENT charges of one Mercado Pago subscription processed at the same instant
  could both chain from the same previous period and overlap by up to one period (the buyer's
  loss). Mercado Pago collects a subscription at most once a cycle, so this needs two collections
  within seconds; it is accepted, not prevented.
- Stage 2c: the consent record route is `POST /v1/me/consents` (plural), the path the client
  already calls (`src/lib/cloud/consent-sync.ts`); the orchestration brief said `/v1/me/consent`.
  Every call appends a row (a history), and `at` is stored as the browser sent it.
- Stage 2c: `experiment_arms` is keyed by (subject, experiment), not by subject alone as
  DESIGN-v3 §F writes it, so one id can be in several experiments; `subject_kind` tells an id
  from an account copy. `events.qa` carries the client's QA-mode flag; the client sends none in
  QA mode today, so the exclusion is a guard.
- Stage 2c: `EVENTS_ENABLED` is a kill switch (only `"false"` turns ingest off; `wrangler.toml`
  says `"true"`), as in Vocal; `EXPERIMENTS_ENABLED` is opt-in (empty = nothing runs). An
  exposure for a disabled experiment is dropped, so switching an experiment off stops enrolment.
- Stage 2c: exclusions count anything EVER held (a tester role or grant, a gift grant), not only
  what was active at exposure; an excluded id is dropped from both SRM and metrics. Paid counts
  an approved charge without a later refund or chargeback. Consent records and survey answers
  under a bound id are deleted with the account (the record exists to justify processing that
  ends with the account).
- Stage 2c: the licence TTL ceiling is 72 h (Vocal allowed 30 days) because the browser refuses
  longer tokens; the subject is the account id (Vocal used a bearer licence id).
- Stage 2d: `setup.sh` stores the secrets BEFORE the first deploy, so the first live version
  already has `SERVER_PEPPER` and the licence key, and a rotated key ships with its new kid in the
  same run. Vocal Studio deployed first. Its script swallowed every `secret list` failure; this
  one swallows only "Worker not found" and stops on any other failure, so an unreadable list can
  never regenerate `SERVER_PEPPER`.
- Stage 2d: `CLOUDFLARE_ACCOUNT_ID` is required, not optional as in Vocal. It removes the
  `wrangler whoami` / Account Settings:Read path. `setup.sh` does not look up the workers.dev
  subdomain and does not curl the Worker afterwards: the product is served on the custom domain,
  and `deploy.sh` prints the two URLs to check. The public JWK is printed, never written to the
  repository.
- Stage 2d: the licence key id for `--rotate-key` must be new and is written into `wrangler.toml`
  only after the secret upload succeeds. A failed upload leaves the old kid and key in place.
- The JWKS fetch is aborted after 5 s with an AbortController and a cleared timer (the same abort
  as `AbortSignal.timeout`, without an unref'd timer).
