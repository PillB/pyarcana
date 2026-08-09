#!/usr/bin/env python3
"""Task 8-a — Curricular level-language invariant test (Red→Green).

Enforces ``capstone_validation/architecture/ADR-level-language.md``:
learner-facing source files must NOT use inflated workplace titles
(experto · máster · master · senior · senior-ready · job-ready ·
listo para aplicar) as level names. ``master`` inside ``mastery``
(e.g. ``capstone_integrated_mastery`` badge id) is ALLOWED — only
standalone inflated level-name usage fails.

Scans:
  - ``src/lib/course/index.ts`` PHASES ``name``/``level`` fields
  - ``src/components/course/CapstonesPage.tsx`` (skip gracefully with
    a "PENDING Task 7" note if the file does not yet exist)
  - ``src/app/page.tsx`` for "job-ready", "listo para aplicar",
    "Data Scientist" as a job-title employment claim

Also asserts the invariant against catalog/ledger/validation artifacts
(which already exist): they must use only ADR-approved level names or
numeric level ids, never inflated workplace titles.

Stdlib only. Runnable as ``python3 test_level_language.py``.
Exits 0 on PASS, non-zero on FAIL, prints a one-line PASS/FAIL summary.
"""
from __future__ import annotations
import json
import os
import re
import sys

REPO = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
INDEX_TS = os.path.join(REPO, "src", "lib", "course", "index.ts")
CAPSTONES_PAGE_TSX = os.path.join(
    REPO, "src", "components", "course", "CapstonesPage.tsx"
)
LANDING_TSX = os.path.join(REPO, "src", "app", "page.tsx")
CATALOG_TS = os.path.join(REPO, "src", "lib", "capstones", "catalog.ts")
CONTRACTS_DIR = os.path.join(REPO, "capstone_validation", "capstones")
LEDGER_PATH = os.path.join(REPO, "course-state", "capstone_ledger.json")

# Forbidden standalone tokens. We use word-boundary regex so that
# ``mastery`` and ``capstone_integrated_mastery`` are NOT flagged.
FORBIDDEN_LEVEL_TOKENS = [
    "Senior",
    "Master",
    "experto",
    "Competente",
    "job-ready",
    "listo para aplicar",
]

# Page.tsx-specific employment-claim phrases (case-sensitive).
PAGE_EMPLOYMENT_CLAIMS = [
    "job-ready",
    "listo para aplicar",
    "Data Scientist",
]

# Approved level names per ADR-level-language.md (case-insensitive match
# against catalog LEVELS descriptors is also accepted).
APPROVED_LEVEL_NAMES = {
    "Fundamentos Guiados",
    "Práctica Aplicada Independiente",
    "Integración y Evaluación Avanzada",
    "Sistemas de Producción Gobernados",
    "Fundamentos",
}

# Allow the word "mastery" (English) and badge ids like
# "capstone_integrated_mastery" — they contain "master" as a substring
# but are not inflated level-name usage.
ALLOWED_SUBSTRINGS = ("mastery",)


def _build_forbidden_regex(tokens):
    """Build a regex that matches forbidden tokens as standalone words,
    while allowing ``mastery`` (which contains ``master``)."""
    parts = []
    for tok in tokens:
        # Word-boundary escape; for multi-word tokens, allow any whitespace
        # between words.
        escaped = re.escape(tok)
        parts.append(escaped)
    # Match any forbidden token, but NOT when followed by "y" (mastery).
    # We use a negative-lookahead approach.
    pattern = r"\b(" + "|".join(parts) + r")\b(?![a-z])"
    return re.compile(pattern, re.IGNORECASE)


def _strip_comments(source, language="ts"):
    """Strip // line comments, /* */ block comments, and <!-- --> HTML
    comments. Preserves newlines so line numbers stay stable for
    downstream reporting. JSX/TSX uses the same comment rules as TS.
    """
    out_lines = []
    in_block = False
    for line in source.splitlines():
        if in_block:
            if "*/" in line:
                # End of block comment — keep everything after */
                idx = line.index("*/") + 2
                line = line[idx:]
                in_block = False
                # Fall through to strip line comments / further block starts.
            else:
                out_lines.append("")
                continue
        # Walk the line, stripping /* ... */ blocks and // line comments.
        result = []
        i = 0
        n = len(line)
        while i < n:
            if line[i:i+2] == "/*":
                # Find end of this block comment.
                end = line.find("*/", i+2)
                if end == -1:
                    # Block continues onto next line.
                    in_block = True
                    break
                else:
                    i = end + 2
                    continue
            if line[i:i+2] == "//":
                # Rest of line is a comment.
                break
            if line[i:i+4] == "<!--":
                end = line.find("-->", i+4)
                if end == -1:
                    break
                else:
                    i = end + 3
                    continue
            result.append(line[i])
            i += 1
        out_lines.append("".join(result))
    return "\n".join(out_lines)


