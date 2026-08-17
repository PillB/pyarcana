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

# Bounded synthetic/pedagogical contribution statement from BRIEF.md.
# Serialized through backup/restore; not a production-impact claim.
CONTRIBUTION_STATEMENT = (
    "Este paquete es trabajo pedagógico individual. El estudiante integra, "
    "documenta y prueba la plataforma; no reclama autoría sobre código de "
    "terceros ni sobre los capstones previos más allá de su propia "
    "implementación de los subsistemas acotados."
)


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
    malformed_handled: bool = False  # fail-closed until the runner handles rows


@dataclass(frozen=True)
class EtlManifest:
    """CP-N1-B — etl.run(batch) -> EtlManifest"""
    contract_id: str = "CP-N1-B"
    contract_version: str = "2.0.0"
    batch_id: str = ""
    accepted: List[Dict[str, Any]] = field(default_factory=list)
    quarantine: List[Dict[str, Any]] = field(default_factory=list)
    idempotent: bool = False          # fail-closed until two runs match
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
    human_review_required: bool = False  # fail-closed until review is required
    privacy_sheet: Dict[str, str] = field(default_factory=dict)
    correction_mechanism: bool = False


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
    reproducible: bool = False         # fail-closed until two runs match
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
    accessible: bool = False
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
    idempotent: bool = False
    rollback_available: bool = False
    logs_pii_free: bool = False        # fail-closed until logs are scanned


# --- N3 contracts ----------------------------------------------------------

@dataclass(frozen=True)
class ClusterSet:
    """CP-N3-A — er.resolve(records) -> ClusterSet"""
    contract_id: str = "CP-N3-A"
    contract_version: str = "2.0.0"
    clusters: List[Dict[str, Any]] = field(default_factory=list)
    train_dev_test_split: bool = False  # fail-closed until a split is applied
    baseline_deterministic: bool = False
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
    direct_vs_inferred_distinguished: bool = False
    authorization_enforced: bool = False
    reproducible: bool = False
    auto_fraud_labels: bool = False    # criticalFailure: NO auto fraud labels


@dataclass(frozen=True)
class TriageDecision:
    """CP-N3-C — triage.score(case) -> TriageDecision"""
    contract_id: str = "CP-N3-C"
    contract_version: str = "2.0.0"
    case_id: str = ""
    score: float = 0.0
    calibrated: bool = False
    abstained: bool = False            # criticalFailure: must support abstention
    threshold: float = 0.5
    human_review_required: bool = False
    data_leakage_prevented: bool = False


# --- N4 contracts ----------------------------------------------------------

@dataclass(frozen=True)
class ApiResponse:
    """CP-N4-A — service.serve(request) -> ApiResponse"""
    contract_id: str = "CP-N4-A"
    contract_version: str = "2.0.0"
    api_version: str = "v1"
    status_code: int = 200
    body: Dict[str, Any] = field(default_factory=dict)
    health_check_passed: bool = False
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
    rollback_available: bool = False
    rollback_proven: bool = False       # fail-closed until a rollback proof runs
    train_serve_consistent: bool = False


@dataclass(frozen=True)
class CopilotRunRecord:
    """CP-N4-C — copilot.run(task) -> CopilotRunRecord"""
    contract_id: str = "CP-N4-C"
    contract_version: str = "3.0.0"
    task_id: str = ""
    steps_bounded: bool = False        # fail-closed until the loop is bounded
    max_steps: int = 8
    steps_taken: int = 0
    rag_cited: bool = False
    access_control_enforced: bool = False
    hitl_on_sensitive_effects: bool = False
    traces_redacted: bool = False      # fail-closed until traces are marked redacted
    rollback_available: bool = False
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
    contribution_statement: str = ""


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
