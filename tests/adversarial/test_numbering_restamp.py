"""Guard G-12 and the Phase 3 hand-off: flipping the numbering epoch is one command, and not a red tree.

The fixer refuses state stamped with another epoch (that is the point of G-12), so the day the course goes
from 52 sections to 55 every cycle record, the redaction list and the finding registry is "from another
epoch". Without a way through, the renumber's epoch commit leaves the tree red until someone edits nine
files by hand. tools/fixer/restamp.py is the way through: `advance` writes the next epoch from the course
as the renumber left it, keeps the old table in `previous_epochs`, and carries every record by its slug.

These tests renumber a small course (a section inserted at position 2) and then the real state at the size
of the real renumber (three sections inserted into the real course, whatever its size is when the test
runs), and check that:
  * the tree is red before the command, for the stated reason, and green after it;
  * each record keeps what it said and only its numbers move: a cycle file follows its section, the
    registry's findings stay with their section, finding ids and text are untouched;
  * the command is idempotent and a refusal changes nothing;
  * a record that cannot be carried (its slug disagrees with its old number, its section is gone, its
    epoch has no table) is refused and named.

Mutation proofs are in the commit message that adds this file.
"""
from __future__ import annotations

import contextlib
import io
import json
import os
import shutil
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

import numbering  # noqa: E402
import restamp  # noqa: E402
from numbering import NumberingError  # noqa: E402
from numbering_fixture import (  # noqa: E402
    NumberingFixture, build, cycle, redaction, registry, roadmap_of_record_problems, write)

OLD = ("alpha", "beta", "gamma")
NEW = ("alpha", "fresh", "beta", "gamma")        # a section inserted at 2: beta is S03 and gamma S04 now
FILED = {"S01": 1, "S02": 4, "S03": 2}


def snapshot(root: Path) -> dict[str, bytes]:
    return {str(p.relative_to(root)): p.read_bytes() for p in sorted(root.rglob("*")) if p.is_file()}


class RenumberedTree(NumberingFixture):
    """A tree stamped with epoch 3, then renumbered: the course and the roadmap say four sections, and the
    epoch file, the cycle records, the redaction list and the registry still say three."""

    def setUp(self) -> None:
        super().setUp()
        build(self.root)
        cycle(self.root, "S02", slug="beta", findings_closed=["S02-F01"], note="beta's record")
        cycle(self.root, "S03", slug="gamma", findings_closed=[], note="gamma's record")
        redaction(self.root, ["alpha", "gamma"])
        registry(self.root, FILED)
        self.before = {slug: [f["finding_id"] for f in found]
                       for slug, found in numbering.registry_findings(self.root).items()}
        build(self.root, slugs=NEW, epoch_slugs=OLD, roadmap_numbers=range(1, 5))
        raw = json.loads((self.root / numbering.EPOCH_FILE).read_text(encoding="utf-8"))
        write(self.root, numbering.EPOCH_FILE,
              json.dumps({"_why": "kept across the advance", **raw}, indent=2) + "\n")

    def advance(self) -> list[str]:
        return restamp.advance(self.root, "roadmap.md")

    def cycle_files(self) -> list[str]:
        return sorted(p.name for p in (self.root / numbering.CYCLES_DIR).glob("*.json"))


