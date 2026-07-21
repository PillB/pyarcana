#!/usr/bin/env python3
"""
Build cumulative learner packets for PyArcana newbie walkthroughs.

Packets include landing (COURSE_META) + sections S01..SN learner-facing content
with solutions / correctIndex / explanations stripped.

Usage:
  python3 scripts/newbie_packet_builder.py --section 1
  python3 scripts/newbie_packet_builder.py --all --out-dir course-state/newbie_walkthrough/packets
  python3 scripts/newbie_packet_builder.py --section 5 --json
"""
from __future__ import annotations

import argparse
import hashlib
import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SECTIONS_DIR = ROOT / "src/lib/course/sections"
INDEX_TS = ROOT / "src/lib/course/index.ts"
PAGE_TSX = ROOT / "src/app/page.tsx"
DASHBOARD_TSX = ROOT / "src/components/course/Dashboard.tsx"


def extract_balanced_template(text: str, start: int) -> str | None:
    if start >= len(text) or text[start] != "`":
        return None
    i = start + 1
    out: list[str] = []
    while i < len(text):
        ch = text[i]
        if ch == "\\":
            if i + 1 < len(text):
                out.append(text[i + 1])
                i += 2
                continue
        if ch == "`":
            return "".join(out)
        out.append(ch)
        i += 1
    return None


def extract_string_field(obj: str, field: str) -> str | None:
    # field: '...' or "..." or `...`
    m = re.search(rf"{re.escape(field)}\s*:\s*", obj)
    if not m:
        return None
    i = m.end()
    while i < len(obj) and obj[i].isspace():
        i += 1
    if i >= len(obj):
        return None
    if obj[i] in ("'", '"'):
        q = obj[i]
        i += 1
        out = []
        while i < len(obj):
            if obj[i] == "\\" and i + 1 < len(obj):
                out.append(obj[i + 1])
                i += 2
                continue
            if obj[i] == q:
                return "".join(out)
            out.append(obj[i])
            i += 1
        return None
    if obj[i] == "`":
        return extract_balanced_template(obj, i)
    return None


def extract_string_array(obj: str, field: str) -> list[str]:
    """Parse TS/JS string arrays, respecting quotes and escapes (handles '""', nested quotes)."""
    m = re.search(rf"{re.escape(field)}\s*:\s*\[", obj)
    if not m:
        return []
    start = m.end() - 1  # points at '['
    depth = 0
    i = start
    body = None
    while i < len(obj):
        ch = obj[i]
        if ch in ("'", '"'):
            q = ch
            i += 1
            while i < len(obj):
                if obj[i] == "\\" and i + 1 < len(obj):
                    i += 2
                    continue
                if obj[i] == q:
                    break
                i += 1
        elif ch == "`":
            j = i + 1
            while j < len(obj):
                if obj[j] == "\\" and j + 1 < len(obj):
                    j += 2
                    continue
                if obj[j] == "`":
                    i = j
                    break
                j += 1
        elif ch == "[":
            depth += 1
        elif ch == "]":
            depth -= 1
            if depth == 0:
                body = obj[start + 1 : i]
                break
        i += 1
    if body is None:
        return []
    items: list[str] = []
    i = 0
    n = len(body)
    while i < n:
        while i < n and body[i] in " \t\r\n,":
            i += 1
        if i >= n:
            break
        if body[i] in ("'", '"'):
            q = body[i]
            i += 1
            out: list[str] = []
            while i < n:
                if body[i] == "\\" and i + 1 < n:
                    out.append(body[i + 1])
                    i += 2
                    continue
                if body[i] == q:
                    i += 1
                    break
                out.append(body[i])
                i += 1
            items.append("".join(out))
        elif body[i] == "`":
            val = extract_balanced_template(body, i)
            if val is None:
                break
            items.append(val)
            # advance past closing backtick
            j = i + 1
            while j < n:
                if body[j] == "\\" and j + 1 < n:
                    j += 2
                    continue
                if body[j] == "`":
                    i = j + 1
                    break
                j += 1
            else:
                break
        else:
            # skip non-string tokens (comments, numbers)
            i += 1
    return items


