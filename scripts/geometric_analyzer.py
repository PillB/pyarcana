#!/usr/bin/env python3
"""
Geometric analyzer for the "El Arte de Python" course screenshots.

Loads scripts/screenshots/geometry.json and produces:
  - overlap_report.json: pairs of elements that overlap (intersecting rects)
  - out_of_bounds.json: elements extending beyond viewport
  - below_the_fold.json: critical elements below the fold (y > viewport_h)
  - density_report.json: % of viewport covered by content
  - summary.txt: human-readable summary

Each "frame" in the input is one (section, sub_step, viewport_mode) capture.
"""
from __future__ import annotations

import json
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any

# Project-relative paths (scripts/ is one level under repo root)
_SCRIPT_DIR = Path(__file__).resolve().parent
_REPO_ROOT = _SCRIPT_DIR.parent
_SCREENSHOTS = _SCRIPT_DIR / "screenshots"

GEOMETRY_PATH = _SCREENSHOTS / "geometry.json"
OUT_DIR = _SCREENSHOTS / "analysis"
OUT_DIR.mkdir(parents=True, exist_ok=True)


@dataclass
class Rect:
    x: float
    y: float
    w: float
    h: float

    @property
    def right(self) -> float: return self.x + self.w
    @property
    def bottom(self) -> float: return self.y + self.h

    def intersects(self, other: "Rect", min_overlap: float = 1.0) -> bool:
        ix = max(0, min(self.right, other.right) - max(self.x, other.x))
        iy = max(0, min(self.bottom, other.bottom) - max(self.y, other.y))
        return ix >= min_overlap and iy >= min_overlap

    def intersection_area(self, other: "Rect") -> float:
        ix = max(0, min(self.right, other.right) - max(self.x, other.x))
        iy = max(0, min(self.bottom, other.bottom) - max(self.y, other.y))
        return ix * iy

    def out_of_bounds(self, vw: int, vh: int) -> dict[str, float]:
        """Return dict of overflow distances per side."""
        return {
            "left": max(0, -self.x),
            "top": max(0, -self.y),
            "right": max(0, self.right - vw),
            "bottom": max(0, self.bottom - vh),
        }


def is_text_element(el: dict) -> bool:
    """Heuristic: text-bearing elements we care about for visibility."""
    return el.get("tag") in {"h1", "h2", "h3", "h4", "p", "button", "a", "label", "span"} \
        and bool(el.get("text"))


def is_container(el: dict) -> bool:
    """Container/layout elements we care about for overlap."""
    return el.get("tag") in {"div", "section", "article", "main", "header", "footer", "nav"} \
        or el.get("role") in {"tab", "tablist", "dialog", "region"} \
        or "Card" in (el.get("cls") or "") \
        or "card" in (el.get("cls") or "")


def fingerprint(el: dict) -> str:
    """Short human-readable fingerprint for an element."""
    text = (el.get("text") or "").strip()[:50]
    if text:
        return f"<{el.get('tag')}> \"{text}\""
    return f"<{el.get('tag')} class={el.get('cls','')[:30]}>"