class TheTreeIsRedBeforeAndGreenAfter(RenumberedTree):
    def test_before_the_command_the_tree_is_refused_because_the_course_moved(self) -> None:
        problems = numbering.check_epoch(self.root)
        self.assertTrue(any("headings" in p for p in problems), problems)
        self.assertTrue(any("course order" in p for p in problems), problems)

    def test_an_epoch_flipped_by_hand_without_the_old_table_names_what_is_missing(self) -> None:
        """What the review simulated: label 4 written, nothing carried. The refusal names the way through."""
        raw = json.loads((self.root / numbering.EPOCH_FILE).read_text(encoding="utf-8"))
        raw.update(numbering_epoch=4, sections=[{"number": n, "slug": s} for n, s in enumerate(NEW, 1)])
        write(self.root, numbering.EPOCH_FILE, json.dumps(raw))
        problems = numbering.check_epoch(self.root)
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("epoch 3", problems[0])
        self.assertIn("keeps no table for epoch 3", problems[0])

    def test_advance_makes_the_tree_green(self) -> None:
        self.advance()
        self.assertEqual(numbering.check_epoch(self.root), [])

    def test_with_the_old_table_in_place_a_hand_flipped_epoch_is_carried_by_restamp(self) -> None:
        raw = json.loads((self.root / numbering.EPOCH_FILE).read_text(encoding="utf-8"))
        raw.update(numbering_epoch=4, sections=[{"number": n, "slug": s} for n, s in enumerate(NEW, 1)],
                   previous_epochs={"3": list(OLD)})
        write(self.root, numbering.EPOCH_FILE, json.dumps(raw))
        self.assertTrue(numbering.check_epoch(self.root))
        restamp.restamp(self.root)
        self.assertEqual(numbering.check_epoch(self.root), [])

    def test_the_refusal_names_the_command_when_the_old_table_is_known(self) -> None:
        raw = json.loads((self.root / numbering.EPOCH_FILE).read_text(encoding="utf-8"))
        raw.update(numbering_epoch=4, sections=[{"number": n, "slug": s} for n, s in enumerate(NEW, 1)],
                   previous_epochs={"3": list(OLD)})
        write(self.root, numbering.EPOCH_FILE, json.dumps(raw))
        problems = numbering.check_epoch(self.root)
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("restamp.py", problems[0])


class TheRoadmapOfRecordIsWhatTheEpochNames(RenumberedTree):
    """The roadmap check read the name from a typed literal, so the epoch flip turned the tree red the
    moment it succeeded. These flip a fixture epoch and run the one function the real-tree test runs
    (roadmap_of_record_problems), which reads the name from the epoch file."""

    @staticmethod
    def roadmap_text(sections: int) -> str:
        return "".join(f"### S{n} — Titulo {n}\n" for n in range(1, sections + 1))

    def test_a_flip_to_a_new_roadmap_file_leaves_the_roadmap_check_green(self) -> None:
        """The old roadmap file stays as it was (three sections); the renumbered course has a new one (four).
        A check that kept reading the old name would see three headings against a four-section epoch."""
        write(self.root, "roadmap.md", self.roadmap_text(3))
        write(self.root, "roadmap_next.md", self.roadmap_text(4))
        self.assertEqual(roadmap_of_record_problems(self.root), [], "green before: the epoch names roadmap.md")
        restamp.advance(self.root, "roadmap_next.md")
        epoch = numbering.load_epoch(self.root)
        self.assertEqual((epoch.label, epoch.roadmap), (4, "roadmap_next.md"))
        self.assertEqual(roadmap_of_record_problems(self.root), [])
        self.assertEqual(numbering.check_epoch(self.root), [])

    def test_a_flip_in_place_keeps_the_roadmap_the_epoch_already_names(self) -> None:
        """The case the renumber design describes: the owner's roadmap diff edits the file in place, and
        `advance` with no --roadmap keeps its name."""
        restamp.advance(self.root)
        self.assertEqual(numbering.load_epoch(self.root).roadmap, "roadmap.md")
        self.assertEqual(roadmap_of_record_problems(self.root), [])
        self.assertEqual(numbering.check_epoch(self.root), [])

    def test_the_check_reports_a_roadmap_the_epoch_names_but_the_repository_lacks(self) -> None:
        restamp.advance(self.root)
        (self.root / "roadmap.md").unlink()
        self.assertEqual(roadmap_of_record_problems(self.root), ["the roadmap of record roadmap.md is not a file"])

    def test_the_check_reports_headings_that_do_not_match_the_epoch(self) -> None:
        restamp.advance(self.root)
        write(self.root, "roadmap.md", self.roadmap_text(2))
        problems = roadmap_of_record_problems(self.root)
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("headings [1, 2]", problems[0])

    def test_a_roadmap_outside_the_repository_is_refused_and_nothing_is_written(self) -> None:
        """The file exists and has the right headings, so only the path rule can refuse it: without that
        rule the epoch file would be written with a path that leaves the repository."""
        outside = Path(tempfile.mkdtemp(prefix="pyarcana-outside-"))
        self.addCleanup(shutil.rmtree, outside, True)
        write(outside, "roadmap_next.md", self.roadmap_text(4))
        before = snapshot(self.root)
        for roadmap in (str(outside / "roadmap_next.md"), os.path.relpath(outside / "roadmap_next.md", self.root)):
            with self.subTest(roadmap=roadmap), self.assertRaisesRegex(NumberingError, "inside the repository"):
                restamp.advance(self.root, roadmap)
            self.assertEqual(snapshot(self.root), before)


