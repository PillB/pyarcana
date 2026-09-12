#!/usr/bin/env python3
"""Fail a fixer round that makes lesson code stop running.

The S01 round rewrote a premature Python demo into two shell commands - the right
pedagogical fix - but left language:'python' on it, so the runtime audit tried to
execute `echo $?` as Python. The structure gate and the first-use gate were both
green. Only running the lesson code caught it, which is why this runs every round.

The audit must run under .venv-content (Python 3.12 with the pinned packages).
Run it under system python and it reports 3.12 syntax as broken and pinned-output
mismatches as regressions: the first four rounds were measured against a baseline
of four such phantom failures, and S04's `zip(strict=True)` was flagged as a P0
for being valid only in the version the course actually requires.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASE = ROOT / "audit/fixer/runtime_baseline.json"
REPORT = ROOT / "course-state/python_runtime_audit_report.json"


def main() -> int:
    rep = json.loads(REPORT.read_text(encoding="utf-8"))
    now = {"fail": rep["totals"]["fail"], "p0": rep["p0_count"]}

    if not BASE.exists():
        BASE.parent.mkdir(parents=True, exist_ok=True)
        BASE.write_text(json.dumps(now, indent=1), encoding="utf-8")
        print(f"    runtime baseline recorded: {now}")
        return 0

    was = json.loads(BASE.read_text(encoding="utf-8"))
    if now["fail"] > was["fail"] or now["p0"] > was["p0"]:
        print(f"    RUNTIME REGRESSION: baseline {was}, now {now}")
        for f in rep["failures"]:
            print(f"      [{f['severity']}] {f['section_id']} {f['artifact_id']} -> {f['reason']}")
        return 1

    if now["fail"] < was["fail"] or now["p0"] < was["p0"]:
        BASE.write_text(json.dumps(now, indent=1), encoding="utf-8")
        print(f"    runtime improved: {was} -> {now} (baseline tightened)")
        return 0

    print(f"    runtime ok: {now}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
