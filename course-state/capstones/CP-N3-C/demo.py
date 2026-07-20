#!/usr/bin/env python3
"""CP-N3-C — Responsible ML Case Triage (synthetic; abstention; no fraud claim)."""
from __future__ import annotations
import json
import random
import sys

CAPSTONE_ID = "CP-N3-C"
SEED = 7


def synthesize(n=200):
    rng = random.Random(SEED)
    X, y = [], []
    for _ in range(n):
        # features: urgency, volume, customer_tier_code (synthetic)
        urgency = rng.random()
        volume = rng.random()
        tier = rng.choice([0, 1, 2])
        # synthetic label: operational priority, NOT fraud
        label = 1 if (0.6 * urgency + 0.3 * volume + 0.1 * tier / 2) > 0.55 else 0
        X.append((urgency, volume, tier))
        y.append(label)
    return X, y


def score(row):
    u, v, t = row
    return 0.55 * u + 0.35 * v + 0.10 * (t / 2)


def decide(s, thr_hi=0.62, thr_lo=0.42):
    if s >= thr_hi:
        return "auto_high_priority"
    if s <= thr_lo:
        return "auto_low_priority"
    return "abstain_human_review"


def main() -> int:
    X, y = synthesize()
    preds, decisions = [], []
    for row in X:
        s = score(row)
        d = decide(s)
        decisions.append(d)
        preds.append(1 if d == "auto_high_priority" else 0 if d == "auto_low_priority" else -1)
    # evaluate only non-abstain vs label high=1
    evaluated = [(p, yt) for p, yt in zip(preds, y) if p in (0, 1)]
    correct = sum(1 for p, yt in evaluated if p == yt)
    acc = correct / len(evaluated) if evaluated else 0.0
    baseline_acc = max(y.count(0), y.count(1)) / len(y)
    abstain_rate = decisions.count("abstain_human_review") / len(decisions)
    # segment proxy
    seg = {"tier0": [], "tier1": [], "tier2": []}
    for row, d in zip(X, decisions):
        seg[f"tier{row[2]}"].append(d)
    seg_abstain = {k: (v.count("abstain_human_review") / len(v) if v else 0.0) for k, v in seg.items()}
    model_card = {
        "name": "synthetic_ops_triage_v0",
        "intended_use": "Prioritize synthetic ops cases for human queues",
        "not_for": ["fraud detection", "credit", "criminal inference"],
        "human_oversight": "abstain band → human review",
        "limitations": "Toy linear score; not production calibrated",
    }
    # monitoring proxy: shift urgency mean
    drift_proxy = abs(sum(r[0] for r in X) / len(X) - 0.5)
    assert abstain_rate > 0
    assert acc >= baseline_acc * 0.8  # not worse than catastrophic
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "n": len(y),
        "baseline_acc": round(baseline_acc, 4),
        "model_acc_non_abstain": round(acc, 4),
        "abstain_rate": round(abstain_rate, 4),
        "seg_abstain_rate": {k: round(v, 4) for k, v in seg_abstain.items()},
        "drift_proxy": round(drift_proxy, 4),
        "model_card": model_card,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} Triage OK — acc={acc:.2f} abstain={abstain_rate:.2%}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
