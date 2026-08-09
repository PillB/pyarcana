#!/usr/bin/env python3
"""
Pure geometry layout bounds checker (AABB).

Validates axis-aligned bounding boxes for:
  - pairwise overlap (intersection area / min overlap threshold)
  - overflow outside a viewport rectangle (0,0)–(vw,vh)

Input boxes: list of {id, x, y, w, h} (optional viewport: {w, h}).

Usage:
  python3 scripts/layout_bounds_check.py --self-test
  python3 scripts/layout_bounds_check.py --boxes fixtures.json --viewport 1280,800
  echo '[{"id":"a","x":0,"y":0,"w":10,"h":10}]' | python3 scripts/layout_bounds_check.py --stdin

Exit codes:
  0 — clean (no overlaps, no overflow) or all self-tests passed
  1 — overlaps/overflow found, or self-tests failed
  2 — usage / input error
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass, asdict
from pathlib import Path
from typing import Any, Iterable, Sequence


# ── Core geometry ────────────────────────────────────────────────────────────


@dataclass(frozen=True)
class Box:
    id: str
    x: float
    y: float
    w: float
    h: float

    @property
    def right(self) -> float:
        return self.x + self.w

    @property
    def bottom(self) -> float:
        return self.y + self.h

    def intersection_dims(self, other: "Box") -> tuple[float, float]:
        ix = max(0.0, min(self.right, other.right) - max(self.x, other.x))
        iy = max(0.0, min(self.bottom, other.bottom) - max(self.y, other.y))
        return ix, iy

    def intersects(self, other: "Box", min_overlap: float = 1.0) -> bool:
        ix, iy = self.intersection_dims(other)
        return ix >= min_overlap and iy >= min_overlap

    def intersection_area(self, other: "Box") -> float:
        ix, iy = self.intersection_dims(other)
        return ix * iy

    def overflow(self, vw: float, vh: float) -> dict[str, float]:
        """Overflow distance past each viewport edge (0 if inside)."""
        return {
            "left": max(0.0, -self.x),
            "top": max(0.0, -self.y),
            "right": max(0.0, self.right - vw),
            "bottom": max(0.0, self.bottom - vh),
        }

    def is_out_of_bounds(self, vw: float, vh: float, min_overflow: float = 1.0) -> bool:
        o = self.overflow(vw, vh)
        return any(v >= min_overflow for v in o.values())


def parse_boxes(raw: Sequence[dict[str, Any]]) -> list[Box]:
    boxes: list[Box] = []
    for i, item in enumerate(raw):
        try:
            bid = str(item.get("id", f"box-{i}"))
            boxes.append(
                Box(
                    id=bid,
                    x=float(item["x"]),
                    y=float(item["y"]),
                    w=float(item["w"]),
                    h=float(item["h"]),
                )
            )
        except (KeyError, TypeError, ValueError) as e:
            raise ValueError(f"Invalid box at index {i}: {item!r} ({e})") from e
    return boxes


def find_overlaps(
    boxes: Sequence[Box],
    *,
    min_overlap: float = 1.0,
    skip_containment: bool = False,
) -> list[dict[str, Any]]:
    """Return list of overlap records for every intersecting pair."""
    overlaps: list[dict[str, Any]] = []
    n = len(boxes)
    for i in range(n):
        for j in range(i + 1, n):
            a, b = boxes[i], boxes[j]
            if not a.intersects(b, min_overlap=min_overlap):
                continue
            if skip_containment:
                a_contains_b = (
                    a.x <= b.x
                    and a.right >= b.right
                    and a.y <= b.y
                    and a.bottom >= b.bottom
                )
                b_contains_a = (
                    b.x <= a.x
                    and b.right >= a.right
                    and b.y <= a.y
                    and b.bottom >= a.bottom
                )
                if a_contains_b or b_contains_a:
                    continue
            area = a.intersection_area(b)
            overlaps.append(
                {
                    "a": a.id,
                    "b": b.id,
                    "a_rect": {"x": a.x, "y": a.y, "w": a.w, "h": a.h},
                    "b_rect": {"x": b.x, "y": b.y, "w": b.w, "h": b.h},
                    "overlap_area": round(area, 4),
                }
            )
    return overlaps


def find_overflows(
    boxes: Sequence[Box],
    viewport: dict[str, float],
    *,
    min_overflow: float = 1.0,
) -> list[dict[str, Any]]:
    """Return list of boxes that extend outside the viewport."""
    vw = float(viewport["w"])
    vh = float(viewport["h"])
    out: list[dict[str, Any]] = []
    for box in boxes:
        o = box.overflow(vw, vh)
        if any(v >= min_overflow for v in o.values()):
            out.append(
                {
                    "id": box.id,
                    "rect": {"x": box.x, "y": box.y, "w": box.w, "h": box.h},
                    "overflow": {k: round(v, 4) for k, v in o.items() if v > 0},
                }
            )
    return out


def check_layout(
    boxes: Sequence[dict[str, Any]] | Sequence[Box],
    viewport: dict[str, float] | None = None,
    *,
    min_overlap: float = 1.0,
    min_overflow: float = 1.0,
    skip_containment: bool = False,
) -> dict[str, Any]:
    """
    Validate boxes for AABB overlaps and (optionally) viewport overflow.

    Returns a report dict with overlaps, overflows, counts, and ok flag.
    """
    if boxes and isinstance(boxes[0], Box):
        parsed = list(boxes)  # type: ignore[arg-type]
    else:
        parsed = parse_boxes(boxes)  # type: ignore[arg-type]

    overlaps = find_overlaps(
        parsed, min_overlap=min_overlap, skip_containment=skip_containment
    )
    overflows: list[dict[str, Any]] = []
    if viewport is not None:
        overflows = find_overflows(parsed, viewport, min_overflow=min_overflow)

    return {
        "box_count": len(parsed),
        "viewport": viewport,
        "overlaps_count": len(overlaps),
        "overlaps": overlaps,
        "overflows_count": len(overflows),
        "overflows": overflows,
        "ok": len(overlaps) == 0 and len(overflows) == 0,
    }


# ── Fixtures / self-tests ────────────────────────────────────────────────────


def _fixture_no_overlap() -> tuple[list[dict], dict | None, bool]:
    """Two adjacent (touching edge) boxes — no positive-area overlap."""
    boxes = [
        {"id": "left", "x": 0, "y": 0, "w": 100, "h": 50},
        {"id": "right", "x": 100, "y": 0, "w": 100, "h": 50},  # edge-touch, no overlap
        {"id": "below", "x": 0, "y": 50, "w": 50, "h": 50},
    ]
    viewport = {"w": 1280, "h": 800}
    return boxes, viewport, True  # expect ok


def _fixture_overlap() -> tuple[list[dict], dict | None, bool]:
    """Classic partial overlap of two cards."""
    boxes = [
        {"id": "card-a", "x": 10, "y": 10, "w": 100, "h": 80},
        {"id": "card-b", "x": 50, "y": 40, "w": 100, "h": 80},  # overlaps card-a
    ]
    viewport = {"w": 1280, "h": 800}
    return boxes, viewport, False  # expect not ok (overlap)


def _fixture_overflow() -> tuple[list[dict], dict | None, bool]:
    """Box extends past right edge of viewport."""
    boxes = [
        {"id": "wide", "x": 1200, "y": 0, "w": 200, "h": 40},  # right overflow 120
        {"id": "ok", "x": 0, "y": 0, "w": 100, "h": 40},
    ]
    viewport = {"w": 1280, "h": 800}
    return boxes, viewport, False


def _fixture_negative_overflow() -> tuple[list[dict], dict | None, bool]:
    """Box starts left of viewport (negative x)."""
    boxes = [{"id": "clip", "x": -20, "y": 10, "w": 50, "h": 20}]
    viewport = {"w": 390, "h": 844}
    return boxes, viewport, False


def _fixture_clean_grid() -> tuple[list[dict], dict | None, bool]:
    """Non-overlapping grid tiles fully inside viewport."""
    boxes = []
    for row in range(3):
        for col in range(4):
            boxes.append(
                {
                    "id": f"tile-{row}-{col}",
                    "x": col * 120,
                    "y": row * 80,
                    "w": 100,
                    "h": 60,
                }
            )
    viewport = {"w": 1280, "h": 800}
    return boxes, viewport, True


def run_self_tests() -> int:
    """Run fixture suite. Return 0 if all expectations met, else 1."""
    fixtures: list[tuple[str, Any]] = [
        ("no_overlap_adjacent", _fixture_no_overlap),
        ("partial_overlap", _fixture_overlap),
        ("right_overflow", _fixture_overflow),
        ("left_overflow", _fixture_negative_overflow),
        ("clean_grid", _fixture_clean_grid),
    ]

    failures: list[str] = []
    results: list[dict[str, Any]] = []

    for name, factory in fixtures:
        boxes, viewport, expect_ok = factory()
        report = check_layout(boxes, viewport)
        passed = report["ok"] is expect_ok

        # Extra invariants for named cases
        extra_ok = True
        detail = ""
        if name == "no_overlap_adjacent":
            if report["overlaps_count"] != 0:
                extra_ok = False
                detail = f"expected 0 overlaps, got {report['overlaps_count']}"
        elif name == "partial_overlap":
            if report["overlaps_count"] != 1:
                extra_ok = False
                detail = f"expected 1 overlap, got {report['overlaps_count']}"
            elif report["overlaps"][0]["a"] != "card-a" or report["overlaps"][0]["b"] != "card-b":
                extra_ok = False
                detail = f"unexpected pair: {report['overlaps'][0]}"
            elif report["overlaps"][0]["overlap_area"] != 60 * 50:
                # intersection: x 50-110 (60), y 40-90 (50) => 3000
                extra_ok = False
                detail = f"overlap_area want 3000, got {report['overlaps'][0]['overlap_area']}"
        elif name == "right_overflow":
            if report["overflows_count"] != 1 or report["overflows"][0]["id"] != "wide":
                extra_ok = False
                detail = f"expected overflow on 'wide': {report['overflows']}"
            elif abs(report["overflows"][0]["overflow"].get("right", 0) - 120) > 0.01:
                extra_ok = False
                detail = f"right overflow want 120, got {report['overflows'][0]}"
        elif name == "left_overflow":
            if report["overflows_count"] != 1:
                extra_ok = False
                detail = f"expected 1 overflow: {report['overflows']}"
            elif abs(report["overflows"][0]["overflow"].get("left", 0) - 20) > 0.01:
                extra_ok = False
                detail = f"left overflow want 20, got {report['overflows'][0]}"
        elif name == "clean_grid":
            if report["overlaps_count"] != 0 or report["overflows_count"] != 0:
                extra_ok = False
                detail = "grid should be clean"

        ok = passed and extra_ok
        results.append(
            {
                "name": name,
                "passed": ok,
                "expect_ok": expect_ok,
                "got_ok": report["ok"],
                "overlaps": report["overlaps_count"],
                "overflows": report["overflows_count"],
                "detail": detail or None,
            }
        )
        status = "PASS" if ok else "FAIL"
        print(f"  [{status}] {name}  overlaps={report['overlaps_count']} overflows={report['overflows_count']}")
        if not ok:
            msg = detail if detail else f"expect ok={expect_ok} got ok={report['ok']}"
            failures.append(f"{name}: {msg}")

    # Unit-level pure function checks
    a = Box("a", 0, 0, 10, 10)
    b = Box("b", 5, 5, 10, 10)
    if not a.intersects(b):
        failures.append("Box.intersects should detect partial overlap")
        print("  [FAIL] Box.intersects partial")
    else:
        print("  [PASS] Box.intersects partial")
    if a.intersection_area(b) != 25:
        failures.append(f"intersection_area want 25 got {a.intersection_area(b)}")
        print("  [FAIL] Box.intersection_area")
    else:
        print("  [PASS] Box.intersection_area == 25")
    c = Box("c", 10, 0, 10, 10)  # edge touch
    if c.intersects(a, min_overlap=1.0):
        failures.append("edge-touch should not count as overlap at min_overlap=1")
        print("  [FAIL] edge-touch non-overlap")
    else:
        print("  [PASS] edge-touch non-overlap")

    print()
    if failures:
        print(f"SELF-TEST FAILED ({len(failures)}):")
        for f in failures:
            print(f"  - {f}")
        return 1

    print(f"SELF-TEST PASSED ({len(results) + 3} checks)")
    return 0


# ── CLI ──────────────────────────────────────────────────────────────────────


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="AABB layout bounds / overlap checker")
    parser.add_argument(
        "--self-test",
        action="store_true",
        help="Run built-in fixture suite and exit",
    )
    parser.add_argument(
        "--boxes",
        type=Path,
        help="JSON file: array of {id,x,y,w,h} or {boxes:[...], viewport:{w,h}}",
    )
    parser.add_argument(
        "--stdin",
        action="store_true",
        help="Read boxes JSON from stdin",
    )
    parser.add_argument(
        "--viewport",
        type=str,
        default=None,
        help="Viewport as W,H (e.g. 1280,800)",
    )
    parser.add_argument(
        "--min-overlap",
        type=float,
        default=1.0,
        help="Minimum intersection size on both axes to count as overlap",
    )
    parser.add_argument(
        "--min-overflow",
        type=float,
        default=1.0,
        help="Minimum overflow distance to flag out-of-bounds",
    )
    parser.add_argument(
        "--skip-containment",
        action="store_true",
        help="Ignore pairs where one box fully contains the other",
    )
    parser.add_argument(
        "--json-out",
        type=Path,
        help="Write full report JSON to this path",
    )
    args = parser.parse_args(argv)

    if args.self_test:
        return run_self_tests()

    raw: Any = None
    if args.boxes:
        raw = json.loads(args.boxes.read_text(encoding="utf-8"))
    elif args.stdin:
        raw = json.load(sys.stdin)
    else:
        parser.print_help()
        print("\nError: provide --self-test, --boxes, or --stdin", file=sys.stderr)
        return 2

    viewport: dict[str, float] | None = None
    if isinstance(raw, dict) and "boxes" in raw:
        boxes_raw = raw["boxes"]
        if raw.get("viewport"):
            viewport = {"w": float(raw["viewport"]["w"]), "h": float(raw["viewport"]["h"])}
    elif isinstance(raw, list):
        boxes_raw = raw
    else:
        print("Error: JSON must be a list of boxes or {boxes, viewport}", file=sys.stderr)
        return 2

    if args.viewport:
        parts = args.viewport.split(",")
        if len(parts) != 2:
            print("Error: --viewport must be W,H", file=sys.stderr)
            return 2
        viewport = {"w": float(parts[0]), "h": float(parts[1])}

    try:
        report = check_layout(
            boxes_raw,
            viewport,
            min_overlap=args.min_overlap,
            min_overflow=args.min_overflow,
            skip_containment=args.skip_containment,
        )
    except ValueError as e:
        print(f"Error: {e}", file=sys.stderr)
        return 2

    if args.json_out:
        args.json_out.parent.mkdir(parents=True, exist_ok=True)
        args.json_out.write_text(json.dumps(report, indent=2), encoding="utf-8")

    print(json.dumps(report, indent=2))
    return 0 if report["ok"] else 1


if __name__ == "__main__":
    sys.exit(main())
