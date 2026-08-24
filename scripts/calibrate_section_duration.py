#!/usr/bin/env python3
"""Derive a section's study time from what the section actually contains.

WHY THIS EXISTS. `estimatedHours` was not measured. It was allocated top-down
from the V3 roadmap -- 240 hours per level across four levels, plus 80 for the
final capstone, totalling 1040 -- and then spread almost evenly, which is why
50 of the 52 sections claim 18 or 19 hours regardless of how much is in them.
S04 has 1,407 words of teaching prose and S01 has 4,946; both claim 18.
Learners report the figures as inflated, and they are right to: the number
describes a curriculum plan, not a reading.

THE MODEL. Each component is priced from published evidence or from a stated
assumption, and every constant is named so it can be argued with:

  prose      Brysbaert (2019), a meta-analysis of 190 studies and 18,573
             participants, puts adult silent reading of non-fiction at 238 wpm
             and technical or academic material at 175-200 wpm. This is
             technical material read by a beginner, in a second language for
             some, so the floor of that range is the honest choice.

  code       Read far slower than prose, and the course explicitly asks the
             learner to predict output before reading it. Priced per block
             rather than per word.

  demo       An I Do step is preamble, code, output, a why and a
             retrospective, with a prediction asked before the reveal.

  exercise   The dominant term, and the widest. Every starter carries a
             deliberate defect the learner must find and fix; two hints exist
             because they are needed. Priced at the middle of a beginner range.

  selfcheck  Multiple choice with distractors written to be plausible.

Run:  python3 scripts/calibrate_section_duration.py            # report
      python3 scripts/calibrate_section_duration.py --write    # apply
"""
from __future__ import annotations

import argparse
import json
import re
import statistics
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS = ROOT / "src/lib/course/sections"
INDEX = ROOT / "src/lib/course/index.ts"

# --- the priced constants, all per-unit minutes unless noted -----------------
WPM_TEACHING = 175          # Brysbaert 2019, technical/academic floor
MIN_PER_CODE_BLOCK = 2.5    # read, predict, compare against the printed output
MIN_PER_DEMO = 6.0          # preamble + code + output + why + retrospective
MIN_PER_EXERCISE = 11.0     # find the seeded defect, fix, match expected output
MIN_PER_SELFCHECK = 1.5     # industry seat-time range for a knowledge check
# The You Do is not another exercise: it is the section's build, assembling the
# subtopics into one working artefact against a starter and a solution.
MIN_PER_YOUDO = 65.0
# Level capstones are NOT priced separately. Each section's You Do already
# builds that level's capstone skeleton -- the sections say so ("esqueleto
# CP-N1-A") -- so a separate capstone term would double-count the same work.
# CP-FINAL is different: it is assembled from twelve finished pieces and
# defended, which is work no section's You Do contains.
MIN_CP_FINAL = 20 * 60.0
# Practice does not run at reading pace: people pause, re-read, and get stuck.
FRICTION = 1.25


def active_sections() -> list[str]:
    return re.findall(r"from '\./sections/([^']+)'", INDEX.read_text(encoding="utf-8"))


def measure(src: str) -> dict:
    words = 0
    for arr in re.findall(r"paragraphs:\s*\[([\s\S]*?)\n\s*\]", src):
        for m in re.finditer(r'"((?:\\.|[^"\\]){20,})"|\'((?:\\.|[^\'\\]){20,})\'', arr):
            words += len((m.group(1) or m.group(2)).split())
    return {
        "words": words,
        "code_blocks": len(re.findall(r"code:\s*\{", src)),
        "demos": len(re.findall(r"demoId:", src)),
        "exercises": len(re.findall(r'\bid:\s*["\']S\d+-T\d+-[A-Z]-E\d+["\']', src)),
        "selfchecks": len(re.findall(r"correctIndex:", src)),
        "youdo": 1 if "youDo:" in src else 0,
        "cp_final": 1 if "CP-FINAL" in src and "defense_notes" in src else 0,
    }


def minutes(m: dict) -> float:
    return (
        m["words"] / WPM_TEACHING
        + m["code_blocks"] * MIN_PER_CODE_BLOCK
        + m["demos"] * MIN_PER_DEMO
        + m["exercises"] * MIN_PER_EXERCISE
        + m["selfchecks"] * MIN_PER_SELFCHECK
        + m["youdo"] * MIN_PER_YOUDO
    ) * FRICTION + m["cp_final"] * MIN_CP_FINAL


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--write", action="store_true", help="apply the computed hours")
    ap.add_argument("--json", default="", help="write the report here")
    args = ap.parse_args()

    rows = []
    for name in active_sections():
        p = SECTIONS / f"{name}.ts"
        src = p.read_text(encoding="utf-8")
        cur = re.search(r"estimatedHours:\s*(\d+)", src)
        m = measure(src)
        mins = minutes(m)
        rows.append(
            {
                "file": p.name,
                "claimed_h": int(cur.group(1)) if cur else None,
                "computed_h": round(mins / 60, 1),
                **m,
            }
        )

    claimed = sum(r["claimed_h"] for r in rows if r["claimed_h"])
    computed = sum(r["computed_h"] for r in rows)
    print(f"{'section':30s} {'claim':>6} {'calc':>6}  {'words':>6} {'ex':>4} {'demo':>5}")
    for r in rows:
        print(f"{r['file']:30s} {r['claimed_h']:>6} {r['computed_h']:>6}  "
              f"{r['words']:>6} {r['exercises']:>4} {r['demos']:>5}")
    print(f"\nclaimed total  {claimed} h")
    print(f"computed total {round(computed)} h   ({round(computed / claimed * 100)}% of the claim)")
    vals = [r["computed_h"] for r in rows]
    print(f"per section: min {min(vals)}  median {statistics.median(vals)}  max {max(vals)}")

    # The exercise term is over half the total, so the whole estimate is really
    # a bet on how long one seeded-defect exercise takes a beginner. Reporting a
    # single number hides that; reporting the band makes the bet arguable.
    def total_at(min_ex: float) -> int:
        out = 0.0
        for r in rows:
            base = (
                r["words"] / WPM_TEACHING
                + r["code_blocks"] * MIN_PER_CODE_BLOCK
                + r["demos"] * MIN_PER_DEMO
                + r["exercises"] * min_ex
                + r["selfchecks"] * MIN_PER_SELFCHECK
                + r["youdo"] * MIN_PER_YOUDO
            ) * FRICTION + r["cp_final"] * MIN_CP_FINAL
            out += base / 60
        return round(out)

    print("\nsensitivity to minutes per exercise (the dominant term):")
    for mx in (7, 11, 15, 20):
        t = total_at(mx)
        print(f"  {mx:>2} min/exercise -> {t:>4} h total   ({round(t / claimed * 100):>3}% of the claim)")

    if args.json:
        Path(args.json).write_text(json.dumps(rows, indent=2), encoding="utf-8")

    if args.write:
        for r in rows:
            p = SECTIONS / r["file"]
            src = p.read_text(encoding="utf-8")
            src = re.sub(r"estimatedHours:\s*\d+", f"estimatedHours: {round(r['computed_h'])}", src, count=1)
            p.write_text(src, encoding="utf-8")
        print("\nwritten.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
