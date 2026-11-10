"""Every S10 sentence that states the config precedence orders the layers the same way.

The canonical order is flags > env > file > defaults (S10-034). The intro (jobRelevance) said
flags > file > env, while the outcomes, theory, README and self-check said flags > env > file.
A learner who reads the first statement is taught the wrong rule.

The check reads the section source line by line. A line that talks about precedence must name
the environment layer before the file layer. Quiz distractors are wrong on purpose, so the
`options:` lines are excluded, and the correct option of that question is checked separately.
"""

from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s10-modules-packaging-cli.ts"

PRECEDENCE_CUE = re.compile(r"precedencia|pisa|flags?\s*(CLI)?\s*>", re.IGNORECASE)
ENV_LAYER = re.compile(r"entorno|\benv\b", re.IGNORECASE)
FILE_LAYER = re.compile(r"archivo|\bfile\b", re.IGNORECASE)


def file_before_env(line: str) -> bool:
    """True when a precedence statement in `line` names the file layer before the env layer."""
    env = ENV_LAYER.search(line)
    file_ = FILE_LAYER.search(line)
    return bool(env and file_ and file_.start() < env.start())


def precedence_clauses(source: str) -> list[str]:
    """The text from each precedence cue to the end of its line, where the layers are named.

    Only the clause after the cue is the statement of precedence; words before it (a file
    name in the same sentence, say) are not ordered by the rule.
    """
    clauses = []
    for line in source.splitlines():
        if "options:" in line:
            continue  # quiz distractors: the wrong orders are written here on purpose
        cue = PRECEDENCE_CUE.search(line)
        if cue is None:
            continue
        clause = line[cue.start():]
        if ENV_LAYER.search(clause) or FILE_LAYER.search(clause):
            clauses.append(clause)
    return clauses


class S10PrecedenceText(unittest.TestCase):
    def test_no_s10_statement_orders_file_before_env(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        checked = precedence_clauses(source)
        # Non-vacuity: the section states the rule in several places, so the scan must see them.
        self.assertGreaterEqual(len(checked), 4, checked)
        offenders = [clause[:160] for clause in checked if file_before_env(clause)]
        self.assertEqual(offenders, [], "S10 states the precedence with the file layer first")

    def test_intro_states_the_canonical_order(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        self.assertIn(
            "la opción de línea de comandos pisa a la variable de entorno, y esta al archivo de configuración",
            source,
        )

    def test_self_check_correct_option_is_canonical(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        match = re.search(
            r'question: "¿Cuál es la precedencia correcta de configuración\?",\s*'
            r"options: \[(?P<options>[^\]]*)\],\s*correctIndex: (?P<idx>\d+)",
            source,
        )
        self.assertIsNotNone(match, "precedence self-check question not found")
        options = re.findall(r'"([^"]*)"', match.group("options"))
        self.assertEqual(options[int(match.group("idx"))], "flags > env > file > defaults")

    def test_detector_flags_the_defect_and_passes_the_fix(self) -> None:
        # Negative control: the detector must still see the old wording as wrong, or the scan above is vacuous.
        old = "la opción de línea de comandos pisa a la del archivo y esta a la del entorno"
        new = "la opción de línea de comandos pisa a la variable de entorno, y esta al archivo de configuración"
        self.assertTrue(file_before_env(old))
        self.assertFalse(file_before_env(new))
        self.assertFalse(file_before_env("Precedencia canónica: flags CLI > variables de entorno > archivo"))


if __name__ == "__main__":
    unittest.main()
