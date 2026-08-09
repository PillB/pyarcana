#!/usr/bin/env python3
"""CP-FINAL — generador del escenario sintético compartido (shared_scenario_v1).

Determinista, sin PII. Produce clientes, transacciones, entidades y casos
sintéticos que todos los subsistemas consumen a través de sus contratos.

Salida: JSON con el escenario serializado.
"""
from __future__ import annotations

import json
import sys
from pathlib import Path

CAPSTONE_ID = "CP-FINAL"
SEED = 4252

_HERE = Path(__file__).resolve().parent
_PKG = _HERE.parent
if str(_PKG) not in sys.path:
    sys.path.insert(0, str(_PKG))

from integration import shared_scenario  # noqa: E402


def generate(seed: int = SEED):
    sc = shared_scenario.build_scenario(seed)
    return sc.to_dict()


if __name__ == "__main__":
    print(json.dumps(generate(), ensure_ascii=False, indent=2))
