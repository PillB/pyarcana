#!/usr/bin/env python3
"""Task 8-a — Capstone cross-artifact consistency test (Red→Green).

Asserts agreement across the four sources of capstone truth:
  - ``capstone_validation/capstones/CP-*.json`` (canonical contracts)
  - ``course-state/capstone_ledger.json`` (runtime ledger)
  - ``course-state/capstones/INDEX.json`` (package index)
  - ``capstone_validation/reality/section_capstone_mapping.json``
    (gate→capstone map)
  - ``capstone_validation/architecture/capstone_dependency_graph.json``
    (dependency graph; finalIntegratesCount must be 12)
  - ``capstone_validation/architecture/final_integration_contracts.json``
    (final integration; upstreamCount must be 12 listing exactly the 12
    level capstones)

Invariants:
  - Contract ids == ledger ids (same set, same count)
  - Each capstone's gate_section in ledger == gateSection in contract
  - gate→capstone map consistent across ledger, contracts, and
    section_capstone_mapping.json
  - finalIntegratesCount == 12
  - final_integration_contracts.json upstreamCount == 12 listing exactly
    the 12 level capstones
  - Each level has exactly 3 capstones in the contracts
  - No capstone contract references a non-existent dependency

Stdlib only. Runnable as ``python3 test_capstone_consistency.py``.
Exits 0 on PASS, non-zero on FAIL, prints a one-line PASS/FAIL summary.
"""
from __future__ import annotations
import json
import os
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
CONTRACTS_DIR = os.path.join(REPO, "capstone_validation", "capstones")
LEDGER_PATH = os.path.join(REPO, "course-state", "capstone_ledger.json")
INDEX_PATH = os.path.join(REPO, "course-state", "capstones", "INDEX.json")
SECTION_MAP_PATH = os.path.join(
    REPO, "capstone_validation", "reality", "section_capstone_mapping.json"
)
DEP_GRAPH_PATH = os.path.join(
    REPO,
    "capstone_validation",
    "architecture",
    "capstone_dependency_graph.json",
)
FINAL_CONTRACTS_PATH = os.path.join(
    REPO,
    "capstone_validation",
    "architecture",
    "final_integration_contracts.json",
)

EXPECTED_TOTAL = 13
EXPECTED_LEVEL_CAPSTONES = 12  # principals only
EXPECTED_PER_LEVEL = 3


def _load_json(path):
    with open(path, encoding="utf-8") as fh:
        return json.load(fh)


def _load_contracts():
    contracts = {}
    for name in sorted(os.listdir(CONTRACTS_DIR)):
        if not name.endswith(".json"):
            continue
        data = _load_json(os.path.join(CONTRACTS_DIR, name))
        contracts[data["id"]] = data
    return contracts


