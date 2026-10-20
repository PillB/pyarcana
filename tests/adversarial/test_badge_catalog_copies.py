#!/usr/bin/env python3
"""Every copy of a badge's requirements says what the live catalog says.

The live catalog is src/lib/eligibility/badge_catalog.json: the app, credential-gates.ts and the
readiness audit read it. Two other copies existed, and nothing compared them with it:

- industry_alignment/badge_catalog.json, which the eligibility engine's executable specification
  read. It had drifted on eight fields across all 31 badges (non_claims 31, credential_class 31,
  public_claim 26, name 5, version 5, verification_mode 5, required_* 1), still said version 1.0.0
  in places, and both copies carried the same top-level version, so no field could detect it.
- src/lib/eligibility/claim_evidence_contracts/*.json, the published claim per badge. On
  2026-09-16 the catalog dropped S52 from progress_phase3_walked (S52 belongs to CP-FINAL, a later
  credential); the contract kept requiring S52, S52-YOUDO and S52-EXAM at the same version, 1.1.0.

Owner decision O17 (Gate A): the industry copy is synced to the live one. This test keeps them so.
The renumber will rewrite every section token in these files, which is exactly when a copy that
nobody compares goes stale again.

The fourth copy, industry_alignment/badge_requirements/*.md, was a 2026-07-28 snapshot from the
generator's own data, and it drifted (C12d). It is now rendered from the live catalog by
industry_alignment/_phase6_build/regenerate_requirements.py, which applies the generator's own
requirement_markdown(), and this test compares every file with that render. Re-running the
generator's main() would still rewrite the industry catalog from its own data; this test then fails,
as it should. Regenerate the markdown with regenerate_requirements.py, never by hand.

The catalog also states each provisional floor twice, in the same file. `provisional_floors` at its top
holds the numbers (CREDENTIAL_EXAM_FLOOR in src/lib/credential-gates.ts reads section_exam_pct from there,
and the issue route prints it to the learner), and every scored badge repeats them as the
required_score_pct of its components and as two scoring rules. They are digested apart
(test_badge_claim_digests.py), and nothing compared them: a floor changed with a catalog version bump left
26 digested badge claims stating the old number until each badge was bumped too. CatalogFloors compares
them (owner answer on r4, 2026-10-14).
"""
from __future__ import annotations

import copy
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIVE = ROOT / "src/lib/eligibility/badge_catalog.json"
INDUSTRY = ROOT / "industry_alignment/badge_catalog.json"
REQUIREMENTS = ROOT / "industry_alignment/badge_requirements"
CONTRACTS = ROOT / "src/lib/eligibility/claim_evidence_contracts"
#: Every field a contract repeats from its catalog entry, as (contract field, catalog path). The
#: claim text matters most: rewriting `public_claim` and missing `capability_statement` would
#: publish one claim while the catalog states another (Codex review on #82).
SHARED = (
    ("credential_id", "badge_id"),
    ("version", "version"),
    ("public_name", "name"),
    ("capability_statement", "public_claim"),
    ("credential_class", "credential_class"),
    ("status", "status"),
    ("verification_mode", "verification_mode"),
    ("prerequisites", "prerequisite_badges"),
    ("critical_gates", "critical_competencies"),
    ("required_sections", "required_sections"),
    ("required_activities", "required_activities"),
    ("minimum_overall_score", "scoring_rules.minimum_overall_score"),
    ("non_compensatory", "scoring_rules.non_compensatory"),
)
#: The catalog held 31 badges when this test was written. A floor, so losing a badge fails while
#: adding one, to both copies and with its contract, does not (Codex review on #82).
MIN_BADGES = 31
#: Where a scored badge states each provisional floor again: the required_score_pct of the component of that
#: name, or a scoring rule. A critical component (`defense`, in the capstones) states the critical floor.
COMPONENT_FLOORS = {
    "self_check": "self_check_pct",
    "you_do_projects": "you_do_pct",
    "section_exams": "section_exam_pct",
    "integrator_project": "integrator_project_pct",
}
RULE_FLOORS = {
    "minimum_overall_score": "minimum_overall_pct",
    "critical_competency_floor": "critical_competency_pct",
}
CRITICAL_FLOOR = "critical_competency_pct"
#: Progress badges are walk-through markers; their own blueprint says they "do NOT use the provisional
#: floors" (they state 0), so they are the one family the comparison leaves out. The exemption is kept
#: (O27 102-S2), and progress_floor_violations() holds the condition it rests on: every floor a progress
#: badge states is 0.
FLOORLESS_FAMILIES = {"progress_achievement"}
#: The catalog held 26 scored badges when this test was written. A floor, like MIN_BADGES: relabelling
#: scored badges as progress badges would otherwise empty the comparison and pass it.
MIN_SCORED_BADGES = 26


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def scored_badges(catalog: dict) -> list[dict]:
    return [badge for badge in catalog["badges"] if badge["family"] not in FLOORLESS_FAMILIES]


