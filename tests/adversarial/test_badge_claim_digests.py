#!/usr/bin/env python3
"""A badge's claim cannot change without its version changing with it (C12e).

A badge's claim is everything the badge holds except the fields declared internal. Owner decision O25
(2026-10-13): whatever a learner or a verifier reads as a claim is digested, which includes the
assessment blueprint, the scoring rules, the retake, evidence, expiration, revocation and
legacy-progress policies, the issuer and the labels (roles, capability level, family). The digest is
the sha256 of those fields, as sorted JSON, recorded per badge with the version it was recorded under.

The rule is a DEFAULT, not a list of fields. Two allow-lists name the purely internal fields, each with
a reason: NOT_DIGESTED for the fields of a badge, which is EMPTY, and CATALOG_NOT_DIGESTED for the
top-level fields of the catalog, which holds five. A field added to a badge, or to the top of the catalog,
tomorrow is digested without anyone deciding so, and leaves the digest only by an edit to this protected
file that names it and argues for it. NOT_DIGESTED is empty since the owner's answer to the review of r3:
its one entry, market_evidence_ids (pointers into the repository's own research files), is printed as
"Market evidence pointers" by the maintainer copies under industry_alignment/badge_requirements/, so the
owner counts it among the labels. The list is kept because O25 asks for the mechanism. Three tests keep
the lists honest: a declaration for a field that does not exist is stale; no code under src/ may READ a
field on a list (field_read_guard.mjs, on the TypeScript compiler's syntax tree: a read is the whole word
as code, as a string or as JSX text, and a comment never counts; a member that an interface or a type
literal declares reads nothing); and no field a claim contract publishes may be on one. The last two act
on the five catalog entries. The badge list is empty, so the mechanisms behind it
are tested on a declared field (mock.patch.dict). The earlier versions listed the digested fields and let
every other field change freely; the review of the first draft changed skill_nodes, non_claims,
required_projects, newbie_friendly_description and credential_type under an unchanged version without a
failure, and the list grew by one field at a time. The 13 fields test_badge_catalog_copies.py repeats
into its contracts (SHARED) must stay digested.

The top-level fields of the catalog other than `badges` are digested too, as one record under the
catalog's own version (the `version` at the top of badge_catalog.json), except the five on
CATALOG_NOT_DIGESTED. What is digested is not decoration. `provisional_floors` holds
CREDENTIAL_EXAM_FLOOR (src/lib/credential-gates.ts, from `provisional_floors.section_exam_pct`), which
decides whether an exam score counts toward a credential, and the issue route prints it in the 403 a
learner reads. `version` is the catalog version the eligibility engine stamps and checks
(EligibilityEngine.catalogVersion). `design_constraints` states the policy and repeats the floors in
prose. What is left out is the generator's stamps (`generated_at`, `generated_by`, `specification`) and
its two tallies of the badges (`badge_count`, `family_counts`): none states a claim, no code under src/
reads one (the guard below checks that), and each badge's own record already covers what the tallies
count. Digested, they made a regeneration of the catalog (a new generated_at, no claim changed) take a
catalog version bump and a re-record. `generated_at` is also printed as the Generated line of the 31
maintainer copies under industry_alignment/badge_requirements/; test_badge_catalog_copies.py compares
those with a render byte for byte, so a regeneration cannot leave them stale, digest or no digest. The
industry copy (industry_alignment/badge_catalog.json) must equal the live one on every top-level field
(same test file), so one record covers both. Before the catalog record existed, a floor changed from 85
to 50 in both copies, with no version bump, failed no test in the repository.

required_sections and required_activities enter the digest as the manifest slugs their S-tags
resolve to (`S08` as the slug, `S08-YOUDO` as `slug:YOUDO`), not as S-numbers. The renumber moves
26 of the 31 badges' tags (every badge that cites a section past S18); a digest over the numbers
would change for all of them and could not tell that from a claim edit. Over slugs a renumber that
moves a section and its tags together leaves every digest alone, and a tag moved to another section,
or a tag that resolves to nothing, changes the digest.

A changed digest with an unchanged version is red: "claim changed without a version bump". A changed
digest with a new version is red until the digest is re-recorded, so the record never goes stale.

LIMITATIONS, stated rather than absorbed:
- The catalog floors and the badges' copies of them are digested apart, and compared by CatalogFloors
  (test_badge_catalog_copies.py): the gate reads provisional_floors.section_exam_pct, 26 scored badges
  state the same number as the required_score_pct of their section_exams (self_check, you_do_projects,
  integrator_project and two scoring rules repeat the other floors the same way), and a floor changed in
  one place and not the other is red. A floor change under a catalog version bump therefore costs an edit,
  a version bump and a re-record of each of those badges, which is what changing 26 claims costs. The
  comparison covers the catalog and its badges only. Two more copies of the floors, PROVISIONAL_FLOORS in
  src/lib/eligibility/types.ts (EligibilityEngine reads critical_competency_pct from it) and the one in
  tests/adversarial/test_eligibility_engine.py, are compared with the catalog by
  eligibility-provisional-floors.test.ts and ReferenceFloors (owner decision O27 102-Q1).
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
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tests/adversarial"))

from badge_sources import MANIFEST, TOKEN, load, section_slugs  # noqa: E402
from test_badge_catalog_copies import CONTRACTS, SHARED  # noqa: E402

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
#: EMPTY since the owner's answer on r3: market_evidence_ids, its one entry, is printed as "Market
#: evidence pointers" in the maintainer copies under industry_alignment/badge_requirements/, so it is a
#: label and is digested. The list stays, empty, so that O25's mechanism and its guards stay in place.
NOT_DIGESTED: dict[str, str] = {}
#: The purely internal top-level fields of the catalog, the only ones its record leaves out, each with its
#: reason. Owner answer on r4 (2026-10-14): the generator's stamps belong here, because digesting them made
#: a regeneration that changes no claim take a catalog version bump. Same rule as NOT_DIGESTED: a field is
#: here only if it states no claim and no code under src/ reads it (the guards check the code side and the
#: contracts' side), and every other top-level field is digested by default.
CATALOG_NOT_DIGESTED: dict[str, str] = {
    "generated_at": (
        "The time the generator ran. It states no claim and no code under src/ reads it. It is printed as the "
        "Generated line of the 31 maintainer copies under industry_alignment/badge_requirements/, which "
        "test_badge_catalog_copies.py compares byte for byte with a render, so it cannot go stale there."
    ),
    "generated_by": (
        "The name of the generator node that wrote the file. It states no claim, no code under src/ reads it, "
        "and a regeneration by another tool changes nothing a credential says."
    ),
    "specification": (
        "The name of the project phase whose specification the generator implemented. It is not a credential's "
        "specification version (that is the badge version, repeated by each contract's specification_hash), "
        "and no code under src/ reads it."
    ),
    "badge_count": (
        "A tally of the badges. Each badge has a record of its own: a badge that joins the catalog has no "
        "record, one that leaves it is reported gone, and no code under src/ reads the tally."
    ),
    "family_counts": (
        "A tally of the badges per family. Family is a digested field of each badge, so a badge that changes "
        "family moves its own digest, and no code under src/ reads the tally."
    ),
}
#: Both allow-lists by the level they apply to, for the guards that must hold on each.
INTERNAL_LISTS = {"badge": NOT_DIGESTED, "catalog": CATALOG_NOT_DIGESTED}
#: Source files the internal-field check reads. The lesson files are lesson text, not application code.
SOURCE_SUFFIXES = (".ts", ".tsx", ".mts", ".js", ".mjs")
S_NUMBER = re.compile(r"\bS\d{2}\b")
#: The reader of a field's use in code (owner decision O27 102-S1): a Node program on the TypeScript
#: compiler API. The text pattern it replaces could not tell a comment, or a `//` inside a string, from code.
FIELD_READ_GUARD = ROOT / "tests/adversarial/field_read_guard.mjs"


def digested_fields(catalog: dict) -> list[str]:
    """Every field some badge holds, except the internal ones: what the digest covers today."""
    return sorted({key for badge in catalog["badges"] for key in badge} - set(NOT_DIGESTED))


def stale_declarations(catalog: dict) -> list[str]:
    """Internal-field declarations for a field no badge has. Harmless, but they would mislead a reader."""
    present = {key for badge in catalog["badges"] for key in badge}
    return [f"{key}: declared internal but no badge has it" for key in sorted(set(NOT_DIGESTED) - present)]


def contract_fields() -> set[str]:
    """Every top-level key some claim contract publishes, read from the contract files themselves."""
    return {key for path in CONTRACTS.glob("*.json") for key in json.loads(path.read_text(encoding="utf-8"))}


def internal_fields_the_contracts_repeat(left_out: dict) -> list[str]:
    """A field the contracts publish is a claim, so it cannot be internal: either a catalog field they
    repeat (SHARED) or a key they carry."""
    return sorted((SHARED_FIELDS | contract_fields()) & set(left_out))


def reads_by_job(jobs: list[dict]) -> dict[str, list[str]]:
    """For each job (`name`, `file`, `text`, `fields`), the fields its code reads, by the TypeScript compiler
    API in field_read_guard.mjs. One Node process reads every job: a process per file would take minutes."""
    run = subprocess.run(
        ["node", str(FIELD_READ_GUARD)],
        input=json.dumps(jobs), capture_output=True, text=True, cwd=ROOT, check=False,
    )
    if run.returncode != 0:
        raise RuntimeError(f"field_read_guard.mjs failed: {run.stderr.strip()}")
    return json.loads(run.stdout)


def code_that_reads(fields: dict, root: Path = ROOT / "src") -> list[tuple[str, str]]:
    """(file, field) for each application source file under `root` that reads one of `fields`."""
    jobs = [
        {"name": str(path), "file": path.name, "text": path.read_text(encoding="utf-8", errors="replace"),
         "fields": sorted(fields)}
        for path in sorted(root.rglob("*"))
        if path.suffix in SOURCE_SUFFIXES and "course/sections" not in path.as_posix()
    ]
    reads = reads_by_job(jobs)
    return [(name, field) for name, found in reads.items() for field in sorted(fields) if field in found]


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


def sha256_of(payload: dict) -> str:
    text = json.dumps(payload, sort_keys=True, separators=(",", ":"), ensure_ascii=False)
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def claim_digest(badge: dict, slugs: dict[int, str]) -> str:
    return sha256_of(claim_payload(badge, slugs))


def catalog_fields(catalog: dict) -> list[str]:
    """Every top-level field of the catalog the catalog record covers: not `badges`, which are digested
    one by one, and not the internal ones (CATALOG_NOT_DIGESTED)."""
    return sorted(set(catalog) - {"badges"} - set(CATALOG_NOT_DIGESTED))


def catalog_digest(catalog: dict) -> str:
    """The digest of the catalog's own claim fields: today its version, floors and design constraints."""
    return sha256_of({field: catalog[field] for field in catalog_fields(catalog)})


