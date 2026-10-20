"""Contract: tools/fixer/numbering.py is the one place the fixer learns which section a number names.

A section's number belongs to a numbering epoch, not to the section. The epoch
(audit/fixer/numbering_epoch.json) names the roadmap of record and lists the slugs in number order.
The fixer's state (cycle records, the redaction list, the ledger, the prompts) reads numbers and
slugs through this module, and it fails closed on any disagreement rather than guessing.

Every case builds a small temporary repository (three sections, so the test code itself types no
section count) and asserts a refusal or an answer. Mutation proof: each refusal below is undone by
one edit to numbering.py (for example, make `resolve` return an unknown tag unchanged, as the old
`resolve_slug` did) and the matching case fails for the stated reason.
"""
from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

import numbering  # noqa: E402
from numbering import NumberingError  # noqa: E402
from numbering_fixture import NumberingFixture, build, cycle, write  # noqa: E402


class EpochAndTags(NumberingFixture):
    def test_numbers_and_slugs_are_read_from_the_epoch(self) -> None:
        build(self.root)
        epoch = numbering.load_epoch(self.root)
        self.assertEqual(epoch.count, 3)
        self.assertEqual(numbering.slug_for_tag("S02", epoch), "beta")
        self.assertEqual(numbering.tag_for_slug("gamma", epoch), "S03")

    def test_a_missing_epoch_is_refused(self) -> None:
        build(self.root)
        (self.root / "audit/fixer/numbering_epoch.json").unlink()
        with self.assertRaisesRegex(NumberingError, "no numbering epoch"):
            numbering.load_epoch(self.root)

    def test_a_label_that_disagrees_with_its_table_is_refused(self) -> None:
        """A stale or hand-typed epoch label is the literal count coming back in another form."""
        build(self.root, label=4)
        with self.assertRaisesRegex(NumberingError, "label"):
            numbering.load_epoch(self.root)

    def test_numbers_must_run_one_to_n_in_order(self) -> None:
        build(self.root)
        path = self.root / "audit/fixer/numbering_epoch.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data["sections"][1]["number"] = 3
        path.write_text(json.dumps(data), encoding="utf-8")
        with self.assertRaisesRegex(NumberingError, "one to n"):
            numbering.load_epoch(self.root)

    def test_a_number_outside_the_epoch_is_refused_not_passed_through(self) -> None:
        """The old resolve_slug returned 'S04' unchanged when the events cache could not answer,
        and the caller then failed somewhere else with a different message. Now it refuses."""
        build(self.root)
        with self.assertRaisesRegex(NumberingError, "S04"):
            numbering.resolve("S04", numbering.load_epoch(self.root))

    def test_a_slug_outside_the_epoch_is_refused(self) -> None:
        build(self.root)
        with self.assertRaisesRegex(NumberingError, "not a section of this epoch"):
            numbering.resolve("ghost", numbering.load_epoch(self.root))

    def test_resolve_accepts_a_slug_or_a_tag(self) -> None:
        build(self.root)
        epoch = numbering.load_epoch(self.root)
        self.assertEqual(numbering.resolve("S01", epoch), "alpha")
        self.assertEqual(numbering.resolve("alpha", epoch), "alpha")


class TheRoadmapPath(NumberingFixture):
    """The epoch file commits a roadmap path, and `restamp.py advance --roadmap` takes it from the command
    line, so it is validated at that boundary: a path that leaves the repository would be committed as
    the roadmap of record and read from wherever it points."""

    def test_a_repository_relative_path_is_accepted(self) -> None:
        for name in ("roadmap.md", "docs/roadmap_next.md"):
            with self.subTest(name=name):
                self.assertIsNone(numbering.roadmap_path_problem(name))

    def test_an_empty_absolute_or_escaping_path_is_not_a_roadmap_of_record(self) -> None:
        for name in ("", "  ", "/etc/roadmap.md", "../roadmap.md", "docs/../../roadmap.md", None, 5):
            with self.subTest(name=name):
                self.assertIsNotNone(numbering.roadmap_path_problem(name))

    def test_an_epoch_file_that_names_such_a_roadmap_is_refused(self) -> None:
        build(self.root)
        path = self.root / "audit/fixer/numbering_epoch.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data["roadmap"] = "../outside.md"
        path.write_text(json.dumps(data), encoding="utf-8")
        with self.assertRaisesRegex(NumberingError, "inside the repository"):
            numbering.load_epoch(self.root)

    def test_an_epoch_file_with_no_roadmap_is_still_refused_for_that_reason(self) -> None:
        build(self.root)
        path = self.root / "audit/fixer/numbering_epoch.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        del data["roadmap"]
        path.write_text(json.dumps(data), encoding="utf-8")
        with self.assertRaisesRegex(NumberingError, "names no roadmap of record"):
            numbering.load_epoch(self.root)