def find_object_after(text: str, key: str) -> list[str]:
    """Find `{...}` objects after `key:` (used for starterCode/solutionCode)."""
    objs: list[str] = []
    for m in re.finditer(rf"{re.escape(key)}\s*:\s*\{{", text):
        start = m.end() - 1
        depth = 0
        i = start
        while i < len(text):
            ch = text[i]
            if ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    objs.append(text[start : i + 1])
                    break
            elif ch in ("'", '"'):
                q = ch
                i += 1
                while i < len(text):
                    if text[i] == "\\" and i + 1 < len(text):
                        i += 2
                        continue
                    if text[i] == q:
                        break
                    i += 1
            elif ch == "`":
                t = extract_balanced_template(text, i)
                if t is not None:
                    i = i + 1 + len(t)  # approximate; template may differ due to escapes
                    # re-scan from start of template more carefully
                    j = i
                    # fall through — better: skip by finding closing backtick
                # skip template properly
                j = i + 1
                while j < len(text):
                    if text[j] == "\\" and j + 1 < len(text):
                        j += 2
                        continue
                    if text[j] == "`":
                        i = j
                        break
                    j += 1
            i += 1
    return objs


def extract_code_from_obj(obj: str) -> tuple[str | None, str | None, str | None]:
    code = extract_string_field(obj, "code")
    lang = extract_string_field(obj, "language")
    output = extract_string_field(obj, "output")
    return code, lang, output


def active_section_files() -> list[Path]:
    idx = INDEX_TS.read_text(encoding="utf-8", errors="replace")
    stems = re.findall(r"from\s+['\"]\./sections/([^'\"]+)['\"]", idx)
    files = []
    for stem in stems:
        p = SECTIONS_DIR / f"{stem}.ts"
        if p.exists():
            files.append(p)
    return files


def parse_landing() -> dict:
    idx = INDEX_TS.read_text(encoding="utf-8", errors="replace")
    meta_m = re.search(
        r"export const COURSE_META[^=]*=\s*\{(.*?)\n\}",
        idx,
        re.S,
    )
    meta_body = meta_m.group(1) if meta_m else ""
    title = extract_string_field("{" + meta_body + "}", "title") or "PyArcana"
    subtitle = extract_string_field("{" + meta_body + "}", "subtitle") or ""
    description = extract_string_field("{" + meta_body + "}", "description") or ""

    # Static method / why cards from Dashboard (learner-visible copy)
    method_cards = [
        {"title": "Yo hago — Demostración", "desc": "El instructor modela el proceso completo"},
        {"title": "Hacemos juntos — Práctica guiada", "desc": "Resuelves con pistas progresivas"},
        {"title": "Tú haces — Proyecto de portafolio", "desc": "Proyecto autónomo con rúbrica"},
        {"title": "Quiz con feedback inmediato", "desc": "Autoevaluación y examen por sección"},
    ]
    why_cards = [
        {"title": "Alineado al mercado peruano 2025-2026"},
        {"title": "Proyectos que pesan en entrevistas"},
        {"title": "Basado en 4 libros + investigación"},
        {"title": "100% autónomo"},
    ]
    return {
        "title": title,
        "subtitle": subtitle,
        "description": description,
        "method_cards": method_cards,
        "why_cards": why_cards,
        "brand": "PyArcana",
    }


