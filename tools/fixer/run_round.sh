#!/usr/bin/env bash
# One fixer round for one section: build prompt -> codex authors -> apply -> gates.
# Usage: tools/fixer/run_round.sh S01 [--apply]
set -euo pipefail
TAG="${1:?usage: run_round.sh S01 [--apply]}"
APPLY="${2:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
mkdir -p .fixer

MODEL="${FIXER_MODEL:-gpt-5.6-sol}"
EFFORT="${FIXER_EFFORT:-medium}"

echo "==> [$TAG] building prompt"
python3 tools/fixer/build_prompt.py "$TAG" > ".fixer/$TAG.prompt.txt"

echo "==> [$TAG] codex ($MODEL, $EFFORT) authoring content (read-only)"
# Deadline + retry live in run_codex.py: S06 spent 5.5h reconnecting after a
# transport error before failing, and took the chain down with it.
python3 tools/fixer/run_codex.py "$TAG" "$MODEL" "$EFFORT" || exit 1

echo "==> [$TAG] applying patches ${APPLY:-(dry run)}"
python3 tools/fixer/apply_patches.py ".fixer/$TAG.result.json" $APPLY \
  | tee ".fixer/$TAG.apply.json"

# Converging critique loop. Runs AFTER the first apply, so codex reviews the text as
# it now stands in the file and its anchors resolve. Anything it marked unresolved
# comes back to it, bounded at two laps - a concern surviving both needs a human.
if [ "$APPLY" = "--apply" ]; then
  for ROUND in 1 2; do
    if python3 tools/fixer/build_critique_followup.py "$TAG" > ".fixer/${TAG}c$ROUND.prompt.txt" 2>/dev/null; then
      echo "==> [$TAG] critique follow-up $ROUND"
      if python3 tools/fixer/run_codex.py "${TAG}c$ROUND" "$MODEL" "$EFFORT"; then
        python3 - <<PYEOF
import json, pathlib
res = pathlib.Path(".fixer/${TAG}c$ROUND.result.json")
if res.exists():
    d = json.loads(res.read_text(encoding="utf-8"))
    d["section_id"] = "$TAG"
    res.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
PYEOF
        python3 tools/fixer/apply_patches.py ".fixer/${TAG}c$ROUND.result.json" --apply           | tee ".fixer/${TAG}c$ROUND.apply.json" | python3 -c "
import json,sys
r=json.load(sys.stdin)
print(f\"    follow-up applied {r['applied']}, rejected {r['rejected']}\")"
      else
        break
      fi
    else
      break
    fi
  done
fi

if [ "$APPLY" = "--apply" ]; then
  echo "==> [$TAG] gates"
  npm run test:v3 >/dev/null && echo "    test:v3 ok"
  # Runtime regression guard: lesson code must not stop running.
  # The teaching environment, not system python. Snippets target 3.12 with pinned
  # packages; running them under anything else reports drift as if it were broken content.
  CONTENT_PY="$ROOT/.venv-content/bin/python"
  [ -x "$CONTENT_PY" ] || { echo "    MISSING .venv-content - cannot verify lesson code"; exit 1; }
  "$CONTENT_PY" scripts/python_content_runtime_audit.py --workers 4 >/dev/null 2>&1 || true
  python3 tools/fixer/check_runtime_regression.py

  npm run test:first-use-all || echo "    first-use still reports gaps (expected until all sections done)"
  python3 scripts/badge_readiness_audit.py || true
  python3 scripts/synthetic_identifier_audit.py || echo "    D2 violations remain (see report)"

  echo "==> [$TAG] recording cycle ledger"
  python3 tools/fixer/record_cycle.py "$TAG"
fi
