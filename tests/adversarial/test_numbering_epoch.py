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
import shutil
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

import numbering  # noqa: E402
from numbering import NumberingError  # noqa: E402


def write(root: Path, rel: str, text: str) -> None:
    path = root / rel
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


def build(root: Path, slugs=("alpha", "beta", "gamma"), label=None, roadmap_numbers=None,
          course_order=None, index_fields=None, renames=None) -> None:
    """A repository with one section file per slug, imported by index.ts in `course_order`.

    Defaults are a consistent three-section course: epoch label 3, roadmap S1..S3, course order
    equal to the epoch, and each section's `index` equal to its position."""
    count = len(slugs)
    epoch = {"numbering_epoch": count if label is None else label, "roadmap": "roadmap.md",
             "sections": [{"number": i, "slug": s} for i, s in enumerate(slugs, 1)]}
    write(root, "audit/fixer/numbering_epoch.json", json.dumps(epoch))
    numbers = roadmap_numbers if roadmap_numbers is not None else range(1, count + 1)
    write(root, "roadmap.md", "".join(f"### S{n} — Titulo {n}\n" for n in numbers))
    for i, slug in enumerate(slugs, 1):
        index_value = (index_fields or {}).get(slug, i)
        write(root, f"src/lib/course/sections/s{i:02d}-{slug}.ts",
              "export const section%d: CourseSection = {\n  id: '%s',\n  index: %s,\n  title: 'x',\n}\n"
              % (i, slug, index_value))
    order = course_order if course_order is not None else list(slugs)
    imports = "".join(
        f"import {{ section{slugs.index(s) + 1} }} from './sections/s{slugs.index(s) + 1:02d}-{s}'\n"
        for s in order)
    body = "".join(f"  section{slugs.index(s) + 1},\n" for s in order)
    write(root, "src/lib/course/index.ts",
          imports + "export const COURSE_SECTIONS: CourseSection[] = [\n" + body + "]\n")
    pairs = renames or {}
    rows = "".join(f"  '{old}': '{new}',\n" for old, new in pairs.items())
    write(root, "src/lib/section-id-migrations.ts",
          "export const SECTION_ID_RENAMES: Readonly<Record<string, string>> = {\n" + rows + "}\n")


def cycle(root: Path, tag: str, **fields) -> None:
    record = {"section": tag, "numbering_epoch": 3, "slug": fields.pop("slug", None), **fields}
    write(root, f"audit/fixer/cycles/{tag}.json", json.dumps(record))


class NumberingFixture(unittest.TestCase):
    def setUp(self) -> None:
        self.root = Path(tempfile.mkdtemp(prefix="pyarcana-numbering-"))
        self.addCleanup(shutil.rmtree, self.root, True)


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
