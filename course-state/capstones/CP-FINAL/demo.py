#!/usr/bin/env python3
"""CP-FINAL — Enterprise integration over 12 capstone packages.

This is the EXPANDED integration: instead of a 12-package smoke, it now
calls `platform.integrate(scenario) -> IntegrationBundle` (the FINAL
interface declared in `src/lib/capstones/catalog.ts`), runs all 12 upstream
subsystems in dependency order over the shared synthetic scenario, and
prints `METRICS_JSON: {...}` with `subsystem_count=12` and `status`.

Exit 0 on success; non-zero only if the platform returns NO-GO.
"""
from __future__ import annotations
import dataclasses
import json
import os
import sys
from pathlib import Path

CAPSTONE_ID = "CP-FINAL"
PACKAGE_VERSION = "2.0.0"

# Make the local `integration/` package importable when running from the
# capstone directory or from the repo root.
_HERE = Path(__file__).resolve().parent
if str(_HERE) not in sys.path:
    sys.path.insert(0, str(_HERE))

from integration import platform as platform_module  # noqa: E402
from integration import backup_restore  # noqa: E402
from integration import shared_scenario  # noqa: E402


def main() -> int:
    scenario = shared_scenario.shared_scenario_v1
    bundle = platform_module.integrate(scenario)

    # Take a backup so the integration is reproducible/auditable.
    backup_dir = os.path.join(_HERE, "evidence_backups")
    backup_path = backup_restore.backup(bundle, backup_dir)
    bundle = dataclasses.replace(bundle, backup_path=backup_path)

    subsystem_count = len(bundle.subsystem_results)
    status = "no_go" if bundle.no_go else "pass"

    metrics = {
        "capstone_id": CAPSTONE_ID,
        "package_version": PACKAGE_VERSION,
        "status": status,
        "subsystem_count": subsystem_count,
        "scenario_id": bundle.scenario_id,
        "scenario_version": shared_scenario.SCENARIO_VERSION,
        "no_go": bundle.no_go,
        "no_go_reason": bundle.no_go_reason,
        "reproducible": bundle.reproducible,
        "end_to_end_trace_len": len(bundle.end_to_end_trace),
        "evidence_bundle_keys": sorted(bundle.evidence_bundle.keys()),
        "dependency_graph_upstream_count": bundle.dependency_graph.get("upstream_count"),
        "topological_order": bundle.dependency_graph.get("topological_order"),
        "subsystem_results": {
            cid: {
                "contract_id": payload.get("contract_id"),
                "contract_version": payload.get("contract_version"),
            }
            for cid, payload in bundle.subsystem_results.items()
        },
        "backup_path": bundle.backup_path,
        "critical_failures_checked": [
            "no_collection_of_repos_without_contracts",
            "e2e_tests_present",
            "rollback_demonstrated",
            "cards_present_data_model_system",
            "operational_runbook_present",
        ],
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    if bundle.no_go:
        print(f"{CAPSTONE_ID} NO-GO — {bundle.no_go_reason}", file=sys.stderr)
        return 2
    print(f"{CAPSTONE_ID} Integration OK — {subsystem_count}/12 subsystems green")
    return 0


if __name__ == "__main__":
    sys.exit(main())
