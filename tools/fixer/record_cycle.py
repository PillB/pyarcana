#!/usr/bin/env python3
"""Record one section's fixer cycle so the campaign can resume in a later session.

Without this the only record of what a round did is the git log, which does not say
which findings are still open or which questions nobody answered yet.
"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CYCLES = ROOT / "audit/fixer/cycles"


def main() -> int:
    tag = sys.argv[1]
    result = ROOT / f".fixer/{tag}.result.json"
    applied = ROOT / f".fixer/{tag}.apply.json"
    if not (result.exists() and applied.exists()):
        raise SystemExit(f"missing .fixer/{tag}.result.json or .apply.json")

    res = json.loads(result.read_text(encoding="utf-8"))
    app = json.loads(applied.read_text(encoding="utf-8"))

    registry = json.loads((ROOT / "audit/consolidated/registry.json").read_text(encoding="utf-8"))
    section_findings = [f for f in registry["findings"] if f["section"] == tag]
    ids = {f["finding_id"] for f in section_findings if f["finding_id"]}
    closed = {f for f in app["findings_closed"] if f in ids}

    sha = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT,
                         capture_output=True, text=True).stdout.strip()

    cycle = {
        "section": tag,
        "recorded_at": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "commit": sha,
        "file": app.get("file"),
        "findings_total": len(ids),
        "findings_closed": sorted(closed),
        "findings_open": sorted(ids - closed),
        "patches_offered": app.get("patches_offered"),
        "patches_applied": app.get("applied"),
        "patches_rejected": app.get("rejected"),
        "rejections": app.get("rejections", []),
        "unresolved_questions": res.get("unresolved_questions", []),
        "typecheck_ok": app.get("typecheck_ok"),
        "rolled_back": app.get("rolled_back", False),
    }
    CYCLES.mkdir(parents=True, exist_ok=True)
    (CYCLES / f"{tag}.json").write_text(json.dumps(cycle, indent=1, ensure_ascii=False), encoding="utf-8")

    print(json.dumps({
        "section": tag,
        "closed": len(cycle["findings_closed"]),
        "open": len(cycle["findings_open"]),
        "of": cycle["findings_total"],
        "questions": len(cycle["unresolved_questions"]),
        "rejected_patches": cycle["patches_rejected"],
    }, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
