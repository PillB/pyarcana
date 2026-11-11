#!/usr/bin/env python3
"""A badge names the section it claims, through a manifest that says which section that is.

Design step 0b-4 (audit/fixer/renumber_g0/design_ruled_final.md §4.1 and §4.3, guard G-3a). The
renumber rewrites every section token, so identity has to be checked before it moves. G-3a fails
on three things:

- a catalog token (`S13`, `S13-YOUDO`) that does not resolve through
  src/lib/eligibility/section_manifest.json to a section that exists in the course source under
  that slug;
- a positional badge (a progress marker, the journey, a level capstone) whose required_sections
  are not its span, derived from the sections' `phase`; the final section is outside phase 3.
  The final capstone (evidence_grounded_ai_systems_capstone) is positional too: it requires the
  last section, whatever number that has (design §4.2: S52 today, S55 after the renumber). Every
  class A and class D badge must have such a rule, so a new one cannot escape the check.
  A positional badge's required_activities must be exactly the kinds the manifest lists
  (positional_activity_kinds: YOUDO and EXAM, as today) for each section of the span, so a marker
  cannot lose, gain or repeat an activity while its section list stays right;
- a skill node claimed while its role is unbound, or bound to a section the manifest lacks.

The roles stay unbound (section_index null) until Gate B binds them at the renumber, so today no
badge may claim the nodes under them. Expert standard: the Phase 6 badge architecture (catalog
spec, §Identity) and the constructive-alignment rule that a credential's evidence must come from
the section that teaches it (Biggs and Tang, Teaching for Quality Learning at University).

Section titles are fingerprinted (C12a): a retitled section that a badge cites is named, and the
change has to pass through the manifest.
"""
from __future__ import annotations

import copy
import hashlib
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from badge_sources import (  # noqa: E402
    CATALOG,
    MANIFEST,
    cited_numbers,
    load,
    section_number,
    source_sections,
    token_number,
)


#: A progress marker (A) and a level capstone (D) take their sections from their position, so
#: each must have a rule in the manifest; a competency badge (B, C) names sections by judgement.
POSITIONAL_CLASSES = ("A", "D")


def span_for(rule: dict, sections: list[dict]) -> list[int]:
    """The section numbers a positional badge must require, derived from `phase` or position."""
    if rule.get("all_sections"):
        return [s["index"] for s in sections]
    last = max(s["index"] for s in sections)
    if rule.get("last_section"):
        return [last]
    members = [s["index"] for s in sections if s["phase"] == rule["phase"]]
    if rule.get("drop_final"):
        members = [n for n in members if n != last]
    return members


def _token_violations(manifest: dict, catalog: dict) -> list[str]:
    by_index = {s["index"]: s for s in manifest["sections"]}
    problems = []
    for badge in catalog["badges"]:
        for field, number_of in (("required_sections", section_number), ("required_activities", token_number)):
            for token in badge.get(field, []):
                number = number_of(token)
                if number is None:
                    problems.append(f"{badge['badge_id']}: {field} token {token} is not shaped like a {field} tag")
                elif not by_index.get(number, {}).get("slug"):
                    problems.append(f"{badge['badge_id']}: token {token} does not resolve to a manifest slug")
    return problems


def _one_span_problems(badge_id: str, badge: dict, rule: dict, manifest: dict) -> list[str]:
    """The sections and the activities one positional badge must require, against what it does."""
    span = span_for(rule, manifest["sections"])
    if not span:
        return [f"{badge_id}: its span is empty, so its rule matches no section"]
    sections = [f"S{n:02d}" for n in span]
    activities = sorted(f"{s}-{kind}" for s in sections for kind in manifest["positional_activity_kinds"])
    problems = []
    if badge.get("required_sections", []) != sections:
        problems.append(f"{badge_id}: required_sections are not its span {sections[0]}..{sections[-1]}")
    if sorted(badge.get("required_activities", [])) != activities:
        kinds = "+".join(manifest["positional_activity_kinds"])
        problems.append(f"{badge_id}: required_activities are not {kinds} of each section in its span")
    return problems


def _span_violations(manifest: dict, catalog: dict) -> list[str]:
    badges = {b["badge_id"]: b for b in catalog["badges"]}
    problems = []
    for badge_id, badge in badges.items():
        if badge["credential_class"] in POSITIONAL_CLASSES and badge_id not in manifest["positional_badges"]:
            problems.append(f"{badge_id}: class {badge['credential_class']} badge has no positional rule in the manifest")
    for badge_id, rule in manifest["positional_badges"].items():
        if badge_id not in badges:
            problems.append(f"{badge_id}: positional rule names a badge the catalog lacks")
        else:
            problems += _one_span_problems(badge_id, badges[badge_id], rule, manifest)
    return problems


