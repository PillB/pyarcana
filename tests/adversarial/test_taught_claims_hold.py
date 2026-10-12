"""The facts behind audit/fixer/known_false_claims.json, demonstrated rather than quoted.

The registry says what is wrong with each statement and cites a source. These tests run the thing
itself - the interpreter, the logging module, a simulation - so a correct statement that a later
round writes into a lesson has evidence that does not depend on anyone's reading of a document,
and a registry entry that turned out to be wrong would fail here first.

Standard library only: this runs in the adversarial-unit job, which has no numpy. The two facts
about scikit-learn's defaults run in tests/content_facts/, in the job that installs it.
"""
from __future__ import annotations

import math
import os
import random
import statistics
import subprocess
import sys
import tempfile
import textwrap
import unittest
from fractions import Fraction
from pathlib import Path

#: Two-sided 97.5% quantiles of Student's t (scipy.stats.t.ppf(0.975, df)), for df = n - 1.
T_975 = {4: 2.7764451051977987, 39: 2.0226909200367595}


def _run(args: list[str], cwd: Path, **env: str) -> subprocess.CompletedProcess:
    clean = {k: v for k, v in os.environ.items() if k not in ("PYTHONPATH", "PYTHONSAFEPATH")}
    return subprocess.run([sys.executable, *args], cwd=cwd, capture_output=True, text=True,
                          env={**clean, **env})


def _write(root: Path, files: dict[str, str]) -> None:
    for rel, body in files.items():
        path = root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(textwrap.dedent(body), encoding="utf-8")


def _coverage(n: int, reps: int, resamples: int, rng: random.Random) -> tuple[float, float]:
    """Share of nominal-95% intervals covering the true mean of lognormal(3, 0.5):
    (percentile bootstrap, t interval)."""
    true_mean = math.exp(3 + 0.5 ** 2 / 2)
    hit_boot = hit_t = 0
    for _ in range(reps):
        sample = [rng.lognormvariate(3, 0.5) for _ in range(n)]
        means = sorted(sum(rng.choices(sample, k=n)) / n for _ in range(resamples))
        lo, hi = means[int(0.025 * resamples)], means[int(0.975 * resamples) - 1]
        hit_boot += lo <= true_mean <= hi
        half = T_975[n - 1] * statistics.stdev(sample) / math.sqrt(n)
        hit_t += abs(statistics.fmean(sample) - true_mean) <= half
    return hit_boot / reps, hit_t / reps


def _auc(pos: list[float], neg: list[float]) -> float:
    """Probability a random positive outscores a random negative (ties count half)."""
    wins = sum((p > q) + 0.5 * (p == q) for p in pos for q in neg)
    return wins / (len(pos) * len(neg))


def _average_precision(pos: list[float], neg: list[float]) -> float:
    ranked = sorted([(s, 1) for s in pos] + [(s, 0) for s in neg], key=lambda x: -x[0])
    found, total = 0, 0.0
    for rank, (_, is_pos) in enumerate(ranked, start=1):
        if is_pos:
            found += 1
            total += found / rank
    return total / len(pos)


