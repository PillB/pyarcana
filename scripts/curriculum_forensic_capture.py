#!/usr/bin/env python3
"""Immutable rendered-product forensics for one curriculum section.

Captures every learning tab at desktop and narrow viewports as lossless,
bounded, overlapping PNG tiles with contiguous full-document coverage, and
records the DOM geometry, accessibility and console evidence that pixels alone
cannot prove.

Each invocation writes a new immutable capture directory. An interrupted or
failed capture keeps its own directory and is never completed in place.

Usage:
    python3 scripts/curriculum_forensic_capture.py \
        --campaign CAMP-... --pass 1 --phase before --section setup \
        --base-url http://localhost:3000 --source-sha <sha>
"""
from __future__ import annotations

import argparse
import hashlib
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

from playwright.sync_api import (
    ConsoleMessage,
    Error as PlaywrightError,
    TimeoutError as PlaywrightTimeout,
    sync_playwright,
)

ROOT = Path(__file__).resolve().parents[1]
QA_ROOT = ROOT / "course-state/curriculum-agent/qa"
TABS = ("theory", "ido", "wedo", "youdo", "quiz")
VIEWPORTS = {"desktop": (1440, 1000), "mobile": (390, 844)}
TILE_HEIGHT = 1600
TILE_OVERLAP = 120
MAX_TILES = 140
# A tile whose pixels are almost all one colour is a rendering failure, not a page.
MIN_DISTINCT_BYTES = 24


def _sha_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def _tile_is_blank(path: Path) -> bool:
    sample = path.read_bytes()
    return len(set(sample[-4096:])) < MIN_DISTINCT_BYTES


GEOMETRY_PROBE = """
() => {
  const doc = document.documentElement;
  const viewportWidth = window.innerWidth;
  const overflow = [];
  const smallTargets = [];
  const unnamedControls = [];
  const seen = new Set();
  for (const el of document.querySelectorAll('body *')) {
    const style = window.getComputedStyle(el);
    if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') continue;
    const box = el.getBoundingClientRect();
    if (box.width === 0 && box.height === 0) continue;
    const right = box.left + box.width;
    // Wide code and tables legitimately scroll inside their own container. Only
    // content that widens the page itself is a layout defect.
    let scrollableAncestor = false;
    for (let node = el.parentElement; node && node !== document.body; node = node.parentElement) {
      const os = window.getComputedStyle(node).overflowX;
      if (os === 'auto' || os === 'scroll') { scrollableAncestor = true; break; }
    }
    if (!scrollableAncestor && (right - viewportWidth > 1 || box.left < -1)) {
      const key = el.tagName + '|' + (el.className || '') + '|' + Math.round(box.left);
      if (!seen.has(key)) {
        seen.add(key);
        overflow.push({
          tag: el.tagName, cls: String(el.className || '').slice(0, 80),
          left: Math.round(box.left), right: Math.round(right),
          width: Math.round(box.width), text: (el.textContent || '').trim().slice(0, 60),
        });
      }
    }
    const interactive = el.matches('button, a[href], input, select, textarea, [role="button"], [role="tab"], [tabindex]:not([tabindex="-1"])');
    if (interactive) {
      if (box.width > 0 && box.height > 0 && (box.width < 24 || box.height < 24)) {
        smallTargets.push({
          tag: el.tagName, cls: String(el.className || '').slice(0, 60),
          width: Math.round(box.width), height: Math.round(box.height),
          text: (el.textContent || '').trim().slice(0, 40),
        });
      }
      const name = (el.getAttribute('aria-label') || el.getAttribute('title')
        || (el.textContent || '').trim() || el.getAttribute('alt') || '').trim();
      if (!name) {
        unnamedControls.push({
          tag: el.tagName, cls: String(el.className || '').slice(0, 60),
          testid: el.getAttribute('data-testid') || null,
        });
      }
    }
  }
  const images = [...document.querySelectorAll('img')].map((img) => ({
    src: (img.getAttribute('src') || '').slice(0, 160),
    alt: img.getAttribute('alt'),
    complete: img.complete,
    naturalWidth: img.naturalWidth,
  }));
  const fixed = [...document.querySelectorAll('body *')].filter((el) => {
    const s = window.getComputedStyle(el);
    return s.position === 'fixed' && s.display !== 'none' && s.visibility !== 'hidden';
  }).map((el) => {
    const b = el.getBoundingClientRect();
    return {
      tag: el.tagName, cls: String(el.className || '').slice(0, 60),
      top: Math.round(b.top), left: Math.round(b.left),
      width: Math.round(b.width), height: Math.round(b.height),
      testid: el.getAttribute('data-testid') || null,
    };
  });
  const root = document.querySelector('[data-testid="section-root"]');
  return {
    scrollWidth: doc.scrollWidth,
    scrollHeight: doc.scrollHeight,
    clientWidth: doc.clientWidth,
    viewportWidth,
    horizontalOverflow: doc.scrollWidth - doc.clientWidth,
    overflowingElements: overflow.slice(0, 40),
    smallTouchTargets: smallTargets.slice(0, 40),
    controlsWithoutAccessibleName: unnamedControls.slice(0, 40),
    images,
    fixedElements: fixed.slice(0, 20),
    sectionRootText: root ? (root.textContent || '').trim().length : 0,
    headings: [...document.querySelectorAll('h1,h2,h3')].slice(0, 40)
      .map((h) => ({ level: h.tagName, text: (h.textContent || '').trim().slice(0, 120) })),
  };
}
"""