def _role_violations(manifest: dict, catalog: dict) -> list[str]:
    by_index = {s["index"]: s for s in manifest["sections"]}
    owner = {node: (role, spec) for role, spec in manifest["roles"].items() for node in spec["nodes"]}
    problems = []
    for badge in catalog["badges"]:
        for node in badge.get("skill_nodes", []):
            if node not in owner:
                continue
            role, spec = owner[node]
            if spec["section_index"] is None:
                problems.append(f"{badge['badge_id']}: claims {node} while role {role} is unbound")
            elif spec["section_index"] not in by_index or not by_index[spec["section_index"]]["slug"]:
                problems.append(f"{badge['badge_id']}: claims {node}; role {role} has no manifest slug")
    return problems


def identity_violations(manifest: dict, catalog: dict) -> list[str]:
    """Every way the badge identity can fail G-3a. An empty list is a pass."""
    return _token_violations(manifest, catalog) + _span_violations(manifest, catalog) + _role_violations(manifest, catalog)


def title_fingerprint(title: str | None) -> str:
    return hashlib.sha256((title or "").encode("utf-8")).hexdigest()


def title_violations(manifest: dict, sections: list[dict], catalog: dict) -> list[str]:
    """Each badge that cites a section whose live title no longer matches the manifest's fingerprint.

    A retitled section changes what the badge's S-number means to a learner, so the change has to
    pass through the manifest, where the owner sees it. A missing or unnamed section counts as drift.
    """
    live = {s["index"]: s["title"] for s in sections}
    drifted = {
        s["index"] for s in manifest["sections"]
        if title_fingerprint(live.get(s["index"])) != s["title_sha256"]
    }
    return [
        f"{badge['badge_id']}: cites S{n:02d}, whose title changed without a manifest update"
        for badge in catalog["badges"]
        for n in sorted(cited_numbers(badge) & drifted)
    ]


