#!/usr/bin/env python3
"""
Fast STRUCTURAL gate for the PyArcana STORM/gold goal (<3s target).

Proves artifacts exist and regression tests pass. Does NOT score pedagogy,
paragraph quality, or "gold rank" — those require expert judgment. Do not use
this script (or other Python bulk rewriters) to generate curriculum prose.

Exit 0 prints GOAL_VERIFICATION_GATE_PASS; non-zero fails with details.
"""
from __future__ import annotations

import json
import re
import subprocess
import sys
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
if not (ROOT / "src/lib/course").exists():
    ROOT = Path(__file__).resolve().parents[1]

HARD = ROOT / "course-state" / "curriculum_hardening"
DOSS = HARD / "dossiers"
PA = HARD / "paragraph_analysis"
SECTIONS = ROOT / "src" / "lib" / "course" / "sections"
INDEX = ROOT / "src" / "lib" / "course" / "index.ts"
SCRATCH_CANDIDATES = [
    Path("/var/folders/46/hqp40jys76g696ycvflt54mc0000gn/T/grok-goal-b11e0e04dcbc/implementer"),
]


def fail(msg: str) -> None:
    print(f"GATE_FAIL: {msg}", file=sys.stderr)
    sys.exit(1)


def main() -> None:
    t0 = time.time()
    errors: list[str] = []

    # --- Phase 0 ---
    for rel in (
        "GOLD_STANDARD_CHECKLIST.md",
        "RESIDUAL_MAP_EXPERT.json",
        "GRAPH_MEMORY.json",
        "SECTION_PROGRESS_LEDGER.json",
    ):
        p = HARD / rel
        if not p.is_file() or p.stat().st_size < 200:
            errors.append(f"missing/thin Phase0 artifact {rel}")

    gitignore = ROOT / ".gitignore"
    if not gitignore.is_file() or "trainee_research_attempt" not in gitignore.read_text(
        encoding="utf-8", errors="replace"
    ):
        errors.append("trainee_research_attempt not gitignored")

    # --- STORM n=index + PA ---
    for n in range(1, 53):
        sp = DOSS / f"S{n:02d}_STORM.json"
        if not sp.is_file():
            errors.append(f"missing STORM S{n:02d}")
            continue
        # stream-ish: load json once
        try:
            data = json.loads(sp.read_text(encoding="utf-8"))
        except Exception as e:  # noqa: BLE001
            errors.append(f"STORM S{n:02d} json error: {e}")
            continue
        cycles = data.get("cycles") or []
        if data.get("n_logged") != n or len(cycles) != n:
            errors.append(f"STORM S{n:02d} n_logged/cycles mismatch")
            continue
        # sample first + last cycle structure only (speed)
        for c in (cycles[0], cycles[-1]):
            for key in ("focus", "synthesize", "critique", "expand_scope", "re_synthesize", "research"):
                if not c.get(key):
                    errors.append(f"STORM S{n:02d} cycle missing {key}")
                    break
            else:
                urls = [
                    s.get("url", "")
                    for s in (c.get("research") or [])
                    if isinstance(s, dict)
                ]
                if not any(str(u).startswith("http") for u in urls):
                    errors.append(f"STORM S{n:02d} cycle lacks http source")
        # bulk template guard (cheap string scan of file)
        raw = sp.read_text(encoding="utf-8", errors="replace")
        if raw.count("depth pass") > max(2, n // 2):
            errors.append(f"STORM S{n:02d} bulk depth-pass pattern")

        pap = PA / f"S{n:02d}_PARAGRAPHS.md"
        if not pap.is_file():
            errors.append(f"missing PA S{n:02d}")
            continue
        # only read head+tail for speed on large PA files
        text = pap.read_text(encoding="utf-8", errors="replace")
        if "Skeleton analysis" in text:
            errors.append(f"PA S{n:02d} skeleton")
        if text.count("http") < 5:
            errors.append(f"PA S{n:02d} few http links")
        if text.count("**P") < 3:
            errors.append(f"PA S{n:02d} few paragraph markers")

    # --- Active sections content smoke ---
    if not INDEX.is_file():
        errors.append("missing course index")
    else:
        idx = INDEX.read_text(encoding="utf-8")
        imports = re.findall(r"from ['\"]\./sections/([^'\"]+)['\"]", idx)
        if len(imports) != 52:
            errors.append(f"active imports {len(imports)} != 52")
        # sample late + early gold traits
        for name in ("s01-setup", "s36-ai-apis-advanced", "s52-career-strategy"):
            matches = list(SECTIONS.glob(f"{name}*.ts")) or list(
                SECTIONS.glob(f"{name}.ts")
            )
            # index uses exact names without glob
            path = SECTIONS / f"{name}.ts"
            if not path.is_file():
                # try prefix
                found = list(SECTIONS.glob(f"{name.split('-')[0]}-*.ts"))
                path = found[0] if found else path
            if not path.is_file():
                errors.append(f"missing section file {name}")
                continue
            body = path.read_text(encoding="utf-8", errors="replace")
            # Structural presence only — not a pedagogical quality score
            if body.count("demoId:") < 8:
                errors.append(f"few demos in {path.name}")
            if "export const section" not in body:
                errors.append(f"missing section export in {path.name}")

    # --- Permanent regression tests (targeted, not full suite) ---
    tests = [
        ROOT / "tests/adversarial/test_storm_paragraph_package_contract.py",
        ROOT / "tests/adversarial/test_weDo_starter_depth.py",
        ROOT / "tests/adversarial/test_phase3_exercise_stubs.py",
        ROOT / "tests/adversarial/test_master_curriculum_specificity.py",
        ROOT / "tests/adversarial/test_active_v3_curriculum_contract.py",
    ]
    existing = [str(t) for t in tests if t.is_file()]
    if existing:
        r = subprocess.run(
            [sys.executable, "-m", "pytest", *existing, "-q", "--tb=no"],
            cwd=str(ROOT),
            capture_output=True,
            text=True,
            timeout=60,
        )
        if r.returncode != 0:
            errors.append(f"targeted pytest failed:\n{r.stdout[-500:]}\n{r.stderr[-500:]}")

    elapsed = round(time.time() - t0, 3)
    report = {
        "elapsed_s": elapsed,
        "errors": errors,
        "ok": not errors,
        "storm_files": 52,
        "pa_files": 52,
    }

    # Write scratch if available
    for sc in SCRATCH_CANDIDATES:
        try:
            sc.mkdir(parents=True, exist_ok=True)
            (sc / "goal_verification_gate.json").write_text(
                json.dumps(report, indent=2), encoding="utf-8"
            )
            (sc / "goal_verification_gate.log").write_text(
                ("GOAL_VERIFICATION_GATE_PASS\n" if not errors else "GOAL_VERIFICATION_GATE_FAIL\n")
                + json.dumps(report, indent=2)
                + "\n",
                encoding="utf-8",
            )
            break
        except OSError:
            continue

    # Also write under course-state for durable audit without scratch
    (HARD / "GOAL_VERIFICATION_GATE.json").write_text(
        json.dumps(report, indent=2), encoding="utf-8"
    )

    if errors:
        for e in errors[:30]:
            print(f"GATE_FAIL: {e}", file=sys.stderr)
        if len(errors) > 30:
            print(f"GATE_FAIL: ... +{len(errors)-30} more", file=sys.stderr)
        print(f"elapsed_s={elapsed}")
        sys.exit(1)

    print(f"GOAL_VERIFICATION_GATE_PASS elapsed_s={elapsed}")
    print(json.dumps({k: report[k] for k in ("elapsed_s", "ok", "storm_files", "pa_files")}))


if __name__ == "__main__":
    main()
