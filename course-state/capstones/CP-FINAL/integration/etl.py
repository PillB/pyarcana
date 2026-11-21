"""CP-N1-B subsystem — cp_n1_b.run(data_dir, out_dir, run_id=None) -> int, as an EtlManifest.

Calls the interface CP-N1-B publishes (see upstream.py). The platform hands this subsystem a
batch of rows already in the CP-N1-B contract (clients id,nombre,monto; transactions
id,client_id,monto, montos as decimal text). This module lands them as clients.csv and
transactions.json in a temporary folder, runs CP-N1-B twice with the batch id as run_id, and
reports the manifest and the clean and quarantine rows. Nothing is written into the repository.

Honors the CP-N1-B criticalFailures:
- No secrets (synthetic data only).
- Idempotent: the two runs must give the same clean, quarantine and sources.
- Quarantine present: irregular rows come back with their reason.
- Provenance: each quarantine row keeps raw and record_number; each source keeps its sha256.

Does NOT import any other subsystem module.
"""
from __future__ import annotations

import csv
import json
import tempfile
from pathlib import Path
from typing import Any, Dict, List

from . import contracts, upstream

SOURCES = ("clients.csv", "transactions.json")


def _land(batch: Dict[str, Any], data_dir: Path) -> None:
    with open(data_dir / "clients.csv", "w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=["id", "nombre", "monto"], lineterminator="\n")
        writer.writeheader()
        writer.writerows(batch.get("clients", []))
    (data_dir / "transactions.json").write_text(
        json.dumps(batch.get("transactions", []), ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def _read_outputs(out_dir: Path) -> Dict[str, Any]:
    manifest = json.loads((out_dir / "manifest.json").read_text(encoding="utf-8"))
    with open(out_dir / "clean" / "clients.csv", encoding="utf-8", newline="") as fh:
        clients = list(csv.DictReader(fh))
    clean = {"clients.csv": clients,
             "transactions.json": json.loads((out_dir / "clean" / "transactions.json").read_text(encoding="utf-8"))}
    quarantine = {}
    for name in SOURCES:
        stem = name.split(".")[0]
        lines = (out_dir / "quarantine" / f"{stem}.jsonl").read_text(encoding="utf-8").splitlines()
        quarantine[name] = [json.loads(line) for line in lines if line.strip()]
    return {"manifest": manifest, "clean": clean, "quarantine": quarantine}


def _one_run(batch: Dict[str, Any], run_id: str):
    with tempfile.TemporaryDirectory(prefix="cp_final_etl_") as tmp:
        data_dir, out_dir = Path(tmp) / "data", Path(tmp) / "out"
        data_dir.mkdir()
        _land(batch, data_dir)
        code = upstream.load("CP-N1-B").run(data_dir, out_dir, run_id=run_id)
        return code, (_read_outputs(out_dir) if code == 0 else None)


def run(batch: Dict[str, Any]) -> contracts.EtlManifest:
    """Run CP-N1-B on the batch twice and return its manifest and outputs as a contract object."""
    run_id = str(batch.get("batch_id", "syn-batch-001"))
    code, first = _one_run(batch, run_id)
    if first is None:
        return contracts.EtlManifest(exit_code=code, run_id=run_id)
    _, second = _one_run(batch, run_id)
    same = (second is not None
            and (first["clean"], first["quarantine"], first["manifest"]["sources"])
            == (second["clean"], second["quarantine"], second["manifest"]["sources"]))
    m = first["manifest"]
    return contracts.EtlManifest(
        exit_code=code,
        run_id=m["run_id"],
        sources=m["sources"],
        n_in=m["n_in"],
        n_clean=m["n_clean"],
        n_quarantine=m["n_quarantine"],
        reconcile_ok=m["reconcile_ok"],
        clean=first["clean"],
        quarantine=first["quarantine"],
        idempotent=same,
    )
