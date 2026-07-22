"""The language toggle must change meaningful public chrome, not only its flag."""
from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


class TestCoreI18nUsage(unittest.TestCase):
    def test_core_public_surfaces_subscribe_to_language_store(self):
        for relative in (
            "src/app/page.tsx",
            "src/components/course/Dashboard.tsx",
            "src/components/course/SectionView.tsx",
            "src/components/course/LanguageToggle.tsx",
        ):
            text = (ROOT / relative).read_text(encoding="utf-8")
            with self.subTest(file=relative):
                self.assertIn("useI18n", text)
                self.assertRegex(text, r"\bt\(")

    def test_english_landing_copy_tells_truth_about_spanish_lessons(self):
        dashboard = (ROOT / "src/components/course/Dashboard.tsx").read_text(encoding="utf-8")
        self.assertIn("lesson explanations and exercises remain authored in Peruvian Spanish", dashboard)
        self.assertIn("Lessons in Peruvian Spanish", dashboard)

    def test_language_control_has_translated_accessible_name(self):
        toggle = (ROOT / "src/components/course/LanguageToggle.tsx").read_text(encoding="utf-8")
        self.assertIn("aria-label={t('nav.language', lang)}", toggle)


if __name__ == "__main__":
    unittest.main()
