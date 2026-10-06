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

Not covered: industry_alignment/badge_requirements/*.md, a snapshot generated on 2026-07-28 and
read only by its generator, industry_alignment/_phase6_build/build_badge_architecture.py. Re-running
that generator would rewrite the industry copy from its own data; this test then fails, as it should.
"""
from __future__ import annotations

import json
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
LIVE = ROOT / "src/lib/eligibility/badge_catalog.json"
INDUSTRY = ROOT / "industry_alignment/badge_catalog.json"
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


def load(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


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


if __name__ == "__main__":
    unittest.main()
