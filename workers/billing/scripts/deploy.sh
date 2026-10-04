#!/usr/bin/env bash
#
# Deploy PyArcana to Cloudflare as ONE origin (DESIGN-v3 §A): the static site and the API from the
# pyarcana-billing Worker. Run it on the owner's machine, in a real terminal:
#
#   workers/billing/scripts/deploy.sh
#
# Steps:
#   1. refuse while workers/billing/wrangler.toml still holds a TODO_ placeholder (run setup.sh);
#   2. `NEXT_PUBLIC_BASE_PATH= bun run build:static` at the repository root (writes out/), and
#      refuse unless out/deployment.json says the site was built at the root;
#   3. `node scripts/cloud-headers.mjs out` when that script exists (out/_headers, out/ads.txt);
#   4. `wrangler deploy` from workers/billing/.
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
command -v bun >/dev/null 2>&1 || die "bun is not installed (https://bun.sh); the static build needs it."

say "Static build at the root (NEXT_PUBLIC_BASE_PATH empty)"
NEXT_PUBLIC_BASE_PATH= bun run build:static || die "The static build failed. Nothing was deployed."
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

if [ -f scripts/cloud-headers.mjs ]; then
  say "Security headers and ads.txt"
  node scripts/cloud-headers.mjs out || die "scripts/cloud-headers.mjs failed. Nothing was deployed."
else
  echo "scripts/cloud-headers.mjs is not in this checkout: deploying without out/_headers (no CSP"
  echo "response header) and without out/ads.txt."
fi

cd "$BILLING"
say "Deploying the Worker (static assets + API)"
wr deploy
say "Deployed"
echo "Check: https://pyarcana.dev/api/v1/health ({ok, db}), https://pyarcana.dev/api/v1/auth/methods and https://pyarcana.dev/api/v1/jwks; the full configuration is on /admin, tab Uso"
