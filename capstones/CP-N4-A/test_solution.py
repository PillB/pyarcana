"""CP-N4-A tests — contract / integration / authz / rate-limit / recovery."""
from __future__ import annotations

import json
import os
import subprocess
import sys
import tempfile
import threading
import time
import urllib.request
import urllib.error

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import serve, self_test, MigrationRunner, backup, restore, TokenBucket  # noqa: E402


@pytest.fixture(scope="module")
def server():
    with tempfile.TemporaryDirectory() as td:
        srv = serve(8098, td)
        t = threading.Thread(target=srv.serve_forever, daemon=True)
        t.start()
        time.sleep(0.2)
        yield td
        srv.shutdown()


def _get(path):
    try:
        r = urllib.request.urlopen(f"http://127.0.0.1:8098{path}", timeout=2)
        return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def _post(path, body, headers=None):
    req = urllib.request.Request(f"http://127.0.0.1:8098{path}",
                                 data=json.dumps(body).encode("utf-8"),
                                 headers=headers or {"Content-Type": "application/json"}, method="POST")
    try:
        r = urllib.request.urlopen(req, timeout=2)
        return r.status, r.read().decode("utf-8")
    except urllib.error.HTTPError as e:
        return e.code, e.read().decode("utf-8")


def test_healthz(server):
    s, _ = _get("/healthz")
    assert s == 200


def test_readyz(server):
    s, body = _get("/readyz")
    assert s == 200
    assert "migrations_applied" in body


def test_versioned_api(server):
    s, body = _get("/service/v1/version")
    assert s == 200 and "v1" in body


def test_auth_rejects_no_key(server):
    s, _ = _post("/service/v1/ingest", {"records": []})
    assert s == 401


def test_authz_rejects_wrong_scope(server):
    s, _ = _post("/service/v1/ingest", {"records": []},
                 {"Content-Type": "application/json", "X-Api-Key": "demo-key", "X-Scope": "read"})
    assert s == 403


def test_schema_validation(server):
    s, _ = _post("/service/v1/ingest", {"records": [{"no_client_id": True}]},
                 {"Content-Type": "application/json", "X-Api-Key": "demo-key", "X-Scope": "write"})
    assert s == 400


def test_happy_path_ingest(server):
    s, body = _post("/service/v1/ingest", {"records": [{"client_id": "C1", "amount": 10.0}]},
                    {"Content-Type": "application/json", "X-Api-Key": "demo-key", "X-Scope": "write"})
    assert s == 200
    assert json.loads(body)["accepted"] == 1


def test_rate_limit(server):
    # Use a fresh key so the test is independent
    key = "demo-key-rl-test"
    from solution import Handler, TokenBucket
    Handler.buckets[key] = TokenBucket()
    statuses = []
    for _ in range(70):
        s, _ = _post("/service/v1/score", {"case": {"x": 1}},
                     {"Content-Type": "application/json", "X-Api-Key": key, "X-Scope": "read"})
        statuses.append(s)
    assert 429 in statuses


def test_migrations_reversible(tmp_path):
    mr = MigrationRunner(str(tmp_path / "mig.txt"))
    up = mr.up()
    assert up  # at least one migration applied
    down = mr.down(target_id=up[-1]["id"])
    assert down  # reversed


def test_backup_restore_drill(tmp_path):
    state = tmp_path / "state"
    state.mkdir()
    (state / "a.txt").write_text("hello")
    bk = tmp_path / "backup.json"
    b = backup(str(state), str(bk))
    assert "a.txt" in b["files"]
    # corrupt state
    (state / "a.txt").write_text("corrupted")
    r = restore(str(bk), str(state / "restored"))
    assert "a.txt" in r["restored"]
    assert (state / "restored" / "a.txt").read_text() == "hello"


def test_self_test_passes(tmp_path):
    results = self_test(str(tmp_path))
    assert results["ingest_ok"][0] == 200
    assert results["ingest_no_auth"][0] == 401
    assert results["rate_limit_triggered"] is True
