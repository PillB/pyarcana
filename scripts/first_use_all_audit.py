#!/usr/bin/env python3
"""Define-before-use gate across all 52 sections.

scripts/s01_first_use_audit.py only ever covered S01, against a hardcoded list of
twelve words. This runs the same question over the whole course, driven by the
glossary SSOT: for every term, does a learner meet a visible definition before the
course mentions it, requires it, or tests them on it?

The verdict logic is scripts/glossary_first_use.py::audit_concept_events, reused as
is. This file only builds its input and reports the result.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from glossary_first_use import audit_concept_events  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
EVENTS = ROOT / ".fixer/events.json"
OUT = ROOT / "course-state/first_use_all_report.json"


def build_events() -> dict:
    """Re-extract from the real COURSE_SECTIONS so the gate never reads stale input."""
    EVENTS.parent.mkdir(parents=True, exist_ok=True)
    proc = subprocess.run(
        ["npx", "tsx", "scripts/course_event_extractor.mts"],
        cwd=ROOT, capture_output=True, text=True,
    )
    if proc.returncode != 0:
        print(proc.stderr[-2000:], file=sys.stderr)
        raise SystemExit("course_event_extractor.mts failed")
    EVENTS.write_text(proc.stdout, encoding="utf-8")
    return json.loads(proc.stdout)


def main() -> int:
    payload = build_events()
    result = audit_concept_events(payload)

    issues = result["issues"]
    by_code: dict[str, list[dict]] = {}
    for issue in issues:
        by_code.setdefault(issue["code"], []).append(issue)

    # Terms that are never defined anywhere the learner can see.
    defined_terms = {t for e in payload["events"] if e["learner_visible"] for t in e["defines"]}
    mentioned_terms = {t for e in payload["events"] if e["learner_visible"] for t in e["mentions"]}
    never_defined = sorted(mentioned_terms - defined_terms)

    report = {
        "ok": result["ok"],
        "sections_audited": len(payload["active_section_ids"]),
        "terms_audited": len(payload["terms"]),
        "events_audited": len(payload["events"]),
        "issue_counts": {code: len(v) for code, v in sorted(by_code.items())},
        "never_defined_but_mentioned": never_defined,
        "issues": issues,
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")

    print(json.dumps({
        "ok": report["ok"],
        "sections": report["sections_audited"],
        "terms": report["terms_audited"],
        "events": report["events_audited"],
        "issue_counts": report["issue_counts"],
        "never_defined": len(never_defined),
        "report": str(OUT.relative_to(ROOT)),
    }, indent=2, ensure_ascii=False))
    return 0 if result["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
