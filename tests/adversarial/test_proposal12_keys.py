"""Proposal 12 (approved 2026-11-21): the three wrong exam keys of S14-S27.

The S14-S27 review found three exam questions whose key pointed at a joke distractor, so a learner
who answered as the lesson teaches was marked wrong: S18-EXAM-23 keyed "Un color corporativo
exacto", S19-EXAM-05 keyed "Usar el mismo color para todo sin leyenda" and S27-EXAM-22 keyed
"Borrar todos los asserts para ir más rápido". Each test reads the bank the app seeds through
scripts/exam_bank.py and checks that the key is the option the question's own explanation states.

The banks shuffle options per attempt (src/lib/exam-draw.ts), so the stored position does not
matter to a learner; the stored index is what decides which text is graded as right.

Run: python3 -m unittest tests.adversarial.test_proposal12_keys
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

#: (bank slug, question, the option the explanation states, a word of the explanation it matches)
KEYS = [
    ("data-engineering", "Para reproducir un EDA, lo prioritario es:",
     "Dependencias/seed/filtros versionados y script reejecutable", "seed"),
    ("databases-orm", "Un encoding visual honesto implica:",
     "Mapear variables a canal visual sin distorsión injustificada y con leyenda clara", "canal visual"),
    ("async-concurrency", "La idea de mutación conceptual en tests es:",
     "Romper código a propósito para ver si los tests fallan de forma útil", "mutante"),
]


def question(slug: str, text: str) -> dict:
    hits = [q for q in exam_bank.bank_for(slug) if q["question"] == text]
    if len(hits) != 1:
        raise AssertionError(f"expected one {text!r} in {slug}, found {len(hits)}")
    return hits[0]


class WrongKeysAreFixed(unittest.TestCase):
    def test_each_key_is_the_option_the_lesson_teaches(self) -> None:
        for slug, text, right, _ in KEYS:
            with self.subTest(slug=slug):
                q = question(slug, text)
                self.assertEqual(q["options"][q["correctIndex"]], right)

    def test_the_explanation_supports_the_key(self) -> None:
        """The key and the explanation must name the same idea, so the fix did not just move the
        index to another wrong option."""
        for slug, text, _, word in KEYS:
            with self.subTest(slug=slug):
                self.assertIn(word, question(slug, text)["explanation"])


if __name__ == "__main__":
    unittest.main()
