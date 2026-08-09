"""CP-FINAL — versioned contracts for the 12 upstream capstone interfaces.

Every contract is a frozen dataclass with:
- contract_id  : the upstream capstone ID (e.g. "CP-N1-A")
- contract_version : the capstone's package version (e.g. "2.0.0")
- payload fields documenting the contractually-returned data.

Subsystems return *their* declared contract type from `contracts.py`.
CP-FINAL itself owns the IntegrationBundle (the platform contract).

Stdlib only. No PII. No network. Deterministic.
"""
from __future__ import annotations

from dataclasses import dataclass, field, asdict
from typing import Any, Dict, List, Optional


PACKAGE_VERSION = "2.0.0"
CONTRACT_REGISTRY_VERSION = "1.0.0"


# --- helpers ---------------------------------------------------------------

def _to_dict(obj: Any) -> Any:
    """Best-effort JSON-friendly conversion of a contract object."""
    if hasattr(obj, "__dataclass_fields__"):
        return {k: _to_dict(v) for k, v in asdict(obj).items()}
    if isinstance(obj, list):
        return [_to_dict(x) for x in obj]
    if isinstance(obj, dict):
        return {k: _to_dict(v) for k, v in obj.items()}
    return obj


def to_jsonable(obj: Any) -> Any:
    return _to_dict(obj)


# --- N1 contracts ----------------------------------------------------------

@dataclass(frozen=True)
class IntakeResult:
    """CP-N1-A — intake_cli.run(records) -> IntakeResult"""
    contract_id: str = "CP-N1-A"
    contract_version: str = "2.0.0"
    n_total: int = 0
    n_ok: int = 0
    n_warn: int = 0
    n_error: int = 0
    rows: List[Dict[str, Any]] = field(default_factory=list)
    malformed_handled: bool = True  # criticalFailure: must handle malformed input


@dataclass(frozen=True)
class EtlManifest:
    """CP-N1-B — etl.run(batch) -> EtlManifest"""
    contract_id: str = "CP-N1-B"
    contract_version: str = "2.0.0"
    batch_id: str = ""
    accepted: List[Dict[str, Any]] = field(default_factory=list)
    quarantine: List[Dict[str, Any]] = field(default_factory=list)
    idempotent: bool = True           # criticalFailure: must be idempotent
    provenance: Dict[str, str] = field(default_factory=dict)
    manifest_hash: str = ""


@dataclass(frozen=True)
class ReviewPacket:
    """CP-N1-C — familiarity.review(case) -> ReviewPacket"""
    contract_id: str = "CP-N1-C"
    contract_version: str = "2.0.0"
    case_id: str = ""
    entity_evidence: List[Dict[str, Any]] = field(default_factory=list)
    relationship_evidence: List[Dict[str, Any]] = field(default_factory=list)
    decision_evidence: List[Dict[str, Any]] = field(default_factory=list)
    human_review_required: bool = True  # criticalFailure: no auto fraud inference
    privacy_sheet: Dict[str, str] = field(default_factory=dict)
    correction_mechanism: bool = True


# --- N2 contracts ----------------------------------------------------------

@dataclass(frozen=True)
class EdaReport:
    """CP-N2-A — eda.profile(dataset) -> EdaReport"""
    contract_id: str = "CP-N2-A"
    contract_version: str = "2.0.0"
    dataset_version: str = ""
    n_rows: int = 0
    n_cols: int = 0
    missingness: Dict[str, float] = field(default_factory=dict)
    profile: Dict[str, Any] = field(default_factory=dict)
    reproducible: bool = True          # criticalFailure: must be reproducible
    executive_memo: str = ""
    limitations: List[str] = field(default_factory=list)


@dataclass(frozen=True)
class ReportBundle:
    """CP-N2-B — reports.render(spec) -> ReportBundle"""
    contract_id: str = "CP-N2-B"
    contract_version: str = "2.0.0"
    spec_id: str = ""
    sections: List[Dict[str, Any]] = field(default_factory=list)
    claims_with_sources: List[Dict[str, Any]] = field(default_factory=list)
    accessible: bool = True
    color_only_encoding: bool = False  # criticalFailure: not color-only
    hidden_denominators: bool = False  # criticalFailure: no hidden denominators


@dataclass(frozen=True)
class RpaAudit:
    """CP-N2-C — rpa.run(job) -> RpaAudit"""
    contract_id: str = "CP-N2-C"
    contract_version: str = "2.0.0"
    job_id: str = ""
    steps: List[Dict[str, Any]] = field(default_factory=list)
    approved: bool = False
    idempotent: bool = True
    rollback_available: bool = True
    logs_pii_free: bool = True         # criticalFailure: no PII in logs


# --- N3 contracts ----------------------------------------------------------

@dataclass(frozen=True)
class ClusterSet:
    """CP-N3-A — er.resolve(records) -> ClusterSet"""
    contract_id: str = "CP-N3-A"
    contract_version: str = "2.0.0"
    clusters: List[Dict[str, Any]] = field(default_factory=list)
    train_dev_test_split: bool = True  # criticalFailure: must split
    baseline_deterministic: bool = True
    fp_analysis: Dict[str, Any] = field(default_factory=dict)
    inferred_relationships: bool = False  # criticalFailure: NO auto inference


