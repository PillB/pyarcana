"""CP-N1-B tests — normal / boundary / failure / idempotency / recovery."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import run, validate_txn, validate_client  # noqa: E402


def _write(p, content):
    p.write_text(content, encoding="utf-8")
    return str(p)


def test_normal_path_accepts_and_quarantines(tmp_path):
    clients = _write(tmp_path / "clients.csv", "client_id,name,dob,region\nC1,Ana,2000-01-01,NA\n")
    txns = _write(tmp_path / "txns.json", json.dumps([
        {"txn_id": "T1", "client_id": "C1", "amount": 10.0, "currency": "USD",
         "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M1", "merchant_category": "retail"},
        {"txn_id": "", "client_id": "C1", "amount": "bad", "currency": "USD",
         "timestamp": "x", "merchant_id": "M1", "merchant_category": "retail"},
    ]))
    m = run([clients, txns], str(tmp_path / "out"))
    assert m["accepted_count"] == 2
    assert m["quarantined_count"] == 1


def test_idempotent_three_reruns(tmp_path):
    clients = _write(tmp_path / "clients.csv", "client_id,name,dob,region\nC1,Ana,2000-01-01,NA\n")
    manifests = []
    for i in range(3):
        out = tmp_path / f"out{i}"
        m = run([clients], str(out))
        manifests.append(json.dumps(m, sort_keys=True))
    assert len(set(manifests)) == 1


def test_quarantine_reason_present(tmp_path):
    txns = _write(tmp_path / "txns.json", json.dumps([
        {"txn_id": "T1", "client_id": "C1", "amount": "bad", "currency": "USD",
         "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M1", "merchant_category": "retail"}
    ]))
    run([txns], str(tmp_path / "out"))
    q = (tmp_path / "out" / "quarantined.jsonl").read_text().strip()
    assert json.loads(q)["_reason"]


def test_provenance_on_accepted_rows(tmp_path):
    clients = _write(tmp_path / "clients.csv", "client_id,name,dob,region\nC1,Ana,2000-01-01,NA\n")
    run([clients], str(tmp_path / "out"))
    a = json.loads((tmp_path / "out" / "accepted.jsonl").read_text().strip())
    assert a["_provenance"]["source"].endswith("clients.csv")
    assert a["_provenance"]["kind"] == "client"


def test_empty_file_does_not_crash(tmp_path):
    empty = _write(tmp_path / "empty.csv", "")
    m = run([empty], str(tmp_path / "out"))
    assert m["accepted_count"] == 0


def test_unicode_payload_round_trips(tmp_path):
    txns = _write(tmp_path / "txns.json", json.dumps([
        {"txn_id": "T1", "client_id": "C-Ünïcode", "amount": 1.23, "currency": "EUR",
         "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M1", "merchant_category": "dining"}
    ], ensure_ascii=False))
    run([txns], str(tmp_path / "out"))
    a = json.loads((tmp_path / "out" / "accepted.jsonl").read_text().strip())
    assert a["client_id"] == "C-Ünïcode"


def test_currency_allowlist_enforced():
    ok, _ = validate_txn({"txn_id": "T", "client_id": "C", "amount": 1.0, "currency": "USD",
                          "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M", "merchant_category": "retail"})
    assert ok
    ok2, reason = validate_txn({"txn_id": "T", "client_id": "C", "amount": 1.0, "currency": "XXX",
                                "timestamp": "2024-01-01T00:00:00Z", "merchant_id": "M", "merchant_category": "retail"})
    assert not ok2 and "currency" in reason


def test_recovery_partial_write(tmp_path):
    """Simulate a kill mid-run by writing a corrupt accepted.jsonl then re-running."""
    out = tmp_path / "out"
    out.mkdir()
    (out / "accepted.jsonl").write_text("{partial garbage\n")
    clients = _write(tmp_path / "clients.csv", "client_id,name,dob,region\nC1,Ana,2000-01-01,NA\n")
    m = run([clients], str(out))
    # Re-run replaces accepted.jsonl with valid JSONL.
    line = (out / "accepted.jsonl").read_text().strip()
    assert json.loads(line)["client_id"] == "C1"
    assert m["accepted_count"] == 1


def test_no_secrets_in_manifest(tmp_path, monkeypatch):
    monkeypatch.setenv("PYARCANA_SECRET", "shhh-do-not-leak")
    clients = _write(tmp_path / "clients.csv", "client_id,name,dob,region\nC1,Ana,2000-01-01,NA\n")
    run([clients], str(tmp_path / "out"))
    blob = (tmp_path / "out" / "manifest.json").read_text()
    assert "shhh-do-not-leak" not in blob
