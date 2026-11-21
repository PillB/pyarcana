#!/usr/bin/env python3
"""Render industry_alignment/badge_requirements/*.md from the live badge catalog.

The fourth copy of each badge's requirements (after the live catalog, the industry catalog and the
claim contracts) was a 2026-07-28 snapshot from build_badge_architecture.py's own data, which had
drifted from the live catalog. Owner decision O17 approved regenerating it from the live catalog.

The renderer is the generator's own requirement_markdown(), applied to the live badges. The
generator's `main()` is not run: it rewrites the industry catalog from its hard-coded data, which is
the drift this file exists to stop. The "Generated" line is pinned to the live catalog's
generated_at, so a re-render of an unchanged catalog is byte-identical.

  python3 industry_alignment/_phase6_build/regenerate_requirements.py          # write the copies
  python3 industry_alignment/_phase6_build/regenerate_requirements.py --check  # read-only; exit 1 on drift
"""
from __future__ import annotations

import argparse
import importlib
import json
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
LIVE = ROOT / "src/lib/eligibility/badge_catalog.json"
COPY_DIR = ROOT / "industry_alignment/badge_requirements"


def generator():
    sys.path.insert(0, str(HERE))
    return importlib.import_module("build_badge_architecture")


def render_all(catalog: dict) -> dict[str, str]:
    """File name to markdown, one entry per live badge."""
    gen = generator()
    gen.NOW = catalog["generated_at"]
    return {f"{badge['badge_id']}.md": gen.requirement_markdown(badge) for badge in catalog["badges"]}


def drift(rendered: dict[str, str], directory: Path) -> list[str]:
    """Every way the copy differs from the render: a changed, missing or stray file."""
    present = {p.name for p in directory.glob("*.md")}
    problems = [f"{name}: missing" for name in sorted(set(rendered) - present)]
    problems += [f"{name}: not a live badge" for name in sorted(present - set(rendered))]
    for name in sorted(set(rendered) & present):
        if (directory / name).read_text(encoding="utf-8") != rendered[name]:
            problems.append(f"{name}: differs from the live catalog")
    return problems


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Regenerate the badge requirements copy from the live catalog.")
    parser.add_argument("--check", action="store_true", help="read-only: report drift and exit 1 if any")
    args = parser.parse_args(argv)
    rendered = render_all(json.loads(LIVE.read_text(encoding="utf-8")))
    if args.check:
        problems = drift(rendered, COPY_DIR)
        for line in problems:
            print(line)
        return 1 if problems else 0
    COPY_DIR.mkdir(parents=True, exist_ok=True)
    for name, text in rendered.items():
        (COPY_DIR / name).write_text(text, encoding="utf-8")
    print(f"wrote {len(rendered)} files to {COPY_DIR.relative_to(ROOT)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
