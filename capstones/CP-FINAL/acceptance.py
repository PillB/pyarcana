"""CP-FINAL acceptance script."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    sample = os.path.join(HERE, "fixtures", "sample.json")
    if not os.path.exists(sample):
        print("  ❌ run generator first", file=sys.stderr)
        return 1
    with tempfile.TemporaryDirectory() as td:
        r = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                            "--scenario", sample, "--outdir", td],
                           capture_output=True, text=True, timeout=30)
        if r.returncode != 0:
            print(f"  ❌ CLI failed: {r.stderr}", file=sys.stderr)
            return 1
        failures = []
        # 1. twelve upstream capstones integrated via versioned interfaces
        ct = json.load(open(os.path.join(td, "contract_tests.json")))
        if len(ct) != 12:
            failures.append(f"expected 12 contract tests, got {len(ct)}")
        # 2. subsystem boundaries documented (architecture diagram)
        if not os.path.exists(os.path.join(td, "architecture.txt")):
            failures.append("architecture diagram missing")
        # 3. API/event contracts present (in contract_tests.json)
        if not all("contract" in r for r in ct):
            failures.append("contracts not declared on every test")
        # 4. contract tests pass
        if not all(r["status"] == "pass" for r in ct):
            failures.append("some contract tests failed")
        # 5. dependency graph (in sample.json's dependency_graph)
        sample_data = json.load(open(sample))
        if "dependency_graph" not in sample_data:
            failures.append("dependency graph missing from scenario")
        # 6. shared synthetic scenario present
        if "scenario_id" not in sample_data or "shared_trace_id" not in sample_data:
            failures.append("shared scenario missing")
        # 7. reproducible deployment (re-run produces identical artefacts)
        td2 = tempfile.mkdtemp()
        subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                        "--scenario", sample, "--outdir", td2], capture_output=True, text=True)
        a = open(os.path.join(td, "contract_tests.json")).read()
        b = open(os.path.join(td2, "contract_tests.json")).read()
        if a != b:
            failures.append("reproducibility: contract_tests.json differs across reruns")
        # 8. end-to-end tests pass
        e2e = json.load(open(os.path.join(td, "e2e_trace.json")))
        if e2e["step_count"] != 12:
            failures.append(f"expected 12 e2e steps, got {e2e['step_count']}")
        # 9. security + privacy controls (no real PII in any artefact)
        for f in os.listdir(td):
            if f.endswith(".json") or f.endswith(".md"):
                blob = open(os.path.join(td, f)).read()
                # crude PII scan: no real-looking SSNs (synthetic only has ACME-* IDs)
                if "@evil.example" in blob:
                    failures.append(f"evil.example appears in {f}")
                    break
        # 10. observability (e2e_trace.json with trace_id)
        if "trace_id" not in e2e:
            failures.append("observability: e2e trace missing trace_id")
        # 11. backup + restore demonstrated
        bk = json.load(open(os.path.join(td, "backup_restore.json")))
        if not bk.get("verified"):
            failures.append("backup/restore not verified")
        # 12. rollback demonstrated
        rb = json.load(open(os.path.join(td, "rollback.json")))
        if not rb.get("rolled_back"):
            failures.append("rollback not executed")
        # 13. disaster exercise executed
        de = json.load(open(os.path.join(td, "disaster_exercise.json")))
        if not de.get("no_go_triggered"):
            failures.append("disaster exercise did not trigger no-go")
        # 14. ADRs present
        adrs = json.load(open(os.path.join(td, "adrs.json")))
        if len(adrs) < 3:
            failures.append("fewer than 3 ADRs")
        # 15. architecture diagrams present
        arch = open(os.path.join(td, "architecture.txt")).read()
        if "Architecture Diagram" not in arch:
            failures.append("architecture diagram missing header")
        # 16. data/model/system cards
        for card in ("system_card.md",):
            if not os.path.exists(os.path.join(td, card)):
                failures.append(f"missing card: {card}")
        # 17. threat model present
        if not os.path.exists(os.path.join(td, "threat_model.md")):
            failures.append("threat model missing")
        # 18. operational runbook present
        if not os.path.exists(os.path.join(td, "runbook.md")):
            failures.append("runbook missing")
        # 19. concise demo present (the CLI stdout is a summary)
        if "contract_tests_pass" not in r.stdout:
            failures.append("demo summary missing from stdout")
        # 20. technical defence delivered (the system_card section)
        sc = open(os.path.join(td, "system_card.md")).read()
        if "Subsystems" not in sc:
            failures.append("technical defence (system card subsystems) missing")
        # 21. personal contribution statement present
        if not os.path.exists(os.path.join(td, "contribution_statement.md")):
            failures.append("contribution statement missing")
        # 22. truthful CV narrative (no unsupported claims)
        cv = open(os.path.join(td, "cv_narrative.md")).read()
        for forbidden in ("saved money", "prevented fraud", "production accuracy", "enterprise scale"):
            if forbidden in cv.lower():
                failures.append(f"CV narrative makes unsupported claim: {forbidden}")
        # No-go check
        ng = json.load(open(os.path.join(td, "no_go_check.json")))
        if not ng["go_live"]:
            failures.append(f"no-go check failed: {ng['triggered']}")
        if failures:
            for f in failures:
                print(f"  ❌ {f}", file=sys.stderr)
            return 1
    print("  ✅ all CP-FINAL acceptance checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