def drift(label: str, recorded: dict | None, version: str, digest: str) -> list[str]:
    """Why one recorded digest (a badge's, or the catalog's) no longer matches the live one."""
    if recorded is None:
        return [f"{label}: has no recorded digest"]
    if recorded["sha256"] == digest:
        return []
    if recorded["version"] == version:
        return [f"{label}: claim changed without a version bump (version {version})"]
    return [f"{label}: claim changed under version {version}; re-record the digest"]


def catalog_violations(catalog: dict, recorded: dict | None) -> list[str]:
    return drift("catalog", recorded, catalog["version"], catalog_digest(catalog))


def digest_violations(catalog: dict, records: dict, slugs: dict[int, str]) -> list[str]:
    live = {b["badge_id"]: b for b in catalog["badges"]}
    problems = [f"{bid}: has a recorded digest but is not in the catalog" for bid in sorted(set(records) - set(live))]
    for badge_id, badge in live.items():
        problems += drift(badge_id, records.get(badge_id), badge["version"], claim_digest(badge, slugs))
    return problems


#: The version of the method that makes a digest. Digests of another schema are not comparable, so
#: recording over them is a re-baseline (refusals() allows it). Raise it when the payload changes, which
#: includes a change to NOT_DIGESTED; that edit is itself a visible change to a protected test file.
#: Schema 6 leaves the catalog's generator stamps and tallies out of the catalog record
#: (CATALOG_NOT_DIGESTED). Schema 5 digested market_evidence_ids with the rest of the badge (schema 4,
#: O25's default-digested payload, left that one field out; schema 3 was a hand-written list of 18 paths).
#: No badge payload changed between 5 and 6, so the 31 badge digests are the same bytes; the catalog's
#: moved. No claim changed and no version moved: the method did, so recording over 5 is a re-baseline.
DIGEST_SCHEMA = 6
#: A SemVer 2.0.0 normal version (semver.org §2): three non-negative integers, no leading zeroes.
#: Read whole with fullmatch, because `$` also matches before a trailing newline, and with [0-9],
#: because `\d` matches every Unicode decimal digit (Python `re` docs).
SEMVER = re.compile(r"(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)\.(0|[1-9][0-9]*)")


