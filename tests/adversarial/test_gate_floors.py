#!/usr/bin/env python3
"""The content gates CI runs must fail on nothing, and on the defect each one names.

Each gate runs for real: its own script, from a temporary root holding only the files it reads,
against a passing control, its own counterexample, and its population emptied. Before these
tests, three of the gates passed on an empty population and the fourth passed against a
background colour it made up, so a green run could mean that nothing was measured.
"""
from __future__ import annotations

import contextlib
import importlib.util
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
#: A gate run's lock must not reach a gate running in a temporary root of its own.
SCRUBBED = ("PYARCANA_REPORT_LOCK_PATH", "PYARCANA_REPORT_LOCK")
STYLESHEET = (ROOT / "src/app/globals.css").read_text(encoding="utf-8")


def run_gate(script: str, files: dict[str, str], *, also: tuple[str, ...] = ()) -> subprocess.CompletedProcess:
    """Run scripts/<script> (and copies of `also`) from a temporary root holding `files`."""
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        for rel in (f"scripts/{script}", *also):
            (root / rel).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / rel, root / rel)
        for rel, text in files.items():
            (root / rel).parent.mkdir(parents=True, exist_ok=True)
            (root / rel).write_text(text, encoding="utf-8")
        (root / "course-state").mkdir(exist_ok=True)
        interpreter = "node" if script.endswith(".mjs") else sys.executable
        env = {k: v for k, v in os.environ.items() if k not in SCRUBBED}
        return subprocess.run([interpreter, str(root / "scripts" / script)], cwd=root, env=env,
                              capture_output=True, text=True, check=False)


def printed(result: subprocess.CompletedProcess) -> dict:
    """The JSON a gate prints. A gate that crashed printed none, and this raises."""
    return json.loads(result.stdout)


I18N = """export const MESSAGES = {
  'es-PE': {
    'nav.home': 'Inicio',
  },
  'es-ES': {
    'nav.home': 'Inicio',
  },
  'en': {
    'nav.home': 'Home',
  },
}
"""


class I18nParityFloor(unittest.TestCase):
    def run_with(self, text: str) -> subprocess.CompletedProcess:
        return run_gate("i18n_parity_check.mjs", {
            "src/lib/i18n.ts": text,
            "src/components/course/Lesson.tsx": "export const lesson = 1\n",
        })

    def test_three_languages_holding_the_same_keys_pass(self) -> None:
        result = self.run_with(I18N)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_a_key_one_language_lacks_fails(self) -> None:
        result = self.run_with(I18N.replace("'nav.home': 'Home'", "'nav.inicio': 'Home'"))
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_language_blocks_it_cannot_find_fail_instead_of_agreeing(self) -> None:
        text = I18N
        for lang in ("es-PE", "es-ES", "en"):
            text = text.replace(f"'{lang}'", f'"{lang}"')
        result = self.run_with(text)
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertEqual(printed(result)["empty"], ["es-PE", "es-ES", "en"])


class ThemeTokenFloor(unittest.TestCase):
    """This gate checks that the theme tokens exist; it computes no contrast (axe does that)."""

    def run_with(self, css: str) -> subprocess.CompletedProcess:
        return run_gate("a11y_contrast_check.mjs", {"src/app/globals.css": css})

    def test_the_real_stylesheet_passes(self) -> None:
        result = self.run_with(STYLESHEET)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_a_required_token_removed_fails(self) -> None:
        css, removed = re.subn(r"^[ \t]*--primary:[^\n]*\n", "", STYLESHEET, flags=re.M)
        self.assertGreater(removed, 0, "the stylesheet no longer declares --primary")
        self.assertEqual(self.run_with(css).returncode, 1)

    def test_a_stylesheet_without_theme_blocks_fails(self) -> None:
        self.assertEqual(self.run_with("body { color: black; }\n").returncode, 1)


class CodeSyntaxContrastFloor(unittest.TestCase):
    def run_with(self, css: str) -> subprocess.CompletedProcess:
        return run_gate("code_syntax_contrast_check.mjs", {"src/app/globals.css": css})

    def token(self, name: str, value: str | None) -> str:
        """The stylesheet with --<name> set to `value`, or its line removed when value is None."""
        line = re.compile(rf"^([ \t]*--{name}:)[^;\n]*;[^\n]*\n", re.M)
        self.assertRegex(STYLESHEET, line, f"the stylesheet no longer declares --{name}")
        return line.sub("" if value is None else rf"\g<1> {value};\n", STYLESHEET, count=1)

    def test_the_real_stylesheet_passes(self) -> None:
        result = self.run_with(STYLESHEET)
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_a_comment_colour_too_close_to_the_background_fails(self) -> None:
        result = self.run_with(self.token("code-comment", "oklch(0.22 0.02 260)"))
        self.assertEqual(result.returncode, 1, result.stdout)
        failed = [r["name"] for r in printed(result)["results"] if not r["ok"]]
        self.assertEqual(failed, ["code-comment"])

    def test_a_missing_background_fails_instead_of_using_a_stand_in(self) -> None:
        result = self.run_with(self.token("code-bg", None))
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertIn("code-bg", [r["name"] for r in printed(result)["results"] if not r["ok"]])

    def test_a_colour_it_cannot_read_fails_cleanly(self) -> None:
        result = self.run_with(self.token("code-fg", "#ffffff"))
        self.assertEqual(result.returncode, 1, result.stderr)
        verdicts = {r["name"]: r for r in printed(result)["results"]}
        self.assertEqual(verdicts["code-fg"]["error"], "not comparable")


