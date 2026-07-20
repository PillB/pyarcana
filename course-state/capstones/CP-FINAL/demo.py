#!/usr/bin/env python3
"""CP-FINAL — Enterprise integration smoke over 12 capstone packages."""
from __future__ import annotations
import json
import sys
from pathlib import Path

CAPSTONE_ID = "CP-FINAL"
REQUIRED = [
    "CP-N1-A", "CP-N1-B", "CP-N1-C",
    "CP-N2-A", "CP-N2-B", "CP-N2-C",
    "CP-N3-A", "CP-N3-B", "CP-N3-C",
    "CP-N4-A", "CP-N4-B", "CP-N4-C",
]

PACKAGE_FILES = [
    "gate.json",
    "demo.py",
    "evidence_manifest.json",
    "RUN.md",
    "system_or_data_card.md",
]


def main() -> int:
    root = Path(__file__).resolve().parent.parent
    checklist = []
    all_pass = True
    for cid in REQUIRED:
        pkg = root / cid
        entry = {
            "id": cid,
            "package_dir_exists": pkg.is_dir(),
            "files_ok": False,
            "execution_status": None,
            "pass": False,
        }
        if not pkg.is_dir():
            all_pass = False
            checklist.append(entry)
            continue
        files_ok = all((pkg / f).is_file() for f in PACKAGE_FILES)
        entry["files_ok"] = files_ok
        exec_path = pkg / "execution.json"
        status = None
        if exec_path.is_file():
            try:
                data = json.loads(exec_path.read_text(encoding="utf-8"))
                status = data.get("status")
            except json.JSONDecodeError:
                status = "invalid_json"
        entry["execution_status"] = status
        entry["pass"] = bool(files_ok and status == "pass")
        if not entry["pass"]:
            all_pass = False
        checklist.append(entry)

    n_pass = sum(1 for c in checklist if c["pass"])
    architecture = {
        "layers": [
            "N1 intake/ETL/familiarity",
            "N2 EDA/reporting/RPA",
            "N3 ER/graph/triage",
            "N4 services/MLOps/copilot",
        ],
        "integration": "Contractual smoke via execution.json status==pass",
        "data_policy": "synthetic_only",
    }
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass" if all_pass else "fail",
        "n_required": len(REQUIRED),
        "n_pass": n_pass,
        "checklist": checklist,
        "architecture": architecture,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    if not all_pass:
        print(f"{CAPSTONE_ID} FAIL — {n_pass}/{len(REQUIRED)} packages green", file=sys.stderr)
        return 1
    print(f"{CAPSTONE_ID} Integration OK — {n_pass}/{len(REQUIRED)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
