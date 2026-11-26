# Redeploy pyarcana.dev, step by step

This is the click-by-click version of "Setup order" in [`README.md`](README.md). Follow it top to
bottom on the owner's computer. Every step says where to go, which account to be signed in with,
what to click or type, what you should see, and what to do if you see something else.

Menu names were checked on 23 Nov 2026 (the Account API token screens on 24 Nov, from the owner's own dashboard) against the official documentation linked under each step
("Docs:"). Dashboards change; if a button has moved, the linked page is the current source of
truth, and this file should be updated to match.

This file is public. It names no person's mailbox and holds no token, id or secret. Where it says
"your Cloudflare email" or "your admin Gmail", use the address you know; never paste it into this
repository.

## What you need, and which account each part uses

| Part | Site | Signed in as |
|---|---|---|
| Source code and the Pages preview | <https://github.com> | The GitHub account that owns `PillB/pyarcana` (login `PillB`) |
| API token, account ID, rollback, Bot Fight Mode | <https://dash.cloudflare.com> | The Cloudflare account that owns the zone `pyarcana.dev` and the Worker `pyarcana-billing`, signed in with your Cloudflare email |
| Google sign-in check | <https://console.cloud.google.com> | The Google account that owns the Google Cloud project holding PyArcana's OAuth client |
| The deploy itself | Terminal on your computer | Your own user; no account. The token is pasted at a hidden prompt |

pyarcana.dev is **one Cloudflare Worker** (`pyarcana-billing`) that serves both the static site and
the API. It is not a Cloudflare Pages project, so you will not find it under "Pages"; it is listed
under **Workers & Pages** as a Worker. GitHub Pages (<https://pillb.github.io/pyarcana/>) is a
separate preview of the same `main`, with accounts always off.

---

## Before you start

Do these once per deploy, in this order. None of them changes the live site.

### B1. Check that `main` is green on GitHub

1. Open <https://github.com/PillB/pyarcana> and check the avatar in the top-right corner is the
   `PillB` account. If not, click the avatar → **Sign out**, then sign in as `PillB`.
2. Click **Pull requests** (under the repository name). Any PR that must ship in this deploy has
   to be merged first: open it, scroll to the bottom, and use the merge button (**Merge pull
   request**, or the drop-down → **Squash and merge**, whichever the repository offers). Confirm.
   - You should see: the PR's label turns purple and says **Merged**.
   - If the button is grey and says checks are failing or a review is required: do not merge.
     Open the failing check from the PR's **Checks** tab and fix it first.
3. Click **Actions** (under the repository name). In the left sidebar click **Tests**. The newest
   run on branch `main` must have a green check mark.
4. In the left sidebar click **Deploy to GitHub Pages**. The newest run must be green too. This
   workflow only starts after **Tests** passes on `main`, so a grey "skipped" run means its commit
   was not the newest one or its tests failed; look at the newer run.
5. Open <https://pillb.github.io/pyarcana/> and spot-check the pages you changed. This is the
   preview of what you are about to put on pyarcana.dev.

Docs: [Merging a pull request](https://docs.github.com/en/pull-requests/how-tos/merge-and-close-pull-requests/merging-a-pull-request) ·
[Viewing workflow run history](https://docs.github.com/en/actions/how-tos/monitor-workflows/view-workflow-run-history) ·
[Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
(Settings → Pages → Source must read **GitHub Actions**; set once, check only if the preview is missing).

### B2. Check the tools on your computer

Open **Terminal** (macOS: Spotlight, type "Terminal", Enter). Type each line, press Enter, and
compare.

```
node --version
bun --version
git --version
```

- `node` must print `v22` or newer (`setup.sh` stops below 22; the worker's own tests need 22.13 or
  newer). If it is missing or older, install the LTS build from <https://nodejs.org/en/download>,
  close Terminal, open it again, and re-check.
- `bun` must print a version. The repository pins `1.3.4` (`packageManager` in `package.json`);
  newer versions work since `package.json` lists `@prisma/client` and `prisma` under
  `trustedDependencies`. If `bun` is missing, install it from <https://bun.com/docs/installation>;
  to get exactly 1.3.4 there: `curl -fsSL https://bun.com/install | bash -s "bun-v1.3.4"`.
- `git` must print a version. If macOS offers to install the developer tools instead, accept, wait,
  and re-check.

Docs: [Node.js downloads](https://nodejs.org/en/download) ·
[Bun installation](https://bun.com/docs/installation) ·
[Set up Git](https://docs.github.com/en/get-started/git-basics/set-up-git)

### B3. Find your deploy checkout

Deploy from the separate deploy folder (`pyarcana-deploy`), not from the folder you edit in.
`redeploy.sh` refuses to run if that folder has edits other than the local D1 id in
`workers/billing/wrangler.toml`.

On the owner's Mac the deploy folder is `~/Documents/GitHub/pyarcana-deploy`, a git **worktree**
of the editing folder `~/Documents/GitHub/pyarcana`: both share one repository, and git lets only
one of them have `main` checked out. `main` lives in `pyarcana-deploy`. So in the editing folder
`git checkout main` fails with `fatal: 'main' is already used by worktree at '…/pyarcana-deploy'`,
and every command after it runs on whatever that folder had checked out (on 25 Nov 2026: an old
local commit without `redeploy.sh`). If you see that message, nothing was deployed: `cd` into
`pyarcana-deploy` and start this step again. `git worktree list` shows both folders and the
branch each holds.

```
cd ~/path/to/pyarcana-deploy
git status --short
git fetch origin
git checkout -- workers/billing/wrangler.toml
git checkout main
git pull --ff-only origin main
grep -n 'DEPLOY_BRANCH=' workers/billing/scripts/redeploy.sh
```

- `git status --short` should show nothing, or only ` M workers/billing/wrangler.toml`. Both are
  fine (the D1 id `setup.sh` writes; the next lines drop it and the deploy writes it again).
- **Fetch before you deploy.** `git status` says "Your branch is up to date with 'origin/main'"
  even when the checkout has not talked to GitHub for weeks: it compares with the last fetch, not
  with GitHub. An old checkout runs an old `redeploy.sh`, which can stop with
  `STOP: this checkout is on "main", but pyarcana.dev deploys from "claude/gifted-lamport-8ddc84"`
  (that branch was retired on 9 Nov 2026). The `grep` line must show
  `DEPLOY_BRANCH="${PYARCANA_DEPLOY_BRANCH:-main}"`, and `echo "$PYARCANA_DEPLOY_BRANCH"` must print
  an empty line; if it prints a branch name, run `unset PYARCANA_DEPLOY_BRANCH`.
- If `git pull` says "Not possible to fast-forward": the deploy folder has local commits. Do not
  deploy from it; make a fresh clone (next point) and deploy from that.
- If `cd` says "No such file or directory", find the folder in Finder (search for
  `pyarcana-deploy`), or make a fresh one:
  `git clone https://github.com/PillB/pyarcana.git ~/pyarcana-deploy` then `cd ~/pyarcana-deploy`.
- If `git status` lists other files: open them and decide. `git checkout -- <file>` discards one
  file's edits; commit or stash anything you want to keep. Never run `git checkout -- .`.

Docs: [Cloning a repository](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)

### B4. Sign in to Cloudflare and copy the account ID

1. Open <https://dash.cloudflare.com/login> and sign in with your Cloudflare email (plus the
   two-factor code if you set one).
2. If several accounts are listed, pick the one whose **Domains** list shows `pyarcana.dev`.
3. Copy the account ID, either way:
   - Press `Cmd + K` (Windows/Linux: `Ctrl + K`), type `Copy account ID`, and select the result; or
   - Left menu **Workers & Pages** → on the right, **Account Details** → copy button next to
     **Account ID**.
4. While you are on **Workers & Pages**, check that `pyarcana-billing` is in the list. If it is
   not, you are in the wrong account: go back to step 2.

The account ID is a 32-character hexadecimal string. It is not a secret, but keep it out of the
repository anyway; `setup.sh` asks for it.

Docs: [Find account and zone IDs](https://developers.cloudflare.com/fundamentals/account/find-account-and-zone-ids/)

### B5. Make a fresh, short-lived Cloudflare API token

Make a new token for each deploy and delete it after. Rolling an old token keeps its permissions
and policy ("the access and permissions will be the same", per Cloudflare's docs); the docs do not
say that rolling resets an expiry date that has already passed, so for a token that has expired,
create a new one instead.

Cloudflare offers two kinds of token, and `setup.sh` accepts both (it checks a user token at
`/user/tokens/verify` and an account token at `/accounts/<id>/tokens/verify`). Pick one route.

**What the token needs (Cloudflare's current Workers roles, checked 24 Nov 2026).**

- **Workers Editor, on the Workers product (all Workers).** Cloudflare's Workers roles page lists
  `Editor` as the minimum for `wrangler deploy` of an existing Worker, `wrangler secret put` and
  `wrangler rollback`. `pyarcana-billing` already exists, so `Admin` (needed only to create a new
  Worker) is not required. The deploy keeps the existing `pyarcana.dev` Custom Domain unchanged,
  which `Editor` allows; it would need `Workers Routes Write` on the zone only to add, change or
  remove one.
- **D1 Write.** Workers roles do not cover D1. `setup.sh` lists the D1 databases to find
  `pyarcana-accounts`, and creates it if it is missing; Write covers both.
- Nothing else. **Workers Scripts Write/Edit** is a *legacy* permission: Cloudflare says it is
  being replaced by `Editor` at the Workers product scope. It still works and has no deprecation
  date, but new tokens should use `Editor`. Do not add both.

**Route A, Account API token (recommended; what the current dashboard leads to).** It belongs to
the account, not to your login.

1. In the Cloudflare dashboard, check the account name at the top of the left menu is the account
   from B4. Press `Cmd + K` (quick search), type `Account API tokens`, and open it (the docs call
   the page **Manage Account → API Tokens**; the left menu's layout moves, the search does not).
   Click **Create token**.
2. Name it `pyarcana-redeploy-YYYY-MM-DD` instead of the generated name.
3. Permissions: **Workers Editor** for all Workers in the account, and **D1 Write**. Remove any
   legacy **Workers Scripts** permission.
4. Expiration: the shortest offered (for example 7 days). IP address filtering: leave it allowing
   all addresses (your home IP can change mid-deploy).
5. The **Review token** page must show: the account name (for example "Entire PyArcana
   account"), the expiration, and under **Permission policies** only `Workers Editor` and
   `D1 Write`. Anything else: click **Back to edit** and remove it.
6. Click **Create token**, then copy it (step 8 below).

**Route B, user token.** It belongs to your login.

1. Open <https://dash.cloudflare.com/profile/api-tokens> (or the account menu at the top right →
   **My Profile** → **API Tokens**) and click **Create Token**.
2. At the bottom, under **Custom token**, click **Get started** (the docs call it "start from
   scratch"). Do not use the "Edit Cloudflare Workers" template: it grants more than the deploy
   needs.
3. **Token name**: `pyarcana redeploy YYYY-MM-DD` (today's date).
4. **Permissions**: the Workers **Editor** role for all Workers, and `Account` · `D1` · `Edit`.
   If this page offers only the legacy `Account` · `Workers Scripts` · `Edit`, that still works
   (see above). With the account ID passed separately, the token needs no `Account Settings`.
5. **Account Resources**: `Include` · the account from B4.
6. **Token expiration**: set the end date to tomorrow, so a forgotten token dies on its own.
   Leave **Client IP Address Filtering** empty.
7. Click **Continue to summary**. You should see one account and exactly the two permissions
   above. If not, click **Back** and fix them. Then click **Create Token**.

**Both routes:**

8. Copy the token with the copy button. New tokens start with `cfut_`. **It is shown only once.**
   Keep it in your password manager or on the clipboard until the deploy prompt asks for it;
   never paste it into a file, chat, issue or commit.
   - If you close the page before copying: delete that token (step D3) and make another.

Docs: [Workers roles and permissions](https://developers.cloudflare.com/workers/authorization/workers/) ·
[Create API token](https://developers.cloudflare.com/fundamentals/api/get-started/create-token/) ·
[API token permissions](https://developers.cloudflare.com/fundamentals/api/reference/permissions/) ·
[Roll tokens](https://developers.cloudflare.com/fundamentals/api/how-to/roll-token/)

### B6. Check Bot Fight Mode is off on `pyarcana.dev`

Bot Fight Mode can challenge the site's own API calls ("may challenge API or mobile app traffic"),
and it cannot be scoped to skip `/api/`.

1. In the Cloudflare dashboard, left menu **Domains** → click `pyarcana.dev`.
2. Left menu **Security** → **Settings**.
3. Filter by **Bot traffic**.
4. Find **Bot fight mode**. It must be **off**. If it is on, switch it off.

Docs: [Bot Fight Mode](https://developers.cloudflare.com/bots/get-started/bot-fight-mode/)

### B7. Check Google sign-in's audience

1. Open <https://console.cloud.google.com/auth/audience>, signed in with the Google account that
   owns PyArcana's Google Cloud project. Use the project picker at the top to select that project.
2. Under **Publishing status** you should see **In production**.
3. If it reads **Testing**, click **Publish app** and confirm.

What this changes: per Google's docs, an app that asks only for name, email and profile
(`openid`, `email`, `profile`, as Sign in with Google does) is not limited to listed test users
even in Testing. PyArcana asks only for those, so Testing does not lock testers out; In production
is still the right state for a public site, and Google asks for no verification for these scopes.

Docs: [Manage App Audience](https://support.google.com/cloud/answer/15549945?hl=en)

### B8. Know which sign-up mode you will deploy

`deploy.sh` reads `~/.config/pyarcana/holder` on this computer (README, Owner steps 14).

```
ls -l ~/.config/pyarcana/holder
```

- File present and filled → the deploy prints `Sign-up: OPEN`.
- "No such file or directory" → `Sign-up: CLOSED`: only `ADMIN_EMAILS` and accounts you grant a
  role can get in. That is the safe default; it is not an error.

---

## The deploy

### D1. Run `redeploy.sh`

In Terminal, in the deploy checkout from B3. Always deploy with `redeploy.sh`, never with
`deploy.sh` on its own: only `redeploy.sh` pulls `main` first. On 25 Nov 2026 a `deploy.sh` run
from a checkout one merge behind put the previous commit live while GitHub Pages showed the new one.

```
git checkout -- workers/billing/wrangler.toml
git checkout main
workers/billing/scripts/redeploy.sh
```

It runs four numbered stages. What you should see, and what to answer:

1. `1/4  Checking the branch` → `On main, no other local changes.`
   If it says `STOP: this checkout is on "..."` or lists local changes: nothing was changed. Do
   what the message says, then run it again.
2. `2/4  Updating to the latest main` → a line `Deploying: <commit> <title> (<date>)`.
   **Write this commit down**: it is what will be live. It must be the newest commit on `main` from
   B1.
3. `3/4  Installing dependencies (bun install)`. If it stops with "did not generate the Prisma
   client": delete the `node_modules` folder in the checkout, or install bun 1.3.4 (B2), and run it
   again.
4. `4/4  Cloudflare setup and deploy` hands over to `setup.sh`, which asks:
   - **Cloudflare account ID** → paste the ID from B4, Enter. (If one is already set in this
     Terminal it offers it: Enter keeps it, `n` replaces it.)
   - **Paste your Cloudflare API token and press Enter** → paste the token from B5, Enter. Nothing
     appears while you paste; that is intended. You should then see
     `Token received (N characters).` and `Cloudflare accepts the token (active).`
     If it says Cloudflare does not recognise the token (revoked, expired or mistyped), it asks
     again, up to three times. Copy it again, or go back to B5 and make a new one.
   - `D1 database pyarcana-accounts` → `reusing pyarcana-accounts (...)`. "created" would mean the
     token points at a different account than the live one: press `Ctrl + C` and go back to B4.
   - `Secrets already on pyarcana-billing` → a list of names (no values).
   - **Admin addresses (ADMIN_EMAILS)** → if a list is saved on this computer it shows it and asks
     `Use these admin addresses? [Y/n]`: press Enter to keep it. Otherwise it asks
     `New comma-separated list, or Enter to keep the stored one:`: press Enter to keep what
     Cloudflare already has. Type a list only if you mean to change who is admin; use your admin
     Gmail, never a tester's address. Later you see either an `ADMIN_EMAILS` stage (the saved list
     was stored again, same value) or `ADMIN_EMAILS: kept.` Both are fine.
     `ADMIN_EMAILS: not set` means no one is admin: run it again and type your admin Gmail.
   - `Licence signing key: one already exists, keeping it` and
     `SERVER_PEPPER: already set, keeping it`. Both are expected on a redeploy.
   - `PUBLIC licence key (safe to commit)` → a JWK. On a normal redeploy it equals what is already in
     `src/lib/cloud/config.ts`; nothing to do.
   - Then `deploy.sh`. It first checks the commit: `Deploying <commit> <title> (<date>), the current origin/main`
     (the same commit as stage 2). Then `Sign-up: OPEN` or `Sign-up: CLOSED` (must match B8), the
     static build (a few minutes), `Security headers and ads.txt`,
     `Deploying the Worker (static assets + API)`, `Deployed`, and finally
     `Checking that the site serves this commit`, which waits until pyarcana.dev answers with the
     commit just built.

If anything ends with `STOP`, `REFUSED` or "Nothing was deployed", the live site is unchanged.
A `REFUSED` from `cloud-headers` means the security headers would block a page's own scripts in
the order Cloudflare applies them; to look at it in a browser before deploying, build and run
`node --import tsx scripts/serve_out_rule_order.mjs --order sorted` (it serves `out/` on
<http://localhost:8788> with production's rule order; `wrangler dev` does not reproduce it). Read the
message, fix that one thing, run `redeploy.sh` again. It is safe to repeat.

`deploy.sh` refuses (`STOP`, "Nothing was deployed") when the checkout is not exactly
`origin/main` as GitHub has it: an older or newer local commit, local edits other than
`workers/billing/wrangler.toml`, or untracked files under `src/`, `public/` or `scripts/` that the
build would copy in. `redeploy.sh` avoids all three. If it stops after `Deployed` with "the site
does not yet serve the commit just built", the Worker is live but the check timed out: run the D2
`curl` a minute later before doing anything else.

Two overrides exist for when you mean it. Put them in front of the command, for that one run only:

| Variable | What it does | When |
|---|---|---|
| `PYARCANA_DEPLOY_ANY_COMMIT=1` | Skips the commit check and deploys whatever is checked out. It prints `Commit check SKIPPED` with the commit it deploys. | Only for a rollback by rebuild (R3). |
| `PYARCANA_SKIP_LIVE_CHECK=1` | Skips the final check that pyarcana.dev serves the new commit. It prints `Live check SKIPPED`. | Only when the site is unreachable from your network; then do D2 by hand from somewhere that reaches it. |

Do not export either one in your shell profile: a forgotten `PYARCANA_DEPLOY_ANY_COMMIT=1` brings
back the 25 Nov 2026 stale deploy that the check exists to stop.

### D2. Check the live site

```
curl -s -H 'Cache-Control: no-cache' "https://pyarcana.dev/deployment.json?v=$(date +%s)"
workers/billing/e2e/live.sh anon
```

- In the JSON, `git_sha` must match the `Deploying:` commit from D1 and the newest `main`:
  `git rev-parse origin/main` (after `git fetch origin`) prints the full hash to compare. If it
  shows an older commit, the deploy ran from a stale checkout: go back to B3. Do not compare it
  with the GitHub Pages preview, which is a different site.
- `live.sh anon` checks health, sign-in methods, licence keys, pages, security headers and the
  sign-up mode on the privacy page. Every line should pass. The first run installs Playwright and
  its Chromium in `workers/billing/e2e/` (not in git); it needs no Cloudflare token.
- For the full guided run, `workers/billing/e2e/live.sh` without arguments: it asks before each
  signed-in step and has you sign in with your admin Gmail in your own Chrome.
- Then the home page's routes, each opened directly in a fresh tab:
  `BASE=https://pyarcana.dev node scripts/hash_route_entry_check.mjs`. It must end with 0
  failures. It catches a page that loads but never starts (no **Entrar** button, dead theme and
  language toggles), which happened on 24 Nov 2026 when "/" received two security policies.
  If it says Playwright's browser is missing, run `npx playwright install chromium` once and
  run it again.
- By hand: <https://pyarcana.dev/admin> → **Testers** shows the role picker (Tester / QA
  supervisor).

### D3. Delete the token

1. Open the list you made it in: **Account API tokens** (Route A, `Cmd + K`) or
   <https://dash.cloudflare.com/profile/api-tokens> (Route B).
2. Next to the token from B5, click the **three dots** (⋯) → **Delete**, and confirm.
3. You should see it gone from the list. Close the Terminal window too: the token was exported in
   that shell.

If you need a rollback later, the dashboard path in R1 needs no token.

Docs: [Roll tokens](https://developers.cloudflare.com/fundamentals/api/how-to/roll-token/) (the same
⋯ menu holds **Roll** and **Delete**)

---

## If something is wrong: rollback

### R1. Roll back in the dashboard (preferred, no token needed)

1. <https://dash.cloudflare.com> → left menu **Workers & Pages** → click `pyarcana-billing`.
2. Open the **Deployments** tab.
3. On the version that was live before (the one below the newest), click the **three dots** →
   **Rollback**, and confirm.
4. Run `workers/billing/e2e/live.sh anon` again, and check the sign-up mode on the privacy page:
   nobody has yet confirmed what a rollback does to a `--var` set at deploy time.

Docs: [Rollbacks, via the Cloudflare dashboard](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/#via-the-cloudflare-dashboard)

### R2. Roll back from Terminal

Only with a valid token (make one as in B5), from the deploy checkout:

```
cd workers/billing
npx --yes wrangler@4.144.0 rollback
```

Without a version ID it goes back to the version uploaded before the latest one, and asks you to
confirm. Use the same wrangler version the scripts pin (`wrangler@4.144.0` in
`workers/billing/scripts/common.sh`).

What a rollback does not undo: bindings and their data are not changed. A D1 table added by the
new version stays; the migrations here are additive, so the older code ignores it. Cloudflare
refuses a rollback across a deleted or modified binding.

Docs: [`wrangler rollback`](https://developers.cloudflare.com/workers/wrangler/commands/workers/#rollback) ·
[Rollbacks](https://developers.cloudflare.com/workers/versions-and-deployments/rollbacks/)

### R3. Rebuild an older commit (only if R1 and R2 cannot reach it)

R1 and R2 go back to a version Cloudflare still keeps. To put live a commit it no longer keeps,
check that commit out in the deploy checkout and deploy it on purpose, with a token from B5.
`setup.sh` asks for the account ID and token as in D1 and passes the variable on to `deploy.sh`:

```
git checkout -- workers/billing/wrangler.toml
git checkout <commit>
PYARCANA_DEPLOY_ANY_COMMIT=1 workers/billing/scripts/setup.sh
git checkout -- workers/billing/wrangler.toml
git checkout main
```

You should see `Commit check SKIPPED (PYARCANA_DEPLOY_ANY_COMMIT=1): deploying <commit> as it is.`
(A commit older than 25 Nov 2026 predates the check and prints no such line.) Then do D2: its
`git_sha` is now that older commit, as intended. Then D3. The next normal `redeploy.sh` puts
`main` back.

---

## Enrolling testers (after a deploy)

- Grant the role first (<https://pyarcana.dev/admin> → **Testers**), then send the link. A sign-in
  before the grant is refused while sign-up is closed.
- Use the exact address Google shows for them: `ana.perez@example.com` and `anaperez@example.com`
  are different accounts here.
- With sign-up closed, only Gmail or company Google Workspace addresses work. Microsoft never links
  by email, and email codes are off on Workers Free.
- Testers open pyarcana.dev in Safari, Chrome or Edge. Google refuses sign-in inside an app's own
  in-app browser (WhatsApp, Instagram).
- Never put a tester in `ADMIN_EMAILS`. That makes them an admin, not a tester.
- Two-account check: grant a throwaway Gmail the tester role, sign in with it in a private window,
  and confirm it sees the team's reports and its own, with no admin tab.
