"""Proposal 06 (owner-approved 2026-11-10): answer the question a student asks at each f-string spot.

A. S09 logs with `%s` from block 11 on, and until now no paragraph said why that is not an f-string.
   The explanation must come before the first block whose code logs with `%s`.
B. S12's SQL counterexample answers "can't I just strip the quote?".
C. S11's dataclass counterexample says how the f-string reaches the repr: through `str(c)`.
"""

from __future__ import annotations

import json
import re
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

DUMP = """
const m = await import('./src/lib/course/sections/{module}.ts');
const s = m.{export};
console.log(JSON.stringify(s.theory.map((t) => ({{
  heading: t.heading, paragraphs: t.paragraphs ?? [], code: t.code?.code ?? '' }}))));
"""

PERCENT_S_LOG = re.compile(r"log\.\w+\(\s*\"[^\"]*%s")
EXPLAINS_PERCENT_S = "cada `%s` marca el hueco donde irá un valor"


def theory(module: str, export: str) -> list[dict]:
    done = subprocess.run(
        ["node", "--import", "tsx", "--input-type=module", "-e", DUMP.format(module=module, export=export)],
        cwd=ROOT, capture_output=True, text=True, timeout=300,
    )
    if done.returncode != 0:
        raise RuntimeError("could not read the section through tsx: " + done.stderr[-800:])
    return json.loads(done.stdout)


def explained_before_used(blocks: list[dict]) -> bool:
    """True when a paragraph explains `%s` in a block before the first code that logs with it."""
    first_use = next((i for i, b in enumerate(blocks) if PERCENT_S_LOG.search(b["code"])), None)
    first_note = next((i for i, b in enumerate(blocks)
                       if any(EXPLAINS_PERCENT_S in p for p in b["paragraphs"])), None)
    return first_use is None or (first_note is not None and first_note < first_use)


def paragraphs_of(blocks: list[dict], heading: str) -> str:
    hits = [b for b in blocks if b["heading"] == heading]
    if len(hits) != 1:
        raise AssertionError(f"expected one block titled {heading!r}, found {len(hits)}")
    return " ".join(hits[0]["paragraphs"])


class StudentQuestionsAreAnswered(unittest.TestCase):
    def test_s09_logs_with_percent_s_and_explains_it_first(self) -> None:
        blocks = theory("s09-exceptions-logging", "section09")
        self.assertTrue(any(PERCENT_S_LOG.search(b["code"]) for b in blocks), "vacuity: S09 logs with %s")
        self.assertTrue(explained_before_used(blocks))
        t3a = paragraphs_of(blocks, "Niveles y estructura de logging")
        self.assertIn("Una f-string, en cambio, arma el texto antes de llamar a `log`", t3a)

    def test_s12_answers_stripping_the_quote(self) -> None:
        text = paragraphs_of(theory("s12-apis-sql-geo", "section12"),
                             "Contraejemplo: un id con SQL devuelve todas las filas")
        self.assertIn("Quitar o duplicar la comilla con `replace` arregla este id y deja abierto el siguiente", text)

    def test_s11_says_how_the_f_string_reaches_the_repr(self) -> None:
        text = paragraphs_of(theory("s11-oop-domain", "section11"),
                             "Contraejemplo: el repr de la dataclass escribe datos personales en el log")
        self.assertIn("pide a `c` su texto con `str(c)`", text)

    def test_negative_control_order(self) -> None:
        use = {"paragraphs": [], "code": 'log.info("id=%s", x)'}
        note = {"paragraphs": [EXPLAINS_PERCENT_S], "code": ""}
        self.assertTrue(explained_before_used([note, use]))
        self.assertFalse(explained_before_used([use, note]))
        self.assertFalse(explained_before_used([use]))


if __name__ == "__main__":
    unittest.main()
