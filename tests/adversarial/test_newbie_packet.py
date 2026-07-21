#!/usr/bin/env python3
"""Adversarial tests for newbie packet builder — knowledge isolation & parsers."""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import (  # noqa: E402
    build_packet,
    extract_string_array,
    extract_string_field,
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


class TestExtractStringField(unittest.TestCase):
    def test_single_and_double_quotes(self):
        self.assertEqual(extract_string_field("{ title: 'Hi' }", "title"), "Hi")
        self.assertEqual(extract_string_field('{ title: "Ho" }', "title"), "Ho")


if __name__ == "__main__":
    unittest.main()
