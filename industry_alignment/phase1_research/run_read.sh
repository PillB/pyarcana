#!/usr/bin/env bash
# Sequential web page reader with retry on 429.
# Usage: ./run_read.sh <output_file> <url>
set -euo pipefail

OUT="$1"; URL="$2"
BASE="/home/z/my-project/pyarcana_repo/industry_alignment/phase1_research/raw_pages"
LOG="/tmp/zai_read.log"

for attempt in 1 2 3 4; do
  if z-ai function -n page_reader -a "{\"url\": \"$URL\"}" -o "$BASE/$OUT" >"$LOG" 2>&1; then
    if [ -s "$BASE/$OUT" ]; then
      echo "OK   $OUT"
      exit 0
    fi
  fi
  if grep -q "429" "$LOG"; then
    sleep=$((attempt * 10))
    echo "429  $OUT (attempt $attempt) — sleeping ${sleep}s"
    sleep "$sleep"
    continue
  fi
  echo "FAIL $OUT"
  tail -5 "$LOG"
  exit 1
done
echo "GAVEUP $OUT after 4 attempts"
exit 1
