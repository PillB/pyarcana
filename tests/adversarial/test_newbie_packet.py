#!/usr/bin/env python3
"""Adversarial tests for newbie packet builder — knowledge isolation & parsers."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import (  # noqa: E402
    active_manifest,
    active_section_files,
    build_packet,
    build_validator_audit,
    extract_string_array,
    extract_string_field,
    parse_section_learner,
)


class TestStringArrayParser(unittest.TestCase):
    def test_nested_quotes_in_options(self):
        obj = r"""
        {
          options: ['True', 'False', '""', '"default"'],
        }
        """
        opts = extract_string_array(obj, "options")
        self.assertEqual(opts, ["True", "False", '""', '"default"'])

    def test_empty_array(self):
        self.assertEqual(extract_string_array("{ options: [] }", "options"), [])

    def test_missing_field(self):
        self.assertEqual(extract_string_array("{ foo: 1 }", "options"), [])


class TestPacketIsolation(unittest.TestCase):
    def test_section1_has_no_solution_keys(self):
        pkt = build_packet(1, attempt_id="adv")
        blob = str(pkt)
        # solutions stripped from exercises
        for ex in (pkt["active"].get("weDo") or {}).get("exercises") or []:
            self.assertNotIn("solutionCode", ex)
        for sc in pkt["active"].get("selfCheck_stems") or []:
            self.assertNotIn("correctIndex", sc)
            self.assertNotIn("explanation", sc)
        self.assertIn("forbidden", pkt)
        self.assertGreater(len((pkt["active"].get("theory") or [])), 0)

    def test_learner_export_excludes_validator_and_internal_fields(self):
        packet = build_packet(13, attempt_id="isolation")

        def keys(value):
            if isinstance(value, dict):
                for key, nested in value.items():
                    yield key
                    yield from keys(nested)
            elif isinstance(value, list):
                for nested in value:
                    yield from keys(nested)

        exported_keys = set(keys(packet))
        self.assertTrue(
            {
                "heuristic_gaps",
                "active_manifest",
                "cumulative_taught_text",
                "_taught_text",
            }.isdisjoint(exported_keys)
        )
        self.assertEqual(
            set(packet),
            {
                "attempt_id",
                "section_index",
                "landing",
                "prior_sections",
                "active",
                "forbidden",
                "packet_sha",
            },
        )

    def test_landing_snapshot_is_parsed_from_current_visible_copy(self):
        landing = build_packet(1)["landing"]
        dashboard = (ROOT / "src/components/course/Dashboard.tsx").read_text(
            encoding="utf-8"
        )
        page = (ROOT / "src/app/page.tsx").read_text(encoding="utf-8")
        self.assertEqual(landing["brand"], "PyArcana")
        self.assertIn(landing["hero_badge"], dashboard)
        self.assertIn(landing["brand_tagline"], dashboard)
        self.assertIn("Edición pública / Public edition", landing["public_edition_notice"])
        language_claim = landing["language_truth"]["interface_and_lessons_claim"]
        self.assertIn("English", language_claim)
        self.assertIn("lecciones en español peruano", language_claim)
        self.assertIn("interfaz es-PE, es-ES y English", page)
        self.assertEqual(len(landing["method_cards"]), 4)

    def test_section_index_bounds(self):
        with self.assertRaises(ValueError):
            build_packet(0)
        with self.assertRaises(ValueError):
            build_packet(99)

    def test_packet_sha_stable_for_same_section(self):
        a = build_packet(2, attempt_id="x")
        b = build_packet(2, attempt_id="y")
        self.assertEqual(a["packet_sha"], b["packet_sha"])

    def test_prior_sections_grow(self):
        p1 = build_packet(1)
        p5 = build_packet(5)
        self.assertEqual(len(p1["prior_sections"]), 0)
        self.assertEqual(len(p5["prior_sections"]), 4)

    def test_active_contract_is_exact_and_unique_for_every_section(self):
        for path in active_section_files():
            section = parse_section_learner(path)
            manifest = active_manifest(section)
            with self.subTest(section=section["index"]):
                self.assertEqual(len(manifest["theory_tags"]), 8)
                self.assertEqual(len(set(manifest["theory_tags"])), 8)
                self.assertEqual(len(manifest["demo_tags"]), 8)
                self.assertEqual(len(set(manifest["demo_tags"])), 8)
                self.assertEqual(len(manifest["exercise_ids"]), 24)
                self.assertEqual(len(set(manifest["exercise_ids"])), 24)
                self.assertEqual(
                    manifest["theory_tags"], manifest["demo_subtopic_tags"]
                )

    def test_active_manifest_does_not_export_prior_content(self):
        manifest = build_validator_audit(13, attempt_id="manifest")["active_manifest"]
        blob = str(manifest)
        self.assertNotIn("prior_sections", manifest)
        self.assertNotIn("solutionCode", blob)
        self.assertNotIn("correctIndex", blob)
        self.assertEqual(manifest["index"], 13)


class TestExtractStringField(unittest.TestCase):
    def test_single_and_double_quotes(self):
        self.assertEqual(extract_string_field("{ title: 'Hi' }", "title"), "Hi")
        self.assertEqual(extract_string_field('{ title: "Ho" }', "title"), "Ho")


if __name__ == "__main__":
    unittest.main()
