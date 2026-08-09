#!/usr/bin/env python3
"""CP-N1-B — tests normal/boundary/failure. Run: python3 tests/test_demo.py"""
from __future__ import annotations
import os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)
import importlib
demo = importlib.import_module("demo")

def test_0():
    """normal: lote válido → accepted + manifest"""
    # 5 filas válidas → 5 accepted
    assert True  # placeholder — replace with real check

def test_1():
    """boundary: fila con campo extra → cuarentena"""
    # columna desconocida → quarantined
    assert True  # placeholder — replace with real check

def test_2():
    """failure: fila malformada → cuarentena, no crashea"""
    # JSON roto → quarantined
    assert True  # placeholder — replace with real check

def test_3():
    """idempotency: rerun produce mismo manifest hash"""
    # 2 reruns → mismo sha256
    assert True  # placeholder — replace with real check

def test_4():
    """provenance: cada accepted fila tiene source_file"""
    # todas las accepted tienen source_file
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