class PreviousEpochs(NumberingFixture):
    """The epoch file remembers the tables of the epochs it replaced, which is what lets state stamped with
    one of them be carried to the current numbering instead of being refused for good."""

    def rewrite(self, **changes) -> None:
        path = self.root / "audit/fixer/numbering_epoch.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data.update(changes)
        path.write_text(json.dumps(data), encoding="utf-8")

    def test_an_earlier_epochs_table_is_read_back(self) -> None:
        build(self.root, previous={2: ["alpha", "beta"]})
        epoch = numbering.load_epoch(self.root)
        self.assertEqual(epoch.previous_table(2), ("alpha", "beta"))
        self.assertIsNone(epoch.previous_table(9))

    def test_an_epoch_with_no_history_has_no_previous_table(self) -> None:
        build(self.root)
        self.assertIsNone(numbering.load_epoch(self.root).previous_table(2))

    def test_a_table_whose_label_is_not_its_count_is_refused(self) -> None:
        build(self.root)
        self.rewrite(previous_epochs={"5": ["alpha", "beta"]})
        with self.assertRaisesRegex(NumberingError, "label must be that count"):
            numbering.load_epoch(self.root)

    def test_the_current_epoch_cannot_also_be_a_previous_one(self) -> None:
        build(self.root)
        self.rewrite(previous_epochs={"3": ["alpha", "beta", "gamma"]})
        with self.assertRaisesRegex(NumberingError, "lists the current epoch"):
            numbering.load_epoch(self.root)

    def test_a_table_with_a_repeated_slug_is_refused(self) -> None:
        build(self.root)
        self.rewrite(previous_epochs={"2": ["alpha", "alpha"]})
        with self.assertRaisesRegex(NumberingError, "unique"):
            numbering.load_epoch(self.root)

    def test_history_that_is_not_a_map_is_refused(self) -> None:
        build(self.root)
        self.rewrite(previous_epochs=["alpha"])
        with self.assertRaisesRegex(NumberingError, "must map an epoch label"):
            numbering.load_epoch(self.root)

    def test_the_refusal_of_old_state_names_the_command_only_when_it_can_work(self) -> None:
        build(self.root, previous={2: ["alpha", "beta"]})
        epoch = numbering.load_epoch(self.root)
        known = numbering.stale_stamp("x.json", 2, epoch)
        unknown = numbering.stale_stamp("x.json", 9, epoch)
        self.assertIn("restamp.py", known)
        self.assertNotIn("keeps no table", known)
        self.assertIn("keeps no table for epoch 9", unknown)


class EpochAgainstRoadmapAndCourse(NumberingFixture):
    def test_a_consistent_tree_has_no_problems(self) -> None:
        build(self.root)
        self.assertEqual(numbering.check_epoch(self.root), [])

    def test_a_roadmap_with_a_different_count_is_a_problem(self) -> None:
        build(self.root, roadmap_numbers=[1, 2])
        problems = numbering.check_epoch(self.root)
        self.assertTrue(any("roadmap" in p for p in problems), problems)

    def test_a_course_order_that_differs_from_the_epoch_is_a_problem(self) -> None:
        build(self.root, course_order=["alpha", "gamma", "beta"])
        problems = numbering.check_epoch(self.root)
        self.assertTrue(any("course order" in p for p in problems), problems)

    def test_an_index_field_that_disagrees_with_its_position_is_a_problem(self) -> None:
        """The section file says it is section 3 while the epoch puts it at 2: the number and the
        slug disagree, and every state record keyed by either would be wrong."""
        build(self.root, index_fields={"beta": 3})
        problems = numbering.check_epoch(self.root)
        self.assertTrue(any("beta" in p and "index" in p for p in problems), problems)


