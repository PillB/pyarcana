"""Permanent regressions for hardened dual-newbie pedagogy gates.

These tests assert the validator rejects theater paths (packet_walk, missing
manifest, bulk timing) and form-broken exercise fills. They drive the real
validator module — not a reimplementation.
"""
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
    assert "expected_form_comment_only" in issues or "missing_main_for_hello_sys" in issues


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


def test_f1_attempt_gates_reject_theater_if_present():
    f1 = ROOT / "course-state/newbie_walkthrough/agentic_F1"
    if not f1.exists():
        return  # historical may be pruned
    issues = attempt_level_gates("agentic_F1")
    tags = {i.get("tag") for i in issues}
    # At least one anti-theater signal
    assert tags & {
        "MISSING_LLM_SESSION_MANIFEST",
        "INCOMPLETE_LLM_SESSION_MANIFEST",
        "THEATER_META",
        "THEATER_PRODUCTION_NOTE",
        "BULK_WRITE_TIMING",
    }, tags
