"""Contract: scripts/exam_bank.py gives Python the whole exam bank, or raises - never a partial one.

The wrapper runs scripts/learner_text_extractor.mts (the TypeScript parser). The failure this
guards is the quiet one: a wrapper that swallowed a refusal and returned [] would make every
Python gate built on it pass over an empty bank.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402


class ExamBankLoader(unittest.TestCase):
    def test_reads_every_bank_in_every_key_style(self) -> None:
        report = exam_bank.load_bank_report()
        banks = report["banks"]
        self.assertEqual(len(banks), 52)
        self.assertEqual(sum(len(b["questions"]) for b in banks), 1248)
        census = report["keyCensus"]
        self.assertTrue(all(census[s] > 0 for s in ("identifier", "single", "double")), census)
        self.assertEqual({len(b["questions"]) for b in banks}, {24})

    def test_bank_for_reads_unquoted_and_double_quoted_banks(self) -> None:
        """`setup` (unquoted) and `functions-contracts` (double-quoted) are the banks the old
        single-quote regex never saw."""
        for slug in ("setup", "functions-contracts"):
            questions = exam_bank.bank_for(slug)
            self.assertEqual(len(questions), 24, slug)
            self.assertEqual(sorted({q["variant"] for q in questions}), [1, 2, 3], slug)

    def test_an_unknown_bank_raises(self) -> None:
        with self.assertRaises(KeyError):
            exam_bank.bank_for("no-such-section")

    def test_a_refusal_raises_instead_of_returning_an_empty_bank(self) -> None:
        no_bank = ROOT / "tests/adversarial/learner-text-reader.test.ts"   # valid TypeScript, no bank
        with self.assertRaises(exam_bank.BankReadError) as caught:
            exam_bank.load_banks(no_bank)
        self.assertIn("expected one top-level QUESTION_BANK", str(caught.exception))
        broken = ROOT / "tests/adversarial/test_exam_bank_loader.py"       # not TypeScript at all
        with self.assertRaises(exam_bank.BankReadError) as caught:
            exam_bank.load_banks(broken)
        self.assertIn("syntax error", str(caught.exception))


if __name__ == "__main__":
    unittest.main()
