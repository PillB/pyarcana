#!/usr/bin/env python3
"""A badge names the section it claims, through a manifest that says which section that is.

Design step 0b-4 (audit/fixer/renumber_g0/design_ruled_final.md §4.1 and §4.3, guard G-3a). The
renumber rewrites every section token, so identity has to be checked before it moves. G-3a fails
on three things:

- a catalog token (`S13`, `S13-YOUDO`) that does not resolve through
  src/lib/eligibility/section_manifest.json to a section that exists in the course source under
  that slug;
- a positional badge (a progress marker, the journey, a level capstone) whose required_sections
  are not its span, derived from the sections' `phase`; the final section is outside phase 3;
- a skill node claimed while its role is unbound, or bound to a section the manifest lacks.

The roles stay unbound (section_index null) until Gate B binds them at the renumber, so today no
badge may claim the nodes under them. Expert standard: the Phase 6 badge architecture (catalog
spec, §Identity) and the constructive-alignment rule that a credential's evidence must come from
the section that teaches it (Biggs and Tang, Teaching for Quality Learning at University).
"""
from __future__ import annotations

import copy
import hashlib
import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "src/lib/eligibility/section_manifest.json"
CATALOG = ROOT / "src/lib/eligibility/badge_catalog.json"
COURSE_INDEX = ROOT / "src/lib/course/index.ts"
SECTIONS_DIR = ROOT / "src/lib/course/sections"

TOKEN = re.compile(r"^S(\d{2})(?:-[A-Z]+)?$")
QUOTED = r"""['"]((?:[^'"\\]|\\.)*)['"]"""


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def _field(head: str, name: str, value: str) -> str | None:
    match = re.search(rf"^\s+{name}:\s*{value}", head, re.M)
    return match.group(1) if match else None


def source_sections(course_index: Path = COURSE_INDEX, sections_dir: Path = SECTIONS_DIR) -> list[dict]:
    """The active sections, in COURSE_SECTIONS order, read from their own source files."""
    text = course_index.read_text(encoding="utf-8")
    block = re.search(r"export const COURSE_SECTIONS[^=]*=\s*\[(.*?)\n\]", text, re.S).group(1)
    imports = dict(re.findall(r"import \{ (section\d\d) \} from '\./sections/([^']+)'", text))
    out = []
    for position, var in enumerate(re.findall(r"\b(section\d\d)\b", block), start=1):
        path = sections_dir / (imports[var] + ".ts")
        head = "\n".join(path.read_text(encoding="utf-8").splitlines()[:60])
        out.append({
            "position": position,
            "index": int(_field(head, "index", r"(\d+)")),
            "slug": _field(head, "id", QUOTED),
            "phase": int(_field(head, "phase", r"(\d)")),
            "title": _field(head, "title", QUOTED),
        })
    return out


def token_number(token: str) -> int | None:
    match = TOKEN.match(token)
    return int(match.group(1)) if match else None


def span_for(rule: dict, sections: list[dict]) -> list[int]:
    """The section numbers a positional badge must require, derived from `phase`."""
    if rule.get("all_sections"):
        return [s["index"] for s in sections]
    last = max(s["index"] for s in sections)
    members = [s["index"] for s in sections if s["phase"] == rule["phase"]]
    if rule.get("drop_final"):
        members = [n for n in members if n != last]
    return members


def _token_violations(manifest: dict, catalog: dict) -> list[str]:
    by_index = {s["index"]: s for s in manifest["sections"]}
    problems = []
    for badge in catalog["badges"]:
        tokens = list(badge.get("required_sections", [])) + list(badge.get("required_activities", []))
        for token in tokens:
            number = token_number(token)
            section = by_index.get(number) if number is not None else None
            if section is None or not section["slug"]:
                problems.append(f"{badge['badge_id']}: token {token} does not resolve to a manifest slug")
    return problems


