#!/usr/bin/env python3
"""
V3 structural invariant validator for El Arte de Python.
Compares section content files + seed bank against canonical counting vector slices.
Exit 0 if no P0 regressions on inspected artifacts; exit 1 on failures.
"""
from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS_DIR = ROOT / "src/lib/course/sections"
SEED = ROOT / "prisma/seed.ts"
LEDGER = ROOT / "course-state/section_ledger.json"

CANONICAL = {
    "sections": 52,
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


def parse_seed_bank(text: str) -> dict[str, Counter]:
    """Return sectionId -> Counter(concept -> n)."""
    # QUESTION_BANK: Record = { setup: [ ... ], basics: [ ... ], ... }
    banks: dict[str, Counter] = {}
    # Split by top-level keys like `setup: [`
    for m in re.finditer(r"\n\s*([a-z0-9-]+):\s*\[", text):
        key = m.group(1)
        if key in ("options",):
            continue
        start = m.end()
        # find matching bracket depth
        depth = 1
        i = start
        while i < len(text) and depth:
            if text[i] == "[":
                depth += 1
            elif text[i] == "]":
                depth -= 1
            i += 1
        block = text[start : i - 1]
        concepts = re.findall(r"concept:\s*'([^']+)'", block)
        if concepts:
            banks[key] = Counter(concepts)
    return banks


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

    seed_text = SEED.read_text(encoding="utf-8") if SEED.exists() else ""
    banks = parse_seed_bank(seed_text) if seed_text else {}

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

    if "setup" in banks:
        c = banks["setup"]
        if len(c) != 8:
            failures.append(f"setup exam concepts={len(c)} want 8")
        if any(v != 3 for v in c.values()):
            failures.append(f"setup exam variants not 3 each: {dict(c)}")
        if sum(c.values()) != 24:
            failures.append(f"setup exam total={sum(c.values())} want 24")

    # Ledger row count
    if LEDGER.exists():
        ledger = json.loads(LEDGER.read_text())
        n = len(ledger.get("sections", []))
        if n != 52:
            failures.append(f"section_ledger rows={n} want 52")

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
        "seed_concepts_per_section": {k: len(v) for k, v in banks.items()},
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
