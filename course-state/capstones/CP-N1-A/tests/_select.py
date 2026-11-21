"""No edites este archivo. Elige qué cp_n1_a.py prueban los tests.

Por defecto, el tuyo (cp_n1_a.py, en la raíz del paquete). Quien mantiene el curso prueba la
referencia con:  CAPSTONE_TARGET=reference python3 tests/test_demo.py
"""
import os
import sys

PKG = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = os.environ.get("CAPSTONE_TARGET", "learner")
if TARGET not in ("learner", "reference"):
    sys.exit("CAPSTONE_TARGET debe ser learner o reference, no " + repr(TARGET))
sys.path.insert(0, os.path.join(PKG, "reference") if TARGET == "reference" else PKG)
sys.path.insert(1, os.path.join(PKG, "data"))

import cp_n1_a as impl  # noqa: E402
import generate  # noqa: E402

LOCATION = impl.__file__
