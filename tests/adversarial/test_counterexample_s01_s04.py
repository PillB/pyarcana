"""Counterexamples for S01-S04 (proposal 04, owner-approved 2026-11-09).

Each cluster is one theory block, found by its heading (never by index). The Python blocks run
in a fresh interpreter with -I and must print exactly their pinned output. Every block must open
with `# Error` and carry a `# Corrección` half. Each block must also show its distinguishing effect:
in stdout for Python blocks, in the code for shell transcripts, which are only checked for presence
and key lines because no transcript here is pinned.

Negative controls prove the helper fails on a block without `# Corrección` and on a stale pin, so
a green run cannot come from a check that never ran.
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
SECTIONS = ROOT / "src/lib/course/sections"
FILES = [SECTIONS / f for f in (
    "s01-setup.ts", "s02-basics.ts", "s03-decisions-rules.ts", "s04-iteration-summaries.ts")]

NODE_DUMP = """
import {{ section01 }} from {s1!r};
import {{ section02 }} from {s2!r};
import {{ section03 }} from {s3!r};
import {{ section04 }} from {s4!r};
const pick = (s) => s.theory.filter((t) => t.code).map((t) => ({{
  heading: t.heading ?? null, language: t.code.language, code: t.code.code,
  output: t.code.output ?? null, hasSubtopic: 'subtopicId' in t }}));
console.log(JSON.stringify([...pick(section01), ...pick(section02), ...pick(section03), ...pick(section04)]));
"""

# cluster id -> (heading, language, effect). The effect must appear in stdout (python) or in the code (shell).
CLUSTERS = {
    "S01-N1": ("Contraejemplo: un push --force tras un rechazo borra el commit de un colega", "bash", "(forced update)"),
    "S01-N7": ("Contraejemplo: unir un repositorio de GitHub con README a uno local", "bash", "# Git se niega a unir dos historias sin antecesor común."),
    "S01-N2": ("Contraejemplo: git add . sin .gitignore versiona el secreto", "bash", "A  .env"),
    "S01-N6": ("Contraejemplo: mensajes de commit que no dicen qué cambió", "bash", "arreglé algo"),
    "S01-N8": ("Contraejemplo: pip del sistema con PEP 668", "bash", "externally-managed-environment"),
    "S01-N3": ("Contraejemplo: instalar con un pip y ejecutar con otro Python", "bash", "ModuleNotFoundError: No module named 'requests'"),
    "S01-N4": ("Contraejemplo: `|| true` convierte un fallo en éxito", "bash", "|| true"),
    "S01-N5": ("Contraejemplo: un cwd equivocado y un PATH roto fallan de formas distintas", "bash", "command not found"),
    "S02-C1": ("Contraejemplo: eval ejecuta lo que llega en la entrada", "python", "código escrito en la entrada, ejecutado"),
    "S02-C2": ("Contraejemplo: un código postal convertido en número", "python", "como int: 7"),
    "S02-C6": ("Contraejemplo: isinstance acepta True como si fuera un entero", "python", "isinstance(edad, int) → True"),
    "S02-C3": ("Contraejemplo: un Decimal construido desde un float", "python", "precio desde float: 2.67"),
    "S02-C4": ("Contraejemplo: convertir a float solo para mostrar dos decimales", "python", "con float: S/ 2.67"),
    "S02-C5": ("Contraejemplo: reasignar el texto recibido pierde el original", "python", "recibido: '19 años'"),
    "S02-C7": ("Contraejemplo: l y O se leen como 1 y 0", "python", "O = 3"),
    "S03-C1": ("Contraejemplo: if monto: trata el cero como ausencia", "python", "if monto: 0 → review"),
    "S03-C2": ("Contraejemplo: comparar un None antes de preguntar por la ausencia", "python",
               "TypeError: '<' not supported between instances of 'NoneType' and 'int'"),
    "S03-C3": ("Contraejemplo: un solo código para dos fallos distintos", "python", "R-ESTE 30 → INVALIDO"),
    "S03-C4": ("Contraejemplo: el mismo mensaje para dos problemas distintos", "python", "None → Error"),
    "S04-C1": ("Contraejemplo: zip se detiene sin avisar cuando una columna es corta", "python", "filas emparejadas: 3 de 4"),
    "S04-C5": ("Contraejemplo: un índice que no avanza en el while", "python", "terminó por el tope, no por la condición: True"),
    "S04-C3": ("Contraejemplo: borrar de una lista mientras la recorres", "python", "después de borrar en el recorrido: [10, -2, 5]"),
    "S04-C6": ("Contraejemplo: break y continue ante el mismo fallo", "python", "continue en ERROR: ['ok:1', 'ok:2', 'ok:3']"),
    "S04-C8": ("Contraejemplo: un contador que suma montos", "python", "filas: 235 | promedio: 1.0"),
    "S04-C2": ("Contraejemplo: la tasa con el denominador de aceptados", "python", "reject / aceptados: 0.6667"),
    "S04-C7": ("Contraejemplo: buscar sin break devuelve el último caso", "python", "sin break: 2 C3"),
    "S04-C4": ("Contraejemplo: un lote vacío con tasa 0.0", "python", "vacío → 0.0 | sin rechazos → 0.0"),
}
CORRECTION = "# Corrección"


@lru_cache(maxsize=1)
def theory_blocks() -> list:
    script = NODE_DUMP.format(s1=str(FILES[0]), s2=str(FILES[1]), s3=str(FILES[2]), s4=str(FILES[3]))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read the sections through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def find_block(heading: str) -> dict:
    hits = [b for b in theory_blocks() if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected exactly one block for {heading!r}, found {len(hits)}")
    return hits[0]


def run_python(code: str) -> str:
    with tempfile.TemporaryDirectory(prefix="cx_s01_s04_") as scratch:
        script = Path(scratch) / "snippet.py"
        script.write_text(code + "\n", encoding="utf-8")
        done = subprocess.run([sys.executable, "-I", str(script)], cwd=scratch,
                              capture_output=True, text=True, timeout=120)
    if done.returncode != 0:
        raise AssertionError("block raised: " + done.stderr[-400:])
    return done.stdout.rstrip("\n")


def check_block(block: dict, language: str, effect: str) -> list[str]:
    """Return the list of failures for one block. An empty list means the block passes."""
    problems: list[str] = []
    code = block["code"]
    if not code.startswith("# Error"):
        problems.append("first line does not start with '# Error'")
    if CORRECTION not in code:
        problems.append("no '# Corrección' half")
    if language == "python":
        if block["language"] != "python":
            problems.append("language is not python")
            return problems
        stdout = run_python(code)
        if block["output"] is None or stdout != block["output"].rstrip("\n"):
            problems.append(f"stdout {stdout!r} does not equal the pinned output")
        if effect not in stdout and effect not in code:
            problems.append(f"effect {effect!r} missing from stdout")
    else:
        if block["language"] != "bash":
            problems.append("language is not bash")
        if effect not in code:
            problems.append(f"effect {effect!r} missing from the transcript")
    return problems


class CounterexampleClusters(unittest.TestCase):
    def test_every_cluster_block_is_found_once(self):
        for cid, (heading, _lang, _effect) in CLUSTERS.items():
            with self.subTest(cluster=cid):
                find_block(heading)

    def test_every_cluster_passes(self):
        for cid, (heading, lang, effect) in CLUSTERS.items():
            with self.subTest(cluster=cid):
                self.assertEqual(check_block(find_block(heading), lang, effect), [])

    def test_counterexample_blocks_carry_no_subtopic_id(self):
        for cid, (heading, _lang, _effect) in CLUSTERS.items():
            with self.subTest(cluster=cid):
                self.assertFalse(find_block(heading)["hasSubtopic"])

    def test_cluster_count_is_27(self):
        self.assertEqual(len(CLUSTERS), 27)


class NegativeControls(unittest.TestCase):
    """The helper must fail on a block without the correction half and on a stale pin."""

    GOOD = "# Error: x\nprint('a')\n\n# Corrección: y\nprint('b')"

    def test_missing_correction_half_is_reported(self):
        block = {"code": "# Error: x\nprint('a')", "language": "python", "output": "a"}
        problems = check_block(block, "python", "a")
        self.assertIn("no '# Corrección' half", problems)

    def test_stale_pin_is_reported(self):
        block = {"code": self.GOOD, "language": "python", "output": "a\nSTALE"}
        problems = check_block(block, "python", "a")
        self.assertTrue(any("does not equal the pinned output" in p for p in problems), problems)

    def test_correct_block_passes_the_same_helper(self):
        block = {"code": self.GOOD, "language": "python", "output": "a\nb"}
        self.assertEqual(check_block(block, "python", "a"), [])

    def test_missing_effect_is_reported(self):
        block = {"code": self.GOOD, "language": "python", "output": "a\nb"}
        self.assertTrue(check_block(block, "python", "NO EXISTE"))



EXERCISE_DUMP = """
import {{ section01 }} from {s1!r};
import {{ section02 }} from {s2!r};
import {{ section03 }} from {s3!r};
import {{ section04 }} from {s4!r};
const all = [section01, section02, section03, section04].flatMap((s) =>
  (Array.isArray(s.weDo) ? s.weDo : (s.weDo?.exercises ?? s.weDo?.steps ?? [])).map((e) => ({{
    id: e.id ?? null, preamble: e.preamble ?? "",
    solution: typeof e.solutionCode === "string" ? e.solutionCode : (e.solutionCode?.code ?? "") }})));
