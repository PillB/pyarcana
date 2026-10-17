"""Run a check written as a `main()` script as a unittest test.

`unittest discover` collects TestCase classes and nothing else. Twelve checks in this folder
were written as scripts whose `main()` returns 0 or 1 - capstone cardinality, claim evidence,
credential tamper resistance, maintainer PII and more - so each one imported cleanly,
contributed no test, and had never run in CI or in the fixer gate while the suite's count read
as if it had. Each now ends with a TestCase that calls its `main()` through this helper.
"""
from __future__ import annotations

import contextlib
import io
import unittest
from typing import Callable


def assert_main_passes(case: unittest.TestCase, main: Callable[[], int]) -> None:
    """`main()` must return 0. What it printed becomes the failure message."""
    out = io.StringIO()
    try:
        with contextlib.redirect_stdout(out), contextlib.redirect_stderr(out):
            code = main()
    except SystemExit as stop:
        code = stop.code
    except AssertionError as error:
        case.fail(f"{error}\n{out.getvalue()[-3000:]}")
    case.assertEqual(code, 0, f"main() returned {code!r}:\n{out.getvalue()[-3000:]}")
