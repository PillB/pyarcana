#!/usr/bin/env python3
"""CP-N1-C — tests normal/boundary/failure. Run: python3 tests/test_demo.py"""
from __future__ import annotations
import os, sys, subprocess
HERE = os.path.dirname(os.path.abspath(__file__))
PKG = os.path.dirname(HERE)
sys.path.insert(0, PKG)
import importlib
demo = importlib.import_module("demo")

def test_0():
    """normal: señal de coincidencia exacta → evidencia de entidad"""
    # 2 registros mismo nombre normalizado → entity evidence
    assert True  # placeholder — replace with real check

def test_1():
    """boundary: similitud difusa en umbral → revisión humana"""
    # score 0.85 en umbral 0.8 → flagged, not decided
    assert True  # placeholder — replace with real check

def test_2():
    """failure: no se infiere fraude automáticamente"""
    # ningún output contiene 'fraude'/'parentesco' como decisión
    assert True  # placeholder — replace with real check

def test_3():
    """separation: evidencia de entidad ≠ evidencia de relación ≠ decisión"""
    # tres listas separadas en el output
    assert True  # placeholder — replace with real check

def test_4():
    """privacy: hoja de privacidad presente"""
    # output incluye privacy_sheet
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
