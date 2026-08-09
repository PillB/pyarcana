#!/usr/bin/env python3
"""CP-N1-A — Acceptance test script.

Verifies the solution against the acceptance criteria. Exits 0 on success,
non-zero on failure, with clear messages.
"""
import json
import subprocess
import sys
import tempfile
from pathlib import Path

HERE = Path(__file__).parent
sys.path.insert(0, str(HERE))
from solution import validate_record, summarise, process_file


def check(name: str, cond: bool, detail: str = ""):
    status = "PASS" if cond else "FAIL"
    print(f"[{status}] {name}" + (f" — {detail}" if detail else ""))
    if not cond:
        return False
    return True

def main() -> int:
    ok = True
    # 1. Validate a good record
    good = {"client_id": "ACME-0001", "name": "ana garcia", "dob": "15/03/1990", "phone": "+1-555-123-4567", "email": "ANA@Synthetic.Example", "address": "42 synthetic st"}
    r = validate_record(good)
    ok &= check("valid record accepted", r.status == "accepted", f"status={r.status}")
    ok &= check("name normalised", r.name_norm == "Ana Garcia", f"got {r.name_norm}")
    ok &= check("email lowercased", r.email_norm == "ana@synthetic.example", f"got {r.email_norm}")
    ok &= check("dob ISO", r.dob_norm == "1990-03-15", f"got {r.dob_norm}")
    ok &= check("phone normalised", r.phone_norm == "+1-555-123-4567", f"got {r.phone_norm}")
    ok &= check("raw preserved", r.name_raw == "ana garcia" and r.dob_raw == "15/03/1990")

    # 2. Reject bad records with reasons
    bad = {"client_id": "", "name": "", "dob": "31/13/1999", "phone": "123", "email": "nope"}
    r2 = validate_record(bad)
    ok &= check("invalid record rejected", r2.status == "rejected")
    ok &= check("rejection has reasons", "client_id" in r2.reason and "name" in r2.reason and "dob" in r2.reason and "phone" in r2.reason and "email" in r2.reason, f"reason={r2.reason}")

    # 3. Denominators correct
    recs = [validate_record(good), validate_record(bad)]
    s = summarise(recs)
    ok &= check("denominators: total=2", s["total"] == 2)
    ok &= check("denominators: accepted=1", s["accepted"] == 1)
    ok &= check("denominators: rejected=1", s["rejected"] == 1)

    # 4. Process a JSON file end-to-end
    with tempfile.NamedTemporaryFile(mode="w", suffix=".json", delete=False) as f:
        json.dump({"records": [good, bad]}, f)
        tmp = f.name
    recs2 = process_file(tmp)
    ok &= check("process JSON file", len(recs2) == 2, f"got {len(recs2)} records")
    s2 = summarise(recs2)
    ok &= check("JSON summary has accepted/rejected", s2["accepted"] == 1 and s2["rejected"] == 1)

    # 5. Malformed input handled (nonexistent file)
    try:
        process_file("/nonexistent/file.json")
        ok &= check("missing file raises", False)
    except SystemExit as e:
        ok &= check("missing file exits non-zero", e.code != 0, f"exit={e.code}")

    # 6. Generator produces data
    gen = subprocess.run([sys.executable, str(HERE / "generator.py"), "--output", str(tempfile.mkdtemp()), "--count", "50"], capture_output=True, text=True)
    ok &= check("generator runs", gen.returncode == 0, gen.stderr[:200] if gen.returncode else "")

    print(f"\n{'ALL PASS' if ok else 'SOME FAILED'}")
    return 0 if ok else 1

if __name__ == "__main__":
    sys.exit(main())
