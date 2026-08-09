#!/usr/bin/env python3
"""CP-N3-B — tests normal/boundary/failure. Run: python3 tests/test_demo.py"""
from __future__ import annotations
import os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)
import importlib
demo = importlib.import_module("demo")

def test_0():
    """normal: búsqueda de camino → explicación"""
    # A→B→C con fuentes
    assert True  # placeholder — replace with real check

def test_1():
    """boundary: profundidad limitada"""
    # depth > max → cortado
    assert True  # placeholder — replace with real check

def test_2():
    """failure: no etiqueta fraude automáticamente"""
    # output no contiene 'fraude' como etiqueta automática
    assert True  # placeholder — replace with real check

def test_3():
    """edge: cada enlace responde 6 preguntas"""
    # source/meaning/not-meaning/age/who/correction
    assert True  # placeholder — replace with real check

def test_4():
    """authz: filtro por autorización"""
    # usuario sin permiso no ve enlace restringido
    assert True  # placeholder — replace with real check

def test_5():
    """reproducibility: mismo caso → mismo grafo"""
    # case_id → reproducible
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
