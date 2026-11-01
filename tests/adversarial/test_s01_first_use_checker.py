"""Adversarial controls for the S01 first-use audit, independent of its CLI status."""

import unittest

from scripts.s01_first_use_audit import audit_chunks, extract_string_literals_in_order


class S01FirstUseCheckerTest(unittest.TestCase):
    def test_actual_s01_passes_with_definitions_in_reading_order(self):
        report = audit_chunks(extract_string_literals_in_order())
        self.assertTrue(report["ok"], report["issues"])
        self.assertEqual(report["open_p0"], [])

    def test_missing_first_use_definition_is_a_failure(self):
        chunks = extract_string_literals_in_order()
        poisoned = [
            (loc, text.replace("Git es el sistema que conserva el historial de cambios.", "Git es magnífico."))
            if loc == "tagline" else (loc, text)
            for loc, text in chunks
        ]
        report = audit_chunks(poisoned)
        self.assertFalse(report["ok"])
        self.assertIn("git", [issue["term"] for issue in report["open_p1"]])

    def test_removing_core_theory_explanations_is_a_failure(self):
        chunks = extract_string_literals_in_order()
        poisoned = [(loc, "Contenido pendiente." if loc == "theory.paragraph" else text)
                    for loc, text in chunks]
        report = audit_chunks(poisoned)
        self.assertFalse(report["ok"])
        self.assertIn("day1_core_definitions", [i["term"] for i in report["open_p0"]])

    def test_untaught_stdout_reaching_wedo_is_a_failure(self):
        chunks = extract_string_literals_in_order()
        self.assertTrue(any(loc == "weDo.preamble" for loc, _ in chunks),
                        "We Do learner text must be within the auditor's coverage")
        # Remove the explanatory term in every earlier stage. The We Do
        # prompt is now a genuine first use and must receive a P1.
        poisoned = [(loc, text.replace("stdout", "salidaNormal"))
                    if not loc.startswith("weDo") else (loc, text)
                    for loc, text in chunks]
        report = audit_chunks(poisoned)
        self.assertFalse(report["ok"])
        self.assertIn("stdout", [i["term"] for i in report["open_p1"]])


if __name__ == "__main__":
    unittest.main()
