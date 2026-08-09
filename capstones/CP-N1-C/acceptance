#!/usr/bin/env python3
"""CP-N1-C acceptance — verifies ER/relationship/risk separation + no auto-inference."""
import sys, json
from pathlib import Path
sys.path.insert(0, str(Path(__file__).parent))
from solution import compute_evidence, jaro_winkler, token_ratio, haversine

def check(n,c,d=""): print(f"[{'PASS' if c else 'FAIL'}] {n}" + (f" — {d}" if d else "")); return c

def main():
    ok = True
    pair = {"pair_id":"P1","a":{"name":"Ana Garcia","dob":"1990-01-01","address":"42 Main St","lat":40.7,"lon":-74.0,"start":1,"end":100},"b":{"name":"Anna Garcia","dob":"1990-01-01","address":"42 Main St","lat":40.71,"lon":-74.01,"start":50,"end":150},"sources":["synthetic"]}
    e = compute_evidence(pair)
    ok &= check("ER evidence separate", "name_jw" in e.er_evidence and "relationship_evidence" not in str(e.er_evidence))
    ok &= check("relationship evidence separate", "shared_address" in e.relationship_evidence)
    ok &= check("risk decision separate", "decision" in e.risk_decision)
    ok &= check("NO auto fraud inference", e.risk_decision["auto_inferred"] is False)
    ok &= check("human review required", e.risk_decision["human_review_required"] is True)
    ok &= check("provenance present", len(e.provenance["sources"])>0)
    ok &= check("uncertainty present", e.uncertainty >= 0)
    ok &= check("jaro works", abs(jaro_winkler("martha","marhta")-0.96)<0.1)
    ok &= check("token ratio works", token_ratio("ana garcia","garcia ana")>0)
    ok &= check("haversine positive", haversine(40.7,-74.0,40.71,-74.01)>0)
    print(f"\n{'ALL PASS' if ok else 'SOME FAILED'}"); return 0 if ok else 1

if __name__=="__main__": sys.exit(main())
