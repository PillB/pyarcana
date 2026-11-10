"""C2 (reval S01-RT-007): `git restore` must not be called non-destructive in S01.

It permanently discards uncommitted edits to the file. The section now says so, names the two
ways to keep the edit first, and carries a runnable counterexample whose pinned output is checked
here by actually running git in a scratch repository.
"""

from __future__ import annotations

import os
import re
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s01-setup.ts"


def _restore_paragraph(source: str) -> str:
    """The theory paragraph that introduces `git restore` (S01-T3-B): one TS string per line."""
    matches = re.findall(r"^\s*'([^\n]*`git restore archivo`[^\n]*)',$", source, re.M)
    if len(matches) != 1:
        raise AssertionError(f"expected one restore paragraph, found {len(matches)}")
    return matches[0]


def _transcript_block(source: str) -> tuple[str, str]:
    """The (code, output) pair of the block titled restore_vs_stash.sh."""
    pattern = re.compile(
        r"title:\s*'restore_vs_stash\.sh',\s*code:\s*`(?P<code>.*?)`,\s*output:\s*`(?P<output>.*?)`",
        re.S,
    )
    match = pattern.search(source)
    if match is None:
        raise AssertionError("the restore/stash counterexample block is missing")
    return match.group("code"), match.group("output")


class S01RestoreWarningTests(unittest.TestCase):
    def test_restore_is_not_called_non_destructive(self) -> None:
        paragraph = _restore_paragraph(SECTION.read_text(encoding="utf-8"))
        self.assertNotIn("no destructiva", paragraph.lower())
        self.assertNotIn("Recuperación **no destructiva**", paragraph)

    def test_no_s01_text_calls_recovery_non_destructive(self) -> None:
        # The recovery exercise (S01-T3-B) said "recuperación no destructiva" while its solution uses
        # `git restore`, which discards the edit. What it avoids is destroying history.
        source = SECTION.read_text(encoding="utf-8").lower()
        self.assertNotIn("no destructiv", source)

    def test_restore_warning_says_the_edit_is_lost_and_names_the_two_ways_out(self) -> None:
        paragraph = _restore_paragraph(SECTION.read_text(encoding="utf-8"))
        # Non-vacuity: the paragraph really is the one about restore, not an empty match.
        self.assertIn("`git restore archivo`", paragraph)
        self.assertIn("permanente", paragraph)
        self.assertIn("no guarda copia", paragraph)
        self.assertIn("`git diff archivo`", paragraph)
        self.assertIn("`git stash`", paragraph)

    def test_transcript_output_is_what_git_really_prints(self) -> None:
        code, pinned = _transcript_block(SECTION.read_text(encoding="utf-8"))
        env = dict(os.environ)
        env.update(
            GIT_AUTHOR_NAME="curso",
            GIT_AUTHOR_EMAIL="curso@example.invalid",
            GIT_COMMITTER_NAME="curso",
            GIT_COMMITTER_EMAIL="curso@example.invalid",
        )
        with tempfile.TemporaryDirectory() as tmp:
            script = Path(tmp, "restore_vs_stash.sh")
            script.write_text(code + "\n", encoding="utf-8")
            run_dir = Path(tmp, "run")
            run_dir.mkdir()
            result = subprocess.run(
                ["bash", str(script)], cwd=run_dir, env=env, capture_output=True, text=True, timeout=60
            )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.strip(), pinned.strip())

    def test_transcript_shows_restore_losing_the_edit_and_stash_keeping_it(self) -> None:
        code, _ = _transcript_block(SECTION.read_text(encoding="utf-8"))
        self.assertIn("git restore notas.md", code)
        self.assertIn('git stash push -q -m "wip"', code)
        self.assertIn("git stash pop -q", code)


if __name__ == "__main__":
    unittest.main()
