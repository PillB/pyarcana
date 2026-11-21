"""CP-N1-B: ETL local de clientes y transacciones. SOLUCIÓN DE REFERENCIA.

Este archivo es la respuesta. Escribe la tuya en ../STARTER/cp_n1_b.py y léelo solo para comparar
cuando tus pruebas pasen.

El contrato está en BRIEF.md. Es el You Do de S08 (etl_cp_n1_b.py) con las piezas de cada
subtema: escritura atómica (T1-B), CSV con cuarentena (T2), JSON con schema (T3), hash del crudo
y manifest reconciliado por fuente (T4).
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
    """Hash sha256 de los bytes crudos del archivo, en hexadecimal (T4-A)."""
    return hashlib.sha256(Path(path).read_bytes()).hexdigest()


def write_atomic(path: Path, text: str) -> None:
    """Escribe text en path sin dejarlo a medias: temporal único junto al destino y os.replace (T1-B)."""
    path = Path(path)
    fd, tmp_name = tempfile.mkstemp(dir=path.parent, prefix=path.name + ".", suffix=".tmp")
    os.close(fd)
    tmp = Path(tmp_name)
    tmp.write_text(text, encoding="utf-8", newline="\n")
    os.replace(tmp, path)


def monto_texto(value) -> str | None:
    """El monto como texto con dos decimales ("10.50"), o None si no es un decimal ASCII válido.

    Solo acepta texto: dígitos y como máximo un punto. "10,50", "abc", "" y un número JSON (12.5)
    devuelven None, y la fila va a cuarentena con cast_monto (T2-A).
    """
    if not isinstance(value, str):
        return None
    digits = value.replace(".", "", 1)
    if not value.isascii() or value.count(".") > 1 or not digits.isdecimal():
        return None
    return str(Decimal(value).quantize(CENTIMOS))


def load_clients_csv(path: Path) -> tuple[list[dict], list[dict], dict]:
    """Lee clients.csv → (clean, quarantine, stats). Columnas id,nombre,monto; utf-8-sig (T2).

    Cada fila de cuarentena es {raw, record_number, reason}, con parsed_row cuando la fila se
    pudo interpretar. reason: col_count (columnas de más o de menos), missing_key (id o nombre
    vacío) o cast_monto (el monto no es un decimal válido, incluido el vacío).
    """
    text = Path(path).read_text(encoding="utf-8-sig")
    stream = io.StringIO(text, newline="")
    reader = csv.reader(stream)
    header = next(reader)
    if list(header) != list(CLIENT_COLUMNS):
        raise ValueError(f"schema: encabezado {header}, se esperaba {list(CLIENT_COLUMNS)}")
    clean, quarantine = [], []
    record_number = 0
    n_blank_ignored = 0
    start = stream.tell()
    for row in reader:
        raw = text[start:stream.tell()]
        start = stream.tell()
        if not row and not raw.strip():
            n_blank_ignored += len(raw.splitlines())
            continue
        record_number += 1
        if len(row) != len(header):
            quarantine.append({"raw": raw, "record_number": record_number, "reason": "col_count"})
            continue
        parsed = dict(zip(header, row))
        monto = monto_texto(parsed["monto"])
        if parsed["id"].strip() == "" or parsed["nombre"].strip() == "":
            reason = "missing_key"
        elif monto is None:
            reason = "cast_monto"
        else:
            parsed["monto"] = monto
            clean.append(parsed)
            continue
        quarantine.append({"raw": raw, "record_number": record_number, "reason": reason,
                           "parsed_row": parsed})
    stats = {"n_in": record_number, "n_clean": len(clean), "n_quarantine": len(quarantine),
             "n_blank_ignored": n_blank_ignored}
    return clean, quarantine, stats


def validate_schema(obj, required) -> tuple[bool, list]:
    """(True, []) si obj es un dict con todas las claves; si no, (False, claves que faltan) (T3-B)."""
    if not isinstance(obj, dict):
        return False, list(required)
    missing = [k for k in required if k not in obj or obj[k] is None]
    return len(missing) == 0, missing


def load_transactions_json(path: Path) -> tuple[list[dict], list[dict], dict]:
    """Lee transactions.json (una lista de objetos) → (clean, quarantine, stats) (T3).

    reason: schema (el elemento no es un objeto), missing_key (falta id, client_id o monto, o
    vale null) o cast_monto. raw es el elemento como JSON con claves ordenadas.
    """
    items = json.loads(Path(path).read_text(encoding="utf-8"))
    if not isinstance(items, list):
        raise ValueError("schema: transactions.json debe ser una lista de objetos")
    clean, quarantine = [], []
    for record_number, obj in enumerate(items, start=1):
        raw = json.dumps(obj, ensure_ascii=False, sort_keys=True)
        if not isinstance(obj, dict):
            quarantine.append({"raw": raw, "record_number": record_number, "reason": "schema"})
            continue
        ok, missing = validate_schema(obj, TRANSACTION_KEYS)
        if not ok:
            quarantine.append({"raw": raw, "record_number": record_number, "reason": "missing_key",
                               "parsed_row": dict(obj)})
            continue
        monto = monto_texto(obj["monto"])
        if monto is None:
            quarantine.append({"raw": raw, "record_number": record_number, "reason": "cast_monto",
                               "parsed_row": dict(obj)})
            continue
        row = {k: obj[k] for k in TRANSACTION_KEYS}
        row["monto"] = monto
        clean.append(row)
    stats = {"n_in": len(items), "n_clean": len(clean), "n_quarantine": len(quarantine),
             "n_blank_ignored": 0}
    return clean, quarantine, stats


def fuentes_rotas(sources: list[dict]) -> list[str]:
    """Nombres de las fuentes donde n_in != n_clean + n_quarantine (T4-B)."""
    return [s["name"] for s in sources if s["n_in"] != s["n_clean"] + s["n_quarantine"]]


def build_manifest(*, run_id: str, sources: list[dict]) -> dict:
    """Manifest con totales derivados de las fuentes. Lanza ValueError si alguna no cuadra (T4-B)."""
    names = [s["name"] for s in sources]
    if len(names) != len(set(names)):
        raise ValueError("nombre de fuente duplicado")
    rotas = fuentes_rotas(sources)
    if rotas:
        raise ValueError(f"reconcile fallo en {rotas}")
    ordered = sorted((dict(s) for s in sources), key=lambda s: s["name"])
    for s in ordered:
        s["reconcile_ok"] = True
    return {
        "run_id": run_id,
        "sources": ordered,
        "n_in": sum(s["n_in"] for s in ordered),
        "n_clean": sum(s["n_clean"] for s in ordered),
        "n_quarantine": sum(s["n_quarantine"] for s in ordered),
        "reconcile_ok": True,
    }


def csv_text(rows: list[dict], columns) -> str:
    out = io.StringIO()
    writer = csv.DictWriter(out, fieldnames=list(columns), lineterminator="\n")
    writer.writeheader()
    writer.writerows(rows)
    return out.getvalue()


def jsonl_text(rows: list[dict]) -> str:
    return "".join(json.dumps(r, ensure_ascii=False, sort_keys=True) + "\n" for r in rows)


def run(data_dir: Path, out_dir: Path, run_id: str | None = None) -> int:
    """Ejecuta el ETL. Devuelve 0 si publicó todo; 1 sin publicar nada si una fuente no cuadra.

    run_id identifica esta corrida: si no se pasa, se crea uno nuevo con uuid4. Nombra la carpeta
    de respaldos y aparece en el manifest. Solo admite letras y dígitos ASCII, "-" y "_": "../x"
    o "/tmp/x" sacarían backups/{run_id} fuera de out_dir. El manifest se escribe al final.
    """
    data_dir, out_dir = Path(data_dir), Path(out_dir)
    run_id = run_id or uuid.uuid4().hex
    if not all(c.isascii() and (c.isalnum() or c in "-_") for c in run_id):
        raise ValueError(f"run_id {run_id!r}: solo letras y dígitos ASCII, - y _")
    inputs = {"clients.csv": load_clients_csv, "transactions.json": load_transactions_json}
    results, sources = {}, []
    for name, loader in inputs.items():
        path = data_dir / name
        clean, quarantine, stats = loader(path)
        results[name] = (clean, quarantine)
        sources.append({"name": name, "sha256": sha256_file(path), **stats})
    if fuentes_rotas(sources):
        print("ERROR sources=" + ",".join(fuentes_rotas(sources)))
        return 1
    manifest = build_manifest(run_id=run_id, sources=sources)
    backups = out_dir / "backups" / run_id
    for sub in (out_dir / "clean", out_dir / "quarantine", backups):
        sub.mkdir(parents=True, exist_ok=True)
    for name in inputs:
        shutil.copy2(data_dir / name, backups / name)
    clients_clean, clients_q = results["clients.csv"]
    tx_clean, tx_q = results["transactions.json"]
    write_atomic(out_dir / "clean" / "clients.csv", csv_text(clients_clean, CLIENT_COLUMNS))
    write_atomic(out_dir / "clean" / "transactions.json",
                 json.dumps(tx_clean, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    write_atomic(out_dir / "quarantine" / "clients.jsonl", jsonl_text(clients_q))
    write_atomic(out_dir / "quarantine" / "transactions.jsonl", jsonl_text(tx_q))
    write_atomic(out_dir / "manifest.json",
                 json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    return 0
