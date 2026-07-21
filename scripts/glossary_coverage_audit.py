#!/usr/bin/env python3
"""
Per-section glossary coverage audit.

For each section that *introduces* SSOT terms (firstSectionId == section.id):
  - at least one alias of each intro term should appear in learner-facing prose
    (theory / iDo / weDo intros, not code fences), OR we mark a soft warning.
  - report which sections introduce terms with zero prose hits (P1).

Also lists sections with zero SSOT intros (informational).
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
TERMS_TS = (ROOT / "src/lib/glossary/terms.ts").read_text(encoding="utf-8")
SECTIONS_DIR = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/glossary_coverage_report.json"

terms = []
for m in re.finditer(
    r"id:\s*'([^']+)'[\s\S]*?term:\s*'((?:\\'|[^'])*)'[\s\S]*?aliases:\s*\[([\s\S]*?)\][\s\S]*?firstSectionId:\s*'([^']+)'",
    TERMS_TS,
):
    aliases_raw = m.group(3)
    aliases = re.findall(r"['\"]([^'\"]+)['\"]", aliases_raw)
    term = m.group(2).replace("\\'", "'")
    if term not in aliases:
        aliases = [term] + aliases
    terms.append(
        {
            "id": m.group(1),
            "term": term,
            "aliases": aliases,
            "firstSectionId": m.group(4),
        }
    )

order = []
for m in re.finditer(
    r"import\s+\{\s*section\d+\s*\}\s+from\s+['\"]\./sections/([^'\"]+)['\"]", INDEX
):
    order.append(m.group(1))

section_ids = []
section_prose = {}
for base in order:
    path = SECTIONS_DIR / (base if base.endswith(".ts") else f"{base}.ts")
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    prose = re.sub(r"```[\s\S]*?```", " ", text)
    # strip pure code-ish long lines lightly
    id_m = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", text)
    if not id_m:
        continue
    sid = id_m.group(1)
    section_ids.append(sid)
    section_prose[sid] = prose

by_section: dict[str, list] = {sid: [] for sid in section_ids}
for t in terms:
    if t["firstSectionId"] in by_section:
        by_section[t["firstSectionId"]].append(t)

issues = []
section_rows = []
for sid in section_ids:
    intros = by_section.get(sid, [])
    missing = []
    found = []
    prose = section_prose.get(sid, "")
    for t in intros:
        hit = False
        for al in t["aliases"]:
            if len(al) < 2:
                continue
            if re.search(r"(?i)(?<![\\w/-])" + re.escape(al) + r"(?![\\w/-])", prose):
                hit = True
                break
        if hit:
            found.append(t["id"])
        else:
            missing.append(t["id"])
            issues.append(
                {
                    "sectionId": sid,
                    "termId": t["id"],
                    "term": t["term"],
                    "severity": "P1",
                    "note": "SSOT intro term aliases not found in section prose (hover may not fire)",
                }
            )
    section_rows.append(
        {
            "sectionId": sid,
            "introCount": len(intros),
            "found": len(found),
            "missing": missing,
        }
    )

p1 = [i for i in issues if i["severity"] == "P1"]
report = {
    "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
    "terms": len(terms),
    "sections": len(section_ids),
    "sections_with_intros": sum(1 for r in section_rows if r["introCount"] > 0),
    "p1_missing_prose": len(p1),
    "issues": p1[:200],
    "sections": section_rows,
    "ok": len(p1) == 0,
}
OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False))
print(
    json.dumps(
        {
            "ok": report["ok"],
            "p1_missing_prose": len(p1),
            "sections_with_intros": report["sections_with_intros"],
            "terms": len(terms),
        },
        indent=2,
    )
)
# Coverage audit is advisory for density; exit 0 so CI doesn't block on soft gaps
# unless env STRICT_GLOSSARY_COVERAGE=1
import os

if os.environ.get("STRICT_GLOSSARY_COVERAGE") == "1" and not report["ok"]:
    raise SystemExit(1)
