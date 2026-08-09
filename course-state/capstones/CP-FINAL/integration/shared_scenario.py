"""CP-FINAL — shared synthetic scenario (`shared_scenario_v1`).

A SINGLE deterministic, PII-free scenario that every subsystem consumes
through its declared interface. Subsystems do NOT import each other;
they only read this shared scenario. The scenario is read-only — subsystems
must never mutate it in place.

Deterministic given the same `seed`.
"""
from __future__ import annotations

import copy
import hashlib
import json
from dataclasses import dataclass, field
from typing import Any, Dict, List

SCENARIO_VERSION = "shared_scenario_v1"
DEFAULT_SEED = 4252  # CP-FINAL


def _rand(seed: int, n: int) -> float:
    """Deterministic pseudo-random in [0,1) using sha256 — stdlib only."""
    h = hashlib.sha256(f"{seed}:{n}".encode("utf-8")).hexdigest()
    return int(h[:8], 16) / 0xFFFFFFFF


@dataclass(frozen=True)
class SharedScenario:
    scenario_id: str
    scenario_version: str
    seed: int
    clients: List[Dict[str, Any]] = field(default_factory=list)
    transactions: List[Dict[str, Any]] = field(default_factory=list)
    entities: List[Dict[str, Any]] = field(default_factory=list)
    cases: List[Dict[str, Any]] = field(default_factory=list)
    dataset_meta: Dict[str, str] = field(default_factory=dict)

    def to_dict(self) -> Dict[str, Any]:
        return {
            "scenario_id": self.scenario_id,
            "scenario_version": self.scenario_version,
            "seed": self.seed,
            "clients": list(self.clients),
            "transactions": list(self.transactions),
            "entities": list(self.entities),
            "cases": list(self.cases),
            "dataset_meta": dict(self.dataset_meta),
        }


def build_scenario(seed: int = DEFAULT_SEED) -> SharedScenario:
    """Build a deterministic, synthetic, PII-free shared scenario.

    Names use synthetic markers; emails end in `@example.test`. Amounts are
    deterministic via the sha256-based pseudo-random function.
    """
    first_names = ["Ana", "Bruno", "Carla", "Diego", "Eva", "Franco", "Gina", "Hugo"]
    last_names = ["Sintetico", "Demo", "Test", "Capstone", "Curso", "Planta"]
    clients: List[Dict[str, Any]] = []
    for i in range(8):
        fn = first_names[i % len(first_names)]
        ln = last_names[(i * 3) % len(last_names)]
        clients.append({
            "id": f"SYN-CLI-{i+1:03d}",
            "name": f"{fn} {ln}",
            "email": f"{fn.lower()}.{ln.lower()}@example.test",
            "amount": round(_rand(seed, i) * 1000, 2),
            "status": "ok" if _rand(seed, i + 100) > 0.2 else "review",
        })
    # Boundary & malformed rows (CP-N1-A criticalFailure: must handle malformed)
    clients.append({"id": None, "name": "", "email": "bad", "amount": -5})
    clients.append({"id": "SYN-CLI-EDGE", "name": "Edge Case", "email": "edge@example.test", "amount": 0})

    transactions: List[Dict[str, Any]] = []
    for i in range(12):
        src = clients[i % len(clients)].get("id") or "unknown"
        dst = clients[(i + 3) % len(clients)].get("id") or "unknown"
        transactions.append({
            "tx_id": f"SYN-TX-{i+1:03d}",
            "src_client_id": src,
            "dst_client_id": dst,
            "amount": round(_rand(seed, i + 200) * 500, 2),
            "currency": "SYN",
            "ts": f"2026-01-{(i % 27) + 1:02d}T10:00:00Z",
        })

    # Entities — possible duplicates (same normalized name, different IDs).
    # NO inferred relationships: only declarative entity attributes.
    entities: List[Dict[str, Any]] = [
        {"entity_id": "E-001", "client_ids": ["SYN-CLI-001"], "normalized_name": "ana sintetico"},
        {"entity_id": "E-002", "client_ids": ["SYN-CLI-002", "SYN-CLI-009"], "normalized_name": "bruno demo"},
        {"entity_id": "E-003", "client_ids": ["SYN-CLI-003"], "normalized_name": "carla test"},
        {"entity_id": "E-004", "client_ids": ["SYN-CLI-004"], "normalized_name": "diego capstone"},
    ]

    cases: List[Dict[str, Any]] = []
    for i, e in enumerate(entities):
        cases.append({
            "case_id": f"SYN-CASE-{i+1:03d}",
            "entity_id": e["entity_id"],
            "signals": ["shared_address" if i == 1 else "single_account"],
            "amount_sum": round(_rand(seed, i + 300) * 750, 2),
            "needs_human_review": True,
        })

    return SharedScenario(
        scenario_id=f"shared_scenario_seed_{seed}",
        scenario_version=SCENARIO_VERSION,
        seed=seed,
        clients=clients,
        transactions=transactions,
        entities=entities,
        cases=cases,
        dataset_meta={
            "synthetic": "true",
            "pii": "none",
            "license": "internal_training_only",
            "generator": "shared_scenario.build_scenario",
        },
    )


#: Module-level singleton (read-only by convention).
shared_scenario_v1: SharedScenario = build_scenario(DEFAULT_SEED)


def snapshot(scenario: SharedScenario) -> str:
    """Stable JSON snapshot of the scenario for reproducibility checks."""
    return json.dumps(scenario.to_dict(), sort_keys=True, ensure_ascii=False)


def clone(scenario: SharedScenario) -> SharedScenario:
    """Deep-copy a scenario — subsystems should read their own copy."""
    return copy.deepcopy(scenario)


if __name__ == "__main__":
    print(json.dumps(shared_scenario_v1.to_dict(), ensure_ascii=False, indent=2))
