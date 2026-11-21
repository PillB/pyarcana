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

    # The level-1 subsystems call the interface each CP-N1 package publishes, on the scenario
    # translated by the platform into that package's shape. The expected values were counted by
    # hand from shared_scenario.N1_PROFILE and the CP-N1 briefs.

    def n1_input(self, cid):
        from .platform import _build_subsystem_inputs
        return _build_subsystem_inputs(self.scenario)[cid]

    def test_intake_contract(self):
        r = intake.run(self.n1_input("CP-N1-A"))
        self.assertIsInstance(r, contracts.IntakeResult)
        self.assertEqual(r.contract_id, "CP-N1-A")
        self.assertEqual(r.contract_version, "3.0.0")
        # 10 clients: a minor and a lower-case region go to review; age 150 and the malformed row
        # (no age, no region, amount -5) are rejected.
        self.assertEqual((r.n_total, r.n_accept, r.n_review, r.n_reject), (10, 6, 2, 2))
        self.assertEqual(r.n_total, r.n_accept + r.n_review + r.n_reject)
        self.assertEqual(r.tasa_reject, 0.2)
        self.assertEqual(r.results[8]["motivos"],
                         ["edad:MISSING", "region:MISSING", "monto_ingreso:OUT_OF_RANGE"])
        self.assertTrue(r.malformed_handled)

    def test_intake_empty_batch_has_no_rate(self):
        self.assertIsNone(intake.run([]).tasa_reject)

    def test_etl_contract(self):
        m = etl.run(self.n1_input("CP-N1-B"))
        self.assertIsInstance(m, contracts.EtlManifest)
        self.assertEqual(m.contract_id, "CP-N1-B")
        self.assertEqual(m.contract_version, "3.0.0")
        self.assertEqual(m.exit_code, 0)
        # 10 clients + 12 transactions in; only the client with no id and no name is quarantined.
        self.assertEqual((m.n_in, m.n_clean, m.n_quarantine), (22, 21, 1))
        self.assertTrue(m.reconcile_ok)
        self.assertEqual([q["reason"] for q in m.quarantine["clients.csv"]], ["missing_key"])
        self.assertEqual(m.quarantine["transactions.json"], [])
        self.assertTrue(all(len(s["sha256"]) == 64 for s in m.sources))
        self.assertTrue(all(isinstance(t["monto"], str) for t in m.clean["transactions.json"]))
        self.assertTrue(m.idempotent)

    def test_etl_idempotent(self):
        b = self.n1_input("CP-N1-B")
        a, b2 = etl.run(b), etl.run(b)
        self.assertEqual((a.clean, a.quarantine, a.sources), (b2.clean, b2.quarantine, b2.sources))

    def test_familiarity_contract(self):
        pkt = familiarity.review(self.n1_input("CP-N1-C"))
        self.assertIsInstance(pkt, contracts.ReviewPacket)
        self.assertEqual(pkt.contract_id, "CP-N1-C")
        self.assertEqual(pkt.contract_version, "3.0.0")
        self.assertEqual(len(pkt.decisions), 36)  # 9 clients with an id: 9·8/2 pairs
        self.assertEqual(pkt.risk_decisions, [])
        self.assertTrue(all(r["kinship_verdict"] is None for r in pkt.relationship_evidence))
        # Same document in two forms, other name → ER 0.5; office switchboard → REL 0.8, high.
        self.assertEqual([q["pair_id"] for q in pkt.review_queue],
                         ["SYN-CLI-003-SYN-CLI-004", "SYN-CLI-001-SYN-CLI-008"])
        self.assertEqual(pkt.review_queue[0]["a"], "C*** S***")
        self.assertTrue(pkt.human_review_required)
        self.assertTrue(pkt.correction_mechanism)
        self.assertEqual(sorted(pkt.privacy_sheet),
                         ["data_class", "egress_public_geocoder", "pii_real", "roles"])

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
