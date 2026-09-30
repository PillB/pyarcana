#!/usr/bin/env python3
"""Build a synced concept/skills readiness map for the PyArcana curriculum.

This companion to ``scripts/concept_map.py`` answers a stricter question than
"was the term defined?": *has the learner received enough teaching and practice
for the way the course now asks them to use the concept?*

Inputs are intentionally repository-local and deterministic:
- course-state/concept_map.json (generated from the real COURSE_SECTIONS runtime)
- industry_alignment/badge_catalog.json
- upload/learning_roadmap_52_V3.md (authoritative architecture / capstone gates)

The script does NOT pretend to verify the deployed website. Live-browser evidence
is maintained separately because deployment can drift from the repository. It also
does not infer that a badge skill-node and a glossary concept are semantically
identical merely because their names look similar; badge linkage is therefore
reported through the badge's explicit required_sections unless a future registry
provides an exact crosswalk.

Usage:
    python3 scripts/concept_map.py
    python3 scripts/skills_content_readiness_map.py --write
    python3 scripts/skills_content_readiness_map.py --check
    python3 scripts/skills_content_readiness_map.py --strict

``--check`` validates the map's structural invariants and prints a summary.
``--strict`` additionally fails while pedagogical dependency gaps remain. Keeping
those modes separate lets the validator land before the known gaps are repaired.
"""
from __future__ import annotations

import argparse
import json
import re
from collections import defaultdict
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Iterable

ROOT = Path(__file__).resolve().parents[1]
CONCEPT_MAP = ROOT / "course-state/concept_map.json"
BADGE_CATALOG = ROOT / "industry_alignment/badge_catalog.json"
ROADMAP = ROOT / "upload/learning_roadmap_52_V3.md"
OUT_JSON = ROOT / "course-state/skills_content_readiness_map.json"
OUT_MD = ROOT / "docs/concept-map/READINESS.md"

SECTION_RE = re.compile(r"^S(?P<n>\d{2})$")
CAPSTONE_ROW_RE = re.compile(
    r"^\|\s*(?P<id>CP-(?:N\d-[ABC]|FINAL))\s*\|\s*(?P<gate>S\d{1,2})\s*\|\s*"
    r"(?P<title>[^|]+?)\s*\|\s*(?P<evidence>[^|]+?)\s*\|\s*$"
)

# Existing concept_map.py defines L3 as: definition + runnable example + its own
# heading + figure. Numeric order allows transparent minimum-depth comparisons.
DEPTH_RANK = {"L0": 0, "L1": 1, "L2": 2, "L3": 3}


@dataclass(frozen=True)
class Requirement:
    level: str
    minimum_depth: str
    needs_exercise: bool
    needs_self_check: bool
    reason: str


def section_number(tag: str) -> int:
    m = SECTION_RE.match(tag)
    if not m:
        raise ValueError(f"invalid section tag: {tag!r}")
    return int(m.group("n"))


def normalize_section(value: str) -> str:
    value = value.strip().upper()
    m = re.fullmatch(r"S0?(\d{1,2})", value)
    if not m:
        raise ValueError(f"invalid section reference: {value!r}")
    n = int(m.group(1))
    if not 1 <= n <= 52:
        raise ValueError(f"section outside S01..S52: {value!r}")
    return f"S{n:02d}"


def event_sections(events: Iterable[dict[str, Any]]) -> set[str]:
    return {e["section"] for e in events if e.get("section")}


def concept_requirement(c: dict[str, Any]) -> Requirement:
    """Infer the *teaching* burden from observable learner actions.

    Q1/Q2 rule encoded here:
    - incidental mention -> recognition is enough (L1) if the term is useful;
    - learner must act on it -> application requires definition + worked example
      + an exercise (L2);
    - load-bearing/reused concept -> integration requires a dedicated teaching
      block (L3), exercise and at least one self-check.

    This is deliberately conservative. A reviewer can lower a requirement only by
    documenting that the first use is throwaway and should instead be removed.
    """
    if c.get("load_bearing"):
        return Requirement(
            level="integrate",
            minimum_depth="L3",
            needs_exercise=True,
            needs_self_check=True,
            reason="load-bearing concept reused across the curriculum",
        )
    if c.get("exercises") or c.get("self_checks"):
        return Requirement(
            level="apply",
            minimum_depth="L2",
            needs_exercise=True,
            needs_self_check=False,
            reason="learner is asked to act on or answer about the concept",
        )
    return Requirement(
        level="recognize",
        minimum_depth="L1",
        needs_exercise=False,
        needs_self_check=False,
        reason="incidental/reading use only; reviewer may remove it if nonessential",
    )


