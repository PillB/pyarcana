#!/usr/bin/env bash
#
# Deploy PyArcana to Cloudflare as ONE origin (DESIGN-v3 §A): the static site and the API from the
# pyarcana-billing Worker. Run it on the owner's machine, in a real terminal:
#
#   workers/billing/scripts/deploy.sh
#
# Steps:
#   1. refuse while workers/billing/wrangler.toml still holds a TODO_ placeholder (run setup.sh);
#   2. `NEXT_PUBLIC_BASE_PATH= node scripts/build_static_export.mjs` at the repository root (writes
#      out/; it is what `bun run build:static` runs, minus bun's folder walk, below), and
#      refuse unless out/deployment.json says the site was built at the root;
#   3. `node scripts/cloud-headers.mjs out` when that script exists (out/_headers, out/ads.txt);
#   4. `wrangler deploy` from workers/billing/.
#
# Sign-up and the data bank's holder (round of 19 Oct 2026, item 3): the holder's NAME, ADDRESS
# and optional RUC live in a file on this computer, never in the repository (it is public):
#   ${PYARCANA_HOLDER_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/pyarcana/holder}
#     NAME=...
#     ADDRESS=...
#     RUC=...            (optional, 11 digits)
# With the file: the build gets NEXT_PUBLIC_HOLDER_* (the notice names the holder), the built
# privacy page is checked for the name and the address, and the Worker is deployed with
# --var CONTROLLER_NAME:<name>, which opens sign-up. A --var lasts for this deploy only.
# Without it: both stay closed together (the notice says "being formed", only ADMIN_EMAILS may
# create accounts). A half-filled file stops the deploy.
#
# The deploy is never piped: wrangler is interactive only when stdin AND stdout are terminals, and
# a piped deploy answers its own questions with fallbacks (a first deploy then refuses the
# workers.dev subdomain). Credentials: CLOUDFLARE_API_TOKEN (+ CLOUDFLARE_ACCOUNT_ID) in the
# environment, or `wrangler login`.

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BILLING="$(dirname "$HERE")"
ROOT="$(cd "$BILLING/../.." && pwd)"
# shellcheck source=common.sh
. "$HERE/common.sh"

need_node
[ -f "$ROOT/package.json" ] || die "No package.json at $ROOT: run this from a PyArcana checkout."

if ! left=$(node "$HERE/ops.mjs" placeholders "$BILLING/wrangler.toml"); then
  die "workers/billing/wrangler.toml still holds a placeholder: $(printf '%s ' $left)
Run workers/billing/scripts/setup.sh first: it writes this account's ids into your LOCAL copy."
fi

cd "$ROOT"
# The holder: from the file only. Inherited NEXT_PUBLIC_HOLDER_* would open the page without the
# Worker (or the other way round), so they are cleared first.
unset NEXT_PUBLIC_HOLDER_NAME NEXT_PUBLIC_HOLDER_ADDRESS NEXT_PUBLIC_HOLDER_RUC
HOLDER_FILE="${PYARCANA_HOLDER_FILE:-${XDG_CONFIG_HOME:-$HOME/.config}/pyarcana/holder}"
holder() { node "$HERE/ops.mjs" holder "$HOLDER_FILE" "$1"; }
mode=$(holder mode) || die "The holder file $HOLDER_FILE is not usable (above). Fix it, or move it away to deploy with sign-up closed. Nothing was deployed."
if [ "$mode" = open ]; then
  say "Sign-up: OPEN. Holder named in the notice: $(holder name) (from $HOLDER_FILE)"
  export NEXT_PUBLIC_HOLDER_NAME="$(holder name)" NEXT_PUBLIC_HOLDER_ADDRESS="$(holder address)" NEXT_PUBLIC_HOLDER_RUC="$(holder ruc)"
else
  say "Sign-up: CLOSED (no $HOLDER_FILE). The notice says the holder is being formed; only ADMIN_EMAILS may create accounts."
fi

say "Static build at the root (NEXT_PUBLIC_BASE_PATH empty)"
# node, not `bun run build:static` (the same script): `bun run` opens every folder above this one
# and stops with CouldntReadCurrentDirectory when macOS has not let the terminal open one of them,
# as with ~/Documents on 7 Oct 2026 (oven-sh/bun#28220). The build itself never needed bun.
NEXT_PUBLIC_BASE_PATH= node scripts/build_static_export.mjs || die "The static build failed. Nothing was deployed."
[ -f out/index.html ] || die "The build wrote no out/index.html. Nothing was deployed."

# The one-origin site must be built for the root. Read the base path the build recorded instead of
# trusting the variable: a build script that reads it with `|| '/pyarcana'` (the rule at commit
# 29200ca) turns the empty value into /pyarcana.
base=$(node -e '
  const fs = require("node:fs");
  try {
    const j = JSON.parse(fs.readFileSync("out/deployment.json", "utf8"));
    if (typeof j.base_path !== "string") process.exit(1);
    process.stdout.write(j.base_path);
  } catch { process.exit(1); }
') || die "out/deployment.json is missing or has no base_path, so the build's base path is unknown. Nothing was deployed."
if [ -n "$base" ]; then
  die "The static build came out under the base path \"$base\", not the root, so every page and asset
would point at $base/... on pyarcana.dev. scripts/build_static_export.mjs must treat an EMPTY
NEXT_PUBLIC_BASE_PATH as the root (a '|| \"/pyarcana\"' fallback does not). Nothing was deployed."
fi

# The page the learner reads must match what the Worker will do.
node "$HERE/ops.mjs" holder-html out/privacy.html "$HOLDER_FILE" \
  || die "out/privacy.html does not match sign-up $mode (above). Nothing was deployed."

if [ -f scripts/cloud-headers.mjs ]; then
  say "Security headers and ads.txt"
  node scripts/cloud-headers.mjs out || die "scripts/cloud-headers.mjs failed. Nothing was deployed."
else
  echo "scripts/cloud-headers.mjs is not in this checkout: deploying without out/_headers (no CSP"
  echo "response header) and without out/ads.txt."
fi

cd "$BILLING"
say "Deploying the Worker (static assets + API)"
if [ "$mode" = open ]; then
  wr deploy --var "CONTROLLER_NAME:$NEXT_PUBLIC_HOLDER_NAME"
else
  wr deploy
fi
say "Deployed"
echo "Check: https://pyarcana.dev/api/v1/health ({ok, db}), https://pyarcana.dev/api/v1/auth/methods and https://pyarcana.dev/api/v1/jwks; the full configuration is on /admin, tab Uso"
