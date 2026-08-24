#!/usr/bin/env python3
"""Contract guard for the local-first internal QA harness.

This intentionally checks both source semantics and the generated static export.
A server-only feedback implementation can compile successfully while disappearing
from GitHub Pages, which is the exact regression this guard prevents.
"""
from __future__ import annotations

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


def main() -> int:
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

    # The harness must be globally mounted below the learner experience and must
    # derive the current course node rather than requiring a server/admin route.
    require(bridge, "[data-section-id]", "QAFooterBridge.tsx")
    require(bridge, "[role=\"tab\"][aria-selected=\"true\"]", "QAFooterBridge.tsx")
    require(layout, "<QAFooterBridge />", "layout.tsx")
    if "/api/feedback" in component or "/api/feedback" in store:
        raise AssertionError("QA harness must not depend on /api/feedback")

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

    print("QA harness static contract: ok")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
