#!/usr/bin/env python3
"""
Lesson redaction/coherence auditor (local, deterministic).

Reads Playwright-visible paragraph dumps + source TS and produces an audit
decision: ACCEPT | REJECT_HARDENING | REQUEST_FIX with concrete issues.

Usage:
  python3 scripts/lesson_auditor_agent.py --section 28
  python3 scripts/lesson_auditor_agent.py --from 27 --to 35
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIS = ROOT / "course-state/curriculum_hardening/visible_paragraphs"
OUT = ROOT / "course-state/curriculum_hardening/audits"
SECTIONS = ROOT / "src/lib/course/sections"

BOILER_MARKERS = [
    "En el laboratorio sintético Red Andina (Lima) documentas entrada, salida, error y dueño",
    "En el laboratorio sintético documentas entrada, salida, error y dueño",
    "documentas entrada, salida, error y dueño: sin PII real, sin secretos en logs",
    "sin PII real, sin secretos en logs y con fail-closed cuando falta evidencia",
]


def load_visible(index: int) -> dict | None:
    matches = list(VIS.glob(f"s{index:02d}_*.json"))
    # exclude report files
    matches = [m for m in matches if m.name.count("_") >= 1 and "REPORT" not in m.name]
    if not matches:
        return None
    return json.loads(matches[0].read_text(encoding="utf-8"))


def load_source(index: int) -> tuple[Path, str]:
    paths = list(SECTIONS.glob(f"s{index:02d}-*.ts"))
    # prefer active-looking (export const sectionN)
    for p in paths:
        t = p.read_text(encoding="utf-8")
        if re.search(rf"export const section{index}\b", t):
            return p, t
    p = paths[0]
    return p, p.read_text(encoding="utf-8")


def audit_section(index: int) -> dict:
    vis = load_visible(index)
    path, src = load_source(index)
    issues: list[dict] = []

    if not vis or not vis.get("ok"):
        issues.append(
            {
                "code": "no_visible_crawl",
                "severity": "high",
                "detail": "Playwright crawl missing or failed — cannot certify user-visible redaction",
            }
        )
        return decision(index, path, issues, vis, "REQUEST_FIX")

    paras = [a for a in vis.get("analysis", []) if a.get("text")]
    texts = [a["text"] for a in paras]

    # Boilerplate density
    boiler_hits = sum(1 for t in texts if any(b in t for b in BOILER_MARKERS))
    if boiler_hits >= 3:
        issues.append(
            {
                "code": "boilerplate_density",
                "severity": "high",
                "detail": f"{boiler_hits} visible paragraphs share Red Andina ethics tail — bad redaction for readers",
            }
        )
    elif boiler_hits == 1:
        issues.append(
            {
                "code": "boilerplate_once_ok",
                "severity": "info",
                "detail": "Ethics lab disclaimer appears once — acceptable if map-level",
            }
        )

    # Duplicate near-identical paragraphs
    norms = [re.sub(r"\s+", " ", t.strip().lower())[:160] for t in texts]
    c = Counter(norms)
    dups = [(k, v) for k, v in c.items() if v >= 3 and len(k) > 50]
    if dups:
        issues.append(
            {
                "code": "duplicate_visible_paragraphs",
                "severity": "high",
                "detail": f"{len(dups)} paragraph stems repeated ≥3× in user view",
                "examples": [d[0][:100] for d in dups[:3]],
            }
        )

    # Theater / placeholders still visible
    theater = [t for t in texts if re.search(r"completa solo print", t, re.I)]
    if theater:
        issues.append(
            {
                "code": "visible_theater",
                "severity": "high",
                "detail": f"{len(theater)} paragraphs still expose print-theater language",
            }
        )

    stubs = [t for t in texts if re.search(r"(?:^|[^A-Za-z])(?:TODO|FIXME|PLACEHOLDER)(?:[^A-Za-z]|$)", t)]
    if stubs:
        issues.append(
            {
                "code": "visible_stub_marker",
                "severity": "high",
                "detail": f"{len(stubs)} paragraphs show TODO/FIXME/PLACEHOLDER",
            }
        )

    # Coherence: many ultra-short units in theory view (bad progressive narrative)
    short = [t for t in texts if 0 < len(t) < 50]
    if len(short) >= 15:
        issues.append(
            {
                "code": "fragmented_prose",
                "severity": "med",
                "detail": f"{len(short)} very short visible units (<50 chars) — choppy reading experience",
            }
        )

    # Source-level: repeated ethics append in TS (hardening regression)
    src_boiler = sum(src.count(b) for b in BOILER_MARKERS)
    if src_boiler >= 5:
        issues.append(
            {
                "code": "source_boilerplate_regression",
                "severity": "high",
                "detail": f"Source still contains boilerplate marker {src_boiler}× — prior hardening rejected",
            }
        )

    # Mean visible rank if present
    ranks = [a.get("rank", 9.5) for a in paras]
    mean_rank = sum(ranks) / len(ranks) if ranks else 0

    high = sum(1 for i in issues if i["severity"] == "high")
    if high >= 2 or (high >= 1 and mean_rank < 9.0):
        verdict = "REJECT_HARDENING"
    elif high == 1 or any(i["severity"] == "med" for i in issues):
        verdict = "REQUEST_FIX"
    else:
        verdict = "ACCEPT"

    return decision(index, path, issues, vis, verdict, mean_rank, src_boiler)


def decision(index, path, issues, vis, verdict, mean_rank=0.0, src_boiler=0):
    high = [i for i in issues if i.get("severity") == "high"]
    return {
        "section": index,
        "file": path.name if path else None,
        "verdict": verdict,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "visible_paras": len(vis.get("paragraphs", [])) if vis else 0,
        "mean_visible_rank": round(mean_rank, 2),
        "source_boilerplate_count": src_boiler,
        "high_issue_count": len(high),
        "issues": issues,
        "fix_directives": directives(verdict, issues),
        "auditor": "lesson_auditor_agent.py",
    }


def directives(verdict: str, issues: list[dict]) -> list[str]:
    d = []
    codes = {i["code"] for i in issues}
    if "boilerplate_density" in codes or "source_boilerplate_regression" in codes:
        d.append(
            "REMOVE repeated Red Andina ethics tails from theory paragraphs; keep at most ONE map-level ethics sentence with unique wording."
        )
    if "duplicate_visible_paragraphs" in codes:
        d.append(
            "REWRITE duplicated mechanism paragraphs so each subtopic has distinct content (no copy-paste stems)."
        )
    if "visible_theater" in codes or "visible_stub_marker" in codes:
        d.append("ELIMINATE theater/stub markers from any learner-visible string.")
    if "fragmented_prose" in codes:
        d.append("MERGE choppy UI fragments or expand thin callouts into coherent prose.")
    if verdict == "REJECT_HARDENING":
        d.append(
            "REJECT prior gold-hardening bulk append; restart Curriculum Architect with S01 peer redaction standard."
        )
    if verdict == "ACCEPT":
        d.append("No structural redaction rework required; optional polish only.")
    if not d:
        d.append("Address listed issues with minimal, targeted edits.")
    return d


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", type=int)
    ap.add_argument("--from", dest="from_", type=int, default=1)
    ap.add_argument("--to", type=int, default=52)
    args = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)

    if args.section:
        indices = [args.section]
    else:
        indices = list(range(args.from_, args.to + 1))

    reports = []
    for i in indices:
        rep = audit_section(i)
        reports.append(rep)
        outp = OUT / f"S{i:02d}_AUDIT.json"
        outp.write_text(json.dumps(rep, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"S{i:02d} {rep['verdict']} high={rep['high_issue_count']} mean_rank={rep['mean_visible_rank']}")

    summary = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "accept": sum(1 for r in reports if r["verdict"] == "ACCEPT"),
        "request_fix": sum(1 for r in reports if r["verdict"] == "REQUEST_FIX"),
        "reject_hardening": sum(1 for r in reports if r["verdict"] == "REJECT_HARDENING"),
        "sections": [
            {"index": r["section"], "verdict": r["verdict"], "high": r["high_issue_count"]}
            for r in reports
        ],
    }
    (OUT / "AUDIT_SUMMARY.json").write_text(json.dumps(summary, indent=2), encoding="utf-8")
    print("SUMMARY", summary["accept"], summary["request_fix"], summary["reject_hardening"])


if __name__ == "__main__":
    main()