def _span_violations(manifest: dict, catalog: dict) -> list[str]:
    badges = {b["badge_id"]: b for b in catalog["badges"]}
    problems = []
    for badge_id, badge in badges.items():
        if badge["credential_type"] == "local_achievement" and badge_id not in manifest["positional_badges"]:
            problems.append(f"{badge_id}: progress marker has no positional rule in the manifest")
    for badge_id, rule in manifest["positional_badges"].items():
        if badge_id not in badges:
            problems.append(f"{badge_id}: positional rule names a badge the catalog lacks")
            continue
        expected = [f"S{n:02d}" for n in span_for(rule, manifest["sections"])]
        if badges[badge_id].get("required_sections", []) != expected:
            problems.append(f"{badge_id}: required_sections are not its span {expected[0]}..{expected[-1]}")
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


def cited_numbers(badge: dict) -> set[int]:
    tokens = list(badge.get("required_sections", [])) + list(badge.get("required_activities", []))
    return {n for n in (token_number(t) for t in tokens) if n is not None}


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

    def test_the_manifest_is_the_course_source(self) -> None:
        source = source_sections()
        self.assertEqual(len(source), 52, "the course has 52 active sections")
        expected = [(s["index"], s["slug"], s["phase"], s["title"]) for s in source]
        actual = [(s["index"], s["slug"], s["phase"], s["title"]) for s in self.manifest["sections"]]
        self.assertEqual(actual, expected, "manifest drifted from src/lib/course/index.ts")

    def test_every_catalog_token_resolves_and_every_span_matches(self) -> None:
        self.assertEqual(identity_violations(self.manifest, self.catalog), [])

    def test_a_token_that_resolves_to_no_section_is_red(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "progress_phase0_walked")
        badge["required_sections"].append("S53")
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(any("progress_phase0_walked" in p and "S53" in p for p in problems), problems)

    def test_a_positional_badge_off_its_span_is_red(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "progress_journey_completed")
        badge["required_sections"].remove("S52")
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(any("progress_journey_completed" in p and "span" in p for p in problems), problems)

    def test_a_progress_marker_without_a_positional_rule_is_red(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        del manifest["positional_badges"]["progress_phase2_walked"]
        problems = identity_violations(manifest, self.catalog)
        self.assertTrue(any("progress_phase2_walked" in p and "positional rule" in p for p in problems), problems)

    def test_a_node_claimed_while_its_role_is_unbound_is_red(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
        badge["skill_nodes"].append("hypothesis_testing")
        problems = identity_violations(self.manifest, catalog)
        self.assertTrue(any("python_data_foundations" in p and "unbound" in p for p in problems), problems)

    def test_a_bound_role_with_no_manifest_slug_is_red(self) -> None:
        manifest = copy.deepcopy(self.manifest)
        manifest["roles"]["design"]["section_index"] = 99
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == "python_data_foundations")
        badge["skill_nodes"].append("experimental_design")
        problems = identity_violations(manifest, catalog)
        self.assertTrue(any("no manifest slug" in p for p in problems), problems)


class SectionTitleFingerprints(unittest.TestCase):
    def setUp(self) -> None:
        self.manifest = load(MANIFEST)
        self.catalog = load(CATALOG)
        self.sections = source_sections()

    def test_every_live_title_matches_its_fingerprint(self) -> None:
        self.assertEqual(title_violations(self.manifest, self.sections, self.catalog), [])

    def test_retitling_a_section_a_badge_cites_names_those_badges(self) -> None:
        sections = copy.deepcopy(self.sections)
        next(s for s in sections if s["index"] == 34)["title"] = "retitled for the fixture"
        problems = title_violations(self.manifest, sections, self.catalog)
        named = {p.split(":", 1)[0] for p in problems}
        self.assertIn("applied_deep_learning_practice", named, problems)
        self.assertIn("integrated_python_ai_capstone_advanced_applied", named, problems)
        self.assertNotIn("python_data_foundations", named, "a badge that does not cite S34 is not named")
        self.assertTrue(all("S34" in p for p in problems), problems)

    def test_a_section_with_no_title_is_drift_not_a_pass(self) -> None:
        sections = copy.deepcopy(self.sections)
        next(s for s in sections if s["index"] == 5)["title"] = None
        problems = title_violations(self.manifest, sections, self.catalog)
        self.assertTrue(any("S05" in p for p in problems), problems)


if __name__ == "__main__":
    unittest.main()
