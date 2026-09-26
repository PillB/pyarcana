"""Teaching a word the course never explained must not read as a regression.

The gate carried two counters over the concept map: `never_explained` (concepts at depth L0)
and `used_before_explained` (concepts explained somewhere but met earlier). Both were gated
with "may not rise", and they count two halves of one population - so explaining an L0
concept moves it out of the first counter and into the second, and the ratchet reads that
move as damage.

S17's concepts round taught `reshape`. Its only remaining uses were its own section's tagline
and jobRelevance, so: never 14 -> 13, used_before_explained 40 -> 41, FAIL, section restored -
on a round that removed 14 surprising uses across the course and took S17 from 31 to 17. Any
concept named in its own section's tagline was structurally impossible to teach.

`used_before_explained` is now reported rather than gated, and the harm it was reaching for is
gated directly: `surprising_uses_course_wide`, every occasion in the whole course where a
learner meets a word before anything explains it. That is stricter than the counter it
replaces - it counts every use, not merely whether a concept has one - and it still may not
rise.

These tests drive gate.py's own verdict function, so they hold the decision the gate makes,
not a restatement of the arithmetic.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))

import gate  # noqa: E402


def verdicts(before: dict, after: dict) -> dict[str, str]:
    return {k: gate.regression_verdict(k, before[k], after[k]) for k in before}


#: S17's real round, as the gate measured it.
S17_BEFORE = {
    "never_explained": 14,
    "surprising_uses_course_wide": 420,
    "info:used_before_explained": 40,
    "surprising_uses_in_section": 31,
}
S17_AFTER = {
    "never_explained": 13,
    "surprising_uses_course_wide": 406,
    "info:used_before_explained": 41,
    "surprising_uses_in_section": 17,
}


class GateConceptMeasures(unittest.TestCase):
    def test_the_S17_round_is_not_a_regression(self):
        v = verdicts(S17_BEFORE, S17_AFTER)
        self.assertNotIn(
            "worse", v.values(),
            f"the round that removed 14 surprising uses still reads as a regression: {v}",
        )

    def test_used_before_explained_is_reported_not_gated(self):
        """It may rise, because the only way it rises on its own is a concept being taught."""
        self.assertEqual(gate.regression_verdict("info:used_before_explained", 40, 41), "info")

    def test_more_surprising_uses_course_wide_still_fails(self):
        """The replacement has to be able to say no, or nothing was gained."""
        worse = {**S17_AFTER, "surprising_uses_course_wide": 421}
        self.assertEqual(
            verdicts(S17_BEFORE, worse)["surprising_uses_course_wide"], "worse",
            "a round that leaves learners meeting more unexplained words must fail",
        )

    def test_the_new_measure_is_stricter_than_the_one_it_replaces(self):
        """A concept gaining uses moves the gated number; the concept count would not.

        Same concepts affected before and after, one of them used three more times. The old
        counter cannot see this at all.
        """
        before = {**S17_BEFORE, "surprising_uses_course_wide": 420, "info:used_before_explained": 40}
        after = {**S17_BEFORE, "surprising_uses_course_wide": 423, "info:used_before_explained": 40}
        self.assertEqual(verdicts(before, after)["surprising_uses_course_wide"], "worse")
        self.assertEqual(verdicts(before, after)["info:used_before_explained"], "info")

    def test_never_explained_is_still_gated(self):
        """Nothing here loosens the measure that matters most."""
        worse = {**S17_BEFORE, "never_explained": 15}
        self.assertEqual(
            verdicts(S17_BEFORE, worse)["never_explained"], "worse",
            "a round that leaves another word explained nowhere must still fail",
        )

    def test_the_gate_emits_the_keys_these_tests_assert_on(self):
        """Guards the rename: a typo here would silently gate nothing at all."""
        source = (ROOT / "tools/fixer/gate.py").read_text(encoding="utf-8")
        self.assertIn('"surprising_uses_course_wide": surprising_total', source)
        self.assertIn('f"{INFORMATIONAL}used_before_explained": surprising', source)


if __name__ == "__main__":
    unittest.main()


class FirstUseIssueCounting(unittest.TestCase):
    """The same defect seen twice is one defect.

    `glossary_first_use.py` emits USE_BEFORE_DEFINITION and DEFINITION_AFTER_REQUIREMENT from
    two independent `if`s, so a term that is both mentioned and required before its definition
    costs 2, while a term defined nowhere ends in `continue` and costs 1. Teaching the second
    kind therefore reads as damage: S04 taught `for`, whose earlier uses in S02 and S03 both
    mention and require it, and `first_use_issues` went 37 -> 38 on a round that took the
    course from 268 surprising uses to 229.

    Both rows still reach the report, because badge_readiness_audit.py keys off
    DEFINITION_AFTER_REQUIREMENT and suppressing it would weaken a different gate. Only the
    ratchet folds them together.
    """

    @staticmethod
    def count(issues: list[dict]) -> int:
        return len({
            (i["term_id"], "used-before-defined"
             if i["code"] in ("USE_BEFORE_DEFINITION", "DEFINITION_AFTER_REQUIREMENT")
             else i["code"])
            for i in issues
        })

    def test_one_term_seen_both_ways_counts_once(self):
        both = [
            {"term_id": "for", "code": "USE_BEFORE_DEFINITION"},
            {"term_id": "for", "code": "DEFINITION_AFTER_REQUIREMENT"},
        ]
        self.assertEqual(self.count(both), 1)

    def test_teaching_a_never_defined_term_is_not_a_regression(self):
        """The exact transition that failed S04, before and after."""
        before = [{"term_id": "for", "code": "NO_VISIBLE_DEFINITION"}]
        after = [
            {"term_id": "for", "code": "USE_BEFORE_DEFINITION"},
            {"term_id": "for", "code": "DEFINITION_AFTER_REQUIREMENT"},
        ]
        self.assertEqual(self.count(after), self.count(before),
                         "defining a term the course never defined must not raise the count")

    def test_different_terms_still_count_separately(self):
        rows = [
            {"term_id": "for", "code": "USE_BEFORE_DEFINITION"},
            {"term_id": "dict", "code": "USE_BEFORE_DEFINITION"},
            {"term_id": "exception", "code": "NO_VISIBLE_DEFINITION"},
        ]
        self.assertEqual(self.count(rows), 3, "the fold must not hide independent defects")

    def test_an_unrelated_code_on_the_same_term_still_counts(self):
        rows = [
            {"term_id": "for", "code": "USE_BEFORE_DEFINITION"},
            {"term_id": "for", "code": "GLOSSARY_SECTION_MISSING"},
        ]
        self.assertEqual(self.count(rows), 2)

    def test_gate_py_counts_the_way_these_tests_do(self):
        source = (ROOT / "tools/fixer/gate.py").read_text(encoding="utf-8")
        self.assertIn('"used-before-defined"', source)
        self.assertNotIn('sum(fu.get("issue_counts", {}).values())', source)


class ReadinessFindings(unittest.TestCase):
    """The required-skills map is gated, so skills keep pace with what credentials claim.

    Synthetic reports shaped like badge_readiness_report.json, driving gate.py's own helper
    and verdict function.
    """

    @staticmethod
    def report(*rows_w, fails=()):
        return {"failures": list(fails), "warnings": list(rows_w)}

    def test_a_row_counts_by_its_count_not_its_truncated_term_list(self):
        row = {"badge": "progress_journey_completed", "code": "CLAIMS_UNTAUGHT_VOCABULARY",
               "count": 39, "terms": [f"t{i}" for i in range(12)]}
        self.assertEqual(gate.readiness_findings(self.report(row)), 39)

    def test_a_failure_without_a_count_is_one(self):
        fail = {"badge": "x", "code": "PREREQUISITE_TAUGHT_LATER", "detail": "needs S52"}
        self.assertEqual(gate.readiness_findings(self.report(fails=[fail])), 1)

    def test_a_badge_claiming_one_more_untaught_term_fails_the_round(self):
        before = self.report({"badge": "b", "code": "CLAIMS_UNTAUGHT_VOCABULARY", "count": 2})
        after = self.report({"badge": "b", "code": "CLAIMS_UNTAUGHT_VOCABULARY", "count": 3})
        key = "readiness_findings_course_wide"
        self.assertEqual(gate.regression_verdict(
            key, gate.readiness_findings(before), gate.readiness_findings(after)), "worse")

    def test_the_gate_measures_it_and_the_runner_restores_it(self):
        gate_src = (ROOT / "tools/fixer/gate.py").read_text(encoding="utf-8")
        self.assertIn('"readiness_findings_course_wide": readiness_findings(ready)', gate_src)
        self.assertIn('"scripts/badge_readiness_audit.py"', gate_src)
