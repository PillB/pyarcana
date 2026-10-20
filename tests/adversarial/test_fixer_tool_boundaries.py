"""Guard G-12 at the tool boundary: the fixer entry points that turn a tag into a section run the real code.

test_numbering_epoch.py holds numbering.py itself; test_numbering_registry.py holds the readers of the
registry. This file holds the rest of what the numbering change rewrote, each one run for real against a
small temporary course (three sections, so no test types the real count), because a wrong tag-to-slug
answer at any of them passes every unit test of numbering.py:

  * section_path.py, which every run_*.sh wrapper calls to learn a section's slug and file;
  * preflight.py, which must refuse a tree whose epoch, course or state disagree;
  * gate.py, whose strict-output measure and identifier measure find a section by its file;
  * build_redaction_prompt.py and build_critique_followup.py, which name the section to Codex and read the
    prose report by tag;
  * run_concepts.sh, which must tell the brief builder's "nothing to teach" (exit 2) from a refusal.

The review of the first draft mutated each of these in a scratch copy (section_path returned the next
section; preflight dropped check_numbering; gate forced its filter to a section that does not exist) and
every existing test stayed green. Mutation proofs for these cases are in the commit message.
"""
from __future__ import annotations

import contextlib
import io
import json
import os
import shutil
import subprocess
import sys
import unittest
from pathlib import Path
from subprocess import CompletedProcess
from unittest import mock

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "tools/fixer"))
sys.path.insert(0, str(ROOT / "tests/adversarial"))

import build_critique_followup  # noqa: E402
import build_redaction_prompt  # noqa: E402
import gate  # noqa: E402
import ledger  # noqa: E402
import numbering  # noqa: E402
import preflight  # noqa: E402
from numbering import NumberingError  # noqa: E402
from fixer_gate_tree import (  # noqa: E402
    NEUTRAL, UNEXPLAINED, content_interpreter, gate_ready_course, interpreter_calls, section_source,
    write_sections)
from numbering_fixture import ROUND_FILED, NumberingFixture, build, cycle, registry, round_tree, write  # noqa: E402


def run_script(root: Path, name: str, *args: str) -> CompletedProcess:
    """Run tools/fixer/<name> from `root`, a tree it can read its course and epoch from."""
    return subprocess.run([sys.executable, str(root / "tools/fixer" / name), *args], capture_output=True, text=True)


def with_tools(root: Path, *names: str) -> None:
    """Copy fixer tools into a temporary tree, where their own ROOT is that tree."""
    for name in names:
        target = root / "tools/fixer" / name
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy(ROOT / "tools/fixer" / name, target)


