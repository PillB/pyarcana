#!/usr/bin/env python3
"""Derive course_complete from ledgers + issues + canonical counts. Exit 0 if complete."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def main() -> int:
    led = json.loads((ROOT / "course-state/section_ledger.json").read_text())
    cap = json.loads((ROOT / "course-state/capstone_ledger.json").read_text())
    issues = json.loads((ROOT / "course-state/issue_registry.json").read_text())

    sections = led.get("sections", [])
    sec_ok = len(sections) == 52 and all(s.get("state") == "passed" for s in sections)

    caps = cap.get("capstones", [])
    # Accept formally_passed OR passed as terminal good states
    good = {"formally_passed", "passed", "FORMALLY_PASSED", "PASSED"}
    cap_ok = len(caps) == 13 and all(c.get("state") in good for c in caps)

    open_p0_p1 = [
        i
        for i in issues.get("issues", [])
        if i.get("status") == "open" and i.get("severity") in ("P0", "P1")
    ]

    # Content vector spot-check
    total_ex = total_demos = 0
    for fp in (ROOT / "src/lib/course/sections").glob("s*.ts"):
        if not re.match(r"s\d{2}-", fp.name):
            continue
        t = fp.read_text(encoding="utf-8")
        total_ex += len(set(re.findall(r"\bid:\s*['\"](S\d{2}-T\d-[AB]-E\d)['\"]", t)))
        total_demos += len(set(re.findall(r"demoId:\s*['\"]([^'\"]+)['\"]", t)))
    vector_ok = total_ex == 1248 and total_demos == 416

    result = {
        "sections_passed_52": sec_ok,
        "capstones_formally_passed_13": cap_ok,
        "open_p0_p1": [{"id": i["issue_id"], "sev": i["severity"]} for i in open_p0_p1],
        "vector_ok": vector_ok,
        "exercises": total_ex,
        "demos": total_demos,
        "course_complete": bool(sec_ok and cap_ok and not open_p0_p1 and vector_ok),
    }
    out = ROOT / "course-state/course_complete_report.json"
    out.write_text(json.dumps(result, indent=2) + "\n")
    print(json.dumps(result, indent=2))
    return 0 if result["course_complete"] else 1


if __name__ == "__main__":
    sys.exit(main())
