"""Batch-1 fixes for S07 (regex, Jaccard, email) and S08 (atomic write, playground, recipe).

Each test reads the real section sources through tsx (or the playground source) and
executes the Python they contain. Every behavioural test has a negative control that
shows the detector can fail, so a green check cannot be vacuous.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
# Every snippet these tests run uses the standard library only, so any Python 3.12 runs them,
# including the adversarial job, which installs no content packages.
PY = sys.executable
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
SECTION_VIEW = ROOT / "src" / "components" / "course" / "SectionView.tsx"

NODE_ITEMS = r"""
import { pathToFileURL } from 'node:url';
const [file, exportName] = process.argv.slice(1);
const mod = await import(pathToFileURL(file).href);
const out = [];
function walk(o) {
  if (!o || typeof o !== 'object') return;
  if (Array.isArray(o)) { o.forEach(walk); return; }
  if (typeof o.id === 'string' && (o.starterCode || o.solutionCode)) {
    out.push({ kind: 'exercise', id: o.id, starter: o.starterCode?.code, solution: o.solutionCode?.code, expected: o.solutionCode?.output });
  }
  if (typeof o.demoId === 'string' && o.code) out.push({ kind: 'demo', id: o.demoId, code: o.code.code, output: o.code.output });
  if (Array.isArray(o.options) && typeof o.question === 'string') out.push({ kind: 'quiz', question: o.question, options: o.options, correctIndex: o.correctIndex });
  for (const k of Object.keys(o)) walk(o[k]);
}
walk(mod[exportName]);
process.stdout.write(JSON.stringify(out));
"""

NODE_ALL_SECTIONS = r"""
import { pathToFileURL } from 'node:url';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';
const dir = process.argv[1];
const result = {};
const files = readdirSync(dir).filter((f) => /^s(0[1-9]|1[0-3])-.*\.ts$/.test(f)).sort();
for (const f of files) {
  const mod = await import(pathToFileURL(join(dir, f)).href);
  const items = [];
  const walk = (o) => {
    if (!o || typeof o !== 'object') return;
    if (Array.isArray(o)) { o.forEach(walk); return; }
    if (typeof o.id === 'string' && o.starterCode) items.push({ id: o.id, code: o.starterCode.code });
    if (typeof o.id === 'string' && o.solutionCode) items.push({ id: o.id, code: o.solutionCode.code });
    if (typeof o.demoId === 'string' && o.code) items.push({ id: o.demoId, code: o.code.code });
    for (const k of Object.keys(o)) walk(o[k]);
  };
  for (const [k, v] of Object.entries(mod)) if (/^section\d+$/.test(k)) walk(v);
  result[f] = items;
}
process.stdout.write(JSON.stringify(result));
"""

NODE_TEMPLATE = "process.stdout.write(eval('`' + require('fs').readFileSync(0, 'utf8') + '`'));"


def _node(script: str, *args: str, stdin: str | None = None) -> str:
    cmd = ["node", "--import", "tsx", "--input-type=module", "-e", script, *args]
    if stdin is not None:
        cmd = ["node", "-e", NODE_TEMPLATE] if script == NODE_TEMPLATE else cmd
    completed = subprocess.run(
        cmd, cwd=ROOT, input=stdin, capture_output=True, text=True, timeout=240
    )
    if completed.returncode != 0:
        raise AssertionError(completed.stderr[-2000:])
    return completed.stdout


def _items(filename: str, export: str) -> list[dict]:
    raw = _node(NODE_ITEMS, str(SECTIONS / filename), export)
    return json.loads(raw)


def _by_id(items: list[dict]) -> dict[str, dict]:
    return {item["id"]: item for item in items if "id" in item}


def _run_py(code: str) -> tuple[int, str, str]:
    completed = subprocess.run(
        [str(PY), "-I", "-c", code], capture_output=True, text=True, timeout=60
    )
    return completed.returncode, completed.stdout, completed.stderr


def _run_starter_or_solution(code: str) -> str:
    rc, out, err = _run_py(code)
    if rc != 0:
        raise AssertionError(f"python failed rc={rc}: {err[-600:]}")
    return out.rstrip("\n")


# Lost-backslash signatures in learner Python: a regex escape that the TS template
# literal reduced to a bare letter, or a control character from a `\b` escape.
CONTROL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f]")
LOST_BACKSLASH = re.compile(r"(?<![\\\w])w\+|(?<![\\\w])d\{\d")


def _lost_backslash_hits(code: str) -> list[str]:
    hits = [f"control {ord(m.group()):#x}" for m in CONTROL.finditer(code)]
    hits += [f"lost backslash {m.group()!r}" for m in LOST_BACKSLASH.finditer(code)]
    return hits


class S07RegexBackslashes(unittest.TestCase):
    def test_a1_s01_to_s13_python_blocks_keep_backslashes(self) -> None:
        sections = json.loads(_node(NODE_ALL_SECTIONS, str(SECTIONS)))
        problems = {
            fname: [(item["id"], hit) for item in items for hit in _lost_backslash_hits(item["code"])]
            for fname, items in sections.items()
        }
        problems = {k: v for k, v in problems.items() if v}
        self.assertEqual(problems, {}, "lost backslashes or control characters in S01-S13 Python")

    def test_a1_three_t3_starters_show_regex_escapes(self) -> None:
        items = _by_id(_items("s07-text-unicode-regex.ts", "section07"))
        self.assertIn(r"re.compile(r'^(\w+) (\w+)$')", items["S07-T3-A-E2"]["starter"])
        self.assertIn(r"re.compile(r'\b\d{9}\b')", items["S07-T3-B-E1"]["starter"])
        self.assertIn(r"re.findall(r'[a-z]{3}-\d{2}', log)", items["S07-T3-B-E2"]["starter"])

    def test_a1_negative_control_detector_flags_lost_backslashes(self) -> None:
        # The detector must fire on the pre-fix shapes, otherwise the scan above proves nothing.
        self.assertTrue(_lost_backslash_hits("pat = re.compile(r'^(w+) (w+)$')"))
        self.assertTrue(_lost_backslash_hits("pat = re.compile(r'\x08d{9}\x08')"))
        self.assertFalse(_lost_backslash_hits(r"pat = re.compile(r'^(\w+) (\w+)$')"))


class S08PlaygroundCount(unittest.TestCase):
    @staticmethod
    def _playground() -> tuple[str, str]:
        text = SECTION_VIEW.read_text(encoding="utf-8")
        start = text.index("'files-ingestion': {")
        block = text[start:]
        code_raw = re.search(r"code: `(.*?)`,\n\s+expectedOutput: `", block, re.S).group(1)
        expected_raw = re.search(r"expectedOutput: `(.*?)`,", block, re.S).group(1)
        code = _node(NODE_TEMPLATE, stdin=code_raw)
        expected = _node(NODE_TEMPLATE, stdin=expected_raw)
        return code, expected

    def test_a2_playground_runs_to_its_expected_output(self) -> None:
        code, expected = self._playground()
        self.assertEqual(_run_starter_or_solution(code), expected.rstrip("\n"))

    def test_a2_n_in_counts_parsed_rows_so_a_lost_row_breaks_reconcile(self) -> None:
        code, _ = self._playground()
        # Negative control: drop the last parsed row before classification. The
        # independent input count must still see it, so reconcile_ok must turn False.
        mutated = code.replace("for row in parsed_rows:", "for row in parsed_rows[:-1]:", 1)
        self.assertNotEqual(mutated, code, "mutation anchor not found in playground")
        out = _run_starter_or_solution(mutated)
        manifest = json.loads(out.splitlines()[-1].removeprefix("manifest "))
        self.assertFalse(manifest["reconcile_ok"])
        self.assertEqual(manifest["n_in"], 3)

    def test_a2_quarantine_key_is_parsed_row_not_raw(self) -> None:
        code, _ = self._playground()
        out = _run_starter_or_solution(code)
        quarantine = json.loads(out.splitlines()[1].removeprefix("quarantine "))
        self.assertIn("parsed_row", quarantine[0])
        self.assertNotIn("raw", quarantine[0])


class S07JaccardAndEmail(unittest.TestCase):
    def setUp(self) -> None:
        self.items = _by_id(_items("s07-text-unicode-regex.ts", "section07"))
        self.demos = {item["id"]: item for item in _items("s07-text-unicode-regex.ts", "section07") if item["kind"] == "demo"}

    def test_c4_t4_a_e2_both_empty_is_none(self) -> None:
        probe = self.items["S07-T4-A-E2"]["solution"] + "\nprint(repr(token_jaccard('', '')), repr(token_jaccard('', 'Ana')))"
        lines = _run_starter_or_solution(probe).splitlines()
        self.assertEqual(lines[-1], "None None")

    def test_c4_t4_a_e2_reorder_is_still_a_real_score(self) -> None:
        # Negative control: the probe is not vacuous; a real pair still yields a number.
        probe = self.items["S07-T4-A-E2"]["solution"] + "\nprint(token_jaccard('Juan Perez', 'Perez Juan'))"
        self.assertEqual(_run_starter_or_solution(probe).splitlines()[-1], "1.0")

    def test_c4_t4_a_e3_one_point_zero_without_equal_strings_is_review(self) -> None:
        code = self.items["S07-T4-A-E3"]["solution"].replace(
            "a, b, score = 'Juan Perez', 'Juan P Perez', 0.67",
            "a, b, score = 'Ana Ana', 'Ana', 1.0",
        )
        self.assertEqual(_run_starter_or_solution(code), "review Ana Ana Ana 1.0")

    def test_c4_negative_control_equal_normalised_strings_are_exact(self) -> None:
        code = self.items["S07-T4-A-E3"]["solution"].replace(
            "a, b, score = 'Juan Perez', 'Juan P Perez', 0.67",
            "a, b, score = 'Ana', ' ana ', 1.0",
        )
        self.assertEqual(_run_starter_or_solution(code), "exact Ana  ana  1.0")

    def test_c4_i_do_demo_shows_error_then_correction_for_reordered_names(self) -> None:
        demo = self.demos["S07-T4-A-DEMO"]
        self.assertIn("Error: el orden ignorado da 1.0", demo["output"])
        self.assertIn("Corrección: review", demo["output"])
        self.assertEqual(_run_starter_or_solution(demo["code"]), demo["output"].rstrip("\n"))

    def test_c5_email_local_part_keeps_case_and_domain_is_casefolded(self) -> None:
        solution = self.items["S07-T2-B-E1"]["solution"]
        out = _run_starter_or_solution(solution)
        self.assertIn("ok A@b.com", out.splitlines())
        probe = solution + "\nprint(validar_email('  Ana+X@Example.COM ')[1])"
        self.assertEqual(_run_starter_or_solution(probe).splitlines()[-1], "Ana+X@example.com")

    def test_c5_you_do_contract_comment_keeps_local_part(self) -> None:
        text = (SECTIONS / "s07-text-unicode-regex.ts").read_text(encoding="utf-8")
        self.assertIn("# Contrato: strip; la parte local conserva sus mayúsculas; solo el dominio en casefold", text)
        self.assertNotIn("# Contrato: strip/casefold;", text)

    def test_c5_counterexample_keeps_the_full_casefold_error_pinned(self) -> None:
        # D24: the old whole-address casefold stays as the pinned "Error" half of the solution.
        out = _run_starter_or_solution(self.items["S07-T2-B-E1"]["solution"])
        self.assertIn("Error: ana+x@example.com", out.splitlines())
        self.assertIn("Corrección: Ana+X@example.com", out.splitlines())


class C14StarterIsNotTheAnswer(unittest.TestCase):
    OWED = {
        "s07-text-unicode-regex.ts": ("section07", ["S07-T1-A-E2", "S07-T3-A-E1", "S07-T3-B-E1"]),
        "s08-files-ingestion.ts": ("section08", ["S08-T1-B-E2", "S08-T3-A-E1"]),
    }

    def test_c14_listed_starters_do_not_print_the_expected_output(self) -> None:
        for filename, (export, ids) in self.OWED.items():
            items = _by_id(_items(filename, export))
            for item_id in ids:
                with self.subTest(id=item_id):
                    starter = _run_starter_or_solution(items[item_id]["starter"])
                    expected = items[item_id]["expected"].rstrip("\n")
                    self.assertNotEqual(starter, expected)

    def test_c14_negative_control_starter_equal_to_expected_is_detected(self) -> None:
        self.assertEqual(_run_starter_or_solution("print(True)"), "True")


class S08AtomicContract(unittest.TestCase):
    def setUp(self) -> None:
        self.text = (SECTIONS / "s08-files-ingestion.ts").read_text(encoding="utf-8")
        self.items = _by_id(_items("s08-files-ingestion.ts", "section08"))
        self.demos = {item["id"]: item for item in _items("s08-files-ingestion.ts", "section08") if item["kind"] == "demo"}

    FIXED_TMP = re.compile(r"with_name\(\s*(\w+)\.name\s*\+\s*['\"]\.tmp['\"]\s*\)")

    def test_c6_fixed_tmp_name_survives_only_as_the_counterexample(self) -> None:
        hits = list(self.FIXED_TMP.finditer(self.text))
        self.assertEqual(len(hits), 1, "fixed .tmp name must appear once, in the D24 counterexample")
        self.assertIn("tmp_fijo = dest_fijo.with_name", self.text[hits[0].start() - 40 : hits[0].end()])

    def test_c6_negative_control_detector_sees_fixed_name(self) -> None:
        self.assertTrue(self.FIXED_TMP.search("tmp = path.with_name(path.name + \".tmp\")"))
        self.assertFalse(self.FIXED_TMP.search("fd, tmp_name = tempfile.mkstemp(dir=path.parent)"))

    def test_c6_counterexample_shows_interleaving_and_the_fix(self) -> None:
        demo_block = self.text[self.text.index('title: "tmp_fijo_vs_mkstemp.py"'):]
        output = re.search(r"output: `(.*?)`", demo_block, re.S).group(1)
        self.assertEqual(
            output.splitlines(),
            ["error: publicado = BBAA", "corrección: publicado = BB", "sobran temporales: False"],
        )

    def test_c6_we_do_and_demo_solutions_use_unique_temp(self) -> None:
        for item_id in ("S08-T1-B-E2", "S08-T1-B-E3"):
            with self.subTest(id=item_id):
                code = self.items[item_id]["solution"]
                self.assertIn("tempfile.mkstemp(dir=", code)
                self.assertNotIn("'.tmp')", code.replace("suffix='.tmp'", ""))
                self.assertEqual(_run_starter_or_solution(code), self.items[item_id]["expected"].rstrip("\n"))
        demo = self.demos["S08-T1-B-DEMO"]
        self.assertIn("mkstemp", demo["code"])
        self.assertEqual(_run_starter_or_solution(demo["code"]), demo["output"].rstrip("\n"))

    def test_c6_quiz_q2_marks_the_unique_temp_as_correct(self) -> None:
        quizzes = [
            item
            for item in _items("s08-files-ingestion.ts", "section08")
            if item["kind"] == "quiz" and "escritura atómica" in item["question"].lower()
        ]
        self.assertEqual(len(quizzes), 1)
        quiz = quizzes[0]
        correct = quiz["options"][quiz["correctIndex"]]
        self.assertIn("mkstemp", correct)
        self.assertFalse(any("name + '.tmp'" in option for option in quiz["options"]))

    def _recipe(self) -> str:
        # The recipe is a double-quoted TS string with literal \\n separators.
        return re.search(r'context:\s*\n?\s*"(.*?)",\n\s+objectives', self.text, re.S).group(1)

    @staticmethod
    def _publishes_before_reconcile(recipe: str) -> bool:
        steps = {int(n): text for n, text in re.findall(r"\\n(\d)\. (.*?)(?=\\n|$)", recipe)}
        manifest_step = next(n for n, t in steps.items() if "build_manifest" in t)
        publish_steps = [n for n, t in steps.items() if "write_atomic" in t]
        return any(n < manifest_step for n in publish_steps)

    def test_c7_recipe_reconciles_before_any_publish(self) -> None:
        recipe = self._recipe()
        self.assertFalse(self._publishes_before_reconcile(recipe))
        self.assertIn("por archivo, no por corrida", recipe)
        self.assertIn("no una transacción de varios archivos", recipe)

    def test_c7_negative_control_original_recipe_publishes_first(self) -> None:
        original = (
            "1. Crea `run_id`.\\n4. `write_atomic` de clean y quarantine (T1-B)\\n"
            "5. `build_manifest` con totales derivados (T4-B)\\n6. `run` retorna 0"
        )
        self.assertTrue(self._publishes_before_reconcile(original))


if __name__ == "__main__":
    unittest.main()
