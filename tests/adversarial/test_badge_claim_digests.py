#!/usr/bin/env python3
"""A badge's claim cannot change without its version changing with it (C12e).

Each competency and capstone badge's claim is the 13 fields test_badge_catalog_copies.py repeats
into its contracts (SHARED: the credential id, version, public name, capability statement, class,
status, verification mode, prerequisites, critical gates, required sections and activities, and the
scoring floor and non-compensatory rule). The digest is the sha256 of those fields, as sorted JSON,
recorded per badge with the version it was recorded under.

A changed digest with an unchanged version is red: "claim changed without a version bump". A changed
digest with a new version is red until the digest is re-recorded, so the record never goes stale.
Fields outside SHARED (for example the newbie-friendly description) are not claims under this rule
and may change freely.

Re-record after an approved claim change, with the version bumped in the same change:
  python3 tests/adversarial/test_badge_claim_digests.py --record

Owner rule: changing what a credential claims needs the owner's approval (AGENTS.md, Ask first).
This test does not approve anything; it makes an unapproved change visible.
"""
from __future__ import annotations

import copy
import hashlib
import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tests/adversarial"))

from test_badge_catalog_copies import SHARED, at  # noqa: E402

LIVE = ROOT / "src/lib/eligibility/badge_catalog.json"
RECORDS = ROOT / "src/lib/eligibility/claim_digests.json"
CLAIM_PATHS = [path for _, path in SHARED]


def claim_digest(badge: dict) -> str:
    payload = {path: at(badge, path) for path in CLAIM_PATHS}
    text = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def digest_violations(catalog: dict, records: dict) -> list[str]:
    live = {b["badge_id"]: b for b in catalog["badges"]}
    problems = [f"{bid}: has a recorded digest but is not in the catalog" for bid in sorted(set(records) - set(live))]
    for badge_id, badge in live.items():
        record = records.get(badge_id)
        if record is None:
            problems.append(f"{badge_id}: has no recorded digest")
        elif record["sha256"] != claim_digest(badge):
            if record["version"] == badge["version"]:
                problems.append(f"{badge_id}: claim changed without a version bump (version {badge['version']})")
            else:
                problems.append(f"{badge_id}: claim changed under version {badge['version']}; re-record the digest")
    return problems


def record(catalog: dict) -> dict:
    return {
        "schema": 1,
        "method": "sha256 of the UTF-8 JSON of {catalog path: value} for the fields below, keys sorted, separators ',' and ':', ensure_ascii False",
        "fields": CLAIM_PATHS,
        "records": {b["badge_id"]: {"version": b["version"], "sha256": claim_digest(b)} for b in catalog["badges"]},
    }


class ClaimDigests(unittest.TestCase):
    def setUp(self) -> None:
        self.catalog = json.loads(LIVE.read_text(encoding="utf-8"))
        self.records = json.loads(RECORDS.read_text(encoding="utf-8"))

    def _badge(self, catalog: dict, badge_id: str = "progress_phase0_walked") -> dict:
        return next(b for b in catalog["badges"] if b["badge_id"] == badge_id)

    def test_every_claim_matches_its_recorded_digest_and_the_recorded_fields_are_shared(self) -> None:
        self.assertEqual(self.records["fields"], CLAIM_PATHS, "re-record: the shared fields changed")
        self.assertEqual(digest_violations(self.catalog, self.records["records"]), [])

    def test_a_claim_change_without_a_version_bump_is_red(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["public_claim"] += " (changed)"
        self.assertEqual(
            digest_violations(catalog, self.records["records"]),
            ["progress_phase0_walked: claim changed without a version bump (version 1.0.0)"],
        )

    def test_a_claim_change_with_a_version_bump_is_red_until_recorded(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = self._badge(catalog)
        badge["public_claim"] += " (changed)"
        badge["version"] = "1.0.1"
        problems = digest_violations(catalog, self.records["records"])
        self.assertEqual(problems, ["progress_phase0_walked: claim changed under version 1.0.1; re-record the digest"])

    def test_a_change_outside_the_shared_fields_is_not_a_claim_change(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["newbie_friendly_description"] += " (wording only)"
        self.assertEqual(digest_violations(catalog, self.records["records"]), [])

    def test_a_badge_with_no_recorded_digest_is_red(self) -> None:
        records = copy.deepcopy(self.records["records"])
        del records["progress_phase0_walked"]
        self.assertEqual(digest_violations(self.catalog, records), ["progress_phase0_walked: has no recorded digest"])

    def test_a_record_for_a_badge_that_is_gone_is_red(self) -> None:
        records = copy.deepcopy(self.records["records"])
        records["retired_badge"] = {"version": "1.0.0", "sha256": "0" * 64}
        self.assertEqual(
            digest_violations(self.catalog, records),
            ["retired_badge: has a recorded digest but is not in the catalog"],
        )


if __name__ == "__main__":
    if "--record" in sys.argv:
        catalog = json.loads(LIVE.read_text(encoding="utf-8"))
        RECORDS.write_text(json.dumps(record(catalog), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"recorded {len(catalog['badges'])} digests in {RECORDS.relative_to(ROOT)}")
    else:
        unittest.main()
