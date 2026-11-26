"""The longest option must not be the answer.

Measured on 2026-09-29 over every bank in the exam seed: the correct option is the longest of
the four in **1125 of 1200 questions, 94%**, where chance is 25%. Eleven banks are at 100%. The
correct option averages 2.5x the length of the others.

Nothing shuffles them. `src/app/api/exam/start/route.ts:116` sends `options: JSON.parse(q.options)`
in stored order - its "shuffled order" at :167 shuffles the QUESTIONS, not the options - so the
cue reaches the learner exactly as authored. `PASS_THRESHOLD` is 70 (`src/lib/exam-scoring.ts:8`).

So a learner who always picks the longest option scores about 94 and passes every exam in the
course without knowing any Python, and `exam-scoring.ts:120` counts a passing attempt as evidence
of section completion, which is what badges and the certificate are built on.

This is a ratchet, not an absolute gate: 1121 questions cannot be rewritten in one round, and a
gate that is red on every round says nothing about the round. The debt is counted, it may not
grow, and it must be lowered as it is paid. The same shape as
`glossary-first-use-ratchet.test.mjs`.

Two moves pay it down, both from the NBME Item-Writing Guide (6th ed.): write the distractors as
long and as specific as the key, and "remove language used for teaching points and rationales"
from the key. Never trim the detail that makes the key correct: a key cut to match three short
distractors has lost the precision it was written to test (owner decision O20, 2026-10-07; this
docstring said "never trim the key" until then, which forbade the guide's own remedy).

The banks are read through scripts/exam_bank.py, which parses the exam seed with the TypeScript
compiler. An earlier version of this file matched single-quoted keys with a regex and so never saw
`setup` or `basics`; see LONGEST_IS_CORRECT_OWED.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

#: Questions whose correct option is the longest; a tie with the longest counts. Lower this as
#: banks are repaired.
#: 2026-10-07: 1125 -> 1081. 110 of the GLM lane's rewrites in S05 and S08-S11 (O20); the other 8
#: went back to Codex.
#: 2026-10-13: 1081 -> 1121. A re-measure, not a repair: no question changed. The old count read
#: single-quoted keys only (`_BANK`), so it saw 1200 of the 1248 questions (44 banks), and it folded
#: six double-quoted or unquoted banks into the banks before them. Read through the TypeScript
#: parser, every bank is seen: 1081 over the 1200 the old reader saw, plus +22 for `setup` and +18
#: for `basics`, which have unquoted keys the regex never matched. 1121 of 1248.
#: Another open round (the S10 round) lowers this count; whichever lands second re-measures.
#:
#: The 1081 -> 1121 move is a one-time measurement, recorded here and not asserted. Measured on
#: 2026-10-13 on the exam seed, blob 4a31ae3b (origin/main a75a0875), with is_longest below: over
#: the 52 banks except `setup` and `basics` (1200 questions, the ones the old reader saw) the count
#: is 1081, the old figure exactly; `setup` adds 22 of 24 and `basics` 18 of 24; 1121 of 1248. To
#: repeat it on that blob, from the repository root:
#:     python3 -c "import sys; sys.path[:0]=['scripts','tests/adversarial']; import exam_bank;
#:     from test_exam_length_cue import is_longest; b=exam_bank.load_banks();
#:     print(sum(is_longest(q) for x in b if x['slug'] not in ('setup','basics') for q in x['questions']))"
#: It is not a test, because it would go red on the first repair outside those two banks, and the
#: only way to clear it would be to edit a constant whose comment says it is what the old reader
#: counted. What guards the reader instead: test_the_measure_still_sees_the_banks (a reader that
#: drops banks or questions falls under its floors) and the ratchet below.
#: 2026-10-13, the S10 round (O20) on top: Codex redid the 8 questions the GLM lane got wrong and
#: rewrote six S08 items and three S10 keys so the key is no longer the unique longest option.
#: Same AST measure. 1121 -> 1109 (the old single-quote measure moved 1081 -> 1069: the same 12).
#: 2026-10-14: 1109 -> 1068. Plan PR 9: the real S12 and S13 banks put the key at the longest option
#: (a tie counts, as in is_longest) in 5 and 2 of 24 questions, where the 48 stand-ins put it there
#: in all 48. An earlier commit on that branch had 0 and 2 (1063): every S12 key had been kept from
#: the longest place, and picking the shortest option then passed S12 for 40.2% of learners.
#: Below chance, one key in four, a lower count is not better: the length cue is gone when no
#: length rank gives the key away, which exam-strategy-simulation.test.ts measures for every rank.
#: 2026-11-09: 1068 -> 1051. Batch-1 item D (owner-approved proposals-02/03): the S03 bank's wrong
#: options rewritten as S03-level misconceptions, lengths balanced so no length rank passes the bank
#: (exam-strategy-simulation.test.ts: decisions-rules leaves the "longest" and "clang" owed lists).
#: 2026-11-11: 1051 -> 1047. Proposal 10 P1 fixes: the rewritten items in setup, decisions-rules,
#: iteration-summaries and text-unicode-regex got distractors at least as long as the key.
#: 2026-11-11: 1047 -> 1045. Proposal 10 S01: the two commit-message items (churn, NaN) got a
#: distractor longer than the key.
#: 2026-11-17: 1045 -> 1036. Proposal 10 S02: nine basics items got distractors at least as long
#: as the key (literals, assignment, decimal, f-string and parse items).
#: 2026-11-17: 1036 -> 1035. Proposal 10 S05: the boundaries item in functions-contracts got
#: distractors longer than the key.
#: 2026-11-17: 1035 -> 1034. Proposal 10 S06: the collections dict-counter key lost its
#: "(o defaultdict/Counter)" aside, which named tools S01-S06 never teach.
#: 2026-11-18: 1034 -> 1033. Proposal 10 S07: the two-token review item in text-unicode-regex
#: got a distractor longer than the key.
#: 2026-11-18: 1033 -> 1032. Proposal 10 S08: the newline="" item in files-ingestion kept its key
#: wording and got distractors longer than the key.
#: 2026-11-18: 1032 -> 1029. Proposal 10 S09: three exceptions-logging items (the parser's
#: exception, the custom-exception item, the regression-evidence item) got distractors at least
#: as long as the key.
#: 2026-11-18: 1029 -> 1022. Proposal 10 S10: seven modules-packaging-cli items (import *, the
#: import cycle, dependencies, compatibility, argparse, --help, stdout contamination) got a
#: distractor longer than the key; no key was trimmed.
#: 2026-11-18: 1022 -> 1018. Proposal 10 S11: oop-domain items got distractors longer than the
#: key, so the key is longest on 4 of 24. Three S10 items went back to key-longest on purpose:
#: putting the key under one longer distractor everywhere made it second-longest on 17 of 24,
#: which a "pick the second-longest" learner passed every time. Both banks now spread the key's
#: length rank (no rank above 7 of 24); see test_proposal10_s10/s11 and the strategy simulation.
#: 2026-11-21: 1018 -> 1000. Proposal 12 S14: every security (NumPy) distractor was rewritten as
#: a real misconception; the key's length rank is 1, 2, 3 and 4 on 6 of 24 each, and no key was
#: trimmed except the S14 parenthetical "(o política explícita de ownership)", a term the
#: section never teaches.
#: 2026-11-21: 1000 -> 983. Proposal 12 S15: every stdlib-deep (pandas) distractor was rewritten
#: as a misconception a learner holds (pandas 2.x copy rules, loc on a numeric Index, na_values
#: for NA); the key is longest on 6 of 24, down from 23, and the ranks are 6/6/6/6.
#: 2026-11-21: 983 -> 965. Proposal 12 S16: every wxpython-gui (data quality) distractor was rewritten
#: as a misconception (keep='first' as the default, the cap as exclusive, assert for drift, the
#: coma always decimal); the bank leaves the perfect-cue set, and the ranks are 6/6/6/6.
#: 2026-11-25: 965 -> 947. Proposal 12 S17: every packaging (joins, reshape, groupby) distractor was
#: rewritten as a misconception (pivot_table summing by default, left keeping orphan transactions,
#: `<` as the as-of filter); the bank leaves the perfect-cue set, and the ranks are 6/6/6/6.
#: 2026-11-25: 947 -> 931. Proposal 12 S18: every data-engineering (EDA and uncertainty) distractor was
#: rewritten as a misconception (bias_pp read as 0.25 points, ddof=0 for a sample, the IC as the range
#: of the data); the key is longest on 6 of 24, and the ranks are 6/6/6/6.
#: 2026-11-25: 931 -> 915. Proposal 12 S19: every databases-orm (visualization and accessibility)
#: item was rewritten; distractors are misconceptions (an axis from 90 read as harmless, Seaborn as
#: required, a tooltip without n), the key is longest on 6 of 24, and the ranks are 6/6/6/6.
LONGEST_IS_CORRECT_OWED = 915
#: Banks at 100%, where a learner needs no knowledge at all. Eleven, not the eight a first look
#: reported: that number came from printing the top rows of a sorted list and counting the print.
#: Named, and held exactly: a bank that drops out of this set has been repaired and must leave it.
#: 2026-10-14: nine. Plan PR 9 repaired apis-sql-geo and evidence-dashboard.
#: 2026-11-21: proposal 12 S14 repaired security (NumPy); it leaves the set.
#: 2026-11-21: proposal 12 S16 repaired wxpython-gui (data quality); it leaves the set.
#: 2026-11-25: proposal 12 S17 repaired packaging (joins, reshape, groupby); it leaves the set.
PERFECT_CUE_BANKS_OWED = frozenset({
    "architecture-ddd-decisions", "career-strategy",
    "rag", "rapidfuzz-entity", "rpa-advanced", "security-infra",
})


def is_longest(question: dict) -> bool:
    """True when the key is as long as the longest option. A tie with the longest counts."""
    lengths = [len(option) for option in question["options"]]
    return lengths[question["correctIndex"]] == max(lengths)


def cue_by_bank(banks: list[dict]) -> dict[str, tuple[int, int]]:
    """{slug: (questions whose key is the longest option, questions)}."""
    return {
        bank["slug"]: (sum(is_longest(q) for q in bank["questions"]), len(bank["questions"]))
        for bank in banks
    }


class ExamLengthCue(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.banks = exam_bank.load_banks()

    def setUp(self) -> None:
        self.by_bank = cue_by_bank(self.banks)
        self.longest = sum(c for c, _ in self.by_bank.values())
        self.total = sum(t for _, t in self.by_bank.values())

    def test_the_measure_still_sees_the_banks(self):
        """A reader that drops banks makes every count below look smaller than it is."""
        self.assertGreaterEqual(len(self.by_bank), 52, "the reader lost banks; the count is short")
        self.assertGreaterEqual(self.total, 1248, "the reader lost questions; the count is short")

    def test_every_question_has_four_options(self):
        """The cue is measured over four options. Another size would be measured wrongly."""
        sizes = {len(q["options"]) for bank in self.banks for q in bank["questions"]}
        self.assertEqual(sizes, {4})

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
        perfect = {slug for slug, (c, t) in self.by_bank.items() if c == t}
        new = sorted(perfect - PERFECT_CUE_BANKS_OWED)
        self.assertEqual(new, [], f"banks answer to the cue in every question: {', '.join(new)}")

    def test_repaired_perfect_banks_leave_the_owed_set(self):
        perfect = {slug for slug, (c, t) in self.by_bank.items() if c == t}
        gone = sorted(PERFECT_CUE_BANKS_OWED - perfect)
        self.assertEqual(gone, [], f"no longer perfect - remove from PERFECT_CUE_BANKS_OWED: {gone}")

    def test_the_detector_reads_lengths_not_positions(self):
        """Falsification: a bank with the key shortest must not be counted, whatever its index."""
        synthetic = [
            {"options": ["si", "una respuesta larga y detallada", "otra igual de larga aqui",
                         "tambien bastante larga"], "correctIndex": 0},
            {"options": ["a", "b", "c", "una respuesta larga"], "correctIndex": 3},
        ]
        self.assertEqual(cue_by_bank([{"slug": "probe-bank", "questions": synthetic}])["probe-bank"],
                         (1, 2))


if __name__ == "__main__":
    unittest.main()
