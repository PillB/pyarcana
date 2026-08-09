#!/usr/bin/env python3
"""Regression: live grader executes code and rejects generator fingerprints."""
from __future__ import annotations
import json
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))
from newbie_live_phase_runner import (  # noqa: E402
    fingerprint_is_generator,
    outputs_match,
    run_python_snippet,
)


class TestLiveGrader(unittest.TestCase):
    def test_run_python_and_match(self):
        rc, out, err = run_python_snippet("print(1+1)")
        self.assertEqual(rc, 0)
        self.assertTrue(outputs_match("2", out))

    def test_wrong_output_fails_match(self):
        rc, out, _ = run_python_snippet("print(3)")
        self.assertEqual(rc, 0)
        self.assertFalse(outputs_match("2", out))

    def test_timeout_or_error(self):
        rc, out, err = run_python_snippet("raise SystemExit(1)")
        self.assertNotEqual(rc, 0)

    def test_generator_fingerprint_correct_preview(self):
        raw = {"note": "used correct_preview from sufficiency"}
        flags = fingerprint_is_generator(raw, [])
        self.assertIn("correct_preview_leak", flags)

    def test_generator_explicit_field(self):
        raw = {"generator": "script"}
        flags = fingerprint_is_generator(raw, [])
        self.assertIn("explicit_generator_field", flags)

    def test_mass_instruction_target(self):
        exercises = [
            {
                "exercise_id": f"E{i}",
                "code": "print(1)",
                "note": "Instruction Debes imprimir",
                "concepts_used": ["instruction_target"],
                "status": "answered",
            }
            for i in range(20)
        ]
        flags = fingerprint_is_generator({}, exercises)
        self.assertIn("instruction_target_mass", flags)


if __name__ == "__main__":
    unittest.main()
