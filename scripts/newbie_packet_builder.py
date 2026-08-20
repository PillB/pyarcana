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
from functools import lru_cache
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]


def _decode_string_escape(char: str) -> str:
    """Decode the small JS/TS escape set used by learner-visible course copy."""
    return {"n": "\n", "r": "\r", "t": "\t", "b": "\b", "f": "\f"}.get(char, char)


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
                out.append(_decode_string_escape(text[i + 1]))
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
                out.append(_decode_string_escape(obj[i + 1]))
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
                    out.append(_decode_string_escape(body[i + 1]))
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
    pairs, _ = _balanced_brace_pairs(text)
    objs: list[str] = []
    for m in re.finditer(rf"{re.escape(key)}\s*:\s*\{{", text):
        start = m.end() - 1
        end = pairs.get(start)
        if end is not None:
            objs.append(text[start : end + 1])
    return objs


def _balanced_brace_pairs(text: str) -> tuple[dict[int, int], dict[int, tuple[int, ...]]]:
    """Return object brace pairs and the open-object stack at each position.

    This is a deliberately small TypeScript lexer.  It ignores braces inside
    strings, template literals and comments, which is enough for the section
    data files without evaluating learner content or importing TypeScript.
    """
    pairs: dict[int, int] = {}
    containers: dict[int, tuple[int, ...]] = {}
    stack: list[int] = []
    i = 0
    while i < len(text):
        containers[i] = tuple(stack)
        ch = text[i]
        if ch in ("'", '"', "`"):
            quote = ch
            i += 1
            while i < len(text):
                if text[i] == "\\":
                    i += 2
                    continue
                if text[i] == quote:
                    i += 1
                    break
                i += 1
            continue
        if text.startswith("//", i):
            end = text.find("\n", i + 2)
            i = len(text) if end < 0 else end + 1
            continue
        if text.startswith("/*", i):
            end = text.find("*/", i + 2)
            i = len(text) if end < 0 else end + 2
            continue
        if ch == "{":
            stack.append(i)
        elif ch == "}" and stack:
            start = stack.pop()
            pairs[start] = i
        i += 1
    return pairs, containers


def tagged_objects(text: str, field: str) -> list[str]:
    """Extract the nearest object containing each explicit ``field`` tag."""
    pairs, containers = _balanced_brace_pairs(text)
    out: list[str] = []
    seen: set[int] = set()
    for match in re.finditer(rf"\b{re.escape(field)}\s*:\s*", text):
        starts = containers.get(match.start(), ())
        if not starts:
            continue
        start = starts[-1]
        end = pairs.get(start)
        if end is None or start in seen:
            continue
        seen.add(start)
        out.append(text[start : end + 1])
    return out


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


@lru_cache(maxsize=1)
def parsed_active_sections() -> tuple[dict, ...]:
    sections = [parse_section_learner(path) for path in active_section_files()]
    sections.sort(key=lambda section: section.get("index") or 0)
    return tuple(sections)


