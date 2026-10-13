"""The scikit-learn facts behind audit/fixer/known_false_claims.json (KFC-007, KFC-009).

These need the pinned content packages (requirements-content.txt: scikit-learn 1.6.1), so they run
in CI's content-gates job, which installs them, and not in adversarial-unit, which does not. This
directory has no __init__.py, so scripts/run_adversarial_py.py's discovery of `tests` skips it.

    python3 -m unittest discover -s tests/content_facts -p 'test_*.py'
"""
from __future__ import annotations

import unittest

from sklearn.model_selection import KFold, StratifiedKFold, check_cv, train_test_split


class SklearnClaims(unittest.TestCase):
    def test_the_default_split_holds_out_a_quarter(self) -> None:
        """KFC-007. 80/20 is a choice: with no sizes given, scikit-learn holds out 25%."""
        train, test = train_test_split(list(range(100)), random_state=0)
        self.assertEqual((len(train), len(test)), (75, 25))

    def test_a_classifier_already_gets_stratified_folds(self) -> None:
        """KFC-009. With an integer cv and a classifier, scikit-learn already stratifies; it is
        the default for classification, not an extra obligation - and plain KFold otherwise."""
        self.assertIsInstance(check_cv(5, y=[0, 1] * 10, classifier=True), StratifiedKFold)
        self.assertIsInstance(check_cv(5, y=[0.5, 1.5] * 10, classifier=False), KFold)


if __name__ == "__main__":
    unittest.main()