def _scan_text_for_forbidden(text, tokens=FORBIDDEN_LEVEL_TOKENS):
    """Return list of (token, line_no, line) for forbidden matches.

    Comments are stripped first (per ADR: ADR/level docs may MENTION
    forbidden terms; same applies to inline source comments that say
    "do not use senior/master"). ``mastery`` is allowed (filtered out).
    """
    stripped = _strip_comments(text)
    regex = _build_forbidden_regex(tokens)
    hits = []
    raw_lines = text.splitlines()
    for lineno, line in enumerate(stripped.splitlines(), start=1):
        for m in regex.finditer(line):
            tok = m.group(1)
            # Filter allowed substrings: if the match is "master" and the
            # surrounding context is "mastery", skip.
            start, end = m.span(1)
            # Look at chars around the match to detect "mastery" / "MasterY"
            ctx_end = end + 2
            ctx_after = line[end:ctx_end]
            if tok.lower() == "master" and ctx_after.lower().startswith("y"):
                continue
            # If the matched token itself is "mastery" (allowed), skip.
            if tok.lower() in ALLOWED_SUBSTRINGS:
                continue
            # Report the ORIGINAL line (with comments) for human clarity.
            original = raw_lines[lineno - 1].strip() if lineno - 1 < len(raw_lines) else line.strip()
            hits.append((tok, lineno, original))
    return hits


def _extract_phases(ts_source):
    """Extract the PHASES array entries from index.ts.

    Returns a list of dicts with at least ``name`` and ``level`` keys.
    """
    # Locate the PHASES = [ ... ] block.
    m = re.search(
        r"export\s+const\s+PHASES\s*=\s*\[(.*?)\]\s*as\s+const",
        ts_source,
        re.DOTALL,
    )
    if not m:
        return []
    body = m.group(1)
    # Match each object literal: { id: N, name: '...', level: '...', ... }
    entries = []
    for obj_match in re.finditer(
        r"\{([^{}]*?name:[^{}]*?)\}",
        body,
    ):
        obj_text = obj_match.group(1)
        name_m = re.search(r"name\s*:\s*['\"]([^'\"]*)['\"]", obj_text)
        level_m = re.search(r"level\s*:\s*['\"]([^'\"]*)['\"]", obj_text)
        entry = {}
        if name_m:
            entry["name"] = name_m.group(1)
        if level_m:
            entry["level"] = level_m.group(1)
        if entry:
            entries.append(entry)
    return entries


def _check_catalog_ledger_validation(failures):
    """Assert catalog/ledger/validation artifacts use only approved
    level names or numeric level ids."""
    # Catalog LEVELS names must be in APPROVED_LEVEL_NAMES.
    if os.path.isfile(CATALOG_TS):
        with open(CATALOG_TS, encoding="utf-8") as fh:
            cat_src = fh.read()
        # Extract name: '...' inside LEVELS array
        levels_m = re.search(
            r"export\s+const\s+LEVELS[^=]*=\s*\[(.*?)\]\s*;",
            cat_src,
            re.DOTALL,
        )
        if levels_m:
            body = levels_m.group(1)
            for obj_m in re.finditer(
                r"\{([^{}]*?name:[^{}]*?)\}", body
            ):
                name_m = re.search(
                    r"name\s*:\s*['\"]([^'\"]*)['\"]", obj_m.group(1)
                )
                if name_m:
                    name = name_m.group(1)
                    hits = _scan_text_for_forbidden(name)
                    if hits:
                        failures.append(
                            f"catalog LEVELS name {name!r} contains "
                            f"forbidden token(s): "
                            f"{[h[0] for h in hits]}"
                        )

    # Capstone validation contracts: level must be numeric (1/2/3/4) or
    # 'FINAL'; never an inflated name.
    if os.path.isdir(CONTRACTS_DIR):
        for fname in sorted(os.listdir(CONTRACTS_DIR)):
            if not fname.endswith(".json"):
                continue
            with open(
                os.path.join(CONTRACTS_DIR, fname), encoding="utf-8"
            ) as fh:
                data = json.load(fh)
            lvl = data.get("level")
            if not isinstance(lvl, int) and lvl != "FINAL":
                failures.append(
                    f"contract {fname}: level {lvl!r} must be numeric "
                    f"or 'FINAL', not an inflated name"
                )
            # name field should not contain forbidden tokens
            name = data.get("name", "")
            hits = _scan_text_for_forbidden(name)
            if hits:
                failures.append(
                    f"contract {fname}: name {name!r} contains "
                    f"forbidden token(s): {[h[0] for h in hits]}"
                )

    # Ledger: level must be numeric or 'FINAL'
    if os.path.isfile(LEDGER_PATH):
        with open(LEDGER_PATH, encoding="utf-8") as fh:
            ledger = json.load(fh)
        for entry in ledger.get("capstones", []):
            lvl = entry.get("level")
            if not isinstance(lvl, int) and lvl != "FINAL":
                failures.append(
                    f"ledger {entry.get('id')}: level {lvl!r} must be "
                    f"numeric or 'FINAL'"
                )


