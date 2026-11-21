#!/usr/bin/env python3
"""CP-N1-A: lote sintético de prueba, con el estado que BRIEF.md decide para cada registro.

Los registros son fijos (no hay azar), así que la salida es la misma en cada ejecución. Cada uno
cae justo a un lado de un límite de BRIEF.md. tests/test_demo.py comprueba que tu classify()
decide el estado que figura en "status". Ningún dato es real.
"""
import json
from decimal import Decimal

CAPSTONE_ID = "CP-N1-A"


def generate():
    records = [
        {"edad": 30, "region": "R-NORTE", "monto_ingreso": 100, "raw_line": "30|R-NORTE|100", "status": "accept"},
        {"edad": 30, "region": "R-SUR", "monto_ingreso": 0, "raw_line": "30|R-SUR|0", "status": "accept"},
        {"edad": 18, "region": "R-COSTA", "monto_ingreso": 50000, "raw_line": "18|R-COSTA|50000", "status": "accept"},
        {"edad": 120, "region": "R-CENTRO", "monto_ingreso": Decimal("0.00"), "raw_line": "120|R-CENTRO|0.00", "status": "accept"},
        {"edad": None, "region": "R-SUR", "monto_ingreso": 50, "raw_line": "|R-SUR|50", "status": "review"},
        {"edad": 17, "region": "R-NORTE", "monto_ingreso": 10, "raw_line": "17|R-NORTE|10", "status": "review"},
        {"edad": 30, "region": "R-FUERA", "monto_ingreso": 10, "raw_line": "30|R-FUERA|10", "status": "review"},
        {"edad": 30, "region": "R-SUR", "monto_ingreso": 50001, "raw_line": "30|R-SUR|50001", "status": "review"},
        {"edad": 30, "region": "R-SUR", "monto_ingreso": -3, "raw_line": "30|R-SUR|-3", "status": "reject"},
        {"edad": 121, "region": "R-SUR", "monto_ingreso": 10, "raw_line": "121|R-SUR|10", "status": "reject"},
        {"edad": "treinta", "region": "R-SUR", "monto_ingreso": 10, "raw_line": "treinta|R-SUR|10", "status": "reject"},
        {"edad": 30, "region": "R-SUR", "monto_ingreso": 10.5, "raw_line": "30|R-SUR|10.5", "status": "reject"},
    ]
    return {"capstone": CAPSTONE_ID, "records": records}


if __name__ == "__main__":
    print(json.dumps(generate(), ensure_ascii=False, indent=2, default=str))
