"""One bad patch should cost one patch, not the round.

S39 offered 48 patches, one of them embedding an unescaped quote that stopped the file parsing,
and lost all 48 - twice. `find_bad_patches` bisects after a typecheck failure to isolate the
culprits and keep the rest. Anchors are independent and each matches exactly once, so a subset
can be tested on its own.

This exercises the bisection directly with a fake typechecker, because reproducing it against a
live codex batch means waiting for a model to make the same mistake again.
"""
from __future__ import annotations

import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools" / "fixer"))

import apply_patches  # noqa: E402


class FindBadPatchesTests(unittest.TestCase):
    def setUp(self) -> None:
        self.target = Path("/tmp/pyarcana-salvage-probe.ts")
        self.original = "".join(f"const v{i} = 'ok{i}';\n" for i in range(12))
        self.originals = {self.target: self.original}
        self._real_typechecks = apply_patches.typechecks
        # "Parses" unless the poison string is on disk - stands in for the esbuild failure.
        apply_patches.typechecks = lambda: (
            "POISON" not in self.target.read_text(encoding="utf-8"), "fake"
        )

    def tearDown(self) -> None:
        apply_patches.typechecks = self._real_typechecks
        self.target.unlink(missing_ok=True)

    def _landed(self, poison_at):
        out = []
        for i in range(12):
            repl = f"const v{i} = 'POISON';\n" if i in poison_at else f"const v{i} = 'new{i}';\n"
            out.append(({"anchor": f"const v{i} = 'ok{i}';\n", "replacement": repl,
                         "finding_ids": [f"F{i}"], "field_path": f"f{i}"}, self.target))
        return out

    def test_isolates_a_single_bad_patch_and_keeps_the_rest(self) -> None:
        landed = self._landed({7})
        bad = apply_patches.find_bad_patches(landed, self.originals)
        self.assertEqual([p["field_path"] for p, _ in bad], ["f7"])

        keep = [x for x in landed if not any(x[0] is c[0] for c in bad)]
        self.assertEqual(len(keep), 11, "the eleven good patches must survive")
        apply_patches.write_subset(keep, self.originals)
        self.assertTrue(apply_patches.typechecks()[0], "the salvaged set must parse")
        text = self.target.read_text(encoding="utf-8")
        self.assertIn("new0", text)
        self.assertIn("ok7", text, "the rejected patch's field keeps its original text")

    def test_isolates_several_bad_patches(self) -> None:
        bad = apply_patches.find_bad_patches(self._landed({0, 5, 11}), self.originals)
        self.assertEqual(sorted(p["field_path"] for p, _ in bad), ["f0", "f11", "f5"])

    def test_a_clean_batch_finds_nothing(self) -> None:
        self.assertEqual(apply_patches.find_bad_patches(self._landed(set()), self.originals), [])

    def test_a_single_patch_batch_is_reported_when_it_is_the_culprit(self) -> None:
        landed = self._landed({3})[3:4]
        self.assertEqual([p["field_path"] for p, _ in apply_patches.find_bad_patches(landed, self.originals)],
                         ["f3"])


if __name__ == "__main__":
    unittest.main()
