#!/usr/bin/env python3
"""Write every rejected patch down, and tell the runner how many there were.

apply_patches.py rejects a patch whose anchor is missing, stale or ambiguous - on
purpose, since applying a rewrite to the wrong paragraph is worse than skipping it -
and exits 0 so the rest of the batch can land. The Codex review of PR #61 caught what
followed: runners printed the count and announced success, so an unresolved concept
vanished with nothing recorded. S04's first concept round did exactly that.

    record_rejections.py SXX .fixer/SXXk.apply.json concepts

Appends to audit/fixer/OPEN_QUESTIONS.md and prints the rejection count on stdout, so a
runner can say "passed with N unresolved" instead of "passed every gate".
"""
from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def main() -> int:
    tag, apply_path, stage = sys.argv[1], Path(sys.argv[2]), sys.argv[3]
    report = json.loads(apply_path.read_text(encoding="utf-8"))
    rejections = report.get("rejections") or []
    if not rejections:
        print(0)
        return 0

    lines = [
        "",
        f"## {tag} {stage} — {len(rejections)} patch(es) not applied",
        f"*Recorded {date.today().isoformat()} by `record_rejections.py` from `{apply_path.name}`.*",
        "",
        "Codex proposed these and the applier refused them, so the defects they targeted are",
        "still open. Re-run the stage for this section, or fix by hand.",
        "",
    ]
    for r in rejections:
        ids = ", ".join(r.get("finding_ids") or []) or "(no finding id)"
        where = r.get("field_path") or "?"
        lines.append(f"- **{ids}** at `{where}` — {r.get('reason', 'rejected')}")
        if r.get("anchor_head"):
            lines.append(f"  - anchor began: `{r['anchor_head'][:90]}`")
    with (ROOT / "audit/fixer/OPEN_QUESTIONS.md").open("a", encoding="utf-8") as fh:
        fh.write("\n".join(lines) + "\n")
    print(len(rejections))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
