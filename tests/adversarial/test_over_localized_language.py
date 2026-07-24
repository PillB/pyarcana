"""Guard against PE slang and extreme city-name stuffing in lesson files."""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
INDEX = ROOT / "src" / "lib" / "course" / "index.ts"

# Colloquial PE slang that confuses LatAm/ES learners outside Peru.
# Word-boundary patterns only — never short fragments like "pe " (scope, pipeline).
BANNED_SLANG = (
    r"\bchamba\b",
    r"\bjato\b",
    r"\bbacán\b",
    r"\bbacan\b",
    r"\bchela\b",
    r"\bfloro\b",
    r"\bhuev[oó]n\b",
    r"\byausa\b",
)

PE_CITIES = re.compile(
    r"\b(Lima|Cusco|Cuzco|Arequipa|Piura|Tacna|Ayacucho|Trujillo|Chiclayo|Iquitos|Huancayo)\b"
)


def active_section_files() -> list[Path]:
    text = INDEX.read_text(encoding="utf-8")
    names = re.findall(r"from ['\"]\./sections/([^'\"]+)['\"]", text)
    return [SECTIONS / f"{n}.ts" for n in names]


class TestOverLocalizedLanguage(unittest.TestCase):
    def test_no_banned_pe_slang(self):
        for path in active_section_files():
            text = path.read_text(encoding="utf-8")
            with self.subTest(file=path.name):
                for slang in BANNED_SLANG:
                    hits = re.findall(slang, text, flags=re.I)
                    self.assertEqual(
                        hits,
                        [],
                        f"{path.name} contains slang pattern {slang!r}: {hits[:3]!r}",
                    )

    def test_city_name_density_is_bounded(self):
        """PE place names are OK for case flavor, not as repetitive filler."""
        for path in active_section_files():
            text = path.read_text(encoding="utf-8")
            # Ignore CASO- lines (fixture ids) for density count of free prose
            prose_lines = [ln for ln in text.splitlines() if "CASO-" not in ln]
            prose = "\n".join(prose_lines)
            count = len(PE_CITIES.findall(prose))
            with self.subTest(file=path.name):
                self.assertLessEqual(
                    count,
                    55,
                    f"{path.name} has {count} PE city tokens in prose (cap 55)",
                )


if __name__ == "__main__":
    unittest.main()
