#!/usr/bin/env python3
"""CP-N2-A acceptance — 5-part memo + missingness + segments."""
import sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from solution import run_eda, profile, missingness_mechanism

def check(n,c,d=""): print(f"[{'PASS' if c else 'FAIL'}] {n}" + (f" — {d}" if d else "")); return c

def main():
    ok = True
    recs = [{"id":str(i),"segment":"A" if i%2 else "B","amount":str(i*10)} for i in range(1,21)]
    recs[0]["amount"] = ""
    r = run_eda(recs)
    m = r["executive_memo"]
    ok &= check("memo has observation", bool(m["observation"]))
    ok &= check("memo has association", bool(m["association"]))
    ok &= check("memo has hypothesis", bool(m["hypothesis"]))
    ok &= check("memo has recommendation", bool(m["recommendation"]))
    ok &= check("memo has limitation", bool(m["limitation"]))
    ok &= check("no causal claim", "causal" not in m["observation"].lower())
    ok &= check("profile row count", r["profile"]["row_count"]==20)
    ok &= check("missingness detected", any(v for v in r["missingness"].values()))
    ok &= check("segments computed", len(r["segments"])>=2)
    print(f"\n{'ALL PASS' if ok else 'SOME FAILED'}")
    return 0 if ok else 1

if __name__=="__main__": sys.exit(main())
