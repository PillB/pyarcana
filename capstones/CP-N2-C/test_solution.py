"""CP-N2-C tests — idempotency, approval gate, expiry, rollback, redaction, allowlist."""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile

import pytest

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from solution import run, redact, draft_email, validate_input  # noqa: E402


def _rows(n=3):
    return [{"run_id": f"R-{i:04d}", "action": "summary_email", "amount": 10.0 * i,
             "recipient": "ana.review@synthetic.example"} for i in range(1, n + 1)]


def test_idempotent_reruns(tmp_path):
    sample = tmp_path / "s.json"
    sample.write_text(json.dumps(_rows()))
    a = run(str(sample), str(tmp_path / "o1"), test_mode=True)
    b = run(str(sample), str(tmp_path / "o2"), test_mode=True)
    assert a["input_hash"] == b["input_hash"]


def test_no_send_without_approval(tmp_path):
    sample = tmp_path / "s.json"
    sample.write_text(json.dumps(_rows(1)))
    run(str(sample), str(tmp_path / "o"), test_mode=False)
    runs_dir = tmp_path / "o" / "runs"
    for f in os.listdir(runs_dir):
        assert not f.endswith(".sent")


def test_approval_creates_sent_record(tmp_path):
    sample = tmp_path / "s.json"
    sample.write_text(json.dumps(_rows(1)))
    out = tmp_path / "o"
    run(str(sample), str(out), test_mode=False)
    run_path = str(out / "runs" / "R-0001.json")
    r = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                        "--approve", run_path, "--approver", "ana.review@synthetic.example"],
                       capture_output=True, text=True)
    assert r.returncode == 0
    result = json.loads(r.stdout)
    assert result["sent"] is True
    assert os.path.exists(run_path.replace(".json", ".sent"))


def test_approval_blocked_for_non_allowlisted_recipient(tmp_path):
    sample = tmp_path / "s.json"
    sample.write_text(json.dumps([{"run_id": "R-X", "action": "x", "amount": 1.0,
                                   "recipient": "stranger@evil.example"}]))
    out = tmp_path / "o"
    run(str(sample), str(out), test_mode=False)
    run_path = str(out / "runs" / "R-X.json")
    r = subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                        "--approve", run_path, "--approver", "ana.review@synthetic.example"],
                       capture_output=True, text=True)
    result = json.loads(r.stdout)
    assert result["sent"] is False
    assert "allowlist" in result["reason"]


def test_rollback_removes_sent_record(tmp_path):
    sample = tmp_path / "s.json"
    sample.write_text(json.dumps(_rows(1)))
    out = tmp_path / "o"
    run(str(sample), str(out), test_mode=False)
    run_path = str(out / "runs" / "R-0001.json")
    subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                    "--approve", run_path, "--approver", "ana.review@synthetic.example"],
                   capture_output=True, text=True)
    subprocess.run([sys.executable, os.path.join(HERE, "solution.py"),
                    "--rollback", run_path], capture_output=True, text=True)
    assert not os.path.exists(run_path.replace(".json", ".sent"))


def test_redaction_strips_emails():
    out = redact("send to ana.review@synthetic.example please")
    assert "ana.review@synthetic.example" not in out
    assert "[redacted-email]" in out


def test_test_mode_does_not_send(tmp_path):
    sample = tmp_path / "s.json"
    sample.write_text(json.dumps(_rows(1)))
    out = tmp_path / "o"
    summary = run(str(sample), str(out), test_mode=True)
    assert summary["test_mode"] is True
    for f in os.listdir(out / "runs"):
        assert not f.endswith(".sent")


def test_validate_input_quarantines_bad_rows():
    rows = [{"run_id": "", "action": "x", "amount": 1.0}]
    a, q = validate_input(rows)
    assert len(q) == 1 and len(a) == 0


def test_transient_classification():
    from solution import is_transient
    assert is_transient(TimeoutError("x"))
    assert not is_transient(ValueError("x"))
