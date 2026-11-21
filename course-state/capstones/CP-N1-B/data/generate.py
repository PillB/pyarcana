#!/usr/bin/env python3
"""CP-N1-B: escribe las dos fuentes sintéticas, data/clients.csv y data/transactions.json.

Los datos son fijos (no hay azar): cada ejecución escribe los mismos bytes, y
tests/test_demo.py comprueba que los archivos de data/ son exactamente estos. Cada fila irregular
muestra una regla de BRIEF.md. Ningún dato es de una persona real.

Ejecuta:  python3 data/generate.py
"""
import json
from pathlib import Path

HERE = Path(__file__).resolve().parent

# Excel guarda "CSV UTF-8" con BOM al inicio; el lector lo quita con utf-8-sig.
CLIENTS_CSV = (
    "﻿id,nombre,monto\n"
    "C001,Ana Demo,10.50\n"
    "C002,\"Quispe, Rosa\",20\n"     # la coma va dentro de comillas: sigue siendo una columna
    "C003,Luis Sintetico,0\n"
    "C004,Carla Demo,10,50\n"        # coma decimal: 4 columnas → col_count
    "C005,Bruno Demo\n"              # falta una columna → col_count
    "\n"                             # línea vacía: se ignora y se cuenta aparte
    "C006,Marta Demo,abc\n"          # monto que no es número → cast_monto
    "C007,,15.00\n"                  # nombre vacío → missing_key
    "C008,Jose Demo,7.5\n"
)

TRANSACTIONS = [
    {"id": "T001", "client_id": "C001", "monto": "5.00"},
    {"id": "T002", "client_id": "C002", "monto": "12.345"},  # se redondea a 12.34 (ROUND_HALF_EVEN)
    {"id": "T003", "client_id": "C003", "monto": "0"},
    {"id": "T004", "client_id": "C001", "monto": 12.5},      # número JSON, no texto → cast_monto
    {"id": "T005", "monto": "3.00"},                         # falta client_id → missing_key
    {"id": "T006", "client_id": "C008", "monto": None},      # null → missing_key
    "T007",                                                  # no es un objeto → schema
    {"id": "T008", "client_id": "C008", "monto": "1,5"},     # coma decimal → cast_monto
]


def write(data_dir: Path = HERE) -> None:
    (data_dir / "clients.csv").write_text(CLIENTS_CSV, encoding="utf-8", newline="")
    (data_dir / "transactions.json").write_text(
        json.dumps(TRANSACTIONS, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    write()
    print("escrito data/clients.csv y data/transactions.json")
