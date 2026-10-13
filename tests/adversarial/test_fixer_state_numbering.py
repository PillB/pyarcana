"""Guard G-12 (design_ruled_final.md section 4.3), state half: the fixer's state is keyed by slug, and its
numbers come from the numbering epoch and the roadmap of record.

Checked on the real tree:
  * the epoch agrees with the roadmap headings, the course's import order and each section's `index`
    field (the slug-and-number check, at the source);
  * every cycle record is filed under its number, names the epoch it was written under, and carries
    the slug that number has in that epoch (or a slug the app's rename map carries to it);
  * the redaction list names only sections of the epoch;
  * a record the round writer builds is read back under its slug and epoch;
  * the ledger's step totals equal the epoch's count.

The second half of G-12, that no fixer tool types a section count, lives in test_fixer_section_counts.py.

Mutation proofs (recorded in the commit messages): a swapped slug in the epoch fails the course-order
check; a cycle record without numbering_epoch is refused; a writer that omits numbering_epoch makes the
round's record unreadable; a ledger denominator of 53 fails the totals check.
"""
from __future__ import annotations

import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

import numbering  # noqa: E402


class EpochMatchesTheTree(unittest.TestCase):
    def test_the_epoch_agrees_with_the_roadmap_and_the_course(self) -> None:
        self.assertEqual(numbering.check_epoch(ROOT), [])

    def test_the_epoch_names_the_roadmap_of_record(self) -> None:
        epoch = numbering.load_epoch(ROOT)
        self.assertEqual(epoch.roadmap, "learning_roadmap_52_V3.md")
        self.assertTrue((ROOT / epoch.roadmap).exists())


class StateIsKeyedBySlug(unittest.TestCase):
    def test_every_cycle_file_loads_under_its_number_and_slug(self) -> None:
        """A cycle the loader cannot place is a cycle the ledger would silently drop; refuse it."""
        epoch = numbering.load_epoch(ROOT)
        files = sorted((ROOT / numbering.CYCLES_DIR).glob("S*.json"))
        records = numbering.cycle_records(ROOT, epoch)
        self.assertEqual(len(records), len(files))
        self.assertGreater(len(files), 0)

    def test_the_redaction_list_names_sections_of_the_epoch(self) -> None:
        epoch = numbering.load_epoch(ROOT)
        slugs = numbering.redacted_slugs(ROOT, epoch)
        self.assertTrue(slugs)
        self.assertTrue(slugs <= set(epoch.slugs))


class TheWriterAndTheReaderAgree(unittest.TestCase):
    def test_a_record_the_writer_builds_is_read_back_under_its_slug(self) -> None:
        """record_cycle.build_cycle is what a round writes. The reader must place it under its slug and
        its epoch. Mutation: drop numbering_epoch from build_cycle, and the reader refuses the record."""
        import record_cycle

        epoch = numbering.load_epoch(ROOT)
        app = {"findings_closed": ["S02-F01"], "file": "src/lib/course/sections/s02-basics.ts",
               "applied": 1, "rejected": 0, "patches_offered": 1}
        record = record_cycle.build_cycle("S02", {"unresolved_questions": []}, app,
                                          {"S02-F01", "S02-F02"}, "0" * 40,
                                          "2026-10-13T00:00:00+00:00", epoch)
        with tempfile.TemporaryDirectory() as folder:
            root = Path(folder)
            target = root / numbering.CYCLES_DIR / "S02.json"
            target.parent.mkdir(parents=True)
            target.write_text(json.dumps(record, indent=1, ensure_ascii=False), encoding="utf-8")
            records = numbering.cycle_records(root, epoch)
        self.assertEqual(list(records), [epoch.slugs[1]])
        self.assertEqual(records[epoch.slugs[1]]["numbering_epoch"], epoch.label)
        self.assertEqual(records[epoch.slugs[1]]["findings_open"], ["S02-F02"])


class ProductsCarryTheEpochCount(unittest.TestCase):
    def test_the_ledger_step_totals_are_the_epoch_count(self) -> None:
        """Every step row reads done/total; the total is the epoch's count, never a typed 52."""
        count = numbering.load_epoch(ROOT).count
        ledger = (ROOT / "audit/fixer/LEDGER.md").read_text(encoding="utf-8")
        totals = [int(m.group(2)) for m in re.finditer(r"^\| `\w+` \| .* \| (\d+)/(\d+) \|$", ledger, re.M)]
        self.assertTrue(totals, "no step rows found in LEDGER.md")
        self.assertEqual(set(totals), {count})


if __name__ == "__main__":
    unittest.main()
