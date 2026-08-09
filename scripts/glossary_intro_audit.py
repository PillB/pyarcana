#!/usr/bin/env python3
"""Audit: glossary terms appearing before their firstSectionId in curriculum order."""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
TERMS_TS = (ROOT / "src/lib/glossary/terms.ts").read_text(encoding="utf-8")
SECTIONS_DIR = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/glossary_intro_report.json"

# parse firstSectionId and term from terms.ts
terms = []
for m in re.finditer(
    r"id:\s*'([^']+)'[\s\S]*?term:\s*'((?:\\'|[^'])*)'[\s\S]*?firstSectionId:\s*'([^']+)'",
    TERMS_TS,
):
    terms.append({"id": m.group(1), "term": m.group(2).replace("\\'", "'"), "firstSectionId": m.group(3)})

# ordered section files from index
order = []
for m in re.finditer(
    r"import\s+\{\s*section\d+\s*\}\s+from\s+['\"]\./sections/([^'\"]+)['\"]", INDEX
):
    order.append(m.group(1))

section_ids = []
section_text = {}
for base in order:
    path = SECTIONS_DIR / (base if base.endswith(".ts") else f"{base}.ts")
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8", errors="replace")
    # strip code fences content for matching prose only (rough)
    prose = re.sub(r"```[\s\S]*?```", " ", text)
    id_m = re.search(r"\bid:\s*['\"]([^'\"]+)['\"]", text)
    if not id_m:
        continue
    sid = id_m.group(1)
    section_ids.append(sid)
    section_text[sid] = prose

idx = {sid: i for i, sid in enumerate(section_ids)}
issues = []
for t in terms:
    first = t["firstSectionId"]
    fi = idx.get(first, 0)
    # find earliest occurrence
    earliest = None
    for sid, i in idx.items():
        if re.search(r"(?i)(?<![\\w/-])" + re.escape(t["term"]) + r"(?![\\w/-])", section_text[sid]):
            if earliest is None or i < earliest[0]:
                earliest = (i, sid)
    if earliest and earliest[0] < fi:
        issues.append(
            {
                "term": t["term"],
                "id": t["id"],
                "declared_first": first,
                "found_first": earliest[1],
                "severity": "P2",
                "note": "Term appears before declared firstSectionId — update firstSectionId or add intro",
            }
        )

report = {
    "generated_at": __import__("datetime").datetime.utcnow().isoformat() + "Z",
    "terms": len(terms),
    "sections": len(section_ids),
    "forward_refs": len(issues),
    "issues": issues[:100],
    "ok": len(issues) == 0,
}
OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False))
print(json.dumps({"ok": report["ok"], "forward_refs": len(issues), "terms": len(terms)}, indent=2))
