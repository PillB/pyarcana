"""CP-N3-C — Responsible ML Case Triage (reference solution).

Deterministic baseline, leakage-proof time-aware split, logistic regression
with calibration report, cost-aware threshold, abstention policy, subgroup +
temporal performance, drift detector, model card. No unreviewed adverse
decision — all "adverse" (high-risk) predictions are routed to human review.
"""
from __future__ import annotations

import argparse
import json
import math
import os
import statistics
import sys
from collections import defaultdict
from datetime import datetime


def sigmoid(z: float) -> float:
    if z >= 0:
        ez = math.exp(-z)
        return 1.0 / (1.0 + ez)
    ez = math.exp(z)
    return ez / (1.0 + ez)


def time_aware_split(rows, train_frac=0.7, dev_frac=0.15):
    """Split by timestamp — earlier rows for train, later for dev/test (no leakage)."""
    rs = sorted(rows, key=lambda r: r["timestamp"])
    n = len(rs)
    n_tr = int(n * train_frac)
    n_dv = int(n * dev_frac)
    return rs[:n_tr], rs[n_tr:n_tr + n_dv], rs[n_tr + n_dv:]


def featurise(row):
    f = row["features"]
    return [f["f1"], f["f2"], f["f3"]]


def train_logreg(rows, lr=0.05, epochs=200, l2=0.01):
    """Vanilla logistic regression with L2; pure stdlib."""
    X = [featurise(r) for r in rows]
    y = [r["outcome"] for r in rows]
    n, d = len(X), len(X[0]) if X else 0
    w = [0.0] * d
    b = 0.0
    for _ in range(epochs):
        gw = [0.0] * d
        gb = 0.0
        for xi, yi in zip(X, y):
            z = b + sum(w[j] * xi[j] for j in range(d))
            p = sigmoid(z)
            err = p - yi
            for j in range(d):
                gw[j] += err * xi[j]
            gb += err
        for j in range(d):
            w[j] -= lr * (gw[j] / n + l2 * w[j])
        b -= lr * (gb / n)
    return {"weights": w, "bias": b}


def predict(model, row):
    z = model["bias"] + sum(w * x for w, x in zip(model["weights"], featurise(row)))
    return sigmoid(z)


def majority_baseline(rows):
    """Deterministic baseline: predict the majority class."""
    cnt = defaultdict(int)
    for r in rows:
        cnt[r["outcome"]] += 1
    majority = max(cnt, key=cnt.get)
    correct = sum(1 for r in rows if r["outcome"] == majority)
    return {"name": "majority_class", "majority": majority,
            "accuracy": round(correct / len(rows), 4) if rows else 0.0}


def accuracy(model, rows, threshold):
    tp = fp = tn = fn = 0
    for r in rows:
        p = predict(model, r)
        pred = 1 if p >= threshold else 0
        if pred == 1 and r["outcome"] == 1:
            tp += 1
        elif pred == 1 and r["outcome"] == 0:
            fp += 1
        elif pred == 0 and r["outcome"] == 0:
            tn += 1
        else:
            fn += 1
    n = len(rows)
    return {"accuracy": round((tp + tn) / n, 4) if n else 0.0,
            "precision": round(tp / (tp + fp), 4) if (tp + fp) else 0.0,
            "recall": round(tp / (tp + fn), 4) if (tp + fn) else 0.0,
            "tp": tp, "fp": fp, "tn": tn, "fn": fn}


def calibration(model, rows, bins=10):
    counts = [0] * bins
    pos = [0] * bins
    sum_p = [0.0] * bins
    for r in rows:
        p = predict(model, r)
        idx = min(bins - 1, int(p * bins))
        counts[idx] += 1
        pos[idx] += r["outcome"]
        sum_p[idx] += p
    return [{"bin": i, "avg_prob": round(sum_p[i] / counts[i], 4) if counts[i] else 0.0,
             "empirical_freq": round(pos[i] / counts[i], 4) if counts[i] else 0.0,
             "count": counts[i]} for i in range(bins)]


def select_threshold(model, rows, cost_fp=1.0, cost_fn=3.0):
    best_t, best_cost = 0.5, float("inf")
    for t in [i / 20 for i in range(1, 21)]:
        m = accuracy(model, rows, t)
        cost = cost_fp * m["fp"] + cost_fn * m["fn"]
        if cost < best_cost:
            best_cost, best_t = cost, t
    return {"threshold": best_t, "cost": best_cost,
            "rationale": f"minimised cost_fp={cost_fp}*FP + cost_fn={cost_fn}*FN"}


