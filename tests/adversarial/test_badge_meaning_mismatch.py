#!/usr/bin/env python3
"""Does each competency badge's claimed skill appear in the sections it requires? (C12b)

A competency badge (classes B and C) claims skill nodes and requires sections. A claim is backed
when some section the badge requires teaches the skill. A claim is a MEANING MISMATCH when the
skill is taught somewhere in the course but not by any required section: the badge's evidence
comes from the wrong place. Owed, not failing: the count is pinned exactly (O25, below), so the
ratchet may fall, in the change that pins the lower number, and may not rise.

Not counted here:
- a skill that no section teaches (deep_learning, kubernetes, mentoring, ...). That is a teaching
  debt under owner decision O18, guarded by G-16, not a mismatch. It is pinned exactly as
  NODES_WITHOUT_HOME_OWED, because a skill that loses its home (an emptied or removed lexicon entry)
  stops counting as a mismatch and would lower the owed pair count with no claim fixed;
- progress markers (class A, exempt per O19) and level capstones (class D, positional per O17).

Homes come from src/lib/eligibility/skill_node_terms.json. Anti-gaming rules: a term shorter than
4 characters, or matching more than a third of the sections (rounded down: 17 of 52 today, 18 of 55
after the renumber), is rejected and gives its node no home. Without the second rule one generic
word would home every skill and hide every mismatch. The cap is derived from the section count, as
the design asks of every count (G-4, G-9), so the renumber does not tighten it by accident.

OWNER DECISION O25 (2026-10-13): THIS DEBT IS HELD AS AN EXACT RATCHET. The owner accepted that the
badge claims whose required sections do not teach the claimed skill are owed, as the number this module
measures (92 pairs over 21 badges when the owner decided), together with the five prerequisite
inversions of test_badge_prerequisite_inversions.py. Nothing may grow; a claim fixed lowers the number,
and the same change must pin the lower number, so the count never drifts quietly in either direction. The
Phase 1 re-key pays the debt down. The module measures only, and approves nothing.

PINNED NOW: 102 pairs over 20 badges; 5 skills that no section teaches. (test_the_header_states_the_pins
fails when these words and the constants below disagree, so a re-pin cannot leave this header stale.)

THE MEASURE, AND HOW IT DIFFERS FROM THE PLAN'S 31 PAIRS OVER 19 BADGES. The fix plan (PR 12) expected
MISMATCH_PAIRS_OWED 31 and MISMATCH_BADGES_OWED 19 from an exploration whose definition, lexicon and
output are not in the repository, so that figure cannot be reproduced or audited. This test pins the
number below instead, under the definition above:
- unit: a (badge, skill) pair, one claim with no evidence behind it. Fixing it (re-key the badge to the
  section that teaches the skill, or drop the claim with the owner's approval) lowers exactly one number.
- surface: each section's title and learning outcomes, the text a learner reads as what the section
  teaches. It is the first half of owner decision O19's rule for a teaching home ("a section whose title
  or a learning outcome names the skill"); the second half (a We Do or You Do that practises it, an
  item that assesses it) is G-16's, from Phase 1a, and is not measured here.
- classes: B and C. Progress markers (A) are exempt under O19; level capstones (D) are positional.
Why this is the better definition: it is reproducible (every input is in the repo, so the number moves
only through a visible diff), its unit is the claim and not the section, and it matches the home rule
the owner already approved. Its price: the lexicon is keyword matching, so the count is only as good as
its terms, and it is looser than the full home rule.

THE LEXICON WAS REVIEWED BY CODEX (O25), IN TWO PASSES. An agent drafted the terms. Codex then checked each
one against the lessons: does the term mean the skill in the section it matches, and does a better term
appear in the lessons? It dropped terms that share a spelling with another meaning (`commit` is also SQL
COMMIT, `regresion` is also a regression test, `tests` also names a CI stage) and added the terms the
lessons use. A second Codex pass red-teamed the first for homes it lost (a section that does teach the
skill) and for terms that copy one outcome word for word and stop matching when an editor rewords it. The
pinned number moved from 92 pairs over 21 badges, measured with the drafted terms, to 108 over 20 after the
first pass and to the pinned number after the second: a skill dropped from a section that does not teach
it also stops covering the claims that leaned on that section. The final list is in the pull request diff
for the owner, who decides whether the ratchet is final.
Sensitivity, measured 2026-10-13 with the reviewed lexicon and NOT pinned: title only gives 84 pairs over
20 badges; B alone 49 over 15 and C alone 53 over 5; node-name words as terms give 27 over 15 on titles
and 68 over 21 with outcomes; counting (badge, required section) pairs in which the section teaches none
of the badge's claimed skills gives 35 over 18. None gives the plan's 31 over 19.

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
#: A term may match at most one section in this many, rounded down. It replaces the literal 17.
MAX_SECTION_SHARE_DIVISOR = 3
COMPETENCY_CLASSES = ("B", "C")
#: Owed counts, measured on 2026-10-13 over the live catalog and the Codex-reviewed lexicon. An exact
#: ratchet (O25): a fix lowers them and the test then asks for the lower number; a new mismatch raises
#: the count and fails. Measured with the drafted lexicon, before the review, they were 92 and 21.
MISMATCH_PAIRS_OWED = 102
MISMATCH_BADGES_OWED = 20
#: Competency-claimed skills that no section teaches through the lexicon, measured the same day. Owed
#: teaching debt (O18; G-16 owns it from Phase 1a). Pinned both ways: a skill that gains a home must
#: leave this list, and a skill that loses one (an emptied or removed lexicon entry) fails here, so
#: the pair count above cannot be lowered by hiding a skill from the lexicon.
NODES_WITHOUT_HOME_OWED = (
    "ai_code_review_literacy",
    "code_review_literacy",
    "deep_learning",
    "kubernetes",
    "mentoring",
)


#: Sections the drafted lexicon wrongly gave as the home of a skill, because a term shares its spelling
#: with another meaning there, and which the Codex review (O25) took away. Each is (skill, section id,
#: what the word means in that section). The section id is the stable one in the section file, which the
#: renumber does not change. A term that brings one of these back fails test_known_false_friends_are_no_home,
#: whatever the term is called. Only the homographs and sense clashes are pinned; the homes Codex judged
#: weak (a section that only lists the skill among other checks) are left to the exact count. If a lesson
#: comes to teach the skill in one of these sections, retire the pin with the owner's approval.
FALSE_HOMES = (
    ("git_workflow", "mlops", "S29 BEGIN/COMMIT/ROLLBACK is a SQL transaction, not a git commit"),
    ("classical_ml", "exceptions-logging", "S09 'tests de regresion' is a regression test, not regression modelling"),
    ("testing_discipline", "multimodal", "S44 'lint, types, tests' names a CI stage, not testing discipline"),
    ("python_core", "architecture-ddd-decisions", "S40 'requisitos funcionales' is not the Python function"),
    ("python_core", "cv-ai-integration", "S34 'clase positiva' is a class label, not a Python class"),
    ("model_evaluation", "basics", "S02 'Evaluar aritmetica' evaluates an expression, not a model"),
    ("business_framing", "async-concurrency", "S27 'rama de negocio' is a code branch under test"),
    ("data_cleaning", "async-concurrency", "S27 normalize_name is only the function under test"),
    ("written_communication", "performance-extreme", "S38 'redactar PII' removes sensitive data, it does not write"),
    ("observability", "computer-vision", "S23 'trace' is a Playwright debugging artifact"),
    ("python_idioms", "rpa-advanced", "S24 'idiomas' is languages, not idioms"),
    ("uncertainty_quantification", "gpu-computing", "S46 'intervalo' is a backfill window"),
    ("sql_fundamentals", "llm-agents", "S28 SQLite is a test double there, not SQL being taught"),
    ("drift_monitoring", "wxpython-gui", "S16 'schema drift' is a data-contract change, not model drift"),
    ("mlops_pipelines", "streamlit-dashboards", "S25 'adapter mock de pipeline/endpoint' is an inference adapter"),
    ("process_analysis", "integrator-phase2", "S39 'flujo canonico' is an ML data flow, not a business process"),
    ("python_visualization", "streaming-data", "S31 'Visualizar con privacidad' is a graph view, not a chart"),
    ("data_validation", "advanced-models", "S33 'validacion cruzada' is model validation, not data validation"),
)


def surfaces_of(sections: list[dict]) -> dict[int, str]:
    return {s["index"]: normalise(s["title"] + " " + " ".join(s["outcomes"])) for s in sections}


def false_home_violations(
    lexicon: dict, surfaces: dict[int, str], index_of: dict[str, int], pins: tuple = FALSE_HOMES
) -> list[str]:
    """Each pinned (skill, section) that the lexicon makes a home again, or that no longer names a real
    skill or section (a pin that cannot match proves nothing)."""
    problems = []
    for node, slug, why in pins:
        if node not in lexicon["nodes"]:
            problems.append(f"{node}: pinned false home, but the skill is not in the lexicon")
        elif slug not in index_of:
            problems.append(f"{node}: pinned false home {slug!r}, but no section has that id")
        elif index_of[slug] in homes(node, lexicon, surfaces):
            problems.append(f"{node}: section {slug!r} is a home again ({why})")
    return problems


def term_sections(term: str, surfaces: dict[int, str]) -> set[int]:
    pattern = re.compile(r"\b" + re.escape(normalise(term)))
    return {n for n, text in surfaces.items() if pattern.search(text)}


def max_sections_per_term(total: int) -> int:
    """The most sections an accepted term may match, for a course of `total` sections."""
    return total // MAX_SECTION_SHARE_DIVISOR


def term_rejections(lexicon: dict, surfaces: dict[int, str]) -> list[str]:
    total = len(surfaces)
    problems = []
    for node, terms in lexicon["nodes"].items():
        for term in terms:
            if len(term) < MIN_TERM_LENGTH:
                problems.append(f"{node}: term {term!r} is shorter than {MIN_TERM_LENGTH} characters")
            elif len(term_sections(term, surfaces)) > max_sections_per_term(total):
                hits = len(term_sections(term, surfaces))
                problems.append(f"{node}: term {term!r} matches {hits} of {total} sections")
    return problems


def homes(node: str, lexicon: dict, surfaces: dict[int, str]) -> set[int]:
    """The sections that teach a node, through its accepted terms only."""
    found: set[int] = set()
    for term in lexicon["nodes"].get(node, []):
        if len(term) >= MIN_TERM_LENGTH:
            hits = term_sections(term, surfaces)
            if len(hits) <= max_sections_per_term(len(surfaces)):
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


def homeless_nodes(catalog: dict, lexicon: dict, surfaces: dict[int, str]) -> list[str]:
    """The skills a competency badge claims that no section teaches by the lexicon (teaching debt)."""
    claimed = {node for _, node in competency_claims(catalog)}
    return sorted(node for node in claimed if not homes(node, lexicon, surfaces))


def lexicon_gaps(catalog: dict, lexicon: dict) -> list[str]:
    """A competency skill with no entry is teaching debt, not a pass. Listing it is required."""
    entries = lexicon["nodes"]
    claimed = {node for badge, node in competency_claims(catalog)}
    return [f"{node}: claimed by a competency badge but missing from the lexicon" for node in sorted(claimed - set(entries))]


class MeaningMismatchRatchet(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        sections = source_sections()  # reads 52 large files; read-only below
        cls.surfaces = surfaces_of(sections)
        cls.index_of = {s["slug"]: s["index"] for s in sections}

    def setUp(self) -> None:
        self.catalog = load(CATALOG)
        self.lexicon = load(LEXICON)

    def test_the_lexicon_obeys_the_anti_gaming_rules(self) -> None:
        self.assertEqual(term_rejections(self.lexicon, self.surfaces), [])

    def test_every_competency_skill_is_in_the_lexicon(self) -> None:
        self.assertEqual(lexicon_gaps(self.catalog, self.lexicon), [])

    def test_known_false_friends_are_no_home(self) -> None:
        """The review's central finding, as a test: the drafted lexicon homed these skills in sections
        where only the spelling matched. Nothing may bring them back, under any term."""
        self.assertEqual(false_home_violations(self.lexicon, self.surfaces, self.index_of), [])

    def test_a_term_that_brings_a_false_home_back_is_named(self) -> None:
        lexicon = copy.deepcopy(self.lexicon)
        lexicon["nodes"]["git_workflow"].append("commit")
        lexicon["nodes"]["classical_ml"].append("regresion")
        found = false_home_violations(lexicon, self.surfaces, self.index_of)
        self.assertEqual(sorted(p.split(":")[0] for p in found), ["classical_ml", "git_workflow"], found)
        self.assertIn("'mlops' is a home again", " ".join(found))

    def test_a_pin_that_names_no_skill_or_no_section_is_reported_not_passed(self) -> None:
        pins = (("no_such_skill", "basics", "x"), ("git_workflow", "no-such-section", "y"))
        found = false_home_violations(self.lexicon, self.surfaces, self.index_of, pins)
        self.assertEqual(len(found), 2, found)
        self.assertIn("not in the lexicon", found[0])
        self.assertIn("no section has that id", found[1])

    def test_every_false_home_pin_says_why(self) -> None:
        for node, slug, why in FALSE_HOMES:
            with self.subTest(node=node, section=slug):
                self.assertGreaterEqual(len(why.split()), 5, "a reason, not a label")

    def test_the_header_states_the_pins(self) -> None:
        """The header is what the owner reads to learn what is owed. It must say what the constants say."""
        doc = " ".join((__doc__ or "").split())
        self.assertIn(
            f"PINNED NOW: {MISMATCH_PAIRS_OWED} pairs over {MISMATCH_BADGES_OWED} badges; "
            f"{len(NODES_WITHOUT_HOME_OWED)} skills that no section teaches.",
            doc,
        )

    def test_the_lexicon_states_the_rules_this_test_enforces(self) -> None:
        """The thresholds live here, in a protected test. The lexicon repeats them so a reader sees
        what is enforced; it cannot loosen them, and it cannot claim a different rule."""
        rules = self.lexicon["rules"]
        self.assertEqual(rules["min_term_length"], MIN_TERM_LENGTH)
        self.assertEqual(rules["max_section_share_divisor"], MAX_SECTION_SHARE_DIVISOR)

    def test_the_skills_no_section_teaches_are_exactly_the_owed_set(self) -> None:
        """Teaching debt under O18, not mismatches. Pinned both ways, because a node that loses its
        home stops being counted as a mismatch and the owed count falls without a claim being fixed."""
        self.assertEqual(homeless_nodes(self.catalog, self.lexicon, self.surfaces), list(NODES_WITHOUT_HOME_OWED))

    def test_a_skill_that_gains_a_home_must_leave_the_owed_list(self) -> None:
        surfaces = {**self.surfaces, 99: "introduccion a kubernetes en produccion"}
        found = homeless_nodes(self.catalog, self.lexicon, surfaces)
        self.assertNotIn("kubernetes", found)
        self.assertNotEqual(found, list(NODES_WITHOUT_HOME_OWED), "the owed list is exact, so it must shrink with it")

    def test_emptying_a_lexicon_entry_lowers_the_pair_count_but_is_seen(self) -> None:
        """The review's scenario: git_workflow = [] drops 92 pairs to 87 and, before the pin, nothing failed."""
        lexicon = copy.deepcopy(self.lexicon)
        lexicon["nodes"]["git_workflow"] = []
        pairs = mismatch_pairs(self.catalog, lexicon, self.surfaces)
        self.assertLess(len(pairs), MISMATCH_PAIRS_OWED, "the cheap way to lower the owed count")
        self.assertEqual(term_rejections(lexicon, self.surfaces), [], "the term rules do not object")
        self.assertEqual(lexicon_gaps(self.catalog, lexicon), [], "the entry is present, only empty")
        grown = homeless_nodes(self.catalog, lexicon, self.surfaces)
        self.assertEqual(sorted(set(grown) - set(NODES_WITHOUT_HOME_OWED)), ["git_workflow"])

    def test_the_mismatch_count_is_exactly_the_owed_count(self) -> None:
        pairs = mismatch_pairs(self.catalog, self.lexicon, self.surfaces)
        badges = {badge for badge, _ in pairs}
        self.assertEqual(len(pairs), MISMATCH_PAIRS_OWED, f"pairs now: {pairs}")
        self.assertEqual(len(badges), MISMATCH_BADGES_OWED, f"badges now: {sorted(badges)}")

    @staticmethod
    def _course(total: int, matching: int, text: str = "zetaword") -> dict[int, str]:
        """A course of `total` sections, `matching` of which hold `text`."""
        return {n: (f"{text} " if n <= matching else "") for n in range(1, total + 1)}

    def test_the_cap_is_a_third_of_the_sections_rounded_down(self) -> None:
        self.assertEqual([max_sections_per_term(n) for n in (52, 55, 3, 2)], [17, 18, 1, 0])

    def test_a_term_matching_exactly_the_cap_is_kept_and_one_more_is_rejected(self) -> None:
        """Checked at today's 52 sections and at 55, so the cap follows the count (17, then 18)."""
        for total in (52, 55):
            cap = max_sections_per_term(total)
            with self.subTest(total=total, cap=cap):
                at_cap = term_rejections({"nodes": {"n": ["zetaword"]}}, self._course(total, cap))
                self.assertEqual(at_cap, [])
                over = term_rejections({"nodes": {"n": ["zetaword"]}}, self._course(total, cap + 1))
                self.assertTrue(any(f"matches {cap + 1} of {total}" in p for p in over), over)

    def test_a_term_over_the_cap_gives_its_node_no_home(self) -> None:
        lexicon = {"nodes": {"n": ["zetaword"]}}
        for total in (52, 55):
            cap = max_sections_per_term(total)
            with self.subTest(total=total, cap=cap):
                self.assertEqual(len(homes("n", lexicon, self._course(total, cap))), cap)
                self.assertEqual(homes("n", lexicon, self._course(total, cap + 1)), set())

    def test_a_term_of_three_characters_is_rejected_and_four_is_kept(self) -> None:
        surfaces = {n: ("abcd abc" if n == 1 else "") for n in range(1, 53)}
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
