#!/usr/bin/env bash
# Run fixer rounds back to back, committing each section that passes its gates.
# Usage: tools/fixer/run_chain.sh S05 S06 S07 ...
# A section whose patches rolled back, or that regresses lesson runtime, stops the chain.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"

echo "==> preflight"
python3 tools/fixer/preflight.py || exit 1

for TAG in "$@"; do
  echo "################ $TAG $(date -u +%H:%M:%SZ)"
  if ! bash tools/fixer/run_round.sh "$TAG" --apply > ".fixer/$TAG.round.log" 2>&1; then
    echo "!! $TAG round exited non-zero - stopping chain"
    tail -25 ".fixer/$TAG.round.log"
    exit 1
  fi

  if grep -q "RUNTIME REGRESSION" ".fixer/$TAG.round.log"; then
    echo "!! $TAG regressed lesson runtime - stopping chain, nothing committed"
    grep -A8 "RUNTIME REGRESSION" ".fixer/$TAG.round.log"
    exit 1
  fi
  if python3 -c "
import json,sys
r=json.load(open('.fixer/$TAG.apply.json'))
sys.exit(1 if r.get('rolled_back') else 0)"; then :; else
    echo "!! $TAG patches rolled back - stopping chain"
    exit 1
  fi

  SLUG=$(python3 -c "
import json
print(json.load(open('.fixer/$TAG.apply.json'))['file'])")
  CLOSED=$(python3 -c "
import json
print(len(json.load(open('.fixer/$TAG.apply.json'))['findings_closed']))")
  APPLIED=$(python3 -c "
import json
print(json.load(open('.fixer/$TAG.apply.json'))['applied'])")

  python3 tools/fixer/safe_commit.py "$TAG" "fix($TAG): apply $APPLIED patches closing $CLOSED findings

Authored by codex (gpt-5.6-sol, medium) under the writing contracts and the
standing decisions in audit/fixer/decisions.md; applied here after each anchor
was checked to match exactly one place, the section still imported, and lesson
code still ran under .venv-content against its baseline.

Per-finding detail in audit/fixer/cycles/$TAG.json, including anything codex
raised rather than guessed.

Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01CTsmtUiGck5yrCR5AL1yXG" || exit 1
  echo "== $TAG committed: $APPLIED patches, $CLOSED findings closed"
done
echo "################ chain complete"
