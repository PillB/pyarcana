#!/usr/bin/env python3
"""
V3 structural invariant validator for El Arte de Python.
Compares section content files against canonical counting vector slices.
Exit 0 if no P0 regressions on inspected artifacts; exit 1 on failures.

The exam bank is not read here. tests/adversarial/exam-bank-coverage.test.ts checks every section's
bank (8 concepts x 3 variants, 4 options, key in range) through scripts/lib/learner_text.mts, which
parses prisma/seed.ts. That test runs in the adversarial-unit job, which installs the Node packages;
this job does not.
"""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS_DIR = ROOT / "src/lib/course/sections"
LEDGER = ROOT / "course-state/section_ledger.json"

def declared_section_count(root: Path = ROOT) -> int:
    """The sections index.ts binds into COURSE_SECTIONS: the count every other count is checked
    against. Derived from the bindings, never pinned (design G-9)."""
    index_ts = (root / "src/lib/course/index.ts").read_text(encoding="utf-8")
    return len(re.findall(r"import \{ section\d+ \} from", index_ts))


def ledger_row_failures(ledger_path: Path, expected: int) -> list[str]:
    """section_ledger.json must hold one row per bound section; a stale count is named."""
    if not ledger_path.exists():
        return []
    rows = len(json.loads(ledger_path.read_text(encoding="utf-8")).get("sections", []))
    return [] if rows == expected else [f"section_ledger rows={rows} want {expected}"]


CANONICAL = {
    "sections": declared_section_count(),
    "topics_per_section": 4,
    "subtopics_per_topic": 2,
    "subtopics_per_section": 8,
    "demos_per_section": 8,
    "exercises_per_section": 24,
    "exam_variants_per_section": 24,
    "concepts_per_section": 8,
    "variants_per_concept": 3,
}

SECTION_ID_RE = re.compile(r'^\s*id:\s*[\'"]([^\'"]+)[\'"]', re.M)
DEMO_RE = re.compile(r'demoId:\s*[\'"]([^\'"]+)[\'"]')
EX_RE = re.compile(r'\bid:\s*[\'"](S\d{2}-T\d-[AB]-E\d)[\'"]')
SUBTOPIC_RE = re.compile(r'subtopicId:\s*[\'"](S\d{2}-T\d-[AB])[\'"]')


def inspect_section_file(path: Path) -> dict:
    text = path.read_text(encoding="utf-8")
    sid_m = SECTION_ID_RE.search(text)
    section_id = sid_m.group(1) if sid_m else path.stem
    demos = sorted(set(DEMO_RE.findall(text)))
    exercises = sorted(set(EX_RE.findall(text)))
    subtopics = sorted(set(SUBTOPIC_RE.findall(text)))
    return {
        "file": str(path.relative_to(ROOT)),
        "section_id": section_id,
        "demos": len(demos),
        "demo_ids": demos,
        "exercises": len(exercises),
        "exercise_ids": exercises,
        "subtopics": len(subtopics),
        "subtopic_ids": subtopics,
        "v3_tagged": len(subtopics) > 0 or len(demos) > 0,
    }


def main() -> int:
    section_files = sorted(SECTIONS_DIR.glob("s*.ts"))
    # Prefer s01-setup style names; also sNN-*.ts
    section_files = [p for p in section_files if re.match(r"s\d{2}-", p.name)]
    reports = [inspect_section_file(p) for p in section_files]

    failures = []
    warnings = []

    if len(section_files) < CANONICAL["sections"]:
        failures.append(
            f"section_files={len(section_files)} < {CANONICAL['sections']}"
        )

    # Per-section V3 compliance for tagged sections; untagged = warning (legacy)
    v3_ready = []
    for r in reports:
        if r["v3_tagged"]:
            v3_ready.append(r["section_id"])
            if r["subtopics"] != CANONICAL["subtopics_per_section"] and r["subtopics"] != 0:
                # allow partial during authoring but flag
                if r["subtopics"] < CANONICAL["subtopics_per_section"]:
                    warnings.append(
                        f"{r['section_id']}: subtopics {r['subtopics']}/{CANONICAL['subtopics_per_section']}"
                    )
            if r["exercises"] not in (0, CANONICAL["exercises_per_section"]):
                if r["exercises"] < CANONICAL["exercises_per_section"]:
                    warnings.append(
                        f"{r['section_id']}: exercises {r['exercises']}/{CANONICAL['exercises_per_section']}"
                    )
            if r["demos"] not in (0, CANONICAL["demos_per_section"]):
                if r["demos"] < CANONICAL["demos_per_section"]:
                    warnings.append(
                        f"{r['section_id']}: demos {r['demos']}/{CANONICAL['demos_per_section']}"
                    )

    # Hard gate for setup (S01) when present
    setup = next((r for r in reports if r["section_id"] == "setup"), None)
    if setup:
        if setup["exercises"] != 24:
            failures.append(f"setup exercises={setup['exercises']} want 24")
        if setup["demos"] != 8:
            failures.append(f"setup demos={setup['demos']} want 8")
        if setup["subtopics"] < 8:
            failures.append(f"setup subtopics={setup['subtopics']} want >=8")

    # Ledger row count, derived from the section bindings (G-9)
    failures.extend(ledger_row_failures(LEDGER, CANONICAL["sections"]))

    out = {
        "canonical": CANONICAL,
        "section_files": len(section_files),
        "v3_tagged_sections": v3_ready,
        "reports": [
            {
                "section_id": r["section_id"],
                "file": r["file"],
                "subtopics": r["subtopics"],
                "demos": r["demos"],
                "exercises": r["exercises"],
                "v3_tagged": r["v3_tagged"],
            }
            for r in reports
        ],
        "failures": failures,
        "warnings": warnings[:50],
        "warning_count": len(warnings),
        "ok": len(failures) == 0,
    }

    out_path = ROOT / "course-state" / "v3_invariant_report.json"
    out_path.write_text(json.dumps(out, indent=2, ensure_ascii=False) + "\n")
    print(json.dumps({"ok": out["ok"], "failures": failures, "warnings": len(warnings), "v3_tagged": len(v3_ready)}, indent=2))
    return 0 if out["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
