#!/usr/bin/env bash
# Teach, rephrase or remove the concepts a section uses without explaining them (D6).
# Usage: tools/fixer/run_concepts.sh S01 S02 ...
#
# A section whose gates fail is restored from its pre-round copy and the chain stops.
# An earlier version printed FAILED and carried on, so four rounds landed on top of a
# broken curriculum contract before anyone read the log.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
MODEL="${FIXER_MODEL:-gpt-5.6-sol}"
EFFORT="${FIXER_EFFORT:-medium}"

gate() {  # prints PASS/FAIL per suite; returns non-zero if any failed
  local ok=0
  if npm run test:adversarial:node >/dev/null 2>&1; then echo "    adversarial(node) PASS"; else echo "    adversarial(node) FAIL"; ok=1; fi
  if npm run test:adversarial:py   >/dev/null 2>&1; then echo "    adversarial(py) PASS";   else echo "    adversarial(py) FAIL"; ok=1; fi
  if npm run test:v3               >/dev/null 2>&1; then echo "    v3 PASS";                else echo "    v3 FAIL"; ok=1; fi
  return $ok
}

for TAG in "$@"; do
  echo "################ $TAG concepts $(date -u +%H:%M:%SZ)"
  npx tsx scripts/course_event_extractor.mts > .fixer/events.json 2>/dev/null
  python3 scripts/concept_map.py >/dev/null 2>&1

  if ! python3 tools/fixer/build_concept_prompt.py "$TAG" > ".fixer/${TAG}k.prompt.txt" 2>/dev/null; then
    echo "    nothing unexplained in $TAG"; continue
  fi
  python3 tools/fixer/run_codex.py "${TAG}k" "$MODEL" "$EFFORT" || { echo "!! $TAG codex failed - stopping"; exit 1; }

  read -r SLUG FILE < <(python3 tools/fixer/section_path.py "$TAG")
  cp "$FILE" ".fixer/${TAG}.pre-concepts.ts"   # restore point for this round only

  python3 - <<PY
import json, pathlib
p = pathlib.Path(".fixer/${TAG}k.result.json")
d = json.loads(p.read_text(encoding="utf-8")); d["section_id"] = "${SLUG}"
p.write_text(json.dumps(d, ensure_ascii=False), encoding="utf-8")
PY
  python3 tools/fixer/apply_patches.py ".fixer/${TAG}k.result.json" --apply \
    | tee ".fixer/${TAG}k.apply.json" | python3 -c "
import json,sys
r=json.load(sys.stdin)
print(f\"    applied {r['applied']}, rejected {r['rejected']}, rolled_back {r.get('rolled_back', False)}\")"

  if ! gate; then
    echo "!! $TAG failed its gates - restoring the section and stopping the chain"
    cp ".fixer/${TAG}.pre-concepts.ts" "$FILE"
    npm run test:adversarial:py 2>&1 | grep -E "^(FAIL|ERROR):" | head -8
    exit 1
  fi
  echo "    $TAG concepts PASSED all gates"
done
python3 scripts/concept_map.py | tail -10