class BadgeSectionIdentity(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = load(MANIFEST)
        self.catalog = load(CATALOG)
        #: Fixtures name the last section by position and others by slug, never by a number that
        #: the renumber will change (design G-4 and G-9: derived counts, slug sets).
        self.last = max(s["index"] for s in self.manifest["sections"])

    def test_the_manifest_is_the_course_source(self) -> None:
        source = source_sections()
        self.assertEqual([s["index"] for s in source], list(range(1, len(source) + 1)), "sections are numbered 1..N")
        expected = [(s["index"], s["slug"], s["phase"], s["title"]) for s in source]
        actual = [(s["index"], s["slug"], s["phase"], s["title"]) for s in self.manifest["sections"]]
        self.assertEqual(actual, expected, "manifest drifted from src/lib/course/index.ts")

    def test_every_catalog_token_resolves_and_every_span_matches(self) -> None:
        self.assertEqual(identity_violations(self.manifest, self.catalog), [])

    def test_a_token_that_resolves_to_no_section_is_red(self) -> None:
        past_the_end = f"S{self.last + 1:02d}"
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "progress_phase0_walked")
        badge["required_sections"].append(past_the_end)
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(any("progress_phase0_walked" in p and past_the_end in p for p in problems), problems)

    def test_a_positional_badge_off_its_span_is_red(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "progress_journey_completed")
        badge["required_sections"].remove(f"S{self.last:02d}")
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(any("progress_journey_completed" in p and "span" in p for p in problems), problems)

    def test_a_required_section_must_be_a_bare_section_tag(self) -> None:
        """credential-gates.ts requiredSectionIds() accepts /^S\\d{2}$/ and throws on anything else."""
        for token in ("S01-YOUDO", "S1", "S001", "s01"):
            with self.subTest(token=token):
                catalog = copy.deepcopy(self.catalog)
                badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
                badge["required_sections"].append(token)
                problems = identity_violations(self.manifest, catalog)
                self.assertTrue(
                    any("python_data_foundations" in p and "required_sections" in p and token in p for p in problems),
                    problems,
                )

    def test_a_progress_marker_without_a_positional_rule_is_red(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        del manifest["positional_badges"]["progress_phase2_walked"]
        problems = identity_violations(manifest, self.catalog)
        self.assertTrue(any("progress_phase2_walked" in p and "positional rule" in p for p in problems), problems)

    def _positional(self, badge_id: str) -> tuple[dict, dict]:
        catalog = copy.deepcopy(self.catalog)
        return catalog, next(b for b in catalog["badges"] if b["badge_id"] == badge_id)

    def test_a_progress_marker_that_loses_an_activity_is_red(self) -> None:
        """The span check read required_sections only, so a marker could lose a You Do or an exam."""
        catalog, badge = self._positional("progress_phase1_walked")
        badge["required_activities"].pop()
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(any("progress_phase1_walked" in p and "required_activities" in p for p in problems), problems)

    def test_a_positional_badge_with_an_extra_or_repeated_activity_is_red(self) -> None:
        first = self._positional("progress_phase1_walked")[1]["required_sections"][0]
        for extra in (f"{first}-SELFCHECK", f"{first}-EXAM"):
            with self.subTest(extra=extra):
                catalog, badge = self._positional("progress_phase1_walked")
                badge["required_activities"].append(extra)
                problems = identity_violations(self.manifest, catalog)
                self.assertTrue(
                    any("progress_phase1_walked" in p and "required_activities" in p for p in problems), problems
                )

    def test_a_level_capstone_that_loses_an_exam_is_red(self) -> None:
        catalog, badge = self._positional("integrated_python_ai_capstone_foundations")
        self.assertTrue(badge["required_activities"][-1].endswith("-EXAM"), "the last activity is an exam")
        badge["required_activities"].pop()
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(
            any("integrated_python_ai_capstone_foundations" in p and "required_activities" in p for p in problems),
            problems,
        )

    def test_an_empty_span_is_reported_not_a_crash(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        manifest["positional_badges"]["progress_phase0_walked"] = {"phase": 9}
        problems = identity_violations(manifest, self.catalog)
        self.assertTrue(any("progress_phase0_walked" in p and "span" in p for p in problems), problems)

    def test_the_final_capstone_stays_on_the_final_section(self) -> None:
        """Design §4.2: evidence_grounded resolves to the last section, whatever number that has.

        Before the renumber the badge says S52; after it, S55. A token that still reads S52 would
        resolve, to a different section, and every other check would stay green.
        """
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "evidence_grounded_ai_systems_capstone")
        before = self.last - 1
        badge["required_sections"] = [f"S{before:02d}"]
        badge["required_activities"] = [f"S{before:02d}-YOUDO", f"S{before:02d}-EXAM"]
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(
            any("evidence_grounded_ai_systems_capstone" in p and "span" in p for p in problems), problems
        )

    def test_a_level_capstone_without_a_positional_rule_is_red(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        del manifest["positional_badges"]["evidence_grounded_ai_systems_capstone"]
        problems = identity_violations(manifest, self.catalog)
        self.assertTrue(
            any("evidence_grounded_ai_systems_capstone" in p and "positional rule" in p for p in problems),
            problems,
        )

    def test_the_last_section_rule_follows_the_section_count(self) -> None:
        rule = {"last_section": True}
        three = [{"index": n, "phase": 0} for n in (1, 2, 3)]
        fifty_five = [{"index": n, "phase": 0} for n in range(1, 56)]
        self.assertEqual(span_for(rule, three), [3])
        self.assertEqual(span_for(rule, fifty_five), [55])

    def test_a_node_claimed_while_its_role_is_unbound_is_red(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
        badge["skill_nodes"].append("hypothesis_testing")
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(any("python_data_foundations" in p and "unbound" in p for p in problems), problems)

    def test_a_bound_role_with_no_manifest_slug_is_red(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        manifest["roles"]["design"]["section_index"] = self.last + 1
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
        badge["skill_nodes"].append("experimental_design")
        problems = identity_violations(manifest, catalog)
        self.assertTrue(any("no manifest slug" in p for p in problems), problems)


class RenumberedWorld(unittest.TestCase):
    """G-3a on a course that has gained sections, built from the live one by inserting sections.

    The renumber adds three sections and moves everything after them. These tests build that world
    from whatever the live manifest is, so they name no number the renumber changes: two sections go
    in after the 18th and one after the 34th. A guard that read a literal 52 would not survive it.
    """

    INSERTIONS = ((18, 2), (34, 1))

    def setUp(self) -> None:
        self.manifest = load(MANIFEST)
        self.catalog = load(CATALOG)

    def _moved(self, n: int) -> int:
        return n + sum(count for after, count in self.INSERTIONS if n > after)

    def _grown_manifest(self) -> dict:
        manifest = copy.deepcopy(self.manifest)
        sections = [{**s, "index": self._moved(s["index"])} for s in manifest["sections"]]
        phase_of = {s["index"]: s["phase"] for s in self.manifest["sections"]}
        for after, count in self.INSERTIONS:
            for i in range(count):
                sections.append({
                    "index": self._moved(after) + 1 + i, "slug": f"inserted-after-{after}-{i}",
                    "phase": phase_of[after], "title": "inserted", "title_sha256": "0" * 64,
                })
        manifest["sections"] = sorted(sections, key=lambda s: s["index"])
        return manifest

    def _grown_catalog(self, manifest: dict) -> dict:
        """Every badge's tags moved with their sections; a positional badge re-derived from its rule."""
        catalog = copy.deepcopy(self.catalog)
        for badge in catalog["badges"]:
            rule = manifest["positional_badges"].get(badge["badge_id"])
            if rule:
                span = [f"S{n:02d}" for n in span_for(rule, manifest["sections"])]
                kinds = manifest["positional_activity_kinds"]
                badge["required_sections"] = span
                badge["required_activities"] = [f"{s}-{kind}" for kind in kinds for s in span]
                continue
            for field in ("required_sections", "required_activities"):
                badge[field] = [f"S{self._moved(int(t[1:3])):02d}{t[3:]}" for t in badge[field]]
        return catalog

    def test_a_correctly_renumbered_catalog_passes(self) -> None:
        manifest = self._grown_manifest()
        self.assertGreater(len(manifest["sections"]), len(self.manifest["sections"]))
        self.assertEqual(identity_violations(manifest, self._grown_catalog(manifest)), [])

    def test_a_catalog_left_on_the_old_numbers_is_red_though_every_tag_still_resolves(self) -> None:
        """The failure G-3a exists to catch: the final capstone's old tag still names a real section."""
        manifest = self._grown_manifest()
        old_last = max(s["index"] for s in self.manifest["sections"])
        self.assertIn(old_last, {s["index"] for s in manifest["sections"]}, "the stale tag still resolves")
        problems = identity_violations(manifest, self.catalog)
        self.assertFalse(any("does not resolve" in p for p in problems), problems)
        named = {p.split(":", 1)[0] for p in problems}
        self.assertIn("evidence_grounded_ai_systems_capstone", named, problems)
        self.assertIn("progress_journey_completed", named, problems)


class SectionTitleFingerprints(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.live_sections = source_sections()  # reads 52 large files once

    def setUp(self) -> None:
        self.manifest = load(MANIFEST)
        self.catalog = load(CATALOG)
        self.sections = self.live_sections

    def test_every_live_title_matches_its_fingerprint(self) -> None:
        self.assertEqual(title_violations(self.manifest, self.sections, self.catalog), [])

    def _section(self, sections: list[dict], slug: str) -> dict:
        """A section by slug. A slug survives the renumber; the number it has does not."""
        return next(s for s in sections if s["slug"] == slug)

    def test_retitling_a_section_a_badge_cites_names_those_badges(self) -> None:
        sections = copy.deepcopy(self.sections)
        cited = self._section(sections, "cv-ai-integration")
        cited["title"] = "retitled for the fixture"
        tag = f"S{cited['index']:02d}"
        problems = title_violations(self.manifest, sections, self.catalog)
        named = {p.split(":", 1)[0] for p in problems}
        self.assertIn("applied_deep_learning_practice", named, problems)
        self.assertIn("integrated_python_ai_capstone_advanced_applied", named, problems)
        self.assertNotIn("python_data_foundations", named, "a badge that does not cite the section is not named")
        self.assertTrue(all(tag in p for p in problems), problems)

    def test_a_section_with_no_title_is_drift_not_a_pass(self) -> None:
        sections = copy.deepcopy(self.sections)
        untitled = self._section(sections, "functions-contracts")
        untitled["title"] = None
        problems = title_violations(self.manifest, sections, self.catalog)
        self.assertTrue(any(f"S{untitled['index']:02d}" in p for p in problems), problems)


class SourceReader(unittest.TestCase):
    """The reader that feeds every badge guard. Fixtures are real files in a temporary course."""

    INDEX = (
        "export const COURSE_SECTIONS: CourseSection[] = [\n"
        "  section01,\n"
        "]\n"
        "import { section01 } from './sections/s01-quotes'\n"
    )
    SECTION = (
        "export const section01: CourseSection = {\n"
        "  id: \"quotes\",\n"
        "  index: 1,\n"
        "  title: \"Python's first title\",\n"
        "  phase: 0,\n"
        "  learningOutcomes: [\n"
        "    { text: \"Explain 'quotes' inside double-quoted text\" },\n"
        "    { text: 'Schema {columna: n} inside single-quoted text' },\n"
        "  ],\n"
        "}\n"
    )

    def test_a_string_holding_the_other_quote_mark_is_read_whole(self) -> None:
        import tempfile
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            (root / "sections").mkdir()
            (root / "index.ts").write_text(self.INDEX, encoding="utf-8")
            (root / "sections" / "s01-quotes.ts").write_text(self.SECTION, encoding="utf-8")
            (section,) = source_sections(root / "index.ts", root / "sections")
        self.assertEqual(section["title"], "Python's first title")
        self.assertEqual(section["slug"], "quotes")
        self.assertEqual(section["outcomes"], [
            "Explain 'quotes' inside double-quoted text",
            "Schema {columna: n} inside single-quoted text",
        ])


if __name__ == "__main__":
    unittest.main()
