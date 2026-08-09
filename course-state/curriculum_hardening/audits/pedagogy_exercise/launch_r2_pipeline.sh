#!/bin/bash
set -u
ROOT="/Users/pabloillescas/Projects/PyArcana"
R1="$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/round1"
R2="$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/round2"
MAX=${MAX_CONCURRENT:-6}
mkdir -p /tmp/pedagogy_r2_rev_logs /tmp/pedagogy_r2_fix_logs "$R2"

echo "Waiting for R1 fixers 52/52..."
while true; do
  f=$(ls "$R1"/S*_PEDAGOGY_FIXER_REPORT.md 2>/dev/null | wc -l | tr -d ' ')
  # Count real grok fixer processes only (avoid self-match of wait scripts)
  r=$(pgrep -fl 'grok --prompt-file' 2>/dev/null | grep -c 'R1_FIXER' || true)
  echo "$(date -u +%H:%M:%S) r1_fixes=$f/52 running=$r"
  [ "$f" -ge 52 ] && [ "$r" -eq 0 ] && break
  sleep 30
done

echo "Launching R2 reviewers..."
running_count() {
  local dir=$1 c=0
  for p in "$dir"/S*.pid; do
    [ -f "$p" ] || continue
    pid=$(cat "$p")
    kill -0 "$pid" 2>/dev/null && c=$((c+1))
  done
  echo $c
}

for n in $(seq 1 52); do
  nn=$(printf '%02d' $n)
  while [ $(running_count /tmp/pedagogy_r2_rev_logs) -ge $MAX ]; do sleep 20; done
  if [ -s "$R2/S${nn}_EXERCISE_PEDAGOGY_REPORT.md" ]; then echo "S${nn} r2 review exists"; continue; fi
  echo "Launch R2 review S${nn}"
  (
    cd "$ROOT"
    grok --prompt-file "$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/reviewer_prompts_r2/S${nn}_R2_REVIEWER.txt" \
      --always-approve --max-turns 80 --verbatim --cwd "$ROOT" --output-format json --disallowed-tools Agent \
      > /tmp/pedagogy_r2_rev_logs/S${nn}.log 2>/tmp/pedagogy_r2_rev_logs/S${nn}.err
    echo exit:$? > /tmp/pedagogy_r2_rev_logs/S${nn}.meta
  ) &
  echo $! > /tmp/pedagogy_r2_rev_logs/S${nn}.pid
  sleep 2
done
while [ $(running_count /tmp/pedagogy_r2_rev_logs) -gt 0 ]; do
  echo "$(date -u +%H:%M:%S) r2 reviews running=$(running_count /tmp/pedagogy_r2_rev_logs) done=$(ls "$R2"/S*_EXERCISE_PEDAGOGY_REPORT.md 2>/dev/null | wc -l | tr -d ' ')"
  sleep 30
done

echo "Launching R2 fixers..."
for n in $(seq 1 52); do
  nn=$(printf '%02d' $n)
  while [ $(running_count /tmp/pedagogy_r2_fix_logs) -ge $MAX ]; do sleep 20; done
  if [ -s "$R2/S${nn}_PEDAGOGY_FIXER_REPORT.md" ]; then continue; fi
  echo "Launch R2 fix S${nn}"
  (
    cd "$ROOT"
    grok --prompt-file "$ROOT/course-state/curriculum_hardening/audits/pedagogy_exercise/fixer_prompts_r2/S${nn}_R2_FIXER.txt" \
      --always-approve --max-turns 100 --verbatim --cwd "$ROOT" --output-format json --disallowed-tools Agent \
      > /tmp/pedagogy_r2_fix_logs/S${nn}.log 2>/tmp/pedagogy_r2_fix_logs/S${nn}.err
    echo exit:$? > /tmp/pedagogy_r2_fix_logs/S${nn}.meta
  ) &
  echo $! > /tmp/pedagogy_r2_fix_logs/S${nn}.pid
  sleep 2
done
while [ $(running_count /tmp/pedagogy_r2_fix_logs) -gt 0 ]; do
  echo "$(date -u +%H:%M:%S) r2 fixes running=$(running_count /tmp/pedagogy_r2_fix_logs) done=$(ls "$R2"/S*_PEDAGOGY_FIXER_REPORT.md 2>/dev/null | wc -l | tr -d ' ')"
  sleep 30
done
echo "R2 PIPELINE COMPLETE"
