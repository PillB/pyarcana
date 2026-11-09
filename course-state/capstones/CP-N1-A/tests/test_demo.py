#!/usr/bin/env python3
"""CP-N1-A — tests normal/boundary/failure. Run: python3 tests/test_demo.py

The module under test is `demo` by default. Set CP_N1_A_MODULE=cp_n1_a to test your own
STARTER/cp_n1_a.py after copying this package. Every check compares against a value that was
worked out by hand from the contract in BRIEF.md, never against the code's own output.
"""
from __future__ import annotations

import importlib
import os
import subprocess
import sys
from decimal import Decimal

HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)

impl = importlib.import_module(os.environ.get("CP_N1_A_MODULE", "demo"))


def row(edad=30, region="R-NORTE", monto=10, raw="raw"):
    return {"edad": edad, "region": region, "monto_ingreso": monto, "raw_line": raw}


def test_0():
    """normal: campos válidos → accept"""
    assert impl.classify(row(edad=30, region="R-SUR", monto=500)) == "accept"


def test_1():
    """boundary: monto 0 es válido → accept (not review, not reject)"""
    assert impl.classify(row(monto=Decimal("0.00"))) == "accept"
    assert impl.classify(row(monto=0)) == "accept"


def test_2():
    """failure: edad ausente → review (no reject, no crash)"""
    assert impl.classify(row(edad=None)) == "review"


def test_3():
    """failure: región fuera del catálogo → review"""
    assert impl.classify(row(region="R-FUERA")) == "review"


def test_4():
    """failure: monto negativo → reject, and one reject outranks an accepted region"""
    assert impl.classify(row(monto=-1)) == "reject"
    assert impl.classify(row(monto=-1, region="R-NORTE")) == "reject"


def test_5():
    """failure: tipo malo (edad como texto) → reject"""
    assert impl.classify(row(edad="veinte")) == "reject"


def test_run_counts_match_the_hand_count():
    """denominators: 4 rows → 1 accept, 2 review, 1 reject; tasa_reject = 1/4"""
    res = impl.run(impl.RECORDS)
    assert (res.n_total, res.n_accept, res.n_review, res.n_reject) == (4, 1, 2, 1)
    assert res.n_total == res.n_accept + res.n_review + res.n_reject
    assert res.tasa_reject == 0.25
    assert [x["estado"] for x in res.results] == ["accept", "review", "reject", "review"]


def test_empty_batch_has_no_rate():
    """an empty batch has no observations: tasa_reject is None, not 0.0 and not a crash"""
    res = impl.run([])
    assert (res.n_total, res.n_accept, res.n_review, res.n_reject) == (0, 0, 0, 0)
    assert res.tasa_reject is None


def test_run_demo_exits_zero():
    r = subprocess.run([sys.executable, os.path.join(PKG, "demo.py")], capture_output=True, text=True)
    assert r.returncode == 0, f"demo exited {r.returncode}: {r.stderr}"
    assert "METRICS_JSON:" in r.stdout


def main():
    tests = [v for k, v in sorted(globals().items()) if k.startswith("test_")]
    p = f = 0
    for t in tests:
        try:
            t()
            print(f"  PASS  {t.__name__}")
            p += 1
        except Exception as e:
            print(f"  FAIL  {t.__name__}: {e}")
            f += 1
    print(f"\n{p} passed, {f} failed, {len(tests)} total")
    return 1 if f else 0


if __name__ == "__main__":
    sys.exit(main())
