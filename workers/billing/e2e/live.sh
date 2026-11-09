#!/usr/bin/env bash
#
# Run the live checks against https://pyarcana.dev on your own computer, step by step:
#
#   workers/billing/e2e/live.sh            the guided run (asks before each signed-in step)
#   workers/billing/e2e/live.sh anon       only the anonymous checks (nothing to sign in to)
#   workers/billing/e2e/live.sh keys       only the hotkey check on your real keyboard
#
# Steps of the guided run:
#   0. setup: Node 20 or newer; Playwright 1.63.0 installed in this folder (not in git); its Chromium
#   1. anonymous checks: health, sign-in methods, licence keys, pages, ads, security headers, no
#      Cloudflare beacon, /cuenta offers Google, Pyodide from jsDelivr runs under the live CSP;
#      the QA tutorial never covers the control it highlights (tour.e2e.mjs, four window sizes);
#      Sesión 0 at /empezar works (setup.e2e.mjs)
#   2. (asks) sign in in YOUR Chrome, then the signed-in checks: /v1/me, /cuenta, every admin tab
#   3. (asks) also send one test QA report "[prueba en vivo] …" (it lands in /qa and /admin)
#   4. (asks) the hotkeys on your physical keyboard in your Chrome
#   5. always: the saved session (state.json) is deleted at the end, and a summary is printed
#
# BASE overrides the site (default https://pyarcana.dev). Nothing here needs a Cloudflare token.

set -uo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
cd "$HERE"
PW_VERSION="1.63.0"
export BASE="${BASE:-https://pyarcana.dev}"
MODE="${1:-all}"
STATE="$HERE/state.json"
SUMMARY=()

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
die() { printf '\n%s\n' "$*" >&2; exit 1; }
ask() { # ask "question" default(y|n) -> 0 for yes
  local q="$1" def="$2" hint answer
  [ "$def" = y ] && hint="[Y/n]" || hint="[y/N]"
  printf '%s %s ' "$q" "$hint"
  IFS= read -r answer || answer=""
  answer="${answer:-$def}"
  case "$answer" in y | Y | yes | si | sí) return 0 ;; *) return 1 ;; esac
}
step() { # step "name" command... -> runs it, records PASS/FAIL, returns its exit status
  local name="$1" status
  shift
  "$@"
  status=$?
  if [ "$status" -eq 0 ]; then SUMMARY+=("PASS  $name"); else SUMMARY+=("FAIL  $name"); fi
  return "$status"
}
cleanup() {
  if [ -f "$STATE" ]; then
    rm -f "$STATE" && echo "Deleted state.json (it held a live session)."
  fi
}
trap cleanup EXIT

case "$MODE" in all | anon | keys) ;; *) die "Unknown mode \"$MODE\". Use: all, anon or keys." ;; esac

say "0  Setup"
command -v node >/dev/null 2>&1 || die "Node is not installed. Install Node 20 or newer (https://nodejs.org), then run this again."
NODE_MAJOR="$(node -p 'process.versions.node.split(".")[0]')"
[ "$NODE_MAJOR" -ge 20 ] || die "Node $(node -v) is too old: Playwright needs Node 20 or newer."
if [ "$(node -p "try { require('./node_modules/playwright/package.json').version } catch { '' }")" != "$PW_VERSION" ]; then
  echo "Installing Playwright $PW_VERSION in $HERE (one time; not added to git)…"
  # --prefix keeps it in this folder: without it npm walks up to workers/billing/package.json (this
  # folder has none) and installs there, which is how that file gained "playwright" on 5 Oct 2026.
  npm install --prefix "$HERE" --no-save --no-package-lock --no-audit --no-fund "playwright@$PW_VERSION" >/dev/null || die "npm install failed. Check your internet connection and run this again."
fi
if [ -z "${CHROMIUM:-}" ] && [ "${SKIP_BROWSER_INSTALL:-}" != 1 ]; then
  echo "Making sure Playwright's Chromium is installed (used for the automatic checks; your own Chrome is used to sign in)…"
  npx --no-install playwright install chromium >/dev/null || die "Could not install Playwright's Chromium. Run: cd $HERE && npx playwright install chromium"
fi
echo "Ready. Site: $BASE"

if [ "$MODE" = all ] || [ "$MODE" = anon ]; then
  say "1  Anonymous checks (about 1-2 minutes)"
  step "anonymous checks" node live.e2e.mjs
  step "QA tutorial: highlighted control never under its panel" node tour.e2e.mjs
  step "Sesión 0 (/empezar): tracks, steps, diagrams, ticks" node setup.e2e.mjs
fi

if [ "$MODE" = all ]; then
  say "2  Signed-in checks"
  echo "Your own Chrome will open on $BASE with a temporary profile. Sign in there (use Google with your"
  echo "admin address for the admin checks), then come back here and press Enter."
  if ask "Sign in and run the signed-in checks?" y; then
    if step "sign in (your Chrome)" node live.e2e.mjs --login; then
      if ask "Also send one test QA report \"[prueba en vivo] …\" (it appears in /qa and /admin; close it there afterwards)?" n; then
        step "signed-in checks + test report" node live.e2e.mjs --state --signed-in-only --write
      else
        step "signed-in checks" node live.e2e.mjs --state --signed-in-only
      fi
    fi
    cleanup
  else
    SUMMARY+=("SKIP  signed-in checks (you chose not to sign in)")
  fi
fi

if [ "$MODE" = all ] || [ "$MODE" = keys ]; then
  say "3  Hotkeys on your keyboard"
  echo "Your Chrome opens on a course page. Each time you are asked: click once inside the page, press the"
  echo "keys on your keyboard, then press Enter here. For ⌘ + Option + S you sign in first in that window."
  if [ "$MODE" = keys ] || ask "Run the hotkey check?" y; then
    step "hotkeys on your keyboard (Chrome)" node live.e2e.mjs --keys
  else
    SUMMARY+=("SKIP  hotkeys (you chose not to run them)")
  fi
fi

say "Summary"
printf '%s\n' "${SUMMARY[@]}"
cat <<'EOF'

By hand in Safari and in Firefox (cannot be checked automatically):
  1. Open https://pyarcana.dev/#setup and click once inside the page.
  2. ⌘ + Option + Q, then Ctrl + Option + Q: each opens the QA window (Esc closes it).
  3. Signed in: ⌘ + Option + S shows "Ya está guardado" (or "Guardado en tu cuenta").
Screenshots of every automatic step are in workers/billing/e2e/shots/.
EOF
printf '%s\n' "${SUMMARY[@]}" | grep -q '^FAIL' && exit 1
exit 0
