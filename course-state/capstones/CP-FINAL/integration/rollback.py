"""CP-FINAL — rollback proof.

Provides a tiny in-memory integration state store and a `rollback` operation
that restores a prior snapshot. The companion test in
`integration/e2e_test.py` (and the adversarial test) asserts that, after a
state mutation, rollback restores the exact prior snapshot.

This module exists ONLY to make rollback demonstrable; it is not a database.
"""
from __future__ import annotations

import copy
import json
from typing import Any, Dict, List, Optional


class IntegrationStateStore:
    """A tiny key/value store of integration state with snapshot history.

    Each `commit(key, value)` records a snapshot. `rollback()` undoes the
    most recent commit, restoring the previous value for every key.
    """

    def __init__(self) -> None:
        self._state: Dict[str, Any] = {}
        self._history: List[Dict[str, Any]] = []

    def commit(self, key: str, value: Any) -> None:
        # Deep copy so external mutation does not affect the snapshot.
        self._history.append(copy.deepcopy(self._state))
        self._state[key] = copy.deepcopy(value)

    def get(self, key: str, default: Any = None) -> Any:
        return self._state.get(key, default)

    def snapshot(self) -> Dict[str, Any]:
        return copy.deepcopy(self._state)

    def rollback(self) -> bool:
        """Restore the most recent prior snapshot. Returns False if empty."""
        if not self._history:
            return False
        self._state = self._history.pop()
        return True

    def to_json(self) -> str:
        return json.dumps({"state": self._state, "history_len": len(self._history)},
                          sort_keys=True, ensure_ascii=False)


def demonstrate_rollback() -> Dict[str, Any]:
    """Run a small proof: commit A, commit B, rollback, assert state == A."""
    store = IntegrationStateStore()
    store.commit("active_model", {"name": "triage", "version": "1.0.0"})
    snapshot_a = store.snapshot()
    store.commit("active_model", {"name": "triage", "version": "1.1.0-broken"})
    rolled_back = store.rollback()
    snapshot_after = store.snapshot()
    assert rolled_back is True
    assert snapshot_after == snapshot_a, "rollback did not restore prior state"
    return {
        "rollback_proven": True,
        "rolled_back_to": snapshot_after,
        "history_remaining": 0,
    }


if __name__ == "__main__":
    print(json.dumps(demonstrate_rollback(), indent=2, ensure_ascii=False))
