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

import json
import subprocess
import sys
from pathlib import Path

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


def main() -> int:
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

    def sec_num(tag: str) -> int | None:
        try:
            return int(str(tag).lstrip("Ss"))
        except ValueError:
            return None

    for b in badges:
        bid = b["badge_id"]
        req_sections = [s for s in b.get("required_sections", [])]
        nums = [n for n in (sec_num(s) for s in req_sections) if n]

        for tag in req_sections:
            n = sec_num(tag)
            if n is None or n not in by_num:
                failures.append({"badge": bid, "code": "UNKNOWN_REQUIRED_SECTION", "detail": tag})

        # required_activities such as S01-YOUDO / S01-EXAM must exist to be done
        for act in b.get("required_activities", []):
            if not isinstance(act, str) or "-" not in act:
                continue
            tag, _, kind = act.partition("-")
            n = sec_num(tag)
            if n is None or n not in by_num:
                continue
            slug = by_num[n]
            if kind in {"YOUDO", "EXAM"} and kind not in offers[slug]:
                failures.append({
                    "badge": bid, "code": "ACTIVITY_NOT_DELIVERED",
                    "detail": f"{act} but {slug} has no {kind.lower()}",
                })

        # a prerequisite badge must not depend on material taught later than this one
        for pre in b.get("prerequisite_badges", []):
            if pre not in badge_ids:
                failures.append({"badge": bid, "code": "UNKNOWN_PREREQUISITE_BADGE", "detail": pre})
                continue
            pb = next(x for x in badges if x["badge_id"] == pre)
            pnums = [n for n in (sec_num(s) for s in pb.get("required_sections", [])) if n]
            if pnums and nums and max(pnums) > max(nums):
                failures.append({
                    "badge": bid, "code": "PREREQUISITE_TAUGHT_LATER",
                    "detail": f"{pre} needs S{max(pnums):02d}, after this badge's S{max(nums):02d}",
                })

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

    # capstones: the gate section must exist, and the capstone must be formally ready
    caps = json.loads(CAPSTONES.read_text(encoding="utf-8"))
    cap_rows = []
    for c in caps.get("capstones", []):
        n = sec_num(c.get("gate_section", ""))
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
