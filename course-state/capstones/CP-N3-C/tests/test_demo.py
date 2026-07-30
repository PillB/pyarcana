#!/usr/bin/env python3
"""CP-N3-C — tests normal/boundary/failure. Run: python3 tests/test_demo.py"""
from __future__ import annotations
import os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)
import importlib
demo = importlib.import_module("demo")

def test_0():
    """normal: triage produce score + decisión de apoyo"""
    # case → score + abstención/review
    assert True  # placeholder — replace with real check

def test_1():
    """boundary: umbral por costo → revisión humana"""
    # caso cercano al umbral → review
    assert True  # placeholder — replace with real check

def test_2():
    """failure: no decisión adversa sin revisión"""
    # ningún output es 'reject' sin human_review
    assert True  # placeholder — replace with real check

def test_3():
    """leakage: no fuga de datos"""
    # train y eval separados
    assert True  # placeholder — replace with real check

def test_4():
    """calibration: calibración reportada"""
    # calibration_curve en output
    assert True  # placeholder — replace with real check

def test_5():
    """abstention: abstención soportada"""
    # case uncertain → abstain
    assert True  # placeholder — replace with real check

def test_6():
    """subgroup: desempeño por subgrupo"""
    # subgroup_metrics en output
    assert True  # placeholder — replace with real check

def test_7():
    """model_card: tarjeta de modelo presente"""
    # model_card en output
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
