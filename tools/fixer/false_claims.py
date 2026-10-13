"""The known-false-claims registry as a block of a Codex brief.

A false statement found once came back because nothing told the next round it was false: rounds
were scored on prose and polished the claim. Every builder in tools/fixer/ puts this block in the
brief it assembles, so Codex sees each statement, why it is wrong, and what to write instead;
tools/fixer/apply_patches.py then refuses a patch that adds one anyway.
"""
from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
REGISTRY = ROOT / "audit/fixer/known_false_claims.json"
HEADING = "===== STATEMENTS ALREADY FOUND FALSE (binding: never write them, in any wording) ====="


def brief_block() -> str:
    """Every registry entry: the statement as it was found, the correct form, and the source."""
    entries = json.loads(REGISTRY.read_text(encoding="utf-8"))["entries"]
    lines = [
        HEADING,
        "Each of these was found in the course and is false or misleading. Do not write it again,",
        "reworded or not. Where your text needs the idea, write the correct form, in Spanish.",
        "",
    ]
    for e in entries:
        lines += [
            f"- {e['id']}: {e['title']}",
            f"  As found: «{e['examples']['positive'][0]}»",
            f"  Correct: {e['correct_statement']}",
            f"  Source: {e['citation']['source']} - {e['citation']['url']}",
        ]
    return "\n".join(lines) + "\n"
