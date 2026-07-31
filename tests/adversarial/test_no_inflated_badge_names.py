#!/usr/bin/env python3
"""Red test: no inflated occupational badge names in the badge catalog.

Guards against the 6 naming problems identified in the Cycle 2 spec:
- "Mastery" in badge names (inflated occupational seniority)
- Role-noun badges like "Data Analyst", "ML Engineering" (implies holding a role)

The fix renamed these to capability nouns:
- "Phase 3 — Mastery Walked" → "Phase 3 — Integrated Synthesis"
- "Integrated Python and AI Capstone — Integrated Mastery" → "...— Synthesis"
- "Integrated Data Analyst Practice" → "Integrated Data Analysis Practice"
- "Integrated ML Engineering Practice" → "Integrated Applied ML Systems"
- "Integrated Automation Engineering Practice" → "Integrated Automation Systems Practice"

Run: python3 tests/adversarial/test_no_inflated_badge_names.py
Exits 0 on pass, non-zero on fail.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CATALOG = ROOT / "src" / "lib" / "eligibility" / "badge_catalog.json"

# Forbidden tokens in badge NAMES (not in non_claims or descriptions — those
# may legitimately mention what the badge does NOT prove).
FORBIDDEN_NAME_TOKENS = [
    "Mastery Walked",
    "Integrated Mastery",
    "Data Analyst Practice",  # role noun → capability noun
    "ML Engineering Practice",  # role noun → capability noun
    "Automation Engineering Practice",  # role noun → capability noun
    # "Data Science Practice" is allowed — "Data Science" is a field, not a role
]


def main():
    if not CATALOG.exists():
        print(f"FAIL: badge catalog not found at {CATALOG}")
        return 1

    cat = json.loads(CATALOG.read_text(encoding="utf-8"))
    badges = cat if isinstance(cat, list) else cat.get("badges", cat.get("credentials", []))

    findings = []
    for b in badges:
        name = b.get("name", "")
        bid = b.get("badge_id", "")
        for token in FORBIDDEN_NAME_TOKENS:
            if token in name:
                findings.append(f"{bid}: name={name!r} contains forbidden token {token!r}")

    if findings:
        print(f"FAIL: test_no_inflated_badge_names — {len(findings)} inflated name(s):")
        for f in findings:
            print(f"  {f}")
        return 1

    print(f"PASS: test_no_inflated_badge_names — 0 inflated badge names in {len(badges)} badges")
    return 0


if __name__ == "__main__":
    sys.exit(main())
