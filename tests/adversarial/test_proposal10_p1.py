"""Proposal 10 (approved 2026-11-11): the wrong answer keys and false statements of S01-S13.

Each test pins one P1 finding of the item-by-item review. Where the fix is a claim about Python,
git or SQLite, the test recomputes it, so a later edit that brings the error back fails here. The
negative controls run the old answer and show it still misbehaves, so a pass cannot be vacuous.
"""

from __future__ import annotations

import ast
import fnmatch
import json
import re
import shutil
import sqlite3
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
import {{ {name} }} from {path!r};
console.log(JSON.stringify({name}));
"""


@lru_cache(maxsize=None)
def section(file: str, name: str) -> dict:
    script = DUMP.format(name=name, path=str(SECTIONS / file))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read the section through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def theory(file: str, name: str, heading: str) -> dict:
    hits = [b for b in section(file, name)["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one block {heading!r}, found {len(hits)}")
    return hits[0]


def demo(file: str, name: str, demo_id: str) -> dict:
    ido = section(file, name)["iDo"]
    steps = ido["steps"] if isinstance(ido, dict) else ido
    hits = [d for d in steps if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def exercise(file: str, name: str, ex_id: str) -> dict:
    hits = [s for s in section(file, name)["weDo"]["steps"] if s.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def run(code: str, *flags: str) -> subprocess.CompletedProcess[str]:
    with tempfile.TemporaryDirectory(prefix="p10_") as scratch:
        script = Path(scratch) / "snippet.py"
        script.write_text(code + "\n", encoding="utf-8")
        return subprocess.run([sys.executable, "-I", *flags, str(script)], cwd=scratch,
                              capture_output=True, text=True, timeout=120)


def stdout_of(code: str) -> str:
    done = run(code)
    if done.returncode != 0:
        raise AssertionError("block raised: " + done.stderr[-600:])
    return done.stdout.rstrip("\n")


@lru_cache(maxsize=1)
def banks() -> dict[str, list[dict]]:
    return {b["slug"]: b["questions"] for b in exam_bank.load_banks()}


def question(slug: str, stem_part: str) -> dict:
    hits = [q for q in banks()[slug] if stem_part in q["question"]]
    if len(hits) != 1:
        raise AssertionError(f"expected one {slug} question with {stem_part!r}, found {len(hits)}")
    return hits[0]


def key(q: dict) -> str:
    return q["options"][q["correctIndex"]]


class S01RestoreDiscardsTheEdit(unittest.TestCase):
    """S01-EXAM-18: the explanation said restore and stash both "recover" the working tree."""

    def setUp(self) -> None:
        self.assertIsNotNone(shutil.which("git"), "these checks run git")
        self.q = question("setup", "aún no has hecho commit")

    def git_repo(self) -> Path:
        repo = Path(tempfile.mkdtemp(prefix="p10_git_"))
        self.addCleanup(shutil.rmtree, repo, True)
        env = ["-c", "user.name=p10", "-c", "user.email=p10@example.invalid"]
        subprocess.run(["git", "init", "-q", str(repo)], check=True)
        (repo / "a.txt").write_text("v1\n", encoding="utf-8")
        subprocess.run(["git", *env, "-C", str(repo), "add", "a.txt"], check=True)
        subprocess.run(["git", *env, "-C", str(repo), "commit", "-qm", "v1"], check=True)
        (repo / "a.txt").write_text("v2 editado\n", encoding="utf-8")
        self.env = env
        return repo

    def test_restore_loses_the_edit_and_stash_keeps_it(self) -> None:
        repo = self.git_repo()
        subprocess.run(["git", "-C", str(repo), "restore", "a.txt"], check=True)
        self.assertEqual((repo / "a.txt").read_text(encoding="utf-8"), "v1\n")
        stashes = subprocess.run(["git", "-C", str(repo), "stash", "list"], capture_output=True,
                                 text=True, check=True).stdout
        self.assertEqual(stashes, "", "restore keeps no copy of the edit")

        repo = self.git_repo()
        subprocess.run(["git", *self.env, "-C", str(repo), "stash", "-q"], check=True)
        self.assertEqual((repo / "a.txt").read_text(encoding="utf-8"), "v1\n")
        subprocess.run(["git", *self.env, "-C", str(repo), "stash", "pop", "-q"], check=True)
        self.assertEqual((repo / "a.txt").read_text(encoding="utf-8"), "v2 editado\n")

    def test_the_explanation_says_restore_loses_the_edit(self) -> None:
        text = self.q["explanation"]
        self.assertNotIn("recuperan el working tree", text)
        self.assertRegex(text, r"se pierde")
        self.assertRegex(text, r"`git stash` lo aparta")
        self.assertIn("git restore", key(self.q))


class S03NoUntaughtMatch(unittest.TestCase):
    """S03-EXAM-17/18: two exam items tested match/case, which S03 defers."""

    def test_no_s03_exam_item_names_match(self) -> None:
        for q in banks()["decisions-rules"]:
            text = " ".join([q["question"], *q["options"], q["explanation"]])
            self.assertNotRegex(text, r"match/case|`match|\bmatch \w+:|\bcase \"", q["question"])

    def test_in_on_a_set_is_an_or_and_the_loose_or_is_not(self) -> None:
        q = question("decisions-rules", 'code in {"MISSING", "NEEDS_REVIEW"}')
        self.assertIn("cualquiera", key(q))
        code = ('for code in ["MISSING", "NEEDS_REVIEW", "OK"]:\n'
                '    print(code in {"MISSING", "NEEDS_REVIEW"}, bool(code == "MISSING" or "NEEDS_REVIEW"))')
        self.assertEqual(stdout_of(code), "True True\nTrue True\nFalse True")

    def test_range_item_names_absence_first(self) -> None:
        q = question("decisions-rules", "tabla de códigos de una regla de rango")
        self.assertIn("ausencia", key(q))
        self.assertIn("TypeError", stdout_of("try:\n    None < 18\nexcept TypeError as e:\n    print(type(e).__name__)"))


class S04DenominatorIsAttempted(unittest.TestCase):
    """S04-EXAM-24 keyed rejects/procesados; S04-EXAM-13 called procesados and intentados one thing."""

    def test_no_s04_key_or_explanation_divides_by_processed(self) -> None:
        for q in banks()["iteration-summaries"]:
            self.assertNotIn("/procesados", key(q), q["question"])
            self.assertNotIn("procesados/intentados", q["explanation"], q["question"])
        q = question("iteration-summaries", "Para contar rejects en un lote")
        self.assertIn("rejects/intentados", key(q))

    def test_the_two_denominators_differ_when_a_row_fails_early(self) -> None:
        intentadas, procesadas, rejects = 3, 2, 1  # one row fails before it is processed
        self.assertNotEqual(rejects / intentadas, rejects / procesadas)


class S07EmptyTokensGiveNone(unittest.TestCase):
    """S07-EXAM-20 keyed a 1.0/0.0 contract for empty inputs; the section returns None."""

    def test_key_matches_the_taught_function(self) -> None:
        block = theory("s07-text-unicode-regex.ts", "section07", "Contraejemplo: un umbral elegido después de ver los scores")
        fn = block["code"]["code"].split("conocido =")[0]
        self.assertEqual(stdout_of(fn + "\nprint(token_jaccard('', ''), token_jaccard('', 'Ana'))"), "None None")
        q = question("text-unicode-regex", "Jaccard simple de tokens")
        self.assertIn("None", key(q))
        self.assertNotRegex(key(q) + q["explanation"], r"devuelve (1\.0|0\.0)")


class S07ExactNeedsEqualText(unittest.TestCase):
    """S07-THEORY-17: the corrected code declared exact on score 1.0 alone."""

    def setUp(self) -> None:
        self.block = theory("s07-text-unicode-regex.ts", "section07", "Contraejemplo: un umbral elegido después de ver los scores")

    def test_pinned_output(self) -> None:
        code = self.block["code"]
        self.assertEqual(stdout_of(code["code"]), code["output"].rstrip("\n"))

    def test_reordered_name_goes_to_review(self) -> None:
        out = stdout_of(self.block["code"]["code"] + "\nprint(decidir('Perez Juan', 'Juan Perez'), decidir('Juan Perez', 'juan  perez'))")
        self.assertTrue(out.endswith("review exact"), out)

    def test_negative_control_score_only_rule_merges_the_reordered_name(self) -> None:
        old = self.block["code"]["code"].split("# Corrección")[0] + (
            "\ns = token_jaccard('Perez Juan', 'Juan Perez')\nprint('exact' if s >= 1.0 else 'review')")
        self.assertTrue(stdout_of(old).endswith("exact"))


class S03DemoAssertsTheContract(unittest.TestCase):
    """S03-IDO-06: the asserts compared two identical copies, so they could not fail."""

    def setUp(self) -> None:
        self.code = demo("s03-decisions-rules.ts", "section03", "S03-T3-B-DEMO")["code"]

    def test_pinned_output(self) -> None:
        self.assertEqual(stdout_of(self.code["code"]), self.code["output"].rstrip("\n"))

    def test_a_wrong_policy_in_both_readings_stops_the_demo(self) -> None:
        broken = self.code["code"].replace('status_a = "accept"', 'status_a = "review"').replace(
            'status_b = "accept"', 'status_b = "review"')
        self.assertNotEqual(broken, self.code["code"])
        done = run(broken)
        self.assertNotEqual(done.returncode, 0, "a policy that never accepts must fail the demo")
        self.assertIn("AssertionError", done.stderr)

    def test_the_two_readings_are_not_copies(self) -> None:
        first = self.code["code"].split('code = "MISSING"')[0]
        reading_a = [line for line in first.splitlines() if "status_a" in line or line.startswith(("if ", "elif "))]
        reading_b = [line.replace("status_b", "status_a") for line in first.splitlines() if "status_b" in line]
        self.assertNotEqual(reading_a[:len(reading_b)], reading_b)
        self.assertIn('if code in {"OUT_OF_RANGE", "BAD_TYPE"}:', first)


class S09CauseChain(unittest.TestCase):
    """S09-THEORY-05: the prose named ValueError as the cause; the output says ParseError."""

    def setUp(self) -> None:
        self.block = theory("s09-exceptions-logging.ts", "section09", "Tipos específicos, raise y chaining")

    def test_pinned_output_names_both_causes(self) -> None:
        out = stdout_of(self.block["code"]["code"])
        self.assertEqual(out, self.block["code"]["output"].rstrip("\n"))
        self.assertIn("cause: ParseError", out)
        self.assertIn("cause of cause: InvalidOperation", out)

    def test_prose_names_the_causes_the_output_prints(self) -> None:
        prose = " ".join(self.block["paragraphs"])
        self.assertNotIn("conserva como causa el `ValueError`", prose)
        self.assertIn("la causa del `RuntimeError` es ese `ParseError`", prose)
        self.assertIn("`InvalidOperation`", prose)


class S09ConfigIsCritical(unittest.TestCase):
    """S09-WEDO-13: the theory and self-check say CRITICAL for a broken config; the exercise said ERROR."""

    def test_exercise_agrees_with_theory_and_self_check(self) -> None:
        ex = exercise("s09-exceptions-logging.ts", "section09", "S09-T3-A-E1")
        self.assertIn("config ilegible al arrancar: CRITICAL", ex["solutionCode"]["output"])
        self.assertEqual(stdout_of(ex["solutionCode"]["code"]), ex["solutionCode"]["output"].rstrip("\n"))
        offered = " ".join([ex["hint"], *ex["hints"], ex["preamble"]])
        self.assertNotIn("o CRITICAL; usa ERROR", offered)
        self.assertNotIn("no uses CRITICAL", offered)
        theory_text = json.dumps(section("s09-exceptions-logging.ts", "section09")["theory"], ensure_ascii=False)
        self.assertRegex(theory_text, r"\*\*CRITICAL\*\* \(el proceso o el lote entero está en peligro: config rota")


class S10ImportRunsNothing(unittest.TestCase):
    """S10-IDO-01: the demo ran main at module level although its title says import has no effects."""

    def setUp(self) -> None:
        self.code = demo("s10-modules-packaging-cli.ts", "section10", "S10-T1-A-DEMO")["code"]

    def run_import(self, source: str) -> subprocess.CompletedProcess[str]:
        with tempfile.TemporaryDirectory(prefix="p10_mod_") as scratch:
            (Path(scratch) / "familiarity_core.py").write_text(source, encoding="utf-8")
            (Path(scratch) / "app.py").write_text("import familiarity_core\nprint('after import')\n", encoding="utf-8")
            return subprocess.run([sys.executable, "-E", "-s", "app.py"], cwd=scratch, capture_output=True, text=True, timeout=60)

    def test_direct_run_keeps_the_pinned_output(self) -> None:
        done = run(self.code["code"])
        self.assertEqual(done.returncode, 0)
        self.assertEqual(done.stdout.rstrip("\n"), self.code["output"].rstrip("\n"))

    def test_import_prints_nothing_and_the_importer_continues(self) -> None:
        done = self.run_import(self.code["code"])
        self.assertEqual(done.stdout, "after import\n")

    def test_negative_control_unguarded_call_runs_on_import(self) -> None:
        old = self.code["code"].split("# solo al ejecutar")[0] + 'raise SystemExit(main(["  José Pérez "]))\n'
        done = self.run_import(old)
        self.assertNotIn("after import", done.stdout)
        self.assertIn("josé pérez", done.stdout)


class S10SemverByKind(unittest.TestCase):
    """S10-WEDO-10: the answer classified by words in the label, the method the theory refutes."""

    def setUp(self) -> None:
        self.ex = exercise("s10-modules-packaging-cli.ts", "section10", "S10-T2-B-E1")

    def test_solution_prints_its_pinned_output_and_quitar_is_major(self) -> None:
        sol = self.ex["solutionCode"]
        out = stdout_of(sol["code"])
        self.assertEqual(out, sol["output"].rstrip("\n"))
        self.assertIn("quitar subcomando compare: major -> 2.0.0", out)
        self.assertNotRegex(sol["code"], r'"(renombrar|eliminar|añadir)" in ')

    def test_negative_control_word_rule_publishes_quitar_as_a_patch(self) -> None:
        d = "quitar subcomando compare"
        old = "renombrar" in d or "eliminar" in d
        self.assertFalse(old, "the old rule never sees a removal written as quitar")

    def test_starter_fails_the_contract(self) -> None:
        self.assertNotEqual(stdout_of(self.ex["starterCode"]["code"]), self.ex["solutionCode"]["output"].rstrip("\n"))


class S10ReasonsAreGiven(unittest.TestCase):
    """S10-WEDO-21: the hint said the reasons are fixed text, but nothing gave them."""

    def test_instruction_states_the_reasons_the_output_needs(self) -> None:
        ex = exercise("s10-modules-packaging-cli.ts", "section10", "S10-T4-A-E3")
        reasons = re.findall(r"razón=(.+)", ex["solutionCode"]["output"])
        self.assertEqual(len(reasons), 2)
        for reason in reasons:
            self.assertIn(f"`{reason}`", ex["instruction"])


class S10TemplateNotIgnored(unittest.TestCase):
    """S10-WEDO-22: the answer put .env.* in .gitignore, which also ignores .env.example."""

    def test_no_printed_pattern_matches_the_template(self) -> None:
        ex = exercise("s10-modules-packaging-cli.ts", "section10", "S10-T4-B-E1")
        out = stdout_of(ex["solutionCode"]["code"])
        self.assertEqual(out, ex["solutionCode"]["output"].rstrip("\n"))
        patterns = [line.split("ignore: ", 1)[1] for line in out.splitlines()]
        self.assertEqual(len(patterns), 4)
        for pattern in patterns:
            self.assertFalse(fnmatch.fnmatch(".env.example", pattern), pattern)

    def test_negative_control_old_pattern_catches_the_template(self) -> None:
        self.assertTrue(fnmatch.fnmatch(".env.example", ".env.*"))


class S12RollbackRevertsTheBatch(unittest.TestCase):
    """S12-IDO-06: the why credited executemany with reverting the batch; rollback() does it."""

    @staticmethod
    def batch(rollback: bool) -> int:
        con = sqlite3.connect(":memory:", isolation_level=None)
        con.execute("CREATE TABLE clients(id TEXT PRIMARY KEY, document_id TEXT UNIQUE)")
        try:
            con.execute("BEGIN")
            con.executemany("INSERT INTO clients VALUES (?,?)", [("C001", "DOC1"), ("C002", "DOC2"), ("C003", "DOC1")])
        except sqlite3.IntegrityError:
            if rollback:
                con.execute("ROLLBACK")
        return con.execute("SELECT COUNT(*) FROM clients").fetchone()[0]

    def test_without_rollback_two_rows_stay(self) -> None:
        self.assertEqual(self.batch(rollback=False), 2)
        self.assertEqual(self.batch(rollback=True), 0)

    def test_why_names_rollback_as_the_reverting_call(self) -> None:
        d = demo("s12-apis-sql-geo.ts", "section12", "S12-T3-B-DEMO")
        self.assertNotIn("hace que el UNIQUE roto revierta", d["why"])
        self.assertIn("`con.rollback()`", d["why"])
        self.assertIn("count da 2", d["why"])
        self.assertEqual(stdout_of(d["code"]["code"]), d["code"]["output"].rstrip("\n"))


class S13ProjectUsesTheTaughtSurnameRule(unittest.TestCase):
    """S13-YOUDO-01: case 3 expected 0.2, which only the starter's second-token rule gives."""

    def setUp(self) -> None:
        self.starter = section("s13-evidence-dashboard.ts", "section13")["youDo"]["starterCode"]
        self.cases = self.starter.split("PAIR_CASES = [", 1)[1].split("\ndef main", 1)[0]

    @staticmethod
    def taught_rel(a: dict, b: dict) -> float:
        phone = bool(a.get("phone")) and a.get("phone") == b.get("phone")
        geo = a.get("km") is not None and a.get("km") == b.get("km") and a["km"] <= 2.0
        ta, tb = set(a["name"].casefold().split()), set(b["name"].casefold().split())
        jac = len(ta & tb) / len(ta | tb) if ta and tb else 0.0
        return 0.5 * phone + 0.3 * geo + 0.2 * jac

    def test_every_case_matches_the_taught_formula(self) -> None:
        cases = ast.literal_eval("[" + self.cases.rstrip())
        self.assertEqual(len(cases), 4)
        for a, b, _er, rel in cases:
            self.assertEqual(self.taught_rel(a, b), rel, (a["name"], b["name"]))

    def test_negative_control_second_token_rule_gives_the_old_value(self) -> None:
        pa, pb = "ana quispe rojas".split(), "ana quispe díaz".split()
        self.assertEqual(0.2 * (pa[1] == pb[1]), 0.2)
        self.assertEqual(self.taught_rel({"name": "Ana Quispe Rojas"}, {"name": "Ana Quispe Díaz"}), 0.1)


if __name__ == "__main__":
    unittest.main()
