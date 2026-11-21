"""CP-FINAL — load the published interface of an upstream capstone package.

The level-1 subsystems (intake, etl, familiarity) do not reimplement their capstones: they call
the interface each package publishes, `CP-N1-X/reference/cp_n1_x.py`, so CP-FINAL cannot drift
from the contract the learner built. In your own CP-FINAL, point this at your own files
(`STARTER/` of each package) instead of `reference/`.

This module is not a subsystem: it imports none of them.
"""
from __future__ import annotations

import importlib.util
import sys
from functools import lru_cache
from pathlib import Path

CAPSTONES = Path(__file__).resolve().parents[2]


@lru_cache(maxsize=None)
def load(capstone_id: str):
    """The reference module of `capstone_id` (for example "CP-N1-A" → cp_n1_a.py)."""
    stem = capstone_id.lower().replace("-", "_")
    path = CAPSTONES / capstone_id / "reference" / f"{stem}.py"
    name = f"cp_final_upstream_{stem}"
    spec = importlib.util.spec_from_file_location(name, path)
    if spec is None or spec.loader is None:
        raise ImportError(f"no published interface for {capstone_id} at {path}")
    module = importlib.util.module_from_spec(spec)
    # @dataclass resolves string annotations through sys.modules (see docs/agents/lessons.md).
    sys.modules[name] = module
    spec.loader.exec_module(module)
    return module
