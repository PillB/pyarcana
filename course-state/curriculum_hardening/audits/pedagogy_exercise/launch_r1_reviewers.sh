#!/bin/bash
set -u
ROOT="/Users/pabloillescas/Projects/PyArcana"
LOGDIR="/tmp/pedagogy_r1_logs"
PROMPTDIR="$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/reviewer_prompts"
MAX=${MAX_CONCURRENT:-6}
mkdir -p "$LOGDIR" "$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/round1"

running_count() {
  local c=0
  for f in "$LOGDIR"/S*.pid; do
    [ -f "$f" ] || continue
    pid=$(cat "$f")
    if kill -0 "$pid" 2>/dev/null; then c=$((c+1)); fi
  done
  echo $c
}

launch_one() {
  local n=$1
  local nn=$(printf '%02d' "$n")
  local report="$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/round1/S${nn}_EXERCISE_PEDAGOGY_REPORT.md"
  if [ -f "$report" ] && [ -s "$report" ]; then
    echo "S${nn} report exists; skip"
    return
  fi
  if [ -f "$LOGDIR/S${nn}.pid" ] && kill -0 "$(cat "$LOGDIR/S${nn}.pid")" 2>/dev/null; then
    echo "S${nn} already running"
    return
  fi
  echo "$(date -u +%H:%M:%S) Launching reviewer S${nn} (running=$(running_count)/$MAX)"
  (
    cd "$ROOT"
    grok --prompt-file "$PROMPTDIR/S${nn}_R1_REVIEWER.txt" \
      --always-approve --max-turns 80 --verbatim \
      --cwd "$ROOT" --output-format json \
      --disallowed-tools "Agent" \
      > "$LOGDIR/S${nn}.log" 2>"$LOGDIR/S${nn}.err"
    echo "exit:$?" > "$LOGDIR/S${nn}.meta"
    date -u +%Y-%m-%dT%H:%M:%SZ >> "$LOGDIR/S${nn}.meta"
  ) &
  echo $! > "$LOGDIR/S${nn}.pid"
}

for n in $(seq 1 52); do
  while [ $(running_count) -ge $MAX ]; do sleep 20; done
  launch_one "$n"
  sleep 2
done

echo "All queued. Waiting for drain..."
while [ $(running_count) -gt 0 ]; do
  echo "$(date -u +%H:%M:%S) still running=$(running_count) reports=$(ls "$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/round1"/S*_EXERCISE_PEDAGOGY_REPORT.md 2>/dev/null | wc -l | tr -d ' ')"
  sleep 30
done
echo "Queue fully drained."