class EachRecordIsCarriedBySlug(RenumberedTree):
    def test_the_epoch_file_keeps_its_explanations_and_the_old_table(self) -> None:
        self.advance()
        raw = json.loads((self.root / numbering.EPOCH_FILE).read_text(encoding="utf-8"))
        self.assertEqual(raw["_why"], "kept across the advance")
        self.assertEqual(raw["numbering_epoch"], 4)
        self.assertEqual(raw["previous_epochs"], {"3": list(OLD)})
        self.assertEqual([r["slug"] for r in raw["sections"]], list(NEW))

    def test_a_cycle_file_follows_its_section_and_keeps_its_content(self) -> None:
        before = {slug: dict(rec) for slug, rec in numbering.cycle_records(self.root).items()}
        self.advance()
        self.assertEqual(self.cycle_files(), ["S03.json", "S04.json"])
        after = numbering.cycle_records(self.root)
        self.assertEqual(list(after), ["beta", "gamma"])
        for slug in ("beta", "gamma"):
            moved = {k: v for k, v in after[slug].items() if k not in {"section", "numbering_epoch"}}
            kept = {k: v for k, v in before[slug].items() if k not in {"section", "numbering_epoch"}}
            self.assertEqual(moved, kept)
        self.assertEqual(after["beta"]["section"], "S03")
        self.assertEqual(after["gamma"]["numbering_epoch"], 4)

    def test_the_redaction_list_is_stamped_and_names_the_same_sections(self) -> None:
        self.advance()
        self.assertEqual(numbering.redacted_slugs(self.root), {"alpha", "gamma"})
        data = json.loads((self.root / numbering.REDACTION_FILE).read_text(encoding="utf-8"))
        self.assertEqual(data["numbering_epoch"], 4)

    def test_every_finding_stays_with_its_section(self) -> None:
        self.advance()
        after = {slug: [f["finding_id"] for f in found]
                 for slug, found in numbering.registry_findings(self.root).items()}
        self.assertEqual(after["fresh"], [])
        self.assertEqual({s: ids for s, ids in after.items() if s != "fresh"}, self.before)
        sections = {f["section"] for f in numbering.registry_findings(self.root)["beta"]}
        self.assertEqual(sections, {"S03"})

    def test_the_registry_says_its_text_still_counts_the_old_way(self) -> None:
        self.advance()
        committed = numbering.read_registry(self.root)
        self.assertEqual(committed["numbering_epoch"], 4)
        self.assertEqual(committed["text_numbering_epoch"], 3)
        self.assertEqual({f["evidence"] for f in committed["findings"] if f["finding_id"] == "S02-F01"},
                         {"see S02"})

    def test_a_brief_is_told_how_to_read_the_old_numbers_in_the_text(self) -> None:
        self.assertEqual(numbering.text_epoch_note(self.root, numbering.load_epoch(self.root)), "")
        self.advance()
        note = numbering.text_epoch_note(self.root)
        self.assertIn("S02 is now S03", note)
        self.assertIn("S03 is now S04", note)
        self.assertNotIn("S01 is now", note)

    def test_a_renamed_slug_is_carried_to_its_current_id_and_remembered(self) -> None:
        build(self.root, slugs=NEW, epoch_slugs=OLD, roadmap_numbers=range(1, 5), renames={"beta-old": "beta"})
        cycle(self.root, "S02", slug="beta-old", findings_closed=[])
        self.advance()
        record = numbering.cycle_records(self.root)["beta"]
        self.assertEqual((record["slug"], record["slug_at_record"]), ("beta", "beta-old"))


