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

import contextlib
import io
import json
import re
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

import numbering  # noqa: E402
from numbering_fixture import roadmap_of_record_problems  # noqa: E402


class EpochMatchesTheTree(unittest.TestCase):
    def test_the_epoch_agrees_with_the_roadmap_and_the_course(self) -> None:
        self.assertEqual(numbering.check_epoch(ROOT), [])

    def test_the_roadmap_the_epoch_names_is_a_file_with_one_heading_per_section(self) -> None:
        """The name is read from the epoch file. It used to be compared with a typed file name, so the
        epoch flip (`restamp.py advance --roadmap ...`) turned this red the moment it succeeded. The same
        function runs against a flipped fixture in test_numbering_restamp.py."""
        self.assertEqual(roadmap_of_record_problems(ROOT), [])


class NothingTypesTheRoadmapFileName(unittest.TestCase):
    """The class behind the flip going red: a typed roadmap file name is right until the epoch names another.
    The one place the name lives is audit/fixer/numbering_epoch.json (data, not code)."""

    NAME = re.compile(r"learning_roadmap_\d+_V3")

    def checked_files(self) -> list[Path]:
        files = sorted((ROOT / "tools/fixer").glob("*.py")) + sorted((ROOT / "tools/fixer").glob("*.sh"))
        tests = ROOT / "tests/adversarial"
        return files + [tests / "numbering_fixture.py", tests / "test_fixer_state_numbering.py",
                        tests / "test_fixer_tool_boundaries.py"] + sorted(tests.glob("test_numbering_*.py"))

    def test_no_fixer_tool_or_fixer_state_test_names_the_roadmap_file(self) -> None:
        files = self.checked_files()
        self.assertGreater(len(files), 20)
        typed = [f"{path.relative_to(ROOT)}:{n}: {line.strip()}" for path in files
                 for n, line in enumerate(path.read_text(encoding="utf-8").splitlines(), 1)
                 if self.NAME.search(line)]
        self.assertEqual(typed, [], "a roadmap file name typed in code goes stale when the epoch flips:\n  "
                         + "\n  ".join(typed))

    def test_the_pattern_matches_the_name_it_guards_against(self) -> None:
        stem = "learning_roadmap_"          # assembled, so this file does not match its own scan
        self.assertTrue(self.NAME.search(f'ROADMAP = "{stem}52_V3.md"'))
        self.assertTrue(self.NAME.search(f"{stem}55_V3.md"))
        self.assertFalse(self.NAME.search("roadmap.md"))


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


class TheDecisionIsRecordedUnderItsOwnNumber(unittest.TestCase):
    def test_decision_numbers_are_unique(self) -> None:
        """Two branches each took D21 and the merge put both in one file. Every brief injects this file as
        'binding', and a reader cannot tell which D21 a later record means. Mutation: a second `## D21`
        heading fails this."""
        numbers = re.findall(r"^## D(\d+)\b", (ROOT / "audit/fixer/decisions.md").read_text(encoding="utf-8"), re.M)
        duplicated = sorted({n for n in numbers if numbers.count(n) > 1}, key=int)
        self.assertEqual(duplicated, [], f"decision numbers used twice: D{duplicated}")

    def test_the_fixer_state_decision_names_the_files_and_the_command_it_depends_on(self) -> None:
        text = (ROOT / "audit/fixer/decisions.md").read_text(encoding="utf-8")
        record = text.split("## D23", 1)[1].split("\n## D", 1)[0]
        for needed in ("numbering_epoch.json", "renumber_epoch.json", "restamp.py advance", "previous_epochs",
                       "text_numbering_epoch", "roadmap_of_record_problems", "ROADMAP_PATH"):
            self.assertIn(needed, record)

    def test_the_record_states_the_16_sept_rename_as_git_reports_it(self) -> None:
        """The record called the rename pure and said it "did not change that file's content". Git says R096
        (a rename with edits; a pure one is R100) and 37 changed lines, some of them learner-visible text. The
        facts were checked against `git show -M --name-status a492d8ea` and `git diff -M --numstat` and
        `-U0` when this was written; a test cannot run them (CI checks out one commit), so it pins what the
        record says: the status letter, the corrected claim, and that its line counts add up to the 37.
        Mutations: put "pure rename" back, or change 22 or 11, and this fails."""
        text = (ROOT / "audit/fixer/decisions.md").read_text(encoding="utf-8")
        record = text.split("## D23", 1)[1].split("\n## D", 1)[0]
        self.assertIn("R096", record)
        self.assertIn("not a pure rename", record)
        for false_claim in ("It was a pure rename", "did not change that file's content"):
            self.assertNotIn(false_claim, record)
        header = 3                                    # "three lines of the header comment"
        ident = 1                                     # "the `id` line"
        formatting = int(re.search(r"(\d+) lines that only add backticks", record).group(1))
        reworded = int(re.search(r"(\d+) lines whose learner-visible wording changed", record).group(1))
        stated_total = int(re.search(r"gives `(\d+) \d+` for S03", record).group(1))
        self.assertEqual(header + ident + formatting + reworded, stated_total)

    def test_the_record_does_not_make_a_new_roadmap_file_the_only_way_through(self) -> None:
        """The record told the operator to pass `--roadmap <the new roadmap>` on every flip, which the owner's
        roadmap diff (an in-place edit) does not need, and which a test then rejected. Plain `advance` keeps
        the name. Mutation: put the old sentence back and this fails."""
        text = (ROOT / "audit/fixer/decisions.md").read_text(encoding="utf-8")
        record = text.split("## D23", 1)[1].split("\n## D", 1)[0]
        self.assertEqual(record.count("--roadmap <the new roadmap>"), 0,
                         "D23 tells the operator to pass --roadmap <the new roadmap> on every flip")
        self.assertIn("python3 tools/fixer/restamp.py advance`", record)


class ProgressListsOnlyWhatIsStillOpen(unittest.TestCase):
    def test_the_heaviest_list_skips_sections_already_done_and_is_capped_at_eight(self) -> None:
        """progress.py's "heaviest untouched" list must not name a section a cycle already closed, and must
        stop at eight. Mutation: drop the done-section filter in _print_heaviest and S10 appears."""
        import progress

        per_section = {f"S{i:02d}": [None] * i for i in range(1, 11)}
        output = io.StringIO()
        with contextlib.redirect_stdout(output):
            progress._print_heaviest(per_section, {"S10", "S09"})
        text = output.getvalue()
        self.assertNotIn("S10 (", text)
        self.assertNotIn("S09 (", text)
        self.assertIn("S08 (8)", text)
        self.assertEqual(text.count("("), 8)


if __name__ == "__main__":
    unittest.main()
