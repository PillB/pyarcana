"""Run-state rollback.

The orchestrator snapshots a run state before every mutating step that an
operator might want to undo (typically: before a sensitive tool call, before
a model swap, before a step that the verifier might reject). ``rollback()``
restores the most recent snapshot and proves the restoration by returning a
``RollbackProof`` whose ``before`` and ``after`` fingerprints differ from the
intermediate state and match the snapshot.
"""
from __future__ import annotations

import copy
from dataclasses import dataclass, field
from typing import Any, Dict, Optional

from .state import RunState


@dataclass
class RollbackProof:
    run_id: str
    before_fingerprint: str
    intermediate_fingerprint: str
    after_fingerprint: str
    restored_steps: int
    ok: bool

    def to_dict(self) -> Dict[str, Any]:
        return {
            "run_id": self.run_id,
            "before_fingerprint": self.before_fingerprint,
            "intermediate_fingerprint": self.intermediate_fingerprint,
            "after_fingerprint": self.after_fingerprint,
            "restored_steps": self.restored_steps,
            "ok": self.ok,
        }


class RollbackManager:
    """Holds snapshots for a run and restores them on demand."""

    def __init__(self, state: RunState) -> None:
        self._state = state
        self._snapshots: list[Dict[str, Any]] = []
        if state.prior_snapshot is not None:
            self._snapshots.append(copy.deepcopy(state.prior_snapshot))

    def capture(self) -> str:
        """Snapshot the current state and return its fingerprint.

        The snapshot is also stored on ``state.prior_snapshot`` so that a
        fresh ``RollbackManager`` constructed later (e.g. in a different
        process) can restore the most recent captured state.
        """
        snap = self._state.snapshot()
        self._snapshots.append(snap)
        self._state.prior_snapshot = copy.deepcopy(snap)
        return self._state.fingerprint()

    def rollback(self) -> RollbackProof:
        """Restore the most recent snapshot and prove the restoration."""
        if not self._snapshots:
            return RollbackProof(
                run_id=self._state.run_id,
                before_fingerprint="",
                intermediate_fingerprint=self._state.fingerprint(),
                after_fingerprint=self._state.fingerprint(),
                restored_steps=0,
                ok=False,
            )
        before_snap = self._snapshots[-1]
        before_fp = self._fingerprint_dict(before_snap)
        intermediate_fp = self._state.fingerprint()
        # Restore.
        restored_steps = len(before_snap.get("steps", []))
        new_state = RunState.from_dict(copy.deepcopy(before_snap))
        # Preserve the snapshot chain so rollback can be applied repeatedly.
        new_state.prior_snapshot = copy.deepcopy(before_snap)
        # Mutate self._state in place so callers holding the reference see it.
        self._state.__dict__.update(new_state.__dict__)
        after_fp = self._state.fingerprint()
        ok = (after_fp == before_fp) and (after_fp != intermediate_fp or restored_steps == 0)
        return RollbackProof(
            run_id=self._state.run_id,
            before_fingerprint=before_fp,
            intermediate_fingerprint=intermediate_fp,
            after_fingerprint=after_fp,
            restored_steps=restored_steps,
            ok=ok,
        )

    @staticmethod
    def _fingerprint_dict(d: Dict[str, Any]) -> str:
        # RunState.fingerprint is what we want; reuse the same hash.
        import hashlib
        import json
        payload = json.dumps(d, sort_keys=True)
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()[:16]
