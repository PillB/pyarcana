#!/usr/bin/env python3
"""Regression: Master phase weDo must not ship placeholder hint-a / empty TODO-only stubs."""
from __future__ import annotations
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src/lib/course/sections"

class TestPhase3ExerciseStubs(unittest.TestCase):
    def test_no_hint_a_placeholders_s40_s52(self):
        files = sorted(SECTIONS.glob("s4*.ts")) + sorted(SECTIONS.glob("s5*.ts"))
        files = [f for f in files if re.match(r"s(4[0-9]|5[0-2])-", f.name)]
        self.assertEqual(len(files), 13)
        for f in files:
            text = f.read_text(encoding="utf-8")
            self.assertNotIn("hint-a", text, msg=f"{f.name} still has hint-a")
            self.assertNotIn(
                "# Completa el ejercicio guiado.\n# TODO",
                text,
                msg=f"{f.name} still has empty guided stub",
            )

    def test_s27_teaches_named_temporary_file(self):
        t = (SECTIONS / "s27-async-concurrency.ts").read_text(encoding="utf-8")
        theory = t[: t.find("weDo:")]
        self.assertIn("NamedTemporaryFile", theory)

if __name__ == "__main__":
    unittest.main()