def abstain(model, rows, threshold, lo=0.4, hi=0.6):
    """Route cases with probabilities in the uncertain band to human review."""
    out = []
    n_abstain = 0
    for r in rows:
        p = predict(model, r)
        if lo <= p <= hi:
            out.append({"case_id": r["case_id"], "probability": round(p, 4),
                        "action": "human_review", "reason": "uncertain probability band"})
            n_abstain += 1
        else:
            pred = 1 if p >= threshold else 0
            # No unreviewed adverse decision: even confident positives route to review.
            action = "human_review" if pred == 1 else "auto_close"
            out.append({"case_id": r["case_id"], "probability": round(p, 4),
                        "action": action, "reason": "adverse decisions require human review"})
    return {"abstain_count": n_abstain, "policy": f"abstain band [{lo}, {hi}]", "rows": out}


def subgroup_performance(model, rows, threshold):
    by = defaultdict(list)
    for r in rows:
        by[r["subgroup"]].append(r)
    out = {}
    for g, rs in by.items():
        out[g] = accuracy(model, rs, threshold)
    return out


def temporal_performance(model, rows, threshold):
    by = defaultdict(list)
    for r in rows:
        month = r["timestamp"][:7]
        by[month].append(r)
    out = {}
    for m, rs in sorted(by.items()):
        out[m] = accuracy(model, rs, threshold)
    return out


def drift(train_metrics, test_metrics):
    """Static drift report: compare train vs test accuracy per subgroup."""
    diffs = {}
    for g, m in test_metrics.items():
        train_acc = train_metrics.get(g, {}).get("accuracy", 0.0)
        diffs[g] = round(train_acc - m["accuracy"], 4)
    return {"acc_drop_by_subgroup": diffs,
            "alert": any(abs(d) > 0.05 for d in diffs.values())}


def model_card(metrics, threshold, calibration_data):
    return f"""# Model Card — CP-N3-C Responsible ML Case Triage

## Intended use
Decision support for synthetic case triage. NOT an automated adverse-decision
system. Every high-risk prediction routes to human review.

## Dataset
Synthetic; 30,000 cases; CC0; no real PII.

## Split
Time-aware split (train 70% / dev 15% / test 15%) — no leakage of future into past.

## Baseline
Majority-class baseline accuracy: see baseline.json.

## Model
Logistic regression (3 features), L2 regularised, trained in pure stdlib.

## Performance
- Accuracy: {metrics['accuracy']}
- Precision: {metrics['precision']}
- Recall: {metrics['recall']}

## Calibration
Bin-based reliability reported in calibration.json (10 bins).

## Threshold
Selected at {threshold['threshold']} by minimising cost_fp*FP + cost_fn*FN.
Rationale: {threshold['rationale']}.

## Abstention policy
Cases with probability in the uncertain band [0.4, 0.6] route to human review.
All adverse (positive) predictions route to human review regardless of confidence.

## Subgroup + temporal performance
Reported in subgroup.json and temporal.json. Disparities are explained, not
hidden.

## Drift
Static drift report in drift.json.

## Limitations
Pure-stdlib logistic regression; not a deep model. Calibration is bin-based.
No real-time drift detection — a static report is produced.

## Reproducibility
Reproducible from this repo: `python3 generator.py --output fixtures/ &&
python3 solution.py --input fixtures/sample.json --outdir /tmp/triage`.
"""


def run(input_path, outdir):
    os.makedirs(outdir, exist_ok=True)
    rows = json.load(open(input_path, encoding="utf-8"))
    train, dev, test = time_aware_split(rows)
    base = majority_baseline(train)
    model = train_logreg(train)
    th = select_threshold(model, dev)
    metrics = accuracy(model, test, th["threshold"])
    cal = calibration(model, test)
    abst = abstain(model, test, th["threshold"])
    sub = subgroup_performance(model, test, th["threshold"])
    tmp = temporal_performance(model, test, th["threshold"])
    train_sub = subgroup_performance(model, train, th["threshold"])
    drf = drift(train_sub, sub)
    card = model_card(metrics, th, cal)
    for name, obj in (("baseline.json", base), ("metrics.json", metrics),
                      ("calibration.json", cal), ("threshold.json", th),
                      ("abstention.json", abst), ("subgroup.json", sub),
                      ("temporal.json", tmp), ("drift.json", drf)):
        with open(os.path.join(outdir, name), "w", encoding="utf-8") as f:
            json.dump(obj, f, ensure_ascii=False, indent=2)
    with open(os.path.join(outdir, "model_card.md"), "w", encoding="utf-8") as f:
        f.write(card)
    return {"baseline_accuracy": base["accuracy"], "model_accuracy": metrics["accuracy"],
            "threshold": th["threshold"], "abstain_count": abst["abstain_count"]}


def main(argv=None):
    ap = argparse.ArgumentParser(description="CP-N3-C responsible ML triage")
    ap.add_argument("--input", required=True)
    ap.add_argument("--outdir", required=True)
    args = ap.parse_args(argv)
    out = run(args.input, args.outdir)
    print(json.dumps(out, indent=2))
    return 0


if __name__ == "__main__":
    sys.exit(main())
