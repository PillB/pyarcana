#!/usr/bin/env bash
# Start the local stack that workers/billing/e2e/run.sh builds, and keep it up for the walkthrough:
# a fresh local D1, wrangler dev on :8787, the schema, and the seeded people (seed.mjs).
# Run workers/billing/e2e/run.sh once first (it builds /tmp/pyarcana-e2e/site and .dev.vars).
# Stop it with: kill $(pgrep -x workerd)   (never pkill -f "wrangler dev": it matches this shell)
set -euo pipefail
REPO="$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"
HERE="$REPO/workers/billing/e2e"
WORK="${PYARCANA_E2E_WORK:-${TMPDIR:-/tmp}/pyarcana-e2e}"
test -f "$WORK/site/workers/billing/.dev.vars" || { echo "run workers/billing/e2e/run.sh first" >&2; exit 1; }
rm -rf "$WORK/site/workers/billing/.wrangler/state"
(cd "$WORK/site/workers/billing" && exec "$HERE/node_modules/.bin/wrangler" dev --local --port 8787 >"${WRANGLER_LOG:-/tmp/wrangler-walk.log}" 2>&1) &
for _ in $(seq 1 60); do curl -sf -o /dev/null http://localhost:8787/api/v1/health && break; sleep 1; done
curl -s -o /dev/null http://localhost:8787/api/v1/me
(cd "$HERE" && node seed.mjs)
(cd "$WORK/site/workers/billing" && "$HERE/node_modules/.bin/wrangler" d1 execute pyarcana-accounts --local --file "$HERE/seed.sql" >/dev/null)
echo "stack up on http://localhost:8787"
wait
