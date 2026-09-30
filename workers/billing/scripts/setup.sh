#!/usr/bin/env bash
#
# One-command Cloudflare setup for the pyarcana-billing Worker, on the owner's machine. Safe to run
# again: existing resources and secrets are reused, never duplicated or replaced.
#
#   workers/billing/scripts/setup.sh                    # first run, and every later run
#   workers/billing/scripts/setup.sh --rotate-key k2    # replace the licence signing key (opt-in)
#
# What it does, in order:
#   1. checks Node >= 20, CLOUDFLARE_API_TOKEN and CLOUDFLARE_ACCOUNT_ID;
#   2. finds the D1 database by name (`wrangler d1 list --json`) or creates it, and writes its id
#      into your LOCAL wrangler.toml (the repository keeps the TODO_ placeholder: do not commit it);
#   3. refuses to go on while any TODO_ placeholder survives in wrangler.toml;
#   4. reads the Worker's secret names (`wrangler secret list`); a missing Worker means none yet,
#      any other failure stops the script, so a secret that may exist is never replaced blindly;
#   5. asks for ADMIN_EMAILS (comma-separated; Enter keeps the stored value or skips);
#   6. licence key (DESIGN-v3-delta D-ORCH-03): when absent, or with --rotate-key, generates an
#      ES256 pair and pipes the private half straight into
#      `wrangler secret put LICENSE_PRIVATE_KEY_PKCS8_B64` (never a file, never the terminal), then
#      prints the PUBLIC JWK for src/lib/cloud/config.ts (licence.publicKeys);
#   7. SERVER_PEPPER: when absent, 32 random bytes piped the same way. Never rotated here: every
#      session, sign-in code, rate-limit key and hashed id is keyed by it;
#   8. ADMIN_EMAILS into `wrangler secret put` through stdin;
#   9. runs scripts/deploy.sh (static build at the root, headers, `wrangler deploy`, never piped).
#
# Needs, in the environment and never on the command line or in a file:
#   CLOUDFLARE_API_TOKEN   type it without echo:  read -rs CLOUDFLARE_API_TOKEN && export CLOUDFLARE_API_TOKEN
#                          Account permissions (Edit): Workers Scripts, D1. Revoke it afterwards.
#   CLOUDFLARE_ACCOUNT_ID  from the dashboard; with it the token needs no Account Settings:Read.

set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
BILLING="$(dirname "$HERE")"
# shellcheck source=common.sh
. "$HERE/common.sh"
TOML="$BILLING/wrangler.toml"
ops() { node "$HERE/ops.mjs" "$@"; }

ROTATE_KID=""
while [ $# -gt 0 ]; do
  case "$1" in
    --rotate-key)
      [ -n "${2:-}" ] || die "--rotate-key needs the NEW key id, for example: --rotate-key k2"
      ROTATE_KID="$2"
      shift 2
      ;;
    -h | --help)
      sed -n '2,32p' "$0"
      exit 0
      ;;
    *) die "Unknown argument: $1 (see --help)" ;;
  esac
done

need_node
[ -n "${CLOUDFLARE_API_TOKEN:-}" ] || die "CLOUDFLARE_API_TOKEN is not set. Type it without echo, then run this again:
  read -rs CLOUDFLARE_API_TOKEN && export CLOUDFLARE_API_TOKEN"
[ -n "${CLOUDFLARE_ACCOUNT_ID:-}" ] || die "CLOUDFLARE_ACCOUNT_ID is not set. Copy it from the Cloudflare dashboard, then:
  export CLOUDFLARE_ACCOUNT_ID=<account id>"
export CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID

cd "$BILLING"
WORKER_NAME=$(sed -n 's/^name *= *"\(.*\)"/\1/p' "$TOML" | head -1)
D1_NAME=$(ops toml-get "$TOML" d1_databases database_name)
KEY_ID=$(ops toml-get "$TOML" vars LICENSE_KEY_ID)
[ -n "$WORKER_NAME" ] && [ -n "$D1_NAME" ] || die "wrangler.toml has no worker name or D1 database_name."

if [ -n "$ROTATE_KID" ]; then
  ops kid-ok "$ROTATE_KID" || die "The key id must be 1-64 characters from A-Z a-z 0-9 _ . -"
  [ "$ROTATE_KID" != "$KEY_ID" ] || die "--rotate-key needs a NEW key id; \"$KEY_ID\" is the current LICENSE_KEY_ID."
fi

# --- D1 --------------------------------------------------------------------------------------
# Never `d1 info`: it resolves through wrangler.toml, where the placeholder counts as an id.
# `d1 list --json` reads no config and prints a bare JSON array.
say "D1 database $D1_NAME"
d1_lookup() { wr d1 list --json 2>&1 | ops d1-id-from-list "$D1_NAME" || true; }
D1_ID=$(d1_lookup)
if [ -n "$D1_ID" ]; then
  echo "reusing $D1_NAME ($D1_ID)"
else
  create_out=$(wr d1 create "$D1_NAME" 2>&1) || true
  printf '%s\n' "$create_out"
  D1_ID=$(printf '%s' "$create_out" | ops d1-id-from-create)
  [ -n "$D1_ID" ] || D1_ID=$(d1_lookup)
  [ -n "$D1_ID" ] || die "Could not create or find the D1 database $D1_NAME. Check the token's D1 Edit permission."
  echo "created $D1_NAME ($D1_ID)"