def main() -> int:
    failures: list[str] = []

    contracts = _load_contracts()
    contract_ids = set(contracts.keys())

    # --- Ledger agreement ---
    ledger = _load_json(LEDGER_PATH)
    ledger_entries = {c["id"]: c for c in ledger.get("capstones", [])}
    ledger_ids = set(ledger_entries.keys())

    if ledger_ids != contract_ids:
        missing_in_ledger = contract_ids - ledger_ids
        extra_in_ledger = ledger_ids - contract_ids
        failures.append(
            f"contract/ledger id set mismatch: "
            f"missing_in_ledger={sorted(missing_in_ledger)}, "
            f"extra_in_ledger={sorted(extra_in_ledger)}"
        )
    if len(ledger_ids) != EXPECTED_TOTAL:
        failures.append(
            f"ledger count: expected {EXPECTED_TOTAL}, got {len(ledger_ids)}"
        )

    # --- gate_section (ledger) vs gateSection (contract) ---
    for cid, contract in contracts.items():
        ledger_entry = ledger_entries.get(cid)
        if not ledger_entry:
            continue
        ledger_gate = ledger_entry.get("gate_section")
        contract_gate = contract.get("gateSection")
        if ledger_gate != contract_gate:
            failures.append(
                f"{cid}: ledger gate_section={ledger_gate!r} != "
                f"contract gateSection={contract_gate!r}"
            )

    # --- INDEX.json agreement ---
    if os.path.isfile(INDEX_PATH):
        index = _load_json(INDEX_PATH)
        index_ids = {c["id"] for c in index.get("capstones", [])}
        if index_ids != contract_ids:
            missing = contract_ids - index_ids
            extra = index_ids - contract_ids
            failures.append(
                f"INDEX/contract id set mismatch: "
                f"missing_in_index={sorted(missing)}, "
                f"extra_in_index={sorted(extra)}"
            )
        # INDEX gate_section must match contract gateSection too
        index_entries = {c["id"]: c for c in index.get("capstones", [])}
        for cid, contract in contracts.items():
            idx = index_entries.get(cid)
            if not idx:
                continue
            if idx.get("gate_section") != contract.get("gateSection"):
                failures.append(
                    f"{cid}: INDEX gate_section={idx.get('gate_section')!r} "
                    f"!= contract gateSection={contract.get('gateSection')!r}"
                )

    # --- section_capstone_mapping.json agreement ---
    section_map = _load_json(SECTION_MAP_PATH)
    map_gate_to_capstone: dict[str, str] = {}
    for entry in section_map.get("sections", []):
        if entry.get("isGate"):
            map_gate_to_capstone[entry["section"]] = entry.get(
                "gatesCapstone"
            )
    # Build the same map from contracts
    contract_gate_map = {
        c["gateSection"]: c["id"] for c in contracts.values()
    }
    if map_gate_to_capstone != contract_gate_map:
        failures.append(
            f"gate→capstone map mismatch: "
            f"section_map={map_gate_to_capstone}, "
            f"contracts={contract_gate_map}"
        )
    # And from ledger
    ledger_gate_map = {
        c["gate_section"]: c["id"] for c in ledger.get("capstones", [])
    }
    if ledger_gate_map != contract_gate_map:
        failures.append(
            f"gate→capstone map mismatch: ledger={ledger_gate_map}, "
            f"contracts={contract_gate_map}"
        )

    # --- Dependency graph: finalIntegratesCount == 12 ---
    dep_graph = _load_json(DEP_GRAPH_PATH)
    fic = dep_graph.get("finalIntegratesCount")
    if fic != EXPECTED_LEVEL_CAPSTONES:
        failures.append(
            f"dependency_graph.finalIntegratesCount: expected "
            f"{EXPECTED_LEVEL_CAPSTONES}, got {fic}"
        )
    # nodes count == 13
    nodes = dep_graph.get("nodes", [])
    if len(nodes) != EXPECTED_TOTAL:
        failures.append(
            f"dependency_graph nodes: expected {EXPECTED_TOTAL}, "
            f"got {len(nodes)}"
        )
    # final_integrates edges should be exactly 12
    final_integrates_edges = [
        e for e in dep_graph.get("edges", [])
        if e.get("type") == "final_integrates"
    ]
    if len(final_integrates_edges) != EXPECTED_LEVEL_CAPSTONES:
        failures.append(
            f"final_integrates edges: expected "
            f"{EXPECTED_LEVEL_CAPSTONES}, got {len(final_integrates_edges)}"
        )

    # --- final_integration_contracts.json: upstreamCount == 12 ---
    final_contracts = _load_json(FINAL_CONTRACTS_PATH)
    uc = final_contracts.get("upstreamCount")
    if uc != EXPECTED_LEVEL_CAPSTONES:
        failures.append(
            f"final_integration_contracts.upstreamCount: expected "
            f"{EXPECTED_LEVEL_CAPSTONES}, got {uc}"
        )
    contract_ids_list = [
        c["capstoneId"] for c in final_contracts.get("contracts", [])
    ]
    if len(contract_ids_list) != EXPECTED_LEVEL_CAPSTONES:
        failures.append(
            f"final_integration_contracts.contracts: expected "
            f"{EXPECTED_LEVEL_CAPSTONES}, got {len(contract_ids_list)}"
        )
    principals = {
        cid for cid, c in contracts.items() if not c.get("isFinal")
    }
    if set(contract_ids_list) != principals:
        failures.append(
            f"final_integration_contracts.contracts set mismatch: "
            f"missing={principals - set(contract_ids_list)}, "
            f"extra={set(contract_ids_list) - principals}"
        )

    # --- Each level has exactly 3 capstones in the contracts ---
    for lvl in (1, 2, 3, 4):
        per_level = [
            cid for cid, c in contracts.items()
            if c.get("level") == lvl and not c.get("isFinal")
        ]
        if len(per_level) != EXPECTED_PER_LEVEL:
            failures.append(
                f"level {lvl}: expected {EXPECTED_PER_LEVEL} contracts, "
                f"got {len(per_level)} ({per_level})"
            )

    # --- No capstone contract references a non-existent dependency ---
    all_ids = set(contracts.keys())
    for cid, contract in contracts.items():
        for dep in contract.get("dependencies", []):
            if dep not in all_ids:
                failures.append(
                    f"{cid}: references non-existent dependency {dep!r}"
                )

    if failures:
        print(f"FAIL test_capstone_consistency — {len(failures)} failure(s)")
        for f in failures:
            print(f"  - {f}")
        return 1
    print(
        "PASS test_capstone_consistency — contracts/ledger/index/mapping/"
        "graph/final-contracts all agree; 12 principals, 12 final deps, "
        "no dangling deps"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
