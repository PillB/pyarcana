"""Independent Section 2 curriculum and assessment regressions."""

from __future__ import annotations

import sys
from collections import Counter, defaultdict
from pathlib import Path
import re
import subprocess
import unittest


ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

from newbie_packet_builder import active_manifest, parse_section_learner  # noqa: E402
import exam_bank  # noqa: E402


SECTION = ROOT / "src" / "lib" / "course" / "sections" / "s02-basics.ts"
SECTION_VIEW = ROOT / "src" / "components" / "course" / "SectionView.tsx"
PDF_REPORT = ROOT / "src" / "components" / "course" / "PdfReport.tsx"


def _between(text: str, start: str, end: str) -> str:
    start_index = text.index(start)
    end_index = text.index(end, start_index + len(start))
    return text[start_index:end_index]


class TestSection02IndependentContract(unittest.TestCase):
    def test_canonical_identity_and_full_gradual_release_graph(self) -> None:
        source = SECTION.read_text(encoding="utf-8")

        self.assertIn("id: 'basics'", source)
        self.assertIn("index: 2", source)
        self.assertIn("title: 'Valores, tipos, operadores e I/O'", source)
        self.assertIn("shortTitle: 'Valores y tipos'", source)

        subtopics = set(re.findall(r"subtopicId: 'S02-T[1-4]-[AB]'", source))
        demos = set(re.findall(r"demoId: 'S02-T[1-4]-[AB]-DEMO'", source))
        exercises = set(re.findall(r"id: 'S02-T[1-4]-[AB]-E[1-3]'", source))
        topic_evaluations = set(re.findall(r"id: 'S02-T[1-4]-TE'", source))

        self.assertEqual(len(subtopics), 8)
        self.assertEqual(len(demos), 8)
        self.assertEqual(len(exercises), 24)
        self.assertEqual(len(topic_evaluations), 4)

    def test_you_do_uses_only_what_s02_teaches(self) -> None:
        """Route 2 (decisions D9, D10, D14): S02's increment is the raw/clean/value walk.

        This test used to pin `def safe_int(campo: str, valor: str)`, `def parse_client(`,
        `raise NotImplementedError` and `assert r["errors"] == []` - the old You Do, which
        asked for functions, a dict of errors and exception handling that S05, S06 and S09
        teach. That part of CP-N1-A moved to those sections. What S02 still owes the
        project is pinned here instead, together with the absence that route 2 bought.
        """
        you_do = _between(SECTION.read_text(encoding="utf-8"), "  youDo: {", "  selfCheck: {")
        for contract in (
            'assert nombres_raw == "  María José  "',   # the original survives cleaning
            'assert contacto_clean == "0999000111"',    # the leading zero survives
            'assert monto == Decimal("150.50")',        # money is Decimal, built from text
            "# int(edad_invalida_raw)",                 # the failure is shown, not hidden
        ):
            self.assertIn(contract, you_do)
        # Word-bounded: the Spanish around the code says "excepto" and "errores", which a
        # bare substring check for `except` or `error` would mistake for the keywords.
        for later in (r"\bdef ", r"\btry:", r"\bexcept\b", r"\breturn\b", r"\berrors\b"):
            self.assertIsNone(re.search(later, you_do), f"S02's You Do reaches for {later}")

    def test_all_published_python_examples_match_their_output(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        pairs = re.findall(
            r"^\s+code: `([^`]*)`,\n\s+output: `([^`]*)`,",
            source,
            re.MULTILINE,
        )
        # A floor, not an exact count. The number guards against losing a worked
        # example - which happened once, when a rewrite dropped s02_map_contract.py and
        # this caught it at 40. As an exact count it also forbade *adding* one, which
        # contradicts D3/D6: a load-bearing concept needs more examples, not a quota.
        # (Matching each output to its code is the runtime audit's job, not this test's.)
        self.assertGreaterEqual(len(pairs), 41)

        for index, (code, expected_output) in enumerate(pairs):
            with self.subTest(example=index):
                result = subprocess.run(
                    [sys.executable, "-c", code],
                    cwd=ROOT,
                    check=False,
                    capture_output=True,
                    text=True,
                    timeout=10,
                )
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertEqual(result.stdout.rstrip(), expected_output.rstrip())

    def test_playground_executes_the_s02_raw_clean_contract(self) -> None:
        source = SECTION_VIEW.read_text(encoding="utf-8")
        block = _between(source, "    'basics': {", "    'decisions-rules': {")

        self.assertIn("Practica el contrato raw/clean", block)
        self.assertIn('nombres_raw = "  María José  "', block)
        self.assertIn('edad = int(edad_clean)', block)
        self.assertIn('monto = Decimal(monto_clean).quantize(', block)
        self.assertIn('originales intactos:', block)
        self.assertNotIn('def safe_int', block)
        self.assertNotIn("lista comprehension", block.lower())
        self.assertNotIn("Cuadrados", block)

        match = re.search(
            r"code: `(?P<code>.*?)`,\n\s+expectedOutput: `(?P<output>.*?)`,",
            block,
            re.DOTALL,
        )
        self.assertIsNotNone(match)
        assert match is not None
        result = subprocess.run(
            [sys.executable, "-c", match.group("code")],
            cwd=ROOT,
            check=False,
            capture_output=True,
            text=True,
            timeout=10,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stdout.rstrip(), match.group("output").rstrip())

    def test_playground_keeps_s02_prerequisites(self) -> None:
        """The live hands-on example must not require material taught in S03/05/06/09."""
        source = SECTION_VIEW.read_text(encoding="utf-8")
        block = _between(source, "    'basics': {", "    'decisions-rules': {")
        code = re.search(r"code: `(?P<code>.*?)`,\n\s+expectedOutput:", block, re.DOTALL)
        self.assertIsNotNone(code)
        assert code is not None
        for later in (r"\bdef\b", r"\bif\b", r"\breturn\b", r"\bfor\b", r"\btry\b", r"\bexcept\b", r"\{\s*['\"]"):
            self.assertIsNone(re.search(later, code.group("code")), f"Untaught S02 playground construct: {later}")

    def test_dict_is_introduced_as_vocabulary_before_s04_uses_it(self) -> None:
        """First-use metadata must mean the learner actually saw an explanation."""
        source = SECTION.read_text(encoding="utf-8")
        glossary = (ROOT / "src/lib/glossary/terms.ts").read_text(encoding="utf-8")
        dictionary = _between(glossary, "    id: 'dict',", "    id: 'tuple',")
        self.assertIn("firstSectionId: 'basics'", dictionary)
        self.assertIn('un **`dict`** (diccionario) es una colección', source)
        self.assertIn('en S02 aún no necesitas construirlo ni modificarlo', source)

    def test_topic_evaluations_do_not_assess_later_sections(self) -> None:
        topic_evaluations = SECTION.read_text(encoding="utf-8").split("  topicEvaluations: [", 1)[1]
        for future_skill in (
            "safe_int", "make_record", "parse_client", "3 if con ==",
            "Dict encabezado", "parse_monto", "¿InvalidOperation / vacío se manejan?",
        ):
            self.assertNotIn(future_skill, topic_evaluations, f"Assessment requires later skill: {future_skill}")
        self.assertIn('observar `ValueError`', topic_evaluations)

    def test_rounding_figure_matches_business_boundaries(self) -> None:
        theory = SECTION.read_text(encoding="utf-8")
        figure = (ROOT / "src/components/course/figures/data/misc.ts").read_text(encoding="utf-8")
        self.assertNotIn("Redondear una sola vez, al final", theory)
        self.assertNotIn("única vez que se redondea", figure)
        self.assertNotIn("ni siquiera es reproducible", figure)
        self.assertIn("límite de negocio", theory)
        self.assertIn("quantize", figure)

        # An independent numerical oracle: each committed line rounded vs final
        # combined rounding differs, so there is no universal 'one round' rule.
        from decimal import Decimal, ROUND_HALF_EVEN

        rate = Decimal("0.10")
        amount = Decimal("0.05")
        cent = Decimal("0.01")
        tip = (amount * rate).quantize(cent, rounding=ROUND_HALF_EVEN)
        per_business_boundary = amount + tip
        only_at_end = (amount * (1 + rate)).quantize(cent, rounding=ROUND_HALF_EVEN)
        self.assertEqual(per_business_boundary, Decimal("0.05"))
        self.assertEqual(only_at_end, Decimal("0.06"))

    def test_identity_diagram_distinguishes_false_from_numeric_zero(self) -> None:
        diagram = (ROOT / "src/components/course/figures/data/misc.ts").read_text(encoding="utf-8")
        truthiness = _between(diagram, "  'S02-truthiness': {", "  'S12-retry-or-not': {")
        self.assertIn("valor is False", truthiness)
        self.assertLess(truthiness.index("valor is False"), truthiness.index("valor == 0"),
                        "False must be classified before numeric zero (False == 0)")
        self.assertNotIn("Un if desnudo", truthiness)
        # Wrong behavior is plausible: False == 0 but False is not a measured zero.
        self.assertTrue(False == 0)
        self.assertIsNot(False, 0)

    def test_identity_example_is_warning_free(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        example = _between(source, "        id: 'S02-T2-B-E1'", "        id: 'S02-T2-B-E2'")
        solution = re.search(r"solutionCode:\s*\{.*?code: `(?P<code>.*?)`,\n\s*output: `", example, re.DOTALL)
        self.assertIsNotNone(solution)
        assert solution is not None
        result = subprocess.run(
            [sys.executable, "-W", "error", "-c", solution.group("code")],
            cwd=ROOT, capture_output=True, text=True, timeout=10,
        )
        self.assertEqual(result.returncode, 0, result.stderr)
        self.assertEqual(result.stderr, "")

    def test_terminal_input_reads_text_and_distinguishes_blank_from_eof(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        block = _between(source, "heading: 'Prueba de entrada real en tu terminal'", "heading: 'Del texto original al valor interpretado'")
        sample = re.search(r"code: `(?P<code>.*?)`,", block, re.DOTALL)
        self.assertIsNotNone(sample)
        assert sample is not None
        self.assertIn("language: 'bash'", block)
        self.assertIn("python3 -c '", sample.group("code"))
        self.assertIn('input("Edad: ")', sample.group("code"))

        for supplied, raw, cleaned in ((" 34 \n", "' 34 '", "34"), ("   \n", "'   '", "")):
            with self.subTest(supplied=supplied):
                result = subprocess.run(
                    ["bash", "-c", sample.group("code")],
                    input=supplied, capture_output=True, text=True, timeout=10,
                )
                self.assertEqual(result.returncode, 0, result.stderr)
                self.assertIn("tipo: str", result.stdout)
                self.assertIn(f"raw: {raw}", result.stdout)
                self.assertTrue(result.stdout.rstrip().endswith(f"clean: {cleaned!r}"))

        eof = subprocess.run(
            ["bash", "-c", sample.group("code")],
            input="", capture_output=True, text=True, timeout=10,
        )
        self.assertNotEqual(eof.returncode, 0)
        self.assertIn("EOFError", eof.stderr)

    def test_money_scale_oracle_rejects_missing_quantize(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        block = _between(source, "id: 'S02-T3-B-E2'", "id: 'S02-T3-B-E3'")
        match = re.search(r"solutionCode:\s*\{.*?code: `(?P<code>.*?)`,\n\s*output:", block, re.DOTALL)
        self.assertIsNotNone(match)
        assert match is not None
        correct = match.group("code")
        bad = correct.replace(
            '(cuenta * Decimal("0.10")).quantize(\n    Decimal("0.01"), rounding=ROUND_HALF_EVEN\n)',
            'cuenta * Decimal("0.10")',
        ).replace(
            '(cuenta + propina).quantize(\n    Decimal("0.01"), rounding=ROUND_HALF_EVEN\n)',
            'cuenta + propina',
        )
        self.assertNotEqual(correct, bad)
        good_result = subprocess.run([sys.executable, "-c", correct], capture_output=True, text=True, timeout=10)
        bad_result = subprocess.run([sys.executable, "-c", bad], capture_output=True, text=True, timeout=10)
        self.assertEqual(good_result.returncode, 0, good_result.stderr)
        self.assertNotEqual(bad_result.returncode, 0, "Unquantized money must fail the real starter assertions")
        self.assertIn("AssertionError", bad_result.stderr)

    def test_you_do_raw_retention_oracle_rejects_a_corrupted_field(self) -> None:
        section = SECTION.read_text(encoding="utf-8")
        project = _between(section, "  youDo: {", "  selfCheck: {")
        match = re.search(r"starterCode: `(?P<code>.*?)`,\n\s*portfolioNote:", project, re.DOTALL)
        self.assertIsNotNone(match)
        assert match is not None
        completed = match.group("code")
        answers = [
            "nombres_raw.strip()", "apellido_paterno_raw.strip()", "apellido_materno_raw.strip()",
            "contacto_raw.strip()", "direccion_raw.strip()", "edad_raw.strip()", "monto_raw.strip()",
            "int(edad_clean)", 'Decimal("0.01")',
            'f"{nombres_clean} {apellido_materno_clean} | edad {edad} | S/ {monto:.2f}"',
        ]
        self.assertEqual(completed.count("____"), len(answers))
        for answer in answers:
            completed = completed.replace("____", answer, 1)
        correct = subprocess.run([sys.executable, "-c", completed], capture_output=True, text=True, timeout=10)
        self.assertEqual(correct.returncode, 0, correct.stderr)

        # Overwriting a raw name after conversion is the plausible wrong behavior.
        corrupted = completed.replace('assert nombres_raw == "  María José  "',
                                      'edad_raw = edad_clean\nassert nombres_raw == "  María José  "')
        self.assertNotEqual(completed, corrupted)
        rejected = subprocess.run([sys.executable, "-c", corrupted], capture_output=True, text=True, timeout=10)
        self.assertNotEqual(rejected.returncode, 0)
        self.assertIn("AssertionError", rejected.stderr)

    def test_newbie_packet_parser_sees_24_unique_exercise_ids(self) -> None:
        manifest = active_manifest(parse_section_learner(SECTION))
        exercise_ids = manifest["exercise_ids"]

        self.assertEqual(len(exercise_ids), 24)
        self.assertEqual(len(set(exercise_ids)), 24)
        self.assertEqual(
            exercise_ids,
            [
                f"S02-T{topic}-{side}-E{exercise}"
                for topic in range(1, 5)
                for side in ("A", "B")
                for exercise in range(1, 4)
            ],
        )

    def test_pdf_label_matches_the_visible_spanish_identity(self) -> None:
        pdf = PDF_REPORT.read_text(encoding="utf-8")
        self.assertIn("basics: '2. Valores y tipos'", pdf)
        self.assertNotIn("basics: '2. Basics'", pdf)

    def test_authenticated_bank_is_balanced_by_concept_and_attempt(self) -> None:
        entries = [(q["concept"], q["correctIndex"]) for q in exam_bank.bank_for("basics")]

        self.assertEqual(len(entries), 24)
        by_concept: dict[str, list[int]] = defaultdict(list)
        by_attempt: dict[int, list[int]] = defaultdict(list)
        for question_index, (concept, position) in enumerate(entries):
            by_concept[concept].append(position)
            by_attempt[question_index % 3].append(position)

        self.assertEqual(len(by_concept), 8)
        self.assertTrue(all(len(positions) == 3 for positions in by_concept.values()))
        self.assertTrue(
            all(len(set(positions)) == 3 for positions in by_concept.values()),
            "Las variantes de un concepto deben mover la respuesta correcta.",
        )
        self.assertEqual(
            Counter(position for _, position in entries),
            Counter({0: 6, 1: 6, 2: 6, 3: 6}),
        )
        for positions in by_attempt.values():
            self.assertEqual(
                Counter(positions),
                Counter({0: 2, 1: 2, 2: 2, 3: 2}),
            )

    def test_public_self_check_covers_the_complete_section(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        block = _between(source, "  selfCheck: {", "  topicEvaluations: [")
        positions = [
            int(index)
            for index in re.findall(r"correctIndex: ([0-3]),", block)
        ]

        self.assertEqual(len(positions), 11)
        distribution = Counter(positions)
        self.assertLessEqual(max(distribution.values()) - min(distribution.values()), 1)
        for required_contract in (
            "-3**2",
            'Decimal("0.1")',
            "input()",
            "edad_raw",
            "raw conserva los espacios",
        ):
            self.assertIn(required_contract, block)


if __name__ == "__main__":
    unittest.main()
