#!/usr/bin/env python3
"""Task 8-a — Section↔capstone mapping invariant test (Red→Green).

Asserts the section→capstone mapping in
``capstone_validation/reality/section_capstone_mapping.json``:

  - all 52 sections S01..S52 present (exactly once)
  - each section's level matches its number range:
        S01-S13 → 1, S14-S26 → 2, S27-S39 → 3, S40-S52 → 4
  - the 13 gate sections are marked ``isGate`` and map to the correct
    capstone (per the canonical GATE_MAP: S04→CP-N1-A, S08→CP-N1-B,
    S13→CP-N1-C, S17→CP-N2-A, S21→CP-N2-B, S26→CP-N2-C,
    S30→CP-N3-A, S34→CP-N3-B, S39→CP-N3-C, S43→CP-N4-A,
    S47→CP-N4-B, S51→CP-N4-C, S52→CP-FINAL)
  - each capstone's contributingSections are within its level range

Stdlib only. Runnable as ``python3 test_section_capstone_mapping.py``.
Exits 0 on PASS, non-zero on FAIL, prints a one-line PASS/FAIL summary.
"""
from __future__ import annotations
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
SECTION_MAP_PATH = os.path.join(
    REPO, "capstone_validation", "reality", "section_capstone_mapping.json"
)
CONTRACTS_DIR = os.path.join(REPO, "capstone_validation", "capstones")

EXPECTED_SECTIONS = [f"S{n:02d}" for n in range(1, 53)]

LEVEL_RANGES = {
    1: (1, 13),
    2: (14, 26),
    3: (27, 39),
    4: (40, 52),
}

GATE_MAP = {
    "S04": "CP-N1-A",
    "S08": "CP-N1-B",
    "S13": "CP-N1-C",
    "S17": "CP-N2-A",
    "S21": "CP-N2-B",
    "S26": "CP-N2-C",
    "S30": "CP-N3-A",
    "S34": "CP-N3-B",
    "S39": "CP-N3-C",
    "S43": "CP-N4-A",
    "S47": "CP-N4-B",
    "S51": "CP-N4-C",
    "S52": "CP-FINAL",
}


def _load_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def _level_for_section(section_id):
    """Return the expected level (1-4) for a section id like 'S27'."""
    n = int(section_id[1:])
    for lvl, (lo, hi) in LEVEL_RANGES.items():
        if lo <= n <= hi:
            return lvl
    return None


def main() -> int:
    failures: list[str] = []

    if not os.path.isfile(SECTION_MAP_PATH):
        print(f"FAIL test_section_capstone_mapping — mapping file missing: {SECTION_MAP_PATH}")
        return 1

    data = _load_json(SECTION_MAP_PATH)
    sections = data.get("sections", [])

    # --- All 52 sections S01..S52 present, exactly once ---
    seen = {}
    for entry in sections:
        sid = entry.get("section")
        seen[sid] = seen.get(sid, 0) + 1
    expected_set = set(EXPECTED_SECTIONS)
    actual_set = set(seen.keys())
    missing = expected_set - actual_set
    extra = actual_set - expected_set
    if missing:
        failures.append(f"missing sections: {sorted(missing)}")
    if extra:
        failures.append(f"unexpected sections: {sorted(extra)}")
    duplicates = [s for s, c in seen.items() if c > 1]
    if duplicates:
        failures.append(f"duplicate sections: {sorted(duplicates)}")
    if len(sections) != 52:
        failures.append(
            f"section count: expected 52, got {len(sections)}"
        )

    # --- Each section's level matches its number range ---
    for entry in sections:
        sid = entry.get("section")
        if sid not in expected_set:
            continue  # already flagged above
        declared_level = entry.get("level")
        expected_level = _level_for_section(sid)
        if declared_level != expected_level:
            failures.append(
                f"{sid}: level {declared_level} != expected "
                f"{expected_level}"
            )

    # --- 13 gate sections marked isGate and mapping to correct capstone ---
    gates_in_mapping = {
        entry["section"]: entry
        for entry in sections
        if entry.get("isGate")
    }
    if len(gates_in_mapping) != 13:
        failures.append(
            f"gate count: expected 13, got {len(gates_in_mapping)} "
            f"({sorted(gates_in_mapping.keys())})"
        )
    for gate_section, expected_capstone in GATE_MAP.items():
        entry = gates_in_mapping.get(gate_section)
        if entry is None:
            failures.append(
                f"{gate_section}: expected isGate=true but not marked as gate"
            )
            continue
        actual_capstone = entry.get("gatesCapstone")
        if actual_capstone != expected_capstone:
            failures.append(
                f"{gate_section}: gatesCapstone={actual_capstone!r} != "
                f"expected {expected_capstone!r}"
            )
    # Non-gate sections must NOT be marked isGate and must have null
    # gatesCapstone.
    for entry in sections:
        sid = entry.get("section")
        if sid in GATE_MAP:
            continue
        if entry.get("isGate"):
            failures.append(
                f"{sid}: marked isGate=true but not in canonical GATE_MAP"
            )
        if entry.get("gatesCapstone") is not None:
            failures.append(
                f"{sid}: gatesCapstone={entry.get('gatesCapstone')!r} "
                f"should be null for non-gate section"
            )

    # --- Each capstone's contributingSections are within its level range ---
    contracts = {}
    if os.path.isdir(CONTRACTS_DIR):
        for fname in sorted(os.listdir(CONTRACTS_DIR)):
            if not fname.endswith(".json"):
                continue
            c = _load_json(os.path.join(CONTRACTS_DIR, fname))
            contracts[c["id"]] = c

    # Build capstone→level map (FINAL is level 4 per contracts).
    capstone_level = {cid: c.get("level") for cid, c in contracts.items()}

    for cid, contract in contracts.items():
        contributing = contract.get("contributingSections", [])
        expected_level = capstone_level.get(cid)
        if expected_level is None:
            continue
        # FINAL has contributingSections=['S52'] which is in level 4 range.
        # All other capstones should have contributingSections within their
        # level range.
        for sec in contributing:
            sec_level = _level_for_section(sec)
            if sec_level is None:
                failures.append(
                    f"{cid}: contributingSections has invalid section {sec!r}"
                )
                continue
            # CP-FINAL (level 4 / FINAL) — S52 is in level 4 range, OK.
            check_level = expected_level if expected_level != "FINAL" else 4
            if sec_level != check_level:
                failures.append(
                    f"{cid}: contributingSection {sec} is in level "
                    f"{sec_level}, expected level {check_level}"
                )

    # Cross-check: each section's contributesToCapstones must reference a
    # capstone whose level matches the section's level.
    for entry in sections:
        sid = entry.get("section")
        if sid not in expected_set:
            continue
        sec_level = entry.get("level")
        for cap_id in entry.get("contributesToCapstones", []):
            cap_level = capstone_level.get(cap_id)
            if cap_level is None:
                failures.append(
                    f"{sid}: contributesToCapstones references unknown "
                    f"capstone {cap_id}"
                )
                continue
            # FINAL capstone has level=4 in contracts; sections in level 4
            # may contribute to it.
            check_level = cap_level if cap_level != "FINAL" else 4
            if sec_level != check_level:
                failures.append(
                    f"{sid}: contributes to {cap_id} (level {cap_level}) "
                    f"but section is in level {sec_level}"
                )

    if failures:
        print(f"FAIL test_section_capstone_mapping — {len(failures)} failure(s)")
        for f in failures:
            print(f"  - {f}")
        return 1
    print(
        "PASS test_section_capstone_mapping — 52 sections present, levels "
        "match ranges, 13 gates correct, contributing sections within level"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
