# Shared by setup.sh and deploy.sh (sourced, not run). Bash.
#
# wrangler: `npx --yes wrangler@4.144.0` by default, the version whose source these scripts were
# checked against (DESIGN-v3 §A). WRANGLER_PKG overrides the package spec. PYARCANA_WRANGLER, when
# set, is run instead of npx: it is the tests' seam for a fake wrangler
# (workers/billing/tests/operator-scripts.test.mjs); leave it unset on a real machine.

WRANGLER_PKG="${WRANGLER_PKG:-wrangler@4.144.0}"

say() { printf '\n\033[1m%s\033[0m\n' "$*"; }
die() { printf '\n%s\n' "$*" >&2; exit 1; }

wr() {
  if [ -n "${PYARCANA_WRANGLER:-}" ]; then
    "$PYARCANA_WRANGLER" "$@"
  else
    npx --yes "$WRANGLER_PKG" "$@"
  fi
}

# wrangler 4 and scripts/ops.mjs need Node 20 or newer. An older Homebrew node fails several steps
# later with a much less obvious message, so say it first.
need_node() {
  command -v node >/dev/null 2>&1 || die "node is not installed. Install Node 20 or newer (https://nodejs.org) and run this again."
  local version major
  version=$(node -p 'process.versions.node' 2>/dev/null || true)
  major="${version%%.*}"
  case "$major" in
    '' | *[!0-9]*) die "Could not read the Node version. Install Node 20 or newer and run this again." ;;
  esac
  [ "$major" -ge 20 ] || die "node $version is too old: wrangler 4 and these scripts need Node 20 or newer."
}
