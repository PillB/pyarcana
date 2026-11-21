"""No edites este archivo. Elige qué cp_n1_b.py prueban los tests y da dos ayudas.

Por defecto, el tuyo (STARTER/cp_n1_b.py). Quien mantiene el curso prueba la
referencia con:  CAPSTONE_TARGET=reference python3 tests/test_demo.py
"""
import atexit
import os
import shutil
import sys
import tempfile
from pathlib import Path

PKG = Path(__file__).resolve().parent.parent
DATA = PKG / "data"
TARGET = os.environ.get("CAPSTONE_TARGET", "learner")
if TARGET not in ("learner", "reference"):
    sys.exit("CAPSTONE_TARGET debe ser learner o reference, no " + repr(TARGET))
sys.path.insert(0, str(PKG / ("reference" if TARGET == "reference" else "STARTER")))
sys.path.insert(1, str(DATA))

import cp_n1_b as impl  # noqa: E402
import generate  # noqa: E402

LOCATION = impl.__file__


_CREADAS = []
atexit.register(lambda: [shutil.rmtree(d, ignore_errors=True) for d in _CREADAS])


def carpeta_temporal() -> Path:
    """Una carpeta nueva y vacía para cada prueba, fuera del paquete; se borra al terminar (S08 T1)."""
    d = Path(tempfile.mkdtemp(prefix="cp_n1_b_test_"))
    _CREADAS.append(d)
    return d


def error_de(funcion, *args, **kwargs):
    """El tipo de error que lanza funcion(*args), o None si termina sin error.

    S09 enseña a capturar errores con try/except; aquí solo hace falta saber si hubo uno.
    """
    try:
        funcion(*args, **kwargs)
    except NotImplementedError:
        raise
    except Exception as e:  # noqa: BLE001
        return type(e).__name__
    return None