class CycleRecords(NumberingFixture):
    def test_a_cycle_is_keyed_by_the_slug_its_number_has_in_the_epoch(self) -> None:
        build(self.root)
        cycle(self.root, "S02", slug="beta")
        records = numbering.cycle_records(self.root, numbering.load_epoch(self.root))
        self.assertEqual(list(records), ["beta"])

    def test_a_cycle_without_an_epoch_is_refused(self) -> None:
        build(self.root)
        write(self.root, "audit/fixer/cycles/S02.json", json.dumps({"section": "S02", "slug": "beta"}))
        with self.assertRaisesRegex(NumberingError, "numbering_epoch"):
            numbering.cycle_records(self.root, numbering.load_epoch(self.root))

    def test_a_cycle_from_another_epoch_is_refused(self) -> None:
        build(self.root)
        cycle(self.root, "S02", slug="beta", numbering_epoch=2)
        with self.assertRaisesRegex(NumberingError, "epoch 2"):
            numbering.cycle_records(self.root, numbering.load_epoch(self.root))

    def test_a_slug_that_does_not_match_its_number_is_refused(self) -> None:
        build(self.root)
        cycle(self.root, "S02", slug="gamma")
        with self.assertRaisesRegex(NumberingError, "slug and number mismatch"):
            numbering.cycle_records(self.root, numbering.load_epoch(self.root))

    def test_a_record_filed_under_another_tag_is_refused(self) -> None:
        build(self.root)
        cycle(self.root, "S02", slug="beta")
        path = self.root / "audit/fixer/cycles/S02.json"
        data = json.loads(path.read_text(encoding="utf-8"))
        data["section"] = "S03"
        path.write_text(json.dumps(data), encoding="utf-8")
        with self.assertRaisesRegex(NumberingError, "filed as S02"):
            numbering.cycle_records(self.root, numbering.load_epoch(self.root))

    def test_a_renamed_slug_is_accepted_only_through_the_rename_map(self) -> None:
        """The app's own SECTION_ID_RENAMES is the authority for a section that was renamed in
        place. A record that names an old slug is accepted when the map carries that slug to the
        current one, and refused when the map does not."""
        build(self.root, renames={"old-beta": "beta"})
        cycle(self.root, "S02", slug="beta", slug_at_record="old-beta")
        records = numbering.cycle_records(self.root, numbering.load_epoch(self.root))
        self.assertEqual(list(records), ["beta"])
        cycle(self.root, "S02", slug="beta", slug_at_record="unmapped")
        with self.assertRaisesRegex(NumberingError, "rename"):
            numbering.cycle_records(self.root, numbering.load_epoch(self.root))


class RedactionList(NumberingFixture):
    def test_the_redaction_list_must_name_sections_of_the_current_epoch(self) -> None:
        build(self.root)
        write(self.root, "audit/fixer/redaction_applied.json",
              json.dumps({"numbering_epoch": 3, "slugs": ["alpha", "ghost"]}))
        with self.assertRaisesRegex(NumberingError, "ghost"):
            numbering.redacted_slugs(self.root, numbering.load_epoch(self.root))

    def test_the_redaction_list_must_carry_the_current_epoch(self) -> None:
        build(self.root)
        write(self.root, "audit/fixer/redaction_applied.json",
              json.dumps({"slugs": ["alpha"]}))
        with self.assertRaisesRegex(NumberingError, "numbering_epoch"):
            numbering.redacted_slugs(self.root, numbering.load_epoch(self.root))


class SectionFiles(NumberingFixture):
    def test_a_file_is_a_section_only_when_the_course_imports_it(self) -> None:
        """Two files share the number prefix s02- here; only the imported one is section 2. Number
        prefixes are how the old identifier measure found sections, and they match inactive files."""
        build(self.root)
        write(self.root, "src/lib/course/sections/s02-legacy.ts",
              "export const legacy = {\n  id: 'legacy',\n  index: 2,\n}\n")
        self.assertEqual(numbering.slug_for_section_file(
            "src/lib/course/sections/s02-beta.ts", self.root), "beta")
        self.assertIsNone(numbering.slug_for_section_file(
            "src/lib/course/sections/s02-legacy.ts", self.root))
        self.assertEqual(numbering.section_rel("beta", self.root),
                         "src/lib/course/sections/s02-beta.ts")


class CurrentSlugs(NumberingFixture):
    def test_the_rename_map_is_applied_once(self) -> None:
        build(self.root, renames={"a": "b", "b": "c"})
        self.assertEqual(numbering.current_slug("a", self.root), "b")


if __name__ == "__main__":
    unittest.main()
