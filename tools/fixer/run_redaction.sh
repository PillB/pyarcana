#!/usr/bin/env bash
# Grammar and redaction pass: codex improves the prose, the shared gate verifies it.
# Usage: tools/fixer/run_redaction.sh S01 S02 ...
#
# This runner once checked only prose metrics - no structure, no adversarial suite, no
# snippet execution - which is how a redaction pass deleted a worked example and two
# figures before anything noticed. It now uses the same verifier as every other runner.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
MODEL="${FIXER_MODEL:-gpt-5.6-sol}"
EFFORT="${FIXER_EFFORT:-medium}"

for TAG in "$@"; do
  echo "################ $TAG redaction $(date -u +%H:%M:%SZ)"
  rm -f .fixer/${TAG}r.* ".fixer/$TAG.gate-before.json" ".fixer/$TAG.gate-after.json"
  python3 tools/fixer/gate.py snapshot "$TAG" || { echo "!! $TAG snapshot failed"; exit 1; }

  python3 tools/fixer/build_redaction_prompt.py "$TAG" > ".fixer/${TAG}r.prompt.txt" || exit 1
  python3 tools/fixer/run_codex.py "${TAG}r" "$MODEL" "$EFFORT" || { echo "!! $TAG codex failed"; exit 1; }

  read -r SLUG FILE < <(python3 tools/fixer/section_path.py "$TAG")
  cp "$FILE" ".fixer/${TAG}.pre-redaction.ts"

  python3 -c "
import json, pathlib
p = pathlib.Path('.fixer/${TAG}r.result.json'); d = json.loads(p.read_text(encoding='utf-8'))
d['section_id'] = '${SLUG}'; p.write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')"
  python3 tools/fixer/apply_patches.py ".fixer/${TAG}r.result.json" --apply > ".fixer/${TAG}r.apply.json"
  python3 -c "
import json
r = json.load(open('.fixer/${TAG}r.apply.json'))
print(f\"    applied {r['applied']}, rejected {r['rejected']}, rolled_back {r.get('rolled_back', False)}\")"

  if ! python3 tools/fixer/gate.py check "$TAG"; then
    echo "!! $TAG failed its gates - restoring the section and stopping"
    cp ".fixer/${TAG}.pre-redaction.ts" "$FILE"
    exit 1
  fi

  N=$(python3 tools/fixer/record_rejections.py "$TAG" ".fixer/${TAG}r.apply.json" redaction)
  if [ "$N" -gt 0 ]; then
    echo "    $TAG passed its gates, but $N patch(es) were not applied - recorded in OPEN_QUESTIONS.md"
  else
    echo "    $TAG passed every gate, with no unapplied patches"
  fi
done
