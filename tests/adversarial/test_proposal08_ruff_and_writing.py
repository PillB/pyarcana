"""Proposal 08 (approved 2026-11-10): the S01 Ruff output, then a writing pass.

The Ruff tests run the real `ruff` on the exact lines the lesson shows, so the panel cannot
drift from what a learner's terminal prints. The writing tests measure sentences with the
prose audit's own splitter, so "no sentence over 32 words" means what the audit means.
"""

from __future__ import annotations

import importlib.util
import json
import re
import shutil
import subprocess
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
S01 = SECTIONS / "s01-setup.ts"
LESSON_RUFF_CONFIG = '[tool.ruff]\nline-length = 88\n\n[tool.ruff.lint]\nselect = ["E", "F", "I"]\n'
# The last line of concise output differs by version ("with the `--fix` option" in 0.16,
# "with `--fix`" in 0.17), so the lesson elides it and the tests drop it too.
FIXABLE = re.compile(r"^\[\*\] \d+ fixable with")


def _read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def _between(text: str, start: str, end: str) -> str:
    i = text.index(start)
    return text[i : text.index(end, i + len(start))]


def _ruff() -> str:
    ruff = shutil.which("ruff")
    if ruff is None:
        raise AssertionError("ruff is not on PATH: the check cannot run, so this is not a pass")
    return ruff


def _run_ruff(source: str) -> subprocess.CompletedProcess[str]:
    with tempfile.TemporaryDirectory() as tmp:
        Path(tmp, "pyproject.toml").write_text(LESSON_RUFF_CONFIG, encoding="utf-8")
        Path(tmp, "hello_lint.py").write_text(source, encoding="utf-8")
        return subprocess.run(
            [_ruff(), "check", "--output-format", "concise", "hello_lint.py"],
            cwd=tmp,
            capture_output=True,
            text=True,
        )


def _printed(result: subprocess.CompletedProcess[str]) -> list[str]:
    return [line for line in result.stdout.splitlines() if line and not FIXABLE.match(line)]


class RuffDemoMatchesRuff(unittest.TestCase):
    """Items 1-2: the I Do panel showed one line where the learner's terminal showed 29."""

    def setUp(self) -> None:
        demo = _between(_read(S01), "demoId: 'S01-T4-A-DEMO'", "why:")
        self.code = _between(demo, "code: `", "`,\n          output:")
        self.output = _between(demo, "output: `", "`,").removeprefix("output: `")
        # The file the learner types, as the comment block lists it.
        listed = _between(self.code, "# Contenido inicial de hello_lint.py", "\n\n")
        self.file = "\n".join(line[2:] if line.startswith("# ") else "" for line in listed.split("\n")[1:]) + "\n"

    def test_the_listed_file_is_the_one_with_a_blank_line(self) -> None:
        self.assertEqual(self.file, 'import sys\n\nprint("hola")\n')

    def test_the_panel_is_what_ruff_prints(self) -> None:
        first = _run_ruff(self.file)
        self.assertEqual(first.returncode, 1, first.stdout + first.stderr)
        fixed = _run_ruff(self.file.replace("import sys\n\n", ""))
        self.assertEqual(fixed.returncode, 0, fixed.stdout + fixed.stderr)
        expected = _printed(first) + ["..."] + _printed(fixed)
        panel = self.output.replace("\\`", "`").split("\n")
        self.assertEqual(panel, expected)
        self.assertEqual(panel[:2], ["hello_lint.py:1:8: F401 [*] `sys` imported but unused", "Found 1 error."])

    def test_negative_control_the_old_file_also_gives_i001(self) -> None:
        old = _run_ruff('import sys\nprint("hola")\n')
        self.assertEqual(old.returncode, 1)
        self.assertIn("I001", old.stdout)

    def test_the_commands_use_concise_output_and_the_preamble_says_why(self) -> None:
        self.assertEqual(self.code.count("python -m ruff check --output-format concise hello_lint.py"), 2)
        self.assertIn("`--output-format concise` pide una línea por hallazgo", _read(S01))
        self.assertIn("`[*]` marca un hallazgo que `ruff check --fix` podría corregir solo", _read(S01))


