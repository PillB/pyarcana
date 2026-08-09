#!/usr/bin/env python3
"""
CI gate: fail if S01 (setup) V3 structural tags are removed or incomplete.

Hard requirements for src/lib/course/sections/s01-setup.ts:
  - 8 subtopicId values (S01-T{1-4}-{A,B})
  - 8 demoId values (one per subtopic)
  - 24 exercise ids (S01-T*-E1/E2/E3 pattern)
  - V3 tag markers present (subtopicId / demoId / exercise id shapes)

Exit 0 if structure OK; exit 1 (and print failures) otherwise.
Writes course-state/v3_section_structure_report.json.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SETUP = ROOT / "src" / "lib" / "course" / "sections" / "s01-setup.ts"
OUT = ROOT / "course-state" / "v3_section_structure_report.json"

EXPECTED_SUBTOPICS = {
    "S01-T1-A",
    "S01-T1-B",
    "S01-T2-A",
    "S01-T2-B",
    "S01-T3-A",
    "S01-T3-B",
    "S01-T4-A",
    "S01-T4-B",
}
EXPECTED_DEMOS = {f"{st}-DEMO" for st in EXPECTED_SUBTOPICS}
EXPECTED_EXERCISES = {
    f"{st}-E{n}" for st in EXPECTED_SUBTOPICS for n in (1, 2, 3)
}

SUBTOPIC_RE = re.compile(r"subtopicId:\s*'(S\d{2}-T\d-[AB])'")
DEMO_RE = re.compile(r"demoId:\s*'([^']+)'")
EX_RE = re.compile(r"\bid:\s*'(S\d{2}-T\d-[AB]-E\d)'")
# Tag markers that must appear (regression if stripped during content edits)
TAG_MARKERS = ("subtopicId:", "demoId:", "S01-T1-A-E1", "S01-T4-B-DEMO")


def main() -> int:
    failures: list[str] = []
    warnings: list[str] = []

    if not SETUP.exists():
        failures.append(f"missing S01 file: {SETUP.relative_to(ROOT)}")
        _write_report(failures, warnings, {}, ok=False)
        print(json.dumps({"ok": False, "failures": failures}, indent=2))
        return 1

    text = SETUP.read_text(encoding="utf-8")

    for marker in TAG_MARKERS:
        if marker not in text:
            failures.append(f"S01 V3 tag marker missing: {marker!r}")

    subtopics = set(SUBTOPIC_RE.findall(text))
    demos = set(DEMO_RE.findall(text))
    exercises = set(EX_RE.findall(text))

    missing_st = sorted(EXPECTED_SUBTOPICS - subtopics)
    extra_st = sorted(subtopics - EXPECTED_SUBTOPICS)
    if missing_st:
        failures.append(f"S01 missing subtopicIds: {missing_st}")
    if extra_st:
        warnings.append(f"S01 unexpected subtopicIds: {extra_st}")
    if len(subtopics) < 8:
        failures.append(f"S01 subtopics={len(subtopics)} want >=8")

    missing_demos = sorted(EXPECTED_DEMOS - demos)
    if missing_demos:
        failures.append(f"S01 missing demoIds: {missing_demos}")
    if len(demos) != 8:
        failures.append(f"S01 demos={len(demos)} want 8")

    missing_ex = sorted(EXPECTED_EXERCISES - exercises)
    if missing_ex:
        failures.append(f"S01 missing exercise ids ({len(missing_ex)}): {missing_ex[:6]}...")
    if len(exercises) != 24:
        failures.append(f"S01 exercises={len(exercises)} want 24")

    counts = {
        "subtopics": len(subtopics),
        "demos": len(demos),
        "exercises": len(exercises),
        "subtopic_ids": sorted(subtopics),
        "demo_ids": sorted(demos),
        "exercise_ids": sorted(exercises),
    }
    ok = len(failures) == 0
    _write_report(failures, warnings, counts, ok=ok)

    print(
        json.dumps(
            {
                "ok": ok,
                "failures": failures,
                "warnings": warnings,
                "counts": {
                    "subtopics": counts["subtopics"],
                    "demos": counts["demos"],
                    "exercises": counts["exercises"],
                },
            },
            indent=2,
        )
    )
    return 0 if ok else 1


def _write_report(
    failures: list[str],
    warnings: list[str],
    counts: dict,
    *,
    ok: bool,
) -> None:
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        json.dumps(
            {
                "ok": ok,
                "file": str(SETUP.relative_to(ROOT)),
                "failures": failures,
                "warnings": warnings,
                "counts": counts,
            },
            indent=2,
            ensure_ascii=False,
        )
        + "\n"
    )


if __name__ == "__main__":
    sys.exit(main())
