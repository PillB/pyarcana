#!/usr/bin/env python3
"""CP-N4-B — Production Data/ML Platform (registry, gate, rollback)."""
from __future__ import annotations
import hashlib
import json
import sys

CAPSTONE_ID = "CP-N4-B"


class ModelRegistry:
    def __init__(self):
        self.models = {}
        self.active = None

    def register(self, name: str, version: str, metrics: dict, artifact: str):
        key = f"{name}:{version}"
        h = hashlib.sha256(artifact.encode()).hexdigest()[:12]
        self.models[key] = {
            "name": name,
            "version": version,
            "metrics": metrics,
            "artifact_hash": h,
            "stage": "registered",
        }
        return self.models[key]

    def promote(self, name: str, version: str, min_metric: float = 0.7):
        key = f"{name}:{version}"
        m = self.models[key]
        if m["metrics"].get("accuracy", 0) < min_metric:
            m["stage"] = "blocked_by_gate"
            return False, m
        m["stage"] = "production"
        self.active = key
        return True, m

    def rollback(self, name: str, version: str):
        key = f"{name}:{version}"
        if key not in self.models:
            return False
        self.models[key]["stage"] = "production"
        # demote others
        for k, v in self.models.items():
            if k != key and v["name"] == name and v["stage"] == "production":
                v["stage"] = "rolled_back"
        self.active = key
        return True


def main() -> int:
    reg = ModelRegistry()
    lineage = []
    reg.register("triage", "1.0.0", {"accuracy": 0.81}, "artifact-v1")
    lineage.append("train:1.0.0")
    reg.register("triage", "1.1.0", {"accuracy": 0.55}, "artifact-v1.1-bad")
    lineage.append("train:1.1.0")
    ok_bad, m_bad = reg.promote("triage", "1.1.0", min_metric=0.7)
    assert ok_bad is False and m_bad["stage"] == "blocked_by_gate"
    lineage.append("gate_block:1.1.0")
    ok, m = reg.promote("triage", "1.0.0", min_metric=0.7)
    assert ok and reg.active == "triage:1.0.0"
    lineage.append("serve:1.0.0")
    reg.register("triage", "1.2.0", {"accuracy": 0.88}, "artifact-v1.2")
    reg.promote("triage", "1.2.0")
    lineage.append("serve:1.2.0")
    assert reg.active == "triage:1.2.0"
    assert reg.rollback("triage", "1.0.0")
    assert reg.active == "triage:1.0.0"
    lineage.append("rollback:1.0.0")
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "active_version": reg.active,
        "n_registered": len(reg.models),
        "gate_blocked_weak_model": True,
        "rollback_ok": True,
        "lineage": lineage,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} ML Platform OK — active={reg.active}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