class TheCommandIsIdempotentAndRefusalsChangeNothing(RenumberedTree):
    def test_a_second_run_changes_nothing(self) -> None:
        self.advance()
        first = snapshot(self.root)
        self.assertEqual(restamp.restamp(self.root), [])
        self.assertEqual(self.advance(), ["the epoch already matches the course; nothing to advance"])
        self.assertEqual(snapshot(self.root), first)

    def test_a_record_that_disagrees_with_its_old_number_is_refused_and_nothing_is_written(self) -> None:
        cycle(self.root, "S02", slug="gamma")
        before = snapshot(self.root)
        with self.assertRaisesRegex(NumberingError, "numbers section 2 as 'beta'"):
            self.advance()
        self.assertEqual(snapshot(self.root), before)

    def test_a_section_the_course_dropped_is_refused_and_nothing_is_written(self) -> None:
        build(self.root, slugs=("alpha", "beta"), epoch_slugs=OLD, roadmap_numbers=range(1, 3))
        before = snapshot(self.root)
        with self.assertRaisesRegex(NumberingError, "'gamma' of epoch 3 is not in the course"):
            self.advance()
        self.assertEqual(snapshot(self.root), before)

    def test_a_renumber_that_keeps_the_count_is_refused_because_the_label_is_the_count(self) -> None:
        build(self.root, slugs=("alpha", "gamma", "beta"), epoch_slugs=OLD)
        before = snapshot(self.root)
        with self.assertRaisesRegex(NumberingError, "cannot be told from the last one"):
            self.advance()
        self.assertEqual(snapshot(self.root), before)

    def test_state_from_an_epoch_the_file_has_no_table_for_is_refused(self) -> None:
        registry(self.root, FILED, stamp=2)
        before = snapshot(self.root)
        with self.assertRaisesRegex(NumberingError, "keeps no table"):
            self.advance()
        self.assertEqual(snapshot(self.root), before)

    def test_two_records_cannot_land_on_one_number(self) -> None:
        """A file already stamped for the new epoch sits where an old record is about to move."""
        cycle(self.root, "S03", slug="beta", numbering_epoch=4)
        before = snapshot(self.root)
        with self.assertRaisesRegex(NumberingError, "would both become S03.json"):
            self.advance()
        self.assertEqual(snapshot(self.root), before)

    def test_the_command_line_reports_and_exits_zero_when_it_worked(self) -> None:
        out = io.StringIO()
        with mock.patch.object(restamp, "ROOT", self.root), contextlib.redirect_stdout(out):
            code = restamp.main(["advance", "--roadmap", "roadmap.md"])
        self.assertEqual(code, 0, out.getvalue())
        self.assertIn("epoch 3 -> 4", out.getvalue())
        self.assertIn("numbering: ok", out.getvalue())

    def test_the_command_says_the_ledger_is_the_next_step_and_only_when_it_advanced(self) -> None:
        """LEDGER.md carries per-step totals out of the epoch's count, and a flip simulated on a copy of the
        real tree left exactly that test red until `ledger.py` ran. The ledger is generated from the gate's
        reports, which the gate rebuilds, so `advance` cannot honestly write it; it says what comes next."""
        hint = "python3 tools/fixer/ledger.py"
        self.assertTrue(any(hint in note for note in self.advance()))
        self.assertFalse(any(hint in note for note in self.advance()), "the second run advanced nothing")
    def test_the_command_line_refuses_a_bad_invocation(self) -> None:
        out = io.StringIO()
        with mock.patch.object(restamp, "ROOT", self.root), contextlib.redirect_stdout(out):
            self.assertEqual(restamp.main(["advance", "--roadmap"]), 1)
            self.assertEqual(restamp.main(["whatever"]), 1)
        self.assertIn("usage", out.getvalue())