class SectionPathNamesTheRightSection(NumberingFixture):
    def test_every_tag_prints_its_own_slug_and_file(self) -> None:
        round_tree(self.root)
        with_tools(self.root, "section_path.py", "numbering.py")
        for tag, slug, stem in (("S01", "alpha", "s01-alpha"), ("S02", "beta", "s02-beta"),
                                ("S03", "gamma", "s03-gamma")):
            with self.subTest(tag=tag):
                done = run_script(self.root, "section_path.py", tag)
                self.assertEqual((done.returncode, done.stdout.split()),
                                 (0, [slug, f"src/lib/course/sections/{stem}.ts"]), done.stderr)

    def test_a_number_the_epoch_does_not_hold_is_refused_with_a_status(self) -> None:
        round_tree(self.root)
        with_tools(self.root, "section_path.py", "numbering.py")
        done = run_script(self.root, "section_path.py", "S04")
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("no file for S04", done.stderr)

    def test_the_real_tree_answers_from_its_epoch_at_the_first_a_middle_and_the_last_section(self) -> None:
        epoch = numbering.load_epoch(ROOT)
        for number in (1, epoch.count // 2, epoch.count):
            tag = numbering.tag_of(number)
            with self.subTest(tag=tag):
                done = run_script(ROOT, "section_path.py", tag)
                slug = epoch.slugs[number - 1]
                self.assertEqual(done.stdout.split(), [slug, numbering.section_rel(slug, ROOT)], done.stderr)
                self.assertTrue((ROOT / done.stdout.split()[1]).exists())

    def test_the_real_tree_refuses_the_number_after_the_last(self) -> None:
        epoch = numbering.load_epoch(ROOT)
        done = run_script(ROOT, "section_path.py", numbering.tag_of(epoch.count + 1))
        self.assertNotEqual(done.returncode, 0)


class PreflightRefusesADisagreeingTree(NumberingFixture):
    """preflight.main runs all six of its checks for real against the temporary course.

    Owner decision O27 100-S1: this class used to switch off three of them (check_interpreter, check_pins and
    snapshot_dirty), and no other test runs them, because preflight starts only from tools/fixer/run_chain.sh.
    Two paths were fixed to the real repository when preflight loaded, CONTENT_PY and BASELINE, which is why
    they could not simply run: check_interpreter would have tested the real `.venv-content`, and snapshot_dirty
    would have overwritten the real audit/fixer/dirty_baseline.json. They are pointed into the temporary course
    here, as ROOT is: its `.venv-content/bin/python` is the suite's own 3.12 (a recorder around it, see
    fixer_gate_tree.content_interpreter) and `git init` gives snapshot_dirty a repository of its own to read.
    check_pins needs nothing, since the course holds no runtime report and the check passes with a note.

    What this does not show: that each of the three refuses its own bad state (a wrong interpreter, a stale
    runtime report, a staged change). A sound course shows only that all three pass."""

    def setUp(self) -> None:
        super().setUp()
        content_interpreter(self.root)
        subprocess.run(["git", "init", "-q", str(self.root)], check=True, capture_output=True)

    def run_preflight(self) -> tuple[int, str, list[str]]:
        out = io.StringIO()
        with contextlib.ExitStack() as stack:
            for name, value in (("ROOT", self.root), ("CONTENT_PY", self.root / ".venv-content/bin/python"),
                                ("BASELINE", self.root / "audit/fixer/dirty_baseline.json"),
                                ("problems", []), ("notes", [])):
                stack.enter_context(mock.patch.object(preflight, name, value))
            stack.enter_context(contextlib.redirect_stdout(out))
            code = preflight.main()
            return code, out.getvalue(), list(preflight.problems)

    def test_a_consistent_tree_passes(self) -> None:
        round_tree(self.root)
        code, text, problems = self.run_preflight()
        self.assertEqual((code, problems), (0, []), text)
        self.assertIn("all 3 sections resolve", text)
        self.assertIn(f"registry holds {sum(ROUND_FILED.values())} findings", text)

    def test_the_three_checks_that_were_switched_off_each_run(self) -> None:
        """Each leaves a mark in a sound course: the interpreter's version in the notes, the missing runtime
        report in the notes, and the baseline of modified files written into the course."""
        round_tree(self.root)
        code, text, problems = self.run_preflight()
        self.assertEqual((code, problems), (0, []), text)
        self.assertRegex(text, r"ok   interpreter Python 3\.12\.\d+")
        self.assertIn("no runtime report yet (first run)", text)
        baseline = self.root / "audit/fixer/dirty_baseline.json"
        self.assertEqual(json.loads(baseline.read_text(encoding="utf-8")), {"dirty_before_chain": []})

    def test_a_stale_cycle_record_stops_the_chain(self) -> None:
        round_tree(self.root)
        cycle(self.root, "S02", slug="beta", numbering_epoch=2)
        code, text, problems = self.run_preflight()
        self.assertEqual(code, 1, text)
        self.assertTrue(any("S02.json is from epoch 2" in p for p in problems), problems)

    def test_a_course_that_was_renumbered_under_the_epoch_stops_the_chain(self) -> None:
        round_tree(self.root)
        build(self.root, slugs=("alpha", "fresh", "beta", "gamma"), epoch_slugs=("alpha", "beta", "gamma"),
              roadmap_numbers=range(1, 5))
        code, text, problems = self.run_preflight()
        self.assertEqual(code, 1, text)
        self.assertTrue(any("course order" in p for p in problems), problems)

    def test_an_unstamped_registry_stops_the_chain_and_is_said_once(self) -> None:
        round_tree(self.root)
        registry(self.root, {"S01": 1}, stamp=None)
        code, text, problems = self.run_preflight()
        self.assertEqual(code, 1, text)
        self.assertEqual(sum("no numbering_epoch" in p for p in problems), 1, problems)

    def test_a_missing_epoch_stops_the_chain(self) -> None:
        round_tree(self.root)
        (self.root / numbering.EPOCH_FILE).unlink()
        code, text, problems = self.run_preflight()
        self.assertEqual(code, 1, text)
        self.assertTrue(any("no numbering epoch" in p for p in problems), problems)


class GateFindsASectionByItsFile(NumberingFixture):
    REPORTS = {
        "cmap": {}, "prose": {}, "cs": {}, "fu": {"issues": []}, "ready": {"failures": [], "warnings": []},
        "strict": 0,
    }

    def setUp(self) -> None:
        super().setUp()
        round_tree(self.root)
        write(self.root, "src/lib/course/sections/s02-legacy.ts", "export const legacy = {\n  id: 'legacy',\n}\n")
        for name in ("ROOT", "COURSE_ROOT"):
            patcher = mock.patch.object(gate, name, self.root)
            patcher.start()
            self.addCleanup(patcher.stop)

    def test_the_stem_is_the_active_files_own_name(self) -> None:
        self.assertEqual([gate.section_stem(t) for t in ("S01", "S02", "S03")],
                         ["s01-alpha", "s02-beta", "s03-gamma"])
        with self.assertRaises(NumberingError):
            gate.section_stem("S04")

    def test_identifier_values_are_counted_in_the_sections_own_file_only(self) -> None:
        """"s02-" also prefixes the inactive s02-legacy.ts; the measure follows the file the course imports."""
        ids = {"findings": [{"file": "src/lib/course/sections/s02-beta.ts"},
                            {"file": "src/lib/course/sections/s02-legacy.ts"},
                            {"file": "src/lib/course/sections/s03-gamma.ts"}]}
        for tag, expected in (("S01", 0), ("S02", 1), ("S03", 1)):
            with self.subTest(tag=tag):
                measured = gate.assemble_measures(tag, ids=ids, **self.REPORTS)
                self.assertEqual(measured["identifier_values_in_section"], expected)


class TheStrictAuditMeasuresOnlyTheSectionItIsAskedFor(NumberingFixture):
    """gate.strict_mismatches runs the real strict-output audit, under the course's own interpreter, on a
    temporary course the gate can measure (fixer_gate_tree.gate_ready_course).

    Owner decision O27 100-S2: this was a test that put a fake in place of `gate.sh`, which wrote down the
    command it was given and reported failure without running anything. It proved the gate asks for the right
    file name and that a failed command reads as "could not measure"; it could not prove that the audit ran
    that section and skipped the others, nor that the number it returns is the audit's own. The real call
    costs a few seconds, a full gate run tens of them, and it fails here, at gate.strict_mismatches, not
    somewhere in a two-minute runner test.

    The course holds three sections and one inactive file, s02-legacy.ts, which index.ts does not import. Its
    first lines name s02-beta, so the audit's `--only s02-beta` filter matches it, and only the audit's own
    rule that it reads the sections the course imports keeps it out of the rows."""

    SECTIONS = "src/lib/course/sections"

    def setUp(self) -> None:
        super().setUp()
        gate_ready_course(self.root)
        (self.root / ".fixer").mkdir()                       # gate.measure makes it before any audit runs
        write(self.root, f"{self.SECTIONS}/s02-legacy.ts",
              "// Replaced by s02-beta.ts; index.ts no longer imports this file.\n"
              + section_source(2, "legacy", NEUTRAL))
        for name, value in (("ROOT", self.root), ("COURSE_ROOT", self.root),
                            ("CONTENT_PY", self.root / ".venv-content/bin/python")):
            patcher = mock.patch.object(gate, name, value)
            patcher.start()
            self.addCleanup(patcher.stop)

    def audited_files(self, tag: str) -> list[tuple[str, str]]:
        """The (file, verdict) of every snippet the audit judged on the last call for `tag`."""
        report = json.loads((self.root / f".fixer/{tag}.strict-output.json").read_text(encoding="utf-8"))
        return [(row["file"], row["verdict"]) for row in report["rows"]]

    def test_the_audit_judges_that_section_and_no_other(self) -> None:
        self.assertEqual(gate.strict_mismatches("S02"), 0)
        self.assertEqual(self.audited_files("S02"), [(f"{self.SECTIONS}/s02-beta.ts", "match")])

    def test_a_declared_output_the_code_does_not_print_is_counted_in_its_own_section_only(self) -> None:
        wrong = section_source(3, "gamma", NEUTRAL).replace("output: `hello 3`", "output: `goodbye 3`")
        write(self.root, f"{self.SECTIONS}/s03-gamma.ts", wrong)
        self.assertEqual(gate.strict_mismatches("S03"), 1)
        self.assertEqual(self.audited_files("S03"), [(f"{self.SECTIONS}/s03-gamma.ts", "mismatch")])
        self.assertEqual(gate.strict_mismatches("S02"), 0, "S03's wrong output must not count against S02")

    def test_an_audit_that_cannot_run_is_not_measurable_rather_than_zero(self) -> None:
        """The gate's contract is None for "could not run", which `regression_verdict` prints as unmeasurable.
        A zero would read as a clean section."""
        (self.root / "scripts/python_content_strict_output_audit.py").unlink()
        self.assertIsNone(gate.strict_mismatches("S02"))


class LedgerMapsIdentifierFindingsToSectionsInOnePass(NumberingFixture):
    """ledger.py maps each identifier finding's file to a section. It asked numbering for the section files
    once per finding, and every ask re-reads every section file: quadratic in the findings and invisible
    until a section has hundreds."""

    FILES = ("src/lib/course/sections/s02-beta.ts", "src/lib/course/sections/s03-gamma.ts",
             "src/lib/course/sections/s02-beta.ts", "src/lib/course/sections/s09-elsewhere.ts")

    def setUp(self) -> None:
        super().setUp()
        round_tree(self.root)
        write(self.root, "course-state/synthetic_identifier_report.json",
              json.dumps({"findings": [{"file": rel} for rel in self.FILES]}))

    def ledger_text(self) -> str:
        with mock.patch.object(ledger, "ROOT", self.root), \
                mock.patch.object(ledger, "OUT", self.root / "audit/fixer/LEDGER.md"), \
                mock.patch.object(sys, "argv", ["ledger.py"]), contextlib.redirect_stdout(io.StringIO()):
            ledger.main()
        return (self.root / "audit/fixer/LEDGER.md").read_text(encoding="utf-8")

    def test_the_sections_with_an_identifier_finding_lose_their_ids_box(self) -> None:
        lines = self.ledger_text().splitlines()
        header = next(line for line in lines if line.startswith("| sec |"))
        column = [cell.strip() for cell in header.strip("|").split("|")].index("ids")
        ids_box = {}
        for line in lines:
            if line.startswith("| **S0"):
                cells = [cell.strip() for cell in line.strip("|").split("|")]
                ids_box[cells[0]] = cells[column]
        self.assertEqual(ids_box, {"**S01** alpha": "[x]", "**S02** beta": "[ ]", "**S03** gamma": "[ ]"})

    def test_the_section_files_are_read_once_however_many_findings_there_are(self) -> None:
        with mock.patch.object(numbering, "course_order", wraps=numbering.course_order) as read:
            self.ledger_text()
        self.assertEqual(read.call_count, 1)


class CodexBriefsNameTheRightSection(NumberingFixture):
    def setUp(self) -> None:
        super().setUp()
        round_tree(self.root)

    def brief(self, module, *argv: str) -> str:
        out = io.StringIO()
        with contextlib.ExitStack() as stack:
            stack.enter_context(mock.patch.object(module, "ROOT", self.root))
            stack.enter_context(mock.patch.object(sys, "argv", ["tool", *argv]))
            stack.enter_context(contextlib.redirect_stdout(out))
            module.main()
        return out.getvalue()

    def test_the_redaction_brief_names_the_section_and_reads_its_own_prose_metrics(self) -> None:
        for tag, slug, run_ons in (("S01", "alpha", 11), ("S02", "beta", 21), ("S03", "gamma", 31)):
            with self.subTest(tag=tag):
                text = self.brief(build_redaction_prompt, tag)
                self.assertIn(f'section {tag} ("{slug}")', text)
                self.assertIn(f"src/lib/course/sections/s{tag[1:]}-{slug}.ts", text)
                self.assertIn(f'"run_on_sentences": {run_ons}', text)

    def test_the_redaction_brief_refuses_a_number_the_epoch_does_not_hold(self) -> None:
        with self.assertRaises(NumberingError):
            self.brief(build_redaction_prompt, "S04")

    def test_the_critique_brief_finds_the_section_behind_a_round_suffix(self) -> None:
        """Round files carry a suffix (S02c1, S02r); the section is the tag in front of it."""
        critique = {"patches": [{"field_path": "theory[0]", "finding_ids": ["S02-F01"], "replacement": "texto",
                                 "self_critique": {"addressed_in_this_replacement": False,
                                                   "what_could_confuse": "x", "what_is_missing": "y",
                                                   "residual_concern": "z"}}]}
        write(self.root, ".fixer/S02c1.result.json", json.dumps(critique))
        text = self.brief(build_critique_followup, "S02c1")
        self.assertIn('section S02c1 ("beta")', text)
        self.assertIn("src/lib/course/sections/s02-beta.ts", text)

    def test_the_critique_brief_refuses_a_suffixed_tag_the_epoch_does_not_hold(self) -> None:
        critique = {"patches": [{"self_critique": {"addressed_in_this_replacement": False}}]}
        write(self.root, ".fixer/S09c1.result.json", json.dumps(critique))
        with self.assertRaises(NumberingError):
            self.brief(build_critique_followup, "S09c1")


class TheConceptsRunnerTellsARefusalFromNothingToTeach(NumberingFixture):
    """run_concepts.sh ran the brief builder with its stderr thrown away and read every non-zero status as
    "nothing unexplained". The builder now refuses a registry stamped for another epoch (exit 1), so a tree
    whose registry was regenerated after a renumber printed "nothing unexplained in S02" for a section that
    had work. Exit 2 is the builder's one word for "nothing to teach"; any other status is a refusal.

    The real runner, the real gate and the real builder run in a copy of the fixer tools, so their ROOT is
    the temporary course (fixer_gate_tree.py builds it). The gate measures that course for real and writes
    the concept map the brief is built from, so which sections have work to teach is a fact about the
    course's text, not about a file the test wrote. One stand-in, test only: run_codex.py, the external,
    paid model. It leaves a marker file and exits 1, so a run that got past the brief is told apart from
    one the brief stopped.

    Owner decision O26 (audit/fixer/OWNER_DECISIONS.md): the run_codex.py stand-in stays (a); the gate.py
    stand-in this class used to hold was replaced by the real gate (b). Owner decision O27 100-Q1: the
    course's `.venv-content/bin/python` is a recorder around the real 3.12, not a stand-in. It logs each call
    and runs it for real, so the first test can say which interpreter the strict audit ran under, which a
    plain link to the same Python (as PATH's `python3` is, below) could not."""

    CODEX_MARKER = ".fixer/codex-was-called"

    def setUp(self) -> None:
        super().setUp()
        gate_ready_course(self.root, {2: UNEXPLAINED})
        write(self.root, "tools/fixer/run_codex.py",
              f"from pathlib import Path\nPath('{self.CODEX_MARKER}').write_text('called')\nraise SystemExit(1)\n")
        self.bin = self.root / "bin"
        self.bin.mkdir()
        (self.bin / "python3").symlink_to(sys.executable)

    def run_runner(self, *tags: str) -> CompletedProcess:
        env = {**os.environ, "PATH": f"{self.bin}{os.pathsep}{os.environ['PATH']}"}
        return subprocess.run(["bash", "tools/fixer/run_concepts.sh", *(tags or ("S02",))], cwd=self.root,
                              env=env, capture_output=True, text=True, timeout=900)

    def codex_was_called(self) -> bool:
        return (self.root / self.CODEX_MARKER).exists()

    def gate_measures(self, tag: str = "S02") -> dict:
        """What the gate wrote when the runner asked it to snapshot `tag`."""
        path = self.root / f".fixer/{tag}.gate-before.json"
        self.assertTrue(path.exists(), f"the runner never got a measurement of {tag} from the gate")
        return json.loads(path.read_text(encoding="utf-8"))

    def test_the_runner_gets_a_real_measurement_of_the_section_before_it_builds_the_brief(self) -> None:
        """The control for the gate: the numbers are the temporary course's own, so the real gate ran."""
        done = self.run_runner()
        measured = self.gate_measures()
        self.assertNotIn(None, measured.values(), f"an instrument could not run: {measured}\n{done.stdout}")
        self.assertEqual(measured.get("surprising_uses_in_section"), 1, "the one unexplained lambda of S02")
        self.assertEqual(measured.get("strict_output_mismatches_in_section"), 0)
        strict = json.loads((self.root / ".fixer/S02.strict-output.json").read_text(encoding="utf-8"))
        self.assertEqual([(row["file"], row["verdict"]) for row in strict["rows"]],
                         [("src/lib/course/sections/s02-beta.ts", "match")],
                         "the strict audit did not run S02's snippet and report it as a match")
        audits = [call for call in interpreter_calls(self.root) if "python_content_strict_output_audit.py" in call]
        self.assertEqual(len(audits), 1, "the strict audit did not run under the pinned .venv-content/bin/python "
                         f"(calls it recorded: {interpreter_calls(self.root)})")
        self.assertIn("--only s02-beta", audits[0])

    def test_a_brief_the_builder_can_write_reaches_codex(self) -> None:
        """The control: with a sound tree the runner gets past the brief, so the refusals below are the brief's."""
        done = self.run_runner()
        self.assertTrue(self.codex_was_called(), done.stdout + done.stderr)
        self.assertIn("codex failed - stopping", done.stdout)
        brief = (self.root / ".fixer/S02k.prompt.txt").read_text(encoding="utf-8")
        self.assertIn('"concept": "lambda"', brief, "the brief is not built from the gate's concept map")

    def test_a_registry_stamped_for_another_epoch_stops_the_run_and_says_why(self) -> None:
        registry(self.root, ROUND_FILED, stamp=2)
        done = self.run_runner()
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)
        self.assertIn("S02 brief refused", done.stdout)
        self.assertIn("is from epoch 2, but the current epoch is 3", done.stdout + done.stderr)
        self.assertNotIn("nothing unexplained", done.stdout)
        self.assertFalse(self.codex_was_called())

    def test_an_unstamped_registry_stops_the_run_and_says_why(self) -> None:
        registry(self.root, ROUND_FILED, stamp=None)
        done = self.run_runner()
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)
        self.assertIn("S02 brief refused", done.stdout)
        self.assertIn("no numbering_epoch", done.stdout + done.stderr)
        self.assertNotIn("nothing unexplained", done.stdout)

    def test_a_refusal_stops_the_run_before_the_next_section(self) -> None:
        registry(self.root, ROUND_FILED, stamp=2)
        done = self.run_runner("S02", "S03")
        self.assertEqual(done.returncode, 1, done.stdout + done.stderr)
        self.assertIn("S02 concepts", done.stdout)
        self.assertNotIn("S03 concepts", done.stdout)

    def test_a_section_with_nothing_to_teach_is_clean_and_the_run_goes_on(self) -> None:
        write_sections(self.root)
        done = self.run_runner()
        self.assertEqual(done.returncode, 0, done.stdout + done.stderr)
        self.assertEqual(self.gate_measures().get("surprising_uses_in_section"), 0, "S02 uses no unexplained term")
        self.assertIn("nothing unexplained in S02", done.stdout)
        self.assertNotIn("refused", done.stdout)
        self.assertFalse(self.codex_was_called())


if __name__ == "__main__":
    unittest.main()
