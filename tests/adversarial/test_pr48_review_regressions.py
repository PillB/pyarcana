#!/usr/bin/env python3
"""Regression tests for the two unresolved review findings on PR #48."""
from __future__ import annotations

import re
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src/lib/course/sections"
INDEX = ROOT / "src/lib/course/index.ts"
sys.path.insert(0, str(ROOT / "scripts"))

import unexplained_reference_audit as unexplained  # noqa: E402


HOUR_WORDS = {
    "uno": 1,
    "una": 1,
    "dos": 2,
    "tres": 3,
    "cuatro": 4,
    "cinco": 5,
    "seis": 6,
    "siete": 7,
    "ocho": 8,
    "nueve": 9,
    "diez": 10,
    "once": 11,
    "doce": 12,
    "trece": 13,
    "catorce": 14,
    "quince": 15,
    "dieciseis": 16,
    "dieciséis": 16,
    "diecisiete": 17,
    "dieciocho": 18,
    "diecinueve": 19,
    "veinte": 20,
    "veintiuno": 21,
    "veintinueve": 29,
    "ochenta": 80,
}


def active_sections() -> list[Path]:
    index = INDEX.read_text(encoding="utf-8")
    stems = re.findall(r"from ['\"]\./sections/([^'\"]+)['\"]", index)
    return [SECTIONS / f"{stem}.ts" for stem in stems]


def hour_value(token: str) -> int | None:
    token = token.lower().strip()
    if token.isdigit():
        return int(token)
    return HOUR_WORDS.get(token)


def pacing_total(line: str) -> int | None:
    """Extract the learner-facing total from a pacing sentence when it has one."""
    low = line.lower()
    if "ritmo" not in low and "plan de" not in low:
        return None
    # S01's compact tagline deliberately gives components plus "resto" rather
    # than a total; the explicit contract below it is what must agree.
    if "resto para" in low and "total" not in low and "unas " not in low:
        return None

    patterns = (
        r"total\s*(?:≈|~|de)?\s*(\d+)\s*h",
        r"unas?\s+([a-záéíóúñ]+|\d+)\s+horas?",
        r"plan\s+de\s+~?\s*(\d+)\s*h",
        r"ritmo[^\n]{0,80}?\((\d+)\s*h\)",
    )
    for pattern in patterns:
        match = re.search(pattern, low, re.I)
        if match:
            return hour_value(match.group(1))

    # Tiered pacing copy (for example 10–12 h, 14–16 h, 18 h) still states an
    # overall upper planning figure. The last explicit hour value is the total.
    values = [int(v) for v in re.findall(r"(\d+)\s*h\b", low)]
    return values[-1] if values else None


class TestPr48ReviewRegressions(unittest.TestCase):
    def test_every_embedded_pacing_total_matches_estimated_hours(self):
        mismatches: list[str] = []
        for path in active_sections():
            text = path.read_text(encoding="utf-8")
            estimated_match = re.search(r"\bestimatedHours:\s*(\d+)", text)
            self.assertIsNotNone(estimated_match, path.name)
            estimated = int(estimated_match.group(1))
            for line_number, line in enumerate(text.splitlines(), 1):
                visible_total = pacing_total(line)
                if visible_total is not None and visible_total != estimated:
                    mismatches.append(
                        f"{path.name}:{line_number} visible={visible_total}h metadata={estimated}h :: {line.strip()[:150]}"
                    )
        self.assertEqual(mismatches, [], "\n" + "\n".join(mismatches))

    def test_later_gloss_does_not_retroactively_explain_an_earlier_use(self):
        source = '''
        theory: [{
          heading: "Orden real",
          paragraphs: [
            "Primero usamos `PATH` para encontrar el ejecutable.",
            "**PATH** — lista de carpetas donde el sistema busca programas.",
            "Después `PATH` ya está explicado y puede reutilizarse.",
          ],
        }]
        '''
        positions = unexplained.explanation_positions_in_source(source, section_index=1)
        self.assertIn("path", positions)
        intro = positions["path"]
        self.assertFalse(
            unexplained.introduced_by(intro, section_index=1, sentence_position=0),
            "a definition in a later sentence must not explain an earlier use",
        )
        self.assertTrue(
            unexplained.introduced_by(intro, section_index=1, sentence_position=2),
            "uses after the definition should count as grounded",
        )


if __name__ == "__main__":
    unittest.main()
