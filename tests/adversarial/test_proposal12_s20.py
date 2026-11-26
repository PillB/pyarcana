"""Proposal 12 (approved 2026-11-21), S20: the P1, P2 and P3 findings of the item-by-item review.

S20 teaches Excel automation with openpyxl. The review found four shapes.

First, checks that cannot fail, in the section that teaches fail-closed checks. Three were P1. The
demo printed master_intact from master.exists(), which is True after a save over the master. The
You Do reconciled the total it had just written into Salida with itself. Its idempotence flag
compared a digest of the rows with the digest of the same rows reversed, which sorting makes equal
for any list. The manifest in theory was a dict with typed True flags. Each now computes from a
second source, and the tests below change the input and expect the flag to move.

Second, claims the code did not show: a no-cache formula reads as None, a write to a merged
non-anchor cell raises AttributeError, merge_cells drops the values of the non-anchor cells, and
openpyxl writes into a protected sheet. Each was run under the pinned openpyxl 3.1.5 before it was
written, and the theory and demos now print it.

Third, text that disagreed with the code: a preamble allowlist with Berlin and without Lima, success
lines naming a region not in the data, three definitions of the canonical sheets, two rules for the
master, and a capstone name (CP-N2-B) whose catalog entry has no Excel.

Fourth, We Do checks a constant or a catch-all could pass, and an exam bank at 100% for "pick the
longest", with items on named ranges, tables, charts and sheet protection the lesson never taught.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s20-rag.ts"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

VENV_PY = ROOT / ".venv-content/bin/python"
if VENV_PY.exists():
    CONTENT_PY: Path | None = VENV_PY
elif os.environ.get("PYARCANA_PINNED_CONTENT_ENV") == "1":
    CONTENT_PY = Path(sys.executable)
else:
    CONTENT_PY = None
needs_openpyxl = unittest.skipUnless(CONTENT_PY, "needs the pinned content interpreter (openpyxl, pandas)")

#: A dynamic import, read from the named export or from `default`: Node 20 (content-gates) exposes
#: a .ts module's exports in this CommonJS package only on `default`. See docs/agents/lessons.md.
DUMP = """
const mod = await import({path!r});
const section = mod.section20 ?? mod.default?.section20;
if (!section) throw new Error('section20 not found in ' + Object.keys(mod).join(','));
console.log(JSON.stringify(section));
"""


@lru_cache(maxsize=None)
def s20() -> dict:
    script = DUMP.format(path=str(SECTION))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S20 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(subtopic: str) -> dict:
    hits = [b for b in s20()["theory"] if b.get("subtopicId") == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {subtopic!r}, found {len(hits)}")
    return hits[0]


def prose(subtopic: str) -> str:
    b = block(subtopic)
    return " ".join(b["paragraphs"]) + " " + b.get("callout", {}).get("content", "")


def demo(subtopic: str) -> dict:
    hits = [d for d in s20()["iDo"]["steps"] if d["subtopicId"] == subtopic]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo for {subtopic!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s20()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_strings(node, key: str = "") -> list[str]:
    """Prose a learner reads: every string except code, pinned output and URLs."""
    if key in ("code", "starterCode", "solutionCode", "output", "url"):
        return []
    if isinstance(node, str):
        return [node]
    if isinstance(node, dict):
        return [s for k, v in node.items() for s in learner_strings(v, k)]
    if isinstance(node, list):
        return [s for v in node for s in learner_strings(v, key)]
    return []


def s20_text() -> str:
    return " ".join(learner_strings(s20()))


def run_py(source: str) -> subprocess.CompletedProcess:
    if CONTENT_PY is None:
        raise unittest.SkipTest("needs the pinned content interpreter (openpyxl, pandas)")
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([str(CONTENT_PY), "-I", str(path)], capture_output=True,
                              text=True, timeout=120, encoding="utf-8", cwd=tmp)


def stdout_of(source: str) -> str:
    done = run_py(source)
    if done.returncode != 0:
        raise AssertionError("snippet raised: " + done.stderr[-600:])
    return done.stdout.rstrip("\n")


def escaped(solution: str, pinned: str, mutated_code: str) -> str:
    """Empty when the planted mistake shows (the run fails or the output differs from the pin).

    Otherwise it is what the mutant printed, so a failure says which behaviour survived."""
    if mutated_code == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated_code)
    if done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n"):
        return ""
    return "exit 0 and the pinned output:\n" + done.stdout[-400:]


def caught(solution: str, pinned: str, mutated_code: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    return escaped(solution, pinned, mutated_code) == ""


def mutated(code: str, old: str, new: str) -> str:
    if code.count(old) != 1:
        raise AssertionError(f"mutation anchor found {code.count(old)} times: {old!r}")
    return code.replace(old, new)


class EveryPinRuns(unittest.TestCase):
    @needs_openpyxl
    def test_theory_and_demo_code_prints_its_pinned_output(self) -> None:
        snippets = [(b["heading"], b["code"]) for b in s20()["theory"] if b.get("code")]
        snippets += [(d["demoId"], d["code"]) for d in s20()["iDo"]["steps"]]
        self.assertGreaterEqual(len(snippets), 16, f"a theory or demo example was lost: {[n for n, _ in snippets]}")
        for name, code in snippets:
            with self.subTest(name):
                self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    @needs_openpyxl
    def test_every_solution_hits_its_pin_and_no_starter_does(self) -> None:
        for e in s20()["weDo"]["steps"]:
            with self.subTest(e["id"]):
                self.assertEqual(stdout_of(e["solutionCode"]["code"]), e["solutionCode"]["output"].rstrip("\n"))
                done = run_py(e["starterCode"]["code"])
                self.assertTrue(done.returncode != 0 or done.stdout.rstrip("\n") != e["solutionCode"]["output"].rstrip("\n"),
                                "the starter already prints the expected output")


class ChecksCanFail(unittest.TestCase):
    """Each flag the section calls evidence moves when the thing it guards breaks."""

    @needs_openpyxl
    def test_master_intact_is_a_hash_and_a_save_over_the_master_flips_it(self) -> None:
        """IDO-03.1 (P1): exists() was True after a save over the master."""
        code = demo("S20-T2-A")["code"]["code"]
        self.assertNotIn("master.exists()", code)
        self.assertIn("master_intact True", demo("S20-T2-A")["code"]["output"])
        broken = mutated(code, "        wb.save(out)\n", "        wb.save(out)\n        wb.save(master)\n")
        self.assertIn("master_intact False", stdout_of(broken))

    @needs_openpyxl
    def test_openpyxl_leaves_no_cache_and_the_demo_prints_none(self) -> None:
        """IDO-02.1: a str != int comparison was presented as proof."""
        d = demo("S20-T1-B")
        self.assertNotIn("formula != py_val", d["code"]["code"])
        self.assertTrue(d["code"]["output"].endswith("cache_sin_motor None"),
            "the demo must show that openpyxl reads no cached value (None) from a file no engine recalculated: expected the end " + repr("cache_sin_motor None")
            + ", got " + repr((d["code"]["output"])[-160:]))
        self.assertIn("la fórmula devuelve `None`", prose("S20-T1-B"))

    @needs_openpyxl
    def test_the_reconcile_gate_checks_the_count(self) -> None:
        """IDO-05.1 and THEORY-07.1: an extra row of 0.0 kept the total and passed."""
        self.assertIn("reconcile_con_fila_extra False", demo("S20-T3-A")["code"]["output"])
        th = block("S20-T3-A")["code"]
        self.assertIn("reconcile True", th["output"])
        self.assertIn("len(det) == n_portada", th["code"])
        self.assertIn("reconcile False", stdout_of(mutated(th["code"], "tot_portada, n_portada = 22.0, 3",
                                                           "tot_portada, n_portada = 22.0, 4")))

    @needs_openpyxl
    def test_the_structural_check_reads_a_workbook_without_salida(self) -> None:
        """THEORY-08.1: the snippet compared two typed lists and read no workbook."""
        out = block("S20-T3-B")["code"]["output"]
        self.assertIn("['Entrada', 'Salida'] structural_ok True", out)
        self.assertIn("['Entrada', 'Log'] structural_ok False", out)

    @needs_openpyxl
    def test_the_theory_manifest_is_computed_and_reconciles_against_the_vp_total(self) -> None:
        """THEORY-10.1: the manifest was a dict with typed True flags."""
        code = block("S20-T4-B")["code"]["code"]
        self.assertNotRegex(code, r'"(reconcile_ok|idempotent)": True')
        self.assertIn('"reconcile_ok": true', block("S20-T4-B")["code"]["output"])
        self.assertIn('"reconcile_ok": false', stdout_of(mutated(code, '"total_portada", 15.0', '"total_portada", 16.0')))

    @needs_openpyxl
    def test_the_batch_records_what_nobody_expected(self) -> None:
        """IDO-07.1: any exception outside BadZipFile and PermissionError stopped the batch."""
        d = demo("S20-T4-A")
        self.assertIn("load_workbook(path)", d["code"]["code"])
        self.assertIn("'otro.xlsx': 'error: KeyError'", d["code"]["output"])
        self.assertIn("'error': 1", d["code"]["output"])

    @needs_openpyxl
    def test_idempotence_is_two_runs_and_a_run_on_the_old_output_breaks_it(self) -> None:
        """IDO-08.1/08.2: the flag compared one sorted list with its reverse; backup and n were typed."""
        d = demo("S20-T4-B")
        code, out = d["code"]["code"], d["code"]["output"]
        self.assertNotIn("reversed(", code)
        self.assertIn('"idempotent": true', out)
        self.assertIn('"backup": "results.prev.xlsx"', out)
        self.assertIn('"master_unchanged": true', out)
        self.assertIn("rerun_sobre_salida False 4", out)
        self.assertIn('"idempotent": false', stdout_of(mutated(code, "r2 = correr(master, out, filas)", "r2 = correr(out, out, filas)")))


class SaidAndShown(unittest.TestCase):
    """Behaviour of the pinned openpyxl that the text now states, checked against the library itself."""

    @needs_openpyxl
    def test_openpyxl_behaves_as_the_section_says(self) -> None:
        probe = """
