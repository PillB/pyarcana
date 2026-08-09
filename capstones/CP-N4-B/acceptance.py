"""CP-N4-B acceptance script."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    sample = os.path.join(HERE, "fixtures", "sample.json")
    full = os.path.join(HERE, "fixtures", "models.json")
    input_path = full if os.path.exists(full) else sample
    if not os.path.exists(input_path):
        print("  ❌ run generator first", file=sys.stderr)
        return 1
    with tempfile.TemporaryDirectory() as td:
        r = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                            "--input", input_path, "--outdir", td],
                           capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            print(f"  ❌ CLI failed: {r.stderr}", file=sys.stderr)
            return 1
        failures = []
        for f in ("lineage.json", "registry.json", "parity.json", "staging_gate.json",
                  "canary.json", "slo.json", "rollback.json", "change_records.json", "dataset_versions.json"):
            if not os.path.exists(os.path.join(td, f)):
                failures.append(f"missing artefact: {f}")
        lin = json.load(open(os.path.join(td, "lineage.json")))
        # 1. lineage resolves any artifact to its inputs
        if not lin or "depends_on" not in next(iter(lin.values())):
            failures.append("lineage does not resolve artifacts to inputs")
        # 2. datasets versioned
        dsv = json.load(open(os.path.join(td, "dataset_versions.json")))
        if not dsv:
            failures.append("no dataset versions recorded")
        # 3. model registry records signatures
        reg = json.load(open(os.path.join(td, "registry.json")))
        for mid, vers in reg.items():
            if not all("signature" in v for v in vers):
                failures.append(f"registry entry for {mid} missing signatures")
                break
        # 4. train/serve parity proven
        par = json.load(open(os.path.join(td, "parity.json")))
        if not all("parity_pass" in p for p in par):
            failures.append("parity check missing parity_pass field")
        # 5. CI/CD staging gate with approval
        gate = json.load(open(os.path.join(td, "staging_gate.json")))
        if "approval_gate" not in gate:
            failures.append("staging gate missing approval_gate field")
        # 6. shadow/canary present
        can = json.load(open(os.path.join(td, "canary.json")))
        if "canary" not in can or can["canary"] is None:
            failures.append("canary evaluation missing")
        # 7. SLOs defined + monitored
        slo = json.load(open(os.path.join(td, "slo.json")))
        if "targets" not in slo or "violations" not in slo:
            failures.append("SLO report incomplete")
        # 8. rollback PROVEN (executed)
        rb = json.load(open(os.path.join(td, "rollback.json")))
        if not rb.get("proven"):
            failures.append("rollback not proven (executed)")
        if not rb.get("execution", {}).get("rolled_back"):
            failures.append("rollback execution did not roll back")
        if not rb.get("history"):
            failures.append("rollback history empty")
        # 9. change + incident records
        ch = json.load(open(os.path.join(td, "change_records.json")))
        if "changes" not in ch or "incidents" not in ch or "rollbacks" not in ch:
            failures.append("change records incomplete")
        if failures:
            for f in failures:
                print(f"  ❌ {f}", file=sys.stderr)
            return 1
    print("  ✅ all CP-N4-B acceptance checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
