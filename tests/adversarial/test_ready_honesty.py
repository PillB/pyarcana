#!/usr/bin/env python3
"""Honesty / anti-fakery locks for the remaining READY blockers.

These tests do not invent production features. They require that:

- CP-FINAL docs name the implemented APIs and declare the 12 runners as
  in-process pedagogical twins (not imports of the twelve packages).
- GO-critical flags are fail-closed on empty contracts and computed from
  runner work on the live path.
- Provider spans export ``gen_ai.operation.name``.
- Learner-facing tour copy matches the public Autocheck and the filtered
  tour length (no hardcoded 17 steps; Autocheck is not a 3-attempt exam).
- Dynamic-only PdfReport certificate CSS is valid (no quoted property names).
- The three locales share the same legal disclaimer substance.

Run: python3 tests/adversarial/test_ready_honesty.py
"""
from __future__ import annotations

import re
import sys
import unittest
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
CAPSTONE_DIR = REPO_ROOT / "course-state" / "capstones" / "CP-FINAL"
N4C_DIR = REPO_ROOT / "course-state" / "capstones" / "CP-N4-C"
sys.path.insert(0, str(CAPSTONE_DIR))
sys.path.insert(0, str(N4C_DIR))

from integration import contracts, dependency_graph, no_go, platform, reports, service  # noqa: E402
from harness.otel_export import (  # noqa: E402
    GEN_AI_OPERATION_NAME,
    export_otlp_json,
    validate_otlp_export,
)
from harness.provider import Provider, ProviderConfig  # noqa: E402
from harness.tracing import Tracer  # noqa: E402


def _read(rel: str) -> str:
    return (REPO_ROOT / rel).read_text(encoding="utf-8")


def _attr_map(span: dict) -> dict:
    return {a["key"]: a["value"] for a in span.get("attributes", [])}


class TestFlagTheaterFailClosed(unittest.TestCase):
    def test_default_constructed_contracts_are_no_go(self):
        results = {
            cid: contracts.expected_contract_type(cid)()
            for cid in dependency_graph.UPSTREAM_CAPSTONES
        }
        flag, reason = no_go.evaluate(results)
        self.assertTrue(flag, "empty contracts must not be GO")
        self.assertTrue(reason)

    def test_live_integrate_go_uses_runner_work(self):
        bundle = platform.integrate()
        self.assertFalse(bundle.no_go, bundle.no_go_reason)
        intake = bundle.subsystem_results["CP-N1-A"]
        self.assertGreater(intake["n_total"], 0)
        self.assertEqual(
            intake["n_total"],
            intake["n_ok"] + intake["n_warn"] + intake["n_error"],
        )
        etl = bundle.subsystem_results["CP-N1-B"]
        self.assertTrue(etl["manifest_hash"])
        self.assertTrue(etl["idempotent"])
        deploy = bundle.subsystem_results["CP-N4-B"]
        self.assertTrue(deploy["rollback_proven"])

    def test_reports_hidden_denominators_computed(self):
        hidden = reports.render({
            "spec_id": "adv-hidden",
            "title": "Missing denom",
            "metrics": {"n_clients": 3},
            "denominators": {},
        })
        self.assertTrue(hidden.hidden_denominators)
        honest = reports.render({
            "spec_id": "adv-honest",
            "title": "Disclosed denom",
            "metrics": {"n_clients": 3},
            "denominators": {"n_clients": "scenario.clients"},
        })
        self.assertFalse(honest.hidden_denominators)

    def test_service_health_is_not_or_true(self):
        healthy = service.serve({"api_version": "v1", "user": "op", "payload": {"ok": True}})
        self.assertTrue(healthy.health_check_passed)
        empty = service.serve({"api_version": "v1", "user": "op"})
        self.assertFalse(empty.health_check_passed)


