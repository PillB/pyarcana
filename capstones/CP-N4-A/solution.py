"""CP-N4-A — Governed Python Service Platform (reference solution).

Versioned API, schema validation, API-key + scope authz, rate limits (token
bucket per key), /healthz, /readyz, structured redacted logging, migration
runner, backup/restore drill. Built on stdlib `http.server` (no Flask dep).

A non-root Dockerfile is shipped alongside.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import threading
import time
from collections import defaultdict, deque
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from typing import Any

API_VERSION = "v1"
RATE_LIMIT_RPM = 60  # 60 requests / minute / api key
ALLOWED_SCOPES = {"read", "write", "admin"}
SCOPE_ENDPOINTS = {
    "/service/v1/ingest": {"write", "admin"},
    "/service/v1/resolve": {"read", "write", "admin"},
    "/service/v1/score": {"read", "write", "admin"},
}
REDACT_RE = re.compile(r"(api[_-]?key|token|secret|password|ssn|card)", re.IGNORECASE)


def redact(text: str) -> str:
    return REDACT_RE.sub("[redacted]", text)


def structured_log(event: str, **fields) -> str:
    rec = {"ts": int(time.time()), "event": event, **fields}
    return redact(json.dumps(rec, sort_keys=True, ensure_ascii=False))


# ─────────────────────────────── migrations ───────────────────────────────

MIGRATIONS = [
    {"id": "0001", "name": "create_clients_table", "up": "CREATE TABLE clients (id TEXT PRIMARY KEY);",
     "down": "DROP TABLE clients;"},
    {"id": "0002", "name": "add_amount_column", "up": "ALTER TABLE clients ADD COLUMN amount REAL;",
     "down": "ALTER TABLE clients DROP COLUMN amount;"},
]


class MigrationRunner:
    def __init__(self, store_path):
        self.store_path = store_path
        self.applied = set()
        if os.path.exists(store_path):
            for line in open(store_path):
                line = line.strip()
                if line:
                    self.applied.add(line)

    def up(self):
        results = []
        for m in MIGRATIONS:
            if m["id"] not in self.applied:
                self.applied.add(m["id"])
                results.append({"id": m["id"], "action": "up", "sql": m["up"]})
        self._save()
        return results

    def down(self, target_id=None):
        results = []
        # Reversible migrations: roll back in reverse order
        for m in reversed(MIGRATIONS):
            if target_id and m["id"] == target_id:
                if m["id"] in self.applied:
                    self.applied.discard(m["id"])
                    results.append({"id": m["id"], "action": "down", "sql": m["down"]})
                break
            if m["id"] in self.applied and target_id is None:
                self.applied.discard(m["id"])
                results.append({"id": m["id"], "action": "down", "sql": m["down"]})
        self._save()
        return results

    def _save(self):
        with open(self.store_path, "w", encoding="utf-8") as f:
            for mid in sorted(self.applied):
                f.write(mid + "\n")


# ─────────────────────────────── rate limiter ───────────────────────────────

class TokenBucket:
    def __init__(self, capacity=RATE_LIMIT_RPM, refill_per_min=RATE_LIMIT_RPM):
        self.capacity = capacity
        self.refill_per_min = refill_per_min
        self.tokens = capacity
        self.last = time.monotonic()
        self.lock = threading.Lock()

    def allow(self) -> bool:
        with self.lock:
            now = time.monotonic()
            elapsed = now - self.last
            self.last = now
            self.tokens = min(self.capacity, self.tokens + elapsed * (self.refill_per_min / 60.0))
            if self.tokens >= 1:
                self.tokens -= 1
                return True
            return False


# ─────────────────────────────── backup/restore ───────────────────────────────

def backup(state_dir, backup_path):
    """Copy every file in state_dir into a single JSON backup blob."""
    blob = {"files": {}}
    for f in os.listdir(state_dir):
        full = os.path.join(state_dir, f)
        if os.path.isfile(full):
            blob["files"][f] = open(full, "rb").read().decode("utf-8", errors="replace")
    with open(backup_path, "w", encoding="utf-8") as f:
        json.dump(blob, f, ensure_ascii=False, indent=2)
    return {"backup_path": backup_path, "files": list(blob["files"])}


def restore(backup_path, state_dir):
    blob = json.load(open(backup_path, encoding="utf-8"))
    os.makedirs(state_dir, exist_ok=True)
    for name, content in blob["files"].items():
        with open(os.path.join(state_dir, name), "w", encoding="utf-8") as f:
            f.write(content)
    return {"restored": list(blob["files"])}


# ─────────────────────────────── HTTP service ───────────────────────────────

class Handler(BaseHTTPRequestHandler):
    buckets: dict[str, TokenBucket] = defaultdict(TokenBucket)
    state_dir = "/tmp/cp_n4_a_state"
    log_lines: list[str] = []

    def _send(self, code: int, body: dict | str, content_type="application/json"):
        if isinstance(body, (dict, list)):
            payload = json.dumps(body, ensure_ascii=False).encode("utf-8")
        else:
            payload = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", content_type)
        self.send_header("Content-Length", str(len(payload)))
        self.end_headers()
        self.wfile.write(payload)
        self.log_lines.append(structured_log("response", code=code, path=self.path, length=len(payload)))

    def _auth(self):
        key = self.headers.get("X-Api-Key")
        scope = self.headers.get("X-Scope", "read")
        # Synthetic auth: accept any non-empty key with the "demo-key" prefix.
        # Real deployments would validate against a secret manager.
        if not key or not key.startswith("demo-key"):
            return None, None, (401, {"error": "unauthenticated"})
        if scope not in ALLOWED_SCOPES:
            return None, None, (403, {"error": "invalid scope"})
        return key, scope, None

    def _rate_limit(self, key):
        if not self.buckets[key].allow():
            return (429, {"error": "rate_limit_exceeded"})
        return None

    def do_GET(self):
        if self.path == "/healthz":
            self._send(200, {"status": "ok"})
            return
        if self.path == "/readyz":
            mr = MigrationRunner(os.path.join(self.state_dir, "migrations.txt"))
            self._send(200, {"ready": True, "migrations_applied": sorted(mr.applied)})
            return
        if self.path == "/service/v1/version":
            self._send(200, {"api_version": API_VERSION})
            return
        self._send(404, {"error": "not found"})

    def do_POST(self):
        if not self.path.startswith(f"/service/{API_VERSION}/"):
            self._send(404, {"error": "not found"})
            return
        key, scope, err = self._auth()
        if err:
            self._send(*err)
            return
        rl = self._rate_limit(key)
        if rl:
            self._send(*rl)
            return
        endpoint = self.path
        allowed = SCOPE_ENDPOINTS.get(endpoint, set())
        if scope not in allowed:
            self._send(403, {"error": "forbidden", "reason": f"scope {scope} not allowed for {endpoint}"})
            return
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length) if length else b"{}"
        try:
            body = json.loads(raw)
        except json.JSONDecodeError:
            self._send(400, {"error": "invalid_json"})
            return
        ok, reason = self._validate(endpoint, body)
        if not ok:
            self._send(400, {"error": "schema_invalid", "reason": reason})
            return
        if endpoint.endswith("/ingest"):
            self._send(200, {"accepted": len(body.get("records", [])), "rejected": 0})
        elif endpoint.endswith("/resolve"):
            self._send(200, {"clusters": [[r["client_id"]] for r in body.get("records", [])], "ambiguous_queue": []})
        elif endpoint.endswith("/score"):
            self._send(200, {"score": 0.5, "calibrated_prob": 0.5, "abstain": False})
        else:
            self._send(404, {"error": "unknown_endpoint"})

    def _validate(self, endpoint, body):
        if endpoint.endswith("/ingest"):
            recs = body.get("records")
            if not isinstance(recs, list):
                return False, "records must be a list"
            for r in recs:
                if not isinstance(r, dict) or not r.get("client_id"):
                    return False, "each record must have a client_id"
                if "amount" in r and not isinstance(r["amount"], (int, float)):
                    return False, "amount must be numeric"
            return True, ""
        if endpoint.endswith("/resolve"):
            if not isinstance(body.get("records"), list):
                return False, "records must be a list"
            return True, ""
        if endpoint.endswith("/score"):
            if not isinstance(body.get("case"), dict):
                return False, "case must be an object"
            return True, ""
        return False, "no validator"

    def log_message(self, fmt, *args):
        # structured + redacted
        self.log_lines.append(redact(structured_log("http", method=self.command, path=self.path, msg=fmt % args)))


def serve(port, state_dir):
    Handler.state_dir = state_dir
    os.makedirs(state_dir, exist_ok=True)
    mr = MigrationRunner(os.path.join(state_dir, "migrations.txt"))
    mr.up()
    server = ThreadingHTTPServer(("127.0.0.1", port), Handler)
    return server


def self_test(state_dir):
    """Boot the service, exercise every endpoint, return a results dict."""
    port = 8099
    server = serve(port, state_dir)
    t = threading.Thread(target=server.serve_forever, daemon=True)
    t.start()
    time.sleep(0.2)
    import urllib.request, urllib.error
    results = {}

    def _get(path):
        try:
            r = urllib.request.urlopen(f"http://127.0.0.1:{port}{path}", timeout=2)
            return r.status, r.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode("utf-8")

    def _post(path, body, headers=None):
        req = urllib.request.Request(f"http://127.0.0.1:{port}{path}",
                                     data=json.dumps(body).encode("utf-8"),
                                     headers=headers or {"Content-Type": "application/json"}, method="POST")
        try:
            r = urllib.request.urlopen(req, timeout=2)
            return r.status, r.read().decode("utf-8")
        except urllib.error.HTTPError as e:
            return e.code, e.read().decode("utf-8")

    results["healthz"] = _get("/healthz")
    results["readyz"] = _get("/readyz")
    results["version"] = _get("/service/v1/version")
    results["ingest_ok"] = _post("/service/v1/ingest", {"records": [{"client_id": "C1", "amount": 10.0}]},
                                 {"Content-Type": "application/json", "X-Api-Key": "demo-key", "X-Scope": "write"})
    results["ingest_no_auth"] = _post("/service/v1/ingest", {"records": []}, {"Content-Type": "application/json"})
    results["ingest_wrong_scope"] = _post("/service/v1/ingest", {"records": []},
                                          {"Content-Type": "application/json", "X-Api-Key": "demo-key", "X-Scope": "read"})
    results["ingest_bad_schema"] = _post("/service/v1/ingest", {"records": [{"no_client_id": True}]},
                                         {"Content-Type": "application/json", "X-Api-Key": "demo-key", "X-Scope": "write"})
    # rate-limit drill: send 65 requests with a fresh key
    rl_key = "demo-key-rl"
    Handler.buckets[rl_key] = TokenBucket()
    rl_results = []
    for _ in range(65):
        s, _ = _post("/service/v1/score", {"case": {"x": 1}},
                     {"Content-Type": "application/json", "X-Api-Key": rl_key, "X-Scope": "read"})
        rl_results.append(s)
    results["rate_limit_triggered"] = 429 in rl_results
    # backup/restore drill
    bk_path = os.path.join(state_dir, "backup.json")
    results["backup"] = backup(state_dir, bk_path)
    results["restore"] = restore(bk_path, os.path.join(state_dir, "restored"))
    # migration reversibility
    mr = MigrationRunner(os.path.join(state_dir, "migrations.txt"))
    results["migrations_down"] = mr.down(target_id="0002")
    mr.up()  # re-apply
    server.shutdown()
    return results


def main(argv=None):
    ap = argparse.ArgumentParser(description="CP-N4-A governed service platform")
    ap.add_argument("--port", type=int, default=8099)
    ap.add_argument("--state-dir", default="/tmp/cp_n4_a_state")
    ap.add_argument("--self-test", action="store_true")
    args = ap.parse_args(argv)
    if args.self_test:
        print(json.dumps(self_test(args.state_dir), indent=2, default=str))
        return 0
    server = serve(args.port, args.state_dir)
    print(f"CP-N4-A service on http://127.0.0.1:{args.port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()
    return 0


if __name__ == "__main__":
    sys.exit(main())
