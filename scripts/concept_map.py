#!/usr/bin/env python3
"""Concept map: where every term is used, and whether it was ever taught.

Built for a validator answering one question — *can a learner meet this word here
without being surprised by it?* — without reading 52 sections to find out.

For each concept it records, in course order: where it is first mentioned, where it is
first defined, how deeply it is taught, whether a worked example uses it, whether an
exercise makes the learner act on it, and whether a self-check tests it.

Depth ladder, from audit/fixer/decisions.md D1 and D3:

  L0  mentioned, never defined anywhere a learner can see  -> a gap
  L1  defined inline at first use (the floor, D1)
  L2  L1 plus a worked example that runs
  L3  L2 plus its own subtopic heading and a figure (D3, for load-bearing concepts)

A concept is "surprising" at a location when the learner reaches it before its first
definition. That is the failure this map exists to make visible.

  python3 scripts/concept_map.py            # rebuild map + per-section pages
  python3 scripts/concept_map.py --check    # exit 1 if any concept is L0 or surprising
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

# Writes a shared course-state report, so it must not run while a gate is measuring.
sys.path.insert(0, str(Path(__file__).resolve().parent))
import report_lock  # noqa: E402
ROOT = Path(__file__).resolve().parents[1]
EVENTS = ROOT / ".fixer/events.json"
OUT_JSON = ROOT / "course-state/concept_map.json"
OUT_DIR = ROOT / "docs/concept-map"

EXAMPLE_KINDS = {"theory.code", "ido.code", "theory.code.explanation"}
EXERCISE_KINDS = {"wedo.instruction", "wedo.tests", "youdo.requirement", "youdo.objective"}
TEST_KINDS = {"selfcheck.question", "selfcheck.option", "selfcheck.explanation"}
HEADING_KINDS = {"theory.heading"}
FIGURE_KINDS = {"theory.figure"}

#: Surfaces where the course is teaching, and a definition can honestly count as the first one.
#
# Everything else may reinforce a concept but cannot introduce it: a learner reaches a weDo
# hint only after trying the exercise, an outcome is a promise made before the lesson, and a
# selfcheck option is a quiz answer. 18 of 77 defined concepts were credited to one of those,
# `distribución normal` to a *distractor* — the quiz that tests a concept was recorded as the
# place that taught it. That is exactly the surprise this map exists to detect, scored as if
# it were fine.
TEACHING_KINDS = {
    "theory.paragraph", "theory.callout", "theory.heading", "theory.code.explanation",
    "ido.why", "ido.preamble", "ido.description", "ido.intro", "ido.retrospective",
    "wedo.intro", "youdo.context", "jobRelevance", "tagline",
    # D1 names tagline, learningOutcomes and jobRelevance in one breath - a preview surface is
    # not exempt from define-before-use, so a gloss written there counts. Leaving `outcome` out
    # while keeping the other two was inconsistent, and it scored `ruff` as never explained
    # across 39 uses while S01's outcome said "Ruff es un programa que señala algunos errores".
    "outcome",
    # We Do is a teaching phase in gradual release - the learner works *with guidance*, and the
    # preamble and instruction are that guidance. A hint is different: it is revealed after the
    # learner is already stuck, so it still cannot count as where a term was introduced.
    "wedo.preamble", "wedo.instruction",
}


def sources_newer_than_cache() -> bool:
    """Has anything the extractor reads changed since the cache was written?

    The cache used to be trusted whenever it existed, so a map could describe a course
    that no longer existed: the 2026-09-17 gap round built its dossiers from an
    events.json eight hours older than the sections it was diagnosing, and two of the
    entries it diagnosed had already been fixed. `gate.py` refreshes the file on every
    run; nothing else did.
    """
    if not EVENTS.exists():
        return True
    cached = EVENTS.stat().st_mtime
    watched = list((ROOT / "src/lib/course/sections").glob("*.ts"))
    watched += [ROOT / "src/lib/glossary/terms.ts", ROOT / "src/lib/course/index.ts",
                ROOT / "scripts/course_event_extractor.mts"]
    return any(p.exists() and p.stat().st_mtime > cached for p in watched)


def load_events() -> dict:
    if not sources_newer_than_cache():
        return json.loads(EVENTS.read_text(encoding="utf-8"))
    proc = subprocess.run(["npx", "tsx", "scripts/course_event_extractor.mts"],
                          cwd=ROOT, capture_output=True, text=True)
    if proc.returncode != 0:
        print(proc.stderr[-1500:], file=sys.stderr)
        raise SystemExit("extractor failed")
    EVENTS.parent.mkdir(parents=True, exist_ok=True)
    EVENTS.write_text(proc.stdout, encoding="utf-8")
    return json.loads(proc.stdout)


def main() -> int:
    report_lock.refuse_if_busy(__file__)
    payload = load_events()
    slugs = payload["active_section_ids"]
    order = {s: i for i, s in enumerate(slugs)}
    tag = {s: f"S{i+1:02d}" for i, s in enumerate(slugs)}
    terms = {t["id"]: t for t in payload["terms"]}

    events = sorted(
        (e for e in payload["events"] if e["section_id"] in order),
        key=lambda e: (order[e["section_id"]], e["display_order"]),
    )

    concepts: dict[str, dict] = {
        tid: {"id": tid, "declared_first_section": t.get("firstSectionId"),
              "uses": [], "definitions": [], "examples": [], "exercises": [],
              "self_checks": [], "headings": [], "figures": []}
        for tid, t in terms.items()
    }

    for e in events:
        visible = e["learner_visible"]
        for tid in e["mentions"]:
            c = concepts.get(tid)
            if c is None:
                continue
            rec = {"section": tag[e["section_id"]], "location": e["location"],
                   "kind": e["kind"], "visible": visible}
            c["uses"].append(rec)
            if visible and tid in e["defines"]:
                c["definitions"].append(rec)
            if visible and e["kind"] in EXAMPLE_KINDS:
                c["examples"].append(rec)
            if visible and e["kind"] in EXERCISE_KINDS:
                c["exercises"].append(rec)
            if visible and e["kind"] in TEST_KINDS:
                c["self_checks"].append(rec)
            if visible and e["kind"] in HEADING_KINDS:
                c["headings"].append(rec)
            if visible and e["kind"] in FIGURE_KINDS:
                c["figures"].append(rec)

    for c in concepts.values():
        vis = [u for u in c["uses"] if u["visible"]]
        c["first_use"] = vis[0] if vis else None
        teaching = [d for d in c["definitions"] if d["kind"] in TEACHING_KINDS]
        c["first_definition"] = teaching[0] if teaching else None
        # Kept so a reviewer can see the course does say something about the term somewhere,
        # without that standing in for having taught it.
        c["reinforcements"] = [d for d in c["definitions"] if d["kind"] not in TEACHING_KINDS]
        if not c["first_definition"]:
            c["depth"] = "L0"
        elif c["headings"] and c["figures"] and c["examples"]:
            # L3 is L2 plus orientation and a figure (D3), so it cannot skip the worked
            # example; checking it before L2 let a heading and a figure alone score highest.
            c["depth"] = "L3"
        elif c["examples"]:
            c["depth"] = "L2"
        else:
            c["depth"] = "L1"
        # uses a learner meets before the concept is ever defined
        if c["first_definition"]:
            di = next(i for i, u in enumerate(vis) if u is c["first_definition"]) \
                if c["first_definition"] in vis else 0
            # A subsection title naming what its own first paragraph defines is the
            # orientation D3 asks for: the learner reads "Broadcasting y compatibilidad de
            # shapes" and the definition two lines below, with nothing in between. Counting
            # the heading as a surprise made ten concepts look unteaching, and for p-value it
            # was the only entry.
            block = c["first_definition"]["location"].rsplit(".", 1)[0]
            c["surprising_uses"] = [
                u for u in vis[:di]
                if not (u["kind"] == "theory.heading"
                        and u["location"].rsplit(".", 1)[0] == block)
            ]
        else:
            c["surprising_uses"] = vis
        c["sections_used"] = sorted({u["section"] for u in vis})
        # D5: load-bearing = taught with a worked example and reused across sections.
        # Those earn 5-10 visuals first; everything else earns at least one where a
        # visual has work to do.
        c["load_bearing"] = c["depth"] in ("L2", "L3") and len(c["sections_used"]) >= 3
        c["figure_target"] = 5 if c["load_bearing"] else 1
        c["figure_count"] = len(c["figures"])
        c["figure_gap"] = max(0, c["figure_target"] - c["figure_count"])
        # How far a learner carries a guess before the course corrects it. A term
        # explained one section late is a slip; tipo-de-dato first used in S06 and
        # explained in S45 means 39 sections of reading built on a guess.
        fu, fd = c["first_use"], c["first_definition"]
        if fu and fd:
            c["explanation_lag_sections"] = max(
                0, int(fd["section"][1:]) - int(fu["section"][1:]))
        else:
            c["explanation_lag_sections"] = None

    OUT_JSON.write_text(json.dumps(concepts, indent=1, ensure_ascii=False), encoding="utf-8")
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    def row(c: dict) -> str:
        fu, fd = c["first_use"], c["first_definition"]
        flag = "🔴" if c["depth"] == "L0" else ("🟠" if c["surprising_uses"] else "🟢")
        return (f"| {flag} `{c['id']}` | {c['depth']} | "
                f"{fu['section'] + ' · ' + fu['location'].split('.', 1)[-1] if fu else '—'} | "
                f"{fd['section'] + ' · ' + fd['location'].split('.', 1)[-1] if fd else '**never**'} | "
                f"{len(c['surprising_uses'])} | {len(c['examples'])} | "
                f"{len(c['exercises'])} | {len(c['self_checks'])} | "
                f"{('+' + str(c['explanation_lag_sections'])) if c.get('explanation_lag_sections') else '·'} | "
                f"{c['figure_count']}/{c['figure_target']}"
                f"{' ⚠' if c['figure_gap'] else ''} | "
                f"{len(c['sections_used'])} |")

    header = ("| concept | depth | first use | first explained | surprising | examples "
              "| exercised | self-check | lag | figures | sections |"
              "\n|---|---|---|---|---:|---:|---:|---:|---:|---:|---:|")
    ordered = sorted(concepts.values(),
                     key=lambda c: (c["depth"] != "L0", -len(c["surprising_uses"]), c["id"]))

    gaps = [c for c in ordered if c["depth"] == "L0"]
    surprising = sorted(
        (c for c in ordered if c["depth"] != "L0" and c["surprising_uses"]),
        key=lambda c: -(c.get("explanation_lag_sections") or 0))

    idx = [
        "# Concept map", "",
        "Where every concept is used, and whether it was taught before the learner met it.",
        "", "The question this answers: *can a learner reach this word here without being",
        "surprised by it?* 🔴 never explained · 🟠 used before it is explained · 🟢 explained first.",
        "", "Depth: **L0** never defined · **L1** defined inline at first use · "
        "**L2** plus a worked example · **L3** plus its own subtopic and a figure.", "",
        f"**{len(concepts)} concepts.** {len(gaps)} never explained, "
        f"{len(surprising)} used before they are explained, "
        f"{len(concepts) - len(gaps) - len(surprising)} clean.", "",
        "Per section: " + " · ".join(f"[{tag[s]}]({tag[s]}.md)" for s in slugs), "",
        "## Never explained anywhere", "",
        header,
    ]
    idx += [row(c) for c in gaps] or ["| _none_ |"]
    idx += ["", "## Used before they are explained", "", header]
    idx += [row(c) for c in surprising] or ["| _none_ |"]
    idx += ["", "## Explained before first use", "", header]
    idx += [row(c) for c in ordered if c["depth"] != "L0" and not c["surprising_uses"]]
    (OUT_DIR / "INDEX.md").write_text("\n".join(idx) + "\n", encoding="utf-8")

    # per-section pages
    for slug in slugs:
        t = tag[slug]
        used = [c for c in ordered if t in c["sections_used"]]
        intro = [c for c in used if c["first_definition"]
                 and c["first_definition"]["section"] == t]
        risky = [c for c in used if any(u["section"] == t for u in c["surprising_uses"])]
        page = [
            f"# {t} — concept map", "",
            f"[← all concepts](INDEX.md)", "",
            f"**{len(used)} concepts appear in {t}.** {len(intro)} are first explained here; "
            f"**{len(risky)} are used here before any explanation**.", "",
            "## Used here before they are explained", "",
            "These are what surprises a learner in this section.", "", header,
        ]
        page += [row(c) for c in risky] or ["| _none_ |"]
        page += ["", "## First explained here", "", header]
        page += [row(c) for c in intro] or ["| _none_ |"]
        page += ["", "## Also used here (explained earlier)", "", header]
        page += [row(c) for c in used if c not in risky and c not in intro] or ["| _none_ |"]
        (OUT_DIR / f"{t}.md").write_text("\n".join(page) + "\n", encoding="utf-8")

    print(json.dumps({
        "concepts": len(concepts),
        "never_explained": len(gaps),
        "used_before_explained": len(surprising),
        "clean": len(concepts) - len(gaps) - len(surprising),
        "depth": {d: sum(1 for c in concepts.values() if c["depth"] == d)
                  for d in ("L0", "L1", "L2", "L3")},
        "load_bearing": sum(1 for c in concepts.values() if c["load_bearing"]),
        "figures_present": sum(c["figure_count"] for c in concepts.values()),
        "figures_missing_to_target": sum(c["figure_gap"] for c in concepts.values()),
        "explained_a_section_or_more_late": sum(
            1 for c in concepts.values() if (c.get("explanation_lag_sections") or 0) > 0),
        "worst_explanation_lag": max(
            [(c.get("explanation_lag_sections") or 0, k) for k, c in concepts.items()]),
        "pages": str(OUT_DIR.relative_to(ROOT)),
    }, indent=2))

    if "--check" in sys.argv and (gaps or surprising):
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
