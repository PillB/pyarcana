"""C1 (reval NEW-S03-1): S03 teaches `is None`, so its Python must not compare with `== None`.

The one exception is the counterexample block, which D24 requires to show the `== None` failure.
That block is labelled `# Error`, and the scan skips it by label, not by line number.
"""

from __future__ import annotations

import ast
import re
import subprocess
import sys
import textwrap
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s03-decisions-rules.ts"

#: `language: 'python', title: '...', <code|starterCode|solutionCode>: { ... code: `...` }`
_PY_BLOCK = re.compile(r"language:\s*'python',[^`]*?code:\s*`((?:\\.|[^`\\])*)`", re.S)


def python_blocks(source: str) -> list[str]:
    """Every Python code block of the section, with TS template escapes undone."""
    out = []
    for match in _PY_BLOCK.finditer(source):
        raw = match.group(1)
        out.append(raw.replace("\\`", "`").replace("\\${", "${").replace("\\\\", "\\"))
    return out


def eq_none_hits(code: str) -> list[int]:
    """Line numbers of `==` or `!=` comparisons against the literal None."""
    tree = ast.parse(code)
    hits = []
    for node in ast.walk(tree):
        if not isinstance(node, ast.Compare):
            continue
        for op, right in zip(node.ops, node.comparators):
            if isinstance(op, (ast.Eq, ast.NotEq)) and (
                _is_none(right) or _is_none(node.left)
            ):
                hits.append(node.lineno)
    return hits


def _is_none(node: ast.AST) -> bool:
    return isinstance(node, ast.Constant) and node.value is None


class S03NoneIdentityTests(unittest.TestCase):
    def test_no_section_python_compares_to_none_with_equality(self) -> None:
        blocks = python_blocks(SECTION.read_text(encoding="utf-8"))
        # A floor, so a scan that found nothing cannot pass: S03 has 69 Python blocks.
        self.assertGreaterEqual(len(blocks), 60)
        offenders = []
        for index, code in enumerate(blocks):
            if "# Error" in code:
                continue  # the D24 counterexample, which shows the failure on purpose
            for line in eq_none_hits(code):
                offenders.append((index, line, code.splitlines()[line - 1].strip()))
        self.assertEqual(offenders, [], "S03 must compare with `is None`, not `== None`")

    def test_counterexample_block_exists_and_still_shows_the_equality_failure(self) -> None:
        """The exclusion above is only fair if the excluded block really contains the `== None`."""
        blocks = python_blocks(SECTION.read_text(encoding="utf-8"))
        labelled = [code for code in blocks if "# Error" in code]
        matching = [code for code in labelled if eq_none_hits(code)]
        self.assertEqual(len(matching), 1, "exactly one `# Error` block may carry `== None`")
        self.assertIn("is None", matching[0], "the `# Corrección` half must use `is None`")

    def test_counterexample_runs_and_prints_the_pinned_output(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        block = next(b for b in python_blocks(source) if eq_none_hits(b))
        result = subprocess.run(
            [sys.executable, "-I", "-c", block], capture_output=True, text=True, timeout=30
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(
            result.stdout,
            "== None → review: ausente\nis None → accept: presente\n",
        )

    # Negative controls: the detector must flag what it claims to flag, or the scan passes vacuously.
    def test_negative_control_detector_flags_equality_and_inequality(self) -> None:
        self.assertEqual(eq_none_hits("x = 1\nif x == None:\n    pass\n"), [2])
        self.assertEqual(eq_none_hits("if None != y:\n    pass\n"), [1])

    def test_negative_control_detector_passes_identity(self) -> None:
        self.assertEqual(eq_none_hits(textwrap.dedent("""
            x = 0
            if x is None or x is not None:
                pass
            """)), [])
        # `== 0` and `== ""` are not comparisons with None.
        self.assertEqual(eq_none_hits('print(x == 0, y == "")\n'), [])


if __name__ == "__main__":
    unittest.main()
