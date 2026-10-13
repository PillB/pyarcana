#!/usr/bin/env python3
"""Does each competency badge's claimed skill appear in the sections it requires? (C12b)

A competency badge (classes B and C) claims skill nodes and requires sections. A claim is backed
when some section the badge requires teaches the skill. A claim is a MEANING MISMATCH when the
skill is taught somewhere in the course but not by any required section: the badge's evidence
comes from the wrong place. Owed, not failing: the count is pinned, so the ratchet can fall and
may not rise.

Not counted here:
- a skill that no section teaches (deep_learning, kubernetes, mentoring, ...). That is a teaching
  debt under owner decision O18, guarded by G-16, not a mismatch;
- progress markers (class A, exempt per O19) and level capstones (class D, positional per O17).

Homes come from src/lib/eligibility/skill_node_terms.json. Anti-gaming rules: a term shorter than
4 characters, or matching more than 17 of the 52 sections, is rejected and gives its node no home.
Without the second rule one generic word would home every skill and hide every mismatch.

Expert standard: constructive alignment (Biggs and Tang, Teaching for Quality Learning at
University), where a credential's assessed evidence must be taught in the sections it names.
"""
from __future__ import annotations

import copy
import re
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from badge_sources import (  # noqa: E402
    CATALOG,
    ROOT,
    load,
    normalise,
    section_number,
    source_sections,
)

LEXICON = ROOT / "src/lib/eligibility/skill_node_terms.json"
MIN_TERM_LENGTH = 4
MAX_SECTIONS_PER_TERM = 17
COMPETENCY_CLASSES = ("B", "C")
#: Owed counts, measured on 2026-10-13 over the live catalog and lexicon. A ratchet: a fix lowers
#: them and the test then asks for the lower number; a new mismatch raises the count and fails.
MISMATCH_PAIRS_OWED = 92
MISMATCH_BADGES_OWED = 21


def surfaces_of(sections: list[dict]) -> dict[int, str]:
    return {s["index"]: normalise(s["title"] + " " + " ".join(s["outcomes"])) for s in sections}


def term_sections(term: str, surfaces: dict[int, str]) -> set[int]:
    pattern = re.compile(r"\b" + re.escape(normalise(term)))
    return {n for n, text in surfaces.items() if pattern.search(text)}


def term_rejections(lexicon: dict, surfaces: dict[int, str]) -> list[str]:
    total = len(surfaces)
    problems = []
    for node, terms in lexicon["nodes"].items():
        for term in terms:
            if len(term) < MIN_TERM_LENGTH:
                problems.append(f"{node}: term {term!r} is shorter than {MIN_TERM_LENGTH} characters")
            elif len(term_sections(term, surfaces)) > MAX_SECTIONS_PER_TERM:
                hits = len(term_sections(term, surfaces))
                problems.append(f"{node}: term {term!r} matches {hits} of {total} sections")
    return problems


def homes(node: str, lexicon: dict, surfaces: dict[int, str]) -> set[int]:
    """The sections that teach a node, through its accepted terms only."""
    found: set[int] = set()
    for term in lexicon["nodes"].get(node, []):
        if len(term) >= MIN_TERM_LENGTH:
            hits = term_sections(term, surfaces)
            if len(hits) <= MAX_SECTIONS_PER_TERM:
                found |= hits
    return found


def competency_claims(catalog: dict) -> list[tuple[dict, str]]:
    return [
        (badge, node)
        for badge in catalog["badges"] if badge["credential_class"] in COMPETENCY_CLASSES
        for node in badge.get("skill_nodes", [])
    ]


def mismatch_pairs(catalog: dict, lexicon: dict, surfaces: dict[int, str]) -> list[tuple[str, str]]:
    """Each (badge, node) where the node is taught but no required section of the badge teaches it."""
    pairs = []
    for badge in [b for b in catalog["badges"] if b["credential_class"] in COMPETENCY_CLASSES]:
        required = {section_number(t) for t in badge.get("required_sections", [])}
        for node in badge.get("skill_nodes", []):
            taught = homes(node, lexicon, surfaces)
            if taught and not (taught & required):
                pairs.append((badge["badge_id"], node))
    return pairs


def lexicon_gaps(catalog: dict, lexicon: dict) -> list[str]:
    """A competency skill with no entry is teaching debt, not a pass. Listing it is required."""
    entries = lexicon["nodes"]
    claimed = {node for badge, node in competency_claims(catalog)}
    return [f"{node}: claimed by a competency badge but missing from the lexicon" for node in sorted(claimed - set(entries))]


class MeaningMismatchRatchet(unittest.TestCase):
    def setUp(self) -> None:
        self.catalog = load(CATALOG)
        self.lexicon = load(LEXICON)
        self.surfaces = surfaces_of(source_sections())

    def test_the_lexicon_obeys_the_anti_gaming_rules(self) -> None:
        self.assertEqual(term_rejections(self.lexicon, self.surfaces), [])

    def test_every_competency_skill_is_in_the_lexicon(self) -> None:
        self.assertEqual(lexicon_gaps(self.catalog, self.lexicon), [])

    def test_the_mismatch_count_is_exactly_the_owed_count(self) -> None:
        pairs = mismatch_pairs(self.catalog, self.lexicon, self.surfaces)
        badges = {badge for badge, _ in pairs}
        self.assertEqual(len(pairs), MISMATCH_PAIRS_OWED, f"pairs now: {pairs}")
        self.assertEqual(len(badges), MISMATCH_BADGES_OWED, f"badges now: {sorted(badges)}")

    def test_a_term_matching_exactly_seventeen_sections_is_kept(self) -> None:
        surfaces = {n: ("zetaword " if n <= 17 else "") for n in range(1, 53)}
        self.assertEqual(term_rejections({"nodes": {"n": ["zetaword"]}}, surfaces), [])

    def test_a_term_matching_eighteen_sections_is_rejected(self) -> None:
        surfaces = {n: ("zetaword " if n <= 18 else "") for n in range(1, 53)}
        problems = term_rejections({"nodes": {"n": ["zetaword"]}}, surfaces)
        self.assertTrue(any("matches 18 of 52" in p for p in problems), problems)

    def test_a_term_of_three_characters_is_rejected_and_four_is_kept(self) -> None:
        surfaces = {1: "abcd abc"}
        problems = term_rejections({"nodes": {"n": ["abc", "abcd"]}}, surfaces)
        self.assertEqual(len(problems), 1, problems)
        self.assertIn("'abc'", problems[0])

    def test_a_claim_taught_only_outside_its_sections_is_a_new_mismatch(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
        badge["skill_nodes"].append("python_visualization")
        before = mismatch_pairs(self.catalog, self.lexicon, self.surfaces)
        after = mismatch_pairs(catalog, self.lexicon, self.surfaces)
        self.assertEqual(len(after), len(before) + 1)
        self.assertIn(("python_data_foundations", "python_visualization"), after)

    def test_a_progress_marker_is_outside_this_ratchet(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "progress_phase0_walked")
        badge["skill_nodes"].append("python_visualization")
        before = mismatch_pairs(self.catalog, self.lexicon, self.surfaces)
        self.assertEqual(mismatch_pairs(catalog, self.lexicon, self.surfaces), before)

    def test_a_skill_no_section_teaches_is_teaching_debt_not_a_mismatch(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
        badge["skill_nodes"].append("kubernetes")
        before = mismatch_pairs(self.catalog, self.lexicon, self.surfaces)
        self.assertEqual(mismatch_pairs(catalog, self.lexicon, self.surfaces), before)


if __name__ == "__main__":
    unittest.main()
