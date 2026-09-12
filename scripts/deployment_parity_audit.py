#!/usr/bin/env python3
"""Answer, automatically, which source the published site is actually serving.

Three sections' audits independently stopped at the same question - "does the
deployed, hydrated page match the source reviewed here?" - and recorded it as
unresolvable. It was never unresolvable. `scripts/build_static_export.mjs` writes
out/deployment.json with the exact git_sha it built from, and GitHub Pages serves
it. Nobody fetched it.

So: fetch it, and say plainly whether the live site is the commit you think it is.

  python3 scripts/deployment_parity_audit.py                # compare against origin/main
  python3 scripts/deployment_parity_audit.py --ref HEAD     # compare against this branch
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "course-state/deployment_parity_report.json"
DEFAULT_URL = "https://pillb.github.io/pyarcana/deployment.json"


def git(*args: str) -> str:
    return subprocess.run(["git", *args], cwd=ROOT, capture_output=True, text=True).stdout.strip()


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--url", default=DEFAULT_URL)
    ap.add_argument("--ref", default="origin/main", help="git ref the live site should match")
    ap.add_argument("--timeout", type=int, default=30)
    args = ap.parse_args()

    try:
        with urllib.request.urlopen(args.url, timeout=args.timeout) as r:
            manifest = json.loads(r.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
        report = {"ok": False, "reason": "manifest_unreachable", "url": args.url, "error": str(e)}
        OUT.write_text(json.dumps(report, indent=2), encoding="utf-8")
        print(json.dumps(report, indent=2))
        return 1

    live = manifest.get("git_sha", "")
    expected = git("rev-parse", args.ref)
    known = git("cat-file", "-t", live) == "commit"
    behind = git("rev-list", "--count", f"{live}..{args.ref}") if known else None
    ahead = git("rev-list", "--count", f"{args.ref}..{live}") if known else None

    in_sync = live == expected
    report = {
        "ok": in_sync,
        "url": args.url,
        "live_git_sha": live,
        "compared_against": args.ref,
        "expected_git_sha": expected,
        "live_commit_known_locally": known,
        "commits_live_is_behind": int(behind) if behind else 0,
        "commits_live_is_ahead": int(ahead) if ahead else 0,
        "live_section_count": manifest.get("section_count"),
        "verdict": (
            "live site is serving the expected commit" if in_sync
            else f"live site is {behind} commit(s) behind {args.ref}" if behind and behind != "0"
            else "live site is serving a different commit"
        ),
    }
    OUT.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0 if in_sync else 1


if __name__ == "__main__":
    raise SystemExit(main())
