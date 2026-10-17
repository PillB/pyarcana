"""The playground's warning filter: PLAYGROUND_PRELUDE in src/lib/pyodide.ts.

Defect (named): Pyodide 0.26.2 ships pandas 2.2.0 without pyarrow, so the learner's `import pandas`
writes a DeprecationWarning, and CodePlayground prints all of stderr in red. The prelude must
silence exactly that warning, run once after Pyodide loads and before any learner code.

Each test below is proved red by a named mutation; see the commit message that adds this file.
"""
from __future__ import annotations

import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(Path(__file__).resolve().parent))

from playground_truth import playground  # noqa: E402

#: The text pandas 2.2.0 passes to warnings.warn() when pyarrow is not installed. Copied from
#: pandas/__init__.py (the `pa_not_found` branch of the pyarrow check): the f-string's
#: `{pa_msg}` is "was not found to be installed on your system.", and the closing `"""` sits
#: at eight spaces, so the message ends in a newline and eight spaces.
PANDAS_PYARROW_WARNING = (
    "\nPyarrow will become a required dependency of pandas in the next major release of pandas (pandas 3.0),\n"
    "(to allow more performant data types, such as the Arrow string type, and better interoperability with other libraries)\n"
    "but was not found to be installed on your system.\n"
    "If this would cause problems for you,\n"
    "please provide us feedback at https://github.com/pandas-dev/pandas/issues/54466\n"
    "        "
)


def stderr_of(code: str) -> str:
    """Stderr of `python -c code` on this test's interpreter, the same CPython the prelude runs on."""
    proc = subprocess.run([sys.executable, "-c", code], capture_output=True, text=True, timeout=60)
    if proc.returncode != 0:
        raise AssertionError(f"snippet exited {proc.returncode}: {proc.stderr}")
    return proc.stderr


def warn_from_main(message: str) -> str:
    """Code that issues a DeprecationWarning from __main__, where CPython shows it by default."""
    return f"import warnings\nwarnings.warn({message!r}, DeprecationWarning)\n"


class PreludeSilencesOnlyThePandasWarning(unittest.TestCase):
    def setUp(self) -> None:
        self.prelude = playground()["prelude"]

    def test_prelude_silences_the_pandas_pyarrow_warning(self) -> None:
        # Liveness first: a warning that never fires is also silent, so the silence below proves
        # nothing unless the same warning reaches stderr without the prelude.
        fires = stderr_of(warn_from_main(PANDAS_PYARROW_WARNING))
        self.assertIn(
            "Pyarrow will become a required dependency", fires,
            "the pandas warning does not fire without the prelude, so silence would prove nothing",
        )
        # Recreates the defect: with the prelude, this warning must not reach the playground's stderr.
        stderr = stderr_of(self.prelude + "\n" + warn_from_main(PANDAS_PYARROW_WARNING))
        self.assertEqual(stderr, "", "the pandas pyarrow warning reached stderr through PLAYGROUND_PRELUDE")

    def test_prelude_leaves_other_deprecation_warnings_visible(self) -> None:
        # Control against a blanket filter: an unrelated DeprecationWarning must still reach stderr.
        stderr = stderr_of(self.prelude + "\n" + warn_from_main("otro aviso"))
        self.assertIn("DeprecationWarning: otro aviso", stderr)


class CodePlaygroundRunsThePrelude(unittest.TestCase):
    """The prelude is only a fix if the playground runs it before the learner's code."""

    def test_prelude_runs_in_the_pyodide_load_before_the_playground_is_ready(self) -> None:
        src = (ROOT / "src/components/course/CodePlayground.tsx").read_text(encoding="utf-8")
        call = src.find("runPythonAsync(PLAYGROUND_PRELUDE)")
        self.assertNotEqual(call, -1, "CodePlayground never runs PLAYGROUND_PRELUDE")
        ready = src.find("setPyodideReady(true)")
        self.assertNotEqual(ready, -1)
        self.assertLess(call, ready, "PLAYGROUND_PRELUDE must run before the playground accepts code")


if __name__ == "__main__":
    unittest.main()