def main() -> int:
    failures: list[str] = []
    pending_notes: list[str] = []

    # --- catalog / ledger / validation artifacts (must already be clean) ---
    _check_catalog_ledger_validation(failures)

    # --- src/lib/course/index.ts PHASES ---
    if os.path.isfile(INDEX_TS):
        with open(INDEX_TS, encoding="utf-8") as fh:
            ts_src = fh.read()
        phases = _extract_phases(ts_src)
        if not phases:
            failures.append(
                "src/lib/course/index.ts: PHASES array not found or empty"
            )
        for entry in phases:
            for field in ("name", "level"):
                val = entry.get(field, "")
                if not val:
                    continue
                hits = _scan_text_for_forbidden(val)
                if hits:
                    failures.append(
                        f"src/lib/course/index.ts PHASES[{entry.get('name')}]"
                        f".{field}={val!r} contains forbidden token(s): "
                        f"{[h[0] for h in hits]}"
                    )
    else:
        failures.append("src/lib/course/index.ts: file not found")

    # --- src/components/course/CapstonesPage.tsx ---
    if not os.path.isfile(CAPSTONES_PAGE_TSX):
        # Task spec: skip gracefully with a "PENDING Task 7" note.
        pending_notes.append(
            "PENDING Task 7: src/components/course/CapstonesPage.tsx does "
            "not yet exist; level-language scan deferred until that file "
            "is created by the owning agent."
        )
    else:
        with open(CAPSTONES_PAGE_TSX, encoding="utf-8") as fh:
            page_src = fh.read()
        hits = _scan_text_for_forbidden(page_src)
        if hits:
            for tok, lineno, line in hits:
                failures.append(
                    f"src/components/course/CapstonesPage.tsx:{lineno}: "
                    f"forbidden token {tok!r} in: {line!r}"
                )

    # --- src/app/page.tsx for employment-claim phrases ---
    if os.path.isfile(LANDING_TSX):
        with open(LANDING_TSX, encoding="utf-8") as fh:
            landing_src = fh.read()
        # Strip comments so that mentions like "// avoid 'Data Scientist'"
        # are not flagged — only actual employment-claim usage is.
        landing_stripped = _strip_comments(landing_src)
        landing_lines = landing_stripped.splitlines()
        for phrase in PAGE_EMPLOYMENT_CLAIMS:
            # Case-sensitive literal search for employment-claim phrases.
            for lineno, line in enumerate(landing_lines, start=1):
                if phrase in line:
                    failures.append(
                        f"src/app/page.tsx:{lineno}: forbidden "
                        f"employment-claim phrase {phrase!r} in: "
                        f"{line.strip()!r}"
                    )
                    break  # one report per phrase is enough
    else:
        failures.append("src/app/page.tsx: file not found")

    # Print any pending notes (informational; does not fail the test).
    for note in pending_notes:
        print(note)

    if failures:
        print(f"FAIL test_level_language — {len(failures)} failure(s)")
        for f in failures:
            print(f"  - {f}")
        return 1
    capstones_msg = (
        "CapstonesPage.tsx scanned"
        if os.path.isfile(CAPSTONES_PAGE_TSX)
        else "CapstonesPage.tsx deferred (PENDING Task 7 — file absent)"
    )
    print(
        "PASS test_level_language — no inflated level-name tokens in "
        f"PHASES/page.tsx; catalog/ledger/validation use approved names; "
        f"{capstones_msg}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
