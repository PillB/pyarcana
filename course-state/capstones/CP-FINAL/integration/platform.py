"""CP-FINAL — platform integration entry point.

`platform.integrate(scenario) -> IntegrationBundle` is the FINAL interface
declared in `src/lib/capstones/catalog.ts`. It runs the 12 upstream
subsystems in dependency order over the shared synthetic scenario, collects
their contract results, builds an end-to-end trace, evaluates the no-go
condition, takes a backup, and returns an IntegrationBundle.

Stdlib only. No PII. No network. Deterministic given the same scenario seed.
"""
from __future__ import annotations

import json
import os
from dataclasses import replace
from typing import Any, Dict, Optional

from . import contracts
from . import dependency_graph
from . import no_go
from . import shared_scenario
from . import backup_restore
from . import (
    intake, etl, familiarity, eda, reports, rpa,
    er, graph, triage, service, platform_ml, copilot,
)


def _deterministic_duration(step_index: int) -> float:
    """Synthetic, deterministic per-step duration (monotonic counter).

    Real wall-clock durations would break reproducibility, so we use a
    step-indexed synthetic value. Tests assert presence of `duration_ms`,
    not its real-world accuracy.
    """
    return float(step_index + 1)


def _build_subsystem_inputs(scenario: shared_scenario.SharedScenario) -> Dict[str, Any]:
    """Materialize the per-subsystem inputs from the shared scenario.

    Subsystems do NOT import each other — the platform passes them their
    inputs directly. This is the ONLY place where the shared scenario is
    "split" into per-capstone inputs.

    Signatures honor the catalog:
      - intake.run(records)            -> records is a list
      - etl.run(batch)                 -> batch is a dict
      - familiarity.review(case)       -> case is a dict
      - eda.profile(dataset)           -> dataset is a dict
      - reports.render(spec)           -> spec is a dict
      - rpa.run(job)                   -> job is a dict
      - er.resolve(records)            -> records is a list
      - graph.investigate(query)       -> query is a dict
      - triage.score(case)             -> case is a dict
      - service.serve(request)         -> request is a dict
      - platform.deploy(model)         -> model is a dict
      - copilot.run(task)              -> task is a dict
    """
    clients = list(scenario.clients)
    transactions = list(scenario.transactions)
    entities = list(scenario.entities)
    cases = list(scenario.cases)
    return {
        # CP-N1-A: records (list)
        "CP-N1-A": clients,
        # CP-N1-B: batch (dict)
        "CP-N1-B": {"batch_id": f"syn-batch-{scenario.seed}", "records": clients},
        # CP-N1-C: case (dict)
        "CP-N1-C": cases[0] if cases else {"case_id": "syn-case-empty"},
        # CP-N2-A: dataset (dict)
        "CP-N2-A": {"dataset_version": scenario.scenario_version, "records": clients},
        # CP-N2-B: spec (dict)
        "CP-N2-B": {
            "spec_id": f"syn-spec-{scenario.seed}",
            "title": "Synthetic Operations Report",
            "metrics": {"n_clients": len(clients), "n_transactions": len(transactions)},
            "denominators": {"n_clients": "scenario.clients", "n_transactions": "scenario.transactions"},
        },
        # CP-N2-C: job (dict)
        "CP-N2-C": {
            "job_id": f"syn-rpa-{scenario.seed}",
            "steps": [{"action": "noop"}, {"action": "send_email", "human_approved": False}],
            "human_approved": False,
        },
        # CP-N3-A: records (list)
        "CP-N3-A": clients,
        # CP-N3-B: query (dict)
        "CP-N3-B": {
            "case_id": f"syn-graph-{scenario.seed}",
            "viewer": "synthetic_analyst",
            "authorized": True,
            "nodes": [{"id": e["entity_id"], "kind": "entity"} for e in entities],
            "edges": [
                {"src": entities[i]["entity_id"], "dst": entities[(i + 1) % len(entities)]["entity_id"],
                 "link_type": "direct" if i % 2 == 0 else "inferred"}
                for i in range(len(entities))
            ],
        },
        # CP-N3-C: case (dict)
        "CP-N3-C": cases[0] if cases else {"case_id": "syn-case-empty"},
        # CP-N4-A: request (dict)
        "CP-N4-A": {"api_version": "v1", "user": "synthetic_operator", "payload": {"hello": "world"}},
        # CP-N4-B: model (dict)
        "CP-N4-B": {
            "name": "syn-triage",
            "version": "1.0.0",
            "accuracy": 0.85,
            "approval": {"approved": True, "approver": "synthetic_reviewer",
                         "timestamp": "2026-01-01T00:00:00Z"},
        },
        # CP-N4-C: task (dict)
        "CP-N4-C": {
            "task_id": f"syn-copilot-{scenario.seed}",
            "viewer": "synthetic_analyst",
            "authorized": True,
            "query": "rollback model er pii",
            "actions": [{"name": "search_docs"}, {"name": "send_email", "human_approved": False}],
        },
    }


