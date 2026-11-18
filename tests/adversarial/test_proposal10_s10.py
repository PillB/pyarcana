"""Proposal 10 (approved 2026-11-11), S10: the P2 and P3 findings of the item-by-item review.

The four P1 findings (the T1-A demo that ran main on import, the SemVer exercise that classified
by words, the two reason strings nobody gave, and the `.env.*` pattern that ignored the template)
were closed on main by test_proposal10_p1. This file covers the rest.

Three shapes repeat in S10. First, an exercise whose visible case also passes the wrong answer:
a default for an unknown kind, a hard-coded `2.0.0`, a version always reset to `0.1.0`, a
literal list of paths, a parser without `choices`, a validator that ignores `log_level`, and a
literal hardened dict. Each exercise now carries the case that separates the two answers, and
these tests plant each wrong answer. Second, code that contradicts its own prose: diagnostics
printed to stdout in a lesson about keeping stdout clean, swapped figures, two contracts for
`ingest`, `SystemExit` here and `RuntimeError` there. Third, words and tools used before they
are explained (CLI, requires-python, pinned, upper bound, import *, echo_sql, harness).

Negative controls: every reference prints its pin, a no-op mutation raises, an irrelevant edit
is not caught, starters run and differ from the pin, the You Do suite fails when the package
prints on import, and the bank scan reads the whole S10 bank.
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
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

DUMP = """
import {{ section10 }} from {path!r};
console.log(JSON.stringify(section10));
"""


@lru_cache(maxsize=None)
def s10() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s10-modules-packaging-cli.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S10 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s10()["theory"] if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def block_by_title(title: str) -> dict:
    hits = [b for b in s10()["theory"] if (b.get("code") or {}).get("title") == title]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory code block {title!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s10()["iDo"]["steps"] if d["demoId"] == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s10()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def learner_text() -> str:
    sec = s10()
    parts: list[str] = [sec["tagline"], sec["jobRelevance"]]
    parts += [o["text"] for o in sec["learningOutcomes"]]
    for b in sec["theory"]:
        parts += [b["heading"], *b.get("paragraphs", [])]
        if b.get("callout"):
            parts += [b["callout"]["title"], b["callout"]["content"]]
    for d in sec["iDo"]["steps"]:
        parts += [d["description"], d["preamble"], d["why"], d["retrospective"]]
    for e in sec["weDo"]["steps"]:
        parts += [e["title"], e["preamble"], e["instruction"], e["feedback"], e["retrospective"],
                  e["tests"], e.get("hint", ""), *e.get("hints", []), *e.get("edgeCases", [])]
    yd = sec["youDo"]
    parts += [yd["context"], *yd["objectives"], *yd["requirements"], yd["portfolioNote"]]
    for q in sec["selfCheck"]["questions"]:
        parts += [q["question"], *q["options"], q["explanation"]]
    return "\n".join(parts)


def run_py(source: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        return subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=60, encoding="utf-8", cwd=tmp)


def caught(solution: str, pinned: str, mutated: str) -> bool:
    """True when the planted mistake shows: the run fails or the output differs from the pin."""
    if mutated == solution:
        raise AssertionError("the mutation did not change the code")
    done = run_py(mutated)
    return done.returncode != 0 or done.stdout.rstrip("\n") != pinned.rstrip("\n")


def bank() -> list[dict]:
    return [b for b in exam_bank.load_banks() if b["slug"] == "modules-packaging-cli"][0]["questions"]


RAISE_KIND = 'raise ValueError(f"kind no tipificado: {kind}")'

#: exercise id -> list of (finding, old text, new text): the wrong answer the exercise corrects.
MUTANTS = {
    "S10-T1-A-E3": [("WEDO-03 a default for an unknown kind", RAISE_KIND, 'return "PYTHONPATH=."')],
    "S10-T1-B-E3": [("WEDO-06 a hard-coded 2.0.0", 'return f"{int(maj) + 1}.0.0"', 'return "2.0.0"')],
    "S10-T2-A-E1": [("WEDO-07 version always reset", 'out["version"] = out.get("version") or "0.1.0"',
                     'out["version"] = "0.1.0"')],
    "S10-T2-A-E2": [("WEDO-08 a literal list of modules", 'for mod in modules]',
                     'for mod in ["__init__.py", "normalize.py", "cli.py"]]')],
    "S10-T2-B-E3": [("WEDO-12 a default for an unknown kind", RAISE_KIND,
                     'return "POLICY: S11 no rompe CLI de S10 sin bump y CHANGELOG"')],
    "S10-T3-A-E1": [("WEDO-13 a parser without choices", 'choices=["text", "json"], ', "")],
    "S10-T3-B-E3": [("WEDO-18 replace before strip", '" | ".join(err.getvalue().splitlines())',
                     'err.getvalue().replace("\\n", " | ").strip()')],
    "S10-T4-B-E2": [("WEDO-23 log_level not required", 'for k in ("log_level", "data_dir"):',
                     'for k in ("data_dir",):')],
    "S10-T4-B-E3": [("WEDO-24 a literal hardened dict", "    return out",
                     '    return {"log_level": "INFO", "echo_sql": False, "api_token": None}')],
}

#: theory block title -> (finding, old, new)
THEORY_MUTANTS = {
    "stdio_split.py": [
        ("THEORY-13.1 the log printed to stdout",
         'print("stage=normalize event=start", file=sys.stderr)', 'print("stage=normalize event=start")'),
    ],
    "stdout_contaminado.py": [
        ("THEORY-13.3 the corrected producer still prints ok to stdout",
         'print("ok", file=sys.stderr)', 'print("ok")'),
    ],
    "combinar_config.py": [
        ("THEORY-14.1 a None flag overwrites env",
         "out.update({k: v for k, v in flags.items() if v is not None})", "out.update(flags)"),
    ],
    "helper_privado.py": [
        ("THEORY-05.2 the colleague's import survives the rename",
         'publicar("_strip_text")\nprint("v2, importa _strip ', 'publicar("_strip")\nprint("v2, importa _strip '),
    ],
}


class ExercisesCheckTheCaseTheyTeach(unittest.TestCase):
    def test_reference_solutions_print_their_pinned_output(self) -> None:
        for e in s10()["weDo"]["steps"]:
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

    def test_starters_run_and_differ_from_the_pin(self) -> None:
        for e in s10()["weDo"]["steps"]:
            with self.subTest(exercise=e["id"]):
                done = run_py(e["starterCode"]["code"])
                self.assertNotEqual(done.stdout.rstrip("\n"), e["solutionCode"]["output"].rstrip("\n"))

    def test_the_starter_runs_the_new_case_too(self) -> None:
        # The exercises check "exactly the visible cases of the starter": a case only the
        # solution runs is a case the learner never sees.
        needles = {
            "S10-T1-A-E3": 'recommend_import_style("cosa_nueva")',
            "S10-T1-B-E3": "major_bump('3.4.1')",
            "S10-T2-A-E1": '"version": "0.3.0"',
            "S10-T2-A-E2": '["__init__.py", "cli.py"]',
            "S10-T2-B-E3": 'policy_for("otra_cosa")',
            "S10-T3-A-E1": '"--format", "xml"',
            "S10-T4-B-E2": 'validate_config({"data_dir": "data"})',
            "S10-T4-B-E3": "ya_seguro",
        }
        for ex_id, needle in needles.items():
            with self.subTest(exercise=ex_id):
                ex = exercise(ex_id)
                self.assertIn(needle, ex["starterCode"]["code"])
                self.assertIn(needle, ex["solutionCode"]["code"])

    def test_exact_lines_are_given_in_the_instruction(self) -> None:
        cases = {
            "S10-T1-B-E3": "usar compare(a,b) == 1.0 en vez de is True",
            "S10-T2-B-E3": "POLICY: S11 no rompe CLI de S10 sin bump y CHANGELOG",
            "S10-T3-A-E3": "HELP: Si falla, revise el código de salida: 2=uso, 1=error de datos/config",
        }
        for ex_id, line in cases.items():
            with self.subTest(exercise=ex_id):
                ex = exercise(ex_id)
                self.assertIn(line, ex["solutionCode"]["output"])
                self.assertIn(line, ex["instruction"])

    def test_no_trailing_separator(self) -> None:
        out = exercise("S10-T3-B-E3")["solutionCode"]["output"].splitlines()
        self.assertEqual(out[-1], "stderr_only empezando | fin")

    def test_a_no_op_mutation_raises(self) -> None:
        sol = exercise("S10-T4-B-E2")["solutionCode"]["code"]
        with self.assertRaises(AssertionError):
            caught(sol, "", sol)

    def test_an_irrelevant_edit_is_not_caught(self) -> None:
        sol = exercise("S10-T4-B-E2")["solutionCode"]
        edited = sol["code"].replace("def validate_config(", "# arranque\ndef validate_config(")
        self.assertFalse(caught(sol["code"], sol["output"], edited))


class TheoryShowsWhatItClaims(unittest.TestCase):
    def test_pins_hold(self) -> None:
        for b in s10()["theory"]:
            code = b.get("code")
            if not code or code.get("language") != "python":
                continue
            with self.subTest(block=code["title"]):
                done = run_py(code["code"])
                self.assertEqual(done.returncode, 0, done.stderr[-400:])
                self.assertEqual(done.stdout.rstrip("\n"), code["output"].rstrip("\n"))

    def test_each_planted_mistake_changes_the_block(self) -> None:
        for title, mutants in THEORY_MUTANTS.items():
            code = block_by_title(title)["code"]
            for finding, old, new in mutants:
                with self.subTest(block=title, finding=finding):
                    self.assertEqual(code["code"].count(old), 1, f"{finding}: anchor not in the block")
                    self.assertTrue(caught(code["code"], code["output"], code["code"].replace(old, new)))

    def test_redirected_stdout_holds_only_data(self) -> None:
        out = block_by_title("stdio_split.py")["code"]["output"].splitlines()
        self.assertEqual(out[0], "out.txt  → ['ana perez']")
        done = run_py(demo("S10-T3-B-DEMO")["code"]["code"])
        self.assertIn('a jq (stdout)       → {"name": "ana"}', done.stdout)
        self.assertNotIn("stage=", done.stdout.splitlines()[0])

    def test_the_contaminated_pipe_fails_to_parse(self) -> None:
        out = block_by_title("stdout_contaminado.py")["code"]["output"].splitlines()
        self.assertTrue(out[0].startswith("aviso en stdout → JSONDecodeError"))
        self.assertEqual(out[1], "aviso en stderr → leído {'name': 'ana'}")

    def test_a_private_import_breaks_after_the_rename(self) -> None:
        out = block_by_title("helper_privado.py")["code"]["output"].splitlines()
        self.assertTrue(out[1].startswith("v2, importa _strip    → ImportError"))
        self.assertEqual(out[3], "v2, importa normalize → ana")

    def test_the_file_layer_is_named_and_loaded(self) -> None:
        b = block_by_title("combinar_config.py")
        self.assertIn("familiarity.toml", " ".join(b["paragraphs"]))
        self.assertIn("tomllib", b["code"]["code"])
        out = b["code"]["output"].splitlines()
        self.assertEqual([line.split("'log_level': ")[1][:7] for line in out],
                         ["'WARNIN", "'DEBUG'", "'ERROR'"])

    def test_one_contract_per_command(self) -> None:
        # THEORY-16/17 and IDO-08 said two different things about ingest.
        mapping = '"ingest": "input_path", "report": "manifest_path"'
        self.assertIn(mapping, block_by_title("validate_config.py")["code"]["code"])
        self.assertIn(mapping, block_by_title("validar_tarde.py")["code"]["code"])
        self.assertIn(mapping, demo("S10-T4-B-DEMO")["code"]["code"])
        self.assertIn("para report", block_by_title("validar_tarde.py")["code"]["output"])

    def test_config_errors_use_one_exception_type(self) -> None:
        code = demo("S10-T4-B-DEMO")["code"]["code"]
        self.assertNotIn("SystemExit", code)
        self.assertIn("raise RuntimeError", code)

    def test_figures_sit_beside_their_text(self) -> None:
        self.assertEqual(block("Layout src, pyproject.toml y builds")["figure"]["id"], "S10-package-layout")
        self.assertEqual(block("Archivo/env/flags y precedencia")["figure"]["id"], "S10-config-precedence")
        self.assertNotIn("figure", block("Dependencias cíclicas y API pública"))

    def test_the_semver_demo_reads_the_kind(self) -> None:
        code = demo("S10-T2-B-DEMO")["code"]["code"]
        self.assertIn('NIVEL[cambio["kind"]]', code)
        self.assertNotIn("in palabras", code)

    def test_no_generated_identifiers(self) -> None:
        codes = [b["code"]["code"] for b in s10()["theory"] if b.get("code")]
        codes += [d["code"]["code"] for d in s10()["iDo"]["steps"]]
        for code in codes:
            self.assertNotRegex(code, r"\bs10_(th|ido)_\d")

    def test_the_pytest_example_imports_what_it_tests(self) -> None:
        b = block("Qué hace `pytest` y por qué es una dependencia de desarrollo")
        self.assertIn("from normalizador import normalize", b["code"]["code"])
        self.assertIn("1 passed", b["code"]["code"])
        self.assertIn("NameError", " ".join(b["paragraphs"]))


class WordsAreDefinedWhereUsed(unittest.TestCase):
    def test_header_glosses(self) -> None:
        sec = s10()
        self.assertIn("CLI (interfaz de línea de comandos)", sec["tagline"])
        outcomes = " ".join(o["text"] for o in sec["learningOutcomes"])
        self.assertIn("SemVer (MAJOR.MINOR.PATCH)", outcomes)
        self.assertIn("versión mínima de Python (requires-python)", outcomes)
        self.assertNotIn("semver simple", outcomes)

    def test_terms_are_explained(self) -> None:
        text = learner_text()
        for needle in ("requires a different Python", "numpy>=1.26", "from paquete import *",
                       "`echo_sql` activa el registro", "lanzando `SystemExit`", "`e.code`",
                       "pip install -e \".[dev]\"", "python -m pip show familiarity-core",
                       "redirect_stdout", "sin default vale `None`"):
            with self.subTest(needle=needle):
                self.assertIn(needle, text)

    def test_no_untaught_or_house_term(self) -> None:
        text = learner_text()
        for term in ("harness", "pinadas", "upper bounds", "reducen tickets", "Bloque de referencia",
                     "cat data.json | familiarity normalize", "`última línea`", "con textos con acentos",
                     "en textos con acentos", "CP-N1-B empaquetado / base", "... | normalize"):
            with self.subTest(term=term):
                self.assertNotIn(term, text)

    def test_s09_is_not_credited_with_exit_codes(self) -> None:
        text = " ".join(block("Contrato de la sección (referencia)")["paragraphs"])
        self.assertNotIn("S09: registros sin datos personales y códigos de salida", text)

    def test_sentences_fit(self) -> None:
        # THEORY-01.1 (49 words) and THEORY-07.2 (55 words) were run-ons.
        for heading in ("Cuando el código tiene que salir de tu laptop", "Layout src, pyproject.toml y builds"):
            for para in block(heading)["paragraphs"]:
                for sentence in re.split(r"(?<=[.!?])\s+", para):
                    with self.subTest(heading=heading, sentence=sentence[:40]):
                        self.assertLessEqual(len(re.findall(r"\b\w+\b", sentence)), 45)


class YouDoRunsAsWritten(unittest.TestCase):
    def bootstrap(self, folder: Path, source: str) -> Path:
        script = folder / "bootstrap.py"
        script.write_text(source, encoding="utf-8")
        done = subprocess.run([sys.executable, "-I", str(script)], cwd=folder,
                              capture_output=True, text=True, timeout=60)
        self.assertEqual(done.returncode, 0, done.stderr[-400:])
        return folder / "familiarity_core_project"

    def cli(self, project: Path, *args: str) -> subprocess.CompletedProcess:
        env = {"PATH": os.environ.get("PATH", ""), "PYTHONPATH": str(project / "src")}
        return subprocess.run([sys.executable, "-m", "familiarity_core", *args], cwd=project,
                              env=env, capture_output=True, text=True, timeout=60)

    def suite(self, project: Path) -> subprocess.CompletedProcess:
        env = {"PATH": os.environ.get("PATH", ""), "PYTHONPATH": str(project / "src")}
        return subprocess.run([sys.executable, "-m", "unittest", "discover", "-s", "tests"],
                              cwd=project, env=env, capture_output=True, text=True, timeout=120)

    def test_starter_ships_the_data_and_the_invariant_tests(self) -> None:
        starter = s10()["youDo"]["starterCode"]
        for needle in ('"data/clients.csv"', "test_usage_error_exits_2", "test_import_prints_nothing"):
            with self.subTest(needle=needle):
                self.assertIn(needle, starter)

    def test_readme_steps_and_portfolio_command_run(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = self.bootstrap(Path(tmp), s10()["youDo"]["solutionCode"]["code"])
            suite = self.suite(project)
            self.assertEqual(suite.returncode, 0, suite.stderr[-800:])
            self.assertEqual(self.cli(project, "ingest", "--input", "data/clients.csv", "--out-dir", "out").returncode, 0)
            self.assertEqual(self.cli(project, "report", "--manifest", "out/manifest.json").returncode, 0)
            done = self.cli(project, "normalize", "Ana")
            self.assertEqual((done.returncode, done.stdout), (0, "ana\n"))
            (project / "q.csv").write_text('id,name,monto\nC1,Ana,"10,50"\n', encoding="utf-8")
            done = self.cli(project, "ingest", "--input", "q.csv", "--out-dir", "out2")
            self.assertEqual(json.loads(done.stdout)["n_quarantine"], 0)

    def test_a_package_that_prints_on_import_fails_the_suite(self) -> None:
        with tempfile.TemporaryDirectory() as tmp:
            project = self.bootstrap(Path(tmp), s10()["youDo"]["solutionCode"]["code"])
            init = project / "src" / "familiarity_core" / "__init__.py"
            init.write_text('print("cargando")\n' + init.read_text(encoding="utf-8"), encoding="utf-8")
            suite = self.suite(project)
            self.assertNotEqual(suite.returncode, 0)
            self.assertIn("test_import_prints_nothing", suite.stderr)

    def test_requirements_and_portfolio_are_runnable(self) -> None:
        yd = s10()["youDo"]
        self.assertIn("después de `python -m pip install -e .`", " ".join(yd["requirements"]))
        self.assertIn('familiarity normalize "Ana" > out.json 2> log.txt', yd["portfolioNote"])


class SelfCheckAndBank(unittest.TestCase):
    KEYS = {
        1: "Ejecutar el CLI o la demo solo al correr el archivo, no al importarlo",
        2: "flags > env > file > defaults",
        3: "Error de uso o de parseo de los argumentos",
        4: "stderr, el canal de diagnóstico",
        5: "minor",
        6: ".env con API_TOKEN",
    }

    def test_keys_are_kept(self) -> None:
        qs = s10()["selfCheck"]["questions"]
        for n, key in self.KEYS.items():
            with self.subTest(question=n):
                q = qs[n - 1]
                self.assertEqual(q["options"][q["correctIndex"]], key)

    def test_the_key_is_not_the_longest(self) -> None:
        qs = s10()["selfCheck"]["questions"]
        for n in (1, 3, 4, 5, 6):
            with self.subTest(question=n):
                q = qs[n - 1]
                self.assertLess(len(q["options"][q["correctIndex"]]), max(map(len, q["options"])))

    def test_bank_has_no_length_cue(self) -> None:
        qs = bank()
        self.assertEqual(len(qs), 24)
        longest = [q["question"][:50] for q in qs
                   if len(q["options"][q["correctIndex"]]) == max(map(len, q["options"]))]
        self.assertEqual(longest, [])

    def test_bank_stems_and_explanations(self) -> None:
        stems = {q["question"]: q for q in bank()}
        self.assertNotIn("Al avanzar hacia S11, ¿qué mantiene compatible la API pública del paquete?", stems)
        compat = stems["¿Qué mantiene compatible la API pública del paquete al cambiar su versión?"]
        self.assertNotRegex(compat["question"], r"S\d\d")
        merge = [q for q in bank() if q["question"].startswith("En `merge_config`")][0]
        self.assertIn("combinar_config", merge["question"])
        flag = [q for q in bank() if q["question"].startswith("log_level viene en archivo")][0]
        self.assertIn("flags > env > archivo > defaults", flag["explanation"])
        self.assertFalse(any(" set" in o for o in flag["options"]))


if __name__ == "__main__":
    unittest.main()
