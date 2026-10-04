#!/usr/bin/env bash
#
# Redeploy pyarcana.dev from the owner's deploy checkout, in one command:
#
#   workers/billing/scripts/redeploy.sh
#
# 1. stops unless this checkout is on the deploy branch (DEPLOY_BRANCH below, or
#    PYARCANA_DEPLOY_BRANCH), and unless the only local change is wrangler.toml's D1 id;
# 2. drops that local id (setup.sh writes it back), pulls fast-forward only, and stops unless the
#    checkout then equals origin/<branch>; prints the commit being deployed;
# 3. bun install;
# 4. runs setup.sh, which asks for the Cloudflare API token with a visible prompt (typing hidden)
#    and for the account id when they are not exported, keeps every stored secret, builds and
#    deploys. Arguments are passed on to setup.sh.

set -euo pipefail

# The branch pyarcana.dev deploys from. Change it here when the work moves to another branch.
DEPLOY_BRANCH="${PYARCANA_DEPLOY_BRANCH:-claude/gifted-lamport-8ddc84}"

HERE="$(cd "$(dirname "$0")" && pwd)"
# shellcheck source=common.sh
. "$HERE/common.sh"
REPO="$(git -C "$HERE" rev-parse --show-toplevel 2>/dev/null)" || die "This is not inside a git checkout of pyarcana."
cd "$REPO"
TOML="workers/billing/wrangler.toml"

say "1/4  Checking the branch"
current="$(git branch --show-current)"
if [ "$current" != "$DEPLOY_BRANCH" ]; then
  die "STOP: this checkout is on \"${current:-a detached HEAD}\", but pyarcana.dev deploys from \"$DEPLOY_BRANCH\".
Nothing was changed. Switch with:
  git checkout -- $TOML && git checkout $DEPLOY_BRANCH
then run this again."
fi
other="$(git status --porcelain --untracked-files=no | grep -v " $TOML\$" || true)"
if [ -n "$other" ]; then
  # Show what changed, so the decision (keep or discard) is made on the content, not the file name.
  changed="$(git diff --no-color --stat -- . ":(exclude)$TOML" | tail -n 1)"
  detail="$(git diff --no-color -- . ":(exclude)$TOML" | head -n 40)"
  die "STOP: this checkout has local changes besides $TOML:
$other
($changed)

What changed (first 40 lines):
$detail

Nothing was changed. If you do not need these edits, discard them with
  git checkout -- <file>
otherwise commit or stash them; then run this again."
fi
echo "On $DEPLOY_BRANCH, no other local changes."

say "2/4  Updating to the latest $DEPLOY_BRANCH"
git checkout -- "$TOML"
git pull --ff-only origin "$DEPLOY_BRANCH" || die "STOP: git pull failed (network, or the branch moved in a way a fast-forward cannot follow). Nothing was deployed."
[ "$(git rev-parse HEAD)" = "$(git rev-parse "origin/$DEPLOY_BRANCH")" ] || die "STOP: this checkout is not at origin/$DEPLOY_BRANCH after the pull. Nothing was deployed."
echo "Deploying: $(git log -1 --format='%h %s (%cd)' --date=short)"

say "3/4  Installing dependencies (bun install)"
bun install || die "STOP: bun install failed. Nothing was deployed."

say "4/4  Cloudflare setup and deploy"
exec "$HERE/setup.sh" "$@"
