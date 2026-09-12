#!/usr/bin/env python3
"""Refuse to start a fixer chain whose measurements would be meaningless.

Every failure this campaign has had was a measurement trusted without checking the
precondition that makes it mean anything - the runtime audit run under the wrong
Python, a liveness check that matched itself, a commit that staged whatever was
already dirty. Each check below is one of those preconditions, made to fail loudly
and early instead of quietly and eight hours later.

Writes audit/fixer/dirty_baseline.json: the files already modified before the chain
started. Those are somebody else's work in progress and must never be committed by a
round.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CONTENT_PY = ROOT / ".venv-content/bin/python"
BASELINE = ROOT / "audit/fixer/dirty_baseline.json"

problems: list[str] = []
notes: list[str] = []


def check_interpreter() -> None:
    if not CONTENT_PY.exists():
        problems.append(f"missing {CONTENT_PY.relative_to(ROOT)} - lesson code cannot be verified")
        return
    v = subprocess.run([str(CONTENT_PY), "--version"], capture_output=True, text=True).stdout.strip()
    if "3.12" not in v:
        problems.append(f"teaching interpreter is {v}, expected 3.12")
    else:
        notes.append(f"interpreter {v}")


def check_pins() -> None:
    """The audit's own verdict on whether it can be believed."""
    rep = ROOT / "course-state/python_runtime_audit_report.json"
    if not rep.exists():
        notes.append("no runtime report yet (first run)")
        return
    d = json.loads(rep.read_text(encoding="utf-8"))
    env = d.get("environment_matches_pins")
    status = env.get("status") if isinstance(env, dict) else env
    if status != "ok":
        problems.append(
            f"last runtime audit ran with environment_matches_pins={status!r}; "
            "its failures are drift, not content - re-run with .venv-content"
        )
    dep = d.get("dependency_visibility")
    dep = dep.get("status") if isinstance(dep, dict) else dep
    if dep != "ok":
        problems.append(f"runtime audit dependency_visibility={dep!r}: snippets were skipped, not verified")


def check_sections() -> None:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    files = [ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
             for m in re.finditer(r"from '\./sections/([^']+)'", index)]
    missing = [f.name for f in files if not f.exists()]
    if missing:
        problems.append(f"section files imported but absent: {missing}")
    ids = 0
    for f in files:
        if f.exists() and re.search(r"""\bid:\s*['"]""", f.read_text(encoding="utf-8")):
            ids += 1
    if ids != 52:
        problems.append(f"{ids} of 52 sections expose an id the fixer can resolve")
    else:
        notes.append("all 52 sections resolve")


def snapshot_dirty() -> None:
    out = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT,
                         capture_output=True, text=True).stdout
    dirty, staged = [], []
    for line in out.splitlines():
        if not line.strip() or line.startswith("??"):
            continue
        x, y, path = line[0], line[1], line[3:].strip()
        if x != " " and x != "?":
            staged.append(path)
        if y != " ":
            dirty.append(path)
    if staged:
        problems.append(f"staged changes present before the chain starts: {staged[:5]} - commit or reset them")
    BASELINE.parent.mkdir(parents=True, exist_ok=True)
    BASELINE.write_text(json.dumps({"dirty_before_chain": sorted(dirty)}, indent=1), encoding="utf-8")
    if dirty:
        notes.append(f"{len(dirty)} file(s) already modified; recorded so no round commits them")


def check_registry() -> None:
    reg = ROOT / "audit/consolidated/registry.json"
    if not reg.exists():
        problems.append("audit/consolidated/registry.json missing - nothing to fix from")
        return
    n = len(json.loads(reg.read_text(encoding="utf-8"))["findings"])
    notes.append(f"registry holds {n} findings")


def main() -> int:
    for check in (check_interpreter, check_pins, check_sections, snapshot_dirty, check_registry):
        check()
    for n in notes:
        print(f"  ok   {n}")
    for p in problems:
        print(f"  FAIL {p}")
    if problems:
        print("\npreflight failed - not starting a chain whose results could not be trusted")
        return 1
    print("\npreflight ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
