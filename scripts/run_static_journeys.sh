#!/usr/bin/env bash
# The public-site browser journeys, as the "Platform build (static)" CI job runs them:
# build the static export, serve it the way GitHub Pages does, run the three Playwright specs.
#
# Why this exists: PR #169 passed every gate in AGENTS.md and failed this job twice, because
# nothing local ran it. Run it before pushing any change to what a page renders.
#
#   scripts/run_static_journeys.sh              build, serve, run
#   scripts/run_static_journeys.sh --no-build   reuse ./out
#   scripts/run_static_journeys.sh -- -g "QA"   pass the rest to playwright
#
# Chromium: Playwright's own by default. Where `npx playwright install` is not possible, set
# PW_CHROMIUM_PATH=/path/to/chromium (playwright.config.ts reads it).
set -uo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
PORT="${STATIC_JOURNEYS_PORT:-4173}"
STAGE="$(mktemp -d "${TMPDIR:-/tmp}/pyarcana-static.XXXXXX")"   # outside the repo: no gate scans it
BUILD=1
EXTRA=()
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-build) BUILD=0 ;;
    --) shift; EXTRA=("$@"); break ;;
    *) echo "REFUSED: unknown argument '$1' (use --no-build, or -- <playwright args>)" >&2; exit 2 ;;
  esac
  shift
done
SERVER=""
cleanup() { [[ -n "$SERVER" ]] && kill "$SERVER" 2>/dev/null; rm -rf "$STAGE"; }
trap cleanup EXIT

if [[ "$BUILD" == 1 ]]; then
  echo "== building the static export (log: $STAGE/build.log)"
  if ! NEXT_PUBLIC_BASE_PATH=/pyarcana npm run build:static >"$STAGE/build.log" 2>&1; then
    echo "FAILED: build:static exited non-zero. Last lines:" >&2
    tail -25 "$STAGE/build.log" >&2
    trap - EXIT; [[ -n "$SERVER" ]] && kill "$SERVER" 2>/dev/null
    echo "Full log kept at $STAGE/build.log" >&2
    exit 1
  fi
fi
if [[ ! -f out/index.html ]]; then
  echo "REFUSED: out/index.html does not exist. Run without --no-build, or 'npm run build:static' first." >&2
  exit 2
fi
if ! grep -q '/pyarcana/_next/' out/index.html; then
  echo "REFUSED: ./out was not built with NEXT_PUBLIC_BASE_PATH=/pyarcana, so the specs would load a page with no scripts. Rebuild without --no-build." >&2
  exit 2
fi
if curl -sf -o /dev/null "http://127.0.0.1:$PORT/"; then
  echo "REFUSED: something already answers on port $PORT; the specs would test that, not this build. Stop it or set STATIC_JOURNEYS_PORT." >&2
  exit 2
fi

mkdir -p "$STAGE/site" && cp -R out "$STAGE/site/pyarcana"
python3 scripts/serve_pages_static.py "$STAGE/site" "$PORT" >"$STAGE/server.log" 2>&1 &
SERVER=$!
for _ in $(seq 1 30); do curl -sf -o /dev/null "http://127.0.0.1:$PORT/pyarcana/" && break; sleep 1; done
if ! curl -sf -o /dev/null "http://127.0.0.1:$PORT/pyarcana/"; then
  echo "FAILED: the static server did not answer on http://127.0.0.1:$PORT/pyarcana/ within 30 s. Its log:" >&2
  cat "$STAGE/server.log" >&2
  exit 1
fi

echo "== running the journeys against http://127.0.0.1:$PORT/pyarcana/"
BASE_URL="http://127.0.0.1:$PORT" PAGES_BASE=1 npx playwright test \
  scripts/static_public.spec.ts scripts/safe_agent_journeys.spec.ts scripts/static_first_paint.spec.ts \
  --reporter=list "${EXTRA[@]}"
STATUS=$?
if [[ $STATUS -ne 0 ]]; then
  echo "FAILED: static journeys exited $STATUS. Each failure above names its spec and line; screenshots and traces are in test-results/." >&2
  echo "If every test failed with 'Executable doesn't exist', set PW_CHROMIUM_PATH or run 'npx playwright install chromium'." >&2
fi
exit $STATUS