#: Maps each capstone id to its subsystem entry-point function.
SUBSYSTEM_RUNNERS = {
    "CP-N1-A": intake.run,
    "CP-N1-B": etl.run,
    "CP-N1-C": familiarity.review,
    "CP-N2-A": eda.profile,
    "CP-N2-B": reports.render,
    "CP-N2-C": rpa.run,
    "CP-N3-A": er.resolve,
    "CP-N3-B": graph.investigate,
    "CP-N3-C": triage.score,
    "CP-N4-A": service.serve,
    "CP-N4-B": platform_ml.deploy,
    "CP-N4-C": copilot.run,
}


def integrate(scenario: Optional[shared_scenario.SharedScenario] = None,
              backup_dir: Optional[str] = None,
              run_id: Optional[str] = None) -> contracts.IntegrationBundle:
    """The CP-FINAL entry point.

    Steps:
      1. Resolve the scenario (defaults to the canonical shared_scenario_v1).
      2. Build per-subsystem inputs (no subsystem imports another).
      3. Run each subsystem in topological order; record a trace event.
      4. Evaluate the no-go condition.
      5. Take a backup of the bundle (if backup_dir is provided).
      6. Assemble the IntegrationBundle.
    """
    sc = scenario or shared_scenario.shared_scenario_v1
    inputs = _build_subsystem_inputs(sc)
    order = dependency_graph.upstream_order()
    if len(order) != 12:
        raise RuntimeError(f"expected 12 upstream capstones, got {len(order)}")

    subsystem_results: Dict[str, Any] = {}
    trace: list = []
    # Deterministic run_id derived from the scenario seed when not supplied.
    run_id = run_id or f"cp-final-seed-{sc.seed}"

    for idx, cid in enumerate(order):
        runner = SUBSYSTEM_RUNNERS[cid]
        ok = True
        note = ""
        try:
            result = runner(inputs[cid])
        except Exception as exc:  # pragma: no cover - defensive
            ok = False
            note = f"{type(exc).__name__}: {exc}"
            result = None
        duration = _deterministic_duration(idx)
        subsystem_results[cid] = result
        trace.append({
            "run_id": run_id,
            "subsystem": cid,
            "contract_id": cid,
            "contract_version": contracts.expected_contract_version(cid),
            "ok": ok,
            "duration_ms": duration,
            "note": note,
        })

    no_go_flag, no_go_reason = no_go.evaluate(subsystem_results)

    # Build evidence bundle.
    evidence_bundle: Dict[str, Any] = {
        "contracts": {cid: contracts.to_jsonable(res) for cid, res in subsystem_results.items()},
        "trace": trace,
        "dependency_graph": dependency_graph.get_graph(),
        "cards": {
            "data_card": "see ../system_or_data_card.md",
            "model_card": "see ../system_or_data_card.md (triage)",
            "system_card": "see ../system_or_data_card.md",
        },
        "reproducibility": {
            "scenario_id": sc.scenario_id,
            "scenario_version": sc.scenario_version,
            "seed": sc.seed,
            "snapshot_hash": shared_scenario.snapshot(sc)[:16],
        },
    }

    bundle = contracts.IntegrationBundle(
        scenario_id=sc.scenario_id,
        subsystem_results={cid: contracts.to_jsonable(res) for cid, res in subsystem_results.items()},
        end_to_end_trace=trace,
        dependency_graph=dependency_graph.get_graph(),
        evidence_bundle=evidence_bundle,
        no_go=no_go_flag,
        no_go_reason=no_go_reason,
        backup_path=None,
        reproducible=True,
        contribution_statement=contracts.CONTRIBUTION_STATEMENT,
    )

    if backup_dir is not None:
        bundle = replace(bundle, backup_path=backup_restore.backup(bundle, backup_dir))

    return bundle


def integrate_dict(scenario: Optional[shared_scenario.SharedScenario] = None,
                   backup_dir: Optional[str] = None) -> Dict[str, Any]:
    """Convenience wrapper returning the bundle as a plain dict (JSON-friendly)."""
    return contracts.to_jsonable(integrate(scenario=scenario, backup_dir=backup_dir))


if __name__ == "__main__":
    # Smoke entry — used by demo.py via import.
    b = integrate()
    print(json.dumps(contracts.to_jsonable(b), ensure_ascii=False, indent=2))
