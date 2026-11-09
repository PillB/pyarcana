"""C14 and S04-005 (proposals-03): starters are not the answer, and the You Do checks catch wrong code.

Starter-is-the-answer (R1): a starter whose stdout already equals the expected output lets the
learner pass without doing the exercise. Each exercise listed here must now run differently.

S04-005: the You Do asserts must fail on the wrong implementations the audit found (the four
mutants below all printed `resumen 4 1 1 2 0.25` and `tests OK` on main).

The sections are read through the real course objects (node + tsx), so the test sees what the
learner sees, not a copy of it.
"""
from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
PY = sys.executable

DUMP = """
import { pathToFileURL } from 'node:url'
const root = process.argv[process.argv.length - 1]
const { COURSE_SECTIONS } = await import(pathToFileURL(root + '/src/lib/course/index.ts').href)
const out = {}
const seen = new Set()
function visit(node, section) {
  if (Array.isArray(node)) { node.forEach((n) => visit(n, section)); return }
  if (!node || typeof node !== 'object' || seen.has(node)) return
  seen.add(node)
  if (typeof node.id === 'string' && /^S\\d\\d-T\\d-[A-Z]-E\\d$/.test(node.id)) {
    out[node.id] = { starter: node.starterCode?.code ?? null, solution: node.solutionCode?.code ?? null,
                     output: node.solutionCode?.output ?? null }
  }
  if (node.youDo && typeof node.youDo === 'object') {
    out[`S0${section}-youDo`] = { starter: node.youDo.starterCode ?? null,
      solution: node.youDo.solutionCode?.code ?? null, output: node.youDo.solutionCode?.output ?? null }
  }
  for (const v of Object.values(node)) visit(v, section)
}
for (const s of COURSE_SECTIONS) visit(s, s.index)
process.stdout.write(JSON.stringify(out))
"""


def course_exercises() -> dict:
    result = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-", str(ROOT)],
                            input=DUMP, capture_output=True, text=True, cwd=ROOT, timeout=300)
    assert result.returncode == 0, result.stderr
    return json.loads(result.stdout)


def run_python(code: str) -> tuple[int, str]:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(code, encoding="utf-8")
        done = subprocess.run([PY, "-I", str(path)], capture_output=True, text=True, timeout=60)
        return done.returncode, done.stdout


#: Exercises whose starter used to print the expected output unchanged (R1, C14).
STARTER_IDS = ["S05-T2-B-E1", "S05-T3-B-E2", "S05-T3-A-E3", "S06-T4-A-E1", "S04-youDo"]


class StarterIsNotTheAnswer(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.exercises = course_exercises()

    def test_each_listed_starter_differs_from_its_expected_output(self):
        same = []
        for key in STARTER_IDS:
            item = self.exercises[key]
            code, stdout = run_python(item["starter"])
            if code == 0 and stdout.strip() == item["output"].strip():
                same.append(key)
        self.assertEqual(same, [], "these starters already print the expected output")

    def test_the_str_versus_int_defect_is_visible_in_the_starter_output(self):
        """S05-010: the starter's first line must not equal the fixed program's first line.
        Whole-output comparison misses this one: the starter already lacks the note line."""
        item = self.exercises["S05-T2-B-E1"]
        _, starter_out = run_python(item["starter"])
        _, solution_out = run_python(item["solution"])
        self.assertNotEqual(starter_out.splitlines()[:1], solution_out.splitlines()[:1])

    def test_each_solution_prints_its_declared_output(self):
        wrong = []
        for key in STARTER_IDS:
            item = self.exercises[key]
            code, stdout = run_python(item["solution"])
            if code != 0 or stdout.strip() != item["output"].strip():
                wrong.append(key)
        self.assertEqual(wrong, [], "the solution does not produce its declared output")

    def test_the_negative_control_detects_an_unchanged_starter(self):
        """Control: a starter that is the answer must be caught by the same comparison."""
        item = self.exercises["S05-T3-A-E3"]
        code, stdout = run_python(item["solution"])
        self.assertEqual(code, 0)
        self.assertEqual(stdout.strip(), item["output"].strip())


# S04-005: wrong implementations of the You Do. Each must make the program fail or print something else.
S04_MUTANTS = {
    "empty_guard_removed": [("tasa_reject = n_reject / len(lote) if lote else None",
                             "tasa_reject = n_reject / len(lote)")],
    "amount_out_of_range_coded_ok": [('            monto_codigo = "OUT_OF_RANGE"', '            monto_codigo = "OK"')],
    "record_state_always_accept": [('        "estado": registro_estado,', '        "estado": "accept",')],
    "zero_amount_review_and_unknown_region_accept": [
        ("        elif monto_ingreso < 0:\n",
         "        elif monto_ingreso == 0:\n            monto_estado = \"review\"\n            monto_codigo = \"NEEDS_REVIEW\"\n"
         "            monto_mensaje = \"cero\"\n        elif monto_ingreso < 0:\n"),
        ('            region_estado = "review"\n            region_codigo = "NOT_IN_ALLOWLIST"',
         '            region_estado = "accept"\n            region_codigo = "OK"'),
    ],
}


class S04YouDoAssertsCatchWrongCode(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.item = course_exercises()["S04-youDo"]

    def test_the_reference_solution_passes_its_own_asserts(self):
        code, stdout = run_python(self.item["solution"])
        self.assertEqual((code, stdout.strip()), (0, "resumen 4 1 1 2 0.25\ntests OK"))

    def test_every_wrong_implementation_fails_the_you_do(self):
        survivors = []
        for name, replacements in S04_MUTANTS.items():
            source = self.item["solution"]
            for old, new in replacements:
                self.assertEqual(source.count(old), 1, f"{name}: text not found exactly once")
                source = source.replace(old, new)
            code, stdout = run_python(source)
            if code == 0 and stdout.strip() == "resumen 4 1 1 2 0.25\ntests OK":
                survivors.append(name)
        self.assertEqual(survivors, [], "these wrong implementations still pass the You Do")

    def test_the_starter_stops_before_it_can_print(self):
        code, stdout = run_python(self.item["starter"])
        self.assertNotEqual(code, 0)
        self.assertNotIn("tests OK", stdout)


if __name__ == "__main__":
    unittest.main()