def parse_landing() -> dict:
    idx = INDEX_TS.read_text(encoding="utf-8", errors="replace")
    dashboard = DASHBOARD_TSX.read_text(encoding="utf-8", errors="replace")
    page = PAGE_TSX.read_text(encoding="utf-8", errors="replace")
    meta_m = re.search(
        r"export const COURSE_META[^=]*=\s*\{(.*?)\n\}",
        idx,
        re.S,
    )
    meta_body = meta_m.group(1) if meta_m else ""
    title = extract_string_field("{" + meta_body + "}", "title") or "PyArcana"
    subtitle = extract_string_field("{" + meta_body + "}", "subtitle") or ""
    description = extract_string_field("{" + meta_body + "}", "description") or ""

    # Parse the literal copy rendered by Dashboard/Page.  This prevents packet
    # evidence from drifting to a stale hand-written landing summary.
    method_cards = []
    for m in re.finditer(r"<MethodStep\b[^>]*?(?:/>|>)", dashboard, re.S):
        block = m.group(0)
        # Try string-literal title="..." first, then JSX expression title={'...' : '...'}
        title_m = re.search(r'title="([^"]+)"', block)
        if not title_m:
            title_m = re.search(r"title=\{[^?]*?\?[^:]*?'([^']+)'\s*:", block)
        if not title_m:
            title_m = re.search(r"title=\{[^?]*?\?[^:]*?\"([^\"]+)\"\s*:", block)
        desc_m = re.search(r'desc="([^"]+)"', block)
        if not desc_m:
            # desc is often a multi-line ternary; extract the first branch
            desc_m = re.search(r"desc=\{[^?]*?\?\s*'([^']+)'\s*:", block)
        if not desc_m:
            desc_m = re.search(r'desc=\{[^?]*?\?\s*"([^"]+)"\s*:', block)
        if title_m and desc_m:
            method_cards.append({"title": title_m.group(1), "desc": desc_m.group(1)})
    why_cards = [
        {"title": card_title, "desc": desc}
        for card_title, desc in re.findall(
            r"<Feature\b.*?title=\"([^\"]+)\".*?desc=\"([^\"]+)\"",
            dashboard,
            re.S,
        )
    ]

    def literal(pattern: str, source: str) -> str:
        match = re.search(pattern, source, re.S)
        return strip_htmlish(match.group(1)) if match else ""

    public_match = re.search(
        r"<strong>(Edición pública / Public edition:)</strong>(.*?)</div>",
        dashboard,
        re.S,
    )
    public_notice = ""
    if public_match:
        public_notice = strip_htmlish(
            public_match.group(1) + re.sub(r"<[^>]+>", "", public_match.group(2))
        )
    footer_lines = [
        strip_htmlish(value)
        for value in re.findall(r"<p(?:\s+className=\"mt-1\")?>(.*?)</p>", page, re.S)
        if "PyArcana" in value or "interfaz es-PE" in value
    ]
    hero_badge = literal(r"(PyArcana · 52 secciones · Español peruano)", dashboard)
    brand_tagline = literal(r"(El arte de aprender Python)", dashboard)
    curriculum_summary = literal(
        r"(52 secciones · método I Do / We Do / You Do · proyectos de portafolio)",
        dashboard,
    )
    return {
        "title": title,
        "subtitle": subtitle,
        "description": description,
        "hero_badge": hero_badge,
        "brand_tagline": brand_tagline,
        "curriculum_summary": curriculum_summary,
        "public_edition_notice": public_notice,
        "footer_copy": footer_lines,
        "method_cards": method_cards,
        "why_cards": why_cards,
        "brand": "PyArcana",
        "language_truth": {
            "interface_and_lessons_claim": next(
                (line for line in footer_lines if "interfaz es-PE" in line), ""
            ),
            "public_edition_claim": public_notice,
        },
        "source_sha": hashlib.sha256(
            (idx + "\n" + dashboard + "\n" + page).encode()
        ).hexdigest()[:16],
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

    # Exactly the eight explicitly-tagged theory blocks.  The untagged roadmap
    # overview is metadata, not one of the eight taught subtopics.
    theory_blocks = []
    m_theory = re.search(r"\btheory\s*:\s*\[", text)
    m_ido = re.search(r"\biDo\s*:\s*\{", text)
    theory_region = text[m_theory.start() : m_ido.start()] if m_theory and m_ido else text
    for obj in tagged_objects(theory_region, "subtopicId"):
        subtopic_id = extract_string_field(obj, "subtopicId")
        heading = extract_string_field(obj, "heading")
        if not heading:
            continue
        paragraphs = extract_string_array(obj, "paragraphs")
        code_objs = find_object_after(obj, "code")
        demo_code = None
        out = None
        if code_objs:
            demo_code, _, out = extract_code_from_obj(code_objs[0])
        prior_block = next(
            (b for b in theory_blocks if b.get("subtopicId") == subtopic_id), None
        )
        if prior_block is not None:
            # S01 intentionally has separate Python and shell cards for T1-A/B.
            # A learner packet exposes one tagged subtopic contract, while
            # retaining the text/code from both cards in their source order.
            prior_block["heading"] += f" · {heading}"
            prior_block["paragraphs"].extend(paragraphs)
            if demo_code:
                prior_block["code"] = (
                    (prior_block.get("code") or "")
                    + "\n\n# --- tarjeta complementaria del mismo subtema ---\n"
                    + demo_code
                ).strip()
            if out:
                prior_block["code_output"] = (
                    (prior_block.get("code_output") or "") + "\n" + out
                ).strip()
            continue
        theory_blocks.append(
            {
                "subtopicId": subtopic_id,
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
    m_wedo = re.search(r"\bweDo\s*:\s*\{", text)
    if m_ido and m_wedo:
        ido_region = text[m_ido.start() : m_wedo.start()]
    for obj in tagged_objects(ido_region, "demoId"):
        desc = extract_string_field(obj, "description")
        why = extract_string_field(obj, "why")
        demo_id = extract_string_field(obj, "demoId")
        subtopic_id = extract_string_field(obj, "subtopicId")
        environment = extract_string_field(obj, "environment")
        code_objs = find_object_after(obj, "code")
        code = lang = output = None
        if code_objs:
            code, lang, output = extract_code_from_obj(code_objs[0])
        if desc:
            ido_steps.append(
                {
                    "demoId": demo_id,
                    "subtopicId": subtopic_id,
                    "environment": environment,
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
    # Robust exercise parsing: split the weDo region on exercise id: fields
    # that match the S##-T#-[AB]-E# pattern. Each exercise block starts at
    # its id: field and ends at the next id: field (or end of region).
    ex_id_pattern = re.compile(r"\bid\s*:\s*['\"](S\d{2}-T\d-[AB]-E[1-3])['\"]")
    id_matches = list(ex_id_pattern.finditer(wedo_region))
    exercise_pairs, exercise_containers = _balanced_brace_pairs(wedo_region)
    for id_m in id_matches:
        eid = id_m.group(1)
        containers = exercise_containers.get(id_m.start(), ())
        if not containers:
            continue
        block_start = containers[-1]
        block_end = exercise_pairs.get(block_start)
        if block_end is None:
            continue
        block = wedo_region[block_start : block_end + 1]
        instruction = extract_string_field(block, "instruction")
        if not instruction:
            continue
        hint = extract_string_field(block, "hint")
        hints = extract_string_array(block, "hints")
        if not hints and hint:
            hints = [hint]
        kind = extract_string_field(block, "kind")
        tests = extract_string_field(block, "tests")
        preamble = extract_string_field(block, "preamble")
        edge_cases = extract_string_array(block, "edgeCases")
        # Exercise metadata can legitimately exceed 3,000 characters before
        # starterCode (preamble, hints, feedback and retrospectives). Search the
        # complete exercise object so learner packets match the rendered card.
        starter_objs = find_object_after(block, "starterCode")
        starter_code = None
        if starter_objs:
            starter_code, _, _ = extract_code_from_obj(starter_objs[0])
        exercises.append(
            {
                "id": eid,
                "instruction": instruction,
                "preamble": preamble,
                "hints": hints,
                "edgeCases": edge_cases,
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


def active_manifest(section: dict, packet_sha: str | None = None) -> dict:
    """Small, active-section-only contract for packet hand-off/audit."""
    theory_tags = [t.get("subtopicId") for t in section.get("theory") or []]
    demos = (section.get("iDo") or {}).get("steps") or []
    exercises = (section.get("weDo") or {}).get("exercises") or []
    return {
        "index": section.get("index"),
        "id": section.get("id"),
        "source_file": section.get("file"),
        "packet_sha": packet_sha,
        "theory_tags": theory_tags,
        "demo_tags": [d.get("demoId") for d in demos],
        "demo_subtopic_tags": [d.get("subtopicId") for d in demos],
        "exercise_ids": [e.get("id") for e in exercises],
        "selfcheck_count": len(section.get("selfCheck_stems") or []),
        "contract": {"theory": 8, "demos": 8, "exercises": 24},
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


def canonical_packet_sha(packet: dict) -> str:
    """Hash the complete learner-visible packet, excluding only its digest field."""
    hashable = {
        key: value
        for key, value in packet.items()
        if key not in {"packet_sha", "attempt_id"}
    }
    serialized = json.dumps(
        hashable,
        ensure_ascii=False,
        sort_keys=True,
        separators=(",", ":"),
    )
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()


def build_packet(section_index: int, attempt_id: str = "attempt_000") -> dict:
    parsed = list(parsed_active_sections())
    if section_index < 1 or section_index > len(parsed):
        raise ValueError(f"section_index {section_index} out of range 1..{len(parsed)}")

    landing = parse_landing()
    prior = parsed[: section_index - 1]
    active = parsed[section_index - 1]

    # strip internal fields for export
    def public_section(s: dict) -> dict:
        return {k: v for k, v in s.items() if not k.startswith("_")}

    packet = {
        "attempt_id": attempt_id,
        "section_index": section_index,
        "landing": landing,
        "prior_sections": [public_section(s) for s in prior],
        "active": public_section(active),
        "forbidden": (
            "Do not use knowledge outside this packet. "
            "You have only basic tech literacy and zero Python except what appears "
            "in landing + prior_sections + active section theory/demos/instructions/hints/starters. "
            "Solutions and correct answers are not in this packet."
        ),
        "packet_sha": None,
    }
    packet["packet_sha"] = canonical_packet_sha(packet)
    return packet


def build_validator_audit(section_index: int, attempt_id: str = "attempt_000") -> dict:
    """Build validator-only manifest and heuristic scan, never learner input."""
    packet = build_packet(section_index, attempt_id=attempt_id)
    parsed = list(parsed_active_sections())
    active = parsed[section_index - 1]
    prior = parsed[: section_index - 1]
    scan_input = {
        "cumulative_taught_text": "\n".join(
            section.get("_taught_text") or "" for section in prior
        ),
        "active": active,
    }
    return {
        "attempt_id": attempt_id,
        "section_index": section_index,
        "packet_sha": packet["packet_sha"],
        "active_manifest": active_manifest(active, packet["packet_sha"]),
        "heuristic_gaps": gap_scan(scan_input),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--section", type=int, default=None, help="1-based section index")
    ap.add_argument("--all", action="store_true")
    ap.add_argument("--out-dir", type=Path, default=None)
    ap.add_argument(
        "--audit-dir",
        type=Path,
        default=None,
        help="validator-only output; defaults beside --out-dir, never inside packets",
    )
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
    audit_dir = args.audit_dir
    if out_dir and audit_dir is None:
        audit_dir = out_dir.parent / "validator_artifacts"
    if audit_dir:
        audit_dir.mkdir(parents=True, exist_ok=True)

    summaries = []
    audits = []
    for idx in indices:
        pkt = build_packet(idx, attempt_id=args.attempt)
        audit = build_validator_audit(idx, attempt_id=args.attempt)
        audits.append(audit)
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
                "packet_sha": pkt["packet_sha"],
            }
        )
        if out_dir:
            path = out_dir / f"section_{idx:02d}_{pkt['active']['id']}.json"
            path.write_text(json.dumps(pkt, ensure_ascii=False, indent=2), encoding="utf-8")
        elif args.json and not args.all:
            print(json.dumps(pkt, ensure_ascii=False, indent=2))
            return 0

    print(
        json.dumps(
            {
                "sections": len(summaries),
                "summaries": summaries,
                "validator_gap_count": sum(
                    len(audit["heuristic_gaps"]) for audit in audits
                ),
            },
            indent=2,
            ensure_ascii=False,
        )
    )
    if out_dir:
        (out_dir / "INDEX.json").write_text(
            json.dumps(summaries, indent=2, ensure_ascii=False), encoding="utf-8"
        )
    if audit_dir:
        (audit_dir / "VALIDATOR_AUDIT.json").write_text(
            json.dumps(audits, indent=2, ensure_ascii=False), encoding="utf-8"
        )
        (audit_dir / "ACTIVE_MANIFEST.json").write_text(
            json.dumps(
                [audit["active_manifest"] for audit in audits],
                indent=2,
                ensure_ascii=False,
            ),
            encoding="utf-8",
        )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
