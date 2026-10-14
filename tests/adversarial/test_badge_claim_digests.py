#!/usr/bin/env python3
"""A badge's claim cannot change without its version changing with it (C12e).

A badge's claim is everything the badge holds except the fields declared internal. Owner decision O25
(2026-10-13): whatever a learner or a verifier reads as a claim is digested, which includes the
assessment blueprint, the scoring rules, the retake, evidence, expiration, revocation and
legacy-progress policies, the issuer and the labels (roles, capability level, family). The digest is
the sha256 of those fields, as sorted JSON, recorded per badge with the version it was recorded under.

The rule is a DEFAULT, not a list of fields. NOT_DIGESTED is an allow-list of purely internal fields,
each with a reason; it holds one entry today (market_evidence_ids, pointers into the repository's own
research files). A field added to the catalog tomorrow is digested without anyone deciding so, and
leaves the digest only by an edit to this protected file that names it and argues for it. Two tests keep
the list honest: a declaration for a field no badge has is stale, and no code under src/ may name a field
on the list. The earlier versions listed the digested fields and let every other field change freely;
the review of the first draft changed skill_nodes, non_claims, required_projects,
newbie_friendly_description and credential_type under an unchanged version without a failure, and the
list grew by one field at a time. The 13 fields test_badge_catalog_copies.py repeats into its contracts
(SHARED) must stay digested.

required_sections and required_activities enter the digest as the manifest slugs their S-tags
resolve to (`S08` as the slug, `S08-YOUDO` as `slug:YOUDO`), not as S-numbers. The renumber moves
26 of the 31 badges' tags (every badge that cites a section past S18); a digest over the numbers
would change for all of them and could not tell that from a claim edit. Over slugs a renumber that
moves a section and its tags together leaves every digest alone, and a tag moved to another section,
or a tag that resolves to nothing, changes the digest.

A changed digest with an unchanged version is red: "claim changed without a version bump". A changed
digest with a new version is red until the digest is re-recorded, so the record never goes stale.

LIMITATIONS, stated rather than absorbed:
- The digest covers the badges, not the catalog's own top-level fields (provisional_floors,
  design_constraints, family_counts, the generator stamps). test_badge_catalog_copies.py compares those
  between the live and the industry copy, but nothing ties a change to them to a version. Not done.
- market_evidence_ids is the one field that can change freely. The requirement copies under
  industry_alignment/badge_requirements/ print it as "Market evidence pointers", for maintainers; if the
  owner reads it as one of "the labels", delete its line from NOT_DIGESTED and re-record.
- A pure renumber leaves every digest alone only while no digested field outside the two tag lists names
  an S-number. Four do (test_the_only_digested_text_that_names_a_section_number_is_claim_prose), and a
  renumber must reword them, which is a claim change and takes a version bump.

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
from test_badge_catalog_copies import SHARED  # noqa: E402

LIVE = ROOT / "src/lib/eligibility/badge_catalog.json"
RECORDS = ROOT / "src/lib/eligibility/claim_digests.json"
#: The two lists of S-number tags. The digest hashes them as slugs, so a renumber that moves a
#: section and its tags together leaves the digest alone, and a retarget does not.
TAG_FIELDS = ("required_sections", "required_activities")
#: The catalog fields the contracts repeat (test_badge_catalog_copies.SHARED), by their top-level name.
#: scoring_rules is one of them through its minimum score and its non-compensatory rule.
SHARED_FIELDS = {path.split(".")[0] for _, path in SHARED}
#: The purely internal fields of a badge, the only ones the digest leaves out, each with its reason.
#: This is an ALLOW-LIST: a field that is not named here is digested, whatever it is called and whether
#: or not anyone has looked at it. Owner decision O25 (2026-10-13): everything a learner or a verifier
#: reads as a claim is digested, so the assessment blueprint, the scoring rules, the five policies, the
#: issuer and the labels are not here. A field belongs here only if no learner or verifier reads it;
#: test_a_field_on_the_internal_list_is_read_by_no_application_code checks the code side of that.
NOT_DIGESTED = {
    "market_evidence_ids": (
        "pointers into the repository's own research files (industry_skill_graph.json, "
        "role_skill_taxonomy.json, industry_reality_brief.md), which no learner or verifier opens "
        "and no code under src/ reads"
    ),
}
#: Source files the internal-field check reads. The lesson files are lesson text, not application code.
SOURCE_SUFFIXES = (".ts", ".tsx", ".mts", ".js", ".mjs")
S_NUMBER = re.compile(r"\bS\d{2}\b")


def digested_fields(catalog: dict) -> list[str]:
    """Every field some badge holds, except the internal ones: what the digest covers today."""
    return sorted({key for badge in catalog["badges"] for key in badge} - set(NOT_DIGESTED))


def stale_declarations(catalog: dict) -> list[str]:
    """Internal-field declarations for a field no badge has. Harmless, but they would mislead a reader."""
    present = {key for badge in catalog["badges"] for key in badge}
    return [f"{key}: declared internal but no badge has it" for key in sorted(set(NOT_DIGESTED) - present)]


def internal_fields_the_contracts_repeat(left_out: dict) -> list[str]:
    """A field the contracts repeat is published, so it cannot be internal."""
    return sorted(SHARED_FIELDS & set(left_out))


def code_that_reads(fields: dict, root: Path = ROOT / "src") -> list[tuple[str, str]]:
    """(file, field) for each application source file under `root` that names one of `fields`."""
    found = []
    for path in sorted(root.rglob("*")):
        if path.suffix not in SOURCE_SUFFIXES or "course/sections" in path.as_posix():
            continue
        text = path.read_text(encoding="utf-8", errors="replace")
        found += [(str(path), field) for field in sorted(fields) if field in text]
    return found


def section_numbers_in_prose(catalog: dict) -> list[tuple[str, str]]:
    """(badge, field) for each digested field outside the two tag lists that names an S-number."""
    return [
        (badge["badge_id"], field)
        for badge in catalog["badges"]
        for field, value in badge.items()
        if field not in NOT_DIGESTED and field not in TAG_FIELDS
        and S_NUMBER.search(json.dumps(value, ensure_ascii=False))
    ]


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
    """The whole badge but its internal fields, with the S-tag lists read as slugs."""
    payload = {key: value for key, value in badge.items() if key not in NOT_DIGESTED}
    for field in TAG_FIELDS:
        if field in payload:
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
#: recording over them is a re-baseline (refusals() allows it). Raise it when the payload changes, which
#: includes a change to NOT_DIGESTED; that edit is itself a visible change to a protected test file.
#: Schema 4 is O25's default-digested payload: the whole badge but the internal fields (schema 3 was a
#: hand-written list of 18 paths, and 12 fields were declared free to change).
DIGEST_SCHEMA = 4
#: A SemVer 2.0.0 normal version (semver.org §2): three non-negative integers, no leading zeroes.
#: Read whole with fullmatch, because `$` also matches before a trailing newline, and with [0-9],
#: because `\d` matches every Unicode decimal digit (Python `re` docs).
SEMVER = re.compile(r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)")


def version_key(version: object) -> tuple[int, int, int] | None:
    """`1.2.0` to (1, 2, 0); None for anything that is not MAJOR.MINOR.PATCH (fail closed)."""
    match = SEMVER.fullmatch(version) if isinstance(version, str) else None
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
            "sha256 of the UTF-8 JSON of {field: value} for every field of the badge except those in left_out, "
            "keys sorted, separators ',' and ':', ensure_ascii False; a field added to the catalog is digested "
            "by default; required_sections and required_activities enter as manifest slugs ('slug' and "
            "'slug:KIND'), not as S-numbers"
        ),
        "fields": digested_fields(catalog),
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
        self.assertEqual(self.records["fields"], digested_fields(self.catalog), "re-record: the claim fields changed")
        self.assertEqual(self.records["left_out"], sorted(NOT_DIGESTED), "re-record: the left-out fields changed")
        self.assertLessEqual(SHARED_FIELDS, set(digested_fields(self.catalog)), "the fields the contracts repeat stay digested")
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

    def test_what_a_learner_or_a_verifier_reads_as_a_claim_is_a_claim(self) -> None:
        """Owner decision O25: the assessment, the scoring detail, the five policies, the issuer and the
        labels are all digested. Before it, each of these edits returned [] (they were declared left out)."""
        edits = {
            "assessment_blueprint": lambda b: b["assessment_blueprint"]["components"][0].update(required_score_pct=1),
            "scoring_rules": lambda b: b["scoring_rules"].update(rounding="up"),
            "retake_rules": lambda b: b["retake_rules"].update(cool_down_days=99),
            "evidence_rules": lambda b: b["evidence_rules"]["acceptable_evidence"].append("A screenshot"),
            "expiration_policy": lambda b: b["expiration_policy"].update(expires=True),
            "revocation_policy": lambda b: b["revocation_policy"]["revocation_triggers"].clear(),
            "legacy_progress_policy": lambda b: b["legacy_progress_policy"].update(legacy_progress_accepted=False),
            "issuer": lambda b: b.update(issuer="Another issuer"),
            "roles_aligned": lambda b: b["roles_aligned"].append("staff_engineer"),
            "capability_level": lambda b: b.update(capability_level="integrated_mastery"),
            "family": lambda b: b.update(family="capstone_credential"),
        }
        for field, edit in edits.items():
            with self.subTest(field=field):
                catalog = copy.deepcopy(self.catalog)
                edit(self._badge(catalog, "progress_phase0_walked"))
                self.assertEqual(
                    digest_violations(catalog, self.records["records"], self.slugs),
                    ["progress_phase0_walked: claim changed without a version bump (version 1.0.0)"],
                )

    def test_a_field_added_to_the_catalog_is_digested_by_default(self) -> None:
        """A new field needs no decision to be guarded: it is guarded until someone declares it internal."""
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["issuer_logo_url"] = "https://example.invalid/logo.png"
        self.assertEqual(
            digest_violations(catalog, self.records["records"], self.slugs),
            ["progress_phase0_walked: claim changed without a version bump (version 1.0.0)"],
        )

    def test_a_new_field_once_added_is_digested_and_its_edit_is_a_claim_change(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        badge = self._badge(catalog)
        badge["issuer_logo_url"] = "https://example.invalid/logo.png"
        badge["version"] = "1.0.1"
        recorded = record(catalog, self.slugs)
        self.assertIn("issuer_logo_url", recorded["fields"])
        badge["issuer_logo_url"] = "https://example.invalid/other.png"
        self.assertEqual(
            digest_violations(catalog, recorded["records"], self.slugs),
            ["progress_phase0_walked: claim changed without a version bump (version 1.0.1)"],
        )

    def test_a_field_declared_internal_may_change_freely(self) -> None:
        self.assertIn("market_evidence_ids", NOT_DIGESTED)
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["market_evidence_ids"].append("industry_reality_brief.md §99 (a new citation)")
        self.assertEqual(digest_violations(catalog, self.records["records"], self.slugs), [])

    def test_the_internal_list_is_short_and_each_entry_is_argued(self) -> None:
        """The allow-list is the only way a field leaves the digest, so it has to stay readable."""
        self.assertEqual(sorted(NOT_DIGESTED), ["market_evidence_ids"])
        for field, reason in NOT_DIGESTED.items():
            with self.subTest(field=field):
                self.assertGreaterEqual(len(reason.split()), 8, "a reason, not a label")

    def test_a_field_on_the_internal_list_is_read_by_no_application_code(self) -> None:
        """'Purely internal' is checkable from the code side: nothing under src/ names the field. The day a
        page, a route or the engine reads it, a learner or a verifier can see it, and it must be digested."""
        self.assertEqual(code_that_reads(NOT_DIGESTED), [])

    def test_code_that_reads_an_internal_field_is_found(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "page.tsx").write_text("const ids = badge.market_evidence_ids\n", encoding="utf-8")
            (Path(tmp) / "other.ts").write_text("const unrelated = 1\n", encoding="utf-8")
            found = code_that_reads(NOT_DIGESTED, Path(tmp))
        self.assertEqual([(Path(path).name, field) for path, field in found], [("page.tsx", "market_evidence_ids")])

    def test_a_declared_internal_field_that_is_not_in_the_catalog_is_stale(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        for badge in catalog["badges"]:
            del badge["market_evidence_ids"]
        self.assertEqual(
            stale_declarations(catalog),
            ["market_evidence_ids: declared internal but no badge has it"],
        )
        self.assertEqual(stale_declarations(self.catalog), [])

    def test_no_field_the_contracts_repeat_is_internal(self) -> None:
        self.assertEqual(sorted(SHARED_FIELDS & set(NOT_DIGESTED)), [])
        self.assertEqual(
            internal_fields_the_contracts_repeat({**NOT_DIGESTED, "public_claim": "x", "scoring_rules": "y"}),
            ["public_claim", "scoring_rules"],
        )

    def test_the_only_digested_text_that_names_a_section_number_is_claim_prose(self) -> None:
        """The digest hashes the S-tag lists as slugs so a renumber moves no digest. Every other digested
        field is hashed as written, so a field that names an S-number in prose would move with the renumber.
        Today four badges do, in public_claim (3) and newbie_friendly_description (1), which a renumber must
        reword anyway: that is a claim change and takes a version bump. Digesting more fields adds no more."""
        self.assertEqual(
            sorted(section_numbers_in_prose(self.catalog)),
            [
                ("evidence_grounded_ai_systems_capstone", "newbie_friendly_description"),
                ("progress_phase0_walked", "public_claim"),
                ("progress_phase1_walked", "public_claim"),
                ("progress_phase2_walked", "public_claim"),
            ],
        )

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

    def test_a_version_a_looser_reader_would_take_as_a_bump_may_not_be_recorded(self) -> None:
        """Each of these reads as above 1.0.0 to some looser parser, and none is a SemVer 2.0.0 normal
        version (§2: X.Y.Z, non-negative integers, no leading zeroes). A pattern anchored with `$`
        also matches before a trailing newline, and `\\d` matches every Unicode decimal digit
        (Python `re` docs), so the first reader accepted three of them as a bump. Refusing them all
        is what fail closed means here: a claim change is recorded only under a plain higher version.
        """
        for version in ("2.0.0\n", "1.0.01", "١.١.٠", "1.0.1-rc1", "v2.0.0", "2.0", "2"):
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