class TheTwoEpochFilesTellOneStory(RenumberedTree):
    """audit/safe-agent/renumber_epoch.json (the guards' window switch) and numbering_epoch.json (the
    fixer's table) are separate files that describe one event. When both exist they must agree on which
    sections the renumber added."""

    def window(self, new_slugs) -> None:
        write(self.root, numbering.RENUMBER_EPOCH_FILE,
              json.dumps({"schema": "renumber_epoch/1", "renumber_sha": "0" * 40, "new_slugs": new_slugs}))

    def test_while_the_window_file_does_not_exist_nothing_is_checked(self) -> None:
        self.advance()
        self.assertEqual(numbering.check_epoch(self.root), [])

    def test_agreeing_files_pass(self) -> None:
        self.advance()
        self.window([{"slug": "fresh", "index": 2}])
        self.assertEqual(numbering.check_epoch(self.root), [])

    def test_a_window_file_that_names_another_section_is_a_problem(self) -> None:
        self.advance()
        self.window([{"slug": "other", "index": 2}])
        problems = numbering.check_epoch(self.root)
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("says the renumber added", problems[0])

    def test_a_window_file_that_gives_the_wrong_number_is_a_problem(self) -> None:
        self.advance()
        self.window([{"slug": "fresh", "index": 3}])
        self.assertTrue(numbering.check_epoch(self.root))

    def test_a_window_file_with_no_earlier_table_in_the_epoch_is_a_problem(self) -> None:
        """A renumber is recorded but the table never moved: the state would still be refused."""
        self.window([{"slug": "fresh", "index": 2}])
        problems = [p for p in numbering.check_epoch(self.root) if "renumber_epoch" in p]
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("keeps no table of the numbering before it", problems[0])

    def test_a_window_file_that_is_not_json_is_a_problem(self) -> None:
        self.advance()
        write(self.root, numbering.RENUMBER_EPOCH_FILE, "{not json")
        self.assertTrue(any("not valid JSON" in p for p in numbering.check_epoch(self.root)))


