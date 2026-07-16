#!/usr/bin/env python3
"""
Forensic screenshot + bounding-box extractor for "El Arte de Python" course.

For each section URL passed on the command line (or a default set), it:
  1. Opens the URL at viewport 1280x800 (desktop) and 390x844 (mobile).
  2. Captures (a) full-page screenshot and (b) viewport-only screenshot.
  3. Extracts the boundingBox() of every visible element (text, button, card,
     playground, etc.) along with z-index (when computable from CSS) and a
     short textContent fingerprint.
  4. Dumps everything to JSON for the overlap / out-of-bounds analyzer.

Usage:
    python3 scripts/forensic_screens.py [--out DIR] [URL1 URL2 ...]

If no URLs are passed, a default set of 6 representative sections is used.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any

from playwright.sync_api import sync_playwright

# Default set of representative sections — covers each Phase + each layout variant
DEFAULT_URLS = [
    # Phase 0
    ("setup", "http://localhost:3000/#setup"),
    ("numpy", "http://localhost:3000/#numpy"),
    ("sklearn", "http://localhost:3000/#sklearn"),
    # Phase 1
    ("rag", "http://localhost:3000/#rag"),
    ("fastapi", "http://localhost:3000/#fastapi"),
    # Phase 2
    ("llm-agents", "http://localhost:3000/#llm-agents"),
    # Phase 3
    ("agentic-architecture", "http://localhost:3000/#agentic-architecture"),
]

# Elements we care about for forensic analysis
SELECTOR_WHITELIST = """
h1, h2, h3, h4,
p,
button, a[href],
[role='button'],
[role='tab'],
[role='tablist'],
input, textarea, select,
pre, code,
[data-testid],
.card, [class*='Card'],
[role='dialog'], [role='alertdialog'],
[role='region'], [role='article'], [role='section'],
canvas, svg, img,
[class*='playground'], [class*='Playground'],
[class*='callout'], [class*='Callout'],
[class*='code-block'], [class*='CodeBlock'],
[aria-label], [title]
""".strip()

# Tab sub-steps we want to inspect in each section
SUB_STEPS = ["theory", "ido", "wedo", "youdo", "quiz"]


def extract_element_data(page, url: str, sub_step: str | None, viewport_mode: str) -> dict[str, Any]:
    """Extract bounding-box data for every visible element on the page."""
    # JS that runs in the browser to harvest rects
    js = r"""
    (selectorList) => {
      const results = [];
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const seen = new Set();

      function getZIndex(el) {
        let z = 0;
        let node = el;
        while (node && node !== document.documentElement) {
          const cs = window.getComputedStyle(node);
          if (cs.position !== 'static') {
            const zi = parseInt(cs.zIndex, 10);
            if (!isNaN(zi)) { z = zi; break; }
          }
          node = node.parentElement;
        }
        return z;
      }

      function isVisible(el) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return false;
        const cs = window.getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') return false;
        if (parseFloat(cs.opacity) === 0) return false;
        return true;
      }

      const all = document.querySelectorAll(selectorList);
      all.forEach((el) => {
        if (seen.has(el)) return;
        if (!isVisible(el)) return;
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2) return;

        // Skip elements that are fully outside viewport (clipped ancestors)
        if (r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) {
          // Still record so analyzer can detect overflow, but mark
        }

        const text = (el.textContent || '').trim().slice(0, 80);
        const tag = el.tagName.toLowerCase();
        const id = el.id || '';
        const cls = (el.className && typeof el.className === 'string')
          ? el.className.split(' ').slice(0, 3).join('.')
          : '';
        const role = el.getAttribute('role') || '';
        const ariaLabel = el.getAttribute('aria-label') || '';
        const dataTestId = el.getAttribute('data-testid') || '';

        results.push({
          tag,
          id,
          cls,
          role,
          ariaLabel,
          dataTestId,
          text,
          x: Math.round(r.x * 10) / 10,
          y: Math.round(r.y * 10) / 10,
          w: Math.round(r.width * 10) / 10,
          h: Math.round(r.height * 10) / 10,
          z: getZIndex(el),
          visible: !(r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw),
        });
        seen.add(el);
      });

      return {
        viewport: { w: vw, h: vh },
        scroll: { x: window.scrollX, y: window.scrollY },
        document: {
          w: document.documentElement.scrollWidth,
          h: document.documentElement.scrollHeight,
        },
        elements: results,
      };
    }
    """
    data = page.evaluate(js, SELECTOR_WHITELIST)
    return {
        "url": url,
        "sub_step": sub_step,
        "viewport_mode": viewport_mode,
        "captured_at": time.time(),
        **data,
    }


def capture_section(playwright, url: str, section_id: str, out_dir: Path) -> list[dict[str, Any]]:
    """Capture a section across all 5 sub-step tabs at both desktop and mobile viewports."""
    all_data = []

    # Desktop
    browser = playwright.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1280, "height": 800},
        device_scale_factor=1,
    )
    page = context.new_page()

    # Mobile
    mobile_context = browser.new_context(
        viewport={"width": 390, "height": 844},
        device_scale_factor=2,
    )
    mobile_page = mobile_context.new_page()

    for ctx_label, p in [("desktop", page), ("mobile", mobile_page)]:
        p.goto(url, wait_until="networkidle", timeout=30000)
        p.wait_for_timeout(1500)  # let animations settle

        # Capture default state (theory tab usually)
        fname = f"{section_id}__{ctx_label}__default.png"
        p.screenshot(path=str(out_dir / fname), full_page=False)
        full_fname = f"{section_id}__{ctx_label}__default_full.png"
        p.screenshot(path=str(out_dir / full_fname), full_page=True)

        all_data.append(extract_element_data(p, url, None, ctx_label))

        # Try to click each sub-step tab and capture
        for sub in SUB_STEPS:
            try:
                # Radix tabs use id pattern "radix-...-trigger-<value>"
                tab = p.locator(f'[role="tab"][id$="-trigger-{sub}"]')
                if tab.count() > 0:
                    tab.first.click()
                    p.wait_for_timeout(800)  # animation
                    fname = f"{section_id}__{ctx_label}__{sub}.png"
                    p.screenshot(path=str(out_dir / fname), full_page=False)
                    full_fname = f"{section_id}__{ctx_label}__{sub}_full.png"
                    p.screenshot(path=str(out_dir / full_fname), full_page=True)
                    all_data.append(extract_element_data(p, url, sub, ctx_label))
            except Exception as e:
                print(f"  ! [{section_id}/{ctx_label}/{sub}] {e}", file=sys.stderr)

    browser.close()
    return all_data


def main():
    parser = argparse.ArgumentParser(description="Forensic screenshot + bounding-box extractor")
    parser.add_argument("--out", default="scripts/screenshots", help="Output dir")
    parser.add_argument("--base-url", default="http://localhost:3000", help="Dev server URL")
    parser.add_argument("urls", nargs="*", help="Optional explicit URLs")
    args = parser.parse_args()

    out_dir = Path(args.out)
    out_dir.mkdir(parents=True, exist_ok=True)

    if args.urls:
        urls = [(u.split("=")[0] if "=" in u else u, u) for u in args.urls]
        # If URLs are section ids, prefix with base
        urls = [(sid, f"{args.base_url}/#{sid}" if not sid.startswith("http") else sid)
                for sid, _ in urls]
    else:
        urls = [(sid, f"{args.base_url}/#{sid}") for sid, _ in DEFAULT_URLS]

    all_captures = []
    with sync_playwright() as pw:
        for section_id, url in urls:
            print(f"[*] Capturing {section_id} -> {url}")
            try:
                data = capture_section(pw, url, section_id, out_dir)
                all_captures.extend(data)
            except Exception as e:
                print(f"  !! Failed: {e}", file=sys.stderr)

    # Save consolidated JSON
    json_path = out_dir / "geometry.json"
    with json_path.open("w") as f:
        json.dump(all_captures, f, indent=2)
    print(f"\n[✓] Captured {len(all_captures)} frames")
    print(f"[✓] Geometry JSON: {json_path}")
    print(f"[✓] Screenshots: {out_dir}/")


if __name__ == "__main__":
    main()