@dataclass(frozen=True)
class GraphCase:
    """CP-N3-B — graph.investigate(query) -> GraphCase"""
    contract_id: str = "CP-N3-B"
    contract_version: str = "2.0.0"
    case_id: str = ""
    nodes: List[Dict[str, Any]] = field(default_factory=list)
    edges: List[Dict[str, Any]] = field(default_factory=list)
    direct_vs_inferred_distinguished: bool = True
    authorization_enforced: bool = True
    reproducible: bool = True
    auto_fraud_labels: bool = False    # criticalFailure: NO auto fraud labels


@dataclass(frozen=True)
class TriageDecision:
    """CP-N3-C — triage.score(case) -> TriageDecision"""
    contract_id: str = "CP-N3-C"
    contract_version: str = "2.0.0"
    case_id: str = ""
    score: float = 0.0
    calibrated: bool = True
    abstained: bool = False            # criticalFailure: must support abstention
    threshold: float = 0.5
    human_review_required: bool = True
    data_leakage_prevented: bool = True


# --- N4 contracts ----------------------------------------------------------

@dataclass(frozen=True)
class ApiResponse:
    """CP-N4-A — service.serve(request) -> ApiResponse"""
    contract_id: str = "CP-N4-A"
    contract_version: str = "2.0.0"
    api_version: str = "v1"
    status_code: int = 200
    body: Dict[str, Any] = field(default_factory=dict)
    health_check_passed: bool = True
    migrations_applied: List[str] = field(default_factory=list)
    secrets_embedded: bool = False     # criticalFailure: NO embedded secrets


@dataclass(frozen=True)
class DeployRecord:
    """CP-N4-B — platform.deploy(model) -> DeployRecord"""
    contract_id: str = "CP-N4-B"
    contract_version: str = "2.0.0"
    model_name: str = ""
    model_version: str = ""
    lineage: List[Dict[str, Any]] = field(default_factory=list)
    approval: Dict[str, Any] = field(default_factory=dict)
    canary_result: Dict[str, Any] = field(default_factory=dict)
    slo: Dict[str, Any] = field(default_factory=dict)
    rollback_available: bool = True
    rollback_proven: bool = True        # criticalFailure: rollback must be proven
    train_serve_consistent: bool = True


@dataclass(frozen=True)
class CopilotRunRecord:
    """CP-N4-C — copilot.run(task) -> CopilotRunRecord"""
    contract_id: str = "CP-N4-C"
    contract_version: str = "3.0.0"
    task_id: str = ""
    steps_bounded: bool = True         # criticalFailure: no unbounded loops
    max_steps: int = 8
    steps_taken: int = 0
    rag_cited: bool = True
    access_control_enforced: bool = True
    hitl_on_sensitive_effects: bool = True
    traces_redacted: bool = True       # criticalFailure: redact traces
    rollback_available: bool = True
    audit: List[Dict[str, Any]] = field(default_factory=list)


# --- Platform contract -----------------------------------------------------

@dataclass(frozen=True)
class E2ETraceEvent:
    subsystem: str
    contract_id: str
    contract_version: str
    ok: bool
    duration_ms: float = 0.0
    note: str = ""


@dataclass(frozen=True)
class EvidenceBundle:
    contracts: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    trace: List[Dict[str, Any]] = field(default_factory=list)
    dependency_graph: Dict[str, Any] = field(default_factory=dict)
    cards: Dict[str, str] = field(default_factory=dict)
    reproducibility: Dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class IntegrationBundle:
    """CP-FINAL — platform.integrate(scenario) -> IntegrationBundle"""
    contract_id: str = "CP-FINAL"
    contract_version: str = PACKAGE_VERSION
    scenario_id: str = ""
    subsystem_results: Dict[str, Dict[str, Any]] = field(default_factory=dict)
    end_to_end_trace: List[Dict[str, Any]] = field(default_factory=list)
    dependency_graph: Dict[str, Any] = field(default_factory=dict)
    evidence_bundle: Dict[str, Any] = field(default_factory=dict)
    no_go: bool = False
    no_go_reason: str = ""
    backup_path: Optional[str] = None
    reproducible: bool = True


# --- registry --------------------------------------------------------------

#: Maps each upstream capstone id -> (contract dataclass, factory callable name).
CONTRACT_REGISTRY: Dict[str, Dict[str, Any]] = {
    "CP-N1-A": {"type": IntakeResult, "version": "2.0.0"},
    "CP-N1-B": {"type": EtlManifest, "version": "2.0.0"},
    "CP-N1-C": {"type": ReviewPacket, "version": "2.0.0"},
    "CP-N2-A": {"type": EdaReport, "version": "2.0.0"},
    "CP-N2-B": {"type": ReportBundle, "version": "2.0.0"},
    "CP-N2-C": {"type": RpaAudit, "version": "2.0.0"},
    "CP-N3-A": {"type": ClusterSet, "version": "2.0.0"},
    "CP-N3-B": {"type": GraphCase, "version": "2.0.0"},
    "CP-N3-C": {"type": TriageDecision, "version": "2.0.0"},
    "CP-N4-A": {"type": ApiResponse, "version": "2.0.0"},
    "CP-N4-B": {"type": DeployRecord, "version": "2.0.0"},
    "CP-N4-C": {"type": CopilotRunRecord, "version": "3.0.0"},
}


def expected_contract_type(capstone_id: str):
    entry = CONTRACT_REGISTRY.get(capstone_id)
    if entry is None:
        raise KeyError(f"Unknown contract: {capstone_id}")
    return entry["type"]


def expected_contract_version(capstone_id: str) -> str:
    return CONTRACT_REGISTRY[capstone_id]["version"]
