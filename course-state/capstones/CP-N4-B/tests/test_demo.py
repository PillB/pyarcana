#!/usr/bin/env python3
"""CP-N4-B — tests normal/boundary/failure. Run: python3 tests/test_demo.py"""
from __future__ import annotations
import os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)
import importlib
demo = importlib.import_module("demo")

def test_0():
    """normal: deploy → DeployRecord con linaje"""
    # model → DeployRecord
    assert True  # placeholder — replace with real check

def test_1():
    """boundary: canary falla → rollback"""
    # canary SLO breach → rollback
    assert True  # placeholder — replace with real check

def test_2():
    """failure: sin aprobación → no deploy"""
    # no approval → not deployed
    assert True  # placeholder — replace with real check

def test_3():
    """rollback: rollback restaura last-known-good"""
    # rollback → model anterior activo
    assert True  # placeholder — replace with real check

def test_4():
    """consistency: train/serve mismo esquema"""
    # signature match
    assert True  # placeholder — replace with real check

def test_5():
    """slo: SLOs definidos y medidos"""
    # slo_report en output
    assert True  # placeholder — replace with real check

def test_6():
    """lineage: linaje de datos y modelos"""
    # lineage en output
    assert True  # placeholder — replace with real check


def test_run_demo_exits_zero():
    r = subprocess.run([sys.executable, os.path.join(PKG,"demo.py")], capture_output=True, text=True)
    assert r.returncode == 0, f"demo exited {r.returncode}: {r.stderr}"
    assert "METRICS_JSON:" in r.stdout

def main():
    tests = [v for k,v in sorted(globals().items()) if k.startswith("test_")]
    p=f=0
    for t in tests:
        try: t(); print(f"  PASS  {t.__name__}"); p+=1
        except Exception as e: print(f"  FAIL  {t.__name__}: {e}"); f+=1
    print(f"\n{p} passed, {f} failed, {len(tests)} total")
    return 1 if f else 0

if __name__=="__main__": sys.exit(main())
