"""The lint job runs both complexity ratchets, and fails when either baseline is left untightened.

Read as text, not parsed: the job is the block from `  lint:` to `  typecheck:`, and each
assertion names the step it guards. A ratchet that tightens its baseline only on the runner
discards the write, so the diff step is what makes the tightened baseline part of the PR.
"""
from __future__ import annotations

import json
import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
WORKFLOW = (ROOT / ".github/workflows/tests.yml").read_text(encoding="utf-8")
LESSONS = (ROOT / "docs/agents/lessons.md").read_text(encoding="utf-8")
SCRIPTS = json.loads((ROOT / "package.json").read_text(encoding="utf-8"))["scripts"]
GATES = ("scripts/complexity_gate.mjs", "scripts/complexity_gate_py.py")


def lint_job() -> str:
    start = WORKFLOW.index("\n  lint:\n")
    return WORKFLOW[start:WORKFLOW.index("\n  typecheck:\n", start)]


class LintJobRunsBothRatchets(unittest.TestCase):
    def test_the_typescript_ratchet_still_runs_with_its_diff_check(self):
        job = lint_job()
        self.assertIn("node scripts/complexity_gate.mjs", job)
        self.assertIn("git diff --exit-code audit/fixer/complexity_baseline.json", job)

    def test_the_python_ratchet_runs_in_the_lint_job(self):
        self.assertIn("\n          python3 scripts/complexity_gate_py.py\n", lint_job())

    def test_python_3_12_is_set_up_before_the_python_ratchet_runs(self):
        job = lint_job()
        self.assertIn("actions/setup-python@v5", job)
        self.assertIn("python-version: '3.12'", job)
        self.assertLess(job.index("actions/setup-python@v5"),
                        job.index("\n          python3 scripts/complexity_gate_py.py\n"))

    def test_a_tightened_python_baseline_must_be_committed(self):
        self.assertIn("git diff --exit-code audit/fixer/complexity_baseline_py.json", lint_job())


def complexity_lessons() -> str:
    start = LESSONS.index("## chore(lint): cyclomatic complexity ceiling")
    return LESSONS[start:LESSONS.index("\n## ", start + 1)]


class DocsAndScriptsMatchTheGates(unittest.TestCase):
    """What tells people how to run the gates must match the gates. The lessons once documented
    `--update`, which the gate ignores, and AGENTS.md and package.json named only the TypeScript gate."""

    def test_every_flag_the_lessons_document_for_a_gate_is_one_the_gate_takes(self):
        section = complexity_lessons()
        documented = 0
        for gate in GATES:
            source = (ROOT / gate).read_text(encoding="utf-8")
            for flag in re.findall(rf"{re.escape(gate)}\s+(--[a-z]+)", section):
                documented += 1
                quoted = f'"{flag}"' if gate.endswith(".py") else f"'{flag}'"
                self.assertTrue(quoted in source,
                                f"lessons.md documents `{gate} {flag}`, which the gate does not take")
        self.assertGreaterEqual(documented, 2, "the lessons should show at least --init for each gate")

    def test_each_ratchet_has_a_package_script(self):
        self.assertIn("scripts/complexity_gate.mjs", SCRIPTS.get("lint:complexity", ""),
                      "package.json has no lint:complexity script for the TypeScript ratchet")
        self.assertIn("scripts/complexity_gate_py.py", SCRIPTS.get("lint:complexity:py", ""),
                      "package.json has no lint:complexity:py script for the Python ratchet")


def fenced_after(path: str, heading: str) -> list[str]:
    """The commands in the first fenced block after `heading`, comments and spacing removed."""
    text = (ROOT / path).read_text(encoding="utf-8")
    start = text.index("```", text.index(heading))
    body = text[text.index("\n", start) + 1:text.index("\n```", start)]
    return [line.split("#")[0].strip() for line in body.splitlines()]


class DoneListsNameBothRatchets(unittest.TestCase):
    """Owner decision O25: what an agent must run before calling work done names the Python
    ratchet on the line under the TypeScript one, under python3.12, the only interpreter the
    gate gives a verdict under."""

    PYTHON_GATE = "python3.12 scripts/complexity_gate_py.py"

    def assert_python_gate_under_typescript_gate(self, path: str, heading: str) -> None:
        commands = fenced_after(path, heading)
        under = commands.index("node scripts/complexity_gate.mjs") + 1
        self.assertEqual(commands[under] if under < len(commands) else None, self.PYTHON_GATE,
                         f"{path} ({heading}) names the TypeScript ratchet but not the Python one under it")

    def test_agents_md_done_means_these_pass_names_the_python_ratchet(self):
        self.assert_python_gate_under_typescript_gate("AGENTS.md", "## Done means these pass")

    def test_claude_md_verification_block_names_the_python_ratchet(self):
        self.assert_python_gate_under_typescript_gate("CLAUDE.md", "## Verifying content")


if __name__ == "__main__":
    unittest.main()
