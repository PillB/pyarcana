"""The key must not be the one option that differs from the other three by a surface feature.

A test-wise learner picks the option that stands apart without knowing the content: the only option
with code formatting, or the only one with or without an absolute such as «siempre», «nunca» or
«todos» (learners know absolutes are usually false). Haladyna, Downing & Rodriguez (2002) list both
under clues to the right answer: specific determiners, and a conspicuous correct choice.

Found while the S12 and S13 banks were written (plan PR 9): review rounds 1 to 4 found keys that were
the only option with code, fixed one at a time; apis-sql-geo q17 was the last, in round 4. Round 5
raised the same question about an absolute. A class that recurs gets a guard, not another hand fix.

Measured on 2026-10-14 over the 52 banks: 51 questions in 28 banks, none in S12 or S13. This is a
ratchet held per bank and exactly: a bank may not gain one, and a repaired one must be written down.
A count over the course alone would let a repair in one bank pay for a new cue in another.
"""
from __future__ import annotations

import re
import sys
import unicodedata
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "scripts"))

import exam_bank  # noqa: E402

#: Absolutes, matched on lowercased text with accents removed, so «ningún» and «jamás» count.
ABSOLUTE = re.compile(
    r"\b(siempre|nunca|jamas|todos?|todas?|ningun[oa]?|nada|solo|unicamente|exclusivamente"
    r"|completamente|totalmente)\b"
)
#: A code span, as the banks write one.
CODE = re.compile(r"`[^`]+`")
FEATURES = {"code": CODE, "an absolute": ABSOLUTE}

#: Questions whose key is the odd one out, per bank, measured 2026-10-14. Lower a bank's count as its
#: questions are repaired; delete the entry at zero.
KEY_ODD_FEATURE_OWED = {
    "advanced-models": 1, "ai-apis-advanced": 1, "async-concurrency": 3, "collections": 1,
    "data-engineering": 2, "databases-orm": 1, "decisions-rules": 1, "exceptions-logging": 2,
    "fastapi": 2, "files-ingestion": 3, "functions-contracts": 3, "gpu-computing": 1,
    "integrator-phase1": 1, "integrator-phase2": 1, "iteration-summaries": 4, "llmops": 2,
    "microservices": 1, "modules-packaging-cli": 3, "packaging": 1, "performance-extreme": 1,
    "rapidfuzz-entity": 1, "security-infra": 2, "setup": 6, "stdlib-deep": 1,
    "streamlit-dashboards": 1, "system-design": 1, "tech-leadership": 1, "text-unicode-regex": 3,
}


def fold(text: str) -> str:
    """Lowercase and strip accents."""
    return "".join(c for c in unicodedata.normalize("NFKD", text.lower()) if not unicodedata.combining(c))


def odd_features(question: dict) -> list[str]:
    """The features that set the key apart: present in the key alone, or missing from the key alone."""
    key = question["correctIndex"]
    found = []
    for name, pattern in FEATURES.items():
        has = [bool(pattern.search(fold(option))) for option in question["options"]]
        if has[key] and sum(has) == 1:
            found.append(f"only the key has {name}")
        elif not has[key] and sum(has) == len(has) - 1:
            found.append(f"only the key lacks {name}")
    return found


def odd_by_bank(banks: list[dict]) -> dict[str, int]:
    """{slug: questions with an odd key}, for the banks that have any."""
    counts = {b["slug"]: sum(bool(odd_features(q)) for q in b["questions"]) for b in banks}
    return {slug: n for slug, n in counts.items() if n}


#: apis-sql-geo q17 as round 4 found it: the key alone was formatted as code.
Q17_BEFORE = {"correctIndex": 3, "options": [
    "Guardar cada documento en minúsculas para que SQLite compare menos caracteres durante cada búsqueda",
    "Copiar el documento en una segunda tabla y buscar allí sin declarar una estructura de acceso adicional",
    "Ordenar los clientes al insertar y confiar en que el orden físico permita localizar después cada documento",
    "Crear `idx_document_id` sobre `clients(document_id)` y conservar la consulta parametrizada por documento",
]}
#: The same question after the repair: a distractor carries code too.
Q17_AFTER = {"correctIndex": 3, "options": Q17_BEFORE["options"][:2] + [
    "Ordenar `clients` al insertar y confiar en que el orden físico permita localizar después cada `document_id`",
    Q17_BEFORE["options"][3],
]}
#: evidence-dashboard q6: the key says «todos» and a distractor says «ningún»; both are absolutes.
Q6 = {"correctIndex": 2, "options": [
    "La regla no marcó ningún par distinto como igual entre los casos aceptados de ese conjunto etiquetado",
    "El recall puede ser menor que 1.0 porque algunos pares realmente iguales quedaron sin encontrar en el conjunto",
    "La regla encontró todos los pares verdaderos, porque una precisión perfecta elimina la necesidad de revisar omisiones",
    "Los pares de puntaje intermedio de la regla pueden mantenerse en una cola humana aunque la precisión reportada sea alta",
]}
#: setup q1: every distractor carries an absolute and the key carries none.
SETUP_Q1 = {"correctIndex": 1, "options": [
    "El REPL compila a binario; el script solo interpreta texto",
    "El REPL es una sesión interactiva línea a línea; el script ejecuta un archivo de principio a fin y termina",
    "Solo el REPL puede importar la librería estándar",
    "Solo los scripts pueden usar `print`",
]}


class KeyOddFeature(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.banks = exam_bank.load_banks()
        cls.by_bank = odd_by_bank(cls.banks)

    def test_the_detector_reads_its_worked_examples(self):
        self.assertEqual(odd_features(Q17_BEFORE), ["only the key has code"])
        self.assertEqual(odd_features(Q17_AFTER), [])
        self.assertEqual(odd_features(Q6), [], "«ningún» is an absolute too; the key is not alone")
        self.assertEqual(odd_features(SETUP_Q1), ["only the key lacks an absolute"])
        self.assertEqual(odd_features({"correctIndex": 0, "options": ["Jamás falla", "a", "b", "c"]}),
                         ["only the key has an absolute"])

    def test_no_bank_gains_an_odd_key(self):
        grown = {slug: (n, KEY_ODD_FEATURE_OWED.get(slug, 0)) for slug, n in self.by_bank.items()
                 if n > KEY_ODD_FEATURE_OWED.get(slug, 0)}
        detail = [
            f"{b['slug']} q{i}: {', '.join(odd_features(q))}: {q['options'][q['correctIndex']][:80]}"
            for b in self.banks if b["slug"] in grown
            for i, q in enumerate(b["questions"]) if odd_features(q)
        ]
        self.assertEqual(grown, {}, "a key stands apart from its distractors (count, owed):\n"
                         + "\n".join(detail))

    def test_repairs_are_kept(self):
        self.assertEqual(self.by_bank, KEY_ODD_FEATURE_OWED,
                         "a bank repaired an odd key: lower its count in KEY_ODD_FEATURE_OWED")


if __name__ == "__main__":
    unittest.main()
