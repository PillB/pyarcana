#!/usr/bin/env python3
"""The content gates CI runs must fail on nothing, and on the defect each one names.

Each gate runs for real: its own script, from a temporary root holding only the files it reads,
against a passing control, its own counterexample, and its population emptied. Before these
tests, three of the gates passed on an empty population and the fourth passed against a
background colour it made up, so a green run could mean that nothing was measured.
"""
from __future__ import annotations

import ast
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
#: A gate run's lock must not reach a gate running in a temporary root of its own.
SCRUBBED = ("PYARCANA_REPORT_LOCK_PATH", "PYARCANA_REPORT_LOCK")
STYLESHEET = (ROOT / "src/app/globals.css").read_text(encoding="utf-8")


def run_gate(script: str, files: dict[str, str], *, also: tuple[str, ...] = (),
             links: tuple[str, ...] = (), collect: tuple[str, ...] = ()) -> subprocess.CompletedProcess:
    """Run scripts/<script> (and copies of `also`) from a temporary root holding `files`.

    `links` are symlinked from the repository rather than copied: node_modules, for a gate that
    runs the real extractor through `npx tsx`. `collect` names files the gate writes; their text is
    read before the root is deleted and returned as `result.collected`.
    """
    with tempfile.TemporaryDirectory() as tmp:
        root = Path(tmp)
        for rel in links:
            (root / rel).parent.mkdir(parents=True, exist_ok=True)
            (root / rel).symlink_to(ROOT / rel)
        for rel in (f"scripts/{script}", *also):
            (root / rel).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / rel, root / rel)
        for rel, text in files.items():
            (root / rel).parent.mkdir(parents=True, exist_ok=True)
            (root / rel).write_text(text, encoding="utf-8")
        (root / "course-state").mkdir(exist_ok=True)
        interpreter = "node" if script.endswith(".mjs") else sys.executable
        env = {k: v for k, v in os.environ.items() if k not in SCRUBBED}
        result = subprocess.run([interpreter, str(root / "scripts" / script)], cwd=root, env=env,
                                capture_output=True, text=True, check=False)
        result.collected = {rel: (root / rel).read_text(encoding="utf-8")
                            for rel in collect if (root / rel).exists()}
        return result


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


#: Two sentences the repository's own definition detector reads the way the names say. Checked
#: against concept_detector.mts: the first defines `variable`, the second only uses it.
DEFINES_VARIABLE = "Una variable es un nombre que apunta a un valor en memoria."
USES_VARIABLE = "Usa la variable para sumar dos montos."


class FirstUseAllFloor(unittest.TestCase):
    """The first-use gate on the real extractor, over a synthetic course.

    Until 2026-10-06 this mocked `build_events` with a hand-written payload, so the extraction the
    gate depends on never ran here (an AGENTS.md stand-in). It now runs the real extractor through
    the gate's own `build_events`, in a temporary root built like the intro audit's.
    """

    def verdict(self, paragraphs: list[str], *, terms: bool = True) -> tuple[int, dict]:
        sections = [section_module("01", "alpha", paragraphs, "")] if paragraphs else []
        files = {
            "src/lib/course/index.ts": (
                ("import { section01 } from './sections/s01-alpha'\n" if sections else "")
                + f"export const COURSE_SECTIONS = [{'section01' if sections else ''}]\n"),
            "src/lib/glossary/terms.ts": terms_module(["variable"] if terms else [], "alpha"),
            **({"src/lib/course/sections/s01-alpha.ts": sections[0]} if sections else {}),
        }
        report = "course-state/first_use_all_report.json"
        result = run_gate("first_use_all_audit.py", files, also=PIPELINE, links=("node_modules",),
                          collect=(report,))
        self.assertNotIn("extractor.mts failed", result.stdout + result.stderr)
        self.assertIn(report, result.collected, result.stdout + result.stderr)
        return result.returncode, json.loads(result.collected[report])

    def test_a_term_defined_before_its_use_passes(self) -> None:
        code, report = self.verdict([DEFINES_VARIABLE, USES_VARIABLE])
        self.assertEqual(code, 0, report["issues"])

    def test_a_use_before_the_definition_fails(self) -> None:
        code, report = self.verdict([USES_VARIABLE, DEFINES_VARIABLE])
        self.assertEqual(code, 1)
        self.assertEqual([i["code"] for i in report["issues"]], ["USE_BEFORE_DEFINITION"])

    def test_an_empty_extraction_fails(self) -> None:
        code, report = self.verdict([], terms=False)
        self.assertEqual(code, 1)
        self.assertEqual(report["empty_populations"], ["active_section_ids", "terms", "events"])


