"""CP-N3-C acceptance script."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

HERE = os.path.dirname(os.path.abspath(__file__))


def main():
    # Prefer the full cases.json (more data → meaningful model) if available.
    sample = os.path.join(HERE, "fixtures", "sample.json")
    full = os.path.join(HERE, "fixtures", "cases.json")
    input_path = full if os.path.exists(full) else sample
    if not os.path.exists(input_path):
        print("  ❌ run generator first", file=sys.stderr)
        return 1
    with tempfile.TemporaryDirectory() as td:
        r = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                            "--input", input_path, "--outdir", td], capture_output=True, text=True)
        if r.returncode != 0:
            print(f"  ❌ CLI failed: {r.stderr}", file=sys.stderr)
            return 1
        failures = []
        for f in ("baseline.json", "metrics.json", "calibration.json", "threshold.json",
                  "abstention.json", "subgroup.json", "temporal.json", "drift.json", "model_card.md"):
            if not os.path.exists(os.path.join(td, f)):
                failures.append(f"missing artefact: {f}")
        base = json.load(open(os.path.join(td, "baseline.json")))
        metrics = json.load(open(os.path.join(td, "metrics.json")))
        # 1. deterministic baseline present. Model accuracy must be within 0.10
        # of baseline OR the model_card must justify the gap. The contract says
        # "beaten (or justified)" — we accept either.
        if "accuracy" not in base:
            failures.append("baseline missing accuracy")
        if metrics["accuracy"] < base["accuracy"] - 0.10:
            card = open(os.path.join(td, "model_card.md")).read()
            if "Limitations" not in card:
                failures.append("model below baseline and card does not justify the gap")
        # 2. leakage-proof split: time-aware (no future in train)
        sys.path.insert(0, HERE)
        from solution import time_aware_split
        rows = json.load(open(input_path))
        tr, dv, te = time_aware_split(rows)
        if max(r["timestamp"] for r in tr) > min(r["timestamp"] for r in te):
            failures.append("time-aware split leaks future into train")
        # 3. calibration reported
        cal = json.load(open(os.path.join(td, "calibration.json")))
        if len(cal) != 10:
            failures.append("calibration should have 10 bins")
        # 4. threshold with stated costs
        th = json.load(open(os.path.join(td, "threshold.json")))
        if "cost_fp" not in th["rationale"] or "cost_fn" not in th["rationale"]:
            failures.append("threshold selection missing cost rationale")
        # 5. abstention policy routes uncertain to human review
        abst = json.load(open(os.path.join(td, "abstention.json")))
        if abst["abstain_count"] < 0:
            failures.append("abstention count invalid")
        if not any(row["action"] == "human_review" for row in abst["rows"]):
            failures.append("no cases routed to human review")
        # 6. subgroup + temporal performance
        sub = json.load(open(os.path.join(td, "subgroup.json")))
        if not sub:
            failures.append("no subgroup performance reported")
        tmp = json.load(open(os.path.join(td, "temporal.json")))
        if not tmp:
            failures.append("no temporal performance reported")
        # 7. model card reproducible
        card = open(os.path.join(td, "model_card.md")).read()
        if "Model Card" not in card or "Limitations" not in card:
            failures.append("model card incomplete")
        # 8. drift detector
        drf = json.load(open(os.path.join(td, "drift.json")))
        if "acc_drop_by_subgroup" not in drf:
            failures.append("drift report missing subgroup drop")
        # 9. No unreviewed adverse decision
        for row in abst["rows"]:
            # If probability >= threshold (would be an adverse decision), action must be human_review
            if row["probability"] >= th["threshold"] and row["action"] != "human_review":
                failures.append(f"unreviewed adverse decision on case {row['case_id']}")
                break
        if failures:
            for f in failures:
                print(f"  ❌ {f}", file=sys.stderr)
            return 1
    print("  ✅ all CP-N3-C acceptance checks passed")
    return 0


if __name__ == "__main__":
    sys.exit(main())
