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

`--record` is not a way around the rule. It reads the previous records and refuses (exit 1, writes
nothing) to store a changed digest for a badge whose version is not above the recorded one, and to
forget a badge that left the catalog (retire it with `status`). Digests made under another
DIGEST_SCHEMA are not comparable, so recording over them is a re-baseline; that is the only way a
digest changes at the same version, and raising the schema is a visible edit to this protected file.
Editing claim_digests.json by hand also bypasses it, in a diff the owner sees; CODEOWNERS coverage of
that file is design step 0b-2.

Owner rule: changing what a credential claims needs the owner's approval (AGENTS.md, Ask first).
This test does not approve anything; it makes an unapproved change visible.
"""
from __future__ import annotations

import contextlib
import copy
import hashlib
import io
import json
import re
import sys
import tempfile
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


#: The version of the method that makes a digest. Digests of another schema are not comparable, so
#: recording over them is a re-baseline (refusals() allows it). Raise it when CLAIM_PATHS or the
#: payload changes; that edit is itself a visible change to a protected test file.
DIGEST_SCHEMA = 1
SEMVER = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")


def version_key(version: object) -> tuple[int, int, int] | None:
    """`1.2.0` to (1, 2, 0); None for anything that is not MAJOR.MINOR.PATCH (fail closed)."""
    match = SEMVER.match(version) if isinstance(version, str) else None
    return tuple(int(part) for part in match.groups()) if match else None


def _refusal(badge_id: str, badge: dict, was: dict | None) -> list[str]:
    """Why one badge's recorded digest may not be replaced by its live one."""
    if was is None or was["sha256"] == claim_digest(badge):
        return []
    now, then = version_key(badge["version"]), version_key(was["version"])
    if now is not None and then is not None and now > then:
        return []
    return [
        f"{badge_id}: claim changed and version {badge['version']} is not above the recorded "
        f"{was['version']}; bump the version first"
    ]


def refusals(catalog: dict, previous: dict) -> list[str]:
    """Why `previous` may not be replaced by a record of `catalog`. Empty means it may.

    A digest exists so that a claim cannot change under the same version. Recording over a changed
    digest without a higher version would undo that, so it is refused; so is forgetting a badge,
    which would delete a credential from the record (retire it with `status` instead).
    """
    if previous.get("schema") != DIGEST_SCHEMA:
        return []
    old = previous["records"]
    live = {b["badge_id"]: b for b in catalog["badges"]}
    gone = [
        f"{badge_id}: is recorded but gone from the catalog; retire it with status, do not remove it"
        for badge_id in sorted(set(old) - set(live))
    ]
    return gone + [p for badge_id, badge in live.items() for p in _refusal(badge_id, badge, old.get(badge_id))]


