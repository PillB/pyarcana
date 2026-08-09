#!/bin/bash
set -e
echo "=== PyArcana — Running all 13 capstone acceptance tests ==="
PASS=0; FAIL=0
for cp in CP-N1-A CP-N1-B CP-N1-C CP-N2-A CP-N2-B CP-N2-C CP-N3-A CP-N3-B CP-N3-C CP-N4-A CP-N4-B CP-N4-C CP-FINAL; do
  echo "--- $cp ---"
  if python3 "capstones/$cp/acceptance.py" >/tmp/$cp.acceptance.log 2>&1; then
    echo "  PASS"; PASS=$((PASS+1))
  else
    echo "  FAIL"; FAIL=$((FAIL+1)); tail -5 /tmp/$cp.acceptance.log
  fi
done
echo "=== RESULT: $PASS pass, $FAIL fail ==="
[ $FAIL -eq 0 ]
