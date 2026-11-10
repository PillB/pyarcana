"""C13 (reval S02-RT-004): S02 topic evaluations use only the tools S02 has taught.

The four named tasks asked for functions (S05), dicts (S06), `if` (S03) and exception handling
(S09). The check reads the whole topicEvaluations block, so a later edit cannot bring one back.
"""

from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s02-basics.ts"

#: Concepts taught after S02, or names that only appear in the old tasks.
LATER_CONCEPTS = {
    "def": r"\bdef\b",
    "if": r"\bif\b",
    "try": r"\btry\b",
    "except": r"\bexcept\b",
    "InvalidOperation": r"InvalidOperation",
    # A dict literal has quoted keys; an f-string field such as {m:.2f} is S02 and is not one.
    "dict literal": r"\{\s*[\"'][^{}\n]*[\"']\s*:",
    "function word": r"\b[Ff]unción\b|\b[Ff]unciones\b|\bsafe_int\b|\bparse_client\b|\bmake_record\b|\bparse_monto\b",
}


def topic_evaluation_text(source: str) -> str:
    start = source.index("  topicEvaluations: [")
    end = source.index("  resources:", start)
    return source[start:end]


def later_concept_hits(text: str) -> dict[str, list[str]]:
    hits = {}
    for name, pattern in LATER_CONCEPTS.items():
        found = re.findall(pattern, text)
        if found:
            hits[name] = found
    return hits


class S02TopicTasksTests(unittest.TestCase):
    def test_topic_evaluations_use_only_s02_tools(self) -> None:
        text = topic_evaluation_text(SECTION.read_text(encoding="utf-8"))
        # Non-vacuity: the block really holds the eight tasks, not an empty slice.
        self.assertEqual(len(re.findall(r"id: 'S02-T[1-4]-TE-[12]'", text)), 8)
        self.assertEqual(later_concept_hits(text), {})

    def test_a_dict_is_only_named_as_deferred_to_s06(self) -> None:
        """The word may appear to say it is not yet used: the glossary term `Dict` lives in S02."""
        text = topic_evaluation_text(SECTION.read_text(encoding="utf-8"))
        mentions = re.findall(r"[^.\n]*\b[Dd]ict\b[^.\n]*", text)
        for sentence in mentions:
            self.assertIn("S06", sentence, "a Dict may only be mentioned as a later concept")
        self.assertEqual(len(mentions), 1)

    def test_the_four_named_tasks_no_longer_ask_for_later_concepts(self) -> None:
        text = topic_evaluation_text(SECTION.read_text(encoding="utf-8"))
        for task_id in ("S02-T1-TE-2", "S02-T2-TE-1", "S02-T2-TE-2", "S02-T4-TE-2"):
            block = text[text.index(f"id: '{task_id}'") :]
            block = block[: block.index("},")]
            self.assertEqual(later_concept_hits(block), {}, task_id)

    def test_negative_control_detector_flags_the_old_task_wording(self) -> None:
        old = (
            "deliverable: 'Función safe_int + 4 casos (OK, \"\", \"abc\", \"  \")'\n"
            "deliverable: 'Dict encabezado→snake_case + 3 if con =='\n"
            "robustness: '¿InvalidOperation / vacío se manejan?'\n"
            "deliverable: '3 asserts (Ñahui raw) + errors' try: except:\n"
            "deliverable: 'Agrupa en un Dict y en la clave diccionario'"
        )
        hits = later_concept_hits(old)
        for concept in ("if", "try", "except", "InvalidOperation", "function word"):
            self.assertIn(concept, hits, concept)

    def test_negative_control_detector_passes_s02_wording(self) -> None:
        clean = (
            "deliverable: 'Cuatro líneas con int(...) sobre \" 19 \" y \"\"; strip() y assert'\n"
            "deliverable: 'nombre_raw y nombre_clean; limpia con strip()'\n"
        )
        self.assertEqual(later_concept_hits(clean), {})


if __name__ == "__main__":
    unittest.main()
