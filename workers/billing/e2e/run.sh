#!/usr/bin/env bash
# Local Chromium end-to-end run of PyArcana's accounts, ads, admin and QA flows.
#
# What it builds: a throwaway git worktree of HEAD (under ./.work) with src/lib/cloud/config.ts
# switched to launchStage 'beta' on http://localhost:8787, its static export, and `wrangler dev
# --local` (workerd + a local D1) serving both. People are seeded straight into that local D1 with
# known session tokens (seed.mjs), because the worker only accepts real Google and Microsoft
# tokens; email-code sign-in runs for real through the UI (EMAIL_PROVIDER=dev-log).
#
# Needs: bun, node >= 20, and in this folder `npm i wrangler@4 playwright` (not repo deps).
# Chromium: set CHROMIUM=/path/to/chrome (default /opt/pw-browsers/chromium).
#   ./run.sh            build, start, seed, run both suites
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
    s = s.replace("  launchStage: \x27off\x27,", "  launchStage: \x27beta\x27,")
         .replace("  canonicalOrigin: \x27https://pyarcana.dev\x27,", "  canonicalOrigin: \x27http://localhost:8787\x27,")
         .replace("  termsVersion: \x27\x27,", "  termsVersion: \x27e2e-2026-10-01\x27,");
    fs.writeFileSync(p, s);' "$WORK/site/src/lib/cloud/config.ts"
  (cd "$WORK/site" && NEXT_PUBLIC_BASE_PATH= bun run build:static >"$WORK/build.log" 2>&1 && node scripts/cloud-headers.mjs out >/dev/null)
fi
PEPPER="$(node -e 'console.log(require("crypto").randomBytes(32).toString("base64"))')"
printf 'SERVER_PEPPER=%s\nADMIN_EMAILS=admin@example.test\nALLOWED_ORIGINS=http://localhost:8787\nCANONICAL_ORIGIN=http://localhost:8787\nTERMS_VERSION=e2e-2026-10-01\nEMAIL_PROVIDER=dev-log\n' "$PEPPER" >"$WORK/site/workers/billing/.dev.vars"
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
exit $STATUS
