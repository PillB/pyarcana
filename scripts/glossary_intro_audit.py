#!/usr/bin/env python3
"""Audit glossary first-use metadata and ordered learner-visible concept events.

The source-level report remains for backwards compatibility.  The semantic
``audit_concept_events`` gate is intentionally independent of TypeScript
formatting: callers provide events extracted from the rendered learner packet
in display order and explicitly identify which concept an event defines or
requires.  Hidden solutions and code cannot satisfy a learner-visible
definition.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
from pathlib import Path

from glossary_first_use import audit_concept_events  # re-export for existing callers


def alias_is_acronym(alias: str) -> bool:
    """Mirror of aliasIsAcronym in src/lib/glossary/terms.ts.

    An all-caps alias matches exactly; everything else ignores case. Without this, `ABC`
    matches the placeholder string in `int("abc")` and the three matchers disagree about
    where a term was introduced — which is how `abc` was recorded as taught in S02.
    """
    return bool(re.fullmatch(r"[A-Z][A-Z0-9./_-]+", alias) and re.search(r"[A-Z]{2,}", alias))


ROOT = Path(__file__).resolve().parents[1]
INDEX = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
TERMS_TS = (ROOT / "src/lib/glossary/terms.ts").read_text(encoding="utf-8")
SECTIONS_DIR = ROOT / "src/lib/course/sections"
OUT = ROOT / "course-state/glossary_intro_report.json"
EVENTS = ROOT / ".fixer/events.json"

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

def load_events() -> dict:
    """Same regeneration contract as badge_readiness_audit.load_events, so this runs in CI."""
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


# 2026-10-03: this scan used to match each term against the whole section FILE SOURCE, stripping
# only ``` fences -- and a TypeScript section file has none, so nothing was stripped. It therefore
# matched the section's own `id:` declaration and every hidden surface. Two of the seven forward
# refs it reported were artefacts of exactly that: `fastapi` matched `id: 'fastapi'`, and `pipeline`
# matched inside S01's hidden `solution` field. This file's own docstring already said "hidden
# solutions and code cannot satisfy a learner-visible definition"; the source-level scan simply
# never honoured it. It now matches the extractor's learner-visible event texts, which is the same
# surface the concept map and first_use_all_audit use, so the three matchers finally agree.
_events = load_events()
_visible = {}
for _e in _events["events"]:
    if _e.get("learner_visible"):
        _visible.setdefault(_e["section_id"], []).append(_e["text"])

section_ids = []
section_text = {}
for sid in _events["active_section_ids"]:
    section_ids.append(sid)
    section_text[sid] = "\n".join(_visible.get(sid, ()))

idx = {sid: i for i, sid in enumerate(section_ids)}
issues = []
for t in terms:
    first = t["firstSectionId"]
    fi = idx.get(first, 0)
    # find earliest occurrence
    earliest = None
    for sid, i in idx.items():
        # NOTE: these were `\\w` inside a raw string, i.e. a literal backslash
        # followed by `w` — not a word class. The look-around therefore almost
        # never fired, so "Valor p" matched inside "valor por defecto".
        flags = "" if alias_is_acronym(t["term"]) else "(?i)"
        if re.search(flags + r"(?<![\w/-])" + re.escape(t["term"]) + r"(?![\w/-])", section_text[sid]):
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
