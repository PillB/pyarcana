"""Permanent forensic gates for dual-newbie pedagogy (anti-theater).

These tests drive the shipped `attempt_level_gates` path. Theater attempts
(D–I) must fail structural forensics; fixtures under tests/fixtures must load.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_agentic_validator import (  # noqa: E402
    attempt_level_gates,
    justification_is_template,
    code_incomplete,
)


def test_theater_fixtures_exist():
    d = ROOT / "tests/fixtures/theater_selfcheck_maps"
    assert d.exists()
    assert list(d.glob("*.json")), "need frozen theater selfcheck maps"


def test_slot_fill_justification_is_template():
    j = (
        "Partí del starterCode e instruction del quiz_card. "
        "Completé el contrato Pass del paquete activo."
    )
    assert justification_is_template(j)


def test_explorer_read_header_is_template_or_stamp():
    j = "Explorer-read: complete from packet starter following iDo patterns."
    assert justification_is_template(j)


def test_exploratory_still_incomplete():
    code = "# Transfer / protocolo\n# exploratory pass\n## Lectura\n"
    assert code_incomplete(code)


def test_agentic_i2_fails_forensic_gates_if_present():
    root = ROOT / "course-state/newbie_walkthrough/agentic_I2"
    if not root.exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_I2")}
    # At least one structural theater signal
    assert tags & {
        "JUSTIFICATION_MASS",
        "SC_JUSTIFICATION_MASS",
        "CONFIDENCE_ENTROPY",
        "SESSION_OVERUSE",
        "DIVERSIFY_FORENSICS",
        "SELFCHECK_LINEAGE",
        "MECHANICAL_IDENTITY_STAMP",
    }, tags


def test_agentic_h2_fails_forensic_gates_if_present():
    root = ROOT / "course-state/newbie_walkthrough/agentic_H2"
    if not root.exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_H2")}
    assert tags & {
        "JUSTIFICATION_MASS",
        "SC_JUSTIFICATION_MASS",
        "CONFIDENCE_ENTROPY",
        "DIVERSIFY_FORENSICS",
        "SELFCHECK_LINEAGE",
        "MECHANICAL_IDENTITY_STAMP",
        "ZERO_DURATION_SESSION",
        "BULK_WRITE_MTIME",
    }, tags


def test_agentic_i1_fails_diversify_or_lineage_if_present():
    root = ROOT / "course-state/newbie_walkthrough/agentic_I1"
    if not root.exists():
        return
    tags = {i.get("tag") for i in attempt_level_gates("agentic_I1")}
    assert tags & {
        "DIVERSIFY_FORENSICS",
        "SELFCHECK_LINEAGE",
        "CONFIDENCE_ENTROPY",
        "JUSTIFICATION_MASS",
        "MECHANICAL_IDENTITY_STAMP",
    }, tags