def readiness_for_concept(c: dict[str, Any]) -> dict[str, Any]:
    req = concept_requirement(c)
    depth = c.get("depth", "L0")
    surprising = c.get("surprising_uses") or []
    issues: list[str] = []

    if DEPTH_RANK.get(depth, -1) < DEPTH_RANK[req.minimum_depth]:
        issues.append(f"depth {depth} < required {req.minimum_depth} for {req.level}")
    if surprising:
        issues.append(f"{len(surprising)} learner-visible use(s) occur before first teaching")
    if req.needs_exercise and not c.get("exercises"):
        issues.append("no learner exercise evidence")
    if req.needs_self_check and not c.get("self_checks"):
        issues.append("no self-check evidence for a load-bearing concept")

    # The two user-mandated questions are materialized, not left as process prose.
    first_use = c.get("first_use")
    first_definition = c.get("first_definition")
    q1 = (
        "Explain at first use"
        if first_use and (not first_definition or first_use["section"] == first_definition["section"])
        else f"Move/teach before {first_use['section']}" if first_use else "No visible use"
    )
    q2 = (
        "Keep and teach: learner applies/integrates it"
        if req.level in {"apply", "integrate"}
        else "Reviewer decision: keep with gloss only if useful; otherwise remove throwaway use"
    )

    return {
        "concept": c["id"],
        "requirement_level": req.level,
        "minimum_depth": req.minimum_depth,
        "observed_depth": depth,
        "first_use": first_use,
        "first_definition": first_definition,
        "sections_used": c.get("sections_used", []),
        "examples": len(c.get("examples", [])),
        "exercises": len(c.get("exercises", [])),
        "self_checks": len(c.get("self_checks", [])),
        "surprising_uses": len(surprising),
        "explanation_lag_sections": c.get("explanation_lag_sections"),
        "status": "READY" if not issues else "GAP",
        "issues": issues,
        "decision_questions": {
            "q1_explain_here_or_when": q1,
            "q2_keep_or_remove_throwaway": q2,
        },
        "self_critique": (
            "What prerequisite, example, failure mode, or wording could still confuse a novice here? "
            "If the learner must perform the concept, is the worked example and independent practice sufficient?"
        ),
    }


def parse_capstones(text: str) -> list[dict[str, str]]:
    rows: list[dict[str, str]] = []
    for line in text.splitlines():
        m = CAPSTONE_ROW_RE.match(line)
        if not m:
            continue
        rows.append(
            {
                "capstone_id": m.group("id"),
                "gate": normalize_section(m.group("gate")),
                "title": m.group("title").strip(),
                "published_evidence": m.group("evidence").strip(),
            }
        )
    return rows


def build_section_index(readiness: list[dict[str, Any]]) -> dict[str, dict[str, Any]]:
    sections: dict[str, dict[str, Any]] = {
        f"S{n:02d}": {"concepts": [], "first_taught": [], "gaps": []} for n in range(1, 53)
    }
    for r in readiness:
        for sec in r["sections_used"]:
            if sec in sections:
                sections[sec]["concepts"].append(r["concept"])
        fd = r.get("first_definition")
        if fd and fd.get("section") in sections:
            sections[fd["section"]]["first_taught"].append(r["concept"])
        for use in (r.get("first_use"),):
            if use and use.get("section") in sections and r["status"] == "GAP":
                sections[use["section"]]["gaps"].append(r["concept"])
    for payload in sections.values():
        for key in payload:
            payload[key] = sorted(set(payload[key]))
    return sections


def badge_dependency_map(
    badges: list[dict[str, Any]], section_index: dict[str, dict[str, Any]]
) -> tuple[list[dict[str, Any]], list[str]]:
    out: list[dict[str, Any]] = []
    structural_errors: list[str] = []
    badge_ids = {b.get("badge_id") for b in badges}

    for badge in badges:
        bid = badge.get("badge_id", "<missing-id>")
        required_sections: list[str] = []
        for raw in badge.get("required_sections", []):
            try:
                required_sections.append(normalize_section(raw))
            except ValueError as exc:
                structural_errors.append(f"{bid}: {exc}")
        missing_prereqs = [p for p in badge.get("prerequisite_badges", []) if p not in badge_ids]
        if missing_prereqs:
            structural_errors.append(f"{bid}: unknown prerequisite badge(s): {missing_prereqs}")

        gap_concepts = sorted(
            {
                concept
                for sec in required_sections
                for concept in section_index.get(sec, {}).get("gaps", [])
            }
        )
        out.append(
            {
                "badge_id": bid,
                "name": badge.get("name"),
                "credential_type": badge.get("credential_type"),
                "required_sections": required_sections,
                "prerequisite_badges": badge.get("prerequisite_badges", []),
                "skill_nodes": badge.get("skill_nodes", []),
                "dependency_gap_concepts": gap_concepts,
                "readiness": "NEEDS_REVIEW" if gap_concepts else "SECTION_DEPENDENCIES_CLEAN",
                "note": (
                    "Readiness is dependency-based only. No semantic skill-node↔concept match is inferred "
                    "without an explicit crosswalk, and this does not prove that badge evidence is actually collected."
                ),
            }
        )
    return out, structural_errors