from openpyxl import Workbook, load_workbook
from pathlib import Path
import tempfile
wb = Workbook(); ws = wb.active
ws["B1"], ws["C1"] = "a", "b"; ws.merge_cells("B1:C1"); print(ws["C1"].value)
try:
    ws["C1"] = "x"
except AttributeError:
    print("AttributeError")
print(wb.create_sheet("vacia").max_row)
ws["D1"] = " =A1"; print(ws["D1"].data_type)
d = Path(tempfile.mkdtemp()); ws["E1"] = "=1+1"; ws.protection.sheet = True; wb.save(d / "f.xlsx")
print(load_workbook(d / "f.xlsx", data_only=True).active["E1"].value)
p = load_workbook(d / "f.xlsx"); p.active["A9"] = 1; p.save(d / "g.xlsx"); print(load_workbook(d / "g.xlsx").active["A9"].value)
"""
        self.assertEqual(stdout_of(probe).splitlines(), ["None", "AttributeError", "1", "s", "None", "1"])
        text = s20_text()
        for claim in ("lanza `AttributeError` (`MergedCell`)", "`merge_cells` borra los valores",
                      "openpyxl no la aplica y escribe igual", "`max_row` 1 incluso en una hoja vacía",
                      "openpyxl lo guarda como texto, no como fórmula"):
            with self.subTest(claim):
                self.assertIn(claim, text)

    def test_the_self_check_merge_explanation_names_the_error(self) -> None:
        q = next(q for q in s20()["selfCheck"]["questions"] if "combinadas" in q["question"])
        self.assertIn("AttributeError", q["explanation"])
        self.assertNotIn("no actualiza el valor visible", q["explanation"])


class OneContract(unittest.TestCase):
    def test_the_canonical_sheets_are_defined_one_way(self) -> None:
        """THEORY-01.1: Datos was required in two blocks and optional in one."""
        text = s20_text()
        self.assertNotIn("Hojas canónicas: Entrada, Datos, Salida", text)
        self.assertNotIn("Las hojas canónicas son Entrada, Datos y Salida", text)
        self.assertGreaterEqual(text.count("Datos es opcional"), 3)

    def test_one_rule_for_the_master(self) -> None:
        """THEORY-05.1: «sin backup» read as permission to overwrite with one."""
        text = s20_text()
        self.assertNotIn("sin backup", text)
        self.assertEqual(text.count("Nunca escribas sobre el master; escribe siempre en una copia."), 2)

    def test_no_capstone_the_catalog_does_not_give_excel(self) -> None:
        """THEORY-04.2: CP-N2-B's catalog brief has no Excel; the neutral option names no capstone."""
        raw = SECTION.read_text(encoding="utf-8")
        self.assertNotIn("CP-N2-B", raw)
        self.assertNotIn("cpn2b", raw)

    def test_the_workbook_is_not_called_a_graph(self) -> None:
        self.assertNotIn("grafo", s20_text())

    def test_headless_and_named_ranges_are_explained_where_they_appear(self) -> None:
        self.assertIn("*headless* (sin pantalla ni Excel", prose("S20-T1-B"))
        t1a = prose("S20-T1-A")
        self.assertIn("Un **nombre definido** (*named range*)", t1a)
        self.assertIn("openpyxl no lo mueve", t1a)
        self.assertIn("min_row=2", t1a)

    def test_dates_are_written_as_dates(self) -> None:
        """THEORY-06.1."""
        self.assertIn("escribe la fecha como objeto `date` o `datetime`, no como texto", prose("S20-T2-B"))

    def test_the_lock_note_says_it_depends_on_the_os(self) -> None:
        """THEORY-09.1."""
        self.assertIn("depende del sistema", prose("S20-T4-A"))