fi
ops toml-set "$TOML" d1_databases database_id "$D1_ID"
echo "wrangler.toml now holds this account's D1 id. This is a LOCAL change: do not commit it."
echo "(git checkout -- workers/billing/wrangler.toml restores the placeholder; this script writes it again.)"

if ! left=$(ops placeholders "$TOML"); then
  die "wrangler.toml still holds a placeholder: $(printf '%s ' $left)
Stopping before any secret or deploy rather than binding the Worker to something that does not exist."
fi

# --- existing secrets --------------------------------------------------------------------------
say "Secrets already on $WORKER_NAME"
if list_out=$(wr secret list 2>&1); then
  names=$(printf '%s' "$list_out" | ops secret-names) || die "Could not read the output of wrangler secret list. Stopping rather than replacing a secret that may exist."
elif printf '%s' "$list_out" | tr -d '\033' | grep -q "Worker \"$WORKER_NAME\".*not found"; then
  names=""
  echo "the Worker does not exist yet; the first secret creates it as a draft"
else
  printf '%s\n' "$list_out" >&2
  die "wrangler secret list failed (above). Stopping rather than replacing a secret that may exist."
fi
has_secret() { printf '%s\n' "$names" | grep -qx "$1"; }
printf '%s\n' "$names" | sed '/^$/d; s/^/  /'

# --- ADMIN_EMAILS, asked before anything is stored -----------------------------------------------
say "Admin addresses (ADMIN_EMAILS, stored as a secret)"
echo "Use an address Google is authoritative for (a Gmail address): admin also needs a Google session."
if has_secret ADMIN_EMAILS; then
  printf 'New comma-separated list, or Enter to keep the stored one: '
else
  printf 'Comma-separated list, or Enter to skip (no admin until it is set): '
fi
IFS= read -r admin_line || admin_line=""
ADMIN_VALUE=""
if [ -n "$(printf '%s' "$admin_line" | tr -d '[:space:]')" ]; then
  ADMIN_VALUE=$(printf '%s' "$admin_line" | ops admin-emails) || die "Nothing was stored."
fi

# --- licence signing key -------------------------------------------------------------------------
JWK_TMP=$(mktemp "${TMPDIR:-/tmp}/pyarcana-public-jwk.XXXXXX")
trap 'rm -f "$JWK_TMP"' EXIT
NEW_KEY=0
if [ -n "$ROTATE_KID" ] || ! has_secret LICENSE_PRIVATE_KEY_PKCS8_B64; then
  NEW_KID="${ROTATE_KID:-$KEY_ID}"
  say "Licence signing key ($NEW_KID)"
  ops licence-key "$NEW_KID" "$JWK_TMP" | wr secret put LICENSE_PRIVATE_KEY_PKCS8_B64 \
    || die "Storing the licence key failed. Nothing else was changed; run this again."
  if [ -n "$ROTATE_KID" ]; then
    ops toml-set "$TOML" vars LICENSE_KEY_ID "$ROTATE_KID"
    echo "LICENSE_KEY_ID is now \"$ROTATE_KID\" in wrangler.toml (a public value: commit this line)."
  fi
  NEW_KEY=1
else
  say "Licence signing key: one already exists, keeping it"
  echo "Every licence already issued stays valid. Pass --rotate-key <new kid> to replace it."
fi

# --- SERVER_PEPPER ---------------------------------------------------------------------------------
if has_secret SERVER_PEPPER; then
  say "SERVER_PEPPER: already set, keeping it (it is never rotated by this script)"
else
  say "SERVER_PEPPER"
  ops pepper | wr secret put SERVER_PEPPER || die "Storing SERVER_PEPPER failed; run this again."
fi

# --- ADMIN_EMAILS ------------------------------------------------------------------------------------
if [ -n "$ADMIN_VALUE" ]; then
  say "ADMIN_EMAILS"
  printf '%s' "$ADMIN_VALUE" | wr secret put ADMIN_EMAILS || die "Storing ADMIN_EMAILS failed; run this again."
elif has_secret ADMIN_EMAILS; then
  echo "ADMIN_EMAILS: kept."
else
  echo "ADMIN_EMAILS: not set. No account is admin until you run this again with an address."
fi

# --- the public half, printed BEFORE the deploy so a failed deploy cannot lose it -----------------
if [ "$NEW_KEY" = 1 ]; then
  say "PUBLIC licence key (safe to commit)"
  echo "Add this line to src/lib/cloud/config.ts, licence.publicKeys:"
  echo
  cat "$JWK_TMP"
  echo
  if [ -n "$ROTATE_KID" ]; then
    echo "Rotation: KEEP the old key in licence.publicKeys, and set LICENSE_PREV_PUBLIC_JWK in"
    echo "wrangler.toml [vars] to the old public JWK (one line) so GET /api/v1/jwks lists both."
    echo "Remove both no sooner than 72 hours after this deploy (the longest licence lifetime)."
  fi
fi

say "Deploy"
bash "$HERE/deploy.sh"

say "Done"
echo "The private licence key and SERVER_PEPPER exist only as Worker secrets, not on this machine."
echo "Revoke the API token if you made it for this run."
