"""S14's vectorisation benchmarks must still print their pinned `ratio_gt_1 True` when the first
BLAS call of the process is slow.

The defect (CI run 39272401487, job "Content gates", 2026-10-19): the theory block `vec_vs_loop.py`
and the We Do demo `demo_bench.py` time a Python loop against `np.dot` / `X @ w` and pin
`ratio_gt_1 True`, but the timed region of the vectorised side contained that call's FIRST execution
in the process. On a cold process the first call can pay for BLAS start-up, and a loop of 50,000
iterations takes only some tens of milliseconds, so the ratio flipped and the strict output audit
reported `MISMATCH code-block-7 line 2`. A benchmark that times a cold start is not the honest
benchmark the paragraph beside it asks for.

How this test recreates the cold start on any machine: a `sitecustomize.py` placed first on
PYTHONPATH of the snippet's subprocess only, which makes the first `np.dot` call, or the first `@`
on an array the lesson drew from `default_rng`, sleep 0.2 s once per process. The sleep is the
simulated BLAS start-up. A block that excludes the first call from its timed region (an untimed
warm-up call) is unaffected; a block that times it prints `ratio_gt_1 False`.

The blocks are read with the strict output audit's own extractor, not copied, and are compared
against the audit's own comparator, so this cannot drift from what the audit reads.

It needs the pinned content packages (requirements-content.txt), so it lives beside the other
tests that do, here, and runs in CI's content-gates job, not in adversarial-unit, which has no
numpy. Run it under .venv-content:

    .venv-content/bin/python -m unittest discover -s tests/content_facts -p 'test_s14_*.py' -v

Two things keep a green from being vacuous. Without the shim every block must exit 0, so a missing
package or a crashed snippet cannot read as a pass. With it, every block must report that the cold
start was paid at all (stderr carries COLD_START_PAID), so a lesson that stops calling `np.dot`
or `@` on those arrays fails here instead of passing for want of anything to delay.
"""
from __future__ import annotations

import os
import subprocess
import sys
import tempfile
import textwrap
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import python_content_runtime_audit as rt  # noqa: E402
import python_content_strict_output_audit as strict  # noqa: E402

SECTION = ROOT / "src/lib/course/sections/s14-security.ts"
#: What a benchmark block prints when it compares its timings.
BENCHMARK_MARK = 'print("ratio_gt_1"'
#: The simulated BLAS start-up: well over the tens of milliseconds a 50,000-step loop takes.
COLD_START_SECONDS = 0.2
PAID = "COLD_START_PAID"

SHIM = textwrap.dedent(
    f"""
    import sys, time
    import numpy as np

    _pending = [True]

    def _first_blas_call_pays():
        if _pending[0]:
            _pending[0] = False
            sys.stderr.write("{PAID}\\n")
            sys.stderr.flush()
            time.sleep({COLD_START_SECONDS})

    _real_dot = np.dot

    def _dot(*args, **kwargs):
        _first_blas_call_pays()
        return _real_dot(*args, **kwargs)

    np.dot = _dot


    class _ColdBlas(np.ndarray):
        # `@` cannot be wrapped on ndarray itself (a built-in type refuses new attributes), so the
        # arrays the lesson draws from default_rng are views of a subclass that can.
        def __matmul__(self, other):
            _first_blas_call_pays()
            return np.ndarray.__matmul__(self, other)


    class _Generator(np.random.Generator):
        def random(self, *args, **kwargs):
            return super().random(*args, **kwargs).view(_ColdBlas)


    _real_default_rng = np.random.default_rng
    np.random.default_rng = lambda seed=None: _Generator(_real_default_rng(seed).bit_generator)
    """
)


def run_snippet(code: str, *, cold_first_call: bool) -> subprocess.CompletedProcess:
    """Run one lesson snippet the way the audit does (a file in a scratch directory), optionally
    behind the shim, which reaches only this subprocess."""
    with tempfile.TemporaryDirectory(prefix="pyarcana_s14_") as td:
        scratch = Path(td)
        (scratch / "snippet.py").write_text(code, encoding="utf-8")
        env = {**os.environ, "PYTHONDONTWRITEBYTECODE": "1"}
        if cold_first_call:
            shim_dir = scratch / "shim"
            shim_dir.mkdir()
            (shim_dir / "sitecustomize.py").write_text(SHIM, encoding="utf-8")
            kept = env.get("PYTHONPATH")
            env["PYTHONPATH"] = str(shim_dir) + (os.pathsep + kept if kept else "")
        return subprocess.run(
            [sys.executable, str(scratch / "snippet.py")],
            capture_output=True, text=True, timeout=60, cwd=td, env=env,
        )


def benchmark_blocks() -> list[dict]:
    return [a for a in strict.extract(SECTION) if BENCHMARK_MARK in a["code"]]


class BenchmarksSurviveAColdFirstCall(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        probe = subprocess.run(
            [sys.executable, "-c", "import numpy, sys; sys.stdout.write(numpy.__version__)"],
            capture_output=True, text=True,
        )
        want = rt.declared_pins().get("numpy")
        if probe.returncode != 0 or probe.stdout.strip() != want:
            raise AssertionError(
                f"{sys.executable} has numpy {probe.stdout.strip() or 'missing'}, the content is "
                f"pinned to {want}. A verdict from any other interpreter says nothing about CI; "
                "run this under .venv-content."
            )
        cls.blocks = benchmark_blocks()

    def test_both_benchmarks_are_found(self) -> None:
        """The theory block and the We Do demo. If the lesson is reshaped so that neither is found,
        the other tests below would pass over nothing."""
        printed = {a["expected_output"].splitlines()[-1] for a in self.blocks}
        self.assertEqual(printed, {"ratio_gt_1 True"})
        self.assertGreaterEqual(len(self.blocks), 2, [a["artifact_id"] for a in self.blocks])
        self.assertTrue(any("np.dot" in a["code"] for a in self.blocks))
        self.assertTrue(any("@" in a["code"] for a in self.blocks))

    def test_every_block_runs_cleanly_without_the_shim(self) -> None:
        """The control: with no cold start added, each block must exit 0, so a failure below is
        the shim's doing and not a missing package or a typo."""
        for art in self.blocks:
            with self.subTest(block=art["artifact_id"]):
                run = run_snippet(art["code"], cold_first_call=False)
                self.assertEqual(run.returncode, 0, run.stderr[-800:])
                self.assertNotIn(PAID, run.stderr)

    def test_a_slow_first_blas_call_does_not_flip_the_pinned_ratio(self) -> None:
        for art in self.blocks:
            with self.subTest(block=art["artifact_id"]):
                run = run_snippet(art["code"], cold_first_call=True)
                self.assertEqual(run.returncode, 0, run.stderr[-800:])
                self.assertIn(PAID, run.stderr, "the shim never fired: this block no longer "
                              "calls np.dot or `@` on the arrays it builds, so nothing was delayed")
                verdict = strict.compare(art["expected_output"], run.stdout, run.stdout)
                self.assertEqual(
                    verdict["verdict"], "match",
                    f"{art['artifact_id']} pins {art['expected_output']!r} but printed "
                    f"{run.stdout!r} when the first BLAS call took {COLD_START_SECONDS} s: its "
                    f"timed region contains that call. {verdict}",
                )


if __name__ == "__main__":
    unittest.main()
