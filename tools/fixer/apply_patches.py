#!/usr/bin/env python3
"""Apply codex's anchor/replacement patches to a section file, or refuse to.

Every patch must name an anchor that appears exactly once in the current file.
A patch whose anchor is missing or ambiguous is rejected and its findings stay
open - silently applying it to the wrong place is the one outcome worth avoiding.
After patching, the file must still import cleanly or the whole batch is rolled back.
"""
from __future__ import annotations

import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]


def resolve_slug(name: str) -> str:
    """Accept either the slug ('setup') or the curriculum tag ('S01')."""
    m = re.fullmatch(r"[Ss](\d{1,2})", name.strip())
    if not m:
        return name
    events = ROOT / ".fixer/events.json"
    if events.exists():
        ids = json.loads(events.read_text(encoding="utf-8"))["active_section_ids"]
        n = int(m.group(1))
        if 1 <= n <= len(ids):
            return ids[n - 1]
    return name


def section_file(slug: str) -> Path:
    index = (ROOT / "src/lib/course/index.ts").read_text(encoding="utf-8")
    for m in re.finditer(r"from '\./sections/([^']+)'", index):
        p = ROOT / f"src/lib/course/sections/{m.group(1)}.ts"
        if p.exists() and re.search(rf"""\bid:\s*['"]{re.escape(slug)}['"]""", p.read_text(encoding="utf-8")):
            return p
    raise SystemExit(f"no section file for slug {slug!r}")


def typechecks() -> tuple[bool, str]:
    probe = ROOT / ".fixer/_verify.mts"
    probe.parent.mkdir(parents=True, exist_ok=True)
    probe.write_text(
        "import { COURSE_SECTIONS } from '../src/lib/course/index'\n"
        "if (COURSE_SECTIONS.length !== 52) throw new Error('section count changed')\n"
        "process.stdout.write('ok')\n",
        encoding="utf-8",
    )
    r = subprocess.run(["npx", "tsx", str(probe.relative_to(ROOT))],
                       cwd=ROOT, capture_output=True, text=True)
    return r.returncode == 0, (r.stderr or r.stdout)[-1500:]


def main() -> int:
    result_path = Path(sys.argv[1])
    apply = "--apply" in sys.argv
    data = json.loads(result_path.read_text(encoding="utf-8"))
    slug = resolve_slug(data["section_id"])
    path = section_file(slug)
    original = path.read_text(encoding="utf-8")

    # Did the file move under us while codex was thinking? S44 spent fifteen minutes in a
    # codex call, something else wrote to the section meanwhile, and all fifteen anchors came
    # back "not found" - indistinguishable from codex having quoted badly. The prompt records
    # the digest it was built from, so say which of the two actually happened.
    stamp = result_path.parent / f"{result_path.name.split('.')[0]}.prompt.sha256"
    if stamp.exists():
        was = stamp.read_text(encoding="utf-8").strip()
        now = hashlib.sha256(original.encode("utf-8")).hexdigest()
        if was and was != now:
            print(json.dumps({
                "section": slug,
                "file": str(path.relative_to(ROOT)),
                "patches_offered": len(data.get("patches", [])),
                "applied": 0,
                "rejected": 0,
                "error": "file changed after the prompt was built; every anchor would be stale",
                "expected_sha256": was,
                "actual_sha256": now,
            }, indent=2, ensure_ascii=False))
            return 2

    # A patch may name its own file (adding a figure touches the section and the
    # figure-data module). Everything is still applied or rolled back as one unit.
    buffers: dict[Path, str] = {path: original}
    originals: dict[Path, str] = {path: original}

    def buf(rel: str | None) -> Path:
        if not rel:
            return path
        target = (ROOT / rel).resolve()
        if not str(target).startswith(str(ROOT)):
            raise SystemExit(f"refusing to patch outside the repo: {rel}")
        if target not in buffers:
            if not target.exists():
                raise SystemExit(f"patch names a file that does not exist: {rel}")
            buffers[target] = originals[target] = target.read_text(encoding="utf-8")
        return target

    applied, rejected = [], []
    for i, p in enumerate(data.get("patches", [])):
        anchor, repl = p["anchor"], p["replacement"]
        try:
            target = buf(p.get("file"))
        except SystemExit as e:
            rejected.append({"finding_ids": p.get("finding_ids", []),
                             "field_path": p.get("field_path", ""), "reason": str(e)})
            continue
        text = buffers[target]
        n = text.count(anchor)
        if n == 0:
            rejected.append({**{k: p[k] for k in ("finding_ids", "field_path")},
                             "reason": "anchor not found", "anchor_head": anchor[:120]})
            continue
        if n > 1:
            rejected.append({**{k: p[k] for k in ("finding_ids", "field_path")},
                             "reason": f"anchor matches {n} places", "anchor_head": anchor[:120]})
            continue
        if anchor == repl:
            rejected.append({**{k: p[k] for k in ("finding_ids", "field_path")},
                             "reason": "replacement identical to anchor"})
            continue
        buffers[target] = text.replace(anchor, repl, 1)
        applied.append({"finding_ids": p["finding_ids"], "field_path": p["field_path"],
                        "file": str(target.relative_to(ROOT)),
                        "delta_chars": len(repl) - len(anchor)})

    report = {
        "section": slug,
        "file": str(path.relative_to(ROOT)),
        "patches_offered": len(data.get("patches", [])),
        "applied": len(applied),
        "rejected": len(rejected),
        "rejections": rejected,
        "findings_closed": sorted({f for a in applied for f in a["finding_ids"]}),
        "findings_still_open": sorted({f for r in rejected for f in r.get("finding_ids", [])}),
        "unresolved_questions": data.get("unresolved_questions", []),
        "dry_run": not apply,
    }

    report["files_touched"] = sorted({a["file"] for a in applied})
    if apply and applied:
        for target, content in buffers.items():
            if content != originals[target]:
                target.write_text(content, encoding="utf-8")
        ok, err = typechecks()
        report["typecheck_ok"] = ok
        if not ok:
            for target, content in originals.items():
                target.write_text(content, encoding="utf-8")
            report["rolled_back"] = True
            report["typecheck_error"] = err
            # A rolled-back patch reached the file and was taken away again, so its finding is
            # still open. Reporting it as applied is how S39 lost 32 patches with no record:
            # the runner printed "applied 32", the gate compared an unchanged file to itself
            # and passed, and record_rejections.py only ever reads `rejections`.
            report["rolled_back_patches"] = [
                {**a, "reason": "typecheck failed after apply; whole batch rolled back"}
                for a in applied
            ]
            report["applied"] = 0
            report["findings_closed"] = []
            report["findings_still_open"] = sorted(
                {f for p in (applied + rejected) for f in p.get("finding_ids", [])}
            )
            print(json.dumps(report, indent=2, ensure_ascii=False))
            return 1

    print(json.dumps(report, indent=2, ensure_ascii=False))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
