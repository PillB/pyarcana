#!/usr/bin/env bash
# Teach, rephrase or remove the concepts a section uses without explaining them (D6).
# Usage: tools/fixer/run_concepts.sh S01 S02 ...
#
# Verification is tools/fixer/gate.py, shared by every runner, so "passed" means the
# same thing everywhere. A failed gate restores the section and stops the chain; a
# rejected patch is recorded and the round is never announced clean while one exists.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
MODEL="${FIXER_MODEL:-gpt-5.6-sol}"
EFFORT="${FIXER_EFFORT:-medium}"

# Every derived report gate.py rewrites during a check. Restoring the section without these
# leaves them describing content that was rolled back. Keep in step with gate.py's measure().
REPORTS=(
  "course-state/concept_map.json"
  "course-state/first_use_all_report.json"
  "course-state/code_switching_report.json"
  "course-state/prose_quality_report.json"
  "course-state/synthetic_identifier_report.json"
  "course-state/python_runtime_audit_report.json"
  ".fixer/events.json"
)

for TAG in "$@"; do
  echo "################ $TAG concepts $(date -u +%H:%M:%SZ)"
  rm -f .fixer/${TAG}k.* ".fixer/$TAG.gate-before.json" ".fixer/$TAG.gate-after.json"
  python3 tools/fixer/gate.py snapshot "$TAG" || { echo "!! $TAG snapshot failed"; exit 1; }

  if ! python3 tools/fixer/build_concept_prompt.py "$TAG" > ".fixer/${TAG}k.prompt.txt" 2>/dev/null; then
    echo "    nothing unexplained in $TAG"; continue
  fi
  python3 tools/fixer/run_codex.py "${TAG}k" "$MODEL" "$EFFORT" || { echo "!! $TAG codex failed - stopping"; exit 1; }

  read -r SLUG FILE < <(python3 tools/fixer/section_path.py "$TAG")
  cp "$FILE" ".fixer/${TAG}.pre-concepts.ts"

  # The derived reports are part of the state this round is about to change, so they are part
  # of what "restore" has to mean. gate.py regenerates all of them during its check; without
  # this, a failed round leaves them describing a tree that no longer exists, and the next
  # person to diagnose the failure copies one as a "before" snapshot and measures nothing.
  # That happened three times in one day before anyone noticed the reports were lying.
  for R in "${REPORTS[@]}"; do
    [ -f "$R" ] && cp "$R" ".fixer/${TAG}.pre-concepts.$(basename "$R")"
  done

  python3 -c "
import json, pathlib
p = pathlib.Path('.fixer/${TAG}k.result.json'); d = json.loads(p.read_text(encoding='utf-8'))
d['section_id'] = '${SLUG}'; p.write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')"
  python3 tools/fixer/apply_patches.py ".fixer/${TAG}k.result.json" --apply > ".fixer/${TAG}k.apply.json"
  python3 -c "
import json
r = json.load(open('.fixer/${TAG}k.apply.json'))
print(f\"    applied {r['applied']}, rejected {r['rejected']}, rolled_back {r.get('rolled_back', False)}\")"

  if ! python3 tools/fixer/gate.py check "$TAG"; then
    echo "!! $TAG failed its gates - restoring the section and stopping the chain"
    cp ".fixer/${TAG}.pre-concepts.ts" "$FILE"
    for R in "${REPORTS[@]}"; do
      S=".fixer/${TAG}.pre-concepts.$(basename "$R")"
      [ -f "$S" ] && cp "$S" "$R"
    done
    echo "   the derived reports were restored too; they describe the section as it is now"
    exit 1
  fi

  N=$(python3 tools/fixer/record_rejections.py "$TAG" ".fixer/${TAG}k.apply.json" concepts)
  if [ "$N" -gt 0 ]; then
    echo "    $TAG passed its gates, but $N patch(es) were not applied - recorded in OPEN_QUESTIONS.md"
  else
    echo "    $TAG passed every gate, with no unapplied patches"
  fi
done
