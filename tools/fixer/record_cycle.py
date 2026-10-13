#!/usr/bin/env python3
"""Record one section's fixer cycle so the campaign can resume in a later session.

Without this the only record of what a round did is the git log, which does not say
which findings are still open or which questions nobody answered yet.

A record is keyed by its slug under the numbering epoch (see numbering.py): it names the epoch its
number belongs to and the slug that number has in that epoch, so a later renumber cannot relabel it.
"""
from __future__ import annotations

import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import numbering  # noqa: E402

ROOT = Path(__file__).resolve().parents[2]
CYCLES = ROOT / "audit/fixer/cycles"


def build_cycle(tag: str, res: dict, app: dict, section_ids: set[str], sha: str,
                recorded_at: str, epoch: numbering.Epoch) -> dict:
    """The record for one round. Pure: every input is passed in, so a test can write it and read it back."""
    closed = {f for f in app["findings_closed"] if f in section_ids}
    return {
        "section": tag,
        "numbering_epoch": epoch.label,
        "slug": numbering.slug_for_tag(tag, epoch),
        "recorded_at": recorded_at,
        "commit": sha,
        "file": app.get("file"),
        "findings_total": len(section_ids),
        "findings_closed": sorted(closed),
        "findings_open": sorted(section_ids - closed),
        "patches_offered": app.get("patches_offered"),
        "patches_applied": app.get("applied"),
        "patches_rejected": app.get("rejected"),
        "rejections": app.get("rejections", []),
        "unresolved_questions": res.get("unresolved_questions", []),
        "self_critiques": [
            {"field_path": p.get("field_path"),
             "what_could_confuse": (p.get("self_critique") or {}).get("what_could_confuse", ""),
             "what_is_missing": (p.get("self_critique") or {}).get("what_is_missing", ""),
             "residual_concern": (p.get("self_critique") or {}).get("residual_concern", "")}
            for p in res.get("patches", [])
            if (p.get("self_critique") or {}).get("residual_concern", "").strip()
        ],
        "typecheck_ok": app.get("typecheck_ok"),
        "rolled_back": app.get("rolled_back", False),
    }


def main() -> int:
    tag = sys.argv[1]
    result = ROOT / f".fixer/{tag}.result.json"
    applied = ROOT / f".fixer/{tag}.apply.json"
    if not (result.exists() and applied.exists()):
        raise SystemExit(f"missing .fixer/{tag}.result.json or .apply.json")

    res = json.loads(result.read_text(encoding="utf-8"))
    app = json.loads(applied.read_text(encoding="utf-8"))
    epoch = numbering.load_epoch(ROOT)

    section = numbering.registry_findings(ROOT, epoch)[numbering.slug_for_tag(tag, epoch)]
    section_ids = {f["finding_id"] for f in section if f["finding_id"]}

    sha = subprocess.run(["git", "rev-parse", "HEAD"], cwd=ROOT,
                         capture_output=True, text=True).stdout.strip()
    cycle = build_cycle(tag, res, app, section_ids, sha,
                        datetime.now(timezone.utc).isoformat(timespec="seconds"), epoch)
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