def record(catalog: dict) -> dict:
    return {
        "schema": DIGEST_SCHEMA,
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


class RecordRefusal(unittest.TestCase):
    """`--record` re-baselines the digests. It must not be how a claim edit turns green."""

    def setUp(self) -> None:
        self.catalog = json.loads(LIVE.read_text(encoding="utf-8"))
        self.previous = record(self.catalog)

    def _edited(self, version: str | None = None, badge_id: str = "progress_phase0_walked") -> dict:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == badge_id)
        badge["public_claim"] += " (changed)"
        if version is not None:
            badge["version"] = version
        return catalog

    def test_a_changed_claim_at_the_same_version_may_not_be_recorded(self) -> None:
        self.assertEqual(
            refusals(self._edited(), self.previous),
            ["progress_phase0_walked: claim changed and version 1.0.0 is not above the recorded 1.0.0; bump the version first"],
        )

    def test_a_changed_claim_under_a_higher_version_may_be_recorded(self) -> None:
        for version in ("1.0.1", "1.1.0", "2.0.0", "1.0.10"):
            with self.subTest(version=version):
                self.assertEqual(refusals(self._edited(version), self.previous), [])

    def test_a_lower_or_unreadable_version_may_not_be_recorded(self) -> None:
        for version in ("0.9.0", "1.0.0-rc1", "v2", ""):
            with self.subTest(version=version):
                problems = refusals(self._edited(version), self.previous)
                self.assertEqual(len(problems), 1, problems)
                self.assertIn("not above the recorded 1.0.0", problems[0])

    def test_a_badge_that_left_the_catalog_may_not_be_forgotten(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        catalog["badges"] = [b for b in catalog["badges"] if b["badge_id"] != "progress_phase0_walked"]
        self.assertEqual(
            refusals(catalog, self.previous),
            ["progress_phase0_walked: is recorded but gone from the catalog; retire it with status, do not remove it"],
        )

    def test_a_new_badge_and_an_unchanged_catalog_may_be_recorded(self) -> None:
        self.assertEqual(refusals(self.catalog, self.previous), [])
        previous = copy.deepcopy(self.previous)
        del previous["records"]["progress_phase0_walked"]
        self.assertEqual(refusals(self.catalog, previous), [])

    def test_digests_of_another_schema_are_not_comparable_so_recording_is_a_rebaseline(self) -> None:
        previous = copy.deepcopy(self.previous)
        previous["schema"] = DIGEST_SCHEMA - 1
        previous["records"]["progress_phase0_walked"]["sha256"] = "0" * 64
        self.assertEqual(refusals(self.catalog, previous), [])
        previous["schema"] = DIGEST_SCHEMA
        self.assertEqual(len(refusals(self.catalog, previous)), 1)

    def _run(self, catalog: dict) -> tuple[int, bytes, dict]:
        """`--record` over a temporary catalog, with the previous records on disk; nothing real is written."""
        with tempfile.TemporaryDirectory() as tmp:
            live, records = Path(tmp) / "catalog.json", Path(tmp) / "records.json"
            live.write_text(json.dumps(catalog), encoding="utf-8")
            records.write_text(json.dumps(self.previous), encoding="utf-8")
            before = records.read_bytes()
            with contextlib.redirect_stdout(io.StringIO()), contextlib.redirect_stderr(io.StringIO()):
                code = run_record(live, records)
            after = json.loads(records.read_text(encoding="utf-8"))
            return code, records.read_bytes() == before, after

    def test_edit_then_record_stays_red_and_writes_nothing(self) -> None:
        """The review's scenario: a claim edit, no bump, `--record`, re-run. It used to end green."""
        edited = self._edited()
        self.assertNotEqual(digest_violations(edited, self.previous["records"]), [], "red before --record")
        code, untouched, after = self._run(edited)
        self.assertNotEqual(code, 0)
        self.assertTrue(untouched, "a refused --record leaves the records as they were")
        self.assertNotEqual(digest_violations(edited, after["records"]), [], "still red after --record")

    def test_edit_with_a_bump_then_record_ends_green(self) -> None:
        edited = self._edited("1.0.1")
        code, untouched, after = self._run(edited)
        self.assertEqual(code, 0)
        self.assertFalse(untouched)
        self.assertEqual(digest_violations(edited, after["records"]), [])
        self.assertEqual(after["records"]["progress_phase0_walked"]["version"], "1.0.1")


def run_record(live: Path = LIVE, records: Path = RECORDS) -> int:
    """`--record`: write the digests of `live` to `records`, unless that would hide a claim change.

    Returns the process exit code. A refusal prints each reason on stderr and writes nothing.
    """
    catalog = json.loads(live.read_text(encoding="utf-8"))
    previous = json.loads(records.read_text(encoding="utf-8")) if records.exists() else None
    problems = refusals(catalog, previous) if previous is not None else []
    if problems:
        print("\n".join(["refused: the records are unchanged"] + problems), file=sys.stderr)
        return 1
    records.write_text(json.dumps(record(catalog), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"recorded {len(catalog['badges'])} digests in {records}")
    return 0


if __name__ == "__main__":
    if "--record" in sys.argv:
        sys.exit(run_record())
    unittest.main()