class RegionsMatchTheCode(unittest.TestCase):
    def test_demo_preambles_name_the_regions_the_code_writes(self) -> None:
        """IDO-01.1 and IDO-06.1."""
        d1 = demo("S20-T1-A")
        self.assertIn("Lima/Bogota", d1["preamble"])
        self.assertIn('"Lima"', d1["code"]["code"])
        d6 = demo("S20-T3-B")
        self.assertIn("allowlist Lima/Bogota/Madrid", d6["preamble"])
        self.assertIn('allowed = {"Lima", "Bogota", "Madrid"}', d6["code"]["code"])

    def test_success_lines_match_the_data(self) -> None:
        """WEDO-14.1, WEDO-17.1, WEDO-18.1."""
        e = exercise("S20-T3-A-E2")
        self.assertIn(e["solutionCode"]["output"], e["preamble"])
        e = exercise("S20-T3-B-E2")
        self.assertIn("(Madrid está permitida)", e["preamble"])
        self.assertIn('allowed = {"Madrid", "Bogota"}', e["solutionCode"]["code"])
        e = exercise("S20-T3-B-E3")
        self.assertIn('{"Madrid", "Bogota", "Berlin"}', e["solutionCode"]["code"])
        self.assertIn("allowlist Madrid/Bogota/Berlin", e["preamble"])


