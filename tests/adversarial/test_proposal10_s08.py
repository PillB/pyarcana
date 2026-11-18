"""Proposal 10 (approved 2026-11-11), S08: the P2 and P3 findings of the item-by-item review.

Most S08 We Do findings share the S07 shape: the check printed only what a wrong answer also
prints. A direct write passed the atomic-write exercise, a write with no temp file passed the
"mid-write" one, `len(row) > len(header)` passed the column count, a truthiness test passed the
key-presence schema, `write_bytes` passed the `copy2` backup, and a `run` that printed
`exit_code 1` but returned 0 passed the fail-closed gate. Each exercise now carries the case that
separates the two answers, and these tests plant each wrong answer and require the pin to change.

The other findings are contradictions: three quarantine record shapes across theory, We Do and
You Do; a default value the theory forbids without a contract; a You Do whose exit-1 demo could
not be produced from its own inputs; and keys that "pick the longest" found.

Negative controls: every reference prints its pin, a mutation that changes nothing raises, an
irrelevant edit is not "caught", starters run and differ from the pin, and the bank scan reads
the whole bank.
"""

from __future__ import annotations

import json
import re
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section08 }} from {path!r};
console.log(JSON.stringify(section08));
"""


@lru_cache(maxsize=None)
def s08() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s08-files-ingestion.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S08 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block_by_title(title: str) -> dict:
    hits = [b for b in s08()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory code block {title!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s08()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_text() -> str:
    sec = s08()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    for b in sec["theory"]:
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts.append(b["callout"]["content"])
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    parts.append(sec["weDo"]["intro"])
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], *e.get("hints", []), *e.get("edgeCases", [])]
    yd = sec["youDo"]
    parts += [yd["context"], *yd["objectives"], *yd["requirements"]]
    for q in sec["selfCheck"]["questions"]:
        parts += [q["question"], *q["options"], q["explanation"]]
    return "\n".join(parts)


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8")


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "files-ingestion"][0]["questions"]


MKSTEMP = ("fd, tmp_name = tempfile.mkstemp(dir=path.parent, prefix=path.name + '.', suffix='.tmp')\n"
           "    os.close(fd)\n    tmp = Path(tmp_name)")

#: exercise id -> list of (finding, old text, new text): the wrong answer the exercise corrects.
MUTANTS = {
    "S08-T1-A-E3": [
        ("WEDO-03 any sentence as the action", "print('acción: cuarentena del archivo')",
         "print('acción: arreglar las tildes a mano')"),
    ],
    "S08-T1-B-E2": [
        ("WEDO-05 fixed .tmp name", MKSTEMP, "tmp = path.with_name(path.name + '.tmp')"),
        ("WEDO-05 no os.replace, temp left behind", "    os.replace(tmp, path)\n",
         "    path.write_text(text, encoding='utf-8')\n"),
        ("WEDO-05 temp outside the destination folder", "dir=path.parent", "dir=tempfile.gettempdir()"),
    ],
    "S08-T1-B-E3": [
        ("WEDO-06 the half goes straight to dest", "tmp.write_text(mitad, encoding='utf-8', newline='\\n')",
         "dest.write_text(mitad, encoding='utf-8')"),
    ],
    "S08-T2-B-E1": [
        ("WEDO-10 only long rows", "irregular = len(row) != len(header)", "irregular = len(row) > len(header)"),
    ],
    "S08-T2-B-E2": [
        ("WEDO-11 raw is any text", "'raw': 'C2,Luis,EXTRA\\n'", "'raw': 'fila rota'"),
        ("WEDO-11 record_number dropped", "fieldnames=['raw', 'record_number', 'reason']",
         "fieldnames=['raw', 'reason'], extrasaction='ignore'"),
    ],
    "S08-T3-A-E1": [
        ("WEDO-13 positional parse", "obj = json.loads(raw)\n    print(obj['id'])",
         "print(raw.split('\"')[3])"),
    ],
    "S08-T3-B-E1": [
        ("WEDO-16 truthiness instead of presence", "if k not in obj]", "if not obj.get(k)]"),
    ],
    "S08-T4-A-E2": [
        ("WEDO-20 bytes rewritten by hand", "shutil.copy2(src, bak)", "bak.write_bytes(src.read_bytes())"),
        ("WEDO-20 copy without metadata", "shutil.copy2(src, bak)", "shutil.copy(src, bak)"),
    ],
    "S08-T4-B-E3": [
        ("WEDO-24 prints ERROR but returns 0", "        return 1\n", "        return 0\n"),
    ],
}


class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        """Negative control: a mutant only 'differs' if the reference itself is right."""
        for e in s08()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                sol = e["solutionCode"]
                done = run_py(sol["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), sol["output"].rstrip("\n"))

    def test_each_wrong_answer_changes_the_output(self) -> None:
        for ex_id, mutants in MUTANTS.items():
            sol = exercise(ex_id)["solutionCode"]
            for finding, old, new in mutants:
                with self.subTest(exercise=ex_id, finding=finding):
                    self.assertEqual(sol["code"].count(old), 1, f"{finding}: anchor not in the solution")
                    self.assertTrue(caught(sol["code"], sol["output"], sol["code"].replace(old, new)),
                                    f"{ex_id} still prints its pin with the mistake: {finding}")

    def test_starters_show_the_defect(self) -> None:
        for e in s08()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                done = run_py(e["starterCode"]["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertNotEqual(done.stdout.rstrip("\n"), e["solutionCode"]["output"].rstrip("\n"))

    def test_the_spy_block_is_the_same_in_starter_and_solution(self) -> None:
        e = exercise("S08-T1-B-E2")
        mark = "# Comprobación (no la edites)"
        tail = lambda code: code[code.index(mark):]  # noqa: E731
        self.assertEqual(tail(e["starterCode"]["code"]), tail(e["solutionCode"]["code"]))

    def test_a_no_op_mutation_raises(self) -> None:
        sol = exercise("S08-T4-B-E3")["solutionCode"]["code"]
        with self.assertRaises(AssertionError):
            caught(sol, "", sol)

    def test_an_irrelevant_edit_is_not_caught(self) -> None:
        sol = exercise("S08-T4-B-E3")["solutionCode"]
        edited = sol["code"].replace("def run(sources):", "# run\ndef run(sources):")
        self.assertFalse(caught(sol["code"], sol["output"], edited))

    def test_success_line_matches_the_printed_lines(self) -> None:
        cases = {
            "S08-T1-A-E3": ["acción: cuarentena del archivo"],
            "S08-T1-B-E3": ["mid ANTERIOR", "final COMPLETO"],
            "S08-T2-B-E2": ["'record_number': '2'"],
            "S08-T3-A-E1": ["C003"],
            "S08-T3-B-E1": ["(True, [])"],
            "S08-T4-B-E1": ["[('clients.csv', True), ('transactions.json', False)]"],
        }
        for ex_id, needles in cases.items():
            e = exercise(ex_id)
            for needle in needles:
                with self.subTest(exercise=ex_id, needle=needle):
                    self.assertIn(needle, e["preamble"])
                    self.assertIn(needle, e["solutionCode"]["output"])
        self.assertIn("la corta `['C3']`", exercise("S08-T2-B-E1")["preamble"])


class OneQuarantineShape(unittest.TestCase):
    def test_every_record_has_raw_record_number_and_reason(self) -> None:
        theory = block_by_title("csv_dict.py")["code"]["output"]
        self.assertNotIn("'fields':", theory)
        for m in re.finditer(r"\{'raw': '[^']*', 'record_number': \d+, 'reason': '\w+'", theory):
            self.assertTrue(m.group(0))
        self.assertEqual(len(re.findall(r"'raw': ", theory)), 3)
        we_do = exercise("S08-T2-B-E2")["solutionCode"]["output"]
        self.assertTrue(we_do.startswith("{'raw': 'C2,Luis,EXTRA\\n', 'record_number': '2', 'reason': 'col_count'"))
        context = s08()["youDo"]["context"]
        self.assertIn("`{raw, record_number, reason}`", context)
        self.assertNotIn("`{raw, reason}`", learner_text())

    def test_tell_is_explained_where_raw_is_recovered(self) -> None:
        para = " ".join(block_by_title("quarantine_rows.py")["paragraphs"])
        self.assertIn("`stream.tell()`", para)
        self.assertIn("telling position disabled by next() call", para)

    def test_the_tell_trap_is_real(self) -> None:
        """Negative control for the paragraph above: tell() on an open file fails inside the loop."""
        src = ("import csv, pathlib, tempfile\n"
               "p = pathlib.Path(tempfile.mkdtemp()) / 'a.csv'\n"
               "p.write_text('id\\nC1\\n', encoding='utf-8')\n"
               "with p.open(newline='', encoding='utf-8') as f:\n"
               "    next(csv.reader(f))\n"
               "    f.tell()\n")
        done = run_py(src)
        self.assertNotEqual(done.returncode, 0)
        self.assertIn("telling position disabled by next() call", done.stderr)


class TextAgreesWithTheTheory(unittest.TestCase):
    def test_default_segment_names_its_contract(self) -> None:
        self.assertIn("El contrato declara que la ausencia de `segment` significa `'standard'`",
                      exercise("S08-T3-B-E3")["preamble"])

    def test_decimal_feedback_does_not_promise_an_exception(self) -> None:
        fb = exercise("S08-T2-A-E3")["feedback"]
        self.assertNotIn("InvalidOperation", fb)
        self.assertIn("`'NaN'`", fb)
        done = run_py("from decimal import Decimal\nprint(Decimal('NaN'), Decimal('1e3'))")
        self.assertEqual(done.stdout.strip(), "NaN 1E+3")

    def test_hints_use_taught_calls(self) -> None:
        self.assertNotIn("stat()", " ".join(exercise("S08-T4-A-E3")["hints"]))
        self.assertIn("len(p.read_bytes())", exercise("S08-T4-A-E3")["hint"])
        self.assertTrue(any("`seek(0)` vuelve al inicio" in h for h in exercise("S08-T2-A-E2")["hints"]))

    def test_aggregate_check_is_explained_not_sold(self) -> None:
        fb = exercise("S08-T4-B-E2")["feedback"]
        self.assertNotIn("entrevista junior", fb)
        self.assertIn("si cada fuente cuadra, el total también cuadra", fb)

    def test_no_untaught_or_english_term(self) -> None:
        text = learner_text()
        for term in ["misconception", "Fail-closed", "fail-closed", "fail-fast", "streams de", "mid-write"]:
            with self.subTest(term=term):
                self.assertNotIn(term, text)


YOU_DO_BUILD_MANIFEST = '''
    names = [s["name"] for s in sources]
    if len(names) != len(set(names)):
        raise ValueError("nombre de fuente duplicado")
    rotas = [s["name"] for s in sources if s["n_in"] != s["n_clean"] + s["n_quarantine"]]
    if rotas:
        raise ValueError(f"reconcile fallo en {rotas}")
    return {"run_id": run_id, "sources": sources, "reconcile_ok": True}'''


class YouDoIsSpecified(unittest.TestCase):
    def test_inputs_outputs_and_tests_are_named(self) -> None:
        yd = s08()["youDo"]
        reqs = "\n".join(yd["requirements"])
        self.assertIn("clients.csv: columnas `id,nombre,monto`", reqs)
        self.assertIn("delimitador `,`", reqs)
        self.assertIn("out/backups/{run_id}/", reqs)
        self.assertIn("python -I etl_cp_n1_b.py", reqs)
        self.assertIn("`out/backups/{run_id}/`", yd["context"])
        self.assertIn("equivale a `sys.exit(code)`", yd["context"])
        self.assertNotIn("InvalidOperation", yd["starterCode"])
        self.assertIn("def fuentes_rotas(", yd["starterCode"])

    def test_the_exit_1_demo_exits_1_before_running(self) -> None:
        starter = s08()["youDo"]["starterCode"]
        head = re.search(r"def build_manifest\(.*?\n(?:    .*\n|\n)*?    raise NotImplementedError", starter, re.S)
        self.assertIsNotNone(head)
        signature = head.group(0)[: head.group(0).index('"""')].rstrip(" ")
        source = starter.replace(head.group(0), signature + YOU_DO_BUILD_MANIFEST.lstrip("\n"))
        source = source.replace("DEMO_RECONCILE_ROTO = False", "DEMO_RECONCILE_ROTO = True")
        done = run_py(source)
        self.assertEqual(done.returncode, 1)
        self.assertIn("ValueError: reconcile fallo en ['clients.csv']", done.stderr)
        self.assertNotIn("NotImplementedError", done.stderr, "run() must not be reached")

    def test_the_demo_is_off_by_default(self) -> None:
        """Negative control: with the flag off, the run is reached (and raises the stub's error)."""
        done = run_py(s08()["youDo"]["starterCode"])
        self.assertIn("NotImplementedError", done.stderr)


