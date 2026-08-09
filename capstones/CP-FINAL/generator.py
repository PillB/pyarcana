"""CP-FINAL — shared synthetic scenario spanning all twelve subsystems.

Schema: scenario_id, subsystem, interface_version, input, output,
contract_test_status, e2e_status.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import json
import os

SCENARIO_ID = "ACME-001-final"

SUBSYSTEMS = [
    ("CP-N1-A", "intake.ingest", "v1",
     {"records": [{"client_id": "ACME-001", "name": "Ana Almeida", "dob": "1990-05-12",
                   "phone": "+1-415-555-1234", "address": "10 Maple Ave, Springfield, IL 62701"}]},
     {"accepted": 1, "rejected": 0, "review": 0}),
    ("CP-N1-B", "etl.run", "v1",
     {"source": "fixtures/clients.csv"},
     {"manifest": {"accepted_count": 1}, "outputs": ["accepted.jsonl"], "quarantined": []}),
    ("CP-N1-C", "familiarity.review", "v1",
     {"pair_id": "PAIR-000001"},
     {"er": [], "relationship": [], "risk": "no_decision", "provenance": "CP-N1-C/v1"}),
    ("CP-N2-A", "eda.profile", "v1",
     {"dataset_version": "ds-clients-v1"},
     {"dictionary": [], "missingness": {}, "distributions": {}}),
    ("CP-N2-B", "reporting.render", "v1",
     {"template": "summary", "data": {}},
     {"pdf": "report.pdf", "claims": []}),
    ("CP-N2-C", "automation.run", "v1",
     {"input": "fixtures/sample.json", "dry_run": True},
     {"run_id": "R-0001", "audit": [], "approval_required": False}),
    ("CP-N3-A", "er.resolve", "v1",
     {"records": [{"record_id": "R1", "name": "Ana Almeida", "dob": "1990-05-12"}]},
     {"clusters": [["R1"]], "ambiguous_queue": [], "metrics": {"precision": 1.0, "recall": 1.0}}),
    ("CP-N3-B", "relationship.graph", "v1",
     {"entities": ["ACME-001"], "evidence": []},
     {"graph": [], "paths": [], "edges_meta": []}),
    ("CP-N3-C", "triage.score", "v1",
     {"case": {"features": {"f1": 0.5, "f2": 0.5, "f3": 0.5}}},
     {"score": 0.5, "calibrated_prob": 0.5, "abstain": False, "model_card_ref": "model_card.md"}),
    ("CP-N4-A", "service.api", "v1",
     {"endpoint": "/service/v1/ingest", "method": "POST"},
     {"status": 200, "redacted_log": "[redacted]"}),
    ("CP-N4-B", "mlplatform.deploy", "v1",
     {"model_version": "model-01-v3", "strategy": "canary"},
     {"deployment_id": "D-001", "slo": "ok", "rollback_target": "model-01-v3"}),
    ("CP-N4-C", "copilot.run", "v1",
     {"task": "Summarise KYC for ACME-001", "provider_mode": "no-key", "budget": {}},
     {"run_id": "RUN-001", "steps": 5, "citations": [], "trace": [],
      "approval_status": "not_required"}),
]


def generate():
    rows = []
    for capstone, iface, ver, inp, out in SUBSYSTEMS:
        rows.append({
            "scenario_id": SCENARIO_ID,
            "capstone_id": capstone,
            "subsystem": iface,
            "interface_version": ver,
            "input": inp,
            "output": out,
            "contract_test_status": "pending",
            "e2e_status": "pending",
        })
    return {"scenario_id": SCENARIO_ID, "subsystems": rows, "shared_trace_id": "trace-final-001"}


def write_outputs(data, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "scenario.json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    # sample.json: 18 rows for quick testing (we have 12 subsystems, so add the
    # six dependency-graph edges to reach 18 rows total).
    sample = {
        "scenario_id": data["scenario_id"],
        "shared_trace_id": data["shared_trace_id"],
        "subsystems": data["subsystems"],
        "dependency_graph": [
            {"from": "CP-N1-A", "to": "CP-N1-B", "interface": "intake → etl"},
            {"from": "CP-N1-B", "to": "CP-N2-A", "interface": "etl → eda"},
            {"from": "CP-N1-C", "to": "CP-N3-A", "interface": "familiarity → er"},
            {"from": "CP-N3-A", "to": "CP-N3-B", "interface": "er → relationship"},
            {"from": "CP-N3-C", "to": "CP-N4-B", "interface": "triage → mlplatform"},
            {"from": "CP-N4-A", "to": "CP-N4-C", "interface": "service → copilot"},
        ],
    }
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(sample, f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-FINAL synthetic scenario generator")
    ap.add_argument("--output", default="fixtures/")
    args = ap.parse_args()
    data = generate()
    write_outputs(data, args.output)
    print(f"CP-FINAL generator: wrote {len(data['subsystems'])} subsystems to {args.output}")


if __name__ == "__main__":
    main()