#: (exercise, anchor in the solution, planted mistake): each must change the printed answer.
MUTATIONS = [
    ("S20-T1-A-E1", 'ws.title = "Entrada"\n', ""),
    ("S20-T1-A-E2", 'ws.append(["Lima", 10.0])\n', ""),
    ("S20-T1-A-E3", 'wb.create_sheet("Salida")\n', ""),
    ("S20-T1-B-E1", 'ws["A3"] = "=A1+A2"', 'ws["A3"] = 0'),
    ("S20-T1-B-E2", 'ws["A2"] = 4', 'ws["A2"] = 0'),
    ("S20-T1-B-E3", "isinstance(v, str) and ", ""),
    ("S20-T2-A-E1", 'ws["A1"].font = Font(bold=True)\n', ""),
    ("S20-T2-A-E2", 'fgColor="1F4E79"', 'fgColor="2E6DA4"'),
    ("S20-T2-A-E3", "    wb.save(out)\n", "    wb.save(out)\n    wb.save(master)\n"),
    ("S20-T2-B-E1", 'ws["A1"] = date(2024, 1, 15)', 'ws["A1"] = "2024-01-15"'),
    ("S20-T2-B-E2", 'ws["B1"] = "x"\n', ""),
    ("S20-T2-B-E3", 'ws.merge_cells("C1:D1")\n', ""),
    ("S20-T3-A-E1", 'ws["B1"] = 15.0', 'ws["B1"] = 16.0'),
    ("S20-T3-A-E2", ".sum()", ".mean()"),
    ("S20-T3-A-E3", "tol=0.01", "tol=0.0"),
    ("S20-T3-B-E1", 'ws["B1"] = "monto"\n', ""),
    ("S20-T3-B-E2", "if r not in allowed", "if r in allowed"),
    ("S20-T3-B-E3", "not in allowed", "in allowed"),
    ("S20-T4-A-E1", 'v == "ok"', 'v == "corrupt"'),
    ("S20-T4-A-E2", '    except BadZipFile:\n        return "corrupt"\n    except PermissionError:\n',
     "    except Exception:\n"),
    ("S20-T4-A-E3", "dict(Counter(files.values()))", "list(files.values())"),
    ("S20-T4-B-E1", "hashlib.sha1(payload).hexdigest()[:8]", '"00000000"'),
    ("S20-T4-B-E2", "sorted(rows)", "sorted(set(rows))"),
    ("S20-T4-B-E3", ">=", "=="),
]


