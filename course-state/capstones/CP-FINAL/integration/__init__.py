"""CP-FINAL integration package — 12 upstream subsystems orchestrated through
versioned contracts. Stdlib only. No PII. No network. Deterministic.

Public surface:
- platform.integrate(scenario) -> IntegrationBundle   (the FINAL interface)
- contracts.*                                     (typed contracts)
- shared_scenario.shared_scenario_v1              (the shared scenario)
- dependency_graph.get_graph()                    (topological graph)
"""
from __future__ import annotations

from . import contracts  # noqa: F401
from . import shared_scenario  # noqa: F401
from . import dependency_graph  # noqa: F401
from . import platform  # noqa: F401

#: Package version — must match `gate.json#package_version`.
__version__ = "2.0.0"
