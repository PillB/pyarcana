#!/usr/bin/env bash
# Spanish-language pass: English leaking into Spanish prose, decided word by word.
# Usage: tools/fixer/run_spanish.sh S46 S51 ...
#
# Measured by scripts/code_switching_audit.py (avoidable English per 1,000 words). Each
# English word gets a decision - identifier to backtick, practitioner term to keep and
# gloss, ordinary word to translate - because translating a field name breaks the match
# between prose and code. Verified by the shared gate like every other runner.
set -uo pipefail
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
MODEL="${FIXER_MODEL:-gpt-5.6-sol}"
EFFORT="${FIXER_EFFORT:-medium}"

for TAG in "$@"; do
  # One writer per section for the whole round. S44's gate measured a change this runner never
  # made: apply_patches.py applied 0 of 15 patches, yet the file differed between snapshot and
  # check because something else in the campaign wrote to it mid-run. That stales every anchor
  # and misattributes the gate delta, and it looks exactly like "codex's anchors were wrong".
  # mkdir, not flock: macOS ships no flock, the same gap run_codex.py documents for `timeout`.
  LOCK=".fixer/${TAG}.lock.d"
  if ! mkdir "$LOCK" 2>/dev/null; then
    echo "!! $TAG is already being processed (holder: $(cat "$LOCK/pid" 2>/dev/null || echo unknown)) - skipping"
    continue
  fi
  echo $$ > "$LOCK/pid"
  # Release on every exit path, including the gate-failure exit below.
  trap 'rm -rf "$LOCK"' EXIT INT TERM

  echo "################ $TAG spanish $(date -u +%H:%M:%SZ)"
  rm -f .fixer/${TAG}s.* ".fixer/$TAG.gate-before.json" ".fixer/$TAG.gate-after.json"
  python3 tools/fixer/gate.py snapshot "$TAG" || { echo "!! $TAG snapshot failed"; exit 1; }

  python3 tools/fixer/build_spanish_prompt.py "$TAG" > ".fixer/${TAG}s.prompt.txt" || exit 1
  python3 tools/fixer/run_codex.py "${TAG}s" "$MODEL" "$EFFORT" || { echo "!! $TAG codex failed"; exit 1; }

  read -r SLUG FILE < <(python3 tools/fixer/section_path.py "$TAG")
  cp "$FILE" ".fixer/${TAG}.pre-spanish.ts"

  python3 -c "
import json, pathlib
p = pathlib.Path('.fixer/${TAG}s.result.json'); d = json.loads(p.read_text(encoding='utf-8'))
d['section_id'] = '${SLUG}'; p.write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')"
  # Its exit code matters: a non-zero means the batch was rolled back, and the gate below would
  # otherwise compare an unchanged file against itself and pass, reporting a clean round that
  # changed nothing (S39 lost 32 patches that way).
  if ! python3 tools/fixer/apply_patches.py ".fixer/${TAG}s.result.json" --apply > ".fixer/${TAG}s.apply.json"; then
    echo "!! $TAG apply rolled the batch back - the file did not typecheck; see typecheck_error"
  fi
  python3 -c "
import json
r = json.load(open('.fixer/${TAG}s.apply.json'))
back = len(r.get('rolled_back_patches') or [])
extra = f', rolled back {back}' if back else ''
print(f\"    applied {r['applied']}, rejected {r['rejected']}{extra}\")"

  if ! python3 tools/fixer/gate.py check "$TAG"; then
    echo "!! $TAG failed its gates - restoring the section and stopping"
    cp ".fixer/${TAG}.pre-spanish.ts" "$FILE"
    exit 1
  fi

  N=$(python3 tools/fixer/record_rejections.py "$TAG" ".fixer/${TAG}s.apply.json" spanish)
  if [ "$N" -gt 0 ]; then
    echo "    $TAG passed its gates, but $N patch(es) were not applied - recorded in OPEN_QUESTIONS.md"
  else
    echo "    $TAG passed every gate, with no unapplied patches"
  fi

  rm -rf "$LOCK"
  trap - EXIT INT TERM
done