class WeDoChecksCanFail(unittest.TestCase):
    def test_every_exercise_has_a_planted_mistake(self) -> None:
        self.assertEqual({m[0] for m in MUTATIONS}, {e["id"] for e in s20()["weDo"]["steps"]})

    @needs_openpyxl
    def test_every_planted_mistake_changes_the_answer(self) -> None:
        for ex_id, old, new in MUTATIONS:
            sol = exercise(ex_id)["solutionCode"]
            with self.subTest(ex_id, mutation=new[:50]):
                self.assertEqual(escaped(sol["code"], sol["output"], mutated(sol["code"], old, new)), "",
                    f"{ex_id}: the planted mistake prints the pinned answer"
                    + ". Next step: make the fixture reach the branch the mistake changes, so the pinned output can only come from the right logic.")

    def test_the_tests_line_of_the_first_exercise_says_what_passing_means(self) -> None:
        self.assertIn("Dos líneas exactas", exercise("S20-T1-A-E1")["tests"])


def you_do_solution(starter: str) -> str:
    """The starter with its three holes filled the way the comments ask."""
    filled = (starter
              .replace('sal["D1"] = None  # COMPLETAR: escribe det_sum (float)', 'sal["D1"] = det_sum')
              .replace('sal["D2"] = None  # COMPLETAR: escribe n_rows (int)', 'sal["D2"] = n_rows')
              .replace("    # COMPLETAR: return abs(det_sum - portada) < tol and n_det == n_portada\n    return False",
                       "    return abs(det_sum - portada) < tol and n_det == n_portada")
              .replace('# man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")',
                       'if manifest["reconcile_ok"]:\n    man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")'))
    if "COMPLETAR:" in filled:
        raise AssertionError("a hole in the You Do starter was not filled")
    return filled


