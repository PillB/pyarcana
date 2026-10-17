#!/usr/bin/env python3
"""Disclaimer restoration + page-level substep controller contracts.

These tests lock the PR #27 remediations: restored qualification copy in
all three locales, no empty ``capstones.disclaimer`` (which renders as the
literal key), no blank level card, and the validated section-selection
path that accepts an optional SubStep without touching progress fields.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


def _read(rel: str) -> str:
    return (ROOT / rel).read_text(encoding="utf-8")


class TestDisclaimerRestoration(unittest.TestCase):
    def test_capstones_disclaimer_present_in_all_locales(self):
        i18n = _read("src/lib/i18n.ts")
        matches = re.findall(r"'capstones.disclaimer':\s*'([^']*)'", i18n)
        self.assertEqual(len(matches), 3, matches)
        for value in matches:
            self.assertTrue(value.strip(), "empty capstones.disclaimer falls back to the literal key")
            self.assertNotEqual(value, "capstones.disclaimer")

    def test_t_empty_string_would_surface_key(self):
        i18n = _read("src/lib/i18n.ts")
        self.assertIn("translations[lang]?.[key] || translations['es-PE'][key] || key", i18n)

    def test_dashboard_badge_qualification_restored(self):
        dash = _read("src/components/course/Dashboard.tsx")
        self.assertIn("it is not a professional certification", dash)
        self.assertIn("no es una certificación profesional", dash)

    def test_pdf_certificate_qualification_restored(self):
        """The PDF qualifies itself by what it is, not by denying what it is not.

        PR #27 restored "no una certificación profesional" here. The constancia/certificado
        contract (#75) reversed that: the document names itself, a constancia de progreso until
        52/52 and a certificado de finalización only then, and uses no reserved term, not even
        to deny it. #75 deleted the assertion and left this test reading the file and passing
        for any content (Codex P1 on #75). It now pins the component's half of that contract;
        src/lib/progress-document.test.ts renders the document itself.
        """
        pdf = _read("src/components/course/PdfReport.tsx")
        self.assertNotIn("certificación profesional", pdf.lower(),
                         "a reserved term may not appear even to deny it")
        self.assertRegex(pdf, r"progressDocumentKind\(\s*sectionsCompleted\s*,\s*TOTAL_SECTIONS\s*\)",
                         "the document kind must come from the shared 8-of-52 rule")
        self.assertNotRegex(pdf, r"sectionsCompleted\s*>=\s*\d",
                            "a threshold written into the component drifts from progress-document.ts")

    def test_resources_endorsement_qualification_restored(self):
        resources = _read("src/components/course/ResourcesPage.tsx")
        self.assertIn("no implica respaldo", resources)
        self.assertNotIn("actualizaremos. .", resources)

    def test_capstones_level_card_not_blank(self):
        page = _read("src/components/course/CapstonesPage.tsx")
        self.assertIn("tr('capstones.doesNotEstablish')", page)
        self.assertIn("{level.doesNotEstablish}", page)
        self.assertIn("no constituyen por sí mismos una aprobación", page)

    def test_no_internal_translation_key_rendered_as_copy(self):
        page = _read("src/components/course/CapstonesPage.tsx")
        self.assertNotRegex(page, r">\s*capstones\.[A-Za-z.]+\s*<")


class TestPageLevelSubstepController(unittest.TestCase):
    def test_page_accepts_optional_validated_substep(self):
        page = _read("src/app/page.tsx")
        self.assertIn("function isSubStep", page)
        self.assertIn("function resolveCourseSectionId", page)
        self.assertIn("handleSelectSection = (id: string, subStep?: SubStep)", page)
        self.assertIn("isSubStep(subStep) ? subStep : 'theory'", page)

    def test_s_codes_resolve_through_existing_mapper(self):
        page = _read("src/app/page.tsx")
        self.assertIn("const sMatch = /^S(\\d{2})$/i.exec(id)", page)
        self.assertIn("handleSelectSection(sectionId, subStep)", page)
        self.assertIn("resolveCourseSectionId(rawId)", page)
        self.assertNotRegex(
            page,
            r"setActiveSectionId\(sectionId\)",
            "tour must not assign S01 as an internal section id",
        )

    def test_section_view_is_controlled(self):
        view = _read("src/components/course/SectionView.tsx")
        self.assertIn("activeSubStep?: SubStep", view)
        self.assertIn("onActiveSubStepChange?: (step: SubStep) => void", view)
        self.assertIn("activeSubStep ?? uncontrolledTab", view)
        page = _read("src/app/page.tsx")
        self.assertIn("activeSubStep={activeSubStep}", page)
        self.assertIn("onActiveSubStepChange={setActiveSubStep}", page)

    def test_sidebar_passes_exact_substep(self):
        sidebar = _read("src/components/course/Sidebar.tsx")
        self.assertIn("onSelectSection(section.id, step)", sidebar)
        self.assertIn('data-testid={`sidebar-substep-${step}`}', sidebar)

    def test_progress_schema_untouched(self):
        store = _read("src/lib/progress-store.ts")
        for field in (
            "completedSections",
            "completedSubSteps",
            "quizScores",
            "lastVisited",
            "bookmarks",
            "startDate",
            "isHydratedFromServer",
        ):
            self.assertIn(field, store)
        self.assertIn("python-ds-progress", store)

    def test_tour_associates_substeps_and_guards_callback_identity(self):
        tour = _read("src/components/course/InteractiveTour.tsx")
        self.assertIn("sectionId: 'S01'", tour)
        self.assertIn("subStep: 'ido'", tour)
        self.assertIn("subStep: 'wedo'", tour)
        self.assertIn("subStep: 'youdo'", tour)
        self.assertIn("subStep: 'quiz'", tour)
        self.assertIn("lastNavKey", tour)
        self.assertIn("prefers-reduced-motion", tour)
        self.assertIn("addEventListener('scroll', update, true)", tour)
        self.assertRegex(
            tour,
            r"legal-links[\s\S]{0,400}navigate:\s*'home'",
            "legal-links step must remount Dashboard so the target exists",
        )


if __name__ == "__main__":
    unittest.main()
