#!/usr/bin/env python3
"""Task 8-a — Capstone cardinality invariant test (Red→Green).

Asserts the frozen cardinality contract from
``capstone_validation/architecture/ADR-capstone-cardinality.md`` against the
JSON contract artifacts in ``capstone_validation/capstones/`` and the
authoritative package/ledger state in ``course-state/``.

Cardinality contract (frozen):
  - exactly 4 levels
  - exactly 3 principal capstones per level (12 total)
  - exactly 1 transversal final capstone
  - exactly 13 capstones in total
  - gates: L1 S04/S08/S13, L2 S17/S21/S26, L3 S30/S34/S39,
           L4 S43/S47/S51, Final S52
  - NO CP-N4-D anywhere (only ADR-forbidden mentions allowed)
  - CP-N4-C has exactly 3 sub-gates S49/S50/S51
  - CP-FINAL integrates exactly 12 upstream capstones

Stdlib only. Runnable as ``python3 test_capstone_cardinality.py``.
Exits 0 on PASS, non-zero on FAIL, prints a one-line PASS/FAIL summary.
"""
from __future__ import annotations
import json
import os
import re
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONTRACTS_DIR = os.path.join(REPO, "capstone_validation", "capstones")
PACKAGES_DIR = os.path.join(REPO, "course-state", "capstones")
LEDGER_PATH = os.path.join(REPO, "course-state", "capstone_ledger.json")
INDEX_PATH = os.path.join(REPO, "course-state", "capstones", "INDEX.json")
VALIDATION_ROOT = os.path.join(REPO, "capstone_validation")
COURSE_STATE_ROOT = os.path.join(REPO, "course-state")

EXPECTED_LEVELS = {1, 2, 3, 4}
EXPECTED_PER_LEVEL = 3
EXPECTED_LEVEL_CAPSTONE_COUNT = 12
EXPECTED_FINAL_COUNT = 1
EXPECTED_TOTAL = 13
EXPECTED_GATES = {
    "L1": ["S04", "S08", "S13"],
    "L2": ["S17", "S21", "S26"],
    "L3": ["S30", "S34", "S39"],
    "L4": ["S43", "S47", "S51"],
    "FINAL": ["S52"],
}
FORBIDDEN_ID = "CP-N4-D"
EXPECTED_N4C_SUBGATE_SECTIONS = ["S49", "S50", "S51"]
EXPECTED_FINAL_DEP_COUNT = 12

# Allowed contexts in which CP-N4-D may appear (text mentions, not ids).
# ADRs explicitly forbid CP-N4-D; cards/rubrics/gates that explicitly say
# "No CP-N4-D" are also allowed. We enforce that NO file uses CP-N4-D as an
# id field, and that the directory index contains no CP-N4-D package.


def _load_contracts():
    contracts = {}
    for name in sorted(os.listdir(CONTRACTS_DIR)):
        if not name.endswith(".json"):
            continue
        path = os.path.join(CONTRACTS_DIR, name)
        with open(path) as fh:
            data = json.load(fh)
        contracts[data["id"]] = data
    return contracts


def _load_json(path):
    with open(path) as fh:
        return json.load(fh)


def _check_no_n4d_id_anywhere(failures):
    """Ensure no JSON file uses CP-N4-D as an id, and no package dir exists."""
    # 1. No package directory named CP-N4-D
    if os.path.isdir(os.path.join(PACKAGES_DIR, FORBIDDEN_ID)):
        failures.append(f"FORBIDDEN: package directory {FORBIDDEN_ID}/ exists")

    # 2. No JSON file with "id": "CP-N4-D"
    id_pattern = re.compile(r'"id"\s*:\s*"CP-N4-D"')
    scan_roots = [
        VALIDATION_ROOT,
        os.path.join(COURSE_STATE_ROOT, "capstones"),
        LEDGER_PATH,
        INDEX_PATH,
    ]
    for root in scan_roots:
        if os.path.isfile(root):
            files = [root]
        else:
            files = []
            for dirpath, _, fnames in os.walk(root):
                for fname in fnames:
                    if fname.endswith((".json", ".md")):
                        files.append(os.path.join(dirpath, fname))
        for fpath in files:
            try:
                with open(fpath, encoding="utf-8") as fh:
                    text = fh.read()
            except (OSError, UnicodeDecodeError):
                continue
            # Reject only if CP-N4-D appears as an id field assignment.
            if id_pattern.search(text):
                rel = os.path.relpath(fpath, REPO)
                failures.append(
                    f"FORBIDDEN: {FORBIDDEN_ID} used as id in {rel}"
                )


