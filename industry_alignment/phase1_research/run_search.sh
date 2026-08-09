#!/usr/bin/env bash
# Sequential web search runner with throttling to avoid 429 rate limits.
# Usage: ./run_search.sh <output_file> <query> [num]
set -euo pipefail

OUT="$1"; QUERY="$2"; NUM="${3:-10}"
BASE="/home/z/my-project/pyarcana_repo/industry_alignment/phase1_research"
LOG="/tmp/zai_search.log"

# Retry up to 4 times with exponential backoff on 429.
for attempt in 1 2 3 4; do
  if z-ai function -n web_search -a "{\"query\": \"$QUERY\", \"num\": $NUM}" -o "$BASE/$OUT" >"$LOG" 2>&1; then
    if [ -s "$BASE/$OUT" ]; then
      echo "OK   $OUT"
      exit 0
    fi
  fi
  if grep -q "429" "$LOG"; then
    sleep=$((attempt * 8))
    echo "429  $OUT (attempt $attempt) — sleeping ${sleep}s"
    sleep "$sleep"
    continue
  fi
  echo "FAIL $OUT"
  cat "$LOG" | tail -5
  exit 1
done
echo "GAVEUP $OUT after 4 attempts"
exit 1
