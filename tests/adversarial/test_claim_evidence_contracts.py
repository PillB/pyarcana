#!/usr/bin/env python3
"""Red test: every active badge has an executable claim-evidence contract.

Verifies that:
1. A claim-evidence contract JSON exists for every badge in the catalog
2. Each contract has all required fields per spec §3E
3. Critical competencies are marked non-compensatory
4. Class D (verified) credentials use server_authoritative verification_mode
5. Class A (milestone) credentials use local_only verification_mode

Run: python3 tests/adversarial/test_claim_evidence_contracts.py
Exits 0 on pass, non-zero on fail.
"""
from __future__ import annotations
import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
CONTRACTS_DIR = ROOT / "src" / "lib" / "eligibility" / "claim_evidence_contracts"
CATALOG = ROOT / "src" / "lib" / "eligibility" / "badge_catalog.json"

REQUIRED_FIELDS = [
    'credential_id', 'version', 'status', 'credential_class',
    'public_name', 'capability_statement', 'boundary',
    'prerequisites', 'required_sections', 'critical_gates',
    'non_compensatory', 'minimum_overall_score', 'verification_mode',
    'specification_hash',
]


def main():
    failures = []

    # Load badge catalog
    cat = json.loads(CATALOG.read_text())
    badges = cat if isinstance(cat, list) else cat.get("badges", cat.get("credentials", []))
    badge_ids = {b.get("badge_id") for b in badges}

    # Check all contracts exist
    if not CONTRACTS_DIR.exists():
        failures.append("claim_evidence_contracts directory missing")
        print(f"FAIL: test_claim_evidence_contracts — {len(failures)} issue(s)")
        for f in failures:
            print(f"  - {f}")
        return 1

    contract_files = {f.stem for f in CONTRACTS_DIR.glob("*.json")}
    missing = badge_ids - contract_files
    if missing:
        failures.append(f"Missing contracts for: {missing}")

    # Check each contract has all required fields
    for cf in CONTRACTS_DIR.glob("*.json"):
        contract = json.loads(cf.read_text())
        for field in REQUIRED_FIELDS:
            if field not in contract:
                failures.append(f"{cf.name}: missing field '{field}'")

        # Class D must be server_authoritative
        if contract.get("credential_class") == "D":
            if contract.get("verification_mode") != "server_authoritative":
                failures.append(f"{cf.name}: Class D must use server_authoritative verification_mode")

        # Class A must be local_only
        if contract.get("credential_class") == "A":
            if contract.get("verification_mode") != "local_only":
                failures.append(f"{cf.name}: Class A must use local_only verification_mode")

        # Badges with critical gates must be non-compensatory
        if contract.get("critical_gates") and len(contract.get("critical_gates", [])) > 0:
            if not contract.get("non_compensatory"):
                failures.append(f"{cf.name}: has critical_gates but non_compensatory is False")

        # Capability statement must not be empty
        if not contract.get("capability_statement", "").strip():
            failures.append(f"{cf.name}: empty capability_statement")

    if failures:
        print(f"FAIL: test_claim_evidence_contracts — {len(failures)} issue(s):")
        for f in failures[:15]:
            print(f"  - {f}")
        if len(failures) > 15:
            print(f"  ... and {len(failures) - 15} more")
        return 1

    print(f"PASS: test_claim_evidence_contracts — {len(contract_files)} contracts verified")
    return 0


if __name__ == "__main__":
    sys.exit(main())
