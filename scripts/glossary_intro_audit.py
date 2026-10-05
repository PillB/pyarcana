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
from datetime import datetime, timezone
from pathlib import Path

from concept_map import load_events as concept_map_load_events
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
    """Fresh events, or a cache proven current by CONTENT. Never one proven to exist.

    2026-10-04, from Codex's review of PR #80: the first version only checked `EVENTS.exists()`,
    copying `badge_readiness_audit.load_events`. For a gate that is the wrong one of this repo's
    two patterns -- with the cache warm, editing a section or a glossary entry reused the old
    events, so a NEW forward reference could report 0 and exit 0.

    It then used `sources_newer_than_cache()`, which this branch's adversarial verification
    exploited: mtime is ordering, not identity, and `run_concepts.sh` restores events.json with the
    newest mtime. Both the comparison and the extraction now live in `concept_map`, which hashes
    the inputs -- imported, never copied, so this inherits every future fix to it.
    """
    return concept_map_load_events()


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
    "generated_at": datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
    "terms": len(terms),
    "sections": len(section_ids),
    "forward_refs": len(issues),
    "issues": issues[:100],
    "ok": len(issues) == 0,
}
OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False))
print(json.dumps({"ok": report["ok"], "forward_refs": len(issues), "terms": len(terms)}, indent=2))

# 2026-10-03: this script printed "ok": false and exited 0, so CI ran it for weeks as a gate that
# could never fail. The ratchet below is what gives it an exit code.
#
# The value is 2, not 7. Until today the scan matched each term against the whole section file
# source, which counted the section's own `id:` declaration and every hidden surface. Five of its
# seven findings were artefacts of that: `fastapi` matched `id: 'fastapi'`, `pipeline` matched
# inside S01's hidden `solution` field, and `eda`, `mlops` and `llm` likewise. The concept map
# agrees independently -- for all five, the declared section IS the first-used section.
#
# The two that remain are real, and both are corroborated by the concept map:
#     return    declared functions-contracts (S05), first used S03
#     coverage  declared async-concurrency   (S27), first used S24
#
# Do NOT pay this down by repointing a `firstSectionId`. That buys a green without moving any
# teaching, and it is the gate-gaming this ratchet exists to make visible. Pay it down by teaching
# the term where the learner first meets it, then lower the constant in the same commit.
# 2026-10-03, later the same day: 2 -> 1. `return` was declared functions-contracts (S05) while the
# learner meets it in S03, whose theory[11] is headed «Una regla con nombre: `def`, llamada y
# `return`» and whose p3 defines it. The declaration was wrong, not the teaching -- the concept map
# already scored `return` L3 with 625 examples and 0 surprising uses -- so firstSectionId moved to
# decisions-rules. `coverage` is the one that remains, and it is a homonym rather than a gap: S24
# means automation coverage (`coverage_auto = auto/(auto+review)`), while every alias on this entry
# is test coverage. It is fixed in S24's own round, not here.
# 2026-10-04: 1 -> 0, and at 0 this stops being a ratchet and becomes an absolute gate. The
# "fails below" branch is now unreachable, which is the intended end state: no glossary term may be
# used before the section that declares it.
#
# `coverage` was the last one, and it was a homonym rather than a gap. S24 means automation coverage
# -- `coverage_auto = auto / (auto + review)`, the share of documents resolved without a human --
# while every alias on that entry means test coverage, which S27 teaches. S24 already said
# «cobertura automática» in its callout and its instruction; two places still used the bare English
# word, which the alias `Coverage` matched. They now use the section's own Spanish.
#
# Raise this above 0 only with a dated line saying which term regressed and why.
# 2026-10-04, merging #79: main carried this same ratchet at 7, measured by the whole-source scan,
# and its comment set the rule for this merge -- whichever version lands second sets the number to
# what its script measures. This version reads learner-visible events and measures 0.
FORWARD_REFS_OWED = 0

if len(issues) > FORWARD_REFS_OWED:
    print(f"FAIL: {len(issues)} forward references, more than the {FORWARD_REFS_OWED} owed. A term now"
          " appears before the section that teaches it: gloss it there or move it. Point its"
          " firstSectionId elsewhere only when the declaration itself is wrong:")
    for i in issues:
        print(f"  {i['term']}: declared {i['declared_first']}, first used {i['found_first']}")
    raise SystemExit(1)

if len(issues) < FORWARD_REFS_OWED:
    print(f"FAIL: {len(issues)} forward references, fewer than the {FORWARD_REFS_OWED} owed. Lower"
          f" FORWARD_REFS_OWED to {len(issues)} in this commit, with a dated line naming the term.")
    raise SystemExit(1)