def version_key(version: object) -> tuple[int, int, int] | None:
    """`1.2.0` to (1, 2, 0); None for anything that is not MAJOR.MINOR.PATCH (fail closed)."""
    match = SEMVER.fullmatch(version) if isinstance(version, str) else None
    return tuple(int(part) for part in match.groups()) if match else None


def _refusal(label: str, version: str, digest: str, was: dict | None) -> list[str]:
    """Why one recorded digest (a badge's, or the catalog's) may not be replaced by its live one."""
    if was is None or was["sha256"] == digest:
        return []
    now, then = version_key(version), version_key(was["version"])
    if now is not None and then is not None and now > then:
        return []
    return [f"{label}: claim changed and version {version} is not above the recorded {was['version']}; bump the version first"]


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
    changed = [
        p
        for badge_id, badge in live.items()
        for p in _refusal(badge_id, badge["version"], claim_digest(badge, slugs), old.get(badge_id))
    ]
    kept = _refusal("catalog", catalog["version"], catalog_digest(catalog), previous.get("catalog"))
    return gone + changed + kept


def record(catalog: dict, slugs: dict[int, str]) -> dict:
    return {
        "schema": DIGEST_SCHEMA,
        "method": (
            "sha256 of the UTF-8 JSON of {field: value} for every field of the badge except those in left_out, "
            "keys sorted, separators ',' and ':', ensure_ascii False; a field added to the catalog is digested "
            "by default; required_sections and required_activities enter as manifest slugs ('slug' and "
            "'slug:KIND'), not as S-numbers; every top-level field of the catalog but badges is digested the "
            "same way as one record, under the catalog's own version, except those in catalog.left_out"
        ),
        "fields": digested_fields(catalog),
        "left_out": sorted(NOT_DIGESTED),
        "catalog": {
            "fields": catalog_fields(catalog),
            "left_out": sorted(CATALOG_NOT_DIGESTED),
            "version": catalog["version"],
            "sha256": catalog_digest(catalog),
        },
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
        self.assertEqual(self.records["catalog"]["fields"], catalog_fields(self.catalog), "re-record: the catalog fields changed")
        self.assertEqual(self.records["catalog"]["left_out"], sorted(CATALOG_NOT_DIGESTED), "re-record: the catalog left-out fields changed")
        self.assertEqual(catalog_violations(self.catalog, self.records["catalog"]), [])

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

    def test_the_exam_floor_the_issuance_gate_reads_cannot_change_under_the_same_catalog_version(self) -> None:
        """CREDENTIAL_EXAM_FLOOR (src/lib/credential-gates.ts) is provisional_floors.section_exam_pct. It
        decides whether an exam score counts toward a credential, and the issue route prints it to the
        learner. Changed from 85 to 50 in both copies of the catalog with no version bump, it failed no
        test (the review of this branch measured it); it is the catalog record that fails now."""
        catalog = copy.deepcopy(self.catalog)
        catalog["provisional_floors"]["section_exam_pct"] = 50
        self.assertEqual(digest_violations(catalog, self.records["records"], self.slugs), [], "no badge moved")
        self.assertEqual(
            catalog_violations(catalog, self.records["catalog"]),
            ["catalog: claim changed without a version bump (version 1.0.0)"],
        )

    def test_the_floors_and_the_policy_text_of_the_catalog_are_claims_too(self) -> None:
        edits = {
            "provisional_floors": lambda c: c["provisional_floors"].update(critical_competency_pct=90),
            "design_constraints": lambda c: c["design_constraints"].pop(),
        }
        for field, edit in edits.items():
            with self.subTest(field=field):
                catalog = copy.deepcopy(self.catalog)
                edit(catalog)
                self.assertEqual(
                    catalog_violations(catalog, self.records["catalog"]),
                    ["catalog: claim changed without a version bump (version 1.0.0)"],
                )

    @staticmethod
    def _otherwise(value: object) -> object:
        """A value of the same kind that is not `value`."""
        if isinstance(value, str):
            return value + " (regenerated)"
        if isinstance(value, int):
            return value + 1
        return {**value, "regenerated": 1}

    def test_a_regeneration_may_change_the_catalog_stamps_without_a_catalog_version_bump(self) -> None:
        """Regenerating the catalog writes a new generated_at and may relabel the rest of the generator's
        output, with no claim changed. When the stamps were digested that took a catalog version bump and a
        re-record of a record whose claim had not moved (owner answer on r4)."""
        self.assertEqual(sorted(set(CATALOG_NOT_DIGESTED) - set(self.catalog)), [], "declared internal, but not in the catalog")
        for field in CATALOG_NOT_DIGESTED:
            with self.subTest(field=field):
                catalog = copy.deepcopy(self.catalog)
                catalog[field] = self._otherwise(catalog[field])
                self.assertNotEqual(catalog[field], self.catalog[field], "the fixture must change the field")
                self.assertEqual(catalog_violations(catalog, self.records["catalog"]), [])
                self.assertEqual(digest_violations(catalog, self.records["records"], self.slugs), [])

    def test_a_field_added_to_the_top_of_the_catalog_is_digested_by_default(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        catalog["issuance_floor_note"] = "x"
        self.assertEqual(
            catalog_violations(catalog, self.records["catalog"]),
            ["catalog: claim changed without a version bump (version 1.0.0)"],
        )
        self.assertIn("issuance_floor_note", record(catalog, self.slugs)["catalog"]["fields"])

    def test_a_catalog_claim_change_with_a_version_bump_is_red_until_recorded(self) -> None:
        catalog = copy.deepcopy(self.catalog)
        catalog["provisional_floors"]["section_exam_pct"] = 50
        catalog["version"] = "1.1.0"
        self.assertEqual(
            catalog_violations(catalog, self.records["catalog"]),
            ["catalog: claim changed under version 1.1.0; re-record the digest"],
        )
        self.assertEqual(catalog_violations(catalog, record(catalog, self.slugs)["catalog"]), [])

    def test_a_catalog_with_no_recorded_digest_is_red(self) -> None:
        self.assertEqual(catalog_violations(self.catalog, None), ["catalog: has no recorded digest"])

    def test_the_badges_are_not_part_of_the_catalog_record(self) -> None:
        """Each badge has its own record under its own version; the catalog record must not move with them,
        or every badge edit would also demand a catalog version bump."""
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["public_claim"] += " (changed)"
        self.assertEqual(catalog_violations(catalog, self.records["catalog"]), [])

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

    def test_the_pointers_the_maintainer_copies_print_are_a_claim(self) -> None:
        """Owner answer on r3: market_evidence_ids is printed as "Market evidence pointers" in the maintainer
        copies, so it is a label. Before, it was declared internal and an edit to it returned []."""
        catalog = copy.deepcopy(self.catalog)
        self._badge(catalog)["market_evidence_ids"].append("industry_reality_brief.md §99 (a new citation)")
        self.assertEqual(
            digest_violations(catalog, self.records["records"], self.slugs),
            ["progress_phase0_walked: claim changed without a version bump (version 1.0.0)"],
        )
        self.assertIn("market_evidence_ids", digested_fields(self.catalog))

    #: What the field was declared, for the tests below: the mechanism is tested on a declared field.
    DECLARED = {"market_evidence_ids": "pointers into the repository's own research files, which no one opens"}

    def test_a_field_declared_internal_may_change_freely(self) -> None:
        """The allow-list is empty today, so the mechanism is tested on a declared field."""
        with mock.patch.dict(NOT_DIGESTED, self.DECLARED):
            catalog = copy.deepcopy(self.catalog)
            recorded = record(catalog, self.slugs)
            self.assertEqual(recorded["left_out"], ["market_evidence_ids"])
            self.assertNotIn("market_evidence_ids", recorded["fields"])
            self._badge(catalog)["market_evidence_ids"].append("industry_reality_brief.md §99 (a new citation)")
            self.assertEqual(digest_violations(catalog, recorded["records"], self.slugs), [])

    def test_the_internal_lists_are_pinned_and_every_entry_is_argued(self) -> None:
        """The allow-lists are the only way a field leaves the digest. No badge field is internal (the owner
        counts market_evidence_ids among the labels); five catalog fields are. A field joins a list by an
        edit to these assertions, with a reason."""
        for level, left_out in INTERNAL_LISTS.items():
            for field, reason in left_out.items():
                with self.subTest(level=level, field=field):
                    self.assertGreaterEqual(len(reason.split()), 8, "a reason, not a label")
        self.assertEqual(sorted(NOT_DIGESTED), [])
        self.assertEqual(
            sorted(CATALOG_NOT_DIGESTED),
            ["badge_count", "family_counts", "generated_at", "generated_by", "specification"],
        )
        self.assertEqual(catalog_fields(self.catalog), ["design_constraints", "provisional_floors", "version"])

    def test_a_field_on_the_internal_list_is_read_by_no_application_code(self) -> None:
        """'Purely internal' is checkable from the code side: nothing under src/ reads the field. The day a
        page, a route or the engine reads it, a learner or a verifier can see it, and it must be digested."""
        for level, left_out in INTERNAL_LISTS.items():
            with self.subTest(level=level):
                self.assertEqual(code_that_reads(left_out), [])

    def test_code_that_reads_an_internal_field_is_found(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            (Path(tmp) / "page.tsx").write_text("const ids = badge.market_evidence_ids\n", encoding="utf-8")
            (Path(tmp) / "other.ts").write_text("const unrelated = 1\n", encoding="utf-8")
            found = code_that_reads(self.DECLARED, Path(tmp))
        self.assertEqual([(Path(path).name, field) for path, field in found], [("page.tsx", "market_evidence_ids")])

    def test_the_guard_flags_what_reads_a_field_and_not_what_only_names_it(self) -> None:
        """The guard asks whether code READS a field. Asked of every mention, it refused `specification`
        (it is in comments and in `specificationVersion`) and `generated_at` (the BadgeCatalog interface
        declares it), so a field no code reads could not be declared internal. Each non-read below is
        a mention the guard must not flag; each read is a spelling it must keep flagging. The last two
        reads are spellings the text pattern before O27 102-S1 missed: a destructuring renamed to an
        upper-case alias, and a comment marker inside a string that hid the read after it."""
        cases = [
            ("a line comment", "specification", "// the executable specification\nconst a = 1\n", False),
            ("a block comment", "specification", "const a = 1 /* the specification */\n", False),
            ("a doc comment", "specification", "/**\n * The specification.\n */\nconst a = 1\n", False),
            ("another identifier", "specification", "const v = credential.specificationVersion\n", False),
            ("a type member", "generated_at", "interface C {\n  generated_at: string\n  badges: Badge[]\n}\n", False),
            ("an optional union member", "generated_at", "type C = {\n  generated_at?: string | null\n}\n", False),
            ("a property access", "specification", "const s = catalog.specification\n", True),
            ("a string key", "specification", "const s = catalog['specification']\n", True),
            ("a renamed destructuring", "generated_at", "const {\n  generated_at: stamp,\n} = catalog\n", True),
            ("a copy into a member", "generated_at", "const o = {\n  generated_at: Catalog.generated_at,\n}\n", True),
            ("text a page shows", "specification", "<p>The specification</p>\n", True),
            ("code after a url", "specification", "const u = 'https://x.y'; const s = c.specification\n", True),
            ("code after a route pattern", "specification", "const m = '/api/*'\nconst s = c.specification\n/* end */\n", True),
            ("an upper-case alias of a destructuring", "generated_at", "const {\n  generated_at: GENERATED_AT,\n} = badgeCatalog\n", True),
            ("comment markers inside strings before a read", "generated_at",
             "const note = 'see //x'\nconst block = 'a /*'\nconst s = catalog.generated_at\nconst h = '*/'\n", True),
        ]
        reads = reads_by_job([
            {"name": label, "file": "case.tsx", "text": text, "fields": [field]} for label, field, text, _ in cases
        ])
        for label, field, _, expected in cases:
            with self.subTest(label):
                self.assertEqual(field in reads[label], expected)

    def test_a_declared_internal_field_that_is_not_in_the_catalog_is_stale(self) -> None:
        with mock.patch.dict(NOT_DIGESTED, self.DECLARED):
            self.assertEqual(stale_declarations(self.catalog), [])
            catalog = copy.deepcopy(self.catalog)
            for badge in catalog["badges"]:
                del badge["market_evidence_ids"]
            self.assertEqual(
                stale_declarations(catalog),
                ["market_evidence_ids: declared internal but no badge has it"],
            )

    def test_no_field_the_contracts_repeat_is_internal(self) -> None:
        """A claim contract is published. A field it repeats from the catalog, or carries as a key, is a
        claim, so it cannot be left out of the digest; the day a contract carries `generated_at`, this fails."""
        for level, left_out in INTERNAL_LISTS.items():
            with self.subTest(level=level):
                self.assertEqual(internal_fields_the_contracts_repeat(left_out), [])
        self.assertEqual(
            internal_fields_the_contracts_repeat(
                {**NOT_DIGESTED, "public_claim": "x", "scoring_rules": "y", "boundary": "z", "published_by_nobody": "w"}
            ),
            ["boundary", "public_claim", "scoring_rules"],
            "SHARED names two of these, the contract files carry the third, and nobody publishes the fourth",
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

    def _floor_edited(self, version: str | None = None) -> dict:
        catalog = copy.deepcopy(self.catalog)
        catalog["provisional_floors"]["section_exam_pct"] = 50
        if version is not None:
            catalog["version"] = version
        return catalog

    def test_a_changed_floor_at_the_same_catalog_version_may_not_be_recorded(self) -> None:
        self.assertEqual(
            refusals(self._floor_edited(), self.previous, self.slugs),
            ["catalog: claim changed and version 1.0.0 is not above the recorded 1.0.0; bump the version first"],
        )

    def test_a_changed_floor_under_a_higher_catalog_version_may_be_recorded(self) -> None:
        self.assertEqual(refusals(self._floor_edited("1.1.0"), self.previous, self.slugs), [])
        self.assertEqual(len(refusals(self._floor_edited("0.9.0"), self.previous, self.slugs)), 1)

    def test_floor_edit_then_record_stays_red_and_writes_nothing(self) -> None:
        """The same scenario as a badge edit, for the catalog: a floor edit, no bump, `--record`, re-run."""
        edited = self._floor_edited()
        self.assertNotEqual(catalog_violations(edited, self.previous["catalog"]), [], "red before --record")
        code, untouched, after = self._run(edited)
        self.assertNotEqual(code, 0)
        self.assertTrue(untouched, "a refused --record leaves the records as they were")
        self.assertNotEqual(catalog_violations(edited, after["catalog"]), [], "still red after --record")

    def test_floor_edit_with_a_catalog_bump_then_record_ends_green(self) -> None:
        edited = self._floor_edited("1.1.0")
        code, untouched, after = self._run(edited)
        self.assertEqual(code, 0)
        self.assertFalse(untouched)
        self.assertEqual(catalog_violations(edited, after["catalog"]), [])
        self.assertEqual(after["catalog"]["version"], "1.1.0")

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
