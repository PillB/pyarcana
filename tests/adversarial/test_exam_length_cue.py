"""The longest option must not be the answer.

Measured on 2026-09-29 over every bank in `prisma/seed.ts`: the correct option is the longest of
the four in **1125 of 1200 questions, 94%**, where chance is 25%. Eleven banks are at 100%. The
correct option averages 2.5x the length of the others.

Nothing shuffles them. `src/app/api/exam/start/route.ts:116` sends `options: JSON.parse(q.options)`
in stored order - its "shuffled order" at :167 shuffles the QUESTIONS, not the options - so the
cue reaches the learner exactly as authored. `PASS_THRESHOLD` is 70 (`src/lib/exam-scoring.ts:8`).

So a learner who always picks the longest option scores about 94 and passes every exam in the
course without knowing any Python, and `exam-scoring.ts:120` counts a passing attempt as evidence
of section completion, which is what badges and the certificate are built on.

This is a ratchet, not an absolute gate: 1125 questions cannot be rewritten in one round, and a
gate that is red on every round says nothing about the round. The debt is counted, it may not
grow, and it must be lowered as it is paid. The same shape as
`glossary-first-use-ratchet.test.mjs`.

Writing distractors as long as the key is the fix, never trimming the key: a key trimmed to match
three short distractors loses the precision that makes it correct.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SEED = ROOT / "prisma/seed.ts"

#: Questions whose correct option is the longest. Lower this as banks are repaired.
LONGEST_IS_CORRECT_OWED = 1125
#: Banks at 100%, where a learner needs no knowledge at all. Eleven, not the eight a first look
#: reported: that number came from printing the top rows of a sorted list and counting the print.
PERFECT_CUE_BANKS_OWED = 11

_OPTION = re.compile(r"'((?:[^'\\]|\\.)*)'|\"((?:[^\"\\]|\\.)*)\"")
_ITEM = re.compile(r"options:\s*\[(.*?)\]\s*,\s*correctIndex:\s*(\d)", re.S)
_BANK = re.compile(r"^  '([a-z0-9-]+)': \[", re.M)


def options(raw: str) -> list[str]:
    return [m.group(1) or m.group(2) for m in _OPTION.finditer(raw)]


def cue_by_bank(source: str) -> dict[str, tuple[int, int]]:
    """{slug: (questions whose key is the longest option, questions)}."""
    marks = [(m.start(), m.group(1)) for m in _BANK.finditer(source)]
    out: dict[str, tuple[int, int]] = {}
    for i, (start, slug) in enumerate(marks):
        end = marks[i + 1][0] if i + 1 < len(marks) else len(source)
        longest = total = 0
        for raw, index in _ITEM.findall(source[start:end]):
            opts = options(raw)
            if len(opts) != 4:
                continue
            lengths = [len(o) for o in opts]
            total += 1
            longest += lengths[int(index)] == max(lengths)
        if total:
            out[slug] = (longest, total)
    return out


class ExamLengthCue(unittest.TestCase):
    def setUp(self) -> None:
        self.by_bank = cue_by_bank(SEED.read_text(encoding="utf-8"))
        self.longest = sum(c for c, _ in self.by_bank.values())
        self.total = sum(t for _, t in self.by_bank.values())

    def test_the_measure_still_sees_the_banks(self):
        """A parse that silently matches nothing would make every count below zero."""
        self.assertGreater(len(self.by_bank), 40, "found almost no banks; the parse has rotted")
        self.assertGreater(self.total, 1000, "found almost no questions; the parse has rotted")

    def test_the_length_cue_does_not_grow(self):
        self.assertLessEqual(
            self.longest, LONGEST_IS_CORRECT_OWED,
            f"{self.longest} of {self.total} questions answer to 'pick the longest option', "
            f"owed is {LONGEST_IS_CORRECT_OWED}. Lengthen the distractors; never trim the key.",
        )

    def test_repairs_are_kept(self):
        self.assertEqual(
            self.longest, LONGEST_IS_CORRECT_OWED,
            f"only {self.longest} remain - lower LONGEST_IS_CORRECT_OWED to {self.longest} "
            f"so the ratchet keeps what was fixed",
        )

    def test_no_further_bank_becomes_perfectly_predictable(self):
        perfect = sorted(s for s, (c, t) in self.by_bank.items() if c == t)
        self.assertLessEqual(
            len(perfect), PERFECT_CUE_BANKS_OWED,
            f"{len(perfect)} banks answer to the cue in every question: {', '.join(perfect)}",
        )
        self.assertEqual(len(perfect), PERFECT_CUE_BANKS_OWED,
                         f"only {len(perfect)} remain - lower PERFECT_CUE_BANKS_OWED")

    def test_the_detector_reads_lengths_not_positions(self):
        """Falsification: a bank with the key shortest must not be counted, whatever its index."""
        synthetic = (
            "  'probe-bank': [\n"
            "    { options: ['si', 'una respuesta larga y detallada', 'otra igual de larga aqui',"
            " 'tambien bastante larga'], correctIndex: 0 },\n"
            "    { options: ['a', 'b', 'c', 'una respuesta larga'], correctIndex: 3 },\n"
            "  ],\n"
        )
        self.assertEqual(cue_by_bank(synthetic)["probe-bank"], (1, 2))


if __name__ == "__main__":
    unittest.main()
