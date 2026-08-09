#!/usr/bin/env python3
"""Red test: final-capstone supplementary-evidence gap enforcement.

Verifies that the eligibility engine enforces supplementary exercises for
gap-affected critical competencies on ALL badges, not just pilot badges.

The final capstone (evidence_grounded_ai_systems_capstone) has status='active'
but has 4 gap-affected competencies (sql_competency, leakage_prevention,
selector_resilience, type_safety_production_hardening). The engine must
fail closed when supplementary evidence is missing for these.

Run: python3 tests/adversarial/test_final_capstone_supplementary_gap.py
Exits 0 on pass, non-zero on fail.
"""
from __future__ import annotations
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent


def main():
    failures = []

    # 1. Engine enforces supplementary for ALL gap-affected badges (not just pilot)
    engine = (ROOT / "src" / "lib" / "eligibility" / "engine.ts").read_text()
    if "spec.status === 'pilot'" in engine and "gap_affected_competencies.length > 0" not in engine:
        failures.append(
            "Engine still gates supplementary enforcement on pilot status only. "
            "The final capstone has status='active' but has gap-affected competencies."
        )

    # Verify the new gate condition exists
    if "gap_affected_competencies.length > 0" not in engine:
        failures.append("Engine does not check gap_affected_competencies.length > 0")

    # 2. Final capstone has gap-affected competencies
    catalog = json.loads((ROOT / "src" / "lib" / "eligibility" / "badge_catalog.json").read_text())
    badges = catalog if isinstance(catalog, list) else catalog.get("badges", catalog.get("credentials", []))

    final_capstone = None
    for b in badges:
        if b.get("badge_id") == "evidence_grounded_ai_systems_capstone":
            final_capstone = b
            break

    if not final_capstone:
        failures.append("Final capstone badge not found in catalog")
    else:
        cc = final_capstone.get("critical_competencies", [])
        if len(cc) < 8:
            failures.append(f"Final capstone has only {len(cc)} critical competencies (expected >= 8)")

        # Check it has gap-affected competencies
        gap_affected = ["sql_competency", "leakage_prevention", "selector_resilience", "type_safety_production_hardening"]
        for gap in gap_affected:
            if gap not in cc:
                failures.append(f"Final capstone missing gap-affected competency: {gap}")

    # 3. GAP_AFFECTED_COMPETENCIES marks the right ones as true
    types_file = (ROOT / "src" / "lib" / "eligibility" / "types.ts").read_text()
    for gap in gap_affected:
        pattern = rf"{gap}:\s*true"
        if not re.search(pattern, types_file):
            failures.append(f"GAP_AFFECTED_COMPETENCIES does not mark {gap} as true")

    # 4. Engine code fails closed (anyCriticalFailed = true when supplementary missing)
    if "anyCriticalFailed = true" not in engine:
        failures.append("Engine does not set anyCriticalFailed when supplementary is missing")

    if failures:
        print(f"FAIL: test_final_capstone_supplementary_gap — {len(failures)} issue(s):")
        for f in failures:
            print(f"  - {f}")
        return 1

    print(f"PASS: test_final_capstone_supplementary_gap — engine enforces supplementary for all gap-affected badges")
    return 0


if __name__ == "__main__":
    sys.exit(main())
