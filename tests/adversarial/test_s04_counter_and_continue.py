"""S04 follow-up to proposal 10, found while building the S04 slides.

1. The T3-A counter demo kept only known states (`if s in counts`), so an unexpected state was
   dropped in silence while `n = len(statuses)` still counted it: the counters no longer added up
   to n, the invariant the demo asks the learner to predict. The demo now counts it as
   `desconocido` and prints that the sum equals n.
2. The while counterexamples showed an index that never moves, but not `continue` placed before
   `i += 1`, which repeats the same turn forever on an empty line. A counterexample now runs it.

Mutation tests plant the old code and require the output to change. Negative controls: the
references print their pins, a no-op mutation raises, an irrelevant edit is not caught.
"""

from __future__ import annotations

import json
import subprocess
import sys
import tempfile
import unittest
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SOURCE = ROOT / "src" / "lib" / "course" / "sections" / "s04-iteration-summaries.ts"
DUMP = """
import {{ section04 }} from {path!r};
console.log(JSON.stringify(section04));
"""


@lru_cache(maxsize=None)
def s04() -> dict:
    done = subprocess.run(["node", "--import", "tsx", "--input-type=module", "-e",
                           DUMP.format(path=str(SOURCE))],
                          cwd=ROOT, capture_output=True, text=True, timeout=300)
    if done.returncode != 0:
        raise RuntimeError("could not read S04 through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def demo() -> dict:
    return next(d for d in s04()["iDo"]["steps"] if d["demoId"] == "S04-T3-A-DEMO")


def block() -> dict:
    hits = [b for b in s04()["theory"] if b.get("heading") == "Contraejemplo: continue antes de avanzar el índice"]
    if len(hits) != 1:
        raise AssertionError(f"expected one continue counterexample, found {len(hits)}")
    return hits[0]


def run(source: str) -> str:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "snippet.py"
        path.write_text(source, encoding="utf-8")
        done = subprocess.run([sys.executable, "-I", str(path)], capture_output=True,
                              text=True, timeout=30, encoding="utf-8")
    if done.returncode != 0:
        raise AssertionError(done.stderr[-600:])
    return done.stdout


def caught(code: str, pinned: str, mutated: str) -> bool:
    if mutated == code:
        raise AssertionError("the mutation did not change the code")
    return run(mutated).rstrip("\n") != pinned.rstrip("\n")


DROP_UNKNOWN = ('    else:\n        counts["desconocido"] += 1  # un estado inesperado también se cuenta\n', "")
TYPO = ('"accept", "reject"]', '"accept", "aceptado"]')


class CountersAddUpToN(unittest.TestCase):
    def test_reference_prints_its_pin(self) -> None:
        code = demo()["code"]
        self.assertEqual(run(code["code"]).rstrip("\n"), code["output"].rstrip("\n"))
        self.assertIn("suma igual a n: True", code["output"])

    def test_an_unknown_state_is_counted(self) -> None:
        code = demo()["code"]["code"]
        self.assertEqual(code.count(TYPO[0]), 1)
        out = run(code.replace(*TYPO))
        self.assertIn("'desconocido': 1", out)
        self.assertIn("suma igual a n: True", out)

    def test_dropping_the_unknown_branch_breaks_the_sum(self) -> None:
        """The old demo: with a typo, the counters add up to 4 while n is 5."""
        code = demo()["code"]["code"]
        self.assertEqual(code.count(DROP_UNKNOWN[0]), 1)
        old = code.replace(*TYPO).replace(*DROP_UNKNOWN)
        self.assertIn("suma igual a n: False", run(old))

    def test_text_says_why(self) -> None:
        self.assertIn("se perdería en silencio mientras `n` sí lo cuenta", demo()["preamble"])
        self.assertIn('`"aceptado"`', demo()["retrospective"])


class ContinueBeforeTheIndexMoves(unittest.TestCase):
    def test_reference_prints_its_pin(self) -> None:
        code = block()["code"]
        out = run(code["code"])
        self.assertEqual(out.rstrip("\n"), code["output"].rstrip("\n"))
        self.assertIn("atascado en i = 1 tras 5 vueltas", out)
        self.assertIn("siguiente posición: 3", out)

    def test_moving_the_advance_after_continue_is_caught(self) -> None:
        code = block()["code"]
        fixed = "    linea = lineas[i]\n    i += 1\n    if linea == \"\":\n        continue\n    print(\"procesada:\", linea)\n"
        self.assertEqual(code["code"].count(fixed), 1)
        broken = ("    linea = lineas[i]\n    if linea == \"\":\n        continue\n    print(\"procesada:\", linea)\n"
                  "    i += 1\n")
        # the broken correction would never end, so cap it the way the error half does
        mutated = code["code"].replace(fixed, broken).replace(
            "i = 0\nwhile i < len(lineas):\n", "i = 0\nguard = 0\nwhile i < len(lineas) and guard < 9:\n    guard += 1\n")
        self.assertTrue(caught(code["code"], code["output"], mutated))

    def test_negative_controls(self) -> None:
        code = block()["code"]
        with self.assertRaises(AssertionError):
            caught(code["code"], code["output"], code["code"])
        edited = code["code"].replace("# Corrección:", "# Nota.\n# Corrección:")
        self.assertFalse(caught(code["code"], code["output"], edited))

    def test_block_comes_after_continue_is_taught(self) -> None:
        headings = [b["heading"] for b in s04()["theory"]]
        self.assertLess(headings.index("break, continue y prevención de bucles infinitos"),
                        headings.index("Contraejemplo: continue antes de avanzar el índice"))


if __name__ == "__main__":
    unittest.main()
