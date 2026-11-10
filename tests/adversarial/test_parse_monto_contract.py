"""Every `parse_monto` the course shows keeps the contract S09 teaches.

S09's theory and the S09-T1-A We Do brief say: a comma is a decimal separator only when exactly two
digits follow it and there is no dot, so `1,234` is rejected as ambiguous; and an exception never
repeats the value it received, because exceptions end up in tracebacks and logs. Until batch-1 fix 01
(Nov 2026) the I Do demo, the reference solution and the S10 capstone all did
`Decimal(raw.replace(",", "."))`, which turns `1,234` into `1.23`, and raised `f"...{raw!r}"`.

The test cuts each `parse_monto` out of the section source, runs it after a small preamble that
supplies `Decimal`, `InvalidOperation`, `CENT` and `ParseError`, and checks the contract. The negative control runs the old
parser through the same checks to prove they can fail.
"""

from __future__ import annotations

import re
import textwrap
import unittest
from decimal import Decimal
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = {
    "S09": ROOT / "src/lib/course/sections/s09-exceptions-logging.ts",
    "S10": ROOT / "src/lib/course/sections/s10-modules-packaging-cli.ts",
}
# A function runs from its `def` line to the first line that is not indented. The S10 capstone keeps
# its parser inside a triple-quoted file of a bootstrap script, so code blocks cannot be parsed whole.
FUNCTION = re.compile(r"^(?P<indent>[ \t]*)def parse_monto\(.*?(?=^(?P=indent)\S|\Z)", re.M | re.S)
PREAMBLE = (
    "from decimal import Decimal, InvalidOperation\n"
    "CENT = Decimal('0.01')\n"
    "class ParseError(Exception):\n    pass\n"
)

AMBIGUOUS = ["1,234", "12,5", "1.234,56", "1,2,3"]
NOT_A_NUMBER = ["abc", "NaN", "Infinity", ""]
ACCEPTED = {"10.5": Decimal("10.50"), "3,25": Decimal("3.25"), " 7 ": Decimal("7.00")}

OLD_PARSER = '''
from decimal import Decimal, InvalidOperation
def parse_monto(raw):
    try:
        n = Decimal(str(raw).strip().replace(",", ".")).quantize(Decimal("0.01"))
        if not n.is_finite():
            raise InvalidOperation
    except (InvalidOperation, ValueError):
        raise ValueError(f"monto no numérico: {raw!r}") from None
    if n < Decimal("0"):
        raise ValueError(f"monto negativo no permitido: {n}")
    return n
'''


def parsers() -> list[tuple[str, str]]:
    """(section, runnable module) for every parse_monto shown, except the S09 We Do starter.

    That starter returns `float(raw)` on purpose: it is the defect the learner repairs.
    """
    found = []
    for section, path in SECTIONS.items():
        for match in FUNCTION.finditer(path.read_text(encoding="utf-8")):
            body = textwrap.dedent(match.group(0)).replace("\\\\", "\\")
            if "float(" in body:
                continue
            found.append((section, PREAMBLE + body))
    return found


def contract_violations(module: str) -> list[str]:
    namespace: dict = {}
    exec(compile(module, "<parse_monto>", "exec"), namespace)
    parse = namespace["parse_monto"]
    problems = []
    for raw in AMBIGUOUS + NOT_A_NUMBER:
        try:
            value = parse(raw)
        except Exception as exc:  # the course uses ValueError and ParseError
            if raw and raw.strip() and raw.strip() in str(exc):
                problems.append(f"{raw!r}: message repeats the input ({exc})")
        else:
            problems.append(f"{raw!r} accepted as {value}")
    for raw, expected in ACCEPTED.items():
        try:
            value = parse(raw)
        except Exception as exc:
            problems.append(f"{raw!r} rejected ({exc})")
            continue
        if value != expected:
            problems.append(f"{raw!r} gave {value}, expected {expected}")
    return problems


class ContractCheckCanFail(unittest.TestCase):
    def test_the_old_parser_breaks_the_contract(self) -> None:
        problems = contract_violations(OLD_PARSER)
        self.assertIn("'1,234' accepted as 1.23", problems)
        self.assertTrue(any("repeats the input" in p for p in problems), problems)


class EveryParseMontoKeepsTheContract(unittest.TestCase):
    def test_all_three_copies_are_found(self) -> None:
        # The S09 demo, the S09 We Do solution and the S10 capstone. Fewer means the extractor broke
        # and the next test would pass vacuously.
        found = parsers()
        self.assertGreaterEqual(sum(1 for s, _ in found if s == "S09"), 2)
        self.assertGreaterEqual(sum(1 for s, _ in found if s == "S10"), 1)

    def test_each_copy_keeps_the_contract(self) -> None:
        for section, module in parsers():
            with self.subTest(section=section, head=module.splitlines()[0]):
                self.assertEqual(contract_violations(module), [])


class NoMessageRepeatsTheInput(unittest.TestCase):
    """S09 teaches that an exception never repeats the value it received; no example may contradict it."""

    ECHO = re.compile(r"raise \w+\(f[\"'][^\"']*\{raw[^}]*\}")
    ADVICE = "mensajes que incluyan el raw"

    def test_echo_detector_can_fail(self) -> None:
        self.assertTrue(self.ECHO.search('raise ValueError(f"valor vacío: {raw!r}")'))

    def test_no_section_raises_with_the_input(self) -> None:
        for section, path in SECTIONS.items():
            source = path.read_text(encoding="utf-8")
            with self.subTest(section=section):
                self.assertEqual(self.ECHO.findall(source), [])
                self.assertNotIn(self.ADVICE, source)


if __name__ == "__main__":
    unittest.main()