def capstone_dependency_map(
    capstones: list[dict[str, str]], readiness: list[dict[str, Any]]
) -> list[dict[str, Any]]:
    gap_by_first_use: dict[int, set[str]] = defaultdict(set)
    for r in readiness:
        fu = r.get("first_use")
        if r["status"] == "GAP" and fu:
            gap_by_first_use[section_number(fu["section"])].add(r["concept"])

    out: list[dict[str, Any]] = []
    for cp in capstones:
        gate_n = section_number(cp["gate"])
        open_before_gate = sorted(
            {concept for n, concepts in gap_by_first_use.items() if n <= gate_n for concept in concepts}
        )
        out.append(
            {
                **cp,
                "open_concept_gaps_at_or_before_gate": open_before_gate,
                "readiness": "NEEDS_REVIEW" if open_before_gate else "CONCEPT_SEQUENCE_CLEAN",
                "policy": (
                    "No retroactive award. If a required mature concept is not ready by this gate, "
                    "rewrite the dependency, teach it with sufficient practice before the gate, or move the gate. "
                    "A trust-me primer is allowed only for mechanical/incidental operations the learner is not being assessed on."
                ),
            }
        )
    return out


def validate_inputs(concepts: dict[str, Any], badges: list[dict[str, Any]], capstones: list[dict[str, str]]) -> list[str]:
    errors: list[str] = []
    if not concepts:
        errors.append("concept map is empty")
    if len(capstones) != 13:
        errors.append(f"expected 13 capstones from V3, parsed {len(capstones)}")
    gates = [c["gate"] for c in capstones]
    expected_gates = ["S04", "S08", "S13", "S17", "S21", "S26", "S30", "S34", "S39", "S43", "S47", "S51", "S52"]
    if gates != expected_gates:
        errors.append(f"capstone gates differ from V3 contract: {gates!r}")
    if not badges:
        errors.append("badge catalog contains no badges")
    return errors


def markdown_report(payload: dict[str, Any]) -> str:
    summary = payload["summary"]
    lines = [
        "# Skills/content readiness map",
        "",
        "> Generated from the current runtime concept map, V3 capstone contract and badge catalog.",
        "> Live-site verification is intentionally separate; repository truth and deployment truth can drift.",
        "",
        "## Summary",
        "",
        f"- Concepts: **{summary['concepts']}**",
        f"- Ready at required teaching depth: **{summary['ready']}**",
        f"- Dependency/teaching gaps: **{summary['gaps']}**",
        f"- Capstones parsed: **{summary['capstones']}**",
        f"- Badges parsed: **{summary['badges']}**",
        "",
        "## Decision rule",
        "",
        "For every first use ask: **(1)** can/should this concept be fully explained here, or must the use move? "
        "**(2)** is the concept actually needed here, or is it a throwaway term that should be removed? "
        "A concept the learner must apply requires definition + worked example + practice; a load-bearing concept "
        "requires a dedicated teaching block and assessment evidence. A gloss is not enough.",
        "",
        "## Per-section sitemap",
        "",
        "| Section | concepts used | first taught here | gaps first encountered here |",
        "|---|---:|---:|---|",
    ]
    for sec, s in payload["sections"].items():
        gaps = ", ".join(f"`{x}`" for x in s["gaps"][:10])
        if len(s["gaps"]) > 10:
            gaps += f" … +{len(s['gaps']) - 10}"
        lines.append(f"| {sec} | {len(s['concepts'])} | {len(s['first_taught'])} | {gaps or '—'} |")

    lines += ["", "## Open concept gaps", "", "| concept | need | observed | first use | first teaching | why open |", "|---|---|---|---|---|---|"]
    for r in payload["concepts"]:
        if r["status"] != "GAP":
            continue
        fu = r.get("first_use") or {}
        fd = r.get("first_definition") or {}
        why = "; ".join(r["issues"]).replace("|", "\\|")
        lines.append(
            f"| `{r['concept']}` | {r['requirement_level']} / {r['minimum_depth']} | {r['observed_depth']} | "
            f"{fu.get('section', '—')} | {fd.get('section', '—')} | {why} |"
        )

    lines += ["", "## Capstone dependency review", "", "| capstone | gate | status | open concept gaps at/before gate |", "|---|---|---|---:|"]
    for cp in payload["capstones"]:
        lines.append(
            f"| {cp['capstone_id']} | {cp['gate']} | {cp['readiness']} | {len(cp['open_concept_gaps_at_or_before_gate'])} |"
        )

    lines += ["", "## Badge dependency review", "", "| badge | type | sections | status | dependency gaps |", "|---|---|---:|---|---:|"]
    for b in payload["badges"]:
        lines.append(
            f"| `{b['badge_id']}` | {b.get('credential_type') or '—'} | {len(b['required_sections'])} | "
            f"{b['readiness']} | {len(b['dependency_gap_concepts'])} |"
        )

    lines += [
        "",
        "## Limits",
        "",
        "- This map is a prerequisite/readiness audit, not a badge-award engine.",
        "- It does not assume that a section dependency proves a badge skill claim; an explicit skill crosswalk is still required.",
        "- It does not infer live deployment state. Keep a dated browser-validation ledger next to this generated map.",
        "- A `READY` concept can still contain bad prose or wrong examples; paragraph-level QA remains mandatory.",
        "",
    ]
    return "\n".join(lines)


