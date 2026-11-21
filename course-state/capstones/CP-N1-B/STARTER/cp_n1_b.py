"""CP-N1-B: ETL local de clientes y transacciones. TU ARCHIVO.

Es el You Do de S08 (etl_cp_n1_b.py) con las mismas piezas. Las firmas, las constantes y dos
funciones de formato ya están puestas: no cambies sus nombres, porque las pruebas y CP-FINAL los
usan.

1. Lee BRIEF.md: tiene cada regla con su ejemplo y el subtema de S08 donde la viste.
2. Desde la carpeta del paquete (CP-N1-B), corre las pruebas: python3 tests/test_demo.py
   Al principio fallan todas, y cada fallo dice qué función escribir.
3. Escribe una función, vuelve a correr las pruebas, y sigue con la siguiente. El orden de las
   reglas en BRIEF.md es un buen orden de trabajo.
"""
from __future__ import annotations

import csv
import hashlib
import io
import json
import os
import shutil
import tempfile
import uuid
from decimal import Decimal
from pathlib import Path

CAPSTONE_ID = "CP-N1-B"
CLIENT_COLUMNS = ("id", "nombre", "monto")
TRANSACTION_KEYS = ("id", "client_id", "monto")
CENTIMOS = Decimal("0.01")


def sha256_file(path: Path) -> str:
    """Hash sha256 de los bytes crudos del archivo, en hexadecimal (BRIEF.md, regla 1; S08 T4-A)."""
    raise NotImplementedError("Escribe sha256_file(): BRIEF.md, regla 1")


def write_atomic(path: Path, text: str) -> None:
    """Escribe text en path con un temporal único y os.replace (BRIEF.md, regla 2; S08 T1-B)."""
    raise NotImplementedError("Escribe write_atomic(): BRIEF.md, regla 2")


def monto_texto(value) -> str | None:
    """El monto como texto con dos decimales, o None si no es válido (BRIEF.md, regla 3; S08 T2-A).

    Ejemplos: "10.5" → "10.50"; "0" → "0.00"; "12.345" → "12.34"; "10,50" → None; "abc" → None;
    "" → None; 12.5 (un número, no texto) → None.
    """
    raise NotImplementedError("Escribe monto_texto(): BRIEF.md, regla 3")


def load_clients_csv(path: Path) -> tuple[list[dict], list[dict], dict]:
    """Lee clients.csv → (clean, quarantine, stats) (BRIEF.md, regla 4; S08 T2-B).

    stats = {"n_in", "n_clean", "n_quarantine", "n_blank_ignored"}. Cada fila de cuarentena es
    {"raw", "record_number", "reason"}, más "parsed_row" cuando la fila tiene sus 3 columnas.
    """
    raise NotImplementedError("Escribe load_clients_csv(): BRIEF.md, regla 4")


def validate_schema(obj, required) -> tuple[bool, list]:
    """(True, []) si obj es un dict con todas las claves y ninguna vale None; si no, (False, faltan).

    BRIEF.md, regla 5; S08 T3-B. Ejemplo: {"id": "T1", "monto": None} con ("id", "monto") →
    (False, ["monto"]).
    """
    raise NotImplementedError("Escribe validate_schema(): BRIEF.md, regla 5")


def load_transactions_json(path: Path) -> tuple[list[dict], list[dict], dict]:
    """Lee transactions.json → (clean, quarantine, stats) (BRIEF.md, regla 5; S08 T3)."""
    raise NotImplementedError("Escribe load_transactions_json(): BRIEF.md, regla 5")


def fuentes_rotas(sources: list[dict]) -> list[str]:
    """Nombres de las fuentes donde n_in != n_clean + n_quarantine (BRIEF.md, regla 6; S08 T4-B)."""
    raise NotImplementedError("Escribe fuentes_rotas(): BRIEF.md, regla 6")


def build_manifest(*, run_id: str, sources: list[dict]) -> dict:
    """Manifest con totales derivados; ValueError si una fuente no cuadra (BRIEF.md, regla 6)."""
    raise NotImplementedError("Escribe build_manifest(): BRIEF.md, regla 6")


def csv_text(rows: list[dict], columns) -> str:
    """Ya escrita: las filas como texto CSV con encabezado y saltos de línea LF."""
    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=list(columns), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return out.getvalue()


def jsonl_text(rows: list[dict]) -> str:
    """Ya escrita: una línea JSON por fila (JSONL), con claves ordenadas."""
    return "".join(json.dumps(r, ensure_ascii=False, sort_keys=True) + "\n" for r in rows)


def run(data_dir: Path, out_dir: Path, run_id: str | None = None) -> int:
    """Ejecuta el ETL; 0 si publicó todo, 1 sin publicar nada (BRIEF.md, regla 7 e 'Interfaz')."""
    raise NotImplementedError("Escribe run(): BRIEF.md, regla 7")
