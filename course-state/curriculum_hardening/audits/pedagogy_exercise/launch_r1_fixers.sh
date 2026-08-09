#!/bin/bash
set -u
ROOT="/Users/pabloillescas/Projects/PyArcana"
LOGDIR="/tmp/pedagogy_r1_fix_logs"
PROMPTDIR="$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/fixer_prompts"
REPORTDIR="$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/round1"
MAX=${MAX_CONCURRENT:-6}
mkdir -p "$LOGDIR"

running_count() {
  local c=0
  for f in "$LOGDIR"/S*.pid; do
    [ -f "$f" ] || continue
    pid=$(cat "$f" 2>/dev/null)
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then c=$((c+1)); fi
  done
  echo $c
}

launch_one() {
  local n=$1
  local nn=$(printf '%02d' "$n")
  local report="$REPORTDIR/S${nn}_EXERCISE_PEDAGOGY_REPORT.md"
  local donef="$REPORTDIR/S${nn}_PEDAGOGY_FIXER_REPORT.md"
  if [ ! -s "$report" ]; then echo "S${nn} no review yet"; return 1; fi
  if [ -s "$donef" ]; then echo "S${nn} fixer done"; return 0; fi
  if [ -f "$LOGDIR/S${nn}.pid" ] && kill -0 "$(cat "$LOGDIR/S${nn}.pid")" 2>/dev/null; then
    echo "S${nn} running"; return 0
  fi
  echo "$(date -u +%H:%M:%S) Launching fixer S${nn}"
  (
    cd "$ROOT"
    grok --prompt-file "$PROMPTDIR/S${nn}_R1_FIXER.txt" \
      --always-approve --max-turns 100 --verbatim \
      --cwd "$ROOT" --output-format json \
      --disallowed-tools "Agent" \
      > "$LOGDIR/S${nn}.log" 2>"$LOGDIR/S${nn}.err"
    echo "exit:$?" > "$LOGDIR/S${nn}.meta"
  ) &
  echo $! > "$LOGDIR/S${nn}.pid"
  return 0
}

# Wait until all reviews exist OR timeout after long wait - poll forever until 52 reviews then fix all
echo "Waiting for all 52 reviews before mass-fix launch..."
while true; do
  r=$(ls "$REPORTDIR"/S*_EXERCISE_PEDAGOGY_REPORT.md 2>/dev/null | wc -l | tr -d ' ')
  echo "$(date -u +%H:%M:%S) reviews=$r/52"
  [ "$r" -ge 52 ] && break
  sleep 60
done

for n in $(seq 1 52); do
  while [ $(running_count) -ge $MAX ]; do sleep 20; done
  launch_one "$n"
  sleep 2
done

while [ $(running_count) -gt 0 ]; do
  d=$(ls "$REPORTDIR"/S*_PEDAGOGY_FIXER_REPORT.md 2>/dev/null | wc -l | tr -d ' ')
  echo "$(date -u +%H:%M:%S) fixers running=$(running_count) done=$d/52"
  sleep 30
done
echo "R1 fixers drained."