# A learner must never see an answer key before revealing it.
LEAK_PROBE = """
() => {
  const body = document.body.innerText || '';
  const markers = ['correctIndex', 'correct_index', 'answerKey', 'answer_key'];
  const hits = markers.filter((m) => body.includes(m));
  const revealed = [...document.querySelectorAll('[data-testid^="exercise-feedback-"], [data-testid="sc-result"]')]
    .filter((el) => (el.textContent || '').trim().length > 0)
    .map((el) => ({ testid: el.getAttribute('data-testid'), text: (el.textContent || '').trim().slice(0, 120) }));
  return { visibleAnswerMarkers: hits, revealedFeedbackBeforeAttempt: revealed };
}
"""


def capture_state(page, out_dir: Path, label: str) -> dict:
    """Tile the full document for one tab/viewport state.

    Playwright clips relative to the viewport, so the page is scrolled and each
    viewport is captured in turn. Consecutive tiles overlap, and the recorded
    scroll positions prove the tiles cover the document without gaps.
    """
    page.wait_for_timeout(450)
    # An open dialog locks body scrolling, so the capturable surface is the
    # viewport even when scrollHeight still reports the page behind it.
    measure = """() => {
      const doc = document.documentElement;
      const modal = !!document.querySelector('[data-slot="dialog-overlay"]');
      const locked = modal || getComputedStyle(document.body).overflow === 'hidden';
      return {
        height: locked ? window.innerHeight : doc.scrollHeight,
        width: doc.scrollWidth,
        viewport: window.innerHeight,
        locked,
      };
    }"""
    metrics = page.evaluate(measure)
    viewport_height = int(metrics["viewport"])
    total_height = int(metrics["height"])
    step = max(viewport_height - TILE_OVERLAP, 200)

    tiles, top, index = [], 0, 0
    capture_error = None
    while index < MAX_TILES:
        metrics = page.evaluate(measure)
        total_height = int(metrics["height"])
        top = min(top, max(total_height - viewport_height, 0))
        page.evaluate(f"() => window.scrollTo(0, {top})")
        page.wait_for_timeout(180)
        actual_top = int(page.evaluate("() => Math.round(window.scrollY)"))
        index += 1
        tile_path = out_dir / f"{label}-tile-{index:02d}.png"
        try:
            page.screenshot(path=str(tile_path), type="png")
        except PlaywrightError as error:
            capture_error = f"tile {index} at y={actual_top}: {error}"
            tile_path.unlink(missing_ok=True)
            index -= 1
            break
        tiles.append({
            "file": tile_path.name, "index": index,
            "y_start": actual_top, "y_end": actual_top + viewport_height,
            "height": viewport_height,
            "sha256": _sha_file(tile_path), "bytes": tile_path.stat().st_size,
            "blank": _tile_is_blank(tile_path),
        })
        if actual_top + viewport_height >= total_height:
            break
        top = actual_top + step

    page.evaluate("() => window.scrollTo(0, 0)")
    coverage_gap = None
    for previous, current in zip(tiles, tiles[1:]):
        if current["y_start"] > previous["y_end"]:
            coverage_gap = {
                "after_tile": previous["index"],
                "gap_from": previous["y_end"], "gap_to": current["y_start"],
            }
            break
    return {
        "label": label,
        "document_height": total_height,
        "viewport_height": viewport_height,
        "tile_count": len(tiles),
        "tiles": tiles,
        "coverage_complete": bool(tiles) and tiles[0]["y_start"] == 0
        and tiles[-1]["y_end"] >= total_height and coverage_gap is None,
        "coverage_gap": coverage_gap,
        "truncated_at_max_tiles": index >= MAX_TILES and tiles and tiles[-1]["y_end"] < total_height,
        "blank_tiles": [tile["index"] for tile in tiles if tile["blank"]],
        "scroll_locked": bool(metrics.get("locked")),
        "capture_error": capture_error,
    }