def main() -> int:
    failures: list[str] = []

    contracts = _load_contracts()
    if len(contracts) != EXPECTED_TOTAL:
        failures.append(
            f"contract count: expected {EXPECTED_TOTAL}, got {len(contracts)}"
        )

    # Levels
    levels = {c.get("level") for c in contracts.values()}
    if levels != EXPECTED_LEVELS:
        failures.append(
            f"levels: expected {sorted(EXPECTED_LEVELS)}, got {sorted(levels)}"
        )

    # Principal capstones per level (exclude final)
    principals = [c for c in contracts.values() if not c.get("isFinal")]
    if len(principals) != EXPECTED_LEVEL_CAPSTONE_COUNT:
        failures.append(
            f"principal capstones: expected {EXPECTED_LEVEL_CAPSTONE_COUNT}, "
            f"got {len(principals)}"
        )
    for lvl in EXPECTED_LEVELS:
        per_level = [c for c in principals if c.get("level") == lvl]
        if len(per_level) != EXPECTED_PER_LEVEL:
            names = [c["id"] for c in per_level]
            failures.append(
                f"level {lvl}: expected {EXPECTED_PER_LEVEL} principals, "
                f"got {len(per_level)} ({names})"
            )

    # Final capstone count
    finals = [c for c in contracts.values() if c.get("isFinal")]
    if len(finals) != EXPECTED_FINAL_COUNT:
        failures.append(
            f"final capstones: expected {EXPECTED_FINAL_COUNT}, "
            f"got {len(finals)}"
        )

    # Gate map per level
    for lvl_label, expected_gates in EXPECTED_GATES.items():
        if lvl_label == "FINAL":
            actual_gates = [c["gateSection"] for c in finals]
        else:
            lvl = int(lvl_label[1:])
            actual_gates = sorted(
                c["gateSection"]
                for c in principals
                if c.get("level") == lvl
            )
        if sorted(actual_gates) != sorted(expected_gates):
            failures.append(
                f"gates {lvl_label}: expected {sorted(expected_gates)}, "
                f"got {sorted(actual_gates)}"
            )

    # Final capstone integrates exactly 12 upstream capstones
    final = next((c for c in contracts.values() if c.get("isFinal")), None)
    if final is None:
        failures.append("no final capstone found")
    else:
        deps = final.get("dependencies", [])
        if len(deps) != EXPECTED_FINAL_DEP_COUNT:
            failures.append(
                f"final dependencies: expected {EXPECTED_FINAL_DEP_COUNT}, "
                f"got {len(deps)} ({deps})"
            )
        # Final deps must be exactly the 12 level capstones (all principals)
        expected_dep_set = {c["id"] for c in principals}
        if set(deps) != expected_dep_set:
            failures.append(
                f"final dependency set mismatch: "
                f"missing={expected_dep_set - set(deps)}, "
                f"extra={set(deps) - expected_dep_set}"
            )

    # CP-N4-C must exist and have 3 sub-gates S49/S50/S51
    n4c = contracts.get("CP-N4-C")
    if n4c is None:
        failures.append("CP-N4-C contract missing")
    else:
        # Sub-gates from gate.json (the package-level gate file).
        gate_json_path = os.path.join(
            PACKAGES_DIR, "CP-N4-C", "gate.json"
        )
        subgate_sections: list[str] = []
        if os.path.isfile(gate_json_path):
            gate_data = _load_json(gate_json_path)
            for sg in gate_data.get("sub_gates", []):
                subgate_sections.append(sg.get("section"))
        # Also accept the ADR-N4-C mention as fallback evidence.
        adr_path = os.path.join(
            VALIDATION_ROOT, "architecture", "ADR-N4-C-agentic-harness.md"
        )
        adr_text = ""
        if os.path.isfile(adr_path):
            with open(adr_path, encoding="utf-8") as fh:
                adr_text = fh.read()
        adr_sections = re.findall(
            r"CP-N4-C\.\d+\s*\([^)]*?(S\d+)", adr_text
        )
        if not subgate_sections and adr_sections:
            subgate_sections = adr_sections
        if len(subgate_sections) != 3:
            failures.append(
                f"CP-N4-C sub-gates: expected 3, got {len(subgate_sections)} "
                f"({subgate_sections})"
            )
        elif subgate_sections != EXPECTED_N4C_SUBGATE_SECTIONS:
            failures.append(
                f"CP-N4-C sub-gate sections: expected "
                f"{EXPECTED_N4C_SUBGATE_SECTIONS}, got {subgate_sections}"
            )

    # NO CP-N4-D anywhere (as an id / package / ledger entry)
    _check_no_n4d_id_anywhere(failures)

    # Also verify the ledger has exactly 13 capstones and no CP-N4-D
    if os.path.isfile(LEDGER_PATH):
        ledger = _load_json(LEDGER_PATH)
        ledger_ids = [c["id"] for c in ledger.get("capstones", [])]
        if len(ledger_ids) != EXPECTED_TOTAL:
            failures.append(
                f"ledger count: expected {EXPECTED_TOTAL}, "
                f"got {len(ledger_ids)}"
            )
        if FORBIDDEN_ID in ledger_ids:
            failures.append(
                f"FORBIDDEN: {FORBIDDEN_ID} present in ledger"
            )

    if failures:
        print(f"FAIL test_capstone_cardinality — {len(failures)} failure(s)")
        for f in failures:
            print(f"  - {f}")
        return 1
    print(
        "PASS test_capstone_cardinality — 4 levels, 3x4 principals, "
        "1 final, 13 total, gates match, no CP-N4-D, N4-C has 3 sub-gates, "
        "FINAL integrates 12"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
