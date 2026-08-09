"""CP-N1-B — Reproducible ETL pipeline (reference solution).

Ingests CSV and JSON, validates against explicit versioned contracts, separates
accepted from quarantined rows, produces deterministic outputs with a
content-hash manifest, and supports safe reruns (idempotent).
"""
from __future__ import annotations

import argparse
import csv
import hashlib
import io
import json
import os
import re
import sys
import tempfile
import tokenize
from datetime import datetime, timezone
from typing import Any, Iterable

CONTRACT_VERSION = "v1"
ALLOWED_CURRENCIES = {"USD", "EUR", "GBP", "JPY", "CAD"}
ALLOWED_CATEGORIES = {"groceries", "utilities", "dining", "travel", "retail", "health", "transport"}
AMOUNT_RE = re.compile(r"^-?\d+(\.\d{1,4})?$")
TS_RE = re.compile(r"^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$")


def detect_encoding(path: str) -> str:
    with open(path, "rb") as f:
        enc, _ = tokenize.detect_encoding(f.readline)
    return enc or "utf-8"


def read_file(path: str) -> list[dict]:
    enc = detect_encoding(path)
    with open(path, "r", encoding=enc, errors="replace") as f:
        raw = f.read()
    raw = raw.strip()
    if not raw:
        return []
    if path.lower().endswith(".csv"):
        return list(csv.DictReader(io.StringIO(raw)))
    try:
        data = json.loads(raw)
        return data if isinstance(data, list) else [data]
    except json.JSONDecodeError:
        return list(csv.DictReader(io.StringIO(raw)))


def sha256_file(path: str) -> str:
    h = hashlib.sha256()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()


def validate_txn(rec: dict) -> tuple[bool, str]:
    if not rec.get("txn_id"):
        return False, "missing txn_id"
    if not rec.get("client_id"):
        return False, "missing client_id"
    if not AMOUNT_RE.match(str(rec.get("amount", ""))):
        return False, f"amount not numeric: {rec.get('amount')!r}"
    if rec.get("currency") not in ALLOWED_CURRENCIES:
        return False, f"currency not in allowlist: {rec.get('currency')!r}"
    if not TS_RE.match(str(rec.get("timestamp", ""))):
        return False, f"timestamp not ISO-8601 Z: {rec.get('timestamp')!r}"
    if rec.get("merchant_category") not in ALLOWED_CATEGORIES:
        return False, f"merchant_category not allowed: {rec.get('merchant_category')!r}"
    return True, ""


def validate_client(rec: dict) -> tuple[bool, str]:
    if not rec.get("client_id"):
        return False, "missing client_id"
    if not rec.get("name"):
        return False, "missing name"
    if not rec.get("dob"):
        return False, "missing dob"
    if not rec.get("region"):
        return False, "missing region"
    return True, ""


def transform(rec: dict, source: str, kind: str, line_no: int) -> dict:
    out = dict(rec)
    if kind == "txn" and AMOUNT_RE.match(str(rec.get("amount", ""))):
        out["amount"] = float(rec["amount"])
    out["_provenance"] = {"source": source, "line": line_no, "kind": kind, "contract": CONTRACT_VERSION}
    return out


def run(sources: list[str], outdir: str) -> dict:
    os.makedirs(outdir, exist_ok=True)
    accepted: list[dict] = []
    quarantined: list[dict] = []
    input_hashes: list[dict] = []
    for src in sources:
        try:
            rows = read_file(src)
        except OSError as e:
            quarantined.append({"_source": src, "_reason": f"unreadable: {e}", "_row": {}})
            continue
        input_hashes.append({"source": src, "sha256": sha256_file(src), "rows": len(rows)})
        kind = "client" if src.lower().endswith("clients.csv") else "txn"
        validator = validate_client if kind == "client" else validate_txn
        for i, r in enumerate(rows, 1):
            ok, reason = validator(r)
            if ok:
                accepted.append(transform(r, src, kind, i))
            else:
                quarantined.append({"_source": src, "_line": i, "_reason": reason, "_row": r})

    # Deterministic manifest (no wall-clock timestamps; use a stable digest).
    accepted_blob = json.dumps(accepted, sort_keys=True, ensure_ascii=False).encode("utf-8")
    quarantined_blob = json.dumps(quarantined, sort_keys=True, ensure_ascii=False).encode("utf-8")
    accepted_hash = hashlib.sha256(accepted_blob).hexdigest()
    quarantined_hash = hashlib.sha256(quarantined_blob).hexdigest()
    manifest = {
        "contract_version": CONTRACT_VERSION,
        "input_hashes": input_hashes,
        "accepted_count": len(accepted),
        "quarantined_count": len(quarantined),
        "accepted_sha256": accepted_hash,
        "quarantined_sha256": quarantined_hash,
        "lineage": {
            "accepted_path": "accepted.jsonl",
            "quarantined_path": "quarantined.jsonl",
        },
        # Stable timestamp: derive from the accepted hash so reruns match.
        "generated_at_digest": hashlib.sha256(accepted_hash.encode()).hexdigest()[:16],
    }

    # Atomic write: temp file → rename. Safe reruns overwrite deterministically.
    def _atomic_write(path: str, data: str) -> None:
        fd, tmp = tempfile.mkstemp(dir=outdir, prefix=".tmp-")
        try:
            with os.fdopen(fd, "w", encoding="utf-8") as f:
                f.write(data)
            os.replace(tmp, path)
        finally:
            if os.path.exists(tmp):
                os.unlink(tmp)

    accepted_path = os.path.join(outdir, "accepted.jsonl")
    quarantined_path = os.path.join(outdir, "quarantined.jsonl")
    manifest_path = os.path.join(outdir, "manifest.json")
    _atomic_write(accepted_path, "\n".join(json.dumps(r, ensure_ascii=False, sort_keys=True) for r in accepted) + ("\n" if accepted else ""))
    _atomic_write(quarantined_path, "\n".join(json.dumps(r, ensure_ascii=False, sort_keys=True) for r in quarantined) + ("\n" if quarantined else ""))
    _atomic_write(manifest_path, json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n")
    return manifest


def main(argv: list[str] | None = None) -> int:
    ap = argparse.ArgumentParser(description="CP-N1-B ETL pipeline")
    ap.add_argument("--sources", nargs="+", required=True, help="CSV or JSON source files")
    ap.add_argument("--outdir", required=True, help="output directory")
    args = ap.parse_args(argv)
    manifest = run(args.sources, args.outdir)
    print(json.dumps(manifest, indent=2, sort_keys=True))
    return 0


if __name__ == "__main__":
    sys.exit(main())
