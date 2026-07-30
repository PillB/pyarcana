#!/usr/bin/env python3
"""CP-N4-C — tests for the multi-agent harness demo.

Run: ``python3 tests/test_demo.py`` from the capstone package root.

These tests are deliberately lightweight at this level — the deep
adversarial coverage lives in
``tests/adversarial/test_n4c_harness.py`` (per SUBGATES.md). This file
ensures the package skeleton contract is met: the demo runs end-to-end,
exits 0, and emits a ``METRICS_JSON:`` line with the expected
capstone_id, package_version=3.0.0, and the three sub-gate evidence
fields (citations, holdout, trajectory).
"""
from __future__ import annotations
import json
import os
import subprocess
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)


def _run_demo():
    demo_path = os.path.join(PKG, "demo.py")
    proc = subprocess.run(
        [sys.executable, demo_path],
        capture_output=True,
        text=True,
        timeout=60,
    )
    return proc


def _extract_metrics(stdout: str) -> dict:
    for line in stdout.splitlines():
        if line.startswith("METRICS_JSON:"):
            payload = line[len("METRICS_JSON:"):].strip()
            return json.loads(payload)
    return {}


def test_demo_exits_zero_with_metrics_json():
    """The demo must exit 0 and print a METRICS_JSON: line."""
    proc = _run_demo()
    assert proc.returncode == 0, (
        f"demo exited {proc.returncode}; stderr=\n{proc.stderr}"
    )
    assert "METRICS_JSON:" in proc.stdout, (
        f"no METRICS_JSON: in stdout; got=\n{proc.stdout}"
    )


def test_metrics_has_capstone_id_and_version():
    """METRICS_JSON payload must identify CP-N4-C at package_version 3.0.0."""
    proc = _run_demo()
    assert proc.returncode == 0, f"demo exited {proc.returncode}"
    metrics = _extract_metrics(proc.stdout)
    assert metrics.get("capstone_id") == "CP-N4-C", (
        f"capstone_id={metrics.get('capstone_id')!r}"
    )
    assert metrics.get("package_version") == "3.0.0", (
        f"package_version={metrics.get('package_version')!r}"
    )


def test_metrics_status_pass_and_citations_present():
    """Demo must complete with status=pass and at least one citation."""
    proc = _run_demo()
    assert proc.returncode == 0, f"demo exited {proc.returncode}"
    metrics = _extract_metrics(proc.stdout)
    assert metrics.get("status") == "pass", (
        f"status={metrics.get('status')!r}"
    )
    assert metrics.get("citations", 0) >= 1, (
        f"citations={metrics.get('citations')!r}"
    )


def test_metrics_holdout_and_trajectory_ok():
    """Sub-gate S50 evidence: holdout score >= 0.75 and trajectory ok."""
    proc = _run_demo()
    assert proc.returncode == 0, f"demo exited {proc.returncode}"
    metrics = _extract_metrics(proc.stdout)
    holdout = metrics.get("holdout", {})
    assert holdout.get("score", 0) >= 0.75, (
        f"holdout.score={holdout.get('score')!r}"
    )
    trajectory = metrics.get("trajectory", {})
    assert trajectory.get("ok") is True, (
        f"trajectory.ok={trajectory.get('ok')!r}"
    )


def test_metrics_policy_audit_enforces_deny_and_hitl():
    """Sub-gate S49 evidence: deny policy and HITL on sensitive tools."""
    proc = _run_demo()
    assert proc.returncode == 0, f"demo exited {proc.returncode}"
    metrics = _extract_metrics(proc.stdout)
    policy = metrics.get("policy_audit", {})
    assert policy.get("denied", 0) >= 3, (
        f"policy_audit.denied={policy.get('denied')!r}"
    )
    assert policy.get("pending_human", 0) >= 1, (
        f"policy_audit.pending_human={policy.get('pending_human')!r}"
    )


def main() -> int:
    tests = [
        v for k, v in sorted(globals().items()) if k.startswith("test_")
    ]
    passed = failed = 0
    for t in tests:
        try:
            t()
            print(f"  PASS  {t.__name__}")
            passed += 1
        except Exception as exc:
            print(f"  FAIL  {t.__name__}: {exc}")
            failed += 1
    print(f"\n{passed} passed, {failed} failed, {len(tests)} total")
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