def owed(script: str, name: str) -> int:
    """The debt a ratcheted gate declares, read from the script itself."""
    for node in ast.parse((ROOT / "scripts" / script).read_text(encoding="utf-8")).body:
        if isinstance(node, ast.Assign) and any(getattr(t, "id", None) == name for t in node.targets):
            return ast.literal_eval(node.value)
    raise AssertionError(f"scripts/{script} declares no {name}")


def glossary_course(early: int, missing: int) -> dict[str, str]:
    """Sections alpha then beta, and glossary terms all introduced in beta: `early` of them
    are used in alpha first (forward references), `missing` never appear in beta's prose (hovers
    that cannot fire), and one control term sits only in beta, where it belongs."""
    early_names = [f"temprana{i}" for i in range(early)]
    missing_names = [f"ausente{i}" for i in range(missing)]
    entries = "".join(f"  {{ id: 't-{n}', term: '{n}', aliases: [], firstSectionId: 'beta' }},\n"
                      for n in [*early_names, *missing_names, "presente"])
    return {
        "src/lib/course/index.ts": ("import { section01 } from './sections/s01-alpha'\n"
                                    "import { section02 } from './sections/s02-beta'\n"),
        "src/lib/glossary/terms.ts": f"export const GLOSSARY_TERMS = [\n{entries}]\n",
        "src/lib/course/sections/s01-alpha.ts": f"export const s = {{ id: 'alpha', theory: '{' '.join(early_names)}' }}\n",
        "src/lib/course/sections/s02-beta.ts": f"export const s = {{ id: 'beta', theory: '{' '.join([*early_names, 'presente'])}' }}\n",
    }


#: The intro audit reads the learner-visible events of the real extractor, through the real
#: concept_map: its content-digest cache, then `npx tsx scripts/course_event_extractor.mts`. Until
#: 2026-10-06 this test replaced concept_map with a stub that read a hand-written events file, which
#: hid the extraction itself. AGENTS.md now sends every stand-in to the owner and asks for the root
#: cause first, and this one had a real fix: the course below is synthetic DATA, and every line of
#: code that reads it is the repository's own -- the extractor and its two modules, concept_map, and
#: terms.ts with only its term list replaced.
PIPELINE = ("scripts/glossary_first_use.py", "scripts/concept_map.py", "scripts/report_lock.py",
            "scripts/course_event_extractor.mts", "scripts/concept_detector.mts",
            "scripts/concept_syntax.mts")


def terms_module(names: list[str], home: str) -> str:
    """The real terms.ts, with GLOSSARY_TERMS replaced by one entry per name, each homed at `home`."""
    source = (ROOT / "src/lib/glossary/terms.ts").read_text(encoding="utf-8")
    head = "export const GLOSSARY_TERMS: GlossaryTerm[] = [\n"
    assert source.count(head) == 1, "terms.ts no longer declares GLOSSARY_TERMS the way this test expects"
    start = source.index(head) + len(head)
    end = source.index("\n]\n", start) + 1
    entries = "".join(
        f"  {{ id: 't-{n}', term: '{n}', aliases: [], category: 'Python', definition: '{n}',"
        f" firstSectionId: '{home}' }},\n" for n in names)
    return source[:start] + entries + source[end:]


def section_module(number: str, sid: str, visible: str | list[str], hidden: str) -> str:
    """A section in the shape the extractor walks: `visible` as theory paragraphs, `hidden` as a We
    Do solution, the one surface the extractor marks learner_visible: false."""
    paragraphs = [visible] if isinstance(visible, str) else visible
    return (f"export const section{number} = {{\n"
            f"  id: '{sid}', index: {int(number)}, title: '{sid}',\n"
            "  learningOutcomes: [],\n"
            f"  theory: [{{ heading: 'Tema', paragraphs: {json.dumps(paragraphs, ensure_ascii=False)} }}],\n"
            "  iDo: { intro: '', steps: [] },\n"
            f"  weDo: {{ intro: '', steps: [{{ id: '{sid}-e1', title: 'Ejercicio',"
            f" solutionCode: {{ code: {json.dumps(hidden)} }} }}] }},\n"
            "  youDo: { context: '', objectives: [], requirements: [], rubric: [], starterCode: '' },\n"
            "  selfCheck: { questions: [] },\n"
            "  resources: { docs: [] },\n"
            "}\n")