def strip_htmlish(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def parse_section_learner(path: Path) -> dict:
    text = path.read_text(encoding="utf-8", errors="replace")
    sid = extract_string_field(text, "id") or path.stem
    title = extract_string_field(text, "title") or path.stem
    short = extract_string_field(text, "shortTitle") or title
    tagline = extract_string_field(text, "tagline") or ""
    job = extract_string_field(text, "jobRelevance") or ""
    idx_m = re.search(r"\bindex:\s*(\d+)", text)
    index = int(idx_m.group(1)) if idx_m else 0

    # theory blocks: heading + paragraphs (learner text)
    theory_blocks = []
    for m in re.finditer(r"heading:\s*", text):
        # extract nearby object slice ~4k
        chunk = text[m.start() : m.start() + 8000]
        heading = extract_string_field(chunk, "heading")
        if not heading:
            continue
        paragraphs = extract_string_array(chunk, "paragraphs")
        code_objs = find_object_after(chunk[:2000], "code")
        demo_code = None
        if code_objs:
            demo_code, _, out = extract_code_from_obj(code_objs[0])
        theory_blocks.append(
            {
                "heading": heading,
                "paragraphs": paragraphs,
                "code": demo_code,
                "code_output": out if code_objs else None,
            }
        )

    # iDo steps: description, why, code (demo — visible to learner)
    ido_steps = []
    # split iDo region roughly
    ido_region = text
    m_ido = re.search(r"\biDo\s*:\s*\{", text)
    m_wedo = re.search(r"\bweDo\s*:\s*\{", text)
    if m_ido and m_wedo:
        ido_region = text[m_ido.start() : m_wedo.start()]
    for obj in find_object_after(ido_region, "code"):
        code, lang, output = extract_code_from_obj(obj)
        # description/why often siblings — search parent window
        # approximate: look back 1500 chars for description
        pass
    # better: find steps array items with description + code
    for m in re.finditer(r"description:\s*", ido_region):
        chunk = ido_region[m.start() : m.start() + 6000]
        desc = extract_string_field(chunk, "description")
        why = extract_string_field(chunk, "why")
        demo_id = extract_string_field(chunk, "demoId")
        code_objs = find_object_after(chunk[:2500], "code")
        code = lang = output = None
        if code_objs:
            code, lang, output = extract_code_from_obj(code_objs[0])
        if desc:
            ido_steps.append(
                {
                    "demoId": demo_id,
                    "description": desc,
                    "why": why,
                    "code": code,
                    "language": lang,
                    "output": output,  # demos show output — OK for learner
                }
            )

    # weDo exercises WITHOUT solutionCode
    wedo_region = text
    m_youdo = re.search(r"\byouDo\s*:\s*\{", text)
    if m_wedo and m_youdo:
        wedo_region = text[m_wedo.start() : m_youdo.start()]
    exercises = []
    for m in re.finditer(r"\binstruction:\s*", wedo_region):
        # id/kind usually appear *before* instruction in CourseSection objects
        lookback = wedo_region[max(0, m.start() - 500) : m.start()]
        chunk = wedo_region[m.start() : m.start() + 8000]
        instruction = extract_string_field(chunk, "instruction")
        if not instruction:
            continue
        # stop instruction association bleeding into next exercise: cut at next instruction
        nxt = re.search(r"\binstruction\s*:", chunk[20:])
        if nxt:
            chunk = chunk[: 20 + nxt.start()]
        hint = extract_string_field(chunk, "hint")
        hints = extract_string_array(chunk, "hints")
        if not hints and hint:
            hints = [hint]
        # prefer id immediately preceding this instruction
        prev_ids = re.findall(r"\bid\s*:\s*['\"]([^'\"]+)['\"]", lookback)
        eid = prev_ids[-1] if prev_ids else extract_string_field(chunk, "id")
        kinds = re.findall(r"\bkind\s*:\s*['\"]([^'\"]+)['\"]", lookback)
        kind = kinds[-1] if kinds else extract_string_field(chunk, "kind")
        tests = extract_string_field(chunk, "tests")
        starter_objs = find_object_after(chunk[:3000], "starterCode")
        starter_code = None
        if starter_objs:
            starter_code, _, _ = extract_code_from_obj(starter_objs[0])
        exercises.append(
            {
                "id": eid,
                "instruction": instruction,
                "hints": hints,
                "kind": kind,
                "tests": tests,  # test description only, not keys
                "starterCode": starter_code,
                # solutionCode intentionally omitted
            }
        )

    # youDo (portfolio) — full learner view
    youdo = {}
    if m_youdo:
        you_chunk = text[m_youdo.start() : m_youdo.start() + 12000]
        youdo = {
            "title": extract_string_field(you_chunk, "title"),
            "context": extract_string_field(you_chunk, "context"),
            "objectives": extract_string_array(you_chunk, "objectives"),
            "requirements": extract_string_array(you_chunk, "requirements"),
            "portfolioNote": extract_string_field(you_chunk, "portfolioNote"),
            "starterCode": extract_string_field(you_chunk, "starterCode"),
        }

    # selfCheck stems WITHOUT correctIndex / explanation
    selfcheck = []
    for m in re.finditer(r"\bquestion:\s*", text):
        # only within selfCheck roughly
        chunk = text[m.start() : m.start() + 4000]
        q = extract_string_field(chunk, "question")
        if not q:
            continue
        options = extract_string_array(chunk, "options")
        if len(options) < 2:
            continue
        selfcheck.append(
            {
                "question": q,
                "options": options,
                # correctIndex / explanation stripped for newbies
            }
        )

    # learning outcomes
    outcomes = []
    for m in re.finditer(r"learningOutcomes\s*:\s*\[", text):
        arr_start = m.end() - 1
        depth = 0
        i = arr_start
        while i < len(text):
            if text[i] == "[":
                depth += 1
            elif text[i] == "]":
                depth -= 1
                if depth == 0:
                    body = text[arr_start + 1 : i]
                    for tm in re.finditer(r"text:\s*", body):
                        tval = extract_string_field(body[tm.start() :], "text")
                        if tval:
                            outcomes.append(tval)
                    break
            i += 1
        break

    # taught vocabulary: all plain text in theory + ido + instructions (for gap heuristics)
    taught_blob_parts = [
        title,
        tagline,
        job,
        " ".join(outcomes),
    ]
    for tb in theory_blocks:
        taught_blob_parts.append(tb.get("heading") or "")
        taught_blob_parts.extend(tb.get("paragraphs") or [])
        if tb.get("code"):
            taught_blob_parts.append(tb["code"])
    for st in ido_steps:
        taught_blob_parts.append(st.get("description") or "")
        taught_blob_parts.append(st.get("why") or "")
        if st.get("code"):
            taught_blob_parts.append(st["code"])
    for ex in exercises:
        taught_blob_parts.append(ex.get("instruction") or "")
        taught_blob_parts.extend(ex.get("hints") or [])
        if ex.get("starterCode"):
            taught_blob_parts.append(ex["starterCode"])

    taught_text = "\n".join(p for p in taught_blob_parts if p)

    return {
        "file": str(path.relative_to(ROOT)),
        "id": sid,
        "index": index,
        "title": title,
        "shortTitle": short,
        "tagline": tagline,
        "jobRelevance": job,
        "learningOutcomes": outcomes,
        "theory": theory_blocks,
        "iDo": {"steps": ido_steps},
        "weDo": {"exercises": exercises},
        "youDo": youdo,
        "selfCheck_stems": selfcheck,
        "taught_text_sha": hashlib.sha256(taught_text.encode()).hexdigest()[:16],
        "taught_text_len": len(taught_text),
        "_taught_text": taught_text,  # internal for gap scan; may be large
    }


# Tokens that often appear in exercise solutions but must be taught first
IMPORT_RE = re.compile(
    r"^\s*(?:from\s+([\w.]+)\s+import|import\s+([\w.]+))", re.M
)
# Common Python constructs to check exposure
CONSTRUCT_PATTERNS = {
    "list_comprehension": r"\[[^\]]+\sfor\s+\w+\s+in\s+",
    "dict_comprehension": r"\{[^}]+\sfor\s+\w+\s+in\s+",
    "lambda": r"\blambda\b",
    "class_def": r"\bclass\s+\w+",
    "def_def": r"\bdef\s+\w+",
    "try_except": r"\btry\s*:",
    "with_stmt": r"\bwith\s+",
    "async_def": r"\basync\s+def\b",
    "await": r"\bawait\b",
    "f_string": r"f['\"]",
    "type_hint": r"->\s*\w+|:\s*(list|dict|str|int|float|bool|Optional|Any)\b",
    "decorator": r"@\w+",
    "match_case": r"\bmatch\s+\w+",
    "walrus": r":=",
    "pathlib": r"\bPath\b|pathlib",
    "pandas": r"\bpandas\b|\bpd\.",
    "numpy": r"\bnumpy\b|\bnp\.",
    "matplotlib": r"\bmatplotlib\b|\bplt\.",
    "sklearn": r"\bsklearn\b|scikit",
    "fastapi": r"\bFastAPI\b|\bfastapi\b",
    "pytest": r"\bpytest\b|\bassert\b",
}


def extract_imports(code: str) -> set[str]:
    mods = set()
    for m in IMPORT_RE.finditer(code or ""):
        mod = m.group(1) or m.group(2)
        if mod:
            mods.add(mod.split(".")[0])
    return mods


def gap_scan(packet: dict) -> list[dict]:
    """Heuristic: APIs/constructs in active exercises not mentioned in cumulative taught text."""
    gaps = []
    prior_text = packet.get("cumulative_taught_text", "")
    prior_lower = prior_text.lower()
    active = packet["active"]
    # taught in active theory+ido should count as available for exercises after demos
    active_taught = active.get("_taught_text", "")
    # For exercises, knowledge = prior sections + active theory/iDo (not other exercises' solutions)
    available = (
        prior_text
        + "\n"
        + "\n".join(
            [
                *(tb.get("heading") or "" for tb in active.get("theory") or []),
                *sum((tb.get("paragraphs") or [] for tb in active.get("theory") or []), []),
                *(st.get("description") or "" for st in (active.get("iDo") or {}).get("steps") or []),
                *(st.get("why") or "" for st in (active.get("iDo") or {}).get("steps") or []),
                *(st.get("code") or "" for st in (active.get("iDo") or {}).get("steps") or []),
            ]
        )
    )
    avail_lower = available.lower()

    for ex in (active.get("weDo") or {}).get("exercises") or []:
        eid = ex.get("id") or "unknown"
        code = ex.get("starterCode") or ""
        instruction = ex.get("instruction") or ""
        blob = instruction + "\n" + code
        # imports in starter (learner may need them — if in starter they're given)
        starter_imports = extract_imports(code)
        # Check constructs required by instruction that aren't in available text
        for name, pat in CONSTRUCT_PATTERNS.items():
            if re.search(pat, instruction, re.I) and not re.search(pat, available, re.I):
                # instruction mentions construct not in taught material
                gaps.append(
                    {
                        "tag": "UNTAUGHT_CONCEPT",
                        "severity": "P1",
                        "exercise_id": eid,
                        "detail": f"Instruction references {name} not clearly taught in prior+active demos/theory",
                        "section_id": active.get("id"),
                    }
                )
        # imports mentioned in instruction but not taught and not provided in starter
        # Only flag real import directives, not Spanish prose ("from X import Y" patterns
        # in narrative like "plugin ... absoluto (import familiarity_core)").
        for m in re.finditer(
            r"(?:^|[.`\"'\s])(?:import|from)\s+([a-zA-Z_][\w.]*)\s+(?:import\b|as\b|,|$)",
            instruction,
            re.M,
        ):
            mod = m.group(1).split(".")[0]
            # Spanish / non-module words frequently adjacent to "import" in PE prose
            if mod.lower() in {
                "absoluto",
                "relativo",
                "el",
                "la",
                "un",
                "una",
                "tu",
                "su",
                "print",
            }:
                continue
            if mod in starter_imports:
                continue
            if mod.lower() not in avail_lower and mod not in (
                "sys",
                "os",
                "re",
                "json",
                "math",
                "typing",
            ):
                gaps.append(
                    {
                        "tag": "UNTAUGHT_API",
                        "severity": "P1",
                        "exercise_id": eid,
                        "detail": f"Module '{mod}' mentioned in instruction but not found in cumulative taught text",
                        "section_id": active.get("id"),
                        "module": mod,
                    }
                )
        # empty or broken starter markers without instruction clarity
        if code and "____" not in code and "TODO" not in code and "pass" not in code:
            # complete-looking starter — ok
            pass
        if not code and "código" in instruction.lower():
            gaps.append(
                {
                    "tag": "STARTER_BROKEN",
                    "severity": "P1",
                    "exercise_id": eid,
                    "detail": "Exercise asks for code but starterCode missing",
                    "section_id": active.get("id"),
                }
            )

    # self-check: options all empty or <2
    for i, q in enumerate(active.get("selfCheck_stems") or []):
        opts = q.get("options") or []
        if len(opts) < 2:
            gaps.append(
                {
                    "tag": "EXAM_INVALID",
                    "severity": "P0",
                    "exercise_id": f"selfcheck-{i}",
                    "detail": "Self-check has fewer than 2 options",
                    "section_id": active.get("id"),
                }
            )
        # too easy: question substring equals an option exactly and only one long option
        # (soft check)

    return gaps


def build_packet(section_index: int, attempt_id: str = "attempt_000") -> dict:
    files = active_section_files()
    # sort by section index field
    parsed = [parse_section_learner(p) for p in files]
    parsed.sort(key=lambda s: s.get("index") or 0)
    if section_index < 1 or section_index > len(parsed):
        raise ValueError(f"section_index {section_index} out of range 1..{len(parsed)}")

    landing = parse_landing()
    prior = parsed[: section_index - 1]
    active = parsed[section_index - 1]

    # cumulative taught text from prior only (for gap scan of prereqs)
    cum = "\n".join(s.get("_taught_text") or "" for s in prior)

    # strip internal fields for export
    def public_section(s: dict, include_taught: bool = False) -> dict:
        out = {k: v for k, v in s.items() if not k.startswith("_")}
        if include_taught:
            out["_taught_text"] = s.get("_taught_text", "")
        return out

    packet = {
        "attempt_id": attempt_id,
        "section_index": section_index,
        "landing": landing,
        "prior_sections": [public_section(s) for s in prior],
        "active": public_section(active, include_taught=True),
        "cumulative_taught_text": cum,
        "forbidden": (
            "Do not use knowledge outside this packet. "
            "You have only basic tech literacy and zero Python except what appears "
            "in landing + prior_sections + active section theory/demos/instructions/hints/starters. "
            "Solutions and correct answers are not in this packet."
        ),
        "packet_sha": None,
    }
    gaps = gap_scan(packet)
    packet["heuristic_gaps"] = gaps
    # hash without huge cumulative text for stability
    hashable = {
        "section_index": section_index,
        "landing": landing,
        "prior_ids": [s["id"] for s in prior],
        "active_id": active["id"],
        "active_taught_sha": active.get("taught_text_sha"),
        "exercise_ids": [e.get("id") for e in (active.get("weDo") or {}).get("exercises") or []],
        "n_selfcheck": len(active.get("selfCheck_stems") or []),
    }
    packet["packet_sha"] = hashlib.sha256(
        json.dumps(hashable, sort_keys=True).encode()
    ).hexdigest()[:16]
    return packet


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", type=int, default=None, help="1-based section index")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--out-dir", type=Path, default=None)
    ap.add_argument("--attempt", default="attempt_000")
    ap.add_argument("--json", action="store_true")
    ap.add_argument("--strip-taught-export", action="store_true", help="omit large _taught_text in JSON")
    args = ap.parse_args()

    if not args.all and args.section is None:
        ap.error("need --section N or --all")

    indices = list(range(1, 53)) if args.all else [args.section]
    out_dir = args.out_dir
    if out_dir:
        out_dir.mkdir(parents=True, exist_ok=True)

    summaries = []
    for idx in indices:
        pkt = build_packet(idx, attempt_id=args.attempt)
        if args.strip_taught_export:
            pkt["active"].pop("_taught_text", None)
            pkt.pop("cumulative_taught_text", None)
        summaries.append(
            {
                "section_index": idx,
                "id": pkt["active"]["id"],
                "title": pkt["active"]["title"],
                "n_exercises": len((pkt["active"].get("weDo") or {}).get("exercises") or []),
                "n_selfcheck": len(pkt["active"].get("selfCheck_stems") or []),
                "n_theory": len(pkt["active"].get("theory") or []),
                "n_ido": len((pkt["active"].get("iDo") or {}).get("steps") or []),
                "heuristic_gaps": len(pkt.get("heuristic_gaps") or []),
                "packet_sha": pkt["packet_sha"],
            }
        )
        if out_dir:
            path = out_dir / f"section_{idx:02d}_{pkt['active']['id']}.json"
            # write lean packet for agents (no cumulative blob by default)
            lean = dict(pkt)
            lean.pop("cumulative_taught_text", None)
            if lean.get("active"):
                lean["active"] = {
                    k: v for k, v in lean["active"].items() if k != "_taught_text"
                }
            path.write_text(json.dumps(lean, ensure_ascii=False, indent=2), encoding="utf-8")
        elif args.json and not args.all:
            lean = dict(pkt)
            lean.pop("cumulative_taught_text", None)
            if lean.get("active"):
                lean["active"] = {
                    k: v for k, v in lean["active"].items() if k != "_taught_text"
                }
            print(json.dumps(lean, ensure_ascii=False, indent=2))
            return 0

    print(json.dumps({"sections": len(summaries), "summaries": summaries}, indent=2, ensure_ascii=False))
    if out_dir:
        (out_dir / "INDEX.json").write_text(
            json.dumps(summaries, indent=2, ensure_ascii=False), encoding="utf-8"
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