def floor_statements(badge: dict) -> list[tuple[str, str, object]]:
    """(floor, where, number) for each provisional floor this badge states again."""
    found = []
    for component in badge["assessment_blueprint"]["components"]:
        floor = COMPONENT_FLOORS.get(component["component_id"])
        floor = floor or (CRITICAL_FLOOR if component.get("critical_competency") else None)
        if floor:
            found.append((floor, f"component {component['component_id']}", component["required_score_pct"]))
    for rule, floor in RULE_FLOORS.items():
        if rule in badge["scoring_rules"]:
            found.append((floor, f"scoring_rules.{rule}", badge["scoring_rules"][rule]))
    return found


def floor_mismatches(catalog: dict) -> list[str]:
    """Every place a scored badge states a number other than the catalog's floor of that name."""
    floors = catalog["provisional_floors"]
    return [
        f"{badge['badge_id']}: {where} is {stated}, provisional_floors.{floor} is {floors.get(floor)}"
        for badge in scored_badges(catalog)
        for floor, where, stated in floor_statements(badge)
        if stated != floors.get(floor)
    ]


def progress_floor_violations(catalog: dict) -> list[str]:
    """Every floor a progress badge states as anything but 0. The family exemption in floor_mismatches
    rests on this: a progress badge that states 85 is a scored badge under another family name
    (owner decision O27 102-S2)."""
    return [
        f"{badge['badge_id']}: {where} is {stated}, not 0"
        for badge in catalog["badges"] if badge["family"] in FLOORLESS_FAMILIES
        for _, where, stated in floor_statements(badge)
        if stated != 0
    ]


def at(entry: dict, path: str):
    for key in path.split("."):
        entry = entry.get(key) if isinstance(entry, dict) else None
    return entry


class CatalogCopies(unittest.TestCase):
    def test_the_industry_copy_is_the_live_catalog(self) -> None:
        live, industry = load(LIVE), load(INDUSTRY)
        self.assertGreaterEqual(len(live["badges"]), MIN_BADGES)
        for key in sorted(set(live) | set(industry)):
            if key != "badges":
                self.assertEqual(industry.get(key), live.get(key), f"top-level {key}")
        by_id = {b["badge_id"]: b for b in industry["badges"]}
        self.assertEqual(sorted(by_id), sorted(b["badge_id"] for b in live["badges"]))
        for badge in live["badges"]:
            other = by_id[badge["badge_id"]]
            drift = sorted(f for f in set(badge) | set(other) if badge.get(f) != other.get(f))
            self.assertEqual(drift, [], f"{badge['badge_id']}: industry copy differs on {drift}")

    def test_every_contract_repeats_its_catalog_entry(self) -> None:
        catalog = {b["badge_id"]: b for b in load(LIVE)["badges"]}
        contracts = sorted(CONTRACTS.glob("*.json"))
        self.assertEqual(sorted(p.stem for p in contracts), sorted(catalog))
        for path in contracts:
            contract, badge = load(path), catalog[path.stem]
            for contract_field, catalog_path in SHARED:
                self.assertIn(contract_field, contract, f"{path.name} lacks {contract_field}")
                self.assertEqual(contract[contract_field], at(badge, catalog_path),
                                 f"{path.name}: {contract_field} disagrees with {catalog_path}")
            self.assertEqual(contract.get("specification_hash"),
                             f"sha256:{badge['badge_id']}:{badge['version']}",
                             f"{path.name}: specification_hash names another version")

    def test_the_requirements_copy_is_the_live_catalog(self) -> None:
        sys.path.insert(0, str(ROOT / "industry_alignment/_phase6_build"))
        import regenerate_requirements  # noqa: E402  (the generator's renderer, applied to the live badges)

        rendered = regenerate_requirements.render_all(load(LIVE))
        self.assertEqual(regenerate_requirements.drift(rendered, REQUIREMENTS), [])


