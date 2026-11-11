"""Proposal 07 (approved 2026-11-10): the remaining batch-1 lesson fixes.

Each test pins one learner-visible claim and, where the claim is about Python, recomputes it,
so a later edit that brings the contradiction back fails here instead of in class.
"""

from __future__ import annotations

from decimal import ROUND_HALF_EVEN, Decimal
from pathlib import Path
import re
import unittest

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
FIGURES_MISC = ROOT / "src" / "components" / "course" / "figures" / "data" / "misc.ts"

BATCH1 = [
    "s01-setup.ts",
    "s02-basics.ts",
    "s03-decisions-rules.ts",
    "s04-iteration-summaries.ts",
    "s05-functions-contracts.ts",
    "s06-collections.ts",
    "s07-text-unicode-regex.ts",
    "s08-files-ingestion.ts",
    "s09-exceptions-logging.ts",
    "s10-modules-packaging-cli.ts",
    "s11-oop-domain.ts",
    "s12-apis-sql-geo.ts",
    "s13-evidence-dashboard.ts",
]


def _read(name: str) -> str:
    return (SECTIONS / name).read_text(encoding="utf-8")


def _figure_entry(source: str, figure_id: str) -> str:
    start = source.index(f"'{figure_id}': {{")
    end = source.index("\n  },", start)
    return source[start:end]


def _cents(value: Decimal) -> Decimal:
    return value.quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)


class RoundingFigureFollowsTheCode(unittest.TestCase):
    """Item 1: S02 rounds the IGV and then the total; the figure used to say 'once, at the end'."""

    def setUp(self) -> None:
        self.figure = _figure_entry(FIGURES_MISC.read_text(encoding="utf-8"), "S02-decimal-rounding")
        self.s02 = _read("s02-basics.ts")

    def test_no_text_says_round_only_once_at_the_end(self) -> None:
        for text in (self.figure, self.s02):
            self.assertNotIn("una sola vez, al final", text)
            self.assertNotIn("única vez que se redondea", text)
        self.assertNotIn("sigue exacto", self.figure)

    def test_the_code_still_rounds_the_igv_before_the_total(self) -> None:
        # If the code ever moves to a single final rounding, the figure is the one to change.
        self.assertIn('igv = (subtotal * Decimal("0.18")).quantize(', self.s02)
        self.assertIn('total = (subtotal + igv).quantize(', self.s02)

    def test_the_note_numbers_are_what_decimal_computes(self) -> None:
        note = re.search(r"note: '([^']*)'", self.figure).group(1)
        sub, once, a, b, printed = re.findall(r"\d+\.\d\d", note)
        subtotal = Decimal(sub)
        igv = _cents(subtotal * Decimal("0.18"))
        self.assertEqual((Decimal(a), Decimal(b)), (subtotal, igv))
        self.assertEqual(Decimal(printed), subtotal + igv)
        self.assertEqual(Decimal(once), _cents(subtotal * Decimal("1.18")))
        self.assertNotEqual(Decimal(once), Decimal(printed), "the example must show the lines not adding up")


class StripQuestionIsAnswered(unittest.TestCase):
    """Item 14: '`int(" 19 ")` funciona' raised 'then why strip?'; the answer must stay true."""

    def test_the_answer_is_in_the_block_and_is_true(self) -> None:
        s02 = _read("s02-basics.ts")
        self.assertIn("porque `int` tolera espacios en los bordes", s02)
        self.assertIn('`" 19 " == "19"` no los tolera y da `False`', s02)
        self.assertEqual(int(" 19 "), 19)
        self.assertFalse(" 19 " == "19")
        self.assertTrue(" 19 ".strip() == "19")

    def test_the_value_error_stop_is_explained_once_in_paragraph_four(self) -> None:
        self.assertNotIn("En S09 aprenderás qué clase de error es y cómo continuar", _read("s02-basics.ts"))


