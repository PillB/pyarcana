#!/usr/bin/env bash
# Local Chromium end-to-end run of PyArcana's accounts, ads, admin and QA flows.
#
# What it builds: a throwaway git worktree of HEAD (under ./.work) with src/lib/cloud/config.ts
# switched to launchStage 'beta' on http://localhost:8787, its static export, and `wrangler dev
# --local` (workerd + a local D1) serving both. People are seeded straight into that local D1 with
# known session tokens (seed.mjs), because the worker only accepts real Google and Microsoft
# tokens; email-code sign-in runs for real through the UI (EMAIL_PROVIDER=dev-log).
#
# Needs: bun, node >= 20, and in this folder
#   npm install --prefix . --no-save wrangler@4 playwright@1.63.0   (not repo deps; --prefix keeps
#   npm from writing them into workers/billing/package.json, the nearest package.json above)
# Chromium: set CHROMIUM=/path/to/chrome (default /opt/pw-browsers/chromium).
#   ./run.sh            build, start, seed, run the suites (ads, flows, usage, qa, cuenta, tour, setup)
#   ./run.sh --no-build reuse the last build
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
REPO="$(git -C "$HERE" rev-parse --show-toplevel)"
WORK="${PYARCANA_E2E_WORK:-${TMPDIR:-/tmp}/pyarcana-e2e}"   # outside the repo: repo gates never scan the build
if [[ "${1:-}" != "--no-build" ]]; then
  git -C "$REPO" worktree remove --force "$WORK/site" 2>/dev/null || true
  git -C "$REPO" worktree add --detach "$WORK/site" HEAD >/dev/null
  ln -sfn "$REPO/node_modules" "$WORK/site/node_modules"
  node -e '
    const fs = require("fs"); const p = process.argv[1]; let s = fs.readFileSync(p, "utf8");
    // The harness tests the full feature set: the gated beta, even though production runs sync.
    s = s.replace(/COMMITTED_LAUNCH_STAGE: LaunchStage = \x27[a-z]+\x27/, "COMMITTED_LAUNCH_STAGE: LaunchStage = \x27beta\x27")
         .replace("  canonicalOrigin: \x27https://pyarcana.dev\x27,", "  canonicalOrigin: \x27http://localhost:8787\x27,")
         .replace(/  termsVersion: \x27[^\x27]*\x27,/, "  termsVersion: \x27e2e-2026-10-01\x27,")
         .replace("  emailSignIn: false,", "  emailSignIn: true,");
    fs.writeFileSync(p, s);' "$WORK/site/src/lib/cloud/config.ts"
  # Local only: wrangler dev rewrites requests to a declared route's host (pyarcana.dev), which the
  # worker's origin check refuses; the throwaway copy drops the custom-domain routes.
  node -e '
    const fs = require("fs"); const p = process.argv[1];
    fs.writeFileSync(p, fs.readFileSync(p, "utf8").replace(/^routes = \[[\s\S]*?\]\n/m, ""));' "$WORK/site/workers/billing/wrangler.toml"
  (cd "$WORK/site" && NEXT_PUBLIC_BASE_PATH= bun run build:static >"$WORK/build.log" 2>&1 && node scripts/cloud-headers.mjs out >/dev/null)
fi
PEPPER="$(node -e 'console.log(require("crypto").randomBytes(32).toString("base64"))')"
printf 'SERVER_PEPPER=%s\nADMIN_EMAILS=admin@example.test\nALLOWED_ORIGINS=http://localhost:8787\nCANONICAL_ORIGIN=http://localhost:8787\nTERMS_VERSION=e2e-2026-10-01\nEMAIL_PROVIDER=dev-log\nUSAGE_FLUSH_SECONDS=0\nCONTROLLER_NAME=PyArcana E2E E.I.R.L.\n' "$PEPPER" >"$WORK/site/workers/billing/.dev.vars"
WRANGLER=""
stop() { if [[ -n "$WRANGLER" ]]; then kill "$WRANGLER" 2>/dev/null || true; wait "$WRANGLER" 2>/dev/null || true; fi; WRANGLER=""; }
trap stop EXIT
# A fresh local D1, the worker, the schema, and the seeded people.
start() {
  rm -rf "$WORK/site/workers/billing/.wrangler/state"
  (cd "$WORK/site/workers/billing" && exec "$HERE/node_modules/.bin/wrangler" dev --local --port 8787 >"$HERE/wrangler.log" 2>&1) &
  WRANGLER=$!
  for _ in $(seq 1 60); do curl -sf -o /dev/null http://localhost:8787/api/v1/health && break; sleep 1; done
  curl -s -o /dev/null http://localhost:8787/api/v1/me   # applies the schema migrations
  (cd "$HERE" && node seed.mjs)
  (cd "$WORK/site/workers/billing" && "$HERE/node_modules/.bin/wrangler" d1 execute pyarcana-accounts --local --file "$HERE/seed.sql" >/dev/null)
}
STATUS=0
start
(cd "$HERE" && node ads.e2e.mjs) || STATUS=1
# The flows suite changes state (trial, gifts, reports), so it gets its own fresh database.
stop
start
(cd "$HERE" && node flows.e2e.mjs) || STATUS=1
# The usage suite seeds a usage row and measures rows per action: a fresh database again. Its CSP
# check loads Pyodide from the REAL jsDelivr, checked against the site's SRI hash; where the network
# blocks jsDelivr it reports SKIP (live.e2e.mjs runs it on a normal machine). No local copy.
PYO_VER="$(sed -n "s/^export const PYODIDE_VERSION = '\(.*\)'$/\1/p" "$REPO/src/lib/pyodide.ts")"
PYO_SRI="$(sed -n "s/.*script.integrity = '\(sha384-[^']*\)'.*/\1/p" "$REPO/src/components/course/CodePlayground.tsx")"
stop
start
(cd "$HERE" && E2E_WORKER_DIR="$WORK/site/workers/billing" E2E_PYODIDE_SRI="$PYO_SRI" \
  E2E_PYODIDE_CDN="https://cdn.jsdelivr.net/pyodide/v$PYO_VER/full/" node usage.e2e.mjs) || STATUS=1
# The QA suite (hotkeys, sessions, force-sync guard, admin QA downloads): a fresh database again.
stop
start
(cd "$HERE" && node qa.e2e.mjs) || STATUS=1
(cd "$HERE" && node cuenta.e2e.mjs) || STATUS=1
# The QA tutorial's highlight: never under its panel, at four window sizes (no database needed).
(cd "$HERE" && node tour.e2e.mjs) || STATUS=1
# Sesión 0 (/empezar): tracks, keyboard switch, ticks and storage, at desktop and phone sizes.
(cd "$HERE" && node setup.e2e.mjs) || STATUS=1
exit $STATUS
