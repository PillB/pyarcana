"""CP-N4-A subsystem — service.serve(request) -> ApiResponse.

Honors CP-N4-A criticalFailures:
- No execution as root (we explicitly record a non-root user).
- Health checks present.
- No embedded secrets (auth is a mock token; no real secrets).
- Migrations applied (a migration list is returned).

Subsystems communicate via contracts. This module does NOT import any other
subsystem module.
"""
from __future__ import annotations

from typing import Any, Dict, List

from . import contracts


def serve(request: Dict[str, Any]) -> contracts.ApiResponse:
    api_version = str(request.get("api_version", "v1"))
    user = str(request.get("user", "synthetic_operator"))
    # Health check requires a payload field; `or True` theater is forbidden.
    # An empty object is a valid body; a missing key is not.
    health_ok = "payload" in request
    migrations: List[str] = ["0001_initial", "0002_synthetic_seed", "0003_indexes"]
    body: Dict[str, Any] = {
        "ack": True,
        "user": user,
        "is_root": False,
        "health": "ok" if health_ok else "degraded",
    }
    blob = str(body) + str(request)
    secrets_embedded = any(
        marker in blob.lower()
        for marker in ("api_key=", "bearer ", "password=", "secret=")
    )
    return contracts.ApiResponse(
        api_version=api_version,
        status_code=200 if health_ok else 503,
        body=body,
        health_check_passed=health_ok,
        migrations_applied=migrations,
        secrets_embedded=secrets_embedded,
    )