def run_you_do(source: str) -> dict[str, str]:
    """Run the project and read its printed key-value lines; the delivery folder is removed after."""
    out = stdout_of(source)
    lines = dict(line.split(" ", 1) for line in out.splitlines())
    folder = Path(lines["carpeta"])
    try:
        lines["files"] = " ".join(sorted(p.name for p in folder.rglob("*") if p.is_file()))
    finally:
        for p in sorted(folder.rglob("*"), reverse=True):
            p.unlink() if p.is_file() else p.rmdir()
        folder.rmdir()
    return lines


class YouDo(unittest.TestCase):
    def starter(self) -> str:
        return s20()["youDo"]["starterCode"]

    @needs_openpyxl
    def test_the_filled_project_passes_and_leaves_its_deliverables_on_disk(self) -> None:
        """YOUDO-01.3: the deliverables were written into a folder deleted at the end of the run."""
        self.assertNotIn("TemporaryDirectory", self.starter())
        got = run_you_do(you_do_solution(self.starter()))
        for key in ("master_intact", "reconcile_ok", "idempotent", "manifest_written"):
            with self.subTest(key):
                self.assertEqual(got[key], "True")
        self.assertIn("manifest.json", got["files"])
        self.assertIn("results.xlsx", got["files"])

    @needs_openpyxl
    def test_the_gate_compares_with_the_vp_total_and_fails_closed(self) -> None:
        """YOUDO-01.1 (P1): the script reconciled the total it had just written with itself."""
        wrong = you_do_solution(self.starter()).replace('"total_portada", 15.0', '"total_portada", 16.0')
        got = run_you_do(wrong)
        self.assertEqual(got["reconcile_ok"], "False")
        self.assertEqual(got["manifest_written"], "False")
        self.assertNotIn("manifest.json", got["files"])

    @needs_openpyxl
    def test_idempotence_catches_a_run_that_builds_on_the_last_output(self) -> None:
        """YOUDO-01.2 (P1): the old flag compared a list with its own reverse and was always True."""
        sol = you_do_solution(self.starter())
        self.assertNotIn("reversed(", sol)
        accumulates = (sol.replace("    shutil.copy(master, out)  # siempre desde el master",
                                   "    if not out.exists(): shutil.copy(master, out)  # mutation")
                          .replace('    sal["D2"] = n_rows\n', '    sal["D2"] = n_rows\n    wb["Entrada"].append(["TOTAL", det_sum])\n'))
        self.assertNotEqual(accumulates, sol)
        self.assertEqual(run_you_do(accumulates)["idempotent"], "False")

    @needs_openpyxl
    def test_the_delivered_cells_are_read_back(self) -> None:
        """Codex review on #200 (P2): blank or wrong D1/D2 still printed reconcile_ok True."""
        sol = you_do_solution(self.starter())
        for name, bad in (("blank D1", 'sal["D1"] = None'), ("wrong D1", 'sal["D1"] = det_sum + 1'),
                          ("blank D2", None)):
            code = (sol.replace('    sal["D2"] = n_rows\n', '    sal["D2"] = None\n') if bad is None
                    else sol.replace('    sal["D1"] = det_sum\n', f"    {bad}\n"))
            with self.subTest(name):
                self.assertNotEqual(code, sol, f"{name}: the mutation anchor is gone from the solution")
                got = run_you_do(code)
                self.assertEqual(got["reconcile_ok"], "False",
                                 f"{name} in Salida was accepted: the gate checks memory, not the saved file")
                self.assertEqual(got["manifest_written"], "False", f"{name}: the manifest was written anyway")

    @needs_openpyxl
    def test_without_the_read_back_a_blank_cell_passes(self) -> None:
        """Negative control: removing salida_ok lets the blank D1 through, so the test above has teeth."""
        sol = you_do_solution(self.starter())
        no_check = sol.replace(' and salida_ok(releido["Salida"], det_sum, len(rows))', "")
        blank = no_check.replace('    sal["D1"] = det_sum\n', '    sal["D1"] = None\n')
        self.assertNotEqual(blank, sol, "the anchors for the negative control are gone")
        self.assertEqual(run_you_do(blank)["reconcile_ok"], "True",
                         "without the read-back the blank cell should pass; if not, the fixture changed")

    @needs_openpyxl
    def test_the_second_run_backs_up_the_first(self) -> None:
        """Codex review on #200 (P2): mkdtemp made out.exists() always False, so backup was always null."""
        got = run_you_do(you_do_solution(self.starter()))
        self.assertEqual(got["backup"], "results.prev.xlsx", f"the re-run overwrote without a backup: {got}")
        self.assertIn("results.prev.xlsx", got["files"], f"the backup is named but not on disk: {got['files']}")

    @needs_openpyxl
    def test_the_batch_reports_the_damaged_file(self) -> None:
        """YOUDO-01.4: the objective and rubric asked for a batch the starter did not have."""
        got = run_you_do(you_do_solution(self.starter()))
        self.assertEqual(got["batch"], "{'plantilla_vp.xlsx': 'ok', 'roto.xlsx': 'corrupt'}")
        reqs = " ".join(s20()["youDo"]["requirements"])
        self.assertIn("Batch: clasificar", reqs)
        self.assertIn("README", reqs)

    def test_the_portada_is_read_before_anything_is_written(self) -> None:
        starter = self.starter()
        self.assertLess(starter.index("portada, n_portada = leer_portada(wb)"),
                        starter.index("materialize_salida(wb, det_sum, len(rows))"))


