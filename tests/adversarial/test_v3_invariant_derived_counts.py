"""G-9, the Python validator: the section count comes from the bindings, never a literal.

scripts/v3_invariant_validator.py used to pin 52 in CANONICAL and in the ledger check. A renumber
that adds sections would have left both literals behind. Each count now derives from the
bindings, and each defect is recreated on a fixture tree.
"""
from __future__ import annotations

import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import v3_invariant_validator as v3  # noqa: E402


def _write(root: Path, rel: str, body: str) -> None:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(body, encoding="utf-8")


def _fixture_index(root: Path, bound: int) -> None:
    imports = "".join(
        f"import {{ section{n:02d} }} from './sections/s{n:02d}-topic{n}'\n" for n in range(1, bound + 1)
    )
    slots = ", ".join(f"section{n:02d}" for n in range(1, bound + 1))
    _write(root, "src/lib/course/index.ts", imports + f"export const COURSE_SECTIONS = [\n  {slots},\n]\n")


class DerivedSectionCountTests(unittest.TestCase):
    def test_the_canonical_count_is_the_slot_count_of_the_real_array(self):
        """The validator and the course array name the same number of sections, from two sources."""
        index_ts = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
        array = re.search(r"COURSE_SECTIONS: CourseSection\[\] = \[(.*?)\]", index_ts, re.S)
        self.assertIsNotNone(array)
        slots = re.findall(r"section\d\d", array.group(1))
        self.assertEqual(v3.CANONICAL["sections"], len(slots))

    def test_the_declared_count_follows_the_bindings_of_a_fixture(self):
        """Recreation: a course that binds three sections is counted as three, not as 52."""
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _fixture_index(root, bound=3)
            self.assertEqual(v3.declared_section_count(root), 3)


class LedgerRowTests(unittest.TestCase):
    def test_a_ledger_short_of_the_bindings_is_named(self):
        """Recreation: the ledger has two rows for three bound sections, and the defect is named."""
        with tempfile.TemporaryDirectory() as tmp:
            ledger = Path(tmp) / "section_ledger.json"
            ledger.write_text('{"sections": [{"id": "S01"}, {"id": "S02"}]}', encoding="utf-8")
            self.assertEqual(v3.ledger_row_failures(ledger, 3), ["section_ledger rows=2 want 3"])

    def test_a_ledger_that_matches_the_bindings_passes(self):
        with tempfile.TemporaryDirectory() as tmp:
            ledger = Path(tmp) / "section_ledger.json"
            ledger.write_text('{"sections": [{"id": "S01"}, {"id": "S02"}, {"id": "S03"}]}', encoding="utf-8")
            self.assertEqual(v3.ledger_row_failures(ledger, 3), [])

    def test_the_real_ledger_matches_the_real_bindings(self):
        self.assertEqual(v3.ledger_row_failures(v3.LEDGER, v3.CANONICAL["sections"]), [])


if __name__ == "__main__":
    unittest.main()