console.log(JSON.stringify(all));
"""

RAISE_DEMAND = re.compile(r"lanza\s+`?\w*Error`?")


@lru_cache(maxsize=1)
def exercises() -> list:
    script = EXERCISE_DUMP.format(s1=str(FILES[0]), s2=str(FILES[1]), s3=str(FILES[2]), s4=str(FILES[3]))
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e", script],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read the exercises through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def preamble_contradicts_solution(preamble: str, solution: str) -> bool:
    """The preamble tells the learner to raise an error the reference solution never raises."""
    return bool(RAISE_DEMAND.search(preamble)) and "raise" not in solution


class PreambleAgreesWithSolution(unittest.TestCase):
    """Codex review on #148: S04-T1-B-E3 became print-only, but its preamble still said
    "lanza `ValueError`", and SectionView shows the preamble under "Antes de empezar"."""

    def test_the_exercises_are_read(self):
        ids = {e["id"] for e in exercises()}
        self.assertIn("S04-T1-B-E3", ids)
        self.assertGreater(len(ids), 20)

    def test_no_preamble_demands_a_raise_the_solution_does_not_make(self):
        offenders = [e["id"] for e in exercises()
                     if preamble_contradicts_solution(e["preamble"], e["solution"])]
        self.assertEqual(offenders, [])

    def test_detector_flags_the_old_preamble_and_accepts_a_raising_solution(self):
        old = "- **Límites:** lanza `ValueError` si `len(a) != len(b)`."
        self.assertTrue(preamble_contradicts_solution(old, 'print("DESALINEADO")'))
        self.assertFalse(preamble_contradicts_solution(old, 'raise ValueError("x")'))
        self.assertFalse(preamble_contradicts_solution("usa `len` e `if`.", 'print("OK")'))


if __name__ == "__main__":
    unittest.main()