def build_payload() -> tuple[dict[str, Any], list[str]]:
    concepts = json.loads(CONCEPT_MAP.read_text(encoding="utf-8"))
    badge_payload = json.loads(BADGE_CATALOG.read_text(encoding="utf-8"))
    roadmap_text = ROADMAP.read_text(encoding="utf-8")
    badges = badge_payload.get("badges", [])
    capstones = parse_capstones(roadmap_text)

    errors = validate_inputs(concepts, badges, capstones)
    readiness = [readiness_for_concept(c) for c in concepts.values()]
    readiness.sort(key=lambda r: (r["status"] != "GAP", r["concept"]))
    sections = build_section_index(readiness)
    badge_map, badge_errors = badge_dependency_map(badges, sections)
    errors.extend(badge_errors)
    capstone_map = capstone_dependency_map(capstones, readiness)

    gap_count = sum(r["status"] == "GAP" for r in readiness)
    payload = {
        "schema_version": "1.0",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "sources": {
            "concept_map": str(CONCEPT_MAP.relative_to(ROOT)),
            "badge_catalog": str(BADGE_CATALOG.relative_to(ROOT)),
            "roadmap": str(ROADMAP.relative_to(ROOT)),
            "live_site": "NOT_CHECKED_BY_SCRIPT",
        },
        "policy": {
            "no_retroactive_awards": True,
            "primer_allowed_only_for_incidental_mechanics": True,
            "mature_dependency_order": ["rewrite_dependency", "teach_and_practice_before_gate", "move_gate"],
            "required_questions": [
                "Can/should the concept be explained sufficiently where it is first used, or must the use move?",
                "Is the concept needed at first use, or is it a throwaway term that should be removed?",
            ],
        },
        "summary": {
            "concepts": len(readiness),
            "ready": len(readiness) - gap_count,
            "gaps": gap_count,
            "capstones": len(capstone_map),
            "badges": len(badge_map),
        },
        "concepts": readiness,
        "sections": sections,
        "capstones": capstone_map,
        "badges": badge_map,
        "structural_errors": errors,
    }
    return payload, errors


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    mode = parser.add_mutually_exclusive_group()
    mode.add_argument("--write", action="store_true", help="write JSON + Markdown outputs")
    mode.add_argument("--check", action="store_true", help="validate structural invariants only")
    mode.add_argument("--strict", action="store_true", help="also fail while pedagogical gaps remain")
    args = parser.parse_args()

    for path in (CONCEPT_MAP, BADGE_CATALOG, ROADMAP):
        if not path.exists():
            raise SystemExit(f"missing input: {path.relative_to(ROOT)}")

    payload, errors = build_payload()
    summary = payload["summary"]
    print(json.dumps(summary, ensure_ascii=False, sort_keys=True))

    if args.write or not (args.check or args.strict):
        OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
        OUT_MD.parent.mkdir(parents=True, exist_ok=True)
        OUT_JSON.write_text(json.dumps(payload, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        OUT_MD.write_text(markdown_report(payload), encoding="utf-8")
        print(f"wrote {OUT_JSON.relative_to(ROOT)}")
        print(f"wrote {OUT_MD.relative_to(ROOT)}")

    if errors:
        for error in errors:
            print(f"STRUCTURAL ERROR: {error}")
        return 2
    if args.strict and summary["gaps"]:
        print(f"PEDAGOGICAL GAPS: {summary['gaps']}")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