class S01LearnerText(unittest.TestCase):
    def setUp(self) -> None:
        self.s01 = _read("s01-setup.ts")

    def test_sys_exit_is_introduced_not_recalled(self) -> None:
        self.assertNotIn("Ya viste `sys.exit`", self.s01)
        intro = self.s01.index("Un programa de Python puede terminar con `sys.exit(código)`")
        first_code_use = self.s01.index('python3 -c "import sys; print(\'ok\'); sys.exit(0)"')
        self.assertLess(intro, first_code_use)

    def test_no_garbled_hash_clause(self) -> None:
        self.assertNotIn("(o un hash)", self.s01)
        self.assertIn("Después de `git add`, aparece en `git diff --staged`.", self.s01)

    def test_outputs_hold_output_not_instructions(self) -> None:
        for m in re.finditer(r"output:\s*([`'\"])(.*?)(?<!\\)\1", self.s01, re.S):
            for line in m.group(2).split("\n"):
                self.assertFalse(line.lstrip().startswith("#"), f"comment inside an output panel: {line!r}")
                if "All checks passed!" in line:
                    self.assertEqual(line.strip(), "All checks passed!")

    def test_push_output_shows_where_the_pr_starts(self) -> None:
        self.assertIn("remote: Create a pull request for 'feat/hello-env' on GitHub by visiting:", self.s01)

    def test_day_one_questions_are_answered(self) -> None:
        for sentence in (
            "Si ninguna forma responde, todavía no tienes Python",
            "los tuyos pueden ser otros, y basta con que cada comando responda con una versión",
            "escribe solo lo que sigue a `# >>> ` en cada línea, porque el REPL ya muestra su propio `>>>`",
            # Proposal 10 (S01-YOUDO-01) replaced the soles claim: a US and a Brazilian client
            # cannot all pay in soles, so the dictionary now says the file carries no currency.
            "Monto mensual sintetico; el archivo no indica la moneda",
        ):
            self.assertIn(sentence, self.s01)
        self.assertNotIn("copy-paste reales", self.s01)


class DocumentIdsAreOpaque(unittest.TestCase):
    """Rule D2. The two-sided allowlist: S01 names DNI once to say why it is not used,
    and S03 keeps document-type codes ("DNI", "RUC") in an allowlist exercise."""

    ALLOWED = {"s01-setup.ts": 1, "s03-decisions-rules.ts": 9}

    def test_dni_appears_only_where_allowed(self) -> None:
        for name in BATCH1:
            with self.subTest(section=name):
                self.assertEqual(_read(name).count("DNI"), self.ALLOWED.get(name, 0))

    def test_s01_names_dni_only_to_explain_the_rule(self) -> None:
        self.assertIn("un DNI inventado puede coincidir con el de una persona real", _read("s01-setup.ts"))

    def test_s11_says_who_the_full_record_is_for(self) -> None:
        s11 = _read("s11-oop-domain.ts")
        self.assertIn("'document_id': 'DOC-0001'", s11)
        # Proposal 08 (S11 row 28) split this sentence, so the clause now starts with a capital.
        self.assertIn("Un export para un tablero o una línea de log usa otro diccionario", s11)


class ProseMatchesCode(unittest.TestCase):
    def test_s09_quotes_the_message_the_code_raises(self) -> None:
        s09 = _read("s09-exceptions-logging.ts")
        self.assertNotIn("campo requerido inválido", s09)
        self.assertIn('lanza `ValueError(\\"valor vacío o N/A\\")`', s09)
        self.assertIn('raise ValueError("valor vacío o N/A")', s09)

    def test_s11_e2_starter_comment_names_the_effect_it_reaches(self) -> None:
        s11 = _read("s11-oop-domain.ts")
        start = s11.index('id: "S11-T3-A-E2"')
        starter = s11[s11.index("starterCode", start):s11.index("solutionCode", start)]
        self.assertNotIn("CF2 hereda", starter)
        self.assertIn("ValueError", starter)
        self.assertIn("evidences: list = []", starter)

    def test_s03_any_has_its_reason(self) -> None:
        from unittest.mock import ANY

        self.assertIn("`ANY` existe para las pruebas", _read("s03-decisions-rules.ts"))
        self.assertTrue(ANY == None)  # noqa: E711 - the counterexample's claim
        self.assertFalse(ANY is None)


if __name__ == "__main__":
    unittest.main()