class AtTheSizeOfTheRealRenumber(unittest.TestCase):
    """The real epoch, cycle records, redaction list, registry and rename map, with a course that has three
    new sections inserted at S19, S20 and S35, the shape of the design's renumber. Every expectation is derived
    from the course built here, so it holds under any real epoch.

    The inserted slugs are invented and cannot be real sections. They used to be `inferencia`,
    `diseno-experimental` and `regresion`, the names the renumber is expected to give its new sections; the day
    the real epoch lists them, inserting them again made a course that listed each twice, and this class
    errored on the very flip it exists to prove. A flip simulated on a copy of the real tree found that."""

    INSERT = {19: "inserted-first", 20: "inserted-second", 35: "inserted-third"}

    def setUp(self) -> None:
        self.root = Path(tempfile.mkdtemp(prefix="pyarcana-renumber-"))
        self.addCleanup(shutil.rmtree, self.root, True)
        for rel in (numbering.EPOCH_FILE, numbering.CYCLES_DIR, numbering.REDACTION_FILE, numbering.REGISTRY_FILE,
                    numbering.RENAMES_FILE):
            source, target = ROOT / rel, self.root / rel
            target.parent.mkdir(parents=True, exist_ok=True)
            if source.is_dir():
                shutil.copytree(source, target)
            else:
                shutil.copy(source, target)
        self.old = numbering.load_epoch(ROOT)
        self.assertEqual(set(self.INSERT.values()) & set(self.old.slugs), set(), "an invented slug became real")
        slugs = list(self.old.slugs)
        for number in sorted(self.INSERT):
            slugs.insert(number - 1, self.INSERT[number])
        self.new_slugs = tuple(slugs)
        build(self.root, slugs=self.new_slugs, epoch_slugs=self.old.slugs,
              roadmap_numbers=range(1, len(slugs) + 1), renames=None)
        shutil.copy(ROOT / numbering.RENAMES_FILE, self.root / numbering.RENAMES_FILE)
        self.registry_before = numbering.registry_findings(ROOT, self.old)

    def test_one_command_adds_three_sections_and_the_state_follows_its_sections(self) -> None:
        self.assertEqual(len(self.new_slugs), self.old.count + 3)
        self.assertTrue(numbering.check_epoch(self.root), "the renumbered course is refused before the command")
        notes = restamp.advance(self.root, "roadmap.md")
        self.assertEqual(numbering.check_epoch(self.root), [])
        epoch = numbering.load_epoch(self.root)
        self.assertEqual((epoch.label, epoch.previous_table(self.old.label)),
                         (self.old.count + 3, self.old.slugs))
        after = numbering.registry_findings(self.root, epoch)
        for slug in self.old.slugs:        # nothing lost, nothing moved to another section
            self.assertEqual([f["finding_id"] for f in after[slug]],
                             [f["finding_id"] for f in self.registry_before[slug]], slug)
        for slug in self.INSERT.values():
            self.assertEqual(after[slug], [])
        total = sum(len(found) for found in self.registry_before.values())
        self.assertTrue(any(f"{total} findings re-keyed" in n for n in notes), notes)

    def test_a_section_after_an_insertion_is_filed_under_its_new_number(self) -> None:
        restamp.advance(self.root, "roadmap.md")
        epoch = numbering.load_epoch(self.root)
        # The first section with findings, the first one after the two insertions at 19 and 20, and the last.
        # Sections with none are skipped: after an earlier flip the real epoch has sections no auditor saw.
        with_findings = [slug for slug in self.old.slugs if self.registry_before[slug]]
        after_insertion = next(slug for slug in with_findings if self.old.slugs.index(slug) >= 18)
        for slug in (with_findings[0], after_insertion, with_findings[-1]):
            tag = numbering.tag_of(self.new_slugs.index(slug) + 1)
            finding = numbering.registry_findings(self.root, epoch)[slug][0]
            self.assertEqual((numbering.tag_for_slug(slug, epoch), finding["section"]), (tag, tag), slug)
        self.assertEqual(numbering.tag_for_slug(self.old.slugs[18], epoch),
                         numbering.tag_of(19 + 2))      # two sections went in at or before its number

    def test_the_recorded_sections_keep_their_content_and_their_renames(self) -> None:
        recorded = numbering.cycle_records(ROOT)
        restamp.advance(self.root, "roadmap.md")
        records = numbering.cycle_records(self.root)
        self.assertEqual(sorted(p.name for p in (self.root / numbering.CYCLES_DIR).glob("*.json")),
                         sorted(numbering.tag_of(self.new_slugs.index(slug) + 1) + ".json" for slug in recorded))
        self.assertEqual({r["numbering_epoch"] for r in records.values()}, {self.old.count + 3})
        for slug, before in recorded.items():
            kept = {k: v for k, v in before.items() if k not in {"section", "numbering_epoch"}}
            self.assertEqual({k: v for k, v in records[slug].items()
                              if k not in {"section", "numbering_epoch"}}, kept, slug)
        self.assertEqual(records["decisions-rules"]["slug_at_record"], "data-structures")


if __name__ == "__main__":
    unittest.main()