class CatalogFloors(unittest.TestCase):
    """The floors at the top of the catalog are the numbers its scored badges state."""

    #: Each floor, with the places a scored badge states it. Written out here, apart from the mapping the
    #: comparison uses, so a mapping that swaps two floors with the same value (three are 85) is seen.
    STATED_BY = {
        "self_check_pct": {"component self_check"},
        "you_do_pct": {"component you_do_projects"},
        "section_exam_pct": {"component section_exams"},
        "integrator_project_pct": {"component integrator_project"},
        "critical_competency_pct": {"scoring_rules.critical_competency_floor", "component defense"},
        "minimum_overall_pct": {"scoring_rules.minimum_overall_score"},
    }

    def setUp(self) -> None:
        self.catalog = load(LIVE)

    def test_the_catalog_floors_are_what_every_scored_badge_states(self) -> None:
        """CREDENTIAL_EXAM_FLOOR is provisional_floors.section_exam_pct; each scored badge says the same
        number as the required_score_pct of its section_exams. Two sources of one number, never compared."""
        self.assertEqual(floor_mismatches(self.catalog), [])
        scored = scored_badges(self.catalog)
        self.assertGreaterEqual(len(scored), MIN_SCORED_BADGES)
        stated = {floor for badge in scored for floor, _, _ in floor_statements(badge)}
        self.assertEqual(stated, set(self.catalog["provisional_floors"]), "a floor no badge states, or one this test does not know")

    def test_each_floor_is_compared_with_the_places_that_state_it(self) -> None:
        """Change one floor and exactly its own statements are named, in every scored badge."""
        self.assertEqual(set(self.STATED_BY), set(self.catalog["provisional_floors"]))
        for floor, places in self.STATED_BY.items():
            with self.subTest(floor=floor):
                catalog = copy.deepcopy(self.catalog)
                catalog["provisional_floors"][floor] += 1
                problems = floor_mismatches(catalog)
                named = {problem.split(": ", 1)[1].split(" is ", 1)[0] for problem in problems}
                self.assertEqual(named, places)
                self.assertGreaterEqual(len(problems), MIN_SCORED_BADGES)
                self.assertTrue(all(f"provisional_floors.{floor} is {catalog['provisional_floors'][floor]}" in p for p in problems))

    def test_a_badge_that_states_a_different_number_is_named_whether_it_is_lower_or_higher(self) -> None:
        for stated in (80, 90):
            with self.subTest(stated=stated):
                catalog = copy.deepcopy(self.catalog)
                badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
                exam = next(c for c in badge["assessment_blueprint"]["components"] if c["component_id"] == "section_exams")
                exam["required_score_pct"] = stated
                self.assertEqual(
                    floor_mismatches(catalog),
                    [f"python_data_foundations: component section_exams is {stated}, provisional_floors.section_exam_pct is 85"],
                )

    def test_every_progress_badge_states_zero_wherever_it_states_a_floor(self) -> None:
        """The family exemption leaves progress badges out of the comparison, so they must state 0 for
        every floor they state; this is what the exemption rests on (O27 102-S2)."""
        self.assertEqual(progress_floor_violations(self.catalog), [])

    def test_a_scored_badge_relabelled_as_progress_is_named_even_when_a_scored_badge_is_added(self) -> None:
        """The relabel alone is caught by the count of scored badges. Adding a scored badge in the same
        change keeps that count at 26, and only this check then names the relabelled badge's 85s."""
        catalog = copy.deepcopy(self.catalog)
        relabelled = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
        relabelled["family"] = "progress_achievement"
        twin = {**copy.deepcopy(relabelled), "badge_id": "python_data_foundations_twin", "family": "applied_skill"}
        catalog["badges"].append(twin)
        self.assertEqual(len(scored_badges(catalog)), len(scored_badges(self.catalog)), "the count still passes")
        self.assertEqual(floor_mismatches(catalog), [], "the comparison still passes, because the badge left it")
        problems = progress_floor_violations(catalog)
        self.assertIn("python_data_foundations: component section_exams is 85, not 0", problems)
        self.assertTrue(all(p.startswith("python_data_foundations: ") for p in problems), problems)


if __name__ == "__main__":
    unittest.main()
