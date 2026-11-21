"""Every tracked code file is measured by a complexity gate, or excluded with a reason.

Code that no gate scopes is complexity nothing counts, and nothing says so. This lists every
tracked code file and fails on any that is neither under a gate's scope nor under
GATE_EXCLUSIONS in audit/fixer/complexity_scope.json. It also fails on an exclusion that matches
no tracked file (a stale exclusion hides nothing and should go) or that gives no reason.
"""
from __future__ import annotations

import json
import subprocess
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
SCOPE = json.loads((ROOT / "audit/fixer/complexity_scope.json").read_text(encoding="utf-8"))
CODE_SUFFIXES = (".py", ".ts", ".tsx", ".mjs", ".mts", ".js", ".jsx", ".cjs")


def tracked_code() -> list[str]:
    listing = subprocess.run(["git", "ls-files", "-z"], cwd=ROOT, capture_output=True, check=True)
    return [p for p in listing.stdout.decode("utf-8").split("\0") if p.endswith(CODE_SUFFIXES)]


def in_scope(path: str) -> bool:
    py = SCOPE["python"]
    if any(path.startswith(f"{r}/") and path.endswith(tuple(py["suffixes"])) for r in py["roots"]):
        return True
    return any(path.startswith(f"{t['root']}/") and path.endswith(tuple(t["suffixes"]))
               for t in SCOPE["typescript"])


def exclusion_for(path: str) -> dict | None:
    for entry in SCOPE["GATE_EXCLUSIONS"]:
        target = entry["path"]
        if path == target or (target.endswith("/") and path.startswith(target)):
            return entry
    return None


class ScopeInventory(unittest.TestCase):
    def test_every_tracked_code_file_is_in_a_gate_scope_or_excluded(self):
        uncovered = [p for p in tracked_code() if not in_scope(p) and exclusion_for(p) is None]
        self.assertEqual(uncovered, [], "add the file's directory to a gate scope, or exclude it "
                                        "in audit/fixer/complexity_scope.json with a reason")

    def test_every_exclusion_gives_a_reason(self):
        bare = [e["path"] for e in SCOPE["GATE_EXCLUSIONS"] if len(e.get("reason", "").strip()) < 20]
        self.assertEqual(bare, [])

    def test_every_exclusion_matches_a_tracked_file(self):
        code = tracked_code()
        stale = [e["path"] for e in SCOPE["GATE_EXCLUSIONS"]
                 if not any(p == e["path"] or (e["path"].endswith("/") and p.startswith(e["path"]))
                            for p in code)]
        self.assertEqual(stale, [], "an exclusion that matches nothing hides nothing; remove it")

    def test_every_scope_root_exists(self):
        roots = SCOPE["python"]["roots"] + [t["root"] for t in SCOPE["typescript"]]
        missing = [r for r in roots if not (ROOT / r).is_dir()]
        self.assertEqual(missing, [])


if __name__ == "__main__":
    unittest.main()