class TestDualTruthDocs(unittest.TestCase):
    def test_ido_has_implemented_api_map(self):
        ido = _read("course-state/capstones/CP-FINAL/IDO.md")
        self.assertIn("Implemented API map", ido)
        self.assertIn("no_go.py::evaluate", ido)
        self.assertIn("Tuple[bool, str]", ido)
        self.assertIn("backup_restore.backup", ido)
        self.assertIn("rollback.py::demonstrate_rollback", ido)

    def test_security_has_implemented_api_map(self):
        sec = _read("course-state/capstones/CP-FINAL/SECURITY.md")
        self.assertIn("Implemented API map", sec)
        self.assertIn("Tuple[bool, str]", sec)
        self.assertIn("JSON files", sec)

    def test_system_card_declares_in_process_twins(self):
        card = _read("course-state/capstones/CP-FINAL/SYSTEM_CARD.md")
        self.assertRegex(card, r"in-process pedagogical twins|gemelos pedagógicos in-process", re.I)
        self.assertRegex(card, r"do\s+\**not\**\s+import the twelve|no importan los doce", re.I)
        self.assertIn("Implemented API map", card)

    def test_final_interface_declares_twins(self):
        iface = _read("course-state/capstones/CP-FINAL/FINAL_INTERFACE.md")
        self.assertRegex(iface, r"in-process pedagogical twins|gemelos pedagógicos", re.I)


class TestProviderGenAIOperation(unittest.TestCase):
    def test_provider_complete_exports_operation_name(self):
        tracer = Tracer()
        Provider(ProviderConfig(mode="LOCAL"), tracer=tracer).complete(
            "how to rollback a failed model gate",
            system="plan",
            max_tokens=64,
        )
        env = export_otlp_json(tracer)
        self.assertEqual(validate_otlp_export(env), [])
        exported = next(
            s
            for scope in env["resourceSpans"][0]["scopeSpans"]
            for s in scope["spans"]
            if s["name"] == "provider.call"
        )
        keys = set(_attr_map(exported))
        self.assertIn(GEN_AI_OPERATION_NAME, keys)


class TestLearnerCopyHonesty(unittest.TestCase):
    def test_tour_welcome_does_not_hardcode_seventeen(self):
        i18n = _read("src/lib/i18n.ts")
        self.assertNotIn("17 pasos", i18n)
        self.assertNotIn("17-step", i18n)
        self.assertIn("tour.welcome.body", i18n)

    def test_tour_autocheck_does_not_claim_three_attempts(self):
        i18n = _read("src/lib/i18n.ts")
        for locale_blob in re.findall(
            r"'tour.autocheck.body':\s*'([^']*)'",
            i18n,
        ):
            self.assertNotRegex(locale_blob, r"3 intentos|3 attempts")

    def test_quiztab_has_retry_without_cap(self):
        view = _read("src/components/course/SectionView.tsx")
        self.assertIn("function QuizTab", view)
        self.assertIn("handleRetry", view)
        self.assertIn("vuelve a intentarlo", view)
        self.assertNotRegex(
            view[view.index("function QuizTab"): view.index("function QuizTab") + 4000],
            r"maxAttempts|MAX_ATTEMPTS|intentos máximo",
        )

    def test_disclaimers_share_legal_substance(self):
        i18n = _read("src/lib/i18n.ts")
        values = re.findall(r"'capstones.disclaimer':\s*'([^']*)'", i18n)
        self.assertEqual(len(values), 3, values)
        joined = " | ".join(values).lower()
        self.assertIn("curricular", joined)
        self.assertTrue(
            "certificación" in joined or "certification" in joined,
            "every locale must deny professional certification",
        )
        self.assertTrue(
            "licencia" in joined or "license" in joined,
        )


class TestPdfReportCss(unittest.TestCase):
    def test_certificate_css_has_no_quoted_property_names(self):
        pdf = _read("src/components/course/PdfReport.tsx")
        start = pdf.index("function generateCertificateHTML")
        style = pdf[start:]
        style = style[style.index("<style>"): style.index("</style>")]
        quoted = re.findall(r'"[a-z-]+"\s*:', style)
        self.assertEqual(quoted, [], f"quoted CSS properties: {quoted}")
        self.assertIn("border-radius:", style)
        self.assertIn("no una certificación profesional", pdf)


if __name__ == "__main__":
    unittest.main()
