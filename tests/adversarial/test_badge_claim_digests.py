#!/usr/bin/env python3
"""A badge's claim cannot change without its version changing with it (C12e).

A badge's claim is the 13 fields test_badge_catalog_copies.py repeats into its contracts (SHARED:
the credential id, version, public name, capability statement, class, status, verification mode,
prerequisites, critical gates, required sections and activities, and the scoring floor and
non-compensatory rule) plus five the contracts do not repeat: non_claims, skill_nodes,
required_projects, newbie_friendly_description and credential_type (ADDED_PATHS; the review of the
first draft changed each of them under an unchanged version without a failure). The digest is the
sha256 of those fields, as sorted JSON, recorded per badge with the version it was recorded under.

required_sections and required_activities enter the digest as the manifest slugs their S-tags
resolve to (`S08` as the slug, `S08-YOUDO` as `slug:YOUDO`), not as S-numbers. The renumber moves
26 of the 31 badges' tags (every badge that cites a section past S18); a digest over the numbers
would change for all of them and could not tell that from a claim edit. Over slugs a renumber that
moves a section and its tags together leaves every digest alone, and a tag moved to another section,
or a tag that resolves to nothing, changes the digest.

A changed digest with an unchanged version is red: "claim changed without a version bump". A changed
digest with a new version is red until the digest is re-recorded, so the record never goes stale.

LIMITATION: every other field is declared in NOT_DIGESTED with a reason and may change freely under
this rule: the assessment blueprint, the rest of the scoring rules, the retake, evidence, expiration,
revocation and legacy-progress policies, and four labels. Whether any of them should be guarded is an
owner question. A field in neither list fails unclassified_fields(), so a new catalog field cannot
go unguarded without a decision, and a declaration for a field that no badge has is stale.

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

from badge_sources import MANIFEST, TOKEN, load, section_slugs  # noqa: E402
from test_badge_catalog_copies import SHARED, at  # noqa: E402

LIVE = ROOT / "src/lib/eligibility/badge_catalog.json"
RECORDS = ROOT / "src/lib/eligibility/claim_digests.json"
#: The two lists of S-number tags. The digest hashes them as slugs, so a renumber that moves a
#: section and its tags together leaves the digest alone, and a retarget does not.
TAG_FIELDS = ("required_sections", "required_activities")
SHARED_PATHS = [path for _, path in SHARED]
#: Fields the contracts do not repeat, but which say what the credential claims or what earns it.
#: The review of the first draft showed each of them could change under an unchanged version:
#: skill_nodes (decision 7 and Gate C add nodes to badges), non_claims, required_projects, and
#: newbie_friendly_description (design 4.4 reads it as claim text for the teaching-debt patterns).
#: credential_type is the field the eligibility engine branches on (types.ts CredentialType).
ADDED_PATHS = ["non_claims", "skill_nodes", "required_projects", "newbie_friendly_description", "credential_type"]
CLAIM_PATHS = SHARED_PATHS + ADDED_PATHS
#: Every other top-level field of a badge, and why the digest leaves it out. A field that is in
#: neither CLAIM_PATHS nor here fails unclassified_fields(), so a new field cannot go unguarded
#: without someone deciding so. LIMITATION: the fields below are NOT guarded by this rule; whether
#: any of them should be is an owner question (the assessment and policy fields set what a learner
#: must do and what happens to the credential, but the engine and the issue route have their own
#: tests for the ones they read).
NOT_DIGESTED = {
    "roles_aligned": "the roles the badge is aligned to; a catalog label that no code branches on",
    "capability_level": "a label for the level; the credential class carries the rule",
    "family": "a grouping label derived from credential_class",
    "market_evidence_ids": "citations of the industry evidence behind the badge: provenance, not a claim",
    "assessment_blueprint": "the components and weights the engine scores; unguarded here, see the limitation above",
    "scoring_rules": "only minimum_overall_score and non_compensatory are digested; the rest is scoring detail",
    "retake_rules": "operational policy: cool-downs and attempt limits",
    "evidence_rules": "operational policy: what evidence is acceptable",
    "expiration_policy": "operational policy",
    "revocation_policy": "operational policy",
    "legacy_progress_policy": "operational policy: how legacy progress counts",
    "issuer": "who issues; one value for every badge",
}


def unclassified_fields(catalog: dict) -> list[str]:
    """Catalog fields that are neither digested nor declared left out, and declarations gone stale."""
    present = {key for badge in catalog["badges"] for key in badge}
    digested = {path.split(".")[0] for path in CLAIM_PATHS}
    return [
        f"{key}: in the catalog but neither digested nor declared left out"
        for key in sorted(present - digested - set(NOT_DIGESTED))
    ] + [
        f"{key}: declared left out of the digest but no badge has it"
        for key in sorted(set(NOT_DIGESTED) - present)
    ]


def overlapping_fields(claim_paths: list[str], left_out: dict) -> list[str]:
    """Fields digested whole and also declared left out. A dotted path digests only part of a field
    (scoring_rules.minimum_overall_score), so it is never a whole-field overlap."""
    return sorted(set(left_out) & set(claim_paths))


def slug_tag(tag: str, slugs: dict[int, str]) -> str:
    """`S08` to its slug and `S08-YOUDO` to `slug:YOUDO`, through the manifest.

    A tag that resolves to no section stays as written behind a `?`, so the digest still moves; G-3a
    (test_badge_section_identity.py) is what reports the unresolved tag itself.
    """
    match = TOKEN.match(tag)
    slug = slugs.get(int(match.group(1))) if match else None
    if not slug:
        return f"?{tag}"
    kind = tag.partition("-")[2]
    return f"{slug}:{kind}" if kind else slug


def claim_payload(badge: dict, slugs: dict[int, str]) -> dict:
    payload = {path: at(badge, path) for path in CLAIM_PATHS}
    for field in TAG_FIELDS:
        payload[field] = [slug_tag(tag, slugs) for tag in payload[field] or []]
    return payload


def claim_digest(badge: dict, slugs: dict[int, str]) -> str:
    text = json.dumps(claim_payload(badge, slugs), sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def digest_violations(catalog: dict, records: dict, slugs: dict[int, str]) -> list[str]:
    live = {b["badge_id"]: b for b in catalog["badges"]}
    problems = [f"{bid}: has a recorded digest but is not in the catalog" for bid in sorted(set(records) - set(live))]
    for badge_id, badge in live.items():
        record = records.get(badge_id)
        if record is None:
            problems.append(f"{badge_id}: has no recorded digest")
        elif record["sha256"] != claim_digest(badge, slugs):
            if record["version"] == badge["version"]:
                problems.append(f"{badge_id}: claim changed without a version bump (version {badge['version']})")
            else:
                problems.append(f"{badge_id}: claim changed under version {badge['version']}; re-record the digest")
    return problems


#: The version of the method that makes a digest. Digests of another schema are not comparable, so
#: recording over them is a re-baseline (refusals() allows it). Raise it when CLAIM_PATHS or the
#: payload changes; that edit is itself a visible change to a protected test file.
DIGEST_SCHEMA = 3
SEMVER = re.compile(r"^(\d+)\.(\d+)\.(\d+)$")


def version_key(version: object) -> tuple[int, int, int] | None:
    """`1.2.0` to (1, 2, 0); None for anything that is not MAJOR.MINOR.PATCH (fail closed)."""
    match = SEMVER.match(version) if isinstance(version, str) else None
    return tuple(int(part) for part in match.groups()) if match else None


def _refusal(badge_id: str, badge: dict, was: dict | None, slugs: dict[int, str]) -> list[str]:
    """Why one badge's recorded digest may not be replaced by its live one."""
    if was is None or was["sha256"] == claim_digest(badge, slugs):
        return []
    now, then = version_key(badge["version"]), version_key(was["version"])
    if now is not None and then is not None and now > then:
        return []
    return [
        f"{badge_id}: claim changed and version {badge['version']} is not above the recorded "
        f"{was['version']}; bump the version first"
    ]


