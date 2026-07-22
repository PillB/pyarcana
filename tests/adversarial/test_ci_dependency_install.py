from pathlib import Path
import unittest


ROOT = Path(__file__).resolve().parents[2]


class CiDependencyInstallContractTests(unittest.TestCase):
    def test_package_manager_is_pinned(self) -> None:
        package_json = (ROOT / "package.json").read_text(encoding="utf-8")
        self.assertIn('"packageManager": "bun@1.3.4"', package_json)

    def test_all_workflows_pin_bun_and_use_retry_wrapper(self) -> None:
        for relative_path in (
            ".github/workflows/tests.yml",
            ".github/workflows/deploy.yml",
        ):
            workflow = (ROOT / relative_path).read_text(encoding="utf-8")
            setup_count = workflow.count("uses: oven-sh/setup-bun@v2")
            self.assertGreater(setup_count, 0)
            self.assertEqual(setup_count, workflow.count("bun-version: '1.3.4'"))
            self.assertNotIn("run: bun install --frozen-lockfile", workflow)
            self.assertEqual(
                setup_count,
                workflow.count("run: bash scripts/ci_bun_install.sh"),
            )

    def test_retry_wrapper_keeps_frozen_lockfile_and_clears_cache(self) -> None:
        wrapper = (ROOT / "scripts/ci_bun_install.sh").read_text(encoding="utf-8")
        self.assertIn("bun install --frozen-lockfile", wrapper)
        self.assertIn("readonly max_attempts=3", wrapper)
        self.assertIn("bun pm cache rm", wrapper)


if __name__ == "__main__":
    unittest.main()
