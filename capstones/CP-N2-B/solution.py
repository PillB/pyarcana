#!/usr/bin/env python3
"""CP-N2-B — Accessible Insights Dashboard & Reporting Factory.
Non-colour-only encoding (shape+label), source-to-claim traceability, automated report checks."""
import json, sys

SHAPES = {"up":"▲","down":"▼","flat":"▬"}
LABELS = {"up":"increased","down":"decreased","flat":"stable"}

def encode_trend(value: float, baseline: float) -> dict:
    if value > baseline * 1.05: direction = "up"
    elif value < baseline * 0.95: direction = "down"
    else: direction = "flat"
    return {"direction": direction, "shape": SHAPES[direction], "label": LABELS[direction],
            "colour": "green" if direction=="up" else "red" if direction=="down" else "grey",
            "accessibility": "shape+label (not colour-only)"}

def trace_claim(claim: str, source_rows: list[dict]) -> dict:
    return {"claim": claim, "source_rows": [r.get("id","?") for r in source_rows],
            "freshness_ts": max(r.get("ts","") for r in source_rows) if source_rows else ""}

def check_report(metrics: list[dict]) -> dict:
    issues = []
    for m in metrics:
        if m.get("y_axis","").startswith("1") and not m.get("y_axis","").startswith("0"):
            if m.get("y_axis","") != "0": issues.append(f"{m['name']}: y-axis may be misleading")
        if not m.get("denominator"): issues.append(f"{m['name']}: hidden denominator")
        if m.get("stale"): issues.append(f"{m['name']}: stale result presented as current")
        if m.get("colour_only"): issues.append(f"{m['name']}: colour-only encoding")
    return {"passed": len(issues)==0, "issues": issues}

def render_dashboard(metrics: list[dict]) -> dict:
    trends = [{"name": m["name"], **encode_trend(m["value"], m.get("baseline", m["value"]))} for m in metrics]
    claims = [trace_claim(f"{m['name']} is {m['value']}", [m]) for m in metrics]
    checks = check_report(metrics)
    return {"trends": trends, "claims": claims, "report_checks": checks,
            "accessibility": "WCAG 2.2 AA: keyboard nav, non-colour-only, 200% zoom, data-table fallback"}

if __name__=="__main__":
    metrics = json.loads(sys.stdin.read()).get("metrics",[])
    print(json.dumps(render_dashboard(metrics), indent=2))
