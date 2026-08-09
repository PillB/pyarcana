"""CP-FINAL — contract tests asserting each of the 12 subsystems honors its
declared interface signature and returns a well-formed contract object.

Run: python3 -m unittest integration.contract_tests -v
"""
from __future__ import annotations

import unittest

from . import contracts
from . import (
    intake, etl, familiarity, eda, reports, rpa,
    er, graph, triage, service, platform_ml, copilot,
)
from .shared_scenario import shared_scenario_v1


class ContractTests(unittest.TestCase):
    """Each subsystem is exercised against the shared scenario and must:
      - return the type declared in the contract registry
      - carry the correct `contract_id` and `contract_version`
      - honor its criticalFailures (negative flags where applicable)
    """

    def setUp(self):
        self.scenario = shared_scenario_v1

    # -- N1 ----------------------------------------------------------------

    def test_intake_contract(self):
        r = intake.run(self.scenario.clients)
        self.assertIsInstance(r, contracts.IntakeResult)
        self.assertEqual(r.contract_id, "CP-N1-A")
        self.assertEqual(r.contract_version, "2.0.0")
        self.assertEqual(r.n_total, r.n_ok + r.n_warn + r.n_error)
        self.assertTrue(r.malformed_handled)

    def test_etl_contract(self):
        m = etl.run({"batch_id": "syn-batch-001", "records": self.scenario.clients})
        self.assertIsInstance(m, contracts.EtlManifest)
        self.assertEqual(m.contract_id, "CP-N1-B")
        self.assertEqual(m.contract_version, "2.0.0")
        self.assertTrue(m.idempotent)
        self.assertTrue(m.manifest_hash)
        self.assertIn("source", m.provenance)

    def test_etl_idempotent(self):
        b = {"batch_id": "syn-batch-002", "records": self.scenario.clients}
        a = etl.run(b)
        b2 = etl.run(b)
        self.assertEqual(a.manifest_hash, b2.manifest_hash)

    def test_familiarity_contract(self):
        pkt = familiarity.review(self.scenario.cases[0])
        self.assertIsInstance(pkt, contracts.ReviewPacket)
        self.assertEqual(pkt.contract_id, "CP-N1-C")
        self.assertEqual(pkt.contract_version, "2.0.0")
        self.assertTrue(pkt.human_review_required)  # NO auto fraud inference
        self.assertTrue(pkt.correction_mechanism)
        self.assertIn("no_pii", pkt.privacy_sheet)

    # -- N2 ----------------------------------------------------------------

    def test_eda_contract(self):
        rep = eda.profile({"dataset_version": "v1", "records": self.scenario.clients})
        self.assertIsInstance(rep, contracts.EdaReport)
        self.assertEqual(rep.contract_id, "CP-N2-A")
        self.assertEqual(rep.contract_version, "2.0.0")
        self.assertTrue(rep.reproducible)
        self.assertTrue(rep.executive_memo)
        self.assertTrue(rep.limitations)

    def test_reports_contract(self):
        bundle = reports.render({
            "spec_id": "syn-spec-001",
            "title": "Synthetic Operations Report",
            "metrics": {"acceptance_rate": 0.7},
            "denominators": {"acceptance_rate": "n_total"},
        })
        self.assertIsInstance(bundle, contracts.ReportBundle)
        self.assertEqual(bundle.contract_id, "CP-N2-B")
        self.assertEqual(bundle.contract_version, "2.0.0")
        self.assertFalse(bundle.color_only_encoding)
        self.assertFalse(bundle.hidden_denominators)

    def test_rpa_contract(self):
        audit = rpa.run({
            "job_id": "syn-rpa-001",
            "steps": [{"action": "send_email"}, {"action": "noop"}],
            "human_approved": False,
        })
        self.assertIsInstance(audit, contracts.RpaAudit)
        self.assertEqual(audit.contract_id, "CP-N2-C")
        self.assertEqual(audit.contract_version, "2.0.0")
        self.assertTrue(audit.idempotent)
        self.assertTrue(audit.rollback_available)
        self.assertTrue(audit.logs_pii_free)
        # External send must be pending approval.
        self.assertFalse(audit.steps[0]["executed"])

    # -- N3 ----------------------------------------------------------------

    def test_er_contract(self):
        cs = er.resolve(self.scenario.clients)
        self.assertIsInstance(cs, contracts.ClusterSet)
        self.assertEqual(cs.contract_id, "CP-N3-A")
        self.assertEqual(cs.contract_version, "2.0.0")
        self.assertFalse(cs.inferred_relationships)  # NO auto inference
        self.assertTrue(cs.train_dev_test_split)
        self.assertTrue(cs.baseline_deterministic)

    def test_graph_contract(self):
        gc = graph.investigate({
            "case_id": "syn-graph-001",
            "viewer": "synthetic_analyst",
            "authorized": True,
            "nodes": [{"id": "E-001", "kind": "entity"}],
            "edges": [{"src": "E-001", "dst": "E-002", "link_type": "direct"}],
        })
        self.assertIsInstance(gc, contracts.GraphCase)
        self.assertEqual(gc.contract_id, "CP-N3-B")
        self.assertEqual(gc.contract_version, "2.0.0")
        self.assertFalse(gc.auto_fraud_labels)  # NO auto fraud labels
        self.assertTrue(gc.direct_vs_inferred_distinguished)
        self.assertTrue(gc.authorization_enforced)

    def test_triage_contract(self):
        d = triage.score(self.scenario.cases[0])
        self.assertIsInstance(d, contracts.TriageDecision)
        self.assertEqual(d.contract_id, "CP-N3-C")
        self.assertEqual(d.contract_version, "2.0.0")
        self.assertTrue(d.human_review_required)
        self.assertTrue(d.data_leakage_prevented)
        # Abstention path: case with no signals must abstain.
        abst = triage.score({"case_id": "x", "signals": [], "amount_sum": 0})
        self.assertTrue(abst.abstained)

    # -- N4 ----------------------------------------------------------------

    def test_service_contract(self):
        r = service.serve({"api_version": "v1", "user": "synthetic_operator", "payload": {}})
        self.assertIsInstance(r, contracts.ApiResponse)
        self.assertEqual(r.contract_id, "CP-N4-A")
        self.assertEqual(r.contract_version, "2.0.0")
        self.assertFalse(r.secrets_embedded)
        self.assertTrue(r.health_check_passed)
        self.assertTrue(r.migrations_applied)
        self.assertFalse(r.body.get("is_root"))

    def test_platform_ml_contract(self):
        rec = platform_ml.deploy({
            "name": "syn-triage",
            "version": "1.0.0",
            "accuracy": 0.55,  # below gate -> canary fails -> rollback proven
            "approval": {"approved": True, "approver": "synthetic_reviewer"},
        })
        self.assertIsInstance(rec, contracts.DeployRecord)
        self.assertEqual(rec.contract_id, "CP-N4-B")
        self.assertEqual(rec.contract_version, "2.0.0")
        self.assertTrue(rec.rollback_available)
        self.assertTrue(rec.rollback_proven)  # canary failed -> rollback triggered
        self.assertTrue(rec.train_serve_consistent)

    def test_copilot_contract(self):
        rec = copilot.run({
            "task_id": "syn-copilot-001",
            "viewer": "synthetic_analyst",
            "authorized": True,
            "query": "rollback model",
            "actions": [{"name": "search_docs"}, {"name": "send_email", "human_approved": False}],
        })
        self.assertIsInstance(rec, contracts.CopilotRunRecord)
        self.assertEqual(rec.contract_id, "CP-N4-C")
        self.assertEqual(rec.contract_version, "3.0.0")
        self.assertTrue(rec.steps_bounded)
        self.assertTrue(rec.rag_cited)
        self.assertTrue(rec.hitl_on_sensitive_effects)
        self.assertTrue(rec.traces_redacted)
        self.assertTrue(rec.rollback_available)
        self.assertLessEqual(rec.steps_taken, rec.max_steps)


if __name__ == "__main__":
    unittest.main(verbosity=2)