class E2HintStaysTrue(unittest.TestCase):
    def test_the_i001_hint_is_there_and_the_starter_still_needs_it(self) -> None:
        block = _between(_read(S01), "id: 'S01-T4-A-E2'", "id: 'S01-T4-A-E3'")
        self.assertIn("Si después de borrar los imports Ruff marca `I001`, revisa las líneas en blanco", block)
        starter = _between(block, "starterCode: {", "solutionCode:")
        starter = _between(starter, "code: `", "`,").removeprefix("code: `")
        without_unused = starter.replace("import sys\n", "").replace("import os\n", "")
        result = _run_ruff(without_unused)
        self.assertEqual(result.returncode, 1, "if the starter stops tripping I001, the hint is stale")
        self.assertIn("I001", result.stdout)
        self.assertNotIn("F401", result.stdout)


def _prose_audit():
    spec = importlib.util.spec_from_file_location("prose_quality_audit", ROOT / "scripts" / "prose_quality_audit.py")
    module = importlib.util.module_from_spec(spec)
    assert spec.loader is not None
    spec.loader.exec_module(module)
    return module


PROSE = {
    "theory.paragraph", "jobRelevance", "tagline", "outcome", "theory.callout", "ido.why",
    "ido.preamble", "ido.retrospective", "wedo.preamble", "wedo.instruction", "youdo.context",
}


class NoLongSentencesInS01AndS11(unittest.TestCase):
    """Items 3-5: measured on freshly extracted events, with the audit's own splitter."""

    @classmethod
    def setUpClass(cls) -> None:
        npx = shutil.which("npx")
        if npx is None:
            raise AssertionError("npx is not on PATH: the events cannot be extracted")
        run = subprocess.run(
            [npx, "tsx", "scripts/course_event_extractor.mts"], cwd=ROOT, capture_output=True, text=True
        )
        if run.returncode != 0:
            raise AssertionError(run.stderr[-2000:])
        payload = json.loads(run.stdout)
        audit = _prose_audit()
        by_section: dict[str, list[str]] = {}
        for e in payload["events"]:
            if e["kind"] in PROSE and e["learner_visible"]:
                by_section.setdefault(e["section_id"], []).append(e["text"])
        cls.long = {}
        for slug, texts in by_section.items():
            text = "\n".join(audit.terminated(t) for t in texts)
            cls.long[slug] = [s for s in audit.sentences(text) if len(re.findall(r"\b\w+\b", s)) > 32]

    def test_s01_and_s11_have_none(self) -> None:
        self.assertEqual(self.long["setup"], [])
        self.assertEqual(self.long["oop-domain"], [])

    def test_negative_control_the_measure_still_finds_long_sentences_elsewhere(self) -> None:
        # Sections this proposal leaves alone still have some, so an empty result above is not
        # a broken extractor.
        self.assertGreater(len(self.long["evidence-dashboard"]), 0)


class S11Glosses(unittest.TestCase):
    def setUp(self) -> None:
        self.s11 = _read(SECTIONS / "s11-oop-domain.ts")

    def test_hash_gloss_sits_next_to_hash(self) -> None:
        self.assertIn("Eso habilita un hash seguro, el número fijo que Python usa para ubicar el objeto", self.s11)
        self.assertNotIn("(un número fijo que Python usa", self.s11)

    def test_invariante_is_masculine(self) -> None:
        self.assertNotIn("las invariantes", self.s11)
        self.assertNotIn("no revalida el mundo", self.s11)


class BridgeLabelsGone(unittest.TestCase):
    def test_no_puente_label_in_s02_s03_s05(self) -> None:
        for name in ("s02-basics.ts", "s03-decisions-rules.ts", "s05-functions-contracts.ts"):
            with self.subTest(section=name):
                self.assertNotIn("**Puente desde", _read(SECTIONS / name))


class S01RepetitionCut(unittest.TestCase):
    def setUp(self) -> None:
        self.s01 = _read(S01)

    def test_git_block_uses_one_name_for_a_commit(self) -> None:
        git = _between(self.s01, "heading: 'Git: commits y lectura de diffs'", "heading:")
        self.assertNotIn("fotografía", git)
        self.assertIn("Los bloques anteriores ya separaron sus tres pasos", git)

    def test_repeated_explanations_are_recalls(self) -> None:
        self.assertNotIn("El prefijo `python -m` es causal", self.s01)
        self.assertNotIn("**origin** es solo el apodo convencional", self.s01)
        self.assertIn("La rama y el PR del bloque anterior responden a ese riesgo", self.s01)
        # The definitions they recall are still there, one block earlier.
        self.assertIn("**origin** es el nombre corto que Git usará para esa dirección", self.s01)
        self.assertIn("**rama** es una línea de trabajo separada dentro del historial", self.s01)


if __name__ == "__main__":
    unittest.main()