def analyze_frame(frame: dict[str, Any]) -> dict[str, Any]:
    """Analyze a single frame (one section/sub_step/viewport capture)."""
    viewport = frame["viewport"]
    vw, vh = viewport["w"], viewport["h"]
    elements = frame["elements"]

    # Filter to visible elements only
    visible = [e for e in elements if e.get("visible", True)]

    overlaps = []
    out_of_bounds = []

    # 1. Detect overlaps between text-bearing elements (those should never overlap)
    text_els = [e for e in visible if is_text_element(e)]
    for i in range(len(text_els)):
        for j in range(i + 1, len(text_els)):
            a, b = text_els[i], text_els[j]
            ra = Rect(a["x"], a["y"], a["w"], a["h"])
            rb = Rect(b["x"], b["y"], b["w"], b["h"])
            if ra.intersects(rb, min_overlap=2.0):
                area = ra.intersection_area(rb)
                # Skip if one is fully inside the other (parent/child)
                if (ra.x <= rb.x and ra.right >= rb.right and ra.y <= rb.y and ra.bottom >= rb.bottom) \
                   or (rb.x <= ra.x and rb.right >= ra.right and rb.y <= ra.y and rb.bottom >= ra.bottom):
                    continue
                overlaps.append({
                    "a": fingerprint(a),
                    "b": fingerprint(b),
                    "a_rect": asdict(ra),
                    "b_rect": asdict(rb),
                    "overlap_area": round(area, 1),
                })

    # 2. Detect out-of-bounds elements
    for e in visible:
        r = Rect(e["x"], e["y"], e["w"], e["h"])
        oob = r.out_of_bounds(vw, vh)
        if any(v > 2 for v in oob.values()):
            out_of_bounds.append({
                "element": fingerprint(e),
                "rect": asdict(r),
                "overflow": {k: round(v, 1) for k, v in oob.items() if v > 0},
            })

    # 3. Below-the-fold analysis - find critical elements with y > viewport_h
    below_fold = []
    for e in visible:
        r = Rect(e["x"], e["y"], e["w"], e["h"])
        if r.y >= vh:
            # Skip elements that are clearly footer-like
            if e.get("tag") == "footer" or "footer" in (e.get("cls") or "").lower():
                continue
            below_fold.append({
                "element": fingerprint(e),
                "y": round(r.y, 1),
                "viewport_h": vh,
                "below_by": round(r.y - vh, 1),
            })

    # 4. Density: % of viewport covered by visible content (union area)
    # Simple approximation: sum of element areas capped at viewport, then union via grid sampling
    # For performance, use a coarse grid (10px cells)
    grid_w, grid_h = vw // 10, vh // 10
    if grid_w > 0 and grid_h > 0:
        grid = [[False] * grid_w for _ in range(grid_h)]
        for e in visible:
            r = Rect(e["x"], e["y"], e["w"], e["h"])
            x0 = max(0, int(r.x // 10))
            y0 = max(0, int(r.y // 10))
            x1 = min(grid_w, int(r.right // 10) + 1)
            y1 = min(grid_h, int(r.bottom // 10) + 1)
            for yy in range(y0, y1):
                for xx in range(x0, x1):
                    grid[yy][xx] = True
        covered = sum(row.count(True) for row in grid)
        total = grid_w * grid_h
        density_pct = round(100 * covered / total, 1) if total > 0 else 0
    else:
        density_pct = 0

    # 5. Document height vs viewport height (scroll required)
    doc_h = frame["document"]["h"]
    scroll_needed_px = max(0, doc_h - vh)
    scroll_needed_pct = round(100 * scroll_needed_px / vh, 1) if vh > 0 else 0

    return {
        "section_url": frame["url"],
        "sub_step": frame.get("sub_step"),
        "viewport_mode": frame["viewport_mode"],
        "viewport": viewport,
        "document_size": frame["document"],
        "scroll_needed_px": scroll_needed_px,
        "scroll_needed_pct": scroll_needed_pct,
        "density_pct": density_pct,
        "overlaps_count": len(overlaps),
        "overlaps": overlaps[:20],  # cap to keep JSON readable
        "out_of_bounds_count": len(out_of_bounds),
        "out_of_bounds": out_of_bounds[:20],
        "below_fold_count": len(below_fold),
        "below_fold": below_fold[:20],
    }


def main():
    if not GEOMETRY_PATH.exists():
        print(f"ERROR: {GEOMETRY_PATH} not found. Run forensic_screens.py first.", file=sys.stderr)
        sys.exit(1)

    with GEOMETRY_PATH.open() as f:
        frames = json.load(f)

    print(f"[*] Analyzing {len(frames)} frames...")

    analyses = []
    for frame in frames:
        a = analyze_frame(frame)
        analyses.append(a)
        label = f"{frame['url'].split('#')[-1]}/{frame.get('sub_step') or 'default'}/{frame['viewport_mode']}"
        print(f"  {label:55s}  overlaps={a['overlaps_count']:3d}  oob={a['out_of_bounds_count']:3d}  "
              f"below_fold={a['below_fold_count']:3d}  scroll={a['scroll_needed_pct']:5.1f}%  "
              f"density={a['density_pct']:5.1f}%")

    # Write individual reports
    (OUT_DIR / "frame_analysis.json").write_text(json.dumps(analyses, indent=2, ensure_ascii=False))

    # Summary
    total_overlaps = sum(a["overlaps_count"] for a in analyses)
    total_oob = sum(a["out_of_bounds_count"] for a in analyses)
    total_below = sum(a["below_fold_count"] for a in analyses)
    avg_scroll = sum(a["scroll_needed_pct"] for a in analyses) / len(analyses) if analyses else 0
    avg_density = sum(a["density_pct"] for a in analyses) / len(analyses) if analyses else 0

    summary = f"""========================================
GEOMETRIC ANALYSIS SUMMARY — El Arte de Python
========================================

Frames analyzed:        {len(analyses)}
Total overlaps found:   {total_overlaps}
Total out-of-bounds:    {total_oob}
Total below-fold items: {total_below}
Average scroll needed:  {avg_scroll:.1f}% of viewport
Average density:        {avg_density:.1f}% of viewport

Frames with most overlaps:
{chr(10).join(f"  - {a['section_url'].split('#')[-1]}/{a.get('sub_step') or 'default'}/{a['viewport_mode']}: {a['overlaps_count']}" for a in sorted(analyses, key=lambda x: x['overlaps_count'], reverse=True)[:5])}

Frames with most out-of-bounds:
{chr(10).join(f"  - {a['section_url'].split('#')[-1]}/{a.get('sub_step') or 'default'}/{a['viewport_mode']}: {a['out_of_bounds_count']}" for a in sorted(analyses, key=lambda x: x['out_of_bounds_count'], reverse=True)[:5])}

Frames requiring most scroll:
{chr(10).join(f"  - {a['section_url'].split('#')[-1]}/{a.get('sub_step') or 'default'}/{a['viewport_mode']}: {a['scroll_needed_pct']}% ({a['scroll_needed_px']}px)" for a in sorted(analyses, key=lambda x: x['scroll_needed_pct'], reverse=True)[:5])}
"""
    (OUT_DIR / "summary.txt").write_text(summary)
    print(f"\n{summary}")
    print(f"\n[*] Reports written to {OUT_DIR}/")


if __name__ == "__main__":
    main()