def glossary_events_course(early: int, *, control_visible_in_alpha: bool = False) -> dict[str, str]:
    """Sections alpha then beta, glossary terms all introduced in beta: `early` of them used in
    alpha's visible text first (forward references), and a control term, `presente`, that alpha
    carries in its hidden solution -- or in its visible text, when asked."""
    names = [f"temprana{i}" for i in range(early)]
    alpha_visible = " ".join([*names, *(["presente"] if control_visible_in_alpha else [])])
    alpha_hidden = "" if control_visible_in_alpha else "presente = True"
    return {
        "src/lib/course/index.ts": ("import { section01 } from './sections/s01-alpha'\n"
                                    "import { section02 } from './sections/s02-beta'\n"
                                    "export const COURSE_SECTIONS = [section01, section02]\n"),
        "src/lib/course/sections/s01-alpha.ts": section_module("01", "alpha", alpha_visible, alpha_hidden),
        "src/lib/course/sections/s02-beta.ts": section_module("02", "beta", " ".join([*names, "presente"]), ""),
        "src/lib/glossary/terms.ts": terms_module([*names, "presente"], "beta"),
    }


class GlossaryRatchets(unittest.TestCase):
    """Both glossary audits printed "ok": false and exited 0, so the CI step that ran them could
    never fail. Each now holds the count it carries today, in both directions."""

    def run_intro(self, early: int, *, owed_as: int | None = None,
                  control_visible_in_alpha: bool = False) -> subprocess.CompletedProcess:
        files = glossary_events_course(early, control_visible_in_alpha=control_visible_in_alpha)
        if owed_as is not None:
            source = (ROOT / "scripts/glossary_intro_audit.py").read_text(encoding="utf-8")
            patched, n = re.subn(r"^FORWARD_REFS_OWED = \d+$", f"FORWARD_REFS_OWED = {owed_as}",
                                 source, flags=re.M)
            self.assertEqual(n, 1, "glossary_intro_audit.py must declare FORWARD_REFS_OWED once")
            files["scripts/glossary_intro_audit.py"] = patched
        result = run_gate("glossary_intro_audit.py", files, also=PIPELINE, links=("node_modules",))
        self.assertNotIn("extractor failed", result.stdout + result.stderr,
                         "the real extractor must run on the synthetic course")
        return result

    def run_coverage(self, missing: int) -> subprocess.CompletedProcess:
        return run_gate("glossary_coverage_audit.py", glossary_course(0, missing))

    def test_the_forward_references_owed_pass(self) -> None:
        result = self.run_intro(owed("glossary_intro_audit.py", "FORWARD_REFS_OWED"))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_a_new_forward_reference_fails(self) -> None:
        result = self.run_intro(owed("glossary_intro_audit.py", "FORWARD_REFS_OWED") + 1)
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertIn("more than the", result.stdout)

    def test_a_paid_forward_reference_must_lower_the_number(self) -> None:
        # At 0 the gate is absolute and the real constant cannot reach this branch, so it runs on a
        # copy that still owes one: paying that one off must fail until the constant is lowered.
        debt = max(owed("glossary_intro_audit.py", "FORWARD_REFS_OWED"), 1)
        result = self.run_intro(debt - 1, owed_as=debt)
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertIn(f"Lower FORWARD_REFS_OWED to {debt - 1}", result.stdout)

    def test_hidden_text_is_not_a_first_use_and_visible_text_is(self) -> None:
        """Why the intro audit reads events: it once matched `fastapi` in a section's own `id:`
        and `pipeline` inside S01's hidden solution, and reported both as forward references."""
        debt = owed("glossary_intro_audit.py", "FORWARD_REFS_OWED")
        hidden = self.run_intro(debt)
        self.assertEqual(hidden.returncode, 0, hidden.stdout + hidden.stderr)
        visible = self.run_intro(debt, control_visible_in_alpha=True)
        self.assertEqual(visible.returncode, 1, visible.stdout + visible.stderr)
        self.assertIn("presente: declared beta, first used alpha", visible.stdout)

    def test_the_missing_prose_owed_passes(self) -> None:
        result = self.run_coverage(owed("glossary_coverage_audit.py", "MISSING_PROSE_OWED"))
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_a_new_hover_that_cannot_fire_fails(self) -> None:
        result = self.run_coverage(owed("glossary_coverage_audit.py", "MISSING_PROSE_OWED") + 1)
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertIn("more than the", result.stdout)

    def test_a_closed_gap_must_lower_the_number(self) -> None:
        debt = owed("glossary_coverage_audit.py", "MISSING_PROSE_OWED")
        result = self.run_coverage(debt - 1)
        self.assertEqual(result.returncode, 1, result.stdout)
        self.assertIn(f"Lower MISSING_PROSE_OWED to {debt - 1}", result.stdout)


if __name__ == "__main__":
    unittest.main()
