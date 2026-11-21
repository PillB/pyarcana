#!/usr/bin/env python3
"""A badge's public text names only the work the engine requires for it (proposal 11, §5.1).

The phase 0 claim said "including the You Do project and self-check for each section", and the
journey claim's description said "all 13 capstones". The engine required neither: progress badges
list YOUDO and EXAM, and it never reaches the project gate for them. A learner read the claim and
believed a self-check was checked; a reader of the award believed the capstones were.

Each test here reads the catalog the app serves (src/lib/eligibility/badge_catalog.json):

- every activity type a claim, description or progress component names (You Do, self-check,
  exam, capstone) is required for that badge: listed for every required section in
  required_activities, or, for a capstone, in required_projects;
- every competency or capstone badge with a self_check component lists the self-check of each
  required section (§5.2 item 1), and no progress badge lists a project (§5.2 item 3);
- a pilot badge says so in its name and its claim, and only a pilot badge does;
- the floors the dashboard states are the floors in the catalog.

A sentence that says the badge does NOT check something ("Este marcador no revisa los
capstones") is not a claim that it does, so sentences with a negation are left out of the scan.
That is the trade-off: a positive claim hidden in a negated sentence is not caught.

Run: python3 -m unittest tests.adversarial.test_badge_claims_match_engine
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CATALOG = ROOT / "src/lib/eligibility/badge_catalog.json"
DASHBOARD = ROOT / "src/components/course/Dashboard.tsx"

#: The activity types a learner reads in a claim, in Spanish and English.
NAMED = {
    "YOUDO": re.compile(r"\bYou Do\b"),
    "SELFCHECK": re.compile(r"self-checks?|autoevaluaci[oó]n(es)?|autocheck", re.I),
    "EXAM": re.compile(r"\bexams?\b|\bex[aá]men(es)?\b", re.I),
    "CAPSTONE": re.compile(r"\bcapstones?\b", re.I),
}
NEGATION = re.compile(r"\b(not|NOT|never|no|nunca|ni)\b|todavía no")


def load(path: Path = CATALOG) -> list[dict]:
    return json.loads(path.read_text(encoding="utf-8"))["badges"]


def required_types(badge: dict) -> set[str]:
    acts = set(badge["required_activities"])
    out = {kind for kind in ("YOUDO", "SELFCHECK", "EXAM")
           if all(f"{s}-{kind}" in acts for s in badge["required_sections"])}
    # The engine checks projects only past the progress path (engine.ts finalizeProgress), so a
    # progress badge never requires a capstone, whatever its required_projects says.
    if badge["credential_class"] != "A" and any(p.startswith("CP-") for p in badge["required_projects"]):
        out.add("CAPSTONE")
    return out


def texts(badge: dict) -> list[tuple[str, str]]:
    out = [("public_claim", badge["public_claim"]),
           ("newbie_friendly_description", badge["newbie_friendly_description"])]
    if badge["credential_class"] == "A":
        out += [(f"component {c['component_id']}", c["description"])
                for c in badge["assessment_blueprint"]["components"]]
    return out


def named_types(text: str) -> set[str]:
    found: set[str] = set()
    for sentence in re.split(r"(?<=[.;:])\s+", text):
        if NEGATION.search(sentence):
            continue
        found |= {kind for kind, pattern in NAMED.items() if pattern.search(sentence)}
    return found


def overclaims(badges: list[dict]) -> list[str]:
    problems = []
    for badge in badges:
        required = required_types(badge)
        for field, text in texts(badge):
            extra = named_types(text) - required
            if extra:
                problems.append(f"{badge['badge_id']} {field} names {sorted(extra)}, "
                                f"the engine requires {sorted(required)}")
    return problems


class ClaimsNameOnlyRequiredWork(unittest.TestCase):
    def test_no_text_names_work_the_engine_does_not_require(self) -> None:
        self.assertEqual(overclaims(load()), [])

    def test_the_scan_finds_an_overclaim(self) -> None:
        """The detector itself: the phase 0 claim before proposal 11 named the self-check."""
        old = {"badge_id": "x", "credential_class": "A", "required_sections": ["S01"],
               "required_activities": ["S01-YOUDO", "S01-EXAM"], "required_projects": [],
               "public_claim": "The learner has completed S01, including the You Do project and "
                               "self-check for each section.",
               "newbie_friendly_description": "You walked the whole course: all 13 capstones.",
               "assessment_blueprint": {"components": []}}
        found = overclaims([old])
        self.assertEqual(len(found), 2, found)
        self.assertIn("SELFCHECK", found[0])
        self.assertIn("CAPSTONE", found[1])
        old["newbie_friendly_description"] = "This marker does not check the capstones."
        self.assertEqual(len(overclaims([old])), 1)


class EngineRequirements(unittest.TestCase):
    def test_self_checks_are_required_activities(self) -> None:
        for badge in load():
            components = {c["component_id"] for c in badge["assessment_blueprint"]["components"]}
            if "self_check" not in components:
                continue
            missing = [s for s in badge["required_sections"]
                       if f"{s}-SELFCHECK" not in badge["required_activities"]]
            self.assertEqual(missing, [], badge["badge_id"])

    def test_progress_badges_list_no_project(self) -> None:
        """The engine never reaches the project gate for a progress badge, so a list would be a
        promise nobody checks. The capstone credentials gate on the capstones."""
        for badge in load():
            if badge["credential_class"] == "A":
                self.assertEqual(badge["required_projects"], [], badge["badge_id"])


class PilotStatus(unittest.TestCase):
    def test_a_pilot_badge_says_so_and_only_a_pilot_does(self) -> None:
        for badge in load():
            pilot = badge["status"] == "pilot"
            self.assertEqual(badge["name"].endswith("(piloto)"), pilot, badge["badge_id"])
            self.assertEqual("insignia piloto" in badge["public_claim"], pilot, badge["badge_id"])


class DashboardFloors(unittest.TestCase):
    """The dashboard said 70%; the catalog's floors are 80% and 85%."""

    SPANISH = re.compile(r"(\d+)% en los You Do; (\d+)% en exámenes, autoevaluaciones \(Autocheck\) e integrador")
    ENGLISH = re.compile(r"(\d+)% in the You Do projects; (\d+)% in exams, self-checks \(Autocheck\) and the integrator project")

    def test_the_stated_floors_are_the_catalog_floors(self) -> None:
        source = DASHBOARD.read_text(encoding="utf-8")
        floors: dict[str, set[int]] = {}
        for badge in load():
            for comp in badge["assessment_blueprint"]["components"]:
                floors.setdefault(comp["component_id"], set()).add(comp["required_score_pct"])
        self.assertEqual(floors["you_do_projects"], {80})
        others = floors["self_check"] | floors["section_exams"] | floors["integrator_project"]
        self.assertEqual(len(others), 1, others)
        for pattern in (self.SPANISH, self.ENGLISH):
            match = pattern.search(source)
            self.assertIsNotNone(match, pattern.pattern)
            you_do, rest = (int(x) for x in match.groups())
            self.assertEqual({you_do}, floors["you_do_projects"])
            self.assertEqual({rest}, others)
        self.assertNotIn("70% o más", source.split("badge-explainer-title")[1])


if __name__ == "__main__":
    unittest.main()
