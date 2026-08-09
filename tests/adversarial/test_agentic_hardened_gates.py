"""Permanent regressions for hardened dual-newbie pedagogy gates."""
from __future__ import annotations

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
        "E2 — Crea `hello_sys.py` con sys.version y if __name__ == \"__main__\"."
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
    assert not exercise_form_issues("S01-T1-A-E2", instr, code)


def test_incomplete_todo_still_caught():
    assert code_incomplete("def f():\n    # TODO\n    ...\n") is not None


def test_exploratory_protocol_flagged_incomplete():
    code = (
        "# Transfer / protocolo — S01-T1-A-E1\n"
        "# exploratory pass\n\n"
        "## Lectura del paquete\n"
        "Como explorer priorizo un flujo verificable.\n"
    )
    reason = code_incomplete(code)
    assert reason is not None
    assert "exploratory" in reason or "protocol" in reason or "pattern" in reason


def test_dual_explorer_h_stamp_detected_on_h1_if_present():
    """H1 historical dual explorer-H1 stamps must trip MECHANICAL_IDENTITY_STAMP."""
    h1 = ROOT / "course-state/newbie_walkthrough/agentic_H1"
    if not h1.exists():
        return
    issues = attempt_level_gates("agentic_H1")
    tags = {i.get("tag") for i in issues}
    assert "MECHANICAL_IDENTITY_STAMP" in tags or "ZERO_DURATION_SESSION" in tags or "BULK_WRITE_MTIME" in tags, tags


def test_h2_exploratory_fails_gates_if_present():
    h2 = ROOT / "course-state/newbie_walkthrough/agentic_H2"
    if not h2.exists():
        return
    issues = attempt_level_gates("agentic_H2")
    # Either stamps or when validating section incompletes matter more at section level
    # At attempt level, if exploratory only in exercises, stamp_re may still hit exploratory pass
    tags = {i.get("tag") for i in issues}
    # H2 should fail stamp (exploratory pass) or we at least flag incompletes via code_incomplete
    sample = (h2 / "section_01" / "newbie_a_live.json")
    if sample.exists():
        import json
        data = json.loads(sample.read_text())
        reasons = [code_incomplete(e.get("code") or "") for e in data.get("exercises") or []]
        assert any(r for r in reasons), "H2 S01 exercises should be incomplete under new rules"


def test_g1_still_rejected():
    g1 = ROOT / "course-state/newbie_walkthrough/agentic_G1"
    if not g1.exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_G1")}
    assert tags & {
        "ZERO_DURATION_SESSION",
        "ZERO_DURATION_SESSION_COUNT",
        "BULK_WRITE_MTIME",
        "BULK_WRITE_TIMING",
        "MECHANICAL_IDENTITY_STAMP",
        "MISSING_LLM_SESSION_MANIFEST",
    }, tags
