"""Permanent regressions for hardened dual-newbie pedagogy gates."""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_agentic_validator import (  # noqa: E402
    attempt_level_gates,
    exercise_form_issues,
    code_incomplete,
)


def test_hello_sys_form_gate_rejects_repl_only():
    instr = (
        "E2 (independiente) — Crea `hello_sys.py` que imprima tu nombre sintético "
        "y la versión de Python con sys. Debe usar `if __name__ == \"__main__\":`."
    )
    repl = "# >>> 2+2\n# 4\n"
    issues = exercise_form_issues("S01-T1-A-E2", instr, repl)
    assert "missing_main_for_hello_sys" in issues or "repl_transcript_for_script_exercise" in issues


def test_hello_sys_form_gate_accepts_script():
    instr = "Crea hello_sys.py con sys.version y if __name__ == '__main__'"
    code = (
        "import sys\n\n"
        "def main() -> None:\n"
        "    print(sys.version.split()[0])\n\n"
        "if __name__ == '__main__':\n"
        "    main()\n"
    )
    issues = exercise_form_issues("S01-T1-A-E2", instr, code)
    assert not issues


def test_incomplete_todo_still_caught():
    assert code_incomplete("def f():\n    # TODO\n    ...\n") is not None


def test_g1_attempt_gates_reject_zero_duration_or_mtime_if_present():
    """G1 historical theater must fail hardened gates (zero-duration and/or mtime)."""
    g1 = ROOT / "course-state/newbie_walkthrough/agentic_G1"
    if not g1.exists():
        return
    issues = attempt_level_gates("agentic_G1")
    tags = {i.get("tag") for i in issues}
    assert tags & {
        "ZERO_DURATION_SESSION",
        "ZERO_DURATION_SESSION_COUNT",
        "BULK_WRITE_MTIME",
        "BULK_WRITE_TIMING",
        "SUSPICIOUS_UNIFORM_DURATION",
        "MECHANICAL_IDENTITY_STAMP",
        "MISSING_LLM_SESSION_MANIFEST",
    }, tags


def test_g2_attempt_gates_reject_identity_stamps_if_present():
    g2 = ROOT / "course-state/newbie_walkthrough/agentic_G2"
    if not g2.exists():
        return
    issues = attempt_level_gates("agentic_G2")
    tags = {i.get("tag") for i in issues}
    # G2 had g2_agent stamps and short mtime
    assert tags & {
        "MECHANICAL_IDENTITY_STAMP",
        "BULK_WRITE_MTIME",
        "ZERO_DURATION_SESSION",
        "ZERO_DURATION_SESSION_COUNT",
        "BULK_WRITE_TIMING",
    }, tags
