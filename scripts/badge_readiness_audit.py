#!/usr/bin/env python3
"""Does the course actually teach what its badges and capstones claim?

A badge names required_sections, required_activities and critical_competencies.
Nothing checked that those sections exist, that the activities are really there to
do, or - the pedagogical question - that a learner reaching the badge has been
taught the vocabulary those sections make them act on.

Reads the badge catalog, the capstone index, and the event stream built by
scripts/course_event_extractor.mts (via scripts/first_use_all_audit.py).
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from pathlib import Path

# Writes a shared course-state report that gate.py now measures, so it must not run while a
# gate is measuring.
sys.path.insert(0, str(Path(__file__).resolve().parent))
import report_lock  # noqa: E402

ROOT = Path(__file__).resolve().parents[1]
CATALOG = ROOT / "src/lib/eligibility/badge_catalog.json"
CAPSTONES = ROOT / "course-state/capstones/INDEX.json"
EVENTS = ROOT / ".fixer/events.json"
FIRST_USE = ROOT / "course-state/first_use_all_report.json"
OUT = ROOT / "course-state/badge_readiness_report.json"
#: Term gaps that leave a learner without a definition before they must use the term.
BLOCKING_GAP_CODES = {"DEFINITION_AFTER_REQUIREMENT", "NO_VISIBLE_DEFINITION"}


def load_events() -> dict:
    if not EVENTS.exists():
        proc = subprocess.run(
            ["npx", "tsx", "scripts/course_event_extractor.mts"],
            cwd=ROOT, capture_output=True, text=True,
        )
        if proc.returncode != 0:
            print(proc.stderr[-2000:], file=sys.stderr)
            raise SystemExit("course_event_extractor.mts failed")
        EVENTS.parent.mkdir(parents=True, exist_ok=True)
        EVENTS.write_text(proc.stdout, encoding="utf-8")
    return json.loads(EVENTS.read_text(encoding="utf-8"))


def section_number(tag: str) -> int | None:
    """`S14` or `s14` to 14; anything else to None."""
    try:
        return int(str(tag).lstrip("Ss"))
    except ValueError:
        return None


def prerequisite_inversions(badges: list[dict]) -> list[dict]:
    """A prerequisite badge must not depend on material taught later than the badge that needs it.

    Compares the last section each badge requires. Equal last sections are not an inversion: the
    prerequisite may finish in the section where the badge begins. A prerequisite missing from the
    catalog is skipped here; the audit reports it as UNKNOWN_PREREQUISITE_BADGE.
    """
    by_id = {b["badge_id"]: b for b in badges}
    found = []
    for badge in badges:
        nums = [n for n in (section_number(s) for s in badge.get("required_sections", [])) if n]
        for pre in badge.get("prerequisite_badges", []):
            prerequisite = by_id.get(pre)
            if prerequisite is None:
                continue
            pnums = [n for n in (section_number(s) for s in prerequisite.get("required_sections", [])) if n]
            if pnums and nums and max(pnums) > max(nums):
                found.append({
                    "badge": badge["badge_id"], "code": "PREREQUISITE_TAUGHT_LATER",
                    "detail": f"{pre} needs S{max(pnums):02d}, after this badge's S{max(nums):02d}",
                })
    return found


def check(owed: int) -> int:
    """Read-only. Exit 0 only when the prerequisite inversions number exactly `owed`.

    Writes nothing and needs no course events, so it can run while a gate is measuring. A count
    that falls must lower the owed number, and a count that rises must be fixed: both directions fail.
    """
    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    found = prerequisite_inversions(catalog["badges"])
    print(json.dumps({"inversions": len(found), "owed": owed, "items": found}, indent=2, ensure_ascii=False))
    return 0 if len(found) == owed else 1


def parse_args(argv: list[str] | None) -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Badge readiness audit.")
    parser.add_argument("--check", action="store_true",
                        help="read-only: report prerequisite inversions and exit 0 only if they equal --owed")
    parser.add_argument("--owed", type=int, default=0, help="the exact inversion count owed (with --check)")
    return parser.parse_args(argv)


def offers_by_slug(payload: dict) -> dict[str, set[str]]:
    """What each section actually offers, straight from the event stream."""
    offers: dict[str, set[str]] = {s: set() for s in payload["active_section_ids"]}
    for e in payload["events"]:
        k = e["kind"]
        if k.startswith("youdo."):
            offers[e["section_id"]].add("YOUDO")
        elif k.startswith("selfcheck."):
            offers[e["section_id"]].add("EXAM")
        elif k.startswith("wedo."):
            offers[e["section_id"]].add("WEDO")
        elif k.startswith("ido."):
            offers[e["section_id"]].add("IDO")
    return offers


def term_gaps_by_slug(offers: dict[str, set[str]]) -> dict[str, list[dict]]:
    """Term gaps, bucketed by the section where the learner is let down."""
    gaps: dict[str, list[dict]] = {}
    if FIRST_USE.exists():
        for issue in json.loads(FIRST_USE.read_text(encoding="utf-8"))["issues"]:
            sec = (issue.get("location") or "").split(".", 1)[0]
            if sec in offers:
                gaps.setdefault(sec, []).append(issue)
    return gaps


def blocking(issues: list[dict]) -> list[dict]:
    return [i for i in issues if i["code"] in BLOCKING_GAP_CODES]


def section_failures(badge: dict, by_num: dict[int, str], offers: dict[str, set[str]]) -> list[dict]:
    """Required sections must exist, and the activities a badge names must really be delivered."""
    bid = badge["badge_id"]
    failures = [
        {"badge": bid, "code": "UNKNOWN_REQUIRED_SECTION", "detail": tag}
        for tag in badge.get("required_sections", [])
        if section_number(tag) not in by_num
    ]
    # required_activities such as S01-YOUDO / S01-EXAM must exist to be done
    for act in badge.get("required_activities", []):
        if not isinstance(act, str) or "-" not in act:
            continue
        tag, _, kind = act.partition("-")
        n = section_number(tag)
        if n is None or n not in by_num:
            continue
        slug = by_num[n]
        if kind in {"YOUDO", "EXAM"} and kind not in offers[slug]:
            failures.append({
                "badge": bid, "code": "ACTIVITY_NOT_DELIVERED",
                "detail": f"{act} but {slug} has no {kind.lower()}",
            })
    return failures


def vocabulary_gaps(nums: list[int], by_num: dict[int, str], gaps: dict[str, list[dict]]) -> list[dict]:
    """The blocking term gaps in the sections a badge requires, each tagged with its section."""
    found = []
    for n in nums:
        slug = by_num.get(n)
        found.extend({"section": slug, **issue} for issue in blocking(gaps.get(slug, [])))
    return found


def badge_report(badges: list[dict], by_num: dict[int, str], offers: dict[str, set[str]],
                 gaps: dict[str, list[dict]]) -> tuple[list[dict], list[dict], list[dict]]:
    """Failures, warnings and report rows for every badge: the pedagogical check runs here too."""
    badge_ids = {b["badge_id"] for b in badges}
    failures: list[dict] = []
    warnings: list[dict] = []
    rows: list[dict] = []
    for b in badges:
        bid = b["badge_id"]
        req_sections = list(b.get("required_sections", []))
        nums = [n for n in (section_number(s) for s in req_sections) if n]
        failures.extend(section_failures(b, by_num, offers))
        failures.extend(
            {"badge": bid, "code": "UNKNOWN_PREREQUISITE_BADGE", "detail": pre}
            for pre in b.get("prerequisite_badges", []) if pre not in badge_ids
        )
        found = vocabulary_gaps(nums, by_num, gaps)
        if found:
            warnings.append({
                "badge": bid, "code": "CLAIMS_UNTAUGHT_VOCABULARY",
                "count": len(found),
                "terms": sorted({i["term_id"] for i in found})[:12],
            })
        rows.append({
            "badge": bid,
            "credential_type": b.get("credential_type"),
            "sections": req_sections,
            "blocking_term_gaps": len(found),
        })
    return failures, warnings, rows


def capstone_report(capstones: list[dict], by_num: dict[int, str],
                    gaps: dict[str, list[dict]]) -> tuple[list[dict], list[dict], list[dict]]:
    """The gate section must exist, and the capstone must be formally ready."""
    failures: list[dict] = []
    warnings: list[dict] = []
    rows: list[dict] = []
    for c in capstones:
        n = section_number(c.get("gate_section", ""))
        slug = by_num.get(n) if n else None
        if slug is None:
            failures.append({"badge": c["id"], "code": "UNKNOWN_CAPSTONE_GATE", "detail": c.get("gate_section")})
            continue
        found = blocking(gaps.get(slug, []))
        if not c.get("formally_ready", False):
            failures.append({"badge": c["id"], "code": "CAPSTONE_NOT_READY", "detail": c.get("execution_status")})
        if found:
            warnings.append({
                "badge": c["id"], "code": "CAPSTONE_GATE_VOCABULARY_GAP",
                "count": len(found),
                "terms": sorted({i["term_id"] for i in found})[:12],
            })
        rows.append({"id": c["id"], "gate_section": slug, "blocking_term_gaps": len(found)})
    return failures, warnings, rows


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if args.check:
        return check(args.owed)
    report_lock.refuse_if_busy(__file__)
    payload = load_events()
    by_num = {i + 1: slug for i, slug in enumerate(payload["active_section_ids"])}  # 1..52
    offers = offers_by_slug(payload)
    gaps = term_gaps_by_slug(offers)

    badges = json.loads(CATALOG.read_text(encoding="utf-8"))["badges"]
    failures, warnings, rows = badge_report(badges, by_num, offers, gaps)
    failures.extend(prerequisite_inversions(badges))

    capstones = json.loads(CAPSTONES.read_text(encoding="utf-8")).get("capstones", [])
    cap_failures, cap_warnings, cap_rows = capstone_report(capstones, by_num, gaps)
    failures.extend(cap_failures)
    warnings.extend(cap_warnings)

    report = {
        "ok": not failures,
        "badges_audited": len(badges),
        "capstones_audited": len(cap_rows),
        "failures": failures,
        "warnings": warnings,
        "badges": rows,
        "capstones": cap_rows,
    }
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps({
        "ok": report["ok"],
        "badges": len(badges),
        "capstones": len(cap_rows),
        "failures": len(failures),
        "warnings": len(warnings),
        "badges_claiming_untaught_vocabulary":
            sum(1 for w in warnings if w["code"] == "CLAIMS_UNTAUGHT_VOCABULARY"),
        "report": str(OUT.relative_to(ROOT)),
    }, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    raise SystemExit(main())
