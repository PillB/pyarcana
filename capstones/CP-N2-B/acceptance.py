#!/usr/bin/env python3
"""CP-N2-B acceptance — accessibility + traceability + report checks."""
import sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from solution import render_dashboard, encode_trend, check_report

def check(n,c,d=""): print(f"[{'PASS' if c else 'FAIL'}] {n}" + (f" — {d}" if d else "")); return c

def main():
    ok = True
    metrics = [{"name":"revenue","value":110,"baseline":100,"id":"m1","ts":"2026-07-01","y_axis":"0-200","denominator":"total_sales"},
               {"name":"churn","value":5,"baseline":10,"id":"m2","ts":"2026-07-01","y_axis":"0-20","denominator":"users"}]
    d = render_dashboard(metrics)
    ok &= check("trends computed", len(d["trends"])==2)
    ok &= check("non-colour-only encoding", all("shape" in t and "label" in t for t in d["trends"]))
    ok &= check("claims traced", all(c["source_rows"] for c in d["claims"]))
    ok &= check("freshness present", all(c["freshness_ts"] for c in d["claims"]))
    ok &= check("report checks pass", d["report_checks"]["passed"])
    bad = [{"name":"x","value":1,"y_axis":"1-2","colour_only":True,"stale":True}]
    ok &= check("checks catch issues", not check_report(bad)["passed"])
    t = encode_trend(110, 100)
    ok &= check("shape+label present", bool(t["shape"]) and bool(t["label"]))
    print(f"\n{'ALL PASS' if ok else 'SOME FAILED'}")
    return 0 if ok else 1

if __name__=="__main__": sys.exit(main())