def refusals(catalog: dict, previous: dict, slugs: dict[int, str]) -> list[str]:
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
    return gone + [p for badge_id, badge in live.items() for p in _refusal(badge_id, badge, old.get(badge_id), slugs)]


def record(catalog: dict, slugs: dict[int, str]) -> dict:
    return {
        "schema": DIGEST_SCHEMA,
        "method": (
            "sha256 of the UTF-8 JSON of {catalog path: value} for the fields below, keys sorted, separators "
            "',' and ':', ensure_ascii False; required_sections and required_activities enter as manifest "
            "slugs ('slug' and 'slug:KIND'), not as S-numbers"
        ),
        "fields": CLAIM_PATHS,
        "left_out": sorted(NOT_DIGESTED),
        "records": {
            b["badge_id"]: {"version": b["version"], "sha256": claim_digest(b, slugs)} for b in catalog["badges"]
        },
    }


class ClaimDigests(unittest.TestCase):
    def setUp(self) -> None:
        self.catalog = json.loads(LIVE.read_text(encoding="utf-8"))
        self.records = json.loads(RECORDS.read_text(encoding="utf-8"))
        self.slugs = section_slugs(load(MANIFEST))

    def _badge(self, catalog: dict, badge_id: str = "progress_phase0_walked") -> dict:
        return next(b for b in catalog["badges"] if b["badge_id"] == badge_id)

    #: Every section after the tenth moves two places. The real renumber is the design's mapping f
    #: (1-18 stay, 19-32 move +2, 33-52 move +3); the property under test holds for any relabel, so
    #: the fixture names no number that the renumber itself will change.
    KEEP_UP_TO, SHIFT = 10, 2

    def _moved(self, n: int) -> int:
        return n if n <= self.KEEP_UP_TO else n + self.SHIFT

    def _renumbered(self) -> tuple[dict, dict[int, str]]:
        """The catalog and the manifest's number-to-slug table after a pure relabel: every section
        and every tag that cites it move together. No section is added, so no claim changes."""
        catalog = copy.deepcopy(self.catalog)
        for badge in catalog["badges"]:
            for field in TAG_FIELDS:
                badge[field] = [f"S{self._moved(int(t[1:3])):02d}{t[3:]}" for t in badge[field]]
        return catalog, {self._moved(n): slug for n, slug in self.slugs.items()}

    def test_a_pure_renumber_changes_no_digest(self) -> None:
        """Hashing S-numbers would move the digest of every badge that cites a section past S18, so
        the renumber could not be told from a claim edit (the review counted 26 of 31)."""
        catalog, slugs = self._renumbered()
        self.assertEqual(digest_violations(catalog, self.records["records"], slugs), [])

    def test_moving_a_tag_without_moving_its_section_is_a_retarget_and_changes_the_digest(self) -> None:
        catalog, _ = self._renumbered()
        named = {p.split(":", 1)[0] for p in digest_violations(catalog, self.records["records"], self.slugs)}
        cites_moved_sections = {
            b["badge_id"] for b in self.catalog["badges"]
            if any(int(t[1:3]) > self.KEEP_UP_TO for field in TAG_FIELDS for t in b[field])
        }
        self.assertEqual(named, cites_moved_sections)
        self.assertGreater(len(named), 0, "the fixture must move at least one badge's tags")

    def test_a_badge_retargeted_to_another_section_changes_its_digest(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = self._badge(catalog, "applied_deep_learning_practice")
        cited = badge["required_sections"][-1]
        elsewhere = f"S{int(cited[1:]) + 1:02d}"
        self.assertNotIn(elsewhere, badge["required_sections"], "a section this badge does not cite")
        badge["required_sections"] = [elsewhere if t == cited else t for t in badge["required_sections"]]
        self.assertEqual(
            digest_violations(catalog, self.records["records"], self.slugs),
            ["applied_deep_learning_practice: claim changed without a version bump (version 1.0.0)"],
        )

    def test_a_tag_that_resolves_to_no_section_still_changes_the_digest(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["required_sections"].append("S99")
        self.assertEqual(
            digest_violations(catalog, self.records["records"], self.slugs),
            ["progress_phase0_walked: claim changed without a version bump (version 1.0.0)"],
        )

    def test_a_tag_becomes_its_slug_and_a_suffix_stays_visible(self) -> None:
        slugs = {8: "files-ingestion"}
        self.assertEqual(slug_tag("S08", slugs), "files-ingestion")
        self.assertEqual(slug_tag("S08-YOUDO", slugs), "files-ingestion:YOUDO")
        self.assertEqual(slug_tag("S99", slugs), "?S99")
        self.assertEqual(slug_tag("not-a-tag", slugs), "?not-a-tag")

    def test_every_claim_matches_its_recorded_digest_under_the_current_method(self) -> None:
        self.assertEqual(self.records["schema"], DIGEST_SCHEMA, "re-record: the method changed")
        self.assertEqual(self.records["fields"], CLAIM_PATHS, "re-record: the claim fields changed")
        self.assertEqual(self.records["left_out"], sorted(NOT_DIGESTED), "re-record: the left-out fields changed")
        self.assertLessEqual(set(SHARED_PATHS), set(CLAIM_PATHS), "the 13 fields the contracts repeat stay digested")
        self.assertEqual(digest_violations(self.catalog, self.records["records"], self.slugs), [])

    def test_a_claim_change_without_a_version_bump_is_red(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["public_claim"] += " (changed)"
        self.assertEqual(
            digest_violations(catalog, self.records["records"], self.slugs),
            ["progress_phase0_walked: claim changed without a version bump (version 1.0.0)"],
        )

    def test_a_claim_change_with_a_version_bump_is_red_until_recorded(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = self._badge(catalog)
        badge["public_claim"] += " (changed)"
        badge["version"] = "1.0.1"
        problems = digest_violations(catalog, self.records["records"], self.slugs)
        self.assertEqual(problems, ["progress_phase0_walked: claim changed under version 1.0.1; re-record the digest"])

    def test_what_a_badge_claims_and_what_earns_it_are_claims(self) -> None:
        """The review's four fixtures, each of which returned [] with the 13 shared fields only."""
        edits = {
            "skill_nodes": lambda b: b["skill_nodes"].append("hypothesis_testing"),
            "non_claims": lambda b: b["non_claims"].clear(),
            "required_projects": lambda b: b["required_projects"].append("CP-EXTRA"),
            "newbie_friendly_description": lambda b: b.update(newbie_friendly_description=b["newbie_friendly_description"] + " (reworded)"),
            "credential_type": lambda b: b.update(credential_type="competency_badge"),
        }
        for field, edit in edits.items():
            with self.subTest(field=field):
                catalog = copy.deepcopy(self.catalog)
                edit(self._badge(catalog, "integrated_python_ai_capstone_independent"))
                self.assertEqual(
                    digest_violations(catalog, self.records["records"], self.slugs),
                    ["integrated_python_ai_capstone_independent: claim changed without a version bump (version 1.0.0)"],
                )

    def test_a_field_declared_left_out_may_change_freely(self) -> None:
        self.assertIn("market_evidence_ids", NOT_DIGESTED)
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["market_evidence_ids"].append("industry_reality_brief.md §99 (a new citation)")
        self.assertEqual(digest_violations(catalog, self.records["records"], self.slugs), [])

    def test_every_catalog_field_is_either_digested_or_declared_left_out(self) -> None:
        self.assertEqual(unclassified_fields(self.catalog), [])

    def test_a_new_catalog_field_must_be_classified_before_it_can_go_unguarded(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["issuer_logo_url"] = "https://example.invalid/logo.png"
        self.assertEqual(
            unclassified_fields(catalog),
            ["issuer_logo_url: in the catalog but neither digested nor declared left out"],
        )

    def test_a_declared_left_out_field_that_is_not_in_the_catalog_is_stale(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        for badge in catalog["badges"]:
            del badge["retake_rules"]
        self.assertEqual(
            unclassified_fields(catalog),
            ["retake_rules: declared left out of the digest but no badge has it"],
        )

    def test_a_field_cannot_be_both_digested_and_declared_left_out(self) -> None:
        self.assertEqual(overlapping_fields(CLAIM_PATHS, {"public_claim": "x", "scoring_rules": "y"}), ["public_claim"])
        self.assertEqual(overlapping_fields(CLAIM_PATHS, NOT_DIGESTED), [])

    def test_a_badge_with_no_recorded_digest_is_red(self) -> None:
        records = copy.deepcopy(self.records["records"])
        del records["progress_phase0_walked"]
        self.assertEqual(digest_violations(self.catalog, records, self.slugs), ["progress_phase0_walked: has no recorded digest"])

    def test_a_record_for_a_badge_that_is_gone_is_red(self) -> None:
        records = copy.deepcopy(self.records["records"])
        records["retired_badge"] = {"version": "1.0.0", "sha256": "0" * 64}
        self.assertEqual(
            digest_violations(self.catalog, records, self.slugs),
            ["retired_badge: has a recorded digest but is not in the catalog"],
        )


class RecordRefusal(unittest.TestCase):
    """`--record` re-baselines the digests. It must not be how a claim edit turns green."""

    def setUp(self) -> None:
        self.catalog = json.loads(LIVE.read_text(encoding="utf-8"))
        self.slugs = section_slugs(load(MANIFEST))
        self.previous = record(self.catalog, self.slugs)

    def _edited(self, version: str | None = None, badge_id: str = "progress_phase0_walked") -> dict:
        catalog = copy.deepcopy(self.catalog)
        badge = next(b for b in catalog["badges"] if b["badge_id"] == badge_id)
        badge["public_claim"] += " (changed)"
        if version is not None:
            badge["version"] = version
        return catalog

    def test_a_changed_claim_at_the_same_version_may_not_be_recorded(self) -> None:
        self.assertEqual(
            refusals(self._edited(), self.previous, self.slugs),
            ["progress_phase0_walked: claim changed and version 1.0.0 is not above the recorded 1.0.0; bump the version first"],
        )

    def test_a_changed_claim_under_a_higher_version_may_be_recorded(self) -> None:
        for version in ("1.0.1", "1.1.0", "2.0.0", "1.0.10"):
            with self.subTest(version=version):
                self.assertEqual(refusals(self._edited(version), self.previous, self.slugs), [])

    def test_a_lower_or_unreadable_version_may_not_be_recorded(self) -> None:
        for version in ("0.9.0", "1.0.0-rc1", "v2", ""):
            with self.subTest(version=version):
                problems = refusals(self._edited(version), self.previous, self.slugs)
                self.assertEqual(len(problems), 1, problems)
                self.assertIn("not above the recorded 1.0.0", problems[0])

    def test_a_badge_that_left_the_catalog_may_not_be_forgotten(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        catalog["badges"] = [b for b in catalog["badges"] if b["badge_id"] != "progress_phase0_walked"]
        self.assertEqual(
            refusals(catalog, self.previous, self.slugs),
            ["progress_phase0_walked: is recorded but gone from the catalog; retire it with status, do not remove it"],
        )

    def test_a_new_badge_and_an_unchanged_catalog_may_be_recorded(self) -> None:
        self.assertEqual(refusals(self.catalog, self.previous, self.slugs), [])
        previous = copy.deepcopy(self.previous)
        del previous["records"]["progress_phase0_walked"]
        self.assertEqual(refusals(self.catalog, previous, self.slugs), [])

    def test_digests_of_another_schema_are_not_comparable_so_recording_is_a_rebaseline(self) -> None:
        previous = copy.deepcopy(self.previous)
        previous["schema"] = DIGEST_SCHEMA - 1
        previous["records"]["progress_phase0_walked"]["sha256"] = "0" * 64
        self.assertEqual(refusals(self.catalog, previous, self.slugs), [])
        previous["schema"] = DIGEST_SCHEMA
        self.assertEqual(len(refusals(self.catalog, previous, self.slugs)), 1)

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
        self.assertNotEqual(digest_violations(edited, self.previous["records"], self.slugs), [], "red before --record")
        code, untouched, after = self._run(edited)
        self.assertNotEqual(code, 0)
        self.assertTrue(untouched, "a refused --record leaves the records as they were")
        self.assertNotEqual(digest_violations(edited, after["records"], self.slugs), [], "still red after --record")

    def test_edit_with_a_bump_then_record_ends_green(self) -> None:
        edited = self._edited("1.0.1")
        code, untouched, after = self._run(edited)
        self.assertEqual(code, 0)
        self.assertFalse(untouched)
        self.assertEqual(digest_violations(edited, after["records"], self.slugs), [])
        self.assertEqual(after["records"]["progress_phase0_walked"]["version"], "1.0.1")


def run_record(live: Path = LIVE, records: Path = RECORDS, manifest: Path = MANIFEST) -> int:
    """`--record`: write the digests of `live` to `records`, unless that would hide a claim change.

    Returns the process exit code. A refusal prints each reason on stderr and writes nothing.
    """
    catalog = json.loads(live.read_text(encoding="utf-8"))
    slugs = section_slugs(load(manifest))
    previous = json.loads(records.read_text(encoding="utf-8")) if records.exists() else None
    problems = refusals(catalog, previous, slugs) if previous is not None else []
    if problems:
        print("\n".join(["refused: the records are unchanged"] + problems), file=sys.stderr)
        return 1
    records.write_text(json.dumps(record(catalog, slugs), indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"recorded {len(catalog['badges'])} digests in {records}")
    return 0


if __name__ == "__main__":
    if "--record" in sys.argv:
        sys.exit(run_record())
    unittest.main()
