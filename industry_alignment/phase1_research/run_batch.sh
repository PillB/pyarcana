#!/usr/bin/env bash
# Sequential web search runner with throttling.
# Args: output_prefix query num
set -uo pipefail
OUT="$1"; QUERY="$2"; NUM="${3:-8}"
BASE="/home/z/my-project/pyarcana_repo/industry_alignment/phase1_research/raw_searches_rpa_aiml_py"
LOG="/tmp/zai_search_$$.log"

for attempt in 1 2 3 4 5; do
  if z-ai function -n web_search -a "{\"query\": \"$QUERY\", \"num\": $NUM}" -o "$BASE/$OUT" >"$LOG" 2>&1; then
    if [ -s "$BASE/$OUT" ]; then
      echo "OK   $OUT"
      exit 0
    fi
  fi
  if grep -qi "429\|rate" "$LOG"; then
    sleep=$((attempt * 10))
    echo "429  $OUT (attempt $attempt) — sleeping ${sleep}s"
    sleep "$sleep"
    continue
  fi
  echo "FAIL $OUT"
  tail -3 "$LOG"
  exit 1
done
echo "GAVEUP $OUT after 5 attempts"
exit 1