class TaughtClaimsHold(unittest.TestCase):
    def test_a_point_probability_is_not_a_p_value(self) -> None:
        """KFC-001. 'The probability of observing the result if H0 holds' is a point probability.
        For 1000 fair coin flips, exactly 500 heads - the most typical result there is - has
        probability 0.025, while its p-value (a result at least as extreme) is 1."""
        n = 1000
        point = lambda k: float(Fraction(math.comb(n, k), 2 ** n))  # noqa: E731
        at_least_as_extreme = lambda k: sum(point(j) for j in range(n + 1) if abs(j - 500) >= abs(k - 500))  # noqa: E731
        self.assertAlmostEqual(point(500), 0.0252, places=4)
        self.assertAlmostEqual(at_least_as_extreme(500), 1.0, places=9)
        self.assertLess(point(530), 0.01)
        self.assertGreater(at_least_as_extreme(530), 0.05)

    def test_the_percentile_bootstrap_undercovers_at_small_n(self) -> None:
        """KFC-002, on S18's own distribution (lognormal(3, 0.5)): at n = 5 the percentile
        bootstrap covers far less than 95% and less than the t interval; at n = 40 they agree."""
        rng = random.Random(20261012)
        boot5, t5 = _coverage(5, reps=1000, resamples=400, rng=rng)
        boot40, t40 = _coverage(40, reps=1000, resamples=400, rng=rng)
        self.assertLess(boot5, 0.90, f"bootstrap coverage at n=5: {boot5}")
        self.assertGreaterEqual(t5 - boot5, 0.05, f"t {t5} vs bootstrap {boot5} at n=5")
        self.assertLess(abs(t40 - boot40), 0.03, f"t {t40} vs bootstrap {boot40} at n=40 (the control)")

    def test_python_m_puts_the_working_directory_first(self) -> None:
        """KFC-003. `-m` puts the current directory first on sys.path - it depends on it - and runs
        the module inside its package, which is what makes a relative import work."""
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp).resolve()
            _write(root, {
                "pkg/__init__.py": "",
                "pkg/helper.py": "NAME = 'helper'\n",
                "pkg/__main__.py": """\
                    import sys
                    from . import helper
                    print(sys.path[0])
                    print(helper.NAME)
                """,
            })
            ran = _run(["-m", "pkg"], root)
            self.assertEqual(ran.returncode, 0, ran.stderr)
            first, name = ran.stdout.splitlines()
            self.assertEqual(Path(first).resolve(), root, "sys.path[0] is not the working directory")
            self.assertEqual(name, "helper")

            direct = _run(["pkg/__main__.py"], root)
            self.assertNotEqual(direct.returncode, 0)
            self.assertIn("no known parent package", direct.stderr)

            safe = _run(["-P", "-m", "pkg"], root)
            self.assertNotEqual(safe.returncode, 0, "without the working directory, pkg is not found")
            self.assertIn("No module named pkg", safe.stderr)

    def test_a_circular_import_fails_only_when_a_name_is_used_too_early(self) -> None:
        """KFC-004. Two modules importing each other work when the names are used later, inside
        functions; they fail when one takes a name from the other while it is still loading."""
        with tempfile.TemporaryDirectory() as tmp:
            root = Path(tmp)
            _write(root, {
                "a.py": "import b\n\ndef fa():\n    return b.fb()\n",
                "b.py": "import a\n\ndef fb():\n    return 'ok'\n",
                "c.py": "from d import fd\n\ndef fc():\n    return fd()\n",
                "d.py": "from c import fc\n\ndef fd():\n    return 'ok'\n",
            })
            works = _run(["-c", "import a; print(a.fa())"], root)
            self.assertEqual((works.returncode, works.stdout.strip()), (0, "ok"), works.stderr)
            fails = _run(["-c", "import c"], root)
            self.assertNotEqual(fails.returncode, 0)
            self.assertIn("ImportError", fails.stderr)
            self.assertIn("partially initialized module", fails.stderr)

    def test_the_root_logger_defaults_to_warning(self) -> None:
        """KFC-005. Unconfigured, the root logger's level is WARNING (30): INFO is not shown."""
        ran = _run(["-c", "import logging; print(logging.getLogger().level); "
                          "logging.info('info-line'); logging.warning('warning-line')"], Path.cwd())
        self.assertEqual(ran.stdout.strip(), "30")
        self.assertIn("warning-line", ran.stderr)
        self.assertNotIn("info-line", ran.stderr)

    def test_pearson_r_misses_a_curved_relationship(self) -> None:
        """KFC-006. y = x**2 on a symmetric x is fully determined by x, and Pearson's r is 0:
        it measures linear association only."""
        x = list(range(-10, 11))
        self.assertAlmostEqual(statistics.correlation(x, [v * v for v in x]), 0.0, places=12)
        self.assertAlmostEqual(statistics.correlation(x, [3 * v + 1 for v in x]), 1.0, places=12)

    def test_roc_auc_ignores_prevalence_while_average_precision_falls(self) -> None:
        """KFC-008. Make the negatives 100 times more common: ROC-AUC does not move, while average
        precision collapses - the rare class is predicted no better than before, and AUC cannot
        show it."""
        pos = [0.9, 0.7, 0.5, 0.3]
        neg = [0.8, 0.6, 0.4, 0.2, 0.1]
        rare = neg * 100
        self.assertAlmostEqual(_auc(pos, neg), 0.70)
        self.assertEqual(_auc(pos, neg), _auc(pos, rare))
        self.assertAlmostEqual(_average_precision(pos, neg), 0.7095, places=3)
        self.assertLess(_average_precision(pos, rare), 0.27)


if __name__ == "__main__":
    unittest.main()