class SelfCheckAndBank(unittest.TestCase):
    def test_keys_are_not_the_longest_where_flagged(self) -> None:
        qs = s08()["selfCheck"]["questions"]
        self.assertEqual(len(qs), 11)
        for i in (1, 4, 6, 9):
            with self.subTest(question=i + 1):
                q = qs[i]
                key = len(q["options"][q["correctIndex"]])
                others = [len(o) for j, o in enumerate(q["options"]) if j != q["correctIndex"]]
                self.assertLessEqual(key, max(others) * 1.2)
        self.assertNotIn("filas duplicadas", json.dumps(qs[9], ensure_ascii=False))

    def test_bank_key_is_not_the_longest(self) -> None:
        """EXAM-04: the distractors were lengthened; the key keeps its wording (never trim the key)."""
        items = bank()
        self.assertEqual(len(items), 24, "the scan must read the whole bank")
        nl = [q for q in items if q["question"].startswith("Al usar el módulo csv, ¿por qué abrir")]
        self.assertEqual(len(nl), 1)
        opts = nl[0]["options"]
        key = len(opts[nl[0]["correctIndex"]])
        self.assertIn("no se dupliquen retornos en Windows", opts[nl[0]["correctIndex"]])
        self.assertLess(key, max(len(o) for j, o in enumerate(opts) if j != nl[0]["correctIndex"]))


if __name__ == "__main__":
    unittest.main()
