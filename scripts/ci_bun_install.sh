#!/usr/bin/env bash
set -euo pipefail

# Keep transient registry/archive failures from taking down every CI job while
# preserving the lockfile as the single dependency source of truth.
readonly max_attempts=3

for attempt in $(seq 1 "$max_attempts"); do
  echo "bun install attempt ${attempt}/${max_attempts}"
  if bun install --frozen-lockfile; then
    exit 0
  fi

  if [[ "$attempt" -lt "$max_attempts" ]]; then
    echo "bun install failed; clearing Bun's download cache before retrying"
    bun pm cache rm || true
  fi
done

echo "bun install failed after ${max_attempts} attempts" >&2
exit 1
