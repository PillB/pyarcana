"""CP-FINAL — backup and restore of integration state to JSON.

A backup is a deterministic JSON snapshot of an IntegrationBundle plus the
shared scenario that produced it. `restore()` reads such a snapshot and
returns the original bundle dict (for assertion / audit purposes).

Stdlib only. No PII. No network.
"""
from __future__ import annotations

import json
import os
import tempfile
from typing import Any, Dict, Optional

from . import contracts
from . import shared_scenario


def backup(bundle: contracts.IntegrationBundle, dest_dir: str) -> str:
    """Serialize an IntegrationBundle to a deterministic JSON file.

    Returns the absolute path of the backup file. The path is also embedded
    in the bundle's `backup_path` field (callers may re-assign).
    """
    os.makedirs(dest_dir, exist_ok=True)
    payload = {
        "schema": "cp_final_backup_v1",
        "bundle": contracts.to_jsonable(bundle),
    }
    fname = f"cp_final_backup_{bundle.scenario_id}.json"
    path = os.path.join(dest_dir, fname)
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(payload, fh, sort_keys=True, ensure_ascii=False, indent=2)
    return path


def restore(path: str) -> Dict[str, Any]:
    """Read a backup file and return the deserialized bundle dict."""
    with open(path, "r", encoding="utf-8") as fh:
        payload = json.load(fh)
    if payload.get("schema") != "cp_final_backup_v1":
        raise ValueError("unexpected backup schema")
    return payload["bundle"]


def backup_scenario(scenario: Optional[shared_scenario.SharedScenario] = None,
                    dest_dir: Optional[str] = None) -> str:
    """Snapshot the shared scenario to JSON for reproducibility checks."""
    sc = scenario or shared_scenario.shared_scenario_v1
    if dest_dir is None:
        # Use a temporary file so the helper is side-effect-free by default.
        fd, path = tempfile.mkstemp(prefix="cp_final_scenario_", suffix=".json")
        os.close(fd)
    else:
        os.makedirs(dest_dir, exist_ok=True)
        path = os.path.join(dest_dir, f"scenario_{sc.scenario_id}.json")
    with open(path, "w", encoding="utf-8") as fh:
        json.dump(sc.to_dict(), fh, sort_keys=True, ensure_ascii=False, indent=2)
    return path
