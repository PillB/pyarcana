"""S11 describes what Python really does with `emails: list = []` in a dataclass.

Two S11 We Do exercises (S11-T1-A-E1 ClientRecord, S11-T3-A-E2 CaseFile) start from a dataclass
with a list default. Until batch-1 fix 01 (Nov 2026) the text said the starter makes instances
share one list ("CF2 ve lo de CF1"). It cannot: `@dataclass` raises ValueError while defining the
class, so the learner met a crash the text never mentioned.

The runtime test pins the behaviour the text now describes; the prose test fails if the false
claim returns.
"""

from __future__ import annotations

import re
import sys
import types
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTION = ROOT / "src/lib/course/sections/s11-oop-domain.ts"

FALSE_CLAIMS = [
    "es el defecto (lista compartida)",
    "El starter comparte la lista",
    "default=[] sería mutable compartido",
    "default=[] comparte la misma lista entre instancias",
]


def exercise_block(source: str, exercise_id: str) -> str:
    start = source.index(f'id: "{exercise_id}"')
    following = re.search(r'\n      \{\n        id: "S11-', source[start + 1:])
    end = start + 1 + following.start() if following else len(source)
    return source[start:end]


def starter_code(block: str) -> str:
    match = re.search(r"starterCode:\s*\{.*?code:\s*`([^`]*)`", block, re.S)
    assert match, "starter not found"
    return match.group(1)


class S11MutableDefault(unittest.TestCase):
    def test_both_starters_fail_at_class_definition(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        for exercise_id in ("S11-T1-A-E1", "S11-T3-A-E2"):
            with self.subTest(exercise=exercise_id):
                code = starter_code(exercise_block(source, exercise_id))
                # dataclasses looks the defining module up in sys.modules.
                module = types.ModuleType(f"s11_starter_{exercise_id.replace('-', '_')}")
                sys.modules[module.__name__] = module
                try:
                    with self.assertRaisesRegex(ValueError, "mutable default .* use default_factory"):
                        exec(compile(code, exercise_id, "exec"), module.__dict__)
                finally:
                    del sys.modules[module.__name__]

    def test_the_text_no_longer_claims_the_list_is_shared(self) -> None:
        source = SECTION.read_text(encoding="utf-8")
        present = [claim for claim in FALSE_CLAIMS if claim in source]
        self.assertEqual(present, [])

    def test_the_text_names_the_error_the_learner_sees(self) -> None:
        block = exercise_block(SECTION.read_text(encoding="utf-8"), "S11-T1-A-E1")
        self.assertIn("ValueError: mutable default", block)


if __name__ == "__main__":
    unittest.main()
