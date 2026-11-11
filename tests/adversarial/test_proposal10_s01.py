"""Proposal 10 (approved 2026-11-11), S01: the P2 and P3 findings of the item-by-item review.

Each test pins one finding. Where the finding is a claim about git, bash or Ruff, the test runs the
tool and compares its real output with what the lesson prints, so the lesson cannot drift back to
the old claim. Where the finding is a missing explanation, the test reads the learner-visible text
in display order and checks that the explanation sits where the term is first used: a gloss that
arrives two blocks after the first use is the defect, so "the word appears somewhere" would be a
tautology and is not what is checked.

Negative controls run the old answer (the old .gitignore line number, the old pull message, the
starter that triggers I001, the full sys.version) and show it still misbehaves.
"""

from __future__ import annotations

import json
import os
import re
import shutil
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
import {{ section01 }} from {path!r};
console.log(JSON.stringify(section01));
"""
GIT = shutil.which("git")
BASH = shutil.which("bash")
RUFF = shutil.which("ruff")


@lru_cache(maxsize=None)
def s01() -> dict:
    script = DUMP.format(path=str(SECTIONS / "s01-setup.ts"))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S01 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def block(heading: str) -> dict:
    hits = [b for b in s01()["theory"] if b.get("heading") == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one theory block {heading!r}, found {len(hits)}")
    return hits[0]


def exercise(ex_id: str) -> dict:
    hits = [e for e in s01()["weDo"]["steps"] if e.get("id") == ex_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one exercise {ex_id!r}, found {len(hits)}")
    return hits[0]


def demo(demo_id: str) -> dict:
    hits = [d for d in s01()["iDo"]["steps"] if d.get("demoId") == demo_id]
    if len(hits) != 1:
        raise AssertionError(f"expected one demo {demo_id!r}, found {len(hits)}")
    return hits[0]


def code_of(obj) -> str:
    return obj if isinstance(obj, str) else obj["code"]


def visible_strings() -> list[str]:
    """Learner-visible text of S01 in display order: theory, demos, exercises, project, quiz."""
    out: list[str] = []
    for b in s01()["theory"]:
        out.append(b.get("heading", ""))
        out.extend(b.get("paragraphs", []))
        if b.get("code"):
            out.append(b["code"]["code"])
        if b.get("callout"):
            out.extend([b["callout"].get("title", ""), b["callout"]["content"]])
    for d in s01()["iDo"]["steps"]:
        out.extend([d.get("preamble", ""), d["code"]["code"], d.get("why", "")])
    for e in s01()["weDo"]["steps"]:
        out.extend([e.get("preamble", ""), e.get("instruction", ""), e.get("hint", "")])
        out.extend(e.get("hints", []))
        out.append(code_of(e["starterCode"]))
    return out


def first_use(term: str) -> str:
    pattern = re.compile(r"(?<![\w/.-])" + re.escape(term) + r"(?![\w-])")
    for text in visible_strings():
        if pattern.search(text):
            return text
    raise AssertionError(f"{term!r} is never used in S01")


def run(cmd: list[str], cwd: Path, **kw) -> subprocess.CompletedProcess:
    env = dict(os.environ, HOME=str(cwd), GIT_CONFIG_NOSYSTEM="1", LC_ALL="C",
               GIT_AUTHOR_NAME="a", GIT_AUTHOR_EMAIL="a@example.invalid",
               GIT_COMMITTER_NAME="a", GIT_COMMITTER_EMAIL="a@example.invalid")
    return subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, env=env, timeout=60, **kw)


def gitignore_line_for(content: str, path: str) -> subprocess.CompletedProcess:
    with tempfile.TemporaryDirectory() as tmp:
        repo = Path(tmp)
        run(["git", "init", "-q"], repo)
        (repo / ".gitignore").write_text(content)
        for name in (".env", ".env.example"):
            (repo / name).write_text("")
        return run(["git", "check-ignore", "-v", path], repo)


@unittest.skipUnless(GIT, "git is required")
class GitClaims(unittest.TestCase):
    def test_wedo_gitignore_solution_prints_the_line_git_prints(self):
        ex = exercise("S01-T4-B-E1")
        declared = ex["solutionCode"]["output"].splitlines()[-1].split()[0]
        real = gitignore_line_for(ex["solutionCode"]["code"] + "\n", ".env")
        self.assertEqual(real.returncode, 0)
        self.assertEqual(real.stdout.split()[0], declared,
                         "the solution prints a .gitignore line number git does not print")
        # Negative control: the old declared line, 8, is not what git reports for this file.
        self.assertNotEqual(real.stdout.split()[0], ".gitignore:8:.env")

    def test_wedo_gitignore_tests_reject_a_pattern_that_hides_env_example(self):
        ex = exercise("S01-T4-B-E1")
        self.assertIn(".env.example", ex["tests"])
        self.assertRegex(ex["tests"], r"exit 1")
        ok = gitignore_line_for(ex["solutionCode"]["code"] + "\n", ".env.example")
        self.assertEqual(ok.returncode, 1, "the solution .gitignore must not ignore .env.example")
        # Negative control: the shortcut .env* ignores the example, so the new test catches it.
        bad = gitignore_line_for(".env*\n", ".env.example")
        self.assertEqual(bad.returncode, 0)

    def test_theory_check_ignore_line_number_is_explained_and_true(self):
        b = block("Archivos de calidad: ignore, secretos y README")
        code = b["code"]["code"]
        lines = code.split("# En VS Code, crea .gitignore con estas líneas:\n", 1)[1]
        lines = lines.split("\n\n", 1)[0] + "\n"
        real = gitignore_line_for(lines, ".env")
        self.assertEqual(real.stdout.split()[0], b["code"]["output"].split()[0])
        explained = [p for p in b["paragraphs"] if "check-ignore -v" in p]
        self.assertEqual(len(explained), 1, "the check-ignore output has no explanation")
        self.assertIn("la línea 5", explained[0])
        self.assertIn("ruta comprobada", explained[0])

    def test_pull_transcript_shows_the_message_git_prints(self):
        b = block("Contraejemplo: unir un repositorio de GitHub con README a uno local")
        transcript = b["code"]["code"]
        self.assertNotIn("Git se niega", transcript)
        with tempfile.TemporaryDirectory() as tmp:
            base = Path(tmp)
            remote, local = base / "remote", base / "local"
            for repo, name in ((remote, "README.md"), (local, "hello.txt")):
                repo.mkdir()
                run(["git", "init", "-q", "-b", "main"], repo)
                (repo / name).write_text("x\n")
                run(["git", "add", "."], repo)
                run(["git", "commit", "-qm", "init"], repo)
            run(["git", "remote", "add", "origin", str(remote)], local)
            pulled = run(["git", "pull", "origin", "main"], local)
        fatal = [ln for ln in pulled.stderr.splitlines() if ln.startswith("fatal:")]
        self.assertEqual(len(fatal), 1, pulled.stderr)
        self.assertIn(fatal[0], transcript.splitlines())
        self.assertIn("antecesor común", " ".join(b["paragraphs"]))

    def test_show_hunk_header_claim(self):
        ex = exercise("S01-T3-A-E2")
        solution = ex["solutionCode"]["code"]
        self.assertNotIn("conteo pequeño de inserciones", solution)
        self.assertIn("@@ -1,2 +1,3 @@", solution)
        with tempfile.TemporaryDirectory() as tmp:
            repo = Path(tmp)
            run(["git", "init", "-q", "-b", "main"], repo)
            (repo / "README.md").write_text("# demo\nlinea\n")
            run(["git", "add", "."], repo)
            run(["git", "commit", "-qm", "docs: a"], repo)
            (repo / "README.md").write_text("# demo\nlinea\nSetup con venv.\n")
            run(["git", "commit", "-qam", "docs: b"], repo)
            shown = run(["git", "--no-pager", "show", "HEAD"], repo).stdout
        self.assertIn("@@ -1,2 +1,3 @@", shown)
        # The old answer said the header holds an insertion count: the diff header has none.
        header = shown.split("@@", 1)[0]
        self.assertNotRegex(header.split("diff --git", 1)[1], r"insertion")
        self.assertIn("q", ex["instruction"].split("paginador", 1)[1][:40])


@unittest.skipUnless(BASH, "bash is required")
class ShellClaims(unittest.TestCase):
    def test_connectors_block_runs_and_shows_the_overwrite(self):
        b = block("Referencia opcional: conectores de la shell")
        with tempfile.TemporaryDirectory() as tmp:
            done = subprocess.run([BASH, "-c", b["code"]["code"]], cwd=tmp,
                                  capture_output=True, text=True, timeout=60)
        self.assertEqual(done.stdout.rstrip("\n"), b["code"]["output"])
        # The > versus >> counterexample runs: one line after >, two after >>.
        self.assertTrue(done.stdout.startswith("b\na\nb\n"), done.stdout)

    def test_path_counterexample_opens_a_subshell_first(self):
        code = block("Contraejemplo: un cwd equivocado y un PATH roto fallan de formas distintas")["code"]["code"]
        lines = code.splitlines()
        i = lines.index("$ PATH=/carpeta_sin_python")
        self.assertEqual(lines[i - 1], "$ bash", "the PATH is broken in the learner's own shell")

    def test_or_true_is_defined_where_it_is_used(self):
        # The connectors block is optional and starts collapsed, so the counterexample that uses
        # `|| true` must define it itself.
        b = block("Contraejemplo: `|| true` convierte un fallo en éxito")
        self.assertIn("|| true", b["code"]["code"])
        text = " ".join(b["paragraphs"])
        self.assertIn("solo si el de la izquierda falla", text)
        self.assertIn("siempre termina con 0", text)


@unittest.skipUnless(RUFF, "ruff is required for the Ruff transcripts")
class RuffClaims(unittest.TestCase):
    def _check(self, source: str, *args: str) -> subprocess.CompletedProcess:
        tmp = Path(tempfile.mkdtemp())
        self.addCleanup(shutil.rmtree, tmp)
        (tmp / "pyproject.toml").write_text(block("VS Code y Ruff como calidad mínima")["code"]["code"])
        (tmp / "hola_ok.py").write_text(source)
        return subprocess.run([RUFF, "check", "--no-cache", "--output-format", "concise", "hola_ok.py", *args],
                              cwd=tmp, capture_output=True, text=True, timeout=60)

    def test_select_all_counterexample_matches_ruff(self):
        code = block('Contraejemplo: `select = ["ALL"]` en un archivo que ya pasa')["code"]["code"]
        source = code.split("$ cat hola_ok.py\n", 1)[1].split("$ python", 1)[0]
        self.assertEqual(self._check(source).returncode, 0)
        loud = self._check(source, "--select", "ALL")
        self.assertEqual(loud.returncode, 1)
        real = {ln for ln in loud.stdout.splitlines() if ln.startswith("hola_ok.py:")}
        shown = {ln for ln in code.splitlines() if ln.startswith("hola_ok.py:")}
        self.assertTrue(shown, "the transcript shows no findings")
        self.assertTrue(shown <= real, f"transcript lines Ruff does not print: {shown - real}")

    def test_hello_lint_instruction_names_every_code_ruff_reports(self):
        ex = exercise("S01-T4-A-E2")
        done = self._check(code_of(ex["starterCode"]))
        codes = set(re.findall(r":\d+:\d+: ([A-Z]+\d+)", done.stdout))
        self.assertIn("I001", codes, "negative control: the starter still triggers I001")
        for c in codes:
            self.assertIn(c, ex["instruction"] + ex["hint"], f"{c} is reported but never named")
        self.assertIn("I001", ex["instruction"])


class Glosses(unittest.TestCase):
    """A term is explained in the same text where the learner first meets it."""

    CASES = {
        "stdout": "salida normal",
        "stderr": "mensajes de error",
        "site-packages": "pip deja los paquetes",
        "git ls-files": "lista los archivos que Git ya sigue",
        "pyproject.toml": "formato TOML",
        "noqa": "pide a Ruff ignorarla",
        "working tree": "carpeta con tus archivos",
        "git switch -c": "crea una rama nueva",
        "git revert": "crea un commit nuevo",
    }

    def test_first_use_carries_the_gloss(self):
        for term, gloss in self.CASES.items():
            with self.subTest(term=term):
                self.assertIn(gloss, first_use(term))

    def test_sys_prefix_is_glossed_where_the_learner_first_runs_it(self):
        text = [p for p in block("Antes de crear .venv: qué problema resuelve")["paragraphs"]
                if "sys.prefix" in p]
        self.assertIn("carpeta base", text[0])

    def test_split_index_is_explained_in_the_hints(self):
        for ex_id in ("S01-T1-A-E1", "S01-T1-A-E2"):
            ex = exercise(ex_id)
            text = " ".join([ex["hint"], *ex["hints"]])
            with self.subTest(ex=ex_id):
                self.assertIn("corta el texto en los espacios", text)

    def test_f_string_and_variable_are_introduced_before_use(self):
        ex = exercise("S01-T1-A-E2")
        self.assertIn("la `f` delante de las comillas", ex["preamble"])

    def test_pycache_and_secret_shapes(self):
        self.assertIn("se regeneran solos", exercise("S01-T4-B-E1")["hint"])
        hints = " ".join(exercise("S01-T4-B-E2")["hints"])
        self.assertIn("prefijo de muchas claves de API", hints)
        self.assertIn("postgres://usuario:clave@host", hints)


class Consistency(unittest.TestCase):
    def test_hello_env_lives_in_scripts_everywhere(self):
        for text in visible_strings():
            for m in re.finditer(r"(?<![\w/])hello_env\.py", text):
                self.fail(f"hello_env.py outside scripts/: …{text[max(0, m.start() - 40):m.end()]}")

    def test_theory_says_what_to_do_with_an_older_python(self):
        text = block("El intérprete Python y el REPL")["paragraphs"][0]
        self.assertIn("Si ves 3.11 o una versión anterior", text)
        stack = " ".join(block("Componentes del stack que vamos a instalar")["paragraphs"])
        self.assertIn("**Instalar Python 3.12.**", stack)
        self.assertIn("brew install python@3.12", stack)
        # Homebrew's versioned formula links python3.12, not python3 (Codex review on #155).
        self.assertIn("python3.12 -m venv .venv", stack)

    def test_english_labels_are_gone(self):
        joined = "\n".join(visible_strings()).lower()
        for word in ("skimmers", "Venv on:", "Exit code:", "Bloque de referencia", "pinneadas",
                     "si un comando del I Do"):
            with self.subTest(word=word):
                self.assertNotIn(word.lower(), joined)

    def test_windows_paths_are_given(self):
        e3 = exercise("S01-T1-A-E3")
        self.assertIn("Alias de ejecución de aplicaciones", " ".join(e3["hints"]))
        self.assertIn("Windows: usa python en lugar de python3", code_of(exercise("S01-T1-B-E1")["starterCode"]))
        e2 = exercise("S01-T1-B-E2")
        self.assertIn("$LASTEXITCODE no cambia", code_of(e2["starterCode"]))
        self.assertIn("$LASTEXITCODE` conserva el valor anterior", e2["tests"])
        edge = [x for x in exercise("S01-T2-A-E1")["edgeCases"] if "RemoteSigned" in x][0]
        self.assertLess(edge.index("activate.bat"), edge.index("Set-ExecutionPolicy"))
        self.assertIn("cambia solo tu usuario", edge)
        self.assertIn("Activate.ps1", code_of(exercise("S01-T2-B-E2")["starterCode"]))

    def test_or_true_in_exercises_is_justified(self):
        ex = exercise("S01-T2-A-E2")
        for code in (code_of(ex["starterCode"]), code_of(ex["solutionCode"])):
            line = [i for i, ln in enumerate(code.splitlines())
                    if "|| true" in ln and not ln.lstrip().startswith("#")][0]
            above = "\n".join(code.splitlines()[max(0, line - 3):line])
            self.assertIn("ese fallo es esperado", above)

    def test_venv_note_agrees_with_the_debian_callout(self):
        solution = code_of(exercise("S01-T2-A-E3")["solutionCode"])
        self.assertIn("python3-venv", solution)
        self.assertNotIn("no requiere descarga extra", solution)

    def test_checklist_test_is_mechanical(self):
        self.assertIn("comillas invertidas", exercise("S01-T4-B-E3")["tests"])

    def test_identity_and_new_file_in_git_demos(self):
        self.assertIn("git config --local", demo("S01-T3-A-DEMO")["code"]["code"].splitlines()[0])
        self.assertIn("crea scripts/hello_env.py", demo("S01-T3-B-DEMO")["code"]["code"])
        d = demo("S01-T4-B-DEMO")
        self.assertIn("git status --short", d["code"]["code"])

    def test_project_does_not_assert_a_currency(self):
        yd = s01()["youDo"]
        self.assertNotIn("soles", yd["starterCode"])
        self.assertIn("no indica la moneda", yd["starterCode"])
        self.assertTrue(any("privado" in r for r in yd["requirements"]))

    def test_select_all_answer_says_hundreds(self):
        solution = code_of(exercise("S01-T4-A-E3")["solutionCode"])
        self.assertNotIn("decenas de reglas", solution)
        self.assertIn("cientos de reglas", solution)


def key_is_longest(options: list[str], key: int) -> bool:
    return len(options[key]) >= max(len(o) for i, o in enumerate(options) if i != key)


class Quiz(unittest.TestCase):
    def test_selfcheck(self):
        qs = s01()["selfCheck"]["questions"]
        joined = json.dumps(qs, ensure_ascii=False)
        self.assertNotIn("churn", joined)
        commit = qs[2]
        self.assertFalse(key_is_longest(commit["options"], commit["correctIndex"]))
        self.assertIn("ruff.toml", qs[6]["explanation"])
        force = qs[7]["explanation"]
        self.assertNotIn("usa `restore` o `stash`", force)
        self.assertIn("`git restore` los descarta de forma permanente", force)

    def test_exam_bank(self):
        bank = [b for b in exam_bank.load_banks() if b["slug"] == "setup"][0]
        commit = [q for q in bank["questions"] if q["concept"] == "commit-message"]
        self.assertNotIn("churn", json.dumps(commit, ensure_ascii=False))
        for q in commit:
            if q["variant"] in (1, 3):
                with self.subTest(variant=q["variant"]):
                    self.assertFalse(key_is_longest(q["options"], q["correctIndex"]))
        nan = [q for q in commit if "NaN" in q["question"]][0]
        self.assertIn("no es un número", nan["question"])


if __name__ == "__main__":
    unittest.main()