class Writing(unittest.TestCase):
    SPLIT = re.compile(r"(?<=[.!?])\**\s+|\n")

    def test_no_sentence_over_32_words(self) -> None:
        long = []
        for text in learner_strings(s20()):
            text = re.sub(r"`[^`]*`", "X", text)
            long += [s for s in self.SPLIT.split(text) if len(s.split()) > 32]
        self.assertEqual(long, [])


def key_length_ranks(questions: list[dict]) -> list[int]:
    ranks = []
    for q in questions:
        lengths = [len(o) for o in q["options"]]
        key = lengths[q["correctIndex"]]
        if lengths.count(key) != 1:
            raise AssertionError(f"the key ties another option in length: {q['question']}")
        ranks.append(sorted(lengths, reverse=True).index(key) + 1)
    return ranks


class ExamBank(unittest.TestCase):
    def bank(self) -> list[dict]:
        return exam_bank.bank_for("rag")

    def test_key_length_rank_is_spread(self) -> None:
        ranks = key_length_ranks(self.bank())
        self.assertEqual(len(ranks), 24)
        self.assertEqual([ranks.count(r) for r in (1, 2, 3, 4)], [6, 6, 6, 6])

    def test_nothing_the_section_does_not_teach(self) -> None:
        """EXAM-02, -08, -09, -12, -17, -20: tables, charts, style loops, unprotect, validation, retries."""
        text = " ".join(q["question"] + " " + " ".join(q["options"]) + " " + q["explanation"] for q in self.bank())
        for gone in ("Table", "chart", "unprotect", "Data validation", "reintento acotado", "WASM", "theme.xml", "Memes"):
            with self.subTest(gone):
                self.assertNotIn(gone, text)

    def test_the_protection_key_is_what_openpyxl_does(self) -> None:
        q = next(q for q in self.bank() if "protección" in q["question"])
        self.assertIn("Escribe igual", q["options"][q["correctIndex"]])

    def test_the_named_range_item_is_taught_in_t1a(self) -> None:
        q = next(q for q in self.bank() if "nombre definido" in q["question"])
        self.assertIn("inserte filas", q["options"][q["correctIndex"]])
        self.assertIn("nombre definido", prose("S20-T1-A"))

    def test_every_explanation_says_why_the_distractors_fail(self) -> None:
        for q in self.bank():
            with self.subTest(q["question"][:40]):
                self.assertGreaterEqual(len(q["explanation"]), 200)


if __name__ == "__main__":
    unittest.main()
