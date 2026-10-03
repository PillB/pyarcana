#!/usr/bin/env python3
"""Contract guard for the local-first internal QA harness.

This intentionally checks both source semantics and the generated static export.
A server-only feedback implementation can compile successfully while disappearing
from GitHub Pages, which is the exact regression this guard prevents.
"""
from __future__ import annotations

import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
COMPONENT = ROOT / "src/components/course/QAHarness.tsx"
STORE = ROOT / "src/lib/qa-session.ts"
BRIDGE = ROOT / "src/components/course/QAFooterBridge.tsx"
LAYOUT = ROOT / "src/app/layout.tsx"
OUT = ROOT / "out"


def require(text: str, needle: str, where: str) -> None:
    if needle not in text:
        raise AssertionError(f"QA harness contract missing {needle!r} in {where}")


def check_source() -> None:
    component = COMPONENT.read_text(encoding="utf-8")
    store = STORE.read_text(encoding="utf-8")
    bridge = BRIDGE.read_text(encoding="utf-8")
    layout = LAYOUT.read_text(encoding="utf-8")

    # The tester taxonomy must include the pedagogical failure modes requested
    # for internal UAT, not collapse everything into a generic bug bucket.
    for value in (
        "functionality",
        "content",
        "unexplained-term",
        "unanswerable-question",
        "assessment-design",
        "ui-ux",
        "accessibility",
        "compatibility",
    ):
        require(store, f"value: '{value}'", "qa-session.ts")

    # Local-first persistence + portable evidence package.
    require(store, "indexedDB.open", "qa-session.ts")
    require(store, "pyarcana.qa.v1", "qa-session.ts")
    require(store, "screenshotDataUrl", "qa-session.ts")
    require(component, "getDisplayMedia", "QAHarness.tsx")
    require(component, "navigator.share", "QAHarness.tsx")
    require(component, "mailto:", "QAHarness.tsx")
    require(component, 'data-testid="qa-review-dashboard"', "QAHarness.tsx")
    require(component, 'data-testid="qa-location-breadcrumb"', "QAHarness.tsx")

    # Imported QA files are untrusted state. Require a fail-closed structural
    # boundary so malformed nested context/enums cannot reach ContextPreview.
    require(store, "function isQaContext", "qa-session.ts")
    require(store, "QA_CATEGORY_VALUES.has", "qa-session.ts")
    require(store, "QA_CAUSE_VALUES.has", "qa-session.ts")
    require(store, "QA_SEVERITY_VALUES.has", "qa-session.ts")
    require(store, "SAFE_SCREENSHOT_DATA_URL", "qa-session.ts")
    require(store, "MAX_PACKAGE_ISSUES", "qa-session.ts")

    # Failed validation is not permission to destroy older local evidence.
    # Rendering is filtered, but the raw fallback array must be carried forward
    # on ordinary saves/deletes until an explicit migration or clear operation.
    require(store, "function fallbackReadRaw", "qa-session.ts")
    require(store, "return fallbackReadRaw().filter(isQaIssue)", "qa-session.ts")
    require(store, "const records = fallbackReadRaw().filter", "qa-session.ts")
    require(store, "quarantined records survive", "qa-session.ts")

    # A failed fallback write must remain a failure. Silent localStorage quota
    # loss would make the UI clear an unsaved tester report.
    require(store, "QuotaExceededError", "qa-session.ts")
    require(store, "throw new Error('No se pudo guardar la incidencia", "qa-session.ts")
    require(component, "El formulario y la captura se conservaron", "QAHarness.tsx")

    # The harness must be globally mounted below the learner experience and must
    # derive the current course node rather than requiring a server/admin route.
    require(bridge, "[data-section-id]", "QAFooterBridge.tsx")
    require(bridge, "[role=\"tab\"][aria-selected=\"true\"]", "QAFooterBridge.tsx")
    require(layout, "<QAFooterBridge />", "layout.tsx")
    if "/api/feedback" in component or "/api/feedback" in store:
        raise AssertionError("QA harness must not depend on /api/feedback")


def check_static_export() -> None:
    if not OUT.exists():
        raise AssertionError("Static output directory 'out' is required for this guard")

    shipped_text = []
    for path in OUT.rglob("*"):
        if path.is_file() and path.suffix in {".html", ".js", ".css", ".json"}:
            try:
                shipped_text.append(path.read_text(encoding="utf-8", errors="ignore"))
            except OSError:
                pass
    bundle = "\n".join(shipped_text)
    require(bundle, "pyarcana.qa.v1", "static export")
    require(bundle, "qa-harness-open", "static export")
    require(bundle, "QA interna", "static export")


def main() -> int:
    check_source()
    check_static_export()
    print("QA harness static contract: ok")
    return 0


class QAHarnessStaticContract(unittest.TestCase):
    """As a bare script this never ran in CI. The source half runs everywhere now; the export
    half needs a static build, which only CI's static job makes."""

    def test_the_source_keeps_the_contract(self) -> None:
        check_source()

    def test_the_static_export_ships_the_harness(self) -> None:
        if not OUT.exists():
            self.skipTest("out/ is produced by npm run build:static; CI's static job runs this "
                          "file as __main__, where a missing out/ fails")
        check_static_export()


if __name__ == "__main__":
    raise SystemExit(main())