def run(args) -> int:
    capture_root = QA_ROOT / f"pass_{args.outer_pass:02d}" / args.section / args.phase / args.source_sha[:8]
    capture_root.mkdir(parents=True, exist_ok=True)
    existing = sorted(p.name for p in capture_root.glob("capture_*"))
    capture_id = f"capture_{len(existing) + 1:03d}"
    out_dir = capture_root / capture_id
    out_dir.mkdir()

    console_events: list[dict] = []
    page_errors: list[str] = []
    failed_requests: list[dict] = []
    states: list[dict] = []
    started_at = datetime.now(timezone.utc).isoformat()
    status = "FAILED"

    try:
        with sync_playwright() as playwright:
            browser = playwright.chromium.launch()
            try:
                for viewport_name, (width, height) in VIEWPORTS.items():
                    context = browser.new_context(
                        viewport={"width": width, "height": height},
                        device_scale_factor=1, reduced_motion="reduce",
                    )
                    page = context.new_page()

                    def on_console(message: ConsoleMessage, vp=viewport_name) -> None:
                        if message.type in {"error", "warning"}:
                            console_events.append({"viewport": vp, "type": message.type, "text": message.text[:400]})

                    page.on("console", on_console)
                    page.on("pageerror", lambda error, vp=viewport_name: page_errors.append(f"{vp}: {error}"))
                    page.on(
                        "requestfailed",
                        lambda request, vp=viewport_name: failed_requests.append(
                            {"viewport": vp, "url": request.url[:200], "failure": str(request.failure)}
                        ),
                    )

                    url = f"{args.base_url.rstrip('/')}/#{args.section}"
                    # networkidle never settles against a dev server holding an HMR
                    # socket open, so the wait is on rendered lesson content instead.
                    ready = """() => {
                      const root = document.querySelector('[data-testid="section-root"]');
                      return !!root && (root.textContent || '').trim().length > 500;
                    }"""
                    last_error = None
                    for attempt in range(3):
                        try:
                            page.goto(url, wait_until="load", timeout=60_000)
                            page.wait_for_function(ready, timeout=45_000)
                            last_error = None
                            break
                        except PlaywrightTimeout as error:
                            last_error = error
                            page.wait_for_timeout(2_000)
                    if last_error is not None:
                        raise RuntimeError(
                            f"{viewport_name}: lesson content never rendered at {url} after 3 attempts"
                        ) from last_error

                    # A first visit opens the onboarding tour over the lesson. That is
                    # learner-visible onboarding, so it is captured as its own state
                    # before it is dismissed the way a student would dismiss it.
                    skip = page.locator('[data-testid="tour-skip"]')
                    if skip.count() > 0 and skip.first.is_visible():
                        onboarding = capture_state(page, out_dir, f"{viewport_name}-onboarding-tour")
                        onboarding.update({
                            "viewport": viewport_name, "tab": "onboarding-tour", "url": url,
                            "geometry": page.evaluate(GEOMETRY_PROBE),
                            "answer_boundary": page.evaluate(LEAK_PROBE),
                            "tab_selected": None,
                        })
                        states.append(onboarding)
                        skip.first.click()
                        page.wait_for_selector('[data-slot="dialog-overlay"]', state="detached", timeout=30_000)
                        page.wait_for_timeout(400)

                    for tab in TABS:
                        trigger = page.locator(f'[data-testid="tab-{tab}"]')
                        trigger.first.click()
                        page.wait_for_timeout(400)
                        label = f"{viewport_name}-{tab}"
                        state = capture_state(page, out_dir, label)
                        state["viewport"] = viewport_name
                        state["tab"] = tab
                        state["url"] = url
                        state["geometry"] = page.evaluate(GEOMETRY_PROBE)
                        state["answer_boundary"] = page.evaluate(LEAK_PROBE)
                        state["tab_selected"] = trigger.first.get_attribute("data-state")
                        states.append(state)

                    context.close()
                status = "COMPLETE"
            finally:
                browser.close()
    finally:
        manifest = {
            "schema_version": 1,
            "scope": "curriculum_audit",
            "campaign_id": args.campaign,
            "capture_id": capture_id,
            "status": status,
            "outer_pass": args.outer_pass,
            "phase": args.phase,
            "section_id": args.section,
            "source_git_sha": args.source_sha,
            "base_url": args.base_url,
            "viewports": {name: {"width": w, "height": h} for name, (w, h) in VIEWPORTS.items()},
            "tabs": list(TABS),
            "tile_height": TILE_HEIGHT,
            "tile_overlap": TILE_OVERLAP,
            "started_at": started_at,
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "states": states,
            "console_errors": [e for e in console_events if e["type"] == "error"],
            "console_warnings": [e for e in console_events if e["type"] == "warning"],
            "page_errors": page_errors,
            "failed_requests": failed_requests,
        }
        findings = []
        for state in states:
            where = f"{state['viewport']}/{state['tab']}"
            if state.get("capture_error"):
                findings.append(f"{where}: tile capture aborted — {state['capture_error']}")
            if not state["coverage_complete"]:
                findings.append(f"{where}: incomplete tile coverage ({state.get('coverage_gap')})")
            if state["blank_tiles"]:
                findings.append(f"{where}: blank tiles {state['blank_tiles']}")
            geometry = state["geometry"]
            if geometry["horizontalOverflow"] > 1:
                findings.append(f"{where}: horizontal overflow {geometry['horizontalOverflow']}px")
            if geometry["overflowingElements"]:
                findings.append(f"{where}: {len(geometry['overflowingElements'])} element(s) outside viewport width")
            if geometry["sectionRootText"] == 0:
                findings.append(f"{where}: section root rendered no text")
            if geometry["controlsWithoutAccessibleName"]:
                findings.append(f"{where}: {len(geometry['controlsWithoutAccessibleName'])} control(s) without accessible name")
            if state["answer_boundary"]["visibleAnswerMarkers"]:
                findings.append(f"{where}: answer-key marker visible in rendered text")
            broken = [img for img in geometry["images"] if not img["complete"] or img["naturalWidth"] == 0]
            if broken:
                findings.append(f"{where}: {len(broken)} image(s) failed to load")
            missing_alt = [img for img in geometry["images"] if img["alt"] is None]
            if missing_alt:
                findings.append(f"{where}: {len(missing_alt)} image(s) without alt attribute")
        if page_errors:
            findings.append(f"page errors: {len(page_errors)}")
        if manifest["console_errors"]:
            findings.append(f"console errors: {len(manifest['console_errors'])}")
        manifest["findings"] = findings
        manifest["clean"] = status == "COMPLETE" and not findings
        (out_dir / "forensic_manifest.json").write_text(
            json.dumps(manifest, ensure_ascii=False, indent=2, sort_keys=True) + "\n", encoding="utf-8"
        )

    summary = {
        "capture": str(out_dir.relative_to(ROOT)),
        "status": status,
        "states_captured": len(states),
        "tiles": sum(state["tile_count"] for state in states),
        "clean": manifest["clean"],
        "findings": findings,
    }
    json.dump(summary, sys.stdout, ensure_ascii=False, indent=2)
    sys.stdout.write("\n")
    return 0 if status == "COMPLETE" else 1


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--campaign", required=True)
    parser.add_argument("--pass", dest="outer_pass", type=int, required=True)
    parser.add_argument("--phase", required=True, choices=["before", "after", "live"])
    parser.add_argument("--section", required=True, help="section id, e.g. setup")
    parser.add_argument("--base-url", default="http://localhost:3000")
    parser.add_argument("--source-sha", required=True)
    return run(parser.parse_args())


if __name__ == "__main__":
    raise SystemExit(main())
