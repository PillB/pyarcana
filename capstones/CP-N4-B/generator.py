"""CP-N4-B — synthetic model artifacts and datasets with versioned lineage.

Schema: model_id, version, dataset_version, signature, train_metric, serve_metric,
slo_status, rollback_target.

Usage: python3 generator.py --output fixtures/
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import random

SEED = 20240311
DATASETS = ["ds-clients-v1", "ds-clients-v2", "ds-txns-v1", "ds-txns-v2", "ds-triage-v1"]


def _sig(model_id, version):
    return hashlib.sha256(f"{model_id}:{version}".encode()).hexdigest()[:16]


def generate(n_models=5, n_versions=4, seed=SEED):
    rng = random.Random(seed)
    rows = []
    for mi in range(1, n_models + 1):
        last_known_good = None
        for vi in range(1, n_versions + 1):
            train = round(rng.uniform(0.7, 0.95), 4)
            # train/serve skew: small on most, large on one
            skew = 0.0 if vi != 2 else round(rng.uniform(0.1, 0.2), 4)
            serve = round(train - skew, 4)
            # mark a rollback target on versions 2 and 4 (the bad ones)
            is_rollback = vi in (2, 4)
            slo = "violated" if is_rollback else "ok"
            if not is_rollback:
                last_known_good = f"model-{mi:02d}-v{vi}"
            row = {
                "model_id": f"model-{mi:02d}",
                "version": f"v{vi}",
                "dataset_version": rng.choice(DATASETS),
                "signature": _sig(f"model-{mi:02d}", f"v{vi}"),
                "train_metric": train,
                "serve_metric": serve,
                "slo_status": slo,
                "rollback_target": last_known_good,
            }
            rows.append(row)
    return rows


def write_outputs(rows, out_dir):
    os.makedirs(out_dir, exist_ok=True)
    with open(os.path.join(out_dir, "models.json"), "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=2)
    with open(os.path.join(out_dir, "sample.json"), "w", encoding="utf-8") as f:
        json.dump(rows[:18], f, ensure_ascii=False, indent=2)


def main():
    ap = argparse.ArgumentParser(description="CP-N4-B synthetic data generator")
    ap.add_argument("--output", default="fixtures/")
    ap.add_argument("--seed", type=int, default=SEED)
    ap.add_argument("--models", type=int, default=5)
    ap.add_argument("--versions", type=int, default=4)
    args = ap.parse_args()
    rows = generate(args.models, args.versions, args.seed)
    write_outputs(rows, args.output)
    print(f"CP-N4-B generator: wrote {len(rows)} model versions to {args.output}")


if __name__ == "__main__":
    main()
