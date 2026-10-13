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


def main(argv: list[str] | None = None) -> int:
    args = parse_args(argv)
    if args.check:
        return check(args.owed)
    report_lock.refuse_if_busy(__file__)
    payload = load_events()
    slugs = payload["active_section_ids"]                 # display order
    snum = {slug: i + 1 for i, slug in enumerate(slugs)}  # slug -> 1..52
    by_num = {i + 1: slug for i, slug in enumerate(slugs)}

    # what each section actually offers, straight from the event stream
    offers: dict[str, set[str]] = {s: set() for s in slugs}
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

    catalog = json.loads(CATALOG.read_text(encoding="utf-8"))
    badges = catalog["badges"]
    badge_ids = {b["badge_id"] for b in badges}

    # term gaps, bucketed by the section where the learner is let down
    gaps: dict[str, list[dict]] = {}
    if FIRST_USE.exists():
        for issue in json.loads(FIRST_USE.read_text(encoding="utf-8"))["issues"]:
            loc = issue.get("location") or ""
            sec = loc.split(".", 1)[0]
            if sec in offers:
                gaps.setdefault(sec, []).append(issue)

    failures: list[dict] = []
    warnings: list[dict] = []
    rows = []

    for b in badges:
        bid = b["badge_id"]
        req_sections = [s for s in b.get("required_sections", [])]
        nums = [n for n in (section_number(s) for s in req_sections) if n]

        for tag in req_sections:
            n = section_number(tag)
            if n is None or n not in by_num:
                failures.append({"badge": bid, "code": "UNKNOWN_REQUIRED_SECTION", "detail": tag})

        # required_activities such as S01-YOUDO / S01-EXAM must exist to be done
        for act in b.get("required_activities", []):
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

        for pre in b.get("prerequisite_badges", []):
            if pre not in badge_ids:
                failures.append({"badge": bid, "code": "UNKNOWN_PREREQUISITE_BADGE", "detail": pre})

        # the pedagogical check: vocabulary the badge's own sections make the learner act on
        blocking = []
        for n in nums:
            slug = by_num.get(n)
            for issue in gaps.get(slug, []):
                if issue["code"] in {"DEFINITION_AFTER_REQUIREMENT", "NO_VISIBLE_DEFINITION"}:
                    blocking.append({"section": slug, **issue})
        if blocking:
            warnings.append({
                "badge": bid, "code": "CLAIMS_UNTAUGHT_VOCABULARY",
                "count": len(blocking),
                "terms": sorted({i["term_id"] for i in blocking})[:12],
            })

        rows.append({
            "badge": bid,
            "credential_type": b.get("credential_type"),
            "sections": req_sections,
            "blocking_term_gaps": len(blocking),
        })

    failures.extend(prerequisite_inversions(badges))

    # capstones: the gate section must exist, and the capstone must be formally ready
    caps = json.loads(CAPSTONES.read_text(encoding="utf-8"))
    cap_rows = []
    for c in caps.get("capstones", []):
        n = section_number(c.get("gate_section", ""))
        slug = by_num.get(n) if n else None
        if slug is None:
            failures.append({"badge": c["id"], "code": "UNKNOWN_CAPSTONE_GATE", "detail": c.get("gate_section")})
            continue
        blocking = [
            i for i in gaps.get(slug, [])
            if i["code"] in {"DEFINITION_AFTER_REQUIREMENT", "NO_VISIBLE_DEFINITION"}
        ]
        if not c.get("formally_ready", False):
            failures.append({"badge": c["id"], "code": "CAPSTONE_NOT_READY", "detail": c.get("execution_status")})
        if blocking:
            warnings.append({
                "badge": c["id"], "code": "CAPSTONE_GATE_VOCABULARY_GAP",
                "count": len(blocking),
                "terms": sorted({i["term_id"] for i in blocking})[:12],
            })
        cap_rows.append({"id": c["id"], "gate_section": slug, "blocking_term_gaps": len(blocking)})

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
