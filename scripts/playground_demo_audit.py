#!/usr/bin/env python3
"""Pinned-output check for the playground demos.

A demo that ships an `expectedOutput` is a promise about what a learner sees. CodePlayground keeps
the promise by comparing the learner's stdout, trimmed, with expectedOutput, trimmed. This script
runs each such demo under the interpreter running it, which `npm run test:python-content` pins to
.venv-content (numpy 2.2.6 and pandas 3.0.5, as requirements-content.txt declares), and applies
the same rule. A mismatch is not a verdict on the content until the interpreter is the pinned one,
so a drifted interpreter is refused (exit 2).

Owed, not accepted: PINNED_OUTPUT_OWED names the demos that do not match today. The set must
shrink as demos are replaced. A new mismatch fails, and so does an owed demo that now passes or
no longer exists, so the list cannot grow and cannot stay stale.

  python3 scripts/playground_demo_audit.py
"""
from __future__ import annotations

import json
import subprocess
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(Path(__file__).resolve().parent))
import python_content_runtime_audit as runtime  # noqa: E402  (run_python, probe_version_drift)

DUMP = ROOT / "scripts/playground_demos_dump.mjs"

#: Demos whose stdout does not match their expectedOutput under the pinned interpreter, measured
#: 2026-10-13 under .venv-content (42 of 43 demos with an expectedOutput match). Owed, not accepted:
#: databases-orm's own code is a SyntaxError (an unterminated string literal on its line 31), so
#: a learner sees the error in the playground. Owner decision O25 replaces the demos phase by phase;
#: each replacement removes its id from this set.
PINNED_OUTPUT_OWED: frozenset[str] = frozenset({"databases-orm"})


class DemoReadError(RuntimeError):
    """The demos could not be read; nothing printed by the reader can be trusted."""


def load_demos() -> dict[str, dict]:
    """Every playground demo, read from src/lib/course/playground-demos.ts. Fails closed."""
    proc = subprocess.run(
        ["node", str(DUMP)], cwd=ROOT, capture_output=True, text=True,
    )
    if proc.returncode != 0:
        raise DemoReadError(f"playground_demos_dump.mjs exited {proc.returncode}: {proc.stderr.strip()[-1500:]}")
    return json.loads(proc.stdout)


def _verdict(demo_id: str, status: str, reason: str, **detail: str) -> dict:
    return {"id": demo_id, "status": status, "reason": reason, **detail}


def audit_demo(demo_id: str, demo: dict) -> dict | None:
    """Pass or fail one demo with an expectedOutput. None when it has none: nothing is pinned."""
    expected = demo.get("expectedOutput")
    if expected is None:
        return None
    result = runtime.run_python(demo["code"])
    if result["timeout"]:
        return _verdict(demo_id, "fail", "timeout")
    if result["exit"] != 0:
        return _verdict(demo_id, "fail", "nonzero_exit", stderr=result["stderr"][-300:])
    got, want = result["stdout"].strip(), expected.strip()
    if got != want:
        return _verdict(demo_id, "fail", "output_mismatch", expected=want[:200], got=got[:200])
    return _verdict(demo_id, "pass", "ok")


def mismatches(demos: dict[str, dict]) -> dict[str, dict]:
    """Every demo that fails its pinned output, keyed by id, run concurrently (each is a subprocess)."""
    with ThreadPoolExecutor(max_workers=4) as pool:
        verdicts = pool.map(lambda item: audit_demo(*item), demos.items())
    return {v["id"]: v for v in verdicts if v is not None and v["status"] == "fail"}


def ownership_problems(failing: set[str], owed: frozenset[str]) -> list[str]:
    """Two-sided ratchet: new failures and stale owed entries are both problems."""
    problems = []
    new = sorted(failing - owed)
    if new:
        problems.append(f"{len(new)} demo(s) fail their pinned output and are not owed: {', '.join(new)}")
    gone = sorted(owed - failing)
    if gone:
        problems.append(
            f"{len(gone)} owed demo(s) now match or no longer exist; remove them from "
            f"PINNED_OUTPUT_OWED so the set shrinks: {', '.join(gone)}"
        )
    return problems


def main() -> int:
    drift = runtime.probe_version_drift()
    if drift["status"] != "ok":
        drifted = ", ".join(f"{d['package']} {d['installed']} (declared {d['declared']})" for d in drift["drift"])
        print(f"refusing a verdict: the interpreter does not match requirements-content.txt: {drifted}",
              file=sys.stderr)
        return 2
    demos = load_demos()
    failing = mismatches(demos)
    checked = sum(1 for d in demos.values() if "expectedOutput" in d)
    problems = ownership_problems(set(failing), PINNED_OUTPUT_OWED)
    print(json.dumps({
        "demos": len(demos),
        "checked": checked,
        "failing": sorted(failing),
        "owed": len(PINNED_OUTPUT_OWED),
        "ok": not problems,
    }, indent=2))
    for problem in problems:
        print(f"PLAYGROUND DEMO: {problem}", file=sys.stderr)
    # Every failing reason, so an intermittent failure can be diagnosed from the gate's output alone.
    for verdict in failing.values():
        print(f"PLAYGROUND DEMO {verdict['id']}: {verdict['reason']} {verdict.get('stderr', '')[-200:]}"
              f"{verdict.get('got', '')[:200]}", file=sys.stderr)
    return 1 if problems else 0


if __name__ == "__main__":
    raise SystemExit(main())