class SyntheticIdentifierFloor(unittest.TestCase):
    INDEX = "import { setup } from './sections/s01-setup'\n"
    CLEAN = "export const ejemplo = { edad: 34, codigo: 12345678 }\n"
    DNI = "export const cliente = { dni: '12345678' }\n"

    def run_with(self, index: str, sections: dict[str, str]) -> subprocess.CompletedProcess:
        files = {"src/lib/course/index.ts": index}
        files.update({f"src/lib/course/sections/{name}.ts": text for name, text in sections.items()})
        return run_gate("synthetic_identifier_audit.py", files, also=("scripts/report_lock.py",))

    def test_a_section_without_identifiers_passes(self) -> None:
        result = self.run_with(self.INDEX, {"s01-setup": self.CLEAN})
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)
        self.assertEqual(printed(result)["files_scanned"], 1)

    def test_an_eight_digit_value_beside_dni_wording_fails(self) -> None:
        self.assertEqual(self.run_with(self.INDEX, {"s01-setup": self.DNI}).returncode, 1)

    def test_an_import_in_double_quotes_is_still_scanned(self) -> None:
        result = self.run_with(self.INDEX.replace("'", '"'), {"s01-setup": self.DNI})
        self.assertEqual(result.returncode, 1, result.stdout)

    def test_no_wired_section_fails(self) -> None:
        result = self.run_with("export const COURSE_SECTIONS = []\n", {"s01-setup": self.DNI})
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertEqual(printed(result)["files_scanned"], 0)

    def test_a_wired_section_that_is_not_there_fails(self) -> None:
        index = self.INDEX + "import { gone } from './sections/s02-gone'\n"
        result = self.run_with(index, {"s01-setup": self.CLEAN})
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertEqual(printed(result)["unreadable"], ["src/lib/course/sections/s02-gone.ts"])


def event(order: int, *, mentions: tuple[str, ...] = (), defines: tuple[str, ...] = ()) -> dict:
    return {"section_id": "s01", "display_order": order, "learner_visible": True,
            "kind": "theory.paragraph", "location": f"s01.theory[{order}].p1",
            "mentions": list(mentions), "defines": list(defines), "requires": []}


class FirstUseAllFloor(unittest.TestCase):
    """The extraction itself needs the whole course; the verdict over it does not."""

    def verdict(self, payload: dict) -> tuple[int, dict]:
        spec = importlib.util.spec_from_file_location("first_use_all_audit",
                                                      ROOT / "scripts/first_use_all_audit.py")
        mod = importlib.util.module_from_spec(spec)
        assert spec.loader
        spec.loader.exec_module(mod)
        with tempfile.TemporaryDirectory() as tmp:
            out = Path(tmp) / "course-state/first_use_all_report.json"
            with mock.patch.object(mod, "build_events", return_value=payload), \
                    mock.patch.object(mod, "ROOT", Path(tmp)), mock.patch.object(mod, "OUT", out), \
                    contextlib.redirect_stdout(io.StringIO()):
                code = mod.main()
            return code, json.loads(out.read_text(encoding="utf-8"))

    def payload(self, *events: dict) -> dict:
        return {"active_section_ids": ["s01"], "terms": [{"id": "variable", "firstSectionId": "s01"}],
                "events": list(events)}

    def test_a_term_defined_before_its_use_passes(self) -> None:
        code, report = self.verdict(self.payload(
            event(0, mentions=("variable",), defines=("variable",)), event(1, mentions=("variable",))))
        self.assertEqual(code, 0, report["issues"])

    def test_a_use_before_the_definition_fails(self) -> None:
        code, report = self.verdict(self.payload(
            event(0, mentions=("variable",)), event(1, mentions=("variable",), defines=("variable",))))
        self.assertEqual(code, 1)
        self.assertEqual([i["code"] for i in report["issues"]], ["USE_BEFORE_DEFINITION"])

    def test_an_empty_extraction_fails(self) -> None:
        code, report = self.verdict({"active_section_ids": [], "terms": [], "events": []})
        self.assertEqual(code, 1)
        self.assertEqual(report["empty_populations"], ["active_section_ids", "terms", "events"])


if __name__ == "__main__":
    unittest.main()
