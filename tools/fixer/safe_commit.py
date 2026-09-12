#!/usr/bin/env python3
"""Commit exactly one section's round, and nothing that was already dirty.

`git add -A course-state/` once swept a capstone run_state.json that had been
modified before this campaign began into a fixer commit. Directories and globs stage
whatever happens to be there; this stages named paths and refuses anything it was not
asked for.

Files listed in audit/fixer/dirty_baseline.json were modified before the chain started
and belong to whoever was working on them. They are never staged, even if a round
happened to touch them.
"""
from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
BASELINE = ROOT / "audit/fixer/dirty_baseline.json"

# reports a round legitimately regenerates
REPORTS = [
    "course-state/first_use_all_report.json",
    "course-state/badge_readiness_report.json",
    "course-state/synthetic_identifier_report.json",
    "course-state/python_runtime_audit_report.json",
    "course-state/python_runtime_audit_full.json",
    "course-state/python_content_issue_registry.json",
]


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True).stdout


def main() -> int:
    tag = sys.argv[1]
    message = sys.argv[2]

    apply_report = ROOT / f".fixer/{tag}.apply.json"
    app = json.loads(apply_report.read_text(encoding="utf-8"))
    if app.get("rolled_back"):
        print(f"{tag}: patches rolled back - refusing to commit")
        return 1

    protected = set()
    if BASELINE.exists():
        protected = set(json.loads(BASELINE.read_text(encoding="utf-8"))["dirty_before_chain"])

    wanted = [app["file"], f"audit/fixer/cycles/{tag}.json", *REPORTS]
    staged, skipped = [], []
    for path in wanted:
        if path in protected:
            skipped.append(path)
            continue
        if not (ROOT / path).exists():
            continue
        git("add", "--", path)
        staged.append(path)

    # nothing may reach the commit that we did not name
    actual = [l for l in git("diff", "--cached", "--name-only").splitlines() if l.strip()]
    unexpected = sorted(set(actual) - set(staged))
    if unexpected:
        print(f"{tag}: refusing to commit - unexpected staged paths: {unexpected}")
        git("reset", "-q", "HEAD")
        return 1
    if not actual:
        print(f"{tag}: nothing to commit")
        return 0

    subprocess.run(["git", "commit", "-q", "-m", message], cwd=ROOT, check=True)
    print(f"{tag}: committed {len(actual)} path(s)"
          + (f"; left alone (dirty before chain): {skipped}" if skipped else ""))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
