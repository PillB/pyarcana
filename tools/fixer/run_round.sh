#!/usr/bin/env bash
# One findings round for one section: prompt -> codex authors -> apply -> critique -> gate.
# Usage: tools/fixer/run_round.sh S01 [--apply]
#
# Verification is tools/fixer/gate.py, shared by every runner. This script used to run
# its own gates and swallow their failures (`|| echo`), and run_chain.sh only looked for
# a runtime regression - so a section whose adversarial suite failed could be committed.
# Now any failed gate restores the section and exits non-zero, which stops the chain.
set -uo pipefail
TAG="${1:?usage: run_round.sh S01 [--apply]}"
APPLY="${2:-}"
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
cd "$ROOT"
mkdir -p .fixer

MODEL="${FIXER_MODEL:-gpt-5.6-sol}"
EFFORT="${FIXER_EFFORT:-medium}"

# A previous run of this section leaves c1/c2 results and apply reports behind; the
# critique builder would pick up the stale "newest" result and the rejection count would
# include last week's patches. Start each round clean.
rm -f ".fixer/$TAG.result.json" ".fixer/$TAG.apply.json" \
      .fixer/${TAG}c1.* .fixer/${TAG}c2.* ".fixer/$TAG.gate-before.json" ".fixer/$TAG.gate-after.json"

if [ "$APPLY" = "--apply" ]; then
  python3 tools/fixer/gate.py snapshot "$TAG" || { echo "!! $TAG snapshot failed"; exit 1; }
fi

echo "==> [$TAG] building prompt"
python3 tools/fixer/build_prompt.py "$TAG" > ".fixer/$TAG.prompt.txt" || exit 1

echo "==> [$TAG] codex ($MODEL, $EFFORT) authoring content (read-only)"
# Deadline and retry live in run_codex.py: S06 once spent 5.5h reconnecting.
python3 tools/fixer/run_codex.py "$TAG" "$MODEL" "$EFFORT" || exit 1

read -r SLUG FILE < <(python3 tools/fixer/section_path.py "$TAG")
[ "$APPLY" = "--apply" ] && cp "$FILE" ".fixer/${TAG}.pre-round.ts"

echo "==> [$TAG] applying patches ${APPLY:-(dry run)}"
python3 tools/fixer/apply_patches.py ".fixer/$TAG.result.json" $APPLY > ".fixer/$TAG.apply.json"
python3 -c "
import json
r = json.load(open('.fixer/$TAG.apply.json'))
print(f\"    applied {r['applied']}, rejected {r['rejected']}, rolled_back {r.get('rolled_back', False)}\")"
[ "$APPLY" = "--apply" ] || exit 0

# Converging critique loop: codex reviews the text as it now stands and anything it marked
# unresolved comes back to it, bounded at two laps.
for ROUND in 1 2; do
  python3 tools/fixer/build_critique_followup.py "$TAG" > ".fixer/${TAG}c$ROUND.prompt.txt" 2>/dev/null || break
  echo "==> [$TAG] critique follow-up $ROUND"
  python3 tools/fixer/run_codex.py "${TAG}c$ROUND" "$MODEL" "$EFFORT" || break
  python3 -c "
import json, pathlib
p = pathlib.Path('.fixer/${TAG}c$ROUND.result.json')
if p.exists():
    d = json.loads(p.read_text(encoding='utf-8')); d['section_id'] = '$SLUG'
    p.write_text(json.dumps(d, ensure_ascii=False), encoding='utf-8')"
  python3 tools/fixer/apply_patches.py ".fixer/${TAG}c$ROUND.result.json" --apply > ".fixer/${TAG}c$ROUND.apply.json"
done

echo "==> [$TAG] gate"
if ! python3 tools/fixer/gate.py check "$TAG"; then
  echo "!! $TAG failed its gates - restoring the section"
  cp ".fixer/${TAG}.pre-round.ts" "$FILE"
  exit 1
fi

# Course-wide and informational: badge readiness depends on every section, not this one.
python3 scripts/badge_readiness_audit.py >/dev/null 2>&1 || echo "    (badge readiness still reports course-wide issues)"

UNAPPLIED=0
for APPLY_JSON in ".fixer/$TAG.apply.json" .fixer/${TAG}c1.apply.json .fixer/${TAG}c2.apply.json; do
  [ -f "$APPLY_JSON" ] || continue
  N=$(python3 tools/fixer/record_rejections.py "$TAG" "$APPLY_JSON" findings)
  UNAPPLIED=$((UNAPPLIED + N))
done

echo "==> [$TAG] recording cycle ledger"
python3 tools/fixer/record_cycle.py "$TAG"

if [ "$UNAPPLIED" -gt 0 ]; then
  echo "    $TAG passed its gates, but $UNAPPLIED patch(es) were not applied - recorded in OPEN_QUESTIONS.md"
else
  echo "    $TAG passed every gate, with no unapplied patches"
fi
