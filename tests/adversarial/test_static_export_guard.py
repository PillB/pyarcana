from __future__ import annotations

import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[2]


class StaticExportGuardTests(unittest.TestCase):
    def test_build_uses_disposable_copy_and_strict_config(self) -> None:
        script = (ROOT / "scripts/build_static_export.mjs").read_text(encoding="utf-8")
        config = (ROOT / "next.config.ts").read_text(encoding="utf-8")
        workflow = (ROOT / ".github/workflows/deploy.yml").read_text(encoding="utf-8")

        self.assertIn("mkdtempSync", script)
        self.assertIn("rmSync(join(workspace, 'src', 'app', 'api')", script)
        self.assertNotIn("renameSync", script)
        self.assertIn('process.env.NEXT_OUTPUT === "export"', config)
        self.assertNotIn("ignoreBuildErrors", config)
        self.assertIn("bun run build:static", workflow)
        self.assertNotIn("mv src/app/api", workflow)

    def test_static_runtime_hides_server_only_controls(self) -> None:
        page = (ROOT / "src/app/page.tsx").read_text(encoding="utf-8")
        dashboard = (ROOT / "src/components/course/Dashboard.tsx").read_text(encoding="utf-8")
        layout = (ROOT / "src/app/layout.tsx").read_text(encoding="utf-8")

        self.assertIn("!IS_STATIC_SITE && <FeedbackFab", page)
        self.assertIn("!IS_STATIC_SITE && view === 'admin'", page)
        self.assertIn("!IS_STATIC_SITE && view === 'pricing'", page)
        self.assertIn('data-testid="static-site-notice"', dashboard)
        self.assertNotIn("z-cdn.chatglm.cn", layout)
        self.assertIn("/logo.svg", layout)

    def test_internal_qa_harness_is_local_first_and_static_safe(self) -> None:
        component = (ROOT / "src/components/course/QAHarness.tsx").read_text(encoding="utf-8")
        store = (ROOT / "src/lib/qa-session.ts").read_text(encoding="utf-8")
        bridge = (ROOT / "src/components/course/QAFooterBridge.tsx").read_text(encoding="utf-8")
        layout = (ROOT / "src/app/layout.tsx").read_text(encoding="utf-8")

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
            self.assertIn(f"value: '{value}'", store)

        self.assertIn("indexedDB.open", store)
        self.assertIn("pyarcana.qa.v1", store)
        self.assertIn("screenshotDataUrl", store)
        self.assertIn("getDisplayMedia", component)
        self.assertIn("navigator.share", component)
        self.assertIn("mailto:", component)
        self.assertIn('data-testid="qa-review-dashboard"', component)
        self.assertIn('data-testid="qa-location-breadcrumb"', component)
        self.assertIn("[data-section-id]", bridge)
        self.assertIn('[role="tab"][aria-selected="true"]', bridge)
        self.assertIn("<QAFooterBridge />", layout)
        self.assertNotIn("/api/feedback", component)
        self.assertNotIn("/api/feedback", store)

    def test_built_document_obeys_pages_contract_when_present(self) -> None:
        index = ROOT / "out/index.html"
        if not index.exists():
            self.skipTest("out/index.html is produced by npm run build:static")

        document = index.read_text(encoding="utf-8")
        self.assertIn("Edición pública / Public edition", document)
        self.assertIn("/pyarcana/logo.svg", document)
        self.assertNotIn("z-cdn.chatglm.cn", document)
        self.assertNotIn("Crear cuenta gratis", document)
        self.assertNotIn(">Planes<", document)
        self.assertNotIn(">Entrar<", document)
        self.assertNotIn("Panel de Administración", document)

        # The QA harness must survive the static build instead of being hidden
        # with the server-only feedback/admin controls.
        shipped = []
        for path in (ROOT / "out").rglob("*"):
            if path.is_file() and path.suffix in {".html", ".js", ".css", ".json"}:
                shipped.append(path.read_text(encoding="utf-8", errors="ignore"))
        bundle = "\n".join(shipped)
        self.assertIn("pyarcana.qa.v1", bundle)
        self.assertIn("qa-harness-open", bundle)
        self.assertIn("QA interna", bundle)


if __name__ == "__main__":
    unittest.main()
