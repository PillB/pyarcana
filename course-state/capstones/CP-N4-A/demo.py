#!/usr/bin/env python3
"""CP-N4-A — Governed Python Service Platform (in-process contract tests)."""
from __future__ import annotations
import json
import sys
from typing import Any

CAPSTONE_ID = "CP-N4-A"
API_VERSION = "v1"
VALID_TOKEN = "demo-token-not-a-secret"


class Service:
    def __init__(self):
        self.store = {"items": {}}

    def handle(self, method: str, path: str, headers: dict, body: dict | None = None) -> dict[str, Any]:
        if path == f"/{API_VERSION}/health":
            return {"status": 200, "body": {"ok": True, "version": API_VERSION}}
        auth = headers.get("Authorization", "")
        if auth != f"Bearer {VALID_TOKEN}":
            return {"status": 401, "body": {"error": "unauthorized"}}
        if method == "POST" and path == f"/{API_VERSION}/cases":
            if not body or "case_id" not in body or "payload" not in body:
                return {"status": 400, "body": {"error": "invalid_schema"}}
            cid = body["case_id"]
            self.store["items"][cid] = body["payload"]
            return {"status": 201, "body": {"case_id": cid, "stored": True}}
        if method == "GET" and path.startswith(f"/{API_VERSION}/cases/"):
            cid = path.rsplit("/", 1)[-1]
            if cid not in self.store["items"]:
                return {"status": 404, "body": {"error": "not_found"}}
            return {"status": 200, "body": {"case_id": cid, "payload": self.store["items"][cid]}}
        return {"status": 404, "body": {"error": "route_not_found"}}


def main() -> int:
    svc = Service()
    tests = []

    def check(name, cond):
        tests.append({"name": name, "pass": bool(cond)})

    r = svc.handle("GET", f"/{API_VERSION}/health", {})
    check("health_ok", r["status"] == 200 and r["body"]["ok"] is True)
    r = svc.handle("POST", f"/{API_VERSION}/cases", {}, {"case_id": "C1", "payload": {"x": 1}})
    check("auth_required", r["status"] == 401)
    h = {"Authorization": f"Bearer {VALID_TOKEN}"}
    r = svc.handle("POST", f"/{API_VERSION}/cases", h, {"case_id": "C1", "payload": {"x": 1}})
    check("create_ok", r["status"] == 201)
    r = svc.handle("POST", f"/{API_VERSION}/cases", h, {"case_id": "C2"})
    check("schema_reject", r["status"] == 400)
    r = svc.handle("GET", f"/{API_VERSION}/cases/C1", h)
    check("get_ok", r["status"] == 200 and r["body"]["payload"]["x"] == 1)
    r = svc.handle("GET", f"/{API_VERSION}/cases/NOPE", h)
    check("not_found", r["status"] == 404)
    passed = sum(1 for t in tests if t["pass"])
    assert passed == len(tests)
    metrics = {
        "capstone_id": CAPSTONE_ID,
        "status": "pass",
        "api_version": API_VERSION,
        "contract_tests_total": len(tests),
        "contract_tests_passed": passed,
        "tests": tests,
    }
    print(f"METRICS_JSON: {json.dumps(metrics, ensure_ascii=False)}")
    print(f"{CAPSTONE_ID} Service OK — {passed}/{len(tests)} contract tests")
    return 0


if __name__ == "__main__":
    sys.exit(main())
